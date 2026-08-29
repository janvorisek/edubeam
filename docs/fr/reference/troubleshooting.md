# Dépannage

## Aucun résultat n’est tracé

Les résultats n’apparaissent que lorsque le modèle est résoluble. Vérifiez, dans l’ordre :

1. **Y a-t-il une alerte rouge dans la vue ?** *Aucun matériau défini.* / *Aucune section définie.* → ajoutez-en. *Model has N error(s)* → cliquez sur **Show details** et corrigez chaque point (voir le tableau ci-dessous).
2. **Assez d’appuis ?** Le solveur exige au moins trois DDL bloqués *et* aucun mécanisme. Une poutre sur deux appuis simples (Dz + Dz) n’en a que deux et glisse ; un portique entièrement articulé sans contreventement peut être un mécanisme malgré de nombreux appuis. Ajoutez un `Dx` quelque part, ou un `Ry` sur un appui.
3. **Les éléments sont-ils connectés ?** Deux nœuds aux mêmes coordonnées restent deux nœuds distincts. Supprimez le nœud en trop et reconnectez, ou placez les nœuds sur les éléments avec **Connecter à la structure**.
4. **Des rotules partout ?** Un nœud dont tous les éléments sont rotulés et sans `Ry` bloqué a une rotation indéterminée. Décochez une rotule ou bloquez `Ry` en ce nœud.
5. **Des valeurs absurdes** (déplacements de plusieurs millions) signifient que la structure est presque un mécanisme ; EduBeam masque ces résultats. Cherchez un appui manquant ou une rigidité quasi nulle (`E`, `A` ou `Iy` saisis par erreur à 0 ou dans la mauvaise unité).

## Messages d’erreur

Messages de **Show details** (boîte *Cannot solve model*, pour l’instant en anglais uniquement) :

| Message | Signification / correctif |
| --- | --- |
| *Model needs at least 3 constrained DOFs to be stable in 2D analysis.* | Ajoutez des appuis jusqu’à bloquer au moins trois DDL au total. |
| *Element X references missing node / material / cross section Y.* | L’entité référencée a été supprimée (généralement dans un JSON modifié à la main). Réaffectez-la dans le tableau *Éléments*. |
| *Element X must reference exactly 2 nodes.* | Élément corrompu dans un fichier importé ; supprimez-le et recréez-le. |
| *Nodal load / Prescribed displacement #n references missing node Y.* | Supprimez la charge ou réaffectez-la. |
| *Element load #n references missing element Y.* | Supprimez la charge. |
| *Solver failed due to an internal model inconsistency…* | Échec générique ; annulez la dernière étape ou enregistrez le fichier et [signalez-le](https://github.com/janvorisek/edubeam/issues). |

Les avertissements (boîte *Model warnings*) n’arrêtent pas le calcul : *Element X references the same node at both ends* (élément de longueur nulle — supprimez-le) et *… contains invalid values* (charge avec une composante non numérique — modifiez-la).

## Les résultats semblent faux

| Symptôme | Cause probable |
| --- | --- |
| Les charges agissent vers le haut | L’axe global **z pointe vers le bas** : `Fz`/`fz` positif est vers le bas. Les valeurs négatives pointent vers le haut. Voir les [conventions](/fr/elements/conventions). |
| Flèche 1000× trop grande ou trop petite | Confusion d’unités : `E` saisi en Pa alors que l’unité est le MPa, ou `Iy` en cm⁴ alors que l’unité est le m⁴. Vérifiez la pastille des unités en bas à droite de la vue. |
| Flèche légèrement supérieure à la formule du manuel | Déformation de cisaillement de Timoshenko. Augmentez le coefficient de cisaillement de la section (ou prenez une barre élancée) pour approcher les valeurs d’Euler–Bernoulli. Voir [Vérifier les résultats à la main](/fr/guide/verification). |
| Diagramme des moments du « mauvais » côté | Le côté n’est qu’une convention de tracé ; lisez le signe sur les étiquettes : positif = fibre inférieure tendue. |
| Diagrammes énormes / minuscules | Purement visuel : réglez l’**Échelle des résultats** dans *Paramètres → Paramètres d’affichage*. |
| Charge en repère local dans le mauvais sens | L’axe x local de l’élément va du nœud *initial* au nœud *final*. Utilisez **Inverser les nœuds** ou changez le signe. |
| La charge thermique ne fait rien | Les structures isostatiques se déforment librement sous température, sans sollicitations. Vérifiez que α ≠ 0 et, pour le gradient, que la hauteur h de la section est renseignée. |

## Problèmes d’interface

| Symptôme | Correctif |
| --- | --- |
| Les raccourcis ne font rien | Cliquez d’abord sur la zone de dessin : les touches sont ignorées tant qu’un champ texte a le focus. |
| Impossible de déplacer la vue | Le déplacement utilise par défaut le bouton du milieu/droit ; changez-le dans *Paramètres → Commandes et raccourcis*. Sur un pavé tactile, utilisez deux doigts ou passez à *Bouton droit*. |
| Le modèle a disparu après une mise à jour | Une mise à jour qui réinitialise le stockage est annoncée par une boîte de dialogue ; annulez-la et enregistrez le projet avant de mettre à jour. |
| Mauvaise langue | *Paramètres → Langue et paramètres régionaux*, ou ajoutez `?lang=fr` à l’URL. |
| Les paramètres ne sont pas conservés | Le stockage local est bloqué (fenêtre privée, mode de confidentialité strict). Paramètres et enregistrement automatique en ont besoin. |

## Signaler un bogue

Ouvrez un [ticket GitHub](https://github.com/janvorisek/edubeam/issues) avec le navigateur et le système d’exploitation, ce que vous attendiez et — le plus utile — un **lien partagé** ou le **JSON du projet** reproduisant le problème.
