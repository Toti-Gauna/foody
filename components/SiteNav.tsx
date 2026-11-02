import type { ReactNode } from 'react';
import { localeTags, type Locale } from '@/i18n/routing';
import { BASE_PATH, ECLIPSE_URL } from '@/lib/env';
import type { PlanId } from '@/lib/plans';

export interface SiteNavText {
  languageLabel: string;
  /** The way out on the left: the site's name on the home, «Ir al sitio» on the demo. */
  lead: ReactNode;
  languages: Record<Locale, string>;
}

export const siteHref = (locale: Locale, hash = '') => `${BASE_PATH}/${locale}/${hash}`;

/** The Lucero demo (`/<locale>/demo/`), optionally seen through a plan (`?plan=25|50|75`). */
export const demoHref = (locale: Locale, plan?: PlanId | null, view?: 'carta' | 'crm') => {
  const params = new URLSearchParams();
  if (plan) params.set('plan', plan);
  if (view) params.set('vista', view);
  const q = params.toString();
  return `${BASE_PATH}/${locale}/demo/${q ? `?${q}` : ''}`;
};

/** The top row: the site's name (or the way back to it) and the three languages, staying on the same page. */
export function SiteNav({ locale, locales, page, text, children }: { locale: Locale; locales: readonly Locale[]; page: 'site' | 'demo'; text: SiteNavText; children?: ReactNode }) {
  const href = (l: Locale) => (page === 'demo' ? `${BASE_PATH}/${l}/demo/` : siteHref(l));
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
      <a href={siteHref(locale)} aria-current={page === 'site' ? 'page' : undefined} className={page === 'demo' ? 'btn btn-ghost btn-sm' : 'site-mark'}>
        {text.lead}
      </a>
      <div className="flex items-center gap-2">
        {children}
        <nav aria-label={text.languageLabel}>
          <ul className="flex gap-1">
            {locales.map((l) => (
              <li key={l}>
                <a
                  href={href(l)}
                  hrefLang={localeTags[l]}
                  lang={localeTags[l]}
                  aria-current={l === locale ? 'page' : undefined}
                  className={`readout inline-flex min-h-11 min-w-11 items-center justify-center rounded-full px-3 text-sm uppercase ${l === locale ? 'text-accent' : 'text-fg-muted'}`}
                >
                  {l}
                  <span className="sr-only">: {text.languages[l]}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}

/** «Volver a Eclipse»: the Eclipse home in the same language. */
export function BackToEclipse({ locale, className, children }: { locale: Locale; className?: string; children: ReactNode }) {
  return (
    <a href={`${ECLIPSE_URL}/${locale}/`} className={className}>
      {children}
    </a>
  );
}

/** A link to the Lucero demo, optionally through a plan. */
export function DemoLink({ locale, plan, className, children, ...rest }: { locale: Locale; plan?: PlanId | null; className?: string; children: ReactNode } & Record<`data-${string}`, string | boolean | undefined>) {
  return (
    <a href={demoHref(locale, plan)} className={className} {...rest}>
      {children}
    </a>
  );
}
