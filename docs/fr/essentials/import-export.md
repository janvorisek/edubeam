# Import, export et partage

Dans <Edubeam />, tout se passe dans votre navigateur. Rien n’est envoyé à un serveur : un lien de partage contient littéralement le modèle.

## Enregistrer un projet {#save-a-project}

**☰ → Enregistrer le projet** ou <kbd>Ctrl</kbd>+<kbd>S</kbd> télécharge `project.json`. Il contient les nœuds, les éléments, les matériaux, les sections (avec les formes polygonales), les charges, les lignes de cote et la version de l’application qui l’a écrit. Renommez le fichier librement.

## Ouvrir un projet {#open-a-project}

- **☰ → Ouvrir le projet** ou <kbd>Ctrl</kbd>+<kbd>O</kbd>, puis choisissez un fichier `.json`, ou
- **déposez le fichier n’importe où sur la fenêtre de l’application**.

L’ouverture remplace le modèle courant, matériaux et sections compris. Le modèle précédent n’est pas perdu : <kbd>Ctrl</kbd>+<kbd>Z</kbd> le fait revenir, et il est conservé dans les [Structures récentes](#recent-structures). Un fichier qui n’est pas un projet EduBeam est refusé avec un message, et votre modèle reste tel quel.

Les fichiers de projet de toutes les versions antérieures d’EduBeam s’ouvrent dans la version actuelle.

## Partager un lien {#share-a-link}

**Partager le modèle** (dans la barre de l’application ou le menu ☰) ouvre la boîte de dialogue *Partager le modèle via URL* :

![La boîte de dialogue de partage](/screenshots/fr/share.webp){.shot-lg}

- **Copier** copie le lien dans le presse-papiers. Cliquer dans le champ fait de même.
- **Ouvrir le lien** l’ouvre dans un nouvel onglet, pour que vous puissiez vérifier ce que verra le destinataire.
- **Partager via la boîte de dialogue système** transmet le lien au menu de partage de votre appareil, si le navigateur le permet.

Le lien a la forme `https://run.edubeam.app/?model=…` et encode tout le modèle. Quiconque l’ouvre obtient sa propre copie à modifier ; les modifications ne sont **pas** synchronisées en retour : envoyez un nouveau lien quand le modèle change. Les très gros modèles produisent des liens très longs ; pour ceux-là, partagez plutôt le fichier JSON.

Quand quelqu’un ouvre un lien, son propre modèle précédent part dans les Structures récentes, et un message lui indique où le retrouver.

Les liens des anciennes versions continuent de fonctionner : un lien placé dans les notes de cours de l’an dernier ouvre aujourd’hui le même modèle.

## Exporter une image {#export-an-image}

**☰ → Exporter une image** ou <kbd>Ctrl</kbd>+<kbd>P</kbd> ouvre l’export d’image.

![Exporter une image : choisissez les couches, le cadrage et la taille, puis téléchargez ou copiez](/screenshots/fr/export-image.webp)

- **Couches** : les pastilles du haut choisissent ce qui est dessiné, indépendamment de la vue : déformée, N, V, M, réactions, appuis, charges, étiquettes des nœuds et des éléments.
- **Cadrage** : choisissez un format (16:9, 4:3, 3:2, 1:1), **Tout afficher**, ou **Fenêtre…** pour tracer un rectangle sur le dessin. Vous pouvez aussi faire glisser les bords de l’aperçu.
- **Taille** : largeur et hauteur en pixels, ou une **Échelle** comme 1 : 50 pour un dessin à l’échelle sur papier. **Hauteur des diagrammes** règle la taille des diagrammes de résultats dans l’image. **Fond transparent** supprime le fond blanc.
- **Télécharger en PNG**, **Télécharger en SVG** ou **Copier dans le presse-papiers**.

Le SVG reste net à toutes les tailles et fonctionne dans Word, Inkscape et LaTeX sur Overleaf : c’est le meilleur choix pour les rapports et les mémoires.

## Exporter les résultats {#export-the-results}

**Résultats → Exporter en CSV** télécharge les deux tableaux de résultats, réactions comprises, et **Copier** les place dans le presse-papiers pour un tableur. Voir [Exporter en CSV et Copier](/fr/essentials/results#export-csv-and-copy).

## Structures récentes {#recent-structures}

**☰ → Structures récentes** conserve les 10 derniers modèles effacés ou remplacés par un lien, un fichier, un exemple ou la tâche de la première poutre. Chacun affiche une miniature, la raison de son remplacement et sa taille. **Restaurer** en fait revenir un ; le modèle que vous aviez alors entre à son tour dans la liste, et <kbd>Ctrl</kbd>+<kbd>Z</kbd> annule la restauration.

![Structures récentes](/screenshots/fr/recent.webp){.shot-lg}

La liste n’est stockée que dans ce navigateur.

## Exemples {#examples}

**☰ → Exemples** ouvre une galerie de modèles pédagogiques prêts à l’emploi. En ouvrir un remplace votre modèle, et <kbd>Ctrl</kbd>+<kbd>Z</kbd> fait revenir le vôtre. Les mêmes modèles, avec des exercices, se trouvent sur la page [Exemples](/fr/examples/) de ce guide.

![La galerie d’exemples](/screenshots/fr/examples.webp){.shot-lg}

## Intégrer une visionneuse {#embed-a-read-only-viewer}

Ajoutez `&viewer=1` à un lien de partage pour ouvrir le modèle en **mode visionneuse**. La barre de l’application, la barre inférieure, les onglets, l’annulation et le rétablissement, les pastilles de la grille et l’indicateur d’axes sont masqués ; il reste la zone de dessin, les boutons d’ajustement et de centrage, et les options d’affichage. Placez cette URL dans un `<iframe>` pour intégrer un modèle vivant et zoomable dans des notes de cours ou une page web :

```html
<iframe src="https://run.edubeam.app/?viewer=1&model=…" width="100%" height="400"></iframe>
```

![Le portique à trois articulations en mode visionneuse](/screenshots/fr/viewer-mode.webp){.shot-lg}

Le mode visionneuse est fait pour regarder, mais il n’est pas verrouillé : les visiteurs peuvent toujours déplacer des nœuds et changer de diagramme. Ouvrir un lien de visionneuse remplace aussi le modèle du visiteur dans ce navigateur (il part dans les Structures récentes), exactement comme un lien normal.

## Paramètres d’URL {#url-parameters}

| Paramètre | Effet |
| --- | --- |
| `model=<data>` | Charge le modèle encodé et l’ajuste à l’écran. |
| `viewer=1` | Mode visionneuse (voir ci-dessus). |
| `lang=<code>` | Change la langue de l’interface : `en`, `cs`, `de`, `fr`, `es`, `pt`, `pl`, `cn`, `th`, `uk`, `ru`, `tr`. |
| `panel=examples` | Ouvre directement la galerie d’exemples. |

Après les avoir lus, EduBeam retire les paramètres de la barre d’adresse.

## Persistance automatique {#automatic-persistence}

Le modèle courant et vos paramètres sont enregistrés dans le stockage local du navigateur après chaque modification et restaurés à votre retour, même après la fermeture du navigateur. C’est une commodité, pas une sauvegarde : elle est liée à un profil de navigateur sur un appareil, et effacer les données du site la supprime. Enregistrez les travaux importants dans un fichier de projet.

## Format du fichier de projet {#project-file-format}

`project.json` est du JSON simple et lisible :

```json
{
  "edubeam": true,
  "version": "1.3.1",
  "domain": {
    "materials": [{ "label": "1", "e": 210000000000, "g": 81000000000, "alpha": 0.000012, "d": 7850 }],
    "crossSections": [{ "label": "1", "a": 0.00285, "iy": 1.943e-5, "h": 0.2, "k": 1 }],
    "nodes": [
      { "label": "1", "coords": [0, 0, 0], "bcs": [0, 2] },
      { "label": "2", "coords": [6, 0, 0], "bcs": [2] }
    ],
    "elements": [{ "label": "1", "nodes": ["1", "2"], "mat": "1", "cs": "1", "hinges": [false, false] }],
    "loadCases": [
      {
        "label": "1",
        "nodalLoads": [],
        "elementLoads": [{ "type": "udl", "target": "1", "lcs": false, "values": [0, 12000] }],
        "prescribedBC": []
      }
    ]
  },
  "dimensions": []
}
```

C’est la poutre du Démarrage rapide. Toutes les valeurs sont en **unités SI** (m, N, Pa, rad), quelles que soient les unités d’affichage. Les coordonnées sont `[x, y, z]`, avec y toujours égal à 0. Les conditions aux limites et les composantes de charge utilisent les identifiants de DDL `0 = Dx`, `2 = Dz`, `4 = Ry`.

| `type` de charge d’élément | Valeurs |
| --- | --- |
| `udl` | `values: [fx, fz]` en N/m |
| `trapezoidal` | `startValues: [f1x, f1z]`, `endValues: [f2x, f2z]` en N/m, axes locaux |
| `concentrated` | `values: [Fx, Fz, My, a]` en N, N·m et m depuis le nœud initial |
| `temperature` | `values: [ΔTc, ΔTb, ΔTt]` en K ; le gradient vaut ΔTb − ΔTt |

Les charges nodales s’écrivent `{ "target": "2", "values": { "0": Fx, "2": Fz, "4": My } }` et les déplacements imposés `{ "target": "2", "prescribedValues": { "0": Dx, "2": Dz, "4": Ry } }` ; indiquez les trois composantes. Les fichiers écrits par l’application contiennent aussi une `date`, un `commit`, un `lcs` nodal et des `shape` de polygones.

Comme le format est simple, vous pouvez générer des modèles avec un script ou un tableur et les ouvrir avec **Ouvrir le projet**.
