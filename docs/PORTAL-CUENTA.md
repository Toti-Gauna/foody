# Mi Eclipse · portal del suscriptor

Qué ve y qué completa quien se registra en Eclipse para locales de comida. Es el portal **cliente** (distinto del portal interno de operaciones de Eclipse). Base: V4 del Notion (Mi Eclipse reúne plan, sistema del negocio, contratos, pagos, soporte y entregas).

## 1. Registro y alta (embudo)

1. **Crear cuenta:** email y contraseña (o proveedor de acceso), verificación por email.
2. **Tu negocio:** nombre, comercio (cervecería, bar, café, heladería), ciudad, cantidad de sucursales.
3. **Tu plan:** Contact 30 · Growth 75 · Escalar 100 · Hípergrowth 150 · Deluxe 200 · Partner 500; mensual o anual. Muestra qué incluye cada uno y qué se suma al subir.
4. **Tu personaje:** elegir 1 de 5 con vista previa animada.
5. **Datos de cobro** (ver §3) y **método de pago**.
6. **Confirmación:** resumen del pedido y de lo que se cobra hoy y cada mes; aceptar términos.
7. **Onboarding:** checklist (cargar la carta, subir logo y fotos, crear mesas y QR, probar un pedido, imprimir soporte).

El acceso al producto se habilita **solo con el pago acreditado**, no con la pantalla de éxito.

## 2. Estructura del portal

| Sección | Qué contiene |
|---|---|
| Inicio | Estado de la cuenta, checklist, próximos cobros, avisos |
| Mi comercio | Datos del local, sucursales, horarios, ubicación, logo y fotos |
| Carta | Categorías, productos, variantes, agregados, disponibilidad, precios |
| Pedidos y mesas | Cola por estación, mesas, QR por mesa |
| Reservas | Agenda, capacidad, lista de espera (según plan) |
| Clientes | CRM, historial |
| Juegos y pasaporte | Catálogo habilitado, misiones, sellos, Regalos (Growth+) |
| Personaje y marca | Personaje elegido, paleta, tipografía, "Powered by Eclipse" |
| **Cuenta y suscripción** | Titular, plan, ciclo, método de pago, cambio de plan, baja |
| **Facturación** | Datos fiscales, comprobantes, historial de pagos |
| Equipo | Usuarios y roles (dueño, encargado, cocina, mozo) |
| **Eclipse Academy** | Ver §4 |
| **Eclipse Media** | Ver §5 |
| **Utilería (Equipamiento)** | Ver §6 |
| Soporte | Tickets, estado, guías |

## 3. Datos que necesitamos para cobrar

**Titular de la cuenta:** nombre y apellido, email, teléfono, DNI o CUIL/CUIT del responsable.
**Datos fiscales (para facturar):** razón social o nombre, CUIT, condición frente al IVA (responsable inscripto, monotributo, exento), domicilio fiscal, email de facturación, punto de venta si corresponde.
**Del negocio:** nombre comercial, comercio, dirección de cada sucursal, ciudad.
**Suscripción:** plan, ciclo (mensual o anual), fecha de alta, próxima fecha de cobro, moneda (USD de referencia; definir si se cobra en pesos con qué cotización).
**Método de pago:** tarjeta u otro medio **tokenizado por el proveedor**; nunca guardamos el número ni el código. Se guarda el token, los últimos 4 dígitos, vencimiento y marca.
**Comprobantes:** número, fecha, importe, estado (pendiente, acreditado, fallido, reembolsado), enlace al PDF.
**Reglas de cobro:** reintentos ante fallo, aviso previo, período de gracia, suspensión, cancelación, reembolsos.
**Legales:** aceptación de términos y de la política de datos con fecha y versión; consentimiento de comunicaciones.

Pendientes de decidir: proveedor de pagos y de suscripciones recurrentes, facturación electrónica (proveedor y alcance), moneda de cobro, impuestos y comisión. Requieren alcance específico; nada de esto está implementado.

## 4. Cómo se ve Eclipse Academy

Biblioteca privada con rutas por comercio y por nivel.

- **Portada:** "Continuar donde lo dejaste", progreso general, ruta recomendada según el plan y el comercio.
- **Rutas:** *Armá una carta que vende*, *Pasaporte rentable*, *Cómo atender con QR*, *Juegos y eventos*, *Foto de plato con celular*, *Redes y contenido*, *Leer tus números* (Hípergrowth+).
- **Lección:** video corto, guía en texto, ejercicio con el propio negocio, test y checklist. Juegos educativos.
- **Estética:** la del portal Eclipse (negro, dorado), con acentos del comercio y el personaje como guía ("Anotá esto").

## 5. Cómo se ve Eclipse Media

Para encargar y recibir piezas.

- **Catálogo de packs:** fotos de producto, digitalización 3D de platos, renders, tráiler Motion o híbrido, piezas para redes, mundo inmersivo con Higgsfield.
- **Brief guiado:** objetivo, referencias, qué mostrar, formatos.
- **Seguimiento:** brief → presupuesto → producción → revisión (con comentarios sobre la pieza) → aprobación → descarga.
- Las entregas aparecen en "Mis piezas", con licencia y fecha. Una orden de Media no es un pedido de comensal.

## 6. Cómo se ve Utilería (Equipamiento)

Catálogo físico con vista de producto y cotización.

- **Productos:** soporte QR de mesa, carta física, pasaporte y sellos, tarjetas de fidelización, carteles y displays, packaging, utilería de marca (bandejas, posavasos, delantales).
- **Personalización:** subir logo, elegir personaje y color; vista previa sobre el producto.
- **Flujo:** elegir → personalizar → cotizar → aprobar → pago → producción → envío con seguimiento.
- Comprar un soporte QR no incluye por sí mismo el módulo de pedidos.

## 7. Seguridad y permisos

Acceso por rol y por sucursal; un usuario no ve otro comercio. Sesión firmada para QR. Registro de acciones sensibles (cambio de plan, de método de pago, de datos fiscales). Datos personales con consentimiento y finalidad (normativa argentina de protección de datos personales).
