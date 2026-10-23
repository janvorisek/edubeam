---
description: "Tek tıkla EduBeam'de açılan hazır, çözülmüş kiriş, çerçeve ve kafes sistem modelleri; ayrıca önerilen alıştırmalar ve adım adım çözümlü eğitimler."
---

# Örnekler

Aşağıdaki her kart canlı, çözülmüş bir modeldir. Birine tıkladığınızda model, düzenlemeye hazır tüm kurulumuyla <Edubeam /> uygulamasında açılır; ardından bir düğümü sürükleyin, bir yükü değiştirin veya bir mafsalı işaretleyin ve diyagramların nasıl değiştiğini izleyin.

<br>

<FeatureStructures />

Aynı modeller uygulamada **☰ → Örnekler** altında da bulunur; [run.edubeam.app/?panel=examples](https://run.edubeam.app/?panel=examples&lang=tr){target="_blank"} bağlantısı bu galeriyi doğrudan açar.

## Önerilen alıştırmalar {#suggested-exercises}

- **Hiperstatik kiriş**: ankastre uçtaki `Ry` işaretini kaldırarak kirişi basit mesnetli hâle getirin. Açıklık ortasındaki moment ne kadar artıyor?
- **Konsol kiriş**: uç sehimini $FL^3/3EI$ ile karşılaştırın ([Sonuçların elle kontrolü](/tr/guide/verification) sayfasına bakın), ardından *Kesitler* sekmesinde $I_y$'yi yarıya indirin.
- **Pratt kafes kirişi**: bu örnekte düğüm noktaları rijittir. Gerçek bir kafes sistem elde etmek için her çubukta iki uç mafsalını da işaretleyin ve çubuk kuvvetlerini karşılaştırın. Şimdi bir diyagonali kaldırın: kafes sistem hâlâ ayakta duruyor mu?
- **Üç açıklıklı sürekli kiriş**: kiriş yalnızca uçlarından mesnetlidir. Sürekli kiriş elde etmek için iç düğümler B ve C'de `Dz`'yi işaretleyin ve mesnetlerin üzerinde negatif momentlerin nasıl oluştuğunu izleyin.
- **Portal çerçeve**: kiriş-kolon birleşimlerini mafsallı modellemek için kirişin iki uç mafsalını da işaretleyin ya da sağ mesneti kayıcı mesnet yerine mafsallı mesnet yapın.
- **Sıcaklık yüklemesi**: iki mesnette de `Dx`'i tutun ve normal kuvvetin nasıl oluştuğunu izleyin.

## Çözümlü eğitimler {#worked-tutorials}

- [Üç mafsallı çerçeve](/tr/tutorials/three-hinged-frame): mesnet tepkileri, N, V ve M el hesabıyla kontrol ediliyor.
- [Düzlem kafes sistem](/tr/tutorials/truss): düğüm noktası yöntemi, kesim (Ritter) yöntemi ve sıfır kuvvetli çubuk.

## Örnek katkısında bulunun {#contribute-an-example}

Derste işe yarayan iyi bir modeliniz mi var? Bağlantısını [GitHub Discussions](https://github.com/janvorisek/edubeam/discussions) veya [Twitter](https://twitter.com/EdubeamApp) üzerinden paylaşın, galeriye ekleyelim.
