'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/components/motion/useReducedMotion';

/** What Gus says: a line and how long it stays. `speak(text, 0)` keeps it until the next line. */
export function useSay(): [string | null, (text: string, ms?: number) => void] {
  const [text, setText] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const speak = useCallback((next: string, ms = 2600) => {
    window.clearTimeout(timer.current);
    setText(next);
    if (ms > 0) timer.current = window.setTimeout(() => setText(null), ms);
  }, []);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  return [text, speak];
}

/** A speech bubble that types its line in (instant under reduced motion). Decorative copy: the live regions say it. */
export function Bubble({ text, className = '' }: { text: string | null; className?: string }) {
  const reduced = useReducedMotion();
  const [typed, setTyped] = useState({ text, n: 0 });
  if (typed.text !== text) setTyped({ text, n: 0 });
  useEffect(() => {
    if (!text || reduced) return;
    const id = window.setInterval(() => {
      setTyped((cur) => {
        if (cur.text !== text || cur.n >= text.length) {
          window.clearInterval(id);
          return cur;
        }
        return { text, n: cur.n + 1 };
      });
    }, 22);
    return () => window.clearInterval(id);
  }, [text, reduced]);
  const shown = text ? (reduced ? text : text.slice(0, typed.text === text ? typed.n : 0)) : '';
  return (
    <p className={`lc-bubble ${className}`} data-hidden={!text || undefined} aria-hidden>
      {shown}
    </p>
  );
}
