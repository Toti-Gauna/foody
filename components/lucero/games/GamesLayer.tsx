'use client';

import { useState, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowLeft, Play, Users } from 'lucide-react';
import { asset } from '@/lib/env';
import { includes, planById, type GameId } from '@/lib/plans';
import { GAMES } from '@/games/registry';
import { useLucero } from '../store';
import { GameHost } from './GameHost';
import { Ruleta } from './Ruleta';
import './games-layer.css';

const ART: Partial<Record<GameId, string>> = {
  ninja: '/lucero/games/ninja.svg',
  combinaciones: '/lucero/games/combinaciones.svg',
  catapulta: '/lucero/games/catapulta.svg',
};

/**
 * «Mientras esperás la comida, podés jugar»: opens by itself right after «Tu pedido fue realizado» when the plan has
 * games (50 and up). The wheel first (one spin per order), then the solo games in one column, each as wide as the phone
 * (Ignacio, 02/11/2026). Table games (plan 75) come in through `tableGames`. Through a plan, only its games show.
 */
export function GamesLayer({ open, onClose, orderId, tableGames }: { open: boolean; onClose: () => void; orderId: string | null; tableGames?: (play: (id: GameId) => void) => ReactNode }) {
  const t = useTranslations('lucero.games');
  const { plan } = useLucero();
  const [playing, setPlaying] = useState<GameId | null>(null);
  const allowed = (id: GameId) => (plan ? planById(plan).games.includes(id) : true);
  const solo = GAMES.filter((g) => g.kind === 'solo' && allowed(g.id));
  const wheel = !plan || includes(plan, 'ruleta');
  const table = !plan || includes(plan, 'mesa');

  if (playing)
    return (
      <GameHost
        game={playing}
        orderId={orderId}
        onClose={() => setPlaying(null)}
        onSeeOrder={() => {
          setPlaying(null);
          onClose();
        }}
      />
    );
  if (!open) return null;

  return (
    <div className="gl" role="dialog" aria-modal="true" aria-labelledby="gl-title">
      <div className="gl-sheet">
        <header className="gl-head">
          <button type="button" className="lc-icon-btn" onClick={onClose} aria-label={t('backToOrder')}>
            <ArrowLeft aria-hidden className="size-5" />
          </button>
          <div>
            <p className="lc-kicker">{t('kicker')}</p>
            <h2 id="gl-title" className="gl-title">
              {t('title')}
            </h2>
          </div>
        </header>
        <p className="gl-sub">{t('sub')}</p>

        {wheel ? (
          <section className="gl-block" aria-labelledby="gl-wheel">
            <h3 id="gl-wheel" className="gl-h">
              {t('ruleta.title')}
            </h3>
            <Ruleta orderId={orderId} />
          </section>
        ) : null}

        <section className="gl-block" aria-labelledby="gl-solo">
          <h3 id="gl-solo" className="gl-h">
            {t('soloTitle')}
          </h3>
          <ul className="gl-list">
            {solo.map((g) => (
              <li key={g.id}>
                <button type="button" className="gl-card" onClick={() => setPlaying(g.id)}>
                  {ART[g.id] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={asset(ART[g.id]!)} alt="" className="gl-art" width={120} height={120} />
                  ) : null}
                  <span className="gl-card-text">
                    <b>{t(`items.${g.id}.name`)}</b>
                    <span>{t(`items.${g.id}.tagline`)}</span>
                  </span>
                  <span className="gl-play" aria-hidden>
                    <Play className="size-4" />
                  </span>
                  <span className="sr-only">{t('play')}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        {table && tableGames ? (
          <section className="gl-block" aria-labelledby="gl-table">
            <h3 id="gl-table" className="gl-h">
              <Users aria-hidden className="size-4" /> {t('tableTitle')}
            </h3>
            {tableGames(setPlaying)}
          </section>
        ) : null}

        <button type="button" className="lc-btn lc-btn-ghost lc-btn-block" onClick={onClose}>
          {t('backToOrder')}
        </button>
      </div>
    </div>
  );
}
