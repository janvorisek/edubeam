# Vérifier les résultats à la main

<Edubeam /> est un bon endroit pour prendre l’habitude dont tout ingénieur a besoin : ne jamais faire confiance à un nombre que l’on ne sait pas retrouver, au moins approximativement. Cette page donne des formules analytiques pour les cas classiques et indique ce que l’application renvoie, pour que vous puissiez construire chaque modèle vous-même et comparer.

Pour des exemples complets résolus avec vérifications à la main, voir les tutoriels du [portique à trois articulations](/fr/tutorials/three-hinged-frame) et du [treillis plan](/fr/tutorials/truss).

Tous les cas utilisent la même section en acier, sauf indication contraire : $E = 210\,000$ MPa, $G = 81\,000$ MPa, $A = 28{,}5$ cm², $I_y = 1943$ cm⁴, $h = 200$ mm, $k = 1$ (un IPE 200).

$$EI = 210 \times 10^9 \cdot 1{,}943 \times 10^{-5} = 4{,}080 \times 10^6\ \text{Nm}^2$$

::: tip Pourquoi les nombres diffèrent légèrement
EduBeam utilise des poutres de **Timoshenko**, qui ajoutent une flèche d’effort tranchant $\Delta w_s$ à la flèche de flexion classique d’Euler–Bernoulli. Les rotations, les réactions et les efforts internes ne changent pas dans les cas isostatiques. Pour les barres élancées, le terme supplémentaire est minime ; les tableaux ci-dessous le font apparaître explicitement.
:::

## Poutre sur deux appuis, charge uniforme {#simply-supported-beam-uniform-load}

$L = 6$ m, $q = 12$ kN/m. Appuis : nœud 1 `Dx + Dz`, nœud 2 `Dz`.

| Grandeur | Formule | Valeur | EduBeam |
| --- | --- | --- | --- |
| Réactions | $qL/2$ | 36 kN | 36 kN |
| $V_{max}$ | $qL/2$ | 36 kN | 36 kN |
| $M_{max}$ (mi-portée) | $qL^2/8$ | 54 kNm | 54 kNm |
| Rotation sur appui | $qL^3/(24EI)$ | 0,02647 rad | 0,02647 rad |
| Flèche à mi-portée (flexion) | $5qL^4/(384EI)$ | 49,63 mm | — |
| Flèche à mi-portée (cisaillement) | $qL^2/(8kGA)$ | 0,23 mm | — |
| Flèche à mi-portée (totale) | somme | 49,86 mm | 49,86 mm |

Pour lire la flèche à mi-portée, ajoutez un nœud au milieu avec *Ajouter un nœud* (souris) → **Connecter à la structure** ; scinder l’élément ne change aucun résultat.

<ExampleStructure />

## Console, charge à l’extrémité {#cantilever-tip-load}

$L = 4$ m, $F = 18$ kN vers le bas à l’extrémité libre. Appui : nœud 1 `Dx + Dz + Ry`.

| Grandeur | Formule | Valeur | EduBeam |
| --- | --- | --- | --- |
| Réaction verticale | $F$ | 18 kN | 18 kN |
| Moment d’encastrement | $FL$ | 72 kNm | 72 kNm |
| Rotation à l’extrémité | $FL^2/(2EI)$ | 0,03529 rad | 0,03529 rad |
| Flèche à l’extrémité (flexion) | $FL^3/(3EI)$ | 94,11 mm | — |
| Flèche à l’extrémité (cisaillement) | $FL/(kGA)$ | 0,31 mm | — |
| Flèche à l’extrémité (totale) | somme | 94,42 mm | 94,42 mm |

Le terme d’effort tranchant vaut ici 0,3 %. Raccourcissez la console à 1 m et il atteint 5 % : c’est à cela que sert le coefficient de cisaillement.

<Figure>
  <Structure :show-loads="true" show-moment show-reactions :nodes="[{label: '1', coords: [0,0,0], dofs: [0,2,4]}, {label: '2', coords: [4,0,0], dofs: []}]" :elements="[{label: '1', nodes: ['1', '2']}]" :nodal-loads="[{target: '2', values: { 0: 0, 2: 18000, 4: 0 }}]" />
  <figcaption>Console avec une charge de 18 kN à l’extrémité : moment fléchissant et réactions</figcaption>
</Figure>

## Poutre bi-encastrée, charge uniforme {#fixed–fixed-beam-uniform-load}

$L = 6$ m, $q = 12$ kN/m. Les deux nœuds `Dx + Dz + Ry`.

| Grandeur | Formule | Valeur |
| --- | --- | --- |
| Réactions | $qL/2$ | 36 kN |
| Moment sur appui | $qL^2/12$ | 36 kNm (négatif, fibre supérieure tendue) |
| Moment à mi-portée | $qL^2/24$ | 18 kNm (positif, fibre inférieure tendue) |
| Flèche à mi-portée | $qL^4/(384EI) + qL^2/(8kGA)$ | 9,93 + 0,23 = 10,16 mm |

Construisez-la à partir de la poutre sur deux appuis en cochant `Ry` aux deux nœuds et observez le diagramme des moments se décaler.

## Poutre encastrée-appuyée, charge uniforme {#propped-cantilever-uniform-load}

$L = 6$ m, $q = 12$ kN/m. Nœud 1 `Dx + Dz + Ry`, nœud 2 `Dz`.

| Grandeur | Formule | Valeur |
| --- | --- | --- |
| Réaction à l’encastrement | $5qL/8$ | 45 kN |
| Réaction à l’appui simple | $3qL/8$ | 27 kN |
| Moment d’encastrement | $qL^2/8$ | 54 kNm (négatif) |
| Moment positif maximal | $9qL^2/128$ en $x = 5L/8$ depuis l’encastrement | 30,4 kNm à 3,75 m |

L’application étiquette automatiquement l’extremum local : vous pouvez donc lire à la fois sa valeur et (d’après sa position le long de l’élément) l’endroit où il se produit.

## Treillis à deux barres {#two-bar-truss}

Deux barres partant d’articulations en `(0, 0)` et `(4, 0)` et se rejoignant en `(2, −2)` (sommet 2 m plus haut), les deux **rotules d’extrémité** cochées sur les deux barres, une charge verticale $F = 20$ kN au sommet (vers le bas, soit `Fz = 20`).

Chaque barre est inclinée à 45°, de longueur $L = 2\sqrt{2}$ m. Par symétrie, chacune reprend

$$N = -\frac{F}{2 \sin 45^\circ} = -14{,}14\ \text{kN (compression)}$$

et chaque appui reprend 10 kN verticalement et ±10 kN horizontalement. Vérifiez la couche **N (x)** et les réactions.

## Gradient thermique sur une poutre sur deux appuis {#temperature-gradient-on-a-simply-supported-beam}

$L = 8$ m, $\Delta T_b - \Delta T_t = -10$ K (fibre supérieure plus chaude), $\alpha = 12 \times 10^{-6}$, $h = 0{,}2$ m.

La poutre est libre de se courber, il n’y a donc **aucun effort interne** ; la courbure vaut

$$\kappa = \frac{\alpha\,(\Delta T_b - \Delta T_t)}{h} = \frac{12 \times 10^{-6} \cdot (-10)}{0{,}2} = -6 \times 10^{-4}\ \text{m}^{-1}$$

et la flèche à mi-portée vaut $\kappa L^2 / 8 = -4{,}8$ mm (vers le haut). Bloquez maintenant `Ry` aux deux extrémités : la courbure est empêchée et un moment constant $M = EI\kappa = 2{,}45$ kNm apparaît sur toute la portée.

## Déplacement imposé {#prescribed-displacement}

Reprenez la [poutre encastrée-appuyée](#propped-cantilever-uniform-load) sans charge et imposez `Dz = 10 mm` à l’appui simple (un tassement). La réaction nécessaire pour abaisser de $w$ l’extrémité d’une console est $R = 3EIw/L^3 = 0{,}567$ kN et le moment d’encastrement vaut $RL = 3{,}40$ kNm. Remettez la charge uniforme : les résultats se superposent linéairement.

## Conseils pour vos propres vérifications {#tips-for-your-own-checks}

- Gardez la **pastille des unités** en vue ; la plupart des écarts sont des erreurs d’unités.
- Utilisez la fenêtre **Matrice de rigidité** pour comparer un élément isolé au [manuel théorique](/fr/elements/beam) quand vous apprenez la méthode des déplacements.
- Lisez les valeurs exactes dans l’onglet **Résultats** et dans les infobulles au survol plutôt que sur les étiquettes des diagrammes, qui sont arrondies. **Exporter en CSV** ou **Copier** dans l’onglet Résultats vous donne aussi les réactions, prêtes pour un tableur.
- Réglez **Format des nombres** sur *Automatique* dans les Paramètres pour lire `40` au lieu de `4 · 10¹`.
- Utilisez **Partager le modèle** pour transmettre un modèle vérifié à un collègue ou à un enseignant.
