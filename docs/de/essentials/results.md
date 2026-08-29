# Ergebnisse & Diagramme

<Edubeam /> löst das Modell nach jeder Änderung automatisch (auf wenige Berechnungen pro Sekunde gedrosselt), die Ergebnisse sind also immer aktuell. Es gibt keine Schaltfläche *Berechnen*. Wird nichts gezeichnet, ist das Modell noch nicht lösbar – siehe [Fehlerbehebung](/de/reference/troubleshooting).

## Darstellungen in der Ansicht

Ein- und ausschalten im **Anzeigepanel** (Schaltfläche ⚙ oben rechts in der Ansicht).

| Darstellung | Farbe (Standard) | Hinweis |
| --- | --- | --- |
| **Verformte Form** | grau | Überhöht; so skaliert, dass die größte Verschiebung der *Ergebnisskalierung* in Pixeln entspricht. |
| **N (x)** – Normalkraft | blau | Zug positiv. Entlang eines Elements konstant, sofern keine axiale Streckenlast wirkt. |
| **V<sub>z</sub> (x)** – Querkraft | grün | Linear unter Gleichlast, quadratisch unter Trapezlast, Sprung an Einzellasten. |
| **M<sub>y</sub> (x)** – Biegemoment | rot | Positiv bei Zug in der unteren Faser. Beschriftet an beiden Enden, an Einzellasten und an jedem lokalen Extremum (wo V = 0). |
| **Auflagerreaktionen** | violett | Pfeil und Wert für jeden gehaltenen Freiheitsgrad. |

Die Diagramme werden entlang der Elemente gezeichnet, mit Werten an den charakteristischen Stellen. Ausrichtung der Beschriftungen und Maßstab aller Verläufe lassen sich in den [Einstellungen](/de/essentials/units-settings#anzeigeeinstellungen) ändern.

### Normalkraft

<Figure>
    <Structure :show-loads="true" show-normal-force :nodes="[{label: 'a', coords: [0,0,0], dofs: [0,2, 4]}, {label: 'b', coords: [10,0,0], dofs: []}]" :elements="[{label: '1', nodes: ['a', 'b']}]" :nodal-loads="[{target: 'b', values: { 0: -100, 2: 0, 4: 0 }}]" />
    <figcaption>Kragarm, am freien Ende durch eine horizontale Kraft gedrückt: N ist konstant und negativ</figcaption>
</Figure>

### Querkraft

<Figure>
  <Structure :show-loads="true" show-shear-force :nodes="[{label: 'a', coords: [0,0,0], dofs: [0,2, 4]}, {label: 'b', coords: [10,0,0], dofs: []}]" :elements="[{label: '1', nodes: ['a', 'b']}]" :nodal-loads="[{target: 'b', values: { 0: 0, 2: 10, 4: 0 }}]" />
 <figcaption>Kragarm mit vertikaler Einzellast am Ende: V ist konstant</figcaption>
</Figure>

### Biegemoment

<Figure>
  <Structure :show-loads="true" show-moment :nodes="[{label: 'a', coords: [0,0,0], dofs: [0,2, 4]}, {label: 'b', coords: [10,0,0], dofs: []}]" :elements="[{label: '1', nodes: ['a', 'b']}]" :nodal-loads="[{target: 'b', values: { 0: 0, 2: 10, 4: 0 }}]" />
 <figcaption>Derselbe Kragarm: M wächst linear bis F·L an der Einspannung</figcaption>
</Figure>

### Verformte Form

<Figure>
  <Structure :show-loads="true" show-deformed-shape :nodes="[{label: 'a', coords: [0,0,0], dofs: [0,2, 4]}, {label: 'b', coords: [10,0,0], dofs: []}]" :elements="[{label: '1', nodes: ['a', 'b']}]" :nodal-loads="[{target: 'b', values: { 0: 0, 2: 10, 4: 0 }}]" />
  <figcaption>Biegelinie (überhöht) des Kragarms</figcaption>
</Figure>

### Auflagerreaktionen

<Structure :show-loads="true" show-reactions :nodes="[{label: 'a', coords: [0,0,0], dofs: [0,2, 4]}, {label: 'b', coords: [10,0,0], dofs: []}]" :elements="[{label: '1', nodes: ['a', 'b']}]" :nodal-loads="[{target: 'b', values: { 0: 0, 2: 10, 4: 0 }}]" />

## Tooltips

Der Mauszeiger in der Ansicht ist der schnellste Weg, einen Wert abzulesen:

- **Knoten** → `ux`, `uz`, `φy` (Verschiebungen in der Längeneinheit, Verdrehung in Radiant).
- **Element** → Bezeichnung, Querschnitt und Material.
- **Last** → ihre Komponenten.

## Reiter Ergebnisse

Der Reiter **Ergebnisse** in der Fußleiste hat zwei Ansichten:

### Knotenergebnisse

Eine Zeile je Knoten mit **Dx**, **Dz** (Längeneinheit) und **Ry** (rad). Die Vorzeichen folgen den globalen Achsen: positives `Dz` nach unten, positives `Ry` gegen den Uhrzeigersinn.

<figure>

![Knotenergebnisse](/results_nodes.png)

</figure>

### Elementergebnisse

Eine Zeile je Element mit den **Stabendkräften im lokalen Koordinatensystem des Elements**:

| Spalte | Bedeutung |
| --- | --- |
| `X12`, `Z12`, `M12` | Normalkraft, Querkraft und Moment, die am **Anfangsknoten** auf das Element wirken |
| `X21`, `Z21`, `M21` | dasselbe am **Endknoten** |

Das sind die Kräfte, die die Knoten auf das Element ausüben (Elementsteifigkeitsmatrix mal Stabendverschiebungen, abzüglich der äquivalenten Knotenlasten). Für einen Einfeldträger von 6 m unter 12 kN/m erhalten Sie `Z12 = Z21 = −36 kN`: beide Lager drücken den Balken nach oben (negatives z). Für einen am Anfangsknoten eingespannten Kragarm mit 18 kN nach unten am Ende: `Z12 = −18`, `M12 = +72 kNm`, `Z21 = +18`, `M21 = 0`.

<figure>

![Elementergebnisse](/results_elements.png)

</figure>

### Steifigkeitsmatrix

Wählen Sie **Steifigkeitsmatrix** im Kontextmenü eines Elements oder in der Tabellenzeile, um ein schwebendes Fenster mit der 6 × 6-Steifigkeitsmatrix des Elements in lokalen und globalen Koordinaten zu öffnen – nützlich zur Kontrolle der Handrechnung im Weggrößenverfahren. Die Formeln stehen im [Theoriehandbuch](/de/elements/beam).

## Genauigkeit

- Das Balkenelement ist für das lineare Timoshenko-Modell unter Knoten-, Gleich-, Trapez-, Einzel- und Temperaturlasten exakt; die Ergebnisse hängen **nicht** von der Elementanzahl ab.
- Tabellen zeigen vier signifikante Stellen; intern wird in doppelter Genauigkeit gerechnet.
- Durchbiegungen enthalten die **Schubverformung** (Timoshenko). Bei schlanken Stäben macht das gegenüber den Formeln des Euler-Bernoulli-Balkens einen Bruchteil eines Prozents aus; bei hohen oder kurzen Stäben können es mehrere Prozent sein. Zum Unterdrücken setzen Sie den Schubkoeffizienten des Querschnitts auf einen großen Wert.

## Ergebnisse in einen Bericht übernehmen

Einen Tabellenexport gibt es nicht; markieren und kopieren Sie den Tabellentext oder machen Sie einen Screenshot der Ansicht. Zum Weitergeben eines Modells nutzen Sie [Modell teilen](/de/essentials/import-export).
