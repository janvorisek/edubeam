---
description: "Forze e momenti nodali, cedimenti vincolari, carichi uniformi, trapezoidali e concentrati sugli elementi, e carichi termici, con la convenzione dei segni di ciascuno."
---

# Carichi

Tutti i carichi appartengono a un **unico caso di carico** e agiscono insieme. Per confrontare più scenari, salva ciascuno come file di progetto o link condiviso.

![Tutti i tipi di carico su un'unica trave continua: una forza nodale, un carico uniforme, un carico trapezoidale, un carico concentrato, un carico termico e un cedimento vincolare](/screenshots/it/loads-overview.webp)

<LoadShowcase />

## La convenzione dei segni in una riga {#sign-convention-in-one-line}

L'asse globale **x** punta a destra e l'asse globale **z** punta **verso il basso**. Un `Fz` o `fz` positivo è quindi un carico diretto verso il basso, di tipo gravitazionale, e un momento `My` positivo ruota in senso antiorario sullo schermo. I dettagli sono in [Sistema di riferimento e convenzioni dei segni](/it/elements/conventions). Con gli [assi y verso l'alto](/it/elements/conventions#y-up-axes) nomi e segni delle grandezze verticali si invertono: la gravità è un `Fy` negativo.

## Carichi nodali {#nodal-loads}

Scheda *Carichi* → **Aggiungi carico nodale**, oppure fai clic su un nodo → **Aggiungi carico**. Scegli **Forza/Momento**:

| Campo | Significato | Unità |
| --- | --- | --- |
| `Fx` | forza orizzontale (positiva verso destra) | unità di forza |
| `Fz` | forza verticale (positiva verso il basso) | unità di forza |
| `My` | momento attorno a y (positivo antiorario) | unità di momento |

![Aggiungi carico nodale. L'anteprima mostra il verso mentre digiti.](/screenshots/it/loads-nodal.webp){.shot-md}

Le componenti sono sempre nel sistema di riferimento **globale**. Un nodo può portare più carichi nodali; si sommano e vengono disegnati uno sopra l'altro.

### Spostamenti imposti (cedimenti vincolari) {#prescribed-displacements-support-settlements}

Nella stessa finestra scegli **Spostamento imposto**, oppure fai clic su un nodo vincolato → **Imponi spostamento**. I campi diventano:

| Campo | Significato | Unità |
| --- | --- | --- |
| `Dx` | spostamento orizzontale imposto | unità di spostamento |
| `Dz` | spostamento verticale imposto (positivo verso il basso) | unità di spostamento |
| `Ry` | rotazione imposta | rad |

Puoi inserire un valore solo per un GdL **vincolato** in quel nodo, perché si possono spostare solo i vincoli. Ogni nodo ha al massimo uno spostamento imposto; modificalo invece di aggiungerne un secondo. In una struttura isostatica un cedimento produce spostamenti ma nessuna sollecitazione; in una iperstatica produce entrambi.

## Carichi su elemento {#element-loads}

Scheda *Carichi* → **Aggiungi carico su elemento**, oppure fai clic su un elemento → **Aggiungi carico**. Scegli il **Tipo di carico**; la finestra mostra un'anteprima del carico sull'elemento mentre digiti.

### Carico uniformemente distribuito {#uniformly-distributed-load}

| Campo | Significato | Unità |
| --- | --- | --- |
| `fx` | carico per unità di lunghezza lungo x | forza / lunghezza |
| `fz` | carico per unità di lunghezza lungo z | forza / lunghezza |
| **LCS** | spuntato: `fx`, `fz` agiscono lungo gli assi locali dell'elemento; non spuntato: lungo gli assi globali | – |

**LCS** è spuntato per impostazione predefinita. Su un elemento orizzontale disegnato da sinistra a destra, assi locali e globali coincidono, quindi non fa differenza. Su un'asta inclinata sì:

- un carico **perpendicolare all'asta** (vento su una falda) è `fz` con LCS **spuntato**;
- un carico **verticale** per metro di lunghezza dell'asta (peso proprio) è `fz` con LCS **non spuntato**;
- un carico verticale per metro di *proiezione orizzontale* (neve) non è disponibile direttamente. Moltiplicalo prima per $\cos\alpha$, dove $\alpha$ è l'inclinazione dell'asta, e inseriscilo come carico verticale.

### Carico trapezoidale {#trapezoidal-load}

| Campo | Significato |
| --- | --- |
| `f1x`, `f1z` | intensità nel nodo **iniziale** |
| `f2x`, `f2z` | intensità nel nodo **finale** |

L'intensità varia linearmente dall'inizio alla fine dell'elemento. Un carico triangolare ha `f1z = 0`. I carichi trapezoidali agiscono sempre lungo gli **assi locali dell'elemento** (la casella LCS è bloccata); su un elemento orizzontale coincidono con quelli globali.

### Carico concentrato {#concentrated-load}

Una forza o un momento concentrato in qualsiasi punto **lungo** un elemento, senza bisogno di un nodo aggiuntivo.

| Campo | Significato |
| --- | --- |
| `Fx`, `Fz`, `My` | componenti di forza e momento |
| **Posizione del carico dal nodo iniziale** | distanza dal nodo iniziale, `0 ≤ a ≤ L` |
| **LCS** | componenti lungo gli assi locali |

Nel punto di applicazione il diagramma del taglio ha un salto pari a `Fz` e quello del momento un punto angoloso; il valore del momento in quel punto viene etichettato automaticamente. Un `My` concentrato provoca invece un salto nel diagramma del momento.

### Carico termico {#temperature-load}

| Campo | Significato |
| --- | --- |
| **ΔT<sub>c</sub>**, variazione di temperatura all'asse baricentrico | variazione uniforme su tutta la sezione, che dà un allungamento $\alpha\,\Delta T_c\,L$ |
| **ΔT<sub>b</sub> − ΔT<sub>t</sub>**, differenza di temperatura | fibra inferiore meno fibra superiore, che dà una curvatura $\alpha\,(\Delta T_b - \Delta T_t)/h$ |

I carichi termici usano l'**α** del materiale e l'**altezza h** della sezione. Un `ΔTb − ΔTt` positivo (più caldo in basso) allunga la fibra inferiore, quindi l'elemento si inflette verso il basso come una trave sotto carico gravitazionale. In una struttura isostatica la temperatura provoca solo spostamenti; i vincoli sovrabbondanti (estremità incastrate, continuità, aste ridondanti) la trasformano in sollecitazioni.

<div class="shots">

![Carico uniformemente distribuito](/screenshots/it/loads-udl.webp)

![Carico trapezoidale](/screenshots/it/loads-trapezoidal.webp)

![Carico concentrato](/screenshots/it/loads-concentrated.webp)

![Carico termico](/screenshots/it/loads-temperature.webp)

</div>

## Modificare e rimuovere i carichi {#editing-and-removing-loads}

- Ogni carico è una riga nella scheda *Carichi*, dove puoi modificarne direttamente le componenti e l'opzione LCS. I carichi compaiono anche come etichette nelle tabelle *Nodi* ed *Elementi*.
- **Fai doppio clic** su un carico nella vista, oppure fai clic su di esso e scegli **Modifica carico**, per aprire la finestra di modifica.
- Seleziona un carico e premi <kbd>Delete</kbd>, oppure usa la × nella tabella.
- I carichi applicati a un nodo o a un elemento vengono eliminati insieme a esso, e copiati con esso quando copi e incolli.

![La scheda Carichi: una riga per carico, con le componenti modificabili direttamente](/screenshots/it/loads-table.webp)

## Cosa non è disponibile {#what-is-not-available}

- **Casi di carico e combinazioni.** C'è un solo caso di carico.
- **Peso proprio.** Inseriscilo come carico uniforme con LCS non spuntato: $f_z = \rho\,g\,A$. Per una IPE 200, 7850 × 9,81 × 0,00285 ≈ 0,22 kN/m.
- **Carichi trapezoidali in assi globali** su aste inclinate.
