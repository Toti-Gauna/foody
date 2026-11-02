import type { Metadata } from 'next';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { SalaPage } from '@/components/lucero/SalaPage';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: 'lucero.mesa' });
  return { title: t('metaTitle'), robots: { index: false, follow: false } };
}

/** Where a phone lands after scanning a table room's QR (or opening its link): /<locale>/sala/?c=CODE&j=game. */
export default async function Sala({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();
  return (
    <NextIntlClientProvider locale={locale} messages={{ lucero: messages.lucero }}>
      <SalaPage lang={locale} />
    </NextIntlClientProvider>
  );
}
