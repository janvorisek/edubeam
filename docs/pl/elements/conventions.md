# Układ współrzędnych i konwencje znaków

Większość „błędnych” wyników w <Edubeam /> to w rzeczywistości niespodzianka wynikająca z konwencji znaków. Wszystko poniżej to dokładnie to, czego używa solver.

## Osie globalne

- **x** — pozioma, dodatnia w **prawo**.
- **z** — pionowa, dodatnia **w dół** ekranu.
- **y** — oś prostopadła do płaszczyzny (w układzie prawoskrętnym skierowana ku obserwatorowi). Obroty i momenty są względem osi y.

Wskaźnik osi w rogu siatki pokazuje x (czerwona) i z (zielona). Węzeł na szczycie słupa o wysokości 3 m ma więc `Z = −3`, jeśli podstawa jest w `Z = 0`.

## Stopnie swobody

Każdy węzeł ma `Dx`, `Dz` (przesunięcia) i `Ry` (obrót). Dodatnie `Dz` to przemieszczenie w dół; dodatnie `Ry` to obrót **przeciwnie do ruchu wskazówek zegara** na ekranie. Te same znaki obowiązują dla zadanych przemieszczeń i podawanych wyników węzłowych.

## Obciążenia

| Obciążenie | Kierunek dodatni |
| --- | --- |
| `Fx`, `fx`, `f1x`… | +x (w prawo; lub wzdłuż lokalnej osi x elementu przy włączonym LCS) |
| `Fz`, `fz`, `f1z`… | +z (**w dół**; lub wzdłuż lokalnej osi z przy włączonym LCS) |
| `My` | przeciwnie do ruchu wskazówek zegara na ekranie |
| `ΔTs` | ogrzanie (wydłużenie) |
| `ΔTb − ΔTt` | dolne włókna cieplejsze od górnych |

Obciążenie grawitacyjne to zatem **dodatnie** `fz`, a obciążenie wiatrem pchające lewy słup w prawo to dodatnie `fx`.

## Osie lokalne elementu

Lokalna oś **x** biegnie od węzła początkowego do końcowego; lokalna oś **z** jest do niej prostopadła i powstaje przez obrót osi globalnych o kąt elementu $\alpha$. Dla elementu poziomego narysowanego od lewej do prawej osie lokalne i globalne pokrywają się. Użyj **Zamień kolejność węzłów** w tabeli *Elementy*, aby odwrócić kierunek.

## Siły przekrojowe

| Wielkość | Znak dodatni oznacza |
| --- | --- |
| **N** | rozciąganie |
| **V<sub>z</sub>** | zwykła konwencja z teorii belek: dla belki swobodnie podpartej pod obciążeniem grawitacyjnym V jest dodatnie przy lewej podporze i ujemne przy prawej |
| **M<sub>y</sub>** | **rozciąganie dolnych włókien** (+z). Belka swobodnie podparta pod obciążeniem grawitacyjnym ma dodatni moment w środku rozpiętości; wspornik z siłą na końcu ma ujemny moment w utwierdzeniu |

## Siły końcowe (tabela Wyniki elementów)

`X12, Z12, M12` działają na element w jego węźle początkowym, `X21, Z21, M21` w węźle końcowym, w układzie **lokalnym**, z takimi samymi kierunkami dodatnimi jak osie lokalne i `My`. Są to siły, jakimi węzły działają na element, tj. $\mathbf{f} = \mathbf{K}_l\,\mathbf{u}_l - \mathbf{f}_{eq}$, gdzie $\mathbf{f}_{eq}$ to zastępcze obciążenia węzłowe od obciążeń elementu. Suma sił końcowych wszystkich elementów zbiegających się w węźle równoważy obciążenia węzłowe i reakcje w tym węźle.

## Reakcje

Reakcja istnieje dla każdego zablokowanego stopnia swobody i jest podawana w układzie współrzędnych węzła (obróconym o kąt lokalnego układu węzła, jeśli został ustawiony). Strzałki reakcji w widoku wskazują kierunek, w jakim podpora działa na konstrukcję.

## Jednostki

Solver pracuje wewnętrznie w SI (m, N, Pa, rad, K). Jednostki wyświetlania wpływają tylko na to, co wpisujesz i odczytujesz; ich zmiana nigdy nie zmienia modelu.
