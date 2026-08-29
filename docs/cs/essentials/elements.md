# Prvky, materiály a průřezy

## Prutový prvek

<Edubeam /> má jediný typ prvku: **rovinný Timoshenkův nosník** v rovině x–z se třemi stupni volnosti na každém konci (`Dx`, `Dz`, `Ry`). Přenáší normálovou sílu, posouvající sílu i ohybový moment a zahrnuje vliv smykové deformace (proto má průřez smykový součinitel). Úplná formulace je v [teoretickém manuálu](/cs/elements/beam).

<TrussElement :moment="true" caption="Rovinný prutový prvek – tři stupně volnosti v uzlu" />

Průběhy po délce prvku jsou pro lineární model přesné, takže stačí jeden prvek na prut. Mezilehlé uzly přidávejte jen tam, kde potřebujete podporu, kloub, změnu průřezu nebo uzel pro zatížení.

### Přidání prvků

| Způsob | Postup |
| --- | --- |
| **Dialog** | Záložka *Prvky* → **Přidat prvek** (nebo nabídka plátna → *Přidat prvek*): zvolte **Počáteční uzel**, **Koncový uzel**, materiál a průřez. |
| **Myší** | Záložka *Prvky* → **Přidat myší** (nebo držte <kbd>Ctrl</kbd> u položky nabídky plátna). Kliknutím na uzel začnete, kliknutím na další uzel spojíte – kliknutí na prázdné plátno tam vytvoří nový uzel. Dalšími kliknutími kreslíte lomenou čáru; <kbd>Esc</kbd> ukončí. Automaticky se přiřadí první materiál a první průřez v modelu. |

::: warning Nejdřív materiály a průřezy
Prvek nemůže existovat bez materiálu a průřezu. Pokud žádné nejsou, zobrazení hlásí *Není definovaný žádný materiál* / *Není definovaný žádný průřez* se zkratkou **Přidat**.
:::

### Orientace prvku

**Lokální osa x** vede od počátečního ke koncovému uzlu. Záleží na tom u:

- zatížení v lokálních souřadnicích (`fx`, `fz` v LSS),
- *vzdálenosti od počátečního uzlu* u osamělých sil,
- pořadí koncových sil (`X12, Z12, M12` na počátku, `X21, Z21, M21` na konci) v tabulce výsledků.

Prvek otočíte tlačítkem **Přehodit pořadí uzlů** v tabulce *Prvky*.

### Koncové klouby

Každý prvek má dvě políčka **Koncové klouby** (počátek / konec) v tabulce *Prvky*. Zaškrtnutý kloub uvolní ohybový moment na daném konci (statická kondenzace rotačního stupně volnosti), takže:

- jeden kloub → kloub uvnitř rámu nebo spojitého nosníku (moment je v něm nulový);
- oba klouby → **příhradový prut**, který přenáší pouze normálovou sílu.

<TrussElement :hinges="[true, true]" caption="Klouby na obou koncích → příhradový prut" />

Setkávají-li se v uzlu dva prvky a kloub má jen jeden z nich, druhý do uzlu moment stále přenáší – uvolňujte tedy ten prvek, který má být kloubově připojen, nikoli „uzel“.

### Úprava a mazání

Klikněte na prvek a použijte kontextovou nabídku (**Upravit prvek**, **Přidat zatížení**, **Matice tuhosti**, **Smazat**) nebo upravujte přímo v tabulce *Prvky*. Smazání prvku odstraní i jeho zatížení. **Matice tuhosti** otevře plovoucí okno s maticí prvku 6 × 6 v lokálních a globálních souřadnicích – hodí se při kontrole ruční sestavy v deformační metodě.

## Materiály

Záložka *Materiály* → **Přidat materiál**:

| Pole | Symbol | Jednotka | Poznámka |
| --- | --- | --- | --- |
| Modul pružnosti | $E$ | jednotka napětí (výchozí MPa) | ocel ≈ 210 000 MPa, beton ≈ 30 000 MPa, dřevo ≈ 11 000 MPa |
| Smykový modul | $G$ | jednotka napětí | $G = E / (2(1+\nu))$; ocel ≈ 81 000 MPa. Ovlivňuje jen smykový člen Timoshenkova nosníku. |
| Hustota | $\rho$ | kg/m³ | Ukládá se s projektem; statický řešič ji nepoužívá (vlastní tíha se nezadává automaticky). |
| Součinitel teplotní roztažnosti | $\alpha$ | 1/K | Používá se u [teplotního zatížení](/cs/essentials/loads#zmena-teploty). Ocel 12 × 10⁻⁶. |

**Knihovna materiálů** nabízí hotové položky: konstrukční oceli (S235, S275, S355, nerez), slitiny hliníku, měď/mosaz/bronz, titan, třídy betonu, dřevo (C24, GL24h, GL32h), sklo, GFRP/CFRP a běžné plasty. Vyberte z dialogu knihovny nebo přes *Nebo vybrat z knihovny* v dialogu *Přidat materiál*.

## Průřezy

Záložka *Průřezy* → **Přidat průřez**:

| Pole | Symbol | Jednotka | Poznámka |
| --- | --- | --- | --- |
| Plocha | $A$ | jednotka plochy | Tuhost v tahu/tlaku $EA$ |
| Moment setrvačnosti | $I_y$ | m⁴ (nebo zvolená jednotka) | Ohybová tuhost $EI_y$ k ose ohybu v rovině |
| Výška | $h$ | jednotka délky | Používá se u nerovnoměrného oteplení (křivost $= \alpha\,\Delta T / h$) |
| Smykový součinitel | $k$ | – | Účinná smyková plocha $= kA$. Hodnota `1` smykovou deformaci (téměř) potlačí; ≈ 0,83 pro obdélník; u I‑profilů $A_{st}/A$. |

**Knihovna průřezů** obsahuje přibližné hodnoty pro obdélníky, čtverce, kruhy, profily IPE a HEA, obdélníkové (RHS) a kruhové (CHS) trubky. Berte je jako výchozí bod a před použitím je ověřte v tabulkách profilů.

::: tip Rychlá kontrola
Obdélník $b \times h$: $A = bh$, $I_y = bh^3/12$. Plný kruh o průměru $d$: $A = \pi d^2/4$, $I_y = \pi d^4/64$.
:::

Materiály a průřezy může sdílet libovolný počet prvků; změna hodnoty se promítne do všech prvků, které ji používají, a model se přepočítá.
