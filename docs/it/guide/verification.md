---
description: "Verifiche in forma chiusa dei risultati di EduBeam: trave appoggiata, mensola, trave incastrata e incastro-appoggio, travatura a due aste, gradiente termico e spostamento imposto."
---

# Verificare i risultati a mano

<Edubeam /> è il posto giusto per allenare l'abitudine di cui ogni ingegnere ha bisogno: non fidarti mai di un numero che non sai riprodurre almeno a grandi linee. Questa pagina riporta le formule in forma chiusa per i casi classici e mostra cosa restituisce l'app, così puoi costruire ogni modello da solo e confrontare.

Per esempi svolti completi con verifiche a mano, vedi i tutorial sul [telaio a tre cerniere](/it/tutorials/three-hinged-frame) e sulla [travatura reticolare piana](/it/tutorials/truss).

Salvo indicazione contraria, tutti i casi usano la stessa sezione in acciaio: $E = 210\,000$ MPa, $G = 81\,000$ MPa, $A = 28{,}5$ cm², $I_y = 1943$ cm⁴, $h = 200$ mm, $k = 1$ (una IPE 200).

$$EI = 210 \times 10^9 \cdot 1{,}943 \times 10^{-5} = 4{,}080 \times 10^6\ \text{Nm}^2$$

::: tip Perché i numeri differiscono leggermente
EduBeam usa travi di **Timoshenko**, che aggiungono una freccia da taglio $\Delta w_s$ alla classica freccia flessionale di Eulero–Bernoulli. Rotazioni, reazioni e sollecitazioni non cambiano nei casi isostatici. Per aste snelle il termine aggiuntivo è minimo; le tabelle qui sotto lo riportano esplicitamente.
:::

## Trave semplicemente appoggiata, carico uniforme {#simply-supported-beam-uniform-load}

$L = 6$ m, $q = 12$ kN/m. Vincoli: nodo 1 `Dx + Dz`, nodo 2 `Dz`.

| Grandezza | Formula | Valore | EduBeam |
| --- | --- | --- | --- |
| Reazioni | $qL/2$ | 36 kN | 36 kN |
| $V_{max}$ | $qL/2$ | 36 kN | 36 kN |
| $M_{max}$ (mezzeria) | $qL^2/8$ | 54 kNm | 54 kNm |
| Rotazione all'estremità | $qL^3/(24EI)$ | 0,02647 rad | 0,02647 rad |
| Freccia in mezzeria (flessione) | $5qL^4/(384EI)$ | 49,63 mm | — |
| Freccia in mezzeria (taglio) | $qL^2/(8kGA)$ | 0,23 mm | — |
| Freccia in mezzeria (totale) | somma | 49,86 mm | 49,86 mm |

Per leggere la freccia in mezzeria, aggiungi lì un nodo con *Aggiungi nodo* (mouse) → **Collega alla struttura**; dividere l'elemento non cambia alcun risultato.

<ExampleStructure />

## Mensola, carico all'estremità {#cantilever-tip-load}

$L = 4$ m, $F = 18$ kN verso il basso all'estremità libera. Vincolo: nodo 1 `Dx + Dz + Ry`.

| Grandezza | Formula | Valore | EduBeam |
| --- | --- | --- | --- |
| Reazione verticale | $F$ | 18 kN | 18 kN |
| Momento d'incastro | $FL$ | 72 kNm | 72 kNm |
| Rotazione all'estremità | $FL^2/(2EI)$ | 0,03529 rad | 0,03529 rad |
| Freccia all'estremità (flessione) | $FL^3/(3EI)$ | 94,11 mm | — |
| Freccia all'estremità (taglio) | $FL/(kGA)$ | 0,31 mm | — |
| Freccia all'estremità (totale) | somma | 94,42 mm | 94,42 mm |

Qui il termine di taglio vale lo 0,3 %. Accorcia la mensola a 1 m e diventa il 5 %: è a questo che serve il fattore di taglio.

<Figure>
  <Structure :show-loads="true" show-moment show-reactions :nodes="[{label: '1', coords: [0,0,0], dofs: [0,2,4]}, {label: '2', coords: [4,0,0], dofs: []}]" :elements="[{label: '1', nodes: ['1', '2']}]" :nodal-loads="[{target: '2', values: { 0: 0, 2: 18000, 4: 0 }}]" />
  <figcaption>Mensola con carico di 18 kN all'estremità: momento flettente e reazioni</figcaption>
</Figure>

## Trave doppiamente incastrata, carico uniforme {#fixed–fixed-beam-uniform-load}

$L = 6$ m, $q = 12$ kN/m. Entrambi i nodi `Dx + Dz + Ry`.

| Grandezza | Formula | Valore |
| --- | --- | --- |
| Reazioni | $qL/2$ | 36 kN |
| Momento all'incastro | $qL^2/12$ | 36 kNm (negativo, fibre superiori tese) |
| Momento in mezzeria | $qL^2/24$ | 18 kNm (positivo) |
| Freccia in mezzeria | $qL^4/(384EI) + qL^2/(8kGA)$ | 9,93 + 0,23 = 10,16 mm |

Costruiscila a partire dalla trave appoggiata spuntando `Ry` in entrambi i nodi, e guarda il diagramma del momento spostarsi.

## Trave incastrata-appoggiata, carico uniforme {#propped-cantilever-uniform-load}

$L = 6$ m, $q = 12$ kN/m. Nodo 1 `Dx + Dz + Ry`, nodo 2 `Dz`.

| Grandezza | Formula | Valore |
| --- | --- | --- |
| Reazione all'incastro | $5qL/8$ | 45 kN |
| Reazione al carrello | $3qL/8$ | 27 kN |
| Momento d'incastro | $qL^2/8$ | 54 kNm (negativo) |
| Momento positivo massimo | $9qL^2/128$ a $x = 5L/8$ dall'incastro | 30,4 kNm a 3,75 m |

L'app etichetta automaticamente l'estremo locale, così puoi leggerne sia il valore sia (dalla posizione lungo l'elemento) il punto in cui si trova.

## Travatura a due aste {#two-bar-truss}

Due aste che partono da cerniere in `(0, 0)` e `(4, 0)` e si incontrano in `(2, −2)` (vertice 2 m più in alto), con entrambe le **cerniere di estremità** spuntate su entrambe le aste, e un carico verticale $F = 20$ kN nel vertice (verso il basso, cioè `Fz = 20`).

Ogni asta è inclinata di 45° e lunga $L = 2\sqrt{2}$ m. Per simmetria ciascuna porta

$$N = -\frac{F}{2 \sin 45^\circ} = -14{,}14\ \text{kN (compressione)}$$

e ciascun vincolo assorbe 10 kN in verticale e ±10 kN in orizzontale. Controlla il diagramma **N (x)** e le reazioni.

## Gradiente termico su una trave semplicemente appoggiata {#temperature-gradient-on-a-simply-supported-beam}

$L = 8$ m, $\Delta T_b - \Delta T_t = -10$ K (fibre superiori più calde), $\alpha = 12 \times 10^{-6}$, $h = 0{,}2$ m.

La trave è libera di incurvarsi, quindi **non nascono sollecitazioni**; la curvatura è

$$\kappa = \frac{\alpha\,(\Delta T_b - \Delta T_t)}{h} = \frac{12 \times 10^{-6} \cdot (-10)}{0{,}2} = -6 \times 10^{-4}\ \text{m}^{-1}$$

e la freccia in mezzeria è $\kappa L^2 / 8 = -4{,}8$ mm (verso l'alto). Ora blocca `Ry` a entrambe le estremità: la curvatura è impedita e lungo tutta la campata compare un momento costante $M = EI\kappa = 2{,}45$ kNm.

## Spostamento imposto {#prescribed-displacement}

Prendi la [trave incastrata-appoggiata](#propped-cantilever-uniform-load) senza carico e imponi `Dz = 10 mm` al carrello (un cedimento). La reazione necessaria per abbassare di $w$ l'estremità di una mensola è $R = 3EIw/L^3 = 0{,}567$ kN e il momento d'incastro è $RL = 3{,}40$ kNm. Rimetti il carico uniforme e i risultati si sovrappongono linearmente.

## Consigli per le tue verifiche {#tips-for-your-own-checks}

- Tieni d'occhio l'**indicatore delle unità**: la maggior parte delle discrepanze nasce da errori di unità.
- Usa la finestra **Matrice di rigidezza** per confrontare un singolo elemento con il [manuale teorico](/it/elements/beam) mentre impari il metodo degli spostamenti.
- Leggi i valori esatti nella scheda **Risultati** e nei tooltip al passaggio del mouse, non nelle etichette dei diagrammi, che sono arrotondate. **Esporta CSV** o **Copia** nella scheda Risultati ti danno anche le reazioni, pronte per un foglio di calcolo.
- Imposta **Formato dei numeri** su *Automatico* nelle Impostazioni per leggere `40` invece di `4 · 10¹`.
- Usa **Condividi modello** per passare un modello verificato a un collega o al docente.
