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

<Edubeam /> ist ein kostenloses, browserbasiertes Werkzeug für die **Statik ebener Stabtragwerke** – Balken, Rahmen und Fachwerke. Sie zeichnen das Tragwerk, setzen Lager und Lasten, und der Finite-Elemente-Solver rechnet alles in dem Moment neu, in dem Sie etwas ändern. Keine Schaltfläche „Berechnen“, keine Installation, kein Konto.

[Starten Sie EduBeam](https://run.edubeam.app/?lang=de){target="_blank"} in einem neuen Tab und folgen Sie dem [Schnellstart](/de/guide/quick-start).

<figure>
  <a href="https://run.edubeam.app/?lang=de" target="_blank">
    <WelcomeStructure />
  </a>
  <figcaption>Ein statisch unbestimmter Balken, live im Browser gelöst</figcaption>
</figure>

## Was EduBeam kann

| Bereich | Möglichkeiten |
| --- | --- |
| **Tragwerke** | Ebene (x–z) Balken, Durchlaufträger, Rahmen und Fachwerke aus Knoten und 2D-Balkenelementen (Timoshenko-Balken). Endgelenke machen aus jedem Stab einen Fachwerkstab. |
| **Lager** | Beliebige Kombination gehaltener Freiheitsgrade `Dx`, `Dz`, `Ry` an einem Knoten → Einspannung, Festlager, Loslager, Schiebehülse … Schräge Lager über einen Winkel des Knotenkoordinatensystems. |
| **Lasten** | Knotenkräfte und -momente, vorgegebene Verschiebungen (Auflagersenkungen), gleichmäßig verteilte und Trapez-Streckenlasten (global oder lokal), Einzellasten an beliebiger Stelle eines Stabs sowie gleichmäßige und ungleichmäßige Temperaturlasten. |
| **Ergebnisse** | Verformte Form (Biegelinie), Normalkraft **N**, Querkraft **V<sub>z</sub>**, Biegemoment **M<sub>y</sub>**, Auflagerreaktionen, Knotenverschiebungen, Stabendkräfte und Elementsteifigkeitsmatrizen. |
| **Berechnung** | Lineare statische Berechnung mit einem Lastfall. Die Ergebnisse sind für das lineare Modell exakt (keine Netzverfeinerung nötig). |
| **Dateien** | Projekte als JSON speichern/öffnen, ein ganzes Modell als URL teilen, einen schreibgeschützten Viewer einbetten. Alles bleibt auf Ihrem Gerät. |
| **Einheiten** | Unabhängig wählbare Einheiten für Länge, Fläche, Flächenträgheitsmoment, Masse, Kraft, Moment und Spannung (metrisch und angloamerikanisch). |

## Was EduBeam (noch) nicht kann

Die Grenzen vorab zu kennen spart Zeit:

- **Nur 2D** – kein Verhalten aus der Ebene heraus, keine räumlichen Rahmen.
- **Nur lineare Statik** – keine Theorie II. Ordnung (P–Δ), kein Knicken, keine Dynamik, keine Plastizität.
- **Ein Lastfall** – keine Lastfallkombinationen oder Umhüllenden. Modellieren Sie jeden Fall getrennt (als eigene Datei oder eigenen Link speichern).
- **Kein Eigengewicht** – bei Bedarf als Streckenlast ansetzen.
- **Keine Nachweise** – EduBeam liefert Schnittgrößen und Verformungen; die Bemessung nach Norm bleibt Ihnen überlassen.

Wenn Ihnen eine Funktion fehlt, [eröffnen Sie ein Issue](https://github.com/janvorisek/edubeam/issues).

## Für wen ist EduBeam gedacht?

- **Studierende** der Technischen Mechanik und Baustatik, die sofortige Rückmeldung zu Handrechnungen wollen. Siehe [Ergebnisse von Hand prüfen](/de/guide/verification).
- **Lehrende**, die zeigen, wie Lager, Gelenke und Lasten die Schnittgrößenverläufe verändern – live, am Beamer, in einer von 11 Sprachen.
- **Ingenieurinnen und Ingenieure**, die eine schnelle Plausibilitätsprüfung brauchen, bevor sie das „große“ Programm öffnen.

## Aufbau der Dokumentation

1. **Erste Schritte** – diese Seite, der [10-Minuten-Schnellstart](/de/guide/quick-start) und fertige [Beispiele](/de/examples/).
2. **Modellierung** – je eine Seite pro Baustein: [Benutzeroberfläche](/de/essentials/user-interface), [Knoten & Lager](/de/essentials/nodes-supports), [Elemente, Materialien & Querschnitte](/de/essentials/elements), [Lasten](/de/essentials/loads), [Einheiten & Einstellungen](/de/essentials/units-settings).
3. **Ergebnisse** – wie man [Diagramme und Tabellen liest](/de/essentials/results) und sie [überprüft](/de/guide/verification).
4. **Dateien & Teilen** – [JSON-Projekte, Links und der einbettbare Viewer](/de/essentials/import-export).
5. **Referenz** – [Tastatur & Maus](/de/reference/shortcuts), [Fehlerbehebung](/de/reference/troubleshooting) und die [FAQ](/de/faq/).
6. **Theoriehandbuch** – [Vorzeichenkonvention](/de/elements/conventions) und die Elementformulierungen für [Balken](/de/elements/beam) und [Fachwerkstab](/de/elements/truss).

## Sprachen

Die Oberfläche ist auf Deutsch, Englisch, Tschechisch, Spanisch, Französisch, Polnisch, Portugiesisch, Russisch, Ukrainisch, Thai und Chinesisch verfügbar. EduBeam wählt die Sprache anhand des Browsers; ändern Sie sie unter **Einstellungen → Sprache & Region** oder öffnen Sie die App mit dem Parameter `?lang=`, z. B. [run.edubeam.app/?lang=de](https://run.edubeam.app/?lang=de){target="_blank"}.

## Autoren & Danksagung

<Edubeam /> wird von [Jan Voříšek](https://github.com/janvorisek) geleitet, dem Maintainer und Produktdesigner der modernen Web-Version. Die Browser-Version wird unabhängig von der ČVUT entwickelt; das ursprüngliche Desktop-EduBeam für Windows/Linux wurde von [Bořek Patzák](http://ksm.fsv.cvut.cz/~bp/), [Jan Stránský](https://mech.fsv.cvut.cz/~stransky/en/) und [Vít Šmilauer](https://mech.fsv.cvut.cz/~smilauer/) am Lehrstuhl für Mechanik der [Fakultät für Bauingenieurwesen der Tschechischen Technischen Universität Prag](https://www.fsv.cvut.cz/en) entwickelt. Der Solver ist die Open-Source-Bibliothek [ts-fem](https://github.com/janvorisek/ts-fem).

<VPTeamMembers size="small" :members="members" />

## Mitmachen

- Melden Sie unklares Verhalten oder Fehler als [GitHub-Issue](https://github.com/janvorisek/edubeam/issues).
- Verbessern Sie diese Dokumentation oder Übersetzungen durch Bearbeiten der Dateien in `docs/` und einen Pull Request.
- Empfehlen Sie EduBeam Kommilitonen und Kollegen weiter.
