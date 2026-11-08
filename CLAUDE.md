@AGENTS.md

# Foody — «Eclipse para restaurantes» (repo `foody`)

Sitio comercial y demo de **Eclipse para restaurantes** (nombre técnico Foody; el visitante ve «Eclipse» y debajo «para
restaurantes»). Subdominio `foody.eclipse-business.com`; mientras tanto, prueba en https://toti-gauna.github.io/foody/.
Plan, decisiones y avance: `docs/PLAN-EJECUCION.md`. Lo copiado de otros repos: `docs/procedencia.md`.

Export estático (`output: 'export'`). Next 16 App Router + TypeScript + Tailwind v4 + next-intl (es / en / pt) + GSAP.
Mismo sistema visual que Eclipse-Web y roofy (Efemérides), con la paleta «Brasa» (carbón, vino, cobre; crema para decidir).

## Comandos

- `npm test` (Vitest) · `npm run typecheck` · `npm run lint` · `npm run build` (→ `out/`)
- `npm run dev` — servidor de desarrollo.
- Vista bajo un path: `NEXT_PUBLIC_BASE_PATH=/foody npm run build`.
- Deploy (Hostinger + Render): `docs/DEPLOY.md` (kit con Docker en `deploy/`). Backend: repo `Foody-be`.
- Componentes nuevos: armarlos con el kit atómico de `components/kit/` (átomos y moléculas, CSS normal con tokens `--l-*`).

## Reglas que no se negocian

- **Honestidad:** nada de testimonios, logos ni clientes que no existen. Todo local ficticio (Lucero) lleva «Demo» a la
  vista y no se parece a una marca real. Lo que no está incluido en un plan nunca aparece como incluido. Los precios salen
  solo de `content/plans.json`.
- **Tono:** premium, seguro, concreto, frases cortas. Español rioplatense («vos»), portugués de Brasil natural, inglés directo.
- **Sin texto fijo en componentes:** todo sale de `messages/{es,en,pt}.json` con las mismas claves (`tests/messages.test.ts`).
- **Mobile-first:** sin scroll horizontal a 360 px, gutter de 16 px (`.container-x`), blancos táctiles ≥ 44 px.
- **Accesibilidad:** HTML semántico, teclado completo, foco visible, contraste AA.
- **Movimiento reducido:** toda animación respeta `prefers-reduced-motion`. Solo `transform`, `opacity` y `clip-path`.
  Lo pesado (juegos, física) se carga bajo demanda.
- **Un solo botón principal sólido por pantalla.**
- **Todo funciona bajo `/` y bajo un basePath:** archivos de `/public` con `asset()` (`lib/env.ts`).
- **Mientras sea publicación de prueba:** `noindex` en cada página y `robots.txt` con `Disallow: /`.
- **Sin secretos en el repo.** Nada que empiece con `NEXT_PUBLIC_` es secreto.
