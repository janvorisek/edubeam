# Import, eksport i udostępnianie

Wszystko w <Edubeam /> dzieje się w Twojej przeglądarce. Nic nie jest wysyłane na serwer: link do udostępniania dosłownie zawiera model.

## Zapis projektu {#save-a-project}

**☰ → Zapisz projekt** lub <kbd>Ctrl</kbd>+<kbd>S</kbd> pobiera plik `project.json`. Zawiera on węzły, elementy, materiały, przekroje (z kształtami wielokątnymi), obciążenia, linie wymiarowe oraz wersję aplikacji, która go zapisała. Nazwę pliku możesz dowolnie zmienić.

## Otwieranie projektu {#open-a-project}

- **☰ → Otwórz projekt** lub <kbd>Ctrl</kbd>+<kbd>O</kbd>, a następnie wybierz plik `.json`, albo
- **przeciągnij plik w dowolne miejsce okna aplikacji**.

Otwarcie zastępuje bieżący model, łącznie z materiałami i przekrojami. Model, który miałeś, nie przepada: <kbd>Ctrl</kbd>+<kbd>Z</kbd> go przywraca, a ponadto jest on przechowywany w [Ostatnich modelach](#recent-structures). Plik, który nie jest projektem EduBeam, zostanie odrzucony z komunikatem, a Twój model pozostanie bez zmian.

Pliki projektów ze wszystkich wcześniejszych wersji EduBeam otwierają się w obecnej.

## Udostępnianie linku {#share-a-link}

**Udostępnij model** (na pasku aplikacji lub w menu ☰) otwiera okno *Udostępnij model przez URL*:

![Okno udostępniania](/screenshots/pl/share.webp){.shot-lg}

- **Kopiuj** kopiuje link do schowka. To samo robi kliknięcie w pole.
- **Otwórz link** otwiera go w nowej karcie, abyś mógł sprawdzić, co zobaczy odbiorca.
- **Udostępnij przez systemowe okno dialogowe** przekazuje link do systemowego menu udostępniania urządzenia, jeśli przeglądarka to obsługuje.

Link ma postać `https://run.edubeam.app/?model=…` i koduje cały model. Każdy, kto go otworzy, dostaje własną kopię do edycji; zmiany **nie** są synchronizowane z powrotem, więc gdy model się zmieni, wyślij nowy link. Bardzo duże modele dają bardzo długie linki; w takim przypadku udostępnij plik JSON.

Gdy ktoś otworzy link, jego dotychczasowy model trafia do Ostatnich modeli, a komunikat informuje, gdzie go znaleźć.

Linki ze starszych wersji nadal działają: link w zeszłorocznych materiałach do wykładu otworzy dziś ten sam model.

## Eksport obrazu {#export-an-image}

**☰ → Eksportuj obraz** lub <kbd>Ctrl</kbd>+<kbd>P</kbd> otwiera eksport obrazu.

![Eksportuj obraz: wybierz warstwy, kadr i rozmiar, a potem pobierz lub skopiuj](/screenshots/pl/export-image.webp)

- **Warstwy**: plakietki u góry wybierają, co jest rysowane, niezależnie od widoku: kształt odkształcony, N, V, M, reakcje, podpory, obciążenia, etykiety węzłów i elementów.
- **Kadr**: wybierz proporcje (16:9, 4:3, 3:2, 1:1), **Pokaż wszystko** lub **Okno…**, aby zaznaczyć prostokąt na rysunku. Możesz też przeciągać krawędzie podglądu.
- **Rozmiar**: szerokość i wysokość w pikselach albo **Skala**, np. 1 : 50, dla rysunku w skali na papierze. **Wysokość wykresów** ustala rozmiar wykresów wyników na obrazie. **Przezroczyste tło** pomija białe tło.
- **Pobierz PNG**, **Pobierz SVG** lub **Kopiuj do schowka**.

SVG pozostaje ostre w każdym rozmiarze i działa w Wordzie, Inkscape i LaTeX-u na Overleaf, dlatego jest najlepszym wyborem do sprawozdań i prac dyplomowych.

## Eksport wyników {#export-the-results}

**Wyniki → Eksportuj CSV** pobiera obie tabele wyników, łącznie z reakcjami, a **Kopiuj** umieszcza je w schowku do wklejenia w arkuszu kalkulacyjnym. Zobacz [Eksport CSV i kopiowanie](/pl/essentials/results#export-csv-and-copy).

## Ostatnie modele {#recent-structures}

**☰ → Ostatnie modele** przechowuje 10 ostatnich modeli, które zostały wyczyszczone lub zastąpione linkiem, plikiem, przykładem albo zadaniem z pierwszą belką. Każdy ma miniaturę, powód zastąpienia i rozmiar. **Przywróć** przywraca wybrany model; model, który miałeś w tej chwili, trafia z kolei na listę, a <kbd>Ctrl</kbd>+<kbd>Z</kbd> cofa przywrócenie.

![Ostatnie modele](/screenshots/pl/recent.webp){.shot-lg}

Lista jest przechowywana tylko w tej przeglądarce.

## Przykłady {#examples}

**☰ → Przykłady** otwiera galerię gotowych modeli dydaktycznych. Otwarcie jednego z nich zastępuje Twój model, a <kbd>Ctrl</kbd>+<kbd>Z</kbd> go przywraca. Te same modele, wraz z ćwiczeniami, znajdziesz na stronie [Przykłady](/pl/examples/) tej dokumentacji.

![Galeria przykładów](/screenshots/pl/examples.webp){.shot-lg}

## Osadzanie podglądu {#embed-a-read-only-viewer}

Dodaj `&viewer=1` do linku do udostępniania, aby otworzyć model w **trybie podglądu**. Pasek aplikacji, dolny pasek, zakładki, cofanie i ponawianie, przełączniki siatki i wskaźnik osi są ukryte; zostaje płótno, przyciski dopasowania i wyśrodkowania oraz opcje wyświetlania. Umieść ten adres URL w `<iframe>`, aby osadzić interaktywny model z możliwością powiększania w materiałach do wykładu lub na stronie WWW:

```html
<iframe src="https://run.edubeam.app/?viewer=1&model=…" width="100%" height="400"></iframe>
```

![Rama trójprzegubowa w trybie podglądu](/screenshots/pl/viewer-mode.webp){.shot-lg}

Tryb podglądu służy do oglądania, ale nie jest zablokowany: odwiedzający mogą nadal przeciągać węzły i przełączać wykresy. Otwarcie linku w trybie podglądu również zastępuje własny model odwiedzającego w tej przeglądarce (trafia on do Ostatnich modeli), tak jak zwykły link.

## Parametry URL {#url-parameters}

| Parametr | Działanie |
| --- | --- |
| `model=<data>` | Wczytuje zakodowany model i dopasowuje go do ekranu. |
| `viewer=1` | Tryb podglądu (zobacz wyżej). |
| `lang=<code>` | Przełącza język interfejsu: `en`, `cs`, `de`, `fr`, `es`, `pt`, `pl`, `cn`, `th`, `uk`, `ru`, `tr`. |
| `panel=examples` | Od razu otwiera galerię przykładów. |

Po ich odczytaniu EduBeam usuwa parametry z paska adresu.

## Automatyczne zapisywanie {#automatic-persistence}

Bieżący model i Twoje ustawienia są zapisywane w pamięci lokalnej przeglądarki po każdej zmianie i przywracane, gdy wrócisz, nawet po zamknięciu przeglądarki. To wygoda, a nie kopia zapasowa: należy do jednego profilu przeglądarki na jednym urządzeniu, a wyczyszczenie danych witryny ją usuwa. Ważną pracę zapisuj jako plik projektu.

## Format pliku projektu {#project-file-format}

`project.json` to zwykły, czytelny JSON:

```json
{
  "edubeam": true,
  "version": "1.3.1",
  "domain": {
    "materials": [{ "label": "1", "e": 210000000000, "g": 81000000000, "alpha": 0.000012, "d": 7850 }],
    "crossSections": [{ "label": "1", "a": 0.00285, "iy": 1.943e-5, "h": 0.2, "k": 1 }],
    "nodes": [
      { "label": "1", "coords": [0, 0, 0], "bcs": [0, 2] },
      { "label": "2", "coords": [6, 0, 0], "bcs": [2] }
    ],
    "elements": [{ "label": "1", "nodes": ["1", "2"], "mat": "1", "cs": "1", "hinges": [false, false] }],
    "loadCases": [
      {
        "label": "1",
        "nodalLoads": [],
        "elementLoads": [{ "type": "udl", "target": "1", "lcs": false, "values": [0, 12000] }],
        "prescribedBC": []
      }
    ]
  },
  "dimensions": []
}
```

To belka z szybkiego startu. Wszystkie wartości są w **jednostkach SI** (m, N, Pa, rad), niezależnie od jednostek wyświetlania. Współrzędne to `[x, y, z]`, przy czym y jest zawsze 0. Warunki brzegowe i składowe obciążeń używają identyfikatorów stopni swobody `0 = Dx`, `2 = Dz`, `4 = Ry`.

| `type` obciążenia elementu | Wartości |
| --- | --- |
| `udl` | `values: [fx, fz]` w N/m |
| `trapezoidal` | `startValues: [f1x, f1z]`, `endValues: [f2x, f2z]` w N/m, osie lokalne |
| `concentrated` | `values: [Fx, Fz, My, a]` w N, N·m oraz m od węzła początkowego |
| `temperature` | `values: [ΔTc, ΔTb, ΔTt]` w K; gradient to ΔTb − ΔTt |

Obciążenia węzłowe mają postać `{ "target": "2", "values": { "0": Fx, "2": Fz, "4": My } }`, a zadane przemieszczenia `{ "target": "2", "prescribedValues": { "0": Dx, "2": Dz, "4": Ry } }`; podaj wszystkie trzy składowe. Pliki zapisane przez aplikację zawierają też `date`, `commit`, węzłowe `lcs` i kształty wielokątne `shape`.

Ponieważ format jest prosty, możesz generować modele skryptem lub w arkuszu kalkulacyjnym i otwierać je przez **Otwórz projekt**.
