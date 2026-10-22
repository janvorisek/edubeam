# Comprobar resultados a mano

<Edubeam /> es un buen lugar para practicar el hábito que todo ingeniero necesita: no fiarse nunca de un número que no se puede reproducir, al menos aproximadamente. Esta página da fórmulas cerradas para los casos clásicos y muestra lo que la aplicación devuelve para ellos, de modo que puedas construir cada modelo y comparar.

Para ejemplos resueltos completos con comprobaciones a mano, consulta los tutoriales del [pórtico triarticulado](/es/tutorials/three-hinged-frame) y de la [celosía plana](/es/tutorials/truss).

Todos los casos usan la misma sección de acero salvo que se indique lo contrario: $E = 210\,000$ MPa, $G = 81\,000$ MPa, $A = 28{,}5$ cm², $I_y = 1943$ cm⁴, $h = 200$ mm, $k = 1$ (un IPE 200).

$$EI = 210 \times 10^9 \cdot 1{,}943 \times 10^{-5} = 4{,}080 \times 10^6\ \text{Nm}^2$$

::: tip Por qué los números difieren ligeramente
EduBeam usa vigas de **Timoshenko**, que añaden una flecha por cortante $\Delta w_s$ a la flecha por flexión clásica de Euler–Bernoulli. Los giros, las reacciones y los esfuerzos no cambian en los casos isostáticos. En barras esbeltas el término adicional es minúsculo; las tablas siguientes lo muestran explícitamente.
:::

## Viga biapoyada con carga uniforme {#simply-supported-beam-uniform-load}

$L = 6$ m, $q = 12$ kN/m. Apoyos: nodo 1 `Dx + Dz`, nodo 2 `Dz`.

| Magnitud | Fórmula | Valor | EduBeam |
| --- | --- | --- | --- |
| Reacciones | $qL/2$ | 36 kN | 36 kN |
| $V_{max}$ | $qL/2$ | 36 kN | 36 kN |
| $M_{max}$ (centro del vano) | $qL^2/8$ | 54 kNm | 54 kNm |
| Giro en el apoyo | $qL^3/(24EI)$ | 0,02647 rad | 0,02647 rad |
| Flecha en el centro del vano (flexión) | $5qL^4/(384EI)$ | 49,63 mm | — |
| Flecha en el centro del vano (cortante) | $qL^2/(8kGA)$ | 0,23 mm | — |
| Flecha en el centro del vano (total) | suma | 49,86 mm | 49,86 mm |

Para leer la flecha en el centro del vano, añade allí un nodo con *Añadir nodo* (con el ratón) → **Conectar a la estructura**; dividir el elemento no cambia ningún resultado.

<ExampleStructure />

## Voladizo con carga en el extremo {#cantilever-tip-load}

$L = 4$ m, $F = 18$ kN hacia abajo en el extremo libre. Apoyo: nodo 1 `Dx + Dz + Ry`.

| Magnitud | Fórmula | Valor | EduBeam |
| --- | --- | --- | --- |
| Reacción vertical | $F$ | 18 kN | 18 kN |
| Momento de empotramiento | $FL$ | 72 kNm | 72 kNm |
| Giro en el extremo | $FL^2/(2EI)$ | 0,03529 rad | 0,03529 rad |
| Flecha en el extremo (flexión) | $FL^3/(3EI)$ | 94,11 mm | — |
| Flecha en el extremo (cortante) | $FL/(kGA)$ | 0,31 mm | — |
| Flecha en el extremo (total) | suma | 94,42 mm | 94,42 mm |

Aquí el término de cortante es un 0,3 %. Acorta el voladizo a 1 m y pasa a ser un 5 %: para eso sirve el coeficiente de cortante.

<Figure>
  <Structure :show-loads="true" show-moment show-reactions :nodes="[{label: '1', coords: [0,0,0], dofs: [0,2,4]}, {label: '2', coords: [4,0,0], dofs: []}]" :elements="[{label: '1', nodes: ['1', '2']}]" :nodal-loads="[{target: '2', values: { 0: 0, 2: 18000, 4: 0 }}]" />
  <figcaption>Voladizo con 18 kN en el extremo: momento flector y reacciones</figcaption>
</Figure>

## Viga biempotrada con carga uniforme {#fixed–fixed-beam-uniform-load}

$L = 6$ m, $q = 12$ kN/m. Ambos nodos `Dx + Dz + Ry`.

| Magnitud | Fórmula | Valor |
| --- | --- | --- |
| Reacciones | $qL/2$ | 36 kN |
| Momento en el apoyo | $qL^2/12$ | 36 kNm (negativo) |
| Momento en el centro del vano | $qL^2/24$ | 18 kNm (positivo) |
| Flecha en el centro del vano | $qL^4/(384EI) + qL^2/(8kGA)$ | 9,93 + 0,23 = 10,16 mm |

Constrúyela a partir del caso biapoyado marcando `Ry` en ambos nodos y observa cómo se desplaza el diagrama de momentos.

## Viga empotrada-apoyada con carga uniforme {#propped-cantilever-uniform-load}

$L = 6$ m, $q = 12$ kN/m. Nodo 1 `Dx + Dz + Ry`, nodo 2 `Dz`.

| Magnitud | Fórmula | Valor |
| --- | --- | --- |
| Reacción en el empotramiento | $5qL/8$ | 45 kN |
| Reacción en el rodillo | $3qL/8$ | 27 kN |
| Momento de empotramiento | $qL^2/8$ | 54 kNm (negativo) |
| Momento positivo máximo | $9qL^2/128$ en $x = 5L/8$ desde el empotramiento | 30,4 kNm en 3,75 m |

La aplicación etiqueta automáticamente el extremo local, así que puedes leer tanto el valor como (por la posición a lo largo del elemento) dónde se produce.

## Celosía de dos barras {#two-bar-truss}

Dos barras desde apoyos articulados en `(0, 0)` y `(4, 0)` que se unen en `(2, −2)` (vértice 2 m más arriba), con las **rótulas de extremo** marcadas en ambos extremos de las dos barras, y una carga vertical $F = 20$ kN en el vértice (hacia abajo, es decir, `Fz = 20`).

Cada barra está a 45°, con longitud $L = 2\sqrt{2}$ m. Por simetría, cada una soporta

$$N = -\frac{F}{2 \sin 45^\circ} = -14{,}14\ \text{kN (compresión)}$$

y cada apoyo recibe 10 kN en vertical y ±10 kN en horizontal. Comprueba la capa **N (x)** y las reacciones.

## Gradiente térmico en una viga biapoyada {#temperature-gradient-on-a-simply-supported-beam}

$L = 8$ m, $\Delta T_b - \Delta T_t = -10$ K (fibra superior más caliente), $\alpha = 12 \times 10^{-6}$, $h = 0{,}2$ m.

La viga puede curvarse libremente, así que **no hay esfuerzos**; la curvatura es

$$\kappa = \frac{\alpha\,(\Delta T_b - \Delta T_t)}{h} = \frac{12 \times 10^{-6} \cdot (-10)}{0{,}2} = -6 \times 10^{-4}\ \text{m}^{-1}$$

y la flecha en el centro del vano es $\kappa L^2 / 8 = -4{,}8$ mm (hacia arriba). Restringe ahora `Ry` en ambos extremos: la curvatura queda impedida y aparece un momento constante $M = EI\kappa = 2{,}45$ kNm en todo el vano.

## Desplazamiento impuesto {#prescribed-displacement}

Toma la [viga empotrada-apoyada](#propped-cantilever-uniform-load) sin la carga e impón `Dz = 10 mm` en el rodillo (un asiento). La reacción necesaria para bajar una distancia $w$ el extremo de un voladizo es $R = 3EIw/L^3 = 0{,}567$ kN, y el momento de empotramiento es $RL = 3{,}40$ kNm. Vuelve a añadir la carga uniforme y los resultados se superponen linealmente.

## Consejos para tus propias comprobaciones {#tips-for-your-own-checks}

- Ten a la vista la **etiqueta de unidades**; la mayoría de las discrepancias son despistes de unidades.
- Usa la ventana **Matriz de rigidez** para comparar un solo elemento con el [manual teórico](/es/elements/beam) cuando estudies el método directo de la rigidez.
- Lee los valores exactos en la pestaña **Resultados** y en los tooltips, no en las etiquetas de los diagramas, que están redondeadas. **Exportar CSV** o **Copiar** en la pestaña Resultados también te dan las reacciones, listas para una hoja de cálculo.
- Pon el **Formato numérico** en *Automático* en Configuración para leer `40` en lugar de `4 · 10¹`.
- Usa **Compartir modelo** para pasar un modelo comprobado a un compañero o a un profesor.
