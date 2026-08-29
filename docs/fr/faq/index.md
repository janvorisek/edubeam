# Foire aux questions

## Général

### Qu’est-ce qu’EduBeam ?

Un solveur gratuit, open source et exécuté dans le navigateur pour poutres, portiques et treillis plans, destiné aux étudiants, enseignants et ingénieurs qui veulent une réponse immédiate. Voir l’[Introduction](/fr/guide/introduction).

### Est-ce vraiment gratuit ? Faut-il un compte ?

Oui, et non. Ouvrez [run.edubeam.app](https://run.edubeam.app/?lang=fr) et commencez à modéliser. Pas de compte, pas d’installation, pas de limite d’utilisation. Le code source est sur [GitHub](https://github.com/janvorisek/edubeam).

### Quels navigateurs et appareils fonctionnent ?

Tout Chrome, Edge, Firefox ou Safari récent. Tablettes et téléphones fonctionnent (toucher, glisser pour déplacer, pincer pour zoomer, appui long pour déplacer un nœud), mais souris et clavier rendent la modélisation bien plus rapide.

### Puis-je l’utiliser hors ligne ?

EduBeam est une application web progressive : une fois chargée, elle fonctionne sans connexion et le navigateur peut proposer de l’installer. Quand une nouvelle version est disponible, une boîte de dialogue demande confirmation avant la mise à jour.

### Où sont stockées mes données ?

Uniquement dans votre navigateur. Les modèles ne sont jamais envoyés à un serveur ; le lien partagé *est* le modèle. Voir [Import, export et partage](/fr/essentials/import-export).

## Modélisation

### Comment faire un encastrement / une articulation / un appui simple ?

Cochez les DDL : **Dx + Dz + Ry** = encastrement, **Dx + Dz** = articulation, **Dz** = appui simple. Toutes les combinaisons et leurs symboles sont dans [Nœuds et appuis](/fr/essentials/nodes-supports#appuis).

### Comment modéliser un treillis ?

Utilisez des éléments poutre et cochez **les deux Rotules d’extrémité** de chaque barre dans l’onglet *Éléments*. Appliquez les charges aux nœuds. Voir [Éléments](/fr/essentials/elements#rotules-d-extremite).

### Comment placer une rotule dans un portique ?

Cochez la **Rotule d’extrémité** de l’élément du côté du nœud où le moment doit être libéré. Rotuler *un* élément à un nœud ne libère que cet élément.

### Comment ajouter un appui ou une charge ponctuelle au milieu d’une poutre ?

Ajoutez un nœud sur la poutre avec *Ajouter à la souris* et choisissez **Connecter à la structure** : la poutre est scindée en deux. Pour une charge ponctuelle seule, pas besoin de nœud : utilisez la charge d’élément **Charge ponctuelle** avec une position.

### Puis-je appliquer le poids propre ?

Pas automatiquement. Saisissez-le comme charge uniformément répartie $f_z = \rho g A$.

### Puis-je modéliser des appuis inclinés ?

Oui : donnez au nœud un **Angle du SCL nodal** ; ses DDL sont alors interprétés dans le repère tourné.

### Y a-t-il des cas ou des combinaisons de charges ?

Non, un seul cas de charge. Modélisez chaque cas séparément et enregistrez-le ou partagez-le.

### Pourquoi mes charges pointent-elles vers le haut ?

Parce que l’axe global z pointe **vers le bas** : `Fz` positif est vers le bas. Voir les [conventions](/fr/elements/conventions).

## Résultats

### Pourquoi n’y a-t-il pas de bouton « Calculer » ?

Le modèle est résolu automatiquement après chaque modification. Si aucun résultat n’apparaît, le modèle n’est pas encore résoluble ; le [Dépannage](/fr/reference/troubleshooting) liste ce qu’il faut vérifier.

### Pourquoi ma flèche diffère-t-elle légèrement de la formule ?

EduBeam utilise des poutres de Timoshenko ; les flèches incluent donc la déformation de cisaillement. Pour les barres élancées, l’écart est très inférieur à 1 %. Détails et comparaisons chiffrées dans [Vérifier les résultats à la main](/fr/guide/verification).

### Quelle est la précision des résultats ? Faut-il plus d’éléments ?

En statique linéaire, l’élément poutre est exact pour les types de charge pris en charge ; un élément par barre suffit. Des nœuds supplémentaires ne servent qu’à placer un appui, une rotule, un changement de section ou un point d’application de charge.

### Où sont listées les réactions ?

Dans la vue, sous forme de flèches avec valeurs (activez **Réactions** dans le panneau d’affichage). Les efforts aux extrémités et les déplacements nodaux sont dans l’onglet **Résultats**.

## Fichiers et partage

### Comment partager un modèle ?

**Partager le modèle** → **Copier le lien**. Le lien contient tout le modèle. Les destinataires obtiennent leur propre copie modifiable ; il n’y a pas de collaboration en temps réel.

### Puis-je intégrer un modèle sur mon site ou dans des diapositives ?

Oui : ajoutez `&viewer=1` à un lien partagé et placez-le dans un `<iframe>`. Voir [Intégrer une visionneuse en lecture seule](/fr/essentials/import-export#integrer-une-visionneuse-en-lecture-seule).

### Puis-je exporter des images ou des tableaux ?

Pas encore. Faites une capture d’écran pour les images et copiez le texte du tableau pour les nombres. Votez pour la fonctionnalité sur [GitHub](https://github.com/janvorisek/edubeam/issues).

### Puis-je générer des modèles par programme ?

Oui. Le fichier de projet est du JSON simple en unités SI — voir la [description du format](/fr/essentials/import-export#format-du-fichier-de-projet) — et s’ouvre avec *Ouvrir le projet* ou par glisser-déposer.

## Assistance

### Comment signaler un bogue ou demander une fonctionnalité ?

Ouvrez un ticket sur [GitHub](https://github.com/janvorisek/edubeam/issues) et joignez un lien partagé ou un fichier de projet qui reproduit le problème. Assistance privée : [support@edubeam.app](mailto:support@edubeam.app).
