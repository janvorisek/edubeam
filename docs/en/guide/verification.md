# Checking results by hand

<Edubeam /> is a good place to practise the habit every engineer needs: never trust a number you cannot roughly reproduce. This page gives closed-form formulas for the classic cases and shows what the app reports for them, so you can build each model yourself and compare.

All cases use the same steel section unless stated: $E = 210\,000$ MPa, $G = 81\,000$ MPa, $A = 28.5$ cm², $I_y = 1943$ cm⁴, $h = 200$ mm, $k = 1$ (an IPE 200).

$$EI = 210 \times 10^9 \cdot 1.943 \times 10^{-5} = 4.080 \times 10^6\ \text{Nm}^2$$

::: tip Why the numbers differ slightly
EduBeam uses **Timoshenko** beams, which add a shear deflection $\Delta w_s$ to the classic Euler–Bernoulli bending deflection. Rotations, reactions and internal forces are unaffected in statically determinate cases. For slender members the extra term is tiny; the tables below show it explicitly.
:::

## Simply supported beam, uniform load

$L = 6$ m, $q = 12$ kN/m. Supports: node 1 `Dx + Dz`, node 2 `Dz`.

| Quantity | Formula | Value | EduBeam |
| --- | --- | --- | --- |
| Reactions | $qL/2$ | 36 kN | 36 kN |
| $V_{max}$ | $qL/2$ | 36 kN | 36 kN |
| $M_{max}$ (mid-span) | $qL^2/8$ | 54 kNm | 54 kNm |
| End rotation | $qL^3/(24EI)$ | 0.02647 rad | 0.02647 rad |
| Mid-span deflection | $5qL^4/(384EI)$ | 49.63 mm | 49.63 mm |

<ExampleStructure />

## Cantilever, tip load

$L = 4$ m, $F = 18$ kN downward at the free end. Support: node 1 `Dx + Dz + Ry`.

| Quantity | Formula | Value | EduBeam |
| --- | --- | --- | --- |
| Vertical reaction | $F$ | 18 kN | 18 kN |
| Fixing moment | $FL$ | 72 kNm | 72 kNm |
| Tip rotation | $FL^2/(2EI)$ | 0.03529 rad | 0.03529 rad |
| Tip deflection (bending) | $FL^3/(3EI)$ | 94.11 mm | — |
| Tip deflection (shear) | $FL/(kGA)$ | 0.31 mm | — |
| Tip deflection (total) | sum | 94.42 mm | 94.42 mm |

The shear term is 0.3 % here. Shorten the cantilever to 1 m and it becomes 5 %—that is what the shear coefficient is for.

<Figure>
  <Structure :show-loads="true" show-moment show-reactions :nodes="[{label: '1', coords: [0,0,0], dofs: [0,2,4]}, {label: '2', coords: [4,0,0], dofs: []}]" :elements="[{label: '1', nodes: ['1', '2']}]" :nodal-loads="[{target: '2', values: { 0: 0, 2: 18000, 4: 0 }}]" />
  <figcaption>Cantilever with 18 kN tip load: bending moment and reactions</figcaption>
</Figure>

## Fixed–fixed beam, uniform load

$L = 6$ m, $q = 12$ kN/m. Both nodes `Dx + Dz + Ry`.

| Quantity | Formula | Value |
| --- | --- | --- |
| Reactions | $qL/2$ | 36 kN |
| Support moment | $qL^2/12$ | 36 kNm (hogging) |
| Mid-span moment | $qL^2/24$ | 18 kNm (sagging) |
| Mid-span deflection | $qL^4/(384EI)$ | 9.93 mm |

Build it from the simply supported case by ticking `Ry` at both nodes and watch the moment diagram shift.

## Propped cantilever, uniform load

$L = 6$ m, $q = 12$ kN/m. Node 1 `Dx + Dz + Ry`, node 2 `Dz`.

| Quantity | Formula | Value |
| --- | --- | --- |
| Reaction at the fixed end | $5qL/8$ | 45 kN |
| Reaction at the roller | $3qL/8$ | 27 kN |
| Fixing moment | $qL^2/8$ | 54 kNm (hogging) |
| Max sagging moment | $9qL^2/128$ at $x = 5L/8$ from the fixed end | 30.4 kNm at 3.75 m |

The app labels the local extreme automatically, so you can read off both the value and (from the position along the element) where it occurs.

## Two-bar truss

Two bars from a pinned support at `(0, 0)` and `(4, 0)` meeting at `(2, −2)` (apex 2 m above), both **end hinges** ticked on both bars, vertical load $F = 20$ kN at the apex (downward, i.e. `Fz = 20`).

Each bar is at 45°, length $L = 2\sqrt{2}$ m. By symmetry each carries

$$N = -\frac{F}{2 \sin 45^\circ} = -14.14\ \text{kN (compression)}$$

and the supports each take 10 kN vertically and ±10 kN horizontally. Check the **N (x)** overlay and the reactions.

## Temperature gradient on a simply supported beam

$L = 8$ m, $\Delta T_b - \Delta T_t = -10$ K (top warmer), $\alpha = 12 \times 10^{-6}$, $h = 0.2$ m.

The beam is free to curve, so there are **no internal forces**; the curvature is

$$\kappa = \frac{\alpha\,(\Delta T_b - \Delta T_t)}{h} = \frac{12 \times 10^{-6} \cdot (-10)}{0.2} = -6 \times 10^{-4}\ \text{m}^{-1}$$

and the mid-span deflection is $\kappa L^2 / 8 = -4.8$ mm (upward). Now restrain `Ry` at both ends: the curvature is blocked and a constant moment $M = EI\kappa = 2.45$ kNm appears along the whole span.

## Prescribed displacement

Take the [propped cantilever](#propped-cantilever-uniform-load) without the load and prescribe `Dz = 10 mm` at the roller (a settlement). The reaction needed to push the tip of a cantilever down by $w$ is $R = 3EIw/L^3 = 0.567$ kN and the fixing moment is $RL = 3.40$ kNm. Add the uniform load back and the results superpose linearly.

## Tips for your own checks

- Keep the **units chip** in view; most discrepancies are unit slips.
- Use the **Stiffness matrix** window to compare a single element with the [theory manual](/elements/beam) when learning the direct stiffness method.
- Read exact numbers from the **Results** tab and hover tooltips rather than from the diagram labels, which are rounded.
- Use **Share model** to hand a checked model to a colleague or teacher.
