---
description: "Apa itu EduBeam: solver FEM gratis berbasis browser untuk balok, portal, dan rangka batang 2D. Apa yang bisa dan belum bisa dilakukan, untuk siapa, dan bagaimana panduan ini disusun."
---

<script setup>
import { VPTeamMembers } from 'vitepress/theme-without-fonts'

const members = [
  {
    avatar: 'https://www.github.com/janvorisek.png',
    name: 'Jan Voříšek',
    title: 'Pengembang utama & perancang produk',
    links: [
      { icon: 'github', link: 'https://github.com/janvorisek' },
      { icon: 'twitter', link: 'https://twitter.com/janvorisekdev' },
    ]
  },
  {
    avatar: 'https://www.github.com/bpatzak.png',
    name: 'Bořek Patzák',
    title: 'Solver FEM, pembuat aplikasi versi lama',
    links: [
      { icon: 'github', link: 'https://github.com/bpatzak' },
    ]
  }
]
</script>

# Pendahuluan

<Edubeam /> adalah alat **analisis struktur 2D** gratis berbasis browser untuk balok, portal, dan rangka batang. Anda menggambar struktur, menambahkan tumpuan dan beban, dan solver elemen hingga menghitung ulang semuanya begitu Anda mengubah apa pun. Tidak ada tombol *Hitung*, tanpa instalasi, dan tanpa akun.

[Buka EduBeam](https://run.edubeam.app/?lang=id){target="_blank"} di tab baru dan ikuti [Mulai cepat](/id/guide/quick-start).

![Portal tiga sendi di EduBeam: beban berwarna oranye, reaksi ungu, momen lentur merah, dan bentuk deformasi abu-abu](/screenshots/id/hero.webp)

## Kunjungan pertama {#your-first-visit}

Saat pertama kali membuka aplikasi, dialog sambutan menanyakan bagaimana Anda ingin memulai serta satuan dan sumbu yang Anda inginkan. Keduanya dapat diubah nanti di [Pengaturan](/id/essentials/units-settings).

![Dialog sambutan](/screenshots/id/welcome.webp){.shot-lg}

- **Ajak saya berkeliling** menunjukkan menu, urungkan dan ulangi, tombol tampilan, opsi tampilan, grid dan satuan, serta bilah bawah, satu per satu.
- **Gambar balok pertama Anda** adalah tugas terpandu tujuh langkah. Anda menggambar balok dengan mouse, memberinya tumpuan dan beban, lalu membaca hasilnya. Kartu kecil di sudut layar memberi tahu langkah berikutnya.
- **Buka contoh** membuka galeri model siap pakai.

Ketiganya juga ada di **menu ☰**, jadi Anda dapat kembali kapan saja.

![Gambar balok pertama Anda: kartu panduan tetap di sudut selama Anda bekerja](/screenshots/id/first-beam-task.webp)

## Apa yang dapat dilakukan {#what-it-does}

| Bidang | Kemampuan |
| --- | --- |
| **Struktur** | Balok bidang (x–z), balok menerus, portal, dan rangka batang yang tersusun dari joint dan elemen balok Timoshenko 2D. Sendi ujung mengubah batang apa pun menjadi batang rangka. |
| **Tumpuan** | Sendi, rol, jepit, jepit geser, dan setiap kombinasi lain dari `Dx`, `Dz`, `Ry` yang ditahan, dipilih lewat simbol. Tumpuan miring melalui sudut joint. Penurunan tumpuan. |
| **Beban** | Gaya dan momen joint, perpindahan tumpuan, beban garis merata dan trapesium, gaya dan momen terpusat di sepanjang batang, serta suhu merata atau bergradien. |
| **Penampang** | Pustaka material dan penampang (Eropa dan AS), ditambah editor poligon yang menghitung $A$, $I_y$, $I_z$, $I_{yz}$, sumbu utama, dan jari-jari girasi untuk bentuk apa pun. |
| **Hasil** | Bentuk deformasi, gaya normal **N**, gaya geser **V**, momen lentur **M**, reaksi, perpindahan joint, gaya ujung elemen, dan matriks kekakuan elemen. |
| **Analisis** | Analisis statis linear dengan satu kasus beban. Hasilnya eksak untuk model linear, jadi mesh tidak perlu diperhalus. Jika struktur tidak dapat dihitung, EduBeam menjelaskan alasannya dan menganimasikan bagaimana struktur dapat bergerak. |
| **File** | Simpan dan buka proyek sebagai JSON, bagikan seluruh model sebagai tautan, ekspor gambar sebagai PNG atau SVG dan hasil sebagai CSV. Model yang baru saja diganti tetap disimpan sehingga dapat dikembalikan. Semua data tetap di perangkat Anda. |
| **Satuan** | SI atau US customary dengan satu klik, atau setiap besaran secara terpisah. Sumbu x ke kanan, z ke bawah, atau x ke kanan, y ke atas. |

## Apa yang (belum) dapat dilakukan {#what-it-does-not-do-yet}

Mengetahui batasannya sejak awal menghemat waktu:

- **Hanya 2D.** Tidak ada perilaku di luar bidang, tidak ada portal 3D.
- **Hanya statis linear.** Tidak ada efek orde kedua (P–Δ), tekuk, dinamika, atau plastisitas.
- **Satu kasus beban.** Tidak ada kombinasi beban atau envelope. Modelkan setiap kasus secara terpisah dan simpan masing-masing sebagai file atau tautan berbagi tersendiri.
- **Tanpa berat sendiri.** Berikan sebagai beban garis jika diperlukan.
- **Tanpa pemeriksaan desain.** EduBeam memberikan gaya dalam dan perpindahan; pemeriksaan sesuai standar menjadi tugas Anda.

Jika ada fitur yang Anda butuhkan, [buka issue](https://github.com/janvorisek/edubeam/issues).

<ElementariumPromo placement="introduction" />

## Untuk siapa? {#who-is-it-for}

- **Mahasiswa** yang mempelajari mekanika teknik dan menginginkan umpan balik instan untuk perhitungan manual. Lihat [Memeriksa hasil secara manual](/id/guide/verification).
- **Dosen** yang memperagakan secara langsung di proyektor bagaimana tumpuan, sendi, dan beban mengubah gaya dalam, dalam salah satu dari 16 bahasa. Lihat [Mengajar dengan EduBeam](/id/guide/teaching).
- **Insinyur** yang ingin memeriksa cepat sebelum membuka program desktop yang lebih berat.

## Susunan panduan ini {#how-this-guide-is-organised}

1. **Memulai.** Halaman ini, [Mulai cepat 10 menit](/id/guide/quick-start), dan [Contoh](/id/examples/) siap pakai.
2. **Tutorial.** Model lengkap dari awal hingga akhir, diperiksa secara manual: [portal tiga sendi](/id/tutorials/three-hinged-frame) dan [rangka batang bidang](/id/tutorials/truss).
3. **Pemodelan.** Satu halaman untuk setiap komponen: [antarmuka pengguna](/id/essentials/user-interface), [joint & tumpuan](/id/essentials/nodes-supports), [elemen, material & penampang](/id/essentials/elements), [beban](/id/essentials/loads), serta [satuan & pengaturan](/id/essentials/units-settings).
4. **Hasil.** Cara [membaca diagram dan tabel](/id/essentials/results) dan cara [memeriksanya](/id/guide/verification).
5. **File & berbagi.** [Proyek, tautan berbagi, ekspor gambar dan CSV](/id/essentials/import-export), serta [mengajar dengan EduBeam](/id/guide/teaching).
6. **Referensi.** [Keyboard, mouse & sentuh](/id/reference/shortcuts), [pemecahan masalah](/id/reference/troubleshooting), dan [FAQ](/id/faq/).
7. **Manual teori.** [Konvensi tanda](/id/elements/conventions) dan formulasi elemen [balok](/id/elements/beam) serta [rangka batang](/id/elements/truss).

Ikon **?** di aplikasi membuka halaman panduan yang sesuai dalam bahasa Anda.

## Bahasa {#languages}

Antarmuka tersedia dalam English, Bahasa Indonesia, Čeština, Deutsch, Español, Français, Italiano, Polski, Português, Tiếng Việt, Русский, Türkçe, Українська, हिन्दी, ไทย dan 汉语. EduBeam memilih bahasa sesuai browser Anda. Ubah di **Pengaturan → Bahasa & Wilayah**, atau buka aplikasi dengan parameter `?lang=`, misalnya [run.edubeam.app/?lang=id](https://run.edubeam.app/?lang=id){target="_blank"}.

## Penulis & penghargaan {#authors-credits}

<Edubeam /> dipimpin oleh [Jan Voříšek](https://github.com/janvorisek), pengelola dan perancang produk di balik edisi web modern. Versi browser dikembangkan secara independen dari CTU. EduBeam desktop asli untuk Windows dan Linux dibuat oleh [Bořek Patzák](http://ksm.fsv.cvut.cz/~bp/), [Jan Stránský](https://mech.fsv.cvut.cz/~stransky/en/), dan [Vít Šmilauer](https://mech.fsv.cvut.cz/~smilauer/) di Departemen Mekanika, [CTU Praha – Fakultas Teknik Sipil](https://www.fsv.cvut.cz/en). Solvernya adalah pustaka open-source [ts-fem](https://github.com/janvorisek/ts-fem).

<VPTeamMembers size="small" :members="members" />

## Berkontribusi {#contribute}

- Laporkan perilaku yang membingungkan atau bug sebagai [issue di GitHub](https://github.com/janvorisek/edubeam/issues).
- Perbaiki dokumentasi atau terjemahan ini dengan mengedit file di `docs/` dan membuka pull request.
- Bagikan EduBeam kepada teman kuliah dan rekan kerja.
