# Elemente, Materialien & Querschnitte

## Das Balkenelement {#the-beam-element}

<Edubeam /> hat einen einzigen Elementtyp: einen **ebenen Timoshenko-Balken** in der x–z-Ebene mit drei Freiheitsgraden an jedem Ende (`Dx`, `Dz`, `Ry`). Er überträgt Normalkraft, Querkraft und Biegemoment und berücksichtigt die Schubverformung; deshalb hat der Querschnitt einen Schubkoeffizienten. Die vollständige Formulierung steht im [Theoriehandbuch](/de/elements/beam).

<TrussElement :moment="true" caption="Ebenes Balkenelement – drei Freiheitsgrade je Knoten" />

Die Ergebnisse entlang eines Elements sind für das lineare Modell exakt, ein Element je Stab genügt also. Zwischenknoten brauchen Sie nur dort, wo Sie ein Lager, ein Gelenk, einen Querschnittswechsel oder einen Knoten zum Ablesen von Ergebnissen benötigen.

### Elemente hinzufügen {#adding-elements}

| Methode | Vorgehen |
| --- | --- |
| **Dialog** | Reiter *Elemente* → die erste Schaltfläche **Element hinzufügen** oder Menü der Zeichenfläche → *Element hinzufügen*. Wählen Sie **Anfangsknoten** und **Endknoten**, die Gelenke, das Material und den Querschnitt. |
| **Maus** | Reiter *Elemente* → die zweite Schaltfläche **Element hinzufügen** (Mauszeiger-Symbol) oder <kbd>Strg</kbd> gedrückt halten beim Menüpunkt der Zeichenfläche. Klicken Sie auf einen Knoten, um zu beginnen, dann auf den nächsten Knoten, um zu verbinden; ein Klick auf leere Zeichenfläche erzeugt dort einen Knoten. Klicken Sie weiter, um einen Polygonzug zu zeichnen, und drücken Sie <kbd>Esc</kbd>, um abzuschließen. Das Banner oben legt **Gelenk am Anfang** und **Gelenk am Ende** für jedes gezeichnete Element fest. Verwendet werden das erste Material und der erste Querschnitt im Modell. |

![Der Dialog Element hinzufügen](/screenshots/de/qs-element.webp){.shot-md}

::: warning Zuerst Materialien und Querschnitte
Ein Element braucht ein Material und einen Querschnitt. Fehlen sie, zeigt die Ansicht *Keine Materialien definiert.* / *Keine Querschnitte definiert.* mit einer Schaltfläche **Neu hinzufügen**.
:::

### Elementrichtung {#element-direction}

Die **lokale x-Achse** verläuft vom Anfangsknoten zum Endknoten. Das ist wichtig für:

- Lasten in lokalen Koordinaten (**LCS** angehakt),
- die *Lastposition vom Anfangsknoten* bei Einzellasten,
- die Reihenfolge der Stabendkräfte (`X12, Z12, M12` am Anfang, `X21, Z21, M21` am Ende) in der Ergebnistabelle.

Mit der Tausch-Schaltfläche zwischen den beiden Knoten in der Tabelle *Elemente* kehren Sie ein Element um.

### Endgelenke {#end-hinges}

Jedes Element hat in der Tabelle *Elemente* zwei Kontrollkästchen **Endgelenke**, für Anfang und Ende. Sie stehen auch im Dialog Element hinzufügen, im Panel **Element bearbeiten** des Elements und beim Zeichnen mit der Maus im Banner. Ein angehaktes Gelenk gibt das Biegemoment an diesem Ende frei, also:

- ein Gelenk ergibt ein Gelenk innerhalb eines Rahmens oder Durchlaufträgers (das Moment ist dort null);
- beide Gelenke ergeben einen **Fachwerkstab**, der nur Normalkraft überträgt.

<TrussElement :hinges="[true, true]" caption="Beide Enden gelenkig → Fachwerkstab" />

![Die Elementtabelle des Dreigelenkrahmens: Element 2 hat an seinem Ende, im Knoten C, ein Gelenk](/screenshots/de/elements-table.webp)

Treffen zwei Elemente in einem Knoten zusammen und ist nur eines davon gelenkig angeschlossen, überträgt das andere weiterhin ein Moment in den Knoten. Geben Sie also das Element frei, das gelenkig angeschlossen sein soll, nicht „den Knoten“. Machen Gelenke das Tragwerk zum Mechanismus, kreist EduBeam sie ein und zeigt, wie es sich bewegt.

### Bearbeiten und Löschen {#editing-and-deleting}

Klicken Sie auf ein Element und nutzen Sie sein Panel (**Element bearbeiten**, **Last hinzufügen**, **Steifigkeitsmatrix**, **Löschen**) oder bearbeiten Sie es in der Tabelle *Elemente*. Beim Löschen eines Elements werden auch seine Lasten entfernt. **Steifigkeitsmatrix** öffnet ein Fenster mit der 6 × 6-Steifigkeitsmatrix des Elements in globalen Koordinaten (N/m, N und N·m), in der eventuelle Endgelenke bereits auskondensiert sind. Das ist praktisch, um eine Assemblierung von Hand zu prüfen.

## Materialien {#materials}

Reiter *Materialien* → **Material hinzufügen**:

| Feld | Symbol | Einheit | Hinweise |
| --- | --- | --- | --- |
| Elastizitätsmodul | $E$ | Spannungseinheit (standardmäßig MPa) | Stahl ≈ 210 000 MPa, Beton ≈ 30 000 MPa, Holz ≈ 11 000 MPa |
| Schubmodul | $G$ | Spannungseinheit | $G = E / (2(1+\nu))$; Stahl ≈ 81 000 MPa. Wirkt sich nur auf den Schubterm des Timoshenko-Balkens aus. |
| Dichte | $\rho$ | Masse / Länge³ (kg/m³, lb/ft³) | Wird mit dem Projekt gespeichert. Der statische Solver verwendet sie nicht (es gibt keine Eigengewichtslast). |
| Wärmeausdehnungskoeffizient | $\alpha$ | 1/K oder 1/°F | Wird von [Temperaturlasten](/de/essentials/loads#temperature-load) verwendet. Stahl: 12 × 10⁻⁶ /K. |

<div class="shots">

![Material hinzufügen](/screenshots/de/qs-material.webp)

![Die Materialbibliothek](/screenshots/de/qs-material-library.webp)

</div>

Die **Materialbibliothek** enthält fertige Materialien. Die Gruppe, die zu Ihren Einheiten passt, steht an erster Stelle.

- **Metalle:** Baustähle S235, S275, S355, nichtrostende Stähle, Gusseisen, Aluminiumlegierungen, Kupfer, Messing, Bronze, Titan; US-Stähle ASTM A992, A36, A572 Gr. 50 und HSS A500 Gr. C.
- **Beton:** Normal- und Leichtbeton, Festigkeitsklassen C25/30, C30/37, C40/50 sowie f′c = 4 ksi und 5 ksi.
- **Holz:** C24, GL24h, GL32h.
- **Sonstige:** Glas, GFK, CFK, HDPE, PVC, PMMA, Polycarbonat.

Öffnen Sie sie mit der Schaltfläche in der Werkzeugleiste oder über *Oder aus der Bibliothek auswählen* im Dialog *Material hinzufügen*.

Ein Material, das noch von Elementen verwendet wird, lässt sich nicht löschen; weisen Sie diesen Elementen zuerst ein anderes zu.

## Querschnitte {#cross-sections}

Reiter *Querschnitte* → **Querschnitt hinzufügen**:

| Feld | Symbol | Einheit | Hinweise |
| --- | --- | --- | --- |
| Fläche | $A$ | Flächeneinheit | Dehnsteifigkeit $EA$ |
| Flächenträgheitsmoment | $I_y$ | Einheit des Flächenträgheitsmoments | Biegesteifigkeit $EI_y$ um die Achse senkrecht zur Zeichenebene |
| Höhe | $h$ | Einheit der Querschnittsabmessungen | Für Temperaturgradienten (Krümmung $= \alpha\,\Delta T / h$) |
| Schubkoeffizient | $k$ | – | Schubkorrekturfaktor nach Timoshenko: Die wirksame Schubfläche ist $kA$. `1` vernachlässigt die Schubverformung nahezu, etwa 0,83 für Rechtecke, $A_{Steg}/A$ für I-Profile. |

Die **Querschnittsbibliothek** liefert Näherungswerte für Rechtecke, Quadrate und Kreise, IPE- und HEA-Profile, RHS- und CHS-Hohlprofile sowie die AISC-W-Profile und HSS (rechteckig und rund). Ihre Schubkoeffizienten richten sich nach der Form: $h\,t_w/A$ für I-Profile, $2ht/A$ für Rechteckhohlprofile, 0,5 für Rundrohre, 0,833 für Rechtecke und 0,9 für Kreise. Betrachten Sie die Werte als Ausgangspunkt und prüfen Sie sie anhand einer Profiltabelle, bevor Sie sich darauf verlassen.

![Die Querschnittsbibliothek](/screenshots/de/sections-library.webp){.shot-lg}

### Polygonale Querschnitte {#polygonal-sections}

Reiter *Querschnitte* → **Polygonaler Querschnitt** oder *Oder eine polygonale Form definieren* im Dialog *Querschnitt hinzufügen* öffnet einen Formeditor.

![Der Editor für polygonale Querschnitte mit der Vorlage I-Profil, ihren Hauptachsen und der Trägheitsellipse](/screenshots/de/sections-polygon.webp)

- **Beginnen** Sie mit einer Vorlage (Rechteck, I-, T-, L-, U-Profil, Rechteck- oder Kreishohlprofil, Kreis) und ihren Abmessungen und drücken Sie dann **Übernehmen**.
- **Bearbeiten** Sie die Form: Ziehen Sie Eckpunkte (sie rasten am **Rasterschritt** ein), klicken Sie auf die Mitte einer Kante, um einen Eckpunkt einzufügen, doppelklicken Sie auf einen Eckpunkt, um ihn zu entfernen, oder geben Sie Koordinaten in der Eckpunkttabelle ein. **Öffnung hinzufügen** fügt eine innere Kontur hinzu. **Auf Schwerpunkt zentrieren** verschiebt die Form so, dass ihr Schwerpunkt im Ursprung liegt.
- **Lesen** Sie die Fläche $A$, den Schwerpunkt, die auf den Schwerpunkt bezogenen Flächenträgheitsmomente $I_y$, $I_z$, $I_{yz}$, die Hauptträgheitsmomente $I_1$, $I_2$ mit dem Hauptachsenwinkel $\alpha$ (von $y$ zur Achse 1) und die Trägheitsradien ab. Die Zeichnung zeigt die Trägheitsellipse.

Beim Speichern werden $A$, $I_y$ und $h$ aus der Form übernommen. In der Tabelle erscheinen sie schreibgeschützt; nutzen Sie die Polygon-Schaltfläche in der Spalte *Aktionen*, um die Form erneut zu bearbeiten. Den Schubkoeffizienten $k$ geben Sie weiterhin selbst ein. Die Querschnittskoordinaten sind lokal und rechtshändig, mit $x$ aus dem Bildschirm heraus, $y$ nach links und $z$ nach unten.

Ist die Form nicht symmetrisch zur Rahmenebene (zum Beispiel ein L-Winkel), warnt der Editor, dass eine 2D-Berechnung nur dann exakt ist, wenn der Stab über seine ganze Länge gegen seitliches Ausweichen und Verdrehen gehalten ist, etwa durch eine Platte. Ist $I_{yz}$ nennenswert, wählen Sie, welche Biegesteifigkeit verwendet wird: **Über die Länge seitlich und gegen Verdrehen gehalten** ($I_y$) oder **Seitlich frei verformbar**, was einen kleineren Wert ergibt. Die Verdrehung ist in keinem der beiden Fälle berücksichtigt.

::: tip Schnelle Kontrollwerte
Rechteck $b \times h$: $A = bh$, $I_y = bh^3/12$. Vollkreis mit Durchmesser $d$: $A = \pi d^2/4$, $I_y = \pi d^4/64$.
:::

Materialien und Querschnitte können von beliebig vielen Elementen gemeinsam genutzt werden. Eine Wertänderung wirkt auf alle Elemente, die sie verwenden, und das Modell wird neu berechnet.
