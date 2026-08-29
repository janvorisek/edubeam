# Benutzeroberfläche

<Edubeam /> besteht aus drei Bereichen. Wer weiß, was wo liegt, versteht auch den Rest der Dokumentation.

```
┌──────────────────────────────────────────────────────────────┐
│ ☰  edubeam     🗑 Modell löschen  🔗 Modell teilen  Neues     │  ← Kopfleiste
├──────────────────────────────────────────────────────────────┤
│ Ansicht | Einstellungen                                      │  ← Reiter
│ ↶ ↷                                        ⌖  ⤢  ⚙            │
│                                                              │
│                  Zeichenfläche (das Modell)     [Anzeige-    │  ← Ansicht
│                                                  schalter]   │
│                                       G  S  m·kN·kNm·MPa     │
├──────────────────────────────────────────────────────────────┤
│ Knoten | Elemente | Lasten | Materialien | Querschnitte | Ergebnisse │  ← Fußleiste
│ [Knoten hinzufügen] [Per Maus hinzufügen]   Tabelle …        │
└──────────────────────────────────────────────────────────────┘
```

## Kopfleiste

| Bedienelement | Funktion |
| --- | --- |
| **☰ Menü** | **Projekt öffnen**, **Projekt speichern**, **Modell teilen**, **Modell löschen** sowie die App-Version. |
| **Modell löschen** 🗑 | Löscht nach Bestätigung alle Knoten, Elemente und Lasten. Zwei Kontrollkästchen erlauben, auch Materialien und Querschnitte zu löschen. Nicht rückgängig zu machen. |
| **Modell teilen** 🔗 | Öffnet den [Teilen-Dialog](/de/essentials/import-export#per-link-teilen) mit einer URL, die das gesamte Modell enthält. |
| **Was gibt's Neues?** | Versionshinweise. |
| **Dokumentation** / GitHub | Links zu dieser Seite und zum Quellcode. |

Im [Viewer-Modus](/de/essentials/import-export#schreibgeschutzten-viewer-einbetten) ist die Kopfleiste ausgeblendet.

## Ansicht

Die Zeichenfläche, auf der Sie zeichnen und das Modell untersuchen. Alles andere in der App folgt dem, was Sie hier auswählen.

### Schaltflächen auf der Zeichenfläche

- **Oben links:** **Rückgängig** / **Wiederholen** (auch <kbd>Strg</kbd>+<kbd>Z</kbd> / <kbd>Strg</kbd>+<kbd>Umschalt</kbd>+<kbd>Z</kbd>). Jede Modelländerung – Hinzufügen, Bearbeiten, Ziehen, Löschen – lässt sich rückgängig machen.
- **Oben rechts:** **Zentrieren** (<kbd>C</kbd>), **An Bildschirm anpassen** (<kbd>F</kbd>) und der Schalter für die **Anzeigeeinstellungen** ⚙.
- **Unten rechts:** **G** schaltet das Raster, **S** das Ausrichten am Raster; der **Einheiten-Chip** zeigt die aktiven Einheiten und öffnet per Klick die Einstellungen.

### Anzeigepanel

Öffnen mit ⚙. Zwei Reihen Kontrollkästchen:

- **Ergebnisse:** *Verformte Form*, *N (x)*, *V<sub>z</sub> (x)*, *M<sub>y</sub> (x)*, *Auflagerreaktionen*.
- **Modell:** *Lager*, *Lasten*, *Knotenbeschriftung*, *Elementbeschriftung*.

**Weitere Einstellungen** öffnet den vollständigen [Einstellungsdialog](/de/essentials/units-settings).

### Navigation

| Aktion | Maus / Touch |
| --- | --- |
| Zoom | Mausrad (zoomt zum Cursor), <kbd>Strg</kbd>+<kbd>=</kbd> / <kbd>Strg</kbd>+<kbd>-</kbd>; auf Touchscreens Pinch-Geste |
| Verschieben | Ziehen mit **mittlerer oder rechter** Maustaste (einstellbar unter *Einstellungen → Steuerung & Tastenkürzel*); auf Touchscreens Ziehen mit einem Finger |
| Anpassen / Zentrieren | <kbd>F</kbd> / <kbd>C</kbd> oder die Schaltflächen oben rechts |

### Auswählen und Bearbeiten

- **Klick** auf Knoten, Element, Last oder Bemaßungslinie wählt das Objekt aus. Die Fußleiste springt zum passenden Reiter und neben der Auswahl erscheint ein kleines **Kontextmenü** mit den verfügbaren Aktionen (z. B. *Last hinzufügen*, *Knotenlagerung*, *Element bearbeiten*, *Steifigkeitsmatrix*, *Löschen*).
- **Ziehen auf leerer Fläche** zeichnet ein Auswahlrechteck. Alles darin – Knoten, Elemente, ihre Lasten und Bemaßungslinien – wird ausgewählt. <kbd>Entf</kbd> löscht alles, <kbd>Strg</kbd>+<kbd>C</kbd> / <kbd>Strg</kbd>+<kbd>V</kbd> kopiert und fügt an anderer Stelle ein.
- **Knoten ziehen** verschiebt ihn. Mit aktivem Rasterfang landet er auf dem Raster. Angeschlossene Elemente und ihre Lasten folgen.
- **Doppelklick auf eine Last** öffnet die Bearbeitung.
- **Mauszeiger** über einem Objekt zeigt einen Tooltip: Knoten ihre Verschiebungen und Verdrehung, Elemente Material und Querschnitt, Lasten ihre Komponenten.
- **Rechtsklick auf leere Fläche** öffnet das Menü der Zeichenfläche: *Knoten hinzufügen*, *Element hinzufügen*, *Bemaßung hinzufügen*, *Bearbeiten* (öffnet eine Tabelle der aktuellen Auswahl), *Kopieren*, *Einfügen*, *Löschen*. Halten Sie <kbd>Strg</kbd> bei *Knoten hinzufügen* / *Element hinzufügen*, um sie mit der Maus statt per Dialog zu platzieren.

Alle Tastenkürzel stehen auf der Seite [Tastatur & Maus](/de/reference/shortcuts).

### Hinweise

Oben links in der Ansicht erscheinen Meldungen, wenn etwas nicht stimmt: *Keine Materialien definiert.* / *Keine Querschnitte definiert.* (mit Schaltfläche **Neu hinzufügen**) oder *Model has N error(s)* mit der Schaltfläche **Show details**, die alle Probleme auflistet. Siehe [Fehlerbehebung](/de/reference/troubleshooting).

## Fußleiste

Sechs Reiter, jeweils mit Zähler, Werkzeugleiste und editierbarer Tabelle. Ziehen Sie am Trenner über der Leiste, um ihre Höhe zu ändern, oder minimieren Sie sie mit der Schaltfläche rechts.

| Reiter | Werkzeugleiste | Tabelle |
| --- | --- | --- |
| **Knoten** | Knoten hinzufügen (Dialog), Per Maus hinzufügen | Bezeichnung, X, Z, Kästchen **Gelagerte Freiheitsgrade**, Lasten am Knoten, Löschen |
| **Elemente** | Element hinzufügen (Dialog), Per Maus hinzufügen | Bezeichnung, Typ, Anfangs-/Endknoten (+ *Knotenreihenfolge tauschen*), Material, Querschnitt, **Endgelenke**, Lasten am Element, Steifigkeitsmatrix, Löschen |
| **Lasten** | Knotenlast hinzufügen, Elementlast hinzufügen | Typ, Angriffspunkt, editierbare Komponenten, Löschen |
| **Materialien** | Material hinzufügen, Materialbibliothek | Bezeichnung, E, G, α<sub>T</sub>, Löschen |
| **Querschnitte** | Querschnitt hinzufügen, Querschnittsbibliothek | Bezeichnung, A, I<sub>y</sub>, h, k, Löschen |
| **Ergebnisse** | Umschalter Knotenergebnisse / Elementergebnisse | Verschiebungen und Verdrehungen je Knoten bzw. Stabendkräfte je Element |

Zellen werden direkt in der Tabelle bearbeitet – klicken, tippen, mit <kbd>Enter</kbd> bestätigen (oder <kbd>Esc</kbd>, um die Zelle zu verlassen). Werte werden in den [aktuellen Einheiten](/de/essentials/units-settings) angezeigt und eingegeben.

## Reiter über der Ansicht

Der Reiter **Ansicht** ist immer vorhanden. Das Öffnen der Einstellungen fügt daneben einen schließbaren Reiter **Einstellungen** hinzu, sodass Sie Farben oder Einheiten ändern und dabei das Modell im Blick behalten.

## Schwebende Fenster

Einige Aktionen öffnen verschiebbare Fenster über der Ansicht: **Steifigkeitsmatrix** (aus dem Kontextmenü eines Elements oder der Tabellenzeile) zeigt die 6 × 6-Steifigkeitsmatrix des Elements in lokalen und globalen Koordinaten; **Bearbeiten** aus dem Menü der Zeichenfläche öffnet eine Tabelle der aktuellen Auswahl. Schließen mit ×.
