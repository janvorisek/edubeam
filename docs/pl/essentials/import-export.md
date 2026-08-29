# Import, eksport i udostępnianie

Wszystko w <Edubeam /> dzieje się w Twojej przeglądarce. Nic nie jest wysyłane na serwer — link do udostępnienia dosłownie zawiera model.

## Zapisywanie projektu

**Menu ☰ → Zapisz projekt** lub <kbd>Ctrl</kbd>+<kbd>S</kbd> pobiera plik `project.json`. Zawiera on węzły, elementy, materiały, przekroje, obciążenia, linie wymiarowe oraz wersję aplikacji, która go zapisała. Plik możesz dowolnie przemianować.

## Otwieranie projektu

- **Menu ☰ → Otwórz projekt** lub <kbd>Ctrl</kbd>+<kbd>O</kbd>, a potem wybierz plik `.json`, albo
- **przeciągnij plik w dowolne miejsce okna aplikacji**.

Otwarcie zastępuje bieżący model (łącznie z materiałami i przekrojami). Jeśli chcesz go zachować, najpierw użyj **Zapisz projekt**.

## Udostępnianie linku

**Udostępnij model** (🔗 na pasku aplikacji lub w menu ☰) otwiera okno *Udostępnij model przez URL*:

- **Kopiuj link** — kopiuje link do schowka (lub kliknij w polu).
- **Otwórz link** — otwiera go w nowej karcie, abyś mógł sprawdzić, co zobaczy odbiorca.
- **Udostępnij przez systemowe okno dialogowe** — na telefonach i tabletach przekazuje link do systemowego arkusza udostępniania.

Link ma postać `https://run.edubeam.app/?model=…` i koduje cały model (węzły, elementy, właściwości, obciążenia). Kto go otworzy, dostaje dokładną kopię do lokalnej edycji; zmiany **nie** są synchronizowane zwrotnie — gdy model się zmieni, wyślij nowy link. Bardzo duże modele dają bardzo długie linki; w takim przypadku udostępnij zamiast tego plik JSON.

## Osadzanie widoku tylko do odczytu

Dodaj `&viewer=1` do linku udostępniania (lub `?viewer=1` do dowolnego adresu aplikacji), aby otworzyć model w **trybie widoku**: pasek aplikacji, dolny pasek, cofnij/ponów i panel ustawień są ukryte, zostaje tylko płótno z bieżącym modelem. Umieść ten adres w `<iframe>`, aby osadzić żywy, powiększalny model w notatkach z wykładu lub na stronie WWW:

```html
<iframe src="https://run.edubeam.app/?viewer=1&model=…" width="100%" height="400"></iframe>
```

Strona [Przykłady](/pl/examples/) jest zbudowana właśnie tak — każda karta to link z parametrem `?model=`.

## Parametry adresu URL

| Parametr | Efekt |
| --- | --- |
| `model=<dane>` | Wczytuje zakodowany model, dopasowuje go do ekranu, a następnie usuwa parametr z paska adresu. |
| `lang=<kod>` | Przełącza język interfejsu (`en`, `cs`, `de`, `fr`, `es`, `pt`, `pl`, `cn`, `th`, `uk`, `ru`). |
| `viewer=1` | Tryb widoku tylko do odczytu (zobacz wyżej). |

## Automatyczne zapisywanie

Bieżący model i Twoje ustawienia są zapisywane w pamięci lokalnej przeglądarki po każdej zmianie i przywracane po powrocie — nawet po zamknięciu przeglądarki. To udogodnienie, nie kopia zapasowa: jest powiązane z jednym profilem przeglądarki na jednym urządzeniu, a wyczyszczenie danych witryny je usuwa. Ważną pracę zapisuj jako plik projektu.

## Format pliku projektu

`project.json` to zwykły, czytelny JSON:

```json
{
  "edubeam": true,
  "version": "1.0.6",
  "domain": {
    "materials": [ { "label": "1", "e": 210000000000, "g": 81000000000, "alpha": 0.000012, "d": 7850 } ],
    "crossSections": [ { "label": "1", "a": 0.00285, "iy": 1.943e-5, "h": 0.2, "k": 1 } ],
    "nodes": [ { "label": "1", "coords": [0, 0, 0], "bcs": [0, 2] }, … ],
    "elements": [ { "label": "1", "nodes": ["1", "2"], "mat": "1", "cs": "1", "hinges": [false, false] } ],
    "loadCases": [ … ]
  }
}
```

Wszystkie wartości są przechowywane w **jednostkach SI** (m, N, Pa, rad) niezależnie od jednostek wyświetlania. Warunki brzegowe używają identyfikatorów stopni swobody `0 = Dx`, `2 = Dz`, `4 = Ry`. Ponieważ format jest prosty, możesz generować modele skryptem lub arkuszem kalkulacyjnym i otwierać je przez **Otwórz projekt**. Format nie jest wersjonowany jako stabilne API, więc jeśli automatyzujesz pracę z nim, sprawdzaj pole `version`.
