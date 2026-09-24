/* El cajon de navegacion de pantalla estrecha.
   Existe porque ninguna otra prueba hace clic con ancho de telefono: el velo
   del cajon llego a quedarse invisible pero encima de todo, tragandose cada
   clic de la pagina, y las seis suites pasaron igual. */
const { chromium } = require('/tmp/pw/node_modules/playwright');
const BASE = 'file:///home/user/app-privada-minec-';
let fallos = 0;
function comprobar(cond, m) { if (cond) console.log('  ok   ' + m); else { console.log('  FALLA ' + m); fallos++; } }

(async () => {
  const nav = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
    args: ['--allow-file-access-from-files', '--no-sandbox'] });

  async function abrir(ancho, alto, rol, ruta) {
    const ctx = await nav.newContext({ viewport: { width: ancho, height: alto } });
    await ctx.route('**/*', r => { const u = r.request().url();
      return (u.startsWith('file://') || u.startsWith('data:') || u.startsWith('blob:')) ? r.continue() : r.abort(); });
    const p = await ctx.newPage();
    await p.goto(BASE + '/index.html');
    await p.evaluate(r => PI.store.cambiarRol(r), rol);
    await p.goto(BASE + '/' + ruta, { waitUntil: 'load' });
    await p.waitForTimeout(320);
    return { ctx, p };
  }

  for (const ancho of [360, 390, 768, 900]) {
    console.log('\n=== ' + ancho + ' px ===');
    const { ctx, p } = await abrir(ancho, 780, 'coordinador', 'panel.html');

    comprobar(await p.isVisible('#pi-hamburguesa'), 'la hamburguesa se ve');
    comprobar(!(await p.isVisible('#pi-menu')), 'el cajon arranca cerrado');

    /* El fallo que motivo esta prueba: con el cajon cerrado, el velo no puede
       interceptar los clics del contenido. Se comprueba golpeando el centro
       de la pagina y preguntando quien recibe el golpe. */
    const receptor = await p.evaluate(() => {
      const e = document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2);
      return e ? (e.id || e.className || e.tagName) : 'nada';
    });
    comprobar(String(receptor).indexOf('pi-velo') < 0,
      'con el cajon cerrado el velo no intercepta los clics (recibe: ' + receptor + ')');

    await p.click('#pi-hamburguesa');
    await p.waitForTimeout(380);
    comprobar(await p.isVisible('#pi-menu'), 'al pulsar la hamburguesa el cajon se abre');
    comprobar(await p.getAttribute('#pi-hamburguesa', 'aria-expanded') === 'true', 'aria-expanded pasa a true');

    const est = await p.evaluate(() => {
      const m = document.getElementById('pi-menu');
      return { x: Math.round(m.getBoundingClientRect().x),
               enlaces: m.querySelectorAll('.pi-nav a').length,
               rotulos: [].every.call(m.querySelectorAll('.pi-nav a span.txt'),
                 s => getComputedStyle(s).display !== 'none'),
               grupos: [].some.call(m.querySelectorAll('.pi-nav-grupo > .eti'),
                 s => getComputedStyle(s).display !== 'none'),
               salir: !!m.querySelector('.pi-menu-acciones a[href="index.html"]'),
               perfil: !!m.querySelector('.pi-nav a[href="perfil.html"]'),
               bloqueo: getComputedStyle(document.documentElement).overflow === 'hidden',
               foco: document.activeElement && document.activeElement.id };
    });
    comprobar(est.x === 0, 'el cajon queda pegado al borde izquierdo');
    comprobar(est.enlaces >= 8, 'lleva todos los enlaces del rol (' + est.enlaces + ')');
    comprobar(est.rotulos, 'cada enlace muestra su rotulo, no solo el icono');
    comprobar(est.grupos, 'los grupos del menu conservan su titulo');
    /* La regla de CLAUDE.md: si un control se esconde en movil, tiene que
       quedar otra manera de hacer lo mismo. Salir y Mi perfil salen de la
       barra superior, asi que el cajon es quien los tiene que ofrecer. */
    comprobar(est.salir, 'Salir sigue alcanzable desde el cajon');
    comprobar(est.perfil, 'Mi perfil sigue alcanzable desde el cajon');
    comprobar(est.bloqueo, 'el cuerpo no se desplaza con el cajon abierto');
    comprobar(est.foco === 'pi-menu-cerrar', 'el foco entra al cajon');

    await p.keyboard.press('Escape');
    await p.waitForTimeout(380);
    comprobar(!(await p.isVisible('#pi-menu')), 'Escape cierra el cajon');
    comprobar(await p.evaluate(() => document.activeElement.id) === 'pi-hamburguesa',
      'el foco vuelve a la hamburguesa');
    comprobar(await p.evaluate(() => getComputedStyle(document.documentElement).overflow) !== 'hidden',
      'el desplazamiento del cuerpo se libera al cerrar');

    await p.click('#pi-hamburguesa'); await p.waitForTimeout(380);
    await p.click('#pi-velo', { position: { x: ancho - 10, y: 400 } });
    await p.waitForTimeout(380);
    comprobar(!(await p.isVisible('#pi-menu')), 'tocar fuera cierra el cajon');

    await ctx.close();
  }

  console.log('\n=== 1200 px: en escritorio no hay cajon ===');
  const { ctx, p } = await abrir(1200, 900, 'admin', 'panel.html');
  comprobar(!(await p.isVisible('#pi-hamburguesa')), 'la hamburguesa no se ve');
  comprobar(await p.isVisible('#pi-menu'), 'el menu lateral esta a la vista');
  comprobar(await p.isVisible('.pi-barra-fin a[href="perfil.html"]'), 'Mi perfil sigue en la barra superior');
  comprobar(!(await p.isVisible('#pi-velo')), 'no hay velo');
  await ctx.close();

  await nav.close();
  console.log(fallos ? '\n' + fallos + ' FALLAS' : '\nTODAS LAS COMPROBACIONES PASARON');
  process.exit(fallos ? 1 : 0);
})();
