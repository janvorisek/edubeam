# Jednotky a nastavení

Nastavení otevřete třemi způsoby:

- záložkou **Nastavení** nad zobrazením – nastavení pak zabere celou plochu;
- **štítkem jednotek** vpravo dole v zobrazení – otevře se na stránce *Jazyk a prostředí*;
- tlačítkem **Všechna nastavení** pod možnostmi zobrazení – otevře se na stránce *Nastavení zobrazení*.

Nastavení se ukládá v prohlížeči, takže vydrží i obnovení stránky. Tlačítko **Obnovit výchozí nastavení** vrátí výchozí hodnoty zobrazení, formát čísel, osy, tlačítko pro posun a jednotky vašeho regionu; jazyk ponechá.

## Jazyk a prostředí {#language-locale}

![Nastavení → Jazyk a prostředí](/screenshots/cs/settings-language.webp)

**Jazyk.** Rozhraní je k dispozici ve 12 jazycích. Aplikaci můžete otevřít také s parametrem `?lang=<kód>`: `en`, `cs`, `de`, `fr`, `es`, `pt`, `pl`, `cn`, `th`, `uk`, `ru`, `tr`.

**Formát čísel.** Určuje, jak se zapisují výsledky: *Automatický*, *Vědecký* (výchozí) nebo *Inženýrský*. Viz [Formát čísel](/cs/essentials/results#number-format).

**Souřadnicový systém.** *x doprava, z dolů* (výchozí) nebo *x doprava, y nahoru*. Při volbě y nahoru se obrátí znaménko svislých hodnot a úhlů podpor a osy se přejmenují ve všech vstupech, tabulkách, popiscích i exportech. Model ani uložené soubory se nezmění. Viz [Osy s y nahoru](/cs/elements/conventions#y-up-axes).

![Trojkloubový rám s osou y nahoru: ukazatel os v rohu míří y nahoru](/screenshots/cs/settings-y-up.webp){.shot-lg}

**Soustava jednotek.** Volba *SI (metrická)* nebo *Americká (imperiální)* nastaví naráz všechny jednotky níže. Jakmile pak kteroukoli z nich změníte, soustava se zobrazí jako *Vlastní*. Při první návštěvě soustavu vybíráte v uvítacím dialogu; do té doby EduBeam zvolí americké jednotky jen tehdy, když má prohlížeč nastavené americké národní prostředí *a* počítač je v americkém časovém pásmu.

**Jednotky.** Každá veličina má vlastní jednotku. Vstupy, tabulky, popisky i hodnoty v průbězích používají zvolenou jednotku a po její změně se zobrazené hodnoty přepočítají. Model samotný se ukládá v SI, takže přepínáním tam a zpět nic neztratíte a sdílený odkaz otevře stejný model v jakýchkoli jednotkách.

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

Spojitá zatížení se zadávají v jednotkách *síla / délka* (kN/m v SI, kip/ft v amerických jednotkách), hustota v jednotkách *hmotnost / délka³*. Součinitel teplotní roztažnosti se řídí jednotkou teploty (1/K nebo 1/°F). Teplotní zatížení jsou *změny* teploty, takže 10 °C odpovídá 18 °F. Pootočení jsou vždy v radiánech.

Tonf je metrická tuna-síla (1000 kgf), nikoli americká krátká tuna (short ton). Americké jednotky se převádějí podle přesných definic (1 ft = 0,3048 m, 1 kip = 4448,2216 N). Stopy zadávejte jako desetinné číslo, například `5,5`; pravítka a zaměřovací kříž ukazují stopy a palce (5′-6″).

## Nastavení zobrazení {#viewer-settings}

![Nastavení → Nastavení zobrazení, vpravo živý náhled](/screenshots/cs/settings-viewer.webp)

**Náhled zobrazení** vedle nastavení ukazuje malý model, který okamžitě reaguje na každou změnu. Štítky pod ním určují, který výsledek se zobrazí; když kliknete na barvu, náhled se přepne na příslušný výsledek.

**Mřížka**
- **Zobrazit mřížku** (<kbd>G</kbd>) vykreslí mřížku a pravítka.
- **Přichytávat k mřížce** (<kbd>S</kbd>) přichytí uzly, které umisťujete nebo přetahujete, ke kroku mřížky.
- **Zobrazit zaměřovací kříž** vyznačí polohu ukazatele na pravítkách, takže odečtete jeho souřadnice (jen při ovládání myší).
- **Krok příchytu k mřížce** je rozteč v jednotce délky: výchozí hodnota je 0,1 m, v amerických jednotkách 0,5 ft. Když přepnete mezi metrickými a americkými jednotkami, výchozí krok se změní na výchozí krok druhé soustavy; krok, který jste nastavili sami, zůstane.

**Velikost**
- **Měřítko výsledků** (8–120 px, výchozí 48) je výška největší pořadnice průběhu nebo největšího průhybu na obrazovce. Každý průběh se škáluje podle svého maxima, jde tedy čistě o vzhled; upravte ho, když jsou průběhy příliš velké nebo malé.
- **Velikost podpor** (50–150 %) a **Velikost písma** (10–20 px). Na projektoru se hodí větší písmo.

**Orientace popisků výsledků**: *Kolmo k vykreslení grafu* (popisky sledují průběh) nebo *Vždy vodorovně*.

**Kontrola modelu**
- **Zobrazit, jak se nestabilní konstrukce může pohybovat** vykreslí čárkovaný obrys mechanismu.
- **Animovat pohyb** tento obrys rozhýbe tam a zpět.

**Barvy**: vlastní barva pro uzly, prvky, zatížení, deformovaný tvar, normálovou sílu, posouvající sílu, ohybový moment a reakce. Výchozí barvy: N modrá, V zelená, M červená, reakce fialová, zatížení oranžová.

## Ovládání & zkratky {#controls-shortcuts}

**Posun zobrazení pomocí** určuje, kterým tlačítkem myši posouváte plátno: *Kolečko nebo pravé tlačítko* (výchozí), *Kolečko myši* nebo *Pravé tlačítko*. Úplný seznam zkratek najdete na stránce [Klávesnice, myš a dotyk](/cs/reference/shortcuts).

## Co se ukládá v prohlížeči {#what-is-stored-in-your-browser}

Kromě nastavení si EduBeam v místním úložišti prohlížeče uchovává:

- **aktuální model** – ukládá se po každé změně, takže se po obnovení záložky nebo opětovném otevření aplikace vrátí;
- **Nedávné konstrukce** – posledních 10 modelů, které jste smazali nebo nahradili.

Obojí patří jen k danému prohlížeči a zařízení a smazáním dat webu zmizí. Pokud chcete model uchovat nebo přenést jinam, použijte [Uložit projekt nebo Sdílet konstrukci](/cs/essentials/import-export).
