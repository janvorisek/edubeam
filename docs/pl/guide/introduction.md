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

<Edubeam /> to darmowe, działające w przeglądarce narzędzie do **analizy statycznej płaskich konstrukcji (2D)**: belek, ram i kratownic. Rysujesz konstrukcję, dodajesz podpory i obciążenia, a solver metody elementów skończonych przelicza wszystko w chwili, gdy cokolwiek zmienisz. Nie ma przycisku *Oblicz*, instalacji ani zakładania konta.

[Uruchom EduBeam](https://run.edubeam.app/?lang=pl){target="_blank"} w nowej karcie i przejdź krok po kroku przez [Szybki start](/pl/guide/quick-start).

![Rama trójprzegubowa w EduBeam: obciążenia na pomarańczowo, reakcje na fioletowo, moment zginający na czerwono, a kształt odkształcony na szaro](/screenshots/pl/hero.webp)

## Pierwsza wizyta {#your-first-visit}

Przy pierwszym uruchomieniu aplikacji okno powitalne pyta, jak chcesz zacząć oraz jakich jednostek i osi chcesz używać. Oba wybory możesz później zmienić w [Ustawieniach](/pl/essentials/units-settings).

![Okno powitalne](/screenshots/pl/welcome.webp){.shot-lg}

- **Oprowadź mnie** pokazuje po kolei menu, cofanie i ponawianie, przyciski widoku, opcje wyświetlania, siatkę i jednostki oraz dolny panel.
- **Narysuj pierwszą belkę** to prowadzone zadanie w siedmiu krokach. Rysujesz belkę myszą, podpierasz ją, obciążasz i odczytujesz wyniki. Mała karta w rogu podpowiada, co zrobić dalej.
- **Otwórz przykład** otwiera galerię gotowych modeli.

Wszystkie trzy znajdziesz też w **menu ☰**, więc możesz do nich wrócić w dowolnej chwili.

![Narysuj pierwszą belkę: karta przewodnika pozostaje w rogu, gdy pracujesz](/screenshots/pl/first-beam-task.webp)

## Co potrafi {#what-it-does}

| Obszar | Możliwości |
| --- | --- |
| **Konstrukcje** | Płaskie (x–z) belki, belki ciągłe, ramy i kratownice zbudowane z węzłów i dwuwymiarowych elementów belkowych Timoshenki. Przeguby końcowe zamieniają dowolny pręt w pręt kratownicy. |
| **Podpory** | Podpory przegubowe nieprzesuwne i przesuwne, utwierdzenia, utwierdzenia przesuwne i każda inna kombinacja zablokowanych `Dx`, `Dz`, `Ry`, wybierana symbolem. Podpory ukośne przez kąt węzła. Osiadania podpór. |
| **Obciążenia** | Siły i momenty węzłowe, zadane przemieszczenia, obciążenia liniowe równomierne i trapezowe, siły i momenty skupione wzdłuż pręta oraz temperatura równomierna lub z gradientem. |
| **Przekroje** | Biblioteki materiałów i przekrojów (europejskie i amerykańskie) oraz edytor wielokątów, który dla dowolnego kształtu oblicza $A$, $I_y$, $I_z$, $I_{yz}$, osie główne i promienie bezwładności. |
| **Wyniki** | Kształt odkształcony, siła normalna **N**, siła tnąca **V**, moment zginający **M**, reakcje, przemieszczenia węzłów, siły końcowe elementów i macierze sztywności elementów. |
| **Analiza** | Liniowa analiza statyczna z jednym przypadkiem obciążenia. Wyniki są dokładne dla modelu liniowego, więc zagęszczanie siatki nie jest potrzebne. Gdy konstrukcji nie da się rozwiązać, EduBeam mówi dlaczego i animuje, jak może się poruszać. |
| **Pliki** | Zapis i otwieranie projektów jako JSON, udostępnianie całego modelu jako linku, eksport rysunku jako PNG lub SVG i wyników jako CSV. Ostatnio zastąpione modele są przechowywane, więc możesz je odzyskać. Wszystko pozostaje na Twoim urządzeniu. |
| **Jednostki** | SI lub amerykańskie jednym kliknięciem albo każda wielkość osobno. Osie x w prawo, z w dół albo x w prawo, y w górę. |

## Czego (jeszcze) nie potrafi {#what-it-does-not-do-yet}

Znajomość ograniczeń z góry oszczędza czas:

- **Tylko 2D.** Brak zachowania poza płaszczyzną, brak ram przestrzennych.
- **Tylko liniowa statyka.** Brak efektów drugiego rzędu (P–Δ), wyboczenia, dynamiki i plastyczności.
- **Jeden przypadek obciążenia.** Nie ma kombinacji ani obwiedni. Każdy przypadek modeluj osobno i zapisz jako osobny plik lub link.
- **Brak ciężaru własnego.** W razie potrzeby przyłóż go jako obciążenie liniowe.
- **Brak sprawdzeń normowych.** EduBeam podaje siły przekrojowe i przemieszczenia; wymiarowanie należy do Ciebie.

Jeśli brakuje Ci jakiejś funkcji, [zgłoś to na GitHubie](https://github.com/janvorisek/edubeam/issues).

<ElementariumPromo placement="introduction" />

## Dla kogo jest ta aplikacja? {#who-is-it-for}

- **Studenci** uczący się mechaniki budowli, którzy chcą od razu sprawdzić obliczenia ręczne. Zobacz [Sprawdzanie wyników ręcznie](/pl/guide/verification).
- **Wykładowcy** pokazujący na żywo, na projektorze, jak podpory, przeguby i obciążenia zmieniają siły przekrojowe, w dowolnym z 12 języków. Zobacz [Nauczanie z EduBeam](/pl/guide/teaching).
- **Inżynierowie**, którzy chcą szybko sprawdzić rząd wielkości, zanim otworzą cięższy program biurkowy.

## Jak zorganizowana jest dokumentacja {#how-this-guide-is-organised}

1. **Pierwsze kroki.** Ta strona, [10-minutowy szybki start](/pl/guide/quick-start) i gotowe [Przykłady](/pl/examples/).
2. **Samouczki.** Kompletne modele od początku do końca, sprawdzone ręcznie: [rama trójprzegubowa](/pl/tutorials/three-hinged-frame) i [kratownica płaska](/pl/tutorials/truss).
3. **Modelowanie.** Po jednej stronie na każdy element składowy: [interfejs użytkownika](/pl/essentials/user-interface), [węzły i podpory](/pl/essentials/nodes-supports), [elementy, materiały i przekroje](/pl/essentials/elements), [obciążenia](/pl/essentials/loads) oraz [jednostki i ustawienia](/pl/essentials/units-settings).
4. **Wyniki.** Jak [czytać wykresy i tabele](/pl/essentials/results) i jak je [zweryfikować](/pl/guide/verification).
5. **Pliki i udostępnianie.** [Projekty, linki do udostępniania, eksport obrazu i CSV](/pl/essentials/import-export) oraz [nauczanie z EduBeam](/pl/guide/teaching).
6. **Informacje dodatkowe.** [Klawiatura, mysz i dotyk](/pl/reference/shortcuts), [rozwiązywanie problemów](/pl/reference/troubleshooting) i [FAQ](/pl/faq/).
7. **Podręcznik teoretyczny.** [Konwencje znaków](/pl/elements/conventions) i sformułowania elementów: [belki](/pl/elements/beam) i [kratownicy](/pl/elements/truss).

Ikony **?** w aplikacji otwierają odpowiednią stronę tej dokumentacji w Twoim języku.

## Języki {#languages}

Interfejs jest dostępny w językach: English, Čeština, Deutsch, Español, Français, Polski, Português, Русский, Türkçe, Українська, ไทย i 汉语. EduBeam dobiera język na podstawie ustawień przeglądarki. Możesz go zmienić w **Ustawienia → Język i ustawienia regionalne** lub otworzyć aplikację z parametrem `?lang=`, np. [run.edubeam.app/?lang=pl](https://run.edubeam.app/?lang=pl){target="_blank"}.

## Autorzy i podziękowania {#authors-credits}

<Edubeam /> rozwija [Jan Voříšek](https://github.com/janvorisek), opiekun i projektant nowoczesnej wersji webowej. Wersja przeglądarkowa powstaje niezależnie od ČVUT. Pierwotny, desktopowy EduBeam dla Windows i Linuksa stworzyli [Bořek Patzák](http://ksm.fsv.cvut.cz/~bp/), [Jan Stránský](https://mech.fsv.cvut.cz/~stransky/en/) i [Vít Šmilauer](https://mech.fsv.cvut.cz/~smilauer/) w Katedrze Mechaniki [Politechniki Czeskiej w Pradze (ČVUT) – Wydział Inżynierii Lądowej](https://www.fsv.cvut.cz/en). Solverem jest otwartoźródłowa biblioteka [ts-fem](https://github.com/janvorisek/ts-fem).

<VPTeamMembers size="small" :members="members" />

## Współtwórz {#contribute}

- Zgłaszaj niejasne zachowania i błędy jako [zgłoszenie na GitHubie](https://github.com/janvorisek/edubeam/issues).
- Popraw tę dokumentację lub tłumaczenia, edytując pliki w katalogu `docs/` i otwierając pull request.
- Poleć EduBeam kolegom ze studiów i współpracownikom.
