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
 * Each player sees their paddle at the bottom.
 */
export function Hockey({ room, bot = false }: { room: Room | null; bot?: boolean }) {
  const t = useTranslations('lucero.mesa.hockey');
  const host = bot || !!room?.isHost;
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
    target.current = { x: W / 2, y: H - 0.2 };
    const off = room?.subscribe((msg: Wire) => {
      const p = msg.payload as Record<string, unknown>;
      if (host && msg.type === 'input') remote.current = fromGuestView({ x: Number(p.x) || 0, y: Number(p.y) || 0 });
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
        if (room && now - sentAt > 33) {
          sentAt = now;
          room.send('state', shown.current);
        }
      } else if (room && now - sentAt > 33) {
        sentAt = now;
        // Our finger, in our own (turned) view.
        room.send('input', { x: r3(W - target.current.x), y: r3(H - target.current.y) });
      }
      const sh = shown.current;
      setHud((cur) => (cur.s[0] !== sh.s[0] || cur.s[1] !== sh.s[1] || cur.ph !== sh.ph ? { s: sh.s, ph: sh.ph, l: sh.l } : cur));
      paint(canvas.current, sh, !host);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      off?.();
    };
  }, [room, host, bot, round]);

  const onPointer = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    // Canvas shows the table from this player's end: bottom = own goal. Host's view is the table as is.
    const x = ((e.clientX - r.left) / r.width) * W;
    const y = ((e.clientY - r.top) / r.height) * H;
    target.current = host ? { x, y: y - 0.06 } : { x: W - x, y: H - (y - 0.06) };
  };

  const mine = host ? hud.s[0] : hud.s[1];
  const theirs = host ? hud.s[1] : hud.s[0];
  const won = hud.ph === 'end' ? mine > theirs : null;

  return (
    <div className="hk">
      <p className="hk-score" aria-live="polite">
        <span>
          {t('you')} <b>{mine}</b>
        </span>
        <span className="hk-to">{t('to', { n: WIN })}</span>
        <span>
          <b>{theirs}</b> {bot ? t('gus') : t('rival')}
        </span>
      </p>
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
        {hud.ph === 'goal' ? <p className="hk-goal">{(hud.l === 0) === host ? t('goalYou') : t('goalThem')}</p> : null}
        {hud.ph === 'end' ? (
          <div className="hk-end" role="status">
            <Trophy aria-hidden className="size-8" />
            <p className="gl-title">{won ? t('won') : t('lost')}</p>
            {host ? (
              <button
                type="button"
                className="lc-btn lc-btn-main"
                onClick={() => {
                  room?.send('restart', {});
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
      <p className="hk-help">{t('help')}</p>
    </div>
  );
}

function paint(el: HTMLCanvasElement | null, s: Snap, flip: boolean) {
  if (!el) return;
  const dpr = window.devicePixelRatio || 1;
  const cw = el.clientWidth;
  const ch = el.clientHeight;
  if (el.width !== Math.round(cw * dpr) || el.height !== Math.round(ch * dpr)) {
    el.width = Math.round(cw * dpr);
    el.height = Math.round(ch * dpr);
  }
  const k = cw / W;
  const ctx = el.getContext('2d')!;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  // Turn the table for the guest, so their paddle is at the bottom.
  if (flip) {
    ctx.translate(cw, ch);
    ctx.rotate(Math.PI);
  }
  ctx.fillStyle = '#3a1620';
  ctx.fillRect(0, 0, cw, ch);
  ctx.strokeStyle = 'rgba(243,230,208,0.25)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, (H / 2) * k);
  ctx.lineTo(cw, (H / 2) * k);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc((W / 2) * k, (H / 2) * k, 0.14 * k, 0, Math.PI * 2);
  ctx.stroke();
  // Goals.
  ctx.fillStyle = '#f5b942';
  ctx.fillRect(((W - GOAL_W) / 2) * k, 0, GOAL_W * k, 6);
  ctx.fillRect(((W - GOAL_W) / 2) * k, ch - 6, GOAL_W * k, 6);
  const disc = (x: number, y: number, r: number, fill: string, ring: string) => {
    ctx.beginPath();
    ctx.arc(x * k, y * k, r * k, 0, Math.PI * 2);
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = ring;
    ctx.stroke();
  };
  disc(s.a[0], s.a[1], PADDLE_R, '#d9783a', '#ffe0be');
  disc(s.b[0], s.b[1], PADDLE_R, '#f3e6d0', '#b23a52');
  disc(s.p[0], s.p[1], PUCK_R, '#120b0c', '#f5b942');
}
