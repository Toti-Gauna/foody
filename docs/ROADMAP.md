# Eclipse para locales de comida · Roadmap v5

Estado: **plan cerrado de la fase 0.1** · 2026-10-28 · Reemplaza a v4. El repo se llama `foody` por historia; el producto es **«Eclipse para locales de comida»** y vive en **foody.eclipse-business.com**.

Fuentes: SDD de la fase 0.1 (`SDD-0.1-DESCUBRIMIENTO.md`), Notion (V6, V3 «Efemérides», mapa V3–V6, seis planes), repos `Eclipse-Web`, `kinetic-studio`, `games-market`, `agents`, `supplements-ecommerce`, y los packs de imágenes y personajes de este repo.

**Regla de oro:** pedir nunca depende de juegos, personaje, 3D o video. Cada función se marca como real, simulada o prevista.

**Cómo leer las columnas.** *Modelo y esfuerzo* = modelo de Claude y nivel de razonamiento con que se ejecuta la fase (Sonnet 5.5 por defecto; Opus 5.5 en hitos justificados; Haiku 5.5 en lo mecánico). *Tamaño* = trabajo relativo (S, M, L, XL); no son fechas. Reglas del repo `agents`: SDD antes de tocar código, un lote y un PR a la vez, y el gasto en APIs, Higgsfield o créditos requiere OK de Ignacio.

---

## 1. Producto en una frase

Un restó-bar escanea un QR por mesa: el comensal ve la carta, pide para sí o para toda la mesa, el mozo también carga pedidos, y las comandas llegan a la cocina y a la barra (pantalla en celular o PC, e impresora). El encargado acepta, cambia y anula, y maneja carta, stock, menú del día, mesas y reservas. **No se cobra nada dentro de la app**: se paga en caja o con el postnet. Eclipse cobra solo una **suscripción mensual o anual al local**. Un personaje de marca acompaña la carta.

---

## 2. Decisiones cerradas

| Tema | Decisión |
|---|---|
| Piloto | Restó-bar generalista con carta completa (tipo Barracuda), quinto comercio. Se vende primero con demos |
| Servicio | Solo salón y reservas. Sin delivery, retiro, propina por la app ni cuenta dividida |
| Cobro del pedido | **Fuera de la app** (caja o postnet). Sin estado «pagado» |
| Quién pide | Comensal (para sí o para toda la mesa) y mozo. Aceptación del encargado **configurable** por el local |
| Salida | Pantalla (celular o PC) **e** impresora. Modelo de impresora: a relevar en el local |
| Salón y equipo | 8 mesas: 3 cuadradas chicas, 2 circulares grandes, 3 rectangulares medianas. 2 en cocina, 1 mozo, 1 encargado, 1 cafetero |
| Estaciones | **Cocina** y **barra** (el cafetero prepara café y tragos) |
| Cambios | El encargado cambia o anula platos; queda registro |
| Stock | El encargado decide si un producto tiene límite; se descuenta solo. El mozo igual avisa en persona |
| Carta | La carga el local. Demo: 11 tipos × 4 productos = 44. Variantes (punto de la carne, sin gluten) y agregados (extra tomate). Fotos con IA. Carta en español e inglés |
| Menú del día | En un modal (dentro de Contact). Happy hour y festividades con cambio de estética: más adelante |
| Reservas | Solicitud que el local confirma. La seña se acuerda por fuera |
| Mayoría de edad | Lo define y verifica el mesero en persona; la app solo muestra un aviso |
| Personajes | Los 20 existentes, con **nombres aprobados**. Los **asigna Eclipse** al local, coherentes con el rubro. Si el local ya tiene mascota, se adapta a medida. Piloto: **Gus (Mesero)** por defecto |
| Juegos | Solo diversión; hay menores. Puntaje para ganar algo que valida el mozo. El local activa los que quiere |
| Datos | Nombre y mesa. El local es responsable; alojados en Neon de Eclipse. **Retención: 12 meses** |
| Suscripción | En pesos atada al dólar: **cotización de referencia del día del alta, actualizada una vez por mes**. Proveedor: Mercado Pago, con Pago Nube y Payway como alternativas |
| Facturación | Eclipse no factura pedidos. La facturación de la suscripción: pendiente |
| Stack | **Next.js con TypeScript estricto** para todo; Neon (Postgres); es/en/pt |
| Dominio | **foody.eclipse-business.com** |
| Marca | «Powered by Eclipse» siempre visible (subtítulo o pie) |
| Soporte | Lo da Ignacio, incluido |
| Presupuesto | USD 100/mes de infraestructura compartida y USD 200/mes en suscripciones (Claude, ChatGPT, Higgsfield, Meshy, ElevenLabs) |
| Estética | Página: **Efemérides** de Eclipse, con hero más chico y rápido. Apps y demos de cada local: identidad propia, sin Efemérides |

---

## 3. Planes (USD/mes, el mismo precio para los 4 comercios y el restó-bar)

| Plan | Precio | Qué incluye |
|---|---|---|
| **Contact** | 30 | Web del local, carta por QR, pedido de comensal y mozo, panel del encargado, pantalla e impresión de comandas, stock, menú del día, solicitud de reserva, CRM básico, personaje en la carta (saludar, anotar, agradecer) |
| **Growth** | 75 | Hereda + 6 juegos solos, premios por puntaje, pasaporte y misiones, Regalos, Estudio, disponibilidad y lista de espera, personaje animado completo |
| **Escalar** | 100 | Hereda + 5 juegos en red (hasta Pinturillo) y Adiviná en la frente, web premium hiperrealista, mundo inmersivo con Higgsfield, tráiler, 3D/RA, plano de mesas y estaciones |
| **Hípergrowth** | 150 | Hereda + analítica por sucursal |
| **Deluxe** | 200 | Hereda + asistente IA interno |
| **Partner** | 500 (propuesta) | Hereda + varias sucursales, permisos y reportes por sucursal |

Referencia, sujeta a costeo. Se muestra como **precio de referencia** en la página, con selector de moneda y sin tachados. Pendientes: pago único del sistema más mantenimiento bajo, costo de alta si lo hubiera, consumos.

**Juegos por plan.** Contact: ninguno. Growth: Serpiente, Vuelo, Saltarín, Catapulta, Ninja y Combinaciones (solos, estables en `games-market`, sin red). Escalar y superiores suman Pong (hockey de mesa), Rompeladrillos, Tetris duelo, Ludo y Pinturillo (en red; hoy en beta y desactivados) y «Adiviná en la frente» (a construir). Hípergrowth, Deluxe y Partner: mismo catálogo que Escalar. El local activa o desactiva cada juego. Fuera por ahora: Invasores, Shooter, Carreras, Corredor, Fútbol, Pool y Espacio.

---

## 4. Los 5 comercios

| Comercio | Referencia | Personajes (nombre) | Particularidades |
|---|---|---|---|
| **Restó-bar (piloto)** | Barracuda | Mesero **Gus** (recomendado), Barracuda **Barry**, Mapache **Rocco** | Carta completa, 8 mesas, cocina y barra, reservas, menú del día |
| Bar | Barracuda | Barry, Cocó, Lula, Rocco, Pizzi | Rondas, cócteles, aviso de mayoría de edad |
| Cervecería | Antares | Robi, Antar, Burgi, Lupi, Bruno | Estilos y tamaños, picadas, aviso de mayoría de edad |
| Café | La Fonte d'Oro | Coli, Dora, Mimi, Gus, Tazzi | Combos, franjas del día, sellos |
| Heladería | Helatto | Nubi, Fru, Pali, Pingo, Rulo | Tamaño y sabores con límite |

Todos solo salón. Las **demos son siempre ficticias** y llevan la etiqueta «Demo»; no pueden parecerse a una marca real. Usar nombre, logo o fotos de una marca real requiere autorización escrita.

---

## 5. La página (foody.eclipse-business.com)

Estética **Efemérides** (observatorio comercial). Hero **más chico y rápido** que el de Eclipse, con H1 y una sola acción en ámbar. Orden: hero → qué ofrecemos para cada tipo de negocio → demos → planes de precios → cómo empezamos → resto de Eclipse → preguntas → contacto. Marcas de sección en mono, Geist, Geist Mono e Instrument Serif; glass solo en el header; zonas de noche que abren a amanecer para leer precios; un ámbar sólido por viewport; es/en/pt; contenido en JSON; movimiento reducido; etiqueta «Demo». El naranja y rojo sobreviven en la corona del eclipse y en la fotografía de comida. Detalle de secciones, copy y partitura de movimiento en la versión anterior del roadmap (`git log`) y en `PROMPT-IMAGENES.md` (tomas E01–E13).

**Demos:** una por comercio (restó-bar ficticio, bar «Neón 21», café «Grano», heladería «Gelato Pop», cervecería a nombrar) con identidad propia. La demo de cada plan crece con su tanda.

---

## 6. Personajes y reacciones

20 personajes con nombre aprobado, 15 acciones y 50 poses clave cada uno (`assets/personajes/`, `personajes.json`). Reacciones por evento: **anotar al bajar la carta** (al cambiar de categoría), saludar al entrar, agradecer al enviar, esperar al preparar, celebrar un premio real, error con acción, pedir la cuenta. Pausa mínima de 8 s entre reacciones; esquina fija sin tapar precios ni botones; éxito solo tras una confirmación real; movimiento reducido = pose quieta. Antes de animar: hoja maestra, limpiar variantes, separar o vectorizar y completar intermedios. Detalle en `PERSONAJES.md`.

---

## 7. Mi Eclipse

Registro, datos de cobro de la suscripción (titular, CUIT, condición frente al IVA, domicilio fiscal, email de facturación, método tokenizado), plan, equipo y soporte; dentro, Academy, Media y Utilería. El acceso se habilita solo con la suscripción acreditada. No hay cobros de pedidos. Detalle en `PORTAL-CUENTA.md`.

---

## 8. Roadmap por tandas

Cada tanda termina con un **hito vendible** probado en un piloto.

### Tanda 0 · Cimientos

| Fase | Entregable | Modelo y esfuerzo | Tamaño |
|---|---|---|---|
| 0.1 Descubrimiento y SDD | **Cerrada** con estas decisiones | Sonnet · medium | S |
| 0.2 Contrato visual de la página | Efemérides aplicada a una página corta y rápida: matriz de animaciones, presupuesto visual por viewport, rúbrica de 14 puntos, hero chico | Opus · high | M |
| 0.3 Personaje piloto | Hoja maestra de **Gus** (y de Barry y Rocco si se quieren), tabla pose↔evento, manifiesto | Opus · high | M |
| 0.4 Lote 1 de imágenes | Hero, previews cenitales, fondos y restó-bar piloto (C01–C10); 44 productos de la carta demo con IA | Sonnet · medium (prompts de producto con Haiku · low) | M |
| 0.5 Arquitectura y repo | ADR con Next.js TypeScript estricto, Neon, roles y permisos, sesión de mesa firmada por QR, **decisión de tiempo real** (conexiones persistentes o alternativa), **decisión de impresión** (formato térmico del navegador o programa local), retención de 12 meses, aislamiento entre locales, suscripciones, i18n, CI | **Opus · xhigh** | L |
| 0.6 Personaje a código | Componente `Companion` con máquina de estados, atlas y manifiesto, galería de prueba, 3 poses piloto | Sonnet · high | M |

### Tanda 1 · **Contact (USD 30)**

**Orden:** primero la página y las demos (hito vendible 1), después el motor, y al final el piloto con un local real.

| Fase | Entregable | Modelo y esfuerzo | Tamaño |
|---|---|---|---|
| 1.1 Página en foody.eclipse-business.com | Secciones de §5, es/en/pt, contenido en JSON, planes con precio de referencia | Sonnet · high (hero con Opus · high) | L |
| 1.2 Demos ×5 | Restó-bar, bar, café, heladería y cervecería ficticios, con carta, pedido y personaje, simulados e identificados | Sonnet · high | L |
| **Hito 1: demo vendible** | | | |
| 1.3 Base del producto | Locales, usuarios y roles, mesas y QR firmado | Sonnet · high; revisión de seguridad Opus · high | L |
| 1.4 Carta y catálogo | Tipos, productos, variantes, agregados, stock con límite, agotados, es/en | Sonnet · high | L |
| 1.5 Pedido del comensal y del mozo | Sesión de mesa, nombre, carrito, enviar, pedir para toda la mesa, cuenta de mesa, pedir la cuenta | Sonnet · high | L |
| 1.6 Estados, concurrencia y stock | Máquina de estados, idempotencia, pruebas de carrera, aceptación configurable, modificación y anulación con auditoría | **Opus · xhigh** | L |
| 1.7 Pantallas e impresión de comandas | Pantalla de cocina y de barra (celular o PC), impresión, sin duplicar | Sonnet · high; Opus · high en impresión | L |
| 1.8 Panel del encargado | Aceptar, cambiar, anular, stock, carta, menú del día, mesas, cierre de mesa | Sonnet · high | L |
| 1.9 Menú del día | Modal con foto, texto y precio | Sonnet · medium | S |
| 1.10 Reservas por solicitud | Formulario, agenda, confirmar, rechazar, reprogramar | Sonnet · high | M |
| 1.11 Personaje en la carta | Saludar, anotar al bajar, agradecer, esperar, pedir la cuenta (Gus) | Sonnet · high | M |
| 1.12 Mi Eclipse v1 | Registro, datos fiscales, suscripción con Mercado Pago, precio en pesos con cotización de referencia mensual, onboarding | **Opus · high** (pagos); Sonnet · high (UI) | L |
| 1.13 Privacidad y retención | Términos, roles de responsable y encargado, anonimización a los 12 meses | Sonnet · medium | S |
| 1.14 Academy, Media y Utilería v1 | Catálogo y pedido simple en el portal | Sonnet · medium | M |
| 1.15 QA y piloto | E2E, carrera de stock, impresión real, 360 px, AA, LCP 2,5 s, CLS 0,1, INP 200 ms como objetivos | **Opus · high** | L |
| **Hito 2: Contact operando en un local** | | | |

**Adaptaciones al resto de comercios** (reusan el motor; solo tema, carta, personaje y particularidades):

| Fase | Comercio | Entregable | Modelo y esfuerzo | Tamaño |
|---|---|---|---|---|
| 1A | Bar | Tema, carta de cócteles y rondas, personaje, aviso de mayoría de edad | Sonnet · high | M |
| 1B | Cervecería | Estilos, tamaños, picadas, personaje, aviso | Sonnet · high | M |
| 1C | Café | Combos, franjas del día, sellos, personaje | Sonnet · high | M |
| 1D | Heladería | Tamaños, sabores con límite, personaje | Sonnet · high | M |

### Tanda 2 · **Growth (USD 75)**

| Fase | Entregable | Modelo y esfuerzo | Tamaño |
|---|---|---|---|
| 2.1 Juegos en la app | Integrar los 6 juegos estables de `games-market` en Next.js; skin con el personaje y contenido gastronómico | Sonnet · high | L |
| 2.2 Premios por puntaje | El local define puntaje y premio; validación del mozo en persona | Sonnet · high | M |
| 2.3 Disponibilidad de juegos | Activar y desactivar cada juego; flags por plan | Sonnet · medium | S |
| 2.4 Pasaporte y misiones | Sellos por visita validada por personal, sin doble sello ni doble canje | Sonnet · high; revisión Opus · high | L |
| 2.5 Regalos y Estudio | Regalos de producto; plantillas de contenido | Sonnet · high | M |
| 2.6 Reservas con disponibilidad | Capacidad, recordatorios, lista de espera | Sonnet · high | M |
| 2.7 Personaje animado | Las 15 acciones ligadas a eventos reales | Sonnet · high | L |
| 2.8 Academy y demo Growth | Rutas por comercio; demo con juegos y pasaporte | Sonnet · medium | M |
| 2.9 QA y piloto | Juegos, canjes, accesibilidad | Opus · high | M |

### Tanda 3 · **Escalar (USD 100)**

| Fase | Entregable | Modelo y esfuerzo | Tamaño |
|---|---|---|---|
| 3.1 Salas en tiempo real | Verificar `peerNet` (P2P) para producción y decidir servicio de salas | **Opus · high** | L |
| 3.2 Juegos en red | Pong (hockey), Rompeladrillos, Tetris duelo, Ludo y Pinturillo; reconexión sin duplicar puntos | Sonnet · high | XL |
| 3.3 Adiviná en la frente | Juego nuevo | Sonnet · high | M |
| 3.4 Web premium | Hiperrealismo, parallax, motion del local | Sonnet · high; dirección Opus · high | L |
| 3.5 Mundo inmersivo | Escena con Higgsfield atada al scroll, con foto fija de respaldo (con OK de gasto) | Opus · high; Sonnet · medium | L |
| 3.6 Tráiler de marca | 30–45 s en Kinetic Studio con el personaje | Opus · high (guion); Sonnet · high | L |
| 3.7 3D / RA | 3 platos piloto con Meshy y visor, probado en dispositivos | Sonnet · medium | M |
| 3.8 Plano de mesas y estaciones | Plano del salón, enrutamiento por estación, demoras | Sonnet · high | M |
| 3.9 Secuencias completas | Las 10 secuencias de 5 poses del personaje | Sonnet · high | L |
| 3.10 Sonido | Efectos y voz con ElevenLabs o WebAudio, apagado por defecto | Sonnet · medium | S |
| 3.11 QA y piloto | Rendimiento en celulares reales, red degradada | Opus · high | M |

### Tandas 4 a 7

| Tanda | Entregable | Modelo y esfuerzo | Tamaño |
|---|---|---|---|
| 4 · Hípergrowth (150) | Embudo, ticket, ocupación, ausencias, tiempos de preparación, canjes y costo de incentivos, sin atribuir causalidad inexistente | Sonnet · high; Opus · high en métricas | L |
| 5 · Deluxe (200) | Asistente IA interno; acciones sensibles confirmadas y registradas; topes de costo | Opus · high | L |
| 6 · Partner (500) | Varias sucursales: permisos, reglas y reportes por sucursal; aislamiento | **Opus · xhigh** | XL |
| 7 · Escala comercial | Incorporar los comercios con su contrato de marca, personaje y juegos; migración de cartas; capacitación en Academy; materiales en Utilería | Sonnet · medium | M |

---

## 9. Aceptación mínima

- Dos pedidos simultáneos no venden la última unidad; un reintento no duplica el pedido.
- El encargado cambia o anula un plato y la estación lo ve en segundos (umbral a fijar).
- Un pedido mixto llega a cada estación y la mesa lo ve completo.
- Nunca se muestra una reserva «confirmada» si solo es solicitud.
- Una mesa o un local nunca ve datos de otro.
- La app no procesa ni menciona pagos de pedidos.
- Si falla personaje, menú del día, juego, 3D o video, la carta y el pedido siguen.
- El personaje no tapa precios ni botones; éxito solo tras confirmación real.
- Un sello o canje no se otorga dos veces; el puntaje del navegador no acredita premios por sí solo.
- AA, 360 px sin scroll horizontal, movimiento reducido y etiqueta «Demo»; si se ve peor que la línea base, no se mergea.

---

## 10. Riesgos

| Riesgo | Mitigación |
|---|---|
| Tiempo real en Next.js (funciones sin conexiones largas) | ADR en 0.5: servicio de conexiones persistentes o alternativa para las comandas |
| Impresión de comandas desde la web | Probar con la impresora real; formato térmico del navegador o programa local |
| Mercado Pago: monto atado al dólar | Verificar antes de 1.12 que permita actualizar el monto cada mes; si no, evaluar Pago Nube |
| Juegos en red en beta | No se venden hasta superar 3.1 y 3.2 |
| Personajes sin producción | 0.3 y 0.6 antes de animar; no se promete animación fluida con las láminas |
| Datos de comensales | Local responsable, Eclipse encargado, 12 meses, términos |
| Demo que parezca un cliente real | Etiqueta «Demo», marcas ficticias |
| Alcohol y menores | Aviso en la app; verificación del mesero; sin premios con alcohol |

---

## 11. Pendientes no bloqueantes (defaults propuestos; se cierran si no se objeta)

- **Personaje del piloto:** Gus (Mesero). Barry o Rocco como alternativas.
- **Cotización del dólar:** oficial vendedor del día del alta; se actualiza una vez por mes. Reutilizar la fuente de cotizaciones de Eclipse-Web.
- **Aceptación del encargado:** configurable por local («sip»).
- **Reservas:** turnos y duración configurables por el encargado; la seña se anota como dato informativo.
- **Stock con límite:** se reinicia a mano o cada día, a elegir por producto.
- **Carta en inglés:** traducida con IA y revisada por el encargado.
- **Premios de juegos:** el local define puntaje y premio; ejemplo: un postre al llegar a un puntaje.
- **Facturación de la suscripción de Eclipse:** a definir con el contador.
- **Pago único del sistema más mantenimiento:** pendiente de costeo.
- **Modelo de impresora:** a relevar en el local.
