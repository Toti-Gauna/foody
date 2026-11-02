'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Trophy } from 'lucide-react';
import type { Room } from '../useRoom';
import type { Wire } from '../transport';
import { GOAL_W, H, PADDLE_R, PUCK_R, W, WIN, botTarget, clampPaddle, fromGuestView, initial, step, type HockeyState, type Vec } from './physics';

/** What travels to the guest 30 times a second: numbers rounded to the millimetre of the table. */
type Snap = { p: [number, number]; a: [number, number]; b: [number, number]; s: [number, number]; ph: HockeyState['phase']; l: 0 | 1 | null };
const r3 = (n: number) => Math.round(n * 1000) / 1000;
const snap = (s: HockeyState): Snap => ({ p: [r3(s.puck.x), r3(s.puck.y)], a: [r3(s.a.x), r3(s.a.y)], b: [r3(s.b.x), r3(s.b.y)], s: s.score, ph: s.phase, l: s.last });

/**
 * Hockey, one on one (new; Ignacio asked for it with Dibujá y adiviná for the 75 plan). The host's phone runs the table;
 * the other phone sends where its finger is and draws what comes back. Alone, you play against Gus (`bot`).
 * Each player sees their paddle at the bottom. It is one on one: the first guest plays, anyone else in the room watches.
 */
export function Hockey({ room, bot = false }: { room: Room | null; bot?: boolean }) {
  const t = useTranslations('lucero.mesa.hockey');
  const host = bot || !!room?.isHost;
  // The rival is the first guest; later ones watch the host's view. `send` and `subscribe` are stable, `room` is not.
  const rival = room?.players.find((p) => !p.host)?.id ?? '';
  const playing = host || (!!room && room.me === rival);
  const send = room?.send;
  const subscribe = room?.subscribe;
  const rivalRef = useRef(rival);
  useEffect(() => {
    rivalRef.current = rival;
  }, [rival]);
  const canvas = useRef<HTMLCanvasElement>(null);
  const target = useRef<Vec>({ x: W / 2, y: H - 0.2 });
  const remote = useRef<Vec>({ x: W / 2, y: 0.2 });
  const shown = useRef<Snap>(snap(initial()));
  const [hud, setHud] = useState<{ s: [number, number]; ph: HockeyState['phase']; l: 0 | 1 | null }>({ s: [0, 0], ph: 'play', l: null });
  const [round, setRound] = useState(0);

  // Host: simulate. Guest: listen.
  useEffect(() => {
    let raf = 0;
    let state = initial();
    let last = performance.now();
    let sentAt = 0;
    const trail: [number, number][] = [];
    // Each paddle starts in front of its own goal (the guest's is at the top of the table).
    target.current = host ? { x: W / 2, y: H - 0.2 } : { x: W / 2, y: 0.2 };
    remote.current = { x: W / 2, y: 0.2 };
    const off = subscribe?.((msg: Wire) => {
      const p = msg.payload as Record<string, unknown>;
      if (host && msg.type === 'input' && msg.from === rivalRef.current) remote.current = fromGuestView({ x: Number(p.x) || 0, y: Number(p.y) || 0 });
      if (!host && msg.type === 'state') shown.current = p as unknown as Snap;
      if (!host && msg.type === 'restart') setRound((n) => n + 1);
    });
    const frame = (now: number) => {
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;
      if (host) {
        const b = bot ? clampPaddle(botTarget(state), false) : remote.current;
        state = step(state, dt, target.current, b);
        shown.current = snap(state);
        if (send && now - sentAt > 33) {
          sentAt = now;
          send('state', shown.current);
        }
      } else if (send && playing && now - sentAt > 33) {
        sentAt = now;
        // Our finger, in our own (turned) view.
        send('input', { x: r3(W - target.current.x), y: r3(H - target.current.y) });
      }
      const sh = shown.current;
      setHud((cur) => (cur.s[0] !== sh.s[0] || cur.s[1] !== sh.s[1] || cur.ph !== sh.ph ? { s: sh.s, ph: sh.ph, l: sh.l } : cur));
      trail.push([sh.p[0], sh.p[1]]);
      if (trail.length > 10) trail.shift();
      if (sh.ph !== 'play') trail.length = 0;
      paint(canvas.current, sh, !host && playing, trail, now);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      off?.();
    };
  }, [send, subscribe, host, playing, bot, round]);

  const onPointer = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!playing) return;
    const r = e.currentTarget.getBoundingClientRect();
    // Canvas shows the table from this player's end: bottom = own goal. Host's view is the table as is.
    const x = ((e.clientX - r.left) / r.width) * W;
    const y = ((e.clientY - r.top) / r.height) * H;
    target.current = host ? { x, y: y - 0.06 } : { x: W - x, y: H - (y - 0.06) };
  };

  const mine = host || !playing ? hud.s[0] : hud.s[1];
  const theirs = host || !playing ? hud.s[1] : hud.s[0];
  const won = hud.ph === 'end' ? mine > theirs : null;
  const nameOf = (ofHost: boolean) => room?.players.find((p) => p.host === ofHost && (ofHost || p.id === rival))?.name ?? '…';

  const mineName = playing ? t('you') : nameOf(true);
  const theirsName = bot ? t('gus') : playing ? t('rival') : nameOf(false);
  // My paddle is always the one at the bottom: the host's is «a», the guest's is «b».
  const mineSide = host || !playing ? 'a' : 'b';
  const pips = (n: number) => Array.from({ length: WIN }, (_, i) => <i key={i} data-on={i < n || undefined} />);

  return (
    <div className="hk">
      <div className="hk-board" aria-live="polite">
        <p className="hk-side" data-paddle={mineSide}>
          <span className="hk-who">
            <span aria-hidden className="hk-dot" />
            {mineName}
          </span>
          <b className="hk-n">{mine}</b>
          <span aria-hidden className="hk-pips">
            {pips(mine)}
          </span>
        </p>
        <span className="hk-to">{t('to', { n: WIN })}</span>
        <p className="hk-side" data-paddle={mineSide === 'a' ? 'b' : 'a'} data-right>
          <span className="hk-who">
            <span aria-hidden className="hk-dot" />
            {theirsName}
          </span>
          <b className="hk-n">{theirs}</b>
          <span aria-hidden className="hk-pips">
            {pips(theirs)}
          </span>
        </p>
      </div>
      <div className="hk-area">
        <div className="hk-table">
          <canvas
            ref={canvas}
            className="hk-canvas"
            role="img"
            aria-label={t('tableLabel')}
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              onPointer(e);
            }}
            onPointerMove={onPointer}
          />
          {hud.ph === 'goal' ? (
            <p key={`${hud.s[0]}-${hud.s[1]}`} className="hk-goal" data-mine={(!playing ? null : (hud.l === 0) === host) || undefined}>
              {!playing ? t('goal') : (hud.l === 0) === host ? t('goalYou') : t('goalThem')}
            </p>
          ) : null}
          {hud.ph === 'end' ? (
            <div className="hk-end" role="status" data-won={won || undefined}>
              <span className="hk-trophy" aria-hidden>
                <Trophy className="size-9" />
              </span>
              <p className="hk-end-title">{!playing ? t('wins', { name: nameOf(mine > theirs) }) : won ? t('won') : t('lost')}</p>
              <p className="hk-end-score">
                {mine} – {theirs}
              </p>
              {host ? (
                <button
                  type="button"
                  className="lc-btn lc-btn-main"
                  onClick={() => {
                    send?.('restart', {});
                    setRound((n) => n + 1);
                  }}
                >
                  {t('again')}
                </button>
              ) : (
                <p className="ms-wait">{t('waitAgain')}</p>
              )}
            </div>
          ) : null}
        </div>
      </div>
      <p className="hk-help">{playing ? t('help') : t('watching')}</p>
    </div>
  );
}

/** The table's colours, read once per canvas from the venue's (and the season's) tokens. */
type Colors = { table: string; table2: string; line: string; rail: string; a: string; aRing: string; b: string; bRing: string; puck: string; glow: string };
const colorCache = new WeakMap<HTMLCanvasElement, Colors>();
function colorsOf(el: HTMLCanvasElement): Colors {
  const hit = colorCache.get(el);
  if (hit) return hit;
  const cs = getComputedStyle(el);
  const v = (name: string, fallback: string) => cs.getPropertyValue(name).trim() || fallback;
  const c = {
    table: v('--l-surface-2', '#2e1e21'),
    table2: v('--l-bg-2', '#140d0f'),
    line: v('--l-ink', '#f3e6d0'),
    rail: v('--l-amber', '#f5b942'),
    a: v('--l-wine-hi', '#c94a63'),
    aRing: v('--l-amber', '#f5b942'),
    b: v('--l-paper', '#f6edda'),
    bRing: v('--l-wine', '#b23a52'),
    puck: v('--l-bg-2', '#120b0c'),
    glow: v('--l-amber', '#f5b942'),
  };
  colorCache.set(el, c);
  return c;
}

function paint(el: HTMLCanvasElement | null, s: Snap, flip: boolean, trail: [number, number][], now: number) {
  if (!el) return;
  const dpr = window.devicePixelRatio || 1;
  const cw = el.clientWidth;
  const ch = el.clientHeight;
  if (!cw || !ch) return;
  if (el.width !== Math.round(cw * dpr) || el.height !== Math.round(ch * dpr)) {
    el.width = Math.round(cw * dpr);
    el.height = Math.round(ch * dpr);
    colorCache.delete(el);
  }
  const c = colorsOf(el);
  const k = cw / W;
  const ctx = el.getContext('2d')!;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  // Turn the table for the guest, so their paddle is at the bottom.
  if (flip) {
    ctx.translate(cw, ch);
    ctx.rotate(Math.PI);
  }
  // The surface: a lit centre fading to the rails.
  const bg = ctx.createRadialGradient(cw / 2, ch / 2, 0, cw / 2, ch / 2, ch * 0.7);
  bg.addColorStop(0, c.table);
  bg.addColorStop(1, c.table2);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, cw, ch);
  // Air holes.
  ctx.fillStyle = withAlpha(c.line, 0.06);
  const step = Math.max(14, cw / 18);
  for (let y = step / 2; y < ch; y += step) for (let x = step / 2; x < cw; x += step) ctx.fillRect(x, y, 1.6, 1.6);
  // Markings, glowing a little.
  ctx.save();
  ctx.shadowColor = c.glow;
  ctx.shadowBlur = 10;
  ctx.strokeStyle = withAlpha(c.line, 0.35);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, (H / 2) * k);
  ctx.lineTo(cw, (H / 2) * k);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc((W / 2) * k, (H / 2) * k, 0.16 * k, 0, Math.PI * 2);
  ctx.stroke();
  // Goal creases.
  ctx.strokeStyle = withAlpha(c.rail, 0.45);
  ctx.beginPath();
  ctx.arc((W / 2) * k, 0, (GOAL_W / 2 + 0.05) * k, 0, Math.PI);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc((W / 2) * k, ch, (GOAL_W / 2 + 0.05) * k, Math.PI, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
  // Goals: glowing mouths.
  ctx.save();
  ctx.shadowColor = c.rail;
  ctx.shadowBlur = 18;
  ctx.fillStyle = c.rail;
  const gx = ((W - GOAL_W) / 2) * k;
  ctx.fillRect(gx, 0, GOAL_W * k, 5);
  ctx.fillRect(gx, ch - 5, GOAL_W * k, 5);
  ctx.restore();
  // A goal lights the table for a moment.
  if (s.ph === 'goal') {
    const pulse = 0.18 + 0.12 * Math.sin(now / 90);
    ctx.fillStyle = withAlpha(c.rail, pulse);
    ctx.fillRect(0, 0, cw, ch);
  }
  // The puck's trail.
  trail.forEach(([x, y], i) => {
    ctx.beginPath();
    ctx.arc(x * k, y * k, PUCK_R * k * (0.4 + (i / trail.length) * 0.6), 0, Math.PI * 2);
    ctx.fillStyle = withAlpha(c.glow, (i / trail.length) * 0.22);
    ctx.fill();
  });
  const paddle = (x: number, y: number, fill: string, ring: string) => {
    const px = x * k;
    const py = y * k;
    const r = PADDLE_R * k;
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.55)';
    ctx.shadowBlur = 14;
    ctx.shadowOffsetY = 6;
    const g = ctx.createRadialGradient(px - r * 0.3, py - r * 0.35, 0, px, py, r);
    g.addColorStop(0, fill);
    g.addColorStop(1, withAlpha('#000000', 0.25));
    ctx.beginPath();
    ctx.arc(px, py, r, 0, Math.PI * 2);
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.restore();
    ctx.beginPath();
    ctx.arc(px, py, r, 0, Math.PI * 2);
    ctx.fillStyle = g;
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = ring;
    ctx.beginPath();
    ctx.arc(px, py, r - 1.5, 0, Math.PI * 2);
    ctx.stroke();
    // The knob: a raised ring in the middle.
    ctx.beginPath();
    ctx.arc(px, py, r * 0.45, 0, Math.PI * 2);
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = ring;
    ctx.stroke();
  };
  paddle(s.a[0], s.a[1], c.a, c.aRing);
  paddle(s.b[0], s.b[1], c.b, c.bRing);
  // The puck.
  ctx.save();
  ctx.shadowColor = c.glow;
  ctx.shadowBlur = 16;
  ctx.beginPath();
  ctx.arc(s.p[0] * k, s.p[1] * k, PUCK_R * k, 0, Math.PI * 2);
  ctx.fillStyle = c.puck;
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = c.glow;
  ctx.stroke();
  ctx.restore();
}

/** `#rrggbb` (or any CSS colour the canvas understands) with an alpha. */
function withAlpha(color: string, a: number) {
  const m = color.match(/^#([0-9a-f]{6})$/i);
  if (!m) return color;
  const n = parseInt(m[1], 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}
