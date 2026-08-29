# Häufig gestellte Fragen

## Allgemein

### Was ist EduBeam?

Ein kostenloser, quelloffener, browserbasierter Solver für ebene Balken, Rahmen und Fachwerke – für Studierende, Lehrende und Ingenieure, die sofortige Rückmeldung wollen. Siehe [Einführung](/de/guide/introduction).

### Ist es wirklich kostenlos? Brauche ich ein Konto?

Ja, und nein. Öffnen Sie [run.edubeam.app](https://run.edubeam.app/?lang=de) und beginnen Sie zu modellieren. Keine Konten, keine Installation, keine Nutzungslimits. Der Quellcode liegt auf [GitHub](https://github.com/janvorisek/edubeam).

### Welche Browser und Geräte funktionieren?

Jeder aktuelle Chrome, Edge, Firefox oder Safari. Tablets und Smartphones funktionieren (Tippen, Ziehen zum Verschieben, Pinch zum Zoomen, langes Drücken zum Verschieben eines Knotens), mit Maus und Tastatur geht das Modellieren aber deutlich schneller.

### Kann ich es offline nutzen?

EduBeam ist eine Progressive Web App: einmal geladen, funktioniert es auch ohne Verbindung, und der Browser bietet möglicherweise die Installation an. Steht eine neue Version bereit, fragt ein Dialog vor dem Update.

### Wo werden meine Daten gespeichert?

Nur in Ihrem Browser. Modelle werden nie an einen Server gesendet; der geteilte Link *ist* das Modell. Siehe [Import, Export & Teilen](/de/essentials/import-export).

## Modellierung

### Wie erzeuge ich eine Einspannung / ein Festlager / ein Loslager?

Freiheitsgrade anhaken: **Dx + Dz + Ry** = Einspannung, **Dx + Dz** = Festlager, **Dz** = Loslager. Alle Kombinationen und ihre Symbole unter [Knoten & Lager](/de/essentials/nodes-supports#lager).

### Wie modelliere ich ein Fachwerk?

Balkenelemente verwenden und bei jedem Stab im Reiter *Elemente* **beide Endgelenke** anhaken. Lasten in den Knoten aufbringen. Siehe [Elemente](/de/essentials/elements#endgelenke).

### Wie setze ich ein Gelenk in einen Rahmen?

Das **Endgelenk** des Elements auf der Seite des Knotens anhaken, an der das Moment freigegeben werden soll. Ein Gelenk an *einem* Element gibt nur dieses Element frei.

### Wie füge ich ein Lager oder eine Einzellast mitten im Balken ein?

Einen Knoten mit *Per Maus hinzufügen* auf den Balken setzen und **Mit Struktur verbinden** wählen – der Balken wird geteilt. Für eine Einzellast allein brauchen Sie nicht einmal einen Knoten: verwenden Sie die Elementlast **Einzellast** mit Lastposition.

### Kann ich Eigengewicht ansetzen?

Nicht automatisch. Geben Sie es als Gleichlast $f_z = \rho g A$ ein.

### Kann ich schräge Lager modellieren?

Ja – setzen Sie am Knoten einen **Knoten-LKS-Winkel**; seine Freiheitsgrade werden dann im gedrehten System ausgewertet.

### Gibt es Lastfälle oder Kombinationen?

Nein, nur ein Lastfall. Modellieren Sie jeden Fall getrennt und speichern oder teilen Sie ihn.

### Warum zeigen meine Lasten nach oben?

Weil die globale z-Achse **nach unten** zeigt: positives `Fz` wirkt nach unten. Siehe [Vorzeichenkonvention](/de/elements/conventions).

## Ergebnisse

### Warum gibt es keine Schaltfläche „Berechnen“?

Das Modell wird nach jeder Änderung automatisch gelöst. Erscheinen keine Ergebnisse, ist das Modell noch nicht lösbar – die [Fehlerbehebung](/de/reference/troubleshooting) sagt, was zu prüfen ist.

### Warum weicht meine Durchbiegung leicht von der Formel ab?

EduBeam verwendet Timoshenko-Balken, die Durchbiegungen enthalten also die Schubverformung. Bei schlanken Stäben liegt der Unterschied deutlich unter 1 %. Details und durchgerechnete Vergleiche unter [Ergebnisse von Hand prüfen](/de/guide/verification).

### Wie genau sind die Ergebnisse? Brauche ich mehr Elemente?

Für die lineare Statik ist das Balkenelement unter den unterstützten Lasttypen exakt; ein Element je Stab genügt. Zusätzliche Knoten brauchen Sie nur für Lager, Gelenke, Querschnittswechsel oder Lastangriffspunkte.

### Wo finde ich die Auflagerreaktionen?

In der Ansicht als Pfeile mit Werten (**Auflagerreaktionen** im Anzeigepanel aktivieren). Stabendkräfte und Knotenverschiebungen stehen im Reiter **Ergebnisse**.

## Dateien & Teilen

### Wie teile ich ein Modell?

**Modell teilen** → **Link kopieren**. Der Link enthält das gesamte Modell. Empfänger erhalten eine eigene bearbeitbare Kopie; eine Echtzeit-Zusammenarbeit gibt es nicht.

### Kann ich ein Modell auf meiner Website oder in Folien einbetten?

Ja – `&viewer=1` an einen geteilten Link anhängen und in ein `<iframe>` setzen. Siehe [Schreibgeschützten Viewer einbetten](/de/essentials/import-export#schreibgeschutzten-viewer-einbetten).

### Kann ich Bilder oder Tabellen exportieren?

Noch nicht. Für Bilder einen Screenshot verwenden, für Zahlen den Tabellentext kopieren. Stimmen Sie auf [GitHub](https://github.com/janvorisek/edubeam/issues) für die Funktion ab.

### Kann ich Modelle programmatisch erzeugen?

Ja. Die Projektdatei ist einfaches JSON in SI-Einheiten – siehe [Formatbeschreibung](/de/essentials/import-export#format-der-projektdatei) – und lässt sich mit *Projekt öffnen* oder per Drag & Drop laden.

## Support

### Wie melde ich einen Fehler oder schlage eine Funktion vor?

Eröffnen Sie ein Issue auf [GitHub](https://github.com/janvorisek/edubeam/issues) und hängen Sie einen geteilten Link oder eine Projektdatei an, die das Problem reproduziert. Privater Support: [support@edubeam.app](mailto:support@edubeam.app).
