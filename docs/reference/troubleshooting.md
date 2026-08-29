# Troubleshooting

## No results are drawn

Results appear only when the model can be solved. Check, in this order:

1. **Is there a red alert in the viewer?** *No materials defined* / *No cross sections defined* → add one. *Model has N error(s)* → click **Show details** and fix each item (see the table below).
2. **Enough supports?** The solver needs at least three restrained DOFs *and* no mechanism. A beam on two rollers (Dz + Dz) has only two and slides away; a frame with all pins and no bracing may be a mechanism even with many supports. Add a `Dx` somewhere, or an `Ry` at one support.
3. **Are the elements connected?** Two nodes at the same coordinates are still two separate nodes. Delete the stray one and reconnect, or place nodes on elements with **Connect to structure**.
4. **Hinged everywhere?** A node whose every element is hinged and that has no `Ry` support has an undefined rotation. Untick one hinge or restrain `Ry` at that node.
5. **Absurd numbers** (displacements in the millions) mean the structure is almost a mechanism; EduBeam hides such results. Look for a missing support or a near-zero stiffness (`E`, `A` or `Iy` accidentally entered as 0 or in the wrong unit).

## Error messages

Messages from **Show details** (the *Cannot solve model* dialog):

| Message | Meaning / fix |
| --- | --- |
| *Model needs at least 3 constrained DOFs to be stable in 2D analysis.* | Add supports until at least three DOFs are restrained in total. |
| *Element X references missing node / material / cross section Y.* | The referenced entity was deleted (usually via a hand-edited JSON file). Reassign it in the *Elements* table. |
| *Element X must reference exactly 2 nodes.* | Corrupt element in an imported file; delete and recreate it. |
| *Nodal load / Prescribed displacement #n references missing node Y.* | Delete the load or re-target it. |
| *Element load #n references missing element Y.* | Delete the load. |
| *Solver failed due to an internal model inconsistency…* | A generic failure; undo the last step or save the file and [report it](https://github.com/janvorisek/edubeam/issues). |

Warnings (*Model warnings* dialog) do not stop the solve: *Element X references the same node at both ends* (zero-length element—delete it) and *… contains invalid values* (a load with a non-numeric component—edit it).

## Results look wrong

| Symptom | Likely cause |
| --- | --- |
| Loads act upward | Global **z points down**, so positive `Fz`/`fz` is downward. Negative values point up. See [conventions](/elements/conventions). |
| Deflection is 1000× too big or small | Unit mix-up—`E` entered in Pa while the unit is MPa, or `Iy` in cm⁴ while the unit is m⁴. Check the units chip at the bottom-right of the viewer. |
| Deflection slightly larger than the textbook formula | Timoshenko shear deformation. Increase the section's shear coefficient (or use a slender member) to approach Euler–Bernoulli values. See [Checking results by hand](/guide/verification). |
| Moment diagram is on the "wrong" side | The side is a drawing convention only; read the sign from the labels—positive means sagging (tension in the bottom fibre). |
| Diagrams are huge / tiny | Purely visual—adjust **Results scale** in *Settings → Viewer settings*. |
| Local-coordinate load points the wrong way | The element's local x runs from its *initial* to its *end* node. Use **Swap nodes** or flip the sign. |
| Temperature load does nothing | Determinate structures deform freely under temperature without internal forces. Check that α ≠ 0 and, for the gradient part, that the section height h is set. |

## Interface issues

| Symptom | Fix |
| --- | --- |
| Shortcuts do nothing | Click on the canvas first—keys are ignored while a text field has focus. |
| Cannot pan | Panning uses the middle/right mouse button by default; change it in *Settings → Controls & Shortcuts*. On a trackpad, use two fingers or switch the setting to *Right button*. |
| My model disappeared after an update | An update that resets storage is announced in a dialog first; choose to cancel it and save the project before updating. |
| Wrong language | *Settings → Language & Locale*, or add `?lang=en` to the URL. |
| Settings changes do not stick | Local storage is blocked (private window, strict privacy mode). Settings and autosave need it. |

## Reporting a bug

Open a [GitHub issue](https://github.com/janvorisek/edubeam/issues) with the browser and OS, what you expected, and—most useful of all—a **share link** or the **project JSON** reproducing the problem.
