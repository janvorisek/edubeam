# Import, export a sdílení

Vše v <Edubeam /> se odehrává ve vašem prohlížeči. Na server se nic nenahrává – sdílený odkaz doslova obsahuje model.

## Uložení projektu

**☰ nabídka → Uložit projekt** nebo <kbd>Ctrl</kbd>+<kbd>S</kbd> stáhne soubor `project.json`. Obsahuje uzly, prvky, materiály, průřezy, zatížení, kóty a verzi aplikace, která ho zapsala. Soubor můžete libovolně přejmenovat.

## Otevření projektu

- **☰ nabídka → Otevřít projekt** nebo <kbd>Ctrl</kbd>+<kbd>O</kbd> a výběr souboru `.json`, nebo
- **přetáhněte soubor kamkoli do okna aplikace**.

Otevření nahradí aktuální model (včetně materiálů a průřezů). Chcete-li ho zachovat, nejprve použijte **Uložit projekt**.

## Sdílení odkazem

**Sdílet konstrukci** (🔗 v horní liště nebo v nabídce ☰) otevře dialog *Sdílejte konstrukci pomocí odkazu*:

- **Kopírovat odkaz** – zkopíruje odkaz do schránky (nebo klikněte do pole).
- **Otevřít odkaz** – otevře ho v nové záložce, abyste viděli, co uvidí příjemce.
- **Sdílet přes systémové dialogové okno** – na telefonech a tabletech předá odkaz systémovému sdílení.

Odkaz má tvar `https://run.edubeam.app/?model=…` a kóduje celý model (uzly, prvky, vlastnosti, zatížení). Kdo ho otevře, dostane přesnou kopii k místní úpravě; úpravy se **nesynchronizují** zpět – po změně modelu pošlete nový odkaz. Velmi rozsáhlé modely dávají velmi dlouhé odkazy; u nich raději sdílejte soubor JSON.

## Vložení prohlížeče jen pro čtení

Připojte ke sdílenému odkazu `&viewer=1` (nebo `?viewer=1` k libovolné adrese aplikace) a model se otevře v **režimu prohlížeče**: horní lišta, spodní lišta, zpět/znovu i panel nastavení jsou skryté a zůstane jen plátno s aktuálním modelem. Takovou adresu vložte do `<iframe>` a získáte živý, přibližovatelný model ve skriptech k přednášce nebo na webu:

```html
<iframe src="https://run.edubeam.app/?viewer=1&model=…" width="100%" height="400"></iframe>
```

Stránka [Příklady](/cs/examples/) je postavena stejně – každá karta je odkaz s parametrem `?model=`.

## Parametry URL

| Parametr | Účinek |
| --- | --- |
| `model=<data>` | Načte zakódovaný model, přizpůsobí ho obrazovce a parametr odstraní z adresního řádku. |
| `lang=<kód>` | Přepne jazyk rozhraní (`en`, `cs`, `de`, `fr`, `es`, `pt`, `pl`, `cn`, `th`, `uk`, `ru`). |
| `viewer=1` | Režim prohlížeče jen pro čtení (viz výše). |

## Automatické ukládání

Aktuální model i nastavení se po každé změně ukládají do místního úložiště prohlížeče a po návratu se obnoví – i po zavření prohlížeče. Je to pohodlí, ne záloha: je vázané na jeden profil prohlížeče na jednom zařízení a vymazání dat webu ho odstraní. Důležitou práci ukládejte jako soubor projektu.

## Formát souboru projektu

`project.json` je prostý, čitelný JSON:

```json
{
  "edubeam": true,
  "version": "1.0.6",
  "domain": {
    "materials": [ { "label": "1", "e": 210000000000, "g": 81000000000, "alpha": 0.000012, "d": 7850 } ],
    "crossSections": [ { "label": "1", "a": 0.00285, "iy": 1.943e-5, "h": 0.2, "k": 1 } ],
    "nodes": [ { "label": "1", "coords": [0, 0, 0], "bcs": [0, 2] }, … ],
    "elements": [ { "label": "1", "nodes": ["1", "2"], "mat": "1", "cs": "1", "hinges": [false, false] } ],
    "loadCases": [ … ]
  }
}
```

Všechny hodnoty jsou uloženy v **jednotkách SI** (m, N, Pa, rad) bez ohledu na zobrazované jednotky. Okrajové podmínky používají identifikátory stupňů volnosti `0 = Dx`, `2 = Dz`, `4 = Ry`. Díky jednoduchému formátu můžete modely generovat skriptem nebo z tabulkového procesoru a otevřít je přes **Otevřít projekt**. Formát není verzován jako stabilní API – pokud na něj automatizujete, kontrolujte pole `version`.
