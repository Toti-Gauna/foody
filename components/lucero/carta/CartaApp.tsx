'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { Menu } from './Menu';
import { Comanda } from './Comanda';
import { Pedido } from './Pedido';
import { myOrders, useLucero } from '../store';

export type CartaView = 'menu' | 'comanda' | 'pedido';

/**
 * The guest's side of Lucero: carta → «Tu pedido» → «Tu pedido fue realizado». It scrolls inside its own box, so it fits
 * the whole phone screen on a phone and the docked phone on a computer. `games` (fase 5) is the modal that offers the
 * plan's games while the food is on its way: it opens by itself right after an order is placed.
 */
export function CartaApp({
  canPlay = false,
  renderGames,
}: {
  canPlay?: boolean;
  renderGames?: (props: { open: boolean; onClose: () => void; orderId: string | null }) => ReactNode;
}) {
  const t = useTranslations('lucero.carta');
  const { state } = useLucero();
  const [view, setView] = useState<CartaView>('menu');
  const [focus, setFocus] = useState<string | null>(null);
  const [games, setGames] = useState(false);
  const scroll = useRef<HTMLDivElement>(null);
  const mine = myOrders(state);
  const order = mine.find((o) => o.id === focus) ?? mine[0] ?? null;

  useEffect(() => {
    scroll.current?.scrollTo({ top: 0, behavior: 'instant' });
  }, [view]);

  return (
    <div className="lc-app">
      <header className="lc-top">
        <span className="lc-brand">Lucero</span>
        <span className="lc-chip">
          <span aria-hidden className="lc-live" />
          {t('table', { n: 4 })}
        </span>
        <span className="lc-demo">{t('demo')}</span>
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
              if (canPlay) window.setTimeout(() => setGames(true), 1600);
            }}
          />
        ) : order ? (
          <Pedido order={order} onMore={() => setView('menu')} canPlay={canPlay} onPlay={() => setGames(true)} />
        ) : null}
      </div>
      {renderGames?.({ open: games, onClose: () => setGames(false), orderId: order?.id ?? null })}
    </div>
  );
}
