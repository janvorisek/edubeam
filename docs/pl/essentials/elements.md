# Elementy, materiały i przekroje

## Element belkowy {#the-beam-element}

<Edubeam /> ma jeden typ elementu: **płaską belkę Timoshenki** w płaszczyźnie x–z z trzema stopniami swobody na każdym końcu (`Dx`, `Dz`, `Ry`). Przenosi siłę osiową, ścinanie i zginanie oraz uwzględnia odkształcenie postaciowe od ścinania, dlatego przekrój ma współczynnik ścinania. Pełne sformułowanie znajdziesz w [podręczniku teoretycznym](/pl/elements/beam).

<TrussElement :moment="true" caption="Płaski element belkowy – trzy stopnie swobody w węźle" />

Wyniki wzdłuż elementu są dokładne dla modelu liniowego, więc jeden element na pręt wystarczy. Węzły pośrednie dodawaj tylko tam, gdzie potrzebujesz podpory, przegubu, zmiany przekroju lub węzła, w którym chcesz odczytać wyniki.

### Dodawanie elementów {#adding-elements}

| Sposób | Jak |
| --- | --- |
| **Okno dialogowe** | Zakładka *Elementy* → pierwszy przycisk **Dodaj element** albo menu płótna → *Dodaj element*. Wybierz **Węzeł początkowy** i **Węzeł końcowy**, przeguby, materiał i przekrój. |
| **Mysz** | Zakładka *Elementy* → drugi przycisk **Dodaj element** (ikona kursora) albo przytrzymaj <kbd>Ctrl</kbd> przy wyborze pozycji w menu płótna. Kliknij węzeł, aby zacząć, a potem następny węzeł, aby go połączyć; kliknięcie pustego płótna tworzy tam węzeł. Klikaj dalej, aby rysować linię łamaną, i naciśnij <kbd>Esc</kbd>, aby zakończyć. Pasek u góry ustawia **Przegub na początku** i **Przegub na końcu** dla każdego rysowanego elementu. Używany jest pierwszy materiał i pierwszy przekrój w modelu. |

![Okno Dodaj element](/screenshots/pl/qs-element.webp){.shot-md}

::: warning Najpierw materiały i przekroje
Element potrzebuje materiału i przekroju. Jeśli ich nie ma, widok pokazuje *Nie zdefiniowano materiałów.* / *Nie zdefiniowano przekrojów.* z przyciskiem **Dodaj nowy**.
:::

### Kierunek elementu {#element-direction}

**Lokalna oś x** biegnie od węzła początkowego do węzła końcowego. Ma to znaczenie dla:

- obciążeń w układzie lokalnym (zaznaczone **LCS**),
- wartości *Pozycja obciążenia od węzła początkowego* obciążeń skupionych,
- kolejności sił końcowych (`X12, Z12, M12` na początku, `X21, Z21, M21` na końcu) w tabeli wyników.

Aby odwrócić element, użyj przycisku zamiany między dwoma węzłami w tabeli *Elementy*.

### Przeguby końcowe {#end-hinges}

Każdy element ma w tabeli *Elementy* dwa pola wyboru **Przeguby końcowe**: na początku i na końcu. Znajdziesz je też w oknie Dodaj element, w panelu **Edytuj element** oraz na pasku podczas rysowania myszą. Zaznaczony przegub zwalnia moment zginający na danym końcu, więc:

- jeden przegub tworzy przegub wewnątrz ramy lub belki ciągłej (moment jest tam zerowy);
- dwa przeguby tworzą **pręt kratownicy**, który przenosi wyłącznie siłę osiową.

<TrussElement :hinges="[true, true]" caption="Oba końce przegubowe → element kratownicy" />

![Tabela Elementy ramy trójprzegubowej: element 2 ma przegub na końcu, w węźle C](/screenshots/pl/elements-table.webp)

Gdy w węźle spotykają się dwa elementy, a tylko jeden z nich ma przegub, drugi nadal przekazuje moment do węzła. Przegub zakładaj więc na element, który ma zostać zwolniony, a nie „na węzeł”. Jeśli przeguby zamieniają konstrukcję w mechanizm, EduBeam je zakreśla i pokazuje, jak konstrukcja się porusza.

### Edycja i usuwanie {#editing-and-deleting}

Kliknij element i użyj jego panelu (**Edytuj element**, **Dodaj obciążenie**, **Macierz sztywności**, **Usuń**) albo edytuj go w tabeli *Elementy*. Usunięcie elementu usuwa też jego obciążenia. **Macierz sztywności** otwiera okno z macierzą sztywności elementu 6 × 6 w układzie globalnym (N/m, N i N·m), z już skondensowanymi przegubami końcowymi. Przydaje się do sprawdzania ręcznej agregacji.

## Materiały {#materials}

Zakładka *Materiały* → **Dodaj materiał**:

| Pole | Symbol | Jednostka | Uwagi |
| --- | --- | --- | --- |
| Moduł Younga | $E$ | jednostka naprężenia (domyślnie MPa) | Stal ≈ 210 000 MPa, beton ≈ 30 000 MPa, drewno ≈ 11 000 MPa |
| Moduł Kirchhoffa | $G$ | jednostka naprężenia | $G = E / (2(1+\nu))$; stal ≈ 81 000 MPa. Wpływa tylko na człon ścinania Timoshenki. |
| Gęstość | $\rho$ | masa / długość³ (kg/m³, lb/ft³) | Zapisywana w projekcie. Solver statyczny jej nie używa (nie ma obciążenia ciężarem własnym). |
| Współczynnik rozszerzalności cieplnej | $\alpha$ | 1/K lub 1/°F | Używany przez [obciążenia termiczne](/pl/essentials/loads#temperature-load). Stal: 12 × 10⁻⁶ /K. |

<div class="shots">

![Dodaj materiał](/screenshots/pl/qs-material.webp)

![Biblioteka materiałów](/screenshots/pl/qs-material-library.webp)

</div>

**Biblioteka materiałów** zawiera gotowe materiały. Grupa pasująca do Twoich jednostek jest wyświetlana jako pierwsza.

- **Metale:** stale konstrukcyjne S235, S275, S355, stale nierdzewne, żeliwo, stopy aluminium, miedź, mosiądz, brąz, tytan; amerykańskie stale ASTM A992, A36, A572 Gr. 50 oraz HSS A500 Gr. C.
- **Beton:** beton zwykły i lekki, klasy C25/30, C30/37, C40/50 oraz f′c = 4 ksi i 5 ksi.
- **Drewno:** C24, GL24h, GL32h.
- **Inne:** szkło, GFRP, CFRP, HDPE, PVC, PMMA, poliwęglan.

Otwórz ją przyciskiem na pasku narzędzi lub przez *Lub wybierz z biblioteki* w oknie *Dodaj materiał*.

Materiału, którego wciąż używają elementy, nie można usunąć; najpierw przypisz tym elementom inny.

## Przekroje {#cross-sections}

Zakładka *Przekroje* → **Dodaj przekrój**:

| Pole | Symbol | Jednostka | Uwagi |
| --- | --- | --- | --- |
| Pole | $A$ | jednostka pola | Sztywność osiowa $EA$ |
| Moment bezwładności | $I_y$ | jednostka momentu bezwładności | Sztywność na zginanie $EI_y$ względem osi prostopadłej do rysunku |
| Wysokość | $h$ | jednostka wymiarów przekroju | Używana przez obciążenia gradientem temperatury (krzywizna $= \alpha\,\Delta T / h$) |
| Współczynnik ścinania | $k$ | – | Współczynnik korekcyjny ścinania Timoshenki: efektywne pole ścinania to $kA$. Wpisz `1`, aby prawie pominąć odkształcenie postaciowe, około 0,83 dla prostokątów, $A_{web}/A$ dla dwuteowników. |

**Biblioteka przekrojów** podaje przybliżone wartości dla prostokątów, kwadratów i kół, profili IPE i HEA, rur prostokątnych (RHS) i okrągłych (CHS) oraz kształtowników AISC W i HSS (prostokątnych i okrągłych). Jej współczynniki ścinania zależą od kształtu: $h\,t_w/A$ dla dwuteowników, $2ht/A$ dla rur prostokątnych, 0,5 dla rur okrągłych, 0,833 dla prostokątów i 0,9 dla kół. Traktuj te wartości jako punkt wyjścia i przed użyciem porównaj je z tablicami profili.

![Biblioteka przekrojów](/screenshots/pl/sections-library.webp){.shot-lg}

### Przekroje wielokątne {#polygonal-sections}

Zakładka *Przekroje* → **Przekrój wielokątny** lub *Lub zdefiniuj kształt wielokątny* w oknie *Dodaj przekrój* otwiera edytor kształtu.

![Edytor przekroju wielokątnego z szablonem dwuteownika, jego osiami głównymi i elipsą bezwładności](/screenshots/pl/sections-polygon.webp)

- **Zacznij** od szablonu (prostokąt, dwuteownik, teownik, kątownik, ceownik, rura prostokątna lub okrągła, koło) z jego wymiarami, a potem naciśnij **Zastosuj**.
- **Edytuj** kształt: przeciągaj wierzchołki (przyciągają się do wartości **Krok przyciągania**), kliknij środek krawędzi, aby wstawić wierzchołek, kliknij dwukrotnie wierzchołek, aby go usunąć, albo wpisz współrzędne w tabeli wierzchołków. **Dodaj otwór** dodaje kontur wewnętrzny. **Wyśrodkuj w środku ciężkości** przesuwa kształt tak, by jego środek ciężkości leżał w początku układu.
- **Odczytaj** pole $A$, środek ciężkości, centralne momenty bezwładności $I_y$, $I_z$, $I_{yz}$, główne momenty bezwładności $I_1$, $I_2$ z kątem osi głównych $\alpha$ (od $y$ do osi 1) oraz promienie bezwładności. Rysunek pokazuje elipsę bezwładności.

Przy zapisie $A$, $I_y$ i $h$ są wypełniane na podstawie kształtu. W tabeli są tylko do odczytu; aby ponownie edytować kształt, użyj przycisku wielokąta w kolumnie *Akcje*. Współczynnik ścinania $k$ nadal wpisujesz sam. Współrzędne przekroju są lokalne i prawoskrętne: $x$ wychodzi z ekranu, $y$ jest skierowana w lewo, a $z$ w dół.

Jeśli kształt nie jest symetryczny względem płaszczyzny ramy (np. kątownik), edytor ostrzega, że analiza 2D jest dokładna tylko wtedy, gdy pręt jest na całej długości zabezpieczony przed przemieszczeniem bocznym i skręceniem, na przykład przez płytę. Gdy $I_{yz}$ jest znaczący, wybierasz, której sztywności na zginanie użyć: **stężony bocznie i przeciw skręceniu na całej długości** ($I_y$) albo **swobodny w kierunku bocznym**, która jest mniejsza. W żadnym z przypadków skręcanie nie jest uwzględniane.

::: tip Szybkie wartości kontrolne
Dla prostokąta $b \times h$: $A = bh$, $I_y = bh^3/12$. Dla pełnego koła o średnicy $d$: $A = \pi d^2/4$, $I_y = \pi d^4/64$.
:::

Materiały i przekroje mogą być współdzielone przez dowolną liczbę elementów. Zmiana wartości aktualizuje każdy element, który ich używa, i ponownie rozwiązuje model.
