# Loads

All loads live in a **single load case** and act simultaneously. To compare scenarios, save each one as a project file or share link.

<LoadShowcase />

## Sign convention in one line

Global **x** points right, global **z** points **down**. A positive `Fz` or `fz` in global coordinates is therefore a downward, gravity-type load; a positive moment `My` is counter-clockwise on screen. Details in [Coordinate system & sign conventions](/elements/conventions).

## Nodal loads

*Loads* tab → **Add nodal load**, or click a node → **Add load**. Choose **Force/Moment**:

| Field | Meaning | Unit |
| --- | --- | --- |
| `Fx` | horizontal force (+ → right) | force unit |
| `Fz` | vertical force (+ → down) | force unit |
| `My` | moment about y | moment unit |

Components are always in the **global** coordinate system. A live arrow preview in the dialog shows the resulting direction and magnitude. Several nodal loads on one node are allowed and simply add up.

### Prescribed displacements (support settlements)

In the same dialog choose **Prescribed displacement** (or click a supported node → **Prescribe displacement**). Fields switch to:

| Field | Meaning | Unit |
| --- | --- | --- |
| `Dx` | imposed horizontal displacement | length unit |
| `Dz` | imposed vertical displacement (+ → down) | length unit |
| `Ry` | imposed rotation | rad |

A value can only be entered for a DOF that is **restrained** at that node—only supports can be moved. Each node can have one prescribed displacement; edit it rather than adding a second. In a statically determinate structure a settlement produces displacements but no internal forces; in an indeterminate one it produces both.

## Element loads

*Loads* tab → **Add element load**, or click an element → **Add load**. Pick the **Load type**; the dialog shows a live preview of the load on the element.

### Uniformly distributed load

| Field | Meaning | Unit |
| --- | --- | --- |
| `fx` | load per length along x | force / length |
| `fz` | load per length along z | force / length |
| **LCS** | tick to interpret `fx`, `fz` in the element's local axes | – |

The most common case is a vertical gravity load: `fz > 0`, LCS off. For an inclined member, a load **perpendicular to the member** (e.g. wind on a rafter) is `fz` with LCS **on**; a vertical load per metre of *horizontal* projection is not available directly—convert it to per metre of member length first.

### Trapezoidal load

| Field | Meaning |
| --- | --- |
| `f1x`, `f1z` | intensity at the **start** node |
| `f2x`, `f2z` | intensity at the **end** node |

Intensities vary linearly between the ends. A triangular load is simply `f1z = 0`. Trapezoidal loads are always in the **element's local system** (the LCS box is locked on); for horizontal elements local and global z coincide, so this only matters for inclined members.

### Concentrated load

A point force or moment somewhere **along** an element—no extra node needed.

| Field | Meaning |
| --- | --- |
| `Fx`, `Fz`, `My` | force / moment components |
| **Load position from start node** | distance from the initial node, `0 ≤ a ≤ L` |
| **LCS** | components in local axes |

The shear diagram jumps by `Fz` and the moment diagram gets a kink at the load position; the moment value there is labelled automatically.

### Temperature load

| Field | Meaning |
| --- | --- |
| **ΔT<sub>s</sub>** – axial temperature change | uniform change over the whole section → elongation $\alpha\,\Delta T_s\,L$ |
| **ΔT<sub>b</sub> − ΔT<sub>t</sub>** – bottom minus top fibre | temperature difference across the depth → curvature $\alpha\,(\Delta T_b - \Delta T_t)/h$ |

Temperature loads use the material's **α** and the section **height h**. A positive `ΔTb − ΔTt` (bottom warmer) makes the element hog (bend upward). In a statically determinate structure temperature causes only displacements; restraint (fixed ends, continuity, redundant members) turns it into internal forces.

## Editing and removing loads

- Loads appear as chips in the *Nodes* / *Elements* tables and as rows in the *Loads* tab, where components (and the LCS flag) are edited in place.
- **Double-click** a load in the viewer, or click it and choose **Edit load**, to open the edit dialog.
- Select a load and press <kbd>Delete</kbd>, or use the trash icon.
- Loads attached to a node or element are deleted with it, and are copied with it when you copy & paste.

## What is not available

- **Load cases and combinations** — one case only.
- **Self-weight** — enter it as a UDL: $f_z = \rho\,g\,A$ (e.g. IPE 200: 7850 × 9.81 × 0.00285 ≈ 0.22 kN/m).
- **Global-coordinate trapezoidal loads** on inclined members.
