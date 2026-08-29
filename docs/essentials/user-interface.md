# User interface

<Edubeam /> has three zones. Learn what lives where and the rest of the docs will make sense.

```
┌──────────────────────────────────────────────────────────────┐
│ ☰  edubeam        🗑 Clear mesh   🔗 Share model   What's New │  ← App bar
├──────────────────────────────────────────────────────────────┤
│ Viewer | Settings                                            │  ← Tabs
│ ↶ ↷                                        ⌖  ⤢  ⚙            │
│                                                              │
│                     canvas (the model)          [display     │  ← Viewer
│                                                   toggles]   │
│                                       G  S  m·kN·kNm·MPa     │
├──────────────────────────────────────────────────────────────┤
│ Nodes | Elements | Loads | Materials | Cross sections | Results│  ← Bottom bar
│ [Add node] [Add using mouse]        table of entities …      │
└──────────────────────────────────────────────────────────────┘
```

## App bar

| Control | What it does |
| --- | --- |
| **☰ menu** | **Open project**, **Save project**, **Share model**, **Clear mesh**, plus the app version. |
| **Clear mesh** 🗑 | Deletes all nodes, elements and loads after a confirmation. Two checkboxes let you also delete materials and cross sections. Not undoable. |
| **Share model** 🔗 | Opens the [share dialog](/essentials/import-export#share-a-link) with a URL that encodes the whole model. |
| **What's New?** | Release notes. |
| **Documentation** / GitHub | Links to this site and to the source code. |

The app bar is hidden in [viewer mode](/essentials/import-export#embed-a-read-only-viewer).

## Viewer

The canvas is where you draw and inspect the model. Everything else in the app reflects what you select here.

### Overlay buttons

- **Top-left:** **Undo** / **Redo** (also <kbd>Ctrl</kbd>+<kbd>Z</kbd> / <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Z</kbd>). Every model change—adding, editing, dragging, deleting—is undoable.
- **Top-right:** **Center content** (<kbd>C</kbd>), **Fit content to screen** (<kbd>F</kbd>) and the **display settings** toggle ⚙.
- **Bottom-right:** **G** toggles the grid, **S** toggles snap-to-grid; the **units chip** shows the active units and opens the settings when clicked.

### Display settings panel

Open with the ⚙ button. Two rows of checkboxes:

- **Results:** *Deformed shape*, *N (x)*, *V<sub>z</sub> (x)*, *M<sub>y</sub> (x)*, *Reactions*.
- **Model:** *Supports*, *Loads*, *Node labels*, *Element labels*.

**More settings** opens the full [settings dialog](/essentials/units-settings).

### Navigating

| Action | Mouse / touch |
| --- | --- |
| Zoom | Mouse wheel (zooms towards the cursor), <kbd>Ctrl</kbd>+<kbd>=</kbd> / <kbd>Ctrl</kbd>+<kbd>-</kbd>; pinch on touch screens |
| Pan | Drag with the **middle or right** mouse button (configurable in *Settings → Controls & Shortcuts*); one-finger drag on touch |
| Fit / center | <kbd>F</kbd> / <kbd>C</kbd> or the top-right buttons |

### Selecting and editing

- **Click** a node, element, load or dimension line to select it. The bottom bar jumps to the matching tab and a small **popover menu** appears next to the selection with the actions available for that object (e.g. *Add load*, *Node supports*, *Edit element*, *Stiffness matrix*, *Delete*).
- **Drag on empty canvas** to draw a selection rectangle. Everything inside—nodes, elements, their loads and dimension lines—is selected. Press <kbd>Delete</kbd> to remove it all, <kbd>Ctrl</kbd>+<kbd>C</kbd> / <kbd>Ctrl</kbd>+<kbd>V</kbd> to copy and paste it elsewhere.
- **Drag a node** to move it. With snap on it lands on the grid. Connected elements and their loads follow.
- **Double-click a load** to edit it.
- **Hover** anything for a tooltip: nodes show their displacements and rotation, elements their material and cross section, loads their components.
- **Right-click empty canvas** for the canvas menu: *Add node*, *Add element*, *Add dimension*, *Edit* (opens a table of the current selection), *Copy*, *Paste*, *Delete*. Hold <kbd>Ctrl</kbd> while choosing *Add node* / *Add element* to place them with the mouse instead of a dialog.

All shortcuts are listed on the [Keyboard & mouse](/reference/shortcuts) page.

### Alerts

Messages appear in the top-left of the viewer when something is wrong: *No materials defined* / *No cross sections defined* (with an **Add new** button) or *Model has N error(s)*, with a **Show details** button that lists every problem. See [Troubleshooting](/reference/troubleshooting).

## Bottom bar

Six tabs, each with a count badge, a toolbar and an editable table. Drag the divider above the bar to resize it, or minimise it with the button on the right.

| Tab | Toolbar | Table |
| --- | --- | --- |
| **Nodes** | Add node (dialog), Add using mouse | Label, X, Z, **Supported DOFs** checkboxes, loads on the node, delete |
| **Elements** | Add element (dialog), Add using mouse | Label, type, from/to node (+ *Swap nodes*), material, cross section, **End hinges**, loads on the element, stiffness matrix, delete |
| **Loads** | Add nodal load, Add element load | Type, target, editable components, delete |
| **Materials** | Add material, Material library | Label, E, G, α<sub>T</sub>, delete |
| **Cross sections** | Add cross section, Section library | Label, A, I<sub>y</sub>, h, k, delete |
| **Results** | Nodal results / Element results switch | Displacements & rotations per node, or end forces per element |

Cells are edited in place—click, type, press <kbd>Enter</kbd> (or <kbd>Esc</kbd> to leave the cell). Values are shown and entered in the [current units](/essentials/units-settings).

## Tabs above the viewer

The **Viewer** tab is always present. Opening the settings adds a closable **Settings** tab next to it, so you can adjust colours or units while looking at the model.

## Floating widgets

Some actions open draggable windows on top of the viewer: **Stiffness matrix** (from an element's popover or table row) shows the element's 6 × 6 stiffness matrix in local and global coordinates; **Edit** on the canvas menu opens a table of the current selection. Close them with the ×.
