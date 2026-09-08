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

  /* Logo. Tomado del export de Stitch, que lo entrega como SVG en linea: es el
     único recurso gráfico del export que no depende de internet. */
  var LOGO =
    '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Proyectos Integrales">' +
    '<rect width="100" height="100" rx="14" fill="#1F4D3D"/>' +
    '<path d="M50 18C32 18 18 32 18 50c0 18 14 32 32 32s32-14 32-32" fill="none" stroke="#F7F6F2" stroke-width="3" stroke-linecap="round" stroke-dasharray="2 4" opacity=".4"/>' +
    '<path d="M50 28c-12 0-22 10-22 22s10 22 22 22 22-10 22-22" fill="none" stroke="#9A6B3F" stroke-width="3.5" stroke-linecap="round"/>' +
    '<path d="M50 22l14 24-14-4-14 4z" fill="#F7F6F2"/>' +
    '<path d="M50 42l16 26-16-6-16 6z" fill="#F7F6F2" opacity=".95"/>' +
    '<rect x="48" y="62" width="4" height="18" rx="2" fill="#9A6B3F"/></svg>';

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
    var html = '<header class="pi-barra">';
    if (simple) {
      html += '<div class="fila" style="gap:10px;flex:none">' +
        '<span style="width:30px;height:30px;display:block">' + LOGO + '</span>' +
        '<strong>Proyectos Integrales</strong></div>';
    }
    html += marcaBeta();
    if (!simple) {
      html += '<div class="pi-buscar">' + icono('search') +
        '<input type="search" id="pi-búsqueda-global" placeholder="Buscar proyecto, contratante o código" ' +
        'aria-label="Buscar proyecto, contratante o código"></div>';
    }
    html += '<div class="pi-barra-fin">';
    if (!simple) {
      html += '<a class="btn btn-sm btn-plano" href="perfil.html">' + icono('badge', 'icono-sm') + ' Mi perfil</a>';
    }
    html += '<a class="btn btn-sm btn-plano" href="index.html" title="Volver al selector de rol">' +
      icono('logout', 'icono-sm') + ' Cambiar rol</a>';
    html += '<div class="pi-usuario"><div class="pi-usuario-txt"><strong>' + esc(u ? u.nombre : '—') +
      '</strong><span class="eti">' + esc(rol) + '</span></div>' +
      '<span class="pi-avatar">' + esc(PI.fmt.iniciales(u ? u.nombre : '?')) + '</span></div>';
    html += '</div></header>';
    return html;
  }

  function menuLateral() {
    var actual = PI.auth.paginaActual();
    var html = '<aside class="pi-menu"><div class="pi-marca">' +
      '<span>' + LOGO + '</span>' +
      '<span class="pi-marca-txt"><strong>Proyectos Integrales</strong><span>Ingeniería y ambiente</span></span>' +
      '</div><nav class="pi-nav" aria-label="Navegación principal">';
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
    html += '</nav><div class="pi-menu-pie"><span class="eti">Datos locales</span>' +
      '<div class="mono">Navegador &middot; sin servidor</div></div></aside>';
    return html;
  }

  /* Búsqueda global: lleva al listado de proyectos con el texto aplicado. */
  function conectarBusqueda() {
    var q = document.getElementById('pi-búsqueda-global');
    if (!q) return;
    q.addEventListener('keydown', function (ev) {
      if (ev.key !== 'Enter' || !q.value.trim()) return;
      window.location.href = 'proyectos.html?q=' + encodeURIComponent(q.value.trim());
    });
  }

  var shell = {
    LOGO: LOGO,

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

      document.title = (def.titulo || 'Proyectos Integrales') + ' · Beta · Proyectos Integrales';
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
