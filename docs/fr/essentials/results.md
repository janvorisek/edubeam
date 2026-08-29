# Résultats et diagrammes

<Edubeam /> résout le modèle automatiquement après chaque modification (limité à quelques calculs par seconde) ; les résultats sont donc toujours à jour. Il n’y a pas de bouton *Calculer*. Si rien n’est tracé, le modèle n’est pas encore résoluble — voir [Dépannage](/fr/reference/troubleshooting).

## Couches dans la vue

Activez-les ou désactivez-les dans le **panneau d’affichage** (bouton ⚙, en haut à droite de la vue).

| Couche | Couleur (défaut) | Remarques |
| --- | --- | --- |
| **Déformée** | gris | Amplifiée ; mise à l’échelle pour que le plus grand déplacement mesure la valeur d’*Échelle des résultats* en pixels. |
| **N (x)** – effort normal | bleu | Traction positive. Constant le long d’un élément sauf charge répartie axiale. |
| **V<sub>z</sub> (x)** – effort tranchant | vert | Linéaire sous charge uniforme, quadratique sous charge trapézoïdale, saut aux charges ponctuelles. |
| **M<sub>y</sub> (x)** – moment fléchissant | rouge | Positif quand la fibre inférieure est tendue. Étiqueté aux deux extrémités, aux charges ponctuelles et à chaque extremum local (où V = 0). |
| **Réactions** | violet | Une flèche et une valeur pour chaque DDL bloqué. |

Les diagrammes sont tracés le long des éléments avec leurs valeurs aux points caractéristiques. L’orientation des étiquettes et l’échelle de tous les tracés se règlent dans les [Paramètres](/fr/essentials/units-settings#parametres-d-affichage).

### Effort normal

<Figure>
    <Structure :show-loads="true" show-normal-force :nodes="[{label: 'a', coords: [0,0,0], dofs: [0,2, 4]}, {label: 'b', coords: [10,0,0], dofs: []}]" :elements="[{label: '1', nodes: ['a', 'b']}]" :nodal-loads="[{target: 'b', values: { 0: -100, 2: 0, 4: 0 }}]" />
    <figcaption>Console comprimée par une force horizontale à l’extrémité libre : N est constant et négatif</figcaption>
</Figure>

### Effort tranchant

<Figure>
  <Structure :show-loads="true" show-shear-force :nodes="[{label: 'a', coords: [0,0,0], dofs: [0,2, 4]}, {label: 'b', coords: [10,0,0], dofs: []}]" :elements="[{label: '1', nodes: ['a', 'b']}]" :nodal-loads="[{target: 'b', values: { 0: 0, 2: 10, 4: 0 }}]" />
 <figcaption>Console avec charge verticale à l’extrémité : V est constant</figcaption>
</Figure>

### Moment fléchissant

<Figure>
  <Structure :show-loads="true" show-moment :nodes="[{label: 'a', coords: [0,0,0], dofs: [0,2, 4]}, {label: 'b', coords: [10,0,0], dofs: []}]" :elements="[{label: '1', nodes: ['a', 'b']}]" :nodal-loads="[{target: 'b', values: { 0: 0, 2: 10, 4: 0 }}]" />
 <figcaption>La même console : M croît linéairement jusqu’à F·L à l’encastrement</figcaption>
</Figure>

### Déformée

<Figure>
  <Structure :show-loads="true" show-deformed-shape :nodes="[{label: 'a', coords: [0,0,0], dofs: [0,2, 4]}, {label: 'b', coords: [10,0,0], dofs: []}]" :elements="[{label: '1', nodes: ['a', 'b']}]" :nodal-loads="[{target: 'b', values: { 0: 0, 2: 10, 4: 0 }}]" />
  <figcaption>Déformée (amplifiée) de la console</figcaption>
</Figure>

### Réactions

<Structure :show-loads="true" show-reactions :nodes="[{label: 'a', coords: [0,0,0], dofs: [0,2, 4]}, {label: 'b', coords: [10,0,0], dofs: []}]" :elements="[{label: '1', nodes: ['a', 'b']}]" :nodal-loads="[{target: 'b', values: { 0: 0, 2: 10, 4: 0 }}]" />

## Infobulles au survol

Survoler dans la vue est le moyen le plus rapide de lire une valeur :

- **Nœud** → `ux`, `uz`, `φy` (déplacements dans l’unité de longueur, rotation en radians).
- **Élément** → son libellé, sa section et son matériau.
- **Charge** → ses composantes.

## Onglet Résultats

L’onglet **Résultats** de la barre inférieure propose deux vues :

### Résultats nodaux

Une ligne par nœud avec **Dx**, **Dz** (unité de longueur) et **Ry** (rad). Les signes suivent les axes globaux : `Dz` positif vers le bas, `Ry` positif dans le sens trigonométrique à l’écran.

<figure>

![Résultats nodaux](/results_nodes.png)

</figure>

### Résultats par élément

Une ligne par élément avec les **efforts aux extrémités dans le repère local de l’élément** :

| Colonne | Signification |
| --- | --- |
| `X12`, `Z12`, `M12` | effort normal, effort tranchant et moment agissant sur l’élément à son nœud **initial** |
| `X21`, `Z21`, `M21` | idem à son nœud **final** |

Ce sont les efforts que les nœuds exercent sur l’élément (matrice de rigidité de l’élément multipliée par ses déplacements d’extrémité, moins les charges nodales équivalentes). Pour une poutre de 6 m sur deux appuis sous 12 kN/m, on obtient `Z12 = Z21 = −36 kN` : les deux appuis poussent la poutre vers le haut (z négatif). Pour une console encastrée au nœud initial avec 18 kN vers le bas à l’extrémité : `Z12 = −18`, `M12 = +72 kNm`, `Z21 = +18`, `M21 = 0`.

<figure>

![Résultats par élément](/results_elements.png)

</figure>

### Matrice de rigidité

Choisissez **Matrice de rigidité** dans le menu contextuel d’un élément ou sur sa ligne du tableau pour ouvrir une fenêtre flottante avec la matrice de rigidité 6 × 6 de l’élément en repère local et global — utile pour vérifier l’assemblage à la main dans un cours de méthode des déplacements. Les formules sont dans le [manuel théorique](/fr/elements/beam).

## Précision

- L’élément poutre est exact pour le modèle linéaire de Timoshenko sous charges nodales, uniformes, trapézoïdales, ponctuelles et thermiques ; les résultats **ne dépendent pas** du nombre d’éléments.
- Les tableaux affichent quatre chiffres significatifs ; le calcul interne est en double précision.
- Les flèches incluent la **déformation de cisaillement** (Timoshenko). Pour les barres élancées, cela ajoute une fraction de pour cent par rapport aux formules d’Euler–Bernoulli ; pour les barres hautes ou courtes, cela peut atteindre plusieurs pour cent. Donnez au coefficient de cisaillement de la section une grande valeur si vous voulez la supprimer.

## Reporter les résultats dans un rapport

Il n’y a pas d’export de tableau ; sélectionnez le texte du tableau et copiez-le, ou faites une capture d’écran de la vue. Pour transmettre un modèle à quelqu’un, utilisez [Partager le modèle](/fr/essentials/import-export).
