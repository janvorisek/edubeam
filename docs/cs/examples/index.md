# Příklady

Každá karta níže je živý, vyřešený model. Po kliknutí se otevře v aplikaci <Edubeam /> s kompletním zadáním, připravený k úpravám. Pak stačí přetáhnout uzel, změnit zatížení nebo zaškrtnout kloub a sledovat, jak průběhy reagují.

<br>

<FeatureStructures />

Tytéž modely najdete v aplikaci v **☰ → Příklady** a odkaz [run.edubeam.app/?panel=examples](https://run.edubeam.app/?panel=examples&lang=cs){target="_blank"} otevře galerii přímo.

## Náměty na cvičení {#suggested-exercises}

- **Staticky neurčitý nosník**: odškrtněte `Ry` ve vetknutí a vznikne prostý nosník. O kolik vzroste moment uprostřed rozpětí?
- **Konzola**: porovnejte průhyb na konci s $FL^3/3EI$ (viz [Ověření výsledků ručně](/cs/guide/verification)) a pak v záložce *Průřezy* zmenšete $I_y$ na polovinu.
- **Prattův příhradový nosník**: styčníky jsou v tomto příkladu tuhé. Zaškrtněte u každého prutu oba koncové klouby, aby vznikla skutečná příhradová konstrukce, a porovnejte normálové síly. Pak odstraňte jednu diagonálu: udrží se konstrukce?
- **Spojitý nosník o třech polích**: nosník je podepřený jen na koncích. Zaškrtnutím `Dz` ve vnitřních uzlech B a C z něj uděláte spojitý nosník; sledujte, jak se nad podporami objeví záporné momenty.
- **Rámová konstrukce**: zaškrtnutím obou koncových kloubů příčle namodelujete její kloubové připojení ke sloupům. Případně změňte pravou podporu z posuvného kloubu na pevný kloub.
- **Teplotní zatížení**: podepřete `Dx` v obou podporách a sledujte, jak vznikne normálová síla.

## Řešené návody {#worked-tutorials}

- [Trojkloubový rám](/cs/tutorials/three-hinged-frame): reakce, N, V a M ověřené ručním výpočtem.
- [Rovinná příhradová konstrukce](/cs/tutorials/truss): metoda styčných bodů, průsečná metoda a nulový prut.

## Přispějte příkladem {#contribute-an-example}

Máte model, který se osvědčil ve výuce? Sdílejte odkaz na něj v [GitHub Discussions](https://github.com/janvorisek/edubeam/discussions) nebo na [Twitteru](https://twitter.com/EdubeamApp) a přidáme ho do galerie.
