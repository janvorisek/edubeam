# Wyniki i wykresy

<Edubeam /> rozwiązuje model po każdej zmianie, najwyżej kilka razy na sekundę, więc wyniki są zawsze aktualne. Nie ma przycisku *Oblicz*. Jeśli nic nie jest rysowane, modelu nie da się jeszcze rozwiązać; komunikat w lewym górnym rogu widoku mówi dlaczego (zobacz [Rozwiązywanie problemów](/pl/reference/troubleshooting)).

Wszystkie rysunki na tej stronie pokazują ten sam model: [ramę trójprzegubową](/pl/tutorials/three-hinged-frame) pod obciążeniem 10 kN/m.

## Wykresy w widoku {#overlays-in-the-viewer}

Włączasz je i wyłączasz w **opcjach wyświetlania** w prawym górnym rogu widoku (przycisk ⚙ je pokazuje lub ukrywa).

| Wykres | Kolor (domyślny) | Uwagi |
| --- | --- | --- |
| **Kształt odkształcony** | szary | W powiększeniu: największe przemieszczenie jest rysowane jako odcinek o długości *Skala wyników* w pikselach. Domyślnie włączony. |
| **N (x)**, siła normalna | niebieski | Rozciąganie jest dodatnie. Stała wzdłuż elementu, chyba że działa na niego obciążenie osiowe. |
| **V<sub>z</sub> (x)**, siła tnąca | zielony | Liniowa pod obciążeniem równomiernym, kwadratowa pod trapezowym, ze skokiem w miejscu siły skupionej. |
| **M<sub>y</sub> (x)**, moment zginający | czerwony | Dodatni moment rozciąga dolne włókna. Opisany na obu końcach, w miejscach sił skupionych i w każdym ekstremum lokalnym (gdzie V = 0). Domyślnie włączony. |
| **Reakcje** | fioletowy | Strzałka i wartość dla każdego zablokowanego stopnia swobody. Domyślnie włączone. |

Wartości są opisywane w charakterystycznych punktach każdego wykresu. Orientację etykiet, rozmiar wykresów i kolory można zmienić w [Ustawieniach](/pl/essentials/units-settings#viewer-settings).

<div class="shots">

![Siła normalna N: oba słupy są ściskane siłą 40 kN, rygiel siłą 20 kN](/screenshots/pl/results-normal.webp)

![Siła tnąca V: 20 kN w słupach; w ryglu 40 kN w narożach, malejąca do zera w przegubie](/screenshots/pl/results-shear.webp)

![Moment zginający M: −80 kNm w obu narożach, zero u podstaw i w przegubie](/screenshots/pl/results-moment.webp)

![Kształt odkształcony (w powiększeniu): przegub w C się obniża](/screenshots/pl/results-deformed.webp)

</div>

![Reakcje: 40 kN pionowo i 20 kN poziomo w każdej podporze przegubowej](/screenshots/pl/results-reactions.webp){.shot-lg}

### Odczytywanie znaku {#reading-the-sign}

Znak wartości odczytuj z jej etykiety, a nie z tego, po której stronie pręta narysowano wykres. Ujemny moment zginający rozciąga górne włókna belki albo zewnętrzną stronę naroża ramy.

## Podpowiedzi po najechaniu {#hover-tooltips}

Najechanie kursorem na obiekt to najszybszy sposób odczytania wartości:

- **Węzeł**: `ux`, `uz` i `φy` (przemieszczenia w jednostce przemieszczenia, obrót w radianach).
- **Element**: jego etykieta, przekrój i materiał.
- **Obciążenie**: jego składowe.

Na ekranie dotykowym stuknij obiekt. Te same szczegóły pojawią się w jego panelu zaznaczenia.

![Najechanie na węzeł 2 belki z szybkiego startu](/screenshots/pl/ui-hover.webp){.shot-sm}

## Zakładka Wyniki {#results-tab}

Zakładka **Wyniki** na dolnym pasku ma dwie tabele, przełączane przyciskami **Wyniki węzłowe** i **Wyniki elementów**.

### Wyniki węzłowe {#nodal-results}

Jeden wiersz na węzeł z **Dx**, **Dz** (jednostka przemieszczenia) i **Ry** (rad). Znaki są zgodne z osiami globalnymi: dodatnie `Dz` oznacza przemieszczenie w dół, a dodatnie `Ry` obrót przeciwnie do ruchu wskazówek zegara na ekranie.

![Wyniki węzłowe ramy trójprzegubowej (Format liczb: Automatyczny)](/screenshots/pl/results-nodal.webp)

### Wyniki elementów {#element-results}

Jeden wiersz na element z **siłami końcowymi w lokalnym układzie współrzędnych elementu**:

| Kolumna | Znaczenie |
| --- | --- |
| `X12`, `Z12`, `M12` | siła osiowa, siła tnąca i moment działające na element w jego węźle **początkowym** |
| `X21`, `Z21`, `M21` | to samo w węźle **końcowym** |

![Wyniki elementów ramy trójprzegubowej](/screenshots/pl/results-element.webp)

Są to siły, jakimi węzły działają na element: macierz sztywności elementu pomnożona przez jego przemieszczenia końcowe minus zastępcze obciążenia węzłowe. Są zgodne z osiami lokalnymi, a nie z konwencją N-V-M wykresów:

- Dla belki swobodnie podpartej o rozpiętości 6 m z [szybkiego startu](/pl/guide/quick-start): `Z12 = Z21 = −36 kN`. Obie podpory pchają belkę w górę, czyli w kierunku −z.
- Dla wspornika utwierdzonego w węźle początkowym, z siłą 18 kN skierowaną w dół na końcu: `Z12 = −18 kN`, `M12 = +72 kNm`, `Z21 = +18 kN`, `M21 = 0`.
- Dla słupa 1 ramy (A na dole, B na górze): `X12 = +40 kN` pcha wzdłuż lokalnej osi x w głąb elementu, co oznacza ściskanie siłą 40 kN.

### Eksport CSV i kopiowanie {#export-csv-and-copy}

**Eksportuj CSV** pobiera plik `edubeam-results.csv` z obiema tabelami, w jednostkach wyświetlanych na ekranie i gotowy do arkusza kalkulacyjnego. Tabela węzłów zawiera też **reakcje** `Rx`, `Rz`, `My`. **Kopiuj** umieszcza te same tabele w schowku jako tekst rozdzielany tabulatorami, który wkleja się bezpośrednio do Excela, LibreOffice lub Arkuszy Google. W eksporcie siły końcowe elementów mają nazwy `N1 V1 M1 N2 V2 M2`.

### Macierz sztywności {#stiffness-matrix}

Wybierz **Macierz sztywności** w panelu elementu lub w jego wierszu tabeli, aby otworzyć okno z macierzą sztywności elementu 6 × 6 w układzie globalnym, przydatną do sprawdzania ręcznej agregacji na kursie metody przemieszczeń. Wzory znajdziesz w [podręczniku teoretycznym](/pl/elements/beam).

## Format liczb {#number-format}

Wyniki są wyświetlane z pięcioma cyframi znaczącymi. **Ustawienia → Język i ustawienia regionalne → Format liczb** decyduje o sposobie ich zapisu:

| Format | 40 000 zapisane jako | Do czego |
| --- | --- | --- |
| **Naukowy** (domyślny) | 4 · 10⁴ | wartości obejmujące wiele rzędów wielkości |
| **Inżynierski** | 40 · 10³ | zgodność z przedrostkami kilo / mega |
| **Automatyczny** | 40000 | zwykłe liczby w nauczaniu |

Format automatyczny zapisuje wartości od 0,001 do 100 000 jako zwykłe liczby, a poza tym zakresem przechodzi na potęgi dziesięciu. Separator dziesiętny zależy od języka.

## Precyzja i dokładność {#precision-and-accuracy}

- Element belkowy jest dokładny dla liniowego modelu Timoshenki pod obciążeniami węzłowymi, równomiernymi, trapezowymi, skupionymi i termicznymi, więc wyniki **nie** zależą od liczby elementów.
- Obliczenia są prowadzone w podwójnej precyzji. Bardzo małe wartości, takie jak `1,5 · 10⁻¹⁸`, to błędy zaokrągleń i oznaczają zero.
- Ugięcia uwzględniają **odkształcenie postaciowe od ścinania**. Dla prętów smukłych dodaje ono ułamek procenta do wartości Eulera–Bernoulliego; dla prętów wysokich lub krótkich może to być kilka procent. Aby je wyeliminować, ustaw dużą wartość współczynnika ścinania przekroju.

## Wyniki w sprawozdaniu {#results-in-a-report}

- **☰ → Eksportuj obraz** (<kbd>Ctrl</kbd>+<kbd>P</kbd>) zapisuje rysunek jako PNG lub SVG z wybranymi wykresami. Zobacz [Eksport obrazu](/pl/essentials/import-export#export-an-image).
- **Wyniki → Eksportuj CSV** lub **Kopiuj** dają liczby.
- **Udostępnij model** daje link, dzięki któremu czytelnik może otworzyć sam model.
