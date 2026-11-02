# Procedencia

Qué se copió de otros repos y qué cambió. Si el origen corrige un archivo, se vuelve a copiar y se anota acá.

## Fase 0 · base (de `Toti-Gauna/roofy`, `main` en `3c30777`)

| Archivo en foody | Origen | Cambios |
|---|---|---|
| `package.json`, `package-lock.json` | roofy | Nombre `foody`; mismas dependencias y versiones |
| `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`, `eslint.config.mjs`, `vitest.config.mts`, `.gitignore` | roofy | Ninguno |
| `i18n/*`, `app/layout.tsx`, `app/page.tsx`, `app/not-found.tsx`, `app/fonts.ts`, `app/fonts/*`, `app/[locale]/layout.tsx` | roofy | Colores de la paleta Brasa |
| `app/globals.css` | roofy (Eclipse-Web `5cdb887`) | Mismos nombres de tokens; valores de la paleta Brasa |
| `components/motion`, `hero`, `tour`, `ui`, `sound`, `sections/products`; `lib/sound`, `lib/useMediaQuery.ts`, `lib/whatsapp.ts`, `lib/products.ts` | roofy | `otherProducts` excluye a Foody |
| `content/products.json` | roofy (copia byte a byte de Eclipse-Web `76767ea`) | Ninguno |
| `tests/messages.test.ts`, `public/robots.txt`, `deploy/hostinger.htaccess` | roofy | Ninguno |
| `.github/workflows/pages.yml` | roofy | basePath `/foody`; suma lint y tipos |
| `public/prototipos/carta-gus/index.html` | `prototipos/carta-gus/index.html` de este repo | Ninguno: el prototipo sigue en la misma URL de Pages |

Escrito en foody: `lib/env.ts`, `messages/*`, `app/[locale]/page.tsx`, `CLAUDE.md`, `docs/PLAN-EJECUCION.md`.

## Fases 1–2 · sitio comercial

| Archivo en foody | Origen | Cambios |
|---|---|---|
| `components/hero/Hero.tsx`, `hero.css` | roofy | Nombre «para restaurantes»; línea de estado con el precio de entrada leído de `content/plans.json` |
| `components/site/Others.tsx`, `others.css`, `site.css` | roofy (`3c30777`) | Roofy (Eclipse para inmobiliarias) entra en la lista con «Disponible» y enlaza a su sitio; Foody sale |
| Textos `site.others.*` | roofy `site.others` + Eclipse-Web `products.items.roofy` | Nombre visible «Eclipse para inmobiliarias»; título y sub propios |
| `scripts/shot.mjs` | Eclipse-Web | Usa el Playwright global del entorno (no es dependencia) |
| `public/gus/*.webp` | `assets/personajes/cafe/mesero/png/` (las 38 poses) | WebP a 696 px |

Escrito en foody: `components/site/Offer.tsx`, `DemoSection.tsx`, `Plans.tsx`, `Close.tsx` y sus CSS, `components/SiteNav.tsx`,
`lib/sections.ts`, `lib/plans.ts`, `content/plans.json`, textos `site.*` y `tests/plans.test.ts`, `tests/products.test.ts`.

## Fases 3–4 · Lucero (carta con Gus y CRM)

Reescrito en React a partir del prototipo de este repo (`prototipos/carta-gus/index.html`, v3): mismas poses, misma carta y
la misma escena (lámpara, puerta de la cocina, mesa 4, chispas al levantar la campana). Cambios pedidos por Ignacio
(02/11/2026): Gus más grande, la comanda como una hoja limpia y el pedido que avanza solo (enviado → cocina → listo →
entregado) sin la barra «Simular». Fotos de comida: las 5 del prototipo (`public/lucero/food/`). Carta en
`content/lucero-menu.json` (es/en/pt). El CRM es nuevo (`components/lucero/crm/`).

## Fases 5–6 · juegos y ruleta (de `Toti-Gauna/games-market`, `477d574`)

| Archivo en foody | Origen | Cambios |
|---|---|---|
| `games/core/contract/{game,net,settings}.ts`, `games/core/engine/*` (13 archivos), `games/ui/game/{GameStage.tsx,format.ts,useFullscreen.ts}` | `src/core/…`, `src/ui/game/…` | Solo las rutas de import (`@/core/` → `@/games/core/`, `@/ui/` → `@/games/ui/`) |
| `games/{ninja,combinaciones,catapulta}/*` (con sus tests) | `src/games/…` | Ídem |
| `games/styles/games.css` | `src/styles/tokens.css` y la capa de componentes de `src/styles/global.css` | Mismos nombres de tokens; valores de la paleta de Lucero (vino, cobre, ámbar, crema) en vez de Supernova |
| Bloque `@theme` de colores `sn-*` en `app/globals.css` | `src/styles/global.css` | Ninguno |

`@dimforge/rapier2d-compat@0.20.0` (física de Catapulta) se suma a las dependencias, aprobado por Ignacio (02/11/2026); se
carga solo al abrir Catapulta. `eslint.config.mjs` apaga las reglas del compilador de React solo en el código copiado.

Escrito en foody: `games/registry.ts`, `components/lucero/games/*` (anfitrión, modal, ruleta), `components/lucero/crm/JuegosAdmin.tsx`,
`content/lucero-prizes.json`, `public/lucero/games/*.svg`.
