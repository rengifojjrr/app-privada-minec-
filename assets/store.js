/* ============================================================================
   store.js — Persistencia en localStorage, altas y bajas, escritura de bitácora.

   No hay servidor ni base de datos. Todo vive en el navegador de quien abre la
   página y no se comparte entre equipos ni entre navegadores.

   Define window.PI.store y window.PI.fmt. Sin módulos ni fetch: file:// funciona.
   ========================================================================= */
window.PI = window.PI || {};

(function (PI) {
  'use strict';

  var CLAVE = 'PI_BETA_DATOS_V4';
  var estado = null;
  var disponible = true;

  /* --- Acceso a localStorage protegido: en algunos contextos lanza --------- */
  function leerCrudo() {
    try { return window.localStorage.getItem(CLAVE); }
    catch (e) { disponible = false; return null; }
  }
  function escribirCrudo(txt) {
    try { window.localStorage.setItem(CLAVE, txt); return true; }
    catch (e) { disponible = false; return false; }
  }
  function borrarCrudo() {
    try { window.localStorage.removeItem(CLAVE); } catch (e) { disponible = false; }
  }

  function cargar() {
    var crudo = leerCrudo();
    if (crudo) {
      try {
        var d = JSON.parse(crudo);
        if (d && d.version === 4 && Array.isArray(d.proyectos)) return d;
      } catch (e) { /* dato corrupto: se resiembra */ }
    }
    var fresco = window.PI_SEED();
    escribirCrudo(JSON.stringify(fresco));
    return fresco;
  }

  function guardar() {
    if (estado) escribirCrudo(JSON.stringify(estado));
  }

  /* --- Fechas ------------------------------------------------------------- */
  function hoy() { var f = new Date(); f.setHours(0, 0, 0, 0); return f; }

  /* Convierte DD/MM/AAAA (con hora opcional) a Date. Devuelve null si no cuadra. */
  function aDate(txt) {
    if (!txt) return null;
    var m = /^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2}))?$/.exec(String(txt).trim());
    if (!m) return null;
    return new Date(+m[3], +m[2] - 1, +m[1], m[4] ? +m[4] : 0, m[5] ? +m[5] : 0);
  }
  function deDate(f) {
    return String(f.getDate()).padStart(2, '0') + '/' +
           String(f.getMonth() + 1).padStart(2, '0') + '/' + f.getFullYear();
  }
  function fechaHoy() { return deDate(new Date()); }
  function fechaHoraAhora() {
    var f = new Date();
    return deDate(f) + ' ' + String(f.getHours()).padStart(2, '0') + ':' + String(f.getMinutes()).padStart(2, '0');
  }
  function diasHasta(txt) {
    var f = aDate(txt);
    if (!f) return null;
    f.setHours(0, 0, 0, 0);
    return Math.round((f - hoy()) / 86400000);
  }

  /* --- Formato ------------------------------------------------------------ */
  var fmt = {
    /* Montos siempre en dólares. */
    dinero: function (n, conSimbolo) {
      var v = Number(n) || 0;
      var s = v.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      return (conSimbolo === false ? '' : '$') + s;
    },
    /* Version compacta para los indicadores. Por debajo del millon muestra la
       cifra completa sin decimales, que se lee mejor que una abreviatura. */
    dineroCorto: function (n) {
      var v = Number(n) || 0;
      if (Math.abs(v) >= 1000000) return '$' + (v / 1000000).toFixed(2).replace('.', ',') + ' M';
      return '$' + Math.round(v).toLocaleString('es-VE');
    },
    numero: function (n, dec) {
      return (Number(n) || 0).toLocaleString('es-VE', {
        minimumFractionDigits: dec == null ? 0 : dec,
        maximumFractionDigits: dec == null ? 0 : dec
      });
    },
    porcentaje: function (n) { return fmt.numero(n, 0) + ' %'; },
    fecha: function (txt) { return txt || '—'; },
    iniciales: function (nombre) {
      var p = String(nombre || '?').trim().split(/\s+/);
      return ((p[0] || '')[0] || '?').toUpperCase() + ((p[1] || '')[0] || '').toUpperCase();
    },
    plazo: function (txt) {
      var d = diasHasta(txt);
      if (d === null) return '';
      if (d < 0) return 'vencido hace ' + Math.abs(d) + (Math.abs(d) === 1 ? ' dia' : ' días');
      if (d === 0) return 'vence hoy';
      if (d === 1) return 'vence mañana';
      return 'faltan ' + d + ' días';
    },

    /* Plazo de una etapa, que no es lo mismo que el plazo de una fecha suelta:
       una etapa aprobada no esta vencida aunque su fecha ya paso, y una
       bloqueada todavia no cuenta. Sin esto, las etapas ya cerradas de un
       proyecto viejo se leian todas como "vencido hace 210 dias". El criterio
       tiene que ser el mismo que usa etapaVencida. */
    plazoEtapa: function (etapa) {
      if (!etapa) return '';
      if (etapa.estado === 'Aprobada') return 'etapa aprobada';
      if (etapa.estado === 'Bloqueada') return 'aún no inicia';
      return fmt.plazo(etapa.fechaFin);
    }
  };

  /* ==========================================================================
     Lecturas derivadas
     ======================================================================= */

  function etapaVencida(etapa) {
    if (!etapa) return false;
    if (etapa.estado === 'Aprobada' || etapa.estado === 'Bloqueada') return false;
    var d = diasHasta(etapa.fechaFin);
    return d !== null && d < 0;
  }

  function avance(proyecto) {
    if (!proyecto || !proyecto.etapas.length) return 0;
    var ok = proyecto.etapas.filter(function (e) { return e.estado === 'Aprobada'; }).length;
    return Math.round((ok / proyecto.etapas.length) * 100);
  }

  function etapaActual(proyecto) {
    var e = proyecto.etapas.filter(function (x) {
      return x.estado === 'Esperando aprobación' || x.estado === 'En proceso' || x.estado === 'Devuelta';
    })[0];
    if (e) return e;
    return proyecto.etapas.filter(function (x) { return x.estado === 'Pendiente'; })[0] || null;
  }

  function etapasVencidas(proyecto) { return proyecto.etapas.filter(etapaVencida); }

  function esperandoAprobacion(proyecto) {
    return proyecto.etapas.filter(function (e) { return e.estado === 'Esperando aprobación'; });
  }

  function totalesFinancieros(proyecto) {
    var t = { ingresos: 0, egresos: 0, porLiquidar: 0, saldo: 0 };
    (proyecto.finanzas || []).forEach(function (m) {
      var v = Number(m.monto) || 0;
      /* Lo que esta por liquidar se contabiliza aparte: no suma al ejecutado. */
      if (m.estado === 'Por liquidar') { t.porLiquidar += v; return; }
      if (m.tipo === 'Ingreso') t.ingresos += v; else t.egresos += v;
    });
    t.saldo = t.ingresos - t.egresos;
    return t;
  }

  function honorariosTotales(proyecto) {
    return (proyecto.equipo || []).reduce(function (a, m) { return a + (Number(m.honorario) || 0); }, 0);
  }

  /* Proyectos visibles para un usuario. El Profesional solo ve aquellos en los
     que forma parte del equipo o tiene una etapa asignada. */
  function proyectosVisibles(usuarioId, rol) {
    var todos = estado.proyectos;
    if (rol !== 'profesional') return todos.slice();
    return todos.filter(function (p) {
      var enEquipo = (p.equipo || []).some(function (m) { return m.usuarioId === usuarioId; });
      var conEtapa = (p.etapas || []).some(function (e) { return e.responsableId === usuarioId; });
      return enEquipo || conEtapa;
    });
  }

  /* ==========================================================================
     Escrituras. Todas pasan por bitácora().
     ======================================================================= */

  function proximoId(prefijo) {
    return prefijo + '-' + Date.now().toString(36).slice(-5) + Math.floor(Math.random() * 90 + 10);
  }

  function bitacora(accion, entidad, proyectoId, detalle) {
    estado.bitacora.unshift({
      id: proximoId('b'),
      fechaHora: fechaHoraAhora(),
      usuarioId: estado.usuarioActivo,
      accion: accion,
      entidad: entidad,
      proyectoId: proyectoId || null,
      detalle: detalle || ''
    });
    guardar();
  }


  /* Los códigos de acción de la bitácora se guardan en ASCII y en mayúsculas
     porque son identificadores. Para mostrarlos se traducen a español legible. */
  var ETIQUETAS_ACCION = {
    PROYECTO_CREADO: 'Proyecto creado',
    PROYECTO_ACTUALIZADO: 'Proyecto actualizado',
    ETAPA_COMPLETADA: 'Etapa completada',
    ETAPA_ENVIADA_A_APROBACION: 'Etapa enviada a aprobación',
    ETAPA_APROBADA: 'Etapa aprobada',
    ETAPA_DEVUELTA: 'Etapa devuelta',
    ESTADO_COMPUERTA_ETAPA_6: 'Compuerta en revisión',
    ALERTA_VENCIMIENTO: 'Alerta de vencimiento',
    DOCUMENTO_CARGADO: 'Documento registrado',
    DOCUMENTO_ELIMINADO: 'Documento retirado',
    MEDICION_REGISTRADA: 'Medición registrada',
    MOVIMIENTO_REGISTRADO: 'Movimiento registrado',
    MOVIMIENTO_LIQUIDADO: 'Movimiento liquidado',
    EQUIPO_ASIGNADO: 'Profesional asignado',
    EQUIPO_RETIRADO: 'Profesional retirado',
    USUARIO_CREADO: 'Usuario creado',
    USUARIO_ACTUALIZADO: 'Usuario actualizado',
    USUARIO_DESACTIVADO: 'Usuario desactivado',
    USUARIO_REACTIVADO: 'Usuario reactivado',
    CONTRATANTE_CREADO: 'Contratante registrado',
    CATALOGO_ACTUALIZADO: 'Catálogo actualizado',
    REPORTE_GENERADO: 'Reporte generado',
    SESION_INICIADA: 'Sesión iniciada',
    CONSULTA_DIRECCION: 'Consulta de Dirección'
  };

  var store = {
    /* --- Ciclo de vida --------------------------------------------------- */
    iniciar: function () { if (!estado) estado = cargar(); return estado; },
    get estado() { return estado || store.iniciar(); },
    guardar: guardar,
    disponible: function () { return disponible; },
    reiniciar: function () {
      borrarCrudo();
      estado = window.PI_SEED();
      escribirCrudo(JSON.stringify(estado));
      return estado;
    },

    /* --- Sesión ---------------------------------------------------------- */
    rol: function () { return store.estado.rolActivo; },
    usuario: function () { return store.buscarUsuario(store.estado.usuarioActivo); },
    cambiarRol: function (rol) {
      var u = window.PI_USUARIO_POR_ROL[rol];
      if (!u) return false;
      estado.rolActivo = rol;
      estado.usuarioActivo = u;
      guardar();
      return true;
    },
    entrarComo: function (usuarioId) {
      var u = store.buscarUsuario(usuarioId);
      if (!u || !u.activo) return false;
      estado.usuarioActivo = u.id;
      estado.rolActivo = u.rol;
      guardar();
      return true;
    },

    /* --- Busquedas ------------------------------------------------------- */
    buscarUsuario: function (id) {
      return store.estado.usuarios.filter(function (u) { return u.id === id; })[0] || null;
    },
    nombreUsuario: function (id) {
      var u = store.buscarUsuario(id);
      return u ? u.nombre : '—';
    },
    buscarProyecto: function (id) {
      return store.estado.proyectos.filter(function (p) { return p.id === id; })[0] || null;
    },
    buscarContratante: function (id) {
      return store.estado.contratantes.filter(function (c) { return c.id === id; })[0] || null;
    },
    nombreContratante: function (id) {
      var c = store.buscarContratante(id);
      return c ? c.nombre : '—';
    },
    buscarEspecie: function (id) {
      return store.estado.catalogos.especies.filter(function (e) { return e.id === id; })[0] || null;
    },
    nombreEspecie: function (id) {
      var e = store.buscarEspecie(id);
      return e ? e.comun : '—';
    },
    catalogos: function () { return store.estado.catalogos; },

    /* --- Derivadas ------------------------------------------------------- */
    etapaVencida: etapaVencida,
    etapasVencidas: etapasVencidas,
    esperandoAprobacion: esperandoAprobacion,
    etapaActual: etapaActual,
    avance: avance,
    totalesFinancieros: totalesFinancieros,
    honorariosTotales: honorariosTotales,
    proyectosVisibles: proyectosVisibles,
    diasHasta: diasHasta,
    aDate: aDate,
    deDate: deDate,
    fechaHoy: fechaHoy,

    /* Cola de aprobaciones: una entrada por etapa en espera. */
    colaAprobaciones: function () {
      var cola = [];
      store.estado.proyectos.forEach(function (p) {
        esperandoAprobacion(p).forEach(function (e) {
          cola.push({ proyecto: p, etapa: e });
        });
      });
      return cola;
    },

    /* Todas las etapas con fecha, para el calendario. */
    agenda: function (usuarioId, rol) {
      var evs = [];
      proyectosVisibles(usuarioId, rol).forEach(function (p) {
        p.etapas.forEach(function (e) {
          if (e.estado === 'Aprobada') return;
          evs.push({
            proyectoId: p.id, proyectoNombre: p.nombre,
            etapa: e.num, titulo: e.nombre, fecha: e.fechaFin,
            estado: e.estado, vencida: etapaVencida(e),
            compuerta: e.compuerta, responsableId: e.responsableId
          });
        });
      });
      return evs;
    },

    /* --- Proyectos -------------------------------------------------------- */
    crearProyecto: function (datos) {
      var anio = new Date().getFullYear();
      var n = store.estado.proyectos.filter(function (p) { return p.id.indexOf('MP-' + anio) === 0; }).length + 1;
      var id = 'MP-' + anio + '-' + String(n).padStart(3, '0');
      var acum = 0;
      var etapasNuevas = store.estado.catalogos.plantillaEtapas.map(function (t, i) {
        acum += t.dias;
        var f = new Date();
        f.setDate(f.getDate() + acum);
        return {
          num: t.num, nombre: t.nombre, compuerta: t.compuerta,
          estado: i === 0 ? 'En proceso' : (i === 1 ? 'Pendiente' : 'Bloqueada'),
          fechaFin: deDate(f),
          responsableId: datos.coordinadorId || null,
          comentario: '', aprobadaPor: null, fechaAprobacion: ''
        };
      });
      var p = {
        id: id,
        nombre: datos.nombre,
        contratanteId: datos.contratanteId,
        tipo: datos.tipo,
        estado: 'En oferta',
        ubicacion: datos.ubicacion || '',
        fechaInicio: datos.fechaInicio || fechaHoy(),
        fechaFin: datos.fechaFin || etapasNuevas[9].fechaFin,
        presupuesto: Number(datos.presupuesto) || 0,
        coordinadorId: datos.coordinadorId,
        etapas: etapasNuevas,
        equipo: (datos.equipo || []).slice(),
        documentos: [], mediciones: [], finanzas: []
      };
      estado.proyectos.unshift(p);
      bitacora('PROYECTO_CREADO', 'Proyecto', id,
        'Alta del expediente ' + id + ' con las 10 etapas de la plantilla.');
      return p;
    },

    actualizarProyecto: function (id, cambios, detalle) {
      var p = store.buscarProyecto(id);
      if (!p) return null;
      Object.keys(cambios).forEach(function (k) { p[k] = cambios[k]; });
      bitacora('PROYECTO_ACTUALIZADO', 'Proyecto', id, detalle || 'Actualización del expediente.');
      return p;
    },

    /* --- Etapas ----------------------------------------------------------- */
    completarEtapa: function (proyectoId, num) {
      var p = store.buscarProyecto(proyectoId);
      if (!p) return null;
      var e = p.etapas[num - 1];
      if (!e || e.estado === 'Aprobada' || e.estado === 'Bloqueada') return null;
      if (e.compuerta) {
        e.estado = 'Esperando aprobación';
        p.estado = 'Detenido';
        bitacora('ETAPA_ENVIADA_A_APROBACION', 'Etapa', proyectoId,
          'Etapa ' + num + ' enviada a revisión final del Coordinador.');
      } else {
        e.estado = 'Aprobada';
        e.aprobadaPor = estado.usuarioActivo;
        e.fechaAprobacion = fechaHoy();
        store._desbloquearSiguiente(p, num);
        bitacora('ETAPA_COMPLETADA', 'Etapa', proyectoId,
          'Etapa ' + num + ' (' + e.nombre + ') marcada como completada.');
      }
      guardar();
      return e;
    },

    aprobarEtapa: function (proyectoId, num, comentario) {
      var p = store.buscarProyecto(proyectoId);
      if (!p) return null;
      var e = p.etapas[num - 1];
      if (!e) return null;
      e.estado = 'Aprobada';
      e.comentario = comentario || '';
      e.aprobadaPor = estado.usuarioActivo;
      e.fechaAprobacion = fechaHoy();
      store._desbloquearSiguiente(p, num);
      if (p.estado === 'Detenido') p.estado = 'En ejecución';
      bitacora('ETAPA_APROBADA', 'Etapa', proyectoId,
        'Etapa ' + num + ' aprobada. ' + (num < 10 ? 'Se desbloquea la etapa ' + (num + 1) + '.' : 'Proyecto listo para cierre.'));
      guardar();
      return e;
    },

    devolverEtapa: function (proyectoId, num, comentario) {
      var p = store.buscarProyecto(proyectoId);
      if (!p) return null;
      var e = p.etapas[num - 1];
      if (!e) return null;
      e.estado = 'Devuelta';
      e.comentario = comentario || '';
      if (p.estado === 'Detenido') p.estado = 'En ejecución';
      bitacora('ETAPA_DEVUELTA', 'Etapa', proyectoId,
        'Etapa ' + num + ' devuelta con observaciones: ' + (comentario || '').slice(0, 120));
      guardar();
      return e;
    },

    _desbloquearSiguiente: function (p, num) {
      var sig = p.etapas[num];
      if (sig && sig.estado === 'Bloqueada') sig.estado = 'Pendiente';
      var todas = p.etapas.every(function (x) { return x.estado === 'Aprobada'; });
      if (todas) p.estado = 'Cerrado';
      else if (p.estado === 'En oferta' && num >= 1) p.estado = 'En ejecución';
    },

    /* --- Documentos. Se registra el nombre, no el contenido. --------------- */
    agregarDocumento: function (proyectoId, doc) {
      var p = store.buscarProyecto(proyectoId);
      if (!p) return null;
      var d = {
        id: proximoId('d'),
        nombre: doc.nombre,
        tipo: doc.tipo,
        etapa: Number(doc.etapa) || 1,
        version: doc.version || 'v1.0',
        fecha: fechaHoy(),
        autorId: estado.usuarioActivo
      };
      p.documentos.unshift(d);
      bitacora('DOCUMENTO_CARGADO', 'Documento', proyectoId,
        'Carga de ' + d.nombre + ' en la etapa ' + d.etapa + '. Solo se registra el nombre.');
      return d;
    },

    eliminarDocumento: function (proyectoId, docId) {
      var p = store.buscarProyecto(proyectoId);
      if (!p) return false;
      var d = p.documentos.filter(function (x) { return x.id === docId; })[0];
      if (!d) return false;
      p.documentos = p.documentos.filter(function (x) { return x.id !== docId; });
      bitacora('DOCUMENTO_ELIMINADO', 'Documento', proyectoId, 'Baja del registro ' + d.nombre + '.');
      return true;
    },

    /* --- Mediciones de campo ---------------------------------------------
       El volumen es SIEMPRE captura manual. Aquí no hay, ni puede haber,
       ninguna ecuacion de cubicación ni factor de conversión. Lo único que se
       hace con los volumenes es sumarlos tal como se capturaron.            */
    agregarMedicion: function (proyectoId, med) {
      var p = store.buscarProyecto(proyectoId);
      if (!p) return null;
      var m = {
        id: proximoId('m'),
        parcela: med.parcela,
        hectareas: Number(med.hectareas) || 0,
        especieId: med.especieId,
        arboles: Number(med.arboles) || 0,
        altura: Number(med.altura) || 0,
        dap: Number(med.dap) || 0,
        volumen: Number(med.volumen) || 0,
        fecha: fechaHoy(),
        responsableId: estado.usuarioActivo
      };
      p.mediciones.unshift(m);
      bitacora('MEDICION_REGISTRADA', 'Medición', proyectoId,
        'Parcela ' + m.parcela + ': ' + m.arboles + ' árboles de ' + store.nombreEspecie(m.especieId) +
        ', volumen ' + fmt.numero(m.volumen, 1) + ' m3 de captura manual.');
      return m;
    },

    /* Resumen por especie. Suma de los volumenes capturados, sin fórmula. */
    resumenPorEspecie: function (proyecto) {
      var mapa = {};
      (proyecto.mediciones || []).forEach(function (m) {
        var k = m.especieId;
        if (!mapa[k]) mapa[k] = { especieId: k, arboles: 0, volumen: 0, hectareas: 0, parcelas: {} };
        mapa[k].arboles += m.arboles;
        mapa[k].volumen += m.volumen;
        mapa[k].hectareas += m.hectareas;
        mapa[k].parcelas[m.parcela] = true;
      });
      return Object.keys(mapa).map(function (k) {
        var r = mapa[k];
        r.numParcelas = Object.keys(r.parcelas).length;
        return r;
      }).sort(function (a, b) { return b.volumen - a.volumen; });
    },

    /* --- Finanzas ---------------------------------------------------------- */
    agregarMovimiento: function (proyectoId, mov) {
      var p = store.buscarProyecto(proyectoId);
      if (!p) return null;
      var cats = mov.tipo === 'Ingreso'
        ? store.estado.catalogos.categoriasIngreso
        : store.estado.catalogos.categoriasEgreso;
      /* Blindaje de la lista controlada: si la categoría no esta en el
         catálogo, el movimiento no se registra. */
      if (cats.indexOf(mov.categoria) === -1) return null;
      if (store.estado.catalogos.estadosMovimiento.indexOf(mov.estado) === -1) return null;
      var m = {
        id: proximoId('f'),
        tipo: mov.tipo,
        categoria: mov.categoria,
        concepto: mov.concepto,
        monto: Number(mov.monto) || 0,
        fecha: fechaHoy(),
        estado: mov.estado,
        responsableId: mov.responsableId || estado.usuarioActivo
      };
      p.finanzas.unshift(m);
      bitacora('MOVIMIENTO_REGISTRADO', 'Finanza', proyectoId,
        m.tipo + ' por ' + fmt.dinero(m.monto) + ' USD en ' + m.categoria + ', ' + m.estado.toLowerCase() + '.');
      return m;
    },

    liquidarMovimiento: function (proyectoId, movId) {
      var p = store.buscarProyecto(proyectoId);
      if (!p) return false;
      var m = p.finanzas.filter(function (x) { return x.id === movId; })[0];
      if (!m || m.estado === 'Liquidado') return false;
      m.estado = 'Liquidado';
      bitacora('MOVIMIENTO_LIQUIDADO', 'Finanza', proyectoId,
        m.tipo + ' de ' + fmt.dinero(m.monto) + ' USD en ' + m.categoria + ' marcado como liquidado.');
      return true;
    },

    /* --- Equipo ------------------------------------------------------------ */
    asignarMiembro: function (proyectoId, usuarioId, rolProyecto, honorario) {
      var p = store.buscarProyecto(proyectoId);
      if (!p) return null;
      if (p.equipo.some(function (m) { return m.usuarioId === usuarioId; })) return null;
      var m = { usuarioId: usuarioId, rolProyecto: rolProyecto, honorario: Number(honorario) || 0 };
      p.equipo.push(m);
      bitacora('EQUIPO_ASIGNADO', 'Equipo', proyectoId,
        'Asignación de ' + store.nombreUsuario(usuarioId) + ' como ' + rolProyecto + '.');
      return m;
    },

    quitarMiembro: function (proyectoId, usuarioId) {
      var p = store.buscarProyecto(proyectoId);
      if (!p) return false;
      p.equipo = p.equipo.filter(function (m) { return m.usuarioId !== usuarioId; });
      bitacora('EQUIPO_RETIRADO', 'Equipo', proyectoId,
        'Retiro de ' + store.nombreUsuario(usuarioId) + ' del equipo del proyecto.');
      return true;
    },

    /* --- Usuarios. No hay borrado fisico: solo desactivación. ------------- */
    crearUsuario: function (datos) {
      var u = {
        id: proximoId('u'),
        nombre: datos.nombre, rol: datos.rol, especialidad: datos.especialidad,
        correo: datos.correo, telefono: datos.telefono || '',
        activo: true, fechaAlta: fechaHoy()
      };
      estado.usuarios.push(u);
      bitacora('USUARIO_CREADO', 'Usuario', null,
        'Alta del usuario ' + u.nombre + ' con rol ' + u.rol + '.');
      return u;
    },

    alternarUsuario: function (usuarioId) {
      var u = store.buscarUsuario(usuarioId);
      if (!u) return null;
      u.activo = !u.activo;
      bitacora(u.activo ? 'USUARIO_REACTIVADO' : 'USUARIO_DESACTIVADO', 'Usuario', null,
        (u.activo ? 'Reactivación' : 'Desactivación') + ' del usuario ' + u.nombre + '.');
      return u;
    },

    /* --- Contratantes ------------------------------------------------------ */
    crearContratante: function (datos) {
      var c = {
        id: proximoId('c'),
        nombre: datos.nombre, rif: datos.rif, sector: datos.sector,
        contacto: datos.contacto || '', cargo: datos.cargo || '',
        telefono: datos.telefono || '', correo: datos.correo || '',
        direccion: datos.direccion || ''
      };
      estado.contratantes.push(c);
      bitacora('CONTRATANTE_CREADO', 'Contratante', null, 'Alta del contratante ' + c.nombre + '.');
      return c;
    },

    /* --- Catálogos ---------------------------------------------------------- */
    agregarAlCatalogo: function (lista, valor) {
      var cat = store.estado.catalogos[lista];
      if (!Array.isArray(cat)) return false;
      if (cat.indexOf(valor) !== -1) return false;
      cat.push(valor);
      bitacora('CATALOGO_ACTUALIZADO', 'Catálogo', null,
        'Alta de "' + valor + '" en el catálogo ' + lista + '.');
      return true;
    },

    quitarDelCatalogo: function (lista, valor) {
      var cat = store.estado.catalogos[lista];
      if (!Array.isArray(cat)) return false;
      var i = cat.indexOf(valor);
      if (i === -1) return false;
      cat.splice(i, 1);
      bitacora('CATALOGO_ACTUALIZADO', 'Catálogo', null,
        'Baja de "' + valor + '" del catálogo ' + lista + '.');
      return true;
    },

    agregarEspecie: function (comun, cientifico) {
      var cat = store.estado.catalogos.especies;
      if (cat.some(function (e) { return e.comun.toLowerCase() === comun.toLowerCase(); })) return null;
      var e = { id: proximoId('sp'), comun: comun, cientifico: cientifico };
      cat.push(e);
      bitacora('CATALOGO_ACTUALIZADO', 'Catálogo', null,
        'Alta de la especie ' + comun + ' (' + cientifico + ') en el catálogo.');
      return e;
    },

    /* --- Bitácora ------------------------------------------------------------ */
    registrar: bitacora,
    ETIQUETAS_ACCION: ETIQUETAS_ACCION,
    etiquetaAccion: function (codigo) {
      return ETIQUETAS_ACCION[codigo] || String(codigo || '').replace(/_/g, ' ').toLowerCase();
    },
    bitacoraDe: function (proyectoId) {
      return store.estado.bitacora.filter(function (b) { return b.proyectoId === proyectoId; });
    }
  };

  PI.store = store;
  PI.fmt = fmt;
  store.iniciar();
})(window.PI);
