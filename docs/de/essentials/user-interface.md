# Benutzeroberfläche

<Edubeam /> besteht aus drei Bereichen: der **Kopfleiste** oben, der **Ansicht** in der Mitte, in der Sie zeichnen, und der **unteren Leiste** mit einer Tabelle für jede Objektart. Wer weiß, was wo liegt, versteht auch den Rest dieser Anleitung.

![Die Bereiche der Oberfläche, nummeriert wie in der Liste unten](/screenshots/de/ui-overview.webp)

1. **Menü ☰**: öffnen, speichern, teilen und exportieren; Beispiele und geführte Touren.
2. **Schaltflächen der Kopfleiste**: Modell löschen und Modell teilen.
3. **Rückgängig / Wiederholen** für jede Änderung am Modell.
4. **Schaltflächen der Ansicht**: zentrieren, an den Bildschirm anpassen und der Schalter für die Anzeigeoptionen.
5. **Anzeigeoptionen**: welche Ergebnisse und Modellteile gezeichnet werden.
6. **Raster, Fangen, Fadenkreuz und Einheiten.**
7. **Reiter der unteren Leiste**: Knoten, Elemente, Lasten, Materialien, Querschnitte, Ergebnisse.
8. **Die Tabelle** des geöffneten Reiters, in der sich jeder Wert bearbeiten lässt.

::: tip Machen Sie den Rundgang
**☰ → Rundgang starten** zeigt Ihnen diese Bereiche direkt in der App, einen nach dem anderen.
:::

![Rundgang starten, beim Schritt zu den Anzeigeoptionen](/screenshots/de/tour.webp)

## Kopfleiste {#app-bar}

| Bedienelement | Funktion |
| --- | --- |
| **Menü ☰** | Das Hauptmenü, siehe unten. |
| **Modell löschen** | Löscht nach einer Bestätigung alle Knoten, Elemente und Lasten. Zwei Kontrollkästchen löschen zusätzlich die Materialien und Querschnitte. <kbd>Strg</kbd>+<kbd>Z</kbd> holt das Modell zurück, und es bleibt unter „Zuletzt verwendete Modelle“ erhalten. |
| **Modell teilen** | Öffnet den [Teilen-Dialog](/de/essentials/import-export#share-a-link) mit einem Link, der das ganze Modell enthält. |
| **Was gibt's Neues?** | Versionshinweise. Sie öffnen sich nach einem Update auch einmal von selbst. |
| **Dokumentation** / GitHub | Diese Anleitung und der Quellcode. |

Auf einem Smartphone passen nur das Menü ☰ und Dokumentation in die Leiste; alles andere steht im Menü.

### Das Menü ☰ {#the-☰-menu}

![Das Menü ☰](/screenshots/de/ui-app-menu.webp){.shot-xs}

| Eintrag | Funktion |
| --- | --- |
| **Projekt öffnen** / **Projekt speichern** | Eine Datei `project.json` öffnen oder herunterladen (<kbd>Strg</kbd>+<kbd>O</kbd> / <kbd>Strg</kbd>+<kbd>S</kbd>). |
| **Zuletzt verwendete Modelle** | Die letzten 10 Modelle, die Sie gelöscht oder ersetzt haben, bereit zum Wiederherstellen. |
| **Bild exportieren** | Die Zeichnung als PNG oder SVG speichern oder kopieren (<kbd>Strg</kbd>+<kbd>P</kbd>). |
| **Modell teilen** | Wie die Schaltfläche in der Kopfleiste. |
| **Beispiele** | Die Galerie mit fertigen Modellen. |
| **Ersten Balken zeichnen** | Eine geführte Aufgabe in sieben Schritten. |
| **Rundgang starten** | Der Rundgang durch die Oberfläche. |
| **Modell löschen** | Wie die Schaltfläche in der Kopfleiste. |

Unten im Menü stehen die App-Version und ihr Veröffentlichungsdatum.

## Ansicht {#viewer}

Auf der Zeichenfläche zeichnen und untersuchen Sie das Modell. Alles andere in der App folgt dem, was Sie hier auswählen.

### Schaltflächen auf der Zeichenfläche {#buttons-on-the-canvas}

- **Oben links:** **Rückgängig** und **Wiederholen** (<kbd>Strg</kbd>+<kbd>Z</kbd> / <kbd>Strg</kbd>+<kbd>Umschalt</kbd>+<kbd>Z</kbd>). Jede Änderung am Modell – Hinzufügen, Bearbeiten, Ziehen, Löschen und Leeren – lässt sich rückgängig machen.
- **Oben rechts:** **Inhalt zentrieren** (<kbd>C</kbd>), **Inhalt an Bildschirm anpassen** (<kbd>F</kbd>) und die Schaltfläche ⚙, die die Anzeigeoptionen ein- oder ausblendet. Auf Touchscreens gibt es außerdem die **Rechteckauswahl**.
- **Unten rechts:** **G** schaltet das Raster ein und aus, **S** das Ausrichten am Raster, die Fadenkreuz-Schaltfläche zeigt die Zeigerposition auf den Linealen, und der **Einheiten-Chip** öffnet die Einstellungen bei *Sprache & Region*.

### Anzeigeoptionen {#display-options}

![Die Schaltflächen der Ansicht und die Anzeigeoptionen](/screenshots/de/ui-display-settings.webp){.shot-lg}

Zwei Reihen Kontrollkästchen, standardmäßig geöffnet:

- **Ergebnisse:** *Verformte Form*, *N (x)*, *V<sub>z</sub> (x)*, *M<sub>y</sub> (x)*, *Auflagerreaktionen*. Verformte Form, M und Auflagerreaktionen sind zu Beginn angehakt.
- **Modell:** *Lager*, *Lasten*, *Knotenbeschriftung*, *Elementbeschriftung*.

**Weitere Einstellungen** öffnet die vollständigen [Einstellungen](/de/essentials/units-settings) bei *Anzeigeeinstellungen*.

### Navigation {#navigating}

| Aktion | Maus | Touch |
| --- | --- | --- |
| Zoomen | Mausrad (zum Cursor hin), <kbd>Strg</kbd>+<kbd>=</kbd> / <kbd>Strg</kbd>+<kbd>-</kbd> | Zwei Finger auseinander- oder zusammenziehen |
| Verschieben | Ziehen mit der **mittleren oder rechten** Maustaste (siehe *Einstellungen → Steuerung & Tastenkürzel*) | Ziehen mit einem Finger |
| Anpassen / zentrieren | <kbd>F</kbd> / <kbd>C</kbd> oder die Schaltflächen oben rechts | Die Schaltflächen oben rechts |

### Auswählen und Bearbeiten {#selecting-and-editing}

**Klicken** Sie auf einen Knoten, ein Element, eine Last oder eine Bemaßungslinie, um sie auszuwählen. Daneben öffnet sich ein Panel mit den Details und den passenden Aktionen: Last hinzufügen, Lager festlegen, bearbeiten, Steifigkeitsmatrix anzeigen, löschen. Ein Klick auf einen Knoten schaltet die untere Leiste außerdem auf den Reiter Knoten um.

<div class="shots">

![Ein Knoten: Last hinzufügen, Lager festlegen, Verschiebung vorgeben](/screenshots/de/ui-node-menu.webp)

![Ein Element: bearbeiten, Last hinzufügen, Steifigkeitsmatrix](/screenshots/de/ui-element-menu.webp)

</div>

- **Ziehen auf leerer Zeichenfläche** zeichnet ein Auswahlrechteck. Alles darin wird ausgewählt: Knoten, Elemente, ihre Lasten und Bemaßungslinien. Drücken Sie <kbd>Entf</kbd>, um alles zu entfernen, oder <kbd>Strg</kbd>+<kbd>C</kbd> / <kbd>Strg</kbd>+<kbd>V</kbd>, um es an eine andere Stelle zu kopieren.
- **Ziehen Sie einen Knoten**, um ihn zu verschieben. Mit aktivem Fangen landet er auf dem Raster. Angeschlossene Elemente und ihre Lasten folgen.
- **Doppelklicken Sie auf eine Last**, um sie zu bearbeiten.
- **Zeigen Sie mit der Maus** auf ein Objekt, um einen Tooltip zu sehen. Knoten zeigen ihre Verschiebungen und Verdrehung, Elemente ihr Material und ihren Querschnitt, Lasten ihre Werte. Auf einem Touchscreen tippen Sie stattdessen: Dieselben Details erscheinen im Auswahlpanel.

![Zeigen auf einen Knoten zeigt seine Verschiebungen und Verdrehung](/screenshots/de/ui-hover.webp){.shot-sm}

**Rechtsklicken Sie auf die Zeichenfläche** (oder halten Sie auf einem Touchscreen gedrückt), um das Menü der Zeichenfläche zu öffnen. Halten Sie <kbd>Strg</kbd> gedrückt, während Sie *Knoten hinzufügen* oder *Element hinzufügen* wählen, um sie mit der Maus statt per Dialog zu platzieren. Über einem Element bietet das Menü außerdem *Element … bemaßen* an.

![Das Menü der Zeichenfläche](/screenshots/de/ui-canvas-menu.webp){.shot-sm}

Alle Tastenkürzel stehen auf der Seite [Tastatur, Maus & Touch](/de/reference/shortcuts).

### Wenn das Modell nicht berechnet werden kann {#when-the-model-cannot-be-solved}

Meldungen erscheinen oben links in der Ansicht:

- *Keine Materialien definiert.* / *Keine Querschnitte definiert.*, mit einer Schaltfläche **Neu hinzufügen**.
- Ein kleiner blauer Chip **Lager fehlen**, solange das Modell einfach noch nicht fertig ist.
- Eine **rote Meldung**, wenn etwas nicht stimmt, mit **Details anzeigen**, das jedes Problem auflistet.

Kann sich das Tragwerk noch bewegen, lässt EduBeam es als gestrichelte Kontur schwingen und kreist die verantwortlichen Knoten oder Gelenke ein. Zeigen Sie auf die Meldung, um die Bewegung erneut zu sehen, oder blenden Sie sie mit der Augen-Schaltfläche aus.

![Ein Rahmen mit Gelenken in B und C ist ein Mechanismus: EduBeam zeigt, wie er sich bewegt](/screenshots/de/ui-mechanism.webp)

![Details anzeigen listet jedes Problem mit einem Hinweis auf](/screenshots/de/ui-diagnostics.webp){.shot-lg}

Die [Fehlerbehebung](/de/reference/troubleshooting) erklärt jede Meldung.

## Untere Leiste {#bottom-bar}

Sechs Reiter, jeweils mit Werkzeugleiste und editierbarer Tabelle. Die Reiter zeigen, wie viele Objekte jeder Art das Modell enthält. Das **?** rechts erklärt den geöffneten Reiter, ebenso das **?** neben manchen Spaltenüberschriften. Ziehen Sie die Reiterleiste nach oben oder unten, um die Höhe der Leiste zu ändern, oder minimieren Sie sie mit der Schaltfläche rechts.

| Reiter | Werkzeugleiste | Tabelle |
| --- | --- | --- |
| **Knoten** | Knoten hinzufügen (Dialog), Knoten hinzufügen (Maus) | Bezeichnung, Koordinaten, **Gelagerte Freiheitsgrade** (Lagersymbol, Dx, Dz, Ry, Lagerwinkel α), Lasten, Bearbeiten, Löschen |
| **Elemente** | Element hinzufügen (Dialog), Element hinzufügen (Maus) | Bezeichnung, Typ, Knoten (mit Tausch-Schaltfläche), Material, Querschnitt, **Endgelenke**, Lasten, Steifigkeitsmatrix, Löschen |
| **Lasten** | Knotenlast hinzufügen, Elementlast hinzufügen | Typ, Angriffspunkt, editierbare Komponenten, Bearbeiten, Löschen |
| **Materialien** | Material hinzufügen, Materialbibliothek | Bezeichnung, E, G, α<sub>T</sub>, Löschen |
| **Querschnitte** | Querschnitt hinzufügen, Querschnittsbibliothek, Polygonaler Querschnitt | Form, Bezeichnung, A, I<sub>y</sub>, h, k, Form bearbeiten, Löschen |
| **Ergebnisse** | Knotenergebnisse, Elementergebnisse, CSV exportieren, Kopieren | Verschiebungen und Verdrehungen je Knoten oder Stabendkräfte je Element |

Bearbeiten Sie eine Zelle direkt: klicken, tippen und dann <kbd>Enter</kbd> drücken (oder <kbd>Esc</kbd>, um die Zelle zu verlassen). Werte werden in den [aktuellen Einheiten](/de/essentials/units-settings) angezeigt und eingegeben.

## Reiter über der Ansicht {#tabs-above-the-viewer}

**Ansicht** zeigt die Zeichenfläche. **Einstellungen** zeigt die Einstellungen in voller Größe, sodass Sie Farben oder Einheiten ändern und zurückschalten können, um die Wirkung zu sehen. Der Einheiten-Chip und *Weitere Einstellungen* öffnen dieselben Einstellungen als Dialog über dem Modell.

## Schwebende Fenster {#floating-windows}

**Steifigkeitsmatrix** (aus dem Panel eines Elements oder der Tabelle Elemente) öffnet ein Fenster mit der 6 × 6-Steifigkeitsmatrix des Elements in globalen Koordinaten. **Bearbeiten** im Menü der Zeichenfläche öffnet eine Tabelle der aktuellen Auswahl. Verschieben Sie die Fenster an ihrer Titelleiste und schließen Sie sie mit dem ×.
