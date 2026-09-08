/* ============================================================================
   seed.js — Datos de ejemplo.

   Todo es inventado. Personas y empresas son ficticias, pensadas para que
   resulten verosímiles en Venezuela sin parecerse a ninguna organización real.

   Las fechas se generan RELATIVAS al dia en que se siembra, para que en cada
   ensayo de la demo haya siempre etapas vencidas y plazos próximos. Por eso
   PI_SEED es una función y no un objeto literal.

   Define window.PI_SEED. No usa módulos ni fetch: funciona con file://
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
     ======================================================================= */
  var CATALOGOS = {
    roles: [
      { id: 'admin',          nombre: 'Admin',          descripcion: 'Administra usuarios, catálogos y la bitácora general.' },
      { id: 'coordinador',    nombre: 'Coordinador',     descripcion: 'Crea proyectos, asigna equipo y aprueba etapas.' },
      { id: 'profesional',    nombre: 'Profesional',     descripcion: 'Ejecuta etapas asignadas y captura mediciones de campo.' },
      { id: 'administracion', nombre: 'Administración',  descripcion: 'Registra y liquida movimientos financieros.' },
      { id: 'direccion',      nombre: 'Dirección',       descripcion: 'Consulta el consolidado de la cartera. Solo lectura.' }
    ],
    tiposProyecto: [
      'Informe técnico forestal',
      'Estudio de impacto ambiental',
      'Obras hidráulicas',
      'Obras civiles',
      'Modelo de negocios',
      'Restauración ecológica',
      'Permisología ambiental'
    ],
    estadosProyecto: ['En oferta', 'En ejecución', 'Detenido', 'En permisología', 'Cerrado'],
    estadosEtapa: ['Pendiente', 'En proceso', 'Esperando aprobación', 'Devuelta', 'Aprobada', 'Bloqueada'],
    rolesProyecto: [
      'Coordinador responsable',
      'Dasonomista principal',
      'Especialista forestal',
      'Especialista en fauna',
      'Especialista legal ambiental',
      'Topografía y georreferenciación',
      'Especialista hidráulico',
      'Apoyo administrativo'
    ],
    tiposDocumento: [
      'Términos de referencia',
      'Informe técnico',
      'Cartografía y planos',
      'Datos brutos de campo',
      'Estudio socioambiental',
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
      'Equipos y alquiler de vehículos'
    ],
    unidades: [
      { simbolo: 'ha',  nombre: 'Hectárea' },
      { simbolo: 'm',   nombre: 'Metro' },
      { simbolo: 'cm',  nombre: 'Centímetro' },
      { simbolo: 'm3',  nombre: 'Metro cúbico' },
      { simbolo: 'ind', nombre: 'Número de árboles' }
    ],
    especies: [
      { id: 'sp-01', comun: 'Araguaney',        cientifico: 'Handroanthus chrysanthus' },
      { id: 'sp-02', comun: 'Apamate',          cientifico: 'Tabebuia rosea' },
      { id: 'sp-03', comun: 'Caoba',            cientifico: 'Swietenia macrophylla' },
      { id: 'sp-04', comun: 'Cují yaque',       cientifico: 'Prosopis juliflora' },
      { id: 'sp-05', comun: 'Saqui-saqui',      cientifico: 'Pachira quinata' },
      { id: 'sp-06', comun: 'Palo blanco',      cientifico: 'Calycophyllum candidissimum' },
      { id: 'sp-07', comun: 'Mora de Guayana',  cientifico: 'Mora excelsa' },
      { id: 'sp-08', comun: 'Guatácaro',        cientifico: 'Bourreria cumanensis' },
      { id: 'sp-09', comun: 'Puy',              cientifico: 'Handroanthus serratifolius' },
      { id: 'sp-10', comun: 'Jabillo',          cientifico: 'Hura crepitans' }
    ],
    /* Plantilla de etapas. Es el ciclo interno de la consultora, tomado de la
       única versión del export que lo describe (el asistente de alta), no de
       un trámite estatal. La etapa 6 es la compuerta de aprobación. */
    plantillaEtapas: [
      { num: 1,  nombre: 'Oferta y contratación',                     compuerta: false, dias: 15 },
      { num: 2,  nombre: 'Definición del equipo y honorarios',        compuerta: false, dias: 12 },
      { num: 3,  nombre: 'Visita de campo e inventario',              compuerta: false, dias: 30 },
      { num: 4,  nombre: 'Revisión bibliográfica y antecedentes',     compuerta: false, dias: 20 },
      { num: 5,  nombre: 'Redacción del informe',                     compuerta: false, dias: 30 },
      { num: 6,  nombre: 'Revisión final del Coordinador',            compuerta: true,  dias: 15 },
      { num: 7,  nombre: 'Entrega del informe final',                 compuerta: false, dias: 10 },
      { num: 8,  nombre: 'Acompañamiento en permisología',            compuerta: false, dias: 45 },
      { num: 9,  nombre: 'Seguimiento y control',                     compuerta: false, dias: 30 },
      { num: 10, nombre: 'Cierre y liquidación',                      compuerta: false, dias: 15 }
    ]
  };

  /* ==========================================================================
     Usuarios. Ocho personas que cubren los cinco roles.
     ======================================================================= */
  function usuarios() {
    return [
      { id: 'u-01', nombre: 'Carlos Mendoza Rangel',    rol: 'coordinador',    especialidad: 'Ingeniería ambiental y estudios de impacto', correo: 'carlos.mendoza@proyectosintegrales.com.ve',  telefono: '0414-2183940', activo: true,  fechaAlta: fecha(-1240) },
      { id: 'u-02', nombre: 'Elena Ramos Pineda',       rol: 'profesional',    especialidad: 'Ingeniería forestal y dasonomía',            correo: 'elena.ramos@proyectosintegrales.com.ve',    telefono: '0412-7745012', activo: true,  fechaAlta: fecha(-980) },
      { id: 'u-03', nombre: 'Marcos Silva Betancourt',  rol: 'coordinador',    especialidad: 'Hidráulica y manejo de cuencas',             correo: 'marcos.silva@proyectosintegrales.com.ve',   telefono: '0424-3390118', activo: true,  fechaAlta: fecha(-1120) },
      { id: 'u-04', nombre: 'Patricia Duarte Ochoa',    rol: 'administracion', especialidad: 'Contabilidad y control presupuestario',      correo: 'patricia.duarte@proyectosintegrales.com.ve', telefono: '0416-5528374', activo: true,  fechaAlta: fecha(-860) },
      { id: 'u-05', nombre: 'Roberto Gómez Alcántara',  rol: 'direccion',      especialidad: 'Dirección general y operaciones',            correo: 'roberto.gomez@proyectosintegrales.com.ve',  telefono: '0414-9014572', activo: true,  fechaAlta: fecha(-1580) },
      { id: 'u-06', nombre: 'Sofía Alcalá Moreno',      rol: 'profesional',    especialidad: 'Marco legal ambiental y consulta comunitaria', correo: 'sofia.alcala@proyectosintegrales.com.ve',  telefono: '0412-2286601', activo: true,  fechaAlta: fecha(-640) },
      { id: 'u-07', nombre: 'Diego Torres Villamizar',  rol: 'profesional',    especialidad: 'Ingeniería civil y topografía',              correo: 'diego.torres@proyectosintegrales.com.ve',   telefono: '0426-7712045', activo: true,  fechaAlta: fecha(-720) },
      { id: 'u-08', nombre: 'Luis Vallenilla Prado',    rol: 'admin',          especialidad: 'Administración del sistema',                 correo: 'luis.vallenilla@proyectosintegrales.com.ve', telefono: '0414-3350892', activo: true,  fechaAlta: fecha(-1600) }
    ];
  }

  /* ==========================================================================
     Contratantes
     ======================================================================= */
  function contratantes() {
    return [
      { id: 'c-01', nombre: 'Consorcio Maderero del Caroní, C.A.',   rif: 'J-40918231-0', sector: 'Forestal',        contacto: 'Ing. Héctor Berrizbeitia', cargo: 'Gerente de operaciones',  telefono: '0285-6320114', correo: 'contacto@maderocaroni.com.ve',  direccion: 'Av. Guayana, Puerto Ordaz, estado Bolívar' },
      { id: 'c-02', nombre: 'Generadora Eólica Paraguaná, S.A.',     rif: 'J-31849201-9', sector: 'Energia',         contacto: 'Lic. Andreína Colmenares', cargo: 'Coordinadora ambiental',  telefono: '0269-2481077', correo: 'ambiente@eolicaparaguana.com.ve', direccion: 'Zona Industrial, Punto Fijo, estado Falcón' },
      { id: 'c-03', nombre: 'Aguas y Saneamiento del Centro, C.A.',  rif: 'J-00291844-3', sector: 'Servicios',       contacto: 'Ing. Ramón Escalona',      cargo: 'Jefe de proyectos',       telefono: '0258-8114520', correo: 'proyectos@aguascentro.com.ve',  direccion: 'Calle Bolívar, San Carlos, estado Cojedes' },
      { id: 'c-04', nombre: 'Inversiones Agroforestales Macizo, C.A.', rif: 'J-50182740-1', sector: 'Agroforestal',  contacto: 'Sr. Gustavo Piñango',      cargo: 'Director de inversiones', telefono: '0291-4407718', correo: 'inversiones@macizoagro.com.ve', direccion: 'Av. Libertador, Maturín, estado Monagas' },
      { id: 'c-05', nombre: 'Consorcio Energético Llanero, C.A.',    rif: 'J-29840175-6', sector: 'Energia',         contacto: 'Ing. Yolanda Piñate',      cargo: 'Gerente de permisología', telefono: '0247-3318806', correo: 'permisos@energeticollanero.com.ve', direccion: 'Carretera Nacional, Valle de la Pascua, estado Guárico' },
      { id: 'c-06', nombre: 'Fundación Agricola Valle Verde',        rif: 'J-30778412-5', sector: 'Fundación',       contacto: 'Prof. Nelson Quintero',    cargo: 'Presidente',              telefono: '0276-3450219', correo: 'dirección@fundavalleverde.org.ve', direccion: 'Sector La Vega, La Grita, estado Táchira' }
    ];
  }

  /* ==========================================================================
     Proyectos
     ======================================================================= */

  /* Construye las 10 etapas a partir de una lista de estados y desplazamientos.
     def = [estado, diasHastaVencimiento, responsableId, comentario] */
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
      /* --- P-001: en ejecución, con DOS etapas vencidas ------------------- */
      {
        id: 'PI-2024-001',
        nombre: 'Inventario forestal y plan de manejo cuenca del rio Aro',
        contratanteId: 'c-01',
        tipo: 'Informe técnico forestal',
        estado: 'En ejecución',
        ubicacion: 'Sector El Almacén, municipio Angostura, estado Bolívar',
        fechaInicio: fecha(-232),
        fechaFin: fecha(42),
        presupuesto: 48500,
        coordinadorId: 'u-01',
        etapas: etapas([
          ['Aprobada', -210, 'u-01', 'Contrato firmado y anticipo recibido.', 'u-01'],
          ['Aprobada', -190, 'u-01', 'Equipo conformado y honorarios pactados.', 'u-01'],
          ['Aprobada', -140, 'u-02', 'Inventario de tres parcelas completado.', 'u-01'],
          ['Aprobada',  -95, 'u-02', 'Antecedentes de la cuenca consolidados.', 'u-01'],
          ['En proceso', -18, 'u-02', ''],
          ['Pendiente',   -5, 'u-01', ''],
          ['Bloqueada',   12, 'u-01', ''],
          ['Bloqueada',   28, 'u-06', ''],
          ['Bloqueada',   36, 'u-01', ''],
          ['Bloqueada',   42, 'u-04', '']
        ]),
        equipo: [
          { usuarioId: 'u-01', rolProyecto: 'Coordinador responsable',         honorario: 3200 },
          { usuarioId: 'u-02', rolProyecto: 'Dasonomista principal',           honorario: 2400 },
          { usuarioId: 'u-07', rolProyecto: 'Topografía y georreferenciación', honorario: 1800 }
        ],
        documentos: [
          { id: 'd-0101', nombre: 'TDR_aprobados_rio_aro.pdf',              tipo: 'Términos de referencia', etapa: 1, version: 'v1.0', fecha: fecha(-228), autorId: 'u-01' },
          { id: 'd-0102', nombre: 'cartografia_base_subcuenca_aro.dwg',     tipo: 'Cartografía y planos',   etapa: 3, version: 'v1.2', fecha: fecha(-150), autorId: 'u-07' },
          { id: 'd-0103', nombre: 'muestreo_parcelas_p01_p03.xlsx',         tipo: 'Datos brutos de campo',  etapa: 3, version: 'v2.0', fecha: fecha(-142), autorId: 'u-02' },
          { id: 'd-0104', nombre: 'informe_preliminar_manejo.docx',         tipo: 'Informe técnico',        etapa: 5, version: 'v0.6', fecha: fecha(-22),  autorId: 'u-02' }
        ],
        mediciones: [
          { id: 'm-0101', parcela: 'P-01', hectareas: 1.0, especieId: 'sp-06', arboles: 42, altura: 18.5, dap: 34.2, volumen: 68.4, fecha: fecha(-148), responsableId: 'u-02' },
          { id: 'm-0102', parcela: 'P-01', hectareas: 1.0, especieId: 'sp-10', arboles: 29, altura: 15.2, dap: 28.6, volumen: 38.1, fecha: fecha(-147), responsableId: 'u-02' },
          { id: 'm-0103', parcela: 'P-02', hectareas: 1.0, especieId: 'sp-05', arboles: 19, altura: 21.0, dap: 41.5, volumen: 54.0, fecha: fecha(-146), responsableId: 'u-02' },
          { id: 'm-0104', parcela: 'P-02', hectareas: 1.0, especieId: 'sp-06', arboles: 25, altura: 17.8, dap: 31.0, volumen: 39.2, fecha: fecha(-145), responsableId: 'u-02' },
          { id: 'm-0105', parcela: 'P-03', hectareas: 1.5, especieId: 'sp-08', arboles: 34, altura: 23.4, dap: 39.8, volumen: 82.5, fecha: fecha(-143), responsableId: 'u-02' },
          { id: 'm-0106', parcela: 'P-03', hectareas: 1.5, especieId: 'sp-03', arboles: 11, altura: 26.1, dap: 47.3, volumen: 44.8, fecha: fecha(-142), responsableId: 'u-07' }
        ],
        finanzas: [
          { id: 'f-0101', tipo: 'Ingreso', categoria: 'Anticipo contractual',              concepto: 'Anticipo del 30 por ciento a la firma',        monto: 14550, fecha: fecha(-226), estado: 'Liquidado',    responsableId: 'u-04' },
          { id: 'f-0102', tipo: 'Egreso',  categoria: 'Logística y viáticos de campo',     concepto: 'Campaña de muestreo terrestre de 12 días',     monto: 3820,  fecha: fecha(-152), estado: 'Liquidado',    responsableId: 'u-02' },
          { id: 'f-0103', tipo: 'Egreso',  categoria: 'Honorarios profesionales',          concepto: 'Pago de etapas 1 y 2 al dasonomista',          monto: 1200,  fecha: fecha(-186), estado: 'Liquidado',    responsableId: 'u-04' },
          { id: 'f-0104', tipo: 'Egreso',  categoria: 'Equipos y alquiler de vehículos',   concepto: 'Alquiler de vehículo rústico con conductor',   monto: 2100,  fecha: fecha(-149), estado: 'Por liquidar', responsableId: 'u-07' },
          { id: 'f-0105', tipo: 'Egreso',  categoria: 'Cartografía e imágenes satelitales', concepto: 'Imágenes multiespectrales de 3 metros',       monto: 1450,  fecha: fecha(-140), estado: 'Liquidado',    responsableId: 'u-07' },
          { id: 'f-0106', tipo: 'Egreso',  categoria: 'Combustible y transporte',          concepto: 'Combustible de la comisión de campo',          monto: 640,   fecha: fecha(-148), estado: 'Liquidado',    responsableId: 'u-02' },
          { id: 'f-0107', tipo: 'Egreso',  categoria: 'Alimentación y hospedaje',          concepto: 'Estadía de la cuadrilla en Angostura',         monto: 980,   fecha: fecha(-146), estado: 'Liquidado',    responsableId: 'u-02' },
          { id: 'f-0108', tipo: 'Ingreso', categoria: 'Valuación por avance',              concepto: 'Valuación por cierre de la etapa 4',           monto: 12000, fecha: fecha(-92),  estado: 'Liquidado',    responsableId: 'u-04' }
        ]
      },

      /* --- P-002: DETENIDO, con la compuerta esperando aprobación --------- */
      {
        id: 'PI-2024-002',
        nombre: 'Estudio de impacto ambiental parque eólico Paraguaná',
        contratanteId: 'c-02',
        tipo: 'Estudio de impacto ambiental',
        estado: 'Detenido',
        ubicacion: 'Península de Paraguaná, municipio Carirubana, estado Falcón',
        fechaInicio: fecha(-188),
        fechaFin: fecha(78),
        presupuesto: 72000,
        coordinadorId: 'u-01',
        etapas: etapas([
          ['Aprobada', -172, 'u-01', 'Contrato suscrito con la generadora.', 'u-01'],
          ['Aprobada', -158, 'u-01', 'Equipo multidisciplinario asignado.', 'u-01'],
          ['Aprobada', -120, 'u-02', 'Campañas de avifauna y vientos cerradas.', 'u-01'],
          ['Aprobada',  -86, 'u-06', 'Línea base y normativa aplicable revisadas.', 'u-01'],
          ['Aprobada',  -34, 'u-01', 'Informe consolidado de 480 páginas entregado.', 'u-01'],
          ['Esperando aprobación', 6, 'u-01', 'Informe consolidado cargado. Requiere revisión final del Coordinador y visto bueno de los inversionistas antes de habilitar la entrega.'],
          ['Bloqueada', 22, 'u-01', ''],
          ['Bloqueada', 48, 'u-06', ''],
          ['Bloqueada', 66, 'u-01', ''],
          ['Bloqueada', 78, 'u-04', '']
        ]),
        equipo: [
          { usuarioId: 'u-01', rolProyecto: 'Coordinador responsable',           honorario: 3800 },
          { usuarioId: 'u-06', rolProyecto: 'Especialista legal ambiental',      honorario: 2600 },
          { usuarioId: 'u-07', rolProyecto: 'Topografía y georreferenciación',   honorario: 2500 },
          { usuarioId: 'u-02', rolProyecto: 'Especialista forestal',             honorario: 2200 }
        ],
        documentos: [
          { id: 'd-0201', nombre: 'TDR_eia_paraguana.pdf',                  tipo: 'Términos de referencia',  etapa: 1, version: 'v1.0', fecha: fecha(-184), autorId: 'u-01' },
          { id: 'd-0202', nombre: 'eia_borrador_integral_v1.pdf',           tipo: 'Informe técnico',         etapa: 5, version: 'v1.0', fecha: fecha(-36),  autorId: 'u-01' },
          { id: 'd-0203', nombre: 'estudio_socioambiental_comunidades.pdf', tipo: 'Estudio socioambiental',  etapa: 4, version: 'v1.1', fecha: fecha(-52),  autorId: 'u-06' },
          { id: 'd-0204', nombre: 'planos_emplazamiento_aerogeneradores.dwg', tipo: 'Cartografía y planos',  etapa: 3, version: 'v2.0', fecha: fecha(-118), autorId: 'u-07' }
        ],
        mediciones: [
          { id: 'm-0201', parcela: 'E-01', hectareas: 4.5, especieId: 'sp-04', arboles: 12, altura: 8.5,  dap: 22.1, volumen: 11.2, fecha: fecha(-124), responsableId: 'u-07' },
          { id: 'm-0202', parcela: 'E-02', hectareas: 3.2, especieId: 'sp-08', arboles: 18, altura: 6.9,  dap: 19.4, volumen: 9.6,  fecha: fecha(-122), responsableId: 'u-02' }
        ],
        finanzas: [
          { id: 'f-0201', tipo: 'Ingreso', categoria: 'Anticipo contractual',          concepto: 'Anticipo del 30 por ciento a la firma',     monto: 21600, fecha: fecha(-180), estado: 'Liquidado',    responsableId: 'u-04' },
          { id: 'f-0202', tipo: 'Egreso',  categoria: 'Ensayos de laboratorio',        concepto: 'Ensayo sonométrico continuo de 72 horas',  monto: 4200,  fecha: fecha(-112), estado: 'Liquidado',    responsableId: 'u-04' },
          { id: 'f-0203', tipo: 'Egreso',  categoria: 'Logística y viáticos de campo', concepto: 'Campamento base de la comisión técnica',   monto: 3100,  fecha: fecha(-96),  estado: 'Por liquidar', responsableId: 'u-01' },
          { id: 'f-0204', tipo: 'Egreso',  categoria: 'Honorarios profesionales',      concepto: 'Pago parcial de honorarios de etapa 5',    monto: 5400,  fecha: fecha(-30),  estado: 'Liquidado',    responsableId: 'u-04' },
          { id: 'f-0205', tipo: 'Egreso',  categoria: 'Tasas y permisología',          concepto: 'Tasas de consignación del expediente',     monto: 860,   fecha: fecha(-24),  estado: 'Por liquidar', responsableId: 'u-06' }
        ]
      },

      /* --- P-003: en ejecución, con una etapa devuelta -------------------- */
      {
        id: 'PI-2024-003',
        nombre: 'Levantamiento y obras hidráulicas sector El Pao',
        contratanteId: 'c-03',
        tipo: 'Obras hidráulicas',
        estado: 'En ejecución',
        ubicacion: 'Embalse El Pao, municipio Tinaco, estado Cojedes',
        fechaInicio: fecha(-146),
        fechaFin: fecha(64),
        presupuesto: 52000,
        coordinadorId: 'u-03',
        etapas: etapas([
          ['Aprobada', -130, 'u-03', 'Contrato adjudicado por el ente.', 'u-03'],
          ['Aprobada', -112, 'u-03', 'Equipo de topobatimetría asignado.', 'u-03'],
          ['Aprobada',  -68, 'u-07', 'Levantamiento de obras de captación cerrado.', 'u-03'],
          ['Devuelta',  -12, 'u-07', 'Faltan las secciones transversales del canal de aducción y la memoria de cálculo de la estabilidad de taludes. Se devuelve para completar antes de pasar a redacción.'],
          ['Pendiente',  26, 'u-03', ''],
          ['Bloqueada',  40, 'u-03', ''],
          ['Bloqueada',  48, 'u-03', ''],
          ['Bloqueada',  56, 'u-06', ''],
          ['Bloqueada',  60, 'u-03', ''],
          ['Bloqueada',  64, 'u-04', '']
        ]),
        equipo: [
          { usuarioId: 'u-03', rolProyecto: 'Coordinador responsable',         honorario: 3100 },
          { usuarioId: 'u-07', rolProyecto: 'Especialista hidráulico',         honorario: 2300 }
        ],
        documentos: [
          { id: 'd-0301', nombre: 'TDR_obras_el_pao.pdf',                 tipo: 'Términos de referencia', etapa: 1, version: 'v1.0', fecha: fecha(-142), autorId: 'u-03' },
          { id: 'd-0302', nombre: 'topobatimetria_embalse_el_pao.zip',    tipo: 'Datos brutos de campo',  etapa: 3, version: 'v1.0', fecha: fecha(-72),  autorId: 'u-07' }
        ],
        mediciones: [],
        finanzas: [
          { id: 'f-0301', tipo: 'Ingreso', categoria: 'Anticipo contractual',           concepto: 'Primer anticipo de la obra',                monto: 15600, fecha: fecha(-140), estado: 'Liquidado',    responsableId: 'u-04' },
          { id: 'f-0302', tipo: 'Egreso',  categoria: 'Equipos y alquiler de vehículos', concepto: 'Lancha con ecosonda por 6 días',           monto: 5400,  fecha: fecha(-104), estado: 'Liquidado',    responsableId: 'u-07' },
          { id: 'f-0303', tipo: 'Egreso',  categoria: 'Logística y viáticos de campo',  concepto: 'Estadía de la cuadrilla técnica',           monto: 2900,  fecha: fecha(-70),  estado: 'Por liquidar', responsableId: 'u-03' },
          { id: 'f-0304', tipo: 'Egreso',  categoria: 'Combustible y transporte',       concepto: 'Traslados a la zona del embalse',           monto: 720,   fecha: fecha(-66),  estado: 'Liquidado',    responsableId: 'u-07' }
        ]
      },

      /* --- P-004: en oferta ---------------------------------------------- */
      {
        id: 'PI-2024-004',
        nombre: 'Modelo de negocios de forestación comercial Uverito',
        contratanteId: 'c-04',
        tipo: 'Modelo de negocios',
        estado: 'En oferta',
        ubicacion: 'Uverito, municipio Sotillo, estado Monagas',
        fechaInicio: fecha(-24),
        fechaFin: fecha(158),
        presupuesto: 34000,
        coordinadorId: 'u-01',
        etapas: etapas([
          ['En proceso', 8,  'u-01', ''],
          ['Pendiente',  26, 'u-01', ''],
          ['Bloqueada',  62, 'u-02', ''],
          ['Bloqueada',  84, 'u-06', ''],
          ['Bloqueada', 112, 'u-01', ''],
          ['Bloqueada', 128, 'u-01', ''],
          ['Bloqueada', 138, 'u-01', ''],
          ['Bloqueada', 146, 'u-06', ''],
          ['Bloqueada', 152, 'u-01', ''],
          ['Bloqueada', 158, 'u-04', '']
        ]),
        equipo: [
          { usuarioId: 'u-01', rolProyecto: 'Coordinador responsable', honorario: 1500 }
        ],
        documentos: [
          { id: 'd-0401', nombre: 'propuesta_tecnica_uverito.pdf', tipo: 'Términos de referencia', etapa: 1, version: 'v0.3', fecha: fecha(-18), autorId: 'u-01' }
        ],
        mediciones: [],
        finanzas: []
      },

      /* --- P-005: en permisología ---------------------------------------- */
      {
        id: 'PI-2024-005',
        nombre: 'Permisología y estudio de suelos línea de transmisión Guayana',
        contratanteId: 'c-05',
        tipo: 'Permisología ambiental',
        estado: 'En permisología',
        ubicacion: 'Eje Ciudad Piar, municipio Angostura, estado Bolívar',
        fechaInicio: fecha(-284),
        fechaFin: fecha(56),
        presupuesto: 61000,
        coordinadorId: 'u-03',
        etapas: etapas([
          ['Aprobada', -270, 'u-03', 'Contrato suscrito con el consorcio.', 'u-03'],
          ['Aprobada', -256, 'u-03', 'Equipo asignado.', 'u-03'],
          ['Aprobada', -212, 'u-07', 'Calicatas y ensayos de suelo completados.', 'u-03'],
          ['Aprobada', -178, 'u-06', 'Antecedentes normativos consolidados.', 'u-03'],
          ['Aprobada', -128, 'u-03', 'Informe de suelos redactado.', 'u-03'],
          ['Aprobada',  -98, 'u-03', 'Revisión final conforme.', 'u-03'],
          ['Aprobada',  -82, 'u-03', 'Informe entregado al contratante.', 'u-03'],
          ['En proceso', 18, 'u-06', ''],
          ['Bloqueada',  44, 'u-03', ''],
          ['Bloqueada',  56, 'u-04', '']
        ]),
        equipo: [
          { usuarioId: 'u-03', rolProyecto: 'Coordinador responsable',      honorario: 2800 },
          { usuarioId: 'u-06', rolProyecto: 'Especialista legal ambiental', honorario: 2100 }
        ],
        documentos: [
          { id: 'd-0501', nombre: 'informe_suelos_linea_guayana.pdf',   tipo: 'Informe técnico',        etapa: 5, version: 'v1.0', fecha: fecha(-132), autorId: 'u-03' },
          { id: 'd-0502', nombre: 'solicitud_autorizacion_ambiental.pdf', tipo: 'Permiso o autorización', etapa: 8, version: 'v1.0', fecha: fecha(-64), autorId: 'u-06' }
        ],
        mediciones: [],
        finanzas: [
          { id: 'f-0501', tipo: 'Ingreso', categoria: 'Anticipo contractual',    concepto: 'Anticipo del 40 por ciento',            monto: 24400, fecha: fecha(-278), estado: 'Liquidado',    responsableId: 'u-04' },
          { id: 'f-0502', tipo: 'Egreso',  categoria: 'Ensayos de laboratorio',  concepto: 'Ensayos de granulometría y densidad',   monto: 3600,  fecha: fecha(-206), estado: 'Liquidado',    responsableId: 'u-04' },
          { id: 'f-0503', tipo: 'Egreso',  categoria: 'Tasas y permisología',    concepto: 'Tasas de tramitación ante el ente',     monto: 1240,  fecha: fecha(-58),  estado: 'Por liquidar', responsableId: 'u-06' },
          { id: 'f-0504', tipo: 'Ingreso', categoria: 'Valuación por avance',    concepto: 'Valuación por entrega del informe',     monto: 18300, fecha: fecha(-78),  estado: 'Liquidado',    responsableId: 'u-04' }
        ]
      },

      /* --- P-006: cerrado ------------------------------------------------- */
      {
        id: 'PI-2023-018',
        nombre: 'Restauración ecológica y monitoreo finca La Esmeralda',
        contratanteId: 'c-06',
        tipo: 'Restauración ecológica',
        estado: 'Cerrado',
        ubicacion: 'Finca La Esmeralda, municipio Jáuregui, estado Táchira',
        fechaInicio: fecha(-520),
        fechaFin: fecha(-118),
        presupuesto: 29800,
        coordinadorId: 'u-01',
        etapas: etapas([
          ['Aprobada', -506, 'u-01', 'Contrato con la fundación.', 'u-01'],
          ['Aprobada', -492, 'u-01', 'Equipo asignado.', 'u-01'],
          ['Aprobada', -440, 'u-02', 'Inventario de la parcela de referencia.', 'u-01'],
          ['Aprobada', -404, 'u-02', 'Revisión de antecedentes de la finca.', 'u-01'],
          ['Aprobada', -344, 'u-02', 'Informe de restauración redactado.', 'u-01'],
          ['Aprobada', -316, 'u-01', 'Revisión final conforme.', 'u-01'],
          ['Aprobada', -296, 'u-01', 'Informe entregado.', 'u-01'],
          ['Aprobada', -238, 'u-06', 'Autorizaciones obtenidas.', 'u-01'],
          ['Aprobada', -160, 'u-02', 'Monitoreo de doce meses cerrado.', 'u-01'],
          ['Aprobada', -122, 'u-04', 'Liquidación final y archivo técnico.', 'u-01']
        ]),
        equipo: [
          { usuarioId: 'u-01', rolProyecto: 'Coordinador responsable', honorario: 2600 },
          { usuarioId: 'u-02', rolProyecto: 'Especialista forestal',   honorario: 2000 }
        ],
        documentos: [
          { id: 'd-0601', nombre: 'informe_final_restauracion.pdf', tipo: 'Informe técnico', etapa: 7, version: 'v2.0', fecha: fecha(-300), autorId: 'u-02' },
          { id: 'd-0602', nombre: 'acta_cierre_la_esmeralda.pdf',   tipo: 'Acta o minuta',   etapa: 10, version: 'v1.0', fecha: fecha(-120), autorId: 'u-01' }
        ],
        mediciones: [
          { id: 'm-0601', parcela: 'R-01', hectareas: 2.0, especieId: 'sp-01', arboles: 56, altura: 4.2,  dap: 8.4,  volumen: 6.8,  fecha: fecha(-436), responsableId: 'u-02' },
          { id: 'm-0602', parcela: 'R-01', hectareas: 2.0, especieId: 'sp-02', arboles: 48, altura: 3.9,  dap: 7.6,  volumen: 5.1,  fecha: fecha(-435), responsableId: 'u-02' },
          { id: 'm-0603', parcela: 'R-02', hectareas: 1.8, especieId: 'sp-09', arboles: 39, altura: 5.1,  dap: 9.2,  volumen: 7.4,  fecha: fecha(-164), responsableId: 'u-02' }
        ],
        finanzas: [
          { id: 'f-0601', tipo: 'Ingreso', categoria: 'Anticipo contractual',       concepto: 'Anticipo inicial',                  monto: 8940,  fecha: fecha(-514), estado: 'Liquidado', responsableId: 'u-04' },
          { id: 'f-0602', tipo: 'Egreso',  categoria: 'Honorarios profesionales',   concepto: 'Honorarios del equipo técnico',     monto: 4600,  fecha: fecha(-330), estado: 'Liquidado', responsableId: 'u-04' },
          { id: 'f-0603', tipo: 'Egreso',  categoria: 'Logística y viáticos de campo', concepto: 'Campañas de monitoreo trimestral', monto: 3250, fecha: fecha(-240), estado: 'Liquidado', responsableId: 'u-02' },
          { id: 'f-0604', tipo: 'Ingreso', categoria: 'Pago de cierre',             concepto: 'Pago final contra acta de cierre',  monto: 20860, fecha: fecha(-118), estado: 'Liquidado', responsableId: 'u-04' }
        ]
      }
    ];
  }

  /* ==========================================================================
     Bitácora. Treinta registros de días anteriores, para que la auditoría no
     aparezca vacia al abrir la demo.
     ======================================================================= */
  function bitacora() {
    var b = [
      [-1,  16, 42, 'u-01', 'ETAPA_ENVIADA_A_APROBACION', 'Etapa',     'PI-2024-002', 'Etapa 6 enviada a revisión final del Coordinador.'],
      [-1,  15, 18, 'u-01', 'DOCUMENTO_CARGADO',          'Documento', 'PI-2024-002', 'Carga de eia_borrador_integral_v1.pdf en la etapa 5.'],
      [-1,  11, 30, 'u-04', 'MOVIMIENTO_REGISTRADO',      'Finanza',   'PI-2024-005', 'Egreso por 1.240,00 USD en Tasas y permisología, por liquidar.'],
      [-1,   9, 12, 'u-08', 'SESION_INICIADA',            'Usuario',   null,          'Ingreso al sistema como Admin.'],
      [-2,  17,  5, 'u-03', 'ETAPA_DEVUELTA',             'Etapa',     'PI-2024-003', 'Etapa 4 devuelta con observaciones sobre las secciones transversales.'],
      [-2,  14, 22, 'u-07', 'MEDICION_REGISTRADA',        'Medición',  'PI-2024-001', 'Parcela P-03: 11 árboles de Caoba, volumen 44,8 m3 de captura manual.'],
      [-2,  10, 48, 'u-04', 'MOVIMIENTO_LIQUIDADO',       'Finanza',   'PI-2024-002', 'Egreso de 5.400,00 USD en Honorarios profesionales marcado como liquidado.'],
      [-3,  16, 40, 'u-01', 'ALERTA_VENCIMIENTO',         'Etapa',     'PI-2024-001', 'Etapa 6 vencida sin cierre. Proyecto con dos etapas fuera de plazo.'],
      [-3,  12, 15, 'u-02', 'DOCUMENTO_CARGADO',          'Documento', 'PI-2024-001', 'Carga de informe_preliminar_manejo.docx en la etapa 5.'],
      [-3,   9, 55, 'u-05', 'CONSULTA_DIRECCION',         'Proyecto',  null,          'Consulta del consolidado de cartera desde la vista de Dirección.'],
      [-4,  15, 33, 'u-06', 'DOCUMENTO_CARGADO',          'Documento', 'PI-2024-005', 'Carga de solicitud_autorizacion_ambiental.pdf en la etapa 8.'],
      [-4,  11,  8, 'u-08', 'CATALOGO_ACTUALIZADO',       'Catálogo',  null,          'Alta de la especie Puy (Handroanthus serratifolius) en el catálogo.'],
      [-5,  16, 20, 'u-01', 'ETAPA_APROBADA',             'Etapa',     'PI-2024-002', 'Etapa 5 aprobada. Se habilita la compuerta de la etapa 6.'],
      [-5,  13, 44, 'u-04', 'MOVIMIENTO_REGISTRADO',      'Finanza',   'PI-2024-001', 'Ingreso por 12.000,00 USD en Valuación por avance.'],
      [-6,  17, 12, 'u-03', 'ETAPA_APROBADA',             'Etapa',     'PI-2024-005', 'Etapa 7 aprobada. Informe entregado al contratante.'],
      [-6,  10, 26, 'u-02', 'MEDICION_REGISTRADA',        'Medición',  'PI-2024-001', 'Parcela P-02: 25 árboles de Palo blanco, volumen 39,2 m3 de captura manual.'],
      [-7,  15, 50, 'u-08', 'USUARIO_ACTUALIZADO',        'Usuario',   null,          'Actualización de la especialidad de Diego Torres Villamizar.'],
      [-7,  11, 35, 'u-01', 'PROYECTO_CREADO',            'Proyecto',  'PI-2024-004', 'Alta del expediente PI-2024-004 con las 10 etapas de la plantilla.'],
      [-8,  16,  2, 'u-04', 'REPORTE_GENERADO',           'Reporte',   null,          'Generación del reporte de cierre de mes en dólares.'],
      [-8,  12, 40, 'u-07', 'DOCUMENTO_CARGADO',          'Documento', 'PI-2024-002', 'Carga de planos_emplazamiento_aerogeneradores.dwg en la etapa 3.'],
      [-9,  14, 18, 'u-06', 'DOCUMENTO_CARGADO',          'Documento', 'PI-2024-002', 'Carga de estudio_socioambiental_comunidades.pdf en la etapa 4.'],
      [-9,   9, 30, 'u-03', 'SESION_INICIADA',            'Usuario',   null,          'Ingreso al sistema como Coordinador.'],
      [-10, 16, 44, 'u-01', 'ETAPA_APROBADA',             'Etapa',     'PI-2024-001', 'Etapa 4 aprobada. Antecedentes de la cuenca consolidados.'],
      [-11, 13, 22, 'u-04', 'MOVIMIENTO_REGISTRADO',      'Finanza',   'PI-2024-003', 'Egreso por 2.900,00 USD en Logística y viáticos de campo, por liquidar.'],
      [-12, 15, 10, 'u-08', 'CATALOGO_ACTUALIZADO',       'Catálogo',  null,          'Alta de la categoría Combustible y transporte en el catálogo financiero.'],
      [-13, 11, 55, 'u-02', 'MEDICION_REGISTRADA',        'Medición',  'PI-2024-001', 'Parcela P-01: 42 árboles de Palo blanco, volumen 68,4 m3 de captura manual.'],
      [-14, 17, 30, 'u-05', 'CONSULTA_DIRECCION',         'Proyecto',  null,          'Revisión de la cartera en sesión de Dirección.'],
      [-15, 12,  8, 'u-01', 'EQUIPO_ASIGNADO',            'Equipo',    'PI-2024-002', 'Asignación de Elena Ramos Pineda como Especialista forestal.'],
      [-16, 14, 46, 'u-03', 'PROYECTO_ACTUALIZADO',       'Proyecto',  'PI-2024-005', 'Cambio de estado a En permisología.'],
      [-18, 10, 20, 'u-08', 'USUARIO_CREADO',             'Usuario',   null,          'Alta del usuario Sofía Alcalá Moreno con rol Profesional.']
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
      version: 3,
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

  /* Usuario de referencia por rol: el que se activa al elegir un rol en la
     portada o en la barra de demo. */
  window.PI_USUARIO_POR_ROL = {
    admin: 'u-08',
    coordinador: 'u-01',
    profesional: 'u-02',
    administracion: 'u-04',
    direccion: 'u-05'
  };
})();
