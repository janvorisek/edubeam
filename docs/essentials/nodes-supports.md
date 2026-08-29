# Nodes & supports

Nodes are the points of the model. Elements connect nodes; supports and nodal loads are attached to nodes.

## Coordinates

Every node has an **X** and a **Z** coordinate in the current length unit. The x axis points right and the **z axis points down** on screen—so a column from the ground up runs from `Z = 0` to `Z = −3`, not `+3`. The axis indicator in the corner of the grid shows the current orientation. See [Coordinate system & sign conventions](/elements/conventions).

## Adding nodes

| Method | How |
| --- | --- |
| **Dialog** | *Nodes* tab → **Add node**, or right-click the canvas → *Add node*. Enter X and Z. |
| **Mouse** | *Nodes* tab → **Add using mouse** (or hold <kbd>Ctrl</kbd> while choosing *Add node* from the canvas menu), then click on the canvas. Each click adds a node; press <kbd>Esc</kbd> to stop. |
| **While drawing elements** | In *Add element → Add using mouse* mode, clicking empty canvas creates a new node and connects it. |
| **Copy & paste** | Select nodes (and elements), <kbd>Ctrl</kbd>+<kbd>C</kbd>, <kbd>Ctrl</kbd>+<kbd>V</kbd>, then click where the copy should go. |

Labels are assigned automatically (`1`, `2`, …) and can be renamed in the table.

### Snapping

With **Snap to grid** on (<kbd>S</kbd> or the **S** chip) mouse-placed and dragged nodes land on multiples of the **Grid snap step** (default `0.1 m`, changeable in *Settings → Viewer settings → Grid*). Turn snapping off for free placement, or type exact coordinates in the table afterwards.

### Placing a node on an existing element

If you click within ~0.1 m of an element while adding a node, EduBeam asks what you mean:

- **Connect to structure** — the element is split into two (`1a` and `1b`), hinges at the outer ends are preserved and any distributed load is divided between the halves. This is the quickest way to add an interior support or a load point.
- **Place individual node** — the node is created on top of the element but not connected to it.

## Editing nodes

- **Table:** edit label, X and Z in place.
- **Drag:** move a node in the viewer (undoable). On touch screens, long-press a node to start moving it.
- **Edit node dialog:** coordinates, supports and the LCS angle in one place, with a live preview of the support symbol.
- **Delete:** the trash icon in the table, *Delete* in the node's popover, or select and press <kbd>Delete</kbd>. Deleting a node deletes the elements and loads attached to it.

## Supports

A support is simply a set of restrained degrees of freedom (DOFs). Each node has three:

| DOF | Meaning |
| --- | --- |
| **Dx** | translation along x (horizontal) |
| **Dz** | translation along z (vertical) |
| **Ry** | rotation about y (in-plane rotation) |

Tick the boxes in the **Supported DOFs** column of the *Nodes* tab, in the **Node supports** popover of a selected node, or in the *Edit node* dialog. The symbol drawn in the viewer follows from the combination:

| Restrained | Support | Symbol |
| --- | --- | --- |
| Dx + Dz + Ry | Fixed (clamped) | hatched block |
| Dx + Dz | Pinned | triangle |
| Dz | Vertical roller (free to slide horizontally) | triangle on rollers |
| Dx | Horizontal roller (free to slide vertically) | rotated roller |
| Dz + Ry | Sliding clamp (vertical guide) | clamp on rollers |
| Dx + Ry | Sliding clamp (horizontal guide) | rotated clamp |
| Ry | Rotational restraint only | rotational clamp |
| none | Free node | — |

A reaction is computed—and drawn—for every restrained DOF.

::: tip Truss joints
Truss members are beam elements with both **end hinges** released (see [Elements](/essentials/elements#end-hinges)). A pinned support (Dx + Dz) at a truss joint is the usual choice; do **not** restrain Ry at a node where every connected element is hinged, otherwise the rotation of that node is undefined.
:::

### Inclined (skewed) supports

Set **Nodal LCS angle** (degrees, −180…180) in the node popover or the *Edit node* dialog. The node's local axes rotate by that angle and the support DOFs are interpreted in the rotated system, so a roller on a 30° slope is `Dz` with an LCS angle of `30`. The support symbol rotates accordingly and the reaction is reported in the rotated direction.

### Stability

The solver needs at least **three restrained DOFs** in total and a mechanism-free structure. Missing or insufficient supports produce the error *Model needs at least 3 constrained DOFs…* or simply no results. See [Troubleshooting](/reference/troubleshooting).

## Nodal loads and settlements

Forces, moments and prescribed displacements (support settlements) are applied at nodes—see [Loads](/essentials/loads#nodal-loads).

## Dimension lines

Right-click the canvas → **Add dimension** to draw a dimension line between two points. End points snap to nodes when dragged close to them; select the line and use **Edit** to type coordinates or **Flip dimension** to put the label on the other side. Dimension lines are cosmetic and are saved with the project.
