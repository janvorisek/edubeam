---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "EduBeam"
  text: "Kostenlose Stabwerksberechnung online"
  tagline: Zeichnen Sie einen Balken, einen Rahmen oder ein Fachwerk, setzen Sie Lasten und sehen Sie zu, wie sich die Verläufe bei jeder Änderung aktualisieren. Vollständige FEM-Ergebnisse im Browser – ohne Installation, ohne Konto, ohne Kosten.
  image:
    src: /screenshots/de/hero.webp
    alt: EduBeam mit einem berechneten Rahmen
  actions:
    - theme: brand
      text: App starten
      link: https://run.edubeam.app/?lang=de
    - theme: alt
      text: Anleitung lesen
      link: /de/guide/introduction
    - theme: alt
      text: Beispiele ansehen
      link: /de/examples/

features:
  - icon: ⚡
    title: Ergebnisse schon beim Zeichnen
    details: Es gibt keine Schaltfläche „Berechnen“. Ziehen Sie einen Knoten, haken Sie ein Gelenk an oder ändern Sie eine Last – N, V, M, Auflagerreaktionen und die Verformungsfigur folgen sofort.
    link: /de/essentials/results
    linkText: Ergebnisse lesen
  - icon: 🧑‍🏫
    title: Für die Lehre gemacht
    details: Geführte erste Schritte, Werte beim Überfahren mit der Maus, ein Solver, der erklärt, warum ein Tragwerk kinematisch ist, und Links, die Sie in Vorlesungsunterlagen einfügen können.
    link: /de/guide/teaching
    linkText: Lehren mit EduBeam
  - icon: 🌍
    title: Ihre Sprache, Ihre Einheiten
    details: 12 Oberflächensprachen, SI- oder US-Einheiten und wahlweise z nach unten oder die aus Lehrbüchern bekannte y-Achse nach oben.
    link: /de/essentials/units-settings
    linkText: Einheiten & Einstellungen
  - icon: 🔗
    title: Teilen, exportieren, einbetten
    details: Senden Sie ein ganzes Modell als Link, speichern Sie es als Datei, exportieren Sie die Zeichnung als PNG oder SVG und die Ergebnistabellen als CSV.
    link: /de/essentials/import-export
    linkText: Dateien & Teilen
---

## Hier starten {#start-here}

<div class="start-grid">

**Neu bei EduBeam?** Folgen Sie dem [10-Minuten-Schnellstart](/de/guide/quick-start). Sie modellieren Schritt für Schritt einen Einfeldträger und prüfen jedes Ergebnis von Hand.

**Wissen Sie schon, was Sie bauen wollen?** Springen Sie zu einem [Tutorial](/de/tutorials/three-hinged-frame) oder öffnen Sie ein fertiges [Beispiel](/de/examples/) und passen Sie es an.

**Halten Sie eine Lehrveranstaltung?** Siehe [Lehren mit EduBeam](/de/guide/teaching): Links für Übungsaufgaben, ein einbettbarer Viewer für Folien und Übungen.

</div>

<div class="shots">

![Ein Fachwerk: Normalkräfte, Zug positiv](/screenshots/de/tut-truss.webp)

![Ein Mechanismus wird sichtbar: EduBeam zeigt, warum er nicht berechnet werden kann](/screenshots/de/ui-mechanism.webp)

</div>

## Was Sie modellieren können {#what-you-can-model}

- **Balken, Rahmen und Fachwerke** in der Ebene: Durchlaufträger, Portalrahmen, Dreigelenkbögen, gelenkige Fachwerke.
- **Beliebige Lager**: Festlager, Loslager, Einspannung, Parallelführung, gedrehte Lager und Auflagersenkungen.
- **Lasten**: Einzelkräfte und -momente, gleichmäßige und trapezförmige Streckenlasten, Einzellasten an beliebiger Stelle eines Stabs und Temperatur.
- **Beliebige Querschnitte**: aus der Bibliothek (IPE, HEA, AISC W, HSS, Rechtecke, Rohre) oder als Polygon gezeichnet, mit automatisch berechneten Querschnittswerten.

Mehr dazu in der [Einführung](/de/guide/introduction).

<ElementariumPromo />
