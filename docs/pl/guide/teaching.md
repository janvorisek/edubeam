# Nauczanie z EduBeam

<Edubeam /> narodził się w sali wykładowej i tam wciąż sprawdza się najlepiej: model na projektorze, który reaguje w chwili, gdy go zmieniasz, i ten sam model na laptopie każdego studenta dzięki linkowi. Ta strona zbiera to, z czego prowadzący korzystają najczęściej.

## Na wykładzie {#in-the-lecture}

- **Zadbaj o czytelność z ostatniego rzędu.** W *Ustawienia → Ustawienia widoku* zwiększ **Rozmiar czcionki** do 18–20 px, a **Rozmiar podpór** do 130–150 %. Zwiększ **Skala wyników**, jeśli wykresy wyglądają na dużym ekranie zbyt skromnie.
- **Pokazuj jedną rzecz naraz.** Odznacz w opcjach wyświetlania wszystko oprócz wielkości, o której mówisz, a potem dodawaj kolejne po jednej.
- **Zmieniaj model na żywo.** Przeciągnij podporę, zaznacz `Ry`, dodaj przegub. Studenci od razu widzą przyczynę i skutek, a <kbd>Ctrl</kbd>+<kbd>Z</kbd> przywraca poprzedni stan.
- **Pozwól solverowi wyjaśniać mechanizmy.** Zwolnij o jeden przegub za dużo, a EduBeam pokaże ruch mechanizmu przerywanym zarysem i zakreśli winne przeguby. To dobry moment, by porozmawiać o stateczności.
- **Używaj języka i osi swoich studentów.** Wybierz język interfejsu, jednostki SI lub amerykańskie oraz oś z w dół lub y w górę, tak by pasowały do Twoich materiałów.

![Mechanizm pokazany wprost: przeguby w B i C pozwalają ramie się przechylić](/screenshots/pl/ui-mechanism.webp)

## W materiałach do wykładu i zadaniach {#in-lecture-notes-and-assignments}

Link do udostępniania zawiera cały model, więc działa wszędzie tam, gdzie działa link: w PDF, na slajdzie, na stronie platformy e-learningowej, w e-mailu.

1. Zbuduj model i naciśnij **Udostępnij model → Kopiuj**.
2. Wklej link do swoich materiałów. Linki ze starszych wersji EduBeam nadal działają, więc materiały pozostają aktualne rok po roku.
3. Studenci, którzy go otworzą, dostają własną kopię do eksperymentów. Nic, co zmienią, nie trafi do Ciebie ani do innych studentów.

Przydatne warianty linków:

| Link | Otwiera |
| --- | --- |
| `https://run.edubeam.app/?model=…` | Model gotowy do edycji |
| `https://run.edubeam.app/?viewer=1&model=…` | Model w [trybie podglądu](/pl/essentials/import-export#embed-a-read-only-viewer), do osadzenia w `<iframe>` |
| `https://run.edubeam.app/?panel=examples` | Galerię przykładów |
| `https://run.edubeam.app/?lang=cs` | Aplikację po czesku (lub w dowolnym [innym języku](/pl/essentials/import-export#url-parameters)) |

::: warning Otwarcie linku zastępuje własny model studenta
Model, który student miał wcześniej, trafia do **☰ → Ostatnie modele** i można go przywrócić, o czym informuje komunikat. Mimo to poproś studentów, by przed otwarciem linków z zajęć zapisali ważną pracę przez **Zapisz projekt**.
:::

## Zadania, które studenci mogą sprawdzić sami {#assignments-students-can-check-themselves}

EduBeam daje studentom natychmiastową informację zwrotną o ich obliczeniach ręcznych, nie zdradzając metody:

- Poproś o ręczne wyznaczenie reakcji, sił przekrojowych i jednego przemieszczenia, a potem o zbudowanie modelu i porównanie wyników. Strona [Sprawdzanie wyników ręcznie](/pl/guide/verification) zawiera gotowe wzory.
- Zapytaj, *dlaczego* wynik się różni: odkształcenie postaciowe od ścinania, brakujący przegub, obciążenie w osiach lokalnych zamiast globalnych.
- Poproś studentów, by razem z obliczeniami oddali link do udostępniania lub plik `project.json`. Możesz go otworzyć i zobaczyć dokładnie, co zamodelowali.
- Do sprawozdań studenci mogą wyeksportować rysunek jako **SVG** (ostry w Wordzie i LaTeX-u), a wyniki jako **CSV**.

## Gotowe ćwiczenia {#ready-made-exercises}

- Strona [Przykłady](/pl/examples/) zawiera sześć modeli, każdy z proponowanymi ćwiczeniami.
- Samouczki [rama trójprzegubowa](/pl/tutorials/three-hinged-frame) i [kratownica płaska](/pl/tutorials/truss) to kompletne rozwiązane przykłady ze sprawdzeniem ręcznym.
- [Szybki start](/pl/guide/quick-start) sprawdza się jako instrukcja na pierwsze zajęcia laboratoryjne: zajmuje około dziesięciu minut.

## Jak zacząć ze studentami {#getting-students-started}

Nowi użytkownicy widzą okno powitalne z dwiema prowadzonymi opcjami: **Oprowadź mnie** (przegląd interfejsu) i **Narysuj pierwszą belkę** (zadanie w siedmiu krokach z użyciem myszy). Obie są też w menu ☰. Wielu prowadzących na początku pierwszych zajęć mówi po prostu: „otwórzcie run.edubeam.app i wybierzcie *Narysuj pierwszą belkę*”.

## Praca offline i komputery w laboratorium {#offline-and-lab-computers}

EduBeam jest progresywną aplikacją webową (PWA). Gdy komputer raz ją wczyta, działa dalej bez połączenia, a przeglądarka może zaproponować jej instalację. Modele i ustawienia są przechowywane osobno dla każdego profilu przeglądarki, dlatego na współdzielonych komputerach w laboratorium studenci powinni zapisywać swoją pracę jako pliki lub linki.
