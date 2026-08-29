<script setup>
import { VPTeamMembers } from 'vitepress/theme'

const members = [
  {
    avatar: 'https://www.github.com/janvorisek.png',
    name: 'Jan Voříšek',
    title: 'Développeur principal et concepteur du produit',
    links: [
      { icon: 'github', link: 'https://github.com/janvorisek' },
      { icon: 'twitter', link: 'https://twitter.com/janvorisekdev' },
    ]
  },
  {
    avatar: 'https://www.github.com/bpatzak.png',
    name: 'Bořek Patzák',
    title: 'Solveur EF, auteur de l’application d’origine',
    links: [
      { icon: 'github', link: 'https://github.com/bpatzak' },
    ]
  }
]
</script>

# Introduction

<Edubeam /> est un outil gratuit, exécuté dans le navigateur, pour le **calcul des structures planes à barres** : poutres, portiques et treillis. Vous dessinez la structure, placez appuis et charges, et le solveur par éléments finis recalcule tout à l’instant où vous modifiez quoi que ce soit. Pas de bouton « Calculer », pas d’installation, pas de compte.

[Lancez EduBeam](https://run.edubeam.app/?lang=fr){target="_blank"} dans un nouvel onglet et suivez le [Démarrage rapide](/fr/guide/quick-start).

<figure>
  <a href="https://run.edubeam.app/?lang=fr" target="_blank">
    <WelcomeStructure />
  </a>
  <figcaption>Une poutre hyperstatique résolue en direct dans le navigateur</figcaption>
</figure>

## Ce qu’il fait

| Domaine | Possibilités |
| --- | --- |
| **Structures** | Poutres, poutres continues, portiques et treillis plans (x–z) composés de nœuds et d’éléments poutre 2D (poutre de Timoshenko). Les rotules d’extrémité transforment n’importe quelle barre en barre de treillis. |
| **Appuis** | Toute combinaison de degrés de liberté bloqués `Dx`, `Dz`, `Ry` en un nœud → encastrement, articulation (appui double), appui simple (glissant), encastrement glissant… Appuis inclinés via un angle du repère du nœud. |
| **Charges** | Forces et moments nodaux, déplacements imposés (tassements d’appui), charges réparties uniformes et trapézoïdales (en repère global ou local), charges ponctuelles en tout point d’une barre, charges thermiques uniformes ou avec gradient. |
| **Résultats** | Déformée, effort normal **N**, effort tranchant **V<sub>z</sub>**, moment fléchissant **M<sub>y</sub>**, réactions, déplacements nodaux, efforts aux extrémités des barres et matrices de rigidité élémentaires. |
| **Calcul** | Analyse statique linéaire avec un seul cas de charge. Les résultats sont exacts pour le modèle linéaire (aucun raffinement de maillage nécessaire). |
| **Fichiers** | Enregistrer/ouvrir des projets en JSON, partager un modèle complet sous forme d’URL, intégrer une visionneuse en lecture seule. Tout reste sur votre appareil. |
| **Unités** | Unités choisies indépendamment pour la longueur, l’aire, le moment quadratique, la masse, la force, le moment et la contrainte (métriques et impériales). |

## Ce qu’il ne fait pas (encore)

Connaître les limites à l’avance fait gagner du temps :

- **2D uniquement** : pas de comportement hors plan, pas de portiques spatiaux.
- **Statique linéaire uniquement** : pas d’effets du second ordre (P–Δ), de flambement, de dynamique ni de plasticité.
- **Un seul cas de charge** : pas de combinaisons ni d’enveloppes. Modélisez chaque cas séparément (enregistrez-le comme fichier ou lien distinct).
- **Pas de poids propre** : appliquez-le comme charge répartie si nécessaire.
- **Pas de vérifications réglementaires** : EduBeam fournit sollicitations et déplacements ; la justification selon les normes vous appartient.

Si une fonctionnalité manquante vous importe, [ouvrez un ticket](https://github.com/janvorisek/edubeam/issues).

## À qui s’adresse-t-il ?

- **Étudiants** en résistance des matériaux et calcul des structures qui veulent vérifier instantanément leurs calculs à la main. Voir [Vérifier les résultats à la main](/fr/guide/verification).
- **Enseignants** qui montrent comment appuis, rotules et charges modifient les diagrammes de sollicitations — en direct, au vidéoprojecteur, dans l’une des 11 langues.
- **Ingénieurs** qui ont besoin d’une vérification rapide avant d’ouvrir le « gros » logiciel.

## Organisation de la documentation

1. **Premiers pas** : cette page, le [Démarrage rapide en 10 minutes](/fr/guide/quick-start) et les [Exemples](/fr/examples/) prêts à l’emploi.
2. **Modélisation** : une page par brique : [interface](/fr/essentials/user-interface), [nœuds et appuis](/fr/essentials/nodes-supports), [éléments, matériaux et sections](/fr/essentials/elements), [charges](/fr/essentials/loads), [unités et paramètres](/fr/essentials/units-settings).
3. **Résultats** : comment [lire les diagrammes et tableaux](/fr/essentials/results) et comment les [vérifier](/fr/guide/verification).
4. **Fichiers et partage** : [projets JSON, liens et visionneuse intégrable](/fr/essentials/import-export).
5. **Référence** : [clavier et souris](/fr/reference/shortcuts), [dépannage](/fr/reference/troubleshooting) et la [FAQ](/fr/faq/).
6. **Manuel théorique** : [conventions de signe](/fr/elements/conventions) et formulations des éléments [poutre](/fr/elements/beam) et [barre de treillis](/fr/elements/truss).

## Langues

L’interface est disponible en français, anglais, tchèque, allemand, espagnol, polonais, portugais, russe, ukrainien, thaï et chinois. EduBeam choisit la langue d’après le navigateur ; changez-la dans **Paramètres → Langue et paramètres régionaux** ou ouvrez l’application avec le paramètre `?lang=`, par exemple [run.edubeam.app/?lang=fr](https://run.edubeam.app/?lang=fr){target="_blank"}.

## Auteurs et remerciements

<Edubeam /> est dirigé par [Jan Voříšek](https://github.com/janvorisek), mainteneur et concepteur de l’édition web moderne. La version navigateur est développée indépendamment de la ČVUT ; l’EduBeam de bureau d’origine pour Windows/Linux a été créé par [Bořek Patzák](http://ksm.fsv.cvut.cz/~bp/), [Jan Stránský](https://mech.fsv.cvut.cz/~stransky/en/) et [Vít Šmilauer](https://mech.fsv.cvut.cz/~smilauer/) au Département de mécanique de la [Faculté de génie civil de l’Université technique tchèque de Prague](https://www.fsv.cvut.cz/en). Le solveur est la bibliothèque open source [ts-fem](https://github.com/janvorisek/ts-fem).

<VPTeamMembers size="small" :members="members" />

## Contribuer

- Signalez les comportements déroutants ou les bogues dans un [ticket GitHub](https://github.com/janvorisek/edubeam/issues).
- Améliorez cette documentation ou les traductions en modifiant les fichiers de `docs/` et en ouvrant une pull request.
- Faites connaître EduBeam à vos camarades et collègues.
