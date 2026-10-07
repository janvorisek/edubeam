# Loads

All loads live in a **single load case** and act together. To compare scenarios, save each one as a project file or share link.

![Every load type on one continuous beam: a nodal force, a uniform load, a trapezoidal load, a point load, a temperature load and a support settlement](/screenshots/loads-overview.webp)

<LoadShowcase />

## Sign convention in one line

Global **x** points right and global **z** points **down**. A positive `Fz` or `fz` is therefore a downward, gravity-type load, and a positive moment `My` turns counter-clockwise on screen. Details are in [Coordinate system & sign conventions](/elements/conventions). With [y-up axes](/elements/conventions#y-up-axes) the vertical names and signs flip: gravity is a negative `Fy`.

## Nodal loads

*Loads* tab → **Add nodal load**, or click a node → **Add load**. Choose **Force/Moment**:

| Field | Meaning | Unit |
| --- | --- | --- |
| `Fx` | horizontal force (positive to the right) | force unit |
| `Fz` | vertical force (positive down) | force unit |
| `My` | moment about y (positive counter-clockwise) | moment unit |

![Add nodal load. The preview shows the direction as you type.](/screenshots/loads-nodal.webp){.shot-md}

Components are always in the **global** coordinate system. A node can carry several nodal loads; they add up and are drawn stacked.

### Prescribed displacements (support settlements)

In the same dialog choose **Prescribed displacement**, or click a supported node → **Prescribe displacement**. The fields change to:

| Field | Meaning | Unit |
| --- | --- | --- |
| `Dx` | imposed horizontal displacement | displacement unit |
| `Dz` | imposed vertical displacement (positive down) | displacement unit |
| `Ry` | imposed rotation | rad |

You can only enter a value for a DOF that is **restrained** at that node, because only supports can be moved. Each node has at most one prescribed displacement; edit it rather than adding a second. In a statically determinate structure a settlement produces displacements but no internal forces; in an indeterminate one it produces both.

## Element loads

*Loads* tab → **Add element load**, or click an element → **Add load**. Pick the **Load type**; the dialog previews the load on the element as you type.

### Uniformly distributed load

| Field | Meaning | Unit |
| --- | --- | --- |
| `fx` | load per length along x | force / length |
| `fz` | load per length along z | force / length |
| **LCS** | ticked: `fx`, `fz` act along the element's local axes; unticked: along the global axes | – |

**LCS** is ticked by default. On a horizontal element drawn left to right, local and global axes are the same, so it makes no difference. On an inclined member it does:

- a load **perpendicular to the member** (wind on a rafter) is `fz` with LCS **ticked**;
- a **vertical** load per metre of member length (self-weight) is `fz` with LCS **unticked**;
- a vertical load per metre of *horizontal* projection (snow) is not available directly. Multiply it by $\cos\alpha$ first, where $\alpha$ is the member's slope, and enter it as a vertical load.

### Trapezoidal load

| Field | Meaning |
| --- | --- |
| `f1x`, `f1z` | intensity at the **start** node |
| `f2x`, `f2z` | intensity at the **end** node |

The intensity varies linearly from the start to the end of the element. A triangular load has `f1z = 0`. Trapezoidal loads always act along the **element's local axes** (the LCS box is locked); on a horizontal element that is the same as global.

### Concentrated load

A point force or moment anywhere **along** an element, with no extra node needed.

| Field | Meaning |
| --- | --- |
| `Fx`, `Fz`, `My` | force and moment components |
| **Load position from start node** | distance from the initial node, `0 ≤ a ≤ L` |
| **LCS** | components along local axes |

The shear diagram jumps by `Fz` at the load and the moment diagram has a kink there; the moment value at that point is labelled automatically. A concentrated `My` makes the moment diagram jump instead.

### Temperature load

| Field | Meaning |
| --- | --- |
| **ΔT<sub>c</sub>**, axial temperature change | uniform change over the whole section, giving an elongation $\alpha\,\Delta T_c\,L$ |
| **ΔT<sub>b</sub> − ΔT<sub>t</sub>**, temperature difference | bottom fibre minus top fibre, giving a curvature $\alpha\,(\Delta T_b - \Delta T_t)/h$ |

Temperature loads use the material's **α** and the section's **height h**. A positive `ΔTb − ΔTt` (warmer at the bottom) lengthens the bottom fibre, so the element sags like a beam under gravity load. In a statically determinate structure temperature causes only displacements; restraint (fixed ends, continuity, redundant members) turns it into internal forces.

<div class="shots">

![Uniformly distributed load](/screenshots/loads-udl.webp)

![Trapezoidal load](/screenshots/loads-trapezoidal.webp)

![Concentrated load](/screenshots/loads-concentrated.webp)

![Temperature load](/screenshots/loads-temperature.webp)

</div>

## Editing and removing loads

- Every load is a row in the *Loads* tab, where you can edit its components and the LCS flag in place. Loads also appear as chips in the *Nodes* and *Elements* tables.
- **Double-click** a load in the viewer, or click it and choose **Edit load**, to open the edit dialog.
- Select a load and press <kbd>Delete</kbd>, or use the × in the table.
- Loads attached to a node or element are deleted with it, and copied with it when you copy and paste.

![The Loads tab: one row per load, with its components editable in place](/screenshots/loads-table.webp)

## What is not available

- **Load cases and combinations.** There is one load case.
- **Self-weight.** Enter it as a uniform load with LCS unticked: $f_z = \rho\,g\,A$. For an IPE 200, 7850 × 9.81 × 0.00285 ≈ 0.22 kN/m.
- **Trapezoidal loads in global axes** on inclined members.
