# Interfejs użytkownika

<Edubeam /> ma trzy strefy. Gdy dowiesz się, co gdzie się znajduje, reszta dokumentacji stanie się zrozumiała.

```
┌──────────────────────────────────────────────────────────────────┐
│ ☰  edubeam     🗑 Wyczyść model   🔗 Udostępnij model   Co nowego? │  ← Pasek aplikacji
├──────────────────────────────────────────────────────────────────┤
│ Widok | Ustawienia                                               │  ← Zakładki
│ ↶ ↷                                            ⌖  ⤢  ⚙            │
│                                                                  │
│                     płótno (model)                  [przełączniki│  ← Widok
│                                                      warstw]     │
│                                           G  S  m·kN·kNm·MPa     │
├──────────────────────────────────────────────────────────────────┤
│ Węzły | Elementy | Obciążenia | Materiały | Przekroje | Wyniki   │  ← Dolny pasek
│ [Dodaj węzeł] [Dodaj myszą]            tabela obiektów …         │
└──────────────────────────────────────────────────────────────────┘
```

## Pasek aplikacji

| Element | Działanie |
| --- | --- |
| **Menu ☰** | **Otwórz projekt**, **Zapisz projekt**, **Udostępnij model**, **Wyczyść model** oraz wersja aplikacji. |
| **Wyczyść model** 🗑 | Po potwierdzeniu usuwa wszystkie węzły, elementy i obciążenia. Dwa pola wyboru pozwalają usunąć także materiały i przekroje. Operacji nie można cofnąć. |
| **Udostępnij model** 🔗 | Otwiera [okno udostępniania](/pl/essentials/import-export#udostepnianie-linku) z adresem URL kodującym cały model. |
| **Co nowego?** | Informacje o wydaniach. |
| **Dokumentacja** / GitHub | Linki do tej witryny i do kodu źródłowego. |

Pasek aplikacji jest ukryty w [trybie widoku](/pl/essentials/import-export#osadzanie-widoku-tylko-do-odczytu).

## Widok

Płótno to miejsce, w którym rysujesz i oglądasz model. Wszystko inne w aplikacji odzwierciedla to, co tutaj zaznaczysz.

### Przyciski nakładane na widok

- **Lewy górny róg:** **Cofnij** / **Ponów** (także <kbd>Ctrl</kbd>+<kbd>Z</kbd> / <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Z</kbd>). Każdą zmianę modelu — dodanie, edycję, przeciągnięcie, usunięcie — można cofnąć.
- **Prawy górny róg:** **Wyśrodkuj zawartość** (<kbd>C</kbd>), **Dopasuj zawartość do ekranu** (<kbd>F</kbd>) i przełącznik **ustawień wyświetlania** ⚙.
- **Prawy dolny róg:** **G** włącza/wyłącza siatkę, **S** — przyciąganie do siatki; **plakietka jednostek** pokazuje aktywne jednostki, a po kliknięciu otwiera ustawienia.

### Panel ustawień wyświetlania

Otwierany przyciskiem ⚙. Dwa rzędy pól wyboru:

- **Wyniki:** *Kształt odkształcony*, *N (x)*, *V<sub>z</sub> (x)*, *M<sub>y</sub> (x)*, *Reakcje*.
- **Model:** *Podpory*, *Obciążenia*, *Etykiety węzłów*, *Etykiety elementów*.

**Więcej ustawień** otwiera pełne [okno ustawień](/pl/essentials/units-settings).

### Nawigacja

| Czynność | Mysz / dotyk |
| --- | --- |
| Powiększanie | Kółko myszy (powiększa w kierunku kursora), <kbd>Ctrl</kbd>+<kbd>=</kbd> / <kbd>Ctrl</kbd>+<kbd>-</kbd>; gest szczypania na ekranach dotykowych |
| Przesuwanie widoku | Przeciąganie **środkowym lub prawym** przyciskiem myszy (do zmiany w *Ustawienia → Sterowanie i skróty*); przeciąganie jednym palcem na ekranie dotykowym |
| Dopasuj / wyśrodkuj | <kbd>F</kbd> / <kbd>C</kbd> lub przyciski w prawym górnym rogu |

### Zaznaczanie i edycja

- **Kliknij** węzeł, element, obciążenie lub linię wymiarową, aby go zaznaczyć. Dolny pasek przeskakuje do odpowiedniej zakładki, a obok zaznaczenia pojawia się małe **menu podręczne** z akcjami dostępnymi dla danego obiektu (np. *Dodaj obciążenie*, *Podpory węzła*, *Edytuj element*, *Macierz sztywności*, *Usuń*).
- **Przeciągnij po pustym płótnie**, aby narysować prostokąt zaznaczenia. Zaznaczone zostaje wszystko w środku — węzły, elementy, ich obciążenia i linie wymiarowe. Naciśnij <kbd>Delete</kbd>, aby to wszystko usunąć, lub <kbd>Ctrl</kbd>+<kbd>C</kbd> / <kbd>Ctrl</kbd>+<kbd>V</kbd>, aby skopiować i wkleić w innym miejscu.
- **Przeciągnij węzeł**, aby go przesunąć. Przy włączonym przyciąganiu trafia na siatkę. Połączone elementy i ich obciążenia podążają za nim.
- **Kliknij dwukrotnie obciążenie**, aby je edytować.
- **Najedź** na dowolny obiekt, aby zobaczyć podpowiedź: węzły pokazują przemieszczenia i kąt obrotu, elementy — materiał i przekrój, obciążenia — swoje składowe.
- **Kliknij prawym przyciskiem puste płótno**, aby otworzyć menu płótna: *Dodaj węzeł*, *Dodaj element*, *Dodaj wymiar*, *Edytuj* (otwiera tabelę bieżącego zaznaczenia), *Kopiuj*, *Wklej*, *Usuń*. Przytrzymaj <kbd>Ctrl</kbd> podczas wybierania *Dodaj węzeł* / *Dodaj element*, aby umieszczać je myszą zamiast przez okno dialogowe.

Wszystkie skróty wymieniono na stronie [Klawiatura i mysz](/pl/reference/shortcuts).

### Komunikaty

Gdy coś jest nie tak, w lewym górnym rogu widoku pojawiają się komunikaty: *Nie zdefiniowano materiałów.* / *Nie zdefiniowano przekrojów.* (z przyciskiem **Dodaj nowy**) lub *Model has N error(s)* z przyciskiem **Show details**, który wypisuje wszystkie problemy (komunikaty solvera są obecnie wyświetlane po angielsku). Zobacz [Rozwiązywanie problemów](/pl/reference/troubleshooting).

## Dolny pasek

Sześć zakładek, każda z licznikiem, paskiem narzędzi i edytowalną tabelą. Przeciągnij linię podziału nad paskiem, aby zmienić jego rozmiar, lub zminimalizuj go przyciskiem po prawej.

| Zakładka | Pasek narzędzi | Tabela |
| --- | --- | --- |
| **Węzły** | Dodaj węzeł (okno dialogowe), Dodaj myszą | Etykieta, X, Z, pola wyboru **Podparte stopnie swobody**, obciążenia węzła, usuń |
| **Elementy** | Dodaj element (okno dialogowe), Dodaj myszą | Etykieta, typ, węzeł początkowy/końcowy (+ *Zamień kolejność węzłów*), materiał, przekrój, **Przeguby końcowe**, obciążenia elementu, macierz sztywności, usuń |
| **Obciążenia** | Dodaj obciążenie węzłowe, Dodaj obciążenie elementu | Typ, miejsce przyłożenia, edytowalne składowe, usuń |
| **Materiały** | Dodaj materiał, Biblioteka materiałów | Etykieta, E, G, α<sub>T</sub>, usuń |
| **Przekroje** | Dodaj przekrój, Biblioteka przekrojów | Etykieta, A, I<sub>y</sub>, h, k, usuń |
| **Wyniki** | Przełącznik Wyniki węzłowe / Wyniki elementów | Przemieszczenia i kąty obrotu węzłów albo siły końcowe elementów |

Komórki edytuje się w miejscu — kliknij, wpisz, naciśnij <kbd>Enter</kbd> (lub <kbd>Esc</kbd>, aby opuścić komórkę). Wartości są wyświetlane i wprowadzane w [bieżących jednostkach](/pl/essentials/units-settings).

## Zakładki nad widokiem

Zakładka **Widok** jest zawsze obecna. Otwarcie ustawień dodaje obok niej zamykalną zakładkę **Ustawienia**, dzięki czemu możesz zmieniać kolory lub jednostki, patrząc na model.

## Okna pływające

Niektóre akcje otwierają przeciągalne okna nad widokiem: **Macierz sztywności** (z menu podręcznego elementu lub wiersza tabeli) pokazuje macierz sztywności elementu 6 × 6 w układzie lokalnym i globalnym; **Edytuj** w menu płótna otwiera tabelę bieżącego zaznaczenia. Zamykasz je przyciskiem ×.
