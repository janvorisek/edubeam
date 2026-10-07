---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "EduBeam"
  text: "Darmowa analiza konstrukcji online"
  tagline: Narysuj belkę, ramę lub kratownicę, dodaj obciążenia i obserwuj, jak wykresy zmieniają się podczas edycji. Pełne wyniki MES w przeglądarce, bez instalacji, bez konta i bez opłat.
  image:
    src: /screenshots/pl/hero.webp
    alt: Aplikacja EduBeam z rozwiązaną ramą
  actions:
    - theme: brand
      text: Uruchom aplikację
      link: https://run.edubeam.app/?lang=pl
    - theme: alt
      text: Przeczytaj przewodnik
      link: /pl/guide/introduction
    - theme: alt
      text: Zobacz przykłady
      link: /pl/examples/

features:
  - icon: ⚡
    title: Wyniki już podczas rysowania
    details: Nie ma przycisku „Oblicz”. Przeciągnij węzeł, zaznacz przegub lub zmień obciążenie, a N, V, M, reakcje i kształt odkształcony od razu za tym podążą.
    link: /pl/essentials/results
    linkText: Odczytywanie wyników
  - icon: 🧑‍🏫
    title: Stworzony do nauczania
    details: Prowadzone pierwsze kroki, wartości po najechaniu kursorem, solver, który wyjaśnia, dlaczego konstrukcja jest mechanizmem, i linki do udostępniania, które można umieścić w materiałach do wykładu.
    link: /pl/guide/teaching
    linkText: Nauczanie z EduBeam
  - icon: 🌍
    title: Twój język, Twoje jednostki
    details: 12 języków interfejsu, jednostki SI lub amerykańskie oraz wybór osi z w dół lub podręcznikowej osi y w górę.
    link: /pl/essentials/units-settings
    linkText: Jednostki i ustawienia
  - icon: 🔗
    title: Udostępniaj, eksportuj, osadzaj
    details: Wyślij cały model jako link, zapisz go jako plik, wyeksportuj rysunek jako PNG lub SVG, a tabele wyników jako CSV.
    link: /pl/essentials/import-export
    linkText: Pliki i udostępnianie
---

## Zacznij tutaj {#start-here}

<div class="start-grid">

**Pierwszy raz w EduBeam?** Przejdź przez [10-minutowy szybki start](/pl/guide/quick-start). Krok po kroku zamodelujesz belkę swobodnie podpartą i sprawdzisz ręcznie każdy wynik.

**Wiesz, co chcesz zbudować?** Przejdź do [samouczka](/pl/tutorials/three-hinged-frame) albo otwórz gotowy [przykład](/pl/examples/) i zmień go.

**Prowadzisz zajęcia?** Zobacz [Nauczanie z EduBeam](/pl/guide/teaching): linki do udostępniania w zadaniach, osadzany podgląd do prezentacji i ćwiczenia.

</div>

<div class="shots">

![Kratownica: siły osiowe, rozciąganie dodatnie](/screenshots/pl/tut-truss.webp)

![Mechanizm pokazany wprost: EduBeam wyjaśnia, dlaczego nie da się go rozwiązać](/screenshots/pl/ui-mechanism.webp)

</div>

## Co można zamodelować {#what-you-can-model}

- **Belki, ramy i kratownice** w płaszczyźnie: belki ciągłe, ramy portalowe, łuki trójprzegubowe, kratownice o węzłach przegubowych.
- **Dowolne podpory**: przegubowe nieprzesuwne i przesuwne, utwierdzenia, utwierdzenia przesuwne, podpory ukośne i osiadania podpór.
- **Obciążenia**: siły i momenty skupione, obciążenia liniowe równomierne i trapezowe, siły skupione w dowolnym miejscu pręta oraz temperatura.
- **Dowolne przekroje**: z biblioteki (IPE, HEA, AISC W, HSS, prostokąty, rury) lub narysowane jako wielokąt, z automatycznie obliczonymi charakterystykami.

Więcej znajdziesz we [Wprowadzeniu](/pl/guide/introduction).

<ElementariumPromo />
