const { chromium } = require('/tmp/pw/node_modules/playwright');
const BASE = 'file:///home/user/app-privada-minec-';
let fallos = 0;
function malo(m){ console.log('  FALLA: ' + m); fallos++; }
function bien(m){ console.log('  OK  ' + m); }

(async () => {
  const nav = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
    args: ['--allow-file-access-from-files','--no-sandbox'] });
  const ctx = await nav.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.route('**/*', r => (r.request().url().startsWith('file://') || r.request().url().startsWith('data:') || r.request().url().startsWith('blob:')) ? r.continue() : r.abort());
  const pag = await ctx.newPage();
  const errores = [];
  pag.on('console', m => { if (m.type() === 'error') errores.push(m.text()); });
  pag.on('pageerror', e => errores.push('pageerror: ' + e.message));

  async function ir(u){ errores.length = 0; await pag.goto(BASE + '/' + u, { waitUntil: 'load' }); await pag.waitForTimeout(300); }
  async function rol(r){ await pag.evaluate(x => PI.store.cambiarRol(x), r); }
  function checkErr(donde){ if (errores.length) malo(donde + ': ' + errores.slice(0,2).join(' | ')); }

  // ---------- 1. Entrar eligiendo un rol desde la portada ----------
  console.log('=== 1. Ingreso: entrar como un usuario ===');
  await ir('index.html');
  await pag.click('[data-u="u-01"]');
  await pag.waitForTimeout(200);
  await pag.click('button[type=submit]');
  await pag.waitForURL(/panel\.html/, { timeout: 8000 }).catch(() => {});
  await pag.waitForFunction(() => window.PI && window.PI.store, null, { timeout: 8000 });
  await pag.waitForTimeout(250);
  if (!pag.url().endsWith('panel.html')) malo('ingresar no llevó al panel');
  else bien('ingresar como Carlos Montilla lleva al panel');
  const rolActivo = await pag.evaluate(() => PI.store.rol());
  if (rolActivo !== 'coordinador') malo('el rol no quedó activo'); else bien('el rol quedó guardado: ' + rolActivo);

  // ---------- 2. Crear un proyecto con las 10 etapas ----------
  console.log('\n=== 2. Crear proyecto (asistente de 3 pasos) ===');
  await ir('proyecto-nuevo.html');
  await pag.fill('#f-nombre', 'Estudio de suelos vía agrícola El Sombrero');
  await pag.selectOption('#f-contratante', { index: 1 });
  await pag.selectOption('#f-tipo', { index: 1 });
  await pag.selectOption('#f-coordinador', { index: 1 });
  await pag.fill('#f-presupuesto', '38500');
  await pag.fill('#f-ubicacion', 'Sector Los Médanos, municipio Julián Mellado, estado Guárico');
  await pag.click('#b-sig'); await pag.waitForTimeout(250);
  const enPaso2 = await pag.evaluate(() => !!document.getElementById('b-agregar'));
  if (!enPaso2) malo('no avanzó al paso 2'); else bien('paso 1 validado, pasa a equipo');
  await pag.selectOption('#a-usuario', { index: 1 });
  await pag.selectOption('#a-rol', { index: 2 });
  await pag.fill('#a-honorario', '2200');
  await pag.click('#b-agregar'); await pag.waitForTimeout(250);
  await pag.click('#b-sig'); await pag.waitForTimeout(250);
  const enPaso3 = await pag.evaluate(() => !!document.getElementById('b-guardar'));
  if (!enPaso3) malo('no avanzó al paso 3'); else bien('paso 2 completo, pasa al resumen');
  await pag.click('#b-guardar'); await pag.waitForTimeout(1100);
  const nuevoId = new URL(pag.url()).searchParams.get('id');
  const nEtapas = await pag.evaluate(id => PI.store.buscarProyecto(id).etapas.length, nuevoId);
  if (nEtapas !== 10) malo('el proyecto nuevo no tiene 10 etapas: ' + nEtapas);
  else bien('proyecto ' + nuevoId + ' creado con 10 etapas');
  checkErr('alta de proyecto');

  // ---------- 3. Profesional: completar etapa, subir documento, 3 mediciones ----------
  console.log('\n=== 3. Profesional: etapa, documento y tres mediciones ===');
  await ir('panel.html'); await rol('profesional');
  await ir('proyecto.html?id=MP-2024-001&tab=etapas');
  const mias = await pag.evaluate(() => document.querySelectorAll('[data-completar]').length);
  if (!mias) malo('el profesional no ve ninguna etapa que pueda completar');
  else bien('el profesional puede actuar sobre ' + mias + ' etapa(s) asignada(s)');
  await pag.click('[data-completar]');
  await pag.waitForSelector('.pi-modal', { timeout: 3000 });
  await pag.click('.pi-modal [data-confirmar]');
  await pag.waitForTimeout(1000);
  checkErr('completar etapa');

  await ir('proyecto.html?id=MP-2024-001&tab=documentos');
  const antesDocs = await pag.evaluate(() => PI.store.buscarProyecto('MP-2024-001').documentos.length);
  await pag.click('#b-subir'); await pag.waitForSelector('.pi-modal');
  await pag.fill('#d-n', 'anexo_fotografico_parcela_p04.pdf');
  await pag.selectOption('#d-t', { index: 4 });
  await pag.click('.pi-modal [data-confirmar]'); await pag.waitForTimeout(900);
  const despuesDocs = await pag.evaluate(() => PI.store.buscarProyecto('MP-2024-001').documentos.length);
  if (despuesDocs !== antesDocs + 1) malo('el documento no se registró'); else bien('documento registrado por nombre');
  checkErr('registrar documento');

  await ir('proyecto.html?id=MP-2024-001&tab=mediciones');
  const antesMed = await pag.evaluate(() => PI.store.buscarProyecto('MP-2024-001').mediciones.length);
  for (const m of [['P-07','2.5',1,'34','14.2','28.6','52.400'],['P-07','2.5',2,'22','11.8','24.1','31.250'],['P-08','1.8',3,'18','16.4','33.9','44.900']]) {
    await pag.fill('#c-parcela', m[0]); await pag.fill('#c-ha', m[1]);
    await pag.selectOption('#c-especie', { index: m[2] });
    await pag.fill('#c-arboles', m[3]); await pag.fill('#c-altura', m[4]);
    await pag.fill('#c-dap', m[5]); await pag.fill('#c-volumen', m[6]);
    await pag.click('#b-medir'); await pag.waitForTimeout(950);
  }
  const med = await pag.evaluate(() => {
    const p = PI.store.buscarProyecto('MP-2024-001');
    const ult = p.mediciones.slice(0, 3);
    return { n: p.mediciones.length, vols: ult.map(m => m.volumen) };
  });
  if (med.n !== antesMed + 3) malo('no se registraron las tres mediciones (' + med.n + ')');
  else bien('tres mediciones capturadas');
  const esperados = [44.9, 31.25, 52.4];
  if (JSON.stringify(med.vols) !== JSON.stringify(esperados)) malo('el volumen se alteró: ' + JSON.stringify(med.vols) + ' esperado ' + JSON.stringify(esperados));
  else bien('el volumen se guardó exactamente como se capturó: ' + med.vols.join(', ') + ' m³');
  checkErr('capturar mediciones');

  // ---------- 4. El profesional ve el equipo pero solo su honorario ----------
  console.log('\n=== 4. Honorarios: el profesional solo ve el suyo ===');
  await ir('proyecto.html?id=MP-2024-001&tab=equipo');
  const hon = await pag.evaluate(() => {
    const filas = Array.from(document.querySelectorAll('tbody tr'));
    return {
      personas: filas.length,
      montos: filas.map(f => f.querySelectorAll('td')[3].innerText.trim()),
      total: (document.querySelector('.tarjeta-pie strong') || {}).innerText
    };
  });
  console.log('    personas visibles: ' + hon.personas + ' | montos: ' + JSON.stringify(hon.montos) + ' | total: ' + hon.total);
  if (hon.personas < 3) malo('el profesional no ve el equipo completo');
  else bien('ve el equipo completo (' + hon.personas + ' personas)');
  const conMonto = hon.montos.filter(m => m !== '—');
  if (conMonto.length !== 1) malo('debería ver exactamente un monto, ve ' + conMonto.length);
  else bien('ve un solo monto, el suyo: ' + conMonto[0]);
  if (!/confidencial/i.test(hon.total || '')) malo('el total consolidado no está oculto: ' + hon.total);
  else bien('el total consolidado queda oculto');

  // La pestaña de finanzas no debe existir para él
  const tieneFin = await pag.evaluate(() => Array.from(document.querySelectorAll('.pestanas a')).some(a => /finanzas/i.test(a.textContent)));
  if (tieneFin) malo('el profesional ve la pestaña de finanzas');
  else bien('no ve la pestaña de finanzas');
  await ir('proyecto.html?id=MP-2024-001&tab=finanzas');
  const tabCaida = await pag.evaluate(() => {
    const a = document.querySelector('.pestanas a[aria-current="page"]');
    return a ? a.textContent.trim() : '';
  });
  if (/finanzas/i.test(tabCaida)) malo('la ruta directa a la pestaña de finanzas funcionó');
  else bien('la ruta directa a finanzas cae en ' + tabCaida);

  // ---------- 5. Coordinador: devolver y luego aprobar ----------
  console.log('\n=== 5. Devolver con comentario, luego aprobar y desbloquear ===');
  await ir('panel.html'); await rol('coordinador');
  await ir('aprobaciones.html');
  const enCola = await pag.evaluate(() => document.querySelectorAll('[data-aprobar]').length);
  if (!enCola) malo('la cola de aprobaciones está vacía'); else bien('cola con ' + enCola + ' etapa(s) en espera');

  await pag.click('[data-devolver]'); await pag.waitForSelector('.pi-modal');
  await pag.fill('#ap-com', 'corto');
  await pag.click('.pi-modal [data-confirmar]'); await pag.waitForTimeout(220);
  const bloqueado = await pag.evaluate(() => !!document.querySelector('.pi-modal') && !document.querySelector('#ap-err').classList.contains('oculto'));
  if (!bloqueado) malo('aceptó un comentario de menos de 20 caracteres');
  else bien('rechaza el comentario demasiado corto');
  await pag.fill('#ap-com', 'Faltan las firmas de los especialistas en avifauna y la matriz de impacto consolidada.');
  await pag.click('.pi-modal [data-confirmar]'); await pag.waitForTimeout(1200);
  const trasDevolver = await pag.evaluate(() => {
    const p = PI.store.buscarProyecto('MP-2024-002');
    return { e6: p.etapas[5].estado, e7: p.etapas[6].estado, com: p.etapas[5].comentario.slice(0,30) };
  });
  if (trasDevolver.e6 !== 'Devuelta') malo('la etapa 6 no quedó devuelta: ' + trasDevolver.e6);
  else bien('etapa 6 devuelta, comentario guardado: "' + trasDevolver.com + '..."');
  if (trasDevolver.e7 !== 'Bloqueada') malo('la etapa 7 se desbloqueó al devolver');
  else bien('la etapa 7 sigue bloqueada');

  // volver a enviarla y aprobarla
  await ir('proyecto.html?id=MP-2024-002&tab=etapas');
  await pag.click('[data-completar="6"]'); await pag.waitForSelector('.pi-modal');
  await pag.click('.pi-modal [data-confirmar]'); await pag.waitForTimeout(1000);
  await ir('aprobaciones.html');
  await pag.click('[data-aprobar]'); await pag.waitForSelector('.pi-modal');
  await pag.fill('#ap-com', 'Conforme. Verificadas las coordenadas y las firmas. Se habilita la entrega del informe final.');
  await pag.click('.pi-modal [data-confirmar]'); await pag.waitForTimeout(1300);
  const trasAprobar = await pag.evaluate(() => {
    const p = PI.store.buscarProyecto('MP-2024-002');
    return { e6: p.etapas[5].estado, e7: p.etapas[6].estado, estado: p.estado };
  });
  if (trasAprobar.e6 !== 'Aprobada') malo('la etapa 6 no quedó aprobada: ' + trasAprobar.e6);
  else bien('etapa 6 aprobada');
  if (trasAprobar.e7 !== 'Pendiente') malo('la etapa 7 no se desbloqueó: ' + trasAprobar.e7);
  else bien('la etapa 7 se desbloqueó');
  if (trasAprobar.estado === 'Detenido') malo('el proyecto sigue detenido');
  else bien('el proyecto pasó a ' + trasAprobar.estado);
  checkErr('aprobar etapa');

  // ---------- 6. Administración: registrar y liquidar movimiento ----------
  console.log('\n=== 6. Administración: movimiento financiero ===');
  await ir('panel.html'); await rol('administracion');
  await ir('proyecto.html?id=MP-2024-003&tab=finanzas');
  const antesFin = await pag.evaluate(() => PI.store.buscarProyecto('MP-2024-003').finanzas.length);
  await pag.click('.filtros .fin button:last-child'); await pag.waitForSelector('.pi-modal');
  await pag.selectOption('#m-tipo', 'Egreso');
  await pag.fill('#m-monto', '1480');
  await pag.selectOption('#m-cat', { index: 3 });
  await pag.fill('#m-concepto', 'Alquiler de equipo topográfico para la revisión del canal de aducción');
  await pag.selectOption('#m-estado', 'Por liquidar');
  await pag.click('.pi-modal [data-confirmar]'); await pag.waitForTimeout(1000);
  const trasFin = await pag.evaluate(() => {
    const p = PI.store.buscarProyecto('MP-2024-003');
    const t = PI.store.totalesFinancieros(p);
    return { n: p.finanzas.length, porLiquidar: t.porLiquidar, egresos: t.egresos, id: p.finanzas[0].id };
  });
  if (trasFin.n !== antesFin + 1) malo('el movimiento no se registró'); else bien('movimiento registrado');
  await pag.click('[data-liquidar="' + trasFin.id + '"]'); await pag.waitForSelector('.pi-modal');
  await pag.click('.pi-modal [data-confirmar]'); await pag.waitForTimeout(1000);
  const trasLiq = await pag.evaluate(() => PI.store.totalesFinancieros(PI.store.buscarProyecto('MP-2024-003')));
  if (Math.abs((trasLiq.egresos - trasFin.egresos) - 1480) > 0.01) malo('al liquidar no pasó al ejecutado');
  else bien('al liquidar, los 1.480 USD pasan al ejecutado');
  checkErr('finanzas');

  // ---------- 7. La lista controlada no acepta texto libre ----------
  console.log('\n=== 7. Ninguna categoría es texto libre ===');
  await ir('proyecto.html?id=MP-2024-003&tab=finanzas');
  const esSelect = await pag.evaluate(async () => {
    document.querySelector('.filtros .fin button:last-child').click();
    await new Promise(r => setTimeout(r, 250));
    const c = document.querySelector('#m-cat');
    return { etiqueta: c.tagName, opciones: c.options.length, editable: c.isContentEditable };
  });
  if (esSelect.etiqueta !== 'SELECT') malo('la categoría no es una lista: ' + esSelect.etiqueta);
  else bien('la categoría es una lista de ' + esSelect.opciones + ' opciones, no un campo de texto');
  const rechazo = await pag.evaluate(() => PI.store.agregarMovimiento('MP-2024-003', {
    tipo: 'Egreso', categoria: 'Categoría escrita a mano', concepto: 'prueba', monto: 50, estado: 'Liquidado' }));
  if (rechazo !== null) malo('el sistema aceptó una categoría fuera del catálogo');
  else bien('una categoría fuera del catálogo se rechaza incluso desde el código');

  // ---------- 8. Admin: desactivar usuario y encontrarlo en la bitácora ----------
  console.log('\n=== 8. Desactivar usuario y hallarlo en la bitácora ===');
  await ir('panel.html'); await rol('admin');
  await ir('usuarios.html');
  await pag.click('[data-alternar="u-07"]'); await pag.waitForSelector('.pi-modal');
  await pag.click('.pi-modal [data-confirmar]'); await pag.waitForTimeout(1200);
  const inactivo = await pag.evaluate(() => PI.store.buscarUsuario('u-07').activo);
  if (inactivo) malo('el usuario no quedó desactivado'); else bien('Diego Torres quedó desactivado');
  await ir('bitacora.html');
  await pag.fill('[data-q]', 'desactiv'); await pag.waitForTimeout(350);
  const enBitacora = await pag.evaluate(() => {
    const f = document.querySelector('tbody tr');
    if (!f) return null;
    const c = f.querySelectorAll('td');
    return { cuando: c[0].innerText.trim(), quien: c[1].innerText.trim(), accion: c[2].innerText.trim() };
  });
  if (!enBitacora) malo('la desactivación no aparece en la bitácora');
  else if (!/^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}$/.test(enBitacora.cuando)) malo('la bitácora no muestra fecha y hora: ' + enBitacora.cuando);
  else bien('en la bitácora: ' + enBitacora.cuando + ' | ' + enBitacora.quien.replace(/\n/g,' ') + ' | ' + enBitacora.accion);

  // ---------- 9. Reporte de cierre y exportación ----------
  console.log('\n=== 9. Reporte de cierre de mes y exportación ===');
  await ir('reportes.html');
  const hayReporte = await pag.evaluate(() => document.querySelector('#pi-contenido').innerText.length > 200);
  if (!hayReporte) malo('el reporte de cierre salió vacío'); else bien('reporte de cierre de mes generado');
  const descarga = pag.waitForEvent('download', { timeout: 6000 }).catch(() => null);
  await pag.click('#r-csv');
  const d = await descarga;
  if (!d) malo('la exportación a CSV no produjo descarga');
  else bien('exportó ' + d.suggestedFilename());
  checkErr('reportes');

  // ---------- 10. Persistencia al recargar ----------
  console.log('\n=== 10. Los cambios sobreviven al recargar ===');
  const antesRecarga = await pag.evaluate(() => ({
    proyectos: PI.store.estado.proyectos.length,
    med: PI.store.buscarProyecto('MP-2024-001').mediciones.length,
    e6: PI.store.buscarProyecto('MP-2024-002').etapas[5].estado,
    u07: PI.store.buscarUsuario('u-07').activo
  }));
  await ir('panel.html');
  const trasRecarga = await pag.evaluate(() => ({
    proyectos: PI.store.estado.proyectos.length,
    med: PI.store.buscarProyecto('MP-2024-001').mediciones.length,
    e6: PI.store.buscarProyecto('MP-2024-002').etapas[5].estado,
    u07: PI.store.buscarUsuario('u-07').activo
  }));
  if (JSON.stringify(antesRecarga) !== JSON.stringify(trasRecarga)) malo('el estado cambió al recargar');
  else bien('sobreviven: ' + trasRecarga.proyectos + ' proyectos, ' + trasRecarga.med + ' mediciones, etapa 6 ' + trasRecarga.e6);

  // ---------- 11. Barra de demo: cambiar rol y tecla D ----------
  console.log('\n=== 11. Barra de demo ===');
  await ir('usuarios.html');
  await pag.click('#pi-demo [data-rol="profesional"]');
  await pag.waitForLoadState('load'); await pag.waitForTimeout(400);
  const destino = pag.url().split('/').pop();
  if (destino !== 'panel.html') malo('cambiar a un rol sin permiso no llevó al panel, fue a ' + destino);
  else bien('cambiar a Profesional desde una página prohibida lleva al panel, no a un error');
  await pag.keyboard.press('d'); await pag.waitForTimeout(200);
  const oculta = await pag.evaluate(() => document.getElementById('pi-demo').hidden);
  if (!oculta) malo('la tecla D no oculta la barra'); else bien('la tecla D oculta la barra');
  await pag.keyboard.press('d'); await pag.waitForTimeout(200);
  const visible = await pag.evaluate(() => !document.getElementById('pi-demo').hidden);
  if (!visible) malo('la tecla D no la vuelve a mostrar'); else bien('la tecla D la vuelve a mostrar');

  // Reiniciar datos
  await pag.evaluate(() => PI.store.reiniciar());
  await ir('panel.html');
  const tras = await pag.evaluate(() => PI.store.estado.proyectos.length);
  if (tras !== 6) malo('reiniciar no volvió a los 6 proyectos: ' + tras); else bien('reiniciar datos vuelve a la semilla de 6 proyectos');

  await nav.close();
  console.log('\n' + (fallos ? 'FALLOS: ' + fallos : 'TODOS LOS FLUJOS CORRECTOS'));
  process.exit(fallos ? 1 : 0);
})();
