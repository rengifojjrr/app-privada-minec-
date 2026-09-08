/* ============================================================================
   auth.js — Rol activo, matriz de permisos y guardas de página.

   Se carga en el <head>, ANTES de pintar. Si el rol activo no tiene permiso
   para la página, se redirige a sin-permiso.html sin mostrar nada: el permiso
   no es solo esconder el enlace del menu.

   Define window.PI.auth. Sin módulos ni fetch: funciona con file://
   ========================================================================= */
window.PI = window.PI || {};

(function (PI) {
  'use strict';

  var TODOS = ['admin', 'coordinador', 'profesional', 'administracion', 'direccion'];

  /* ==========================================================================
     Páginas del sistema. Las 23 páginas de la especificación caben en estos
     17 archivos: las páginas 5 a 11 son las siete pestañas de proyecto.html.
     ======================================================================= */
  var PAGINAS = {
    'index.html':          { titulo: 'Seleccionar rol',        icono: 'person',              roles: TODOS, menu: false, publica: true },
    'panel.html':          { titulo: 'Panel de inicio',        icono: 'dashboard',           roles: TODOS, menu: true, grupo: 'operacion' },
    'proyectos.html':      { titulo: 'Proyectos',              icono: 'folder_open',         roles: TODOS, menu: true, grupo: 'operacion' },
    'proyecto-nuevo.html': { titulo: 'Nuevo proyecto',         icono: 'add_circle',          roles: ['admin', 'coordinador'], menu: false },
    'proyecto.html':       { titulo: 'Ficha del proyecto',     icono: 'description',         roles: TODOS, menu: false },
    'aprobaciones.html':   { titulo: 'Aprobaciones',           icono: 'task_alt',            roles: ['admin', 'coordinador'], menu: true, grupo: 'operacion' },
    'calendario.html':     { titulo: 'Calendario',             icono: 'calendar_month',      roles: TODOS, menu: true, grupo: 'operacion' },
    'contratantes.html':   { titulo: 'Contratantes',           icono: 'domain',              roles: ['admin', 'coordinador', 'administracion', 'direccion'], menu: true, grupo: 'operacion' },
    'reportes.html':       { titulo: 'Reportes',               icono: 'analytics',           roles: ['admin', 'coordinador', 'administracion', 'direccion'], menu: true, grupo: 'operacion' },
    'direccion.html':      { titulo: 'Dirección',              icono: 'monitoring',          roles: ['admin', 'coordinador', 'administracion', 'direccion'], menu: true, grupo: 'gobierno', oscuro: true },
    'usuarios.html':       { titulo: 'Usuarios',               icono: 'manage_accounts',     roles: ['admin'], menu: true, grupo: 'gobierno' },
    'catalogos.html':      { titulo: 'Catálogos',              icono: 'menu_book',           roles: ['admin'], menu: true, grupo: 'gobierno' },
    'bitacora.html':       { titulo: 'Bitácora general',       icono: 'history_edu',         roles: ['admin'], menu: true, grupo: 'gobierno' },
    'perfil.html':         { titulo: 'Mi perfil',              icono: 'badge',               roles: TODOS, menu: true, grupo: 'cuenta' },
    'fase2-portal.html':   { titulo: 'Portal de contratantes', icono: 'groups',              roles: ['admin', 'coordinador', 'direccion'], menu: true, grupo: 'futuras' },
    'fase3-asistente.html':{ titulo: 'Asistente de informes',  icono: 'science',             roles: ['admin', 'coordinador', 'direccion'], menu: true, grupo: 'futuras' },
    'sin-permiso.html':    { titulo: 'Sin permiso',            icono: 'block',               roles: TODOS, menu: false, publica: true }
  };

  var GRUPOS = [
    { id: 'operacion', titulo: 'Operación técnica' },
    { id: 'gobierno',  titulo: 'Gobierno y control' },
    { id: 'cuenta',    titulo: 'Cuenta' },
    { id: 'futuras',   titulo: 'Fases futuras' }
  ];

  /* ==========================================================================
     Matriz de permisos por capacidad.

     Nota sobre honorarios: el Profesional ve el equipo del proyecto pero solo
     el monto de SU propio honorario; en las demás filas ve un guion, y el
     total consolidado le queda oculto. Dirección ve el total consolidado pero
     no el desglose persona por persona.
     ======================================================================= */
  var CAPACIDADES = {
    crearProyecto:         ['admin', 'coordinador'],
    editarProyecto:        ['admin', 'coordinador'],
    completarEtapa:        ['admin', 'coordinador', 'profesional'],
    aprobarEtapa:          ['admin', 'coordinador'],
    devolverEtapa:         ['admin', 'coordinador'],
    subirDocumento:        ['admin', 'coordinador', 'profesional'],
    eliminarDocumento:     ['admin', 'coordinador'],
    capturarCampo:         ['admin', 'coordinador', 'profesional'],
    verFinanzas:           ['admin', 'coordinador', 'administracion', 'direccion'],
    registrarFinanzas:     ['admin', 'administracion'],
    liquidarFinanzas:      ['admin', 'administracion'],
    verHonorariosDeTodos:  ['admin', 'coordinador', 'administracion'],
    verTotalHonorarios:    ['admin', 'coordinador', 'administracion', 'direccion'],
    asignarEquipo:         ['admin', 'coordinador'],
    gestionarContratantes: ['admin', 'coordinador', 'administracion'],
    gestionarUsuarios:     ['admin'],
    editarCatalogos:       ['admin'],
    verBitacoraGeneral:    ['admin'],
    verDireccion:          ['admin', 'coordinador', 'administracion', 'direccion'],
    exportar:              ['admin', 'coordinador', 'administracion', 'direccion']
  };

  /* Pestañas de la ficha de proyecto. Son las páginas 5 a 11. */
  var PESTANAS = [
    { id: 'resumen',    titulo: 'Resumen',              icono: 'description',              pagina: 5 },
    { id: 'etapas',     titulo: 'Etapas',               icono: 'account_balance_wallet',   pagina: 6, iconoReal: 'task_alt' },
    { id: 'equipo',     titulo: 'Equipo y honorarios',  icono: 'groups',                   pagina: 7 },
    { id: 'documentos', titulo: 'Documentos',           icono: 'folder',                   pagina: 8 },
    { id: 'mediciones', titulo: 'Mediciones de campo',  icono: 'forest',                   pagina: 9 },
    { id: 'finanzas',   titulo: 'Finanzas',             icono: 'payments',                 pagina: 10, capacidad: 'verFinanzas' },
    { id: 'bitacora',   titulo: 'Bitácora',             icono: 'history_edu',              pagina: 11 }
  ];

  function paginaActual() {
    var p = window.location.pathname.split('/').pop();
    if (!p || p.indexOf('.') === -1) p = 'index.html';
    return p;
  }

  var auth = {
    TODOS: TODOS,
    PAGINAS: PAGINAS,
    GRUPOS: GRUPOS,
    CAPACIDADES: CAPACIDADES,
    PESTANAS: PESTANAS,
    paginaActual: paginaActual,

    rol: function () { return PI.store.rol(); },
    usuario: function () { return PI.store.usuario(); },

    nombreRol: function (rol) {
      var r = PI.store.catalogos().roles.filter(function (x) { return x.id === (rol || auth.rol()); })[0];
      return r ? r.nombre : (rol || auth.rol());
    },

    /* ¿El rol activo tiene esta capacidad? */
    puede: function (capacidad, rol) {
      var lista = CAPACIDADES[capacidad];
      if (!lista) return false;
      return lista.indexOf(rol || auth.rol()) !== -1;
    },

    /* ¿El rol activo puede abrir esta página? */
    puedeVer: function (archivo, rol) {
      var def = PAGINAS[archivo];
      if (!def) return false;
      return def.roles.indexOf(rol || auth.rol()) !== -1;
    },

    /* Pestañas visibles de la ficha para el rol activo. */
    pestanasVisibles: function (rol) {
      return PESTANAS.filter(function (t) {
        return !t.capacidad || auth.puede(t.capacidad, rol);
      });
    },

    /* Enlaces del menu lateral, agrupados y ya filtrados por rol. */
    menu: function (rol) {
      return GRUPOS.map(function (g) {
        var enlaces = Object.keys(PAGINAS).filter(function (a) {
          var d = PAGINAS[a];
          return d.menu && d.grupo === g.id && auth.puedeVer(a, rol);
        }).map(function (a) {
          return { archivo: a, titulo: PAGINAS[a].titulo, icono: PAGINAS[a].icono, oscuro: !!PAGINAS[a].oscuro };
        });
        return { titulo: g.titulo, enlaces: enlaces };
      }).filter(function (g) { return g.enlaces.length > 0; });
    },

    /* Primera página disponible para un rol. Sirve al cambiar de rol desde una
       página que el rol nuevo no puede ver. */
    inicioDe: function (rol) {
      return auth.puedeVer('panel.html', rol) ? 'panel.html' : 'index.html';
    },

    /* --------------------------------------------------------------------
       Guarda. Se llama sola al cargar auth.js. Si la página no esta
       permitida, redirige antes de que se pinte nada.
       ------------------------------------------------------------------ */
    guardar: function () {
      var archivo = paginaActual();
      var def = PAGINAS[archivo];
      if (!def) return true;              /* archivo desconocido: no se bloquea */
      if (def.publica) return true;
      if (auth.puedeVer(archivo)) return true;
      var destino = 'sin-permiso.html?pagina=' + encodeURIComponent(archivo) +
                    '&rol=' + encodeURIComponent(auth.rol());
      window.location.replace(destino);
      return false;
    },

    /* Cambia de rol y recarga. Si el rol nuevo no puede ver la página actual,
       cae en el panel de inicio, nunca en un error. */
    cambiarRolYRecargar: function (rol) {
      if (!PI.store.cambiarRol(rol)) return;
      var archivo = paginaActual();
      var def = PAGINAS[archivo];
      if (def && !def.publica && !auth.puedeVer(archivo, rol)) {
        window.location.href = auth.inicioDe(rol);
      } else {
        window.location.reload();
      }
    }
  };

  PI.auth = auth;
  auth.guardar();
})(window.PI);
