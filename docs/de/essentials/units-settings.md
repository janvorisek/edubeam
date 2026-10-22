# Einheiten & Einstellungen

Es gibt drei Wege zu den Einstellungen:

- der Reiter **Einstellungen** über der Ansicht, der sie in voller Größe zeigt;
- der **Einheiten-Chip** unten rechts in der Ansicht, der sie bei *Sprache & Region* öffnet;
- **Weitere Einstellungen** unter den Anzeigeoptionen, das sie bei *Anzeigeeinstellungen* öffnet.

Einstellungen werden in Ihrem Browser gespeichert und überstehen ein Neuladen. **Einstellungen zurücksetzen** stellt die Standards der Ansicht, das Zahlenformat, die Achsen, die Taste zum Verschieben und die Einheiten Ihrer Region wieder her; die Sprache bleibt erhalten.

## Sprache & Region {#language-locale}

![Einstellungen → Sprache & Region](/screenshots/de/settings-language.webp)

**Sprache.** 12 Oberflächensprachen. Sie können die App auch mit `?lang=<code>` öffnen: `en`, `cs`, `de`, `fr`, `es`, `pt`, `pl`, `cn`, `th`, `uk`, `ru`, `tr`.

**Zahlenformat.** Wie Ergebniswerte geschrieben werden: *Automatisch*, *Wissenschaftlich* (Standard) oder *Technisch*. Siehe [Zahlenformat](/de/essentials/results#number-format).

**Koordinatensystem.** *x nach rechts, z nach unten* (Standard) oder *x nach rechts, y nach oben*. Die Option y nach oben kehrt das Vorzeichen vertikaler Werte und der Lagerwinkel um und benennt die Achsen in allen Eingaben, Tabellen, Tooltips und Exporten um. Modell und gespeicherte Dateien ändern sich nicht. Siehe [Achsen mit y nach oben](/de/elements/conventions#y-up-axes).

![Der Dreigelenkrahmen mit y-Achse nach oben: Der Achsenindikator in der Ecke zeigt y nach oben](/screenshots/de/settings-y-up.webp){.shot-lg}

**Einheitensystem.** *SI (metrisch)* oder *US-amerikanisch (imperial)* stellt alle Einheiten unten in einem Schritt ein. Ändern Sie danach eine einzelne Einheit, zeigt das System *Benutzerdefiniert* an. Beim ersten Besuch wählen Sie im Willkommensdialog; bis dahin nimmt EduBeam nur dann US-Einheiten an, wenn der Browser auf ein US-Gebietsschema eingestellt ist *und* der Computer in einer US-Zeitzone steht.

**Einheiten.** Jede Größe hat ihre eigene Einheit. Eingaben, Tabellen, Tooltips und Diagrammbeschriftungen verwenden alle die gewählte Einheit, und ein Wechsel rechnet die Anzeige um. Das Modell selbst wird in SI gespeichert; durch Hin- und Herschalten geht also nichts verloren, und ein geteilter Link öffnet dasselbe Modell in beliebigen Einheiten.

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
| Druck (E, G) | Pa, kPa, MPa, GPa, ksc, psi, ksi, psf, ksf | MPa | ksi |
| Temperatur | °C, °F | °C | °F |

Streckenlasten verwenden *Kraft / Länge* in den gewählten Einheiten (kN/m in SI, kip/ft in US-Einheiten), die Dichte *Masse / Länge³*. Der Wärmeausdehnungskoeffizient folgt der Temperatureinheit (1/K oder 1/°F). Temperaturlasten sind Temperatur*änderungen*, daher entsprechen 10 °C 18 °F. Verdrehungen sind immer in Radiant.

Tonf ist die metrische Tonne-Kraft (1000 kgf), nicht die US-amerikanische Short Ton. US-Einheiten werden mit ihren exakten Definitionen umgerechnet (1 ft = 0,3048 m, 1 kip = 4448,2216 N). In Fuß geben Sie Dezimalwerte wie `5,5` ein; Lineale und Fadenkreuz zeigen Fuß und Zoll (5′-6″).

## Anzeigeeinstellungen {#viewer-settings}

![Einstellungen → Anzeigeeinstellungen, rechts die Live-Vorschau](/screenshots/de/settings-viewer.webp)

Eine **Vorschau** neben den Einstellungen zeigt ein kleines Modell, das auf jede Änderung reagiert. Die Chips darunter wählen, welches Ergebnis es zeigt, und ein Klick auf eine Farbe schaltet die Vorschau auf das zugehörige Ergebnis um.

**Raster**
- **Raster anzeigen** (<kbd>G</kbd>) zeichnet das Raster und die Lineale.
- **Am Raster ausrichten** (<kbd>S</kbd>) lässt Knoten, die Sie setzen oder ziehen, an der Raster-Schrittweite einrasten.
- **Fadenkreuz anzeigen** markiert die Zeigerposition auf den Linealen, sodass Sie ihre Koordinaten ablesen können (nur mit Maus).
- **Raster-Schrittweite** ist der Abstand in der Längeneinheit: standardmäßig 0,1 m bzw. 0,5 ft in US-Einheiten. Beim Wechsel zwischen metrischen und US-Einheiten springt eine Schrittweite, die noch auf ihrem Standard steht, auf den Standard des anderen Systems; eine selbst gesetzte Schrittweite bleibt erhalten.

**Größen**
- **Ergebnisskalierung** (8–120 px, Standard 48) ist die Bildschirmhöhe der größten Diagrammordinate bzw. Durchbiegung. Diagramme werden auf ihr eigenes Maximum skaliert, es ist also eine rein optische Einstellung; ändern Sie sie, wenn die Verläufe zu groß oder zu klein sind.
- **Lagergröße** (50–150 %) und **Schriftgröße** (10–20 px). Größere Schrift hilft am Beamer.

**Ausrichtung der Ergebnisbeschriftungen**: *Senkrecht zum Diagramm* (Beschriftungen folgen dem Diagramm) oder *Immer horizontal*.

**Modellprüfung**
- **Zeigen, wie sich eine instabile Struktur bewegen kann** zeichnet die gestrichelte Kontur eines Mechanismus.
- **Bewegung animieren** lässt sie hin und her schwingen.

**Farben**: eigene Farben für Knoten, Elemente, Lasten, Verformungsfigur, Normalkraft, Querkraft, Biegemoment und Auflagerreaktionen. Standard: N blau, V grün, M rot, Auflagerreaktionen violett, Lasten orange.

## Steuerung & Tastenkürzel {#controls-shortcuts}

**Verschieben mit** legt fest, mit welcher Maustaste die Zeichenfläche verschoben wird: *Mausrad oder rechte Taste* (Standard), *Mausrad* oder *Rechte Taste*. Die vollständige Liste der Tastenkürzel steht auf der Seite [Tastatur, Maus & Touch](/de/reference/shortcuts).

## Was in Ihrem Browser gespeichert wird {#what-is-stored-in-your-browser}

Neben den Einstellungen legt EduBeam im lokalen Speicher des Browsers ab:

- das **aktuelle Modell**, gespeichert nach jeder Änderung, sodass ein Neuladen des Tabs oder erneutes Öffnen der App es wiederherstellt;
- **Zuletzt verwendete Modelle**: die letzten 10 Modelle, die Sie gelöscht oder ersetzt haben.

Beides gilt je Browser und je Gerät, und das Löschen der Websitedaten entfernt es. Nutzen Sie [Projekt speichern oder Modell teilen](/de/essentials/import-export), um ein Modell zu behalten oder an einen anderen Ort zu bringen.
