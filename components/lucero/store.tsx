'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, type ReactNode } from 'react';
import menuJson from '@/content/lucero-menu.json';
import prizesJson from '@/content/lucero-prizes.json';
import type { PlanId } from '@/lib/plans';

/**
 * Lucero's demo state: one store shared by the guest's carta and the venue's CRM.
 *
 * Everything is fictional (Lucero is a demo venue). The guest's own orders (table 4, `mine`) move on their own: sent →
 * kitchen → ready → delivered, so «Mandar a la cocina» brings the plate back with no button to press (Ignacio,
 * 02/11/2026). The CRM can move any order by hand too; every transition is idempotent (`advance` only moves forward), so
 * the timers and the hand never fight. Tabs of the same browser stay in step over a BroadcastChannel; with the backend
 * (fase 12) devices do too.
 */

export type Lang = 'es' | 'en' | 'pt';
export type Localized = Record<Lang, string>;

export interface OptionGroup {
  multi: boolean;
  options: { id: string; label: Localized }[];
}
export interface Dish {
  id: string;
  name: Localized;
  desc: Localized;
  price: number;
  options: string | null;
  soldOut: boolean;
  adult: boolean;
}
export interface Category {
  id: string;
  name: Localized;
  kicker: Localized;
  photo: string | null;
  pose: string;
  say: Record<Lang, string[]>;
  items: Dish[];
}

export const MENU = menuJson as unknown as { currency: string; optionGroups: Record<string, OptionGroup>; categories: Category[] };
export const DISHES: Record<string, Dish & { cat: string }> = Object.fromEntries(
  MENU.categories.flatMap((c) => c.items.map((d) => [d.id, { ...d, cat: c.id }])),
);

export interface Line {
  key: string;
  dish: string;
  options: string[];
  qty: number;
}

export type OrderStatus = 'sent' | 'kitchen' | 'ready' | 'delivered';
export const ORDER_FLOW: OrderStatus[] = ['sent', 'kitchen', 'ready', 'delivered'];

export interface Order {
  id: string;
  table: number;
  guest: string;
  lines: Line[];
  note: string;
  status: OrderStatus;
  /** Epoch ms of each status reached. */
  at: Partial<Record<OrderStatus, number>>;
  source: 'qr' | 'mozo';
  mine: boolean;
  /** Round number for this table (1, 2…). */
  round: number;
}

export interface Customer {
  id: string;
  name: string;
  visits: number;
  spent: number;
  lastVisit: string;
  favourite: string;
  tags: string[];
  note: string;
}

export interface Prize {
  id: string;
  label: string;
  /** Weight in the wheel (relative odds). 0 = never. */
  weight: number;
}

export interface Spin {
  orderId: string;
  prize: string | null;
  code: string | null;
  at: number;
}

export interface LuceroState {
  cart: Line[];
  orders: Order[];
  /** Dishes the venue marked as sold out (on top of the menu's own). */
  out: Record<string, boolean>;
  customers: Customer[];
  guestName: string;
  billRequested: boolean;
  prizes: Prize[];
  spins: Spin[];
}

export const TABLE = 4;

/** Timings of the automatic flow for the guest's order (ms). Short, so the demo shows the whole loop. */
export const FLOW_MS: Record<Exclude<OrderStatus, 'delivered'>, number> = { sent: 2600, kitchen: 9000, ready: 4200 };

const minutes = (m: number) => Date.now() - m * 60_000;

function seedOrders(): Order[] {
  const o = (id: string, table: number, guest: string, lines: [string, number, string[]?][], status: OrderStatus, ago: number, source: Order['source']): Order => ({
    id,
    table,
    guest,
    lines: lines.map(([dish, qty, options = []]) => ({ key: `${dish}|${options.join(',')}`, dish, options, qty })),
    note: '',
    status,
    at: Object.fromEntries(ORDER_FLOW.slice(0, ORDER_FLOW.indexOf(status) + 1).map((s, i) => [s, minutes(ago - i * 3)])),
    source,
    mine: false,
    round: 1,
  });
  return [
    o('s1', 7, 'Martín', [['provo', 1]], 'sent', 3, 'qr'),
    o('s2', 2, 'Lucía', [['mila', 1], ['negroni', 2]], 'kitchen', 12, 'qr'),
    o('s3', 5, 'Diego', [['muzza', 1, ['singluten']], ['fuga', 1]], 'kitchen', 9, 'mozo'),
    o('s4', 1, 'Valeria', [['empa', 3]], 'ready', 15, 'qr'),
    o('s5', 9, 'Tomás', [['bife', 2, ['apunto']], ['aperol', 2]], 'delivered', 40, 'qr'),
  ];
}

const SEED_CUSTOMERS: Customer[] = [
  { id: 'c1', name: 'Lucía F.', visits: 9, spent: 214000, lastVisit: 'today', favourite: 'mila', tags: ['frequent'], note: '' },
  { id: 'c2', name: 'Martín G.', visits: 4, spent: 86000, lastVisit: 'today', favourite: 'provo', tags: [], note: '' },
  { id: 'c3', name: 'Diego R.', visits: 6, spent: 132000, lastVisit: 'today', favourite: 'fuga', tags: ['glutenFree'], note: '' },
  { id: 'c4', name: 'Valeria S.', visits: 2, spent: 31000, lastVisit: 'today', favourite: 'empa', tags: ['new'], note: '' },
  { id: 'c5', name: 'Tomás B.', visits: 12, spent: 388000, lastVisit: 'today', favourite: 'bife', tags: ['frequent', 'birthday'], note: '' },
  { id: 'c6', name: 'Sofía A.', visits: 1, spent: 18900, lastVisit: 'lastWeek', favourite: 'tabla', tags: ['new'], note: '' },
];

/** The wheel's example prizes, in the visitor's language (content/lucero-prizes.json). */
export const seedPrizes = (lang: Lang): Prize[] => prizesJson.prizes.map((p) => ({ id: p.id, label: p.label[lang], weight: p.weight }));

export function initialState(lang: Lang = 'es'): LuceroState {
  return {
    cart: [],
    orders: seedOrders(),
    out: {},
    customers: SEED_CUSTOMERS,
    guestName: '',
    billRequested: false,
    prizes: seedPrizes(lang),
    spins: [],
  };
}

export type Action =
  | { type: 'add'; dish: string; options: string[] }
  | { type: 'qty'; key: string; delta: number }
  | { type: 'send'; id: string; guest: string; note: string; now: number }
  | { type: 'advance'; id: string; to: OrderStatus; now: number }
  | { type: 'toggleOut'; dish: string }
  | { type: 'bill' }
  | { type: 'setPrizes'; prizes: Prize[] }
  | { type: 'spin'; spin: Spin }
  | { type: 'note'; customer: string; note: string }
  | { type: 'snapshot'; state: LuceroState }
  | { type: 'reset' };

export const lineKey = (dish: string, options: string[]) => `${dish}|${[...options].sort().join(',')}`;

export function reducer(state: LuceroState, action: Action): LuceroState {
  switch (action.type) {
    case 'add': {
      const key = lineKey(action.dish, action.options);
      const hit = state.cart.find((l) => l.key === key);
      const cart = hit
        ? state.cart.map((l) => (l.key === key ? { ...l, qty: l.qty + 1 } : l))
        : [...state.cart, { key, dish: action.dish, options: [...action.options].sort(), qty: 1 }];
      return { ...state, cart };
    }
    case 'qty':
      return { ...state, cart: state.cart.map((l) => (l.key === action.key ? { ...l, qty: l.qty + action.delta } : l)).filter((l) => l.qty > 0) };
    case 'send': {
      if (!state.cart.length || state.orders.some((o) => o.id === action.id)) return state;
      const round = state.orders.filter((o) => o.mine).length + 1;
      const order: Order = {
        id: action.id,
        table: TABLE,
        guest: action.guest,
        lines: state.cart,
        note: action.note,
        status: 'sent',
        at: { sent: action.now },
        source: 'qr',
        mine: true,
        round,
      };
      const total = orderTotal(order);
      const known = state.customers.find((c) => c.name.toLowerCase() === action.guest.toLowerCase());
      const customers = known
        ? state.customers.map((c) => (c === known ? { ...c, visits: round === 1 ? c.visits + 1 : c.visits, spent: c.spent + total, lastVisit: 'today' } : c))
        : [{ id: `g-${action.id}`, name: action.guest, visits: 1, spent: total, lastVisit: 'today', favourite: order.lines[0]?.dish ?? '', tags: ['new'], note: '' }, ...state.customers];
      return { ...state, cart: [], orders: [order, ...state.orders], guestName: action.guest, customers, billRequested: false };
    }
    case 'advance': {
      let changed = false;
      const orders = state.orders.map((o) => {
        if (o.id !== action.id) return o;
        if (ORDER_FLOW.indexOf(action.to) <= ORDER_FLOW.indexOf(o.status)) return o;
        changed = true;
        return { ...o, status: action.to, at: { ...o.at, [action.to]: action.now } };
      });
      return changed ? { ...state, orders } : state;
    }
    case 'toggleOut':
      return { ...state, out: { ...state.out, [action.dish]: !state.out[action.dish] } };
    case 'bill':
      return { ...state, billRequested: true };
    case 'setPrizes':
      return { ...state, prizes: action.prizes };
    case 'spin':
      return state.spins.some((s) => s.orderId === action.spin.orderId) ? state : { ...state, spins: [...state.spins, action.spin] };
    case 'note':
      return { ...state, customers: state.customers.map((c) => (c.id === action.customer ? { ...c, note: action.note } : c)) };
    case 'snapshot':
      return action.state;
    case 'reset':
      return initialState();
  }
}

export const dishSoldOut = (state: LuceroState, dish: string) => !!(DISHES[dish]?.soldOut || state.out[dish]);
export const lineTotal = (l: Line) => (DISHES[l.dish]?.price ?? 0) * l.qty;
export const orderTotal = (o: Pick<Order, 'lines'>) => o.lines.reduce((s, l) => s + lineTotal(l), 0);
export const cartCount = (cart: Line[]) => cart.reduce((s, l) => s + l.qty, 0);
export const myOrders = (state: LuceroState) => state.orders.filter((o) => o.mine);
export const activeMine = (state: LuceroState) => myOrders(state).find((o) => o.status !== 'delivered') ?? null;
export const tableTotal = (state: LuceroState) => myOrders(state).reduce((s, o) => s + orderTotal(o), 0);

export function formatArs(n: number, lang: Lang) {
  return `$ ${n.toLocaleString(lang === 'en' ? 'en-US' : lang === 'pt' ? 'pt-BR' : 'es-AR')}`;
}

/** Weighted pick; `rand` in [0, 1). Prizes with weight 0 never come out. Returns null when there is nothing to win. */
export function pickPrize(prizes: Prize[], rand: number): Prize | null {
  const pool = prizes.filter((p) => p.weight > 0);
  const total = pool.reduce((s, p) => s + p.weight, 0);
  if (total <= 0) return null;
  let x = rand * total;
  for (const p of pool) {
    x -= p.weight;
    if (x < 0) return p;
  }
  return pool[pool.length - 1];
}

/* ------------------------------------------------------------------ */
/* Provider                                                             */
/* ------------------------------------------------------------------ */

interface Ctx {
  state: LuceroState;
  dispatch: (a: Action) => void;
  plan: PlanId | null;
  lang: Lang;
}

const LuceroCtx = createContext<Ctx | null>(null);
const CHANNEL = 'lucero-demo-v1';

export function LuceroProvider({ plan, lang, children }: { plan: PlanId | null; lang: Lang; children: ReactNode }) {
  const [state, rawDispatch] = useReducer(reducer, lang, initialState);
  const channel = useRef<BroadcastChannel | null>(null);
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Tabs of the same browser share the demo: every local action is mirrored; a new tab asks for the current state.
  useEffect(() => {
    if (typeof BroadcastChannel === 'undefined') return;
    const ch = new BroadcastChannel(CHANNEL);
    channel.current = ch;
    ch.onmessage = (e: MessageEvent<{ kind: string; action?: Action; state?: LuceroState }>) => {
      const msg = e.data;
      if (msg.kind === 'action' && msg.action) rawDispatch(msg.action);
      else if (msg.kind === 'hello') ch.postMessage({ kind: 'state', state: stateRef.current });
      else if (msg.kind === 'state' && msg.state) rawDispatch({ type: 'snapshot', state: msg.state });
    };
    ch.postMessage({ kind: 'hello' });
    return () => {
      ch.close();
      channel.current = null;
    };
  }, []);

  const dispatch = useCallback((action: Action) => {
    rawDispatch(action);
    if (action.type !== 'snapshot') channel.current?.postMessage({ kind: 'action', action });
  }, []);

  // The guest's orders move on their own. Each pending order schedules its next step; the CRM may get there first.
  useEffect(() => {
    const timers = state.orders
      .filter((o) => o.mine && o.status !== 'delivered')
      .map((o) => {
        const step = o.status as Exclude<OrderStatus, 'delivered'>;
        const since = o.at[step] ?? Date.now();
        const wait = Math.max(200, FLOW_MS[step] - (Date.now() - since));
        const to = ORDER_FLOW[ORDER_FLOW.indexOf(step) + 1];
        return window.setTimeout(() => dispatch({ type: 'advance', id: o.id, to, now: Date.now() }), wait);
      });
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [state.orders, dispatch]);

  const value = useMemo(() => ({ state, dispatch, plan, lang }), [state, dispatch, plan, lang]);
  return <LuceroCtx.Provider value={value}>{children}</LuceroCtx.Provider>;
}

export function useLucero() {
  const ctx = useContext(LuceroCtx);
  if (!ctx) throw new Error('useLucero outside LuceroProvider');
  return ctx;
}
