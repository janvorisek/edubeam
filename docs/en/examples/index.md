# Examples

Every card below is a live, solved model. Click one to open it in <Edubeam /> with the full setup ready to edit—then drag a node, change a load or tick a hinge and watch the diagrams follow.

<br>

<FeatureStructures />

The same models are in the app under **☰ → Examples**, and [run.edubeam.app/?panel=examples](https://run.edubeam.app/?panel=examples){target="_blank"} opens that gallery directly.

## Suggested exercises

- **Indeterminate beam**: untick `Ry` at the fixed end to make it simply supported. How much does the mid-span moment grow?
- **Cantilever**: compare the tip deflection with $FL^3/3EI$ (see [Checking results by hand](/guide/verification)), then halve $I_y$ in the *Cross sections* tab.
- **Pratt truss**: the joints in this example are rigid. Tick both end hinges on every bar to make it a true truss, then compare the axial forces. Now remove one diagonal: does the truss still stand?
- **Three-span continuous beam**: the beam is supported only at its ends. Tick `Dz` at the inner nodes B and C to make it continuous, and watch the hogging moments appear over the supports.
- **Portal frame**: tick both end hinges on the beam to model pinned beam-column connections, or make the right support a pin instead of a roller.
- **Temperature load**: restrain `Dx` at both supports and watch the axial force appear.

## Worked tutorials

- [Three-hinged frame](/tutorials/three-hinged-frame): reactions, N, V and M checked by hand.
- [Plane truss](/tutorials/truss): method of joints, method of sections and a zero-force member.

## Contribute an example

Have a good teaching model? Share it via a link on [GitHub Discussions](https://github.com/janvorisek/edubeam/discussions) or [Twitter](https://twitter.com/EdubeamApp) and we will add it to the gallery.
