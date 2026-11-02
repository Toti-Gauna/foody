import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { firstPlanWith, firstPlanWithGame, includes, planFromSearch, plans, PLAN_IDS } from '@/lib/plans';

type Tree = { [k: string]: string | Tree };
const LOCALES = ['es', 'en', 'pt'] as const;
const strings = (tree: Tree): string[] => Object.values(tree).flatMap((v) => (typeof v === 'string' ? [v] : strings(v)));
const messages = Object.fromEntries(LOCALES.map((l) => [l, JSON.parse(readFileSync(new URL(`../messages/${l}.json`, import.meta.url), 'utf8')) as Tree]));

describe('plans (content/plans.json, Ignacio 02/11/2026)', () => {
  // Changing a price or what a plan includes is a decision of Ignacio: update docs/PLAN-EJECUCION.md and this digest.
  it('is pinned by its digest', () => {
    const bytes = readFileSync(new URL('../content/plans.json', import.meta.url));
    expect(createHash('sha256').update(bytes).digest('hex')).toBe('7c8587cc7ab38ebe635d4c6b2ae7f911fe0bcfe9e96150d7dc83809b9d727085');
    expect(plans.map((p) => [p.id, p.priceUsd])).toEqual([
      ['25', 25],
      ['50', 50],
      ['75', 75],
    ]);
  });

  it('each plan includes everything in the cheaper ones', () => {
    for (let i = 1; i < plans.length; i++) {
      for (const f of plans[i - 1].features) expect(plans[i].features, `${plans[i].id} ${f}`).toContain(f);
      for (const g of plans[i - 1].games) expect(plans[i].games, `${plans[i].id} ${g}`).toContain(g);
    }
  });

  it('says where each thing starts', () => {
    expect(firstPlanWith('crm').id).toBe('25');
    expect(firstPlanWith('ruleta').id).toBe('50');
    expect(firstPlanWith('academy').id).toBe('75');
    expect(firstPlanWithGame('ninja').id).toBe('50');
    expect(firstPlanWithGame('hockey').id).toBe('75');
    expect(includes('25', 'juegos')).toBe(false);
    expect(includes('75', 'mesa')).toBe(true);
  });

  it('reads ?plan= against the list and ignores anything else', () => {
    expect(planFromSearch('?plan=50')).toBe('50');
    expect(planFromSearch('?plan=100')).toBeNull();
    expect(planFromSearch('?plan=<script>')).toBeNull();
    expect(planFromSearch('')).toBeNull();
    expect(PLAN_IDS).toEqual(['25', '50', '75']);
  });

  it.each(LOCALES)('no copy in %s types a price: every amount comes from the catalog', (locale) => {
    const amount = /\b(USD|ARS|BRL|EUR)\s?\d|US\$|R\$|€\s?\d|\$\s?\d|\b(25|50|75)\s?(usd|dólares|dollars|dólares)/i;
    for (const text of strings(messages[locale])) expect(text, text).not.toMatch(amount);
  });
});
