'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import { useTranslations } from 'next-intl';
import { Download, Share } from 'lucide-react';
import { asset } from '@/lib/env';

interface InstallPrompt extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

let deferred: InstallPrompt | null = null;
const noopSub = () => () => {};
const listeners = new Set<() => void>();
if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferred = e as InstallPrompt;
    listeners.forEach((fn) => fn());
  });
}

/** Registers the service worker once (offline shell and cached assets: public/sw.js). Production only. */
export function useServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' || !('serviceWorker' in navigator)) return;
    navigator.serviceWorker.register(asset('/sw.js'), { scope: `${asset('/')}` }).catch(() => {});
  }, []);
}

const standalone = () => typeof window !== 'undefined' && (window.matchMedia('(display-mode: standalone)').matches || (navigator as Navigator & { standalone?: boolean }).standalone === true);
const isIos = () => typeof navigator !== 'undefined' && /iphone|ipad|ipod/i.test(navigator.userAgent);

/**
 * «Instalar app»: on Android and desktop Chrome it opens the browser's install prompt; on iPhone (no prompt there) it
 * says how (Share → Add to Home Screen). Hidden once installed. Registers the service worker too.
 */
export function InstallButton({ compact = false }: { compact?: boolean }) {
  const t = useTranslations('lucero.live.pwa');
  useServiceWorker();
  const [, setTick] = useState(0);
  const [hint, setHint] = useState(false);
  const [installed, setInstalled] = useState(false);
  useEffect(() => {
    const fn = () => setTick((n) => n + 1);
    listeners.add(fn);
    const done = () => setInstalled(true);
    window.addEventListener('appinstalled', done);
    return () => {
      listeners.delete(fn);
      window.removeEventListener('appinstalled', done);
    };
  }, []);
  // Decided on the client only (the static page can't know the phone): nothing on the server, nothing while hydrating.
  const canOffer = useSyncExternalStore(
    noopSub,
    () => !standalone() && (!!deferred || isIos()),
    () => false,
  );
  if (installed || !canOffer) return null;

  const click = async () => {
    if (deferred) {
      await deferred.prompt();
      const choice = await deferred.userChoice;
      if (choice.outcome === 'accepted') setInstalled(true);
      deferred = null;
    } else setHint((h) => !h);
  };

  return (
    <div className="lv-install">
      <button type="button" className={compact ? 'k-icon' : 'k-btn k-btn--ghost k-btn--md'} onClick={click} aria-label={t('install')} title={t('install')}>
        <Download aria-hidden className="size-4" />
        {compact ? null : <span>{t('install')}</span>}
      </button>
      {hint ? (
        <p className="lv-install-hint" role="status">
          <Share aria-hidden className="size-4" /> {t('iosHint')}
        </p>
      ) : null}
    </div>
  );
}
