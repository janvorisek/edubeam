# Interfaz de usuario

<Edubeam /> tiene tres zonas. Cuando sabes qué hay en cada una, el resto de la documentación cobra sentido.

```
┌──────────────────────────────────────────────────────────────┐
│ ☰  edubeam    🗑 Limpiar estructura  🔗 Compartir  Novedades  │  ← Barra superior
├──────────────────────────────────────────────────────────────┤
│ Visor | Configuración                                        │  ← Pestañas
│ ↶ ↷                                        ⌖  ⤢  ⚙            │
│                                                              │
│                     lienzo (el modelo)          [capas de    │  ← Visor
│                                                  resultados] │
│                                       G  S  m·kN·kNm·MPa     │
├──────────────────────────────────────────────────────────────┤
│ Nodos | Elementos | Cargas | Materiales | Secciones | Resultados │  ← Barra inferior
│ [Añadir nodo] [Añadir con ratón]        tabla de entidades … │
└──────────────────────────────────────────────────────────────┘
```

## Barra superior

| Control | Qué hace |
| --- | --- |
| **Menú ☰** | **Abrir proyecto**, **Guardar proyecto**, **Compartir modelo**, **Limpiar estructura** y la versión de la aplicación. |
| **Limpiar estructura** 🗑 | Elimina todos los nodos, elementos y cargas tras confirmar. Dos casillas permiten eliminar también materiales y secciones. No se puede deshacer. |
| **Compartir modelo** 🔗 | Abre el [diálogo de compartir](/es/essentials/import-export#compartir-un-enlace) con una URL que codifica todo el modelo. |
| **¿Qué hay de nuevo?** | Notas de versión. |
| **Documentación** / GitHub | Enlaces a este sitio y al código fuente. |

En el [modo visor](/es/essentials/import-export#incrustar-un-visor-de-solo-lectura) la barra superior está oculta.

## Visor

El lienzo donde dibujas e inspeccionas el modelo. Todo lo demás en la aplicación responde a lo que seleccionas aquí.

### Botones sobre el lienzo

- **Arriba a la izquierda:** **Deshacer** / **Rehacer** (también <kbd>Ctrl</kbd>+<kbd>Z</kbd> / <kbd>Ctrl</kbd>+<kbd>Mayús</kbd>+<kbd>Z</kbd>). Cualquier cambio del modelo —añadir, editar, arrastrar, eliminar— se puede deshacer.
- **Arriba a la derecha:** **Centrar** (<kbd>C</kbd>), **Ajustar a la pantalla** (<kbd>F</kbd>) y el interruptor de **ajustes de visualización** ⚙.
- **Abajo a la derecha:** **G** activa la cuadrícula, **S** el ajuste a la cuadrícula; la **etiqueta de unidades** muestra las unidades activas y abre la configuración al hacer clic.

### Panel de visualización

Se abre con el botón ⚙. Dos filas de casillas:

- **Resultados:** *Forma deformada*, *N (x)*, *V<sub>z</sub> (x)*, *M<sub>y</sub> (x)*, *Reacciones*.
- **Modelo:** *Apoyos*, *Cargas*, *Etiquetas de nodos*, *Etiquetas de elementos*.

**Más ajustes** abre el [diálogo de configuración](/es/essentials/units-settings) completo.

### Navegar

| Acción | Ratón / táctil |
| --- | --- |
| Zoom | Rueda del ratón (hacia el cursor), <kbd>Ctrl</kbd>+<kbd>=</kbd> / <kbd>Ctrl</kbd>+<kbd>-</kbd>; pellizco en pantallas táctiles |
| Desplazar | Arrastrar con el botón **central o derecho** (configurable en *Configuración → Controles y atajos*); arrastrar con un dedo en pantallas táctiles |
| Ajustar / centrar | <kbd>F</kbd> / <kbd>C</kbd> o los botones de arriba a la derecha |

### Seleccionar y editar

- **Haz clic** en un nodo, elemento, carga o línea de cota para seleccionarlo. La barra inferior salta a la pestaña correspondiente y junto a la selección aparece un pequeño **menú contextual** con las acciones disponibles (p. ej. *Añadir carga*, *Apoyos del nodo*, *Editar elemento*, *Matriz de rigidez*, *Eliminar*).
- **Arrastra sobre el lienzo vacío** para dibujar un rectángulo de selección. Se selecciona todo lo que hay dentro: nodos, elementos, sus cargas y las cotas. <kbd>Supr</kbd> lo elimina todo; <kbd>Ctrl</kbd>+<kbd>C</kbd> / <kbd>Ctrl</kbd>+<kbd>V</kbd> lo copia y pega en otro sitio.
- **Arrastra un nodo** para moverlo. Con el ajuste activado cae en la cuadrícula. Los elementos conectados y sus cargas lo siguen.
- **Doble clic en una carga** para editarla.
- **Pasa el ratón** por cualquier cosa para ver un tooltip: los nodos muestran sus desplazamientos y giro, los elementos su material y sección, las cargas sus componentes.
- **Clic derecho en el lienzo vacío** abre el menú del lienzo: *Añadir nodo*, *Añadir elemento*, *Añadir cota*, *Editar* (abre una tabla de la selección actual), *Copiar*, *Pegar*, *Eliminar*. Mantén <kbd>Ctrl</kbd> al elegir *Añadir nodo* / *Añadir elemento* para colocarlos con el ratón en lugar de con un diálogo.

Todos los atajos están en la página [Teclado y ratón](/es/reference/shortcuts).

### Avisos

Arriba a la izquierda del visor aparecen mensajes cuando algo falla: *No hay materiales definidos.* / *No hay secciones definidas.* (con un botón **Añadir**) o *Model has N error(s)*, con un botón **Show details** que lista cada problema. Ver [Solución de problemas](/es/reference/troubleshooting).

## Barra inferior

Seis pestañas, cada una con un contador, una barra de herramientas y una tabla editable. Arrastra el divisor sobre la barra para cambiar su altura o minimízala con el botón de la derecha.

| Pestaña | Barra de herramientas | Tabla |
| --- | --- | --- |
| **Nodos** | Añadir nodo (diálogo), Añadir con ratón | Etiqueta, X, Z, casillas **Grados de libertad restringidos**, cargas en el nodo, eliminar |
| **Elementos** | Añadir elemento (diálogo), Añadir con ratón | Etiqueta, tipo, nodo inicial/final (+ *Intercambiar nodos*), material, sección, **Rótulas de extremo**, cargas en el elemento, matriz de rigidez, eliminar |
| **Cargas** | Añadir carga nodal, Añadir carga de elemento | Tipo, punto de aplicación, componentes editables, eliminar |
| **Materiales** | Añadir material, Biblioteca de materiales | Etiqueta, E, G, α<sub>T</sub>, eliminar |
| **Secciones** | Añadir sección, Biblioteca de secciones | Etiqueta, A, I<sub>y</sub>, h, k, eliminar |
| **Resultados** | Conmutador Resultados nodales / Resultados de elementos | Desplazamientos y giros por nodo, o fuerzas en extremos por elemento |

Las celdas se editan directamente: haz clic, escribe, pulsa <kbd>Intro</kbd> (o <kbd>Esc</kbd> para salir de la celda). Los valores se muestran e introducen en las [unidades actuales](/es/essentials/units-settings).

## Pestañas sobre el visor

La pestaña **Visor** siempre está presente. Abrir la configuración añade a su lado una pestaña **Configuración** que se puede cerrar, para ajustar colores o unidades sin perder de vista el modelo.

## Ventanas flotantes

Algunas acciones abren ventanas arrastrables sobre el visor: **Matriz de rigidez** (desde el menú contextual de un elemento o su fila de la tabla) muestra la matriz de rigidez 6 × 6 del elemento en coordenadas locales y globales; **Editar** en el menú del lienzo abre una tabla de la selección actual. Ciérralas con la ×.
