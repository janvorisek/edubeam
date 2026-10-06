# Jednotky a nastavení

Nastavení otevřete tlačítkem **⚙ v zobrazení → Všechna nastavení**, kliknutím na **štítek jednotek** v pravém dolním rohu zobrazení nebo záložkou **Nastavení** nad zobrazením. Nastavení se ukládá v prohlížeči a přežije obnovení stránky; **Obnovit výchozí nastavení** vrátí výchozí hodnoty zobrazení a jednotky vašeho regionu (jazyk zůstane).

## Jazyk a prostředí

**Jazyk** – 11 jazyků rozhraní. Aplikaci lze otevřít i s parametrem `?lang=<kód>` (`en`, `cs`, `de`, `fr`, `es`, `pt`, `pl`, `cn`, `th`, `uk`, `ru`).

**Soustava jednotek** – *SI (metrická)* nebo *Americká (imperiální)* nastaví všechny jednotky níže jedním krokem. Jakmile pak změníte kteroukoli jednotlivou jednotku, soustava se zobrazí jako *Vlastní*. Při první návštěvě začne EduBeam v amerických jednotkách, pokud je prohlížeč nastaven na americké národní prostředí *a* počítač je v americkém časovém pásmu; všude jinde začne v SI.

**Jednotky** – každá veličina má vlastní jednotku. Vstupy, tabulky, popisky i hodnoty v průbězích používají zvolenou jednotku a změna jednotky přepočítá, co je zobrazeno (model se interně ukládá v SI, takže přepínáním nic neztratíte a sdílený odkaz otevře stejný model v jakýchkoli jednotkách).

| Veličina | Možnosti | SI | Americká |
| --- | --- | --- | --- |
| Délka (geometrie) | m, cm, mm, ft, in | m | ft |
| Rozměry průřezu | m, cm, mm, ft, in | m | in |
| Posun | m, cm, mm, ft, in | m | in |
| Plocha | m², cm², mm², ft², in² | m² | in² |
| Moment setrvačnosti | m⁴, cm⁴, mm⁴, ft⁴, in⁴ | m⁴ | in⁴ |
| Hmotnost | kg, lb | kg | lb |
| Síla | N, kN, MN, kgf, Tonf, lbf, kip | kN | kip |
| Ohybový moment | Nmm, Nm, kNm, MNm, Tonf·m, lbf·in, lbf·ft, kip·in, kip·ft | kNm | kip·ft |
| Napětí (E, G) | Pa, kPa, MPa, GPa, ksc, psi, ksi, psf, ksf | MPa | ksi |
| Teplota | °C, °F | °C | °F |

Spojitá zatížení používají *sílu / délku* ve zvolených jednotkách (kN/m v SI, kip/ft v amerických jednotkách), hustota *hmotnost / délku³*. Součinitel teplotní roztažnosti se řídí jednotkou teploty (1/K nebo 1/°F). Teplotní zatížení jsou *změny* teploty, takže 10 °C odpovídá 18 °F. Pootočení jsou vždy v radiánech.

Tonf je metrická tuna-síla (1000 kgf), ne americká krátká tuna (short ton). Americké jednotky se převádějí podle přesných definic (1 ft = 0,3048 m, 1 kip = 4448,2216 N).

**Souřadnicový systém** – *x doprava, z dolů* (výchozí) nebo *x doprava, y nahoru*. Volba y nahoru obrací znaménko svislých hodnot a úhlů podpor a přejmenuje osy ve všech vstupech, tabulkách, popiscích i exportu; model ani uložené soubory se nemění. Viz [Osa y nahoru](/cs/elements/conventions#y-up-axes).

## Nastavení zobrazení

**Náhled zobrazení** nahoře ukazuje malý model, který reaguje na každou změnu níže.

**Mřížka**
- **Zobrazit mřížku** (<kbd>G</kbd>) – vykreslí mřížku a pravítka.
- **Přichytávat k mřížce** (<kbd>S</kbd>) – uzly umístěné či přetažené myší se přichytí ke kroku mřížky.
- **Krok příchytu k mřížce** – rozteč v jednotce délky (výchozí 0,1 m, v amerických jednotkách 0,5 ft). Při přepnutí mezi metrickými a americkými jednotkami se krok ponechaný na výchozí hodnotě změní na výchozí hodnotu druhé soustavy; krok, který jste nastavili sami, zůstane. Pravítka také počítají v jednotce délky; ve stopách ukazují pravítka i zaměřovací kříž stopy a palce (5′-6″), zatímco vstupy a tabulky zůstávají v desetinných stopách (5,5).

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
