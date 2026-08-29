# Obciążenia

Wszystkie obciążenia należą do **jednego przypadku obciążenia** i działają jednocześnie. Aby porównać warianty, zapisz każdy jako plik projektu lub link do udostępnienia.

<LoadShowcase />

## Konwencja znaków w jednym zdaniu

Globalna oś **x** jest skierowana w prawo, globalna oś **z** — **w dół**. Dodatnie `Fz` lub `fz` w układzie globalnym to więc obciążenie skierowane w dół, grawitacyjne; dodatni moment `My` działa na ekranie przeciwnie do ruchu wskazówek zegara. Szczegóły na stronie [Układ współrzędnych i konwencje znaków](/pl/elements/conventions).

## Obciążenia węzłowe

Zakładka *Obciążenia* → **Dodaj obciążenie węzłowe** lub kliknij węzeł → **Dodaj obciążenie**. Wybierz **Siła/Moment**:

| Pole | Znaczenie | Jednostka |
| --- | --- | --- |
| `Fx` | siła pozioma (+ → w prawo) | jednostka siły |
| `Fz` | siła pionowa (+ → w dół) | jednostka siły |
| `My` | moment względem osi y | jednostka momentu |

Składowe są zawsze w **globalnym** układzie współrzędnych. Podgląd strzałki w oknie dialogowym pokazuje na żywo wypadkowy kierunek i wartość. W jednym węźle może być kilka obciążeń węzłowych — po prostu się sumują.

### Zadane przemieszczenia (osiadania podpór)

W tym samym oknie wybierz **Zadane przemieszczenie** (lub kliknij podparty węzeł → **Zadaj przemieszczenie**). Pola zmieniają się na:

| Pole | Znaczenie | Jednostka |
| --- | --- | --- |
| `Dx` | wymuszone przemieszczenie poziome | jednostka długości |
| `Dz` | wymuszone przemieszczenie pionowe (+ → w dół) | jednostka długości |
| `Ry` | wymuszony obrót | rad |

Wartość można wpisać tylko dla stopnia swobody, który jest w tym węźle **zablokowany** — przesuwać można tylko podpory. Każdy węzeł może mieć jedno zadane przemieszczenie; edytuj je zamiast dodawać drugie. W układzie statycznie wyznaczalnym osiadanie wywołuje przemieszczenia, ale nie siły przekrojowe; w układzie statycznie niewyznaczalnym — jedno i drugie.

## Obciążenia elementów

Zakładka *Obciążenia* → **Dodaj obciążenie elementu** lub kliknij element → **Dodaj obciążenie**. Wybierz **Typ obciążenia**; okno pokazuje podgląd obciążenia na elemencie na żywo.

### Obciążenie równomiernie rozłożone

| Pole | Znaczenie | Jednostka |
| --- | --- | --- |
| `fx` | obciążenie na jednostkę długości wzdłuż x | siła / długość |
| `fz` | obciążenie na jednostkę długości wzdłuż z | siła / długość |
| **LCS** | zaznacz, aby interpretować `fx`, `fz` w osiach lokalnych elementu | – |

Najczęstszy przypadek to pionowe obciążenie grawitacyjne: `fz > 0`, LCS wyłączone. Dla pręta nachylonego obciążenie **prostopadłe do pręta** (np. wiatr na krokiew) to `fz` z **włączonym** LCS; obciążenie pionowe na metr rzutu *poziomego* nie jest dostępne bezpośrednio — najpierw przelicz je na metr długości pręta.

### Obciążenie trapezowe

| Pole | Znaczenie |
| --- | --- |
| `f1x`, `f1z` | intensywność w węźle **początkowym** |
| `f2x`, `f2z` | intensywność w węźle **końcowym** |

Intensywność zmienia się liniowo między końcami. Obciążenie trójkątne to po prostu `f1z = 0`. Obciążenia trapezowe są zawsze w **układzie lokalnym elementu** (pole LCS jest zablokowane jako włączone); dla elementów poziomych lokalna i globalna oś z pokrywają się, więc ma to znaczenie tylko dla prętów nachylonych.

### Obciążenie skupione

Siła lub moment skupiony w dowolnym miejscu **wzdłuż** elementu — bez dodatkowego węzła.

| Pole | Znaczenie |
| --- | --- |
| `Fx`, `Fz`, `My` | składowe siły / momentu |
| **Pozycja obciążenia od węzła początkowego** | odległość od węzła początkowego, `0 ≤ a ≤ L` |
| **LCS** | składowe w osiach lokalnych |

Wykres sił poprzecznych ma skok o `Fz`, a wykres momentów załamanie w miejscu obciążenia; wartość momentu w tym punkcie jest opisywana automatycznie.

### Obciążenie termiczne

| Pole | Znaczenie |
| --- | --- |
| **ΔT<sub>s</sub>** – osiowa zmiana temperatury | równomierna zmiana w całym przekroju → wydłużenie $\alpha\,\Delta T_s\,L$ |
| **ΔT<sub>b</sub> − ΔT<sub>t</sub>** – dolne minus górne włókna | różnica temperatury na wysokości przekroju → krzywizna $\alpha\,(\Delta T_b - \Delta T_t)/h$ |

Obciążenia termiczne używają **α** materiału i **wysokości h** przekroju. Dodatnie `ΔTb − ΔTt` (dół cieplejszy) wygina element ku górze. W układzie statycznie wyznaczalnym temperatura wywołuje wyłącznie przemieszczenia; więzy (utwierdzone końce, ciągłość, pręty nadliczbowe) zamieniają je w siły przekrojowe.

## Edycja i usuwanie obciążeń

- Obciążenia pojawiają się jako plakietki w tabelach *Węzły* / *Elementy* oraz jako wiersze w zakładce *Obciążenia*, gdzie składowe (i flagę LCS) edytuje się w miejscu.
- **Kliknij dwukrotnie** obciążenie w widoku lub kliknij je i wybierz **Edytuj obciążenie**, aby otworzyć okno edycji.
- Zaznacz obciążenie i naciśnij <kbd>Delete</kbd> albo użyj ikony kosza.
- Obciążenia przypisane do węzła lub elementu są usuwane razem z nim i kopiowane razem z nim przy kopiowaniu i wklejaniu.

## Czego nie ma

- **Przypadków i kombinacji obciążeń** — tylko jeden przypadek.
- **Ciężaru własnego** — wpisz go jako obciążenie równomiernie rozłożone: $f_z = \rho\,g\,A$ (np. IPE 200: 7850 × 9,81 × 0,00285 ≈ 0,22 kN/m).
- **Obciążeń trapezowych w układzie globalnym** na prętach nachylonych.
