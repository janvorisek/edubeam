# Fehlerbehebung

## Es werden keine Ergebnisse gezeichnet {#no-results-are-drawn}

Ergebnisse erscheinen nur, wenn sich das Modell berechnen lässt. Prüfen Sie in dieser Reihenfolge:

1. **Lesen Sie die Meldung oben links in der Ansicht.**
   - *Keine Materialien definiert.* / *Keine Querschnitte definiert.*: Legen Sie mit der Schaltfläche **Neu hinzufügen** eines an.
   - Ein blauer Chip **Lager fehlen**: Das Modell ist einfach noch nicht fertig. Fügen Sie Lager hinzu. Zeigen Sie mit der Maus auf den Chip, um als gestrichelte Kontur zu sehen, wie sich das Tragwerk noch bewegen kann.
   - Eine **rote Meldung**: Etwas stimmt nicht. Sie benennt das Problem oder lautet bei mehreren Problemen *Fehler im Modell: N*. Klicken Sie auf **Details anzeigen** und beheben Sie jeden Punkt (siehe die Tabelle unten). Die betroffenen Knoten oder Gelenke sind auf der Zeichenfläche eingekreist.
   - Eine **gelbe Meldung**: Warnungen. Das Modell wurde trotzdem berechnet; Sie können sie ausblenden.
2. **Genug Lager?** Der Solver braucht mindestens drei gehaltene Freiheitsgrade, und die Lager müssen das Tragwerk festhalten. Ein Balken auf zwei Loslagern (Dz + Dz) hat nur zwei und rutscht weg. Ergänzen Sie irgendwo ein `Dx` oder an einem Lager ein `Ry`.
3. **Sind die Elemente verbunden?** Zwei Knoten mit denselben Koordinaten sind trotzdem zwei getrennte Knoten. Löschen Sie den überzähligen und verbinden Sie neu, oder setzen Sie Knoten mit **Mit Struktur verbinden** auf Elemente.
4. **Zu viele Gelenke?** Gelenke an beiden Enden einer Stütze oder ein Quadrat aus gelenkig verbundenen Stäben ohne Diagonale ergeben einen Mechanismus. EduBeam kreist die Gelenke ein und zeigt die Bewegung.
5. **Eine Steifigkeit von null?** Wurde `E`, `A` oder `Iy` versehentlich als 0 oder in der falschen Einheit eingegeben, bewegt sich ein Teil des Tragwerks nahezu ohne Widerstand. EduBeam meldet das als *instabil*.

![Details anzeigen listet jedes Problem mit einem Hinweis auf und kann die Bewegung zeigen](/screenshots/de/ui-diagnostics.webp){.shot-lg}

## Meldungen {#messages}

**Details anzeigen** öffnet einen Dialog mit dem Titel *Modell kann nicht berechnet werden* (Fehler), *Noch nicht berechenbar* (es fehlen noch Lager) oder *Warnungen zum Modell*. Sein Link **Fehlerbehebung** führt hierher.

### Noch erforderlich {#still-needed}

| Meldung | Bedeutung / Abhilfe |
| --- | --- |
| *Die Struktur braucht Lager, bevor sie berechnet werden kann.* | Insgesamt weniger als drei gehaltene Freiheitsgrade. Fügen Sie Lager hinzu. |
| *Ein separater Teil der Struktur (Knoten …) hat weniger als 3 gelagerte Freiheitsgrade und kann sich frei bewegen.* | Das Modell besteht aus mehreren Teilen, und einer davon schwebt. Verbinden oder lagern Sie ihn. |

### Fehler {#errors}

| Meldung | Bedeutung / Abhilfe |
| --- | --- |
| *Die Struktur hat genügend Lager, die sie aber nicht festhalten: Sie kann sich noch …* | Die Lager sind alle parallel, oder ihre Wirkungslinien schneiden sich in einem Punkt. Die gestrichelte Kontur zeigt die Bewegung; ändern Sie die Richtung eines Lagers. Ist nur ein Teil betroffen, nennt dieselbe Meldung einen *separaten Teil*. |
| *Die Lager halten die Struktur, sie ist aber trotzdem ein Mechanismus: Ihre Stäbe können sich um die Gelenke am Knoten … drehen.* | Die Gelenke lassen Stäbe gegeneinander drehen, wie bei einem Rahmen mit Gelenken am Kopf beider Stützen oder einem gelenkigen Quadrat ohne Diagonale. Entfernen Sie ein Gelenk oder fügen Sie einen Stab oder ein Lager hinzu. |
| *Die Struktur ist instabil. Praktisch ohne Widerstand beweglich: Knoten …* | Beinahe ein Mechanismus oder eine Steifigkeit nahe null. Prüfen Sie Lager, Gelenke und die Werte von `E`, `A` und `Iy`. |
| *Die Struktur ist kinematisch: Die Steifigkeitsmatrix ist singulär.* | Etwas kann sich frei bewegen, das die Prüfungen oben nicht erkannt haben. Prüfen Sie, ob jeder Teil durch mindestens drei Bindungen gehalten wird und ob Gelenke keinen Stab frei drehbar lassen. |
| *Element … referenziert den fehlenden Knoten / das fehlende Material / den fehlenden Querschnitt …* | Das referenzierte Objekt wurde gelöscht, meist in einer von Hand bearbeiteten JSON-Datei. Weisen Sie es in der Tabelle *Elemente* neu zu. |
| *Element … muss genau 2 Knoten referenzieren.* | Ein defektes Element in einer importierten Datei. Löschen Sie es und legen Sie es neu an. |
| *Knotenlast / Vorgegebene Verschiebung #n referenziert den fehlenden Knoten …* | Löschen Sie die Last oder weisen Sie ihr einen Knoten zu. |
| *Elementlast #n referenziert das fehlende Element …* | Löschen Sie die Last. |
| *Die Berechnung ist wegen einer internen Inkonsistenz des Modells fehlgeschlagen…* | Ein allgemeiner Fehler. Machen Sie den letzten Schritt rückgängig oder speichern Sie die Datei und [melden Sie ihn](https://github.com/janvorisek/edubeam/issues). |

### Warnungen {#warnings}

Das Modell wird trotzdem berechnet, prüfen Sie aber Folgendes:

| Meldung | Bedeutung / Abhilfe |
| --- | --- |
| *Knoten … ist mit keinem Element verbunden und wird bei der Berechnung ignoriert.* | Ein verirrter Knoten. Löschen oder verbinden Sie ihn. |
| *Knoten … ist gelagert, aber mit keinem Element verbunden, daher trägt das Lager nichts.* | Ein Lager an einem verirrten Knoten. |
| *Element … referenziert an beiden Enden denselben Knoten.* | Ein Element der Länge null. Löschen Sie es. |
| *Knotenlast / Vorgegebene Verschiebung #n enthält ungültige Werte.* | Eine Komponente, die keine Zahl ist. Bearbeiten Sie die Last. |

## Ergebnisse sehen falsch aus {#results-look-wrong}

| Symptom | Wahrscheinliche Ursache |
| --- | --- |
| Lasten wirken nach oben | Global **z zeigt nach unten**, ein positives `Fz`/`fz` wirkt also nach unten. Negative Werte zeigen nach oben. Siehe [Konventionen](/de/elements/conventions). Mit y-Achse nach oben ist es umgekehrt. |
| Durchbiegung 1000-mal zu groß oder zu klein | Eine Einheitenverwechslung: `E` in Pa eingegeben, während die Einheit MPa ist, oder `Iy` in cm⁴, während die Einheit m⁴ ist. Prüfen Sie den Einheiten-Chip unten rechts in der Ansicht. |
| Durchbiegung etwas größer als nach Lehrbuchformel | Schubverformung des Timoshenko-Balkens. Erhöhen Sie den Schubkoeffizienten des Querschnitts oder verwenden Sie einen schlanken Stab, um sich den Werten nach Euler-Bernoulli zu nähern. Siehe [Ergebnisse von Hand prüfen](/de/guide/verification). |
| Ein Vorzeichen wirkt „falsch“ | Lesen Sie das Vorzeichen an den Beschriftungen ab, nicht an der Seite des Diagramms. Positives M bedeutet Zug unten. Die Stabendkräfte unter *Elementergebnisse* folgen den lokalen Achsen des Elements, nicht der N-V-M-Konvention. |
| Zwei gleiche Stützen zeigen entgegengesetzte Querkraft-Vorzeichen | Das Vorzeichen von V folgt der Richtung jedes Elements. Tauschen Sie zum Vergleich die Knoten eines davon. |
| Zahlen wie `4 · 10¹` | Das wissenschaftliche Zahlenformat. Wählen Sie *Automatisch* unter *Einstellungen → Sprache & Region → Zahlenformat*. |
| Diagramme riesig oder winzig | Rein optisch. Passen Sie die **Ergebnisskalierung** unter *Einstellungen → Anzeigeeinstellungen* an. |
| Eine Last in lokalen Koordinaten zeigt in die falsche Richtung | Die lokale x-Achse des Elements verläuft vom *Anfangs*- zum *Endknoten*. Tauschen Sie die Knoten oder kehren Sie das Vorzeichen um. |
| Die Last eines geneigten Stabs stimmt nicht | **LCS** ist standardmäßig angehakt, `fz` wirkt also senkrecht zum Stab. Entfernen Sie den Haken für eine vertikale Last. |
| Eine Temperaturlast bewirkt nichts | Ein statisch bestimmtes Tragwerk verformt sich unter Temperatur frei, ohne Schnittgrößen. Prüfen Sie, dass α ≠ 0 ist und für den Gradienten die Querschnittshöhe h gesetzt ist. |

## Probleme mit der Oberfläche {#interface-issues}

| Symptom | Abhilfe |
| --- | --- |
| Tastenkürzel wirken nicht | Klicken Sie zuerst auf die Zeichenfläche: Tasten werden ignoriert, solange ein Textfeld den Fokus hat. |
| Verschieben nicht möglich | Verschoben wird standardmäßig mit der mittleren oder rechten Maustaste; ändern Sie das unter *Einstellungen → Steuerung & Tastenkürzel*. Auf einem Trackpad zoomt das Scrollen mit zwei Fingern; zum Verschieben klicken und ziehen Sie mit zwei Fingern. |
| Mein Modell ist verschwunden | Das Öffnen eines Links, einer Datei oder eines Beispiels sowie das Löschen bewahren das alte Modell auf: **☰ → Zuletzt verwendete Modelle** oder <kbd>Strg</kbd>+<kbd>Z</kbd>. |
| Falsche Sprache | *Einstellungen → Sprache & Region* oder `?lang=de` an die Adresse anhängen. |
| Änderungen an den Einstellungen bleiben nicht erhalten | Der lokale Speicher ist blockiert (privates Fenster, strenger Datenschutzmodus). Einstellungen, automatisches Speichern und „Zuletzt verwendete Modelle“ brauchen ihn. |

## Fehler melden {#reporting-a-bug}

Eröffnen Sie ein [GitHub-Issue](https://github.com/janvorisek/edubeam/issues) mit Browser und Betriebssystem, dem erwarteten Verhalten und – am nützlichsten – einem **Link** oder der **Projektdatei**, mit dem bzw. der sich das Problem nachvollziehen lässt.
