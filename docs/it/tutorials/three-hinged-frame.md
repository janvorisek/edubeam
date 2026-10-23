---
description: "Tutorial passo passo: modella in EduBeam un telaio a tre cerniere con carico uniforme, poi verifica a mano reazioni e momenti flettenti. Circa 15 minuti."
---

# Tutorial: telaio a tre cerniere

Un telaio a tre cerniere è isostatico: le tre equazioni di equilibrio più la condizione $M = 0$ nella cerniera danno tutte e quattro le reazioni vincolari. Per questo è il modello perfetto per verificare ogni numero che EduBeam disegna. Prevedi circa 15 minuti.

![Il telaio completato: momento flettente e reazioni](/screenshots/it/tut-frame-moment.webp)

Se vuoi solo esplorarlo, [apri il modello completato](https://run.edubeam.app/?model=eyJuIjpbWyJBIixbMCwwLDBdLFswLDJdLG51bGxdLFsiQiIsWzAsMCwtNF0sW10sbnVsbF0sWyJDIixbNCwwLC00XSxbXSxudWxsXSxbIkQiLFs4LDAsLTRdLFtdLG51bGxdLFsiRSIsWzgsMCwwXSxbMCwyXSxudWxsXV0sImUiOltbIjEiLFsiQSIsIkIiXSwiMSIsIjEiLFtmYWxzZSxmYWxzZV1dLFsiMiIsWyJCIiwiQyJdLCIxIiwiMSIsW2ZhbHNlLHRydWVdXSxbIjMiLFsiQyIsIkQiXSwiMSIsIjEiLFtmYWxzZSxmYWxzZV1dLFsiNCIsWyJEIiwiRSJdLCIxIiwiMSIsW2ZhbHNlLGZhbHNlXV1dLCJtIjpbWyIxIiw3ODUwLDIxMDAwMDAwMDAwMCw4MTAwMDAwMDAwMCwwLjAwMDAxMl1dLCJjcyI6W1siMSIsMC4wMDUzOCwwLjAwMDA4MzU2LDAuMywxXV0sImVsIjpbWyIyIixbMCwxMDAwMF0sZmFsc2VdLFsiMyIsWzAsMTAwMDBdLGZhbHNlXV0sImQiOltdfQ%3D%3D&lang=it){target="_blank"}.

## Il problema {#the-problem}

- Due colonne di 4 m, incernierate alla base in A ed E, a 8 m di distanza.
- Una trave orizzontale B–D in sommità, con una cerniera in mezzeria in C.
- Un carico uniforme $q = 10$ kN/m su tutta la trave.
- Acciaio ($E = 210$ GPa, $G = 81$ GPa), IPE 300 ($A = 53{,}8$ cm², $I_y = 8356$ cm⁴, $h = 300$ mm).

| Nodo | X [m] | Z [m] | Vincolo |
| --- | --- | --- | --- |
| A | 0 | 0 | cerniera |
| B | 0 | −4 | |
| C | 4 | −4 | (cerniera nella trave) |
| D | 8 | −4 | |
| E | 8 | 0 | cerniera |

Ricorda che **z punta verso il basso**, quindi la sommità delle colonne è a `Z = −4`.

## 1. Materiale e sezione {#_1-material-and-section}

1. **Cancella struttura** (spunta *Elimina materiali* ed *Elimina sezioni*).
2. *Materiali* → **Libreria materiali** → **Steel (S235)**.
3. *Sezioni* → **Aggiungi sezione**: `Area = 0,00538`, `Iy = 8,356e-5`, `Altezza = 0,3`, `Coefficiente di taglio = 1`.

La sezione influisce solo sugli spostamenti. Questo telaio è isostatico, quindi le sue sollecitazioni non dipendono affatto da $E$, $A$ o $I$.

## 2. Disegna il telaio {#_2-draw-the-frame}

Il modo più rapido è una polilinea unica con il mouse:

1. Assicurati che **Snap alla griglia** sia attivo (l'indicatore **S**).
2. Scheda *Elementi* → il secondo pulsante **Aggiungi elemento** (icona del cursore).
3. Fai clic in (0, 0), poi in (0, −4), (4, −4), (8, −4) e (8, 0). Usa i righelli e il mirino per trovare i punti. Ogni clic aggiunge un nodo e lo collega al precedente.
4. Premi <kbd>Esc</kbd> per terminare, poi <kbd>F</kbd> per adattare il telaio allo schermo.

Ora hai cinque nodi e quattro elementi. Le immagini qui chiamano i nodi A–E; se vuoi, rinomina i tuoi nella tabella *Nodi*, oppure lascia 1–5. Controlla le coordinate nella tabella e correggi quelle che non sono cadute sulla griglia.

## 3. Vincoli e cerniera {#_3-supports-and-the-hinge}

1. Fai clic sul nodo A, apri **Vincoli del nodo** e scegli la **Cerniera**. Fai lo stesso per il nodo E.
2. Nella tabella *Elementi*, trova l'elemento da B a C e spunta la sua cerniera **finale** (la seconda casella in *Cerniere di estremità*).

![La tabella Elementi: la cerniera è alla fine dell'elemento 2, nel nodo C](/screenshots/it/elements-table.webp)

::: tip Una cerniera, non due
Basta incernierare la fine dell'elemento B–C: il momento in C è allora nullo, perché C–D non può trasmettere momento a un nodo a cui è collegato rigidamente solo lui. Spunta anche l'inizio di C–D e non cambia nulla. Ma se spunti una cerniera anche in B, il telaio diventa un meccanismo. Prova: EduBeam ti mostra come si muove.
:::

## 4. Carico {#_4-load}

*Carichi* → **Aggiungi carico su elemento** → *Carico uniforme*, elemento B–C, `fz = 10` kN/m. Ripeti per l'elemento C–D. La trave è orizzontale, quindi qui la casella LCS non fa differenza.

## 5. Risultati {#_5-results}

Le opzioni di visualizzazione partono con deformata, momento flettente e reazioni attivi. Spunta **N (x)** e **V<sub>z</sub> (x)** per vedere il resto.

<div class="shots">

![Momento flettente e reazioni](/screenshots/it/tut-frame-moment.webp)

![Sforzo normale](/screenshots/it/tut-frame-normal.webp)

![Taglio](/screenshots/it/results-shear.webp)

![Deformata](/screenshots/it/results-deformed.webp)

</div>

## 6. Verifica a mano {#_6-check-by-hand}

**Reazioni verticali.** Per simmetria, ogni base porta metà del carico:

$$V_A = V_E = \frac{q \cdot 8}{2} = 40\ \text{kN}$$

**Reazioni orizzontali.** Scrivi l'equilibrio alla rotazione attorno alla cerniera C per la metà sinistra del telaio. Lì il momento deve essere nullo:

$$V_A \cdot 4 - H_A \cdot 4 - q \cdot 4 \cdot 2 = 0 \quad\Rightarrow\quad H_A = \frac{160 - 80}{4} = 20\ \text{kN}$$

Entrambe le basi spingono verso l'interno con 20 kN; è questa spinta orizzontale a rendere efficiente un telaio a tre cerniere.

**Sollecitazioni.**

| Grandezza | Formula | Valore a mano | EduBeam |
| --- | --- | --- | --- |
| Reazioni verticali | $qL/2$ | 40 kN | 40 kN |
| Reazioni orizzontali | da $M_C = 0$ | 20 kN | 20 kN |
| Momento negli spigoli B e D | $H \cdot h$ | 80 kNm, fibre esterne tese | −80 kNm |
| Momento nella cerniera C | | 0 | 0 |
| Sforzo normale nelle colonne | $-V_A$ | −40 kN | −40 kN |
| Sforzo normale nella trave | $-H_A$ | −20 kN | −20 kN |
| Taglio nelle colonne | $H_A$ | 20 kN | −20 kN (A–B), +20 kN (D–E) |
| Taglio nella trave in B | $V_A$ | 40 kN | 40 kN |
| Taglio nella trave in C | $V_A - 4q$ | 0 | 0 |
| Taglio nella trave in D | $V_A - 8q$ | −40 kN | −40 kN |

Le due colonne hanno taglio di segno opposto pur portando la stessa forza, perché gli assi locali di ogni elemento seguono il suo verso: A–B è disegnato verso l'alto e D–E verso il basso. Scambia i nodi di una colonna e il suo segno si inverte.

Nella trave $M(x) = -80 + 40x - 5x^2$ kNm (x misurato da B), che si annulla nella cerniera e non è mai positivo: tutta la trave ha momento negativo (fibre superiori tese). Il taglio $V(x) = 40 - 10x$ si annulla esattamente in C, quindi anche l'estremo del momento è nella cerniera.

**Spostamento.** La cerniera C si abbassa di 43,1 mm (*Risultati → Risultati nodali*, `Dz` di C). Deriva dalla flessione di tutte e quattro le aste ed è un buon esercizio sul principio dei lavori virtuali.

## 7. Sperimenta {#_7-experiment}

- **Togli la spunta alla cerniera** in C. Il telaio diventa una volta iperstatico; i momenti negli spigoli diminuiscono e in mezzeria compare un momento positivo. Ora la sezione conta: prova una trave più rigida.
- **Incastra le basi** (scegli il vincolo **Incastro**). In A ed E compaiono momenti.
- **Aggiungi un carico orizzontale**: un carico nodale `Fx = 10` kN in B. Il telaio trasla lateralmente e le reazioni non sono più simmetriche. Verificale con le stesse tre equazioni e $M_C = 0$.
- **Spunta una cerniera anche in B.** Il telaio diventa un meccanismo, ed EduBeam anima il modo in cui può muoversi.
