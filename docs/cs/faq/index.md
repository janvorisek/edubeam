# Často kladené otázky

## Obecné {#general}

### Co je EduBeam? {#what-is-edubeam}

Bezplatný open-source řešič rovinných nosníků, rámů a příhradových konstrukcí běžící v prohlížeči, určený studentům, vyučujícím a inženýrům, kteří chtějí okamžitou zpětnou vazbu. Viz [Úvod](/cs/guide/introduction).

### Je opravdu zdarma? Potřebuji účet? {#is-it-really-free-do-i-need-an-account}

Ano a ne. Otevřete [run.edubeam.app](https://run.edubeam.app/?lang=cs) a začněte modelovat. Žádné účty, žádné instalátory a žádné limity použití. Zdrojový kód je na [GitHubu](https://github.com/janvorisek/edubeam).

### Které prohlížeče a zařízení fungují? {#which-browsers-and-devices-work}

Jakýkoli aktuální Chrome, Edge, Firefox nebo Safari. Tablety a telefony fungují: klepnutím vybíráte nebo umisťujete, tažením uzlu ho přesouváte, tažením jinde posouváte zobrazení, roztažením prstů přibližujete a dlouhým podržením otevřete nabídku plátna. S myší a klávesnicí je ale modelování stále rychlejší. Viz [Klávesnice, myš a dotyk](/cs/reference/shortcuts#touch).

### Ztratil jsem model. Můžu ho získat zpět? {#i-lost-my-model-can-i-get-it-back}

Pravděpodobně ano. Smazání modelu nebo otevření odkazu, souboru či příkladu přes něj uchová ten starý v **☰ → Nedávné konstrukce** (posledních 10) a <kbd>Ctrl</kbd>+<kbd>Z</kbd> nahrazení vrátí. Obojí existuje jen ve vašem prohlížeči.

### Můžu ho používat offline? {#can-i-use-it-offline}

EduBeam je progresivní webová aplikace: jakmile se jednou načte, funguje i bez připojení a prohlížeč může nabídnout její instalaci. Když je k dispozici nová verze, dialog se před aktualizací zeptá.

### Kde jsou uložena moje data? {#where-is-my-data-stored}

Jen ve vašem prohlížeči. Modely se nikdy neposílají na server; sdílený odkaz *je* samotný model. Viz [Import, export a sdílení](/cs/essentials/import-export).

## Modelování {#modelling}

### Jak vytvořím vetknutí / kloubovou / posuvnou podporu? {#how-do-i-make-a-fixed-pinned-roller-support}

Klikněte na uzel, otevřete **Podepření uzlu** a vyberte značku: kloub, posuvný kloub, vetknutí, posuvné vetknutí a další. Nebo zaškrtněte stupně volnosti: **Dx + Dz + Ry** = vetknutí, **Dx + Dz** = kloub, **Dz** = posuvný kloub. Všechny kombinace jsou uvedeny v kapitole [Uzly a podpory](/cs/essentials/nodes-supports#supports).

### Jak vytvořím příhradovou konstrukci? {#how-do-i-make-a-truss}

Použijte nosníkové prvky a v záložce *Prvky* u každého prutu zaškrtněte **oba Koncové klouby**, nebo před kreslením prutů myší zaškrtněte v liště *Kloub na začátku* a *Kloub na konci*. Zatížení zadávejte ve styčnících. Jednou takovou konstrukcí vás provede [návod pro příhradovou konstrukci](/cs/tutorials/truss).

### Jak vložím kloub do rámu? {#how-do-i-put-a-hinge-in-a-frame}

Zaškrtněte **Kloub na konci** u toho prvku na straně styčníku, kde má být moment uvolněn. Kloub u *jednoho* prvku ve styčníku uvolní jen tento prvek.

### Jak přidám podporu nebo osamělou sílu doprostřed nosníku? {#how-do-i-add-a-support-or-a-point-load-in-the-middle-of-a-beam}

Přidejte na nosník uzel pomocí *Přidat myší* a zvolte **Připojit ke konstrukci** – nosník se rozdělí na dva. Pro samotnou osamělou sílu uzel ani nepotřebujete: použijte prvkové zatížení **Osamělá síla** s polohou.

### Můžu zadat vlastní tíhu? {#can-i-apply-self-weight}

Ne automaticky. Zadejte ji jako spojité rovnoměrné zatížení $f_z = \rho g A$.

### Můžu modelovat šikmé podpory? {#can-i-model-inclined-supports}

Ano – nastavte v uzlu **Pootočení systému souřadnic**; jeho stupně volnosti se pak vykládají v pootočeném systému.

### Existují zatěžovací stavy nebo kombinace? {#are-there-load-cases-or-combinations}

Ne, jen jeden zatěžovací stav. Každý stav modelujte zvlášť a uložte nebo sdílejte.

### Proč moje zatížení míří nahoru? {#why-do-my-loads-point-up}

Protože globální z míří **dolů**: kladné `Fz` působí dolů. Viz [konvence](/cs/elements/conventions). Pokud dáváte přednost svislé ose mířící nahoru, přepněte na osy s y nahoru v *Nastavení → Jazyk a prostředí → Souřadnicový systém*.

## Výsledky {#results}

### Proč neexistuje tlačítko „Spočítat“? {#why-is-there-no-solve-button}

Model se automaticky vyřeší po každé změně. Pokud se výsledky neobjeví, model zatím není řešitelný – co zkontrolovat, uvádí kapitola [Řešení problémů](/cs/reference/troubleshooting).

### Proč se můj průhyb nepatrně liší od vzorce? {#why-does-my-deflection-differ-slightly-from-the-formula}

EduBeam používá Timoshenkovy nosníky, takže průhyby zahrnují smykovou deformaci. U štíhlých prutů je rozdíl hluboko pod 1 %. Podrobnosti a řešená porovnání najdete v kapitole [Ověření výsledků ručně](/cs/guide/verification).

### Jak přesné jsou výsledky? Potřebuji víc prvků? {#how-accurate-are-the-results-do-i-need-more-elements}

Pro lineární statický výpočet je nosníkový prvek při podporovaných typech zatížení přesný, takže stačí jeden prvek na prut. Další uzly potřebujete jen tam, kde chcete podporu, kloub, změnu průřezu nebo uzel pro připojení zatížení.

### Kde najdu reakce? {#where-are-the-reactions-listed}

V zobrazení jako šipky s hodnotami (**Reakce** v možnostech zobrazení, ve výchozím stavu zapnuté). Jsou také v souboru z **Výsledky → Exportovat CSV** a v **Kopírovat**. Posunutí uzlů a koncové síly prvků jsou v záložce **Výsledky**.

## Soubory a sdílení {#files-sharing}

### Jak sdílím model? {#how-do-i-share-a-model}

**Sdílet konstrukci** → **Kopírovat**. Odkaz obsahuje celý model. Příjemci dostanou vlastní upravitelnou kopii; živá spolupráce neexistuje. Viz také [Výuka s EduBeam](/cs/guide/teaching).

### Můžu model vložit na svůj web nebo do prezentace? {#can-i-embed-a-model-on-my-website-or-in-slides}

Ano: přidejte ke sdílenému odkazu `&viewer=1` a vložte ho do `<iframe>`. Viz [Vložení prohlížeče](/cs/essentials/import-export#embed-a-read-only-viewer).

### Můžu exportovat obrázky nebo tabulky? {#can-i-export-images-or-tables}

Ano. **☰ → Exportovat obrázek** (<kbd>Ctrl</kbd>+<kbd>P</kbd>) uloží výkres jako PNG nebo SVG ve zvolené velikosti nebo měřítku. **Výsledky → Exportovat CSV** uloží obě tabulky výsledků a **Kopírovat** je vloží do schránky pro tabulkový procesor. Viz [Import, export a sdílení](/cs/essentials/import-export#export-an-image).

### Můžu modely generovat programově? {#can-i-generate-models-programmatically}

Ano. Soubor projektu je obyčejný JSON v jednotkách SI – viz [popis formátu](/cs/essentials/import-export#project-file-format) – a lze ho otevřít pomocí *Otevřít projekt* nebo přetažením.

## Podpora {#support}

### Jak nahlásím chybu nebo navrhnu novou funkci? {#how-do-i-report-a-bug-or-request-a-feature}

Založte issue na [GitHubu](https://github.com/janvorisek/edubeam/issues) a přiložte sdílený odkaz nebo soubor projektu, který problém reprodukuje. Soukromá podpora: [support@edubeam.app](mailto:support@edubeam.app).
