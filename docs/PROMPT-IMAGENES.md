# Prompt completo para generar las imágenes de Foody

Cómo usarlo con ChatGPT:
1. Pegar el **BLOQUE MAESTRO**.
2. Pegar el **BLOQUE DE COMERCIO** del comercio que se va a trabajar (un chat por comercio, para no mezclar estilos).
3. Pedir las tomas de a una con el prompt de cada una. Para variantes, "otra versión con la misma composición".

Las imágenes son **referencia de dirección visual**: no son capturas publicables. Los textos reales van en HTML. Referencias del estilo ya aprobado: `assets/referencias/`. Las usamos como guía, **no se copian literal**.

---

## 1. BLOQUE MAESTRO (pegar primero)

```
Sos director de arte de una plataforma SaaS ultra premium para comercios gastronómicos (cervecerías, bares, cafés y heladerías) de Mar del Plata, Argentina. Producto: carta digital y pedido desde la mesa con QR, reservas, juegos para la mesa, pasaporte de fidelidad, visor 3D y personajes de marca. La plataforma se llama Foody y siempre lleva la firma "Powered by Eclipse" (Eclipse es el ecosistema de servicios para negocios).

NIVEL: hiperrealista, cinematográfico, premium, nivel Apple / Awwwards. Render 4K, nitidez alta, profundidad de campo corta, iluminación de estudio y ambiente.

SITIO COMERCIAL (Foody): negro cálido (#0B0605) con grandes manchas de luz difusas muy desenfocadas en naranja (#FF6A1A) y rojo (#E5231B), toques de ámbar (#FFB347), grano de película sutil. Interfaz en glassmorphism: vidrio esmerilado translúcido, blur fuerte, borde luminoso de 1 px, reflejo especular arriba, sombras profundas, esquinas muy redondeadas (24-32 px). Títulos en serif editorial de alto contraste, interfaz en sans geométrica, texto crema (#FFF3E6). Detalle de marca: pequeño badge "Powered by Eclipse" con un glifo de eclipse (disco oscuro con corona dorada #F5B942).

APP DE CADA COMERCIO: NO usa glass ni brasas. Toma la paleta, tipografía, ambiente y personaje del comercio (bloque de comercio).

COMIDA Y BEBIDA: hiperrealista, luz lateral cálida, vapor, brillos, condensación, texturas reales, nada de aspecto plástico. Vistas cenitales (desde arriba) de barras, mesas y mostradores con composición impecable.

REGLAS: sin texto legible inventado ni deformado (usar barras grises de relleno donde iría texto); sin logos de marcas reales; sin manos ni caras deformes; personas solo si se pide, naturales; mismo diseño del personaje en todas las vistas; mucho aire y jerarquía clara.

Respondé solo con la imagen cuando te pida cada toma.
```

---

## 2. BLOQUES DE COMERCIO (pegar el que corresponda)

### Cervecería (referencia: Antares)
```
COMERCIO: cervecería artesanal. Ambiente: bodega de madera, barriles con aros de hierro, canillas de cobre, vasos de cerveza con espuma cremosa y condensación. Paleta: cobre #B5651D, ámbar #E8A33D, azul noche #14213D, crema #F6EBD3. Tipografía: serif robusta + sans condensada. Comida: hamburguesas, papas, pretzels, picadas en tabla. Personaje a elegir (uno por local): barril robot, escorpión estelar, hamburguesa, lúpulo, oso cervecero. Mundo inmersivo: bodega nocturna con cielo estrellado y viñedos.
```

### Bar (referencia: Barracuda)
```
COMERCIO: bar de cócteles. Ambiente: barra de mármol oscuro, botellas iluminadas, hielo cristalino, neón azul eléctrico y luz ámbar. Paleta: negro #0A0F1F, azul eléctrico #2F6BFF, ámbar #F5B942, plata #C9D1E0. Tipografía: sans condensada en mayúsculas + serif fina. Comida y bebida: cócteles con garnish, tragos largos, pizzas, tapeo. Personaje a elegir: barracuda, copa de cóctel, luna, mapache, pizza. Mundo inmersivo: puerto y mar al atardecer.
```

### Café (referencia: La Fonte d'Oro)
```
COMERCIO: café y confitería clásica. Ambiente: salón de mármol y columnas, fuente, dorados, plantas, luz cálida de la tarde. Paleta: dorado #C8A24B, crema #F7EFD9, verde bosque #1F4D3A, café #4A2C1A. Tipografía: serif clásica + sans humanista. Comida: café con latte art, medialunas, tostadas, tortas, combos de merienda. Personaje a elegir: colibrí, gota dorada, medialuna, mesero, taza. Mundo inmersivo: salón dorado con fuente de mármol.
```

### Heladería (referencia: Helatto)
```
COMERCIO: heladería artesanal. Ambiente: heladera de cubas con sabores, mostrador luminoso, cucuruchos, frutas frescas. Paleta pastel vibrante: frutilla #FF6B81, menta #8FE3C0, limón #FFE066, crema #FFF6E5, cacao #5A3825. Tipografía: redondeada y lúdica. Comida: cucuruchos, copas, palitos, helados con salsas y frutas. Personaje a elegir: cono nube, frutilla, palito helado, pingüino, remolino. Mundo inmersivo: paisaje de sabores con ríos de crema y frutilla.
```

---

## 3. TOMAS DEL SITIO COMERCIAL (glass + brasas + Powered by Eclipse)

Para cada una: **prompt** y **cómo se vería**.

**S01 · Hero escritorio 16:9**
Prompt: *Hero de landing. Vista cenital hiperrealista de una barra de restaurante oscura con luces cálidas desenfocadas; en el centro-derecha un plato de autor flotando levemente con vapor; a la izquierda un panel de vidrio con titular serif grande (barras de relleno) y dos botones, uno naranja luminoso con ícono de canasta y otro solo borde con ícono de campana. Un celular de vidrio a la derecha con la carta digital. Abajo a la izquierda, discreto, "Powered by Eclipse" con el glifo.*
Se vería: portada cinematográfica, brasas desenfocadas de fondo, el plato como protagonista, vidrio con reflejos. En la web: el plato y el celular flotan con parallax y el vapor se anima.

**S02 · Hero móvil 9:16**
Prompt: *Misma composición vertical: plato arriba, panel de vidrio inferior con titular y botón, badge Powered by Eclipse al pie.*
Se vería: portada de celular a pantalla completa con el CTA al alcance del pulgar.

**S03 · Cómo funciona (5 pasos)**
Prompt: *Cinco celulares de vidrio en diagonal con profundidad sobre una mesa hiperrealista: 1) escaneo de QR en el soporte de mesa, 2) carta con fotos, 3) carrito, 4) "preparando" con barra de progreso, 5) "entregado" con check. Una línea de luz naranja los une. En cada uno, un personaje pequeño reaccionando.*
Se vería: secuencia horizontal; en la web, scroll con pin donde cada paso se enciende y el personaje cambia de pose.

**S04 · Elegí tu comercio (4 tarjetas)**
Prompt: *Cuatro tarjetas de vidrio 2×2: cervecería (pinta con espuma), bar (cóctel con hielo), café (latte art), heladería (cucurucho de tres bolas). Cada una con foto hiperrealista, el personaje asomando y barras de texto. Una con borde luminoso naranja.*
Se vería: selector; al tocar una, el sitio cambia su paleta a la del comercio.

**S05 · Vista cenital de barra (fondo hiperrealista)**
Prompt: *Vista cenital hiperrealista de una barra: vasos, hielo, botellas, tabla de picada, manos del bartender sirviendo (naturales), luces cálidas. Espacio libre en el centro para texto. Una versión por comercio.*
Se vería: fondo de sección con profundidad; se anima con un leve desplazamiento por scroll.

**S06 · Conocé a tu personaje**
Prompt: *Panel de vidrio con la grilla de los 5 personajes de un comercio sobre fondo liso, uno seleccionado con borde naranja y tres globos de acción (saludar, anotar, celebrar). Debajo, botones "Elegir".*
Se vería: selector de personaje; en la web cada uno hace su saludo al pasar el cursor.

**S07 · Pedido desde la mesa**
Prompt: *Mano natural sosteniendo un celular sobre una mesa hiperrealista con platos reales; carta con fotos, variantes y botón Agregar; el personaje en la esquina anotando.*
Se vería: mockup principal del flujo de pedido.

**S08 · Panel del comercio**
Prompt: *Dashboard de vidrio con columnas Nuevo / Preparando / Listo / Entregado, tarjetas con foto del plato y número de mesa, plano cenital del salón con mesas iluminadas y gráficos en naranja y rojo. Fondo de salón desenfocado.*
Se vería: panel con cola por estación y plano; se anima la entrada de pedidos.

**S09 · Juegos de mesa**
Prompt: *Cuatro celulares alrededor de una mesa vista desde arriba, cada uno con un mini-juego distinto y el personaje; vasos y platos reales en la mesa; partículas de luz.*
Se vería: sección de juegos jugables; los celulares reaccionan al toque.

**S10 · Pasaporte y Regalos**
Prompt: *Tarjeta de vidrio con grilla de sellos circulares con el personaje (algunos sellados, otros punteados), barra de progreso y un postre con vela como premio.*
Se vería: los sellos se estampan con animación al llegar a la sección.

**S11 · Visor 3D / RA**
Prompt: *Plato 3D fotorrealista sobre una mesa real vista desde el celular, anillo de luz y medidas de escala, botón de vidrio "Ver sobre mi mesa".*
Se vería: visor que gira; abre la cámara en dispositivos compatibles.

**S12 · PLANES (seis tarjetas con precios)**
Prompt: *Seis tarjetas de vidrio sobre brasas y una mesa oscura con platos desenfocados. Tarjeta 1 "Contact" USD 30, 2 "Growth" USD 75 destacada con borde naranja luminoso y etiqueta "Más elegido", 3 "Escalar" USD 100, 4 "Hípergrowth" USD 150, 5 "Deluxe" USD 200, 6 "Partner" USD 500. Precio grande en serif; cinco ítems con check (barras de relleno) y un botón. Las tres primeras más grandes. Toggle mensual/anual arriba. Badge Powered by Eclipse abajo.*
Se vería: tabla de planes con hover que levanta la tarjeta y "Qué incluye" que se despliega.

**S13 · Eclipse Academy, Media y Utilería**
Prompt: *Tres módulos de vidrio flotando: Academy (curso con play y barra de progreso), Media (render 3D de plato y clip), Utilería (soporte QR de mesa, carta física y pasaporte con sellos). Íconos de línea fina dorada, estética Eclipse (negro y dorado #F5B942).*
Se vería: sección de servicios con tres tarjetas que se abren al pasar el cursor.

**S14 · CTA final**
Prompt: *Gran panel de vidrio centrado con titular, botón naranja, WhatsApp y "Powered by Eclipse", sobre brasas intensas y una mesa desenfocada.*

---

## 4. TOMAS DEL PORTAL "MI ECLIPSE" (estética Eclipse: negro #05050A, dorado #F5B942, crema #F4EFE6; acentos del comercio)

**P01 · Registro** — *Pantalla de registro de dos columnas: a la izquierda el formulario (email, contraseña, botón dorado) y a la derecha una vista hiperrealista de una barra con el personaje saludando. Pasos arriba (1 Cuenta, 2 Negocio, 3 Plan, 4 Personaje, 5 Pago).* Se vería: alta guiada con barra de progreso.

**P02 · Elegir comercio** — *Cuatro tarjetas grandes (cervecería, bar, café, heladería) con foto hiperrealista y su paleta.*

**P03 · Elegir personaje** — *Grilla de 5 personajes del comercio, uno seleccionado, con vista previa grande en un panel a la derecha que muestra tres poses.*

**P04 · Elegir plan y pagar** — *Resumen del plan elegido a la derecha (precio, qué incluye, total hoy y por mes) y a la izquierda el formulario de datos de cobro: titular, CUIT, condición frente al IVA, domicilio fiscal, email de facturación y método de pago tokenizado (campos con barras de relleno).*

**P05 · Inicio** — *Dashboard con checklist de onboarding, estado de la suscripción, próximo cobro, pedidos de hoy y el personaje saludando en una tarjeta.*

**P06 · Cuenta y facturación** — *Pestañas Cuenta / Plan / Pago / Facturas / Equipo; tabla de comprobantes con estado (acreditado, pendiente, fallido) y botón de descargar.*

**P07 · Editor de carta** — *Lista de categorías a la izquierda, productos con foto a la derecha, panel lateral de variantes y agregados, interruptores de disponibilidad.*

**P08 · Pedidos y mesas** — *Kanban de pedidos y plano cenital de mesas con QR.*

**P09 · Eclipse Academy** — *Portada con "Continuar donde lo dejaste", rutas por comercio como tarjetas con progreso, y una lección abierta con video, guía y ejercicio; el personaje como guía.*

**P10 · Eclipse Media** — *Catálogo de packs con previews (render 3D de plato, tráiler, fotos), y una orden abierta con brief, estado (brief, producción, revisión, aprobado) y comentarios sobre la pieza.*

**P11 · Utilería** — *Catálogo de soporte QR, cartas, pasaportes, sellos, carteles y bandejas con vista previa personalizada con el logo y el personaje; botón "Cotizar".*

---

## 5. TOMAS POR COMERCIO (repetir con cada bloque de comercio, SIN glass)

| ID | Toma | Prompt base |
|---|---|---|
| C01 | Home móvil | *Pantalla de inicio de la web del comercio en un celular: header con logo y personaje, imagen hero hiperrealista, categorías, botón de pedir. Estética del comercio, sin glass. Pie con "Powered by Eclipse".* |
| C02 | Carta móvil | *Carta con pestañas de categorías, listado de productos con foto hiperrealista y botón +. Personaje fijo junto a las categorías.* |
| C03 | Logo viajero (storyboard de 4 cuadros) | *Cuatro cuadros verticales: logo completo en el header; al bajar se achica a emblema; pasa a personaje fijo; el personaje anota o consume al agregar un producto. Mismo diseño en los cuatro.* |
| C04 | Ficha de producto | *Producto en grande, variantes, agregados, botón de agregar, personaje reaccionando.* |
| C05 | Panel del comercio | *Panel de escritorio con la estética del comercio: cola de pedidos, mesas, gráficos.* |
| C06 | Cenital hiperrealista | *Vista cenital de la barra, mesa o mostrador del comercio, composición limpia con espacio central libre.* |
| C07 | Mundo inmersivo | *Escena amplia del mundo del comercio con el personaje pequeño en primer plano y centro libre para la carta.* (para Higgsfield) |
| C08 | Producto estrella (recorte) | *Producto hero sobre fondo liso o transparente, iluminación de estudio, para 3D y carta.* |
| C09 | Utilería | *Soporte QR de mesa, carta física, pasaporte con sellos y posavasos del comercio con su personaje, sobre una mesa real.* |
| C10 | Reserva | *Pantalla de solicitud de reserva con día, hora y personas, en la estética del comercio.* (no aplica a heladería) |

Total: 4 comercios × 10 tomas = 40 imágenes.

---

## 6. ASSETS INDIVIDUALES (fondos, recortes, íconos)

**Fondos** (pedir 16:9 y 9:16, sin texto, con zona central de baja carga visual):
- Brasas naranja, rojas y ámbar desenfocadas (3 manchas sueltas, fondo transparente o negro).
- Grano de película y textura de papel.
- Un fondo por comercio: madera y barriles; barra azul con hielo; mármol dorado; mostrador pastel.

**Recortes individuales** (fondo liso, luz de estudio, sombra suave): 6 platos y bebidas por comercio (24 en total); ingredientes sueltos (lúpulo, frutillas, granos de café, hielo, cerezas, hojas de menta, salsas); vasos, copas, tazas y cucuruchos vacíos.

**Mockups físicos:** soporte QR de mesa, tarjeta de pasaporte, carta física, sello, posavasos, bandeja y delantal con el personaje.

**Íconos** (pedir como **código SVG**, trazo de 2 px, estilo línea redondeada, sin relleno salvo acento): categorías de carta (cerveza, cóctel, café, helado, hamburguesa, pizza, medialuna, picada), estados del pedido (recibido, preparando, listo, entregado), juegos (dibujo, frente, hockey, trivia, memoria, letras, premio), acciones (QR, reserva, cuenta, campana).

> Los personajes y fondos complejos salen como imagen; para usarlos como SVG se vectorizan y limpian después. Los íconos simples sí pueden salir directamente como SVG.

---

## 7. PERSONAJES

Las 20 láminas ya existen en `assets/personajes/`. Para producción:
```
Tomá la lámina de referencia de [PERSONAJE] y generá su HOJA MAESTRA: vistas frontal, 3/4, perfil y espalda; paleta con códigos HEX; una cara en primer plano; proporciones. Fondo liso claro, contornos consistentes, colores planos con sombreado mínimo. Mantené exactamente el diseño. Sin texto legible.
```
Luego, por personaje, pedir las poses sueltas separadas (fondo liso, mismo tamaño de celda) de: saludar, anotar pedido, agradecer, esperar, celebrar y error. Esas se limpian y pasan a atlas o SVG por capas antes de animar.

---

## 8. ORDEN DE PRODUCCIÓN SUGERIDO

1. Fondos y brasas (1 vez).
2. Sitio comercial S01–S14 (1 vez).
3. Portal P01–P11 (1 vez).
4. Comercio piloto: C01–C10.
5. Resto de comercios, tanda por tanda (ver `ROADMAP.md`).
6. Hojas maestras y poses limpias de los personajes elegidos.
