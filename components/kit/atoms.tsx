'use client';

import { forwardRef, useEffect, useState, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode } from 'react';

/**
 * Átomos del kit (diseño atómico, Ignacio 08/11/2026: «componentes reutilizables para no reinventar todo»). Plain CSS in
 * kit.css with Lucero's tokens (--l-*), so every season dresses them too. No copy inside: every word comes from the
 * caller (messages/*.json).
 */

export type ButtonVariant = 'main' | 'ghost' | 'quiet' | 'danger' | 'ok';

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; size?: 'sm' | 'md' | 'lg'; block?: boolean; icon?: ReactNode }
>(function Button({ variant = 'ghost', size = 'md', block = false, icon, className = '', children, type = 'button', ...rest }, ref) {
  return (
    <button ref={ref} type={type} className={`k-btn k-btn--${variant} k-btn--${size}${block ? ' k-btn--block' : ''} ${className}`} {...rest}>
      {icon}
      {children !== undefined ? <span>{children}</span> : null}
    </button>
  );
});

export function IconButton({ label, icon, className = '', ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { label: string; icon: ReactNode }) {
  return (
    <button type="button" className={`k-icon ${className}`} aria-label={label} title={label} {...rest}>
      {icon}
    </button>
  );
}

export type Tone = 'neutral' | 'new' | 'kitchen' | 'ready' | 'done' | 'alert' | 'gold';

export function Badge({ tone = 'neutral', children, className = '' }: { tone?: Tone; children: ReactNode; className?: string }) {
  return <span className={`k-badge k-badge--${tone} ${className}`}>{children}</span>;
}

/** A number in a circle: a table, a count. */
export function TableNum({ n, tone = 'neutral', size = 'md' }: { n: number | string; tone?: Tone; size?: 'md' | 'lg' }) {
  return <span className={`k-num k-num--${tone} k-num--${size}`}>{n}</span>;
}

export function Kicker({ children }: { children: ReactNode }) {
  return <p className="k-kicker">{children}</p>;
}

export function Card({ children, className = '', tone, as: Tag = 'div', ...rest }: { children: ReactNode; className?: string; tone?: Tone; as?: 'div' | 'li' | 'section' | 'article' } & Record<string, unknown>) {
  return (
    <Tag className={`k-card ${tone ? `k-card--${tone}` : ''} ${className}`} {...rest}>
      {children}
    </Tag>
  );
}

export function Stat({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="k-stat">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

export const Field = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string }>(function Field({ label, hint, id, className = '', ...rest }, ref) {
  const fid = id ?? `f-${label.replace(/\W+/g, '-').toLowerCase()}`;
  return (
    <label className={`k-field ${className}`} htmlFor={fid}>
      <span className="k-field-label">{label}</span>
      <input ref={ref} id={fid} className="k-input" {...rest} />
      {hint ? <small className="k-field-hint">{hint}</small> : null}
    </label>
  );
});

export function Dot({ tone = 'neutral', pulse = false }: { tone?: Tone; pulse?: boolean }) {
  return <span aria-hidden className={`k-dot k-dot--${tone}${pulse ? ' k-dot--pulse' : ''}`} />;
}

export function Empty({ icon, title, text }: { icon?: ReactNode; title: string; text?: string }) {
  return (
    <div className="k-empty">
      {icon ? <span className="k-empty-icon">{icon}</span> : null}
      <p className="k-empty-title">{title}</p>
      {text ? <p className="k-empty-text">{text}</p> : null}
    </div>
  );
}

/** Re-render every `ms` so «hace N min» stays true. */
export function useNow(ms = 15_000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), ms);
    return () => window.clearInterval(id);
  }, [ms]);
  return now;
}

export const minutesSince = (at: number | undefined, now: number) => (at ? Math.max(0, Math.floor((now - at) / 60_000)) : 0);
