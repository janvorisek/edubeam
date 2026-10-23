---
description: "Leggere i diagrammi di sforzo normale, taglio e momento flettente, reazioni e deformata, i valori al passaggio del mouse, le tabelle dei risultati, l'esportazione CSV e la matrice di rigidezza."
---

# Risultati e diagrammi

<Edubeam /> risolve il modello dopo ogni modifica, al massimo qualche volta al secondo, quindi i risultati sono sempre aggiornati. Non c'è un pulsante *Calcola*. Se non viene disegnato nulla, il modello non si può ancora risolvere; il messaggio in alto a sinistra nella vista spiega perché (vedi [Risoluzione dei problemi](/it/reference/troubleshooting)).

Le immagini di questa pagina mostrano tutte lo stesso modello: il [telaio a tre cerniere](/it/tutorials/three-hinged-frame) con 10 kN/m.

## Diagrammi nella vista {#overlays-in-the-viewer}

Attivali e disattivali nelle **opzioni di visualizzazione** in alto a destra nella vista (il pulsante ⚙ le mostra o le nasconde).

| Diagramma | Colore (predefinito) | Note |
| --- | --- | --- |
| **Deformata** | grigio | Amplificata: lo spostamento più grande è disegnato lungo *Scala dei risultati* pixel. Attiva per impostazione predefinita. |
| **N (x)**, sforzo normale | blu | La trazione è positiva. Costante lungo un elemento, a meno che su di esso agisca un carico assiale. |
| **V<sub>z</sub> (x)**, taglio | verde | Lineare sotto un carico uniforme, quadratico sotto uno trapezoidale, con un salto in corrispondenza di un carico concentrato. |
| **M<sub>y</sub> (x)**, momento flettente | rosso | Positivo quando tende le fibre inferiori. Etichettato a entrambe le estremità, nei carichi concentrati e in ogni estremo locale (dove V = 0). Attivo per impostazione predefinita. |
| **Reazioni** | viola | Una freccia e un valore per ogni GdL vincolato. Attive per impostazione predefinita. |

I valori sono scritti nei punti caratteristici di ogni diagramma. L'orientamento delle etichette, la dimensione dei grafici e i colori si cambiano nelle [Impostazioni](/it/essentials/units-settings#viewer-settings).

<div class="shots">

![Sforzo normale N: entrambe le colonne sono compresse con 40 kN, la trave con 20 kN](/screenshots/it/results-normal.webp)

![Taglio V: 20 kN nelle colonne; nella trave, 40 kN negli spigoli che scende a zero nella cerniera](/screenshots/it/results-shear.webp)

![Momento flettente M: −80 kNm in entrambi gli spigoli, zero alle basi e nella cerniera](/screenshots/it/results-moment.webp)

![Deformata (amplificata): la cerniera in C si abbassa](/screenshots/it/results-deformed.webp)

</div>

![Reazioni: 40 kN in verticale e 20 kN in orizzontale in ogni cerniera](/screenshots/it/results-reactions.webp){.shot-lg}

### Leggere il segno {#reading-the-sign}

Leggi il segno di un valore dalla sua etichetta, non dal lato dell'asta su cui è disegnato il diagramma. Un momento flettente negativo tende le fibre superiori di una trave, o le fibre esterne in uno spigolo di un telaio.

## Tooltip al passaggio del mouse {#hover-tooltips}

Puntare un oggetto è il modo più rapido per leggere un valore:

- **Nodo**: `ux`, `uz` e `φy` (spostamenti nell'unità di spostamento, rotazione in radianti).
- **Elemento**: etichetta, sezione e materiale.
- **Carico**: le sue componenti.

Su uno schermo touch, tocca invece l'oggetto. Gli stessi dettagli compaiono nel suo pannello di selezione.

![Puntando il nodo 2 della trave dell'Avvio rapido](/screenshots/it/ui-hover.webp){.shot-sm}

## Scheda Risultati {#results-tab}

La scheda **Risultati** nella barra inferiore ha due tabelle, che si alternano con **Risultati nodali** e **Risultati degli elementi**.

### Risultati nodali {#nodal-results}

Una riga per nodo con **Dx**, **Dz** (unità di spostamento) e **Ry** (rad). I segni seguono gli assi globali: un `Dz` positivo è verso il basso e un `Ry` positivo è antiorario sullo schermo.

![Risultati nodali del telaio a tre cerniere (Formato dei numeri: Automatico)](/screenshots/it/results-nodal.webp)

### Risultati degli elementi {#element-results}

Una riga per elemento con le **forze di estremità nel sistema di riferimento locale dell'elemento**:

| Colonna | Significato |
| --- | --- |
| `X12`, `Z12`, `M12` | forza assiale, forza di taglio e momento che agiscono sull'elemento nel suo nodo **iniziale** |
| `X21`, `Z21`, `M21` | le stesse nel nodo **finale** |

![Risultati degli elementi del telaio a tre cerniere](/screenshots/it/results-element.webp)

Sono le forze che i nodi esercitano sull'elemento: la matrice di rigidezza dell'elemento per i suoi spostamenti di estremità, meno i carichi nodali equivalenti. Seguono gli assi locali, non la convenzione N-V-M dei diagrammi:

- Per la trave semplicemente appoggiata di 6 m dell'[Avvio rapido](/it/guide/quick-start): `Z12 = Z21 = −36 kN`. Entrambi i vincoli spingono la trave verso l'alto, cioè verso −z.
- Per una mensola incastrata nel suo nodo iniziale con un carico di 18 kN verso il basso all'estremità: `Z12 = −18 kN`, `M12 = +72 kNm`, `Z21 = +18 kN`, `M21 = 0`.
- Per la colonna 1 del telaio (A in basso, B in alto): `X12 = +40 kN` spinge lungo l'asse x locale dentro l'elemento, cioè 40 kN di compressione.

### Esporta CSV e Copia {#export-csv-and-copy}

**Esporta CSV** scarica `edubeam-results.csv` con entrambe le tabelle, nelle unità mostrate sullo schermo e pronto per un foglio di calcolo. La tabella dei nodi riporta anche le **reazioni** `Rx`, `Rz`, `My`. **Copia** mette le stesse tabelle negli appunti come testo separato da tabulazioni, che si incolla direttamente in Excel, LibreOffice o Fogli Google. Nell'esportazione, le forze di estremità degli elementi si chiamano `N1 V1 M1 N2 V2 M2`.

### Matrice di rigidezza {#stiffness-matrix}

Scegli **Matrice di rigidezza** dal pannello di un elemento o dalla sua riga nella tabella per aprire una finestra con la matrice di rigidezza 6 × 6 dell'elemento in coordinate globali, utile per controllare l'assemblaggio a mano in un corso sul metodo degli spostamenti. Le formule sono nel [manuale teorico](/it/elements/beam).

## Formato dei numeri {#number-format}

I risultati sono mostrati con cinque cifre significative. **Impostazioni → Lingua e impostazioni locali → Formato dei numeri** decide come vengono scritti:

| Formato | 40 000 si scrive | Usalo per |
| --- | --- | --- |
| **Scientifico** (predefinito) | 4 · 10⁴ | valori che spaziano su molti ordini di grandezza |
| **Ingegneristico** | 40 · 10³ | allinearsi ai prefissi kilo / mega |
| **Automatico** | 40000 | i numeri di tutti i giorni nella didattica |

Automatico scrive i valori da 0,001 a 100 000 come numeri semplici e passa alle potenze di dieci fuori da questo intervallo. Il separatore decimale segue la lingua.

## Precisione e accuratezza {#precision-and-accuracy}

- L'elemento trave è esatto per il modello lineare di Timoshenko sotto carichi nodali, uniformi, trapezoidali, concentrati e termici, quindi i risultati **non** dipendono dal numero di elementi.
- Il calcolo è in doppia precisione. Valori minimi come `1,5 · 10⁻¹⁸` sono errori di arrotondamento e significano zero.
- Le frecce includono la **deformazione a taglio**. Per aste snelle aggiunge una frazione di punto percentuale al valore di Eulero–Bernoulli; per aste tozze o corte può valere diversi punti percentuali. Imposta un valore elevato del coefficiente di taglio della sezione per eliminarla.

## Risultati in una relazione {#results-in-a-report}

- **☰ → Esporta immagine** (<kbd>Ctrl</kbd>+<kbd>P</kbd>) salva il disegno in PNG o SVG con i diagrammi che scegli. Vedi [Esportare un'immagine](/it/essentials/import-export#export-an-image).
- **Risultati → Esporta CSV** o **Copia** ti danno i numeri.
- **Condividi modello** ti dà un link con cui chi legge può aprire il modello stesso.
