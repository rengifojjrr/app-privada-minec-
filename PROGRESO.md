# PROGRESO — Beta navegable · Sistema de Proyectos Integrales

## Fase 0 · Inventario, cobertura, tokens y contradicciones

**Estado: reporte entregado. A la espera de visto bueno. No se ha escrito ni una línea de código de la beta.**

Insumos recibidos: dos exports de Stitch (el segundo amplía el primero de 9 a 27 pantallas). Método: inventario pantalla por pantalla, extracción de tokens contra las capturas renderizadas, y un pase crítico de 70 hallazgos candidatos verificados con dos lentes independientes (¿existe la cita? ¿contradice de verdad la regla?). Sobrevivieron 50; se descartaron 20 por evidencia falsa, redundancia o irrelevancia.

---

## 0. Lo primero: falta la especificación

`MASTER_PROMPT_Sistema_Proyectos_Integrales.md` **no fue entregado**. No está en ninguno de los dos ZIP, ni en el repositorio, ni en ninguna rama remota. Sin ese archivo no tengo la fuente de verdad funcional: la matriz de permisos exacta, el modelo de datos, las listas controladas, la semilla de la sección 10 ni el criterio de aceptación de la sección 12 con el que se declara terminada la beta.

Lo que sí hay es un sustituto imperfecto: dentro del ZIP viene un **prototipo SPA completo** (`sistema_de_gesti_n_de_proyectos_integrales/code.html`, 169 KB de JavaScript) que Stitch generó *a partir de* la especificación. Trae 23 páginas numeradas, un objeto `PERMISSIONS`, una semilla `DEFAULT_STATE` con 6 proyectos y 8 usuarios, las 10 etapas y los catálogos. Es la interpretación de Stitch, no la especificación, y en varios puntos se contradice con los tableros visuales del mismo export.

Consecuencia práctica: puedo construir la beta completa sin el archivo, derivando el modelo del prototipo SPA y documentando cada supuesto. Pero el criterio de aceptación de la sección 12 no lo puedo verificar, porque no lo conozco.

---

## 1. Inventario del export (27 pantallas)

Consolidé los dos ZIP en `stitch/stitch_proyectos_integrales_pmis/`. El segundo trae 18 carpetas nuevas y repite 8 sin cambio alguno (mismo MD5); el primero aporta el logo, que el segundo no incluye.

| Carpeta | Contenido |
|---|---|
| `1_ingreso_y_autenticaci_n_segura_login` | Login corporativo: correo, contraseña, 2FA/TOTP. |
| `1_2_ingreso_y_panel_de_inicio_dashboard` | Login y panel a la vez, con un conmutador de comparación. |
| `2_panel_de_inicio_dashboard_t_cnico` | Panel: 4 indicadores, tabla de atención inmediata, agenda semanal. |
| `3_proyectos_expedientes` | Listado: 4 indicadores, buscador, 4 filtros, tabla de 9 columnas, paginación. |
| `4_nuevo_proyecto_asistente_en_3_pasos` | Asistente paso 2: datos maestros, polígono, plantilla de 10 etapas. |
| `5_ficha_de_proyecto_resumen_ejecutivo` | Ficha, pestaña Resumen. |
| `5_8_11_ficha_de_proyecto_resumen_documentos_y_bit_cora` | Resumen, Documentos y Bitácora apiladas. |
| `6_ficha_de_proyecto_etapas_y_compuertas` | Etapas: diagrama secuencial y matriz de 10. |
| `6_9_ficha_de_proyecto_etapas_y_mediciones` | Etapas y Mediciones apiladas. Con especies venezolanas. |
| `7_ficha_de_proyecto_equipo_y_honorarios` | Equipo: matriz de habilitación, honorarios, parte de horas. |
| `7_10_ficha_equipo_honorarios_y_finanzas` | Equipo y Finanzas apiladas. |
| `8_ficha_de_proyecto_repositorio_documental` | Documentos: tabla de 7 columnas e historial de versiones. |
| `8_ficha_de_proyecto_documentos_y_repositorio_normado` | Documentos: tabla de 10 columnas con sello criptográfico. |
| `9_ficha_de_proyecto_mediciones_de_campo_1` | Mediciones dasométricas: captura árbol por árbol y resumen por especie. |
| `9_ficha_de_proyecto_mediciones_de_campo_2` | Otra cosa: visor cartográfico y cadena de custodia de laboratorio. |
| `10_ficha_de_proyecto_finanzas_y_facturaci_n` | Finanzas: conciliación de hitos, facturación electrónica, flujo acumulado. |
| `11_ficha_de_proyecto_bit_cora_de_proyecto_ledger_worm` | Bitácora del proyecto como cadena inmutable. |
| `12_aprobaciones_pendientes_y_bandeja_de_visaci_n` | Bandeja de aprobaciones: tabla de 9 columnas y panel de dictamen. |
| `12_13_aprobaciones_pendientes_y_calendario` | Aprobaciones y calendario apilados. |
| `13_calendario_de_campa_as_y_plazos_fatales` | Calendario mensual, vencimientos y cuadrillas. |
| `14_directorio_de_contratantes_y_mandantes` | Contratantes en maestro-detalle con expediente por empresa. |
| `14_15_contratantes_y_reportes_de_cierre` | Reportes de cierre de mes y directorio, apilados. |
| `16_vista_de_direcci_n_modo_sala` | Dirección en oscuro: alerta, 4 indicadores, matriz, dona, rotación automática. |
| `17_20_23_usuarios_acceso_perfil_y_fases_futuras` | Usuarios, Sin permiso, Perfil y las dos fases futuras, en una pantalla. |
| `18_19_cat_logos_plantillas_y_bit_cora_general` | Catálogos, editor de plantilla de etapas y bitácora general. |
| `sistema_de_gesti_n_de_proyectos_integrales` | Prototipo SPA de 23 páginas con lógica funcional real. |
| `logo_proyectos_integrales` | Logo SVG en línea, sin dependencias. |
| `field_dossier_technical_workspace` | Solo `DESIGN.md`. No es una pantalla. |

---

## 2. Cobertura de las 23 páginas

Tras el segundo export **ninguna página queda sin diseño**, pero la cobertura es desigual. Las 23 páginas caben en los 17 archivos previstos; la correspondencia se sostiene.

| # | Página | Archivo | Pantalla que se sigue | Cobertura |
|---|---|---|---|---|
| 1 | Selector de rol | `index.html` | ninguna sirve | **Hay que diseñarla.** Las dos versiones son un login con contraseña. Solo se aprovecha la rejilla del "Simulador de Perfiles". |
| 2 | Panel de inicio | `panel.html` | `2_panel` | Completa. Una sola variante de rol; las otras cuatro se extienden. |
| 3 | Proyectos | `proyectos.html` | `3_proyectos` | Completa. |
| 4 | Nuevo proyecto | `proyecto-nuevo.html` | `4_nuevo_proyecto` | Solo el paso 2. Pasos 1 y 3 hay que derivarlos. |
| 5 | Ficha · Resumen | `proyecto.html?tab=resumen` | `5_ficha` | Completa. |
| 6 | Ficha · Etapas | `?tab=etapas` | `6_ficha` + acciones de `6_9` | Completa. |
| 7 | Ficha · Equipo y honorarios | `?tab=equipo` | `7_10` | Completa. |
| 8 | Ficha · Documentos | `?tab=documentos` | `8_repositorio` | Completa. Tres versiones en conflicto. |
| 9 | Ficha · Mediciones | `?tab=mediciones` | `9_..._1` + contenido de `6_9` | Completa. |
| 10 | Ficha · Finanzas | `?tab=finanzas` | `7_10` | Completa. |
| 11 | Ficha · Bitácora | `?tab=bitacora` | `11_worm` | Completa. |
| 12 | Aprobaciones | `aprobaciones.html` | `12_aprobaciones` + acciones de `12_13` | Completa. |
| 13 | Calendario | `calendario.html` | `13_calendario` | Completa. |
| 14 | Contratantes | `contratantes.html` | `14_directorio` | Completa. |
| 15 | Reportes | `reportes.html` | dentro de `14_15` | Fragmento. Hay que extraerla. |
| 16 | Dirección (oscuro) | `direccion.html` | `16_direccion` | Completa. |
| 17 | Usuarios | `usuarios.html` | dentro de `17_20_23` | Fragmento. |
| 18 | Catálogos | `catalogos.html` | dentro de `18_19` | Fragmento. |
| 19 | Bitácora general | `bitacora.html` | dentro de `18_19` | Fragmento. |
| 20 | Sin permiso | `sin-permiso.html` | dentro de `17_20_23` | Fragmento, pero completo y bueno. |
| 21 | Perfil | `perfil.html` | dentro de `17_20_23` | Fragmento. Le falta "Reiniciar datos de ejemplo"; en su lugar trae cambio de contraseña. |
| 22 | Portal de contratantes | `fase2-portal.html` | tarjeta en `17_20_23` | **Solo indicativa.** Es una tarjeta con "Próximamente". Hay que diseñar la maqueta. |
| 23 | Asistente de informes | `fase3-asistente.html` | tarjeta en `17_20_23` | **Solo indicativa.** Igual que la 22. |

El prototipo SPA numera la 20 como "Sin permiso" y la 21 como "Perfil", al revés del árbol de archivos del encargo. Es solo numeración y no cambia el alcance.

---

## 3. Tokens visuales reales

La configuración de Tailwind es **idéntica en las 26 pantallas** que la traen, y es la que se ve en las capturas. `DESIGN.md` contiene una segunda paleta distinta en su prosa (`#1F4D3D`, `#F7F6F2`, `#9A6B3F`, `#B4462F`) que **no se renderiza en ninguna parte**: manda la configuración, verificada por muestreo de píxeles.

**Color, modo claro**
- Primario `#023627`; hover y contenedor `#1f4d3d` (también el logo); tenue `#bcedd7` sobre `#002116`; acento `#a1d1bc`.
- Secundario ámbar `#80552b`; tenue `#ffdcc0` sobre `#2d1600`; contenedor `#fec390`.
- Terciario rojo `#610c00`; error `#ba1a1a`; tenue error `#ffdad6` sobre `#93000a`; fila en alerta `#fff4f3`.
- Fondos: página `#f8faf6`; menú lateral y superficies hundidas `#f3f4f0`; contenedor `#edeeeb`; alto `#e7e9e5`; máximo `#e1e3df`; tarjetas `#ffffff`.
- Texto `#191c1a` / `#414944` / `#717974`; bordes `#c0c8c3` al 15–30 % de opacidad.

**Color, modo oscuro (solo Dirección)**: lienzo `#2e312f`, paneles `#363a37`–`#404341`, texto `#f0f1ed`, acentos `#a1d1bc`, `#f5bb88`, `#ffb4a4`.

**Tipografía**: Hanken Grotesk 400/500/600/700 para texto; JetBrains Mono 400/500/600 para códigos, cifras, fechas y unidades. Escala: 36/44 · 26/34 · 20/28 · 16/24 para títulos; 16/26 · 14/22 · **13/18 (el más usado)** para cuerpo; etiqueta en mayúsculas 11/16 con 0.06em de tracking (el más usado); mono tabular 11/14 y 13/18. Cifras con `tabular-nums`.

**Radios**: 2 px por defecto (insignias, campos, filas), 4 px (tarjetas, botones, modales), 8 px (tarjetas grandes), 12 px (avatares). Ojo: la configuración redefine `rounded-full` a 12 px, así que **no hay círculos ni píldoras**; los avatares son cuadrados redondeados.

**Espaciado**: 2 / 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 px. Tarjetas con 16 px de relleno y 24 px de separación. Celdas 12 px horizontal por 8–10 px vertical.

**Medidas**: menú lateral 256 px; barra superior 64 px; botones 32–36 px; campos 36 px; filas de tabla 40–44 px; cabecera de tabla 36 px.

**Botones**: primario `#023627` con texto blanco, 13 px semibold, radio 4 px, relleno 8–10 × 16–20 px. Secundario `#e7e9e5` con texto `#191c1a`. Ámbar `#80552b` para aprobar. Peligro `#ba1a1a`. Fantasma sin fondo con texto primario.

**Campos**: fondo blanco, borde 1 px `#c0c8c3`, radio 2 px, 14 px, relleno 8 × 12 px, etiqueta en mayúsculas 11 px encima, unidad en mono a la derecha (`ha`, `m`, `cm`, `m³`), foco con borde primario.

**Tablas**: cabecera `#edeeeb` con texto en mayúsculas 11 px; filas blancas separadas por 1 px `#e1e3df`; códigos, fechas y montos en mono a la derecha.

**Insignias**: rectángulo de radio 2 px, mono 11 px en mayúsculas, punto de 6 px opcional, en verde, ámbar, rojo o neutro.

**Tarjetas**: blancas, borde 1 px, radio 4 px, sombra `0 1px 8px rgba(0,0,0,.04)`.

**Sustitución offline verificada**: las tipografías de texto son 7 archivos woff2 latinos, 227 KB en total, ya descargados y probados (licencia OFL). Los iconos son ligaduras de Material Symbols (121 distintos): se reemplazan por un sprite SVG local (licencia Apache 2.0), no por la fuente completa de 314 KB.

---

## 4. Contradicciones (50 confirmadas de 70 candidatas)

### 4.1 Rompen una regla no negociable

1. **Tailwind por CDN en las 26 pantallas.** Sin red no queda ni una clase aplicada. Además el encargo prohíbe Tailwind. El export **no es reutilizable como código**, solo como referencia visual. Todo el CSS se reescribe.
2. **Tipografías e iconos desde Google Fonts.** Sin red se pierde la tipografía y los 121 iconos quedan como palabras sueltas ("notifications", "folder_open"). Se empaquetan localmente.
3. **Logo, fotos y mapas en `lh3.googleusercontent.com`.** Se sustituyen por el SVG local y por marcadores de posición dibujados en CSS.
4. **Falta la marca `BETA · datos de ejemplo`.** No aparece en ninguna pantalla. Se añade a la barra superior inyectada.
5. **El diseño promete cálculo de volumen.** No hay ninguna fórmula implementada en ningún archivo (lo verifiqué buscando constantes, factores y potencias). Pero **tres textos visibles prometen automatización**: "el cubicaje final automatizado se recalculará al parametrizar la ecuación alométrica correspondiente", "parámetros alométricos en calibración" y "volumen estimado de fuste sin corteza según criterio de cubicador acreditado". Si esos textos pasan a la beta, el sistema promete justo lo que la regla más importante prohíbe. Se borran y se conserva solo la nota neutra del prototipo.
6. **Sistema chileno, no venezolano.** Esto es el hallazgo más grande y el más caro. El export está ambientado en Chile de forma sistemática: RUT como identificador fiscal en 12 pantallas (incluido el marcador del formulario de alta), los organismos SEA, SEIA, ICSARA, SMA, CONAF, DGA, SAG, DGC y MOP/DOH como columna vertebral del flujo, leyes chilenas citadas como base legal, topónimos, correos `.cl`, teléfonos `+56`, domicilio en Santiago, especies del bosque templado chileno y del desierto de Atacama, y consulta indígena chilena como etapa del proyecto en cinco pantallas. Solo tres de las 27 pantallas se salvan: etapas y mediciones, equipo y finanzas, y catálogos. Toda la semilla se reescribe.
7. **Montos en pesos chilenos.** "Moneda Base: CLP (Pesos Chilenos)", un selector con opción CLP, montos como `$ 980.400.000 CLP`, un tipo de cambio de referencia de 960 y pólizas en Unidades de Fomento. El encargo exige dólares. Se convierte todo a USD y se elimina el selector de moneda.
8. **Ocho formatos de fecha distintos** y casi ninguno es `DD/MM/AAAA`. Se unifica.
9. **La página 1 es un login con contraseña**, en las dos versiones, con segundo factor completo (2FA, TOTP, FIDO2, YubiKey, PIN, token de identidad) tanto en el ingreso como en la aprobación de etapas. También hay recuperación de contraseña por correo y cambio de contraseña en el perfil. El encargo pide un selector de rol sin contraseña. Se rediseña.
10. **Texto libre donde debe haber lista controlada**: el alta de especie forestal tiene tres campos libres (nombre común, científico y familia), y también son libres contratante, rol técnico, autor del documento, versión, región y observaciones. Los estados y tipos existen como cadenas sueltas sin catálogo. Buena noticia parcial: en el resto del export hay 81 listas desplegables y **ningún** campo libre para categoría financiera, tipo de proyecto o estado.

### 4.2 Función que Stitch inventó y la beta no puede sostener

Aquí está el riesgo de fondo del proyecto. La instrucción era tomar de Stitch "cómo se ve, y solo eso", pero Stitch dibujó tanta función inventada que respetar esa regla obliga a **desnudar cada pantalla de la mitad de su contenido visible**:

- Hash SHA-256 por documento, por medición y por asiento, más un sello raíz del expediente, en 14 pantallas.
- La bitácora modelada como cadena inmutable con árbol de Merkle, bloque génesis y nodos entre pares.
- Un sistema de información geográfica completo: capas conmutables, visor satelital, carga de archivos SHP, KML y GeoTIFF, sistemas de coordenadas y escala cartográfica.
- Facturación electrónica, conciliación bancaria y nómina de pagos hacia un banco concreto.
- Notificaciones y avisos automáticos: la campana está en las 27 pantallas.
- Telemetría en vivo: posicionamiento de cuadrillas, drones, satélites y cadena de frío.
- Integraciones con sistemas del Estado, calendario corporativo, dirección IP del nodo de producción y disponibilidad del servicio.
- Avance ponderado con pesos personalizables por etapa, que el modelo de 10 etapas no soporta.
- Documentos con tamaño en megabytes, número de páginas, descarga real y arrastrar y soltar con límite de 250 MB, cuando el encargo dice que solo se registra el nombre.
- Un parte de horas quincenal con aprobación por lote, y pólizas de seguro con retenciones, como módulos propios.

**Esto cambia la estimación de la Fase 2.** No es "traducir Tailwind a CSS": es decidir, pantalla por pantalla, qué se queda. Mi criterio por omisión será quitar todo lo anterior, salvo que me digas lo contrario. La alternativa —dejarlo como adorno inerte— es peor: en la reunión el cliente hará clic y no pasará nada.

### 4.3 Contradicciones internas de Stitch

- **La regla de honorarios está al revés.** La pantalla 7 dice que las tarifas son visibles "únicamente para Administrador y Coordinador General" y que "profesionales ven guion en tarifas", e implementa un conmutador que oculta *todas* las tarifas. El encargo dice que el Profesional ve el equipo y **sí ve su propio honorario**. El prototipo SPA sí implementa la regla correcta. Sigo el prototipo y descarto la pantalla 7.
- **Solo la etapa 6 tiene flujo de aprobación.** Las otras nueve no tienen ninguna acción y aparecen bloqueadas. Falta el estado "Devuelta" y sobran resultados que el encargo no pide ("Con Salvedad", "Suspensión de Plazo").
- **Los nombres de las 10 etapas cambian en cada pantalla** y en la mayoría modelan un trámite estatal chileno. La única versión que describe el ciclo interno de una consultora es la plantilla del asistente, y es la que voy a usar: oferta y contratación · equipo y honorarios · visita e inventario · revisión bibliográfica · redacción del informe · **revisión final del Coordinador (compuerta)** · entrega del informe · acompañamiento en permisología · seguimiento y control · cierre y liquidación.
- **Los cinco roles se renombran en cada pantalla** (Coordinador General, Evaluador Ambiental Senior, Auditor, Control Financiero…). Se fijan cinco nombres y no se tocan.
- **El mismo proyecto tiene nombre, titular y región distintos** en cada pantalla. Los indicadores no cuadran con las filas visibles y la paginación no lleva a ninguna parte.
- **El menú lateral de Stitch no coincide con los 17 archivos**: le faltan Panel y Perfil, y llama distinto a las rutas.
- **En la pantalla de Dirección el menú lateral y la barra superior van en claro**; lo oscuro es solo el panel central. Hay que decidir si el oscuro cubre toda la pantalla, como sugiere el encargo, o solo el lienzo, como dibuja Stitch. Voy por toda la pantalla: es la que se proyecta.
- **Vocabulario**: Stitch dice compuerta, visación, expediente y mandante donde el encargo dice etapa, aprobación, proyecto y contratante. Se unifica al vocabulario del encargo.

### 4.4 Duplicados: qué versión sigo

El segundo export trae dos o tres versiones de varias páginas, con datos incompatibles entre sí.

| Página | Versiones | Decisión |
|---|---|---|
| 1 y 2 | `1_2` combinada · `1` y `2` sueltas | Seguir `2_panel` para el panel. Descartar `1_2`. Diseñar el selector de rol de cero. |
| 5, 8, 11 | `5_8_11` apilada · tres dedicadas | Seguir las tres dedicadas. De la apilada solo el formato de fecha. |
| 6 | `6_9` · `6_ficha` | Layout de `6_ficha`, acciones de aprobación de `6_9`. |
| 7 y 10 | `7_10` · `7_ficha` · `10_finanzas` | **`7_10` es la mejor base**: es venezolana, está en dólares y trae la regla de que "Por liquidar" no suma al total. Descartar `7_ficha` (regla de honorarios invertida) y `10_finanzas` (facturación electrónica, pesos, cadena inmutable). |
| 8 | tres versiones | `8_repositorio_documental`: la tabla más liviana y con historial de versiones. |
| 9 | dos versiones incompatibles | Estructura de `9_..._1`, contenido y nota de volumen de `6_9`. **`9_..._2` no cubre la página 9**: es un visor cartográfico con cadena de custodia de laboratorio. Se descarta. |
| 12 y 13 | dedicadas · `12_13` | Layout de las dedicadas, acciones de `12_13`. Los dos calendarios están en meses distintos: hay que fijar una única fecha de referencia para toda la beta. |
| 14 y 15 | `14_directorio` · `14_15` | Maestro-detalle de `14_directorio` para contratantes; extraer la sección 15 de `14_15` para reportes. |

### 4.5 Lo que sí se aprovecha

Para no dar la impresión de que hay que tirar todo:

- **La configuración de Tailwind** es una paleta coherente que se traduce directamente a variables CSS y coincide con las capturas.
- **El logo** viene como SVG en línea, sin dependencias remotas.
- **La pantalla `18_19`** es la única con semilla venezolana en los catálogos y con las unidades correctas (hectárea, metro, centímetro, metro cúbico, número de árboles) y **sin ningún factor de conversión**. Es la base de `catalogos.html`.
- **La plantilla de 10 etapas** del asistente es la única que describe el ciclo de una consultora, no un trámite estatal.
- **La pantalla 20 (Sin permiso)** está bien resuelta: código 403, módulo solicitado, identidad activa y rol asignado.
- **La regla de "sin borrado físico"** en usuarios (desactivación lógica con sello de fecha) coincide con lo que pide el encargo.

---

## 5. Decisiones que necesito de ti

Cuatro. El resto lo resuelvo yo y queda documentado arriba.

1. **La especificación.** ¿La envías, o arranco derivando el modelo de datos y la matriz de permisos del prototipo SPA? Puedo construir la beta entera sin ella, pero entonces no puedo verificar el criterio de aceptación de la sección 12, que es tu propia definición de "terminado".
2. **Venezuela.** Confirmo que reescribo toda la semilla en clave venezolana (RIF, autoridad ambiental nacional, estados y municipios, especies locales, dólares) y borro todo el aparato regulatorio chileno. Si el cliente es chileno, dímelo ahora: cambia el 40 % del contenido de las pantallas.
3. **Cuánto se queda de la función inventada.** Mi criterio es quitar hash criptográfico, cadena inmutable, sistema geográfico, facturación electrónica, telemetría, notificaciones, avance ponderado y parte de horas. Son visualmente vistosos y pueden ayudar en la reunión, pero ninguno funciona sin servidor y en una demo un botón muerto se nota.
4. **Dos selectores de rol.** Stitch pone un "Entrar como" en la barra superior de las 27 pantallas, y el encargo pide una barra de demo con cinco botones abajo. Son lo mismo dos veces. Propongo quitar el de la barra superior y dejar solo la barra de demo, que es la que se elimina antes de un uso real.

---

## 6. Al aprobar la Fase 0

Arranco la Fase 1: `tokens.css`, `app.css`, `shell.js`, `auth.js`, `store.js`, `seed.js`, `ui.js`, más `index.html`, `panel.html` y `sin-permiso.html`. Verificación: entrar con los cinco roles y ver el menú cambiar; escribir a mano la dirección de una página prohibida y caer en "Sin permiso"; todo abierto con `file://` y sin red.

---

## Anexo · Inventario estructurado

En `stitch/_inventario-fase0/` quedan los datos crudos del análisis, para no rederivarlos en la Fase 2:

- `pantallas.json` — inventario de las 25 pantallas: secciones, columnas de cada tabla, campos de cada formulario con sus opciones, insignias, botones, datos de ejemplo y notas visuales.
- `prototipo.json` — modelo de datos, matriz de permisos, etapas, catálogos y semilla del prototipo SPA.
- `tokens.json` — tokens visuales con su procedencia (configuración, prosa del `DESIGN.md` o medición sobre las capturas).
- `hallazgos_confirmados.json` — los 50 hallazgos con evidencia y decisión propuesta.
- `hallazgos_descartados.json` — los 20 descartados y por qué, para no reabrirlos.
