# Výsledky a průběhy

<Edubeam /> řeší model automaticky po každé změně (omezeno na několik výpočtů za sekundu), takže výsledky jsou vždy aktuální. Tlačítko *Spočítat* neexistuje. Pokud se nic nevykreslí, model zatím není řešitelný – viz [Řešení problémů](/cs/reference/troubleshooting).

## Vrstvy v zobrazení

Zapínají se v **panelu nastavení zobrazení** (tlačítko ⚙ vpravo nahoře v zobrazení).

| Vrstva | Barva (výchozí) | Poznámka |
| --- | --- | --- |
| **Deformovaný tvar** | šedá | Zvětšený; měřítko zvoleno tak, aby největší posunutí odpovídalo hodnotě *Měřítko výsledků* v pixelech. |
| **N (x)** – normálová síla | modrá | Tah kladný. Po délce prvku konstantní, pokud na něj nepůsobí osové spojité zatížení. |
| **V<sub>z</sub> (x)** – posouvající síla | zelená | Lineární při rovnoměrném zatížení, kvadratická při lineárně proměnném, skok v místě osamělé síly. |
| **M<sub>y</sub> (x)** – ohybový moment | červená | Kladný při tahu v dolních vláknech. Popisky na obou koncích, v místech osamělých sil a v každém lokálním extrému (kde V = 0). |
| **Reakce** | fialová | Šipka a hodnota pro každý odebraný stupeň volnosti. |

Průběhy se vykreslují podél prvků s hodnotami v charakteristických bodech. Orientaci popisků i měřítko všech průběhů lze změnit v [Nastavení](/cs/essentials/units-settings#nastaveni-zobrazeni).

### Normálová síla

<Figure>
    <Structure :show-loads="true" show-normal-force :nodes="[{label: 'a', coords: [0,0,0], dofs: [0,2, 4]}, {label: 'b', coords: [10,0,0], dofs: []}]" :elements="[{label: '1', nodes: ['a', 'b']}]" :nodal-loads="[{target: 'b', values: { 0: -100, 2: 0, 4: 0 }}]" />
    <figcaption>Konzola tlačená vodorovnou silou na volném konci: N je konstantní a záporná</figcaption>
</Figure>

### Posouvající síla

<Figure>
  <Structure :show-loads="true" show-shear-force :nodes="[{label: 'a', coords: [0,0,0], dofs: [0,2, 4]}, {label: 'b', coords: [10,0,0], dofs: []}]" :elements="[{label: '1', nodes: ['a', 'b']}]" :nodal-loads="[{target: 'b', values: { 0: 0, 2: 10, 4: 0 }}]" />
 <figcaption>Konzola se svislou silou na konci: V je konstantní</figcaption>
</Figure>

### Ohybový moment

<Figure>
  <Structure :show-loads="true" show-moment :nodes="[{label: 'a', coords: [0,0,0], dofs: [0,2, 4]}, {label: 'b', coords: [10,0,0], dofs: []}]" :elements="[{label: '1', nodes: ['a', 'b']}]" :nodal-loads="[{target: 'b', values: { 0: 0, 2: 10, 4: 0 }}]" />
 <figcaption>Tatáž konzola: M roste lineárně až na F·L ve vetknutí</figcaption>
</Figure>

### Deformovaný tvar

<Figure>
  <Structure :show-loads="true" show-deformed-shape :nodes="[{label: 'a', coords: [0,0,0], dofs: [0,2, 4]}, {label: 'b', coords: [10,0,0], dofs: []}]" :elements="[{label: '1', nodes: ['a', 'b']}]" :nodal-loads="[{target: 'b', values: { 0: 0, 2: 10, 4: 0 }}]" />
  <figcaption>Deformovaný tvar (zvětšený) konzoly</figcaption>
</Figure>

### Reakce

<Structure :show-loads="true" show-reactions :nodes="[{label: 'a', coords: [0,0,0], dofs: [0,2, 4]}, {label: 'b', coords: [10,0,0], dofs: []}]" :elements="[{label: '1', nodes: ['a', 'b']}]" :nodal-loads="[{target: 'b', values: { 0: 0, 2: 10, 4: 0 }}]" />

## Popisky po najetí myší

Najetí myší v zobrazení je nejrychlejší způsob, jak odečíst hodnotu:

- **Uzel** → `ux`, `uz`, `φy` (posunutí v jednotce délky, pootočení v radiánech).
- **Prvek** → označení, průřez a materiál.
- **Zatížení** → jeho složky.

## Záložka Výsledky

Záložka **Výsledky** ve spodní liště má dva pohledy:

### Výsledky v uzlech

Řádek pro každý uzel s **Dx**, **Dz** (jednotka délky) a **Ry** (rad). Znaménka odpovídají globálním osám: kladné `Dz` je dolů, kladné `Ry` proti směru hodinových ručiček.

<figure>

![Výsledky v uzlech](/results_nodes.png)

</figure>

### Výsledky na prvcích

Řádek pro každý prvek s **koncovými silami v lokálním souřadném systému prvku**:

| Sloupec | Význam |
| --- | --- |
| `X12`, `Z12`, `M12` | normálová síla, posouvající síla a moment působící na prvek v jeho **počátečním** uzlu |
| `X21`, `Z21`, `M21` | totéž v **koncovém** uzlu |

Jsou to síly, kterými uzly působí na prvek (matice tuhosti prvku krát koncové posuny, minus ekvivalentní uzlové zatížení). U prostého nosníku 6 m s 12 kN/m dostanete `Z12 = Z21 = −36 kN`: obě podpory tlačí nosník vzhůru (záporné z). U konzoly vetknuté v počátečním uzlu se silou 18 kN dolů na konci: `Z12 = −18`, `M12 = +72 kNm`, `Z21 = +18`, `M21 = 0`.

<figure>

![Výsledky na prvcích](/results_elements.png)

</figure>

### Matice tuhosti

Volbou **Matice tuhosti** z kontextové nabídky prvku nebo z řádku tabulky otevřete plovoucí okno s maticí tuhosti prvku 6 × 6 v lokálních i globálních souřadnicích – užitečné při kontrole ruční sestavy v předmětech o deformační metodě. Vzorce jsou v [teoretickém manuálu](/cs/elements/beam).

## Přesnost

- Prutový prvek je pro lineární Timoshenkův model přesný při uzlovém, rovnoměrném, lineárně proměnném, osamělém i teplotním zatížení, takže výsledky **nezávisí** na počtu prvků.
- Tabulky ukazují čtyři platné číslice; interní výpočet probíhá ve dvojité přesnosti.
- Průhyby zahrnují **smykovou deformaci** (Timoshenko). U štíhlých prutů to oproti vzorcům Eulerova–Bernoulliho nosníku přidá zlomek procenta; u vysokých či krátkých prutů i několik procent. Chcete-li ji potlačit, nastavte smykový součinitel průřezu na velkou hodnotu.

## Výsledky do protokolu

Export tabulek není k dispozici; označte text tabulky a zkopírujte ho, nebo pořiďte snímek zobrazení. K předání modelu použijte [Sdílet konstrukci](/cs/essentials/import-export).
