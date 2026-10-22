# Preguntas frecuentes

## General {#general}

### ¿Qué es EduBeam? {#what-is-edubeam}

Un solver gratuito, de código abierto y basado en el navegador para vigas, pórticos y celosías 2D, pensado para estudiantes, docentes e ingenieros que quieren una respuesta inmediata. Consulta la [Introducción](/es/guide/introduction).

### ¿De verdad es gratis? ¿Necesito una cuenta? {#is-it-really-free-do-i-need-an-account}

Sí, y no. Abre [run.edubeam.app](https://run.edubeam.app/?lang=es) y empieza a modelar. No hay cuentas, ni instaladores, ni límites de uso. El código fuente está en [GitHub](https://github.com/janvorisek/edubeam).

### ¿Qué navegadores y dispositivos funcionan? {#which-browsers-and-devices-work}

Cualquier versión actual de Chrome, Edge, Firefox o Safari. Las tabletas y los teléfonos funcionan: toca para seleccionar o colocar, arrastra un nodo para moverlo, arrastra en otro sitio para desplazar la vista, pellizca para hacer zoom y mantén pulsado para abrir el menú del lienzo. Aun así, con ratón y teclado se modela más rápido. Consulta [Teclado, ratón y pantalla táctil](/es/reference/shortcuts#touch).

### He perdido mi modelo. ¿Puedo recuperarlo? {#i-lost-my-model-can-i-get-it-back}

Probablemente. Al limpiar el modelo, o al abrir encima un enlace, un archivo o un ejemplo, el anterior se conserva en **☰ → Estructuras recientes** (los 10 últimos), y <kbd>Ctrl</kbd>+<kbd>Z</kbd> deshace el reemplazo. Ambos viven solo en tu navegador.

### ¿Puedo usarlo sin conexión? {#can-i-use-it-offline}

EduBeam es una aplicación web progresiva (PWA): una vez cargada, sigue funcionando sin conexión, y el navegador puede ofrecer instalarla. Cuando hay una versión nueva disponible, un diálogo te pregunta antes de actualizar.

### ¿Dónde se guardan mis datos? {#where-is-my-data-stored}

Solo en tu navegador. Los modelos nunca se envían a un servidor; el enlace para compartir *es* el modelo. Consulta [Importar, exportar y compartir](/es/essentials/import-export).

## Modelado {#modelling}

### ¿Cómo creo un empotramiento, una articulación o un apoyo de rodillo? {#how-do-i-make-a-fixed-pinned-roller-support}

Haz clic en el nodo, abre **Apoyos del nodo** y elige el símbolo: articulación, rodillo, empotramiento, deslizadera y más. O marca los GDL: **Dx + Dz + Ry** = empotramiento, **Dx + Dz** = articulación, **Dz** = rodillo. Todas las combinaciones están en [Nodos y apoyos](/es/essentials/nodes-supports#supports).

### ¿Cómo hago una celosía? {#how-do-i-make-a-truss}

Usa elementos viga y marca **las dos Rótulas de extremo** de cada barra en la pestaña *Elementos*, o marca *Rótula al inicio* y *Rótula al final* en la banda antes de dibujar las barras con el ratón. Aplica las cargas en los nudos. El [tutorial de la celosía](/es/tutorials/truss) recorre un ejemplo completo.

### ¿Cómo pongo una rótula en un pórtico? {#how-do-i-put-a-hinge-in-a-frame}

Marca la **Rótula al final** (o al inicio) del elemento que está en el lado del nudo donde quieres liberar el momento. Articular *un* elemento en un nudo libera solo ese elemento.

### ¿Cómo añado un apoyo o una carga puntual en el centro de una viga? {#how-do-i-add-a-support-or-a-point-load-in-the-middle-of-a-beam}

Añade un nodo sobre la viga con *Añadir con ratón* y elige **Conectar a la estructura**: la viga se divide en dos. Para una carga puntual sola ni siquiera necesitas un nodo: usa una carga de elemento **Carga concentrada** con su posición.

### ¿Puedo aplicar el peso propio? {#can-i-apply-self-weight}

No automáticamente. Introdúcelo como carga uniformemente distribuida $f_z = \rho g A$.

### ¿Puedo modelar apoyos inclinados? {#can-i-model-inclined-supports}

Sí: define un **Ángulo del SCL nodal** en el nodo; sus GDL se interpretan entonces en el sistema girado.

### ¿Hay casos o combinaciones de carga? {#are-there-load-cases-or-combinations}

No, solo un caso de carga. Modela cada caso por separado y guárdalo o compártelo.

### ¿Por qué mis cargas apuntan hacia arriba? {#why-do-my-loads-point-up}

Porque el eje global z apunta **hacia abajo**: un `Fz` positivo es hacia abajo. Consulta el [convenio de signos](/es/elements/conventions). Si prefieres un eje vertical hacia arriba, cambia a ejes con y hacia arriba en *Configuración → Idioma y configuración regional → Sistema de coordenadas*.

## Resultados {#results}

### ¿Por qué no hay botón «Calcular»? {#why-is-there-no-solve-button}

El modelo se resuelve automáticamente tras cada cambio. Si no aparecen resultados, el modelo todavía no se puede resolver: [Solución de problemas](/es/reference/troubleshooting) indica qué comprobar.

### ¿Por qué mi flecha difiere ligeramente de la fórmula? {#why-does-my-deflection-differ-slightly-from-the-formula}

EduBeam usa vigas de Timoshenko, así que las flechas incluyen la deformación por cortante. En barras esbeltas la diferencia queda muy por debajo del 1 %. Los detalles y comparaciones resueltas están en [Comprobar resultados a mano](/es/guide/verification).

### ¿Qué precisión tienen los resultados? ¿Necesito más elementos? {#how-accurate-are-the-results-do-i-need-more-elements}

En análisis estático lineal, el elemento viga es exacto para los tipos de carga disponibles, así que basta un elemento por barra. Solo necesitas nodos adicionales donde quieras un apoyo, una rótula, un cambio de sección o un nodo en el que aplicar una carga.

### ¿Dónde aparecen las reacciones? {#where-are-the-reactions-listed}

En el visor, como flechas con sus valores (**Reacciones** en las opciones de visualización, activadas por defecto). También están en el archivo de **Resultados → Exportar CSV** y en **Copiar**. Los desplazamientos nodales y las fuerzas en extremos de los elementos están en la pestaña **Resultados**.

## Archivos y compartir {#files-sharing}

### ¿Cómo comparto un modelo? {#how-do-i-share-a-model}

**Compartir modelo** → **Copiar**. El enlace contiene el modelo completo. Los destinatarios obtienen su propia copia editable; no hay colaboración en tiempo real. Consulta también [Enseñar con EduBeam](/es/guide/teaching).

### ¿Puedo incrustar un modelo en mi web o en unas diapositivas? {#can-i-embed-a-model-on-my-website-or-in-slides}

Sí: añade `&viewer=1` a un enlace para compartir y ponlo en un `<iframe>`. Consulta [Incrustar un visor](/es/essentials/import-export#embed-a-read-only-viewer).

### ¿Puedo exportar imágenes o tablas? {#can-i-export-images-or-tables}

Sí. **☰ → Exportar imagen** (<kbd>Ctrl</kbd>+<kbd>P</kbd>) guarda el dibujo en PNG o SVG, con el tamaño o la escala que elijas. **Resultados → Exportar CSV** guarda ambas tablas de resultados, y **Copiar** las pone en el portapapeles para una hoja de cálculo. Consulta [Importar, exportar y compartir](/es/essentials/import-export#export-an-image).

### ¿Puedo generar modelos mediante programación? {#can-i-generate-models-programmatically}

Sí. El archivo de proyecto es JSON sencillo en unidades SI (consulta la [descripción del formato](/es/essentials/import-export#project-file-format)) y se puede abrir con *Abrir proyecto* o arrastrándolo a la aplicación.

## Soporte {#support}

### ¿Cómo informo de un error o solicito una función? {#how-do-i-report-a-bug-or-request-a-feature}

Abre una incidencia en [GitHub](https://github.com/janvorisek/edubeam/issues) y adjunta un enlace para compartir o un archivo de proyecto que lo reproduzca. Soporte privado: [support@edubeam.app](mailto:support@edubeam.app).
