/**
 * Air hockey, one on one (new: games-market has no hockey). Pure physics so the host's phone simulates and the other
 * phone only draws. The table is 1 wide and 1.6 long; the host plays from the bottom (y = 1.6), the guest from the top.
 * Each phone sees its own paddle at the bottom: the guest's view is the table turned 180°.
 */
export const W = 1;
export const H = 1.6;
export const PADDLE_R = 0.075;
export const PUCK_R = 0.045;
export const GOAL_W = 0.36;
export const WIN = 5;
const MAX_PUCK = 2.8;
const PADDLE_SPEED = 4.2;
const FRICTION = 0.6; // share of speed kept per second

export type Vec = { x: number; y: number };
export interface HockeyState {
  puck: Vec & { vx: number; vy: number };
  a: Vec; // host paddle (bottom)
  b: Vec; // guest paddle (top)
  av: Vec;
  bv: Vec;
  score: [number, number];
  phase: 'play' | 'goal' | 'end';
  /** Who scored last (0 host, 1 guest), for the «¡Gol!» moment. */
  last: 0 | 1 | null;
  pause: number;
}

export function initial(): HockeyState {
  return {
    puck: { x: W / 2, y: H / 2, vx: 0, vy: 0 },
    a: { x: W / 2, y: H - 0.2 },
    b: { x: W / 2, y: 0.2 },
    av: { x: 0, y: 0 },
    bv: { x: 0, y: 0 },
    score: [0, 0],
    phase: 'play',
    last: null,
    pause: 0,
  };
}

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

/** Keep a paddle in its own half and inside the table. */
export function clampPaddle(p: Vec, bottom: boolean): Vec {
  return {
    x: clamp(p.x, PADDLE_R, W - PADDLE_R),
    y: bottom ? clamp(p.y, H / 2 + PADDLE_R, H - PADDLE_R) : clamp(p.y, PADDLE_R, H / 2 - PADDLE_R),
  };
}

/** The guest's finger, in its turned view, as a point on the table. */
export const fromGuestView = (p: Vec): Vec => ({ x: W - p.x, y: H - p.y });

function movePaddle(pos: Vec, target: Vec, dt: number, bottom: boolean, speed = PADDLE_SPEED): { pos: Vec; vel: Vec } {
  const goal = clampPaddle(target, bottom);
  const dx = goal.x - pos.x;
  const dy = goal.y - pos.y;
  const dist = Math.hypot(dx, dy);
  const step = Math.min(dist, speed * dt);
  const next = dist > 0 ? { x: pos.x + (dx / dist) * step, y: pos.y + (dy / dist) * step } : pos;
  return { pos: next, vel: { x: (next.x - pos.x) / dt, y: (next.y - pos.y) / dt } };
}

function hit(puck: HockeyState['puck'], paddle: Vec, vel: Vec) {
  const dx = puck.x - paddle.x;
  const dy = puck.y - paddle.y;
  const d = Math.hypot(dx, dy);
  const min = PADDLE_R + PUCK_R;
  if (d >= min || d === 0) return;
  const nx = dx / d;
  const ny = dy / d;
  // Push out, then bounce off the paddle (relative velocity) and take some of its speed.
  puck.x = paddle.x + nx * min;
  puck.y = paddle.y + ny * min;
  const rvx = puck.vx - vel.x;
  const rvy = puck.vy - vel.y;
  const dot = rvx * nx + rvy * ny;
  if (dot < 0) {
    puck.vx -= 1.9 * dot * nx;
    puck.vy -= 1.9 * dot * ny;
  }
  puck.vx += vel.x * 0.35;
  puck.vy += vel.y * 0.35;
}

/** Advance the table by `dt` seconds with each paddle heading to its target. `speedB`: how fast the top paddle can go (Gus's level). */
export function step(s: HockeyState, dt: number, targetA: Vec, targetB: Vec, speedB = PADDLE_SPEED): HockeyState {
  if (s.phase === 'end') return s;
  const next: HockeyState = { ...s, puck: { ...s.puck }, score: [...s.score] as [number, number] };
  const a = movePaddle(s.a, targetA, dt, true);
  const b = movePaddle(s.b, targetB, dt, false, speedB);
  next.a = a.pos;
  next.b = b.pos;
  next.av = a.vel;
  next.bv = b.vel;

  if (s.phase === 'goal') {
    next.pause = s.pause - dt;
    if (next.pause <= 0) {
      next.phase = 'play';
      // The one who conceded serves: the puck waits on their side.
      next.puck = { x: W / 2, y: s.last === 0 ? H / 2 - 0.25 : H / 2 + 0.25, vx: 0, vy: 0 };
    }
    return next;
  }

  const p = next.puck;
  const keep = Math.pow(FRICTION, dt);
  p.vx *= keep;
  p.vy *= keep;
  p.x += p.vx * dt;
  p.y += p.vy * dt;
  hit(p, next.a, next.av);
  hit(p, next.b, next.bv);
  const speed = Math.hypot(p.vx, p.vy);
  if (speed > MAX_PUCK) {
    p.vx *= MAX_PUCK / speed;
    p.vy *= MAX_PUCK / speed;
  }

  // Side walls.
  if (p.x < PUCK_R) {
    p.x = PUCK_R;
    p.vx = Math.abs(p.vx);
  } else if (p.x > W - PUCK_R) {
    p.x = W - PUCK_R;
    p.vx = -Math.abs(p.vx);
  }
  const inGoal = Math.abs(p.x - W / 2) < GOAL_W / 2;
  // Ends: a goal through the mouth, a bounce elsewhere.
  if (p.y < PUCK_R) {
    if (inGoal && p.y < -PUCK_R) return goal(next, 0);
    if (!inGoal) {
      p.y = PUCK_R;
      p.vy = Math.abs(p.vy);
    }
  } else if (p.y > H - PUCK_R) {
    if (inGoal && p.y > H + PUCK_R) return goal(next, 1);
    if (!inGoal) {
      p.y = H - PUCK_R;
      p.vy = -Math.abs(p.vy);
    }
  }
  return next;
}

function goal(s: HockeyState, scorer: 0 | 1): HockeyState {
  const score: [number, number] = [...s.score] as [number, number];
  score[scorer] += 1;
  const end = score[scorer] >= WIN;
  return { ...s, score, last: scorer, phase: end ? 'end' : 'goal', pause: 1.4, puck: { x: W / 2, y: H / 2, vx: 0, vy: 0 } };
}

/**
 * How Gus plays when you're alone (Ignacio: «está muy difícil»). Fácil is the default:
 * - `speed`: how fast his paddle moves (yours: PADDLE_SPEED);
 * - `react`: seconds between looks at the puck (in between he keeps going where he last aimed);
 * - `error`: how far off he aims, across;
 * - `attack`: he only comes out to hit the puck in his half when it is slower than this; otherwise he guards;
 * - `track`: how much he follows the puck sideways while guarding (1 = exactly);
 * - `guard`: how far out from his goal he stands (further out, more shots get past him).
 */
export const BOT_LEVELS = {
  facil: { speed: 1.3, react: 0.36, error: 0.2, attack: 0.45, track: 0.35, guard: 0.36 },
  normal: { speed: 2.4, react: 0.18, error: 0.07, attack: 1.0, track: 0.65, guard: 0.26 },
  dificil: { speed: PADDLE_SPEED, react: 0.06, error: 0.015, attack: 2.2, track: 0.9, guard: 0.18 },
} as const;
export type BotLevel = keyof typeof BOT_LEVELS;
export const BOT_LEVEL_IDS = Object.keys(BOT_LEVELS) as BotLevel[];

/** Where Gus heads for: after the puck when it is slow in his half, else guarding his goal. `noise` in [-1, 1]. */
export function botTarget(s: HockeyState, level: BotLevel = 'normal', noise = 0): Vec {
  const L = BOT_LEVELS[level];
  const p = s.puck;
  const miss = noise * L.error;
  const inHisHalf = p.y < H / 2 + 0.05;
  if (inHisHalf && Math.hypot(p.vx, p.vy) < L.attack) return { x: p.x + miss, y: Math.max(PADDLE_R, p.y - 0.12) };
  return { x: W / 2 + (p.x - W / 2) * L.track + miss, y: L.guard };
}
