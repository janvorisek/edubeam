# Elementy, materiały i przekroje

## Element belkowy

<Edubeam /> ma jeden typ elementu: **dwuwymiarową belkę Timoshenki** w płaszczyźnie x–z z trzema stopniami swobody na każdym końcu (`Dx`, `Dz`, `Ry`). Przenosi siłę podłużną, siłę poprzeczną i moment zginający oraz uwzględnia odkształcenie postaciowe od ścinania (dlatego przekrój ma współczynnik ścinania). Pełne sformułowanie znajdziesz w [podręczniku teoretycznym](/pl/elements/beam).

<TrussElement :moment="true" caption="Płaski element belkowy – trzy stopnie swobody w węźle" />

Wyniki wzdłuż elementu są dokładne dla modelu liniowego, więc jeden element na pręt wystarczy. Węzły pośrednie dodawaj tylko tam, gdzie potrzebujesz podpory, przegubu, zmiany przekroju lub węzła do przyłożenia obciążenia.

### Dodawanie elementów

| Metoda | Jak |
| --- | --- |
| **Okno dialogowe** | Zakładka *Elementy* → **Dodaj element** (lub menu płótna → *Dodaj element*): wybierz **Węzeł początkowy**, **Węzeł końcowy**, materiał i przekrój. |
| **Mysz** | Zakładka *Elementy* → **Dodaj myszą** (lub przytrzymaj <kbd>Ctrl</kbd> przy pozycji z menu płótna). Kliknij węzeł, aby zacząć, potem kliknij następny węzeł, aby połączyć — kliknięcie pustego płótna tworzy tam nowy węzeł. Klikaj dalej, aby rysować łamaną; naciśnij <kbd>Esc</kbd>, aby zakończyć. Pierwszy materiał i przekrój z modelu są przypisywane automatycznie. |

::: warning Najpierw materiały i przekroje
Element nie może istnieć bez materiału i przekroju. Jeśli żaden nie jest zdefiniowany, w widoku pojawia się *Nie zdefiniowano materiałów.* / *Nie zdefiniowano przekrojów.* ze skrótem **Dodaj nowy**.
:::

### Kierunek elementu

**Lokalna oś x** biegnie od węzła początkowego do węzła końcowego. Ma to znaczenie dla:

- obciążeń w układzie lokalnym (`fx`, `fz` w LCS),
- pola *Pozycja obciążenia od węzła początkowego* obciążeń skupionych,
- kolejności sił końcowych (`X12, Z12, M12` na początku, `X21, Z21, M21` na końcu) w tabeli wyników.

Użyj **Zamień kolejność węzłów** w tabeli *Elementy*, aby odwrócić element.

### Przeguby końcowe

Każdy element ma w tabeli *Elementy* dwa pola wyboru **Przeguby końcowe** (początek / koniec). Zaznaczony przegub zwalnia moment zginający na tym końcu (kondensacja statyczna obrotowego stopnia swobody), a więc:

- jeden przegub → przegub w ramie lub belce ciągłej (moment jest tam zerowy);
- oba przeguby → **pręt kratownicy** przenoszący wyłącznie siłę podłużną.

<TrussElement :hinges="[true, true]" caption="Oba końce przegubowe → element kratownicy" />

Gdy w węźle zbiegają się dwa elementy i tylko jeden z nich ma przegub, drugi nadal przekazuje moment do węzła — zwalniaj więc ten element, który ma być zwolniony, a nie „węzeł”.

### Edycja i usuwanie

Kliknij element i użyj menu podręcznego (**Edytuj element**, **Dodaj obciążenie**, **Macierz sztywności**, **Usuń**) albo edytuj bezpośrednio w tabeli *Elementy*. Usunięcie elementu usuwa też jego obciążenia. **Macierz sztywności** otwiera pływające okno z macierzą elementu 6 × 6 w układzie lokalnym i globalnym — przydatne przy sprawdzaniu ręcznej agregacji.

## Materiały

Zakładka *Materiały* → **Dodaj materiał**:

| Pole | Symbol | Jednostka | Uwagi |
| --- | --- | --- | --- |
| Moduł Younga | $E$ | jednostka naprężenia (domyślnie MPa) | Stal ≈ 210 000 MPa, beton ≈ 30 000 MPa, drewno ≈ 11 000 MPa |
| Moduł Kirchhoffa (ścinania) | $G$ | jednostka naprężenia | $G = E / (2(1+\nu))$; stal ≈ 81 000 MPa. Wpływa tylko na człon ścinania w belce Timoshenki. |
| Gęstość | $\rho$ | kg/m³ | Zapisywana z projektem; nieużywana przez solver statyczny (nie ma obciążenia ciężarem własnym). |
| Współczynnik rozszerzalności cieplnej | $\alpha$ | 1/K | Używany przez [obciążenia termiczne](/pl/essentials/loads#obciazenie-termiczne). Stal 12 × 10⁻⁶. |

**Biblioteka materiałów** oferuje gotowe zestawy: stale konstrukcyjne (S235, S275, S355, nierdzewna), stopy aluminium, miedź/mosiądz/brąz, tytan, klasy betonu, drewno (C24, GL24h, GL32h), szkło, GFRP/CFRP oraz popularne polimery. Wybierz z okna biblioteki lub z pozycji *Lub wybierz z biblioteki* w oknie *Dodaj materiał*.

## Przekroje

Zakładka *Przekroje* → **Dodaj przekrój**:

| Pole | Symbol | Jednostka | Uwagi |
| --- | --- | --- | --- |
| Pole | $A$ | jednostka pola | Sztywność podłużna $EA$ |
| Moment bezwładności | $I_y$ | m⁴ (lub wybrana jednostka) | Sztywność giętna $EI_y$ względem osi zginania w płaszczyźnie |
| Wysokość | $h$ | jednostka długości | Używana przez obciążenia nierównomiernym ogrzaniem (krzywizna $= \alpha\,\Delta T / h$) |
| Współczynnik ścinania | $k$ | – | Współczynnik korekcyjny ścinania Timoshenki: efektywne pole ścinania $= kA$. Użyj `1`, aby (niemal) pominąć odkształcenie od ścinania; ≈ 0,83 dla prostokąta; dla dwuteowników użyj $A_{web}/A$. |

**Biblioteka przekrojów** podaje przybliżone wartości dla prostokątów, kwadratów, kół, profili IPE i HEA oraz rur RHS i CHS. Traktuj je jako punkt wyjścia i sprawdź wartości w tablicach profili, zanim na nich polegasz.

::: tip Szybkie wartości kontrolne
Dla prostokąta $b \times h$: $A = bh$, $I_y = bh^3/12$. Dla koła pełnego o średnicy $d$: $A = \pi d^2/4$, $I_y = \pi d^4/64$.
:::

Materiały i przekroje mogą być współdzielone przez dowolną liczbę elementów; zmiana wartości aktualizuje każdy element, który jej używa, i przelicza model.
