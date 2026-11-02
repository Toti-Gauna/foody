'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { asset } from '@/lib/env';
import { useReducedMotion } from '@/components/motion/useReducedMotion';
import { FRAMES, Gus, gusSrc, GUS_POSES, useFrames } from './Gus';
import { SeasonDecor, useSeason } from './season';

/** The carta waits for this before offering the wheel: the guest has to see it, not the loading screen. */
export const READY_EVENT = 'lucero:ready';
declare global {
  interface Window {
    __luceroReady?: boolean;
  }
}
function markReady() {
  window.__luceroReady = true;
  window.dispatchEvent(new Event(READY_EVENT));
}
export function onDemoReady(fn: () => void) {
  if (window.__luceroReady) {
    fn();
    return () => {};
  }
  window.addEventListener(READY_EVENT, fn, { once: true });
  return () => window.removeEventListener(READY_EVENT, fn);
}

/** What the first screens need before they look right: every Gus pose and the dishes' photos. */
const WARM = [...GUS_POSES.map(gusSrc), ...['pasta', 'pizza', 'burger', 'dessert', 'cocktail'].map((f) => asset(`/lucero/food/${f}.webp`))];
const MIN_MS = 1400;
const MAX_MS = 5000;

/**
 * The demo's loading screen: Lucero's name, Gus waving and a bar that fills as the images arrive (every pose, so no
 * frame ever blinks later). Dressed for the date like the rest. It leaves when everything is in (never before
 * MIN_MS, never after MAX_MS) with a fade; with reduced motion, no movement and a shorter wait.
 */
export function LoadingScreen() {
  const t = useTranslations('lucero.season');
  const season = useSeason();
  const reduced = useReducedMotion();
  const wave = useFrames(FRAMES.wave, { fps: 4 });
  const [loaded, setLoaded] = useState(0);
  const [phase, setPhase] = useState<'loading' | 'leaving' | 'gone'>('loading');

  useEffect(() => {
    let alive = true;
    let count = 0;
    const started = performance.now();
    const imgs = WARM.map((src) => {
      const img = new Image();
      const done = () => {
        if (!alive) return;
        count += 1;
        setLoaded(count);
      };
      img.onload = done;
      img.onerror = done;
      img.src = src;
      return img;
    });
    const check = window.setInterval(() => {
      const elapsed = performance.now() - started;
      const min = reduced ? 500 : MIN_MS;
      if ((count >= imgs.length && elapsed >= min) || elapsed >= MAX_MS) {
        window.clearInterval(check);
        setPhase('leaving');
        markReady();
        window.setTimeout(() => alive && setPhase('gone'), reduced ? 0 : 650);
      }
    }, 100);
    return () => {
      alive = false;
      window.clearInterval(check);
    };
  }, [reduced]);

  if (phase === 'gone') return null;
  const pct = Math.round((loaded / WARM.length) * 100);

  return (
    <div className="ls" data-phase={phase} role="status" aria-live="polite" aria-label={t('loadingLabel')}>
      <SeasonDecor />
      <div className="ls-center">
        <div className="ls-halo" aria-hidden>
          <Gus pose={wave} priority className="ls-gus" />
        </div>
        <p className="ls-name">
          Lucero <span className="ld-demo">{t('demo')}</span>
        </p>
        <p className="ls-line">{t(`${season}.loading`)}</p>
        <div className="ls-bar" aria-hidden>
          <span style={{ transform: `scaleX(${Math.max(0.06, pct / 100)})` }} />
        </div>
        <p className="ls-pct" aria-hidden>
          {pct}%
        </p>
      </div>
    </div>
  );
}
