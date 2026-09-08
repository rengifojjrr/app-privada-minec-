const { chromium } = require('/tmp/pw/node_modules/playwright');
const BASE = 'file:///home/user/app-privada-minec-';
const OUT = '/tmp/claude-0/-home-user-app-privada-minec-/a0dc8991-050c-59eb-ad8b-2c8da3c4b5eb/scratchpad/capturas';
require('fs').mkdirSync(OUT, { recursive: true });
let fallos = 0;
function malo(m){ console.log('  FALLA: ' + m); fallos++; }

(async () => {
  const nav = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
    args: ['--allow-file-access-from-files','--no-sandbox'] });

  async function recorrer(ancho, alto, etiqueta, rol) {
    const ctx = await nav.newContext({ viewport: { width: ancho, height: alto }, deviceScaleFactor: 1 });
    await ctx.route('**/*', r => { const u = r.request().url();
      return (u.startsWith('file://')||u.startsWith('data:')||u.startsWith('blob:')) ? r.continue() : r.abort(); });
    const pag = await ctx.newPage();
    await pag.goto(BASE + '/index.html'); await pag.evaluate(r => PI.store.cambiarRol(r), rol);

    const RUTAS = etiqueta === 'movil'
      ? ['panel.html','proyectos.html','proyecto.html?id=MP-2024-001&tab=etapas',
         'proyecto.html?id=MP-2024-001&tab=mediciones','proyecto.html?id=MP-2024-001&tab=finanzas',
         'aprobaciones.html','calendario.html','contratantes.html','reportes.html','direccion.html',
         'usuarios.html','catalogos.html','bitacora.html','perfil.html','index.html','sin-permiso.html',
         'fase2-portal.html','fase3-asistente.html','proyecto-nuevo.html']
      : ['index.html','panel.html','proyectos.html','proyecto.html?id=MP-2024-002&tab=resumen',
         'proyecto.html?id=MP-2024-002&tab=etapas','proyecto.html?id=MP-2024-001&tab=equipo',
         'proyecto.html?id=MP-2024-001&tab=mediciones','proyecto.html?id=MP-2024-001&tab=finanzas',
         'proyecto.html?id=MP-2024-001&tab=documentos','proyecto.html?id=MP-2024-001&tab=bitacora',
         'proyecto-nuevo.html','aprobaciones.html','calendario.html','contratantes.html','reportes.html',
         'direccion.html','usuarios.html','catalogos.html','bitacora.html','perfil.html',
         'sin-permiso.html','fase2-portal.html','fase3-asistente.html'];

    console.log(`\n=== ${etiqueta} (${ancho}x${alto}), rol ${rol} ===`);
    for (const r of RUTAS) {
      await pag.goto(BASE + '/' + r, { waitUntil: 'load' });
      await pag.waitForTimeout(320);
      const m = await pag.evaluate(() => {
        const de = document.documentElement;
        // ¿algún elemento se desborda horizontalmente?
        const anchoV = de.clientWidth;
        let culpables = [];
        document.querySelectorAll('body *').forEach(el => {
          const rect = el.getBoundingClientRect();
          if (rect.width > 0 && rect.right > anchoV + 2) {
            const est = getComputedStyle(el);
            // permitido si el propio elemento o un ancestro cercano tiene scroll horizontal
            let n = el, permitido = false;
            for (; n && n !== document.documentElement; n = n.parentElement) {
              const o = getComputedStyle(n).overflowX;
              if (o === 'auto' || o === 'scroll') { permitido = true; break; }
            }
            if (!permitido) culpables.push(el.tagName.toLowerCase() + '.' + (el.className || '').toString().split(' ')[0] + ' →' + Math.round(rect.right));
          }
        });
        return {
          scrollH: de.scrollWidth > de.clientWidth + 1,
          scrollW: de.scrollWidth, clientW: de.clientWidth,
          culpables: culpables.slice(0, 4)
        };
      });
      const nombre = r.replace(/[?=&]/g, '_');
      if (m.scrollH) malo(`${etiqueta} ${r}: la página se desplaza en horizontal (${m.scrollW} > ${m.clientW}) ${m.culpables.join(', ')}`);
      else if (m.culpables.length) malo(`${etiqueta} ${r}: elementos desbordados sin scroll propio: ${m.culpables.join(', ')}`);
      else console.log(`  OK  ${r}`);
      if (etiqueta === 'escritorio') {
        await pag.screenshot({ path: `${OUT}/${nombre}.png`, fullPage: false });
      }
    }
    await ctx.close();
  }

  await recorrer(1440, 940, 'escritorio', 'admin');
  await recorrer(390, 780, 'movil', 'coordinador');
  await recorrer(768, 900, 'tableta', 'coordinador');

  await nav.close();
  console.log('\n' + (fallos ? 'FALLOS: ' + fallos : 'SIN DESBORDES HORIZONTALES EN NINGUN TAMAÑO'));
  process.exit(fallos ? 1 : 0);
})();
