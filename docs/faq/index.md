# Frequently Asked Questions

## Getting started

### Q: What is <Edubeam />?

A: <Edubeam /> is a browser-based solver for 2D beams, trusses, and simple frames. It is built for students, teachers, and practitioners who need quick FEM feedback without installing desktop software.

### Q: Is it really free?

A: Yes. Edubeam runs entirely in your browser and is free to use in classrooms, studios, and personal projects. The codebase is open source, so you can audit or contribute to it.

### Q: Do I have to sign up or download anything?

A: Nope. Launch [run.edubeam.app](https://run.edubeam.app) in any modern browser and you are ready to model. There are no accounts, logins, or installers.

### Q: Which browsers and devices are supported?

A: Chrome, Edge, Firefox, and Safari on desktop provide the best experience. Tablets work for quick edits or reviews, but precise modeling is easier with a keyboard and mouse.

### Q: Does Edubeam limit the number of projects?

A: There is no project cap. Models stay in your browser storage or in files you export, so you can keep as many as your device can handle.

## Working with models

### Q: Where do I find sample projects or templates?

A: Open the [Examples](/examples/) page in the docs and click any preset to load it directly in the app. It is the fastest way to explore supported scenarios.

### Q: Can I change units or language?

A: Yes. Units are selectable when you create or open a model, and languages can be switched from the app bar or by adding `?lang=` (for example, `?lang=cs`) to the app URL.

### Q: How do I recover an earlier state of my model?

A: Use the built-in undo/redo history in the bottom bar. For longer sessions, export the project as JSON so you can re-import it later.

## Sharing and privacy

### Q: How do I share my model with others?

A: Click **Share model** to generate a URL that encodes your current setup. Send that link to classmates or reviewers and they can open the exact same configuration.

### Q: Are edits synchronized between collaborators?

A: No. Edubeam has no real-time server component. Each person who opens the link works on their own local copy, so remember to resend the link after making changes.

### Q: What happens to my data—do you store it?

A: We do not keep user models or personal data on our servers. All computations run in your browser, and anything you save stays on your device unless you choose to share it.

## Troubleshooting and support

### Q: My model shows “system is unstable.” What should I check?

A: Ensure the structure has enough restraints (no free rigid-body modes), confirm elements are properly connected, and verify units. The [Essentials](/essentials/elements) and [Guide](/guide/user-interface) sections walk through common fixes.

### Q: How do I report a bug or request a feature?

A: Open an issue on [GitHub](https://github.com/janvorisek/edubeam/issues) with steps to reproduce or a description of the enhancement you need. Screenshots and attached JSON exports help a lot.

### Q: Who do I contact for private support?

A: Email [support@edubeam.app](mailto:support@edubeam.app). Include your browser version, operating system, and (if possible) the share link or export that demonstrates the problem.

Still curious? Explore the rest of the docs or jump straight into the app to experiment.
