import type { ReactNode } from 'react';
import { PhaseGlyph } from '@/components/ui/PhaseGlyph';
import { sectionNumber, sectionPhase } from '@/lib/sections';
import { asset } from '@/lib/env';
import './offer.css';

export const OFFER_ITEMS = ['carta', 'crm', 'juegos', 'academy'] as const;
export type OfferItem = (typeof OFFER_ITEMS)[number];
export const SOON_ITEMS = ['reservas', 'web', 'platos'] as const;

export interface OfferText {
  section: string;
  title: ReactNode;
  lead: string;
  items: Record<OfferItem, { name: string; text: string; from: string }>;
  soonLabel: string;
  soonNote: string;
  soon: Record<(typeof SOON_ITEMS)[number], string>;
}

/**
 * 02 · Qué ofrecemos. The four things the plans deliver, each with the plan it starts in («Desde el plan USD 50», read
 * from content/plans.json by the page), and a small drawn screen of it. Apart, dashed and with no light, what is not in
 * any plan yet («Próximamente»): never shown as included.
 */
export function Offer({ id, text }: { id: 'ofrecemos'; text: OfferText }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} tabIndex={-1} className="of theme-dark grain relative isolate">
      <div aria-hidden className="of-light" />
      <div className="of-wrap container-x">
        <div className="of-head" data-tour-stop>
          <p className="label of-index">
            <PhaseGlyph phase={sectionPhase(id)} size={16} />
            <span className="readout">{sectionNumber(id)}</span>
            <span>{text.section}</span>
          </p>
          <h2 id={`${id}-title`} className="display of-title">
            {text.title}
          </h2>
          <p className="of-lead">{text.lead}</p>
        </div>

        <ul className="of-grid" data-tour-stop>
          {OFFER_ITEMS.map((key, i) => (
            <li key={key} className="of-card" data-item={key}>
              <div aria-hidden className="of-art">
                <Art item={key} />
              </div>
              <p className="readout of-n">{String(i + 1).padStart(2, '0')}</p>
              <h3 className="display of-name">{text.items[key].name}</h3>
              <p className="of-text">{text.items[key].text}</p>
              <p className="of-from readout">{text.items[key].from}</p>
            </li>
          ))}
        </ul>

        <div className="of-soon">
          <p className="label">
            <span className="of-soon-tag">{text.soonLabel}</span> {text.soonNote}
          </p>
          <ul>
            {SOON_ITEMS.map((key) => (
              <li key={key}>{text.soon[key]}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/** A small drawn screen per item (decorative). */
function Art({ item }: { item: OfferItem }) {
  if (item === 'carta')
    return (
      <div className="of-art-carta">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset('/gus/07-anotar.webp')} alt="" width={696} height={696} loading="lazy" className="of-gus" />
        <div className="of-mini of-mini-menu">
          <span className="of-mini-row">
            <b>Sorrentinos</b>
            <i>×2</i>
          </span>
          <span className="of-mini-row">
            <b>Bife de chorizo</b>
            <i>×1</i>
          </span>
        </div>
      </div>
    );
  if (item === 'crm')
    return (
      <div className="of-mini of-mini-board">
        {[3, 2, 1].map((n, c) => (
          <span key={c} className="of-col">
            {Array.from({ length: n }, (_, k) => (
              <span key={k} className={`of-tk${c === 0 && k === 0 ? ' is-new' : ''}`} />
            ))}
          </span>
        ))}
      </div>
    );
  if (item === 'juegos')
    return (
      <svg viewBox="0 0 120 120" className="of-wheel">
        {Array.from({ length: 8 }, (_, k) => {
          const a0 = (k / 8) * Math.PI * 2;
          const a1 = ((k + 1) / 8) * Math.PI * 2;
          const p = (a: number) => `${60 + 52 * Math.cos(a)} ${60 + 52 * Math.sin(a)}`;
          return <path key={k} d={`M60 60 L${p(a0)} A52 52 0 0 1 ${p(a1)} Z`} className={k % 2 ? 'of-slice-a' : 'of-slice-b'} />;
        })}
        <circle cx="60" cy="60" r="10" className="of-hub" />
        <path d="M60 2 l-6 12 h12 Z" className="of-pin" />
      </svg>
    );
  return (
    <div className="of-mini of-mini-academy">
      <span className="of-play" />
      <span className="of-doc" />
      <span className="of-doc" />
    </div>
  );
}
