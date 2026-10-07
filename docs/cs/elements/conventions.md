# Souřadný systém a znaménková konvence

Za většinou „špatných“ výsledků v EduBeamu stojí ve skutečnosti nečekaná znaménková konvence. Vše, co je popsáno níže, přesně odpovídá tomu, co používá řešič.

## Globální osy {#global-axes}

- **x** – vodorovná osa, kladný směr **doprava**.
- **z** – svislá osa, kladný směr na obrazovce **dolů**.
- **y** – osa kolmá k rovině konstrukce (v pravotočivém systému míří k pozorovateli). Kolem osy y se měří pootočení i momenty.

Ukazatel os v rohu mřížky zobrazuje x (červeně) a z (zeleně). Když je pata sloupu vysokého 3 m v `Z = 0`, má uzel na jeho hlavě `Z = −3`.

## Stupně volnosti {#degrees-of-freedom}

Každý uzel má `Dx`, `Dz` (posunutí) a `Ry` (pootočení). Kladné `Dz` je posunutí dolů, kladné `Ry` je pootočení na obrazovce **proti směru hodinových ručiček**. Stejná znaménka platí pro předepsaná posunutí i výsledky v uzlech.

## Zatížení {#loads}

| Zatížení | Kladný směr |
| --- | --- |
| `Fx`, `fx`, `f1x`… | +x (doprava; nebo podél lokální osy x prvku při zapnutém LCS) |
| `Fz`, `fz`, `f1z`… | +z (**dolů**; nebo podél lokální osy z při zapnutém LCS) |
| `My` | proti směru hodinových ručiček na obrazovce |
| `ΔTs` | oteplení (prodloužení) |
| `ΔTd − ΔTh` | dolní vlákna teplejší než horní |

Tíhové zatížení je tedy **kladné** `fz` a vítr, který tlačí levý sloup doprava, je kladné `fx`.

## Lokální osy prvku {#element-local-axes}

Lokální osa **x** vede od počátečního ke koncovému uzlu, lokální osa **z** je k ní kolmá; obě vzniknou pootočením globálních os o úhel prvku $\alpha$. U vodorovného prvku nakresleného zleva doprava lokální a globální osy splývají. Orientaci prvku obrátíte tlačítkem **Přehodit pořadí uzlů** v tabulce *Prvky*.

## Vnitřní síly {#internal-forces}

| Veličina | Kladná znamená |
| --- | --- |
| **N** | tah |
| **V<sub>z</sub>** | obvyklá konvence stavební mechaniky: u prostého nosníku s tíhovým zatížením je V u levé podpory kladná a u pravé záporná |
| **M<sub>y</sub>** | **tah v dolních (+z) vláknech**. Prostý nosník s tíhovým zatížením má uprostřed rozpětí kladný moment, konzola se silou na volném konci má ve vetknutí moment záporný (tah nahoře) |

## Koncové síly (tabulka Výsledky na prvcích) {#end-forces-element-results-table}

`X12, Z12, M12` působí na prvek v jeho počátečním uzlu, `X21, Z21, M21` v koncovém uzlu. Jsou vyjádřené v **lokálním** systému a jejich kladné směry odpovídají lokálním osám a `My`. Jde o síly, kterými uzly působí na prvek, tj. $\mathbf{f} = \mathbf{K}_l\,\mathbf{u}_l - \mathbf{f}_{eq}$, kde $\mathbf{f}_{eq}$ jsou ekvivalentní uzlová zatížení od prvkových zatížení. Koncové síly všech prvků, které se v uzlu stýkají, jsou v rovnováze s uzlovým zatížením a reakcemi v tomto uzlu.

## Reakce {#reactions}

Každý podepřený stupeň volnosti má svou reakci. Uvádí se v souřadném systému uzlu, který může být pootočený, pokud jste zadali pootočení systému souřadnic uzlu. Šipky reakcí v zobrazení míří ve směru, kterým podpora působí na konstrukci.

## Osy s y nahoru {#y-up-axes}

**Nastavení → Souřadnicový systém → x doprava, y nahoru** přepne vše, co zadáváte a odečítáte, do učebnicového systému: **x** doprava, **y** nahoru a **z** k pozorovateli. Model, uložené soubory i výkresy se nemění, mění se jen čísla a názvy:

| Veličina | z dolů (výchozí) | y nahoru |
| --- | --- | --- |
| Svislá souřadnice | `Z` | `Y`, opačné znaménko |
| Svislá zatížení, posunutí, reakce, koncové síly | `Fz`, `fz`, `Dz`, `Z12`… | `Fy`, `fy`, `Dy`, `Y12`…, opačné znaménko |
| Pootočení a momenty | `Ry`, `My` | `Rz`, `Mz`, stejné znaménko (kladné proti směru hodinových ručiček) |
| Úhel podpory α | měřen po směru hodinových ručiček | měřen proti směru hodinových ručiček, opačné znaménko |
| Vnitřní síly N, V, M | | beze změny, průběhy se kreslí stejně |

Tíhové zatížení je tedy **záporné** `fy` a hlava sloupu vysokého 3 m má `Y = 3`.

## Jednotky {#units}

Řešič interně pracuje v SI (m, N, Pa, rad, K). Zobrazované jednotky ovlivňují jen to, co zadáváte a odečítáte; jejich změnou se model nikdy nezmění.
