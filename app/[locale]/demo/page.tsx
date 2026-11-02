import type { Metadata } from 'next';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { DemoPage } from '@/components/lucero/DemoPage';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: 'lucero.meta' });
  return { title: t('title'), description: t('description'), robots: { index: false, follow: false } };
}

/** Lucero, the demo (fases 3–10). Its copy travels to the client as the `lucero` namespace only. */
export default async function Demo({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();
  return (
    <NextIntlClientProvider locale={locale} messages={{ lucero: messages.lucero }}>
      <DemoPage lang={locale} />
    </NextIntlClientProvider>
  );
}
