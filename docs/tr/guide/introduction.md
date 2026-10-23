---
description: "EduBeam nedir: 2B kiriş, çerçeve ve kafes sistemler için tarayıcıda çalışan ücretsiz bir sonlu elemanlar programı. Neler yapıp yapmadığı, kimler için olduğu ve kılavuzun düzeni."
---

<script setup>
import { VPTeamMembers } from 'vitepress/theme-without-fonts'

const members = [
  {
    avatar: 'https://www.github.com/janvorisek.png',
    name: 'Jan Voříšek',
    title: 'Baş geliştirici ve ürün tasarımcısı',
    links: [
      { icon: 'github', link: 'https://github.com/janvorisek' },
      { icon: 'twitter', link: 'https://twitter.com/janvorisekdev' },
    ]
  },
  {
    avatar: 'https://www.github.com/bpatzak.png',
    name: 'Bořek Patzák',
    title: 'Sonlu elemanlar çözücüsü, eski uygulamanın yazarı',
    links: [
      { icon: 'github', link: 'https://github.com/bpatzak' },
    ]
  }
]
</script>

# Giriş

<Edubeam />, kirişler, çerçeveler ve kafes sistemler için ücretsiz, tarayıcıda çalışan bir **2B yapı analizi** aracıdır. Yapıyı çizer, mesnetleri ve yükleri eklersiniz; sonlu elemanlar çözücüsü siz herhangi bir şeyi değiştirdiğiniz anda her şeyi yeniden hesaplar. *Çöz* düğmesi yok, kurulum yok, hesap yok.

EduBeam'i yeni bir sekmede [başlatın](https://run.edubeam.app/?lang=tr){target="_blank"} ve [Hızlı başlangıç](/tr/guide/quick-start) adımlarını izleyin.

![EduBeam'de üç mafsallı bir çerçeve: yükler turuncu, mesnet tepkileri mor, eğilme momenti kırmızı ve deforme şekil gri](/screenshots/tr/hero.webp)

## İlk ziyaretiniz {#your-first-visit}

Uygulamayı ilk açtığınızda bir karşılama penceresi nasıl başlamak istediğinizi ve hangi birimleri ve eksenleri kullanmak istediğinizi sorar. İkisini de daha sonra [Ayarlar](/tr/essentials/units-settings) bölümünden değiştirebilirsiniz.

![Karşılama penceresi](/screenshots/tr/welcome.webp){.shot-lg}

- **Beni gezdir** menüyü, geri al ve yinele düğmelerini, görüntüleyici düğmelerini, görünüm seçeneklerini, ızgarayı ve birimleri ve alt çubuğu tek tek tanıtır.
- **İlk kirişinizi çizin** yedi adımlı, rehberli bir görevdir. Fareyle bir kiriş çizer, mesnetler, yükler ve sonuçları okursunuz. Köşedeki küçük bir kart size sıradaki adımı söyler.
- **Bir örnek açın** hazır modellerin bulunduğu galeriyi açar.

Üçü de **☰ menüsünde** de bulunur, böylece onlara istediğiniz zaman geri dönebilirsiniz.

![İlk kirişinizi çizin: siz çalışırken rehber kartı köşede kalır](/screenshots/tr/first-beam-task.webp)

## EduBeam neler yapar? {#what-it-does}

| Alan | Olanaklar |
| --- | --- |
| **Yapılar** | Düğümlerden ve 2B Timoshenko kiriş elemanlarından oluşan düzlem (x–z) kirişler, sürekli kirişler, çerçeveler ve kafes sistemler. Uç mafsalları herhangi bir çubuğu kafes çubuğuna dönüştürür. |
| **Mesnetler** | Sabit mesnet, kayıcı mesnet, ankastre mesnet, kayar ankastre ve tutulu `Dx`, `Dz`, `Ry` serbestlik derecelerinin diğer tüm kombinasyonları; hepsi sembolüyle seçilir. Düğüm açısıyla eğik mesnetler. Mesnet çökmeleri. |
| **Yükler** | Düğüm kuvvetleri ve momentleri, öngörülen yer değiştirmeler, düzgün ve trapez yayılı yükler, çubuk boyunca tekil kuvvetler ve momentler, düzgün veya kesit yüksekliği boyunca değişen sıcaklık. |
| **Kesitler** | Malzeme ve kesit kütüphaneleri (Avrupa ve ABD) ve her şekil için $A$, $I_y$, $I_z$, $I_{yz}$, asal eksenleri ve atalet yarıçaplarını hesaplayan bir çokgen düzenleyici. |
| **Sonuçlar** | Deforme şekil, normal kuvvet **N**, kesme kuvveti **V**, eğilme momenti **M**, mesnet tepkileri, düğüm yer değiştirmeleri, çubuk uç kuvvetleri ve eleman rijitlik matrisleri. |
| **Analiz** | Tek yükleme durumuyla doğrusal statik analiz. Sonuçlar doğrusal model için kesindir, bu yüzden ağı sıklaştırmaya gerek yoktur. Bir yapı çözülemediğinde EduBeam nedenini söyler ve yapının nasıl hareket edebildiğini canlandırarak gösterir. |
| **Dosyalar** | Projeleri JSON olarak kaydetme ve açma, bütün bir modeli bağlantıyla paylaşma, çizimi PNG veya SVG, sonuçları CSV olarak dışa aktarma. Yakın zamanda yerine başkası açılan modeller saklanır, böylece onları geri alabilirsiniz. Her şey kendi cihazınızda kalır. |
| **Birimler** | Tek tıkla SI veya ABD (emperyal) birimleri ya da her büyüklük için ayrı birim. Eksenler ya x sağa, z aşağı ya da x sağa, y yukarı. |

## EduBeam'in (henüz) yapmadıkları {#what-it-does-not-do-yet}

Sınırları baştan bilmek zaman kazandırır:

- **Yalnızca 2B.** Düzlem dışı davranış yok, 3B çerçeve yok.
- **Yalnızca doğrusal statik.** İkinci mertebe (P–Δ) etkileri, burkulma, dinamik ve plastisite yok.
- **Tek yükleme durumu.** Yük kombinasyonları ve zarflar yok. Her durumu ayrı modelleyin ve her birini ayrı bir dosya ya da paylaşım bağlantısı olarak kaydedin.
- **Zati ağırlık yok.** Gerekiyorsa yayılı yük olarak uygulayın.
- **Boyutlandırma kontrolleri yok.** EduBeam size iç kuvvetleri ve yer değiştirmeleri verir; yönetmelik kontrolleri size kalır.

Eksik bir özellik sizin için önemliyse [bir issue açın](https://github.com/janvorisek/edubeam/issues).

<ElementariumPromo placement="introduction" />

## Kimler için? {#who-is-it-for}

- El hesaplarına anında geri bildirim isteyen, yapı mekaniği öğrenen **öğrenciler**. Bkz. [Sonuçların elle kontrolü](/tr/guide/verification).
- Mesnetlerin, mafsalların ve yüklerin iç kuvvetleri nasıl değiştirdiğini projeksiyonda canlı olarak, 17 dilden herhangi birinde gösteren **öğretim elemanları**. Bkz. [EduBeam ile öğretim](/tr/guide/teaching).
- Daha kapsamlı bir masaüstü programı açmadan önce hızlı bir sağlama yapmak isteyen **mühendisler**.

## Bu kılavuz nasıl düzenlenmiştir? {#how-this-guide-is-organised}

1. **Başlarken.** Bu sayfa, [10 dakikalık Hızlı başlangıç](/tr/guide/quick-start) ve hazır [Örnekler](/tr/examples/).
2. **Eğitimler.** Baştan sona, elle kontrol edilmiş eksiksiz modeller: bir [üç mafsallı çerçeve](/tr/tutorials/three-hinged-frame) ve bir [düzlem kafes sistem](/tr/tutorials/truss).
3. **Modelleme.** Her yapı taşı için bir sayfa: [kullanıcı arayüzü](/tr/essentials/user-interface), [düğümler ve mesnetler](/tr/essentials/nodes-supports), [elemanlar, malzemeler ve kesitler](/tr/essentials/elements), [yükler](/tr/essentials/loads) ve [birimler ve ayarlar](/tr/essentials/units-settings).
4. **Sonuçlar.** [Diyagramları ve tabloları nasıl okuyacağınız](/tr/essentials/results) ve [onları nasıl doğrulayacağınız](/tr/guide/verification).
5. **Dosyalar ve paylaşım.** [Projeler, paylaşım bağlantıları, görüntü ve CSV dışa aktarma](/tr/essentials/import-export) ve [EduBeam ile öğretim](/tr/guide/teaching).
6. **Başvuru.** [Klavye, fare ve dokunmatik](/tr/reference/shortcuts), [sorun giderme](/tr/reference/troubleshooting) ve [SSS](/tr/faq/).
7. **Teori kılavuzu.** [İşaret kabulü](/tr/elements/conventions) ve [kiriş](/tr/elements/beam) ile [kafes çubuğu](/tr/elements/truss) eleman formülasyonları.

Uygulamadaki **?** simgeleri bu kılavuzun ilgili sayfasını sizin dilinizde açar.

## Diller {#languages}

Arayüz şu dillerde kullanılabilir: English, Bahasa Indonesia, Čeština, Deutsch, Español, Français, Italiano, Polski, Português, Tiếng Việt, Русский, Türkçe, Українська, हिन्दी, 日本語, ไทย ve 汉语. EduBeam dili tarayıcınızdan alır. Dili **Ayarlar → Dil ve bölge** bölümünden değiştirebilir ya da uygulamayı `?lang=` parametresiyle açabilirsiniz, örneğin [run.edubeam.app/?lang=tr](https://run.edubeam.app/?lang=tr){target="_blank"}.

## Yazarlar ve katkıda bulunanlar {#authors-credits}

<Edubeam /> projesini, modern web sürümünün bakımını yapan ve ürün tasarımını üstlenen [Jan Voříšek](https://github.com/janvorisek) yönetir. Tarayıcı sürümü Prag Çek Teknik Üniversitesi'nden (ČVUT) bağımsız olarak geliştirilmektedir. Windows ve Linux için orijinal masaüstü EduBeam, [ČVUT Prag – İnşaat Fakültesi](https://www.fsv.cvut.cz/en) Mekanik Bölümü'nde [Bořek Patzák](http://ksm.fsv.cvut.cz/~bp/), [Jan Stránský](https://mech.fsv.cvut.cz/~stransky/en/) ve [Vít Šmilauer](https://mech.fsv.cvut.cz/~smilauer/) tarafından geliştirilmiştir. Çözücü, açık kaynaklı [ts-fem](https://github.com/janvorisek/ts-fem) kütüphanesidir.

<VPTeamMembers size="small" :members="members" />

## Katkıda bulunun {#contribute}

- Kafa karıştırıcı davranışları veya hataları bir [GitHub issue](https://github.com/janvorisek/edubeam/issues) olarak bildirin.
- `docs/` klasöründeki dosyaları düzenleyip bir pull request açarak bu dokümantasyonu veya çevirileri geliştirin.
- EduBeam'i sınıf arkadaşlarınızla ve meslektaşlarınızla paylaşın.
