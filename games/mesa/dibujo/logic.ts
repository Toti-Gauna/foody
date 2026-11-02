/**
 * «Dibujá y adiviná» (Pinturillo, rebuilt for phones): the rules, pure and tested. Words are drawable things from a
 * restaurant night (Ignacio asked for it easy to play: one draws, the table guesses on their phones). Ideas from
 * games-market's Pinturillo (words that can be drawn, three difficulty levels, points for guessing fast); the code is new.
 */
export type Lang = 'es' | 'en' | 'pt';
export type Level = 'easy' | 'medium' | 'hard';

export const WORDS: Record<Lang, Record<Level, string[]>> = {
  es: {
    easy: ['pizza', 'helado', 'taza', 'tenedor', 'pescado', 'banana', 'huevo', 'torta', 'vaso', 'manzana', 'pan', 'queso'],
    medium: ['hamburguesa', 'empanada', 'sandía', 'cocinero', 'heladera', 'sartén', 'botella', 'camarón', 'zanahoria', 'sombrero', 'bicicleta', 'paraguas'],
    hard: ['parrilla', 'mozo', 'propina', 'brindis', 'cumpleaños', 'delivery', 'menú', 'mesa larga', 'picnic', 'cucharón', 'fogón', 'pochoclo'],
  },
  en: {
    easy: ['pizza', 'ice cream', 'cup', 'fork', 'fish', 'banana', 'egg', 'cake', 'glass', 'apple', 'bread', 'cheese'],
    medium: ['burger', 'hot dog', 'watermelon', 'chef', 'fridge', 'frying pan', 'bottle', 'shrimp', 'carrot', 'hat', 'bicycle', 'umbrella'],
    hard: ['barbecue', 'waiter', 'tip', 'toast', 'birthday', 'delivery', 'menu', 'long table', 'picnic', 'ladle', 'campfire', 'popcorn'],
  },
  pt: {
    easy: ['pizza', 'sorvete', 'xícara', 'garfo', 'peixe', 'banana', 'ovo', 'bolo', 'copo', 'maçã', 'pão', 'queijo'],
    medium: ['hambúrguer', 'pastel', 'melancia', 'cozinheiro', 'geladeira', 'frigideira', 'garrafa', 'camarão', 'cenoura', 'chapéu', 'bicicleta', 'guarda-chuva'],
    hard: ['churrasco', 'garçom', 'gorjeta', 'brinde', 'aniversário', 'delivery', 'cardápio', 'mesa comprida', 'piquenique', 'concha', 'fogueira', 'pipoca'],
  },
};

export const ROUND_MS = 70_000;
export const CHOOSE_MS = 12_000;
export const REVEAL_MS = 4_000;

/** Lowercase, no accents, single spaces: «Sandía » and «sandia» are the same guess. */
export function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9ñ ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export const isCorrect = (guess: string, word: string) => normalize(guess) === normalize(word);

/** One letter off on a word of five or more letters: «¡Casi!». */
export function isClose(guess: string, word: string): boolean {
  const a = normalize(guess);
  const b = normalize(word);
  if (a === b || b.length < 5) return false;
  return distance(a, b) === 1;
}

function distance(a: string, b: string): number {
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = tmp;
    }
  }
  return row[b.length];
}

/** A small deterministic generator, so every phone reveals the same letters. */
export function rng(seed: number) {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return (s >>> 0) / 4294967296;
  };
}

/** Three words to choose from, one per level. */
export function pickOptions(lang: Lang, seed: number): string[] {
  const r = rng(seed);
  return (['easy', 'medium', 'hard'] as Level[]).map((level) => {
    const list = WORDS[lang][level];
    return list[Math.floor(r() * list.length)];
  });
}

/**
 * The word as the guessers see it at the top: «_ _ _ _», letters filling in as time goes by. Nothing for the first 30%;
 * then up to half the letters by the end. Spaces and hyphens always show.
 */
export function mask(word: string, elapsed: number, total: number, seed: number): string {
  const letters = [...word].map((c, i) => ({ c, i })).filter(({ c }) => c !== ' ' && c !== '-');
  const share = Math.max(0, Math.min(1, (elapsed / total - 0.3) / 0.7));
  const reveal = Math.floor(share * Math.floor(letters.length / 2));
  const r = rng(seed + word.length);
  const order = [...letters].sort(() => r() - 0.5).slice(0, reveal).map((l) => l.i);
  return [...word].map((c, i) => (c === ' ' || c === '-' ? c : order.includes(i) ? c : '_')).join('');
}

/** Points for a right guess: more the sooner, at least 50. The drawer gets 40 per player who guesses. */
export function guessPoints(elapsed: number, total: number, first: boolean): number {
  const base = Math.max(50, Math.round(300 * (1 - elapsed / total)));
  return base + (first ? 50 : 0);
}
export const DRAWER_POINTS = 40;

export type Stroke = { id: string; c: string; w: number; p: [number, number][] };
export const COLORS = ['#1b120f', '#b23a52', '#d9783a', '#f5b942', '#6f7d35', '#2f6fb5', '#8a5cb5', '#ffffff'];
export const SIZES = [0.008, 0.016, 0.03];
