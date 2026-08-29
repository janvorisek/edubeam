# Lasten

Alle Lasten liegen in einem **einzigen Lastfall** und wirken gleichzeitig. Zum Vergleich von Szenarien speichern Sie jedes als eigene Projektdatei oder eigenen Link.

<LoadShowcase />

## Vorzeichenkonvention in einem Satz

Global **x** zeigt nach rechts, global **z** zeigt **nach unten**. Ein positives `Fz` oder `fz` in globalen Koordinaten ist daher eine nach unten wirkende Last (Schwerkraftrichtung); ein positives Moment `My` dreht auf dem Bildschirm gegen den Uhrzeigersinn. Einzelheiten unter [Koordinatensystem & Vorzeichenkonvention](/de/elements/conventions).

## Knotenlasten

Reiter *Lasten* → **Knotenlast hinzufügen**, oder Klick auf einen Knoten → **Last hinzufügen**. Wählen Sie **Kraft/Moment**:

| Feld | Bedeutung | Einheit |
| --- | --- | --- |
| `Fx` | horizontale Kraft (+ → rechts) | Krafteinheit |
| `Fz` | vertikale Kraft (+ → unten) | Krafteinheit |
| `My` | Moment um y | Momenteneinheit |

Die Komponenten sind immer im **globalen** Koordinatensystem. Eine Pfeilvorschau im Dialog zeigt Richtung und Größe. Mehrere Knotenlasten an einem Knoten sind erlaubt und addieren sich.

### Vorgegebene Verschiebungen (Auflagersenkungen)

Wählen Sie im selben Dialog **Vorgegebene Verschiebung** (oder Klick auf einen gelagerten Knoten → **Verschiebung vorgeben**). Die Felder wechseln zu:

| Feld | Bedeutung | Einheit |
| --- | --- | --- |
| `Dx` | aufgezwungene horizontale Verschiebung | Längeneinheit |
| `Dz` | aufgezwungene vertikale Verschiebung (+ → unten) | Längeneinheit |
| `Ry` | aufgezwungene Verdrehung | rad |

Ein Wert kann nur für einen Freiheitsgrad eingegeben werden, der an diesem Knoten **gehalten** ist – nur Lager lassen sich verschieben. Jeder Knoten kann eine vorgegebene Verschiebung haben; bearbeiten Sie sie, statt eine zweite anzulegen. In einem statisch bestimmten Tragwerk erzeugt eine Auflagersenkung Verformungen, aber keine Schnittgrößen; in einem statisch unbestimmten beides.

## Elementlasten

Reiter *Lasten* → **Elementlast hinzufügen**, oder Klick auf ein Element → **Last hinzufügen**. Wählen Sie den **Lasttyp**; der Dialog zeigt eine Live-Vorschau der Last am Element.

### Gleichmäßig verteilte Last (Gleichlast)

| Feld | Bedeutung | Einheit |
| --- | --- | --- |
| `fx` | Last je Länge in x-Richtung | Kraft / Länge |
| `fz` | Last je Länge in z-Richtung | Kraft / Länge |
| **LCS** | anhaken, um `fx`, `fz` in den lokalen Achsen des Elements zu interpretieren | – |

Der häufigste Fall ist eine vertikale Schwerkraftlast: `fz > 0`, LCS aus. Bei einem geneigten Stab ist eine Last **senkrecht zum Stab** (z. B. Wind auf einen Sparren) `fz` mit **eingeschaltetem** LCS; eine vertikale Last je Meter *Grundrissprojektion* gibt es nicht direkt – rechnen Sie sie zuerst auf Meter Stablänge um.

### Trapezlast

| Feld | Bedeutung |
| --- | --- |
| `f1x`, `f1z` | Ordinate am **Anfangsknoten** |
| `f2x`, `f2z` | Ordinate am **Endknoten** |

Die Ordinaten verlaufen zwischen den Enden linear. Eine Dreieckslast ist einfach `f1z = 0`. Trapezlasten sind immer im **lokalen System des Elements** (das LCS-Kästchen ist fest eingeschaltet); bei horizontalen Stäben fallen lokales und globales z zusammen, es spielt also nur bei geneigten Stäben eine Rolle.

### Einzellast

Eine Einzelkraft oder ein Einzelmoment irgendwo **entlang** eines Elements – ohne zusätzlichen Knoten.

| Feld | Bedeutung |
| --- | --- |
| `Fx`, `Fz`, `My` | Kraft- / Momentenkomponenten |
| **Lastposition vom Anfangsknoten** | Abstand vom Anfangsknoten, `0 ≤ a ≤ L` |
| **LCS** | Komponenten in lokalen Achsen |

Die Querkraftlinie springt an der Laststelle um `Fz`, die Momentenlinie bekommt dort einen Knick; der Momentenwert an dieser Stelle wird automatisch beschriftet.

### Temperaturlast

| Feld | Bedeutung |
| --- | --- |
| **ΔT<sub>s</sub>** – axiale Temperaturänderung | gleichmäßige Erwärmung des gesamten Querschnitts → Verlängerung $\alpha\,\Delta T_s\,L$ |
| **ΔT<sub>b</sub> − ΔT<sub>t</sub>** – untere minus obere Faser | Temperaturunterschied über die Höhe → Krümmung $\alpha\,(\Delta T_b - \Delta T_t)/h$ |

Temperaturlasten verwenden **α** des Materials und die **Querschnittshöhe h**. Ein positives `ΔTb − ΔTt` (untere Faser wärmer) lässt das Element nach oben ausbauchen. In einem statisch bestimmten Tragwerk erzeugt Temperatur nur Verformungen; erst Zwängung (eingespannte Enden, Durchlaufwirkung, überzählige Stäbe) macht daraus Schnittgrößen.

## Lasten bearbeiten und entfernen

- Lasten erscheinen als Chips in den Tabellen *Knoten* / *Elemente* und als Zeilen im Reiter *Lasten*, wo die Komponenten (und das LCS-Kästchen) direkt bearbeitet werden.
- **Doppelklick** auf eine Last in der Ansicht oder Klick und **Last bearbeiten** öffnet den Bearbeitungsdialog.
- Last auswählen und <kbd>Entf</kbd> drücken oder den Papierkorb verwenden.
- An Knoten oder Elementen hängende Lasten werden mit diesen gelöscht und beim Kopieren mitkopiert.

## Was nicht verfügbar ist

- **Lastfälle und Kombinationen** – nur ein Lastfall.
- **Eigengewicht** – als Gleichlast eingeben: $f_z = \rho\,g\,A$ (z. B. IPE 200: 7850 × 9,81 × 0,00285 ≈ 0,22 kN/m).
- **Trapezlasten in globalen Koordinaten** an geneigten Stäben.
