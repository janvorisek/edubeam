# Wyniki i wykresy

<Edubeam /> rozwiązuje model automatycznie po każdej zmianie (z ograniczeniem do kilku razy na sekundę), więc wyniki są zawsze aktualne. Nie ma przycisku *Oblicz*. Jeśli nic się nie rysuje, model nie jest jeszcze rozwiązywalny — zobacz [Rozwiązywanie problemów](/pl/reference/troubleshooting).

## Warstwy w widoku

Włączasz i wyłączasz je w **panelu ustawień wyświetlania** (przycisk ⚙ w prawym górnym rogu widoku).

| Warstwa | Kolor (domyślny) | Uwagi |
| --- | --- | --- |
| **Kształt odkształcony** | szary | Przeskalowany; największe przemieszczenie odpowiada liczbie pikseli z *Skala wyników*. |
| **N (x)** – siła normalna | niebieski | Rozciąganie dodatnie. Stała wzdłuż elementu, chyba że działa na niego osiowe obciążenie liniowe. |
| **V<sub>z</sub> (x)** – siła poprzeczna | zielony | Liniowa pod obciążeniem równomiernym, kwadratowa pod trapezowym, ze skokami w miejscach obciążeń skupionych. |
| **M<sub>y</sub> (x)** – moment zginający | czerwony | Dodatni, gdy rozciągane są dolne włókna. Opisany na obu końcach, w miejscach obciążeń skupionych i w każdym ekstremum lokalnym (gdzie V = 0). |
| **Reakcje** | fioletowy | Strzałka i wartość dla każdego zablokowanego stopnia swobody. |

Wykresy są rysowane wzdłuż elementów, a ich wartości wypisywane w punktach charakterystycznych. Orientację etykiet i skalę wszystkich wykresów można zmienić w [Ustawieniach](/pl/essentials/units-settings#ustawienia-widoku).

### Siła normalna

<Figure>
    <Structure :show-loads="true" show-normal-force :nodes="[{label: 'a', coords: [0,0,0], dofs: [0,2, 4]}, {label: 'b', coords: [10,0,0], dofs: []}]" :elements="[{label: '1', nodes: ['a', 'b']}]" :nodal-loads="[{target: 'b', values: { 0: -100, 2: 0, 4: 0 }}]" />
    <figcaption>Wspornik ściskany siłą poziomą na swobodnym końcu: N jest stałe i ujemne</figcaption>
</Figure>

### Siła poprzeczna

<Figure>
  <Structure :show-loads="true" show-shear-force :nodes="[{label: 'a', coords: [0,0,0], dofs: [0,2, 4]}, {label: 'b', coords: [10,0,0], dofs: []}]" :elements="[{label: '1', nodes: ['a', 'b']}]" :nodal-loads="[{target: 'b', values: { 0: 0, 2: 10, 4: 0 }}]" />
 <figcaption>Wspornik z siłą pionową na końcu: V jest stałe</figcaption>
</Figure>

### Moment zginający

<Figure>
  <Structure :show-loads="true" show-moment :nodes="[{label: 'a', coords: [0,0,0], dofs: [0,2, 4]}, {label: 'b', coords: [10,0,0], dofs: []}]" :elements="[{label: '1', nodes: ['a', 'b']}]" :nodal-loads="[{target: 'b', values: { 0: 0, 2: 10, 4: 0 }}]" />
 <figcaption>Ten sam wspornik: M rośnie liniowo do F·L w utwierdzeniu</figcaption>
</Figure>

### Kształt odkształcony

<Figure>
  <Structure :show-loads="true" show-deformed-shape :nodes="[{label: 'a', coords: [0,0,0], dofs: [0,2, 4]}, {label: 'b', coords: [10,0,0], dofs: []}]" :elements="[{label: '1', nodes: ['a', 'b']}]" :nodal-loads="[{target: 'b', values: { 0: 0, 2: 10, 4: 0 }}]" />
  <figcaption>Kształt odkształcony (przeskalowany) wspornika</figcaption>
</Figure>

### Reakcje

<Structure :show-loads="true" show-reactions :nodes="[{label: 'a', coords: [0,0,0], dofs: [0,2, 4]}, {label: 'b', coords: [10,0,0], dofs: []}]" :elements="[{label: '1', nodes: ['a', 'b']}]" :nodal-loads="[{target: 'b', values: { 0: 0, 2: 10, 4: 0 }}]" />

## Podpowiedzi po najechaniu

Najechanie kursorem w widoku to najszybszy sposób odczytania wartości:

- **Węzeł** → `ux`, `uz`, `φy` (przemieszczenia w jednostce długości, obrót w radianach).
- **Element** → jego etykieta, przekrój i materiał.
- **Obciążenie** → jego składowe.

## Zakładka Wyniki

Zakładka **Wyniki** na dolnym pasku ma dwa widoki:

### Wyniki węzłowe

Jeden wiersz na węzeł z **Dx**, **Dz** (jednostka długości) i **Ry** (rad). Znaki są zgodne z osiami globalnymi: dodatnie `Dz` to przemieszczenie w dół, dodatnie `Ry` to obrót przeciwnie do ruchu wskazówek zegara na ekranie.

<figure>

![Wyniki węzłowe](/results_nodes.png)

</figure>

### Wyniki elementów

Jeden wiersz na element z **siłami końcowymi w lokalnym układzie współrzędnych elementu**:

| Kolumna | Znaczenie |
| --- | --- |
| `X12`, `Z12`, `M12` | siła podłużna, siła poprzeczna i moment działające na element w jego węźle **początkowym** |
| `X21`, `Z21`, `M21` | to samo w węźle **końcowym** |

Są to siły, jakimi węzły działają na element (macierz sztywności elementu pomnożona przez jego przemieszczenia końcowe, minus zastępcze obciążenia węzłowe). Dla belki swobodnie podpartej o rozpiętości 6 m pod obciążeniem 12 kN/m otrzymasz `Z12 = Z21 = −36 kN`: obie podpory pchają belkę do góry (ujemne z). Dla wspornika utwierdzonego w węźle początkowym z siłą 18 kN w dół na końcu: `Z12 = −18`, `M12 = +72 kNm`, `Z21 = +18`, `M21 = 0`.

<figure>

![Wyniki elementów](/results_elements.png)

</figure>

### Macierz sztywności

Wybierz **Macierz sztywności** z menu podręcznego elementu lub z wiersza tabeli, aby otworzyć pływające okno z macierzą sztywności elementu 6 × 6 w układzie lokalnym i globalnym — przydatne przy sprawdzaniu ręcznej agregacji na zajęciach z metody przemieszczeń. Wzory znajdziesz w [podręczniku teoretycznym](/pl/elements/beam).

## Precyzja i dokładność

- Element belkowy jest dokładny dla liniowego modelu Timoshenki pod obciążeniem węzłowym, równomiernym, trapezowym, skupionym i termicznym, więc wyniki **nie** zależą od liczby elementów.
- Tabele pokazują cztery cyfry znaczące; obliczenia wewnętrzne są wykonywane w podwójnej precyzji.
- Ugięcia zawierają **odkształcenie od ścinania** (Timoshenko). Dla prętów smukłych dodaje to ułamek procenta w porównaniu ze wzorami Eulera–Bernoulliego; dla prętów wysokich lub krótkich może to być kilka procent. Ustaw dużą wartość współczynnika ścinania przekroju, jeśli chcesz ten wpływ wyeliminować.

## Przenoszenie wyników do sprawozdania

Nie ma eksportu tabel; zaznacz tekst tabeli i skopiuj go albo zrób zrzut ekranu widoku. Aby przekazać model komuś innemu, użyj [Udostępnij model](/pl/essentials/import-export).
