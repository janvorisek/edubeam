# Ergebnisse & Diagramme

<Edubeam /> berechnet das Modell nach jeder Änderung neu, höchstens einige Male pro Sekunde; die Ergebnisse sind also immer aktuell. Es gibt keine Schaltfläche *Berechnen*. Wird nichts gezeichnet, lässt sich das Modell noch nicht berechnen; die Meldung oben links in der Ansicht sagt, warum (siehe [Fehlerbehebung](/de/reference/troubleshooting)).

Die Bilder auf dieser Seite zeigen alle dasselbe Modell: den [Dreigelenkrahmen](/de/tutorials/three-hinged-frame) unter 10 kN/m.

## Darstellungen in der Ansicht {#overlays-in-the-viewer}

Schalten Sie sie in den **Anzeigeoptionen** oben rechts in der Ansicht ein und aus (die Schaltfläche ⚙ blendet sie ein oder aus).

| Darstellung | Farbe (Standard) | Hinweise |
| --- | --- | --- |
| **Verformte Form** | grau | Überhöht: Die größte Verschiebung wird *Ergebnisskalierung* Pixel lang gezeichnet. Standardmäßig eingeschaltet. |
| **N (x)**, Normalkraft | blau | Zug ist positiv. Entlang eines Elements konstant, sofern keine Axiallast darauf wirkt. |
| **V<sub>z</sub> (x)**, Querkraft | grün | Linear unter Gleichlast, quadratisch unter Trapezlast, mit einem Sprung an einer Einzellast. |
| **M<sub>y</sub> (x)**, Biegemoment | rot | Positiv bei Zug in der unteren Faser. Beschriftet an beiden Enden, an Einzellasten und an jedem lokalen Extremum (wo V = 0). Standardmäßig eingeschaltet. |
| **Auflagerreaktionen** | violett | Ein Pfeil und ein Wert für jeden gehaltenen Freiheitsgrad. Standardmäßig eingeschaltet. |

Die Werte stehen an den charakteristischen Stellen jedes Diagramms. Ausrichtung der Beschriftungen, Größe der Verläufe und Farben lassen sich in den [Einstellungen](/de/essentials/units-settings#viewer-settings) ändern.

<div class="shots">

![Normalkraft N: Beide Stützen tragen 40 kN Druck, der Riegel 20 kN](/screenshots/de/results-normal.webp)

![Querkraft V: 20 kN in den Stützen; im Riegel 40 kN an den Ecken, zum Gelenk hin auf null abfallend](/screenshots/de/results-shear.webp)

![Biegemoment M: −80 kNm in beiden Ecken, null an den Fußpunkten und im Gelenk](/screenshots/de/results-moment.webp)

![Verformungsfigur (überhöht): Das Gelenk in C senkt sich](/screenshots/de/results-deformed.webp)

</div>

![Auflagerreaktionen: 40 kN vertikal und 20 kN horizontal an jedem Festlager](/screenshots/de/results-reactions.webp){.shot-lg}

### Das Vorzeichen ablesen {#reading-the-sign}

Lesen Sie das Vorzeichen eines Werts an seiner Beschriftung ab, nicht an der Seite des Stabs, auf der das Diagramm gezeichnet ist. Ein negatives Biegemoment bedeutet Zug oben: Zug in der oberen Faser eines Balkens oder an der Außenseite einer Rahmenecke.

## Tooltips beim Überfahren {#hover-tooltips}

Mit der Maus auf ein Objekt zu zeigen ist der schnellste Weg, einen Wert abzulesen:

- **Knoten**: `ux`, `uz` und `φy` (Verschiebungen in der Verschiebungseinheit, Verdrehung in Radiant).
- **Element**: seine Bezeichnung, sein Querschnitt und sein Material.
- **Last**: ihre Komponenten.

Auf einem Touchscreen tippen Sie stattdessen auf das Objekt. Dieselben Details erscheinen in seinem Auswahlpanel.

![Zeigen auf Knoten 2 des Balkens aus dem Schnellstart](/screenshots/de/ui-hover.webp){.shot-sm}

## Reiter Ergebnisse {#results-tab}

Der Reiter **Ergebnisse** in der unteren Leiste hat zwei Tabellen, zwischen denen Sie mit **Knotenergebnisse** und **Elementergebnisse** umschalten.

### Knotenergebnisse {#nodal-results}

Eine Zeile je Knoten mit **Dx**, **Dz** (Verschiebungseinheit) und **Ry** (rad). Die Vorzeichen folgen den globalen Achsen: Ein positives `Dz` zeigt nach unten, ein positives `Ry` dreht auf dem Bildschirm gegen den Uhrzeigersinn.

![Knotenergebnisse des Dreigelenkrahmens (Zahlenformat: Automatisch)](/screenshots/de/results-nodal.webp)

### Elementergebnisse {#element-results}

Eine Zeile je Element mit den **Stabendkräften im lokalen Koordinatensystem des Elements**:

| Spalte | Bedeutung |
| --- | --- |
| `X12`, `Z12`, `M12` | Normalkraft, Querkraft und Moment, die am **Anfangsknoten** auf das Element wirken |
| `X21`, `Z21`, `M21` | dasselbe am **Endknoten** |

![Elementergebnisse des Dreigelenkrahmens](/screenshots/de/results-element.webp)

Das sind die Kräfte, die die Knoten auf das Element ausüben: die Elementsteifigkeitsmatrix mal den Stabendverschiebungen, abzüglich der äquivalenten Knotenlasten. Sie folgen den lokalen Achsen, nicht der N-V-M-Konvention der Diagramme:

- Für den Einfeldträger mit 6 m Spannweite aus dem [Schnellstart](/de/guide/quick-start): `Z12 = Z21 = −36 kN`. Beide Lager drücken den Balken nach oben, also in −z.
- Für einen am Anfangsknoten eingespannten Kragträger mit einer nach unten gerichteten Einzellast von 18 kN am Ende: `Z12 = −18 kN`, `M12 = +72 kNm`, `Z21 = +18 kN`, `M21 = 0`.
- Für Stütze 1 des Rahmens (A unten, B oben): `X12 = +40 kN` drückt entlang der lokalen x-Achse in das Element hinein, das sind 40 kN Druck.

### CSV exportieren und Kopieren {#export-csv-and-copy}

**CSV exportieren** lädt `edubeam-results.csv` mit beiden Tabellen herunter, in den auf dem Bildschirm angezeigten Einheiten und bereit für eine Tabellenkalkulation. Die Knotentabelle enthält zusätzlich die **Auflagerreaktionen** `Rx`, `Rz`, `My`. **Kopieren** legt dieselben Tabellen als tabulatorgetrennten Text in die Zwischenablage, der sich direkt in Excel, LibreOffice oder Google Sheets einfügen lässt. Im Export heißen die Stabendkräfte `N1 V1 M1 N2 V2 M2`.

### Steifigkeitsmatrix {#stiffness-matrix}

Wählen Sie **Steifigkeitsmatrix** im Panel eines Elements oder in seiner Tabellenzeile, um ein Fenster mit der 6 × 6-Steifigkeitsmatrix des Elements in globalen Koordinaten zu öffnen – nützlich, um in einer Lehrveranstaltung zum Weggrößenverfahren die Assemblierung von Hand zu prüfen. Die Formeln stehen im [Theoriehandbuch](/de/elements/beam).

## Zahlenformat {#number-format}

Ergebnisse werden mit fünf signifikanten Stellen angezeigt. **Einstellungen → Sprache & Region → Zahlenformat** bestimmt, wie sie geschrieben werden:

| Format | 40 000 wird geschrieben als | Geeignet für |
| --- | --- | --- |
| **Wissenschaftlich** (Standard) | 4 · 10⁴ | Werte über viele Größenordnungen |
| **Technisch** | 40 · 10³ | passend zu den Vorsätzen Kilo / Mega |
| **Automatisch** | 40000 | alltägliche Zahlen in der Lehre |

Automatisch schreibt Werte von 0,001 bis 100 000 als gewöhnliche Zahlen und wechselt außerhalb dieses Bereichs zu Zehnerpotenzen. Das Dezimaltrennzeichen folgt der Sprache.

## Genauigkeit {#precision-and-accuracy}

- Das Balkenelement ist für das lineare Timoshenko-Modell unter Knoten-, Gleich-, Trapez-, Einzel- und Temperaturlasten exakt; die Ergebnisse hängen also **nicht** von der Anzahl der Elemente ab.
- Gerechnet wird in doppelter Genauigkeit. Winzige Werte wie `1,5 · 10⁻¹⁸` sind Rundungsfehler und bedeuten null.
- Durchbiegungen enthalten die **Schubverformung**. Bei schlanken Stäben erhöht das den Wert nach Euler-Bernoulli um einen Bruchteil eines Prozents, bei hohen oder kurzen Stäben können es mehrere Prozent sein. Um sie zu unterdrücken, setzen Sie den Schubkoeffizienten des Querschnitts auf einen großen Wert.

## Ergebnisse in einem Bericht {#results-in-a-report}

- **☰ → Bild exportieren** (<kbd>Strg</kbd>+<kbd>P</kbd>) speichert die Zeichnung mit den gewählten Darstellungen als PNG oder SVG. Siehe [Bild exportieren](/de/essentials/import-export#export-an-image).
- **Ergebnisse → CSV exportieren** oder **Kopieren** liefert die Zahlen.
- **Modell teilen** liefert einen Link, mit dem Leserinnen und Leser das Modell selbst öffnen können.
