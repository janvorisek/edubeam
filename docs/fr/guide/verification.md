# Vérifier les résultats à la main

<Edubeam /> est un bon endroit pour prendre l’habitude dont tout ingénieur a besoin : ne jamais faire confiance à un nombre que l’on ne sait pas retrouver, au moins en ordre de grandeur. Cette page donne des formules fermées pour les cas classiques et montre ce que l’application renvoie, pour que vous construisiez chaque modèle et compariez.

Tous les cas utilisent la même section en acier, sauf indication contraire : $E = 210\,000$ MPa, $G = 81\,000$ MPa, $A = 28{,}5$ cm², $I_y = 1943$ cm⁴, $h = 200$ mm, $k = 1$ (un IPE 200).

$$EI = 210 \times 10^9 \cdot 1{,}943 \times 10^{-5} = 4{,}080 \times 10^6\ \text{Nm}^2$$

::: tip Pourquoi les nombres diffèrent légèrement
EduBeam utilise des poutres de **Timoshenko**, qui ajoutent une flèche de cisaillement $\Delta w_s$ à la flèche de flexion classique d’Euler–Bernoulli. Rotations, réactions et sollicitations ne changent pas dans les cas isostatiques. Pour les barres élancées, le terme supplémentaire est minuscule ; les tableaux ci-dessous l’explicitent.
:::

## Poutre sur deux appuis, charge uniforme

$L = 6$ m, $q = 12$ kN/m. Appuis : nœud 1 `Dx + Dz`, nœud 2 `Dz`.

| Grandeur | Formule | Valeur | EduBeam |
| --- | --- | --- | --- |
| Réactions | $qL/2$ | 36 kN | 36 kN |
| $V_{max}$ | $qL/2$ | 36 kN | 36 kN |
| $M_{max}$ (mi-portée) | $qL^2/8$ | 54 kNm | 54 kNm |
| Rotation sur appui | $qL^3/(24EI)$ | 0,02647 rad | 0,02647 rad |
| Flèche à mi-portée | $5qL^4/(384EI)$ | 49,63 mm | 49,63 mm |

<ExampleStructure />

## Console, charge à l’extrémité

$L = 4$ m, $F = 18$ kN vers le bas à l’extrémité libre. Appui : nœud 1 `Dx + Dz + Ry`.

| Grandeur | Formule | Valeur | EduBeam |
| --- | --- | --- | --- |
| Réaction verticale | $F$ | 18 kN | 18 kN |
| Moment d’encastrement | $FL$ | 72 kNm | 72 kNm |
| Rotation à l’extrémité | $FL^2/(2EI)$ | 0,03529 rad | 0,03529 rad |
| Flèche à l’extrémité (flexion) | $FL^3/(3EI)$ | 94,11 mm | — |
| Flèche à l’extrémité (cisaillement) | $FL/(kGA)$ | 0,31 mm | — |
| Flèche à l’extrémité (totale) | somme | 94,42 mm | 94,42 mm |

Le terme de cisaillement vaut ici 0,3 %. Raccourcissez la console à 1 m et il atteint 5 % : c’est à cela que sert le coefficient de cisaillement.

<Figure>
  <Structure :show-loads="true" show-moment show-reactions :nodes="[{label: '1', coords: [0,0,0], dofs: [0,2,4]}, {label: '2', coords: [4,0,0], dofs: []}]" :elements="[{label: '1', nodes: ['1', '2']}]" :nodal-loads="[{target: '2', values: { 0: 0, 2: 18000, 4: 0 }}]" />
  <figcaption>Console avec 18 kN à l’extrémité : moment fléchissant et réactions</figcaption>
</Figure>

## Poutre bi-encastrée, charge uniforme

$L = 6$ m, $q = 12$ kN/m. Les deux nœuds `Dx + Dz + Ry`.

| Grandeur | Formule | Valeur |
| --- | --- | --- |
| Réactions | $qL/2$ | 36 kN |
| Moment d’encastrement | $qL^2/12$ | 36 kNm (négatif, fibre supérieure tendue) |
| Moment à mi-portée | $qL^2/24$ | 18 kNm (positif) |
| Flèche à mi-portée | $qL^4/(384EI)$ | 9,93 mm |

Construisez-la à partir de la poutre sur deux appuis en cochant `Ry` aux deux nœuds et observez le diagramme des moments se décaler.

## Poutre encastrée-appuyée, charge uniforme

$L = 6$ m, $q = 12$ kN/m. Nœud 1 `Dx + Dz + Ry`, nœud 2 `Dz`.

| Grandeur | Formule | Valeur |
| --- | --- | --- |
| Réaction à l’encastrement | $5qL/8$ | 45 kN |
| Réaction à l’appui simple | $3qL/8$ | 27 kN |
| Moment d’encastrement | $qL^2/8$ | 54 kNm (négatif) |
| Moment positif maximal | $9qL^2/128$ en $x = 5L/8$ depuis l’encastrement | 30,4 kNm à 3,75 m |

L’application étiquette l’extremum local automatiquement : vous lisez la valeur et (par sa position sur l’élément) l’endroit où il se produit.

## Treillis à deux barres

Deux barres partant d’articulations en `(0, 0)` et `(4, 0)` se rejoignant en `(2, −2)` (sommet 2 m au-dessus), les **deux rotules d’extrémité** cochées sur chaque barre, charge verticale $F = 20$ kN au sommet (vers le bas, soit `Fz = 20`).

Chaque barre est inclinée à 45°, de longueur $L = 2\sqrt{2}$ m. Par symétrie, chacune reprend

$$N = -\frac{F}{2 \sin 45^\circ} = -14{,}14\ \text{kN (compression)}$$

et chaque appui reçoit 10 kN verticalement et ±10 kN horizontalement. Vérifiez la couche **N (x)** et les réactions.

## Gradient thermique sur poutre sur deux appuis

$L = 8$ m, $\Delta T_b - \Delta T_t = -10$ K (fibre supérieure plus chaude), $\alpha = 12 \times 10^{-6}$, $h = 0{,}2$ m.

La poutre est libre de se courber, il n’y a donc **aucune sollicitation** ; la courbure vaut

$$\kappa = \frac{\alpha\,(\Delta T_b - \Delta T_t)}{h} = \frac{12 \times 10^{-6} \cdot (-10)}{0{,}2} = -6 \times 10^{-4}\ \text{m}^{-1}$$

et la flèche à mi-portée $\kappa L^2 / 8 = -4{,}8$ mm (vers le haut). Bloquez maintenant `Ry` aux deux extrémités : la courbure est empêchée et un moment constant $M = EI\kappa = 2{,}45$ kNm apparaît sur toute la portée.

## Déplacement imposé

Reprenez la [poutre encastrée-appuyée](#poutre-encastree-appuyee-charge-uniforme) sans charge et imposez `Dz = 10 mm` à l’appui simple (un tassement). La réaction nécessaire pour abaisser de $w$ l’extrémité d’une console est $R = 3EIw/L^3 = 0{,}567$ kN et le moment d’encastrement $RL = 3{,}40$ kNm. Remettez la charge uniforme et les résultats se superposent linéairement.

## Conseils pour vos propres vérifications

- Gardez la **pastille des unités** en vue ; la plupart des écarts sont des erreurs d’unités.
- Utilisez la fenêtre **Matrice de rigidité** pour comparer un élément isolé au [manuel théorique](/fr/elements/beam) lorsque vous apprenez la méthode des déplacements.
- Lisez les valeurs exactes dans l’onglet **Résultats** et les infobulles, pas sur les étiquettes des diagrammes, qui sont arrondies.
- Transmettez un modèle vérifié à un collègue ou un enseignant avec **Partager le modèle**.
