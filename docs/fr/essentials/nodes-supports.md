# Nœuds et appuis

Les nœuds sont les points du modèle. Les éléments relient les nœuds ; les appuis et les charges nodales s’appliquent aux nœuds.

## Coordonnées

Chaque nœud a une coordonnée **X** et une coordonnée **Z** dans l’unité de longueur courante. L’axe x pointe vers la droite et l’**axe z pointe vers le bas** à l’écran : un poteau qui monte depuis le sol va donc de `Z = 0` à `Z = −3`, et non `+3`. L’indicateur d’axes dans le coin de la grille montre l’orientation courante. Voir [Repère et conventions de signe](/fr/elements/conventions).

## Ajouter des nœuds

| Méthode | Comment |
| --- | --- |
| **Boîte de dialogue** | Onglet *Nœuds* → **Ajouter un nœud**, ou clic droit sur la zone de dessin → *Ajouter un nœud*. Saisissez X et Z. |
| **Souris** | Onglet *Nœuds* → **Ajouter à la souris** (ou maintenez <kbd>Ctrl</kbd> en choisissant *Ajouter un nœud* dans le menu de la zone de dessin), puis cliquez. Chaque clic ajoute un nœud ; <kbd>Échap</kbd> termine. |
| **En traçant des éléments** | En mode *Ajouter un élément → Ajouter à la souris*, un clic sur une zone vide crée un nœud et le connecte. |
| **Copier-coller** | Sélectionnez des nœuds (et éléments), <kbd>Ctrl</kbd>+<kbd>C</kbd>, <kbd>Ctrl</kbd>+<kbd>V</kbd>, puis cliquez là où la copie doit aller. |

Les libellés sont attribués automatiquement (`1`, `2`, …) et peuvent être renommés dans le tableau.

### Magnétisme

Avec **Magnétisme à la grille** activé (<kbd>S</kbd> ou la pastille **S**), les nœuds placés ou déplacés à la souris se calent sur des multiples du **Pas de magnétisme de la grille** (par défaut `0,1 m`, modifiable dans *Paramètres → Paramètres d’affichage → Grille*). Désactivez le magnétisme pour un placement libre, ou saisissez ensuite les coordonnées exactes dans le tableau.

### Placer un nœud sur un élément existant

Si, en ajoutant un nœud, vous cliquez à moins de ~0,1 m d’un élément, EduBeam vous demande ce que vous souhaitez :

- **Connecter à la structure** : l’élément est scindé en deux (`1a` et `1b`), les rotules des extrémités extérieures sont conservées et une éventuelle charge répartie est partagée entre les deux moitiés. C’est le moyen le plus rapide d’ajouter un appui intermédiaire ou un point d’application de charge.
- **Placer un nœud isolé** : le nœud est créé sur l’élément sans y être connecté.

## Modifier des nœuds

- **Tableau :** modifiez libellé, X et Z sur place.
- **Glisser :** déplacez un nœud dans la vue (annulable). Sur écran tactile, appuyez longuement sur le nœud pour commencer à le déplacer.
- **Boîte Modifier le nœud :** coordonnées, appuis et angle du SCL au même endroit, avec aperçu du symbole d’appui.
- **Supprimer :** l’icône corbeille du tableau, *Supprimer* dans le menu du nœud, ou sélection puis <kbd>Suppr</kbd>. Supprimer un nœud supprime les éléments et charges qui lui sont rattachés.

## Appuis

Un appui n’est rien d’autre qu’un ensemble de degrés de liberté (DDL) bloqués. Chaque nœud en a trois :

| DDL | Signification |
| --- | --- |
| **Dx** | translation selon x (horizontale) |
| **Dz** | translation selon z (verticale) |
| **Ry** | rotation autour de y (dans le plan de la structure) |

Cochez les cases dans la colonne **DDL bloqués** de l’onglet *Nœuds*, dans le menu **Appuis du nœud** d’un nœud sélectionné ou dans la boîte *Modifier le nœud*. Le symbole dessiné dans la vue découle de la combinaison :

| Bloqués | Appui | Symbole |
| --- | --- | --- |
| Dx + Dz + Ry | Encastrement | bloc hachuré |
| Dx + Dz | Articulation (appui double) | triangle |
| Dz | Appui simple glissant horizontalement | triangle sur rouleaux |
| Dx | Appui simple glissant verticalement | rouleau tourné |
| Dz + Ry | Encastrement glissant (guidage vertical) | encastrement sur rouleaux |
| Dx + Ry | Encastrement glissant (guidage horizontal) | encastrement glissant tourné |
| Ry | Rotation seule bloquée | blocage en rotation |
| aucun | Nœud libre | — |

Une réaction est calculée — et dessinée — pour chaque DDL bloqué.

::: tip Nœuds de treillis
Les barres de treillis sont des éléments poutre dont les **deux rotules d’extrémité** sont libérées (voir [Éléments](/fr/essentials/elements#rotules-d-extremite)). Au nœud d’un treillis, l’articulation (Dx + Dz) est le choix habituel ; **ne bloquez pas** Ry en un nœud où tous les éléments connectés sont rotulés, sinon la rotation de ce nœud est indéterminée.
:::

### Appuis inclinés

Définissez l’**Angle du SCL nodal** (degrés, −180…180) dans le menu du nœud ou la boîte *Modifier le nœud*. Les axes locaux du nœud tournent de cet angle et les DDL d’appui sont interprétés dans le repère tourné : un appui simple sur une pente à 30° est `Dz` avec un angle de `30`. Le symbole d’appui tourne en conséquence et la réaction est donnée dans la direction tournée.

### Stabilité

Le solveur exige au moins **trois DDL bloqués** au total et une structure sans mécanisme. Des appuis insuffisants produisent l’erreur *Model needs at least 3 constrained DOFs…* ou simplement aucun résultat. Voir [Dépannage](/fr/reference/troubleshooting).

## Charges nodales et tassements

Forces, moments et déplacements imposés (tassements d’appui) s’appliquent aux nœuds — voir [Charges](/fr/essentials/loads#charges-nodales).

## Lignes de cote

Clic droit sur la zone de dessin → **Ajouter une cote** trace une ligne de cote entre deux points. Les extrémités se calent sur les nœuds proches lors du glissement ; sélectionnez la ligne et utilisez **Modifier** pour saisir des coordonnées ou **Inverser la cote** pour placer l’étiquette de l’autre côté. Les cotes sont purement graphiques et sont enregistrées avec le projet.
