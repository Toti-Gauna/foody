/**
 * Fechas especiales (Ignacio, 02/11/2026: «hacelo temático por fechas: que en Navidad cambie todo a estética navidad, y
 * así con Halloween»). The demo dresses up by itself on the date, and the shell lets anyone see any of them (to show
 * what a venue could have done for the last one). A season changes colours, decorations, the wheel and the games; never
 * prices, plans or what is included.
 */
export const SEASONS = ['clasica', 'halloween', 'navidad', 'sanvalentin'] as const;
export type Season = (typeof SEASONS)[number];

/** Windows by month and day, inclusive. Navidad crosses New Year. */
const WINDOWS: { season: Exclude<Season, 'clasica'>; from: [number, number]; to: [number, number] }[] = [
  { season: 'halloween', from: [10, 20], to: [11, 3] },
  { season: 'navidad', from: [12, 1], to: [1, 6] },
  { season: 'sanvalentin', from: [2, 7], to: [2, 15] },
];

const key = (m: number, d: number) => m * 100 + d;

export function seasonForDate(date: Date): Season {
  const today = key(date.getMonth() + 1, date.getDate());
  for (const w of WINDOWS) {
    const from = key(...w.from);
    const to = key(...w.to);
    const inside = from <= to ? today >= from && today <= to : today >= from || today <= to;
    if (inside) return w.season;
  }
  return 'clasica';
}

export const isSeason = (s: string | null | undefined): s is Season => !!s && (SEASONS as readonly string[]).includes(s);
