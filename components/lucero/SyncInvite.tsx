'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { QrCode, X } from 'lucide-react';

/**
 * «Pedí desde tu celular» (only with a backend): a QR that opens the guest's carta on a phone, paired with this screen
 * through a code. What is ordered there shows up here at once. Ghost button: the screen's solid one stays the carta's.
 */
export function SyncInvite({ link, onOpen }: { link: string | null; onOpen: () => void }) {
  const t = useTranslations('lucero.shell.sync');
  const dialog = useRef<HTMLDialogElement>(null);
  const [qr, setQr] = useState<{ link: string; src: string } | null>(null);

  useEffect(() => {
    if (!link) return;
    let alive = true;
    import('qrcode')
      .then((m) => m.toDataURL(link, { margin: 1, width: 360, color: { dark: '#1a1113', light: '#f6edda' } }))
      .then((src) => alive && setQr({ link, src }))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [link]);

  return (
    <>
      <button
        type="button"
        className="ld-sync"
        onClick={() => {
          onOpen();
          dialog.current?.showModal();
        }}
      >
        <QrCode aria-hidden className="size-4" />
        <span>{t('button')}</span>
      </button>
      <dialog ref={dialog} className="ac-dialog ld-sync-dialog" aria-labelledby="ld-sync-title" onClick={(e) => e.target === e.currentTarget && dialog.current?.close()}>
        <div className="ac-view">
          <header className="ac-view-head">
            <p className="ac-kind">{t('kicker')}</p>
            <h2 id="ld-sync-title" className="crm-h">
              {t('title')}
            </h2>
            <button type="button" className="crm-icon" onClick={() => dialog.current?.close()} aria-label={t('close')}>
              <X aria-hidden className="size-5" />
            </button>
          </header>
          <p className="crm-muted">{t('text')}</p>
          {qr && qr.link === link ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="ld-sync-qr" src={qr.src} alt={t('qrAlt')} width={220} height={220} />
          ) : (
            <span className="ld-sync-qr" aria-hidden />
          )}
          {link ? <p className="ms-link">{link}</p> : null}
        </div>
      </dialog>
    </>
  );
}
