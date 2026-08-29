# Examples

Every card below is a live, solved model. Click one to open it in <Edubeam /> with the full setup ready to edit—then drag a node, change a load or tick a hinge and watch the diagrams follow.

<br>

<FeatureStructures />

## Suggested exercises

- **Indeterminate beam** — untick `Ry` at the fixed end to make it simply supported. How much does the mid-span moment grow?
- **Cantilever** — compare the tip deflection with $FL^3/3EI$ (see [Checking results by hand](/guide/verification)); then halve $I_y$ in the *Cross sections* tab.
- **Pratt truss** — remove one diagonal. Does the truss still stand? Which bars carry the most axial force?
- **Three-span continuous beam** — add a `Dz` support at the mid-span nodes; observe the hogging moments over supports.
- **Portal frame** — tick both end hinges on the beam to model a pinned beam-column connection, or make the right support pinned instead of a roller.
- **Temperature load** — restrain `Dx` at both supports and watch the axial force appear.

## Contribute an example

Have a good teaching model? Share it via a link on [GitHub Discussions](https://github.com/janvorisek/edubeam/discussions) or [Twitter](https://twitter.com/EdubeamApp) and we will add it to the gallery.
