# Najczęściej zadawane pytania

## Ogólne {#general}

### Czym jest EduBeam? {#what-is-edubeam}

To darmowy, otwartoźródłowy program działający w przeglądarce, który rozwiązuje płaskie belki, ramy i kratownice. Jest przeznaczony dla studentów, wykładowców i inżynierów, którzy chcą natychmiastowej informacji zwrotnej. Zobacz [Wprowadzenie](/pl/guide/introduction).

### Czy naprawdę jest darmowy? Czy potrzebuję konta? {#is-it-really-free-do-i-need-an-account}

Tak i nie. Otwórz [run.edubeam.app](https://run.edubeam.app/?lang=pl) i zacznij modelować. Nie ma kont, instalatorów ani limitów użycia. Kod źródłowy jest na [GitHubie](https://github.com/janvorisek/edubeam).

### Na jakich przeglądarkach i urządzeniach działa? {#which-browsers-and-devices-work}

Na każdej aktualnej wersji Chrome, Edge, Firefox lub Safari. Działa też na tabletach i telefonach: stuknij, aby zaznaczyć lub wstawić, przeciągnij węzeł, aby go przesunąć, przeciągnij w innym miejscu, aby przesunąć widok, rozsuń palce, aby powiększyć, i przytrzymaj palec, aby otworzyć menu płótna. Z myszą i klawiaturą modelowanie idzie jednak szybciej. Zobacz [Klawiatura, mysz i dotyk](/pl/reference/shortcuts#touch).

### Straciłem model. Czy mogę go odzyskać? {#i-lost-my-model-can-i-get-it-back}

Prawdopodobnie tak. Wyczyszczenie modelu albo otwarcie na nim linku, pliku lub przykładu zachowuje stary model w **☰ → Ostatnie modele** (10 ostatnich), a <kbd>Ctrl</kbd>+<kbd>Z</kbd> cofa zastąpienie. Jedno i drugie jest przechowywane tylko w Twojej przeglądarce.

### Czy mogę używać go offline? {#can-i-use-it-offline}

EduBeam jest progresywną aplikacją webową (PWA): raz wczytany działa dalej bez połączenia, a przeglądarka może zaproponować jego instalację. Gdy dostępna jest nowa wersja, przed aktualizacją pojawia się okno z pytaniem.

### Gdzie są przechowywane moje dane? {#where-is-my-data-stored}

Tylko w Twojej przeglądarce. Modele nigdy nie są wysyłane na serwer; link do udostępniania *jest* modelem. Zobacz [Import, eksport i udostępnianie](/pl/essentials/import-export).

## Modelowanie {#modelling}

### Jak zrobić utwierdzenie, podporę przegubową nieprzesuwną lub przesuwną? {#how-do-i-make-a-fixed-pinned-roller-support}

Kliknij węzeł, otwórz **Podpory węzła** i wybierz symbol: przegub, przegub przesuwny, utwierdzenie, utwierdzenie przesuwne i inne. Możesz też zaznaczyć stopnie swobody: **Dx + Dz + Ry** = utwierdzenie, **Dx + Dz** = podpora przegubowa nieprzesuwna, **Dz** = podpora przegubowa przesuwna. Wszystkie kombinacje wymieniono na stronie [Węzły i podpory](/pl/essentials/nodes-supports#supports).

### Jak zrobić kratownicę? {#how-do-i-make-a-truss}

Użyj elementów belkowych i zaznacz w zakładce *Elementy* **oba Przeguby końcowe** dla każdego pręta albo zaznacz *Przegub na początku* i *Przegub na końcu* na pasku u góry przed rysowaniem prętów myszą. Obciążenia przykładaj w węzłach. Przez cały proces prowadzi [samouczek o kratownicy](/pl/tutorials/truss).

### Jak wstawić przegub do ramy? {#how-do-i-put-a-hinge-in-a-frame}

Zaznacz **przegub końcowy** elementu po tej stronie węzła, po której moment ma zostać zwolniony. Przegub na *jednym* elemencie w węźle zwalnia tylko ten element.

### Jak dodać podporę lub siłę skupioną w środku belki? {#how-do-i-add-a-support-or-a-point-load-in-the-middle-of-a-beam}

Dodaj węzeł na belce przez *Dodaj myszą* i wybierz **Połącz z konstrukcją** — belka zostanie podzielona na dwie części. Do samej siły skupionej nie potrzebujesz nawet węzła: użyj obciążenia elementu typu **Obciążenie skupione** z podaną pozycją.

### Czy można przyłożyć ciężar własny? {#can-i-apply-self-weight}

Nie automatycznie. Wprowadź go jako obciążenie równomiernie rozłożone $f_z = \rho g A$.

### Czy można modelować podpory ukośne? {#can-i-model-inclined-supports}

Tak — ustaw w węźle **Kąt lokalnego układu**; jego stopnie swobody są wtedy interpretowane w obróconym układzie.

### Czy są przypadki lub kombinacje obciążeń? {#are-there-load-cases-or-combinations}

Nie, jest tylko jeden przypadek obciążenia. Każdy przypadek modeluj osobno i zapisz lub udostępnij.

### Dlaczego moje obciążenia są skierowane w górę? {#why-do-my-loads-point-up}

Ponieważ globalna oś z jest skierowana **w dół**: dodatnie `Fz` działa w dół. Zobacz [konwencje](/pl/elements/conventions). Jeśli wolisz oś pionową skierowaną w górę, przełącz się na oś y w górę w *Ustawienia → Język i ustawienia regionalne → Układ współrzędnych*.

## Wyniki {#results}

### Dlaczego nie ma przycisku „Oblicz”? {#why-is-there-no-solve-button}

Model jest rozwiązywany automatycznie po każdej zmianie. Jeśli wyniki się nie pojawiają, modelu nie da się jeszcze rozwiązać — strona [Rozwiązywanie problemów](/pl/reference/troubleshooting) wymienia, co sprawdzić.

### Dlaczego moje ugięcie nieco różni się od wzoru? {#why-does-my-deflection-differ-slightly-from-the-formula}

EduBeam używa belek Timoshenki, więc ugięcia uwzględniają odkształcenie postaciowe od ścinania. Dla prętów smukłych różnica jest znacznie mniejsza niż 1 %. Szczegóły i rozwiązane porównania znajdziesz na stronie [Sprawdzanie wyników ręcznie](/pl/guide/verification).

### Jak dokładne są wyniki? Czy potrzebuję więcej elementów? {#how-accurate-are-the-results-do-i-need-more-elements}

W liniowej analizie statycznej element belkowy jest dokładny dla obsługiwanych typów obciążeń, więc jeden element na pręt wystarczy. Dodatkowe węzły są potrzebne tylko tam, gdzie chcesz umieścić podporę, przegub, zmianę przekroju lub węzeł, do którego przyłożysz obciążenie.

### Gdzie znajdę reakcje? {#where-are-the-reactions-listed}

W widoku, jako strzałki z wartościami (**Reakcje** w opcjach wyświetlania, domyślnie włączone). Są też w pliku z **Wyniki → Eksportuj CSV** oraz w **Kopiuj**. Przemieszczenia węzłów i siły końcowe elementów znajdziesz w zakładce **Wyniki**.

## Pliki i udostępnianie {#files-sharing}

### Jak udostępnić model? {#how-do-i-share-a-model}

**Udostępnij model** → **Kopiuj**. Link zawiera cały model. Odbiorcy dostają własną kopię do edycji; nie ma współpracy na żywo. Zobacz też [Nauczanie z EduBeam](/pl/guide/teaching).

### Czy mogę osadzić model na swojej stronie lub w prezentacji? {#can-i-embed-a-model-on-my-website-or-in-slides}

Tak: dodaj `&viewer=1` do linku do udostępniania i umieść go w `<iframe>`. Zobacz [Osadzanie podglądu](/pl/essentials/import-export#embed-a-read-only-viewer).

### Czy mogę eksportować obrazy lub tabele? {#can-i-export-images-or-tables}

Tak. **☰ → Eksportuj obraz** (<kbd>Ctrl</kbd>+<kbd>P</kbd>) zapisuje rysunek jako PNG lub SVG w wybranym rozmiarze lub skali. **Wyniki → Eksportuj CSV** zapisuje obie tabele wyników, a **Kopiuj** umieszcza je w schowku do wklejenia w arkuszu kalkulacyjnym. Zobacz [Import, eksport i udostępnianie](/pl/essentials/import-export#export-an-image).

### Czy mogę generować modele programowo? {#can-i-generate-models-programmatically}

Tak. Plik projektu to zwykły JSON w jednostkach SI — zobacz [opis formatu](/pl/essentials/import-export#project-file-format) — i można go otworzyć przez *Otwórz projekt* lub przeciągając go na okno aplikacji.

## Wsparcie {#support}

### Jak zgłosić błąd lub zaproponować funkcję? {#how-do-i-report-a-bug-or-request-a-feature}

Utwórz zgłoszenie na [GitHubie](https://github.com/janvorisek/edubeam/issues) i dołącz link do udostępniania lub plik projektu, który odtwarza problem. Wsparcie prywatne: [support@edubeam.app](mailto:support@edubeam.app).
