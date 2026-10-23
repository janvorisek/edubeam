---
description: "Modella in circa dieci minuti una trave in acciaio semplicemente appoggiata con un carico uniforme, leggi reazioni, taglio e momento flettente e verificali a mano."
---

# Avvio rapido

In circa dieci minuti modellerai una trave in acciaio semplicemente appoggiata con un carico uniforme, leggerai reazioni, taglio e momento flettente e li confronterai con le formule dei manuali.

::: tip Segui passo passo
Apri [run.edubeam.app](https://run.edubeam.app/?lang=it){target="_blank"} in una seconda scheda. Se c'è già un modello, usa **Cancella struttura** nella barra dell'app per partire da zero, e spunta *Elimina materiali* ed *Elimina sezioni* per ripartire completamente da capo. La cancellazione si annulla con <kbd>Ctrl</kbd>+<kbd>Z</kbd>, e il vecchio modello resta in **☰ → Strutture recenti**.

Preferisci imparare facendo, con i suggerimenti sullo schermo? **☰ → Disegna la tua prima trave** ti guida con il mouse attraverso una trave simile.
:::

## Il problema {#the-problem}

<ExampleStructure />

Una trave semplicemente appoggiata di 6 m (cerniera a sinistra, carrello a destra) porta un carico uniforme di 12 kN/m. Materiale: acciaio, $E = 210\ \text{GPa}$, $G = 81\ \text{GPa}$. Sezione: IPE 200, $A = 28{,}5\ \text{cm}^2$, $I_y = 1943\ \text{cm}^4$, $h = 200\ \text{mm}$.

## 1. Controlla le unità {#_1-check-the-units}

L'indicatore delle unità nell'angolo in basso a destra della vista mostra le unità usate da tutti i campi di input e dai risultati. Questo tutorial presuppone le unità SI predefinite: metri, kN, kNm e MPa.

![I pulsanti di griglia (G), snap (S) e mirino, e l'indicatore delle unità](/screenshots/it/ui-grid-units.webp){.shot-sm}

Se vedi `ft · kip · kip·ft · ksi`, fai clic sull'indicatore e scegli **Sistema di unità → SI (metrico)**.

## 2. Aggiungi il materiale e la sezione {#_2-add-the-material-and-cross-section}

Gli elementi hanno bisogno di un materiale e di una sezione, quindi crea prima questi.

1. Apri la scheda **Materiali** nella barra inferiore e fai clic su **Aggiungi materiale**.
2. Inserisci `E = 210000` MPa e `G = 81000` MPa. Lascia la densità e `α = 0,000012` 1/K. Fai clic su **Aggiungi materiale**.

<div class="shots">

![Aggiungi materiale: inserisci E e G…](/screenshots/it/qs-material.webp)

![…oppure scegli Steel (S235) dalla Libreria materiali](/screenshots/it/qs-material-library.webp)

</div>

3. Apri la scheda **Sezioni** e fai clic su **Aggiungi sezione**.
4. Inserisci `Area = 0,00285` m², `Iy = 1,943e-5` m⁴, `Altezza = 0,2` m e `Fattore di taglio = 1`. Fai clic su **Aggiungi sezione**.

![Aggiungi sezione. Oppure scegli dalla libreria, o disegna una forma poligonale.](/screenshots/it/qs-cross-section.webp){.shot-md}

::: details Perché conta il fattore di taglio?
EduBeam usa elementi trave di Timoshenko, che includono la deformazione a taglio. `k` è il fattore di correzione a taglio: $k \approx 0{,}83$ per un rettangolo e circa $0{,}4$–$0{,}5$ per una sezione a I quando $A$ è l'area intera. Con `k = 1` e l'area intera la deformabilità a taglio risulta leggermente *sottostimata*. Per una trave snella come questa la differenza nella freccia è ben sotto l'1 %. La formula è nella [pagina sulla teoria della trave](/it/elements/beam).
:::

## 3. Aggiungi i nodi {#_3-add-the-nodes}

1. Apri la scheda **Nodi**. Ci sono due pulsanti **Aggiungi nodo**: il primo apre una finestra di dialogo, il secondo (con l'icona del cursore) posiziona i nodi con il mouse. Fai clic sul primo.
2. Inserisci `X = 0`, `Z = 0` e fai clic su **Aggiungi nodo**. Il nodo prende l'etichetta `1`.
3. Aggiungi un secondo nodo in `X = 6`, `Z = 0`. Questo è il nodo `2`.

![La finestra Aggiungi nodo può anche assegnare subito i vincoli](/screenshots/it/qs-node.webp){.shot-md}

Con il pulsante del mouse, invece, ogni clic nell'area di disegno posiziona un nodo. Con **Snap alla griglia** attivo (<kbd>S</kbd>), i clic cadono sul passo della griglia (0,1 m per impostazione predefinita).

## 4. Collegali con un elemento {#_4-connect-them-with-an-element}

1. Apri la scheda **Elementi** e fai clic sul primo pulsante **Aggiungi elemento**.
2. Scegli **Nodo iniziale** `1` e **Nodo finale** `2`. Il materiale e la sezione sono già selezionati. Fai clic su **Aggiungi elemento**.

![Aggiungi elemento: i due nodi di estremità, le cerniere di estremità facoltative, il materiale e la sezione](/screenshots/it/qs-element.webp){.shot-md}

Tra i nodi compare una linea. Premi <kbd>F</kbd> per adattarla allo schermo.

## 5. Aggiungi i vincoli {#_5-add-the-supports}

Nella scheda **Nodi**, la colonna **GdL vincolati** ha per ogni nodo un selettore del simbolo di vincolo e tre caselle: `Dx`, `Dz`, `Ry`.

- Nodo `1`: scegli il simbolo **Cerniera**, oppure spunta **Dx** e **Dz**.
- Nodo `2`: scegli il **Carrello**, oppure spunta solo **Dz**.

![Vincoli nella tabella Nodi: nodo 1 con cerniera, nodo 2 su carrello](/screenshots/it/qs-supports.webp)

Puoi anche fare clic su un nodo nella vista e scegliere **Vincoli del nodo**. [Nodi e vincoli](/it/essentials/nodes-supports#supports) elenca tutti i tipi di vincolo.

## 6. Aggiungi il carico {#_6-add-the-load}

1. Apri la scheda **Carichi** e fai clic su **Aggiungi carico su elemento**.
2. **Tipo di carico**: *Carico uniformemente distribuito*. **Elemento**: `1`.
3. Inserisci `fz = 12` kN/m e lascia `fx = 0`. Fai clic su **Aggiungi carico su elemento**.

![La finestra mostra un'anteprima del carico sull'elemento](/screenshots/it/qs-load.webp){.shot-md}

Un `fz` positivo punta nel verso +z, cioè **verso il basso** sullo schermo, quindi un valore positivo è un carico gravitazionale. Vedi le [convenzioni dei segni](/it/elements/conventions).

## 7. Leggi i risultati {#_7-read-the-results}

La soluzione compare non appena aggiungi il carico. Il pannello di visualizzazione in alto a destra nella vista attiva e disattiva i diagrammi. **Deformata**, **M<sub>y</sub>(x)** e **Reazioni** sono attivi per impostazione predefinita. Spunta **V<sub>z</sub>(x)** per aggiungere il taglio.

![Taglio (verde), momento flettente (rosso), reazioni (viola) e deformata](/screenshots/it/qs-results.webp)

| Diagramma | Cosa dovresti vedere |
| --- | --- |
| **Reazioni** | Due frecce verso l'alto da **36 kN** nei nodi 1 e 2. |
| **V<sub>z</sub>(x)** | Una retta da **+36 kN** a sinistra a **−36 kN** a destra, che si annulla in mezzeria. |
| **M<sub>y</sub>(x)** | Una parabola con il valore estremo di **54 kNm** in mezzeria. |
| **Deformata** | Un abbassamento simmetrico. Passa con il mouse sul nodo `1` per leggerne la rotazione: **2,6469 · 10⁻² rad**. |

La scheda **Risultati** nella barra inferiore fornisce i valori numerici. **Risultati nodali** elenca `Dx`, `Dz`, `Ry` per ogni nodo. **Risultati degli elementi** elenca le forze di estremità di ogni elemento nel suo sistema di riferimento locale.

Se i diagrammi sembrano troppo grandi o troppo piccoli, cambia **Scala dei risultati** in **Impostazioni → Impostazioni della vista → Dimensioni**.

## 8. Verifica a mano {#_8-check-by-hand}

| Grandezza | Formula | Valore a mano | EduBeam |
| --- | --- | --- | --- |
| Reazione | $R = qL/2$ | 36 kN | 36 kN |
| Taglio massimo | $V = qL/2$ | 36 kN | 36 kN |
| Momento massimo | $M = qL^2/8$ | 54 kNm | 54 kNm |
| Rotazione all'estremità | $\varphi = qL^3/(24EI)$ | 0,02647 rad | 0,02647 rad |
| Freccia in mezzeria (flessione) | $w = 5qL^4/(384EI)$ | 49,63 mm | |
| Freccia in mezzeria (taglio) | $w_s = qL^2/(8kGA)$ | 0,23 mm | |
| Freccia in mezzeria (totale) | somma | 49,86 mm | 49,86 mm |

In mezzeria non c'è un nodo, quindi per leggere lì la freccia aggiungine uno: scegli il secondo pulsante **Aggiungi nodo**, fai clic sulla trave in `X = 3` e scegli **Collega alla struttura**. La trave viene divisa in due e il `Dz` del nuovo nodo in **Risultati** vale 49,86 mm. La divisione non cambia alcun risultato, perché l'elemento è esatto.

Tutto torna. Altre ricette di verifica a mano (mensola, trave doppiamente incastrata, travatura reticolare, temperatura) sono in [Verificare i risultati a mano](/it/guide/verification).

## 9. Sperimenta {#_9-experiment}

È qui che EduBeam dà il meglio. Prova ciascuna di queste modifiche e guarda i diagrammi aggiornarsi:

- **Trascina il nodo 2** verso destra: il momento cresce con $L^2$.
- **Spunta `Ry` nel nodo 1** per incastrarlo: il momento in mezzeria diminuisce e sull'appoggio compare un momento negativo.
- **Spunta `Dz` nel nodo di mezzeria** che hai appena aggiunto, per ottenere una trave continua a due campate.
- **Spunta una cerniera di estremità** su un elemento nella scheda Elementi per svincolare il momento a un'estremità.
- Premi <kbd>Ctrl</kbd>+<kbd>Z</kbd> per annullare qualsiasi passo.

## 10. Salva o condividi {#_10-save-or-share}

- **Condividi modello** (nella barra dell'app o nel menu ☰) ti dà un link che contiene l'intero modello. Incollalo in un'e-mail, in una chat o nelle tue slide.
- **☰ → Salva progetto** (<kbd>Ctrl</kbd>+<kbd>S</kbd>) scarica un file `project.json` che puoi riaprire in seguito con **Apri progetto** o trascinandolo sull'app.
- **☰ → Esporta immagine** (<kbd>Ctrl</kbd>+<kbd>P</kbd>) salva il disegno in PNG o SVG per una relazione.

Il modello viene anche conservato nel browser, quindi ricaricare la pagina non lo fa perdere. Vedi [Importazione, esportazione e condivisione](/it/essentials/import-export).

## E ora? {#where-next}

- [Tutorial sul telaio a tre cerniere](/it/tutorials/three-hinged-frame): un telaio con una cerniera interna, verificato a mano.
- [Esempi](/it/examples/): apri con un clic telai e travature reticolari già pronti.
- [Carichi](/it/essentials/loads): carichi trapezoidali, concentrati e termici, spostamenti imposti.
- [Tastiera, mouse e touch](/it/reference/shortcuts): lavora più velocemente nell'area di disegno.
