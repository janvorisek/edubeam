# Koordinatensystem & Vorzeichenkonvention

Die meisten „falschen“ Ergebnisse in <Edubeam /> sind in Wirklichkeit eine Überraschung der Vorzeichenkonvention. Hier steht genau das, was der Solver verwendet.

## Globale Achsen

- **x** – horizontal, positiv nach **rechts**.
- **z** – vertikal, positiv **nach unten** auf dem Bildschirm.
- **y** – die Achse senkrecht zur Tragwerksebene (zeigt im Rechtssystem zum Betrachter). Verdrehungen und Momente drehen um y.

Der Achsenindikator in der Ecke des Rasters zeigt x (rot) und z (grün). Ein Knoten am Kopf einer 3 m hohen Stütze hat also `Z = −3`, wenn der Fuß bei `Z = 0` liegt.

## Freiheitsgrade

Jeder Knoten hat `Dx`, `Dz` (Verschiebungen) und `Ry` (Verdrehung). Positives `Dz` ist eine Verschiebung nach unten; positives `Ry` ist eine Verdrehung **gegen den Uhrzeigersinn** auf dem Bildschirm. Dieselben Vorzeichen gelten für vorgegebene Verschiebungen und für die Knotenergebnisse.

## Lasten

| Last | Positive Richtung |
| --- | --- |
| `Fx`, `fx`, `f1x`… | +x (rechts; bzw. lokale x-Achse des Elements bei aktivem LCS) |
| `Fz`, `fz`, `f1z`… | +z (**nach unten**; bzw. lokale z-Achse bei aktivem LCS) |
| `My` | gegen den Uhrzeigersinn auf dem Bildschirm |
| `ΔTs` | Erwärmung (Verlängerung) |
| `ΔTb − ΔTt` | untere Faser wärmer als die obere |

Eine Schwerkraftlast ist also ein **positives** `fz`, und ein Wind, der eine linke Stütze nach rechts drückt, ein positives `fx`.

## Lokale Achsen des Elements

Lokal **x** verläuft vom Anfangs- zum Endknoten; lokal **z** steht senkrecht dazu und entsteht durch Drehen der globalen Achsen um den Stabwinkel $\alpha$. Bei einem horizontalen, von links nach rechts gezeichneten Element fallen lokale und globale Achsen zusammen. Mit **Knotenreihenfolge tauschen** in der Tabelle *Elemente* kehren Sie die Richtung um.

## Schnittgrößen

| Größe | Positiv bedeutet |
| --- | --- |
| **N** | Zug |
| **V<sub>z</sub>** | die übliche Vorzeichenregel der Balkentheorie: beim Einfeldträger unter Schwerkraftlast ist V am linken Auflager positiv und am rechten negativ |
| **M<sub>y</sub>** | **Zug in der unteren (+z) Faser**. Ein Einfeldträger unter Schwerkraftlast hat in Feldmitte ein positives Moment; ein Kragarm mit Einzellast am Ende hat an der Einspannung ein negatives Moment |

## Stabendkräfte (Tabelle Elementergebnisse)

`X12, Z12, M12` wirken am Anfangsknoten auf das Element, `X21, Z21, M21` am Endknoten, im **lokalen** System, mit denselben positiven Richtungen wie die lokalen Achsen und `My`. Es sind die Kräfte, die die Knoten auf das Element ausüben, d. h. $\mathbf{f} = \mathbf{K}_l\,\mathbf{u}_l - \mathbf{f}_{eq}$, wobei $\mathbf{f}_{eq}$ die äquivalenten Knotenlasten der Elementlasten sind. Die Summe der Stabendkräfte aller in einem Knoten zusammentreffenden Elemente steht mit den Knotenlasten und Auflagerreaktionen dort im Gleichgewicht.

## Auflagerreaktionen

Für jeden gehaltenen Freiheitsgrad gibt es eine Reaktion; sie wird im Koordinatensystem des Knotens angegeben (gedreht um den LKS-Winkel des Knotens, falls gesetzt). Die Reaktionspfeile in der Ansicht zeigen in die Richtung, in der das Lager auf das Tragwerk wirkt.

## Einheiten

Der Solver arbeitet intern in SI (m, N, Pa, rad, K). Die Anzeigeeinheiten beeinflussen nur, was Sie eingeben und ablesen; ihr Wechsel verändert das Modell nie.
