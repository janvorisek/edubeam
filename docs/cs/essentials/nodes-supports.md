# Uzly a podpory

Uzly jsou body modelu. Prvky spojují uzly; podpory a uzlová zatížení se vážou k uzlům.

## Souřadnice

Každý uzel má souřadnice **X** a **Z** v aktuální jednotce délky. Osa x míří doprava a **osa z míří na obrazovce dolů** – sloup od země nahoru tedy vede z `Z = 0` do `Z = −3`, ne `+3`. Ukazatel os v rohu mřížky zobrazuje aktuální orientaci. Viz [Souřadný systém a znaménková konvence](/cs/elements/conventions).

## Přidání uzlů

| Způsob | Postup |
| --- | --- |
| **Dialog** | Záložka *Uzly* → **Přidat uzel**, nebo pravé tlačítko na plátně → *Přidat uzel*. Zadejte X a Z. |
| **Myší** | Záložka *Uzly* → **Přidat myší** (nebo držte <kbd>Ctrl</kbd> při volbě *Přidat uzel* z nabídky plátna) a klikejte na plátno. Každé kliknutí přidá uzel; <kbd>Esc</kbd> režim ukončí. |
| **Při kreslení prvků** | V režimu *Přidat prvek → Přidat myší* vytvoří kliknutí na prázdné plátno nový uzel a připojí ho. |
| **Kopírování** | Vyberte uzly (a prvky), <kbd>Ctrl</kbd>+<kbd>C</kbd>, <kbd>Ctrl</kbd>+<kbd>V</kbd> a klikněte tam, kam má kopie přijít. |

Označení se přidělují automaticky (`1`, `2`, …) a lze je v tabulce přejmenovat.

### Přichytávání

Se zapnutým **Přichytávat k mřížce** (<kbd>S</kbd> nebo štítek **S**) padnou uzly umístěné či přetažené myší na násobky **kroku příchytu k mřížce** (výchozí `0,1 m`, změna v *Nastavení → Nastavení zobrazení → Mřížka*). Pro volné umístění přichytávání vypněte nebo přesné souřadnice dodatečně zadejte v tabulce.

### Umístění uzlu na existující prvek

Kliknete-li při přidávání uzlu blíže než ~0,1 m k prvku, EduBeam se zeptá, co máte na mysli:

- **Připojit ke konstrukci** – prvek se rozdělí na dva (`1a` a `1b`), klouby na vnějších koncích zůstanou zachovány a případné spojité zatížení se rozdělí mezi obě části. Nejrychlejší způsob, jak přidat vnitřní podporu nebo bod pro zatížení.
- **Umístit samostatný uzel** – uzel se vytvoří na prvku, ale nepřipojí se k němu.

## Úprava uzlů

- **Tabulka:** označení, X a Z se upravují přímo.
- **Tažení:** přesun uzlu v zobrazení (lze vrátit zpět). Na dotykové obrazovce uzel podržte a poté táhněte.
- **Dialog Upravit uzel:** souřadnice, podepření a pootočení souřadného systému na jednom místě s živým náhledem značky podpory.
- **Smazání:** ikona koše v tabulce, *Smazat* v kontextové nabídce uzlu nebo výběr a <kbd>Delete</kbd>. Smazání uzlu smaže i prvky a zatížení, které jsou k němu připojeny.

## Podpory

Podpora je jednoduše množina odebraných stupňů volnosti. Každý uzel má tři:

| Stupeň volnosti | Význam |
| --- | --- |
| **Dx** | posun ve směru x (vodorovný) |
| **Dz** | posun ve směru z (svislý) |
| **Ry** | pootočení kolem osy y (v rovině konstrukce) |

Zaškrtněte políčka ve sloupci **Podepřené stupně volnosti** záložky *Uzly*, v nabídce **Podepření uzlu** vybraného uzlu nebo v dialogu *Upravit uzel*. Značka v zobrazení odpovídá kombinaci:

| Odebráno | Podpora | Značka |
| --- | --- | --- |
| Dx + Dz + Ry | Vetknutí | šrafovaný blok |
| Dx + Dz | Pevný kloub (kloubová podpora) | trojúhelník |
| Dz | Posuvný kloub (volný posun vodorovně) | trojúhelník na válečcích |
| Dx | Posuvný kloub svislý (volný posun svisle) | otočený váleček |
| Dz + Ry | Posuvné vetknutí (svislé vedení) | vetknutí na válečcích |
| Dx + Ry | Posuvné vetknutí (vodorovné vedení) | otočené posuvné vetknutí |
| Ry | Pouze bránění pootočení | rotační vetknutí |
| nic | Volný uzel | — |

Pro každý odebraný stupeň volnosti se počítá – a vykresluje – reakce.

::: tip Styčníky příhradových konstrukcí
Příhradové pruty jsou prutové prvky s uvolněnými **oběma koncovými klouby** (viz [Prvky](/cs/essentials/elements#koncove-klouby)). Ve styčníku příhradoviny je obvyklou volbou pevný kloub (Dx + Dz); v uzlu, kde jsou všechny připojené prvky kloubové, **neodebírejte Ry**, jinak by pootočení uzlu bylo nedefinované.
:::

### Šikmé podpory

Nastavte **Pootočení systému souřadnic** (ve stupních, −180…180) v kontextové nabídce uzlu nebo v dialogu *Upravit uzel*. Lokální osy uzlu se o tento úhel pootočí a podepřené stupně volnosti se vyhodnocují v pootočeném systému – posuvný kloub na svahu se sklonem 30° je tedy `Dz` s pootočením `30`. Značka podpory se pootočí a reakce se uvádí v pootočeném směru.

### Stabilita

Řešič potřebuje celkem alespoň **tři odebrané stupně volnosti** a konstrukci bez mechanismu. Chybějící nebo nedostatečné podepření vyvolá chybu *Model needs at least 3 constrained DOFs…* nebo se prostě nezobrazí výsledky. Viz [Řešení problémů](/cs/reference/troubleshooting).

## Uzlová zatížení a poklesy podpor

Síly, momenty a předepsaná posunutí (poklesy podpor) působí v uzlech – viz [Zatížení](/cs/essentials/loads#uzlova-zatizeni).

## Kóty

Pravé tlačítko na plátně → **Přidat kótu** nakreslí kótu mezi dvěma body. Koncové body se při tažení přichytí k blízkému uzlu; po výběru kóty použijte **Upravit** pro zadání souřadnic nebo **Převrátit kótu** pro popisek na druhé straně. Kóty jsou pouze grafické a ukládají se s projektem.
