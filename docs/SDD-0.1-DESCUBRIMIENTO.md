# SDD · Fase 0.1 · Descubrimiento · Eclipse para locales de comida

Estado: **borrador para validar** · 2026-10-28 · Responsable: Ignacio · Redacción: Claude.
Basado en las respuestas de Ignacio a la ronda de preguntas A–H. Lo que no fue respondido o es supuesto mío está marcado **(supuesto)** o aparece en §14.

---

## 1. Resumen

Producto para **restó-bares y locales de comida con salón**: el comensal escanea el QR de su mesa, ve la carta, pide, y el pedido llega a la cocina o a la barra. El mozo y el encargado también pueden cargar pedidos. El local gestiona carta, stock, reservas y mesas. **No hay cobros dentro de la app**: se paga en caja o con el postnet del local. Eclipse cobra una suscripción al local.

**Piloto:** un restó-bar generalista con carta completa, tipo Barracuda. Todavía no hay un dueño de contacto: primero se construyen **demos para vender**, y después se instala en el primer local.

---

## 2. Decisiones tomadas

| # | Tema | Decisión |
|---|---|---|
| D1 | Foco | Restó-bar, bar o café generalista con carta completa. Quinto comercio del producto |
| D2 | Cómo se vende | Se muestra lo que hacemos con demos y se ofrece; sin período de prueba. Si en un mes nadie lo quiere, se hace seguimiento y se ofrece una prueba |
| D3 | Tiempos | Ignacio los maneja. Primera meta: demo vendible esta semana, sin que condicione el diseño |
| D4 | Personajes | Se usan los 20 existentes, con coherencia con el rubro (un helado no representa un restó-bar). **Los asigna Eclipse al local; el cliente no elige**. Si el local ya tiene mascota, se adapta a medida |
| D5 | Salón | 8 mesas: cuadradas chicas, circulares grandes y rectangulares medianas |
| D6 | Equipo del local | 2 en cocina, 1 mozo, 1 encargado y 1 cafetero |
| D7 | Quién pide | El comensal y el mozo. Ambos llevan la comanda a cocina, o pasa por el panel del encargado para aceptar |
| D8 | Salida de comandas | Pantalla **y** impresora |
| D9 | Cambios y anulaciones | Los hace el encargado; cambiar un plato pasa seguido |
| D10 | Cuenta | Cuenta dividida: fuera del alcance inicial. Un comensal puede pedir por toda la mesa |
| D11 | Propina | En persona; no por la app |
| D12 | Servicio | Solo salón y reservas. Sin delivery ni retiro |
| D13 | Cobro del pedido | **En caja o con el postnet del local. No se aceptan pagos por la app** |
| D14 | Modelo de negocio | Suscripción mensual o anual, o pago del sistema completo más mantenimiento bajo. Sin comisión por pedido |
| D15 | Facturación | No se factura desde Eclipse al inicio |
| D16 | Carta | La carga el local. La demo trae 4 productos por cada tipo (pastas, parrilla, merienda, etc., y tragos) |
| D17 | Fotos | Hechas con IA por ahora |
| D18 | Variantes | Punto de la carne, sin gluten, y agregados como «extra tomate» en pizzas |
| D19 | Menú del día | Se muestra en un modal. El cambio de estética por happy hour queda para después, y por festividad también |
| D20 | Stock | El encargado decide si un producto tiene límite; se descuenta solo. Si se agota, igual el mozo avisa en persona |
| D21 | Idiomas | Sitio en es, en y pt; carta en español e inglés **(supuesto: «sip» a mi sugerencia)** |
| D22 | Reservas | Llegan hoy por WhatsApp, llamada o en persona, a veces con seña. En Contact es una **solicitud que el local debe confirmar** |
| D23 | Juegos | Solo diversión. Hay menores en las mesas. Se puede ganar «algo» al llegar a cierto puntaje |
| D24 | Juegos por plan | Contact ninguno; Growth algunos; Escalar hasta Pinturillo; superiores igual que Escalar. El local elige cuáles activa |
| D25 | Personajes: derechos | Ignacio confirma que se pueden usar. Nombres fáciles de recordar |
| D26 | Suscripción | En pesos, atada al dólar. Proveedor a elegir (ver §11) |
| D27 | Powered by Eclipse | Siempre visible, en subtítulo o pie |
| D28 | Datos de comensales | Nombre y mesa. **El local es el responsable**; se alojan en la base de Eclipse en Neon |
| D29 | Página | Parecida a la de Eclipse, enfocada a restaurantes, con un **hero más chico y rápido** |
| D30 | Dominio | Subdominio propio |
| D31 | Soporte | Lo da Ignacio, siempre incluido |
| D32 | Presupuesto | USD 100/mes de infraestructura compartida con los demás proyectos, y USD 200/mes en suscripciones (Claude, ChatGPT, Higgsfield, Meshy, ElevenLabs) |
| D33 | Stack | Next.js en JavaScript, para todo **(a confirmar: JavaScript puro o TypeScript, ver §14)** |

---

## 3. Qué cambia en el plan

| Antes (roadmap v4) | Ahora |
|---|---|
| Piloto en heladería o cervecería | **Restó-bar generalista**, como quinto comercio |
| Cobro de pedido con dos opciones, y estado «pagado» | **Sin pagos en la app.** Estados sin «pagado»; la mesa se cierra a mano |
| Fase 1.5 «Estados, concurrencia y pago» (Opus · xhigh) | «Estados y concurrencia», sin proveedor de pagos del pedido |
| El cliente elige personaje en el alta | **Eclipse lo asigna** al configurar el local |
| Una carta por sucursal | Una carta; sucursales vienen en Partner |
| Delivery o retiro opcional | **Solo salón** |

Esto reduce el riesgo de Contact: sin pasarela, sin reembolsos y sin conciliación. Sigue habiendo **un solo pago**: la suscripción del local a Eclipse.

---

## 4. Usuarios y roles

| Rol | Qué hace | Dispositivo |
|---|---|---|
| **Comensal** | Escanea el QR, ve la carta y el menú del día, pide para sí o para toda la mesa, pide la cuenta, solicita reservas, juega (Growth+) | Su celular |
| **Mozo** | Toma pedidos desde su celular, ve sus mesas, entrega, avisa agotados | Celular |
| **Encargado** | Acepta o rechaza pedidos, **cambia o anula** platos, cierra mesas, gestiona stock, carta, menú del día y reservas | Panel (tablet o PC) y celular |
| **Cocinero (×2)** | Ve y avanza las comandas de cocina | Pantalla y impresora |
| **Cafetero** | Ve y avanza las comandas de barra (café y bebidas) | Pantalla (a confirmar) |
| **Dueño** | Datos del local, equipo, plan y cuenta en Mi Eclipse | Mi Eclipse |
| **Ignacio / Eclipse** | Soporte, configuración inicial y personaje | Portal interno |

**(supuesto)** Los tragos con alcohol los prepara la misma estación de barra que el café. Falta confirmar quién los prepara (§14).

---

## 5. Salón y mesas

8 mesas. **(supuesto, a confirmar la cantidad exacta por tipo):** 3 cuadradas chicas (2 personas), 2 circulares grandes (6) y 3 rectangulares medianas (4).

Cada mesa tiene número, tipo, capacidad y un QR propio. La **sesión de mesa** se abre al primer escaneo y se cierra cuando el encargado cierra la cuenta. El QR abre un contexto y no autoriza cobros ni datos de otras mesas.

---

## 6. Flujos

### 6.1 Pedido del comensal
1. Escanea el QR de su mesa. Ve el local, la mesa y el modal del **menú del día** (si hay).
2. Ingresa su **nombre** (y la mesa ya viene del QR).
3. Navega la carta, elige producto, variante y agregados, y revisa el carrito.
4. Envía. Puede pedir **para toda la mesa**; varios comensales de la misma mesa pueden enviar pedidos, y todos se juntan en la **cuenta de la mesa**.
5. Según la configuración del local: el pedido **va directo a la estación** o **queda pendiente de aceptación del encargado**.
6. Cocina o barra lo preparan y avanzan el estado. El comensal ve el avance.
7. El mozo entrega.
8. El comensal puede tocar **«Pedir la cuenta»**, que avisa al mozo. El cobro es en persona.

### 6.2 Pedido del mozo
Igual que el anterior, desde su celular y sobre una mesa que elige. Misma lógica de aceptación.

### 6.3 Cambios y anulaciones
El **encargado** puede cambiar un plato por otro, anular un ítem o el pedido completo, antes o después de que empiece a prepararse. Queda registro de quién, cuándo y por qué. La estación afectada recibe el aviso del cambio.

### 6.4 Stock y agotados
Cada producto puede tener **límite o no**, decidido por el encargado. Con límite, cada pedido descuenta solo; al llegar a cero el producto pasa a **agotado** y deja de poder pedirse. Dos pedidos simultáneos no pueden vender la última unidad. El mozo, además, avisa en persona.

### 6.5 Reserva (solicitud)
El comensal envía día, hora, cantidad de personas, nombre y teléfono. El **local confirma, rechaza o reprograma**. La app nunca muestra «confirmada» si solo fue una solicitud. La **seña** se acuerda por fuera (no hay cobro en la app).

### 6.6 Cierre de mesa
El encargado marca la cuenta como cobrada **fuera de la app** y cierra la mesa. La sesión del QR termina y el próximo escaneo abre una nueva.

---

## 7. Estados

**Pedido:** `enviado` → (`pendiente de aceptación` → `aceptado` | `rechazado`) → `en preparación` → `listo` → `entregado`. Desde `enviado` hasta `listo` se puede `modificar` o `anular` (encargado). No existe `pagado`.
**Ítem:** cada ítem va a una estación (cocina o barra) y tiene su propio estado, así un pedido mixto avanza en partes.
**Mesa:** `libre` → `con sesión abierta` → `cuenta pedida` → `cerrada` → `libre`.
**Reserva:** `solicitada` → `confirmada` | `rechazada` | `reprogramada` → `llegó` → `sentada` → `finalizada` | `no asistió` | `cancelada`.

---

## 8. Alcance de Contact (USD 30) para el piloto

### Dentro
- Web del local con carta, horarios, ubicación y botón de reservar.
- Carta con categorías, variantes y agregados; fotos hechas con IA.
- QR por mesa y sesión de mesa; pedido del comensal y del mozo.
- Panel del encargado: aceptar, cambiar, anular, stock, carta, menú del día, mesas, reservas.
- Pantalla de cocina y de barra, e **impresión de comandas**.
- Solicitud de reserva con confirmación del local.
- CRM básico (nombre y mesa).
- **Menú del día en modal** (supuesto de que entra en Contact).
- Personaje en la carta (saludar, anotar al bajar, agradecer).
- Mi Eclipse: registro, datos de cobro de la suscripción, onboarding, soporte.
- «Powered by Eclipse».

### Fuera (por ahora)
Pagos por la app, propina, cuenta dividida, delivery y retiro, facturación, integración con el POS o la caja, happy hour y festividades con cambio de estética, juegos y pasaporte (desde Growth), 3D y Higgsfield (desde Escalar), varias sucursales (Partner), seña por la app.

---

## 9. Carta de la demo (4 productos por tipo)

Tipos propuestos **(supuesto)**; cada uno con 4 productos ficticios y variantes de ejemplo:

| Tipo | Ejemplos | Variantes y agregados de ejemplo |
|---|---|---|
| Entradas | Provoleta, rabas, empanadas, tabla de fiambres | Cantidad, salsa |
| Pastas | Ravioles, ñoquis, sorrentinos, tallarines | Salsa (fileto, crema, bolognesa), queso rallado extra |
| Parrilla | Bife de chorizo, entraña, asado, vacío | **Punto de la carne**, guarnición |
| Pizzas | Muzzarella, fugazzeta, napolitana, calabresa | **Extra tomate**, sin gluten, borde relleno |
| Minutas | Milanesa napolitana, hamburguesa, suprema, pollo grillado | Con fritas o ensalada |
| Ensaladas | César, caprese, mixta, de rúcula | Aderezo, agregar pollo |
| Postres | Flan, tiramisú, volcán de chocolate, panqueque con dulce de leche | Helado extra |
| Merienda | Café con leche, submarino, tostado, medialunas | Tamaño, endulzante |
| Bebidas | Agua, gaseosa, jugo, limonada | Con o sin hielo |
| Cervezas y vinos | Rubia, roja, malbec, rosé | Tamaño o copa y botella |
| Tragos | Fernet con cola, gin tonic, aperol spritz, mojito | Premium, sin alcohol |

11 tipos × 4 = 44 productos. Los tragos requieren **verificación de mayoría de edad** (a definir cómo).

---

## 10. Juegos y personajes

### 10.1 Juegos por plan (selección)

Criterios: aptos para menores, sin violencia, con motor ya disponible en `games-market`, y ordenados por complejidad real.

| Plan | Juegos | Estado en `games-market` |
|---|---|---|
| **Contact (30)** | Ninguno | — |
| **Growth (75)** | Serpiente, Vuelo, Saltarín, Catapulta, Ninja, Combinaciones | **Estables, para un jugador, sin red** |
| **Escalar (100)** y superiores | Los de Growth **más** Pong (hockey de mesa), Rompeladrillos, Tetris duelo, Ludo y Pinturillo | **Beta y desactivados; necesitan red en tiempo real** |
| **Hípergrowth, Deluxe, Partner** | Mismo catálogo que Escalar | Igual |

- El **local activa o desactiva** cada juego desde el panel.
- Quedan afuera por ahora: Invasores y Shooter (disparos), Carreras, Corredor, Fútbol, Pool y Espacio (más complejos o con red pesada).
- «Adiviná en la frente» (idea tuya) no existe en el repo; se construye y se suma a Escalar.
- Cada juego se **viste con el personaje del local** y con contenido gastronómico (por ejemplo, Ninja corta ingredientes y Combinaciones junta platos).
- **Premios:** el local define un puntaje y un premio (por ejemplo, un postre). Como el puntaje de un juego solo viene del navegador, **el mozo o el encargado valida el premio en persona**; no hay premios automáticos ni con alcohol, porque hay menores.
- Verificar antes de vender los juegos en red: hoy usan conexión directa entre celulares; para producción puede hacer falta un servicio de salas (fase 2.1).

### 10.2 Personajes con nombre (propuesta a aprobar)

| Comercio | Personajes con nombre propuesto |
|---|---|
| Bar | Barracuda **Barry** · Copa cóctel **Cocó** · Luna **Lula** · Mapache **Rocco** · Pizza **Pizzi** |
| Café | Colibrí **Coli** · Gota dorada **Dora** · Medialuna **Mimi** · Mesero **Gus** · Taza **Tazzi** |
| Cervecería | Barril robot **Robi** · Escorpión estelar **Antar** · Hamburguesa **Burgi** · Lúpulo **Lupi** · Oso cervecero **Bruno** |
| Heladería | Cono nube **Nubi** · Frutilla **Fru** · Palito helado **Pali** · Pingüino **Pingo** · Remolino **Rulo** |

**Para el restó-bar piloto** (coherente con carta completa y salón): recomendado **Mesero «Gus»**, porque un mozo representa a cualquier restaurante. Alternativas: **Barracuda «Barry»** (te lo dijo la referencia) o **Mapache «Rocco»**. Los de heladería quedan descartados para este rubro.

---

## 11. Suscripción de Eclipse al local

Cobro **en pesos, atado al dólar**. Tres proveedores para elegir:

| Proveedor | Qué sé | A verificar |
|---|---|---|
| **Mercado Pago · Suscripciones** | Documentación oficial en Argentina para cobros recurrentes automáticos, con o sin programar | Que permita actualizar el monto cada mes para seguir al dólar; manejo de fallos y cambios de plan (una fuente dice que es manual); comisión |
| **Pago Nube (Tiendanube) · Suscripciones** | La ayuda de Tiendanube (actualizada 17/06/2026) dice que Suscripciones funciona solo con Pago Nube y tarjeta de crédito; no deja fijar el día de cobro; si se desactiva Pago Nube se cortan los cobros | Hay fuentes anteriores que decían lo contrario. Implica vender los planes como productos de una tienda Tiendanube; comisión y requisitos |
| **Payway** (o dLocal) | Aparece en comparativas como proveedor con API, débito automático y conciliación; dLocal liquida en USD | Faltan fuentes oficiales de su API de suscripciones y comisiones |

**Recomendación:** empezar por **Mercado Pago Suscripciones** por su documentación oficial y por cobrar en pesos, **salvo** que verifiquemos que no permite ajustar el monto al dólar; en ese caso, evaluar Pago Nube. Stripe queda descartado hasta confirmar su disponibilidad en Argentina (las fuentes se contradicen).

Pendientes: qué cotización del dólar se usa y con qué frecuencia se recalcula (§14), y cómo factura Eclipse su suscripción (alcance aparte).

---

## 12. Datos, privacidad y cuenta

- **Datos del comensal:** nombre y mesa. El **local es responsable**; Eclipse los aloja en Neon.
- **Datos del local para la suscripción:** titular, CUIT, condición frente al IVA, domicilio fiscal, email de facturación, método de pago tokenizado por el proveedor. Detalle en `PORTAL-CUENTA.md`.
- Se necesita un **contrato o términos** entre el local y Eclipse que fijen los roles (local responsable, Eclipse encargado del tratamiento), el plazo de conservación y la baja. **(supuesto)** Retención de datos de comensales a definir; propuesta de partida: anonimizar a los 90 días.
- Un comensal nunca ve datos de otra mesa; un local nunca ve los de otro.

---

## 13. Arquitectura y costos

- **Next.js** para front y back, con **Neon** (Postgres) como base compartida de Eclipse y sesión de mesa firmada por QR. Los juegos de `games-market` (Vite y React) se integran como componentes de cliente.
- **Tiempo real** (pedidos a pantalla de cocina, salas de juego): una función serverless de Next.js no mantiene conexiones largas. Hace falta un servicio con conexiones persistentes o una alternativa (por ejemplo, actualizaciones periódicas para las comandas). **A decidir en el ADR de la fase 0.5.**
- **Impresión de comandas desde la web:** no es trivial. Opciones: impresión del navegador con formato térmico, o un pequeño programa local que reciba las comandas. **A investigar** con el modelo de impresora del local.
- **Presupuesto:** USD 100/mes de infraestructura compartida y USD 200/mes en suscripciones. Meshy se usaría para 3D y ElevenLabs para sonido y voz, en tandas posteriores.

---

## 14. Criterios de aceptación del piloto (Contact)

1. Dos pedidos simultáneos no venden la última unidad de un producto con límite.
2. Un reintento de envío no duplica el pedido.
3. El encargado puede cambiar y anular un plato, y la estación lo ve en menos de unos segundos **(umbral a fijar)**.
4. Un pedido mixto (cocina y barra) llega a cada estación por separado y la mesa lo ve completo.
5. La app nunca muestra una reserva «confirmada» si solo es una solicitud.
6. Una mesa nunca ve pedidos de otra; un local nunca ve datos de otro.
7. La app no menciona ni procesa pagos del pedido.
8. Si falla el personaje, el menú del día o un juego, la carta y el pedido siguen.
9. El personaje no tapa precios ni botones; movimiento reducido = pose quieta.
10. Una impresora y una pantalla reciben la misma comanda sin duplicarla.
11. Cumple accesibilidad AA, 360 px sin scroll horizontal y etiqueta «Demo» en las demos.

---

## 15. Preguntas abiertas (segunda ronda)

1. **Personaje del piloto:** ¿Gus (Mesero), Barry (Barracuda) o Rocco (Mapache)? ¿Te sirven los nombres propuestos?
2. **Menú del día:** ¿confirmás que entra en Contact? ¿Qué lleva (foto, precio, texto) y quién lo carga?
3. **Mesas:** ¿cuántas de cada tipo? ¿Hace falta mostrar un plano en Contact?
4. **Barra:** ¿el cafetero también prepara los tragos? ¿Hay una estación de barra aparte?
5. **Aceptación:** ¿el encargado acepta siempre, es configurable, o solo ciertos productos?
6. **Impresora y pantalla:** ¿modelo de impresora (térmica 80 mm?) y qué pantalla usan (tablet, monitor)?
7. **Cuenta:** ¿«Pedir la cuenta» desde la app que avise al mozo es correcto?
8. **Reservas:** ¿horarios y turnos, máximo de personas, duración? ¿La seña se anota como dato informativo?
9. **Stock:** ¿el límite se reinicia cada día?
10. **Dólar:** ¿qué cotización usamos (oficial, MEP u otra) y cada cuánto se recalcula el precio en pesos?
11. **Facturación de Eclipse:** ¿con qué condición fiscal factura la suscripción a cada local?
12. **Retención de datos:** ¿cuántos días se conservan nombre y mesa?
13. **Subdominio:** ¿cuál (por ejemplo `comida.eclipse-business.com`)?
14. **JavaScript o TypeScript:** ¿«js todo» es JavaScript puro? Eclipse-Web y Eclipse-be usan TypeScript estricto.
15. **Premios de juegos:** ¿tienen un ejemplo de premio y puntaje?
16. **Carta en inglés:** ¿la traducimos con IA y el local la revisa?
17. **Mayoría de edad en tragos:** ¿cómo se verifica (aviso, confirmación, el mozo)?
18. **Pago único del sistema:** si el local compra el sistema completo, ¿qué incluye y cuánto cuesta el mantenimiento? (pendiente de costeo)

---

## 16. Próximo paso

Con las respuestas de §15 se cierra la fase 0.1 y se abre la **0.2 Contrato visual de la página**. El roadmap `ROADMAP.md` ya tiene los ajustes v4.1.
