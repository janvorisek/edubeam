# Samouczek: rama trójprzegubowa

Rama trójprzegubowa jest statycznie wyznaczalna: trzy równania równowagi oraz warunek $M = 0$ w przegubie dają wszystkie cztery reakcje podporowe. Dzięki temu to idealny model do sprawdzenia każdej liczby, którą rysuje EduBeam. Zarezerwuj około 15 minut.

![Gotowa rama: moment zginający i reakcje](/screenshots/pl/tut-frame-moment.webp)

[Otwórz gotowy model](https://run.edubeam.app/?model=eyJuIjpbWyJBIixbMCwwLDBdLFswLDJdLG51bGxdLFsiQiIsWzAsMCwtNF0sW10sbnVsbF0sWyJDIixbNCwwLC00XSxbXSxudWxsXSxbIkQiLFs4LDAsLTRdLFtdLG51bGxdLFsiRSIsWzgsMCwwXSxbMCwyXSxudWxsXV0sImUiOltbIjEiLFsiQSIsIkIiXSwiMSIsIjEiLFtmYWxzZSxmYWxzZV1dLFsiMiIsWyJCIiwiQyJdLCIxIiwiMSIsW2ZhbHNlLHRydWVdXSxbIjMiLFsiQyIsIkQiXSwiMSIsIjEiLFtmYWxzZSxmYWxzZV1dLFsiNCIsWyJEIiwiRSJdLCIxIiwiMSIsW2ZhbHNlLGZhbHNlXV1dLCJtIjpbWyIxIiw3ODUwLDIxMDAwMDAwMDAwMCw4MTAwMDAwMDAwMCwwLjAwMDAxMl1dLCJjcyI6W1siMSIsMC4wMDUzOCwwLjAwMDA4MzU2LDAuMywxXV0sImVsIjpbWyIyIixbMCwxMDAwMF0sZmFsc2VdLFsiMyIsWzAsMTAwMDBdLGZhbHNlXV0sImQiOltdfQ%3D%3D&lang=pl){target="_blank"}, jeśli chcesz go tylko obejrzeć.

## Zadanie {#the-problem}

- Dwa słupy o wysokości 4 m, podparte przegubowo u podstaw A i E, w rozstawie 8 m.
- Poziomy rygiel B–D na górze, z przegubem w środku rozpiętości C.
- Obciążenie równomierne $q = 10$ kN/m na całym ryglu.
- Stal ($E = 210$ GPa, $G = 81$ GPa), IPE 300 ($A = 53{,}8$ cm², $I_y = 8356$ cm⁴, $h = 300$ mm).

| Węzeł | X [m] | Z [m] | Podpora |
| --- | --- | --- | --- |
| A | 0 | 0 | przegubowa nieprzesuwna |
| B | 0 | −4 | |
| C | 4 | −4 | (przegub w ryglu) |
| D | 8 | −4 | |
| E | 8 | 0 | przegubowa nieprzesuwna |

Pamiętaj, że **oś z jest skierowana w dół**, więc wierzchołki słupów leżą w `Z = −4`.

## 1. Materiał i przekrój {#_1-material-and-section}

1. **Wyczyść model** (zaznacz *Usuń materiały* i *Usuń przekroje*).
2. *Materiały* → **Biblioteka materiałów** → **Steel (S235)**.
3. *Przekroje* → **Dodaj przekrój**: `Pole = 0,00538`, `Iy = 8,356e-5`, `Wysokość = 0,3`, `Współczynnik ścinania = 1`.

Przekrój wpływa tylko na przemieszczenia. Ta rama jest statycznie wyznaczalna, więc jej siły przekrojowe w ogóle nie zależą od $E$, $A$ ani $I$.

## 2. Narysuj ramę {#_2-draw-the-frame}

Najszybciej narysujesz ją myszą jako jedną linię łamaną:

1. Upewnij się, że **Przyciągaj do siatki** jest włączone (przełącznik **S**).
2. Zakładka *Elementy* → drugi przycisk **Dodaj element** (ikona kursora).
3. Kliknij w (0, 0), potem w (0, −4), (4, −4), (8, −4) i (8, 0). Punkty znajdziesz, obserwując linijki i celownik. Każde kliknięcie dodaje węzeł i łączy go z poprzednim.
4. Naciśnij <kbd>Esc</kbd>, aby zakończyć, a potem <kbd>F</kbd>, aby dopasować ramę do ekranu.

Masz teraz pięć węzłów i cztery elementy. Na rysunkach węzły są oznaczone A–E; jeśli chcesz, zmień etykiety swoich węzłów w tabeli *Węzły* albo zostaw 1–5. Sprawdź współrzędne w tabeli i popraw te, które nie trafiły w siatkę.

## 3. Podpory i przegub {#_3-supports-and-the-hinge}

1. Kliknij węzeł A, otwórz **Podpory węzła** i wybierz **Przegub**. To samo zrób dla węzła E.
2. W tabeli *Elementy* znajdź element od B do C i zaznacz jego przegub na **końcu** (drugie pole w kolumnie *Przeguby końcowe*).

![Tabela Elementy: przegub jest na końcu elementu 2, w węźle C](/screenshots/pl/elements-table.webp)

::: tip Jeden przegub, nie dwa
Przegub na końcu elementu B–C wystarczy: moment w C jest wtedy zerowy, ponieważ C–D nie może przekazać momentu do węzła, z którym tylko on jest połączony sztywno. Zaznacz także początek C–D, a nic się nie zmieni. Ale zaznacz dodatkowo przegub w B, a rama stanie się mechanizmem. Wypróbuj to: EduBeam pokaże, jak się porusza.
:::

## 4. Obciążenie {#_4-load}

*Obciążenia* → **Dodaj obciążenie elementu** → *Obciążenie równomiernie rozłożone*, element B–C, `fz = 10` kN/m. Powtórz dla elementu C–D. Rygiel jest poziomy, więc pole LCS nie ma tu znaczenia.

## 5. Wyniki {#_5-results}

Opcje wyświetlania mają na początku włączony kształt odkształcony, moment zginający i reakcje. Zaznacz **N (x)** i **V<sub>z</sub> (x)**, aby zobaczyć resztę.

<div class="shots">

![Moment zginający i reakcje](/screenshots/pl/tut-frame-moment.webp)

![Siła normalna](/screenshots/pl/tut-frame-normal.webp)

![Siła tnąca](/screenshots/pl/results-shear.webp)

![Kształt odkształcony](/screenshots/pl/results-deformed.webp)

</div>

## 6. Sprawdź ręcznie {#_6-check-by-hand}

**Reakcje pionowe.** Z symetrii każda podstawa przejmuje połowę obciążenia:

$$V_A = V_E = \frac{q \cdot 8}{2} = 40\ \text{kN}$$

**Reakcje poziome.** Zapisz sumę momentów względem przegubu C dla lewej połowy ramy. Moment w tym miejscu musi być zerowy:

$$V_A \cdot 4 - H_A \cdot 4 - q \cdot 4 \cdot 2 = 0 \quad\Rightarrow\quad H_A = \frac{160 - 80}{4} = 20\ \text{kN}$$

Obie podstawy są pchane do środka siłą 20 kN; to właśnie ten poziomy rozpór czyni ramę trójprzegubową efektywną.

**Siły przekrojowe.**

| Wielkość | Wzór | Wartość ręczna | EduBeam |
| --- | --- | --- | --- |
| Reakcje pionowe | $qL/2$ | 40 kN | 40 kN |
| Reakcje poziome | z $M_C = 0$ | 20 kN | 20 kN |
| Moment w narożach B i D | $H \cdot h$ | 80 kNm, rozciągane włókna zewnętrzne | −80 kNm |
| Moment w przegubie C | | 0 | 0 |
| Siła normalna w słupach | $-V_A$ | −40 kN | −40 kN |
| Siła normalna w ryglu | $-H_A$ | −20 kN | −20 kN |
| Siła tnąca w słupach | $H_A$ | 20 kN | −20 kN (A–B), +20 kN (D–E) |
| Siła tnąca w ryglu w B | $V_A$ | 40 kN | 40 kN |
| Siła tnąca w ryglu w C | $V_A - 4q$ | 0 | 0 |
| Siła tnąca w ryglu w D | $V_A - 8q$ | −40 kN | −40 kN |

Oba słupy mają przeciwne znaki siły tnącej, choć przenoszą tę samą siłę, ponieważ osie lokalne każdego elementu wynikają z jego kierunku: A–B narysowano w górę, a D–E w dół. Zamień węzły jednego słupa, a jego znak się odwróci.

W ryglu $M(x) = -80 + 40x - 5x^2$ kNm (x mierzone od B); moment jest zerowy w przegubie i nigdzie nie jest dodatni: cały rygiel jest zginany momentem ujemnym. Siła tnąca $V(x) = 40 - 10x$ spada do zera dokładnie w C, więc ekstremum momentu również wypada w przegubie.

**Przemieszczenie.** Przegub C obniża się o 43,1 mm (*Wyniki → Wyniki węzłowe*, `Dz` węzła C). Wynika to ze zginania wszystkich czterech prętów i jest dobrym ćwiczeniem na zasadę prac wirtualnych.

## 7. Eksperymentuj {#_7-experiment}

- **Odznacz przegub** w C. Rama staje się jednokrotnie statycznie niewyznaczalna; momenty w narożach maleją, a w środku rozpiętości pojawia się moment dodatni. Teraz przekrój ma znaczenie: wypróbuj sztywniejszy rygiel.
- **Utwierdź podstawy** (wybierz podporę **Utwierdzenie**). W A i E pojawiają się momenty.
- **Dodaj obciążenie poziome**: obciążenie węzłowe `Fx = 10` kN w B. Rama się przechyla, a reakcje nie są już symetryczne. Sprawdź je tymi samymi trzema równaniami i warunkiem $M_C = 0$.
- **Zaznacz także przegub w B.** Rama jest teraz mechanizmem, a EduBeam animuje, jak może się poruszać.
