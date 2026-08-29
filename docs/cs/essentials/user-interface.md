# Uživatelské rozhraní

<Edubeam /> má tři oblasti. Jakmile víte, co kde najdete, dává zbytek dokumentace smysl.

```
┌──────────────────────────────────────────────────────────────┐
│ ☰  edubeam     🗑 Smazat konstrukci  🔗 Sdílet   Co je nového │  ← Horní lišta
├──────────────────────────────────────────────────────────────┤
│ Konstrukce | Nastavení                                       │  ← Záložky
│ ↶ ↷                                        ⌖  ⤢  ⚙            │
│                                                              │
│                     plátno (model)              [přepínače   │  ← Zobrazení
│                                                  zobrazení]  │
│                                       G  S  m·kN·kNm·MPa     │
├──────────────────────────────────────────────────────────────┤
│ Uzly | Prvky | Zatížení | Materiály | Průřezy | Výsledky      │  ← Spodní lišta
│ [Přidat uzel] [Přidat myší]         tabulka entit …          │
└──────────────────────────────────────────────────────────────┘
```

## Horní lišta

| Ovládací prvek | Funkce |
| --- | --- |
| **☰ nabídka** | **Otevřít projekt**, **Uložit projekt**, **Sdílet konstrukci**, **Smazat konstrukci** a verze aplikace. |
| **Smazat konstrukci** 🗑 | Po potvrzení smaže všechny uzly, prvky a zatížení. Dvě zaškrtávací políčka umožní smazat i materiály a průřezy. Nelze vrátit zpět. |
| **Sdílet konstrukci** 🔗 | Otevře [dialog sdílení](/cs/essentials/import-export#sdileni-odkazem) s adresou URL, která obsahuje celý model. |
| **Co je nového?** | Poznámky k vydání. |
| **Dokumentace** / GitHub | Odkazy na tento web a na zdrojový kód. |

V [režimu prohlížeče](/cs/essentials/import-export#vlozeni-prohlizece-jen-pro-cteni) je horní lišta skrytá.

## Zobrazení

Plátno, na kterém kreslíte a prohlížíte model. Vše ostatní v aplikaci reaguje na to, co zde vyberete.

### Tlačítka na plátně

- **Vlevo nahoře:** **Zpět** / **Znovu** (také <kbd>Ctrl</kbd>+<kbd>Z</kbd> / <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Z</kbd>). Každá změna modelu – přidání, úprava, přetažení, smazání – jde vrátit.
- **Vpravo nahoře:** **Vycentrovat** (<kbd>C</kbd>), **Přizpůsobit obrazovce** (<kbd>F</kbd>) a přepínač **nastavení zobrazení** ⚙.
- **Vpravo dole:** **G** přepíná mřížku, **S** přichytávání k mřížce; **štítek jednotek** ukazuje aktivní jednotky a po kliknutí otevře nastavení.

### Panel nastavení zobrazení

Otevřete tlačítkem ⚙. Dvě řady zaškrtávacích políček:

- **Výsledky:** *Deformovaný tvar*, *N (x)*, *V<sub>z</sub> (x)*, *M<sub>y</sub> (x)*, *Reakce*.
- **Model:** *Podpory*, *Zatížení*, *Popisky uzlů*, *Popisky prvků*.

**Všechna nastavení** otevře celý [dialog nastavení](/cs/essentials/units-settings).

### Pohyb po plátně

| Akce | Myš / dotyk |
| --- | --- |
| Zoom | Kolečko myši (přibližuje ke kurzoru), <kbd>Ctrl</kbd>+<kbd>=</kbd> / <kbd>Ctrl</kbd>+<kbd>-</kbd>; na dotykové obrazovce roztažení prstů |
| Posun | Tažení **prostředním nebo pravým** tlačítkem (lze změnit v *Nastavení → Ovládání & zkratky*); na dotykové obrazovce tažení jedním prstem |
| Přizpůsobit / vycentrovat | <kbd>F</kbd> / <kbd>C</kbd> nebo tlačítka vpravo nahoře |

### Výběr a úpravy

- **Kliknutím** vyberete uzel, prvek, zatížení nebo kótu. Spodní lišta přeskočí na odpovídající záložku a u výběru se objeví malá **kontextová nabídka** s akcemi pro daný objekt (např. *Přidat zatížení*, *Podepření uzlu*, *Upravit prvek*, *Matice tuhosti*, *Smazat*).
- **Tažením po prázdném plátně** nakreslíte výběrový obdélník. Vybere se vše uvnitř – uzly, prvky, jejich zatížení a kóty. <kbd>Delete</kbd> vše smaže, <kbd>Ctrl</kbd>+<kbd>C</kbd> / <kbd>Ctrl</kbd>+<kbd>V</kbd> zkopíruje a vloží jinam.
- **Tažením uzlu** jej přesunete. Se zapnutým přichytáváním padne na mřížku. Připojené prvky a jejich zatížení se přesunou s ním.
- **Dvojklik na zatížení** otevře jeho úpravu.
- **Najetí myší** zobrazí popisek: uzly ukážou posunutí a pootočení, prvky materiál a průřez, zatížení své složky.
- **Pravé tlačítko na prázdném plátně** otevře nabídku plátna: *Přidat uzel*, *Přidat prvek*, *Přidat kótu*, *Upravit* (otevře tabulku aktuálního výběru), *Kopírovat*, *Vložit*, *Smazat*. Držte <kbd>Ctrl</kbd> při volbě *Přidat uzel* / *Přidat prvek*, chcete-li je umístit myší místo dialogu.

Všechny zkratky jsou na stránce [Klávesnice a myš](/cs/reference/shortcuts).

### Upozornění

Vlevo nahoře v zobrazení se objeví hlášení, pokud něco není v pořádku: *Není definovaný žádný materiál* / *Není definovaný žádný průřez* (s tlačítkem **Přidat**) nebo *Model has N error(s)* s tlačítkem **Show details**, které vypíše všechny problémy. Viz [Řešení problémů](/cs/reference/troubleshooting).

## Spodní lišta

Šest záložek, každá s počítadlem, lištou tlačítek a upravitelnou tabulkou. Tažením za oddělovač nad lištou změníte její výšku; tlačítkem vpravo ji minimalizujete.

| Záložka | Tlačítka | Tabulka |
| --- | --- | --- |
| **Uzly** | Přidat uzel (dialog), Přidat myší | Označení, X, Z, políčka **Podepřené stupně volnosti**, zatížení v uzlu, smazat |
| **Prvky** | Přidat prvek (dialog), Přidat myší | Označení, typ, počáteční/koncový uzel (+ *Přehodit pořadí uzlů*), materiál, průřez, **Koncové klouby**, zatížení na prvku, matice tuhosti, smazat |
| **Zatížení** | Přidat uzlové zatížení, Přidat prvkové zatížení | Typ, působiště, upravitelné složky, smazat |
| **Materiály** | Přidat materiál, Knihovna materiálů | Označení, E, G, α<sub>T</sub>, smazat |
| **Průřezy** | Přidat průřez, Knihovna průřezů | Označení, A, I<sub>y</sub>, h, k, smazat |
| **Výsledky** | Přepínač Výsledky v uzlech / Výsledky na prvcích | Posunutí a pootočení uzlů, nebo koncové síly prvků |

Buňky se upravují přímo v tabulce – klikněte, napište, potvrďte <kbd>Enter</kbd> (nebo <kbd>Esc</kbd> pro opuštění buňky). Hodnoty se zobrazují a zadávají v [aktuálních jednotkách](/cs/essentials/units-settings).

## Záložky nad zobrazením

Záložka **Konstrukce** je vždy přítomná. Otevření nastavení přidá vedle ní zavíratelnou záložku **Nastavení**, takže můžete upravovat barvy či jednotky a přitom se dívat na model.

## Plovoucí okna

Některé akce otevřou přetahovatelná okna nad zobrazením: **Matice tuhosti** (z kontextové nabídky prvku nebo z řádku tabulky) ukazuje matici tuhosti prvku 6 × 6 v lokálních i globálních souřadnicích; **Upravit** z nabídky plátna otevře tabulku aktuálního výběru. Zavřete je křížkem.
