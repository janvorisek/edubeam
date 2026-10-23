---
description: "Convenzioni dei segni di EduBeam: assi globali x verso destra e z verso il basso, spostamenti, rotazioni e carichi positivi, assi locali dell'elemento, sollecitazioni e reazioni."
---

# Sistema di coordinate e convenzioni dei segni

La maggior parte dei risultati «sbagliati» in <Edubeam /> è in realtà una sorpresa legata alla convenzione dei segni. Tutto ciò che segue è esattamente quello che usa il solutore.

## Assi globali {#global-axes}

- **x** — orizzontale, positivo verso **destra**.
- **z** — verticale, positivo **verso il basso** sullo schermo.
- **y** — l'asse fuori dal piano (punta verso chi guarda, per un sistema destrorso). Rotazioni e momenti sono attorno a y.

L'indicatore degli assi nell'angolo della griglia mostra x (rosso) e z (verde). Il nodo in sommità di una colonna di 3 m ha quindi `Z = −3` se la base è a `Z = 0`.

## Gradi di libertà {#degrees-of-freedom}

Ogni nodo ha `Dx`, `Dz` (traslazioni) e `Ry` (rotazione). Un `Dz` positivo è uno spostamento verso il basso; un `Ry` positivo è una rotazione **antioraria** sullo schermo. Gli stessi segni valgono per gli spostamenti imposti e per i risultati nodali riportati.

## Carichi {#loads}

| Carico | Verso positivo |
| --- | --- |
| `Fx`, `fx`, `f1x`… | +x (destra; oppure lungo l'asse x locale dell'elemento con LCS attivo) |
| `Fz`, `fz`, `f1z`… | +z (**verso il basso**; oppure lungo l'asse z locale con LCS attivo) |
| `My` | antiorario sullo schermo |
| `ΔTc` | riscaldamento (allungamento) |
| `ΔTb − ΔTt` | fibra inferiore più calda di quella superiore |

Un carico gravitazionale è quindi un `fz` **positivo**, e un carico da vento che spinge una colonna sinistra verso destra è un `fx` positivo.

## Assi locali dell'elemento {#element-local-axes}

L'asse **x** locale va dal nodo iniziale al nodo finale; l'asse **z** locale è perpendicolare a esso, ottenuto ruotando gli assi globali dell'angolo $\alpha$ dell'elemento. Per un elemento orizzontale disegnato da sinistra a destra, assi locali e globali coincidono. Usa **Scambia nodi** nella tabella *Elementi* per invertirne il verso.

## Sollecitazioni {#internal-forces}

| Grandezza | Positivo significa |
| --- | --- |
| **N** | trazione |
| **V<sub>z</sub>** | il segno abituale della teoria delle travi: in una trave semplicemente appoggiata sotto carico gravitazionale, V è positivo all'appoggio sinistro e negativo a quello destro |
| **M<sub>y</sub>** | **fibre inferiori tese** (+z). Una trave semplicemente appoggiata sotto carico gravitazionale ha un momento positivo in mezzeria; una mensola con un carico all'estremità ha un momento negativo all'incastro |

## Forze di estremità (tabella Risultati degli elementi) {#end-forces-element-results-table}

`X12, Z12, M12` agiscono sull'elemento nel suo nodo iniziale, `X21, Z21, M21` nel suo nodo finale, nel sistema **locale**, con gli stessi versi positivi degli assi locali e di `My`. Sono le forze che i nodi esercitano sull'elemento, cioè $\mathbf{f} = \mathbf{K}_l\,\mathbf{u}_l - \mathbf{f}_{eq}$, dove $\mathbf{f}_{eq}$ sono i carichi nodali equivalenti dei carichi sull'elemento. La somma delle forze di estremità di tutti gli elementi che concorrono in un nodo equilibra i carichi nodali e le reazioni in quel nodo.

## Reazioni {#reactions}

Esiste una reazione per ogni GdL vincolato, riportata nel sistema di coordinate del nodo (ruotato dell'angolo LCS nodale, se impostato). Le frecce delle reazioni nella vista puntano nel verso in cui il vincolo spinge sulla struttura.

## Assi con y verso l'alto {#y-up-axes}

**Impostazioni → Sistema di coordinate → x a destra, y in alto** porta tutto ciò che digiti e leggi nel sistema dei manuali: **x** verso destra, **y** verso l'alto e **z** verso chi guarda. Il modello, i file salvati e i disegni restano gli stessi; cambiano solo numeri e nomi:

| Grandezza | z verso il basso (predefinito) | y verso l'alto |
| --- | --- | --- |
| Coordinata verticale | `Z` | `Y`, segno opposto |
| Carichi, spostamenti, reazioni e forze di estremità verticali | `Fz`, `fz`, `Dz`, `Z12`… | `Fy`, `fy`, `Dy`, `Y12`…, segno opposto |
| Rotazioni e momenti | `Ry`, `My` | `Rz`, `Mz`, stesso segno (positivo antiorario) |
| Angolo del vincolo α | misurato in senso orario | misurato in senso antiorario, segno opposto |
| Sollecitazioni N, V, M | | invariate, diagrammi disegnati allo stesso modo |

Un carico gravitazionale è quindi un `fy` **negativo**, e la sommità di una colonna di 3 m ha `Y = 3`.

## Unità {#units}

Internamente il solutore lavora in SI (m, N, Pa, rad, K). Le unità di visualizzazione influiscono solo su ciò che digiti e leggi; cambiarle non modifica mai il modello.
