# Einheiten & Einstellungen

Öffnen Sie die Einstellungen über die Schaltfläche **⚙ in der Ansicht → Weitere Einstellungen**, per Klick auf den **Einheiten-Chip** unten rechts in der Ansicht oder über den Reiter **Einstellungen** über der Ansicht. Einstellungen werden im Browser gespeichert und überstehen ein Neuladen; **Einstellungen zurücksetzen** stellt die Anzeigestandards wieder her (Sprache und Einheiten bleiben erhalten).

## Sprache & Region

**Sprache** – 11 Oberflächensprachen. Die App lässt sich auch mit `?lang=<code>` öffnen (`en`, `cs`, `de`, `fr`, `es`, `pt`, `pl`, `cn`, `th`, `uk`, `ru`).

**Einheiten** – jede Größe hat ihre eigene Einheit. Eingaben, Tabellen, Tooltips und Diagrammbeschriftungen verwenden die gewählte Einheit, und ein Wechsel rechnet die Anzeige um (das Modell selbst wird intern in SI gespeichert, ein Hin- und Herschalten verliert also nichts).

| Größe | Auswahl | Standard |
| --- | --- | --- |
| Länge | m, cm, mm, in, ft | m |
| Fläche | m², cm², mm², in², ft² | m² |
| Flächenträgheitsmoment | m⁴, cm⁴, mm⁴, in⁴, ft⁴ | m⁴ |
| Masse | kg, lb | kg |
| Kraft | N, kN, MN, lbf, tonf, kgf | kN |
| Biegemoment | Nmm, Nm, kNm, MNm, tonf·m, lbf·in, lbf·ft | kNm |
| Spannung (E, G) | Pa, kPa, MPa, GPa, psi, ksc | MPa |

Streckenlasten verwenden *Kraft / Länge* in den gewählten Einheiten (Standard kN/m). Winkel sind immer in Radiant, Temperaturen immer in °C/K.

::: tip Angloamerikanische Einheiten
Wählen Sie nach Bedarf ft (oder in), in², in⁴, lbf und psi – es gibt keinen einzelnen „Imperial“-Schalter, jede Größe wird einzeln eingestellt.
:::

## Anzeigeeinstellungen

Eine **Vorschau** oben zeigt ein kleines Modell, das auf jede Änderung darunter reagiert.

**Raster**
- **Raster anzeigen** (<kbd>G</kbd>) – zeichnet Raster und Lineale.
- **Am Raster ausrichten** (<kbd>S</kbd>) – per Maus gesetzte oder gezogene Knoten rasten auf der Schrittweite ein.
- **Raster-Schrittweite** – Abstand in Metern (Standard 0,1).

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
