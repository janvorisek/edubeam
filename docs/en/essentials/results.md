# Results & diagrams

<Edubeam /> solves the model automatically after every change (throttled to a few times per second), so results are always current. There is no *Solve* button. If nothing is drawn, the model is not solvable yet—see [Troubleshooting](/reference/troubleshooting).

## Overlays in the viewer

Switch them on and off in the **display settings panel** (⚙ button, top-right of the viewer).

| Overlay | Colour (default) | Notes |
| --- | --- | --- |
| **Deformed shape** | grey | Exaggerated; scaled so the largest displacement equals *Results scale* pixels. |
| **N (x)** – normal force | blue | Tension positive. Constant along an element unless an axial line load acts on it. |
| **V<sub>z</sub> (x)** – shear force | green | Linear under UDL, quadratic under trapezoidal loads, jumps at concentrated loads. |
| **M<sub>y</sub> (x)** – bending moment | red | Sagging positive (tension in the bottom fibre). Labelled at both ends, at concentrated loads and at every local extreme (where V = 0). |
| **Reactions** | purple | An arrow and value for every restrained DOF. |

Diagrams are drawn along the elements with their values written at the characteristic points. The label orientation and the scale of all plots can be changed in [Settings](/essentials/units-settings#viewer-settings).

### Normal force

<Figure>
    <Structure :show-loads="true" show-normal-force :nodes="[{label: 'a', coords: [0,0,0], dofs: [0,2, 4]}, {label: 'b', coords: [10,0,0], dofs: []}]" :elements="[{label: '1', nodes: ['a', 'b']}]" :nodal-loads="[{target: 'b', values: { 0: -100, 2: 0, 4: 0 }}]" />
    <figcaption>Cantilever compressed by a horizontal force at the free end: N is constant and negative</figcaption>
</Figure>

### Shear force

<Figure>
  <Structure :show-loads="true" show-shear-force :nodes="[{label: 'a', coords: [0,0,0], dofs: [0,2, 4]}, {label: 'b', coords: [10,0,0], dofs: []}]" :elements="[{label: '1', nodes: ['a', 'b']}]" :nodal-loads="[{target: 'b', values: { 0: 0, 2: 10, 4: 0 }}]" />
 <figcaption>Cantilever with a vertical tip load: V is constant</figcaption>
</Figure>

### Bending moment

<Figure>
  <Structure :show-loads="true" show-moment :nodes="[{label: 'a', coords: [0,0,0], dofs: [0,2, 4]}, {label: 'b', coords: [10,0,0], dofs: []}]" :elements="[{label: '1', nodes: ['a', 'b']}]" :nodal-loads="[{target: 'b', values: { 0: 0, 2: 10, 4: 0 }}]" />
 <figcaption>Same cantilever: M grows linearly to F·L at the fixed end</figcaption>
</Figure>

### Deformed shape

<Figure>
  <Structure :show-loads="true" show-deformed-shape :nodes="[{label: 'a', coords: [0,0,0], dofs: [0,2, 4]}, {label: 'b', coords: [10,0,0], dofs: []}]" :elements="[{label: '1', nodes: ['a', 'b']}]" :nodal-loads="[{target: 'b', values: { 0: 0, 2: 10, 4: 0 }}]" />
  <figcaption>Deformed shape (exaggerated) of the cantilever</figcaption>
</Figure>

### Reactions

<Structure :show-loads="true" show-reactions :nodes="[{label: 'a', coords: [0,0,0], dofs: [0,2, 4]}, {label: 'b', coords: [10,0,0], dofs: []}]" :elements="[{label: '1', nodes: ['a', 'b']}]" :nodal-loads="[{target: 'b', values: { 0: 0, 2: 10, 4: 0 }}]" />

## Hover tooltips

Hovering in the viewer is the fastest way to read a value:

- **Node** → `ux`, `uz`, `φy` (displacements in the length unit, rotation in radians).
- **Element** → its label, cross section and material.
- **Load** → its components.

## Results tab

The **Results** tab in the bottom bar has two views:

### Nodal results

One row per node with **Dx**, **Dz** (length unit) and **Ry** (rad). Signs follow the global axes: positive `Dz` is downward, positive `Ry` is counter-clockwise on screen.

<figure>

![Nodal results](/results_nodes.png)

</figure>

### Element results

One row per element with the **end forces in the element's local coordinate system**:

| Column | Meaning |
| --- | --- |
| `X12`, `Z12`, `M12` | axial force, shear force and moment acting on the element at its **start** node |
| `X21`, `Z21`, `M21` | the same at its **end** node |

These are the forces the nodes exert on the element (the element stiffness matrix times its end displacements, minus the equivalent nodal loads). For a simply supported 6 m beam under 12 kN/m you get `Z12 = Z21 = −36 kN`: both supports push the beam upward (negative z). For a cantilever fixed at the start node with an 18 kN downward tip load: `Z12 = −18`, `M12 = +72 kNm`, `Z21 = +18`, `M21 = 0`.

<figure>

![Element results](/results_elements.png)

</figure>

### Stiffness matrix

Choose **Stiffness matrix** from an element's popover or table row to open a floating window with the element's 6 × 6 stiffness matrix in local and global coordinates—useful for checking hand assembly in a stiffness-method course. The formulas are in the [theory manual](/elements/beam).

## Precision and accuracy

- The beam element is exact for the linear Timoshenko model under nodal, uniform, trapezoidal, concentrated and temperature loads, so results do **not** depend on the number of elements.
- Tables show four significant digits; the internal computation is double precision.
- Deflections include **shear deformation** (Timoshenko). For slender members this adds a fraction of a percent compared with Euler–Bernoulli formulas; for deep or short members it can be several percent. Set the section's shear coefficient to a large value if you want to suppress it.

## Reading results into a report

There is no table export; select the table text and copy it, or take a screenshot of the viewer. To hand a model to someone else, use [Share model](/essentials/import-export).
