# CLAUDE.md — Beta navegable · Sistema de Proyectos Integrales

Notas para quien retome este proyecto. La bitácora de decisiones está en `PROGRESO.md`.

## Qué es esto

Una beta navegable de un sistema de gestión de proyectos para **MONPICA — Montilla Proyectos
Integrales C.A.**, una consultora ambiental, forestal, agrícola y civil de Guanare, estado
Portuguesa. Se construyó para presentarla en una reunión con el cliente, en una sala donde la
conexión puede fallar.

Son HTML, CSS y JavaScript planos. **Sin compilación, sin npm, sin bundler, sin framework.** Se
publica copiando la carpeta. Funciona abriendo `index.html` con doble clic, sin servidor y sin red.

## Cómo se prueba

```bash
python3 -m http.server 8080     # y abrir http://localhost:8080
```

Pero el escenario de la reunión es `file://`: abrir `index.html` directamente, con la red apagada.
Todo cambio debe probarse ahí, porque es lo que se rompe primero.

En `pruebas/` hay ocho guiones que hacen exactamente eso. Los de navegador abren las páginas por
`file://` **abortando toda petición que no sea `file:`, `data:` o `blob:`**, que es la única forma de
sostener la promesa de que funciona sin red.

```bash
node pruebas/datos-y-permisos.js         # la capa de datos, sin navegador
node pruebas/sintaxis-html.js *.html     # compila el <script> de cada página
node pruebas/navegador-navegacion.js     # 17 páginas, 7 pestañas, guardas, cero red
node pruebas/navegador-flujos.js         # los recorridos completos
node pruebas/navegador-responsive.js     # 360, 390, 768 y 1440 px
node pruebas/navegador-barras.js         # barras fijas, --demo-alto y contraste
node pruebas/navegador-ingreso.js        # los ocho usuarios
node pruebas/publicacion.js             # la beta publicada: en vivo y por HTTP
```

Todos salen con código 0 si pasan. Los de navegador necesitan la ruta de Chromium que llevan
escrita arriba; en este entorno es `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`.

## La vista previa de una sola página

Para revisar la beta desde un enlace, sin descargar la carpeta, hay un generador que mete las 17
páginas en un solo archivo:

```bash
node herramientas/empaquetar-vista-previa.js       # escribe vista-previa.html y -suelta.html
node pruebas/vista-previa-navegacion.js            # se empaqueta solo y prueba el resultado
node pruebas/vista-previa-flujos.js
```

**Esto no es el entregable.** El entregable es la carpeta, que se abre con `file://` y sin red. La
vista previa es una copia derivada, y por eso se genera de los archivos reales y nunca a mano: si
cambias una página y no vuelves a generarla, el enlace muestra una versión distinta de la que se
presenta. Las dos pruebas se empaquetan solas en cada corrida para que eso no pueda pasar
inadvertido.

Qué cambia respecto de la carpeta, y por qué:

- **La navegación pasa a ser por `#`**, porque un artifact es un solo documento. El generador
  reescribe mecánicamente los nueve saltos por JS y la función que lee la ruta; si aparece un salto
  nuevo que no sabe reescribir, **falla en vez de emitir una vista previa a medias**.
- **Fuentes, logo y emblema quedan incrustados** como `data:` URI.
- **La exportación a CSV y la impresión no funcionan**: el visor bloquea las descargas que inicia la
  propia página. En vez de dejar botones muertos, avisan en pantalla que eso sí funciona en la
  carpeta real. El CSV se sigue generando y el aviso dice cuántas filas salieron.

Dos trampas que ya se pisaron al construirlo, por si hay que tocarlo:

- **`assets/demo.js` lleva en su cabecera el texto `</script>`**, que es la etiqueta que hay que
  borrar para un uso real. Dentro de un bloque de guion eso cierra el bloque aunque venga en un
  comentario, y partía el paquete en dos. El generador lo escapa y además cuenta las etiquetas de
  cierre del resultado. Un `<script>` de apertura, en cambio, es texto inerte: solo `</script`
  saca al analizador de ahí.
- **El archivo que se publica no lleva `<html>`, `<head>` ni `<body>`**: los pone el publicador. Si
  se abre suelto, los guiones caen en el `<head>` y `document.body` todavía es `null`. Por eso el
  enrutador espera al DOM, y el generador escribe además una copia envuelta (`-suelta.html`) para
  poder probar con un navegador exactamente lo que se publica.

## La beta publicada como página web

**https://rengifojjrr.github.io/app-privada-minec-/**

Está en GitHub Pages, sirviendo la rama por defecto, que es la rama de trabajo. **Cada push
republica la página**, con un minuto de retraso. No hay paso de compilación: `.nojekyll` apaga Jekyll
y Pages entrega los archivos tal cual, que es justo lo que hace falta en un proyecto sin compilación.

Es la carpeta real, no la vista previa de una sola página, así que aquí la navegación entre archivos,
la exportación a CSV y la impresión funcionan igual que en local.

`pruebas/publicacion.js` lo comprueba en dos mitades, y hacen falta las dos. El sitio en vivo se
verifica **con curl**, no con el navegador: en este entorno Chromium no puede salir a la red porque
el relay del proxy le corta los túneles, aunque curl pasa sin problema. Así que curl comprueba que
cada archivo se sirva con su tipo de contenido y su tamaño, y que el `noindex` esté publicado; y
luego los mismos archivos se sirven en local por HTTP y ahí sí entra el navegador, que es donde se
comprueba lo que cambia al pasar de `file://` a HTTP: rutas relativas, tipos MIME, y que el CSV se
descargue de verdad.

### El repositorio es público, y eso importa

A pesar del nombre, `app-privada-minec-` **es un repositorio público**. Cualquiera puede leer el
código, el brochure del cliente, sus logos y su RIF. Es lo que permite que Pages funcione sin pagar,
pero conviene saberlo y no confundirlo con privacidad. Si el cliente quiere que no se vea, hay que
cambiar el repositorio a privado, y entonces Pages exige un plan de pago.

### El noindex no es un detalle

La página muestra el logo y el RIF **reales** de MONPICA junto a ocho personas, todos los montos y
todas las fechas **inventados**. Si un buscador la indexa, alguien puede encontrarla buscando la
empresa y creer que Carlos Montilla Rangel trabaja ahí y que la cartera son 372.500 dólares. Eso ya
no es una demostración, es una ficha falsa de una empresa que existe.

Va por dos caminos, y hacen falta los dos:

- **`robots.txt`** con `Disallow: /`, que pide a los rastreadores que no entren.
- **`<meta name="robots" content="noindex, nofollow">` en las 17 páginas**, que es lo único que da un
  noindex de verdad. GitHub Pages no permite poner cabeceras HTTP, así que no se puede usar
  `X-Robots-Tag`; el meta es el sustituto. Es inerte al abrir con `file://`, así que no afecta al
  entregable.

Si se añade una página nueva, **lleva el meta**. Sin él, esa página sí es indexable.

Pages sirve todo lo que hay en la rama, incluidos `stitch/`, `pruebas/`, `herramientas/` y estas
notas: Pages no tiene un archivo de exclusión. Como el repositorio ya es público, no añade
exposición, pero está dicho para que no sorprenda.

## Cómo está organizado

```
index.html              ingreso por usuario; la entrada al sistema
panel.html              inicio, distinto para cada rol
proyectos.html          listado con búsqueda, cinco filtros y orden por columna
proyecto-nuevo.html     asistente de alta en 3 pasos
proyecto.html           ficha con 7 pestañas   →  ?id=MP-2024-001&tab=etapas
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
  tokens.css   variables visuales: la paleta es de MONPICA, la escala es del export de Stitch
  app.css      estilos de la aplicación, construidos contra esas variables
  marca/       logo, emblema e icono de pestaña del cliente, en PNG local
  fonts/       dos tipografías variables locales, 65 KB en total
  icons.js     sprite SVG de 70 iconos, inyectado en línea
  seed.js      datos de ejemplo
  store.js     persistencia en localStorage, altas y bajas, escritura de bitácora
  auth.js      rol activo, matriz de permisos, guardas de página
  ui.js        tabla, filtros, modal, aviso, estado vacío, exportación
  shell.js     inyecta la barra superior, el menú lateral y el tema oscuro
  demo.js      barra de demostración. SE ELIMINA ANTES DE UN USO REAL

stitch/        export original de Stitch. Solo referencia, no se publica
pruebas/       guiones de verificación. No se publican
herramientas/  generador de la vista previa de una sola página. No se publica

.nojekyll      apaga Jekyll en GitHub Pages: los archivos se sirven tal cual
robots.txt     prohíbe el rastreo. Ver más abajo
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

Al abrir cualquier página, `store.js` busca la clave `PI_BETA_DATOS_V4` en `localStorage`. Si no
existe, o si su `version` no es 4, siembra de nuevo. Para forzar una resiembra tras cambiar la
estructura de los datos, sube ese número de versión en los dos archivos.

La cabecera de `seed.js` dice qué parte de la semilla es real y qué parte es inventada. Resumido: el
contexto, la cartera de servicios, los cinco contratantes y las tres especies comerciales salen del
brochure del cliente; las ocho personas, todos los montos, todas las fechas y todos los códigos son
invento. Los RIF de los contratantes dicen "Por confirmar" a propósito — ver más abajo.

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
- **Los tokens `--superficie-inversa` y `--sobre-superficie-inversa` se invierten con el tema.** Eso
  es lo que significan. Si necesitas cromo que se vea igual en claro y en oscuro — como la barra de
  demostración — dale tokens propios y no los redefinas en `html.oscuro`. La barra ya se rompió una
  vez por esto: en `direccion.html` se volvía clara y su texto quedaba con contraste 1:1.
- **Si un texto y un color dicen lo mismo, tienen que salir del mismo criterio.** `etapaVencida()`
  decide el rojo; `F.plazoEtapa()` decide el texto. Las dos excluyen las etapas aprobadas y
  bloqueadas. Cuando el texto salía de `F.plazo()`, que solo mira la fecha, una etapa aprobada de un
  proyecto viejo se leía como "vencido hace 210 días".
- **Un parámetro de dirección se escribe y se lee con el mismo nombre, sin acentos.** La guarda de
  `auth.js` escribe `?pagina=`, y `sin-permiso.html` lo lee así. Ya se rompió una vez.

## El ingreso

`index.html` es un inicio de sesión por usuario, no por rol: se entra con el correo de una de las
ocho personas de la semilla y la clave que guarda `PI_CLAVE_DEMO` en `seed.js` (hoy `monpica2025`),
y el rol sale del usuario. Las cuentas de
prueba se listan agrupadas por área y se generan de la lista real de usuarios, así que un usuario
creado en `usuarios.html` aparece ahí sin tocar este archivo, y uno desactivado aparece deshabilitado
y no deja entrar.

Es un ingreso honesto, no una simulación: dice en pantalla que es una demostración, muestra la
contraseña, y la comprobación ocurre en el navegador porque no hay servidor. Lo que no tiene, a
propósito, es registro público, recuperación de contraseña por correo ni segundo factor: las tres
cosas están prohibidas por el encargo y ninguna funciona sin servidor.

Las páginas públicas (`index.html` y `sin-permiso.html`) llevan `publica: true` en `auth.js`: no
tienen menú lateral, su barra superior ocupa todo el ancho y no muestra la identidad.

## La marca

La identidad del cliente vive en el objeto `MARCA` de `assets/shell.js`, no en `seed.js`, y la
distinción importa: **es lo único de esta beta que no es un dato de ejemplo**. Razón social, lema,
RIF, sede, correo, teléfono, logo y emblema son los reales, así que sobreviven cuando el sistema
deje de ser una demostración. Todo lo demás de la semilla se borra.

La paleta de `tokens.css` se muestreó del logo y de los vectores del brochure; la cabecera del
archivo lista cada hexadecimal con su procedencia. La marca aporta el color; el export de Stitch
sigue aportando la escala, los radios, el espaciado y la densidad de las tablas. El ámbar de aviso y
el rojo de error **no** son de la marca: el brochure no tiene ninguno, son funcionales y se
eligieron para armonizar con el verde.

El logo y el emblema son PNG locales en `assets/marca/`, con transparencia. Se usan con
`PI.shell.logoCompleto(ancho)` y `PI.shell.emblema(px)`; no hay ningún recurso remoto.

Dos cosas que el cliente tiene que resolver y que conviene no rellenar por cuenta propia:

- **Los RIF y los contactos de los cinco contratantes dicen "Por confirmar".** Son empresas reales
  que el brochure nombra sin dar su RIF. Inventar un número de identificación fiscal para una
  empresa que existe no produce un dato de ejemplo, produce un registro falso. El hueco se dejó a la
  vista a propósito.
- **El brochure dice "RECURSO HÍBRIDOS" y "GESTIÓN HÍBRIDA".** Es casi con seguridad un error de
  tipeo por "HÍDRICOS" e "HÍDRICA". Se usó la palabra corregida en el catálogo `tiposProyecto` de
  `seed.js`.

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
   `<script src="assets/demo.js"></script>` de los diecisiete HTML, y borra de `assets/app.css` el
   bloque `.pi-demo` y de `assets/tokens.css` el bloque de tokens `--demo-*`. Nada más depende de
   ella: `shell.js` comprueba si existe antes de montarla.
2. **El ingreso de `index.html`.** Parece un inicio de sesión, pero no lo es: la lista de cuentas de
   prueba está a la vista, la contraseña es la misma para todas y la comprobación ocurre en el
   navegador. Un uso real necesita autenticación de verdad contra un servidor. También hay que
   borrar `PI_CLAVE_DEMO` de `assets/seed.js`.
3. **El botón "Reiniciar datos de ejemplo" de `perfil.html`**, y con él el bloque "Datos de ejemplo"
   de esa misma página.
4. **La marca `Beta · datos de ejemplo`** de la barra superior, en `shell.js`. El objeto `MARCA`
   de ese mismo archivo **se queda**: son los datos reales del cliente, no de ejemplo.
5. **`assets/seed.js` completo**, y con él la resiembra automática de `store.js`. Los datos tendrían
   que venir de un servidor.
6. **`stitch/`**, que es material de referencia y no forma parte de lo que se publica.
7. **Los avisos que explican las limitaciones de la beta**: los que dicen que los documentos se
   registran solo por nombre, que no hay servidor, o que los datos no se comparten entre equipos.
8. **`pruebas/`**, si se quiere: son guiones de verificación, no forman parte de lo publicable. Pero
   conviene conservarlos mientras el proyecto siga cambiando.

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
