# Démarrage rapide

En une dizaine de minutes, vous allez modéliser une poutre en acier sur deux appuis soumise à une charge uniforme, lire les réactions, l’effort tranchant et le moment fléchissant, puis les confronter aux formules des manuels.

::: tip Suivez en parallèle
Ouvrez [run.edubeam.app](https://run.edubeam.app/?lang=fr){target="_blank"} dans un second onglet. Si un modèle est déjà chargé, utilisez **Effacer la structure** (icône corbeille dans la barre supérieure) et cochez *Supprimer les matériaux* et *Supprimer les sections* pour repartir de zéro.
:::

## Le problème

<ExampleStructure />

Une poutre de 6 m de portée sur deux appuis (articulation à gauche, appui simple à droite) porte une charge uniforme de 12 kN/m. Matériau : acier, $E = 210\ \text{GPa}$, $G = 81\ \text{GPa}$. Section IPE 200 : $A = 28{,}5\ \text{cm}^2$, $I_y = 1943\ \text{cm}^4$, $h = 200\ \text{mm}$.

## 1. Vérifiez les unités

Regardez la pastille des unités en bas à droite de la vue (par ex. `m · m² · kN · kNm · MPa`). Ce sont les unités de tous les champs de saisie et de tous les résultats. Par défaut : mètres, kN, kNm et MPa, ce que suppose ce tutoriel. Pour les changer, cliquez sur la pastille ou ouvrez **Paramètres → Langue et paramètres régionaux**.

## 2. Ajoutez le matériau et la section

Un élément a besoin d’un matériau et d’une section pour exister ; créez-les d’abord.

1. Ouvrez l’onglet **Matériaux** dans la barre inférieure et cliquez sur **Ajouter un matériau**.
2. Saisissez `E = 210000` MPa, `G = 81000` MPa, laissez la densité et `α = 0,000012` 1/K. Validez avec **Ajouter un matériau**.
   *(Ou cliquez sur **Bibliothèque de matériaux** et choisissez **Steel (S235)** : il a exactement ces valeurs.)*
3. Ouvrez l’onglet **Sections** et cliquez sur **Ajouter une section**.
4. Saisissez `Aire = 0,00285` m², `Iy = 1,943e-5` m⁴, `Hauteur = 0,2` m, `Coefficient de cisaillement = 1`. Validez avec **Ajouter une section**.

::: details À quoi sert le coefficient de cisaillement ?
EduBeam utilise des éléments poutre de Timoshenko, qui prennent en compte la déformation de cisaillement. `k` est le coefficient de correction de cisaillement ($k \approx 0{,}83$ pour un rectangle, $\approx 0{,}4$–$0{,}5$ pour l’âme d’un profilé en I lorsque $A$ est l’aire totale). Prendre `k = 1` avec l’aire totale *sous-estime* légèrement la souplesse au cisaillement ; pour une poutre élancée comme celle-ci, l’écart sur la flèche est très inférieur à 1 %. La formule figure dans la [page de théorie de la poutre](/fr/elements/beam).
:::

## 3. Ajoutez les nœuds

1. Ouvrez l’onglet **Nœuds** et cliquez sur **Ajouter un nœud**. Saisissez `X = 0`, `Z = 0` et validez. Le nœud reçoit le libellé `1`.
2. De nouveau **Ajouter un nœud** avec `X = 6`, `Z = 0`. C’est le nœud `2`.

Vous pouvez aussi placer les nœuds à la souris : choisissez **Ajouter à la souris** (ou clic droit sur la zone de dessin → *Ajouter un nœud* en maintenant <kbd>Ctrl</kbd>) et cliquez sur la grille. Avec **Magnétisme à la grille** activé (<kbd>S</kbd>), les clics tombent sur des pas de 0,1 m.

## 4. Reliez-les par un élément

1. Ouvrez l’onglet **Éléments** et cliquez sur **Ajouter un élément**.
2. Choisissez **Nœud initial** `1`, **Nœud final** `2`. Le matériau et la section créés sont présélectionnés. Validez.

Un trait noir apparaît entre les nœuds. Appuyez sur <kbd>F</kbd> pour l’ajuster à l’écran.

## 5. Ajoutez les appuis

Dans l’onglet **Nœuds**, la colonne **DDL bloqués** propose trois cases par nœud : `Dx`, `Dz`, `Ry`.

- Nœud `1` : cochez **Dx** et **Dz** → le symbole d’une articulation apparaît.
- Nœud `2` : cochez uniquement **Dz** → appui simple.

Les mêmes cases sont accessibles en cliquant sur un nœud dans la vue puis **Appuis du nœud**. Tous les types d’appuis sont décrits dans [Nœuds et appuis](/fr/essentials/nodes-supports).

## 6. Ajoutez la charge

1. Ouvrez l’onglet **Charges** et cliquez sur **Ajouter une charge d’élément**.
2. **Type de charge** : *Charge uniformément répartie*. **Élément** : `1`.
3. Saisissez `fz = 12` kN/m et laissez `fx = 0`. Validez.

Un `fz` positif est orienté selon +z, c’est-à-dire **vers le bas** à l’écran : une valeur positive correspond donc à une charge de type gravitaire. Voir les [conventions de signe](/fr/elements/conventions).

## 7. Lisez les résultats

La solution apparaît dès que la charge est ajoutée. Ouvrez le panneau d’affichage (bouton engrenage en haut à droite de la vue) pour activer ou désactiver les couches :

| Couche | Ce que vous devez voir |
| --- | --- |
| **Réactions** | Deux flèches vers le haut de **36 kN** aux nœuds 1 et 2. |
| **V<sub>z</sub> (x)** | Une droite de **+36 kN** à gauche à **−36 kN** à droite, s’annulant à mi-portée. |
| **M<sub>y</sub> (x)** | Une parabole d’extremum **54 kNm** à mi-portée. |
| **Déformée** | Une flèche symétrique. Survolez le nœud `1` pour lire sa rotation : environ **0,0265 rad**. |

L’onglet **Résultats** de la barre inférieure donne les nombres : **Résultats nodaux** liste `Dx`, `Dz`, `Ry` de chaque nœud ; **Résultats par élément** liste les efforts aux extrémités de chaque élément dans son repère local.

Si les diagrammes sont trop grands ou trop petits, déplacez le curseur **Échelle des résultats** dans **Paramètres → Paramètres d’affichage → Tailles**.

## 8. Vérifiez à la main

| Grandeur | Formule | À la main | EduBeam |
| --- | --- | --- | --- |
| Réaction | $R = qL/2$ | 36 kN | 36 kN |
| Effort tranchant max | $V = qL/2$ | 36 kN | 36 kN |
| Moment max | $M = qL^2/8$ | 54 kNm | 54 kNm |
| Rotation sur appui | $\varphi = qL^3/(24EI)$ | 0,02647 rad | 0,02647 rad |
| Flèche à mi-portée | $w = 5qL^4/(384EI)$ | 49,6 mm | 49,6 mm |

Tout concorde. D’autres vérifications (console, poutre bi-encastrée, treillis) sont dans [Vérifier les résultats à la main](/fr/guide/verification).

## 9. Expérimentez

C’est là qu’EduBeam prend toute sa valeur. Essayez chacune de ces manipulations et observez les diagrammes :

- **Faites glisser le nœud 2** vers la droite : le moment croît en $L^2$.
- **Cochez `Ry` au nœud 1** pour l’encastrer : le moment à mi-portée diminue et un moment négatif apparaît sur l’appui.
- **Ajoutez un troisième nœud** en `X = 3` en cliquant sur la poutre en mode *Ajouter à la souris* — choisissez **Connecter à la structure** pour scinder la poutre — puis cochez son `Dz` : vous obtenez une poutre continue à deux travées.
- **Cochez une rotule d’extrémité** sur un élément dans l’onglet Éléments pour libérer le moment à cette extrémité.
- <kbd>Ctrl</kbd>+<kbd>Z</kbd> annule n’importe quelle étape.

## 10. Enregistrez ou partagez

- **Partager le modèle** (barre supérieure) produit une URL qui contient tout le modèle : collez-la dans un courriel, un chat ou des diapositives.
- **Enregistrer le projet** (menu ☰ ou <kbd>Ctrl</kbd>+<kbd>S</kbd>) télécharge un `project.json` que vous rouvrirez avec **Ouvrir le projet** ou par glisser-déposer dans l’application.

Le modèle est également conservé dans le stockage local du navigateur : recharger la page ne le perd pas. Voir [Import, export et partage](/fr/essentials/import-export).

## Pour aller plus loin

- [Exemples](/fr/examples/) : portiques et treillis prêts en un clic.
- [Charges](/fr/essentials/loads) : charges trapézoïdales, ponctuelles, thermiques et déplacements imposés.
- [Clavier et souris](/fr/reference/shortcuts) : travaillez plus vite sur la zone de dessin.
