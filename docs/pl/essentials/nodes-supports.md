# Węzły i podpory

Węzły to punkty modelu. Elementy łączą węzły, a podpory i obciążenia węzłowe są przypisane do węzłów.

## Współrzędne {#coordinates}

Każdy węzeł ma współrzędne **X** i **Z** w bieżącej jednostce długości. Oś x jest skierowana w prawo, a **oś z w dół** ekranu, więc słup wyrastający z gruntu biegnie od `Z = 0` do `Z = −3`, a nie `+3`. Wskaźnik osi w rogu siatki pokazuje orientację. Jeśli wolisz oś pionową skierowaną w górę, przełącz się w Ustawieniach na [oś y w górę](/pl/elements/conventions#y-up-axes).

## Dodawanie węzłów {#adding-nodes}

| Sposób | Jak |
| --- | --- |
| **Okno dialogowe** | Zakładka *Węzły* → pierwszy przycisk **Dodaj węzeł** albo prawy przycisk myszy na płótnie → *Dodaj węzeł*. Wpisz X i Z, a opcjonalnie także podpory i kąt podpory. |
| **Mysz** | Zakładka *Węzły* → drugi przycisk **Dodaj węzeł** (ikona kursora) albo przytrzymaj <kbd>Ctrl</kbd> przy wyborze *Dodaj węzeł* w menu płótna. Każde kliknięcie na płótnie dodaje węzeł. Naciśnij <kbd>Esc</kbd> lub **Anuluj**, aby zakończyć. |
| **Podczas rysowania elementów** | W trybie dodawania elementów myszą kliknięcie pustego płótna tworzy węzeł i go łączy. |
| **Kopiuj i wklej** | Zaznacz węzły (i elementy), naciśnij <kbd>Ctrl</kbd>+<kbd>C</kbd> i <kbd>Ctrl</kbd>+<kbd>V</kbd>, a potem kliknij, gdzie ma się znaleźć kopia, albo wpisz przesunięcie Δx, Δz i naciśnij **Wklej**. |

<div class="shots">

![Okno Dodaj węzeł](/screenshots/pl/qs-node.webp)

![W trybie myszy pasek u góry ustawia podpory i kąt każdego wstawianego węzła](/screenshots/pl/nodes-add-banner.webp)

</div>

Etykiety są nadawane automatycznie (`1`, `2`, … lub w kontynuacji Twojego schematu, np. `A`, `B`) i można je zmienić w tabeli.

### Przyciąganie {#snapping}

Przy włączonym **Przyciągaj do siatki** (<kbd>S</kbd> lub przełącznik **S**) wstawiane i przeciągane węzły trafiają w wielokrotności wartości **Krok przyciągania do siatki**: domyślnie 0,1 m lub 0,5 ft w jednostkach amerykańskich. Zmienisz go w *Ustawienia → Ustawienia widoku → Siatka*. Wyłącz przyciąganie, aby wstawiać węzły swobodnie, albo wpisz później dokładne współrzędne w tabeli.

### Wstawianie węzła na istniejącym elemencie {#placing-a-node-on-an-existing-element}

Jeśli podczas dodawania węzła klikniesz blisko elementu, EduBeam zapyta, o co Ci chodzi:

- **Połącz z konstrukcją** dzieli element na dwa (`1a` i `1b`). Przeguby na zewnętrznych końcach zostają zachowane, a obciążenia równomierne i trapezowe są dzielone między obie części; obciążenia skupione i termiczne trafiają do pierwszej części. To najszybszy sposób na dodanie podpory pośredniej lub punktu przyłożenia obciążenia.
- **Umieść pojedynczy węzeł** tworzy węzeł na elemencie bez łączenia go.

## Edycja węzłów {#editing-nodes}

- **Tabela:** edytuj etykietę, X i Z bezpośrednio w komórkach.
- **Przeciąganie:** przesuń węzeł w widoku, także na ekranie dotykowym: dotknij węzła i przeciągnij. Każde przesunięcie można cofnąć.
- **Okno Edytuj węzeł:** ołówek w kolumnie *Akcje* tabeli. Zawiera współrzędne, podpory i kąt podpory, z podglądem symbolu podpory.
- **Usuwanie:** × w tabeli, *Usuń* w panelu węzła albo zaznacz węzeł i naciśnij <kbd>Delete</kbd>. Usunięcie węzła usuwa też przyłączone do niego elementy i obciążenia.

## Podpory {#supports}

Podpora to zestaw zablokowanych stopni swobody. Każdy węzeł ma trzy:

| Stopień swobody | Znaczenie |
| --- | --- |
| **Dx** | przesunięcie wzdłuż osi x (poziome) |
| **Dz** | przesunięcie wzdłuż osi z (pionowe) |
| **Ry** | obrót wokół osi y (w płaszczyźnie rysunku) |

Najszybciej jest **wybrać symbol**. Znajdziesz go w panelu węzła pod **Podpory węzła**, w oknach Dodaj węzeł i Edytuj węzeł oraz jako małe menu na początku kolumny *Podparte stopnie swobody* w tabeli Węzły. Zaznaczanie pól `Dx`, `Dz`, `Ry` robi to samo, po jednym stopniu swobody.

![Podpory węzła: wybierz symbol lub zaznacz stopnie swobody i ustaw kąt podpory](/screenshots/pl/nodes-support-picker.webp){.shot-lg}

| Podpora | Zablokowane | Może się | Reakcje |
| --- | --- | --- | --- |
| **Swobodny** | nic | przemieszczać dowolnie | brak |
| **Przegub** | Dx + Dz | obracać | R<sub>x</sub>, R<sub>z</sub> |
| **Przegub przesuwny** | Dz | przesuwać poziomo i obracać | R<sub>z</sub> |
| **Przegub przesuwny pionowy** | Dx | przesuwać pionowo i obracać | R<sub>x</sub> |
| **Utwierdzenie** | Dx + Dz + Ry | nic | R<sub>x</sub>, R<sub>z</sub>, M |
| **Utwierdzenie przesuwne** | Dz + Ry | przesuwać poziomo | R<sub>z</sub>, M |
| **Utwierdzenie przesuwne pionowe** | Dx + Ry | przesuwać pionowo | R<sub>x</sub>, M |
| **Tylko obrót zablokowany** | Ry | przesuwać w obu kierunkach | M |

Dla każdego zablokowanego stopnia swobody obliczana i rysowana jest reakcja.

::: tip Węzły kratownicy
Pręty kratownicy to elementy belkowe ze zwolnionymi oboma **przegubami końcowymi** (zobacz [Elementy](/pl/essentials/elements#end-hinges)). W podporze kratownicy zwykle stosuje się podporę przegubową nieprzesuwną (Dx + Dz). Węzeł, w którym wszystkie przyłączone elementy mają przeguby, nie ma sztywności obrotowej; EduBeam go akceptuje i podaje jego obrót jako 0.
:::

### Podpory ukośne {#inclined-skewed-supports}

Ustaw **Kąt lokalnego układu** α w stopniach (−180…180). Znajdziesz go w panelu węzła pod *Podpory węzła*, w oknach Dodaj węzeł i Edytuj węzeł oraz w polu α tabeli Węzły. Osie węzła obracają się o ten kąt, a stopnie swobody podpory działają w obróconych kierunkach, więc podpora przesuwna na zboczu nachylonym pod kątem 30° to `Dz` z α = 30. Symbol obraca się odpowiednio, a reakcja jest podawana w obróconym kierunku.

### Stateczność {#stability}

Solver potrzebuje łącznie co najmniej **trzech zablokowanych stopni swobody**, a podpory i przeguby muszą utrzymać konstrukcję. Dopóki podpór jest za mało, widok pokazuje niebieską plakietkę *Brak podpór*. Jeśli podpór jest wystarczająco dużo, ale nie mogą utrzymać konstrukcji (wszystkie są równoległe lub przecinają się w jednym punkcie), albo przeguby pozwalają prętom obracać się względem siebie, czerwony komunikat nazywa problem, a przerywany zarys pokazuje, jak konstrukcja się porusza. Zobacz [Rozwiązywanie problemów](/pl/reference/troubleshooting).

## Obciążenia węzłowe i osiadania {#nodal-loads-and-settlements}

Siły, momenty i zadane przemieszczenia (osiadania podpór) przykłada się w węzłach. Zobacz [Obciążenia](/pl/essentials/loads#nodal-loads).

## Linie wymiarowe {#dimension-lines}

Kliknij prawym przyciskiem płótno → **Dodaj wymiar**, aby narysować linię wymiarową między dwoma punktami, albo kliknij prawym przyciskiem element → **Wymiaruj element**, aby zwymiarować go bezpośrednio. Punkty końcowe przyciągają się do węzłów, gdy przeciągniesz je w ich pobliże. Zaznacz linię i użyj **Edytuj**, aby wpisać jej współrzędne, lub **Odwróć wymiar**, aby przenieść opis na drugą stronę. Linie wymiarowe są tylko graficzne; zapisują się w projekcie i są przenoszone w linkach do udostępniania.
