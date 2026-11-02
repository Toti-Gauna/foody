'use client';

import { useCallback, useEffect, useState, useSyncExternalStore, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowLeft, LayoutDashboard, Smartphone } from 'lucide-react';
import { API_URL, BASE_PATH } from '@/lib/env';
import { isRoomCode, newRoomCode } from '@/games/mesa/transport';
import { formatUsd, includes, isPlanId, plans, PLAN_IDS, type PlanId } from '@/lib/plans';
import { LuceroProvider, useLucero, type Lang } from './store';
import { preloadGus } from './Gus';
import { CartaApp } from './carta/CartaApp';
import { Crm, type CrmSection } from './crm/Crm';
import { SyncInvite } from './SyncInvite';
import './lucero.css';
import './crm/crm.css';

type View = 'carta' | 'crm';
const SECTIONS: CrmSection[] = ['servicio', 'cocina', 'clientes', 'carta', 'juegos', 'academy'];

const noop = () => () => {};
/** The query string, '' on the server (the static export renders the demo without it). */
const useSearchString = () => useSyncExternalStore(noop, () => window.location.search, () => '');

/** Read `?plan=`, `?vista=` and `?area=` against their lists; anything else is ignored. */
function readUrl(search: string) {
  const q = new URLSearchParams(search);
  const plan = q.get('plan');
  const vista = q.get('vista');
  const area = q.get('area');
  const sync = q.get('sync');
  return {
    sync: isRoomCode(sync) ? sync : null,
    lead: q.get('lider') === '1',
    plan: isPlanId(plan) ? plan : null,
    view: (vista === 'crm' ? 'crm' : 'carta') as View,
    section: (SECTIONS as string[]).includes(area ?? '') ? (area as CrmSection) : 'servicio',
  };
}

export interface DemoExtras {
  /** The games modal of the guest's carta (fase 5). */
  renderGames?: Parameters<typeof CartaApp>[0]['renderGames'];
  /** CRM sections built in later phases. */
  slots?: Partial<Record<CrmSection, ReactNode>>;
}

/**
 * Lucero, the demo at /<locale>/demo/: the guest's carta and the venue's CRM sharing one night. On a computer both are on
 * screen (the CRM, and the phone docked on the right); on a phone, one at a time with a switch. `?plan=25|50|75` shows
 * the demo through a plan; without it, everything is open.
 */
export function LuceroDemo({ lang, extras }: { lang: Lang; extras?: DemoExtras }) {
  const fromUrl = readUrl(useSearchString());
  // What the visitor picked here wins over the URL it came with (the URL is then kept in step with replaceState).
  const [picked, setPicked] = useState<{ plan?: PlanId | null; view?: View; section?: CrmSection; sync?: string }>({});
  const syncCode = API_URL ? (picked.sync ?? fromUrl.sync) : null;
  // The screen that made the code leads (also after a reload: `lider=1` stays in its URL, not in the phone's link).
  const syncLead = !!picked.sync || (!!fromUrl.sync && fromUrl.lead);
  const plan = picked.plan !== undefined ? picked.plan : fromUrl.plan;
  const view = picked.view ?? fromUrl.view;
  const section = picked.section ?? fromUrl.section;
  const setPlan = (p: PlanId | null) => setPicked((c) => ({ ...c, plan: p }));
  const setView = (v: View) => setPicked((c) => ({ ...c, view: v }));
  const setSection = (x: CrmSection) => setPicked((c) => ({ ...c, section: x }));

  useEffect(() => {
    preloadGus();
  }, []);

  const sync = useCallback((next: { plan?: PlanId | null; view?: View; section?: CrmSection; sync?: string }) => {
    const q = new URLSearchParams(window.location.search);
    if (next.sync) {
      q.set('sync', next.sync);
      q.set('lider', '1');
    }
    if (next.plan) q.set('plan', next.plan);
    else if (next.plan === null) q.delete('plan');
    if (next.view) q.set('vista', next.view);
    if (next.section) q.set('area', next.section);
    const s = q.toString();
    window.history.replaceState(null, '', `${window.location.pathname}${s ? `?${s}` : ''}`);
  }, []);

  return (
    <LuceroProvider plan={plan} lang={lang} syncCode={syncCode} syncLead={syncLead}>
      <Shell
        lang={lang}
        syncCode={syncCode}
        onPair={() => {
          if (syncCode) return;
          const code = newRoomCode();
          setPicked((c) => ({ ...c, sync: code }));
          sync({ sync: code });
        }}
        view={view}
        section={section}
        extras={extras}
        onPlan={(p) => {
          setPlan(p);
          sync({ plan: p });
        }}
        onView={(v) => {
          setView(v);
          sync({ view: v });
        }}
        onSection={(s) => {
          setSection(s);
          sync({ section: s });
        }}
      />
    </LuceroProvider>
  );
}

function Shell({
  lang,
  syncCode,
  onPair,
  view,
  section,
  extras,
  onPlan,
  onView,
  onSection,
}: {
  lang: Lang;
  syncCode: string | null;
  onPair: () => void;
  view: View;
  section: CrmSection;
  extras?: DemoExtras;
  onPlan: (p: PlanId | null) => void;
  onView: (v: View) => void;
  onSection: (s: CrmSection) => void;
}) {
  const t = useTranslations('lucero.shell');
  const { plan } = useLucero();
  const canPlay = !plan || includes(plan, 'juegos');
  const pairLink = syncCode && typeof window !== 'undefined' ? `${window.location.origin}${BASE_PATH}/${lang}/demo/?${plan ? `plan=${plan}&` : ''}vista=carta&sync=${syncCode}` : null;

  return (
    <div className="ld" data-view={view}>
      <header className="ld-top">
        <a className="ld-back" href={`${BASE_PATH}/${lang}/`}>
          <ArrowLeft aria-hidden className="size-4" />
          <span>{t('back')}</span>
        </a>
        <p className="ld-title">
          <b>Lucero</b>
          <span className="ld-demo">{t('demo')}</span>
          <span className="ld-note">{t('note')}</span>
        </p>
        {API_URL ? <SyncInvite link={pairLink} onOpen={onPair} /> : null}
        <label className="ld-plan">
          <span>{t('planLabel')}</span>
          <select value={plan ?? ''} onChange={(e) => onPlan(isPlanId(e.target.value) ? e.target.value : null)}>
            <option value="">{t('planAll')}</option>
            {PLAN_IDS.map((p) => (
              <option key={p} value={p}>
                {t('planOption', { price: formatUsd(plans.find((x) => x.id === p)!.priceUsd) })}
              </option>
            ))}
          </select>
        </label>
        <div className="ld-switch" role="group" aria-label={t('viewLabel')}>
          <button type="button" aria-pressed={view === 'carta'} onClick={() => onView('carta')}>
            <Smartphone aria-hidden className="size-4" />
            {t('viewCarta')}
          </button>
          <button type="button" aria-pressed={view === 'crm'} onClick={() => onView('crm')}>
            <LayoutDashboard aria-hidden className="size-4" />
            {t('viewCrm')}
          </button>
        </div>
      </header>
      <div className="ld-body">
        <section className="ld-crm" aria-label={t('crmLabel')}>
          <Crm section={section} onSection={onSection} slots={extras?.slots} />
        </section>
        <section className="ld-phone" aria-label={t('cartaLabel')}>
          <p className="ld-phone-label">{t('phoneLabel')}</p>
          <div className="ld-phone-frame">
            <CartaApp canPlay={canPlay} renderGames={extras?.renderGames} />
          </div>
        </section>
      </div>
    </div>
  );
}
