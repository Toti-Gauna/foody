'use client';

import { useTranslations } from 'next-intl';
import { Plus, Trash2 } from 'lucide-react';
import { planById, type GameId } from '@/lib/plans';
import { useLucero, type Prize } from '../store';

const ALL_GAMES: GameId[] = ['ninja', 'combinaciones', 'catapulta', 'dibujo', 'hockey'];

/**
 * CRM → «Juegos y ruleta» (plan 50 and up): the wheel's prizes and their odds, which the venue sets (a weight per prize;
 * the share each gets is shown next to it), the prizes handed out tonight with their codes, and which games the guests
 * see on this plan.
 */
export function JuegosAdmin() {
  const t = useTranslations('lucero.crm.juegos');
  const tg = useTranslations('lucero.games');
  const { state, dispatch, plan } = useLucero();
  const total = state.prizes.reduce((s, p) => s + Math.max(0, p.weight), 0);
  const set = (prizes: Prize[]) => dispatch({ type: 'setPrizes', prizes });
  const update = (id: string, patch: Partial<Prize>) => set(state.prizes.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  const games = plan ? planById(plan).games : ALL_GAMES;
  const won = state.spins.filter((s) => s.prize);

  return (
    <section aria-labelledby="crm-juegos">
      <header className="crm-head">
        <h2 id="crm-juegos" className="crm-h">
          {t('title')}
        </h2>
        <p className="crm-muted">{t('sub')}</p>
      </header>

      <h3 className="crm-h4">{t('prizes')}</h3>
      <ul className="crm-prizes">
        {state.prizes.map((p) => (
          <li key={p.id}>
            <label className="sr-only" htmlFor={`pz-${p.id}`}>
              {t('prizeName')}
            </label>
            <input id={`pz-${p.id}`} className="crm-input" value={p.label} maxLength={32} placeholder={t('nothing')} onChange={(e) => update(p.id, { label: e.target.value })} />
            <label className="crm-weight">
              <span>{t('weight')}</span>
              <input type="number" inputMode="numeric" min={0} max={20} className="crm-input" value={p.weight} onChange={(e) => update(p.id, { weight: Math.max(0, Math.min(20, Number(e.target.value) || 0)) })} />
            </label>
            <output className="crm-share">{total ? Math.round((Math.max(0, p.weight) / total) * 100) : 0}%</output>
            <button type="button" className="crm-icon" onClick={() => set(state.prizes.filter((x) => x.id !== p.id))} aria-label={t('remove', { prize: p.label || t('nothing') })}>
              <Trash2 aria-hidden className="size-4" />
            </button>
          </li>
        ))}
      </ul>
      <button type="button" className="lc-btn lc-btn-ghost" onClick={() => set([...state.prizes, { id: `p${Date.now().toString(36)}`, label: t('newPrize'), weight: 1 }])}>
        <Plus aria-hidden className="size-4" />
        {t('add')}
      </button>
      <p className="crm-muted crm-gap">{t('rule')}</p>

      <h3 className="crm-h4">{t('handed')}</h3>
      {won.length ? (
        <ul className="crm-history">
          {won.map((s) => (
            <li key={s.orderId}>
              <span>{state.prizes.find((p) => p.id === s.prize)?.label ?? '—'}</span>
              <span className="ru-code">{s.code}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="crm-muted">{t('noneYet')}</p>
      )}

      <h3 className="crm-h4">{t('games')}</h3>
      <ul className="crm-chips">
        {games.map((g) => (
          <li key={g} className="crm-tag">
            {tg(`items.${g}.name`)}
          </li>
        ))}
      </ul>
    </section>
  );
}
