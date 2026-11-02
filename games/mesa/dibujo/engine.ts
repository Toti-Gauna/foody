import { CHOOSE_MS, DRAWER_POINTS, REVEAL_MS, ROUND_MS, guessPoints, isClose, isCorrect, mask, pickOptions, type Lang, type Stroke } from './logic';

export type Phase = 'choose' | 'draw' | 'reveal' | 'end';
export interface FeedItem {
  n: number;
  who: string;
  kind: 'guess' | 'right' | 'close';
  text: string;
}
/** What every phone sees. `left` is the time left in ms when it was sent (phones' clocks differ). */
export interface Pub {
  phase: Phase;
  round: number;
  rounds: number;
  drawer: string;
  names: Record<string, string>;
  left: number;
  mask: string;
  word: string | null;
  scores: Record<string, number>;
  guessed: string[];
  feed: FeedItem[];
}
/** Only for the drawer: the three options, then the word. */
export interface Secret {
  to: string;
  options: string[] | null;
  word: string | null;
}

/**
 * The host's referee for «Dibujá y adiviná». It runs on the host's phone only; guests send their picks, guesses and
 * strokes, and it answers with the public state, the drawer's secret and the strokes. It never trusts a guest with the
 * word: guessers only ever get the mask (letters fill in as the round goes) until the reveal.
 */
export class DibujoEngine {
  private order: string[] = [];
  private names: Record<string, string> = {};
  private turn = 0;
  private phase: Phase = 'choose';
  private word = '';
  private options: string[] = [];
  private phaseStart = 0;
  private scores: Record<string, number> = {};
  private guessed: string[] = [];
  private feed: FeedItem[] = [];
  private feedN = 0;
  private strokes: Stroke[] = [];
  private seed = 1;

  constructor(
    private lang: Lang,
    private emit: (type: 'state' | 'secret' | 'strokes', payload: Pub | Secret | Stroke[]) => void,
    private now: () => number = Date.now,
  ) {}

  start(players: { id: string; name: string }[], seed = Math.floor(Math.random() * 1e9)) {
    this.order = players.map((p) => p.id);
    this.names = Object.fromEntries(players.map((p) => [p.id, p.name]));
    this.scores = Object.fromEntries(players.map((p) => [p.id, 0]));
    this.turn = 0;
    this.seed = seed;
    this.feed = [];
    this.begin();
  }

  /** Players who come and go keep their score; someone new joins with 0. */
  setPlayers(players: { id: string; name: string }[]) {
    for (const p of players) {
      this.names[p.id] = p.name;
      if (!(p.id in this.scores)) this.scores[p.id] = 0;
    }
    const present = new Set(players.map((p) => p.id));
    if (this.phase !== 'end' && this.drawer && !present.has(this.drawer)) this.reveal();
  }

  get rounds() {
    return Math.max(2, this.order.length);
  }
  get drawer() {
    return this.order.length ? this.order[this.turn % this.order.length] : '';
  }

  private begin() {
    this.phase = 'choose';
    this.word = '';
    this.guessed = [];
    this.strokes = [];
    this.options = pickOptions(this.lang, this.seed + this.turn * 7919);
    this.phaseStart = this.now();
    this.emit('strokes', []);
    this.secret();
    this.publish();
  }

  pick(from: string, word: string) {
    if (this.phase !== 'choose' || from !== this.drawer || !this.options.includes(word)) return;
    this.startDrawing(word);
  }

  private startDrawing(word: string) {
    this.word = word;
    this.phase = 'draw';
    this.phaseStart = this.now();
    this.secret();
    this.publish();
  }

  guess(from: string, text: string) {
    const clean = text.trim().slice(0, 40);
    if (this.phase !== 'draw' || !clean || from === this.drawer || this.guessed.includes(from)) return;
    const elapsed = this.now() - this.phaseStart;
    if (isCorrect(clean, this.word)) {
      this.scores[from] = (this.scores[from] ?? 0) + guessPoints(elapsed, ROUND_MS, this.guessed.length === 0);
      this.scores[this.drawer] = (this.scores[this.drawer] ?? 0) + DRAWER_POINTS;
      this.guessed.push(from);
      this.say(from, 'right', '');
      if (this.guessed.length >= this.order.filter((id) => id !== this.drawer && id in this.names).length) this.reveal();
      else this.publish();
      return;
    }
    this.say(from, isClose(clean, this.word) ? 'close' : 'guess', isClose(clean, this.word) ? '' : clean);
    this.publish();
  }

  stroke(from: string, s: Stroke) {
    if (this.phase !== 'draw' || from !== this.drawer) return;
    const i = this.strokes.findIndex((x) => x.id === s.id);
    const safe: Stroke = { id: String(s.id).slice(0, 24), c: String(s.c).slice(0, 9), w: Math.min(0.05, Math.max(0.002, Number(s.w) || 0.01)), p: (s.p ?? []).slice(0, 600) };
    if (i >= 0) this.strokes[i] = safe;
    else this.strokes.push(safe);
  }
  clear(from: string) {
    if (from !== this.drawer) return;
    this.strokes = [];
    this.emit('strokes', []);
  }
  undo(from: string) {
    if (from !== this.drawer) return;
    this.strokes.pop();
    this.emit('strokes', this.strokes);
  }
  /** The full drawing, for a phone that missed some strokes. */
  allStrokes() {
    return this.strokes;
  }

  private reveal() {
    this.phase = 'reveal';
    this.phaseStart = this.now();
    this.publish();
  }

  restart() {
    this.start(this.order.filter((id) => id in this.names).map((id) => ({ id, name: this.names[id] })));
  }

  /** Call often (every ~250 ms): it moves the phases on and publishes the timer and the mask. */
  tick() {
    const t = this.now() - this.phaseStart;
    if (this.phase === 'choose' && t > CHOOSE_MS) this.startDrawing(this.options[0]);
    else if (this.phase === 'draw' && t > ROUND_MS) this.reveal();
    else if (this.phase === 'reveal' && t > REVEAL_MS) {
      this.turn += 1;
      if (this.turn >= this.rounds) {
        this.phase = 'end';
        this.publish();
      } else this.begin();
    } else this.publish();
  }

  private say(who: string, kind: FeedItem['kind'], text: string) {
    this.feed = [...this.feed, { n: ++this.feedN, who, kind, text }].slice(-8);
  }

  private secret() {
    this.emit('secret', { to: this.drawer, options: this.phase === 'choose' ? this.options : null, word: this.phase === 'draw' ? this.word : null });
  }

  publish() {
    const t = this.now() - this.phaseStart;
    const total = this.phase === 'choose' ? CHOOSE_MS : this.phase === 'draw' ? ROUND_MS : this.phase === 'reveal' ? REVEAL_MS : 0;
    this.emit('state', {
      phase: this.phase,
      round: Math.min(this.turn + 1, this.rounds),
      rounds: this.rounds,
      drawer: this.drawer,
      names: this.names,
      left: Math.max(0, total - t),
      mask: this.word ? mask(this.word, this.phase === 'draw' ? t : ROUND_MS, ROUND_MS, this.seed + this.turn) : '',
      word: this.phase === 'reveal' || this.phase === 'end' ? this.word : null,
      scores: this.scores,
      guessed: this.guessed,
      feed: this.feed,
    });
  }
}
