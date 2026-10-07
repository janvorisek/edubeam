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

<Edubeam /> je bezplatný nástroj pro **statický výpočet rovinných konstrukcí** – nosníků, rámů a příhradových konstrukcí – běžící přímo v prohlížeči. Nakreslíte konstrukci, přidáte podpory a zatížení a řešič metodou konečných prvků vše přepočítá v okamžiku, kdy cokoli změníte. Žádné tlačítko *Spočítat*, žádná instalace, žádný účet.

[Spusťte EduBeam](https://run.edubeam.app/?lang=cs){target="_blank"} v nové záložce a postupujte podle [Rychlého startu](/cs/guide/quick-start).

![Trojkloubový rám v EduBeam: zatížení oranžově, reakce fialově, ohybový moment červeně a deformovaný tvar šedě](/screenshots/cs/hero.webp)

## První návštěva {#your-first-visit}

Při prvním otevření aplikace se vás uvítací dialog zeptá, jak chcete začít a jaké jednotky a osy chcete používat. Obojí můžete později změnit v [Nastavení](/cs/essentials/units-settings).

![Uvítací dialog](/screenshots/cs/welcome.webp){.shot-lg}

- **Provést aplikací** postupně ukáže nabídku, tlačítka zpět a znovu, tlačítka zobrazení, možnosti zobrazení, mřížku a jednotky a spodní lištu.
- **Nakreslit první nosník** je sedmikrokový řízený úkol. Myší nakreslíte nosník, podepřete ho, zatížíte a odečtete výsledky. Malá karta v rohu vám vždy řekne, co udělat dál.
- **Otevřít příklad** otevře galerii hotových modelů.

Všechny tři možnosti najdete také v **nabídce ☰**, takže se k nim můžete kdykoli vrátit.

![Nakreslit první nosník: karta průvodce zůstává v rohu, zatímco pracujete](/screenshots/cs/first-beam-task.webp)

## Co umí {#what-it-does}

| Oblast | Možnosti |
| --- | --- |
| **Konstrukce** | Rovinné (x–z) nosníky, spojité nosníky, rámy a příhradové konstrukce složené z uzlů a 2D prutových prvků (Timoshenkův nosník). Koncové klouby změní libovolný prut na příhradový. |
| **Podpory** | Pevný kloub, posuvný kloub, vetknutí, posuvné vetknutí a všechny další kombinace podepřených `Dx`, `Dz`, `Ry`, vybírané podle značky. Natočené podpory pomocí úhlu uzlu. Poklesy podpor. |
| **Zatížení** | Uzlové síly a momenty, předepsaná posunutí, rovnoměrné a lichoběžníkové spojité zatížení, osamělé síly a momenty po délce prutu a rovnoměrná nebo nerovnoměrná změna teploty. |
| **Průřezy** | Knihovny materiálů a průřezů (evropské i americké) a editor polygonu, který pro libovolný tvar spočítá $A$, $I_y$, $I_z$, $I_{yz}$, hlavní osy a poloměry setrvačnosti. |
| **Výsledky** | Deformovaný tvar, normálová síla **N**, posouvající síla **V**, ohybový moment **M**, reakce, posunutí uzlů, koncové síly prvků a matice tuhosti prvků. |
| **Výpočet** | Lineární statický výpočet s jedním zatěžovacím stavem. Výsledky jsou pro lineární model přesné, takže není potřeba zjemňovat síť. Když konstrukci nelze vyřešit, EduBeam řekne proč a animací ukáže, jak se může pohybovat. |
| **Soubory** | Ukládání a otevírání projektů ve formátu JSON, sdílení celého modelu odkazem, export výkresu jako PNG nebo SVG a výsledků jako CSV. Nedávno nahrazené modely se uchovávají, takže je můžete získat zpět. Vše zůstává ve vašem zařízení. |
| **Jednotky** | SI nebo americké jednotky (US customary) jedním kliknutím, nebo každá veličina zvlášť. Osy buď x doprava, z dolů, nebo x doprava, y nahoru. |

## Co (zatím) neumí {#what-it-does-not-do-yet}

Znalost omezení předem ušetří čas:

- **Pouze 2D.** Žádné chování z roviny, žádné prostorové rámy.
- **Pouze lineární statika.** Žádné účinky II. řádu (P–Δ), žádná stabilita, dynamika ani plasticita.
- **Jeden zatěžovací stav.** Nejsou k dispozici kombinace zatížení ani obálky. Každý stav modelujte zvlášť a uložte jako samostatný soubor nebo odkaz.
- **Žádná vlastní tíha.** V případě potřeby ji zadejte jako spojité zatížení.
- **Žádné posudky.** EduBeam poskytne vnitřní síly a posunutí; posouzení podle norem je na vás.

Pokud vám nějaká funkce chybí, [založte issue](https://github.com/janvorisek/edubeam/issues).

<ElementariumPromo placement="introduction" />

## Pro koho je určen {#who-is-it-for}

- **Studenti** stavební mechaniky, kteří chtějí okamžitou zpětnou vazbu k ručním výpočtům. Viz [Ověření výsledků ručně](/cs/guide/verification).
- **Vyučující**, kteří živě na projektoru ukazují, jak podpory, klouby a zatížení mění vnitřní síly, v kterémkoli z 12 jazyků. Viz [Výuka s EduBeam](/cs/guide/teaching).
- **Inženýři**, kteří potřebují rychlou kontrolu, než otevřou těžší desktopový program.

## Jak je dokumentace uspořádána {#how-this-guide-is-organised}

1. **Začínáme.** Tato stránka, [Rychlý start na 10 minut](/cs/guide/quick-start) a hotové [Příklady](/cs/examples/).
2. **Návody.** Kompletní modely od začátku do konce, ověřené ručním výpočtem: [trojkloubový rám](/cs/tutorials/three-hinged-frame) a [rovinná příhradová konstrukce](/cs/tutorials/truss).
3. **Modelování.** Jedna stránka pro každý stavební kámen: [uživatelské rozhraní](/cs/essentials/user-interface), [uzly a podpory](/cs/essentials/nodes-supports), [prvky, materiály a průřezy](/cs/essentials/elements), [zatížení](/cs/essentials/loads) a [jednotky a nastavení](/cs/essentials/units-settings).
4. **Výsledky.** Jak [číst průběhy a tabulky](/cs/essentials/results) a jak je [ověřit](/cs/guide/verification).
5. **Soubory a sdílení.** [Projekty, sdílené odkazy, export obrázků a CSV](/cs/essentials/import-export) a [výuka s EduBeam](/cs/guide/teaching).
6. **Reference.** [Klávesnice, myš a dotyk](/cs/reference/shortcuts), [řešení problémů](/cs/reference/troubleshooting) a [FAQ](/cs/faq/).
7. **Teoretický manuál.** [Znaménková konvence](/cs/elements/conventions) a formulace prvků [nosníku](/cs/elements/beam) a [příhradového prutu](/cs/elements/truss).

Ikony **?** v aplikaci otevírají odpovídající stránku této dokumentace ve vašem jazyce.

## Jazyky {#languages}

Rozhraní je k dispozici v jazycích English, Čeština, Deutsch, Español, Français, Polski, Português, Русский, Türkçe, Українська, ไทย a 汉语. EduBeam volí jazyk podle prohlížeče. Změníte ho v **Nastavení → Jazyk a prostředí**, nebo otevřete aplikaci s parametrem `?lang=`, např. [run.edubeam.app/?lang=cs](https://run.edubeam.app/?lang=cs){target="_blank"}.

## Autoři a poděkování {#authors-credits}

<Edubeam /> vede [Jan Voříšek](https://github.com/janvorisek), správce a autor návrhu moderní webové verze. Webová verze je vyvíjena nezávisle na ČVUT. Původní desktopový EduBeam pro Windows a Linux vytvořili [Bořek Patzák](http://ksm.fsv.cvut.cz/~bp/), [Jan Stránský](https://mech.fsv.cvut.cz/~stransky/en/) a [Vít Šmilauer](https://mech.fsv.cvut.cz/~smilauer/) na Katedře mechaniky [Fakulty stavební ČVUT v Praze](https://www.fsv.cvut.cz/en). Řešičem je open-source knihovna [ts-fem](https://github.com/janvorisek/ts-fem).

<VPTeamMembers size="small" :members="members" />

## Přispějte {#contribute}

- Nejasné chování nebo chyby hlaste jako [issue na GitHubu](https://github.com/janvorisek/edubeam/issues).
- Vylepšete tuto dokumentaci nebo překlady úpravou souborů v `docs/` a otevřením pull requestu.
- Řekněte o EduBeam spolužákům a kolegům.
