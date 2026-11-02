'use client';

import { createContext, useContext, type CSSProperties } from 'react';
import type { Season } from '@/lib/seasons';

const SeasonCtx = createContext<Season>('clasica');
export const SeasonProvider = SeasonCtx.Provider;
export const useSeason = () => useContext(SeasonCtx);

/** A fixed «random» per index: same on the server and the client, so nothing jumps when the page hydrates. */
const r = (i: number, salt: number) => {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

/**
 * What floats over the guest's screen on a special date: bats for Halloween, snow under a string of lights for
 * Navidad, hearts for San Valentín. Decoration only (aria-hidden, no clicks); with reduced motion it stays still.
 */
export function SeasonDecor() {
  const season = useSeason();
  if (season === 'clasica') return null;
  return (
    <div className="sd" data-season={season} aria-hidden>
      {season === 'halloween' ? (
        <>
          {Array.from({ length: 7 }, (_, i) => (
            <span key={i} className="sd-bat" style={{ '--x': `${Math.round(r(i, 1) * 90)}%`, '--y': `${Math.round(8 + r(i, 2) * 40)}%`, '--d': `${(r(i, 3) * 6).toFixed(2)}s`, '--s': (0.55 + r(i, 4) * 0.7).toFixed(2), '--t': `${(7 + r(i, 5) * 6).toFixed(1)}s` } as CSSProperties}>
              <Bat />
            </span>
          ))}
          <Web className="sd-web" />
        </>
      ) : season === 'navidad' ? (
        <>
          <Lights />
          {Array.from({ length: 34 }, (_, i) => (
            <span key={i} className="sd-snow" style={{ '--x': `${(r(i, 1) * 100).toFixed(1)}%`, '--d': `${(-r(i, 2) * 12).toFixed(2)}s`, '--s': `${(3 + r(i, 3) * 5).toFixed(1)}px`, '--t': `${(8 + r(i, 4) * 8).toFixed(1)}s`, '--w': `${Math.round((r(i, 5) - 0.5) * 60)}px` } as CSSProperties} />
          ))}
        </>
      ) : (
        Array.from({ length: 14 }, (_, i) => (
          <span key={i} className="sd-heart" style={{ '--x': `${(r(i, 1) * 96).toFixed(1)}%`, '--d': `${(-r(i, 2) * 14).toFixed(2)}s`, '--s': (0.5 + r(i, 3) * 0.8).toFixed(2), '--t': `${(9 + r(i, 4) * 7).toFixed(1)}s` } as CSSProperties}>
            <Heart />
          </span>
        ))
      )}
    </div>
  );
}

/** Next to Gus in the carta's hero: a pumpkin with a candle, a wrapped present, a heart balloon. */
export function SeasonProp() {
  const season = useSeason();
  if (season === 'clasica') return null;
  return (
    <span className="sp" data-season={season} aria-hidden>
      {season === 'halloween' ? <Pumpkin /> : season === 'navidad' ? <Gift /> : <Balloon />}
    </span>
  );
}

function Bat() {
  return (
    <svg viewBox="0 0 64 32" width="64" height="32">
      <path className="sd-wing" d="M32 12c-3-6-9-9-16-8 3 2 4 5 3 8-4-2-9-2-13 1 5 1 9 4 11 8 3-3 8-4 12-2 1-2 2-4 3-7z" />
      <path className="sd-wing sd-wing-r" d="M32 12c3-6 9-9 16-8-3 2-4 5-3 8 4-2 9-2 13 1-5 1-9 4-11 8-3-3-8-4-12-2-1-2-2-4-3-7z" />
      <ellipse cx="32" cy="14" rx="4" ry="6" />
      <circle cx="30.5" cy="12" r="0.9" fill="#ffc24a" />
      <circle cx="33.5" cy="12" r="0.9" fill="#ffc24a" />
    </svg>
  );
}

function Web({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 120 120" width="120" height="120" fill="none" stroke="currentColor" strokeWidth="1">
      {[0, 22, 45, 67, 90].map((a) => (
        <line key={a} x1="120" y1="0" x2={120 - Math.cos((a * Math.PI) / 180) * 120} y2={Math.sin((a * Math.PI) / 180) * 120} />
      ))}
      {[30, 55, 80, 105].map((d) => (
        <path key={d} d={`M${120 - d} 0 Q${120 - d * 0.78} ${d * 0.32} ${120 - d * 0.7} ${d * 0.7} Q${120 - d * 0.32} ${d * 0.78} 120 ${d}`} />
      ))}
    </svg>
  );
}

function Lights() {
  const bulbs = ['#ff5a6e', '#f2c14e', '#5cc98a', '#7fc8ff'];
  return (
    <svg className="sd-lights" viewBox="0 0 400 34" preserveAspectRatio="none" width="100%" height="34">
      <path d="M0 6 Q50 26 100 8 T200 8 T300 8 T400 6" fill="none" stroke="#1b3128" strokeWidth="2" />
      {Array.from({ length: 16 }, (_, i) => {
        const x = 12 + i * 25;
        const y = 9 + Math.abs(Math.sin((x / 100) * Math.PI)) * 12;
        return (
          <g key={i} className="sd-bulb" style={{ '--d': `${(i % 4) * 0.4}s` } as CSSProperties}>
            <rect x={x - 1.5} y={y - 3} width="3" height="4" fill="#2a3a32" />
            <ellipse cx={x} cy={y + 5} rx="4" ry="6" fill={bulbs[i % bulbs.length]} />
          </g>
        );
      })}
    </svg>
  );
}

function Heart() {
  return (
    <svg viewBox="0 0 32 30" width="32" height="30">
      <path d="M16 29S2 20 2 10a7 7 0 0 1 14-2 7 7 0 0 1 14 2c0 10-14 19-14 19z" />
    </svg>
  );
}

function Pumpkin() {
  return (
    <svg viewBox="0 0 120 110" width="120" height="110">
      <defs>
        <radialGradient id="sp-glow" cx="50%" cy="60%" r="50%">
          <stop offset="0%" stopColor="#ffe08a" />
          <stop offset="100%" stopColor="#ff9a1f" />
        </radialGradient>
      </defs>
      <path d="M58 22c0-8 4-14 10-16l3 4c-5 2-7 6-7 12z" fill="#3f6b2a" />
      <ellipse cx="34" cy="64" rx="26" ry="38" fill="#c9530f" />
      <ellipse cx="86" cy="64" rx="26" ry="38" fill="#c9530f" />
      <ellipse cx="60" cy="64" rx="30" ry="42" fill="#e8661c" />
      <ellipse cx="60" cy="64" rx="12" ry="40" fill="#f27a2e" opacity="0.6" />
      <path d="M38 52l12 8-14 4zM82 52l-12 8 14 4z" fill="url(#sp-glow)" />
      <path d="M36 78c8 10 40 10 48 0l-6 4-6-4-6 6-6-6-6 4-6-4-6 4z" fill="url(#sp-glow)" />
    </svg>
  );
}

function Gift() {
  return (
    <svg viewBox="0 0 110 110" width="110" height="110">
      <rect x="12" y="44" width="86" height="58" rx="6" fill="#c0283a" />
      <rect x="6" y="32" width="98" height="20" rx="5" fill="#d5374a" />
      <rect x="49" y="32" width="12" height="70" fill="#f2c14e" />
      <path d="M55 32c-10-18-30-18-30-6 0 8 18 8 30 6zM55 32c10-18 30-18 30-6 0 8-18 8-30 6z" fill="none" stroke="#f2c14e" strokeWidth="7" strokeLinejoin="round" />
      <circle cx="30" cy="70" r="3" fill="#fff6ee" opacity="0.7" />
      <circle cx="80" cy="84" r="3" fill="#fff6ee" opacity="0.7" />
    </svg>
  );
}

function Balloon() {
  return (
    <svg viewBox="0 0 90 150" width="90" height="150">
      <path d="M45 98c2 14-6 22 0 50" fill="none" stroke="#fdeef3" strokeWidth="1.5" />
      <path d="M45 98S8 72 8 40a19 19 0 0 1 37-6 19 19 0 0 1 37 6c0 32-37 58-37 58z" fill="#d81b60" />
      <path d="M26 30c-6 4-8 12-6 18" stroke="#ffb3c7" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.7" />
    </svg>
  );
}
