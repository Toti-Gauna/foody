'use client';

import { Suspense, lazy, useEffect, useMemo, useState, type ComponentType } from 'react';
import { useTranslations } from 'next-intl';
import { RotateCcw, UtensilsCrossed, X } from 'lucide-react';
import type { GameOutcome, GameProps, GameRuntimeConfig } from '@/games/core/contract/game';
import { schemaDefaults } from '@/games/core/contract/settings';
import { randomSeed } from '@/games/core/engine/rng';
import { gameById } from '@/games/registry';
import type { GameId } from '@/lib/plans';
import { useLucero } from '../store';
import '@/games/styles/games.css';

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
        <span className="gh-title">{t(`items.${game}.name`)}</span>
        <button type="button" className="gh-close" onClick={onClose} aria-label={t('close')}>
          <X aria-hidden className="size-5" />
        </button>
      </header>
      <div className="gh-stage">
        {outcome ? (
          <div className="gh-result" role="status">
            <p className="gh-result-label">{outcome.completed ? t('result.done') : t('result.stopped')}</p>
            <p className="gh-result-points">{t('result.points', { n: outcome.points })}</p>
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
          <Suspense fallback={<p className="gh-loading">{t('loading')}</p>}>
            <Game key={run.n} config={config} net={null} signal={run.abort.signal} onFinish={setOutcome} />
          </Suspense>
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
