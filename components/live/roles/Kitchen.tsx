'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { ChefHat, Flame, Check } from 'lucide-react';
import { useLucero, type Action, type OrderStatus } from '@/components/lucero/store';
import { Badge, Empty, minutesSince, useNow } from '@/components/kit/atoms';
import { OrderTicket } from '@/components/kit/molecules';
import { useAlert } from '../useAlert';

const COLS: Exclude<OrderStatus, 'delivered'>[] = ['sent', 'kitchen', 'ready'];
const advance = (dispatch: (a: Action) => void, id: string, to: OrderStatus) => dispatch({ type: 'advance', id, to, now: Date.now() });

/**
 * Cocina: the comandas as they arrive (a beep and a buzz for each new one), «Empezar» and «Listo». Ready ones wait in
 * the last column until a waiter takes them. Big buttons: a kitchen phone is used with wet hands.
 */
export function Kitchen() {
  const t = useTranslations('lucero.live.cocina');
  const { state, dispatch, lang } = useLucero();
  const now = useNow(20_000);
  const fresh = state.orders.filter((o) => o.status === 'sent').length;
  const alert = useAlert();
  const seen = useRef(fresh);
  useEffect(() => {
    if (fresh > seen.current) alert();
    seen.current = fresh;
  }, [fresh, alert]);

  const move = (id: string, to: OrderStatus) => advance(dispatch, id, to);

  return (
    <div className="lv-board">
      {COLS.map((col) => {
        const orders = state.orders.filter((o) => o.status === col).sort((a, b) => (a.at.sent ?? 0) - (b.at.sent ?? 0));
        return (
          <section key={col} className="lv-col" data-status={col} aria-labelledby={`lv-col-${col}`}>
            <h2 id={`lv-col-${col}`} className="lv-col-h">
              {t(`cols.${col}`)} <Badge tone={col === 'sent' ? 'new' : col === 'kitchen' ? 'kitchen' : 'ready'}>{orders.length}</Badge>
            </h2>
            {orders.length ? (
              <ul className="lv-list">
                {orders.map((o) => (
                  <OrderTicket
                    key={o.id}
                    order={o}
                    lang={lang}
                    big
                    meta={`${t('ago', { n: minutesSince(o.at.sent, now) })} · ${o.source === 'mozo' ? t('byWaiter') : t('byQr')}`}
                    action={
                      col === 'sent'
                        ? { label: t('start'), onClick: () => move(o.id, 'kitchen'), icon: <Flame aria-hidden className="size-5" /> }
                        : col === 'kitchen'
                          ? { label: t('ready'), onClick: () => move(o.id, 'ready'), variant: 'ok', icon: <Check aria-hidden className="size-5" /> }
                          : undefined
                    }
                    status={col === 'ready' ? t('waiting') : undefined}
                  />
                ))}
              </ul>
            ) : (
              <Empty icon={<ChefHat aria-hidden className="size-6" />} title={t(`empty.${col}`)} />
            )}
          </section>
        );
      })}
    </div>
  );
}
