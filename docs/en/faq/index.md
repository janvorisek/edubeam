# Frequently asked questions

## General

### What is EduBeam?

A free, open-source, browser-based solver for 2D beams, frames and trusses aimed at students, teachers and engineers who want instant feedback. See the [Introduction](/guide/introduction).

### Is it really free? Do I need an account?

Yes, and no. Open [run.edubeam.app](https://run.edubeam.app) and start modelling. There are no accounts, no installers and no usage limits. The source is on [GitHub](https://github.com/janvorisek/edubeam).

### Which browsers and devices work?

Any current Chrome, Edge, Firefox or Safari. Tablets and phones work (tap, drag to pan, pinch to zoom, long-press to move a node), but a mouse and keyboard make modelling much faster.

### Can I use it offline?

EduBeam is a progressive web app: once loaded it keeps working without a connection, and the browser may offer to install it. When a new version is available a dialog asks before updating.

### Where is my data stored?

Only in your browser. Models are never sent to a server; the share link *is* the model. See [Import, export & sharing](/essentials/import-export).

## Modelling

### How do I make a fixed / pinned / roller support?

Tick DOF checkboxes: **Dx + Dz + Ry** = fixed, **Dx + Dz** = pinned, **Dz** = roller. Every combination and its symbol is listed in [Nodes & supports](/essentials/nodes-supports#supports).

### How do I make a truss?

Use beam elements and tick **both End hinges** for every bar in the *Elements* tab. Apply loads at the joints. See [Elements](/essentials/elements#end-hinges).

### How do I put a hinge in a frame?

Tick the **End hinge** of the element on the side of the joint where the moment should be released. Hinging *one* element at a joint releases only that element.

### How do I add a support or a point load in the middle of a beam?

Add a node on the beam with *Add using mouse* and choose **Connect to structure**—the beam is split in two. For a point load alone you do not even need a node: use a **Concentrated load** element load with a position.

### Can I apply self-weight?

Not automatically. Enter it as a uniformly distributed load $f_z = \rho g A$.

### Can I model inclined supports?

Yes—set a **Nodal LCS angle** on the node; its DOFs are then interpreted in the rotated system.

### Are there load cases or combinations?

No, one load case only. Model each case separately and save or share it.

### Why do my loads point up?

Because global z points **down**: positive `Fz` is downward. See [conventions](/elements/conventions).

## Results

### Why is there no "Solve" button?

The model is solved automatically after every change. If no results appear the model is not solvable yet—[Troubleshooting](/reference/troubleshooting) lists what to check.

### Why does my deflection differ slightly from the formula?

EduBeam uses Timoshenko beams, so deflections include shear deformation. For slender members the difference is well below 1 %. Details and worked comparisons in [Checking results by hand](/guide/verification).

### How accurate are the results? Do I need more elements?

For linear static analysis the beam element is exact under the supported load types, so one element per member suffices. Extra nodes are only needed where you want a support, hinge, section change or node to attach a load to.

### Where are the reactions listed?

In the viewer, as arrows with values (enable **Reactions** in the display settings). Element end forces and nodal displacements are in the **Results** tab.

## Files & sharing

### How do I share a model?

**Share model** → **Copy**. The link contains the whole model. Recipients get their own editable copy; there is no live collaboration.

### Can I embed a model on my website or in slides?

Yes—add `&viewer=1` to a share link and put it in an `<iframe>`. See [Embed a read-only viewer](/essentials/import-export#embed-a-read-only-viewer).

### Can I export images or tables?

Not yet. Use a screenshot for images and copy the table text for numbers. Vote for the feature on [GitHub](https://github.com/janvorisek/edubeam/issues).

### Can I generate models programmatically?

Yes. The project file is plain JSON in SI units—see the [format description](/essentials/import-export#project-file-format)—and can be opened with *Open project* or drag-and-drop.

## Support

### How do I report a bug or request a feature?

Open an issue on [GitHub](https://github.com/janvorisek/edubeam/issues) and attach a share link or project file that reproduces it. Private support: [support@edubeam.app](mailto:support@edubeam.app).
