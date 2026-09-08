# CLAUDE.md — Beta navegable · Sistema de Proyectos Integrales

Notas para quien retome este proyecto. La bitácora de decisiones está en `PROGRESO.md`.

## Qué es esto

Una beta navegable de un sistema de gestión de proyectos para una consultora ambiental y forestal
venezolana. Se construyó para presentarla en una reunión con el cliente, en una sala donde la
conexión puede fallar.

Son HTML, CSS y JavaScript planos. **Sin compilación, sin npm, sin bundler, sin framework.** Se
publica copiando la carpeta. Funciona abriendo `index.html` con doble clic, sin servidor y sin red.

## Cómo se prueba

```bash
python3 -m http.server 8080     # y abrir http://localhost:8080
```

Pero el escenario de la reunión es `file://`: abrir `index.html` directamente, con la red apagada.
Todo cambio debe probarse ahí, porque es lo que se rompe primero.

## Cómo está organizado

```
index.html              selector de rol; la entrada al sistema
panel.html              inicio, distinto para cada rol
proyectos.html          listado con búsqueda, cinco filtros y orden por columna
proyecto-nuevo.html     asistente de alta en 3 pasos
proyecto.html           ficha con 7 pestañas   →  ?id=PI-2024-001&tab=etapas
aprobaciones.html       cola de etapas esperando decisión
calendario.html         plazos de todas las etapas abiertas
contratantes.html       directorio en maestro-detalle
reportes.html           cuatro reportes con exportación a CSV e impresión
direccion.html          consolidado de cartera. La única pantalla en oscuro
usuarios.html           usuarios, roles y matriz de permisos
catalogos.html          las listas controladas del sistema
bitacora.html           auditoría general
perfil.html             datos propios y reinicio de los datos de ejemplo
sin-permiso.html        a donde cae una ruta prohibida
fase2-portal.html       maqueta sin funcionamiento
fase3-asistente.html    maqueta sin funcionamiento

assets/
  tokens.css   variables visuales extraídas del export de Stitch
  app.css      estilos de la aplicación, construidos contra esas variables
  fonts/       dos tipografías variables locales, 65 KB en total
  icons.js     sprite SVG de 70 iconos, inyectado en línea
  seed.js      datos de ejemplo
  store.js     persistencia en localStorage, altas y bajas, escritura de bitácora
  auth.js      rol activo, matriz de permisos, guardas de página
  ui.js        tabla, filtros, modal, aviso, estado vacío, exportación
  shell.js     inyecta la barra superior, el menú lateral y el tema oscuro
  demo.js      barra de demostración. SE ELIMINA ANTES DE UN USO REAL

stitch/        export original de Stitch. Solo referencia, no se publica
```

Las 23 páginas de la especificación caben en estos 17 archivos: las páginas 5 a 11 son las siete
pestañas de `proyecto.html`.

### Orden de carga, y por qué es ese

En el `<head>`, antes de pintar: `seed.js` → `store.js` → `auth.js`. La guarda de permisos tiene que
correr antes de que se vea nada, porque el permiso no puede ser solo esconder el enlace del menú:
escribir a mano la dirección de una página prohibida debe caer en `sin-permiso.html` sin mostrar el
contenido. El `<body>` arranca con la clase `pi-verificando`, que lo mantiene invisible hasta que el
marco se monta.

Al final del `<body>`: `icons.js` → `ui.js` → `demo.js` → `shell.js` → el guion de la página.
El guion de cada página se envuelve en `PI.listo(...)`, que espera a que `shell.js` haya montado el
marco. Funciona porque `shell.js` registra su oyente antes de que la página llame a `PI.listo`.

Todo cuelga de un solo objeto global, `window.PI`. Nada de módulos ES ni `fetch` de archivos
locales: los dos fallan al abrir con `file://`.

## Dónde viven los datos de ejemplo

En `assets/seed.js`, que define `window.PI_SEED` como una **función**, no como un objeto. Es
deliberado: las fechas se generan relativas al día en que se siembra, así que en cada ensayo de la
demo siempre hay etapas vencidas y plazos próximos, sin tener que editar nada.

Al abrir cualquier página, `store.js` busca la clave `PI_BETA_DATOS_V3` en `localStorage`. Si no
existe, o si su `version` no es 3, siembra de nuevo. Para forzar una resiembra tras cambiar la
estructura de los datos, sube ese número de versión en los dos archivos.

La semilla trae ocho usuarios que cubren los cinco roles, seis contratantes, seis proyectos en
estados distintos (uno detenido esperando aprobación, uno con dos etapas vencidas), mediciones en
tres parcelas, movimientos en más de seis categorías con partidas por liquidar, y treinta registros
de bitácora de días anteriores.

## Cómo se agrega una página

1. Añade el archivo a `PAGINAS` en `assets/auth.js`: título, icono, los roles que pueden verla y, si
   va en el menú, `menu: true` y el grupo. Con eso ya aparece en el menú de los roles correctos y la
   guarda la protege de los demás. No hay que tocar los otros dieciséis archivos.
2. Copia la cáscara de cualquier página existente. Es siempre la misma: `<head>` con las dos hojas
   de estilo y los tres guiones de datos, `<main class="pi-lienzo">` con un contenedor vacío, y los
   guiones del final.
3. Escribe la lógica en un `<script>` al final, envuelta en `PI.listo(function () { ... })`.
4. Usa las piezas de `ui.js` en vez de escribir HTML a mano: `PI.ui.tabla`, `PI.ui.kpi`,
   `PI.ui.modal`, `PI.ui.badge`, `PI.ui.vacio`, `PI.ui.aviso`, `PI.shell.cabecera`.
5. Si la página necesita una capacidad nueva, añádela a `CAPACIDADES` en `auth.js` y consúltala con
   `PI.auth.puede('miCapacidad')`.

### Reglas de estilo que conviene no romper

- **Nada de estilos en línea para rejillas.** Un `style="grid-template-columns:..."` gana a las
  consultas de medio y rompe la versión móvil. Usa las clases `rejilla-lateral`,
  `rejilla-lateral-sm`, `rejilla-lateral-inv`, `kpis-3`.
- **Cuidado con los nombres de clase genéricos.** `.aviso` es una caja de aviso con `display:flex`,
  y por eso los tonos del indicador llevan prefijo: `tono-ok`, `tono-aviso`, `tono-alerta`. Ya se
  rompió una vez por esto.
- **Las tablas anchas van dentro de `.tabla-envoltura`** y con la clase `responsiva`, más un
  `data-eti` en cada celda: en pantalla de teléfono se convierten en tarjetas apiladas y el cuerpo
  de la página nunca se desplaza en horizontal.
- **Nunca metas una entidad HTML en un texto que pase por `esc()`.** Se ve literalmente en pantalla.
  Usa el carácter.

## Las cinco reglas del sistema

1. **El volumen de madera nunca se calcula.** El sistema captura hectáreas, número de árboles,
   altura, DAP y volumen; el volumen es captura manual del profesional. No hay ninguna ecuación de
   cubicación ni factor de conversión en ninguna parte, y lo único que se hace con los volúmenes es
   sumarlos tal como se capturaron. El único `Math.PI` del proyecto está en `ui.js` y calcula la
   circunferencia del anillo de avance: es geometría de dibujo, y lleva un comentario que lo dice.
2. **Ningún campo de clasificación acepta texto libre.** Tipos, estados, categorías, roles de
   proyecto, tipos de documento y especies salen de `catalogos` en la semilla. `store.js` además
   rechaza en el código cualquier categoría o estado que no esté en el catálogo, no solo en el
   formulario.
3. **El permiso se aplica en la guarda, no en el menú.** Esconder el enlace no basta.
4. **El Profesional ve el equipo del proyecto pero solo el monto de su propio honorario.** En las
   demás filas ve un guion y el total consolidado le queda oculto. Dirección es el caso inverso: ve
   el total, no el desglose persona por persona.
5. **Todo en español, fechas `DD/MM/AAAA`, montos en dólares.**

## Qué hay que quitar antes de un uso real

1. **La barra de demostración.** Borra `assets/demo.js`, borra la línea
   `<script src="assets/demo.js"></script>` de los diecisiete HTML y borra el bloque `.pi-demo` de
   `assets/app.css`. Nada más depende de ella: `shell.js` comprueba si existe antes de montarla.
2. **El selector de rol de `index.html`.** Es la entrada de la demo, no un ingreso real. Un uso real
   necesita autenticación de verdad, y eso necesita servidor.
3. **El botón "Reiniciar datos de ejemplo" de `perfil.html`**, y con él el bloque "Datos de ejemplo"
   de esa misma página.
4. **La marca `Beta · datos de ejemplo`** de la barra superior, en `shell.js`.
5. **`assets/seed.js` completo**, y con él la resiembra automática de `store.js`. Los datos tendrían
   que venir de un servidor.
6. **`stitch/`**, que es material de referencia y no forma parte de lo que se publica.
7. **Los avisos que explican las limitaciones de la beta**: los que dicen que los documentos se
   registran solo por nombre, que no hay servidor, o que los datos no se comparten entre equipos.

Y lo que habría que construir, no quitar: servidor y base de datos, almacenamiento real de archivos,
autenticación, y respaldo. Mientras eso no exista, esto es una demostración, no un sistema.

## Lo que deliberadamente no se construyó

Cálculo de volumen o cubicación. Procesamiento de pagos. Registro público de usuarios o recuperación
de contraseña por correo. Envío de correos, notificaciones externas o integraciones con terceros.
Chat o mensajería interna. Catálogo comercial o captación de clientes. Cualquier dependencia que
exija internet para que la página se vea.

El export de Stitch dibujaba bastante de esto (sellos criptográficos, cadena inmutable, visor
geográfico, facturación electrónica, telemetría de cuadrillas). Se descartó a propósito: en una
demostración, un botón que no hace nada se nota. El detalle está en `PROGRESO.md`.
