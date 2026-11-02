'use client';

import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { Eraser, Send, Trophy, Undo2 } from 'lucide-react';
import type { Room } from '../useRoom';
import type { Wire } from '../transport';
import { COLORS, SIZES, type Lang, type Stroke } from './logic';
import { DibujoEngine, type Pub, type Secret } from './engine';

/**
 * «Dibujá y adiviná» on phones (Ignacio, 02/11/2026). Whoever draws keeps the canvas with the colours; everyone else sees
 * the drawing as it happens, the word filling in at the very top and an input at the very bottom to guess. The host's
 * phone runs the referee (DibujoEngine) and relays the strokes.
 */
export function Dibujo({ room, lang }: { room: Room; lang: Lang }) {
  const t = useTranslations('lucero.mesa.dibujo');
  const [pub, setPub] = useState<{ s: Pub; at: number } | null>(null);
  const [secret, setSecret] = useState<Secret | null>(null);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const engine = useRef<DibujoEngine | null>(null);
  const me = room.me;

  const upsert = useCallback((s: Stroke) => setStrokes((cur) => (cur.some((x) => x.id === s.id) ? cur.map((x) => (x.id === s.id ? s : x)) : [...cur, s])), []);

  // Host: the referee lives here; what it says goes to every phone and to this one.
  useEffect(() => {
    if (!room.isHost) return;
    const e = new DibujoEngine(lang, (type, payload) => {
      room.send(type, payload);
      if (type === 'state') setPub({ s: payload as Pub, at: Date.now() });
      else if (type === 'secret') setSecret((payload as Secret).to === room.me ? (payload as Secret) : null);
      else if (type === 'strokes') setStrokes(payload as Stroke[]);
    });
    engine.current = e;
    e.start(room.players.map((p) => ({ id: p.id, name: p.name })));
    const tick = window.setInterval(() => e.tick(), 250);
    const off = room.subscribe((msg: Wire) => {
      const p = msg.payload as Record<string, unknown>;
      if (msg.type === 'pick') e.pick(msg.from, String(p.word ?? ''));
      else if (msg.type === 'guess') e.guess(msg.from, String(p.text ?? ''));
      else if (msg.type === 'stroke') {
        e.stroke(msg.from, p as unknown as Stroke);
        if (msg.from === e.drawer) {
          room.send('stroke', p);
          upsert(p as unknown as Stroke);
        }
      } else if (msg.type === 'clear') e.clear(msg.from);
      else if (msg.type === 'undo') e.undo(msg.from);
      else if (msg.type === 'sync') room.send('strokes', e.allStrokes());
    });
    return () => {
      window.clearInterval(tick);
      off();
      engine.current = null;
    };
    // The referee is created once per game; players are kept in step below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room.isHost]);

  useEffect(() => {
    engine.current?.setPlayers(room.players.map((p) => ({ id: p.id, name: p.name })));
  }, [room.players]);

  // Guests: follow the host.
  useEffect(() => {
    if (room.isHost) return;
    const off = room.subscribe((msg: Wire) => {
      if (msg.type === 'state') setPub({ s: msg.payload as Pub, at: Date.now() });
      else if (msg.type === 'secret') {
        const s = msg.payload as Secret;
        setSecret(s.to === me ? s : null);
      } else if (msg.type === 'strokes') setStrokes(msg.payload as Stroke[]);
      else if (msg.type === 'stroke') upsert(msg.payload as Stroke);
    });
    room.send('sync', {});
    return off;
  }, [room, me, upsert]);

  // A clock that re-renders the timer.
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(id);
  }, []);

  const act = (type: 'pick' | 'guess' | 'clear' | 'undo', payload: Record<string, unknown> = {}) => {
    if (room.isHost && engine.current) {
      if (type === 'pick') engine.current.pick(me, String(payload.word));
      else if (type === 'guess') engine.current.guess(me, String(payload.text));
      else if (type === 'clear') engine.current.clear(me);
      else engine.current.undo(me);
    } else room.send(type, payload);
  };
  const draw = (s: Stroke) => {
    upsert(s);
    if (room.isHost && engine.current) {
      engine.current.stroke(me, s);
      room.send('stroke', s);
    } else room.send('stroke', s);
  };

  if (!pub) return <p className="ms-wait">{t('starting')}</p>;
  const s = pub.s;
  const left = Math.max(0, Math.ceil((s.left - (now - pub.at)) / 1000));
  const drawing = s.drawer === me;
  const drawerName = s.names[s.drawer] ?? '…';

  if (s.phase === 'end') return <Podium pub={s} me={me} canRestart={room.isHost} onRestart={() => engine.current?.restart()} />;

  return (
    <div className="dj">
      <header className="dj-top">
        {drawing && secret?.word ? (
          <p className="dj-word">
            <span className="lc-kicker">{t('draw')}</span>
            <b>{secret.word}</b>
          </p>
        ) : s.phase === 'reveal' ? (
          <p className="dj-word">
            <span className="lc-kicker">{t('was')}</span>
            <b>{s.word}</b>
          </p>
        ) : (
          <p className="dj-mask" aria-label={t('maskLabel', { n: s.mask.replace(/[ -]/g, '').length })}>
            {[...s.mask].map((c, i) => (
              <span key={i} data-space={c === ' ' || undefined} data-shown={(c !== '_' && c !== ' ') || undefined}>
                {c === '_' ? '' : c}
              </span>
            ))}
          </p>
        )}
        <p className="dj-meta">
          <span>{t('round', { n: s.round, total: s.rounds })}</span>
          <span className="dj-timer" aria-live="off">
            {left}s
          </span>
        </p>
      </header>

      {s.phase === 'choose' ? (
        drawing && secret?.options ? (
          <div className="dj-choose">
            <p>{t('choose')}</p>
            {secret.options.map((w, i) => (
              <button key={w} type="button" className="lc-btn lc-btn-ghost lc-btn-block" onClick={() => act('pick', { word: w })}>
                <span className="dj-level">{t(`level.${i}`)}</span> {w}
              </button>
            ))}
          </div>
        ) : (
          <p className="ms-wait">{t('choosing', { name: drawerName })}</p>
        )
      ) : (
        <Sketch strokes={strokes} editable={drawing && s.phase === 'draw'} onStroke={draw} onUndo={() => act('undo')} onClear={() => act('clear')} labels={{ undo: t('undo'), clear: t('clear'), colors: t('colors'), sizes: t('sizes'), canvas: drawing ? t('canvasMine') : t('canvasOf', { name: drawerName }) }} />
      )}

      <ol className="dj-feed" aria-live="polite">
        {s.feed.slice(-4).map((f) => (
          <li key={f.n} data-kind={f.kind}>
            {f.kind === 'right' ? t('feedRight', { name: s.names[f.who] ?? '…' }) : f.kind === 'close' ? t('feedClose', { name: s.names[f.who] ?? '…' }) : `${s.names[f.who] ?? '…'}: ${f.text}`}
          </li>
        ))}
      </ol>

      {!drawing && s.phase === 'draw' ? (
        s.guessed.includes(me) ? (
          <p className="dj-got">{t('gotIt')}</p>
        ) : (
          <GuessBox onGuess={(text) => act('guess', { text })} label={t('guessLabel')} placeholder={t('guessPlaceholder')} send={t('send')} />
        )
      ) : null}

      <ul className="dj-scores">
        {Object.entries(s.scores)
          .sort((a, b) => b[1] - a[1])
          .map(([id, pts]) => (
            <li key={id} data-me={id === me || undefined}>
              <span>{s.names[id] ?? '…'}</span>
              <b>{pts}</b>
            </li>
          ))}
      </ul>
    </div>
  );
}

function GuessBox({ onGuess, label, placeholder, send }: { onGuess: (text: string) => void; label: string; placeholder: string; send: string }) {
  const [text, setText] = useState('');
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onGuess(text);
    setText('');
  };
  return (
    <form className="dj-guess" onSubmit={submit}>
      <label className="sr-only" htmlFor="dj-guess">
        {label}
      </label>
      <input id="dj-guess" value={text} onChange={(e) => setText(e.target.value)} placeholder={placeholder} autoComplete="off" maxLength={40} enterKeyHint="send" />
      <button type="submit" className="lc-btn lc-btn-main" aria-label={send}>
        <Send aria-hidden className="size-4" />
      </button>
    </form>
  );
}

function Sketch({
  strokes,
  editable,
  onStroke,
  onUndo,
  onClear,
  labels,
}: {
  strokes: Stroke[];
  editable: boolean;
  onStroke: (s: Stroke) => void;
  onUndo: () => void;
  onClear: () => void;
  labels: { undo: string; clear: string; colors: string; sizes: string; canvas: string };
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [color, setColor] = useState(COLORS[0]);
  const [size, setSize] = useState(SIZES[1]);
  const [draft, setDraft] = useState<Stroke | null>(null);
  const lastSent = useRef(0);

  // Draw everything whenever the strokes change (a few hundred points: cheap).
  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const dpr = window.devicePixelRatio || 1;
    const w = el.clientWidth;
    if (el.width !== Math.round(w * dpr)) {
      el.width = Math.round(w * dpr);
      el.height = Math.round(w * dpr);
    }
    const ctx = el.getContext('2d')!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = '#fbf6ec';
    ctx.fillRect(0, 0, w, w);
    const all = draft && !strokes.some((s) => s.id === draft.id) ? [...strokes, draft] : strokes;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    for (const s of all) {
      if (!s.p.length) continue;
      ctx.strokeStyle = s.c;
      ctx.lineWidth = s.w * w;
      ctx.beginPath();
      ctx.moveTo(s.p[0][0] * w, s.p[0][1] * w);
      if (s.p.length === 1) ctx.lineTo(s.p[0][0] * w + 0.1, s.p[0][1] * w);
      for (let i = 1; i < s.p.length - 1; i++) {
        const mx = ((s.p[i][0] + s.p[i + 1][0]) / 2) * w;
        const my = ((s.p[i][1] + s.p[i + 1][1]) / 2) * w;
        ctx.quadraticCurveTo(s.p[i][0] * w, s.p[i][1] * w, mx, my);
      }
      if (s.p.length > 1) ctx.lineTo(s.p[s.p.length - 1][0] * w, s.p[s.p.length - 1][1] * w);
      ctx.stroke();
    }
  }, [strokes, draft]);

  const point = (e: React.PointerEvent<HTMLCanvasElement>): [number, number] => {
    const r = e.currentTarget.getBoundingClientRect();
    return [Math.round(((e.clientX - r.left) / r.width) * 1000) / 1000, Math.round(((e.clientY - r.top) / r.height) * 1000) / 1000];
  };
  const down = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!editable) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const s: Stroke = { id: Math.random().toString(36).slice(2, 10), c: color, w: size, p: [point(e)] };
    setDraft(s);
    onStroke(s);
    lastSent.current = performance.now();
  };
  const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!editable || !draft) return;
    const next = { ...draft, p: [...draft.p, point(e)] };
    setDraft(next);
    const t = performance.now();
    if (t - lastSent.current > 60) {
      lastSent.current = t;
      onStroke(next);
    }
  };
  const up = () => {
    if (!draft) return;
    onStroke(draft);
    setDraft(null);
  };

  return (
    <div className="dj-sketch">
      <canvas
        ref={canvas}
        className="dj-canvas"
        data-editable={editable || undefined}
        role="img"
        aria-label={labels.canvas}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
      />
      {editable ? (
        <div className="dj-tools">
          <div role="group" aria-label={labels.colors} className="dj-colors">
            {COLORS.map((c) => (
              <button key={c} type="button" aria-pressed={c === color} aria-label={c} style={{ background: c }} onClick={() => setColor(c)} />
            ))}
          </div>
          <div role="group" aria-label={labels.sizes} className="dj-sizes">
            {SIZES.map((sz) => (
              <button key={sz} type="button" aria-pressed={sz === size} aria-label={`${Math.round(sz * 1000)}`} onClick={() => setSize(sz)}>
                <span style={{ width: `${Math.max(4, sz * 600)}px`, height: `${Math.max(4, sz * 600)}px`, background: color }} />
              </button>
            ))}
            <button type="button" onClick={onUndo} aria-label={labels.undo}>
              <Undo2 aria-hidden className="size-4" />
            </button>
            <button type="button" onClick={onClear} aria-label={labels.clear}>
              <Eraser aria-hidden className="size-4" />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Podium({ pub, me, canRestart, onRestart }: { pub: Pub; me: string; canRestart: boolean; onRestart: () => void }) {
  const t = useTranslations('lucero.mesa.dibujo');
  const ranking = Object.entries(pub.scores).sort((a, b) => b[1] - a[1]);
  return (
    <div className="dj dj-end">
      <Trophy aria-hidden className="size-8 dj-trophy" />
      <h3 className="gl-title">{t('winner', { name: pub.names[ranking[0]?.[0]] ?? '…' })}</h3>
      <ol className="dj-scores dj-final">
        {ranking.map(([id, pts], i) => (
          <li key={id} data-me={id === me || undefined}>
            <span>
              {i + 1}. {pub.names[id] ?? '…'}
            </span>
            <b>{pts}</b>
          </li>
        ))}
      </ol>
      {canRestart ? (
        <button type="button" className="lc-btn lc-btn-main lc-btn-block" onClick={onRestart}>
          {t('again')}
        </button>
      ) : (
        <p className="ms-wait">{t('waitAgain')}</p>
      )}
    </div>
  );
}
