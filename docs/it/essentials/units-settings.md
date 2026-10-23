---
description: "Scegli la lingua, le unità SI o statunitensi, il formato dei numeri, gli assi y verso l'alto o z verso il basso, le impostazioni di vista e comandi, e scopri cosa salva EduBeam nel browser."
---

# Unità e impostazioni

Alle impostazioni si arriva in tre modi:

- la scheda **Impostazioni** sopra la vista, che le mostra a schermo intero;
- l'**indicatore delle unità** in basso a destra nella vista, che le apre su *Lingua e impostazioni locali*;
- **Altre impostazioni** sotto le opzioni di visualizzazione, che le apre su *Impostazioni della vista*.

Le impostazioni sono salvate nel browser e restano dopo un ricaricamento. **Ripristina impostazioni** riporta ai valori predefiniti la vista, il formato dei numeri, gli assi, il tasto per spostare la vista e le unità della tua area geografica; la lingua viene mantenuta.

## Lingua e impostazioni locali {#language-locale}

![Impostazioni → Lingua e impostazioni locali](/screenshots/it/settings-language.webp)

**Lingua.** 18 lingue dell'interfaccia. Puoi anche aprire l'app con `?lang=<code>`: `en`, `cs`, `de`, `fr`, `es`, `pt`, `pl`, `cn`, `th`, `uk`, `ru`, `tr`, `hi`, `vi`, `it`, `id`, `ja`, `ko`.

**Formato dei numeri.** Come vengono scritti i risultati: *Automatico*, *Scientifico* (predefinito) o *Ingegneristico*. Vedi [Formato dei numeri](/it/essentials/results#number-format).

**Sistema di riferimento.** *x a destra, z in basso* (predefinito) o *x a destra, y in alto*. L'opzione y verso l'alto inverte il segno dei valori verticali e degli angoli dei vincoli e rinomina gli assi in ogni input, tabella, tooltip ed esportazione. Il modello e i file salvati non cambiano. Vedi [Assi con y verso l'alto](/it/elements/conventions#y-up-axes).

![Il telaio a tre cerniere con assi y verso l'alto: l'indicatore degli assi nell'angolo punta y verso l'alto](/screenshots/it/settings-y-up.webp){.shot-lg}

**Sistema di unità.** *SI (metrico)* o *USA (imperiale)* imposta in un colpo solo tutte le unità qui sotto. Se poi cambi una singola unità, il sistema risulta *Personalizzato*. Alla prima visita scegli nella finestra di benvenuto; prima di allora, EduBeam presume le unità statunitensi solo se il browser è impostato su una lingua regionale USA *e* il computer è in un fuso orario USA.

**Unità.** Ogni grandezza ha la propria unità. Input, tabelle, tooltip ed etichette dei diagrammi usano tutti l'unità selezionata, e cambiare un'unità converte ciò che è visualizzato. Il modello in sé è salvato in SI, quindi passare avanti e indietro non fa perdere nulla, e un link condiviso apre lo stesso modello in qualsiasi unità.

| Grandezza | Scelte | SI | USA |
| --- | --- | --- | --- |
| Lunghezza (geometria) | m, cm, mm, ft, in | m | ft |
| Dimensioni della sezione | m, cm, mm, ft, in | m | in |
| Spostamento | m, cm, mm, ft, in | m | in |
| Area | m², cm², mm², ft², in² | m² | in² |
| Momento d'inerzia | m⁴, cm⁴, mm⁴, ft⁴, in⁴ | m⁴ | in⁴ |
| Massa | kg, lb | kg | lb |
| Forza | N, kN, MN, kgf, Tonf, lbf, kip | kN | kip |
| Momento flettente | Nmm, Nm, kNm, MNm, Tonf·m, lbf·in, lbf·ft, kip·in, kip·ft | kNm | kip·ft |
| Pressione (E, G) | Pa, kPa, MPa, GPa, ksc, psi, ksi, psf, ksf | MPa | ksi |
| Temperatura | °C, °F | °C | °F |

I carichi distribuiti usano *forza / lunghezza* delle unità selezionate (kN/m in SI, kip/ft in unità statunitensi), e la densità usa *massa / lunghezza³*. Il coefficiente di dilatazione termica segue l'unità di temperatura (1/K o 1/°F). I carichi termici sono *variazioni* di temperatura, quindi 10 °C corrispondono a 18 °F. Le rotazioni sono sempre in radianti.

Tonf è la tonnellata-forza metrica (1000 kgf), non la short ton statunitense. Le unità statunitensi sono convertite con le loro definizioni esatte (1 ft = 0,3048 m, 1 kip = 4448,2216 N). In piedi, digita valori decimali come `5,5`; i righelli e il mirino indicano piedi e pollici (5′-6″).

## Impostazioni della vista {#viewer-settings}

![Impostazioni → Impostazioni della vista, con l'anteprima dal vivo a destra](/screenshots/it/settings-viewer.webp)

Un'**Anteprima della vista** accanto alle impostazioni mostra un piccolo modello che reagisce a ogni modifica. Le etichette sotto di essa scelgono quale risultato mostrare, e il clic su un colore porta l'anteprima su quel risultato.

**Griglia**
- **Mostra griglia** (<kbd>G</kbd>) disegna la griglia e i righelli.
- **Snap alla griglia** (<kbd>S</kbd>) fa agganciare al passo della griglia i nodi che posizioni o trascini.
- **Mostra mirino** segna la posizione del puntatore sui righelli, così puoi leggerne le coordinate (solo con il mouse).
- **Passo dello snap** è la spaziatura nell'unità di lunghezza: 0,1 m per impostazione predefinita, o 0,5 ft in unità statunitensi. Quando passi tra unità metriche e statunitensi, un passo lasciato al valore predefinito diventa il predefinito dell'altro sistema; un passo impostato da te viene mantenuto.

**Dimensioni**
- **Scala dei risultati** (8–120 px, predefinito 48) è l'altezza sullo schermo dell'ordinata più grande di un diagramma o della deformata. I diagrammi sono scalati sul proprio massimo, quindi è un'impostazione puramente visiva; cambiala quando i grafici sono troppo grandi o troppo piccoli.
- **Dimensione dei vincoli** (50–150 %) e **Dimensione del carattere** (10–20 px). Caratteri più grandi aiutano con il proiettore.

**Orientamento delle etichette dei risultati**: *Perpendicolari al diagramma* (le etichette seguono il diagramma) o *Sempre orizzontali*.

**Controlli del modello**
- **Mostra come può muoversi una struttura labile** disegna il contorno tratteggiato di un meccanismo.
- **Anima il movimento** lo fa oscillare avanti e indietro.

**Colori**: colori separati per nodi, elementi, carichi, deformata, sforzo normale, taglio, momento flettente e reazioni. Predefiniti: N blu, V verde, M rosso, reazioni viola, carichi arancione.

## Comandi e scorciatoie {#controls-shortcuts}

**Sposta la vista con** stabilisce quale tasto del mouse sposta la vista: *Rotellina o tasto destro* (predefinito), *Rotellina del mouse* o *Tasto destro*. L'elenco completo delle scorciatoie è nella pagina [Tastiera, mouse e touch](/it/reference/shortcuts).

## Cosa viene salvato nel browser {#what-is-stored-in-your-browser}

Oltre alle impostazioni, EduBeam conserva nella memoria locale del browser:

- il **modello corrente**, salvato dopo ogni modifica, così ricaricare la scheda o riaprire l'app lo ripristina;
- **Strutture recenti**: gli ultimi 10 modelli che hai cancellato o sostituito.

Entrambi sono legati al browser e al dispositivo, e cancellare i dati del sito li rimuove. Usa [Salva progetto o Condividi modello](/it/essentials/import-export) per conservare un modello o spostarlo altrove.
