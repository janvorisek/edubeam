---
description: "Risposte alle domande più comuni su EduBeam: costi e account, browser e dispositivi, recupero di un modello perso, uso offline, dove sono salvati i dati e consigli di modellazione."
---

# Domande frequenti

## Generali {#general}

### Che cos'è EduBeam? {#what-is-edubeam}

Un solutore gratuito e open source, che funziona nel browser, per travi, telai e travature reticolari 2D, pensato per studenti, docenti e ingegneri che vogliono un riscontro immediato. Vedi l'[Introduzione](/it/guide/introduction).

### È davvero gratuito? Serve un account? {#is-it-really-free-do-i-need-an-account}

Sì, e no. Apri [run.edubeam.app](https://run.edubeam.app/?lang=it) e inizia a modellare. Niente account, niente installazione e nessun limite d'uso. Il codice sorgente è su [GitHub](https://github.com/janvorisek/edubeam).

### Con quali browser e dispositivi funziona? {#which-browsers-and-devices-work}

Con qualsiasi versione recente di Chrome, Edge, Firefox o Safari. Tablet e smartphone funzionano: tocca per selezionare o posizionare, trascina un nodo per spostarlo, trascina altrove per spostare la vista, avvicina le dita per lo zoom e tieni premuto per il menu dell'area di disegno. Con mouse e tastiera, però, si modella più in fretta. Vedi [Tastiera, mouse e touch](/it/reference/shortcuts#touch).

### Ho perso il mio modello. Posso recuperarlo? {#i-lost-my-model-can-i-get-it-back}

Probabilmente sì. Quando cancelli il modello, o apri sopra di esso un link, un file o un esempio, quello vecchio resta in **☰ → Strutture recenti** (gli ultimi 10), e <kbd>Ctrl</kbd>+<kbd>Z</kbd> annulla la sostituzione. Entrambi esistono solo nel tuo browser.

### Posso usarlo offline? {#can-i-use-it-offline}

EduBeam è una progressive web app: una volta caricata continua a funzionare senza connessione, e il browser può proporre di installarla. Quando è disponibile una nuova versione, una finestra ti chiede conferma prima di aggiornare.

### Dove sono salvati i miei dati? {#where-is-my-data-stored}

Solo nel tuo browser. I modelli non vengono mai inviati a un server; il link condiviso *è* il modello. Vedi [Importazione, esportazione e condivisione](/it/essentials/import-export).

## Modellazione {#modelling}

### Come creo un incastro, una cerniera o un carrello? {#how-do-i-make-a-fixed-pinned-roller-support}

Fai clic sul nodo, apri **Vincoli del nodo** e scegli il simbolo: cerniera, carrello, incastro, pattino e altri. Oppure spunta i GdL: **Dx + Dz + Ry** = incastro, **Dx + Dz** = cerniera, **Dz** = carrello. Tutte le combinazioni sono elencate in [Nodi e vincoli](/it/essentials/nodes-supports#supports).

### Come creo una travatura reticolare? {#how-do-i-make-a-truss}

Usa elementi trave e spunta **entrambe le cerniere di estremità** di ogni asta nella scheda *Elementi*, oppure spunta *Cerniera iniziale* e *Cerniera finale* nel banner prima di disegnare le aste con il mouse. Applica i carichi nei nodi. Il [tutorial sulla travatura reticolare](/it/tutorials/truss) ne mostra una passo passo.

### Come inserisco una cerniera in un telaio? {#how-do-i-put-a-hinge-in-a-frame}

Spunta la **cerniera di estremità** dell'elemento che si trova dal lato del nodo in cui il momento deve essere svincolato. Incernierare *un* elemento in un nodo svincola solo quell'elemento.

### Come aggiungo un vincolo o un carico concentrato a metà di una trave? {#how-do-i-add-a-support-or-a-point-load-in-the-middle-of-a-beam}

Aggiungi un nodo sulla trave con *Aggiungi col mouse* e scegli **Collega alla struttura**: la trave viene divisa in due. Per un semplice carico concentrato non serve nemmeno un nodo: usa un carico su elemento di tipo **Carico concentrato** con una posizione.

### Posso applicare il peso proprio? {#can-i-apply-self-weight}

Non automaticamente. Inseriscilo come carico uniformemente distribuito $f_z = \rho g A$.

### Posso modellare vincoli inclinati? {#can-i-model-inclined-supports}

Sì: imposta un **Angolo LCS nodale** sul nodo; i suoi GdL vengono allora interpretati nel sistema ruotato.

### Ci sono casi di carico o combinazioni? {#are-there-load-cases-or-combinations}

No, c'è un solo caso di carico. Modella ogni caso separatamente e salvalo o condividilo.

### Perché i miei carichi puntano verso l'alto? {#why-do-my-loads-point-up}

Perché l'asse z globale punta **verso il basso**: un `Fz` positivo è diretto verso il basso. Vedi le [convenzioni](/it/elements/conventions). Se preferisci un asse verticale rivolto verso l'alto, passa agli assi con y verso l'alto in *Impostazioni → Lingua e impostazioni locali → Sistema di riferimento*.

## Risultati {#results}

### Perché non c'è un pulsante «Calcola»? {#why-is-there-no-solve-button}

Il modello viene risolto automaticamente dopo ogni modifica. Se non compaiono risultati, il modello non è ancora risolvibile: la pagina [Risoluzione dei problemi](/it/reference/troubleshooting) elenca cosa controllare.

### Perché la mia freccia è leggermente diversa dalla formula? {#why-does-my-deflection-differ-slightly-from-the-formula}

EduBeam usa travi di Timoshenko, quindi le frecce includono la deformazione a taglio. Per aste snelle la differenza è ben sotto l'1 %. Dettagli e confronti svolti in [Verificare i risultati a mano](/it/guide/verification).

### Quanto sono accurati i risultati? Servono più elementi? {#how-accurate-are-the-results-do-i-need-more-elements}

Nell'analisi statica lineare l'elemento trave è esatto per i tipi di carico supportati, quindi basta un elemento per asta. Servono nodi aggiuntivi solo dove vuoi un vincolo, una cerniera, un cambio di sezione o un nodo a cui applicare un carico.

### Dove sono elencate le reazioni? {#where-are-the-reactions-listed}

Nella vista, come frecce con i valori (**Reazioni** nelle opzioni di visualizzazione, attive per impostazione predefinita). Si trovano anche nel file di **Risultati → Esporta CSV** e in **Copia**. Spostamenti nodali e forze di estremità degli elementi sono nella scheda **Risultati**.

## File e condivisione {#files-sharing}

### Come condivido un modello? {#how-do-i-share-a-model}

**Condividi modello** → **Copia**. Il link contiene l'intero modello. Chi lo riceve ottiene una propria copia modificabile; non c'è collaborazione in tempo reale. Vedi anche [Insegnare con EduBeam](/it/guide/teaching).

### Posso incorporare un modello nel mio sito o nelle slide? {#can-i-embed-a-model-on-my-website-or-in-slides}

Sì: aggiungi `&viewer=1` a un link condiviso e inseriscilo in un `<iframe>`. Vedi [Incorporare un visualizzatore](/it/essentials/import-export#embed-a-read-only-viewer).

### Posso esportare immagini o tabelle? {#can-i-export-images-or-tables}

Sì. **☰ → Esporta immagine** (<kbd>Ctrl</kbd>+<kbd>P</kbd>) salva il disegno in PNG o SVG, alla dimensione o scala che scegli. **Risultati → Esporta CSV** salva entrambe le tabelle dei risultati, e **Copia** le mette negli appunti per un foglio di calcolo. Vedi [Importazione, esportazione e condivisione](/it/essentials/import-export#export-an-image).

### Posso generare modelli da codice? {#can-i-generate-models-programmatically}

Sì. Il file di progetto è un semplice JSON in unità SI (vedi la [descrizione del formato](/it/essentials/import-export#project-file-format)) e si apre con *Apri progetto* o trascinandolo nell'app.

## Supporto {#support}

### Come segnalo un bug o chiedo una nuova funzione? {#how-do-i-report-a-bug-or-request-a-feature}

Apri una issue su [GitHub](https://github.com/janvorisek/edubeam/issues) e allega un link condiviso o un file di progetto che riproduca il problema. Supporto privato: [support@edubeam.app](mailto:support@edubeam.app).
