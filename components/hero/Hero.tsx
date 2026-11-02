import type { ReactNode } from 'react';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import type { Locale } from '@/i18n/routing';
import { DemoLink } from '@/components/SiteNav';
import { PhaseGlyph } from '@/components/ui/PhaseGlyph';
import { TourStartLink } from '@/components/tour/AutoTourButton';
import { sectionNumber, sectionPhase } from '@/lib/sections';
import { HeroStage } from './HeroStage';
import './hero.css';

export interface HeroText {
  section: string;
  brand: string;
  tagline: string;
  sub: string;
  cta: string;
  demo: string;
  status: string;
  /** «Desde USD 25 por mes», with the price already read from content/plans.json. */
  from: string;
  statusNote: string;
  demoBadge: string;
  demoNote: string;
}

/**
 * 01 · Inicio. roofy's hero (components/hero/Hero.tsx) with this site's name and status: the H1 is «Eclipse» with «para
 * restaurantes» under it, server-rendered and visible from the first paint. «Ver qué ofrecemos» is the screen's one solid
 * button (`data-hero-cta`) and starts the automatic tour; «Probar la demo» stays beside it. Under them, the honest status
 * («En preparación») and the entry price, read from the plan catalog.
 */
export function Hero({ locale, id, next, text }: { locale: Locale; id: 'inicio'; next: string; text: HeroText }) {
  return (
    <div data-hero-pin-spacer>
      <section id={id} aria-labelledby={`${id}-title`} data-hero className="hero theme-dark grain relative isolate grid min-h-[100svh] overflow-hidden bg-void">
        <HeroStage />
        <div className="relative z-10 [grid-area:1/1]">
          <div className="hero-copy-cell container-x">
            <div data-hero-copy-inner className="hero-copy-inner">
              <p className="label hero-index">
                <PhaseGlyph phase={sectionPhase(id)} size={16} />
                <span className="readout">{sectionNumber(id)}</span>
                <span>{text.section}</span>
              </p>
              <h1 id={`${id}-title`} className="hero-title display mt-4">
                <span className="hero-brand">{text.brand}</span>{' '}
                <em className="hero-tagline">{text.tagline}</em>
              </h1>
              <p className="hero-sub mt-5 text-base text-fg-muted sm:text-lg">{text.sub}</p>
              <div className="hero-ctas mt-7">
                <div data-hero-cta className="flex">
                  <TourStartLink href={`#${next}`} className="btn btn-primary w-full sm:w-auto">
                    {text.cta}
                    <ArrowDown aria-hidden className="size-4" strokeWidth={1.5} />
                  </TourStartLink>
                </div>
                <DemoLink locale={locale} className="hero-alt">
                  {text.demo}
                  <ArrowUpRight aria-hidden className="size-4" strokeWidth={1.5} />
                </DemoLink>
              </div>
              <div className="hero-status">
                <p className="hero-status-main">
                  <span aria-hidden className="hero-pulse" />
                  <span className="readout">{text.status}</span>
                  <span aria-hidden className="hero-status-sep" />
                  <span className="readout hero-status-price">{text.from}</span>
                </p>
                <p className="hero-status-note">{text.statusNote}</p>
              </div>
              <HeroNote badge={text.demoBadge}>{text.demoNote}</HeroNote>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function HeroNote({ badge, children }: { badge: string; children: ReactNode }) {
  return (
    <p className="hero-note">
      <span className="site-demo">{badge}</span>
      <span>{children}</span>
    </p>
  );
}
