# Interface utilisateur

<Edubeam /> comporte trois zones : la **barre de l’application** en haut, la **vue** au milieu, où vous dessinez, et la **barre inférieure**, avec un tableau pour chaque type d’objet. Une fois que vous savez ce qui se trouve où, le reste du guide coule de source.

![Les parties de l’interface, numérotées comme dans la liste ci-dessous](/screenshots/fr/ui-overview.webp)

1. **Menu ☰** : ouvrir, enregistrer, partager et exporter ; exemples et visites guidées.
2. **Boutons de la barre de l’application** : Effacer la structure et Partager le modèle.
3. **Annuler / Rétablir** pour chaque modification du modèle.
4. **Boutons de la vue** : centrer, ajuster à l’écran, et le bouton qui affiche les options d’affichage.
5. **Options d’affichage** : quels résultats et quelles parties du modèle sont dessinés.
6. **Grille, magnétisme, réticule et unités.**
7. **Onglets de la barre inférieure** : Nœuds, Éléments, Charges, Matériaux, Sections, Résultats.
8. **Le tableau** de l’onglet ouvert, où chaque valeur peut être modifiée.

::: tip Faites le tour
**☰ → Faire le tour** vous présente ces parties directement dans l’application, une à une.
:::

![Faire le tour, à l’étape des options d’affichage](/screenshots/fr/tour.webp)

## Barre de l’application {#app-bar}

| Commande | Rôle |
| --- | --- |
| **Menu ☰** | Le menu principal, voir ci-dessous. |
| **Effacer la structure** | Supprime tous les nœuds, éléments et charges après confirmation. Deux cases permettent de supprimer aussi les matériaux et les sections. <kbd>Ctrl</kbd>+<kbd>Z</kbd> fait revenir le modèle, qui est aussi conservé dans les Structures récentes. |
| **Partager le modèle** | Ouvre la [boîte de dialogue de partage](/fr/essentials/import-export#share-a-link) avec un lien qui contient tout le modèle. |
| **Quoi de neuf ?** | Notes de version. Elles s’ouvrent aussi d’elles-mêmes une fois après une mise à jour. |
| **Documentation** / GitHub | Ce guide et le code source. |

Sur un téléphone, seuls le menu ☰ et Documentation tiennent dans la barre ; tout le reste se trouve dans le menu.

### Le menu ☰ {#the-☰-menu}

![Le menu ☰](/screenshots/fr/ui-app-menu.webp){.shot-xs}

| Élément | Rôle |
| --- | --- |
| **Ouvrir le projet** / **Enregistrer le projet** | Ouvrir ou télécharger un fichier `project.json` (<kbd>Ctrl</kbd>+<kbd>O</kbd> / <kbd>Ctrl</kbd>+<kbd>S</kbd>). |
| **Structures récentes** | Les 10 derniers modèles que vous avez effacés ou remplacés, prêts à être restaurés. |
| **Exporter une image** | Enregistrer le dessin en PNG ou SVG, ou le copier (<kbd>Ctrl</kbd>+<kbd>P</kbd>). |
| **Partager le modèle** | Identique au bouton de la barre de l’application. |
| **Exemples** | La galerie de modèles prêts à l’emploi. |
| **Dessiner votre première poutre** | Une tâche guidée en sept étapes. |
| **Faire le tour** | La visite de l’interface. |
| **Effacer la structure** | Identique au bouton de la barre de l’application. |

Le bas du menu indique la version de l’application et sa date de publication.

## Vue {#viewer}

La zone de dessin est l’endroit où vous dessinez et inspectez le modèle. Tout le reste de l’application suit ce que vous y sélectionnez.

### Boutons sur la zone de dessin {#buttons-on-the-canvas}

- **En haut à gauche :** **Annuler** et **Rétablir** (<kbd>Ctrl</kbd>+<kbd>Z</kbd> / <kbd>Ctrl</kbd>+<kbd>Maj</kbd>+<kbd>Z</kbd>). Toute modification du modèle, y compris l’ajout, la modification, le déplacement, la suppression et l’effacement, peut être annulée.
- **En haut à droite :** **Centrer le contenu** (<kbd>C</kbd>), **Ajuster à l’écran** (<kbd>F</kbd>) et le bouton ⚙ qui affiche ou masque les options d’affichage. Sur les écrans tactiles, il y a aussi **Sélection par rectangle**.
- **En bas à droite :** **G** active ou désactive la grille, **S** le magnétisme à la grille, le bouton du réticule affiche la position du pointeur sur les règles, et la **pastille des unités** ouvre les paramètres sur *Langue et paramètres régionaux*.

### Options d’affichage {#display-options}

![Les boutons de la vue et les options d’affichage](/screenshots/fr/ui-display-settings.webp){.shot-lg}

Deux rangées de cases à cocher, ouvertes par défaut :

- **Résultats :** *Déformée*, *N (x)*, *V<sub>z</sub> (x)*, *M<sub>y</sub> (x)*, *Réactions*. Déformée, M et Réactions sont cochés au départ.
- **Modèle :** *Appuis*, *Charges*, *Étiquettes des nœuds*, *Étiquettes des éléments*.

**Plus de paramètres** ouvre l’ensemble des [paramètres](/fr/essentials/units-settings) sur *Paramètres d’affichage*.

### Navigation {#navigating}

| Action | Souris | Tactile |
| --- | --- | --- |
| Zoom | Molette (vers le curseur), <kbd>Ctrl</kbd>+<kbd>=</kbd> / <kbd>Ctrl</kbd>+<kbd>-</kbd> | Pincement |
| Panoramique | Glisser avec le bouton **central ou droit** (voir *Paramètres → Commandes et raccourcis*) | Glisser avec un doigt |
| Ajuster / centrer | <kbd>F</kbd> / <kbd>C</kbd> ou les boutons en haut à droite | Les boutons en haut à droite |

### Sélection et modification {#selecting-and-editing}

**Cliquez** sur un nœud, un élément, une charge ou une ligne de cote pour le sélectionner. Un panneau s’ouvre à côté, avec ses détails et les actions qui s’y appliquent : ajouter une charge, définir les appuis, modifier, afficher la matrice de rigidité, supprimer. Cliquer sur un nœud fait aussi passer la barre inférieure sur l’onglet Nœuds.

<div class="shots">

![Un nœud : ajouter une charge, définir les appuis, imposer un déplacement](/screenshots/fr/ui-node-menu.webp)

![Un élément : modifier, ajouter une charge, matrice de rigidité](/screenshots/fr/ui-element-menu.webp)

</div>

- **Faites glisser sur une zone vide** pour tracer un rectangle de sélection. Tout ce qui s’y trouve est sélectionné : nœuds, éléments, leurs charges et les lignes de cote. Appuyez sur <kbd>Suppr</kbd> pour tout supprimer, ou sur <kbd>Ctrl</kbd>+<kbd>C</kbd> / <kbd>Ctrl</kbd>+<kbd>V</kbd> pour le copier ailleurs.
- **Faites glisser un nœud** pour le déplacer. Avec le magnétisme activé, il se place sur la grille. Les éléments reliés et leurs charges suivent.
- **Double-cliquez sur une charge** pour la modifier.
- **Pointez** n’importe quel objet pour afficher une infobulle. Les nœuds montrent leurs déplacements et leur rotation, les éléments leur matériau et leur section, les charges leurs valeurs. Sur un écran tactile, touchez plutôt l’objet : les mêmes détails apparaissent dans le panneau de sélection.

![Pointer un nœud affiche ses déplacements et sa rotation](/screenshots/fr/ui-hover.webp){.shot-sm}

**Faites un clic droit sur la zone de dessin** (ou un appui long sur un écran tactile) pour ouvrir le menu contextuel. Maintenez <kbd>Ctrl</kbd> en choisissant *Ajouter un nœud* ou *Ajouter un élément* pour les placer à la souris au lieu de passer par une boîte de dialogue. Au-dessus d’un élément, le menu propose aussi *Coter l’élément*.

![Le menu contextuel de la zone de dessin](/screenshots/fr/ui-canvas-menu.webp){.shot-sm}

Tous les raccourcis se trouvent sur la page [Clavier, souris et tactile](/fr/reference/shortcuts).

### Quand le modèle ne peut pas être calculé {#when-the-model-cannot-be-solved}

Des messages apparaissent en haut à gauche de la vue :

- *Aucun matériau défini.* / *Aucune section définie.*, avec un bouton **Ajouter**.
- Une petite pastille bleue **Appuis manquants** tant que le modèle est simplement inachevé.
- Un **message rouge** quand quelque chose ne va pas, avec **Afficher les détails**, qui liste tous les problèmes.

Quand la structure peut encore bouger, EduBeam la fait osciller sous forme de contour en pointillés et entoure les nœuds ou les rotules en cause. Pointez le message pour revoir le mouvement, ou utilisez son bouton en forme d’œil pour le masquer.

![Un portique avec des rotules en B et C est un mécanisme : EduBeam montre comment il se déplace](/screenshots/fr/ui-mechanism.webp)

![Afficher les détails liste chaque problème avec une indication](/screenshots/fr/ui-diagnostics.webp){.shot-lg}

Le [Dépannage](/fr/reference/troubleshooting) explique chaque message.

## Barre inférieure {#bottom-bar}

Six onglets, chacun avec une barre d’outils et un tableau modifiable. Les onglets indiquent combien d’objets de chaque type contient le modèle. Le **?** à droite explique l’onglet ouvert, tout comme le **?** à côté de certains en-têtes de colonnes. Faites glisser la bande des onglets vers le haut ou le bas pour redimensionner la barre, ou réduisez-la avec le bouton de droite.

| Onglet | Barre d’outils | Tableau |
| --- | --- | --- |
| **Nœuds** | Ajouter un nœud (boîte de dialogue), Ajouter un nœud (souris) | Étiquette, coordonnées, **DDL bloqués** (symbole d’appui, Dx, Dz, Ry, angle d’appui α), charges, modifier, supprimer |
| **Éléments** | Ajouter un élément (boîte de dialogue), Ajouter un élément (souris) | Étiquette, type, nœuds (avec un bouton d’inversion), matériau, section, **Rotules d’extrémité**, charges, matrice de rigidité, supprimer |
| **Charges** | Ajouter une charge nodale, Ajouter une charge d’élément | Type, cible, composantes modifiables, modifier, supprimer |
| **Matériaux** | Ajouter un matériau, Bibliothèque de matériaux | Étiquette, E, G, α<sub>T</sub>, supprimer |
| **Sections** | Ajouter une section, Bibliothèque de sections, Section polygonale | Forme, étiquette, A, I<sub>y</sub>, h, k, modifier la forme, supprimer |
| **Résultats** | Résultats nodaux, Résultats par élément, Exporter en CSV, Copier | Déplacements et rotations par nœud, ou efforts aux extrémités par élément |

Modifiez une cellule sur place : cliquez, saisissez, puis appuyez sur <kbd>Entrée</kbd> (ou sur <kbd>Échap</kbd> pour quitter la cellule). Les valeurs sont affichées et saisies dans les [unités courantes](/fr/essentials/units-settings).

## Onglets au-dessus de la vue {#tabs-above-the-viewer}

**Structure** affiche la zone de dessin. **Paramètres** affiche les paramètres en pleine taille : vous pouvez changer des couleurs ou des unités puis revenir voir l’effet. La pastille des unités et *Plus de paramètres* ouvrent les mêmes paramètres dans une boîte de dialogue par-dessus le modèle.

## Fenêtres flottantes {#floating-windows}

**Matrice de rigidité** (depuis le panneau d’un élément ou le tableau des éléments) ouvre une fenêtre avec la matrice de rigidité 6 × 6 de l’élément en coordonnées globales. **Modifier**, dans le menu contextuel de la zone de dessin, ouvre un tableau de la sélection courante. Déplacez-les par leur barre de titre et fermez-les avec le ×.
