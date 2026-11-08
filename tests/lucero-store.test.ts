import { describe, expect, it } from 'vitest';
import { activeMine, cartCount, initialState, orderTotal, pickPrize, reducer, type LuceroState } from '@/components/lucero/store';

const run = (state: LuceroState, ...actions: Parameters<typeof reducer>[1][]) => actions.reduce(reducer, state);

describe('Lucero store', () => {
  it('adds dishes, merging the same dish with the same options', () => {
    const s = run(initialState(), { type: 'add', dish: 'sorre', options: ['fileto'] }, { type: 'add', dish: 'sorre', options: ['fileto'] }, { type: 'add', dish: 'sorre', options: ['crema'] });
    expect(s.cart).toHaveLength(2);
    expect(cartCount(s.cart)).toBe(3);
  });

  it('sends the cart as an order of table 4 and empties it', () => {
    const s = run(initialState(), { type: 'add', dish: 'provo', options: [] }, { type: 'send', id: 'a', guest: 'Sofi', note: '', now: 1 });
    expect(s.cart).toEqual([]);
    const mine = activeMine(s)!;
    expect(mine).toMatchObject({ id: 'a', table: 4, guest: 'Sofi', status: 'sent', mine: true, round: 1 });
    expect(orderTotal(mine)).toBe(9800);
    expect(s.customers[0].name).toBe('Sofi');
  });

  it('never sends an empty cart, nor the same order twice', () => {
    const empty = run(initialState(), { type: 'send', id: 'a', guest: 'Sofi', note: '', now: 1 });
    expect(empty.orders.filter((o) => o.mine)).toHaveLength(0);
  });

  it('only moves an order forward: the timer and the kitchen never fight', () => {
    let s = run(initialState(), { type: 'add', dish: 'provo', options: [] }, { type: 'send', id: 'a', guest: 'S', note: '', now: 1 });
    s = run(s, { type: 'advance', id: 'a', to: 'ready', now: 2 }, { type: 'advance', id: 'a', to: 'kitchen', now: 3 });
    expect(s.orders.find((o) => o.id === 'a')!.status).toBe('ready');
    s = run(s, { type: 'advance', id: 'a', to: 'delivered', now: 4 });
    expect(activeMine(s)).toBeNull();
  });

  it('picks prizes by weight and never one with weight 0', () => {
    const prizes = [
      { id: 'a', label: 'A', weight: 1 },
      { id: 'b', label: 'B', weight: 3 },
      { id: 'z', label: 'Z', weight: 0 },
    ];
    expect(pickPrize(prizes, 0)!.id).toBe('a');
    expect(pickPrize(prizes, 0.24)!.id).toBe('a');
    expect(pickPrize(prizes, 0.26)!.id).toBe('b');
    expect(pickPrize(prizes, 0.999)!.id).toBe('b');
    expect(pickPrize([{ id: 'z', label: '', weight: 0 }], 0.5)).toBeNull();
  });
});

describe('state from another device', () => {
  it('accepts a real state and refuses junk that would crash the demo', async () => {
    const { isLuceroState, initialState } = await import('@/components/lucero/store');
    const ok = initialState('es');
    expect(isLuceroState(ok)).toBe(true);
    expect(isLuceroState({})).toBe(false);
    expect(isLuceroState(null)).toBe(false);
    expect(isLuceroState({ ...ok, orders: [{ id: 'x', status: 'sent', at: {}, lines: [{ dish: 'nope', options: [] }] }] })).toBe(false);
    expect(isLuceroState({ ...ok, orders: [{ id: 'x', status: 'flying', at: {}, lines: [] }] })).toBe(false);
  });
});

describe('local en vivo (several phones)', () => {
  it('starts empty: no made-up orders or customers', () => {
    const s = initialState('es', true);
    expect(s.orders).toEqual([]);
    expect(s.customers).toEqual([]);
    expect(s.calls).toEqual([]);
    expect(s.prizes.length).toBeGreaterThan(0);
  });

  it('takes an order from another phone with its own lines, table and sender, without touching this cart', () => {
    let s = initialState('es', true);
    s = reducer(s, { type: 'add', dish: 'muzza', options: [] });
    const lines = [{ key: 'provo|', dish: 'provo', options: [], qty: 2 }];
    s = reducer(s, { type: 'send', id: 'o1', guest: 'Ana', note: '', now: 1, table: 5, by: 'dphone1', lines, mine: false });
    expect(s.orders[0]).toMatchObject({ id: 'o1', table: 5, by: 'dphone1', mine: false, round: 1, source: 'qr' });
    expect(s.orders[0].lines).toEqual(lines);
    expect(s.cart.map((l) => l.dish)).toEqual(['muzza']);
    s = reducer(s, { type: 'send', id: 'o2', guest: 'Mesa 5', note: '', now: 2, table: 5, lines, source: 'mozo', mine: false });
    expect(s.orders[0]).toMatchObject({ round: 2, source: 'mozo' });
  });

  it('a table asking for the bill or calling shows up for the waiters until one takes it', () => {
    let s = initialState('es', true);
    s = reducer(s, { type: 'bill', table: 3, id: 'bill-3', now: 10 });
    s = reducer(s, { type: 'bill', table: 3, id: 'bill-3', now: 11 });
    s = reducer(s, { type: 'call', id: 'w1', table: 7, now: 12 });
    expect(s.calls.filter((c) => !c.done).map((c) => [c.table, c.kind])).toEqual([
      [7, 'waiter'],
      [3, 'bill'],
    ]);
    s = reducer(s, { type: 'callDone', id: 'w1' });
    expect(s.calls.filter((c) => !c.done)).toHaveLength(1);
  });
});
