<script setup>
import { VPTeamMembers } from 'vitepress/theme'

const members = [
  {
    avatar: 'https://www.github.com/janvorisek.png',
    name: 'Jan Voříšek',
    title: 'Główny programista i projektant produktu',
    links: [
      { icon: 'github', link: 'https://github.com/janvorisek' },
      { icon: 'twitter', link: 'https://twitter.com/janvorisekdev' },
    ]
  },
  {
    avatar: 'https://www.github.com/bpatzak.png',
    name: 'Bořek Patzák',
    title: 'Solver MES, autor pierwotnej aplikacji',
    links: [
      { icon: 'github', link: 'https://github.com/bpatzak' },
    ]
  }
]
</script>

# Wprowadzenie

<Edubeam /> to darmowe, działające w przeglądarce narzędzie do **analizy statycznej płaskich konstrukcji prętowych**: belek, ram i kratownic. Rysujesz konstrukcję, dodajesz podpory i obciążenia, a solver oparty na metodzie elementów skończonych przelicza wszystko w chwili, gdy cokolwiek zmienisz — bez przycisku „Oblicz”, bez instalacji, bez zakładania konta.

[Uruchom EduBeam](https://run.edubeam.app/?lang=pl){target="_blank"} w nowej karcie i przejdź krok po kroku przez [Szybki start](/pl/guide/quick-start).

<figure>
  <a href="https://run.edubeam.app/?lang=pl" target="_blank">
    <WelcomeStructure />
  </a>
  <figcaption>Belka statycznie niewyznaczalna rozwiązana na żywo w przeglądarce</figcaption>
</figure>

## Co potrafi

| Obszar | Możliwości |
| --- | --- |
| **Konstrukcje** | Płaskie (x–z) belki, belki ciągłe, ramy i kratownice zbudowane z węzłów i dwuwymiarowych elementów belkowych Timoshenki. Przeguby końcowe zamieniają dowolny pręt w pręt kratownicy. |
| **Podpory** | Dowolna kombinacja zablokowanych stopni swobody `Dx`, `Dz`, `Ry` w węźle → utwierdzenie, podpora przegubowa nieprzesuwna, przesuwna, utwierdzenie przesuwne… Podpory ukośne przez kąt lokalnego układu współrzędnych węzła. |
| **Obciążenia** | Siły i momenty węzłowe, zadane przemieszczenia (osiadania podpór), obciążenia równomiernie rozłożone i trapezowe (w układzie globalnym lub lokalnym), obciążenia skupione wzdłuż pręta oraz obciążenia temperaturą — równomierne i nierównomierne. |
| **Wyniki** | Kształt odkształcony (linia ugięcia), siła normalna **N**, siła poprzeczna **V<sub>z</sub>**, moment zginający **M<sub>y</sub>**, reakcje podporowe, przemieszczenia węzłów, siły końcowe elementów oraz macierze sztywności poszczególnych elementów. |
| **Analiza** | Liniowa analiza statyczna dla jednego przypadku obciążenia. Wyniki są dokładne dla modelu liniowego (nie trzeba zagęszczać podziału). |
| **Pliki** | Zapis/otwieranie projektów jako JSON, udostępnianie całego modelu jako adresu URL, osadzanie widoku tylko do odczytu. Wszystko pozostaje na Twoim urządzeniu. |
| **Jednostki** | Niezależnie wybierane jednostki długości, pola, momentu bezwładności, masy, siły, momentu i naprężenia (metryczne i imperialne). |

## Czego (jeszcze) nie potrafi

Znajomość ograniczeń z góry oszczędza czas:

- **Tylko 2D** — brak zachowania poza płaszczyzną, brak ram przestrzennych.
- **Tylko liniowa statyka** — brak efektów drugiego rzędu (P–Δ), wyboczenia, dynamiki i plastyczności.
- **Jeden przypadek obciążenia** — nie ma kombinacji ani obwiedni. Każdy przypadek modeluj osobno (zapisz jako osobny plik lub link).
- **Brak ciężaru własnego** — w razie potrzeby przyłóż go jako obciążenie rozłożone.
- **Brak sprawdzeń normowych** — EduBeam podaje siły przekrojowe i przemieszczenia; wymiarowanie należy do Ciebie.

Jeśli brakuje Ci jakiejś funkcji, [zgłoś to na GitHubie](https://github.com/janvorisek/edubeam/issues).

## Dla kogo jest ta aplikacja?

- **Studenci** uczący się mechaniki budowli, którzy chcą natychmiast sprawdzić obliczenia ręczne. Zobacz [Sprawdzanie wyników ręcznie](/pl/guide/verification).
- **Wykładowcy** pokazujący, jak podpory, przeguby i obciążenia zmieniają siły przekrojowe — na żywo, na projektorze, w jednym z 11 języków.
- **Inżynierowie**, którzy chcą szybko sprawdzić rząd wielkości, zanim otworzą cięższy pakiet obliczeniowy.

## Jak zorganizowana jest dokumentacja

1. **Pierwsze kroki** — ta strona, [10-minutowy szybki start](/pl/guide/quick-start) i gotowe [Przykłady](/pl/examples/).
2. **Modelowanie** — po jednej stronie na każdy element składowy: [interfejs użytkownika](/pl/essentials/user-interface), [węzły i podpory](/pl/essentials/nodes-supports), [elementy, materiały i przekroje](/pl/essentials/elements), [obciążenia](/pl/essentials/loads), [jednostki i ustawienia](/pl/essentials/units-settings).
3. **Wyniki** — jak [czytać wykresy i tabele](/pl/essentials/results) oraz jak je [zweryfikować](/pl/guide/verification).
4. **Pliki i udostępnianie** — [projekty JSON, linki do udostępniania i osadzany widok](/pl/essentials/import-export).
5. **Odniesienie** — [klawiatura i mysz](/pl/reference/shortcuts), [rozwiązywanie problemów](/pl/reference/troubleshooting) oraz [FAQ](/pl/faq/).
6. **Podręcznik teoretyczny** — [konwencje znaków](/pl/elements/conventions) i sformułowania elementów: [belka](/pl/elements/beam) i [kratownica](/pl/elements/truss).

## Języki

Interfejs jest dostępny w językach: English, Čeština, Deutsch, Español, Français, Polski, Português, Русский, Українська, ไทย i 汉语. EduBeam dobiera język na podstawie ustawień przeglądarki; możesz go zmienić w **Ustawienia → Język i ustawienia regionalne** lub otworzyć aplikację z parametrem `?lang=`, np. [run.edubeam.app/?lang=pl](https://run.edubeam.app/?lang=pl){target="_blank"}.

## Autorzy i podziękowania

<Edubeam /> rozwija [Jan Voříšek](https://github.com/janvorisek), opiekun i projektant nowoczesnej wersji webowej. Wersja przeglądarkowa powstaje niezależnie od CTU; pierwotny, desktopowy EduBeam dla Windows/Linux stworzyli [Bořek Patzák](http://ksm.fsv.cvut.cz/~bp/), [Jan Stránský](https://mech.fsv.cvut.cz/~stransky/en/) i [Vít Šmilauer](https://mech.fsv.cvut.cz/~smilauer/) w Katedrze Mechaniki [Politechniki Czeskiej w Pradze – Wydział Inżynierii Lądowej](https://www.fsv.cvut.cz/en). Solverem jest otwartoźródłowa biblioteka [ts-fem](https://github.com/janvorisek/ts-fem).

<VPTeamMembers size="small" :members="members" />

## Współtwórz

- Zgłaszaj niejasne zachowania i błędy jako [zgłoszenie na GitHubie](https://github.com/janvorisek/edubeam/issues).
- Popraw tę dokumentację lub tłumaczenia, edytując pliki w katalogu `docs/` i otwierając pull request.
- Podziel się EduBeam z kolegami ze studiów i współpracownikami.
