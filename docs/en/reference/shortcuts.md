# Keyboard, mouse & touch

Keyboard shortcuts work while the viewer has focus. They are ignored while you are typing in a table cell or a dialog; click the canvas first.

## Keyboard

| Shortcut | Action |
| --- | --- |
| <kbd>Ctrl</kbd>+<kbd>Z</kbd> | Undo |
| <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Z</kbd> | Redo |
| <kbd>Ctrl</kbd>+<kbd>S</kbd> | Save project (download JSON) |
| <kbd>Ctrl</kbd>+<kbd>O</kbd> | Open project |
| <kbd>Ctrl</kbd>+<kbd>P</kbd> | Export image |
| <kbd>Ctrl</kbd>+<kbd>A</kbd> | Select everything |
| <kbd>Ctrl</kbd>+<kbd>C</kbd> | Copy the selection (nodes, elements and their loads) |
| <kbd>Ctrl</kbd>+<kbd>V</kbd> | Paste: a ghost of the copy follows the cursor; click to place it, or type an offset Δx, Δz in the banner and press **Paste** |
| <kbd>Delete</kbd> | Delete the selection |
| <kbd>Esc</kbd> | Cancel the current mouse mode, close the tour, clear the selection, or leave a table cell |
| <kbd>Enter</kbd> | Confirm a table cell |
| <kbd>F</kbd> | Fit content to screen |
| <kbd>C</kbd> | Center content |
| <kbd>G</kbd> | Toggle the grid |
| <kbd>S</kbd> | Toggle snap to grid |
| <kbd>Ctrl</kbd>+<kbd>=</kbd> / <kbd>Ctrl</kbd>+<kbd>-</kbd> | Zoom in / out |

On a Mac, use <kbd>Cmd</kbd> where <kbd>Ctrl</kbd> is shown.

## Mouse

| Action | Result |
| --- | --- |
| Click | Select a node, element, load or dimension line and open its panel |
| Drag on empty canvas | Selection rectangle |
| Drag a node | Move the node (snaps to the grid when snapping is on) |
| Click in mouse mode | Place a node, or start or continue an element polyline |
| Double-click a load | Edit the load |
| Right-click | Canvas menu: Add node, Add element, Add dimension, Dimension element (over an element), Edit, Copy, Paste, Delete |
| <kbd>Ctrl</kbd> (<kbd>Cmd</kbd> on a Mac) + Add node / Add element in the canvas menu | Place with the mouse instead of a dialog |
| Middle or right drag | Pan (see *Settings → Controls & Shortcuts*) |
| Wheel | Zoom towards the cursor |
| Point at an object | Tooltip with displacements, properties or load values |

On a trackpad, two-finger scrolling zooms. To pan, click and drag with two fingers (a right-button drag).

## Touch

| Gesture | Result |
| --- | --- |
| Tap | Select, and show the object's details and actions |
| Tap in mouse mode | Place a node or continue an element |
| Press a node and drag | Move the node |
| One-finger drag elsewhere | Pan |
| Pinch | Zoom |
| Press and hold the canvas | Canvas menu |
| **Box select** button (top right), then drag | Selection rectangle |

## Object panels

Clicking an object opens a panel next to it with its details and these actions:

| Object | Actions |
| --- | --- |
| Node | Add load · Node supports (support symbol, Dx / Dz / Ry, nodal LCS angle) · Prescribe displacement (on a supported node) · Delete |
| Element | Edit element (nodes and hinges, material, section) · Add load · Stiffness matrix · Delete |
| Nodal or element load | Edit load · Delete |
| Dimension line | Edit (coordinates) · Flip dimension · Delete |
