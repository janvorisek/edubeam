# Unités et paramètres

Il existe trois façons d’accéder aux paramètres :

- l’onglet **Paramètres** au-dessus de la vue, qui les affiche en pleine taille ;
- la **pastille des unités** en bas à droite de la vue, qui les ouvre sur *Langue et paramètres régionaux* ;
- **Plus de paramètres** sous les options d’affichage, qui les ouvre sur *Paramètres d’affichage*.

Les paramètres sont stockés dans votre navigateur et survivent aux rechargements. **Réinitialiser les paramètres** rétablit les valeurs par défaut de l’affichage, le format des nombres, les axes, le bouton de panoramique et les unités de votre région ; la langue est conservée.

## Langue et paramètres régionaux {#language-locale}

![Paramètres → Langue et paramètres régionaux](/screenshots/fr/settings-language.webp)

**Langue.** 12 langues d’interface. Vous pouvez aussi ouvrir l’application avec `?lang=<code>` : `en`, `cs`, `de`, `fr`, `es`, `pt`, `pl`, `cn`, `th`, `uk`, `ru`, `tr`.

**Format des nombres.** La façon dont les valeurs des résultats sont écrites : *Automatique*, *Scientifique* (par défaut) ou *Ingénierie*. Voir [Format des nombres](/fr/essentials/results#number-format).

**Système de coordonnées.** *x vers la droite, z vers le bas* (par défaut) ou *x vers la droite, y vers le haut*. L’option y vers le haut inverse le signe des valeurs verticales et des angles d’appui, et renomme les axes dans chaque champ, tableau, infobulle et export. Le modèle et les fichiers enregistrés ne changent pas. Voir [Axes y vers le haut](/fr/elements/conventions#y-up-axes).

![Le portique à trois articulations avec les axes y vers le haut : l’indicateur d’axes dans le coin pointe y vers le haut](/screenshots/fr/settings-y-up.webp){.shot-lg}

**Système d’unités.** *SI (métrique)* ou *Américain (impérial)* règle d’un coup toutes les unités ci-dessous. Si vous modifiez ensuite une unité isolée, le système s’affiche comme *Personnalisé*. Lors d’une première visite, vous choisissez dans la fenêtre d’accueil ; auparavant, EduBeam ne suppose les unités américaines que si le navigateur est réglé sur une langue régionale américaine *et* que l’ordinateur est dans un fuseau horaire américain.

**Unités.** Chaque grandeur a sa propre unité. Les champs de saisie, les tableaux, les infobulles et les étiquettes des diagrammes utilisent tous l’unité sélectionnée, et changer d’unité convertit ce qui est affiché. Le modèle lui-même est stocké en SI : rien n’est perdu en passant d’un système à l’autre, et un lien partagé ouvre le même modèle quelles que soient les unités.

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

Les charges linéaires utilisent *force / longueur* dans les unités sélectionnées (kN/m en SI, kip/ft en unités américaines), et la masse volumique *masse / longueur³*. Le coefficient de dilatation thermique suit l’unité de température (1/K ou 1/°F). Les charges thermiques sont des *variations* de température : 10 °C correspondent donc à 18 °F. Les rotations sont toujours en radians.

Tonf est la tonne-force métrique (1000 kgf), et non la *short ton* américaine. Les unités américaines sont converties avec leurs définitions exactes (1 ft = 0,3048 m, 1 kip = 4448,2216 N). En pieds, saisissez des valeurs décimales comme `5,5` ; les règles et le réticule affichent en pieds et en pouces (5′-6″).

## Paramètres d’affichage {#viewer-settings}

![Paramètres → Paramètres d’affichage, avec l’aperçu en direct à droite](/screenshots/fr/settings-viewer.webp)

Un **Aperçu**, à côté des paramètres, montre un petit modèle qui réagit à chaque modification. Les pastilles situées dessous choisissent le résultat affiché, et un clic sur une couleur fait passer l’aperçu sur le résultat correspondant.

**Grille**
- **Afficher la grille** (<kbd>G</kbd>) dessine la grille et les règles.
- **Magnétisme à la grille** (<kbd>S</kbd>) fait s’accrocher au pas de la grille les nœuds que vous placez ou déplacez.
- **Afficher le réticule** marque la position du pointeur sur les règles, pour que vous puissiez lire ses coordonnées (à la souris uniquement).
- **Pas de magnétisme de la grille** est l’espacement dans l’unité de longueur : 0,1 m par défaut, ou 0,5 ft en unités américaines. Quand vous passez des unités métriques aux unités américaines ou inversement, un pas resté à sa valeur par défaut prend la valeur par défaut de l’autre système ; un pas que vous avez défini vous-même est conservé.

**Tailles**
- **Échelle des résultats** (8–120 px, 48 par défaut) est la hauteur à l’écran de la plus grande ordonnée de diagramme ou du plus grand déplacement. Les diagrammes sont mis à l’échelle de leur propre maximum : ce réglage est donc purement visuel ; modifiez-le quand les tracés sont trop grands ou trop petits.
- **Taille des appuis** (50–150 %) et **Taille de police** (10–20 px). Des polices plus grandes aident au vidéoprojecteur.

**Orientation des étiquettes de résultats** : *Perpendiculaires au diagramme* (les étiquettes suivent le diagramme) ou *Toujours horizontales*.

**Vérification du modèle**
- **Montrer comment une structure instable peut bouger** dessine le contour en pointillés d’un mécanisme.
- **Animer le mouvement** le fait osciller d’avant en arrière.

**Couleurs** : des couleurs séparées pour les nœuds, les éléments, les charges, la déformée, l’effort normal, l’effort tranchant, le moment fléchissant et les réactions. Par défaut : N en bleu, V en vert, M en rouge, réactions en violet, charges en orange.

## Commandes et raccourcis {#controls-shortcuts}

**Déplacer la vue avec** définit le bouton de la souris qui sert au panoramique : *Molette ou bouton droit* (par défaut), *Molette de la souris* ou *Bouton droit*. La liste complète des raccourcis se trouve sur la page [Clavier, souris et tactile](/fr/reference/shortcuts).

## Ce qui est stocké dans votre navigateur {#what-is-stored-in-your-browser}

Outre les paramètres, EduBeam conserve dans le stockage local du navigateur :

- le **modèle courant**, enregistré après chaque modification : recharger l’onglet ou rouvrir l’application le restaure ;
- les **Structures récentes** : les 10 derniers modèles que vous avez effacés ou remplacés.

Les deux sont propres à chaque navigateur et à chaque appareil, et effacer les données du site les supprime. Utilisez [Enregistrer le projet ou Partager le modèle](/fr/essentials/import-export) pour conserver un modèle ou le transférer ailleurs.
