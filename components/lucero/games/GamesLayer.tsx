'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Play, Users, X } from 'lucide-react';
import { asset } from '@/lib/env';
import { includes, planById, type GameId } from '@/lib/plans';
import { GAMES } from '@/games/registry';
import { useLucero, VISIT } from '../store';
import { GameHost } from './GameHost';
import { Ruleta } from './Ruleta';
import { TableGames, TableRoom } from './TableGames';
import type { RoomGame } from '@/games/mesa/useRoom';
import './games-layer.css';

const ART: Partial<Record<GameId, string>> = {
  ninja: '/lucero/games/ninja.svg',
  combinaciones: '/lucero/games/combinaciones.svg',
  catapulta: '/lucero/games/catapulta.svg',
};

export type GamesStage = 'wheel' | 'games' | null;

/**
 * The plan's fun (50 and up), in two moments (Ignacio, 02/11/2026):
 * 1. `wheel`: la ruleta de la casa over the whole screen, as soon as the carta opens after scanning the QR (one spin
 *    per visit).
 * 2. `games`, right after «Tu pedido fue realizado»: a modal, «Mientras esperás la comida, podés jugar estos juegos», with the solo games in one column, each
 *    as wide as the phone, and on plan 75 the table games (they open a room on this phone). Through a plan, only its
 *    games show.
 */
export function GamesLayer({ stage, onStage, orderId }: { stage: GamesStage; onStage: (s: GamesStage) => void; orderId: string | null }) {
  const t = useTranslations('lucero.games');
  const { plan } = useLucero();
  const onClose = () => onStage(null);
  const [playing, setPlaying] = useState<GameId | null>(null);
  const [room, setRoom] = useState<RoomGame | null>(null);
  const allowed = (id: GameId) => (plan ? planById(plan).games.includes(id) : true);
  const solo = GAMES.filter((g) => g.kind === 'solo' && allowed(g.id));
  const wheel = !plan || includes(plan, 'ruleta');
  const table = !plan || includes(plan, 'mesa');

  // Keyboard: Esc closes what is open, and focus goes into what just opened.
  const layer = playing || room ? null : stage;
  useEffect(() => {
    if (!layer) return;
    const focusTarget = document.querySelector<HTMLElement>(layer === 'wheel' ? '.rs .rs-go, .rs .lc-btn-main' : '.gl-sheet .gl-x');
    // Into the dialog for keyboards and screen readers, without painting a focus ring nobody asked for.
    focusTarget?.focus({ focusVisible: false } as FocusOptions);
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      onStage(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [layer, onStage]);

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
  if (room) return <TableRoom game={room} onClose={() => setRoom(null)} />;
  // The wheel stays up after the spin to show the prize and its code; «Seguir» (or closing it) goes back to the carta.
  if (stage === 'wheel' && wheel) return <Ruleta spinKey={VISIT} onDone={onClose} onClose={onClose} />;
  if (!stage) return null;

  return (
    <div className="gl" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="gl-sheet" role="dialog" aria-modal="true" aria-labelledby="gl-title">
        <span aria-hidden className="gl-handle" />
        <header className="gl-head">
          <div>
            <p className="lc-kicker">{t('kicker')}</p>
            <h2 id="gl-title" className="gl-title">
              {t('title')}
            </h2>
          </div>
          <button type="button" className="lc-icon-btn gl-x" onClick={onClose} aria-label={t('backToOrder')}>
            <X aria-hidden className="size-5" />
          </button>
        </header>
        <p className="gl-sub">{t('sub')}</p>

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

        {table ? (
          <section className="gl-block" aria-labelledby="gl-table">
            <h3 id="gl-table" className="gl-h">
              <Users aria-hidden className="size-4" /> {t('tableTitle')}
            </h3>
            <TableGames onOpen={setRoom} />
          </section>
        ) : null}

        <button type="button" className="lc-btn lc-btn-ghost lc-btn-block" onClick={onClose}>
          {t('backToOrder')}
        </button>
      </div>
    </div>
  );
}
