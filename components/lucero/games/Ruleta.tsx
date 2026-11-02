'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Gift } from 'lucide-react';
import { useReducedMotion } from '@/components/motion/useReducedMotion';
import { pickPrize, useLucero, type Prize } from '../store';

const COLORS = ['#b23a52', '#2e1e21', '#d9783a', '#241719', '#8a2a3f', '#3a2629'];

const prizeCode = () => `LUC-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

/**
 * The wheel: one spin per order, to win the daily menu or a deal. The prizes and their odds are the venue's (CRM →
 * «Juegos y ruleta»); slices are drawn equal, but what comes out follows the weights. The result is decided first
 * (`pickPrize`), then the wheel lands on it: the animation never decides anything. In the demo, prizes are examples.
 */
export function Ruleta({ orderId }: { orderId: string | null }) {
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
    // Land the chosen slice under the pointer (top), after a few whole turns.
    const target = 360 * 5 + (360 - (index * per + per / 2));
    const code = prize && prize.label ? prizeCode() : null;
    setSpinning(true);
    setAngle(target);
    window.setTimeout(
      () => {
        setSpinning(false);
        setShown({ prize: prize && prize.label ? prize : null, code });
        dispatch({ type: 'spin', spin: { orderId, prize: prize && prize.label ? prize.id : null, code, at: Date.now() } });
      },
      reduced ? 50 : 4200,
    );
  };

  const per = slices.length ? 360 / slices.length : 360;
  const r = 100;
  const point = (deg: number) => {
    const a = ((deg - 90) * Math.PI) / 180;
    return `${110 + r * Math.cos(a)} ${110 + r * Math.sin(a)}`;
  };

  return (
    <div className="ru">
      <div className="ru-wheel-wrap">
        <span aria-hidden className="ru-pointer" />
        <svg viewBox="0 0 220 220" className="ru-wheel" style={{ transform: `rotate(${angle}deg)`, transition: spinning && !reduced ? 'transform 4.1s cubic-bezier(0.12, 0.8, 0.12, 1)' : 'none' }} aria-hidden>
          {slices.map((p, i) => (
            <g key={p.id}>
              <path d={`M110 110 L${point(i * per)} A${r} ${r} 0 ${per > 180 ? 1 : 0} 1 ${point((i + 1) * per)} Z`} fill={COLORS[i % COLORS.length]} stroke="#f3e6d0" strokeOpacity="0.25" />
              <text x="110" y="34" transform={`rotate(${i * per + per / 2} 110 110)`} textAnchor="middle" className="ru-label">
                {p.label ? (p.label.length > 14 ? `${p.label.slice(0, 13)}…` : p.label) : t('nothingShort')}
              </text>
            </g>
          ))}
          <circle cx="110" cy="110" r="16" fill="#f5b942" />
        </svg>
      </div>
      {result ? (
        <div className="ru-result" role="status">
          <Gift aria-hidden className="size-5" />
          {result.prize ? (
            <p>
              {t('won', { prize: result.prize.label })} <b className="ru-code">{result.code}</b>
              <small>{t('show')}</small>
            </p>
          ) : (
            <p>{t('nothing')}</p>
          )}
        </div>
      ) : (
        <button type="button" className="lc-btn lc-btn-main lc-btn-block" onClick={spin} disabled={!orderId || spinning || !slices.length}>
          {spinning ? t('spinning') : t('spin')}
        </button>
      )}
      <p className="ru-note">{t('note')}</p>
    </div>
  );
}
