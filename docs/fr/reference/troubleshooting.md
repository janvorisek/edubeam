# Dépannage

## Aucun résultat n’est dessiné {#no-results-are-drawn}

Les résultats n’apparaissent que lorsque le modèle peut être calculé. Vérifiez, dans cet ordre :

1. **Lisez le message en haut à gauche de la vue.**
   - *Aucun matériau défini.* / *Aucune section définie.* : ajoutez-en un avec le bouton **Ajouter**.
   - Une pastille bleue **Appuis manquants** : le modèle est simplement inachevé. Ajoutez des appuis. Pointez la pastille pour voir, sous forme de contour en pointillés, comment la structure peut encore bouger.
   - Un **message rouge** : quelque chose ne va pas. Il nomme le problème, ou affiche *Erreurs dans le modèle : N* lorsqu’il y en a plusieurs. Cliquez sur **Afficher les détails** et corrigez chaque point (voir le tableau ci-dessous). Les nœuds ou les rotules concernés sont entourés sur la zone de dessin.
   - Un **message jaune** : des avertissements. Le modèle a tout de même été calculé ; vous pouvez les masquer.
2. **Assez d’appuis ?** Le solveur a besoin d’au moins trois DDL bloqués, et les appuis doivent tenir la structure. Une poutre sur deux appuis simples (Dz + Dz) n’en a que deux et glisse. Ajoutez un `Dx` quelque part, ou un `Ry` sur l’un des appuis.
3. **Les éléments sont-ils reliés ?** Deux nœuds aux mêmes coordonnées restent deux nœuds distincts. Supprimez le nœud en trop et reliez à nouveau, ou placez les nœuds sur les éléments avec **Connecter à la structure**.
4. **Trop de rotules ?** Des rotules aux deux extrémités d’un poteau, ou un carré de barres articulées sans diagonale, forment un mécanisme. EduBeam entoure les rotules et montre le mouvement.
5. **Une rigidité nulle ?** `E`, `A` ou `Iy` saisi par erreur à 0, ou dans la mauvaise unité, fait bouger une partie de la structure presque sans résistance. EduBeam le signale comme *instable*.

![Afficher les détails liste chaque problème avec une indication, et peut montrer le mouvement](/screenshots/fr/ui-diagnostics.webp){.shot-lg}

## Messages {#messages}

**Afficher les détails** ouvre une boîte de dialogue intitulée *Impossible de résoudre le modèle* (erreurs), *Pas encore prêt pour le calcul* (appuis encore nécessaires) ou *Avertissements du modèle*. Son lien **Dépannage** mène à cette page.

### Reste à faire {#still-needed}

| Message | Signification / solution |
| --- | --- |
| *La structure a besoin d’appuis pour pouvoir être calculée.* | Moins de trois DDL bloqués au total. Ajoutez des appuis. |
| *Une partie séparée de la structure (nœuds …) a moins de 3 DDL bloqués et peut se déplacer librement.* | Le modèle est en morceaux et l’un d’eux flotte. Reliez-le, ou appuyez-le. |

### Erreurs {#errors}

| Message | Signification / solution |
| --- | --- |
| *La structure a suffisamment d’appuis, mais ils ne la maintiennent pas : elle peut encore …* | Les appuis sont tous parallèles, ou leurs lignes d’action concourent en un même point. Le contour en pointillés montre le mouvement ; changez la direction de l’un des appuis. Le même message nomme une *partie séparée* si un seul morceau est concerné. |
| *Les appuis maintiennent la structure, mais c’est encore un mécanisme : ses barres peuvent tourner autour des articulations du nœud …* | Les rotules permettent à des barres de tourner les unes par rapport aux autres, comme dans un portique avec des rotules en tête des deux poteaux ou un carré articulé sans diagonale. Supprimez une rotule, ou ajoutez une barre ou un appui. |
| *La structure est instable. Déplacement pratiquement sans résistance : nœud …* | Presque un mécanisme, ou une rigidité proche de zéro. Vérifiez les appuis, les rotules et les valeurs de `E`, `A` et `Iy`. |
| *La structure est un mécanisme : la matrice de rigidité est singulière.* | Quelque chose peut bouger librement sans avoir été détecté par les vérifications ci-dessus. Vérifiez que chaque partie est maintenue par au moins trois liaisons et que les rotules ne laissent aucune barre libre de tourner. |
| *L’élément … référence le nœud inexistant …* / *le matériau inexistant …* / *la section inexistante …* | L’objet référencé a été supprimé, généralement dans un fichier JSON modifié à la main. Réaffectez-le dans le tableau *Éléments*. |
| *L’élément … doit référencer exactement 2 nœuds.* | Un élément défectueux dans un fichier importé. Supprimez-le et recréez-le. |
| *La charge nodale n° n référence le nœud inexistant …* / *Le déplacement imposé n° n référence le nœud inexistant …* | Supprimez la charge ou attribuez-lui un nœud. |
| *La charge d’élément n° n référence l’élément inexistant …* | Supprimez la charge. |
| *Échec du solveur dû à une incohérence interne du modèle…* | Un échec générique. Annulez la dernière étape, ou enregistrez le fichier et [signalez-le](https://github.com/janvorisek/edubeam/issues). |

### Avertissements {#warnings}

Le modèle est tout de même calculé, mais vérifiez ces points :

| Message | Signification / solution |
| --- | --- |
| *Le nœud … n’est relié à aucun élément et est ignoré par le solveur.* | Un nœud isolé. Supprimez-le ou reliez-le. |
| *Le nœud … possède un appui mais aucun élément n’y est relié : l’appui ne reprend donc rien.* | Un appui sur un nœud isolé. |
| *L’élément … référence le même nœud à ses deux extrémités.* | Un élément de longueur nulle. Supprimez-le. |
| *La charge nodale n° n contient des valeurs invalides.* / *Le déplacement imposé n° n contient des valeurs invalides.* | Une composante qui n’est pas un nombre. Modifiez la charge. |

## Les résultats semblent faux {#results-look-wrong}

| Symptôme | Cause probable |
| --- | --- |
| Les charges agissent vers le haut | L’axe global **z pointe vers le bas** : un `Fz`/`fz` positif est dirigé vers le bas. Les valeurs négatives pointent vers le haut. Voir les [conventions](/fr/elements/conventions). Avec les axes y vers le haut, c’est l’inverse. |
| La flèche est 1000 fois trop grande ou trop petite | Une confusion d’unités : `E` saisi en Pa alors que l’unité est le MPa, ou `Iy` en cm⁴ alors que l’unité est le m⁴. Vérifiez la pastille des unités en bas à droite de la vue. |
| La flèche est légèrement supérieure à la formule du manuel | La déformation d’effort tranchant de Timoshenko. Augmentez le coefficient de cisaillement de la section, ou utilisez une barre élancée, pour vous rapprocher des valeurs d’Euler–Bernoulli. Voir [Vérifier les résultats à la main](/fr/guide/verification). |
| Un signe semble « faux » | Lisez le signe sur les étiquettes, pas d’après le côté du diagramme. Un M positif tend la fibre inférieure. Les efforts aux extrémités dans *Résultats par élément* suivent les axes locaux de l’élément, et non la convention N-V-M. |
| Deux poteaux identiques ont des efforts tranchants de signes opposés | Le signe de V suit l’orientation de chaque élément. Inversez les nœuds de l’un d’eux pour comparer. |
| Des nombres comme `4 · 10¹` | Le format des nombres scientifique. Choisissez *Automatique* dans *Paramètres → Langue et paramètres régionaux → Format des nombres*. |
| Les diagrammes sont énormes ou minuscules | Purement visuel. Ajustez l’**Échelle des résultats** dans *Paramètres → Paramètres d’affichage*. |
| Une charge en coordonnées locales pointe dans le mauvais sens | L’axe x local de l’élément va de son nœud *initial* à son nœud *final*. Inversez les nœuds, ou changez le signe. |
| La charge d’une barre inclinée est décalée | **LCS** est cochée par défaut : `fz` agit donc perpendiculairement à la barre. Décochez-la pour une charge verticale. |
| Une charge thermique n’a aucun effet | Une structure isostatique se déforme librement sous l’effet de la température, sans efforts internes. Vérifiez que α ≠ 0 et, pour le gradient, que la hauteur de section h est renseignée. |

## Problèmes d’interface {#interface-issues}

| Symptôme | Solution |
| --- | --- |
| Les raccourcis ne font rien | Cliquez d’abord sur la zone de dessin : les touches sont ignorées tant qu’un champ de texte a le focus. |
| Impossible de déplacer la vue | Le panoramique utilise par défaut le bouton central ou droit de la souris ; modifiez-le dans *Paramètres → Commandes et raccourcis*. Sur un pavé tactile, le défilement à deux doigts zoome ; cliquez et faites glisser avec deux doigts pour déplacer la vue. |
| Mon modèle a disparu | Ouvrir un lien, un fichier ou un exemple, ainsi qu’effacer, conservent l’ancien modèle : **☰ → Structures récentes**, ou <kbd>Ctrl</kbd>+<kbd>Z</kbd>. |
| Mauvaise langue | *Paramètres → Langue et paramètres régionaux*, ou ajoutez `?lang=fr` à l’adresse. |
| Les modifications des paramètres ne sont pas conservées | Le stockage local est bloqué (fenêtre privée, mode de confidentialité strict). Les paramètres, l’enregistrement automatique et les Structures récentes en ont besoin. |

## Signaler un bogue {#reporting-a-bug}

Ouvrez un [ticket GitHub](https://github.com/janvorisek/edubeam/issues) en indiquant votre navigateur et votre système d’exploitation, ce que vous attendiez et, surtout, un **lien de partage** ou le **fichier de projet** qui reproduit le problème.
