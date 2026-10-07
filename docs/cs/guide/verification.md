# Ověření výsledků ručně

<Edubeam /> je dobré místo, kde si osvojit návyk, který potřebuje každý inženýr: nikdy nevěřit číslu, které neumíte alespoň přibližně reprodukovat. Tato stránka uvádí vzorce v uzavřeném tvaru pro klasické případy a ukazuje, co pro ně aplikace hlásí, takže si každý model můžete sestavit sami a porovnat.

Kompletní řešené příklady s ručním ověřením najdete v návodech [trojkloubový rám](/cs/tutorials/three-hinged-frame) a [rovinná příhradová konstrukce](/cs/tutorials/truss).

Všechny případy používají stejný ocelový průřez, není-li uvedeno jinak: $E = 210\,000$ MPa, $G = 81\,000$ MPa, $A = 28{,}5$ cm², $I_y = 1943$ cm⁴, $h = 200$ mm, $k = 1$ (IPE 200).

$$EI = 210 \times 10^9 \cdot 1{,}943 \times 10^{-5} = 4{,}080 \times 10^6\ \text{Nm}^2$$

::: tip Proč se čísla nepatrně liší
EduBeam používá **Timoshenkovy** nosníky, které ke klasickému ohybovému průhybu Eulerova–Bernoulliho nosníku přidávají smykový průhyb $\Delta w_s$. Pootočení, reakce a vnitřní síly to u staticky určitých případů neovlivní. U štíhlých prutů je dodatečný člen nepatrný; tabulky níže ho uvádějí explicitně.
:::

## Prostý nosník, spojité rovnoměrné zatížení {#simply-supported-beam-uniform-load}

$L = 6$ m, $q = 12$ kN/m. Podpory: uzel 1 `Dx + Dz`, uzel 2 `Dz`.

| Veličina | Vzorec | Hodnota | EduBeam |
| --- | --- | --- | --- |
| Reakce | $qL/2$ | 36 kN | 36 kN |
| $V_{max}$ | $qL/2$ | 36 kN | 36 kN |
| $M_{max}$ (uprostřed rozpětí) | $qL^2/8$ | 54 kNm | 54 kNm |
| Pootočení v podpoře | $qL^3/(24EI)$ | 0,02647 rad | 0,02647 rad |
| Průhyb uprostřed (ohyb) | $5qL^4/(384EI)$ | 49,63 mm | — |
| Průhyb uprostřed (smyk) | $qL^2/(8kGA)$ | 0,23 mm | — |
| Průhyb uprostřed (celkem) | součet | 49,86 mm | 49,86 mm |

Chcete-li odečíst průhyb uprostřed rozpětí, přidejte tam uzel pomocí *Přidat uzel* (myší) → **Připojit ke konstrukci**; rozdělení prvku žádný výsledek nezmění.

<ExampleStructure />

## Konzola, síla na konci {#cantilever-tip-load}

$L = 4$ m, $F = 18$ kN dolů na volném konci. Podpora: uzel 1 `Dx + Dz + Ry`.

| Veličina | Vzorec | Hodnota | EduBeam |
| --- | --- | --- | --- |
| Svislá reakce | $F$ | 18 kN | 18 kN |
| Moment ve vetknutí | $FL$ | 72 kNm | 72 kNm |
| Pootočení konce | $FL^2/(2EI)$ | 0,03529 rad | 0,03529 rad |
| Průhyb konce (ohyb) | $FL^3/(3EI)$ | 94,11 mm | — |
| Průhyb konce (smyk) | $FL/(kGA)$ | 0,31 mm | — |
| Průhyb konce (celkem) | součet | 94,42 mm | 94,42 mm |

Smykový člen zde činí 0,3 %. Zkraťte konzolu na 1 m a bude to 5 % – právě k tomu slouží smykový součinitel.

<Figure>
  <Structure :show-loads="true" show-moment show-reactions :nodes="[{label: '1', coords: [0,0,0], dofs: [0,2,4]}, {label: '2', coords: [4,0,0], dofs: []}]" :elements="[{label: '1', nodes: ['1', '2']}]" :nodal-loads="[{target: '2', values: { 0: 0, 2: 18000, 4: 0 }}]" />
  <figcaption>Konzola se silou 18 kN na konci: ohybový moment a reakce</figcaption>
</Figure>

## Oboustranně vetknutý nosník, spojité rovnoměrné zatížení {#fixed–fixed-beam-uniform-load}

$L = 6$ m, $q = 12$ kN/m. Oba uzly `Dx + Dz + Ry`.

| Veličina | Vzorec | Hodnota |
| --- | --- | --- |
| Reakce | $qL/2$ | 36 kN |
| Moment ve vetknutí | $qL^2/12$ | 36 kNm (záporný, tah nahoře) |
| Moment uprostřed rozpětí | $qL^2/24$ | 18 kNm (kladný) |
| Průhyb uprostřed | $qL^4/(384EI) + qL^2/(8kGA)$ | 9,93 + 0,23 = 10,16 mm |

Vytvořte ho z prostého nosníku zaškrtnutím `Ry` v obou uzlech a sledujte, jak se průběh momentu posune.

## Jednostranně vetknutý nosník, spojité rovnoměrné zatížení {#propped-cantilever-uniform-load}

$L = 6$ m, $q = 12$ kN/m. Uzel 1 `Dx + Dz + Ry`, uzel 2 `Dz`.

| Veličina | Vzorec | Hodnota |
| --- | --- | --- |
| Reakce ve vetknutí | $5qL/8$ | 45 kN |
| Reakce v posuvném kloubu | $3qL/8$ | 27 kN |
| Moment ve vetknutí | $qL^2/8$ | 54 kNm (záporný) |
| Max. kladný moment | $9qL^2/128$ v $x = 5L/8$ od vetknutí | 30,4 kNm v 3,75 m |

Aplikace lokální extrém popisuje automaticky, takže odečtete hodnotu i (z polohy na prutu) místo, kde nastává.

## Dvouprutová soustava {#two-bar-truss}

Dva pruty z pevných kloubových podpor v `(0, 0)` a `(4, 0)` se stýkají v `(2, −2)` (vrchol 2 m nad podporami), u obou prutů jsou zaškrtnuty oba **koncové klouby**, ve vrcholu působí svislá síla $F = 20$ kN (dolů, tj. `Fz = 20`).

Každý prut svírá 45°, délka $L = 2\sqrt{2}$ m. Ze symetrie každý přenáší

$$N = -\frac{F}{2 \sin 45^\circ} = -14{,}14\ \text{kN (tlak)}$$

a každá podpora přebírá 10 kN svisle a ±10 kN vodorovně. Zkontrolujte průběh **N (x)** a reakce.

## Nerovnoměrné oteplení prostého nosníku {#temperature-gradient-on-a-simply-supported-beam}

$L = 8$ m, $\Delta T_d - \Delta T_h = -10$ K (teplejší horní vlákna), $\alpha = 12 \times 10^{-6}$, $h = 0{,}2$ m.

Nosník se může volně zakřivit, takže **nevznikají žádné vnitřní síly**; křivost je

$$\kappa = \frac{\alpha\,(\Delta T_d - \Delta T_h)}{h} = \frac{12 \times 10^{-6} \cdot (-10)}{0{,}2} = -6 \times 10^{-4}\ \text{m}^{-1}$$

a průhyb uprostřed rozpětí je $\kappa L^2 / 8 = -4{,}8$ mm (vzhůru). Nyní na obou koncích podepřete `Ry`: zakřivení je zabráněno a po celém rozpětí se objeví konstantní moment $M = EI\kappa = 2{,}45$ kNm.

## Předepsané posunutí {#prescribed-displacement}

Vezměte [jednostranně vetknutý nosník](#propped-cantilever-uniform-load) bez zatížení a v posuvném kloubu předepište `Dz = 10 mm` (pokles podpory). Reakce potřebná k zatlačení konce konzoly o $w$ je $R = 3EIw/L^3 = 0{,}567$ kN a moment ve vetknutí je $RL = 3{,}40$ kNm. Přidejte zpět spojité zatížení a výsledky se lineárně sečtou (superponují).

## Tipy pro vlastní kontroly {#tips-for-your-own-checks}

- Mějte na očích **štítek jednotek**; většina nesrovnalostí jsou přehmaty v jednotkách.
- Okno **Matice tuhosti** použijte k porovnání jednoho prvku s [teoretickým manuálem](/cs/elements/beam), když se učíte deformační metodu.
- Přesná čísla čtěte ze záložky **Výsledky** a z popisků po najetí myší, ne z popisků průběhů, které jsou zaokrouhlené. **Exportovat CSV** nebo **Kopírovat** v záložce Výsledky vám dá i reakce, připravené do tabulkového procesoru.
- Nastavte v Nastavení **Formát čísel** na *Automatický*, abyste četli `40` místo `4 · 10¹`.
- Zkontrolovaný model předejte kolegovi nebo vyučujícímu přes **Sdílet konstrukci**.
