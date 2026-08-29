# Rozwiązywanie problemów

## Nie rysują się żadne wyniki

Wyniki pojawiają się tylko wtedy, gdy model da się rozwiązać. Sprawdź w tej kolejności:

1. **Czy w widoku jest czerwony komunikat?** *Nie zdefiniowano materiałów.* / *Nie zdefiniowano przekrojów.* → dodaj je. *Model has N error(s)* → kliknij **Show details** i popraw każdą pozycję (zobacz tabelę poniżej). Komunikaty solvera są obecnie wyświetlane po angielsku.
2. **Wystarczająco podpór?** Solver potrzebuje co najmniej trzech zablokowanych stopni swobody *i* braku mechanizmu. Belka na dwóch podporach przesuwnych (Dz + Dz) ma tylko dwa i „odjeżdża”; rama z samymi przegubami i bez stężeń może być mechanizmem nawet przy wielu podporach. Dodaj gdzieś `Dx` albo `Ry` na jednej z podpór.
3. **Czy elementy są połączone?** Dwa węzły o tych samych współrzędnych to wciąż dwa osobne węzły. Usuń zbędny i połącz ponownie albo umieszczaj węzły na elementach przez **Połącz z konstrukcją**.
4. **Przeguby wszędzie?** Węzeł, w którym każdy element ma przegub i który nie ma podpory `Ry`, ma nieokreślony obrót. Odznacz jeden przegub lub zablokuj `Ry` w tym węźle.
5. **Absurdalne liczby** (przemieszczenia w milionach) oznaczają, że konstrukcja jest prawie mechanizmem; EduBeam ukrywa takie wyniki. Szukaj brakującej podpory lub niemal zerowej sztywności (`E`, `A` lub `Iy` przypadkowo wpisane jako 0 albo w złej jednostce).

## Komunikaty o błędach

Komunikaty z **Show details** (okno *Cannot solve model*) — w aplikacji są obecnie po angielsku:

| Komunikat | Znaczenie / rozwiązanie |
| --- | --- |
| *Model needs at least 3 constrained DOFs to be stable in 2D analysis.* | Dodawaj podpory, aż łącznie zablokowane będą co najmniej trzy stopnie swobody. |
| *Element X references missing node / material / cross section Y.* | Obiekt, do którego odwołuje się element, został usunięty (zwykle przez ręcznie edytowany plik JSON). Przypisz go ponownie w tabeli *Elementy*. |
| *Element X must reference exactly 2 nodes.* | Uszkodzony element w importowanym pliku; usuń go i utwórz ponownie. |
| *Nodal load / Prescribed displacement #n references missing node Y.* | Usuń obciążenie lub przypisz je do innego węzła. |
| *Element load #n references missing element Y.* | Usuń obciążenie. |
| *Solver failed due to an internal model inconsistency…* | Błąd ogólny; cofnij ostatni krok lub zapisz plik i [zgłoś problem](https://github.com/janvorisek/edubeam/issues). |

Ostrzeżenia (okno *Model warnings*) nie zatrzymują obliczeń: *Element X references the same node at both ends* (element o zerowej długości — usuń go) oraz *… contains invalid values* (obciążenie z nieliczbową składową — popraw je).

## Wyniki wyglądają błędnie

| Objaw | Prawdopodobna przyczyna |
| --- | --- |
| Obciążenia działają do góry | Globalna oś **z jest skierowana w dół**, więc dodatnie `Fz`/`fz` działa w dół. Wartości ujemne działają do góry. Zobacz [konwencje znaków](/pl/elements/conventions). |
| Ugięcie 1000× za duże lub za małe | Pomyłka w jednostkach — `E` wpisane w Pa, gdy jednostką jest MPa, albo `Iy` w cm⁴, gdy jednostką jest m⁴. Sprawdź plakietkę jednostek w prawym dolnym rogu widoku. |
| Ugięcie nieco większe niż ze wzoru podręcznikowego | Odkształcenie od ścinania (Timoshenko). Zwiększ współczynnik ścinania przekroju (lub użyj smuklejszego pręta), aby zbliżyć się do wartości Eulera–Bernoulliego. Zobacz [Sprawdzanie wyników ręcznie](/pl/guide/verification). |
| Wykres momentów jest po „złej” stronie | Strona to wyłącznie konwencja rysunkowa; znak odczytuj z etykiet — dodatni oznacza rozciąganie dolnych włókien. |
| Wykresy są ogromne / maleńkie | Kwestia czysto wizualna — zmień **Skala wyników** w *Ustawienia → Ustawienia widoku*. |
| Obciążenie w układzie lokalnym działa w złą stronę | Lokalna oś x elementu biegnie od węzła *początkowego* do *końcowego*. Użyj **Zamień kolejność węzłów** lub zmień znak. |
| Obciążenie termiczne nic nie robi | Układy statycznie wyznaczalne odkształcają się swobodnie pod wpływem temperatury, bez sił przekrojowych. Sprawdź, czy α ≠ 0 oraz — dla części nierównomiernej — czy ustawiona jest wysokość przekroju h. |

## Problemy z interfejsem

| Objaw | Rozwiązanie |
| --- | --- |
| Skróty nie działają | Najpierw kliknij na płótnie — klawisze są ignorowane, gdy fokus ma pole tekstowe. |
| Nie da się przesuwać widoku | Przesuwanie domyślnie używa środkowego/prawego przycisku myszy; zmień to w *Ustawienia → Sterowanie i skróty*. Na touchpadzie użyj dwóch palców lub przełącz ustawienie na *Prawy przycisk*. |
| Model zniknął po aktualizacji | Aktualizacja, która resetuje pamięć, jest najpierw zapowiadana w oknie dialogowym; anuluj ją i zapisz projekt przed aktualizacją. |
| Zły język | *Ustawienia → Język i ustawienia regionalne* lub dodaj `?lang=pl` do adresu URL. |
| Zmiany ustawień nie zapisują się | Pamięć lokalna jest zablokowana (okno prywatne, ścisły tryb prywatności). Ustawienia i automatyczny zapis jej wymagają. |

## Zgłaszanie błędu

Otwórz [zgłoszenie na GitHubie](https://github.com/janvorisek/edubeam/issues), podając przeglądarkę i system operacyjny, czego oczekiwałeś oraz — co najbardziej pomocne — **link do udostępnienia** lub **plik JSON projektu** odtwarzający problem.
