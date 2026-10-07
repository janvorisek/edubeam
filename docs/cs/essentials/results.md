# Výsledky a průběhy

<Edubeam /> řeší model po každé změně, nejvýše několikrát za sekundu, takže výsledky jsou vždy aktuální. Tlačítko *Spočítat* neexistuje. Pokud se nic nevykreslí, model zatím nelze vyřešit; hlášení vlevo nahoře v zobrazení řekne proč (viz [Řešení problémů](/cs/reference/troubleshooting)).

Všechny obrázky na této stránce ukazují tentýž model: [trojkloubový rám](/cs/tutorials/three-hinged-frame) zatížený 10 kN/m.

## Vrstvy v zobrazení {#overlays-in-the-viewer}

Zapínají a vypínají se v **možnostech zobrazení** vpravo nahoře v zobrazení (tlačítko ⚙ je zobrazí nebo skryje).

| Vrstva | Barva (výchozí) | Poznámka |
| --- | --- | --- |
| **Deformovaný tvar** | šedá | Zvětšený: největší posunutí se vykreslí s délkou *Měřítka výsledků* v pixelech. Ve výchozím stavu zapnutý. |
| **N (x)**, normálová síla | modrá | Tah je kladný. Po délce prvku konstantní, pokud na něj nepůsobí osové zatížení. |
| **V<sub>z</sub> (x)**, posouvající síla | zelená | Lineární při rovnoměrném zatížení, kvadratická při lineárně proměnném, se skokem v místě osamělé síly. |
| **M<sub>y</sub> (x)**, ohybový moment | červená | Kladný při tahu v dolních vláknech. Popsaný na obou koncích, v místech osamělých sil a v každém lokálním extrému (kde V = 0). Ve výchozím stavu zapnutý. |
| **Reakce** | fialová | Šipka a hodnota pro každý podepřený stupeň volnosti. Ve výchozím stavu zapnuté. |

Hodnoty se vypisují v charakteristických bodech každého průběhu. Orientaci popisků, velikost průběhů i barvy lze změnit v [Nastavení](/cs/essentials/units-settings#viewer-settings).

<div class="shots">

![Normálová síla N: oba sloupy přenášejí tlak 40 kN, příčel 20 kN](/screenshots/cs/results-normal.webp)

![Posouvající síla V: ve sloupech 20 kN; v příčli 40 kN v rozích, klesající k nule v kloubu](/screenshots/cs/results-shear.webp)

![Ohybový moment M: −80 kNm v obou rozích, nula v patkách a v kloubu](/screenshots/cs/results-moment.webp)

![Deformovaný tvar (zvětšený): kloub v C poklesne](/screenshots/cs/results-deformed.webp)

</div>

![Reakce: 40 kN svisle a 20 kN vodorovně v každém kloubu](/screenshots/cs/results-reactions.webp){.shot-lg}

### Čtení znaménka {#reading-the-sign}

Znaménko hodnoty čtěte z jejího popisku, ne podle toho, na které straně prutu je průběh vykreslen. Záporný ohybový moment znamená tah v horních vláknech nosníku, nebo na vnější straně rohu rámu.

## Popisky po najetí myší {#hover-tooltips}

Najetí myší na objekt je nejrychlejší způsob, jak odečíst hodnotu:

- **Uzel**: `ux`, `uz` a `φy` (posunutí v jednotce posunu, pootočení v radiánech).
- **Prvek**: jeho označení, průřez a materiál.
- **Zatížení**: jeho složky.

Na dotykové obrazovce na objekt místo toho klepněte. Stejné údaje se objeví v jeho panelu výběru.

![Najetí myší na uzel 2 nosníku z Rychlého startu](/screenshots/cs/ui-hover.webp){.shot-sm}

## Záložka Výsledky {#results-tab}

Záložka **Výsledky** ve spodní liště obsahuje dvě tabulky, mezi kterými přepínáte tlačítky **Výsledky v uzlech** a **Výsledky na prvcích**.

### Výsledky v uzlech {#nodal-results}

Jeden řádek na uzel s hodnotami **Dx**, **Dz** (jednotka posunu) a **Ry** (rad). Znaménka sledují globální osy: kladné `Dz` míří dolů a kladné `Ry` je na obrazovce proti směru hodinových ručiček.

![Výsledky v uzlech trojkloubového rámu (Formát čísel: Automatický)](/screenshots/cs/results-nodal.webp)

### Výsledky na prvcích {#element-results}

Jeden řádek na prvek s **koncovými silami v lokálním souřadném systému prvku**:

| Sloupec | Význam |
| --- | --- |
| `X12`, `Z12`, `M12` | normálová síla, posouvající síla a moment působící na prvek v jeho **počátečním** uzlu |
| `X21`, `Z21`, `M21` | totéž v jeho **koncovém** uzlu |

![Výsledky na prvcích trojkloubového rámu](/screenshots/cs/results-element.webp)

Jsou to síly, kterými uzly působí na prvek: matice tuhosti prvku vynásobená jeho koncovými posunutími, minus ekvivalentní uzlová zatížení. Sledují lokální osy, nikoli znaménkovou konvenci N-V-M průběhů:

- Pro prostý nosník o rozpětí 6 m z [Rychlého startu](/cs/guide/quick-start): `Z12 = Z21 = −36 kN`. Obě podpory tlačí nosník nahoru, tedy ve směru −z.
- Pro konzolu vetknutou v počátečním uzlu se silou 18 kN dolů na konci: `Z12 = −18 kN`, `M12 = +72 kNm`, `Z21 = +18 kN`, `M21 = 0`.
- Pro sloup 1 rámu (A dole, B nahoře): `X12 = +40 kN` tlačí podél lokální osy x do prvku, což je tlak 40 kN.

### Export CSV a kopírování {#export-csv-and-copy}

**Exportovat CSV** stáhne soubor `edubeam-results.csv` s oběma tabulkami, v jednotkách zobrazených na obrazovce a připravený pro tabulkový procesor. Tabulka uzlů uvádí také **reakce** `Rx`, `Rz`, `My`. **Kopírovat** vloží tytéž tabulky do schránky jako text oddělený tabulátory, který se dá vložit přímo do Excelu, LibreOffice nebo Tabulek Google. V exportu se koncové síly prvků jmenují `N1 V1 M1 N2 V2 M2`.

### Matice tuhosti {#stiffness-matrix}

Zvolte **Matice tuhosti** v panelu prvku nebo v jeho řádku tabulky a otevře se okno s maticí tuhosti prvku 6 × 6 v globálních souřadnicích, užitečné pro kontrolu ruční sestavy v kurzu deformační metody. Vzorce najdete v [teoretickém manuálu](/cs/elements/beam).

## Formát čísel {#number-format}

Výsledky se zobrazují na pět platných číslic. **Nastavení → Jazyk a prostředí → Formát čísel** určuje, jak se zapisují:

| Formát | 40 000 se zapíše jako | Vhodné pro |
| --- | --- | --- |
| **Vědecký** (výchozí) | 4 · 10⁴ | hodnoty v rozsahu mnoha řádů |
| **Inženýrský** | 40 · 10³ | soulad s předponami kilo / mega |
| **Automatický** | 40000 | běžná čísla ve výuce |

Automatický formát zapisuje hodnoty od 0,001 do 100 000 jako obyčejná čísla a mimo tento rozsah přechází na mocniny deseti. Desetinný oddělovač se řídí jazykem.

## Přesnost {#precision-and-accuracy}

- Nosníkový prvek je pro lineární Timoshenkův model přesný při uzlovém, rovnoměrném, lineárně proměnném, osamělém i teplotním zatížení, takže výsledky **nezávisejí** na počtu prvků.
- Výpočet probíhá ve dvojnásobné přesnosti. Nepatrné hodnoty jako `1,5 · 10⁻¹⁸` jsou zaokrouhlovací chyby a znamenají nulu.
- Průhyby zahrnují **smykovou deformaci**. U štíhlých prutů přidává zlomek procenta k hodnotě podle Eulera–Bernoulliho; u vysokých nebo krátkých prutů to může být i několik procent. Chcete-li ji potlačit, nastavte smykový součinitel průřezu na velkou hodnotu.

## Výsledky ve zprávě {#results-in-a-report}

- **☰ → Exportovat obrázek** (<kbd>Ctrl</kbd>+<kbd>P</kbd>) uloží výkres jako PNG nebo SVG se zvolenými vrstvami. Viz [Export obrázku](/cs/essentials/import-export#export-an-image).
- **Výsledky → Exportovat CSV** nebo **Kopírovat** vám dá čísla.
- **Sdílet konstrukci** vám dá odkaz, takže čtenář může otevřít přímo model.
