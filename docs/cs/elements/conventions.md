# Souřadný systém a znaménková konvence

Většina „špatných“ výsledků v <Edubeam /> je ve skutečnosti překvapení ze znaménkové konvence. Níže je přesně to, co řešič používá.

## Globální osy

- **x** – vodorovná, kladná **doprava**.
- **z** – svislá, kladná **dolů** po obrazovce.
- **y** – osa kolmá na rovinu konstrukce (u pravotočivého systému míří k pozorovateli). Pootočení a momenty jsou kolem osy y.

Ukazatel os v rohu mřížky zobrazuje x (červeně) a z (zeleně). Uzel na vrcholu sloupu výšky 3 m má tedy `Z = −3`, je-li pata v `Z = 0`.

## Stupně volnosti

Každý uzel má `Dx`, `Dz` (posunutí) a `Ry` (pootočení). Kladné `Dz` je posunutí dolů; kladné `Ry` je pootočení **proti směru hodinových ručiček** na obrazovce. Stejná znaménka platí pro předepsaná posunutí i pro výsledky v uzlech.

## Zatížení

| Zatížení | Kladný směr |
| --- | --- |
| `Fx`, `fx`, `f1x`… | +x (doprava; nebo lokální x prvku při zapnutém LCS) |
| `Fz`, `fz`, `f1z`… | +z (**dolů**; nebo lokální z při zapnutém LCS) |
| `My` | proti směru hodinových ručiček na obrazovce |
| `ΔTs` | oteplení (prodloužení) |
| `ΔTd − ΔTh` | dolní vlákna teplejší než horní |

Tíhové zatížení je tedy **kladné** `fz` a vítr tlačící levý sloup doprava je kladné `fx`.

## Lokální osy prvku

Lokální **x** vede od počátečního ke koncovému uzlu; lokální **z** je k ní kolmá a vznikne pootočením globálních os o úhel prvku $\alpha$. U vodorovného prvku kresleného zleva doprava lokální a globální osy splývají. Orientaci otočíte tlačítkem **Přehodit pořadí uzlů** v tabulce *Prvky*.

## Vnitřní síly

| Veličina | Kladná znamená |
| --- | --- |
| **N** | tah |
| **V<sub>z</sub>** | obvyklá konvence teorie nosníků: u prostého nosníku s tíhovým zatížením je V kladná u levé podpory a záporná u pravé |
| **M<sub>y</sub>** | **tah v dolních (+z) vláknech**. Prostý nosník s tíhovým zatížením má uprostřed kladný moment; konzola se silou na konci má ve vetknutí záporný moment |

## Koncové síly (tabulka Výsledky na prvcích)

`X12, Z12, M12` působí na prvek v jeho počátečním uzlu, `X21, Z21, M21` v koncovém uzlu, v **lokálním** systému, se stejnými kladnými směry jako lokální osy a `My`. Jsou to síly, kterými uzly působí na prvek, tj. $\mathbf{f} = \mathbf{K}_l\,\mathbf{u}_l - \mathbf{f}_{eq}$, kde $\mathbf{f}_{eq}$ je ekvivalentní uzlové zatížení od prvkových zatížení. Součet koncových sil všech prvků scházejících se v uzlu je v rovnováze s uzlovým zatížením a reakcemi.

## Reakce

Reakce existuje pro každý odebraný stupeň volnosti a uvádí se v souřadném systému uzlu (pootočeném o úhel LSS uzlu, je-li zadán). Šipky reakcí v zobrazení míří ve směru, kterým podpora působí na konstrukci.

## Jednotky

Řešič pracuje interně v SI (m, N, Pa, rad, K). Zobrazované jednotky ovlivňují jen to, co zadáváte a čtete; jejich změna model nikdy nezmění.
