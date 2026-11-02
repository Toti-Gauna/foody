import type { ReactNode } from 'react';
import { ArrowUpRight, MessageCircle } from 'lucide-react';
import type { Locale } from '@/i18n/routing';
import { demoHref } from '@/components/SiteNav';
import { PhaseGlyph } from '@/components/ui/PhaseGlyph';
import { sectionNumber, sectionPhase } from '@/lib/sections';
import type { PlanId } from '@/lib/plans';
import './plans.css';

/** One plan, already in the visitor's language and with its price read from content/plans.json (built on the server). */
export interface PlanCard {
  id: PlanId;
  name: string;
  tagline: string;
  price: string;
  /** «Incluye» for the first plan, «Todo lo del plan USD 25, y además» for the others. */
  lead: string;
  points: string[];
  /** The WhatsApp link with the plan in the message. */
  href: string;
}

export interface PlansText {
  section: string;
  title: ReactNode;
  lead: string;
  perMonth: string;
  cta: string;
  demo: string;
  whatsappNote: string;
  note: string;
}

/**
 * 04 · Planes. The one light section, where the visitor decides: three plans, each with its price (from the catalog,
 * never typed here), what it adds, «Quiero este plan» (WhatsApp, the plan in the message) and its demo (`?plan=`).
 * No plan is marked as the favourite and nothing is charged on the site.
 */
export function Plans({ id, locale, plans, text }: { id: 'planes'; locale: Locale; plans: PlanCard[]; text: PlansText }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} tabIndex={-1} data-header-theme="light" className="pl theme-light relative isolate">
      <div aria-hidden className="pl-dawn" />
      <div className="pl-wrap container-x">
        <div className="pl-head" data-tour-stop>
          <p className="label pl-index">
            <PhaseGlyph phase={sectionPhase(id)} size={16} />
            <span className="readout">{sectionNumber(id)}</span>
            <span>{text.section}</span>
          </p>
          <h2 id={`${id}-title`} className="display pl-title">
            {text.title}
          </h2>
          <p className="pl-lead">{text.lead}</p>
        </div>
        <ul className="pl-grid" data-tour-stop>
          {plans.map((plan) => (
            <li key={plan.id} className="pl-card" data-plan={plan.id}>
              <p className="label pl-name">{plan.name}</p>
              <p className="pl-price">
                <span className="readout pl-amount">{plan.price}</span>
                <span className="pl-per">{text.perMonth}</span>
              </p>
              <p className="pl-tagline">{plan.tagline}</p>
              <p className="label pl-includes">{plan.lead}</p>
              <ul className="pl-points">
                {plan.points.map((point) => (
                  <li key={point}>
                    <span aria-hidden className="pl-tick" />
                    {point}
                  </li>
                ))}
              </ul>
              <div className="pl-actions">
                <a href={plan.href} target="_blank" rel="noopener noreferrer" className="btn pl-cta">
                  <MessageCircle aria-hidden className="size-4" strokeWidth={1.6} />
                  {text.cta}
                  <span className="sr-only"> · {plan.name} · {text.whatsappNote}</span>
                </a>
                <a href={demoHref(locale, plan.id)} className="pl-demo">
                  {text.demo}
                  <ArrowUpRight aria-hidden className="size-4" strokeWidth={1.5} />
                </a>
              </div>
            </li>
          ))}
        </ul>
        <p className="pl-note">{text.note}</p>
      </div>
    </section>
  );
}
