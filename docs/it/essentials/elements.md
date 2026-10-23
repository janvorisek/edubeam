---
description: "Aggiungere elementi trave, impostare cerniere di estremità e verso dell'elemento, e definire materiali e sezioni in EduBeam, comprese le sezioni poligonali personalizzate."
---

# Elementi, materiali e sezioni

## L'elemento trave {#the-beam-element}

<Edubeam /> ha un solo tipo di elemento: una **trave di Timoshenko 2D** nel piano x–z con tre gradi di libertà a ciascuna estremità (`Dx`, `Dz`, `Ry`). Porta sforzo normale, taglio e flessione, e include la deformazione a taglio, motivo per cui la sezione ha un fattore di taglio. La formulazione completa è nel [manuale teorico](/it/elements/beam).

<TrussElement :moment="true" caption="Elemento trave 2D – tre GdL per nodo" />

Per il modello lineare i risultati lungo un elemento sono esatti, quindi basta un elemento per asta. Aggiungi nodi intermedi solo dove ti serve un vincolo, una cerniera, un cambio di sezione o un nodo in cui leggere i risultati.

### Aggiungere elementi {#adding-elements}

| Metodo | Come |
| --- | --- |
| **Finestra di dialogo** | Scheda *Elementi* → il primo pulsante **Aggiungi elemento**, oppure menu dell'area di disegno → *Aggiungi elemento*. Scegli il **Nodo iniziale** e il **Nodo finale**, le cerniere, il materiale e la sezione. |
| **Mouse** | Scheda *Elementi* → il secondo pulsante **Aggiungi elemento** (icona del cursore), oppure tieni premuto <kbd>Ctrl</kbd> con la voce del menu dell'area di disegno. Fai clic su un nodo per iniziare, poi sul nodo successivo per collegarlo; un clic su un'area vuota crea lì un nodo. Continua a fare clic per disegnare una polilinea e premi <kbd>Esc</kbd> per terminare. Il banner in alto imposta **Cerniera iniziale** e **Cerniera finale** per ogni elemento che disegni. Vengono usati il primo materiale e la prima sezione del modello. |

![La finestra Aggiungi elemento](/screenshots/it/qs-element.webp){.shot-md}

::: warning Prima materiali e sezioni
Un elemento ha bisogno di un materiale e di una sezione. Se non ce ne sono, la vista mostra *Nessun materiale definito* / *Nessuna sezione definita* con un pulsante **Aggiungi**.
:::

### Verso dell'elemento {#element-direction}

L'**asse x locale** va dal nodo iniziale al nodo finale. Questo conta per:

- i carichi in coordinate locali (**LCS** spuntato),
- la *Posizione del carico dal nodo iniziale* dei carichi concentrati,
- l'ordine delle forze di estremità (`X12, Z12, M12` all'inizio, `X21, Z21, M21` alla fine) nella tabella dei risultati.

Usa il pulsante di scambio tra i due nodi nella tabella *Elementi* per invertire un elemento.

### Cerniere di estremità {#end-hinges}

Ogni elemento ha due caselle **Cerniere di estremità**, inizio e fine, nella tabella *Elementi*. Si trovano anche nella finestra Aggiungi elemento, nel pannello **Modifica elemento** dell'elemento e nel banner quando disegni con il mouse. Una cerniera spuntata svincola il momento flettente a quell'estremità, quindi:

- una cerniera crea una cerniera interna in un telaio o in una trave continua (lì il momento è nullo);
- due cerniere creano un'**asta reticolare** che porta solo sforzo normale.

<TrussElement :hinges="[true, true]" caption="Entrambe le estremità incernierate → elemento reticolare" />

![La tabella Elementi del telaio a tre cerniere: l'elemento 2 ha una cerniera alla fine, nel nodo C](/screenshots/it/elements-table.webp)

Quando due elementi si incontrano in un nodo e solo uno dei due è incernierato, l'altro continua a trasmettere momento al nodo. Incerniera quindi l'elemento che vuoi svincolare, non «il nodo». Se le cerniere rendono la struttura un meccanismo, EduBeam le cerchia e mostra come si muove.

### Modificare ed eliminare {#editing-and-deleting}

Fai clic su un elemento e usa il suo pannello (**Modifica elemento**, **Aggiungi carico**, **Matrice di rigidezza**, **Elimina**), oppure modificalo nella tabella *Elementi*. Eliminare un elemento rimuove anche i suoi carichi. **Matrice di rigidezza** apre una finestra con la matrice di rigidezza 6 × 6 dell'elemento in coordinate globali (N/m, N e N·m), con le eventuali cerniere di estremità già condensate. È comoda per controllare un assemblaggio fatto a mano.

## Materiali {#materials}

Scheda *Materiali* → **Aggiungi materiale**:

| Campo | Simbolo | Unità | Note |
| --- | --- | --- | --- |
| Modulo di Young | $E$ | unità di pressione (MPa per impostazione predefinita) | Acciaio ≈ 210 000 MPa, calcestruzzo ≈ 30 000 MPa, legno ≈ 11 000 MPa |
| Modulo di taglio | $G$ | unità di pressione | $G = E / (2(1+\nu))$; acciaio ≈ 81 000 MPa. Influisce solo sul termine di taglio di Timoshenko. |
| Densità | $\rho$ | massa / lunghezza³ (kg/m³, lb/ft³) | Salvata con il progetto. Il solutore statico non la usa (non c'è un carico da peso proprio). |
| Coefficiente di dilatazione termica | $\alpha$ | 1/K o 1/°F | Usato dai [carichi termici](/it/essentials/loads#temperature-load). Acciaio: 12 × 10⁻⁶ /K. |

<div class="shots">

![Aggiungi materiale](/screenshots/it/qs-material.webp)

![La Libreria materiali](/screenshots/it/qs-material-library.webp)

</div>

**Libreria materiali** contiene materiali già pronti. La famiglia che corrisponde alle tue unità è elencata per prima.

- **Metalli:** acciai da carpenteria S235, S275, S355, acciai inossidabili, ghisa, leghe di alluminio, rame, ottone, bronzo, titanio; acciai statunitensi ASTM A992, A36, A572 Gr. 50 e HSS A500 Gr. C.
- **Calcestruzzo:** calcestruzzo normale e leggero, classi C25/30, C30/37, C40/50, e f′c = 4 ksi e 5 ksi.
- **Legno:** C24, GL24h, GL32h.
- **Altro:** vetro, GFRP, CFRP, HDPE, PVC, PMMA, policarbonato.

Aprila con il pulsante della barra degli strumenti o con *Oppure scegli dalla libreria* nella finestra *Aggiungi materiale*.

Un materiale ancora usato da qualche elemento non si può eliminare; prima riassegna quegli elementi.

## Sezioni {#cross-sections}

Scheda *Sezioni* → **Aggiungi sezione**:

| Campo | Simbolo | Unità | Note |
| --- | --- | --- | --- |
| Area | $A$ | unità di area | Rigidezza assiale $EA$ |
| Momento d'inerzia | $I_y$ | unità del momento d'inerzia | Rigidezza flessionale $EI_y$ rispetto all'asse perpendicolare al disegno |
| Altezza | $h$ | unità delle dimensioni della sezione | Usata dai carichi a gradiente termico (curvatura $= \alpha\,\Delta T / h$) |
| Fattore di taglio | $k$ | – | Fattore di correzione a taglio di Timoshenko: l'area efficace a taglio è $kA$. Usa `1` per trascurare quasi del tutto la deformazione a taglio, circa 0,83 per i rettangoli, $A_{web}/A$ per le sezioni a I. |

**Libreria sezioni** fornisce valori approssimati per rettangoli, quadrati e cerchi, profili IPE e HEA, tubi RHS e CHS, e i profili AISC W e HSS (rettangolari e circolari). I suoi fattori di taglio dipendono dalla forma: $h\,t_w/A$ per i profili a I, $2ht/A$ per i tubi rettangolari, 0,5 per i tubi circolari, 0,833 per i rettangoli e 0,9 per i cerchi. Considera i valori come punto di partenza e confrontali con un sagomario prima di farvi affidamento.

![La Libreria sezioni](/screenshots/it/sections-library.webp){.shot-lg}

### Sezioni poligonali {#polygonal-sections}

Scheda *Sezioni* → **Sezione poligonale**, oppure *Oppure definisci una forma poligonale* nella finestra *Aggiungi sezione*, apre un editor della forma.

![L'editor delle sezioni poligonali con una forma predefinita a I, i suoi assi principali e l'ellisse d'inerzia](/screenshots/it/sections-polygon.webp)

- **Parti** da una forma predefinita (rettangolo, I, T, L, U, rettangolare o circolare cava, cerchio) con le sue dimensioni, poi premi **Applica**.
- **Modifica** la forma: trascina i vertici (si agganciano al **Passo dello snap**), fai clic sul punto medio di un lato per inserire un vertice, fai doppio clic su un vertice per rimuoverlo, oppure digita le coordinate nella tabella dei vertici. **Aggiungi foro** aggiunge un contorno interno. **Centra sul baricentro** sposta la forma in modo che il baricentro sia nell'origine.
- **Leggi** l'area $A$, il baricentro, i momenti d'inerzia baricentrici $I_y$, $I_z$, $I_{yz}$, i momenti principali $I_1$, $I_2$ con l'angolo degli assi principali $\alpha$ (da $y$ all'asse 1) e i raggi d'inerzia. Il disegno mostra l'ellisse d'inerzia.

Al salvataggio, $A$, $I_y$ e $h$ vengono compilati a partire dalla forma. Nella tabella sono in sola lettura; usa il pulsante del poligono nella colonna *Azioni* per modificare di nuovo la forma. Il fattore di taglio $k$ resta da inserire a te. Le coordinate della sezione sono locali e destrorse, con $x$ uscente dallo schermo, $y$ verso sinistra e $z$ verso il basso.

Se la forma non è simmetrica rispetto al piano del telaio (un angolare a L, per esempio), l'editor avverte che un'analisi 2D è esatta solo se l'asta è trattenuta contro l'inflessione laterale e la torsione lungo tutta la sua lunghezza, per esempio da un solaio. Quando $I_{yz}$ è significativo, scegli quale rigidezza flessionale usare: **Trattenuta lateralmente e contro la torsione lungo la lunghezza** ($I_y$) oppure **Libera di inflettersi lateralmente**, che è inferiore. In nessuno dei due casi la torsione è inclusa.

::: tip Valori rapidi di controllo
Per un rettangolo $b \times h$: $A = bh$, $I_y = bh^3/12$. Per un cerchio pieno di diametro $d$: $A = \pi d^2/4$, $I_y = \pi d^4/64$.
:::

Materiali e sezioni possono essere condivisi da un numero qualsiasi di elementi. Cambiare un valore aggiorna ogni elemento che lo usa e risolve di nuovo il modello.
