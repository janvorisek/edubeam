---
description: "Proje dosyalarını kaydedin ve açın, modeli bağlantıyla paylaşın, görüntü ve sonuçları dışa aktarın, görüntüleyici gömün, URL parametreleri kullanın. Her şey tarayıcınızda kalır."
---

# İçe aktarma, dışa aktarma ve paylaşım

EduBeam'de her şey tarayıcınızda gerçekleşir. Hiçbir şey bir sunucuya yüklenmez: paylaşım bağlantısı modelin kendisini içerir.

## Projeyi kaydetme {#save-a-project}

**☰ → Projeyi kaydet** veya <kbd>Ctrl</kbd>+<kbd>S</kbd>, `project.json` dosyasını indirir. Dosya düğümleri, elemanları, malzemeleri, kesitleri (çokgen şekilleriyle birlikte), yükleri, ölçü çizgilerini ve dosyayı yazan uygulama sürümünü içerir. Dosyanın adını istediğiniz gibi değiştirebilirsiniz.

## Proje açma {#open-a-project}

- **☰ → Proje aç** veya <kbd>Ctrl</kbd>+<kbd>O</kbd> ile bir `.json` dosyası seçin ya da
- **dosyayı uygulama penceresinin herhangi bir yerine sürükleyin**.

Açılan proje, malzemeler ve kesitler dahil mevcut modelin yerini alır. Önceki modeliniz kaybolmaz: <kbd>Ctrl</kbd>+<kbd>Z</kbd> onu geri getirir ve model [Son modeller](#recent-structures) listesinde de saklanır. EduBeam projesi olmayan bir dosya bir mesajla reddedilir ve modeliniz olduğu gibi kalır.

EduBeam'in önceki tüm sürümlerinde kaydedilen proje dosyaları güncel sürümde de açılır.

## Bağlantıyla paylaşma {#share-a-link}

**Modeli paylaş** (üst çubukta veya ☰ menüsünde) *Modeli bağlantıyla paylaş* penceresini açar:

![Paylaşım penceresi](/screenshots/tr/share.webp){.shot-lg}

- **Kopyala**, bağlantıyı panoya kopyalar. Alanın içine tıklamak da aynı işi yapar.
- **Bağlantıyı aç**, bağlantıyı yeni bir sekmede açar; böylece alıcının ne göreceğini kontrol edebilirsiniz.
- **Sistem penceresiyle paylaş**, tarayıcı destekliyorsa bağlantıyı cihazınızın paylaşım menüsüne iletir.
- **Daha kısa bağlantı**, aynı modeli yaklaşık yarı uzunlukta yazar. Ekim 2026'dan beri güncellenmemiş bir <Edubeam /> kopyası bu bağlantıyı ancak güncellendikten sonra okuyabilir; bu yüzden bağlantının her yerde hemen açılması gerekiyorsa bu seçeneği kapalı bırakın.

Bağlantı `https://run.edubeam.app/?model=…` biçimindedir ve modelin tamamını kodlanmış olarak içerir. Bağlantıyı açan herkes düzenleyebileceği kendi kopyasını alır; yapılan düzenlemeler size geri **senkronize edilmez**, bu yüzden model değiştiğinde yeni bir bağlantı gönderin. Çok büyük modeller çok uzun bağlantılar oluşturur; bu durumda JSON dosyasını paylaşın.

Biri bir bağlantıyı açtığında kendi önceki modeli Son modeller listesine taşınır ve bir mesaj, onu nerede bulacağını söyler.

Eski sürümlerden kalan bağlantılar çalışmaya devam eder: geçen yılın ders notlarındaki bir bağlantı bugün de aynı modeli açar.

## Görüntüyü dışa aktarma {#export-an-image}

**☰ → Görüntüyü dışa aktar** veya <kbd>Ctrl</kbd>+<kbd>P</kbd>, görüntü dışa aktarma penceresini açar.

![Görüntüyü dışa aktar: katmanları, kadrajı ve boyutu seçin, ardından indirin veya kopyalayın](/screenshots/tr/export-image.webp)

- **Katmanlar**: üstteki etiketler, görüntüleyiciden bağımsız olarak neyin çizileceğini seçer: deforme şekil, N, V, M, mesnet tepkileri, mesnetler, yükler, düğüm ve eleman etiketleri.
- **Kadraj**: bir en-boy oranı (16:9, 4:3, 3:2, 1:1), **Tümünü sığdır** veya çizim üzerinde bir dikdörtgen sürüklemek için **Pencere…** seçin. Önizlemenin kenarlarını da sürükleyebilirsiniz.
- **Boyut**: piksel cinsinden genişlik ve yükseklik ya da kâğıt üzerinde ölçekli bir çizim için 1 : 50 gibi bir **Ölçek**. **Diyagram yüksekliği**, görüntüdeki sonuç diyagramlarının boyutunu belirler. **Saydam arka plan**, beyaz zemini çıkarır.
- **PNG indir**, **SVG indir** veya **Panoya kopyala**.

SVG her boyutta keskin kalır ve Word'de, Inkscape'te ve Overleaf üzerindeki LaTeX'te çalışır; bu yüzden raporlar ve tezler için en iyi seçimdir.

## Sonuçları dışa aktarma {#export-the-results}

**Sonuçlar → CSV olarak dışa aktar**, mesnet tepkileri dahil iki sonuç tablosunu da indirir; **Kopyala** ise bunları elektronik tabloda kullanmak üzere panoya koyar. Bkz. [CSV olarak dışa aktarma ve kopyalama](/tr/essentials/results#export-csv-and-copy).

## Son modeller {#recent-structures}

**☰ → Son modeller**, temizlenen ya da bir bağlantı, dosya, örnek veya “İlk kiriş” göreviyle değiştirilen son 10 modeli saklar. Her birinde bir küçük resim, neden değiştirildiği ve boyutu görünür. **Geri yükle** bir modeli geri getirir; o sırada açık olan model de bu kez listeye girer ve <kbd>Ctrl</kbd>+<kbd>Z</kbd> geri yüklemeyi geri alır.

![Son modeller](/screenshots/tr/recent.webp){.shot-lg}

Liste yalnızca bu tarayıcıda saklanır.

## Örnekler {#examples}

**☰ → Örnekler**, hazır ders modellerinden oluşan bir galeri açar. Bir örneği açmak modelinizin yerini alır; <kbd>Ctrl</kbd>+<kbd>Z</kbd> kendi modelinizi geri getirir. Aynı modelleri alıştırmalarıyla birlikte bu kılavuzun [Örnekler](/tr/examples/) sayfasında bulabilirsiniz.

![Örnek galerisi](/screenshots/tr/examples.webp){.shot-lg}

## Görüntüleyici gömme {#embed-a-read-only-viewer}

Modeli **görüntüleyici modunda** açmak için paylaşım bağlantısına `&viewer=1` ekleyin. Üst çubuk, alt çubuk, sekmeler, geri al ve yinele, ızgara düğmeleri ve eksen göstergesi gizlenir; geriye tuval, sığdırma ve ortalama düğmeleri ve görünüm seçenekleri kalır. Ders notlarına veya bir web sayfasına canlı, yakınlaştırılabilir bir model gömmek için bu URL'yi bir `<iframe>` içine koyun:

```html
<iframe src="https://run.edubeam.app/?viewer=1&model=…" width="100%" height="400"></iframe>
```

![Görüntüleyici modunda üç mafsallı çerçeve](/screenshots/tr/viewer-mode.webp){.shot-lg}

Görüntüleyici modu incelemek içindir, ancak kilitli değildir: ziyaretçiler yine de düğümleri sürükleyebilir ve diyagramlar arasında geçiş yapabilir. Görüntüleyici bağlantısını açmak da, normal bir bağlantı gibi, ziyaretçinin o tarayıcıdaki kendi modelinin yerini alır (önceki model Son modeller listesine taşınır).

## URL parametreleri {#url-parameters}

| Parametre | Etkisi |
| --- | --- |
| `model=<data>` | Kodlanmış modeli yükler ve ekrana sığdırır. |
| `viewer=1` | Görüntüleyici modu (yukarıya bakın). |
| `lang=<kod>` | Arayüz dilini değiştirir: `en`, `cs`, `de`, `fr`, `es`, `pt`, `pl`, `cn`, `th`, `uk`, `ru`, `tr`. |
| `panel=examples` | Örnek galerisini hemen açar. |

EduBeam parametreleri okuduktan sonra onları adres çubuğundan kaldırır.

## Otomatik kaydetme {#automatic-persistence}

Mevcut model ve ayarlarınız her değişiklikten sonra tarayıcının yerel depolamasına kaydedilir ve tarayıcıyı kapatmış olsanız bile geri döndüğünüzde geri yüklenir. Bu bir kolaylıktır, yedek değildir: tek bir cihazdaki tek bir tarayıcı profiline aittir ve site verilerini temizlemek onu siler. Önemli çalışmalarınızı proje dosyası olarak kaydedin.

## Proje dosyası biçimi {#project-file-format}

`project.json` sade, okunabilir bir JSON dosyasıdır:

```json
{
  "edubeam": true,
  "version": "1.3.1",
  "domain": {
    "materials": [{ "label": "1", "e": 210000000000, "g": 81000000000, "alpha": 0.000012, "d": 7850 }],
    "crossSections": [{ "label": "1", "a": 0.00285, "iy": 1.943e-5, "h": 0.2, "k": 1 }],
    "nodes": [
      { "label": "1", "coords": [0, 0, 0], "bcs": [0, 2] },
      { "label": "2", "coords": [6, 0, 0], "bcs": [2] }
    ],
    "elements": [{ "label": "1", "nodes": ["1", "2"], "mat": "1", "cs": "1", "hinges": [false, false] }],
    "loadCases": [
      {
        "label": "1",
        "nodalLoads": [],
        "elementLoads": [{ "type": "udl", "target": "1", "lcs": false, "values": [0, 12000] }],
        "prescribedBC": []
      }
    ]
  },
  "dimensions": []
}
```

Bu, Hızlı başlangıçtaki kiriştir. Görüntülenen birimler ne olursa olsun tüm değerler **SI birimlerindedir** (m, N, Pa, rad). Koordinatlar `[x, y, z]` biçimindedir ve y her zaman 0'dır. Sınır koşulları ve yük bileşenleri `0 = Dx`, `2 = Dz`, `4 = Ry` serbestlik derecesi numaralarını kullanır.

| Eleman yükü `type` | Değerler |
| --- | --- |
| `udl` | `values: [fx, fz]`, N/m cinsinden |
| `trapezoidal` | `startValues: [f1x, f1z]`, `endValues: [f2x, f2z]`, N/m cinsinden, yerel eksenlerde |
| `concentrated` | `values: [Fx, Fz, My, a]`, N, N·m ve başlangıç düğümünden m cinsinden |
| `temperature` | `values: [ΔTc, ΔTb, ΔTt]`, K cinsinden; gradyan ΔTb − ΔTt'dir |

Düğüm yükleri `{ "target": "2", "values": { "0": Fx, "2": Fz, "4": My } }`, öngörülen yer değiştirmeler ise `{ "target": "2", "prescribedValues": { "0": Dx, "2": Dz, "4": Ry } }` biçimindedir; üç bileşenin hepsini verin. Uygulamanın yazdığı dosyalar ayrıca bir `date`, bir `commit`, düğümlerde `lcs` ve çokgen kesitlerde `shape` alanları içerir.

Biçim basit olduğu için modelleri bir betikle veya elektronik tabloyla üretip **Proje aç** ile açabilirsiniz.
