# Uživatelské rozhraní

<Edubeam /> má tři hlavní části: nahoře **horní lištu**, uprostřed **zobrazení**, ve kterém kreslíte, a dole **spodní lištu** s tabulkou pro každý druh objektu. Když víte, co kde najdete, bude vám zbytek dokumentace dávat smysl.

![Části rozhraní, očíslované podle seznamu níže](/screenshots/cs/ui-overview.webp)

1. **Nabídka ☰**: otevírání, ukládání, sdílení a export; příklady a průvodci.
2. **Tlačítka horní lišty**: Smazat konstrukci a Sdílet konstrukci.
3. **Zpět / Znovu** u každé změny modelu.
4. **Tlačítka zobrazení**: vystředění, přizpůsobení obrazovce a přepínač možností zobrazení.
5. **Možnosti zobrazení**: volba, které výsledky a části modelu se vykreslí.
6. **Mřížka, přichytávání, zaměřovací kříž a jednotky.**
7. **Záložky spodní lišty**: Uzly, Prvky, Zatížení, Materiály, Průřezy, Výsledky.
8. **Tabulka** otevřené záložky, ve které můžete upravit každou hodnotu.

::: tip Projděte si prohlídku
Volba **☰ → Provést aplikací** vás těmito částmi postupně provede přímo v aplikaci.
:::

![Provést aplikací, u kroku s možnostmi zobrazení](/screenshots/cs/tour.webp)

## Horní lišta {#app-bar}

| Ovládací prvek | Funkce |
| --- | --- |
| **Nabídka ☰** | Hlavní nabídka, viz níže. |
| **Smazat konstrukci** | Po potvrzení smaže všechny uzly, prvky a zatížení. Pomocí dvou zaškrtávacích políček můžete smazat i materiály a průřezy. Smazaný model vrátíte klávesami <kbd>Ctrl</kbd>+<kbd>Z</kbd> a najdete ho také v Nedávných konstrukcích. |
| **Sdílet konstrukci** | Otevře [dialog sdílení](/cs/essentials/import-export#share-a-link) s odkazem, který obsahuje celý model. |
| **Co je nového?** | Poznámky k vydání. Po aktualizaci se jednou otevřou samy. |
| **Dokumentace** / GitHub | Tato dokumentace a zdrojový kód. |

Na telefonu se do lišty vejde jen nabídka ☰ a Dokumentace, vše ostatní najdete v nabídce.

### Nabídka ☰ {#the-☰-menu}

![Nabídka ☰](/screenshots/cs/ui-app-menu.webp){.shot-xs}

| Položka | Funkce |
| --- | --- |
| **Otevřít projekt** / **Uložit projekt** | Otevře nebo stáhne soubor `project.json` (<kbd>Ctrl</kbd>+<kbd>O</kbd> / <kbd>Ctrl</kbd>+<kbd>S</kbd>). |
| **Nedávné konstrukce** | Posledních 10 smazaných nebo nahrazených modelů, které můžete obnovit. |
| **Exportovat obrázek** | Uloží výkres do PNG nebo SVG, případně ho zkopíruje (<kbd>Ctrl</kbd>+<kbd>P</kbd>). |
| **Sdílet konstrukci** | Totéž co tlačítko v horní liště. |
| **Příklady** | Galerie hotových modelů. |
| **Nakreslit první nosník** | Řízená úloha o sedmi krocích. |
| **Provést aplikací** | Prohlídka rozhraní. |
| **Smazat konstrukci** | Totéž co tlačítko v horní liště. |

Dole v nabídce najdete verzi aplikace a datum jejího vydání.

## Zobrazení {#viewer}

Na plátně model kreslíte a prohlížíte. Zbytek aplikace reaguje na to, co na něm vyberete.

### Tlačítka na plátně {#buttons-on-the-canvas}

- **Vlevo nahoře:** **Zpět** a **Znovu** (<kbd>Ctrl</kbd>+<kbd>Z</kbd> / <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Z</kbd>). Vrátit můžete každou změnu modelu – přidání, úpravu, přetažení, smazání i vymazání celé konstrukce.
- **Vpravo nahoře:** **Vystředit konstrukci** (<kbd>C</kbd>), **Přizpůsobit obrazovce** (<kbd>F</kbd>) a tlačítko ⚙, které zobrazí nebo skryje možnosti zobrazení. Na dotykových obrazovkách je zde také **Výběr obdélníkem**.
- **Vpravo dole:** **G** zapíná a vypíná mřížku, **S** přichytávání k mřížce, tlačítko zaměřovacího kříže zobrazí polohu kurzoru na pravítkách a **štítek jednotek** otevře nastavení na stránce *Jazyk a prostředí*.

### Možnosti zobrazení {#display-options}

![Tlačítka zobrazení a možnosti zobrazení](/screenshots/cs/ui-display-settings.webp){.shot-lg}

Panel je ve výchozím stavu otevřený a má dvě řady zaškrtávacích políček:

- **Výsledky:** *Deformovaný tvar*, *N (x)*, *V<sub>z</sub> (x)*, *M<sub>y</sub> (x)*, *Reakce*. Na začátku jsou zaškrtnuté Deformovaný tvar, M a Reakce.
- **Model:** *Podpory*, *Zatížení*, *Popisky uzlů*, *Popisky prvků*.

Tlačítko **Všechna nastavení** otevře kompletní [nastavení](/cs/essentials/units-settings) na stránce *Nastavení zobrazení*.

### Pohyb po plátně {#navigating}

| Akce | Myš | Dotyk |
| --- | --- | --- |
| Přiblížení | Kolečko myši (přibližuje ke kurzoru), <kbd>Ctrl</kbd>+<kbd>=</kbd> / <kbd>Ctrl</kbd>+<kbd>-</kbd> | Roztažení a sevření prstů |
| Posun | Tažení **prostředním nebo pravým** tlačítkem (viz *Nastavení → Ovládání & zkratky*) | Tažení jedním prstem |
| Přizpůsobit / vystředit | <kbd>F</kbd> / <kbd>C</kbd> nebo tlačítka vpravo nahoře | Tlačítka vpravo nahoře |

### Výběr a úpravy {#selecting-and-editing}

**Kliknutím** vyberete uzel, prvek, zatížení nebo kótu. Vedle vybraného objektu se otevře panel s podrobnostmi a s akcemi, které se k němu hodí: přidat zatížení, nastavit podpory, upravit, zobrazit matici tuhosti, smazat. Když kliknete na uzel, přepne se navíc spodní lišta na záložku Uzly.

<div class="shots">

![Uzel: přidat zatížení, nastavit podpory, předepsat posunutí](/screenshots/cs/ui-node-menu.webp)

![Prvek: upravit, přidat zatížení, matice tuhosti](/screenshots/cs/ui-element-menu.webp)

</div>

- **Tažením po prázdném plátně** nakreslíte výběrový obdélník. Vybere se vše, co leží uvnitř: uzly, prvky, jejich zatížení a kóty. Klávesou <kbd>Delete</kbd> výběr smažete, pomocí <kbd>Ctrl</kbd>+<kbd>C</kbd> / <kbd>Ctrl</kbd>+<kbd>V</kbd> ho zkopírujete jinam.
- **Tažením uzlu** uzel přesunete. Když je zapnuté přichytávání, přichytí se k mřížce. Připojené prvky a jejich zatížení se posunou s ním.
- **Dvojklikem na zatížení** otevřete jeho úpravu.
- **Najetím myší** na libovolný objekt zobrazíte popisek: u uzlů posunutí a pootočení, u prvků materiál a průřez, u zatížení jejich hodnoty. Na dotykové obrazovce místo toho klepněte – stejné údaje se objeví v panelu výběru.

![Najetí myší na uzel ukáže jeho posunutí a pootočení](/screenshots/cs/ui-hover.webp){.shot-sm}

**Pravým tlačítkem na plátno** (nebo dlouhým podržením na dotykové obrazovce) otevřete nabídku plátna. Chcete-li uzel nebo prvek umístit myší, a ne v dialogu, podržte při volbě *Přidat uzel* nebo *Přidat prvek* klávesu <kbd>Ctrl</kbd>. Když nabídku otevřete nad prvkem, najdete v ní také *Okótovat prvek*.

![Nabídka plátna](/screenshots/cs/ui-canvas-menu.webp){.shot-sm}

Přehled všech zkratek najdete na stránce [Klávesnice, myš a dotyk](/cs/reference/shortcuts).

### Když model nelze vypočítat {#when-the-model-cannot-be-solved}

Vlevo nahoře v zobrazení se objeví hlášení:

- *Není definovaný žádný materiál* / *Není definovaný žádný průřez* s tlačítkem **Přidat**.
- Malý modrý štítek **Chybí podpory**, dokud model není dokončený.
- **Červené hlášení**, pokud je v modelu chyba. Tlačítko **Zobrazit podrobnosti** vypíše všechny problémy.

Pokud je konstrukce pohyblivá, EduBeam rozpohybuje její čárkovaný obrys a zakroužkuje uzly nebo klouby, které pohyb umožňují. Chcete-li pohyb vidět znovu, najeďte myší na hlášení; skrýt ho můžete tlačítkem s okem.

![Rám s klouby v B a C je mechanismus: EduBeam ukáže, jak se pohybuje](/screenshots/cs/ui-mechanism.webp)

![Zobrazit podrobnosti vypíše každý problém i s radou, jak ho opravit](/screenshots/cs/ui-diagnostics.webp){.shot-lg}

Význam jednotlivých hlášení vysvětluje kapitola [Řešení problémů](/cs/reference/troubleshooting).

## Spodní lišta {#bottom-bar}

Spodní lišta má šest záložek, každou s řadou tlačítek a upravitelnou tabulkou. Na záložkách vidíte, kolik objektů daného druhu model obsahuje. Tlačítko **?** vpravo vysvětluje otevřenou záložku, podobně jako **?** u některých záhlaví sloupců. Výšku lišty změníte tažením pruhu se záložkami nahoru nebo dolů, tlačítkem vpravo ji minimalizujete.

| Záložka | Tlačítka | Tabulka |
| --- | --- | --- |
| **Uzly** | Přidat uzel (dialog), Přidat uzel (myš) | Označení, souřadnice, **Podepřené stupně volnosti** (značka podpory, Dx, Dz, Ry, úhel podpory α), zatížení, úprava, smazání |
| **Prvky** | Přidat prvek (dialog), Přidat prvek (myš) | Označení, typ, uzly (s tlačítkem pro prohození), materiál, průřez, **Koncové klouby**, zatížení, matice tuhosti, smazání |
| **Zatížení** | Přidat uzlové zatížení, Přidat prvkové zatížení | Typ, působiště, upravitelné složky, úprava, smazání |
| **Materiály** | Přidat materiál, Knihovna materiálů | Označení, E, G, α<sub>T</sub>, smazání |
| **Průřezy** | Přidat průřez, Knihovna průřezů, Polygonální průřez | Tvar, označení, A, I<sub>y</sub>, h, k, úprava tvaru, smazání |
| **Výsledky** | Výsledky v uzlech, Výsledky na prvcích, Exportovat CSV, Kopírovat | Posunutí a pootočení všech uzlů, nebo koncové síly všech prvků |

Buňky upravujete přímo: klikněte do buňky, napište hodnotu a stiskněte <kbd>Enter</kbd> (klávesou <kbd>Esc</kbd> buňku opustíte). Hodnoty se zobrazují i zadávají v [aktuálních jednotkách](/cs/essentials/units-settings).

## Záložky nad zobrazením {#tabs-above-the-viewer}

Záložka **Konstrukce** zobrazuje plátno, záložka **Nastavení** otevře nastavení přes celou plochu. Můžete tak změnit barvy nebo jednotky a po přepnutí zpět hned vidět výsledek. Štítek jednotek a *Všechna nastavení* otevírají stejné nastavení jako dialog nad modelem.

## Plovoucí okna {#floating-windows}

**Matice tuhosti** (z panelu prvku nebo z tabulky Prvky) otevře okno s maticí tuhosti prvku 6 × 6 v globálních souřadnicích. **Upravit** v nabídce plátna otevře tabulku s aktuálním výběrem. Okna přesouváte tažením za záhlaví a zavíráte křížkem ×.
