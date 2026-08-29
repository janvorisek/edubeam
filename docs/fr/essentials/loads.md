# Charges

Toutes les charges appartiennent à un **cas de charge unique** et agissent simultanément. Pour comparer des scénarios, enregistrez chacun comme fichier de projet ou lien distinct.

<LoadShowcase />

## La convention de signe en une ligne

L’axe global **x** pointe vers la droite, l’axe global **z** pointe **vers le bas**. Un `Fz` ou `fz` positif en repère global est donc une charge dirigée vers le bas (type gravité) ; un moment `My` positif tourne dans le sens trigonométrique à l’écran. Détails dans [Repère et conventions de signe](/fr/elements/conventions).

## Charges nodales

Onglet *Charges* → **Ajouter une charge nodale**, ou clic sur un nœud → **Ajouter une charge**. Choisissez **Force/Moment** :

| Champ | Signification | Unité |
| --- | --- | --- |
| `Fx` | force horizontale (+ → droite) | unité de force |
| `Fz` | force verticale (+ → bas) | unité de force |
| `My` | moment autour de y | unité de moment |

Les composantes sont toujours en repère **global**. Un aperçu fléché dans la boîte de dialogue montre la direction et l’intensité résultantes. Plusieurs charges nodales sur un même nœud sont autorisées et s’additionnent simplement.

### Déplacements imposés (tassements d’appui)

Dans la même boîte, choisissez **Déplacement imposé** (ou clic sur un nœud appuyé → **Imposer un déplacement**). Les champs deviennent :

| Champ | Signification | Unité |
| --- | --- | --- |
| `Dx` | déplacement horizontal imposé | unité de longueur |
| `Dz` | déplacement vertical imposé (+ → bas) | unité de longueur |
| `Ry` | rotation imposée | rad |

Une valeur ne peut être saisie que pour un DDL **bloqué** en ce nœud : seuls les appuis peuvent être déplacés. Chaque nœud admet un seul déplacement imposé ; modifiez-le plutôt que d’en ajouter un second. Dans une structure isostatique, un tassement produit des déplacements mais aucune sollicitation ; dans une structure hyperstatique, il produit les deux.

## Charges d’élément

Onglet *Charges* → **Ajouter une charge d’élément**, ou clic sur un élément → **Ajouter une charge**. Choisissez le **Type de charge** ; la boîte affiche un aperçu de la charge sur l’élément.

### Charge uniformément répartie

| Champ | Signification | Unité |
| --- | --- | --- |
| `fx` | charge linéique selon x | force / longueur |
| `fz` | charge linéique selon z | force / longueur |
| **LCS** | cochez pour interpréter `fx`, `fz` dans les axes locaux de l’élément | – |

Le cas le plus courant est une charge verticale gravitaire : `fz > 0`, LCS décoché. Sur une barre inclinée, une charge **perpendiculaire à la barre** (par ex. le vent sur un chevron) est `fz` avec LCS **coché** ; une charge verticale par mètre de *projection horizontale* n’est pas disponible directement : convertissez-la d’abord par mètre de longueur de barre.

### Charge trapézoïdale

| Champ | Signification |
| --- | --- |
| `f1x`, `f1z` | intensité au nœud **initial** |
| `f2x`, `f2z` | intensité au nœud **final** |

Les intensités varient linéairement entre les extrémités. Une charge triangulaire est simplement `f1z = 0`. Les charges trapézoïdales sont toujours dans le **repère local de l’élément** (la case LCS est verrouillée) ; pour les barres horizontales, z local et z global coïncident, cela n’a donc d’importance que pour les barres inclinées.

### Charge ponctuelle

Une force ou un moment ponctuel en un point quelconque **le long** d’un élément, sans nœud supplémentaire.

| Champ | Signification |
| --- | --- |
| `Fx`, `Fz`, `My` | composantes de force / moment |
| **Position de la charge depuis le nœud initial** | distance depuis le nœud initial, `0 ≤ a ≤ L` |
| **LCS** | composantes en axes locaux |

Le diagramme d’effort tranchant présente un saut de `Fz` au point d’application et le diagramme des moments un point anguleux ; la valeur du moment y est étiquetée automatiquement.

### Charge thermique

| Champ | Signification |
| --- | --- |
| **ΔT<sub>s</sub>** – variation uniforme de température | variation uniforme sur toute la section → allongement $\alpha\,\Delta T_s\,L$ |
| **ΔT<sub>b</sub> − ΔT<sub>t</sub>** – fibre inférieure moins supérieure | écart de température sur la hauteur → courbure $\alpha\,(\Delta T_b - \Delta T_t)/h$ |

Les charges thermiques utilisent le **α** du matériau et la **hauteur h** de la section. Un `ΔTb − ΔTt` positif (fibre inférieure plus chaude) fait bomber l’élément vers le haut. Dans une structure isostatique, la température ne produit que des déplacements ; ce sont les blocages (extrémités encastrées, continuité, barres surabondantes) qui la transforment en sollicitations.

## Modifier et supprimer des charges

- Les charges apparaissent comme pastilles dans les tableaux *Nœuds* / *Éléments* et comme lignes dans l’onglet *Charges*, où les composantes (et la case LCS) se modifient sur place.
- **Double-cliquez** sur une charge dans la vue, ou cliquez puis **Modifier la charge**, pour ouvrir la boîte d’édition.
- Sélectionnez une charge et appuyez sur <kbd>Suppr</kbd>, ou utilisez l’icône corbeille.
- Les charges rattachées à un nœud ou un élément sont supprimées avec lui et copiées avec lui lors du copier-coller.

## Ce qui n’est pas disponible

- **Cas et combinaisons de charges** : un seul cas.
- **Poids propre** : saisissez-le comme charge uniformément répartie $f_z = \rho\,g\,A$ (par ex. IPE 200 : 7850 × 9,81 × 0,00285 ≈ 0,22 kN/m).
- **Charges trapézoïdales en repère global** sur barres inclinées.
