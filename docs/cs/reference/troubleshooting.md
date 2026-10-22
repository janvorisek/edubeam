# Řešení problémů

## Nevykreslují se žádné výsledky {#no-results-are-drawn}

Výsledky se zobrazí, jen když lze model vyřešit. Postupujte v tomto pořadí:

1. **Přečtěte si hlášení vlevo nahoře v zobrazení.**
   - *Není definovaný žádný materiál* / *Není definovaný žádný průřez*: přidejte ho tlačítkem **Přidat**.
   - Modrý štítek **Chybí podpory**: model jen ještě není hotový. Přidejte podpory. Když na štítek najedete myší, čárkovaný obrys ukáže, jak se konstrukce ještě může pohybovat.
   - **Červené hlášení**: v modelu je chyba. Hlášení ji pojmenuje, a když je chyb víc, zní *Chyby v modelu: N*. Klikněte na **Zobrazit podrobnosti** a opravte jednotlivé položky (viz tabulka níže). Dotčené uzly nebo klouby jsou na plátně zakroužkované.
   - **Žluté hlášení**: varování. Model se přesto vypočítal; varování můžete skrýt.
2. **Je podpor dost?** Řešič potřebuje alespoň tři podepřené stupně volnosti a podpory musí konstrukci skutečně zajistit. Nosník na dvou posuvných kloubových podporách (Dz + Dz) má jen dva a vodorovně ujede. Přidejte někde `Dx`, nebo v jedné podpoře `Ry`.
3. **Jsou prvky propojené?** Dva uzly se stejnými souřadnicemi jsou stále dva samostatné uzly. Přebytečný uzel smažte a prvky připojte znovu, nebo uzly na prvky umisťujte volbou **Připojit ke konstrukci**.
4. **Není kloubů příliš mnoho?** Klouby na obou koncích sloupu nebo čtverec z kloubově spojených prutů bez diagonály tvoří mechanismus. EduBeam takové klouby zakroužkuje a ukáže možný pohyb.
5. **Není někde nulová tuhost?** Když omylem zadáte `E`, `A` nebo `Iy` jako 0 nebo ve špatné jednotce, část konstrukce se pohybuje téměř bez odporu. EduBeam ji pak označí jako *nestabilní*.

![Zobrazit podrobnosti vypíše každý problém i s radou a umí ukázat pohyb](/screenshots/cs/ui-diagnostics.webp){.shot-lg}

## Hlášení {#messages}

**Zobrazit podrobnosti** otevře dialog nadepsaný *Model nelze vypočítat* (chyby), *Model zatím nelze vypočítat* (stále chybí podpory) nebo *Varování k modelu*. Odkaz **Řešení potíží** v něm vede na tuto stránku.

### Zbývá doplnit {#still-needed}

| Hlášení | Význam / oprava |
| --- | --- |
| *Konstrukce potřebuje podpory, jinak ji nelze vypočítat.* | Celá konstrukce má méně než tři podepřené stupně volnosti. Přidejte podpory. |
| *Samostatná část konstrukce (uzly …) má méně než 3 podepřené stupně volnosti a může se volně pohybovat.* | Model se rozpadá na části a jedna z nich není ničím držena. Připojte ji, nebo ji podepřete. |

### Chyby {#errors}

| Hlášení | Význam / oprava |
| --- | --- |
| *Konstrukce má dostatek podpor, ale ty ji nezajišťují: stále se může …* | Všechny podpory jsou rovnoběžné, nebo se jejich nositelky protínají v jednom bodě. Čárkovaný obrys ukazuje pohyb; změňte směr jedné podpory. Pokud se problém týká jen jedné části, hlášení místo konstrukce uvádí *samostatnou část*. |
| *Podpory konstrukci drží, ale přesto je to mechanismus: její pruty se mohou otáčet kolem kloubů v uzlu …* | Klouby dovolují prutům vzájemné pootočení – třeba u rámu s klouby na hlavách obou sloupů nebo u kloubově spojeného čtverce bez diagonály. Odstraňte kloub, nebo přidejte prut či podporu. |
| *Konstrukce je nestabilní – tyto pohyby nemají prakticky žádný odpor: …* | Téměř mechanismus, nebo tuhost blízká nule. Zkontrolujte podpory, klouby a hodnoty `E`, `A` a `Iy`. |
| *Konstrukce je mechanismus: matice tuhosti je singulární.* | Některá část se může volně pohybovat a předchozí kontroly to nezachytily. Ověřte, že je každá část zajištěna alespoň třemi vazbami a že se žádný prut nemůže kvůli kloubům volně otáčet. |
| *Prvek … odkazuje na neexistující uzel / materiál / průřez …* | Odkazovaný objekt už neexistuje, obvykle kvůli ruční úpravě souboru JSON. V tabulce *Prvky* prvku znovu přiřaďte existující uzel, materiál nebo průřez. |
| *Prvek … musí odkazovat právě na 2 uzly.* | Poškozený prvek v importovaném souboru. Smažte ho a vytvořte znovu. |
| *Uzlové zatížení / Předepsané posunutí č. n odkazuje na neexistující uzel …* | Zatížení smažte, nebo mu přiřaďte uzel. |
| *Prvkové zatížení č. n odkazuje na neexistující prvek …* | Zatížení smažte. |
| *Výpočet selhal kvůli vnitřní nekonzistenci modelu…* | Obecná chyba. Vraťte poslední krok, nebo uložte soubor a [nahlaste chybu](https://github.com/janvorisek/edubeam/issues). |

### Varování {#warnings}

Model se přesto vypočítá, tato hlášení ale stojí za kontrolu:

| Hlášení | Význam / oprava |
| --- | --- |
| *Uzel … není připojen k žádnému prvku a výpočet jej ignoruje.* | Osamocený uzel. Smažte ho, nebo ho připojte. |
| *Uzel … je podepřen, ale nepřipojuje se k němu žádný prvek, takže podpora nic nepřenáší.* | Podpora je na osamoceném uzlu. |
| *Prvek … má na obou koncích stejný uzel.* | Prvek nulové délky. Smažte ho. |
| *Uzlové zatížení / Předepsané posunutí č. n obsahuje neplatné hodnoty.* | Některá složka není číslo. Upravte zatížení. |

## Výsledky vypadají špatně {#results-look-wrong}

| Příznak | Pravděpodobná příčina |
| --- | --- |
| Zatížení působí nahoru | Globální osa **z míří dolů**, takže kladné `Fz`/`fz` působí dolů a záporné hodnoty nahoru. Viz [konvence](/cs/elements/conventions). S osami y nahoru je to naopak. |
| Průhyb je 1000× větší nebo menší | Záměna jednotek: `E` zadané v Pa, ačkoli je nastavená jednotka MPa, nebo `Iy` v cm⁴ místo m⁴. Zkontrolujte štítek jednotek vpravo dole v zobrazení. |
| Průhyb je o něco větší než podle učebnicového vzorce | Timoshenkův nosník zahrnuje smykovou deformaci. Pokud se chcete přiblížit hodnotám podle Eulera–Bernoulliho, zvyšte smykový součinitel průřezu, nebo použijte štíhlý prut. Viz [Ověření výsledků ručně](/cs/guide/verification). |
| Znaménko vypadá „špatně“ | Znaménko čtěte z popisků, ne podle strany, na které je průběh vykreslen. Kladný moment M znamená tah dole. Koncové síly ve *Výsledcích na prvcích* se řídí lokálními osami prvku, nikoli konvencí N-V-M. |
| Dva stejné sloupy mají opačná znaménka posouvající síly | Znaménko V závisí na orientaci prvku. Pokud je chcete porovnat, u jednoho z nich prohoďte uzly. |
| Čísla jako `4 · 10¹` | Vědecký formát čísel. Zvolte *Automatický* v *Nastavení → Jazyk a prostředí → Formát čísel*. |
| Průběhy jsou obrovské nebo maličké | Jde jen o vzhled. Upravte **Měřítko výsledků** v *Nastavení → Nastavení zobrazení*. |
| Zatížení v lokálních souřadnicích míří špatným směrem | Lokální osa x vede od *počátečního* ke *koncovému* uzlu prvku. Prohoďte uzly, nebo obraťte znaménko. |
| Zatížení šikmého prutu nesedí | **LCS** je ve výchozím stavu zaškrtnuté, takže `fz` působí kolmo k prutu. Pokud chcete svislé zatížení, zaškrtnutí zrušte. |
| Teplotní zatížení nic nedělá | Staticky určitá konstrukce se při změně teploty volně deformuje a vnitřní síly v ní nevznikají. Ověřte, že α ≠ 0, a u nerovnoměrného oteplení také, že je zadaná výška průřezu h. |

## Problémy s rozhraním {#interface-issues}

| Příznak | Řešení |
| --- | --- |
| Zkratky nic nedělají | Nejprve klikněte na plátno: dokud má fokus textové pole, aplikace klávesy ignoruje. |
| Zobrazení nejde posunout | Ve výchozím stavu se posouvá prostředním nebo pravým tlačítkem myši; změníte to v *Nastavení → Ovládání & zkratky*. Na touchpadu se posouváním dvěma prsty přibližuje; posunete kliknutím a tažením dvěma prsty. |
| Můj model zmizel | Když otevřete odkaz, soubor nebo příklad nebo konstrukci smažete, starý model se uchová: **☰ → Nedávné konstrukce**, nebo <kbd>Ctrl</kbd>+<kbd>Z</kbd>. |
| Špatný jazyk | *Nastavení → Jazyk a prostředí*, nebo přidejte `?lang=cs` do adresy. |
| Změny nastavení se neuchovají | Místní úložiště je blokované (anonymní okno, přísný režim ochrany soukromí). Bez něj nefunguje nastavení, automatické ukládání ani Nedávné konstrukce. |

## Nahlášení chyby {#reporting-a-bug}

Založte [issue na GitHubu](https://github.com/janvorisek/edubeam/issues). Uveďte prohlížeč a operační systém, co jste očekávali, a hlavně přiložte **sdílený odkaz** nebo **soubor projektu**, na kterém se problém projeví.
