# Rozwiązywanie problemów

## Nie widać żadnych wyników {#no-results-are-drawn}

Wyniki pojawiają się tylko wtedy, gdy model da się rozwiązać. Sprawdź w tej kolejności:

1. **Przeczytaj komunikat w lewym górnym rogu widoku.**
   - *Nie zdefiniowano materiałów.* / *Nie zdefiniowano przekrojów.*: dodaj je przyciskiem **Dodaj nowy**.
   - Niebieska plakietka **Brak podpór**: model jest po prostu niedokończony. Dodaj podpory. Najedź na plakietkę, aby zobaczyć przerywanym zarysem, jak konstrukcja może się jeszcze poruszać.
   - **Czerwony komunikat**: coś jest nie tak. Komunikat nazywa problem albo, gdy jest ich kilka, brzmi *Błędy w modelu: N*. Kliknij **Pokaż szczegóły** i popraw każdą pozycję (zobacz tabelę poniżej). Węzły lub przeguby, których to dotyczy, są zakreślone na płótnie.
   - **Żółty komunikat**: ostrzeżenia. Model mimo to został rozwiązany; możesz je ukryć.
2. **Czy podpór jest dość?** Solver potrzebuje co najmniej trzech zablokowanych stopni swobody, a podpory muszą utrzymać konstrukcję. Belka na dwóch podporach przesuwnych (Dz + Dz) ma tylko dwa i się przesuwa. Dodaj gdzieś `Dx` albo `Ry` w jednej z podpór.
3. **Czy elementy są połączone?** Dwa węzły o tych samych współrzędnych to wciąż dwa oddzielne węzły. Usuń zbędny i połącz ponownie albo wstawiaj węzły na elementach przez **Połącz z konstrukcją**.
4. **Za dużo przegubów?** Przeguby na obu końcach słupa albo kwadrat z prętów połączonych przegubowo bez krzyżulca tworzą mechanizm. EduBeam zakreśla przeguby i pokazuje ruch.
5. **Zerowa sztywność?** `E`, `A` lub `Iy` przypadkowo wpisane jako 0 albo w złej jednostce sprawiają, że część konstrukcji porusza się niemal bez oporu. EduBeam zgłasza to jako *niestateczność*.

![Pokaż szczegóły wymienia każdy problem ze wskazówką i może pokazać ruch](/screenshots/pl/ui-diagnostics.webp){.shot-lg}

## Komunikaty {#messages}

**Pokaż szczegóły** otwiera okno z tytułem *Nie można rozwiązać modelu* (błędy), *Model nie jest jeszcze gotowy do obliczeń* (wciąż brakuje podpór) lub *Ostrzeżenia modelu*. Jego link **Rozwiązywanie problemów** prowadzi tutaj.

### Do uzupełnienia {#still-needed}

| Komunikat | Znaczenie / rozwiązanie |
| --- | --- |
| *Konstrukcja potrzebuje podpór, aby można ją było obliczyć.* | Łącznie mniej niż trzy zablokowane stopnie swobody. Dodaj podpory. |
| *Oddzielna część konstrukcji (węzły …) ma mniej niż 3 podparte stopnie swobody i może się swobodnie przemieszczać.* | Model składa się z kilku części, a jedna z nich „pływa”. Połącz ją lub podeprzyj. |

### Błędy {#errors}

| Komunikat | Znaczenie / rozwiązanie |
| --- | --- |
| *Konstrukcja ma wystarczającą liczbę podpór, ale nie utrzymują jej one: nadal może …* | Wszystkie podpory są równoległe albo ich kierunki działania przecinają się w jednym punkcie. Przerywany zarys pokazuje ruch; zmień kierunek jednej z podpór. Jeśli dotyczy to tylko jednej części, ten sam komunikat wymienia *oddzielną część*. |
| *Podpory utrzymują konstrukcję, ale nadal jest ona mechanizmem: jej pręty mogą się obracać wokół przegubów w węźle …* | Przeguby pozwalają prętom obracać się względem siebie, jak w ramie z przegubami na szczytach obu słupów albo w kwadracie z prętów połączonych przegubowo bez krzyżulca. Usuń przegub albo dodaj pręt lub podporę. |
| *Konstrukcja jest niestateczna – praktycznie bez oporu przemieszcza się: …* | Prawie mechanizm albo sztywność bliska zeru. Sprawdź podpory, przeguby oraz wartości `E`, `A` i `Iy`. |
| *Konstrukcja jest mechanizmem: macierz sztywności jest osobliwa.* | Coś może się swobodnie poruszać, a powyższe sprawdzenia tego nie wychwyciły. Sprawdź, czy każda część jest utrzymywana przez co najmniej trzy więzy i czy przeguby nie pozostawiają pręta swobodnie obracającego się. |
| *Element … odwołuje się do nieistniejącego węzła / materiału / przekroju …* | Obiekt, do którego element się odwołuje, został usunięty, zwykle w ręcznie edytowanym pliku JSON. Przypisz go ponownie w tabeli *Elementy*. |
| *Element … musi odwoływać się do dokładnie 2 węzłów.* | Uszkodzony element w zaimportowanym pliku. Usuń go i utwórz ponownie. |
| *Obciążenie węzłowe / Zadane przemieszczenie #n odwołuje się do nieistniejącego węzła …* | Usuń obciążenie lub przypisz mu węzeł. |
| *Obciążenie elementu #n odwołuje się do nieistniejącego elementu …* | Usuń obciążenie. |
| *Obliczenia nie powiodły się z powodu wewnętrznej niespójności modelu…* | Ogólny błąd. Cofnij ostatni krok albo zapisz plik i [zgłoś problem](https://github.com/janvorisek/edubeam/issues). |

### Ostrzeżenia {#warnings}

Model jest mimo to rozwiązany, ale sprawdź te pozycje:

| Komunikat | Znaczenie / rozwiązanie |
| --- | --- |
| *Węzeł … nie jest połączony z żadnym elementem i jest pomijany w obliczeniach.* | Zbędny węzeł. Usuń go lub połącz. |
| *Węzeł … jest podparty, ale nie łączy się z nim żaden element, więc podpora niczego nie przenosi.* | Podpora na zbędnym węźle. |
| *Element … ma ten sam węzeł na obu końcach.* | Element o zerowej długości. Usuń go. |
| *Obciążenie węzłowe / Zadane przemieszczenie #n zawiera nieprawidłowe wartości.* | Składowa, która nie jest liczbą. Edytuj obciążenie. |

## Wyniki wyglądają źle {#results-look-wrong}

| Objaw | Prawdopodobna przyczyna |
| --- | --- |
| Obciążenia działają w górę | Globalna **oś z jest skierowana w dół**, więc dodatnie `Fz`/`fz` działa w dół. Wartości ujemne działają w górę. Zobacz [konwencje](/pl/elements/conventions). Przy osi y w górę jest odwrotnie. |
| Ugięcie 1000× za duże lub za małe | Pomyłka w jednostkach: `E` wpisane w Pa, gdy jednostką jest MPa, albo `Iy` w cm⁴, gdy jednostką jest m⁴. Sprawdź plakietkę jednostek w prawym dolnym rogu widoku. |
| Ugięcie nieco większe niż ze wzoru podręcznikowego | Odkształcenie postaciowe od ścinania (Timoshenko). Zwiększ współczynnik ścinania przekroju albo użyj smukłego pręta, aby zbliżyć się do wartości Eulera–Bernoulliego. Zobacz [Sprawdzanie wyników ręcznie](/pl/guide/verification). |
| Znak wydaje się „zły” | Znak odczytuj z etykiet, a nie ze strony wykresu. Dodatni M rozciąga dolne włókna. Siły końcowe w *Wynikach elementów* są zgodne z osiami lokalnymi elementu, a nie z konwencją N-V-M. |
| Dwa identyczne słupy mają przeciwne znaki siły tnącej | Znak V zależy od kierunku każdego elementu. Aby porównać, zamień węzły jednego z nich. |
| Liczby typu `4 · 10¹` | Naukowy format liczb. Wybierz *Automatyczny* w *Ustawienia → Język i ustawienia regionalne → Format liczb*. |
| Wykresy są ogromne lub malutkie | Czysto wizualne. Dostosuj **Skala wyników** w *Ustawienia → Ustawienia widoku*. |
| Obciążenie w układzie lokalnym działa w złą stronę | Lokalna oś x elementu biegnie od węzła *początkowego* do *końcowego*. Zamień węzły lub zmień znak. |
| Obciążenie pręta nachylonego jest nie takie, jak trzeba | **LCS** jest domyślnie zaznaczone, więc `fz` działa prostopadle do pręta. Odznacz je, aby uzyskać obciążenie pionowe. |
| Obciążenie termiczne nic nie robi | Konstrukcja statycznie wyznaczalna odkształca się pod wpływem temperatury swobodnie, bez sił przekrojowych. Sprawdź, czy α ≠ 0, a dla gradientu, czy ustawiono wysokość przekroju h. |

## Problemy z interfejsem {#interface-issues}

| Objaw | Rozwiązanie |
| --- | --- |
| Skróty nie działają | Najpierw kliknij płótno: klawisze są ignorowane, gdy aktywne jest pole tekstowe. |
| Nie da się przesunąć widoku | Domyślnie widok przesuwa się środkowym lub prawym przyciskiem myszy; zmienisz to w *Ustawienia → Sterowanie i skróty*. Na gładziku przewijanie dwoma palcami powiększa; aby przesunąć widok, kliknij i przeciągnij dwoma palcami. |
| Mój model zniknął | Otwarcie linku, pliku lub przykładu oraz czyszczenie zachowują stary model: **☰ → Ostatnie modele** lub <kbd>Ctrl</kbd>+<kbd>Z</kbd>. |
| Zły język | *Ustawienia → Język i ustawienia regionalne* albo dodaj `?lang=pl` do adresu. |
| Zmiany ustawień się nie zapisują | Pamięć lokalna jest zablokowana (okno prywatne, ścisły tryb prywatności). Potrzebują jej ustawienia, automatyczny zapis i Ostatnie modele. |

## Zgłaszanie błędu {#reporting-a-bug}

Utwórz [zgłoszenie na GitHubie](https://github.com/janvorisek/edubeam/issues), podając przeglądarkę i system operacyjny, czego się spodziewałeś, a przede wszystkim **link do udostępniania** lub **plik projektu**, który odtwarza problem.
