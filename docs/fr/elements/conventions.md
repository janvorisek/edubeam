# Repère et conventions de signe

La plupart des résultats « faux » dans <Edubeam /> sont en réalité une surprise de convention de signe. Tout ce qui suit est exactement ce qu’utilise le solveur.

## Axes globaux {#global-axes}

- **x** : horizontal, positif vers la **droite**.
- **z** : vertical, positif **vers le bas** à l’écran.
- **y** : l’axe perpendiculaire au plan (dirigé vers l’observateur pour un repère direct). Les rotations et les moments sont autour de y.

L’indicateur d’axes dans le coin de la grille montre x (rouge) et z (vert). Un nœud en tête d’un poteau de 3 m a donc `Z = −3` si le pied est en `Z = 0`.

## Degrés de liberté {#degrees-of-freedom}

Chaque nœud possède `Dx`, `Dz` (translations) et `Ry` (rotation). Un `Dz` positif est un déplacement vers le bas ; un `Ry` positif est une rotation dans le **sens antihoraire** à l’écran. Les mêmes signes s’appliquent aux déplacements imposés et aux résultats nodaux.

## Charges {#loads}

| Charge | Sens positif |
| --- | --- |
| `Fx`, `fx`, `f1x`… | +x (vers la droite ; ou selon le x local de l’élément quand LCS est cochée) |
| `Fz`, `fz`, `f1z`… | +z (**vers le bas** ; ou selon le z local quand LCS est cochée) |
| `My` | sens antihoraire à l’écran |
| `ΔTc` | échauffement (allongement) |
| `ΔTb − ΔTt` | fibre inférieure plus chaude que la fibre supérieure |

Une charge gravitaire est donc un `fz` **positif**, et un vent qui pousse un poteau de gauche vers la droite est un `fx` positif.

## Axes locaux de l’élément {#element-local-axes}

Le **x** local va du nœud initial au nœud final ; le **z** local lui est perpendiculaire, obtenu en tournant les axes globaux de l’angle $\alpha$ de l’élément. Pour un élément horizontal dessiné de gauche à droite, les axes locaux et globaux coïncident. Utilisez **Inverser les nœuds** dans le tableau *Éléments* pour inverser l’orientation.

## Efforts internes {#internal-forces}

| Grandeur | Positif signifie |
| --- | --- |
| **N** | traction |
| **V<sub>z</sub>** | le signe usuel de la théorie des poutres : pour une poutre sur deux appuis sous charge gravitaire, V est positif à l’appui gauche et négatif à l’appui droit |
| **M<sub>y</sub>** | **fibre inférieure (+z) tendue**. Une poutre sur deux appuis sous charge gravitaire a un moment positif à mi-portée ; une console chargée à son extrémité a un moment négatif (fibre supérieure tendue) à l’encastrement |

## Efforts aux extrémités (tableau Résultats par élément) {#end-forces-element-results-table}

`X12, Z12, M12` agissent sur l’élément à son nœud initial, `X21, Z21, M21` à son nœud final, dans le repère **local**, avec les mêmes sens positifs que les axes locaux et `My`. Ce sont les efforts que les nœuds exercent sur l’élément, soit $\mathbf{f} = \mathbf{K}_l\,\mathbf{u}_l - \mathbf{f}_{eq}$, où $\mathbf{f}_{eq}$ sont les charges nodales équivalentes des charges d’élément. La somme des efforts aux extrémités de tous les éléments qui concourent en un nœud équilibre les charges nodales et les réactions en ce nœud.

## Réactions {#reactions}

Il existe une réaction pour chaque DDL bloqué ; elle est donnée dans le repère du nœud (tourné de l’angle du SCL nodal s’il est défini). Les flèches de réaction dans la vue pointent dans le sens où l’appui pousse sur la structure.

## Axes y vers le haut {#y-up-axes}

**Paramètres → Système de coordonnées → x vers la droite, y vers le haut** fait passer tout ce que vous saisissez et lisez au repère des manuels : **x** vers la droite, **y** vers le haut et **z** vers l’observateur. Le modèle, les fichiers enregistrés et les dessins restent identiques ; seuls les nombres et les noms changent :

| Grandeur | z vers le bas (par défaut) | y vers le haut |
| --- | --- | --- |
| Coordonnée verticale | `Z` | `Y`, signe opposé |
| Charges, déplacements, réactions et efforts aux extrémités verticaux | `Fz`, `fz`, `Dz`, `Z12`… | `Fy`, `fy`, `Dy`, `Y12`…, signe opposé |
| Rotations et moments | `Ry`, `My` | `Rz`, `Mz`, même signe (positif dans le sens antihoraire) |
| Angle d’appui α | mesuré dans le sens horaire | mesuré dans le sens antihoraire, signe opposé |
| Efforts internes N, V, M | | inchangés, diagrammes tracés de la même façon |

Une charge gravitaire est donc un `fy` **négatif**, et la tête d’un poteau de 3 m a `Y = 3`.

## Unités {#units}

Le solveur travaille en SI en interne (m, N, Pa, rad, K). Les unités d’affichage n’influent que sur ce que vous saisissez et lisez ; les changer ne modifie jamais le modèle.
