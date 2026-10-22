# Tutoriel : portique à trois articulations

Un portique à trois articulations est isostatique : les trois équations d’équilibre plus la condition $M = 0$ à la rotule donnent les quatre réactions d’appui. C’est donc un modèle idéal pour vérifier chaque nombre qu’EduBeam affiche. Comptez environ 15 minutes.

![Le portique terminé : moment fléchissant et réactions](/screenshots/fr/tut-frame-moment.webp)

[Ouvrez le modèle terminé](https://run.edubeam.app/?model=eyJuIjpbWyJBIixbMCwwLDBdLFswLDJdLG51bGxdLFsiQiIsWzAsMCwtNF0sW10sbnVsbF0sWyJDIixbNCwwLC00XSxbXSxudWxsXSxbIkQiLFs4LDAsLTRdLFtdLG51bGxdLFsiRSIsWzgsMCwwXSxbMCwyXSxudWxsXV0sImUiOltbIjEiLFsiQSIsIkIiXSwiMSIsIjEiLFtmYWxzZSxmYWxzZV1dLFsiMiIsWyJCIiwiQyJdLCIxIiwiMSIsW2ZhbHNlLHRydWVdXSxbIjMiLFsiQyIsIkQiXSwiMSIsIjEiLFtmYWxzZSxmYWxzZV1dLFsiNCIsWyJEIiwiRSJdLCIxIiwiMSIsW2ZhbHNlLGZhbHNlXV1dLCJtIjpbWyIxIiw3ODUwLDIxMDAwMDAwMDAwMCw4MTAwMDAwMDAwMCwwLjAwMDAxMl1dLCJjcyI6W1siMSIsMC4wMDUzOCwwLjAwMDA4MzU2LDAuMywxXV0sImVsIjpbWyIyIixbMCwxMDAwMF0sZmFsc2VdLFsiMyIsWzAsMTAwMDBdLGZhbHNlXV0sImQiOltdfQ%3D%3D&lang=fr){target="_blank"} si vous voulez seulement l’explorer.

## Le problème {#the-problem}

- Deux poteaux de 4 m, articulés à leurs pieds A et E, distants de 8 m.
- Une poutre horizontale B–D en tête, avec une rotule à mi-portée en C.
- Une charge uniforme $q = 10$ kN/m sur toute la poutre.
- Acier ($E = 210$ GPa, $G = 81$ GPa), IPE 300 ($A = 53{,}8$ cm², $I_y = 8356$ cm⁴, $h = 300$ mm).

| Nœud | X [m] | Z [m] | Appui |
| --- | --- | --- | --- |
| A | 0 | 0 | articulation |
| B | 0 | −4 | |
| C | 4 | −4 | (rotule dans la poutre) |
| D | 8 | −4 | |
| E | 8 | 0 | articulation |

N’oubliez pas que **z pointe vers le bas** : la tête des poteaux est donc en `Z = −4`.

## 1. Matériau et section {#_1-material-and-section}

1. **Effacer la structure** (cochez *Supprimer les matériaux* et *Supprimer les sections*).
2. *Matériaux* → **Bibliothèque de matériaux** → **Steel (S235)**.
3. *Sections* → **Ajouter une section** : `Aire = 0,00538`, `Iy = 8,356e-5`, `Hauteur = 0,3`, `Coefficient de cisaillement = 1`.

La section n’influe que sur les déplacements. Ce portique est isostatique : ses efforts internes ne dépendent pas du tout de $E$, $A$ ou $I$.

## 2. Dessinez le portique {#_2-draw-the-frame}

Le plus rapide est de tracer une seule polyligne à la souris :

1. Vérifiez que **Magnétisme à la grille** est activé (la pastille **S**).
2. Onglet *Éléments* → le second bouton **Ajouter un élément** (icône de curseur).
3. Cliquez en (0, 0), puis en (0, −4), (4, −4), (8, −4) et (8, 0). Aidez-vous des règles et du réticule pour trouver les points. Chaque clic ajoute un nœud et le relie au précédent.
4. Appuyez sur <kbd>Échap</kbd> pour terminer, puis sur <kbd>F</kbd> pour ajuster le portique à l’écran.

Vous avez maintenant cinq nœuds et quatre éléments. Les images de cette page nomment les nœuds A–E ; renommez les vôtres dans le tableau *Nœuds* si vous le souhaitez, ou gardez 1–5. Vérifiez les coordonnées dans le tableau et corrigez celles qui ont manqué la grille.

## 3. Appuis et rotule {#_3-supports-and-the-hinge}

1. Cliquez sur le nœud A, ouvrez **Appuis du nœud** et choisissez **Rotule**. Faites de même pour le nœud E.
2. Dans le tableau *Éléments*, trouvez l’élément allant de B à C et cochez sa rotule de **fin** (la seconde case de *Rotules d’extrémité*).

![Le tableau des éléments : la rotule est à la fin de l’élément 2, au nœud C](/screenshots/fr/elements-table.webp)

::: tip Une rotule, pas deux
Placer une rotule à la fin de l’élément B–C suffit : le moment en C est alors nul, car C–D ne peut pas transmettre de moment à un nœud qu’il est le seul à tenir rigidement. Cochez aussi le début de C–D et rien ne change. Mais ajoutez une rotule en B, et le portique devient un mécanisme. Essayez : EduBeam vous montre comment il se déplace.
:::

## 4. Charge {#_4-load}

*Charges* → **Ajouter une charge d’élément** → *Charge uniformément répartie*, élément B–C, `fz = 10` kN/m. Recommencez pour l’élément C–D. La poutre est horizontale : la case LCS (repère local) ne change rien ici.

## 5. Résultats {#_5-results}

Les options d’affichage démarrent avec la déformée, le moment fléchissant et les réactions activés. Cochez **N (x)** et **V<sub>z</sub> (x)** pour voir le reste.

<div class="shots">

![Moment fléchissant et réactions](/screenshots/fr/tut-frame-moment.webp)

![Effort normal](/screenshots/fr/tut-frame-normal.webp)

![Effort tranchant](/screenshots/fr/results-shear.webp)

![Déformée](/screenshots/fr/results-deformed.webp)

</div>

## 6. Vérifiez à la main {#_6-check-by-hand}

**Réactions verticales.** Par symétrie, chaque pied reprend la moitié de la charge :

$$V_A = V_E = \frac{q \cdot 8}{2} = 40\ \text{kN}$$

**Réactions horizontales.** Écrivez l’équilibre des moments par rapport à la rotule C pour la moitié gauche du portique. Le moment y est nécessairement nul :

$$V_A \cdot 4 - H_A \cdot 4 - q \cdot 4 \cdot 2 = 0 \quad\Rightarrow\quad H_A = \frac{160 - 80}{4} = 20\ \text{kN}$$

Les deux pieds poussent vers l’intérieur avec 20 kN ; c’est cette poussée horizontale qui rend le portique à trois articulations efficace.

**Efforts internes.**

| Grandeur | Formule | À la main | EduBeam |
| --- | --- | --- | --- |
| Réactions verticales | $qL/2$ | 40 kN | 40 kN |
| Réactions horizontales | d’après $M_C = 0$ | 20 kN | 20 kN |
| Moment aux angles B et D | $H \cdot h$ | 80 kNm, fibre extérieure tendue | −80 kNm |
| Moment à la rotule C | | 0 | 0 |
| Effort normal dans les poteaux | $-V_A$ | −40 kN | −40 kN |
| Effort normal dans la poutre | $-H_A$ | −20 kN | −20 kN |
| Effort tranchant dans les poteaux | $H_A$ | 20 kN | −20 kN (A–B), +20 kN (D–E) |
| Effort tranchant dans la poutre en B | $V_A$ | 40 kN | 40 kN |
| Effort tranchant dans la poutre en C | $V_A - 4q$ | 0 | 0 |
| Effort tranchant dans la poutre en D | $V_A - 8q$ | −40 kN | −40 kN |

Les deux poteaux ont des efforts tranchants de signes opposés alors qu’ils reprennent le même effort, car les axes locaux de chaque élément suivent son orientation : A–B est dessiné vers le haut et D–E vers le bas. Inversez les nœuds d’un poteau et son signe change.

Dans la poutre, $M(x) = -80 + 40x - 5x^2$ kNm (x mesuré depuis B), qui s’annule à la rotule et n’est jamais positif : toute la poutre est en moment négatif. L’effort tranchant $V(x) = 40 - 10x$ s’annule exactement en C, donc l’extremum du moment se trouve lui aussi à la rotule.

**Déplacement.** La rotule C descend de 43,1 mm (*Résultats → Résultats nodaux*, `Dz` de C). Ce déplacement provient de la flexion des quatre barres ; c’est un bon exercice pour le principe des travaux virtuels.

## 7. Expérimentez {#_7-experiment}

- **Décochez la rotule** en C. Le portique devient hyperstatique de degré 1 ; les moments aux angles diminuent et un moment positif apparaît à mi-portée. La section compte maintenant : essayez une poutre plus rigide.
- **Encastrez les pieds** (choisissez l’appui **Encastrement**). Des moments apparaissent en A et E.
- **Ajoutez une charge horizontale** : une charge nodale `Fx = 10` kN en B. Le portique se déplace latéralement et les réactions ne sont plus symétriques. Vérifiez-les avec les trois mêmes équations et $M_C = 0$.
- **Cochez aussi une rotule en B.** Le portique devient un mécanisme, et EduBeam anime la façon dont il peut se déplacer.
