<script setup>
import { VPTeamMembers } from 'vitepress/theme'

const members = [
  {
    avatar: 'https://www.github.com/janvorisek.png',
    name: 'Jan Voříšek',
    title: 'Hlavní vývojář a autor návrhu aplikace',
    links: [
      { icon: 'github', link: 'https://github.com/janvorisek' },
      { icon: 'twitter', link: 'https://twitter.com/janvorisekdev' },
    ]
  },
  {
    avatar: 'https://www.github.com/bpatzak.png',
    name: 'Bořek Patzák',
    title: 'MKP řešič, autor původní aplikace',
    links: [
      { icon: 'github', link: 'https://github.com/bpatzak' },
    ]
  }
]
</script>

# Úvod

<Edubeam /> je bezplatný nástroj pro **statickou analýzu rovinných prutových konstrukcí** – nosníků, rámů a příhradových konstrukcí – běžící přímo v prohlížeči. Nakreslíte konstrukci, přidáte podpory a zatížení a řešič metodou konečných prvků vše přepočítá v okamžiku, kdy cokoli změníte. Žádné tlačítko „Spočítat“, žádná instalace, žádný účet.

[Spusťte EduBeam](https://run.edubeam.app/?lang=cs){target="_blank"} v nové záložce a projděte si [Rychlý start](/cs/guide/quick-start).

<figure>
  <a href="https://run.edubeam.app/?lang=cs" target="_blank">
    <WelcomeStructure />
  </a>
  <figcaption>Staticky neurčitý nosník řešený přímo v prohlížeči</figcaption>
</figure>

## Co umí

| Oblast | Možnosti |
| --- | --- |
| **Konstrukce** | Rovinné (x–z) nosníky, spojité nosníky, rámy a příhradové konstrukce složené z uzlů a 2D prutových prvků (Timoshenkův nosník). Koncové klouby změní libovolný prut na příhradový. |
| **Podpory** | Libovolná kombinace podepřených stupňů volnosti `Dx`, `Dz`, `Ry` v uzlu → vetknutí, kloubová podpora, posuvný kloub, posuvné vetknutí… Šikmé podpory pomocí pootočení souřadného systému uzlu. |
| **Zatížení** | Uzlové síly a momenty, předepsaná posunutí (poklesy podpor), rovnoměrné a lineárně proměnné spojité zatížení (v globálních i lokálních souřadnicích), osamělé síly kdekoli na prutu, rovnoměrné i nerovnoměrné oteplení. |
| **Výsledky** | Deformovaný tvar, normálová síla **N**, posouvající síla **V<sub>z</sub>**, ohybový moment **M<sub>y</sub>**, reakce, posunutí uzlů, koncové síly prvků a matice tuhosti jednotlivých prvků. |
| **Výpočet** | Lineární statická analýza s jedním zatěžovacím stavem. Výsledky jsou pro lineární model přesné (není potřeba zjemňovat síť). |
| **Soubory** | Ukládání a otevírání projektů ve formátu JSON, sdílení celého modelu odkazem, vložení prohlížeče do vlastní stránky. Vše zůstává ve vašem zařízení. |
| **Jednotky** | Nezávisle volitelné jednotky délky, plochy, momentu setrvačnosti, hmotnosti, síly, momentu a napětí (metrické i imperiální). |

## Co (zatím) neumí

Znalost omezení předem ušetří čas:

- **Pouze 2D** – žádné chování z roviny, žádné prostorové rámy.
- **Pouze lineární statika** – žádná teorie II. řádu (P–Δ), stabilita, dynamika ani plasticita.
- **Jeden zatěžovací stav** – žádné kombinace zatížení ani obálky. Každý stav modelujte zvlášť (uložte jako samostatný soubor nebo odkaz).
- **Žádná vlastní tíha** – zadejte ji v případě potřeby jako spojité zatížení.
- **Žádné posudky** – EduBeam poskytne vnitřní síly a přetvoření; posouzení podle norem je na vás.

Pokud vám chybějící funkce vadí, [založte issue](https://github.com/janvorisek/edubeam/issues).

## Pro koho je určen

- **Studenti** stavební mechaniky a pružnosti, kteří chtějí okamžitou zpětnou vazbu k ručním výpočtům. Viz [Ověření výsledků ručně](/cs/guide/verification).
- **Vyučující**, kteří ukazují, jak podpory, klouby a zatížení mění průběhy vnitřních sil – živě, na projektoru, v jednom z 11 jazyků.
- **Inženýři**, kteří potřebují rychlou kontrolu, než otevřou „velký“ program.

## Jak je dokumentace uspořádána

1. **Začínáme** – tato stránka, [Rychlý start na 10 minut](/cs/guide/quick-start) a hotové [Příklady](/cs/examples/).
2. **Modelování** – jedna stránka pro každý stavební kámen: [uživatelské rozhraní](/cs/essentials/user-interface), [uzly a podpory](/cs/essentials/nodes-supports), [prvky, materiály a průřezy](/cs/essentials/elements), [zatížení](/cs/essentials/loads), [jednotky a nastavení](/cs/essentials/units-settings).
3. **Výsledky** – jak [číst průběhy a tabulky](/cs/essentials/results) a jak je [ověřit](/cs/guide/verification).
4. **Soubory a sdílení** – [projekty JSON, sdílené odkazy a vložený prohlížeč](/cs/essentials/import-export).
5. **Reference** – [klávesnice a myš](/cs/reference/shortcuts), [řešení problémů](/cs/reference/troubleshooting) a [FAQ](/cs/faq/).
6. **Teoretický manuál** – [znaménková konvence](/cs/elements/conventions) a formulace prvků [nosníku](/cs/elements/beam) a [příhradového prutu](/cs/elements/truss).

## Jazyky

Rozhraní je k dispozici v češtině, angličtině, němčině, španělštině, francouzštině, polštině, portugalštině, ruštině, ukrajinštině, thajštině a čínštině. EduBeam volí jazyk podle prohlížeče; změníte jej v **Nastavení → Jazyk a prostředí** nebo parametrem `?lang=`, např. [run.edubeam.app/?lang=cs](https://run.edubeam.app/?lang=cs){target="_blank"}.

## Autoři a poděkování

<Edubeam /> vede [Jan Voříšek](https://github.com/janvorisek), správce a autor návrhu moderní webové verze. Webová verze je vyvíjena nezávisle na ČVUT; původní desktopový EduBeam pro Windows/Linux vytvořili [Bořek Patzák](http://ksm.fsv.cvut.cz/~bp/), [Jan Stránský](https://mech.fsv.cvut.cz/~stransky/) a [Vít Šmilauer](https://mech.fsv.cvut.cz/~smilauer/) na Katedře mechaniky [Fakulty stavební ČVUT v Praze](https://www.fsv.cvut.cz/). Řešičem je open-source knihovna [ts-fem](https://github.com/janvorisek/ts-fem).

<VPTeamMembers size="small" :members="members" />

## Přispějte

- Nejasné chování nebo chyby hlaste jako [issue na GitHubu](https://github.com/janvorisek/edubeam/issues).
- Vylepšete tuto dokumentaci nebo překlady úpravou souborů v `docs/` a pull requestem.
- Řekněte o EduBeamu spolužákům a kolegům.
