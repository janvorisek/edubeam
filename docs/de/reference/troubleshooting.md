# Fehlerbehebung

## Es werden keine Ergebnisse gezeichnet

Ergebnisse erscheinen nur, wenn das Modell lösbar ist. Prüfen Sie in dieser Reihenfolge:

1. **Gibt es einen roten Hinweis in der Ansicht?** *Keine Materialien definiert.* / *Keine Querschnitte definiert.* → anlegen. *Model has N error(s)* → auf **Show details** klicken und jeden Punkt beheben (siehe Tabelle unten).
2. **Genug Lager?** Der Solver braucht mindestens drei gehaltene Freiheitsgrade *und* keine kinematische Kette. Ein Balken auf zwei Loslagern (Dz + Dz) hat nur zwei und rutscht weg; ein Rahmen mit lauter Gelenken ohne Aussteifung kann trotz vieler Lager ein Mechanismus sein. Ergänzen Sie irgendwo `Dx` oder `Ry` an einem Lager.
3. **Sind die Elemente verbunden?** Zwei Knoten mit gleichen Koordinaten sind trotzdem zwei getrennte Knoten. Löschen Sie den überzähligen und verbinden Sie neu, oder setzen Sie Knoten auf Elemente mit **Mit Struktur verbinden**.
4. **Überall Gelenke?** Ein Knoten, dessen sämtliche Elemente gelenkig sind und der kein gehaltenes `Ry` hat, hat eine unbestimmte Verdrehung. Entfernen Sie ein Gelenk oder halten Sie `Ry` an diesem Knoten.
5. **Absurde Zahlen** (Verschiebungen in Millionen) bedeuten, das Tragwerk ist beinahe ein Mechanismus; EduBeam blendet solche Ergebnisse aus. Suchen Sie nach einem fehlenden Lager oder einer nahezu null Steifigkeit (`E`, `A` oder `Iy` versehentlich als 0 oder in der falschen Einheit eingegeben).

## Fehlermeldungen

Meldungen aus **Show details** (Dialog *Cannot solve model*, derzeit nur auf Englisch):

| Meldung | Bedeutung / Abhilfe |
| --- | --- |
| *Model needs at least 3 constrained DOFs to be stable in 2D analysis.* | Lager ergänzen, bis insgesamt mindestens drei Freiheitsgrade gehalten sind. |
| *Element X references missing node / material / cross section Y.* | Das referenzierte Objekt wurde gelöscht (meist bei handbearbeiteten JSON-Dateien). In der Tabelle *Elemente* neu zuweisen. |
| *Element X must reference exactly 2 nodes.* | Defektes Element in einer importierten Datei; löschen und neu anlegen. |
| *Nodal load / Prescribed displacement #n references missing node Y.* | Last löschen oder neu zuweisen. |
| *Element load #n references missing element Y.* | Last löschen. |
| *Solver failed due to an internal model inconsistency…* | Allgemeiner Fehler; letzten Schritt rückgängig machen oder Datei speichern und [melden](https://github.com/janvorisek/edubeam/issues). |

Warnungen (Dialog *Model warnings*) stoppen die Berechnung nicht: *Element X references the same node at both ends* (Element mit Länge null – löschen) und *… contains invalid values* (Last mit nicht-numerischer Komponente – bearbeiten).

## Ergebnisse sehen falsch aus

| Symptom | Wahrscheinliche Ursache |
| --- | --- |
| Lasten wirken nach oben | Global **z zeigt nach unten**, positives `Fz`/`fz` wirkt also nach unten. Negative Werte zeigen nach oben. Siehe [Vorzeichenkonvention](/de/elements/conventions). |
| Durchbiegung 1000× zu groß oder zu klein | Einheitenverwechslung – `E` in Pa eingegeben bei eingestellter Einheit MPa, oder `Iy` in cm⁴ bei Einheit m⁴. Einheiten-Chip unten rechts in der Ansicht prüfen. |
| Durchbiegung etwas größer als nach Lehrbuchformel | Schubverformung des Timoshenko-Balkens. Schubkoeffizienten des Querschnitts erhöhen (oder schlanken Stab verwenden), um sich den Euler-Bernoulli-Werten zu nähern. Siehe [Ergebnisse von Hand prüfen](/de/guide/verification). |
| Momentenlinie auf der „falschen“ Seite | Die Seite ist nur eine Zeichenkonvention; lesen Sie das Vorzeichen aus den Beschriftungen – positiv bedeutet Zug in der unteren Faser. |
| Diagramme riesig / winzig | Rein optisch – **Ergebnisskalierung** unter *Einstellungen → Anzeigeeinstellungen* anpassen. |
| Last in lokalen Koordinaten zeigt in die falsche Richtung | Die lokale x-Achse verläuft vom *Anfangs*- zum *Endknoten*. **Knotenreihenfolge tauschen** oder Vorzeichen umkehren. |
| Temperaturlast bewirkt nichts | Statisch bestimmte Tragwerke verformen sich unter Temperatur zwängungsfrei ohne Schnittgrößen. Prüfen Sie α ≠ 0 und, für den Gradientenanteil, dass die Querschnittshöhe h gesetzt ist. |

## Probleme mit der Oberfläche

| Symptom | Abhilfe |
| --- | --- |
| Tastenkürzel wirken nicht | Zuerst auf die Zeichenfläche klicken – Tasten werden ignoriert, solange ein Textfeld den Fokus hat. |
| Verschieben nicht möglich | Verschieben nutzt standardmäßig die mittlere/rechte Maustaste; unter *Einstellungen → Steuerung & Tastenkürzel* ändern. Am Touchpad zwei Finger verwenden oder auf *Rechte Taste* umstellen. |
| Modell nach einem Update verschwunden | Ein Update, das den Speicher zurücksetzt, wird vorher per Dialog angekündigt; brechen Sie es ab und speichern Sie das Projekt vor dem Update. |
| Falsche Sprache | *Einstellungen → Sprache & Region* oder `?lang=de` an die URL anhängen. |
| Einstellungen werden nicht behalten | Der lokale Speicher ist blockiert (privates Fenster, strenger Datenschutzmodus). Einstellungen und automatisches Speichern brauchen ihn. |

## Fehler melden

Eröffnen Sie ein [GitHub-Issue](https://github.com/janvorisek/edubeam/issues) mit Browser und Betriebssystem, dem erwarteten Verhalten und – am nützlichsten – einem **geteilten Link** oder der **Projekt-JSON**, die das Problem reproduziert.
