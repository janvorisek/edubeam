---
description: "EduBeam derste ve ödevlerde: ders notlarında paylaşım bağlantıları, gömülebilir görüntüleyici, öğrencilerin kendi kontrol ettiği ödevler ve laboratuvar bilgisayarları."
---

# EduBeam ile öğretim

<Edubeam /> bir derslikte doğdu ve hâlâ en iyi orada işe yarıyor: projeksiyondaki model her değişikliğe anında tepki verir, bir bağlantı sayesinde aynı model her öğrencinin dizüstü bilgisayarında da açılır. Bu sayfada öğretim elemanlarının en sık kullandığı özellikleri bulabilirsiniz.

## Derste {#in-the-lecture}

- **Arka sıralardan da okunabilir olsun.** *Ayarlar → Görüntüleyici ayarları* bölümünde **Yazı boyutu**'nu 18–20 px'e, **Mesnet boyutu**'nu %130–150'ye çıkarın. Diyagramlar büyük ekranda sönük kalıyorsa **Sonuç ölçeği**'ni artırın.
- **Her seferinde tek bir şey gösterin.** Görünüm seçeneklerinde o an anlattığınız büyüklük dışındaki her şeyin işaretini kaldırın, diğerlerini sonra tek tek ekleyin.
- **Modeli canlı değiştirin.** Bir mesneti sürükleyin, `Ry` kutusunu işaretleyin, bir mafsal ekleyin. Öğrenciler neden ile sonucu aynı anda görür; <kbd>Ctrl</kbd>+<kbd>Z</kbd> ile istediğiniz an geri dönersiniz.
- **Mekanizmaları çözücü anlatsın.** Bir mafsalı fazladan serbest bırakın: EduBeam mekanizmanın kesikli çizgili şeklini hareket ettirir ve soruna yol açan mafsalları daire içine alır. Kararlılığı tartışmak için iyi bir fırsat.
- **Öğrencilerin dilini ve eksenlerini kullanın.** Ders notlarınıza uyacak şekilde arayüz dilini, SI veya ABD birimlerini ve z aşağı ya da y yukarı eksen düzenini seçin.

![Görünür hâle gelen bir mekanizma: B ve C'deki mafsallar çerçevenin yanal ötelenmesine izin veriyor](/screenshots/tr/ui-mechanism.webp)

## Ders notlarında ve ödevlerde {#in-lecture-notes-and-assignments}

Paylaşım bağlantısı modelin tamamını içerir; bu yüzden bağlantı koyabildiğiniz her yerde çalışır: PDF, sunum slaytı, LMS sayfası, e‑posta.

1. Modeli oluşturun ve **Modeli paylaş → Kopyala**'ya basın.
2. Bağlantıyı notlarınıza yapıştırın. Eski EduBeam sürümlerinden kalan bağlantılar çalışmaya devam eder; notlarınız yıllar sonra da geçerli kalır.
3. Bağlantıyı açan her öğrenci, üzerinde deneme yapabileceği kendi kopyasını alır. Yaptığı değişiklikler size veya diğer öğrencilere ulaşmaz.

Kullanışlı bağlantı türleri:

| Bağlantı | Açılan |
| --- | --- |
| `https://run.edubeam.app/?model=…` | Düzenlemeye hazır model |
| `https://run.edubeam.app/?viewer=1&model=…` | `<iframe>` içine gömmek için [görüntüleyici modunda](/tr/essentials/import-export#embed-a-read-only-viewer) model |
| `https://run.edubeam.app/?panel=examples` | Örnek galerisi |
| `https://run.edubeam.app/?lang=tr` | Türkçe arayüzlü uygulama (veya herhangi bir [başka dil kodu](/tr/essentials/import-export#url-parameters)) |

::: warning Bağlantıyı açmak öğrencinin kendi modelinin yerine geçer
Önceki model **☰ → Son modeller** listesine taşınır ve oradan geri yüklenebilir; uygulama bunu bir mesajla da bildirir. Yine de öğrencilere, dersten gelen bağlantıları açmadan önce önemli çalışmalarını **Projeyi kaydet** ile kaydetmelerini söyleyin.
:::

## Öğrencilerin kendi kontrol edebileceği ödevler {#assignments-students-can-check-themselves}

EduBeam, yöntemi ele vermeden öğrencilere el hesapları için anında geri bildirim sağlar:

- Mesnet tepkilerini, iç kuvvetleri ve bir yer değiştirmeyi elle hesaplatın, ardından öğrencilerin modeli kurup sonuçları karşılaştırmasını isteyin. Hazır formüller [Sonuçların elle kontrolü](/tr/guide/verification) sayfasında.
- Bir sonucun *neden* farklı çıktığını sorun: kayma deformasyonu, eksik bir mafsal, global yerine yerel eksenlerde tanımlanmış bir yük.
- Öğrencilerden hesaplarının yanında bir paylaşım bağlantısı veya bir `project.json` dosyası teslim etmelerini isteyin. Açtığınızda tam olarak neyi modellediklerini görürsünüz.
- Raporlar için öğrenciler çizimi **SVG** (Word'de ve LaTeX'te keskin görünür), sonuçları ise **CSV** olarak dışa aktarabilir.

## Hazır alıştırmalar {#ready-made-exercises}

- [Örnekler](/tr/examples/) sayfasında, her biri alıştırma önerileriyle birlikte altı model bulunur.
- [Üç mafsallı çerçeve](/tr/tutorials/three-hinged-frame) ve [düzlem kafes sistem](/tr/tutorials/truss) eğitimleri, el hesabıyla kontrol edilmiş eksiksiz çözümlü örneklerdir.
- [Hızlı başlangıç](/tr/guide/quick-start) ilk uygulama dersi için föy olarak kullanılabilir: yaklaşık on dakika sürer.

## Öğrencileri başlatmak {#getting-students-started}

Yeni kullanıcıları iki rehberli seçenek sunan bir karşılama penceresi karşılar: **Beni gezdir** (arayüz turu) ve **İlk kirişinizi çizin** (fareyle yapılan yedi adımlık bir görev). İkisi de ☰ menüsünde de bulunur. Pek çok öğretim elemanı ilk uygulama dersinin başında yalnızca "run.edubeam.app'i açın ve *İlk kirişinizi çizin*'i seçin" der.

## Çevrimdışı kullanım ve laboratuvar bilgisayarları {#offline-and-lab-computers}

EduBeam aşamalı bir web uygulamasıdır (PWA). Bir bilgisayar uygulamayı bir kez yükledikten sonra uygulama bağlantı olmadan da çalışır ve tarayıcı onu yüklemeyi önerebilir. Modeller ve ayarlar her tarayıcı profili için ayrı saklanır; bu nedenle ortak kullanılan laboratuvar bilgisayarlarında öğrenciler çalışmalarını dosya veya bağlantı olarak kaydetmelidir.
