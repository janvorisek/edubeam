# Souřadný systém a znaménková konvence

Většina „špatných“ výsledků v <Edubeam /> je ve skutečnosti překvapení ze znaménkové konvence. Vše níže je přesně to, co řešič skutečně používá.

## Globální osy {#global-axes}

- **x** – vodorovná, kladná **doprava**.
- **z** – svislá, kladná na obrazovce **dolů**.
- **y** – osa kolmá na rovinu konstrukce (u pravotočivého systému míří k pozorovateli). Pootočení a momenty jsou kolem osy y.

Ukazatel os v rohu mřížky zobrazuje x (červeně) a z (zeleně). Uzel na vrcholu sloupu výšky 3 m má tedy `Z = −3`, je-li pata v `Z = 0`.

## Stupně volnosti {#degrees-of-freedom}

Každý uzel má `Dx`, `Dz` (posunutí) a `Ry` (pootočení). Kladné `Dz` je posunutí dolů; kladné `Ry` je pootočení na obrazovce **proti směru hodinových ručiček**. Stejná znaménka platí pro předepsaná posunutí i pro výsledky v uzlech.

## Zatížení {#loads}

| Zatížení | Kladný směr |
| --- | --- |
| `Fx`, `fx`, `f1x`… | +x (doprava; nebo podél lokální osy x prvku při zapnutém LCS) |
| `Fz`, `fz`, `f1z`… | +z (**dolů**; nebo podél lokální osy z při zapnutém LCS) |
| `My` | proti směru hodinových ručiček na obrazovce |
| `ΔTs` | oteplení (prodloužení) |
| `ΔTd − ΔTh` | dolní vlákna teplejší než horní |

Tíhové zatížení je tedy **kladné** `fz` a vítr tlačící levý sloup doprava je kladné `fx`.

## Lokální osy prvku {#element-local-axes}

Lokální **x** vede od počátečního ke koncovému uzlu; lokální **z** je k ní kolmá a vznikne pootočením globálních os o úhel prvku $\alpha$. U vodorovného prvku nakresleného zleva doprava lokální a globální osy splývají. Směr prvku obrátíte tlačítkem **Přehodit pořadí uzlů** v tabulce *Prvky*.

## Vnitřní síly {#internal-forces}

| Veličina | Kladná znamená |
| --- | --- |
| **N** | tah |
| **V<sub>z</sub>** | obvyklé znaménko teorie nosníků: u prostého nosníku s tíhovým zatížením je V kladná u levé podpory a záporná u pravé |
| **M<sub>y</sub>** | **tah v dolních (+z) vláknech**. Prostý nosník s tíhovým zatížením má uprostřed rozpětí kladný moment; konzola se silou na konci má ve vetknutí záporný moment (tah nahoře) |

## Koncové síly (tabulka Výsledky na prvcích) {#end-forces-element-results-table}

`X12, Z12, M12` působí na prvek v jeho počátečním uzlu, `X21, Z21, M21` v jeho koncovém uzlu, v **lokálním** systému, se stejnými kladnými směry jako lokální osy a `My`. Jsou to síly, kterými uzly působí na prvek, tj. $\mathbf{f} = \mathbf{K}_l\,\mathbf{u}_l - \mathbf{f}_{eq}$, kde $\mathbf{f}_{eq}$ jsou ekvivalentní uzlová zatížení od prvkových zatížení. Součet koncových sil všech prvků scházejících se v uzlu je v rovnováze s uzlovými zatíženími a reakcemi v tomto uzlu.

## Reakce {#reactions}

Reakce existuje pro každý podepřený stupeň volnosti a uvádí se v souřadném systému uzlu (pootočeném o úhel pootočení systému souřadnic uzlu, je-li zadán). Šipky reakcí v zobrazení míří ve směru, kterým podpora působí na konstrukci.

## Osy s y nahoru {#y-up-axes}

**Nastavení → Souřadnicový systém → x doprava, y nahoru** přepne vše, co zadáváte a čtete, do učebnicového systému: **x** doprava, **y** nahoru a **z** k pozorovateli. Model, uložené soubory i výkresy zůstávají stejné; mění se jen čísla a názvy:

| Veličina | z dolů (výchozí) | y nahoru |
| --- | --- | --- |
| Svislá souřadnice | `Z` | `Y`, opačné znaménko |
| Svislá zatížení, posunutí, reakce, koncové síly | `Fz`, `fz`, `Dz`, `Z12`… | `Fy`, `fy`, `Dy`, `Y12`…, opačné znaménko |
| Pootočení a momenty | `Ry`, `My` | `Rz`, `Mz`, stejné znaménko (kladné proti směru hodinových ručiček) |
| Úhel podpory α | měřen po směru hodinových ručiček | měřen proti směru hodinových ručiček, opačné znaménko |
| Vnitřní síly N, V, M | | beze změny, průběhy se kreslí stejně |

Tíhové zatížení je tedy **záporné** `fy` a vrchol 3 m vysokého sloupu má `Y = 3`.

## Jednotky {#units}

Řešič interně pracuje v SI (m, N, Pa, rad, K). Zobrazované jednotky ovlivňují jen to, co zadáváte a čtete; jejich změna model nikdy nezmění.
