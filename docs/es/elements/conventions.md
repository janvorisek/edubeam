# Sistema de coordenadas y convenio de signos

La mayoría de los resultados «erróneos» en <Edubeam /> son en realidad una sorpresa del convenio de signos. Lo que sigue es exactamente lo que usa el solver.

## Ejes globales {#global-axes}

- **x**: horizontal, positivo hacia la **derecha**.
- **z**: vertical, positivo **hacia abajo** en pantalla.
- **y**: el eje perpendicular al plano (apunta hacia el observador en un sistema dextrógiro). Los giros y momentos son alrededor de y.

El indicador de ejes en la esquina de la cuadrícula muestra x (rojo) y z (verde). Un nodo en la cabeza de un pilar de 3 m tiene, por tanto, `Z = −3` si la base está en `Z = 0`.

## Grados de libertad {#degrees-of-freedom}

Cada nodo tiene `Dx`, `Dz` (traslaciones) y `Ry` (giro). Un `Dz` positivo es un desplazamiento hacia abajo; un `Ry` positivo es un giro **antihorario** en pantalla. Los mismos signos se aplican a los desplazamientos impuestos y a los resultados nodales.

## Cargas {#loads}

| Carga | Dirección positiva |
| --- | --- |
| `Fx`, `fx`, `f1x`… | +x (derecha; o según el x local del elemento con LCS activado) |
| `Fz`, `fz`, `f1z`… | +z (**abajo**; o según el z local con LCS activado) |
| `My` | antihorario en pantalla |
| `ΔTc` | calentamiento (alargamiento) |
| `ΔTb − ΔTt` | fibra inferior más caliente que la superior |

Así, una carga gravitatoria es un `fz` **positivo**, y un viento que empuja un pilar izquierdo hacia la derecha es un `fx` positivo.

## Ejes locales del elemento {#element-local-axes}

El **x** local va del nodo inicial al nodo final; el **z** local es perpendicular a él y se obtiene girando los ejes globales el ángulo del elemento $\alpha$. En un elemento horizontal dibujado de izquierda a derecha, los ejes locales y globales coinciden. Usa **Intercambiar nodos** en la tabla *Elementos* para invertir la dirección.

## Esfuerzos {#internal-forces}

| Magnitud | Positivo significa |
| --- | --- |
| **N** | tracción |
| **V<sub>z</sub>** | el signo habitual de la teoría de vigas: en una viga biapoyada con carga gravitatoria, V es positivo en el apoyo izquierdo y negativo en el derecho |
| **M<sub>y</sub>** | **tracción en la fibra inferior** (+z). Una viga biapoyada con carga gravitatoria tiene un momento positivo en el centro del vano; un voladizo con carga en el extremo tiene un momento negativo en el empotramiento |

## Fuerzas en extremos (tabla Resultados de elementos) {#end-forces-element-results-table}

`X12, Z12, M12` actúan sobre el elemento en su nodo inicial, `X21, Z21, M21` en su nodo final, en el sistema **local**, con las mismas direcciones positivas que los ejes locales y `My`. Son las fuerzas que los nodos ejercen sobre el elemento, es decir, $\mathbf{f} = \mathbf{K}_l\,\mathbf{u}_l - \mathbf{f}_{eq}$, donde $\mathbf{f}_{eq}$ son las cargas nodales equivalentes de las cargas de elemento. La suma de las fuerzas en extremos de todos los elementos que concurren en un nodo equilibra las cargas nodales y las reacciones en ese nodo.

## Reacciones {#reactions}

Existe una reacción por cada grado de libertad restringido y se da en el sistema de coordenadas del nodo (girado el ángulo del SCL nodal si se ha definido). Las flechas de reacción en el visor apuntan en la dirección en que el apoyo empuja a la estructura.

## Ejes con y hacia arriba {#y-up-axes}

**Configuración → Sistema de coordenadas → x a la derecha, y hacia arriba** pasa todo lo que escribes y lees al sistema de los libros de texto: **x** a la derecha, **y** hacia arriba y **z** hacia el observador. El modelo, los archivos guardados y el dibujo no cambian; solo cambian los números y los nombres:

| Magnitud | z hacia abajo (predeterminado) | y hacia arriba |
| --- | --- | --- |
| Coordenada vertical | `Z` | `Y`, signo opuesto |
| Cargas, desplazamientos, reacciones y fuerzas de extremo verticales | `Fz`, `fz`, `Dz`, `Z12`… | `Fy`, `fy`, `Dy`, `Y12`…, signo opuesto |
| Giros y momentos | `Ry`, `My` | `Rz`, `Mz`, mismo signo (positivo antihorario) |
| Ángulo del apoyo α | medido en sentido horario | medido en sentido antihorario, signo opuesto |
| Esfuerzos N, V, M | | sin cambios, los diagramas se dibujan igual |

Así, una carga gravitatoria es un `fy` **negativo**, y la cabeza de un pilar de 3 m tiene `Y = 3`.

## Unidades {#units}

El solver trabaja internamente en SI (m, N, Pa, rad, K). Las unidades de visualización solo afectan a lo que escribes y lees; cambiarlas nunca modifica el modelo.
