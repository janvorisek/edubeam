# Import, export et partage

Tout dans <Edubeam /> se passe dans votre navigateur. Rien n’est envoyé à un serveur : un lien partagé contient littéralement le modèle.

## Enregistrer un projet

**Menu ☰ → Enregistrer le projet** ou <kbd>Ctrl</kbd>+<kbd>S</kbd> télécharge `project.json`. Il contient nœuds, éléments, matériaux, sections, charges, cotes et la version de l’application qui l’a écrit. Renommez le fichier à votre guise.

## Ouvrir un projet

- **Menu ☰ → Ouvrir le projet** ou <kbd>Ctrl</kbd>+<kbd>O</kbd>, puis choisissez un fichier `.json`, ou
- **glissez le fichier n’importe où sur la fenêtre de l’application**.

Ouvrir remplace le modèle courant (matériaux et sections compris). Faites d’abord **Enregistrer le projet** si vous voulez le conserver.

## Partager un lien

**Partager le modèle** (🔗 dans la barre supérieure ou dans le menu ☰) ouvre la boîte *Partager le modèle via URL* :

- **Copier le lien** : copie le lien dans le presse-papiers (ou cliquez dans le champ).
- **Ouvrir le lien** : l’ouvre dans un nouvel onglet pour voir ce que verra le destinataire.
- **Partager via la boîte de dialogue système** : sur téléphone et tablette, transmet le lien au menu de partage du système.

Le lien a la forme `https://run.edubeam.app/?model=…` et encode tout le modèle (nœuds, éléments, propriétés, charges). Qui l’ouvre obtient une copie exacte à modifier localement ; les modifications ne sont **pas** synchronisées en retour — renvoyez un lien quand le modèle change. Les très gros modèles donnent de très longs liens ; partagez alors plutôt le fichier JSON.

## Intégrer une visionneuse en lecture seule

Ajoutez `&viewer=1` à un lien partagé (ou `?viewer=1` à n’importe quelle URL de l’application) pour ouvrir le modèle en **mode visionneuse** : barre supérieure, barre inférieure, annuler/rétablir et panneau de paramètres sont masqués ; seule reste la zone de dessin avec le modèle. Placez cette URL dans un `<iframe>` pour intégrer un modèle vivant et zoomable dans un polycopié ou une page web :

```html
<iframe src="https://run.edubeam.app/?viewer=1&model=…" width="100%" height="400"></iframe>
```

La page [Exemples](/fr/examples/) est construite ainsi : chaque carte est un lien avec un paramètre `?model=`.

## Paramètres d’URL

| Paramètre | Effet |
| --- | --- |
| `model=<données>` | Charge le modèle encodé, l’ajuste à l’écran puis retire le paramètre de la barre d’adresse. |
| `lang=<code>` | Change la langue de l’interface (`en`, `cs`, `de`, `fr`, `es`, `pt`, `pl`, `cn`, `th`, `uk`, `ru`). |
| `viewer=1` | Mode visionneuse en lecture seule (voir ci-dessus). |

## Persistance automatique

Le modèle courant et vos paramètres sont enregistrés dans le stockage local du navigateur après chaque modification et restaurés à votre retour, même après fermeture du navigateur. C’est une commodité, pas une sauvegarde : elle est liée à un profil de navigateur sur un appareil, et effacer les données du site la supprime. Enregistrez le travail important comme fichier de projet.

## Format du fichier de projet

`project.json` est du JSON simple et lisible :

```json
{
  "edubeam": true,
  "version": "1.0.6",
  "domain": {
    "materials": [ { "label": "1", "e": 210000000000, "g": 81000000000, "alpha": 0.000012, "d": 7850 } ],
    "crossSections": [ { "label": "1", "a": 0.00285, "iy": 1.943e-5, "h": 0.2, "k": 1 } ],
    "nodes": [ { "label": "1", "coords": [0, 0, 0], "bcs": [0, 2] }, … ],
    "elements": [ { "label": "1", "nodes": ["1", "2"], "mat": "1", "cs": "1", "hinges": [false, false] } ],
    "loadCases": [ … ]
  }
}
```

Toutes les valeurs sont stockées en **unités SI** (m, N, Pa, rad), quelles que soient les unités affichées. Les conditions aux limites utilisent les identifiants de DDL `0 = Dx`, `2 = Dz`, `4 = Ry`. Le format étant simple, vous pouvez générer des modèles par script ou tableur et les ouvrir avec **Ouvrir le projet**. Le format n’est pas versionné comme une API stable : vérifiez le champ `version` si vous automatisez dessus.
