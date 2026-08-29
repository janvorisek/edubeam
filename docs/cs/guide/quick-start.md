# Rychlý start

Za zhruba deset minut vymodelujete prostý ocelový nosník se spojitým zatížením, odečtete reakce, posouvající síly a ohybové momenty a ověříte je podle učebnicových vzorců.

::: tip Pracujte souběžně
Otevřete si [run.edubeam.app](https://run.edubeam.app/?lang=cs){target="_blank"} ve druhé záložce. Pokud je už nějaký model načtený, použijte **Smazat konstrukci** (ikona koše v horní liště) – zaškrtněte *Smazat materiály* a *Smazat průřezy*, abyste začali úplně od nuly.
:::

## Zadání

<ExampleStructure />

Prostý nosník o rozpětí 6 m (vlevo pevný kloub, vpravo posuvný kloub) nese spojité rovnoměrné zatížení 12 kN/m. Materiál: ocel, $E = 210\ \text{GPa}$, $G = 81\ \text{GPa}$. Průřez IPE 200: $A = 28{,}5\ \text{cm}^2$, $I_y = 1943\ \text{cm}^4$, $h = 200\ \text{mm}$.

## 1. Zkontrolujte jednotky

Podívejte se na štítek jednotek v pravém dolním rohu zobrazení (např. `m · m² · kN · kNm · MPa`). V těchto jednotkách se zadává každá hodnota a zobrazuje každý výsledek. Výchozí jsou metry, kN, kNm a MPa – s tím počítá i tento návod. Změníte je kliknutím na štítek nebo v **Nastavení → Jazyk a prostředí**.

## 2. Přidejte materiál a průřez

Prvek nemůže existovat bez materiálu a průřezu, proto je vytvořte jako první.

1. Otevřete záložku **Materiály** ve spodní liště a klikněte na **Přidat materiál**.
2. Zadejte `E = 210000` MPa, `G = 81000` MPa, hustotu ponechte a `α = 0,000012` 1/K. Potvrďte **Přidat materiál**.
   *(Nebo klikněte na **Knihovna materiálů** a vyberte **Steel (S235)** – má přesně tyto hodnoty.)*
3. Otevřete záložku **Průřezy** a klikněte na **Přidat průřez**.
4. Zadejte `Plocha = 0,00285` m², `Iy = 1,943e-5` m⁴, `Výška = 0,2` m, `Smykový součinitel = 1`. Potvrďte **Přidat průřez**.

::: details K čemu je smykový součinitel?
EduBeam používá Timoshenkův nosníkový prvek, který zahrnuje vliv smykové deformace. `k` je smykový součinitel ($k \approx 0{,}83$ pro obdélník, $\approx 0{,}4$–$0{,}5$ pro stojinu I‑profilu, je‑li $A$ plná plocha). Volba `k = 1` s plnou plochou smykovou poddajnost mírně *podceňuje*; u štíhlého nosníku jako je tento je rozdíl v průhybu hluboko pod 1 %. Vzorec najdete na stránce [teorie nosníku](/cs/elements/beam).
:::

## 3. Přidejte uzly

1. Otevřete záložku **Uzly** a klikněte na **Přidat uzel**. Zadejte `X = 0`, `Z = 0` a potvrďte. Uzel dostane označení `1`.
2. Znovu **Přidat uzel** s `X = 6`, `Z = 0`. To je uzel `2`.

Uzly lze umisťovat i myší: zvolte **Přidat myší** (nebo klikněte pravým tlačítkem na plátno → *Přidat uzel* se stisknutým <kbd>Ctrl</kbd>) a klikněte do mřížky. Se zapnutým **Přichytávat k mřížce** (<kbd>S</kbd>) padnou kliknutí na krok 0,1 m.

## 4. Spojte je prvkem

1. Otevřete záložku **Prvky** a klikněte na **Přidat prvek**.
2. Zvolte **Počáteční uzel** `1`, **Koncový uzel** `2`. Materiál a průřez, které jste vytvořili, jsou předvybrané. Potvrďte.

Mezi uzly se objeví černá čára. Stiskněte <kbd>F</kbd>, aby se konstrukce přizpůsobila obrazovce.

## 5. Přidejte podpory

V záložce **Uzly** má sloupec **Podepřené stupně volnosti** u každého uzlu tři zaškrtávací políčka: `Dx`, `Dz`, `Ry`.

- Uzel `1`: zaškrtněte **Dx** a **Dz** → objeví se značka pevného kloubu.
- Uzel `2`: zaškrtněte pouze **Dz** → posuvný kloub.

Stejná políčka najdete po kliknutí na uzel v zobrazení pod položkou **Podepření uzlu**. Všechny typy podpor jsou v kapitole [Uzly a podpory](/cs/essentials/nodes-supports).

## 6. Přidejte zatížení

1. Otevřete záložku **Zatížení** a klikněte na **Přidat prvkové zatížení**.
2. **Typ zatížení**: *Spojité rovnoměrné zatížení*. **Prvek**: `1`.
3. Zadejte `fz = 12` kN/m, `fx = 0` ponechte. Potvrďte.

Kladné `fz` míří ve směru +z, což je na obrazovce **dolů** – kladná hodnota je tedy zatížení tíhového typu. Viz [znaménková konvence](/cs/elements/conventions).

## 7. Odečtěte výsledky

Řešení se objeví ihned po přidání zatížení. Otevřete panel nastavení zobrazení (ozubené kolo vpravo nahoře v zobrazení) a zapínejte/vypínejte jednotlivé vrstvy:

| Vrstva | Co byste měli vidět |
| --- | --- |
| **Reakce** | Dvě šipky vzhůru o velikosti **36 kN** v uzlech 1 a 2. |
| **V<sub>z</sub> (x)** | Přímka od **+36 kN** vlevo po **−36 kN** vpravo, procházející nulou uprostřed rozpětí. |
| **M<sub>y</sub> (x)** | Parabola s extrémem **54 kNm** uprostřed rozpětí. |
| **Deformovaný tvar** | Symetrický průhyb. Najeďte myší na uzel `1` a odečtěte pootočení: přibližně **0,0265 rad**. |

Záložka **Výsledky** ve spodní liště poskytuje čísla: **Výsledky v uzlech** obsahují `Dx`, `Dz`, `Ry` každého uzlu, **Výsledky na prvcích** koncové síly každého prvku v jeho lokálním souřadném systému.

Pokud jsou průběhy příliš velké nebo malé, posuňte jezdec **Měřítko výsledků** v **Nastavení → Nastavení zobrazení → Velikost**.

## 8. Ověřte ručně

| Veličina | Vzorec | Ručně | EduBeam |
| --- | --- | --- | --- |
| Reakce | $R = qL/2$ | 36 kN | 36 kN |
| Max. posouvající síla | $V = qL/2$ | 36 kN | 36 kN |
| Max. ohybový moment | $M = qL^2/8$ | 54 kNm | 54 kNm |
| Pootočení v podpoře | $\varphi = qL^3/(24EI)$ | 0,02647 rad | 0,02647 rad |
| Průhyb uprostřed | $w = 5qL^4/(384EI)$ | 49,6 mm | 49,6 mm |

Vše souhlasí. Další postupy ručního ověření (konzola, oboustranně vetknutý nosník, příhradovina) najdete v kapitole [Ověření výsledků ručně](/cs/guide/verification).

## 9. Experimentujte

Tady EduBeam ukáže svou sílu. Zkuste každou z těchto úprav a sledujte, jak se průběhy mění:

- **Přetáhněte uzel 2** doprava: moment roste s $L^2$.
- **Zaškrtněte `Ry` v uzlu 1** – vznikne vetknutí: moment uprostřed klesne, nad podporou se objeví záporný (nadpodporový) moment.
- **Přidejte třetí uzel** v `X = 3` kliknutím na nosník v režimu *Přidat myší* – zvolte **Připojit ke konstrukci**, aby se prut rozdělil – a zaškrtněte jeho `Dz`. Vznikne spojitý nosník o dvou polích.
- **Zaškrtněte koncový kloub** u prvku v záložce Prvky, aby se na jeho konci uvolnil moment.
- <kbd>Ctrl</kbd>+<kbd>Z</kbd> vrátí libovolný krok zpět.

## 10. Uložte nebo sdílejte

- **Sdílet konstrukci** (horní lišta) vytvoří adresu URL obsahující celý model – vložte ji do e‑mailu, chatu nebo prezentace.
- **Uložit projekt** (nabídka ☰ nebo <kbd>Ctrl</kbd>+<kbd>S</kbd>) stáhne soubor `project.json`, který později otevřete přes **Otevřít projekt** nebo přetažením do aplikace.

Model se zároveň ukládá do místního úložiště prohlížeče, takže obnovení stránky o něj nepřijdete. Viz [Import, export a sdílení](/cs/essentials/import-export).

## Kam dál

- [Příklady](/cs/examples/) – hotové rámy a příhradoviny na jedno kliknutí.
- [Zatížení](/cs/essentials/loads) – lineárně proměnné zatížení, osamělé síly, změna teploty, předepsaná posunutí.
- [Klávesnice a myš](/cs/reference/shortcuts) – rychlejší práce na plátně.
