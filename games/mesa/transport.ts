import { createPeerTransport } from '@/games/core/net/peerNet';

/**
 * How a table room's phones talk. Star topology: guests talk to the host, the host talks to everyone. Three ways,
 * same contract:
 * - `local`: BroadcastChannel, tabs of one browser (QA, and a quick try on one computer).
 * - `webrtc`: PeerJS (copied from games-market), phone to phone; signalling through PeerJS's public broker. Works on
 *   the venue's WiFi; across different networks it may need a TURN server.
 * - `ws`: the relay in Foody-be (fase 12), when NEXT_PUBLIC_API_URL is set: works across any network.
 */
export type TransportKind = 'local' | 'webrtc' | 'ws';
export type TransportStatus = 'connecting' | 'online' | 'reconnecting' | 'failed';

export interface Wire {
  type: string;
  from: string;
  payload: unknown;
}

export interface MesaTransport {
  readonly id: string;
  /** `to` (a peer id) is a hint: the relay sends to that one guest only; the others broadcast and the guest filters. */
  send(type: string, payload: unknown, to?: string): void;
  on(handler: (msg: Wire) => void): () => void;
  onStatus(cb: (status: TransportStatus) => void): () => void;
  close(): void;
}

export const roomKey = (game: string, code: string) => `lucero-${game}-${code}`;

function localTransport(room: string, isHost: boolean): MesaTransport {
  const id = `${isHost ? 'h' : 'g'}-${Math.random().toString(36).slice(2, 9)}`;
  const channel = new BroadcastChannel(`lucero-mesa:${room}`);
  const handlers = new Set<(msg: Wire) => void>();
  channel.onmessage = (e: MessageEvent<Wire & { host: boolean }>) => {
    const msg = e.data;
    if (!msg || msg.from === id) return;
    // Keep the star: a guest only listens to the host; the host listens to guests.
    if (!isHost && !msg.host) return;
    if (isHost && msg.host) return;
    for (const h of handlers) h(msg);
  };
  return {
    id,
    send: (type, payload) => channel.postMessage({ type, from: id, payload, host: isHost }),
    on: (h) => {
      handlers.add(h);
      return () => handlers.delete(h);
    },
    onStatus: (cb) => {
      cb('online');
      return () => {};
    },
    close: () => channel.close(),
  };
}

function peerTransport(room: string, isHost: boolean): MesaTransport {
  const t = createPeerTransport({ roomId: room, seat: isHost ? 0 : 1, role: isHost ? 'host' : 'client', name: '' });
  return {
    get id() {
      return t.playerId;
    },
    send: (type, payload) => t.send(type, payload),
    on: (h) => t.on((m) => h({ type: m.type, from: m.from, payload: m.payload })),
    onStatus: (cb) => t.onStatus((s) => cb(s)),
    close: () => t.close(),
  };
}

/** A secret this phone repeats when it reconnects, so the relay gives its seat back to it and to nobody else. */
export const seatKey = () => Array.from({ length: 3 }, () => Math.random().toString(36).slice(2, 10)).join('').slice(0, 24).padEnd(16, '0');

function wsTransport(room: string, isHost: boolean, apiUrl: string): MesaTransport {
  const id = `${isHost ? 'h' : 'g'}-${Math.random().toString(36).slice(2, 9)}`;
  const key = seatKey();
  const handlers = new Set<(msg: Wire) => void>();
  const statusHandlers = new Set<(s: TransportStatus) => void>();
  let ws: WebSocket | null = null;
  let closed = false;
  let status: TransportStatus = 'connecting';
  const queue: string[] = [];
  const setStatus = (s: TransportStatus) => {
    status = s;
    for (const cb of statusHandlers) cb(s);
  };
  const url = `${apiUrl.replace(/^http/, 'ws')}/rooms/${encodeURIComponent(room)}?role=${isHost ? 'host' : 'guest'}&id=${id}&k=${key}`;
  const open = () => {
    if (closed) return;
    ws = new WebSocket(url);
    ws.onopen = () => {
      setStatus('online');
      while (queue.length) ws!.send(queue.shift()!);
    };
    ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(String(e.data)) as Wire;
        if (msg.from !== id) for (const h of handlers) h(msg);
      } catch {
        /* ignore what isn't ours */
      }
    };
    ws.onclose = () => {
      if (closed) return;
      setStatus('reconnecting');
      window.setTimeout(open, 1500);
    };
  };
  open();
  return {
    id,
    send: (type, payload, to) => {
      const data = JSON.stringify(to ? { type, from: id, payload, to } : { type, from: id, payload });
      if (ws?.readyState === WebSocket.OPEN) ws.send(data);
      else if (queue.length < 200) queue.push(data);
    },
    on: (h) => {
      handlers.add(h);
      return () => handlers.delete(h);
    },
    onStatus: (cb) => {
      statusHandlers.add(cb);
      cb(status);
      return () => statusHandlers.delete(cb);
    },
    close: () => {
      closed = true;
      ws?.close();
    },
  };
}

export function createTransport(kind: TransportKind, room: string, isHost: boolean, apiUrl: string): MesaTransport {
  if (kind === 'local') return localTransport(room, isHost);
  if (kind === 'ws' && apiUrl) return wsTransport(room, isHost, apiUrl);
  return peerTransport(room, isHost);
}

/** `?red=local|webrtc|ws` forces one (QA); otherwise the relay when there is a backend, WebRTC when not. */
export function pickTransport(search: string, apiUrl: string): TransportKind {
  const forced = new URLSearchParams(search).get('red');
  if (forced === 'local' || forced === 'webrtc' || (forced === 'ws' && apiUrl)) return forced;
  return apiUrl ? 'ws' : 'webrtc';
}

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
/** A 4-character room code with no look-alikes (no I/1, O/0). */
export function newRoomCode(rand: () => number = Math.random): string {
  return Array.from({ length: 4 }, () => ALPHABET[Math.floor(rand() * ALPHABET.length)]).join('');
}
export const isRoomCode = (s: string | null): s is string => !!s && /^[A-HJ-NP-Z2-9]{4}$/.test(s);
