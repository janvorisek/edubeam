# Exemples

Chaque carte ci-dessous est un modèle vivant, déjà calculé. Cliquez sur l’une d’elles pour l’ouvrir dans <Edubeam /> avec toutes les données prêtes à être modifiées, puis déplacez un nœud, changez une charge ou cochez une rotule et regardez les diagrammes suivre.

<br>

<FeatureStructures />

Les mêmes modèles se trouvent dans l’application sous **☰ → Exemples**, et [run.edubeam.app/?panel=examples](https://run.edubeam.app/?panel=examples&lang=fr){target="_blank"} ouvre directement cette galerie.

## Exercices proposés {#suggested-exercises}

- **Poutre hyperstatique** : décochez `Ry` à l’encastrement pour obtenir une poutre sur deux appuis. De combien le moment à mi-portée augmente-t-il ?
- **Console** : comparez la flèche à l’extrémité avec $FL^3/3EI$ (voir [Vérifier les résultats à la main](/fr/guide/verification)), puis divisez $I_y$ par deux dans l’onglet *Sections*.
- **Treillis Pratt** : les nœuds de cet exemple sont rigides. Cochez les deux rotules d’extrémité de chaque barre pour en faire un vrai treillis, puis comparez les efforts normaux. Supprimez maintenant une diagonale : le treillis tient-il encore ?
- **Poutre continue à trois travées** : la poutre n’est appuyée qu’à ses extrémités. Cochez `Dz` aux nœuds intérieurs B et C pour la rendre continue, et regardez les moments négatifs apparaître sur les appuis.
- **Portique** : cochez les deux rotules d’extrémité de la traverse pour modéliser des assemblages poutre-poteau articulés, ou remplacez l’appui simple de droite par une articulation.
- **Charge thermique** : bloquez `Dx` aux deux appuis et regardez l’effort normal apparaître.

## Tutoriels résolus {#worked-tutorials}

- [Portique à trois articulations](/fr/tutorials/three-hinged-frame) : réactions, N, V et M vérifiés à la main.
- [Treillis plan](/fr/tutorials/truss) : méthode des nœuds, méthode des sections et barre à effort nul.

## Proposer un exemple {#contribute-an-example}

Vous avez un bon modèle pédagogique ? Partagez son lien sur [GitHub Discussions](https://github.com/janvorisek/edubeam/discussions) ou [Twitter](https://twitter.com/EdubeamApp) et nous l’ajouterons à la galerie.
