'use client';

import type { Locale } from '@/i18n/routing';
import { LuceroDemo } from './LuceroDemo';

/** The demo with everything plugged in. Later phases add the games modal and the CRM sections here. */
export function DemoPage({ lang }: { lang: Locale }) {
  return <LuceroDemo lang={lang} />;
}
