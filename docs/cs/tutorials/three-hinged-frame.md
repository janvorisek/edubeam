# Návod: trojkloubový rám

Trojkloubový rám je staticky určitý: ze tří podmínek rovnováhy a podmínky $M = 0$ v kloubu získáte všechny čtyři složky reakcí. Proto se skvěle hodí k ověření každého čísla, které EduBeam vykreslí. Počítejte asi s 15 minutami.

![Hotový rám: ohybový moment a reakce](/screenshots/cs/tut-frame-moment.webp)

Chcete si model jen prohlédnout? [Otevřete hotový model](https://run.edubeam.app/?model=eyJuIjpbWyJBIixbMCwwLDBdLFswLDJdLG51bGxdLFsiQiIsWzAsMCwtNF0sW10sbnVsbF0sWyJDIixbNCwwLC00XSxbXSxudWxsXSxbIkQiLFs4LDAsLTRdLFtdLG51bGxdLFsiRSIsWzgsMCwwXSxbMCwyXSxudWxsXV0sImUiOltbIjEiLFsiQSIsIkIiXSwiMSIsIjEiLFtmYWxzZSxmYWxzZV1dLFsiMiIsWyJCIiwiQyJdLCIxIiwiMSIsW2ZhbHNlLHRydWVdXSxbIjMiLFsiQyIsIkQiXSwiMSIsIjEiLFtmYWxzZSxmYWxzZV1dLFsiNCIsWyJEIiwiRSJdLCIxIiwiMSIsW2ZhbHNlLGZhbHNlXV1dLCJtIjpbWyIxIiw3ODUwLDIxMDAwMDAwMDAwMCw4MTAwMDAwMDAwMCwwLjAwMDAxMl1dLCJjcyI6W1siMSIsMC4wMDUzOCwwLjAwMDA4MzU2LDAuMywxXV0sImVsIjpbWyIyIixbMCwxMDAwMF0sZmFsc2VdLFsiMyIsWzAsMTAwMDBdLGZhbHNlXV0sImQiOltdfQ%3D%3D&lang=cs){target="_blank"}.

## Zadání {#the-problem}

- Dva sloupy o výšce 4 m s kloubovými patkami v bodech A a E, vzdálené od sebe 8 m.
- Nahoře vodorovná příčel B–D s kloubem uprostřed rozpětí v bodě C.
- Spojité rovnoměrné zatížení $q = 10$ kN/m po celé délce příčle.
- Ocel ($E = 210$ GPa, $G = 81$ GPa), IPE 300 ($A = 53{,}8$ cm², $I_y = 8356$ cm⁴, $h = 300$ mm).

| Uzel | X [m] | Z [m] | Podpora |
| --- | --- | --- | --- |
| A | 0 | 0 | kloub |
| B | 0 | −4 | |
| C | 4 | −4 | (kloub v příčli) |
| D | 8 | −4 | |
| E | 8 | 0 | kloub |

Pamatujte, že **osa z míří dolů**, takže hlavy sloupů leží v `Z = −4`.

## 1. Materiál a průřez {#_1-material-and-section}

1. **Smazat konstrukci** (zaškrtněte *Smazat materiály* a *Smazat průřezy*).
2. *Materiály* → **Knihovna materiálů** → **Steel (S235)**.
3. *Průřezy* → **Přidat průřez**: `Plocha = 0,00538`, `Iy = 8,356e-5`, `Výška = 0,3`, `Smykový součinitel = 1`.

Průřez ovlivňuje jen posunutí. Rám je staticky určitý, takže jeho vnitřní síly na $E$, $A$ ani $I$ vůbec nezávisejí.

## 2. Nakreslete rám {#_2-draw-the-frame}

Nejrychleji rám nakreslíte myší jako jednu lomenou čáru:

1. Ověřte, že je zapnuté **Přichytávat k mřížce** (přepínač **S**).
2. Záložka *Prvky* → druhé tlačítko **Přidat prvek** (ikona kurzoru).
3. Klikněte postupně do bodů (0, 0), (0, −4), (4, −4), (8, −4) a (8, 0). Polohu vám pomohou najít pravítka a zaměřovací kříž. Každé kliknutí přidá uzel a spojí ho s předchozím.
4. Klávesou <kbd>Esc</kbd> kreslení ukončíte a klávesou <kbd>F</kbd> přizpůsobíte zobrazení rámu.

Teď máte pět uzlů a čtyři prvky. Na obrázcích jsou uzly označené A–E; své uzly můžete v tabulce *Uzly* přejmenovat, nebo jim nechat čísla 1–5. V tabulce zkontrolujte souřadnice a opravte ty, které se nepřichytily k mřížce.

## 3. Podpory a kloub {#_3-supports-and-the-hinge}

1. Klikněte na uzel A, otevřete **Podepření uzlu** a vyberte **Kloub**. Totéž zopakujte u uzlu E.
2. V tabulce *Prvky* najděte prvek z B do C a zaškrtněte u něj kloub na **konci** (druhé políčko ve sloupci *Koncové klouby*).

![Tabulka Prvky: kloub je na konci prvku 2, v uzlu C](/screenshots/cs/elements-table.webp)

::: tip Jeden kloub, ne dva
Stačí kloub na konci prvku B–C: moment v C je pak nulový, protože C–D nemůže přenést moment do uzlu, který drží tuze jen on sám. Když zaškrtnete i začátek C–D, nic se nezmění. Když ale zaškrtnete kloub i v B, z rámu se stane mechanismus. Vyzkoušejte si to: EduBeam ukáže, jak se pohybuje.
:::

## 4. Zatížení {#_4-load}

*Zatížení* → **Přidat prvkové zatížení** → *Spojité rovnoměrné zatížení*, prvek B–C, `fz = 10` kN/m. Totéž zopakujte pro prvek C–D. Příčel je vodorovná, takže na políčku LCS tu nezáleží.

## 5. Výsledky {#_5-results}

V možnostech zobrazení jsou na začátku zapnuté deformovaný tvar, ohybový moment a reakce. Zbylé průběhy zobrazíte zaškrtnutím **N (x)** a **V<sub>z</sub> (x)**.

<div class="shots">

![Ohybový moment a reakce](/screenshots/cs/tut-frame-moment.webp)

![Normálová síla](/screenshots/cs/tut-frame-normal.webp)

![Posouvající síla](/screenshots/cs/results-shear.webp)

![Deformovaný tvar](/screenshots/cs/results-deformed.webp)

</div>

## 6. Ověřte ručně {#_6-check-by-hand}

**Svislé reakce.** Ze symetrie připadá na každou patku polovina zatížení:

$$V_A = V_E = \frac{q \cdot 8}{2} = 40\ \text{kN}$$

**Vodorovné reakce.** Napište momentovou podmínku ke kloubu C pro levou polovinu rámu. Moment v kloubu musí být nulový:

$$V_A \cdot 4 - H_A \cdot 4 - q \cdot 4 \cdot 2 = 0 \quad\Rightarrow\quad H_A = \frac{160 - 80}{4} = 20\ \text{kN}$$

Vodorovné reakce v obou patkách míří dovnitř a mají velikost 20 kN. Právě díky tomuto rozpěru je trojkloubový rám tak účinný.

**Vnitřní síly.**

| Veličina | Vzorec | Ručně | EduBeam |
| --- | --- | --- | --- |
| Svislé reakce | $qL/2$ | 40 kN | 40 kN |
| Vodorovné reakce | z $M_C = 0$ | 20 kN | 20 kN |
| Moment v rozích B a D | $H \cdot h$ | 80 kNm, tah na vnější straně | −80 kNm |
| Moment v kloubu C | | 0 | 0 |
| Normálová síla ve sloupech | $-V_A$ | −40 kN | −40 kN |
| Normálová síla v příčli | $-H_A$ | −20 kN | −20 kN |
| Posouvající síla ve sloupech | $H_A$ | 20 kN | −20 kN (A–B), +20 kN (D–E) |
| Posouvající síla v příčli v B | $V_A$ | 40 kN | 40 kN |
| Posouvající síla v příčli v C | $V_A - 4q$ | 0 | 0 |
| Posouvající síla v příčli v D | $V_A - 8q$ | −40 kN | −40 kN |

Oba sloupy mají opačné znaménko posouvající síly, přestože přenášejí stejnou sílu. Lokální osy každého prvku totiž sledují jeho směr: A–B je nakreslený nahoru, D–E dolů. Prohoďte uzly jednoho sloupu a znaménko se obrátí.

V příčli platí $M(x) = -80 + 40x - 5x^2$ kNm (x měřeno od B). Moment je v kloubu nulový a nikde není kladný: celá příčel je namáhána záporným momentem (tah nahoře). Posouvající síla $V(x) = 40 - 10x$ klesne na nulu přesně v C, takže i extrém momentu leží v kloubu.

**Posunutí.** Kloub C poklesne o 43,1 mm (*Výsledky → Výsledky v uzlech*, `Dz` uzlu C). Podílí se na něm ohyb všech čtyř prutů – dobré cvičení na princip virtuálních prací.

## 7. Experimentujte {#_7-experiment}

- **Zrušte kloub** v C. Rám bude jednou staticky neurčitý; momenty v rozích klesnou a uprostřed rozpětí se objeví kladný moment. Teď už na průřezu záleží: zkuste tužší příčel.
- **Vetkněte patky** (vyberte podporu **Vetknutí**). V A a E vzniknou momenty.
- **Přidejte vodorovné zatížení**: uzlové zatížení `Fx = 10` kN v B. Rám se vodorovně posune a reakce přestanou být symetrické. Ověřte je stejnými třemi rovnicemi a podmínkou $M_C = 0$.
- **Zaškrtněte kloub i v B.** Z rámu se stane mechanismus a EduBeam animací ukáže, jak se může pohybovat.
