# Řešení problémů

## Nevykreslují se žádné výsledky {#no-results-are-drawn}

Výsledky se zobrazí, jen když lze model vyřešit. Zkontrolujte v tomto pořadí:

1. **Přečtěte si hlášení vlevo nahoře v zobrazení.**
   - *Není definovaný žádný materiál* / *Není definovaný žádný průřez*: přidejte ho tlačítkem **Přidat**.
   - Modrý štítek **Chybí podpory**: model je jen nedokončený. Přidejte podpory. Najeďte na štítek myší a čárkovaný obrys vám ukáže, jak se konstrukce ještě může pohybovat.
   - **Červené hlášení**: něco je špatně. Pojmenuje problém, nebo zní *Chyby v modelu: N*, je-li jich více. Klikněte na **Zobrazit podrobnosti** a opravte jednotlivé položky (viz tabulka níže). Dotčené uzly nebo klouby jsou na plátně zakroužkované.
   - **Žluté hlášení**: varování. Model byl přesto vypočten; varování můžete skrýt.
2. **Je dost podpor?** Řešič potřebuje alespoň tři podepřené stupně volnosti a podpory musí konstrukci udržet. Nosník na dvou posuvných kloubech (Dz + Dz) má jen dva a ujede. Přidejte někde `Dx`, nebo `Ry` v jedné podpoře.
3. **Jsou prvky propojené?** Dva uzly se stejnými souřadnicemi jsou pořád dva samostatné uzly. Přebytečný smažte a prvky znovu připojte, nebo uzly na prvky umisťujte pomocí **Připojit ke konstrukci**.
4. **Příliš mnoho kloubů?** Klouby na obou koncích sloupu nebo čtverec z kloubově spojených prutů bez diagonály vytvoří mechanismus. EduBeam klouby zakroužkuje a ukáže pohyb.
5. **Nulová tuhost?** `E`, `A` nebo `Iy` omylem zadané jako 0, nebo ve špatné jednotce, způsobí, že se část konstrukce pohybuje téměř bez odporu. EduBeam to hlásí jako *nestabilní*.

![Zobrazit podrobnosti vypíše každý problém s radou a umí ukázat pohyb](/screenshots/cs/ui-diagnostics.webp){.shot-lg}

## Hlášení {#messages}

**Zobrazit podrobnosti** otevře dialog s nadpisem *Model nelze vypočítat* (chyby), *Model zatím nelze vypočítat* (stále chybí podpory) nebo *Varování k modelu*. Jeho odkaz **Řešení potíží** vede sem.

### Zbývá doplnit {#still-needed}

| Hlášení | Význam / oprava |
| --- | --- |
| *Konstrukce potřebuje podpory, jinak ji nelze vypočítat.* | Celkem méně než tři podepřené stupně volnosti. Přidejte podpory. |
| *Samostatná část konstrukce (uzly …) má méně než 3 podepřené stupně volnosti a může se volně pohybovat.* | Model je rozdělený na části a jedna z nich volně plave. Připojte ji, nebo ji podepřete. |

### Chyby {#errors}

| Hlášení | Význam / oprava |
| --- | --- |
| *Konstrukce má dostatek podpor, ale ty ji nezajišťují: stále se může …* | Podpory jsou všechny rovnoběžné, nebo se jejich nositelky protínají v jednom bodě. Čárkovaný obrys ukazuje pohyb; změňte směr jedné podpory. Pokud se problém týká jen jedné části, stejné hlášení uvádí *samostatnou část*. |
| *Podpory konstrukci drží, ale přesto je to mechanismus: její pruty se mohou otáčet kolem kloubů v uzlu …* | Klouby umožňují vzájemné natočení prutů, jako u rámu s klouby na hlavách obou sloupů nebo u kloubově spojeného čtverce bez diagonály. Odstraňte kloub, nebo přidejte prut či podporu. |
| *Konstrukce je nestabilní – tyto pohyby nemají prakticky žádný odpor: …* | Téměř mechanismus, nebo tuhost blízká nule. Zkontrolujte podpory, klouby a hodnoty `E`, `A` a `Iy`. |
| *Konstrukce je mechanismus: matice tuhosti je singulární.* | Něco se může volně pohybovat a předchozí kontroly to nezachytily. Ověřte, že každá část je zajištěna alespoň třemi vazbami a že klouby nenechávají žádný prut volně otočný. |
| *Prvek … odkazuje na neexistující uzel / materiál / průřez …* | Odkazovaný objekt byl smazán, obvykle v ručně upraveném souboru JSON. Přiřaďte ho znovu v tabulce *Prvky*. |
| *Prvek … musí odkazovat právě na 2 uzly.* | Poškozený prvek v importovaném souboru. Smažte ho a vytvořte znovu. |
| *Uzlové zatížení / Předepsané posunutí č. n odkazuje na neexistující uzel …* | Zatížení smažte, nebo mu přiřaďte uzel. |
| *Prvkové zatížení č. n odkazuje na neexistující prvek …* | Zatížení smažte. |
| *Výpočet selhal kvůli vnitřní nekonzistenci modelu…* | Obecné selhání. Vraťte poslední krok, nebo soubor uložte a [nahlaste chybu](https://github.com/janvorisek/edubeam/issues). |

### Varování {#warnings}

Model je přesto vypočten, ale zkontrolujte tato hlášení:

| Hlášení | Význam / oprava |
| --- | --- |
| *Uzel … není připojen k žádnému prvku a výpočet jej ignoruje.* | Osamocený uzel. Smažte ho, nebo ho připojte. |
| *Uzel … je podepřen, ale nepřipojuje se k němu žádný prvek, takže podpora nic nepřenáší.* | Podpora na osamoceném uzlu. |
| *Prvek … má na obou koncích stejný uzel.* | Prvek nulové délky. Smažte ho. |
| *Uzlové zatížení / Předepsané posunutí č. n obsahuje neplatné hodnoty.* | Složka, která není číslem. Upravte zatížení. |

## Výsledky vypadají špatně {#results-look-wrong}

| Příznak | Pravděpodobná příčina |
| --- | --- |
| Zatížení působí nahoru | Globální **z míří dolů**, takže kladné `Fz`/`fz` působí dolů. Záporné hodnoty míří nahoru. Viz [konvence](/cs/elements/conventions). S osami y nahoru je to naopak. |
| Průhyb je 1000× větší nebo menší | Záměna jednotek: `E` zadané v Pa, zatímco jednotkou je MPa, nebo `Iy` v cm⁴, zatímco jednotkou je m⁴. Zkontrolujte štítek jednotek vpravo dole v zobrazení. |
| Průhyb je o něco větší než podle učebnicového vzorce | Smyková deformace Timoshenkova nosníku. Chcete-li se přiblížit hodnotám podle Eulera–Bernoulliho, zvyšte smykový součinitel průřezu, nebo použijte štíhlý prut. Viz [Ověření výsledků ručně](/cs/guide/verification). |
| Znaménko vypadá „špatně“ | Znaménko čtěte z popisků, ne podle strany průběhu. Kladný M znamená tah dole. Koncové síly ve *Výsledcích na prvcích* sledují lokální osy prvku, nikoli konvenci N-V-M. |
| Dva stejné sloupy mají opačná znaménka posouvající síly | Znaménko V sleduje směr každého prvku. Pro porovnání u jednoho z nich prohoďte uzly. |
| Čísla jako `4 · 10¹` | Vědecký formát čísel. Zvolte *Automatický* v *Nastavení → Jazyk a prostředí → Formát čísel*. |
| Průběhy jsou obrovské nebo maličké | Čistě vizuální záležitost. Upravte **Měřítko výsledků** v *Nastavení → Nastavení zobrazení*. |
| Zatížení v lokálních souřadnicích míří špatným směrem | Lokální osa x prvku vede od jeho *počátečního* ke *koncovému* uzlu. Prohoďte uzly, nebo obraťte znaménko. |
| Zatížení šikmého prutu nesedí | **LCS** je ve výchozím stavu zaškrtnuté, takže `fz` působí kolmo na prut. Pro svislé zatížení ho odškrtněte. |
| Teplotní zatížení nic nedělá | Staticky určitá konstrukce se při změně teploty volně deformuje, bez vnitřních sil. Ověřte, že α ≠ 0 a u nerovnoměrného oteplení, že je zadaná výška průřezu h. |

## Problémy s rozhraním {#interface-issues}

| Příznak | Řešení |
| --- | --- |
| Zkratky nic nedělají | Nejprve klikněte na plátno: klávesy se ignorují, dokud má fokus textové pole. |
| Nelze posouvat zobrazení | Posun ve výchozím stavu používá prostřední nebo pravé tlačítko myši; změníte to v *Nastavení → Ovládání & zkratky*. Na touchpadu posouvání dvěma prsty přibližuje; pro posun klikněte a táhněte dvěma prsty. |
| Můj model zmizel | Otevření odkazu, souboru nebo příkladu i smazání konstrukce starý model uchovají: **☰ → Nedávné konstrukce**, nebo <kbd>Ctrl</kbd>+<kbd>Z</kbd>. |
| Špatný jazyk | *Nastavení → Jazyk a prostředí*, nebo přidejte `?lang=cs` do adresy. |
| Změny nastavení se neuchovají | Místní úložiště je blokované (anonymní okno, přísný režim ochrany soukromí). Nastavení, automatické ukládání i Nedávné konstrukce ho potřebují. |

## Nahlášení chyby {#reporting-a-bug}

Založte [issue na GitHubu](https://github.com/janvorisek/edubeam/issues) s uvedením prohlížeče a operačního systému, toho, co jste očekávali, a hlavně se **sdíleným odkazem** nebo **souborem projektu**, který problém reprodukuje.
