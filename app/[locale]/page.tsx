import type { ReactNode } from 'react';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing, type Locale } from '@/i18n/routing';
import { BackToEclipse, SiteNav } from '@/components/SiteNav';
import { Hero } from '@/components/hero/Hero';
import { Offer, OFFER_ITEMS } from '@/components/site/Offer';
import { DemoSection, DEMO_STEPS } from '@/components/site/DemoSection';
import { Plans, type PlanCard } from '@/components/site/Plans';
import { Others, type OtherItem } from '@/components/site/Others';
import { Close, FAQ } from '@/components/site/Close';
import { AutoTourButton } from '@/components/tour/AutoTourButton';
import { launchDate, otherProducts } from '@/lib/products';
import { firstPlanWith, formatUsd, plans, PLAN_IDS, type Feature, type PlanId } from '@/lib/plans';
import { whatsappUrl } from '@/lib/whatsapp';
import { ROOFY_URL } from '@/lib/env';
import '@/components/site/site.css';

/** What each «Qué ofrecemos» item needs, to say the plan it starts in. */
const OFFER_FEATURE: Record<(typeof OFFER_ITEMS)[number], Feature> = { carta: 'carta', crm: 'crm', juegos: 'juegos', academy: 'academy' };

/**
 * «Eclipse para restaurantes», the home: 01 hero · 02 qué ofrecemos · 03 demo · 04 planes · 05 otros negocios ·
 * 06 cierre · pie (docs/PLAN-EJECUCION.md). Every price is read from content/plans.json here and handed down as text.
 */
export default async function SitePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const l = locale as Locale;
  const t = await getTranslations({ locale, namespace: 'site' });
  const tl = await getTranslations({ locale, namespace: 'languages' });
  const tt = await getTranslations({ locale, namespace: 'autoTour' });
  const em = (chunks: ReactNode) => <em>{chunks}</em>;
  const price = (id: PlanId) => formatUsd(plans.find((p) => p.id === id)!.priceUsd);

  const others: OtherItem[] = otherProducts.map((p) => {
    const base = `others.items.${p.id}`;
    const name = t(`${base}.name`);
    const date = launchDate(p, l);
    const statusText =
      p.status === 'launch' ? t('others.status.launch', { date: date ?? '' }) : t(`others.status.${p.status as 'available' | 'planned' | 'soon'}`);
    const cta: OtherItem['cta'] =
      p.status === 'available'
        ? { label: t('others.visit'), href: `${ROOFY_URL}/${l}/`, kind: 'site' }
        : { label: p.status === 'launch' ? t('others.ask') : t('others.notify'), href: whatsappUrl(t(`${base}.ask`)), kind: 'whatsapp' };
    return {
      id: p.id,
      status: p.status,
      name,
      title: t.has(`${base}.title`) ? t(`${base}.title`) : name,
      rubro: t(`${base}.rubro`),
      line: t(`${base}.line`),
      points: p.points.map((key) => t(`${base}.points.${key}`)),
      statusText,
      note: p.status === 'planned' ? t('others.noPrice') : p.status === 'soon' ? t('others.soonNote') : null,
      cta,
    };
  });

  const planCards: PlanCard[] = PLAN_IDS.map((id, i) => {
    const base = `plans.items.${id}`;
    const keys = Object.keys(t.raw(`${base}.points`) as Record<string, string>);
    return {
      id,
      name: t(`${base}.name`),
      tagline: t(`${base}.tagline`),
      price: price(id),
      lead: i === 0 ? t('plans.includes') : t('plans.plus', { price: price(PLAN_IDS[i - 1]) }),
      points: keys.map((k) => t(`${base}.points.${k}`)),
      href: whatsappUrl(t('plans.message', { price: price(id) })),
    };
  });

  return (
    <>
      <a href="#contenido" className="sr-only-focusable site-skip">
        {t('skip')}
      </a>
      <div className="site theme-dark">
        <header className="site-top container-x">
          <SiteNav
            locale={l}
            locales={routing.locales}
            page="site"
            text={{
              languageLabel: tl('label'),
              lead: (
                <span className="site-mark-lockup">
                  <span className="site-mark-brand">{t('brand')}</span> <span className="site-mark-tagline">{t('tagline')}</span>
                </span>
              ),
              languages: { es: tl('es'), en: tl('en'), pt: tl('pt') },
            }}
          />
        </header>

        <main id="contenido" tabIndex={-1}>
          <Hero
            locale={l}
            id="inicio"
            next="ofrecemos"
            text={{
              section: t('hero.section'),
              brand: t('brand'),
              tagline: t('tagline'),
              sub: t('hero.sub'),
              cta: t('hero.cta'),
              demo: t('hero.demo'),
              status: t('hero.status'),
              from: t('hero.from', { price: price('25') }),
              statusNote: t('hero.statusNote'),
              demoBadge: t('demoBadge'),
              demoNote: t('hero.demoNote'),
            }}
          />
          <Offer
            id="ofrecemos"
            text={{
              section: t('offer.section'),
              title: t.rich('offer.title', { em }),
              lead: t('offer.lead'),
              items: Object.fromEntries(
                OFFER_ITEMS.map((k) => [
                  k,
                  { name: t(`offer.items.${k}.name`), text: t(`offer.items.${k}.text`), from: t('offer.from', { price: formatUsd(firstPlanWith(OFFER_FEATURE[k]).priceUsd) }) },
                ]),
              ) as Record<(typeof OFFER_ITEMS)[number], { name: string; text: string; from: string }>,
            }}
          />
          <DemoSection
            id="demo"
            locale={l}
            text={{
              section: t('demo.section'),
              title: t.rich('demo.title', { em }),
              lead: t('demo.lead'),
              steps: Object.fromEntries(DEMO_STEPS.map((k) => [k, t(`demo.steps.${k}`)])) as Record<(typeof DEMO_STEPS)[number], string>,
              inDemo: t('demo.inDemo'),
              open: t('demo.open'),
              crm: t('demo.crm'),
              asPlan: t('demo.asPlan'),
              plans: Object.fromEntries(PLAN_IDS.map((id) => [id, t('demo.plan', { price: price(id) })])) as Record<PlanId, string>,
              demoBadge: t('demoBadge'),
            }}
          />
          <Plans
            id="planes"
            locale={l}
            plans={planCards}
            text={{
              section: t('plans.section'),
              title: t.rich('plans.title', { em }),
              lead: t('plans.lead'),
              perMonth: t('plans.perMonth'),
              cta: t('plans.cta'),
              demo: t('plans.demo'),
              whatsappNote: t('plans.whatsappNote'),
              note: t('plans.note'),
            }}
          />
          <Others
            id="otros-negocios"
            items={others}
            text={{
              section: t('others.section'),
              title: t.rich('others.title', { em }),
              sub: t('others.sub'),
              listLabel: t('others.listLabel'),
              forLabel: t('others.forLabel'),
              whatsappNote: t('others.whatsappNote'),
              siteNote: t('others.siteNote'),
            }}
          />
          <Close
            id="cierre"
            locale={l}
            text={{
              section: t('close.section'),
              title: t.rich('close.title', { em }),
              cta: t('close.cta'),
              demo: t('close.demo'),
              whatsappHref: whatsappUrl(t('close.message')),
              whatsappNote: t('plans.whatsappNote'),
              faq: Object.fromEntries(FAQ.map((k) => [k, { q: t(`close.faq.${k}.q`), a: t(`close.faq.${k}.a`) }])) as Record<(typeof FAQ)[number], { q: string; a: string }>,
            }}
          />
        </main>

        <footer aria-label={t('footer.label')} className="site-foot container-x">
          <BackToEclipse locale={l} className="btn btn-ghost btn-sm">
            {t('footer.back')}
          </BackToEclipse>
          <p className="label">{t('footer.note')}</p>
        </footer>
        <AutoTourButton text={{ resume: tt('resume'), stop: tt('stop') }} />
      </div>
    </>
  );
}
