const { chromium } = require('/tmp/pw/node_modules/playwright');
const path = require('path');
const BASE = 'file://' + '/home/user/app-privada-minec-';

const PAGINAS = ['index.html','panel.html','proyectos.html','proyecto-nuevo.html','proyecto.html',
  'aprobaciones.html','calendario.html','contratantes.html','reportes.html','direccion.html',
  'usuarios.html','catalogos.html','bitacora.html','perfil.html','sin-permiso.html',
  'fase2-portal.html','fase3-asistente.html'];
const TABS = ['resumen','etapas','equipo','documentos','mediciones','finanzas','bitacora'];
const ROLES = ['admin','coordinador','profesional','administracion','direccion'];

let fallos = 0, avisos = 0;
function malo(m){ console.log('  FALLA: ' + m); fallos++; }

(async () => {
  const nav = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
    args: ['--allow-file-access-from-files','--no-sandbox'] });
  const ctx = await nav.newContext({ viewport: { width: 1440, height: 900 } });

  // Sin red: se bloquea todo lo externo. Si algo lo pide, se anota.
  const externos = [];
  await ctx.route('**/*', route => {
    const u = route.request().url();
    if (u.startsWith('file://') || u.startsWith('data:') || u.startsWith('blob:')) return route.continue();
    externos.push(u);
    return route.abort();
  });

  const pag = await ctx.newPage();
  const errores = [];
  pag.on('console', m => { if (m.type() === 'error') errores.push(m.text()); });
  pag.on('pageerror', e => errores.push('pageerror: ' + e.message));

  async function abrir(url) {
    errores.length = 0;
    await pag.goto(url, { waitUntil: 'load' });
    await pag.waitForTimeout(280);
    return errores.slice();
  }
  async function fijarRol(rol) {
    await pag.evaluate(r => { PI.store.cambiarRol(r); }, rol);
  }

  console.log('=== 1. Cada página carga sin errores de consola (rol admin) ===');
  await abrir(BASE + '/index.html');
  await fijarRol('admin');
  for (const p of PAGINAS) {
    const errs = await abrir(BASE + '/' + p);
    const url = pag.url().split('/').pop().split('?')[0];
    const titulo = await pag.title();
    const cuerpo = await pag.evaluate(() => document.body.innerText.trim().length);
    const oculto = await pag.evaluate(() => document.body.classList.contains('pi-verificando'));
    if (errs.length) malo(p + ' -> ' + errs.slice(0,2).join(' | '));
    else if (oculto) malo(p + ' -> el cuerpo quedó oculto (no se retiró pi-verificando)');
    else if (cuerpo < 120) malo(p + ' -> apenas ' + cuerpo + ' caracteres de contenido');
    else console.log(`  OK  ${p.padEnd(22)} ${String(cuerpo).padStart(5)} car.  ${titulo.slice(0,34)}`);
  }

  console.log('\n=== 2. Las 7 pestañas de la ficha ===');
  for (const t of TABS) {
    const errs = await abrir(BASE + '/proyecto.html?id=PI-2024-002&tab=' + t);
    const activa = await pag.evaluate(() => {
      const a = document.querySelector('.pestanas a[aria-current="page"]');
      return a ? a.textContent.trim() : null;
    });
    const cuerpo = await pag.evaluate(() => document.getElementById('pi-contenido').innerText.trim().length);
    if (errs.length) malo('tab ' + t + ' -> ' + errs[0]);
    else if (cuerpo < 100) malo('tab ' + t + ' -> contenido casi vacío (' + cuerpo + ')');
    else console.log(`  OK  ${t.padEnd(12)} ${String(cuerpo).padStart(5)} car.  activa: ${activa}`);
  }

  console.log('\n=== 3. El menú cambia según el rol ===');
  for (const r of ROLES) {
    await abrir(BASE + '/panel.html');
    await fijarRol(r);
    await abrir(BASE + '/panel.html');
    const menu = await pag.evaluate(() => Array.from(document.querySelectorAll('.pi-nav a')).map(a => a.getAttribute('href')));
    const beta = await pag.evaluate(() => !!document.querySelector('.pi-beta'));
    const demo = await pag.evaluate(() => !!document.getElementById('pi-demo'));
    if (!beta) malo(r + ': falta la marca BETA en la barra superior');
    if (!demo) malo(r + ': falta la barra de demo');
    console.log(`  ${r.padEnd(15)} ${String(menu.length).padStart(2)} enlaces: ${menu.join(' ')}`);
  }

  console.log('\n=== 4. La guarda de permisos redirige de verdad ===');
  const PROHIBIDAS = {
    profesional: ['usuarios.html','catalogos.html','bitacora.html','aprobaciones.html','direccion.html','reportes.html','contratantes.html','proyecto-nuevo.html'],
    coordinador: ['usuarios.html','catalogos.html','bitacora.html'],
    administracion: ['usuarios.html','catalogos.html','bitacora.html','aprobaciones.html','proyecto-nuevo.html'],
    direccion: ['usuarios.html','catalogos.html','bitacora.html','aprobaciones.html','proyecto-nuevo.html']
  };
  for (const [rol, lista] of Object.entries(PROHIBIDAS)) {
    await abrir(BASE + '/panel.html'); await fijarRol(rol);
    for (const p of lista) {
      await abrir(BASE + '/' + p);
      const final = pag.url().split('/').pop();
      if (!final.startsWith('sin-permiso.html')) malo(`${rol} pudo abrir ${p} (terminó en ${final})`);
    }
    // y una permitida debe abrirse
    await abrir(BASE + '/proyectos.html');
    if (!pag.url().endsWith('proyectos.html')) malo(`${rol} no pudo abrir proyectos.html`);
    console.log(`  OK  ${rol.padEnd(15)} ${lista.length} rutas prohibidas caen en Sin permiso`);
  }

  console.log('\n=== 5. Nada pide internet ===');
  if (externos.length) { malo('se pidieron recursos externos: ' + [...new Set(externos)].slice(0,5).join(', ')); }
  else console.log('  OK  cero peticiones a la red en todo el recorrido');

  console.log('\n=== 6. Tipografías e iconos locales ===');
  await abrir(BASE + '/panel.html');
  const fuentes = await pag.evaluate(async () => {
    await document.fonts.ready;
    return Array.from(document.fonts).map(f => f.family + ' ' + f.status);
  });
  console.log('  fuentes: ' + fuentes.join(' | '));
  if (!fuentes.some(f => f.startsWith('Hanken Grotesk') && f.endsWith('loaded'))) malo('Hanken Grotesk no cargó');
  const iconos = await pag.evaluate(() => {
    const usos = Array.from(document.querySelectorAll('svg.icono use'));
    const roto = usos.filter(u => !document.getElementById(u.getAttribute('href').slice(1)));
    return { total: usos.length, roto: roto.map(u => u.getAttribute('href')) };
  });
  console.log(`  iconos en uso: ${iconos.total}, referencias rotas: ${iconos.roto.length}`);
  if (iconos.roto.length) malo('iconos sin símbolo: ' + iconos.roto.slice(0,5).join(', '));

  await nav.close();
  console.log('\n' + (fallos ? 'FALLOS: ' + fallos : 'TODO CORRECTO'));
  process.exit(fallos ? 1 : 0);
})();
