# Przykłady

Każda karta poniżej to żywy, rozwiązany model. Kliknij jedną z nich, aby otworzyć ją w <Edubeam /> z pełną konfiguracją gotową do edycji — a potem przeciągnij węzeł, zmień obciążenie lub zaznacz przegub i obserwuj, jak wykresy podążają za zmianami.

<br>

<FeatureStructures />

Te same modele znajdziesz w aplikacji pod **☰ → Przykłady**, a [run.edubeam.app/?panel=examples](https://run.edubeam.app/?panel=examples&lang=pl){target="_blank"} otwiera tę galerię bezpośrednio.

## Proponowane ćwiczenia {#suggested-exercises}

- **Belka statycznie niewyznaczalna**: odznacz `Ry` w utwierdzeniu, aby otrzymać belkę swobodnie podpartą. O ile wzrośnie moment w środku rozpiętości?
- **Wspornik**: porównaj ugięcie końca z $FL^3/3EI$ (zobacz [Sprawdzanie wyników ręcznie](/pl/guide/verification)), a następnie zmniejsz $I_y$ o połowę w zakładce *Przekroje*.
- **Kratownica Pratta**: węzły w tym przykładzie są sztywne. Zaznacz oba przeguby końcowe w każdym pręcie, aby otrzymać prawdziwą kratownicę, i porównaj siły osiowe. Teraz usuń jeden krzyżulec: czy kratownica nadal stoi?
- **Belka ciągła trzyprzęsłowa**: belka jest podparta tylko na końcach. Zaznacz `Dz` w węzłach wewnętrznych B i C, aby stała się ciągła, i obserwuj, jak nad podporami pojawiają się momenty ujemne.
- **Rama portalowa**: zaznacz oba przeguby końcowe rygla, aby zamodelować przegubowe połączenia rygla ze słupami, albo zamień prawą podporę przesuwną na nieprzesuwną.
- **Obciążenie termiczne**: zablokuj `Dx` na obu podporach i obserwuj, jak pojawia się siła osiowa.

## Rozwiązane samouczki {#worked-tutorials}

- [Rama trójprzegubowa](/pl/tutorials/three-hinged-frame): reakcje, N, V i M sprawdzone ręcznie.
- [Kratownica płaska](/pl/tutorials/truss): metoda równoważenia węzłów, metoda Rittera i pręt zerowy.

## Dodaj własny przykład {#contribute-an-example}

Masz dobry model dydaktyczny? Podziel się nim linkiem na [GitHub Discussions](https://github.com/janvorisek/edubeam/discussions) lub [Twitterze](https://twitter.com/EdubeamApp), a dodamy go do galerii.
