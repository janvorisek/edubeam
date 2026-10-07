# Ověření výsledků ručně

<Edubeam /> je ideální místo, kde si osvojit návyk, bez kterého se žádný inženýr neobejde: nevěřit číslu, které nedokážete aspoň přibližně ověřit. Na této stránce najdete vzorce v uzavřeném tvaru pro klasické případy spolu s hodnotami, které hlásí aplikace. Každý model si tak můžete sestavit sami a výsledky porovnat.

Kompletně řešené příklady s ručním ověřením najdete v návodech [trojkloubový rám](/cs/tutorials/three-hinged-frame) a [rovinná příhradová konstrukce](/cs/tutorials/truss).

Pokud není uvedeno jinak, mají všechny případy stejný ocelový průřez: $E = 210\,000$ MPa, $G = 81\,000$ MPa, $A = 28{,}5$ cm², $I_y = 1943$ cm⁴, $h = 200$ mm, $k = 1$ (IPE 200).

$$EI = 210 \times 10^9 \cdot 1{,}943 \times 10^{-5} = 4{,}080 \times 10^6\ \text{Nm}^2$$

::: tip Proč se čísla nepatrně liší
EduBeam používá **Timoshenkovy** nosníky, které ke klasickému ohybovému průhybu Eulerova–Bernoulliho nosníku přičítají smykový průhyb $\Delta w_s$. Na pootočení, reakce a vnitřní síly staticky určitých konstrukcí to vliv nemá. U štíhlých prutů je tento člen zanedbatelný; v tabulkách níže je uveden zvlášť.
:::

## Prostý nosník se spojitým rovnoměrným zatížením {#simply-supported-beam-uniform-load}

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

Průhyb uprostřed rozpětí odečtete, když tam přidáte uzel: *Přidat uzel* (myší) → **Připojit ke konstrukci**. Rozdělení prvku žádný výsledek nezmění.

<ExampleStructure />

## Konzola se silou na konci {#cantilever-tip-load}

$L = 4$ m, $F = 18$ kN dolů na volném konci. Podpora: uzel 1 `Dx + Dz + Ry`.

| Veličina | Vzorec | Hodnota | EduBeam |
| --- | --- | --- | --- |
| Svislá reakce | $F$ | 18 kN | 18 kN |
| Moment ve vetknutí | $FL$ | 72 kNm | 72 kNm |
| Pootočení konce | $FL^2/(2EI)$ | 0,03529 rad | 0,03529 rad |
| Průhyb konce (ohyb) | $FL^3/(3EI)$ | 94,11 mm | — |
| Průhyb konce (smyk) | $FL/(kGA)$ | 0,31 mm | — |
| Průhyb konce (celkem) | součet | 94,42 mm | 94,42 mm |

Smykový člen tu tvoří 0,3 %. Zkraťte konzolu na 1 m a vzroste na 5 % – právě v takových případech hraje smykový součinitel roli.

<Figure>
  <Structure :show-loads="true" show-moment show-reactions :nodes="[{label: '1', coords: [0,0,0], dofs: [0,2,4]}, {label: '2', coords: [4,0,0], dofs: []}]" :elements="[{label: '1', nodes: ['1', '2']}]" :nodal-loads="[{target: '2', values: { 0: 0, 2: 18000, 4: 0 }}]" />
  <figcaption>Konzola se silou 18 kN na konci: ohybový moment a reakce</figcaption>
</Figure>

## Oboustranně vetknutý nosník se spojitým rovnoměrným zatížením {#fixed–fixed-beam-uniform-load}

$L = 6$ m, $q = 12$ kN/m. Oba uzly `Dx + Dz + Ry`.

| Veličina | Vzorec | Hodnota |
| --- | --- | --- |
| Reakce | $qL/2$ | 36 kN |
| Moment ve vetknutí | $qL^2/12$ | 36 kNm (záporný, tah nahoře) |
| Moment uprostřed rozpětí | $qL^2/24$ | 18 kNm (kladný) |
| Průhyb uprostřed | $qL^4/(384EI) + qL^2/(8kGA)$ | 9,93 + 0,23 = 10,16 mm |

Stačí v prostém nosníku zaškrtnout `Ry` v obou uzlech a sledovat, jak se průběh momentu posune.

## Jednostranně vetknutý nosník se spojitým rovnoměrným zatížením {#propped-cantilever-uniform-load}

$L = 6$ m, $q = 12$ kN/m. Uzel 1 `Dx + Dz + Ry`, uzel 2 `Dz`.

| Veličina | Vzorec | Hodnota |
| --- | --- | --- |
| Reakce ve vetknutí | $5qL/8$ | 45 kN |
| Reakce v posuvném kloubu | $3qL/8$ | 27 kN |
| Moment ve vetknutí | $qL^2/8$ | 54 kNm (záporný) |
| Max. kladný moment | $9qL^2/128$ v $x = 5L/8$ od vetknutí | 30,4 kNm ve 3,75 m |

Aplikace lokální extrém popíše automaticky, takže odečtete jeho hodnotu i polohu na prutu.

## Dvouprutová soustava {#two-bar-truss}

Dva pruty vycházejí z pevných kloubových podpor v `(0, 0)` a `(4, 0)` a stýkají se v bodě `(2, −2)` (vrchol je 2 m nad podporami). Oba pruty mají zaškrtnuté oba **koncové klouby** a ve vrcholu působí svislá síla $F = 20$ kN (dolů, tj. `Fz = 20`).

Oba pruty jsou skloněné pod úhlem 45° a mají délku $L = 2\sqrt{2}$ m. Ze symetrie přenáší každý z nich

$$N = -\frac{F}{2 \sin 45^\circ} = -14{,}14\ \text{kN (tlak)}$$

a každá podpora přenáší 10 kN svisle a ±10 kN vodorovně. Zkontrolujte průběh **N (x)** a reakce.

## Nerovnoměrné oteplení prostého nosníku {#temperature-gradient-on-a-simply-supported-beam}

$L = 8$ m, $\Delta T_d - \Delta T_h = -10$ K (horní vlákna teplejší), $\alpha = 12 \times 10^{-6}$, $h = 0{,}2$ m.

Nosník se může volně zakřivit, takže **nevznikají žádné vnitřní síly**. Křivost je

$$\kappa = \frac{\alpha\,(\Delta T_d - \Delta T_h)}{h} = \frac{12 \times 10^{-6} \cdot (-10)}{0{,}2} = -6 \times 10^{-4}\ \text{m}^{-1}$$

a průhyb uprostřed rozpětí je $\kappa L^2 / 8 = -4{,}8$ mm (vzhůru). Teď na obou koncích podepřete `Ry`: nosník se nemůže zakřivit a po celém rozpětí vznikne konstantní moment $M = EI\kappa = 2{,}45$ kNm.

## Předepsané posunutí {#prescribed-displacement}

Vezměte [jednostranně vetknutý nosník](#propped-cantilever-uniform-load) bez zatížení a v posuvném kloubu předepište `Dz = 10 mm` (pokles podpory). Reakce, která konec nosníku posune o $w$, je $R = 3EIw/L^3 = 0{,}567$ kN a moment ve vetknutí je $RL = 3{,}40$ kNm. Když spojité zatížení vrátíte, výsledky se lineárně sečtou (superpozice).

## Tipy pro vlastní kontrolu {#tips-for-your-own-checks}

- Sledujte **štítek jednotek**; většina nesrovnalostí vzniká chybou v jednotkách.
- Když se učíte deformační metodu, porovnejte v okně **Matice tuhosti** jeden prvek s [teoretickým manuálem](/cs/elements/beam).
- Přesné hodnoty čtěte v záložce **Výsledky** a v popiscích po najetí myší, ne z popisků průběhů, které jsou zaokrouhlené. Přes **Exportovat CSV** nebo **Kopírovat** v záložce Výsledky získáte i reakce, připravené pro tabulkový procesor.
- V Nastavení přepněte **Formát čísel** na *Automatický*, abyste viděli `40` místo `4 · 10¹`.
- Ověřený model pošlete kolegovi nebo vyučujícímu přes **Sdílet konstrukci**.
