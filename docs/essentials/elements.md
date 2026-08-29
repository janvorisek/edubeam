# Elements, materials & sections

## The beam element

<Edubeam /> has one element type: a **2D Timoshenko beam** in the x–z plane with three degrees of freedom at each end (`Dx`, `Dz`, `Ry`). It carries axial force, shear and bending, and includes shear deformation (which is why the cross section has a shear coefficient). The full formulation is in the [theory manual](/elements/beam).

<TrussElement :moment="true" caption="2D beam element – three DOFs per node" />

Results along an element are exact for the linear model, so one element per member is enough. Add intermediate nodes only where you need a support, a hinge, a change of section, or a node to attach a load to.

### Adding elements

| Method | How |
| --- | --- |
| **Dialog** | *Elements* tab → **Add element** (or canvas menu → *Add element*): choose **Initial node**, **End node**, material and cross section. |
| **Mouse** | *Elements* tab → **Add using mouse** (or hold <kbd>Ctrl</kbd> with the canvas menu item). Click a node to start, then click the next node to connect—clicking empty canvas creates a new node there. Keep clicking to draw a polyline; press <kbd>Esc</kbd> to finish. The first material and cross section in the model are assigned automatically. |

::: warning Materials and sections first
An element cannot exist without a material and a cross section. If none are defined the viewer shows *No materials defined* / *No cross sections defined* with an **Add new** shortcut.
:::

### Element direction

The **local x axis** runs from the initial node to the end node. This matters for:

- local-coordinate loads (`fx`, `fz` in LCS),
- the *Load position from start node* of concentrated loads,
- the order of end forces (`X12, Z12, M12` at the start, `X21, Z21, M21` at the end) in the results table.

Use **Swap nodes** in the *Elements* table to reverse an element.

### End hinges

Each element has two **End hinges** checkboxes (start / end) in the *Elements* table. A ticked hinge releases the bending moment at that end (static condensation of the rotational DOF), so:

- one hinge → a pin inside a frame or a continuous beam (moment is zero there);
- both hinges → a **truss bar** that carries axial force only.

<TrussElement :hinges="[true, true]" caption="Both ends hinged → truss element" />

When two elements meet at a node and only one of them is hinged, the other still transfers moment into the node—so hinge the element you want released, not "the node".

### Editing and deleting

Click an element and use the popover (**Edit element**, **Add load**, **Stiffness matrix**, **Delete**), or edit directly in the *Elements* table. Deleting an element also removes its loads. **Stiffness matrix** opens a floating window with the 6 × 6 element matrix in local and global coordinates—handy when checking hand assembly.

## Materials

*Materials* tab → **Add material**:

| Field | Symbol | Unit | Notes |
| --- | --- | --- | --- |
| Young's modulus | $E$ | pressure unit (MPa by default) | Steel ≈ 210 000 MPa, concrete ≈ 30 000 MPa, timber ≈ 11 000 MPa |
| Shear modulus | $G$ | pressure unit | $G = E / (2(1+\nu))$; steel ≈ 81 000 MPa. Only affects the Timoshenko shear term. |
| Density | $\rho$ | kg/m³ | Stored with the project; not used by the static solver (there is no self-weight load). |
| Coefficient of thermal expansion | $\alpha$ | 1/K | Used by [temperature loads](/essentials/loads#temperature-load). Steel 12 × 10⁻⁶. |

**Material library** offers ready-made presets: structural steels (S235, S275, S355, stainless), aluminium alloys, copper/brass/bronze, titanium, concrete classes, timber (C24, GL24h, GL32h), glass, GFRP/CFRP and common polymers. Pick one from the library dialog or from *Or choose from library* inside the *Add material* dialog.

## Cross sections

*Cross sections* tab → **Add cross section**:

| Field | Symbol | Unit | Notes |
| --- | --- | --- | --- |
| Area | $A$ | area unit | Axial stiffness $EA$ |
| Second moment of area | $I_y$ | m⁴ (or the selected unit) | Bending stiffness $EI_y$ about the in-plane bending axis |
| Height | $h$ | length unit | Used by temperature-gradient loads (curvature $= \alpha\,\Delta T / h$) |
| Shear coefficient | $k$ | – | Timoshenko shear correction factor: effective shear area $= kA$. Use `1` to (almost) ignore shear deformation; ≈ 0.83 for rectangles; for I-sections use $A_{web}/A$. |

**Section library** provides approximate values for rectangles, squares, circles, IPE and HEA profiles, RHS and CHS tubes. Treat them as starting points and check the values against a section table before relying on them.

::: tip Quick sanity values
For a rectangle $b \times h$: $A = bh$, $I_y = bh^3/12$. For a solid circle of diameter $d$: $A = \pi d^2/4$, $I_y = \pi d^4/64$.
:::

Materials and sections can be shared by any number of elements; changing a value updates every element that uses it and re-solves the model.
