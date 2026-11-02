'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowLeft, Users } from 'lucide-react';
import { API_URL, BASE_PATH } from '@/lib/env';
import type { GameId } from '@/lib/plans';
import { newRoomCode, pickTransport } from '@/games/mesa/transport';
import { MesaApp } from '@/games/mesa/MesaApp';
import type { RoomGame } from '@/games/mesa/useRoom';
import { useLucero } from '../store';

/** The table games' cards in the games modal (plan 75), and the room they open on this phone (it is the host). */
export function TableGames({ onOpen }: { onOpen: (game: RoomGame) => void }) {
  const t = useTranslations('lucero.games');
  return (
    <ul className="gl-list">
      {(['dibujo', 'hockey'] as RoomGame[]).map((g) => (
        <li key={g}>
          <button type="button" className="gl-card" onClick={() => onOpen(g)}>
            <span className="gl-art gl-art-mesa" aria-hidden>
              <Users className="size-7" />
            </span>
            <span className="gl-card-text">
              <b>{t(`items.${g}.name`)}</b>
              <span>{t(`items.${g}.tagline`)}</span>
            </span>
            <span className="gl-play" aria-hidden>
              <Users className="size-4" />
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}

export function TableRoom({ game, onClose }: { game: RoomGame; onClose: () => void }) {
  const t = useTranslations('lucero.mesa');
  const tg = useTranslations('lucero.games');
  const { state, lang } = useLucero();
  const code = useMemo(() => newRoomCode(), []);
  const [search] = useState(() => (typeof window === 'undefined' ? '' : window.location.search));
  const transport = pickTransport(search, API_URL);
  const joinUrl = useMemo(() => {
    const origin = typeof window === 'undefined' ? '' : window.location.origin;
    const forced = transport === 'local' ? '&red=local' : '';
    return `${origin}${BASE_PATH}/${lang}/sala/?c=${code}&j=${game}${forced}`;
  }, [code, game, lang, transport]);
  return (
    <div className="gh ms" role="dialog" aria-modal="true" aria-label={tg(`items.${game}.name`)}>
      <header className="gh-top">
        <button type="button" className="gh-close" onClick={onClose} aria-label={t('leave')}>
          <ArrowLeft aria-hidden className="size-5" />
        </button>
        <span className="gh-title">{tg(`items.${game}.name`)}</span>
        <span className="lc-demo">Demo</span>
      </header>
      <div className="ms-body">
        <MesaApp game={game} code={code} host name={state.guestName || t('hostName')} lang={lang} joinUrl={joinUrl} transport={transport} apiUrl={API_URL} />
      </div>
    </div>
  );
}

export type { GameId };
