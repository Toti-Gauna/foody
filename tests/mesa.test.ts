import { describe, expect, it } from 'vitest';
import { guessPoints, isClose, isCorrect, mask, normalize, pickOptions, WORDS } from '@/games/mesa/dibujo/logic';
import { botTarget, clampPaddle, fromGuestView, GOAL_W, H, initial, PUCK_R, step, W, WIN } from '@/games/mesa/hockey/physics';
import { isRoomCode, newRoomCode, pickTransport } from '@/games/mesa/transport';

describe('dibujá y adiviná', () => {
  it('matches guesses without caring about accents, case or spaces', () => {
    expect(normalize('  Sandía ')).toBe('sandia');
    expect(isCorrect('SANDIA', 'sandía')).toBe(true);
    expect(isCorrect('mesa  larga', 'mesa larga')).toBe(true);
    expect(isCorrect('sandias', 'sandía')).toBe(false);
    expect(isClose('sandias', 'sandía')).toBe(true);
    expect(isClose('pan', 'pez')).toBe(false);
  });

  it('offers one word per level, the same on every phone for the same seed', () => {
    const a = pickOptions('es', 42);
    expect(a).toEqual(pickOptions('es', 42));
    expect(WORDS.es.easy).toContain(a[0]);
    expect(WORDS.es.medium).toContain(a[1]);
    expect(WORDS.es.hard).toContain(a[2]);
  });

  it('has drawable words in the three languages, same sizes', () => {
    for (const lang of ['es', 'en', 'pt'] as const) for (const level of ['easy', 'medium', 'hard'] as const) expect(WORDS[lang][level]).toHaveLength(12);
  });

  it('fills the word in over time, never more than half, and always shows spaces', () => {
    expect(mask('mesa larga', 0, 100, 7)).toBe('____ _____');
    const late = mask('hamburguesa', 100, 100, 7);
    expect(late.length).toBe(11);
    expect([...late].filter((c) => c !== '_').length).toBe(5);
    expect(mask('hamburguesa', 100, 100, 7)).toBe(late);
  });

  it('pays more for guessing fast', () => {
    expect(guessPoints(0, 70_000, true)).toBe(350);
    expect(guessPoints(70_000, 70_000, false)).toBe(50);
  });
});

describe('hockey', () => {
  it('keeps each paddle in its half', () => {
    expect(clampPaddle({ x: -1, y: 0 }, true).y).toBeGreaterThan(H / 2);
    expect(clampPaddle({ x: 9, y: 9 }, false).y).toBeLessThan(H / 2);
    expect(fromGuestView({ x: 0.2, y: 1.5 })).toEqual({ x: 0.8, y: H - 1.5 });
  });

  it('a puck shot into the top goal is a goal for the host', () => {
    let s = initial();
    s = { ...s, puck: { x: W / 2, y: 0.2, vx: 0, vy: -2.5 } };
    for (let i = 0; i < 30; i++) s = step(s, 1 / 60, s.a, s.b);
    expect(s.score).toEqual([1, 0]);
    expect(s.phase).toBe('goal');
  });

  it('bounces off the end wall outside the goal mouth', () => {
    let s = initial();
    s = { ...s, b: { x: 0.9, y: 0.6 }, puck: { x: W / 2 - GOAL_W, y: 0.15, vx: 0, vy: -2 } };
    for (let i = 0; i < 20; i++) s = step(s, 1 / 60, s.a, s.b);
    expect(s.score).toEqual([0, 0]);
    expect(s.puck.vy).toBeGreaterThan(0);
    expect(s.puck.y).toBeGreaterThanOrEqual(PUCK_R);
  });

  it('ends at five', () => {
    let s = { ...initial(), score: [WIN - 1, 0] as [number, number], puck: { x: W / 2, y: 0.1, vx: 0, vy: -2.5 } };
    for (let i = 0; i < 30; i++) s = step(s, 1 / 60, s.a, s.b);
    expect(s.phase).toBe('end');
  });

  it('Gus the bot stays in his half', () => {
    const t = clampPaddle(botTarget(initial()), false);
    expect(t.y).toBeLessThan(H / 2);
  });
});

describe('rooms', () => {
  it('makes 4-character codes without look-alike characters', () => {
    for (let i = 0; i < 50; i++) expect(isRoomCode(newRoomCode())).toBe(true);
    expect(isRoomCode('AB1O')).toBe(false);
    expect(isRoomCode('<b>')).toBe(false);
  });
  it('picks the relay when there is a backend, WebRTC when not, and honours ?red=', () => {
    expect(pickTransport('', '')).toBe('webrtc');
    expect(pickTransport('', 'https://api')).toBe('ws');
    expect(pickTransport('?red=local', 'https://api')).toBe('local');
    expect(pickTransport('?red=ws', '')).toBe('webrtc');
  });
});

import { DibujoEngine, type Pub, type Secret } from '@/games/mesa/dibujo/engine';

describe('dibujá y adiviná · the host referee', () => {
  const setup = () => {
    let now = 0;
    const out: { type: string; payload: unknown }[] = [];
    const e = new DibujoEngine('es', (type, payload) => out.push({ type, payload }), () => now);
    const last = <T,>(type: string) => [...out].reverse().find((m) => m.type === type)!.payload as T;
    e.start(
      [
        { id: 'h', name: 'Sofi' },
        { id: 'a', name: 'Martín' },
        { id: 'b', name: 'Lucía' },
      ],
      123,
    );
    return { e, out, last, advance: (ms: number) => (now += ms) };
  };

  it('tells only the drawer the options, and never the word to the others', () => {
    const { e, last } = setup();
    const secret = last<Secret>('secret');
    expect(secret.to).toBe('h');
    expect(secret.options).toHaveLength(3);
    e.pick('h', secret.options![1]);
    expect(last<Secret>('secret').word).toBe(secret.options![1]);
    expect(last<Pub>('state').word).toBeNull();
    expect(last<Pub>('state').mask).toMatch(/^[_ -]+$/);
  });

  it('scores right guesses, ignores the drawer guessing and ends the round when everyone got it', () => {
    const { e, last, advance } = setup();
    const word = last<Secret>('secret').options![0];
    e.pick('h', word);
    advance(5000);
    e.guess('h', word);
    e.guess('a', 'nada que ver');
    e.guess('a', word.toUpperCase());
    e.guess('b', word);
    const s = last<Pub>('state');
    expect(s.phase).toBe('reveal');
    expect(s.word).toBe(word);
    expect(s.scores.a).toBeGreaterThan(s.scores.b);
    expect(s.scores.h).toBe(80);
    expect(s.feed.some((f) => f.kind === 'guess' && f.text === 'nada que ver')).toBe(true);
  });

  it('only takes strokes from the drawer, and moves on when time is up', () => {
    const { e, last, advance } = setup();
    e.pick('h', last<Secret>('secret').options![2]);
    e.stroke('a', { id: 'x', c: '#000', w: 0.01, p: [[0, 0]] });
    e.stroke('h', { id: 'y', c: '#000', w: 0.01, p: [[0.1, 0.1]] });
    expect(e.allStrokes().map((s) => s.id)).toEqual(['y']);
    advance(71_000);
    e.tick();
    expect(last<Pub>('state').phase).toBe('reveal');
    advance(5000);
    e.tick();
    expect(last<Pub>('state').drawer).toBe('a');
  });
});
