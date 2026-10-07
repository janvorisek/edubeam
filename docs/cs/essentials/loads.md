# Zatížení

Všechna zatížení patří do **jediného zatěžovacího stavu** a působí současně. Chcete-li porovnat různé scénáře, uložte každý jako samostatný soubor projektu nebo sdílený odkaz.

![Všechny typy zatížení na jednom spojitém nosníku: uzlová síla, rovnoměrné zatížení, lineárně proměnné zatížení, osamělá síla, změna teploty a pokles podpory](/screenshots/cs/loads-overview.webp)

<LoadShowcase />

## Znaménková konvence jednou větou {#sign-convention-in-one-line}

Globální **x** míří doprava a globální **z** míří **dolů**. Kladné `Fz` nebo `fz` je tedy zatížení směrem dolů, tíhového typu, a kladný moment `My` otáčí na obrazovce proti směru hodinových ručiček. Podrobnosti najdete v kapitole [Souřadný systém a znaménková konvence](/cs/elements/conventions). S [osami y nahoru](/cs/elements/conventions#y-up-axes) se názvy a znaménka svislých veličin obrátí: tíha je záporné `Fy`.

## Uzlová zatížení {#nodal-loads}

Záložka *Zatížení* → **Přidat uzlové zatížení**, nebo klikněte na uzel → **Přidat zatížení**. Zvolte **Síla/moment**:

| Pole | Význam | Jednotka |
| --- | --- | --- |
| `Fx` | vodorovná síla (kladná doprava) | jednotka síly |
| `Fz` | svislá síla (kladná dolů) | jednotka síly |
| `My` | moment kolem osy y (kladný proti směru hodinových ručiček) | jednotka momentu |

![Přidat uzlové zatížení. Náhled ukazuje směr už během psaní.](/screenshots/cs/loads-nodal.webp){.shot-md}

Složky jsou vždy v **globálním** souřadném systému. V jednom uzlu může působit více uzlových zatížení; sčítají se a kreslí se nad sebou.

### Předepsaná posunutí (poklesy podpor) {#prescribed-displacements-support-settlements}

Ve stejném dialogu zvolte **Předepsané posunutí**, nebo klikněte na podepřený uzel → **Předepsat posunutí**. Pole se změní na:

| Pole | Význam | Jednotka |
| --- | --- | --- |
| `Dx` | vnucené vodorovné posunutí | jednotka posunu |
| `Dz` | vnucené svislé posunutí (kladné dolů) | jednotka posunu |
| `Ry` | vnucené pootočení | rad |

Hodnotu lze zadat jen pro stupeň volnosti, který je v daném uzlu **podepřen**, protože pohnout lze jen podporami. Každý uzel má nejvýše jedno předepsané posunutí; místo přidávání druhého upravte stávající. U staticky určité konstrukce vyvolá pokles podpory posunutí, ale žádné vnitřní síly; u staticky neurčité obojí.

## Prvková zatížení {#element-loads}

Záložka *Zatížení* → **Přidat prvkové zatížení**, nebo klikněte na prvek → **Přidat zatížení**. Vyberte **Typ zatížení**; dialog už během psaní ukazuje náhled zatížení na prvku.

### Spojité rovnoměrné zatížení {#uniformly-distributed-load}

| Pole | Význam | Jednotka |
| --- | --- | --- |
| `fx` | zatížení na jednotku délky ve směru x | síla / délka |
| `fz` | zatížení na jednotku délky ve směru z | síla / délka |
| **LCS** | zaškrtnuto: `fx`, `fz` působí v lokálních osách prvku; nezaškrtnuto: v globálních osách | – |

**LCS** je ve výchozím stavu zaškrtnuto. U vodorovného prvku nakresleného zleva doprava jsou lokální a globální osy stejné, takže na tom nezáleží. U šikmého prutu ano:

- zatížení **kolmé na prut** (vítr na krokev) je `fz` se **zaškrtnutým** LCS;
- **svislé** zatížení na metr délky prutu (vlastní tíha) je `fz` s **nezaškrtnutým** LCS;
- svislé zatížení na metr *vodorovného průmětu* (sníh) přímo k dispozici není. Nejprve ho vynásobte $\cos\alpha$, kde $\alpha$ je sklon prutu, a zadejte ho jako svislé zatížení.

### Lineárně proměnné (lichoběžníkové) zatížení {#trapezoidal-load}

| Pole | Význam |
| --- | --- |
| `f1x`, `f1z` | intenzita v **počátečním** uzlu |
| `f2x`, `f2z` | intenzita v **koncovém** uzlu |

Intenzita se mění lineárně od začátku ke konci prvku. Trojúhelníkové zatížení má `f1z = 0`. Lineárně proměnné zatížení působí vždy v **lokálních osách prvku** (políčko LCS je zamčené); u vodorovného prvku je to totéž co globální osy.

### Osamělá síla {#concentrated-load}

Bodová síla nebo moment kdekoli **po délce** prvku, bez potřeby dalšího uzlu.

| Pole | Význam |
| --- | --- |
| `Fx`, `Fz`, `My` | složky síly a moment |
| **Vzdálenost od počátečního uzlu** | vzdálenost od počátečního uzlu, `0 ≤ a ≤ L` |
| **LCS** | složky v lokálních osách |

Průběh posouvající síly má v místě síly skok o `Fz` a průběh momentu tam má zlom; hodnota momentu v tomto bodě se popíše automaticky. Osamělý moment `My` naopak způsobí skok v průběhu momentu.

### Změna teploty {#temperature-load}

| Pole | Význam |
| --- | --- |
| **ΔT<sub>s</sub>**, oteplení střednice | rovnoměrná změna teploty celého průřezu, způsobí prodloužení $\alpha\,\Delta T_s\,L$ |
| **ΔT<sub>d</sub> − ΔT<sub>h</sub>**, rozdíl oteplení | dolní vlákna mínus horní vlákna, způsobí křivost $\alpha\,(\Delta T_d - \Delta T_h)/h$ |

Teplotní zatížení používá **α** materiálu a **výšku h** průřezu. Kladné `ΔTd − ΔTh` (teplejší dolní vlákna) prodlouží dolní vlákna, takže se prvek prohne dolů jako nosník pod tíhovým zatížením. U staticky určité konstrukce vyvolá teplota jen posunutí; teprve vazby (vetknuté konce, spojitost, nadbytečné pruty) z ní udělají vnitřní síly.

<div class="shots">

![Spojité rovnoměrné zatížení](/screenshots/cs/loads-udl.webp)

![Lineárně proměnné zatížení](/screenshots/cs/loads-trapezoidal.webp)

![Osamělá síla](/screenshots/cs/loads-concentrated.webp)

![Změna teploty](/screenshots/cs/loads-temperature.webp)

</div>

## Úprava a odstranění zatížení {#editing-and-removing-loads}

- Každé zatížení je řádkem v záložce *Zatížení*, kde můžete přímo upravit jeho složky i příznak LCS. Zatížení se také zobrazují jako štítky v tabulkách *Uzly* a *Prvky*.
- **Dvojklikem** na zatížení v zobrazení, nebo kliknutím a volbou **Upravit zatížení**, otevřete dialog úprav.
- Vyberte zatížení a stiskněte <kbd>Delete</kbd>, nebo použijte × v tabulce.
- Zatížení připojená k uzlu či prvku se mažou spolu s ním a při kopírování a vložení se kopírují s ním.

![Záložka Zatížení: jeden řádek na zatížení, složky lze upravovat přímo](/screenshots/cs/loads-table.webp)

## Co k dispozici není {#what-is-not-available}

- **Zatěžovací stavy a kombinace.** Existuje jen jeden zatěžovací stav.
- **Vlastní tíha.** Zadejte ji jako rovnoměrné zatížení s nezaškrtnutým LCS: $f_z = \rho\,g\,A$. Pro IPE 200: 7850 × 9,81 × 0,00285 ≈ 0,22 kN/m.
- **Lineárně proměnné zatížení v globálních osách** na šikmých prutech.
