# Einheiten & Einstellungen

Öffnen Sie die Einstellungen über die Schaltfläche **⚙ in der Ansicht → Weitere Einstellungen**, per Klick auf den **Einheiten-Chip** unten rechts in der Ansicht oder über den Reiter **Einstellungen** über der Ansicht. Einstellungen werden im Browser gespeichert und überstehen ein Neuladen; **Einstellungen zurücksetzen** stellt die Anzeigestandards und die Einheiten Ihrer Region wieder her (die Sprache bleibt erhalten).

## Sprache & Region

**Sprache** – 11 Oberflächensprachen. Die App lässt sich auch mit `?lang=<code>` öffnen (`en`, `cs`, `de`, `fr`, `es`, `pt`, `pl`, `cn`, `th`, `uk`, `ru`).

**Einheitensystem** – *SI (metrisch)* oder *US-amerikanisch (imperial)* stellt alle Einheiten unten in einem Schritt ein. Wird danach eine einzelne Einheit geändert, zeigt das System *Benutzerdefiniert* an. Beim ersten Besuch startet EduBeam in US-amerikanischen Einheiten, wenn der Browser auf ein US-Gebietsschema eingestellt ist *und* der Computer in einer US-Zeitzone steht, überall sonst in SI.

**Einheiten** – jede Größe hat ihre eigene Einheit. Eingaben, Tabellen, Tooltips und Diagrammbeschriftungen verwenden die gewählte Einheit, und ein Wechsel rechnet die Anzeige um (das Modell selbst wird intern in SI gespeichert, ein Hin- und Herschalten verliert also nichts, und ein geteilter Link öffnet dasselbe Modell in beliebigen Einheiten).

| Größe | Auswahl | SI | US-amerikanisch |
| --- | --- | --- | --- |
| Länge (Geometrie) | m, cm, mm, ft, in | m | ft |
| Querschnittsabmessungen | m, cm, mm, ft, in | m | in |
| Verschiebung | m, cm, mm, ft, in | m | in |
| Fläche | m², cm², mm², ft², in² | m² | in² |
| Flächenträgheitsmoment | m⁴, cm⁴, mm⁴, ft⁴, in⁴ | m⁴ | in⁴ |
| Masse | kg, lb | kg | lb |
| Kraft | N, kN, MN, kgf, Tonf, lbf, kip | kN | kip |
| Biegemoment | Nmm, Nm, kNm, MNm, Tonf·m, lbf·in, lbf·ft, kip·in, kip·ft | kNm | kip·ft |
| Spannung (E, G) | Pa, kPa, MPa, GPa, ksc, psi, ksi, psf, ksf | MPa | ksi |
| Temperatur | °C, °F | °C | °F |

Streckenlasten verwenden *Kraft / Länge* in den gewählten Einheiten (kN/m in SI, kip/ft in US-Einheiten), die Dichte *Masse / Länge³*. Der Wärmeausdehnungskoeffizient folgt der Temperatureinheit (1/K oder 1/°F). Temperaturlasten sind *Änderungen* der Temperatur, daher entsprechen 10 °C 18 °F. Verdrehungen sind immer in Radiant.

Tonf ist die metrische Tonne-Kraft (1000 kgf), nicht die US-amerikanische Short Ton. Die US-Einheiten werden mit ihren exakten Definitionen umgerechnet (1 ft = 0,3048 m, 1 kip = 4448,2216 N).

**Koordinatensystem** – *x nach rechts, z nach unten* (Standard) oder *x nach rechts, y nach oben*. Die Option y nach oben kehrt das Vorzeichen vertikaler Werte und Auflagerwinkel um und benennt die Achsen in allen Eingaben, Tabellen, Tooltips und Exporten um; Modell und gespeicherte Dateien ändern sich nicht. Siehe [Y-Achse nach oben](/de/elements/conventions#y-up-axes).

## Anzeigeeinstellungen

Eine **Vorschau** oben zeigt ein kleines Modell, das auf jede Änderung darunter reagiert.

**Raster**
- **Raster anzeigen** (<kbd>G</kbd>) – zeichnet Raster und Lineale.
- **Am Raster ausrichten** (<kbd>S</kbd>) – per Maus gesetzte oder gezogene Knoten rasten auf der Schrittweite ein.
- **Raster-Schrittweite** – Abstand in der Längeneinheit (Standard 0,1 m bzw. 0,5 ft in US-Einheiten). Beim Wechsel zwischen metrischen und US-Einheiten springt eine Schrittweite, die noch auf ihrem Standard steht, auf den Standard des anderen Systems; eine selbst gesetzte Schrittweite bleibt erhalten. Auch die Lineale zählen in der Längeneinheit; in Fuß zeigen Lineale und Fadenkreuz Fuß und Zoll (5′-6″), während Eingaben und Tabellen bei dezimalen Fuß bleiben (5,5).

**Ergebnisbeschriftungen**
- **Ausrichtung der Ergebnisbeschriftungen** – *Senkrecht zum Diagramm* (Beschriftungen folgen dem Verlauf) oder *Immer horizontal*.

**Größen**
- **Ergebnisskalierung** (0–120 px) – Bildschirmhöhe der größten Diagrammordinate bzw. Durchbiegung. Diagramme werden auf ihr eigenes Maximum normiert, es ist also eine rein optische Einstellung; ändern Sie sie, wenn die Verläufe im Verhältnis zum Modell zu groß oder zu klein sind.
- **Lagergröße** (0,5–1,5) und **Schriftgröße** (10–20 px).

**Farben** – eigene Farben für Knoten, Elemente, Lasten, verformte Form, Normalkraft, Querkraft, Biegemoment und Auflagerreaktionen. Standard: N blau, V grün, M rot, Reaktionen violett, Lasten orange.

## Steuerung & Tastenkürzel

**Verschieben mit** – mit welcher Maustaste die Zeichenfläche verschoben wird: *mittlere oder rechte* (Standard), *Mausrad* (nur mittlere Taste) oder nur *Rechte Taste*. Die vollständige Liste der Tastenkürzel steht auf der Seite [Tastatur & Maus](/de/reference/shortcuts).

## Was automatisch gespeichert wird

Neben den Einstellungen legt EduBeam nach jeder Änderung das **aktuelle Modell** im lokalen Speicher des Browsers ab. Ein Neuladen des Tabs oder erneutes Öffnen der App stellt es wieder her. Das gilt je Browser und Gerät – zum Übertragen nutzen Sie [Projekt speichern oder Modell teilen](/de/essentials/import-export).
