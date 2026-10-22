# Foire aux questions

## Généralités {#general}

### Qu’est-ce qu’EduBeam ? {#what-is-edubeam}

Un solveur gratuit et open source, exécuté dans le navigateur, pour les poutres, portiques et treillis 2D, destiné aux étudiants, enseignants et ingénieurs qui veulent un retour immédiat. Voir l’[Introduction](/fr/guide/introduction).

### Est-ce vraiment gratuit ? Faut-il un compte ? {#is-it-really-free-do-i-need-an-account}

Oui, et non. Ouvrez [run.edubeam.app](https://run.edubeam.app/?lang=fr) et commencez à modéliser. Il n’y a ni compte, ni installation, ni limite d’utilisation. Le code source est sur [GitHub](https://github.com/janvorisek/edubeam).

### Quels navigateurs et appareils sont pris en charge ? {#which-browsers-and-devices-work}

Toute version récente de Chrome, Edge, Firefox ou Safari. Les tablettes et les téléphones fonctionnent : touchez pour sélectionner ou placer, faites glisser un nœud pour le déplacer, faites glisser ailleurs pour déplacer la vue, pincez pour zoomer, et faites un appui long pour le menu contextuel. Une souris et un clavier rendent tout de même la modélisation plus rapide. Voir [Clavier, souris et tactile](/fr/reference/shortcuts#touch).

### J’ai perdu mon modèle. Puis-je le récupérer ? {#i-lost-my-model-can-i-get-it-back}

Probablement. Effacer le modèle, ou ouvrir par-dessus un lien, un fichier ou un exemple, conserve l’ancien dans **☰ → Structures récentes** (les 10 derniers), et <kbd>Ctrl</kbd>+<kbd>Z</kbd> annule le remplacement. Les deux ne vivent que dans votre navigateur.

### Puis-je l’utiliser hors ligne ? {#can-i-use-it-offline}

EduBeam est une application web progressive (PWA) : une fois chargée, elle continue de fonctionner sans connexion, et le navigateur peut proposer de l’installer. Quand une nouvelle version est disponible, une boîte de dialogue demande votre accord avant la mise à jour.

### Où mes données sont-elles stockées ? {#where-is-my-data-stored}

Uniquement dans votre navigateur. Les modèles ne sont jamais envoyés à un serveur ; le lien de partage *est* le modèle. Voir [Import, export et partage](/fr/essentials/import-export).

## Modélisation {#modelling}

### Comment créer un encastrement, une articulation ou un appui simple ? {#how-do-i-make-a-fixed-pinned-roller-support}

Cliquez sur le nœud, ouvrez **Appuis du nœud** et choisissez le symbole : rotule, appui simple, encastrement, glissière, etc. Ou cochez les DDL : **Dx + Dz + Ry** = encastrement, **Dx + Dz** = articulation, **Dz** = appui simple. Toutes les combinaisons sont listées dans [Nœuds et appuis](/fr/essentials/nodes-supports#supports).

### Comment créer un treillis ? {#how-do-i-make-a-truss}

Utilisez des éléments poutre et cochez les **deux Rotules d’extrémité** de chaque barre dans l’onglet *Éléments*, ou cochez *Rotule au début* et *Rotule à la fin* dans le bandeau avant de dessiner les barres à la souris. Appliquez les charges aux nœuds. Le [tutoriel du treillis](/fr/tutorials/truss) en construit un pas à pas.

### Comment placer une rotule dans un portique ? {#how-do-i-put-a-hinge-in-a-frame}

Cochez la **rotule d’extrémité** de l’élément, du côté du nœud où le moment doit être libéré. Articuler *un* élément en un nœud ne libère que cet élément.

### Comment ajouter un appui ou une charge ponctuelle au milieu d’une poutre ? {#how-do-i-add-a-support-or-a-point-load-in-the-middle-of-a-beam}

Ajoutez un nœud sur la poutre avec *Ajouter à la souris* et choisissez **Connecter à la structure** : la poutre est scindée en deux. Pour une simple charge ponctuelle, vous n’avez même pas besoin de nœud : utilisez une charge d’élément de type **Charge ponctuelle** avec une position.

### Puis-je appliquer le poids propre ? {#can-i-apply-self-weight}

Pas automatiquement. Saisissez-le comme charge uniformément répartie $f_z = \rho g A$.

### Puis-je modéliser des appuis inclinés ? {#can-i-model-inclined-supports}

Oui : définissez un **Angle du SCL nodal** sur le nœud ; ses DDL sont alors interprétés dans le repère tourné.

### Y a-t-il des cas de charge ou des combinaisons ? {#are-there-load-cases-or-combinations}

Non, un seul cas de charge. Modélisez chaque cas séparément et enregistrez-le ou partagez-le.

### Pourquoi mes charges pointent-elles vers le haut ? {#why-do-my-loads-point-up}

Parce que l’axe global z pointe vers le **bas** : un `Fz` positif est dirigé vers le bas. Voir les [conventions](/fr/elements/conventions). Si vous préférez un axe vertical orienté vers le haut, passez aux axes y vers le haut dans *Paramètres → Langue et paramètres régionaux → Système de coordonnées*.

## Résultats {#results}

### Pourquoi n’y a-t-il pas de bouton « Calculer » ? {#why-is-there-no-solve-button}

Le modèle est calculé automatiquement après chaque modification. Si aucun résultat n’apparaît, c’est que le modèle n’est pas encore calculable ; le [Dépannage](/fr/reference/troubleshooting) liste ce qu’il faut vérifier.

### Pourquoi ma flèche diffère-t-elle légèrement de la formule ? {#why-does-my-deflection-differ-slightly-from-the-formula}

EduBeam utilise des poutres de Timoshenko : les flèches incluent donc la déformation d’effort tranchant. Pour les barres élancées, l’écart reste bien inférieur à 1 %. Détails et comparaisons chiffrées dans [Vérifier les résultats à la main](/fr/guide/verification).

### Quelle est la précision des résultats ? Faut-il plus d’éléments ? {#how-accurate-are-the-results-do-i-need-more-elements}

En analyse statique linéaire, l’élément poutre est exact pour les types de charge disponibles : un seul élément par barre suffit. Des nœuds supplémentaires ne sont nécessaires que là où vous voulez un appui, une rotule, un changement de section ou un nœud auquel attacher une charge.

### Où les réactions sont-elles listées ? {#where-are-the-reactions-listed}

Dans la vue, sous forme de flèches avec leurs valeurs (**Réactions** dans les options d’affichage, activées par défaut). Elles figurent aussi dans le fichier produit par **Résultats → Exporter en CSV**, et dans **Copier**. Les déplacements nodaux et les efforts aux extrémités des éléments se trouvent dans l’onglet **Résultats**.

## Fichiers et partage {#files-sharing}

### Comment partager un modèle ? {#how-do-i-share-a-model}

**Partager le modèle** → **Copier**. Le lien contient tout le modèle. Les destinataires obtiennent leur propre copie modifiable ; il n’y a pas de collaboration en direct. Voir aussi [Enseigner avec EduBeam](/fr/guide/teaching).

### Puis-je intégrer un modèle dans mon site web ou mes diapositives ? {#can-i-embed-a-model-on-my-website-or-in-slides}

Oui : ajoutez `&viewer=1` à un lien de partage et placez-le dans un `<iframe>`. Voir [Intégrer une visionneuse](/fr/essentials/import-export#embed-a-read-only-viewer).

### Puis-je exporter des images ou des tableaux ? {#can-i-export-images-or-tables}

Oui. **☰ → Exporter une image** (<kbd>Ctrl</kbd>+<kbd>P</kbd>) enregistre le dessin en PNG ou SVG, à la taille ou à l’échelle de votre choix. **Résultats → Exporter en CSV** enregistre les deux tableaux de résultats, et **Copier** les place dans le presse-papiers pour un tableur. Voir [Import, export et partage](/fr/essentials/import-export#export-an-image).

### Puis-je générer des modèles par programme ? {#can-i-generate-models-programmatically}

Oui. Le fichier de projet est du JSON simple en unités SI (voir la [description du format](/fr/essentials/import-export#project-file-format)) et s’ouvre avec *Ouvrir le projet* ou par glisser-déposer.

## Assistance {#support}

### Comment signaler un bogue ou demander une fonctionnalité ? {#how-do-i-report-a-bug-or-request-a-feature}

Ouvrez un ticket sur [GitHub](https://github.com/janvorisek/edubeam/issues) et joignez un lien de partage ou un fichier de projet qui reproduit le problème. Assistance privée : [support@edubeam.app](mailto:support@edubeam.app).
