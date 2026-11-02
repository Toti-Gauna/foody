import { API_URL } from '@/lib/env';
import { seatKey } from '@/games/mesa/transport';

/**
 * The demo between devices, through Foody-be's `/sync/:channel` (everyone hears everyone else): the guest orders on a
 * phone and the order shows up in the CRM open on a computer. Only when there is a backend (`NEXT_PUBLIC_API_URL`); tabs
 * of one browser keep using the BroadcastChannel in the store. Messages are the store's own (`hello`, `action`, `state`).
 */
export interface SyncLink {
  send(msg: unknown): void;
  close(): void;
}

export function openSync(channel: string, onMessage: (msg: unknown) => void, onOpen: () => void): SyncLink | null {
  if (!API_URL || typeof WebSocket === 'undefined') return null;
  const id = `d-${Math.random().toString(36).slice(2, 10)}`;
  const url = `${API_URL.replace(/^http/, 'ws')}/sync/${encodeURIComponent(channel)}?id=${id}&k=${seatKey()}`;
  const queue: string[] = [];
  let ws: WebSocket | null = null;
  let closed = false;
  let retry = 0;
  const open = () => {
    if (closed) return;
    ws = new WebSocket(url);
    ws.onopen = () => {
      // What was done offline goes first, then `onOpen` (the follower's hello): the answer already includes it.
      while (queue.length && ws?.readyState === WebSocket.OPEN) ws.send(queue.shift()!);
      onOpen();
    };
    ws.onmessage = (e) => {
      try {
        onMessage((JSON.parse(String(e.data)) as { payload: unknown }).payload);
      } catch {
        /* not ours */
      }
    };
    ws.onclose = () => {
      if (!closed) retry = window.setTimeout(open, 2000);
    };
  };
  open();
  return {
    send(msg) {
      const data = JSON.stringify({ type: 'demo', payload: msg });
      if (ws?.readyState === WebSocket.OPEN) ws.send(data);
      else if (queue.length < 50) queue.push(data);
    },
    close() {
      closed = true;
      window.clearTimeout(retry);
      ws?.close();
    },
  };
}
