---
description: "EduBeam arayüzünde bir tur: ana menü, görüntüleyici ve görünüm seçenekleri, gezinme ve seçme, sekmeler, alt panel ve kayan pencereler."
---

# Kullanıcı arayüzü

<Edubeam /> üç bölümden oluşur: üstte **üst araç çubuğu**, ortada çizim yaptığınız **görüntüleyici** ve altta her nesne türü için bir tablo bulunan **alt panel**. Neyin nerede olduğunu öğrendiğinizde kılavuzun geri kalanı da kolayca anlaşılır.

![Arayüzün bölümleri, aşağıdaki listeyle aynı numaralarla](/screenshots/tr/ui-overview.webp)

1. **☰ menüsü**: açma, kaydetme, paylaşma ve dışa aktarma; örnekler ve rehberli turlar.
2. **Üst araç çubuğu düğmeleri**: Modeli temizle ve Modeli paylaş.
3. Modeldeki her değişiklik için **Geri al / Yinele**.
4. **Görüntüleyici düğmeleri**: ortalama, ekrana sığdırma ve görünüm seçeneklerini açıp kapatan düğme.
5. **Görünüm seçenekleri**: hangi sonuçların ve model parçalarının çizileceği.
6. **Izgara, yakalama, artı imleci ve birimler.**
7. **Alt panel sekmeleri**: Düğümler, Elemanlar, Yükler, Malzemeler, Kesitler, Sonuçlar.
8. Açık sekmenin **tablosu**; buradaki her değeri düzenleyebilirsiniz.

::: tip Turu başlatın
**☰ → Beni gezdir**, bu bölümleri uygulamanın içinde tek tek gösterir.
:::

![Beni gezdir turu, görünüm seçenekleri adımında](/screenshots/tr/tour.webp)

## Üst araç çubuğu {#app-bar}

| Kontrol | Ne yapar |
| --- | --- |
| **☰ menüsü** | Ana menü, aşağıya bakın. |
| **Modeli temizle** | Onay aldıktan sonra tüm düğümleri, elemanları ve yükleri siler. İki onay kutusuyla malzemeleri ve kesitleri de silebilirsiniz. <kbd>Ctrl</kbd>+<kbd>Z</kbd> modeli geri getirir; model ayrıca Son modeller listesinde saklanır. |
| **Modeli paylaş** | Tüm modeli içeren bir bağlantıyla [paylaşım penceresini](/tr/essentials/import-export#share-a-link) açar. |
| **Yenilikler** | Sürüm notları. Bir güncellemeden sonra bir kez kendiliğinden de açılır. |
| **Dokümantasyon** / GitHub | Bu kılavuz ve kaynak kod. |

Telefonda yalnızca ☰ menüsü ve Dokümantasyon sığar; diğer her şey menüdedir.

### ☰ menüsü {#the-☰-menu}

![☰ menüsü](/screenshots/tr/ui-app-menu.webp){.shot-xs}

| Öğe | Ne yapar |
| --- | --- |
| **Proje aç** / **Projeyi kaydet** | Bir `project.json` dosyasını açar veya indirir (<kbd>Ctrl</kbd>+<kbd>O</kbd> / <kbd>Ctrl</kbd>+<kbd>S</kbd>). |
| **Son modeller** | Temizlediğiniz veya yerine başkasını açtığınız son 10 model; geri yüklemeye hazır. |
| **Görüntüyü dışa aktar** | Çizimi PNG veya SVG olarak kaydeder ya da panoya kopyalar (<kbd>Ctrl</kbd>+<kbd>P</kbd>). |
| **Modeli paylaş** | Üst araç çubuğundaki düğmeyle aynı. |
| **Örnekler** | Hazır modellerin galerisi. |
| **İlk kirişinizi çizin** | Yedi adımlık rehberli bir görev. |
| **Beni gezdir** | Arayüz turu. |
| **Modeli temizle** | Üst araç çubuğundaki düğmeyle aynı. |

Menünün en altında uygulamanın sürümü ve yayımlanma tarihi yer alır.

## Görüntüleyici {#viewer}

Tuval, modeli çizdiğiniz ve incelediğiniz yerdir. Uygulamanın geri kalanı burada seçtiğiniz nesneye göre davranır.

### Tuvaldeki düğmeler {#buttons-on-the-canvas}

- **Sol üst:** **Geri al** ve **Yinele** (<kbd>Ctrl</kbd>+<kbd>Z</kbd> / <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Z</kbd>). Ekleme, düzenleme, sürükleme, silme ve modeli temizleme dahil her model değişikliği geri alınabilir.
- **Sağ üst:** **Modeli ortala** (<kbd>C</kbd>), **Modeli ekrana sığdır** (<kbd>F</kbd>) ve görünüm seçeneklerini gösterip gizleyen ⚙ düğmesi. Dokunmatik ekranlarda ayrıca **Dikdörtgenle seç** düğmesi bulunur.
- **Sağ alt:** **G** ızgarayı, **S** ızgaraya yakalamayı açıp kapatır; artı imleci düğmesi imlecin konumunu cetvellerde gösterir; **birim göstergesi** ise ayarları *Dil ve bölge* sayfasında açar.

### Görünüm seçenekleri {#display-options}

![Görüntüleyici düğmeleri ve görünüm seçenekleri](/screenshots/tr/ui-display-settings.webp){.shot-lg}

Varsayılan olarak açık olan iki sıra onay kutusu:

- **Sonuçlar:** *Deforme şekil*, *N (x)*, *V<sub>z</sub> (x)*, *M<sub>y</sub> (x)*, *Mesnet tepkileri*. Başlangıçta Deforme şekil, M ve Mesnet tepkileri işaretlidir.
- **Model:** *Mesnetler*, *Yükler*, *Düğüm etiketleri*, *Eleman etiketleri*.

**Diğer ayarlar**, [ayarların](/tr/essentials/units-settings) tamamını *Görüntüleyici ayarları* sayfasında açar.

### Gezinme {#navigating}

| İşlem | Fare | Dokunmatik |
| --- | --- | --- |
| Yakınlaştırma | Fare tekerleği (imlecin olduğu yere doğru), <kbd>Ctrl</kbd>+<kbd>=</kbd> / <kbd>Ctrl</kbd>+<kbd>-</kbd> | İki parmakla kıstırma |
| Kaydırma | **Orta veya sağ** tuşla sürükleme (bkz. *Ayarlar → Kontroller ve kısayollar*) | Tek parmakla sürükleme |
| Sığdırma / ortalama | <kbd>F</kbd> / <kbd>C</kbd> veya sağ üstteki düğmeler | Sağ üstteki düğmeler |

### Seçme ve düzenleme {#selecting-and-editing}

Bir düğümü, elemanı, yükü veya ölçü çizgisini seçmek için üzerine **tıklayın**. Yanında, ayrıntılarını ve ona uygun işlemleri içeren bir panel açılır: yük ekleme, mesnet tanımlama, düzenleme, rijitlik matrisini gösterme, silme. Bir düğüme tıkladığınızda alt panel de Düğümler sekmesine geçer.

<div class="shots">

![Düğüm: yük ekleme, mesnet tanımlama, yer değiştirme tanımlama](/screenshots/tr/ui-node-menu.webp)

![Eleman: düzenleme, yük ekleme, rijitlik matrisi](/screenshots/tr/ui-element-menu.webp)

</div>

- **Tuvalin boş bir yerinde sürükleyerek** seçim dikdörtgeni çizin. İçinde kalan her şey seçilir: düğümler, elemanlar, bunların yükleri ve ölçü çizgileri. Hepsini silmek için <kbd>Delete</kbd> tuşuna basın, başka bir yere kopyalamak için <kbd>Ctrl</kbd>+<kbd>C</kbd> / <kbd>Ctrl</kbd>+<kbd>V</kbd> kullanın.
- Bir düğümü taşımak için **düğümü sürükleyin**. Yakalama açıksa düğüm ızgaraya oturur. Bağlı elemanlar ve yükleri de onunla birlikte hareket eder.
- Bir yükü düzenlemek için **yüke çift tıklayın**.
- Bilgi kutusu görmek için imleci herhangi bir nesnenin **üzerine getirin**. Düğümler yer değiştirmelerini ve dönmelerini, elemanlar malzemelerini ve kesitlerini, yükler değerlerini gösterir. Dokunmatik ekranda bunun yerine dokunun: aynı bilgiler seçim panelinde görünür.

![İmleci bir düğümün üzerine getirmek, düğümün yer değiştirmelerini ve dönmesini gösterir](/screenshots/tr/ui-hover.webp){.shot-sm}

Tuval menüsü için **tuvale sağ tıklayın** (dokunmatik ekranda basılı tutun). *Düğüm ekle* veya *Eleman ekle* seçeneğini seçerken <kbd>Ctrl</kbd> tuşunu basılı tutarsanız nesneleri pencere yerine fareyle yerleştirirsiniz. Menüyü bir elemanın üzerinde açtığınızda *… elemanını ölçülendir* seçeneği de görünür.

![Tuval menüsü](/screenshots/tr/ui-canvas-menu.webp){.shot-sm}

Tüm kısayollar [Klavye, fare ve dokunmatik](/tr/reference/shortcuts) sayfasındadır.

### Model çözülemediğinde {#when-the-model-cannot-be-solved}

Görüntüleyicinin sol üst köşesinde mesajlar görünür:

- **Yeni ekle** düğmesiyle birlikte *Tanımlı malzeme yok.* / *Tanımlı kesit yok.*
- Model yalnızca henüz tamamlanmamışsa küçük, mavi bir **Mesnet gerekli** etiketi.
- Bir şeyler yanlışsa **kırmızı bir mesaj**; **Ayrıntıları göster** tüm sorunları listeler.

Yapı hâlâ hareket edebiliyorsa EduBeam onu kesikli bir çizgiyle sallar ve soruna yol açan düğümleri veya mafsalları daire içine alır. Hareketi yeniden görmek için imleci mesajın üzerine getirin; gizlemek için mesajdaki göz düğmesini kullanın.

![B ve C'de mafsalları olan bir çerçeve mekanizmadır: EduBeam nasıl hareket ettiğini gösterir](/screenshots/tr/ui-mechanism.webp)

![Ayrıntıları göster, her sorunu bir ipucuyla birlikte listeler](/screenshots/tr/ui-diagnostics.webp){.shot-lg}

Her mesajın anlamı [Sorun giderme](/tr/reference/troubleshooting) sayfasında açıklanır.

## Alt panel {#bottom-bar}

Her biri bir araç çubuğu ve düzenlenebilir bir tablo içeren altı sekme vardır. Sekmeler, modelde her türden kaç nesne olduğunu gösterir. Sağdaki **?** açık olan sekmeyi açıklar; bazı sütun başlıklarının yanındaki **?** de o sütunu açıklar. Paneli yeniden boyutlandırmak için sekme şeridini yukarı veya aşağı sürükleyin ya da sağdaki düğmeyle küçültün.

| Sekme | Araç çubuğu | Tablo |
| --- | --- | --- |
| **Düğümler** | Düğüm ekle (pencere), Düğüm ekle (fare) | Etiket, koordinatlar, **Tutulu serbestlik dereceleri** (mesnet sembolü, Dx, Dz, Ry, mesnet açısı α), yükler, düzenle, sil |
| **Elemanlar** | Eleman ekle (pencere), Eleman ekle (fare) | Etiket, tür, düğümler (sırayı ters çeviren düğmeyle), malzeme, kesit, **Uç mafsalları**, yükler, rijitlik matrisi, sil |
| **Yükler** | Düğüm yükü ekle, Eleman yükü ekle | Tür, hedef, düzenlenebilir bileşenler, düzenle, sil |
| **Malzemeler** | Malzeme ekle, Malzeme kütüphanesi | Etiket, E, G, α<sub>T</sub>, sil |
| **Kesitler** | Kesit ekle, Kesit kütüphanesi, Çokgen kesit | Şekil, etiket, A, I<sub>y</sub>, h, k, şekli düzenle, sil |
| **Sonuçlar** | Düğüm sonuçları, Eleman sonuçları, CSV olarak dışa aktar, Kopyala | Düğüm başına yer değiştirmeler ve dönmeler ya da eleman başına çubuk uç kuvvetleri |

Hücreleri yerinde düzenleyin: tıklayın, değeri yazın ve <kbd>Enter</kbd> tuşuna basın (hücreden çıkmak için <kbd>Esc</kbd>). Değerler [geçerli birimlerde](/tr/essentials/units-settings) gösterilir ve girilir.

## Görüntüleyicinin üstündeki sekmeler {#tabs-above-the-viewer}

**Görüntüleyici** tuvali gösterir. **Ayarlar** ayarları tam ekran açar; böylece renkleri veya birimleri değiştirip etkisini görmek için geri dönebilirsiniz. Birim göstergesi ve *Diğer ayarlar*, aynı ayarları modelin üzerinde bir pencere olarak açar.

## Kayan pencereler {#floating-windows}

**Rijitlik matrisi** (bir elemanın panelinden veya Elemanlar tablosundan) elemanın global koordinatlardaki 6 × 6 rijitlik matrisini bir pencerede açar. Tuval menüsündeki **Düzenle**, geçerli seçimin tablosunu açar. Pencereleri başlık çubuklarından sürükleyerek taşıyın ve × ile kapatın.
