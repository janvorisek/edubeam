# Import, Export & Teilen

Alles in <Edubeam /> geschieht in Ihrem Browser. Nichts wird auf einen Server hochgeladen: Ein Link enthält buchstäblich das Modell.

## Projekt speichern {#save-a-project}

**☰ → Projekt speichern** oder <kbd>Strg</kbd>+<kbd>S</kbd> lädt `project.json` herunter. Die Datei enthält Knoten, Elemente, Materialien, Querschnitte (mit Polygonformen), Lasten, Bemaßungslinien und die Version der App, die sie geschrieben hat. Sie können die Datei beliebig umbenennen.

## Projekt öffnen {#open-a-project}

- **☰ → Projekt öffnen** oder <kbd>Strg</kbd>+<kbd>O</kbd> und dann eine `.json`-Datei wählen, oder
- **die Datei an eine beliebige Stelle des App-Fensters ziehen**.

Das Öffnen ersetzt das aktuelle Modell, einschließlich Materialien und Querschnitten. Ihr bisheriges Modell geht dabei nicht verloren: <kbd>Strg</kbd>+<kbd>Z</kbd> holt es zurück, und es bleibt unter [Zuletzt verwendete Modelle](#recent-structures) erhalten. Eine Datei, die kein EduBeam-Projekt ist, wird mit einer Meldung abgelehnt, und Ihr Modell bleibt unverändert.

Projektdateien aus allen früheren Versionen von EduBeam lassen sich in der aktuellen öffnen.

## Per Link teilen {#share-a-link}

**Modell teilen** (in der Kopfleiste oder im Menü ☰) öffnet den Dialog *Modell per URL teilen*:

![Der Teilen-Dialog](/screenshots/de/share.webp){.shot-lg}

- **Link kopieren** kopiert den Link in die Zwischenablage. Ein Klick in das Feld bewirkt dasselbe.
- **Link öffnen** öffnet ihn in einem neuen Tab, sodass Sie prüfen können, was der Empfänger sehen wird.
- **Über Systemdialog teilen** übergibt den Link an die Teilen-Funktion Ihres Geräts, sofern der Browser das unterstützt.

Der Link hat die Form `https://run.edubeam.app/?model=…` und kodiert das gesamte Modell. Wer ihn öffnet, erhält eine eigene Kopie zum Bearbeiten; Änderungen werden **nicht** zurücksynchronisiert, senden Sie also einen neuen Link, wenn sich das Modell ändert. Sehr große Modelle ergeben sehr lange Links; teilen Sie in diesem Fall besser die JSON-Datei.

Öffnet jemand einen Link, landet sein bisheriges Modell unter „Zuletzt verwendete Modelle“, und eine Meldung sagt ihm, wo er es findet.

Links aus älteren Versionen funktionieren weiterhin: Ein Link im Vorlesungsskript vom letzten Jahr öffnet heute dasselbe Modell.

## Bild exportieren {#export-an-image}

**☰ → Bild exportieren** oder <kbd>Strg</kbd>+<kbd>P</kbd> öffnet den Bildexport.

![Bild exportieren: Ebenen, Ausschnitt und Größe wählen, dann herunterladen oder kopieren](/screenshots/de/export-image.webp)

- **Ebenen**: Die Chips oben wählen unabhängig von der Ansicht, was gezeichnet wird: Verformungsfigur, N, V, M, Auflagerreaktionen, Lager, Lasten, Knoten- und Elementbeschriftungen.
- **Ausschnitt**: Wählen Sie ein Seitenverhältnis (16:9, 4:3, 3:2, 1:1), **Alles einpassen** oder **Ausschnitt…**, um ein Rechteck über die Zeichnung zu ziehen. Sie können auch die Ränder der Vorschau ziehen.
- **Größe**: Breite und Höhe in Pixeln oder ein **Maßstab** wie 1 : 50 für eine maßstäbliche Zeichnung auf Papier. **Diagrammhöhe** legt die Größe der Ergebnisdiagramme im Bild fest. **Transparenter Hintergrund** lässt das Weiß weg.
- **PNG herunterladen**, **SVG herunterladen** oder **In Zwischenablage kopieren**.

SVG bleibt in jeder Größe scharf und funktioniert in Word, Inkscape und LaTeX auf Overleaf; damit ist es die beste Wahl für Berichte und Abschlussarbeiten.

## Ergebnisse exportieren {#export-the-results}

**Ergebnisse → CSV exportieren** lädt beide Ergebnistabellen einschließlich der Auflagerreaktionen herunter, und **Kopieren** legt sie für eine Tabellenkalkulation in die Zwischenablage. Siehe [CSV exportieren und Kopieren](/de/essentials/results#export-csv-and-copy).

## Zuletzt verwendete Modelle {#recent-structures}

**☰ → Zuletzt verwendete Modelle** bewahrt die letzten 10 Modelle auf, die gelöscht oder durch einen Link, eine Datei, ein Beispiel oder die Aufgabe „Erster Balken“ ersetzt wurden. Jedes zeigt ein Vorschaubild, den Grund für das Ersetzen und seine Größe. **Wiederherstellen** holt eines zurück; das Modell, das Sie gerade hatten, kommt dann seinerseits in die Liste, und <kbd>Strg</kbd>+<kbd>Z</kbd> macht die Wiederherstellung rückgängig.

![Zuletzt verwendete Modelle](/screenshots/de/recent.webp){.shot-lg}

Die Liste wird nur in diesem Browser gespeichert.

## Beispiele {#examples}

**☰ → Beispiele** öffnet eine Galerie fertiger Lehrmodelle. Das Öffnen eines Beispiels ersetzt Ihr Modell, und <kbd>Strg</kbd>+<kbd>Z</kbd> holt Ihres zurück. Dieselben Modelle finden Sie mit Übungen auf der Seite [Beispiele](/de/examples/) dieser Anleitung.

![Die Beispielgalerie](/screenshots/de/examples.webp){.shot-lg}

## Viewer einbetten {#embed-a-read-only-viewer}

Hängen Sie `&viewer=1` an einen Link an, um das Modell im **Viewer-Modus** zu öffnen. Kopfleiste, untere Leiste, Reiter, Rückgängig und Wiederholen, die Raster-Chips und der Achsenindikator sind ausgeblendet; es bleiben die Zeichenfläche, die Schaltflächen zum Anpassen und Zentrieren und die Anzeigeoptionen. Setzen Sie diese URL in einen `<iframe>`, um ein lebendiges, zoombares Modell in Vorlesungsunterlagen oder eine Webseite einzubetten:

```html
<iframe src="https://run.edubeam.app/?viewer=1&model=…" width="100%" height="400"></iframe>
```

![Der Dreigelenkrahmen im Viewer-Modus](/screenshots/de/viewer-mode.webp){.shot-lg}

Der Viewer-Modus ist zum Anschauen gedacht, aber nicht gesperrt: Besucher können weiterhin Knoten ziehen und Diagramme umschalten. Das Öffnen eines Viewer-Links ersetzt außerdem das eigene Modell des Besuchers in diesem Browser (es landet unter „Zuletzt verwendete Modelle“), genau wie ein normaler Link.

## URL-Parameter {#url-parameters}

| Parameter | Wirkung |
| --- | --- |
| `model=<data>` | Lädt das kodierte Modell und passt es an den Bildschirm an. |
| `viewer=1` | Viewer-Modus (siehe oben). |
| `lang=<code>` | Schaltet die Oberflächensprache um: `en`, `cs`, `de`, `fr`, `es`, `pt`, `pl`, `cn`, `th`, `uk`, `ru`, `tr`. |
| `panel=examples` | Öffnet sofort die Beispielgalerie. |

Nach dem Auslesen entfernt EduBeam die Parameter aus der Adresszeile.

## Automatisches Speichern {#automatic-persistence}

Das aktuelle Modell und Ihre Einstellungen werden nach jeder Änderung im lokalen Speicher des Browsers abgelegt und beim nächsten Besuch wiederhergestellt, auch nach dem Schließen des Browsers. Das ist eine Annehmlichkeit, keine Sicherung: Der Speicher gehört zu einem Browserprofil auf einem Gerät, und das Löschen der Websitedaten entfernt ihn. Speichern Sie wichtige Arbeit als Projektdatei.

## Format der Projektdatei {#project-file-format}

`project.json` ist einfaches, lesbares JSON:

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

Das ist der Balken aus dem Schnellstart. Alle Werte sind in **SI-Einheiten** (m, N, Pa, rad) gespeichert, unabhängig von den Anzeigeeinheiten. Koordinaten sind `[x, y, z]`, mit y stets 0. Randbedingungen und Lastkomponenten verwenden die Freiheitsgrad-IDs `0 = Dx`, `2 = Dz`, `4 = Ry`.

| Elementlast `type` | Werte |
| --- | --- |
| `udl` | `values: [fx, fz]` in N/m |
| `trapezoidal` | `startValues: [f1x, f1z]`, `endValues: [f2x, f2z]` in N/m, lokale Achsen |
| `concentrated` | `values: [Fx, Fz, My, a]` in N, N·m und m ab dem Anfangsknoten |
| `temperature` | `values: [ΔTc, ΔTb, ΔTt]` in K; der Gradient ist ΔTb − ΔTt |

Knotenlasten haben die Form `{ "target": "2", "values": { "0": Fx, "2": Fz, "4": My } }`, vorgegebene Verschiebungen `{ "target": "2", "prescribedValues": { "0": Dx, "2": Dz, "4": Ry } }`; geben Sie jeweils alle drei Komponenten an. Von der App geschriebene Dateien enthalten außerdem ein `date`, einen `commit`, ein knotenbezogenes `lcs` und Polygonformen `shape`.

Da das Format einfach ist, können Sie Modelle per Skript oder Tabellenkalkulation erzeugen und mit **Projekt öffnen** laden.
