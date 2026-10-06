# Units & settings

Open the settings with the **⚙ button in the viewer → More settings**, by clicking the **units chip** in the bottom-right corner of the viewer, or from the **Settings** tab above the viewer. Settings are stored in your browser and survive reloads; **Reset settings** restores the viewer defaults and the units of your region (the language is kept).

## Language & Locale

**Language** — 11 interface languages. You can also open the app with `?lang=<code>` (`en`, `cs`, `de`, `fr`, `es`, `pt`, `pl`, `cn`, `th`, `uk`, `ru`).

**Unit system** — *SI (metric)* or *US customary (imperial)* sets every unit below in one step. Changing any single unit afterwards shows the system as *Custom*. On a first visit, EduBeam starts in US customary units if the browser is set to a US locale *and* the computer is in a US time zone, and in SI everywhere else.

**Units** — each quantity has its own unit. Inputs, tables, tooltips and diagram labels all use the selected unit, and changing a unit converts what is displayed (the model itself is stored in SI internally, so nothing is lost by switching back and forth, and a shared link opens the same model in any units).

| Quantity | Choices | SI | US customary |
| --- | --- | --- | --- |
| Length (geometry) | m, cm, mm, ft, in | m | ft |
| Section dimensions | m, cm, mm, ft, in | m | in |
| Displacement | m, cm, mm, ft, in | m | in |
| Area | m², cm², mm², ft², in² | m² | in² |
| Second moment of area | m⁴, cm⁴, mm⁴, ft⁴, in⁴ | m⁴ | in⁴ |
| Mass | kg, lb | kg | lb |
| Force | N, kN, MN, kgf, Tonf, lbf, kip | kN | kip |
| Bending moment | Nmm, Nm, kNm, MNm, Tonf·m, lbf·in, lbf·ft, kip·in, kip·ft | kNm | kip·ft |
| Pressure (E, G) | Pa, kPa, MPa, GPa, ksc, psi, ksi, psf, ksf | MPa | ksi |
| Temperature | °C, °F | °C | °F |

Line loads use *force / length* of the selected units (kN/m in SI, kip/ft in US customary), density uses *mass / length³*. The coefficient of thermal expansion follows the temperature unit (1/K or 1/°F). Temperature loads are temperature *changes*, so 10 °C is 18 °F. Rotations are always in radians.

Tonf is the metric tonne-force (1000 kgf), not the US short ton. The US customary units are converted with their exact definitions (1 ft = 0.3048 m, 1 kip = 4448.2216 N).

**Coordinate system** — *x right, z down* (default) or *x right, y up*. The y-up option flips the sign of vertical values and support angles and renames the axes in every input, table, tooltip and export; the model and saved files do not change. See [Y-up axes](/elements/conventions#y-up-axes).

## Viewer settings

A **Viewer preview** at the top shows a small model that reacts to every change below.

**Grid**
- **Show grid** (<kbd>G</kbd>) — draws the grid and rulers.
- **Snap to grid** (<kbd>S</kbd>) — mouse-placed and dragged nodes snap to the grid step.
- **Grid snap step** — spacing in the length unit (default 0.1 m, or 0.5 ft in US customary units). Switching between metric and US units moves a step left at its default to the other system's default; a step you set yourself is kept. The rulers count in the length unit too; in feet, the rulers and the crosshair read in feet and inches (5′-6″) while inputs and tables keep decimal feet (5.5).

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
