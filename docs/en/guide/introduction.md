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

<Edubeam /> is a free, browser-based **2D structural analysis** tool for beams, frames and trusses. You draw the structure, add supports and loads, and the finite element solver recomputes everything the moment you change anything. There is no *Solve* button, no installation and no account.

[Launch EduBeam](https://run.edubeam.app){target="_blank"} in a new tab and follow along with the [Quick start](/guide/quick-start).

![A three-hinged frame in EduBeam: loads in orange, reactions in purple, the bending moment in red and the deformed shape in grey](/screenshots/hero.webp)

## Your first visit

The first time you open the app, a welcome dialog asks how you would like to start and which units and axes you want. You can change both later in [Settings](/essentials/units-settings).

![The welcome dialog](/screenshots/welcome.webp){.shot-lg}

- **Show me around** points out the menu, undo and redo, the viewer buttons, the display options, the grid and units, and the bottom bar, one at a time.
- **Draw your first beam** is a seven-step guided task. You draw a beam with the mouse, support it, load it and read the results. A small card in the corner tells you what to do next.
- **Open an example** opens the gallery of ready-made models.

All three are also in the **☰ menu**, so you can come back to them at any time.

![Draw your first beam: the guide card stays in the corner while you work](/screenshots/first-beam-task.webp)

## What it does

| Area | Capabilities |
| --- | --- |
| **Structures** | Planar (x–z) beams, continuous beams, frames and trusses built from nodes and 2D Timoshenko beam elements. End hinges turn any member into a truss bar. |
| **Supports** | Pin, roller, fixed, slider and every other combination of restrained `Dx`, `Dz`, `Ry`, picked by symbol. Rotated supports through a nodal angle. Support settlements. |
| **Loads** | Nodal forces and moments, prescribed displacements, uniform and trapezoidal line loads, point forces and moments along a member, and uniform or gradient temperature. |
| **Sections** | Material and section libraries (European and US), plus a polygon editor that computes $A$, $I_y$, $I_z$, $I_{yz}$, principal axes and radii of gyration for any shape. |
| **Results** | Deformed shape, normal force **N**, shear force **V**, bending moment **M**, reactions, nodal displacements, element end forces and element stiffness matrices. |
| **Analysis** | Linear static analysis with one load case. Results are exact for the linear model, so no mesh refinement is needed. When a structure cannot be solved, EduBeam says why and animates how it can move. |
| **Files** | Save and open projects as JSON, share a whole model as a link, export the drawing as PNG or SVG and the results as CSV. Recently replaced models are kept so you can get them back. Everything stays on your device. |
| **Units** | SI or US customary in one click, or each quantity on its own. Axes either x right, z down or x right, y up. |

## What it does not do (yet)

Knowing the limits up front saves time:

- **2D only.** No out-of-plane behaviour, no 3D frames.
- **Linear static only.** No second-order (P–Δ) effects, no buckling, no dynamics, no plasticity.
- **One load case.** There are no load combinations or envelopes. Model each case separately and save each as its own file or share link.
- **No self-weight.** Apply it as a line load if you need it.
- **No design checks.** EduBeam gives you internal forces and displacements; code checks are up to you.

If a missing feature matters to you, [open an issue](https://github.com/janvorisek/edubeam/issues).

<ElementariumPromo placement="introduction" />

## Who is it for?

- **Students** learning structural mechanics who want instant feedback on hand calculations. See [Checking results by hand](/guide/verification).
- **Teachers** demonstrating how supports, hinges and loads change internal forces, live on a projector, in any of 12 languages. See [Teaching with EduBeam](/guide/teaching).
- **Engineers** who want a quick sanity check before opening a heavier desktop package.

## How this guide is organised

1. **Getting started.** This page, the [10-minute Quick start](/guide/quick-start) and ready-made [Examples](/examples/).
2. **Tutorials.** Complete models from start to finish, checked by hand: a [three-hinged frame](/tutorials/three-hinged-frame) and a [plane truss](/tutorials/truss).
3. **Modeling.** One page per building block: the [user interface](/essentials/user-interface), [nodes & supports](/essentials/nodes-supports), [elements, materials & sections](/essentials/elements), [loads](/essentials/loads), and [units & settings](/essentials/units-settings).
4. **Results.** How to [read the diagrams and tables](/essentials/results) and how to [verify them](/guide/verification).
5. **Files & sharing.** [Projects, share links, image and CSV export](/essentials/import-export), and [teaching with EduBeam](/guide/teaching).
6. **Reference.** [Keyboard, mouse & touch](/reference/shortcuts), [troubleshooting](/reference/troubleshooting) and the [FAQ](/faq/).
7. **Theory manual.** [Sign conventions](/elements/conventions) and the element formulations for the [beam](/elements/beam) and the [truss](/elements/truss).

The **?** icons in the app open the matching page of this guide in your language.

## Languages

The interface is available in English, Čeština, Deutsch, Español, Français, Polski, Português, Русский, Türkçe, Українська, ไทย and 汉语. EduBeam picks the language from your browser. Change it in **Settings → Language & Locale**, or open the app with a `?lang=` parameter, e.g. [run.edubeam.app/?lang=cs](https://run.edubeam.app/?lang=cs){target="_blank"}.

## Authors & credits

<Edubeam /> is led by [Jan Voříšek](https://github.com/janvorisek), the maintainer and product designer behind the modern web edition. The browser version is developed independently of CTU. The original desktop EduBeam for Windows and Linux was created by [Bořek Patzák](http://ksm.fsv.cvut.cz/~bp/), [Jan Stránský](https://mech.fsv.cvut.cz/~stransky/en/) and [Vít Šmilauer](https://mech.fsv.cvut.cz/~smilauer/) at the Department of Mechanics, [CTU Prague – Faculty of Civil Engineering](https://www.fsv.cvut.cz/en). The solver is the open-source [ts-fem](https://github.com/janvorisek/ts-fem) library.

<VPTeamMembers size="small" :members="members" />

## Contribute

- Report confusing behaviour or bugs as a [GitHub issue](https://github.com/janvorisek/edubeam/issues).
- Improve these docs or translations by editing the files in `docs/` and opening a pull request.
- Share EduBeam with classmates and colleagues.
