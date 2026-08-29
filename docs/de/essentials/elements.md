# Elemente, Materialien & Querschnitte

## Das Balkenelement

<Edubeam /> hat einen einzigen Elementtyp: einen **ebenen Timoshenko-Balken** in der x–z-Ebene mit drei Freiheitsgraden an jedem Ende (`Dx`, `Dz`, `Ry`). Er überträgt Normalkraft, Querkraft und Biegemoment und berücksichtigt die Schubverformung (deshalb hat der Querschnitt einen Schubkoeffizienten). Die vollständige Formulierung steht im [Theoriehandbuch](/de/elements/beam).

<TrussElement :moment="true" caption="Ebenes Balkenelement – drei Freiheitsgrade je Knoten" />

Die Verläufe entlang eines Elements sind für das lineare Modell exakt; ein Element je Stab genügt. Zwischenknoten brauchen Sie nur dort, wo ein Lager, ein Gelenk, ein Querschnittswechsel oder ein Knoten für eine Last nötig ist.

### Elemente hinzufügen

| Methode | Vorgehen |
| --- | --- |
| **Dialog** | Reiter *Elemente* → **Element hinzufügen** (oder Menü der Zeichenfläche → *Element hinzufügen*): **Anfangsknoten**, **Endknoten**, Material und Querschnitt wählen. |
| **Maus** | Reiter *Elemente* → **Per Maus hinzufügen** (oder <kbd>Strg</kbd> beim Menüpunkt der Zeichenfläche). Klick auf einen Knoten startet, Klick auf den nächsten Knoten verbindet – ein Klick auf leere Fläche erzeugt dort einen neuen Knoten. Weiterklicken zeichnet einen Polygonzug; <kbd>Esc</kbd> beendet. Das erste Material und der erste Querschnitt im Modell werden automatisch zugewiesen. |

::: warning Erst Materialien und Querschnitte
Ein Element kann ohne Material und Querschnitt nicht existieren. Fehlen sie, zeigt die Ansicht *Keine Materialien definiert.* / *Keine Querschnitte definiert.* mit der Verknüpfung **Neu hinzufügen**.
:::

### Stabrichtung

Die **lokale x-Achse** verläuft vom Anfangs- zum Endknoten. Das ist wichtig für:

- Lasten in lokalen Koordinaten (`fx`, `fz` im LKS),
- die *Lastposition vom Anfangsknoten* bei Einzellasten,
- die Reihenfolge der Stabendkräfte (`X12, Z12, M12` am Anfang, `X21, Z21, M21` am Ende) in der Ergebnistabelle.

Mit **Knotenreihenfolge tauschen** in der Tabelle *Elemente* kehren Sie ein Element um.

### Endgelenke

Jedes Element hat zwei Kästchen **Endgelenke** (Anfang / Ende) in der Tabelle *Elemente*. Ein angehaktes Gelenk gibt das Biegemoment an diesem Ende frei (statische Kondensation des Drehfreiheitsgrads), also:

- ein Gelenk → Momentengelenk in einem Rahmen oder Durchlaufträger (Moment dort null);
- beide Gelenke → **Fachwerkstab**, der nur Normalkraft überträgt.

<TrussElement :hinges="[true, true]" caption="Beide Enden gelenkig → Fachwerkstab" />

Treffen zwei Elemente in einem Knoten zusammen und nur eines ist gelenkig, überträgt das andere weiterhin ein Moment in den Knoten – geben Sie also das Element frei, das gelenkig angeschlossen sein soll, nicht „den Knoten“.

### Bearbeiten und Löschen

Klicken Sie ein Element an und nutzen Sie das Kontextmenü (**Element bearbeiten**, **Last hinzufügen**, **Steifigkeitsmatrix**, **Löschen**) oder bearbeiten Sie direkt in der Tabelle *Elemente*. Das Löschen eines Elements entfernt auch seine Lasten. **Steifigkeitsmatrix** öffnet ein schwebendes Fenster mit der 6 × 6-Elementmatrix in lokalen und globalen Koordinaten – praktisch zur Kontrolle der Handrechnung im Weggrößenverfahren.

## Materialien

Reiter *Materialien* → **Material hinzufügen**:

| Feld | Symbol | Einheit | Hinweis |
| --- | --- | --- | --- |
| Elastizitätsmodul | $E$ | Spannungseinheit (Standard MPa) | Stahl ≈ 210 000 MPa, Beton ≈ 30 000 MPa, Holz ≈ 11 000 MPa |
| Schubmodul | $G$ | Spannungseinheit | $G = E / (2(1+\nu))$; Stahl ≈ 81 000 MPa. Beeinflusst nur den Schubterm des Timoshenko-Balkens. |
| Dichte | $\rho$ | kg/m³ | Wird mit dem Projekt gespeichert; der statische Solver verwendet sie nicht (kein automatisches Eigengewicht). |
| Wärmeausdehnungskoeffizient | $\alpha$ | 1/K | Für [Temperaturlasten](/de/essentials/loads#temperaturlast). Stahl 12 × 10⁻⁶. |

Die **Materialbibliothek** bietet fertige Einträge: Baustähle (S235, S275, S355, nichtrostend), Aluminiumlegierungen, Kupfer/Messing/Bronze, Titan, Betonfestigkeitsklassen, Holz (C24, GL24h, GL32h), Glas, GFK/CFK und gängige Kunststoffe. Auswahl im Bibliotheksdialog oder über *Oder aus der Bibliothek auswählen* im Dialog *Material hinzufügen*.

## Querschnitte

Reiter *Querschnitte* → **Querschnitt hinzufügen**:

| Feld | Symbol | Einheit | Hinweis |
| --- | --- | --- | --- |
| Fläche | $A$ | Flächeneinheit | Dehnsteifigkeit $EA$ |
| Flächenträgheitsmoment | $I_y$ | m⁴ (oder gewählte Einheit) | Biegesteifigkeit $EI_y$ um die Biegeachse in der Ebene |
| Höhe | $h$ | Längeneinheit | Für ungleichmäßige Temperaturlasten (Krümmung $= \alpha\,\Delta T / h$) |
| Schubkoeffizient | $k$ | – | Schubkorrekturfaktor: wirksame Schubfläche $= kA$. `1` unterdrückt die Schubverformung (nahezu); ≈ 0,83 für Rechtecke; bei I-Profilen $A_{Steg}/A$. |

Die **Querschnittsbibliothek** liefert Näherungswerte für Rechtecke, Quadrate, Kreise, IPE- und HEA-Profile, RHS- und CHS-Hohlprofile. Betrachten Sie sie als Ausgangspunkt und prüfen Sie die Werte in einer Profiltabelle, bevor Sie sich darauf verlassen.

::: tip Schnelle Kontrollwerte
Rechteck $b \times h$: $A = bh$, $I_y = bh^3/12$. Vollkreis mit Durchmesser $d$: $A = \pi d^2/4$, $I_y = \pi d^4/64$.
:::

Materialien und Querschnitte können von beliebig vielen Elementen gemeinsam genutzt werden; eine Wertänderung wirkt auf alle Elemente, die sie verwenden, und das Modell wird neu berechnet.
