# Import, Export & Teilen

Alles in <Edubeam /> geschieht in Ihrem Browser. Nichts wird auf einen Server hochgeladen – ein geteilter Link enthält buchstäblich das Modell.

## Projekt speichern

**☰ Menü → Projekt speichern** oder <kbd>Strg</kbd>+<kbd>S</kbd> lädt `project.json` herunter. Sie enthält Knoten, Elemente, Materialien, Querschnitte, Lasten, Bemaßungen und die Version der App, die sie geschrieben hat. Die Datei können Sie beliebig umbenennen.

## Projekt öffnen

- **☰ Menü → Projekt öffnen** oder <kbd>Strg</kbd>+<kbd>O</kbd> und eine `.json`-Datei wählen, oder
- **die Datei irgendwo in das App-Fenster ziehen**.

Das Öffnen ersetzt das aktuelle Modell (einschließlich Materialien und Querschnitten). Wenn Sie es behalten wollen, zuerst **Projekt speichern**.

## Per Link teilen

**Modell teilen** (🔗 in der Kopfleiste oder im Menü ☰) öffnet den Dialog *Modell per URL teilen*:

- **Link kopieren** – kopiert den Link in die Zwischenablage (oder in das Feld klicken).
- **Link öffnen** – öffnet ihn in einem neuen Tab, damit Sie sehen, was Empfänger sehen.
- **Über Systemdialog teilen** – auf Smartphones und Tablets wird der Link an die System-Freigabe übergeben.

Der Link hat die Form `https://run.edubeam.app/?model=…` und kodiert das gesamte Modell (Knoten, Elemente, Eigenschaften, Lasten). Wer ihn öffnet, erhält eine exakte Kopie zum lokalen Bearbeiten; Änderungen werden **nicht** zurücksynchronisiert – senden Sie nach einer Änderung einen neuen Link. Sehr große Modelle ergeben sehr lange Links; teilen Sie dann besser die JSON-Datei.

## Schreibgeschützten Viewer einbetten

Hängen Sie `&viewer=1` an einen geteilten Link (oder `?viewer=1` an eine beliebige App-URL), und das Modell öffnet sich im **Viewer-Modus**: Kopfleiste, Fußleiste, Rückgängig/Wiederholen und das Einstellungspanel sind ausgeblendet, nur die Zeichenfläche mit dem Modell bleibt. Diese URL in ein `<iframe>` gesetzt, ergibt ein lebendiges, zoombares Modell in Vorlesungsskripten oder auf Webseiten:

```html
<iframe src="https://run.edubeam.app/?viewer=1&model=…" width="100%" height="400"></iframe>
```

Die Seite [Beispiele](/de/examples/) ist genauso aufgebaut – jede Karte ist ein Link mit `?model=`-Parameter.

## URL-Parameter

| Parameter | Wirkung |
| --- | --- |
| `model=<daten>` | Lädt das kodierte Modell, passt es an den Bildschirm an und entfernt den Parameter aus der Adresszeile. |
| `lang=<code>` | Schaltet die Oberflächensprache um (`en`, `cs`, `de`, `fr`, `es`, `pt`, `pl`, `cn`, `th`, `uk`, `ru`). |
| `viewer=1` | Schreibgeschützter Viewer-Modus (siehe oben). |

## Automatisches Speichern

Aktuelles Modell und Einstellungen werden nach jeder Änderung im lokalen Speicher des Browsers abgelegt und beim nächsten Besuch wiederhergestellt – auch nach dem Schließen des Browsers. Das ist Komfort, keine Sicherung: es ist an ein Browserprofil auf einem Gerät gebunden, und das Löschen der Websitedaten entfernt es. Speichern Sie wichtige Arbeit als Projektdatei.

## Format der Projektdatei

`project.json` ist einfaches, lesbares JSON:

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

Alle Werte sind in **SI-Einheiten** (m, N, Pa, rad) gespeichert, unabhängig von den Anzeigeeinheiten. Randbedingungen verwenden die Freiheitsgrad-IDs `0 = Dx`, `2 = Dz`, `4 = Ry`. Dank des einfachen Formats können Sie Modelle per Skript oder Tabellenkalkulation erzeugen und mit **Projekt öffnen** laden. Das Format ist nicht als stabile API versioniert – prüfen Sie das Feld `version`, wenn Sie darauf automatisieren.
