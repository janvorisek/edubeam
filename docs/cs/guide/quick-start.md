# Rychlý start

Za zhruba deset minut vymodelujete prostý ocelový nosník se spojitým rovnoměrným zatížením, odečtete reakce, posouvající síly a ohybové momenty a ověříte je učebnicovými vzorci.

::: tip Pracujte rovnou v aplikaci
Otevřete si [run.edubeam.app](https://run.edubeam.app/?lang=cs){target="_blank"} ve druhé záložce. Pokud už v ní nějaký model je, vymažte ho tlačítkem **Smazat konstrukci** v horní liště; zaškrtněte *Smazat materiály* a *Smazat průřezy*, ať začínáte úplně od nuly. Smazání vrátíte zkratkou <kbd>Ctrl</kbd>+<kbd>Z</kbd> a původní model najdete v **☰ → Nedávné konstrukce**.

Učíte se raději s nápovědou přímo na obrazovce? Volba **☰ → Nakreslit první nosník** vás krok za krokem provede kreslením podobného nosníku myší.
:::

## Zadání {#the-problem}

<ExampleStructure />

Prostý nosník o rozpětí 6 m (vlevo pevný kloub, vpravo posuvný kloub) nese spojité rovnoměrné zatížení 12 kN/m. Materiál: ocel, $E = 210\ \text{GPa}$, $G = 81\ \text{GPa}$. Průřez: IPE 200, $A = 28{,}5\ \text{cm}^2$, $I_y = 1943\ \text{cm}^4$, $h = 200\ \text{mm}$.

## 1. Zkontrolujte jednotky {#_1-check-the-units}

Štítek jednotek v pravém dolním rohu zobrazení ukazuje, v jakých jednotkách jsou všechna vstupní pole a výsledky. Návod počítá s výchozími jednotkami SI: metry, kN, kNm a MPa.

![Přepínače mřížky (G), přichytávání (S) a zaměřovacího kříže a štítek jednotek](/screenshots/cs/ui-grid-units.webp){.shot-sm}

Pokud vidíte `ft · kip · kip·ft · ksi`, klikněte na štítek a zvolte **Soustava jednotek → SI (metrická)**.

## 2. Přidejte materiál a průřez {#_2-add-the-material-and-cross-section}

Každý prvek potřebuje materiál a průřez, proto začněte jimi.

1. Ve spodní liště otevřete záložku **Materiály** a klikněte na **Přidat materiál**.
2. Zadejte `E = 210000` MPa a `G = 81000` MPa. Hustotu a `α = 0,000012` 1/K nechte beze změny. Klikněte na **Přidat materiál**.

<div class="shots">

![Přidat materiál: zadejte E a G…](/screenshots/cs/qs-material.webp)

![…nebo vyberte Steel (S235) z Knihovny materiálů](/screenshots/cs/qs-material-library.webp)

</div>

3. Otevřete záložku **Průřezy** a klikněte na **Přidat průřez**.
4. Zadejte `Plocha = 0,00285` m², `Iy = 1,943e-5` m⁴, `Výška = 0,2` m a `Smykový součinitel = 1`. Klikněte na **Přidat průřez**.

![Přidat průřez. Průřez můžete vybrat i z knihovny nebo nakreslit jako polygon.](/screenshots/cs/qs-cross-section.webp){.shot-md}

::: details Proč záleží na smykovém součiniteli?
EduBeam používá Timoshenkovy nosníkové prvky, které zahrnují smykovou deformaci. `k` je smykový součinitel: $k \approx 0{,}83$ pro obdélník a přibližně $0{,}4$–$0{,}5$ pro I‑profil, pokud za $A$ dosadíte celou plochu průřezu. S `k = 1` a celou plochou vychází smyková poddajnost mírně *podceněná*. U štíhlého nosníku, jako je tento, se průhyb liší o mnohem méně než 1 %. Vzorec najdete na stránce [teorie nosníku](/cs/elements/beam).
:::

## 3. Přidejte uzly {#_3-add-the-nodes}

1. Otevřete záložku **Uzly**. Najdete v ní dvě tlačítka **Přidat uzel**: první otevře dialog, druhé (s ikonou kurzoru) slouží k umisťování uzlů myší. Klikněte na první.
2. Zadejte `X = 0`, `Z = 0` a klikněte na **Přidat uzel**. Uzel dostane číslo `1`.
3. Přidejte druhý uzel v bodě `X = 6`, `Z = 0`. Dostane číslo `2`.

![V dialogu Přidat uzel můžete rovnou nastavit i podepření](/screenshots/cs/qs-node.webp){.shot-md}

Druhým tlačítkem naopak umístíte uzel každým kliknutím do plátna. Když je zapnuté **Přichytávat k mřížce** (<kbd>S</kbd>), kliknutí se přichytí ke kroku mřížky (výchozí krok je 0,1 m).

## 4. Spojte je prvkem {#_4-connect-them-with-an-element}

1. Otevřete záložku **Prvky** a klikněte na první tlačítko **Přidat prvek**.
2. Zvolte **Počáteční uzel** `1` a **Koncový uzel** `2`. Váš materiál a průřez už jsou předvybrané. Klikněte na **Přidat prvek**.

![Přidat prvek: dva koncové uzly, volitelné koncové klouby, materiál a průřez](/screenshots/cs/qs-element.webp){.shot-md}

Mezi uzly se objeví čára. Klávesou <kbd>F</kbd> přizpůsobíte zobrazení celé konstrukci.

## 5. Přidejte podpory {#_5-add-the-supports}

V záložce **Uzly** je u každého uzlu ve sloupci **Podepřené stupně volnosti** výběr značky podpory a tři zaškrtávací políčka: `Dx`, `Dz`, `Ry`.

- Uzel `1`: vyberte značku **Kloub**, nebo zaškrtněte **Dx** a **Dz**.
- Uzel `2`: vyberte **Posuvný kloub**, nebo zaškrtněte jen **Dz**.

![Podpory v tabulce Uzly: uzel 1 na pevném kloubu, uzel 2 na posuvném kloubu](/screenshots/cs/qs-supports.webp)

Podporu můžete zadat i tak, že v zobrazení kliknete na uzel a zvolíte **Podepření uzlu**. Všechny typy podpor popisuje kapitola [Uzly a podpory](/cs/essentials/nodes-supports#supports).

## 6. Přidejte zatížení {#_6-add-the-load}

1. Otevřete záložku **Zatížení** a klikněte na **Přidat prvkové zatížení**.
2. **Typ zatížení**: *Spojité rovnoměrné zatížení*. **Prvek**: `1`.
3. Zadejte `fz = 12` kN/m a `fx = 0` ponechte. Klikněte na **Přidat prvkové zatížení**.

![V dialogu vidíte náhled zatížení na prvku](/screenshots/cs/qs-load.webp){.shot-md}

Kladné `fz` působí ve směru +z, tedy na obrazovce **dolů**, takže kladná hodnota odpovídá tíhovému zatížení. Viz [znaménková konvence](/cs/elements/conventions).

## 7. Odečtěte výsledky {#_7-read-the-results}

Výsledky se objeví hned, jak zatížení přidáte. Panel vpravo nahoře v zobrazení zapíná a vypíná jednotlivé průběhy. **Deformovaný tvar**, **M<sub>y</sub>(x)** a **Reakce** jsou zapnuté už ve výchozím stavu. Posouvající sílu přidáte zaškrtnutím **V<sub>z</sub>(x)**.

![Posouvající síla (zeleně), ohybový moment (červeně), reakce (fialově) a deformovaný tvar](/screenshots/cs/qs-results.webp)

| Vrstva | Co byste měli vidět |
| --- | --- |
| **Reakce** | Dvě šipky mířící vzhůru, každá o velikosti **36 kN**, v uzlech 1 a 2. |
| **V<sub>z</sub>(x)** | Přímka od **+36 kN** vlevo po **−36 kN** vpravo, nulová uprostřed rozpětí. |
| **M<sub>y</sub>(x)** | Parabola s maximem **54 kNm** uprostřed rozpětí. |
| **Deformovaný tvar** | Symetrický průhyb. Najeďte myší na uzel `1` a odečtěte jeho pootočení: **2,6469 · 10⁻² rad**. |

Číselné hodnoty najdete v záložce **Výsledky** ve spodní liště. **Výsledky v uzlech** obsahují `Dx`, `Dz`, `Ry` každého uzlu, **Výsledky na prvcích** koncové síly každého prvku v jeho lokálním souřadném systému.

Jsou průběhy příliš velké, nebo naopak malé? Upravte **Měřítko výsledků** v **Nastavení → Nastavení zobrazení → Velikost**.

## 8. Ověřte ručně {#_8-check-by-hand}

| Veličina | Vzorec | Ručně | EduBeam |
| --- | --- | --- | --- |
| Reakce | $R = qL/2$ | 36 kN | 36 kN |
| Max. posouvající síla | $V = qL/2$ | 36 kN | 36 kN |
| Max. ohybový moment | $M = qL^2/8$ | 54 kNm | 54 kNm |
| Pootočení v podpoře | $\varphi = qL^3/(24EI)$ | 0,02647 rad | 0,02647 rad |
| Průhyb uprostřed (ohyb) | $w = 5qL^4/(384EI)$ | 49,63 mm | |
| Průhyb uprostřed (smyk) | $w_s = qL^2/(8kGA)$ | 0,23 mm | |
| Průhyb uprostřed (celkem) | součet | 49,86 mm | 49,86 mm |

Uprostřed rozpětí žádný uzel není, a abyste tam mohli odečíst průhyb, jeden přidejte: zvolte druhé tlačítko **Přidat uzel**, klikněte na nosník v místě `X = 3` a vyberte **Připojit ke konstrukci**. Nosník se rozdělí na dva prvky a ve **Výsledcích** bude mít nový uzel `Dz` = 49,86 mm. Rozdělení žádný výsledek nezmění, protože prvek je přesný.

Všechno sedí. Další ruční kontroly (konzola, oboustranně vetknutý nosník, příhradová konstrukce, teplota) najdete v kapitole [Ověření výsledků ručně](/cs/guide/verification).

## 9. Experimentujte {#_9-experiment}

Teď se ukáže, v čem je EduBeam silný. Vyzkoušejte postupně tyto úpravy a sledujte, jak se mění průběhy:

- **Přetáhněte uzel 2** doprava: moment roste s $L^2$.
- **Zaškrtněte `Ry` v uzlu 1** a uzel tím vetknete: moment uprostřed rozpětí klesne a nad podporou se objeví záporný moment.
- **Zaškrtněte `Dz` v uzlu uprostřed rozpětí**, který jste právě přidali, a vznikne spojitý nosník o dvou polích.
- **Zaškrtněte koncový kloub** u prvku v záložce Prvky a uvolníte tím moment na jednom konci.
- Kterýkoli krok vrátíte zkratkou <kbd>Ctrl</kbd>+<kbd>Z</kbd>.

## 10. Uložte nebo sdílejte {#_10-save-or-share}

- **Sdílet konstrukci** (v horní liště nebo v nabídce ☰) vytvoří odkaz, který obsahuje celý model. Vložte ho do e‑mailu, chatu nebo prezentace.
- **☰ → Uložit projekt** (<kbd>Ctrl</kbd>+<kbd>S</kbd>) stáhne soubor `project.json`. Později ho otevřete přes **Otevřít projekt** nebo ho přetáhnete do aplikace.
- **☰ → Exportovat obrázek** (<kbd>Ctrl</kbd>+<kbd>P</kbd>) uloží výkres do PNG nebo SVG, třeba pro technickou zprávu.

Model se navíc průběžně ukládá v prohlížeči, takže ho obnovením stránky neztratíte. Viz [Import, export a sdílení](/cs/essentials/import-export).

## Kam dál {#where-next}

- [Návod: trojkloubový rám](/cs/tutorials/three-hinged-frame): rám s vnitřním kloubem, ověřený ručním výpočtem.
- [Příklady](/cs/examples/): hotové rámy a příhradové konstrukce, které otevřete jedním kliknutím.
- [Zatížení](/cs/essentials/loads): lichoběžníkové zatížení, osamělé síly, změna teploty, předepsaná posunutí.
- [Klávesnice, myš a dotyk](/cs/reference/shortcuts): jak na plátně pracovat rychleji.
