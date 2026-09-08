const { chromium } = require('/tmp/pw/node_modules/playwright');
const OUT = '/tmp/claude-0/-home-user-app-privada-minec-/a0dc8991-050c-59eb-ad8b-2c8da3c4b5eb/scratchpad/capturas';
let fallos = 0;
(async () => {
  const nav = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--allow-file-access-from-files','--no-sandbox'] });
  for (const [w,h,tag] of [[360,760,'movil-estrecho'],[390,844,'movil'],[768,1024,'tableta'],[1440,940,'escritorio']]) {
    const ctx = await nav.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: tag.startsWith('movil') ? 2 : 1 });
    await ctx.route('**/*', r => { const u=r.request().url(); return (u.startsWith('file://')||u.startsWith('data:')||u.startsWith('blob:'))?r.continue():r.abort(); });
    const p = await ctx.newPage();
    await p.goto('file:///home/user/app-privada-minec-/index.html');
    await p.evaluate(() => PI.store.cambiarRol('coordinador'));
    console.log('=== ' + tag + ' ' + w + 'x' + h + ' ===');
    for (const r of ['panel.html','proyectos.html','proyecto.html?id=PI-2024-001&tab=mediciones','aprobaciones.html','calendario.html','reportes.html','perfil.html','contratantes.html','direccion.html']) {
      await p.goto('file:///home/user/app-privada-minec-/' + r); await p.waitForTimeout(400);
      const m = await p.evaluate(() => {
        const de = document.documentElement;
        const barra = document.querySelector('.pi-barra');
        const demo = document.getElementById('pi-demo');
        const ultimo = document.querySelector('.pi-lienzo > div:last-child, .pi-lienzo > *:last-child');
        const varDemo = getComputedStyle(de).getPropertyValue('--demo-alto').trim();
        // ¿el ultimo bloque de contenido queda debajo de la barra de demo?
        de.scrollTop = de.scrollHeight;
        const rectU = ultimo ? ultimo.getBoundingClientRect() : null;
        const rectD = demo ? demo.getBoundingClientRect() : null;
        return {
          desbordaDoc: de.scrollWidth > de.clientWidth + 1,
          barraDesborda: barra ? barra.scrollWidth > barra.clientWidth + 1 : false,
          varDemo, altoDemo: rectD ? Math.round(rectD.height) : 0,
          tapado: rectU && rectD ? rectU.bottom > rectD.top + 1 : false
        };
      });
      const problemas = [];
      if (m.desbordaDoc) problemas.push('la pagina se desplaza en horizontal');
      if (m.barraDesborda) problemas.push('la barra superior se corta');
      if (m.tapado) problemas.push('el ultimo bloque queda debajo de la barra de demo');
      if (m.varDemo !== m.altoDemo + 'px') problemas.push('--demo-alto (' + m.varDemo + ') no coincide con la altura real (' + m.altoDemo + 'px)');
      if (problemas.length) { console.log('  FALLA ' + r + ': ' + problemas.join('; ')); fallos++; }
      else console.log('  OK  ' + r + '  (barra de demo ' + m.altoDemo + 'px)');
    }
    if (tag === 'movil') {
      for (const r of ['proyectos.html','proyecto.html?id=PI-2024-001&tab=finanzas']) {
        await p.goto('file:///home/user/app-privada-minec-/' + r); await p.waitForTimeout(400);
        await p.screenshot({ path: `${OUT}/mv-${r.replace(/[?=&.]/g,'_')}.png` });
      }
    }
    await ctx.close();
  }
  await nav.close();
  console.log('\n' + (fallos ? 'FALLOS: ' + fallos : 'SIN CORTES NI CONTENIDO TAPADO EN NINGUN TAMAÑO'));
  process.exit(fallos ? 1 : 0);
})();
