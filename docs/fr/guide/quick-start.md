# Démarrage rapide

En une dizaine de minutes, vous allez modéliser une poutre en acier sur deux appuis soumise à une charge uniforme, lire les réactions, l’effort tranchant et le moment fléchissant, puis les comparer aux formules des manuels.

::: tip Suivez en parallèle
Ouvrez [run.edubeam.app](https://run.edubeam.app/?lang=fr){target="_blank"} dans un second onglet. Si un modèle est déjà chargé, utilisez **Effacer la structure** dans la barre de l’application pour partir d’une structure vide, et cochez *Supprimer les matériaux* et *Supprimer les sections* pour repartir complètement de zéro. L’effacement s’annule avec <kbd>Ctrl</kbd>+<kbd>Z</kbd>, et l’ancien modèle reste disponible dans **☰ → Structures récentes**.

Vous préférez apprendre en pratiquant, avec des indications à l’écran ? **☰ → Dessiner votre première poutre** vous guide à la souris à travers une poutre similaire.
:::

## Le problème {#the-problem}

<ExampleStructure />

Une poutre de 6 m sur deux appuis (articulation à gauche, appui simple à droite) porte une charge uniforme de 12 kN/m. Matériau : acier, $E = 210\ \text{GPa}$, $G = 81\ \text{GPa}$. Section : IPE 200, $A = 28{,}5\ \text{cm}^2$, $I_y = 1943\ \text{cm}^4$, $h = 200\ \text{mm}$.

## 1. Vérifiez les unités {#_1-check-the-units}

La pastille des unités, en bas à droite de la vue, indique les unités utilisées par tous les champs de saisie et tous les résultats. Ce tutoriel suppose les valeurs SI par défaut : mètres, kN, kNm et MPa.

![Les boutons de grille (G), de magnétisme (S) et de réticule, et la pastille des unités](/screenshots/fr/ui-grid-units.webp){.shot-sm}

Si vous voyez `ft · kip · kip·ft · ksi`, cliquez sur la pastille et choisissez **Système d’unités → SI (métrique)**.

## 2. Ajoutez le matériau et la section {#_2-add-the-material-and-cross-section}

Les éléments ont besoin d’un matériau et d’une section : créez-les d’abord.

1. Ouvrez l’onglet **Matériaux** dans la barre inférieure et cliquez sur **Ajouter un matériau**.
2. Saisissez `E = 210000` MPa et `G = 81000` MPa. Laissez la masse volumique et `α = 0,000012` 1/K. Cliquez sur **Ajouter un matériau**.

<div class="shots">

![Ajouter un matériau : saisissez E et G…](/screenshots/fr/qs-material.webp)

![… ou choisissez Steel (S235) dans la Bibliothèque de matériaux](/screenshots/fr/qs-material-library.webp)

</div>

3. Ouvrez l’onglet **Sections** et cliquez sur **Ajouter une section**.
4. Saisissez `Aire = 0,00285` m², `Iy = 1,943e-5` m⁴, `Hauteur = 0,2` m et `Coefficient de cisaillement = 1`. Cliquez sur **Ajouter une section**.

![Ajouter une section. Vous pouvez aussi la choisir dans la bibliothèque ou dessiner une forme polygonale.](/screenshots/fr/qs-cross-section.webp){.shot-md}

::: details Pourquoi le coefficient de cisaillement compte-t-il ?
EduBeam utilise des éléments poutre de Timoshenko, qui prennent en compte la déformation d’effort tranchant. `k` est le coefficient de correction de cisaillement : $k \approx 0{,}83$ pour un rectangle, et environ $0{,}4$–$0{,}5$ pour un profilé en I lorsque $A$ est l’aire totale. Prendre `k = 1` avec l’aire totale *sous-estime* légèrement la souplesse au cisaillement. Pour une poutre élancée comme celle-ci, l’écart sur la flèche reste bien inférieur à 1 %. La formule figure dans la [page de théorie de la poutre](/fr/elements/beam).
:::

## 3. Ajoutez les nœuds {#_3-add-the-nodes}

1. Ouvrez l’onglet **Nœuds**. Il comporte deux boutons **Ajouter un nœud** : le premier ouvre une boîte de dialogue, le second (avec une icône de curseur) place les nœuds à la souris. Cliquez sur le premier.
2. Saisissez `X = 0`, `Z = 0` et cliquez sur **Ajouter un nœud**. Le nœud reçoit le numéro `1`.
3. Ajoutez un second nœud en `X = 6`, `Z = 0`. C’est le nœud `2`.

![La boîte de dialogue Ajouter un nœud permet aussi de définir directement les appuis](/screenshots/fr/qs-node.webp){.shot-md}

Avec le bouton souris, chaque clic sur la zone de dessin place un nœud. Avec **Magnétisme à la grille** activé (<kbd>S</kbd>), les clics tombent sur le pas de la grille (0,1 m par défaut).

## 4. Reliez-les par un élément {#_4-connect-them-with-an-element}

1. Ouvrez l’onglet **Éléments** et cliquez sur le premier bouton **Ajouter un élément**.
2. Choisissez **Nœud initial** `1` et **Nœud final** `2`. Votre matériau et votre section sont déjà sélectionnés. Cliquez sur **Ajouter un élément**.

![Ajouter un élément : les deux nœuds d’extrémité, les rotules d’extrémité facultatives, le matériau et la section](/screenshots/fr/qs-element.webp){.shot-md}

Une ligne apparaît entre les nœuds. Appuyez sur <kbd>F</kbd> pour l’ajuster à l’écran.

## 5. Ajoutez les appuis {#_5-add-the-supports}

Dans l’onglet **Nœuds**, la colonne **DDL bloqués** propose pour chaque nœud un sélecteur de symbole d’appui et trois cases à cocher : `Dx`, `Dz`, `Ry`.

- Nœud `1` : choisissez le symbole **Rotule**, ou cochez **Dx** et **Dz**.
- Nœud `2` : choisissez **Appui simple**, ou cochez uniquement **Dz**.

![Appuis dans le tableau des nœuds : nœud 1 articulé, nœud 2 sur appui simple](/screenshots/fr/qs-supports.webp)

Vous pouvez aussi cliquer sur un nœud dans la vue et choisir **Appuis du nœud**. [Nœuds et appuis](/fr/essentials/nodes-supports#supports) présente tous les types d’appuis.

## 6. Ajoutez la charge {#_6-add-the-load}

1. Ouvrez l’onglet **Charges** et cliquez sur **Ajouter une charge d’élément**.
2. **Type de charge** : *Charge uniformément répartie*. **Élément** : `1`.
3. Saisissez `fz = 12` kN/m et laissez `fx = 0`. Cliquez sur **Ajouter une charge d’élément**.

![La boîte de dialogue montre un aperçu de la charge sur l’élément](/screenshots/fr/qs-load.webp){.shot-md}

Un `fz` positif est orienté selon +z, c’est-à-dire **vers le bas** à l’écran : une valeur positive correspond donc à une charge gravitaire. Voir les [conventions de signe](/fr/elements/conventions).

## 7. Lisez les résultats {#_7-read-the-results}

La solution apparaît dès que la charge est ajoutée. Le panneau d’affichage, en haut à droite de la vue, active ou désactive les diagrammes. **Déformée**, **M<sub>y</sub>(x)** et **Réactions** sont activés par défaut. Cochez **V<sub>z</sub>(x)** pour ajouter l’effort tranchant.

![Effort tranchant (vert), moment fléchissant (rouge), réactions (violet) et déformée](/screenshots/fr/qs-results.webp)

| Couche | Ce que vous devez voir |
| --- | --- |
| **Réactions** | Deux flèches vers le haut de **36 kN** aux nœuds 1 et 2. |
| **V<sub>z</sub>(x)** | Une droite allant de **+36 kN** à gauche à **−36 kN** à droite, qui s’annule à mi-portée. |
| **M<sub>y</sub>(x)** | Une parabole dont l’extremum vaut **54 kNm** à mi-portée. |
| **Déformée** | Une flèche symétrique. Pointez le nœud `1` pour lire sa rotation : **2,6469 · 10⁻² rad**. |

L’onglet **Résultats** de la barre inférieure donne les valeurs. **Résultats nodaux** liste `Dx`, `Dz`, `Ry` pour chaque nœud. **Résultats par élément** liste les efforts aux extrémités de chaque élément dans son repère local.

Si les diagrammes paraissent trop grands ou trop petits, modifiez **Échelle des résultats** dans **Paramètres → Paramètres d’affichage → Tailles**.

## 8. Vérifiez à la main {#_8-check-by-hand}

| Grandeur | Formule | À la main | EduBeam |
| --- | --- | --- | --- |
| Réaction | $R = qL/2$ | 36 kN | 36 kN |
| Effort tranchant max | $V = qL/2$ | 36 kN | 36 kN |
| Moment max | $M = qL^2/8$ | 54 kNm | 54 kNm |
| Rotation sur appui | $\varphi = qL^3/(24EI)$ | 0,02647 rad | 0,02647 rad |
| Flèche à mi-portée (flexion) | $w = 5qL^4/(384EI)$ | 49,63 mm | |
| Flèche à mi-portée (cisaillement) | $w_s = qL^2/(8kGA)$ | 0,23 mm | |
| Flèche à mi-portée (totale) | somme | 49,86 mm | 49,86 mm |

Il n’y a pas de nœud à mi-portée : pour y lire la flèche, ajoutez-en un. Choisissez le second bouton **Ajouter un nœud**, cliquez sur la poutre en `X = 3` et choisissez **Connecter à la structure**. La poutre est scindée en deux et le `Dz` du nouveau nœud dans **Résultats** vaut 49,86 mm. La scission ne change aucun résultat, car l’élément est exact.

Tout concorde. D’autres recettes de vérification à la main (console, poutre bi-encastrée, treillis, température) se trouvent dans [Vérifier les résultats à la main](/fr/guide/verification).

## 9. Expérimentez {#_9-experiment}

C’est là qu’EduBeam prend toute sa valeur. Essayez chacune de ces manipulations et observez les diagrammes se mettre à jour :

- **Faites glisser le nœud 2** vers la droite : le moment croît en $L^2$.
- **Cochez `Ry` au nœud 1** pour l’encastrer : le moment à mi-portée diminue et un moment négatif apparaît sur l’appui.
- **Cochez `Dz` au nœud de mi-portée** que vous venez d’ajouter pour obtenir une poutre continue à deux travées.
- **Cochez une rotule d’extrémité** sur un élément de l’onglet Éléments pour libérer le moment à cette extrémité.
- Appuyez sur <kbd>Ctrl</kbd>+<kbd>Z</kbd> pour annuler n’importe quelle étape.

## 10. Enregistrez ou partagez {#_10-save-or-share}

- **Partager le modèle** (dans la barre de l’application ou le menu ☰) vous donne un lien qui contient tout le modèle. Collez-le dans un courriel, une messagerie ou vos diapositives.
- **☰ → Enregistrer le projet** (<kbd>Ctrl</kbd>+<kbd>S</kbd>) télécharge un `project.json` que vous pourrez rouvrir plus tard avec **Ouvrir le projet** ou en le déposant sur l’application.
- **☰ → Exporter une image** (<kbd>Ctrl</kbd>+<kbd>P</kbd>) enregistre le dessin en PNG ou SVG pour un rapport.

Votre modèle est aussi conservé dans le navigateur : recharger la page ne le fait pas disparaître. Voir [Import, export et partage](/fr/essentials/import-export).

## Pour aller plus loin {#where-next}

- [Tutoriel du portique à trois articulations](/fr/tutorials/three-hinged-frame) : un portique avec une rotule intérieure, vérifié à la main.
- [Exemples](/fr/examples/) : ouvrez des portiques et des treillis prêts à l’emploi en un clic.
- [Charges](/fr/essentials/loads) : charges trapézoïdales, ponctuelles et thermiques, déplacements imposés.
- [Clavier, souris et tactile](/fr/reference/shortcuts) : travaillez plus vite sur la zone de dessin.
