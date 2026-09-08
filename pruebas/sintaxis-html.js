// Extrae el <script> en linea de cada HTML y comprueba su sintaxis.
const fs = require('fs'), vm = require('vm'), path = require('path');
let fallos = 0;
for (const f of process.argv.slice(2)) {
  const s = fs.readFileSync(f, 'utf8');
  const m = [...s.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)];
  if (!m.length) { console.log(`  (sin script)   ${f}`); continue; }
  m.forEach((x, i) => {
    try { new vm.Script(x[1], { filename: f }); console.log(`  OK             ${f}${m.length>1?' #'+(i+1):''}`); }
    catch (e) { console.log(`  ERROR SINTAXIS ${f}: ${e.message}`); fallos++; }
  });
}
process.exit(fallos ? 1 : 0);
