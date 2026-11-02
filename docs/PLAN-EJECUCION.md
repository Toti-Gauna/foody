# Plan de ejecución · Eclipse para restaurantes (repo `foody`)

Aprobado por Ignacio el 02/11/2026 («Arranca»). Claude ejecuta de corrido, una fase por PR, y deja todo listo para probar.
Este archivo es el registro de avance: se actualiza al cerrar cada fase, así se puede retomar si la sesión se corta.

## Decisiones (Ignacio, 02/11/2026)

| # | Tema | Decisión |
|---|---|---|
| 1 | Planes | Tres, en USD por mes: **25** (carta con Gus animado + CRM del local) · **50** (lo anterior + juegos individuales + ruleta para un menú del día o una promo) · **75** (lo anterior + juegos para la mesa —Dibujá y adiviná, Hockey— + Eclipse Academy). Precios solo en `content/plans.json` |
| 2 | Contacto para comprar | WhatsApp de Ignacio: 223 446-7881 → `5492234467881` (`lib/env.ts`), con el plan en el mensaje |
| 3 | Reservas y «Web del local» | No están en los planes: se muestran como «Próximamente», nunca como incluidos |
| 4 | Estado | «Disponible» recién cuando esté publicado; mientras tanto «En preparación», con los precios a la vista |
| 5 | Premios de la ruleta | De ejemplo en la demo, con el sello «Demo» |
| 6 | Eclipse Academy | Estructura completa; videos, documentos y fotos de ejemplo, marcados así, hasta tener los reales |
| 7 | Lucero | Se construye desde el prototipo de Gus (v3, 38 poses), no desde la demo del Bodegón de Eclipse-Web |
| 8 | Catálogo de Eclipse-Web | No se toca (Foody figura «en preparación», sin precio): cambiarlo es un ciclo aparte en ese repo |
| 9 | Juegos | Se copian de `games-market` (Ninja, Combinaciones, Catapulta, Pinturillo). **Hockey no existe allá: es nuevo.** Nombres públicos sin marcas ajenas: «Combinaciones», «Dibujá y adiviná» |
| 10 | Dependencias nuevas | OK a `peerjs`, `qrcode`, `perfect-freehand` y `@dimforge/rapier2d-compat`, cargadas solo al abrir un juego |
| 11 | Backend | Repo `Toti-Gauna/Foody-be` en Render, al final. Sin él, la demo anda sola en el navegador |
| 12 | Deploy | Hostinger, `foody.eclipse-business.com`, desde Codespaces con un Docker que pide los datos por consola. Al final, y nada se publica sin el OK de Ignacio |
| 13 | Modelo | Opus 5.5, esfuerzo high; xhigh en red, multijugador y backend |

## Fases

| # | Fase | Estado |
|---|---|---|
| 0 | Base: Next 16 en la raíz (copia de roofy), CI, Pages en `/foody`, prototipo en `/prototipos/carta-gus/` | En curso |
| 1 | Sistema visual: paleta Brasa, hero con eclipse, header, idiomas, tour automático | Pendiente |
| 2 | Secciones: Qué ofrecemos, Demo, Planes, Otros negocios, Cierre; WhatsApp con el plan | Pendiente |
| 3 | Lucero: carta con Gus (más grande), comanda limpia, ciclo automático pedido → cocina → plato, «Tu pedido fue realizado» | Pendiente |
| 4 | CRM de Lucero: pedidos, cocina, clientes, carta y stock, candados por plan | Pendiente |
| 5 | Capa de juegos: modal «Mientras esperás la comida…», lista en columna a todo el ancho | Pendiente |
| 6 | Juegos de 50: Ninja, Combinaciones, Catapulta y la ruleta (configurable en el CRM) | Pendiente |
| 7 | Salas: crear, link, código y QR, lobby | Pendiente |
| 8 | Dibujá y adiviná en celulares | Pendiente |
| 9 | Hockey 1 contra 1 (nuevo) | Pendiente |
| 10 | Eclipse Academy en el CRM (75) | Pendiente |
| 11 | QA: lente de plan, honestidad, accesibilidad, movimiento reducido, Playwright 360–1920 | Pendiente |
| 12 | Backend en Foody-be: relay de salas y sincronización de pedidos entre aparatos | Pendiente |
| 13 | Kit de deploy con Docker | Pendiente |

## Cómo se trabaja

- Una fase, un PR. Antes de cada PR: `npm test`, `npm run typecheck`, `npm run lint`, `npm run build` (con y sin
  `NEXT_PUBLIC_BASE_PATH=/foody`), capturas con Playwright y una revisión independiente del diff. Claude mergea cuando
  está verde; cada merge a `main` se ve en https://toti-gauna.github.io/foody/.
- Claude se detiene solo si falta una credencial, si algo choca con una regla de honestidad o si hay que tocar Eclipse-Web.
- Lo copiado se anota con su origen en `docs/procedencia.md`.
