# Prvky, materiály a průřezy

## Prutový prvek {#the-beam-element}

<Edubeam /> má jediný typ prvku: **rovinný Timoshenkův nosník** v rovině x–z se třemi stupni volnosti na každém konci (`Dx`, `Dz`, `Ry`). Přenáší normálovou sílu, posouvající sílu i ohybový moment a zahrnuje i smykovou deformaci – proto se u průřezu zadává smykový součinitel. Úplná formulace je v [teoretickém manuálu](/cs/elements/beam).

<TrussElement :moment="true" caption="Rovinný prutový prvek – tři stupně volnosti v uzlu" />

V lineárním modelu jsou výsledky po délce prvku přesné, každý prut proto stačí modelovat jedním prvkem. Mezilehlé uzly přidávejte jen tam, kde potřebujete podporu, kloub nebo změnu průřezu, případně kde chcete odečíst výsledky.

### Přidání prvků {#adding-elements}

| Způsob | Postup |
| --- | --- |
| **Dialog** | Záložka *Prvky* → první tlačítko **Přidat prvek**, nebo nabídka plátna → *Přidat prvek*. Zvolte **Počáteční uzel** a **Koncový uzel**, klouby, materiál a průřez. |
| **Myší** | Záložka *Prvky* → druhé tlačítko **Přidat prvek** (ikona kurzoru), nebo podržte <kbd>Ctrl</kbd> u položky nabídky plátna. Kliknutím na uzel začnete, kliknutím na další uzel prvek dokončíte; když kliknete na prázdné plátno, vytvoří se tam nový uzel. Dalšími kliknutími pokračujete v lomené čáře, klávesou <kbd>Esc</kbd> kreslení ukončíte. V liště nahoře nastavíte **Kloub na začátku** a **Kloub na konci** pro každý nakreslený prvek. Prvky dostanou první materiál a první průřez v modelu. |

![Dialog Přidat prvek](/screenshots/cs/qs-element.webp){.shot-md}

::: warning Nejdřív materiály a průřezy
Každý prvek musí mít materiál a průřez. Dokud v modelu žádný není, zobrazuje se hlášení *Není definovaný žádný materiál* / *Není definovaný žádný průřez* s tlačítkem **Přidat**.
:::

### Orientace prvku {#element-direction}

**Lokální osa x** vede od počátečního ke koncovému uzlu. Na orientaci záleží u:

- zatížení v lokálních souřadnicích (zaškrtnuté **LCS**),
- *Vzdálenosti od počátečního uzlu* u osamělých sil,
- pořadí koncových sil (`X12, Z12, M12` na počátku, `X21, Z21, M21` na konci) v tabulce výsledků.

Orientaci prvku obrátíte tlačítkem pro prohození uzlů v tabulce *Prvky*.

### Koncové klouby {#end-hinges}

Každý prvek má v tabulce *Prvky* dvě zaškrtávací políčka **Koncové klouby**, pro začátek a pro konec. Najdete je také v dialogu Přidat prvek, v panelu **Upravit prvek** a v liště při kreslení myší. Zaškrtnutý kloub uvolní na daném konci ohybový moment:

- kloubem na jednom konci vytvoříte vnitřní kloub rámu nebo spojitého nosníku (moment je v něm nulový);
- klouby na obou koncích z prvku udělají **příhradový prut**, který přenáší pouze normálovou sílu.

<TrussElement :hinges="[true, true]" caption="Klouby na obou koncích → příhradový prut" />

![Tabulka Prvky trojkloubového rámu: prvek 2 má kloub na konci, v uzlu C](/screenshots/cs/elements-table.webp)

Když se v uzlu stýkají dva prvky a kloub má jen jeden z nich, druhý do uzlu moment dál přenáší. Uvolňujte proto konec toho prvku, který má být připojen kloubově, nikoli „uzel“. Pokud se konstrukce kvůli kloubům stane mechanismem, EduBeam klouby zakroužkuje a ukáže, jak se konstrukce pohybuje.

### Úprava a mazání {#editing-and-deleting}

Klikněte na prvek a použijte jeho panel (**Upravit prvek**, **Přidat zatížení**, **Matice tuhosti**, **Smazat**), nebo ho upravte v tabulce *Prvky*. Spolu s prvkem se smažou i jeho zatížení. **Matice tuhosti** otevře okno s maticí tuhosti prvku 6 × 6 v globálních souřadnicích (N/m, N a N·m). Případné koncové klouby jsou v ní už zkondenzované. Hodí se pro kontrolu ručně sestavené matice.

## Materiály {#materials}

Záložka *Materiály* → **Přidat materiál**:

| Pole | Symbol | Jednotka | Poznámka |
| --- | --- | --- | --- |
| Modul pružnosti | $E$ | jednotka napětí (výchozí MPa) | Ocel ≈ 210 000 MPa, beton ≈ 30 000 MPa, dřevo ≈ 11 000 MPa |
| Smykový modul | $G$ | jednotka napětí | $G = E / (2(1+\nu))$; ocel ≈ 81 000 MPa. Ovlivňuje jen smykový člen Timoshenkova nosníku. |
| Hustota | $\rho$ | hmotnost / délka³ (kg/m³, lb/ft³) | Ukládá se s projektem. Statický řešič ji nepoužívá (zatížení vlastní tíhou EduBeam nemá). |
| Součinitel teplotní roztažnosti | $\alpha$ | 1/K nebo 1/°F | Používá se u [teplotního zatížení](/cs/essentials/loads#temperature-load). Ocel: 12 × 10⁻⁶ /K. |

<div class="shots">

![Přidat materiál](/screenshots/cs/qs-material.webp)

![Knihovna materiálů](/screenshots/cs/qs-material-library.webp)

</div>

**Knihovna materiálů** nabízí předem připravené materiály. Jako první je uvedena skupina, která odpovídá vašim jednotkám.

- **Kovy:** konstrukční oceli S235, S275, S355, nerezové oceli, litina, slitiny hliníku, měď, mosaz, bronz, titan; americké oceli ASTM A992, A36, A572 Gr. 50 a HSS A500 Gr. C.
- **Beton:** obyčejný a lehký beton, třídy C25/30, C30/37, C40/50 a f′c = 4 ksi a 5 ksi.
- **Dřevo:** C24, GL24h, GL32h.
- **Ostatní:** sklo, GFRP, CFRP, HDPE, PVC, PMMA, polykarbonát.

Otevřete ji tlačítkem v liště nebo pomocí *Nebo vybrat z knihovny* v dialogu *Přidat materiál*.

Materiál, který některé prvky ještě používají, nelze smazat. Nejprve těmto prvkům přiřaďte jiný.

## Průřezy {#cross-sections}

Záložka *Průřezy* → **Přidat průřez**:

| Pole | Symbol | Jednotka | Poznámka |
| --- | --- | --- | --- |
| Plocha | $A$ | jednotka plochy | Tuhost v tahu/tlaku $EA$ |
| Moment setrvačnosti | $I_y$ | jednotka momentu setrvačnosti | Ohybová tuhost $EI_y$ k ose kolmé na rovinu výkresu |
| Výška | $h$ | jednotka rozměrů průřezu | Používá se u nerovnoměrného oteplení (křivost $= \alpha\,\Delta T / h$) |
| Smykový součinitel | $k$ | – | Timoshenkův smykový součinitel: účinná smyková plocha je $kA$. Hodnota `1` smykovou deformaci téměř zanedbá; pro obdélníky použijte přibližně 0,83, pro I‑profily $A_{stojina}/A$. |

**Knihovna průřezů** nabízí přibližné hodnoty pro obdélníky, čtverce a kruhy, profily IPE a HEA, trubky RHS a CHS a americké profily AISC W a HSS (obdélníkové i kruhové). Smykové součinitele v knihovně odpovídají tvaru průřezu: $h\,t_w/A$ pro I‑profily, $2ht/A$ pro obdélníkové trubky, 0,5 pro kruhové trubky, 0,833 pro obdélníky a 0,9 pro kruhy. Hodnoty berte jako orientační a před použitím je ověřte v tabulkách profilů.

![Knihovna průřezů](/screenshots/cs/sections-library.webp){.shot-lg}

### Polygonální průřezy {#polygonal-sections}

Editor tvaru otevřete na záložce *Průřezy* tlačítkem **Polygonální průřez**, nebo volbou *Nebo zadat polygonální tvar* v dialogu *Přidat průřez*.

![Editor polygonálního průřezu s předlohou I-profilu, jeho hlavními osami a elipsou setrvačnosti](/screenshots/cs/sections-polygon.webp)

- **Začněte** předlohou (obdélník, I, T, L, U-profil, obdélníková nebo kruhová trubka, kruh), zadejte její rozměry a stiskněte **Použít**.
- **Upravte** tvar: táhněte vrcholy (přichytávají se ke **Kroku přichytávání**), kliknutím na střed hrany vložte vrchol, dvojklikem vrchol odstraňte, nebo zadejte souřadnice v tabulce vrcholů. **Přidat otvor** přidá vnitřní obrys. **Vystředit do těžiště** posune tvar tak, aby jeho těžiště leželo v počátku.
- **Odečtěte** plochu $A$, těžiště, těžišťové momenty setrvačnosti $I_y$, $I_z$, $I_{yz}$, hlavní momenty setrvačnosti $I_1$, $I_2$ s úhlem hlavních os $\alpha$ (od $y$ k ose 1) a poloměry setrvačnosti. Výkres zobrazuje i elipsu setrvačnosti.

Po uložení se $A$, $I_y$ a $h$ vyplní podle tvaru. V tabulce je nelze přímo měnit; tvar znovu upravíte tlačítkem polygonu ve sloupci *Akce*. Smykový součinitel $k$ zadáváte i nadále sami. Souřadný systém průřezu je lokální a pravotočivý: osa $x$ míří ven z obrazovky, $y$ doleva a $z$ dolů.

Pokud tvar není symetrický k rovině rámu (například úhelník L), editor upozorní, že 2D výpočet je přesný jen u prutu, který je po celé délce zajištěný proti vybočení do strany a proti zkroucení, například deskou. Pokud je $I_{yz}$ významný, zvolíte, s jakou ohybovou tuhostí se počítá: **zajištěn do strany a proti zkroucení po celé délce** ($I_y$), nebo nižší tuhost pro prut **volně vychýlitelný do strany**. Kroucení nezahrnuje ani jedna z možností.

::: tip Rychlá kontrola
Obdélník $b \times h$: $A = bh$, $I_y = bh^3/12$. Plný kruh o průměru $d$: $A = \pi d^2/4$, $I_y = \pi d^4/64$.
:::

Jeden materiál nebo průřez může používat libovolný počet prvků. Změna hodnoty se promítne do všech těchto prvků a model se přepočítá.
