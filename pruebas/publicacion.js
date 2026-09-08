/* ============================================================================
   publicacion.js — Comprueba la beta tal como se publica: por HTTP, no por
   file://. Son dos comprobaciones distintas y hacen falta las dos.

     1. El sitio en vivo, con curl: que cada archivo se sirva, con el tipo de
        contenido correcto, y que el noindex este puesto. Chromium no puede
        salir a la red en este entorno (el relay del proxy le corta los
        tuneles, aunque curl pasa), asi que el navegador no llega hasta alla.

     2. Los mismos archivos servidos en local por HTTP, con un navegador de
        verdad. Aqui se comprueba lo que importa del cambio de protocolo: que
        las rutas relativas resuelvan, que los tipos MIME sean los correctos,
        que nada dependa de file://, y que el CSV se descargue (en la vista
        previa de una pagina no puede, aqui si).

   Lo que ninguna de las dos puede comprobar es la CDN de GitHub, que es
   justo lo que cubre la primera con curl.

     node pruebas/publicacion.js
   ========================================================================= */
const { chromium } = require('/tmp/pw/node_modules/playwright');
const { execFileSync, spawn } = require('child_process');
const path = require('path');

const VIVO = 'https://rengifojjrr.github.io/app-privada-minec-';
const RAIZ = path.resolve(__dirname, '..');
const PUERTO = 8137;
const LOCAL = `http://127.0.0.1:${PUERTO}`;

let fallos = 0;
const malo = (m) => { console.log('  FALLA ' + m); fallos++; };

/* --- 1. El sitio en vivo ------------------------------------------------- */
function enVivo() {
  console.log('=== 1. El sitio en vivo (curl) ===');
  const ARCHIVOS = [
    ['index.html', 'text/html'], ['panel.html', 'text/html'], ['proyecto.html', 'text/html'],
    ['direccion.html', 'text/html'], ['robots.txt', 'text/plain'],
    ['assets/tokens.css', 'text/css'], ['assets/app.css', 'text/css'],
    ['assets/seed.js', 'javascript'], ['assets/store.js', 'javascript'],
    ['assets/marca/monpica-logo.png', 'image/png'], ['assets/marca/favicon.png', 'image/png'],
    ['assets/fonts/hanken-grotesk-var.woff2', 'font/woff2'],
    ['assets/fonts/jetbrains-mono-var.woff2', 'font/woff2'],
    ['.nojekyll', ''],
  ];
  for (const [ruta, tipo] of ARCHIVOS) {
    let salida;
    try {
      salida = execFileSync('curl', ['-sS', '-o', '/dev/null', '--max-time', '25',
        /* El separador no puede ser un espacio: content_type trae uno dentro
           ("text/html; charset=utf-8"), y al partir se cruzaban las columnas
           y la comprobacion de 0 bytes no se disparaba nunca. */
        '-w', '%{http_code}|%{content_type}|%{size_download}', `${VIVO}/${ruta}`],
        { encoding: 'utf8' });
    } catch (e) { malo(`${ruta}: curl fallo (${e.message.split('\n')[0]})`); continue; }
    const [codigo, ctype, bytes] = salida.trim().split('|');
    if (codigo !== '200') malo(`${ruta}: HTTP ${codigo}`);
    else if (tipo && !(ctype || '').includes(tipo)) malo(`${ruta}: tipo ${ctype}, se esperaba ${tipo}`);
    else if (Number(bytes) === 0 && ruta !== '.nojekyll') malo(`${ruta}: 0 bytes`);
    else console.log(`  OK  ${ruta.padEnd(40)} ${String(bytes).padStart(7)} b   ${ctype || '(sin tipo)'}`);
  }
  /* vercel.json se quito: si reaparece, alguien reintrodujo el despliegue viejo. */
  const v = execFileSync('curl', ['-sS', '-o', '/dev/null', '-w', '%{http_code}',
    '--max-time', '25', `${VIVO}/vercel.json`], { encoding: 'utf8' }).trim();
  if (v !== '404') malo(`vercel.json responde ${v}, deberia ser 404`);
  else console.log('  OK  vercel.json ya no se sirve');

  const html = execFileSync('curl', ['-sS', '--max-time', '25', `${VIVO}/index.html`], { encoding: 'utf8' });
  if (!/name="robots" content="noindex, nofollow"/.test(html)) malo('la pagina en vivo no lleva el meta noindex');
  else console.log('  OK  el meta noindex esta publicado');
}

/* --- 2. Los mismos archivos por HTTP, con navegador --------------------- */
async function porHttp() {
  const srv = spawn('python3', ['-m', 'http.server', String(PUERTO), '--bind', '127.0.0.1'],
    { cwd: RAIZ, stdio: 'ignore' });
  await new Promise((r) => setTimeout(r, 1500));
  const nav = await chromium.launch({
    executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
    args: ['--no-sandbox'],
  });
  const externos = [];
  const PAGS = ['panel.html', 'proyectos.html', 'proyecto.html?id=MP-2024-001&tab=etapas',
    'proyecto.html?id=MP-2024-001&tab=mediciones', 'aprobaciones.html', 'calendario.html',
    'contratantes.html', 'reportes.html', 'direccion.html', 'usuarios.html', 'catalogos.html',
    'bitacora.html', 'perfil.html'];

  for (const [w, h, etiqueta] of [[390, 844, 'telefono'], [1440, 940, 'escritorio']]) {
    const ctx = await nav.newContext({ viewport: { width: w, height: h },
      deviceScaleFactor: w < 500 ? 2 : 1, acceptDownloads: true });
    const pg = await ctx.newPage();
    pg.on('request', (r) => { const u = r.url();
      if (!u.startsWith(LOCAL) && !u.startsWith('data:') && !u.startsWith('blob:')) externos.push(u); });
    pg.on('response', (r) => { if (r.status() >= 400) malo(`HTTP ${r.status()} en ${r.url()}`); });
    pg.on('pageerror', (e) => malo(`${etiqueta}: ${e.message}`));
    pg.on('console', (m) => { if (m.type() === 'error') malo(`${etiqueta}, consola: ${m.text()}`); });

    console.log(`\n=== 2. ${etiqueta} ${w}x${h}, servido por HTTP ===`);
    await pg.goto(`${LOCAL}/index.html`, { waitUntil: 'networkidle' });
    await pg.waitForFunction(() => !document.body.classList.contains('pi-verificando'));
    const cuentas = await pg.$$eval('.pi-cuenta', (e) => e.length);
    if (cuentas !== 8) malo(`${etiqueta}: ${cuentas} cuentas de prueba, se esperaban 8`);
    else console.log('  OK  el ingreso pinta las 8 cuentas');

    await pg.evaluate(() => PI.store.entrarComo('u-08'));
    for (const p of PAGS) {
      await pg.goto(`${LOCAL}/${p}`, { waitUntil: 'networkidle' });
      await pg.waitForFunction(() => !document.body.classList.contains('pi-verificando'));
      const r = await pg.evaluate(() => ({
        texto: document.querySelector('main').textContent.trim().length,
        desborda: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
        fuentes: Array.from(document.fonts).filter((f) => f.status === 'loaded').length,
        iconosRotos: (() => {
          const ids = new Set(Array.from(document.querySelectorAll('#pi-sprite symbol')).map((s) => s.id));
          return Array.from(document.querySelectorAll('use'))
            .map((u) => (u.getAttribute('href') || '').replace('#', ''))
            .filter((x) => x && !ids.has(x)).length;
        })(),
      }));
      if (r.texto < 200) malo(`${p}: solo ${r.texto} caracteres`);
      else if (r.desborda) malo(`${p}: se desplaza en horizontal a ${w} px`);
      else if (r.fuentes !== 2) malo(`${p}: cargaron ${r.fuentes} tipografias, se esperaban 2`);
      else if (r.iconosRotos) malo(`${p}: ${r.iconosRotos} iconos roventos`);
      else console.log(`  OK  ${p.padEnd(44)} ${r.texto} car.`);
    }

    if (etiqueta === 'escritorio') {
      console.log('\n=== 2b. La guarda, y el CSV que aqui si se descarga ===');
      await pg.evaluate(() => PI.store.cambiarRol('profesional'));
      await pg.goto(`${LOCAL}/usuarios.html`, { waitUntil: 'networkidle' });
      await pg.waitForURL(/sin-permiso/);
      const t = await pg.$eval('#pi-contenido', (e) => e.textContent);
      if (!t.includes('usuarios.html')) malo('sin-permiso no nombra la pagina bloqueada');
      else console.log('  OK  cae en Sin permiso y la nombra');

      await pg.evaluate(() => PI.store.entrarComo('u-08'));
      await pg.goto(`${LOCAL}/bitacora.html`, { waitUntil: 'networkidle' });
      await pg.waitForFunction(() => !document.body.classList.contains('pi-verificando'));
      const espera = pg.waitForEvent('download', { timeout: 10000 }).catch(() => null);
      await pg.click('[data-csv]');
      const d = await espera;
      if (!d) malo('el CSV no se descargo por HTTP');
      else console.log(`  OK  descargo ${d.suggestedFilename()}`);
    }
    await ctx.close();
  }

  console.log('\n=== 2c. No pide nada de fuera del propio sitio ===');
  if (externos.length) malo('recursos de terceros: ' + [...new Set(externos)].slice(0, 5).join(', '));
  else console.log('  OK  cero peticiones a terceros: tipografias, iconos y logo son locales');

  await nav.close();
  srv.kill();
}

(async () => {
  enVivo();
  await porHttp();
  console.log('\n' + (fallos ? `FALLOS: ${fallos}` : 'LA BETA PUBLICADA FUNCIONA POR HTTP, EN TELEFONO Y ESCRITORIO'));
  process.exit(fallos ? 1 : 0);
})();
