# Rychlý start

Za zhruba deset minut vymodelujete prostý ocelový nosník se spojitým rovnoměrným zatížením, odečtete reakce, posouvající síly a ohybové momenty a ověříte je podle učebnicových vzorců.

::: tip Pracujte souběžně
Otevřete si [run.edubeam.app](https://run.edubeam.app/?lang=cs){target="_blank"} ve druhé záložce. Pokud je už nějaký model načtený, začněte s prázdným pomocí **Smazat konstrukci** v horní liště; zaškrtněte *Smazat materiály* a *Smazat průřezy*, abyste začali úplně od nuly. Smazání lze vrátit pomocí <kbd>Ctrl</kbd>+<kbd>Z</kbd> a původní model zůstane v **☰ → Nedávné konstrukce**.

Raději se učíte praxí s nápovědou na obrazovce? **☰ → Nakreslit první nosník** vás myší provede podobným nosníkem.
:::

## Zadání {#the-problem}

<ExampleStructure />

Prostý nosník o rozpětí 6 m (vlevo pevný kloub, vpravo posuvný kloub) nese spojité rovnoměrné zatížení 12 kN/m. Materiál: ocel, $E = 210\ \text{GPa}$, $G = 81\ \text{GPa}$. Průřez: IPE 200, $A = 28{,}5\ \text{cm}^2$, $I_y = 1943\ \text{cm}^4$, $h = 200\ \text{mm}$.

## 1. Zkontrolujte jednotky {#_1-check-the-units}

Štítek jednotek v pravém dolním rohu zobrazení ukazuje jednotky, které používá každé vstupní pole a každý výsledek. Tento návod počítá s výchozími jednotkami SI: metry, kN, kNm a MPa.

![Přepínače mřížky (G), přichytávání (S) a zaměřovacího kříže a štítek jednotek](/screenshots/cs/ui-grid-units.webp){.shot-sm}

Pokud vidíte `ft · kip · kip·ft · ksi`, klikněte na štítek a zvolte **Soustava jednotek → SI (metrická)**.

## 2. Přidejte materiál a průřez {#_2-add-the-material-and-cross-section}

Prvky potřebují materiál a průřez, proto je vytvořte jako první.

1. Otevřete záložku **Materiály** ve spodní liště a klikněte na **Přidat materiál**.
2. Zadejte `E = 210000` MPa a `G = 81000` MPa. Hustotu a `α = 0,000012` 1/K ponechte. Klikněte na **Přidat materiál**.

<div class="shots">

![Přidat materiál: zadejte E a G…](/screenshots/cs/qs-material.webp)

![…nebo vyberte Steel (S235) z Knihovny materiálů](/screenshots/cs/qs-material-library.webp)

</div>

3. Otevřete záložku **Průřezy** a klikněte na **Přidat průřez**.
4. Zadejte `Plocha = 0,00285` m², `Iy = 1,943e-5` m⁴, `Výška = 0,2` m a `Smykový součinitel = 1`. Klikněte na **Přidat průřez**.

![Přidat průřez. Nebo vyberte z knihovny, případně nakreslete polygonální tvar.](/screenshots/cs/qs-cross-section.webp){.shot-md}

::: details Proč na smykovém součiniteli záleží?
EduBeam používá Timoshenkovy nosníkové prvky, které zahrnují smykovou deformaci. `k` je smykový součinitel: $k \approx 0{,}83$ pro obdélník a přibližně $0{,}4$–$0{,}5$ pro I‑profil, je‑li $A$ plná plocha. Volba `k = 1` s plnou plochou smykovou poddajnost mírně *podceňuje*. U štíhlého nosníku, jako je tento, je rozdíl v průhybu hluboko pod 1 %. Vzorec najdete na stránce [teorie nosníku](/cs/elements/beam).
:::

## 3. Přidejte uzly {#_3-add-the-nodes}

1. Otevřete záložku **Uzly**. Jsou v ní dvě tlačítka **Přidat uzel**: první otevře dialog, druhé (s ikonou kurzoru) umisťuje uzly myší. Klikněte na první.
2. Zadejte `X = 0`, `Z = 0` a klikněte na **Přidat uzel**. Uzel dostane označení `1`.
3. Přidejte druhý uzel v `X = 6`, `Z = 0`. To je uzel `2`.

![Dialog Přidat uzel umí rovnou nastavit i podpory](/screenshots/cs/qs-node.webp){.shot-md}

S tlačítkem pro myš naopak každé kliknutí na plátno umístí uzel. Se zapnutým **Přichytávat k mřížce** (<kbd>S</kbd>) padnou kliknutí na krok mřížky (ve výchozím nastavení 0,1 m).

## 4. Spojte je prvkem {#_4-connect-them-with-an-element}

1. Otevřete záložku **Prvky** a klikněte na první tlačítko **Přidat prvek**.
2. Zvolte **Počáteční uzel** `1` a **Koncový uzel** `2`. Váš materiál a průřez jsou už předvybrané. Klikněte na **Přidat prvek**.

![Přidat prvek: dva koncové uzly, volitelné koncové klouby, materiál a průřez](/screenshots/cs/qs-element.webp){.shot-md}

Mezi uzly se objeví čára. Stiskněte <kbd>F</kbd>, aby se konstrukce přizpůsobila obrazovce.

## 5. Přidejte podpory {#_5-add-the-supports}

V záložce **Uzly** má sloupec **Podepřené stupně volnosti** u každého uzlu výběr značky podpory a tři zaškrtávací políčka: `Dx`, `Dz`, `Ry`.

- Uzel `1`: vyberte značku **Kloub**, nebo zaškrtněte **Dx** a **Dz**.
- Uzel `2`: vyberte **Posuvný kloub**, nebo zaškrtněte pouze **Dz**.

![Podpory v tabulce Uzly: uzel 1 kloubově podepřený, uzel 2 na posuvném kloubu](/screenshots/cs/qs-supports.webp)

Můžete také kliknout na uzel v zobrazení a zvolit **Podepření uzlu**. Všechny typy podpor jsou v kapitole [Uzly a podpory](/cs/essentials/nodes-supports#supports).

## 6. Přidejte zatížení {#_6-add-the-load}

1. Otevřete záložku **Zatížení** a klikněte na **Přidat prvkové zatížení**.
2. **Typ zatížení**: *Spojité rovnoměrné zatížení*. **Prvek**: `1`.
3. Zadejte `fz = 12` kN/m a ponechte `fx = 0`. Klikněte na **Přidat prvkové zatížení**.

![Dialog zobrazuje náhled zatížení na prvku](/screenshots/cs/qs-load.webp){.shot-md}

Kladné `fz` míří ve směru +z, což je na obrazovce **dolů**, takže kladná hodnota je tíhové zatížení. Viz [znaménková konvence](/cs/elements/conventions).

## 7. Odečtěte výsledky {#_7-read-the-results}

Řešení se objeví, jakmile zatížení přidáte. Panel zobrazení vpravo nahoře v zobrazení zapíná a vypíná jednotlivé průběhy. **Deformovaný tvar**, **M<sub>y</sub>(x)** a **Reakce** jsou ve výchozím stavu zapnuté. Zaškrtnutím **V<sub>z</sub>(x)** přidáte posouvající sílu.

![Posouvající síla (zeleně), ohybový moment (červeně), reakce (fialově) a deformovaný tvar](/screenshots/cs/qs-results.webp)

| Vrstva | Co byste měli vidět |
| --- | --- |
| **Reakce** | Dvě šipky vzhůru o velikosti **36 kN** v uzlech 1 a 2. |
| **V<sub>z</sub>(x)** | Přímka od **+36 kN** vlevo po **−36 kN** vpravo, procházející nulou uprostřed rozpětí. |
| **M<sub>y</sub>(x)** | Parabola s extrémem **54 kNm** uprostřed rozpětí. |
| **Deformovaný tvar** | Symetrický průhyb. Najeďte myší na uzel `1` a odečtěte jeho pootočení: **2,6469 · 10⁻² rad**. |

Čísla najdete v záložce **Výsledky** ve spodní liště. **Výsledky v uzlech** uvádějí `Dx`, `Dz`, `Ry` každého uzlu. **Výsledky na prvcích** uvádějí koncové síly každého prvku v jeho lokálním souřadném systému.

Pokud jsou průběhy příliš velké nebo malé, změňte **Měřítko výsledků** v **Nastavení → Nastavení zobrazení → Velikost**.

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

Uprostřed rozpětí není žádný uzel, takže pro odečtení průhybu tam jeden přidejte: zvolte druhé tlačítko **Přidat uzel**, klikněte na nosník v `X = 3` a vyberte **Připojit ke konstrukci**. Nosník se rozdělí na dva a `Dz` nového uzlu ve **Výsledcích** ukáže 49,86 mm. Rozdělení žádný výsledek nezmění, protože prvek je přesný.

Vše souhlasí. Další postupy ručního ověření (konzola, oboustranně vetknutý nosník, příhradovina, teplota) najdete v kapitole [Ověření výsledků ručně](/cs/guide/verification).

## 9. Experimentujte {#_9-experiment}

Tady EduBeam ukáže svou sílu. Zkuste každou z těchto úprav a sledujte, jak se průběhy mění:

- **Přetáhněte uzel 2** doprava: moment roste s $L^2$.
- **Zaškrtněte `Ry` v uzlu 1**, čímž ho vetknete: moment uprostřed rozpětí klesne a nad podporou se objeví záporný moment.
- **Zaškrtněte `Dz` v uzlu uprostřed rozpětí**, který jste právě přidali, a vznikne spojitý nosník o dvou polích.
- **Zaškrtněte koncový kloub** u prvku v záložce Prvky, čímž na jednom konci uvolníte moment.
- Stiskem <kbd>Ctrl</kbd>+<kbd>Z</kbd> vrátíte libovolný krok zpět.

## 10. Uložte nebo sdílejte {#_10-save-or-share}

- **Sdílet konstrukci** (v horní liště nebo v nabídce ☰) vám dá odkaz obsahující celý model. Vložte ho do e‑mailu, chatu nebo prezentace.
- **☰ → Uložit projekt** (<kbd>Ctrl</kbd>+<kbd>S</kbd>) stáhne soubor `project.json`, který později otevřete přes **Otevřít projekt** nebo přetažením do aplikace.
- **☰ → Exportovat obrázek** (<kbd>Ctrl</kbd>+<kbd>P</kbd>) uloží výkres jako PNG nebo SVG do zprávy.

Model se navíc uchovává v prohlížeči, takže obnovením stránky o něj nepřijdete. Viz [Import, export a sdílení](/cs/essentials/import-export).

## Kam dál {#where-next}

- [Návod: trojkloubový rám](/cs/tutorials/three-hinged-frame): rám s vnitřním kloubem, ověřený ručním výpočtem.
- [Příklady](/cs/examples/): hotové rámy a příhradoviny na jedno kliknutí.
- [Zatížení](/cs/essentials/loads): lichoběžníkové zatížení, osamělé síly, změna teploty, předepsaná posunutí.
- [Klávesnice, myš a dotyk](/cs/reference/shortcuts): rychlejší práce na plátně.
