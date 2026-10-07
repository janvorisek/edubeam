# Výuka s EduBeam

<Edubeam /> vznikl v posluchárně a tam také funguje nejlépe: model na projektoru, který reaguje v okamžiku, kdy ho změníte, a tentýž model díky odkazu na notebooku každého studenta. Tato stránka shrnuje, co vyučující používají nejčastěji.

## Na přednášce {#in-the-lecture}

- **Zajistěte čitelnost i z poslední řady.** V *Nastavení → Nastavení zobrazení* zvyšte **Velikost písma** na 18–20 px a **Velikost podpor** na 130–150 %. Pokud průběhy na velkém plátně působí nevýrazně, zvyšte **Měřítko výsledků**.
- **Ukazujte vždy jen jednu věc.** V možnostech zobrazení vypněte vše kromě veličiny, o které právě mluvíte, a ostatní pak přidávejte jednu po druhé.
- **Měňte model živě.** Přetáhněte podporu, zaškrtněte `Ry`, přidejte kloub. Studenti okamžitě vidí příčinu a následek a <kbd>Ctrl</kbd>+<kbd>Z</kbd> vás vrátí zpět.
- **Nechte řešič vysvětlit mechanismy.** Uvolněte o jeden kloub víc, než je potřeba, a EduBeam rozkývá čárkovaný obrys mechanismu a zakroužkuje klouby, které za to mohou. Je to dobrá chvíle probrat stabilitu.
- **Používejte jazyk a osy svých studentů.** Zvolte jazyk rozhraní, jednotky SI nebo americké a osu z dolů nebo y nahoru tak, aby odpovídaly vašim skriptům.

![Mechanismus odhalený: klouby v B a C umožňují rámu vodorovný posun](/screenshots/cs/ui-mechanism.webp)

## Ve skriptech a zadáních {#in-lecture-notes-and-assignments}

Sdílený odkaz obsahuje celý model, takže funguje všude, kde funguje odkaz: v PDF, na snímku prezentace, na stránce v LMS nebo v e‑mailu.

1. Sestavte model a stiskněte **Sdílet konstrukci → Kopírovat**.
2. Vložte odkaz do svých materiálů. Odkazy ze starších verzí EduBeam fungují dál, takže skripta zůstávají platná rok co rok.
3. Studenti, kteří odkaz otevřou, dostanou vlastní kopii, se kterou mohou experimentovat. Nic z toho, co změní, se nedostane k vám ani k ostatním studentům.

Užitečné varianty odkazu:

| Odkaz | Otevře |
| --- | --- |
| `https://run.edubeam.app/?model=…` | Model připravený k úpravám |
| `https://run.edubeam.app/?viewer=1&model=…` | Model v [režimu prohlížeče](/cs/essentials/import-export#embed-a-read-only-viewer), pro vložení do `<iframe>` |
| `https://run.edubeam.app/?panel=examples` | Galerii příkladů |
| `https://run.edubeam.app/?lang=cs` | Aplikaci v češtině (nebo v libovolném [jiném jazyce podle kódu](/cs/essentials/import-export#url-parameters)) |

::: warning Otevření odkazu nahradí studentův vlastní model
Model, který měli otevřený, se přesune do **☰ → Nedávné konstrukce** a lze ho obnovit; aplikace na to upozorní zprávou. Přesto studentům doporučte, aby si práci, na které jim záleží, uložili pomocí **Uložit projekt**, než otevřou odkazy z výuky.
:::

## Zadání, která si studenti zkontrolují sami {#assignments-students-can-check-themselves}

EduBeam dává studentům okamžitou zpětnou vazbu k ručním výpočtům, aniž by prozradil postup:

- Zadejte ruční výpočet reakcí, vnitřních sil a jednoho posunutí a nechte studenty model sestavit a porovnat. Hotové vzorce najdete v kapitole [Ověření výsledků ručně](/cs/guide/verification).
- Ptejte se, *proč* se výsledek liší: smyková deformace, chybějící kloub, zatížení v lokálních místo globálních osách.
- Chtějte, aby studenti spolu s výpočtem odevzdali sdílený odkaz nebo soubor `project.json`. Můžete ho otevřít a vidět přesně to, co namodelovali.
- Do zpráv mohou studenti exportovat výkres jako **SVG** (ostrý ve Wordu i v LaTeXu) a výsledky jako **CSV**.

## Hotová cvičení {#ready-made-exercises}

- Stránka [Příklady](/cs/examples/) obsahuje šest modelů, každý s navrženými cvičeními.
- Návody [trojkloubový rám](/cs/tutorials/three-hinged-frame) a [rovinná příhradová konstrukce](/cs/tutorials/truss) jsou kompletní řešené příklady s ručním ověřením.
- [Rychlý start](/cs/guide/quick-start) poslouží jako podklad pro první cvičení: zabere asi deset minut.

## Jak studenty nastartovat {#getting-students-started}

Noví uživatelé uvidí uvítací dialog se dvěma řízenými možnostmi: **Provést aplikací** (prohlídka rozhraní) a **Nakreslit první nosník** (sedmikrokový úkol s myší). Obě jsou také v nabídce ☰. Mnoho vyučujících na začátku prvního cvičení jednoduše řekne: „otevřete run.edubeam.app a zvolte *Nakreslit první nosník*“.

## Offline a počítače v učebnách {#offline-and-lab-computers}

EduBeam je progresivní webová aplikace (PWA). Jakmile ji počítač jednou načte, funguje i bez připojení a prohlížeč může nabídnout její instalaci. Modely a nastavení se ukládají pro každý profil prohlížeče zvlášť, proto by si studenti na sdílených počítačích v učebnách měli ukládat práci do souborů nebo odkazů.
