# Szybki start

W około dziesięć minut zamodelujesz stalową belkę swobodnie podpartą obciążoną równomiernie, odczytasz reakcje, siłę tnącą i moment zginający, a następnie porównasz je ze wzorami z podręcznika.

::: tip Pracuj równolegle
Otwórz [run.edubeam.app](https://run.edubeam.app/?lang=pl){target="_blank"} w drugiej karcie. Jeśli jakiś model jest już wczytany, użyj **Wyczyść model** na pasku aplikacji, aby zacząć od pustego modelu, i zaznacz *Usuń materiały* oraz *Usuń przekroje*, aby zacząć zupełnie od zera. Czyszczenie można cofnąć skrótem <kbd>Ctrl</kbd>+<kbd>Z</kbd>, a stary model pozostaje w **☰ → Ostatnie modele**.

Wolisz uczyć się w praktyce, z podpowiedziami na ekranie? **☰ → Narysuj pierwszą belkę** przeprowadzi Cię myszą przez podobną belkę.
:::

## Zadanie {#the-problem}

<ExampleStructure />

Belka swobodnie podparta o rozpiętości 6 m (po lewej podpora przegubowa nieprzesuwna, po prawej przesuwna) przenosi obciążenie równomiernie rozłożone 12 kN/m. Materiał: stal, $E = 210\ \text{GPa}$, $G = 81\ \text{GPa}$. Przekrój: IPE 200, $A = 28{,}5\ \text{cm}^2$, $I_y = 1943\ \text{cm}^4$, $h = 200\ \text{mm}$.

## 1. Sprawdź jednostki {#_1-check-the-units}

Plakietka jednostek w prawym dolnym rogu widoku pokazuje jednostki, w których działają wszystkie pola wprowadzania i wyniki. Ten samouczek zakłada domyślne jednostki SI: metry, kN, kNm i MPa.

![Przełączniki siatki (G), przyciągania (S) i celownika oraz plakietka jednostek](/screenshots/pl/ui-grid-units.webp){.shot-sm}

Jeśli widzisz `ft · kip · kip·ft · ksi`, kliknij plakietkę i wybierz **Układ jednostek → SI (metryczny)**.

## 2. Dodaj materiał i przekrój {#_2-add-the-material-and-cross-section}

Elementy potrzebują materiału i przekroju, dlatego utwórz je najpierw.

1. Otwórz zakładkę **Materiały** na dolnym pasku i kliknij **Dodaj materiał**.
2. Wpisz `E = 210000` MPa i `G = 81000` MPa. Pozostaw gęstość i `α = 0,000012` 1/K. Kliknij **Dodaj materiał**.

<div class="shots">

![Dodaj materiał: wpisz E i G…](/screenshots/pl/qs-material.webp)

![…albo wybierz Steel (S235) z Biblioteki materiałów](/screenshots/pl/qs-material-library.webp)

</div>

3. Otwórz zakładkę **Przekroje** i kliknij **Dodaj przekrój**.
4. Wpisz `Pole = 0,00285` m², `Iy = 1,943e-5` m⁴, `Wysokość = 0,2` m i `Współczynnik ścinania = 1`. Kliknij **Dodaj przekrój**.

![Dodaj przekrój. Możesz też wybrać go z biblioteki albo narysować kształt wielokątny.](/screenshots/pl/qs-cross-section.webp){.shot-md}

::: details Dlaczego współczynnik ścinania ma znaczenie?
EduBeam używa elementów belkowych Timoshenki, które uwzględniają odkształcenie postaciowe (od ścinania). `k` to współczynnik korekcyjny ścinania: $k \approx 0{,}83$ dla prostokąta i około $0{,}4$–$0{,}5$ dla dwuteownika, jeśli $A$ jest pełnym polem przekroju. Ustawienie `k = 1` przy pełnym polu nieco *zaniża* podatność na ścinanie. Dla smukłej belki, takiej jak ta, różnica w ugięciu jest znacznie mniejsza niż 1 %. Wzór znajdziesz na stronie [teorii belki](/pl/elements/beam).
:::

## 3. Dodaj węzły {#_3-add-the-nodes}

1. Otwórz zakładkę **Węzły**. Ma ona dwa przyciski **Dodaj węzeł**: pierwszy otwiera okno dialogowe, drugi (z ikoną kursora) wstawia węzły myszą. Kliknij pierwszy.
2. Wpisz `X = 0`, `Z = 0` i kliknij **Dodaj węzeł**. Węzeł otrzymuje etykietę `1`.
3. Dodaj drugi węzeł w `X = 6`, `Z = 0`. To węzeł `2`.

![Okno Dodaj węzeł pozwala od razu ustawić także podpory](/screenshots/pl/qs-node.webp){.shot-md}

Jeśli zamiast tego użyjesz przycisku myszy, każde kliknięcie na płótnie wstawi węzeł. Przy włączonym **Przyciągaj do siatki** (<kbd>S</kbd>) kliknięcia trafiają w krok siatki (domyślnie 0,1 m).

## 4. Połącz je elementem {#_4-connect-them-with-an-element}

1. Otwórz zakładkę **Elementy** i kliknij pierwszy przycisk **Dodaj element**.
2. Wybierz **Węzeł początkowy** `1` i **Węzeł końcowy** `2`. Twój materiał i przekrój są już wybrane. Kliknij **Dodaj element**.

![Dodaj element: dwa węzły końcowe, opcjonalne przeguby końcowe, materiał i przekrój](/screenshots/pl/qs-element.webp){.shot-md}

Między węzłami pojawia się linia. Naciśnij <kbd>F</kbd>, aby dopasować ją do ekranu.

## 5. Dodaj podpory {#_5-add-the-supports}

W zakładce **Węzły** kolumna **Podparte stopnie swobody** ma dla każdego węzła menu wyboru symbolu podpory i trzy pola wyboru: `Dx`, `Dz`, `Ry`.

- Węzeł `1`: wybierz symbol **Przegub** albo zaznacz **Dx** i **Dz**.
- Węzeł `2`: wybierz **Przegub przesuwny** albo zaznacz tylko **Dz**.

![Podpory w tabeli Węzły: węzeł 1 podparty przegubowo nieprzesuwnie, węzeł 2 przesuwnie](/screenshots/pl/qs-supports.webp)

Możesz też kliknąć węzeł w widoku i wybrać **Podpory węzła**. Wszystkie typy podpór opisano na stronie [Węzły i podpory](/pl/essentials/nodes-supports#supports).

## 6. Dodaj obciążenie {#_6-add-the-load}

1. Otwórz zakładkę **Obciążenia** i kliknij **Dodaj obciążenie elementu**.
2. **Typ obciążenia**: *Obciążenie równomiernie rozłożone*. **Element**: `1`.
3. Wpisz `fz = 12` kN/m i pozostaw `fx = 0`. Kliknij **Dodaj obciążenie elementu**.

![Okno dialogowe pokazuje podgląd obciążenia na elemencie](/screenshots/pl/qs-load.webp){.shot-md}

Dodatnie `fz` działa w kierunku +z, czyli na ekranie **w dół**, więc dodatnia wartość to obciążenie grawitacyjne. Zobacz [konwencje znaków](/pl/elements/conventions).

## 7. Odczytaj wyniki {#_7-read-the-results}

Rozwiązanie pojawia się, gdy tylko dodasz obciążenie. Panel opcji wyświetlania w prawym górnym rogu widoku włącza i wyłącza poszczególne wykresy. **Kształt odkształcony**, **M<sub>y</sub>(x)** i **Reakcje** są domyślnie włączone. Zaznacz **V<sub>z</sub>(x)**, aby dodać siłę tnącą.

![Siła tnąca (zielona), moment zginający (czerwony), reakcje (fioletowe) i kształt odkształcony](/screenshots/pl/qs-results.webp)

| Warstwa | Co powinno być widoczne |
| --- | --- |
| **Reakcje** | Dwie strzałki skierowane w górę o wartości **36 kN** w węzłach 1 i 2. |
| **V<sub>z</sub>(x)** | Prosta od **+36 kN** po lewej do **−36 kN** po prawej, przechodząca przez zero w środku rozpiętości. |
| **M<sub>y</sub>(x)** | Parabola z ekstremum **54 kNm** w środku rozpiętości. |
| **Kształt odkształcony** | Symetryczne ugięcie. Najedź kursorem na węzeł `1`, aby odczytać jego kąt obrotu: **2,6469 · 10⁻² rad**. |

Liczby podaje zakładka **Wyniki** na dolnym pasku. **Wyniki węzłowe** zawierają `Dx`, `Dz`, `Ry` dla każdego węzła. **Wyniki elementów** zawierają siły końcowe każdego elementu w jego lokalnym układzie współrzędnych.

Jeśli wykresy są za duże lub za małe, zmień **Skala wyników** w **Ustawienia → Ustawienia widoku → Rozmiary**.

## 8. Sprawdź ręcznie {#_8-check-by-hand}

| Wielkość | Wzór | Wartość ręczna | EduBeam |
| --- | --- | --- | --- |
| Reakcja | $R = qL/2$ | 36 kN | 36 kN |
| Maks. siła tnąca | $V = qL/2$ | 36 kN | 36 kN |
| Maks. moment | $M = qL^2/8$ | 54 kNm | 54 kNm |
| Kąt obrotu na podporze | $\varphi = qL^3/(24EI)$ | 0,02647 rad | 0,02647 rad |
| Ugięcie w środku rozpiętości (zginanie) | $w = 5qL^4/(384EI)$ | 49,63 mm | |
| Ugięcie w środku rozpiętości (ścinanie) | $w_s = qL^2/(8kGA)$ | 0,23 mm | |
| Ugięcie w środku rozpiętości (łącznie) | suma | 49,86 mm | 49,86 mm |

W środku rozpiętości nie ma węzła, więc aby odczytać tam ugięcie, dodaj go: wybierz drugi przycisk **Dodaj węzeł**, kliknij na belce w `X = 3` i wybierz **Połącz z konstrukcją**. Belka zostaje podzielona na dwie części, a `Dz` nowego węzła w zakładce **Wyniki** wynosi 49,86 mm. Podział nie zmienia żadnego wyniku, ponieważ element jest dokładny.

Wszystko się zgadza. Więcej przepisów na sprawdzenie ręczne (wspornik, belka obustronnie utwierdzona, kratownica, temperatura) znajdziesz na stronie [Sprawdzanie wyników ręcznie](/pl/guide/verification).

## 9. Eksperymentuj {#_9-experiment}

Tu EduBeam pokazuje swoją siłę. Wypróbuj każdą z poniższych zmian i obserwuj, jak aktualizują się wykresy:

- **Przeciągnij węzeł 2** w prawo: moment rośnie z $L^2$.
- **Zaznacz `Ry` w węźle 1**, aby go utwierdzić: moment w przęśle maleje, a na podporze pojawia się moment ujemny.
- **Zaznacz `Dz` w węźle w środku rozpiętości**, który właśnie dodałeś, aby otrzymać belkę ciągłą dwuprzęsłową.
- **Zaznacz przegub końcowy** elementu w zakładce Elementy, aby zwolnić moment na jednym końcu.
- Naciśnij <kbd>Ctrl</kbd>+<kbd>Z</kbd>, aby cofnąć dowolny krok.

## 10. Zapisz lub udostępnij {#_10-save-or-share}

- **Udostępnij model** (na pasku aplikacji lub w menu ☰) daje link zawierający cały model. Wklej go do e-maila, czatu lub prezentacji.
- **☰ → Zapisz projekt** (<kbd>Ctrl</kbd>+<kbd>S</kbd>) pobiera plik `project.json`, który później otworzysz przez **Otwórz projekt** lub upuszczając go na okno aplikacji.
- **☰ → Eksportuj obraz** (<kbd>Ctrl</kbd>+<kbd>P</kbd>) zapisuje rysunek jako PNG lub SVG do sprawozdania.

Model jest też przechowywany w przeglądarce, więc przeładowanie strony go nie usuwa. Zobacz [Import, eksport i udostępnianie](/pl/essentials/import-export).

## Co dalej {#where-next}

- [Samouczek: rama trójprzegubowa](/pl/tutorials/three-hinged-frame): rama z przegubem wewnętrznym, sprawdzona ręcznie.
- [Przykłady](/pl/examples/): gotowe ramy i kratownice otwierane jednym kliknięciem.
- [Obciążenia](/pl/essentials/loads): obciążenia trapezowe, skupione i termiczne, zadane przemieszczenia.
- [Klawiatura, mysz i dotyk](/pl/reference/shortcuts): pracuj szybciej na płótnie.
