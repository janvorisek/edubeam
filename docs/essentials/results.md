# Results

Experience real-time structural analysis as every input change triggers live analysis, instantly refreshing graphical representations. From diagrams of internal forces to deformed shapes and reactions, explore the interactive nature of our platform for a seamless and insightful structural engineering experience.

## Diagrams of internal forces

### Normal force

The normal force diagram represents the perpendicular force exerted by a surface on an object in contact with it, typically denoted as N.

<Figure>
    <Structure :show-loads="true" show-normal-force :nodes="[{label: 'a', coords: [0,0,0], dofs: [0,2, 4]}, {label: 'b', coords: [10,0,0], dofs: []}]" :elements="[{label: '1', nodes: ['a', 'b']}]" :nodal-loads="[{target: 'b', values: { 0: -100, 2: 0, 4: 0 }}]" />
    <figcaption>Normal force on a simple cantilever loaded at the free end</figcaption>
</Figure>

### Shear force

<Figure>
  <Structure :show-loads="true" show-shear-force :nodes="[{label: 'a', coords: [0,0,0], dofs: [0,2, 4]}, {label: 'b', coords: [10,0,0], dofs: []}]" :elements="[{label: '1', nodes: ['a', 'b']}]" :nodal-loads="[{target: 'b', values: { 0: 0, 2: 10, 4: 0 }}]" />
 <figcaption>Shear force on a simple cantilever loaded at the free end</figcaption>
</Figure>

### Bending moment

<Figure>
  <Structure :show-loads="true" show-moment :nodes="[{label: 'a', coords: [0,0,0], dofs: [0,2, 4]}, {label: 'b', coords: [10,0,0], dofs: []}]" :elements="[{label: '1', nodes: ['a', 'b']}]" :nodal-loads="[{target: 'b', values: { 0: 0, 2: 10, 4: 0 }}]" />
 <figcaption>Bending moment on a simple cantilever loaded at the free end</figcaption>
</Figure>

## Deformed shapes of the structure

The deformed shape of the structure under applied loads is calculated from the primary unknowns in each of the elements.

<Figure>
  <Structure :show-loads="true" show-deformed-shape :nodes="[{label: 'a', coords: [0,0,0], dofs: [0,2, 4]}, {label: 'b', coords: [10,0,0], dofs: []}]" :elements="[{label: '1', nodes: ['a', 'b']}]" :nodal-loads="[{target: 'b', values: { 0: 0, 2: 10, 4: 0 }}]" />
  <figcaption>Deformed shape of a simple cantilever loaded at the free end</figcaption>
</Figure>

## Reactions

Reactions are drawn for each supported DOF of the corresponding nodes.

<Structure :show-loads="true" show-reactions :nodes="[{label: 'a', coords: [0,0,0], dofs: [0,2, 4]}, {label: 'b', coords: [10,0,0], dofs: []}]" :elements="[{label: '1', nodes: ['a', 'b']}]" :nodal-loads="[{target: 'b', values: { 0: 0, 2: 10, 4: 0 }}]" />

## Results

### Nodal Results

The primary unknowns are displacements and rotations of the nodes. You can view the values in the **Bottom Bar** within the **Results** tab.

<figure>

![Nodal Results - Displacements & Rotations](/results_nodes.png)

</figure>

### Element Results

The element end forces and moments are calculated by multiplying of the element stiffness matrices and corresponding element unknowns. The end forces can be examined in the **Bottom Bar** within the **Results** tab after cliking the **Element Results** button.

<figure>

![Element Results - End Forces](/results_elements.png)

</figure>
