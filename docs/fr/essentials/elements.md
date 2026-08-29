# Éléments, matériaux et sections

## L’élément poutre

<Edubeam /> ne possède qu’un seul type d’élément : une **poutre de Timoshenko 2D** dans le plan x–z, avec trois degrés de liberté à chaque extrémité (`Dx`, `Dz`, `Ry`). Elle transmet l’effort normal, l’effort tranchant et le moment fléchissant et prend en compte la déformation de cisaillement (d’où le coefficient de cisaillement de la section). La formulation complète est dans le [manuel théorique](/fr/elements/beam).

<TrussElement :moment="true" caption="Élément poutre 2D : trois degrés de liberté par nœud" />

Les diagrammes le long d’un élément sont exacts pour le modèle linéaire ; un élément par barre suffit. N’ajoutez des nœuds intermédiaires que là où vous avez besoin d’un appui, d’une rotule, d’un changement de section ou d’un nœud pour appliquer une charge.

### Ajouter des éléments

| Méthode | Comment |
| --- | --- |
| **Boîte de dialogue** | Onglet *Éléments* → **Ajouter un élément** (ou menu de la zone de dessin → *Ajouter un élément*) : choisissez **Nœud initial**, **Nœud final**, matériau et section. |
| **Souris** | Onglet *Éléments* → **Ajouter à la souris** (ou <kbd>Ctrl</kbd> avec l’entrée du menu). Cliquez sur un nœud pour commencer, puis sur le suivant pour connecter ; un clic sur une zone vide y crée un nœud. Continuez à cliquer pour tracer une polyligne ; <kbd>Échap</kbd> termine. Le premier matériau et la première section du modèle sont attribués automatiquement. |

::: warning Matériaux et sections d’abord
Un élément ne peut exister sans matériau ni section. S’il n’y en a aucun, la vue affiche *Aucun matériau défini.* / *Aucune section définie.* avec le raccourci **Ajouter**.
:::

### Orientation de l’élément

L’**axe x local** va du nœud initial au nœud final. Cela compte pour :

- les charges en repère local (`fx`, `fz` en SCL),
- la *Position de la charge depuis le nœud initial* des charges ponctuelles,
- l’ordre des efforts aux extrémités (`X12, Z12, M12` au début, `X21, Z21, M21` à la fin) dans le tableau de résultats.

Utilisez **Inverser les nœuds** dans le tableau *Éléments* pour retourner un élément.

### Rotules d’extrémité

Chaque élément a deux cases **Rotules d’extrémité** (début / fin) dans le tableau *Éléments*. Une rotule cochée libère le moment fléchissant à cette extrémité (condensation statique du DDL de rotation), donc :

- une rotule → une articulation dans un portique ou une poutre continue (moment nul à cet endroit) ;
- les deux rotules → une **barre de treillis**, qui ne transmet que l’effort normal.

<TrussElement :hinges="[true, true]" caption="Deux extrémités rotulées → barre de treillis" />

Lorsque deux éléments se rejoignent en un nœud et qu’un seul est rotulé, l’autre transmet toujours un moment au nœud : rotulez l’élément que vous voulez libérer, pas « le nœud ».

### Modifier et supprimer

Cliquez sur un élément et utilisez le menu contextuel (**Modifier l’élément**, **Ajouter une charge**, **Matrice de rigidité**, **Supprimer**) ou modifiez directement dans le tableau *Éléments*. Supprimer un élément supprime aussi ses charges. **Matrice de rigidité** ouvre une fenêtre flottante avec la matrice 6 × 6 de l’élément en repère local et global — pratique pour vérifier l’assemblage à la main dans la méthode des déplacements.

## Matériaux

Onglet *Matériaux* → **Ajouter un matériau** :

| Champ | Symbole | Unité | Remarques |
| --- | --- | --- | --- |
| Module d’Young | $E$ | unité de contrainte (MPa par défaut) | Acier ≈ 210 000 MPa, béton ≈ 30 000 MPa, bois ≈ 11 000 MPa |
| Module de cisaillement | $G$ | unité de contrainte | $G = E / (2(1+\nu))$ ; acier ≈ 81 000 MPa. N’intervient que dans le terme de cisaillement de Timoshenko. |
| Densité (masse volumique) | $\rho$ | kg/m³ | Enregistrée avec le projet ; non utilisée par le solveur statique (pas de poids propre). |
| Coefficient de dilatation thermique | $\alpha$ | 1/K | Utilisé par les [charges thermiques](/fr/essentials/loads#charge-thermique). Acier 12 × 10⁻⁶. |

La **Bibliothèque de matériaux** propose des valeurs prêtes à l’emploi : aciers de construction (S235, S275, S355, inoxydable), alliages d’aluminium, cuivre/laiton/bronze, titane, classes de béton, bois (C24, GL24h, GL32h), verre, GFRP/CFRP et polymères courants. Choisissez dans la boîte de la bibliothèque ou via *Ou choisir dans la bibliothèque* dans la boîte *Ajouter un matériau*.

## Sections

Onglet *Sections* → **Ajouter une section** :

| Champ | Symbole | Unité | Remarques |
| --- | --- | --- | --- |
| Aire | $A$ | unité d’aire | Rigidité axiale $EA$ |
| Moment quadratique | $I_y$ | m⁴ (ou unité choisie) | Rigidité de flexion $EI_y$ autour de l’axe de flexion dans le plan |
| Hauteur | $h$ | unité de longueur | Utilisée par les charges thermiques à gradient (courbure $= \alpha\,\Delta T / h$) |
| Coefficient de cisaillement | $k$ | – | Coefficient de correction de cisaillement : aire réduite d’effort tranchant $= kA$. Mettez `1` pour ignorer (presque) la déformation de cisaillement ; ≈ 0,83 pour un rectangle ; pour un profilé en I, $A_{âme}/A$. |

La **Bibliothèque de sections** fournit des valeurs approchées pour rectangles, carrés, cercles, profilés IPE et HEA, tubes RHS et CHS. Considérez-les comme un point de départ et vérifiez-les dans un catalogue de profilés avant de vous y fier.

::: tip Valeurs de contrôle rapides
Rectangle $b \times h$ : $A = bh$, $I_y = bh^3/12$. Cercle plein de diamètre $d$ : $A = \pi d^2/4$, $I_y = \pi d^4/64$.
:::

Matériaux et sections peuvent être partagés par un nombre quelconque d’éléments ; modifier une valeur met à jour tous les éléments qui l’utilisent et relance le calcul.
