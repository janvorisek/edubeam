# Uzly a podpory

Uzly jsou body modelu. Prvky spojují uzly a k uzlům se připojují podpory a uzlová zatížení.

## Souřadnice {#coordinates}

Každý uzel má souřadnice **X** a **Z** v aktuální jednotce délky. Osa x míří doprava a **osa z míří na obrazovce dolů**, takže sloup vycházející ze země vede z `Z = 0` do `Z = −3`, ne do `+3`. Ukazatel os v rohu mřížky ukazuje orientaci. Pokud dáváte přednost svislé ose mířící nahoru, přepněte v Nastavení na [osy s y nahoru](/cs/elements/conventions#y-up-axes).

## Přidání uzlů {#adding-nodes}

| Způsob | Postup |
| --- | --- |
| **Dialog** | Záložka *Uzly* → první tlačítko **Přidat uzel**, nebo pravé tlačítko na plátně → *Přidat uzel*. Zadejte X a Z a případně podpory a úhel podpory. |
| **Myší** | Záložka *Uzly* → druhé tlačítko **Přidat uzel** (ikona kurzoru), nebo podržte <kbd>Ctrl</kbd> při volbě *Přidat uzel* v nabídce plátna. Každé kliknutí na plátno přidá uzel. Stiskem <kbd>Esc</kbd> nebo **Zrušit** přidávání ukončíte. |
| **Při kreslení prvků** | V režimu kreslení prvků myší vytvoří kliknutí na prázdné plátno uzel a připojí ho. |
| **Kopírovat a vložit** | Vyberte uzly (a prvky), stiskněte <kbd>Ctrl</kbd>+<kbd>C</kbd> a <kbd>Ctrl</kbd>+<kbd>V</kbd> a pak klikněte tam, kam má kopie přijít, nebo zadejte posun Δx, Δz a stiskněte **Vložit**. |

<div class="shots">

![Dialog Přidat uzel](/screenshots/cs/qs-node.webp)

![V režimu myši nastavuje lišta nahoře podpory a úhel každého umístěného uzlu](/screenshots/cs/nodes-add-banner.webp)

</div>

Označení se přidělují automaticky (`1`, `2`, … nebo pokračováním vašeho vlastního schématu, např. `A`, `B`) a v tabulce je lze přejmenovat.

### Přichytávání {#snapping}

Se zapnutým **Přichytávat k mřížce** (<kbd>S</kbd> nebo přepínač **S**) padnou uzly, které umístíte nebo přetáhnete, na násobky **kroku příchytu k mřížce**: ve výchozím nastavení 0,1 m, v amerických jednotkách 0,5 ft. Změníte ho v *Nastavení → Nastavení zobrazení → Mřížka*. Pro volné umístění přichytávání vypněte, nebo přesné souřadnice zadejte dodatečně v tabulce.

### Umístění uzlu na existující prvek {#placing-a-node-on-an-existing-element}

Kliknete-li při přidávání uzlu blízko prvku, EduBeam se zeptá, co máte na mysli:

- **Připojit ke konstrukci** rozdělí prvek na dva (`1a` a `1b`). Klouby na vnějších koncích zůstanou zachovány a rovnoměrné i lichoběžníkové zatížení se rozdělí mezi obě poloviny; osamělé síly a teplotní zatížení připadnou první polovině. Je to nejrychlejší způsob, jak přidat vnitřní podporu nebo bod pro zatížení.
- **Umístit samostatný uzel** vytvoří uzel na prvku, ale nepřipojí ho.

## Úprava uzlů {#editing-nodes}

- **Tabulka:** označení, X a Z upravíte přímo.
- **Tažení:** uzel přesunete v zobrazení, i na dotykové obrazovce: uzel stiskněte a táhněte. Každý přesun lze vrátit.
- **Dialog Upravit uzel:** tužka ve sloupci *Akce* tabulky. Obsahuje souřadnice, podpory a úhel podpory s náhledem značky podpory.
- **Smazání:** × v tabulce, *Smazat* v panelu uzlu, nebo uzel vyberte a stiskněte <kbd>Delete</kbd>. Smazáním uzlu se smažou i prvky a zatížení, které jsou k němu připojené.

## Podpory {#supports}

Podpora je množina podepřených stupňů volnosti. Každý uzel má tři:

| Stupeň volnosti | Význam |
| --- | --- |
| **Dx** | posun ve směru x (vodorovný) |
| **Dz** | posun ve směru z (svislý) |
| **Ry** | pootočení kolem osy y (v rovině výkresu) |

Nejrychlejší je **vybrat značku**. Najdete ji v panelu uzlu pod **Podepření uzlu**, v dialozích Přidat uzel a Upravit uzel a jako malou nabídku na začátku sloupce *Podepřené stupně volnosti* v tabulce Uzly. Zaškrtávání políček `Dx`, `Dz`, `Ry` udělá totéž po jednotlivých stupních volnosti.

![Podepření uzlu: vyberte značku nebo zaškrtněte stupně volnosti a nastavte úhel podpory](/screenshots/cs/nodes-support-picker.webp){.shot-lg}

| Podpora | Podepřeno | Pohyb | Reakce |
| --- | --- | --- | --- |
| **Volný** | nic | vše | žádné |
| **Kloub** | Dx + Dz | pootočení | R<sub>x</sub>, R<sub>z</sub> |
| **Posuvný kloub** | Dz | vodorovný posun, pootočení | R<sub>z</sub> |
| **Svislý posuvný kloub** | Dx | svislý posun, pootočení | R<sub>x</sub> |
| **Vetknutí** | Dx + Dz + Ry | nic | R<sub>x</sub>, R<sub>z</sub>, M |
| **Posuvné vetknutí** | Dz + Ry | vodorovný posun | R<sub>z</sub>, M |
| **Svislé posuvné vetknutí** | Dx + Ry | svislý posun | R<sub>x</sub>, M |
| **Zamezené pootočení** | Ry | posun v obou směrech | M |

Pro každý podepřený stupeň volnosti se spočítá a vykreslí reakce.

::: tip Styčníky příhradových konstrukcí
Příhradové pruty jsou nosníkové prvky s uvolněnými oběma **koncovými klouby** (viz [Prvky](/cs/essentials/elements#end-hinges)). V podpoře příhradové konstrukce se obvykle volí kloub (Dx + Dz). Uzel, ve kterém jsou všechny připojené prvky kloubové, nemá žádnou tuhost v pootočení; EduBeam ho přijme a jeho pootočení uvádí jako 0.
:::

### Šikmé (natočené) podpory {#inclined-skewed-supports}

Nastavte **Pootočení systému souřadnic** α ve stupních (−180…180). Najdete ho v panelu uzlu pod *Podepření uzlu*, v dialozích Přidat uzel a Upravit uzel a v poli α tabulky Uzly. Osy uzlu se pootočí o tento úhel a podepřené stupně volnosti působí v pootočených směrech, takže posuvný kloub na svahu 30° je `Dz` s α = 30. Značka se odpovídajícím způsobem natočí a reakce se uvádí v pootočeném směru.

### Stabilita {#stability}

Řešič potřebuje celkem alespoň **tři podepřené stupně volnosti** a podpory s klouby musí konstrukci udržet. Dokud není podpor dost, ukazuje zobrazení modrý štítek *Chybí podpory*. Pokud je podpor dost, ale konstrukci neudrží (všechny jsou rovnoběžné nebo se protínají v jednom bodě), nebo pokud klouby umožňují prutům vzájemné natočení, červené hlášení problém pojmenuje a čárkovaný obrys ukáže, jak se konstrukce pohybuje. Viz [Řešení problémů](/cs/reference/troubleshooting).

## Uzlová zatížení a poklesy podpor {#nodal-loads-and-settlements}

Síly, momenty a předepsaná posunutí (poklesy podpor) se zadávají v uzlech. Viz [Zatížení](/cs/essentials/loads#nodal-loads).

## Kóty {#dimension-lines}

Pravým tlačítkem na plátno → **Přidat kótu** nakreslíte kótu mezi dvěma body, pravým tlačítkem na prvek → **Okótovat prvek** okótujete přímo prvek. Koncové body se při přetažení do blízkosti uzlů k nim přichytí. Vyberte kótu a pomocí **Upravit** zadejte její souřadnice, nebo pomocí **Převrátit kótu** přesuňte popisek na druhou stranu. Kóty jsou jen kosmetické; ukládají se s projektem a přenášejí se i ve sdílených odkazech.
