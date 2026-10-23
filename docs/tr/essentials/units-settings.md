---
description: "Dili, SI veya ABD birimlerini, sayı biçimini, y yukarı ya da z aşağı eksenleri, görüntüleyici ve kontrol ayarlarını seçin; EduBeam'in tarayıcınızda neler sakladığını görün."
---

# Birimler ve ayarlar

Ayarlara üç yoldan ulaşabilirsiniz:

- görüntüleyicinin üstündeki **Ayarlar** sekmesi, ayarları tam ekran gösterir;
- görüntüleyicinin sağ altındaki **birim göstergesi**, ayarları *Dil ve bölge* bölümünde açar;
- görünüm seçeneklerinin altındaki **Diğer ayarlar**, ayarları *Görüntüleyici ayarları* bölümünde açar.

Ayarlar tarayıcınızda saklanır ve sayfa yenilendiğinde kaybolmaz. **Ayarları sıfırla**; görüntüleyici varsayılanlarını, sayı biçimini, eksenleri, kaydırma tuşunu ve bölgenize uygun birimleri geri yükler; dil korunur.

## Dil ve bölge {#language-locale}

![Ayarlar → Dil ve bölge](/screenshots/tr/settings-language.webp)

**Dil.** Arayüz 16 dilde kullanılabilir. Uygulamayı `?lang=<kod>` parametresiyle de açabilirsiniz: `en`, `cs`, `de`, `fr`, `es`, `pt`, `pl`, `cn`, `th`, `uk`, `ru`, `tr`, `hi`, `vi`, `it`, `id`.

**Sayı biçimi.** Sonuç değerlerinin nasıl yazılacağı: *Otomatik*, *Bilimsel* (varsayılan) veya *Mühendislik*. Bkz. [Sayı biçimi](/tr/essentials/results#number-format).

**Koordinat sistemi.** *x sağa, z aşağı* (varsayılan) veya *x sağa, y yukarı*. y yukarı seçeneği düşey değerlerin ve mesnet açılarının işaretini çevirir ve eksenleri tüm girdilerde, tablolarda, araç ipuçlarında ve dışa aktarımlarda yeniden adlandırır. Model ve kaydedilen dosyalar değişmez. Bkz. [y yukarı eksenler](/tr/elements/conventions#y-up-axes).

![y yukarı eksenlerle üç mafsallı çerçeve: köşedeki eksen göstergesi y'yi yukarı gösteriyor](/screenshots/tr/settings-y-up.webp){.shot-lg}

**Birim sistemi.** *SI (metrik)* veya *ABD (emperyal)*, aşağıdaki tüm birimleri tek adımda ayarlar. Sonradan herhangi bir birimi tek başına değiştirirseniz sistem *Özel* olarak görünür. İlk ziyarette seçimi karşılama penceresinde yaparsınız; o zamana kadar EduBeam, ABD birimlerini yalnızca tarayıcı ABD bölge ayarındaysa *ve* bilgisayar bir ABD saat dilimindeyse tahmin eder.

**Birimler.** Her büyüklüğün kendi birimi vardır. Girdiler, tablolar, araç ipuçları ve diyagram etiketleri seçilen birimi kullanır; bir birimi değiştirmek gösterilen değerleri dönüştürür. Modelin kendisi SI'da saklanır; bu yüzden birimler arasında gidip gelmekle hiçbir şey kaybolmaz ve paylaşılan bir bağlantı aynı modeli hangi birimlerle olursa olsun açar.

| Büyüklük | Seçenekler | SI | ABD |
| --- | --- | --- | --- |
| Uzunluk (geometri) | m, cm, mm, ft, in | m | ft |
| Kesit boyutları | m, cm, mm, ft, in | m | in |
| Yer değiştirme | m, cm, mm, ft, in | m | in |
| Alan | m², cm², mm², ft², in² | m² | in² |
| Atalet momenti | m⁴, cm⁴, mm⁴, ft⁴, in⁴ | m⁴ | in⁴ |
| Kütle | kg, lb | kg | lb |
| Kuvvet | N, kN, MN, kgf, Tonf, lbf, kip | kN | kip |
| Eğilme momenti | Nmm, Nm, kNm, MNm, Tonf·m, lbf·in, lbf·ft, kip·in, kip·ft | kNm | kip·ft |
| Basınç (E, G) | Pa, kPa, MPa, GPa, ksc, psi, ksi, psf, ksf | MPa | ksi |
| Sıcaklık | °C, °F | °C | °F |

Yayılı yükler seçilen birimlerle *kuvvet / uzunluk* (SI'da kN/m, ABD birimlerinde kip/ft), yoğunluk ise *kütle / uzunluk³* cinsindendir. Isıl genleşme katsayısı sıcaklık birimini izler (1/K veya 1/°F). Sıcaklık yüklemeleri sıcaklık *değişimleridir*; bu yüzden 10 °C, 18 °F'ye karşılık gelir. Dönmeler her zaman radyan cinsindendir.

Tonf, ABD kısa tonu (short ton) değil, metrik ton-kuvvettir (1000 kgf). ABD birimleri tam tanımlarıyla dönüştürülür (1 ft = 0,3048 m, 1 kip = 4448,2216 N). Fit cinsinden `5,5` gibi ondalık değerler yazın; cetveller ve artı imleci fit ve inç cinsinden okur (5′-6″).

## Görüntüleyici ayarları {#viewer-settings}

![Ayarlar → Görüntüleyici ayarları, sağda canlı önizleme](/screenshots/tr/settings-viewer.webp)

Ayarların yanındaki **Görüntüleyici önizlemesi**, her değişikliğe anında tepki veren küçük bir model gösterir. Altındaki etiketler hangi sonucun gösterileceğini seçer; bir renge tıklamak önizlemeyi o sonuca geçirir.

**Izgara**
- **Izgarayı göster** (<kbd>G</kbd>) ızgarayı ve cetvelleri çizer.
- **Izgaraya yasla** (<kbd>S</kbd>) yerleştirdiğiniz veya sürüklediğiniz düğümleri ızgara adımına yaslar.
- **Artı imlecini göster** imlecin konumunu cetveller üzerinde işaretler, böylece koordinatlarını okuyabilirsiniz (yalnızca fareyle).
- **Izgara adımı**, uzunluk birimindeki aralıktır: varsayılan 0,1 m, ABD birimlerinde 0,5 ft. Metrik ve ABD birimleri arasında geçiş yaptığınızda varsayılan değerde kalmış bir adım diğer sistemin varsayılanına geçer; kendi belirlediğiniz adım korunur.

**Boyutlar**
- **Sonuç ölçeği** (8–120 px, varsayılan 48), en büyük diyagram ordinatının veya sehimin ekrandaki yüksekliğidir. Diyagramlar kendi maksimumlarına göre ölçeklenir, bu yüzden ayar tamamen görseldir; çizimler çok büyük veya çok küçükse değiştirin.
- **Mesnet boyutu** (%50–150) ve **Yazı boyutu** (10–20 px). Projeksiyonda daha büyük yazı işe yarar.

**Sonuç etiketlerinin yönü**: *Diyagrama dik* (etiketler diyagramı izler) veya *Her zaman yatay*.

**Model denetimi**
- **Kararsız yapının nasıl hareket edebileceğini göster**, mekanizmanın kesikli çizgili hâlini çizer.
- **Hareketi canlandır**, bu hâli ileri geri sallar.

**Renkler**: düğümler, elemanlar, yükler, deforme şekil, normal kuvvet, kesme kuvveti, eğilme momenti ve mesnet tepkileri için ayrı renkler. Varsayılanlar: N mavi, V yeşil, M kırmızı, mesnet tepkileri mor, yükler turuncu.

## Kontroller ve kısayollar {#controls-shortcuts}

**Kaydırma**, tuvali hangi fare tuşuyla kaydıracağınızı belirler: *Fare tekerleği veya sağ tuş* (varsayılan), *Fare tekerleği* veya *Sağ tuş*. Kısayolların tam listesi [Klavye, fare ve dokunmatik](/tr/reference/shortcuts) sayfasındadır.

## Tarayıcınızda neler saklanır {#what-is-stored-in-your-browser}

EduBeam, ayarların yanı sıra tarayıcının yerel depolamasında şunları tutar:

- **mevcut model**: her değişiklikten sonra kaydedilir, böylece sekmeyi yenilediğinizde veya uygulamayı yeniden açtığınızda geri gelir;
- **Son modeller**: temizlediğiniz veya değiştirdiğiniz son 10 model.

İkisi de tarayıcıya ve cihaza özeldir; site verilerini temizlemek onları siler. Bir modeli saklamak veya başka bir yere taşımak için [Projeyi kaydet veya Modeli paylaş](/tr/essentials/import-export) seçeneklerini kullanın.
