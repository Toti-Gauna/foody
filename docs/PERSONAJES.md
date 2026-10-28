# Personajes · selección, poses y reacciones

Fuente: `assets/personajes/` (pack "mascotas gastronómicas" de Eclipse para locales de comida: 20 personajes, 15 acciones y 50 poses clave cada uno). Son **referencias de diseño**, no sprites ni animaciones.

## 1. Los 20 personajes

| Comercio | Personajes (el cliente elige 1) |
|---|---|
| Cervecería | `barril_robot` · `escorpion_estelar` · `hamburguesa` · `lupulo` · `oso_cervecero` |
| Bar | `barracuda` · `copa_coctel` · `luna` · `mapache` · `pizza` |
| Café | `colibri` · `gota_dorada` · `medialuna` · `mesero` · `taza` |
| Heladería | `cono_nube` · `frutilla` · `palito_helado` · `pinguino` · `remolino` |

Estructura: `assets/personajes/<comercio>/<personaje>/acciones_15.jpg` y `secuencias_50/poses_*.jpg`. Índice de las 1000 poses: `INDICE_1000_POSES.csv` (archivo, fila y columna). Manifiesto para el selector: `personajes.json`.

## 2. Elegir personaje

Paso del onboarding en Mi Eclipse, después de elegir comercio: grilla con los 5 personajes de ese comercio. Al pasar el cursor o tocar, el personaje hace **saludar**, **anotar pedido** y **celebrar**. Se confirma uno y queda guardado en la cuenta.

- Se puede cambiar desde Mi Eclipse; el cambio no pierde sellos ni progreso.
- Las poses y animaciones son equivalentes entre personajes: un solo sistema de estados, y cada personaje es un paquete intercambiable.
- Partner: un personaje por marca, con opción de uno distinto por sucursal (a definir).
- Un personaje propio o a medida es un trabajo de Media, fuera del plan.

## 3. Las 15 acciones y dónde se usan

| # | Acción | Evento de la carta |
|---|---|---|
| 01 | Saludar | Entrada a la carta, bienvenida |
| 02 | Agradecer | Pedido enviado, pago confirmado |
| 03 | Presentar carta | Apertura de la carta o de una categoría |
| 04 | Servir | Pedido entregado |
| 05 | Esperar | Pedido en preparación |
| 06 | Retirarse de espaldas con la cuenta | Cuenta solicitada |
| 07 | **Anotar pedido** | **Al bajar la carta (cambio de categoría) y al agregar un ítem** |
| 08 | Sorprenderse | Promoción o sugerido del día |
| 09 | Estar triste | Producto agotado, error recuperable |
| 10 | Jugar en el celular | Invitación a juegos (Growth+) |
| 11 | Celebrar premio | Sello, premio o canje real |
| 12 | Pensar | Elegir variantes, buscar |
| 13 | Señalar una recomendación | Sugerencia |
| 14 | Caminar con la cuenta | Transición hacia el pago |
| 15 | Limpiar | Vaciar carrito, mesa libre |

## 4. Secuencias de 5 poses (50 por personaje)

| Poses | Secuencia | Uso |
|---|---|---|
| 01–05 | Caminar o desplazarse | Moverse por la pantalla |
| 06–10 | Correr | Traslados rápidos |
| 11–15 | Buscar, traer y entregar | Traer el pedido |
| 16–20 | Aparecer y dar un aviso | Avisos informativos |
| 21–25 | Reposo con vida | Estado por defecto |
| 26–30 | Espera sin elección o scroll | Inactividad |
| 31–35 | Reacción al scroll hacia abajo | Cambio de sección |
| 36–40 | Scroll hacia arriba: reaparecer | Volver |
| 41–45 | Confirmación y logro | Éxito real |
| 46–50 | Error recuperable y ayuda | Error con acción |

## 5. Reglas de comportamiento (de la guía del pack, a aprobar)

- **Reposo:** respiración o parpadeo discretos. Se pausa fuera de pantalla.
- **Scroll:** reaccionar en cambios de sección, no por cada píxel. Una reacción termina antes de aceptar otra; pausa mínima de 8 segundos. Esquina fija, sin tapar botones ni texto.
- **Anotar al bajar:** al cruzar a una nueva categoría, el personaje anota (pose 07); no en cada ítem.
- **Inactividad:** una invitación breve a los ~45 segundos, solo si hay una elección pendiente; se cancela con cualquier interacción; una vez por visita a la sección.
- **Éxito:** solo tras una confirmación real de la aplicación. Nunca fingir que un pedido fue recibido.
- **Error:** mensaje claro y acción visible en HTML; el personaje acompaña.
- **Prioridad:** error o aviso que requiere acción > confirmación > entrega > locomoción > reacción al scroll > inactividad > reposo. Los avisos equivalentes se agrupan.
- **Movimiento reducido:** pose quieta con el mensaje equivalente y opción de ocultar al acompañante.

## 6. Logo viajero

Wordmark completo en el header → al bajar se achica a emblema → pasa a ser el personaje fijo en la esquina junto a las categorías. Cambia de pose por categoría y reacciona al agregar. En la heladería, la reacción puede variar según el sabor elegido.

## 7. Producción (obligatoria antes de animar)

1. Elegir y aprobar una **hoja maestra** por personaje; unificar anatomía, accesorios, escala y punto de apoyo.
2. Retirar trazos decorativos y props que no correspondan (ej.: el palito de helado abre su base al correr).
3. Separar las figuras y definir capas, o redibujar en vector; completar intermedios.
4. Exportar atlas o SVG por capas + `manifest.json` por personaje (estados → cuadros).
5. Probar 60 fps en un celular de gama media y con movimiento reducido.

Las secuencias no son cuadros temporizados con anclaje idéntico; alternar las imágenes tal cual no da una animación fluida.
