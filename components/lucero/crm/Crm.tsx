'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { ChefHat, ClipboardList, Dices, GraduationCap, NotebookTabs, Users } from 'lucide-react';
import { DISHES, MENU, ORDER_FLOW, dishSoldOut, formatArs, orderTotal, useLucero, type Order, type OrderStatus } from '../store';
import { includes, type Feature } from '@/lib/plans';

export type CrmSection = 'servicio' | 'cocina' | 'clientes' | 'carta' | 'juegos' | 'academy';

const SECTIONS: { id: CrmSection; icon: typeof ChefHat; feature: Feature }[] = [
  { id: 'servicio', icon: ClipboardList, feature: 'crm' },
  { id: 'cocina', icon: ChefHat, feature: 'crm' },
  { id: 'clientes', icon: Users, feature: 'crm' },
  { id: 'carta', icon: NotebookTabs, feature: 'crm' },
  { id: 'juegos', icon: Dices, feature: 'ruleta' },
  { id: 'academy', icon: GraduationCap, feature: 'academy' },
];

const ago = (ms: number | undefined, now: number) => (ms ? Math.max(0, Math.round((now - ms) / 60_000)) : 0);

/** Re-render every few seconds so «hace N min» stays true. */
function useNow(every = 15_000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), every);
    return () => window.clearInterval(id);
  }, [every]);
  return now;
}

/**
 * Lucero's CRM, the venue's side. Everything the guest does shows up here at once (same store), and the kitchen can move
 * any order by hand. Seen through a plan (`?plan=`), it shows only what that plan has: what isn't in it doesn't appear
 * (Ignacio, 02/11/2026: «si doy click en la de 50, que solo me muestre lo que tiene la de 50»).
 */
export function Crm({
  section,
  onSection,
  slots,
}: {
  section: CrmSection;
  onSection: (s: CrmSection) => void;
  /** Sections built in later phases (games and wheel, Academy). */
  slots?: Partial<Record<CrmSection, ReactNode>>;
}) {
  const t = useTranslations('lucero.crm');
  const { state, plan } = useLucero();
  const newCount = state.orders.filter((o) => o.status === 'sent').length;
  const visible = SECTIONS.filter((s) => !plan || includes(plan, s.feature));
  const current = visible.find((s) => s.id === section) ?? visible[0];

  return (
    <div className="crm">
      <nav className="crm-nav" aria-label={t('navLabel')}>
        <p className="crm-brand">
          <span>Lucero</span>
          <span className="crm-brand-sub">{t('brandSub')}</span>
        </p>
        <ul>
          {visible.map((s) => {
            const Icon = s.icon;
            return (
              <li key={s.id}>
                <button type="button" aria-current={current.id === s.id ? 'page' : undefined} onClick={() => onSection(s.id)}>
                  <Icon aria-hidden className="size-4" strokeWidth={1.6} />
                  <span>{t(`nav.${s.id}`)}</span>
                  {s.id === 'cocina' && newCount ? <b className="crm-badge">{newCount}</b> : null}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="crm-main">
        {current.id === 'servicio' ? (
          <Servicio onKitchen={() => onSection('cocina')} />
        ) : current.id === 'cocina' ? (
          <Cocina />
        ) : current.id === 'clientes' ? (
          <Clientes />
        ) : current.id === 'carta' ? (
          <Carta />
        ) : (
          slots?.[current.id]
        )}
      </div>
    </div>
  );
}

function Head({ title, sub }: { title: string; sub?: string }) {
  return (
    <header className="crm-head">
      <h2 className="crm-h">{title}</h2>
      {sub ? <p className="crm-muted">{sub}</p> : null}
    </header>
  );
}

function Servicio({ onKitchen }: { onKitchen: () => void }) {
  const t = useTranslations('lucero.crm.servicio');
  const { state, lang } = useLucero();
  const now = useNow();
  const orders = state.orders;
  const today = orders.reduce((s, o) => s + orderTotal(o), 0);
  const tables = new Set(orders.filter((o) => o.status !== 'delivered').map((o) => o.table)).size;
  const kpis = [
    { label: t('kpi.orders'), value: String(orders.length) },
    { label: t('kpi.kitchen'), value: String(orders.filter((o) => o.status === 'sent' || o.status === 'kitchen').length) },
    { label: t('kpi.tables'), value: String(tables) },
    { label: t('kpi.sales'), value: formatArs(today, lang) },
  ];
  return (
    <section aria-labelledby="crm-servicio">
      <header className="crm-head">
        <h2 id="crm-servicio" className="crm-h">
          {t('title')}
        </h2>
        <p className="crm-muted">{t('sub')}</p>
      </header>
      <dl className="crm-kpis">
        {kpis.map((k) => (
          <div key={k.label}>
            <dt>{k.label}</dt>
            <dd>{k.value}</dd>
          </div>
        ))}
      </dl>
      <h3 className="crm-h3">{t('feed')}</h3>
      <ul className="crm-feed" aria-live="polite">
        {orders.slice(0, 7).map((o) => (
          <li key={o.id} data-mine={o.mine || undefined} data-status={o.status}>
            <span className="crm-feed-table">{t('table', { n: o.table })}</span>
            <span className="crm-feed-what">
              {o.guest} · {o.lines.map((l) => `${l.qty} ${DISHES[l.dish].name[lang]}`).join(', ')}
            </span>
            <span className="crm-chip" data-status={o.status}>
              {t(`status.${o.status}`)}
            </span>
            <span className="crm-feed-time">{t('ago', { n: ago(o.at.sent, now) })}</span>
          </li>
        ))}
      </ul>
      <button type="button" className="lc-btn lc-btn-ghost" onClick={onKitchen}>
        {t('toKitchen')}
      </button>
    </section>
  );
}

const NEXT: Partial<Record<OrderStatus, OrderStatus>> = { sent: 'kitchen', kitchen: 'ready', ready: 'delivered' };

function Cocina() {
  const t = useTranslations('lucero.crm.cocina');
  const { state, dispatch, lang } = useLucero();
  const now = useNow();
  const cols = ORDER_FLOW.map((s) => ({ s, orders: state.orders.filter((o) => o.status === s) }));
  return (
    <section aria-labelledby="crm-cocina">
      <Head title={t('title')} sub={t('sub')} />
      <h2 id="crm-cocina" className="sr-only">
        {t('title')}
      </h2>
      <div className="crm-board">
        {cols.map(({ s, orders }) => (
          <div key={s} className="crm-col" data-status={s}>
            <h3 className="crm-col-h">
              <span>{t(`col.${s}`)}</span>
              <b>{orders.length}</b>
            </h3>
            <ul>
              {orders.map((o) => (
                <Ticket key={o.id} order={o} now={now} lang={lang} onNext={NEXT[o.status] ? () => dispatch({ type: 'advance', id: o.id, to: NEXT[o.status]!, now: Date.now() }) : null} />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

function Ticket({ order, now, lang, onNext }: { order: Order; now: number; lang: 'es' | 'en' | 'pt'; onNext: (() => void) | null }) {
  const t = useTranslations('lucero.crm.cocina');
  return (
    <li className="crm-ticket" data-mine={order.mine || undefined} data-status={order.status}>
      <p className="crm-ticket-top">
        <b>{t('table', { n: order.table })}</b>
        <span>{t('ago', { n: ago(order.at[order.status], now) })}</span>
      </p>
      <p className="crm-muted">
        {order.guest} · {order.source === 'qr' ? t('byQr') : t('byWaiter')} {order.round > 1 ? `· ${t('round', { n: order.round })}` : ''}
      </p>
      <ul className="crm-ticket-lines">
        {order.lines.map((l) => {
          const dish = DISHES[l.dish];
          const group = dish.options ? MENU.optionGroups[dish.options] : null;
          const detail = l.options.map((id) => group?.options.find((x) => x.id === id)?.label[lang]).filter(Boolean).join(', ');
          return (
            <li key={l.key}>
              {l.qty} × {dish.name[lang]}
              {detail ? <small> ({detail})</small> : null}
            </li>
          );
        })}
      </ul>
      {order.note ? <p className="crm-note">“{order.note}”</p> : null}
      {onNext ? (
        <button type="button" className="crm-next" onClick={onNext}>
          {t(`next.${order.status}`)}
        </button>
      ) : null}
    </li>
  );
}

function Clientes() {
  const t = useTranslations('lucero.crm.clientes');
  const { state, dispatch, lang } = useLucero();
  const [sel, setSel] = useState(state.customers[0]?.id ?? '');
  const customer = state.customers.find((c) => c.id === sel) ?? state.customers[0];
  const history = useMemo(() => state.orders.filter((o) => customer && o.guest.toLowerCase() === customer.name.toLowerCase()), [state.orders, customer]);
  if (!customer) return null;
  return (
    <section aria-labelledby="crm-clientes">
      <header className="crm-head">
        <h2 id="crm-clientes" className="crm-h">
          {t('title')}
        </h2>
        <p className="crm-muted">{t('sub')}</p>
      </header>
      <div className="crm-split">
        <ul className="crm-people" aria-label={t('listLabel')}>
          {state.customers.map((c) => (
            <li key={c.id}>
              <button type="button" aria-current={c.id === customer.id || undefined} onClick={() => setSel(c.id)}>
                <span className="crm-avatar" aria-hidden>
                  {c.name.slice(0, 1)}
                </span>
                <span className="crm-person">
                  <b>{c.name}</b>
                  <small>{t('visits', { n: c.visits })}</small>
                </span>
                {c.tags.map((tag) => (
                  <span key={tag} className="crm-tag">
                    {t(`tag.${tag}`)}
                  </span>
                ))}
              </button>
            </li>
          ))}
        </ul>
        <article className="crm-card" aria-label={customer.name}>
          <h3 className="crm-h3">{customer.name}</h3>
          <dl className="crm-facts">
            <div>
              <dt>{t('fact.visits')}</dt>
              <dd>{customer.visits}</dd>
            </div>
            <div>
              <dt>{t('fact.spent')}</dt>
              <dd>{formatArs(customer.spent, lang)}</dd>
            </div>
            <div>
              <dt>{t('fact.favourite')}</dt>
              <dd>{DISHES[customer.favourite]?.name[lang] ?? '—'}</dd>
            </div>
            <div>
              <dt>{t('fact.last')}</dt>
              <dd>{t(`last.${customer.lastVisit}`)}</dd>
            </div>
          </dl>
          <label className="crm-label" htmlFor="crm-note">
            {t('note')}
          </label>
          <textarea id="crm-note" className="crm-input" rows={2} value={customer.note} onChange={(e) => dispatch({ type: 'note', customer: customer.id, note: e.target.value })} placeholder={t('notePlaceholder')} />
          <h4 className="crm-h4">{t('history')}</h4>
          {history.length ? (
            <ul className="crm-history">
              {history.map((o) => (
                <li key={o.id}>
                  <span>{t('order', { n: o.round, table: o.table })}</span>
                  <span>{formatArs(orderTotal(o), lang)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="crm-muted">{t('noHistory')}</p>
          )}
        </article>
      </div>
    </section>
  );
}

function Carta() {
  const t = useTranslations('lucero.crm.carta');
  const { state, dispatch, lang } = useLucero();
  return (
    <section aria-labelledby="crm-carta">
      <header className="crm-head">
        <h2 id="crm-carta" className="crm-h">
          {t('title')}
        </h2>
        <p className="crm-muted">{t('sub')}</p>
      </header>
      <div className="crm-menu">
        {MENU.categories.map((c) => (
          <div key={c.id} className="crm-menu-cat">
            <h3 className="crm-h4">{c.name[lang]}</h3>
            <ul>
              {c.items.map((d) => {
                const out = dishSoldOut(state, d.id);
                const fixed = d.soldOut;
                return (
                  <li key={d.id}>
                    <span className={out ? 'crm-out' : ''}>{d.name[lang]}</span>
                    <span className="crm-muted">{formatArs(d.price, lang)}</span>
                    <label className="crm-switch">
                      <input type="checkbox" checked={!out} disabled={fixed} onChange={() => dispatch({ type: 'toggleOut', dish: d.id })} />
                      <span>{out ? t('out') : t('in')}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
