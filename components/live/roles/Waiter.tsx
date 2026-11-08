'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { BellRing, ClipboardPen, HandPlatter, LayoutGrid, Minus, Plus, Receipt, Send, UtensilsCrossed } from 'lucide-react';
import { DISHES, MENU, dishSoldOut, formatArs, lineKey, orderTotal, useLucero, type Line, type Order } from '@/components/lucero/store';
import { Badge, Button, Card, Empty, TableNum, minutesSince, useNow, type Tone } from '@/components/kit/atoms';
import { OrderTicket, Stepper, Tabs } from '@/components/kit/molecules';
import { useAlert } from '../useAlert';

type Tab = 'mesas' | 'retirar' | 'llamados' | 'tomar';
export const TABLES = 12;

/** How a table is doing, for the waiter's map: the most urgent thing first. */
function tableState(table: number, orders: Order[], calls: { table: number; kind: 'bill' | 'waiter'; done: boolean }[]): { tone: Tone; key: 'free' | 'call' | 'bill' | 'ready' | 'kitchen' | 'ordered' | 'eating' } {
  const open = calls.filter((c) => c.table === table && !c.done);
  const mine = orders.filter((o) => o.table === table);
  if (open.some((c) => c.kind === 'waiter')) return { tone: 'alert', key: 'call' };
  if (mine.some((o) => o.status === 'ready')) return { tone: 'ready', key: 'ready' };
  if (open.some((c) => c.kind === 'bill')) return { tone: 'gold', key: 'bill' };
  if (mine.some((o) => o.status === 'sent')) return { tone: 'new', key: 'ordered' };
  if (mine.some((o) => o.status === 'kitchen')) return { tone: 'kitchen', key: 'kitchen' };
  if (mine.length) return { tone: 'done', key: 'eating' };
  return { tone: 'neutral', key: 'free' };
}

/**
 * Mozo: the room at a glance (each table and what it needs), what's ready to take out, who's calling or asking for the
 * bill, and taking an order at the table (it goes to the kitchen like one from the QR, marked «por el mozo»).
 */
export function Waiter() {
  const t = useTranslations('lucero.live.mesero');
  const { state, dispatch, lang } = useLucero();
  const now = useNow(20_000);
  const [tab, setTab] = useState<Tab>('mesas');
  const [taking, setTaking] = useState<number>(1);
  const ready = state.orders.filter((o) => o.status === 'ready');
  const calls = state.calls.filter((c) => !c.done);
  const alert = useAlert();
  const pending = ready.length + calls.length;
  const seen = useRef(pending);
  useEffect(() => {
    if (pending > seen.current) alert();
    seen.current = pending;
  }, [pending, alert]);

  return (
    <div className="lv-role">
      <Tabs
        label={t('tabsLabel')}
        value={tab}
        onChange={setTab}
        items={[
          { id: 'mesas', label: t('tabs.mesas'), icon: <LayoutGrid aria-hidden className="size-4" /> },
          { id: 'retirar', label: t('tabs.retirar'), count: ready.length, icon: <HandPlatter aria-hidden className="size-4" /> },
          { id: 'llamados', label: t('tabs.llamados'), count: calls.length, icon: <BellRing aria-hidden className="size-4" /> },
          { id: 'tomar', label: t('tabs.tomar'), icon: <ClipboardPen aria-hidden className="size-4" /> },
        ]}
      />

      {tab === 'mesas' ? (
        <ul className="lv-tables">
          {Array.from({ length: TABLES }, (_, i) => i + 1).map((n) => {
            const st = tableState(n, state.orders, state.calls);
            const total = state.orders.filter((o) => o.table === n).reduce((s, o) => s + orderTotal(o), 0);
            return (
              <li key={n}>
                <button
                  type="button"
                  className="lv-table"
                  data-tone={st.tone}
                  onClick={() => {
                    setTaking(n);
                    setTab(st.key === 'ready' ? 'retirar' : st.key === 'call' || st.key === 'bill' ? 'llamados' : 'tomar');
                  }}
                >
                  <TableNum n={n} tone={st.tone} size="lg" />
                  <Badge tone={st.tone}>{t(`state.${st.key}`)}</Badge>
                  {total ? <small>{formatArs(total, lang)}</small> : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}

      {tab === 'retirar' ? (
        ready.length ? (
          <ul className="lv-list">
            {ready.map((o) => (
              <OrderTicket
                key={o.id}
                order={o}
                lang={lang}
                big
                meta={t('readyFor', { n: minutesSince(o.at.ready, now) })}
                action={{ label: t('deliver'), variant: 'ok', icon: <UtensilsCrossed aria-hidden className="size-5" />, onClick: () => dispatch({ type: 'advance', id: o.id, to: 'delivered', now: Date.now() }) }}
              />
            ))}
          </ul>
        ) : (
          <Empty icon={<HandPlatter aria-hidden className="size-6" />} title={t('readyEmpty.title')} text={t('readyEmpty.text')} />
        )
      ) : null}

      {tab === 'llamados' ? (
        calls.length ? (
          <ul className="lv-list">
            {calls.map((c) => (
              <Card as="li" key={c.id} tone={c.kind === 'waiter' ? 'alert' : 'new'} className="lv-call">
                <TableNum n={c.table} tone={c.kind === 'waiter' ? 'alert' : 'gold'} />
                <div className="lv-call-text">
                  <b>
                    {c.kind === 'waiter' ? <BellRing aria-hidden className="size-4" /> : <Receipt aria-hidden className="size-4" />} {t(`call.${c.kind}`)}
                  </b>
                  <small>
                    {t('ago', { n: minutesSince(c.at, now) })}
                    {c.kind === 'bill' ? ` · ${formatArs(state.orders.filter((o) => o.table === c.table).reduce((s, o) => s + orderTotal(o), 0), lang)}` : ''}
                  </small>
                </div>
                <Button variant="main" onClick={() => dispatch({ type: 'callDone', id: c.id })}>
                  {t('attend')}
                </Button>
              </Card>
            ))}
          </ul>
        ) : (
          <Empty icon={<BellRing aria-hidden className="size-6" />} title={t('callsEmpty.title')} text={t('callsEmpty.text')} />
        )
      ) : null}

      {tab === 'tomar' ? <TakeOrder table={taking} onTable={setTaking} onSent={() => setTab('mesas')} /> : null}
    </div>
  );
}

/** Taking an order at the table: pick dishes (sold-out ones off), see the total, send it to the kitchen. */
function TakeOrder({ table, onTable, onSent }: { table: number; onTable: (n: number) => void; onSent: () => void }) {
  const t = useTranslations('lucero.live.mesero.take');
  const tw = useTranslations('lucero.live.mesero');
  const { state, dispatch, lang } = useLucero();
  const [lines, setLines] = useState<Line[]>([]);
  const [cat, setCat] = useState(MENU.categories[0].id);
  const add = (dish: string, d = 1) =>
    setLines((cur) => {
      const key = lineKey(dish, []);
      const hit = cur.find((l) => l.key === key);
      const next = hit ? cur.map((l) => (l.key === key ? { ...l, qty: l.qty + d } : l)) : d > 0 ? [...cur, { key, dish, options: [], qty: d }] : cur;
      return next.filter((l) => l.qty > 0);
    });
  const total = orderTotal({ lines });
  const count = lines.reduce((s, l) => s + l.qty, 0);
  const category = MENU.categories.find((c) => c.id === cat)!;

  return (
    <div className="lv-take">
      <div className="lv-take-head">
        <span>{t('table')}</span>
        <Stepper value={table} onChange={onTable} min={1} max={TABLES} label={t('table')} decLabel={t('tableDec')} incLabel={t('tableInc')} />
      </div>
      <div className="k-tabs" role="tablist" aria-label={t('cats')}>
        {MENU.categories.map((c) => (
          <button key={c.id} type="button" role="tab" aria-selected={c.id === cat} className="k-tab" onClick={() => setCat(c.id)}>
            {c.name[lang]}
          </button>
        ))}
      </div>
      <ul className="lv-dishes">
        {category.items.map((d) => {
          const out = dishSoldOut(state, d.id);
          const qty = lines.find((l) => l.dish === d.id)?.qty ?? 0;
          return (
            <li key={d.id} className="lv-dish" data-out={out || undefined}>
              <span className="lv-dish-name">
                <b>{d.name[lang]}</b>
                <small>{out ? tw('soldOut') : formatArs(DISHES[d.id].price, lang)}</small>
              </span>
              {qty ? (
                <button type="button" className="k-icon" onClick={() => add(d.id, -1)} aria-label={t('remove', { dish: d.name[lang] })}>
                  <Minus aria-hidden className="size-4" />
                </button>
              ) : null}
              {qty ? <output className="lv-dish-qty">{qty}</output> : null}
              <button type="button" className="k-icon" disabled={out} onClick={() => add(d.id)} aria-label={t('add', { dish: d.name[lang] })}>
                <Plus aria-hidden className="size-4" />
              </button>
            </li>
          );
        })}
      </ul>
      <div className="lv-take-foot">
        <span>
          {t('items', { n: count })} · <b>{formatArs(total, lang)}</b>
        </span>
        <Button
          variant="main"
          size="lg"
          disabled={!count}
          icon={<Send aria-hidden className="size-4" />}
          onClick={() => {
            dispatch({ type: 'send', id: `m${Date.now().toString(36)}`, guest: tw('tableN', { n: table }), note: '', now: Date.now(), table, lines, source: 'mozo' });
            setLines([]);
            onSent();
          }}
        >
          {t('send')}
        </Button>
      </div>
    </div>
  );
}
