'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { SeasonDecor, SeasonProp, useSeason } from '../season';
import { Minus, Plus } from 'lucide-react';
import { asset } from '@/lib/env';
import { Gus, FRAMES, useFrames, type GusPose } from '../Gus';
import { DISHES, MENU, activeMine, cartCount, dishSoldOut, formatArs, lineTotal, useLucero, type Category, type Dish } from '../store';
import { Bubble, useSay } from './Bubble';

/**
 * The guest's carta (table 4, after scanning the QR): Gus greets from the top, reacts as you move through the categories
 * and writes every dish down; the bar at the bottom carries him (bigger than in the prototype: Ignacio, 02/11/2026), the
 * count and «Ver mi pedido».
 */
export function Menu({ onOpenOrder, onOpenStatus, scrollRoot }: { onOpenOrder: () => void; onOpenStatus: () => void; scrollRoot: React.RefObject<HTMLDivElement | null> }) {
  const t = useTranslations('lucero.carta');
  const { state, dispatch, lang, table } = useLucero();
  const [say, speak] = useSay();
  const [reaction, setReaction] = useState<{ pose: GusPose | 'write'; until: number } | null>(null);
  const [current, setCurrent] = useState<string>(MENU.categories[0].id);
  const lastCat = useRef<string>('');
  const n = cartCount(state.cart);
  const total = state.cart.reduce((s, l) => s + lineTotal(l), 0);
  const active = activeMine(state);
  const writing = useFrames(FRAMES.write, { fps: 6, play: reaction?.pose === 'write' });
  const waving = useFrames(FRAMES.wave, { fps: 4 });

  // React to the category on screen (inside the phone's own scroll).
  useEffect(() => {
    const root = scrollRoot.current;
    if (!root) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const id = (e.target as HTMLElement).dataset.cat!;
          setCurrent(id);
          if (lastCat.current === id) continue;
          const first = lastCat.current === '';
          lastCat.current = id;
          if (first) continue;
          const cat = MENU.categories.find((c) => c.id === id)!;
          setReaction({ pose: cat.pose as GusPose, until: Date.now() + 2600 });
          speak(cat.say[lang][0], 2600);
        }
      },
      { root, rootMargin: '-35% 0px -55% 0px' },
    );
    root.querySelectorAll('[data-cat]').forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [scrollRoot, lang, speak]);

  useEffect(() => {
    if (!reaction) return;
    const id = window.setTimeout(() => setReaction(null), Math.max(0, reaction.until - Date.now()));
    return () => window.clearTimeout(id);
  }, [reaction]);

  const season = useSeason();
  const ts = useTranslations('lucero.season');
  const add = (dish: Dish, options: string[]) => {
    dispatch({ type: 'add', dish: dish.id, options });
    const count = n + 1;
    setReaction({ pose: 'write', until: Date.now() + 1800 });
    speak(count === 1 ? t('noted1') : t('notedN', { n: count }), 2000);
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate?.(10);
  };

  const dockPose: GusPose = reaction ? (reaction.pose === 'write' ? writing : reaction.pose) : active ? 'bandeja-tapada' : '05-esperar';

  return (
    <div className="lc-menu">
      <section className="lc-hero" aria-labelledby="lc-hello" data-season={season}>
        <SeasonDecor />
        <div className="lc-hero-copy">
          {season === 'clasica' ? <p className="lc-kicker">{t('table', { n: table })}</p> : <p className="lc-season-chip">{ts(`${season}.chip`)}</p>}
          <h2 id="lc-hello" className="lc-hello">
            {season === 'clasica' ? t('hello') : ts(`${season}.hello`)}
          </h2>
          <p className="lc-hello-sub">{season === 'clasica' ? t('helloSub') : ts(`${season}.helloSub`)}</p>
        </div>
        <div className="lc-hero-gus">
          <Gus pose={waving} priority className="lc-hero-img" />
          <SeasonProp />
        </div>
      </section>

      <nav className="lc-cats" aria-label={t('catsLabel')}>
        <ul>
          {MENU.categories.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                aria-current={current === c.id ? 'true' : undefined}
                onClick={() => scrollRoot.current?.querySelector(`[data-cat="${c.id}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              >
                {c.name[lang]}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {MENU.categories.map((c) => (
        <CategoryBlock key={c.id} cat={c} onAdd={add} />
      ))}
      <p className="lc-foot-note">{t('footNote')}</p>

      <div className="lc-bar" role="region" aria-label={t('barLabel')}>
        <div className="lc-dock" aria-hidden>
          <Gus pose={dockPose} priority className="lc-dock-img" />
        </div>
        <Bubble text={say} className="lc-dock-bubble" />
        <div className="lc-bar-text" aria-live="polite">
          {n ? (
            <>
              <b>{t('countN', { n })}</b>
              <span>{formatArs(total, lang)}</span>
            </>
          ) : active ? (
            <>
              <b>{t(`status.${active.status}`)}</b>
              <span>{t('roundN', { n: active.round })}</span>
            </>
          ) : (
            <>
              <b>{t('empty')}</b>
              <span>{t('emptySub')}</span>
            </>
          )}
        </div>
        {n ? (
          <button type="button" className="lc-btn lc-btn-main" onClick={onOpenOrder}>
            {t('viewOrder')}
          </button>
        ) : active || state.orders.some((o) => o.mine) ? (
          <button type="button" className="lc-btn lc-btn-ghost" onClick={onOpenStatus}>
            {t('viewStatus')}
          </button>
        ) : null}
      </div>
    </div>
  );
}

function CategoryBlock({ cat, onAdd }: { cat: Category; onAdd: (dish: Dish, options: string[]) => void }) {
  const { lang } = useLucero();
  return (
    <section className="lc-cat" data-cat={cat.id} aria-labelledby={`lc-cat-${cat.id}`}>
      <p className="lc-kicker">{cat.kicker[lang]}</p>
      <h3 id={`lc-cat-${cat.id}`} className="lc-cat-title">
        {cat.name[lang]}
      </h3>
      {cat.photo ? (
        <div className="lc-photo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset(`/lucero/food/${cat.photo}.webp`)} alt="" loading="lazy" decoding="async" />
        </div>
      ) : null}
      <ul className="lc-items">
        {cat.items.map((d) => (
          <DishRow key={d.id} dish={d} onAdd={onAdd} />
        ))}
      </ul>
    </section>
  );
}

function DishRow({ dish, onAdd }: { dish: Dish; onAdd: (dish: Dish, options: string[]) => void }) {
  const t = useTranslations('lucero.carta');
  const { state, lang, dispatch } = useLucero();
  const group = dish.options ? MENU.optionGroups[dish.options] : null;
  const [picked, setPicked] = useState<string[]>(() => (group && !group.multi ? [group.options[0].id] : []));
  const out = dishSoldOut(state, dish.id);
  const inCart = useMemo(() => state.cart.filter((l) => l.dish === dish.id), [state.cart, dish.id]);
  const count = inCart.reduce((s, l) => s + l.qty, 0);
  const last = inCart[inCart.length - 1];

  const toggle = (id: string) =>
    setPicked((cur) => (group?.multi ? (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]) : [id]));

  return (
    <li className={`lc-item ${out ? 'is-out' : ''}`}>
      <div className="lc-item-top">
        <span className="lc-item-name">{dish.name[lang]}</span>
        <span aria-hidden className="lc-leader" />
        <span className="lc-price">{formatArs(dish.price, lang)}</span>
      </div>
      <p className="lc-item-desc">
        {dish.desc[lang]}
        {out ? <b> · {t('soldOut')}</b> : null}
      </p>
      {dish.adult ? <p className="lc-adult">{t('adult')}</p> : null}
      {group && !out ? (
        <div className="lc-opts" role="group" aria-label={t('optionsOf', { dish: dish.name[lang] })}>
          {group.options.map((o) => (
            <button key={o.id} type="button" className="lc-opt" aria-pressed={picked.includes(o.id)} onClick={() => toggle(o.id)}>
              {o.label[lang]}
            </button>
          ))}
        </div>
      ) : null}
      <div className="lc-item-act">
        {out ? (
          <span className="lc-out">{t('soldOut')}</span>
        ) : count ? (
          <div className="lc-stepper">
            <button type="button" aria-label={t('less', { dish: dish.name[lang] })} onClick={() => last && dispatch({ type: 'qty', key: last.key, delta: -1 })}>
              <Minus aria-hidden className="size-4" />
            </button>
            <output aria-live="polite">{count}</output>
            <button type="button" aria-label={t('more', { dish: dish.name[lang] })} onClick={() => onAdd(dish, picked)}>
              <Plus aria-hidden className="size-4" />
            </button>
          </div>
        ) : (
          <button type="button" className="lc-add" aria-label={t('add', { dish: dish.name[lang] })} onClick={() => onAdd(dish, picked)}>
            <Plus aria-hidden className="size-5" />
          </button>
        )}
      </div>
    </li>
  );
}

export { DISHES };
