/** Public runtime configuration, inlined at build time (all of it public: never put a secret in NEXT_PUBLIC_*). */
export const BASE_PATH = (process.env.NEXT_PUBLIC_BASE_PATH ?? '').replace(/\/$/, '');

/** This site's own origin (canonical and hreflang URLs). */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://foody.eclipse-business.com').replace(/\/$/, '');

/** Where «Volver a Eclipse» points. */
export const ECLIPSE_URL = (process.env.NEXT_PUBLIC_ECLIPSE_URL ?? 'https://eclipse-business.com').replace(/\/$/, '');

/** The real-estate site (the only Eclipse product on sale today), linked from «Otros negocios». Test publication for now. */
export const ROOFY_URL = (process.env.NEXT_PUBLIC_ROOFY_URL ?? 'https://toti-gauna.github.io/roofy').replace(/\/$/, '');

/**
 * The backend (repo Foody-be, on Render). Empty = the demo runs on its own in the browser: orders and the CRM sync
 * between tabs of the same browser and game rooms go peer to peer. With it, they sync between devices.
 */
export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? '').replace(/\/$/, '');

export const absoluteUrl = (path: string): string => `${SITE_URL}${BASE_PATH}${path}`;

/** A file in /public, under the base path. */
export const asset = (path: string): string => `${BASE_PATH}${path.startsWith('/') ? path : `/${path}`}`;

/**
 * Ignacio's WhatsApp, digits only, with the country code (54 Argentina · 9 mobile · 223 · 4467881; «2234467881»,
 * Ignacio, 02/11/2026). Public contact data, not a secret: `NEXT_PUBLIC_WHATSAPP` overrides it for a preview build.
 */
export const WHATSAPP_NUMBER = (process.env.NEXT_PUBLIC_WHATSAPP ?? '5492234467881').replace(/\D/g, '');
