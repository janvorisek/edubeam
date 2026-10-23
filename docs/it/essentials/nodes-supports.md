---
description: "Aggiungere e modificare nodi, snap alla griglia, nodi sugli elementi, e definire incastri, cerniere, carrelli e vincoli inclinati, cedimenti e quote."
---

# Nodi e vincoli

I nodi sono i punti del modello. Gli elementi collegano i nodi, e vincoli e carichi nodali sono applicati ai nodi.

## Coordinate {#coordinates}

Ogni nodo ha una coordinata **X** e una **Z** nell'unità di lunghezza corrente. L'asse x punta a destra e l'**asse z punta verso il basso** sullo schermo, quindi una colonna che sale da terra va da `Z = 0` a `Z = −3`, non a `+3`. L'indicatore degli assi nell'angolo della griglia mostra l'orientamento. Se preferisci un asse verticale rivolto verso l'alto, passa agli [assi con y verso l'alto](/it/elements/conventions#y-up-axes) nelle Impostazioni.

## Aggiungere nodi {#adding-nodes}

| Metodo | Come |
| --- | --- |
| **Finestra di dialogo** | Scheda *Nodi* → il primo pulsante **Aggiungi nodo**, oppure clic destro nell'area di disegno → *Aggiungi nodo*. Inserisci X e Z e, se vuoi, i vincoli e l'angolo del vincolo. |
| **Mouse** | Scheda *Nodi* → il secondo pulsante **Aggiungi nodo** (icona del cursore), oppure tieni premuto <kbd>Ctrl</kbd> mentre scegli *Aggiungi nodo* nel menu dell'area di disegno. Ogni clic nell'area di disegno aggiunge un nodo. Premi <kbd>Esc</kbd> o **Annulla** per terminare. |
| **Mentre disegni gli elementi** | Nella modalità mouse per gli elementi, un clic su un'area vuota crea un nodo e lo collega. |
| **Copia e incolla** | Seleziona i nodi (e gli elementi), premi <kbd>Ctrl</kbd>+<kbd>C</kbd> e <kbd>Ctrl</kbd>+<kbd>V</kbd>, poi fai clic dove deve andare la copia, oppure digita uno spostamento Δx, Δz e premi **Incolla**. |

<div class="shots">

![La finestra Aggiungi nodo](/screenshots/it/qs-node.webp)

![In modalità mouse, un banner in alto imposta vincoli e angolo di ogni nodo che posizioni](/screenshots/it/nodes-add-banner.webp)

</div>

Le etichette sono assegnate automaticamente (`1`, `2`, … oppure proseguendo il tuo schema, ad es. `A`, `B`) e si possono rinominare nella tabella.

### Snap {#snapping}

Con **Snap alla griglia** attivo (<kbd>S</kbd> o l'indicatore **S**), i nodi che posizioni o trascini cadono su multipli del **Passo dello snap**: 0,1 m per impostazione predefinita, o 0,5 ft in unità statunitensi. Lo cambi in *Impostazioni → Impostazioni della vista → Griglia*. Disattiva lo snap per un posizionamento libero, oppure digita in seguito le coordinate esatte nella tabella.

### Posizionare un nodo su un elemento esistente {#placing-a-node-on-an-existing-element}

Se mentre aggiungi un nodo fai clic vicino a un elemento, EduBeam ti chiede cosa intendi:

- **Collega alla struttura** divide l'elemento in due (`1a` e `1b`). Le cerniere alle estremità esterne vengono mantenute, e i carichi uniformi e trapezoidali vengono ripartiti tra le due metà; i carichi concentrati e termici vanno alla prima metà. È il modo più rapido per aggiungere un appoggio intermedio o un punto di carico.
- **Posiziona nodo isolato** crea il nodo sopra l'elemento senza collegarlo.

## Modificare i nodi {#editing-nodes}

- **Tabella:** modifica direttamente etichetta, X e Z.
- **Trascinamento:** sposta un nodo nella vista, anche su uno schermo touch: premi il nodo e trascina. Ogni spostamento si può annullare.
- **Finestra Modifica nodo:** la matita nella colonna *Azioni* della tabella. Contiene coordinate, vincoli e angolo del vincolo, con un'anteprima del simbolo del vincolo.
- **Eliminazione:** la × nella tabella, *Elimina* nel pannello del nodo, oppure selezionalo e premi <kbd>Delete</kbd>. Eliminare un nodo elimina anche gli elementi e i carichi a esso collegati.

## Vincoli {#supports}

Un vincolo è un insieme di gradi di libertà (GdL) bloccati. Ogni nodo ne ha tre:

| GdL | Significato |
| --- | --- |
| **Dx** | traslazione lungo x (orizzontale) |
| **Dz** | traslazione lungo z (verticale) |
| **Ry** | rotazione attorno a y (nel piano del disegno) |

Il modo più rapido è **scegliere il simbolo**. Lo trovi nel pannello del nodo sotto **Vincoli del nodo**, nelle finestre Aggiungi nodo e Modifica nodo, e come piccolo menu all'inizio della colonna *GdL vincolati* della tabella Nodi. Spuntare le caselle `Dx`, `Dz`, `Ry` fa la stessa cosa un GdL alla volta.

![Vincoli del nodo: scegli un simbolo, o spunta i GdL, e imposta l'angolo del vincolo](/screenshots/it/nodes-support-picker.webp){.shot-lg}

| Vincolo | Bloccati | Movimento | Reazioni |
| --- | --- | --- | --- |
| **Libero** | nessuno | tutto | nessuna |
| **Cerniera** | Dx + Dz | ruota | R<sub>x</sub>, R<sub>z</sub> |
| **Carrello** | Dz | scorre in orizzontale, ruota | R<sub>z</sub> |
| **Carrello verticale** | Dx | scorre in verticale, ruota | R<sub>x</sub> |
| **Incastro** | Dx + Dz + Ry | nulla | R<sub>x</sub>, R<sub>z</sub>, M |
| **Pattino** | Dz + Ry | scorre in orizzontale | R<sub>z</sub>, M |
| **Pattino verticale** | Dx + Ry | scorre in verticale | R<sub>x</sub>, M |
| **Solo rotazione bloccata** | Ry | scorre in entrambe le direzioni | M |

Per ogni GdL bloccato viene calcolata, e disegnata, una reazione.

::: tip Nodi delle travature reticolari
Le aste reticolari sono elementi trave con entrambe le **cerniere di estremità** svincolate (vedi [Elementi](/it/essentials/elements#end-hinges)). Per il vincolo di una travatura reticolare la scelta abituale è una cerniera (Dx + Dz). Un nodo in cui tutti gli elementi collegati sono incernierati non ha rigidezza rotazionale; EduBeam lo accetta e ne riporta la rotazione come 0.
:::

### Vincoli inclinati {#inclined-skewed-supports}

Imposta l'**Angolo LCS nodale** α in gradi (−180…180). Lo trovi nel pannello del nodo sotto *Vincoli del nodo*, nelle finestre Aggiungi nodo e Modifica nodo, e nel campo α della tabella Nodi. Gli assi del nodo ruotano di quell'angolo e i GdL vincolati agiscono nelle direzioni ruotate, quindi un carrello su un piano inclinato di 30° è `Dz` con α = 30. Il simbolo ruota di conseguenza e la reazione è riportata nella direzione ruotata.

### Stabilità {#stability}

Il solutore richiede in totale almeno **tre GdL vincolati**, e vincoli e cerniere devono trattenere la struttura. Finché i vincoli non bastano, la vista mostra un indicatore blu *Servono vincoli*. Se i vincoli sono sufficienti di numero ma non trattengono la struttura (tutti paralleli, o concorrenti in un punto), oppure le cerniere lasciano ruotare le aste l'una rispetto all'altra, un messaggio rosso indica il problema e un contorno tratteggiato mostra come si muove la struttura. Vedi [Risoluzione dei problemi](/it/reference/troubleshooting).

## Carichi nodali e cedimenti {#nodal-loads-and-settlements}

Forze, momenti e spostamenti imposti (cedimenti vincolari) si applicano ai nodi. Vedi [Carichi](/it/essentials/loads#nodal-loads).

## Quote {#dimension-lines}

Clic destro nell'area di disegno → **Aggiungi quota** per disegnare una quota tra due punti, oppure clic destro su un elemento → **Quota l'elemento** per quotarlo direttamente. Gli estremi si agganciano ai nodi quando li trascini vicino. Seleziona una quota e usa **Modifica** per digitarne le coordinate, oppure **Inverti quota** per spostare l'etichetta dall'altro lato. Le quote sono solo grafiche; vengono salvate con il progetto e viaggiano nei link condivisi.
