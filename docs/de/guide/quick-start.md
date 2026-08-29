# Schnellstart

In etwa zehn Minuten modellieren Sie einen Einfeldträger aus Stahl unter Gleichlast, lesen Auflagerreaktionen, Querkraft und Biegemoment ab und vergleichen sie mit den Lehrbuchformeln.

::: tip Parallel mitarbeiten
Öffnen Sie [run.edubeam.app](https://run.edubeam.app/?lang=de){target="_blank"} in einem zweiten Tab. Ist bereits ein Modell geladen, wählen Sie **Modell löschen** (Papierkorb in der Kopfleiste) und setzen die Haken bei *Materialien löschen* und *Querschnitte löschen*, um ganz von vorn zu beginnen.
:::

## Die Aufgabe

<ExampleStructure />

Ein Einfeldträger mit 6 m Spannweite (links Festlager, rechts Loslager) trägt eine Gleichlast von 12 kN/m. Material: Stahl, $E = 210\ \text{GPa}$, $G = 81\ \text{GPa}$. Querschnitt IPE 200: $A = 28{,}5\ \text{cm}^2$, $I_y = 1943\ \text{cm}^4$, $h = 200\ \text{mm}$.

## 1. Einheiten prüfen

Schauen Sie auf den Einheiten-Chip unten rechts in der Ansicht (z. B. `m · m² · kN · kNm · MPa`). In diesen Einheiten werden alle Eingabefelder und Ergebnisse dargestellt. Standard sind Meter, kN, kNm und MPa – davon geht diese Anleitung aus. Zum Ändern klicken Sie auf den Chip oder öffnen **Einstellungen → Sprache & Region**.

## 2. Material und Querschnitt anlegen

Ein Element braucht ein Material und einen Querschnitt, daher legen Sie diese zuerst an.

1. Öffnen Sie den Reiter **Materialien** in der Fußleiste und klicken Sie auf **Material hinzufügen**.
2. Geben Sie `E = 210000` MPa und `G = 81000` MPa ein, belassen Sie die Dichte und `α = 0,000012` 1/K. Bestätigen Sie mit **Material hinzufügen**.
   *(Oder klicken Sie auf **Materialbibliothek** und wählen **Steel (S235)** – es hat genau diese Werte.)*
3. Öffnen Sie den Reiter **Querschnitte** und klicken Sie auf **Querschnitt hinzufügen**.
4. Geben Sie `Fläche = 0,00285` m², `Iy = 1,943e-5` m⁴, `Höhe = 0,2` m, `Schubkoeffizient = 1` ein. Bestätigen Sie mit **Querschnitt hinzufügen**.

::: details Wozu der Schubkoeffizient?
EduBeam verwendet Timoshenko-Balkenelemente, die die Schubverformung berücksichtigen. `k` ist der Schubkorrekturfaktor ($k \approx 0{,}83$ für ein Rechteck, $\approx 0{,}4$–$0{,}5$ für den Steg eines I-Profils, wenn $A$ die volle Fläche ist). `k = 1` mit der vollen Fläche *unterschätzt* die Schubnachgiebigkeit etwas; bei einem schlanken Balken wie hier liegt der Unterschied in der Durchbiegung deutlich unter 1 %. Die Formel steht im [Theoriehandbuch](/de/elements/beam).
:::

## 3. Knoten hinzufügen

1. Öffnen Sie den Reiter **Knoten** und klicken Sie auf **Knoten hinzufügen**. Geben Sie `X = 0`, `Z = 0` ein und bestätigen Sie. Der Knoten erhält die Bezeichnung `1`.
2. Erneut **Knoten hinzufügen** mit `X = 6`, `Z = 0`. Das ist Knoten `2`.

Knoten lassen sich auch mit der Maus setzen: wählen Sie **Per Maus hinzufügen** (oder Rechtsklick auf die Zeichenfläche → *Knoten hinzufügen* bei gedrückter <kbd>Strg</kbd>-Taste) und klicken Sie ins Raster. Mit aktiviertem **Am Raster ausrichten** (<kbd>S</kbd>) landen Klicks auf 0,1-m-Schritten.

## 4. Mit einem Element verbinden

1. Öffnen Sie den Reiter **Elemente** und klicken Sie auf **Element hinzufügen**.
2. Wählen Sie **Anfangsknoten** `1`, **Endknoten** `2`. Material und Querschnitt sind bereits vorausgewählt. Bestätigen Sie.

Zwischen den Knoten erscheint eine schwarze Linie. Drücken Sie <kbd>F</kbd>, um das Tragwerk an den Bildschirm anzupassen.

## 5. Lager setzen

Im Reiter **Knoten** hat die Spalte **Gelagerte Freiheitsgrade** je Knoten drei Kontrollkästchen: `Dx`, `Dz`, `Ry`.

- Knoten `1`: **Dx** und **Dz** anhaken → das Symbol eines Festlagers erscheint.
- Knoten `2`: nur **Dz** anhaken → Loslager.

Dieselben Kästchen finden Sie nach einem Klick auf den Knoten in der Ansicht unter **Knotenlagerung**. Alle Lagertypen sind unter [Knoten & Lager](/de/essentials/nodes-supports) beschrieben.

## 6. Last aufbringen

1. Öffnen Sie den Reiter **Lasten** und klicken Sie auf **Elementlast hinzufügen**.
2. **Lasttyp**: *Gleichmäßig verteilte Last*. **Element**: `1`.
3. Geben Sie `fz = 12` kN/m ein und lassen Sie `fx = 0`. Bestätigen Sie.

Positives `fz` zeigt in +z-Richtung, also auf dem Bildschirm **nach unten** – ein positiver Wert ist somit eine Last in Richtung der Schwerkraft. Siehe [Vorzeichenkonvention](/de/elements/conventions).

## 7. Ergebnisse ablesen

Die Lösung erscheint, sobald die Last gesetzt ist. Öffnen Sie das Anzeigepanel (Zahnrad oben rechts in der Ansicht) und schalten Sie die Darstellungen ein und aus:

| Darstellung | Was Sie sehen sollten |
| --- | --- |
| **Auflagerreaktionen** | Zwei nach oben gerichtete Pfeile von je **36 kN** an den Knoten 1 und 2. |
| **V<sub>z</sub> (x)** | Eine Gerade von **+36 kN** links bis **−36 kN** rechts mit Nulldurchgang in Feldmitte. |
| **M<sub>y</sub> (x)** | Eine Parabel mit dem Extremwert **54 kNm** in Feldmitte. |
| **Verformte Form** | Eine symmetrische Durchbiegung. Fahren Sie mit der Maus über Knoten `1` und lesen Sie die Verdrehung ab: rund **0,0265 rad**. |

Der Reiter **Ergebnisse** in der Fußleiste liefert die Zahlen: **Knotenergebnisse** listet `Dx`, `Dz`, `Ry` je Knoten, **Elementergebnisse** die Stabendkräfte jedes Elements in seinem lokalen Koordinatensystem.

Sind die Diagramme zu groß oder zu klein, verschieben Sie den Regler **Ergebnisskalierung** unter **Einstellungen → Anzeigeeinstellungen → Größen**.

## 8. Von Hand prüfen

| Größe | Formel | Handwert | EduBeam |
| --- | --- | --- | --- |
| Auflagerkraft | $A = qL/2$ | 36 kN | 36 kN |
| Max. Querkraft | $V = qL/2$ | 36 kN | 36 kN |
| Max. Biegemoment | $M = qL^2/8$ | 54 kNm | 54 kNm |
| Verdrehung am Auflager | $\varphi = qL^3/(24EI)$ | 0,02647 rad | 0,02647 rad |
| Durchbiegung in Feldmitte | $w = 5qL^4/(384EI)$ | 49,6 mm | 49,6 mm |

Alles stimmt überein. Weitere Handrechnungen (Kragarm, beidseitig eingespannter Träger, Fachwerk) finden Sie unter [Ergebnisse von Hand prüfen](/de/guide/verification).

## 9. Experimentieren

Hier zeigt EduBeam seine Stärke. Probieren Sie jede dieser Änderungen und beobachten Sie die Diagramme:

- **Knoten 2 nach rechts ziehen**: das Moment wächst mit $L^2$.
- **`Ry` an Knoten 1 anhaken** – daraus wird eine Einspannung: das Feldmoment sinkt, am Auflager entsteht ein negatives Stützmoment.
- **Dritten Knoten** bei `X = 3` hinzufügen, indem Sie im Modus *Per Maus hinzufügen* auf den Balken klicken – wählen Sie **Mit Struktur verbinden**, damit der Stab geteilt wird – und dann dessen `Dz` anhaken: ein Zweifeldträger.
- **Ein Endgelenk** bei einem Element im Reiter Elemente anhaken, um das Moment an diesem Ende freizugeben.
- <kbd>Strg</kbd>+<kbd>Z</kbd> macht jeden Schritt rückgängig.

## 10. Speichern oder teilen

- **Modell teilen** (Kopfleiste) erzeugt eine URL, die das gesamte Modell enthält – für E-Mail, Chat oder Folien.
- **Projekt speichern** (Menü ☰ oder <kbd>Strg</kbd>+<kbd>S</kbd>) lädt eine `project.json` herunter, die Sie später mit **Projekt öffnen** oder per Drag & Drop in die App laden.

Ihr Modell wird zusätzlich im lokalen Speicher des Browsers gehalten, sodass ein Neuladen der Seite nichts verliert. Siehe [Import, Export & Teilen](/de/essentials/import-export).

## Wie geht es weiter?

- [Beispiele](/de/examples/) – fertige Rahmen und Fachwerke mit einem Klick öffnen.
- [Lasten](/de/essentials/loads) – Trapezlasten, Einzellasten, Temperaturlasten, vorgegebene Verschiebungen.
- [Tastatur & Maus](/de/reference/shortcuts) – schneller auf der Zeichenfläche arbeiten.
