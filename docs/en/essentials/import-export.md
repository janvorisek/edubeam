# Import, export & sharing

Everything in <Edubeam /> happens in your browser. Nothing is uploaded to a server—a share link literally contains the model.

## Save a project

**☰ menu → Save project** or <kbd>Ctrl</kbd>+<kbd>S</kbd> downloads `project.json`. It holds the nodes, elements, materials, cross sections, loads, dimension lines and the app version that wrote it. Rename the file freely.

## Open a project

- **☰ menu → Open project** or <kbd>Ctrl</kbd>+<kbd>O</kbd>, then pick a `.json` file, or
- **drag the file anywhere onto the app window**.

Opening replaces the current model (including materials and cross sections). Use **Save project** first if you want to keep it.

## Share a link

**Share model** (🔗 in the app bar, or the ☰ menu) opens the *Share model via URL* dialog:

- **Copy** — copies the link to the clipboard (or click inside the field).
- **Open link** — opens it in a new tab so you can check what the recipient will see.
- **Share via system dialog** — on phones and tablets, hands the link to the OS share sheet.

The link has the form `https://run.edubeam.app/?model=…` and encodes the entire model (nodes, elements, properties, loads). Whoever opens it gets an exact copy to edit locally; edits are **not** synchronised back—send a new link when the model changes. Very large models make very long links; for those, share the JSON file instead.

## Embed a read-only viewer

Append `&viewer=1` to a share link (or `?viewer=1` to any app URL) to open the model in **viewer mode**: the app bar, bottom bar, undo/redo and the settings panel are hidden and only the canvas with the current model remains. Put that URL in an `<iframe>` to embed a live, zoomable model in lecture notes or a web page:

```html
<iframe src="https://run.edubeam.app/?viewer=1&model=…" width="100%" height="400"></iframe>
```

The [Examples](/examples/) page is built this way—every card is a link with a `?model=` parameter.

## URL parameters

| Parameter | Effect |
| --- | --- |
| `model=<data>` | Load the encoded model, fit it to screen, then remove the parameter from the address bar. |
| `lang=<code>` | Switch the interface language (`en`, `cs`, `de`, `fr`, `es`, `pt`, `pl`, `cn`, `th`, `uk`, `ru`). |
| `viewer=1` | Read-only viewer mode (see above). |

## Automatic persistence

The current model and your settings are saved to the browser's local storage after every change and restored when you come back—even after closing the browser. This is a convenience, not a backup: it is tied to one browser profile on one device, and clearing site data removes it. Save important work as a project file.

## Project file format

`project.json` is plain, readable JSON:

```json
{
  "edubeam": true,
  "version": "1.0.6",
  "domain": {
    "materials": [ { "label": "1", "e": 210000000000, "g": 81000000000, "alpha": 0.000012, "d": 7850 } ],
    "crossSections": [ { "label": "1", "a": 0.00285, "iy": 1.943e-5, "h": 0.2, "k": 1 } ],
    "nodes": [ { "label": "1", "coords": [0, 0, 0], "bcs": [0, 2] }, … ],
    "elements": [ { "label": "1", "nodes": ["1", "2"], "mat": "1", "cs": "1", "hinges": [false, false] } ],
    "loadCases": [ … ]
  }
}
```

All values are stored in **SI units** (m, N, Pa, rad) regardless of the display units. Boundary conditions use DOF ids `0 = Dx`, `2 = Dz`, `4 = Ry`. Because the format is simple, you can generate models with a script or a spreadsheet and open them with **Open project**. The format is not versioned as a stable API, so check the `version` field if you automate against it.
