<script setup>
import { VPTeamMembers } from 'vitepress/theme'

const members = [
  {
    avatar: 'https://www.github.com/janvorisek.png',
    name: 'Jan Voříšek',
    title: 'Leitender Entwickler & Produktdesigner',
    links: [
      { icon: 'github', link: 'https://github.com/janvorisek' },
      { icon: 'twitter', link: 'https://twitter.com/janvorisekdev' },
    ]
  },
  {
    avatar: 'https://www.github.com/bpatzak.png',
    name: 'Bořek Patzák',
    title: 'FEM-Solver, Autor der ursprünglichen Anwendung',
    links: [
      { icon: 'github', link: 'https://github.com/bpatzak' },
    ]
  }
]
</script>

# Einführung

<Edubeam /> ist ein kostenloses, browserbasiertes Programm zur **Berechnung ebener Stabtragwerke** – Balken, Rahmen und Fachwerke. Sie zeichnen das Tragwerk, setzen Lager und Lasten, und der Finite-Elemente-Solver rechnet alles neu, sobald Sie etwas ändern. Es gibt keine Schaltfläche *Berechnen*, keine Installation und kein Konto.

[Starten Sie EduBeam](https://run.edubeam.app/?lang=de){target="_blank"} in einem neuen Tab und arbeiten Sie den [Schnellstart](/de/guide/quick-start) parallel mit.

![Ein Dreigelenkrahmen in EduBeam: Lasten in Orange, Auflagerreaktionen in Violett, das Biegemoment in Rot und die Verformungsfigur in Grau](/screenshots/de/hero.webp)

## Ihr erster Besuch {#your-first-visit}

Beim ersten Öffnen der App fragt ein Willkommensdialog, wie Sie beginnen möchten und welche Einheiten und Achsen Sie verwenden wollen. Beides können Sie später in den [Einstellungen](/de/essentials/units-settings) ändern.

![Der Willkommensdialog](/screenshots/de/welcome.webp){.shot-lg}

- **Rundgang starten** zeigt nacheinander das Menü, Rückgängig und Wiederholen, die Schaltflächen der Ansicht, die Anzeigeoptionen, Raster und Einheiten sowie die untere Leiste.
- **Ersten Balken zeichnen** ist eine geführte Aufgabe in sieben Schritten. Sie zeichnen mit der Maus einen Balken, lagern und belasten ihn und lesen die Ergebnisse ab. Eine kleine Karte in der Ecke sagt Ihnen, was als Nächstes zu tun ist.
- **Beispiel öffnen** öffnet die Galerie mit fertigen Modellen.

Alle drei finden Sie auch im **Menü ☰**, sodass Sie jederzeit darauf zurückkommen können.

![Ersten Balken zeichnen: Die Anleitungskarte bleibt beim Arbeiten in der Ecke](/screenshots/de/first-beam-task.webp)

## Was EduBeam kann {#what-it-does}

| Bereich | Möglichkeiten |
| --- | --- |
| **Tragwerke** | Ebene (x–z) Balken, Durchlaufträger, Rahmen und Fachwerke aus Knoten und 2D-Timoshenko-Balkenelementen. Endgelenke machen aus jedem Stab einen Fachwerkstab. |
| **Lager** | Festlager, Loslager, Einspannung, Parallelführung und jede andere Kombination gehaltener Freiheitsgrade `Dx`, `Dz`, `Ry`, ausgewählt über das Symbol. Gedrehte Lager über einen Knotenwinkel. Auflagersenkungen. |
| **Lasten** | Knotenkräfte und -momente, vorgegebene Verschiebungen, gleichmäßige und trapezförmige Streckenlasten, Einzelkräfte und -momente entlang eines Stabs sowie gleichmäßige Temperaturänderung oder Temperaturgradient. |
| **Querschnitte** | Material- und Querschnittsbibliotheken (europäisch und US-amerikanisch) sowie ein Polygon-Editor, der für jede Form $A$, $I_y$, $I_z$, $I_{yz}$, Hauptachsen und Trägheitsradien berechnet. |
| **Ergebnisse** | Verformungsfigur, Normalkraft **N**, Querkraft **V**, Biegemoment **M**, Auflagerreaktionen, Knotenverschiebungen, Stabendkräfte und Elementsteifigkeitsmatrizen. |
| **Berechnung** | Lineare statische Berechnung mit einem Lastfall. Die Ergebnisse sind für das lineare Modell exakt, eine Netzverfeinerung ist also nicht nötig. Lässt sich ein Tragwerk nicht berechnen, sagt EduBeam, warum, und animiert, wie es sich bewegen kann. |
| **Dateien** | Projekte als JSON speichern und öffnen, ein ganzes Modell als Link teilen, die Zeichnung als PNG oder SVG und die Ergebnisse als CSV exportieren. Kürzlich ersetzte Modelle werden aufbewahrt, sodass Sie sie zurückholen können. Alles bleibt auf Ihrem Gerät. |
| **Einheiten** | SI oder US-Einheiten mit einem Klick oder jede Größe einzeln. Achsen wahlweise x nach rechts, z nach unten oder x nach rechts, y nach oben. |

## Was EduBeam (noch) nicht kann {#what-it-does-not-do-yet}

Die Grenzen vorab zu kennen spart Zeit:

- **Nur 2D.** Kein Verhalten aus der Ebene heraus, keine räumlichen Rahmen.
- **Nur lineare Statik.** Keine Theorie II. Ordnung (P–Δ), kein Knicken, keine Dynamik, keine Plastizität.
- **Ein Lastfall.** Es gibt keine Lastfallkombinationen oder Umhüllenden. Modellieren Sie jeden Fall getrennt und speichern Sie ihn als eigene Datei oder eigenen Link.
- **Kein Eigengewicht.** Setzen Sie es bei Bedarf als Streckenlast an.
- **Keine Nachweise.** EduBeam liefert Schnittgrößen und Verformungen; die Bemessung nach Norm bleibt Ihnen überlassen.

Wenn Ihnen eine Funktion fehlt, [eröffnen Sie ein Issue](https://github.com/janvorisek/edubeam/issues).

<ElementariumPromo placement="introduction" />

## Für wen ist EduBeam gedacht? {#who-is-it-for}

- **Studierende** der Technischen Mechanik und Baustatik, die sofortige Rückmeldung zu ihren Handrechnungen wollen. Siehe [Ergebnisse von Hand prüfen](/de/guide/verification).
- **Lehrende**, die zeigen, wie Lager, Gelenke und Lasten die Schnittgrößen verändern – live am Beamer, in einer von 12 Sprachen. Siehe [Lehren mit EduBeam](/de/guide/teaching).
- **Ingenieurinnen und Ingenieure**, die eine schnelle Plausibilitätsprüfung wollen, bevor sie ein schwereres Desktop-Programm öffnen.

## Aufbau dieser Anleitung {#how-this-guide-is-organised}

1. **Erste Schritte.** Diese Seite, der [10-Minuten-Schnellstart](/de/guide/quick-start) und fertige [Beispiele](/de/examples/).
2. **Tutorials.** Vollständige Modelle von Anfang bis Ende, von Hand geprüft: ein [Dreigelenkrahmen](/de/tutorials/three-hinged-frame) und ein [ebenes Fachwerk](/de/tutorials/truss).
3. **Modellierung.** Je eine Seite pro Baustein: [Benutzeroberfläche](/de/essentials/user-interface), [Knoten & Lager](/de/essentials/nodes-supports), [Elemente, Materialien & Querschnitte](/de/essentials/elements), [Lasten](/de/essentials/loads) sowie [Einheiten & Einstellungen](/de/essentials/units-settings).
4. **Ergebnisse.** Wie Sie [Diagramme und Tabellen lesen](/de/essentials/results) und sie [überprüfen](/de/guide/verification).
5. **Dateien & Teilen.** [Projekte, Links, Bild- und CSV-Export](/de/essentials/import-export) sowie [Lehren mit EduBeam](/de/guide/teaching).
6. **Referenz.** [Tastatur, Maus & Touch](/de/reference/shortcuts), [Fehlerbehebung](/de/reference/troubleshooting) und die [FAQ](/de/faq/).
7. **Theoriehandbuch.** [Vorzeichenkonventionen](/de/elements/conventions) und die Elementformulierungen für den [Balken](/de/elements/beam) und den [Fachwerkstab](/de/elements/truss).

Die **?**-Symbole in der App öffnen die passende Seite dieser Anleitung in Ihrer Sprache.

## Sprachen {#languages}

Die Oberfläche ist auf English, Čeština, Deutsch, Español, Français, Polski, Português, Русский, Türkçe, Українська, ไทย und 汉语 verfügbar. EduBeam übernimmt die Sprache Ihres Browsers. Ändern Sie sie unter **Einstellungen → Sprache & Region** oder öffnen Sie die App mit dem Parameter `?lang=`, z. B. [run.edubeam.app/?lang=de](https://run.edubeam.app/?lang=de){target="_blank"}.

## Autoren & Danksagung {#authors-credits}

<Edubeam /> wird von [Jan Voříšek](https://github.com/janvorisek) geleitet, dem Maintainer und Produktdesigner der modernen Web-Version. Die Browser-Version wird unabhängig von der ČVUT entwickelt. Das ursprüngliche Desktop-EduBeam für Windows und Linux entwickelten [Bořek Patzák](http://ksm.fsv.cvut.cz/~bp/), [Jan Stránský](https://mech.fsv.cvut.cz/~stransky/en/) und [Vít Šmilauer](https://mech.fsv.cvut.cz/~smilauer/) am Lehrstuhl für Mechanik der [Fakultät für Bauingenieurwesen der ČVUT Prag](https://www.fsv.cvut.cz/en). Der Solver ist die Open-Source-Bibliothek [ts-fem](https://github.com/janvorisek/ts-fem).

<VPTeamMembers size="small" :members="members" />

## Mitmachen {#contribute}

- Melden Sie unklares Verhalten oder Fehler als [GitHub-Issue](https://github.com/janvorisek/edubeam/issues).
- Verbessern Sie diese Dokumentation oder die Übersetzungen, indem Sie die Dateien in `docs/` bearbeiten und einen Pull Request stellen.
- Empfehlen Sie EduBeam Kommilitoninnen, Kommilitonen und Kollegen weiter.
