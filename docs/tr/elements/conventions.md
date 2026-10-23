---
description: "EduBeam işaret kabulleri: x sağa ve z aşağı genel eksenler, pozitif yer değiştirmeler, dönmeler ve yükler, elemanın yerel eksenleri, iç kuvvetler ve mesnet tepkileri."
---

# Koordinat sistemi ve işaret kabulü

<Edubeam /> ile elde edilen "yanlış" sonuçların çoğu aslında beklenmedik bir işaret kabulünden kaynaklanır. Aşağıda anlatılanların tamamı çözücünün gerçekte kullandığı kabullerdir.

## Genel eksenler {#global-axes}

- **x**: yatay eksen, pozitif yönü **sağa** doğru.
- **z**: düşey eksen, pozitif yönü ekranda **aşağı** doğru.
- **y**: düzleme dik eksen (sağ el kuralına göre izleyiciye doğru yönelir). Dönmeler ve momentler y ekseni etrafında tanımlanır.

Izgaranın köşesindeki eksen göstergesi x eksenini kırmızı, z eksenini yeşil gösterir. Bu nedenle 3 m'lik bir kolonun tabanı `Z = 0` noktasındaysa, tepesindeki düğüm `Z = −3` olur.

## Serbestlik dereceleri {#degrees-of-freedom}

Her düğümün `Dx`, `Dz` (ötelenmeler) ve `Ry` (dönme) serbestlik dereceleri vardır. Pozitif `Dz` aşağı doğru bir yer değiştirmedir; pozitif `Ry` ise ekranda **saat yönünün tersine** bir dönmedir. Aynı işaretler öngörülen yer değiştirmeler ve düğüm sonuçları için de geçerlidir.

## Yükler {#loads}

| Yük | Pozitif yön |
| --- | --- |
| `Fx`, `fx`, `f1x`… | +x (sağa; LCS açıksa elemanın yerel x ekseni boyunca) |
| `Fz`, `fz`, `f1z`… | +z (**aşağı**; LCS açıksa yerel z ekseni boyunca) |
| `My` | ekranda saat yönünün tersine |
| `ΔTc` | ısınma (uzama) |
| `ΔTb − ΔTt` | alt lif üst liften daha sıcak |

Yani yer çekimi yükü **pozitif** bir `fz`, sol kolonu sağa doğru iten rüzgâr yükü de pozitif bir `fx` olur.

## Elemanın yerel eksenleri {#element-local-axes}

Yerel **x** ekseni başlangıç düğümünden bitiş düğümüne doğru uzanır; yerel **z** ekseni ona diktir. Her ikisi de genel eksenlerin eleman açısı $\alpha$ kadar döndürülmesiyle elde edilir. Soldan sağa çizilmiş yatay bir elemanda yerel ve genel eksenler çakışır. Elemanın yönünü ters çevirmek için *Elemanlar* tablosundaki **Düğümleri yer değiştir** düğmesini kullanın.

## İç kuvvetler {#internal-forces}

| Büyüklük | Pozitif olduğunda |
| --- | --- |
| **N** | çekme |
| **V<sub>z</sub>** | yapı statiğindeki alışılmış işaret: yer çekimi yükü altındaki basit mesnetli bir kirişte V sol mesnette pozitif, sağ mesnette negatiftir |
| **M<sub>y</sub>** | **alt lifleri çeken** moment, yani alt (+z) liflerde çekme oluşur. Yer çekimi yükü altındaki basit mesnetli bir kirişin açıklık ortası momenti pozitiftir; ucuna tekil yük etkiyen bir konsolun ankastre ucundaki moment ise negatiftir (üst lifler çekmede) |

## Çubuk uç kuvvetleri (Eleman sonuçları tablosu) {#end-forces-element-results-table}

`X12, Z12, M12` elemana başlangıç düğümünde, `X21, Z21, M21` ise bitiş düğümünde etkir. Bu kuvvetler **yerel** sistemde verilir ve pozitif yönleri yerel eksenlerle ve `My` ile aynıdır. Bunlar düğümlerin elemana uyguladığı kuvvetlerdir, yani $\mathbf{f} = \mathbf{K}_l\,\mathbf{u}_l - \mathbf{f}_{eq}$; burada $\mathbf{f}_{eq}$, eleman yüklerinin eşdeğer düğüm yükleridir. Bir düğümde birleşen tüm elemanların uç kuvvetlerinin toplamı, o düğümdeki düğüm yükleri ve mesnet tepkileriyle dengededir.

## Mesnet tepkileri {#reactions}

Tutulu her serbestlik derecesi için bir mesnet tepkisi vardır. Mesnet tepkisi, düğümün koordinat sisteminde verilir (düğüm yerel eksen açısı tanımlanmışsa bu sistem o açı kadar döndürülmüştür). Görüntüleyicideki mesnet tepkisi okları, mesnedin yapıyı ittiği yönü gösterir.

## y yukarı eksenler {#y-up-axes}

**Ayarlar → Koordinat sistemi → x sağa, y yukarı** seçeneği, girdiğiniz ve okuduğunuz her şeyi ders kitaplarındaki sisteme geçirir: **x** sağa, **y** yukarı ve **z** izleyiciye doğru. Model, kaydedilen dosyalar ve çizimler aynı kalır; yalnızca sayılar ve adlar değişir:

| Büyüklük | z aşağı (varsayılan) | y yukarı |
| --- | --- | --- |
| Düşey koordinat | `Z` | `Y`, ters işaretli |
| Düşey yükler, yer değiştirmeler, mesnet tepkileri, uç kuvvetleri | `Fz`, `fz`, `Dz`, `Z12`… | `Fy`, `fy`, `Dy`, `Y12`…, ters işaretli |
| Dönmeler ve momentler | `Ry`, `My` | `Rz`, `Mz`, aynı işaretli (saat yönünün tersi pozitif) |
| Mesnet açısı α | saat yönünde ölçülür | saat yönünün tersine ölçülür, ters işaretli |
| İç kuvvetler N, V, M | | değişmez, diyagramlar aynı şekilde çizilir |

Yani yer çekimi yükü **negatif** bir `fy` olur ve 3 m'lik bir kolonun tepesi `Y = 3` noktasındadır.

## Birimler {#units}

Çözücü kendi içinde SI birimleriyle çalışır (m, N, Pa, rad, K). Görüntülenen birimler yalnızca girdiğiniz ve okuduğunuz değerleri etkiler; birimleri değiştirmek modeli asla değiştirmez.
