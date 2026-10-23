---
description: "EduBeam hakkında sık sorulan sorular: ücret ve hesap, tarayıcılar ve cihazlar, kaybolan bir modeli geri alma, çevrimdışı kullanım, verilerin saklanması ve modelleme ipuçları."
---

# Sıkça sorulan sorular

## Genel {#general}

### EduBeam nedir? {#what-is-edubeam}

Düzlem kirişler, çerçeveler ve kafes sistemler için tarayıcıda çalışan, ücretsiz ve açık kaynaklı bir çözücü. Anında geri bildirim isteyen öğrenciler, öğretim elemanları ve mühendisler için tasarlandı. [Giriş](/tr/guide/introduction) sayfasına bakın.

### Gerçekten ücretsiz mi? Hesap gerekiyor mu? {#is-it-really-free-do-i-need-an-account}

Evet ve hayır. [run.edubeam.app](https://run.edubeam.app/?lang=tr) adresini açın ve modellemeye başlayın. Hesap, kurulum ya da kullanım sınırı yok. Kaynak kodu [GitHub](https://github.com/janvorisek/edubeam)'da.

### Hangi tarayıcılarda ve cihazlarda çalışır? {#which-browsers-and-devices-work}

Chrome, Edge, Firefox veya Safari'nin güncel tüm sürümlerinde. Tablet ve telefonlarda da çalışır: seçmek veya yerleştirmek için dokunun, bir düğümü taşımak için sürükleyin, başka bir yerde sürükleyerek görünümü kaydırın, yakınlaştırmak için iki parmağınızı açın, tuval menüsü için basılı tutun. Yine de fare ve klavyeyle modellemek daha hızlıdır. [Klavye, fare ve dokunmatik](/tr/reference/shortcuts#touch) sayfasına bakın.

### Modelimi kaybettim. Geri alabilir miyim? {#i-lost-my-model-can-i-get-it-back}

Büyük olasılıkla evet. Modeli temizlediğinizde ya da üzerine bir bağlantı, dosya veya örnek açtığınızda eski model **☰ → Son modeller** listesinde (son 10 model) saklanır; <kbd>Ctrl</kbd>+<kbd>Z</kbd> da bu değişikliği geri alır. İkisi de yalnızca sizin tarayıcınızda tutulur.

### Çevrimdışı kullanabilir miyim? {#can-i-use-it-offline}

EduBeam aşamalı bir web uygulamasıdır (PWA): bir kez yüklendikten sonra bağlantı olmadan da çalışır ve tarayıcı onu yüklemeyi önerebilir. Yeni bir sürüm çıktığında, güncellemeden önce bir pencere size sorar.

### Verilerim nerede saklanıyor? {#where-is-my-data-stored}

Yalnızca tarayıcınızda. Modeller hiçbir zaman bir sunucuya gönderilmez; paylaşım bağlantısı modelin *kendisidir*. [İçe aktarma, dışa aktarma ve paylaşım](/tr/essentials/import-export) sayfasına bakın.

## Modelleme {#modelling}

### Ankastre, mafsallı veya kayıcı mesneti nasıl tanımlarım? {#how-do-i-make-a-fixed-pinned-roller-support}

Düğüme tıklayın, **Düğüm mesnetleri**'ni açın ve sembolü seçin: mafsallı mesnet, kayıcı mesnet, ankastre, kayar ankastre ve diğerleri. Ya da serbestlik derecelerini işaretleyin: **Dx + Dz + Ry** = ankastre, **Dx + Dz** = mafsallı mesnet, **Dz** = kayıcı mesnet. Tüm kombinasyonlar [Düğümler ve mesnetler](/tr/essentials/nodes-supports#supports) sayfasında listelenir.

### Kafes sistemi nasıl oluştururum? {#how-do-i-make-a-truss}

Kiriş elemanlarını kullanın ve *Elemanlar* sekmesinde her çubuk için **iki uç mafsalını da** işaretleyin ya da çubukları fareyle çizmeden önce şeritteki *Başlangıç mafsalı* ve *Bitiş mafsalı* kutularını işaretleyin. Yükleri düğüm noktalarına uygulayın. [Kafes sistem eğitimi](/tr/tutorials/truss) bunu adım adım gösterir.

### Çerçeveye nasıl mafsal koyarım? {#how-do-i-put-a-hinge-in-a-frame}

Momentin serbest bırakılacağı tarafta kalan elemanın o düğümdeki uç mafsalını (**Başlangıç mafsalı** veya **Bitiş mafsalı**) işaretleyin. Bir düğümde *tek* bir elemanı mafsallamak yalnızca o elemanı serbest bırakır.

### Kirişin ortasına nasıl mesnet veya tekil yük eklerim? {#how-do-i-add-a-support-or-a-point-load-in-the-middle-of-a-beam}

*Fareyle ekle* ile kirişin üzerine bir düğüm ekleyin ve **Yapıya bağla**'yı seçin; kiriş ikiye bölünür. Yalnızca tekil yük için düğüme bile gerek yoktur: konumu belirtilmiş bir **Tekil yük** eleman yükü kullanın.

### Zati ağırlık uygulayabilir miyim? {#can-i-apply-self-weight}

Otomatik olarak hayır. Zati ağırlığı $f_z = \rho g A$ değerinde düzgün yayılı yük olarak girin.

### Eğik mesnet modelleyebilir miyim? {#can-i-model-inclined-supports}

Evet; düğümde bir **Düğüm yerel eksen açısı** tanımlayın. Düğümün serbestlik dereceleri bundan sonra döndürülmüş sistemde yorumlanır.

### Yükleme durumları veya kombinasyonları var mı? {#are-there-load-cases-or-combinations}

Hayır, yalnızca bir yükleme durumu vardır. Her durumu ayrı modelleyin ve ayrı kaydedin ya da paylaşın.

### Yüklerim neden yukarıyı gösteriyor? {#why-do-my-loads-point-up}

Çünkü global z ekseni **aşağı** doğrudur: pozitif `Fz` aşağı doğru etkir. [İşaret kabulü](/tr/elements/conventions) sayfasına bakın. Yukarı doğru bir düşey eksen tercih ediyorsanız *Ayarlar → Dil ve bölge → Koordinat sistemi* bölümünden y yukarı eksenlere geçin.

## Sonuçlar {#results}

### Neden "Çöz" düğmesi yok? {#why-is-there-no-solve-button}

Model her değişiklikten sonra otomatik olarak çözülür. Sonuç görünmüyorsa model henüz çözülebilir değildir; neleri kontrol etmeniz gerektiği [Sorun giderme](/tr/reference/troubleshooting) sayfasında listelenir.

### Sehimim neden formülden biraz farklı? {#why-does-my-deflection-differ-slightly-from-the-formula}

EduBeam Timoshenko kirişleri kullanır, bu yüzden sehimler kayma deformasyonunu da içerir. Narin çubuklarda fark %1'in çok altındadır. Ayrıntılar ve çözümlü karşılaştırmalar [Sonuçların elle kontrolü](/tr/guide/verification) sayfasında.

### Sonuçlar ne kadar doğru? Daha fazla eleman gerekir mi? {#how-accurate-are-the-results-do-i-need-more-elements}

Doğrusal statik analizde kiriş elemanı desteklenen yük türleri için kesin sonuç verir; bu yüzden her çubuk için tek eleman yeterlidir. Ek düğümler yalnızca mesnet, mafsal, kesit değişimi veya yük bağlanacak bir düğüm istediğiniz yerlerde gerekir.

### Mesnet tepkileri nerede listeleniyor? {#where-are-the-reactions-listed}

Görüntüleyicide, değerleriyle birlikte oklar olarak (görünüm seçeneklerinde **Mesnet tepkileri**, varsayılan olarak açık). Ayrıca **Sonuçlar → CSV olarak dışa aktar** ile indirilen dosyada ve **Kopyala** ile kopyalanan verilerde de bulunurlar. Düğüm yer değiştirmeleri ve çubuk uç kuvvetleri **Sonuçlar** sekmesindedir.

## Dosyalar ve paylaşım {#files-sharing}

### Bir modeli nasıl paylaşırım? {#how-do-i-share-a-model}

**Modeli paylaş** → **Kopyala**. Bağlantı modelin tamamını içerir. Alıcılar düzenleyebilecekleri kendi kopyalarını alır; canlı ortak çalışma yoktur. Ayrıca [EduBeam ile öğretim](/tr/guide/teaching) sayfasına bakın.

### Bir modeli web siteme veya sunuma gömebilir miyim? {#can-i-embed-a-model-on-my-website-or-in-slides}

Evet: paylaşım bağlantısına `&viewer=1` ekleyin ve bir `<iframe>` içine yerleştirin. [Görüntüleyici gömme](/tr/essentials/import-export#embed-a-read-only-viewer) bölümüne bakın.

### Görüntü veya tablo dışa aktarabilir miyim? {#can-i-export-images-or-tables}

Evet. **☰ → Görüntüyü dışa aktar** (<kbd>Ctrl</kbd>+<kbd>P</kbd>) çizimi seçtiğiniz boyut veya ölçekte PNG ya da SVG olarak kaydeder. **Sonuçlar → CSV olarak dışa aktar** iki sonuç tablosunu da kaydeder; **Kopyala** ise bunları elektronik tabloya yapıştırmak üzere panoya kopyalar. [İçe aktarma, dışa aktarma ve paylaşım](/tr/essentials/import-export#export-an-image) sayfasına bakın.

### Modelleri programla üretebilir miyim? {#can-i-generate-models-programmatically}

Evet. Proje dosyası SI birimlerinde düz bir JSON dosyasıdır ([biçim açıklamasına](/tr/essentials/import-export#project-file-format) bakın) ve *Proje aç* ile ya da sürükleyip bırakarak açılabilir.

## Destek {#support}

### Hatayı nasıl bildiririm veya yeni özellik nasıl isterim? {#how-do-i-report-a-bug-or-request-a-feature}

[GitHub](https://github.com/janvorisek/edubeam/issues)'da bir issue açın ve sorunu yeniden üreten bir paylaşım bağlantısı veya proje dosyası ekleyin. Özel destek: [support@edubeam.app](mailto:support@edubeam.app).
