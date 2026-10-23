# Eğitim: üç mafsallı çerçeve

Üç mafsallı çerçeve izostatiktir: üç denge denklemi ve mafsaldaki $M = 0$ koşulu, dört mesnet tepkisinin tamamını verir. Bu yüzden EduBeam'in çizdiği her sayıyı kontrol etmek için mükemmel bir modeldir. Yaklaşık 15 dakika ayırın.

![Tamamlanmış çerçeve: eğilme momenti ve mesnet tepkileri](/screenshots/tr/tut-frame-moment.webp)

Modeli yalnızca incelemek mi istiyorsunuz? [Hazır modeli açın](https://run.edubeam.app/?model=eyJuIjpbWyJBIixbMCwwLDBdLFswLDJdLG51bGxdLFsiQiIsWzAsMCwtNF0sW10sbnVsbF0sWyJDIixbNCwwLC00XSxbXSxudWxsXSxbIkQiLFs4LDAsLTRdLFtdLG51bGxdLFsiRSIsWzgsMCwwXSxbMCwyXSxudWxsXV0sImUiOltbIjEiLFsiQSIsIkIiXSwiMSIsIjEiLFtmYWxzZSxmYWxzZV1dLFsiMiIsWyJCIiwiQyJdLCIxIiwiMSIsW2ZhbHNlLHRydWVdXSxbIjMiLFsiQyIsIkQiXSwiMSIsIjEiLFtmYWxzZSxmYWxzZV1dLFsiNCIsWyJEIiwiRSJdLCIxIiwiMSIsW2ZhbHNlLGZhbHNlXV1dLCJtIjpbWyIxIiw3ODUwLDIxMDAwMDAwMDAwMCw4MTAwMDAwMDAwMCwwLjAwMDAxMl1dLCJjcyI6W1siMSIsMC4wMDUzOCwwLjAwMDA4MzU2LDAuMywxXV0sImVsIjpbWyIyIixbMCwxMDAwMF0sZmFsc2VdLFsiMyIsWzAsMTAwMDBdLGZhbHNlXV0sImQiOltdfQ%3D%3D&lang=tr){target="_blank"}.

## Problem {#the-problem}

- Ayakları A ve E noktalarında sabit mesnetli, aralarında 8 m bulunan, 4 m yüksekliğinde iki kolon.
- Kolonların üstünde, açıklık ortasındaki C noktasında mafsallı yatay bir B–D kirişi.
- Kirişin tamamında $q = 10$ kN/m'lik düzgün yayılı yük.
- Çelik ($E = 210$ GPa, $G = 81$ GPa), IPE 300 ($A = 53{,}8$ cm², $I_y = 8356$ cm⁴, $h = 300$ mm).

| Düğüm | X [m] | Z [m] | Mesnet |
| --- | --- | --- | --- |
| A | 0 | 0 | sabit mesnet |
| B | 0 | −4 | |
| C | 4 | −4 | (kirişteki mafsal) |
| D | 8 | −4 | |
| E | 8 | 0 | sabit mesnet |

**z ekseninin aşağı doğru** olduğunu unutmayın; bu yüzden kolonların üst ucu `Z = −4`'tedir.

## 1. Malzeme ve kesit {#_1-material-and-section}

1. **Modeli temizle** (*Malzemeleri sil* ve *Kesitleri sil* seçeneklerini işaretleyin).
2. *Malzemeler* → **Malzeme kütüphanesi** → **Steel (S235)**.
3. *Kesitler* → **Kesit ekle**: `Alan = 0,00538`, `Iy = 8,356e-5`, `Yükseklik = 0,3`, `Kayma düzeltme katsayısı = 1`.

Kesit yalnızca yer değiştirmeleri etkiler. Bu çerçeve izostatik olduğundan iç kuvvetleri $E$, $A$ veya $I$'ya hiç bağlı değildir.

## 2. Çerçeveyi çizin {#_2-draw-the-frame}

En hızlı yol, fareyle tek bir çoklu çizgi çizmektir:

1. **Izgaraya yasla**'nın açık olduğundan emin olun (**S** düğmesi).
2. *Elemanlar* sekmesi → ikinci **Eleman ekle** düğmesi (imleç simgeli).
3. Sırasıyla (0, 0), (0, −4), (4, −4), (8, −4) ve (8, 0) noktalarına tıklayın. Noktaları bulmak için cetvellerden ve artı imlecinden yararlanın. Her tıklama bir düğüm ekler ve onu bir öncekine bağlar.
4. Bitirmek için <kbd>Esc</kbd>'ye, ardından çerçeveyi ekrana sığdırmak için <kbd>F</kbd>'ye basın.

Artık beş düğümünüz ve dört elemanınız var. Buradaki resimlerde düğümler A–E olarak etiketlidir; isterseniz kendi düğümlerinizi *Düğümler* tablosunda yeniden adlandırın ya da 1–5 olarak bırakın. Tablodaki koordinatları kontrol edin ve ızgaraya oturmamış olanları düzeltin.

## 3. Mesnetler ve mafsal {#_3-supports-and-the-hinge}

1. A düğümüne tıklayın, **Düğüm mesnetleri**'ni açın ve **Mafsal**'ı seçin. Aynısını E düğümü için yapın.
2. *Elemanlar* tablosunda B'den C'ye giden elemanı bulun ve **bitiş** mafsalını işaretleyin (*Uç mafsalları* sütunundaki ikinci kutu).

![Elemanlar tablosu: mafsal, 2 numaralı elemanın ucunda, C düğümünde](/screenshots/tr/elements-table.webp)

::: tip İki değil, tek mafsal
B–C elemanının ucunu mafsallamak yeterlidir: C'deki moment bu durumda sıfırdır, çünkü C–D, yalnızca kendisinin rijit olarak bağlandığı bir düğüme moment aktaramaz. C–D'nin başlangıcını da işaretlerseniz hiçbir şey değişmez. Ancak B'ye de bir mafsal koyarsanız çerçeve mekanizmaya dönüşür. Deneyin: EduBeam nasıl hareket ettiğini size gösterir.
:::

## 4. Yük {#_4-load}

*Yükler* → **Eleman yükü ekle** → *Düzgün yayılı yük*, B–C elemanı, `fz = 10` kN/m. Aynısını C–D elemanı için tekrarlayın. Kiriş yatay olduğundan LCS kutusu burada fark yaratmaz.

## 5. Sonuçlar {#_5-results}

Görünüm seçeneklerinde başlangıçta deforme şekil, eğilme momenti ve mesnet tepkileri açıktır. Diğerlerini görmek için **N (x)** ve **V<sub>z</sub> (x)** seçeneklerini işaretleyin.

<div class="shots">

![Eğilme momenti ve mesnet tepkileri](/screenshots/tr/tut-frame-moment.webp)

![Normal kuvvet](/screenshots/tr/tut-frame-normal.webp)

![Kesme kuvveti](/screenshots/tr/results-shear.webp)

![Deforme şekil](/screenshots/tr/results-deformed.webp)

</div>

## 6. Elle kontrol edin {#_6-check-by-hand}

**Düşey mesnet tepkileri.** Simetri nedeniyle her ayak yükün yarısını taşır:

$$V_A = V_E = \frac{q \cdot 8}{2} = 40\ \text{kN}$$

**Yatay mesnet tepkileri.** Çerçevenin sol yarısı için C mafsalına göre moment alın. Mafsaldaki moment sıfır olmalıdır:

$$V_A \cdot 4 - H_A \cdot 4 - q \cdot 4 \cdot 2 = 0 \quad\Rightarrow\quad H_A = \frac{160 - 80}{4} = 20\ \text{kN}$$

İki ayaktaki yatay tepkiler de 20 kN büyüklüğünde ve içe doğrudur; üç mafsallı çerçeveyi verimli kılan da bu yatay itkidir.

**İç kuvvetler.**

| Büyüklük | Formül | El hesabı | EduBeam |
| --- | --- | --- | --- |
| Düşey mesnet tepkileri | $qL/2$ | 40 kN | 40 kN |
| Yatay mesnet tepkileri | $M_C = 0$ koşulundan | 20 kN | 20 kN |
| B ve D köşelerindeki moment | $H \cdot h$ | 80 kNm, dış lifler çekmede | −80 kNm |
| C mafsalındaki moment | | 0 | 0 |
| Kolonlardaki normal kuvvet | $-V_A$ | −40 kN | −40 kN |
| Kirişteki normal kuvvet | $-H_A$ | −20 kN | −20 kN |
| Kolonlardaki kesme kuvveti | $H_A$ | 20 kN | −20 kN (A–B), +20 kN (D–E) |
| Kirişte B'deki kesme kuvveti | $V_A$ | 40 kN | 40 kN |
| Kirişte C'deki kesme kuvveti | $V_A - 4q$ | 0 | 0 |
| Kirişte D'deki kesme kuvveti | $V_A - 8q$ | −40 kN | −40 kN |

İki kolon aynı kuvveti taşıdığı hâlde kesme kuvvetlerinin işaretleri zıttır, çünkü her elemanın yerel eksenleri kendi yönünü izler: A–B yukarı, D–E aşağı doğru çizilmiştir. Kolonlardan birinin düğümlerini yer değiştirirseniz işareti de değişir.

Kirişte $M(x) = -80 + 40x - 5x^2$ kNm'dir (x, B'den ölçülür). Moment mafsalda sıfırdır ve hiçbir yerde pozitif değildir: kirişin tamamı negatif moment altındadır (üst lifler çekmede). Kesme kuvveti $V(x) = 40 - 10x$ tam C'de sıfıra iner, dolayısıyla momentin ekstremumu da mafsaldadır.

**Yer değiştirme.** C mafsalı 43,1 mm aşağı iner (*Sonuçlar → Düğüm sonuçları*, C'nin `Dz` değeri). Bu değer dört çubuğun hepsinin eğilmesinden gelir ve virtüel iş ilkesi için iyi bir alıştırmadır.

## 7. Deneyin {#_7-experiment}

- C'deki **mafsalın işaretini kaldırın**. Çerçeve bir derece hiperstatik olur; köşe momentleri azalır ve açıklık ortasında pozitif moment oluşur. Artık kesit önemlidir: daha rijit bir kiriş deneyin.
- **Ayakları ankastre yapın** (**Ankastre** mesneti seçin). A ve E'de moment oluşur.
- **Yatay bir yük ekleyin**: B'ye `Fx = 10` kN'lik bir düğüm yükü. Çerçeve yanal olarak ötelenir ve mesnet tepkileri artık simetrik değildir. Bunları aynı üç denklem ve $M_C = 0$ koşuluyla kontrol edin.
- **B'ye de bir mafsal koyun.** Çerçeve artık bir mekanizmadır ve EduBeam nasıl hareket edebileceğini animasyonla gösterir.
