---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "EduBeam"
  text: "Free structural analysis online"
  tagline: Draw a beam, frame or truss, add loads, and watch the diagrams update as you edit. Full FEM results in your browser, with no install, no account and no fees.
  image:
    src: /screenshots/hero.webp
    alt: EduBeam app with a solved frame
  actions:
    - theme: brand
      text: Launch the app
      link: https://run.edubeam.app
    - theme: alt
      text: Read the guide
      link: /guide/introduction
    - theme: alt
      text: See examples
      link: /examples/

features:
  - icon: ⚡
    title: Results as you draw
    details: There is no Solve button. Drag a node, tick a hinge or change a load, and N, V, M, reactions and the deformed shape follow at once.
    link: /essentials/results
    linkText: Reading results
  - icon: 🧑‍🏫
    title: Built for teaching
    details: Guided first steps, hover values, a solver that explains why a structure is a mechanism, and share links you can put in lecture notes.
    link: /guide/teaching
    linkText: Teaching with EduBeam
  - icon: 🌍
    title: Your language, your units
    details: 12 interface languages, SI or US customary units, and a choice of z-down or textbook y-up axes.
    link: /essentials/units-settings
    linkText: Units & settings
  - icon: 🔗
    title: Share, export, embed
    details: Send a whole model as a link, save it as a file, export the drawing as PNG or SVG and the result tables as CSV.
    link: /essentials/import-export
    linkText: Files & sharing
---

## Start here

<div class="start-grid">

**New to EduBeam?** Follow the [10-minute Quick start](/guide/quick-start). You model a simply supported beam step by step and check every result by hand.

**Know what you want to build?** Jump to a [tutorial](/tutorials/three-hinged-frame) or open a ready-made [example](/examples/) and change it.

**Teaching a course?** See [Teaching with EduBeam](/guide/teaching): share links for assignments, an embeddable viewer for slides, and exercises.

</div>

<div class="shots">

![A truss: axial forces, tension positive](/screenshots/tut-truss.webp)

![A mechanism made visible: EduBeam shows why it cannot be solved](/screenshots/ui-mechanism.webp)

</div>

## What you can model

- **Beams, frames and trusses** in the plane: continuous beams, portal frames, three-hinged arches, pin-jointed trusses.
- **Any support**: pin, roller, fixed, slider, rotated supports, and support settlements.
- **Loads**: point forces and moments, uniform and trapezoidal line loads, point loads anywhere along a member, and temperature.
- **Any section**: from the library (IPE, HEA, AISC W, HSS, rectangles, tubes) or drawn as a polygon, with its properties computed for you.

Find out more in the [Introduction](/guide/introduction).

<ElementariumPromo />
