# Nœuds et appuis

Les nœuds sont les points du modèle. Les éléments relient les nœuds, et les appuis et les charges nodales s’appliquent aux nœuds.

## Coordonnées {#coordinates}

Chaque nœud a une coordonnée **X** et une coordonnée **Z** dans l’unité de longueur courante. L’axe x pointe vers la droite et l’**axe z vers le bas** à l’écran : un poteau qui s’élève depuis le sol va donc de `Z = 0` à `Z = −3`, et non `+3`. L’indicateur d’axes dans le coin de la grille montre l’orientation. Si vous préférez un axe vertical orienté vers le haut, passez aux [axes y vers le haut](/fr/elements/conventions#y-up-axes) dans les Paramètres.

## Ajouter des nœuds {#adding-nodes}

| Méthode | Comment |
| --- | --- |
| **Boîte de dialogue** | Onglet *Nœuds* → le premier bouton **Ajouter un nœud**, ou clic droit sur la zone de dessin → *Ajouter un nœud*. Saisissez X et Z, et éventuellement les appuis et l’angle d’appui. |
| **Souris** | Onglet *Nœuds* → le second bouton **Ajouter un nœud** (icône de curseur), ou maintenez <kbd>Ctrl</kbd> en choisissant *Ajouter un nœud* dans le menu contextuel. Chaque clic sur la zone de dessin ajoute un nœud. Appuyez sur <kbd>Échap</kbd> ou sur **Annuler** pour arrêter. |
| **En dessinant des éléments** | En mode souris pour les éléments, un clic sur une zone vide crée un nœud et le relie. |
| **Copier-coller** | Sélectionnez des nœuds (et des éléments), appuyez sur <kbd>Ctrl</kbd>+<kbd>C</kbd> puis <kbd>Ctrl</kbd>+<kbd>V</kbd>, puis cliquez là où la copie doit aller, ou saisissez un décalage Δx, Δz et cliquez sur **Coller**. |

<div class="shots">

![La boîte de dialogue Ajouter un nœud](/screenshots/fr/qs-node.webp)

![En mode souris, un bandeau en haut définit les appuis et l’angle de chaque nœud que vous placez](/screenshots/fr/nodes-add-banner.webp)

</div>

Les étiquettes sont attribuées automatiquement (`1`, `2`, … ou en prolongeant votre propre schéma, par ex. `A`, `B`) et peuvent être renommées dans le tableau.

### Magnétisme {#snapping}

Avec **Magnétisme à la grille** activé (<kbd>S</kbd> ou la pastille **S**), les nœuds que vous placez ou déplacez se positionnent sur des multiples du **Pas de magnétisme de la grille** : 0,1 m par défaut, ou 0,5 ft en unités US. Modifiez-le dans *Paramètres → Paramètres d’affichage → Grille*. Désactivez le magnétisme pour un placement libre, ou saisissez ensuite les coordonnées exactes dans le tableau.

### Placer un nœud sur un élément existant {#placing-a-node-on-an-existing-element}

Si vous cliquez près d’un élément en ajoutant un nœud, EduBeam vous demande ce que vous voulez faire :

- **Connecter à la structure** scinde l’élément en deux (`1a` et `1b`). Les rotules des extrémités extérieures sont conservées, et les charges uniformes et trapézoïdales sont réparties entre les deux moitiés ; les charges ponctuelles et thermiques vont à la première moitié. C’est le moyen le plus rapide d’ajouter un appui intermédiaire ou un point d’application de charge.
- **Placer un nœud isolé** crée le nœud par-dessus l’élément sans le relier.

## Modifier les nœuds {#editing-nodes}

- **Tableau :** modifiez l’étiquette, X et Z directement.
- **Glisser :** déplacez un nœud dans la vue, y compris sur un écran tactile : appuyez sur le nœud et faites-le glisser. Chaque déplacement peut être annulé.
- **Boîte de dialogue Modifier le nœud :** le crayon de la colonne *Actions* du tableau. Elle regroupe les coordonnées, les appuis et l’angle d’appui, avec un aperçu du symbole d’appui.
- **Supprimer :** le × du tableau, *Supprimer* dans le panneau du nœud, ou sélectionnez-le et appuyez sur <kbd>Suppr</kbd>. Supprimer un nœud supprime aussi les éléments et les charges qui y sont attachés.

## Appuis {#supports}

Un appui est un ensemble de degrés de liberté (DDL) bloqués. Chaque nœud en a trois :

| DDL | Signification |
| --- | --- |
| **Dx** | translation selon x (horizontale) |
| **Dz** | translation selon z (verticale) |
| **Ry** | rotation autour de y (dans le plan du dessin) |

Le plus rapide est de **choisir le symbole**. Il se trouve dans le panneau du nœud sous **Appuis du nœud**, dans les boîtes de dialogue Ajouter un nœud et Modifier le nœud, et sous forme d’un petit menu au début de la colonne *DDL bloqués* du tableau des nœuds. Cocher les cases `Dx`, `Dz`, `Ry` revient au même, un DDL à la fois.

![Appuis du nœud : choisissez un symbole ou cochez les DDL, et définissez l’angle d’appui](/screenshots/fr/nodes-support-picker.webp){.shot-lg}

| Appui | Bloqués | Mouvements libres | Réactions |
| --- | --- | --- | --- |
| **Libre** | aucun | tout | aucune |
| **Rotule** | Dx + Dz | rotation | R<sub>x</sub>, R<sub>z</sub> |
| **Appui simple** | Dz | glissement horizontal, rotation | R<sub>z</sub> |
| **Appui simple vertical** | Dx | glissement vertical, rotation | R<sub>x</sub> |
| **Encastrement** | Dx + Dz + Ry | aucun | R<sub>x</sub>, R<sub>z</sub>, M |
| **Glissière** | Dz + Ry | glissement horizontal | R<sub>z</sub>, M |
| **Glissière verticale** | Dx + Ry | glissement vertical | R<sub>x</sub>, M |
| **Rotation bloquée seule** | Ry | glissement dans les deux directions | M |

Une réaction est calculée, et dessinée, pour chaque DDL bloqué.

::: tip Nœuds de treillis
Les barres de treillis sont des éléments poutre dont les deux **rotules d’extrémité** sont libérées (voir [Éléments](/fr/essentials/elements#end-hinges)). Une articulation (Dx + Dz) est le choix habituel pour un appui de treillis. Un nœud où tous les éléments reliés sont articulés n’a aucune rigidité en rotation ; EduBeam l’accepte et indique une rotation nulle.
:::

### Appuis inclinés {#inclined-skewed-supports}

Définissez l’**Angle du SCL nodal** α en degrés (−180…180). Il se trouve dans le panneau du nœud sous *Appuis du nœud*, dans les boîtes de dialogue Ajouter un nœud et Modifier le nœud, et dans le champ α du tableau des nœuds. Les axes du nœud tournent de cet angle et les DDL d’appui agissent dans les directions tournées : un appui simple sur une pente à 30° est donc `Dz` avec α = 30. Le symbole tourne en conséquence et la réaction est donnée dans la direction tournée.

### Stabilité {#stability}

Le solveur a besoin d’au moins **trois DDL bloqués** au total, et les appuis et les rotules doivent tenir la structure. Tant qu’il n’y a pas assez d’appuis, la vue affiche une pastille bleue *Appuis manquants*. Si les appuis sont suffisants en nombre mais ne peuvent pas tenir la structure (tous parallèles, ou concourants en un point), ou si des rotules permettent à des barres de tourner les unes par rapport aux autres, un message rouge nomme le problème et un contour en pointillés montre comment la structure se déplace. Voir le [Dépannage](/fr/reference/troubleshooting).

## Charges nodales et tassements {#nodal-loads-and-settlements}

Les forces, les moments et les déplacements imposés (tassements d’appui) s’appliquent aux nœuds. Voir [Charges](/fr/essentials/loads#nodal-loads).

## Lignes de cote {#dimension-lines}

Clic droit sur la zone de dessin → **Ajouter une cote** pour tracer une ligne de cote entre deux points, ou clic droit sur un élément → **Coter l’élément** pour le coter directement. Les extrémités s’accrochent aux nœuds quand vous les faites glisser à proximité. Sélectionnez une ligne et utilisez **Modifier** pour saisir ses coordonnées, ou **Inverser la cote** pour placer l’étiquette de l’autre côté. Les lignes de cote sont purement graphiques ; elles sont enregistrées avec le projet et transmises dans les liens de partage.
