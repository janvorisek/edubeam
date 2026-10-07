# Uživatelské rozhraní

<Edubeam /> má tři oblasti: **horní lištu** nahoře, **zobrazení** uprostřed, kde kreslíte, a **spodní lištu** s tabulkou pro každý druh objektu. Jakmile víte, co kde najdete, dává zbytek dokumentace smysl.

![Části rozhraní, očíslované podle seznamu níže](/screenshots/cs/ui-overview.webp)

1. **Nabídka ☰**: otevírání, ukládání, sdílení a export; příklady a průvodci.
2. **Tlačítka horní lišty**: Smazat konstrukci a Sdílet konstrukci.
3. **Zpět / Znovu** pro každou změnu modelu.
4. **Tlačítka zobrazení**: vystředění, přizpůsobení obrazovce a přepínač možností zobrazení.
5. **Možnosti zobrazení**: které výsledky a části modelu se kreslí.
6. **Mřížka, přichytávání, zaměřovací kříž a jednotky.**
7. **Záložky spodní lišty**: Uzly, Prvky, Zatížení, Materiály, Průřezy, Výsledky.
8. **Tabulka** otevřené záložky, ve které lze upravit každou hodnotu.

::: tip Projděte si prohlídku
**☰ → Provést aplikací** vám tyto části postupně ukáže přímo v aplikaci.
:::

![Provést aplikací, u kroku s možnostmi zobrazení](/screenshots/cs/tour.webp)

## Horní lišta {#app-bar}

| Ovládací prvek | Funkce |
| --- | --- |
| **Nabídka ☰** | Hlavní nabídka, viz níže. |
| **Smazat konstrukci** | Po potvrzení smaže všechny uzly, prvky a zatížení. Dvě zaškrtávací políčka smažou i materiály a průřezy. <kbd>Ctrl</kbd>+<kbd>Z</kbd> model vrátí a zůstane také v Nedávných konstrukcích. |
| **Sdílet konstrukci** | Otevře [dialog sdílení](/cs/essentials/import-export#share-a-link) s odkazem, který obsahuje celý model. |
| **Co je nového?** | Poznámky k vydání. Po aktualizaci se jednou otevřou samy. |
| **Dokumentace** / GitHub | Tato dokumentace a zdrojový kód. |

Na telefonu se vejde jen nabídka ☰ a Dokumentace; vše ostatní je v nabídce.

### Nabídka ☰ {#the-☰-menu}

![Nabídka ☰](/screenshots/cs/ui-app-menu.webp){.shot-xs}

| Položka | Funkce |
| --- | --- |
| **Otevřít projekt** / **Uložit projekt** | Otevře nebo stáhne soubor `project.json` (<kbd>Ctrl</kbd>+<kbd>O</kbd> / <kbd>Ctrl</kbd>+<kbd>S</kbd>). |
| **Nedávné konstrukce** | Posledních 10 modelů, které jste smazali nebo nahradili, připravených k obnovení. |
| **Exportovat obrázek** | Uloží výkres jako PNG nebo SVG, nebo ho zkopíruje (<kbd>Ctrl</kbd>+<kbd>P</kbd>). |
| **Sdílet konstrukci** | Totéž co tlačítko v horní liště. |
| **Příklady** | Galerie hotových modelů. |
| **Nakreslit první nosník** | Sedmikrokový řízený úkol. |
| **Provést aplikací** | Prohlídka rozhraní. |
| **Smazat konstrukci** | Totéž co tlačítko v horní liště. |

Ve spodní části nabídky je uvedena verze aplikace a datum jejího vydání.

## Zobrazení {#viewer}

Plátno je místo, kde model kreslíte a prohlížíte. Vše ostatní v aplikaci reaguje na to, co zde vyberete.

### Tlačítka na plátně {#buttons-on-the-canvas}

- **Vlevo nahoře:** **Zpět** a **Znovu** (<kbd>Ctrl</kbd>+<kbd>Z</kbd> / <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Z</kbd>). Každou změnu modelu, včetně přidání, úpravy, přetažení, smazání a vymazání konstrukce, lze vrátit.
- **Vpravo nahoře:** **Vystředit konstrukci** (<kbd>C</kbd>), **Přizpůsobit obrazovce** (<kbd>F</kbd>) a tlačítko ⚙, které zobrazí nebo skryje možnosti zobrazení. Na dotykových obrazovkách je zde také **Výběr obdélníkem**.
- **Vpravo dole:** **G** přepíná mřížku, **S** přichytávání k mřížce, tlačítko zaměřovacího kříže ukazuje polohu ukazatele na pravítkách a **štítek jednotek** otevře nastavení na stránce *Jazyk a prostředí*.

### Možnosti zobrazení {#display-options}

![Tlačítka zobrazení a možnosti zobrazení](/screenshots/cs/ui-display-settings.webp){.shot-lg}

Dvě řady zaškrtávacích políček, ve výchozím stavu otevřené:

- **Výsledky:** *Deformovaný tvar*, *N (x)*, *V<sub>z</sub> (x)*, *M<sub>y</sub> (x)*, *Reakce*. Deformovaný tvar, M a Reakce jsou na začátku zaškrtnuté.
- **Model:** *Podpory*, *Zatížení*, *Popisky uzlů*, *Popisky prvků*.

**Všechna nastavení** otevře kompletní [nastavení](/cs/essentials/units-settings) na stránce *Nastavení zobrazení*.

### Pohyb po plátně {#navigating}

| Akce | Myš | Dotyk |
| --- | --- | --- |
| Zoom | Kolečko myši (přibližuje ke kurzoru), <kbd>Ctrl</kbd>+<kbd>=</kbd> / <kbd>Ctrl</kbd>+<kbd>-</kbd> | Roztažení prstů |
| Posun | Tažení **prostředním nebo pravým** tlačítkem (viz *Nastavení → Ovládání & zkratky*) | Tažení jedním prstem |
| Přizpůsobit / vystředit | <kbd>F</kbd> / <kbd>C</kbd> nebo tlačítka vpravo nahoře | Tlačítka vpravo nahoře |

### Výběr a úpravy {#selecting-and-editing}

**Kliknutím** vyberete uzel, prvek, zatížení nebo kótu. Vedle výběru se otevře panel s jeho podrobnostmi a odpovídajícími akcemi: přidat zatížení, nastavit podpory, upravit, zobrazit matici tuhosti, smazat. Kliknutí na uzel navíc přepne spodní lištu na záložku Uzly.

<div class="shots">

![Uzel: přidat zatížení, nastavit podpory, předepsat posunutí](/screenshots/cs/ui-node-menu.webp)

![Prvek: upravit, přidat zatížení, matice tuhosti](/screenshots/cs/ui-element-menu.webp)

</div>

- **Tažením po prázdném plátně** nakreslíte výběrový obdélník. Vybere se vše uvnitř: uzly, prvky, jejich zatížení a kóty. Stiskem <kbd>Delete</kbd> vše smažete, pomocí <kbd>Ctrl</kbd>+<kbd>C</kbd> / <kbd>Ctrl</kbd>+<kbd>V</kbd> to zkopírujete jinam.
- **Tažením uzlu** ho přesunete. Se zapnutým přichytáváním padne na mřížku. Připojené prvky a jejich zatížení se přesunou s ním.
- **Dvojklikem na zatížení** ho upravíte.
- **Najetím myší** na cokoli zobrazíte popisek. Uzly ukážou svá posunutí a pootočení, prvky materiál a průřez, zatížení své hodnoty. Na dotykové obrazovce místo toho klepněte: stejné údaje se objeví v panelu výběru.

![Najetí myší na uzel ukáže jeho posunutí a pootočení](/screenshots/cs/ui-hover.webp){.shot-sm}

**Pravým tlačítkem na plátno** (nebo dlouhým podržením na dotykové obrazovce) otevřete nabídku plátna. Při volbě *Přidat uzel* nebo *Přidat prvek* podržte <kbd>Ctrl</kbd>, chcete-li je umístit myší místo dialogu. Nad prvkem nabídka nabízí také *Okótovat prvek*.

![Nabídka plátna](/screenshots/cs/ui-canvas-menu.webp){.shot-sm}

Všechny zkratky jsou na stránce [Klávesnice, myš a dotyk](/cs/reference/shortcuts).

### Když model nelze vypočítat {#when-the-model-cannot-be-solved}

Vlevo nahoře v zobrazení se objeví hlášení:

- *Není definovaný žádný materiál* / *Není definovaný žádný průřez* s tlačítkem **Přidat**.
- Malý modrý štítek **Chybí podpory**, dokud je model jen nedokončený.
- **Červené hlášení**, když je něco špatně, s tlačítkem **Zobrazit podrobnosti**, které vypíše všechny problémy.

Pokud se konstrukce ještě může pohybovat, EduBeam ji rozkývá jako čárkovaný obrys a zakroužkuje uzly nebo klouby, které za to mohou. Najeďte na hlášení myší, chcete-li pohyb vidět znovu, nebo ho skryjte tlačítkem s okem.

![Rám s klouby v B a C je mechanismus: EduBeam ukáže, jak se pohybuje](/screenshots/cs/ui-mechanism.webp)

![Zobrazit podrobnosti vypíše každý problém s radou](/screenshots/cs/ui-diagnostics.webp){.shot-lg}

Každé hlášení vysvětluje kapitola [Řešení problémů](/cs/reference/troubleshooting).

## Spodní lišta {#bottom-bar}

Šest záložek, každá s lištou tlačítek a upravitelnou tabulkou. Záložky ukazují, kolik objektů daného druhu model obsahuje. **?** vpravo vysvětluje otevřenou záložku, stejně jako **?** u některých záhlaví sloupců. Tažením pruhu záložek nahoru nebo dolů změníte výšku lišty, tlačítkem vpravo ji minimalizujete.

| Záložka | Tlačítka | Tabulka |
| --- | --- | --- |
| **Uzly** | Přidat uzel (dialog), Přidat uzel (myš) | Označení, souřadnice, **Podepřené stupně volnosti** (značka podpory, Dx, Dz, Ry, úhel podpory α), zatížení, úprava, smazání |
| **Prvky** | Přidat prvek (dialog), Přidat prvek (myš) | Označení, typ, uzly (s tlačítkem pro prohození), materiál, průřez, **Koncové klouby**, zatížení, matice tuhosti, smazání |
| **Zatížení** | Přidat uzlové zatížení, Přidat prvkové zatížení | Typ, působiště, upravitelné složky, úprava, smazání |
| **Materiály** | Přidat materiál, Knihovna materiálů | Označení, E, G, α<sub>T</sub>, smazání |
| **Průřezy** | Přidat průřez, Knihovna průřezů, Polygonální průřez | Tvar, označení, A, I<sub>y</sub>, h, k, úprava tvaru, smazání |
| **Výsledky** | Výsledky v uzlech, Výsledky na prvcích, Exportovat CSV, Kopírovat | Posunutí a pootočení v každém uzlu, nebo koncové síly každého prvku |

Buňku upravíte přímo: klikněte, napište hodnotu a stiskněte <kbd>Enter</kbd> (nebo <kbd>Esc</kbd> pro opuštění buňky). Hodnoty se zobrazují i zadávají v [aktuálních jednotkách](/cs/essentials/units-settings).

## Záložky nad zobrazením {#tabs-above-the-viewer}

**Konstrukce** ukazuje plátno. **Nastavení** zobrazí nastavení na celou plochu, takže můžete změnit barvy nebo jednotky a přepnout zpět, abyste viděli výsledek. Štítek jednotek a *Všechna nastavení* otevírají totéž nastavení jako dialog nad modelem.

## Plovoucí okna {#floating-windows}

**Matice tuhosti** (z panelu prvku nebo z tabulky Prvky) otevře okno s maticí tuhosti prvku 6 × 6 v globálních souřadnicích. **Upravit** v nabídce plátna otevře tabulku aktuálního výběru. Okna přesouváte tažením za záhlaví a zavřete je křížkem ×.
