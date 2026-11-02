'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Copy, Crown, Play, Users } from 'lucide-react';
import type { Room } from './useRoom';

/**
 * The room before the game: the code, the link and the QR to join (Ignacio, 02/11/2026: «una sala que se comparte con
 * un link, un código o un QR»), who is in, and the host's «Empezar». The link carries the code and the game; scanning
 * the QR opens the same link on the other phone.
 */
export function Lobby({ room, code, joinUrl, min, onBot }: { room: Room; code: string; joinUrl: string; min: number; onBot?: () => void }) {
  const t = useTranslations('lucero.mesa');
  const [qr, setQr] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let alive = true;
    import('qrcode')
      .then((m) => m.toDataURL(joinUrl, { margin: 1, width: 360, color: { dark: '#1a1113', light: '#f6edda' } }))
      .then((url) => alive && setQr(url))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [joinUrl]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(joinUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* the link is on screen to select by hand */
    }
  };

  const enough = room.players.length >= min;
  return (
    <div className="ms-lobby">
      {room.isHost ? (
        <>
          <p className="lc-kicker">{t('code')}</p>
          <p className="ms-code" aria-live="polite">
            {code.split('').map((c, i) => (
              <span key={i}>{c}</span>
            ))}
          </p>
          <div className="ms-share">
            {qr ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={qr} alt={t('qrAlt', { code })} width={180} height={180} className="ms-qr" />
            ) : (
              <span className="ms-qr ms-qr-wait" />
            )}
            <div className="ms-share-text">
              <p>{t('shareHow')}</p>
              <p className="ms-link" title={joinUrl}>
                {joinUrl}
              </p>
              <button type="button" className="lc-btn lc-btn-ghost" onClick={copy}>
                <Copy aria-hidden className="size-4" />
                {copied ? t('copied') : t('copy')}
              </button>
            </div>
          </div>
        </>
      ) : (
        <p className="ms-wait">{t('waitHost')}</p>
      )}

      <h3 className="gl-h">
        <Users aria-hidden className="size-4" /> {t('players', { n: room.players.length })}
      </h3>
      <ul className="ms-players" aria-live="polite">
        {room.players.map((p) => (
          <li key={p.id}>
            {p.host ? <Crown aria-label={t('hostLabel')} className="size-4" /> : <span aria-hidden className="ms-dot" />}
            <span>{p.name}</span>
            {p.id === room.me ? <small>{t('you')}</small> : null}
          </li>
        ))}
      </ul>
      <p className="ms-status">{t(`status.${room.status}`)}</p>

      {room.isHost ? (
        <div className="ms-actions">
          <button type="button" className="lc-btn lc-btn-main lc-btn-block" disabled={!enough} onClick={room.start}>
            <Play aria-hidden className="size-4" />
            {enough ? t('start') : t('needMore', { n: min })}
          </button>
          {onBot ? (
            <button type="button" className="lc-btn lc-btn-ghost lc-btn-block" onClick={onBot}>
              {t('vsGus')}
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
