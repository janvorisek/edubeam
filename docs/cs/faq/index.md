# Často kladené otázky

## Obecné {#general}

### Co je EduBeam? {#what-is-edubeam}

Bezplatný open-source program pro výpočet rovinných nosníků, rámů a příhradových konstrukcí, který běží v prohlížeči. Je určený studentům, vyučujícím a inženýrům, kteří chtějí okamžitou zpětnou vazbu. Viz [Úvod](/cs/guide/introduction).

### Je opravdu zdarma? Potřebuji účet? {#is-it-really-free-do-i-need-an-account}

Ano a ne. Otevřete [run.edubeam.app](https://run.edubeam.app/?lang=cs) a rovnou modelujte. Žádný účet, žádná instalace a žádné limity. Zdrojový kód je na [GitHubu](https://github.com/janvorisek/edubeam).

### V jakých prohlížečích a zařízeních EduBeam funguje? {#which-browsers-and-devices-work}

V každém aktuálním prohlížeči Chrome, Edge, Firefox nebo Safari. Funguje i na tabletech a telefonech: klepnutím vybíráte nebo umisťujete, tažením uzlu ho přesouváte, tažením jinde posouváte zobrazení, roztažením prstů přibližujete a dlouhým podržením otevřete nabídku plátna. Myší a klávesnicí se ale modeluje rychleji. Viz [Klávesnice, myš a dotyk](/cs/reference/shortcuts#touch).

### Ztratil jsem model. Dá se obnovit? {#i-lost-my-model-can-i-get-it-back}

Nejspíš ano. Když model smažete nebo ho nahradíte otevřením odkazu, souboru či příkladu, původní model se uloží do **☰ → Nedávné konstrukce** (posledních 10) a nahrazení vrátíte i zkratkou <kbd>Ctrl</kbd>+<kbd>Z</kbd>. Obojí funguje jen ve vašem prohlížeči.

### Funguje EduBeam i offline? {#can-i-use-it-offline}

Ano. EduBeam je progresivní webová aplikace: po prvním načtení funguje i bez připojení a prohlížeč může nabídnout její instalaci. Když vyjde nová verze, aplikace se vás před aktualizací zeptá.

### Kde jsou moje data uložená? {#where-is-my-data-stored}

Jen ve vašem prohlížeči. Modely se nikdy neposílají na server; sdílený odkaz *je* samotný model. Viz [Import, export a sdílení](/cs/essentials/import-export).

## Modelování {#modelling}

### Jak zadám vetknutí, pevný kloub nebo posuvný kloub? {#how-do-i-make-a-fixed-pinned-roller-support}

Klikněte na uzel, otevřete **Podepření uzlu** a vyberte značku: kloub, posuvný kloub, vetknutí, posuvné vetknutí a další. Druhou možností je zaškrtnout stupně volnosti: **Dx + Dz + Ry** = vetknutí, **Dx + Dz** = kloub, **Dz** = posuvný kloub. Všechny kombinace najdete v kapitole [Uzly a podpory](/cs/essentials/nodes-supports#supports).

### Jak vytvořím příhradovou konstrukci? {#how-do-i-make-a-truss}

Použijte nosníkové prvky a v záložce *Prvky* zaškrtněte u každého prutu **oba Koncové klouby**. Při kreslení myší stačí předem zaškrtnout v liště *Kloub na začátku* a *Kloub na konci*. Zatížení zadávejte do styčníků. Celým postupem vás provede [návod pro příhradovou konstrukci](/cs/tutorials/truss).

### Jak vložím do rámu kloub? {#how-do-i-put-a-hinge-in-a-frame}

U prvku, který leží na té straně styčníku, kde chcete uvolnit moment, zaškrtněte **Kloub na konci**. Kloub u *jednoho* prvku ve styčníku uvolní jen tento prvek.

### Jak přidám podporu nebo osamělou sílu doprostřed nosníku? {#how-do-i-add-a-support-or-a-point-load-in-the-middle-of-a-beam}

Přidejte na nosník uzel pomocí *Přidat myší* a zvolte **Připojit ke konstrukci** – nosník se rozdělí na dva. Na samotnou osamělou sílu ale uzel nepotřebujete: použijte prvkové zatížení **Osamělá síla** a zadejte jeho polohu.

### Lze zadat vlastní tíhu? {#can-i-apply-self-weight}

Automaticky ne. Zadejte ji jako spojité rovnoměrné zatížení $f_z = \rho g A$.

### Lze modelovat šikmé podpory? {#can-i-model-inclined-supports}

Ano – nastavte u uzlu **Pootočení systému souřadnic**; jeho stupně volnosti se pak vztahují k pootočenému systému.

### Jsou k dispozici zatěžovací stavy nebo kombinace? {#are-there-load-cases-or-combinations}

Ne, model má jen jeden zatěžovací stav. Každý stav namodelujte zvlášť a uložte nebo sdílejte.

### Proč moje zatížení míří nahoru? {#why-do-my-loads-point-up}

Protože globální osa z míří **dolů**: kladné `Fz` působí dolů. Viz [konvence](/cs/elements/conventions). Pokud chcete svislou osu mířící nahoru, přepněte v *Nastavení → Jazyk a prostředí → Souřadnicový systém* na osy s y nahoru.

## Výsledky {#results}

### Proč chybí tlačítko „Spočítat“? {#why-is-there-no-solve-button}

Model se vyřeší automaticky po každé změně. Pokud se výsledky neobjeví, model zatím nejde vyřešit – co zkontrolovat, najdete v kapitole [Řešení problémů](/cs/reference/troubleshooting).

### Proč se můj průhyb mírně liší od vzorce? {#why-does-my-deflection-differ-slightly-from-the-formula}

EduBeam používá Timoshenkovy nosníky, takže průhyby zahrnují i smykovou deformaci. U štíhlých prutů je rozdíl hluboko pod 1 %. Podrobnosti a řešená porovnání najdete v kapitole [Ověření výsledků ručně](/cs/guide/verification).

### Jak přesné jsou výsledky? Potřebuji víc prvků? {#how-accurate-are-the-results-do-i-need-more-elements}

Při lineárním statickém výpočtu je nosníkový prvek pro všechny podporované typy zatížení přesný, takže na každý prut stačí jeden prvek. Další uzly potřebujete jen tam, kde chcete podporu, kloub, změnu průřezu nebo uzel, ke kterému připojíte zatížení.

### Kde najdu reakce? {#where-are-the-reactions-listed}

V zobrazení jako šipky s hodnotami (volba **Reakce** v možnostech zobrazení, ve výchozím stavu zapnutá). Najdete je také v souboru z **Výsledky → Exportovat CSV** a ve schránce po **Kopírovat**. Posunutí uzlů a koncové síly prvků jsou v záložce **Výsledky**.

## Soubory a sdílení {#files-sharing}

### Jak model nasdílím? {#how-do-i-share-a-model}

**Sdílet konstrukci** → **Kopírovat**. Odkaz obsahuje celý model. Každý příjemce dostane vlastní kopii, kterou může upravovat; společná práce v reálném čase možná není. Viz také [Výuka s EduBeamem](/cs/guide/teaching).

### Můžu model vložit na svůj web nebo do prezentace? {#can-i-embed-a-model-on-my-website-or-in-slides}

Ano: přidejte ke sdílenému odkazu `&viewer=1` a vložte ho do `<iframe>`. Viz [Vložení prohlížeče](/cs/essentials/import-export#embed-a-read-only-viewer).

### Můžu exportovat obrázky nebo tabulky? {#can-i-export-images-or-tables}

Ano. **☰ → Exportovat obrázek** (<kbd>Ctrl</kbd>+<kbd>P</kbd>) uloží výkres do PNG nebo SVG ve zvolené velikosti či měřítku. **Výsledky → Exportovat CSV** uloží obě tabulky výsledků a **Kopírovat** je zkopíruje do schránky, odkud je vložíte do tabulkového procesoru. Viz [Import, export a sdílení](/cs/essentials/import-export#export-an-image).

### Můžu modely generovat programově? {#can-i-generate-models-programmatically}

Ano. Soubor projektu je obyčejný JSON v jednotkách SI (viz [popis formátu](/cs/essentials/import-export#project-file-format)) a otevřete ho přes *Otevřít projekt* nebo přetažením.

## Podpora {#support}

### Jak nahlásím chybu nebo navrhnu novou funkci? {#how-do-i-report-a-bug-or-request-a-feature}

Založte issue na [GitHubu](https://github.com/janvorisek/edubeam/issues) a přiložte sdílený odkaz nebo soubor projektu, na kterém se problém projeví. Soukromá podpora: [support@edubeam.app](mailto:support@edubeam.app).
