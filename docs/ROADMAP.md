# Eclipse para locales de comida · Roadmap v4

Estado: propuesta para revisar · 2026-10-28. Reemplaza a v3. El repo se llama `foody` por historia; **el producto se llama «Eclipse para locales de comida»** (en Eclipse-Web figura como «Foody», nombre provisional).

Fuentes: Notion (V6, V3 «Efemérides», mapa V3–V6, seis planes), repos `Eclipse-Web` (guía `CLAUDE.md`, páginas de producto, precios, hero), `kinetic-studio`, `games-market`, `agents`, `supplements-ecommerce`, y los packs de imágenes y personajes de este repo.

**Regla de oro:** pedir nunca depende de juegos, personaje, 3D o video. Cada función se marca real, simulada o prevista.

---

## 0. Qué cambió respecto de v3

1. **Nombre:** «Eclipse para locales de comida». Es un producto de Eclipse, no una marca aparte.
2. **Estética «Efemérides» completa** (la dirección de arte de Eclipse), en lugar de glass y brasas naranja/rojo en todo el sitio. Ver §5, incluida la nota sobre dónde sobrevive el calor naranja/rojo.
3. **Orden de la página:** hero → qué ofrecemos para cada tipo de negocio → demos → planes de precios → resto.
4. **Vive en Eclipse-Web** (página de producto bajo `/[locale]/productos/…`), siguiendo las reglas de ese repo. El producto en sí sigue en el repo `foody`.
5. Todo lo demás de v3 se mantiene: tandas por plan, 4 comercios, personajes elegibles, Mi Eclipse con datos de cobro, Academy/Media/Utilería, prompt de imágenes.

---

## 1. Producto y dónde vive

| Pieza | Dónde | Notas |
|---|---|---|
| Página comercial «Eclipse para locales de comida» | `Eclipse-Web`, `/[locale]/productos/<id>/` (hoy `foody`, `status: planned`) | es, en, pt con next-intl; contenido comercial en `content/*.json`; export estático |
| Producto (carta, pedido, reservas, juegos, panel) | repo `foody` | Independiente; TableFlow no se usa |
| Portal del suscriptor | Mi Eclipse | Plan, pagos, soporte, entregas |
| Demos | Capa «Ver demo» de Eclipse-Web (`DemoExperienceHost`) | Patrón de la demo Lumen |
| Subdominio propio | Pendiente (como se hizo con EstateOS, D11) | Decisión de Ignacio |

**Reglas de Eclipse-Web que se heredan:** honestidad (sin testimonios ni clientes inexistentes; todo negocio ficticio lleva la etiqueta «Demo» y no se parece a una marca real); nada de copy fijo en componentes; mobile-first sin scroll horizontal a 360 px y objetivos táctiles de 44 px; accesibilidad AA y foco visible; movimiento reducido en todo; animar solo `transform`, `opacity` y `clip-path`; sin dependencias nuevas sin motivo fuerte; **un solo CTA ámbar sólido por viewport**.

Nombre en los tres idiomas (propuesta): es «Eclipse para locales de comida» · en «Eclipse for food businesses» · pt «Eclipse para locais de comida».

---

## 2. Los 4 comercios

| Comercio | Marca de referencia | Estética de su app | Personajes a elegir | Funciones propias |
|---|---|---|---|---|
| **Cervecería** | Antares | Cobre y ámbar, madera y barriles | Barril robot · Escorpión estelar · Hamburguesa · Lúpulo · Oso cervecero | Estilos, tamaños, picadas, maridajes, mayoría de edad |
| **Bar** | Barracuda | Azul eléctrico y ámbar, nocturna | Barracuda · Copa cóctel · Luna · Mapache · Pizza | Rondas y grupo en mesa, cócteles, eventos, mayoría de edad |
| **Café** | La Fonte d'Oro | Dorado, crema, mármol | Colibrí · Gota dorada · Medialuna · Mesero · Taza | Retiro, combos, franjas del día, sellos |
| **Heladería** | Helatto | Pasteles vibrantes | Cono nube · Frutilla · Palito helado · Pingüino · Remolino | Tamaño y sabores con límite, conservación, 3D del cucurucho |

Las marcas reales requieren **autorización escrita**. Las **demos son siempre ficticias** (no pueden parecerse a una marca real). El restaurante queda como variante futura (hay demo Alba, sin personajes).

---

## 3. Planes (USD/mes, el mismo precio para los 4 comercios)

| Plan | Precio | Qué incluye |
|---|---|---|
| **Contact** | 30 | Web de marca, carta por QR, pedido y cola básica, solicitud de reserva, CRM, cuenta y suscripción, personaje en la carta (saludar, anotar, agradecer) |
| **Growth** | 75 | Hereda + juegos, pasaporte, misiones, Regalos, Estudio, disponibilidad y lista de espera, personaje animado |
| **Escalar** | 100 | Hereda + web premium hiperrealista, mundo inmersivo Higgsfield, tráiler, visor 3D/RA, plano de mesas y estaciones |
| **Hípergrowth** | 150 | Hereda + analítica por sucursal |
| **Deluxe** | 200 | Hereda + asistente IA interno |
| **Partner** | 500 (propuesta) | Hereda + varias sucursales, permisos y reportes por sucursal |

Referencia, sujeta a costeo. Pendientes: compra y mantenimiento, comisión, setup, consumos. En la página, los precios se muestran como **«precio de referencia»** con selector de moneda (ARS, BRL, USD) como en el resto de Eclipse, y nunca con tachados ni «antes $X».

---

## 4. La página, sección por sección

Marcas de sección en mono (`01 / INICIO`…) con el riel de efemérides del sitio.

| # | Sección | Qué muestra | Zona |
|---|---|---|---|
| 01 | **Hero** | H1 y una acción. Un eclipse total sobre el cielo nocturno; la corona ilumina un plato hiperrealista y lo revela. Un solo CTA ámbar | Noche |
| 02 | **Qué ofrecemos para cada tipo de negocio** | Índice de 4 líneas (cervecería, bar, café, heladería) con **un preview activo** (vista cenital hiperrealista + qué incluye + su personaje). En móvil, lista plegable. Debajo: «Restaurantes: próximamente» | Noche |
| 03 | **Demos** | Cuatro demos ficticias, cada una con su propia identidad y etiqueta «Demo». «Ver demo» abre la capa a pantalla completa. Selector «Elegí tu personaje» dentro de cada demo | Noche → amanecer |
| 04 | **Planes de precios** | Libro de precios (ledger): seis filas con glifo de fase lunar, precio en mono, qué suma cada plan, mensual/anual, moneda. Growth destacada. «Ver demo de este plan» y «Pedir este plan» | Amanecer (dawn) |
| 05 | **Cómo empezamos** | Tres pasos: elegís comercio y personaje, cargás tu carta, imprimís el QR | Amanecer |
| 06 | **Y lo demás de Eclipse** | Academy, Media, Utilería (Equipamiento) | Amanecer |
| 07 | **Preguntas** | Qué pasa si falla algo, pagos, datos, mayoría de edad | Amanecer |
| 08 | **Contacto** | WhatsApp y registro. Cierre: el eclipse se retira y sale el sol | Amanecer |

Hero y planes reutilizan componentes de Eclipse-Web (candidatos a verificar): `Hero`, `Eclipse`, `Starfield`, `EphemerisRail`, `PhaseGlyph`, `SkyTransition`, `UnitLedger`, `ProductLevels`/`Levels`, `CurrencySwitcher`, `DemoExperienceHost`.

Copy candidato (rioplatense, concreto): H1 «Tu local, pidiendo desde la mesa.» · Lead «Carta con QR, reservas, juegos y un personaje que atiende con vos. Para cervecerías, bares, cafés y heladerías.» · CTA «Ver las demos» y secundaria «Ver planes». El CTA global «Quiero potenciar mi negocio» sigue flotando y se aparta cuando hay otro ámbar en pantalla.

---

## 5. Estética Efemérides aplicada

**Idea:** *observatorio comercial*. La luz revela una capacidad concreta; el visitante elige qué ver y conserva el control. El eclipse es firma, no obstáculo.

- **Paleta:** noche `void #05050A` → `night #0C0C14`, superficies `ash #1A1A24`; amanecer `dawn #F4EFE6` y `ink #111114`; `corona #F5B942` para fuente de luz, CTA y selección; `flare #FFE8B0` para el evento lumínico; `mist #9A97A6` para texto secundario (sobre dawn, `deep #8A5A00` y `muted #5B5866`).
- **Tipografía:** Geist (UI y cuerpo), **Geist Mono** (lecturas, índices, unidades y precios) e **Instrument Serif** (un acento editorial por sección).
- **Estructura:** contenedor máximo 1240 px, gutter 16 móvil y 32 desde 768; líneas de 1 px, glifos de fase e índices como orientación; sin tarjetas genéricas repetidas ni emojis.
- **Un ámbar sólido por viewport.** El resto, links o contorno.
- **Glass solo en el header** (superficie fija con blur moderado y fallback opaco). Ninguna tarjeta en glass y ningún blur animado de pantalla completa.
- **Zonas:** home oscura que abre a zonas dawn para leer precios y método (`SkyTransition`).
- **Dónde sobreviven el naranja y el rojo:** en la **corona del eclipse** (virando de ámbar a naranja cálido en el hero) y en la **fotografía de comida** (luz de brasa sobre los platos). Es un fondo estático o de movimiento mínimo, con alternativa sin blur en gama baja. **Cambio respecto de lo pedido antes** (fondo animado naranja/rojo con blur y todo en glass): el contrato Efemérides lo restringe, y la instrucción más reciente es usar «toda la estética Efemérides». Si querés recuperar más calor, se puede ampliar en el hero y en las demos.
- **Demos y apps de cada local: fuera de Efemérides.** Cada una con su paleta, su tipografía y su personaje. Antares no se parece a Helatto, y ninguna se parece a una marca real.
- **«Powered by Eclipse»:** firma discreta en el pie de la carta y de la web de cada local (en la página de Eclipse no hace falta).

**Partitura de movimiento (a especificar y medir antes de implementar):**

1. Carga: loader actual salteable; H1 y CTA renderizados desde servidor.
2. Header: superficie que flota con `data-scrolled`, blur fijo.
3. Hero: el eclipse cubre y descubre el plato (un solo evento), parallax de estrellas, vapor del plato en loop corto y pausado fuera de pantalla.
4. Índice «Qué ofrecemos»: cambio de preview con crossfade de 180–240 ms y desplazamiento máximo de 12 px.
5. Demos: se abren como el eclipse existente («hacia la luz»), con «Saltar» siempre operativo; no dos eclipses seguidos.
6. Planes: filas que se encienden al entrar; glifo de fase que cambia por plan.
7. Cierre: amanecer.

Límites: máximo dos movimientos principales simultáneos; sin animación decorativa en reposo; todo con limpieza; movimiento reducido = estático o fundido ≤ 150 ms; audio apagado por defecto.

---

## 6. Demos

Cuatro demos ficticias, una por comercio, con etiqueta «Demo» visible y estado simulado identificado. Cada una crece con la tanda de plan:

| Demo (ficticia) | Comercio | Identidad |
|---|---|---|
| Cervecería ficticia (nombre a elegir) | Cervecería | Cobre y ámbar, madera |
| Neón 21 | Bar | Azul eléctrico y ámbar |
| Grano | Café | Kraft, crema y verde bosque |
| Gelato Pop | Heladería | Pasteles redondeados |

Por plan: la demo de **Contact** muestra la carta, el pedido, la solicitud de reserva y el personaje; la de **Growth** suma juegos y pasaporte; la de **Escalar** suma mundo inmersivo, 3D y plano de mesas. Una capa «Ver demo de este plan» por fila del libro de precios, como en Roofy. Las demos usan datos de ejemplo claramente identificados y no tocan datos reales.

---

## 7. Personajes

20 personajes (5 por comercio), 15 acciones y 50 poses clave cada uno. El cliente elige uno al registrarse y puede cambiarlo desde Mi Eclipse. Un solo sistema de animación con paquetes intercambiables. Reacciones por evento: **anotar al bajar la carta**, agradecer al enviar, esperar al preparar, celebrar un premio real, error con acción; prioridades y pausa mínima de 8 s; movimiento reducido = pose quieta. Antes de animar hay que producir hoja maestra, limpiar variantes, separar o vectorizar y completar intermedios. Detalle en `PERSONAJES.md`.

---

## 8. Mi Eclipse

Alta guiada (cuenta, negocio, plan, personaje, cobro), datos para cobrar (titular, CUIT, condición frente al IVA, domicilio fiscal, email de facturación, método tokenizado), suscripción mensual, facturación, equipo, y dentro: Academy, Media y Utilería. El acceso se habilita solo con el pago acreditado. Detalle en `PORTAL-CUENTA.md`.

---

## 9. Producción visual

Con ChatGPT: vista cenital hiperrealista de barras y mesas, platos y bebidas, fondos, recortes individuales, mockups. Con SVG: íconos simples como código; personajes y fondos complejos se vectorizan después. Con Higgsfield (desde Escalar, con OK de gasto): un mundo inmersivo por comercio. Prompt completo en `PROMPT-IMAGENES.md` (v4, estética Efemérides).

---

## 10. Roadmap por tandas

Modelos: **Sonnet 5.5 por defecto**, **Opus 5.5 en hitos justificados** (dirección creativa, arquitectura, seguridad, pagos, netcode, QA final), **Haiku 5.5** en lo mecánico. Reglas del repo `agents`: SDD antes de tocar código; el gasto en APIs, Higgsfield o créditos requiere OK de Ignacio. Cada tanda termina con un hito vendible probado en un piloto. Un lote por vez y un PR a la vez.

### Tanda 0 · Cimientos

| Fase | Entregable | Modelo · esfuerzo |
|---|---|---|
| 0.1 Descubrimiento y SDD | Brief por comercio y marca, sucursales, autorizaciones, orden de ataque (propuesta: cervecería, bar, café, heladería) | Sonnet · medium |
| 0.2 Contrato visual de la página | Aplicar Efemérides al producto: matriz de animaciones (trigger, duración, easing, reducido, audio, limpieza), presupuesto visual por viewport, rúbrica de 14 puntos | Opus · high |
| 0.3 Curación de personajes | Hoja maestra aprobada de cada uno de los 20, tabla pose↔evento, manifiesto | Opus · high |
| 0.4 Lote 1 de imágenes | Hero, previews cenitales, fondos, íconos, mockups con el prompt v4 | Sonnet · medium |
| 0.5 Arquitectura y repo | ADR de stack, modelo comercio → marca → sucursal → mesa → sesión → pedido, paquetes de tema y de personaje, auth, QR firmado, suscripciones | Opus · xhigh |
| 0.6 Personaje a código | Componente `Companion`, máquina de estados, atlas, galería, 3 poses piloto por personaje | Sonnet · high |

### Tanda 1 · **Contact (USD 30)** × 4 comercios

| Fase | Entregable | Modelo · esfuerzo |
|---|---|---|
| 1.1 **Página en Eclipse-Web** | Secciones 01 a 08: hero, qué ofrecemos por tipo, demos, planes, cómo empezamos, resto de Eclipse, preguntas, contacto; es/en/pt; contenido en JSON | Sonnet · high (hero y eclipse con Opus · high) |
| 1.2 Demos Contact ×4 | Las cuatro demos con carta, pedido, solicitud de reserva y personaje | Sonnet · high |
| 1.3 Mi Eclipse v1 | Registro, datos de cobro, suscripción mensual, elegir comercio, plan y personaje, onboarding | Opus · high (pagos); Sonnet · high (UI) |
| 1.4 Carta y pedido por QR | Carta por sucursal, variantes, carrito por mesa, envío, aceptación, agotados | Sonnet · high |
| 1.5 Estados, concurrencia y pago | Máquina de estados, idempotencia, pruebas de carrera | Opus · xhigh |
| 1.6 Panel básico y solicitud de reserva | Cola, carta, mesas, clientes, agenda | Sonnet · high |
| 1.7 Personaje en la carta | Saludar, anotar al bajar, agradecer; logo viajero básico | Sonnet · high |
| 1.8 Academy, Media y Utilería v1 | Catálogo y pedido simple en el portal | Sonnet · medium |
| 1.9 QA visual y piloto | Gate adversarial contra la línea base, LCP ≤ 2,5 s, CLS ≤ 0,1, INP ≤ 200 ms (objetivos, no mediciones); 1 marca real | Opus · high |

Entrega por comercio dentro de la tanda (1A cervecería, 1B bar, 1C café, 1D heladería; la primera con autorización manda):

| | 1A Cervecería | 1B Bar | 1C Café | 1D Heladería |
|---|---|---|---|---|
| Carta | Estilos, tamaños, picadas, maridajes | Cócteles, rondas por persona o grupo | Combos, franjas, retiro | Tamaño y sabores con límite |
| Particularidad | Mayoría de edad | Mayoría de edad | Retiro en mostrador | Conservación en entrega |
| Reserva | Sí | Sí | Opcional | No |

### Tanda 2 · **Growth (USD 75)** × 4

| Fase | Entregable | Modelo · esfuerzo |
|---|---|---|
| 2.1 Motor de juegos | Extraer motor y red de `games-market`; verificar salas en tiempo real para producción (peerNet es P2P) | Opus · high |
| 2.2 Juegos por comercio | Skin con el personaje elegido | Sonnet · high |
| 2.3 Pasaporte y misiones | Sellos por visita, consumo, exploración y temporada; canje validado por personal | Sonnet · high; revisión Opus · high |
| 2.4 Regalos y Estudio | Regalos de producto; plantillas de contenido | Sonnet · high |
| 2.5 Reservas con disponibilidad | Capacidad, recordatorios, lista de espera | Sonnet · high |
| 2.6 Personaje animado | Las 15 acciones ligadas a eventos reales | Sonnet · high |
| 2.7 Academy y demos Growth | Rutas por comercio; capa de demo con juegos y pasaporte | Sonnet · medium |
| 2.8 QA y piloto | Salas, reconexión, canjes | Opus · high |

Juegos propuestos: cervecería (trivia, brindis); bar (dibujo y adivinanza, adiviná en la frente: hay que construirlo); café (memoria, palabras); heladería (match-3 de sabores, ninja de frutas).

### Tanda 3 · **Escalar (USD 100)** × 4

| Fase | Entregable | Modelo · esfuerzo |
|---|---|---|
| 3.1 Web premium | Hiperrealismo, parallax, motion del local | Sonnet · high (dirección Opus · high) |
| 3.2 Mundo inmersivo | Escena Higgsfield por comercio atada al scroll, con foto fija de respaldo (con OK de gasto) | Opus · high; Sonnet · medium |
| 3.3 Tráiler de marca | 30–45 s en Kinetic Studio con el personaje | Opus · high (guion); Sonnet · high |
| 3.4 3D / RA | Visor y 3 productos piloto por comercio | Sonnet · medium |
| 3.5 Salón y estaciones | Plano de mesas, enrutamiento, demoras | Sonnet · high |
| 3.6 Secuencias completas | Las 10 secuencias de 5 poses | Sonnet · high |
| 3.7 Demos Escalar y QA | Capa de demo con mundo inmersivo y 3D | Opus · high |

Mundos: cervecería = bodega nocturna estrellada; bar = puerto y mar al atardecer; café = salón dorado con fuente; heladería = mundo de sabores.

### Tandas 4 a 7

- **Tanda 4 · Hípergrowth (150):** analítica por sucursal sin atribuir causalidad inexistente. Sonnet · high; Opus · high en métricas.
- **Tanda 5 · Deluxe (200):** asistente IA interno, acciones sensibles confirmadas, topes de costo. Opus · high.
- **Tanda 6 · Partner (500, propuesta):** varias sucursales, permisos y reportes por sucursal, aislamiento entre sucursales. Opus · xhigh.
- **Tanda 7 · Escala comercial:** las 4 marcas con su contrato de marca, personaje y juegos; migración de cartas; capacitación en Academy; materiales en Utilería. Sonnet · medium.

---

## 11. Aceptación mínima

- **Visual:** gate adversarial contra la línea base; foco, contraste AA, Back, movimiento reducido y etiqueta «Demo» son binarios y bloqueantes; si se ve peor que la base, no se mergea.
- Dos pedidos simultáneos no venden la misma unidad; un reintento no duplica pedido ni cobro.
- Dos reservas no ocupan el mismo cupo.
- Un comercio o sucursal nunca lee datos de otro.
- Un sello o canje no se otorga dos veces; el puntaje del navegador no acredita premios.
- Si falla personaje, juego, 3D o video, la carta y el pedido siguen funcionando.
- El personaje no tapa precios ni botones; «éxito» solo tras una confirmación real.
- No se guardan números de tarjeta.
- Una demo nunca se hace pasar por un cliente real.

---

## 12. Abierto

Comercio piloto y orden de ataque · autorización de cada marca · nombre de la cervecería ficticia · subdominio propio · stack (Next.js como Eclipse-Web y Volta, o Vite como games-market) · servicio de salas en tiempo real · proveedor de pagos y de facturación electrónica · precios de compra, mantenimiento, comisión y Partner · restaurante como quinto comercio · CTA exacto del hero · cuánto calor naranja/rojo se mantiene más allá de la corona · gasto en ChatGPT, Higgsfield y APIs (requiere OK).
