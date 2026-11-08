'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, type ReactNode } from 'react';
import menuJson from '@/content/lucero-menu.json';
import prizesJson from '@/content/lucero-prizes.json';
import type { PlanId } from '@/lib/plans';
import { openSync, type SyncLink } from './sync';

/**
 * Lucero's demo state: one store shared by the guest's carta and the venue's CRM.
 *
 * Everything is fictional (Lucero is a demo venue). The guest's own orders (table 4, `mine`) move on their own: sent →
 * kitchen → ready → delivered, so «Mandar a la cocina» brings the plate back with no button to press (Ignacio,
 * 02/11/2026). The CRM can move any order by hand too; every transition is idempotent (`advance` only moves forward), so
 * the timers and the hand never fight. Tabs of the same browser stay in step over a BroadcastChannel; with the backend
 * (fase 12) devices paired with a code do too (`sync.ts`).
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
  /** Live mode: the device that sent it (a table's phone or a waiter's). */
  by?: string;
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

/** The wheel's spin key for the table's visit: one spin per visit, offered when the carta opens. */
export const VISIT = 'visita';

export interface Spin {
  /** `VISIT` for the visit's spin (older demos keyed it by order). */
  orderId: string;
  prize: string | null;
  code: string | null;
  at: number;
}

/** Live mode: a table asking for the bill or calling the waiter, until a waiter takes it. */
export interface Call {
  id: string;
  table: number;
  kind: 'bill' | 'waiter';
  at: number;
  done: boolean;
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
  /** Live mode: tables calling (bill, waiter). */
  calls: Call[];
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

/** The demo starts with an evening already going; a live venue (`live`) starts empty, with only its menu and prizes. */
export function initialState(lang: Lang = 'es', live = false): LuceroState {
  return {
    cart: [],
    orders: live ? [] : seedOrders(),
    out: {},
    customers: live ? [] : SEED_CUSTOMERS,
    guestName: '',
    billRequested: false,
    prizes: seedPrizes(lang),
    spins: [],
    calls: [],
  };
}

export type Action =
  | { type: 'add'; dish: string; options: string[] }
  | { type: 'qty'; key: string; delta: number }
  | { type: 'send'; id: string; guest: string; note: string; now: number; table?: number; by?: string; lines?: Line[]; source?: Order['source']; mine?: boolean }
  | { type: 'advance'; id: string; to: OrderStatus; now: number }
  | { type: 'toggleOut'; dish: string }
  | { type: 'bill'; table?: number; id?: string; now?: number }
  | { type: 'call'; id: string; table: number; now: number }
  | { type: 'callDone'; id: string }
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
      // Live mode sends the lines with the order (the venue's phone has no cart of its own); the demo uses the cart.
      const lines = action.lines ?? state.cart;
      if (!lines.length || state.orders.some((o) => o.id === action.id)) return state;
      const table = action.table ?? TABLE;
      const round = action.table === undefined ? state.orders.filter((o) => o.mine).length + 1 : state.orders.filter((o) => o.table === table).length + 1;
      const order: Order = {
        id: action.id,
        table,
        guest: action.guest,
        lines,
        note: action.note,
        status: 'sent',
        at: { sent: action.now },
        source: action.source ?? 'qr',
        mine: action.mine ?? true,
        round,
        ...(action.by ? { by: action.by } : {}),
      };
      const total = orderTotal(order);
      const known = state.customers.find((c) => c.name.toLowerCase() === action.guest.toLowerCase());
      const customers = known
        ? state.customers.map((c) => (c === known ? { ...c, visits: round === 1 ? c.visits + 1 : c.visits, spent: c.spent + total, lastVisit: 'today' } : c))
        : [{ id: `g-${action.id}`, name: action.guest, visits: 1, spent: total, lastVisit: 'today', favourite: order.lines[0]?.dish ?? '', tags: ['new'], note: '' }, ...state.customers];
      const fromCart = !action.lines;
      return { ...state, cart: fromCart ? [] : state.cart, orders: [order, ...state.orders], guestName: action.guest || state.guestName, customers, billRequested: false };
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
    case 'bill': {
      if (action.table === undefined) return { ...state, billRequested: true };
      const id = action.id ?? `bill-${action.table}`;
      const calls = state.calls.some((c) => c.id === id && !c.done) ? state.calls : [{ id, table: action.table, kind: 'bill' as const, at: action.now ?? Date.now(), done: false }, ...state.calls.filter((c) => c.id !== id)];
      return { ...state, billRequested: true, calls };
    }
    case 'call':
      return state.calls.some((c) => c.id === action.id) ? state : { ...state, calls: [{ id: action.id, table: action.table, kind: 'waiter', at: action.now, done: false }, ...state.calls] };
    case 'callDone':
      return { ...state, calls: state.calls.map((c) => (c.id === action.id ? { ...c, done: true } : c)) };
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

/**
 * Live mode («Local en vivo»): several phones share one venue, each in a role. The owner's phone is the authority: it
 * applies what the others send and hands everyone the venue's state. A phone keeps its own cart, name and bill flag;
 * «mine» means sent from this phone. Messages: `v-action` (to the owner), `v-state` (from the owner).
 */
export type LiveRole = 'mesa' | 'mesero' | 'cocina' | 'dueno';
export interface LiveLink {
  /** The venue's code: the owner's phone keeps the venue under it, so a reload doesn't wipe the night. */
  venue: string;
  deviceId: string;
  isHost: boolean;
  role: LiveRole;
  /** The table this phone sits at (role `mesa`). */
  table: number | null;
  send(type: string, payload: unknown): void;
  subscribe(fn: (type: string, payload: unknown, from: string) => void): () => void;
}

interface Ctx {
  state: LuceroState;
  dispatch: (a: Action) => void;
  plan: PlanId | null;
  lang: Lang;
  /** The table this carta belongs to (4 in the demo). */
  table: number;
  /** The wheel's spin key for this visit (per phone in live mode). */
  visitKey: string;
  live: LiveLink | null;
}

const venueKey = (code: string) => `lucero-venue-${code}`;
/** The venue the owner's phone saved, if it is still a valid state (from this browser, checked like any remote one). */
function savedVenue(code: string): LuceroState | null {
  try {
    const raw = typeof window !== 'undefined' ? window.localStorage.getItem(venueKey(code)) : null;
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    return isLuceroState(parsed) ? { ...parsed, calls: parsed.calls ?? [] } : null;
  } catch {
    return null;
  }
}

/** What only this phone has: kept when the owner's state arrives. */
const LOCAL_ONLY = new Set<Action['type']>(['add', 'qty']);

const LuceroCtx = createContext<Ctx | null>(null);
const CHANNEL = 'lucero-demo-v1';
type SyncMsg = { kind: 'hello' } | { kind: 'action'; action: Action } | { kind: 'state'; state: LuceroState };
/** What another tab or device may ask the store to do (never `snapshot`: a whole state comes only as `state`). */
const REMOTE_ACTIONS = new Set<Action['type']>(['add', 'qty', 'send', 'advance', 'toggleOut', 'bill', 'call', 'callDone', 'setPrizes', 'spin', 'note', 'reset']);
const isObj = (x: unknown): x is Record<string, unknown> => !!x && typeof x === 'object' && !Array.isArray(x);
/** A state from elsewhere, checked enough that rendering it can't crash the demo. */
export function isLuceroState(x: unknown): x is LuceroState {
  if (!isObj(x)) return false;
  const arrays = ['cart', 'orders', 'customers', 'prizes', 'spins'] as const;
  if (!arrays.every((k) => Array.isArray(x[k])) || !isObj(x.out) || typeof x.guestName !== 'string') return false;
  if (x.calls !== undefined && !(Array.isArray(x.calls) && x.calls.every((c) => isObj(c) && typeof c.id === 'string' && typeof c.table === 'number'))) return false;
  const orders = x.orders as unknown[];
  return orders.every((o) => isObj(o) && typeof o.id === 'string' && Array.isArray(o.lines) && ORDER_FLOW.includes(o.status as OrderStatus) && isObj(o.at) && o.lines.every((l) => isObj(l) && typeof l.dish === 'string' && l.dish in DISHES && Array.isArray(l.options)));
}

export function LuceroProvider({
  plan,
  lang,
  syncCode,
  syncLead = false,
  live = null,
  children,
}: {
  plan: PlanId | null;
  lang: Lang;
  syncCode?: string | null;
  /** The device that made the pairing code: the only one that answers with the whole state. */
  syncLead?: boolean;
  /** «Local en vivo»: this phone's role and its link to the others. */
  live?: LiveLink | null;
  children: ReactNode;
}) {
  const [state, rawDispatch] = useReducer(reducer, lang, (l: Lang) => (live?.isHost ? savedVenue(live.venue) : null) ?? initialState(l, !!live));
  const channel = useRef<BroadcastChannel | null>(null);
  const remote = useRef<SyncLink | null>(null);
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // What another tab or device says: an action to mirror, a hello to answer with the current state, or that state.
  // Nothing from outside is trusted: unknown actions, ones that would throw and malformed states are dropped.
  const receive = useCallback((raw: unknown, reply: ((msg: SyncMsg) => void) | null) => {
    if (!isObj(raw)) return;
    if (raw.kind === 'action' && isObj(raw.action) && REMOTE_ACTIONS.has(raw.action.type as Action['type'])) {
      const action = raw.action as unknown as Action;
      try {
        if (!isLuceroState(reducer(stateRef.current, action))) return;
      } catch {
        return;
      }
      rawDispatch(action);
    } else if (raw.kind === 'hello') reply?.({ kind: 'state', state: stateRef.current });
    else if (raw.kind === 'state' && isLuceroState(raw.state)) rawDispatch({ type: 'snapshot', state: raw.state });
  }, []);

  // Tabs of the same browser share the demo: every local action is mirrored; a new tab asks for the current state.
  useEffect(() => {
    if (live || typeof BroadcastChannel === 'undefined') return;
    const ch = new BroadcastChannel(CHANNEL);
    channel.current = ch;
    ch.onmessage = (e: MessageEvent<unknown>) => receive(e.data, (m) => ch.postMessage(m));
    ch.postMessage({ kind: 'hello' });
    return () => {
      ch.close();
      channel.current = null;
    };
  }, [receive, live]);

  // Live mode, the owner's phone: apply what the others send (checked like any remote action) and hand the venue's
  // state to everyone when it changes, and every few seconds for phones that just arrived.
  useEffect(() => {
    if (!live) return;
    if (live.isHost)
      return live.subscribe((type, payload) => {
        if (type !== 'v-action' || !isObj(payload) || !REMOTE_ACTIONS.has(payload.type as Action['type'])) return;
        let action = payload as unknown as Action;
        if (action.type === 'send') action = { ...action, mine: false };
        try {
          if (!isLuceroState(reducer(stateRef.current, action))) return;
        } catch {
          return;
        }
        rawDispatch(action);
      });
    return live.subscribe((type, payload) => {
      if (type !== 'v-state' || !isLuceroState(payload)) return;
      const cur = stateRef.current;
      rawDispatch({
        type: 'snapshot',
        state: { ...payload, calls: payload.calls ?? [], cart: cur.cart, guestName: cur.guestName, billRequested: cur.billRequested, orders: payload.orders.map((o) => ({ ...o, mine: !!o.by && o.by === live.deviceId })) },
      });
    });
  }, [live]);
  // The owner's phone keeps the venue (orders, calls, stock, prizes) across a reload.
  useEffect(() => {
    if (!live?.isHost) return;
    const id = window.setTimeout(() => {
      try {
        window.localStorage.setItem(venueKey(live.venue), JSON.stringify({ ...state, cart: [], guestName: '', billRequested: false }));
      } catch {
        /* storage off or full: the venue lives while the tab does */
      }
    }, 400);
    return () => window.clearTimeout(id);
  }, [live, state]);
  useEffect(() => {
    if (!live?.isHost) return;
    const share = () => {
      const s = stateRef.current;
      live.send('v-state', { ...s, cart: [], guestName: '', billRequested: false });
    };
    const soon = window.setTimeout(share, 80);
    const beat = window.setInterval(share, 2500);
    return () => {
      window.clearTimeout(soon);
      window.clearInterval(beat);
    };
  }, [live, state]);

  // Devices paired with a code (`?sync=`) do the same through Foody-be, when there is one. One device leads (the one
  // that made the code): it answers hellos and never asks. The other asks on every (re)connection, after sending what it
  // did offline, so the answer already has it and both end up equal.
  useEffect(() => {
    if (!syncCode) return;
    const link = openSync(
      `lucero-demo-${syncCode}`,
      (msg) => receive(msg, syncLead ? (m) => link?.send(m) : null),
      () => {
        if (!syncLead) link?.send({ kind: 'hello' });
      },
    );
    remote.current = link;
    return () => {
      link?.close();
      remote.current = null;
    };
  }, [syncCode, syncLead, receive]);

  const dispatch = useCallback(
    (action: Action) => {
      if (live) {
        // Every order and bill carries this phone's table and id; the order its own lines (the owner has no cart).
        let a = action;
        if (a.type === 'send') a = { ...a, table: a.table ?? live.table ?? TABLE, by: live.deviceId, lines: a.lines ?? stateRef.current.cart, mine: true };
        if (a.type === 'bill' && a.table === undefined && live.table !== null) a = { ...a, table: live.table, id: `bill-${live.table}`, now: Date.now() };
        rawDispatch(a);
        if (!live.isHost && !LOCAL_ONLY.has(a.type) && a.type !== 'snapshot') live.send('v-action', a);
        return;
      }
      rawDispatch(action);
      if (action.type === 'snapshot') return;
      channel.current?.postMessage({ kind: 'action', action });
      remote.current?.send({ kind: 'action', action });
    },
    [live],
  );

  // The guest's orders move on their own. Each pending order schedules its next step; the CRM may get there first.
  // Live mode: no — the kitchen and the waiters move them, for real.
  useEffect(() => {
    if (live) return;
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
  }, [state.orders, dispatch, live]);

  const value = useMemo(
    () => ({ state, dispatch, plan, lang, table: live?.table ?? TABLE, visitKey: live ? `visita-${live.deviceId}` : VISIT, live }),
    [state, dispatch, plan, lang, live],
  );
  return <LuceroCtx.Provider value={value}>{children}</LuceroCtx.Provider>;
}

export function useLucero() {
  const ctx = useContext(LuceroCtx);
  if (!ctx) throw new Error('useLucero outside LuceroProvider');
  return ctx;
}
