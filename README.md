<p align="center">
  <a href="https://github.com/janvorisek/edubeam">
    <img src="src/assets/logo.svg" alt="edubeam logo" width="90" height="90">
  </a>
</p>

<h1 align="center">edubeam</h1>

<p align="center">
  <strong>Free online structural analysis software for 2D beams, trusses, and frames.</strong><br/>
  Real-time solver, Timoshenko beam formulation, sharable projects, and fully localized UI—perfect for classrooms, design studios, and hobby labs.
</p>

<p align="center">
  <a href="https://run.edubeam.app"><strong>Launch the web app</strong></a> ·
  <a href="https://edubeam.app"><strong>Read the documentation</strong></a> ·
  <a href="https://run.edubeam.app/?panel=examples"><strong>Explore example models</strong></a>
</p>

<p align="center">
  <img alt="Contributors" src="https://img.shields.io/github/contributors/janvorisek/edubeam?color=0f9d58">
  <img alt="Issues" src="https://img.shields.io/github/issues/janvorisek/edubeam">
  <img alt="License" src="https://img.shields.io/github/license/janvorisek/edubeam">
</p>

## Table of contents

- [Why edubeam?](#why-edubeam)
- [Product highlights](#product-highlights)
- [Launch & try it](#launch--try-it)
- [Development setup](#development-setup)
- [Available scripts](#available-scripts)
- [Documentation & localization](#documentation--localization)
- [Contributing](#contributing)
- [License](#license)

## Why edubeam?

Edubeam is a lightweight yet professional-grade **finite element environment for 2D structural analysis**. Created by civil engineers and educators, it helps you:

- Teach structural mechanics, stiffness matrices, and load paths with a live, visual tool.
- Validate early-stage beam or truss designs without installing heavy desktop suites.
- Share reproducible models via URLs or JSON for peer review, grading, or collaboration.

Under the hood Edubeam combines a Timoshenko beam formulation, axial truss elements, static condensation, and temperature/load tools into a single browser experience. Everything runs client-side, which means **zero install, zero license servers, and instant updates**.

[![Live view of Edubeam](docs/public/download.png)](https://run.edubeam.app)

## Product highlights

- **Real-time structural analysis** – Every edit recalculates reactions, nodal displacements, and internal forces on the fly.
- **Comprehensive loading** – Point loads, distributed loads, prescribed displacements, settlement, and thermal gradients.
- **Rich visualization** – Overlay undeformed/deformed shapes, N-V-M diagrams, support reactions, and coordinate HUD to spot issues quickly.
- **Timoshenko beams + truss elements** – Mix frame members and axial-only elements in the same model.
- **Education-ready** – Show stiffness matrices, DOFs, and solver details to connect theory with practice.
- **Localization & accessibility** – Full UI translations (EN, CS, DE, ES, FR, ZH) plus keyboard-friendly navigation.
- **Open source & extensible** – Vue 3 + Vite + TypeScript front-end, Pinia state management, and a dedicated documentation site built with VitePress.

## Launch & try it

1. **Open the live app** – [https://run.edubeam.app](https://run.edubeam.app)
2. **Load an example** – use the *Examples* sidebar or jump straight to the [gallery](https://run.edubeam.app/?panel=examples).
3. **Inspect the guides** – the [Introduction](https://edubeam.app/guide/introduction) and [User Interface](https://edubeam.app/guide/user-interface) pages mirror the workflow inside the app.
4. **Share your work** – use *Share model* to generate a link or download a JSON snapshot for grading and archives.

Edubeam is optimized for desktops/laptops but also runs on tablets with mouse or pencil input.

## Development setup

Requirements:

- Node.js **20.x**
- npm, pnpm, or yarn (examples below use `npm`)

```bash
git clone https://github.com/janvorisek/edubeam.git
cd edubeam
npm install
npm run dev
```

The Vite dev server starts at `http://localhost:5173` with hot-module reloading.

### Production build

```bash
npm run build
```

Assets are emitted to `dist/` and can be deployed to any static host. The main branch is continuously deployed to [run.edubeam.app](https://run.edubeam.app).

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the application in development mode (Vite) |
| `npm run build` | Produce the production bundle |
| `npm run test` / `npm run test:run` | Execute unit tests via Vitest |
| `npm run lint` | Run ESLint with auto-fix |
| `npm run docs:dev` | Launch the VitePress docs locally |
| `npm run docs:build` | Build the static documentation site |

## Documentation & localization

- **Docs hub:** [https://edubeam.app](https://edubeam.app) (built with VitePress).
- **Guides:** introduction, UI tour, essentials, and theory manuals (Timoshenko beam, truss element).
- **Languages:** English plus localized content for Czech, German, Spanish, French, and Chinese, matching the in-app translations.
- **FAQ & examples:** curated to help educators drop Edubeam into lesson plans immediately.

If you are improving docs, run `npm run docs:dev` for live previews.

## Contributing

We welcome bug reports, feature ideas, documentation edits, and localisation help. To get started:

1. Check existing [issues](https://github.com/janvorisek/edubeam/issues) or open a new one (bug/feature templates available).
2. Fork the repo and create a feature branch (`git checkout -b feature/your-topic`).
3. Commit with clear messages, run tests/linting, and submit a pull request.

Please keep PRs scope-focused (one fix/feature per PR) and include screenshots when changing UI flows.

## License

Distributed under the **GPL-3.0** license. See [`LICENSE`](LICENSE) for the full text.
