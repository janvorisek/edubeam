# Tutorial: Dreigelenkrahmen

Ein Dreigelenkrahmen ist statisch bestimmt: Drei Gleichgewichtsbedingungen und die Bedingung $M = 0$ im Gelenk liefern alle vier Auflagerreaktionen. Damit ist er ideal, um jede Zahl zu prüfen, die EduBeam zeichnet. Planen Sie etwa 15 Minuten ein.

![Der fertige Rahmen: Biegemoment und Auflagerreaktionen](/screenshots/de/tut-frame-moment.webp)

[Öffnen Sie das fertige Modell](https://run.edubeam.app/?model=eyJuIjpbWyJBIixbMCwwLDBdLFswLDJdLG51bGxdLFsiQiIsWzAsMCwtNF0sW10sbnVsbF0sWyJDIixbNCwwLC00XSxbXSxudWxsXSxbIkQiLFs4LDAsLTRdLFtdLG51bGxdLFsiRSIsWzgsMCwwXSxbMCwyXSxudWxsXV0sImUiOltbIjEiLFsiQSIsIkIiXSwiMSIsIjEiLFtmYWxzZSxmYWxzZV1dLFsiMiIsWyJCIiwiQyJdLCIxIiwiMSIsW2ZhbHNlLHRydWVdXSxbIjMiLFsiQyIsIkQiXSwiMSIsIjEiLFtmYWxzZSxmYWxzZV1dLFsiNCIsWyJEIiwiRSJdLCIxIiwiMSIsW2ZhbHNlLGZhbHNlXV1dLCJtIjpbWyIxIiw3ODUwLDIxMDAwMDAwMDAwMCw4MTAwMDAwMDAwMCwwLjAwMDAxMl1dLCJjcyI6W1siMSIsMC4wMDUzOCwwLjAwMDA4MzU2LDAuMywxXV0sImVsIjpbWyIyIixbMCwxMDAwMF0sZmFsc2VdLFsiMyIsWzAsMTAwMDBdLGZhbHNlXV0sImQiOltdfQ%3D%3D&lang=de){target="_blank"}, wenn Sie es nur erkunden möchten.

## Die Aufgabe {#the-problem}

- Zwei 4 m hohe Stützen, an ihren Fußpunkten A und E gelenkig gelagert, im Abstand von 8 m.
- Ein horizontaler Riegel B–D obenauf, mit einem Gelenk in Feldmitte C.
- Eine Gleichlast von $q = 10$ kN/m auf dem ganzen Riegel.
- Stahl ($E = 210$ GPa, $G = 81$ GPa), IPE 300 ($A = 53{,}8$ cm², $I_y = 8356$ cm⁴, $h = 300$ mm).

| Knoten | X [m] | Z [m] | Lager |
| --- | --- | --- | --- |
| A | 0 | 0 | Festlager |
| B | 0 | −4 | |
| C | 4 | −4 | (Gelenk im Riegel) |
| D | 8 | −4 | |
| E | 8 | 0 | Festlager |

Denken Sie daran, dass **z nach unten zeigt**; der Stützenkopf liegt also bei `Z = −4`.

## 1. Material und Querschnitt {#_1-material-and-section}

1. **Modell löschen** (haken Sie *Materialien löschen* und *Querschnitte löschen* an).
2. *Materialien* → **Materialbibliothek** → **Steel (S235)**.
3. *Querschnitte* → **Querschnitt hinzufügen**: `Fläche = 0,00538`, `Iy = 8,356e-5`, `Höhe = 0,3`, `Schubkoeffizient = 1`.

Der Querschnitt beeinflusst nur die Verschiebungen. Dieser Rahmen ist statisch bestimmt, seine Schnittgrößen hängen also überhaupt nicht von $E$, $A$ oder $I$ ab.

## 2. Den Rahmen zeichnen {#_2-draw-the-frame}

Am schnellsten geht es mit einem einzigen Polygonzug mit der Maus:

1. Stellen Sie sicher, dass **Am Raster ausrichten** eingeschaltet ist (der Chip **S**).
2. Reiter *Elemente* → die zweite Schaltfläche **Element hinzufügen** (Mauszeiger-Symbol).
3. Klicken Sie auf (0, 0), dann auf (0, −4), (4, −4), (8, −4) und (8, 0). Orientieren Sie sich an den Linealen und am Fadenkreuz, um die Punkte zu finden. Jeder Klick fügt einen Knoten hinzu und verbindet ihn mit dem vorherigen.
4. Drücken Sie <kbd>Esc</kbd>, um abzuschließen, und dann <kbd>F</kbd>, um den Rahmen an den Bildschirm anzupassen.

Sie haben nun fünf Knoten und vier Elemente. Die Bilder hier bezeichnen die Knoten mit A–E; benennen Sie Ihre in der Tabelle *Knoten* um, wenn Sie möchten, oder behalten Sie 1–5. Prüfen Sie die Koordinaten in der Tabelle und korrigieren Sie alle, die das Raster verfehlt haben.

## 3. Lager und Gelenk {#_3-supports-and-the-hinge}

1. Klicken Sie auf Knoten A, öffnen Sie **Knotenlagerung** und wählen Sie das **Festlager**. Machen Sie dasselbe für Knoten E.
2. Suchen Sie in der Tabelle *Elemente* das Element von B nach C und haken Sie sein Gelenk am **Ende** an (das zweite Kästchen unter *Endgelenke*).

![Die Elementtabelle: Das Gelenk liegt am Ende von Element 2, im Knoten C](/screenshots/de/elements-table.webp)

::: tip Ein Gelenk, nicht zwei
Ein Gelenk am Ende des Elements B–C genügt: Das Moment in C ist dann null, weil C–D kein Moment in einen Knoten einleiten kann, an den nur es selbst biegesteif angeschlossen ist. Haken Sie zusätzlich den Anfang von C–D an, ändert sich nichts. Setzen Sie aber auch in B ein Gelenk, wird der Rahmen zum Mechanismus. Probieren Sie es aus: EduBeam zeigt Ihnen, wie er sich bewegt.
:::

## 4. Last {#_4-load}

*Lasten* → **Elementlast hinzufügen** → *Gleichmäßig verteilte Last*, Element B–C, `fz = 10` kN/m. Wiederholen Sie das für Element C–D. Der Riegel ist horizontal, daher spielt das Kästchen LCS hier keine Rolle.

## 5. Ergebnisse {#_5-results}

In den Anzeigeoptionen sind zu Beginn Verformungsfigur, Biegemoment und Auflagerreaktionen eingeschaltet. Haken Sie **N (x)** und **V<sub>z</sub> (x)** an, um den Rest zu sehen.

<div class="shots">

![Biegemoment und Auflagerreaktionen](/screenshots/de/tut-frame-moment.webp)

![Normalkraft](/screenshots/de/tut-frame-normal.webp)

![Querkraft](/screenshots/de/results-shear.webp)

![Verformungsfigur](/screenshots/de/results-deformed.webp)

</div>

## 6. Von Hand prüfen {#_6-check-by-hand}

**Vertikale Auflagerkräfte.** Aus Symmetrie nimmt jeder Fußpunkt die Hälfte der Last auf:

$$V_A = V_E = \frac{q \cdot 8}{2} = 40\ \text{kN}$$

**Horizontale Auflagerkräfte.** Bilden Sie für die linke Rahmenhälfte das Momentengleichgewicht um das Gelenk C. Das Moment dort muss null sein:

$$V_A \cdot 4 - H_A \cdot 4 - q \cdot 4 \cdot 2 = 0 \quad\Rightarrow\quad H_A = \frac{160 - 80}{4} = 20\ \text{kN}$$

Beide Fußpunkte drücken mit 20 kN nach innen; dieser Horizontalschub macht den Dreigelenkrahmen so effizient.

**Schnittgrößen.**

| Größe | Formel | Handrechnung | EduBeam |
| --- | --- | --- | --- |
| Vertikale Auflagerkräfte | $qL/2$ | 40 kN | 40 kN |
| Horizontale Auflagerkräfte | aus $M_C = 0$ | 20 kN | 20 kN |
| Moment in den Rahmenecken B und D | $H \cdot h$ | 80 kNm, Zug außen | −80 kNm |
| Moment im Gelenk C | | 0 | 0 |
| Normalkraft in den Stützen | $-V_A$ | −40 kN | −40 kN |
| Normalkraft im Riegel | $-H_A$ | −20 kN | −20 kN |
| Querkraft in den Stützen | $H_A$ | 20 kN | −20 kN (A–B), +20 kN (D–E) |
| Querkraft im Riegel bei B | $V_A$ | 40 kN | 40 kN |
| Querkraft im Riegel bei C | $V_A - 4q$ | 0 | 0 |
| Querkraft im Riegel bei D | $V_A - 8q$ | −40 kN | −40 kN |

Die beiden Stützen haben entgegengesetzte Querkraft-Vorzeichen, obwohl sie dieselbe Kraft tragen, denn die lokalen Achsen jedes Elements folgen seiner Richtung: A–B ist nach oben gezeichnet, D–E nach unten. Tauschen Sie die Knoten einer Stütze, und ihr Vorzeichen kehrt sich um.

Im Riegel gilt $M(x) = -80 + 40x - 5x^2$ kNm (x ab B); das ist im Gelenk null und nirgends positiv: Der ganze Riegel hat Zug oben. Die Querkraft $V(x) = 40 - 10x$ fällt genau in C auf null, daher liegt auch das Extremum des Moments im Gelenk.

**Verschiebung.** Das Gelenk C senkt sich um 43,1 mm (*Ergebnisse → Knotenergebnisse*, `Dz` von C). Sie entsteht aus der Biegung aller vier Stäbe und ist eine gute Übung zum Prinzip der virtuellen Arbeit.

## 7. Experimentieren {#_7-experiment}

- **Entfernen Sie das Gelenk** in C. Der Rahmen wird einfach statisch unbestimmt; die Eckmomente sinken, und in Feldmitte entsteht ein Feldmoment. Jetzt spielt der Querschnitt eine Rolle: Probieren Sie einen steiferen Riegel aus.
- **Spannen Sie die Fußpunkte ein** (wählen Sie das Lager **Einspannung**). In A und E entstehen Momente.
- **Fügen Sie eine Horizontallast hinzu**: eine Knotenlast `Fx = 10` kN in B. Der Rahmen verschiebt sich seitlich, und die Auflagerreaktionen sind nicht mehr symmetrisch. Prüfen Sie sie mit denselben drei Gleichungen und $M_C = 0$.
- **Setzen Sie zusätzlich ein Gelenk in B.** Der Rahmen ist jetzt ein Mechanismus, und EduBeam animiert, wie er sich bewegen kann.
