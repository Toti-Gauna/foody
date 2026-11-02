'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { Menu } from './Menu';
import { Comanda } from './Comanda';
import { Pedido } from './Pedido';
import { Gift } from 'lucide-react';
import { myOrders, useLucero, VISIT } from '../store';
import { onDemoReady } from '../LoadingScreen';
import type { GamesStage } from '../games/GamesLayer';

export type CartaView = 'menu' | 'comanda' | 'pedido';

/**
 * The guest's side of Lucero: carta → «Tu pedido» → «Tu pedido fue realizado». It scrolls inside its own box, so it fits
 * the whole phone screen on a phone and the docked phone on a computer. `renderGames` (fase 5) shows, on a plan with games,
 * the wheel over the whole screen when the carta opens, and the games modal right after an order is placed.
 */
export function CartaApp({
  canPlay = false,
  renderGames,
}: {
  canPlay?: boolean;
  renderGames?: (props: { stage: GamesStage; onStage: (s: GamesStage) => void; orderId: string | null }) => ReactNode;
}) {
  const t = useTranslations('lucero.carta');
  const { state } = useLucero();
  const [view, setView] = useState<CartaView>('menu');
  const [focus, setFocus] = useState<string | null>(null);
  const [stage, setStage] = useState<GamesStage>(null);
  const scroll = useRef<HTMLDivElement>(null);
  const mine = myOrders(state);
  const order = mine.find((o) => o.id === focus) ?? mine[0] ?? null;

  useEffect(() => {
    scroll.current?.scrollTo({ top: 0, behavior: 'instant' });
  }, [view]);

  // Right after scanning the QR: once the demo is on screen, the wheel (one spin per visit).
  const spun = state.spins.some((s) => s.orderId === VISIT);
  const offerWheel = canPlay && !spun;
  useEffect(() => {
    if (!offerWheel) return;
    let timer = 0;
    const off = onDemoReady(() => {
      timer = window.setTimeout(() => setStage((s) => s ?? 'wheel'), 500);
    });
    return () => {
      off();
      window.clearTimeout(timer);
    };
    // Only when the carta opens (or the plan starts having the wheel), not after every spin.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canPlay]);

  return (
    <div className="lc-app">
      <header className="lc-top">
        <span className="lc-brand">Lucero</span>
        <span className="lc-chip">
          <span aria-hidden className="lc-live" />
          {t('table', { n: 4 })}
        </span>
        <span className="lc-demo">{t('demo')}</span>
        {offerWheel ? (
          <button type="button" className="lc-wheel-chip" onClick={() => setStage('wheel')} aria-label={t('wheelChipLabel')}>
            <Gift aria-hidden className="size-4" />
            <span>{t('wheelChip')}</span>
          </button>
        ) : null}
      </header>
      <div ref={scroll} className="lc-scroll" data-view={view}>
        {view === 'menu' ? (
          <Menu scrollRoot={scroll} onOpenOrder={() => setView('comanda')} onOpenStatus={() => setView('pedido')} />
        ) : view === 'comanda' ? (
          <Comanda
            onBack={() => setView('menu')}
            onSent={(id) => {
              setFocus(id);
              setView('pedido');
              // The games modal, a moment after «Tu pedido fue realizado».
              if (canPlay) window.setTimeout(() => setStage('games'), 1300);
            }}
          />
        ) : order ? (
          <Pedido
            order={order}
            onMore={() => setView('menu')}
            canPlay={canPlay}
            onPlay={() => setStage('games')}
          />
        ) : null}
      </div>
      {renderGames?.({ stage, onStage: setStage, orderId: order?.id ?? null })}
    </div>
  );
}
