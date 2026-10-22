# Enseigner avec EduBeam

<Edubeam /> est né dans un amphithéâtre, et c’est toujours là qu’il donne le meilleur de lui-même : un modèle au vidéoprojecteur qui réagit dès que vous le modifiez, et le même modèle sur l’ordinateur de chaque étudiant grâce à un lien. Cette page rassemble ce que les enseignants utilisent le plus.

## En cours magistral {#in-the-lecture}

- **Rendez-le lisible depuis le dernier rang.** Dans *Paramètres → Paramètres d’affichage*, augmentez la **Taille de police** à 18–20 px et la **Taille des appuis** à 130–150 %. Augmentez l’**Échelle des résultats** si les diagrammes paraissent timides sur un grand écran.
- **Montrez une chose à la fois.** Décochez tout dans les options d’affichage sauf la grandeur dont vous parlez, puis ajoutez les autres une à une.
- **Modifiez le modèle en direct.** Déplacez un appui, cochez `Ry`, ajoutez une rotule. Les étudiants voient immédiatement la cause et l’effet, et <kbd>Ctrl</kbd>+<kbd>Z</kbd> vous ramène en arrière.
- **Laissez le solveur expliquer les mécanismes.** Libérez une rotule de trop et EduBeam fait osciller le contour en pointillés du mécanisme et entoure les rotules en cause. C’est le bon moment pour parler de stabilité.
- **Utilisez la langue et les axes des étudiants.** Choisissez la langue de l’interface, les unités SI ou US, et les axes z vers le bas ou y vers le haut pour correspondre à vos notes de cours.

![Un mécanisme rendu visible : les rotules en B et C laissent le portique se déplacer latéralement](/screenshots/fr/ui-mechanism.webp)

## Dans les supports de cours et les devoirs {#in-lecture-notes-and-assignments}

Un lien de partage contient tout le modèle : il fonctionne partout où un lien fonctionne, dans un PDF, une diapositive, une page de plateforme pédagogique (LMS) ou un courriel.

1. Construisez le modèle et cliquez sur **Partager le modèle → Copier**.
2. Collez le lien dans vos notes. Les liens des anciennes versions d’EduBeam continuent de fonctionner : vos notes restent valables d’année en année.
3. Les étudiants qui l’ouvrent obtiennent leur propre copie pour expérimenter. Rien de ce qu’ils modifient ne vous parvient, ni à vous ni aux autres étudiants.

Variantes de liens utiles :

| Lien | Ouvre |
| --- | --- |
| `https://run.edubeam.app/?model=…` | Le modèle, prêt à être modifié |
| `https://run.edubeam.app/?viewer=1&model=…` | Le modèle en [mode visionneuse](/fr/essentials/import-export#embed-a-read-only-viewer), pour l’intégrer dans un `<iframe>` |
| `https://run.edubeam.app/?panel=examples` | La galerie d’exemples |
| `https://run.edubeam.app/?lang=cs` | L’application en tchèque (ou tout [autre code de langue](/fr/essentials/import-export#url-parameters)) |

::: warning Ouvrir un lien remplace le modèle de l’étudiant
Le modèle précédent part dans **☰ → Structures récentes** et peut être restauré, et un message le signale. Demandez quand même aux étudiants d’enregistrer le travail auquel ils tiennent avec **Enregistrer le projet** avant d’ouvrir des liens donnés en cours.
:::

## Des devoirs que les étudiants peuvent vérifier eux-mêmes {#assignments-students-can-check-themselves}

EduBeam donne aux étudiants un retour immédiat sur leurs calculs à la main sans leur livrer la méthode :

- Demandez les réactions, les efforts internes et un déplacement calculés à la main, puis faites construire le modèle aux étudiants pour comparer. [Vérifier les résultats à la main](/fr/guide/verification) contient des formules prêtes à l’emploi.
- Demandez *pourquoi* un résultat diffère : déformation d’effort tranchant, rotule oubliée, charge en axes locaux au lieu des axes globaux.
- Demandez aux étudiants de rendre un lien de partage ou un `project.json` avec leur calcul. Vous pouvez l’ouvrir et voir exactement ce qu’ils ont modélisé.
- Pour les rapports, les étudiants peuvent exporter le dessin en **SVG** (net dans Word et LaTeX) et les résultats en **CSV**.

## Exercices prêts à l’emploi {#ready-made-exercises}

- La page [Exemples](/fr/examples/) propose six modèles, chacun avec des exercices suggérés.
- Les tutoriels du [portique à trois articulations](/fr/tutorials/three-hinged-frame) et du [treillis plan](/fr/tutorials/truss) sont des exemples complets résolus, avec vérifications à la main.
- Le [Démarrage rapide](/fr/guide/quick-start) peut servir de fiche pour un premier TP : il prend une dizaine de minutes.

## Faire démarrer les étudiants {#getting-students-started}

Les nouveaux utilisateurs voient une fenêtre d’accueil avec deux options guidées : **Faire le tour** (une visite de l’interface) et **Dessiner votre première poutre** (une tâche en sept étapes à la souris). Les deux se trouvent aussi dans le menu ☰. Beaucoup d’enseignants disent simplement « ouvrez run.edubeam.app et choisissez *Dessiner votre première poutre* » au début du premier TP.

## Hors ligne et ordinateurs de salle de TP {#offline-and-lab-computers}

EduBeam est une application web progressive (PWA). Une fois qu’un ordinateur l’a chargée, elle continue de fonctionner sans connexion, et le navigateur peut proposer de l’installer. Les modèles et les paramètres sont stockés par profil de navigateur : sur les ordinateurs partagés des salles de TP, les étudiants doivent donc enregistrer leur travail sous forme de fichiers ou de liens.
