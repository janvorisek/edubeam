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

<Edubeam /> est un outil gratuit, exécuté dans le navigateur, pour le **calcul des structures planes** : poutres, portiques et treillis. Vous dessinez la structure, ajoutez appuis et charges, et le solveur par éléments finis recalcule tout dès que vous modifiez quoi que ce soit. Il n’y a pas de bouton *Calculer*, pas d’installation et pas de compte.

[Lancez EduBeam](https://run.edubeam.app/?lang=fr){target="_blank"} dans un nouvel onglet et suivez le [Démarrage rapide](/fr/guide/quick-start).

![Un portique à trois articulations dans EduBeam : charges en orange, réactions en violet, moment fléchissant en rouge et déformée en gris](/screenshots/fr/hero.webp)

## Votre première visite {#your-first-visit}

À la première ouverture de l’application, une fenêtre d’accueil vous demande comment vous souhaitez commencer, ainsi que les unités et les axes que vous voulez utiliser. Vous pourrez modifier ces deux choix plus tard dans les [Paramètres](/fr/essentials/units-settings).

![La fenêtre d’accueil](/screenshots/fr/welcome.webp){.shot-lg}

- **Faire le tour** présente un à un le menu, l’annulation et le rétablissement, les boutons de la visionneuse, les options d’affichage, la grille et les unités, et la barre inférieure.
- **Dessiner votre première poutre** est une tâche guidée en sept étapes. Vous dessinez une poutre à la souris, vous l’appuyez, vous la chargez et vous lisez les résultats. Une petite carte dans le coin vous indique la marche à suivre.
- **Ouvrir un exemple** ouvre la galerie de modèles prêts à l’emploi.

Les trois se trouvent aussi dans le **menu ☰** : vous pouvez y revenir à tout moment.

![Dessiner votre première poutre : la carte du guide reste dans le coin pendant que vous travaillez](/screenshots/fr/first-beam-task.webp)

## Ce qu’il fait {#what-it-does}

| Domaine | Possibilités |
| --- | --- |
| **Structures** | Poutres, poutres continues, portiques et treillis plans (x–z) composés de nœuds et d’éléments poutre 2D de Timoshenko. Les rotules d’extrémité transforment n’importe quelle barre en barre de treillis. |
| **Appuis** | Articulation, appui simple, encastrement, glissière et toutes les autres combinaisons de `Dx`, `Dz`, `Ry` bloqués, choisies par leur symbole. Appuis inclinés via un angle au nœud. Tassements d’appui. |
| **Charges** | Forces et moments nodaux, déplacements imposés, charges linéaires uniformes et trapézoïdales, forces et moments ponctuels le long d’une barre, et température uniforme ou avec gradient. |
| **Sections** | Bibliothèques de matériaux et de sections (européennes et américaines), plus un éditeur de polygones qui calcule $A$, $I_y$, $I_z$, $I_{yz}$, les axes principaux et les rayons de giration de n’importe quelle forme. |
| **Résultats** | Déformée, effort normal **N**, effort tranchant **V**, moment fléchissant **M**, réactions, déplacements nodaux, efforts aux extrémités des éléments et matrices de rigidité élémentaires. |
| **Calcul** | Analyse statique linéaire avec un seul cas de charge. Les résultats sont exacts pour le modèle linéaire : aucun raffinement du maillage n’est nécessaire. Quand une structure ne peut pas être calculée, EduBeam explique pourquoi et anime la façon dont elle peut se déplacer. |
| **Fichiers** | Enregistrer et ouvrir des projets en JSON, partager un modèle complet sous forme de lien, exporter le dessin en PNG ou SVG et les résultats en CSV. Les modèles récemment remplacés sont conservés pour que vous puissiez les récupérer. Tout reste sur votre appareil. |
| **Unités** | SI ou impériales US en un clic, ou chaque grandeur séparément. Axes x vers la droite et z vers le bas, ou x vers la droite et y vers le haut. |

## Ce qu’il ne fait pas (encore) {#what-it-does-not-do-yet}

Connaître les limites dès le départ fait gagner du temps :

- **2D uniquement.** Pas de comportement hors plan, pas de portiques 3D.
- **Statique linéaire uniquement.** Pas d’effets du second ordre (P–Δ), pas de flambement, pas de dynamique, pas de plasticité.
- **Un seul cas de charge.** Il n’y a ni combinaisons de charges ni enveloppes. Modélisez chaque cas séparément et enregistrez chacun dans son propre fichier ou lien de partage.
- **Pas de poids propre.** Appliquez-le comme charge linéaire si vous en avez besoin.
- **Pas de vérifications réglementaires.** EduBeam vous donne les efforts internes et les déplacements ; les vérifications selon les normes vous appartiennent.

Si une fonctionnalité manquante vous importe, [ouvrez un ticket](https://github.com/janvorisek/edubeam/issues).

<ElementariumPromo placement="introduction" />

## À qui s’adresse-t-il ? {#who-is-it-for}

- Aux **étudiants** en mécanique des structures qui veulent un retour immédiat sur leurs calculs à la main. Voir [Vérifier les résultats à la main](/fr/guide/verification).
- Aux **enseignants** qui montrent comment appuis, rotules et charges modifient les efforts internes, en direct au vidéoprojecteur, dans l’une des 12 langues. Voir [Enseigner avec EduBeam](/fr/guide/teaching).
- Aux **ingénieurs** qui veulent une vérification rapide avant d’ouvrir un logiciel de bureau plus lourd.

## Organisation de ce guide {#how-this-guide-is-organised}

1. **Premiers pas.** Cette page, le [Démarrage rapide en 10 minutes](/fr/guide/quick-start) et les [Exemples](/fr/examples/) prêts à l’emploi.
2. **Tutoriels.** Des modèles complets de bout en bout, vérifiés à la main : un [portique à trois articulations](/fr/tutorials/three-hinged-frame) et un [treillis plan](/fr/tutorials/truss).
3. **Modélisation.** Une page par brique : l’[interface utilisateur](/fr/essentials/user-interface), les [nœuds et appuis](/fr/essentials/nodes-supports), les [éléments, matériaux et sections](/fr/essentials/elements), les [charges](/fr/essentials/loads), et les [unités et paramètres](/fr/essentials/units-settings).
4. **Résultats.** Comment [lire les diagrammes et les tableaux](/fr/essentials/results) et comment les [vérifier](/fr/guide/verification).
5. **Fichiers et partage.** [Projets, liens de partage, export d’image et CSV](/fr/essentials/import-export), et [enseigner avec EduBeam](/fr/guide/teaching).
6. **Référence.** [Clavier, souris et tactile](/fr/reference/shortcuts), [dépannage](/fr/reference/troubleshooting) et la [FAQ](/fr/faq/).
7. **Manuel théorique.** [Conventions de signe](/fr/elements/conventions) et formulations des éléments [poutre](/fr/elements/beam) et [treillis](/fr/elements/truss).

Les icônes **?** de l’application ouvrent la page correspondante de ce guide dans votre langue.

## Langues {#languages}

L’interface est disponible en English, Čeština, Deutsch, Español, Français, Polski, Português, Русский, Türkçe, Українська, ไทย et 汉语. EduBeam choisit la langue d’après votre navigateur. Changez-la dans **Paramètres → Langue et paramètres régionaux**, ou ouvrez l’application avec un paramètre `?lang=`, par exemple [run.edubeam.app/?lang=fr](https://run.edubeam.app/?lang=fr){target="_blank"}.

## Auteurs et remerciements {#authors-credits}

<Edubeam /> est dirigé par [Jan Voříšek](https://github.com/janvorisek), mainteneur et concepteur de l’édition web moderne. La version navigateur est développée indépendamment de la ČVUT. L’EduBeam de bureau d’origine pour Windows et Linux a été créé par [Bořek Patzák](http://ksm.fsv.cvut.cz/~bp/), [Jan Stránský](https://mech.fsv.cvut.cz/~stransky/en/) et [Vít Šmilauer](https://mech.fsv.cvut.cz/~smilauer/) au Département de mécanique de la [Faculté de génie civil de l’Université technique tchèque de Prague (ČVUT)](https://www.fsv.cvut.cz/en). Le solveur est la bibliothèque open source [ts-fem](https://github.com/janvorisek/ts-fem).

<VPTeamMembers size="small" :members="members" />

## Contribuer {#contribute}

- Signalez les comportements déroutants ou les bogues dans un [ticket GitHub](https://github.com/janvorisek/edubeam/issues).
- Améliorez cette documentation ou les traductions en modifiant les fichiers de `docs/` et en ouvrant une pull request.
- Faites connaître EduBeam à vos camarades et collègues.
