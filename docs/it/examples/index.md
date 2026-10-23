---
description: "Modelli già risolti di travi, telai e travature reticolari che si aprono in EduBeam con un clic, più esercizi suggeriti e tutorial svolti."
---

# Esempi

Ogni scheda qui sotto è un modello risolto e interattivo. Fai clic su una scheda per aprirla in <Edubeam /> con tutto già impostato e pronto da modificare: poi trascina un nodo, cambia un carico o spunta una cerniera e guarda i diagrammi seguirti.

<br>

<FeatureStructures />

Gli stessi modelli si trovano nell'app in **☰ → Esempi**, e [run.edubeam.app/?panel=examples](https://run.edubeam.app/?panel=examples&lang=it){target="_blank"} apre direttamente quella galleria.

## Esercizi suggeriti {#suggested-exercises}

- **Trave iperstatica**: togli la spunta a `Ry` all'incastro per renderla semplicemente appoggiata. Di quanto cresce il momento in mezzeria?
- **Mensola**: confronta la freccia all'estremità con $FL^3/3EI$ (vedi [Verificare i risultati a mano](/it/guide/verification)), poi dimezza $I_y$ nella scheda *Sezioni*.
- **Travatura Pratt**: in questo esempio i nodi sono rigidi. Spunta entrambe le cerniere di estremità su ogni asta per ottenere una vera travatura reticolare, poi confronta gli sforzi normali. Ora rimuovi una diagonale: la travatura sta ancora in piedi?
- **Trave continua a tre campate**: la trave è appoggiata solo alle estremità. Spunta `Dz` nei nodi interni B e C per renderla continua, e guarda comparire i momenti negativi sugli appoggi.
- **Telaio a portale**: spunta entrambe le cerniere di estremità sulla trave per modellare collegamenti trave-colonna a cerniera, oppure trasforma il vincolo destro da carrello in cerniera.
- **Carico termico**: blocca `Dx` in entrambi i vincoli e guarda comparire lo sforzo normale.

## Tutorial svolti {#worked-tutorials}

- [Telaio a tre cerniere](/it/tutorials/three-hinged-frame): reazioni, N, V e M verificati a mano.
- [Travatura reticolare piana](/it/tutorials/truss): metodo dei nodi, metodo delle sezioni (Ritter) e un'asta scarica.

## Proponi un esempio {#contribute-an-example}

Hai un buon modello per la didattica? Condividilo tramite un link su [GitHub Discussions](https://github.com/janvorisek/edubeam/discussions) o su [Twitter](https://twitter.com/EdubeamApp) e lo aggiungeremo alla galleria.
