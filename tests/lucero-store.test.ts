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
