---
description: "Perché non compaiono risultati e come rimediare: vincoli mancanti, meccanismi, messaggi del solutore, errori e avvisi, risultati che sembrano sbagliati e segnalazione di un bug."
---

# Risoluzione dei problemi

## Non compare nessun risultato {#no-results-are-drawn}

I risultati compaiono solo quando il modello si può risolvere. Controlla, in quest'ordine:

1. **Leggi il messaggio in alto a sinistra nella vista.**
   - *Nessun materiale definito* / *Nessuna sezione definita*: aggiungine uno con il pulsante **Aggiungi**.
   - Un indicatore blu **Servono vincoli**: il modello è semplicemente incompleto. Aggiungi i vincoli. Passa sull'indicatore per vedere, come contorno tratteggiato, in che modo la struttura può ancora muoversi.
   - Un **messaggio rosso**: qualcosa non va. Indica il problema, oppure riporta *Errori nel modello: N* quando ce ne sono diversi. Fai clic su **Mostra dettagli** e correggi ogni voce (vedi la tabella qui sotto). I nodi o le cerniere coinvolti sono cerchiati nell'area di disegno.
   - Un **messaggio giallo**: avvisi. Il modello è stato risolto comunque; puoi nasconderli.
2. **Ci sono abbastanza vincoli?** Il solutore richiede almeno tre GdL vincolati, e i vincoli devono trattenere la struttura. Una trave su due carrelli (Dz + Dz) ne ha solo due e scivola via. Aggiungi un `Dx` da qualche parte, oppure un `Ry` in uno dei vincoli.
3. **Gli elementi sono collegati?** Due nodi con le stesse coordinate restano due nodi separati. Elimina quello in più e ricollega, oppure posiziona i nodi sugli elementi con **Collega alla struttura**.
4. **Troppe cerniere?** Cerniere a entrambe le estremità di una colonna, o un quadrato di aste incernierate senza diagonale, formano un meccanismo. EduBeam cerchia le cerniere e mostra il movimento.
5. **Una rigidezza nulla?** `E`, `A` o `Iy` inseriti per errore come 0, o nell'unità sbagliata, fanno muovere parte della struttura quasi senza resistenza. EduBeam la segnala come *labile*.

![Mostra dettagli elenca ogni problema con un suggerimento e può mostrare il movimento](/screenshots/it/ui-diagnostics.webp){.shot-lg}

## Messaggi {#messages}

**Mostra dettagli** apre una finestra intitolata *Impossibile risolvere il modello* (errori), *Non ancora pronto per il calcolo* (servono ancora vincoli) o *Avvisi del modello*. Il suo link **Risoluzione dei problemi** porta qui.

### Ancora da fare {#still-needed}

| Messaggio | Significato / soluzione |
| --- | --- |
| *La struttura va vincolata prima di poter essere risolta.* | Meno di tre GdL vincolati in totale. Aggiungi vincoli. |
| *Una parte separata della struttura (nodi …) ha meno di 3 GdL vincolati e può muoversi liberamente.* | Il modello è in più pezzi e uno di essi è libero. Collegalo, oppure vincolalo. |

### Errori {#errors}

| Messaggio | Significato / soluzione |
| --- | --- |
| *La struttura ha abbastanza vincoli, ma questi non la trattengono: può ancora …* | I vincoli sono tutti paralleli, oppure le loro rette d'azione passano per uno stesso punto. Il contorno tratteggiato mostra il movimento; cambia la direzione di un vincolo. Lo stesso messaggio parla di una *parte separata* se è coinvolto un solo pezzo. |
| *I vincoli trattengono la struttura, ma questa è ancora un meccanismo: le sue aste possono ruotare attorno alle cerniere nel nodo …* | Le cerniere lasciano ruotare le aste l'una rispetto all'altra, come in un telaio con cerniere in sommità a entrambe le colonne o in un quadrato incernierato senza diagonale. Rimuovi una cerniera, oppure aggiungi un'asta o un vincolo. |
| *La struttura è labile: il nodo … si muove praticamente senza resistenza.* | Quasi un meccanismo, o una rigidezza prossima a zero. Controlla vincoli, cerniere e i valori di `E`, `A` e `Iy`. |
| *La struttura è un meccanismo: la matrice di rigidezza è singolare.* | Qualcosa può muoversi liberamente senza che i controlli precedenti lo abbiano rilevato. Verifica che ogni parte sia trattenuta da almeno tre vincoli e che le cerniere non lascino un'asta libera di ruotare. |
| *L'elemento … si riferisce al nodo / materiale / alla sezione inesistente …* | L'oggetto a cui si riferisce è stato eliminato, di solito in un file JSON modificato a mano. Riassegnalo nella tabella *Elementi*. |
| *L'elemento … deve riferirsi esattamente a 2 nodi.* | Un elemento danneggiato in un file importato. Eliminalo e ricrealo. |
| *Il carico nodale / Lo spostamento imposto #n si riferisce al nodo inesistente …* | Elimina il carico oppure assegnagli un nodo. |
| *Il carico su elemento #n si riferisce all'elemento inesistente …* | Elimina il carico. |
| *Il solutore si è interrotto per un'incoerenza interna del modello…* | Un errore generico. Annulla l'ultimo passo, oppure salva il file e [segnalalo](https://github.com/janvorisek/edubeam/issues). |

### Avvisi {#warnings}

Il modello viene risolto comunque, ma controlla questi punti:

| Messaggio | Significato / soluzione |
| --- | --- |
| *Il nodo … non è collegato a nessun elemento e il solutore lo ignora.* | Un nodo isolato. Eliminalo, oppure collegalo. |
| *Il nodo … è vincolato ma nessun elemento vi è collegato, quindi il vincolo non porta nulla.* | Un vincolo su un nodo isolato. |
| *L'elemento … si riferisce allo stesso nodo a entrambe le estremità.* | Un elemento di lunghezza nulla. Eliminalo. |
| *Il carico nodale / Lo spostamento imposto #n contiene valori non validi.* | Una componente che non è un numero. Modifica il carico. |

## I risultati sembrano sbagliati {#results-look-wrong}

| Sintomo | Causa probabile |
| --- | --- |
| I carichi agiscono verso l'alto | L'asse globale **z punta verso il basso**, quindi `Fz`/`fz` positivi sono diretti verso il basso. I valori negativi puntano verso l'alto. Vedi le [convenzioni](/it/elements/conventions). Con gli assi y verso l'alto è il contrario. |
| La freccia è 1000 volte troppo grande o troppo piccola | Un errore di unità: `E` inserito in Pa mentre l'unità è MPa, o `Iy` in cm⁴ mentre l'unità è m⁴. Controlla l'indicatore delle unità in basso a destra nella vista. |
| La freccia è leggermente maggiore della formula del manuale | Deformazione a taglio di Timoshenko. Aumenta il fattore di taglio della sezione, o usa un'asta snella, per avvicinarti ai valori di Eulero–Bernoulli. Vedi [Verificare i risultati a mano](/it/guide/verification). |
| Un segno sembra «sbagliato» | Leggi il segno dalle etichette, non dal lato del diagramma. Un M positivo tende le fibre inferiori. Le forze di estremità in *Risultati degli elementi* seguono gli assi locali dell'elemento, non la convenzione N-V-M. |
| Due colonne identiche mostrano tagli di segno opposto | Il segno di V segue il verso di ciascun elemento. Scambia i nodi di una delle due per confrontarle. |
| Numeri come `4 · 10¹` | Il formato scientifico. Scegli *Automatico* in *Impostazioni → Lingua e impostazioni locali → Formato dei numeri*. |
| I diagrammi sono enormi o minuscoli | È solo un fatto visivo. Regola **Scala dei risultati** in *Impostazioni → Impostazioni della vista*. |
| Un carico in coordinate locali punta dalla parte sbagliata | L'asse x locale dell'elemento va dal nodo *iniziale* al nodo *finale*. Scambia i nodi, oppure inverti il segno. |
| Il carico di un'asta inclinata non torna | **LCS** è spuntato per impostazione predefinita, quindi `fz` agisce perpendicolarmente all'asta. Togli la spunta per un carico verticale. |
| Un carico termico non fa nulla | Una struttura isostatica si deforma liberamente sotto la temperatura, senza sollecitazioni. Verifica che α ≠ 0 e, per il gradiente, che l'altezza h della sezione sia impostata. |

## Problemi di interfaccia {#interface-issues}

| Sintomo | Soluzione |
| --- | --- |
| Le scorciatoie non fanno nulla | Fai prima clic nell'area di disegno: i tasti vengono ignorati mentre un campo di testo ha il focus. |
| Non riesco a spostare la vista | Per impostazione predefinita la vista si sposta con il tasto centrale o destro del mouse; puoi cambiarlo in *Impostazioni → Comandi e scorciatoie*. Sul trackpad, lo scorrimento con due dita fa lo zoom; fai clic e trascina con due dita per spostare la vista. |
| Il mio modello è sparito | Aprire un link, un file o un esempio, e cancellare la struttura, conservano il vecchio modello: **☰ → Strutture recenti**, oppure <kbd>Ctrl</kbd>+<kbd>Z</kbd>. |
| Lingua sbagliata | *Impostazioni → Lingua e impostazioni locali*, oppure aggiungi `?lang=it` all'indirizzo. |
| Le modifiche alle impostazioni non restano | La memoria locale è bloccata (finestra in incognito, modalità privacy rigorosa). Impostazioni, salvataggio automatico e Strutture recenti ne hanno bisogno. |

## Segnalare un bug {#reporting-a-bug}

Apri una [issue su GitHub](https://github.com/janvorisek/edubeam/issues) indicando browser e sistema operativo, cosa ti aspettavi e, soprattutto, un **link condiviso** o il **file di progetto** che riproduce il problema.
