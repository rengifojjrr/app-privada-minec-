/* ============================================================================
   empaquetar-vista-previa.js — Genera UNA sola página con toda la beta dentro,
   para poder revisarla desde un enlace sin descargar nada.

   ESTO NO ES EL ENTREGABLE. El entregable es la carpeta, que se abre con
   file:// y sin red. Esta herramienta produce una copia derivada para revisar.

   Se genera de los archivos reales, nunca a mano: si cambias una página,
   vuelve a correr esto y la vista previa se actualiza. Asi no puede quedar
   contando una version distinta de la que se presenta.

     node herramientas/empaquetar-vista-previa.js

   Que cambia respecto de la carpeta real, y por que:

     - La navegacion pasa a ser por # en la misma pagina, porque un artifact es
       un solo documento. Los 9 saltos por JS y la funcion que lee la ruta se
       reescriben aqui, mecanicamente.
     - Fuentes, logo y emblema quedan incrustados como data: URI.
     - La exportacion a CSV y la impresion no funcionan: el visor bloquea las
       descargas que inicia la propia pagina. En vez de dejar botones muertos,
       se avisa en pantalla que eso si funciona en la carpeta real.
   ========================================================================= */
'use strict';
const fs = require('fs');
const path = require('path');

const RAIZ = path.resolve(__dirname, '..');
const leer = (r) => fs.readFileSync(path.join(RAIZ, r), 'utf8');
const b64 = (r) => fs.readFileSync(path.join(RAIZ, r)).toString('base64');

/* --- Parches: [descripcion, busca, reemplaza]. Si alguno no aparece, el
       generador falla en vez de emitir una vista previa a medias. --------- */
function aplicar(texto, archivo, parches) {
  parches.forEach(([que, busca, pone]) => {
    if (busca instanceof RegExp) {
      if (!busca.test(texto)) throw new Error(`${archivo}: no se encontro ${que}`);
      texto = texto.replace(busca, pone);
    } else {
      if (texto.indexOf(busca) === -1) throw new Error(`${archivo}: no se encontro ${que}`);
      texto = texto.split(busca).join(pone);
    }
  });
  return texto;
}

/* El texto "</script" cierra el bloque aunque venga dentro de una cadena o de
   un comentario: demo.js lleva en su cabecera la etiqueta que hay que borrar
   para un uso real, y eso partia el paquete en dos. Escaparlo como "<\/script"
   es identico dentro de una cadena y es texto inofensivo dentro de un
   comentario. Se aplica a todo lo que se emite, y ademas se comprueba. */
function sinCierre(texto) {
  return texto.replace(/<\/script/gi, '<\\/script');
}

/* Saltos de navegacion, comunes a los guiones de pagina y a los assets. */
const RUTAS = [
  ['location.search',  /window\.location\.search/g,          'window.PI_RUTA.busqueda()'],
  ['location.reload',  /window\.location\.reload\(\);/g,      'window.PI_RUTA.repintar();'],
  ['location.replace', /window\.location\.replace\((.+)\);/g, 'window.PI_RUTA.ir($1, true);'],
  ['location.href',    /window\.location\.href\s*=\s*([^;]+);/g, 'window.PI_RUTA.ir($1);'],
];
/* Los guiones de pagina no tienen por que usar los cuatro. */
function rutasOpcionales(texto) {
  RUTAS.forEach(([, busca, pone]) => { texto = texto.replace(busca, pone); });
  return texto;
}

/* ==========================================================================
   1. Hojas de estilo, con las fuentes incrustadas
   ======================================================================== */
let tokens = leer('assets/tokens.css');
['hanken-grotesk-var', 'jetbrains-mono-var'].forEach((f) => {
  const uri = `data:font/woff2;base64,${b64(`assets/fonts/${f}.woff2`)}`;
  tokens = aplicar(tokens, 'tokens.css', [[`la fuente ${f}`, `fonts/${f}.woff2`, uri]]);
});
const css = tokens + '\n' + leer('assets/app.css');

/* ==========================================================================
   2. Guiones compartidos, parcheados
   ======================================================================== */
const icons = leer('assets/icons.js');
const seed = leer('assets/seed.js');
const store = rutasOpcionales(leer('assets/store.js'));

const auth = rutasOpcionales(aplicar(leer('assets/auth.js'), 'auth.js', [
  ['la lectura de la ruta',
`  function paginaActual() {
    var p = window.location.pathname.split('/').pop();
    if (!p || p.indexOf('.') === -1) p = 'index.html';
    return p;
  }`,
`  function paginaActual() {
    /* Vista previa: la ruta vive en el # y no en la direccion del archivo. */
    return window.PI_RUTA ? window.PI_RUTA.archivo() : 'index.html';
  }`],
  ['la llamada automatica a la guarda',
   '  PI.auth = auth;\n  auth.guardar();',
   '  PI.auth = auth;\n  /* Vista previa: la guarda la llama el enrutador en cada cambio de ruta. */'],
]));

const ui = rutasOpcionales(aplicar(leer('assets/ui.js'), 'ui.js', [
  ['la descarga del CSV',
`    var a = document.createElement('a');
    try {
      var blob = new Blob([texto], { type: 'text/csv;charset=utf-8' });
      a.href = URL.createObjectURL(blob);
    } catch (e) {
      a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(texto);
    }
    a.download = nombreArchivo;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    aviso('Archivo generado', nombreArchivo + ' se descargo en tu equipo.', 'ok');`,
`    /* Vista previa: el visor bloquea las descargas que inicia la propia pagina.
       Un boton muerto se nota mas que un aviso, asi que se dice en pantalla. El
       CSV se genera igual, y se informa cuantas filas salieron para que se vea
       que el contenido esta ahi. En la carpeta real esto descarga el archivo. */
    void texto;
    aviso('La descarga no funciona en esta vista previa',
      nombreArchivo + ' se genero con ' + (lineas.length - 1) + ' filas, pero el visor no deja ' +
      'descargar desde una pagina incrustada. Al abrir la carpeta con doble clic, se descarga.',
      'aviso');`],
]));
const demo = rutasOpcionales(leer('assets/demo.js'));

const LOGO = `data:image/png;base64,${b64('assets/marca/monpica-logo.png')}`;
const EMBLEMA = `data:image/png;base64,${b64('assets/marca/monpica-emblema.png')}`;
const shell = rutasOpcionales(aplicar(leer('assets/shell.js'), 'shell.js', [
  ['la ruta del logo', "logo: 'assets/marca/monpica-logo.png'", `logo: '${LOGO}'`],
  ['la ruta del emblema', "emblema: 'assets/marca/monpica-emblema.png'", `emblema: '${EMBLEMA}'`],
  ['el montaje automatico',
`  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { shell.montar(); });
  } else {
    shell.montar();
  }`,
`  /* Vista previa: monta el enrutador, que llama a shell.montar() por ruta. */`],
]));

/* ==========================================================================
   3. Las 17 paginas: su <main> y su guion
   ======================================================================== */
const PAGINAS = fs.readdirSync(RAIZ).filter((f) => f.endsWith('.html')).sort();
if (PAGINAS.length !== 17) throw new Error(`se esperaban 17 paginas, hay ${PAGINAS.length}`);

const vistas = PAGINAS.map((archivo) => {
  const html = leer(archivo);
  const main = (html.match(/<main[\s\S]*?<\/main>/) || [])[0];
  if (!main) throw new Error(`${archivo}: no tiene <main>`);
  const guiones = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)];
  if (guiones.length !== 1) throw new Error(`${archivo}: tiene ${guiones.length} guiones en linea, se esperaba 1`);
  const guion = rutasOpcionales(guiones[0][1]);
  return `  VISTAS[${JSON.stringify(archivo)}] = {\n` +
         `    main: ${JSON.stringify(main)},\n` +
         `    guion: function () {${guion}}\n  };`;
}).join('\n');

/* ==========================================================================
   4. El enrutador
   ======================================================================== */
const enrutador = `
/* ============================================================================
   Enrutador de la vista previa. No forma parte del entregable.
   ========================================================================= */
(function () {
  'use strict';
  var VISTAS = {};
${vistas}

  var INICIO = 'index.html';
  var actual = { archivo: INICIO, busqueda: '' };
  var relojes = [];

  /* Los temporizadores de una pagina se cancelan al salir de ella. En la
     carpeta real muere el documento entero y se van solos; aqui no. */
  var setIntervalReal = window.setInterval;
  window.setInterval = function () {
    var id = setIntervalReal.apply(window, arguments);
    relojes.push(id);
    return id;
  };

  function leerHash() {
    var h = String(window.location.hash || '').replace(/^#\\/?/, '');
    if (!h) return { archivo: INICIO, busqueda: '' };
    var i = h.indexOf('?');
    if (i === -1) return { archivo: h, busqueda: '' };
    return { archivo: h.slice(0, i), busqueda: '?' + h.slice(i + 1) };
  }

  window.PI_RUTA = {
    archivo: function () { return actual.archivo; },
    busqueda: function () { return actual.busqueda; },
    repintar: function () { pintar(); },
    ir: function (destino, reemplazar) {
      var h = '#' + String(destino).replace(/^\\.?\\//, '');
      if (window.location.hash === h) { pintar(); return; }
      if (reemplazar && window.history && window.history.replaceState) {
        window.history.replaceState(null, '', h);
        pintar();
        return;
      }
      window.location.hash = h;
    }
  };

  function limpiar() {
    relojes.forEach(function (id) { window.clearInterval(id); });
    relojes = [];
    var fuera = document.querySelectorAll('main, .pi-menu, .pi-barra, .pi-modal-fondo');
    Array.prototype.forEach.call(fuera, function (el) { el.parentNode.removeChild(el); });
    document.documentElement.classList.remove('oscuro');
  }

  function pintar() {
    actual = leerHash();
    var def = PI.auth.PAGINAS[actual.archivo];
    if (!def || !VISTAS[actual.archivo]) { PI_RUTA.ir(INICIO, true); return; }

    /* La misma guarda que corre en la carpeta real, con el mismo criterio. */
    if (!def.publica && !PI.auth.puedeVer(actual.archivo)) {
      PI_RUTA.ir('sin-permiso.html?pagina=' + encodeURIComponent(actual.archivo) +
                 '&rol=' + encodeURIComponent(PI.auth.rol()), true);
      return;
    }

    limpiar();
    var demo = document.getElementById('pi-demo');
    var marco = document.createElement('div');
    marco.innerHTML = VISTAS[actual.archivo].main;
    var nuevo = marco.firstElementChild;
    if (demo) document.body.insertBefore(nuevo, demo);
    else document.body.appendChild(nuevo);

    PI.shell.montar();
    window.scrollTo(0, 0);
    VISTAS[actual.archivo].guion();
  }

  /* Los enlaces a otras paginas pasan por el # en vez de pedir un archivo. */
  document.addEventListener('click', function (ev) {
    var a = ev.target && ev.target.closest ? ev.target.closest('a[href]') : null;
    if (!a || ev.defaultPrevented || ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.button) return;
    var href = a.getAttribute('href');
    if (!href || href.charAt(0) === '#' || /^[a-z]+:/i.test(href)) return;
    if (!/\\.html(\\?|$)/.test(href)) return;
    ev.preventDefault();
    PI_RUTA.ir(href);
  });

  window.addEventListener('hashchange', pintar);

  /* La otra cosa que el visor no deja hacer. (La descarga del CSV se avisa
     desde dentro de ui.js, porque su tabla llama a la funcion interna.) */
  window.print = function () {
    PI.ui.aviso('La impresion no funciona en esta vista previa',
      'Imprimir desde una pagina incrustada esta bloqueado. Funciona al abrir ' +
      'la carpeta con doble clic.', 'aviso');
  };

  /* Al publicar, el archivo se envuelve en un <body> real. Suelto no lo tiene y
     los guiones caen en el <head>, donde document.body todavia es null. Esperar
     al DOM es correcto en los dos casos. */
  function arrancar() {
    document.body.classList.add('pi-verificando');
    pintar();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arrancar);
  else arrancar();
})();
`;

/* ==========================================================================
   5. Emitir
   ======================================================================== */
const salida = `<title>MONPICA Proyectos</title>
<meta name="description" content="Beta navegable del sistema de gestión de proyectos de MONPICA — Montilla Proyectos Integrales C.A. Datos de ejemplo.">
<style>
${css}
</style>
<script>${sinCierre(icons)}</script>
<script>${sinCierre(seed)}</script>
<script>${sinCierre(store)}</script>
<script>${sinCierre(auth)}</script>
<script>${sinCierre(ui)}</script>
<script>${sinCierre(demo)}</script>
<script>${sinCierre(shell)}</script>
<script>${sinCierre(enrutador)}</script>
`;

/* Ningun salto de navegacion puede haber quedado sin reescribir: si queda uno,
   en la vista previa intentaria cargar un archivo que no existe. Se comprueba
   sobre el resultado final, que es donde importa. */
/* Solo cuentan los cierres: dentro de un bloque de script, un "<script>" de
   apertura es texto inerte y unicamente "</script" saca al analizador de ahi.
   Ocho cierres son los ocho bloques que emite este archivo; uno mas significa
   que algo del codigo escapo sin pasar por sinCierre(). */
const cierra = (salida.match(/<\/script>/g) || []).length;
if (cierra !== 8) {
  throw new Error(`el paquete quedo con ${cierra} etiquetas </script>, se esperaban 8: ` +
                  'algo emitio la etiqueta de cierre dentro del codigo');
}

const CUERPO = salida.slice(salida.indexOf('<script>'));
[
  ['window.location.href =', 'un salto por href'],
  ['window.location.replace(', 'un salto por replace'],
  ['window.location.search', 'una lectura de la busqueda'],
  ['window.location.reload(', 'una recarga'],
  ['window.location.pathname', 'una lectura de la ruta del archivo'],
].forEach(([aguja, que]) => {
  const i = CUERPO.indexOf(aguja);
  if (i !== -1) {
    throw new Error(`quedo ${que} sin reescribir: ...${CUERPO.slice(Math.max(0, i - 90), i + 60)}...`);
  }
});

const destino = process.argv[2] || path.join(RAIZ, 'vista-previa.html');
fs.writeFileSync(destino, salida, 'utf8');
console.log(`escrito ${destino}`);
console.log(`  ${PAGINAS.length} paginas, ${(Buffer.byteLength(salida) / 1024).toFixed(0)} KB`);

/* Copia envuelta en la misma cascara que pone el publicador, para poder probar
   con un navegador exactamente lo que se va a publicar, y para poder abrirla
   con doble clic. */
const suelto = destino.replace(/\.html$/, '-suelta.html');
fs.writeFileSync(suelto,
  '<!doctype html>\n<html lang="es">\n<head>\n<meta charset="utf-8">\n' +
  '<meta name="viewport" content="width=device-width, initial-scale=1">\n' +
  '<style>:root{color-scheme:light}body{margin:0;font:14px system-ui}' +
  'img{max-width:100%}[hidden]{display:none!important}</style>\n</head>\n<body>\n' +
  salida + '</body>\n</html>\n', 'utf8');
console.log(`escrito ${suelto} (envuelta, para probar y para abrir con doble clic)`);
