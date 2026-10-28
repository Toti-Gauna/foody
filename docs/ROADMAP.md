# Foody · Roadmap v3 · Eclipse V6 · por tandas de plan

Estado: propuesta para revisar · 2026-10-28. Reemplaza al roadmap v2 de Notion. Nombre comercial pendiente (Foody es provisorio).
Fuentes: Notion Eclipse V6 (plan inicial, juegos y pasaportes, mapa V3–V6, seis planes), repos `kinetic-studio`, `games-market`, `agents`, `supplements-ecommerce`, y los packs de imágenes y personajes de este repo (`assets/`).

**Regla de oro:** pedir nunca depende de juegos, personaje, 3D o video. Cada función se marca como real, simulada o prevista.

---

## 1. Qué cambió respecto de v2

1. **Se ataca por tandas de plan, no por módulos sueltos.** Cada tanda (Contact, Growth, Escalar…) entrega los **4 comercios** completos para ese plan antes de pasar al siguiente.
2. **Los 4 comercios salen del pack de personajes:** cervecería, bar, café y heladería (5 personajes cada uno). El restaurante (demo Alba) queda como variante futura: no tiene personajes todavía.
3. **El cliente elige su personaje** entre los 5 de su comercio. Las poses y animaciones son equivalentes, así que hay **un solo sistema de animación** con paquetes de personaje intercambiables.
4. **Sitio comercial más animado y "Powered by Eclipse"**, con los seis planes y sus precios a la vista.
5. **Portal "Mi Eclipse" del suscriptor** con cuenta, suscripción mensual y todos los datos de cobro; más Academy, Media y Utilería (Equipamiento) dentro del portal.
6. **Producción visual con ChatGPT (imágenes) y SVG:** hiperrealismo para vistas cenitales y comida, fondos, recortes individuales e íconos. Prompt completo en `PROMPT-IMAGENES.md`.
7. **Los personajes reaccionan en la carta:** al bajar, anotan el pedido; al agregar, agradecen; al pedir, esperan; al ganar, celebran (ver `PERSONAJES.md`).

---

## 2. Los 4 comercios

| Comercio | Marca de referencia | Estética | Personajes a elegir | Funciones propias |
|---|---|---|---|---|
| **Cervecería** | Antares | Cálida, cobre y ámbar, madera y barriles | Barril robot · Escorpión estelar · Hamburguesa · Lúpulo · Oso cervecero | Estilos de cerveza, tamaños y jarras, picadas, maridajes, verificación de mayoría de edad |
| **Bar** | Barracuda | Nocturna, azul eléctrico y ámbar, neón | Barracuda · Copa cóctel · Luna · Mapache · Pizza | Rondas y grupo en mesa, cócteles, eventos y torneos, verificación de mayoría de edad |
| **Café** | La Fonte d'Oro | Clásica, dorado, crema, mármol | Colibrí · Gota dorada · Medialuna · Mesero · Taza | Retiro, combos y franjas (desayuno, merienda), sellos de café |
| **Heladería** | Helatto | Pasteles vibrantes, redondeada, lúdica | Cono nube · Frutilla · Palito helado · Pingüino · Remolino | Tamaño y sabores con límite, conservación en entrega, 3D del cucurucho |

Las marcas reales exigen **autorización escrita** para nombre, logo y fotos. Hasta tenerla, las demos usan marcas ficticias (Neón 21, Grano, Gelato Pop, y una cervecería a nombrar). Rubro exacto y sucursales de cada marca: a confirmar en la tanda 0.

---

## 3. Planes (USD/mes, el mismo precio para los 4 comercios)

| Plan | Precio | Qué incluye |
|---|---|---|
| **Contact** | 30 | Web de marca, carta por QR, pedido y cola básica, solicitud de reserva, CRM, cuenta y suscripción, personaje en la carta (saludar, anotar, agradecer) |
| **Growth** | 75 | Hereda + catálogo de juegos del comercio, pasaporte, misiones, Regalos, Estudio, disponibilidad y lista de espera, personaje animado completo |
| **Escalar** | 100 | Hereda + web premium hiperrealista, mundo inmersivo con Higgsfield, tráiler de marca, visor 3D/RA, plano de mesas y estaciones, secuencias completas del personaje |
| **Hípergrowth** | 150 | Hereda + analítica por sucursal: embudo, ticket, ocupación, canjes y costo de incentivos |
| **Deluxe** | 200 | Hereda + asistente IA interno con acciones sensibles confirmadas |
| **Partner** | 500 (propuesta) | Hereda + varias sucursales: reglas, permisos y reportes por sucursal, programas de marca |

Precios de referencia, sujetos a costeo. Pendientes: compra y mantenimiento, comisión por venta, setup, consumos (pasarela, IA, mensajería). El reparto del personaje por plan es propuesta.

---

## 4. Sitio comercial · "Powered by Eclipse"

Más animado que las referencias: scrollytelling con GSAP, parallax por capas, video en loop con póster, tilt de tarjetas, reflejos de cursor, contadores y planes que se despliegan. Fondo de manchas naranja y rojo con blur sobre negro cálido. Todo el sitio comercial en glassmorphism.

| # | Sección | Qué se ve |
|---|---|---|
| 1 | Loader + hero | Vista cenital hiperrealista de una barra, plato flotando con vapor, celular glass con la carta; badge **Powered by Eclipse** con el glifo de eclipse |
| 2 | Cómo funciona | Scroll con pin: escaneo QR → carta → pedido → "preparando" → "entregado", con el personaje reaccionando |
| 3 | Elegí tu comercio | 4 tarjetas (cervecería, bar, café, heladería) que abren su demo con su propia estética |
| 4 | Conocé a tu personaje | Selector de los 5 personajes por comercio con saludo, anotar y celebrar |
| 5 | Pedido desde la mesa | Celular en mano sobre mesa hiperrealista, carta con fotos reales |
| 6 | Reservas y turnos | Calendario glass |
| 7 | Panel del comercio | Cola por estación y plano de mesas |
| 8 | Juegos de mesa | Arcade jugable (de games-market) con el personaje |
| 9 | Pasaporte y Regalos | Sellos, progreso, premio |
| 10 | Visor 3D / RA | Plato girando, botón "Ver sobre mi mesa" |
| 11 | Mundos inmersivos | Una escena Higgsfield por comercio atada al scroll |
| 12 | **Planes** | Seis tarjetas con precio USD 30 / 75 / 100 / 150 / 200 / 500, Growth destacada, toggle mensual/anual, "Qué incluye" desplegable |
| 13 | Eclipse Academy, Media y Utilería | Qué se puede contratar además del software |
| 14 | FAQ | Qué pasa si falla un juego o el 3D (el pedido sigue), pagos, datos |
| 15 | CTA final | "Quiero potenciar mi local", registro |

**Powered by Eclipse** aparece en el sitio comercial, en el pie de la carta y de la web de cada comercio. Propuesta: removible desde Escalar o Partner (a decidir).

---

## 5. Personajes · resumen

- 20 personajes, 15 acciones cada uno (300 poses) y 50 poses clave en 10 secuencias (1000 poses). Detalle en `PERSONAJES.md` y `assets/personajes/`.
- El cliente elige 1 personaje por comercio en el onboarding. Se puede cambiar desde Mi Eclipse.
- Un solo sistema de estados; cada personaje es un paquete (`personajes.json` + atlas).
- **Antes de animar hay que producir:** las láminas son referencias, no sprites. Hay que separar figuras, limpiar variantes, redibujar o vectorizar y completar intermedios.
- Reacciones por evento (anotar al bajar, agradecer, esperar, celebrar, error) con prioridades y pausas; movimiento reducido = pose quieta.

---

## 6. Producción visual

Con ChatGPT se generan: vistas cenitales hiperrealistas (barra, mesa, heladera, mostrador), platos y bebidas, fondos 16:9 y 9:16, recortes individuales con fondo transparente o liso, mockups físicos y piezas de interfaz de referencia.

**SVG:** ChatGPT sirve para íconos simples (se le pide código SVG). Los personajes y fondos complejos son raster; para usarlos como SVG se vectorizan y limpian (o se redibujan por capas). Los textos reales siempre van en HTML.

Reglas: imágenes de referencia, no capturas publicables; sin texto legible dentro de la imagen; locales y platos reales de clientes solo con referencias autorizadas.

---

## 7. Roadmap por tandas

Modelos: **Sonnet 5.5 por defecto**, **Opus 5.5 en hitos justificados** (arquitectura, seguridad, pagos, dirección visual, netcode, QA final), **Haiku 5.5** en tareas mecánicas. Regla del repo `agents`: SDD antes de tocar código, Opus no es el modo por defecto, y el gasto en APIs, Higgsfield o créditos requiere OK de Ignacio.

Cada tanda termina con un **hito vendible**: ese plan funcionando para los 4 comercios (o los que estén listos), probado con un piloto.

### Tanda 0 · Cimientos (nada se vende todavía)

| Fase | Entregable | Modelo · esfuerzo |
|---|---|---|
| 0.1 Descubrimiento y SDD | Brief por comercio y por marca, sucursales, autorizaciones, **orden de ataque** (propuesta: cervecería, bar, café, heladería; la primera con autorización manda) | Sonnet · medium |
| 0.2 Curación de personajes | 1 hoja maestra aprobada por personaje (20), limpieza de variantes, tabla pose↔evento, manifiesto | Opus · high (hito visual) |
| 0.3 Lote 1 de imágenes | Generar con el prompt: fondos, cenitales, comida, íconos, mockups; ordenar en `assets/` | Sonnet · medium (prompts) |
| 0.4 Arquitectura y repo | ADR de stack, modelo comercio → marca → sucursal → mesa → sesión → pedido, paquetes de tema y de personaje, auth, QR firmado, suscripciones | Opus · xhigh |
| 0.5 Sistemas de diseño | (a) Sitio Foody: glass + brasas + Powered by Eclipse. (b) Tema por comercio, sin glass. (c) Base GSAP | Sonnet · high (Opus en el fondo animado) |
| 0.6 Personaje a código | Componente `Companion`: máquina de estados, atlas, manifiesto, galería de prueba, 3 poses piloto por personaje | Sonnet · high |

### Tanda 1 · **Contact (USD 30)** × 4 comercios

| Fase | Entregable | Modelo · esfuerzo |
|---|---|---|
| 1.1 Sitio comercial | Secciones 1–5, 12–15 del §4, planes con precios, 4 demos con personaje (simuladas, marcadas) | Sonnet · high (hero: Opus · high) |
| 1.2 Portal Mi Eclipse v1 | Registro, datos de cobro, suscripción mensual, elegir comercio, plan y **personaje**, onboarding con checklist | Opus · high (pagos y seguridad); Sonnet · high (UI) |
| 1.3 Carta y pedido por QR | Carta por sucursal, variantes y agregados, carrito individual por mesa, envío, aceptación, agotados | Sonnet · high |
| 1.4 Estados, concurrencia y pago | Máquina de estados, idempotencia, pruebas de carrera sobre stock | Opus · xhigh |
| 1.5 Panel básico | Cola de pedidos, carta, mesas, clientes | Sonnet · medium |
| 1.6 Solicitud de reserva y CRM | Agenda básica, confirmar/rechazar/reprogramar | Sonnet · high |
| 1.7 Personaje en la carta | Saludar, **anotar al bajar**, agradecer; logo viajero básico | Sonnet · high |
| 1.8 Academy, Media y Utilería v1 | Catálogo en el portal y pedido simple | Sonnet · medium |
| 1.9 QA y piloto | E2E, accesibilidad, 1 marca real | Opus · high |

Entrega por comercio dentro de la tanda (cada una repite 1.1 a 1.7 con su tema, su carta y su personaje):

| | 1A Cervecería | 1B Bar | 1C Café | 1D Heladería |
|---|---|---|---|---|
| **Carta** | Estilos, tamaños, picadas, maridajes | Cócteles, rondas por persona o grupo | Combos, franjas del día, retiro | Tamaño → sabores con límite |
| **Particularidad** | Mayoría de edad | Mayoría de edad | Retiro en mostrador | Conservación en entrega |
| **Reserva** | Sí | Sí | Opcional | No |
| **Hito** | Cervecería vendible | Bar vendible | Café vendible | Heladería vendible |

### Tanda 2 · **Growth (USD 75)** × 4 comercios

| Fase | Entregable | Modelo · esfuerzo |
|---|---|---|
| 2.1 Motor de juegos | Extraer motor y red de `games-market`; **verificar** salas en tiempo real para producción (peerNet es P2P) | Opus · high |
| 2.2 Juegos por comercio | Skin con el personaje elegido y catálogo propio (ver matriz) | Sonnet · high |
| 2.3 Pasaporte y misiones | Sellos por visita, consumo, exploración y temporada; canje validado por personal | Sonnet · high; revisión Opus · high |
| 2.4 Regalos y Estudio | Regalos de producto; plantillas de contenido autoservicio | Sonnet · high |
| 2.5 Disponibilidad de reservas | Capacidad por horario, recordatorios, lista de espera | Sonnet · high |
| 2.6 Personaje animado | Las 15 acciones ligadas a eventos reales | Sonnet · high |
| 2.7 Academy | Rutas por comercio y nivel | Sonnet · medium |
| 2.8 QA y piloto | Salas, reconexión, canjes | Opus · high |

| | Juegos propuestos |
|---|---|
| Cervecería | Trivia cervecera, brindis (hockey de mesa), pasaporte "ruta de estilos" |
| Bar | Dibujo y adivinanza (Pinturillo), Adiviná en la frente (a construir), misiones de noches |
| Café | Memoria, palabras y categorías, sellos de café |
| Heladería | Match-3 de sabores, Ninja de frutas, "armá tu cucurucho" |

### Tanda 3 · **Escalar (USD 100)** × 4 comercios

| Fase | Entregable | Modelo · esfuerzo |
|---|---|---|
| 3.1 Web premium | Hiperrealismo (cenital, comida), parallax, motion | Sonnet · high; Opus · high en dirección |
| 3.2 Mundo inmersivo | Escena Higgsfield por comercio atada al scroll, con foto fija de respaldo (con OK de gasto) | Opus · high (dirección); Sonnet · medium |
| 3.3 Tráiler de marca | 30–45 s en Kinetic Studio, con el personaje | Opus · high (guion); Sonnet · high |
| 3.4 3D / RA | Visor y 3 productos piloto por comercio, probado en dispositivos | Sonnet · medium |
| 3.5 Salón y estaciones | Plano de mesas, enrutamiento por estación, demoras | Sonnet · high |
| 3.6 Secuencias completas | Las 10 secuencias de 5 poses por personaje | Sonnet · high |
| 3.7 QA y piloto | Rendimiento en celulares reales | Opus · high |

| | Mundo inmersivo | Producto 3D piloto |
|---|---|---|
| Cervecería | Bodega nocturna estrellada | Pinta, hamburguesa, jarra |
| Bar | Puerto y mar al atardecer | Cóctel, copa, pizza |
| Café | Salón dorado con fuente | Latte art, medialuna |
| Heladería | Mundo de sabores | Cucurucho, copa, palito |

### Tanda 4 · **Hípergrowth (USD 150)**
Analítica por sucursal: embudo, ticket, ocupación, ausencias, canjes y costo de incentivos, sin atribuir causalidad que no exista. Sonnet · high; Opus · high en métricas. Piloto con datos reales.

### Tanda 5 · **Deluxe (USD 200)**
Asistente IA interno: consultas sobre pedidos, reservas y operación; acciones sensibles confirmadas y registradas; topes de costo. Opus · high. Piloto supervisado.

### Tanda 6 · **Partner (USD 500, propuesta)**
Varias sucursales: permisos, reglas y reportes por sucursal, programas de marca compartidos, biblioteca compartida de personajes y modelos. Opus · xhigh (aislamiento entre sucursales). Migración y soporte por contrato.

### Tanda 7 · Escala comercial
Incorporar las 4 marcas con su contrato de marca, personaje y juegos; migración de cartas; capacitación en Academy; materiales en Utilería. Sonnet · medium.

---

## 8. Criterios de aceptación mínimos

- Dos pedidos simultáneos no venden la misma unidad; un reintento no duplica pedido ni cobro.
- Dos reservas no ocupan el mismo cupo.
- Un comercio o sucursal nunca lee datos de otro.
- Un sello o canje no se otorga dos veces; el puntaje del navegador no acredita premios.
- Si falla personaje, juego, 3D o video, la carta y el pedido siguen funcionando.
- El personaje no tapa precios ni botones; "éxito" solo tras una confirmación real.
- El QR abre un contexto: no autoriza cargos ni datos de terceros.
- No se guardan números de tarjeta; los cobros recurrentes pasan por un proveedor de pagos.

---

## 9. Abierto

Nombre y repo definitivo · comercio piloto y orden de ataque · autorización de cada marca · stack (Next.js como Eclipse-Web y Volta, o Vite como games-market) · servicio de salas en tiempo real · proveedor de pagos y de facturación electrónica · precios de compra, mantenimiento, comisión y Partner · restaurante como quinto comercio (requiere personajes) · si "Powered by Eclipse" es removible y desde qué plan · gasto en ChatGPT, Higgsfield y APIs (requiere OK) · seña, división de cuentas, POS y delivery (alcance aparte).
