---
description: "EduBeam'de kiriş elemanları ekleyin, uç mafsallarını ve eleman yönünü ayarlayın; malzemeleri ve özel çokgen kesitler dahil kesitleri tanımlayın."
---

# Elemanlar, malzemeler ve kesitler

## Kiriş elemanı {#the-beam-element}

<Edubeam /> tek bir eleman türü kullanır: x–z düzleminde, her ucunda üç serbestlik derecesi (`Dx`, `Dz`, `Ry`) bulunan **2B Timoshenko kirişi**. Eleman normal kuvvet, kesme kuvveti ve eğilme momenti taşır ve kayma deformasyonunu da hesaba katar; kesitte kayma düzeltme katsayısı bu yüzden vardır. Formülasyonun tamamı [teori kılavuzunda](/tr/elements/beam) yer alır.

<TrussElement :moment="true" caption="2B kiriş elemanı – düğüm başına üç serbestlik derecesi" />

Doğrusal modelde eleman boyunca sonuçlar kesindir, bu yüzden her çubuk için tek eleman yeterlidir. Ara düğümleri yalnızca mesnet, mafsal veya kesit değişimi gereken yerlere ya da sonuç okumak istediğiniz noktalara ekleyin.

### Eleman ekleme {#adding-elements}

| Yöntem | Nasıl yapılır |
| --- | --- |
| **Pencere** | *Elemanlar* sekmesi → ilk **Eleman ekle** düğmesi ya da tuval menüsü → *Eleman ekle*. **Başlangıç düğümü** ile **Bitiş düğümü**nü, mafsalları, malzemeyi ve kesiti seçin. |
| **Fare** | *Elemanlar* sekmesi → ikinci **Eleman ekle** düğmesi (imleç simgeli) ya da tuval menüsündeki öğeye <kbd>Ctrl</kbd> basılıyken tıklayın. Başlamak için bir düğüme, bağlamak için sonraki düğüme tıklayın; tuvalin boş bir yerine tıklarsanız orada yeni bir düğüm oluşur. Tıklamaya devam ederek çoklu çizgi çizebilir, <kbd>Esc</kbd> ile çizimi bitirebilirsiniz. Üstteki şeritte, çizdiğiniz her eleman için **Başlangıç mafsalı** ve **Bitiş mafsalı** ayarlanır. Modeldeki ilk malzeme ve ilk kesit kullanılır. |

![Eleman ekle penceresi](/screenshots/tr/qs-element.webp){.shot-md}

::: warning Önce malzemeler ve kesitler
Her elemanın bir malzemesi ve bir kesiti olmalıdır. Modelde hiç yoksa görüntüleyici *Tanımlı malzeme yok.* / *Tanımlı kesit yok.* uyarısını ve bir **Yeni ekle** düğmesi gösterir.
:::

### Eleman yönü {#element-direction}

**Yerel x ekseni** başlangıç düğümünden bitiş düğümüne doğrudur. Bu yön şunlar için önemlidir:

- yerel koordinatlardaki yükler (**LCS** işaretli),
- tekil yüklerde *Yükün başlangıç düğümüne uzaklığı*,
- sonuç tablosunda çubuk uç kuvvetlerinin sırası (başlangıçta `X12, Z12, M12`, bitişte `X21, Z21, M21`).

Bir elemanın yönünü ters çevirmek için *Elemanlar* tablosunda iki düğüm arasındaki **Düğüm sırasını ters çevir** düğmesini kullanın.

### Uç mafsalları {#end-hinges}

*Elemanlar* tablosunda her elemanın başlangıç ve bitiş için iki **Uç mafsalları** onay kutusu vardır. Aynı kutular Eleman ekle penceresinde, elemanın **Elemanı düzenle** panelinde ve fareyle çizerken üstteki şeritte de bulunur. İşaretli mafsal o uçtaki eğilme momentini serbest bırakır:

- tek mafsal, çerçevenin veya sürekli kirişin içinde bir mafsal oluşturur (moment orada sıfırdır);
- iki mafsal, yalnızca normal kuvvet taşıyan bir **kafes çubuğu** oluşturur.

<TrussElement :hinges="[true, true]" caption="İki ucu mafsallı → kafes çubuğu" />

![Üç mafsallı çerçevenin Elemanlar tablosu: 2 numaralı elemanın bitişinde, C düğümünde bir mafsal var](/screenshots/tr/elements-table.webp)

Bir düğümde iki eleman birleşiyor ve yalnızca birinde mafsal varsa, diğeri düğüme moment aktarmaya devam eder. Bu yüzden "düğümü" değil, serbest bırakmak istediğiniz elemanı mafsallayın. Mafsallar yapıyı mekanizmaya dönüştürürse EduBeam onları daire içine alır ve yapının nasıl hareket ettiğini gösterir.

### Düzenleme ve silme {#editing-and-deleting}

Bir elemana tıklayıp panelini kullanın (**Elemanı düzenle**, **Yük ekle**, **Rijitlik matrisi**, **Sil**) ya da elemanı *Elemanlar* tablosunda düzenleyin. Bir elemanı silmek yüklerini de siler. **Rijitlik matrisi**, elemanın global koordinatlardaki 6 × 6 rijitlik matrisini (N/m, N ve N·m) bir pencerede açar; varsa uç mafsalları matrise önceden kondanse edilmiştir. Elle yapılan birleştirmeyi kontrol etmek için kullanışlıdır.

## Malzemeler {#materials}

*Malzemeler* sekmesi → **Malzeme ekle**:

| Alan | Sembol | Birim | Notlar |
| --- | --- | --- | --- |
| Elastisite modülü | $E$ | basınç birimi (varsayılan MPa) | Çelik ≈ 210 000 MPa, beton ≈ 30 000 MPa, ahşap ≈ 11 000 MPa |
| Kayma modülü | $G$ | basınç birimi | $G = E / (2(1+\nu))$; çelik ≈ 81 000 MPa. Yalnızca Timoshenko kayma terimini etkiler. |
| Yoğunluk | $\rho$ | kütle / uzunluk³ (kg/m³, lb/ft³) | Projeyle birlikte kaydedilir. Statik çözücü kullanmaz (zati ağırlık yükü yoktur). |
| Isıl genleşme katsayısı | $\alpha$ | 1/K veya 1/°F | [Sıcaklık yüklemelerinde](/tr/essentials/loads#temperature-load) kullanılır. Çelik: 12 × 10⁻⁶ /K. |

<div class="shots">

![Malzeme ekle](/screenshots/tr/qs-material.webp)

![Malzeme kütüphanesi](/screenshots/tr/qs-material-library.webp)

</div>

**Malzeme kütüphanesi** hazır malzemeler sunar. Birimlerinize uyan grup ilk sırada listelenir.

- **Metaller:** S235, S275, S355 yapı çelikleri, paslanmaz çelikler, dökme demir, alüminyum alaşımları, bakır, pirinç, bronz, titanyum; ABD çelikleri ASTM A992, A36, A572 Gr. 50 ve HSS A500 Gr. C.
- **Beton:** normal ve hafif beton, C25/30, C30/37, C40/50 sınıfları ile f′c = 4 ksi ve 5 ksi.
- **Ahşap:** C24, GL24h, GL32h.
- **Diğer:** cam, GFRP, CFRP, HDPE, PVC, PMMA, polikarbonat.

Kütüphaneyi araç çubuğundaki düğmeyle ya da *Malzeme ekle* penceresindeki *Veya kütüphaneden seçin* ile açın.

Elemanların hâlâ kullandığı bir malzeme silinemez; önce bu elemanlara başka bir malzeme atayın.

## Kesitler {#cross-sections}

*Kesitler* sekmesi → **Kesit ekle**:

| Alan | Sembol | Birim | Notlar |
| --- | --- | --- | --- |
| Alan | $A$ | alan birimi | Eksenel rijitlik $EA$ |
| Atalet momenti | $I_y$ | atalet momenti birimi | Çizim düzlemine dik eksene göre eğilme rijitliği $EI_y$ |
| Yükseklik | $h$ | kesit boyutu birimi | Sıcaklık farkı yüklemelerinde kullanılır (eğrilik $= \alpha\,\Delta T / h$) |
| Kayma düzeltme katsayısı | $k$ | – | Timoshenko kayma düzeltme katsayısı: etkili kayma alanı $kA$'dır. Kayma deformasyonunu neredeyse yok saymak için `1`, dikdörtgenler için yaklaşık 0,83, I kesitler için $A_{web}/A$ kullanın. |

**Kesit kütüphanesi** dikdörtgen, kare ve daire kesitler, IPE ve HEA profilleri, RHS ve CHS borular ile AISC W profilleri ve HSS (dikdörtgen ve dairesel) için yaklaşık değerler verir. Kayma katsayıları kesit şekline göredir: I profiller için $h\,t_w/A$, dikdörtgen kutu kesitler için $2ht/A$, dairesel borular için 0,5, dikdörtgenler için 0,833 ve daireler için 0,9. Bu değerleri başlangıç noktası olarak görün ve kullanmadan önce bir profil tablosuyla karşılaştırın.

![Kesit kütüphanesi](/screenshots/tr/sections-library.webp){.shot-lg}

### Çokgen kesitler {#polygonal-sections}

*Kesitler* sekmesi → **Çokgen kesit** ya da *Kesit ekle* penceresindeki *Veya çokgen bir kesit tanımlayın* bir şekil düzenleyici açar.

![I kesit hazır şekliyle, asal eksenleri ve atalet elipsiyle çokgen kesit düzenleyicisi](/screenshots/tr/sections-polygon.webp)

- **Başlayın:** boyutlarıyla birlikte bir hazır şekil (dikdörtgen, I, T, L, U, dikdörtgen veya dairesel kutu kesit, daire) seçin ve **Uygula**'ya basın.
- **Düzenleyin:** köşeleri sürükleyin (**Yakalama adımı**na yakalanırlar), köşe eklemek için bir kenarın orta noktasına tıklayın, köşeyi silmek için üzerine çift tıklayın ya da koordinatları köşe tablosuna yazın. **Boşluk ekle** bir iç kontur ekler. **Ağırlık merkezine ortala** şekli, ağırlık merkezi orijine gelecek biçimde taşır.
- **Okuyun:** alan $A$, ağırlık merkezi, ağırlık merkezine göre atalet momentleri $I_y$, $I_z$, $I_{yz}$, asal eksen açısı $\alpha$ ($y$'den 1 eksenine) ile asal atalet momentleri $I_1$, $I_2$ ve atalet yarıçapları. Çizimde atalet elipsi de gösterilir.

Kaydettiğinizde $A$, $I_y$ ve $h$ şekilden doldurulur. Tabloda salt okunur görünürler; şekli yeniden düzenlemek için *İşlemler* sütunundaki çokgen düğmesini kullanın. Kayma düzeltme katsayısı $k$'yi yine siz girersiniz. Kesit koordinatları yereldir ve sağ el kuralına uyar: $x$ ekrandan dışarı, $y$ sola, $z$ aşağı doğrudur.

Şekil çerçeve düzlemine göre simetrik değilse (örneğin bir L korniyer), düzenleyici 2B analizin yalnızca eleman tüm boyu boyunca yanal yer değiştirmeye ve burulmaya karşı tutulduğunda (örneğin bir döşemeyle) kesin olduğu uyarısını verir. $I_{yz}$ önemli olduğunda hangi eğilme rijitliğinin kullanılacağını siz seçersiniz: **Tüm boyu boyunca yanal olarak ve burulmaya karşı tutulu** ($I_y$) ya da daha düşük olan **Yanal yönde serbest**. Burulma her iki durumda da hesaba katılmaz.

::: tip Hızlı kontrol değerleri
$b \times h$ dikdörtgen için: $A = bh$, $I_y = bh^3/12$. $d$ çaplı dolu daire için: $A = \pi d^2/4$, $I_y = \pi d^4/64$.
:::

Malzemeler ve kesitler istenen sayıda eleman tarafından ortak kullanılabilir. Bir değeri değiştirmek, onu kullanan tüm elemanları günceller ve modeli yeniden çözer.
