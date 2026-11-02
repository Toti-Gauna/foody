import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

/** Fase 0: placeholder until the commercial site lands (fases 1–2, docs/PLAN-EJECUCION.md). */
export default async function SitePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'placeholder' });
  return (
    <main className="theme-dark container-x grid min-h-dvh content-center gap-4">
      <h1 className="display text-5xl">{t('title')}</h1>
      <p className="text-fg-muted">{t('text')}</p>
    </main>
  );
}
