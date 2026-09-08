# Levantamiento de proyecto — plantilla para cotizar

> **Nota de quien rellenó este archivo.** Se completó analizando el repositorio existente y las
> conversaciones que lo produjeron. Todo lo que no se habló está marcado `POR DEFINIR`. **Los precios
> están vacíos a propósito**: no se ha hablado de presupuesto ni una sola vez en este proyecto, y
> poner cifras inventadas en un documento que se convierte en una cotización real es exactamente lo
> que después hay que desmentir frente al cliente. El alcance sí está descrito con el detalle
> suficiente para que quien ponga los precios sepa qué está valorando.
>
> Lo que sí lleva número son los **rangos de horas**, porque salen de trabajo ya hecho: la beta
> completa son 6.783 líneas de código publicable más 1.850 de pruebas y herramientas, construidas en
> 13 commits, y eso da una base real para estimar lo que falta.

---

## 1. Cliente

| Campo | Valor |
|---|---|
| Nombre del cliente | `POR DEFINIR` — no se registró el nombre de la persona que encarga |
| Empresa | MONPICA — Montilla Proyectos Integrales C.A. |
| Persona de contacto | `POR DEFINIR` |
| Correo | monpica2025@gmail.com (dato del brochure de la empresa, no de una persona) |
| Teléfono / WhatsApp | 0414-536 53 05 (dato del brochure) |
| ¿Es un cliente nuevo o ya trabajamos con él? | `POR DEFINIR` |
| Cómo llegó / contexto | Consultora ambiental, forestal, agrícola y civil de Guanare, estado Portuguesa. Ya hubo un levantamiento técnico con su ingeniero forestal, del que salió el detalle del inventario de árboles, la cubicación y la parte administrativa de costos. Hay una beta navegable construida y presentable. |

## 2. El proyecto

| Campo | Valor |
|---|---|
| Nombre del proyecto | Sistema de Gestión de Proyectos Integrales MONPICA |
| Nombre corto en mayúsculas | `MONPICA-SGP` |
| ¿Qué es, en una frase? | El sistema donde MONPICA lleva sus proyectos de consultoría de punta a punta: las diez etapas de cada expediente, el inventario forestal en campo, los costos y la cartera. |
| ¿Qué problema le resuelve al cliente? | Hoy cada proyecto vive repartido entre hojas de cálculo, cuadernos de campo y carpetas. No hay una sola pantalla que diga qué etapa está detenida, qué plazo se venció, cuánto se ha gastado en un proyecto ni cuánto volumen se ha cubicado. El sistema centraliza eso y deja constancia de quién hizo cada cosa y cuándo. |
| ¿Quién lo va a usar? | Ocho roles: Administrador, Coordinador, Profesional, Administración, Dirección, y tres del levantamiento nuevo — Gerente de proyecto, Técnico forestal de campo y Asesor legal. |
| ¿Hay algo ya hecho o se empieza de cero? | **Hay una beta navegable completa y funcionando.** 17 pantallas, 5 roles con permisos aplicados de verdad, flujo de diez etapas con compuerta de aprobación, y once guiones de verificación automatizada. Funciona sin internet y sin compilación. No es un maquetado: los datos se guardan, los permisos bloquean y la bitácora registra. Lo que **no** tiene es servidor, base de datos, autenticación real ni almacenamiento de archivos. |
| Fecha o plazo que pidió el cliente | `POR DEFINIR` — solo se sabe que había una reunión de presentación, sin fecha registrada |

**Resumen para el cliente:**

```
Tienes una demostración navegable de tu sistema que ya puedes recorrer completa: entrar con
tu usuario, ver tus proyectos, mover una etapa, aprobar una compuerta y sacar un reporte.
Está construida con tu marca y tus colores, y funciona incluso con el internet apagado.

Lo que sigue son dos cosas distintas. Una es agregar lo que levantamos con tu ingeniero
forestal: el inventario de árboles con sus coordenadas y su cubicación, y el control de
gastos, nómina y estructura fija. La otra, más de fondo, es convertir la demostración en un
sistema de verdad: hoy los datos viven en el navegador de cada persona, así que no se
comparten entre tu equipo y se pierden si alguien limpia su navegador.

Las dos se pueden hacer por separado y en el orden que prefieras. Si lo que necesitas ahora
es mostrar el sistema y decidir con tu equipo, la demostración ya te sirve. Si lo que
necesitas es empezar a usarlo en los proyectos que tienes abiertos, hay que hacer primero
la parte de servidor.
```

## 3. Presupuesto

| Campo | Valor |
|---|---|
| Presupuesto aprobado o rango | `POR DEFINIR` — no se ha mencionado ninguna cifra en todo el proyecto |
| Moneda | USD |
| ¿El monto es cerrado o hay margen? | `POR DEFINIR` |
| ¿Hay algo que el cliente ya dijo que NO quiere pagar ahora? | Sí, y está documentado como fuera de alcance: mapas y visor cartográfico (queda para un desarrollo aparte y posterior), portal de contratantes funcional, asistente de informes funcional, carbono y servicios ambientales, y conexión con drones, GPS o estaciones totales. También se descartó exigir comprobante fotográfico de cada gasto. |

> Los costos de la sección 4 están vacíos porque no hay presupuesto de referencia. El alcance está
> descrito para que se puedan poner encima.

## 4. Fases y entregables

> Las fases 1 y 2 **ya están entregadas y pagadas o no según lo que se haya acordado** — se listan
> con su alcance real para que la cotización muestre de dónde se parte, no para volver a cobrarlas.
> Las fases 3 a 7 son lo que falta.
>
> Los tiempos son rangos de horas estimados sobre desarrollo asistido por IA, que es como se
> construyó la beta.

### Fase 1 — Beta navegable *(ENTREGADA)*

- **Qué se logra en esta fase:** Un sistema navegable completo que se abre con doble clic, sin
  internet y sin instalar nada. Sirve para presentar, para decidir el alcance con el equipo y para
  que cada rol vea su propia pantalla.
- **Qué NO entra en esta fase:** Servidor, base de datos, autenticación real, almacenamiento de
  archivos y respaldo. Los datos viven en el navegador de cada persona y no se comparten.
- **Cuándo se hace:** Hecho.

| Entregable | Qué incluye | Costo | Obligatorio / Opcional | Tiempo estimado |
|---|---|---|---|---|
| Diecisiete pantallas operativas | Ingreso, panel por rol, listado con búsqueda y cinco filtros, alta en 3 pasos, ficha con 7 pestañas, aprobaciones, calendario, contratantes, reportes, dirección, usuarios, catálogos, bitácora, perfil | | Obligatorio | Entregado |
| Cinco roles con permisos reales | La guarda corre antes de pintar: forzar una ruta prohibida cae en "Sin permiso" sin mostrar el contenido. Matriz de 20 capacidades. Un Profesional ve su honorario y nunca el de otro | | Obligatorio | Entregado |
| Flujo de diez etapas con compuerta | Plantilla de las 10 etapas del ciclo, compuerta de aprobación en la 6, devolver y aprobar desbloquea la siguiente | | Obligatorio | Entregado |
| Trece catálogos controlados | Ningún campo de clasificación acepta texto libre, y el rechazo está en el código, no solo en el formulario | | Obligatorio | Entregado |
| Identidad visual del cliente | Paleta muestreada del logo y del brochure, logo y emblema locales, dos tipografías embebidas, 680 KB en total | | Obligatorio | Entregado |
| Once guiones de verificación | Datos y permisos, sintaxis, navegación, flujos, responsive, barras fijas, ingreso, calendario y reportes, publicación, y la vista previa | | Obligatorio | Entregado |

### Fase 2 — Publicación y revisión remota *(ENTREGADA)*

- **Qué se logra en esta fase:** El cliente puede revisar el sistema desde cualquier dispositivo con
  un enlace, sin descargar nada y sin cuenta.
- **Qué NO entra en esta fase:** Dominio propio, certificado propio, protección con contraseña. La
  URL es pública para quien la tenga y lleva `noindex` para que no aparezca en buscadores.
- **Cuándo se hace:** Hecho.

| Entregable | Qué incluye | Costo | Obligatorio / Opcional | Tiempo estimado |
|---|---|---|---|---|
| Sitio publicado con actualización automática | GitHub Pages sirviendo la rama de trabajo: cada cambio republica la página en un minuto, sin paso de compilación | | Obligatorio | Entregado |
| Copia de una sola página | Generador que empaqueta las 17 pantallas en un archivo, para revisar desde un enlace o abrir con doble clic | | Opcional | Entregado |
| Limpieza de datos de terceros | Los cinco contratantes reales, los nombres y el RIF fuera de la semilla, con la regla documentada | | Obligatorio | Entregado |

### Fase 3 — Inventario forestal y cubicación

- **Qué se logra en esta fase:** El técnico registra cada árbol en campo desde el teléfono con su
  número, especie, coordenadas, CAP y altura de fuste; luego se cubican las trozas y el sistema
  calcula el volumen por Smalian. Salen los reportes de volumen por especie y por rango diamétrico.
- **Qué NO entra en esta fase:** **Ningún mapa.** Las coordenadas se capturan, se guardan y se
  muestran como dato, pero no se dibujan: el visor cartográfico es un desarrollo aparte y posterior.
  Tampoco hay conexión con GPS, drones ni estaciones totales, ni cálculo de carbono.
- **Cuándo se hace:** `POR DEFINIR`

| Entregable | Qué incluye | Costo | Obligatorio / Opcional | Tiempo estimado |
|---|---|---|---|---|
| Corrección de magnitud: CAP en lugar de DAP | El campo de captura pasa a ser circunferencia (CAP), que es lo que se mide con la cinta en campo; el DAP se deriva (`CAP / π`) y se muestra como calculado, nunca se captura; el área basal sale del DAP derivado. Incluye migrar los datos existentes y revisar cada pantalla, reporte y exportación donde hoy dice DAP | | Obligatorio | 8 a 10 horas |
| Modelo de predios, zonas y régimen especial | Predio con superficie y coordenada de referencia; zonas de trabajo dentro del predio; áreas de régimen especial que atraviesan varios predios. Navegación de predio a zona y de zona a árboles, filtro dentro de filtro | | Obligatorio | 12 a 15 horas |
| Registro individual de árboles | Pestaña "Inventario" en la ficha: tabla filtrable por predio, zona, especie y estado, con número, especie, CAP, DAP derivado, altura, volumen estimado y estado; búsqueda y exportación a CSV; ficha de árbol con su historial | | Obligatorio | 16 a 20 horas |
| Formulario de captura en campo | Pensado para teléfono: campos grandes, orden natural de captura y botón de guardar y seguir con el siguiente sin volver al listado. Es el que más se va a usar y el que peor conexión va a tener | | Obligatorio | 10 a 12 horas |
| Cubicación por Smalian | Pestaña "Cubicación": trozas con diámetro de base, de punta y longitud; el sistema calcula `V = ((A_base + A_punta) / 2) × longitud` y **muestra la fórmula usada**; varias trozas por árbol; totales por árbol, especie y proyecto | | Obligatorio | 12 a 15 horas |
| Factores de forma por especie | Catálogo de especies con su factor, su respaldo y quién lo cargó. El volumen en pie se estima **solo si hay factor**; sin factor el sistema dice "sin estimar", explica por qué y ofrece el enlace para cargarlo. Nunca un valor por defecto, nunca 0,5 asumido | | Obligatorio | 8 a 10 horas |
| Fotografías por árbol | Varias por árbol, agrupadas por parte (base, fuste, copa, tocón, general), con quién la subió y cuándo. **En la beta se registran solo por nombre de archivo**: sin servidor no hay dónde guardar la imagen | | Obligatorio | 6 a 8 horas |
| Página de inventario consolidado | `inventario.html` en el menú, con el inventario de todos los proyectos que el rol puede ver y los mismos filtros | | Obligatorio | 8 a 10 horas |
| Cuatro reportes técnicos | Volumen por especie (árboles, área basal, estimado y cubicado); distribución por rango diamétrico; contadores por estado de árbol; resumen de cubicación. Todos exportables | | Obligatorio | 12 a 15 horas |
| Rangos diamétricos configurables | Catálogo editable por especie, con límite inferior y superior | | Opcional | 4 a 5 horas |

### Fase 4 — Administración, costos y cartera

- **Qué se logra en esta fase:** Se registra cada gasto con su origen y quién lo asume; la
  movilización se calcula por kilometraje y tarifa; hay nómina por proyecto y estructura fija que no
  pertenece a ningún proyecto; y la cartera responde si un proyecto deja dinero.
- **Qué NO entra en esta fase:** Procesamiento de pagos, facturación electrónica, conexión con
  ningún sistema contable, y comprobante fotográfico obligatorio (se decidió no exigirlo).
- **Cuándo se hace:** `POR DEFINIR`

| Entregable | Qué incluye | Costo | Obligatorio / Opcional | Tiempo estimado |
|---|---|---|---|---|
| Registro de gastos | `gastos.html` con categoría, concepto, monto, responsable, origen (proyecto, estructura fija o reportado por el contratante), quién lo asume, estado, factura y observación. Filtros por proyecto, categoría, origen, estado y fechas. **Las partidas por liquidar se muestran aparte y no suman al ejecutado** | | Obligatorio | 14 a 18 horas |
| Movilización con tabulador | Al elegir movilización el formulario cambia: vehículo, tipo de vía y kilómetros, y el monto sale de la tarifa mostrando el cálculo. Queda editable con observación obligatoria si se corrige | | Obligatorio | 8 a 10 horas |
| Vehículos y tarifas | Catálogo de vehículos con su valor, y tarifa por kilómetro para vía pavimentada y no pavimentada | | Obligatorio | 5 a 6 horas |
| Nómina por proyecto | `nomina.html`: persona, rol en el proyecto, responsabilidades, monto, periodicidad y estado de pago. Totales por proyecto y período. Es distinta de los honorarios profesionales, que se conservan | | Obligatorio | 10 a 12 horas |
| Estructura fija | `estructura-fija.html`: personal permanente, alquiler o administración propia, condominio, servicios, mantenimiento y vigilancia, con su inmueble. **No pertenece a ningún proyecto** y no debe aparecer dentro de uno | | Obligatorio | 10 a 12 horas |
| Cartera por proyecto | `cartera.html`: contratado, ejecutado, por liquidar y resultado, segregado por actividad y responsable | | Obligatorio | 10 a 12 horas |
| Carga del reporte de gastos del contratante | Registro de un lote de gastos marcados como reportados por el cliente, con fecha de recepción e identificador del reporte | | Opcional | 6 a 8 horas |

### Fase 5 — Los tres roles nuevos y la revisión legal

- **Qué se logra en esta fase:** El Técnico forestal entra y solo ve inventario, sin un solo monto en
  toda la aplicación. El Asesor legal marca la revisión legal de la etapa 8 y queda registrado quién
  y cuándo. El Gerente de proyecto conduce sus proyectos incluida su parte administrativa.
- **Qué NO entra en esta fase:** Roles configurables por el usuario. La matriz de permisos sigue
  siendo parte del código, no una pantalla de administración de roles.
- **Cuándo se hace:** Conviene hacerla **antes** de las fases 3 y 4, no después: cada módulo nuevo
  hay que autorizarlo para ocho roles en lugar de cinco, y hacerlo al final significa repasar todo.

| Entregable | Qué incluye | Costo | Obligatorio / Opcional | Tiempo estimado |
|---|---|---|---|---|
| Tres roles nuevos en la matriz | Gerente de proyecto, Técnico forestal de campo y Asesor legal, con sus capacidades, su menú y su entrada en la pantalla de usuarios | | Obligatorio | 8 a 10 horas |
| Paso de revisión legal en la etapa 8 | El Asesor legal la marca como revisada, queda con autor y fecha, y mientras no esté marcada la ficha lo muestra como pendiente | | Obligatorio | 5 a 6 horas |
| Nueve catálogos nuevos | Estados de árbol, partes del árbol, tipos de régimen especial, categorías de gasto ampliadas, tipos de vía, conceptos de estructura fija, tipos de inmueble, rangos diamétricos y especies con factor | | Obligatorio | 8 a 10 horas |
| Datos de ejemplo del levantamiento | Tres predios en dos proyectos con sus zonas y un régimen especial que atraviesa dos predios; sesenta árboles con coordenadas coherentes y CAP entre 40 y 220 cm; factores para tres de cuatro especies **y la cuarta sin factor a propósito**, para que se vea el mensaje de "sin estimar"; quince trozas cubicadas; cuarenta gastos en ocho categorías con tres de movilización, dos por liquidar y cinco del contratante; dos vehículos con tarifas; nómina en dos proyectos y una estructura fija con dos inmuebles | | Obligatorio | 10 a 12 horas |

### Fase 6 — De demostración a sistema: servidor, base de datos y autenticación

- **Qué se logra en esta fase:** Deja de ser una demostración. Los datos se comparten entre el
  equipo, sobreviven a cualquier navegador, y cada persona entra con su propia contraseña de verdad.
- **Qué NO entra en esta fase:** Aplicación móvil nativa, trabajo sin conexión con sincronización
  posterior, ni firma electrónica. **Esta es la fase que decide si el sistema se puede usar en
  producción o no**, y ninguna de las anteriores la sustituye.
- **Cuándo se hace:** `POR DEFINIR`. Es la única fase sin la cual el sistema no se puede usar de
  verdad, por muchos módulos que tenga.

| Entregable | Qué incluye | Costo | Obligatorio / Opcional | Tiempo estimado |
|---|---|---|---|---|
| Servidor y base de datos | Lo que hoy es `localStorage` en cada navegador pasa a una base de datos compartida. Incluye el modelo de datos completo, las migraciones y el despliegue | | Obligatorio | 40 a 55 horas |
| Autenticación real | Contraseñas con cifrado, sesiones, recuperación por correo y cambio de contraseña. **Hoy la contraseña es la misma para las ocho cuentas y está impresa en la pantalla de entrada** | | Obligatorio | 20 a 26 horas |
| Permisos verificados en el servidor | Hoy la guarda corre en el navegador, que es lo correcto para una demostración pero no basta para un sistema real: quien manipule el navegador se salta la guarda. Cada operación tiene que autorizarse también del lado del servidor | | Obligatorio | 16 a 20 horas |
| Almacenamiento real de archivos | Documentos y fotografías de árbol se suben y se descargan de verdad, con control de versiones. **Hoy solo se registra el nombre del archivo** | | Obligatorio | 18 a 22 horas |
| Respaldo automático | Copia diaria con retención y prueba de restauración | | Obligatorio | 8 a 10 horas |
| Bitácora del lado del servidor | La auditoría deja de poder alterarse desde el navegador | | Obligatorio | 8 a 10 horas |
| Retirada de todo lo de demostración | Barra de demo, ingreso de prueba, botón de reiniciar datos, marca BETA, semilla completa y los avisos que explican las limitaciones. Está enumerado uno por uno en `CLAUDE.md` | | Obligatorio | 5 a 6 horas |

### Fase 7 — Puesta en marcha y acompañamiento

- **Qué se logra en esta fase:** El equipo de MONPICA usa el sistema con sus proyectos reales.
- **Qué NO entra en esta fase:** Soporte indefinido. El período de acompañamiento es acotado y hay
  que fijarlo.
- **Cuándo se hace:** `POR DEFINIR`

| Entregable | Qué incluye | Costo | Obligatorio / Opcional | Tiempo estimado |
|---|---|---|---|---|
| Carga de los proyectos en curso | Los expedientes abiertos, sus etapas, su equipo y su histórico de gasto | | Obligatorio | `POR DEFINIR` — depende de cuántos proyectos y en qué formato están hoy |
| Capacitación por rol | Una sesión por grupo: coordinación, campo, administración y dirección | | Obligatorio | 8 a 12 horas |
| Manual de uso | Guía corta por rol, con las pantallas reales | | Opcional | 8 a 10 horas |
| Acompañamiento posterior | Período acotado de corrección de defectos y ajustes de uso | | Opcional | `POR DEFINIR` |

## 5. Comprobación de números

| Concepto | Monto |
|---|---|
| Suma de todos los entregables **obligatorios** | `POR DEFINIR` — sin precios cargados |
| Suma de todos los entregables **opcionales** | `POR DEFINIR` |
| **Total (obligatorios + opcionales)** | `POR DEFINIR` |
| ¿Coincide con el presupuesto de la sección 3? | No aplica: no hay presupuesto de referencia |

**Lo que sí cuadra: las horas.** Sirven para poner precio por hora o para dimensionar.

| Concepto | Horas |
|---|---|
| Fase 3 · Inventario y cubicación (obligatorio) | 92 a 115 |
| Fase 3 · Opcional | 4 a 5 |
| Fase 4 · Administración y costos (obligatorio) | 57 a 70 |
| Fase 4 · Opcional | 6 a 8 |
| Fase 5 · Roles nuevos y catálogos (obligatorio) | 31 a 38 |
| Fase 6 · Servidor, autenticación y archivos (obligatorio) | 115 a 149 |
| Fase 7 · Puesta en marcha (obligatorio, sin la carga de datos) | 8 a 12 |
| Fase 7 · Opcional | 8 a 10 |
| **Total obligatorio (fases 3 a 7)** | **303 a 384** |
| **Total con opcionales** | **321 a 407** |

## 6. Tiempos de entrega

| Campo | Valor |
|---|---|
| Tiempo estimado de entrega completo | `POR DEFINIR` en calendario, porque depende de la dedicación semanal acordada. Sobre las horas: fases 3 a 5 son 180 a 223 horas; la fase 6 son 115 a 149 más. |
| ¿Qué puede retrasar el proyecto? | (1) Los factores de forma por especie los tiene que aportar MONPICA: el sistema no los puede inventar, y sin ellos el volumen en pie no se estima. (2) Las tarifas de kilometraje por vehículo y tipo de vía. (3) La decisión sobre el repositorio público, que condiciona si se puede trabajar con datos reales. (4) El formato en que estén hoy los proyectos en curso, para la carga inicial. (5) Si el visor cartográfico se adelanta, cambia el alcance de la fase 3. |
| ¿Hay una fecha tope real? | `POR DEFINIR` |

**Lo que necesitamos del cliente para cumplir el plazo:**

| Qué se necesita | Por qué y cuánto tarda | Quién lo gestiona |
|---|---|---|
| Factores de forma por especie, con su respaldo | Sin factor el volumen en pie no se estima: el sistema muestra "sin estimar" y explica por qué. Es una decisión técnica de la empresa, no un dato que se pueda asumir. **Nunca se va a usar 0,5 por defecto** | MONPICA — su ingeniero forestal |
| Tarifas de kilometraje por vehículo y tipo de vía | Es lo que multiplica los kilómetros para calcular el gasto de movilización. Sin la tabla, el módulo no puede calcular nada | MONPICA — administración |
| Decisión sobre el repositorio: público o privado | Hoy es público, y por eso la semilla no puede llevar datos reales. Pasarlo a privado permite demostrar con la cartera real, pero el hosting gratuito deja de aplicar. **El historial de git también es público**: los nombres de los cinco clientes y el RIF siguen legibles en los commits anteriores, y eso solo se cierra pasando el repositorio a privado o reescribiendo el historial | MONPICA decide; nosotros ejecutamos |
| RIF y contactos de los contratantes reales | Están en "Dato de ejemplo" a propósito: no se inventa un número fiscal de una empresa que existe. Van cuando el repositorio sea privado | MONPICA |
| Confirmar si "RECURSO HÍBRIDOS" del brochure es "HÍDRICOS" | Se usó la palabra corregida en el catálogo de tipos de proyecto. Si el brochure está bien y quisieron decir otra cosa, hay que cambiarlo; si está mal, el documento sale a clientes con la falta | MONPICA |
| Decisión sobre exigir factura en cada gasto | El campo existe y se registra, pero no es obligatorio: se decidió no exigir comprobante fotográfico. Hacerlo obligatorio es una decisión del cliente, no una limitación técnica | MONPICA |
| Servidor y dominio, si se hace la fase 6 | Habilitar hosting, dominio y certificado suele tardar días entre trámite y propagación | `POR DEFINIR` quién lo contrata |
| Proyectos en curso en formato utilizable | Para la carga inicial. Cuánto tarda depende de si están en hojas de cálculo o en papel | MONPICA |

## 7. Lo que NO incluye el presupuesto

- **Hosting, dominio y certificado.** Hoy el sitio está en GitHub Pages, que es gratuito porque el
  repositorio es público. Un sistema real con servidor y base de datos tiene costo mensual recurrente
  que no es parte del desarrollo.
- **Visor cartográfico y mapas.** Las coordenadas se capturan y se muestran como dato; dibujarlas
  sobre un mapa, con los polígonos de predios y regímenes especiales superpuestos, es un desarrollo
  aparte. Se excluyó explícitamente.
- **Aplicación móvil nativa.** El formulario de campo está pensado para el navegador del teléfono.
  Una app instalable, con trabajo sin conexión y sincronización posterior, es otro proyecto.
- **Portal de contratantes funcional.** `fase2-portal.html` es y sigue siendo una pantalla
  explicativa.
- **Asistente de informes funcional.** `fase3-asistente.html` igual.
- **Cálculo de carbono y servicios ambientales.** Excluido explícitamente.
- **Conexión con drones, GPS o estaciones totales.** Excluido explícitamente.
- **Facturación electrónica y procesamiento de pagos.** El sistema registra montos; no cobra ni
  factura.
- **Integración con sistemas contables o ERP.** No se mencionó ninguno.
- **Firma electrónica y sellado criptográfico.** El export de diseño original los dibujaba; se
  descartaron a propósito.
- **Correos, notificaciones externas y mensajería interna.** El sistema no envía nada.
- **Multi-idioma.** Todo en español.
- **Soporte indefinido.** El acompañamiento posterior es un período acotado que hay que fijar.
- **Migración de datos históricos más allá de los proyectos en curso.** Cargar años de expedientes
  cerrados es un trabajo aparte que depende del formato.

## 8. Detalles técnicos

| Campo | Valor |
|---|---|
| Tecnología o plataforma pedida | Impuesta por el encargo original y respetada: **HTML, CSS y JavaScript planos. Sin compilación, sin npm, sin bundler, sin framework.** Se publica copiando la carpeta y funciona abriendo el archivo con doble clic, sin servidor y sin red. Sin módulos ES ni `fetch` de archivos locales, porque los dos fallan con `file://`. Sin CDN ni tipografías remotas. La fase 6 necesita elegir servidor y base de datos, y eso está `POR DEFINIR`. |
| Integraciones necesarias | Ninguna, y es deliberado. Sin pagos, sin correo, sin CRM, sin ERP, sin terceros. Cualquier dependencia que exija internet para que la página se vea está prohibida por el encargo. |
| ¿Necesita cuentas de terceros? ¿Quién las abre? | Hoy ninguna. Para la fase 6: hosting, base de datos y servicio de correo para la recuperación de contraseña. `POR DEFINIR` quién los contrata. |
| ¿Hay datos que migrar de otro sistema? | Sí: los proyectos en curso. `POR DEFINIR` en qué formato están. |
| Requisitos legales o de facturación del país | Venezuela: RIF como identificador fiscal, montos en dólares y fechas `DD/MM/AAAA` — ya implementado. No se pidió facturación fiscal ni libros contables. `POR DEFINIR` si el sistema tiene que producir algún formato exigido por organismos ambientales o forestales para la permisología. |

### Reglas del sistema que conviene no romper al cotizar

Salen del encargo y del levantamiento, y afectan al alcance:

1. **El volumen se calcula, pero con condiciones.** La cubicación de trozas por Smalian sí se
   calcula: sus tres datos de entrada determinan el resultado. El volumen del árbol en pie se estima
   **solo si existe factor de forma cargado para esa especie**; sin factor, "sin estimar" y la razón.
   Nunca un valor por defecto. Toda pantalla que muestre un volumen estimado indica qué factor usó.
2. **Ningún campo de clasificación acepta texto libre**, y el rechazo está en el código, no solo en
   el formulario.
3. **El permiso se aplica en la guarda, no en el menú.** Esconder el enlace no basta. En la fase 6,
   además, del lado del servidor.
4. **El Profesional ve el equipo pero solo su propio honorario.** Dirección es el caso inverso: ve el
   total, no el desglose. El Técnico forestal no ve **ningún** monto.
5. **La bitácora no se edita ni se borra**, y no hay borrado físico de usuarios.
6. **Todo en español, fechas `DD/MM/AAAA`, montos en dólares.**

## 9. Fases futuras (lo que queda para después)

- **Visor cartográfico.** Dibujar predios, zonas y regímenes especiales sobre un mapa, con los
  polígonos superpuestos. El modelo de datos de la fase 3 ya guarda las coordenadas para que esto
  sea posible sin rehacer nada.
- **Portal de contratantes.** Que el cliente entre a ver el avance de su propio proyecto. Hay una
  pantalla explicativa que describe el alcance.
- **Asistente de informes.** Generación asistida del informe final desde los datos capturados. Hay
  pantalla explicativa.
- **Aplicación móvil instalable con trabajo sin conexión.** El caso de uso está claro: el técnico en
  campo sin señal. Hoy se resuelve con el navegador, que necesita conexión al guardar.
- **Carbono y servicios ambientales.** Mencionado como fuera de alcance.
- **Integración con instrumentos.** Drones, GPS y estaciones totales.
- **Pantalla de administración de roles.** Hoy la matriz de permisos es código.

## 10. Cualquier otra cosa relevante

```
Tres cosas que conviene tener claras antes de presentar la cotización.

1. El ingreso PARECE un inicio de sesión y no lo es. La contraseña es la misma para las ocho
   cuentas, está impresa en la pantalla y la comprobación ocurre en el navegador. Si alguien en
   la reunión concluye que "ya tiene autenticación", hay que corregirlo en el momento: eso es
   la fase 6 y es la más grande de todas.

2. El orden natural no es el orden del levantamiento. Los tres roles nuevos y los catálogos
   (fase 5) conviene hacerlos ANTES del inventario y de los costos, no después: cada módulo
   nuevo hay que autorizarlo para ocho roles en vez de cinco, y dejarlo para el final obliga a
   repasar todo lo construido.

3. La fase 6 no es opcional aunque esté al final. Un sistema donde los datos viven en el
   navegador de cada persona no se comparte entre el equipo y se pierde si alguien limpia su
   navegador. Se pueden agregar todos los módulos de las fases 3 a 5 y seguir sin tener un
   sistema usable. Si el cliente tiene que elegir por presupuesto, la pregunta correcta no es
   "qué módulo quito" sino "quiero una demostración más completa o quiero empezar a usarlo".
```

---

## Bloque opcional para acelerar la carga

```json
{
  "client": {
    "name": "POR DEFINIR",
    "company": "MONPICA — Montilla Proyectos Integrales C.A.",
    "contact_name": "POR DEFINIR",
    "email": "monpica2025@gmail.com",
    "phone": "0414-536 53 05"
  },
  "project_name": "Sistema de Gestión de Proyectos Integrales MONPICA",
  "summary": "Sistema donde MONPICA lleva sus proyectos de consultoría de punta a punta: las diez etapas de cada expediente, el inventario forestal en campo con cubicación, los costos y la cartera. Hay una beta navegable completa entregada; falta el levantamiento forestal y administrativo, y convertirla en sistema real con servidor.",
  "hero_note": "Beta navegable entregada y publicada. Lo que sigue son dos cosas separables: agregar el inventario forestal y los costos, y convertir la demostración en un sistema de verdad.",
  "currency": "USD",
  "phases": [
    {
      "name": "Inventario forestal y cubicación",
      "objective": "El técnico registra cada árbol en campo desde el teléfono con CAP, altura y coordenadas; se cubican las trozas por Smalian y salen los reportes de volumen por especie y rango diamétrico.",
      "scope_limit": "Ningún mapa: las coordenadas se guardan y se muestran como dato, no se dibujan. Sin GPS, drones ni estaciones totales. Sin cálculo de carbono. Las fotografías se registran solo por nombre mientras no haya servidor.",
      "timeline": "POR DEFINIR",
      "items": [
        { "title": "Corrección de magnitud: CAP en lugar de DAP", "description": "El campo de captura pasa a circunferencia, que es lo que se mide con cinta; el DAP se deriva y se muestra como calculado; el área basal sale del DAP derivado. Incluye migrar los datos y revisar cada pantalla, reporte y exportación.", "cost": 0, "mandatory": "required", "time_estimate": "8 a 10 horas" },
        { "title": "Modelo de predios, zonas y régimen especial", "description": "Predio con superficie y coordenada; zonas dentro del predio; áreas de régimen especial que atraviesan varios predios. Navegación de predio a zona y de zona a árboles.", "cost": 0, "mandatory": "required", "time_estimate": "12 a 15 horas" },
        { "title": "Registro individual de árboles", "description": "Pestaña Inventario con tabla filtrable por predio, zona, especie y estado; ficha de árbol con su historial; búsqueda y exportación.", "cost": 0, "mandatory": "required", "time_estimate": "16 a 20 horas" },
        { "title": "Formulario de captura en campo", "description": "Para teléfono: campos grandes, orden natural y guardar y seguir con el siguiente sin volver al listado.", "cost": 0, "mandatory": "required", "time_estimate": "10 a 12 horas" },
        { "title": "Cubicación por Smalian", "description": "Trozas con diámetro de base, de punta y longitud; el sistema calcula el volumen y muestra la fórmula; varias trozas por árbol; totales por árbol, especie y proyecto.", "cost": 0, "mandatory": "required", "time_estimate": "12 a 15 horas" },
        { "title": "Factores de forma por especie", "description": "Catálogo con factor, respaldo y autor. El volumen en pie se estima solo si hay factor; sin factor dice sin estimar y ofrece cargarlo. Nunca un valor por defecto.", "cost": 0, "mandatory": "required", "time_estimate": "8 a 10 horas" },
        { "title": "Fotografías por árbol", "description": "Varias por árbol agrupadas por parte, con autor y fecha. Registradas solo por nombre mientras no haya servidor.", "cost": 0, "mandatory": "required", "time_estimate": "6 a 8 horas" },
        { "title": "Página de inventario consolidado", "description": "Inventario de todos los proyectos que el rol puede ver, con los mismos filtros.", "cost": 0, "mandatory": "required", "time_estimate": "8 a 10 horas" },
        { "title": "Cuatro reportes técnicos", "description": "Volumen por especie, distribución por rango diamétrico, contadores por estado de árbol y resumen de cubicación. Exportables.", "cost": 0, "mandatory": "required", "time_estimate": "12 a 15 horas" },
        { "title": "Rangos diamétricos configurables", "description": "Catálogo editable por especie con límite inferior y superior.", "cost": 0, "mandatory": "optional", "time_estimate": "4 a 5 horas" }
      ]
    },
    {
      "name": "Administración, costos y cartera",
      "objective": "Cada gasto con su origen y quién lo asume; movilización calculada por kilometraje y tarifa; nómina por proyecto; estructura fija fuera de los proyectos; y la cartera que responde si un proyecto deja dinero.",
      "scope_limit": "Sin procesamiento de pagos, sin facturación electrónica, sin conexión con sistemas contables, y sin comprobante fotográfico obligatorio.",
      "timeline": "POR DEFINIR",
      "items": [
        { "title": "Registro de gastos", "description": "Categoría, concepto, monto, responsable, origen, quién lo asume, estado y factura. Filtros por proyecto, categoría, origen, estado y fechas. Las partidas por liquidar no suman al ejecutado.", "cost": 0, "mandatory": "required", "time_estimate": "14 a 18 horas" },
        { "title": "Movilización con tabulador", "description": "Vehículo, tipo de vía y kilómetros; el monto sale de la tarifa mostrando el cálculo, editable con observación obligatoria.", "cost": 0, "mandatory": "required", "time_estimate": "8 a 10 horas" },
        { "title": "Vehículos y tarifas", "description": "Vehículos con su valor y tarifa por kilómetro para vía pavimentada y no pavimentada.", "cost": 0, "mandatory": "required", "time_estimate": "5 a 6 horas" },
        { "title": "Nómina por proyecto", "description": "Persona, rol en el proyecto, responsabilidades, monto, periodicidad y estado de pago. Distinta de los honorarios profesionales.", "cost": 0, "mandatory": "required", "time_estimate": "10 a 12 horas" },
        { "title": "Estructura fija", "description": "Personal permanente, alquiler o administración propia, condominio, servicios, mantenimiento y vigilancia, con su inmueble. No pertenece a ningún proyecto.", "cost": 0, "mandatory": "required", "time_estimate": "10 a 12 horas" },
        { "title": "Cartera por proyecto", "description": "Contratado, ejecutado, por liquidar y resultado, segregado por actividad y responsable.", "cost": 0, "mandatory": "required", "time_estimate": "10 a 12 horas" },
        { "title": "Carga del reporte de gastos del contratante", "description": "Lote de gastos marcados como reportados por el cliente, con fecha de recepción e identificador.", "cost": 0, "mandatory": "optional", "time_estimate": "6 a 8 horas" }
      ]
    },
    {
      "name": "Los tres roles nuevos y la revisión legal",
      "objective": "El Técnico forestal entra y solo ve inventario, sin un solo monto. El Asesor legal marca la revisión legal de la etapa 8 con autor y fecha. El Gerente de proyecto conduce sus proyectos incluida su parte administrativa.",
      "scope_limit": "La matriz de permisos sigue siendo código, no una pantalla de administración de roles.",
      "timeline": "Conviene antes de las fases de inventario y costos, no después.",
      "items": [
        { "title": "Tres roles nuevos en la matriz", "description": "Gerente de proyecto, Técnico forestal y Asesor legal, con capacidades, menú y entrada en usuarios.", "cost": 0, "mandatory": "required", "time_estimate": "8 a 10 horas" },
        { "title": "Paso de revisión legal en la etapa 8", "description": "El Asesor legal la marca como revisada con autor y fecha; sin marcar, la ficha lo muestra pendiente.", "cost": 0, "mandatory": "required", "time_estimate": "5 a 6 horas" },
        { "title": "Nueve catálogos nuevos", "description": "Estados de árbol, partes del árbol, tipos de régimen especial, categorías de gasto, tipos de vía, conceptos de estructura fija, tipos de inmueble, rangos diamétricos y especies con factor.", "cost": 0, "mandatory": "required", "time_estimate": "8 a 10 horas" },
        { "title": "Datos de ejemplo del levantamiento", "description": "Tres predios, sesenta árboles con CAP entre 40 y 220 cm, factores para tres de cuatro especies y la cuarta sin factor a propósito, quince trozas, cuarenta gastos, dos vehículos, nómina en dos proyectos y estructura fija con dos inmuebles.", "cost": 0, "mandatory": "required", "time_estimate": "10 a 12 horas" }
      ]
    },
    {
      "name": "De demostración a sistema: servidor, base de datos y autenticación",
      "objective": "Los datos se comparten entre el equipo, sobreviven a cualquier navegador, y cada persona entra con su propia contraseña de verdad.",
      "scope_limit": "Sin app móvil nativa, sin trabajo sin conexión con sincronización posterior, sin firma electrónica. Es la fase que decide si el sistema se puede usar en producción; ninguna de las anteriores la sustituye.",
      "timeline": "POR DEFINIR",
      "items": [
        { "title": "Servidor y base de datos", "description": "Lo que hoy es localStorage en cada navegador pasa a una base compartida: modelo de datos, migraciones y despliegue.", "cost": 0, "mandatory": "required", "time_estimate": "40 a 55 horas" },
        { "title": "Autenticación real", "description": "Contraseñas cifradas, sesiones, recuperación por correo y cambio de contraseña. Hoy la contraseña es la misma para las ocho cuentas y está impresa en pantalla.", "cost": 0, "mandatory": "required", "time_estimate": "20 a 26 horas" },
        { "title": "Permisos verificados en el servidor", "description": "Hoy la guarda corre en el navegador, correcto para una demostración pero insuficiente: quien manipule el navegador se la salta. Cada operación se autoriza también en el servidor.", "cost": 0, "mandatory": "required", "time_estimate": "16 a 20 horas" },
        { "title": "Almacenamiento real de archivos", "description": "Documentos y fotografías se suben y descargan de verdad, con versiones. Hoy solo se registra el nombre.", "cost": 0, "mandatory": "required", "time_estimate": "18 a 22 horas" },
        { "title": "Respaldo automático", "description": "Copia diaria con retención y prueba de restauración.", "cost": 0, "mandatory": "required", "time_estimate": "8 a 10 horas" },
        { "title": "Bitácora del lado del servidor", "description": "La auditoría deja de poder alterarse desde el navegador.", "cost": 0, "mandatory": "required", "time_estimate": "8 a 10 horas" },
        { "title": "Retirada de todo lo de demostración", "description": "Barra de demo, ingreso de prueba, reiniciar datos, marca BETA, semilla y avisos de limitaciones. Enumerado uno por uno en CLAUDE.md.", "cost": 0, "mandatory": "required", "time_estimate": "5 a 6 horas" }
      ]
    },
    {
      "name": "Puesta en marcha y acompañamiento",
      "objective": "El equipo de MONPICA usa el sistema con sus proyectos reales.",
      "scope_limit": "El acompañamiento es un período acotado que hay que fijar, no soporte indefinido.",
      "timeline": "POR DEFINIR",
      "items": [
        { "title": "Carga de los proyectos en curso", "description": "Expedientes abiertos, etapas, equipo e histórico de gasto. El tiempo depende de cuántos y en qué formato están.", "cost": 0, "mandatory": "required", "time_estimate": "POR DEFINIR" },
        { "title": "Capacitación por rol", "description": "Una sesión por grupo: coordinación, campo, administración y dirección.", "cost": 0, "mandatory": "required", "time_estimate": "8 a 12 horas" },
        { "title": "Manual de uso", "description": "Guía corta por rol con las pantallas reales.", "cost": 0, "mandatory": "optional", "time_estimate": "8 a 10 horas" },
        { "title": "Acompañamiento posterior", "description": "Período acotado de corrección de defectos y ajustes de uso.", "cost": 0, "mandatory": "optional", "time_estimate": "POR DEFINIR" }
      ]
    }
  ],
  "excluded": [
    "Hosting, dominio y certificado: costo mensual recurrente, no parte del desarrollo",
    "Visor cartográfico y mapas: las coordenadas se guardan y se muestran como dato, dibujarlas es un desarrollo aparte",
    "Aplicación móvil nativa con trabajo sin conexión",
    "Portal de contratantes funcional: queda como pantalla explicativa",
    "Asistente de informes funcional: queda como pantalla explicativa",
    "Cálculo de carbono y servicios ambientales",
    "Conexión con drones, GPS o estaciones totales",
    "Facturación electrónica y procesamiento de pagos",
    "Integración con sistemas contables o ERP",
    "Firma electrónica y sellado criptográfico",
    "Correos, notificaciones externas y mensajería interna",
    "Multi-idioma: todo en español",
    "Soporte indefinido: el acompañamiento es un período acotado",
    "Migración de expedientes históricos más allá de los proyectos en curso"
  ],
  "dependencies": [
    { "title": "Factores de forma por especie, con su respaldo", "description": "Sin factor el volumen en pie no se estima: el sistema dice sin estimar y explica por qué. Es una decisión técnica de la empresa, no un dato que se pueda asumir, y nunca se usará 0,5 por defecto.", "responsible": "MONPICA — su ingeniero forestal" },
    { "title": "Tarifas de kilometraje por vehículo y tipo de vía", "description": "Es lo que multiplica los kilómetros para calcular el gasto de movilización. Sin la tabla el módulo no calcula.", "responsible": "MONPICA — administración" },
    { "title": "Decisión sobre el repositorio: público o privado", "description": "Hoy es público y por eso la semilla no puede llevar datos reales. El historial de git también es público: los nombres de los cinco clientes y el RIF siguen legibles en commits anteriores, y eso solo se cierra pasando el repositorio a privado o reescribiendo el historial.", "responsible": "MONPICA decide, nosotros ejecutamos" },
    { "title": "RIF y contactos de los contratantes reales", "description": "Están en Dato de ejemplo a propósito: no se inventa un número fiscal de una empresa que existe. Van cuando el repositorio sea privado.", "responsible": "MONPICA" },
    { "title": "Confirmar si RECURSO HÍBRIDOS del brochure es HÍDRICOS", "description": "Se usó la palabra corregida en el catálogo de tipos de proyecto. Si el brochure está mal, ese documento sale a clientes con la falta.", "responsible": "MONPICA" },
    { "title": "Decisión sobre exigir factura en cada gasto", "description": "El campo existe y se registra pero no es obligatorio. Hacerlo obligatorio es una decisión del cliente, no una limitación técnica.", "responsible": "MONPICA" },
    { "title": "Servidor y dominio para la fase de producción", "description": "Habilitar hosting, dominio y certificado suele tardar días entre trámite y propagación.", "responsible": "POR DEFINIR" },
    { "title": "Proyectos en curso en formato utilizable", "description": "Para la carga inicial. El tiempo depende de si están en hojas de cálculo o en papel.", "responsible": "MONPICA" }
  ]
}
```

`mandatory` solo acepta `"required"` u `"optional"`. Los `cost` están en `0` porque no hay
presupuesto de referencia: hay que cargarlos antes de generar el PDF.
