'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { Menu } from './Menu';
import { Comanda } from './Comanda';
import { Pedido } from './Pedido';
import { myOrders, useLucero } from '../store';
import type { GamesStage } from '../games/GamesLayer';

export type CartaView = 'menu' | 'comanda' | 'pedido';

/**
 * The guest's side of Lucero: carta → «Tu pedido» → «Tu pedido fue realizado». It scrolls inside its own box, so it fits
 * the whole phone screen on a phone and the docked phone on a computer. `renderGames` (fase 5) shows, right after an order
 * is placed on a plan with games, the wheel over the whole screen and then the games modal.
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
              // The wheel takes the whole screen a moment after «Tu pedido fue realizado»; the games modal follows it.
              if (canPlay) window.setTimeout(() => setStage('wheel'), 1100);
            }}
          />
        ) : order ? (
          <Pedido
            order={order}
            onMore={() => setView('menu')}
            canPlay={canPlay}
            onPlay={() => setStage('games')}
            onSpin={canPlay && !state.spins.some((s) => s.orderId === order.id) ? () => setStage('wheel') : undefined}
          />
        ) : null}
      </div>
      {renderGames?.({ stage, onStage: setStage, orderId: order?.id ?? null })}
    </div>
  );
}
