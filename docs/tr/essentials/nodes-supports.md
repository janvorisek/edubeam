# Düğümler ve mesnetler

Düğümler modelin noktalarıdır. Elemanlar düğümleri birbirine bağlar; mesnetler ve düğüm yükleri de düğümlere tanımlanır.

## Koordinatlar {#coordinates}

Her düğümün geçerli uzunluk biriminde bir **X** ve bir **Z** koordinatı vardır. Ekranda x ekseni sağa, **z ekseni aşağı** doğrudur; bu yüzden zeminden yükselen bir kolon `Z = 0`'dan `Z = +3`'e değil, `Z = −3`'e uzanır. Izgaranın köşesindeki eksen göstergesi yönelimi gösterir. Düşey eksenin yukarı doğru olmasını tercih ediyorsanız Ayarlar'dan [y yukarı eksenlere](/tr/elements/conventions#y-up-axes) geçin.

## Düğüm ekleme {#adding-nodes}

| Yöntem | Nasıl |
| --- | --- |
| **Pencere** | *Düğümler* sekmesi → birinci **Düğüm ekle** düğmesi ya da tuvale sağ tıklayıp → *Düğüm ekle*. X ve Z'yi, isterseniz mesnetleri ve mesnet açısını da girin. |
| **Fare** | *Düğümler* sekmesi → ikinci **Düğüm ekle** düğmesi (imleç simgeli) ya da tuval menüsünde *Düğüm ekle*'yi seçerken <kbd>Ctrl</kbd> tuşunu basılı tutun. Tuvale her tıklama bir düğüm ekler. Bitirmek için <kbd>Esc</kbd> tuşuna veya **İptal** düğmesine basın. |
| **Eleman çizerken** | Elemanları fareyle çizerken tuvalin boş bir yerine tıklamak yeni bir düğüm oluşturur ve elemanı ona bağlar. |
| **Kopyala ve yapıştır** | Düğümleri (ve elemanları) seçin, <kbd>Ctrl</kbd>+<kbd>C</kbd> ve <kbd>Ctrl</kbd>+<kbd>V</kbd> tuşlarına basın; ardından kopyanın gideceği yere tıklayın ya da Δx, Δz ötelemesini yazıp **Yapıştır**'a basın. |

<div class="shots">

![Düğüm ekle penceresi](/screenshots/tr/qs-node.webp)

![Fare modunda üstteki şerit, yerleştirdiğiniz her düğümün mesnetlerini ve açısını belirler](/screenshots/tr/nodes-add-banner.webp)

</div>

Etiketler otomatik atanır (`1`, `2`, … ya da kendi düzeninizin devamı, örneğin `A`, `B`) ve tabloda yeniden adlandırılabilir.

### Yaslama {#snapping}

**Izgaraya yasla** açıkken (<kbd>S</kbd> veya **S** düğmesi), yerleştirdiğiniz ya da sürüklediğiniz düğümler **Izgara adımı**'nın katlarına oturur: varsayılan olarak 0,1 m, ABD birimlerinde 0,5 ft. Bunu *Ayarlar → Görüntüleyici ayarları → Izgara* bölümünden değiştirebilirsiniz. Düğümleri serbestçe yerleştirmek için yaslamayı kapatın ya da kesin koordinatları sonradan tabloya yazın.

### Mevcut bir elemanın üzerine düğüm yerleştirme {#placing-a-node-on-an-existing-element}

Düğüm eklerken bir elemanın yakınına tıklarsanız EduBeam ne yapmak istediğinizi sorar:

- **Yapıya bağla**, elemanı ikiye böler (`1a` ve `1b`). Dış uçlardaki mafsallar korunur; düzgün yayılı ve trapez yayılı yükler iki parçaya paylaştırılır, tekil yükler ve sıcaklık yüklemeleri ise birinci parçaya geçer. Ara mesnet veya yük noktası eklemenin en hızlı yolu budur.
- **Bağımsız düğüm yerleştir**, düğümü elemanın üzerinde oluşturur ama elemana bağlamaz.

## Düğümleri düzenleme {#editing-nodes}

- **Tablo:** etiketi, X ve Z'yi yerinde düzenleyin.
- **Sürükleme:** bir düğümü görüntüleyicide taşıyın; dokunmatik ekranda da düğüme basıp sürükleyebilirsiniz. Her taşıma geri alınabilir.
- **Düğümü düzenle penceresi:** tablodaki *İşlemler* sütununda bulunan kalem simgesi. Koordinatları, mesnetleri ve mesnet açısını, mesnet sembolünün önizlemesiyle birlikte içerir.
- **Silme:** tablodaki ×, düğüm panelindeki *Sil* ya da düğümü seçip <kbd>Delete</kbd>. Bir düğümü silmek, ona bağlı elemanları ve yükleri de siler.

## Mesnetler {#supports}

Mesnet, tutulu serbestlik derecelerinin bir kümesidir. Her düğümün üç serbestlik derecesi vardır:

| Serbestlik derecesi | Anlamı |
| --- | --- |
| **Dx** | x doğrultusunda öteleme (yatay) |
| **Dz** | z doğrultusunda öteleme (düşey) |
| **Ry** | y ekseni etrafında dönme (çizim düzleminde) |

En hızlı yol **sembolü seçmektir**. Sembolleri düğüm panelinde **Düğüm mesnetleri** altında, Düğüm ekle ve Düğümü düzenle pencerelerinde ve Düğümler tablosunun *Tutulu serbestlik dereceleri* sütununun başındaki küçük menüde bulabilirsiniz. `Dx`, `Dz`, `Ry` kutularını işaretlemek de aynı işi serbestlik derecelerini tek tek tanımlayarak yapar.

![Düğüm mesnetleri: bir sembol seçin veya serbestlik derecelerini işaretleyin ve mesnet açısını girin](/screenshots/tr/nodes-support-picker.webp){.shot-lg}

| Mesnet | Tutulu | Serbest hareket | Mesnet tepkileri |
| --- | --- | --- | --- |
| **Serbest** | yok | her şey | yok |
| **Mafsal** | Dx + Dz | dönme | R<sub>x</sub>, R<sub>z</sub> |
| **Kayıcı mesnet** | Dz | yatay kayma, dönme | R<sub>z</sub> |
| **Düşey kayıcı mesnet** | Dx | düşey kayma, dönme | R<sub>x</sub> |
| **Ankastre** | Dx + Dz + Ry | yok | R<sub>x</sub>, R<sub>z</sub>, M |
| **Kayar ankastre** | Dz + Ry | yatay kayma | R<sub>z</sub>, M |
| **Düşey kayar ankastre** | Dx + Ry | düşey kayma | R<sub>x</sub>, M |
| **Yalnız dönme tutulu** | Ry | iki yönde kayma | M |

Tutulu her serbestlik derecesi için bir mesnet tepkisi hesaplanır ve çizilir.

::: tip Kafes sistem düğümleri
Kafes çubukları, iki **uç mafsalı** da serbest bırakılmış kiriş elemanlarıdır (bkz. [Elemanlar](/tr/essentials/elements#end-hinges)). Kafes sistemin mesnetlerinde genellikle sabit mesnet (Dx + Dz) kullanılır. Bağlı tüm elemanların mafsallı olduğu bir düğümün dönme rijitliği yoktur; EduBeam böyle bir düğümü kabul eder ve dönmesini 0 olarak verir.
:::

### Eğik mesnetler {#inclined-skewed-supports}

**Düğüm yerel eksen açısı** α'yı derece cinsinden girin (−180…180). Bu alan düğüm panelinde *Düğüm mesnetleri* altında, Düğüm ekle ve Düğümü düzenle pencerelerinde ve Düğümler tablosunun α alanında bulunur. Düğümün eksenleri bu açı kadar döner ve mesnet serbestlik dereceleri dönmüş doğrultularda etkir; yani 30° eğimli bir yüzeydeki kayıcı mesnet, α = 30 ile `Dz`'dir. Sembol de buna göre döner ve mesnet tepkisi dönmüş doğrultuda verilir.

### Stabilite {#stability}

Çözücü toplamda en az **üç tutulu serbestlik derecesine** ihtiyaç duyar; ayrıca mesnetler ve mafsallar yapıyı tutabilmelidir. Yeterli mesnet olana kadar görüntüleyici mavi bir *Mesnet gerekli* etiketi gösterir. Mesnet sayısı yeterli olduğu hâlde mesnetler yapıyı tutamıyorsa (hepsi paralelse veya doğrultuları tek bir noktada kesişiyorsa) ya da mafsallar çubukların birbirine göre dönmesine izin veriyorsa kırmızı bir mesaj sorunu belirtir ve kesikli bir çizgi yapının nasıl hareket ettiğini gösterir. Bkz. [Sorun giderme](/tr/reference/troubleshooting).

## Düğüm yükleri ve mesnet çökmeleri {#nodal-loads-and-settlements}

Kuvvetler, momentler ve öngörülen yer değiştirmeler (mesnet çökmeleri) düğümlere uygulanır. Bkz. [Yükler](/tr/essentials/loads#nodal-loads).

## Ölçü çizgileri {#dimension-lines}

İki nokta arasına ölçü çizgisi çizmek için tuvale sağ tıklayıp → **Ölçü ekle**'yi, bir elemanı doğrudan ölçülendirmek için elemana sağ tıklayıp → **… elemanını ölçülendir**'i seçin. Uç noktalar düğümlere yakın sürüklendiğinde düğümlere yaslanır. Bir ölçü çizgisini seçip **Düzenle** ile koordinatlarını yazabilir ya da **Ölçü çizgisini ters çevir** ile etiketini diğer tarafa alabilirsiniz. Ölçü çizgileri yalnızca görsel amaçlıdır; projeyle birlikte kaydedilir ve paylaşım bağlantılarında da taşınır.
