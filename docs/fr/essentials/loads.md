# Charges

Toutes les charges appartiennent à un **seul cas de charge** et agissent ensemble. Pour comparer des scénarios, enregistrez chacun dans un fichier de projet ou un lien de partage.

![Tous les types de charge sur une même poutre continue : une force nodale, une charge uniforme, une charge trapézoïdale, une charge ponctuelle, une charge thermique et un tassement d’appui](/screenshots/fr/loads-overview.webp)

<LoadShowcase />

## La convention de signe en une ligne {#sign-convention-in-one-line}

L’axe global **x** pointe vers la droite et l’axe global **z** vers le **bas**. Un `Fz` ou `fz` positif est donc une charge dirigée vers le bas, de type gravitaire, et un moment `My` positif tourne dans le sens antihoraire à l’écran. Les détails se trouvent dans [Repère et conventions de signe](/fr/elements/conventions). Avec les [axes y vers le haut](/fr/elements/conventions#y-up-axes), les noms et les signes verticaux s’inversent : la pesanteur est un `Fy` négatif.

## Charges nodales {#nodal-loads}

Onglet *Charges* → **Ajouter une charge nodale**, ou cliquez sur un nœud → **Ajouter une charge**. Choisissez **Force/Moment** :

| Champ | Signification | Unité |
| --- | --- | --- |
| `Fx` | force horizontale (positive vers la droite) | unité de force |
| `Fz` | force verticale (positive vers le bas) | unité de force |
| `My` | moment autour de y (positif dans le sens antihoraire) | unité de moment |

![Ajouter une charge nodale. L’aperçu montre la direction pendant la saisie.](/screenshots/fr/loads-nodal.webp){.shot-md}

Les composantes sont toujours exprimées dans le repère **global**. Un nœud peut porter plusieurs charges nodales ; elles s’additionnent et sont dessinées empilées.

### Déplacements imposés (tassements d’appui) {#prescribed-displacements-support-settlements}

Dans la même boîte de dialogue, choisissez **Déplacement imposé**, ou cliquez sur un nœud avec appui → **Imposer un déplacement**. Les champs deviennent :

| Champ | Signification | Unité |
| --- | --- | --- |
| `Dx` | déplacement horizontal imposé | unité de déplacement |
| `Dz` | déplacement vertical imposé (positif vers le bas) | unité de déplacement |
| `Ry` | rotation imposée | rad |

Vous ne pouvez saisir une valeur que pour un DDL **bloqué** à ce nœud, car seuls les appuis peuvent être déplacés. Chaque nœud porte au plus un déplacement imposé ; modifiez-le plutôt que d’en ajouter un second. Dans une structure isostatique, un tassement produit des déplacements mais aucun effort interne ; dans une structure hyperstatique, il produit les deux.

## Charges d’élément {#element-loads}

Onglet *Charges* → **Ajouter une charge d’élément**, ou cliquez sur un élément → **Ajouter une charge**. Choisissez le **Type de charge** ; la boîte de dialogue affiche un aperçu de la charge sur l’élément pendant la saisie.

### Charge uniformément répartie {#uniformly-distributed-load}

| Champ | Signification | Unité |
| --- | --- | --- |
| `fx` | charge par unité de longueur selon x | force / longueur |
| `fz` | charge par unité de longueur selon z | force / longueur |
| **LCS** | cochée : `fx`, `fz` agissent selon les axes locaux de l’élément ; décochée : selon les axes globaux | – |

**LCS** est cochée par défaut. Sur un élément horizontal dessiné de gauche à droite, les axes locaux et globaux coïncident : cela ne change rien. Sur une barre inclinée, cela compte :

- une charge **perpendiculaire à la barre** (vent sur un arbalétrier) est un `fz` avec LCS **cochée** ;
- une charge **verticale** par mètre de longueur de barre (poids propre) est un `fz` avec LCS **décochée** ;
- une charge verticale par mètre de projection *horizontale* (neige) n’est pas disponible directement. Multipliez-la d’abord par $\cos\alpha$, où $\alpha$ est la pente de la barre, et saisissez-la comme charge verticale.

### Charge trapézoïdale {#trapezoidal-load}

| Champ | Signification |
| --- | --- |
| `f1x`, `f1z` | intensité au nœud **initial** |
| `f2x`, `f2z` | intensité au nœud **final** |

L’intensité varie linéairement du début à la fin de l’élément. Une charge triangulaire a `f1z = 0`. Les charges trapézoïdales agissent toujours selon les **axes locaux de l’élément** (la case LCS est verrouillée) ; sur un élément horizontal, cela revient aux axes globaux.

### Charge ponctuelle {#concentrated-load}

Une force ou un moment ponctuel en un point quelconque **le long** d’un élément, sans nœud supplémentaire.

| Champ | Signification |
| --- | --- |
| `Fx`, `Fz`, `My` | composantes de force et de moment |
| **Position de la charge depuis le nœud initial** | distance au nœud initial, `0 ≤ a ≤ L` |
| **LCS** | composantes selon les axes locaux |

Le diagramme d’effort tranchant présente un saut de `Fz` au droit de la charge et le diagramme des moments y forme un angle ; la valeur du moment en ce point est étiquetée automatiquement. Un `My` ponctuel provoque au contraire un saut du diagramme des moments.

### Charge thermique {#temperature-load}

| Champ | Signification |
| --- | --- |
| **ΔT<sub>c</sub>**, variation uniforme de température | variation uniforme sur toute la section, qui produit un allongement $\alpha\,\Delta T_c\,L$ |
| **ΔT<sub>b</sub> − ΔT<sub>t</sub>**, différence de température | fibre inférieure moins fibre supérieure, qui produit une courbure $\alpha\,(\Delta T_b - \Delta T_t)/h$ |

Les charges thermiques utilisent le **α** du matériau et la **hauteur h** de la section. Un `ΔTb − ΔTt` positif (plus chaud en bas) allonge la fibre inférieure : l’élément fléchit vers le bas comme une poutre sous charge gravitaire. Dans une structure isostatique, la température ne provoque que des déplacements ; les liaisons surabondantes (extrémités encastrées, continuité, barres surabondantes) la transforment en efforts internes.

<div class="shots">

![Charge uniformément répartie](/screenshots/fr/loads-udl.webp)

![Charge trapézoïdale](/screenshots/fr/loads-trapezoidal.webp)

![Charge ponctuelle](/screenshots/fr/loads-concentrated.webp)

![Charge thermique](/screenshots/fr/loads-temperature.webp)

</div>

## Modifier et supprimer des charges {#editing-and-removing-loads}

- Chaque charge est une ligne de l’onglet *Charges*, où vous pouvez modifier directement ses composantes et l’indicateur LCS. Les charges apparaissent aussi sous forme de pastilles dans les tableaux *Nœuds* et *Éléments*.
- **Double-cliquez** sur une charge dans la vue, ou cliquez dessus et choisissez **Modifier la charge**, pour ouvrir la boîte de dialogue de modification.
- Sélectionnez une charge et appuyez sur <kbd>Suppr</kbd>, ou utilisez le × du tableau.
- Les charges attachées à un nœud ou à un élément sont supprimées avec lui, et copiées avec lui lors d’un copier-coller.

![L’onglet Charges : une ligne par charge, avec ses composantes modifiables sur place](/screenshots/fr/loads-table.webp)

## Ce qui n’est pas disponible {#what-is-not-available}

- **Cas et combinaisons de charges.** Il n’y a qu’un seul cas de charge.
- **Poids propre.** Saisissez-le comme charge uniforme avec LCS décochée : $f_z = \rho\,g\,A$. Pour un IPE 200, 7850 × 9,81 × 0,00285 ≈ 0,22 kN/m.
- **Charges trapézoïdales en axes globaux** sur les barres inclinées.
