# Interface utilisateur

<Edubeam /> comporte trois zones. Une fois que vous savez ce que contient chacune, le reste de la documentation coule de source.

```
┌──────────────────────────────────────────────────────────────┐
│ ☰  edubeam   🗑 Effacer la structure  🔗 Partager  Quoi de neuf│  ← Barre supérieure
├──────────────────────────────────────────────────────────────┤
│ Structure | Paramètres                                       │  ← Onglets
│ ↶ ↷                                        ⌖  ⤢  ⚙            │
│                                                              │
│                  zone de dessin (le modèle)     [couches de  │  ← Vue
│                                                  résultats]  │
│                                       G  S  m·kN·kNm·MPa     │
├──────────────────────────────────────────────────────────────┤
│ Nœuds | Éléments | Charges | Matériaux | Sections | Résultats │  ← Barre inférieure
│ [Ajouter un nœud] [Ajouter à la souris]  tableau des entités…│
└──────────────────────────────────────────────────────────────┘
```

## Barre supérieure

| Commande | Rôle |
| --- | --- |
| **Menu ☰** | **Ouvrir le projet**, **Enregistrer le projet**, **Partager le modèle**, **Effacer la structure** et la version de l’application. |
| **Effacer la structure** 🗑 | Supprime tous les nœuds, éléments et charges après confirmation. Deux cases permettent de supprimer aussi les matériaux et les sections. Irréversible. |
| **Partager le modèle** 🔗 | Ouvre la [boîte de partage](/fr/essentials/import-export#partager-un-lien) avec une URL qui encode tout le modèle. |
| **Quoi de neuf ?** | Notes de version. |
| **Documentation** / GitHub | Liens vers ce site et vers le code source. |

En [mode visionneuse](/fr/essentials/import-export#integrer-une-visionneuse-en-lecture-seule), la barre supérieure est masquée.

## Vue

La zone de dessin où vous construisez et inspectez le modèle. Tout le reste de l’application réagit à ce que vous y sélectionnez.

### Boutons sur la zone de dessin

- **En haut à gauche :** **Annuler** / **Rétablir** (aussi <kbd>Ctrl</kbd>+<kbd>Z</kbd> / <kbd>Ctrl</kbd>+<kbd>Maj</kbd>+<kbd>Z</kbd>). Toute modification du modèle — ajout, édition, glissement, suppression — est annulable.
- **En haut à droite :** **Centrer** (<kbd>C</kbd>), **Ajuster à l’écran** (<kbd>F</kbd>) et le bouton des **paramètres d’affichage** ⚙.
- **En bas à droite :** **G** bascule la grille, **S** le magnétisme à la grille ; la **pastille des unités** affiche les unités actives et ouvre les paramètres au clic.

### Panneau d’affichage

S’ouvre avec le bouton ⚙. Deux rangées de cases :

- **Résultats :** *Déformée*, *N (x)*, *V<sub>z</sub> (x)*, *M<sub>y</sub> (x)*, *Réactions*.
- **Modèle :** *Appuis*, *Charges*, *Étiquettes des nœuds*, *Étiquettes des éléments*.

**Plus de paramètres** ouvre la [boîte de paramètres](/fr/essentials/units-settings) complète.

### Navigation

| Action | Souris / tactile |
| --- | --- |
| Zoom | Molette (vers le curseur), <kbd>Ctrl</kbd>+<kbd>=</kbd> / <kbd>Ctrl</kbd>+<kbd>-</kbd> ; pincement sur écran tactile |
| Déplacer la vue | Glisser avec le bouton **du milieu ou droit** (réglable dans *Paramètres → Commandes et raccourcis*) ; glisser à un doigt sur écran tactile |
| Ajuster / centrer | <kbd>F</kbd> / <kbd>C</kbd> ou les boutons en haut à droite |

### Sélectionner et modifier

- **Cliquez** sur un nœud, un élément, une charge ou une ligne de cote pour le sélectionner. La barre inférieure bascule sur l’onglet correspondant et un petit **menu contextuel** apparaît près de la sélection avec les actions disponibles (par ex. *Ajouter une charge*, *Appuis du nœud*, *Modifier l’élément*, *Matrice de rigidité*, *Supprimer*).
- **Glissez sur une zone vide** pour tracer un rectangle de sélection. Tout ce qui s’y trouve — nœuds, éléments, leurs charges et les cotes — est sélectionné. <kbd>Suppr</kbd> supprime le tout ; <kbd>Ctrl</kbd>+<kbd>C</kbd> / <kbd>Ctrl</kbd>+<kbd>V</kbd> copie et colle ailleurs.
- **Glissez un nœud** pour le déplacer. Avec le magnétisme, il se cale sur la grille. Les éléments connectés et leurs charges suivent.
- **Double-cliquez sur une charge** pour la modifier.
- **Survolez** n’importe quoi pour une infobulle : les nœuds affichent leurs déplacements et rotation, les éléments leur matériau et section, les charges leurs composantes.
- **Clic droit sur une zone vide** ouvre le menu de la zone de dessin : *Ajouter un nœud*, *Ajouter un élément*, *Ajouter une cote*, *Modifier* (ouvre un tableau de la sélection courante), *Copier*, *Coller*, *Supprimer*. Maintenez <kbd>Ctrl</kbd> en choisissant *Ajouter un nœud* / *Ajouter un élément* pour les placer à la souris plutôt que par boîte de dialogue.

Tous les raccourcis sont listés sur la page [Clavier et souris](/fr/reference/shortcuts).

### Alertes

Des messages apparaissent en haut à gauche de la vue quand quelque chose cloche : *Aucun matériau défini.* / *Aucune section définie.* (avec un bouton **Ajouter**) ou *Model has N error(s)*, avec un bouton **Show details** qui liste chaque problème. Voir [Dépannage](/fr/reference/troubleshooting).

## Barre inférieure

Six onglets, chacun avec un compteur, une barre d’outils et un tableau modifiable. Glissez le séparateur au-dessus de la barre pour la redimensionner, ou réduisez-la avec le bouton à droite.

| Onglet | Barre d’outils | Tableau |
| --- | --- | --- |
| **Nœuds** | Ajouter un nœud (boîte de dialogue), Ajouter à la souris | Libellé, X, Z, cases **DDL bloqués**, charges sur le nœud, supprimer |
| **Éléments** | Ajouter un élément (boîte de dialogue), Ajouter à la souris | Libellé, type, nœud initial/final (+ *Inverser les nœuds*), matériau, section, **Rotules d’extrémité**, charges sur l’élément, matrice de rigidité, supprimer |
| **Charges** | Ajouter une charge nodale, Ajouter une charge d’élément | Type, point d’application, composantes modifiables, supprimer |
| **Matériaux** | Ajouter un matériau, Bibliothèque de matériaux | Libellé, E, G, α<sub>T</sub>, supprimer |
| **Sections** | Ajouter une section, Bibliothèque de sections | Libellé, A, I<sub>y</sub>, h, k, supprimer |
| **Résultats** | Bascule Résultats nodaux / Résultats par élément | Déplacements et rotations par nœud, ou efforts aux extrémités par élément |

Les cellules se modifient sur place : cliquez, tapez, validez avec <kbd>Entrée</kbd> (ou <kbd>Échap</kbd> pour quitter la cellule). Les valeurs sont affichées et saisies dans les [unités courantes](/fr/essentials/units-settings).

## Onglets au-dessus de la vue

L’onglet **Structure** est toujours présent. Ouvrir les paramètres ajoute à côté un onglet **Paramètres** que l’on peut fermer, pour régler couleurs ou unités sans quitter le modèle des yeux.

## Fenêtres flottantes

Certaines actions ouvrent des fenêtres déplaçables au-dessus de la vue : **Matrice de rigidité** (depuis le menu contextuel d’un élément ou sa ligne du tableau) affiche la matrice de rigidité 6 × 6 de l’élément en repère local et global ; **Modifier** dans le menu de la zone de dessin ouvre un tableau de la sélection courante. Fermez-les avec la ×.
