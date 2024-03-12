<script setup>
import { VPTeamMembers } from 'vitepress/theme'

const members = [
  {
    avatar: 'https://www.github.com/janvorisek.png',
    name: 'Jan Voříšek',
    title: 'Maintainer, UI/UX',
    links: [
      { icon: 'github', link: 'https://github.com/janvorisek' },
      { icon: 'twitter', link: 'https://twitter.com/janvorisekdev' },
    ]
  },
  {
   avatar: 'https://www.github.com/bpatzak.png',
    name: 'Bořek Patzák',
    title: 'Original author',
    links: [
      { icon: 'github', link: 'https://github.com/bpatzak' },
      { icon: { svg: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="style=stroke" clip-path="url(#clip0_1_1828)"> <g id="web"> <path id="vector (Stroke)" fill-rule="evenodd" clip-rule="evenodd" d="M10.4425 2.44429C10.0752 3.64002 9.32073 6.25569 8.89915 8.83258C9.99331 9.00921 11.0621 9.12209 12 9.12209C12.9379 9.12209 14.0067 9.00921 15.1009 8.83258C14.6793 6.25569 13.9248 3.64002 13.5575 2.44429C13.0509 2.3624 12.5307 2.31977 12 2.31977C11.4693 2.31977 10.9491 2.3624 10.4425 2.44429ZM15.3337 2.90893C15.737 4.305 16.2958 6.42828 16.6448 8.54737C18.1513 8.23703 19.5727 7.85824 20.605 7.56109C19.4986 5.42102 17.6172 3.74662 15.3337 2.90893ZM21.2129 9.01933C20.1222 9.33683 18.5423 9.76328 16.8594 10.1057C16.9295 10.7564 16.9709 11.3958 16.9709 12C16.9709 12.8816 16.8827 13.8411 16.7445 14.8058C18.759 14.3858 20.6068 13.849 21.5557 13.5575C21.6376 13.0509 21.6802 12.5307 21.6802 12C21.6802 10.959 21.5162 9.95751 21.2129 9.01933ZM21.0911 15.3337C19.9166 15.6729 18.229 16.1219 16.4634 16.4634C16.1219 18.229 15.6729 19.9166 15.3337 21.0911C17.9978 20.1138 20.1138 17.9978 21.0911 15.3337ZM13.5576 21.5557C13.849 20.6068 14.3858 18.759 14.8058 16.7445C13.8411 16.8827 12.8816 16.9709 12 16.9709C11.1184 16.9709 10.1589 16.8827 9.19423 16.7445C9.61421 18.759 10.151 20.6068 10.4425 21.5557C10.9491 21.6376 11.4693 21.6802 12 21.6802C12.5307 21.6802 13.0509 21.6376 13.5576 21.5557ZM8.66629 21.0911C8.32707 19.9166 7.8781 18.229 7.53658 16.4634C5.77099 16.1219 4.08335 15.6729 2.90891 15.3337C3.88622 17.9978 6.00216 20.1138 8.66629 21.0911ZM2.44429 13.5575C3.39316 13.849 5.24101 14.3858 7.25548 14.8058C7.1173 13.8411 7.02907 12.8816 7.02907 12C7.02907 11.3958 7.07048 10.7564 7.14056 10.1057C5.45769 9.76328 3.87779 9.33683 2.78712 9.01933C2.48383 9.95751 2.31977 10.959 2.31977 12C2.31977 12.5307 2.3624 13.0509 2.44429 13.5575ZM3.39504 7.56109C4.42731 7.85824 5.84865 8.23703 7.35522 8.54737C7.70416 6.42827 8.26303 4.305 8.66626 2.90893C6.38282 3.74662 4.50139 5.42102 3.39504 7.56109ZM8.68924 10.3888C8.63137 10.9544 8.59884 11.4968 8.59884 12C8.59884 12.9399 8.71224 14.012 8.88985 15.1102C9.98798 15.2878 11.0601 15.4012 12 15.4012C12.9399 15.4012 14.012 15.2878 15.1102 15.1102C15.2878 14.012 15.4012 12.9399 15.4012 12C15.4012 11.4968 15.3686 10.9544 15.3108 10.3888C14.1776 10.5703 13.0348 10.6919 12 10.6919C10.9652 10.6919 9.82236 10.5703 8.68924 10.3888ZM9.67273 0.991173C10.4243 0.833026 11.2029 0.75 12 0.75C12.7971 0.75 13.5757 0.833026 14.3273 0.991174C18.0108 1.76627 21.0281 4.34097 22.42 7.75174C22.9554 9.06356 23.25 10.4983 23.25 12C23.25 12.7971 23.167 13.5757 23.0088 14.3273C22.0943 18.6736 18.6736 22.0943 14.3273 23.0088C13.5757 23.167 12.7971 23.25 12 23.25C11.2029 23.25 10.4243 23.167 9.67273 23.0088C5.32644 22.0943 1.90572 18.6736 0.991173 14.3273C0.833026 13.5757 0.75 12.7971 0.75 12C0.75 10.4972 1.04509 9.06132 1.58123 7.74866C2.97369 4.33943 5.99026 1.76604 9.67273 0.991173Z" fill="currentColor"></path> </g> </g> <defs> <clipPath id="clip0_1_1828"> <rect width="24" height="24" fill="white"></rect> </clipPath> </defs> </g></svg>'}, link: 'http://ksm.fsv.cvut.cz/~bp/'}
    ]
  }
]
</script>

# Einführung

Willkommen bei <Edubeam />, Ihrer Online-Webanwendung für Strukturanalysen. Die Baustatik wird zugänglich, ohne dass eine Installation oder komplexe Einrichtung notwendig ist.

<hr>

Klicken Sie [hier](https://run.edubeam.app/?lang=de), um auf <Edubeam /> zugreifen zu können und Ihre Reise in die Strukturanalyse zu beginnen.

<figure>
  <a href="https://run.edubeam.app/?lang=de" target="_blank">
    <WelcomeStructure />
    </a>
  <figcaption>edubeam in Aktion</figcaption>
</figure>

## Funktionen

- **2D-Träger-/Fachwerklösung**: Sie können 2D-Strukturen einfach lösen und analysieren.

- **Benutzerfreundliche Schnittstelle**: Intuitive Bedienung für eine schnelle und effiziente Nutzung.

- **Kostenlos und online**: Zugriff jederzeit und überall für maximalen Komfort.

- **Schüler- und lehrerorientiert**: Funkce na míru pro co nejlepší zážitek z výuky.

- **Open Source**: Beteiligen Sie sich an der Entwicklung von EduBeam und arbeiten Sie mit uns zusammen.

- **Einfache Projektfreigabe**: Teilen Sie Ihre Projekte mühelos mit einer URL.

## Lokalisierung

<Edubeam /> ist in mehreren Sprachen verfügbar.

<div>

<table>
    <tr>
        <td><img src="language-icons/icons/en.svg" style="height: 24px;" alt="English" /></td>
        <td><a href="https://run.edubeam.app/?lang=en" target="_blank">English</a></td>
    </tr>
    <tr>
        <td><img src="language-icons/icons/de.svg" style="height: 24px;" alt="Deutsch" /></td>
        <td><a href="https://run.edubeam.app/?lang=de" target="_blank">Deutsch</a></td>
    </tr>
    <tr>
        <td><img src="language-icons/icons/es.svg" style="height: 24px;" alt="Español" /></td>
        <td><a href="https://run.edubeam.app/?lang=es" target="_blank">Español</a></td>
    </tr>
    <tr>
        <td><img src="language-icons/icons/fr.svg" style="height: 24px;" alt="Français" /></td>
        <td><a href="https://run.edubeam.app/?lang=fr" target="_blank">Français</a></td>
    </tr>
    <tr>
        <td><img src="language-icons/icons/cs.svg" style="height: 24px;" alt="Čeština" /></td>
        <td><a href="https://run.edubeam.app/?lang=cs" target="_blank">Čeština</a></td>
    </tr>
    <tr>
        <td><img src="language-icons/icons/zh.svg" style="height: 24px;" alt="中文" /></td>
        <td><a href="https://run.edubeam.app/?lang=cn" target="_blank">中文</a></td>
    </tr>
</table>

</div>

## Die Autoren

<Edubeam /> ist ein gemeinschaftliches Projekt, das von einer engagierten Gemeinschaft von Mitwirkenden getragen wird, die sich leidenschaftlich für die Förderung der Ausbildung im Bereich Strukturanalyse einsetzen. Es wird von einem kleinen Team der Abteilung für Mechanik an der [CTU Prag - Fakultät für Bauingenieurwesen](https://www.fsv.cvut.cz/en) entwickelt und gepflegt.

<VPTeamMembers size="small" :members="members" />

Die ursprüngliche [Desktop-Anwendung](https://www.oofem.org/wiki/doku.php?id=edubeam:edubeam_en) wurde von [Bořek Patzák](http://ksm.fsv.cvut.cz/~bp/), [Jan Stránský](https://mech.fsv.cvut.cz/~stransky/en/) und [Vít Šmilauer](https://mech.fsv.cvut.cz/~smilauer/) entwickelt.

## Beteiligen Sie sich

Fühlen Sie sich frei, unserer Gemeinschaft beizutreten und zum Wachstum von <Edubeam /> beizutragen. Ihre Beteiligung kann vom Testen und Melden von Problemen bis zur aktiven Teilnahme am Entwicklungsprozess reichen.

Hier sind einige Möglichkeiten, wie Sie sich beteiligen und zu <Edubeam /> beitragen können:

1. **Code beisteuern:**

   - Erkunden Sie unser [GitHub-Repository](https://github.com/janvorisek/edubeam) und tragen Sie zur Codeentwicklung bei.
   - Wählen Sie aus einer Vielzahl von Aufgaben, von der grundlegenden Strukturanalyse bis zur fortgeschrittenen Implementierung von Funktionen.

2. **Testen und Fehlerberichterstattung:**

   - Testen Sie <Edubeam /> und melden Sie etwaige Fehler oder Probleme auf unserem [issue tracker](https://github.com/janvorisek/edubeam/issues).
   - Ihr Feedback ist entscheidend für die Verbesserung der Zuverlässigkeit und Funktionalität von <Edubeam />.

3. **Dokumentation:**

   - Helfen Sie, unsere Dokumentation zu verbessern, um <Edubeam /> benutzerfreundlicher zu machen.
   - Tragen Sie Tutorials, Leitfäden oder FAQs bei, um die Lernerfahrung für die Benutzer zu verbessern.

4. **Verbreiten Sie das Wort:**
   - Teilen Sie <Edubeam /> mit Ihren Kollegen und in den sozialen Medien.
   - Ihre Unterstützung hilft, unsere Gemeinschaft zu vergrößern und stellt sicher, dass mehr Schüler von <Edubeam /> profitieren.

Bist du bereit, anzufangen? Wählen Sie einen Beitragspfad, der Ihren Fähigkeiten und Interessen entspricht, und werden Sie ein wertvoller Teil der <Edubeam />-Gemeinschaft!
