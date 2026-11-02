'use client';

import { useId, useState, useSyncExternalStore, type FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { API_URL, BASE_PATH } from '@/lib/env';
import { isRoomCode, pickTransport } from '@/games/mesa/transport';
import { MesaApp } from '@/games/mesa/MesaApp';
import type { RoomGame } from '@/games/mesa/useRoom';
import type { Lang } from '@/games/mesa/dibujo/logic';
import './lucero.css';
import '@/components/lucero/games/games-layer.css';

const noop = () => () => {};
const useSearch = () => useSyncExternalStore(noop, () => window.location.search, () => '');

/**
 * The guest's way into a table room: the code and the game come in the link (`?c=` against its alphabet, `?j=` against
 * the two games; anything else is refused). The guest types a name and joins; the room runs on the host's phone.
 */
export function SalaPage({ lang }: { lang: Lang }) {
  const t = useTranslations('lucero.mesa');
  const tg = useTranslations('lucero.games');
  const search = useSearch();
  const q = new URLSearchParams(search);
  const code = q.get('c')?.toUpperCase() ?? null;
  const game = q.get('j');
  const valid = isRoomCode(code) && (game === 'dibujo' || game === 'hockey');
  const [name, setName] = useState('');
  const [joined, setJoined] = useState(false);
  const nameId = useId();

  const join = (e: FormEvent) => {
    e.preventDefault();
    if (name.trim()) setJoined(true);
  };

  return (
    <div className="ld sala">
      <header className="ld-top">
        <p className="ld-title">
          <b>Lucero</b>
          <span className="ld-demo">{t('demo')}</span>
        </p>
      </header>
      <main className="sala-main">
        {!search ? null : !valid ? (
          <div className="sala-card">
            <h1 className="gl-title">{t('badLink')}</h1>
            <a className="lc-btn lc-btn-ghost" href={`${BASE_PATH}/${lang}/demo/`}>
              {t('toDemo')}
            </a>
          </div>
        ) : joined ? (
          <div className="ms-body ms-body-page">
            <MesaApp game={game as RoomGame} code={code!} host={false} name={name.trim()} lang={lang} joinUrl="" transport={pickTransport(search, API_URL)} apiUrl={API_URL} />
          </div>
        ) : (
          <form className="sala-card" onSubmit={join}>
            <p className="lc-kicker">{t('invited')}</p>
            <h1 className="gl-title">{tg(`items.${game}.name`)}</h1>
            <p className="crm-muted">{tg(`items.${game}.tagline`)}</p>
            <p className="sala-code">
              {t('code')}: <b>{code}</b>
            </p>
            <label htmlFor={nameId} className="crm-muted">
              {t('yourName')}
            </label>
            <input id={nameId} className="sala-input" value={name} onChange={(e) => setName(e.target.value)} maxLength={24} autoComplete="given-name" placeholder={t('namePlaceholder')} />
            <button type="submit" className="lc-btn lc-btn-main lc-btn-block" disabled={!name.trim()}>
              {t('join')}
            </button>
            <p className="ru-note">{t('note')}</p>
          </form>
        )}
      </main>
    </div>
  );
}
