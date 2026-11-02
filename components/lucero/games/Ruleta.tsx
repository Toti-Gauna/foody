'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { X } from 'lucide-react';
import { useReducedMotion } from '@/components/motion/useReducedMotion';
import { pickPrize, useLucero, type Prize } from '../store';
import { SeasonDecor } from '../season';

/** Slices alternate the house colours (or the season's: components/lucero/seasons.css); each one says which ink reads on it. */
const SLICES = [1, 2, 3, 4, 5, 6].map((n) => ({ fill: `var(--rs-s${n})`, ink: `var(--rs-i${n})` }));
const BULBS = 20;
const SPIN_MS = 4600;

const prizeCode = () => `LUC-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

/**
 * La ruleta de la casa, over the guest's whole screen right after an order is placed (Ignacio, 02/11/2026: «que aparezca
 * superponiéndose en toda la pantalla desde la primera vez que el usuario pide algo»). One spin per order, to win the
 * daily menu or a deal. The prizes and their odds are the venue's (CRM → «Juegos y ruleta»); slices are drawn equal, but
 * what comes out follows the weights: the result is decided first (`pickPrize`) and the wheel lands on it. In the demo,
 * prizes are examples.
 */
export function Ruleta({ orderId, onDone, onClose }: { orderId: string | null; onDone: () => void; onClose: () => void }) {
  const t = useTranslations('lucero.games.ruleta');
  const { state, dispatch } = useLucero();
  const reduced = useReducedMotion();
  const slices = useMemo(() => state.prizes.filter((p) => p.weight > 0), [state.prizes]);
  const done = orderId ? state.spins.find((s) => s.orderId === orderId) : null;
  const [angle, setAngle] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [shown, setShown] = useState<{ prize: Prize | null; code: string | null } | null>(null);

  const result = shown ?? (done ? { prize: state.prizes.find((p) => p.id === done.prize) ?? null, code: done.code } : null);

  const spin = () => {
    if (!orderId || done || spinning || !slices.length) return;
    const prize = pickPrize(slices, Math.random());
    const index = prize ? slices.indexOf(prize) : 0;
    const per = 360 / slices.length;
    // Land the chosen slice under the pointer (top), a little off its centre so it doesn't look staged.
    const wobble = (Math.random() - 0.5) * per * 0.5;
    const target = 360 * 6 + (360 - (index * per + per / 2)) + wobble;
    const code = prize && prize.label ? prizeCode() : null;
    setSpinning(true);
    setAngle(target);
    window.setTimeout(
      () => {
        setSpinning(false);
        setShown({ prize: prize && prize.label ? prize : null, code });
        dispatch({ type: 'spin', spin: { orderId, prize: prize && prize.label ? prize.id : null, code, at: Date.now() } });
      },
      reduced ? 60 : SPIN_MS,
    );
  };

  const per = slices.length ? 360 / slices.length : 360;
  const R = 132;
  const C = 160;
  const point = (deg: number, r = R) => {
    const a = ((deg - 90) * Math.PI) / 180;
    return `${C + r * Math.cos(a)} ${C + r * Math.sin(a)}`;
  };
  const won = !!result?.prize;

  return (
    <div className="rs" role="dialog" aria-modal="true" aria-labelledby="rs-title" data-state={result ? (won ? 'won' : 'lost') : spinning ? 'spinning' : 'ready'}>
      <div aria-hidden className="rs-rays" />
      <SeasonDecor />
      <button type="button" className="rs-close" onClick={onClose} aria-label={t('later')}>
        <X aria-hidden className="size-5" />
      </button>

      <header className="rs-head">
        <p className="rs-kicker">{t('title')}</p>
        <h2 id="rs-title" className="rs-title">
          {t('headline')}
        </h2>
        <p className="rs-sub">{t('sub')}</p>
      </header>

      <div className="rs-stage">
        <svg viewBox="0 0 320 320" className="rs-wheel-svg" aria-hidden>
          <defs>
            <radialGradient id="rs-rim" cx="50%" cy="40%" r="65%">
              <stop offset="0%" stopColor="#ffe3a3" />
              <stop offset="55%" stopColor="#f5b942" />
              <stop offset="100%" stopColor="#9a6a1d" />
            </radialGradient>
            <radialGradient id="rs-hub" cx="40%" cy="35%" r="70%">
              <stop offset="0%" stopColor="#fff2cc" />
              <stop offset="60%" stopColor="#f5b942" />
              <stop offset="100%" stopColor="#a87422" />
            </radialGradient>
          </defs>
          {/* Rim and lights stay still; only the slices turn. */}
          <circle cx={C} cy={C} r="156" fill="url(#rs-rim)" />
          <circle cx={C} cy={C} r="142" fill="#1a1113" />
          {Array.from({ length: BULBS }, (_, i) => {
            const [x, y] = point((i * 360) / BULBS, 149).split(' ').map(Number);
            return <circle key={i} cx={x} cy={y} r="4.2" className="rs-bulb" style={{ animationDelay: `${(i % 2) * 0.35}s` }} />;
          })}
          <g className="rs-turn" style={{ transform: `rotate(${angle}deg)`, transition: spinning && !reduced ? `transform ${SPIN_MS - 100}ms cubic-bezier(0.1, 0.75, 0.08, 1)` : 'none' }}>
            {slices.map((p, i) => {
              const s = SLICES[i % SLICES.length];
              const label = p.label ? (p.label.length > 13 ? `${p.label.slice(0, 12).trimEnd()}…` : p.label) : t('nothingShort');
              // Radial labels, from the rim towards the hub, like a real wheel: none reads upside down.
              return (
                <g key={p.id}>
                  <path d={`M${C} ${C} L${point(i * per)} A${R} ${R} 0 ${per > 180 ? 1 : 0} 1 ${point((i + 1) * per)} Z`} style={{ fill: s.fill }} stroke="#1a1113" strokeWidth="1.5" />
                  <g transform={`rotate(${i * per + per / 2} ${C} ${C})`}>
                    <text x={C} y={C - R + 14} transform={`rotate(90 ${C} ${C - R + 14})`} dominantBaseline="central" className="rs-label" style={{ fill: s.ink }}>
                      {label}
                    </text>
                  </g>
                </g>
              );
            })}
          </g>
          <circle cx={C} cy={C} r="30" fill="url(#rs-hub)" stroke="#1a1113" strokeWidth="3" />
          <text x={C} y={C + 9} textAnchor="middle" className="rs-hub-l">
            L
          </text>
        </svg>
        <span aria-hidden className="rs-pointer" />
      </div>

      {result ? (
        <div className="rs-result" role="status">
          {won ? (
            <>
              {reduced ? null : (
                <span aria-hidden className="rs-confetti">
                  {Array.from({ length: 18 }, (_, i) => (
                    <i key={i} style={{ '--i': i } as React.CSSProperties} />
                  ))}
                </span>
              )}
              <p className="rs-won">{t('wonTitle')}</p>
              <p className="rs-prize">{result.prize!.label}</p>
              <p className="rs-ticket">
                <span>{t('code')}</span>
                <b>{result.code}</b>
              </p>
              <p className="rs-show">{t('show')}</p>
            </>
          ) : (
            <>
              <p className="rs-prize">{t('nothingTitle')}</p>
              <p className="rs-show">{t('nothing')}</p>
            </>
          )}
          <button type="button" className="lc-btn lc-btn-main lc-btn-block" onClick={onDone}>
            {t('next')}
          </button>
        </div>
      ) : (
        <div className="rs-actions">
          <button type="button" className="lc-btn lc-btn-main lc-btn-block rs-go" onClick={spin} disabled={!orderId || spinning || !slices.length}>
            {spinning ? t('spinning') : t('spin')}
          </button>
          <p className="rs-note">{t('note')}</p>
        </div>
      )}
    </div>
  );
}
