# Najczęściej zadawane pytania

## Ogólne

### Czym jest EduBeam?

Darmowy, otwartoźródłowy, działający w przeglądarce solver do płaskich belek, ram i kratownic, przeznaczony dla studentów, wykładowców i inżynierów, którzy chcą natychmiastowej odpowiedzi. Zobacz [Wprowadzenie](/pl/guide/introduction).

### Czy to naprawdę darmowe? Czy potrzebuję konta?

Tak, i nie. Otwórz [run.edubeam.app](https://run.edubeam.app/?lang=pl) i zacznij modelować. Nie ma kont, instalatorów ani limitów użycia. Kod źródłowy jest na [GitHubie](https://github.com/janvorisek/edubeam).

### Jakie przeglądarki i urządzenia są obsługiwane?

Dowolna aktualna wersja Chrome, Edge, Firefox lub Safari. Tablety i telefony działają (stuknięcie, przeciąganie do przesuwania widoku, szczypanie do powiększania, przytrzymanie do przesunięcia węzła), ale mysz i klawiatura znacznie przyspieszają modelowanie.

### Czy mogę korzystać offline?

EduBeam to progresywna aplikacja webowa (PWA): raz wczytana działa dalej bez połączenia, a przeglądarka może zaproponować jej instalację. Gdy dostępna jest nowa wersja, okno dialogowe pyta przed aktualizacją.

### Gdzie są przechowywane moje dane?

Tylko w Twojej przeglądarce. Modele nigdy nie są wysyłane na serwer; link do udostępnienia *jest* modelem. Zobacz [Import, eksport i udostępnianie](/pl/essentials/import-export).

## Modelowanie

### Jak zrobić utwierdzenie / podporę przegubową nieprzesuwną / przesuwną?

Zaznacz pola stopni swobody: **Dx + Dz + Ry** = utwierdzenie, **Dx + Dz** = podpora przegubowa nieprzesuwna, **Dz** = podpora przegubowa przesuwna. Każda kombinacja i jej symbol są wymienione na stronie [Węzły i podpory](/pl/essentials/nodes-supports#podpory).

### Jak zrobić kratownicę?

Użyj elementów belkowych i zaznacz **oba przeguby końcowe** dla każdego pręta w zakładce *Elementy*. Obciążenia przykładaj w węzłach. Zobacz [Elementy](/pl/essentials/elements#przeguby-koncowe).

### Jak umieścić przegub w ramie?

Zaznacz **przegub końcowy** elementu po tej stronie węzła, po której moment ma być zwolniony. Zwolnienie *jednego* elementu w węźle zwalnia tylko ten element.

### Jak dodać podporę lub siłę skupioną w środku belki?

Dodaj węzeł na belce przez *Dodaj myszą* i wybierz **Połącz z konstrukcją** — belka zostanie podzielona na dwie. Dla samej siły skupionej węzeł nie jest nawet potrzebny: użyj obciążenia elementu typu **Obciążenie skupione** z podaną pozycją.

### Czy mogę uwzględnić ciężar własny?

Nie automatycznie. Wpisz go jako obciążenie równomiernie rozłożone $f_z = \rho g A$.

### Czy mogę modelować podpory ukośne?

Tak — ustaw **Kąt lokalnego układu** w węźle; jego stopnie swobody są wtedy interpretowane w obróconym układzie.

### Czy są przypadki lub kombinacje obciążeń?

Nie, tylko jeden przypadek obciążenia. Każdy przypadek modeluj osobno i zapisz lub udostępnij.

### Dlaczego moje obciążenia działają do góry?

Ponieważ globalna oś z jest skierowana **w dół**: dodatnie `Fz` działa w dół. Zobacz [konwencje znaków](/pl/elements/conventions).

## Wyniki

### Dlaczego nie ma przycisku „Oblicz”?

Model jest rozwiązywany automatycznie po każdej zmianie. Jeśli wyniki się nie pojawiają, model nie jest jeszcze rozwiązywalny — strona [Rozwiązywanie problemów](/pl/reference/troubleshooting) wymienia, co sprawdzić.

### Dlaczego moje ugięcie nieznacznie różni się od wzoru?

EduBeam używa belek Timoshenki, więc ugięcia uwzględniają odkształcenie od ścinania. Dla prętów smukłych różnica jest znacznie mniejsza niż 1 %. Szczegóły i porównania na stronie [Sprawdzanie wyników ręcznie](/pl/guide/verification).

### Jak dokładne są wyniki? Czy potrzebuję więcej elementów?

W liniowej analizie statycznej element belkowy jest dokładny dla obsługiwanych typów obciążeń, więc jeden element na pręt wystarczy. Dodatkowe węzły są potrzebne tylko tam, gdzie chcesz mieć podporę, przegub, zmianę przekroju lub węzeł do przyłożenia obciążenia.

### Gdzie są wypisane reakcje?

W widoku, jako strzałki z wartościami (włącz **Reakcje** w ustawieniach wyświetlania). Siły końcowe elementów i przemieszczenia węzłów znajdują się w zakładce **Wyniki**.

## Pliki i udostępnianie

### Jak udostępnić model?

**Udostępnij model** → **Kopiuj link**. Link zawiera cały model. Odbiorcy dostają własną kopię do edycji; nie ma współpracy na żywo.

### Czy mogę osadzić model na swojej stronie lub w prezentacji?

Tak — dodaj `&viewer=1` do linku udostępniania i umieść go w `<iframe>`. Zobacz [Osadzanie widoku tylko do odczytu](/pl/essentials/import-export#osadzanie-widoku-tylko-do-odczytu).

### Czy mogę eksportować obrazy lub tabele?

Jeszcze nie. Do obrazów użyj zrzutu ekranu, a liczby skopiuj jako tekst tabeli. Zagłosuj na tę funkcję na [GitHubie](https://github.com/janvorisek/edubeam/issues).

### Czy mogę generować modele programowo?

Tak. Plik projektu to zwykły JSON w jednostkach SI — zobacz [opis formatu](/pl/essentials/import-export#format-pliku-projektu) — i można go otworzyć przez *Otwórz projekt* lub przeciągnięcie na okno.

## Wsparcie

### Jak zgłosić błąd lub zaproponować funkcję?

Otwórz zgłoszenie na [GitHubie](https://github.com/janvorisek/edubeam/issues) i dołącz link do udostępnienia lub plik projektu odtwarzający problem. Wsparcie prywatne: [support@edubeam.app](mailto:support@edubeam.app).
