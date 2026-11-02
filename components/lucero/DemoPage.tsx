'use client';

import type { Locale } from '@/i18n/routing';
import { LuceroDemo } from './LuceroDemo';
import { GamesLayer } from './games/GamesLayer';
import { JuegosAdmin } from './crm/JuegosAdmin';
import { Academy } from './crm/Academy';

/** The demo with everything plugged in: the games modal (fases 5–6) and the CRM sections built after fase 4 (games and wheel, Eclipse Academy). */
export function DemoPage({ lang }: { lang: Locale }) {
  return (
    <LuceroDemo
      lang={lang}
      extras={{
        renderGames: ({ open, onClose, orderId }) => <GamesLayer open={open} onClose={onClose} orderId={orderId} />,
        slots: { juegos: <JuegosAdmin />, academy: <Academy /> },
      }}
    />
  );
}
