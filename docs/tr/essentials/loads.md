---
description: "Düğüm kuvvetleri ve momentleri, mesnet çökmeleri, düzgün yayılı, trapez ve tekil eleman yükleri ile sıcaklık yüklemeleri; her biri için işaret kabulüyle birlikte."
---

# Yükler

Tüm yükler **tek bir yükleme durumunda** yer alır ve birlikte etkir. Farklı senaryoları karşılaştırmak için her birini ayrı bir proje dosyası ya da paylaşım bağlantısı olarak kaydedin.

![Tek bir sürekli kirişte tüm yük türleri: düğüm kuvveti, düzgün yayılı yük, trapez yük, tekil yük, sıcaklık yüklemesi ve mesnet çökmesi](/screenshots/tr/loads-overview.webp)

<LoadShowcase />

## Tek cümlede işaret kabulü {#sign-convention-in-one-line}

Global **x** ekseni sağa, global **z** ekseni **aşağı** doğrudur. Bu nedenle pozitif `Fz` veya `fz` aşağı doğru, yerçekimi gibi etkiyen bir yüktür; pozitif `My` momenti ise ekranda saat yönünün tersine döndürür. Ayrıntılar [Koordinat sistemi ve işaret kabulü](/tr/elements/conventions) sayfasındadır. [y yukarı eksenlerde](/tr/elements/conventions#y-up-axes) düşey büyüklüklerin adları ve işaretleri değişir: yerçekimi yükü negatif bir `Fy` olur.

## Düğüm yükleri {#nodal-loads}

*Yükler* sekmesi → **Düğüm yükü ekle** ya da bir düğüme tıklayın → **Yük ekle**. **Kuvvet/Moment**'i seçin:

| Alan | Anlamı | Birim |
| --- | --- | --- |
| `Fx` | yatay kuvvet (sağa doğru pozitif) | kuvvet birimi |
| `Fz` | düşey kuvvet (aşağı doğru pozitif) | kuvvet birimi |
| `My` | y eksenine göre moment (saat yönünün tersine pozitif) | moment birimi |

![Düğüm yükü ekle. Önizleme, siz yazarken yükün yönünü gösterir.](/screenshots/tr/loads-nodal.webp){.shot-md}

Bileşenler her zaman **global** koordinat sistemindedir. Bir düğüme birden fazla düğüm yükü etkiyebilir; bunlar toplanır ve üst üste çizilir.

### Öngörülen yer değiştirmeler (mesnet çökmeleri) {#prescribed-displacements-support-settlements}

Aynı pencerede **Öngörülen yer değiştirme**'yi seçin ya da mesnetli bir düğüme tıklayın → **Yer değiştirme tanımla**. Alanlar şöyle değişir:

| Alan | Anlamı | Birim |
| --- | --- | --- |
| `Dx` | verilen yatay yer değiştirme | yer değiştirme birimi |
| `Dz` | verilen düşey yer değiştirme (aşağı doğru pozitif) | yer değiştirme birimi |
| `Ry` | verilen dönme | rad |

Yalnızca o düğümde **tutulu** olan bir serbestlik derecesine değer girebilirsiniz, çünkü yalnızca mesnetler hareket ettirilebilir. Her düğümde en fazla bir öngörülen yer değiştirme olabilir; ikincisini eklemek yerine mevcut olanı düzenleyin. İzostatik bir yapıda mesnet çökmesi yer değiştirme oluşturur ama iç kuvvet oluşturmaz; hiperstatik bir yapıda ikisini de oluşturur.

## Eleman yükleri {#element-loads}

*Yükler* sekmesi → **Eleman yükü ekle** ya da bir elemana tıklayın → **Yük ekle**. **Yük türü**nü seçin; pencere, siz yazarken yükü eleman üzerinde önizler.

### Düzgün yayılı yük {#uniformly-distributed-load}

| Alan | Anlamı | Birim |
| --- | --- | --- |
| `fx` | x doğrultusunda birim boydaki yük | kuvvet / uzunluk |
| `fz` | z doğrultusunda birim boydaki yük | kuvvet / uzunluk |
| **LCS** | işaretli: `fx`, `fz` elemanın yerel eksenleri doğrultusunda etkir; işaretsiz: global eksenler doğrultusunda | – |

**LCS** varsayılan olarak işaretlidir. Soldan sağa çizilmiş yatay bir elemanda yerel ve global eksenler aynıdır, bu yüzden fark etmez. Eğik bir çubukta ise fark eder:

- **çubuğa dik** bir yük (mertek üzerindeki rüzgâr) LCS **işaretliyken** `fz`'dir;
- çubuk boyunun metresi başına **düşey** bir yük (zati ağırlık) LCS **işaretsizken** `fz`'dir;
- *yatay izdüşümün* metresi başına düşey bir yük (kar) doğrudan girilemez. Önce $\cos\alpha$ ile çarpın ($\alpha$ çubuğun eğimidir) ve düşey yük olarak girin.

### Trapez yük {#trapezoidal-load}

| Alan | Anlamı |
| --- | --- |
| `f1x`, `f1z` | **başlangıç** düğümündeki yük şiddeti |
| `f2x`, `f2z` | **bitiş** düğümündeki yük şiddeti |

Yük şiddeti elemanın başından sonuna doğrusal olarak değişir. Üçgen yük için `f1z = 0` girin. Trapez yükler her zaman **elemanın yerel eksenleri** doğrultusunda etkir (LCS kutusu kilitlidir); yatay bir elemanda bu, global eksenlerle aynıdır.

### Tekil yük {#concentrated-load}

Eleman **boyunca** herhangi bir noktada, ek düğüm gerektirmeyen tekil kuvvet veya moment.

| Alan | Anlamı |
| --- | --- |
| `Fx`, `Fz`, `My` | kuvvet ve moment bileşenleri |
| **Yükün başlangıç düğümüne uzaklığı** | başlangıç düğümünden uzaklık, `0 ≤ a ≤ L` |
| **LCS** | yerel eksenlerdeki bileşenler |

Kesme kuvveti diyagramı yükün olduğu yerde `Fz` kadar sıçrar, moment diyagramında ise bir kırılma oluşur; o noktadaki moment değeri otomatik olarak etiketlenir. Tekil bir `My` ise moment diyagramında sıçramaya yol açar.

### Sıcaklık yüklemesi {#temperature-load}

| Alan | Anlamı |
| --- | --- |
| **ΔT<sub>c</sub>**, eksendeki sıcaklık değişimi | tüm kesitte düzgün değişim; $\alpha\,\Delta T_c\,L$ kadar uzama oluşturur |
| **ΔT<sub>b</sub> − ΔT<sub>t</sub>**, sıcaklık farkı | alt lif eksi üst lif; $\alpha\,(\Delta T_b - \Delta T_t)/h$ eğriliği oluşturur |

Sıcaklık yüklemeleri malzemenin **α** değerini ve kesitin **yüksekliği h**'yi kullanır. Pozitif bir `ΔTb − ΔTt` (altta daha sıcak) alt lifi uzatır, böylece eleman yerçekimi yükü altındaki bir kiriş gibi aşağı sehim yapar. İzostatik bir yapıda sıcaklık yalnızca yer değiştirme oluşturur; deformasyon engellendiğinde (ankastre uçlar, süreklilik, fazla çubuklar) iç kuvvetler de oluşur.

<div class="shots">

![Düzgün yayılı yük](/screenshots/tr/loads-udl.webp)

![Trapez yük](/screenshots/tr/loads-trapezoidal.webp)

![Tekil yük](/screenshots/tr/loads-concentrated.webp)

![Sıcaklık yüklemesi](/screenshots/tr/loads-temperature.webp)

</div>

## Yükleri düzenleme ve silme {#editing-and-removing-loads}

- Her yük *Yükler* sekmesinde bir satırdır; bileşenlerini ve LCS işaretini orada doğrudan düzenleyebilirsiniz. Yükler *Düğümler* ve *Elemanlar* tablolarında da etiket olarak görünür.
- Düzenleme penceresini açmak için görüntüleyicide bir yüke **çift tıklayın** ya da yüke tıklayıp **Yükü düzenle**'yi seçin.
- Bir yükü seçip <kbd>Delete</kbd> tuşuna basın ya da tablodaki × işaretini kullanın.
- Bir düğüme veya elemana bağlı yükler onunla birlikte silinir; kopyalayıp yapıştırdığınızda da onunla birlikte kopyalanır.

![Yükler sekmesi: her yük için bir satır, bileşenleri yerinde düzenlenebilir](/screenshots/tr/loads-table.webp)

## Desteklenmeyen özellikler {#what-is-not-available}

- **Yükleme durumları ve kombinasyonları.** Tek bir yükleme durumu vardır.
- **Zati ağırlık.** LCS işaretsiz bir düzgün yayılı yük olarak girin: $f_z = \rho\,g\,A$. Bir IPE 200 için 7850 × 9,81 × 0,00285 ≈ 0,22 kN/m.
- Eğik çubuklarda **global eksenlerde trapez yükler**.
