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
