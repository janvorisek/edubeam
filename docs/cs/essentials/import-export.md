# Import, export a sdílení

Vše v <Edubeam /> se odehrává ve vašem prohlížeči. Nic se nenahrává na server: sdílený odkaz model doslova obsahuje.

## Uložení projektu {#save-a-project}

**☰ → Uložit projekt** nebo <kbd>Ctrl</kbd>+<kbd>S</kbd> stáhne soubor `project.json`. Obsahuje uzly, prvky, materiály, průřezy (včetně polygonálních tvarů), zatížení, kóty a verzi aplikace, která ho zapsala. Soubor můžete libovolně přejmenovat.

## Otevření projektu {#open-a-project}

- **☰ → Otevřít projekt** nebo <kbd>Ctrl</kbd>+<kbd>O</kbd> a vyberte soubor `.json`, nebo
- **přetáhněte soubor kamkoli do okna aplikace**.

Otevření nahradí aktuální model včetně materiálů a průřezů. Model, který jste měli, se neztratí: <kbd>Ctrl</kbd>+<kbd>Z</kbd> ho vrátí a zůstane také v [Nedávných konstrukcích](#recent-structures). Soubor, který není projektem EduBeam, se s hlášením odmítne a váš model zůstane, jak byl.

Soubory projektů ze všech dřívějších verzí EduBeam se otevřou i v aktuální verzi.

## Sdílení odkazem {#share-a-link}

**Sdílet konstrukci** (v horní liště nebo v nabídce ☰) otevře dialog *Sdílejte konstrukci pomocí odkazu*:

![Dialog sdílení](/screenshots/cs/share.webp){.shot-lg}

- **Kopírovat** zkopíruje odkaz do schránky. Totéž udělá kliknutí do pole.
- **Otevřít odkaz** ho otevře v nové záložce, takže si můžete ověřit, co uvidí příjemce.
- **Sdílet přes systémové dialogové okno** předá odkaz nabídce sdílení vašeho zařízení, pokud ji prohlížeč podporuje.

Odkaz má tvar `https://run.edubeam.app/?model=…` a kóduje celý model. Kdo ho otevře, dostane vlastní kopii k úpravám; úpravy se zpět **nesynchronizují**, takže když se model změní, pošlete nový odkaz. Velmi velké modely vytvářejí velmi dlouhé odkazy; ty raději sdílejte jako soubor JSON.

Když někdo odkaz otevře, jeho vlastní předchozí model se přesune do Nedávných konstrukcí a zpráva mu řekne, kde ho najde.

Odkazy ze starších verzí fungují dál: odkaz ve loňských skriptech dnes otevře tentýž model.

## Export obrázku {#export-an-image}

**☰ → Exportovat obrázek** nebo <kbd>Ctrl</kbd>+<kbd>P</kbd> otevře export obrázku.

![Exportovat obrázek: zvolte vrstvy, výřez a velikost a pak stáhněte nebo zkopírujte](/screenshots/cs/export-image.webp)

- **Vrstvy**: štítky nahoře volí, co se vykreslí, nezávisle na zobrazení: deformovaný tvar, N, V, M, reakce, podpory, zatížení, popisky uzlů a prvků.
- **Výřez**: zvolte poměr stran (16:9, 4:3, 3:2, 1:1), **Vše**, nebo **Výřez…** a tažením vyberte obdélník nad výkresem. Můžete také táhnout za okraje náhledu.
- **Velikost**: šířka a výška v pixelech, nebo **Měřítko**, například 1 : 50 pro výkres v měřítku na papíře. **Výška diagramů** nastavuje velikost průběhů výsledků v obrázku. **Průhledné pozadí** vynechá bílou.
- **Stáhnout PNG**, **Stáhnout SVG** nebo **Kopírovat do schránky**.

SVG zůstává ostré v libovolné velikosti a funguje ve Wordu, Inkscapu i v LaTeXu na Overleafu, a proto je nejlepší volbou pro zprávy a závěrečné práce.

## Export výsledků {#export-the-results}

**Výsledky → Exportovat CSV** stáhne obě tabulky výsledků včetně reakcí a **Kopírovat** je vloží do schránky pro tabulkový procesor. Viz [Export CSV a kopírování](/cs/essentials/results#export-csv-and-copy).

## Nedávné konstrukce {#recent-structures}

**☰ → Nedávné konstrukce** uchovává posledních 10 modelů, které byly smazány nebo nahrazeny odkazem, souborem, příkladem nebo úlohou s prvním nosníkem. U každého je náhled, důvod nahrazení a velikost. **Obnovit** jeden z nich vrátí; model, který jste v tu chvíli měli, se pak naopak přesune do seznamu a <kbd>Ctrl</kbd>+<kbd>Z</kbd> obnovení vrátí zpět.

![Nedávné konstrukce](/screenshots/cs/recent.webp){.shot-lg}

Seznam se ukládá jen v tomto prohlížeči.

## Příklady {#examples}

**☰ → Příklady** otevře galerii hotových výukových modelů. Otevření příkladu nahradí váš model a <kbd>Ctrl</kbd>+<kbd>Z</kbd> ho vrátí. Tytéž modely i se cvičeními najdete na stránce [Příklady](/cs/examples/) této dokumentace.

![Galerie příkladů](/screenshots/cs/examples.webp){.shot-lg}

## Vložení prohlížeče {#embed-a-read-only-viewer}

Přidáním `&viewer=1` ke sdílenému odkazu otevřete model v **režimu prohlížeče**. Horní lišta, spodní lišta, záložky, zpět a znovu, přepínače mřížky a ukazatel os jsou skryté a zůstane plátno, tlačítka přizpůsobení a vystředění a možnosti zobrazení. Vložte tuto adresu do `<iframe>` a ve skriptech nebo na webové stránce budete mít živý model, který lze přibližovat:

```html
<iframe src="https://run.edubeam.app/?viewer=1&model=…" width="100%" height="400"></iframe>
```

![Trojkloubový rám v režimu prohlížeče](/screenshots/cs/viewer-mode.webp){.shot-lg}

Režim prohlížeče je určen k prohlížení, ale není uzamčený: návštěvníci mohou dál přetahovat uzly a přepínat průběhy. Otevření odkazu v režimu prohlížeče také nahradí návštěvníkův vlastní model v daném prohlížeči (přesune se do Nedávných konstrukcí), stejně jako běžný odkaz.

## Parametry URL {#url-parameters}

| Parametr | Účinek |
| --- | --- |
| `model=<data>` | Načte zakódovaný model a přizpůsobí ho obrazovce. |
| `viewer=1` | Režim prohlížeče (viz výše). |
| `lang=<kód>` | Přepne jazyk rozhraní: `en`, `cs`, `de`, `fr`, `es`, `pt`, `pl`, `cn`, `th`, `uk`, `ru`, `tr`. |
| `panel=examples` | Rovnou otevře galerii příkladů. |

Po jejich přečtení EduBeam parametry z adresního řádku odstraní.

## Automatické ukládání {#automatic-persistence}

Aktuální model a vaše nastavení se po každé změně ukládají do místního úložiště prohlížeče a obnoví se, když se vrátíte, i po zavření prohlížeče. Je to pohodlí, ne záloha: patří k jednomu profilu prohlížeče na jednom zařízení a smazáním dat webu zmizí. Důležitou práci ukládejte jako soubor projektu.

## Formát souboru projektu {#project-file-format}

`project.json` je obyčejný, čitelný JSON:

```json
{
  "edubeam": true,
  "version": "1.3.1",
  "domain": {
    "materials": [{ "label": "1", "e": 210000000000, "g": 81000000000, "alpha": 0.000012, "d": 7850 }],
    "crossSections": [{ "label": "1", "a": 0.00285, "iy": 1.943e-5, "h": 0.2, "k": 1 }],
    "nodes": [
      { "label": "1", "coords": [0, 0, 0], "bcs": [0, 2] },
      { "label": "2", "coords": [6, 0, 0], "bcs": [2] }
    ],
    "elements": [{ "label": "1", "nodes": ["1", "2"], "mat": "1", "cs": "1", "hinges": [false, false] }],
    "loadCases": [
      {
        "label": "1",
        "nodalLoads": [],
        "elementLoads": [{ "type": "udl", "target": "1", "lcs": false, "values": [0, 12000] }],
        "prescribedBC": []
      }
    ]
  },
  "dimensions": []
}
```

Toto je nosník z Rychlého startu. Všechny hodnoty jsou v **jednotkách SI** (m, N, Pa, rad), bez ohledu na zobrazované jednotky. Souřadnice jsou `[x, y, z]`, přičemž y je vždy 0. Okrajové podmínky a složky zatížení používají identifikátory stupňů volnosti `0 = Dx`, `2 = Dz`, `4 = Ry`.

| `type` prvkového zatížení | Hodnoty |
| --- | --- |
| `udl` | `values: [fx, fz]` v N/m |
| `trapezoidal` | `startValues: [f1x, f1z]`, `endValues: [f2x, f2z]` v N/m, lokální osy |
| `concentrated` | `values: [Fx, Fz, My, a]` v N, N·m a m od počátečního uzlu |
| `temperature` | `values: [ΔTc, ΔTb, ΔTt]` v K; gradient je ΔTb − ΔTt |

Uzlová zatížení mají tvar `{ "target": "2", "values": { "0": Fx, "2": Fz, "4": My } }` a předepsaná posunutí `{ "target": "2", "prescribedValues": { "0": Dx, "2": Dz, "4": Ry } }`; zadejte všechny tři složky. Soubory zapsané aplikací obsahují také `date`, `commit`, uzlové `lcs` a polygonální tvary `shape`.

Protože je formát jednoduchý, můžete modely generovat skriptem nebo v tabulkovém procesoru a otevřít je pomocí **Otevřít projekt**.
