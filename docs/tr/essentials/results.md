---
description: "Normal kuvvet, kesme kuvveti ve eğilme momenti diyagramları, mesnet tepkileri ve deforme şekil; üzerine gelince görünen değerler, sonuç tabloları, CSV ve rijitlik matrisi."
---

# Sonuçlar ve diyagramlar

<Edubeam />, modeli her değişiklikten sonra (en fazla saniyede birkaç kez) yeniden çözer; böylece sonuçlar her zaman günceldir. *Çöz* düğmesi yoktur. Hiçbir şey çizilmiyorsa model henüz çözülemiyor demektir; nedenini görüntüleyicinin sol üstündeki mesaj söyler (bkz. [Sorun giderme](/tr/reference/troubleshooting)).

Bu sayfadaki görsellerin hepsi aynı modeli gösterir: 10 kN/m yük altındaki [üç mafsallı çerçeve](/tr/tutorials/three-hinged-frame).

## Görüntüleyicideki diyagramlar {#overlays-in-the-viewer}

Diyagramları görüntüleyicinin sağ üstündeki **görünüm seçeneklerinden** açıp kapatırsınız (⚙ düğmesi bu seçenekleri gösterir veya gizler).

| Diyagram | Renk (varsayılan) | Notlar |
| --- | --- | --- |
| **Deforme şekil** | gri | Büyütülmüş çizilir: en büyük yer değiştirme, *Sonuç ölçeği* kadar piksel uzunluğunda gösterilir. Varsayılan olarak açıktır. |
| **N (x)**, normal kuvvet | mavi | Çekme pozitiftir. Elemana eksenel yük etkimiyorsa eleman boyunca sabittir. |
| **V<sub>z</sub> (x)**, kesme kuvveti | yeşil | Düzgün yayılı yük altında doğrusal, trapez yük altında ikinci derecedendir; tekil yükte sıçrama yapar. |
| **M<sub>y</sub> (x)**, eğilme momenti | kırmızı | Alt lifleri çektiğinde pozitiftir. Değerler iki uçta, tekil yüklerde ve her yerel ekstremumda (V = 0 olan yerde) yazılır. Varsayılan olarak açıktır. |
| **Mesnet tepkileri** | mor | Her tutulu serbestlik derecesi için bir ok ve bir değer. Varsayılan olarak açıktır. |

Değerler her diyagramın karakteristik noktalarına yazılır. Etiketlerin yönünü, diyagramların boyutunu ve renkleri [Ayarlar](/tr/essentials/units-settings#viewer-settings) bölümünden değiştirebilirsiniz.

<div class="shots">

![Normal kuvvet N: iki kolonda 40 kN, kirişte 20 kN basınç](/screenshots/tr/results-normal.webp)

![Kesme kuvveti V: kolonlarda 20 kN; kirişte köşelerde 40 kN, mafsala doğru sıfıra iner](/screenshots/tr/results-shear.webp)

![Eğilme momenti M: iki köşede −80 kNm, kolon diplerinde ve mafsalda sıfır](/screenshots/tr/results-moment.webp)

![Deforme şekil (büyütülmüş): C mafsalı aşağı iner](/screenshots/tr/results-deformed.webp)

</div>

![Mesnet tepkileri: her mafsallı mesnette 40 kN düşey ve 20 kN yatay](/screenshots/tr/results-reactions.webp){.shot-lg}

### İşaretin okunması {#reading-the-sign}

Bir değerin işaretini, diyagramın çubuğun hangi tarafına çizildiğinden değil, etiketinden okuyun. Negatif eğilme momenti üst lifleri çeker: kirişte üst lifler, çerçeve köşesinde ise dış taraf çekmededir.

## Üzerine gelince görünen bilgiler {#hover-tooltips}

Bir değeri okumanın en hızlı yolu, imleci nesnenin üzerine getirmektir:

- **Düğüm**: `ux`, `uz` ve `φy` (yer değiştirmeler yer değiştirme biriminde, dönme radyan cinsinden).
- **Eleman**: etiketi, kesiti ve malzemesi.
- **Yük**: bileşenleri.

Dokunmatik ekranda nesneye dokunun. Aynı bilgiler nesnenin seçim panelinde görünür.

![İmleç, Hızlı başlangıç kirişinin 2 numaralı düğümünün üzerinde](/screenshots/tr/ui-hover.webp){.shot-sm}

## Sonuçlar sekmesi {#results-tab}

Alt paneldeki **Sonuçlar** sekmesinde iki tablo vardır; **Düğüm sonuçları** ve **Eleman sonuçları** ile aralarında geçiş yaparsınız.

### Düğüm sonuçları {#nodal-results}

Her düğüm için bir satırda **Dx**, **Dz** (yer değiştirme biriminde) ve **Ry** (rad) yer alır. İşaretler global eksenleri izler: pozitif `Dz` aşağı doğrudur, pozitif `Ry` ise ekranda saat yönünün tersinedir.

![Üç mafsallı çerçevenin düğüm sonuçları (Sayı biçimi: Otomatik)](/screenshots/tr/results-nodal.webp)

### Eleman sonuçları {#element-results}

Her eleman için bir satırda **elemanın yerel koordinat sistemindeki çubuk uç kuvvetleri** yer alır:

| Sütun | Anlamı |
| --- | --- |
| `X12`, `Z12`, `M12` | elemanın **başlangıç** düğümünde elemana etkiyen eksenel kuvvet, kesme kuvveti ve moment |
| `X21`, `Z21`, `M21` | aynı büyüklükler **bitiş** düğümünde |

![Üç mafsallı çerçevenin eleman sonuçları](/screenshots/tr/results-element.webp)

Bunlar düğümlerin elemana uyguladığı kuvvetlerdir: eleman rijitlik matrisi ile uç yer değiştirmelerinin çarpımından eşdeğer düğüm yüklerinin çıkarılmasıyla bulunur. Diyagramların N-V-M işaret kabulünü değil, yerel eksenleri izlerler:

- [Hızlı başlangıç](/tr/guide/quick-start) bölümündeki 6 m'lik basit mesnetli kiriş için: `Z12 = Z21 = −36 kN`. İki mesnet de kirişi yukarı, yani −z yönünde iter.
- Başlangıç düğümünde ankastre, ucunda 18 kN'lik aşağı yönlü yük taşıyan bir konsol için: `Z12 = −18 kN`, `M12 = +72 kNm`, `Z21 = +18 kN`, `M21 = 0`.
- Çerçevenin 1 numaralı kolonu için (A altta, B üstte): `X12 = +40 kN`, yerel x ekseni boyunca elemanın içine doğru iter; bu da 40 kN'lik basınç demektir.

### CSV olarak dışa aktarma ve kopyalama {#export-csv-and-copy}

**CSV olarak dışa aktar**, iki tabloyu içeren `edubeam-results.csv` dosyasını ekranda gösterilen birimlerle, elektronik tabloya hazır biçimde indirir. Düğüm tablosunda ayrıca **mesnet tepkileri** `Rx`, `Rz`, `My` de listelenir. **Kopyala**, aynı tabloları sekmeyle ayrılmış metin olarak panoya koyar; bu metni doğrudan Excel'e, LibreOffice'e veya Google E-Tablolar'a yapıştırabilirsiniz. Dışa aktarılan dosyada eleman uç kuvvetlerinin adları `N1 V1 M1 N2 V2 M2` şeklindedir.

### Rijitlik matrisi {#stiffness-matrix}

Bir elemanın panelinden veya tablo satırından **Rijitlik matrisi** seçeneğini seçtiğinizde, elemanın global koordinatlardaki 6 × 6 rijitlik matrisini gösteren bir pencere açılır. Rijitlik (deplasman) yöntemi derslerinde elle yapılan birleştirmeyi kontrol etmek için kullanışlıdır. Formüller [teori kılavuzunda](/tr/elements/beam) yer alır.

## Sayı biçimi {#number-format}

Sonuçlar beş anlamlı basamakla gösterilir. Nasıl yazılacaklarını **Ayarlar → Dil ve bölge → Sayı biçimi** belirler:

| Biçim | 40 000 şöyle yazılır | Kullanım alanı |
| --- | --- | --- |
| **Bilimsel** (varsayılan) | 4 · 10⁴ | büyüklük mertebesi çok farklı olan değerler |
| **Mühendislik** | 40 · 10³ | kilo / mega öneklerine uyum |
| **Otomatik** | 40000 | derslerdeki gündelik sayılar |

Otomatik biçim, 0,001 ile 100 000 arasındaki değerleri düz sayı olarak yazar, bu aralığın dışında ise 10'un kuvvetlerini kullanır. Ondalık ayırıcı seçilen dile göre belirlenir.

## Hassasiyet ve doğruluk {#precision-and-accuracy}

- Kiriş elemanı; düğüm, düzgün yayılı, trapez, tekil ve sıcaklık yüklemeleri altında doğrusal Timoshenko modeli için kesin sonuç verir. Bu nedenle sonuçlar eleman sayısına **bağlı değildir**.
- Hesap çift duyarlıkla yapılır. `1,5 · 10⁻¹⁸` gibi çok küçük değerler yuvarlama hatasıdır ve sıfır anlamına gelir.
- Sehimler **kayma şekil değiştirmesini** içerir. Narin çubuklarda bu, Euler–Bernoulli değerine yüzde birin altında bir katkı yapar; yüksek veya kısa çubuklarda birkaç yüzdeye ulaşabilir. Bu etkiyi bastırmak için kesitin kayma düzeltme katsayısını büyük bir değere ayarlayın.

## Sonuçları rapora aktarma {#results-in-a-report}

- **☰ → Görüntüyü dışa aktar** (<kbd>Ctrl</kbd>+<kbd>P</kbd>) çizimi, seçtiğiniz diyagramlarla birlikte PNG veya SVG olarak kaydeder. Bkz. [Görüntüyü dışa aktarma](/tr/essentials/import-export#export-an-image).
- Sayılar için **Sonuçlar → CSV olarak dışa aktar** veya **Kopyala** kullanılır.
- **Modeli paylaş** bir bağlantı verir; okuyucu bu bağlantıyla modelin kendisini açabilir.
