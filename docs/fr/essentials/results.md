# Résultats et diagrammes

<Edubeam /> calcule le modèle après chaque modification, au plus quelques fois par seconde : les résultats sont donc toujours à jour. Il n’y a pas de bouton *Calculer*. Si rien n’est dessiné, c’est que le modèle ne peut pas encore être calculé ; le message en haut à gauche de la vue indique pourquoi (voir le [Dépannage](/fr/reference/troubleshooting)).

Les images de cette page montrent toutes le même modèle : le [portique à trois articulations](/fr/tutorials/three-hinged-frame) sous 10 kN/m.

## Couches dans la vue {#overlays-in-the-viewer}

Activez-les ou désactivez-les dans les **options d’affichage**, en haut à droite de la vue (le bouton ⚙ les affiche ou les masque).

| Couche | Couleur (par défaut) | Remarques |
| --- | --- | --- |
| **Déformée** | gris | Amplifiée : le plus grand déplacement est dessiné avec une longueur de *Échelle des résultats* pixels. Activée par défaut. |
| **N (x)**, effort normal | bleu | La traction est positive. Constant le long d’un élément, sauf si une charge axiale y agit. |
| **V<sub>z</sub> (x)**, effort tranchant | vert | Linéaire sous une charge uniforme, quadratique sous une charge trapézoïdale, avec un saut au droit d’une charge ponctuelle. |
| **M<sub>y</sub> (x)**, moment fléchissant | rouge | Positif quand la fibre inférieure est tendue. Étiqueté aux deux extrémités, au droit des charges ponctuelles et à chaque extremum local (là où V = 0). Activé par défaut. |
| **Réactions** | violet | Une flèche et une valeur pour chaque DDL bloqué. Activées par défaut. |

Les valeurs sont écrites aux points caractéristiques de chaque diagramme. L’orientation des étiquettes, la taille des tracés et les couleurs se modifient dans les [Paramètres](/fr/essentials/units-settings#viewer-settings).

<div class="shots">

![Effort normal N : les deux poteaux sont comprimés de 40 kN, la poutre de 20 kN](/screenshots/fr/results-normal.webp)

![Effort tranchant V : 20 kN dans les poteaux ; dans la poutre, 40 kN aux angles, décroissant jusqu’à zéro à la rotule](/screenshots/fr/results-shear.webp)

![Moment fléchissant M : −80 kNm aux deux angles, nul aux pieds et à la rotule](/screenshots/fr/results-moment.webp)

![Déformée (amplifiée) : la rotule C descend](/screenshots/fr/results-deformed.webp)

</div>

![Réactions : 40 kN verticalement et 20 kN horizontalement à chaque articulation](/screenshots/fr/results-reactions.webp){.shot-lg}

### Lire le signe {#reading-the-sign}

Lisez le signe d’une valeur sur son étiquette, et non d’après le côté de la barre où le diagramme est dessiné. Un moment fléchissant négatif tend la fibre supérieure d’une poutre, ou l’extérieur d’un angle de portique.

## Infobulles au survol {#hover-tooltips}

Pointer un objet est le moyen le plus rapide de lire une valeur :

- **Nœud** : `ux`, `uz` et `φy` (déplacements dans l’unité de déplacement, rotation en radians).
- **Élément** : son étiquette, sa section et son matériau.
- **Charge** : ses composantes.

Sur un écran tactile, touchez plutôt l’objet. Les mêmes détails apparaissent dans son panneau de sélection.

![Pointer le nœud 2 de la poutre du Démarrage rapide](/screenshots/fr/ui-hover.webp){.shot-sm}

## Onglet Résultats {#results-tab}

L’onglet **Résultats** de la barre inférieure contient deux tableaux, que l’on bascule avec **Résultats nodaux** et **Résultats par élément**.

### Résultats nodaux {#nodal-results}

Une ligne par nœud avec **Dx**, **Dz** (unité de déplacement) et **Ry** (rad). Les signes suivent les axes globaux : un `Dz` positif est dirigé vers le bas et un `Ry` positif tourne dans le sens antihoraire à l’écran.

![Résultats nodaux du portique à trois articulations (Format des nombres : Automatique)](/screenshots/fr/results-nodal.webp)

### Résultats par élément {#element-results}

Une ligne par élément avec les **efforts aux extrémités dans le repère local de l’élément** :

| Colonne | Signification |
| --- | --- |
| `X12`, `Z12`, `M12` | effort normal, effort tranchant et moment agissant sur l’élément à son nœud **initial** |
| `X21`, `Z21`, `M21` | les mêmes à son nœud **final** |

![Résultats par élément du portique à trois articulations](/screenshots/fr/results-element.webp)

Ce sont les forces que les nœuds exercent sur l’élément : la matrice de rigidité de l’élément multipliée par ses déplacements d’extrémité, moins les charges nodales équivalentes. Elles suivent les axes locaux, et non la convention N-V-M des diagrammes :

- Pour la poutre de 6 m sur deux appuis du [Démarrage rapide](/fr/guide/quick-start) : `Z12 = Z21 = −36 kN`. Les deux appuis poussent la poutre vers le haut, c’est-à-dire selon −z.
- Pour une console encastrée à son nœud initial avec une charge de 18 kN vers le bas à son extrémité : `Z12 = −18 kN`, `M12 = +72 kNm`, `Z21 = +18 kN`, `M21 = 0`.
- Pour le poteau 1 du portique (A en bas, B en haut) : `X12 = +40 kN` pousse le long de l’axe x local vers l’intérieur de l’élément, soit une compression de 40 kN.

### Exporter en CSV et Copier {#export-csv-and-copy}

**Exporter en CSV** télécharge `edubeam-results.csv` avec les deux tableaux, dans les unités affichées à l’écran et prêt pour un tableur. Le tableau des nœuds liste aussi les **réactions** `Rx`, `Rz`, `My`. **Copier** place les mêmes tableaux dans le presse-papiers sous forme de texte séparé par des tabulations, qui se colle directement dans Excel, LibreOffice ou Google Sheets. Dans l’export, les efforts aux extrémités des éléments sont nommés `N1 V1 M1 N2 V2 M2`.

### Matrice de rigidité {#stiffness-matrix}

Choisissez **Matrice de rigidité** dans le panneau d’un élément ou dans sa ligne du tableau pour ouvrir une fenêtre avec la matrice de rigidité 6 × 6 de l’élément en coordonnées globales, utile pour vérifier un assemblage fait à la main dans un cours sur la méthode des déplacements. Les formules se trouvent dans le [manuel théorique](/fr/elements/beam).

## Format des nombres {#number-format}

Les résultats sont affichés avec cinq chiffres significatifs. **Paramètres → Langue et paramètres régionaux → Format des nombres** détermine leur écriture :

| Format | 40 000 s’écrit | À utiliser pour |
| --- | --- | --- |
| **Scientifique** (par défaut) | 4 · 10⁴ | des valeurs qui couvrent de nombreux ordres de grandeur |
| **Ingénierie** | 40 · 10³ | faire correspondre les préfixes kilo / méga |
| **Automatique** | 40000 | les nombres courants en enseignement |

Automatique écrit les valeurs de 0,001 à 100 000 comme des nombres ordinaires et passe aux puissances de dix en dehors de cette plage. Le séparateur décimal suit la langue.

## Précision et exactitude {#precision-and-accuracy}

- L’élément poutre est exact pour le modèle linéaire de Timoshenko sous charges nodales, uniformes, trapézoïdales, ponctuelles et thermiques : les résultats ne dépendent **pas** du nombre d’éléments.
- Le calcul est effectué en double précision. Des valeurs infimes comme `1,5 · 10⁻¹⁸` sont des erreurs d’arrondi et signifient zéro.
- Les flèches incluent la **déformation d’effort tranchant**. Pour les barres élancées, cela ajoute une fraction de pour cent à la valeur d’Euler–Bernoulli ; pour les barres hautes ou courtes, cela peut atteindre plusieurs pour cent. Donnez une grande valeur au coefficient de cisaillement de la section pour la supprimer.

## Résultats dans un rapport {#results-in-a-report}

- **☰ → Exporter une image** (<kbd>Ctrl</kbd>+<kbd>P</kbd>) enregistre le dessin en PNG ou SVG avec les couches de votre choix. Voir [Exporter une image](/fr/essentials/import-export#export-an-image).
- **Résultats → Exporter en CSV** ou **Copier** fournit les valeurs.
- **Partager le modèle** fournit un lien pour qu’un lecteur puisse ouvrir le modèle lui-même.
