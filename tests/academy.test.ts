import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import academy from '@/content/academy.json';

const LANGS = ['es', 'en', 'pt'] as const;

describe('Eclipse Academy', () => {
  it('has the two sections Ignacio asked for, each with videos, documents and photos', () => {
    expect(academy.sections.map((s) => s.id)).toEqual(['digital', 'fisico']);
    for (const s of academy.sections) for (const kind of ['video', 'doc', 'photo']) expect(s.items.some((i) => i.type === kind)).toBe(true);
  });

  it('says everything in the three languages, and every document has its steps', () => {
    for (const s of academy.sections)
      for (const i of s.items as { type: string; title: Record<string, string>; summary: Record<string, string>; body?: Record<string, string[]> }[])
        for (const l of LANGS) {
          expect(i.title[l]).toBeTruthy();
          expect(i.summary[l]).toBeTruthy();
          if (i.type === 'doc') expect(i.body?.[l].length).toBe(i.body?.es.length);
        }
  });

  it('only points at photos that exist', () => {
    for (const s of academy.sections) for (const i of s.items as { src?: string }[]) if (i.src) expect(existsSync(join('public', i.src))).toBe(true);
  });
});
