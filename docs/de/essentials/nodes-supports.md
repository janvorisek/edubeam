# Knoten & Lager

Knoten sind die Punkte des Modells. Elemente verbinden Knoten, und Lager sowie Knotenlasten greifen an Knoten an.

## Koordinaten {#coordinates}

Jeder Knoten hat eine **X**- und eine **Z**-Koordinate in der aktuellen Längeneinheit. Die x-Achse zeigt nach rechts und die **z-Achse auf dem Bildschirm nach unten**; eine Stütze, die vom Boden aufsteigt, verläuft also von `Z = 0` nach `Z = −3`, nicht nach `+3`. Der Achsenindikator in der Ecke des Rasters zeigt die Orientierung. Wenn Ihnen eine nach oben zeigende vertikale Achse lieber ist, wechseln Sie in den Einstellungen zu [Achsen mit y nach oben](/de/elements/conventions#y-up-axes).

## Knoten hinzufügen {#adding-nodes}

| Methode | Vorgehen |
| --- | --- |
| **Dialog** | Reiter *Knoten* → die erste Schaltfläche **Knoten hinzufügen** oder Rechtsklick auf die Zeichenfläche → *Knoten hinzufügen*. Geben Sie X und Z ein, optional auch die Lager und den Lagerwinkel. |
| **Maus** | Reiter *Knoten* → die zweite Schaltfläche **Knoten hinzufügen** (Mauszeiger-Symbol) oder <kbd>Strg</kbd> gedrückt halten, während Sie im Menü der Zeichenfläche *Knoten hinzufügen* wählen. Jeder Klick auf die Zeichenfläche fügt einen Knoten hinzu. Mit <kbd>Esc</kbd> oder **Abbrechen** beenden Sie den Modus. |
| **Beim Zeichnen von Elementen** | Im Mausmodus für Elemente erzeugt ein Klick auf leere Zeichenfläche einen Knoten und verbindet ihn. |
| **Kopieren & Einfügen** | Knoten (und Elemente) auswählen, <kbd>Strg</kbd>+<kbd>C</kbd> und <kbd>Strg</kbd>+<kbd>V</kbd> drücken und dann dorthin klicken, wo die Kopie hin soll – oder einen Versatz Δx, Δz eingeben und **Einfügen** drücken. |

<div class="shots">

![Der Dialog Knoten hinzufügen](/screenshots/de/qs-node.webp)

![Im Mausmodus legt ein Banner oben die Lager und den Winkel jedes gesetzten Knotens fest](/screenshots/de/nodes-add-banner.webp)

</div>

Bezeichnungen werden automatisch vergeben (`1`, `2`, … oder in Fortsetzung Ihres eigenen Schemas, z. B. `A`, `B`) und lassen sich in der Tabelle umbenennen.

### Fangen {#snapping}

Ist **Am Raster ausrichten** aktiv (<kbd>S</kbd> oder der Chip **S**), landen Knoten, die Sie setzen oder ziehen, auf Vielfachen der **Raster-Schrittweite**: standardmäßig 0,1 m bzw. 0,5 ft in US-Einheiten. Ändern Sie sie unter *Einstellungen → Anzeigeeinstellungen → Raster*. Schalten Sie das Fangen für freie Platzierung aus oder tragen Sie anschließend exakte Koordinaten in der Tabelle ein.

### Knoten auf ein bestehendes Element setzen {#placing-a-node-on-an-existing-element}

Klicken Sie beim Hinzufügen eines Knotens nahe an ein Element, fragt EduBeam nach, was Sie meinen:

- **Mit Struktur verbinden** teilt das Element in zwei (`1a` und `1b`). Gelenke an den äußeren Enden bleiben erhalten, und gleichmäßige sowie trapezförmige Lasten werden auf die beiden Hälften aufgeteilt; Einzel- und Temperaturlasten gehen an die erste Hälfte. Das ist der schnellste Weg zu einem Zwischenauflager oder einem Lastangriffspunkt.
- **Einzelnen Knoten platzieren** erzeugt den Knoten auf dem Element, ohne ihn damit zu verbinden.

## Knoten bearbeiten {#editing-nodes}

- **Tabelle:** Bezeichnung, X und Z direkt bearbeiten.
- **Ziehen:** einen Knoten in der Ansicht verschieben, auch auf einem Touchscreen: Knoten drücken und ziehen. Jede Verschiebung lässt sich rückgängig machen.
- **Dialog Knoten bearbeiten:** der Stift in der Spalte *Aktionen* der Tabelle. Er enthält Koordinaten, Lager und Lagerwinkel, mit einer Vorschau des Lagersymbols.
- **Löschen:** das × in der Tabelle, *Löschen* im Panel des Knotens oder Auswahl und <kbd>Entf</kbd>. Mit einem Knoten werden auch die daran angeschlossenen Elemente und Lasten gelöscht.

## Lager {#supports}

Ein Lager ist eine Menge gehaltener Freiheitsgrade. Jeder Knoten hat drei:

| Freiheitsgrad | Bedeutung |
| --- | --- |
| **Dx** | Verschiebung in x-Richtung (horizontal) |
| **Dz** | Verschiebung in z-Richtung (vertikal) |
| **Ry** | Verdrehung um y (in der Zeichenebene) |

Am schnellsten geht es, wenn Sie **das Symbol wählen**. Es steht im Panel des Knotens unter **Knotenlagerung**, in den Dialogen Knoten hinzufügen und Knoten bearbeiten sowie als kleines Menü am Anfang der Spalte *Gelagerte Freiheitsgrade* der Knotentabelle. Das Anhaken der Kästchen `Dx`, `Dz`, `Ry` bewirkt dasselbe, Freiheitsgrad für Freiheitsgrad.

![Knotenlagerung: ein Symbol wählen oder die Freiheitsgrade anhaken und den Lagerwinkel festlegen](/screenshots/de/nodes-support-picker.webp){.shot-lg}

| Lager | Gehalten | Beweglich | Auflagerreaktionen |
| --- | --- | --- | --- |
| **Frei** | keine | alles | keine |
| **Festlager** | Dx + Dz | verdreht sich | R<sub>x</sub>, R<sub>z</sub> |
| **Loslager** | Dz | verschiebt sich horizontal, verdreht sich | R<sub>z</sub> |
| **Vertikales Loslager** | Dx | verschiebt sich vertikal, verdreht sich | R<sub>x</sub> |
| **Einspannung** | Dx + Dz + Ry | nichts | R<sub>x</sub>, R<sub>z</sub>, M |
| **Parallelführung** | Dz + Ry | verschiebt sich horizontal | R<sub>z</sub>, M |
| **Vertikale Parallelführung** | Dx + Ry | verschiebt sich vertikal | R<sub>x</sub>, M |
| **Nur Verdrehung gehalten** | Ry | verschiebt sich in beide Richtungen | M |

Für jeden gehaltenen Freiheitsgrad wird eine Auflagerreaktion berechnet und gezeichnet.

::: tip Fachwerkknoten
Fachwerkstäbe sind Balkenelemente, bei denen beide **Endgelenke** freigegeben sind (siehe [Elemente](/de/essentials/elements#end-hinges)). Als Auflager eines Fachwerks ist ein Festlager (Dx + Dz) die übliche Wahl. Ein Knoten, an dem alle angeschlossenen Elemente gelenkig sind, hat keine Drehsteifigkeit; EduBeam akzeptiert ihn und gibt seine Verdrehung mit 0 aus.
:::

### Gedrehte (schräge) Lager {#inclined-skewed-supports}

Legen Sie den **Knoten-LKS-Winkel** α in Grad fest (−180…180). Er steht im Panel des Knotens unter *Knotenlagerung*, in den Dialogen Knoten hinzufügen und Knoten bearbeiten sowie im Feld α der Knotentabelle. Die Achsen des Knotens werden um diesen Winkel gedreht, und die gelagerten Freiheitsgrade wirken in den gedrehten Richtungen; ein Loslager auf einer 30°-Schräge ist also `Dz` mit α = 30. Das Symbol dreht sich entsprechend mit, und die Auflagerreaktion wird in der gedrehten Richtung ausgegeben.

### Stabilität {#stability}

Der Solver braucht insgesamt mindestens **drei gehaltene Freiheitsgrade**, und Lager und Gelenke müssen das Tragwerk festhalten. Solange nicht genügend Lager vorhanden sind, zeigt die Ansicht einen blauen Chip *Lager fehlen*. Reicht die Anzahl der Lager, halten sie das Tragwerk aber nicht (alle parallel oder mit Wirkungslinien durch einen Punkt), oder lassen Gelenke Stäbe gegeneinander drehen, benennt eine rote Meldung das Problem, und eine gestrichelte Kontur zeigt, wie sich das Tragwerk bewegt. Siehe [Fehlerbehebung](/de/reference/troubleshooting).

## Knotenlasten und Auflagersenkungen {#nodal-loads-and-settlements}

Kräfte, Momente und vorgegebene Verschiebungen (Auflagersenkungen) greifen an Knoten an. Siehe [Lasten](/de/essentials/loads#nodal-loads).

## Bemaßungslinien {#dimension-lines}

Rechtsklick auf die Zeichenfläche → **Bemaßung hinzufügen** zeichnet eine Maßlinie zwischen zwei Punkten; Rechtsklick auf ein Element → **Element … bemaßen** bemaßt es direkt. Endpunkte rasten an Knoten ein, wenn Sie sie in deren Nähe ziehen. Wählen Sie eine Linie aus und nutzen Sie **Bearbeiten**, um ihre Koordinaten einzugeben, oder **Bemaßung umkehren**, um die Beschriftung auf die andere Seite zu legen. Bemaßungslinien sind rein grafisch; sie werden mit dem Projekt gespeichert und in Links mitgegeben.
