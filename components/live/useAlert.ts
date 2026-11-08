'use client';

import { useCallback, useEffect, useRef } from 'react';

/**
 * A short two-note chime and a buzz, for «llegó una comanda» / «hay algo para llevar». Browsers only let sound start
 * after the person touched the page, so the audio wakes up on the first tap; before that, only the buzz.
 */
export function useAlert() {
  const ctx = useRef<AudioContext | null>(null);
  useEffect(() => {
    const wake = () => {
      try {
        ctx.current ??= new AudioContext();
        void ctx.current.resume();
      } catch {
        /* no audio here */
      }
    };
    window.addEventListener('pointerdown', wake, { once: true });
    return () => window.removeEventListener('pointerdown', wake);
  }, []);
  return useCallback(() => {
    navigator.vibrate?.([120, 60, 120]);
    const ac = ctx.current;
    if (!ac || ac.state !== 'running') return;
    const start = ac.currentTime;
    [880, 1318].forEach((f, i) => {
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.frequency.value = f;
      o.type = 'sine';
      g.gain.setValueAtTime(0.0001, start + i * 0.16);
      g.gain.exponentialRampToValueAtTime(0.25, start + i * 0.16 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, start + i * 0.16 + 0.3);
      o.connect(g).connect(ac.destination);
      o.start(start + i * 0.16);
      o.stop(start + i * 0.16 + 0.32);
    });
  }, []);
}
