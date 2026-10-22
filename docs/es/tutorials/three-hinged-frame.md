# Tutorial: pórtico triarticulado

Un pórtico triarticulado es isostático: las tres ecuaciones de equilibrio más la condición $M = 0$ en la rótula dan las cuatro reacciones. Eso lo convierte en un modelo perfecto para comprobar cada número que dibuja EduBeam. Calcula unos 15 minutos.

![El pórtico terminado: momento flector y reacciones](/screenshots/es/tut-frame-moment.webp)

[Abre el modelo terminado](https://run.edubeam.app/?model=eyJuIjpbWyJBIixbMCwwLDBdLFswLDJdLG51bGxdLFsiQiIsWzAsMCwtNF0sW10sbnVsbF0sWyJDIixbNCwwLC00XSxbXSxudWxsXSxbIkQiLFs4LDAsLTRdLFtdLG51bGxdLFsiRSIsWzgsMCwwXSxbMCwyXSxudWxsXV0sImUiOltbIjEiLFsiQSIsIkIiXSwiMSIsIjEiLFtmYWxzZSxmYWxzZV1dLFsiMiIsWyJCIiwiQyJdLCIxIiwiMSIsW2ZhbHNlLHRydWVdXSxbIjMiLFsiQyIsIkQiXSwiMSIsIjEiLFtmYWxzZSxmYWxzZV1dLFsiNCIsWyJEIiwiRSJdLCIxIiwiMSIsW2ZhbHNlLGZhbHNlXV1dLCJtIjpbWyIxIiw3ODUwLDIxMDAwMDAwMDAwMCw4MTAwMDAwMDAwMCwwLjAwMDAxMl1dLCJjcyI6W1siMSIsMC4wMDUzOCwwLjAwMDA4MzU2LDAuMywxXV0sImVsIjpbWyIyIixbMCwxMDAwMF0sZmFsc2VdLFsiMyIsWzAsMTAwMDBdLGZhbHNlXV0sImQiOltdfQ%3D%3D&lang=es){target="_blank"} si solo quieres explorarlo.

## El problema {#the-problem}

- Dos pilares de 4 m, articulados en sus bases A y E, separados 8 m.
- Una viga horizontal B–D en la parte superior, con una rótula en el centro del vano, C.
- Una carga uniforme de $q = 10$ kN/m sobre toda la viga.
- Acero ($E = 210$ GPa, $G = 81$ GPa), IPE 300 ($A = 53{,}8$ cm², $I_y = 8356$ cm⁴, $h = 300$ mm).

| Nodo | X [m] | Z [m] | Apoyo |
| --- | --- | --- | --- |
| A | 0 | 0 | articulación |
| B | 0 | −4 | |
| C | 4 | −4 | (rótula en la viga) |
| D | 8 | −4 | |
| E | 8 | 0 | articulación |

Recuerda que **z apunta hacia abajo**, así que la cabeza de los pilares está en `Z = −4`.

## 1. Material y sección {#_1-material-and-section}

1. **Limpiar estructura** (marca *Eliminar materiales* y *Eliminar secciones*).
2. *Materiales* → **Biblioteca de materiales** → **Steel (S235)**.
3. *Secciones* → **Añadir sección**: `Área = 0,00538`, `Iy = 8,356e-5`, `Altura = 0,3`, `Coeficiente de cortante = 1`.

La sección solo influye en los desplazamientos. Este pórtico es isostático, así que sus esfuerzos no dependen en absoluto de $E$, $A$ ni $I$.

## 2. Dibuja el pórtico {#_2-draw-the-frame}

Lo más rápido es una única polilínea con el ratón:

1. Asegúrate de que **Ajustar a la cuadrícula** está activado (el botón **S**).
2. Pestaña *Elementos* → el segundo botón **Añadir elemento** (icono de cursor).
3. Haz clic en (0, 0), luego en (0, −4), (4, −4), (8, −4) y (8, 0). Fíjate en las reglas y en la cruceta para encontrar los puntos. Cada clic añade un nodo y lo une al anterior.
4. Pulsa <kbd>Esc</kbd> para terminar y luego <kbd>F</kbd> para ajustar el pórtico a la pantalla.

Ahora tienes cinco nodos y cuatro elementos. Las imágenes de esta página etiquetan los nodos como A–E; si quieres, renombra los tuyos en la tabla de *Nodos*, o deja 1–5. Comprueba las coordenadas en la tabla y corrige las que se hayan salido de la cuadrícula.

## 3. Apoyos y la rótula {#_3-supports-and-the-hinge}

1. Haz clic en el nodo A, abre **Apoyos del nodo** y elige la **Articulación**. Haz lo mismo con el nodo E.
2. En la tabla de *Elementos*, busca el elemento que va de B a C y marca su rótula **final** (la segunda casilla de *Rótulas de extremo*).

![La tabla de elementos: la rótula está al final del elemento 2, en el nodo C](/screenshots/es/elements-table.webp)

::: tip Una rótula, no dos
Articular el final del elemento B–C es suficiente: el momento en C es entonces cero, porque C–D no puede transmitir un momento a un nodo al que solo él está unido rígidamente. Si marcas también el inicio de C–D, no cambia nada. Pero si marcas también una rótula en B, el pórtico se convierte en un mecanismo. Pruébalo: EduBeam te muestra cómo se mueve.
:::

## 4. Carga {#_4-load}

*Cargas* → **Añadir carga de elemento** → *Carga uniformemente distribuida*, elemento B–C, `fz = 10` kN/m. Repite con el elemento C–D. La viga es horizontal, así que la casilla LCS no influye aquí.

## 5. Resultados {#_5-results}

Las opciones de visualización arrancan con la deformada, el momento flector y las reacciones activados. Marca **N (x)** y **V<sub>z</sub> (x)** para ver el resto.

<div class="shots">

![Momento flector y reacciones](/screenshots/es/tut-frame-moment.webp)

![Esfuerzo axil](/screenshots/es/tut-frame-normal.webp)

![Esfuerzo cortante](/screenshots/es/results-shear.webp)

![Deformada](/screenshots/es/results-deformed.webp)

</div>

## 6. Comprueba a mano {#_6-check-by-hand}

**Reacciones verticales.** Por simetría, cada base recibe la mitad de la carga:

$$V_A = V_E = \frac{q \cdot 8}{2} = 40\ \text{kN}$$

**Reacciones horizontales.** Toma momentos respecto a la rótula C para la mitad izquierda del pórtico. El momento allí debe ser cero:

$$V_A \cdot 4 - H_A \cdot 4 - q \cdot 4 \cdot 2 = 0 \quad\Rightarrow\quad H_A = \frac{160 - 80}{4} = 20\ \text{kN}$$

Ambas bases empujan hacia dentro con 20 kN; ese empuje horizontal es lo que hace eficiente a un pórtico triarticulado.

**Esfuerzos.**

| Magnitud | Fórmula | A mano | EduBeam |
| --- | --- | --- | --- |
| Reacciones verticales | $qL/2$ | 40 kN | 40 kN |
| Reacciones horizontales | de $M_C = 0$ | 20 kN | 20 kN |
| Momento en las esquinas B y D | $H \cdot h$ | 80 kNm, tracción por fuera | −80 kNm |
| Momento en la rótula C | | 0 | 0 |
| Axil en los pilares | $-V_A$ | −40 kN | −40 kN |
| Axil en la viga | $-H_A$ | −20 kN | −20 kN |
| Cortante en los pilares | $H_A$ | 20 kN | −20 kN (A–B), +20 kN (D–E) |
| Cortante en la viga en B | $V_A$ | 40 kN | 40 kN |
| Cortante en la viga en C | $V_A - 4q$ | 0 | 0 |
| Cortante en la viga en D | $V_A - 8q$ | −40 kN | −40 kN |

Los dos pilares tienen cortantes de signo opuesto aunque soportan la misma fuerza, porque los ejes locales de cada elemento siguen su dirección: A–B está dibujado hacia arriba y D–E hacia abajo. Intercambia los nodos de un pilar y su signo se invierte.

En la viga, $M(x) = -80 + 40x - 5x^2$ kNm (x medido desde B), que es cero en la rótula y nunca positivo: toda la viga trabaja a momento negativo. El cortante $V(x) = 40 - 10x$ se anula exactamente en C, así que el extremo del momento también está en la rótula.

**Desplazamiento.** La rótula C desciende 43,1 mm (*Resultados → Resultados nodales*, `Dz` de C). Se debe a la flexión de las cuatro barras y es un buen ejercicio para el principio de los trabajos virtuales.

## 7. Experimenta {#_7-experiment}

- **Desmarca la rótula** en C. El pórtico pasa a ser una vez hiperestático; los momentos en las esquinas bajan y aparece un momento positivo en el centro del vano. Ahora la sección sí importa: prueba con una viga más rígida.
- **Empotra las bases** (elige el apoyo **Empotramiento**). Aparecen momentos en A y E.
- **Añade una carga horizontal**: una carga nodal `Fx = 10` kN en B. El pórtico se desplaza lateralmente y las reacciones dejan de ser simétricas. Compruébalas con las mismas tres ecuaciones y $M_C = 0$.
- **Marca también una rótula en B**. El pórtico es ahora un mecanismo, y EduBeam anima cómo puede moverse.
