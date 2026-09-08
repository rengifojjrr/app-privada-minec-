# PROGRESO — Beta navegable · Sistema de Proyectos Integrales

## Fase 0 · Inventario, cobertura, tokens y contradicciones

**Estado: aprobada.** El usuario dio el visto bueno a las cuatro decisiones de la sección 5 con el criterio propuesto en cada una.

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
| 1 | Selector de rol | `index.html` | ninguna sirve | **Hay que diseñarla.** Las dos versiones son un login con contraseña. Solo se aprovecha la rejilla del "Simulador de Perfiles". *(Acabó siendo un ingreso por usuario: sección 7.)* |
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
9. **La página 1 es un login con contraseña**, en las dos versiones, con segundo factor completo (2FA, TOTP, FIDO2, YubiKey, PIN, token de identidad) tanto en el ingreso como en la aprobación de etapas. También hay recuperación de contraseña por correo y cambio de contraseña en el perfil. El encargo pide un selector de rol sin contraseña. Se rediseña. *(Esta conclusión cambió después: ver la sección 7.)*
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

## 5. Las cuatro decisiones, y cómo quedaron

1. **La especificación.** No llegó. Se construyó derivando el modelo de datos y la matriz de permisos del prototipo SPA, con todos los supuestos documentados en este archivo. Queda un hueco real y conviene no disimularlo: el criterio de aceptación vive en la sección 12 de la especificación, que nunca se vio, así que no se pudo verificar contra el original. Lo que sí se verificó, punto por punto, son las comprobaciones que el propio encargo enumera al describir cada fase y lo que su sección 2 define como "funciona de verdad".
2. **Venezuela.** Confirmado. Toda la semilla se reescribió: RIF en lugar de RUT, estados y municipios venezolanos, diez especies forestales locales, razones sociales del país, montos en dólares. Se borró el aparato regulatorio chileno completo.
3. **La función inventada.** Se quitó toda: sellos criptográficos, cadena inmutable, sistema geográfico, facturación electrónica, telemetría de cuadrillas, notificaciones automáticas, avance ponderado con pesos y parte de horas. Donde el diseño de Stitch prometía algo que la beta no puede sostener, el aviso ahora explica la limitación en lugar de simularla.
4. **Dos selectores de rol.** Se quitó el de la barra superior. Queda solo la barra de demostración, que es la que se elimina antes de un uso real. La barra superior conserva un enlace "Cambiar rol" que lleva a la portada.

---

## 6. Lo que se construyó (Fases 1 a 5)

La Fase 0 se aprobó con la instrucción de hacerlo todo de una vez, así que las cinco fases se
construyeron seguidas en vez de parar a validar cada una.

| Fase | Entregó | Cómo se comprobó |
|---|---|---|
| 1 | `tokens.css`, `app.css`, `shell.js`, `auth.js`, `store.js`, `seed.js`, `ui.js`, `icons.js`, `demo.js`, más `index.html`, `panel.html` y `sin-permiso.html` | Los cinco roles ven menús distintos; una dirección escrita a mano de una página prohibida cae en "Sin permiso" sin mostrar el contenido |
| 2 | `proyectos.html`, `proyecto-nuevo.html`, `proyecto.html` con sus siete pestañas | Alta en tres pasos; búsqueda, cinco filtros y orden por columna; las siete pestañas pintan y la de finanzas se oculta a quien no puede verla |
| 3 | `aprobaciones.html`, `calendario.html`, `contratantes.html` | Devolver una etapa y luego aprobarla desbloquea la siguiente y reanuda el proyecto |
| 4 | `reportes.html`, `direccion.html` | Los cuatro reportes exportan CSV; Dirección se proyecta en oscuro |
| 5 | `usuarios.html`, `catalogos.html`, `bitacora.html`, `perfil.html`, `fase2-portal.html`, `fase3-asistente.html` | Desactivar un usuario queda en la bitácora con fecha, hora y autor; no hay borrado físico |

La verificación no fue a ojo: en `pruebas/` quedan siete guiones que se corren con Node y con
Chromium, y que abren las páginas por `file://` **abortando toda petición que no sea `file:`,
`data:` o `blob:`**. Es la única forma de sostener la promesa de que funciona sin red: si algo
pidiera un recurso remoto, la prueba lo ve.

- `datos-y-permisos.js` — la capa de datos sin navegador: permisos por rol y por pestaña, flujo de
  etapas, que el volumen se guarde sin transformarlo, que una categoría fuera del catálogo se
  rechace desde el código, honorarios por rol, formato de fechas y montos.
- `sintaxis-html.js` — compila el `<script>` en línea de cada una de las 17 páginas.
- `navegador-navegacion.js` — las 17 páginas y las 7 pestañas abren sin un solo error de consola;
  la guarda redirige de verdad y la pantalla de "Sin permiso" **nombra** la página bloqueada; cero
  peticiones a la red; las dos tipografías cargan y ningún icono queda roto.
- `navegador-flujos.js` — los recorridos completos, incluida la barra de demostración.
- `navegador-responsive.js` — 360, 390, 768 y 1440 px sin desborde horizontal en ninguna página.
- `navegador-barras.js` — que nada quede tapado por las barras fijas, que `--demo-alto` coincida
  con la altura real y que la barra de demostración contraste con su fondo en los dos temas.
- `navegador-ingreso.js` — los ocho usuarios entran con su propio rol; el desactivado no entra.

---

## 7. El ingreso: de selector de rol a inicio de sesión por usuario

La Fase 0 concluyó que la página 1 había que diseñarla, porque las dos versiones de Stitch eran un
login con contraseña y segundo factor, y el encargo pedía un selector de rol sin contraseña.

Después llegó una captura de referencia y la instrucción de hacer un ingreso así, "pero de cada
usuario y con los colores y todo lo que estamos usando". Eso cambió la decisión: `index.html` ya no
es un selector de rol, es un inicio de sesión por persona. Se entra con el correo de uno de los ocho
usuarios de la semilla y el rol sale del usuario, no de un botón.

Lo que sí se copió de la referencia: la composición de una sola columna centrada, la marca arriba,
el par correo/contraseña y un pie discreto.

Lo que **no** se copió, y por qué:

- **"Crear cuenta".** El registro público está prohibido por el encargo y no funciona sin servidor.
- **"¿Olvidaste tu contraseña?".** Recuperación por correo: prohibida por el encargo, e imposible
  sin servidor de correo.
- **Ingreso con proveedores externos.** Es una integración con terceros y exige internet.

Un botón que no hace nada se nota más en una demostración que su ausencia, así que ninguno de los
tres se dibujó.

Es un ingreso honesto, no una simulación: dice en pantalla que es una demostración, muestra la
contraseña, lista las cuentas de prueba agrupadas por área y comprueba en el navegador porque no hay
servidor. Las cuentas se generan de la lista real de usuarios, así que un usuario creado en
`usuarios.html` aparece ahí sin tocar `index.html`, y uno desactivado aparece deshabilitado y no
deja entrar.

---

## 8. La marca: de la paleta de Stitch a MONPICA

Con el brochure del cliente llegó la identidad real, y con ella se reemplazó todo lo que hasta
entonces era una paleta derivada del export de Stitch.

**Qué es real ahora** (y por eso vive en `shell.js`, no en `seed.js`: sobrevive cuando el sistema
deje de ser una demostración):

- Razón social, lema, descripción, misión y alcance.
- RIF `J-40690232-2`, sede en Guanare (estado Portuguesa), correo y teléfono.
- El logo y el emblema, extraídos del PDF con su máscara de transparencia y guardados en
  `assets/marca/` como PNG locales. No hay ningún recurso remoto.
- La paleta: el verde de la hoja y de la montaña del logo, el azul del río y de la palabra MONPICA,
  el verde de los títulos y el lima de las ondas del brochure. Los hexadecimales y su procedencia
  están comentados en la cabecera de `tokens.css`.
- La cartera de servicios, que pasó a ser el catálogo `tiposProyecto`; los cinco contratantes; y las
  tres especies comerciales (puy, algarrobo, teca) al frente del catálogo de especies.

**Qué sigue siendo inventado**, y está dicho en la cabecera de `seed.js`: las ocho personas del
equipo, todos los montos, todas las fechas, todos los códigos de proyecto y todas las mediciones.

**Dos decisiones que conviene no deshacer sin consultar al cliente:**

1. **Los RIF de los cinco contratantes dicen "Por confirmar".** El brochure los nombra como clientes
   reales pero no da su RIF, y un número de identificación fiscal inventado para una empresa que
   existe no es un dato de ejemplo: es un registro falso. Se dejó el hueco a la vista. Lo mismo con
   los nombres de contacto. MONPICA tiene que aportarlos.
2. **El brochure dice "RECURSO HÍBRIDOS" y "GESTIÓN HÍBRIDA".** Casi con seguridad es un error de
   tipeo por "HÍDRICOS" e "HÍDRICA": la empresa hace estudios de agua, y "recurso híbrido" no
   significa nada en ese contexto. Se usó la palabra corregida (`Estudio de recurso hídrico`). Si el
   cliente confirma que quiso decir otra cosa, hay que cambiarlo en el catálogo `tiposProyecto` de
   `seed.js`.

**Lo que el brochure prometía y no se construyó.** Tres textos del brochure y del export de Stitch
anunciaban cubicación automática de madera. Se quitaron. La regla más importante del encargo es que
el volumen no se calcula nunca, así que la ficha de mediciones dice que el volumen es captura manual
del profesional. El único `Math.PI` del proyecto está en `ui.js`, calcula la circunferencia del
anillo de avance, y lleva un comentario que lo aclara.

---

## 9. Defectos encontrados durante la construcción

Se anotan porque casi todos son trampas que se pueden volver a pisar.

| Defecto | Causa | Qué se hizo |
|---|---|---|
| La versión de teléfono se rompía en tres páginas | Un `style="grid-template-columns:…"` en línea gana a las consultas de medio | Clases `rejilla-lateral`, `rejilla-lateral-sm`, `rejilla-lateral-inv`, `kpis-3` |
| Una tarjeta de indicador se desapilaba | El tono `aviso` heredaba `display:flex` de `.aviso`, que es la caja de aviso | Tonos con prefijo: `tono-ok`, `tono-aviso`, `tono-alerta` |
| Salía `&MIDDOT;` literal en pantalla | Una entidad HTML dentro de un texto que pasa por `esc()` | El carácter `·` directamente |
| El campo de búsqueda perdía su relleno izquierdo | Una regla posterior con la misma especificidad | Se subió la especificidad del selector |
| El pie del menú y el final de la página quedaban debajo de la barra de demostración | La barra crece a dos o tres filas en pantalla estrecha y su altura estaba fija en el CSS | La barra se mide y publica su altura real en `--demo-alto` |
| La barra superior tapaba el título en teléfono | Seguía fija en pantalla estrecha | `position: static` en móvil y se oculta la búsqueda global |
| Salía "Septiembre De 2026" | `text-transform: capitalize` capitaliza cada palabra | Se capitaliza solo la primera letra, en JS |
| La barra superior de las páginas públicas quedaba corrida | `left: var(--menu-ancho)` sin menú lateral | `.pi-barra.sola { left: 0 }` |
| Roles y nombres de archivo con acento | Un pase automático de acentuación que debía tocar solo textos visibles alcanzó identificadores (`administracion`, `direccion.html`, la propiedad `categoria`) y rompió `agregarMovimiento` en silencio | Revertido con precisión; el acento quedó solo en las etiquetas visibles |
| "Sin permiso" decía siempre "página desconocida" | La guarda escribe `?pagina=` y la página leía `p.get('página')`, con acento: otra víctima del mismo pase | Se lee `pagina`; la prueba de navegación ahora exige que la pantalla **nombre** la página bloqueada |
| La barra de demostración se volvía ilegible en Dirección | Colgaba de `--superficie-inversa`, que **por definición** se invierte con el tema: en oscuro la barra se volvía clara y su texto casi blanco quedaba sobre casi blanco (contraste 1:1) | Tokens propios `--demo-*` que no se redefinen en `html.oscuro`; la prueba de barras mide el contraste en los dos temas |
| Las etapas ya aprobadas se leían como "vencido hace 210 días" | `F.plazo` solo mira la fecha, mientras `etapaVencida` sí excluye las aprobadas y bloqueadas: el texto y el rojo usaban criterios distintos | `F.plazoEtapa(etapa)`, que mira el estado; la prueba comprueba que el texto y el rojo coincidan |
| El icono de pestaña era el logo descartado | Quedó incrustado como `data:` URI en las 17 páginas | Apunta a `assets/marca/favicon.png` |

Las dos últimas filas y la de "Sin permiso" son del mismo tipo: **dos caminos que deberían decir lo
mismo y no lo dicen**. Un parámetro que se escribe con un nombre y se lee con otro, un color que
depende de un token que se invierte, un texto que usa un criterio distinto al del color que lo
acompaña. Ninguno de los tres rompe nada visiblemente, y por eso las pruebas que solo miran "abrió
sin error" los dejaban pasar. Las tres pruebas correspondientes ahora comparan los dos caminos.

---

## Anexo · Inventario estructurado de la Fase 0

En `stitch/_inventario-fase0/` quedan los datos crudos del análisis, para no rederivarlos en la Fase 2:

- `pantallas.json` — inventario de las 25 pantallas: secciones, columnas de cada tabla, campos de cada formulario con sus opciones, insignias, botones, datos de ejemplo y notas visuales.
- `prototipo.json` — modelo de datos, matriz de permisos, etapas, catálogos y semilla del prototipo SPA.
- `tokens.json` — tokens visuales con su procedencia (configuración, prosa del `DESIGN.md` o medición sobre las capturas).
- `hallazgos_confirmados.json` — los 50 hallazgos con evidencia y decisión propuesta.
- `hallazgos_descartados.json` — los 20 descartados y por qué, para no reabrirlos.
