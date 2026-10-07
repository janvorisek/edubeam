# Výuka s EduBeamem

<Edubeam /> vznikl v posluchárně a tam se mu také daří nejlépe: model na projektoru reaguje na každou změnu a díky odkazu má tentýž model každý student ve svém notebooku. Na této stránce najdete to, co vyučující používají nejčastěji.

## Na přednášce {#in-the-lecture}

- **Zajistěte čitelnost i z poslední řady.** V *Nastavení → Nastavení zobrazení* zvyšte **Velikost písma** na 18–20 px a **Velikost podpor** na 130–150 %. Pokud průběhy na velkém plátně zanikají, zvětšete **Měřítko výsledků**.
- **Ukazujte vždy jen jednu věc.** V možnostech zobrazení vypněte vše kromě veličiny, o které právě mluvíte, a další přidávejte postupně.
- **Upravujte model živě.** Přetáhněte podporu, zaškrtněte `Ry`, přidejte kloub. Studenti hned vidí příčinu i následek a zkratkou <kbd>Ctrl</kbd>+<kbd>Z</kbd> se kdykoli vrátíte.
- **Nechte řešič vysvětlit mechanismy.** Uvolněte o jeden kloub víc, než konstrukce snese, a EduBeam rozpohybuje čárkovaný obrys mechanismu a zakroužkuje klouby, které ho způsobují. Výborná příležitost probrat stabilitu.
- **Přizpůsobte aplikaci svým studentům.** Zvolte jazyk rozhraní, jednotky SI nebo americké a osu z dolů, nebo y nahoru – tak, jak je máte ve skriptech.

![Odhalený mechanismus: klouby v B a C umožňují vodorovný posun rámu](/screenshots/cs/ui-mechanism.webp)

## Ve skriptech a zadáních {#in-lecture-notes-and-assignments}

Sdílený odkaz obsahuje celý model, takže funguje všude, kam lze vložit odkaz: v PDF, na snímku prezentace, na stránce v LMS nebo v e‑mailu.

1. Sestavte model a klikněte na **Sdílet konstrukci → Kopírovat**.
2. Vložte odkaz do svých materiálů. Odkazy ze starších verzí EduBeamu fungují dál, takže vaše skripta zůstanou platná i za několik let.
3. Každý student, který odkaz otevře, dostane vlastní kopii a může s ní libovolně experimentovat. Jeho změny se nedostanou k vám ani ke spolužákům.

Užitečné varianty odkazu:

| Odkaz | Otevře |
| --- | --- |
| `https://run.edubeam.app/?model=…` | Model připravený k úpravám |
| `https://run.edubeam.app/?viewer=1&model=…` | Model v [režimu prohlížeče](/cs/essentials/import-export#embed-a-read-only-viewer) pro vložení do `<iframe>` |
| `https://run.edubeam.app/?panel=examples` | Galerii příkladů |
| `https://run.edubeam.app/?lang=cs` | Aplikaci v češtině (nebo v kterémkoli [jiném jazyce podle kódu](/cs/essentials/import-export#url-parameters)) |

::: warning Odkaz nahradí model, který má student otevřený
Původní model se přesune do **☰ → Nedávné konstrukce**, odkud ho lze obnovit, a aplikace na to upozorní. Přesto studentům doporučte, aby si důležitou práci před otevřením odkazů z výuky uložili pomocí **Uložit projekt**.
:::

## Zadání, která si studenti zkontrolují sami {#assignments-students-can-check-themselves}

EduBeam dává studentům okamžitou zpětnou vazbu k ručním výpočtům, aniž by jim prozradil postup:

- Zadejte ruční výpočet reakcí, vnitřních sil a jednoho posunutí a nechte studenty model sestavit a výsledky porovnat. Hotové vzorce najdete v kapitole [Ověření výsledků ručně](/cs/guide/verification).
- Ptejte se, *proč* se výsledky liší: smyková deformace, chybějící kloub, zatížení zadané v lokálních místo v globálních osách.
- Chtějte po studentech, aby k výpočtu přiložili sdílený odkaz nebo soubor `project.json`. Po otevření uvidíte přesně to, co namodelovali.
- Do zpráv mohou studenti exportovat výkres jako **SVG** (ostrý ve Wordu i v LaTeXu) a výsledky jako **CSV**.

## Hotová cvičení {#ready-made-exercises}

- Na stránce [Příklady](/cs/examples/) najdete šest modelů a ke každému náměty na cvičení.
- Návody [trojkloubový rám](/cs/tutorials/three-hinged-frame) a [rovinná příhradová konstrukce](/cs/tutorials/truss) jsou kompletně řešené příklady s ručním ověřením.
- [Rychlý start](/cs/guide/quick-start) se hodí jako první cvičení: zabere asi deset minut.

## Jak se studenty začít {#getting-students-started}

Nové uživatele přivítá dialog se dvěma průvodci: **Provést aplikací** (prohlídka rozhraní) a **Nakreslit první nosník** (úkol o sedmi krocích s myší). Obě volby najdete i v nabídce ☰. Mnoho vyučujících na začátku prvního cvičení prostě řekne: „Otevřete run.edubeam.app a zvolte *Nakreslit první nosník*.“

## Offline a počítače v učebnách {#offline-and-lab-computers}

EduBeam je progresivní webová aplikace (PWA). Jakmile ji počítač jednou načte, funguje i bez připojení k internetu a prohlížeč může nabídnout její instalaci. Modely a nastavení se ukládají zvlášť pro každý profil prohlížeče. Na sdílených počítačích v učebnách by si proto studenti měli ukládat práci do souborů nebo odkazů.
