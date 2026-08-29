# Units & settings

Open the settings with the **⚙ button in the viewer → More settings**, by clicking the **units chip** in the bottom-right corner of the viewer, or from the **Settings** tab above the viewer. Settings are stored in your browser and survive reloads; **Reset settings** restores the viewer defaults (language and units are kept).

## Language & Locale

**Language** — 11 interface languages. You can also open the app with `?lang=<code>` (`en`, `cs`, `de`, `fr`, `es`, `pt`, `pl`, `cn`, `th`, `uk`, `ru`).

**Units** — each quantity has its own unit. Inputs, tables, tooltips and diagram labels all use the selected unit, and changing a unit converts what is displayed (the model itself is stored in SI internally, so nothing is lost by switching back and forth).

| Quantity | Choices | Default |
| --- | --- | --- |
| Length | m, cm, mm, in, ft | m |
| Area | m², cm², mm², in², ft² | m² |
| Second moment of area | m⁴, cm⁴, mm⁴, in⁴, ft⁴ | m⁴ |
| Mass | kg, lb | kg |
| Force | N, kN, MN, lbf, tonf, kgf | kN |
| Bending moment | Nmm, Nm, kNm, MNm, tonf·m, lbf·in, lbf·ft | kNm |
| Pressure (E, G) | Pa, kPa, MPa, GPa, psi, ksc | MPa |

Line loads use *force / length* of the selected units (kN/m by default). Angles are always radians, temperatures always °C/K.

::: tip Imperial workflow
Pick ft (or in), in², in⁴, lbf or kip-equivalents and psi/ksi as needed—there is no single "imperial" switch, each quantity is set independently.
:::

## Viewer settings

A **Viewer preview** at the top shows a small model that reacts to every change below.

**Grid**
- **Show grid** (<kbd>G</kbd>) — draws the grid and rulers.
- **Snap to grid** (<kbd>S</kbd>) — mouse-placed and dragged nodes snap to the grid step.
- **Grid snap step** — spacing in metres (default 0.1).

**Result labels**
- **Result label orientation** — *Perpendicular to chart* (labels follow the diagram) or *Always horizontal*.

**Sizes**
- **Results scale** (0–120 px) — the on-screen height of the largest diagram ordinate / deflection. Diagrams are normalised to their own maximum, so this is purely visual; change it when the plots are too big or too small for the model.
- **Support size** (0.5–1.5) and **Font size** (10–20 px).

**Colors** — individual colours for nodes, elements, loads, deformed shape, normal force, shear force, bending moment and reactions. Defaults: N blue, V green, M red, reactions purple, loads orange.

## Controls & Shortcuts

**Pan using** — which mouse button pans the canvas: *middle or right* (default), *Mouse wheel* (middle button only) or *Right button* only. The full list of shortcuts is on the [Keyboard & mouse](/reference/shortcuts) page.

## Things stored automatically

Besides settings, EduBeam keeps the **current model** in the browser's local storage after every change. Reloading the tab or reopening the app restores it. This is per browser and per device—use [Save project or Share model](/essentials/import-export) to move a model anywhere else.
