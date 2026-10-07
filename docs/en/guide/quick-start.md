# Quick start

In about ten minutes you will model a simply supported steel beam under a uniform load, read the reactions, shear force and bending moment, and confirm them against the textbook formulas.

::: tip Follow along
Open [run.edubeam.app](https://run.edubeam.app){target="_blank"} in a second tab. If a model is already loaded, use **Clear mesh** (trash icon in the app bar) to start empty—tick *Delete materials* and *Delete cross sections* to start completely fresh.
:::

## The problem

<ExampleStructure />

A 6 m simply supported beam (pinned at the left, roller at the right) carries a uniform load of 12 kN/m. Material: steel, $E = 210\ \text{GPa}$, $G = 81\ \text{GPa}$. Section: an IPE 200, $A = 28.5\ \text{cm}^2$, $I_y = 1943\ \text{cm}^4$, $h = 200\ \text{mm}$.

## 1. Check the units

Look at the units chip in the bottom-right corner of the viewer (e.g. `m · m² · kN · kNm · MPa`). These are the units every input field and result uses. The defaults are metres, kN, kNm and MPa, which is what this tutorial assumes. To change them, click the chip or open **Settings → Language & Locale**.

## 2. Add the material and cross section

Elements need a material and a cross section before they can exist, so create them first.

1. Open the **Materials** tab in the bottom bar and click **Add material**.
2. Enter `E = 210000` MPa, `G = 81000` MPa, leave density and `α = 0.000012` 1/K. Click **Add material**.
   *(Or click **Material library** and pick **Steel (S235)**—it has exactly these values.)*
3. Open the **Cross sections** tab and click **Add cross section**.
4. Enter `Area = 0.00285` m², `Iy = 1.943e-5` m⁴, `Height = 0.2` m, `Shear coefficient = 1`. Click **Add cross section**.

::: details Why does the shear coefficient matter?
EduBeam uses Timoshenko beam elements, which include shear deformation. `k` is the shear correction factor ($k \approx 0.83$ for a rectangle, $\approx 0.4$–$0.5$ for the web of an I-section when $A$ is the full area). Setting `k = 1` with the full area slightly *understates* shear flexibility; for a slender beam like this one the difference in deflection is well under 1 %. See the [beam theory page](/elements/beam) for the formula.
:::

## 3. Add the nodes

1. Open the **Nodes** tab and click **Add node**. Enter `X = 0`, `Z = 0` and confirm. The node is labelled `1`.
2. Click **Add node** again with `X = 6`, `Z = 0`. This is node `2`.

You can also place nodes with the mouse: choose **Add using mouse** (or right-click the canvas → *Add node* while holding <kbd>Ctrl</kbd>) and click on the grid. With **Snap to grid** on (<kbd>S</kbd>), clicks land on 0.1 m increments.

## 4. Connect them with an element

1. Open the **Elements** tab and click **Add element**.
2. Choose **Initial node** `1`, **End node** `2`. The material and cross section you created are pre-selected. Confirm.

A black line appears between the nodes. Press <kbd>F</kbd> to fit it to the screen.

## 5. Add the supports

In the **Nodes** tab, the **Supported DOFs** column has three checkboxes per node: `Dx`, `Dz`, `Ry`.

- Node `1`: tick **Dx** and **Dz** → a pinned support symbol appears.
- Node `2`: tick **Dz** only → a roller.

The same checkboxes are available by clicking a node in the viewer and choosing **Node supports**. See [Nodes & supports](/essentials/nodes-supports) for every support type.

## 6. Add the load

1. Open the **Loads** tab and click **Add element load**.
2. **Load type**: *Uniformly distributed load*. **Element**: `1`.
3. Enter `fz = 12` kN/m and leave `fx = 0`. Confirm.

Positive `fz` points in the +z direction, which is **downward** on screen—so a positive value is a gravity-type load. See [conventions](/elements/conventions).

## 7. Read the results

The solution appears the instant the load is added. Open the viewer settings panel (gear button, top-right of the viewer) to switch overlays on and off:

| Overlay | What you should see |
| --- | --- |
| **Reactions** | Two upward arrows of **36 kN** at nodes 1 and 2. |
| **V<sub>z</sub> (x)** | A straight line from **+36 kN** at the left to **−36 kN** at the right, crossing zero at mid-span. |
| **M<sub>y</sub> (x)** | A parabola with its extreme **54 kNm** at mid-span. |
| **Deformed shape** | A symmetric sag. Hover node `1` to read its rotation: about **0.0265 rad**. |

The **Results** tab in the bottom bar gives the numbers: **Nodal results** lists `Dx`, `Dz`, `Ry` for each node, **Element results** lists the end forces of each element in its local coordinate system.

If the diagrams look too large or too small, drag the **Results scale** slider in **Settings → Viewer settings → Sizes**.

## 8. Check by hand

| Quantity | Formula | Hand value | EduBeam |
| --- | --- | --- | --- |
| Reaction | $R = qL/2$ | 36 kN | 36 kN |
| Max shear | $V = qL/2$ | 36 kN | 36 kN |
| Max moment | $M = qL^2/8$ | 54 kNm | 54 kNm |
| End rotation | $\varphi = qL^3/(24EI)$ | 0.02647 rad | 0.02647 rad |
| Mid-span deflection | $w = 5qL^4/(384EI)$ | 49.6 mm | 49.6 mm |

Everything matches. More hand-check recipes (cantilever, fixed beam, truss) are in [Checking results by hand](/guide/verification).

## 9. Experiment

This is where EduBeam earns its keep. Try each of these and watch the diagrams update:

- **Drag node 2** to the right: the moment grows with $L^2$.
- **Tick `Ry` at node 1** to make it fixed: the mid-span moment drops, a hogging moment appears at the support.
- **Add a third node** at `X = 3` by clicking on the beam with *Add using mouse*—choose **Connect to structure** so the beam is split—and then tick its `Dz` to make a two-span continuous beam.
- **Tick an End hinge** on an element in the Elements tab to release the moment at one end.
- Press <kbd>Ctrl</kbd>+<kbd>Z</kbd> to undo any step.

## 10. Save or share

- **Share model** (app bar) gives you a URL that contains the whole model—paste it into an e-mail, a chat or slides.
- **Save project** (menu ☰, or <kbd>Ctrl</kbd>+<kbd>S</kbd>) downloads a `project.json` you can re-open later with **Open project** or by dropping it onto the app.

Your model is also kept in the browser's local storage, so a page reload does not lose it. See [Import, export & sharing](/essentials/import-export).

## Where next

- [Examples](/examples/) — open ready-made frames and trusses in one click.
- [Loads](/essentials/loads) — trapezoidal, concentrated and temperature loads, prescribed displacements.
- [Keyboard & mouse](/reference/shortcuts) — work faster on the canvas.
