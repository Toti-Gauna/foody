import type { Metadata, Viewport } from 'next';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { asset } from '@/lib/env';
import { LiveApp } from '@/components/live/LiveApp';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: 'lucero.live.meta' });
  return {
    title: t('title'),
    description: t('description'),
    robots: { index: false, follow: false },
    manifest: asset('/manifest.webmanifest'),
    appleWebApp: { capable: true, title: 'Lucero', statusBarStyle: 'black-translucent' },
    icons: { apple: asset('/pwa/icon-192.png') },
  };
}

export const viewport: Viewport = { themeColor: '#140d0f' };

/** «Local en vivo»: the venue on several phones, one role each (a PWA). Its copy travels as the `lucero` namespace. */
export default async function Local({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();
  return (
    <NextIntlClientProvider locale={locale} messages={{ lucero: messages.lucero }}>
      <LiveApp lang={locale} />
    </NextIntlClientProvider>
  );
}
