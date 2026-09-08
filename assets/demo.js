/* ============================================================================
   demo.js — Barra de demostración.

   ESTE ARCHIVO EXISTE SOLO PARA LA PRESENTACION.

   Permite cambiar de rol delante del cliente sin cerrar sesión, y reiniciar
   los datos de ejemplo entre ensayo y ensayo.

   PARA UN USO REAL: borrar este archivo, borrar la etiqueta
   <script src="assets/demo.js"></script> de los diecisiete HTML, y borrar el
   bloque ".pi-demo" de assets/app.css. Nada más depende de el: shell.js
   comprueba si existe antes de montarlo.
   ========================================================================= */
(function () {
  'use strict';

  var CLAVE_OCULTA = 'PI_BETA_DEMO_OCULTA';

  function oculta() {
    try { return window.sessionStorage.getItem(CLAVE_OCULTA) === '1'; }
    catch (e) { return false; }
  }
  function guardarOculta(v) {
    try { window.sessionStorage.setItem(CLAVE_OCULTA, v ? '1' : '0'); } catch (e) { /* sin persistencia */ }
  }

  function pintar() {
    var PI = window.PI;
    var roles = PI.store.catalogos().roles;
    var activo = PI.store.rol();

    var barra = document.createElement('div');
    barra.className = 'pi-demo';
    barra.id = 'pi-demo';
    barra.setAttribute('aria-label', 'Barra de demostración');

    var html = '<span class="pi-demo-eti">Modo demo</span><div class="pi-demo-roles">';
    roles.forEach(function (r) {
      html += '<button type="button" data-rol="' + r.id + '" aria-pressed="' + (r.id === activo) + '"' +
        ' title="' + PI.ui.esc(r.descripcion) + '">' + PI.ui.esc(r.nombre) + '</button>';
    });
    html += '</div><div class="pi-demo-fin">' +
      '<span class="mono">Tecla D para ocultar</span>' +
      '<button type="button" data-reiniciar>Reiniciar datos</button>' +
      '<button type="button" data-ocultar aria-label="Ocultar barra de demostración">Ocultar</button>' +
      '</div>';
    barra.innerHTML = html;
    document.body.appendChild(barra);

    Array.prototype.forEach.call(barra.querySelectorAll('[data-rol]'), function (b) {
      b.addEventListener('click', function () {
        PI.auth.cambiarRolYRecargar(b.getAttribute('data-rol'));
      });
    });

    barra.querySelector('[data-reiniciar]').addEventListener('click', function () {
      PI.ui.confirmar({
        titulo: 'Reiniciar datos de ejemplo',
        texto: 'Se borran los datos guardados en este navegador y se vuelve a cargar la semilla original. ' +
               'Los proyectos, etapas, documentos, mediciones y movimientos que hayas creado en la demo se pierden.',
        confirmar: 'Reiniciar',
        peligro: true,
        alConfirmar: function () {
          PI.store.reiniciar();
          window.location.reload();
        }
      });
    });

    barra.querySelector('[data-ocultar]').addEventListener('click', function () { alternar(true); });

    if (oculta()) barra.hidden = true;
    medir();
  }

  /* La barra crece a dos o tres filas en pantalla estrecha. En vez de fijar su
     altura en el CSS, se mide y se publica en --demo-alto, que es lo que usa
     el relleno inferior del lienzo. Asi el contenido nunca queda debajo. */
  function medir() {
    var barra = document.getElementById('pi-demo');
    if (!barra) return;
    var alto = barra.hidden ? 0 : barra.getBoundingClientRect().height;
    document.documentElement.style.setProperty('--demo-alto', Math.round(alto) + 'px');
  }

  function alternar(forzarOcultar) {
    var barra = document.getElementById('pi-demo');
    if (!barra) return;
    var nuevo = forzarOcultar === true ? true : !barra.hidden;
    barra.hidden = nuevo;
    guardarOculta(nuevo);
    medir();
  }

  window.PI_DEMO = {
    montar: function () {
      if (document.getElementById('pi-demo')) return;
      pintar();
      document.addEventListener('keydown', function (ev) {
        if (ev.key !== 'd' && ev.key !== 'D') return;
        var t = ev.target;
        if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)) return;
        if (ev.ctrlKey || ev.metaKey || ev.altKey) return;
        alternar();
      });
      window.addEventListener('resize', medir);
    },
    alternar: alternar,
    medir: medir
  };
})();
