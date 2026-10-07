# Zatížení

Všechna zatížení patří do **jediného zatěžovacího stavu** a působí současně. Různé varianty zatížení porovnáte tak, že každou uložíte jako samostatný soubor projektu nebo sdílený odkaz.

![Všechny typy zatížení na jednom spojitém nosníku: uzlová síla, rovnoměrné zatížení, lineárně proměnné zatížení, osamělá síla, změna teploty a pokles podpory](/screenshots/cs/loads-overview.webp)

<LoadShowcase />

## Znaménková konvence jednou větou {#sign-convention-in-one-line}

Globální **x** míří doprava a globální **z** míří **dolů**. Kladné `Fz` nebo `fz` proto působí dolů, stejně jako tíha, a kladný moment `My` otáčí na obrazovce proti směru hodinových ručiček. Podrobnosti najdete v kapitole [Souřadný systém a znaménková konvence](/cs/elements/conventions). Při [osách y nahoru](/cs/elements/conventions#y-up-axes) se názvy a znaménka svislých veličin mění: tíha je pak záporné `Fy`.

## Uzlová zatížení {#nodal-loads}

Záložka *Zatížení* → **Přidat uzlové zatížení**, nebo klikněte na uzel → **Přidat zatížení**. Zvolte **Síla/moment**:

| Pole | Význam | Jednotka |
| --- | --- | --- |
| `Fx` | vodorovná síla (kladná doprava) | jednotka síly |
| `Fz` | svislá síla (kladná dolů) | jednotka síly |
| `My` | moment kolem osy y (kladný proti směru hodinových ručiček) | jednotka momentu |

![Přidat uzlové zatížení. Náhled ukazuje směr už během psaní.](/screenshots/cs/loads-nodal.webp){.shot-md}

Složky se vždy zadávají v **globálním** souřadném systému. V jednom uzlu může působit více uzlových zatížení – sečtou se a vykreslí nad sebou.

### Předepsaná posunutí (poklesy podpor) {#prescribed-displacements-support-settlements}

Ve stejném dialogu zvolte **Předepsané posunutí**, nebo klikněte na podepřený uzel → **Předepsat posunutí**. Pole se změní na:

| Pole | Význam | Jednotka |
| --- | --- | --- |
| `Dx` | vnucené vodorovné posunutí | jednotka posunu |
| `Dz` | vnucené svislé posunutí (kladné dolů) | jednotka posunu |
| `Ry` | vnucené pootočení | rad |

Hodnotu zadáte jen pro stupeň volnosti, který je v daném uzlu **podepřen** – posunout lze jen podporu. Každý uzel může mít nejvýše jedno předepsané posunutí; místo přidání dalšího upravte to stávající. U staticky určité konstrukce vyvolá pokles podpory posunutí, ale žádné vnitřní síly; u staticky neurčité obojí.

## Prvková zatížení {#element-loads}

Záložka *Zatížení* → **Přidat prvkové zatížení**, nebo klikněte na prvek → **Přidat zatížení**. Vyberte **Typ zatížení**. Náhled zatížení na prvku se v dialogu ukazuje už během psaní.

### Spojité rovnoměrné zatížení {#uniformly-distributed-load}

| Pole | Význam | Jednotka |
| --- | --- | --- |
| `fx` | zatížení na jednotku délky ve směru x | síla / délka |
| `fz` | zatížení na jednotku délky ve směru z | síla / délka |
| **LCS** | zaškrtnuto: `fx`, `fz` působí v lokálních osách prvku; nezaškrtnuto: v globálních osách | – |

**LCS** je ve výchozím stavu zaškrtnuto. U vodorovného prvku nakresleného zleva doprava jsou lokální a globální osy totožné, takže na nastavení nezáleží. U šikmého prutu ale ano:

- zatížení **kolmé na prut** (vítr na krokev) je `fz` se **zaškrtnutým** LCS;
- **svislé** zatížení na metr délky prutu (vlastní tíha) je `fz` s **nezaškrtnutým** LCS;
- svislé zatížení na metr *vodorovného průmětu* (sníh) přímo zadat nelze. Vynásobte ho $\cos\alpha$, kde $\alpha$ je sklon prutu, a zadejte jako svislé zatížení.

### Lineárně proměnné (lichoběžníkové) zatížení {#trapezoidal-load}

| Pole | Význam |
| --- | --- |
| `f1x`, `f1z` | intenzita v **počátečním** uzlu |
| `f2x`, `f2z` | intenzita v **koncovém** uzlu |

Intenzita se mění lineárně od začátku ke konci prvku. Pro trojúhelníkové zatížení zadejte `f1z = 0`. Lineárně proměnné zatížení působí vždy v **lokálních osách prvku** (políčko LCS je zamčené); u vodorovného prvku se shodují s globálními.

### Osamělá síla {#concentrated-load}

Síla nebo moment v libovolném bodě **po délce** prvku – bez nutnosti přidávat uzel.

| Pole | Význam |
| --- | --- |
| `Fx`, `Fz`, `My` | složky síly a moment |
| **Vzdálenost od počátečního uzlu** | vzdálenost od počátečního uzlu, `0 ≤ a ≤ L` |
| **LCS** | složky v lokálních osách |

V místě síly má průběh posouvající síly skok o `Fz` a průběh ohybového momentu zlom; hodnota momentu se v tomto bodě automaticky popíše. Osamělý moment `My` naopak vyvolá skok v průběhu momentu.

### Změna teploty {#temperature-load}

| Pole | Význam |
| --- | --- |
| **ΔT<sub>s</sub>**, oteplení střednice | rovnoměrná změna teploty celého průřezu; vyvolá prodloužení $\alpha\,\Delta T_s\,L$ |
| **ΔT<sub>d</sub> − ΔT<sub>h</sub>**, rozdíl oteplení | dolní vlákna mínus horní vlákna; vyvolá křivost $\alpha\,(\Delta T_d - \Delta T_h)/h$ |

Teplotní zatížení počítá s **α** materiálu a **výškou h** průřezu. Kladné `ΔTd − ΔTh` (teplejší dolní vlákna) dolní vlákna prodlouží, takže se prvek prohne dolů – stejně jako nosník zatížený tíhou. U staticky určité konstrukce vyvolá změna teploty jen posunutí. Vnitřní síly vzniknou teprve tehdy, když deformaci brání vazby (vetknuté konce, spojitost, nadbytečné pruty).

<div class="shots">

![Spojité rovnoměrné zatížení](/screenshots/cs/loads-udl.webp)

![Lineárně proměnné zatížení](/screenshots/cs/loads-trapezoidal.webp)

![Osamělá síla](/screenshots/cs/loads-concentrated.webp)

![Změna teploty](/screenshots/cs/loads-temperature.webp)

</div>

## Úprava a odstranění zatížení {#editing-and-removing-loads}

- Každé zatížení má vlastní řádek na záložce *Zatížení*, kde přímo upravíte jeho složky i příznak LCS. V tabulkách *Uzly* a *Prvky* se zatížení zobrazují také jako štítky.
- Dialog úprav otevřete **dvojklikem** na zatížení v zobrazení, nebo kliknutím na zatížení a volbou **Upravit zatížení**.
- Zatížení smažete klávesou <kbd>Delete</kbd> po jeho výběru, nebo křížkem × v tabulce.
- Zatížení uzlu nebo prvku se smažou spolu s ním a při kopírování a vložení se zkopírují s ním.

![Záložka Zatížení: jeden řádek na zatížení, složky lze upravovat přímo](/screenshots/cs/loads-table.webp)

## Co k dispozici není {#what-is-not-available}

- **Zatěžovací stavy a kombinace.** Model má jen jeden zatěžovací stav.
- **Vlastní tíha.** Zadejte ji jako rovnoměrné zatížení s nezaškrtnutým LCS: $f_z = \rho\,g\,A$. Například u IPE 200: 7850 × 9,81 × 0,00285 ≈ 0,22 kN/m.
- **Lineárně proměnné zatížení v globálních osách** na šikmých prutech.
