<script setup>
import { VPTeamMembers } from 'vitepress/theme'

const members = [
  {
    avatar: 'https://www.github.com/janvorisek.png',
    name: 'Jan Voříšek',
    title: 'Lead developer & product designer',
    links: [
      { icon: 'github', link: 'https://github.com/janvorisek' },
      { icon: 'twitter', link: 'https://twitter.com/janvorisekdev' },
    ]
  },
  {
    avatar: 'https://www.github.com/bpatzak.png',
    name: 'Bořek Patzák',
    title: 'FEM solver, Author of the legacy app',
    links: [
      { icon: 'github', link: 'https://github.com/bpatzak' },
    ]
  }
]
</script>

# Introduction

<Edubeam /> is a free, browser-based **2D structural analysis** tool for beams, frames and trusses. You draw the structure, add supports and loads, and the finite element solver recomputes everything the moment you change anything—no "Solve" button, no installation, no account.

[Launch EduBeam](https://run.edubeam.app){target="_blank"} in a new tab and follow along with the [Quick start](/guide/quick-start).

<figure>
  <a href="https://run.edubeam.app" target="_blank">
    <WelcomeStructure />
  </a>
  <figcaption>A statically indeterminate beam, solved live in the browser</figcaption>
</figure>

## What it does

| Area | Capabilities |
| --- | --- |
| **Structures** | Planar (x–z) beams, continuous beams, frames and trusses built from nodes and 2D Timoshenko beam elements. End hinges turn any member into a truss bar. |
| **Supports** | Any combination of restrained `Dx`, `Dz`, `Ry` at a node → fixed, pinned, roller, sliding… Skewed supports via a nodal coordinate-system angle. |
| **Loads** | Nodal forces and moments, prescribed displacements (support settlements), uniform and trapezoidal line loads (global or local), concentrated loads along a member, and uniform / gradient temperature loads. |
| **Results** | Deformed shape, normal force **N**, shear force **V<sub>z</sub>**, bending moment **M<sub>y</sub>**, reactions, nodal displacements, element end forces and per-element stiffness matrices. |
| **Analysis** | Linear static analysis with a single load case. Results are exact for the linear model (no mesh refinement needed). |
| **Files** | Save/open projects as JSON, share a whole model as a URL, embed a read-only viewer. Everything stays on your device. |
| **Units** | Independently selectable units for length, area, second moment of area, mass, force, moment and pressure (metric and imperial). |

## What it does not do (yet)

Knowing the limits up front saves time:

- **2D only** — no out-of-plane behaviour, no 3D frames.
- **Linear static only** — no second-order (P–Δ) effects, no buckling, no dynamics, no plasticity.
- **One load case** — there are no load combinations or envelopes. Model each case separately (save each as its own file or share link).
- **No self-weight** — apply it as a line load if you need it.
- **No design checks** — EduBeam gives you internal forces and displacements; code checks are up to you.

If a missing feature matters to you, [open an issue](https://github.com/janvorisek/edubeam/issues).

## Who is it for?

- **Students** learning structural mechanics who want instant feedback on hand calculations. See [Checking results by hand](/guide/verification).
- **Teachers** demonstrating how supports, hinges and loads change internal forces—live, on a projector, in any of 11 languages.
- **Engineers** who want a quick sanity check before opening a heavier desktop package.

## How the documentation is organised

1. **Getting started** — this page, the [10-minute Quick start](/guide/quick-start) and ready-made [Examples](/examples/).
2. **Modeling** — one page per building block: [user interface](/essentials/user-interface), [nodes & supports](/essentials/nodes-supports), [elements, materials & sections](/essentials/elements), [loads](/essentials/loads), [units & settings](/essentials/units-settings).
3. **Results** — how to [read the diagrams and tables](/essentials/results) and how to [verify them](/guide/verification).
4. **Files & sharing** — [JSON projects, share links and the embeddable viewer](/essentials/import-export).
5. **Reference** — [keyboard & mouse](/reference/shortcuts), [troubleshooting](/reference/troubleshooting) and the [FAQ](/faq/).
6. **Theory manual** — [sign conventions](/elements/conventions) and the element formulations for the [beam](/elements/beam) and [truss](/elements/truss).

## Languages

The interface is available in English, Čeština, Deutsch, Español, Français, Polski, Português, Русский, Українська, ไทย and 汉语. EduBeam picks the language from your browser; change it in **Settings → Language & Locale** or open the app with a `?lang=` parameter, e.g. [run.edubeam.app/?lang=cs](https://run.edubeam.app/?lang=cs){target="_blank"}.

## Authors & credits

<Edubeam /> is led by [Jan Voříšek](https://github.com/janvorisek), the maintainer and product designer behind the modern web edition. The browser version is developed independently of CTU; the original desktop EduBeam for Windows/Linux was created by [Bořek Patzák](http://ksm.fsv.cvut.cz/~bp/), [Jan Stránský](https://mech.fsv.cvut.cz/~stransky/en/) and [Vít Šmilauer](https://mech.fsv.cvut.cz/~smilauer/) at the Department of Mechanics, [CTU Prague – Faculty of Civil Engineering](https://www.fsv.cvut.cz/en). The solver is the open-source [ts-fem](https://github.com/janvorisek/ts-fem) library.

<VPTeamMembers size="small" :members="members" />

## Contribute

- Report confusing behaviour or bugs as a [GitHub issue](https://github.com/janvorisek/edubeam/issues).
- Improve these docs or translations by editing the files in `docs/` and opening a pull request.
- Share EduBeam with classmates and colleagues.
