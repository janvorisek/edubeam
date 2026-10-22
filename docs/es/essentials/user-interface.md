# Interfaz de usuario

<Edubeam /> tiene tres zonas: la **barra superior**, el **visor** en el centro, donde dibujas, y la **barra inferior**, con una tabla para cada tipo de objeto. Cuando sabes qué hay en cada sitio, el resto de la guía cobra sentido.

![Las partes de la interfaz, numeradas como en la lista siguiente](/screenshots/es/ui-overview.webp)

1. **Menú ☰**: abrir, guardar, compartir y exportar; ejemplos y recorridos guiados.
2. **Botones de la barra superior**: Limpiar estructura y Compartir modelo.
3. **Deshacer / Rehacer** para cualquier cambio del modelo.
4. **Botones del visor**: centrar, ajustar a la pantalla y el botón de las opciones de visualización.
5. **Opciones de visualización**: qué resultados y qué partes del modelo se dibujan.
6. **Cuadrícula, ajuste, cruceta y unidades.**
7. **Pestañas de la barra inferior**: Nodos, Elementos, Cargas, Materiales, Secciones, Resultados.
8. **La tabla** de la pestaña abierta, donde se puede editar cada valor.

::: tip Haz el recorrido
**☰ → Hacer un recorrido** te señala estas partes en la propia aplicación, una a una.
:::

![Hacer un recorrido, en el paso de las opciones de visualización](/screenshots/es/tour.webp)

## Barra superior {#app-bar}

| Control | Qué hace |
| --- | --- |
| **Menú ☰** | El menú principal, ver más abajo. |
| **Limpiar estructura** | Elimina todos los nodos, elementos y cargas tras pedir confirmación. Dos casillas eliminan también los materiales y las secciones. <kbd>Ctrl</kbd>+<kbd>Z</kbd> recupera el modelo, que además queda en Estructuras recientes. |
| **Compartir modelo** | Abre el [diálogo de compartir](/es/essentials/import-export#share-a-link) con un enlace que contiene todo el modelo. |
| **¿Qué hay de nuevo?** | Notas de versión. También se abren solas una vez después de cada actualización. |
| **Documentación** / GitHub | Esta guía y el código fuente. |

En un teléfono solo caben el menú ☰ y Documentación; todo lo demás está en el menú.

### El menú ☰ {#the-☰-menu}

![El menú ☰](/screenshots/es/ui-app-menu.webp){.shot-xs}

| Opción | Qué hace |
| --- | --- |
| **Abrir proyecto** / **Guardar proyecto** | Abre o descarga un archivo `project.json` (<kbd>Ctrl</kbd>+<kbd>O</kbd> / <kbd>Ctrl</kbd>+<kbd>S</kbd>). |
| **Estructuras recientes** | Los 10 últimos modelos que limpiaste o reemplazaste, listos para restaurar. |
| **Exportar imagen** | Guarda el dibujo en PNG o SVG, o lo copia (<kbd>Ctrl</kbd>+<kbd>P</kbd>). |
| **Compartir modelo** | Igual que el botón de la barra superior. |
| **Ejemplos** | La galería de modelos ya preparados. |
| **Dibuja tu primera viga** | Una tarea guiada de siete pasos. |
| **Hacer un recorrido** | El recorrido por la interfaz. |
| **Limpiar estructura** | Igual que el botón de la barra superior. |

En la parte inferior del menú se muestran la versión de la aplicación y su fecha de publicación.

## Visor {#viewer}

El lienzo es donde dibujas e inspeccionas el modelo. Todo lo demás en la aplicación responde a lo que seleccionas aquí.

### Botones sobre el lienzo {#buttons-on-the-canvas}

- **Arriba a la izquierda:** **Deshacer** y **Rehacer** (<kbd>Ctrl</kbd>+<kbd>Z</kbd> / <kbd>Ctrl</kbd>+<kbd>Mayús</kbd>+<kbd>Z</kbd>). Cualquier cambio del modelo, incluidos añadir, editar, arrastrar, eliminar y limpiar, se puede deshacer.
- **Arriba a la derecha:** **Centrar contenido** (<kbd>C</kbd>), **Ajustar contenido a la pantalla** (<kbd>F</kbd>) y el botón ⚙, que muestra u oculta las opciones de visualización. En pantallas táctiles hay además **Selección por rectángulo**.
- **Abajo a la derecha:** **G** muestra u oculta la cuadrícula, **S** activa o desactiva el ajuste a la cuadrícula, el botón de la cruceta muestra la posición del puntero en las reglas, y la **etiqueta de unidades** abre la configuración en *Idioma y configuración regional*.

### Opciones de visualización {#display-options}

![Los botones del visor y las opciones de visualización](/screenshots/es/ui-display-settings.webp){.shot-lg}

Dos filas de casillas, abiertas por defecto:

- **Resultados:** *Forma deformada*, *N (x)*, *V<sub>z</sub> (x)*, *M<sub>y</sub> (x)*, *Reacciones*. La forma deformada, M y las reacciones están marcadas al inicio.
- **Modelo:** *Apoyos*, *Cargas*, *Etiquetas de nodos*, *Etiquetas de elementos*.

**Más ajustes** abre la [configuración](/es/essentials/units-settings) completa en *Ajustes del visor*.

### Navegar {#navigating}

| Acción | Ratón | Pantalla táctil |
| --- | --- | --- |
| Zoom | Rueda del ratón (hacia el cursor), <kbd>Ctrl</kbd>+<kbd>=</kbd> / <kbd>Ctrl</kbd>+<kbd>-</kbd> | Pellizcar |
| Desplazar | Arrastrar con el botón **central o derecho** (ver *Configuración → Controles y atajos*) | Arrastrar con un dedo |
| Ajustar / centrar | <kbd>F</kbd> / <kbd>C</kbd> o los botones de arriba a la derecha | Los botones de arriba a la derecha |

### Seleccionar y editar {#selecting-and-editing}

**Haz clic** en un nodo, elemento, carga o línea de cota para seleccionarlo. Junto a él se abre un panel con sus datos y las acciones que le corresponden: añadir una carga, definir apoyos, editar, mostrar la matriz de rigidez, eliminar. Al hacer clic en un nodo, la barra inferior cambia también a la pestaña Nodos.

<div class="shots">

![Un nodo: añadir una carga, definir apoyos, imponer un desplazamiento](/screenshots/es/ui-node-menu.webp)

![Un elemento: editar, añadir una carga, matriz de rigidez](/screenshots/es/ui-element-menu.webp)

</div>

- **Arrastra sobre el lienzo vacío** para dibujar un rectángulo de selección. Se selecciona todo lo que queda dentro: nodos, elementos, sus cargas y las líneas de cota. Pulsa <kbd>Supr</kbd> para eliminarlo todo, o <kbd>Ctrl</kbd>+<kbd>C</kbd> / <kbd>Ctrl</kbd>+<kbd>V</kbd> para copiarlo en otro sitio.
- **Arrastra un nodo** para moverlo. Con el ajuste activado, cae en la cuadrícula. Los elementos conectados y sus cargas lo siguen.
- **Haz doble clic en una carga** para editarla.
- **Señala** cualquier objeto para ver un tooltip. Los nodos muestran sus desplazamientos y su giro, los elementos su material y su sección, las cargas sus valores. En una pantalla táctil, toca en su lugar: los mismos datos aparecen en el panel de selección.

![Al señalar un nodo se muestran sus desplazamientos y su giro](/screenshots/es/ui-hover.webp){.shot-sm}

**Haz clic derecho en el lienzo** (o mantén pulsado en una pantalla táctil) para abrir el menú del lienzo. Mantén <kbd>Ctrl</kbd> pulsado al elegir *Añadir nodo* o *Añadir elemento* para colocarlos con el ratón en lugar de con un diálogo. Sobre un elemento, el menú ofrece también *Acotar el elemento …*.

![El menú del lienzo](/screenshots/es/ui-canvas-menu.webp){.shot-sm}

Todos los atajos están en la página [Teclado, ratón y pantalla táctil](/es/reference/shortcuts).

### Cuando el modelo no se puede resolver {#when-the-model-cannot-be-solved}

Los mensajes aparecen arriba a la izquierda del visor:

- *No hay materiales definidos.* / *No hay secciones definidas.*, con un botón **Añadir**.
- Una pequeña etiqueta azul **Faltan apoyos** mientras el modelo simplemente está sin terminar.
- Un **mensaje rojo** cuando algo está mal, con **Mostrar detalles**, que lista todos los problemas.

Cuando la estructura todavía puede moverse, EduBeam la hace oscilar como un contorno discontinuo y rodea con un círculo los nodos o las rótulas culpables. Señala el mensaje para volver a ver el movimiento, o usa su botón del ojo para ocultarlo.

![Un pórtico con rótulas en B y C es un mecanismo: EduBeam muestra cómo se mueve](/screenshots/es/ui-mechanism.webp)

![Mostrar detalles lista cada problema con una sugerencia](/screenshots/es/ui-diagnostics.webp){.shot-lg}

En [Solución de problemas](/es/reference/troubleshooting) se explica cada mensaje.

## Barra inferior {#bottom-bar}

Seis pestañas, cada una con una barra de herramientas y una tabla editable. Las pestañas muestran cuántos objetos de cada tipo tiene el modelo. El **?** de la derecha explica la pestaña abierta, igual que el **?** junto a algunos encabezados de columna. Arrastra la fila de pestañas hacia arriba o hacia abajo para cambiar el tamaño de la barra, o minimízala con el botón de la derecha.

| Pestaña | Barra de herramientas | Tabla |
| --- | --- | --- |
| **Nodos** | Añadir nodo (diálogo), Añadir nodo (ratón) | Etiqueta, coordenadas, **Grados de libertad restringidos** (símbolo de apoyo, Dx, Dz, Ry, ángulo del apoyo α), cargas, editar, eliminar |
| **Elementos** | Añadir elemento (diálogo), Añadir elemento (ratón) | Etiqueta, tipo, nodos (con un botón para intercambiarlos), material, sección, **Rótulas de extremo**, cargas, matriz de rigidez, eliminar |
| **Cargas** | Añadir carga nodal, Añadir carga de elemento | Tipo, punto de aplicación, componentes editables, editar, eliminar |
| **Materiales** | Añadir material, Biblioteca de materiales | Etiqueta, E, G, α<sub>T</sub>, eliminar |
| **Secciones** | Añadir sección, Biblioteca de secciones, Sección poligonal | Forma, etiqueta, A, I<sub>y</sub>, h, k, editar forma, eliminar |
| **Resultados** | Resultados nodales, Resultados de elementos, Exportar CSV, Copiar | Desplazamientos y giros por nodo, o fuerzas en extremos por elemento |

Edita una celda directamente: haz clic, escribe y pulsa <kbd>Intro</kbd> (o <kbd>Esc</kbd> para salir de la celda). Los valores se muestran e introducen en las [unidades actuales](/es/essentials/units-settings).

## Pestañas sobre el visor {#tabs-above-the-viewer}

**Visor** muestra el lienzo. **Configuración** muestra la configuración a tamaño completo, para que puedas cambiar colores o unidades y volver a ver el efecto. La etiqueta de unidades y *Más ajustes* abren la misma configuración como un diálogo sobre el modelo.

## Ventanas flotantes {#floating-windows}

**Matriz de rigidez** (desde el panel de un elemento o la tabla de elementos) abre una ventana con la matriz de rigidez 6 × 6 del elemento en coordenadas globales. **Editar** en el menú del lienzo abre una tabla con la selección actual. Arrástralas por su barra de título y ciérralas con la ×.
