# Koordinatensystem & Vorzeichenkonventionen

Die meisten „falschen“ Ergebnisse in <Edubeam /> sind in Wirklichkeit eine Überraschung bei der Vorzeichenkonvention. Hier steht genau das, was der Solver tatsächlich verwendet.

## Globale Achsen {#global-axes}

- **x** – horizontal, positiv nach **rechts**.
- **z** – vertikal, auf dem Bildschirm positiv **nach unten**.
- **y** – die Achse senkrecht zur Tragwerksebene (zeigt im Rechtssystem zum Betrachter). Verdrehungen und Momente drehen um y.

Der Achsenindikator in der Ecke des Rasters zeigt x (rot) und z (grün). Ein Knoten am Kopf einer 3 m hohen Stütze hat also `Z = −3`, wenn der Fußpunkt bei `Z = 0` liegt.

## Freiheitsgrade {#degrees-of-freedom}

Jeder Knoten hat `Dx`, `Dz` (Verschiebungen) und `Ry` (Verdrehung). Ein positives `Dz` ist eine Verschiebung nach unten; ein positives `Ry` ist eine Verdrehung **gegen den Uhrzeigersinn** auf dem Bildschirm. Dieselben Vorzeichen gelten für vorgegebene Verschiebungen und für die ausgegebenen Knotenergebnisse.

## Lasten {#loads}

| Last | Positive Richtung |
| --- | --- |
| `Fx`, `fx`, `f1x`… | +x (nach rechts; bzw. entlang der lokalen x-Achse des Elements, wenn LCS eingeschaltet ist) |
| `Fz`, `fz`, `f1z`… | +z (**nach unten**; bzw. entlang der lokalen z-Achse, wenn LCS eingeschaltet ist) |
| `My` | gegen den Uhrzeigersinn auf dem Bildschirm |
| `ΔTc` | Erwärmung (Verlängerung) |
| `ΔTb − ΔTt` | untere Faser wärmer als die obere |

Eine Schwerkraftlast ist also ein **positives** `fz`, und eine Windlast, die eine linke Stütze nach rechts drückt, ein positives `fx`.

## Lokale Achsen des Elements {#element-local-axes}

Die lokale **x**-Achse verläuft vom Anfangsknoten zum Endknoten; die lokale **z**-Achse steht senkrecht dazu und ergibt sich durch Drehen der globalen Achsen um den Stabwinkel $\alpha$. Bei einem horizontalen, von links nach rechts gezeichneten Element fallen lokale und globale Achsen zusammen. Mit **Knotenreihenfolge tauschen** in der Tabelle *Elemente* kehren Sie die Richtung um.

## Schnittgrößen {#internal-forces}

| Größe | Positiv bedeutet |
| --- | --- |
| **N** | Zug |
| **V<sub>z</sub>** | die übliche Vorzeichenregel der Balkentheorie: Beim Einfeldträger unter Schwerkraftlast ist V am linken Auflager positiv und am rechten negativ |
| **M<sub>y</sub>** | **Zug unten** – Zug in der unteren (+z) Faser. Ein Einfeldträger unter Schwerkraftlast hat in Feldmitte ein positives Moment; ein Kragträger mit Einzellast am Ende hat an der Einspannung ein negatives Moment (Zug oben) |

## Stabendkräfte (Tabelle Elementergebnisse) {#end-forces-element-results-table}

`X12, Z12, M12` wirken am Anfangsknoten auf das Element, `X21, Z21, M21` am Endknoten, im **lokalen** System, mit denselben positiven Richtungen wie die lokalen Achsen und `My`. Es sind die Kräfte, die die Knoten auf das Element ausüben, d. h. $\mathbf{f} = \mathbf{K}_l\,\mathbf{u}_l - \mathbf{f}_{eq}$, wobei $\mathbf{f}_{eq}$ die äquivalenten Knotenlasten der Elementlasten sind. Die Summe der Stabendkräfte aller Elemente, die in einem Knoten zusammentreffen, steht mit den dortigen Knotenlasten und Auflagerreaktionen im Gleichgewicht.

## Auflagerreaktionen {#reactions}

Für jeden gehaltenen Freiheitsgrad gibt es eine Auflagerreaktion; sie wird im Koordinatensystem des Knotens ausgegeben (gedreht um den Knoten-LKS-Winkel, falls einer gesetzt ist). Die Reaktionspfeile in der Ansicht zeigen in die Richtung, in der das Lager auf das Tragwerk drückt.

## Achsen mit y nach oben {#y-up-axes}

**Einstellungen → Koordinatensystem → x nach rechts, y nach oben** stellt alles, was Sie eingeben und ablesen, auf das Lehrbuchsystem um: **x** nach rechts, **y** nach oben und **z** zum Betrachter. Modell, gespeicherte Dateien und Zeichnungen bleiben gleich; nur Zahlen und Bezeichnungen ändern sich:

| Größe | z nach unten (Standard) | y nach oben |
| --- | --- | --- |
| Vertikale Koordinate | `Z` | `Y`, umgekehrtes Vorzeichen |
| Vertikale Lasten, Verschiebungen, Auflagerreaktionen, Stabendkräfte | `Fz`, `fz`, `Dz`, `Z12`… | `Fy`, `fy`, `Dy`, `Y12`…, umgekehrtes Vorzeichen |
| Verdrehungen und Momente | `Ry`, `My` | `Rz`, `Mz`, gleiches Vorzeichen (gegen den Uhrzeigersinn positiv) |
| Lagerwinkel α | im Uhrzeigersinn gemessen | gegen den Uhrzeigersinn gemessen, umgekehrtes Vorzeichen |
| Schnittgrößen N, V, M | | unverändert, Diagramme werden gleich gezeichnet |

Eine Schwerkraftlast ist also ein **negatives** `fy`, und der Kopf einer 3 m hohen Stütze hat `Y = 3`.

## Einheiten {#units}

Der Solver rechnet intern in SI (m, N, Pa, rad, K). Die Anzeigeeinheiten wirken sich nur darauf aus, was Sie eingeben und ablesen; ein Wechsel ändert das Modell nie.
