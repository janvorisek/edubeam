# Keyboard & mouse

Keyboard shortcuts work while the viewer has focus—they are ignored while you are typing in a table cell or dialog.

## Keyboard

| Shortcut | Action |
| --- | --- |
| <kbd>Ctrl</kbd>+<kbd>Z</kbd> | Undo |
| <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Z</kbd> | Redo |
| <kbd>Ctrl</kbd>+<kbd>S</kbd> | Save project (download JSON) |
| <kbd>Ctrl</kbd>+<kbd>O</kbd> | Open project |
| <kbd>Ctrl</kbd>+<kbd>A</kbd> | Select everything |
| <kbd>Ctrl</kbd>+<kbd>C</kbd> | Copy the selection (nodes, elements, loads) to EduBeam's clipboard |
| <kbd>Ctrl</kbd>+<kbd>V</kbd> | Paste: a ghost of the copy follows the cursor; left-click to place it |
| <kbd>Delete</kbd> | Delete the selection |
| <kbd>Esc</kbd> | Cancel the current mouse mode, clear the selection, leave a table cell |
| <kbd>Enter</kbd> | Confirm a table cell |
| <kbd>F</kbd> | Fit content to screen |
| <kbd>C</kbd> | Center content |
| <kbd>G</kbd> | Toggle grid |
| <kbd>S</kbd> | Toggle snap to grid |
| <kbd>Ctrl</kbd>+<kbd>=</kbd> / <kbd>Ctrl</kbd>+<kbd>-</kbd> | Zoom in / out |

On macOS use <kbd>Cmd</kbd> where <kbd>Ctrl</kbd> is shown.

## Mouse

| Action | Result |
| --- | --- |
| Left click | Select a node / element / load / dimension line and open its popover menu |
| Left drag on empty canvas | Rubber-band selection |
| Left drag on a node | Move the node (snaps to grid when snapping is on) |
| Left click in *Add using mouse* mode | Place a node, or start / continue an element polyline |
| Double-click a load | Edit the load |
| Right click on empty canvas | Canvas menu: Add node, Add element, Add dimension, Edit, Copy, Paste, Delete |
| Middle or right drag | Pan (configurable in *Settings → Controls & Shortcuts*) |
| Wheel | Zoom towards the cursor |
| Hover | Tooltip with displacements / properties / load values |

## Touch

| Gesture | Result |
| --- | --- |
| Tap | Select |
| One-finger drag | Pan |
| Pinch | Zoom |
| Long-press a node | Start moving it |

## Popover menus

Clicking an object opens a small menu next to it:

| Object | Items |
| --- | --- |
| Node | Add load · Node supports (Dx / Dz / Ry, Nodal LCS angle) · Prescribe displacement (if supported) · Delete |
| Element | Edit element (nodes, material, section) · Add load · Stiffness matrix · Delete |
| Nodal / element load | Edit load · Delete |
| Dimension line | Edit (coordinates) · Flip dimension · Delete |
