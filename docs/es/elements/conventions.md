# Sistema de coordenadas y convenio de signos

La mayoría de los resultados «erróneos» en <Edubeam /> son en realidad una sorpresa del convenio de signos. Lo que sigue es exactamente lo que usa el solver.

## Ejes globales

- **x**: horizontal, positivo hacia la **derecha**.
- **z**: vertical, positivo **hacia abajo** en pantalla.
- **y**: el eje perpendicular al plano (apunta hacia el observador en un sistema dextrógiro). Los giros y momentos son alrededor de y.

El indicador de ejes en la esquina de la cuadrícula muestra x (rojo) y z (verde). Un nodo en la cabeza de un pilar de 3 m tiene, por tanto, `Z = −3` si la base está en `Z = 0`.

## Grados de libertad

Cada nodo tiene `Dx`, `Dz` (traslaciones) y `Ry` (giro). Un `Dz` positivo es un desplazamiento hacia abajo; un `Ry` positivo es un giro **antihorario** en pantalla. Los mismos signos se aplican a los desplazamientos impuestos y a los resultados nodales.

## Cargas

| Carga | Dirección positiva |
| --- | --- |
| `Fx`, `fx`, `f1x`… | +x (derecha; o el x local del elemento con LCS activado) |
| `Fz`, `fz`, `f1z`… | +z (**abajo**; o el z local con LCS activado) |
| `My` | antihorario en pantalla |
| `ΔTs` | calentamiento (alargamiento) |
| `ΔTb − ΔTt` | fibra inferior más caliente que la superior |

Así, una carga gravitatoria es un `fz` **positivo**, y un viento que empuja un pilar izquierdo hacia la derecha es un `fx` positivo.

## Ejes locales del elemento

El **x** local va del nodo inicial al nodo final; el **z** local es perpendicular a él y se obtiene girando los ejes globales el ángulo del elemento $\alpha$. En un elemento horizontal dibujado de izquierda a derecha, los ejes locales y globales coinciden. Usa **Intercambiar nodos** en la tabla *Elementos* para invertir la dirección.

## Esfuerzos

| Magnitud | Positivo significa |
| --- | --- |
| **N** | tracción |
| **V<sub>z</sub>** | el signo habitual de la teoría de vigas: en una viga biapoyada con carga gravitatoria, V es positivo en el apoyo izquierdo y negativo en el derecho |
| **M<sub>y</sub>** | **tracción en la fibra inferior (+z)**. Una viga biapoyada con carga gravitatoria tiene momento positivo en el centro; una ménsula con carga en el extremo tiene momento negativo en el empotramiento |

## Fuerzas en extremos (tabla Resultados de elementos)

`X12, Z12, M12` actúan sobre el elemento en su nodo inicial, `X21, Z21, M21` en su nodo final, en el sistema **local**, con las mismas direcciones positivas que los ejes locales y `My`. Son las fuerzas que los nodos ejercen sobre el elemento, es decir, $\mathbf{f} = \mathbf{K}_l\,\mathbf{u}_l - \mathbf{f}_{eq}$, donde $\mathbf{f}_{eq}$ son las cargas nodales equivalentes de las cargas de elemento. La suma de las fuerzas en extremos de todos los elementos que concurren en un nodo equilibra las cargas nodales y reacciones en él.

## Reacciones

Hay una reacción por cada grado de libertad restringido y se da en el sistema de coordenadas del nodo (girado el ángulo del SCL nodal si se ha definido). Las flechas de reacción en el visor apuntan en la dirección en que el apoyo empuja a la estructura.

## Unidades

El solver trabaja internamente en SI (m, N, Pa, rad, K). Las unidades de visualización solo afectan a lo que escribes y lees; cambiarlas nunca modifica el modelo.
