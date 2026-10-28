# La carta de Gus · experiencia del comensal

Estado: **propuesta con prototipo** · 28/10/2026 · Modelo: `claude-opus-5-5` · esfuerzo `high`.
Prototipo navegable: `prototipos/carta-gus/index.html` (y publicado como artifact privado «La carta de Gus»).
Forma parte de las fases **0.3** (personaje piloto), **0.6** (personaje a código), **1.2** (demo) y **1.11** (personaje en la carta).

---

## 1. La referencia y qué tomamos

**Referencia (video de @magui.dev, web de la hamburguesería FINO):** la mascota está sentada sobre el logo con un globo («¿Tenés hambre, tesoro?»); al bajar se **desprende del logo**, cae a una columna fija a la izquierda sobre un fondo de cuadrillé, y en cada sección de la carta **consume** lo de esa sección (hamburguesa, papas, milkshake) con un globo propio.

**Qué tomamos:** el desprendimiento del logo, la columna fija con el personaje, una reacción por sección y los globos cortos.
**Qué no tomamos:** la marca, la mascota ni el estilo de FINO (es un negocio real). La demo es **Lucero**, un local ficticio con etiqueta «Demo».
**Qué agregamos (pedido de Ignacio):** el personaje es **el mozo**, y la carta **es el pedido real**: anota cada plato, lleva la comanda a la cocina, espera con la **bandeja tapada** y la destapa al entregar. Así el personaje cuenta el estado del pedido, no solo decora.

---

## 2. Guion, escena por escena

| # | Momento | Qué pasa en pantalla | Pose de Gus | Globo |
|---|---|---|---|---|
| 1 | Llega desde el QR | Logo de Lucero, chip «Mesa 4». Gus asomado sobre el logo | Saludar (01) | «¡Bienvenidos a la mesa 4! ¿Qué les traigo?» |
| 2 | Empieza a bajar | Gus **se desprende del logo** y cae a su lugar fijo (escritorio: columna izquierda con la libreta; celular: esquina sobre la barra) | Caída 31–35 → Presentar carta (03) | «Te acompaño mientras elegís.» |
| 3 | Llega a cada categoría | Reacciona una vez por categoría | Entradas: carta (03) · Pastas, Pizzas: señalar (13) · Parrilla, Tragos: pensar (12) · Postres: sorpresa (08) | Recomendación corta propia de la categoría |
| 4 | Agrega un plato | La foto del plato **vuela en curva** hasta la libreta; Gus **anota**; el renglón se escribe a mano letra por letra; el total rueda | Anotar (07) | «Anotado. Van 3.» |
| 5 | Toca un agotado | No se puede agregar | Triste (09) | «Se nos terminó la entraña. ¿Te tiento con el vacío?» |
| 6 | Abre «Ver mi pedido» | Hoja con la escena del salón (mesa 4 a la izquierda, puerta de la cocina a la derecha), el pedido y el total | Anotar (07) | «¿Lo mando a la cocina?» |
| 7 | Toca «Mandar a la cocina» | **Solo después de que el servidor confirma el registro**, Gus se va de espaldas con la comanda y entra a la cocina; la puerta se abre y se cierra | Se va con la cuenta (06) y camina (14) | — Estado: «Pedido registrado · espera que lo acepte el encargado» |
| 8 | El local lo acepta | Gus sale de la cocina con la **bandeja tapada** y se queda esperando en el medio del salón | Camina con bandeja tapada → **Espera con bandeja tapada** (nueva) | «Está en la cocina. Apenas salga, te lo llevo.» · Estado: «En preparación · la cocina avisa ≈ 20 min» |
| 9 | La cocina lo termina | Suena la campanita; Gus camina hasta la mesa 4 | Camina con bandeja tapada (nueva) | «¡Mesa 4, acá estoy!» · Estado: «¡Listo! Va para la mesa 4» |
| 10 | El mozo lo entrega | **Gus levanta la campana**: la campana sube como la luna en un eclipse y destella el anillo de luz | Levanta la campana (nueva) → Saludar (01) | «¡Buen provecho!» |
| 11 | Pide la cuenta | Gus va con la cuenta | Camina con la cuenta (14) | «Ya te llevo la cuenta. Se paga en caja o con posnet.» |

---

## 3. Reglas de honestidad (el personaje no miente)

- **Cada animación sigue un estado real del pedido**, nunca al revés: Gus se va a la cocina cuando el pedido **quedó registrado**, sale con la bandeja cuando el local lo **aceptó**, camina a la mesa cuando está **listo** y destapa cuando el mozo lo marca **entregado**.
- Si el local exige aceptación del encargado, el estado lo dice («espera que lo acepte el encargado») y Gus no sale de la cocina hasta que se acepta.
- El tiempo de espera es **el que informa el local**, nunca inventado.
- **Nada se cobra en la app**: la hoja lo dice debajo del botón de enviar.
- Tragos: aviso de mayoría de edad; lo confirma el mozo en la mesa.
- Si falla el envío, Gus pone la pose de ayuda (46–50) con el mensaje y «Reintentar» en HTML; el reintento no duplica el pedido.
- En la demo, los pasos del local los dispara la barra **«Simular lo que hace el local»**: nada avanza solo.

---

## 4. Composición

**Escritorio (≥ 900 px):** columna izquierda fija (300–380 px) con Gus grande y debajo **la libreta de papel** (renglones, perforado arriba, letra manuscrita, total y «Ver mi pedido»); carta a la derecha (≤ 660 px) con fotos por categoría y líderes punteados hasta el precio.
**Celular:** carta a todo el ancho; Gus chico (≈ 100 px) parado sobre la barra inferior a la izquierda; la barra muestra «3 anotados · $ 36.700» y «Ver mi pedido». Los botones de agregar quedan a la derecha, lejos de Gus.
**Hoja del pedido:** escena del salón (mesa 4, puerta de la cocina), estado en vivo, renglones editables hasta enviar, nombre del comensal, aclaraciones para la cocina, total.

**Problema conocido (prototipo):** en celular, cuando una fila con opciones queda en los últimos ~100 px de la pantalla, Gus puede tapar el comienzo de esas opciones. Soluciones a probar en 0.6: que Gus se corra a la derecha de la barra cuando hay opciones abiertas, o que se achique a busto (cabeza y libreta) mientras el usuario baja.

---

## 5. Detalles que lo hacen premium

| Detalle | En el prototipo |
|---|---|
| Plato que vuela en curva hasta la libreta | Sí |
| Renglón escrito a mano, letra por letra (≈ 40 caracteres/s) | Sí |
| Total que se actualiza en la libreta y en la barra | Sí |
| Libreta de papel con perforado y renglones | Sí |
| La campana se levanta como la luna y destella el anillo de luz (firma de Eclipse) | Sí |
| Sonido opcional, apagado por defecto: lapicera, campanita de cocina, campana | Sí (sintetizado) |
| Vibración corta al agregar (Android) | Sí |
| Fotos hiperrealistas por categoría con bordes fundidos | Sí (5 del pack; faltan entradas y parrilla) |
| Vapor sobre el plato destapado | No (a producir) |
| Animaciones con cuadros intermedios reales | No: el prototipo cambia de pose de golpe (ver §7) |

---

## 6. Movimiento

| Evento | Técnica | Duración | *Reduced motion* |
|---|---|---|---|
| Desprenderse del logo | Traslado del logo al lugar fijo + secuencia de caída | 820 ms | Aparece en su lugar |
| Reacción por categoría | Cambio de pose + globo | Globo 3,6 s; como máximo una reacción cada 1,4 s | Pose quieta, globo igual |
| Agregar | Vuelo en curva + anotar + escritura | Vuelo 620 ms; anotar 780 ms | Sin vuelo; el renglón aparece completo |
| Ir a la cocina | Caminata + puerta | 1,3 s | Salto al destino |
| Salir con la bandeja / llevarla | Caminata con bandeja tapada | 1,0–1,2 s | Salto al destino |
| Destapar | Campana sube y gira; destello | 900 ms | Campana desaparece |

**Ajuste a la guía de personajes:** la guía pedía al menos 8 s entre reacciones al scroll. En la carta, la reacción **es** el contenido (una por categoría), así que se baja a **1,4 s** solo para el cambio de categoría. El resto de reglas se mantiene: esquina fija, nunca sobre precios ni botones de agregar, una reacción termina antes de la siguiente, y éxito solo tras confirmación real.

---

## 7. Poses: qué hay y qué falta

**Ya existen en la lámina de Gus** (`assets/personajes/cafe/mesero/`): saludar (01), presentar carta (03), servir con bandeja abierta (04), esperar (05), irse de espaldas con la cuenta (06), anotar (07), sorpresa (08), triste (09), pensar (12), señalar (13), caminar con la cuenta (14); y las secuencias: caminar con bandeja (01–05), caída (31–35), ayuda (46–50).

**Hay que generarlas** (en el prototipo, la campana es un dibujo superpuesto provisorio):

| Pose nueva | Cuadros | Uso |
|---|---|---|
| Esperando con bandeja **tapada** | 1 (+ 2 de respiración) | Escena 8 |
| Caminando con bandeja tapada | 5 (ciclo) | Escenas 8 y 9 |
| Levantando la campana | 3 | Escena 10 |
| Anotando (ciclo de escritura) | 3 | Escena 4 |
| Asomado sobre un borde, de frente | 1 | Escena 1 (sobre el logo) |

**Prompt para ChatGPT** (mismo hilo donde está la hoja de Gus; una lámina por fila):

```
Con el mismo personaje y estilo exactos de la lámina de referencia (mozo «Gus»: pelo gris peinado hacia atrás, bigote, moño negro, chaleco bordó, camisa crema, pantalón marrón oscuro, servilleta al brazo; contorno marrón oscuro, colores planos), generá una lámina de 5 columnas sobre fondo blanco liso, todas las figuras a la misma escala y con los pies a la misma altura:
1) De pie, de frente, sosteniendo con la mano derecha a la altura del hombro una bandeja redonda gris oscura cubierta con una campana plateada (cloche) con manija arriba; expresión amable, esperando.
2 a 5) Ciclo de caminata hacia la derecha con la misma bandeja tapada en la misma mano, la bandeja siempre a la misma altura; pasos: contacto, bajada, paso, subida.
Sin texto, sin sombras de piso, sin objetos extra.
```

```
Mismo personaje y estilo exactos. Lámina de 5 columnas, fondo blanco liso, misma escala:
1 a 3) De perfil a tres cuartos, con la bandeja tapada en la mano derecha, levanta la campana con la mano izquierda: 1) mano en la manija, 2) campana a medio subir mostrando un brillo, 3) campana arriba, sonriendo.
4) Asomado desde detrás de un borde horizontal (como detrás de un logo), de frente, solo se ve de la cintura para arriba, saludando con una mano.
5) Escribiendo en una libreta chica con lápiz, mirando la libreta, de frente.
Sin texto, sin sombras de piso.
```

Después: limpiar, unificar escala y punto de apoyo, separar figuras y armar el atlas (fase 0.6).

### 7.1 Pedido de PNG de Gus (para el diseñador o ChatGPT)

Los recortes automáticos de las láminas tienen límites: escala distinta entre poses, bordes y saltos. Con PNG limpios el personaje se ve parejo y se puede animar cuadro a cuadro.

**Formato, igual para todas:**

- PNG con **fondo transparente** (alfa real, sin blanco ni sombra de piso), una pose por archivo.
- **Mismo lienzo** para todas: 1024 × 1024 px.
- **Misma escala**: Gus mide siempre lo mismo (unos 900 px de alto de pies a cabeza).
- **Pies sobre la misma línea** (unos 40 px del borde inferior), centrado en horizontal.
- Mirando hacia la **derecha del espectador** cuando camina (lo damos vuelta por código).
- Mismo contorno, colores y luz que la lámina actual.
- Nombre: `gus-NN-accion.png` (por ejemplo, `gus-07-anotar.png`); los ciclos llevan `-f1`, `-f2`…

**Lista:**

| Archivo | Cuadros | Uso |
|---|---|---|
| `gus-01` a `gus-15` (las 15 acciones de la lámina) | 15 | Reacciones |
| `gus-saludo-f1..f2` | 2 | Saludo en el logo (mano arriba y abajo) |
| `gus-asoma` | 1 | Asomado de frente, de la cintura para arriba (se esconde detrás del logo) |
| `gus-anota-f1..f3` | 3 | Escribiendo en la libreta (ciclo) |
| `gus-bandeja-tapada` | 1 | Esperando con la bandeja tapada (campana plateada) |
| `gus-camina-tapada-f1..f5` | 5 | Caminando con la bandeja tapada |
| `gus-corre-tapada-f1..f5` | 5 | Corriendo con la bandeja tapada |
| `gus-campana-f1..f3` | 3 | Levantando la campana |
| `gus-espia` | 1 | Espiando debajo de la campana («No espíes, que es sorpresa») |
| `gus-mareado` | 1 | Mareado (cuando se baja rápido por la carta) |
| `gus-busto` | 1 | Busto de frente para el avatar y la barra del celular |

Total: 38 PNG.

---

## 8. Qué plan incluye qué (propuesta, decide Ignacio)

| Parte | Plan propuesto |
|---|---|
| Carta con Gus que se desprende del logo, reacciona por categoría y **anota** cada plato; libreta y total | **Contact** (es lo que vende la demo) |
| Viaje a la cocina, bandeja tapada, entrega con campana | **Contact** (visualiza los estados reales del pedido, que Contact ya tiene) |
| Las 15 acciones completas, secuencias con cuadros intermedios, sonido | Growth |
| Juegos desde «Jugar con mi mesa» mientras espera con la bandeja | Growth (juegos) |

---

## 9. Prototipo v2 (después de la prueba en iPhone)

- **Hero:** Gus asoma por detrás de «Lucero», sube con rebote y saluda con globo escrito a mano. Se puede tocar. El recorte es nuevo, sin el rectángulo ni el halo de la v1.
- **Salida del hero:** en escritorio salta en arco hasta la columna y aterriza con aplastamiento; en el celular se zambulle detrás del logo y asoma por encima de la barra de abajo. Si volvés arriba, vuelve a aparecer en el logo.
- **Más vivo:** tres frases por categoría; responde si lo tocás; se marea si bajás rápido; ofrece ayuda si te quedás quieto; sugiere bebida si hay comida sin trago; festeja a los 4, 6 y 9 platos.
- **Libreta:** el renglón se escribe apenas tocás + (ya no se atrasa el «Van N»).
- **Rondas:** cada envío es una ronda con su estado. «Seguir pidiendo» abre la ronda siguiente; la hoja «Cuenta de la mesa» muestra las rondas mandadas con estado y la ronda nueva editable. «Pedir la cuenta» se habilita cuando no queda nada en camino.
- **Escena:** el globo va sobre la cabeza de Gus; la cocina habla («¡Marchando!», «¡Dos minutos, Gus!»); sale caminando con la bandeja tapada, corre cuando está lista y al entregar levanta la campana con chispas.
- Mientras la ronda está en preparación, el Gus que acompaña la carta también sostiene la bandeja tapada.

## 10. Lo que no es el prototipo

- Las poses son **recortes automáticos** de las láminas de referencia: cambian de golpe, sin cuadros intermedios, y alguno conserva bordes imperfectos.
- La campana es un **dibujo superpuesto** sobre la bandeja de la pose «servir»; la pose final se genera (§7).
- No hay servidor: el envío espera 700 ms y los pasos del local se simulan con botones.
- Fotos: 5 del pack de imágenes; faltan entradas y parrilla.
- Lucero es un local ficticio (demo).

---

## 11. Próximos pasos

1. Ignacio prueba la v2 en el celular y marca qué cambiar.
2. **0.3:** pedir los 38 PNG de §7.1 (o generar las poses con los prompts de §7) y aprobar la hoja maestra de Gus.
3. **0.6:** componente `Companion` con atlas y cuadros intermedios, y la solución para la superposición en celular.
4. **1.2:** la demo del restó-bar usa esta experiencia completa.
