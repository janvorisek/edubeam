---
description: "Salvare e aprire file di progetto, condividere un modello come link, esportare immagini e risultati, incorporare un visualizzatore e usare i parametri URL. Tutto resta nel tuo browser."
---

# Importazione, esportazione e condivisione

In <Edubeam /> tutto avviene nel tuo browser. Nulla viene caricato su un server: un link condiviso contiene letteralmente il modello.

## Salvare un progetto {#save-a-project}

**☰ → Salva progetto** o <kbd>Ctrl</kbd>+<kbd>S</kbd> scarica `project.json`. Contiene nodi, elementi, materiali, sezioni (con le forme poligonali), carichi, quote e la versione dell'app che lo ha scritto. Puoi rinominare il file liberamente.

## Aprire un progetto {#open-a-project}

- **☰ → Apri progetto** o <kbd>Ctrl</kbd>+<kbd>O</kbd>, poi scegli un file `.json`, oppure
- **trascina il file in un punto qualsiasi della finestra dell'app**.

L'apertura sostituisce il modello corrente, compresi materiali e sezioni. Il modello che avevi non va perso: <kbd>Ctrl</kbd>+<kbd>Z</kbd> lo riporta indietro, e viene conservato in [Strutture recenti](#recent-structures). Un file che non è un progetto EduBeam viene rifiutato con un messaggio, e il tuo modello resta com'era.

I file di progetto di tutte le versioni precedenti di EduBeam si aprono in quella attuale.

## Condividere un link {#share-a-link}

**Condividi modello** (nella barra dell'app o nel menu ☰) apre la finestra *Condividi il modello tramite URL*:

![La finestra di condivisione](/screenshots/it/share.webp){.shot-lg}

- **Copia** copia il link negli appunti. Fare clic dentro il campo fa lo stesso.
- **Apri link** lo apre in una nuova scheda, così puoi controllare cosa vedrà chi lo riceve.
- **Condividi tramite il sistema** passa il link al menu di condivisione del dispositivo, se il browser lo supporta.
- **Link più corto** scrive lo stesso modello in circa metà dei caratteri. Una copia di <Edubeam /> non aggiornata da ottobre 2026 non riesce a leggerlo finché non si aggiorna, quindi lascialo disattivato quando un link deve aprirsi subito ovunque.

Il link ha la forma `https://run.edubeam.app/?model=…` e codifica l'intero modello. Chi lo apre ottiene una propria copia da modificare; le modifiche **non** vengono sincronizzate all'indietro, quindi invia un nuovo link quando il modello cambia. Modelli molto grandi producono link molto lunghi; in questi casi condividi piuttosto il file JSON.

Quando qualcuno apre un link, il suo modello precedente finisce in Strutture recenti, e un messaggio gli dice dove trovarlo.

I link delle versioni precedenti continuano a funzionare: un link nelle dispense dell'anno scorso apre oggi lo stesso modello.

## Esportare un'immagine {#export-an-image}

**☰ → Esporta immagine** o <kbd>Ctrl</kbd>+<kbd>P</kbd> apre l'esportazione dell'immagine.

![Esporta immagine: scegli i livelli, l'inquadratura e la dimensione, poi scarica o copia](/screenshots/it/export-image.webp)

- **Livelli**: le etichette in alto scelgono cosa disegnare, indipendentemente dalla vista: deformata, N, V, M, reazioni, vincoli, carichi, etichette di nodi ed elementi.
- **Inquadratura**: scegli un rapporto d'aspetto (16:9, 4:3, 3:2, 1:1), **Adatta tutto**, oppure **Finestra…** per trascinare un rettangolo sul disegno. Puoi anche trascinare i bordi dell'anteprima.
- **Dimensione**: larghezza e altezza in pixel, oppure una **Scala** come 1 : 50 per un disegno in scala su carta. **Altezza dei diagrammi** imposta la dimensione dei diagrammi dei risultati nell'immagine. **Sfondo trasparente** elimina il bianco.
- **Scarica PNG**, **Scarica SVG** o **Copia negli appunti**.

L'SVG resta nitido a qualsiasi dimensione e funziona in Word, Inkscape e LaTeX su Overleaf, il che lo rende la scelta migliore per relazioni e tesi.

## Esportare i risultati {#export-the-results}

**Risultati → Esporta CSV** scarica entrambe le tabelle dei risultati, reazioni comprese, e **Copia** le mette negli appunti per un foglio di calcolo. Vedi [Esporta CSV e Copia](/it/essentials/results#export-csv-and-copy).

## Strutture recenti {#recent-structures}

**☰ → Strutture recenti** conserva gli ultimi 10 modelli cancellati o sostituiti da un link, un file, un esempio o l'esercizio della prima trave. Ognuno mostra un'anteprima, il motivo della sostituzione e la sua dimensione. **Ripristina** ne riporta indietro uno; il modello che avevi finisce a sua volta nell'elenco, e <kbd>Ctrl</kbd>+<kbd>Z</kbd> annulla il ripristino.

![Strutture recenti](/screenshots/it/recent.webp){.shot-lg}

L'elenco è salvato solo in questo browser.

## Esempi {#examples}

**☰ → Esempi** apre una galleria di modelli didattici già pronti. Aprirne uno sostituisce il tuo modello, e <kbd>Ctrl</kbd>+<kbd>Z</kbd> riporta indietro il tuo. Gli stessi modelli, con esercizi, si trovano nella pagina [Esempi](/it/examples/) di questa guida.

![La galleria degli esempi](/screenshots/it/examples.webp){.shot-lg}

## Incorporare un visualizzatore {#embed-a-read-only-viewer}

Aggiungi `&viewer=1` a un link condiviso per aprire il modello in **modalità visualizzatore**. La barra dell'app, la barra inferiore, le schede, Annulla e Ripeti, gli indicatori della griglia e l'indicatore degli assi sono nascosti; restano l'area di disegno, i pulsanti per adattare e centrare e le opzioni di visualizzazione. Inserisci quell'URL in un `<iframe>` per incorporare un modello interattivo e zoomabile nelle dispense o in una pagina web:

```html
<iframe src="https://run.edubeam.app/?viewer=1&model=…" width="100%" height="400"></iframe>
```

![Il telaio a tre cerniere in modalità visualizzatore](/screenshots/it/viewer-mode.webp){.shot-lg}

La modalità visualizzatore serve per guardare, ma non è bloccata: i visitatori possono comunque trascinare i nodi e cambiare diagramma. Aprire un link in modalità visualizzatore sostituisce inoltre il modello del visitatore in quel browser (che finisce in Strutture recenti), proprio come un link normale.

## Parametri URL {#url-parameters}

| Parametro | Effetto |
| --- | --- |
| `model=<data>` | Carica il modello codificato e lo adatta allo schermo. |
| `viewer=1` | Modalità visualizzatore (vedi sopra). |
| `lang=<code>` | Cambia la lingua dell'interfaccia: `en`, `cs`, `de`, `fr`, `es`, `pt`, `pl`, `cn`, `th`, `uk`, `ru`, `tr`, `hi`, `vi`, `it`, `id`. |
| `panel=examples` | Apre subito la galleria degli esempi. |

Dopo averli letti, EduBeam rimuove i parametri dalla barra degli indirizzi.

## Salvataggio automatico {#automatic-persistence}

Il modello corrente e le tue impostazioni vengono salvati nella memoria locale del browser dopo ogni modifica e ripristinati quando torni, anche dopo aver chiuso il browser. È una comodità, non un backup: appartiene a un profilo del browser su un dispositivo, e cancellare i dati del sito lo rimuove. Salva il lavoro importante come file di progetto.

## Formato del file di progetto {#project-file-format}

`project.json` è un JSON semplice e leggibile:

```json
{
  "edubeam": true,
  "version": "1.3.1",
  "domain": {
    "materials": [{ "label": "1", "e": 210000000000, "g": 81000000000, "alpha": 0.000012, "d": 7850 }],
    "crossSections": [{ "label": "1", "a": 0.00285, "iy": 1.943e-5, "h": 0.2, "k": 1 }],
    "nodes": [
      { "label": "1", "coords": [0, 0, 0], "bcs": [0, 2] },
      { "label": "2", "coords": [6, 0, 0], "bcs": [2] }
    ],
    "elements": [{ "label": "1", "nodes": ["1", "2"], "mat": "1", "cs": "1", "hinges": [false, false] }],
    "loadCases": [
      {
        "label": "1",
        "nodalLoads": [],
        "elementLoads": [{ "type": "udl", "target": "1", "lcs": false, "values": [0, 12000] }],
        "prescribedBC": []
      }
    ]
  },
  "dimensions": []
}
```

Questa è la trave dell'Avvio rapido. Tutti i valori sono in **unità SI** (m, N, Pa, rad), qualunque siano le unità visualizzate. Le coordinate sono `[x, y, z]`, con y sempre 0. Condizioni al contorno e componenti dei carichi usano gli id dei GdL `0 = Dx`, `2 = Dz`, `4 = Ry`.

| `type` del carico su elemento | Valori |
| --- | --- |
| `udl` | `values: [fx, fz]` in N/m |
| `trapezoidal` | `startValues: [f1x, f1z]`, `endValues: [f2x, f2z]` in N/m, assi locali |
| `concentrated` | `values: [Fx, Fz, My, a]` in N, N·m e m dal nodo iniziale |
| `temperature` | `values: [ΔTc, ΔTb, ΔTt]` in K; il gradiente è ΔTb − ΔTt |

I carichi nodali sono `{ "target": "2", "values": { "0": Fx, "2": Fz, "4": My } }` e gli spostamenti imposti `{ "target": "2", "prescribedValues": { "0": Dx, "2": Dz, "4": Ry } }`; indica tutte e tre le componenti. I file scritti dall'app contengono anche `date`, `commit`, un `lcs` nodale e le forme poligonali `shape`.

Dato che il formato è semplice, puoi generare modelli con uno script o un foglio di calcolo e aprirli con **Apri progetto**.
