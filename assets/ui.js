/* ============================================================================
   ui.js — Piezas de interfaz reutilizables: tabla con búsqueda, filtros y
   orden; modal; aviso flotante; estado vacio; insignias; exportación.

   Define window.PI.ui. Sin módulos ni fetch: funciona con file://
   ========================================================================= */
window.PI = window.PI || {};

(function (PI) {
  'use strict';

  /* --- Utilidades basicas ------------------------------------------------- */
  function esc(txt) {
    return String(txt == null ? '' : txt)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function icono(nombre, clase) {
    return '<svg class="icono ' + (clase || '') + '" aria-hidden="true"><use href="#ic-' + nombre + '"></use></svg>';
  }

  function el(html) {
    var d = document.createElement('div');
    d.innerHTML = html.trim();
    return d.firstElementChild;
  }

  function sinAcentos(txt) {
    return String(txt || '').toLowerCase()
      .replace(/[áàä]/g, 'a').replace(/[éèë]/g, 'e').replace(/[íìï]/g, 'i')
      .replace(/[óòö]/g, 'o').replace(/[úùü]/g, 'u').replace(/ñ/g, 'n');
  }

  /* --- Insignias de estado ------------------------------------------------ */
  var CLASES_ESTADO = {
    /* proyecto */
    'En oferta': 'badge-neutro',
    'En ejecución': 'badge-ok',
    'Detenido': 'badge-aviso',
    'En permisología': 'badge-info',
    'Cerrado': 'badge-neutro',
    /* etapa */
    'Pendiente': 'badge-neutro',
    'En proceso': 'badge-aviso',
    'Esperando aprobación': 'badge-aviso',
    'Devuelta': 'badge-mal',
    'Aprobada': 'badge-ok',
    'Bloqueada': 'badge-neutro',
    /* finanzas */
    'Por liquidar': 'badge-aviso',
    'Liquidado': 'badge-ok',
    'Ingreso': 'badge-ok',
    'Egreso': 'badge-aviso',
    /* usuarios */
    'Activo': 'badge-ok',
    'Inactivo': 'badge-mal',
    'Vencida': 'badge-mal'
  };

  function badge(texto, clase) {
    return '<span class="badge ' + (clase || CLASES_ESTADO[texto] || 'badge-neutro') + '">' + esc(texto) + '</span>';
  }

  function badgeEtapa(etapa) {
    if (PI.store.etapaVencida(etapa)) {
      return '<span class="badge badge-mal">' + esc(etapa.estado) + '</span>' +
             ' <span class="badge badge-mal sin-punto">Vencida</span>';
    }
    return badge(etapa.estado);
  }

  /* --- Estado vacio ------------------------------------------------------- */
  function vacio(cfg) {
    cfg = cfg || {};
    return '<div class="vacio">' + icono(cfg.icono || 'inventory_2') +
      '<strong>' + esc(cfg.titulo || 'Sin registros') + '</strong>' +
      '<p class="sm">' + esc(cfg.texto || 'Todavía no hay nada que mostrar aquí.') + '</p>' +
      (cfg.accion ? '<p style="margin-top:12px">' + cfg.accion + '</p>' : '') +
      '</div>';
  }

  /* --- Aviso flotante ----------------------------------------------------- */
  function aviso(titulo, texto, tipo) {
    var caja = document.querySelector('.pi-avisos');
    if (!caja) {
      caja = el('<div class="pi-avisos" role="status" aria-live="polite"></div>');
      document.body.appendChild(caja);
    }
    var iconos = { ok: 'check_circle', mal: 'error', aviso: 'warning', info: 'info' };
    var t = tipo || 'ok';
    var nodo = el('<div class="pi-aviso-flotante ' + t + '">' +
      icono(iconos[t] || 'info') +
      '<div><strong>' + esc(titulo) + '</strong><span class="sm">' + esc(texto || '') + '</span></div></div>');
    caja.appendChild(nodo);
    window.setTimeout(function () {
      if (nodo.parentNode) nodo.parentNode.removeChild(nodo);
    }, 4200);
  }

  /* --- Modal --------------------------------------------------------------
     cfg = { titulo, cuerpo (html), confirmar, cancelar, ancho, alConfirmar(caja, cerrar) }
     Devuelve una función para cerrarlo.                                    */
  function modal(cfg) {
    cfg = cfg || {};
    var fondo = el('<div class="pi-modal-fondo" role="dialog" aria-modal="true"></div>');
    var caja = el('<div class="pi-modal' + (cfg.ancho ? ' ancho' : '') + '"></div>');
    caja.innerHTML =
      '<div class="pi-modal-cab"><h2>' + esc(cfg.titulo || '') + '</h2>' +
      '<button type="button" data-cerrar aria-label="Cerrar">' + icono('close') + '</button></div>' +
      '<div class="pi-modal-cuerpo">' + (cfg.cuerpo || '') + '</div>' +
      '<div class="pi-modal-pie">' +
        '<button type="button" class="btn" data-cerrar>' + esc(cfg.cancelar || 'Cancelar') + '</button>' +
        (cfg.confirmar ? '<button type="button" class="btn ' + (cfg.claseConfirmar || 'btn-primario') + '" data-confirmar>' + esc(cfg.confirmar) + '</button>' : '') +
      '</div>';
    fondo.appendChild(caja);
    document.body.appendChild(fondo);

    function cerrar() {
      if (fondo.parentNode) fondo.parentNode.removeChild(fondo);
      document.removeEventListener('keydown', alTeclear);
    }
    function alTeclear(ev) { if (ev.key === 'Escape') cerrar(); }
    document.addEventListener('keydown', alTeclear);

    fondo.addEventListener('click', function (ev) {
      if (ev.target === fondo) cerrar();
      if (ev.target.closest && ev.target.closest('[data-cerrar]')) cerrar();
    });
    var btn = caja.querySelector('[data-confirmar]');
    if (btn) {
      btn.addEventListener('click', function () {
        if (cfg.alConfirmar) cfg.alConfirmar(caja, cerrar);
        else cerrar();
      });
    }
    var primero = caja.querySelector('input,select,textarea,button[data-confirmar]');
    if (primero) primero.focus();
    return cerrar;
  }

  /* --- Confirmación simple ------------------------------------------------ */
  function confirmar(cfg) {
    return modal({
      titulo: cfg.titulo,
      cuerpo: '<p>' + esc(cfg.texto) + '</p>',
      confirmar: cfg.confirmar || 'Confirmar',
      claseConfirmar: cfg.peligro ? 'btn-peligro' : 'btn-primario',
      alConfirmar: function (caja, cerrar) { cerrar(); if (cfg.alConfirmar) cfg.alConfirmar(); }
    });
  }

  /* --- Exportación a CSV --------------------------------------------------
     Se arma en memoria y se descarga con un enlace temporal. No hay servidor
     ni peticion de red.                                                     */
  function csv(nombreArchivo, cabeceras, filas) {
    var lineas = [cabeceras.join(';')];
    filas.forEach(function (f) {
      lineas.push(f.map(function (c) {
        var v = String(c == null ? '' : c);
        return /[;"\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v;
      }).join(';'));
    });
    var texto = '﻿' + lineas.join('\r\n');
    var a = document.createElement('a');
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
    aviso('Archivo generado', nombreArchivo + ' se descargo en tu equipo.', 'ok');
  }

  /* ==========================================================================
     Tabla con búsqueda, filtros, orden y paginacion.

     cfg = {
       columnas: [{ clave, titulo, tipo, orden, render(fila), ancho, oculta }],
       datos:    [...],
       buscar:   ['campo', fn],        campos donde busca el cuadro de texto
       filtros:  [{ id, titulo, opciones:[{valor,texto}], campo | prueba(fila,valor) }],
       ordenPor, ordenDir, porPagina, vacio, csv:{nombre}, alClicFila(fila)
     }
     Devuelve { refrescar(datosNuevos) }
     ======================================================================= */
  function tabla(contenedor, cfg) {
    var estado = {
      texto: '',
      filtros: {},
      ordenPor: cfg.ordenPor || null,
      ordenDir: cfg.ordenDir || 'asc',
      pagina: 1,
      datos: cfg.datos || []
    };
    (cfg.filtros || []).forEach(function (f) { estado.filtros[f.id] = f.valorInicial || ''; });
    var porPagina = cfg.porPagina || 0;
    var cols = (cfg.columnas || []).filter(function (c) { return !c.oculta; });

    function aplicar() {
      var fs = estado.datos.slice();
      if (estado.texto) {
        var q = sinAcentos(estado.texto);
        fs = fs.filter(function (fila) {
          return (cfg.buscar || []).some(function (campo) {
            var v = typeof campo === 'function' ? campo(fila) : fila[campo];
            return sinAcentos(v).indexOf(q) !== -1;
          });
        });
      }
      (cfg.filtros || []).forEach(function (f) {
        var v = estado.filtros[f.id];
        if (!v) return;
        fs = fs.filter(function (fila) {
          if (f.prueba) return f.prueba(fila, v);
          return String(fila[f.campo]) === String(v);
        });
      });
      if (estado.ordenPor) {
        var col = cols.filter(function (c) { return c.clave === estado.ordenPor; })[0];
        var dir = estado.ordenDir === 'asc' ? 1 : -1;
        fs.sort(function (a, b) {
          var va = col && col.valorOrden ? col.valorOrden(a) : a[estado.ordenPor];
          var vb = col && col.valorOrden ? col.valorOrden(b) : b[estado.ordenPor];
          if (typeof va === 'number' && typeof vb === 'number') return (va - vb) * dir;
          return sinAcentos(va) < sinAcentos(vb) ? -dir : (sinAcentos(va) > sinAcentos(vb) ? dir : 0);
        });
      }
      return fs;
    }

    function pintar() {
      var fs = aplicar();
      var total = fs.length;
      var paginas = porPagina ? Math.max(1, Math.ceil(total / porPagina)) : 1;
      if (estado.pagina > paginas) estado.pagina = paginas;
      var vista = porPagina ? fs.slice((estado.pagina - 1) * porPagina, estado.pagina * porPagina) : fs;

      var html = '';

      /* Barra de búsqueda y filtros */
      if (cfg.buscar || (cfg.filtros && cfg.filtros.length) || cfg.csv) {
        html += '<div class="filtros">';
        if (cfg.buscar) {
          html += '<div class="campo crece"><label for="tb-q">Buscar</label>' +
            '<input id="tb-q" type="search" data-q placeholder="' + esc(cfg.textoBuscar || 'Escribe para filtrar la lista') +
            '" value="' + esc(estado.texto) + '"></div>';
        }
        (cfg.filtros || []).forEach(function (f) {
          html += '<div class="campo"><label for="tb-f-' + f.id + '">' + esc(f.titulo) + '</label>' +
            '<select id="tb-f-' + f.id + '" data-f="' + f.id + '"><option value="">' + esc(f.todos || 'Todos') + '</option>';
          f.opciones.forEach(function (o) {
            var val = o.valor == null ? o : o.valor;
            var txt = o.texto == null ? o : o.texto;
            html += '<option value="' + esc(val) + '"' + (String(estado.filtros[f.id]) === String(val) ? ' selected' : '') + '>' + esc(txt) + '</option>';
          });
          html += '</select></div>';
        });
        html += '<div class="fin">';
        html += '<button type="button" class="btn btn-sm" data-limpiar>' + icono('refresh', 'icono-sm') + ' Limpiar</button>';
        if (cfg.csv) html += '<button type="button" class="btn btn-sm btn-borde" data-csv>' + icono('download', 'icono-sm') + ' Exportar CSV</button>';
        html += '</div></div>';
      }

      /* Tabla */
      if (!total) {
        html += '<div class="tarjeta">' + vacio(cfg.vacio) + '</div>';
      } else {
        html += '<div class="tarjeta"><div class="tabla-envoltura"><table class="tabla responsiva' +
          (cfg.compacta ? ' tabla-compacta' : '') + '"><thead><tr>';
        cols.forEach(function (c) {
          var clases = [];
          if (c.tipo === 'num') clases.push('num');
          if (c.orden) clases.push('orden');
          if (c.tipo === 'acciones') clases.push('derecha');
          var flecha = '';
          if (c.orden && estado.ordenPor === c.clave) {
            flecha = '<span class="flecha">' + (estado.ordenDir === 'asc' ? '↑' : '↓') + '</span>';
          }
          html += '<th' + (clases.length ? ' class="' + clases.join(' ') + '"' : '') +
            (c.orden ? ' data-orden="' + esc(c.clave) + '" tabindex="0" role="button"' : '') +
            (c.ancho ? ' style="width:' + c.ancho + '"' : '') + '>' + esc(c.titulo) + flecha + '</th>';
        });
        html += '</tr></thead><tbody>';
        vista.forEach(function (fila, i) {
          var clasesFila = cfg.claseFila ? cfg.claseFila(fila) : '';
          html += '<tr' + (clasesFila ? ' class="' + clasesFila + '"' : '') + ' data-i="' + i + '">';
          cols.forEach(function (c) {
            var clases = [];
            if (c.tipo === 'num') clases.push('num');
            if (c.tipo === 'mono') clases.push('mono');
            if (c.tipo === 'acciones') clases.push('acciones');
            var contenido = c.render ? c.render(fila) : esc(fila[c.clave]);
            html += '<td' + (clases.length ? ' class="' + clases.join(' ') + '"' : '') +
              ' data-eti="' + esc(c.tipo === 'acciones' ? '' : c.titulo) + '">' + contenido + '</td>';
          });
          html += '</tr>';
        });
        html += '</tbody></table></div>';
        html += '<div class="tarjeta-pie"><span>Mostrando ' + vista.length + ' de ' + total +
          (total === 1 ? ' registro' : ' registros') + '</span>';
        if (paginas > 1) {
          html += '<div class="paginacion" style="margin-left:auto">' +
            '<button type="button" class="pag-num" data-pag="' + (estado.pagina - 1) + '"' + (estado.pagina === 1 ? ' disabled' : '') + '>Ant</button>';
          for (var pg = 1; pg <= paginas; pg++) {
            html += '<button type="button" class="pag-num" data-pag="' + pg + '"' +
              (pg === estado.pagina ? ' aria-current="true"' : '') + '>' + pg + '</button>';
          }
          html += '<button type="button" class="pag-num" data-pag="' + (estado.pagina + 1) + '"' +
            (estado.pagina === paginas ? ' disabled' : '') + '>Sig</button></div>';
        }
        html += '</div></div>';
      }

      contenedor.innerHTML = html;

      /* Eventos */
      var q = contenedor.querySelector('[data-q]');
      if (q) {
        q.addEventListener('input', function () {
          estado.texto = q.value; estado.pagina = 1;
          pintar();
          var nuevo = contenedor.querySelector('[data-q]');
          if (nuevo) { nuevo.focus(); nuevo.setSelectionRange(nuevo.value.length, nuevo.value.length); }
        });
      }
      Array.prototype.forEach.call(contenedor.querySelectorAll('[data-f]'), function (s) {
        s.addEventListener('change', function () {
          estado.filtros[s.getAttribute('data-f')] = s.value;
          estado.pagina = 1; pintar();
        });
      });
      var limpiar = contenedor.querySelector('[data-limpiar]');
      if (limpiar) {
        limpiar.addEventListener('click', function () {
          estado.texto = '';
          Object.keys(estado.filtros).forEach(function (k) { estado.filtros[k] = ''; });
          estado.pagina = 1; pintar();
        });
      }
      var bcsv = contenedor.querySelector('[data-csv]');
      if (bcsv) {
        bcsv.addEventListener('click', function () {
          var visibles = cols.filter(function (c) { return c.tipo !== 'acciones'; });
          csv(cfg.csv.nombre,
            visibles.map(function (c) { return c.titulo; }),
            aplicar().map(function (fila) {
              return visibles.map(function (c) {
                return c.csv ? c.csv(fila) : (c.render ? String(c.render(fila)).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() : fila[c.clave]);
              });
            }));
        });
      }
      Array.prototype.forEach.call(contenedor.querySelectorAll('[data-orden]'), function (th) {
        function ordenar() {
          var k = th.getAttribute('data-orden');
          if (estado.ordenPor === k) estado.ordenDir = estado.ordenDir === 'asc' ? 'desc' : 'asc';
          else { estado.ordenPor = k; estado.ordenDir = 'asc'; }
          pintar();
        }
        th.addEventListener('click', ordenar);
        th.addEventListener('keydown', function (ev) {
          if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); ordenar(); }
        });
      });
      Array.prototype.forEach.call(contenedor.querySelectorAll('[data-pag]'), function (b) {
        b.addEventListener('click', function () {
          var pg = Number(b.getAttribute('data-pag'));
          if (pg >= 1 && pg <= paginas) { estado.pagina = pg; pintar(); }
        });
      });
      if (cfg.alClicFila) {
        Array.prototype.forEach.call(contenedor.querySelectorAll('tbody tr'), function (tr) {
          tr.style.cursor = 'pointer';
          tr.addEventListener('click', function (ev) {
            if (ev.target.closest('button, a, select, input')) return;
            cfg.alClicFila(vista[Number(tr.getAttribute('data-i'))]);
          });
        });
      }
    }

    pintar();
    return {
      refrescar: function (datosNuevos) {
        if (datosNuevos) estado.datos = datosNuevos;
        pintar();
      }
    };
  }

  /* --- Piezas sueltas ----------------------------------------------------- */

  function kpi(cfg) {
    return '<div class="kpi ' + (cfg.tono ? 'tono-' + cfg.tono : '') + '">' +
      '<div class="kpi-cab"><span class="eti">' + esc(cfg.titulo) + '</span>' + icono(cfg.icono || 'info') + '</div>' +
      '<div class="kpi-val">' + cfg.valor + '</div>' +
      (cfg.pie ? '<div class="kpi-pie">' + cfg.pie + '</div>' : '') +
      '</div>';
  }

  function barra(pct, tono) {
    var v = Math.max(0, Math.min(100, Number(pct) || 0));
    return '<div class="barra-avance ' + (tono || '') + '" role="img" aria-label="' + v + ' por ciento">' +
      '<i style="width:' + v + '%"></i></div>';
  }

  /* Anillo de avance. AVISO PARA QUIEN AUDITE EL CODIGO: el Math.PI de abajo
     calcula la CIRCUNFERENCIA del circulo del SVG para animar el trazo. Es
     geometria de dibujo, no tiene ninguna relacion con volumenes de madera.
     En todo el sistema no existe ninguna ecuacion de cubicacion ni factor de
     conversion: el volumen se captura a mano y como maximo se suma. */
  function anillo(pct, texto, tamano) {
    var t = tamano || 96, r = (t / 2) - 8, c = 2 * Math.PI * r;
    var v = Math.max(0, Math.min(100, Number(pct) || 0));
    return '<div class="anillo"><svg width="' + t + '" height="' + t + '" viewBox="0 0 ' + t + ' ' + t + '">' +
      '<circle cx="' + t / 2 + '" cy="' + t / 2 + '" r="' + r + '" fill="none" stroke="var(--superficie-maxima)" stroke-width="8"/>' +
      '<circle cx="' + t / 2 + '" cy="' + t / 2 + '" r="' + r + '" fill="none" stroke="var(--primario)" stroke-width="8"' +
      ' stroke-linecap="round" stroke-dasharray="' + c + '" stroke-dashoffset="' + (c * (1 - v / 100)) + '"/>' +
      '</svg><div class="anillo-txt" style="margin-top:-' + (t / 2 + 14) + 'px;height:' + 28 + 'px">' + esc(texto == null ? v + '%' : texto) + '</div>' +
      '<div style="height:' + (t / 2 - 14) + 'px"></div></div>';
  }

  function selectOpciones(lista, seleccionado, textoVacio) {
    var html = textoVacio ? '<option value="">' + esc(textoVacio) + '</option>' : '';
    lista.forEach(function (o) {
      var val = o && o.valor != null ? o.valor : o;
      var txt = o && o.texto != null ? o.texto : o;
      html += '<option value="' + esc(val) + '"' + (String(val) === String(seleccionado) ? ' selected' : '') + '>' + esc(txt) + '</option>';
    });
    return html;
  }

  function marcador(texto, alto) {
    return '<div class="marcador"' + (alto ? ' style="min-height:' + alto + 'px"' : '') + '>' +
      icono('location_on', 'icono-lg') +
      '<span class="eti">' + esc(texto || 'Sin recursos remotos') + '</span>' +
      '<span class="sm">La beta no carga imágenes ni mapas de internet.</span></div>';
  }

  PI.ui = {
    esc: esc, icono: icono, el: el, sinAcentos: sinAcentos,
    badge: badge, badgeEtapa: badgeEtapa, CLASES_ESTADO: CLASES_ESTADO,
    vacio: vacio, aviso: aviso, modal: modal, confirmar: confirmar,
    csv: csv, tabla: tabla, kpi: kpi, barra: barra, anillo: anillo,
    selectOpciones: selectOpciones, marcador: marcador
  };
})(window.PI);
