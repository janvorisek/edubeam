# Resultados y diagramas

<Edubeam /> resuelve el modelo automáticamente tras cada cambio (limitado a unas pocas veces por segundo), así que los resultados siempre están al día. No hay botón *Calcular*. Si no se dibuja nada, el modelo aún no es resoluble; ver [Solución de problemas](/es/reference/troubleshooting).

## Capas en el visor

Se activan y desactivan en el **panel de visualización** (botón ⚙, arriba a la derecha del visor).

| Capa | Color (por defecto) | Notas |
| --- | --- | --- |
| **Forma deformada** | gris | Exagerada; escalada para que el mayor desplazamiento mida los píxeles de *Escala de resultados*. |
| **N (x)** – esfuerzo axil | azul | Tracción positiva. Constante a lo largo de un elemento salvo que actúe una carga distribuida axial. |
| **V<sub>z</sub> (x)** – esfuerzo cortante | verde | Lineal con carga uniforme, cuadrático con carga trapezoidal, salta en las cargas concentradas. |
| **M<sub>y</sub> (x)** – momento flector | rojo | Positivo con tracción en la fibra inferior. Etiquetado en ambos extremos, en las cargas concentradas y en cada extremo local (donde V = 0). |
| **Reacciones** | morado | Una flecha y un valor por cada grado de libertad restringido. |

Los diagramas se dibujan a lo largo de los elementos con sus valores en los puntos característicos. La orientación de las etiquetas y la escala de todos los diagramas se cambian en [Ajustes](/es/essentials/units-settings#ajustes-del-visor).

### Esfuerzo axil

<Figure>
    <Structure :show-loads="true" show-normal-force :nodes="[{label: 'a', coords: [0,0,0], dofs: [0,2, 4]}, {label: 'b', coords: [10,0,0], dofs: []}]" :elements="[{label: '1', nodes: ['a', 'b']}]" :nodal-loads="[{target: 'b', values: { 0: -100, 2: 0, 4: 0 }}]" />
    <figcaption>Ménsula comprimida por una fuerza horizontal en el extremo libre: N es constante y negativo</figcaption>
</Figure>

### Esfuerzo cortante

<Figure>
  <Structure :show-loads="true" show-shear-force :nodes="[{label: 'a', coords: [0,0,0], dofs: [0,2, 4]}, {label: 'b', coords: [10,0,0], dofs: []}]" :elements="[{label: '1', nodes: ['a', 'b']}]" :nodal-loads="[{target: 'b', values: { 0: 0, 2: 10, 4: 0 }}]" />
 <figcaption>Ménsula con carga vertical en el extremo: V es constante</figcaption>
</Figure>

### Momento flector

<Figure>
  <Structure :show-loads="true" show-moment :nodes="[{label: 'a', coords: [0,0,0], dofs: [0,2, 4]}, {label: 'b', coords: [10,0,0], dofs: []}]" :elements="[{label: '1', nodes: ['a', 'b']}]" :nodal-loads="[{target: 'b', values: { 0: 0, 2: 10, 4: 0 }}]" />
 <figcaption>La misma ménsula: M crece linealmente hasta F·L en el empotramiento</figcaption>
</Figure>

### Forma deformada

<Figure>
  <Structure :show-loads="true" show-deformed-shape :nodes="[{label: 'a', coords: [0,0,0], dofs: [0,2, 4]}, {label: 'b', coords: [10,0,0], dofs: []}]" :elements="[{label: '1', nodes: ['a', 'b']}]" :nodal-loads="[{target: 'b', values: { 0: 0, 2: 10, 4: 0 }}]" />
  <figcaption>Deformada (exagerada) de la ménsula</figcaption>
</Figure>

### Reacciones

<Structure :show-loads="true" show-reactions :nodes="[{label: 'a', coords: [0,0,0], dofs: [0,2, 4]}, {label: 'b', coords: [10,0,0], dofs: []}]" :elements="[{label: '1', nodes: ['a', 'b']}]" :nodal-loads="[{target: 'b', values: { 0: 0, 2: 10, 4: 0 }}]" />

## Tooltips al pasar el ratón

Pasar el ratón en el visor es la forma más rápida de leer un valor:

- **Nodo** → `ux`, `uz`, `φy` (desplazamientos en la unidad de longitud, giro en radianes).
- **Elemento** → su etiqueta, sección y material.
- **Carga** → sus componentes.

## Pestaña Resultados

La pestaña **Resultados** de la barra inferior tiene dos vistas:

### Resultados nodales

Una fila por nodo con **Dx**, **Dz** (unidad de longitud) y **Ry** (rad). Los signos siguen los ejes globales: `Dz` positivo es hacia abajo, `Ry` positivo es antihorario en pantalla.

<figure>

![Resultados nodales](/results_nodes.png)

</figure>

### Resultados de elementos

Una fila por elemento con las **fuerzas en extremos en el sistema de coordenadas local del elemento**:

| Columna | Significado |
| --- | --- |
| `X12`, `Z12`, `M12` | esfuerzo axil, cortante y momento que actúan sobre el elemento en su nodo **inicial** |
| `X21`, `Z21`, `M21` | lo mismo en su nodo **final** |

Son las fuerzas que los nodos ejercen sobre el elemento (matriz de rigidez del elemento por sus desplazamientos de extremo, menos las cargas nodales equivalentes). Para una viga biapoyada de 6 m con 12 kN/m obtienes `Z12 = Z21 = −36 kN`: ambos apoyos empujan la viga hacia arriba (z negativo). Para una ménsula empotrada en el nodo inicial con 18 kN hacia abajo en el extremo: `Z12 = −18`, `M12 = +72 kNm`, `Z21 = +18`, `M21 = 0`.

<figure>

![Resultados de elementos](/results_elements.png)

</figure>

### Matriz de rigidez

Elige **Matriz de rigidez** en el menú contextual de un elemento o en su fila de la tabla para abrir una ventana flotante con la matriz de rigidez 6 × 6 del elemento en coordenadas locales y globales, útil para comprobar el ensamblaje a mano en un curso del método de la rigidez. Las fórmulas están en el [manual teórico](/es/elements/beam).

## Precisión y exactitud

- El elemento viga es exacto para el modelo lineal de Timoshenko con cargas nodales, uniformes, trapezoidales, concentradas y térmicas, así que los resultados **no** dependen del número de elementos.
- Las tablas muestran cuatro cifras significativas; el cálculo interno es en doble precisión.
- Las flechas incluyen la **deformación por cortante** (Timoshenko). En barras esbeltas esto añade una fracción de un 1 % respecto a las fórmulas de Euler–Bernoulli; en barras de gran canto o cortas puede ser de varios por ciento. Pon el coeficiente de cortante de la sección en un valor grande si quieres suprimirla.

## Llevar los resultados a un informe

No hay exportación de tablas; selecciona el texto de la tabla y cópialo, o haz una captura del visor. Para entregar un modelo a otra persona, usa [Compartir modelo](/es/essentials/import-export).
