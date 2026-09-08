# Pruebas

No son parte de lo que se publica. Sirven para no romper la beta al modificarla.

Las tres primeras corren con Node solo. Las tres últimas necesitan Playwright y un Chromium
instalado; en este entorno se instalaron así:

```bash
cd /tmp && mkdir -p pw && cd pw && npm init -y
PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npm i playwright
```

Y se ejecutan desde la raíz del proyecto:

```bash
node pruebas/datos-y-permisos.js        # modelo de datos, catálogos, flujo de etapas, permisos
node pruebas/sintaxis-html.js *.html    # sintaxis de los guiones en línea de las 17 páginas
node pruebas/navegador-navegacion.js    # las 17 páginas en file:// con la red bloqueada
node pruebas/navegador-flujos.js        # las comprobaciones que el encargo pide por fase
node pruebas/navegador-responsive.js    # 1440, 768 y 390 px; deja capturas en el scratchpad
node pruebas/navegador-barras.js        # que las barras no se corten ni tapen el contenido
node pruebas/acentos.js                 # busca texto visible al que le falte una tilde
```

Si cambias la ruta del Chromium o la del proyecto, están escritas al principio de cada archivo.

## Qué comprueba cada una

**datos-y-permisos.js** verifica la semilla contra los requisitos del encargo (ocho usuarios en
cinco roles, seis proyectos en estados distintos, uno detenido, uno con dos etapas vencidas,
mediciones en tres parcelas, seis categorías financieras, treinta registros de bitácora), la
integridad de todas las referencias cruzadas, que devolver una etapa no desbloquee la siguiente y
aprobarla sí, que el volumen se guarde sin transformación, que una categoría fuera del catálogo se
rechace, que el Profesional no vea el total de honorarios, que desactivar un usuario no lo borre, y
que el estado sobreviva a un reinicio.

**navegador-flujos.js** recorre en un navegador real las comprobaciones que el encargo pide al
describir cada fase. No es el criterio de aceptación de la especificación, que nunca se recibió:
elegir rol, crear un proyecto con sus diez etapas, completar una etapa como Profesional, registrar
un documento, capturar tres mediciones, comprobar que el Profesional ve el equipo pero solo su
honorario, devolver y aprobar una compuerta, registrar y liquidar un movimiento, desactivar un
usuario y hallarlo en la bitácora, generar y exportar el reporte de cierre, y comprobar que todo
sobrevive al recargar.
