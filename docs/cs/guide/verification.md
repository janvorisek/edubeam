# Ověření výsledků ručně

<Edubeam /> je dobré místo, kde si osvojit návyk každého inženýra: nikdy nevěřit číslu, které neumíte alespoň přibližně reprodukovat. Tato stránka uvádí uzavřené vzorce pro klasické případy a to, co pro ně aplikace hlásí – každý model si tedy můžete postavit sami a porovnat.

Všechny případy používají stejný ocelový průřez, není-li uvedeno jinak: $E = 210\,000$ MPa, $G = 81\,000$ MPa, $A = 28{,}5$ cm², $I_y = 1943$ cm⁴, $h = 200$ mm, $k = 1$ (IPE 200).

$$EI = 210 \times 10^9 \cdot 1{,}943 \times 10^{-5} = 4{,}080 \times 10^6\ \text{Nm}^2$$

::: tip Proč se čísla nepatrně liší
EduBeam používá **Timoshenkův** nosník, který ke klasickému ohybovému průhybu Eulerova–Bernoulliho nosníku přidává smykový průhyb $\Delta w_s$. Pootočení, reakce a vnitřní síly to u staticky určitých případů neovlivní. U štíhlých prutů je dodatečný člen nepatrný; tabulky níže ho uvádějí explicitně.
:::

## Prostý nosník, spojité rovnoměrné zatížení

$L = 6$ m, $q = 12$ kN/m. Podpory: uzel 1 `Dx + Dz`, uzel 2 `Dz`.

| Veličina | Vzorec | Hodnota | EduBeam |
| --- | --- | --- | --- |
| Reakce | $qL/2$ | 36 kN | 36 kN |
| $V_{max}$ | $qL/2$ | 36 kN | 36 kN |
| $M_{max}$ (uprostřed) | $qL^2/8$ | 54 kNm | 54 kNm |
| Pootočení v podpoře | $qL^3/(24EI)$ | 0,02647 rad | 0,02647 rad |
| Průhyb uprostřed | $5qL^4/(384EI)$ | 49,63 mm | 49,63 mm |

<ExampleStructure />

## Konzola, síla na konci

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

## Oboustranně vetknutý nosník, spojité rovnoměrné zatížení

$L = 6$ m, $q = 12$ kN/m. Oba uzly `Dx + Dz + Ry`.

| Veličina | Vzorec | Hodnota |
| --- | --- | --- |
| Reakce | $qL/2$ | 36 kN |
| Moment ve vetknutí | $qL^2/12$ | 36 kNm (záporný, tah nahoře) |
| Moment uprostřed | $qL^2/24$ | 18 kNm (kladný) |
| Průhyb uprostřed | $qL^4/(384EI)$ | 9,93 mm |

Vytvořte ho z prostého nosníku zaškrtnutím `Ry` v obou uzlech a sledujte, jak se momentový průběh posune.

## Jednostranně vetknutý nosník, spojité rovnoměrné zatížení

$L = 6$ m, $q = 12$ kN/m. Uzel 1 `Dx + Dz + Ry`, uzel 2 `Dz`.

| Veličina | Vzorec | Hodnota |
| --- | --- | --- |
| Reakce ve vetknutí | $5qL/8$ | 45 kN |
| Reakce v posuvném kloubu | $3qL/8$ | 27 kN |
| Moment ve vetknutí | $qL^2/8$ | 54 kNm (záporný) |
| Max. kladný moment | $9qL^2/128$ v $x = 5L/8$ od vetknutí | 30,4 kNm v 3,75 m |

Aplikace lokální extrém popisuje automaticky, takže odečtete hodnotu i (z polohy na prutu) místo, kde nastává.

## Dvouprutová soustava

Dva pruty z pevných kloubů v `(0, 0)` a `(4, 0)` scházející se v `(2, −2)` (vrchol 2 m nad podporami), u obou prutů zaškrtnuty **oba koncové klouby**, svislá síla $F = 20$ kN ve vrcholu (dolů, tj. `Fz = 20`).

Každý prut svírá 45°, délka $L = 2\sqrt{2}$ m. Ze symetrie každý přenáší

$$N = -\frac{F}{2 \sin 45^\circ} = -14{,}14\ \text{kN (tlak)}$$

a každá podpora přebírá 10 kN svisle a ±10 kN vodorovně. Zkontrolujte vrstvu **N (x)** a reakce.

## Nerovnoměrné oteplení prostého nosníku

$L = 8$ m, $\Delta T_d - \Delta T_h = -10$ K (teplejší horní vlákna), $\alpha = 12 \times 10^{-6}$, $h = 0{,}2$ m.

Nosník se může volně zakřivit, takže **nevznikají vnitřní síly**; křivost je

$$\kappa = \frac{\alpha\,(\Delta T_d - \Delta T_h)}{h} = \frac{12 \times 10^{-6} \cdot (-10)}{0{,}2} = -6 \times 10^{-4}\ \text{m}^{-1}$$

a průhyb uprostřed $\kappa L^2 / 8 = -4{,}8$ mm (vzhůru). Nyní odeberte `Ry` na obou koncích: křivost je zabráněno a po celém rozpětí se objeví konstantní moment $M = EI\kappa = 2{,}45$ kNm.

## Předepsané posunutí

Vezměte [jednostranně vetknutý nosník](#jednostranne-vetknuty-nosnik-spojite-rovnomerne-zatizeni) bez zatížení a předepište `Dz = 10 mm` v posuvném kloubu (pokles podpory). Reakce potřebná k zatlačení konce konzoly o $w$ je $R = 3EIw/L^3 = 0{,}567$ kN a moment ve vetknutí $RL = 3{,}40$ kNm. Přidejte zpět spojité zatížení a výsledky se lineárně superponují.

## Tipy pro vlastní kontroly

- Mějte na očích **štítek jednotek**; většina nesrovnalostí jsou přehmaty v jednotkách.
- Okno **Matice tuhosti** použijte k porovnání jednoho prvku s [teoretickým manuálem](/cs/elements/beam), když se učíte deformační metodu.
- Přesná čísla čtěte ze záložky **Výsledky** a z popisků po najetí myší, ne z popisků průběhů, které jsou zaokrouhlené.
- Zkontrolovaný model předejte kolegovi nebo vyučujícímu přes **Sdílet konstrukci**.
