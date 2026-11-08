'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Check, Gamepad2, Receipt, UtensilsCrossed } from 'lucide-react';
import { Gus, FRAMES, PLATE_GLOW, useFrames, type GusPose } from '../Gus';
import { DISHES, ORDER_FLOW, formatArs, lineTotal, orderTotal, tableTotal, useLucero, type Order } from '../store';
import { Bubble, useSay } from './Bubble';

const hhmm = (ms: number | undefined) => (ms ? new Date(ms).toTimeString().slice(0, 5) : '');

/**
 * «Tu pedido fue realizado»: what happens with the order, told by Gus and by a list of steps that tick on their own.
 * Sent: he takes the ticket to the kitchen. Kitchen: he waits with the covered tray (and peeks once in a while). Ready:
 * he runs with it. Delivered: the lid comes off with sparks, «¡Buen provecho!». Every step is a real state of the order
 * (the same one the CRM shows): Gus never pretends.
 */
export function Pedido({
  order,
  onMore,
  canPlay,
  onPlay,
}: {
  order: Order;
  onMore: () => void;
  canPlay: boolean;
  onPlay: () => void;
}) {
  const t = useTranslations('lucero.pedido');
  const { state, dispatch, lang } = useLucero();
  const delivered = order.status === 'delivered';

  return (
    <div className="lc-sheet lc-pedido">
      <div className="lc-done" role="status" aria-live="polite">
        <span className={`lc-done-check ${delivered ? 'is-ok' : ''}`} aria-hidden>
          {delivered ? <UtensilsCrossed className="size-5" /> : <Check className="size-5" />}
        </span>
        <div>
          <h2 className="lc-sheet-title">{delivered ? t('deliveredTitle') : t('title')}</h2>
          <p className="lc-kicker">{t(`now.${order.status}`)}</p>
        </div>
      </div>

      <Scene order={order} bill={state.billRequested && delivered} />

      <ol className="lc-steps">
        {ORDER_FLOW.map((s) => {
          const reached = ORDER_FLOW.indexOf(order.status) >= ORDER_FLOW.indexOf(s);
          const current = order.status === s;
          return (
            <li key={s} data-reached={reached || undefined} data-current={current || undefined}>
              <span aria-hidden className="lc-step-dot">
                {reached ? <Check className="size-3" /> : null}
              </span>
              <span className="lc-step-name">{t(`step.${s}`)}</span>
              <span className="lc-step-time">{hhmm(order.at[s])}</span>
            </li>
          );
        })}
      </ol>

      {canPlay && !delivered ? (
        <button type="button" className="lc-btn lc-btn-main lc-btn-block" onClick={onPlay}>
          <Gamepad2 aria-hidden className="size-4" />
          {t('play')}
        </button>
      ) : null}


      <details className="lc-ticket">
        <summary>
          {t('ticket', { round: order.round })} · {formatArs(orderTotal(order), lang)}
        </summary>
        <ul>
          {order.lines.map((l) => (
            <li key={l.key}>
              <span>
                {l.qty} × {DISHES[l.dish].name[lang]}
              </span>
              <span>{formatArs(lineTotal(l), lang)}</span>
            </li>
          ))}
        </ul>
      </details>

      <div className="lc-row2">
        <button type="button" className="lc-btn lc-btn-ghost" onClick={onMore}>
          {t('more')}
        </button>
        <button type="button" className="lc-btn lc-btn-ghost" disabled={!delivered || state.billRequested} onClick={() => dispatch({ type: 'bill' })}>
          <Receipt aria-hidden className="size-4" />
          {state.billRequested ? t('billAsked') : t('bill')}
        </button>
      </div>
      <p className="lc-paynote">
        {t('tableTotal')} <b>{formatArs(tableTotal(state), lang)}</b> · {t('payNote')}
      </p>
    </div>
  );
}

function Scene({ order, bill }: { order: Order; bill: boolean }) {
  const t = useTranslations('lucero.pedido');
  const table = order.table;
  const [say, speak] = useSay();
  const [peek, setPeek] = useState(false);
  // Timed beats of a step, keyed by the step: a new step starts clean without resetting state in an effect.
  const stepKey = `${order.id}:${order.status}`;
  const [beat, setBeat] = useState<string | null>(null);
  const leaving = order.status === 'sent' && beat === stepKey;
  const revealed = order.status === 'delivered' && beat === stepKey;
  const run = useFrames(FRAMES.runTray, { fps: 10, play: order.status === 'ready' });
  const lid = useFrames(FRAMES.lid, { fps: 3, loop: false, play: order.status === 'delivered' && !bill, still: 'campana-f3' });

  // What Gus says at each step.
  useEffect(() => {
    if (bill) return speak(t('say.bill'), 0);
    if (order.status === 'sent') speak(t('say.sent'), 0);
    if (order.status === 'kitchen') speak(t('say.kitchen'), 3200);
    if (order.status === 'ready') speak(t('say.ready'), 0);
    if (order.status === 'delivered') speak(t('say.delivered'), 0);
  }, [order.status, bill, speak, t]);

  // Sent: he walks to the door with the ticket, then goes in.
  useEffect(() => {
    if (order.status !== 'sent') return;
    const id = window.setTimeout(() => setBeat(stepKey), 1400);
    return () => window.clearTimeout(id);
  }, [order.status, stepKey]);

  // Kitchen: he can't resist a peek under the lid now and then.
  useEffect(() => {
    if (order.status !== 'kitchen') return;
    const id = window.setInterval(() => {
      setPeek(true);
      speak(t('say.peek'), 1800);
      window.setTimeout(() => setPeek(false), 1600);
    }, 5200);
    return () => window.clearInterval(id);
  }, [order.status, speak, t]);

  // Delivered: sparks once the lid is up.
  useEffect(() => {
    if (order.status !== 'delivered') return;
    const id = window.setTimeout(() => setBeat(stepKey), 700);
    return () => window.clearTimeout(id);
  }, [order.status, stepKey]);

  let pose: GusPose = '05-esperar';
  let flip = false;
  let at: 'table' | 'center' | 'door' = 'center';
  if (bill) {
    pose = '14-caminar-con-cuenta';
    flip = true;
    at = 'table';
  } else if (order.status === 'sent') {
    pose = leaving ? '06-irse-con-cuenta' : '14-caminar-con-cuenta';
    at = 'door';
  } else if (order.status === 'kitchen') {
    pose = peek ? 'espia' : 'bandeja-tapada';
    at = 'center';
  } else if (order.status === 'ready') {
    pose = run;
    flip = true;
    at = 'table';
  } else {
    pose = revealed && lid === 'campana-f3' ? 'campana-f3' : lid;
    flip = true;
    at = 'table';
  }

  return (
    <div className="lc-scene" aria-hidden data-status={order.status}>
      <div className="lc-scene-wall" />
      <div className="lc-scene-floor" />
      <div className="lc-scene-lamp" />
      <div className="lc-table4">
        <span className="lc-candle" />
        <span className="lc-table-top" />
        <span className="lc-table-label">{t('tableLabel', { n: table })}</span>
      </div>
      <div className={`lc-door ${order.status === 'sent' && leaving ? 'is-open' : ''}`}>
        <span className="lc-door-sign">{t('kitchen')}</span>
        <span className="lc-door-leaf" />
      </div>
      <div className="lc-scene-gus" data-at={at} data-leaving={(order.status === 'sent' && leaving) || undefined}>
        <Bubble text={say} className="lc-scene-bubble" />
        <Gus pose={pose} flip={flip} priority className="lc-scene-img" />
        {order.status === 'delivered' && revealed && !bill ? (
          <span className="lc-sparks" style={{ left: `${(1 - PLATE_GLOW.x) * 100}%`, top: `${PLATE_GLOW.y * 100}%` }}>
            {Array.from({ length: 14 }, (_, i) => (
              <i key={i} style={{ ['--a' as string]: `${(i / 14) * 360}deg`, ['--d' as string]: `${46 + (i % 3) * 18}px` }} />
            ))}
          </span>
        ) : null}
      </div>
    </div>
  );
}
