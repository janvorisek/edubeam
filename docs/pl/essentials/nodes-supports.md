# Węzły i podpory

Węzły to punkty modelu. Elementy łączą węzły; podpory i obciążenia węzłowe są przypisane do węzłów.

## Współrzędne

Każdy węzeł ma współrzędne **X** i **Z** w bieżącej jednostce długości. Oś x jest skierowana w prawo, a **oś z w dół** ekranu — słup rosnący od ziemi biegnie więc od `Z = 0` do `Z = −3`, a nie `+3`. Wskaźnik osi w rogu siatki pokazuje bieżącą orientację. Zobacz [Układ współrzędnych i konwencje znaków](/pl/elements/conventions).

## Dodawanie węzłów

| Metoda | Jak |
| --- | --- |
| **Okno dialogowe** | Zakładka *Węzły* → **Dodaj węzeł** lub kliknięcie prawym przyciskiem na płótnie → *Dodaj węzeł*. Wpisz X i Z. |
| **Mysz** | Zakładka *Węzły* → **Dodaj myszą** (lub przytrzymaj <kbd>Ctrl</kbd>, wybierając *Dodaj węzeł* z menu płótna), a następnie klikaj na płótnie. Każde kliknięcie dodaje węzeł; naciśnij <kbd>Esc</kbd>, aby zakończyć. |
| **Podczas rysowania elementów** | W trybie *Dodaj element → Dodaj myszą* kliknięcie pustego płótna tworzy nowy węzeł i od razu go łączy. |
| **Kopiuj i wklej** | Zaznacz węzły (i elementy), <kbd>Ctrl</kbd>+<kbd>C</kbd>, <kbd>Ctrl</kbd>+<kbd>V</kbd>, a potem kliknij tam, gdzie ma trafić kopia. |

Etykiety są nadawane automatycznie (`1`, `2`, …) i można je zmienić w tabeli.

### Przyciąganie

Przy włączonym **Przyciągaj do siatki** (<kbd>S</kbd> lub plakietka **S**) węzły stawiane i przeciągane myszą trafiają w wielokrotności **Kroku przyciągania do siatki** (domyślnie `0,1 m`, do zmiany w *Ustawienia → Ustawienia widoku → Siatka*). Wyłącz przyciąganie, aby umieszczać swobodnie, albo wpisz potem dokładne współrzędne w tabeli.

### Umieszczanie węzła na istniejącym elemencie

Jeśli podczas dodawania węzła klikniesz w odległości ok. 0,1 m od elementu, EduBeam zapyta, o co Ci chodzi:

- **Połącz z konstrukcją** — element zostaje podzielony na dwa (`1a` i `1b`), przeguby na zewnętrznych końcach są zachowane, a obciążenie rozłożone dzielone między obie części. To najszybszy sposób na dodanie podpory pośredniej lub punktu przyłożenia obciążenia.
- **Umieść pojedynczy węzeł** — węzeł powstaje na elemencie, ale nie jest z nim połączony.

## Edycja węzłów

- **Tabela:** edytuj etykietę, X i Z w miejscu.
- **Przeciąganie:** przesuwaj węzeł w widoku (z możliwością cofnięcia). Na ekranach dotykowych przytrzymaj węzeł, aby zacząć go przesuwać.
- **Okno Edytuj węzeł:** współrzędne, podpory i kąt lokalnego układu w jednym miejscu, z podglądem symbolu podpory na żywo.
- **Usuwanie:** ikona kosza w tabeli, *Usuń* w menu podręcznym węzła lub zaznaczenie i <kbd>Delete</kbd>. Usunięcie węzła usuwa przypisane do niego elementy i obciążenia.

## Podpory

Podpora to po prostu zbiór zablokowanych stopni swobody. Każdy węzeł ma trzy:

| Stopień swobody | Znaczenie |
| --- | --- |
| **Dx** | przesunięcie wzdłuż x (poziome) |
| **Dz** | przesunięcie wzdłuż z (pionowe) |
| **Ry** | obrót wokół y (obrót w płaszczyźnie) |

Zaznacz pola w kolumnie **Podparte stopnie swobody** zakładki *Węzły*, w menu podręcznym **Podpory węzła** zaznaczonego węzła lub w oknie *Edytuj węzeł*. Symbol rysowany w widoku wynika z kombinacji:

| Zablokowane | Podpora | Symbol |
| --- | --- | --- |
| Dx + Dz + Ry | Utwierdzenie | zakreskowany blok |
| Dx + Dz | Podpora przegubowa nieprzesuwna | trójkąt |
| Dz | Podpora przegubowa przesuwna pozioma (swobodny przesuw poziomy) | trójkąt na rolkach |
| Dx | Podpora przegubowa przesuwna pionowa (swobodny przesuw pionowy) | obrócona podpora na rolkach |
| Dz + Ry | Utwierdzenie przesuwne (prowadnica pionowa) | utwierdzenie na rolkach |
| Dx + Ry | Utwierdzenie przesuwne (prowadnica pozioma) | obrócone utwierdzenie |
| Ry | Tylko blokada obrotu | blokada obrotu |
| brak | Węzeł swobodny | — |

Dla każdego zablokowanego stopnia swobody obliczana — i rysowana — jest reakcja.

::: tip Węzły kratownicy
Pręty kratownicy to elementy belkowe ze zwolnionymi oboma **przegubami końcowymi** (zobacz [Elementy](/pl/essentials/elements#przeguby-koncowe)). W węźle kratownicy zwykle stosuje się podporę przegubową nieprzesuwną (Dx + Dz); **nie** blokuj Ry w węźle, w którym wszystkie zbiegające się elementy są przegubowe — obrót takiego węzła byłby nieokreślony.
:::

### Podpory ukośne (pochylone)

Ustaw **Kąt lokalnego układu** (w stopniach, −180…180) w menu podręcznym węzła lub w oknie *Edytuj węzeł*. Osie lokalne węzła obracają się o ten kąt, a stopnie swobody podpory są interpretowane w obróconym układzie — podpora przesuwna na zboczu o nachyleniu 30° to `Dz` z kątem lokalnego układu `30`. Symbol podpory obraca się odpowiednio, a reakcja jest podawana w obróconym kierunku.

### Stateczność

Solver potrzebuje łącznie co najmniej **trzech zablokowanych stopni swobody** oraz konstrukcji bez mechanizmu. Brak lub niedostateczna liczba podpór powoduje błąd *Model needs at least 3 constrained DOFs…* (komunikat wyświetlany po angielsku) albo po prostu brak wyników. Zobacz [Rozwiązywanie problemów](/pl/reference/troubleshooting).

## Obciążenia węzłowe i osiadania

Siły, momenty i zadane przemieszczenia (osiadania podpór) przykłada się w węzłach — zobacz [Obciążenia](/pl/essentials/loads#obciazenia-wezłowe).

## Linie wymiarowe

Kliknij prawym przyciskiem na płótnie → **Dodaj wymiar**, aby narysować linię wymiarową między dwoma punktami. Końce przyciągają się do węzłów, gdy przeciągniesz je w ich pobliże; zaznacz linię i użyj **Edytuj**, aby wpisać współrzędne, lub **Odwróć wymiar**, aby przenieść opis na drugą stronę. Linie wymiarowe są tylko elementem graficznym i są zapisywane razem z projektem.
