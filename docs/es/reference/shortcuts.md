# Teclado, ratón y pantalla táctil

Los atajos de teclado funcionan cuando el visor tiene el foco. Se ignoran mientras escribes en una celda de una tabla o en un diálogo; haz clic primero en el lienzo.

## Teclado {#keyboard}

| Atajo | Acción |
| --- | --- |
| <kbd>Ctrl</kbd>+<kbd>Z</kbd> | Deshacer |
| <kbd>Ctrl</kbd>+<kbd>Mayús</kbd>+<kbd>Z</kbd> | Rehacer |
| <kbd>Ctrl</kbd>+<kbd>S</kbd> | Guardar proyecto (descarga el JSON) |
| <kbd>Ctrl</kbd>+<kbd>O</kbd> | Abrir proyecto |
| <kbd>Ctrl</kbd>+<kbd>P</kbd> | Exportar imagen |
| <kbd>Ctrl</kbd>+<kbd>A</kbd> | Seleccionar todo |
| <kbd>Ctrl</kbd>+<kbd>C</kbd> | Copiar la selección (nodos, elementos y sus cargas) |
| <kbd>Ctrl</kbd>+<kbd>V</kbd> | Pegar: una silueta de la copia sigue al cursor; haz clic para colocarla, o escribe un desplazamiento Δx, Δz en la banda y pulsa **Pegar** |
| <kbd>Supr</kbd> | Eliminar la selección |
| <kbd>Esc</kbd> | Cancelar el modo de ratón actual, cerrar el recorrido, vaciar la selección o salir de una celda de la tabla |
| <kbd>Intro</kbd> | Confirmar una celda de la tabla |
| <kbd>F</kbd> | Ajustar contenido a la pantalla |
| <kbd>C</kbd> | Centrar contenido |
| <kbd>G</kbd> | Mostrar u ocultar la cuadrícula |
| <kbd>S</kbd> | Activar o desactivar el ajuste a la cuadrícula |
| <kbd>Ctrl</kbd>+<kbd>=</kbd> / <kbd>Ctrl</kbd>+<kbd>-</kbd> | Acercar / alejar |

En un Mac, usa <kbd>Cmd</kbd> donde se indica <kbd>Ctrl</kbd>.

## Ratón {#mouse}

| Acción | Resultado |
| --- | --- |
| Clic | Selecciona un nodo, un elemento, una carga o una línea de cota y abre su panel |
| Arrastrar sobre el lienzo vacío | Rectángulo de selección |
| Arrastrar un nodo | Mueve el nodo (se ajusta a la cuadrícula si el ajuste está activado) |
| Clic en modo de ratón | Coloca un nodo, o empieza o continúa una polilínea de elementos |
| Doble clic en una carga | Edita la carga |
| Clic derecho | Menú del lienzo: Añadir nodo, Añadir elemento, Añadir cota, Acotar el elemento … (sobre un elemento), Editar, Copiar, Pegar, Eliminar |
| <kbd>Ctrl</kbd> (<kbd>Cmd</kbd> en un Mac) + Añadir nodo / Añadir elemento en el menú del lienzo | Coloca con el ratón en lugar de con un diálogo |
| Arrastrar con el botón central o derecho | Desplaza la vista (ver *Configuración → Controles y atajos*) |
| Rueda | Zoom hacia el cursor |
| Señalar un objeto | Tooltip con desplazamientos, propiedades o valores de carga |

En un trackpad, el desplazamiento con dos dedos hace zoom. Para desplazar la vista, haz clic y arrastra con dos dedos (equivale a arrastrar con el botón derecho).

## Pantalla táctil {#touch}

| Gesto | Resultado |
| --- | --- |
| Tocar | Selecciona y muestra los datos y las acciones del objeto |
| Tocar en modo de ratón | Coloca un nodo o continúa un elemento |
| Pulsar un nodo y arrastrar | Mueve el nodo |
| Arrastrar con un dedo en otro sitio | Desplaza la vista |
| Pellizcar | Zoom |
| Mantener pulsado el lienzo | Menú del lienzo |
| Botón **Selección por rectángulo** (arriba a la derecha) y luego arrastrar | Rectángulo de selección |

## Paneles de objeto {#object-panels}

Al hacer clic en un objeto se abre junto a él un panel con sus datos y estas acciones:

| Objeto | Acciones |
| --- | --- |
| Nodo | Añadir carga · Apoyos del nodo (símbolo de apoyo, Dx / Dz / Ry, ángulo del SCL nodal) · Imponer desplazamiento (en un nodo con apoyo) · Eliminar |
| Elemento | Editar elemento (nodos y rótulas, material, sección) · Añadir carga · Matriz de rigidez · Eliminar |
| Carga nodal o de elemento | Editar carga · Eliminar |
| Línea de cota | Editar (coordenadas) · Invertir cota · Eliminar |
