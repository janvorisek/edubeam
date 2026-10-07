# Schnellstart

In etwa zehn Minuten modellieren Sie einen Einfeldträger aus Stahl unter Gleichlast, lesen Auflagerreaktionen, Querkraft und Biegemoment ab und vergleichen sie mit den Lehrbuchformeln.

::: tip Parallel mitarbeiten
Öffnen Sie [run.edubeam.app](https://run.edubeam.app/?lang=de){target="_blank"} in einem zweiten Tab. Ist bereits ein Modell geladen, beginnen Sie mit **Modell löschen** in der Kopfleiste neu und haken Sie *Materialien löschen* und *Querschnitte löschen* an, um ganz von vorn anzufangen. Das Löschen lässt sich mit <kbd>Strg</kbd>+<kbd>Z</kbd> rückgängig machen, und das alte Modell bleibt unter **☰ → Zuletzt verwendete Modelle** erhalten.

Lernen Sie lieber mit Hinweisen auf dem Bildschirm? **☰ → Ersten Balken zeichnen** führt Sie mit der Maus durch einen ähnlichen Balken.
:::

## Die Aufgabe {#the-problem}

<ExampleStructure />

Ein Einfeldträger mit 6 m Spannweite (links Festlager, rechts Loslager) trägt eine Gleichlast von 12 kN/m. Material: Stahl, $E = 210\ \text{GPa}$, $G = 81\ \text{GPa}$. Querschnitt: IPE 200, $A = 28{,}5\ \text{cm}^2$, $I_y = 1943\ \text{cm}^4$, $h = 200\ \text{mm}$.

## 1. Einheiten prüfen {#_1-check-the-units}

Der Einheiten-Chip unten rechts in der Ansicht zeigt die Einheiten, in denen alle Eingabefelder und Ergebnisse dargestellt werden. Diese Anleitung geht von den SI-Standardeinstellungen aus: Meter, kN, kNm und MPa.

![Die Schalter für Raster (G), Fangen (S) und Fadenkreuz sowie der Einheiten-Chip](/screenshots/de/ui-grid-units.webp){.shot-sm}

Sehen Sie `ft · kip · kip·ft · ksi`, klicken Sie auf den Chip und wählen Sie **Einheitensystem → SI (metrisch)**.

## 2. Material und Querschnitt anlegen {#_2-add-the-material-and-cross-section}

Elemente brauchen ein Material und einen Querschnitt, daher legen Sie diese zuerst an.

1. Öffnen Sie in der unteren Leiste den Reiter **Materialien** und klicken Sie auf **Material hinzufügen**.
2. Geben Sie `E = 210000` MPa und `G = 81000` MPa ein. Belassen Sie die Dichte und `α = 0,000012` 1/K. Klicken Sie auf **Material hinzufügen**.

<div class="shots">

![Material hinzufügen: E und G eingeben …](/screenshots/de/qs-material.webp)

![… oder Steel (S235) aus der Materialbibliothek wählen](/screenshots/de/qs-material-library.webp)

</div>

3. Öffnen Sie den Reiter **Querschnitte** und klicken Sie auf **Querschnitt hinzufügen**.
4. Geben Sie `Fläche = 0,00285` m², `Iy = 1,943e-5` m⁴, `Höhe = 0,2` m und `Schubkoeffizient = 1` ein. Klicken Sie auf **Querschnitt hinzufügen**.

![Querschnitt hinzufügen. Oder aus der Bibliothek wählen oder eine polygonale Form zeichnen.](/screenshots/de/qs-cross-section.webp){.shot-md}

::: details Wozu der Schubkoeffizient?
EduBeam verwendet Timoshenko-Balkenelemente, die die Schubverformung berücksichtigen. `k` ist der Schubkorrekturfaktor: $k \approx 0{,}83$ für ein Rechteck und etwa $0{,}4$–$0{,}5$ für ein I-Profil, wenn $A$ die volle Fläche ist. `k = 1` mit der vollen Fläche *unterschätzt* die Schubnachgiebigkeit etwas. Bei einem schlanken Balken wie diesem liegt der Unterschied in der Durchbiegung deutlich unter 1 %. Die Formel steht auf der [Seite zur Balkentheorie](/de/elements/beam).
:::

## 3. Knoten hinzufügen {#_3-add-the-nodes}

1. Öffnen Sie den Reiter **Knoten**. Er hat zwei Schaltflächen **Knoten hinzufügen**: Die erste öffnet einen Dialog, die zweite (mit Mauszeiger-Symbol) setzt Knoten mit der Maus. Klicken Sie auf die erste.
2. Geben Sie `X = 0`, `Z = 0` ein und klicken Sie auf **Knoten hinzufügen**. Der Knoten erhält die Bezeichnung `1`.
3. Fügen Sie einen zweiten Knoten bei `X = 6`, `Z = 0` hinzu. Das ist Knoten `2`.

![Im Dialog Knoten hinzufügen lassen sich auch gleich die Lager festlegen](/screenshots/de/qs-node.webp){.shot-md}

Mit der Maus-Schaltfläche setzt dagegen jeder Klick auf die Zeichenfläche einen Knoten. Ist **Am Raster ausrichten** (<kbd>S</kbd>) aktiv, landen die Klicks auf der Raster-Schrittweite (standardmäßig 0,1 m).

## 4. Mit einem Element verbinden {#_4-connect-them-with-an-element}

1. Öffnen Sie den Reiter **Elemente** und klicken Sie auf die erste Schaltfläche **Element hinzufügen**.
2. Wählen Sie **Anfangsknoten** `1` und **Endknoten** `2`. Ihr Material und Ihr Querschnitt sind bereits ausgewählt. Klicken Sie auf **Element hinzufügen**.

![Element hinzufügen: die beiden Endknoten, optionale Endgelenke, Material und Querschnitt](/screenshots/de/qs-element.webp){.shot-md}

Zwischen den Knoten erscheint eine Linie. Drücken Sie <kbd>F</kbd>, um sie an den Bildschirm anzupassen.

## 5. Lager setzen {#_5-add-the-supports}

Im Reiter **Knoten** hat die Spalte **Gelagerte Freiheitsgrade** je Knoten eine Auswahl von Lagersymbolen und drei Kontrollkästchen: `Dx`, `Dz`, `Ry`.

- Knoten `1`: Wählen Sie das Symbol **Festlager** oder haken Sie **Dx** und **Dz** an.
- Knoten `2`: Wählen Sie das **Loslager** oder haken Sie nur **Dz** an.

![Lager in der Knotentabelle: Knoten 1 mit Festlager, Knoten 2 mit Loslager](/screenshots/de/qs-supports.webp)

Sie können auch in der Ansicht auf einen Knoten klicken und **Knotenlagerung** wählen. Unter [Knoten & Lager](/de/essentials/nodes-supports#supports) sind alle Lagertypen aufgeführt.

## 6. Last aufbringen {#_6-add-the-load}

1. Öffnen Sie den Reiter **Lasten** und klicken Sie auf **Elementlast hinzufügen**.
2. **Lasttyp**: *Gleichmäßig verteilte Last*. **Element**: `1`.
3. Geben Sie `fz = 12` kN/m ein und lassen Sie `fx = 0`. Klicken Sie auf **Elementlast hinzufügen**.

![Der Dialog zeigt eine Vorschau der Last am Element](/screenshots/de/qs-load.webp){.shot-md}

Ein positives `fz` zeigt in +z-Richtung, also auf dem Bildschirm **nach unten**; ein positiver Wert ist somit eine Schwerkraftlast. Siehe [Vorzeichenkonventionen](/de/elements/conventions).

## 7. Ergebnisse ablesen {#_7-read-the-results}

Die Lösung erscheint, sobald die Last gesetzt ist. Das Anzeigepanel oben rechts in der Ansicht schaltet die Diagramme ein und aus. **Verformte Form**, **M<sub>y</sub>(x)** und **Auflagerreaktionen** sind standardmäßig eingeschaltet. Haken Sie **V<sub>z</sub>(x)** an, um die Querkraft hinzuzufügen.

![Querkraft (grün), Biegemoment (rot), Auflagerreaktionen (violett) und Verformungsfigur](/screenshots/de/qs-results.webp)

| Darstellung | Was Sie sehen sollten |
| --- | --- |
| **Auflagerreaktionen** | Zwei nach oben gerichtete Pfeile von **36 kN** an den Knoten 1 und 2. |
| **V<sub>z</sub>(x)** | Eine Gerade von **+36 kN** links bis **−36 kN** rechts mit Nulldurchgang in Feldmitte. |
| **M<sub>y</sub>(x)** | Eine Parabel mit dem Extremwert **54 kNm** in Feldmitte. |
| **Verformte Form** | Eine symmetrische Durchbiegung. Zeigen Sie mit der Maus auf Knoten `1`, um seine Verdrehung abzulesen: **2,6469 · 10⁻² rad**. |

Der Reiter **Ergebnisse** in der unteren Leiste liefert die Zahlen. **Knotenergebnisse** listet `Dx`, `Dz`, `Ry` für jeden Knoten auf, **Elementergebnisse** die Stabendkräfte jedes Elements in seinem lokalen Koordinatensystem.

Wirken die Diagramme zu groß oder zu klein, ändern Sie die **Ergebnisskalierung** unter **Einstellungen → Anzeigeeinstellungen → Größen**.

## 8. Von Hand prüfen {#_8-check-by-hand}

| Größe | Formel | Handrechnung | EduBeam |
| --- | --- | --- | --- |
| Auflagerkraft | $R = qL/2$ | 36 kN | 36 kN |
| Max. Querkraft | $V = qL/2$ | 36 kN | 36 kN |
| Max. Moment | $M = qL^2/8$ | 54 kNm | 54 kNm |
| Endverdrehung | $\varphi = qL^3/(24EI)$ | 0,02647 rad | 0,02647 rad |
| Durchbiegung in Feldmitte (Biegung) | $w = 5qL^4/(384EI)$ | 49,63 mm | |
| Durchbiegung in Feldmitte (Schub) | $w_s = qL^2/(8kGA)$ | 0,23 mm | |
| Durchbiegung in Feldmitte (gesamt) | Summe | 49,86 mm | 49,86 mm |

In Feldmitte gibt es keinen Knoten. Um dort die Durchbiegung abzulesen, fügen Sie einen hinzu: Wählen Sie die zweite Schaltfläche **Knoten hinzufügen**, klicken Sie bei `X = 3` auf den Balken und wählen Sie **Mit Struktur verbinden**. Der Balken wird in zwei Elemente geteilt, und `Dz` des neuen Knotens zeigt unter **Ergebnisse** 49,86 mm. Das Teilen ändert kein Ergebnis, weil das Element exakt ist.

Alles stimmt überein. Weitere Rezepte für Handrechnungen (Kragträger, beidseitig eingespannter Träger, Fachwerk, Temperatur) finden Sie unter [Ergebnisse von Hand prüfen](/de/guide/verification).

## 9. Experimentieren {#_9-experiment}

Hier zeigt EduBeam seine Stärke. Probieren Sie jede dieser Änderungen aus und beobachten Sie, wie sich die Diagramme aktualisieren:

- **Ziehen Sie Knoten 2** nach rechts: Das Moment wächst mit $L^2$.
- **Haken Sie `Ry` an Knoten 1 an**, um ihn einzuspannen: Das Feldmoment sinkt, und am Auflager entsteht ein Stützmoment.
- **Haken Sie `Dz` am eben hinzugefügten Knoten in Feldmitte an**, um einen Zweifeldträger zu erhalten.
- **Haken Sie im Reiter Elemente ein Endgelenk** eines Elements an, um das Moment an diesem Ende freizugeben.
- Drücken Sie <kbd>Strg</kbd>+<kbd>Z</kbd>, um jeden Schritt rückgängig zu machen.

## 10. Speichern oder teilen {#_10-save-or-share}

- **Modell teilen** (in der Kopfleiste oder im Menü ☰) liefert einen Link, der das ganze Modell enthält. Fügen Sie ihn in eine E-Mail, einen Chat oder Ihre Folien ein.
- **☰ → Projekt speichern** (<kbd>Strg</kbd>+<kbd>S</kbd>) lädt eine `project.json` herunter, die Sie später mit **Projekt öffnen** oder per Drag & Drop auf die App wieder öffnen.
- **☰ → Bild exportieren** (<kbd>Strg</kbd>+<kbd>P</kbd>) speichert die Zeichnung für einen Bericht als PNG oder SVG.

Ihr Modell wird außerdem im Browser gespeichert, sodass es beim Neuladen der Seite nicht verloren geht. Siehe [Import, Export & Teilen](/de/essentials/import-export).

## Wie geht es weiter? {#where-next}

- [Tutorial Dreigelenkrahmen](/de/tutorials/three-hinged-frame): ein Rahmen mit innerem Gelenk, von Hand geprüft.
- [Beispiele](/de/examples/): fertige Rahmen und Fachwerke mit einem Klick öffnen.
- [Lasten](/de/essentials/loads): Trapezlasten, Einzellasten und Temperaturlasten, vorgegebene Verschiebungen.
- [Tastatur, Maus & Touch](/de/reference/shortcuts): schneller auf der Zeichenfläche arbeiten.
