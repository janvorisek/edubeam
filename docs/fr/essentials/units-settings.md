# Unités et paramètres

Ouvrez les paramètres via le **bouton ⚙ de la vue → Plus de paramètres**, en cliquant sur la **pastille des unités** en bas à droite de la vue, ou depuis l’onglet **Paramètres** au-dessus de la vue. Les paramètres sont stockés dans le navigateur et survivent aux rechargements ; **Réinitialiser les paramètres** rétablit les valeurs par défaut de l’affichage (langue et unités sont conservées).

## Langue et paramètres régionaux

**Langue** : 11 langues d’interface. Vous pouvez aussi ouvrir l’application avec `?lang=<code>` (`en`, `cs`, `de`, `fr`, `es`, `pt`, `pl`, `cn`, `th`, `uk`, `ru`).

**Unités** : chaque grandeur a sa propre unité. Saisies, tableaux, infobulles et étiquettes des diagrammes utilisent l’unité choisie, et changer d’unité convertit ce qui est affiché (le modèle est stocké en SI en interne, un aller-retour ne perd donc rien).

| Grandeur | Choix | Par défaut |
| --- | --- | --- |
| Longueur | m, cm, mm, in, ft | m |
| Aire | m², cm², mm², in², ft² | m² |
| Moment quadratique | m⁴, cm⁴, mm⁴, in⁴, ft⁴ | m⁴ |
| Masse | kg, lb | kg |
| Force | N, kN, MN, lbf, tonf, kgf | kN |
| Moment fléchissant | Nmm, Nm, kNm, MNm, tonf·m, lbf·in, lbf·ft | kNm |
| Contrainte (E, G) | Pa, kPa, MPa, GPa, psi, ksc | MPa |

Les charges réparties sont en *force / longueur* dans les unités choisies (kN/m par défaut). Les angles sont toujours en radians, les températures toujours en °C/K.

::: tip Unités impériales
Choisissez ft (ou in), in², in⁴, lbf et psi selon les besoins : il n’y a pas d’interrupteur « impérial » unique, chaque grandeur se règle séparément.
:::

## Paramètres d’affichage

Un **Aperçu** en haut montre un petit modèle qui réagit à chaque changement.

**Grille**
- **Afficher la grille** (<kbd>G</kbd>) : dessine la grille et les règles.
- **Magnétisme à la grille** (<kbd>S</kbd>) : les nœuds placés ou déplacés à la souris se calent sur le pas.
- **Pas de magnétisme de la grille** : espacement en mètres (0,1 par défaut).

**Étiquettes de résultats**
- **Orientation des étiquettes de résultats** : *Perpendiculaires au diagramme* (les étiquettes suivent le diagramme) ou *Toujours horizontales*.

**Tailles**
- **Échelle des résultats** (0–120 px) : hauteur à l’écran de la plus grande ordonnée des diagrammes / de la plus grande flèche. Les diagrammes sont normalisés par leur propre maximum, c’est donc un réglage purement visuel ; modifiez-le quand les tracés sont trop grands ou trop petits pour le modèle.
- **Taille des appuis** (0,5–1,5) et **Taille de police** (10–20 px).

**Couleurs** : couleurs individuelles pour nœuds, éléments, charges, déformée, effort normal, effort tranchant, moment fléchissant et réactions. Par défaut : N bleu, V vert, M rouge, réactions violet, charges orange.

## Commandes et raccourcis

**Déplacer la vue avec** : quel bouton de souris déplace la zone de dessin : *milieu ou droit* (par défaut), *Molette de la souris* (bouton du milieu seul) ou *Bouton droit* seul. La liste complète des raccourcis est sur la page [Clavier et souris](/fr/reference/shortcuts).

## Ce qui est enregistré automatiquement

Outre les paramètres, EduBeam conserve le **modèle courant** dans le stockage local du navigateur après chaque modification. Recharger l’onglet ou rouvrir l’application le restaure. Cela vaut par navigateur et par appareil ; pour transporter un modèle ailleurs, utilisez [Enregistrer le projet ou Partager le modèle](/fr/essentials/import-export).
