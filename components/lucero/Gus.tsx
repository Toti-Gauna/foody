'use client';

import { useEffect, useState } from 'react';
import { asset } from '@/lib/env';
import { useReducedMotion } from '@/components/motion/useReducedMotion';

/**
 * Gus, Lucero's waiter (the 38 poses of assets/personajes/cafe/mesero/png, as public/gus/<pose>.webp). Every pose shares
 * one square canvas with the feet on one baseline and the hips on one axis, so swapping poses never makes him jump.
 */
export const GUS_POSES = [
  '01-saludar', '02-agradecer', '03-presentar-carta', '04-servir', '05-esperar', '06-irse-con-cuenta', '07-anotar', '08-sorpresa',
  '09-triste', '10-celular', '11-celebrar', '12-pensar', '13-senalar', '14-caminar-con-cuenta', '15-limpiar', 'saludo-f1', 'saludo-f2',
  'asoma', 'mareado', 'busto', 'anota-f1', 'anota-f2', 'anota-f3', 'bandeja-tapada', 'espia', 'camina-tapada-f1', 'camina-tapada-f2',
  'camina-tapada-f3', 'camina-tapada-f4', 'camina-tapada-f5', 'corre-tapada-f1', 'corre-tapada-f2', 'corre-tapada-f3',
  'corre-tapada-f4', 'corre-tapada-f5', 'campana-f1', 'campana-f2', 'campana-f3',
] as const;
export type GusPose = (typeof GUS_POSES)[number];

export const FRAMES = {
  wave: ['saludo-f1', 'saludo-f2'],
  write: ['anota-f1', 'anota-f2', 'anota-f3'],
  walkTray: ['camina-tapada-f1', 'camina-tapada-f2', 'camina-tapada-f3', 'camina-tapada-f4', 'camina-tapada-f5'],
  runTray: ['corre-tapada-f1', 'corre-tapada-f2', 'corre-tapada-f3', 'corre-tapada-f4', 'corre-tapada-f5'],
  lid: ['campana-f1', 'campana-f2', 'campana-f3'],
} as const satisfies Record<string, readonly GusPose[]>;

/** Where the plate glows in the lid frames (fraction of the canvas), for the sparks. */
export const PLATE_GLOW = { x: 0.73, y: 0.43 };

export const gusSrc = (pose: GusPose) => asset(`/gus/${pose}.webp`);

/** Warm the poses a scene is about to use, so a frame never blinks while it loads. */
export function preloadGus(poses: readonly GusPose[] = GUS_POSES) {
  if (typeof window === 'undefined') return;
  for (const p of poses) {
    const img = new Image();
    img.src = gusSrc(p);
  }
}

/**
 * Plays a set of frames. `loop` repeats; otherwise it stops on the last one. Reduced motion: the first frame (or `still`),
 * no flipping through.
 */
export function useFrames(frames: readonly GusPose[], { fps = 7, loop = true, play = true, still }: { fps?: number; loop?: boolean; play?: boolean; still?: GusPose } = {}) {
  const reduced = useReducedMotion();
  const key = frames.join('|');
  const [tick, setTick] = useState({ key, i: 0 });
  // A new set of frames starts from its first one (adjusting state while rendering, not in an effect).
  if (tick.key !== key) setTick({ key, i: 0 });
  useEffect(() => {
    if (!play || reduced || frames.length < 2) return;
    const id = window.setInterval(() => {
      setTick((cur) => {
        if (cur.key !== key) return cur;
        if (cur.i + 1 >= frames.length) {
          if (!loop) {
            window.clearInterval(id);
            return cur;
          }
          return { key, i: 0 };
        }
        return { key, i: cur.i + 1 };
      });
    }, 1000 / fps);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, fps, loop, play, reduced]);
  if (reduced) return still ?? frames[0];
  const i = tick.key === key ? tick.i : 0;
  return frames[Math.min(i, frames.length - 1)];
}

export function Gus({ pose, flip = false, className = '', priority = false }: { pose: GusPose; flip?: boolean; className?: string; priority?: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={gusSrc(pose)}
      alt=""
      aria-hidden
      draggable={false}
      width={696}
      height={696}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      className={`gus-img ${flip ? 'is-flip' : ''} ${className}`}
    />
  );
}
