# Obciążenia

Wszystkie obciążenia należą do **jednego przypadku obciążenia** i działają jednocześnie. Aby porównać warianty, zapisz każdy jako plik projektu lub link do udostępnienia.

![Wszystkie typy obciążeń na jednej belce ciągłej: siła węzłowa, obciążenie równomierne, obciążenie trapezowe, siła skupiona, obciążenie termiczne i osiadanie podpory](/screenshots/pl/loads-overview.webp)

<LoadShowcase />

## Konwencja znaków w jednym zdaniu {#sign-convention-in-one-line}

Globalna oś **x** jest skierowana w prawo, a globalna oś **z** **w dół**. Dodatnie `Fz` lub `fz` to więc obciążenie skierowane w dół, typu grawitacyjnego, a dodatni moment `My` obraca na ekranie przeciwnie do ruchu wskazówek zegara. Szczegóły na stronie [Układ współrzędnych i konwencje znaków](/pl/elements/conventions). Przy [osi y w górę](/pl/elements/conventions#y-up-axes) nazwy i znaki wielkości pionowych się odwracają: obciążenie grawitacyjne to ujemne `Fy`.

## Obciążenia węzłowe {#nodal-loads}

Zakładka *Obciążenia* → **Dodaj obciążenie węzłowe** albo kliknij węzeł → **Dodaj obciążenie**. Wybierz **Siła/Moment**:

| Pole | Znaczenie | Jednostka |
| --- | --- | --- |
| `Fx` | siła pozioma (dodatnia w prawo) | jednostka siły |
| `Fz` | siła pionowa (dodatnia w dół) | jednostka siły |
| `My` | moment względem osi y (dodatni przeciwnie do ruchu wskazówek zegara) | jednostka momentu |

![Dodaj obciążenie węzłowe. Podgląd pokazuje kierunek już podczas wpisywania.](/screenshots/pl/loads-nodal.webp){.shot-md}

Składowe są zawsze w **globalnym** układzie współrzędnych. Węzeł może mieć kilka obciążeń węzłowych; sumują się i są rysowane jedno nad drugim.

### Zadane przemieszczenia (osiadania podpór) {#prescribed-displacements-support-settlements}

W tym samym oknie wybierz **Zadane przemieszczenie** albo kliknij podparty węzeł → **Zadaj przemieszczenie**. Pola zmieniają się na:

| Pole | Znaczenie | Jednostka |
| --- | --- | --- |
| `Dx` | wymuszone przemieszczenie poziome | jednostka przemieszczenia |
| `Dz` | wymuszone przemieszczenie pionowe (dodatnie w dół) | jednostka przemieszczenia |
| `Ry` | wymuszony obrót | rad |

Wartość można wpisać tylko dla stopnia swobody, który jest w tym węźle **zablokowany**, ponieważ przesuwać można tylko podpory. Każdy węzeł ma najwyżej jedno zadane przemieszczenie; edytuj je zamiast dodawać drugie. W układzie statycznie wyznaczalnym osiadanie wywołuje przemieszczenia, ale nie siły przekrojowe; w układzie statycznie niewyznaczalnym wywołuje jedno i drugie.

## Obciążenia elementów {#element-loads}

Zakładka *Obciążenia* → **Dodaj obciążenie elementu** albo kliknij element → **Dodaj obciążenie**. Wybierz **Typ obciążenia**; okno już podczas wpisywania pokazuje podgląd obciążenia na elemencie.

### Obciążenie równomiernie rozłożone {#uniformly-distributed-load}

| Pole | Znaczenie | Jednostka |
| --- | --- | --- |
| `fx` | obciążenie na jednostkę długości wzdłuż x | siła / długość |
| `fz` | obciążenie na jednostkę długości wzdłuż z | siła / długość |
| **LCS** | zaznaczone: `fx`, `fz` działają wzdłuż osi lokalnych elementu; odznaczone: wzdłuż osi globalnych | – |

**LCS** jest domyślnie zaznaczone. Na elemencie poziomym narysowanym od lewej do prawej osie lokalne i globalne są takie same, więc nie ma to znaczenia. Na pręcie nachylonym ma:

- obciążenie **prostopadłe do pręta** (wiatr na krokiew) to `fz` z **zaznaczonym** LCS;
- obciążenie **pionowe** na metr długości pręta (ciężar własny) to `fz` z **odznaczonym** LCS;
- obciążenie pionowe na metr rzutu *poziomego* (śnieg) nie jest dostępne bezpośrednio. Najpierw pomnóż je przez $\cos\alpha$, gdzie $\alpha$ to kąt nachylenia pręta, i wprowadź jako obciążenie pionowe.

### Obciążenie trapezowe {#trapezoidal-load}

| Pole | Znaczenie |
| --- | --- |
| `f1x`, `f1z` | intensywność w węźle **początkowym** |
| `f2x`, `f2z` | intensywność w węźle **końcowym** |

Intensywność zmienia się liniowo od początku do końca elementu. Obciążenie trójkątne ma `f1z = 0`. Obciążenia trapezowe działają zawsze wzdłuż **osi lokalnych elementu** (pole LCS jest zablokowane); na elemencie poziomym jest to to samo co układ globalny.

### Obciążenie skupione {#concentrated-load}

Siła lub moment skupiony w dowolnym miejscu **wzdłuż** elementu, bez potrzeby dodawania węzła.

| Pole | Znaczenie |
| --- | --- |
| `Fx`, `Fz`, `My` | składowe siły i momentu |
| **Pozycja obciążenia od węzła początkowego** | odległość od węzła początkowego, `0 ≤ a ≤ L` |
| **LCS** | składowe wzdłuż osi lokalnych |

Wykres sił tnących ma w miejscu obciążenia skok o `Fz`, a wykres momentów załamanie; wartość momentu w tym punkcie jest opisywana automatycznie. Skupiony moment `My` powoduje natomiast skok na wykresie momentów.

### Obciążenie termiczne {#temperature-load}

| Pole | Znaczenie |
| --- | --- |
| **ΔT<sub>c</sub>**, osiowa zmiana temperatury | równomierna zmiana w całym przekroju, dająca wydłużenie $\alpha\,\Delta T_c\,L$ |
| **ΔT<sub>b</sub> − ΔT<sub>t</sub>**, różnica temperatur | włókna dolne minus górne, dająca krzywiznę $\alpha\,(\Delta T_b - \Delta T_t)/h$ |

Obciążenia termiczne używają **α** materiału i **wysokości h** przekroju. Dodatnie `ΔTb − ΔTt` (dół cieplejszy) wydłuża dolne włókna, więc element ugina się jak belka pod obciążeniem grawitacyjnym. W układzie statycznie wyznaczalnym temperatura wywołuje wyłącznie przemieszczenia; więzy (utwierdzone końce, ciągłość, pręty nadliczbowe) zamieniają ją w siły przekrojowe.

<div class="shots">

![Obciążenie równomiernie rozłożone](/screenshots/pl/loads-udl.webp)

![Obciążenie trapezowe](/screenshots/pl/loads-trapezoidal.webp)

![Obciążenie skupione](/screenshots/pl/loads-concentrated.webp)

![Obciążenie termiczne](/screenshots/pl/loads-temperature.webp)

</div>

## Edycja i usuwanie obciążeń {#editing-and-removing-loads}

- Każde obciążenie to wiersz w zakładce *Obciążenia*, w którym możesz bezpośrednio edytować jego składowe i flagę LCS. Obciążenia pojawiają się też jako plakietki w tabelach *Węzły* i *Elementy*.
- **Kliknij dwukrotnie** obciążenie w widoku albo kliknij je i wybierz **Edytuj obciążenie**, aby otworzyć okno edycji.
- Zaznacz obciążenie i naciśnij <kbd>Delete</kbd> albo użyj × w tabeli.
- Obciążenia przypisane do węzła lub elementu są usuwane razem z nim i kopiowane razem z nim przy kopiowaniu i wklejaniu.

![Zakładka Obciążenia: jeden wiersz na obciążenie, ze składowymi edytowalnymi bezpośrednio](/screenshots/pl/loads-table.webp)

## Czego nie ma {#what-is-not-available}

- **Przypadków i kombinacji obciążeń.** Jest jeden przypadek obciążenia.
- **Ciężaru własnego.** Wprowadź go jako obciążenie równomierne z odznaczonym LCS: $f_z = \rho\,g\,A$. Dla IPE 200: 7850 × 9,81 × 0,00285 ≈ 0,22 kN/m.
- **Obciążeń trapezowych w osiach globalnych** na prętach nachylonych.
