# Návod: rovinná příhradová konstrukce

V tomto návodu sestavíte malou staticky určitou příhradovou konstrukci, ověříte síly v prutech metodou styčných bodů a průsečnou metodou a najdete nulový prut. Počítejte asi s 15 minutami.

![Hotová příhradová konstrukce: normálové síly a reakce](/screenshots/cs/tut-truss.webp)

Chcete si model jen prohlédnout? [Otevřete hotový model](https://run.edubeam.app/?model=eyJuIjpbWyIxIixbMCwwLDBdLFswLDJdLG51bGxdLFsiMiIsWzQsMCwwXSxbXSxudWxsXSxbIjMiLFs4LDAsMF0sW10sbnVsbF0sWyI0IixbMTIsMCwwXSxbMl0sbnVsbF0sWyI1IixbNCwwLC0zXSxbXSxudWxsXSxbIjYiLFs4LDAsLTNdLFtdLG51bGxdXSwiZSI6W1siMSIsWyIxIiwiMiJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiMiIsWyIyIiwiMyJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiMyIsWyIzIiwiNCJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiNCIsWyI1IiwiNiJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiNSIsWyIxIiwiNSJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiNiIsWyIyIiwiNSJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiNyIsWyI1IiwiMyJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiOCIsWyIzIiwiNiJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiOSIsWyI2IiwiNCJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dXSwibSI6W1siMSIsNzg1MCwyMTAwMDAwMDAwMDAsODEwMDAwMDAwMDAsMC4wMDAwMTJdXSwiY3MiOltbIjEiLDAuMDAyLDAuMDAwMDAxLDAuMSwxXV0sIm5sIjpbWyIyIix7IjAiOjAsIjIiOjMwMDAwLCI0IjowfV0sWyIzIix7IjAiOjAsIjIiOjMwMDAwLCI0IjowfV1dLCJkIjpbXX0%3D&lang=cs){target="_blank"}.

## Zadání {#the-problem}

![Geometrie, podpory a zatížení](/screenshots/cs/tut-truss-model.webp)

- Rozpětí 12 m rozdělené na tři pole po 4 m, výška 3 m.
- Uzly dolního pásu 1–4, uzly horního pásu 5 a 6.
- Pevný kloub v uzlu 1, posuvný kloub v uzlu 4.
- Dvě síly po 30 kN v uzlech 2 a 3 dolního pásu.
- Ocelové pruty o ploše $A = 20$ cm².

| Uzel | X [m] | Z [m] | Podpora | Zatížení |
| --- | --- | --- | --- | --- |
| 1 | 0 | 0 | kloub | |
| 2 | 4 | 0 | | `Fz = 30` kN |
| 3 | 8 | 0 | | `Fz = 30` kN |
| 4 | 12 | 0 | posuvný kloub | |
| 5 | 4 | −3 | | |
| 6 | 8 | −3 | | |

Pruty: dolní pás 1–2, 2–3, 3–4; horní pás 5–6; krajní diagonály 1–5 a 6–4; svislice 2–5 a 3–6; prostřední diagonála 5–3.

**Je konstrukce staticky určitá?** Při $j = 6$ styčnících platí $m + r = 9 + 3 = 12 = 2j$, takže ano: síly v prutech plynou jen z podmínek rovnováhy.

## 1. Materiál a průřez {#_1-material-and-section}

1. **Smazat konstrukci** (zaškrtněte *Smazat materiály* a *Smazat průřezy*).
2. *Materiály* → **Knihovna materiálů** → **Steel (S235)**.
3. *Průřezy* → **Přidat průřez**: `Plocha = 0,002`, `Iy = 1e-6`, `Výška = 0,1`, `Smykový součinitel = 1`. U prutů s klouby na obou koncích záleží jen na ploše.

## 2. Nakreslete pruty s klouby {#_2-draw-the-bars-with-hinges}

Příhradový prut je v EduBeamu nosníkový prvek se zaškrtnutými **oběma koncovými klouby**. Nástroj pro kreslení myší je nastaví za vás:

1. Záložka *Prvky* → druhé tlačítko **Přidat prvek** (ikona kurzoru).
2. V liště v horní části zobrazení zaškrtněte **Kloub na začátku** a **Kloub na konci**. Každý nově nakreslený prut bude mít oba klouby.
3. Obrys nakreslete jako jednu lomenou čáru: klikněte do bodů (0, 0), (4, −3), (8, −3), (12, 0) a pak zpět po dolním pásu: (8, 0), (4, 0), (0, 0). Stiskněte <kbd>Esc</kbd>.
4. Vnitřní pruty kreslete po jednom a po každém stiskněte <kbd>Esc</kbd>: (4, 0) → (4, −3), (4, −3) → (8, 0), (8, 0) → (8, −3).
5. Klávesou <kbd>F</kbd> přizpůsobíte zobrazení.

Zkontrolujte tabulku *Prvky*: musí v ní být devět prvků, všechny se zaškrtnutými oběma *Koncovými klouby*. Čísla uzlů a prvků se mohou od obrázků lišit, na tom nezáleží.

## 3. Podpory a zatížení {#_3-supports-and-loads}

1. Klikněte na uzel v (0, 0) → **Podepření uzlu** → **Kloub**. Pak klikněte na uzel v (12, 0) → **Posuvný kloub**.
2. Klikněte na uzel v (4, 0) → **Přidat zatížení** → `Fz = 30` kN. Totéž zopakujte v (8, 0).

Kladné `Fz` míří dolů. Styčníky příhradové konstrukce se mohou volně pootáčet. EduBeam proto uzly, ve kterých jsou všechny pruty připojené kloubově, přijme a jejich pootočení vypíše jako 0.

## 4. Výsledky {#_4-results}

V možnostech zobrazení vypněte **Deformovaný tvar** a **M<sub>y</sub> (x)** (v příhradové konstrukci ohyb nevzniká) a zaškrtněte **N (x)**.

![Normálové síly: tah kladný](/screenshots/cs/tut-truss.webp)

## 5. Ověřte ručně {#_5-check-by-hand}

**Reakce.** Zatížení je symetrické, takže $R_1 = R_4 = 30$ kN (vzhůru) a vodorovná reakce v pevném kloubu je nulová.

**Styčník 1** (metoda styčných bodů). Krajní diagonála 1–5 má délku 5 m ($\sin\alpha = 3/5$, $\cos\alpha = 4/5$):

$$\sum F_z:\ N_{15} \cdot \tfrac{3}{5} = -30 \Rightarrow N_{15} = -50\ \text{kN} \qquad \sum F_x:\ N_{12} = -N_{15} \cdot \tfrac{4}{5} = 40\ \text{kN}$$

**Styčník 2.** Zatížení 30 kN může nahoru přenést jedině svislice 2–5: $N_{25} = +30$ kN a $N_{23} = N_{12} = 40$ kN.

**Řez prostředním polem.** Veďte řez pruty 5–6, 5–3 a 2–3 a uvažujte levou část:

- Momentová podmínka k uzlu 3: $R_1 \cdot 8 - 30 \cdot 4 + N_{56} \cdot 3 = 0 \Rightarrow N_{56} = -40$ kN.
- Svislé síly: posouvající síla v poli je $R_1 - 30 = 0$, takže diagonála **5–3 je nulový prut**: $N_{53} = 0$.

| Prut | Ručně | EduBeam |
| --- | --- | --- |
| Dolní pás 1–2, 2–3, 3–4 | +40 kN (tah) | 40 |
| Horní pás 5–6 | −40 kN (tlak) | −40 |
| Krajní diagonály 1–5, 6–4 | −50 kN | −50 |
| Svislice 2–5, 3–6 | +30 kN | 30 |
| Prostřední diagonála 5–3 | 0 | 0 |

Průhyb uzlu 2 je 2,29 mm (*Výsledky → Výsledky v uzlech*). Jako cvičení ho spočítejte principem virtuálních prací, $\delta = \sum N n L / (EA)$.

## 6. Experimentujte {#_6-experiment}

- **Přesuňte jednu sílu.** Umístěte obě síly 30 kN do uzlu 2. Prostřední diagonála teď přenáší sílu: s jakým znaménkem a proč?
- **Odstraňte prostřední diagonálu.** Z příhradové konstrukce se stane mechanismus; EduBeam zakroužkuje klouby, které ho způsobují, a ukáže, jak se pole zkosí.
- **Zrušte všechny klouby.** Z příhradové konstrukce se stane rám s tuhými styčníky. Zaškrtněte **M<sub>y</sub> (x)**: ohybové momenty jsou ve srovnání s normálovými silami nepatrné, a proto idealizace kloubových styčníků funguje.
- **Dejte do obou podpor pevný kloub.** Jedna reakce navíc udělá z konstrukce staticky neurčitou a síly v dolním pásu pak závisejí na plochách prutů.
