# Ergebnisse von Hand prüfen

<Edubeam /> ist ein guter Ort, um die Gewohnheit zu üben, die jede Ingenieurin und jeder Ingenieur braucht: keiner Zahl trauen, die man nicht wenigstens überschlägig reproduzieren kann. Diese Seite gibt geschlossene Formeln für die klassischen Fälle und zeigt, was die App dafür ausgibt – bauen Sie jedes Modell selbst nach und vergleichen Sie.

Alle Fälle verwenden, sofern nicht anders angegeben, denselben Stahlquerschnitt: $E = 210\,000$ MPa, $G = 81\,000$ MPa, $A = 28{,}5$ cm², $I_y = 1943$ cm⁴, $h = 200$ mm, $k = 1$ (ein IPE 200).

$$EI = 210 \times 10^9 \cdot 1{,}943 \times 10^{-5} = 4{,}080 \times 10^6\ \text{Nm}^2$$

::: tip Warum die Zahlen leicht abweichen
EduBeam verwendet **Timoshenko**-Balken, die zur klassischen Biegedurchbiegung des Euler-Bernoulli-Balkens einen Schubanteil $\Delta w_s$ hinzufügen. Verdrehungen, Auflagerreaktionen und Schnittgrößen bleiben in statisch bestimmten Fällen davon unberührt. Bei schlanken Stäben ist der Zusatzterm winzig; die Tabellen unten weisen ihn explizit aus.
:::

## Einfeldträger unter Gleichlast

$L = 6$ m, $q = 12$ kN/m. Lager: Knoten 1 `Dx + Dz`, Knoten 2 `Dz`.

| Größe | Formel | Wert | EduBeam |
| --- | --- | --- | --- |
| Auflagerkräfte | $qL/2$ | 36 kN | 36 kN |
| $V_{max}$ | $qL/2$ | 36 kN | 36 kN |
| $M_{max}$ (Feldmitte) | $qL^2/8$ | 54 kNm | 54 kNm |
| Verdrehung am Auflager | $qL^3/(24EI)$ | 0,02647 rad | 0,02647 rad |
| Durchbiegung in Feldmitte | $5qL^4/(384EI)$ | 49,63 mm | 49,63 mm |

<ExampleStructure />

## Kragarm mit Einzellast am Ende

$L = 4$ m, $F = 18$ kN nach unten am freien Ende. Lager: Knoten 1 `Dx + Dz + Ry`.

| Größe | Formel | Wert | EduBeam |
| --- | --- | --- | --- |
| Vertikale Auflagerkraft | $F$ | 18 kN | 18 kN |
| Einspannmoment | $FL$ | 72 kNm | 72 kNm |
| Verdrehung am Ende | $FL^2/(2EI)$ | 0,03529 rad | 0,03529 rad |
| Durchbiegung am Ende (Biegung) | $FL^3/(3EI)$ | 94,11 mm | — |
| Durchbiegung am Ende (Schub) | $FL/(kGA)$ | 0,31 mm | — |
| Durchbiegung am Ende (gesamt) | Summe | 94,42 mm | 94,42 mm |

Der Schubanteil beträgt hier 0,3 %. Verkürzen Sie den Kragarm auf 1 m, werden daraus 5 % – genau dafür gibt es den Schubkoeffizienten.

<Figure>
  <Structure :show-loads="true" show-moment show-reactions :nodes="[{label: '1', coords: [0,0,0], dofs: [0,2,4]}, {label: '2', coords: [4,0,0], dofs: []}]" :elements="[{label: '1', nodes: ['1', '2']}]" :nodal-loads="[{target: '2', values: { 0: 0, 2: 18000, 4: 0 }}]" />
  <figcaption>Kragarm mit 18 kN Einzellast am Ende: Biegemoment und Auflagerreaktionen</figcaption>
</Figure>

## Beidseitig eingespannter Träger unter Gleichlast

$L = 6$ m, $q = 12$ kN/m. Beide Knoten `Dx + Dz + Ry`.

| Größe | Formel | Wert |
| --- | --- | --- |
| Auflagerkräfte | $qL/2$ | 36 kN |
| Einspannmoment | $qL^2/12$ | 36 kNm (negativ, Zug oben) |
| Feldmoment | $qL^2/24$ | 18 kNm (positiv) |
| Durchbiegung in Feldmitte | $qL^4/(384EI)$ | 9,93 mm |

Erzeugen Sie ihn aus dem Einfeldträger, indem Sie an beiden Knoten `Ry` anhaken, und beobachten Sie, wie sich die Momentenlinie verschiebt.

## Einseitig eingespannter Träger unter Gleichlast

$L = 6$ m, $q = 12$ kN/m. Knoten 1 `Dx + Dz + Ry`, Knoten 2 `Dz`.

| Größe | Formel | Wert |
| --- | --- | --- |
| Auflagerkraft an der Einspannung | $5qL/8$ | 45 kN |
| Auflagerkraft am Loslager | $3qL/8$ | 27 kN |
| Einspannmoment | $qL^2/8$ | 54 kNm (negativ) |
| Max. Feldmoment | $9qL^2/128$ bei $x = 5L/8$ von der Einspannung | 30,4 kNm bei 3,75 m |

Die App beschriftet das lokale Extremum automatisch, sodass Sie Wert und (aus der Lage am Stab) Stelle ablesen können.

## Zweistab-Fachwerk

Zwei Stäbe von Festlagern bei `(0, 0)` und `(4, 0)`, die sich bei `(2, −2)` treffen (Firstpunkt 2 m über den Lagern), bei beiden Stäben **beide Endgelenke** angehakt, vertikale Last $F = 20$ kN am Firstpunkt (nach unten, also `Fz = 20`).

Jeder Stab steht unter 45°, Länge $L = 2\sqrt{2}$ m. Aus Symmetrie trägt jeder

$$N = -\frac{F}{2 \sin 45^\circ} = -14{,}14\ \text{kN (Druck)}$$

und jedes Lager nimmt 10 kN vertikal und ±10 kN horizontal auf. Prüfen Sie die Darstellung **N (x)** und die Auflagerreaktionen.

## Temperaturgradient am Einfeldträger

$L = 8$ m, $\Delta T_b - \Delta T_t = -10$ K (oben wärmer), $\alpha = 12 \times 10^{-6}$, $h = 0{,}2$ m.

Der Balken kann sich frei krümmen, es entstehen also **keine Schnittgrößen**; die Krümmung beträgt

$$\kappa = \frac{\alpha\,(\Delta T_b - \Delta T_t)}{h} = \frac{12 \times 10^{-6} \cdot (-10)}{0{,}2} = -6 \times 10^{-4}\ \text{m}^{-1}$$

und die Durchbiegung in Feldmitte $\kappa L^2 / 8 = -4{,}8$ mm (nach oben). Halten Sie nun `Ry` an beiden Enden: die Krümmung wird verhindert und über die ganze Spannweite entsteht ein konstantes Moment $M = EI\kappa = 2{,}45$ kNm.

## Vorgegebene Verschiebung

Nehmen Sie den [einseitig eingespannten Träger](#einseitig-eingespannter-trager-unter-gleichlast) ohne Last und geben Sie am Loslager `Dz = 10 mm` vor (Auflagersenkung). Die Kraft, die nötig ist, das Ende eines Kragarms um $w$ nach unten zu drücken, ist $R = 3EIw/L^3 = 0{,}567$ kN, das Einspannmoment $RL = 3{,}40$ kNm. Fügen Sie die Gleichlast wieder hinzu, und die Ergebnisse überlagern sich linear.

## Tipps für eigene Kontrollen

- Behalten Sie den **Einheiten-Chip** im Blick; die meisten Abweichungen sind Einheitenfehler.
- Nutzen Sie das Fenster **Steifigkeitsmatrix**, um ein einzelnes Element mit dem [Theoriehandbuch](/de/elements/beam) zu vergleichen, wenn Sie das Weggrößenverfahren lernen.
- Lesen Sie exakte Zahlen im Reiter **Ergebnisse** und in den Tooltips ab, nicht aus den gerundeten Diagrammbeschriftungen.
- Übergeben Sie ein geprüftes Modell per **Modell teilen** an Kollegen oder Lehrende.
