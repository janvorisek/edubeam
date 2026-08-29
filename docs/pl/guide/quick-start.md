# Szybki start

W około dziesięć minut zamodelujesz stalową belkę swobodnie podpartą obciążoną równomiernie, odczytasz reakcje podporowe, siłę poprzeczną i moment zginający, a następnie porównasz je ze wzorami z podręcznika.

::: tip Pracuj równolegle
Otwórz [run.edubeam.app](https://run.edubeam.app/?lang=pl){target="_blank"} w drugiej karcie. Jeśli jakiś model jest już wczytany, użyj **Wyczyść model** (ikona kosza na pasku aplikacji), aby zacząć od zera — zaznacz *Usuń materiały* i *Usuń przekroje*, by wyczyścić wszystko.
:::

## Zadanie

<ExampleStructure />

Belka swobodnie podparta o rozpiętości 6 m (po lewej podpora przegubowa nieprzesuwna, po prawej przesuwna) przenosi obciążenie równomiernie rozłożone 12 kN/m. Materiał: stal, $E = 210\ \text{GPa}$, $G = 81\ \text{GPa}$. Przekrój IPE 200: $A = 28{,}5\ \text{cm}^2$, $I_y = 1943\ \text{cm}^4$, $h = 200\ \text{mm}$.

## 1. Sprawdź jednostki

Spójrz na plakietkę jednostek w prawym dolnym rogu widoku (np. `m · m² · kN · kNm · MPa`). W tych jednostkach wyświetlane są wszystkie pola wprowadzania i wyniki. Domyślnie są to metry, kN, kNm i MPa — i takie zakłada ten samouczek. Aby je zmienić, kliknij plakietkę lub otwórz **Ustawienia → Język i ustawienia regionalne**.

## 2. Dodaj materiał i przekrój

Element nie może istnieć bez materiału i przekroju, dlatego utwórz je najpierw.

1. Otwórz zakładkę **Materiały** na dolnym pasku i kliknij **Dodaj materiał**.
2. Wpisz `E = 210000` MPa, `G = 81000` MPa, pozostaw gęstość i `α = 0,000012` 1/K. Kliknij **Dodaj materiał**.
   *(Możesz też kliknąć **Biblioteka materiałów** i wybrać **Steel (S235)** — ma dokładnie te wartości.)*
3. Otwórz zakładkę **Przekroje** i kliknij **Dodaj przekrój**.
4. Wpisz `Pole = 0,00285` m², `Iy = 1,943e-5` m⁴, `Wysokość = 0,2` m, `Współczynnik ścinania = 1`. Kliknij **Dodaj przekrój**.

::: details Dlaczego współczynnik ścinania ma znaczenie?
EduBeam używa elementów belkowych Timoshenki, które uwzględniają odkształcenie postaciowe (od ścinania). `k` to współczynnik korekcyjny ścinania ($k \approx 0{,}83$ dla prostokąta, $\approx 0{,}4$–$0{,}5$ dla środnika dwuteownika, jeśli $A$ jest pełnym polem przekroju). Ustawienie `k = 1` przy pełnym polu nieco *zaniża* podatność na ścinanie; dla smukłej belki, takiej jak ta, różnica w ugięciu jest znacznie mniejsza niż 1 %. Wzór znajdziesz na stronie [teorii belki](/pl/elements/beam).
:::

## 3. Dodaj węzły

1. Otwórz zakładkę **Węzły** i kliknij **Dodaj węzeł**. Wpisz `X = 0`, `Z = 0` i potwierdź. Węzeł otrzymuje etykietę `1`.
2. Kliknij ponownie **Dodaj węzeł** z `X = 6`, `Z = 0`. To węzeł `2`.

Węzły można też stawiać myszą: wybierz **Dodaj myszą** (lub kliknij prawym przyciskiem na płótnie → *Dodaj węzeł* z wciśniętym <kbd>Ctrl</kbd>) i kliknij na siatce. Przy włączonym **Przyciągaj do siatki** (<kbd>S</kbd>) kliknięcia trafiają w wielokrotności 0,1 m.

## 4. Połącz je elementem

1. Otwórz zakładkę **Elementy** i kliknij **Dodaj element**.
2. Wybierz **Węzeł początkowy** `1`, **Węzeł końcowy** `2`. Utworzony materiał i przekrój są już wybrane. Potwierdź.

Między węzłami pojawia się czarna linia. Naciśnij <kbd>F</kbd>, aby dopasować konstrukcję do ekranu.

## 5. Dodaj podpory

W zakładce **Węzły** kolumna **Podparte stopnie swobody** ma trzy pola wyboru dla każdego węzła: `Dx`, `Dz`, `Ry`.

- Węzeł `1`: zaznacz **Dx** i **Dz** → pojawia się symbol podpory przegubowej nieprzesuwnej.
- Węzeł `2`: zaznacz tylko **Dz** → podpora przegubowa przesuwna.

Te same pola wyboru znajdziesz po kliknięciu węzła w widoku i wybraniu **Podpory węzła**. Wszystkie typy podpór opisano na stronie [Węzły i podpory](/pl/essentials/nodes-supports).

## 6. Dodaj obciążenie

1. Otwórz zakładkę **Obciążenia** i kliknij **Dodaj obciążenie elementu**.
2. **Typ obciążenia**: *Obciążenie równomiernie rozłożone*. **Element**: `1`.
3. Wpisz `fz = 12` kN/m i pozostaw `fx = 0`. Potwierdź.

Dodatnie `fz` działa w kierunku +z, czyli na ekranie **w dół** — dodatnia wartość to zatem obciążenie grawitacyjne. Zobacz [konwencje znaków](/pl/elements/conventions).

## 7. Odczytaj wyniki

Rozwiązanie pojawia się w chwili dodania obciążenia. Otwórz panel ustawień widoku (przycisk koła zębatego w prawym górnym rogu widoku), aby włączać i wyłączać poszczególne warstwy:

| Warstwa | Co powinno być widoczne |
| --- | --- |
| **Reakcje** | Dwie strzałki skierowane w górę o wartości **36 kN** w węzłach 1 i 2. |
| **V<sub>z</sub> (x)** | Prosta od **+36 kN** po lewej do **−36 kN** po prawej, przechodząca przez zero w środku rozpiętości. |
| **M<sub>y</sub> (x)** | Parabola z ekstremum **54 kNm** w środku rozpiętości. |
| **Kształt odkształcony** | Symetryczne ugięcie. Najedź na węzeł `1`, aby odczytać jego kąt obrotu: około **0,0265 rad**. |

Zakładka **Wyniki** na dolnym pasku podaje liczby: **Wyniki węzłowe** zawierają `Dx`, `Dz`, `Ry` dla każdego węzła, **Wyniki elementów** — siły końcowe każdego elementu w jego lokalnym układzie współrzędnych.

Jeśli wykresy są za duże lub za małe, przesuń suwak **Skala wyników** w **Ustawienia → Ustawienia widoku → Rozmiary**.

## 8. Sprawdź ręcznie

| Wielkość | Wzór | Wartość ręczna | EduBeam |
| --- | --- | --- | --- |
| Reakcja | $R = qL/2$ | 36 kN | 36 kN |
| Maks. siła poprzeczna | $V = qL/2$ | 36 kN | 36 kN |
| Maks. moment | $M = qL^2/8$ | 54 kNm | 54 kNm |
| Kąt obrotu na podporze | $\varphi = qL^3/(24EI)$ | 0,02647 rad | 0,02647 rad |
| Ugięcie w środku rozpiętości | $w = 5qL^4/(384EI)$ | 49,6 mm | 49,6 mm |

Wszystko się zgadza. Więcej przepisów na sprawdzenie ręczne (wspornik, belka obustronnie utwierdzona, kratownica) znajdziesz na stronie [Sprawdzanie wyników ręcznie](/pl/guide/verification).

## 9. Eksperymentuj

Tu EduBeam pokazuje swoją siłę. Wypróbuj każdą z poniższych zmian i obserwuj, jak aktualizują się wykresy:

- **Przeciągnij węzeł 2** w prawo: moment rośnie z $L^2$.
- **Zaznacz `Ry` w węźle 1**, aby go utwierdzić: moment przęsłowy maleje, a na podporze pojawia się moment ujemny (podporowy).
- **Dodaj trzeci węzeł** w `X = 3`, klikając na belce w trybie *Dodaj myszą* — wybierz **Połącz z konstrukcją**, aby belka została podzielona — a następnie zaznacz jego `Dz`: powstaje belka ciągła dwuprzęsłowa.
- **Zaznacz jeden z przegubów końcowych** elementu w zakładce Elementy, aby zwolnić moment na tym końcu.
- Naciśnij <kbd>Ctrl</kbd>+<kbd>Z</kbd>, aby cofnąć dowolny krok.

## 10. Zapisz lub udostępnij

- **Udostępnij model** (pasek aplikacji) daje adres URL zawierający cały model — wklej go do e-maila, czatu lub prezentacji.
- **Zapisz projekt** (menu ☰ lub <kbd>Ctrl</kbd>+<kbd>S</kbd>) pobiera plik `project.json`, który później otworzysz przez **Otwórz projekt** lub upuszczając go na okno aplikacji.

Model jest też przechowywany w pamięci lokalnej przeglądarki, więc przeładowanie strony niczego nie traci. Zobacz [Import, eksport i udostępnianie](/pl/essentials/import-export).

## Co dalej

- [Przykłady](/pl/examples/) — gotowe ramy i kratownice otwierane jednym kliknięciem.
- [Obciążenia](/pl/essentials/loads) — obciążenia trapezowe, skupione i termiczne, zadane przemieszczenia.
- [Klawiatura i mysz](/pl/reference/shortcuts) — pracuj szybciej na płótnie.
