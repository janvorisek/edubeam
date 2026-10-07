# Cargas

Todas las cargas pertenecen a un **único caso de carga** y actúan simultáneamente. Para comparar escenarios, guarda cada uno como archivo de proyecto o como enlace para compartir.

![Todos los tipos de carga en una viga continua: una fuerza nodal, una carga uniforme, una carga trapezoidal, una carga puntual, una carga térmica y un asiento de apoyo](/screenshots/es/loads-overview.webp)

<LoadShowcase />

## El convenio de signos en una línea {#sign-convention-in-one-line}

El eje global **x** apunta a la derecha y el eje global **z** apunta **hacia abajo**. Por tanto, un `Fz` o `fz` positivo es una carga hacia abajo, de tipo gravitatorio, y un momento `My` positivo gira en sentido antihorario en pantalla. Los detalles están en [Sistema de coordenadas y convenio de signos](/es/elements/conventions). Con [ejes con y hacia arriba](/es/elements/conventions#y-up-axes), los nombres y signos verticales se invierten: la gravedad es un `Fy` negativo.

## Cargas nodales {#nodal-loads}

Pestaña *Cargas* → **Añadir carga nodal**, o haz clic en un nodo → **Añadir carga**. Elige **Fuerza/Momento**:

| Campo | Significado | Unidad |
| --- | --- | --- |
| `Fx` | fuerza horizontal (positiva hacia la derecha) | unidad de fuerza |
| `Fz` | fuerza vertical (positiva hacia abajo) | unidad de fuerza |
| `My` | momento alrededor de y (positivo en sentido antihorario) | unidad de momento |

![Añadir carga nodal. La vista previa muestra la dirección mientras escribes.](/screenshots/es/loads-nodal.webp){.shot-md}

Las componentes están siempre en el sistema de coordenadas **global**. Un nodo puede tener varias cargas nodales; se suman y se dibujan apiladas.

### Desplazamientos impuestos (asientos de apoyo) {#prescribed-displacements-support-settlements}

En el mismo diálogo elige **Desplazamiento impuesto**, o haz clic en un nodo con apoyo → **Imponer desplazamiento**. Los campos pasan a ser:

| Campo | Significado | Unidad |
| --- | --- | --- |
| `Dx` | desplazamiento horizontal impuesto | unidad de desplazamiento |
| `Dz` | desplazamiento vertical impuesto (positivo hacia abajo) | unidad de desplazamiento |
| `Ry` | giro impuesto | rad |

Solo puedes introducir un valor en un GDL que esté **restringido** en ese nodo, porque solo los apoyos se pueden mover. Cada nodo tiene como máximo un desplazamiento impuesto; edítalo en lugar de añadir un segundo. En una estructura isostática, un asiento produce desplazamientos pero no esfuerzos; en una hiperestática produce ambos.

## Cargas de elemento {#element-loads}

Pestaña *Cargas* → **Añadir carga de elemento**, o haz clic en un elemento → **Añadir carga**. Elige el **Tipo de carga**; el diálogo muestra una vista previa de la carga sobre el elemento mientras escribes.

### Carga uniformemente distribuida {#uniformly-distributed-load}

| Campo | Significado | Unidad |
| --- | --- | --- |
| `fx` | carga por unidad de longitud según x | fuerza / longitud |
| `fz` | carga por unidad de longitud según z | fuerza / longitud |
| **LCS** | marcado: `fx`, `fz` actúan según los ejes locales del elemento; desmarcado: según los ejes globales | – |

**LCS** está marcado por defecto. En un elemento horizontal dibujado de izquierda a derecha, los ejes locales y globales coinciden, así que no hay diferencia. En una barra inclinada sí la hay:

- una carga **perpendicular a la barra** (viento sobre un faldón de cubierta) es `fz` con LCS **marcado**;
- una carga **vertical** por metro de longitud de la barra (peso propio) es `fz` con LCS **desmarcado**;
- una carga vertical por metro de proyección *horizontal* (nieve) no está disponible directamente. Multiplícala antes por $\cos\alpha$, donde $\alpha$ es la inclinación de la barra, e introdúcela como carga vertical.

### Carga trapezoidal {#trapezoidal-load}

| Campo | Significado |
| --- | --- |
| `f1x`, `f1z` | intensidad en el nodo **inicial** |
| `f2x`, `f2z` | intensidad en el nodo **final** |

La intensidad varía linealmente del inicio al final del elemento. Una carga triangular tiene `f1z = 0`. Las cargas trapezoidales actúan siempre según los **ejes locales del elemento** (la casilla LCS está bloqueada); en un elemento horizontal eso equivale a los ejes globales.

### Carga concentrada {#concentrated-load}

Una fuerza o un momento puntual en cualquier punto **a lo largo** de un elemento, sin necesidad de un nodo adicional.

| Campo | Significado |
| --- | --- |
| `Fx`, `Fz`, `My` | componentes de fuerza y momento |
| **Posición de carga desde el nodo inicial** | distancia desde el nodo inicial, `0 ≤ a ≤ L` |
| **LCS** | componentes según los ejes locales |

El diagrama de cortantes salta `Fz` en el punto de la carga y el diagrama de momentos presenta allí un quiebro; el valor del momento en ese punto se etiqueta automáticamente. Un `My` concentrado hace saltar, en cambio, el diagrama de momentos.

### Carga térmica {#temperature-load}

| Campo | Significado |
| --- | --- |
| **ΔT<sub>c</sub>**, cambio térmico axial | variación uniforme en toda la sección, que produce un alargamiento $\alpha\,\Delta T_c\,L$ |
| **ΔT<sub>b</sub> − ΔT<sub>t</sub>**, diferencia de temperatura | fibra inferior menos fibra superior, que produce una curvatura $\alpha\,(\Delta T_b - \Delta T_t)/h$ |

Las cargas térmicas usan el **α** del material y la **altura h** de la sección. Un `ΔTb − ΔTt` positivo (más caliente abajo) alarga la fibra inferior, así que el elemento se flecta como una viga bajo carga gravitatoria. En una estructura isostática, la temperatura solo produce desplazamientos; las coacciones (extremos empotrados, continuidad, barras redundantes) la convierten en esfuerzos.

<div class="shots">

![Carga uniformemente distribuida](/screenshots/es/loads-udl.webp)

![Carga trapezoidal](/screenshots/es/loads-trapezoidal.webp)

![Carga concentrada](/screenshots/es/loads-concentrated.webp)

![Carga térmica](/screenshots/es/loads-temperature.webp)

</div>

## Editar y eliminar cargas {#editing-and-removing-loads}

- Cada carga es una fila de la pestaña *Cargas*, donde puedes editar directamente sus componentes y la marca LCS. Las cargas aparecen también como etiquetas en las tablas de *Nodos* y *Elementos*.
- **Haz doble clic** en una carga en el visor, o haz clic en ella y elige **Editar carga**, para abrir el diálogo de edición.
- Selecciona una carga y pulsa <kbd>Supr</kbd>, o usa la × de la tabla.
- Las cargas unidas a un nodo o elemento se eliminan con él, y se copian con él al copiar y pegar.

![La pestaña Cargas: una fila por carga, con sus componentes editables directamente](/screenshots/es/loads-table.webp)

## Qué no está disponible {#what-is-not-available}

- **Casos y combinaciones de carga.** Hay un único caso de carga.
- **Peso propio.** Introdúcelo como carga uniforme con LCS desmarcado: $f_z = \rho\,g\,A$. Para un IPE 200, 7850 × 9,81 × 0,00285 ≈ 0,22 kN/m.
- **Cargas trapezoidales en ejes globales** sobre barras inclinadas.
