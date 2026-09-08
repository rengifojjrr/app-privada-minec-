/* ============================================================================
   calendario-y-reportes.js — Las dos pantallas consolidadas.

   Existe porque las dos "no mostraban nada" segun el informe del cliente, y al
   verificarlo el diagnostico era otro:

     - El calendario SI pintaba: 31 etapas, 3 vencidas y dos listas laterales
       con contenido. Lo que no tenia eran los filtros por proyecto y por
       responsable, y sin ellos con muchos proyectos la rejilla es ilegible.

     - Los reportes SI generaban, pero el periodo arrancaba en el mes en curso
       y la semilla genera las fechas hacia atras, asi que abrian en un mes sin
       movimientos. Decia "Sin movimientos en el mes", que es correcto, pero se
       lee como que el reporte esta roto. Ahora arranca en el ultimo mes que
       tiene datos.

   Las dos cosas se comprueban aqui para que no vuelvan.
   ========================================================================= */
const { chromium } = require('/tmp/pw/node_modules/playwright');
const B = 'file:///home/user/app-privada-minec-';
let f = 0; const malo = (m) => { console.log('  FALLA ' + m); f++; };
(async () => {
  const nav = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const pg = await (await nav.newContext({ viewport: { width: 1440, height: 940 } })).newPage();
  const err = []; pg.on('pageerror', e => err.push(e.message)); pg.on('console', m => { if (m.type()==='error') err.push(m.text()); });
  const ir = async (u) => { await pg.goto(B + '/' + u);
    await pg.waitForFunction(() => !document.body.classList.contains('pi-verificando')); await pg.waitForTimeout(300); };
  await ir('panel.html'); await pg.evaluate(() => PI.store.entrarComo('u-01'));
  await ir('calendario.html');

  const leer = () => pg.evaluate(() => ({
    kpis: Array.from(document.querySelectorAll('.kpi-val')).map((e) => e.textContent.trim()),
    eventos: document.querySelectorAll('.cal-dia .cal-eventos > *').length,
    opcProy: document.getElementById('c-proyecto').options.length,
    opcResp: document.getElementById('c-responsable').options.length,
    lateral: document.querySelectorAll('#pi-lateral .tarjeta').length
  }));

  let a = await leer();
  console.log('sin filtro:', JSON.stringify(a));
  if (a.opcProy < 2) malo('el filtro de proyecto no tiene opciones');
  if (a.opcResp < 2) malo('el filtro de responsable no tiene opciones');
  const abiertas = Number(a.kpis[0]);

  // filtrar por un proyecto
  const idProy = await pg.evaluate(() => document.getElementById('c-proyecto').options[1].value);
  await pg.selectOption('#c-proyecto', idProy);
  await pg.waitForTimeout(300);
  let b = await leer();
  console.log('filtrado por ' + idProy + ':', JSON.stringify(b));
  if (Number(b.kpis[0]) >= abiertas) malo('filtrar por proyecto no redujo las etapas abiertas');
  else console.log('  OK  el filtro de proyecto reduce ' + abiertas + ' -> ' + b.kpis[0]);
  if (b.eventos > a.eventos) malo('la rejilla no se redujo');
  else console.log('  OK  la rejilla pinta ' + b.eventos + ' eventos (antes ' + a.eventos + ')');

  // limpiar
  await pg.click('#c-limpiar'); await pg.waitForTimeout(300);
  let c = await leer();
  if (Number(c.kpis[0]) !== abiertas) malo('limpiar no restaura: ' + c.kpis[0] + ' vs ' + abiertas);
  else console.log('  OK  limpiar restaura las ' + abiertas + ' etapas');

  // filtrar por responsable
  const idResp = await pg.evaluate(() => document.getElementById('c-responsable').options[1].value);
  await pg.selectOption('#c-responsable', idResp);
  await pg.waitForTimeout(300);
  let d = await leer();
  if (Number(d.kpis[0]) >= abiertas) malo('filtrar por responsable no redujo nada');
  else console.log('  OK  el filtro de responsable reduce ' + abiertas + ' -> ' + d.kpis[0]);
  if (d.lateral !== 2) malo('el lateral perdio sus dos listas');

  /* --- Reportes: el periodo tiene que abrir donde hay datos ------------- */
  console.log('reportes: el periodo abre donde hay datos');
  for (const par of [['u-01', 'coordinador'], ['u-04', 'administracion'], ['u-05', 'direccion']]) {
    await ir('panel.html');
    await pg.evaluate((x) => PI.store.entrarComo(x), par[0]);
    await ir('reportes.html');
    const r = await pg.evaluate(() => ({
      mes: document.getElementById('r-mes').value,
      anio: document.getElementById('r-anio').value,
      filas: document.querySelectorAll('#pi-contenido tbody tr').length,
      vacio: !!document.querySelector('#pi-contenido .vacio')
    }));
    if (r.vacio || r.filas === 0) {
      malo(par[1] + ': el reporte abre vacio en ' + r.mes + '/' + r.anio);
    } else {
      console.log('  OK  ' + par[1].padEnd(15) + 'abre en ' + r.mes + '/' + r.anio + ' con ' + r.filas + ' filas');
    }
  }

  console.log('errores:', err.length ? err : 'ninguno');
  await nav.close();
  console.log(f ? 'FALLOS: ' + f : 'CALENDARIO Y REPORTES MUESTRAN CONTENIDO');
  process.exit(f ? 1 : 0);
})();
