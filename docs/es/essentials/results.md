# Resultados y diagramas

<Edubeam /> resuelve el modelo tras cada cambio, como mucho unas pocas veces por segundo, así que los resultados están siempre al día. No hay botón *Calcular*. Si no se dibuja nada, el modelo todavía no se puede resolver; el mensaje de arriba a la izquierda del visor explica por qué (consulta [Solución de problemas](/es/reference/troubleshooting)).

Todas las imágenes de esta página muestran el mismo modelo: el [pórtico triarticulado](/es/tutorials/three-hinged-frame) con 10 kN/m.

## Capas en el visor {#overlays-in-the-viewer}

Actívalas y desactívalas en las **opciones de visualización**, arriba a la derecha del visor (el botón ⚙ las muestra u oculta).

| Capa | Color (predeterminado) | Notas |
| --- | --- | --- |
| **Forma deformada** | gris | Exagerada: el mayor desplazamiento se dibuja con una longitud de *Escala de resultados* píxeles. Activada por defecto. |
| **N (x)**, esfuerzo axil | azul | La tracción es positiva. Constante a lo largo de un elemento salvo que actúe sobre él una carga axial. |
| **V<sub>z</sub> (x)**, esfuerzo cortante | verde | Lineal con carga uniforme, cuadrático con carga trapezoidal, con un salto en cada carga puntual. |
| **M<sub>y</sub> (x)**, momento flector | rojo | Positivo con tracción en la fibra inferior. Etiquetado en ambos extremos, en las cargas puntuales y en cada extremo local (donde V = 0). Activado por defecto. |
| **Reacciones** | morado | Una flecha y un valor por cada GDL restringido. Activadas por defecto. |

Los valores se escriben en los puntos característicos de cada diagrama. La orientación de las etiquetas, el tamaño de los diagramas y los colores se pueden cambiar en [Configuración](/es/essentials/units-settings#viewer-settings).

<div class="shots">

![Esfuerzo axil N: ambos pilares soportan 40 kN de compresión y la viga 20 kN](/screenshots/es/results-normal.webp)

![Esfuerzo cortante V: 20 kN en los pilares; en la viga, 40 kN en las esquinas, que bajan a cero en la rótula](/screenshots/es/results-shear.webp)

![Momento flector M: −80 kNm en ambas esquinas, cero en las bases y en la rótula](/screenshots/es/results-moment.webp)

![Deformada (exagerada): la rótula C desciende](/screenshots/es/results-deformed.webp)

</div>

![Reacciones: 40 kN en vertical y 20 kN en horizontal en cada articulación](/screenshots/es/results-reactions.webp){.shot-lg}

### Interpretar el signo {#reading-the-sign}

Lee el signo de un valor en su etiqueta, no por el lado de la barra en que se dibuja el diagrama. Un momento flector negativo tracciona la fibra superior de una viga, o la cara exterior de una esquina de pórtico.

## Tooltips al pasar el ratón {#hover-tooltips}

Señalar un objeto es la forma más rápida de leer un valor:

- **Nodo**: `ux`, `uz` y `φy` (desplazamientos en la unidad de desplazamiento, giro en radianes).
- **Elemento**: su etiqueta, su sección y su material.
- **Carga**: sus componentes.

En una pantalla táctil, toca el objeto en su lugar. Los mismos datos aparecen en su panel de selección.

![Señalando el nodo 2 de la viga del Inicio rápido](/screenshots/es/ui-hover.webp){.shot-sm}

## Pestaña Resultados {#results-tab}

La pestaña **Resultados** de la barra inferior tiene dos tablas, que se alternan con **Resultados nodales** y **Resultados de elementos**.

### Resultados nodales {#nodal-results}

Una fila por nodo con **Dx**, **Dz** (unidad de desplazamiento) y **Ry** (rad). Los signos siguen los ejes globales: un `Dz` positivo es hacia abajo y un `Ry` positivo es antihorario en pantalla.

![Resultados nodales del pórtico triarticulado (Formato numérico: Automático)](/screenshots/es/results-nodal.webp)

### Resultados de elementos {#element-results}

Una fila por elemento con las **fuerzas en extremos en el sistema de coordenadas local del elemento**:

| Columna | Significado |
| --- | --- |
| `X12`, `Z12`, `M12` | fuerza axil, fuerza cortante y momento que actúan sobre el elemento en su nodo **inicial** |
| `X21`, `Z21`, `M21` | lo mismo en su nodo **final** |

![Resultados de elementos del pórtico triarticulado](/screenshots/es/results-element.webp)

Son las fuerzas que los nodos ejercen sobre el elemento: la matriz de rigidez del elemento por sus desplazamientos en los extremos, menos las cargas nodales equivalentes. Siguen los ejes locales, no el convenio N-V-M de los diagramas:

- Para la viga biapoyada de 6 m del [Inicio rápido](/es/guide/quick-start): `Z12 = Z21 = −36 kN`. Ambos apoyos empujan la viga hacia arriba, que es −z.
- Para un voladizo empotrado en su nodo inicial con una carga de 18 kN hacia abajo en el extremo: `Z12 = −18 kN`, `M12 = +72 kNm`, `Z21 = +18 kN`, `M21 = 0`.
- Para el pilar 1 del pórtico (A abajo, B arriba): `X12 = +40 kN` empuja según el eje x local hacia dentro del elemento, lo que son 40 kN de compresión.

### Exportar CSV y Copiar {#export-csv-and-copy}

**Exportar CSV** descarga `edubeam-results.csv` con ambas tablas, en las unidades mostradas en pantalla y lista para una hoja de cálculo. La tabla de nodos incluye también las **reacciones** `Rx`, `Rz`, `My`. **Copiar** pone las mismas tablas en el portapapeles como texto separado por tabuladores, que se pega directamente en Excel, LibreOffice o Google Sheets. En la exportación, las fuerzas en extremos de los elementos se llaman `N1 V1 M1 N2 V2 M2`.

### Matriz de rigidez {#stiffness-matrix}

Elige **Matriz de rigidez** en el panel de un elemento o en su fila de la tabla para abrir una ventana con la matriz de rigidez 6 × 6 del elemento en coordenadas globales, útil para comprobar un ensamblaje a mano en un curso del método de la rigidez. Las fórmulas están en el [manual teórico](/es/elements/beam).

## Formato numérico {#number-format}

Los resultados se muestran con cinco cifras significativas. **Configuración → Idioma y configuración regional → Formato numérico** decide cómo se escriben:

| Formato | 40 000 se escribe | Úsalo para |
| --- | --- | --- |
| **Científico** (predeterminado) | 4 · 10⁴ | valores que abarcan muchos órdenes de magnitud |
| **Ingeniería** | 40 · 10³ | hacerlos coincidir con los prefijos kilo / mega |
| **Automático** | 40000 | números cotidianos en docencia |

Automático escribe los valores de 0,001 a 100 000 como números normales y pasa a potencias de diez fuera de ese intervalo. El separador decimal sigue el idioma.

## Precisión y exactitud {#precision-and-accuracy}

- El elemento viga es exacto para el modelo lineal de Timoshenko con cargas nodales, uniformes, trapezoidales, concentradas y térmicas, así que los resultados **no** dependen del número de elementos.
- El cálculo se hace en doble precisión. Valores minúsculos como `1,5 · 10⁻¹⁸` son errores de redondeo y significan cero.
- Las flechas incluyen la **deformación por cortante**. En barras esbeltas añade una fracción de punto porcentual al valor de Euler–Bernoulli; en barras de gran canto o cortas puede ser de varios puntos porcentuales. Pon un valor grande en el coeficiente de cortante de la sección para suprimirla.

## Resultados en un informe {#results-in-a-report}

- **☰ → Exportar imagen** (<kbd>Ctrl</kbd>+<kbd>P</kbd>) guarda el dibujo en PNG o SVG con las capas que elijas. Consulta [Exportar una imagen](/es/essentials/import-export#export-an-image).
- **Resultados → Exportar CSV** o **Copiar** te dan los números.
- **Compartir modelo** te da un enlace para que el lector pueda abrir el propio modelo.
