# Uzly a podpory

Uzly jsou body modelu. Prvky uzly propojují a v uzlech se zadávají podpory a uzlová zatížení.

## Souřadnice {#coordinates}

Každý uzel má souřadnice **X** a **Z** v aktuální jednotce délky. Osa x míří doprava a **osa z míří na obrazovce dolů**. Sloup, který vychází ze země, proto vede ze `Z = 0` do `Z = −3`, nikoli do `+3`. Orientaci os ukazuje symbol v rohu mřížky. Chcete-li, aby svislá osa mířila nahoru, přepněte v Nastavení na [osy s y nahoru](/cs/elements/conventions#y-up-axes).

## Přidání uzlů {#adding-nodes}

| Způsob | Postup |
| --- | --- |
| **Dialog** | Záložka *Uzly* → první tlačítko **Přidat uzel**, nebo pravé tlačítko na plátně → *Přidat uzel*. Zadejte X a Z, případně podpory a úhel podpory. |
| **Myší** | Záložka *Uzly* → druhé tlačítko **Přidat uzel** (ikona kurzoru), nebo při volbě *Přidat uzel* v nabídce plátna podržte <kbd>Ctrl</kbd>. Každým kliknutím na plátno přidáte uzel. Přidávání ukončíte klávesou <kbd>Esc</kbd> nebo tlačítkem **Zrušit**. |
| **Při kreslení prvků** | Když kreslíte prvky myší, vytvoří kliknutí na prázdné plátno nový uzel a prvek se k němu připojí. |
| **Kopírovat a vložit** | Vyberte uzly (a prvky), stiskněte <kbd>Ctrl</kbd>+<kbd>C</kbd> a <kbd>Ctrl</kbd>+<kbd>V</kbd> a pak klikněte tam, kam chcete kopii umístit, nebo zadejte posun Δx, Δz a stiskněte **Vložit**. |

<div class="shots">

![Dialog Přidat uzel](/screenshots/cs/qs-node.webp)

![V režimu myši nastavíte v liště nahoře podpory a úhel pro každý umístěný uzel](/screenshots/cs/nodes-add-banner.webp)

</div>

Označení se přidělují automaticky (`1`, `2`, … nebo navazují na vaše vlastní schéma, např. `A`, `B`) a v tabulce je můžete přejmenovat.

### Přichytávání {#snapping}

Když je zapnuté **Přichytávat k mřížce** (<kbd>S</kbd> nebo přepínač **S**), přichytí se uzly, které umístíte nebo přetáhnete, k násobkům **kroku příchytu k mřížce**. Ve výchozím nastavení je krok 0,1 m, v amerických jednotkách 0,5 ft. Změníte ho v *Nastavení → Nastavení zobrazení → Mřížka*. Chcete-li uzly umísťovat volně, přichytávání vypněte, nebo přesné souřadnice zadejte dodatečně v tabulce.

### Umístění uzlu na existující prvek {#placing-a-node-on-an-existing-element}

Když při přidávání uzlu kliknete blízko prvku, EduBeam se zeptá, co chcete udělat:

- **Připojit ke konstrukci** rozdělí prvek na dva (`1a` a `1b`). Klouby na vnějších koncích zůstanou zachované, rovnoměrné i lichoběžníkové zatížení se rozdělí mezi obě části a osamělé síly a teplotní zatížení připadnou první části. Tak nejrychleji přidáte vnitřní podporu nebo bod, ve kterém chcete zadat zatížení.
- **Umístit samostatný uzel** vytvoří uzel na prvku, ale nepřipojí ho k němu.

## Úprava uzlů {#editing-nodes}

- **Tabulka:** označení, X a Z upravíte přímo.
- **Tažení:** uzel přesunete přímo v zobrazení, a to i na dotykové obrazovce – stačí ho stisknout a táhnout. Každý přesun můžete vrátit.
- **Dialog Upravit uzel:** otevřete ho tužkou ve sloupci *Akce* tabulky. Obsahuje souřadnice, podpory a úhel podpory s náhledem značky podpory.
- **Smazání:** × v tabulce, *Smazat* v panelu uzlu, nebo uzel vyberte a stiskněte <kbd>Delete</kbd>. Spolu s uzlem se smažou i prvky a zatížení, které jsou k němu připojené.

## Podpory {#supports}

Podpora určuje, které stupně volnosti uzlu jsou podepřené. Každý uzel má tři:

| Stupeň volnosti | Význam |
| --- | --- |
| **Dx** | posun ve směru x (vodorovný) |
| **Dz** | posun ve směru z (svislý) |
| **Ry** | pootočení kolem osy y (v rovině výkresu) |

Nejrychleji podporu nastavíte **výběrem značky**. Značky najdete v panelu uzlu pod **Podepření uzlu**, v dialozích Přidat uzel a Upravit uzel a jako malou nabídku na začátku sloupce *Podepřené stupně volnosti* v tabulce Uzly. Zaškrtávacími políčky `Dx`, `Dz`, `Ry` nastavíte totéž po jednotlivých stupních volnosti.

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

V každém podepřeném stupni volnosti se spočítá a vykreslí reakce.

::: tip Styčníky příhradových konstrukcí
Příhradové pruty jsou nosníkové prvky, které mají uvolněné oba **koncové klouby** (viz [Prvky](/cs/essentials/elements#end-hinges)). Příhradová konstrukce se obvykle podpírá kloubem (Dx + Dz). Uzel, ve kterém jsou všechny připojené prvky kloubové, nemá žádnou tuhost v pootočení. EduBeam takový uzel přijme a jeho pootočení uvede jako 0.
:::

### Šikmé (natočené) podpory {#inclined-skewed-supports}

Nastavte **Pootočení systému souřadnic** α ve stupních (−180…180). Najdete ho v panelu uzlu pod *Podepření uzlu*, v dialozích Přidat uzel a Upravit uzel a v poli α tabulky Uzly. Osy uzlu se pootočí o zadaný úhel a podepřené stupně volnosti pak působí v pootočených směrech. Posuvný kloub na svahu se sklonem 30° je tedy `Dz` s α = 30. Značka se natočí stejně a reakce se uvádí v pootočeném směru.

### Stabilita {#stability}

Řešič potřebuje celkem alespoň **tři podepřené stupně volnosti** a podpory spolu s klouby musí konstrukci udržet. Dokud podpor není dost, ukazuje zobrazení modrý štítek *Chybí podpory*. Pokud je podpor dost, ale konstrukci neudrží (všechny jsou rovnoběžné nebo se protínají v jednom bodě), nebo pokud se pruty mohou v kloubech vzájemně pootáčet, červené hlášení problém pojmenuje a čárkovaný obrys ukáže, jak se konstrukce pohybuje. Viz [Řešení problémů](/cs/reference/troubleshooting).

## Uzlová zatížení a poklesy podpor {#nodal-loads-and-settlements}

Síly, momenty a předepsaná posunutí (poklesy podpor) zadáváte v uzlech. Viz [Zatížení](/cs/essentials/loads#nodal-loads).

## Kóty {#dimension-lines}

Kótu mezi dvěma body nakreslíte pravým tlačítkem na plátně → **Přidat kótu**, prvek okótujete pravým tlačítkem na prvku → **Okótovat prvek**. Když koncové body kóty přetáhnete do blízkosti uzlů, přichytí se k nim. Po výběru kóty můžete tlačítkem **Upravit** zadat její souřadnice, nebo tlačítkem **Převrátit kótu** přesunout popisek na druhou stranu. Kóty slouží jen pro přehlednost výkresu. Ukládají se s projektem a přenášejí se i ve sdílených odkazech.
