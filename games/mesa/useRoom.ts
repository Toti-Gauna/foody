'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createTransport, roomKey, type MesaTransport, type TransportKind, type TransportStatus, type Wire } from './transport';

export interface Player {
  id: string;
  name: string;
  host: boolean;
}

export type RoomGame = 'dibujo' | 'hockey';

/**
 * One table room. The host's phone is the authority: it keeps the roster (who said hello lately), starts the game and
 * runs it; guests say hello every couple of seconds (that is also how a late or reconnected phone gets back in) and
 * follow what the host sends. Game messages go through `send` / `subscribe`; the room's own are `hello`, `roster`,
 * `start` and `bye`.
 */
export function useRoom({ game, code, host, name, transport, apiUrl }: { game: RoomGame; code: string; host: boolean; name: string; transport: TransportKind; apiUrl: string }) {
  const [status, setStatus] = useState<TransportStatus>('connecting');
  const [players, setPlayers] = useState<Player[]>([]);
  const [started, setStarted] = useState<number | null>(null);
  const [me, setMe] = useState('');
  const t = useRef<MesaTransport | null>(null);
  const subs = useRef(new Set<(msg: Wire) => void>());

  useEffect(() => {
    const tr = createTransport(transport, roomKey(game, code), host, apiUrl);
    t.current = tr;
    const seen = new Map<string, { name: string; at: number }>();
    const roster = (): Player[] => [
      { id: tr.id, name, host: true },
      ...[...seen.entries()].map(([id, v]) => ({ id, name: v.name, host: false })),
    ];
    const publish = () => {
      const list = roster();
      setPlayers(list);
      tr.send('roster', { players: list });
    };

    const offStatus = tr.onStatus((s) => {
      setStatus(s);
      setMe(tr.id);
    });
    const off = tr.on((msg) => {
      if (host) {
        if (msg.type === 'hello') {
          const fresh = !seen.has(msg.from);
          seen.set(msg.from, { name: String((msg.payload as { name?: string })?.name ?? '').slice(0, 24) || '…', at: Date.now() });
          if (fresh) publish();
          return;
        }
        if (msg.type === 'bye') {
          seen.delete(msg.from);
          publish();
          return;
        }
      } else {
        if (msg.type === 'roster') {
          setPlayers((msg.payload as { players: Player[] }).players);
          return;
        }
        if (msg.type === 'start') {
          setStarted((msg.payload as { at: number }).at);
          return;
        }
        // A phone that joins (or comes back) after the start learns it from the game's own state.
        if (msg.type === 'state') setStarted((s) => s ?? Date.now());
      }
      for (const fn of subs.current) fn(msg);
    });

    const beat = window.setInterval(() => {
      setMe(tr.id);
      if (host) {
        const now = Date.now();
        let changed = false;
        for (const [id, v] of seen) if (now - v.at > 9000) changed = seen.delete(id) || changed;
        if (changed) publish();
        else tr.send('roster', { players: roster() });
      } else {
        tr.send('hello', { name });
      }
    }, 1500);
    if (host) setTimeout(publish, 0);
    else tr.send('hello', { name });

    return () => {
      window.clearInterval(beat);
      if (!host) tr.send('bye', {});
      off();
      offStatus();
      tr.close();
      t.current = null;
    };
  }, [game, code, host, name, transport, apiUrl]);

  const send = useCallback((type: string, payload: unknown, to?: string) => t.current?.send(type, payload, to), []);
  const subscribe = useCallback((fn: (msg: Wire) => void) => {
    subs.current.add(fn);
    return () => {
      subs.current.delete(fn);
    };
  }, []);
  const start = useCallback(() => {
    const at = Date.now();
    t.current?.send('start', { at });
    setStarted(at);
  }, []);

  return { status, players, started, me, send, subscribe, start, isHost: host };
}

export type Room = ReturnType<typeof useRoom>;
