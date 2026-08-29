# Sprawdzanie wyników ręcznie

<Edubeam /> to dobre miejsce, by ćwiczyć nawyk potrzebny każdemu inżynierowi: nigdy nie ufaj liczbie, której nie potrafisz choćby w przybliżeniu odtworzyć. Ta strona podaje wzory zamknięte dla klasycznych przypadków i pokazuje, co dla nich zwraca aplikacja, abyś mógł zbudować każdy model samodzielnie i porównać.

Wszystkie przypadki, o ile nie zaznaczono inaczej, używają tego samego przekroju stalowego: $E = 210\,000$ MPa, $G = 81\,000$ MPa, $A = 28{,}5$ cm², $I_y = 1943$ cm⁴, $h = 200$ mm, $k = 1$ (IPE 200).

$$EI = 210 \times 10^9 \cdot 1.943 \times 10^{-5} = 4.080 \times 10^6\ \text{Nm}^2$$

::: tip Dlaczego liczby nieznacznie się różnią
EduBeam używa belek **Timoshenki**, które do klasycznego ugięcia od zginania (Eulera–Bernoulliego) dodają ugięcie od ścinania $\Delta w_s$. Kąty obrotu, reakcje i siły przekrojowe w układach statycznie wyznaczalnych pozostają bez zmian. Dla prętów smukłych dodatkowy człon jest znikomy; poniższe tabele pokazują go jawnie.
:::

## Belka swobodnie podparta, obciążenie równomierne

$L = 6$ m, $q = 12$ kN/m. Podpory: węzeł 1 `Dx + Dz`, węzeł 2 `Dz`.

| Wielkość | Wzór | Wartość | EduBeam |
| --- | --- | --- | --- |
| Reakcje | $qL/2$ | 36 kN | 36 kN |
| $V_{max}$ | $qL/2$ | 36 kN | 36 kN |
| $M_{max}$ (środek rozpiętości) | $qL^2/8$ | 54 kNm | 54 kNm |
| Kąt obrotu na podporze | $qL^3/(24EI)$ | 0,02647 rad | 0,02647 rad |
| Ugięcie w środku rozpiętości | $5qL^4/(384EI)$ | 49,63 mm | 49,63 mm |

<ExampleStructure />

## Wspornik, siła na końcu

$L = 4$ m, $F = 18$ kN w dół na swobodnym końcu. Podpora: węzeł 1 `Dx + Dz + Ry`.

| Wielkość | Wzór | Wartość | EduBeam |
| --- | --- | --- | --- |
| Reakcja pionowa | $F$ | 18 kN | 18 kN |
| Moment utwierdzenia | $FL$ | 72 kNm | 72 kNm |
| Kąt obrotu końca | $FL^2/(2EI)$ | 0,03529 rad | 0,03529 rad |
| Ugięcie końca (zginanie) | $FL^3/(3EI)$ | 94,11 mm | — |
| Ugięcie końca (ścinanie) | $FL/(kGA)$ | 0,31 mm | — |
| Ugięcie końca (łącznie) | suma | 94,42 mm | 94,42 mm |

Człon od ścinania wynosi tu 0,3 %. Skróć wspornik do 1 m, a wzrośnie do 5 % — właśnie do tego służy współczynnik ścinania.

<Figure>
  <Structure :show-loads="true" show-moment show-reactions :nodes="[{label: '1', coords: [0,0,0], dofs: [0,2,4]}, {label: '2', coords: [4,0,0], dofs: []}]" :elements="[{label: '1', nodes: ['1', '2']}]" :nodal-loads="[{target: '2', values: { 0: 0, 2: 18000, 4: 0 }}]" />
  <figcaption>Wspornik z siłą 18 kN na końcu: moment zginający i reakcje</figcaption>
</Figure>

## Belka obustronnie utwierdzona, obciążenie równomierne

$L = 6$ m, $q = 12$ kN/m. Oba węzły `Dx + Dz + Ry`.

| Wielkość | Wzór | Wartość |
| --- | --- | --- |
| Reakcje | $qL/2$ | 36 kN |
| Moment podporowy | $qL^2/12$ | 36 kNm (ujemny) |
| Moment w środku rozpiętości | $qL^2/24$ | 18 kNm (dodatni) |
| Ugięcie w środku rozpiętości | $qL^4/(384EI)$ | 9,93 mm |

Zbuduj ją z belki swobodnie podpartej, zaznaczając `Ry` w obu węzłach, i obserwuj, jak przesuwa się wykres momentów.

## Belka utwierdzona i podparta, obciążenie równomierne

$L = 6$ m, $q = 12$ kN/m. Węzeł 1 `Dx + Dz + Ry`, węzeł 2 `Dz`.

| Wielkość | Wzór | Wartość |
| --- | --- | --- |
| Reakcja w utwierdzeniu | $5qL/8$ | 45 kN |
| Reakcja na podporze przesuwnej | $3qL/8$ | 27 kN |
| Moment utwierdzenia | $qL^2/8$ | 54 kNm (ujemny) |
| Maks. moment dodatni | $9qL^2/128$ w $x = 5L/8$ od utwierdzenia | 30,4 kNm w 3,75 m |

Aplikacja automatycznie opisuje ekstremum lokalne, więc możesz odczytać zarówno wartość, jak i (z położenia wzdłuż elementu) miejsce jego wystąpienia.

## Kratownica z dwóch prętów

Dwa pręty wychodzące z podpór przegubowych nieprzesuwnych w `(0, 0)` i `(4, 0)`, zbiegające się w `(2, −2)` (wierzchołek 2 m wyżej), w obu prętach zaznaczone oba **przeguby końcowe**, siła pionowa $F = 20$ kN w wierzchołku (w dół, czyli `Fz = 20`).

Każdy pręt jest nachylony pod kątem 45°, długość $L = 2\sqrt{2}$ m. Z symetrii każdy przenosi

$$N = -\frac{F}{2 \sin 45^\circ} = -14.14\ \text{kN (ściskanie)}$$

a każda z podpór przejmuje 10 kN pionowo i ±10 kN poziomo. Sprawdź warstwę **N (x)** oraz reakcje.

## Nierównomierne ogrzanie belki swobodnie podpartej

$L = 8$ m, $\Delta T_b - \Delta T_t = -10$ K (góra cieplejsza), $\alpha = 12 \times 10^{-6}$, $h = 0{,}2$ m.

Belka może się swobodnie wyginać, więc **nie powstają siły przekrojowe**; krzywizna wynosi

$$\kappa = \frac{\alpha\,(\Delta T_b - \Delta T_t)}{h} = \frac{12 \times 10^{-6} \cdot (-10)}{0.2} = -6 \times 10^{-4}\ \text{m}^{-1}$$

a ugięcie w środku rozpiętości $\kappa L^2 / 8 = -4{,}8$ mm (do góry). Teraz zablokuj `Ry` na obu końcach: krzywizna zostaje powstrzymana i na całej długości pojawia się stały moment $M = EI\kappa = 2{,}45$ kNm.

## Zadane przemieszczenie

Weź [belkę utwierdzoną i podpartą](#belka-utwierdzona-i-podparta-obciazenie-rownomierne) bez obciążenia i zadaj `Dz = 10 mm` na podporze przesuwnej (osiadanie). Reakcja potrzebna, by przesunąć koniec wspornika w dół o $w$, wynosi $R = 3EIw/L^3 = 0{,}567$ kN, a moment utwierdzenia $RL = 3{,}40$ kNm. Dodaj z powrotem obciążenie równomierne — wyniki sumują się liniowo (zasada superpozycji).

## Wskazówki do własnych sprawdzeń

- Miej na oku **plakietkę jednostek**; większość rozbieżności to pomyłki w jednostkach.
- Używaj okna **Macierz sztywności**, by porównać pojedynczy element z [podręcznikiem teoretycznym](/pl/elements/beam) podczas nauki metody przemieszczeń.
- Dokładne liczby odczytuj z zakładki **Wyniki** i podpowiedzi po najechaniu, a nie z etykiet na wykresach, które są zaokrąglone.
- Użyj **Udostępnij model**, aby przekazać sprawdzony model koledze lub prowadzącemu.
