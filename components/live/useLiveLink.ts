'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { createTransport, type MesaTransport, type TransportKind, type TransportStatus } from '@/games/mesa/transport';
import type { LiveLink, LiveRole } from '@/components/lucero/store';

export interface Peer {
  id: string;
  role: LiveRole;
  table: number | null;
  name: string;
  host: boolean;
}

const DEVICE_KEY = 'lucero-device';

/** This phone's id, kept across reloads (so «mine» survives one); a fresh one when storage is off. */
function deviceId(): string {
  const fresh = `d${Math.random().toString(36).slice(2, 10)}`;
  try {
    const saved = window.localStorage.getItem(DEVICE_KEY);
    if (saved && /^d[a-z0-9]{6,12}$/.test(saved)) return saved;
    window.localStorage.setItem(DEVICE_KEY, fresh);
  } catch {
    /* private mode: a new id each time is fine */
  }
  return fresh;
}

/**
 * «Local en vivo»: one venue, several phones (Ignacio, 08/11/2026: «que todos entren a esos roles con un link»). The
 * same star as the table games (games/mesa/transport.ts): Foody-be's relay when there is a backend, WebRTC phone to
 * phone otherwise, BroadcastChannel for tabs of one browser (`?red=local`). The owner's phone is the hub.
 *
 * Presence: every phone says who it is (`v-hello`) every 3 s; the hub keeps who said it lately and tells everyone
 * (`v-roster`). The venue's state itself travels in the store (`v-action`, `v-state`).
 */
export function useLiveLink({ code, isHost, role, table, name, transport, apiUrl }: { code: string; isHost: boolean; role: LiveRole; table: number | null; name: string; transport: TransportKind; apiUrl: string }) {
  const [id] = useState(deviceId);
  const tr = useRef<MesaTransport | null>(null);
  const subs = useRef(new Set<(type: string, payload: unknown, from: string) => void>());
  const [status, setStatus] = useState<TransportStatus>('connecting');
  const [roster, setRoster] = useState<Peer[]>([]);

  useEffect(() => {
    const t = createTransport(transport, `lucero-local-${code}`, isHost, apiUrl);
    tr.current = t;
    const me = (): Peer => ({ id, role, table, name, host: isHost });
    const seen = new Map<string, Peer & { at: number }>();
    const publish = () => {
      const now = Date.now();
      for (const [k, p] of seen) if (now - p.at > 10_000) seen.delete(k);
      const list: Peer[] = [me(), ...[...seen.values()].map((p) => ({ id: p.id, role: p.role, table: p.table, name: p.name, host: false }))];
      setRoster(list);
      t.send('v-roster', list);
    };
    const offStatus = t.onStatus(setStatus);
    const off = t.on((msg) => {
      if (msg.type === 'v-hello' && isHost) {
        const p = msg.payload as Partial<Peer>;
        const fresh = !seen.has(msg.from);
        seen.set(msg.from, { id: String(p.id ?? msg.from), role: (p.role as LiveRole) ?? 'mesa', table: typeof p.table === 'number' ? p.table : null, name: String(p.name ?? '').slice(0, 24), host: false, at: Date.now() });
        if (fresh) publish();
        return;
      }
      if (msg.type === 'v-roster' && !isHost && Array.isArray(msg.payload)) {
        setRoster(msg.payload as Peer[]);
        return;
      }
      for (const fn of subs.current) fn(msg.type, msg.payload, msg.from);
    });
    const hello = () => t.send('v-hello', me());
    const beat = window.setInterval(() => (isHost ? publish() : hello()), 3000);
    if (isHost) publish();
    else hello();
    return () => {
      window.clearInterval(beat);
      off();
      offStatus();
      t.close();
      tr.current = null;
    };
  }, [code, isHost, role, table, name, transport, apiUrl, id]);

  const link: LiveLink = useMemo(
    () => ({
      venue: code,
      deviceId: id,
      isHost,
      role,
      table,
      send: (type, payload) => tr.current?.send(type, payload),
      subscribe: (fn) => {
        subs.current.add(fn);
        return () => {
          subs.current.delete(fn);
        };
      },
    }),
    [code, id, isHost, role, table],
  );

  return { link, status, roster, deviceId: id };
}
