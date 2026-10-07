# Návod: trojkloubový rám

Trojkloubový rám je staticky určitý: tři podmínky rovnováhy a podmínka $M = 0$ v kloubu dají všechny čtyři složky reakcí. Je to proto ideální model, na kterém lze ověřit každé číslo, které EduBeam vykreslí. Počítejte asi s 15 minutami.

![Hotový rám: ohybový moment a reakce](/screenshots/cs/tut-frame-moment.webp)

Pokud si ho chcete jen prohlédnout, [otevřete hotový model](https://run.edubeam.app/?model=eyJuIjpbWyJBIixbMCwwLDBdLFswLDJdLG51bGxdLFsiQiIsWzAsMCwtNF0sW10sbnVsbF0sWyJDIixbNCwwLC00XSxbXSxudWxsXSxbIkQiLFs4LDAsLTRdLFtdLG51bGxdLFsiRSIsWzgsMCwwXSxbMCwyXSxudWxsXV0sImUiOltbIjEiLFsiQSIsIkIiXSwiMSIsIjEiLFtmYWxzZSxmYWxzZV1dLFsiMiIsWyJCIiwiQyJdLCIxIiwiMSIsW2ZhbHNlLHRydWVdXSxbIjMiLFsiQyIsIkQiXSwiMSIsIjEiLFtmYWxzZSxmYWxzZV1dLFsiNCIsWyJEIiwiRSJdLCIxIiwiMSIsW2ZhbHNlLGZhbHNlXV1dLCJtIjpbWyIxIiw3ODUwLDIxMDAwMDAwMDAwMCw4MTAwMDAwMDAwMCwwLjAwMDAxMl1dLCJjcyI6W1siMSIsMC4wMDUzOCwwLjAwMDA4MzU2LDAuMywxXV0sImVsIjpbWyIyIixbMCwxMDAwMF0sZmFsc2VdLFsiMyIsWzAsMTAwMDBdLGZhbHNlXV0sImQiOltdfQ%3D%3D&lang=cs){target="_blank"}.

## Zadání {#the-problem}

- Dva sloupy výšky 4 m, kloubově uložené v patkách A a E, vzdálené 8 m.
- Nahoře vodorovná příčel B–D s kloubem uprostřed rozpětí v bodě C.
- Spojité rovnoměrné zatížení $q = 10$ kN/m po celé příčli.
- Ocel ($E = 210$ GPa, $G = 81$ GPa), IPE 300 ($A = 53{,}8$ cm², $I_y = 8356$ cm⁴, $h = 300$ mm).

| Uzel | X [m] | Z [m] | Podpora |
| --- | --- | --- | --- |
| A | 0 | 0 | kloub |
| B | 0 | −4 | |
| C | 4 | −4 | (kloub v příčli) |
| D | 8 | −4 | |
| E | 8 | 0 | kloub |

Pamatujte, že **z míří dolů**, takže hlavy sloupů jsou v `Z = −4`.

## 1. Materiál a průřez {#_1-material-and-section}

1. **Smazat konstrukci** (zaškrtněte *Smazat materiály* a *Smazat průřezy*).
2. *Materiály* → **Knihovna materiálů** → **Steel (S235)**.
3. *Průřezy* → **Přidat průřez**: `Plocha = 0,00538`, `Iy = 8,356e-5`, `Výška = 0,3`, `Smykový součinitel = 1`.

Průřez ovlivňuje jen posunutí. Tento rám je staticky určitý, takže jeho vnitřní síly na $E$, $A$ ani $I$ vůbec nezávisí.

## 2. Nakreslete rám {#_2-draw-the-frame}

Nejrychlejší je jedna lomená čára myší:

1. Ověřte, že je zapnuté **Přichytávat k mřížce** (přepínač **S**).
2. Záložka *Prvky* → druhé tlačítko **Přidat prvek** (ikona kurzoru).
3. Klikněte do bodu (0, 0), pak (0, −4), (4, −4), (8, −4) a (8, 0). Body najdete podle pravítek a zaměřovacího kříže. Každé kliknutí přidá uzel a spojí ho s předchozím.
4. Stiskem <kbd>Esc</kbd> kreslení ukončíte, pak stiskem <kbd>F</kbd> přizpůsobíte rám obrazovce.

Teď máte pět uzlů a čtyři prvky. Obrázky zde označují uzly A–E; pokud chcete, přejmenujte své uzly v tabulce *Uzly*, nebo ponechte 1–5. Zkontrolujte souřadnice v tabulce a opravte ty, které minuly mřížku.

## 3. Podpory a kloub {#_3-supports-and-the-hinge}

1. Klikněte na uzel A, otevřete **Podepření uzlu** a vyberte **Kloub**. Totéž udělejte pro uzel E.
2. V tabulce *Prvky* najděte prvek z B do C a zaškrtněte jeho kloub na **konci** (druhé políčko ve sloupci *Koncové klouby*).

![Tabulka Prvky: kloub je na konci prvku 2, v uzlu C](/screenshots/cs/elements-table.webp)

::: tip Jeden kloub, ne dva
Kloub na konci prvku B–C stačí: moment v C je pak nulový, protože C–D nemůže přenést moment do uzlu, který drží tuze jen on sám. Zaškrtnete-li i začátek C–D, nic se nezmění. Ale zaškrtnete-li kloub také v B, z rámu se stane mechanismus. Vyzkoušejte to: EduBeam vám ukáže, jak se pohybuje.
:::

## 4. Zatížení {#_4-load}

*Zatížení* → **Přidat prvkové zatížení** → *Spojité rovnoměrné zatížení*, prvek B–C, `fz = 10` kN/m. Totéž zopakujte pro prvek C–D. Příčel je vodorovná, takže na políčku LCS zde nezáleží.

## 5. Výsledky {#_5-results}

Možnosti zobrazení mají na začátku zapnutý deformovaný tvar, ohybový moment a reakce. Zbytek uvidíte po zaškrtnutí **N (x)** a **V<sub>z</sub> (x)**.

<div class="shots">

![Ohybový moment a reakce](/screenshots/cs/tut-frame-moment.webp)

![Normálová síla](/screenshots/cs/tut-frame-normal.webp)

![Posouvající síla](/screenshots/cs/results-shear.webp)

![Deformovaný tvar](/screenshots/cs/results-deformed.webp)

</div>

## 6. Ověřte ručně {#_6-check-by-hand}

**Svislé reakce.** Ze symetrie přebírá každá patka polovinu zatížení:

$$V_A = V_E = \frac{q \cdot 8}{2} = 40\ \text{kN}$$

**Vodorovné reakce.** Sestavte momentovou podmínku ke kloubu C pro levou polovinu rámu. Moment tam musí být nulový:

$$V_A \cdot 4 - H_A \cdot 4 - q \cdot 4 \cdot 2 = 0 \quad\Rightarrow\quad H_A = \frac{160 - 80}{4} = 20\ \text{kN}$$

Obě patky tlačí dovnitř silou 20 kN; právě tento vodorovný tlak (rozpěrná síla) dělá trojkloubový rám efektivním.

**Vnitřní síly.**

| Veličina | Vzorec | Ručně | EduBeam |
| --- | --- | --- | --- |
| Svislé reakce | $qL/2$ | 40 kN | 40 kN |
| Vodorovné reakce | z $M_C = 0$ | 20 kN | 20 kN |
| Moment v rozích B a D | $H \cdot h$ | 80 kNm, tah vně | −80 kNm |
| Moment v kloubu C | | 0 | 0 |
| Normálová síla ve sloupech | $-V_A$ | −40 kN | −40 kN |
| Normálová síla v příčli | $-H_A$ | −20 kN | −20 kN |
| Posouvající síla ve sloupech | $H_A$ | 20 kN | −20 kN (A–B), +20 kN (D–E) |
| Posouvající síla v příčli v B | $V_A$ | 40 kN | 40 kN |
| Posouvající síla v příčli v C | $V_A - 4q$ | 0 | 0 |
| Posouvající síla v příčli v D | $V_A - 8q$ | −40 kN | −40 kN |

Oba sloupy mají opačné znaménko posouvající síly, přestože přenášejí stejnou sílu, protože lokální osy každého prvku sledují jeho směr: A–B je nakreslen vzhůru a D–E dolů. Prohoďte uzly jednoho sloupu a jeho znaménko se obrátí.

V příčli platí $M(x) = -80 + 40x - 5x^2$ kNm (x od B), což je v kloubu nula a nikdy to není kladné: celá příčel je namáhána záporným momentem (tah nahoře). Posouvající síla $V(x) = 40 - 10x$ klesá na nulu přesně v C, takže extrém momentu je také v kloubu.

**Posunutí.** Kloub C poklesne o 43,1 mm (*Výsledky → Výsledky v uzlech*, `Dz` uzlu C). To je výsledek ohybu všech čtyř prutů a dobré cvičení na princip virtuálních prací.

## 7. Experimentujte {#_7-experiment}

- **Zrušte kloub** v C. Rám se stane jednou staticky neurčitým; momenty v rozích klesnou a uprostřed rozpětí se objeví kladný moment. Teď už na průřezu záleží: zkuste tužší příčel.
- **Vetkněte patky** (vyberte podporu **Vetknutí**). V A a E se objeví momenty.
- **Přidejte vodorovné zatížení**: uzlové zatížení `Fx = 10` kN v B. Rám se vodorovně posune a reakce už nejsou symetrické. Ověřte je stejnými třemi rovnicemi a podmínkou $M_C = 0$.
- **Zaškrtněte kloub i v B.** Rám je teď mechanismus a EduBeam animací ukáže, jak se může pohybovat.
