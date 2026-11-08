'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { Check, Copy } from 'lucide-react';
import { DISHES, MENU, formatArs, orderTotal, type Lang, type Order } from '@/components/lucero/store';
import { Badge, Button, Card, TableNum, type ButtonVariant, type Tone } from './atoms';

/** Moléculas del kit: atoms put together, still with no copy of their own (labels come in as props). */

export const STATUS_TONE: Record<Order['status'], Tone> = { sent: 'new', kitchen: 'kitchen', ready: 'ready', delivered: 'done' };

/** One order as a ticket: table, who, lines with options, note, time, and at most one action. */
export function OrderTicket({
  order,
  lang,
  meta,
  status,
  action,
  big = false,
}: {
  order: Order;
  lang: Lang;
  /** «hace 3 min · por QR»… */
  meta?: ReactNode;
  status?: string;
  action?: { label: string; onClick: () => void; variant?: ButtonVariant; icon?: ReactNode };
  big?: boolean;
}) {
  return (
    <Card as="li" tone={STATUS_TONE[order.status]} className={`k-ticket${big ? ' k-ticket--big' : ''}`} data-status={order.status}>
      <header className="k-ticket-head">
        <TableNum n={order.table} tone={STATUS_TONE[order.status]} />
        <div className="k-ticket-who">
          <b>{order.guest}</b>
          {meta ? <small>{meta}</small> : null}
        </div>
        {status ? <Badge tone={STATUS_TONE[order.status]}>{status}</Badge> : null}
      </header>
      <ul className="k-lines">
        {order.lines.map((l) => {
          const dish = DISHES[l.dish];
          const group = dish?.options ? MENU.optionGroups[dish.options] : null;
          const detail = l.options
            .map((id) => group?.options.find((o) => o.id === id)?.label[lang])
            .filter(Boolean)
            .join(', ');
          return (
            <li key={l.key}>
              <span className="k-qty">{l.qty}×</span>
              <span>
                {dish?.name[lang] ?? l.dish}
                {detail ? <small> · {detail}</small> : null}
              </span>
            </li>
          );
        })}
      </ul>
      {order.note ? <p className="k-note">“{order.note}”</p> : null}
      <footer className="k-ticket-foot">
        <span className="k-total">{formatArs(orderTotal(order), lang)}</span>
        {action ? (
          <Button variant={action.variant ?? 'main'} size={big ? 'lg' : 'md'} onClick={action.onClick} icon={action.icon}>
            {action.label}
          </Button>
        ) : null}
      </footer>
    </Card>
  );
}

/** A QR for a link, the link itself (selectable) and a copy button. */
export function QrLink({ url, title, caption, copyLabel, copiedLabel, qrAlt }: { url: string; title: string; caption?: string; copyLabel: string; copiedLabel: string; qrAlt: string }) {
  const [qr, setQr] = useState<{ url: string; src: string } | null>(null);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    let alive = true;
    import('qrcode')
      .then((m) => m.toDataURL(url, { margin: 1, width: 320, color: { dark: '#1a1113', light: '#f6edda' } }))
      .then((src) => alive && setQr({ url, src }))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [url]);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* the link is selectable below */
    }
  };
  return (
    <Card className="k-qr">
      {qr && qr.url === url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={qr.src} alt={qrAlt} width={132} height={132} className="k-qr-img" />
      ) : (
        <span className="k-qr-img" aria-hidden />
      )}
      <div className="k-qr-text">
        <b>{title}</b>
        {caption ? <small>{caption}</small> : null}
        <code className="k-qr-url">{url}</code>
        <Button size="sm" onClick={copy} icon={copied ? <Check aria-hidden className="size-4" /> : <Copy aria-hidden className="size-4" />}>
          {copied ? copiedLabel : copyLabel}
        </Button>
      </div>
    </Card>
  );
}

/** A big tappable choice: icon, name, one line. As a link or a button. */
export function RoleCard({ icon, title, text, href, onClick, tone }: { icon: ReactNode; title: string; text: string; href?: string; onClick?: () => void; tone?: Tone }) {
  const inner = (
    <>
      <span className="k-role-icon" aria-hidden>
        {icon}
      </span>
      <span className="k-role-text">
        <b>{title}</b>
        <small>{text}</small>
      </span>
    </>
  );
  return href ? (
    <a className={`k-role${tone ? ` k-role--${tone}` : ''}`} href={href}>
      {inner}
    </a>
  ) : (
    <button type="button" className={`k-role${tone ? ` k-role--${tone}` : ''}`} onClick={onClick}>
      {inner}
    </button>
  );
}

/** Segmented tabs with an optional count per tab. */
export function Tabs<T extends string>({ items, value, onChange, label }: { items: { id: T; label: string; count?: number; icon?: ReactNode }[]; value: T; onChange: (id: T) => void; label: string }) {
  return (
    <div className="k-tabs" role="tablist" aria-label={label}>
      {items.map((it) => (
        <button key={it.id} type="button" role="tab" aria-selected={it.id === value} className="k-tab" onClick={() => onChange(it.id)}>
          {it.icon}
          <span>{it.label}</span>
          {it.count ? <b className="k-tab-count">{it.count}</b> : null}
        </button>
      ))}
    </div>
  );
}

/** − n + for a number (tables, quantities). */
export function Stepper({ value, onChange, min = 1, max = 99, label, decLabel, incLabel }: { value: number; onChange: (n: number) => void; min?: number; max?: number; label: string; decLabel: string; incLabel: string }) {
  return (
    <div className="k-stepper" role="group" aria-label={label}>
      <button type="button" className="k-icon" onClick={() => onChange(Math.max(min, value - 1))} aria-label={decLabel} disabled={value <= min}>
        −
      </button>
      <output className="k-stepper-n">{value}</output>
      <button type="button" className="k-icon" onClick={() => onChange(Math.min(max, value + 1))} aria-label={incLabel} disabled={value >= max}>
        +
      </button>
    </div>
  );
}
