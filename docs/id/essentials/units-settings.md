---
description: "Pilih bahasa, satuan SI atau US customary, format angka, sumbu y ke atas atau z ke bawah, pengaturan tampilan dan kontrol, serta lihat apa yang disimpan EduBeam di browser Anda."
---

# Satuan & pengaturan

Ada tiga cara membuka pengaturan:

- tab **Pengaturan** di atas tampilan, yang menampilkannya dalam ukuran penuh;
- **label satuan** di kanan bawah tampilan, yang membukanya pada *Bahasa & Wilayah*;
- **Pengaturan lain** di bawah opsi tampilan, yang membukanya pada *Pengaturan tampilan*.

Pengaturan disimpan di browser Anda dan tetap ada setelah halaman dimuat ulang. **Reset pengaturan** mengembalikan bawaan tampilan, format angka, sumbu, tombol geser, dan satuan untuk wilayah Anda; bahasa tetap dipertahankan.

## Bahasa & Wilayah {#language-locale}

![Pengaturan → Bahasa & Wilayah](/screenshots/id/settings-language.webp)

**Bahasa.** 17 bahasa antarmuka. Anda juga dapat membuka aplikasi dengan `?lang=<code>`: `en`, `cs`, `de`, `fr`, `es`, `pt`, `pl`, `cn`, `th`, `uk`, `ru`, `tr`, `hi`, `vi`, `it`, `id`, `ja`.

**Format angka.** Cara nilai hasil ditulis: *Otomatis*, *Ilmiah* (bawaan), atau *Teknik*. Lihat [Format angka](/id/essentials/results#number-format).

**Sistem koordinat.** *x ke kanan, z ke bawah* (bawaan) atau *x ke kanan, y ke atas*. Opsi y ke atas membalik tanda nilai vertikal dan sudut tumpuan serta mengganti nama sumbu di setiap input, tabel, tooltip, dan ekspor. Model dan file yang disimpan tidak berubah. Lihat [Sumbu y ke atas](/id/elements/conventions#y-up-axes).

![Portal tiga sendi dengan sumbu y ke atas: indikator sumbu di sudut menunjukkan y ke atas](/screenshots/id/settings-y-up.webp){.shot-lg}

**Sistem satuan.** *SI (metrik)* atau *US customary (imperial)* mengatur semua satuan di bawah dalam satu langkah. Mengubah salah satu satuan sesudahnya membuat sistem ditampilkan sebagai *Kustom*. Pada kunjungan pertama Anda memilihnya di dialog sambutan; sebelum itu, EduBeam menebak US customary hanya jika browser diatur ke lokal AS *dan* komputer berada di zona waktu AS.

**Satuan.** Setiap besaran memiliki satuannya sendiri. Input, tabel, tooltip, dan label diagram semuanya memakai satuan yang dipilih, dan mengubah satuan mengonversi nilai yang ditampilkan. Model itu sendiri disimpan dalam SI, jadi tidak ada yang hilang saat berganti bolak-balik, dan tautan berbagi membuka model yang sama dalam satuan apa pun.

| Besaran | Pilihan | SI | US customary |
| --- | --- | --- | --- |
| Panjang (geometri) | m, cm, mm, ft, in | m | ft |
| Dimensi penampang | m, cm, mm, ft, in | m | in |
| Perpindahan | m, cm, mm, ft, in | m | in |
| Luas | m², cm², mm², ft², in² | m² | in² |
| Momen inersia | m⁴, cm⁴, mm⁴, ft⁴, in⁴ | m⁴ | in⁴ |
| Massa | kg, lb | kg | lb |
| Gaya | N, kN, MN, kgf, Tonf, lbf, kip | kN | kip |
| Momen lentur | Nmm, Nm, kNm, MNm, Tonf·m, lbf·in, lbf·ft, kip·in, kip·ft | kNm | kip·ft |
| Tekanan (E, G) | Pa, kPa, MPa, GPa, ksc, psi, ksi, psf, ksf | MPa | ksi |
| Suhu | °C, °F | °C | °F |

Beban garis memakai *gaya / panjang* dari satuan yang dipilih (kN/m dalam SI, kip/ft dalam US customary), dan massa jenis memakai *massa / panjang³*. Koefisien muai panas mengikuti satuan suhu (1/K atau 1/°F). Beban suhu adalah *perubahan* suhu, jadi 10 °C sama dengan 18 °F. Rotasi selalu dalam radian.

Tonf adalah ton-gaya metrik (1000 kgf), bukan short ton AS. Satuan US customary dikonversi dengan definisi eksaknya (1 ft = 0,3048 m, 1 kip = 4448,2216 N). Dalam feet, ketik nilai desimal seperti `5,5`; penggaris dan crosshair menampilkan feet dan inci (5′-6″).

## Pengaturan tampilan {#viewer-settings}

![Pengaturan → Pengaturan tampilan, dengan pratinjau langsung di kanan](/screenshots/id/settings-viewer.webp)

**Pratinjau tampilan** di samping pengaturan menampilkan model kecil yang bereaksi terhadap setiap perubahan. Label di bawahnya memilih hasil yang ditampilkan, dan mengklik sebuah warna memindahkan pratinjau ke hasil tersebut.

**Grid**
- **Tampilkan grid** (<kbd>G</kbd>) menggambar grid dan penggaris.
- **Snap ke grid** (<kbd>S</kbd>) membuat joint yang Anda tempatkan atau seret menempel pada jarak grid.
- **Tampilkan crosshair** menandai posisi kursor pada penggaris, sehingga Anda dapat membaca koordinatnya (hanya dengan mouse).
- **Jarak snap grid** adalah jarak dalam satuan panjang: bawaan 0,1 m, atau 0,5 ft dalam satuan AS. Saat Anda beralih antara satuan metrik dan AS, jarak yang masih bernilai bawaan berpindah ke bawaan sistem lain; jarak yang Anda atur sendiri tetap dipertahankan.

**Ukuran**
- **Skala hasil** (8–120 px, bawaan 48) adalah tinggi di layar dari ordinat diagram atau lendutan terbesar. Setiap diagram diskalakan terhadap nilai maksimumnya sendiri, jadi ini murni visual; ubah bila diagram terlalu besar atau terlalu kecil.
- **Ukuran tumpuan** (50–150 %) dan **Ukuran huruf** (10–20 px). Huruf yang lebih besar membantu di proyektor.

**Orientasi label hasil**: *Tegak lurus diagram* (label mengikuti diagram) atau *Selalu horizontal*.

**Pemeriksaan model**
- **Tunjukkan bagaimana struktur tidak stabil dapat bergerak** menggambar garis putus-putus mekanisme.
- **Animasikan gerakannya** menggerakkannya bolak-balik.

**Warna**: warna terpisah untuk joint, elemen, beban, bentuk deformasi, gaya normal, gaya geser, momen lentur, dan reaksi. Bawaan: N biru, V hijau, M merah, reaksi ungu, beban oranye.

## Kontrol & Pintasan {#controls-shortcuts}

**Geser tampilan dengan** mengatur tombol mouse yang menggeser kanvas: *Roda mouse atau tombol kanan* (bawaan), *Roda mouse*, atau *Tombol kanan*. Daftar lengkap pintasan ada di halaman [Keyboard, mouse & sentuh](/id/reference/shortcuts).

## Yang disimpan di browser Anda {#what-is-stored-in-your-browser}

Selain pengaturan, EduBeam menyimpan di local storage browser:

- **model saat ini**, disimpan setelah setiap perubahan, sehingga memuat ulang tab atau membuka kembali aplikasi akan memulihkannya;
- **Struktur terbaru**: 10 model terakhir yang Anda hapus atau ganti.

Keduanya berlaku per browser dan per perangkat, dan menghapus data situs akan menghapusnya. Gunakan [Simpan proyek atau Bagikan model](/id/essentials/import-export) untuk menyimpan model atau memindahkannya ke tempat lain.
