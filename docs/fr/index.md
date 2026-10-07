---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "EduBeam"
  text: "Calcul des structures gratuit en ligne"
  tagline: Dessinez une poutre, un portique ou un treillis, ajoutez des charges et regardez les diagrammes se mettre à jour pendant que vous modifiez. Des résultats éléments finis complets dans votre navigateur, sans installation, sans compte et sans frais.
  image:
    src: /screenshots/fr/hero.webp
    alt: L’application EduBeam avec un portique calculé
  actions:
    - theme: brand
      text: Lancer l’application
      link: https://run.edubeam.app/?lang=fr
    - theme: alt
      text: Lire le guide
      link: /fr/guide/introduction
    - theme: alt
      text: Voir les exemples
      link: /fr/examples/

features:
  - icon: ⚡
    title: Des résultats pendant que vous dessinez
    details: Il n’y a pas de bouton Calculer. Déplacez un nœud, cochez une rotule ou modifiez une charge, et N, V, M, les réactions et la déformée suivent aussitôt.
    link: /fr/essentials/results
    linkText: Lire les résultats
  - icon: 🧑‍🏫
    title: Pensé pour l’enseignement
    details: Premiers pas guidés, valeurs au survol, un solveur qui explique pourquoi une structure est un mécanisme, et des liens de partage à glisser dans vos supports de cours.
    link: /fr/guide/teaching
    linkText: Enseigner avec EduBeam
  - icon: 🌍
    title: Votre langue, vos unités
    details: 12 langues d’interface, unités SI ou impériales US, et au choix des axes z vers le bas ou y vers le haut comme dans les manuels.
    link: /fr/essentials/units-settings
    linkText: Unités et paramètres
  - icon: 🔗
    title: Partager, exporter, intégrer
    details: Envoyez tout un modèle sous forme de lien, enregistrez-le dans un fichier, exportez le dessin en PNG ou SVG et les tableaux de résultats en CSV.
    link: /fr/essentials/import-export
    linkText: Fichiers et partage
---

## Pour commencer {#start-here}

<div class="start-grid">

**Vous découvrez EduBeam ?** Suivez le [Démarrage rapide en 10 minutes](/fr/guide/quick-start). Vous modélisez pas à pas une poutre sur deux appuis et vérifiez chaque résultat à la main.

**Vous savez ce que vous voulez modéliser ?** Passez directement à un [tutoriel](/fr/tutorials/three-hinged-frame) ou ouvrez un [exemple](/fr/examples/) prêt à l’emploi et modifiez-le.

**Vous enseignez ?** Consultez [Enseigner avec EduBeam](/fr/guide/teaching) : liens de partage pour les devoirs, visionneuse intégrable pour les diapositives et exercices.

</div>

<div class="shots">

![Un treillis : efforts normaux, traction positive](/screenshots/fr/tut-truss.webp)

![Un mécanisme rendu visible : EduBeam montre pourquoi il ne peut pas être calculé](/screenshots/fr/ui-mechanism.webp)

</div>

## Ce que vous pouvez modéliser {#what-you-can-model}

- **Poutres, portiques et treillis** dans le plan : poutres continues, portiques simples, arcs et portiques à trois articulations, treillis articulés.
- **Tout type d’appui** : articulation, appui glissant, encastrement, encastrement glissant, appuis inclinés et tassements d’appui.
- **Charges** : forces et moments ponctuels, charges linéaires uniformes et trapézoïdales, charges ponctuelles en tout point d’une barre, et température.
- **Toute section** : issue de la bibliothèque (IPE, HEA, AISC W, HSS, rectangles, tubes) ou dessinée comme un polygone, avec ses caractéristiques calculées pour vous.

Pour en savoir plus, lisez l’[Introduction](/fr/guide/introduction).

<ElementariumPromo />
