# User interface

<Edubeam /> has three zones: the **app bar** at the top, the **viewer** in the middle where you draw, and the **bottom bar** with a table for every kind of object. Learn what lives where and the rest of the guide will make sense.

![The parts of the interface, numbered as in the list below](/screenshots/ui-overview.webp)

1. **☰ menu**: open, save, share and export; examples and guided tours.
2. **App bar buttons**: Clear mesh and Share model.
3. **Undo / Redo** for every change to the model.
4. **Viewer buttons**: center, fit to screen, and the display options toggle.
5. **Display options**: which results and model parts are drawn.
6. **Grid, snap, crosshair and units.**
7. **Bottom-bar tabs**: Nodes, Elements, Loads, Materials, Cross sections, Results.
8. **The table** of the open tab, where every value can be edited.

::: tip Take the tour
**☰ → Show me around** points out these parts in the app itself, one at a time.
:::

![Show me around, at the display-options step](/screenshots/tour.webp)

## App bar

| Control | What it does |
| --- | --- |
| **☰ menu** | The main menu, see below. |
| **Clear mesh** | Deletes all nodes, elements and loads after a confirmation. Two checkboxes also delete the materials and cross sections. <kbd>Ctrl</kbd>+<kbd>Z</kbd> brings the model back, and it is kept in Recent structures. |
| **Share model** | Opens the [share dialog](/essentials/import-export#share-a-link) with a link that contains the whole model. |
| **What’s New?** | Release notes. They also open by themselves once after an update. |
| **Documentation** / GitHub | This guide and the source code. |

On a phone, only the ☰ menu and Documentation fit; everything else is in the menu.

### The ☰ menu

![The ☰ menu](/screenshots/ui-app-menu.webp){.shot-xs}

| Item | What it does |
| --- | --- |
| **Open project** / **Save project** | Open or download a `project.json` file (<kbd>Ctrl</kbd>+<kbd>O</kbd> / <kbd>Ctrl</kbd>+<kbd>S</kbd>). |
| **Recent structures** | The last 10 models you cleared or replaced, ready to restore. |
| **Export image** | Save the drawing as PNG or SVG, or copy it (<kbd>Ctrl</kbd>+<kbd>P</kbd>). |
| **Share model** | Same as the app-bar button. |
| **Examples** | The gallery of ready-made models. |
| **Draw your first beam** | A seven-step guided task. |
| **Show me around** | The tour of the interface. |
| **Clear mesh** | Same as the app-bar button. |

The bottom of the menu shows the app version and its release date.

## Viewer

The canvas is where you draw and inspect the model. Everything else in the app follows what you select here.

### Buttons on the canvas

- **Top left:** **Undo** and **Redo** (<kbd>Ctrl</kbd>+<kbd>Z</kbd> / <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Z</kbd>). Every model change, including adding, editing, dragging, deleting and clearing, can be undone.
- **Top right:** **Center content** (<kbd>C</kbd>), **Fit content to screen** (<kbd>F</kbd>) and the ⚙ button that shows or hides the display options. On touch screens there is also **Box select**.
- **Bottom right:** **G** toggles the grid, **S** toggles snap to grid, the crosshair button shows the pointer position on the rulers, and the **units chip** opens the settings on *Language & Locale*.

### Display options

![The viewer buttons and the display options](/screenshots/ui-display-settings.webp){.shot-lg}

Two rows of checkboxes, open by default:

- **Results:** *Deformed shape*, *N (x)*, *V<sub>z</sub> (x)*, *M<sub>y</sub> (x)*, *Reactions*. Deformed shape, M and Reactions start ticked.
- **Model:** *Supports*, *Loads*, *Node labels*, *Element labels*.

**More settings** opens the full [settings](/essentials/units-settings) on *Viewer settings*.

### Navigating

| Action | Mouse | Touch |
| --- | --- | --- |
| Zoom | Mouse wheel (towards the cursor), <kbd>Ctrl</kbd>+<kbd>=</kbd> / <kbd>Ctrl</kbd>+<kbd>-</kbd> | Pinch |
| Pan | Drag with the **middle or right** button (see *Settings → Controls & Shortcuts*) | Drag with one finger |
| Fit / center | <kbd>F</kbd> / <kbd>C</kbd> or the top-right buttons | The top-right buttons |

### Selecting and editing

**Click** a node, element, load or dimension line to select it. A panel opens next to it with its details and the actions that fit: add a load, set supports, edit, show the stiffness matrix, delete. Clicking a node also switches the bottom bar to the Nodes tab.

<div class="shots">

![A node: add a load, set supports, prescribe a displacement](/screenshots/ui-node-menu.webp)

![An element: edit, add a load, stiffness matrix](/screenshots/ui-element-menu.webp)

</div>

- **Drag on empty canvas** to draw a selection rectangle. Everything inside is selected: nodes, elements, their loads and dimension lines. Press <kbd>Delete</kbd> to remove it all, or <kbd>Ctrl</kbd>+<kbd>C</kbd> / <kbd>Ctrl</kbd>+<kbd>V</kbd> to copy it elsewhere.
- **Drag a node** to move it. With snap on, it lands on the grid. Connected elements and their loads follow.
- **Double-click a load** to edit it.
- **Point at** anything for a tooltip. Nodes show their displacements and rotation, elements their material and section, loads their values. On a touch screen, tap instead: the same details appear in the selection panel.

![Pointing at a node shows its displacements and rotation](/screenshots/ui-hover.webp){.shot-sm}

**Right-click the canvas** (or press and hold on a touch screen) for the canvas menu. Hold <kbd>Ctrl</kbd> while choosing *Add node* or *Add element* to place them with the mouse instead of a dialog. Over an element, the menu also offers *Dimension element*.

![The canvas menu](/screenshots/ui-canvas-menu.webp){.shot-sm}

All shortcuts are on the [Keyboard, mouse & touch](/reference/shortcuts) page.

### When the model cannot be solved

Messages appear at the top left of the viewer:

- *No materials defined* / *No cross sections defined*, with an **Add new** button.
- A small blue **Needs supports** chip while the model is simply unfinished.
- A **red message** when something is wrong, with **Show details**, which lists every problem.

When the structure can still move, EduBeam swings it as a dashed outline and circles the nodes or hinges at fault. Point at the message to see the motion again, or use its eye button to hide it.

![A frame with hinges at B and C is a mechanism: EduBeam shows how it moves](/screenshots/ui-mechanism.webp)

![Show details lists each problem with a hint](/screenshots/ui-diagnostics.webp){.shot-lg}

[Troubleshooting](/reference/troubleshooting) explains every message.

## Bottom bar

Six tabs, each with a toolbar and an editable table. The tabs show how many objects of each kind the model has. The **?** at the right explains the open tab, and so does the **?** next to some column headings. Drag the tab strip up or down to resize the bar, or minimise it with the button on the right.

| Tab | Toolbar | Table |
| --- | --- | --- |
| **Nodes** | Add node (dialog), Add node (mouse) | Label, coordinates, **Supported DOFs** (support symbol, Dx, Dz, Ry, support angle α), loads, edit, delete |
| **Elements** | Add element (dialog), Add element (mouse) | Label, type, nodes (with a swap button), material, cross section, **End hinges**, loads, stiffness matrix, delete |
| **Loads** | Add nodal load, Add element load | Type, target, editable components, edit, delete |
| **Materials** | Add material, Material library | Label, E, G, α<sub>T</sub>, delete |
| **Cross sections** | Add cross section, Section library, Polygonal section | Shape, label, A, I<sub>y</sub>, h, k, edit shape, delete |
| **Results** | Nodal results, Element results, Export CSV, Copy | Displacements and rotations per node, or end forces per element |

Edit a cell in place: click, type, then press <kbd>Enter</kbd> (or <kbd>Esc</kbd> to leave the cell). Values are shown and entered in the [current units](/essentials/units-settings).

## Tabs above the viewer

**Viewer** shows the canvas. **Settings** shows the settings full-size, so you can change colours or units and switch back to see the effect. The units chip and *More settings* open the same settings as a dialog over the model.

## Floating windows

**Stiffness matrix** (from an element's panel or the Elements table) opens a window with the element's 6 × 6 stiffness matrix in global coordinates. **Edit** in the canvas menu opens a table of the current selection. Drag them by their title bar and close them with the ×.
