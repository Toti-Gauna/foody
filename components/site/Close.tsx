import type { ReactNode } from 'react';
import { ArrowUpRight, MessageCircle } from 'lucide-react';
import type { Locale } from '@/i18n/routing';
import { DemoLink } from '@/components/SiteNav';
import { PhaseGlyph } from '@/components/ui/PhaseGlyph';
import { sectionNumber, sectionPhase } from '@/lib/sections';
import './close.css';

export const FAQ = ['pay', 'who', 'need'] as const;

export interface CloseText {
  section: string;
  title: ReactNode;
  cta: string;
  demo: string;
  whatsappHref: string;
  whatsappNote: string;
  faq: Record<(typeof FAQ)[number], { q: string; a: string }>;
}

/** 06 · Cierre: the sun comes out. WhatsApp (the screen's one solid button), the demo, three honest answers. */
export function Close({ id, locale, text }: { id: 'cierre'; locale: Locale; text: CloseText }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} tabIndex={-1} className="cl theme-dark relative isolate">
      <div aria-hidden className="cl-sun" />
      <div className="cl-wrap container-x">
        <div data-tour-stop>
          <p className="label cl-index">
            <PhaseGlyph phase={sectionPhase(id)} size={16} />
            <span className="readout">{sectionNumber(id)}</span>
            <span>{text.section}</span>
          </p>
          <h2 id={`${id}-title`} className="display cl-title">
            {text.title}
          </h2>
          <div className="cl-actions">
            <a href={text.whatsappHref} target="_blank" rel="noopener noreferrer" className="btn btn-primary" data-page-cta>
              <MessageCircle aria-hidden className="size-4" strokeWidth={1.6} />
              {text.cta}
              <span className="sr-only"> · {text.whatsappNote}</span>
            </a>
            <DemoLink locale={locale} className="btn btn-ghost">
              {text.demo}
              <ArrowUpRight aria-hidden className="size-4" strokeWidth={1.5} />
            </DemoLink>
          </div>
        </div>
        <dl className="cl-faq">
          {FAQ.map((key) => (
            <div key={key}>
              <dt className="display">{text.faq[key].q}</dt>
              <dd>{text.faq[key].a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
