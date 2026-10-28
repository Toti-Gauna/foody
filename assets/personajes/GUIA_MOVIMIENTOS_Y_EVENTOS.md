# Biblioteca de movimiento · 20 personajes

1000 poses clave: 50 por personaje. Diez secuencias de cinco poses por personaje. Son referencias visuales estáticas para diseñar la animación; no son GIF, videos, bucles reproducibles ni un atlas de sprites listo para usar.

## Lectura

Carpeta 03_secuencias_50: los 16 personajes ampliados tienen dos láminas de 25 poses, cinco columnas y cinco filas. Los cuatro seleccionados inicialmente tienen cinco láminas de 10 poses, cinco columnas y dos filas. Leer cada fila de izquierda a derecha y luego bajar. Cada fila es una secuencia de cinco momentos. INDICE_1000_POSES.csv indica archivo, fila, columna y número de pose para cada personaje.

## Secuencias por personaje

| Poses | Secuencia |
|---|---|
| 01–05 | Caminar o desplazarse |
| 06–10 | Correr o desplazarse rápido |
| 11–15 | Buscar, traer y entregar |
| 16–20 | Aparecer y dar un aviso |
| 21–25 | Reposo con vida |
| 26–30 | Espera sin elección o scroll |
| 31–35 | Reacción al scroll abajo: caída suave y recuperación |
| 36–40 | Scroll arriba: reaparecer |
| 41–45 | Confirmación y logro |
| 46–50 | Error recuperable y ayuda |

## Comportamiento propuesto · pendiente de aprobar

- Reposo: respiración o parpadeo discretos; no repetir estiramientos grandes continuamente. Pausar fuera de pantalla.
- Inactividad: una invitación breve después de unos 45 segundos sin interacción, solo si hay una elección pendiente. No interpretar una pausa de lectura como un error. Cancelar ante clic, teclado, toque o scroll; limitar a una invitación por visita a la sección.
- Scroll: usar la caída o salto en cambios de sección o desplazamientos significativos, no por cada píxel. Una reacción debe terminar antes de aceptar otra; propuesta de pausa mínima de 8 segundos. El personaje permanece en una esquina y no tapa botones ni texto.
- Aviso informativo: aparece, presenta una tarjeta y se retira al cerrar o completar la acción. El texto real y los botones van en HTML junto al personaje, no dentro de la imagen.
- Éxito: solo después de una confirmación real de la aplicación. No fingir que un pedido fue recibido.
- Error: mensaje claro y acción de reintentar o corregir. El personaje acompaña; el mensaje importante permanece visible hasta resolverlo o cerrarlo.
- Prioridad: error/aviso que requiere acción > confirmación > entrega > locomoción > reacción al scroll > inactividad > reposo. No encadenar avisos repetidos; agrupar los equivalentes. Retomar desde una pose neutra tras resolver el estado de mayor prioridad.
- Movimiento reducido: usar una pose quieta con el mensaje equivalente. Ofrecer ocultar el acompañante y conservar los avisos importantes en el flujo de la interfaz.

Estas son decisiones de diseño propuestas, todavía no implementadas.

## Preparación antes de animar

Elegir y aprobar una hoja maestra por personaje. Unificar anatomía, accesorios, escala y punto de apoyo entre poses; retirar trazos decorativos o props que no correspondan al estado. En algunas referencias aparecen variaciones de extremidades, objetos y proporciones: por ejemplo, el palito de helado puede abrir su base al correr. Esas variantes requieren limpieza antes de producción.

Las cinco poses de cada fila no son cinco fotogramas temporizados con anclaje idéntico. Hay que separar las figuras, definir capas o redibujar vectores, completar intermedios y verificar continuidad. El retorno de una secuencia al reposo y los ciclos de marcha/carrera se resuelven después. No se promete que alternar directamente estas imágenes produzca una animación fluida.

No se escribió código de la aplicación ni se activaron avisos o reacciones al scroll. La implementación requiere aprobación explícita.

## Archivo previo

Se conservan las exploraciones y láminas de 15 acciones en sus carpetas originales. Los JPG del ZIP están comprimidos para respetar el límite de 30 MB. El paquete sirve para revisar y planificar; no reemplaza los originales de producción.
