/* ============================================================================
   shell.js — Inyecta el marco de la aplicacion en todas las páginas: sprite de
   iconos, barra superior con la marca de versión, menu lateral según el rol y
   el tema oscuro donde corresponde.

   Se carga al final del <body>. Existe para no tener que editar diecisiete
   archivos cuando cambie la navegación.

   Define window.PI.shell. Sin módulos ni fetch: funciona con file://
   ========================================================================= */
window.PI = window.PI || {};

(function (PI) {
  'use strict';

  /* ==========================================================================
     Identidad del cliente. Tomada de su brochure: los datos de contacto y el
     RIF son los reales de la empresa. Es lo único de esta beta que NO es un
     dato de ejemplo, y por eso vive aquí y no en seed.js: sobrevive cuando el
     sistema deje de ser una demostración.
     ======================================================================= */
  var MARCA = {
    nombre: 'MONPICA',
    razon: 'Montilla Proyectos Integrales C.A.',
    lema: 'Soluciones ambientales, forestales, agrícolas y civiles integrales',
    descripcion: 'Consultora especializada en ingeniería ambiental, forestal, agrícola y civil, ' +
                 'y desarrolladora de planes y modelos de inversión en el sector forestal.',
    mision: 'Viabilizar proyectos respetando el marco jurídico.',
    alcance: 'Diagnóstico, permisología y ejecución de obras.',
    /* El RIF se retira del sitio publicado. NO se sustituye por uno inventado:
       inventar un numero fiscal de una empresa que existe no produce un dato de
       ejemplo, produce un registro falso, y eso es peor que publicar el real.
       Se deja vacio y la interfaz lo omite. Cuando el sitio deje de ser publico,
       aqui vuelve el RIF verdadero. */
    rif: '',
    sede: 'Guanare, estado Portuguesa',
    correo: 'monpica2025@gmail.com',
    telefono: '0414-536 53 05',
    /* El logo y el emblema son archivos locales: no hay recursos remotos. */
    logo: 'assets/marca/monpica-logo.png',
    emblema: 'assets/marca/monpica-emblema.png'
  };

  /* Emblema del logo, para el menú lateral y la barra superior. */
  function emblema(px) {
    return '<img src="' + MARCA.emblema + '" width="' + px + '" height="' + px +
      '" alt="' + MARCA.nombre + '" decoding="async">';
  }

  /* Logo completo con la palabra, para el ingreso. */
  function logoCompleto(ancho) {
    return '<img src="' + MARCA.logo + '" width="' + ancho + '" alt="' +
      MARCA.nombre + ' — ' + MARCA.razon + '" decoding="async">';
  }

  function esc(t) { return PI.ui.esc(t); }
  function icono(n, c) { return PI.ui.icono(n, c); }

  function montarSprite() {
    if (document.getElementById('pi-sprite')) return;
    var caja = document.createElement('div');
    caja.id = 'pi-sprite';
    caja.setAttribute('aria-hidden', 'true');
    caja.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
    caja.innerHTML = window.PI_ICONS || '';
    document.body.insertBefore(caja, document.body.firstChild);
  }

  function marcaBeta() {
    return '<span class="pi-beta" title="Versión de demostración con datos de ejemplo">' +
      icono('warning', 'icono-sm') + 'BETA &middot; datos de ejemplo</span>';
  }

  function barraSuperior(simple) {
    var u = PI.store.usuario();
    var rol = PI.auth.nombreRol();
    var html = '<header class="pi-barra' + (simple ? ' sola' : '') + '">';
    if (simple) {
      html += '<div class="pi-barra-marca">' + emblema(30) +
        '<strong>' + esc(MARCA.nombre) + '</strong>' +
        '<span class="sm tenue">' + esc(MARCA.razon) + '</span></div>';
    }
    html += marcaBeta();
    if (!simple) {
      html += '<div class="pi-buscar">' + icono('search') +
        '<input type="search" id="pi-buscador-global" placeholder="Buscar proyecto, contratante o código" ' +
        'aria-label="Buscar proyecto, contratante o código"></div>';
    }
    /* En las páginas públicas (ingreso y sin permiso) la barra no muestra la
       identidad: en el ingreso todavía no hay sesión que mostrar. */
    if (!simple) {
      html += '<div class="pi-barra-fin">' +
        '<a class="btn btn-sm btn-plano" href="perfil.html">' + icono('badge', 'icono-sm') + ' Mi perfil</a>' +
        '<a class="btn btn-sm btn-plano" href="index.html" title="Volver al ingreso">' +
        icono('logout', 'icono-sm') + ' Salir</a>' +
        '<div class="pi-usuario"><div class="pi-usuario-txt"><strong>' + esc(u ? u.nombre : '—') +
        '</strong><span class="eti">' + esc(rol) + '</span></div>' +
        '<span class="pi-avatar">' + esc(PI.fmt.iniciales(u ? u.nombre : '?')) + '</span></div>' +
        '</div>';
    }
    html += '</header>';
    return html;
  }

  function menuLateral() {
    var actual = PI.auth.paginaActual();
    var html = '<aside class="pi-menu"><a class="pi-marca" href="' + PI.auth.inicioDe(PI.auth.rol()) + '">' +
      emblema(34) +
      '<span class="pi-marca-txt"><strong>' + esc(MARCA.nombre) + '</strong>' +
      '<span>Proyectos integrales</span></span>' +
      '</a><nav class="pi-nav" aria-label="Navegación principal">';
    PI.auth.menu().forEach(function (g) {
      html += '<div class="pi-nav-grupo"><span class="eti">' + esc(g.titulo) + '</span>';
      g.enlaces.forEach(function (e) {
        var activo = e.archivo === actual ||
          (actual === 'proyecto.html' && e.archivo === 'proyectos.html') ||
          (actual === 'proyecto-nuevo.html' && e.archivo === 'proyectos.html');
        html += '<a href="' + e.archivo + '"' + (activo ? ' aria-current="page"' : '') + '>' +
          icono(e.icono) + '<span class="txt">' + esc(e.titulo) + '</span>' +
          (e.oscuro ? '<span class="pi-chip-oscuro">Oscuro</span>' : '') + '</a>';
      });
      html += '</div>';
    });
    html += '</nav><div class="pi-menu-pie">' +
      '<span class="eti">' + esc(MARCA.sede) + '</span>' +
      (MARCA.rif ? '<div class="mono">RIF ' + esc(MARCA.rif) + '</div>' : '') +
      '</div></aside>';
    return html;
  }

  /* Búsqueda global: lleva al listado de proyectos con el texto aplicado. */
  function conectarBusqueda() {
    var q = document.getElementById('pi-buscador-global');
    if (!q) return;
    q.addEventListener('keydown', function (ev) {
      if (ev.key !== 'Enter' || !q.value.trim()) return;
      window.location.href = 'proyectos.html?q=' + encodeURIComponent(q.value.trim());
    });
  }

  var shell = {
    MARCA: MARCA,
    emblema: emblema,
    logoCompleto: logoCompleto,

    montar: function () {
      var archivo = PI.auth.paginaActual();
      var def = PI.auth.PAGINAS[archivo] || {};
      var simple = !!def.publica;

      if (def.oscuro) document.documentElement.classList.add('oscuro');

      montarSprite();

      var marco = document.createElement('div');
      marco.innerHTML = (simple ? '' : menuLateral()) + barraSuperior(simple);
      while (marco.firstChild) {
        document.body.insertBefore(marco.firstChild, document.getElementById('pi-sprite').nextSibling);
      }

      conectarBusqueda();

      if (window.PI_DEMO) window.PI_DEMO.montar();

      document.title = (def.titulo || MARCA.nombre) + ' · Beta · ' + MARCA.nombre;
      document.body.classList.remove('pi-verificando');

      if (!PI.store.disponible()) {
        PI.ui.aviso('Sin almacenamiento local',
          'Este navegador no guarda datos. Los cambios se perderán al recargar.', 'aviso');
      }
    },

    /* Cabecera de contenido reutilizable por las páginas. */
    cabecera: function (cfg) {
      return '<div class="pi-cabecera"><div class="pi-cabecera-fila"><div>' +
        (cfg.kicker ? '<div class="eti">' + esc(cfg.kicker) + '</div>' : '') +
        '<h1>' + esc(cfg.titulo) + '</h1>' +
        (cfg.texto ? '<p>' + esc(cfg.texto) + '</p>' : '') +
        '</div>' + (cfg.acciones ? '<div class="pi-acciones">' + cfg.acciones + '</div>' : '') +
        '</div></div>';
    }
  };

  PI.shell = shell;

  /* Arranque de las páginas. shell.js registra su propio oyente antes de que
     cualquier página llame a PI.listo, asi que el marco siempre esta montado
     cuando corre el guion de la página. */
  PI.listo = function (fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { shell.montar(); });
  } else {
    shell.montar();
  }
})(window.PI);
