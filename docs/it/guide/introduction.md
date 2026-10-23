---
description: "Che cos'è EduBeam: un solutore FEM gratuito nel browser per travi, telai e travature reticolari 2D. Cosa sa fare e cosa no, a chi si rivolge e come è organizzata la guida."
---

<script setup>
import { VPTeamMembers } from 'vitepress/theme-without-fonts'

const members = [
  {
    avatar: 'https://www.github.com/janvorisek.png',
    name: 'Jan Voříšek',
    title: 'Sviluppatore principale e product designer',
    links: [
      { icon: 'github', link: 'https://github.com/janvorisek' },
      { icon: 'twitter', link: 'https://twitter.com/janvorisekdev' },
    ]
  },
  {
    avatar: 'https://www.github.com/bpatzak.png',
    name: 'Bořek Patzák',
    title: "Solutore FEM, autore dell'app originale",
    links: [
      { icon: 'github', link: 'https://github.com/bpatzak' },
    ]
  }
]
</script>

# Introduzione

<Edubeam /> è uno strumento gratuito di **analisi strutturale 2D** che funziona nel browser, per travi, telai e travature reticolari. Disegni la struttura, aggiungi vincoli e carichi, e il solutore agli elementi finiti ricalcola tutto non appena cambi qualcosa. Non c'è un pulsante *Calcola*, non serve installare nulla né creare un account.

[Avvia EduBeam](https://run.edubeam.app/?lang=it){target="_blank"} in una nuova scheda e segui l'[Avvio rapido](/it/guide/quick-start).

![Un telaio a tre cerniere in EduBeam: carichi in arancione, reazioni in viola, momento flettente in rosso e deformata in grigio](/screenshots/it/hero.webp)

## La prima visita {#your-first-visit}

La prima volta che apri l'app, una finestra di benvenuto ti chiede come vuoi iniziare e quali unità e assi preferisci. Puoi cambiare entrambi in seguito nelle [Impostazioni](/it/essentials/units-settings).

![La finestra di benvenuto](/screenshots/it/welcome.webp){.shot-lg}

- **Fammi fare un giro** ti mostra uno alla volta il menu, Annulla e Ripeti, i pulsanti della vista, le opzioni di visualizzazione, la griglia e le unità, e la barra inferiore.
- **Disegna la tua prima trave** è un esercizio guidato in sette passi. Disegni una trave con il mouse, la vincoli, la carichi e leggi i risultati. Una piccola scheda nell'angolo ti dice cosa fare dopo.
- **Apri un esempio** apre la galleria dei modelli già pronti.

Tutte e tre le opzioni si trovano anche nel **menu ☰**, così puoi tornarci in qualsiasi momento.

![Disegna la tua prima trave: la scheda della guida resta nell'angolo mentre lavori](/screenshots/it/first-beam-task.webp)

## Cosa fa {#what-it-does}

| Ambito | Funzionalità |
| --- | --- |
| **Strutture** | Travi, travi continue, telai e travature reticolari nel piano (x–z), composti da nodi ed elementi trave 2D di Timoshenko. Le cerniere di estremità trasformano qualsiasi asta in un'asta reticolare. |
| **Vincoli** | Cerniera, carrello, incastro, pattino e ogni altra combinazione di `Dx`, `Dz`, `Ry` bloccati, scelta dal simbolo. Vincoli inclinati tramite un angolo nodale. Cedimenti vincolari. |
| **Carichi** | Forze e momenti nodali, spostamenti imposti, carichi distribuiti uniformi e trapezoidali, forze e momenti concentrati lungo un'asta, e variazioni di temperatura uniformi o a gradiente. |
| **Sezioni** | Librerie di materiali e sezioni (europee e statunitensi), più un editor di poligoni che calcola $A$, $I_y$, $I_z$, $I_{yz}$, assi principali e raggi d'inerzia per qualsiasi forma. |
| **Risultati** | Deformata, sforzo normale **N**, taglio **V**, momento flettente **M**, reazioni, spostamenti nodali, forze di estremità degli elementi e matrici di rigidezza degli elementi. |
| **Analisi** | Analisi statica lineare con un solo caso di carico. Per il modello lineare i risultati sono esatti, quindi non serve infittire la mesh. Quando una struttura non si può risolvere, EduBeam spiega perché e anima il modo in cui può muoversi. |
| **File** | Salva e apri progetti in JSON, condividi un intero modello come link, esporta il disegno in PNG o SVG e i risultati in CSV. I modelli sostituiti di recente vengono conservati, così puoi recuperarli. Tutto resta sul tuo dispositivo. |
| **Unità** | SI o unità statunitensi (US customary) con un clic, oppure ogni grandezza separatamente. Assi con x a destra e z in basso, oppure x a destra e y in alto. |

## Cosa non fa (ancora) {#what-it-does-not-do-yet}

Conoscere i limiti fin dall'inizio fa risparmiare tempo:

- **Solo 2D.** Nessun comportamento fuori dal piano, nessun telaio 3D.
- **Solo statica lineare.** Niente effetti del secondo ordine (P–Δ), instabilità, dinamica o plasticità.
- **Un solo caso di carico.** Non ci sono combinazioni di carico né inviluppi. Modella ogni caso separatamente e salvalo come file o link a sé.
- **Niente peso proprio.** Se ti serve, applicalo come carico distribuito.
- **Niente verifiche.** EduBeam ti dà sollecitazioni e spostamenti; le verifiche normative spettano a te.

Se ti manca una funzione importante, [apri una issue](https://github.com/janvorisek/edubeam/issues).

<ElementariumPromo placement="introduction" />

## A chi si rivolge? {#who-is-it-for}

- **Studenti** di Scienza delle costruzioni che vogliono un riscontro immediato sui calcoli a mano. Vedi [Verificare i risultati a mano](/it/guide/verification).
- **Docenti** che mostrano dal vivo, al proiettore, come vincoli, cerniere e carichi cambiano le sollecitazioni, in una qualsiasi delle 16 lingue. Vedi [Insegnare con EduBeam](/it/guide/teaching).
- **Ingegneri** che vogliono un rapido controllo di plausibilità prima di aprire un software desktop più pesante.

## Come è organizzata questa guida {#how-this-guide-is-organised}

1. **Per iniziare.** Questa pagina, l'[Avvio rapido di 10 minuti](/it/guide/quick-start) e gli [Esempi](/it/examples/) già pronti.
2. **Tutorial.** Modelli completi dall'inizio alla fine, verificati a mano: un [telaio a tre cerniere](/it/tutorials/three-hinged-frame) e una [travatura reticolare piana](/it/tutorials/truss).
3. **Modellazione.** Una pagina per ogni componente: l'[interfaccia utente](/it/essentials/user-interface), [nodi e vincoli](/it/essentials/nodes-supports), [elementi, materiali e sezioni](/it/essentials/elements), [carichi](/it/essentials/loads) e [unità e impostazioni](/it/essentials/units-settings).
4. **Risultati.** Come [leggere diagrammi e tabelle](/it/essentials/results) e come [verificarli](/it/guide/verification).
5. **File e condivisione.** [Progetti, link condivisi, esportazione di immagini e CSV](/it/essentials/import-export) e [insegnare con EduBeam](/it/guide/teaching).
6. **Riferimento.** [Tastiera, mouse e touch](/it/reference/shortcuts), [risoluzione dei problemi](/it/reference/troubleshooting) e le [FAQ](/it/faq/).
7. **Manuale teorico.** [Convenzioni dei segni](/it/elements/conventions) e le formulazioni dell'elemento [trave](/it/elements/beam) e dell'elemento [reticolare](/it/elements/truss).

Le icone **?** nell'app aprono la pagina corrispondente di questa guida nella tua lingua.

## Lingue {#languages}

L'interfaccia è disponibile in English, Bahasa Indonesia, Čeština, Deutsch, Español, Français, Italiano, Polski, Português, Tiếng Việt, Русский, Türkçe, Українська, हिन्दी, ไทย e 汉语. EduBeam sceglie la lingua in base al browser. Puoi cambiarla in **Impostazioni → Lingua e impostazioni locali**, oppure aprire l'app con un parametro `?lang=`, ad esempio [run.edubeam.app/?lang=it](https://run.edubeam.app/?lang=it){target="_blank"}.

## Autori e riconoscimenti {#authors-credits}

<Edubeam /> è guidato da [Jan Voříšek](https://github.com/janvorisek), maintainer e product designer della moderna versione web. La versione per browser è sviluppata indipendentemente dal CTU. L'EduBeam desktop originale per Windows e Linux è stato creato da [Bořek Patzák](http://ksm.fsv.cvut.cz/~bp/), [Jan Stránský](https://mech.fsv.cvut.cz/~stransky/en/) e [Vít Šmilauer](https://mech.fsv.cvut.cz/~smilauer/) presso il Dipartimento di Meccanica della [Facoltà di Ingegneria Civile del CTU di Praga](https://www.fsv.cvut.cz/en). Il solutore è la libreria open source [ts-fem](https://github.com/janvorisek/ts-fem).

<VPTeamMembers size="small" :members="members" />

## Contribuisci {#contribute}

- Segnala comportamenti poco chiari o bug con una [issue su GitHub](https://github.com/janvorisek/edubeam/issues).
- Migliora questa documentazione o le traduzioni modificando i file in `docs/` e aprendo una pull request.
- Fai conoscere EduBeam a compagni di corso e colleghi.
