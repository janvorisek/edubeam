# Lasten

Alle Lasten liegen in einem **einzigen Lastfall** und wirken gleichzeitig. Um Szenarien zu vergleichen, speichern Sie jedes als eigene Projektdatei oder eigenen Link.

![Alle Lastarten an einem Durchlaufträger: eine Knotenkraft, eine Gleichlast, eine Trapezlast, eine Einzellast, eine Temperaturlast und eine Auflagersenkung](/screenshots/de/loads-overview.webp)

<LoadShowcase />

## Vorzeichenkonvention in einem Satz {#sign-convention-in-one-line}

Global **x** zeigt nach rechts und global **z** **nach unten**. Ein positives `Fz` oder `fz` ist daher eine nach unten gerichtete Last wie die Schwerkraft, und ein positives Moment `My` dreht auf dem Bildschirm gegen den Uhrzeigersinn. Einzelheiten unter [Koordinatensystem & Vorzeichenkonventionen](/de/elements/conventions). Mit [Achsen mit y nach oben](/de/elements/conventions#y-up-axes) kehren sich Bezeichnungen und Vorzeichen der Vertikalen um: Die Schwerkraft ist dann ein negatives `Fy`.

## Knotenlasten {#nodal-loads}

Reiter *Lasten* → **Knotenlast hinzufügen** oder Klick auf einen Knoten → **Last hinzufügen**. Wählen Sie **Kraft/Moment**:

| Feld | Bedeutung | Einheit |
| --- | --- | --- |
| `Fx` | horizontale Kraft (positiv nach rechts) | Krafteinheit |
| `Fz` | vertikale Kraft (positiv nach unten) | Krafteinheit |
| `My` | Moment um y (positiv gegen den Uhrzeigersinn) | Momenteneinheit |

![Knotenlast hinzufügen. Die Vorschau zeigt schon beim Tippen die Richtung.](/screenshots/de/loads-nodal.webp){.shot-md}

Die Komponenten beziehen sich immer auf das **globale** Koordinatensystem. Ein Knoten kann mehrere Knotenlasten tragen; sie addieren sich und werden übereinander gezeichnet.

### Vorgegebene Verschiebungen (Auflagersenkungen) {#prescribed-displacements-support-settlements}

Wählen Sie im selben Dialog **Vorgegebene Verschiebung** oder klicken Sie auf einen gelagerten Knoten → **Verschiebung vorgeben**. Die Felder wechseln zu:

| Feld | Bedeutung | Einheit |
| --- | --- | --- |
| `Dx` | aufgezwungene horizontale Verschiebung | Verschiebungseinheit |
| `Dz` | aufgezwungene vertikale Verschiebung (positiv nach unten) | Verschiebungseinheit |
| `Ry` | aufgezwungene Verdrehung | rad |

Einen Wert können Sie nur für einen Freiheitsgrad eingeben, der an diesem Knoten **gehalten** ist, denn nur Lager lassen sich verschieben. Jeder Knoten hat höchstens eine vorgegebene Verschiebung; bearbeiten Sie sie, statt eine zweite hinzuzufügen. In einem statisch bestimmten Tragwerk erzeugt eine Auflagersenkung Verschiebungen, aber keine Schnittgrößen; in einem statisch unbestimmten beides.

## Elementlasten {#element-loads}

Reiter *Lasten* → **Elementlast hinzufügen** oder Klick auf ein Element → **Last hinzufügen**. Wählen Sie den **Lasttyp**; der Dialog zeigt schon beim Tippen eine Vorschau der Last am Element.

### Gleichmäßig verteilte Last {#uniformly-distributed-load}

| Feld | Bedeutung | Einheit |
| --- | --- | --- |
| `fx` | Last je Länge in x-Richtung | Kraft / Länge |
| `fz` | Last je Länge in z-Richtung | Kraft / Länge |
| **LCS** | angehakt: `fx`, `fz` wirken in den lokalen Achsen des Elements; nicht angehakt: in den globalen Achsen | – |

**LCS** ist standardmäßig angehakt. Bei einem horizontalen, von links nach rechts gezeichneten Element sind lokale und globale Achsen gleich, es macht also keinen Unterschied. Bei einem geneigten Stab schon:

- eine Last **senkrecht zum Stab** (Wind auf einen Sparren) ist `fz` mit **angehaktem** LCS;
- eine **vertikale** Last je Meter Stablänge (Eigengewicht) ist `fz` mit **nicht angehaktem** LCS;
- eine vertikale Last je Meter *Grundrissprojektion* (Schnee) gibt es nicht direkt. Multiplizieren Sie sie zuerst mit $\cos\alpha$, wobei $\alpha$ die Neigung des Stabs ist, und geben Sie sie als vertikale Last ein.

### Trapezlast {#trapezoidal-load}

| Feld | Bedeutung |
| --- | --- |
| `f1x`, `f1z` | Lastordinate am **Anfangsknoten** |
| `f2x`, `f2z` | Lastordinate am **Endknoten** |

Die Ordinate verläuft linear vom Anfang zum Ende des Elements. Eine Dreieckslast hat `f1z = 0`. Trapezlasten wirken immer in den **lokalen Achsen des Elements** (das Kästchen LCS ist gesperrt); bei einem horizontalen Element ist das dasselbe wie global.

### Einzellast {#concentrated-load}

Eine Einzelkraft oder ein Einzelmoment an beliebiger Stelle **entlang** eines Elements, ohne dass ein zusätzlicher Knoten nötig ist.

| Feld | Bedeutung |
| --- | --- |
| `Fx`, `Fz`, `My` | Kraft- und Momentenkomponenten |
| **Lastposition vom Anfangsknoten** | Abstand vom Anfangsknoten, `0 ≤ a ≤ L` |
| **LCS** | Komponenten in lokalen Achsen |

Die Querkraftlinie springt an der Laststelle um `Fz`, und die Momentenlinie hat dort einen Knick; der Momentenwert an dieser Stelle wird automatisch beschriftet. Ein Einzelmoment `My` lässt stattdessen die Momentenlinie springen.

### Temperaturlast {#temperature-load}

| Feld | Bedeutung |
| --- | --- |
| **ΔT<sub>c</sub>**, axiale Temperaturänderung | gleichmäßige Änderung über den ganzen Querschnitt, ergibt eine Verlängerung $\alpha\,\Delta T_c\,L$ |
| **ΔT<sub>b</sub> − ΔT<sub>t</sub>**, Temperaturdifferenz | untere minus obere Faser, ergibt eine Krümmung $\alpha\,(\Delta T_b - \Delta T_t)/h$ |

Temperaturlasten verwenden das **α** des Materials und die **Höhe h** des Querschnitts. Ein positives `ΔTb − ΔTt` (unten wärmer) verlängert die untere Faser, sodass sich das Element wie ein Balken unter Schwerkraftlast nach unten durchbiegt. In einem statisch bestimmten Tragwerk erzeugt Temperatur nur Verschiebungen; erst Zwängung (eingespannte Enden, Durchlaufwirkung, überzählige Stäbe) macht daraus Schnittgrößen.

<div class="shots">

![Gleichmäßig verteilte Last](/screenshots/de/loads-udl.webp)

![Trapezlast](/screenshots/de/loads-trapezoidal.webp)

![Einzellast](/screenshots/de/loads-concentrated.webp)

![Temperaturlast](/screenshots/de/loads-temperature.webp)

</div>

## Lasten bearbeiten und entfernen {#editing-and-removing-loads}

- Jede Last ist eine Zeile im Reiter *Lasten*, wo Sie ihre Komponenten und das Kennzeichen LCS direkt bearbeiten können. Lasten erscheinen außerdem als Chips in den Tabellen *Knoten* und *Elemente*.
- **Doppelklicken** Sie in der Ansicht auf eine Last oder klicken Sie darauf und wählen Sie **Last bearbeiten**, um den Bearbeitungsdialog zu öffnen.
- Wählen Sie eine Last aus und drücken Sie <kbd>Entf</kbd> oder nutzen Sie das × in der Tabelle.
- Lasten an einem Knoten oder Element werden mit diesem gelöscht und beim Kopieren und Einfügen mitkopiert.

![Der Reiter Lasten: eine Zeile je Last, die Komponenten direkt bearbeitbar](/screenshots/de/loads-table.webp)

## Was nicht verfügbar ist {#what-is-not-available}

- **Lastfälle und Kombinationen.** Es gibt einen Lastfall.
- **Eigengewicht.** Geben Sie es als Gleichlast mit nicht angehaktem LCS ein: $f_z = \rho\,g\,A$. Für ein IPE 200: 7850 × 9,81 × 0,00285 ≈ 0,22 kN/m.
- **Trapezlasten in globalen Achsen** an geneigten Stäben.
