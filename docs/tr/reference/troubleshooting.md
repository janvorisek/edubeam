---
description: "Neden hiçbir sonuç çizilmiyor ve nasıl düzeltilir: eksik mesnetler, mekanizmalar, çözücü mesajları, hatalar ve uyarılar, yanlış görünen sonuçlar ve hata bildirme."
---

# Sorun giderme

## Hiçbir sonuç çizilmiyor {#no-results-are-drawn}

Sonuçlar yalnızca model çözülebildiğinde görünür. Şunları sırasıyla kontrol edin:

1. **Görüntüleyicinin sol üstündeki mesajı okuyun.**
   - *Tanımlı malzeme yok.* / *Tanımlı kesit yok.*: **Yeni ekle** düğmesiyle bir tane ekleyin.
   - Mavi **Mesnet gerekli** etiketi: model yalnızca henüz tamamlanmamıştır. Mesnet ekleyin. İmleci etiketin üzerine getirdiğinizde kesikli çizgi, yapının hâlâ nasıl hareket edebildiğini gösterir.
   - **Kırmızı mesaj**: modelde bir hata var. Mesaj sorunun adını verir; birden fazla hata varsa *Modelde N hata var.* yazar. **Ayrıntıları göster**'e tıklayın ve her maddeyi düzeltin (aşağıdaki tabloya bakın). İlgili düğümler veya mafsallar tuvalde daire içine alınır.
   - **Sarı mesaj**: uyarılar. Model yine de çözülmüştür; uyarıları gizleyebilirsiniz.
2. **Yeterli mesnet var mı?** Çözücü en az üç tutulu serbestlik derecesine ihtiyaç duyar ve mesnetlerin yapıyı gerçekten tutması gerekir. İki kayıcı mesnet üzerindeki bir kirişin (Dz + Dz) yalnızca iki tutulu serbestlik derecesi vardır ve kiriş yatayda kayıp gider. Bir yere `Dx` ya da mesnetlerden birine `Ry` ekleyin.
3. **Elemanlar birbirine bağlı mı?** Aynı koordinatlardaki iki düğüm yine de birbirinden ayrı iki düğümdür. Fazla olan düğümü silip elemanları yeniden bağlayın veya düğümleri elemanların üzerine **Yapıya bağla** seçeneğiyle yerleştirin.
4. **Mafsal sayısı fazla mı?** Bir kolonun iki ucundaki mafsallar veya diyagonali olmayan, mafsallı çubuklardan oluşan bir kare mekanizma oluşturur. EduBeam bu mafsalları daire içine alır ve olası hareketi gösterir.
5. **Rijitlik sıfır mı?** `E`, `A` veya `Iy` yanlışlıkla 0 ya da yanlış birimle girildiyse yapının bir kısmı neredeyse hiç direnç göstermeden hareket eder. EduBeam bunu *labil* olarak bildirir.

![Ayrıntıları göster her sorunu bir ipucuyla listeler ve hareketi gösterebilir](/screenshots/tr/ui-diagnostics.webp){.shot-lg}

## Mesajlar {#messages}

**Ayrıntıları göster**, başlığı *Model çözülemiyor* (hatalar), *Henüz çözülemiyor* (hâlâ mesnet gerekiyor) veya *Model uyarıları* olan bir pencere açar. Penceredeki **Sorun giderme** bağlantısı bu sayfaya yönlendirir.

### Eksik olanlar {#still-needed}

| Mesaj | Anlamı / çözümü |
| --- | --- |
| *Yapının çözülebilmesi için mesnet gerekiyor.* | Toplamda üçten az tutulu serbestlik derecesi var. Mesnet ekleyin. |
| *Yapının ayrık bir parçasında (düğümler …) 3'ten az tutulu serbestlik derecesi var ve bu parça serbestçe hareket edebiliyor.* | Model parçalara ayrılmış ve parçalardan biri hiçbir yere tutunmuyor. Onu yapıya bağlayın veya mesnetleyin. |

### Hatalar {#errors}

| Mesaj | Anlamı / çözümü |
| --- | --- |
| *Yapıda yeterli sayıda mesnet var, ancak bu mesnetler yapıyı tutmuyor: yapı hâlâ …* | Mesnetlerin tümü paralel ya da tesir çizgileri tek bir noktada kesişiyor. Kesikli çizgi hareketi gösterir; mesnetlerden birinin doğrultusunu değiştirin. Sorun yalnızca bir parçayı etkiliyorsa aynı mesaj *yapının ayrık bir parçasından* söz eder. |
| *Mesnetler yapıyı tutuyor, ancak yapı yine de bir mekanizma: çubukları … düğümündeki mafsallar etrafında dönebiliyor.* | Mafsallar çubukların birbirine göre dönmesine izin veriyor; örneğin iki kolonunun da tepesinde mafsal olan bir çerçevede veya diyagonali olmayan mafsallı bir karede. Bir mafsalı kaldırın ya da bir çubuk veya mesnet ekleyin. |
| *Yapı labil: … düğümünün yer değiştirmesi pratikte hiçbir dirençle karşılaşmıyor.* | Neredeyse bir mekanizma ya da sıfıra yakın bir rijitlik. Mesnetleri, mafsalları ve `E`, `A`, `Iy` değerlerini kontrol edin. |
| *Yapı bir mekanizma: rijitlik matrisi tekil.* | Yukarıdaki kontrollerin yakalayamadığı bir şey serbestçe hareket edebiliyor. Her parçanın en az üç bağla tutulduğunu ve mafsalların hiçbir çubuğu serbestçe dönebilir bırakmadığını kontrol edin. |
| *… elemanı mevcut olmayan … düğümüne bağlı.* / *… elemanına atanan … malzemesi (kesiti) mevcut değil.* | Başvurulan nesne silinmiş; bu genellikle elle düzenlenmiş bir JSON dosyasında olur. *Elemanlar* tablosunda elemana yeniden mevcut bir düğüm, malzeme veya kesit atayın. |
| *… elemanı tam olarak 2 düğüme bağlanmalıdır.* | İçe aktarılan dosyada bozuk bir eleman var. Silip yeniden oluşturun. |
| *Düğüm yükü #n, mevcut olmayan … düğümüne etkiyor.* / *Öngörülen yer değiştirme #n, mevcut olmayan … düğümüne tanımlanmış.* | Yükü silin veya ona bir düğüm atayın. |
| *Eleman yükü #n, mevcut olmayan … elemanına etkiyor.* | Yükü silin. |
| *Modeldeki bir iç tutarsızlık nedeniyle çözüm başarısız oldu…* | Genel bir hata. Son adımı geri alın ya da dosyayı kaydedip [hatayı bildirin](https://github.com/janvorisek/edubeam/issues). |

### Uyarılar {#warnings}

Model yine de çözülür, ancak şunları kontrol edin:

| Mesaj | Anlamı / çözümü |
| --- | --- |
| *… düğümü hiçbir elemana bağlı değil ve çözümde dikkate alınmıyor.* | Başıboş bir düğüm. Silin ya da bir elemana bağlayın. |
| *… düğümü mesnetli, ancak hiçbir elemana bağlı değil; bu nedenle mesnet hiçbir yük taşımıyor.* | Başıboş bir düğümdeki mesnet. |
| *… elemanının iki ucu da aynı düğüme bağlı.* | Sıfır uzunluklu bir eleman. Silin. |
| *Düğüm yükü #n geçersiz değerler içeriyor.* / *Öngörülen yer değiştirme #n geçersiz değerler içeriyor.* | Bileşenlerden biri sayı değil. Yükü düzenleyin. |

## Sonuçlar yanlış görünüyor {#results-look-wrong}

| Belirti | Olası neden |
| --- | --- |
| Yükler yukarı doğru etkiyor | Genel **z ekseni aşağı doğrudur**, bu yüzden pozitif `Fz`/`fz` aşağı, negatif değerler yukarı doğru etkir. [İşaret kabulü](/tr/elements/conventions) sayfasına bakın. y yukarı eksenlerle durum tam tersidir. |
| Sehim 1000 kat büyük veya küçük | Birim karışıklığı: birim MPa iken `E` Pa olarak ya da birim m⁴ iken `Iy` cm⁴ olarak girilmiş. Görüntüleyicinin sağ altındaki birim göstergesini kontrol edin. |
| Sehim ders kitabındaki formülden biraz büyük | Timoshenko kirişinin kayma şekil değiştirmesi. Euler–Bernoulli değerlerine yaklaşmak için kesitin kayma düzeltme katsayısını artırın ya da narin bir çubuk kullanın. [Sonuçların elle kontrolü](/tr/guide/verification) sayfasına bakın. |
| Bir işaret “yanlış” görünüyor | İşareti diyagramın hangi tarafta çizildiğinden değil, etiketlerden okuyun. Pozitif M alt lifleri çeker. *Eleman sonuçları* içindeki çubuk uç kuvvetleri N-V-M işaret kabulüne değil, elemanın yerel eksenlerine göre verilir. |
| Özdeş iki kolonda kesme kuvvetinin işareti zıt | V'nin işareti her elemanın yönüne bağlıdır. Karşılaştırmak için birinin düğümlerini yer değiştirin. |
| `4 · 10¹` gibi sayılar | Bilimsel sayı biçimi. *Ayarlar → Dil ve bölge → Sayı biçimi* altında *Otomatik*'i seçin. |
| Diyagramlar çok büyük veya çok küçük | Bu yalnızca görsel bir durumdur. *Ayarlar → Görüntüleyici ayarları* altında **Sonuç ölçeği**'ni ayarlayın. |
| Yerel koordinatlarda tanımlı bir yük ters yönü gösteriyor | Elemanın yerel x ekseni *başlangıç* düğümünden *bitiş* düğümüne doğrudur. Düğümleri yer değiştirin ya da işareti ters çevirin. |
| Eğik bir çubuğun yükü beklenenden farklı | **LCS** varsayılan olarak işaretlidir, bu yüzden `fz` çubuğa dik etkir. Düşey bir yük için işareti kaldırın. |
| Sıcaklık yüklemesi hiçbir etki yapmıyor | İzostatik bir yapı sıcaklık değişiminde serbestçe şekil değiştirir ve iç kuvvet oluşmaz. α ≠ 0 olduğunu ve sıcaklık farkı için kesit yüksekliği h'nin girildiğini kontrol edin. |

## Arayüz sorunları {#interface-issues}

| Belirti | Çözüm |
| --- | --- |
| Kısayollar çalışmıyor | Önce tuvale tıklayın: bir metin alanı odaktayken tuşlar dikkate alınmaz. |
| Görünüm kaydırılamıyor | Kaydırma varsayılan olarak farenin orta veya sağ tuşuyla yapılır; bunu *Ayarlar → Kontroller ve kısayollar* altında değiştirebilirsiniz. Dokunmatik yüzeyde iki parmakla kaydırmak yakınlaştırır; görünümü kaydırmak için iki parmakla tıklayıp sürükleyin. |
| Modelim kayboldu | Bir bağlantı, dosya veya örnek açtığınızda ya da modeli temizlediğinizde eski model saklanır: **☰ → Son modeller** veya <kbd>Ctrl</kbd>+<kbd>Z</kbd>. |
| Dil yanlış | *Ayarlar → Dil ve bölge* veya adrese `?lang=tr` ekleyin. |
| Ayar değişiklikleri kalıcı olmuyor | Tarayıcının yerel depolaması engellenmiş (gizli pencere, sıkı gizlilik modu). Ayarlar, otomatik kaydetme ve Son modeller listesi buna ihtiyaç duyar. |

## Hata bildirme {#reporting-a-bug}

Tarayıcınızı ve işletim sisteminizi, ne beklediğinizi ve en önemlisi sorunu yeniden oluşturan bir **paylaşım bağlantısını** veya **proje dosyasını** içeren bir [GitHub issue](https://github.com/janvorisek/edubeam/issues) açın.
