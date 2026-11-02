'use client';

import { useState } from 'react';
import type { Lang } from './dibujo/logic';
import type { TransportKind } from './transport';
import { useRoom, type RoomGame } from './useRoom';
import { Lobby } from './Lobby';
import { Dibujo } from './dibujo/Dibujo';
import { Hockey } from './hockey/Hockey';
import './mesa.css';

/** A table room from the lobby to the game. The same component for the host (in the demo) and for guests (/sala/). */
export function MesaApp({ game, code, host, name, lang, joinUrl, transport, apiUrl }: { game: RoomGame; code: string; host: boolean; name: string; lang: Lang; joinUrl: string; transport: TransportKind; apiUrl: string }) {
  const room = useRoom({ game, code, host, name, transport, apiUrl });
  const [bot, setBot] = useState(false);

  if (bot) return <Hockey room={null} bot />;
  if (!room.started) return <Lobby room={room} code={code} joinUrl={joinUrl} min={2} onBot={game === 'hockey' && host ? () => setBot(true) : undefined} />;
  return game === 'dibujo' ? <Dibujo room={room} lang={lang} /> : <Hockey room={room} />;
}
