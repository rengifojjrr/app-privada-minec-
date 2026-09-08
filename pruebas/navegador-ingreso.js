const { chromium } = require('/tmp/pw/node_modules/playwright');
const OUT = '/tmp/claude-0/-home-user-app-privada-minec-/a0dc8991-050c-59eb-ad8b-2c8da3c4b5eb/scratchpad/capturas';
let fallos = 0;
const malo = m => { console.log('  FALLA: ' + m); fallos++; };
const bien = m => console.log('  OK  ' + m);
(async () => {
  const nav = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--allow-file-access-from-files','--no-sandbox'] });
  const ctx = await nav.newContext({ viewport: { width: 1440, height: 1000 } });
  const externos = [];
  await ctx.route('**/*', r => { const u=r.request().url();
    if (u.startsWith('file://')||u.startsWith('data:')||u.startsWith('blob:')) return r.continue();
    externos.push(u); return r.abort(); });
  const p = await ctx.newPage();
  const errs = [];
  p.on('console', m => { if (m.type()==='error') errs.push(m.text()); });
  p.on('pageerror', e => errs.push('pageerror: ' + e.message));
  const ir = async () => { errs.length = 0; await p.goto('file:///home/user/app-privada-minec-/index.html'); await p.waitForTimeout(360); };

  console.log('=== 1. La pantalla carga ===');
  await ir();
  if (errs.length) malo('errores de consola: ' + errs[0]); else bien('sin errores de consola');
  const cuentas = await p.evaluate(() => Array.from(document.querySelectorAll('[data-u]')).map(b => ({ id: b.dataset.u, txt: b.innerText.replace(/\n/g,' / '), off: b.disabled })));
  console.log('  cuentas ofrecidas: ' + cuentas.length);
  cuentas.forEach(c => console.log('    ' + c.id + '  ' + c.txt + (c.off ? '  [desactivado]' : '')));
  if (cuentas.length !== 8) malo('deben ser las 8 cuentas de la semilla');
  const sinIdentidad = await p.evaluate(() => !document.querySelector('.pi-barra .pi-usuario'));
  if (!sinIdentidad) malo('la barra superior muestra identidad en el ingreso'); else bien('la barra no muestra identidad todavía');
  const conBeta = await p.evaluate(() => /BETA/.test((document.querySelector('.pi-beta')||{}).innerText||''));
  if (!conBeta) malo('falta la marca BETA'); else bien('la marca BETA está presente');
  await p.screenshot({ path: OUT + '/acceso.png' });

  console.log('\n=== 2. Pulsar una cuenta carga sus credenciales ===');
  await p.click('[data-u="u-02"]'); await p.waitForTimeout(220);
  const cargado = await p.evaluate(() => ({ correo: document.getElementById('a-correo').value, clave: document.getElementById('a-clave').value.length,
    marcado: document.querySelector('[data-u="u-02"]').getAttribute('aria-pressed') }));
  if (cargado.correo !== 'elena.ramos@monpica.com.ve') malo('el correo no se cargó: ' + cargado.correo);
  else bien('cargó ' + cargado.correo);
  if (!cargado.clave) malo('la contraseña no se cargó'); else bien('la contraseña se cargó (' + cargado.clave + ' caracteres)');
  if (cargado.marcado !== 'true') malo('la cuenta elegida no queda resaltada'); else bien('la cuenta elegida queda resaltada');

  console.log('\n=== 3. Errores ===');
  await ir();
  await p.click('button[type=submit]'); await p.waitForTimeout(220);
  let e = await p.evaluate(() => (document.querySelector('.pi-acceso-error')||{}).innerText || '');
  if (!/correo/i.test(e)) malo('sin correo no avisa: "' + e + '"'); else bien('sin correo: ' + e.trim());
  await p.fill('#a-correo', 'nadie@ejemplo.com'); await p.fill('#a-clave', 'monpica2025');
  await p.click('button[type=submit]'); await p.waitForTimeout(220);
  e = await p.evaluate(() => (document.querySelector('.pi-acceso-error')||{}).innerText || '');
  if (!/ninguna cuenta/i.test(e)) malo('correo inexistente no avisa: "' + e + '"'); else bien('correo inexistente: ' + e.trim());
  await p.fill('#a-correo', 'elena.ramos@monpica.com.ve'); await p.fill('#a-clave', 'mala');
  await p.click('button[type=submit]'); await p.waitForTimeout(220);
  e = await p.evaluate(() => (document.querySelector('.pi-acceso-error')||{}).innerText || '');
  if (!/incorrecta/i.test(e)) malo('contraseña mala no avisa: "' + e + '"'); else bien('contraseña incorrecta: ' + e.trim());
  if (p.url().split('/').pop() !== 'index.html') malo('entró con contraseña incorrecta');
  else bien('no entra con contraseña incorrecta');

  console.log('\n=== 4. Cada usuario entra con su propio rol ===');
  const ESPERADO = { 'u-01':'coordinador','u-02':'profesional','u-03':'coordinador','u-04':'administracion',
                     'u-05':'direccion','u-06':'profesional','u-07':'profesional','u-08':'admin' };
  for (const [id, rolEsperado] of Object.entries(ESPERADO)) {
    await ir();
    await p.click('[data-u="' + id + '"]'); await p.waitForTimeout(180);
    await p.click('button[type=submit]');
    await p.waitForURL(/panel\.html/, { timeout: 8000 }).catch(() => {});
    await p.waitForFunction(() => window.PI && window.PI.store, null, { timeout: 8000 });
    await p.waitForTimeout(260);
    const r = await p.evaluate(() => ({ rol: PI.store.rol(), u: PI.store.usuario().id, pag: location.pathname.split('/').pop(),
      menu: document.querySelectorAll('.pi-nav a').length, quien: (document.querySelector('.pi-usuario-txt strong')||{}).innerText }));
    if (r.u !== id || r.rol !== rolEsperado) malo(id + ': entró como ' + r.u + '/' + r.rol);
    else if (r.pag !== 'panel.html') malo(id + ': no llegó al panel, está en ' + r.pag);
    else bien(id + ' → ' + r.quien + ' (' + r.rol + '), ' + r.menu + ' enlaces de menú');
    if (errs.length) malo(id + ': errores de consola: ' + errs[0]);
  }

  console.log('\n=== 5. Un usuario desactivado no entra ===');
  await p.evaluate(() => { PI.store.cambiarRol('admin'); PI.store.alternarUsuario('u-07'); });
  await ir();
  const tachado = await p.evaluate(() => document.querySelector('[data-u="u-07"]').disabled);
  if (!tachado) malo('el usuario desactivado sigue pulsable'); else bien('el usuario desactivado aparece deshabilitado');
  await p.fill('#a-correo', 'diego.torres@monpica.com.ve'); await p.fill('#a-clave', 'monpica2025');
  await p.click('button[type=submit]'); await p.waitForTimeout(260);
  e = await p.evaluate(() => (document.querySelector('.pi-acceso-error')||{}).innerText || '');
  if (!/desactivado/i.test(e)) malo('deja entrar a un desactivado: "' + e + '"'); else bien('rechaza al desactivado: ' + e.trim());
  await p.evaluate(() => { PI.store.alternarUsuario('u-07'); });

  console.log('\n=== 6. Nada pide internet ===');
  if (externos.length) malo('recursos externos: ' + [...new Set(externos)].slice(0,3).join(', '));
  else bien('cero peticiones a la red');

  console.log('\n=== 7. Móvil ===');
  const ctx2 = await nav.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx2.route('**/*', r => { const u=r.request().url(); return (u.startsWith('file://')||u.startsWith('data:')||u.startsWith('blob:'))?r.continue():r.abort(); });
  const p2 = await ctx2.newPage();
  await p2.goto('file:///home/user/app-privada-minec-/index.html'); await p2.waitForTimeout(420);
  const m = await p2.evaluate(() => { const de = document.documentElement; return { desborda: de.scrollWidth > de.clientWidth + 1 }; });
  if (m.desborda) malo('el ingreso se desplaza en horizontal en móvil'); else bien('sin desborde horizontal en móvil');
  await p2.screenshot({ path: OUT + '/acceso-movil.png', fullPage: true });

  await nav.close();
  console.log('\n' + (fallos ? 'FALLOS: ' + fallos : 'EL INGRESO FUNCIONA PARA LOS OCHO USUARIOS'));
  process.exit(fallos ? 1 : 0);
})();
