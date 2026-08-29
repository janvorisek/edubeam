# Cargas

Todas las cargas pertenecen a un **único caso de carga** y actúan simultáneamente. Para comparar escenarios, guarda cada uno como archivo de proyecto o enlace propio.

<LoadShowcase />

## El convenio de signos en una línea

El eje global **x** apunta a la derecha y el eje global **z** apunta **hacia abajo**. Un `Fz` o `fz` positivo en coordenadas globales es, por tanto, una carga hacia abajo (tipo gravedad); un momento `My` positivo gira en sentido antihorario en pantalla. Detalles en [Sistema de coordenadas y convenio de signos](/es/elements/conventions).

## Cargas nodales

Pestaña *Cargas* → **Añadir carga nodal**, o clic en un nodo → **Añadir carga**. Elige **Fuerza/Momento**:

| Campo | Significado | Unidad |
| --- | --- | --- |
| `Fx` | fuerza horizontal (+ → derecha) | unidad de fuerza |
| `Fz` | fuerza vertical (+ → abajo) | unidad de fuerza |
| `My` | momento alrededor de y | unidad de momento |

Las componentes están siempre en el sistema de coordenadas **global**. Una vista previa con flecha en el diálogo muestra la dirección y magnitud resultantes. Se permiten varias cargas nodales en un mismo nodo; simplemente se suman.

### Desplazamientos impuestos (asientos de apoyo)

En el mismo diálogo elige **Desplazamiento impuesto** (o clic en un nodo apoyado → **Imponer desplazamiento**). Los campos pasan a ser:

| Campo | Significado | Unidad |
| --- | --- | --- |
| `Dx` | desplazamiento horizontal impuesto | unidad de longitud |
| `Dz` | desplazamiento vertical impuesto (+ → abajo) | unidad de longitud |
| `Ry` | giro impuesto | rad |

Solo se puede introducir un valor en un grado de libertad **restringido** en ese nodo: solo los apoyos se pueden mover. Cada nodo admite un desplazamiento impuesto; edítalo en lugar de añadir un segundo. En una estructura isostática un asiento produce desplazamientos pero no esfuerzos; en una hiperestática produce ambos.

## Cargas de elemento

Pestaña *Cargas* → **Añadir carga de elemento**, o clic en un elemento → **Añadir carga**. Elige el **Tipo de carga**; el diálogo muestra una vista previa de la carga sobre el elemento.

### Carga uniformemente distribuida

| Campo | Significado | Unidad |
| --- | --- | --- |
| `fx` | carga por unidad de longitud según x | fuerza / longitud |
| `fz` | carga por unidad de longitud según z | fuerza / longitud |
| **LCS** | marca para interpretar `fx`, `fz` en los ejes locales del elemento | – |

El caso más frecuente es una carga vertical gravitatoria: `fz > 0`, LCS desactivado. En una barra inclinada, una carga **perpendicular a la barra** (p. ej. viento sobre un par de cubierta) es `fz` con LCS **activado**; una carga vertical por metro de *proyección horizontal* no está disponible directamente: conviértela antes a metro de longitud de barra.

### Carga trapezoidal

| Campo | Significado |
| --- | --- |
| `f1x`, `f1z` | intensidad en el nodo **inicial** |
| `f2x`, `f2z` | intensidad en el nodo **final** |

Las intensidades varían linealmente entre los extremos. Una carga triangular es simplemente `f1z = 0`. Las cargas trapezoidales están siempre en el **sistema local del elemento** (la casilla LCS está bloqueada); en barras horizontales el z local y el global coinciden, así que solo importa en barras inclinadas.

### Carga concentrada

Una fuerza o momento puntual en cualquier punto **a lo largo** del elemento, sin nodo adicional.

| Campo | Significado |
| --- | --- |
| `Fx`, `Fz`, `My` | componentes de fuerza / momento |
| **Posición de carga desde el nodo inicial** | distancia desde el nodo inicial, `0 ≤ a ≤ L` |
| **LCS** | componentes en ejes locales |

El diagrama de cortantes salta `Fz` en el punto de aplicación y el de flectores presenta un quiebro; el valor del momento allí se etiqueta automáticamente.

### Carga térmica

| Campo | Significado |
| --- | --- |
| **ΔT<sub>s</sub>** – cambio térmico axial | variación uniforme en toda la sección → alargamiento $\alpha\,\Delta T_s\,L$ |
| **ΔT<sub>b</sub> − ΔT<sub>t</sub>** – fibra inferior menos superior | diferencia de temperatura en el canto → curvatura $\alpha\,(\Delta T_b - \Delta T_t)/h$ |

Las cargas térmicas usan el **α** del material y la **altura h** de la sección. Un `ΔTb − ΔTt` positivo (fibra inferior más caliente) hace que el elemento se curve hacia arriba. En una estructura isostática la temperatura solo produce desplazamientos; la coacción (extremos empotrados, continuidad, barras redundantes) la convierte en esfuerzos.

## Editar y eliminar cargas

- Las cargas aparecen como etiquetas en las tablas *Nodos* / *Elementos* y como filas en la pestaña *Cargas*, donde las componentes (y la casilla LCS) se editan directamente.
- **Doble clic** en una carga del visor, o clic y **Editar carga**, abre el diálogo de edición.
- Selecciona una carga y pulsa <kbd>Supr</kbd>, o usa el icono de papelera.
- Las cargas asociadas a un nodo o elemento se eliminan con él y se copian con él al copiar y pegar.

## Lo que no está disponible

- **Casos y combinaciones de carga**: un solo caso.
- **Peso propio**: introdúcelo como carga uniforme $f_z = \rho\,g\,A$ (p. ej. IPE 200: 7850 × 9,81 × 0,00285 ≈ 0,22 kN/m).
- **Cargas trapezoidales en coordenadas globales** sobre barras inclinadas.
