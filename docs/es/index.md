---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "EduBeam"
  text: "Análisis estructural gratuito en línea"
  tagline: Dibuja una viga, un pórtico o una celosía, añade cargas y observa cómo los diagramas se actualizan mientras editas. Resultados MEF completos en tu navegador, sin instalación, sin cuenta y sin coste.
  image:
    src: /screenshots/es/hero.webp
    alt: La aplicación EduBeam con un pórtico resuelto
  actions:
    - theme: brand
      text: Abrir la aplicación
      link: https://run.edubeam.app/?lang=es
    - theme: alt
      text: Leer la guía
      link: /es/guide/introduction
    - theme: alt
      text: Ver ejemplos
      link: /es/examples/

features:
  - icon: ⚡
    title: Resultados mientras dibujas
    details: No hay botón Calcular. Arrastra un nodo, marca una rótula o cambia una carga, y N, V, M, las reacciones y la deformada se actualizan al instante.
    link: /es/essentials/results
    linkText: Leer los resultados
  - icon: 🧑‍🏫
    title: Pensado para la docencia
    details: Primeros pasos guiados, valores al pasar el ratón, un solver que explica por qué una estructura es un mecanismo y enlaces para compartir que puedes incluir en tus apuntes.
    link: /es/guide/teaching
    linkText: Enseñar con EduBeam
  - icon: 🌍
    title: Tu idioma, tus unidades
    details: 12 idiomas de interfaz, unidades SI o estadounidenses y ejes con z hacia abajo o con y hacia arriba como en los libros de texto.
    link: /es/essentials/units-settings
    linkText: Unidades y ajustes
  - icon: 🔗
    title: Compartir, exportar, incrustar
    details: Envía un modelo completo como enlace, guárdalo como archivo, exporta el dibujo en PNG o SVG y las tablas de resultados en CSV.
    link: /es/essentials/import-export
    linkText: Archivos y compartir
---

## Empieza aquí {#start-here}

<div class="start-grid">

**¿Eres nuevo en EduBeam?** Sigue el [Inicio rápido de 10 minutos](/es/guide/quick-start). Modelarás paso a paso una viga biapoyada y comprobarás cada resultado a mano.

**¿Sabes ya qué quieres modelar?** Ve directamente a un [tutorial](/es/tutorials/three-hinged-frame) o abre un [ejemplo](/es/examples/) ya preparado y modifícalo.

**¿Impartes un curso?** Consulta [Enseñar con EduBeam](/es/guide/teaching): enlaces para compartir en los ejercicios, un visor incrustable para las diapositivas y ejercicios propuestos.

</div>

<div class="shots">

![Una celosía: esfuerzos axiles, tracción positiva](/screenshots/es/tut-truss.webp)

![Un mecanismo hecho visible: EduBeam muestra por qué no se puede resolver](/screenshots/es/ui-mechanism.webp)

</div>

## Qué puedes modelar {#what-you-can-model}

- **Vigas, pórticos y celosías** en el plano: vigas continuas, pórticos simples, arcos triarticulados, celosías de nudos articulados.
- **Cualquier apoyo**: articulado, móvil, empotrado, deslizadera, apoyos girados y asientos de apoyo.
- **Cargas**: fuerzas y momentos puntuales, cargas lineales uniformes y trapezoidales, cargas puntuales en cualquier punto de una barra y cargas térmicas.
- **Cualquier sección**: de la biblioteca (IPE, HEA, AISC W, HSS, rectangulares, tubos) o dibujada como polígono, con sus propiedades calculadas automáticamente.

Más información en la [Introducción](/es/guide/introduction).

<ElementariumPromo />
