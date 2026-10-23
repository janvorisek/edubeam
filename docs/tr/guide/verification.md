# Sonuçların elle kontrolü

<Edubeam />, her mühendisin edinmesi gereken alışkanlığı kazanmak için iyi bir ortamdır: kabaca kendiniz bulamadığınız bir sayıya asla güvenmeyin. Bu sayfada klasik durumlar için kapalı formüller ve uygulamanın bu durumlarda verdiği sonuçlar yer alıyor; böylece her modeli kendiniz kurup karşılaştırabilirsiniz.

El hesabıyla kontrol edilmiş eksiksiz çözümlü örnekler için [üç mafsallı çerçeve](/tr/tutorials/three-hinged-frame) ve [düzlem kafes sistem](/tr/tutorials/truss) eğitimlerine bakın.

Aksi belirtilmedikçe tüm durumlarda aynı çelik kesit kullanılır: $E = 210\,000$ MPa, $G = 81\,000$ MPa, $A = 28{,}5$ cm², $I_y = 1943$ cm⁴, $h = 200$ mm, $k = 1$ (bir IPE 200).

$$EI = 210 \times 10^9 \cdot 1{,}943 \times 10^{-5} = 4{,}080 \times 10^6\ \text{Nm}^2$$

::: tip Sayılar neden biraz farklı çıkar?
EduBeam **Timoshenko** kirişleri kullanır; bunlar klasik Euler–Bernoulli eğilme sehimine bir kayma sehimi $\Delta w_s$ ekler. İzostatik sistemlerde dönmeler, mesnet tepkileri ve iç kuvvetler bundan etkilenmez. Narin çubuklarda bu ek terim çok küçüktür; aşağıdaki tablolarda ayrıca gösterilmiştir.
:::

## Düzgün yayılı yüklü basit mesnetli kiriş {#simply-supported-beam-uniform-load}

$L = 6$ m, $q = 12$ kN/m. Mesnetler: 1 numaralı düğüm `Dx + Dz`, 2 numaralı düğüm `Dz`.

| Büyüklük | Formül | Değer | EduBeam |
| --- | --- | --- | --- |
| Mesnet tepkileri | $qL/2$ | 36 kN | 36 kN |
| $V_{max}$ | $qL/2$ | 36 kN | 36 kN |
| $M_{max}$ (açıklık ortası) | $qL^2/8$ | 54 kNm | 54 kNm |
| Uç dönmesi | $qL^3/(24EI)$ | 0,02647 rad | 0,02647 rad |
| Açıklık ortası sehimi (eğilme) | $5qL^4/(384EI)$ | 49,63 mm | — |
| Açıklık ortası sehimi (kayma) | $qL^2/(8kGA)$ | 0,23 mm | — |
| Açıklık ortası sehimi (toplam) | toplam | 49,86 mm | 49,86 mm |

Açıklık ortasındaki sehimi okumak için *Düğüm ekle* (fareyle) → **Yapıya bağla** ile açıklık ortasına bir düğüm ekleyin; elemanı bölmek hiçbir sonucu değiştirmez.

<ExampleStructure />

## Ucunda tekil yük bulunan konsol {#cantilever-tip-load}

$L = 4$ m, serbest uçta aşağı doğru $F = 18$ kN. Mesnet: 1 numaralı düğüm `Dx + Dz + Ry`.

| Büyüklük | Formül | Değer | EduBeam |
| --- | --- | --- | --- |
| Düşey mesnet tepkisi | $F$ | 18 kN | 18 kN |
| Ankastrelik momenti | $FL$ | 72 kNm | 72 kNm |
| Uç dönmesi | $FL^2/(2EI)$ | 0,03529 rad | 0,03529 rad |
| Uç sehimi (eğilme) | $FL^3/(3EI)$ | 94,11 mm | — |
| Uç sehimi (kayma) | $FL/(kGA)$ | 0,31 mm | — |
| Uç sehimi (toplam) | toplam | 94,42 mm | 94,42 mm |

Burada kayma terimi %0,3'tür. Konsolu 1 m'ye kısaltırsanız %5'e çıkar; kayma düzeltme katsayısı tam da bunun içindir.

<Figure>
  <Structure :show-loads="true" show-moment show-reactions :nodes="[{label: '1', coords: [0,0,0], dofs: [0,2,4]}, {label: '2', coords: [4,0,0], dofs: []}]" :elements="[{label: '1', nodes: ['1', '2']}]" :nodal-loads="[{target: '2', values: { 0: 0, 2: 18000, 4: 0 }}]" />
  <figcaption>Ucunda 18 kN yük bulunan konsol: eğilme momenti ve mesnet tepkileri</figcaption>
</Figure>

## Düzgün yayılı yüklü iki ucu ankastre kiriş {#fixed–fixed-beam-uniform-load}

$L = 6$ m, $q = 12$ kN/m. İki düğüm de `Dx + Dz + Ry`.

| Büyüklük | Formül | Değer |
| --- | --- | --- |
| Mesnet tepkileri | $qL/2$ | 36 kN |
| Mesnet momenti | $qL^2/12$ | 36 kNm (negatif, üst lifler çekmede) |
| Açıklık ortası momenti | $qL^2/24$ | 18 kNm (pozitif) |
| Açıklık ortası sehimi | $qL^4/(384EI) + qL^2/(8kGA)$ | 9,93 + 0,23 = 10,16 mm |

Basit mesnetli kirişte iki düğümde de `Ry` kutusunu işaretleyerek bu modeli elde edin ve moment diyagramının nasıl kaydığını izleyin.

## Düzgün yayılı yüklü, bir ucu ankastre diğer ucu kayıcı mesnetli kiriş {#propped-cantilever-uniform-load}

$L = 6$ m, $q = 12$ kN/m. 1 numaralı düğüm `Dx + Dz + Ry`, 2 numaralı düğüm `Dz`.

| Büyüklük | Formül | Değer |
| --- | --- | --- |
| Ankastre uçtaki mesnet tepkisi | $5qL/8$ | 45 kN |
| Kayıcı mesnetteki tepki | $3qL/8$ | 27 kN |
| Ankastrelik momenti | $qL^2/8$ | 54 kNm (negatif) |
| En büyük pozitif moment | ankastre uçtan $x = 5L/8$ uzaklıkta $9qL^2/128$ | 3,75 m'de 30,4 kNm |

Uygulama yerel ekstremum değerini otomatik olarak etiketler; böylece hem değeri hem de (eleman boyunca konumundan) nerede oluştuğunu okuyabilirsiniz.

## İki çubuklu kafes sistem {#two-bar-truss}

`(0, 0)` ve `(4, 0)` noktalarındaki sabit mesnetlerden çıkan iki çubuk `(2, −2)` noktasında birleşir (tepe noktası 2 m yukarıda). İki çubukta da iki **uç mafsalı** işaretlidir; tepe noktasına düşey $F = 20$ kN yük etkir (aşağı doğru, yani `Fz = 20`).

Her çubuk 45° eğimlidir ve boyu $L = 2\sqrt{2}$ m'dir. Simetriden dolayı her biri şu kuvveti taşır:

$$N = -\frac{F}{2 \sin 45^\circ} = -14{,}14\ \text{kN (basınç)}$$

Mesnetlerin her biri düşeyde 10 kN, yatayda ±10 kN alır. **N (x)** diyagramını ve mesnet tepkilerini kontrol edin.

## Basit mesnetli kirişte sıcaklık farkı {#temperature-gradient-on-a-simply-supported-beam}

$L = 8$ m, $\Delta T_b - \Delta T_t = -10$ K (üst taraf daha sıcak), $\alpha = 12 \times 10^{-6}$, $h = 0{,}2$ m.

Kiriş serbestçe eğrilebildiği için **hiç iç kuvvet oluşmaz**; eğrilik:

$$\kappa = \frac{\alpha\,(\Delta T_b - \Delta T_t)}{h} = \frac{12 \times 10^{-6} \cdot (-10)}{0{,}2} = -6 \times 10^{-4}\ \text{m}^{-1}$$

Açıklık ortası sehimi $\kappa L^2 / 8 = -4{,}8$ mm'dir (yukarı doğru). Şimdi iki uçta da `Ry`'yi tutun: eğrilik engellenir ve açıklık boyunca sabit bir $M = EI\kappa = 2{,}45$ kNm momenti oluşur.

## Öngörülen yer değiştirme {#prescribed-displacement}

[Bir ucu ankastre diğer ucu kayıcı mesnetli kirişi](#propped-cantilever-uniform-load) yükü kaldırarak alın ve kayıcı mesnette `Dz = 10 mm` yer değiştirme öngörün (mesnet çökmesi). Bir konsolun ucunu $w$ kadar aşağı itmek için gereken tepki $R = 3EIw/L^3 = 0{,}567$ kN, ankastrelik momenti ise $RL = 3{,}40$ kNm'dir. Düzgün yayılı yükü geri eklediğinizde sonuçlar doğrusal olarak süperpoze olur.

## Kendi kontrolleriniz için ipuçları {#tips-for-your-own-checks}

- **Birim göstergesini** gözünüzün önünde tutun; uyuşmazlıkların çoğu birim hatasından kaynaklanır.
- Rijitlik matrisi yöntemini öğrenirken tek bir elemanı [teori kılavuzuyla](/tr/elements/beam) karşılaştırmak için **Rijitlik matrisi** penceresini kullanın.
- Kesin sayıları, yuvarlatılmış diyagram etiketlerinden değil, **Sonuçlar** sekmesinden ve imleci üzerine getirince çıkan ipuçlarından okuyun. Sonuçlar sekmesindeki **CSV olarak dışa aktar** veya **Kopyala** size mesnet tepkilerini de elektronik tabloya hazır biçimde verir.
- `4 · 10¹` yerine `40` görmek için Ayarlar'da **Sayı biçimi**'ni *Otomatik* yapın.
- Kontrol ettiğiniz bir modeli bir meslektaşınıza veya hocanıza iletmek için **Modeli paylaş**'ı kullanın.
