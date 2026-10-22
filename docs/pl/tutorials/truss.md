# Samouczek: kratownica płaska

W tym samouczku zbudujesz małą statycznie wyznaczalną kratownicę, sprawdzisz siły w prętach metodą równoważenia węzłów i metodą Rittera oraz znajdziesz pręt zerowy. Zarezerwuj około 15 minut.

![Gotowa kratownica: siły normalne i reakcje](/screenshots/pl/tut-truss.webp)

[Otwórz gotowy model](https://run.edubeam.app/?model=eyJuIjpbWyIxIixbMCwwLDBdLFswLDJdLG51bGxdLFsiMiIsWzQsMCwwXSxbXSxudWxsXSxbIjMiLFs4LDAsMF0sW10sbnVsbF0sWyI0IixbMTIsMCwwXSxbMl0sbnVsbF0sWyI1IixbNCwwLC0zXSxbXSxudWxsXSxbIjYiLFs4LDAsLTNdLFtdLG51bGxdXSwiZSI6W1siMSIsWyIxIiwiMiJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiMiIsWyIyIiwiMyJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiMyIsWyIzIiwiNCJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiNCIsWyI1IiwiNiJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiNSIsWyIxIiwiNSJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiNiIsWyIyIiwiNSJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiNyIsWyI1IiwiMyJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiOCIsWyIzIiwiNiJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiOSIsWyI2IiwiNCJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dXSwibSI6W1siMSIsNzg1MCwyMTAwMDAwMDAwMDAsODEwMDAwMDAwMDAsMC4wMDAwMTJdXSwiY3MiOltbIjEiLDAuMDAyLDAuMDAwMDAxLDAuMSwxXV0sIm5sIjpbWyIyIix7IjAiOjAsIjIiOjMwMDAwLCI0IjowfV0sWyIzIix7IjAiOjAsIjIiOjMwMDAwLCI0IjowfV1dLCJkIjpbXX0%3D&lang=pl){target="_blank"}, jeśli chcesz go tylko obejrzeć.

## Zadanie {#the-problem}

![Geometria, podpory i obciążenia](/screenshots/pl/tut-truss-model.webp)

- Rozpiętość 12 m podzielona na trzy przedziały po 4 m, wysokość 3 m.
- Węzły pasa dolnego 1–4, węzły pasa górnego 5 i 6.
- Podpora przegubowa nieprzesuwna w węźle 1 i przesuwna w węźle 4.
- Dwie siły po 30 kN w węzłach pasa dolnego 2 i 3.
- Pręty stalowe o polu $A = 20$ cm².

| Węzeł | X [m] | Z [m] | Podpora | Obciążenie |
| --- | --- | --- | --- | --- |
| 1 | 0 | 0 | przegubowa nieprzesuwna | |
| 2 | 4 | 0 | | `Fz = 30` kN |
| 3 | 8 | 0 | | `Fz = 30` kN |
| 4 | 12 | 0 | przegubowa przesuwna | |
| 5 | 4 | −3 | | |
| 6 | 8 | −3 | | |

Pręty: pas dolny 1–2, 2–3, 3–4; pas górny 5–6; krzyżulce skrajne 1–5 i 6–4; słupki 2–5 i 3–6; oraz krzyżulec środkowy 5–3.

**Czy jest statycznie wyznaczalna?** $m + r = 9 + 3 = 12 = 2j$ przy $j = 6$ węzłach, więc tak: siły w prętach wynikają z samych warunków równowagi.

## 1. Materiał i przekrój {#_1-material-and-section}

1. **Wyczyść model** (zaznacz *Usuń materiały* i *Usuń przekroje*).
2. *Materiały* → **Biblioteka materiałów** → **Steel (S235)**.
3. *Przekroje* → **Dodaj przekrój**: `Pole = 0,002`, `Iy = 1e-6`, `Wysokość = 0,1`, `Współczynnik ścinania = 1`. Przy prętach z przegubami liczy się tylko pole.

## 2. Narysuj pręty z przegubami {#_2-draw-the-bars-with-hinges}

Pręt kratownicy w EduBeam to element belkowy z zaznaczonymi **oboma przegubami końcowymi**. Narzędzie myszy może je ustawić za Ciebie:

1. Zakładka *Elementy* → drugi przycisk **Dodaj element** (ikona kursora).
2. Na pasku u góry widoku zaznacz **Przegub na początku** i **Przegub na końcu**. Każdy pręt, który teraz narysujesz, dostanie oba.
3. Narysuj obrys jako jedną linię łamaną: kliknij (0, 0), (4, −3), (8, −3), (12, 0), a potem z powrotem wzdłuż dołu: (8, 0), (4, 0), (0, 0). Naciśnij <kbd>Esc</kbd>.
4. Narysuj pręty wewnętrzne po jednym, naciskając <kbd>Esc</kbd> po każdym: (4, 0) → (4, −3), (4, −3) → (8, 0), (8, 0) → (8, −3).
5. Naciśnij <kbd>F</kbd>, aby dopasować widok.

Sprawdź tabelę *Elementy*: dziewięć elementów, każdy z zaznaczonymi oboma *Przegubami końcowymi*. Numery Twoich węzłów i elementów mogą się różnić od tych na rysunkach; nie ma to znaczenia.

## 3. Podpory i obciążenia {#_3-supports-and-loads}

1. Kliknij węzeł w (0, 0) → **Podpory węzła** → **Przegub**. Kliknij węzeł w (12, 0) → **Przegub przesuwny**.
2. Kliknij węzeł w (4, 0) → **Dodaj obciążenie** → `Fz = 30` kN. To samo zrób w (8, 0).

Dodatnie `Fz` działa w dół. Węzły kratownicy mogą się swobodnie obracać; EduBeam akceptuje węzły, w których wszystkie pręty mają przeguby, i podaje ich obrót jako 0.

## 4. Wyniki {#_4-results}

W opcjach wyświetlania odznacz **Kształt odkształcony** i **M<sub>y</sub> (x)** (w kratownicy nie ma zginania) i zaznacz **N (x)**.

![Siły normalne: rozciąganie dodatnie](/screenshots/pl/tut-truss.webp)

## 5. Sprawdź ręcznie {#_5-check-by-hand}

**Reakcje.** Obciążenia są symetryczne, więc $R_1 = R_4 = 30$ kN w górę, a reakcja pozioma w podporze nieprzesuwnej jest zerowa.

**Węzeł 1** (metoda równoważenia węzłów). Krzyżulec skrajny 1–5 ma długość 5 m ($\sin\alpha = 3/5$, $\cos\alpha = 4/5$):

$$\sum F_z:\ N_{15} \cdot \tfrac{3}{5} = -30 \Rightarrow N_{15} = -50\ \text{kN} \qquad \sum F_x:\ N_{12} = -N_{15} \cdot \tfrac{4}{5} = 40\ \text{kN}$$

**Węzeł 2.** Słupek 2–5 jest jedynym prętem, który może przenieść siłę 30 kN do góry: $N_{25} = +30$ kN oraz $N_{23} = N_{12} = 40$ kN.

**Przekrój przez środkowy przedział.** Przetnij pręty 5–6, 5–3 i 2–3 i rozważ lewą część:

- Suma momentów względem węzła 3: $R_1 \cdot 8 - 30 \cdot 4 + N_{56} \cdot 3 = 0 \Rightarrow N_{56} = -40$ kN.
- Siły pionowe: siła tnąca w przedziale wynosi $R_1 - 30 = 0$, więc krzyżulec **5–3 nie przenosi niczego**: $N_{53} = 0$.

| Pręt | Wartość ręczna | EduBeam |
| --- | --- | --- |
| Pas dolny 1–2, 2–3, 3–4 | +40 kN (rozciąganie) | 40 |
| Pas górny 5–6 | −40 kN (ściskanie) | −40 |
| Krzyżulce skrajne 1–5, 6–4 | −50 kN | −50 |
| Słupki 2–5, 3–6 | +30 kN | 30 |
| Krzyżulec środkowy 5–3 | 0 | 0 |

Ugięcie węzła 2 wynosi 2,29 mm (*Wyniki → Wyniki węzłowe*). Jako ćwiczenie oblicz je metodą prac wirtualnych, $\delta = \sum N n L / (EA)$.

## 6. Eksperymentuj {#_6-experiment}

- **Przesuń jedno obciążenie.** Przyłóż obie siły 30 kN w węźle 2. Krzyżulec środkowy przenosi teraz siłę: jakiego znaku i dlaczego?
- **Usuń krzyżulec środkowy.** Kratownica staje się mechanizmem; EduBeam zakreśla winne przeguby i pokazuje, jak przedział się ścina.
- **Odznacz wszystkie przeguby.** Kratownica staje się ramą o sztywnych węzłach. Zaznacz **M<sub>y</sub> (x)**: momenty zginające są znikome w porównaniu z siłami osiowymi, i dlatego idealizacja węzłów przegubowych się sprawdza.
- **Zamień obie podpory na nieprzesuwne.** Jedna reakcja więcej czyni układ statycznie niewyznaczalnym, a siły w pasie dolnym zależą teraz od pól przekrojów prętów.
