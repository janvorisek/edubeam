# Výsledky a průběhy

<Edubeam /> přepočítá model po každé změně (nejvýše několikrát za sekundu), takže výsledky máte vždy aktuální. Tlačítko *Spočítat* tu nenajdete. Když se nic nevykreslí, model zatím nelze vyřešit; důvod vám řekne hlášení vlevo nahoře v zobrazení (viz [Řešení problémů](/cs/reference/troubleshooting)).

Všechny obrázky na této stránce ukazují stejný model: [trojkloubový rám](/cs/tutorials/three-hinged-frame) se spojitým zatížením 10 kN/m.

## Vrstvy v zobrazení {#overlays-in-the-viewer}

Vrstvy zapínáte a vypínáte v **možnostech zobrazení** vpravo nahoře v zobrazení (tlačítkem ⚙ je zobrazíte nebo skryjete).

| Vrstva | Barva (výchozí) | Poznámka |
| --- | --- | --- |
| **Deformovaný tvar** | šedá | Zvětšený: největší posunutí má na obrazovce tolik pixelů, kolik udává *Měřítko výsledků*. Ve výchozím stavu zapnutý. |
| **N (x)**, normálová síla | modrá | Tah je kladný. Bez osového zatížení je po délce prvku konstantní. |
| **V<sub>z</sub> (x)**, posouvající síla | zelená | Při rovnoměrném zatížení lineární, při lineárně proměnném kvadratická, v místě osamělé síly má skok. |
| **M<sub>y</sub> (x)**, ohybový moment | červená | Kladný, když jsou tažená dolní vlákna. Hodnoty se vypisují na obou koncích, v místech osamělých sil a v každém lokálním extrému (kde V = 0). Ve výchozím stavu zapnutý. |
| **Reakce** | fialová | Šipka a hodnota u každého podepřeného stupně volnosti. Ve výchozím stavu zapnuté. |

Hodnoty se vypisují v charakteristických bodech každého průběhu. Orientaci popisků, velikost průběhů i barvy změníte v [Nastavení](/cs/essentials/units-settings#viewer-settings).

<div class="shots">

![Normálová síla N: oba sloupy jsou tlačené silou 40 kN, příčel silou 20 kN](/screenshots/cs/results-normal.webp)

![Posouvající síla V: ve sloupech 20 kN, v příčli 40 kN v rozích a směrem ke kloubu klesá na nulu](/screenshots/cs/results-shear.webp)

![Ohybový moment M: v obou rozích −80 kNm, v patkách a v kloubu nula](/screenshots/cs/results-moment.webp)

![Deformovaný tvar (zvětšený): kloub C poklesne](/screenshots/cs/results-deformed.webp)

</div>

![Reakce: v každé kloubové podpoře 40 kN svisle a 20 kN vodorovně](/screenshots/cs/results-reactions.webp){.shot-lg}

### Jak číst znaménko {#reading-the-sign}

Znaménko čtěte z popisku hodnoty, ne podle toho, na kterou stranu prutu se průběh vykreslil. Záporný ohybový moment znamená tah v horních vláknech nosníku nebo na vnější straně rámového rohu.

## Popisky po najetí myší {#hover-tooltips}

Nejrychleji odečtete hodnotu tak, že na objekt najedete myší:

- **Uzel**: `ux`, `uz` a `φy` (posunutí v jednotce posunu, pootočení v radiánech).
- **Prvek**: označení, průřez a materiál.
- **Zatížení**: jednotlivé složky.

Na dotykové obrazovce na objekt klepněte. Stejné údaje se pak zobrazí v jeho panelu výběru.

![Najetí myší na uzel 2 nosníku z Rychlého startu](/screenshots/cs/ui-hover.webp){.shot-sm}

## Záložka Výsledky {#results-tab}

Záložka **Výsledky** ve spodní liště obsahuje dvě tabulky. Přepínáte mezi nimi tlačítky **Výsledky v uzlech** a **Výsledky na prvcích**.

### Výsledky v uzlech {#nodal-results}

Každý uzel má jeden řádek s hodnotami **Dx**, **Dz** (v jednotce posunu) a **Ry** (rad). Znaménka odpovídají globálním osám: kladné `Dz` míří dolů a kladné `Ry` je pootočení proti směru hodinových ručiček (při pohledu na obrazovku).

![Výsledky v uzlech trojkloubového rámu (Formát čísel: Automatický)](/screenshots/cs/results-nodal.webp)

### Výsledky na prvcích {#element-results}

Každý prvek má jeden řádek s **koncovými silami v lokálním souřadném systému prvku**:

| Sloupec | Význam |
| --- | --- |
| `X12`, `Z12`, `M12` | normálová síla, posouvající síla a moment, které působí na prvek v jeho **počátečním** uzlu |
| `X21`, `Z21`, `M21` | totéž v **koncovém** uzlu |

![Výsledky na prvcích trojkloubového rámu](/screenshots/cs/results-element.webp)

Jde o síly, kterými uzly působí na prvek: matici tuhosti prvku vynásobenou jeho koncovými posunutími, od které se odečtou ekvivalentní uzlová zatížení. Řídí se lokálními osami, nikoli znaménkovou konvencí průběhů N-V-M:

- Prostý nosník o rozpětí 6 m z [Rychlého startu](/cs/guide/quick-start): `Z12 = Z21 = −36 kN`. Obě podpory tlačí nosník nahoru, tedy ve směru −z.
- Konzola vetknutá v počátečním uzlu, na volném konci síla 18 kN dolů: `Z12 = −18 kN`, `M12 = +72 kNm`, `Z21 = +18 kN`, `M21 = 0`.
- Sloup 1 rámu (A dole, B nahoře): `X12 = +40 kN` tlačí do prvku ve směru lokální osy x, sloup je tedy tlačený silou 40 kN.

### Export CSV a kopírování {#export-csv-and-copy}

**Exportovat CSV** stáhne soubor `edubeam-results.csv` s oběma tabulkami, připravený pro tabulkový procesor. Hodnoty jsou v jednotkách, které vidíte na obrazovce. Tabulka uzlů obsahuje navíc **reakce** `Rx`, `Rz`, `My`. **Kopírovat** uloží tytéž tabulky do schránky jako text oddělený tabulátory, který vložíte přímo do Excelu, LibreOffice nebo Tabulek Google. Koncové síly prvků se v exportu jmenují `N1 V1 M1 N2 V2 M2`.

### Matice tuhosti {#stiffness-matrix}

V panelu prvku nebo v jeho řádku tabulky zvolte **Matice tuhosti**. Otevře se okno s maticí tuhosti prvku 6 × 6 v globálních souřadnicích – hodí se pro kontrolu ručního sestavení v kurzu deformační metody. Vzorce najdete v [teoretickém manuálu](/cs/elements/beam).

## Formát čísel {#number-format}

Výsledky se zobrazují s pěti platnými číslicemi. Jak se zapisují, určuje **Nastavení → Jazyk a prostředí → Formát čísel**:

| Formát | 40 000 se zapíše jako | Vhodné pro |
| --- | --- | --- |
| **Vědecký** (výchozí) | 4 · 10⁴ | hodnoty, které se liší o mnoho řádů |
| **Inženýrský** | 40 · 10³ | zápis odpovídající předponám kilo / mega |
| **Automatický** | 40000 | běžná čísla ve výuce |

Automatický formát zapisuje hodnoty od 0,001 do 100 000 jako obyčejná čísla, mimo tento rozsah používá mocniny deseti. Desetinný oddělovač závisí na zvoleném jazyce.

## Přesnost {#precision-and-accuracy}

- Pro lineární Timoshenkův model je nosníkový prvek přesný při uzlovém, rovnoměrném, lineárně proměnném, osamělém i teplotním zatížení. Výsledky proto **nezávisejí** na počtu prvků.
- Výpočet probíhá ve dvojnásobné přesnosti. Nepatrné hodnoty jako `1,5 · 10⁻¹⁸` jsou zaokrouhlovací chyby, ve skutečnosti jde o nulu.
- Průhyby zahrnují **smykovou deformaci**. U štíhlých prutů zvětší hodnotu podle Eulera–Bernoulliho o zlomek procenta, u vysokých nebo krátkých prutů i o několik procent. Pokud ji chcete potlačit, nastavte smykový součinitel průřezu na velkou hodnotu.

## Výsledky ve zprávě {#results-in-a-report}

- **☰ → Exportovat obrázek** (<kbd>Ctrl</kbd>+<kbd>P</kbd>) uloží výkres se zvolenými vrstvami jako PNG nebo SVG. Viz [Export obrázku](/cs/essentials/import-export#export-an-image).
- Čísla získáte přes **Výsledky → Exportovat CSV** nebo **Kopírovat**.
- Tlačítkem **Sdílet konstrukci** získáte odkaz, přes který čtenář otevře přímo model.
