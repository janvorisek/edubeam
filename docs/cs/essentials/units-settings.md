# Jednotky a nastavení

Nastavení otevřete tlačítkem **⚙ v zobrazení → Všechna nastavení**, kliknutím na **štítek jednotek** v pravém dolním rohu zobrazení nebo záložkou **Nastavení** nad zobrazením. Nastavení se ukládá v prohlížeči a přežije obnovení stránky; **Obnovit výchozí nastavení** vrátí výchozí hodnoty zobrazení (jazyk a jednotky zůstanou).

## Jazyk a prostředí

**Jazyk** – 11 jazyků rozhraní. Aplikaci lze otevřít i s parametrem `?lang=<kód>` (`en`, `cs`, `de`, `fr`, `es`, `pt`, `pl`, `cn`, `th`, `uk`, `ru`).

**Jednotky** – každá veličina má vlastní jednotku. Vstupy, tabulky, popisky i hodnoty v průbězích používají zvolenou jednotku a změna jednotky přepočítá, co je zobrazeno (model se interně ukládá v SI, takže přepínáním nic neztratíte).

| Veličina | Možnosti | Výchozí |
| --- | --- | --- |
| Délka | m, cm, mm, in, ft | m |
| Plocha | m², cm², mm², in², ft² | m² |
| Moment setrvačnosti | m⁴, cm⁴, mm⁴, in⁴, ft⁴ | m⁴ |
| Hmotnost | kg, lb | kg |
| Síla | N, kN, MN, lbf, tonf, kgf | kN |
| Ohybový moment | Nmm, Nm, kNm, MNm, tonf·m, lbf·in, lbf·ft | kNm |
| Napětí (E, G) | Pa, kPa, MPa, GPa, psi, ksc | MPa |

Spojitá zatížení používají *sílu / délku* ve zvolených jednotkách (výchozí kN/m). Úhly jsou vždy v radiánech, teploty vždy ve °C/K.

::: tip Imperiální jednotky
Zvolte ft (nebo in), in², in⁴, lbf a psi podle potřeby – jediný „imperiální“ přepínač neexistuje, každá veličina se nastavuje zvlášť.
:::

## Nastavení zobrazení

**Náhled zobrazení** nahoře ukazuje malý model, který reaguje na každou změnu níže.

**Mřížka**
- **Zobrazit mřížku** (<kbd>G</kbd>) – vykreslí mřížku a pravítka.
- **Přichytávat k mřížce** (<kbd>S</kbd>) – uzly umístěné či přetažené myší se přichytí ke kroku mřížky.
- **Krok příchytu k mřížce** – rozteč v metrech (výchozí 0,1).

**Popisky výsledků**
- **Orientace popisků výsledků** – *Kolmo k vykreslení grafu* (popisky sledují průběh) nebo *Vždy vodorovně*.

**Velikost**
- **Měřítko výsledků** (0–120 px) – výška největší pořadnice průběhu / největšího průhybu na obrazovce. Průběhy se normují vlastním maximem, jde tedy o čistě vizuální volbu; upravte ji, když jsou průběhy vůči modelu příliš velké nebo malé.
- **Velikost podpor** (0,5–1,5) a **Velikost písma** (10–20 px).

**Barvy** – samostatné barvy pro uzly, prvky, zatížení, deformovaný tvar, normálovou sílu, posouvající sílu, ohybový moment a reakce. Výchozí: N modrá, V zelená, M červená, reakce fialová, zatížení oranžová.

## Ovládání & zkratky

**Posun zobrazení pomocí** – kterým tlačítkem myši se posouvá plátno: *prostřední nebo pravé* (výchozí), *Kolečko myši* (jen prostřední tlačítko) nebo jen *Pravé tlačítko*. Úplný seznam zkratek je na stránce [Klávesnice a myš](/cs/reference/shortcuts).

## Co se ukládá automaticky

Kromě nastavení si EduBeam po každé změně ukládá **aktuální model** do místního úložiště prohlížeče. Obnovení záložky nebo opětovné otevření aplikace ho obnoví. Platí to pro daný prohlížeč a zařízení – k přenosu jinam použijte [Uložit projekt nebo Sdílet konstrukci](/cs/essentials/import-export).
