# Lehren mit EduBeam

<Edubeam /> ist in einem Hörsaal entstanden, und dort funktioniert es noch immer am besten: ein Modell am Beamer, das in dem Moment reagiert, in dem Sie es ändern, und dasselbe Modell per Link auf dem Laptop jeder Studentin und jedes Studenten. Diese Seite fasst zusammen, was Lehrende am häufigsten nutzen.

## In der Vorlesung {#in-the-lecture}

- **Auch aus der letzten Reihe lesbar.** Erhöhen Sie unter *Einstellungen → Anzeigeeinstellungen* die **Schriftgröße** auf 18–20 px und die **Lagergröße** auf 130–150 %. Erhöhen Sie die **Ergebnisskalierung**, wenn die Diagramme auf einer großen Leinwand zu zaghaft wirken.
- **Eins nach dem anderen zeigen.** Schalten Sie in den Anzeigeoptionen alles aus außer der Größe, über die Sie gerade sprechen, und nehmen Sie die anderen dann nacheinander hinzu.
- **Das Modell live ändern.** Verschieben Sie ein Lager, haken Sie `Ry` an, fügen Sie ein Gelenk hinzu. Die Studierenden sehen Ursache und Wirkung sofort, und <kbd>Strg</kbd>+<kbd>Z</kbd> bringt Sie zurück.
- **Den Solver Mechanismen erklären lassen.** Geben Sie ein Gelenk zu viel frei, und EduBeam lässt die gestrichelte Kontur des Mechanismus schwingen und kreist die verantwortlichen Gelenke ein. Ein guter Moment, um über Stabilität zu sprechen.
- **Sprache und Achsen der Studierenden verwenden.** Wählen Sie die Oberflächensprache, SI- oder US-Einheiten und Achsen mit z nach unten oder y nach oben passend zu Ihrem Vorlesungsskript.

![Ein Mechanismus wird sichtbar: Die Gelenke bei B und C lassen den Rahmen seitlich ausweichen](/screenshots/de/ui-mechanism.webp)

## In Vorlesungsunterlagen und Übungsaufgaben {#in-lecture-notes-and-assignments}

Ein Link enthält das ganze Modell und funktioniert daher überall, wo ein Link funktioniert: in einem PDF, auf einer Folie, auf einer Seite der Lernplattform, in einer E-Mail.

1. Bauen Sie das Modell und klicken Sie auf **Modell teilen → Link kopieren**.
2. Fügen Sie den Link in Ihre Unterlagen ein. Links aus älteren EduBeam-Versionen funktionieren weiterhin, Ihre Unterlagen bleiben also Jahr für Jahr gültig.
3. Wer den Link öffnet, erhält eine eigene Kopie zum Experimentieren. Nichts, was die Studierenden ändern, erreicht Sie oder andere Studierende.

Nützliche Link-Varianten:

| Link | Öffnet |
| --- | --- |
| `https://run.edubeam.app/?model=…` | Das Modell, bereit zum Bearbeiten |
| `https://run.edubeam.app/?viewer=1&model=…` | Das Modell im [Viewer-Modus](/de/essentials/import-export#embed-a-read-only-viewer), zum Einbetten in einen `<iframe>` |
| `https://run.edubeam.app/?panel=examples` | Die Beispielgalerie |
| `https://run.edubeam.app/?lang=cs` | Die App auf Tschechisch (oder mit einem [anderen Sprachcode](/de/essentials/import-export#url-parameters)) |

::: warning Ein Link ersetzt das eigene Modell der Studierenden
Ihr bisheriges Modell landet unter **☰ → Zuletzt verwendete Modelle** und lässt sich wiederherstellen; eine Meldung weist darauf hin. Sagen Sie den Studierenden trotzdem, dass sie wichtige Arbeit mit **Projekt speichern** sichern sollen, bevor sie Links aus der Lehrveranstaltung öffnen.
:::

## Aufgaben, die Studierende selbst prüfen können {#assignments-students-can-check-themselves}

EduBeam gibt Studierenden sofortige Rückmeldung zu ihren Handrechnungen, ohne den Lösungsweg zu verraten:

- Lassen Sie Auflagerreaktionen, Schnittgrößen und eine Verschiebung von Hand berechnen und die Studierenden anschließend das Modell bauen und vergleichen. [Ergebnisse von Hand prüfen](/de/guide/verification) enthält fertige Formeln.
- Fragen Sie, *warum* ein Ergebnis abweicht: Schubverformung, ein fehlendes Gelenk, eine Last in lokalen statt globalen Achsen.
- Lassen Sie zusammen mit der Rechnung einen Link oder eine `project.json` abgeben. Sie können sie öffnen und genau sehen, was modelliert wurde.
- Für Berichte können Studierende die Zeichnung als **SVG** (scharf in Word und LaTeX) und die Ergebnisse als **CSV** exportieren.

## Fertige Übungen {#ready-made-exercises}

- Die Seite [Beispiele](/de/examples/) enthält sechs Modelle, jeweils mit Übungsvorschlägen.
- Die Tutorials [Dreigelenkrahmen](/de/tutorials/three-hinged-frame) und [ebenes Fachwerk](/de/tutorials/truss) sind vollständig durchgerechnete Beispiele mit Handrechnung.
- Der [Schnellstart](/de/guide/quick-start) eignet sich als Handout für die erste Übung: Er dauert etwa zehn Minuten.

## Studierenden den Einstieg erleichtern {#getting-students-started}

Neue Nutzer sehen einen Willkommensdialog mit zwei geführten Optionen: **Rundgang starten** (eine Tour durch die Oberfläche) und **Ersten Balken zeichnen** (eine Aufgabe in sieben Schritten mit der Maus). Beide finden sich auch im Menü ☰. Viele Lehrende sagen zu Beginn der ersten Übung einfach: „Öffnen Sie run.edubeam.app und wählen Sie *Ersten Balken zeichnen*.“

## Offline und Rechner im PC-Pool {#offline-and-lab-computers}

EduBeam ist eine Progressive Web App. Hat ein Rechner sie einmal geladen, funktioniert sie auch ohne Verbindung weiter, und der Browser bietet unter Umständen an, sie zu installieren. Modelle und Einstellungen werden je Browserprofil gespeichert; auf gemeinsam genutzten Rechnern im PC-Pool sollten Studierende ihre Arbeit daher als Datei oder Link sichern.
