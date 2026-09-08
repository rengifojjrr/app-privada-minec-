// Arnes minimo: simula lo que seed.js/store.js/auth.js necesitan del navegador.
const fs = require('fs');
const almacen = {};
global.window = {
  localStorage: {
    getItem: k => (k in almacen ? almacen[k] : null),
    setItem: (k, v) => { almacen[k] = String(v); },
    removeItem: k => { delete almacen[k]; }
  },
  location: { pathname: '/panel.html', search: '', replace(){}, reload(){} }
};
global.localStorage = window.localStorage;
function cargar(f) { eval(fs.readFileSync(f, 'utf8')); }
cargar('assets/seed.js');
cargar('assets/store.js');
cargar('assets/auth.js');
const PI = window.PI, S = PI.store, A = PI.auth, F = PI.fmt;

let fallos = 0;
function ok(cond, msg) { if (!cond) { console.log('  FALLA: ' + msg); fallos++; } }

const E = S.estado;
console.log('=== SEMILLA ===');
console.log('usuarios:', E.usuarios.length, '| proyectos:', E.proyectos.length,
            '| contratantes:', E.contratantes.length, '| bitacora:', E.bitacora.length);

// Requisitos de la seccion 6 del encargo
ok(E.usuarios.length === 8, 'deben ser 8 usuarios');
const roles = [...new Set(E.usuarios.map(u => u.rol))].sort();
ok(roles.length === 5, 'los 8 usuarios deben cubrir los 5 roles, hay: ' + roles);
console.log('roles cubiertos:', roles.join(', '));

ok(E.proyectos.length === 6, 'deben ser 6 proyectos');
const estados = E.proyectos.map(p => p.estado);
console.log('estados de proyecto:', estados.join(' | '));
ok(new Set(estados).size >= 5, 'los proyectos deben estar en estados distintos');

const detenidos = E.proyectos.filter(p => S.esperandoAprobacion(p).length > 0);
console.log('detenidos esperando aprobacion:', detenidos.map(p => p.id).join(', '));
ok(detenidos.length >= 1, 'debe haber un proyecto detenido esperando aprobacion');

const conDosVencidas = E.proyectos.filter(p => S.etapasVencidas(p).length >= 2);
console.log('con dos o mas etapas vencidas:', conDosVencidas.map(p => p.id + ' (' + S.etapasVencidas(p).length + ')').join(', '));
ok(conDosVencidas.length >= 1, 'debe haber un proyecto con dos etapas vencidas');

const p1 = S.buscarProyecto('MP-2024-001');
const parcelas = [...new Set(p1.mediciones.map(m => m.parcela))];
console.log('parcelas medidas en MP-2024-001:', parcelas.join(', '));
ok(parcelas.length >= 3, 'deben haber mediciones en tres parcelas');

const cats = new Set();
E.proyectos.forEach(p => (p.finanzas||[]).forEach(m => cats.add(m.categoria)));
console.log('categorias financieras usadas:', cats.size);
ok(cats.size >= 6, 'deben usarse al menos seis categorias financieras');
const porLiq = [];
E.proyectos.forEach(p => (p.finanzas||[]).forEach(m => { if (m.estado === 'Por liquidar') porLiq.push(p.id + '/' + m.id); }));
console.log('partidas por liquidar:', porLiq.length);
ok(porLiq.length >= 1, 'debe haber al menos una partida por liquidar');

ok(E.bitacora.length >= 30, 'deben ser 30 registros de bitacora, hay ' + E.bitacora.length);
const hoy = new Date(); hoy.setHours(0,0,0,0);
const bitFuturas = E.bitacora.filter(b => S.aDate(b.fechaHora) > new Date());
ok(bitFuturas.length === 0, 'la bitacora no debe tener registros futuros');

console.log('\n=== INTEGRIDAD DE REFERENCIAS ===');
const idsU = new Set(E.usuarios.map(u => u.id));
const idsC = new Set(E.contratantes.map(c => c.id));
const idsSp = new Set(E.catalogos.especies.map(e => e.id));
E.proyectos.forEach(p => {
  ok(idsC.has(p.contratanteId), p.id + ': contratante inexistente ' + p.contratanteId);
  ok(idsU.has(p.coordinadorId), p.id + ': coordinador inexistente');
  ok(E.catalogos.tiposProyecto.includes(p.tipo), p.id + ': tipo fuera del catalogo -> ' + p.tipo);
  ok(E.catalogos.estadosProyecto.includes(p.estado), p.id + ': estado fuera del catalogo -> ' + p.estado);
  ok(p.etapas.length === 10, p.id + ': deben ser 10 etapas, hay ' + p.etapas.length);
  ok(p.etapas.filter(e => e.compuerta).length === 1, p.id + ': debe haber exactamente una compuerta');
  p.etapas.forEach(e => {
    ok(E.catalogos.estadosEtapa.includes(e.estado), p.id + ' etapa ' + e.num + ': estado fuera del catalogo -> ' + e.estado);
    ok(!e.responsableId || idsU.has(e.responsableId), p.id + ' etapa ' + e.num + ': responsable inexistente');
  });
  (p.equipo||[]).forEach(m => {
    ok(idsU.has(m.usuarioId), p.id + ': miembro inexistente ' + m.usuarioId);
    ok(E.catalogos.rolesProyecto.includes(m.rolProyecto), p.id + ': rol de proyecto fuera del catalogo -> ' + m.rolProyecto);
  });
  (p.documentos||[]).forEach(d => {
    ok(E.catalogos.tiposDocumento.includes(d.tipo), p.id + ': tipo de documento fuera del catalogo -> ' + d.tipo);
    ok(idsU.has(d.autorId), p.id + ': autor inexistente');
  });
  (p.mediciones||[]).forEach(m => {
    ok(idsSp.has(m.especieId), p.id + ': especie inexistente ' + m.especieId);
    ok(idsU.has(m.responsableId), p.id + ': responsable de medicion inexistente');
  });
  (p.finanzas||[]).forEach(m => {
    const lista = m.tipo === 'Ingreso' ? E.catalogos.categoriasIngreso : E.catalogos.categoriasEgreso;
    ok(lista.includes(m.categoria), p.id + ': categoria fuera del catalogo -> ' + m.tipo + ' / ' + m.categoria);
    ok(E.catalogos.estadosMovimiento.includes(m.estado), p.id + ': estado de movimiento fuera del catalogo');
    ok(idsU.has(m.responsableId), p.id + ': responsable financiero inexistente');
  });
});
E.bitacora.forEach(b => {
  ok(idsU.has(b.usuarioId), 'bitacora ' + b.id + ': usuario inexistente ' + b.usuarioId);
  ok(!b.proyectoId || E.proyectos.some(p => p.id === b.proyectoId), 'bitacora ' + b.id + ': proyecto inexistente ' + b.proyectoId);
});
E.usuarios.forEach(u => ok(E.catalogos.roles.some(r => r.id === u.rol), 'usuario ' + u.id + ': rol invalido ' + u.rol));

console.log('\n=== PERMISOS ===');
['admin','coordinador','profesional','administracion','direccion'].forEach(r => {
  const paginas = Object.keys(A.PAGINAS).filter(a => A.puedeVer(a, r));
  const menu = A.menu(r).reduce((n,g) => n + g.enlaces.length, 0);
  console.log(`  ${r.padEnd(15)} paginas: ${String(paginas.length).padStart(2)}  menu: ${menu}  pestanas: ${A.pestanasVisibles(r).map(t=>t.id).join(',')}`);
  ok(paginas.length >= 5, r + ': debe poder ver al menos 5 paginas');
  ok(menu >= 3, r + ': el menu no puede quedar casi vacio');
});
ok(!A.puedeVer('usuarios.html','coordinador'), 'coordinador no debe ver usuarios');
ok(!A.puedeVer('aprobaciones.html','profesional'), 'profesional no debe ver aprobaciones');
ok(!A.puedeVer('direccion.html','profesional'), 'profesional no debe ver direccion');
ok(!A.pestanasVisibles('profesional').some(t=>t.id==='finanzas'), 'profesional no debe ver la pestana de finanzas');
ok(A.pestanasVisibles('direccion').some(t=>t.id==='finanzas'), 'direccion si debe ver finanzas');
ok(A.puedeVer('catalogos.html','admin'), 'admin debe ver catalogos');

console.log('\n=== FLUJO DE ETAPAS ===');
S.cambiarRol('coordinador');
const p2 = S.buscarProyecto('MP-2024-002');
ok(p2.estado === 'Detenido', 'MP-2024-002 debe empezar detenido');
ok(p2.etapas[5].estado === 'Esperando aprobacion' || p2.etapas[5].estado === 'Esperando aprobación', 'etapa 6 en espera, es: ' + p2.etapas[5].estado);
ok(p2.etapas[6].estado === 'Bloqueada', 'etapa 7 debe estar bloqueada');
S.devolverEtapa('MP-2024-002', 6, 'Faltan las firmas de los especialistas y la matriz de impacto consolidada.');
ok(p2.etapas[5].estado === 'Devuelta', 'tras devolver, la etapa 6 queda Devuelta');
ok(p2.etapas[6].estado === 'Bloqueada', 'la etapa 7 sigue bloqueada tras devolver');
S.aprobarEtapa('MP-2024-002', 6, 'Conforme. Se habilita la entrega del informe final.');
ok(p2.etapas[5].estado === 'Aprobada', 'tras aprobar, la etapa 6 queda Aprobada');
ok(p2.etapas[6].estado === 'Pendiente', 'la etapa 7 se desbloquea, es: ' + p2.etapas[6].estado);
ok(p2.estado === 'En ejecución' || p2.estado === 'En ejecucion', 'el proyecto deja de estar detenido, es: ' + p2.estado);
console.log('  devolver -> aprobar -> desbloquear: correcto');

console.log('\n=== MEDICIONES: el volumen es captura manual ===');
const antes = p1.mediciones.length;
const m = S.agregarMedicion('MP-2024-001', { parcela:'P-04', hectareas:2, especieId:'sp-01', arboles:30, altura:12.5, dap:26.4, volumen:41.7 });
ok(m && m.volumen === 41.7, 'el volumen se guarda exactamente como se captura');
ok(p1.mediciones.length === antes + 1, 'la medicion se agrega');
const resumen = S.resumenPorEspecie(p1);
const suma = p1.mediciones.filter(x=>x.especieId==='sp-06').reduce((a,x)=>a+x.volumen,0);
const fila = resumen.find(r=>r.especieId==='sp-06');
ok(Math.abs(fila.volumen - suma) < 1e-9, 'el resumen por especie solo suma los volumenes capturados');
console.log('  volumen guardado sin transformacion; resumen = suma simple');

console.log('\n=== FINANZAS: lista controlada y por liquidar ===');
ok(S.agregarMovimiento('MP-2024-001', {tipo:'Egreso', categoria:'Categoria inventada', concepto:'x', monto:100, estado:'Liquidado'}) === null,
   'una categoria fuera del catalogo debe ser rechazada');
ok(S.agregarMovimiento('MP-2024-001', {tipo:'Egreso', categoria:'Combustible y transporte', concepto:'x', monto:100, estado:'Inventado'}) === null,
   'un estado fuera del catalogo debe ser rechazado');
const mv = S.agregarMovimiento('MP-2024-001', {tipo:'Egreso', categoria:'Combustible y transporte', concepto:'Traslado adicional', monto:100, estado:'Por liquidar'});
ok(mv !== null, 'una categoria del catalogo debe aceptarse');
const t1 = S.totalesFinancieros(p1);
ok(t1.porLiquidar >= 100, 'lo por liquidar se contabiliza aparte');
S.liquidarMovimiento('MP-2024-001', mv.id);
const t2 = S.totalesFinancieros(p1);
ok(Math.abs((t2.egresos - t1.egresos) - 100) < 1e-9, 'al liquidar, el monto pasa a egresos ejecutados');
console.log('  categorias controladas y por-liquidar fuera del ejecutado: correcto');

console.log('\n=== HONORARIOS: el profesional solo ve el suyo ===');
S.cambiarRol('profesional');
ok(!A.puede('verHonorariosDeTodos'), 'el profesional no ve los honorarios de todos');
ok(!A.puede('verTotalHonorarios'), 'el profesional no ve el total consolidado');
ok(A.puede('verTotalHonorarios','direccion'), 'direccion si ve el total');
ok(!A.puede('verHonorariosDeTodos','direccion'), 'direccion no ve el desglose por persona');
const visiblesProf = S.proyectosVisibles('u-02','profesional').map(p=>p.id);
console.log('  proyectos visibles para Elena Ramos:', visiblesProf.join(', '));
ok(visiblesProf.length < E.proyectos.length, 'el profesional no ve toda la cartera');

console.log('\n=== USUARIOS: sin borrado fisico ===');
S.cambiarRol('admin');
const nU = E.usuarios.length;
S.alternarUsuario('u-07');
ok(E.usuarios.length === nU, 'desactivar no borra el usuario');
ok(S.buscarUsuario('u-07').activo === false, 'el usuario queda inactivo');
const ultima = E.bitacora[0];
ok(ultima.accion === 'USUARIO_DESACTIVADO', 'la desactivacion queda en bitacora, accion: ' + ultima.accion);
ok(/^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}$/.test(ultima.fechaHora), 'la bitacora guarda fecha y hora: ' + ultima.fechaHora);
ok(ultima.usuarioId === 'u-08', 'la bitacora guarda el autor');
console.log('  ' + ultima.fechaHora + ' | ' + S.nombreUsuario(ultima.usuarioId) + ' | ' + ultima.accion);

console.log('\n=== CREAR PROYECTO ===');
S.cambiarRol('coordinador');
const nuevo = S.crearProyecto({ nombre:'Prueba de alta', contratanteId:'c-01', tipo:'Obras civiles',
  ubicacion:'Municipio X, estado Y', presupuesto:12000, coordinadorId:'u-01', equipo:[{usuarioId:'u-01',rolProyecto:'Coordinador responsable',honorario:1000}] });
ok(nuevo.etapas.length === 10, 'el proyecto nuevo nace con 10 etapas');
ok(nuevo.etapas[0].estado === 'En proceso', 'la etapa 1 arranca en proceso');
ok(nuevo.etapas[5].compuerta === true, 'la etapa 6 es la compuerta');
ok(nuevo.etapas.slice(2).every(e=>e.estado==='Bloqueada'), 'las etapas 3 a 10 nacen bloqueadas');
console.log('  ' + nuevo.id + ' creado con 10 etapas');

console.log('\n=== PERSISTENCIA ===');
const antesJson = JSON.stringify(S.estado.proyectos.length);
ok(Object.keys(almacen).length > 0, 'algo se guardo en localStorage');
const guardado = JSON.parse(almacen['PI_BETA_DATOS_V4']);
ok(guardado.proyectos.length === S.estado.proyectos.length, 'lo guardado coincide con el estado en memoria');
S.reiniciar();
ok(S.estado.proyectos.length === 6, 'reiniciar vuelve a 6 proyectos, hay ' + S.estado.proyectos.length);
console.log('  guardado y reinicio: correcto');

console.log('\n=== FORMATO ===');
console.log('  dinero:', F.dinero(1234567.5), '| corto:', F.dineroCorto(1234567.5), '| pct:', F.porcentaje(58.4));
console.log('  fecha de hoy:', S.fechaHoy(), '| plazo(+3d):', F.plazo(S.deDate(new Date(Date.now()+3*86400000))));
ok(/^\d{2}\/\d{2}\/\d{4}$/.test(S.fechaHoy()), 'las fechas van en DD/MM/AAAA');
ok(F.dinero(1000).indexOf('$') === 0, 'los montos llevan simbolo de dolar');

// El plazo de una etapa depende del estado, no solo de la fecha: una etapa
// aprobada no esta vencida aunque su fecha ya paso.
const ayer = S.deDate(new Date(Date.now() - 210 * 86400000));
const manana = S.deDate(new Date(Date.now() + 5 * 86400000));
console.log('  plazoEtapa aprobada + fecha pasada:', F.plazoEtapa({ estado: 'Aprobada', fechaFin: ayer }));
ok(F.plazoEtapa({ estado: 'Aprobada', fechaFin: ayer }).indexOf('vencido') === -1,
   'una etapa aprobada con fecha pasada no se lee como vencida');
ok(F.plazoEtapa({ estado: 'Bloqueada', fechaFin: ayer }).indexOf('vencido') === -1,
   'una etapa bloqueada no se lee como vencida');
ok(F.plazoEtapa({ estado: 'En proceso', fechaFin: ayer }).indexOf('vencido') === 0,
   'una etapa en proceso con fecha pasada si se lee como vencida');
ok(F.plazoEtapa({ estado: 'En proceso', fechaFin: manana }).indexOf('faltan') === 0,
   'una etapa en proceso con fecha futura muestra los dias que faltan');
// Y el texto tiene que coincidir con etapaVencida, que es quien pinta el rojo.
[['Aprobada', false], ['Bloqueada', false], ['En proceso', true], ['Pendiente', true], ['Devuelta', true]]
  .forEach(function (par) {
    const e = { estado: par[0], fechaFin: ayer };
    ok(S.etapaVencida(e) === par[1] && (F.plazoEtapa(e).indexOf('vencido') === 0) === par[1],
       'el texto y el rojo coinciden para una etapa ' + par[0]);
  });

console.log('\n' + (fallos ? 'FALLOS: ' + fallos : 'TODAS LAS COMPROBACIONES PASARON'));
process.exit(fallos ? 1 : 0);
