# Interfejs użytkownika

<Edubeam /> ma trzy strefy: **pasek aplikacji** u góry, **widok** pośrodku, w którym rysujesz, oraz **dolny pasek** z tabelą dla każdego rodzaju obiektów. Gdy wiesz, co gdzie się znajduje, reszta dokumentacji stanie się zrozumiała.

![Części interfejsu, ponumerowane jak na liście poniżej](/screenshots/pl/ui-overview.webp)

1. **Menu ☰**: otwieranie, zapis, udostępnianie i eksport; przykłady i przewodniki.
2. **Przyciski paska aplikacji**: Wyczyść model i Udostępnij model.
3. **Cofnij / Ponów** dla każdej zmiany modelu.
4. **Przyciski widoku**: wyśrodkowanie, dopasowanie do ekranu i przełącznik opcji wyświetlania.
5. **Opcje wyświetlania**: które wyniki i części modelu są rysowane.
6. **Siatka, przyciąganie, celownik i jednostki.**
7. **Zakładki dolnego paska**: Węzły, Elementy, Obciążenia, Materiały, Przekroje, Wyniki.
8. **Tabela** otwartej zakładki, w której można edytować każdą wartość.

::: tip Skorzystaj z przewodnika
**☰ → Oprowadź mnie** pokazuje te części po kolei bezpośrednio w aplikacji.
:::

![Oprowadź mnie, krok z opcjami wyświetlania](/screenshots/pl/tour.webp)

## Pasek aplikacji {#app-bar}

| Element | Do czego służy |
| --- | --- |
| **Menu ☰** | Menu główne, zobacz niżej. |
| **Wyczyść model** | Po potwierdzeniu usuwa wszystkie węzły, elementy i obciążenia. Dwa pola wyboru usuwają też materiały i przekroje. <kbd>Ctrl</kbd>+<kbd>Z</kbd> przywraca model, a ponadto jest on przechowywany w Ostatnich modelach. |
| **Udostępnij model** | Otwiera [okno udostępniania](/pl/essentials/import-export#share-a-link) z linkiem zawierającym cały model. |
| **Co nowego?** | Informacje o wydaniu. Otwierają się też same jeden raz po aktualizacji. |
| **Dokumentacja** / GitHub | Ta dokumentacja i kod źródłowy. |

Na telefonie mieszczą się tylko menu ☰ i Dokumentacja; wszystko inne jest w menu.

### Menu ☰ {#the-☰-menu}

![Menu ☰](/screenshots/pl/ui-app-menu.webp){.shot-xs}

| Pozycja | Do czego służy |
| --- | --- |
| **Otwórz projekt** / **Zapisz projekt** | Otwiera lub pobiera plik `project.json` (<kbd>Ctrl</kbd>+<kbd>O</kbd> / <kbd>Ctrl</kbd>+<kbd>S</kbd>). |
| **Ostatnie modele** | 10 ostatnich modeli, które wyczyściłeś lub zastąpiłeś, gotowych do przywrócenia. |
| **Eksportuj obraz** | Zapisuje rysunek jako PNG lub SVG albo kopiuje go (<kbd>Ctrl</kbd>+<kbd>P</kbd>). |
| **Udostępnij model** | To samo co przycisk na pasku aplikacji. |
| **Przykłady** | Galeria gotowych modeli. |
| **Narysuj pierwszą belkę** | Prowadzone zadanie w siedmiu krokach. |
| **Oprowadź mnie** | Przewodnik po interfejsie. |
| **Wyczyść model** | To samo co przycisk na pasku aplikacji. |

Na dole menu widać wersję aplikacji i datę jej wydania.

## Widok {#viewer}

Płótno to miejsce, w którym rysujesz i analizujesz model. Wszystko inne w aplikacji podąża za tym, co tu zaznaczysz.

### Przyciski na płótnie {#buttons-on-the-canvas}

- **Lewy górny róg:** **Cofnij** i **Ponów** (<kbd>Ctrl</kbd>+<kbd>Z</kbd> / <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Z</kbd>). Każdą zmianę modelu, w tym dodawanie, edycję, przeciąganie, usuwanie i czyszczenie, można cofnąć.
- **Prawy górny róg:** **Wyśrodkuj widok** (<kbd>C</kbd>), **Dopasuj do ekranu** (<kbd>F</kbd>) i przycisk ⚙, który pokazuje lub ukrywa opcje wyświetlania. Na ekranach dotykowych jest też **Zaznaczanie prostokątem**.
- **Prawy dolny róg:** **G** włącza i wyłącza siatkę, **S** włącza i wyłącza przyciąganie do siatki, przycisk celownika pokazuje położenie kursora na linijkach, a **plakietka jednostek** otwiera ustawienia w sekcji *Język i ustawienia regionalne*.

### Opcje wyświetlania {#display-options}

![Przyciski widoku i opcje wyświetlania](/screenshots/pl/ui-display-settings.webp){.shot-lg}

Dwa rzędy pól wyboru, domyślnie otwarte:

- **Wyniki:** *Kształt odkształcony*, *N (x)*, *V<sub>z</sub> (x)*, *M<sub>y</sub> (x)*, *Reakcje*. Kształt odkształcony, M i Reakcje są na początku zaznaczone.
- **Model:** *Podpory*, *Obciążenia*, *Etykiety węzłów*, *Etykiety elementów*.

**Więcej ustawień** otwiera pełne [ustawienia](/pl/essentials/units-settings) w sekcji *Ustawienia widoku*.

### Nawigacja {#navigating}

| Czynność | Mysz | Dotyk |
| --- | --- | --- |
| Powiększanie | Kółko myszy (w stronę kursora), <kbd>Ctrl</kbd>+<kbd>=</kbd> / <kbd>Ctrl</kbd>+<kbd>-</kbd> | Rozsunięcie / zsunięcie palców |
| Przesuwanie widoku | Przeciąganie **środkowym lub prawym** przyciskiem (zobacz *Ustawienia → Sterowanie i skróty*) | Przeciąganie jednym palcem |
| Dopasowanie / wyśrodkowanie | <kbd>F</kbd> / <kbd>C</kbd> lub przyciski w prawym górnym rogu | Przyciski w prawym górnym rogu |

### Zaznaczanie i edycja {#selecting-and-editing}

**Kliknij** węzeł, element, obciążenie lub linię wymiarową, aby je zaznaczyć. Obok otworzy się panel ze szczegółami i odpowiednimi akcjami: dodanie obciążenia, ustawienie podpór, edycja, wyświetlenie macierzy sztywności, usunięcie. Kliknięcie węzła przełącza też dolny pasek na zakładkę Węzły.

<div class="shots">

![Węzeł: dodaj obciążenie, ustaw podpory, zadaj przemieszczenie](/screenshots/pl/ui-node-menu.webp)

![Element: edytuj, dodaj obciążenie, macierz sztywności](/screenshots/pl/ui-element-menu.webp)

</div>

- **Przeciągnij po pustym płótnie**, aby narysować prostokąt zaznaczenia. Wszystko w jego wnętrzu zostanie zaznaczone: węzły, elementy, ich obciążenia i linie wymiarowe. Naciśnij <kbd>Delete</kbd>, aby to wszystko usunąć, lub <kbd>Ctrl</kbd>+<kbd>C</kbd> / <kbd>Ctrl</kbd>+<kbd>V</kbd>, aby skopiować w inne miejsce.
- **Przeciągnij węzeł**, aby go przesunąć. Przy włączonym przyciąganiu trafi w siatkę. Połączone elementy i ich obciążenia podążają za nim.
- **Kliknij dwukrotnie obciążenie**, aby je edytować.
- **Najedź kursorem** na dowolny obiekt, aby zobaczyć podpowiedź. Węzły pokazują przemieszczenia i obrót, elementy materiał i przekrój, obciążenia ich wartości. Na ekranie dotykowym stuknij obiekt: te same szczegóły pojawią się w panelu zaznaczenia.

![Najechanie na węzeł pokazuje jego przemieszczenia i obrót](/screenshots/pl/ui-hover.webp){.shot-sm}

**Kliknij prawym przyciskiem płótno** (lub przytrzymaj palec na ekranie dotykowym), aby otworzyć menu płótna. Przytrzymaj <kbd>Ctrl</kbd> przy wyborze *Dodaj węzeł* lub *Dodaj element*, aby wstawić je myszą zamiast przez okno dialogowe. Nad elementem menu oferuje też *Wymiaruj element*.

![Menu płótna](/screenshots/pl/ui-canvas-menu.webp){.shot-sm}

Wszystkie skróty znajdziesz na stronie [Klawiatura, mysz i dotyk](/pl/reference/shortcuts).

### Gdy modelu nie da się rozwiązać {#when-the-model-cannot-be-solved}

Komunikaty pojawiają się w lewym górnym rogu widoku:

- *Nie zdefiniowano materiałów.* / *Nie zdefiniowano przekrojów.* z przyciskiem **Dodaj nowy**.
- Mała niebieska plakietka **Brak podpór**, dopóki model jest po prostu niedokończony.
- **Czerwony komunikat**, gdy coś jest nie tak, z przyciskiem **Pokaż szczegóły**, który wymienia wszystkie problemy.

Gdy konstrukcja wciąż może się poruszać, EduBeam pokazuje jej ruch przerywanym zarysem i zakreśla winne węzły lub przeguby. Najedź na komunikat, aby ponownie zobaczyć ruch, albo ukryj go przyciskiem z okiem.

![Rama z przegubami w B i C jest mechanizmem: EduBeam pokazuje, jak się porusza](/screenshots/pl/ui-mechanism.webp)

![Pokaż szczegóły wymienia każdy problem ze wskazówką](/screenshots/pl/ui-diagnostics.webp){.shot-lg}

Każdy komunikat objaśnia strona [Rozwiązywanie problemów](/pl/reference/troubleshooting).

## Dolny pasek {#bottom-bar}

Sześć zakładek, każda z paskiem narzędzi i edytowalną tabelą. Zakładki pokazują, ile obiektów danego rodzaju ma model. **?** po prawej objaśnia otwartą zakładkę, podobnie jak **?** przy niektórych nagłówkach kolumn. Przeciągnij pasek zakładek w górę lub w dół, aby zmienić wysokość panelu, albo zminimalizuj go przyciskiem po prawej.

| Zakładka | Pasek narzędzi | Tabela |
| --- | --- | --- |
| **Węzły** | Dodaj węzeł (okno dialogowe), Dodaj węzeł (mysz) | Etykieta, współrzędne, **Podparte stopnie swobody** (symbol podpory, Dx, Dz, Ry, kąt podpory α), obciążenia, edycja, usuwanie |
| **Elementy** | Dodaj element (okno dialogowe), Dodaj element (mysz) | Etykieta, typ, węzły (z przyciskiem zamiany), materiał, przekrój, **Przeguby końcowe**, obciążenia, macierz sztywności, usuwanie |
| **Obciążenia** | Dodaj obciążenie węzłowe, Dodaj obciążenie elementu | Typ, miejsce przyłożenia, edytowalne składowe, edycja, usuwanie |
| **Materiały** | Dodaj materiał, Biblioteka materiałów | Etykieta, E, G, α<sub>T</sub>, usuwanie |
| **Przekroje** | Dodaj przekrój, Biblioteka przekrojów, Przekrój wielokątny | Kształt, etykieta, A, I<sub>y</sub>, h, k, edycja kształtu, usuwanie |
| **Wyniki** | Wyniki węzłowe, Wyniki elementów, Eksportuj CSV, Kopiuj | Przemieszczenia i obroty węzłów albo siły końcowe elementów |

Komórkę edytujesz na miejscu: kliknij, wpisz wartość i naciśnij <kbd>Enter</kbd> (lub <kbd>Esc</kbd>, aby opuścić komórkę). Wartości są wyświetlane i wprowadzane w [bieżących jednostkach](/pl/essentials/units-settings).

## Zakładki nad widokiem {#tabs-above-the-viewer}

**Widok** pokazuje płótno. **Ustawienia** pokazują ustawienia na całym ekranie, więc możesz zmienić kolory lub jednostki i przełączyć się z powrotem, aby zobaczyć efekt. Plakietka jednostek i *Więcej ustawień* otwierają te same ustawienia jako okno dialogowe nad modelem.

## Okna pływające {#floating-windows}

**Macierz sztywności** (z panelu elementu lub z tabeli Elementy) otwiera okno z macierzą sztywności elementu 6 × 6 w układzie globalnym. **Edytuj** w menu płótna otwiera tabelę bieżącego zaznaczenia. Okna przeciągasz za pasek tytułu i zamykasz krzyżykiem ×.
