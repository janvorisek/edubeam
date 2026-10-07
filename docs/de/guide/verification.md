# Ergebnisse von Hand prüfen

<Edubeam /> ist ein guter Ort, um die Gewohnheit zu üben, die jede Ingenieurin und jeder Ingenieur braucht: keiner Zahl trauen, die man nicht wenigstens überschlägig nachvollziehen kann. Diese Seite enthält geschlossene Formeln für die klassischen Fälle und zeigt, was die App dafür ausgibt – so können Sie jedes Modell selbst aufbauen und vergleichen.

Vollständig durchgerechnete Beispiele mit Handrechnung finden Sie in den Tutorials [Dreigelenkrahmen](/de/tutorials/three-hinged-frame) und [ebenes Fachwerk](/de/tutorials/truss).

Sofern nicht anders angegeben, verwenden alle Fälle denselben Stahlquerschnitt: $E = 210\,000$ MPa, $G = 81\,000$ MPa, $A = 28{,}5$ cm², $I_y = 1943$ cm⁴, $h = 200$ mm, $k = 1$ (ein IPE 200).

$$EI = 210 \times 10^9 \cdot 1{,}943 \times 10^{-5} = 4{,}080 \times 10^6\ \text{Nm}^2$$

::: tip Warum die Zahlen leicht abweichen
EduBeam verwendet **Timoshenko**-Balken, die zur klassischen Biegedurchbiegung nach Euler-Bernoulli einen Schubanteil $\Delta w_s$ hinzufügen. Verdrehungen, Auflagerreaktionen und Schnittgrößen bleiben in statisch bestimmten Fällen davon unberührt. Bei schlanken Stäben ist der Zusatzterm winzig; die Tabellen unten weisen ihn explizit aus.
:::

## Einfeldträger unter Gleichlast {#simply-supported-beam-uniform-load}

$L = 6$ m, $q = 12$ kN/m. Lager: Knoten 1 `Dx + Dz`, Knoten 2 `Dz`.

| Größe | Formel | Wert | EduBeam |
| --- | --- | --- | --- |
| Auflagerkräfte | $qL/2$ | 36 kN | 36 kN |
| $V_{max}$ | $qL/2$ | 36 kN | 36 kN |
| $M_{max}$ (Feldmitte) | $qL^2/8$ | 54 kNm | 54 kNm |
| Endverdrehung | $qL^3/(24EI)$ | 0,02647 rad | 0,02647 rad |
| Durchbiegung in Feldmitte (Biegung) | $5qL^4/(384EI)$ | 49,63 mm | — |
| Durchbiegung in Feldmitte (Schub) | $qL^2/(8kGA)$ | 0,23 mm | — |
| Durchbiegung in Feldmitte (gesamt) | Summe | 49,86 mm | 49,86 mm |

Um die Durchbiegung in Feldmitte abzulesen, fügen Sie dort mit *Knoten hinzufügen* (Maus) → **Mit Struktur verbinden** einen Knoten hinzu; das Teilen des Elements ändert kein Ergebnis.

<ExampleStructure />

## Kragträger mit Einzellast am Ende {#cantilever-tip-load}

$L = 4$ m, $F = 18$ kN nach unten am freien Ende. Lager: Knoten 1 `Dx + Dz + Ry`.

| Größe | Formel | Wert | EduBeam |
| --- | --- | --- | --- |
| Vertikale Auflagerkraft | $F$ | 18 kN | 18 kN |
| Einspannmoment | $FL$ | 72 kNm | 72 kNm |
| Verdrehung am Kragende | $FL^2/(2EI)$ | 0,03529 rad | 0,03529 rad |
| Durchbiegung am Kragende (Biegung) | $FL^3/(3EI)$ | 94,11 mm | — |
| Durchbiegung am Kragende (Schub) | $FL/(kGA)$ | 0,31 mm | — |
| Durchbiegung am Kragende (gesamt) | Summe | 94,42 mm | 94,42 mm |

Der Schubanteil beträgt hier 0,3 %. Verkürzen Sie den Kragträger auf 1 m, werden daraus 5 % – genau dafür gibt es den Schubkoeffizienten.

<Figure>
  <Structure :show-loads="true" show-moment show-reactions :nodes="[{label: '1', coords: [0,0,0], dofs: [0,2,4]}, {label: '2', coords: [4,0,0], dofs: []}]" :elements="[{label: '1', nodes: ['1', '2']}]" :nodal-loads="[{target: '2', values: { 0: 0, 2: 18000, 4: 0 }}]" />
  <figcaption>Kragträger mit 18 kN Einzellast am Ende: Biegemoment und Auflagerreaktionen</figcaption>
</Figure>

## Beidseitig eingespannter Träger unter Gleichlast {#fixed–fixed-beam-uniform-load}

$L = 6$ m, $q = 12$ kN/m. Beide Knoten `Dx + Dz + Ry`.

| Größe | Formel | Wert |
| --- | --- | --- |
| Auflagerkräfte | $qL/2$ | 36 kN |
| Einspannmoment | $qL^2/12$ | 36 kNm (Stützmoment, Zug oben) |
| Feldmoment | $qL^2/24$ | 18 kNm (Feldmoment, Zug unten) |
| Durchbiegung in Feldmitte | $qL^4/(384EI) + qL^2/(8kGA)$ | 9,93 + 0,23 = 10,16 mm |

Bauen Sie ihn aus dem Einfeldträger auf, indem Sie an beiden Knoten `Ry` anhaken, und beobachten Sie, wie sich die Momentenlinie verschiebt.

## Einseitig eingespannter Träger unter Gleichlast {#propped-cantilever-uniform-load}

$L = 6$ m, $q = 12$ kN/m. Knoten 1 `Dx + Dz + Ry`, Knoten 2 `Dz`.

| Größe | Formel | Wert |
| --- | --- | --- |
| Auflagerkraft an der Einspannung | $5qL/8$ | 45 kN |
| Auflagerkraft am Loslager | $3qL/8$ | 27 kN |
| Einspannmoment | $qL^2/8$ | 54 kNm (Zug oben) |
| Max. Feldmoment | $9qL^2/128$ bei $x = 5L/8$ von der Einspannung | 30,4 kNm bei 3,75 m |

Die App beschriftet das lokale Extremum automatisch, sodass Sie sowohl den Wert als auch (aus der Lage entlang des Elements) die Stelle ablesen können.

## Zweistab-Fachwerk {#two-bar-truss}

Zwei Stäbe von Festlagern bei `(0, 0)` und `(4, 0)`, die sich bei `(2, −2)` treffen (Spitze 2 m höher), bei beiden Stäben **beide Endgelenke** angehakt, vertikale Last $F = 20$ kN an der Spitze (nach unten, also `Fz = 20`).

Jeder Stab ist um 45° geneigt, Länge $L = 2\sqrt{2}$ m. Aus Symmetrie trägt jeder

$$N = -\frac{F}{2 \sin 45^\circ} = -14{,}14\ \text{kN (Druck)}$$

und jedes Lager nimmt 10 kN vertikal und ±10 kN horizontal auf. Prüfen Sie die Darstellung **N (x)** und die Auflagerreaktionen.

## Temperaturgradient am Einfeldträger {#temperature-gradient-on-a-simply-supported-beam}

$L = 8$ m, $\Delta T_b - \Delta T_t = -10$ K (oben wärmer), $\alpha = 12 \times 10^{-6}$, $h = 0{,}2$ m.

Der Balken kann sich frei krümmen, es entstehen also **keine Schnittgrößen**; die Krümmung beträgt

$$\kappa = \frac{\alpha\,(\Delta T_b - \Delta T_t)}{h} = \frac{12 \times 10^{-6} \cdot (-10)}{0{,}2} = -6 \times 10^{-4}\ \text{m}^{-1}$$

und die Durchbiegung in Feldmitte $\kappa L^2 / 8 = -4{,}8$ mm (nach oben). Halten Sie nun `Ry` an beiden Enden: Die Krümmung wird verhindert, und über die ganze Spannweite entsteht ein konstantes Moment $M = EI\kappa = 2{,}45$ kNm.

## Vorgegebene Verschiebung {#prescribed-displacement}

Nehmen Sie den [einseitig eingespannten Träger](#propped-cantilever-uniform-load) ohne Last und geben Sie am Loslager `Dz = 10 mm` vor (eine Auflagersenkung). Die Kraft, die nötig ist, um das Ende eines Kragträgers um $w$ nach unten zu drücken, beträgt $R = 3EIw/L^3 = 0{,}567$ kN, das Einspannmoment $RL = 3{,}40$ kNm. Fügen Sie die Gleichlast wieder hinzu, und die Ergebnisse überlagern sich linear.

## Tipps für eigene Kontrollen {#tips-for-your-own-checks}

- Behalten Sie den **Einheiten-Chip** im Blick; die meisten Abweichungen sind Einheitenfehler.
- Nutzen Sie das Fenster **Steifigkeitsmatrix**, um ein einzelnes Element mit dem [Theoriehandbuch](/de/elements/beam) zu vergleichen, wenn Sie das Weggrößenverfahren lernen.
- Lesen Sie exakte Zahlen im Reiter **Ergebnisse** und in den Tooltips beim Überfahren mit der Maus ab, nicht aus den gerundeten Diagrammbeschriftungen. **CSV exportieren** oder **Kopieren** im Reiter Ergebnisse liefert Ihnen auch die Auflagerreaktionen, bereit für eine Tabellenkalkulation.
- Stellen Sie in den Einstellungen das **Zahlenformat** auf *Automatisch*, um `40` statt `4 · 10¹` zu lesen.
- Geben Sie ein geprüftes Modell mit **Modell teilen** an Kollegen oder Lehrende weiter.
