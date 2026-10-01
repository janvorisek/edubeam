# Unités et paramètres

Ouvrez les paramètres via le **bouton ⚙ de la vue → Plus de paramètres**, en cliquant sur la **pastille des unités** en bas à droite de la vue, ou depuis l’onglet **Paramètres** au-dessus de la vue. Les paramètres sont stockés dans le navigateur et survivent aux rechargements ; **Réinitialiser les paramètres** rétablit les valeurs par défaut de l’affichage et les unités de votre région (la langue est conservée).

## Langue et paramètres régionaux

**Langue** : 11 langues d’interface. Vous pouvez aussi ouvrir l’application avec `?lang=<code>` (`en`, `cs`, `de`, `fr`, `es`, `pt`, `pl`, `cn`, `th`, `uk`, `ru`).

**Système d’unités** : *SI (métrique)* ou *Américain (impérial)* règle toutes les unités ci-dessous en une seule fois. Si vous changez ensuite une seule unité, le système s’affiche comme *Personnalisé*. À la première visite, EduBeam démarre en unités américaines si le navigateur utilise des paramètres régionaux américains *et* que l’ordinateur se trouve dans un fuseau horaire des États-Unis, et en SI partout ailleurs.

**Unités** : chaque grandeur a sa propre unité. Saisies, tableaux, infobulles et étiquettes des diagrammes utilisent l’unité choisie, et changer d’unité convertit ce qui est affiché (le modèle est stocké en SI en interne, un aller-retour ne perd donc rien, et un lien partagé ouvre le même modèle dans n’importe quelles unités).

| Grandeur | Choix | SI | Américain |
| --- | --- | --- | --- |
| Longueur (géométrie) | m, cm, mm, ft, in | m | ft |
| Dimensions de section | m, cm, mm, ft, in | m | in |
| Déplacement | m, cm, mm, ft, in | m | in |
| Aire | m², cm², mm², ft², in² | m² | in² |
| Moment quadratique | m⁴, cm⁴, mm⁴, ft⁴, in⁴ | m⁴ | in⁴ |
| Masse | kg, lb | kg | lb |
| Force | N, kN, MN, kgf, Tonf, lbf, kip | kN | kip |
| Moment fléchissant | Nmm, Nm, kNm, MNm, Tonf·m, lbf·in, lbf·ft, kip·in, kip·ft | kNm | kip·ft |
| Contrainte (E, G) | Pa, kPa, MPa, GPa, ksc, psi, ksi, psf, ksf | MPa | ksi |
| Température | °C, °F | °C | °F |

Les charges réparties sont en *force / longueur* dans les unités choisies (kN/m en SI, kip/ft en unités américaines), la densité en *masse / longueur³*. Le coefficient de dilatation thermique suit l’unité de température (1/K ou 1/°F). Les charges thermiques sont des *variations* de température, donc 10 °C valent 18 °F. Les rotations sont toujours en radians.

Tonf est la tonne-force métrique (1000 kgf), pas la « short ton » américaine. Les unités américaines sont converties avec leurs définitions exactes (1 ft = 0,3048 m, 1 kip = 4448,2216 N).

**Système de coordonnées** — *x vers la droite, z vers le bas* (par défaut) ou *x vers la droite, y vers le haut*. L'option y vers le haut inverse le signe des valeurs verticales et des angles d'appui et renomme les axes dans toutes les saisies, tableaux, info-bulles et exports ; le modèle et les fichiers enregistrés ne changent pas. Voir [Axe y vers le haut](/fr/elements/conventions#y-up-axes).

## Paramètres d’affichage

Un **Aperçu** en haut montre un petit modèle qui réagit à chaque changement.

**Grille**
- **Afficher la grille** (<kbd>G</kbd>) : dessine la grille et les règles.
- **Magnétisme à la grille** (<kbd>S</kbd>) : les nœuds placés ou déplacés à la souris se calent sur le pas.
- **Pas de magnétisme de la grille** : espacement dans l’unité de longueur (0,1 m par défaut, ou 0,5 ft en unités américaines). En passant des unités métriques aux unités américaines ou inversement, un pas resté à sa valeur par défaut prend la valeur par défaut de l’autre système ; un pas que vous avez réglé vous-même est conservé. Les règles comptent aussi dans l’unité de longueur ; en pieds, les règles et le réticule affichent pieds et pouces (5′-6″), tandis que les saisies et les tableaux restent en pieds décimaux (5,5).

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
