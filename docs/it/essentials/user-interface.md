---
description: "Una panoramica dell'interfaccia di EduBeam: il menu principale, la vista e le opzioni di visualizzazione, navigazione e selezione, le schede, la barra inferiore e le finestre mobili."
---

# Interfaccia utente

<Edubeam /> ha tre zone: la **barra dell'app** in alto, la **vista** al centro, dove disegni, e la **barra inferiore** con una tabella per ogni tipo di oggetto. Una volta capito dove si trova ogni cosa, il resto della guida ti sembrerà semplice.

![Le parti dell'interfaccia, numerate come nell'elenco qui sotto](/screenshots/it/ui-overview.webp)

1. **Menu ☰**: apri, salva, condividi ed esporta; esempi e tour guidati.
2. **Pulsanti della barra dell'app**: Cancella struttura e Condividi modello.
3. **Annulla / Ripeti** per ogni modifica al modello.
4. **Pulsanti della vista**: centra, adatta allo schermo e il pulsante delle opzioni di visualizzazione.
5. **Opzioni di visualizzazione**: quali risultati e parti del modello vengono disegnati.
6. **Griglia, snap, mirino e unità.**
7. **Schede della barra inferiore**: Nodi, Elementi, Carichi, Materiali, Sezioni, Risultati.
8. **La tabella** della scheda aperta, in cui ogni valore è modificabile.

::: tip Fai il tour
**☰ → Fammi fare un giro** ti indica queste parti direttamente nell'app, una alla volta.
:::

![Fammi fare un giro, al passo delle opzioni di visualizzazione](/screenshots/it/tour.webp)

## Barra dell'app {#app-bar}

| Comando | Cosa fa |
| --- | --- |
| **Menu ☰** | Il menu principale, vedi sotto. |
| **Cancella struttura** | Elimina tutti i nodi, gli elementi e i carichi dopo una conferma. Due caselle eliminano anche i materiali e le sezioni. <kbd>Ctrl</kbd>+<kbd>Z</kbd> riporta indietro il modello, che resta anche in Strutture recenti. |
| **Condividi modello** | Apre la [finestra di condivisione](/it/essentials/import-export#share-a-link) con un link che contiene l'intero modello. |
| **Novità** | Le note di versione. Si aprono da sole una volta dopo ogni aggiornamento. |
| **Documentazione** / GitHub | Questa guida e il codice sorgente. |

Su uno smartphone c'è posto solo per il menu ☰ e Documentazione; tutto il resto è nel menu.

### Il menu ☰ {#the-☰-menu}

![Il menu ☰](/screenshots/it/ui-app-menu.webp){.shot-xs}

| Voce | Cosa fa |
| --- | --- |
| **Apri progetto** / **Salva progetto** | Apre o scarica un file `project.json` (<kbd>Ctrl</kbd>+<kbd>O</kbd> / <kbd>Ctrl</kbd>+<kbd>S</kbd>). |
| **Strutture recenti** | Gli ultimi 10 modelli cancellati o sostituiti, pronti da ripristinare. |
| **Esporta immagine** | Salva il disegno in PNG o SVG, oppure lo copia (<kbd>Ctrl</kbd>+<kbd>P</kbd>). |
| **Condividi modello** | Come il pulsante nella barra dell'app. |
| **Esempi** | La galleria dei modelli già pronti. |
| **Disegna la tua prima trave** | Un esercizio guidato in sette passi. |
| **Fammi fare un giro** | Il tour dell'interfaccia. |
| **Cancella struttura** | Come il pulsante nella barra dell'app. |

In fondo al menu sono indicate la versione dell'app e la data di pubblicazione.

## Vista {#viewer}

L'area di disegno è dove disegni ed esamini il modello. Tutto il resto dell'app segue ciò che selezioni qui.

### Pulsanti nell'area di disegno {#buttons-on-the-canvas}

- **In alto a sinistra:** **Annulla** e **Ripeti** (<kbd>Ctrl</kbd>+<kbd>Z</kbd> / <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Z</kbd>). Ogni modifica al modello, compresi aggiunta, modifica, trascinamento, eliminazione e cancellazione, può essere annullata.
- **In alto a destra:** **Centra il modello** (<kbd>C</kbd>), **Adatta allo schermo** (<kbd>F</kbd>) e il pulsante ⚙ che mostra o nasconde le opzioni di visualizzazione. Sugli schermi touch c'è anche **Selezione con riquadro**.
- **In basso a destra:** **G** attiva e disattiva la griglia, **S** attiva e disattiva lo snap alla griglia, il pulsante del mirino mostra la posizione del puntatore sui righelli e l'**indicatore delle unità** apre le impostazioni su *Lingua e impostazioni locali*.

### Opzioni di visualizzazione {#display-options}

![I pulsanti della vista e le opzioni di visualizzazione](/screenshots/it/ui-display-settings.webp){.shot-lg}

Due righe di caselle, aperte per impostazione predefinita:

- **Risultati:** *Deformata*, *N (x)*, *V<sub>z</sub> (x)*, *M<sub>y</sub> (x)*, *Reazioni*. Deformata, M e Reazioni sono attivi all'inizio.
- **Modello:** *Vincoli*, *Carichi*, *Etichette dei nodi*, *Etichette degli elementi*.

**Altre impostazioni** apre le [impostazioni](/it/essentials/units-settings) complete su *Impostazioni della vista*.

### Navigazione {#navigating}

| Azione | Mouse | Touch |
| --- | --- | --- |
| Zoom | Rotellina del mouse (verso il cursore), <kbd>Ctrl</kbd>+<kbd>=</kbd> / <kbd>Ctrl</kbd>+<kbd>-</kbd> | Avvicina o allontana due dita |
| Spostamento | Trascina con il tasto **centrale o destro** (vedi *Impostazioni → Comandi e scorciatoie*) | Trascina con un dito |
| Adatta / centra | <kbd>F</kbd> / <kbd>C</kbd> o i pulsanti in alto a destra | I pulsanti in alto a destra |

### Selezione e modifica {#selecting-and-editing}

**Fai clic** su un nodo, un elemento, un carico o una quota per selezionarlo. Accanto si apre un pannello con i suoi dettagli e le azioni pertinenti: aggiungere un carico, assegnare vincoli, modificare, mostrare la matrice di rigidezza, eliminare. Il clic su un nodo porta anche la barra inferiore sulla scheda Nodi.

<div class="shots">

![Un nodo: aggiungi un carico, assegna vincoli, imponi uno spostamento](/screenshots/it/ui-node-menu.webp)

![Un elemento: modifica, aggiungi un carico, matrice di rigidezza](/screenshots/it/ui-element-menu.webp)

</div>

- **Trascina su un'area vuota** per disegnare un rettangolo di selezione. Viene selezionato tutto ciò che sta dentro: nodi, elementi, i loro carichi e le quote. Premi <kbd>Delete</kbd> per eliminare tutto, oppure <kbd>Ctrl</kbd>+<kbd>C</kbd> / <kbd>Ctrl</kbd>+<kbd>V</kbd> per copiarlo altrove.
- **Trascina un nodo** per spostarlo. Con lo snap attivo, finisce sulla griglia. Gli elementi collegati e i loro carichi lo seguono.
- **Fai doppio clic su un carico** per modificarlo.
- **Passa con il mouse** su qualsiasi oggetto per vedere un tooltip. I nodi mostrano spostamenti e rotazione, gli elementi materiale e sezione, i carichi i loro valori. Su uno schermo touch, tocca invece l'oggetto: gli stessi dettagli compaiono nel pannello di selezione.

![Passando sopra un nodo se ne vedono spostamenti e rotazione](/screenshots/it/ui-hover.webp){.shot-sm}

**Fai clic destro nell'area di disegno** (o tieni premuto su uno schermo touch) per il menu dell'area di disegno. Tieni premuto <kbd>Ctrl</kbd> mentre scegli *Aggiungi nodo* o *Aggiungi elemento* per posizionarli con il mouse invece che da una finestra. Sopra un elemento, il menu offre anche *Quota l'elemento*.

![Il menu dell'area di disegno](/screenshots/it/ui-canvas-menu.webp){.shot-sm}

Tutte le scorciatoie sono nella pagina [Tastiera, mouse e touch](/it/reference/shortcuts).

### Quando il modello non si può risolvere {#when-the-model-cannot-be-solved}

In alto a sinistra nella vista compaiono dei messaggi:

- *Nessun materiale definito* / *Nessuna sezione definita*, con un pulsante **Aggiungi**.
- Un piccolo indicatore blu **Servono vincoli** finché il modello è semplicemente incompleto.
- Un **messaggio rosso** quando qualcosa non va, con **Mostra dettagli**, che elenca ogni problema.

Quando la struttura può ancora muoversi, EduBeam ne fa oscillare il contorno tratteggiato e cerchia i nodi o le cerniere responsabili. Passa sul messaggio per rivedere il movimento, oppure usa il suo pulsante a forma di occhio per nasconderlo.

![Un telaio con cerniere in B e C è un meccanismo: EduBeam mostra come si muove](/screenshots/it/ui-mechanism.webp)

![Mostra dettagli elenca ogni problema con un suggerimento](/screenshots/it/ui-diagnostics.webp){.shot-lg}

[Risoluzione dei problemi](/it/reference/troubleshooting) spiega ogni messaggio.

## Barra inferiore {#bottom-bar}

Sei schede, ciascuna con una barra degli strumenti e una tabella modificabile. Le schede indicano quanti oggetti di ogni tipo contiene il modello. Il **?** a destra spiega la scheda aperta, e lo stesso fa il **?** accanto ad alcune intestazioni di colonna. Trascina la fila delle schede in su o in giù per ridimensionare la barra, oppure riducila a icona con il pulsante a destra.

| Scheda | Barra degli strumenti | Tabella |
| --- | --- | --- |
| **Nodi** | Aggiungi nodo (finestra), Aggiungi nodo (mouse) | Etichetta, coordinate, **GdL vincolati** (simbolo del vincolo, Dx, Dz, Ry, angolo del vincolo α), carichi, modifica, elimina |
| **Elementi** | Aggiungi elemento (finestra), Aggiungi elemento (mouse) | Etichetta, tipo, nodi (con un pulsante di scambio), materiale, sezione, **Cerniere di estremità**, carichi, matrice di rigidezza, elimina |
| **Carichi** | Aggiungi carico nodale, Aggiungi carico su elemento | Tipo, applicato a, componenti modificabili, modifica, elimina |
| **Materiali** | Aggiungi materiale, Libreria materiali | Etichetta, E, G, α<sub>T</sub>, elimina |
| **Sezioni** | Aggiungi sezione, Libreria sezioni, Sezione poligonale | Forma, etichetta, A, I<sub>y</sub>, h, k, modifica forma, elimina |
| **Risultati** | Risultati nodali, Risultati degli elementi, Esporta CSV, Copia | Spostamenti e rotazioni per nodo, oppure forze di estremità per elemento |

Modifica una cella direttamente: fai clic, digita, poi premi <kbd>Enter</kbd> (o <kbd>Esc</kbd> per uscire dalla cella). I valori sono mostrati e inseriti nelle [unità correnti](/it/essentials/units-settings).

## Schede sopra la vista {#tabs-above-the-viewer}

**Vista** mostra l'area di disegno. **Impostazioni** mostra le impostazioni a schermo intero, così puoi cambiare colori o unità e tornare indietro per vederne l'effetto. L'indicatore delle unità e *Altre impostazioni* aprono le stesse impostazioni come finestra sopra il modello.

## Finestre mobili {#floating-windows}

**Matrice di rigidezza** (dal pannello di un elemento o dalla tabella Elementi) apre una finestra con la matrice di rigidezza 6 × 6 dell'elemento in coordinate globali. **Modifica** nel menu dell'area di disegno apre una tabella della selezione corrente. Trascinale dalla barra del titolo e chiudile con la ×.
