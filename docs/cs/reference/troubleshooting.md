# Řešení problémů

## Nevykreslují se výsledky

Výsledky se objeví jen tehdy, když lze model vyřešit. Zkontrolujte v tomto pořadí:

1. **Je v zobrazení červené upozornění?** *Není definovaný žádný materiál* / *Není definovaný žádný průřez* → přidejte je. *Model has N error(s)* → klikněte na **Show details** a opravte každou položku (viz tabulka níže).
2. **Dostatek podpor?** Řešič potřebuje alespoň tři odebrané stupně volnosti *a* konstrukci bez mechanismu. Nosník na dvou posuvných kloubech (Dz + Dz) má jen dva a „ujede“; rám samými klouby bez ztužení může být mechanismus i s mnoha podporami. Přidejte někde `Dx` nebo `Ry` v jedné podpoře.
3. **Jsou prvky připojené?** Dva uzly se stejnými souřadnicemi jsou stále dva samostatné uzly. Přebytečný smažte a prvek připojte znovu, nebo uzly na prvky umisťujte pomocí **Připojit ke konstrukci**.
4. **Klouby všude?** Uzel, jehož všechny prvky jsou kloubové a který nemá podepřené `Ry`, má nedefinované pootočení. Odškrtněte jeden kloub nebo v uzlu odeberte `Ry`.
5. **Nesmyslná čísla** (posunutí v milionech) znamenají, že konstrukce je téměř mechanismus; EduBeam takové výsledky skryje. Hledejte chybějící podporu nebo téměř nulovou tuhost (`E`, `A` nebo `Iy` omylem zadané jako 0 nebo ve špatné jednotce).

## Chybová hlášení

Hlášení z **Show details** (dialog *Cannot solve model*, zatím pouze anglicky):

| Hlášení | Význam / náprava |
| --- | --- |
| *Model needs at least 3 constrained DOFs to be stable in 2D analysis.* | Přidávejte podpory, dokud nejsou celkem odebrány alespoň tři stupně volnosti. |
| *Element X references missing node / material / cross section Y.* | Odkazovaná entita byla smazána (obvykle při ruční úpravě JSON). Přiřaďte ji znovu v tabulce *Prvky*. |
| *Element X must reference exactly 2 nodes.* | Poškozený prvek v importovaném souboru; smažte ho a vytvořte znovu. |
| *Nodal load / Prescribed displacement #n references missing node Y.* | Zatížení smažte nebo přesměrujte. |
| *Element load #n references missing element Y.* | Zatížení smažte. |
| *Solver failed due to an internal model inconsistency…* | Obecné selhání; vraťte poslední krok zpět, nebo soubor uložte a [nahlaste chybu](https://github.com/janvorisek/edubeam/issues). |

Varování (dialog *Model warnings*) výpočet nezastaví: *Element X references the same node at both ends* (prvek nulové délky – smažte ho) a *… contains invalid values* (zatížení s nečíselnou složkou – upravte ho).

## Výsledky vypadají špatně

| Příznak | Pravděpodobná příčina |
| --- | --- |
| Zatížení působí vzhůru | Globální **z míří dolů**, takže kladné `Fz`/`fz` působí dolů. Záporné hodnoty míří vzhůru. Viz [znaménková konvence](/cs/elements/conventions). |
| Průhyb je 1000× větší nebo menší | Záměna jednotek – `E` zadáno v Pa při nastavené jednotce MPa, nebo `Iy` v cm⁴ při jednotce m⁴. Zkontrolujte štítek jednotek vpravo dole v zobrazení. |
| Průhyb je o něco větší než podle učebnicového vzorce | Smyková deformace Timoshenkova nosníku. Zvětšete smykový součinitel průřezu (nebo použijte štíhlý prut) a přiblížíte se hodnotám Eulerova–Bernoulliho nosníku. Viz [Ověření výsledků ručně](/cs/guide/verification). |
| Momentový průběh je na „špatné“ straně | Strana je jen kreslicí konvence; znaménko čtěte z popisků – kladný moment znamená tah v dolních vláknech. |
| Průběhy jsou obrovské / titěrné | Čistě vizuální – upravte **Měřítko výsledků** v *Nastavení → Nastavení zobrazení*. |
| Zatížení v lokálních souřadnicích míří opačně | Lokální osa x prvku vede od *počátečního* ke *koncovému* uzlu. Použijte **Přehodit pořadí uzlů** nebo otočte znaménko. |
| Změna teploty nic nedělá | Staticky určité konstrukce se teplotou volně přetvářejí bez vnitřních sil. Ověřte, že α ≠ 0 a pro nerovnoměrné oteplení je zadaná výška průřezu h. |

## Potíže s rozhraním

| Příznak | Náprava |
| --- | --- |
| Zkratky nefungují | Nejprve klikněte na plátno – klávesy se ignorují, dokud má fokus textové pole. |
| Nelze posouvat plátno | Posun používá ve výchozím stavu prostřední/pravé tlačítko myši; změňte v *Nastavení → Ovládání & zkratky*. Na touchpadu použijte dva prsty nebo přepněte na *Pravé tlačítko*. |
| Model zmizel po aktualizaci | Aktualizace, která maže úložiště, se nejprve ohlásí dialogem; zrušte ji a projekt před aktualizací uložte. |
| Špatný jazyk | *Nastavení → Jazyk a prostředí*, nebo přidejte `?lang=cs` k adrese. |
| Změny nastavení se neukládají | Místní úložiště je blokované (anonymní okno, přísný režim soukromí). Nastavení i automatické ukládání ho potřebují. |

## Nahlášení chyby

Založte [issue na GitHubu](https://github.com/janvorisek/edubeam/issues) s uvedením prohlížeče a OS, co jste očekávali, a – nejužitečnější ze všeho – **sdíleným odkazem** nebo **souborem JSON**, který problém reprodukuje.
