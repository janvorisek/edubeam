# Häufig gestellte Fragen

## Allgemein {#general}

### Was ist EduBeam? {#what-is-edubeam}

Ein kostenloses, quelloffenes, browserbasiertes Berechnungsprogramm für ebene Balken, Rahmen und Fachwerke – für Studierende, Lehrende und Ingenieure, die sofortige Rückmeldung wollen. Siehe [Einführung](/de/guide/introduction).

### Ist es wirklich kostenlos? Brauche ich ein Konto? {#is-it-really-free-do-i-need-an-account}

Ja, und nein. Öffnen Sie [run.edubeam.app](https://run.edubeam.app/?lang=de) und beginnen Sie zu modellieren. Es gibt keine Konten, keine Installationsprogramme und keine Nutzungslimits. Der Quellcode liegt auf [GitHub](https://github.com/janvorisek/edubeam).

### Welche Browser und Geräte funktionieren? {#which-browsers-and-devices-work}

Jeder aktuelle Chrome, Edge, Firefox oder Safari. Tablets und Smartphones funktionieren: Tippen zum Auswählen oder Setzen, einen Knoten ziehen, um ihn zu verschieben, an anderer Stelle ziehen, um die Ansicht zu verschieben, mit zwei Fingern zoomen und gedrückt halten für das Menü der Zeichenfläche. Mit Maus und Tastatur geht das Modellieren trotzdem schneller. Siehe [Tastatur, Maus & Touch](/de/reference/shortcuts#touch).

### Ich habe mein Modell verloren. Kann ich es zurückholen? {#i-lost-my-model-can-i-get-it-back}

Wahrscheinlich. Wenn Sie das Modell löschen oder einen Link, eine Datei oder ein Beispiel darüber öffnen, bleibt das alte unter **☰ → Zuletzt verwendete Modelle** erhalten (die letzten 10), und <kbd>Strg</kbd>+<kbd>Z</kbd> macht das Ersetzen rückgängig. Beides gibt es nur in Ihrem Browser.

### Kann ich es offline nutzen? {#can-i-use-it-offline}

EduBeam ist eine Progressive Web App: Einmal geladen, funktioniert sie auch ohne Verbindung, und der Browser bietet unter Umständen an, sie zu installieren. Steht eine neue Version bereit, fragt ein Dialog vor dem Update.

### Wo werden meine Daten gespeichert? {#where-is-my-data-stored}

Nur in Ihrem Browser. Modelle werden nie an einen Server gesendet; der Link *ist* das Modell. Siehe [Import, Export & Teilen](/de/essentials/import-export).

## Modellierung {#modelling}

### Wie erzeuge ich eine Einspannung, ein Festlager oder ein Loslager? {#how-do-i-make-a-fixed-pinned-roller-support}

Klicken Sie auf den Knoten, öffnen Sie **Knotenlagerung** und wählen Sie das Symbol: Festlager, Loslager, Einspannung, Parallelführung und weitere. Oder haken Sie die Freiheitsgrade an: **Dx + Dz + Ry** = Einspannung, **Dx + Dz** = Festlager, **Dz** = Loslager. Alle Kombinationen sind unter [Knoten & Lager](/de/essentials/nodes-supports#supports) aufgeführt.

### Wie modelliere ich ein Fachwerk? {#how-do-i-make-a-truss}

Verwenden Sie Balkenelemente und haken Sie im Reiter *Elemente* bei jedem Stab **beide Endgelenke** an, oder haken Sie vor dem Zeichnen der Stäbe mit der Maus im Banner *Gelenk am Anfang* und *Gelenk am Ende* an. Bringen Sie die Lasten in den Knoten auf. Das [Fachwerk-Tutorial](/de/tutorials/truss) führt Schritt für Schritt durch ein Beispiel.

### Wie setze ich ein Gelenk in einen Rahmen? {#how-do-i-put-a-hinge-in-a-frame}

Haken Sie das **Endgelenk** des Elements auf der Seite des Knotens an, an der das Moment freigegeben werden soll. Ein Gelenk an *einem* Element eines Knotens gibt nur dieses Element frei.

### Wie füge ich ein Lager oder eine Einzellast mitten im Balken ein? {#how-do-i-add-a-support-or-a-point-load-in-the-middle-of-a-beam}

Setzen Sie mit *Per Maus hinzufügen* einen Knoten auf den Balken und wählen Sie **Mit Struktur verbinden** – der Balken wird in zwei Elemente geteilt. Für eine Einzellast allein brauchen Sie nicht einmal einen Knoten: Verwenden Sie die Elementlast **Einzellast** mit einer Lastposition.

### Kann ich Eigengewicht ansetzen? {#can-i-apply-self-weight}

Nicht automatisch. Geben Sie es als gleichmäßig verteilte Last $f_z = \rho g A$ ein.

### Kann ich schräge Lager modellieren? {#can-i-model-inclined-supports}

Ja – legen Sie am Knoten einen **Knoten-LKS-Winkel** fest; seine Freiheitsgrade werden dann im gedrehten System ausgewertet.

### Gibt es Lastfälle oder Kombinationen? {#are-there-load-cases-or-combinations}

Nein, nur einen Lastfall. Modellieren Sie jeden Fall getrennt und speichern oder teilen Sie ihn.

### Warum zeigen meine Lasten nach oben? {#why-do-my-loads-point-up}

Weil die globale z-Achse **nach unten** zeigt: Ein positives `Fz` wirkt nach unten. Siehe [Konventionen](/de/elements/conventions). Wenn Ihnen eine nach oben zeigende vertikale Achse lieber ist, wechseln Sie unter *Einstellungen → Sprache & Region → Koordinatensystem* zu y nach oben.

## Ergebnisse {#results}

### Warum gibt es keine Schaltfläche „Berechnen“? {#why-is-there-no-solve-button}

Das Modell wird nach jeder Änderung automatisch berechnet. Erscheinen keine Ergebnisse, lässt sich das Modell noch nicht berechnen – die [Fehlerbehebung](/de/reference/troubleshooting) listet auf, was zu prüfen ist.

### Warum weicht meine Durchbiegung leicht von der Formel ab? {#why-does-my-deflection-differ-slightly-from-the-formula}

EduBeam verwendet Timoshenko-Balken, die Durchbiegungen enthalten also die Schubverformung. Bei schlanken Stäben liegt der Unterschied deutlich unter 1 %. Einzelheiten und durchgerechnete Vergleiche unter [Ergebnisse von Hand prüfen](/de/guide/verification).

### Wie genau sind die Ergebnisse? Brauche ich mehr Elemente? {#how-accurate-are-the-results-do-i-need-more-elements}

Für die lineare Statik ist das Balkenelement unter den unterstützten Lastarten exakt, ein Element je Stab genügt also. Zusätzliche Knoten brauchen Sie nur dort, wo Sie ein Lager, ein Gelenk, einen Querschnittswechsel oder einen Knoten zum Anbringen einer Last wollen.

### Wo stehen die Auflagerreaktionen? {#where-are-the-reactions-listed}

In der Ansicht, als Pfeile mit Werten (**Auflagerreaktionen** in den Anzeigeoptionen, standardmäßig eingeschaltet). Sie stehen auch in der Datei aus **Ergebnisse → CSV exportieren** und in **Kopieren**. Knotenverschiebungen und Stabendkräfte finden Sie im Reiter **Ergebnisse**.

## Dateien & Teilen {#files-sharing}

### Wie teile ich ein Modell? {#how-do-i-share-a-model}

**Modell teilen** → **Link kopieren**. Der Link enthält das ganze Modell. Empfänger erhalten eine eigene bearbeitbare Kopie; eine Live-Zusammenarbeit gibt es nicht. Siehe auch [Lehren mit EduBeam](/de/guide/teaching).

### Kann ich ein Modell in meine Website oder in Folien einbetten? {#can-i-embed-a-model-on-my-website-or-in-slides}

Ja: Hängen Sie `&viewer=1` an einen Link an und setzen Sie ihn in einen `<iframe>`. Siehe [Viewer einbetten](/de/essentials/import-export#embed-a-read-only-viewer).

### Kann ich Bilder oder Tabellen exportieren? {#can-i-export-images-or-tables}

Ja. **☰ → Bild exportieren** (<kbd>Strg</kbd>+<kbd>P</kbd>) speichert die Zeichnung als PNG oder SVG in einer Größe oder einem Maßstab Ihrer Wahl. **Ergebnisse → CSV exportieren** speichert beide Ergebnistabellen, und **Kopieren** legt sie für eine Tabellenkalkulation in die Zwischenablage. Siehe [Import, Export & Teilen](/de/essentials/import-export#export-an-image).

### Kann ich Modelle per Programm erzeugen? {#can-i-generate-models-programmatically}

Ja. Die Projektdatei ist einfaches JSON in SI-Einheiten – siehe die [Formatbeschreibung](/de/essentials/import-export#project-file-format) – und lässt sich mit *Projekt öffnen* oder per Drag & Drop öffnen.

## Support {#support}

### Wie melde ich einen Fehler oder schlage eine Funktion vor? {#how-do-i-report-a-bug-or-request-a-feature}

Eröffnen Sie ein Issue auf [GitHub](https://github.com/janvorisek/edubeam/issues) und hängen Sie einen Link oder eine Projektdatei an, mit der sich das Problem nachvollziehen lässt. Nichtöffentlicher Support: [support@edubeam.app](mailto:support@edubeam.app).
