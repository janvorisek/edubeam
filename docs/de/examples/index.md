# Beispiele

Jede Karte unten ist ein lebendiges, berechnetes Modell. Klicken Sie darauf, um es in <Edubeam /> mit vollständiger Eingabe zum Bearbeiten zu öffnen – dann ziehen Sie einen Knoten, ändern eine Last oder haken ein Gelenk an und sehen zu, wie die Diagramme folgen.

<br>

<FeatureStructures />

Dieselben Modelle finden Sie in der App unter **☰ → Beispiele**, und [run.edubeam.app/?panel=examples](https://run.edubeam.app/?panel=examples&lang=de){target="_blank"} öffnet diese Galerie direkt.

## Übungsvorschläge {#suggested-exercises}

- **Statisch unbestimmter Träger**: Entfernen Sie den Haken bei `Ry` an der Einspannung, sodass ein Einfeldträger entsteht. Um wie viel wächst das Feldmoment?
- **Kragträger**: Vergleichen Sie die Durchbiegung am Kragende mit $FL^3/3EI$ (siehe [Ergebnisse von Hand prüfen](/de/guide/verification)) und halbieren Sie dann $I_y$ im Reiter *Querschnitte*.
- **Pratt-Fachwerk**: Die Knoten in diesem Beispiel sind biegesteif. Haken Sie bei jedem Stab beide Endgelenke an, um ein echtes Fachwerk zu erhalten, und vergleichen Sie die Normalkräfte. Entfernen Sie nun eine Diagonale: Steht das Fachwerk noch?
- **Durchlaufträger über drei Felder**: Der Träger ist nur an seinen Enden gelagert. Haken Sie `Dz` an den inneren Knoten B und C an, um ihn zum Durchlaufträger zu machen, und beobachten Sie, wie über den Stützen die Stützmomente entstehen.
- **Portalrahmen**: Haken Sie beide Endgelenke des Riegels an, um gelenkige Riegel-Stützen-Anschlüsse zu modellieren, oder machen Sie das rechte Lager vom Loslager zum Festlager.
- **Temperaturlast**: Halten Sie `Dx` an beiden Lagern und beobachten Sie, wie eine Normalkraft entsteht.

## Durchgerechnete Tutorials {#worked-tutorials}

- [Dreigelenkrahmen](/de/tutorials/three-hinged-frame): Auflagerreaktionen, N, V und M von Hand geprüft.
- [Ebenes Fachwerk](/de/tutorials/truss): Knotenpunktverfahren, Ritterschnitt und ein Nullstab.

## Ein Beispiel beisteuern {#contribute-an-example}

Sie haben ein gutes Lehrmodell? Teilen Sie es per Link auf [GitHub Discussions](https://github.com/janvorisek/edubeam/discussions) oder [Twitter](https://twitter.com/EdubeamApp), und wir nehmen es in die Galerie auf.
