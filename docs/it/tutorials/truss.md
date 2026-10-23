---
description: "Tutorial passo passo: costruisci in EduBeam una travatura reticolare piana e verifica gli sforzi nelle aste con il metodo dei nodi e il metodo delle sezioni. Circa 15 minuti."
---

# Tutorial: travatura reticolare piana

Questo tutorial costruisce una piccola travatura reticolare isostatica, verifica gli sforzi nelle aste con il metodo dei nodi e il metodo delle sezioni, e individua un'asta scarica. Prevedi circa 15 minuti.

![La travatura completata: sforzi normali e reazioni](/screenshots/it/tut-truss.webp)

Se vuoi solo esplorarla, [apri il modello completato](https://run.edubeam.app/?model=eyJuIjpbWyIxIixbMCwwLDBdLFswLDJdLG51bGxdLFsiMiIsWzQsMCwwXSxbXSxudWxsXSxbIjMiLFs4LDAsMF0sW10sbnVsbF0sWyI0IixbMTIsMCwwXSxbMl0sbnVsbF0sWyI1IixbNCwwLC0zXSxbXSxudWxsXSxbIjYiLFs4LDAsLTNdLFtdLG51bGxdXSwiZSI6W1siMSIsWyIxIiwiMiJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiMiIsWyIyIiwiMyJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiMyIsWyIzIiwiNCJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiNCIsWyI1IiwiNiJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiNSIsWyIxIiwiNSJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiNiIsWyIyIiwiNSJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiNyIsWyI1IiwiMyJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiOCIsWyIzIiwiNiJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiOSIsWyI2IiwiNCJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dXSwibSI6W1siMSIsNzg1MCwyMTAwMDAwMDAwMDAsODEwMDAwMDAwMDAsMC4wMDAwMTJdXSwiY3MiOltbIjEiLDAuMDAyLDAuMDAwMDAxLDAuMSwxXV0sIm5sIjpbWyIyIix7IjAiOjAsIjIiOjMwMDAwLCI0IjowfV0sWyIzIix7IjAiOjAsIjIiOjMwMDAwLCI0IjowfV1dLCJkIjpbXX0%3D&lang=it){target="_blank"}.

## Il problema {#the-problem}

![Geometria, vincoli e carichi](/screenshots/it/tut-truss-model.webp)

- Una luce di 12 m divisa in tre campi da 4 m, altezza 3 m.
- Nodi del corrente inferiore 1–4, nodi del corrente superiore 5 e 6.
- Una cerniera nel nodo 1 e un carrello nel nodo 4.
- Due carichi da 30 kN nei nodi 2 e 3 del corrente inferiore.
- Aste in acciaio con $A = 20$ cm².

| Nodo | X [m] | Z [m] | Vincolo | Carico |
| --- | --- | --- | --- | --- |
| 1 | 0 | 0 | cerniera | |
| 2 | 4 | 0 | | `Fz = 30` kN |
| 3 | 8 | 0 | | `Fz = 30` kN |
| 4 | 12 | 0 | carrello | |
| 5 | 4 | −3 | | |
| 6 | 8 | −3 | | |

Aste: corrente inferiore 1–2, 2–3, 3–4; corrente superiore 5–6; diagonali d'estremità 1–5 e 6–4; montanti 2–5 e 3–6; e la diagonale centrale 5–3.

**È isostatica?** $m + r = 9 + 3 = 12 = 2j$ con $j = 6$ nodi, quindi sì: gli sforzi nelle aste si ricavano dal solo equilibrio.

## 1. Materiale e sezione {#_1-material-and-section}

1. **Cancella struttura** (spunta *Elimina materiali* ed *Elimina sezioni*).
2. *Materiali* → **Libreria materiali** → **Steel (S235)**.
3. *Sezioni* → **Aggiungi sezione**: `Area = 0,002`, `Iy = 1e-6`, `Altezza = 0,1`, `Coefficiente di taglio = 1`. Con aste incernierate conta solo l'area.

## 2. Disegna le aste con le cerniere {#_2-draw-the-bars-with-hinges}

In EduBeam un'asta reticolare è un elemento trave con **entrambe le cerniere di estremità** spuntate. Lo strumento del mouse può impostarle per te:

1. Scheda *Elementi* → il secondo pulsante **Aggiungi elemento** (icona del cursore).
2. Nel banner in alto nella vista, spunta **Cerniera iniziale** e **Cerniera finale**. Ogni asta che disegni da ora le avrà entrambe.
3. Disegna il contorno come un'unica polilinea: fai clic in (0, 0), (4, −3), (8, −3), (12, 0), poi torna lungo il corrente inferiore: (8, 0), (4, 0), (0, 0). Premi <kbd>Esc</kbd>.
4. Disegna le aste interne una alla volta, premendo <kbd>Esc</kbd> dopo ciascuna: (4, 0) → (4, −3), (4, −3) → (8, 0), (8, 0) → (8, −3).
5. Premi <kbd>F</kbd> per adattare la vista.

Controlla la tabella *Elementi*: nove elementi, ciascuno con entrambe le *Cerniere di estremità* spuntate. I numeri dei tuoi nodi ed elementi possono essere diversi da quelli delle immagini; non importa.

## 3. Vincoli e carichi {#_3-supports-and-loads}

1. Fai clic sul nodo in (0, 0) → **Vincoli del nodo** → **Cerniera**. Fai clic sul nodo in (12, 0) → **Carrello**.
2. Fai clic sul nodo in (4, 0) → **Aggiungi carico** → `Fz = 30` kN. Fai lo stesso in (8, 0).

Un `Fz` positivo punta verso il basso. I nodi di una travatura reticolare sono liberi di ruotare; EduBeam accetta nodi in cui tutte le aste sono incernierate e ne riporta la rotazione come 0.

## 4. Risultati {#_4-results}

Nelle opzioni di visualizzazione togli la spunta a **Deformata** e **M<sub>y</sub> (x)** (in una travatura reticolare non c'è flessione) e spunta **N (x)**.

![Sforzi normali: trazione positiva](/screenshots/it/tut-truss.webp)

## 5. Verifica a mano {#_5-check-by-hand}

**Reazioni.** I carichi sono simmetrici, quindi $R_1 = R_4 = 30$ kN verso l'alto, e la reazione orizzontale della cerniera è nulla.

**Nodo 1** (metodo dei nodi). La diagonale d'estremità 1–5 è lunga 5 m ($\sin\alpha = 3/5$, $\cos\alpha = 4/5$):

$$\sum F_z:\ N_{15} \cdot \tfrac{3}{5} = -30 \Rightarrow N_{15} = -50\ \text{kN} \qquad \sum F_x:\ N_{12} = -N_{15} \cdot \tfrac{4}{5} = 40\ \text{kN}$$

**Nodo 2.** Il montante 2–5 è l'unica asta che può portare verso l'alto il carico di 30 kN: $N_{25} = +30$ kN, e $N_{23} = N_{12} = 40$ kN.

**Sezione nel campo centrale.** Taglia le aste 5–6, 5–3 e 2–3 e considera la parte sinistra (sezione di Ritter):

- Momenti rispetto al nodo 3: $R_1 \cdot 8 - 30 \cdot 4 + N_{56} \cdot 3 = 0 \Rightarrow N_{56} = -40$ kN.
- Forze verticali: il taglio nel campo è $R_1 - 30 = 0$, quindi la diagonale **5–3 è scarica**: $N_{53} = 0$.

| Asta | Valore a mano | EduBeam |
| --- | --- | --- |
| Corrente inferiore 1–2, 2–3, 3–4 | +40 kN (trazione) | 40 |
| Corrente superiore 5–6 | −40 kN (compressione) | −40 |
| Diagonali d'estremità 1–5, 6–4 | −50 kN | −50 |
| Montanti 2–5, 3–6 | +30 kN | 30 |
| Diagonale centrale 5–3 | 0 | 0 |

L'abbassamento del nodo 2 è 2,29 mm (*Risultati → Risultati nodali*). Per esercizio, calcolalo con il principio dei lavori virtuali, $\delta = \sum N n L / (EA)$.

## 6. Sperimenta {#_6-experiment}

- **Sposta un carico.** Metti entrambi i carichi da 30 kN nel nodo 2. Ora la diagonale centrale è sollecitata: con quale segno, e perché?
- **Rimuovi la diagonale centrale.** La travatura diventa un meccanismo; EduBeam cerchia le cerniere responsabili e mostra come il campo si deforma a taglio.
- **Togli la spunta a tutte le cerniere.** La travatura diventa un telaio con nodi rigidi. Spunta **M<sub>y</sub> (x)**: i momenti flettenti sono minimi rispetto agli sforzi normali, ed è per questo che l'idealizzazione a nodi incernierati funziona.
- **Usa una cerniera in entrambi i vincoli.** Una reazione in più la rende iperstatica, e gli sforzi nel corrente inferiore dipendono ora dalle aree delle aste.
