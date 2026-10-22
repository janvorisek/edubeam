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
    title: 'Řešič MKP, autor původní aplikace',
    links: [
      { icon: 'github', link: 'https://github.com/bpatzak' },
    ]
  }
]
</script>

# Úvod

<Edubeam /> je bezplatný nástroj pro **statický výpočet rovinných konstrukcí**, který běží přímo v prohlížeči. Spočítá nosníky, rámy i příhradové konstrukce. Nakreslíte konstrukci, přidáte podpory a zatížení a řešič vše metodou konečných prvků přepočítá, jakmile cokoli změníte. Žádné tlačítko *Spočítat*, žádná instalace, žádný účet.

[Spusťte EduBeam](https://run.edubeam.app/?lang=cs){target="_blank"} v nové záložce a postupujte podle [Rychlého startu](/cs/guide/quick-start).

![Trojkloubový rám v EduBeamu: zatížení oranžově, reakce fialově, ohybový moment červeně a deformovaný tvar šedě](/screenshots/cs/hero.webp)

## První spuštění {#your-first-visit}

Při prvním otevření se vás aplikace v uvítacím dialogu zeptá, jak chcete začít a jaké jednotky a osy chcete používat. Obojí můžete později změnit v [Nastavení](/cs/essentials/units-settings).

![Uvítací dialog](/screenshots/cs/welcome.webp){.shot-lg}

- **Provést aplikací** postupně představí nabídku, tlačítka Zpět a Znovu, tlačítka zobrazení, možnosti zobrazení, mřížku s jednotkami a spodní lištu.
- **Nakreslit první nosník** je řízený úkol o sedmi krocích. Myší nakreslíte nosník, podepřete ho, zatížíte a odečtete výsledky. Malá karta v rohu vám vždy napoví, co dělat dál.
- **Otevřít příklad** zobrazí galerii hotových modelů.

Všechny tři možnosti najdete i v **nabídce ☰**, takže se k nim můžete kdykoli vrátit.

![Nakreslit první nosník: karta průvodce zůstává při práci v rohu](/screenshots/cs/first-beam-task.webp)

## Co EduBeam umí {#what-it-does}

| Oblast | Možnosti |
| --- | --- |
| **Konstrukce** | Rovinné (x–z) nosníky, spojité nosníky, rámy a příhradové konstrukce složené z uzlů a 2D prutových prvků (Timoshenkův nosník). Koncovými klouby uděláte z libovolného prutu příhradový prut. |
| **Podpory** | Pevný kloub, posuvný kloub, vetknutí, posuvné vetknutí a všechny další kombinace podepřených `Dx`, `Dz`, `Ry`, které vyberete podle značky. Šikmé podpory zadáte úhlem natočení uzlu. Poklesy podpor. |
| **Zatížení** | Uzlové síly a momenty, předepsaná posunutí, rovnoměrné a lichoběžníkové spojité zatížení, osamělé síly a momenty na prutu a rovnoměrná nebo nerovnoměrná změna teploty. |
| **Průřezy** | Knihovny materiálů a průřezů (evropské i americké) a editor polygonu, který pro libovolný tvar spočítá $A$, $I_y$, $I_z$, $I_{yz}$, hlavní osy a poloměry setrvačnosti. |
| **Výsledky** | Deformovaný tvar, normálová síla **N**, posouvající síla **V**, ohybový moment **M**, reakce, posunutí uzlů, koncové síly prvků a matice tuhosti prvků. |
| **Výpočet** | Lineární statický výpočet s jedním zatěžovacím stavem. Pro lineární model jsou výsledky přesné, síť proto není třeba zjemňovat. Když konstrukci nelze vyřešit, EduBeam vysvětlí proč a animací ukáže, jak se může pohybovat. |
| **Soubory** | Ukládání a otevírání projektů ve formátu JSON, sdílení celého modelu odkazem, export výkresu do PNG nebo SVG a výsledků do CSV. Nedávno nahrazené modely aplikace uchovává, takže je můžete získat zpět. Všechna data zůstávají ve vašem zařízení. |
| **Jednotky** | SI nebo americké jednotky (US customary) jedním kliknutím, případně nastavení každé veličiny zvlášť. Osy buď x doprava a z dolů, nebo x doprava a y nahoru. |

## Co (zatím) neumí {#what-it-does-not-do-yet}

Když omezení znáte předem, ušetříte si čas:

- **Pouze 2D.** Žádné chování mimo rovinu, žádné prostorové rámy.
- **Pouze lineární statika.** Žádné účinky II. řádu (P–Δ), stabilita, dynamika ani plasticita.
- **Jeden zatěžovací stav.** Kombinace zatížení ani obálky nejsou k dispozici. Každý zatěžovací stav namodelujte zvlášť a uložte do samostatného souboru nebo odkazu.
- **Bez vlastní tíhy.** Podle potřeby ji zadejte jako spojité zatížení.
- **Bez posudků.** EduBeam spočítá vnitřní síly a posunutí; posouzení podle norem je na vás.

Chybí vám nějaká funkce? [Založte issue](https://github.com/janvorisek/edubeam/issues).

<ElementariumPromo placement="introduction" />

## Pro koho je EduBeam určen {#who-is-it-for}

- **Studenti** stavební mechaniky, kteří chtějí okamžitou zpětnou vazbu ke svým ručním výpočtům. Viz [Ověření výsledků ručně](/cs/guide/verification).
- **Vyučující**, kteří na projektoru živě ukazují, jak podpory, klouby a zatížení mění vnitřní síly – v kterémkoli z 12 jazyků. Viz [Výuka s EduBeamem](/cs/guide/teaching).
- **Inženýři**, kteří potřebují něco rychle ověřit, než otevřou robustní desktopový program.

## Uspořádání dokumentace {#how-this-guide-is-organised}

1. **Začínáme.** Tato stránka, [Rychlý start na 10 minut](/cs/guide/quick-start) a hotové [Příklady](/cs/examples/).
2. **Návody.** Kompletní modely od zadání po výsledky, ověřené ručním výpočtem: [trojkloubový rám](/cs/tutorials/three-hinged-frame) a [rovinná příhradová konstrukce](/cs/tutorials/truss).
3. **Modelování.** Každé části modelu se věnuje jedna stránka: [uživatelské rozhraní](/cs/essentials/user-interface), [uzly a podpory](/cs/essentials/nodes-supports), [prvky, materiály a průřezy](/cs/essentials/elements), [zatížení](/cs/essentials/loads) a [jednotky a nastavení](/cs/essentials/units-settings).
4. **Výsledky.** Jak [číst průběhy a tabulky](/cs/essentials/results) a jak je [ověřit](/cs/guide/verification).
5. **Soubory a sdílení.** [Projekty, sdílené odkazy, export obrázků a CSV](/cs/essentials/import-export) a [výuka s EduBeamem](/cs/guide/teaching).
6. **Reference.** [Klávesnice, myš a dotyk](/cs/reference/shortcuts), [řešení problémů](/cs/reference/troubleshooting) a [FAQ](/cs/faq/).
7. **Teoretický manuál.** [Znaménková konvence](/cs/elements/conventions) a formulace [prutového prvku](/cs/elements/beam) a [příhradového prutu](/cs/elements/truss).

Ikony **?** v aplikaci otevírají příslušnou stránku této dokumentace ve vašem jazyce.

## Jazyky {#languages}

Rozhraní je k dispozici v těchto jazycích: English, Čeština, Deutsch, Español, Français, Polski, Português, Русский, Türkçe, Українська, ไทย a 汉语. EduBeam se řídí jazykem prohlížeče. Změnit ho můžete v **Nastavení → Jazyk a prostředí**, nebo aplikaci otevřete s parametrem `?lang=`, např. [run.edubeam.app/?lang=cs](https://run.edubeam.app/?lang=cs){target="_blank"}.

## Autoři a poděkování {#authors-credits}

<Edubeam /> vede [Jan Voříšek](https://github.com/janvorisek), správce projektu a autor návrhu moderní webové verze. Webová verze vzniká nezávisle na ČVUT. Původní desktopový EduBeam pro Windows a Linux vytvořili [Bořek Patzák](http://ksm.fsv.cvut.cz/~bp/), [Jan Stránský](https://mech.fsv.cvut.cz/~stransky/en/) a [Vít Šmilauer](https://mech.fsv.cvut.cz/~smilauer/) na Katedře mechaniky [Fakulty stavební ČVUT v Praze](https://www.fsv.cvut.cz/en). Výpočetním jádrem je open-source knihovna [ts-fem](https://github.com/janvorisek/ts-fem).

<VPTeamMembers size="small" :members="members" />

## Přispějte {#contribute}

- Nejasné chování nebo chyby nahlaste jako [issue na GitHubu](https://github.com/janvorisek/edubeam/issues).
- Vylepšete dokumentaci nebo překlady: upravte soubory v `docs/` a otevřete pull request.
- Řekněte o EduBeamu spolužákům a kolegům.
