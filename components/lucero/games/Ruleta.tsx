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
 * La ruleta de la casa, over the guest's whole screen as soon as the carta opens, right after scanning the table's QR
 * (Ignacio, 02/11/2026: «la ruleta aparece al principio luego de escanear el QR»). One spin per visit, to win the daily
 * menu or a deal for the order. The prizes and their odds are the venue's (CRM → «Juegos y ruleta»); slices are drawn equal, but
 * what comes out follows the weights: the result is decided first (`pickPrize`) and the wheel lands on it. In the demo,
 * prizes are examples.
 */
export function Ruleta({ spinKey, onDone, onClose }: { spinKey: string; onDone: () => void; onClose: () => void }) {
  const t = useTranslations('lucero.games.ruleta');
  const { state, dispatch } = useLucero();
  const reduced = useReducedMotion();
  const slices = useMemo(() => state.prizes.filter((p) => p.weight > 0), [state.prizes]);
  const done = state.spins.find((s) => s.orderId === spinKey) ?? null;
  const [angle, setAngle] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [shown, setShown] = useState<{ prize: Prize | null; code: string | null } | null>(null);

  const result = shown ?? (done ? { prize: state.prizes.find((p) => p.id === done.prize) ?? null, code: done.code } : null);

  const spin = () => {
    if (done || spinning || !slices.length) return;
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
        dispatch({ type: 'spin', spin: { orderId: spinKey, prize: prize && prize.label ? prize.id : null, code, at: Date.now() } });
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
            <linearGradient id="rs-rim" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fff1c4" />
              <stop offset="22%" stopColor="#f5b942" />
              <stop offset="48%" stopColor="#a8701a" />
              <stop offset="70%" stopColor="#f7cd6b" />
              <stop offset="100%" stopColor="#8a5a14" />
            </linearGradient>
            <radialGradient id="rs-hub" cx="38%" cy="32%" r="75%">
              <stop offset="0%" stopColor="#fff6d6" />
              <stop offset="55%" stopColor="#f5b942" />
              <stop offset="100%" stopColor="#8a5a14" />
            </radialGradient>
            <radialGradient id="rs-depth" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.16" />
              <stop offset="55%" stopColor="#fff" stopOpacity="0" />
              <stop offset="100%" stopColor="#000" stopOpacity="0.38" />
            </radialGradient>
            <linearGradient id="rs-gloss" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.32" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Rim, bevel and lights stay still; only the slices turn. */}
          <circle cx={C} cy={C} r="158" fill="#0d0809" />
          <circle cx={C} cy={C} r="155" fill="url(#rs-rim)" />
          <circle cx={C} cy={C} r="141.5" fill="none" stroke="#5a3a0c" strokeWidth="2" />
          <circle cx={C} cy={C} r="139" fill="#140c0e" />
          {Array.from({ length: BULBS }, (_, i) => {
            const [x, y] = point((i * 360) / BULBS, 148).split(' ').map(Number);
            return <circle key={i} cx={x} cy={y} r="4.6" className="rs-bulb" style={{ animationDelay: `${(i % 2) * 0.35}s` }} />;
          })}
          <g className="rs-turn" style={{ transform: `rotate(${angle}deg)`, transition: spinning && !reduced ? `transform ${SPIN_MS - 100}ms cubic-bezier(0.1, 0.75, 0.08, 1)` : 'none' }}>
            {slices.map((p, i) => {
              const s = SLICES[i % SLICES.length];
              const label = p.label ? (p.label.length > 13 ? `${p.label.slice(0, 12).trimEnd()}…` : p.label) : t('nothingShort');
              // Radial labels, from the rim towards the hub, like a real wheel: none reads upside down.
              return (
                <g key={p.id}>
                  <path d={`M${C} ${C} L${point(i * per)} A${R} ${R} 0 ${per > 180 ? 1 : 0} 1 ${point((i + 1) * per)} Z`} style={{ fill: s.fill }} />
                  <g transform={`rotate(${i * per + per / 2} ${C} ${C})`}>
                    <text x={C} y={C - R + 14} transform={`rotate(90 ${C} ${C - R + 14})`} dominantBaseline="central" className="rs-label" style={{ fill: s.ink }}>
                      {label}
                    </text>
                  </g>
                </g>
              );
            })}
            {/* Gold dividers with a stud at the rim. */}
            {slices.map((p, i) => {
              const [x, y] = point(i * per, R - 4).split(' ').map(Number);
              return (
                <g key={`d-${p.id}`}>
                  <line x1={C} y1={C} x2={x} y2={y} stroke="url(#rs-rim)" strokeWidth="3" />
                  <circle cx={x} cy={y} r="3.6" fill="#ffe3a3" stroke="#8a5a14" strokeWidth="1" />
                </g>
              );
            })}
          </g>
          {/* Depth and a glossy highlight over the slices (still, so the light doesn't spin). */}
          <circle cx={C} cy={C} r={R} fill="url(#rs-depth)" pointerEvents="none" />
          <path d={`M${C - 108} ${C - 40} A${R - 10} ${R - 10} 0 0 1 ${C + 108} ${C - 40} Q${C} ${C - 70} ${C - 108} ${C - 40}Z`} fill="url(#rs-gloss)" pointerEvents="none" />
          <circle cx={C} cy={C} r="34" fill="#0d0809" opacity="0.45" />
          <circle cx={C} cy={C} r="31" fill="url(#rs-hub)" stroke="#5a3a0c" strokeWidth="2" />
          <circle cx={C} cy={C} r="24" fill="none" stroke="#fff3cf" strokeOpacity="0.6" strokeWidth="1" strokeDasharray="2 3" />
          <text x={C} y={C + 9} textAnchor="middle" className="rs-hub-l">
            L
          </text>
        </svg>
        <svg viewBox="0 0 40 56" className="rs-pointer" aria-hidden>
          <defs>
            <linearGradient id="rs-ptr" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fff1c4" />
              <stop offset="50%" stopColor="#f5b942" />
              <stop offset="100%" stopColor="#8a5a14" />
            </linearGradient>
          </defs>
          <path d="M20 54 L5 18 A16 16 0 1 1 35 18 Z" fill="url(#rs-ptr)" stroke="#5a3a0c" strokeWidth="1.5" />
          <circle cx="20" cy="15" r="7" className="rs-gem" />
          <circle cx="17.5" cy="12.5" r="2" fill="#fff" opacity="0.7" />
        </svg>
        <span aria-hidden className="rs-stand" />
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
          <button type="button" className="lc-btn lc-btn-main lc-btn-block rs-go" onClick={spin} disabled={spinning || !slices.length}>
            {spinning ? t('spinning') : t('spin')}
          </button>
          <p className="rs-note">{t('note')}</p>
        </div>
      )}
    </div>
  );
}
