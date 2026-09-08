const { chromium } = require('/tmp/pw/node_modules/playwright');
const PAGS = ['index.html','panel.html','proyectos.html','proyecto-nuevo.html','aprobaciones.html','calendario.html',
 'contratantes.html','reportes.html','direccion.html','usuarios.html','catalogos.html','bitacora.html','perfil.html',
 'sin-permiso.html','fase2-portal.html','fase3-asistente.html',
 ...['resumen','etapas','equipo','documentos','mediciones','finanzas','bitacora'].map(t => 'proyecto.html?id=MP-2024-001&tab='+t),
 ...['resumen','etapas','equipo','documentos','finanzas'].map(t => 'proyecto.html?id=MP-2024-002&tab='+t),
 ...['resumen','etapas'].map(t => 'proyecto.html?id=MP-2024-003&tab='+t),
 'proyecto.html?id=MP-2024-004&tab=resumen','proyecto.html?id=MP-2024-005&tab=resumen','proyecto.html?id=MP-2023-018&tab=resumen'];
(async () => {
  const nav = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--allow-file-access-from-files','--no-sandbox'] });
  const ctx = await nav.newContext({ viewport: { width: 1600, height: 1200 } });
  await ctx.route('**/*', r => { const u=r.request().url(); return (u.startsWith('file://')||u.startsWith('data:')||u.startsWith('blob:'))?r.continue():r.abort(); });
  const pag = await ctx.newPage();
  await pag.goto('file:///home/user/app-privada-minec-/index.html');
  await pag.evaluate(() => PI.store.cambiarRol('admin'));
  const palabras = new Map();
  for (const p of PAGS) {
    await pag.goto('file:///home/user/app-privada-minec-/' + p, { waitUntil: 'load' });
    await pag.waitForTimeout(200);
    // desplegar todos los selects y modales visibles
    const txt = await pag.evaluate(() => {
      let t = document.body.innerText;
      document.querySelectorAll('select').forEach(s => { t += ' ' + Array.from(s.options).map(o=>o.textContent).join(' '); });
      document.querySelectorAll('[placeholder]').forEach(i => { t += ' ' + i.getAttribute('placeholder'); });
      document.querySelectorAll('[title]').forEach(i => { t += ' ' + i.getAttribute('title'); });
      return t;
    });
    txt.split(/[^A-Za-zÁÉÍÓÚÑáéíóúñü]+/).forEach(w => {
      if (w.length < 4) return;
      if (!palabras.has(w)) palabras.set(w, p);
    });
  }
  // Palabras SIN tilde que la necesitan: heuristica por terminacion y por lista
  const RE = [
    /^[A-Za-z]+cion$/i, /^[A-Za-z]+ciones$/i, /^[A-Za-z]+sion$/i,
    /^[A-Za-z]+logia$/i, /^[A-Za-z]+grafia$/i, /^[A-Za-z]+metria$/i,
    /^[A-Za-z]+nomia$/i, /^[A-Za-z]+ico$/i, /^[A-Za-z]+ica$/i, /^[A-Za-z]+icos$/i, /^[A-Za-z]+icas$/i,
  ];
  const BLANCA = new Set(['chico','rico','unico','fisico','publico','practico','basico','historico','clasico','magico',
    'medico','logico','critico','plastico','elastico','domestico','estatico','automatico','matematico','informatico',
    'quimico','fisica','musica','logica','critica','practica','tecnica','publica','basica','magica','clinica','etica',
    'america','africa','republica','dominica','chica','rica','pica','indica','implica','aplica','explica','comunica',
    'fabrica','ubica','dedica','multiplica','significa','verifica','justifica','modifica','identifica','notifica',
    'planifica','clarifica','simplifica','amplifica','certifica','especifica','unifica','ratifica','tipifica']);
  const sosp = [];
  for (const [w, p] of palabras) {
    const l = w.toLowerCase();
    if (/[áéíóúñü]/i.test(w)) continue;
    if (BLANCA.has(l)) continue;
    if (RE.some(r => r.test(l))) sosp.push(w + '  (' + p + ')');
  }
  // Lista adicional de palabras concretas frecuentes sin tilde
  const EXTRA = ['dia','dias','mas','solo','esta','estan','aqui','asi','tambien','segun','despues','ademas','ningun',
    'algun','util','facil','difícil','debil','movil','arbol','arboles','numero','codigo','titulo','ultimo','ultima',
    'proximo','proxima','minimo','maximo','termino','regimen','margen','volumen','area','linea','pagina','maquina',
    'sabado','miercoles','septiembre','ambito','indice','limite','analisis','sintesis','credito','deposito','transito',
    'deficit','superavit','pais','paises','raiz','maiz','sera','estara','habra','podra','tendra','vera','ira'];
  for (const [w, p] of palabras) {
    if (/[áéíóúñü]/i.test(w)) continue;
    if (EXTRA.includes(w.toLowerCase())) sosp.push('[lista] ' + w + '  (' + p + ')');
  }
  console.log('palabras distintas revisadas:', palabras.size);
  console.log('sospechosas:', sosp.length);
  sosp.sort().forEach(s => console.log('  ' + s));
  await nav.close();
})();
