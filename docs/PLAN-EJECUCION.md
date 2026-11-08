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
| 0 | Base: Next 16 en la raíz (copia de roofy), CI, Pages en `/foody`, prototipo en `/prototipos/carta-gus/` | Mergeada (#4) |
| 1 | Sistema visual: paleta Brasa, hero con eclipse, header, idiomas, tour automático | Mergeada (#5) |
| 2 | Secciones: Qué ofrecemos, Demo, Planes, Otros negocios, Cierre; WhatsApp con el plan | Mergeada (#5) |
| 3 | Lucero: carta con Gus (más grande), comanda limpia, ciclo automático pedido → cocina → plato, «Tu pedido fue realizado» | Mergeada (#6) |
| 4 | CRM de Lucero: pedidos, cocina, clientes, carta y stock, candados por plan | Mergeada (#6) |
| 5 | Capa de juegos: modal «Mientras esperás la comida…», lista en columna a todo el ancho | Mergeada (#7) |
| 6 | Juegos de 50: Ninja, Combinaciones, Catapulta y la ruleta (configurable en el CRM) | Mergeada (#7) |
| 7 | Salas: crear, link, código y QR, lobby | Mergeada (#8) |
| 8 | Dibujá y adiviná en celulares | Mergeada (#8) |
| 9 | Hockey 1 contra 1 (nuevo) | Mergeada (#8) |
| 10 | Eclipse Academy en el CRM (75): marketing digital y físico, con videos, documentos y fotos | Mergeada (#9) |
| 11 | QA: lente de plan, honestidad, accesibilidad, movimiento reducido, Playwright 360–1920 | Mergeada (#9) |
| 12 | Backend en Foody-be: relay de salas y sincronización de pedidos entre aparatos | Hecha (Foody-be #1 y PR de fases 12–13) |
| 13 | Kit de deploy con Docker (`docs/DEPLOY.md`) | Hecha (PR de fases 12–13) |

## Ajustes después de la fase 13 (Ignacio, 02/11/2026)

- La ruleta aparece sobre toda la pantalla al abrir la carta, apenas se escanea el QR (Ignacio: «la ruleta aparece al
  principio luego de escanear el QR»). Un tiro por visita, y si se cierra queda el botón «Ruleta» en la barra de la
  carta.
  - Rueda de feria: aro dorado con bisel y luces, separadores dorados, relieve y brillo, puntero con gema que vibra al
    girar y su pie.
  - El premio sale con su código en un ticket.
- Después de pedir, los juegos en un modal (hoja que sube desde abajo, con el pedido oscurecido detrás).
- Hockey rediseñado:
  - marcador con el color de cada paleta y los goles hasta 5;
  - la mesa ocupa el espacio que queda;
  - riel dorado, agujeros de aire, arcos que brillan, paletas con volumen, estela del disco y destello en el gol;
  - todo con los colores de la temporada.
- Hockey contra Gus con tres niveles, que se eligen antes de jugar (Ignacio: «está muy difícil»).
  - Fácil (el principal), Normal o Difícil, y se puede cambiar al final.
  - Cambian velocidad, reacción, puntería, cuándo sale a atacar y qué tan adelante defiende (`BOT_LEVELS` en
    `games/mesa/hockey/physics.ts`).
- Sin nada «próximamente»: fuera el bloque de Qué ofrecemos y los productos de Otros negocios que solo eran «Próximamente».
- La demo vista con un plan muestra solo lo de ese plan: lo que no tiene no aparece (sin candados ni avisos de otro plan).
- Fechas especiales (`lib/seasons.ts`):
  - Temporadas: clásica, Halloween (20/10–3/11), Navidad (1/12–6/1) y San Valentín (7–15/2).
  - La demo se viste sola según la fecha, y se puede elegir cualquiera desde la barra o con `?temporada=`.
  - Cambian la paleta (también la de los juegos), las decoraciones, el objeto junto a Gus, el saludo y la ruleta.
  - Nunca cambian precios ni lo incluido. El sitio la muestra en Demo, «Vestida para cada fecha».
- Pantalla de carga de la demo: espera a que estén las imágenes, con un mínimo de 1,4 s y un máximo de 5 s.
- Juegos más premium:
  - tarjeta de inicio con arte, nombre y bajada;
  - marcador en una barra arriba del tablero;
  - textos traducidos;
  - carga con el arte del juego;
  - resultado con los puntos contando, la mejor marca y confeti en un récord.

## Local en vivo (PWA multi-rol, Ignacio 08/11/2026)

`/[locale]/local/`: la demo como un local de verdad, repartida en varios celulares.
- **Abrir el local:** alguien lo abre y su celular queda como dueño y centro. Pasa links o QR, y cada persona entra con
  su rol:
  - **Mesa N:** la carta con Gus, la ruleta al entrar, los juegos, pedir la cuenta y la campana para llamar al mozo.
  - **Mozo:** salón con el estado de cada mesa, «A servir», llamados y tomar pedido en la mesa.
  - **Cocina:** comandas en columnas, Empezar → Listo, con sonido y vibración.
  - **Dueño:** equipo conectado, links con QR, números de la noche y el CRM entero.
- **Conexión:** usa el mismo transporte que las salas de juego.
  - Con `NEXT_PUBLIC_API_URL`, va por el relay de Foody-be. El workflow de Pages ya la lee de la variable del repo.
  - Sin backend, va por WebRTC.
  - Para QA con pestañas del mismo navegador, `?red=local`.
- **Estado:** el celular del dueño aplica las acciones y reparte el estado; cada celular conserva su carrito.
  - El local queda guardado en el celular del dueño, así que una recarga no lo borra.
  - Si el dueño cierra la pestaña, el local se corta hasta que la vuelve a abrir.
- **PWA:** manifest, íconos de Gus, service worker (assets cache-first y páginas network-first, con fallback offline) y
  botón «Instalar app» (en iPhone explica cómo).
- **Kit atómico** en `components/kit/`, en CSS normal sobre los tokens de Lucero:
  - átomos: Button, Badge, TableNum, Card, Stat, Field, Dot, Empty;
  - moléculas: OrderTicket, QrLink, RoleCard, Tabs, Stepper.
  Los roles (`components/live/roles/`) se arman con ellos.
- QA: `scripts/qa-live.mjs` recorre dueño, mesa, cocina y mozo, el llamado, el pedido del mozo y la recarga del dueño.

## Cómo se trabaja

- Una fase, un PR. Antes de cada PR: `npm test`, `npm run typecheck`, `npm run lint`, `npm run build` (con y sin
  `NEXT_PUBLIC_BASE_PATH=/foody`), capturas con Playwright y una revisión independiente del diff. Claude mergea cuando
  está verde; cada merge a `main` se ve en https://toti-gauna.github.io/foody/.
- Claude se detiene solo si falta una credencial, si algo choca con una regla de honestidad o si hay que tocar Eclipse-Web.
- Lo copiado se anota con su origen en `docs/procedencia.md`.

## QA (fase 11)

Con el export servido en `localhost:4100` (`python3 -m http.server 4100 --directory out`), y `NODE_PATH=$(npm root -g)`:

- `node scripts/qa-sweep.mjs`: 8 páginas × 7 anchos (360, 390, 768, 1024, 1366×657, 1440, 1920), con y sin movimiento
  reducido. Sin scroll horizontal, sin errores de consola, `noindex`, un solo botón principal a la vista, blancos ≥ 44 px,
  y la lente de plan: 25 sin juegos, 50 con la ruleta y los tres individuales, 75 suma los de mesa.
- `node scripts/qa-axe.mjs`: axe-core (WCAG 2.1 A y AA) en el sitio, la demo, cada sección del CRM y la sala.
- `qa-demo.mjs`, `qa-games.mjs`, `qa-mesa.mjs`, `qa-academy.mjs`: los recorridos de cada fase.

## Pendientes conocidos

- Salas sin backend: WebRTC por el broker público de PeerJS. En la WiFi del local anda; entre redes distintas (datos
  móviles) puede no conectar sin un servidor TURN. Con Foody-be (`NEXT_PUBLIC_API_URL`) pasan por su relay y andan en
  cualquier red. Mientras Foody-be no esté publicado en Render, la prueba en Pages corre sin backend.

- Eclipse Academy: las guías son reales; los videos y las fotos son de ejemplo (marcados «Ejemplo») hasta tener los
  definitivos. Se reemplazan en `content/academy.json`.

- En «Dibujá y adiviná», sin backend la palabra viaja a todos los celulares y solo el que dibuja la muestra. Con Foody-be le
  llega solo al que dibuja.

- Demo en dos aparatos (con Foody-be): manda la compu que hizo el QR; el celular le pide el estado al conectarse.
  Otras pestañas del mismo navegador que no estén emparejadas no reciben lo que llega del otro aparato.

- Los botones del escenario de los juegos ya están traducidos (skin de Lucero). Siguen en español las instrucciones y los
  nombres del marcador que trae cada juego copiado de games-market.
