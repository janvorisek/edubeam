# Příklady

Každá karta níže je živý, vyřešený model. Kliknutím ho otevřete v <Edubeam /> s kompletním zadáním připraveným k úpravám – pak přetáhněte uzel, změňte zatížení nebo zaškrtněte kloub a sledujte, jak průběhy reagují.

<br>

<FeatureStructures />

Tytéž modely najdete v aplikaci pod **☰ → Příklady** a odkaz [run.edubeam.app/?panel=examples](https://run.edubeam.app/?panel=examples&lang=cs){target="_blank"} otevře tuto galerii přímo.

## Náměty na cvičení {#suggested-exercises}

- **Staticky neurčitý nosník**: odškrtněte `Ry` ve vetknutí, aby vznikl prostý nosník. O kolik vzroste moment uprostřed rozpětí?
- **Konzola**: porovnejte průhyb na konci s $FL^3/3EI$ (viz [Ověření výsledků ručně](/cs/guide/verification)), pak v záložce *Průřezy* zmenšete $I_y$ na polovinu.
- **Prattův příhradový nosník**: styčníky v tomto příkladu jsou tuhé. Zaškrtněte u každého prutu oba koncové klouby, aby vznikla skutečná příhradová konstrukce, a porovnejte normálové síly. Teď odstraňte jednu diagonálu: stojí příhradovina dál?
- **Spojitý nosník o třech polích**: nosník je podepřen jen na koncích. Zaškrtněte `Dz` ve vnitřních uzlech B a C, aby vznikl spojitý nosník, a sledujte, jak se nad podporami objeví záporné momenty.
- **Rámová konstrukce**: zaškrtněte oba koncové klouby příčle, abyste namodelovali kloubové připojení příčle ke sloupům, nebo změňte pravou podporu z posuvného kloubu na pevný kloub.
- **Teplotní zatížení**: podepřete `Dx` v obou podporách a sledujte, jak se objeví normálová síla.

## Řešené návody {#worked-tutorials}

- [Trojkloubový rám](/cs/tutorials/three-hinged-frame): reakce, N, V a M ověřené ručním výpočtem.
- [Rovinná příhradová konstrukce](/cs/tutorials/truss): metoda styčných bodů, průsečná metoda a nulový prut.

## Přispějte příkladem {#contribute-an-example}

Máte dobrý výukový model? Sdílejte ho odkazem na [GitHub Discussions](https://github.com/janvorisek/edubeam/discussions) nebo [Twitteru](https://twitter.com/EdubeamApp) a přidáme ho do galerie.
