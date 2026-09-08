/* ============================================================================
   seed.js — Datos de ejemplo. TODO lo que hay aqui es inventado.

   QUE ES REAL Y QUE NO, porque la distincion importa y este repositorio es
   publico:

     - REAL: el contexto de la empresa y su cartera de servicios, que son los
       tipos de proyecto del catalogo, y las tres especies comerciales con las
       que trabaja (puy, algarrobo, teca). Salen de material que la propia
       empresa publica.

     - INVENTADO: absolutamente todo lo demas. Las ocho personas del equipo con
       sus correos y telefonos, los cinco contratantes, todos los montos, todas
       las fechas, todos los codigos de proyecto, todas las mediciones y todos
       los movimientos financieros.

   Los cinco contratantes eran empresas reales hasta que se limpio esta semilla:
   eran terceros que no consintieron aparecer en una demostracion publica. Ahora
   son nombres compuestos que no corresponden a ninguna empresa, y su RIF dice
   "Dato de ejemplo" en lugar de un numero, porque inventar un numero fiscal
   produce un registro falso, no un dato de ejemplo.

   Las ubicaciones quedan genericas a proposito ("Reserva forestal, estado
   Bolivar" y no una unidad de manejo concreta).

   Los correos usan el dominio monpica.example: el TLD .example esta reservado
   por la RFC 2606 y no puede pertenecer a nadie, asi que ninguna direccion de
   aqui puede coincidir con la de una persona real.

   MIENTRAS EL REPOSITORIO SEA PUBLICO, ESTA SEMILLA NO PUEDE CONTENER NINGUN
   DATO REAL. Ver la nota al principio de CLAUDE.md.

   PI_SEED es una FUNCION, no un objeto: las fechas se generan relativas al dia
   en que se siembra, asi que en cada ensayo de la demo siempre hay etapas
   vencidas y plazos proximos sin tener que editar nada.
   ========================================================================= */
(function () {
  'use strict';

  /* --- Utilidades de fecha ---------------------------------------------- */
  function desplazar(dias) {
    var f = new Date();
    f.setHours(12, 0, 0, 0);
    f.setDate(f.getDate() + dias);
    return f;
  }
  function fecha(dias) {
    var f = desplazar(dias);
    var d = String(f.getDate()).padStart(2, '0');
    var m = String(f.getMonth() + 1).padStart(2, '0');
    return d + '/' + m + '/' + f.getFullYear();
  }
  function fechaHora(dias, hh, mm) {
    return fecha(dias) + ' ' + String(hh).padStart(2, '0') + ':' + String(mm).padStart(2, '0');
  }

  /* ==========================================================================
     Catálogos. Toda clasificación del sistema sale de aquí: no hay ningún
     campo de texto libre para categoría, tipo, estado, especie ni unidad.

     Los tipos de proyecto y las categorías de gasto salen del portafolio de
     servicios del brochure de MONPICA.
     ======================================================================= */
  var CATALOGOS = {
    roles: [
      { id: 'admin',          nombre: 'Admin',          descripcion: 'Administra usuarios, catálogos y la bitácora general.' },
      { id: 'coordinador',    nombre: 'Coordinador',    descripcion: 'Crea proyectos, asigna equipo y aprueba etapas.' },
      { id: 'profesional',    nombre: 'Profesional',    descripcion: 'Ejecuta etapas asignadas y captura mediciones de campo.' },
      { id: 'administracion', nombre: 'Administración', descripcion: 'Registra y liquida movimientos financieros.' },
      { id: 'direccion',      nombre: 'Dirección',      descripcion: 'Consulta el consolidado de la cartera. Solo lectura.' }
    ],
    /* Portafolio de servicios del brochure. */
    tiposProyecto: [
      'Estudio de impacto ambiental',
      'Plan de manejo forestal',
      'Diagnóstico socio-cultural',
      'Viabilidad minera y legal',
      'Estudio de recurso hídrico',
      'Obra civil y suministro',
      'Estructuras en madera',
      'Asesoría agropecuaria'
    ],
    estadosProyecto: ['En oferta', 'En ejecución', 'Detenido', 'En permisología', 'Cerrado'],
    estadosEtapa: ['Pendiente', 'En proceso', 'Esperando aprobación', 'Devuelta', 'Aprobada', 'Bloqueada'],
    rolesProyecto: [
      'Coordinador responsable',
      'Ingeniero forestal',
      'Dasonomista',
      'Especialista ambiental',
      'Especialista socio-cultural',
      'Especialista legal y permisología',
      'Ingeniero civil',
      'Especialista hidráulico',
      'Topografía y georreferenciación',
      'Asesor agropecuario',
      'Apoyo administrativo'
    ],
    tiposDocumento: [
      'Términos de referencia',
      'Informe técnico',
      'Plan de manejo',
      'Cartografía y planos',
      'Datos brutos de campo',
      'Diagnóstico socio-cultural',
      'Permiso o autorización',
      'Acta o minuta',
      'Comprobante financiero'
    ],
    tiposMovimiento: ['Ingreso', 'Egreso'],
    estadosMovimiento: ['Por liquidar', 'Liquidado'],
    categoriasIngreso: [
      'Anticipo contractual',
      'Valuación por avance',
      'Pago de cierre'
    ],
    categoriasEgreso: [
      'Honorarios profesionales',
      'Logística y viáticos de campo',
      'Combustible y transporte',
      'Alimentación y hospedaje',
      'Ensayos de laboratorio',
      'Cartografía e imágenes satelitales',
      'Tasas y permisología',
      'Equipos y alquiler de vehículos',
      'Aserradero y procesamiento primario',
      'Materiales y suministros'
    ],
    unidades: [
      { simbolo: 'ha',  nombre: 'Hectárea' },
      { simbolo: 'm',   nombre: 'Metro' },
      { simbolo: 'cm',  nombre: 'Centímetro' },
      { simbolo: 'm3',  nombre: 'Metro cúbico' },
      { simbolo: 'ind', nombre: 'Número de árboles' }
    ],
    /* Las tres primeras, con su nombre científico, son las especies que el
       brochure de MONPICA presenta como producto. El resto son especies del
       bosque de los llanos occidentales, donde está su sede. */
    especies: [
      { id: 'sp-01', comun: 'Puy',            cientifico: 'Tabebuia serratifolia' },
      { id: 'sp-02', comun: 'Algarrobo',      cientifico: 'Hymenaea courbaril' },
      { id: 'sp-03', comun: 'Teca',           cientifico: 'Tectona grandis' },
      { id: 'sp-04', comun: 'Saqui-saqui',    cientifico: 'Pachira quinata' },
      { id: 'sp-05', comun: 'Apamate',        cientifico: 'Tabebuia rosea' },
      { id: 'sp-06', comun: 'Caoba',          cientifico: 'Swietenia macrophylla' },
      { id: 'sp-07', comun: 'Cedro amargo',   cientifico: 'Cedrela odorata' },
      { id: 'sp-08', comun: 'Mijao',          cientifico: 'Anacardium excelsum' },
      { id: 'sp-09', comun: 'Samán',          cientifico: 'Samanea saman' },
      { id: 'sp-10', comun: 'Jabillo',        cientifico: 'Hura crepitans' }
    ],
    /* Plantilla de etapas: el ciclo interno de la consultora, del contrato al
       cierre. La etapa 6 es la compuerta de aprobación. */
    plantillaEtapas: [
      { num: 1,  nombre: 'Oferta y contratación',                  compuerta: false, dias: 15 },
      { num: 2,  nombre: 'Definición del equipo y honorarios',     compuerta: false, dias: 12 },
      { num: 3,  nombre: 'Visita de campo e inventario',           compuerta: false, dias: 30 },
      { num: 4,  nombre: 'Revisión bibliográfica y antecedentes',  compuerta: false, dias: 20 },
      { num: 5,  nombre: 'Redacción del informe',                  compuerta: false, dias: 30 },
      { num: 6,  nombre: 'Revisión final del Coordinador',         compuerta: true,  dias: 15 },
      { num: 7,  nombre: 'Entrega del informe final',              compuerta: false, dias: 10 },
      { num: 8,  nombre: 'Acompañamiento en permisología',         compuerta: false, dias: 45 },
      { num: 9,  nombre: 'Seguimiento y control',                  compuerta: false, dias: 30 },
      { num: 10, nombre: 'Cierre y liquidación',                   compuerta: false, dias: 15 }
    ]
  };

  /* ==========================================================================
     Usuarios. Ocho personas ficticias que cubren los cinco roles y las
     especialidades del portafolio de MONPICA.
     ======================================================================= */
  function usuarios() {
    return [
      { id: 'u-01', nombre: 'Andrés Peñalver Cardozo',   rol: 'coordinador',    especialidad: 'Ingeniería forestal y planes de manejo',      correo: 'andres.penalver@monpica.example',  telefono: '0414-2183940', activo: true, fechaAlta: fecha(-1240) },
      { id: 'u-02', nombre: 'Elena Bastidas Quintero',       rol: 'profesional',    especialidad: 'Dasonomía e inventario forestal',             correo: 'elena.bastidas@monpica.example',      telefono: '0412-7745012', activo: true, fechaAlta: fecha(-980) },
      { id: 'u-03', nombre: 'Marcos Aguilera Rondón',  rol: 'coordinador',    especialidad: 'Recurso hídrico y obras civiles',             correo: 'marcos.aguilera@monpica.example',     telefono: '0424-3390118', activo: true, fechaAlta: fecha(-1120) },
      { id: 'u-04', nombre: 'Patricia Escalante Nieves',    rol: 'administracion', especialidad: 'Contabilidad y control presupuestario',       correo: 'patricia.escalante@monpica.example',  telefono: '0416-5528374', activo: true, fechaAlta: fecha(-860) },
      { id: 'u-05', nombre: 'Roberto Sanabria Uzcátegui',  rol: 'direccion',      especialidad: 'Dirección general y operaciones',             correo: 'roberto.sanabria@monpica.example',    telefono: '0414-9014572', activo: true, fechaAlta: fecha(-1580) },
      { id: 'u-06', nombre: 'Sofía Carrillo Mendoza',      rol: 'profesional',    especialidad: 'Permisología ambiental y minería legal',      correo: 'sofia.carrillo@monpica.example',     telefono: '0412-2286601', activo: true, fechaAlta: fecha(-640) },
      { id: 'u-07', nombre: 'Diego Fuenmayor Aranguren',  rol: 'profesional',    especialidad: 'Topografía, cartografía y obras civiles',     correo: 'diego.fuenmayor@monpica.example',     telefono: '0426-7712045', activo: true, fechaAlta: fecha(-720) },
      { id: 'u-08', nombre: 'Luis Berroterán Pacheco',    rol: 'admin',          especialidad: 'Administración del sistema',                  correo: 'luis.berroteran@monpica.example',  telefono: '0414-3350892', activo: true, fechaAlta: fecha(-1600) }
    ];
  }

  /* ==========================================================================
     Contratantes. TODOS INVENTADOS. Antes eran los cinco clientes reales que
     el brochure declara como experiencia comprobada, y este repositorio es
     publico: eran empresas de terceros que no consintieron aparecer en una
     demostracion abierta. Se sustituyeron por nombres compuestos que no
     corresponden a ninguna empresa, y el RIF es de ejemplo y se ve como tal.
     ======================================================================= */
  function contratantes() {
    return [
      { id: 'c-01', nombre: 'AGROLLANOS DEL SUR, C.A.',      rif: 'Dato de ejemplo', sector: 'Agroforestal', contacto: 'Contacto de ejemplo', cargo: '', telefono: '', correo: '', direccion: 'Zona agroforestal, estado Portuguesa' },
      { id: 'c-02', nombre: 'MINERALES ORIENTE ALTO, C.A.',  rif: 'Dato de ejemplo', sector: 'Minería',      contacto: 'Contacto de ejemplo', cargo: '', telefono: '', correo: '', direccion: 'Zona minera, estado Bolívar' },
      { id: 'c-03', nombre: 'MADERAS SERRANIA VERDE, C.A.',  rif: 'Dato de ejemplo', sector: 'Forestal',     contacto: 'Contacto de ejemplo', cargo: '', telefono: '', correo: '', direccion: 'Reserva forestal, estado Bolívar' },
      { id: 'c-04', nombre: 'AGROPECUARIA VALLE HONDO, C.A.', rif: 'Dato de ejemplo', sector: 'Agrícola',    contacto: 'Contacto de ejemplo', cargo: '', telefono: '', correo: '', direccion: 'Zona agrícola, estado Portuguesa' },
      { id: 'c-05', nombre: 'EXTRACTORA RIO CLARO, C.A.',    rif: 'Dato de ejemplo', sector: 'Minería',      contacto: 'Contacto de ejemplo', cargo: '', telefono: '', correo: '', direccion: 'Zona minera, estado Bolívar' }
    ];
  }

  /* ==========================================================================
     Proyectos. Los seis se apoyan en el portafolio real del brochure, con
     montos, fechas y avances inventados.
     ======================================================================= */

  /* Construye las 10 etapas a partir de una lista de estados y desplazamientos.
     def = [estado, diasHastaVencimiento, responsableId, comentario, aprobadaPor] */
  function etapas(defs) {
    return CATALOGOS.plantillaEtapas.map(function (p, i) {
      var d = defs[i] || ['Bloqueada', 30, null, ''];
      return {
        num: p.num,
        nombre: p.nombre,
        compuerta: p.compuerta,
        estado: d[0],
        fechaFin: fecha(d[1]),
        responsableId: d[2] || null,
        comentario: d[3] || '',
        aprobadaPor: d[0] === 'Aprobada' ? (d[4] || null) : null,
        fechaAprobacion: d[0] === 'Aprobada' ? fecha(d[1] + 1) : ''
      };
    });
  }

  function proyectos() {
    return [
      /* --- P-001: plan de manejo forestal, con DOS etapas vencidas -------- */
      {
        id: 'MP-2024-001',
        nombre: 'Plan de manejo forestal en hato ganadero',
        contratanteId: 'c-01',
        tipo: 'Plan de manejo forestal',
        estado: 'En ejecución',
        ubicacion: 'Zona agroforestal, estado Portuguesa',
        fechaInicio: fecha(-232),
        fechaFin: fecha(42),
        presupuesto: 41200,
        coordinadorId: 'u-01',
        etapas: etapas([
          ['Aprobada', -210, 'u-01', 'Contrato firmado y anticipo recibido.', 'u-01'],
          ['Aprobada', -190, 'u-01', 'Equipo conformado y honorarios pactados.', 'u-01'],
          ['Aprobada', -140, 'u-02', 'Inventario de tres parcelas completado.', 'u-01'],
          ['Aprobada',  -95, 'u-02', 'Antecedentes del predio consolidados.', 'u-01'],
          ['En proceso', -18, 'u-02', ''],
          ['Pendiente',   -5, 'u-01', ''],
          ['Bloqueada',   12, 'u-01', ''],
          ['Bloqueada',   28, 'u-06', ''],
          ['Bloqueada',   36, 'u-01', ''],
          ['Bloqueada',   42, 'u-04', '']
        ]),
        equipo: [
          { usuarioId: 'u-01', rolProyecto: 'Coordinador responsable',         honorario: 3200 },
          { usuarioId: 'u-02', rolProyecto: 'Dasonomista',                     honorario: 2400 },
          { usuarioId: 'u-07', rolProyecto: 'Topografía y georreferenciación', honorario: 1800 }
        ],
        documentos: [
          { id: 'd-0101', nombre: 'TDR_plan_manejo_las_palmitas.pdf',      tipo: 'Términos de referencia', etapa: 1, version: 'v1.0', fecha: fecha(-228), autorId: 'u-01' },
          { id: 'd-0102', nombre: 'cartografia_base_las_palmitas.dwg',     tipo: 'Cartografía y planos',   etapa: 3, version: 'v1.2', fecha: fecha(-150), autorId: 'u-07' },
          { id: 'd-0103', nombre: 'inventario_parcelas_p01_p03.xlsx',      tipo: 'Datos brutos de campo',  etapa: 3, version: 'v2.0', fecha: fecha(-142), autorId: 'u-02' },
          { id: 'd-0104', nombre: 'borrador_plan_de_manejo.docx',          tipo: 'Plan de manejo',         etapa: 5, version: 'v0.6', fecha: fecha(-22),  autorId: 'u-02' }
        ],
        mediciones: [
          { id: 'm-0101', parcela: 'P-01', hectareas: 1.0, especieId: 'sp-01', arboles: 42, altura: 18.5, dap: 34.2, volumen: 68.4, fecha: fecha(-148), responsableId: 'u-02' },
          { id: 'm-0102', parcela: 'P-01', hectareas: 1.0, especieId: 'sp-02', arboles: 29, altura: 15.2, dap: 28.6, volumen: 38.1, fecha: fecha(-147), responsableId: 'u-02' },
          { id: 'm-0103', parcela: 'P-02', hectareas: 1.0, especieId: 'sp-04', arboles: 19, altura: 21.0, dap: 41.5, volumen: 54.0, fecha: fecha(-146), responsableId: 'u-02' },
          { id: 'm-0104', parcela: 'P-02', hectareas: 1.0, especieId: 'sp-01', arboles: 25, altura: 17.8, dap: 31.0, volumen: 39.2, fecha: fecha(-145), responsableId: 'u-02' },
          { id: 'm-0105', parcela: 'P-03', hectareas: 1.5, especieId: 'sp-05', arboles: 34, altura: 23.4, dap: 39.8, volumen: 82.5, fecha: fecha(-143), responsableId: 'u-02' },
          { id: 'm-0106', parcela: 'P-03', hectareas: 1.5, especieId: 'sp-06', arboles: 11, altura: 26.1, dap: 47.3, volumen: 44.8, fecha: fecha(-142), responsableId: 'u-07' }
        ],
        finanzas: [
          { id: 'f-0101', tipo: 'Ingreso', categoria: 'Anticipo contractual',               concepto: 'Anticipo del 30 por ciento a la firma',      monto: 14550, fecha: fecha(-226), estado: 'Liquidado',    responsableId: 'u-04' },
          { id: 'f-0102', tipo: 'Egreso',  categoria: 'Logística y viáticos de campo',      concepto: 'Campaña de inventario de 12 días',           monto: 3820,  fecha: fecha(-152), estado: 'Liquidado',    responsableId: 'u-02' },
          { id: 'f-0103', tipo: 'Egreso',  categoria: 'Honorarios profesionales',           concepto: 'Pago de etapas 1 y 2 al dasonomista',        monto: 1200,  fecha: fecha(-186), estado: 'Liquidado',    responsableId: 'u-04' },
          { id: 'f-0104', tipo: 'Egreso',  categoria: 'Equipos y alquiler de vehículos',    concepto: 'Alquiler de vehículo rústico con conductor', monto: 2100,  fecha: fecha(-149), estado: 'Por liquidar', responsableId: 'u-07' },
          { id: 'f-0105', tipo: 'Egreso',  categoria: 'Cartografía e imágenes satelitales', concepto: 'Imágenes multiespectrales de 3 metros',      monto: 1450,  fecha: fecha(-140), estado: 'Liquidado',    responsableId: 'u-07' },
          { id: 'f-0106', tipo: 'Egreso',  categoria: 'Combustible y transporte',           concepto: 'Combustible de la comisión de campo',        monto: 640,   fecha: fecha(-148), estado: 'Liquidado',    responsableId: 'u-02' },
          { id: 'f-0107', tipo: 'Egreso',  categoria: 'Alimentación y hospedaje',           concepto: 'Estadía de la cuadrilla en campo',       monto: 980,   fecha: fecha(-146), estado: 'Liquidado',    responsableId: 'u-02' },
          { id: 'f-0108', tipo: 'Ingreso', categoria: 'Valuación por avance',               concepto: 'Valuación por cierre de la etapa 4',         monto: 12000, fecha: fecha(-92),  estado: 'Liquidado',    responsableId: 'u-04' }
        ]
      },

      /* --- P-002: DETENIDO, con la compuerta esperando aprobación --------- */
      {
        id: 'MP-2024-002',
        nombre: 'Manejo forestal en reserva forestal',
        contratanteId: 'c-03',
        tipo: 'Plan de manejo forestal',
        estado: 'Detenido',
        ubicacion: 'Reserva forestal, estado Bolívar',
        fechaInicio: fecha(-188),
        fechaFin: fecha(78),
        presupuesto: 87300,
        coordinadorId: 'u-01',
        etapas: etapas([
          ['Aprobada', -172, 'u-01', 'Contrato suscrito con el concesionario.', 'u-01'],
          ['Aprobada', -158, 'u-01', 'Equipo multidisciplinario asignado.', 'u-01'],
          ['Aprobada', -120, 'u-02', 'Inventario de la unidad de manejo cerrado.', 'u-01'],
          ['Aprobada',  -86, 'u-06', 'Antecedentes y marco normativo revisados.', 'u-01'],
          ['Aprobada',  -34, 'u-01', 'Plan de manejo consolidado y entregado a revisión.', 'u-01'],
          ['Esperando aprobación', 6, 'u-01', 'Plan de manejo de 320 páginas cargado. Requiere revisión final del Coordinador y visto bueno de la Dirección antes de la consignación ante la autoridad ambiental.'],
          ['Bloqueada', 22, 'u-01', ''],
          ['Bloqueada', 48, 'u-06', ''],
          ['Bloqueada', 66, 'u-01', ''],
          ['Bloqueada', 78, 'u-04', '']
        ]),
        equipo: [
          { usuarioId: 'u-01', rolProyecto: 'Coordinador responsable',            honorario: 3800 },
          { usuarioId: 'u-06', rolProyecto: 'Especialista legal y permisología',  honorario: 2600 },
          { usuarioId: 'u-07', rolProyecto: 'Topografía y georreferenciación',    honorario: 2500 },
          { usuarioId: 'u-02', rolProyecto: 'Ingeniero forestal',                 honorario: 2200 }
        ],
        documentos: [
          { id: 'd-0201', nombre: 'TDR_imataca_unidad_iv.pdf',            tipo: 'Términos de referencia',   etapa: 1, version: 'v1.0', fecha: fecha(-184), autorId: 'u-01' },
          { id: 'd-0202', nombre: 'plan_manejo_imataca_v1.pdf',           tipo: 'Plan de manejo',           etapa: 5, version: 'v1.0', fecha: fecha(-36),  autorId: 'u-01' },
          { id: 'd-0203', nombre: 'diagnostico_comunidades_imataca.pdf',  tipo: 'Diagnóstico socio-cultural', etapa: 4, version: 'v1.1', fecha: fecha(-52), autorId: 'u-06' },
          { id: 'd-0204', nombre: 'planos_unidad_manejo_iv.dwg',          tipo: 'Cartografía y planos',     etapa: 3, version: 'v2.0', fecha: fecha(-118), autorId: 'u-07' }
        ],
        mediciones: [
          { id: 'm-0201', parcela: 'IM-01', hectareas: 4.5, especieId: 'sp-01', arboles: 62, altura: 24.5, dap: 42.1, volumen: 148.6, fecha: fecha(-124), responsableId: 'u-02' },
          { id: 'm-0202', parcela: 'IM-02', hectareas: 3.2, especieId: 'sp-02', arboles: 38, altura: 22.9, dap: 38.4, volumen: 96.2,  fecha: fecha(-122), responsableId: 'u-02' },
          { id: 'm-0203', parcela: 'IM-02', hectareas: 3.2, especieId: 'sp-06', arboles: 14, altura: 27.4, dap: 51.0, volumen: 62.8,  fecha: fecha(-121), responsableId: 'u-07' }
        ],
        finanzas: [
          { id: 'f-0201', tipo: 'Ingreso', categoria: 'Anticipo contractual',          concepto: 'Anticipo del 30 por ciento a la firma',   monto: 28800, fecha: fecha(-180), estado: 'Liquidado',    responsableId: 'u-04' },
          { id: 'f-0202', tipo: 'Egreso',  categoria: 'Ensayos de laboratorio',        concepto: 'Análisis de suelos de la unidad IV',      monto: 4200,  fecha: fecha(-112), estado: 'Liquidado',    responsableId: 'u-04' },
          { id: 'f-0203', tipo: 'Egreso',  categoria: 'Logística y viáticos de campo', concepto: 'Campamento base de la comisión técnica',  monto: 6100,  fecha: fecha(-96),  estado: 'Por liquidar', responsableId: 'u-01' },
          { id: 'f-0204', tipo: 'Egreso',  categoria: 'Honorarios profesionales',      concepto: 'Pago parcial de honorarios de etapa 5',   monto: 5400,  fecha: fecha(-30),  estado: 'Liquidado',    responsableId: 'u-04' },
          { id: 'f-0205', tipo: 'Egreso',  categoria: 'Tasas y permisología',          concepto: 'Tasas de consignación del expediente',    monto: 1860,  fecha: fecha(-24),  estado: 'Por liquidar', responsableId: 'u-06' }
        ]
      },

      /* --- P-003: recurso hídrico, con una etapa devuelta ----------------- */
      {
        id: 'MP-2024-003',
        nombre: 'Estudio de recurso hídrico y pozo profundo',
        contratanteId: 'c-04',
        tipo: 'Estudio de recurso hídrico',
        estado: 'En ejecución',
        ubicacion: 'Zona agrícola, estado Portuguesa',
        fechaInicio: fecha(-146),
        fechaFin: fecha(64),
        presupuesto: 58900,
        coordinadorId: 'u-03',
        etapas: etapas([
          ['Aprobada', -130, 'u-03', 'Contrato adjudicado.', 'u-03'],
          ['Aprobada', -112, 'u-03', 'Equipo hidráulico asignado.', 'u-03'],
          ['Aprobada',  -68, 'u-07', 'Levantamiento topográfico y prospección cerrados.', 'u-03'],
          ['Devuelta',  -12, 'u-07', 'Falta la memoria de cálculo del caudal de explotación y el perfil litológico del pozo. Se devuelve para completar antes de pasar a redacción.'],
          ['Pendiente',  26, 'u-03', ''],
          ['Bloqueada',  40, 'u-03', ''],
          ['Bloqueada',  48, 'u-03', ''],
          ['Bloqueada',  56, 'u-06', ''],
          ['Bloqueada',  60, 'u-03', ''],
          ['Bloqueada',  64, 'u-04', '']
        ]),
        equipo: [
          { usuarioId: 'u-03', rolProyecto: 'Coordinador responsable',  honorario: 3100 },
          { usuarioId: 'u-07', rolProyecto: 'Especialista hidráulico',  honorario: 2300 }
        ],
        documentos: [
          { id: 'd-0301', nombre: 'TDR_pozo_flor_de_paraiso.pdf',       tipo: 'Términos de referencia', etapa: 1, version: 'v1.0', fecha: fecha(-142), autorId: 'u-03' },
          { id: 'd-0302', nombre: 'prospeccion_geoelectrica.zip',       tipo: 'Datos brutos de campo',  etapa: 3, version: 'v1.0', fecha: fecha(-72),  autorId: 'u-07' }
        ],
        mediciones: [],
        finanzas: [
          { id: 'f-0301', tipo: 'Ingreso', categoria: 'Anticipo contractual',            concepto: 'Primer anticipo de la obra',          monto: 15600, fecha: fecha(-140), estado: 'Liquidado',    responsableId: 'u-04' },
          { id: 'f-0302', tipo: 'Egreso',  categoria: 'Equipos y alquiler de vehículos', concepto: 'Equipo de prospección geoeléctrica',  monto: 5400,  fecha: fecha(-104), estado: 'Liquidado',    responsableId: 'u-07' },
          { id: 'f-0303', tipo: 'Egreso',  categoria: 'Logística y viáticos de campo',   concepto: 'Estadía de la cuadrilla técnica',     monto: 2900,  fecha: fecha(-70),  estado: 'Por liquidar', responsableId: 'u-03' },
          { id: 'f-0304', tipo: 'Egreso',  categoria: 'Combustible y transporte',        concepto: 'Traslados al sector de trabajo',         monto: 720,   fecha: fecha(-66),  estado: 'Liquidado',    responsableId: 'u-07' }
        ]
      },

      /* --- P-004: estructuras en madera, en oferta ------------------------ */
      {
        id: 'MP-2024-004',
        nombre: 'Suministro e instalación de techos y decks en madera estructural',
        contratanteId: 'c-01',
        tipo: 'Estructuras en madera',
        estado: 'En oferta',
        ubicacion: 'Zona industrial, estado Portuguesa',
        fechaInicio: fecha(-24),
        fechaFin: fecha(158),
        presupuesto: 29600,
        coordinadorId: 'u-03',
        etapas: etapas([
          ['En proceso', 8,  'u-03', ''],
          ['Pendiente',  26, 'u-03', ''],
          ['Bloqueada',  62, 'u-07', ''],
          ['Bloqueada',  84, 'u-06', ''],
          ['Bloqueada', 112, 'u-03', ''],
          ['Bloqueada', 128, 'u-03', ''],
          ['Bloqueada', 138, 'u-03', ''],
          ['Bloqueada', 146, 'u-06', ''],
          ['Bloqueada', 152, 'u-03', ''],
          ['Bloqueada', 158, 'u-04', '']
        ]),
        equipo: [
          { usuarioId: 'u-03', rolProyecto: 'Coordinador responsable', honorario: 1500 }
        ],
        documentos: [
          { id: 'd-0401', nombre: 'propuesta_tecnica_techos_decks.pdf', tipo: 'Términos de referencia', etapa: 1, version: 'v0.3', fecha: fecha(-18), autorId: 'u-03' }
        ],
        mediciones: [],
        finanzas: []
      },

      /* --- P-005: viabilidad minera, en permisología ---------------------- */
      {
        id: 'MP-2024-005',
        nombre: 'Viabilidad ambiental y legal para proyecto aurífero',
        contratanteId: 'c-05',
        tipo: 'Viabilidad minera y legal',
        estado: 'En permisología',
        ubicacion: 'Zona minera, estado Bolívar',
        fechaInicio: fecha(-284),
        fechaFin: fecha(56),
        presupuesto: 66400,
        coordinadorId: 'u-01',
        etapas: etapas([
          ['Aprobada', -270, 'u-01', 'Contrato suscrito.', 'u-01'],
          ['Aprobada', -256, 'u-01', 'Equipo asignado.', 'u-01'],
          ['Aprobada', -212, 'u-07', 'Levantamiento del área de intervención completado.', 'u-01'],
          ['Aprobada', -178, 'u-06', 'Marco jurídico minero y ambiental consolidado.', 'u-01'],
          ['Aprobada', -128, 'u-01', 'Informe de viabilidad redactado.', 'u-01'],
          ['Aprobada',  -98, 'u-01', 'Revisión final conforme.', 'u-01'],
          ['Aprobada',  -82, 'u-01', 'Informe entregado al contratante.', 'u-01'],
          ['En proceso', 18, 'u-06', ''],
          ['Bloqueada',  44, 'u-01', ''],
          ['Bloqueada',  56, 'u-04', '']
        ]),
        equipo: [
          { usuarioId: 'u-01', rolProyecto: 'Coordinador responsable',           honorario: 3400 },
          { usuarioId: 'u-06', rolProyecto: 'Especialista legal y permisología', honorario: 2900 },
          { usuarioId: 'u-07', rolProyecto: 'Topografía y georreferenciación',   honorario: 2100 }
        ],
        documentos: [
          { id: 'd-0501', nombre: 'informe_viabilidad_aurifera.pdf',      tipo: 'Informe técnico',        etapa: 5, version: 'v1.0', fecha: fecha(-132), autorId: 'u-01' },
          { id: 'd-0502', nombre: 'solicitud_autorizacion_ambiental.pdf', tipo: 'Permiso o autorización', etapa: 8, version: 'v1.0', fecha: fecha(-64),  autorId: 'u-06' }
        ],
        mediciones: [],
        finanzas: [
          { id: 'f-0501', tipo: 'Ingreso', categoria: 'Anticipo contractual',   concepto: 'Anticipo del 40 por ciento',          monto: 31200, fecha: fecha(-278), estado: 'Liquidado',    responsableId: 'u-04' },
          { id: 'f-0502', tipo: 'Egreso',  categoria: 'Ensayos de laboratorio', concepto: 'Caracterización de suelos y aguas',   monto: 5600,  fecha: fecha(-206), estado: 'Liquidado',    responsableId: 'u-04' },
          { id: 'f-0503', tipo: 'Egreso',  categoria: 'Tasas y permisología',   concepto: 'Tasas de tramitación ante el ente',   monto: 2240,  fecha: fecha(-58),  estado: 'Por liquidar', responsableId: 'u-06' },
          { id: 'f-0504', tipo: 'Ingreso', categoria: 'Valuación por avance',   concepto: 'Valuación por entrega del informe',   monto: 23400, fecha: fecha(-78),  estado: 'Liquidado',    responsableId: 'u-04' }
        ]
      },

      /* --- P-006: asesoría ambiental minera, cerrado ---------------------- */
      {
        id: 'MP-2023-018',
        nombre: 'Asesoría ambiental para explotación aurífera',
        contratanteId: 'c-02',
        tipo: 'Estudio de impacto ambiental',
        estado: 'Cerrado',
        ubicacion: 'Zona minera, estado Bolívar',
        fechaInicio: fecha(-520),
        fechaFin: fecha(-118),
        presupuesto: 71800,
        coordinadorId: 'u-01',
        etapas: etapas([
          ['Aprobada', -506, 'u-01', 'Contrato suscrito.', 'u-01'],
          ['Aprobada', -492, 'u-01', 'Equipo asignado.', 'u-01'],
          ['Aprobada', -440, 'u-02', 'Caracterización del área de influencia.', 'u-01'],
          ['Aprobada', -404, 'u-06', 'Marco normativo y antecedentes revisados.', 'u-01'],
          ['Aprobada', -344, 'u-01', 'Estudio de impacto ambiental redactado.', 'u-01'],
          ['Aprobada', -316, 'u-01', 'Revisión final conforme.', 'u-01'],
          ['Aprobada', -296, 'u-01', 'Estudio entregado y consignado.', 'u-01'],
          ['Aprobada', -238, 'u-06', 'Autorización ambiental obtenida.', 'u-01'],
          ['Aprobada', -160, 'u-02', 'Monitoreo de doce meses cerrado.', 'u-01'],
          ['Aprobada', -122, 'u-04', 'Liquidación final y archivo técnico.', 'u-01']
        ]),
        equipo: [
          { usuarioId: 'u-01', rolProyecto: 'Coordinador responsable',   honorario: 3600 },
          { usuarioId: 'u-02', rolProyecto: 'Especialista ambiental',    honorario: 2400 },
          { usuarioId: 'u-06', rolProyecto: 'Especialista socio-cultural', honorario: 2000 }
        ],
        documentos: [
          { id: 'd-0601', nombre: 'estudio_impacto_ambiental_final.pdf', tipo: 'Informe técnico', etapa: 7,  version: 'v2.0', fecha: fecha(-300), autorId: 'u-02' },
          { id: 'd-0602', nombre: 'acta_cierre_tecnico.pdf',             tipo: 'Acta o minuta',   etapa: 10, version: 'v1.0', fecha: fecha(-120), autorId: 'u-01' }
        ],
        mediciones: [
          { id: 'm-0601', parcela: 'MB-01', hectareas: 2.0, especieId: 'sp-08', arboles: 56, altura: 14.2, dap: 28.4, volumen: 46.8, fecha: fecha(-436), responsableId: 'u-02' },
          { id: 'm-0602', parcela: 'MB-01', hectareas: 2.0, especieId: 'sp-09', arboles: 48, altura: 13.9, dap: 27.6, volumen: 35.1, fecha: fecha(-435), responsableId: 'u-02' },
          { id: 'm-0603', parcela: 'MB-02', hectareas: 1.8, especieId: 'sp-10', arboles: 39, altura: 15.1, dap: 29.2, volumen: 37.4, fecha: fecha(-164), responsableId: 'u-02' }
        ],
        finanzas: [
          { id: 'f-0601', tipo: 'Ingreso', categoria: 'Anticipo contractual',          concepto: 'Anticipo inicial',                  monto: 19200, fecha: fecha(-514), estado: 'Liquidado', responsableId: 'u-04' },
          { id: 'f-0602', tipo: 'Egreso',  categoria: 'Honorarios profesionales',      concepto: 'Honorarios del equipo técnico',     monto: 8000,  fecha: fecha(-330), estado: 'Liquidado', responsableId: 'u-04' },
          { id: 'f-0603', tipo: 'Egreso',  categoria: 'Logística y viáticos de campo', concepto: 'Campañas de monitoreo trimestral',  monto: 5250,  fecha: fecha(-240), estado: 'Liquidado', responsableId: 'u-02' },
          { id: 'f-0604', tipo: 'Ingreso', categoria: 'Pago de cierre',                concepto: 'Pago final contra acta de cierre',  monto: 44800, fecha: fecha(-118), estado: 'Liquidado', responsableId: 'u-04' }
        ]
      }
    ];
  }

  /* ==========================================================================
     Bitácora. Treinta registros de días anteriores, para que la auditoría no
     aparezca vacía al abrir la demo.
     ======================================================================= */
  function bitacora() {
    var b = [
      [-1,  16, 42, 'u-01', 'ETAPA_ENVIADA_A_APROBACION', 'Etapa',     'MP-2024-002', 'Etapa 6 enviada a revisión final del Coordinador.'],
      [-1,  15, 18, 'u-01', 'DOCUMENTO_CARGADO',          'Documento', 'MP-2024-002', 'Carga de plan_manejo_imataca_v1.pdf en la etapa 5.'],
      [-1,  11, 30, 'u-04', 'MOVIMIENTO_REGISTRADO',      'Finanza',   'MP-2024-005', 'Egreso por 2.240,00 USD en Tasas y permisología, por liquidar.'],
      [-1,   9, 12, 'u-08', 'SESION_INICIADA',            'Usuario',   null,          'Ingreso al sistema como Admin.'],
      [-2,  17,  5, 'u-03', 'ETAPA_DEVUELTA',             'Etapa',     'MP-2024-003', 'Etapa 4 devuelta con observaciones sobre la memoria de cálculo del caudal.'],
      [-2,  14, 22, 'u-07', 'MEDICION_REGISTRADA',        'Medición',  'MP-2024-001', 'Parcela P-03: 11 árboles de Caoba, volumen 44,8 m3 de captura manual.'],
      [-2,  10, 48, 'u-04', 'MOVIMIENTO_LIQUIDADO',       'Finanza',   'MP-2024-002', 'Egreso de 5.400,00 USD en Honorarios profesionales marcado como liquidado.'],
      [-3,  16, 40, 'u-01', 'ALERTA_VENCIMIENTO',         'Etapa',     'MP-2024-001', 'Etapa 6 vencida sin cierre. Proyecto con dos etapas fuera de plazo.'],
      [-3,  12, 15, 'u-02', 'DOCUMENTO_CARGADO',          'Documento', 'MP-2024-001', 'Carga de borrador_plan_de_manejo.docx en la etapa 5.'],
      [-3,   9, 55, 'u-05', 'CONSULTA_DIRECCION',         'Proyecto',  null,          'Consulta del consolidado de cartera desde la vista de Dirección.'],
      [-4,  15, 33, 'u-06', 'DOCUMENTO_CARGADO',          'Documento', 'MP-2024-005', 'Carga de solicitud_autorizacion_ambiental.pdf en la etapa 8.'],
      [-4,  11,  8, 'u-08', 'CATALOGO_ACTUALIZADO',       'Catálogo',  null,          'Alta de la especie Samán (Samanea saman) en el catálogo.'],
      [-5,  16, 20, 'u-01', 'ETAPA_APROBADA',             'Etapa',     'MP-2024-002', 'Etapa 5 aprobada. Se habilita la compuerta de la etapa 6.'],
      [-5,  13, 44, 'u-04', 'MOVIMIENTO_REGISTRADO',      'Finanza',   'MP-2024-001', 'Ingreso por 12.000,00 USD en Valuación por avance.'],
      [-6,  17, 12, 'u-01', 'ETAPA_APROBADA',             'Etapa',     'MP-2024-005', 'Etapa 7 aprobada. Informe entregado al contratante.'],
      [-6,  10, 26, 'u-02', 'MEDICION_REGISTRADA',        'Medición',  'MP-2024-001', 'Parcela P-02: 25 árboles de Puy, volumen 39,2 m3 de captura manual.'],
      [-7,  15, 50, 'u-08', 'USUARIO_ACTUALIZADO',        'Usuario',   null,          'Actualización de la especialidad de Diego Fuenmayor Aranguren.'],
      [-7,  11, 35, 'u-03', 'PROYECTO_CREADO',            'Proyecto',  'MP-2024-004', 'Alta del expediente MP-2024-004 con las 10 etapas de la plantilla.'],
      [-8,  16,  2, 'u-04', 'REPORTE_GENERADO',           'Reporte',   null,          'Generación del reporte de cierre de mes en dólares.'],
      [-8,  12, 40, 'u-07', 'DOCUMENTO_CARGADO',          'Documento', 'MP-2024-002', 'Carga de planos_unidad_manejo_iv.dwg en la etapa 3.'],
      [-9,  14, 18, 'u-06', 'DOCUMENTO_CARGADO',          'Documento', 'MP-2024-002', 'Carga de diagnostico_comunidades_imataca.pdf en la etapa 4.'],
      [-9,   9, 30, 'u-03', 'SESION_INICIADA',            'Usuario',   null,          'Ingreso al sistema como Coordinador.'],
      [-10, 16, 44, 'u-01', 'ETAPA_APROBADA',             'Etapa',     'MP-2024-001', 'Etapa 4 aprobada. Antecedentes del predio consolidados.'],
      [-11, 13, 22, 'u-04', 'MOVIMIENTO_REGISTRADO',      'Finanza',   'MP-2024-003', 'Egreso por 2.900,00 USD en Logística y viáticos de campo, por liquidar.'],
      [-12, 15, 10, 'u-08', 'CATALOGO_ACTUALIZADO',       'Catálogo',  null,          'Alta de la categoría Aserradero y procesamiento primario en el catálogo financiero.'],
      [-13, 11, 55, 'u-02', 'MEDICION_REGISTRADA',        'Medición',  'MP-2024-001', 'Parcela P-01: 42 árboles de Puy, volumen 68,4 m3 de captura manual.'],
      [-14, 17, 30, 'u-05', 'CONSULTA_DIRECCION',         'Proyecto',  null,          'Revisión de la cartera en sesión de Dirección.'],
      [-15, 12,  8, 'u-01', 'EQUIPO_ASIGNADO',            'Equipo',    'MP-2024-002', 'Asignación de Elena Bastidas Quintero como Ingeniero forestal.'],
      [-16, 14, 46, 'u-01', 'PROYECTO_ACTUALIZADO',       'Proyecto',  'MP-2024-005', 'Cambio de estado a En permisología.'],
      [-18, 10, 20, 'u-08', 'USUARIO_CREADO',             'Usuario',   null,          'Alta del usuario Sofía Carrillo Mendoza con rol Profesional.']
    ];
    return b.map(function (r, i) {
      return {
        id: 'b-' + String(1000 + i),
        fechaHora: fechaHora(r[0], r[1], r[2]),
        usuarioId: r[3],
        accion: r[4],
        entidad: r[5],
        proyectoId: r[6],
        detalle: r[7]
      };
    });
  }

  /* ==========================================================================
     Estado inicial completo
     ======================================================================= */
  window.PI_SEED = function () {
    return {
      version: 5,
      sembradoEn: fechaHora(0, new Date().getHours(), new Date().getMinutes()),
      rolActivo: 'coordinador',
      usuarioActivo: 'u-01',
      catalogos: JSON.parse(JSON.stringify(CATALOGOS)),
      usuarios: usuarios(),
      contratantes: contratantes(),
      proyectos: proyectos(),
      bitacora: bitacora()
    };
  };

  /* Clave única de todas las cuentas de prueba. Existe solo para que el
     ingreso de la demostración se parezca a uno real: no hay contraseñas
     guardadas por usuario ni cifrado, porque no hay servidor. Se va junto con
     este archivo cuando el sistema tenga autenticación de verdad. */
  window.PI_CLAVE_DEMO = 'monpica2025';

  /* Usuario de referencia por rol: el que se activa al elegir un rol en la
     barra de demostración. */
  window.PI_USUARIO_POR_ROL = {
    admin: 'u-08',
    coordinador: 'u-01',
    profesional: 'u-02',
    administracion: 'u-04',
    direccion: 'u-05'
  };
})();
