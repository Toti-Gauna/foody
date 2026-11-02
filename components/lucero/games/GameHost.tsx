'use client';

import { Suspense, lazy, useEffect, useMemo, useState, type ComponentType, type CSSProperties } from 'react';
import { useTranslations } from 'next-intl';
import { RotateCcw, Trophy, UtensilsCrossed, X } from 'lucide-react';
import { asset } from '@/lib/env';
import { useReducedMotion } from '@/components/motion/useReducedMotion';
import { GameSkinProvider, type GameSkin } from '@/games/ui/game/skin';
import type { GameOutcome, GameProps, GameRuntimeConfig } from '@/games/core/contract/game';
import { schemaDefaults } from '@/games/core/contract/settings';
import { randomSeed } from '@/games/core/engine/rng';
import { gameById } from '@/games/registry';
import type { GameId } from '@/lib/plans';
import { useLucero } from '../store';
import '@/games/styles/games.css';

const ART: Partial<Record<GameId, string>> = {
  ninja: '/lucero/games/ninja.svg',
  combinaciones: '/lucero/games/combinaciones.svg',
  catapulta: '/lucero/games/catapulta.svg',
};

/** Counts up to `to` (once per result); with reduced motion it shows the number at once. */
function useCountUp(to: number, key: number) {
  const reduced = useReducedMotion();
  const [shown, setShown] = useState({ key, n: 0 });
  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const k = Math.min(1, (now - start) / 1100);
      setShown({ key, n: Math.round(to * (1 - Math.pow(1 - k, 3))) });
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, key, reduced]);
  return reduced ? to : shown.key === key ? shown.n : 0;
}

/**
 * Runs one solo game over the whole guest screen (the phone, or the docked phone on a computer). The game is the
 * games-market component as it is; around it: the close button, the result («N puntos», play again), and the food: when
 * the order arrives while playing, a banner says so and takes the guest back to the table.
 */
export function GameHost({ game, orderId, onClose, onSeeOrder }: { game: GameId; orderId: string | null; onClose: () => void; onSeeOrder?: () => void }) {
  const t = useTranslations('lucero.games');
  const entry = gameById(game)!;
  const { state } = useLucero();
  // One run = one seed and one abort signal; the game must emit its result at once when the signal fires.
  const [run, setRun] = useState(() => ({ n: 0, seed: randomSeed(), abort: new AbortController() }));
  const [outcome, setOutcome] = useState<GameOutcome | null>(null);
  const [best, setBest] = useState(0);
  const ts = useTranslations('lucero.games.stage');
  const art = ART[game] ? asset(ART[game]!) : undefined;
  const skin: GameSkin = useMemo(
    () => ({
      art,
      title: t(`items.${game}.name`),
      tagline: t(`items.${game}.tagline`),
      labels: {
        play: ts('play'),
        sound: ts('sound'),
        soundOff: ts('soundOff'),
        fullscreen: ts('fullscreen'),
        exitFullscreen: ts('exitFullscreen'),
        pause: ts('pause'),
        paused: ts('paused'),
        pausedHint: ts('pausedHint'),
        resume: ts('resume'),
        restart: ts('restart'),
        again: t('again'),
        go: ts('go'),
      },
    }),
    [art, game, t, ts],
  );
  const finish = (o: GameOutcome) => {
    setOutcome(o);
    setBest((b) => Math.max(b, o.points));
  };
  const points = useCountUp(outcome?.points ?? 0, run.n);
  const record = !!outcome && outcome.points > 0 && outcome.points >= best;
  const order = orderId ? state.orders.find((o) => o.id === orderId) : null;
  const arrived = order?.status === 'delivered';

  const Game = useMemo(() => lazy(entry.load) as unknown as ComponentType<GameProps>, [entry]);
  const config: GameRuntimeConfig = useMemo(
    () => ({
      roomId: `lucero-${entry.id}`,
      seed: run.seed,
      durationMs: null,
      seat: 0,
      isHost: true,
      playerCount: 1,
      transport: 'local',
      settings: schemaDefaults(entry.settings),
      debug: false,
      fill: true,
    }),
    [entry, run.seed],
  );

  useEffect(() => () => run.abort.abort(), [run]);

  const again = () => {
    setOutcome(null);
    setRun((r) => ({ n: r.n + 1, seed: randomSeed(), abort: new AbortController() }));
  };

  return (
    <div className="gh" role="dialog" aria-modal="true" aria-label={t(`items.${game}.name`)}>
      <header className="gh-top">
        <span className="gh-title">
          {art ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={art} alt="" width={32} height={32} className="gh-title-art" />
          ) : null}
          {t(`items.${game}.name`)}
        </span>
        <button type="button" className="gh-close" onClick={onClose} aria-label={t('close')}>
          <X aria-hidden className="size-5" />
        </button>
      </header>
      <div className="gh-stage">
        {outcome ? (
          <div className="gh-result" role="status">
            {record ? (
              <span aria-hidden className="gh-confetti">
                {Array.from({ length: 22 }, (_, i) => (
                  <i key={i} style={{ '--i': i } as CSSProperties} />
                ))}
              </span>
            ) : null}
            <span className="gh-result-badge" aria-hidden>
              {art ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={art} alt="" width={96} height={96} />
              ) : (
                <Trophy className="size-10" />
              )}
            </span>
            <p className="gh-result-label">{record ? t('result.record') : outcome.completed ? t('result.done') : t('result.stopped')}</p>
            <p className="gh-result-points" aria-label={t('result.points', { n: outcome.points })}>
              <b>{points}</b>
              <span>{t('result.pointsWord', { n: outcome.points })}</span>
            </p>
            {best > 0 ? <p className="gh-result-best">{t('result.best', { n: best })}</p> : null}
            <div className="gh-result-actions">
              <button type="button" className="lc-btn lc-btn-main" onClick={again}>
                <RotateCcw aria-hidden className="size-4" />
                {t('again')}
              </button>
              <button type="button" className="lc-btn lc-btn-ghost" onClick={onClose}>
                {t('backToGames')}
              </button>
            </div>
          </div>
        ) : (
          <GameSkinProvider value={skin}>
            <Suspense
              fallback={
                <div className="gh-loading" role="status">
                  <span className="gh-loading-ring" aria-hidden>
                    {art ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={art} alt="" width={72} height={72} />
                    ) : null}
                  </span>
                  <p>{t('loading')}</p>
                </div>
              }
            >
              <Game key={run.n} config={config} net={null} signal={run.abort.signal} onFinish={finish} />
            </Suspense>
          </GameSkinProvider>
        )}
      </div>
      {arrived ? (
        <div className="gh-arrived" role="alert">
          <UtensilsCrossed aria-hidden className="size-5" />
          <span>{t('arrived')}</span>
          <button type="button" className="lc-btn lc-btn-main" onClick={onSeeOrder ?? onClose}>
            {t('seeIt')}
          </button>
        </div>
      ) : null}
    </div>
  );
}
