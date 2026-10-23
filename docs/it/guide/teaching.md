---
description: "Usare EduBeam a lezione e nelle esercitazioni: link condivisi nelle dispense, una modalità visualizzatore da incorporare, esercizi autoverificabili e uso nei laboratori informatici."
---

# Insegnare con EduBeam

<Edubeam /> è nato in un'aula universitaria, ed è ancora lì che rende al meglio: un modello sul proiettore che reagisce non appena lo modifichi, e lo stesso modello sul portatile di ogni studente grazie a un link. Questa pagina raccoglie ciò che i docenti usano di più.

## A lezione {#in-the-lecture}

- **Rendilo leggibile dall'ultima fila.** In *Impostazioni → Impostazioni della vista*, porta la **Dimensione del carattere** a 18–20 px e la **Dimensione dei vincoli** al 130–150 %. Aumenta la **Scala dei risultati** se su un grande schermo i diagrammi sembrano troppo piccoli.
- **Mostra una cosa alla volta.** Nelle opzioni di visualizzazione togli la spunta a tutto tranne la grandezza di cui stai parlando, poi aggiungi le altre una per una.
- **Modifica il modello dal vivo.** Trascina un vincolo, spunta `Ry`, aggiungi una cerniera. Gli studenti vedono subito causa ed effetto, e <kbd>Ctrl</kbd>+<kbd>Z</kbd> ti riporta indietro.
- **Lascia che sia il solutore a spiegare i meccanismi.** Inserisci una cerniera di troppo ed EduBeam fa oscillare il contorno tratteggiato del meccanismo e cerchia le cerniere responsabili. È un buon momento per parlare di labilità.
- **Usa la lingua e gli assi degli studenti.** Scegli la lingua dell'interfaccia, unità SI o statunitensi e assi con z verso il basso o y verso l'alto, in linea con le tue dispense.

![Un meccanismo reso visibile: le cerniere in B e C permettono al telaio di traslare lateralmente](/screenshots/it/ui-mechanism.webp)

## Nelle dispense e nelle esercitazioni {#in-lecture-notes-and-assignments}

Un link condiviso contiene l'intero modello, quindi funziona ovunque funzioni un link: un PDF, una slide, una pagina della piattaforma e-learning, un'e-mail.

1. Costruisci il modello e premi **Condividi modello → Copia**.
2. Incolla il link nelle tue dispense. I link delle versioni precedenti di EduBeam continuano a funzionare, quindi le dispense restano valide anno dopo anno.
3. Gli studenti che lo aprono ottengono una propria copia con cui sperimentare. Nulla di ciò che cambiano arriva a te o agli altri studenti.

Varianti utili del link:

| Link | Apre |
| --- | --- |
| `https://run.edubeam.app/?model=…` | Il modello, pronto da modificare |
| `https://run.edubeam.app/?viewer=1&model=…` | Il modello in [modalità visualizzatore](/it/essentials/import-export#embed-a-read-only-viewer), da incorporare in un `<iframe>` |
| `https://run.edubeam.app/?panel=examples` | La galleria degli esempi |
| `https://run.edubeam.app/?lang=it` | L'app in italiano (o in qualsiasi [altro codice di lingua](/it/essentials/import-export#url-parameters)) |

::: warning Aprire un link sostituisce il modello dello studente
Il modello che aveva finisce in **☰ → Strutture recenti** e può essere ripristinato, e un messaggio lo segnala. Consiglia comunque agli studenti di salvare il lavoro importante con **Salva progetto** prima di aprire i link del corso.
:::

## Esercitazioni che gli studenti verificano da soli {#assignments-students-can-check-themselves}

EduBeam dà agli studenti un riscontro immediato sui calcoli a mano senza svelare il procedimento:

- Chiedi di calcolare a mano reazioni, forze interne e uno spostamento, poi fai costruire il modello agli studenti e confrontare i risultati. [Verificare i risultati a mano](/it/guide/verification) contiene formule pronte.
- Chiedi *perché* un risultato è diverso: deformazione a taglio, una cerniera mancante, un carico negli assi locali anziché globali.
- Chiedi agli studenti di consegnare un link condiviso o un `project.json` insieme al calcolo. Puoi aprirlo e vedere esattamente cosa hanno modellato.
- Per le relazioni, gli studenti possono esportare il disegno in **SVG** (nitido in Word e LaTeX) e i risultati in **CSV**.

## Esercizi pronti {#ready-made-exercises}

- La pagina [Esempi](/it/examples/) contiene sei modelli, ciascuno con esercizi suggeriti.
- I tutorial sul [telaio a tre cerniere](/it/tutorials/three-hinged-frame) e sulla [travatura reticolare piana](/it/tutorials/truss) sono esempi svolti completi con verifiche a mano.
- L'[Avvio rapido](/it/guide/quick-start) funziona come scheda per la prima esercitazione: richiede circa dieci minuti.

## Come far iniziare gli studenti {#getting-students-started}

I nuovi utenti vedono una finestra di benvenuto con due opzioni guidate: **Fammi fare un giro** (una panoramica dell'interfaccia) e **Disegna la tua prima trave** (un esercizio in sette passi con il mouse). Entrambe sono anche nel menu ☰. Molti docenti all'inizio della prima esercitazione dicono semplicemente: «aprite run.edubeam.app e scegliete *Disegna la tua prima trave*».

## Offline e computer di laboratorio {#offline-and-lab-computers}

EduBeam è una progressive web app. Una volta caricata su un computer, continua a funzionare senza connessione, e il browser può proporre di installarla. Modelli e impostazioni sono salvati per profilo del browser, quindi sui computer condivisi dei laboratori gli studenti dovrebbero salvare il lavoro come file o link.
