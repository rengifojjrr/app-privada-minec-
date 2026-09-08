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
const PAGS = ['panel.html','proyectos.html','proyecto.html','proyecto-nuevo.html','aprobaciones.html',
  'calendario.html','contratantes.html','reportes.html','direccion.html','usuarios.html',
  'catalogos.html','bitacora.html','perfil.html','fase2-portal.html','fase3-asistente.html'];
(async () => {
  const nav = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const ctx = await nav.newContext({ viewport: { width: 1440, height: 940 } });
  const externos = [];
  await ctx.route('**/*', r => { const u = r.request().url();
    if (u.startsWith('file:') || u.startsWith('data:') || u.startsWith('blob:')) return r.continue();
    externos.push(u); return r.abort(); });
  const pg = await ctx.newPage();
  const errores = [];
  pg.on('console', m => { if (m.type() === 'error') errores.push(m.text()); });
  pg.on('pageerror', e => errores.push('pageerror: ' + e.message));

  const ir = async (hash) => {
    await pg.goto(B + '#' + hash);
    await pg.waitForFunction(() => window.PI_RUTA && document.querySelector('main'));
    await pg.waitForTimeout(120);
  };

  console.log('=== 1. Ingreso y las 8 cuentas ===');
  await pg.goto(B);
  await pg.waitForFunction(() => window.PI_RUTA && document.querySelector('main'));
  const cuentas = await pg.$$eval('.pi-cuenta', e => e.length);
  if (cuentas !== 8) malo(`hay ${cuentas} cuentas de prueba, se esperaban 8`);
  else console.log('  OK  las 8 cuentas aparecen');

  console.log('\n=== 2. Entrar de verdad, como en la carpeta real ===');
  await pg.click('.pi-cuenta');
  await pg.click('button[type=submit], #b-ingresar, .btn-primario');
  await pg.waitForFunction(() => (window.location.hash || '').indexOf('panel') !== -1, { timeout: 4000 })
    .catch(() => malo('no llego al panel al ingresar'));
  const rol = await pg.evaluate(() => PI.auth.rol());
  console.log('  OK  entro y quedo en ' + pg.url().split('#')[1] + ' con rol ' + rol);

  console.log('\n=== 3. Las 15 paginas internas, como admin ===');
  await pg.evaluate(() => PI.store.entrarComo('u-08'));
  for (const p of PAGS) {
    await ir(p);
    const r = await pg.evaluate(() => ({
      ruta: PI.PI_RUTA_X || window.PI_RUTA.archivo(),
      menus: document.querySelectorAll('.pi-menu').length,
      barras: document.querySelectorAll('.pi-barra').length,
      mains: document.querySelectorAll('main').length,
      texto: document.querySelector('main').textContent.trim().length
    }));
    const prob = [];
    if (r.ruta !== p) prob.push(`la ruta quedo en ${r.ruta}`);
    if (r.menus !== 1) prob.push(`${r.menus} menus laterales`);
    if (r.barras !== 1) prob.push(`${r.barras} barras superiores`);
    if (r.mains !== 1) prob.push(`${r.mains} elementos main`);
    if (r.texto < 200) prob.push(`solo ${r.texto} caracteres de contenido`);
    if (prob.length) malo(`${p}: ${prob.join('; ')}`);
    else console.log(`  OK  ${p.padEnd(22)} ${r.texto} car.`);
  }

  console.log('\n=== 4. Las 7 pestañas de la ficha ===');
  for (const t of ['resumen','etapas','equipo','documentos','mediciones','finanzas','bitacora']) {
    await ir(`proyecto.html?id=MP-2024-001&tab=${t}`);
    const act = await pg.$eval('#pi-pestanas [aria-current], #pi-pestanas .activa', e => e.textContent.trim()).catch(() => null);
    if (!act) malo(`pestaña ${t}: no quedo marcada como activa`);
    else console.log(`  OK  ${t.padEnd(12)} activa: ${act}`);
  }

  console.log('\n=== 5. La guarda redirige y nombra la pagina ===');
  await pg.evaluate(() => PI.store.cambiarRol('profesional'));
  for (const p of ['usuarios.html','catalogos.html','bitacora.html','direccion.html']) {
    await pg.goto(B + '#' + p);
    await pg.waitForFunction(() => (window.location.hash||'').indexOf('sin-permiso') !== -1, { timeout: 4000 })
      .catch(() => malo(`${p}: no redirigio`));
    const informe = await pg.$eval('#pi-contenido', e => e.textContent);
    if (!informe.includes(p)) malo(`${p}: sin-permiso no lo nombra`);
    else if (informe.includes('desconocida')) malo(`${p}: sin-permiso dice desconocida`);
    else console.log(`  OK  ${p} cae en Sin permiso y queda nombrada`);
  }

  console.log('\n=== 6. Navegar por los enlaces del menu, sin recargar ===');
  await pg.evaluate(() => PI.store.entrarComo('u-01'));
  await ir('panel.html');
  const enlaces = await pg.$$eval('.pi-nav a', e => e.map(a => a.getAttribute('href')));
  for (const h of enlaces.slice(0, 6)) {
    await pg.click(`.pi-nav a[href="${h}"]`);
    await pg.waitForTimeout(200);
    const dest = await pg.evaluate(() => window.PI_RUTA.archivo());
    if (dest !== h) malo(`el enlace a ${h} llevo a ${dest}`);
  }
  console.log(`  OK  ${Math.min(6, enlaces.length)} enlaces del menu navegan por el #`);

  console.log('\n=== 7. Cambiar de rol en la barra de demo ===');
  await ir('usuarios.html');
  await pg.evaluate(() => PI.store.entrarComo('u-08'));
  await ir('usuarios.html');
  await pg.click('#pi-demo [data-rol="profesional"]');
  await pg.waitForTimeout(300);
  const tras = await pg.evaluate(() => window.PI_RUTA.archivo());
  if (tras !== 'panel.html') malo(`cambiar a profesional desde usuarios.html llevo a ${tras}, no al panel`);
  else console.log('  OK  cae en el panel, no en un error');

  console.log('\n=== 8. Contraste de la barra de demo en oscuro ===');
  await pg.evaluate(() => PI.store.entrarComo('u-05'));
  await ir('direccion.html');
  const barra = await pg.evaluate(() => {
    const d = document.getElementById('pi-demo');
    return { oscuro: document.documentElement.classList.contains('oscuro'),
             fondo: getComputedStyle(d).backgroundColor };
  });
  if (!barra.oscuro) malo('direccion.html no aplico el tema oscuro');
  else if (barra.fondo !== 'rgb(29, 42, 27)') malo(`la barra de demo quedo en ${barra.fondo}`);
  else console.log('  OK  tema oscuro aplicado y la barra sigue oscura');
  await ir('panel.html');
  const claro = await pg.evaluate(() => document.documentElement.classList.contains('oscuro'));
  if (claro) malo('el tema oscuro no se quito al salir de direccion.html');
  else console.log('  OK  al salir de Direccion el tema vuelve a claro');

  console.log('\n=== 9. Nada pide internet ===');
  if (externos.length) malo('pidio recursos externos: ' + [...new Set(externos)].slice(0,4).join(', '));
  else console.log('  OK  cero peticiones a la red');

  console.log('\n=== 10. Fuentes e iconos incrustados ===');
  const tip = await pg.evaluate(() => Array.from(document.fonts).map(f => f.family + ' ' + f.status));
  console.log('  ' + tip.join(' | '));
  const rotos = await pg.evaluate(() => {
    const ids = new Set(Array.from(document.querySelectorAll('#pi-sprite symbol')).map(s => s.id));
    return Array.from(document.querySelectorAll('use')).map(u =>
      (u.getAttribute('href')||'').replace('#','')).filter(h => h && !ids.has(h));
  });
  if (rotos.length) malo('iconos roventos: ' + rotos.slice(0,5).join(', '));
  else console.log('  OK  ningun icono roto');

  console.log('\n=== 11. Errores de consola ===');
  if (errores.length) { console.log('  ' + errores.slice(0,8).join('\n  ')); malo(`${errores.length} errores`); }
  else console.log('  OK  cero errores de consola en todo el recorrido');

  await nav.close();
  console.log('\n' + (fallos ? `FALLOS: ${fallos}` : 'LA VISTA PREVIA SE COMPORTA COMO LA CARPETA'));
  process.exit(fallos ? 1 : 0);
})();
