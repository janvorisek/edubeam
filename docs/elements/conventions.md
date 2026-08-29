# Coordinate system & sign conventions

Most "wrong" results in <Edubeam /> are really a sign-convention surprise. Everything below is what the solver actually uses.

## Global axes

- **x** — horizontal, positive to the **right**.
- **z** — vertical, positive **downward** on screen.
- **y** — the out-of-plane axis (points toward the viewer for a right-handed system). Rotations and moments are about y.

The axis indicator in the grid corner shows x (red) and z (green). A node at the top of a 3 m column therefore has `Z = −3` if the base is at `Z = 0`.

## Degrees of freedom

Each node has `Dx`, `Dz` (translations) and `Ry` (rotation). Positive `Dz` is a downward displacement; positive `Ry` is a **counter-clockwise** rotation on screen. The same signs apply to prescribed displacements and to reported nodal results.

## Loads

| Load | Positive direction |
| --- | --- |
| `Fx`, `fx`, `f1x`… | +x (right; or along the element's local x when LCS is on) |
| `Fz`, `fz`, `f1z`… | +z (**down**; or along local z when LCS is on) |
| `My` | counter-clockwise on screen |
| `ΔTs` | heating (elongation) |
| `ΔTb − ΔTt` | bottom fibre warmer than the top |

So a gravity load is a **positive** `fz`, and a wind load pushing a left column to the right is a positive `fx`.

## Element local axes

Local **x** runs from the initial node to the end node; local **z** is perpendicular to it, obtained by rotating the global axes by the element angle $\alpha$. For a horizontal element drawn left-to-right, local and global axes coincide. Use **Swap nodes** in the *Elements* table to reverse the direction.

## Internal forces

| Quantity | Positive means |
| --- | --- |
| **N** | tension |
| **V<sub>z</sub>** | the usual beam-theory sign: for a simply supported beam under gravity load, V is positive at the left support and negative at the right |
| **M<sub>y</sub>** | **sagging** — tension in the bottom (+z) fibre. A simply supported beam under gravity load has a positive mid-span moment; a cantilever under a tip load has a negative (hogging) moment at the root |

## End forces (Element results table)

`X12, Z12, M12` act on the element at its start node, `X21, Z21, M21` at its end node, in the **local** system, with the same positive directions as the local axes and `My`. They are the forces the nodes exert on the element, i.e. $\mathbf{f} = \mathbf{K}_l\,\mathbf{u}_l - \mathbf{f}_{eq}$, where $\mathbf{f}_{eq}$ are the equivalent nodal loads of the element loads. The sum of end forces of all elements meeting at a node balances the nodal loads and reactions there.

## Reactions

A reaction exists for every restrained DOF and is reported in the node's coordinate system (rotated by the nodal LCS angle if one is set). Reaction arrows in the viewer point in the direction the support pushes on the structure.

## Units

The solver works in SI internally (m, N, Pa, rad, K). The display units only affect what you type and read; changing them never changes the model.
