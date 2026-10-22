# Tutoriel : treillis plan

Ce tutoriel construit un petit treillis isostatique, vérifie les efforts dans ses barres par la méthode des nœuds et la méthode des sections (méthode de Ritter), et met en évidence une barre à effort nul. Comptez environ 15 minutes.

![Le treillis terminé : efforts normaux et réactions](/screenshots/fr/tut-truss.webp)

[Ouvrez le modèle terminé](https://run.edubeam.app/?model=eyJuIjpbWyIxIixbMCwwLDBdLFswLDJdLG51bGxdLFsiMiIsWzQsMCwwXSxbXSxudWxsXSxbIjMiLFs4LDAsMF0sW10sbnVsbF0sWyI0IixbMTIsMCwwXSxbMl0sbnVsbF0sWyI1IixbNCwwLC0zXSxbXSxudWxsXSxbIjYiLFs4LDAsLTNdLFtdLG51bGxdXSwiZSI6W1siMSIsWyIxIiwiMiJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiMiIsWyIyIiwiMyJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiMyIsWyIzIiwiNCJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiNCIsWyI1IiwiNiJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiNSIsWyIxIiwiNSJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiNiIsWyIyIiwiNSJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiNyIsWyI1IiwiMyJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiOCIsWyIzIiwiNiJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiOSIsWyI2IiwiNCJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dXSwibSI6W1siMSIsNzg1MCwyMTAwMDAwMDAwMDAsODEwMDAwMDAwMDAsMC4wMDAwMTJdXSwiY3MiOltbIjEiLDAuMDAyLDAuMDAwMDAxLDAuMSwxXV0sIm5sIjpbWyIyIix7IjAiOjAsIjIiOjMwMDAwLCI0IjowfV0sWyIzIix7IjAiOjAsIjIiOjMwMDAwLCI0IjowfV1dLCJkIjpbXX0%3D&lang=fr){target="_blank"} si vous voulez seulement l’explorer.

## Le problème {#the-problem}

![Géométrie, appuis et charges](/screenshots/fr/tut-truss-model.webp)

- Une portée de 12 m en trois panneaux de 4 m, hauteur 3 m.
- Nœuds de la membrure inférieure 1–4, nœuds de la membrure supérieure 5 et 6.
- Une articulation au nœud 1 et un appui simple au nœud 4.
- Deux charges de 30 kN aux nœuds 2 et 3 de la membrure inférieure.
- Barres en acier avec $A = 20$ cm².

| Nœud | X [m] | Z [m] | Appui | Charge |
| --- | --- | --- | --- | --- |
| 1 | 0 | 0 | articulation | |
| 2 | 4 | 0 | | `Fz = 30` kN |
| 3 | 8 | 0 | | `Fz = 30` kN |
| 4 | 12 | 0 | appui simple | |
| 5 | 4 | −3 | | |
| 6 | 8 | −3 | | |

Barres : membrure inférieure 1–2, 2–3, 3–4 ; membrure supérieure 5–6 ; diagonales d’extrémité 1–5 et 6–4 ; montants 2–5 et 3–6 ; et diagonale centrale 5–3.

**Est-il isostatique ?** $m + r = 9 + 3 = 12 = 2j$ avec $j = 6$ nœuds : oui, les efforts dans les barres découlent de l’équilibre seul.

## 1. Matériau et section {#_1-material-and-section}

1. **Effacer la structure** (cochez *Supprimer les matériaux* et *Supprimer les sections*).
2. *Matériaux* → **Bibliothèque de matériaux** → **Steel (S235)**.
3. *Sections* → **Ajouter une section** : `Aire = 0,002`, `Iy = 1e-6`, `Hauteur = 0,1`, `Coefficient de cisaillement = 1`. Avec des barres articulées, seule l’aire compte.

## 2. Dessinez les barres avec leurs rotules {#_2-draw-the-bars-with-hinges}

Dans EduBeam, une barre de treillis est un élément poutre dont les **deux rotules d’extrémité** sont cochées. L’outil souris peut les définir pour vous :

1. Onglet *Éléments* → le second bouton **Ajouter un élément** (icône de curseur).
2. Dans le bandeau en haut de la vue, cochez **Rotule au début** et **Rotule à la fin**. Chaque barre que vous dessinez reçoit désormais les deux.
3. Dessinez le contour en une seule polyligne : cliquez en (0, 0), (4, −3), (8, −3), (12, 0), puis revenez le long de la membrure inférieure : (8, 0), (4, 0), (0, 0). Appuyez sur <kbd>Échap</kbd>.
4. Dessinez les barres intérieures une par une, en appuyant sur <kbd>Échap</kbd> après chacune : (4, 0) → (4, −3), (4, −3) → (8, 0), (8, 0) → (8, −3).
5. Appuyez sur <kbd>F</kbd> pour ajuster la vue.

Vérifiez le tableau *Éléments* : neuf éléments, chacun avec ses deux *Rotules d’extrémité* cochées. Vos numéros de nœuds et d’éléments peuvent différer de ceux des images ; cela n’a pas d’importance.

## 3. Appuis et charges {#_3-supports-and-loads}

1. Cliquez sur le nœud en (0, 0) → **Appuis du nœud** → **Rotule**. Cliquez sur le nœud en (12, 0) → **Appui simple**.
2. Cliquez sur le nœud en (4, 0) → **Ajouter une charge** → `Fz = 30` kN. Faites de même en (8, 0).

Un `Fz` positif est orienté vers le bas. Les nœuds d’un treillis sont libres de tourner ; EduBeam accepte les nœuds où toutes les barres sont articulées et indique pour eux une rotation nulle.

## 4. Résultats {#_4-results}

Dans les options d’affichage, décochez **Déformée** et **M<sub>y</sub> (x)** (il n’y a pas de flexion dans un treillis) et cochez **N (x)**.

![Efforts normaux : traction positive](/screenshots/fr/tut-truss.webp)

## 5. Vérifiez à la main {#_5-check-by-hand}

**Réactions.** Les charges sont symétriques, donc $R_1 = R_4 = 30$ kN vers le haut, et la réaction horizontale à l’articulation est nulle.

**Nœud 1** (méthode des nœuds). La diagonale d’extrémité 1–5 mesure 5 m ($\sin\alpha = 3/5$, $\cos\alpha = 4/5$) :

$$\sum F_z:\ N_{15} \cdot \tfrac{3}{5} = -30 \Rightarrow N_{15} = -50\ \text{kN} \qquad \sum F_x:\ N_{12} = -N_{15} \cdot \tfrac{4}{5} = 40\ \text{kN}$$

**Nœud 2.** Le montant 2–5 est la seule barre capable de remonter la charge de 30 kN : $N_{25} = +30$ kN, et $N_{23} = N_{12} = 40$ kN.

**Coupe dans le panneau central.** Coupez les barres 5–6, 5–3 et 2–3 et gardez la partie gauche :

- Moments par rapport au nœud 3 : $R_1 \cdot 8 - 30 \cdot 4 + N_{56} \cdot 3 = 0 \Rightarrow N_{56} = -40$ kN.
- Forces verticales : l’effort tranchant dans le panneau vaut $R_1 - 30 = 0$, donc la diagonale **5–3 ne reprend rien** : $N_{53} = 0$.

| Barre | À la main | EduBeam |
| --- | --- | --- |
| Membrure inférieure 1–2, 2–3, 3–4 | +40 kN (traction) | 40 |
| Membrure supérieure 5–6 | −40 kN (compression) | −40 |
| Diagonales d’extrémité 1–5, 6–4 | −50 kN | −50 |
| Montants 2–5, 3–6 | +30 kN | 30 |
| Diagonale centrale 5–3 | 0 | 0 |

La flèche du nœud 2 vaut 2,29 mm (*Résultats → Résultats nodaux*). Calculez-la par les travaux virtuels, $\delta = \sum N n L / (EA)$, à titre d’exercice.

## 6. Expérimentez {#_6-experiment}

- **Déplacez une charge.** Mettez les deux charges de 30 kN au nœud 2. La diagonale centrale reprend maintenant un effort : de quel signe, et pourquoi ?
- **Supprimez la diagonale centrale.** Le treillis devient un mécanisme ; EduBeam entoure les rotules en cause et montre comment le panneau se déforme en cisaillement.
- **Décochez toutes les rotules.** Le treillis devient un portique à nœuds rigides. Cochez **M<sub>y</sub> (x)** : les moments fléchissants sont minimes comparés aux efforts normaux, ce qui explique pourquoi l’idéalisation en treillis articulé fonctionne.
- **Articulez les deux appuis.** Une réaction supplémentaire rend le treillis hyperstatique, et les efforts dans la membrure inférieure dépendent alors des aires des barres.
