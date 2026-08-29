# Knoten & Lager

Knoten sind die Punkte des Modells. Elemente verbinden Knoten; Lager und Knotenlasten greifen an Knoten an.

## Koordinaten

Jeder Knoten hat eine **X**- und eine **Z**-Koordinate in der aktuellen Längeneinheit. Die x-Achse zeigt nach rechts, die **z-Achse zeigt auf dem Bildschirm nach unten** – eine Stütze vom Boden nach oben verläuft also von `Z = 0` nach `Z = −3`, nicht `+3`. Der Achsenindikator in der Ecke des Rasters zeigt die aktuelle Orientierung. Siehe [Koordinatensystem & Vorzeichenkonvention](/de/elements/conventions).

## Knoten hinzufügen

| Methode | Vorgehen |
| --- | --- |
| **Dialog** | Reiter *Knoten* → **Knoten hinzufügen**, oder Rechtsklick auf die Zeichenfläche → *Knoten hinzufügen*. X und Z eingeben. |
| **Maus** | Reiter *Knoten* → **Per Maus hinzufügen** (oder <kbd>Strg</kbd> halten bei *Knoten hinzufügen* im Menü der Zeichenfläche), dann auf die Fläche klicken. Jeder Klick setzt einen Knoten; <kbd>Esc</kbd> beendet den Modus. |
| **Beim Zeichnen von Elementen** | Im Modus *Element hinzufügen → Per Maus hinzufügen* erzeugt ein Klick auf leere Fläche einen neuen Knoten und verbindet ihn. |
| **Kopieren & Einfügen** | Knoten (und Elemente) auswählen, <kbd>Strg</kbd>+<kbd>C</kbd>, <kbd>Strg</kbd>+<kbd>V</kbd>, dann an die Zielposition klicken. |

Bezeichnungen werden automatisch vergeben (`1`, `2`, …) und können in der Tabelle geändert werden.

### Rasterfang

Mit aktivem **Am Raster ausrichten** (<kbd>S</kbd> oder Chip **S**) landen per Maus gesetzte oder gezogene Knoten auf Vielfachen der **Raster-Schrittweite** (Standard `0,1 m`, änderbar unter *Einstellungen → Anzeigeeinstellungen → Raster*). Schalten Sie den Rasterfang für freie Platzierung aus oder tragen Sie exakte Koordinaten anschließend in der Tabelle ein.

### Knoten auf ein bestehendes Element setzen

Klicken Sie beim Hinzufügen eines Knotens näher als ~0,1 m an ein Element, fragt EduBeam nach:

- **Mit Struktur verbinden** – das Element wird in zwei geteilt (`1a` und `1b`), Gelenke an den äußeren Enden bleiben erhalten und eine Streckenlast wird auf beide Hälften aufgeteilt. Der schnellste Weg zu einem Zwischenauflager oder einem Lastangriffspunkt.
- **Einzelnen Knoten platzieren** – der Knoten wird auf dem Element erzeugt, aber nicht mit ihm verbunden.

## Knoten bearbeiten

- **Tabelle:** Bezeichnung, X und Z direkt bearbeiten.
- **Ziehen:** Knoten in der Ansicht verschieben (rückgängig machbar). Auf Touchscreens den Knoten lange drücken und dann ziehen.
- **Dialog Knoten bearbeiten:** Koordinaten, Lagerung und LKS-Winkel an einer Stelle, mit Live-Vorschau des Lagersymbols.
- **Löschen:** Papierkorb in der Tabelle, *Löschen* im Kontextmenü des Knotens oder Auswahl und <kbd>Entf</kbd>. Mit dem Knoten werden auch die angeschlossenen Elemente und Lasten gelöscht.

## Lager

Ein Lager ist nichts anderes als eine Menge gehaltener Freiheitsgrade. Jeder Knoten hat drei:

| Freiheitsgrad | Bedeutung |
| --- | --- |
| **Dx** | Verschiebung in x-Richtung (horizontal) |
| **Dz** | Verschiebung in z-Richtung (vertikal) |
| **Ry** | Verdrehung um die y-Achse (in der Tragwerksebene) |

Haken Sie die Kästchen in der Spalte **Gelagerte Freiheitsgrade** des Reiters *Knoten*, im Menü **Knotenlagerung** eines ausgewählten Knotens oder im Dialog *Knoten bearbeiten* an. Das Symbol in der Ansicht folgt der Kombination:

| Gehalten | Lager | Symbol |
| --- | --- | --- |
| Dx + Dz + Ry | Einspannung | schraffierter Block |
| Dx + Dz | Festlager (zweiwertig) | Dreieck |
| Dz | Loslager, horizontal verschieblich (einwertig) | Dreieck auf Rollen |
| Dx | Loslager, vertikal verschieblich | gedrehtes Rollenlager |
| Dz + Ry | Schiebehülse / Parallelführung (vertikale Führung) | Einspannung auf Rollen |
| Dx + Ry | Schiebehülse (horizontale Führung) | gedrehte Schiebehülse |
| Ry | Nur Verdrehung gehalten | Drehfesthaltung |
| keine | Freier Knoten | — |

Für jeden gehaltenen Freiheitsgrad wird eine Auflagerreaktion berechnet – und gezeichnet.

::: tip Fachwerkknoten
Fachwerkstäbe sind Balkenelemente mit **beiden Endgelenken** freigegeben (siehe [Elemente](/de/essentials/elements#endgelenke)). Am Fachwerkknoten ist ein Festlager (Dx + Dz) die übliche Wahl; halten Sie **nicht** Ry an einem Knoten, an dem alle angeschlossenen Elemente gelenkig sind – sonst ist die Verdrehung dieses Knotens unbestimmt.
:::

### Schräge Lager

Setzen Sie den **Knoten-LKS-Winkel** (Grad, −180…180) im Kontextmenü des Knotens oder im Dialog *Knoten bearbeiten*. Die lokalen Achsen des Knotens werden um diesen Winkel gedreht und die gehaltenen Freiheitsgrade im gedrehten System ausgewertet – ein Loslager auf einer 30°-Böschung ist also `Dz` mit LKS-Winkel `30`. Das Lagersymbol dreht sich mit, und die Reaktion wird in der gedrehten Richtung ausgegeben.

### Stabilität

Der Solver braucht insgesamt mindestens **drei gehaltene Freiheitsgrade** und ein Tragwerk ohne kinematische Kette. Fehlende oder unzureichende Lagerung führt zur Meldung *Model needs at least 3 constrained DOFs…* oder schlicht zu keinen Ergebnissen. Siehe [Fehlerbehebung](/de/reference/troubleshooting).

## Knotenlasten und Auflagersenkungen

Kräfte, Momente und vorgegebene Verschiebungen (Auflagersenkungen) greifen an Knoten an – siehe [Lasten](/de/essentials/loads#knotenlasten).

## Bemaßungslinien

Rechtsklick auf die Zeichenfläche → **Bemaßung hinzufügen** zeichnet eine Maßlinie zwischen zwei Punkten. Endpunkte rasten beim Ziehen an nahen Knoten ein; wählen Sie die Linie und nutzen Sie **Bearbeiten** für Koordinaten oder **Bemaßung umkehren**, um die Beschriftung auf die andere Seite zu legen. Bemaßungen sind rein grafisch und werden mit dem Projekt gespeichert.
