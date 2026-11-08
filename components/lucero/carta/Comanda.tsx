'use client';

import { useId, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowLeft, Minus, Plus, Send } from 'lucide-react';
import { Gus, FRAMES, useFrames } from '../Gus';
import { DISHES, MENU, cartCount, formatArs, lineTotal, myOrders, useLucero, type Line } from '../store';
import { Bubble } from './Bubble';

/**
 * «Tu pedido»: the order before it goes to the kitchen. A clean sheet (the prototype's scene and stacked rounds made it
 * look odd: Ignacio, 02/11/2026): Gus writing at the top, the lines with their steppers, the name and the notes, the
 * total and one button. «Mandar a la cocina» sends it at once; there is nothing else to press.
 */
export function Comanda({ onBack, onSent }: { onBack: () => void; onSent: (id: string) => void }) {
  const t = useTranslations('lucero.comanda');
  const { state, dispatch, lang, table } = useLucero();
  const [name, setName] = useState(state.guestName);
  const [note, setNote] = useState('');
  const pose = useFrames(FRAMES.write, { fps: 5 });
  const nameId = useId();
  const noteId = useId();
  const n = cartCount(state.cart);
  const total = state.cart.reduce((s, l) => s + lineTotal(l), 0);
  const round = myOrders(state).length + 1;

  const send = () => {
    if (!n) return;
    const id = `m${Date.now().toString(36)}`;
    dispatch({ type: 'send', id, guest: name.trim() || t('defaultName', { n: table }), note: note.trim(), now: Date.now() });
    onSent(id);
  };

  return (
    <div className="lc-sheet">
      <div className="lc-sheet-top">
        <button type="button" className="lc-icon-btn" onClick={onBack} aria-label={t('back')}>
          <ArrowLeft aria-hidden className="size-5" />
        </button>
        <div>
          <h2 className="lc-sheet-title">{t('title')}</h2>
          <p className="lc-kicker">{t('sub', { table: 4, round })}</p>
        </div>
      </div>

      <div className="lc-comanda-gus" aria-hidden>
        <Gus pose={pose} priority className="lc-comanda-img" />
        <Bubble text={n ? t('gusAsk') : t('gusEmpty')} className="lc-comanda-bubble" />
      </div>

      {n ? (
        <ul className="lc-lines">
          {state.cart.map((l) => (
            <LineRow key={l.key} line={l} />
          ))}
        </ul>
      ) : (
        <p className="lc-empty">{t('empty')}</p>
      )}

      <div className="lc-fields">
        <label htmlFor={nameId}>{t('name')}</label>
        <input id={nameId} value={name} onChange={(e) => setName(e.target.value)} autoComplete="given-name" maxLength={40} placeholder={t('namePlaceholder')} />
        <label htmlFor={noteId}>{t('note')}</label>
        <textarea id={noteId} value={note} onChange={(e) => setNote(e.target.value)} maxLength={160} rows={2} placeholder={t('notePlaceholder')} />
      </div>

      <div className="lc-total">
        <span>{t('total')}</span>
        <b>{formatArs(total, lang)}</b>
      </div>
      <button type="button" className="lc-btn lc-btn-main lc-btn-block" disabled={!n} onClick={send}>
        <Send aria-hidden className="size-4" />
        {t('send')}
      </button>
      <p className="lc-paynote">{t('payNote')}</p>
    </div>
  );
}

function LineRow({ line }: { line: Line }) {
  const t = useTranslations('lucero.comanda');
  const { dispatch, lang } = useLucero();
  const dish = DISHES[line.dish];
  const group = dish.options ? MENU.optionGroups[dish.options] : null;
  const detail = line.options.map((id) => group?.options.find((o) => o.id === id)?.label[lang]).filter(Boolean).join(', ');
  return (
    <li className="lc-line">
      <div className="lc-stepper">
        <button type="button" aria-label={t('less', { dish: dish.name[lang] })} onClick={() => dispatch({ type: 'qty', key: line.key, delta: -1 })}>
          <Minus aria-hidden className="size-4" />
        </button>
        <output>{line.qty}</output>
        <button type="button" aria-label={t('more', { dish: dish.name[lang] })} onClick={() => dispatch({ type: 'qty', key: line.key, delta: 1 })}>
          <Plus aria-hidden className="size-4" />
        </button>
      </div>
      <div className="lc-line-name">
        <span>{dish.name[lang]}</span>
        {detail ? <small>{detail}</small> : null}
      </div>
      <span className="lc-price">{formatArs(lineTotal(line), lang)}</span>
    </li>
  );
}
