'use client';

import { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { FileText, Image as ImageIcon, Play, X } from 'lucide-react';
import academy from '@/content/academy.json';
import { asset } from '@/lib/env';
import { useLucero } from '../store';

type Lang = 'es' | 'en' | 'pt';
type L<T> = Record<Lang, T>;
type Kind = 'video' | 'doc' | 'photo';
interface Item {
  id: string;
  type: Kind;
  minutes?: number;
  src?: string;
  title: L<string>;
  summary: L<string>;
  body?: L<string[]>;
}
type SectionId = 'digital' | 'fisico';
const SECTIONS = academy.sections as { id: SectionId; items: Item[] }[];
const KINDS: Kind[] = ['video', 'doc', 'photo'];
const ICON = { video: Play, doc: FileText, photo: ImageIcon } as const;
/** Video posters until the real videos exist: Gus on the phone for digital, pointing for the venue. */
const POSTER: Record<SectionId, string> = { digital: '/gus/10-celular.webp', fisico: '/gus/13-senalar.webp' };

/**
 * CRM → Eclipse Academy (plan 75): marketing ideas for the venue, in two sections (digital and on the premises), each
 * with videos, guides and photos. The guides are real; videos and photos are examples, and say so, until the real ones
 * are made (docs/PLAN-EJECUCION.md, decisión 6). Everything opens in one native dialog (Esc and focus come for free).
 */
export function Academy() {
  const t = useTranslations('lucero.crm.academy');
  const { lang } = useLucero();
  const [section, setSection] = useState<SectionId>('digital');
  const [kind, setKind] = useState<Kind | 'all'>('all');
  const [open, setOpen] = useState<{ item: Item; section: SectionId } | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  const current = SECTIONS.find((s) => s.id === section)!;
  const items = current.items.filter((i) => kind === 'all' || i.type === kind);
  const show = (item: Item) => {
    setOpen({ item, section });
    dialog.current?.showModal();
  };

  return (
    <section aria-labelledby="crm-academy" className="ac">
      <header className="crm-head">
        <h2 id="crm-academy" className="crm-h">
          {t('title')}
        </h2>
        <p className="crm-muted">{t('sub')}</p>
      </header>

      <div className="ac-tabs" role="tablist" aria-label={t('sectionsLabel')}>
        {SECTIONS.map((s) => (
          <button key={s.id} type="button" role="tab" id={`ac-tab-${s.id}`} aria-selected={s.id === section} aria-controls="ac-panel" onClick={() => setSection(s.id)}>
            <b>{t(`sections.${s.id}.title`)}</b>
            <small>{t(`sections.${s.id}.sub`)}</small>
          </button>
        ))}
      </div>

      <div id="ac-panel" role="tabpanel" aria-labelledby={`ac-tab-${section}`} className="ac-panel">
        <div className="ac-filter" role="group" aria-label={t('filterLabel')}>
          {(['all', ...KINDS] as const).map((k) => (
            <button key={k} type="button" aria-pressed={k === kind} onClick={() => setKind(k)}>
              {t(`filter.${k}`)}
            </button>
          ))}
        </div>
        <p className="ac-sample">{t('sampleNote')}</p>

        <ul className="ac-grid">
          {items.map((item) => {
            const Icon = ICON[item.type];
            const sample = item.type !== 'doc';
            return (
              <li key={item.id}>
                <button type="button" className="ac-card" data-kind={item.type} onClick={() => show(item)}>
                  <span className="ac-media" aria-hidden>
                    {item.type === 'photo' ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={asset(item.src!)} alt="" loading="lazy" />
                    ) : item.type === 'video' ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={asset(POSTER[section])} alt="" loading="lazy" className="ac-poster" />
                        <span className="ac-play">
                          <Play className="size-5" fill="currentColor" />
                        </span>
                      </>
                    ) : (
                      <span className="ac-page">
                        <FileText className="size-5" strokeWidth={1.4} />
                        <span>{item.body?.[lang][0]}</span>
                      </span>
                    )}
                  </span>
                  <span className="ac-meta">
                    <span className="ac-kind">
                      <Icon aria-hidden className="size-3.5" />
                      {t(`kind.${item.type}`)}
                      {item.minutes ? ` · ${t(item.type === 'doc' ? 'read' : 'watch', { n: item.minutes })}` : ''}
                    </span>
                    {sample ? <span className="ac-tag">{t('sample')}</span> : null}
                  </span>
                  <b className="ac-title">{item.title[lang]}</b>
                  <span className="crm-muted">{item.summary[lang]}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <dialog ref={dialog} className="ac-dialog" aria-labelledby="ac-dialog-title" onClose={() => setOpen(null)} onClick={(e) => e.target === e.currentTarget && dialog.current?.close()}>
        {open ? (
          <div className="ac-view">
            <header className="ac-view-head">
              <p className="ac-kind">
                {t(`kind.${open.item.type}`)} · {t(`sections.${open.section}.title`)}
              </p>
              <h3 id="ac-dialog-title" className="crm-h">
                {open.item.title[lang]}
              </h3>
              <button type="button" className="crm-icon" onClick={() => dialog.current?.close()} aria-label={t('close')}>
                <X aria-hidden className="size-5" />
              </button>
            </header>
            {open.item.type === 'doc' ? (
              <>
                <p className="crm-muted">{open.item.summary[lang]}</p>
                <ol className="ac-steps">
                  {open.item.body?.[lang].map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ol>
              </>
            ) : open.item.type === 'photo' ? (
              <figure className="ac-figure">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={asset(open.item.src!)} alt={open.item.title[lang]} />
                <figcaption>
                  {open.item.summary[lang]} <span className="ac-tag">{t('sample')}</span>
                </figcaption>
              </figure>
            ) : (
              <div className="ac-video">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={asset(POSTER[open.section])} alt="" className="ac-poster" />
                <p>
                  <span className="ac-tag">{t('sample')}</span> {t('videoSoon')}
                </p>
                <p className="crm-muted">{open.item.summary[lang]}</p>
              </div>
            )}
          </div>
        ) : null}
      </dialog>
    </section>
  );
}
