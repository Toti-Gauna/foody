import { describe, expect, it } from 'vitest';
import { isSeason, seasonForDate } from '@/lib/seasons';

const on = (m: number, d: number) => seasonForDate(new Date(2026, m - 1, d, 12));

describe('fechas especiales', () => {
  it('dresses up on the date and goes back to normal after', () => {
    expect(on(10, 19)).toBe('clasica');
    expect(on(10, 31)).toBe('halloween');
    expect(on(11, 2)).toBe('halloween');
    expect(on(11, 4)).toBe('clasica');
    expect(on(12, 24)).toBe('navidad');
    expect(on(1, 6)).toBe('navidad');
    expect(on(1, 7)).toBe('clasica');
    expect(on(2, 14)).toBe('sanvalentin');
    expect(on(7, 9)).toBe('clasica');
  });

  it('only takes the seasons it knows', () => {
    expect(isSeason('navidad')).toBe(true);
    expect(isSeason('pascua')).toBe(false);
    expect(isSeason(null)).toBe(false);
  });
});
