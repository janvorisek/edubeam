# Repère et conventions de signe

La plupart des résultats « faux » dans <Edubeam /> sont en réalité une surprise de convention de signe. Voici exactement ce qu’utilise le solveur.

## Axes globaux

- **x** : horizontal, positif vers la **droite**.
- **z** : vertical, positif **vers le bas** à l’écran.
- **y** : l’axe perpendiculaire au plan (dirigé vers l’observateur dans un repère direct). Rotations et moments sont autour de y.

L’indicateur d’axes dans le coin de la grille montre x (rouge) et z (vert). Un nœud en tête d’un poteau de 3 m a donc `Z = −3` si le pied est en `Z = 0`.

## Degrés de liberté

Chaque nœud possède `Dx`, `Dz` (translations) et `Ry` (rotation). Un `Dz` positif est un déplacement vers le bas ; un `Ry` positif est une rotation dans le **sens trigonométrique** à l’écran. Les mêmes signes s’appliquent aux déplacements imposés et aux résultats nodaux.

## Charges

| Charge | Sens positif |
| --- | --- |
| `Fx`, `fx`, `f1x`… | +x (droite ; ou x local de l’élément si LCS est coché) |
| `Fz`, `fz`, `f1z`… | +z (**bas** ; ou z local si LCS est coché) |
| `My` | sens trigonométrique à l’écran |
| `ΔTs` | échauffement (allongement) |
| `ΔTb − ΔTt` | fibre inférieure plus chaude que la supérieure |

Une charge gravitaire est donc un `fz` **positif**, et un vent poussant un poteau gauche vers la droite un `fx` positif.

## Axes locaux de l’élément

Le **x** local va du nœud initial au nœud final ; le **z** local lui est perpendiculaire, obtenu en tournant les axes globaux de l’angle $\alpha$ de l’élément. Pour un élément horizontal tracé de gauche à droite, axes locaux et globaux coïncident. Utilisez **Inverser les nœuds** dans le tableau *Éléments* pour retourner la direction.

## Sollicitations

| Grandeur | Positif signifie |
| --- | --- |
| **N** | traction |
| **V<sub>z</sub>** | le signe usuel de la théorie des poutres : pour une poutre sur deux appuis sous charge gravitaire, V est positif à l’appui gauche et négatif à l’appui droit |
| **M<sub>y</sub>** | **fibre inférieure (+z) tendue**. Une poutre sur deux appuis sous charge gravitaire a un moment positif à mi-portée ; une console chargée à l’extrémité a un moment négatif à l’encastrement |

## Efforts aux extrémités (tableau Résultats par élément)

`X12, Z12, M12` agissent sur l’élément à son nœud initial, `X21, Z21, M21` à son nœud final, en repère **local**, avec les mêmes sens positifs que les axes locaux et `My`. Ce sont les efforts que les nœuds exercent sur l’élément, soit $\mathbf{f} = \mathbf{K}_l\,\mathbf{u}_l - \mathbf{f}_{eq}$, où $\mathbf{f}_{eq}$ sont les charges nodales équivalentes des charges d’élément. La somme des efforts d’extrémité de tous les éléments concourant en un nœud équilibre les charges nodales et les réactions en ce nœud.

## Réactions

Il existe une réaction pour chaque DDL bloqué, donnée dans le repère du nœud (tourné de l’angle du SCL nodal s’il est défini). Les flèches de réaction dans la vue pointent dans le sens où l’appui pousse la structure.

## Unités

Le solveur travaille en SI en interne (m, N, Pa, rad, K). Les unités d’affichage n’influent que sur ce que vous saisissez et lisez ; les changer ne modifie jamais le modèle.
