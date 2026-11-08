import type { ReactNode } from 'react';
import { ArrowUpRight, LayoutDashboard, Radio } from 'lucide-react';
import type { Locale } from '@/i18n/routing';
import { demoHref } from '@/components/SiteNav';
import { PhaseGlyph } from '@/components/ui/PhaseGlyph';
import { sectionNumber, sectionPhase } from '@/lib/sections';
import { PLAN_IDS, type PlanId } from '@/lib/plans';
import type { Season } from '@/lib/seasons';
import { asset, BASE_PATH } from '@/lib/env';
import './demo-section.css';

export const DEMO_STEPS = ['pedir', 'gus', 'jugar', 'crm'] as const;

export interface DemoSectionText {
  section: string;
  title: ReactNode;
  lead: string;
  steps: Record<(typeof DEMO_STEPS)[number], string>;
  inDemo: string;
  open: string;
  crm: string;
  /** «Probalo en vivo con tu equipo»: /local/, the venue on several phones. */
  live: string;
  liveNote: string;
  asPlan: string;
  /** «Plan USD 25», per plan, with the price already read from the catalog. */
  plans: Record<PlanId, string>;
  demoBadge: string;
  /** «Vestida para cada fecha»: the special dates, each a way into the demo dressed for it. */
  seasons: { label: string; note: string; items: Record<Exclude<Season, 'clasica'>, string> };
}

const SEASON_LINKS = ['halloween', 'navidad', 'sanvalentin'] as const;

/**
 * 03 · Demo. Lucero (a fictional venue, always labeled «Demo»): what you can do in it, the way in as a guest and the way
 * into the venue's CRM, and the same demo seen through each plan (`?plan=`). On the right, the two views drawn: the
 * guest's phone with Gus and the CRM's board.
 */
export function DemoSection({ id, locale, text }: { id: 'demo'; locale: Locale; text: DemoSectionText }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} tabIndex={-1} className="ds theme-dark grain relative isolate">
      <div className="ds-wrap container-x">
        <div className="ds-copy" data-tour-stop>
          <p className="label ds-index">
            <PhaseGlyph phase={sectionPhase(id)} size={16} />
            <span className="readout">{sectionNumber(id)}</span>
            <span>{text.section}</span>
          </p>
          <h2 id={`${id}-title`} className="display ds-title">
            {text.title}
          </h2>
          <p className="ds-lead">{text.lead}</p>
          <ol className="ds-steps">
            {DEMO_STEPS.map((step, i) => (
              <li key={step}>
                <span aria-hidden className="readout ds-step-n">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="display ds-step-name">{text.steps[step]}</span>
                <span className="label ds-step-tag">
                  <span aria-hidden className="ds-dot" />
                  {text.inDemo}
                </span>
              </li>
            ))}
          </ol>
          <div className="ds-actions">
            <a href={demoHref(locale)} className="btn btn-primary" data-page-cta>
              {text.open}
              <ArrowUpRight aria-hidden className="size-4" strokeWidth={1.5} />
            </a>
            <a href={demoHref(locale, null, 'crm')} className="btn btn-ghost">
              <LayoutDashboard aria-hidden className="size-4" strokeWidth={1.5} />
              {text.crm}
            </a>
          </div>
          <a href={`${BASE_PATH}/${locale}/local/`} className="ds-live">
            <span className="ds-live-icon" aria-hidden>
              <Radio className="size-5" strokeWidth={1.5} />
            </span>
            <span className="ds-live-text">
              <b>{text.live}</b>
              <small>{text.liveNote}</small>
            </span>
            <ArrowUpRight aria-hidden className="size-4" strokeWidth={1.5} />
          </a>
          <nav aria-label={text.asPlan} className="ds-plans">
            <span className="label">{text.asPlan}</span>
            <ul>
              {PLAN_IDS.map((plan) => (
                <li key={plan}>
                  <a href={demoHref(locale, plan)} className="ds-plan">
                    {text.plans[plan]}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label={text.seasons.label} className="ds-seasons">
            <span className="label">{text.seasons.label}</span>
            <ul>
              {SEASON_LINKS.map((s) => (
                <li key={s}>
                  <a href={`${demoHref(locale)}?temporada=${s}`} className="ds-season" data-season={s}>
                    <span aria-hidden className="ds-season-dot" />
                    {text.seasons.items[s]}
                  </a>
                </li>
              ))}
            </ul>
            <p className="ds-seasons-note">{text.seasons.note}</p>
          </nav>
        </div>

        <div aria-hidden className="ds-stage" data-tour-stop>
          <div className="ds-window">
            <div className="ds-bar">
              <i />
              <i />
              <i />
              <span className="ds-url">lucero · crm</span>
              <span className="ds-badge">{text.demoBadge}</span>
            </div>
            <div className="ds-board">
              {[
                ['Mesa 4', 'Mesa 7'],
                ['Mesa 2', 'Mesa 5'],
                ['Mesa 1'],
              ].map((col, c) => (
                <div key={c} className="ds-col">
                  {col.map((t, k) => (
                    <div key={t} className={`ds-ticket${c === 0 && k === 0 ? ' is-new' : ''}`}>
                      {t}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="ds-phone">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset('/gus/bandeja-tapada.webp')} alt="" width={696} height={696} loading="lazy" />
            <span className="ds-phone-badge">{text.demoBadge}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
