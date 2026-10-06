# Jednostki i ustawienia

Ustawienia otworzysz przez **przycisk ⚙ w widoku → Więcej ustawień**, klikając **plakietkę jednostek** w prawym dolnym rogu widoku albo z zakładki **Ustawienia** nad widokiem. Ustawienia są przechowywane w przeglądarce i przetrwają przeładowanie strony; **Przywróć ustawienia** przywraca domyślne ustawienia widoku i jednostki Twojego regionu (język pozostaje).

## Język i ustawienia regionalne

**Język** — 11 języków interfejsu. Aplikację można też otworzyć z parametrem `?lang=<kod>` (`en`, `cs`, `de`, `fr`, `es`, `pt`, `pl`, `cn`, `th`, `uk`, `ru`).

**Układ jednostek** — *SI (metryczny)* lub *Amerykański (imperialny)* ustawia jednym krokiem wszystkie poniższe jednostki. Jeśli potem zmienisz którąkolwiek pojedynczą jednostkę, układ jest wyświetlany jako *Własny*. Przy pierwszej wizycie EduBeam startuje w jednostkach amerykańskich, jeśli przeglądarka ma ustawienia regionalne USA *i* komputer jest w strefie czasowej USA, a wszędzie indziej w SI.

**Jednostki** — każda wielkość ma własną jednostkę. Pola wprowadzania, tabele, podpowiedzi i etykiety wykresów używają wybranej jednostki, a zmiana jednostki przelicza wyświetlane wartości (sam model jest wewnętrznie przechowywany w SI, więc przełączanie w tę i z powrotem niczego nie traci, a udostępniony link otwiera ten sam model w dowolnych jednostkach).

| Wielkość | Do wyboru | SI | Amerykański |
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

Obciążenia liniowe używają *siła / długość* w wybranych jednostkach (kN/m w SI, kip/ft w jednostkach amerykańskich), gęstość — *masa / długość³*. Współczynnik rozszerzalności cieplnej podąża za jednostką temperatury (1/K lub 1/°F). Obciążenia temperaturą to *zmiany* temperatury, więc 10 °C to 18 °F. Obroty są zawsze w radianach.

Tonf to metryczna tona-siła (1000 kgf), a nie amerykańska krótka tona (short ton). Jednostki amerykańskie są przeliczane według ich dokładnych definicji (1 ft = 0,3048 m, 1 kip = 4448,2216 N).

**Układ współrzędnych** – *x w prawo, z w dół* (domyślnie) lub *x w prawo, y w górę*. Opcja y w górę odwraca znak wartości pionowych i kątów podpór oraz zmienia nazwy osi we wszystkich polach, tabelach, podpowiedziach i eksporcie; model i zapisane pliki się nie zmieniają. Zobacz [Oś y w górę](/pl/elements/conventions#y-up-axes).

## Ustawienia widoku

**Podgląd widoku** u góry pokazuje mały model, który reaguje na każdą zmianę poniżej.

**Siatka**
- **Pokaż siatkę** (<kbd>G</kbd>) — rysuje siatkę i linijki.
- **Przyciągaj do siatki** (<kbd>S</kbd>) — węzły stawiane i przeciągane myszą przyciągają się do kroku siatki.
- **Krok przyciągania do siatki** — rozstaw w jednostce długości (domyślnie 0,1 m lub 0,5 ft w jednostkach amerykańskich). Przy przełączaniu między jednostkami metrycznymi a amerykańskimi krok pozostawiony na wartości domyślnej przechodzi na wartość domyślną drugiego układu; krok ustawiony samodzielnie zostaje zachowany. Linijki również liczą w jednostce długości; w stopach linijki i celownik pokazują stopy i cale (5′-6″), a pola wprowadzania i tabele zachowują stopy dziesiętne (5,5).

**Etykiety wyników**
- **Orientacja etykiet wyników** — *Prostopadle do wykresu* (etykiety podążają za wykresem) lub *Zawsze poziomo*.

**Rozmiary**
- **Skala wyników** (0–120 px) — wysokość na ekranie największej rzędnej wykresu / ugięcia. Wykresy są normalizowane do własnego maksimum, więc to ustawienie jest czysto wizualne; zmień je, gdy wykresy są za duże lub za małe względem modelu.
- **Rozmiar podpór** (0,5–1,5) i **Rozmiar czcionki** (10–20 px).

**Kolory** — osobne kolory dla węzłów, elementów, obciążeń, kształtu odkształconego, siły normalnej, siły tnącej, momentu zginającego i reakcji. Domyślnie: N niebieski, V zielony, M czerwony, reakcje fioletowe, obciążenia pomarańczowe.

## Sterowanie i skróty

**Przesuwanie widoku przez** — który przycisk myszy przesuwa płótno: *środkowy lub prawy* (domyślnie), *Kółko myszy* (tylko środkowy przycisk) lub tylko *Prawy przycisk*. Pełna lista skrótów znajduje się na stronie [Klawiatura i mysz](/pl/reference/shortcuts).

## Co jest zapisywane automatycznie

Oprócz ustawień EduBeam zapisuje **bieżący model** w pamięci lokalnej przeglądarki po każdej zmianie. Przeładowanie karty lub ponowne otwarcie aplikacji przywraca go. Dotyczy to jednej przeglądarki na jednym urządzeniu — użyj [Zapisz projekt lub Udostępnij model](/pl/essentials/import-export), aby przenieść model gdziekolwiek indziej.
