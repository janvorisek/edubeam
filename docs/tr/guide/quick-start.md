---
description: "Yaklaşık on dakikada düzgün yayılı yüklü, basit mesnetli bir çelik kirişi modelleyin; mesnet tepkilerini, kesme kuvvetini ve eğilme momentini okuyup elle kontrol edin."
---

# Hızlı başlangıç

Yaklaşık on dakikada düzgün yayılı yük altındaki basit mesnetli bir çelik kirişi modelleyecek, mesnet tepkilerini, kesme kuvvetini ve eğilme momentini okuyacak ve bunları ders kitabı formülleriyle karşılaştıracaksınız.

::: tip Birlikte uygulayın
[run.edubeam.app](https://run.edubeam.app/?lang=tr){target="_blank"} adresini ikinci bir sekmede açın. Orada zaten bir model varsa boş bir sayfayla başlamak için üst çubuktaki **Modeli temizle** düğmesini kullanın; tamamen sıfırdan başlamak için *Malzemeleri sil* ve *Kesitleri sil* seçeneklerini de işaretleyin. Temizleme işlemini <kbd>Ctrl</kbd>+<kbd>Z</kbd> ile geri alabilirsiniz; eski model de **☰ → Son modeller** listesinde kalır.

Ekrandaki ipuçlarıyla uygulayarak öğrenmeyi mi tercih edersiniz? **☰ → İlk kirişinizi çizin** benzer bir kirişi fareyle adım adım çizdirir.
:::

## Problem {#the-problem}

<ExampleStructure />

6 m açıklıklı basit mesnetli bir kiriş (solda sabit mesnet, sağda kayıcı mesnet) 12 kN/m'lik düzgün yayılı yük taşıyor. Malzeme: çelik, $E = 210\ \text{GPa}$, $G = 81\ \text{GPa}$. Kesit: IPE 200, $A = 28{,}5\ \text{cm}^2$, $I_y = 1943\ \text{cm}^4$, $h = 200\ \text{mm}$.

## 1. Birimleri kontrol edin {#_1-check-the-units}

Görüntüleyicinin sağ alt köşesindeki birim göstergesi, tüm giriş alanlarının ve sonuçların hangi birimleri kullandığını gösterir. Bu eğitim varsayılan SI birimlerini esas alır: metre, kN, kNm ve MPa.

![Izgara (G), yaslama (S) ve artı imleci düğmeleri ile birim göstergesi](/screenshots/tr/ui-grid-units.webp){.shot-sm}

`ft · kip · kip·ft · ksi` görüyorsanız göstergeye tıklayın ve **Birim sistemi → SI (metrik)** seçeneğini seçin.

## 2. Malzemeyi ve kesiti ekleyin {#_2-add-the-material-and-cross-section}

Elemanlar bir malzemeye ve bir kesite ihtiyaç duyar, bu yüzden önce bunları oluşturun.

1. Alt çubuktaki **Malzemeler** sekmesini açın ve **Malzeme ekle** düğmesine tıklayın.
2. `E = 210000` MPa ve `G = 81000` MPa girin. Yoğunluğu ve `α = 0,000012` 1/K değerini olduğu gibi bırakın. **Malzeme ekle** düğmesine tıklayın.

<div class="shots">

![Malzeme ekle: E ve G değerlerini girin…](/screenshots/tr/qs-material.webp)

![…veya Malzeme kütüphanesinden Steel (S235) seçin](/screenshots/tr/qs-material-library.webp)

</div>

3. **Kesitler** sekmesini açın ve **Kesit ekle** düğmesine tıklayın.
4. `Alan = 0,00285` m², `Iy = 1,943e-5` m⁴, `Yükseklik = 0,2` m ve `Kayma düzeltme katsayısı = 1` girin. **Kesit ekle** düğmesine tıklayın.

![Kesit ekle. Kesiti kütüphaneden de seçebilir veya çokgen olarak çizebilirsiniz.](/screenshots/tr/qs-cross-section.webp){.shot-md}

::: details Kayma düzeltme katsayısı neden önemli?
EduBeam, kayma şekil değiştirmesini hesaba katan Timoshenko kiriş elemanlarını kullanır. `k` kayma düzeltme katsayısıdır: dikdörtgen için $k \approx 0{,}83$, $A$ olarak kesitin tüm alanı alındığında I kesit için yaklaşık $0{,}4$–$0{,}5$. Tüm alanla birlikte `k = 1` almak kayma esnekliğini biraz *olduğundan az* gösterir. Bunun gibi narin bir kirişte sehimdeki fark %1'in çok altındadır. Formül için [kiriş teorisi sayfasına](/tr/elements/beam) bakın.
:::

## 3. Düğümleri ekleyin {#_3-add-the-nodes}

1. **Düğümler** sekmesini açın. Burada iki **Düğüm ekle** düğmesi vardır: birincisi bir pencere açar, ikincisi (imleç simgeli olan) düğümleri fareyle yerleştirir. Birincisine tıklayın.
2. `X = 0`, `Z = 0` girin ve **Düğüm ekle** düğmesine tıklayın. Düğüm `1` olarak etiketlenir.
3. `X = 6`, `Z = 0` noktasına ikinci bir düğüm ekleyin. Bu, `2` numaralı düğümdür.

![Düğüm ekle penceresinde mesnetleri de hemen tanımlayabilirsiniz](/screenshots/tr/qs-node.webp){.shot-md}

Fare düğmesini kullanırsanız tuvale her tıklamanızda bir düğüm yerleşir. **Izgaraya yasla** açıkken (<kbd>S</kbd>) tıklamalar ızgara adımına (varsayılan 0,1 m) yaslanır.

## 4. Düğümleri bir elemanla birleştirin {#_4-connect-them-with-an-element}

1. **Elemanlar** sekmesini açın ve ilk **Eleman ekle** düğmesine tıklayın.
2. **Başlangıç düğümü** olarak `1`, **Bitiş düğümü** olarak `2` seçin. Malzemeniz ve kesitiniz zaten seçilidir. **Eleman ekle** düğmesine tıklayın.

![Eleman ekle: iki uç düğümü, isteğe bağlı uç mafsalları, malzeme ve kesit](/screenshots/tr/qs-element.webp){.shot-md}

Düğümler arasında bir çizgi belirir. Modeli ekrana sığdırmak için <kbd>F</kbd> tuşuna basın.

## 5. Mesnetleri ekleyin {#_5-add-the-supports}

**Düğümler** sekmesinde, **Tutulu serbestlik dereceleri** sütununda her düğüm için bir mesnet sembolü seçici ve üç onay kutusu bulunur: `Dx`, `Dz`, `Ry`.

- `1` numaralı düğüm: **Mafsal** sembolünü seçin veya **Dx** ve **Dz** kutularını işaretleyin.
- `2` numaralı düğüm: **Kayıcı mesnet** sembolünü seçin veya yalnızca **Dz** kutusunu işaretleyin.

![Düğümler tablosunda mesnetler: 1 numaralı düğüm sabit mesnetli, 2 numaralı düğüm kayıcı mesnetli](/screenshots/tr/qs-supports.webp)

Görüntüleyicide bir düğüme tıklayıp **Düğüm mesnetleri** seçeneğini de seçebilirsiniz. Tüm mesnet türleri [Düğümler ve mesnetler](/tr/essentials/nodes-supports#supports) sayfasında listelenmiştir.

## 6. Yükü ekleyin {#_6-add-the-load}

1. **Yükler** sekmesini açın ve **Eleman yükü ekle** düğmesine tıklayın.
2. **Yük türü**: *Düzgün yayılı yük*. **Eleman**: `1`.
3. `fz = 12` kN/m girin ve `fx = 0` olarak bırakın. **Eleman yükü ekle** düğmesine tıklayın.

![Pencere, yükün eleman üzerindeki önizlemesini gösterir](/screenshots/tr/qs-load.webp){.shot-md}

Pozitif `fz` +z yönünü, yani ekranda **aşağıyı** gösterir; dolayısıyla pozitif bir değer yerçekimi yönündeki bir yüktür. Bkz. [işaret kabulü](/tr/elements/conventions).

## 7. Sonuçları okuyun {#_7-read-the-results}

Çözüm, yük eklenir eklenmez görünür. Görüntüleyicinin sağ üstündeki görünüm paneli diyagramları açıp kapatır. **Deforme şekil**, **M<sub>y</sub>(x)** ve **Mesnet tepkileri** varsayılan olarak açıktır. Kesme kuvvetini eklemek için **V<sub>z</sub>(x)** kutusunu işaretleyin.

![Kesme kuvveti (yeşil), eğilme momenti (kırmızı), mesnet tepkileri (mor) ve deforme şekil](/screenshots/tr/qs-results.webp)

| Katman | Görmeniz gereken |
| --- | --- |
| **Mesnet tepkileri** | 1 ve 2 numaralı düğümlerde yukarı yönlü, **36 kN**'lik iki ok. |
| **V<sub>z</sub>(x)** | Solda **+36 kN**'den sağda **−36 kN**'ye inen ve açıklık ortasında sıfırdan geçen bir doğru. |
| **M<sub>y</sub>(x)** | Açıklık ortasında **54 kNm**'lik en büyük değere ulaşan bir parabol. |
| **Deforme şekil** | Simetrik bir sehim. Dönmesini okumak için imleci `1` numaralı düğümün üzerine getirin: **2,6469 · 10⁻² rad**. |

Sayısal değerler alt çubuktaki **Sonuçlar** sekmesindedir. **Düğüm sonuçları** her düğüm için `Dx`, `Dz`, `Ry` değerlerini listeler. **Eleman sonuçları** her elemanın uç kuvvetlerini kendi yerel koordinat sisteminde listeler.

Diyagramlar çok büyük veya çok küçük görünüyorsa **Ayarlar → Görüntüleyici ayarları → Boyutlar** altındaki **Sonuç ölçeği** değerini değiştirin.

## 8. Elle kontrol edin {#_8-check-by-hand}

| Büyüklük | Formül | El hesabı | EduBeam |
| --- | --- | --- | --- |
| Mesnet tepkisi | $R = qL/2$ | 36 kN | 36 kN |
| En büyük kesme kuvveti | $V = qL/2$ | 36 kN | 36 kN |
| En büyük moment | $M = qL^2/8$ | 54 kNm | 54 kNm |
| Mesnet dönmesi | $\varphi = qL^3/(24EI)$ | 0,02647 rad | 0,02647 rad |
| Açıklık ortası sehimi (eğilme) | $w = 5qL^4/(384EI)$ | 49,63 mm | |
| Açıklık ortası sehimi (kayma) | $w_s = qL^2/(8kGA)$ | 0,23 mm | |
| Açıklık ortası sehimi (toplam) | toplam | 49,86 mm | 49,86 mm |

Açıklık ortasında düğüm olmadığından oradaki sehimi okumak için bir düğüm ekleyin: ikinci **Düğüm ekle** düğmesini seçin, kirişin üzerinde `X = 3` noktasına tıklayın ve **Yapıya bağla** seçeneğini seçin. Kiriş ikiye bölünür ve yeni düğümün **Sonuçlar** sekmesindeki `Dz` değeri 49,86 mm olur. Eleman kesin sonuç verdiği için bölmek hiçbir sonucu değiştirmez.

Her şey tutuyor. Daha fazla elle kontrol tarifi (konsol, iki ucu ankastre kiriş, kafes sistem, sıcaklık) [Sonuçların elle kontrolü](/tr/guide/verification) sayfasındadır.

## 9. Deneyin {#_9-experiment}

EduBeam'in asıl gücü burada ortaya çıkar. Aşağıdakilerin her birini deneyin ve diyagramların güncellenmesini izleyin:

- **2 numaralı düğümü** sağa **sürükleyin**: moment $L^2$ ile artar.
- Ankastre yapmak için **1 numaralı düğümde `Ry` kutusunu işaretleyin**: açıklık ortasındaki moment azalır ve mesnette negatif moment oluşur.
- İki açıklıklı bir sürekli kiriş elde etmek için az önce eklediğiniz **açıklık ortası düğümünde `Dz` kutusunu işaretleyin**.
- Bir uçtaki momenti serbest bırakmak için Elemanlar sekmesinde bir elemanın **uç mafsalını işaretleyin**.
- Herhangi bir adımı geri almak için <kbd>Ctrl</kbd>+<kbd>Z</kbd> tuşlarına basın.

## 10. Kaydedin veya paylaşın {#_10-save-or-share}

- **Modeli paylaş** (üst çubukta veya ☰ menüsünde) size modelin tamamını içeren bir bağlantı verir. Bağlantıyı bir e-postaya, sohbete veya sunumunuza yapıştırın.
- **☰ → Projeyi kaydet** (<kbd>Ctrl</kbd>+<kbd>S</kbd>) bir `project.json` dosyası indirir; bu dosyayı daha sonra **Proje aç** ile veya uygulamanın üzerine sürükleyip bırakarak açabilirsiniz.
- **☰ → Görüntüyü dışa aktar** (<kbd>Ctrl</kbd>+<kbd>P</kbd>) çizimi bir rapor için PNG veya SVG olarak kaydeder.

Modeliniz tarayıcıda da saklanır, bu yüzden sayfayı yenilediğinizde kaybolmaz. Bkz. [İçe aktarma, dışa aktarma ve paylaşım](/tr/essentials/import-export).

## Sırada ne var? {#where-next}

- [Üç mafsallı çerçeve eğitimi](/tr/tutorials/three-hinged-frame): iç mafsallı, elle kontrol edilmiş bir çerçeve.
- [Örnekler](/tr/examples/): hazır çerçeveleri ve kafes sistemleri tek tıkla açın.
- [Yükler](/tr/essentials/loads): trapez yayılı, tekil ve sıcaklık yükleri, öngörülen yer değiştirmeler.
- [Klavye, fare ve dokunmatik](/tr/reference/shortcuts): tuvalde daha hızlı çalışın.
