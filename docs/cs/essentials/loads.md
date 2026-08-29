# Zatížení

Všechna zatížení patří do **jediného zatěžovacího stavu** a působí současně. Chcete-li porovnat scénáře, uložte každý jako samostatný projekt nebo odkaz.

<LoadShowcase />

## Znaménková konvence jednou větou

Globální **x** míří doprava, globální **z** míří **dolů**. Kladné `Fz` nebo `fz` v globálních souřadnicích je tedy zatížení směrem dolů (tíhového typu); kladný moment `My` působí na obrazovce proti směru hodinových ručiček. Podrobnosti v kapitole [Souřadný systém a znaménková konvence](/cs/elements/conventions).

## Uzlová zatížení

Záložka *Zatížení* → **Přidat uzlové zatížení**, nebo kliknutí na uzel → **Přidat zatížení**. Zvolte **Síla/moment**:

| Pole | Význam | Jednotka |
| --- | --- | --- |
| `Fx` | vodorovná síla (+ → doprava) | jednotka síly |
| `Fz` | svislá síla (+ → dolů) | jednotka síly |
| `My` | moment kolem osy y | jednotka momentu |

Složky jsou vždy v **globálním** souřadném systému. Živý náhled šipky v dialogu ukazuje výsledný směr a velikost. V jednom uzlu může být více uzlových zatížení; prostě se sčítají.

### Předepsaná posunutí (poklesy podpor)

Ve stejném dialogu zvolte **Předepsané posunutí** (nebo kliknutí na podepřený uzel → **Předepsat posunutí**). Pole se změní na:

| Pole | Význam | Jednotka |
| --- | --- | --- |
| `Dx` | vnucené vodorovné posunutí | jednotka délky |
| `Dz` | vnucené svislé posunutí (+ → dolů) | jednotka délky |
| `Ry` | vnucené pootočení | rad |

Hodnotu lze zadat jen pro stupeň volnosti, který je v uzlu **podepřen** – pohybovat lze jen podporami. Každý uzel může mít jedno předepsané posunutí; místo přidávání druhého upravte stávající. U staticky určité konstrukce vyvolá pokles podpory jen přetvoření bez vnitřních sil; u staticky neurčité obojí.

## Prvková zatížení

Záložka *Zatížení* → **Přidat prvkové zatížení**, nebo kliknutí na prvek → **Přidat zatížení**. Vyberte **Typ zatížení**; dialog ukazuje živý náhled zatížení na prvku.

### Spojité rovnoměrné zatížení

| Pole | Význam | Jednotka |
| --- | --- | --- |
| `fx` | zatížení na jednotku délky ve směru x | síla / délka |
| `fz` | zatížení na jednotku délky ve směru z | síla / délka |
| **LCS** | zaškrtněte pro výklad `fx`, `fz` v lokálních osách prvku | – |

Nejčastější případ je svislé tíhové zatížení: `fz > 0`, LCS vypnuto. U šikmého prutu je zatížení **kolmé na prut** (např. vítr na krokev) `fz` se **zapnutým** LCS; svislé zatížení na metr *půdorysného* průmětu přímo k dispozici není – nejprve je přepočtěte na metr délky prutu.

### Lineárně proměnné (lichoběžníkové) zatížení

| Pole | Význam |
| --- | --- |
| `f1x`, `f1z` | intenzita v **počátečním** uzlu |
| `f2x`, `f2z` | intenzita v **koncovém** uzlu |

Intenzity se mezi konci mění lineárně. Trojúhelníkové zatížení je prostě `f1z = 0`. Lineárně proměnné zatížení je vždy v **lokálním systému prvku** (políčko LCS je zamčené); u vodorovných prutů lokální a globální z splývají, takže to hraje roli jen u šikmých prutů.

### Osamělá síla

Bodová síla nebo moment kdekoli **po délce** prutu – bez dalšího uzlu.

| Pole | Význam |
| --- | --- |
| `Fx`, `Fz`, `My` | složky síly / moment |
| **Vzdálenost od počátečního uzlu** | vzdálenost od počátečního uzlu, `0 ≤ a ≤ L` |
| **LCS** | složky v lokálních osách |

Průběh posouvající síly má v místě síly skok o `Fz` a průběh momentu zlom; hodnota momentu se tam popisuje automaticky.

### Změna teploty

| Pole | Význam |
| --- | --- |
| **ΔT<sub>s</sub>** – oteplení střednice | rovnoměrné oteplení celého průřezu → prodloužení $\alpha\,\Delta T_s\,L$ |
| **ΔT<sub>d</sub> − ΔT<sub>h</sub>** – rozdíl oteplení dolních a horních vláken | rozdíl teplot po výšce průřezu → křivost $\alpha\,(\Delta T_d - \Delta T_h)/h$ |

Teplotní zatížení používá **α** materiálu a **výšku průřezu h**. Kladné `ΔTd − ΔTh` (teplejší dolní vlákna) prut prohne směrem nahoru. U staticky určité konstrukce vyvolá teplota jen přetvoření; teprve vazby (vetknuté konce, spojitost, nadbytečné pruty) z ní udělají vnitřní síly.

## Úprava a odstranění zatížení

- Zatížení se zobrazují jako štítky v tabulkách *Uzly* / *Prvky* a jako řádky v záložce *Zatížení*, kde se složky (i příznak LCS) upravují přímo.
- **Dvojklik** na zatížení v zobrazení nebo kliknutí a volba **Upravit zatížení** otevře dialog úprav.
- Vyberte zatížení a stiskněte <kbd>Delete</kbd>, nebo použijte ikonu koše.
- Zatížení připojená k uzlu či prvku se mažou spolu s ním a při kopírování se kopírují s ním.

## Co k dispozici není

- **Zatěžovací stavy a kombinace** – pouze jeden stav.
- **Vlastní tíha** – zadejte ji jako spojité zatížení $f_z = \rho\,g\,A$ (např. IPE 200: 7850 × 9,81 × 0,00285 ≈ 0,22 kN/m).
- **Lineárně proměnné zatížení v globálních souřadnicích** na šikmých prutech.
