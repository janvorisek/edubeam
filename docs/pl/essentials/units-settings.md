# Jednostki i ustawienia

Ustawienia otworzysz przez **przycisk ⚙ w widoku → Więcej ustawień**, klikając **plakietkę jednostek** w prawym dolnym rogu widoku albo z zakładki **Ustawienia** nad widokiem. Ustawienia są przechowywane w przeglądarce i przetrwają przeładowanie strony; **Przywróć ustawienia** przywraca domyślne ustawienia widoku (język i jednostki pozostają).

## Język i ustawienia regionalne

**Język** — 11 języków interfejsu. Aplikację można też otworzyć z parametrem `?lang=<kod>` (`en`, `cs`, `de`, `fr`, `es`, `pt`, `pl`, `cn`, `th`, `uk`, `ru`).

**Jednostki** — każda wielkość ma własną jednostkę. Pola wprowadzania, tabele, podpowiedzi i etykiety wykresów używają wybranej jednostki, a zmiana jednostki przelicza wyświetlane wartości (sam model jest wewnętrznie przechowywany w SI, więc przełączanie w tę i z powrotem niczego nie traci).

| Wielkość | Do wyboru | Domyślnie |
| --- | --- | --- |
| Długość | m, cm, mm, in, ft | m |
| Pole | m², cm², mm², in², ft² | m² |
| Geometryczny moment bezwładności | m⁴, cm⁴, mm⁴, in⁴, ft⁴ | m⁴ |
| Masa | kg, lb | kg |
| Siła | N, kN, MN, lbf, tonf, kgf | kN |
| Moment zginający | Nmm, Nm, kNm, MNm, tonf·m, lbf·in, lbf·ft | kNm |
| Naprężenie (E, G) | Pa, kPa, MPa, GPa, psi, ksc | MPa |

Obciążenia liniowe używają *siła / długość* w wybranych jednostkach (domyślnie kN/m). Kąty są zawsze w radianach, temperatury zawsze w °C/K.

::: tip Praca w jednostkach imperialnych
Wybierz ft (lub in), in², in⁴, lbf lub odpowiedniki kip oraz psi/ksi według potrzeb — nie ma jednego przełącznika „imperialne”, każdą wielkość ustawia się niezależnie.
:::

## Ustawienia widoku

**Podgląd widoku** u góry pokazuje mały model, który reaguje na każdą zmianę poniżej.

**Siatka**
- **Pokaż siatkę** (<kbd>G</kbd>) — rysuje siatkę i linijki.
- **Przyciągaj do siatki** (<kbd>S</kbd>) — węzły stawiane i przeciągane myszą przyciągają się do kroku siatki.
- **Krok przyciągania do siatki** — rozstaw w metrach (domyślnie 0,1).

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
