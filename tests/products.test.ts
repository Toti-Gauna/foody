import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { launchDate, otherProducts, products } from '@/lib/products';
import { whatsappUrl } from '@/lib/whatsapp';
import { WHATSAPP_NUMBER } from '@/lib/env';

type Tree = { [k: string]: string | Tree };
const LOCALES = ['es', 'en', 'pt'] as const;
const messages = Object.fromEntries(LOCALES.map((l) => [l, JSON.parse(readFileSync(new URL(`../messages/${l}.json`, import.meta.url), 'utf8')) as Tree]));
const get = (tree: Tree, key: string) => key.split('.').reduce<string | Tree | undefined>((node, k) => (node && typeof node === 'object' ? node[k] : undefined), tree);
const strings = (tree: Tree): string[] => Object.values(tree).flatMap((v) => (typeof v === 'string' ? [v] : strings(v)));

describe('products (content/products.json, a copy of Eclipse-Web via roofy)', () => {
  // The same file lives in Eclipse-Web (content/products.json, 76767ea) and roofy. If it changes there, copy it and update
  // this digest and `site.others` in messages. Its Foody entry still says «planned» with no price: changing that is a cycle
  // in Eclipse-Web (docs/PLAN-EJECUCION.md, decision 8).
  it('is the copy pinned by its digest', () => {
    const bytes = readFileSync(new URL('../content/products.json', import.meta.url));
    expect(createHash('sha256').update(bytes).digest('hex')).toBe('8d2d6596a3924d7374f1f7dfa76e9c80565a968a9c125b237d302b9de66a06a3');
  });

  it('«otros negocios» lists every product but this one, Roofy first, and nothing that is only «próximamente»', () => {
    expect(otherProducts.map((p) => p.id)).toEqual(['roofy', 'markyt', 'handy']);
  });

  it('is honest about status: only Roofy is on sale', () => {
    expect(products.filter((p) => p.status === 'available').map((p) => p.id)).toEqual(['roofy']);
    expect(launchDate(products.find((p) => p.id === 'handy')!, 'es')).toBe('10 de noviembre de 2026');
  });

  it.each(LOCALES)('every product in the list has its copy in %s', (locale) => {
    for (const p of otherProducts) {
      const base = `site.others.items.${p.id}`;
      for (const key of ['name', 'rubro', 'line', 'ask']) expect(typeof get(messages[locale], `${base}.${key}`), `${locale} ${p.id}.${key}`).toBe('string');
      for (const point of p.points) expect(typeof get(messages[locale], `${base}.points.${point}`), `${locale} ${p.id}.points.${point}`).toBe('string');
    }
  });

  it.each(LOCALES)('«otros negocios» in %s never states a price, in any currency', (locale) => {
    const others = get(messages[locale], 'site.others') as Tree;
    const price = /\b(USD|ARS|BRL|EUR)\b|US\$|R\$|€|\$\s?\d|\d\s?(\/\s?mes|\/\s?month|\/\s?mês)|dólar|dollar|pesos?|reais|euros?|por mes|al mes|mensual|monthly|per month|a month|por mês|mensal/i;
    for (const text of strings(others)) expect(text, text).not.toMatch(price);
  });
});

describe('whatsapp', () => {
  it("points to Ignacio's number (223 446-7881) and encodes the prefilled message", () => {
    expect(WHATSAPP_NUMBER).toBe('5492234467881');
    expect(whatsappUrl('Hola, quiero el plan')).toBe(`https://wa.me/5492234467881?text=${encodeURIComponent('Hola, quiero el plan')}`);
  });
});
