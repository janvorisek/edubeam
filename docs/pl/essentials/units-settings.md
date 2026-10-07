# Jednostki i ustawienia

Do ustawień można dostać się na trzy sposoby:

- zakładką **Ustawienia** nad widokiem, która pokazuje je na całym ekranie;
- **plakietką jednostek** w prawym dolnym rogu widoku, która otwiera je w sekcji *Język i ustawienia regionalne*;
- przyciskiem **Więcej ustawień** pod opcjami wyświetlania, który otwiera je w sekcji *Ustawienia widoku*.

Ustawienia są przechowywane w przeglądarce i przetrwają przeładowanie strony. **Przywróć ustawienia** przywraca domyślne ustawienia widoku, format liczb, osie, przycisk przesuwania widoku i jednostki Twojego regionu; język pozostaje bez zmian.

## Język i ustawienia regionalne {#language-locale}

![Ustawienia → Język i ustawienia regionalne](/screenshots/pl/settings-language.webp)

**Język.** 12 języków interfejsu. Aplikację można też otworzyć z parametrem `?lang=<kod>`: `en`, `cs`, `de`, `fr`, `es`, `pt`, `pl`, `cn`, `th`, `uk`, `ru`, `tr`.

**Format liczb.** Sposób zapisu wyników: *Automatyczny*, *Naukowy* (domyślny) lub *Inżynierski*. Zobacz [Format liczb](/pl/essentials/results#number-format).

**Układ współrzędnych.** *x w prawo, z w dół* (domyślnie) lub *x w prawo, y w górę*. Opcja z osią y w górę odwraca znak wartości pionowych i kątów podpór oraz zmienia nazwy osi we wszystkich polach, tabelach, podpowiedziach i eksportach. Model i zapisane pliki się nie zmieniają. Zobacz [Oś y w górę](/pl/elements/conventions#y-up-axes).

![Rama trójprzegubowa z osią y w górę: wskaźnik osi w rogu pokazuje oś y skierowaną w górę](/screenshots/pl/settings-y-up.webp){.shot-lg}

**Układ jednostek.** *SI (metryczny)* lub *Amerykański (imperialny)* ustawia jednym krokiem wszystkie jednostki poniżej. Jeśli potem zmienisz którąkolwiek pojedynczą jednostkę, układ zostanie wyświetlony jako *Własny*. Przy pierwszej wizycie wybierasz go w oknie powitalnym; wcześniej EduBeam wybiera jednostki amerykańskie tylko wtedy, gdy przeglądarka ma ustawienia regionalne USA *i* komputer jest w strefie czasowej USA.

**Jednostki.** Każda wielkość ma własną jednostkę. Pola wprowadzania, tabele, podpowiedzi i etykiety wykresów używają wybranej jednostki, a zmiana jednostki przelicza to, co jest wyświetlane. Sam model jest przechowywany w SI, więc przełączanie tam i z powrotem niczego nie zmienia, a udostępniony link otwiera ten sam model w dowolnych jednostkach.

| Wielkość | Do wyboru | SI | Amerykańskie |
| --- | --- | --- | --- |
| Długość (geometria) | m, cm, mm, ft, in | m | ft |
| Wymiary przekroju | m, cm, mm, ft, in | m | in |
| Przemieszczenie | m, cm, mm, ft, in | m | in |
| Pole | m², cm², mm², ft², in² | m² | in² |
| Geometryczny moment bezwładności | m⁴, cm⁴, mm⁴, ft⁴, in⁴ | m⁴ | in⁴ |
| Masa | kg, lb | kg | lb |
| Siła | N, kN, MN, kgf, Tonf, lbf, kip | kN | kip |
| Moment zginający | Nmm, Nm, kNm, MNm, Tonf·m, lbf·in, lbf·ft, kip·in, kip·ft | kNm | kip·ft |
| Naprężenie (E, G) | Pa, kPa, MPa, GPa, ksc, psi, ksi, psf, ksf | MPa | ksi |
| Temperatura | °C, °F | °C | °F |

Obciążenia liniowe używają jednostki *siła / długość* z wybranych jednostek (kN/m w SI, kip/ft w jednostkach amerykańskich), a gęstość jednostki *masa / długość³*. Współczynnik rozszerzalności cieplnej zależy od jednostki temperatury (1/K lub 1/°F). Obciążenia termiczne to *zmiany* temperatury, więc 10 °C to 18 °F. Obroty są zawsze w radianach.

Tonf to metryczna tona-siła (1000 kgf), a nie amerykańska tona krótka. Jednostki amerykańskie są przeliczane według ich dokładnych definicji (1 ft = 0,3048 m, 1 kip = 4448,2216 N). W stopach wpisuj wartości dziesiętne, np. `5,5`; linijki i celownik pokazują stopy i cale (5′-6″).

## Ustawienia widoku {#viewer-settings}

![Ustawienia → Ustawienia widoku, z podglądem na żywo po prawej](/screenshots/pl/settings-viewer.webp)

**Podgląd widoku** obok ustawień pokazuje mały model, który reaguje na każdą zmianę. Plakietki pod nim wybierają, jaki wynik pokazuje, a kliknięcie koloru przełącza podgląd na odpowiadający mu wynik.

**Siatka**
- **Pokaż siatkę** (<kbd>G</kbd>) rysuje siatkę i linijki.
- **Przyciągaj do siatki** (<kbd>S</kbd>) sprawia, że wstawiane i przeciągane węzły przyciągają się do kroku siatki.
- **Pokaż celownik** zaznacza położenie kursora na linijkach, dzięki czemu możesz odczytać jego współrzędne (tylko przy użyciu myszy).
- **Krok przyciągania do siatki** to odstęp w jednostce długości: domyślnie 0,1 m lub 0,5 ft w jednostkach amerykańskich. Przy przełączaniu między jednostkami metrycznymi i amerykańskimi krok pozostawiony na wartości domyślnej zmienia się na domyślną wartość drugiego układu; krok ustawiony przez Ciebie zostaje zachowany.

**Rozmiary**
- **Skala wyników** (8–120 px, domyślnie 48) to wysokość na ekranie największej rzędnej wykresu lub ugięcia. Wykresy są skalowane do własnego maksimum, więc to ustawienie jest czysto wizualne; zmień je, gdy wykresy są za duże lub za małe.
- **Rozmiar podpór** (50–150 %) i **Rozmiar czcionki** (10–20 px). Większa czcionka pomaga przy projektorze.

**Orientacja etykiet wyników**: *Prostopadle do wykresu* (etykiety podążają za wykresem) lub *Zawsze poziomo*.

**Sprawdzanie modelu**
- **Pokazuj, jak może się poruszać niestabilna konstrukcja** rysuje przerywany zarys mechanizmu.
- **Animuj ruch** porusza nim tam i z powrotem.

**Kolory**: osobne kolory węzłów, elementów, obciążeń, kształtu odkształconego, siły normalnej, siły tnącej, momentu zginającego i reakcji. Domyślnie: N niebieski, V zielony, M czerwony, reakcje fioletowe, obciążenia pomarańczowe.

## Sterowanie i skróty {#controls-shortcuts}

**Przesuwanie widoku przez** określa, który przycisk myszy przesuwa płótno: *Kółko myszy lub prawy przycisk* (domyślnie), *Kółko myszy* lub *Prawy przycisk*. Pełną listę skrótów znajdziesz na stronie [Klawiatura, mysz i dotyk](/pl/reference/shortcuts).

## Co jest przechowywane w przeglądarce {#what-is-stored-in-your-browser}

Oprócz ustawień EduBeam przechowuje w pamięci lokalnej przeglądarki:

- **bieżący model**, zapisywany po każdej zmianie, więc przeładowanie karty lub ponowne otwarcie aplikacji go przywraca;
- **Ostatnie modele**: 10 ostatnich modeli, które wyczyściłeś lub zastąpiłeś.

Oba są przechowywane osobno dla każdej przeglądarki i każdego urządzenia, a wyczyszczenie danych witryny je usuwa. Aby zachować model lub przenieść go gdzie indziej, użyj [Zapisz projekt lub Udostępnij model](/pl/essentials/import-export).
