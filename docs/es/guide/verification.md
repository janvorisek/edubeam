# Comprobar resultados a mano

<Edubeam /> es un buen lugar para practicar el hábito que todo ingeniero necesita: no fiarse nunca de un número que no se puede reproducir, al menos aproximadamente. Esta página da fórmulas cerradas para los casos clásicos y muestra lo que la aplicación devuelve para ellos, de modo que puedas construir cada modelo y comparar.

Todos los casos usan la misma sección de acero salvo que se indique lo contrario: $E = 210\,000$ MPa, $G = 81\,000$ MPa, $A = 28{,}5$ cm², $I_y = 1943$ cm⁴, $h = 200$ mm, $k = 1$ (un IPE 200).

$$EI = 210 \times 10^9 \cdot 1{,}943 \times 10^{-5} = 4{,}080 \times 10^6\ \text{Nm}^2$$

::: tip Por qué los números difieren ligeramente
EduBeam usa vigas de **Timoshenko**, que añaden una flecha por cortante $\Delta w_s$ a la flecha por flexión clásica de Euler–Bernoulli. Giros, reacciones y esfuerzos no cambian en los casos isostáticos. En barras esbeltas el término extra es minúsculo; las tablas siguientes lo muestran explícitamente.
:::

## Viga biapoyada con carga uniforme

$L = 6$ m, $q = 12$ kN/m. Apoyos: nodo 1 `Dx + Dz`, nodo 2 `Dz`.

| Magnitud | Fórmula | Valor | EduBeam |
| --- | --- | --- | --- |
| Reacciones | $qL/2$ | 36 kN | 36 kN |
| $V_{max}$ | $qL/2$ | 36 kN | 36 kN |
| $M_{max}$ (centro del vano) | $qL^2/8$ | 54 kNm | 54 kNm |
| Giro en el apoyo | $qL^3/(24EI)$ | 0,02647 rad | 0,02647 rad |
| Flecha en el centro | $5qL^4/(384EI)$ | 49,63 mm | 49,63 mm |

<ExampleStructure />

## Ménsula con carga en el extremo

$L = 4$ m, $F = 18$ kN hacia abajo en el extremo libre. Apoyo: nodo 1 `Dx + Dz + Ry`.

| Magnitud | Fórmula | Valor | EduBeam |
| --- | --- | --- | --- |
| Reacción vertical | $F$ | 18 kN | 18 kN |
| Momento de empotramiento | $FL$ | 72 kNm | 72 kNm |
| Giro en el extremo | $FL^2/(2EI)$ | 0,03529 rad | 0,03529 rad |
| Flecha en el extremo (flexión) | $FL^3/(3EI)$ | 94,11 mm | — |
| Flecha en el extremo (cortante) | $FL/(kGA)$ | 0,31 mm | — |
| Flecha en el extremo (total) | suma | 94,42 mm | 94,42 mm |

El término de cortante es aquí un 0,3 %. Acorta la ménsula a 1 m y pasa a ser un 5 %: para eso existe el coeficiente de cortante.

<Figure>
  <Structure :show-loads="true" show-moment show-reactions :nodes="[{label: '1', coords: [0,0,0], dofs: [0,2,4]}, {label: '2', coords: [4,0,0], dofs: []}]" :elements="[{label: '1', nodes: ['1', '2']}]" :nodal-loads="[{target: '2', values: { 0: 0, 2: 18000, 4: 0 }}]" />
  <figcaption>Ménsula con 18 kN en el extremo: momento flector y reacciones</figcaption>
</Figure>

## Viga biempotrada con carga uniforme

$L = 6$ m, $q = 12$ kN/m. Ambos nodos `Dx + Dz + Ry`.

| Magnitud | Fórmula | Valor |
| --- | --- | --- |
| Reacciones | $qL/2$ | 36 kN |
| Momento de empotramiento | $qL^2/12$ | 36 kNm (negativo, tracción arriba) |
| Momento en el centro | $qL^2/24$ | 18 kNm (positivo) |
| Flecha en el centro | $qL^4/(384EI)$ | 9,93 mm |

Constrúyela a partir de la biapoyada marcando `Ry` en ambos nodos y observa cómo se desplaza el diagrama de momentos.

## Viga empotrada-apoyada con carga uniforme

$L = 6$ m, $q = 12$ kN/m. Nodo 1 `Dx + Dz + Ry`, nodo 2 `Dz`.

| Magnitud | Fórmula | Valor |
| --- | --- | --- |
| Reacción en el empotramiento | $5qL/8$ | 45 kN |
| Reacción en el apoyo deslizante | $3qL/8$ | 27 kN |
| Momento de empotramiento | $qL^2/8$ | 54 kNm (negativo) |
| Momento positivo máximo | $9qL^2/128$ en $x = 5L/8$ desde el empotramiento | 30,4 kNm en 3,75 m |

La aplicación etiqueta el extremo local automáticamente, así que puedes leer tanto el valor como (por la posición en el elemento) dónde ocurre.

## Celosía de dos barras

Dos barras desde apoyos fijos en `(0, 0)` y `(4, 0)` que se unen en `(2, −2)` (vértice 2 m por encima), ambas con **las dos rótulas de extremo** marcadas, carga vertical $F = 20$ kN en el vértice (hacia abajo, es decir, `Fz = 20`).

Cada barra está a 45°, longitud $L = 2\sqrt{2}$ m. Por simetría, cada una soporta

$$N = -\frac{F}{2 \sin 45^\circ} = -14{,}14\ \text{kN (compresión)}$$

y cada apoyo recibe 10 kN verticales y ±10 kN horizontales. Comprueba la capa **N (x)** y las reacciones.

## Gradiente térmico en una viga biapoyada

$L = 8$ m, $\Delta T_b - \Delta T_t = -10$ K (fibra superior más caliente), $\alpha = 12 \times 10^{-6}$, $h = 0{,}2$ m.

La viga es libre de curvarse, así que **no hay esfuerzos**; la curvatura es

$$\kappa = \frac{\alpha\,(\Delta T_b - \Delta T_t)}{h} = \frac{12 \times 10^{-6} \cdot (-10)}{0{,}2} = -6 \times 10^{-4}\ \text{m}^{-1}$$

y la flecha en el centro es $\kappa L^2 / 8 = -4{,}8$ mm (hacia arriba). Restringe ahora `Ry` en ambos extremos: la curvatura queda impedida y aparece un momento constante $M = EI\kappa = 2{,}45$ kNm en todo el vano.

## Desplazamiento impuesto

Toma la [viga empotrada-apoyada](#viga-empotrada-apoyada-con-carga-uniforme) sin carga e impón `Dz = 10 mm` en el apoyo deslizante (un asiento). La reacción necesaria para bajar $w$ el extremo de una ménsula es $R = 3EIw/L^3 = 0{,}567$ kN y el momento de empotramiento es $RL = 3{,}40$ kNm. Vuelve a añadir la carga uniforme y los resultados se superponen linealmente.

## Consejos para tus propias comprobaciones

- Ten a la vista la **etiqueta de unidades**; la mayoría de las discrepancias son deslices de unidades.
- Usa la ventana **Matriz de rigidez** para comparar un solo elemento con el [manual teórico](/es/elements/beam) cuando estudies el método de la rigidez.
- Lee los valores exactos en la pestaña **Resultados** y en los tooltips, no en las etiquetas de los diagramas, que están redondeadas.
- Entrega un modelo comprobado a un compañero o profesor con **Compartir modelo**.
