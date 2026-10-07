# Tutorial: celosía plana

Este tutorial construye una pequeña celosía isostática, comprueba los esfuerzos en sus barras con el método de los nudos y el método de las secciones, y encuentra una barra de esfuerzo nulo. Calcula unos 15 minutos.

![La celosía terminada: esfuerzos axiles y reacciones](/screenshots/es/tut-truss.webp)

[Abre el modelo terminado](https://run.edubeam.app/?model=eyJuIjpbWyIxIixbMCwwLDBdLFswLDJdLG51bGxdLFsiMiIsWzQsMCwwXSxbXSxudWxsXSxbIjMiLFs4LDAsMF0sW10sbnVsbF0sWyI0IixbMTIsMCwwXSxbMl0sbnVsbF0sWyI1IixbNCwwLC0zXSxbXSxudWxsXSxbIjYiLFs4LDAsLTNdLFtdLG51bGxdXSwiZSI6W1siMSIsWyIxIiwiMiJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiMiIsWyIyIiwiMyJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiMyIsWyIzIiwiNCJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiNCIsWyI1IiwiNiJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiNSIsWyIxIiwiNSJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiNiIsWyIyIiwiNSJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiNyIsWyI1IiwiMyJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiOCIsWyIzIiwiNiJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiOSIsWyI2IiwiNCJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dXSwibSI6W1siMSIsNzg1MCwyMTAwMDAwMDAwMDAsODEwMDAwMDAwMDAsMC4wMDAwMTJdXSwiY3MiOltbIjEiLDAuMDAyLDAuMDAwMDAxLDAuMSwxXV0sIm5sIjpbWyIyIix7IjAiOjAsIjIiOjMwMDAwLCI0IjowfV0sWyIzIix7IjAiOjAsIjIiOjMwMDAwLCI0IjowfV1dLCJkIjpbXX0%3D&lang=es){target="_blank"} si solo quieres explorarlo.

## El problema {#the-problem}

![Geometría, apoyos y cargas](/screenshots/es/tut-truss-model.webp)

- Una luz de 12 m en tres recuadros de 4 m, con 3 m de canto.
- Nodos del cordón inferior 1–4, nodos del cordón superior 5 y 6.
- Una articulación en el nodo 1 y un rodillo en el nodo 4.
- Dos cargas de 30 kN, en los nodos 2 y 3 del cordón inferior.
- Barras de acero con $A = 20$ cm².

| Nodo | X [m] | Z [m] | Apoyo | Carga |
| --- | --- | --- | --- | --- |
| 1 | 0 | 0 | articulación | |
| 2 | 4 | 0 | | `Fz = 30` kN |
| 3 | 8 | 0 | | `Fz = 30` kN |
| 4 | 12 | 0 | rodillo | |
| 5 | 4 | −3 | | |
| 6 | 8 | −3 | | |

Barras: cordón inferior 1–2, 2–3, 3–4; cordón superior 5–6; diagonales extremas 1–5 y 6–4; montantes 2–5 y 3–6; y la diagonal central 5–3.

**¿Es isostática?** $m + r = 9 + 3 = 12 = 2j$ con $j = 6$ nudos, así que sí: los esfuerzos en las barras se obtienen solo del equilibrio.

## 1. Material y sección {#_1-material-and-section}

1. **Limpiar estructura** (marca *Eliminar materiales* y *Eliminar secciones*).
2. *Materiales* → **Biblioteca de materiales** → **Steel (S235)**.
3. *Secciones* → **Añadir sección**: `Área = 0,002`, `Iy = 1e-6`, `Altura = 0,1`, `Coeficiente de cortante = 1`. Con barras articuladas, solo importa el área.

## 2. Dibuja las barras con rótulas {#_2-draw-the-bars-with-hinges}

En EduBeam, una barra de celosía es un elemento viga con **ambas rótulas de extremo** marcadas. La herramienta del ratón puede ponerlas por ti:

1. Pestaña *Elementos* → el segundo botón **Añadir elemento** (icono de cursor).
2. En la banda de la parte superior del visor, marca **Rótula al inicio** y **Rótula al final**. Cada barra que dibujes a partir de ahora tendrá ambas.
3. Dibuja el contorno como una única polilínea: haz clic en (0, 0), (4, −3), (8, −3), (12, 0) y luego vuelve por abajo: (8, 0), (4, 0), (0, 0). Pulsa <kbd>Esc</kbd>.
4. Dibuja las barras interiores una a una, pulsando <kbd>Esc</kbd> después de cada una: (4, 0) → (4, −3), (4, −3) → (8, 0), (8, 0) → (8, −3).
5. Pulsa <kbd>F</kbd> para ajustar a la pantalla.

Comprueba la tabla de *Elementos*: nueve elementos, todos con las dos *Rótulas de extremo* marcadas. Tus números de nodos y elementos pueden diferir de los de las imágenes; no importa.

## 3. Apoyos y cargas {#_3-supports-and-loads}

1. Haz clic en el nodo de (0, 0) → **Apoyos del nodo** → **Articulación**. Haz clic en el nodo de (12, 0) → **Rodillo**.
2. Haz clic en el nodo de (4, 0) → **Añadir carga** → `Fz = 30` kN. Haz lo mismo en (8, 0).

Un `Fz` positivo apunta hacia abajo. Los nudos de una celosía pueden girar libremente; EduBeam admite nodos en los que todas las barras están articuladas y da su giro como 0.

## 4. Resultados {#_4-results}

En las opciones de visualización, desmarca **Forma deformada** y **M<sub>y</sub> (x)** (en una celosía no hay flexión) y marca **N (x)**.

![Esfuerzos axiles: tracción positiva](/screenshots/es/tut-truss.webp)

## 5. Comprueba a mano {#_5-check-by-hand}

**Reacciones.** Las cargas son simétricas, así que $R_1 = R_4 = 30$ kN hacia arriba, y la reacción horizontal en la articulación es nula.

**Nudo 1** (método de los nudos). La diagonal extrema 1–5 mide 5 m ($\sin\alpha = 3/5$, $\cos\alpha = 4/5$):

$$\sum F_z:\ N_{15} \cdot \tfrac{3}{5} = -30 \Rightarrow N_{15} = -50\ \text{kN} \qquad \sum F_x:\ N_{12} = -N_{15} \cdot \tfrac{4}{5} = 40\ \text{kN}$$

**Nudo 2.** El montante 2–5 es la única barra que puede llevar hacia arriba la carga de 30 kN: $N_{25} = +30$ kN, y $N_{23} = N_{12} = 40$ kN.

**Sección por el recuadro central.** Corta las barras 5–6, 5–3 y 2–3 y quédate con la parte izquierda:

- Momentos respecto al nodo 3: $R_1 \cdot 8 - 30 \cdot 4 + N_{56} \cdot 3 = 0 \Rightarrow N_{56} = -40$ kN.
- Fuerzas verticales: el cortante en el recuadro es $R_1 - 30 = 0$, así que la diagonal **5–3 no trabaja**: $N_{53} = 0$.

| Barra | A mano | EduBeam |
| --- | --- | --- |
| Cordón inferior 1–2, 2–3, 3–4 | +40 kN (tracción) | 40 |
| Cordón superior 5–6 | −40 kN (compresión) | −40 |
| Diagonales extremas 1–5, 6–4 | −50 kN | −50 |
| Montantes 2–5, 3–6 | +30 kN | 30 |
| Diagonal central 5–3 | 0 | 0 |

La flecha del nodo 2 es de 2,29 mm (*Resultados → Resultados nodales*). Como ejercicio, calcúlala con trabajos virtuales, $\delta = \sum N n L / (EA)$.

## 6. Experimenta {#_6-experiment}

- **Mueve una carga.** Pon las dos cargas de 30 kN en el nodo 2. Ahora la diagonal central sí trabaja: ¿con qué signo y por qué?
- **Quita la diagonal central.** La celosía se convierte en un mecanismo; EduBeam rodea con un círculo las rótulas culpables y muestra cómo se deforma el recuadro por cortante.
- **Desmarca todas las rótulas.** La celosía pasa a ser un pórtico de nudos rígidos. Marca **M<sub>y</sub> (x)**: los momentos flectores son minúsculos comparados con los esfuerzos axiles, y por eso funciona la idealización de nudos articulados.
- **Articula ambos apoyos.** Una reacción más la hace hiperestática, y los esfuerzos del cordón inferior pasan a depender de las áreas de las barras.
