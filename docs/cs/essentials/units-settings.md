# Jednotky a nastavení

Do nastavení se dostanete třemi způsoby:

- záložkou **Nastavení** nad zobrazením, která ho ukáže na celou plochu;
- **štítkem jednotek** vpravo dole v zobrazení, který ho otevře na stránce *Jazyk a prostředí*;
- tlačítkem **Všechna nastavení** pod možnostmi zobrazení, které ho otevře na stránce *Nastavení zobrazení*.

Nastavení se ukládá v prohlížeči a přežije obnovení stránky. **Obnovit výchozí nastavení** vrátí výchozí hodnoty zobrazení, formát čísel, osy, tlačítko pro posun a jednotky vašeho regionu; jazyk zůstane zachován.

## Jazyk a prostředí {#language-locale}

![Nastavení → Jazyk a prostředí](/screenshots/cs/settings-language.webp)

**Jazyk.** 12 jazyků rozhraní. Aplikaci můžete otevřít také s parametrem `?lang=<kód>`: `en`, `cs`, `de`, `fr`, `es`, `pt`, `pl`, `cn`, `th`, `uk`, `ru`, `tr`.

**Formát čísel.** Jak se zapisují hodnoty výsledků: *Automatický*, *Vědecký* (výchozí) nebo *Inženýrský*. Viz [Formát čísel](/cs/essentials/results#number-format).

**Souřadnicový systém.** *x doprava, z dolů* (výchozí) nebo *x doprava, y nahoru*. Volba y nahoru obrací znaménko svislých hodnot a úhlů podpor a přejmenuje osy ve všech vstupech, tabulkách, popiscích i exportech. Model ani uložené soubory se nemění. Viz [Osy s y nahoru](/cs/elements/conventions#y-up-axes).

![Trojkloubový rám s osou y nahoru: ukazatel os v rohu míří y nahoru](/screenshots/cs/settings-y-up.webp){.shot-lg}

**Soustava jednotek.** *SI (metrická)* nebo *Americká (imperiální)* nastaví všechny jednotky níže jedním krokem. Jakmile pak změníte kteroukoli jednotlivou jednotku, soustava se zobrazí jako *Vlastní*. Při první návštěvě volíte v uvítacím dialogu; do té doby EduBeam odhadne americké jednotky jen tehdy, je-li prohlížeč nastaven na americké národní prostředí *a* počítač je v americkém časovém pásmu.

**Jednotky.** Každá veličina má vlastní jednotku. Vstupy, tabulky, popisky i hodnoty v průbězích používají zvolenou jednotku a změna jednotky přepočítá, co je zobrazeno. Samotný model se ukládá v SI, takže přepínáním tam a zpět nic neztratíte a sdílený odkaz otevře stejný model v jakýchkoli jednotkách.

| Veličina | Možnosti | SI | Americké |
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

Spojitá zatížení používají *sílu / délku* ve zvolených jednotkách (kN/m v SI, kip/ft v amerických jednotkách) a hustota *hmotnost / délku³*. Součinitel teplotní roztažnosti se řídí jednotkou teploty (1/K nebo 1/°F). Teplotní zatížení jsou *změny* teploty, takže 10 °C odpovídá 18 °F. Pootočení jsou vždy v radiánech.

Tonf je metrická tuna-síla (1000 kgf), ne americká krátká tuna (short ton). Americké jednotky se převádějí podle přesných definic (1 ft = 0,3048 m, 1 kip = 4448,2216 N). Ve stopách zadávejte desetinné hodnoty, například `5,5`; pravítka a zaměřovací kříž ukazují stopy a palce (5′-6″).

## Nastavení zobrazení {#viewer-settings}

![Nastavení → Nastavení zobrazení, s živým náhledem vpravo](/screenshots/cs/settings-viewer.webp)

**Náhled zobrazení** vedle nastavení ukazuje malý model, který reaguje na každou změnu. Štítky pod ním volí, který výsledek se zobrazí, a kliknutí na barvu přepne náhled na odpovídající výsledek.

**Mřížka**
- **Zobrazit mřížku** (<kbd>G</kbd>) vykreslí mřížku a pravítka.
- **Přichytávat k mřížce** (<kbd>S</kbd>) přichytí uzly, které umístíte nebo přetáhnete, ke kroku mřížky.
- **Zobrazit zaměřovací kříž** vyznačí polohu ukazatele na pravítkách, takže můžete odečíst jeho souřadnice (jen s myší).
- **Krok příchytu k mřížce** je rozteč v jednotce délky: ve výchozím nastavení 0,1 m, v amerických jednotkách 0,5 ft. Při přepnutí mezi metrickými a americkými jednotkami se krok ponechaný na výchozí hodnotě změní na výchozí hodnotu druhé soustavy; krok, který jste nastavili sami, zůstane.

**Velikost**
- **Měřítko výsledků** (8–120 px, výchozí 48) je výška největší pořadnice průběhu nebo největšího průhybu na obrazovce. Průběhy se škálují podle vlastního maxima, jde tedy o čistě vizuální volbu; změňte ji, když jsou průběhy příliš velké nebo malé.
- **Velikost podpor** (50–150 %) a **Velikost písma** (10–20 px). Větší písmo pomáhá na projektoru.

**Orientace popisků výsledků**: *Kolmo k vykreslení grafu* (popisky sledují průběh) nebo *Vždy vodorovně*.

**Kontrola modelu**
- **Zobrazit, jak se nestabilní konstrukce může pohybovat** vykreslí čárkovaný obrys mechanismu.
- **Animovat pohyb** ho rozkývá tam a zpět.

**Barvy**: samostatné barvy pro uzly, prvky, zatížení, deformovaný tvar, normálovou sílu, posouvající sílu, ohybový moment a reakce. Výchozí: N modrá, V zelená, M červená, reakce fialová, zatížení oranžová.

## Ovládání & zkratky {#controls-shortcuts}

**Posun zobrazení pomocí** nastavuje, kterým tlačítkem myši se posouvá plátno: *Kolečko nebo pravé tlačítko* (výchozí), *Kolečko myši* nebo *Pravé tlačítko*. Úplný seznam zkratek je na stránce [Klávesnice, myš a dotyk](/cs/reference/shortcuts).

## Co se ukládá v prohlížeči {#what-is-stored-in-your-browser}

Kromě nastavení si EduBeam v místním úložišti prohlížeče uchovává:

- **aktuální model**, ukládaný po každé změně, takže obnovení záložky nebo opětovné otevření aplikace ho obnoví;
- **Nedávné konstrukce**: posledních 10 modelů, které jste smazali nebo nahradili.

Obojí platí pro daný prohlížeč a zařízení a smazáním dat webu se obojí odstraní. Chcete-li model uchovat nebo přenést jinam, použijte [Uložit projekt nebo Sdílet konstrukci](/cs/essentials/import-export).
