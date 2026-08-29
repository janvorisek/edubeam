# Často kladené otázky

## Obecné

### Co je EduBeam?

Bezplatný open-source řešič rovinných nosníků, rámů a příhradových konstrukcí běžící v prohlížeči, určený studentům, vyučujícím a inženýrům, kteří chtějí okamžitou zpětnou vazbu. Viz [Úvod](/cs/guide/introduction).

### Je opravdu zdarma? Potřebuji účet?

Ano, a ne. Otevřete [run.edubeam.app](https://run.edubeam.app/?lang=cs) a začněte modelovat. Žádné účty, instalace ani limity používání. Zdrojový kód je na [GitHubu](https://github.com/janvorisek/edubeam).

### Jaké prohlížeče a zařízení fungují?

Jakýkoli aktuální Chrome, Edge, Firefox nebo Safari. Tablety a telefony fungují (klepnutí, tažení pro posun, roztažení prstů pro zoom, podržení uzlu pro přesun), ale s myší a klávesnicí je modelování mnohem rychlejší.

### Mohu ho používat offline?

EduBeam je progresivní webová aplikace: jednou načtená funguje i bez připojení a prohlížeč může nabídnout její instalaci. Je-li k dispozici nová verze, dialog se před aktualizací zeptá.

### Kde jsou uložená moje data?

Pouze ve vašem prohlížeči. Modely se nikdy neposílají na server; sdílený odkaz *je* model. Viz [Import, export a sdílení](/cs/essentials/import-export).

## Modelování

### Jak vytvořím vetknutí / kloubovou / posuvnou podporu?

Zaškrtněte stupně volnosti: **Dx + Dz + Ry** = vetknutí, **Dx + Dz** = pevný kloub, **Dz** = posuvný kloub. Všechny kombinace i jejich značky jsou v kapitole [Uzly a podpory](/cs/essentials/nodes-supports#podpory).

### Jak vytvořím příhradovou konstrukci?

Použijte prutové prvky a u každého prutu zaškrtněte **oba koncové klouby** v záložce *Prvky*. Zatížení zadávejte do styčníků. Viz [Prvky](/cs/essentials/elements#koncove-klouby).

### Jak vložím kloub do rámu?

Zaškrtněte **koncový kloub** prvku na té straně styčníku, kde má být moment uvolněn. Kloub na *jednom* prvku ve styčníku uvolní jen tento prvek.

### Jak přidám podporu nebo osamělou sílu doprostřed nosníku?

Přidejte uzel na nosník pomocí *Přidat myší* a zvolte **Připojit ke konstrukci** – nosník se rozdělí na dva. Pro samotnou osamělou sílu uzel ani nepotřebujete: použijte prvkové zatížení **Osamělá síla** se vzdáleností od počátečního uzlu.

### Mohu zadat vlastní tíhu?

Ne automaticky. Zadejte ji jako spojité rovnoměrné zatížení $f_z = \rho g A$.

### Mohu modelovat šikmé podpory?

Ano – nastavte u uzlu **Pootočení systému souřadnic**; jeho stupně volnosti se pak vyhodnocují v pootočeném systému.

### Existují zatěžovací stavy nebo kombinace?

Ne, pouze jeden zatěžovací stav. Každý stav modelujte zvlášť a uložte nebo sdílejte.

### Proč moje zatížení míří vzhůru?

Protože globální osa z míří **dolů**: kladné `Fz` působí dolů. Viz [znaménková konvence](/cs/elements/conventions).

## Výsledky

### Proč není tlačítko „Spočítat“?

Model se řeší automaticky po každé změně. Pokud se výsledky neobjeví, model zatím nelze vyřešit – co zkontrolovat, uvádí [Řešení problémů](/cs/reference/troubleshooting).

### Proč se můj průhyb nepatrně liší od vzorce?

EduBeam používá Timoshenkův nosník, takže průhyby zahrnují smykovou deformaci. U štíhlých prutů je rozdíl hluboko pod 1 %. Podrobnosti a řešená porovnání v kapitole [Ověření výsledků ručně](/cs/guide/verification).

### Jak přesné jsou výsledky? Potřebuji více prvků?

Pro lineární statickou analýzu je prutový prvek při podporovaných typech zatížení přesný, takže stačí jeden prvek na prut. Další uzly potřebujete jen tam, kde chcete podporu, kloub, změnu průřezu nebo uzel pro zatížení.

### Kde najdu reakce?

V zobrazení jako šipky s hodnotami (zapněte **Reakce** v nastavení zobrazení). Koncové síly prvků a posunutí uzlů jsou v záložce **Výsledky**.

## Soubory a sdílení

### Jak model sdílím?

**Sdílet konstrukci** → **Kopírovat odkaz**. Odkaz obsahuje celý model. Příjemci dostanou vlastní upravitelnou kopii; živá spolupráce neexistuje.

### Mohu model vložit na svůj web nebo do prezentace?

Ano – přidejte ke sdílenému odkazu `&viewer=1` a vložte ho do `<iframe>`. Viz [Vložení prohlížeče jen pro čtení](/cs/essentials/import-export#vlozeni-prohlizece-jen-pro-cteni).

### Mohu exportovat obrázky nebo tabulky?

Zatím ne. Pro obrázky použijte snímek obrazovky, pro čísla zkopírujte text tabulky. Hlasujte pro funkci na [GitHubu](https://github.com/janvorisek/edubeam/issues).

### Mohu modely generovat programově?

Ano. Soubor projektu je prostý JSON v jednotkách SI – viz [popis formátu](/cs/essentials/import-export#format-souboru-projektu) – a lze ho otevřít přes *Otevřít projekt* nebo přetažením.

## Podpora

### Jak nahlásím chybu nebo navrhnu funkci?

Založte issue na [GitHubu](https://github.com/janvorisek/edubeam/issues) a přiložte sdílený odkaz nebo soubor projektu, který problém reprodukuje. Soukromá podpora: [support@edubeam.app](mailto:support@edubeam.app).
