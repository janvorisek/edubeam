# Tutorial: ebenes Fachwerk

In diesem Tutorial bauen Sie ein kleines statisch bestimmtes Fachwerk, prüfen seine Stabkräfte mit dem Knotenpunktverfahren und dem Ritterschnitt und finden einen Nullstab. Planen Sie etwa 15 Minuten ein.

![Das fertige Fachwerk: Normalkräfte und Auflagerreaktionen](/screenshots/de/tut-truss.webp)

[Öffnen Sie das fertige Modell](https://run.edubeam.app/?model=eyJuIjpbWyIxIixbMCwwLDBdLFswLDJdLG51bGxdLFsiMiIsWzQsMCwwXSxbXSxudWxsXSxbIjMiLFs4LDAsMF0sW10sbnVsbF0sWyI0IixbMTIsMCwwXSxbMl0sbnVsbF0sWyI1IixbNCwwLC0zXSxbXSxudWxsXSxbIjYiLFs4LDAsLTNdLFtdLG51bGxdXSwiZSI6W1siMSIsWyIxIiwiMiJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiMiIsWyIyIiwiMyJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiMyIsWyIzIiwiNCJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiNCIsWyI1IiwiNiJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiNSIsWyIxIiwiNSJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiNiIsWyIyIiwiNSJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiNyIsWyI1IiwiMyJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiOCIsWyIzIiwiNiJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiOSIsWyI2IiwiNCJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dXSwibSI6W1siMSIsNzg1MCwyMTAwMDAwMDAwMDAsODEwMDAwMDAwMDAsMC4wMDAwMTJdXSwiY3MiOltbIjEiLDAuMDAyLDAuMDAwMDAxLDAuMSwxXV0sIm5sIjpbWyIyIix7IjAiOjAsIjIiOjMwMDAwLCI0IjowfV0sWyIzIix7IjAiOjAsIjIiOjMwMDAwLCI0IjowfV1dLCJkIjpbXX0%3D&lang=de){target="_blank"}, wenn Sie es nur erkunden möchten.

## Die Aufgabe {#the-problem}

![Geometrie, Lager und Lasten](/screenshots/de/tut-truss-model.webp)

- 12 m Spannweite in drei Feldern zu je 4 m, 3 m hoch.
- Untergurtknoten 1–4, Obergurtknoten 5 und 6.
- Ein Festlager in Knoten 1 und ein Loslager in Knoten 4.
- Zwei Lasten von je 30 kN in den Untergurtknoten 2 und 3.
- Stahlstäbe mit $A = 20$ cm².

| Knoten | X [m] | Z [m] | Lager | Last |
| --- | --- | --- | --- | --- |
| 1 | 0 | 0 | Festlager | |
| 2 | 4 | 0 | | `Fz = 30` kN |
| 3 | 8 | 0 | | `Fz = 30` kN |
| 4 | 12 | 0 | Loslager | |
| 5 | 4 | −3 | | |
| 6 | 8 | −3 | | |

Stäbe: Untergurt 1–2, 2–3, 3–4; Obergurt 5–6; Enddiagonalen 1–5 und 6–4; Pfosten 2–5 und 3–6; sowie die mittlere Diagonale 5–3.

**Ist es statisch bestimmt?** $m + r = 9 + 3 = 12 = 2j$ mit $j = 6$ Knoten, also ja: Die Stabkräfte folgen allein aus dem Gleichgewicht.

## 1. Material und Querschnitt {#_1-material-and-section}

1. **Modell löschen** (haken Sie *Materialien löschen* und *Querschnitte löschen* an).
2. *Materialien* → **Materialbibliothek** → **Steel (S235)**.
3. *Querschnitte* → **Querschnitt hinzufügen**: `Fläche = 0,002`, `Iy = 1e-6`, `Höhe = 0,1`, `Schubkoeffizient = 1`. Bei gelenkig angeschlossenen Stäben zählt nur die Fläche.

## 2. Stäbe mit Gelenken zeichnen {#_2-draw-the-bars-with-hinges}

Ein Fachwerkstab ist in EduBeam ein Balkenelement mit **beiden Endgelenken** angehakt. Das Maus-Werkzeug kann sie für Sie setzen:

1. Reiter *Elemente* → die zweite Schaltfläche **Element hinzufügen** (Mauszeiger-Symbol).
2. Haken Sie im Banner oben in der Ansicht **Gelenk am Anfang** und **Gelenk am Ende** an. Jeder Stab, den Sie jetzt zeichnen, erhält beide.
3. Zeichnen Sie den Umriss als einen Polygonzug: Klicken Sie auf (0, 0), (4, −3), (8, −3), (12, 0) und dann entlang des Untergurts zurück: (8, 0), (4, 0), (0, 0). Drücken Sie <kbd>Esc</kbd>.
4. Zeichnen Sie die inneren Stäbe einzeln und drücken Sie nach jedem <kbd>Esc</kbd>: (4, 0) → (4, −3), (4, −3) → (8, 0), (8, 0) → (8, −3).
5. Drücken Sie <kbd>F</kbd>, um das Modell anzupassen.

Prüfen Sie die Tabelle *Elemente*: neun Elemente, jedes mit beiden *Endgelenken* angehakt. Ihre Knoten- und Elementnummern können von den Bildern abweichen; das spielt keine Rolle.

## 3. Lager und Lasten {#_3-supports-and-loads}

1. Klicken Sie auf den Knoten bei (0, 0) → **Knotenlagerung** → **Festlager**. Klicken Sie auf den Knoten bei (12, 0) → **Loslager**.
2. Klicken Sie auf den Knoten bei (4, 0) → **Last hinzufügen** → `Fz = 30` kN. Machen Sie dasselbe bei (8, 0).

Ein positives `Fz` zeigt nach unten. Die Knoten eines Fachwerks können sich frei verdrehen; EduBeam akzeptiert Knoten, an denen alle Stäbe gelenkig angeschlossen sind, und gibt ihre Verdrehung mit 0 aus.

## 4. Ergebnisse {#_4-results}

Entfernen Sie in den Anzeigeoptionen die Haken bei **Verformte Form** und **M<sub>y</sub> (x)** (in einem Fachwerk gibt es keine Biegung) und haken Sie **N (x)** an.

![Normalkräfte: Zug positiv](/screenshots/de/tut-truss.webp)

## 5. Von Hand prüfen {#_5-check-by-hand}

**Auflagerreaktionen.** Die Lasten sind symmetrisch, also $R_1 = R_4 = 30$ kN nach oben, und die horizontale Auflagerkraft am Festlager ist null.

**Knoten 1** (Knotenpunktverfahren). Die Enddiagonale 1–5 ist 5 m lang ($\sin\alpha = 3/5$, $\cos\alpha = 4/5$):

$$\sum F_z:\ N_{15} \cdot \tfrac{3}{5} = -30 \Rightarrow N_{15} = -50\ \text{kN} \qquad \sum F_x:\ N_{12} = -N_{15} \cdot \tfrac{4}{5} = 40\ \text{kN}$$

**Knoten 2.** Der Pfosten 2–5 ist der einzige Stab, der die Last von 30 kN nach oben abtragen kann: $N_{25} = +30$ kN, und $N_{23} = N_{12} = 40$ kN.

**Schnitt durch das mittlere Feld.** Schneiden Sie die Stäbe 5–6, 5–3 und 2–3 und betrachten Sie den linken Teil:

- Momente um Knoten 3: $R_1 \cdot 8 - 30 \cdot 4 + N_{56} \cdot 3 = 0 \Rightarrow N_{56} = -40$ kN.
- Vertikalkräfte: Die Querkraft im Feld beträgt $R_1 - 30 = 0$, die Diagonale **5–3 trägt also nichts**: $N_{53} = 0$.

| Stab | Handrechnung | EduBeam |
| --- | --- | --- |
| Untergurt 1–2, 2–3, 3–4 | +40 kN (Zug) | 40 |
| Obergurt 5–6 | −40 kN (Druck) | −40 |
| Enddiagonalen 1–5, 6–4 | −50 kN | −50 |
| Pfosten 2–5, 3–6 | +30 kN | 30 |
| Mittlere Diagonale 5–3 | 0 | 0 |

Die Durchbiegung von Knoten 2 beträgt 2,29 mm (*Ergebnisse → Knotenergebnisse*). Berechnen Sie sie zur Übung mit dem Prinzip der virtuellen Arbeit, $\delta = \sum N n L / (EA)$.

## 6. Experimentieren {#_6-experiment}

- **Verschieben Sie eine Last.** Setzen Sie beide Lasten von 30 kN in Knoten 2. Die mittlere Diagonale trägt jetzt eine Kraft: mit welchem Vorzeichen, und warum?
- **Entfernen Sie die mittlere Diagonale.** Das Fachwerk wird zum Mechanismus; EduBeam kreist die verantwortlichen Gelenke ein und zeigt, wie sich das Feld verschiebt.
- **Entfernen Sie alle Gelenke.** Das Fachwerk wird zu einem Rahmen mit biegesteifen Knoten. Haken Sie **M<sub>y</sub> (x)** an: Die Biegemomente sind im Vergleich zu den Normalkräften winzig – deshalb funktioniert die Idealisierung mit gelenkigen Knoten.
- **Lagern Sie beide Auflager als Festlager.** Eine zusätzliche Auflagerreaktion macht das Fachwerk statisch unbestimmt, und die Untergurtkräfte hängen nun von den Stabquerschnitten ab.
