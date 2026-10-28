# Prompt completo de imágenes · Eclipse para locales de comida · v4 (estética Efemérides)

Cómo usarlo con ChatGPT:
1. Pegar el **BLOQUE MAESTRO** (sirve para la página de Eclipse y el portal).
2. Para las tomas de un comercio, pegar además su **BLOQUE DE COMERCIO**. Un chat por comercio para no mezclar estilos.
3. Pedir las tomas de a una. Para variantes: «otra versión con la misma composición».

Las imágenes son **referencia de dirección visual**, no capturas publicables. Las del pack anterior (`assets/referencias/`) sirven de guía y **no se copian literal**: ese pack usaba glass y brasas; ahora la página es Efemérides. Los textos reales van en HTML.

---

## 1. BLOQUE MAESTRO (pegar primero)

```
Sos director de arte de «Eclipse para locales de comida», un producto de Eclipse (estudio de tecnología, IA y creatividad para negocios) para cervecerías, bares, cafés y heladerías de Mar del Plata, Argentina. El producto: carta digital y pedido desde la mesa con QR, reservas, juegos para la mesa, pasaporte de fidelidad, visor 3D y un personaje de marca por local.

DIRECCIÓN DE ARTE «EFEMÉRIDES» — «observatorio comercial». Un almanaque astronómico hecho producto: la luz de un eclipse revela cosas concretas. Premium, sobrio, editorial, preciso.

PALETA (usar solo esta en la página de Eclipse): noche #05050A y #0C0C14; superficies #1A1A24; corona ámbar #F5B942; destello #FFE8B0; amanecer #F4EFE6; tinta #111114; gris niebla #9A97A6. Calor naranja y rojo solo como luz de brasa en la corona del eclipse y sobre la comida.

TIPOGRAFÍA (para maquetas): sans geométrica (estilo Geist) para interfaz; monoespaciada (estilo Geist Mono) para índices, números, unidades y precios; serif display itálica (estilo Instrument Serif) como acento editorial, una vez por pantalla.

LENGUAJE VISUAL: líneas de 1 px de precisión, glifos de fases de la luna, retículas y marcas de medición como en una tabla de efemérides, polvo de estrellas, corona solar con halo. Zonas oscuras (noche) que abren a zonas claras (amanecer) para leer precios. Un solo punto ámbar de énfasis por imagen. NADA de glassmorphism en tarjetas, nada de blur de pantalla completa, nada de tarjetas genéricas repetidas, nada de emojis.

COMIDA Y BEBIDA: hiperrealista, luz lateral cálida que viene de la corona o de brasas, vapor, brillos, condensación, texturas reales, profundidad de campo corta. Vistas cenitales (desde arriba) de barras, mesas y mostradores con composición impecable.

REGLAS: sin texto legible inventado ni deformado (usar barras o líneas finas donde iría texto); sin logos de marcas reales; los negocios son ficticios; sin manos ni caras deformes; mismo diseño del personaje en todas las vistas; mucho aire y jerarquía clara. Render 4K, nitidez alta.

Respondé solo con la imagen cuando te pida cada toma.
```

---

## 2. TOMAS DE LA PÁGINA «ECLIPSE PARA LOCALES DE COMIDA»

Para cada una: **prompt** y **cómo se vería** (con la animación prevista).

**E01 · Hero escritorio 16:9** (sección 01)
Prompt: *Un eclipse solar total sobre un cielo nocturno profundo, con corona ámbar que vira a naranja cálido en los bordes y destellos finos. Abajo, en primer plano, un plato de autor hiperrealista iluminado únicamente por la luz de la corona, con vapor. A la izquierda, un espacio libre de composición para titular, con una línea de 1 px y una marca de sección en monoespaciada (solo barras). Estrellas finas y retícula tenue. Un solo botón ámbar sólido como acento. Sin glass, sin tarjetas.*
Se vería: portada cinematográfica. En la web, el eclipse cubre y descubre el plato una sola vez, las estrellas hacen parallax y el vapor se repite en un loop corto que se pausa fuera de pantalla.

**E02 · Hero móvil 9:16** — *Misma composición vertical: eclipse arriba, plato al centro, espacio de titular y botón ámbar abajo.* Se vería: portada de celular con el CTA al alcance del pulgar.

**E03 · Índice «Qué ofrecemos» con preview activo** (sección 02)
Prompt: *Maqueta de pantalla oscura con una lista de cuatro líneas en monoespaciada separadas por filas de 1 px (cervecería, bar, café, heladería; como barras), una fila activa con un punto ámbar y una flecha, y a la derecha un gran preview con una vista cenital hiperrealista de una barra de cervecería. Debajo del preview, tres líneas finas de «qué incluye» y un pequeño personaje asomando. En el borde inferior, una fila apagada «Restaurantes: próximamente».*
Se vería: al pasar de una línea a otra cambia el preview con un fundido de 180 a 240 ms. En móvil es una lista plegable de una columna.

**E04–E07 · Previews cenitales** (uno por comercio, 16:10; misma composición, distinto contenido)
Prompt base: *Vista cenital hiperrealista de [barra de cervecería con vasos de cerveza, tabla de picada y canillas de cobre / barra de bar con cócteles, hielo y coctelera / mesa de café con latte art, medialunas y una taza / mostrador de heladería con cubas de helado y cucuruchos]. Luz cálida lateral, composición limpia, espacio libre arriba a la izquierda.*
Se vería: el preview del índice y el fondo de cada demo; se desplaza apenas con el scroll.

**E08 · Demos (sección 03)**
Prompt: *Cuatro celulares en fila sobre cielo nocturno con luz de corona desde arriba. Cada celular muestra la home de un local con una identidad totalmente distinta (cervecería en cobre y ámbar, bar en azul eléctrico, café en kraft y verde, heladería en pasteles). Sobre cada uno, una pequeña etiqueta de línea fina (barra) tipo «Demo». Un personaje distinto asoma por el borde de cada celular.*
Se vería: cuatro entradas a las demos; al tocar una, se abre la capa a pantalla completa «hacia la luz», con «Saltar» siempre visible.

**E09 · Elegí tu personaje**
Prompt: *Placa clara (amanecer #F4EFE6) con una grilla de 5 personajes de un comercio sobre fondo liso, uno seleccionado con un punto ámbar y una línea de 1 px, y tres globos de acción (saludar, anotar, celebrar). Marcas de medición en los bordes.*
Se vería: dentro de cada demo y en el alta; cada personaje hace su saludo al pasar el cursor.

**E10 · Planes de precios — libro de efemérides (sección 04)**
Prompt: *Una tabla de almanaque astronómico sobre papel de amanecer (#F4EFE6): seis filas separadas por líneas de 1 px; en cada una, a la izquierda un glifo de fase de la luna (de luna nueva a luna llena, una por plan), el nombre del plan en serif itálica (Contact, Growth, Escalar, Hípergrowth, Deluxe, Partner), a la derecha el precio en monoespaciada grande (USD 30, 75, 100, 150, 200, 500; si no salen bien, usar barras) y tres marcas finas de qué incluye. La fila Growth destacada con un punto ámbar. Arriba un conmutador mensual/anual y un selector de moneda (barras). Márgenes generosos, tinta #111114 sobre papel.*
Se vería: la transición de noche a amanecer termina en esta tabla; las filas se encienden al entrar, el glifo cambia de fase por plan, y cada fila abre «Ver demo de este plan» y «Pedir este plan».

**E11 · Cómo empezamos (sección 05)** — *Tres pasos sobre papel de amanecer unidos por una línea de precisión con un punto ámbar que avanza: elegir comercio y personaje, cargar la carta, imprimir el QR. Íconos de línea fina.*

**E12 · Y lo demás de Eclipse (sección 06)** — *Tres láminas de línea fina en tinta sobre papel: Academy (curso con barra de progreso), Media (cuadro de render 3D de plato), Utilería (soporte QR de mesa y tarjeta de pasaporte). Un punto ámbar por lámina. Estética de plano técnico.*

**E13 · Cierre en amanecer (sección 08)** — *El eclipse termina y sale el sol sobre una mesa de local con luz de mañana; plato servido; mucho aire; espacio para un titular y un botón ámbar.* Se vería: el eclipse se retira y la luz sube.

---

## 3. BLOQUES DE COMERCIO

### Cervecería (referencia: Antares)
```
COMERCIO: cervecería artesanal (negocio ficticio, no se parece a una marca real). Estética propia de su app, SIN el estilo Efemérides. Ambiente: bodega de madera, barriles con aros de hierro, canillas de cobre, vasos con espuma cremosa y condensación. Paleta: cobre #B5651D, ámbar #E8A33D, azul noche #14213D, crema #F6EBD3. Tipografía: serif robusta + sans condensada. Comida: hamburguesas, papas, pretzels, picadas. Personaje a elegir (uno por local): barril robot, escorpión estelar, hamburguesa, lúpulo, oso cervecero. Mundo inmersivo: bodega nocturna con cielo estrellado y viñedos.
```

### Bar (referencia: Barracuda)
```
COMERCIO: bar de cócteles (ficticio). Estética propia de su app, SIN Efemérides. Ambiente: barra de mármol oscuro, botellas iluminadas, hielo cristalino, neón azul eléctrico y luz ámbar. Paleta: negro #0A0F1F, azul eléctrico #2F6BFF, ámbar #F5B942, plata #C9D1E0. Tipografía: sans condensada en mayúsculas + serif fina. Comida y bebida: cócteles con garnish, tragos largos, pizzas, tapeo. Personaje a elegir: barracuda, copa de cóctel, luna, mapache, pizza. Mundo inmersivo: puerto y mar al atardecer.
```

### Café (referencia: La Fonte d'Oro)
```
COMERCIO: café y confitería clásica (ficticio). Estética propia de su app, SIN Efemérides. Ambiente: salón de mármol y columnas, fuente, dorados, plantas, luz cálida de la tarde. Paleta: dorado #C8A24B, crema #F7EFD9, verde bosque #1F4D3A, café #4A2C1A. Tipografía: serif clásica + sans humanista. Comida: café con latte art, medialunas, tostadas, tortas, combos de merienda. Personaje a elegir: colibrí, gota dorada, medialuna, mesero, taza. Mundo inmersivo: salón dorado con fuente de mármol.
```

### Heladería (referencia: Helatto)
```
COMERCIO: heladería artesanal (ficticia). Estética propia de su app, SIN Efemérides. Ambiente: heladera de cubas con sabores, mostrador luminoso, cucuruchos, frutas frescas. Paleta pastel vibrante: frutilla #FF6B81, menta #8FE3C0, limón #FFE066, crema #FFF6E5, cacao #5A3825. Tipografía: redondeada y lúdica. Comida: cucuruchos, copas, palitos, helados con salsas y frutas. Personaje a elegir: cono nube, frutilla, palito helado, pingüino, remolino. Mundo inmersivo: paisaje de sabores con ríos de crema y frutilla.
```

---

## 4. TOMAS POR COMERCIO (repetir con cada bloque; SIN Efemérides): 4 × 10 = 40

| ID | Toma | Prompt base |
|---|---|---|
| C01 | Home móvil | *Pantalla de inicio de la web del local en un celular: header con logo y personaje, hero hiperrealista, categorías, botón de pedir. Estética del comercio. Pie discreto «Powered by Eclipse».* |
| C02 | Carta móvil | *Pestañas de categorías, productos con foto hiperrealista y botón +. Personaje fijo junto a las categorías.* |
| C03 | Logo viajero (4 cuadros verticales) | *Logo completo en el header; al bajar se achica a emblema; pasa a personaje fijo; el personaje anota o consume al agregar un producto. Mismo diseño en los cuatro.* |
| C04 | Ficha de producto | *Producto en grande, variantes, agregados, botón de agregar, personaje reaccionando.* |
| C05 | Panel del local | *Panel de escritorio con la estética del comercio: cola de pedidos, mesas, gráficos.* |
| C06 | Cenital hiperrealista | *Barra, mesa o mostrador del comercio, composición limpia con centro libre.* |
| C07 | Mundo inmersivo | *Escena amplia del mundo del comercio, personaje pequeño en primer plano, centro libre para la carta (para Higgsfield).* |
| C08 | Producto estrella (recorte) | *Producto hero sobre fondo liso o transparente, luz de estudio, para 3D y carta.* |
| C09 | Utilería | *Soporte QR de mesa, carta física, pasaporte con sellos y posavasos con su personaje, sobre una mesa real.* |
| C10 | Reserva | *Solicitud con día, hora y personas en la estética del comercio.* (No aplica a heladería.) |

---

## 5. TOMAS DEL PORTAL «MI ECLIPSE» (Efemérides: noche y amanecer, ámbar, mono; acentos del comercio)

| ID | Prompt resumido | Cómo se vería |
|---|---|---|
| P01 Registro | Dos columnas: formulario en papel de amanecer (barras, botón ámbar) y a la derecha una barra hiperrealista con el personaje saludando; pasos arriba en monoespaciada: Cuenta, Negocio, Plan, Personaje, Pago | Alta guiada con progreso |
| P02 Elegir comercio | Cuatro filas en monoespaciada con preview cenital a la derecha | Selección con vista previa |
| P03 Elegir personaje | Grilla de 5, uno seleccionado, vista previa grande con tres poses | El personaje saluda, anota y celebra |
| P04 Plan y pago | Resumen del plan (precio, qué incluye, total hoy y por mes) y formulario de cobro: titular, CUIT, condición IVA, domicilio fiscal, email de facturación, método tokenizado | Checkout claro |
| P05 Inicio | Checklist de onboarding, suscripción, próximo cobro, pedidos de hoy, personaje saludando | Tablero de arranque |
| P06 Cuenta y facturación | Pestañas Cuenta, Plan, Pago, Facturas, Equipo; tabla de comprobantes con estado | Historial descargable |
| P07 Editor de carta | Categorías a la izquierda, productos con foto, panel de variantes, interruptores de disponibilidad | Edición rápida |
| P08 Pedidos y mesas | Kanban y plano cenital de mesas con QR | Operación en vivo |
| P09 Eclipse Academy | «Continuar donde lo dejaste», rutas con progreso, lección con video, guía y ejercicio | Biblioteca de aprendizaje |
| P10 Eclipse Media | Catálogo de packs y orden abierta con estados y comentarios | Seguimiento de producción |
| P11 Utilería | Soporte QR, cartas, pasaportes, sellos, carteles y bandejas con vista previa personalizada; botón Cotizar | Catálogo físico |

---

## 6. ASSETS INDIVIDUALES

- **Fondos 16:9 y 9:16**, sin texto, con zona central liviana: cielo de eclipse con corona (3 variantes: total, parcial, amanecer); polvo de estrellas; papel de amanecer; y uno por comercio (madera y barriles; barra azul con hielo; mármol dorado; mostrador pastel).
- **Recortes** (fondo liso o transparente, luz de estudio, sombra suave): 6 platos y bebidas por comercio (24); ingredientes sueltos; vasos, copas, tazas y cucuruchos vacíos.
- **Mockups físicos:** soporte QR de mesa, tarjeta de pasaporte, carta, sello, posavasos, bandeja y delantal con el personaje.
- **Íconos como código SVG** (trazo de 1,5 a 2 px, línea redondeada, un punto ámbar): categorías de carta, estados del pedido, juegos, acciones, **glifos de las seis fases de la luna** para los planes.
- Los personajes y fondos complejos salen como imagen; para usarlos como SVG se vectorizan y limpian después.

---

## 7. PERSONAJES (hoja maestra y poses)

Las 20 láminas ya existen en `assets/personajes/`. Para producción:
```
Tomá la lámina de referencia de [PERSONAJE] y generá su HOJA MAESTRA: vistas frontal, 3/4, perfil y espalda; paleta con códigos HEX; una cara en primer plano; proporciones. Fondo liso claro, contornos consistentes, colores planos con sombreado mínimo. Mantené exactamente el diseño. Sin texto legible.
```
Luego, por personaje, las poses sueltas (fondo liso, mismo tamaño de celda): saludar, anotar pedido, agradecer, esperar, celebrar y error. Se limpian y pasan a atlas o SVG por capas antes de animar.

---

## 8. ORDEN DE PRODUCCIÓN

1. Fondos y eclipse (una vez). 2. Página E01 a E13. 3. Portal P01 a P11. 4. Comercio piloto C01 a C10. 5. Resto de comercios, tanda por tanda. 6. Hojas maestras y poses limpias de los personajes elegidos.
