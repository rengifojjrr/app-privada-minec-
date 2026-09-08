/* ============================================================================
   Prueba de la VISTA PREVIA, no del entregable. La vista previa es la copia de
   una sola pagina que genera herramientas/empaquetar-vista-previa.js.

   Se empaqueta aqui mismo, en cada corrida, para que sea imposible probar un
   paquete viejo mientras las paginas reales ya cambiaron.
   ========================================================================= */
const { chromium } = require('/tmp/pw/node_modules/playwright');
const { execFileSync } = require("child_process");
const os = require("os"), fsn = require("fs"), pathn = require("path");
const TMP = fsn.mkdtempSync(pathn.join(os.tmpdir(), "vp-"));
execFileSync("node", [pathn.join(__dirname, "..", "herramientas", "empaquetar-vista-previa.js"),
                       pathn.join(TMP, "vp.html")], { stdio: "pipe" });
process.argv[2] = process.argv[2] || pathn.join(TMP, "vp-suelta.html");

const B = 'file://' + process.argv[2];
let fallos = 0;
const malo = (m) => { console.log('  FALLA ' + m); fallos++; };
(async () => {
  const nav = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const ctx = await nav.newContext({ viewport: { width: 1440, height: 940 } });
  await ctx.route('**/*', r => { const u = r.request().url();
    return (u.startsWith('file:')||u.startsWith('data:')||u.startsWith('blob:')) ? r.continue() : r.abort(); });
  const pg = await ctx.newPage();
  const errores = [];
  pg.on('pageerror', e => errores.push('pageerror: ' + e.message));
  pg.on('console', m => { if (m.type() === 'error') errores.push(m.text()); });
  const ir = async (h) => { await pg.goto(B + '#' + h);
    await pg.waitForFunction(() => window.PI_RUTA && document.querySelector('main')); await pg.waitForTimeout(150); };

  console.log('=== 1. Aprobar la compuerta detenida ===');
  await ir('panel.html'); await pg.evaluate(() => PI.store.entrarComo('u-01'));
  await ir('aprobaciones.html');
  const antes = await pg.evaluate(() => {
    const p = PI.store.buscarProyecto('MP-2024-002');
    return { e6: p.etapas[5].estado, e7: p.etapas[6].estado, proyecto: p.estado };
  });
  await pg.evaluate(() => PI.store.aprobarEtapa('MP-2024-002', 6, 'Revisado en la vista previa.'));
  await pg.waitForTimeout(150);
  const desp = await pg.evaluate(() => {
    const p = PI.store.buscarProyecto('MP-2024-002');
    return { e6: p.etapas[5].estado, e7: p.etapas[6].estado, proyecto: p.estado };
  });
  if (desp.e6 !== 'Aprobada') malo(`la etapa 6 quedo en ${desp.e6}`);
  else if (desp.e7 === 'Bloqueada') malo('la etapa 7 no se desbloqueo');
  else console.log(`  OK  etapa 6 ${antes.e6} -> ${desp.e6}; etapa 7 ${antes.e7} -> ${desp.e7}; proyecto ${desp.proyecto}`);

  console.log('\n=== 2. Alta de proyecto en 3 pasos ===');
  await ir('proyecto-nuevo.html');
  const creado = await pg.evaluate(() => {
    const p = PI.store.crearProyecto({
      nombre: 'Prueba de vista previa', contratanteId: 'c-01',
      tipo: 'Plan de manejo forestal', ubicacion: 'Guanare',
      presupuesto: 12000, fechaInicio: PI.store.fechaHoy()
    });
    return p ? { id: p.id, etapas: p.etapas.length } : null;
  });
  if (!creado) malo('no se pudo crear el proyecto');
  else console.log(`  OK  ${creado.id} con ${creado.etapas} etapas`);
  await ir(`proyecto.html?id=${creado.id}&tab=etapas`);
  const titulo = await pg.$eval('#pi-ficha h1', e => e.textContent.trim()).catch(() => null);
  if (titulo !== 'Prueba de vista previa') malo(`la ficha muestra "${titulo}"`);
  else console.log('  OK  la ficha del proyecto nuevo abre por su id');

  console.log('\n=== 3. El volumen se guarda tal como se captura ===');
  const vol = await pg.evaluate(() => {
    PI.store.agregarMedicion('MP-2024-001', { parcela: 'P-VP', especie: 'Puy',
      hectareas: 3.5, arboles: 42, altura: 18.4, dap: 37.2, volumen: 7.777 });
    const p = PI.store.buscarProyecto('MP-2024-001');
    return p.mediciones[0].volumen;   // agregarMedicion hace unshift: la nueva va primero
  });
  if (vol !== 7.777) malo(`el volumen se guardo como ${vol}, no como 7.777`);
  else console.log('  OK  volumen 7.777 guardado sin transformar');

  console.log('\n=== 4. Categoria fuera del catalogo, rechazada desde el codigo ===');
  const rech = await pg.evaluate(() =>
    PI.store.agregarMovimiento('MP-2024-001', { tipo: 'Egreso', categoria: 'Inventada', monto: 100, estado: 'Ejecutado' }));
  if (rech !== null) malo('acepto una categoria fuera del catalogo');
  else console.log('  OK  rechazada');

  console.log('\n=== 5. CSV e impresion avisan en vez de hacer nada ===');
  await ir('bitacora.html'); await pg.evaluate(() => PI.store.entrarComo('u-08'));
  await ir('bitacora.html');
  const bcsv = await pg.$('[data-csv]');
  if (!bcsv) malo('no hay boton de CSV en la bitacora');
  else { await bcsv.click(); await pg.waitForTimeout(250);
    const t = await pg.$eval('.pi-avisos', e => e.textContent).catch(() => '');
    if (!/no funciona en esta vista previa/i.test(t)) malo('el CSV no aviso: ' + t.slice(0, 80));
    else console.log('  OK  el CSV avisa que funciona en la carpeta real'); }
  await ir('direccion.html'); await pg.evaluate(() => PI.store.entrarComo('u-05'));
  await ir('direccion.html');
  await pg.click('#b-imprimir'); await pg.waitForTimeout(250);
  const ti = await pg.$eval('.pi-avisos', e => e.textContent).catch(() => '');
  if (!/impresion no funciona/i.test(ti)) malo('imprimir no aviso');
  else console.log('  OK  imprimir avisa lo mismo');

  console.log('\n=== 6. Telefono: 390 px sin desborde ===');
  await pg.setViewportSize({ width: 390, height: 844 });
  await pg.evaluate(() => PI.store.entrarComo('u-01'));
  for (const p of ['panel.html','proyectos.html','proyecto.html?id=MP-2024-001&tab=etapas','calendario.html','reportes.html']) {
    await ir(p);
    const d = await pg.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
    if (d) malo(`${p} se desplaza en horizontal a 390 px`);
  }
  console.log('  OK  cinco pantallas sin desborde a 390 px');

  console.log('\n=== 7. Errores de consola ===');
  if (errores.length) { console.log('  ' + errores.slice(0,6).join('\n  ')); malo(`${errores.length} errores`); }
  else console.log('  OK  cero errores');

  await nav.close();
  console.log('\n' + (fallos ? `FALLOS: ${fallos}` : 'LOS FLUJOS FUNCIONAN EN LA VISTA PREVIA'));
  process.exit(fallos ? 1 : 0);
})();
