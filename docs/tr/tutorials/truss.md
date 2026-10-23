# Eğitim: düzlem kafes sistem

Bu eğitimde küçük, izostatik bir kafes sistem kuracak, çubuk kuvvetlerini düğüm noktası yöntemi ve kesim (Ritter) yöntemiyle kontrol edecek ve bir sıfır kuvvetli çubuk bulacaksınız. Yaklaşık 15 dakika ayırın.

![Tamamlanmış kafes sistem: normal kuvvetler ve mesnet tepkileri](/screenshots/tr/tut-truss.webp)

Modeli yalnızca incelemek mi istiyorsunuz? [Hazır modeli açın](https://run.edubeam.app/?model=eyJuIjpbWyIxIixbMCwwLDBdLFswLDJdLG51bGxdLFsiMiIsWzQsMCwwXSxbXSxudWxsXSxbIjMiLFs4LDAsMF0sW10sbnVsbF0sWyI0IixbMTIsMCwwXSxbMl0sbnVsbF0sWyI1IixbNCwwLC0zXSxbXSxudWxsXSxbIjYiLFs4LDAsLTNdLFtdLG51bGxdXSwiZSI6W1siMSIsWyIxIiwiMiJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiMiIsWyIyIiwiMyJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiMyIsWyIzIiwiNCJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiNCIsWyI1IiwiNiJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiNSIsWyIxIiwiNSJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiNiIsWyIyIiwiNSJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiNyIsWyI1IiwiMyJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiOCIsWyIzIiwiNiJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiOSIsWyI2IiwiNCJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dXSwibSI6W1siMSIsNzg1MCwyMTAwMDAwMDAwMDAsODEwMDAwMDAwMDAsMC4wMDAwMTJdXSwiY3MiOltbIjEiLDAuMDAyLDAuMDAwMDAxLDAuMSwxXV0sIm5sIjpbWyIyIix7IjAiOjAsIjIiOjMwMDAwLCI0IjowfV0sWyIzIix7IjAiOjAsIjIiOjMwMDAwLCI0IjowfV1dLCJkIjpbXX0%3D&lang=tr){target="_blank"}.

## Problem {#the-problem}

![Geometri, mesnetler ve yükler](/screenshots/tr/tut-truss-model.webp)

- Her biri 4 m'lik üç göze bölünmüş 12 m'lik açıklık, yükseklik 3 m.
- Alt başlık düğümleri 1–4, üst başlık düğümleri 5 ve 6.
- 1 düğümünde sabit mesnet, 4 düğümünde kayıcı mesnet.
- Alt başlığın 2 ve 3 düğümlerinde 30'ar kN'lik iki yük.
- $A = 20$ cm² alanlı çelik çubuklar.

| Düğüm | X [m] | Z [m] | Mesnet | Yük |
| --- | --- | --- | --- | --- |
| 1 | 0 | 0 | sabit mesnet | |
| 2 | 4 | 0 | | `Fz = 30` kN |
| 3 | 8 | 0 | | `Fz = 30` kN |
| 4 | 12 | 0 | kayıcı mesnet | |
| 5 | 4 | −3 | | |
| 6 | 8 | −3 | | |

Çubuklar: alt başlık 1–2, 2–3, 3–4; üst başlık 5–6; uç diyagonaller 1–5 ve 6–4; dikmeler 2–5 ve 3–6; orta diyagonal 5–3.

**Sistem izostatik mi?** $j = 6$ düğüm için $m + r = 9 + 3 = 12 = 2j$ olduğundan evet: çubuk kuvvetleri yalnızca denge denklemlerinden bulunur.

## 1. Malzeme ve kesit {#_1-material-and-section}

1. **Modeli temizle** (*Malzemeleri sil* ve *Kesitleri sil* seçeneklerini işaretleyin).
2. *Malzemeler* → **Malzeme kütüphanesi** → **Steel (S235)**.
3. *Kesitler* → **Kesit ekle**: `Alan = 0,002`, `Iy = 1e-6`, `Yükseklik = 0,1`, `Kayma düzeltme katsayısı = 1`. İki ucu mafsallı çubuklarda yalnızca alan önemlidir.

## 2. Çubukları mafsallarıyla çizin {#_2-draw-the-bars-with-hinges}

EduBeam'de bir kafes çubuğu, **her iki uç mafsalı** işaretlenmiş bir kiriş elemanıdır. Fareyle çizim aracı bunları sizin yerinize ayarlayabilir:

1. *Elemanlar* sekmesi → ikinci **Eleman ekle** düğmesi (imleç simgeli).
2. Görüntüleyicinin üstündeki şeritte **Başlangıç mafsalı** ve **Bitiş mafsalı** seçeneklerini işaretleyin. Artık çizdiğiniz her çubukta ikisi de olur.
3. Dış konturu tek bir çoklu çizgi olarak çizin: (0, 0), (4, −3), (8, −3), (12, 0) noktalarına, ardından alt başlık boyunca geri dönerek (8, 0), (4, 0), (0, 0) noktalarına tıklayın. <kbd>Esc</kbd>'ye basın.
4. İç çubukları tek tek çizin ve her birinden sonra <kbd>Esc</kbd>'ye basın: (4, 0) → (4, −3), (4, −3) → (8, 0), (8, 0) → (8, −3).
5. Ekrana sığdırmak için <kbd>F</kbd>'ye basın.

*Elemanlar* tablosunu kontrol edin: her birinde iki *Uç mafsalları* kutusu da işaretli dokuz eleman olmalıdır. Düğüm ve eleman numaralarınız resimlerdekinden farklı olabilir; bunun bir önemi yok.

## 3. Mesnetler ve yükler {#_3-supports-and-loads}

1. (0, 0) noktasındaki düğüme tıklayın → **Düğüm mesnetleri** → **Mafsal**. (12, 0) noktasındaki düğüme tıklayın → **Kayıcı mesnet**.
2. (4, 0) noktasındaki düğüme tıklayın → **Yük ekle** → `Fz = 30` kN. Aynısını (8, 0) için yapın.

Pozitif `Fz` aşağı doğrudur. Kafes sistemin düğümleri serbestçe dönebilir; EduBeam, bağlanan tüm çubukların mafsallı olduğu düğümleri kabul eder ve bunların dönmesini 0 olarak verir.

## 4. Sonuçlar {#_4-results}

Görünüm seçeneklerinde **Deforme şekil** ve **M<sub>y</sub> (x)** seçeneklerinin işaretini kaldırın (kafes sistemde eğilme yoktur) ve **N (x)** seçeneğini işaretleyin.

![Normal kuvvetler: çekme pozitif](/screenshots/tr/tut-truss.webp)

## 5. Elle kontrol edin {#_5-check-by-hand}

**Mesnet tepkileri.** Yükler simetrik olduğundan $R_1 = R_4 = 30$ kN (yukarı doğru) olur ve sabit mesnetteki yatay tepki sıfırdır.

**1 düğümü** (düğüm noktası yöntemi). 1–5 uç diyagonali 5 m uzunluğundadır ($\sin\alpha = 3/5$, $\cos\alpha = 4/5$):

$$\sum F_z:\ N_{15} \cdot \tfrac{3}{5} = -30 \Rightarrow N_{15} = -50\ \text{kN} \qquad \sum F_x:\ N_{12} = -N_{15} \cdot \tfrac{4}{5} = 40\ \text{kN}$$

**2 düğümü.** 30 kN'lik yükü yukarı aktarabilecek tek çubuk 2–5 dikmesidir: $N_{25} = +30$ kN ve $N_{23} = N_{12} = 40$ kN.

**Orta gözden geçen kesim.** 5–6, 5–3 ve 2–3 çubuklarını kesin ve sol parçayı ele alın:

- 3 düğümüne göre momentler: $R_1 \cdot 8 - 30 \cdot 4 + N_{56} \cdot 3 = 0 \Rightarrow N_{56} = -40$ kN.
- Düşey kuvvetler: gözdeki kesme kuvveti $R_1 - 30 = 0$ olduğundan **5–3 diyagonali hiçbir kuvvet taşımaz**: $N_{53} = 0$.

| Çubuk | El hesabı | EduBeam |
| --- | --- | --- |
| Alt başlık 1–2, 2–3, 3–4 | +40 kN (çekme) | 40 |
| Üst başlık 5–6 | −40 kN (basınç) | −40 |
| Uç diyagonaller 1–5, 6–4 | −50 kN | −50 |
| Dikmeler 2–5, 3–6 | +30 kN | 30 |
| Orta diyagonal 5–3 | 0 | 0 |

2 düğümünün sehimi 2,29 mm'dir (*Sonuçlar → Düğüm sonuçları*). Alıştırma olarak bunu virtüel iş ilkesiyle, $\delta = \sum N n L / (EA)$, hesaplayın.

## 6. Deneyin {#_6-experiment}

- **Bir yükü taşıyın.** 30 kN'lik iki yükü de 2 düğümüne koyun. Orta diyagonal artık kuvvet taşır: hangi işaretle ve neden?
- **Orta diyagonali silin.** Kafes sistem bir mekanizmaya dönüşür; EduBeam soruna yol açan mafsalları daire içine alır ve gözün nasıl kaydığını gösterir.
- **Tüm mafsalların işaretini kaldırın.** Kafes sistem rijit düğümlü bir çerçeveye dönüşür. **M<sub>y</sub> (x)** seçeneğini işaretleyin: eğilme momentleri normal kuvvetlerin yanında çok küçüktür; mafsallı düğüm idealleştirmesinin işe yaramasının nedeni budur.
- **İki mesneti de sabit mesnet yapın.** Fazladan bir mesnet tepkisi sistemi hiperstatik yapar ve alt başlık kuvvetleri artık çubuk alanlarına bağlı olur.
