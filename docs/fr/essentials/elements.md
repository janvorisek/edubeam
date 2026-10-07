# Éléments, matériaux et sections

## L’élément poutre {#the-beam-element}

<Edubeam /> dispose d’un seul type d’élément : une **poutre de Timoshenko 2D** dans le plan x–z, avec trois degrés de liberté à chaque extrémité (`Dx`, `Dz`, `Ry`). Il reprend l’effort normal, l’effort tranchant et la flexion, et tient compte de la déformation d’effort tranchant ; c’est pourquoi la section possède un coefficient de cisaillement. La formulation complète se trouve dans le [manuel théorique](/fr/elements/beam).

<TrussElement :moment="true" caption="Élément poutre 2D – trois DDL par nœud" />

Les résultats le long d’un élément sont exacts pour le modèle linéaire : un seul élément par barre suffit. N’ajoutez des nœuds intermédiaires que là où vous avez besoin d’un appui, d’une rotule, d’un changement de section ou d’un nœud où lire des résultats.

### Ajouter des éléments {#adding-elements}

| Méthode | Comment |
| --- | --- |
| **Boîte de dialogue** | Onglet *Éléments* → le premier bouton **Ajouter un élément**, ou le menu contextuel → *Ajouter un élément*. Choisissez le **Nœud initial** et le **Nœud final**, les rotules, le matériau et la section. |
| **Souris** | Onglet *Éléments* → le second bouton **Ajouter un élément** (icône de curseur), ou maintenez <kbd>Ctrl</kbd> en choisissant l’entrée du menu contextuel. Cliquez sur un nœud pour commencer, puis sur le nœud suivant à relier ; un clic sur une zone vide y crée un nœud. Continuez à cliquer pour tracer une polyligne, et appuyez sur <kbd>Échap</kbd> pour terminer. Le bandeau en haut définit **Rotule au début** et **Rotule à la fin** pour chaque élément que vous dessinez. Le premier matériau et la première section du modèle sont utilisés. |

![La boîte de dialogue Ajouter un élément](/screenshots/fr/qs-element.webp){.shot-md}

::: warning D’abord les matériaux et les sections
Un élément a besoin d’un matériau et d’une section. S’il n’y en a aucun, la vue affiche *Aucun matériau défini.* / *Aucune section définie.* avec un bouton **Ajouter**.
:::

### Orientation de l’élément {#element-direction}

L’**axe x local** va du nœud initial au nœud final. Cela compte pour :

- les charges en coordonnées locales (case **LCS** cochée),
- la *Position de la charge depuis le nœud initial* des charges ponctuelles,
- l’ordre des efforts aux extrémités (`X12, Z12, M12` au début, `X21, Z21, M21` à la fin) dans le tableau des résultats.

Utilisez le bouton d’inversion entre les deux nœuds dans le tableau *Éléments* pour inverser un élément.

### Rotules d’extrémité {#end-hinges}

Chaque élément possède deux cases **Rotules d’extrémité**, début et fin, dans le tableau *Éléments*. On les trouve aussi dans la boîte de dialogue Ajouter un élément, dans le panneau **Modifier l’élément** et dans le bandeau lorsque vous dessinez à la souris. Une rotule cochée libère le moment fléchissant à cette extrémité :

- une rotule crée une articulation à l’intérieur d’un portique ou d’une poutre continue (le moment y est nul) ;
- deux rotules font une **barre de treillis**, qui ne reprend que l’effort normal.

<TrussElement :hinges="[true, true]" caption="Deux extrémités articulées → élément de treillis" />

![Le tableau des éléments du portique à trois articulations : l’élément 2 a une rotule à sa fin, au nœud C](/screenshots/fr/elements-table.webp)

Quand deux éléments se rejoignent en un nœud et qu’un seul est articulé, l’autre transmet toujours un moment au nœud. Placez donc la rotule sur l’élément que vous voulez libérer, et non « sur le nœud ». Si des rotules font de la structure un mécanisme, EduBeam les entoure et montre comment elle se déplace.

### Modifier et supprimer {#editing-and-deleting}

Cliquez sur un élément et utilisez son panneau (**Modifier l’élément**, **Ajouter une charge**, **Matrice de rigidité**, **Supprimer**), ou modifiez-le dans le tableau *Éléments*. Supprimer un élément supprime aussi ses charges. **Matrice de rigidité** ouvre une fenêtre avec la matrice de rigidité 6 × 6 de l’élément en coordonnées globales (N/m, N et N·m), les éventuelles rotules d’extrémité étant déjà condensées. C’est pratique pour vérifier un assemblage fait à la main.

## Matériaux {#materials}

Onglet *Matériaux* → **Ajouter un matériau** :

| Champ | Symbole | Unité | Remarques |
| --- | --- | --- | --- |
| Module d’Young | $E$ | unité de contrainte (MPa par défaut) | Acier ≈ 210 000 MPa, béton ≈ 30 000 MPa, bois ≈ 11 000 MPa |
| Module de cisaillement | $G$ | unité de contrainte | $G = E / (2(1+\nu))$ ; acier ≈ 81 000 MPa. N’intervient que dans le terme de cisaillement de Timoshenko. |
| Masse volumique | $\rho$ | masse / longueur³ (kg/m³, lb/ft³) | Enregistrée avec le projet. Le solveur statique ne l’utilise pas (il n’y a pas de charge de poids propre). |
| Coefficient de dilatation thermique | $\alpha$ | 1/K ou 1/°F | Utilisé par les [charges thermiques](/fr/essentials/loads#temperature-load). Acier : 12 × 10⁻⁶ /K. |

<div class="shots">

![Ajouter un matériau](/screenshots/fr/qs-material.webp)

![La Bibliothèque de matériaux](/screenshots/fr/qs-material-library.webp)

</div>

La **Bibliothèque de matériaux** propose des matériaux prêts à l’emploi. La famille qui correspond à vos unités est listée en premier.

- **Métaux :** aciers de construction S235, S275, S355, aciers inoxydables, fonte, alliages d’aluminium, cuivre, laiton, bronze, titane ; aciers américains ASTM A992, A36, A572 Gr. 50 et HSS A500 Gr. C.
- **Béton :** béton normal et béton léger, classes C25/30, C30/37, C40/50, et f′c = 4 ksi et 5 ksi.
- **Bois :** C24, GL24h, GL32h.
- **Autres :** verre, PRFV (GFRP), PRFC (CFRP), PEHD, PVC, PMMA, polycarbonate.

Ouvrez-la avec le bouton de la barre d’outils ou avec *Ou choisir dans la bibliothèque* dans la boîte de dialogue *Ajouter un matériau*.

Un matériau encore utilisé par des éléments ne peut pas être supprimé ; affectez d’abord un autre matériau à ces éléments.

## Sections {#cross-sections}

Onglet *Sections* → **Ajouter une section** :

| Champ | Symbole | Unité | Remarques |
| --- | --- | --- | --- |
| Aire | $A$ | unité d’aire | Rigidité axiale $EA$ |
| Moment quadratique | $I_y$ | unité de moment quadratique | Rigidité en flexion $EI_y$ autour de l’axe perpendiculaire au dessin |
| Hauteur | $h$ | unité de dimension de section | Utilisée par les charges de gradient thermique (courbure $= \alpha\,\Delta T / h$) |
| Coefficient de cisaillement | $k$ | – | Coefficient de correction de cisaillement de Timoshenko : l’aire de cisaillement effective vaut $kA$. Utilisez `1` pour négliger presque la déformation d’effort tranchant, environ 0,83 pour les rectangles, $A_{âme}/A$ pour les profilés en I. |

La **Bibliothèque de sections** donne des valeurs approchées pour les rectangles, carrés et cercles, les profilés IPE et HEA, les tubes RHS et CHS, et les profilés AISC W et HSS (rectangulaires et ronds). Ses coefficients de cisaillement dépendent de la forme : $h\,t_w/A$ pour les profilés en I, $2ht/A$ pour les tubes rectangulaires, 0,5 pour les tubes ronds, 0,833 pour les rectangles et 0,9 pour les cercles. Considérez ces valeurs comme des points de départ et vérifiez-les dans un catalogue de profilés avant de vous y fier.

![La Bibliothèque de sections](/screenshots/fr/sections-library.webp){.shot-lg}

### Sections polygonales {#polygonal-sections}

Onglet *Sections* → **Section polygonale**, ou *Ou définir une forme polygonale* dans la boîte de dialogue *Ajouter une section*, ouvre un éditeur de forme.

![L’éditeur de section polygonale avec un profilé en I prédéfini, ses axes principaux et son ellipse d’inertie](/screenshots/fr/sections-polygon.webp)

- **Partez** d’une forme prédéfinie (rectangle, I, T, L, U, creux rectangulaire ou circulaire, cercle) avec ses dimensions, puis cliquez sur **Appliquer**.
- **Modifiez** la forme : faites glisser les sommets (ils s’accrochent au **Pas de magnétisme**), cliquez au milieu d’une arête pour insérer un sommet, double-cliquez sur un sommet pour le supprimer, ou saisissez les coordonnées dans le tableau des sommets. **Ajouter un évidement** ajoute un contour intérieur. **Centrer sur le centre de gravité** déplace la forme pour que son centre de gravité soit à l’origine.
- **Lisez** l’aire $A$, le centre de gravité, les moments quadratiques centraux $I_y$, $I_z$, $I_{yz}$, les moments principaux $I_1$, $I_2$ avec l’angle des axes principaux $\alpha$ (de $y$ vers l’axe 1), et les rayons de giration. Le dessin montre l’ellipse d’inertie.

À l’enregistrement, $A$, $I_y$ et $h$ sont remplis à partir de la forme. Ils apparaissent en lecture seule dans le tableau ; utilisez le bouton polygone de la colonne *Actions* pour modifier à nouveau la forme. Le coefficient de cisaillement $k$ reste à saisir par vous. Les coordonnées de la section sont locales et directes, avec $x$ sortant de l’écran, $y$ vers la gauche et $z$ vers le bas.

Si la forme n’est pas symétrique par rapport au plan du portique (une cornière en L, par exemple), l’éditeur avertit qu’une analyse 2D n’est exacte que si la barre est maintenue contre le déplacement latéral et la torsion sur toute sa longueur, par exemple par une dalle. Quand $I_{yz}$ est significatif, vous choisissez la rigidité en flexion à utiliser : **maintenue latéralement et en torsion sur toute sa longueur** ($I_y$) ou **libre de se déplacer latéralement**, qui est plus faible. La torsion n’est prise en compte dans aucun des deux cas.

::: tip Valeurs de contrôle rapides
Pour un rectangle $b \times h$ : $A = bh$, $I_y = bh^3/12$. Pour un cercle plein de diamètre $d$ : $A = \pi d^2/4$, $I_y = \pi d^4/64$.
:::

Les matériaux et les sections peuvent être partagés par un nombre quelconque d’éléments. Modifier une valeur met à jour tous les éléments qui l’utilisent et recalcule le modèle.
