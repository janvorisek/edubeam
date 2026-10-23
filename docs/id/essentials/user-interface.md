---
description: "Tur antarmuka EduBeam: menu utama, tampilan dan opsi tampilannya, navigasi dan pemilihan, tab, bilah bawah, dan jendela mengambang."
---

# Antarmuka pengguna

<Edubeam /> memiliki tiga area: **bilah aplikasi** di atas, **tampilan** di tengah tempat Anda menggambar, dan **bilah bawah** dengan tabel untuk setiap jenis objek. Pahami apa yang ada di mana, dan bagian lain panduan ini akan mudah diikuti.

![Bagian-bagian antarmuka, bernomor sesuai daftar di bawah](/screenshots/id/ui-overview.webp)

1. **Menu ☰**: buka, simpan, bagikan, dan ekspor; contoh dan tur terpandu.
2. **Tombol bilah aplikasi**: Hapus model dan Bagikan model.
3. **Urungkan / Ulangi** untuk setiap perubahan pada model.
4. **Tombol tampilan**: pusatkan, sesuaikan dengan layar, dan tombol opsi tampilan.
5. **Opsi tampilan**: hasil dan bagian model mana yang digambar.
6. **Grid, snap, crosshair, dan satuan.**
7. **Tab bilah bawah**: Joint, Elemen, Beban, Material, Penampang, Hasil.
8. **Tabel** dari tab yang terbuka, tempat setiap nilai dapat diedit.

::: tip Ikuti tur
**☰ → Ajak saya berkeliling** menunjukkan bagian-bagian ini langsung di aplikasi, satu per satu.
:::

![Ajak saya berkeliling, pada langkah opsi tampilan](/screenshots/id/tour.webp)

## Bilah aplikasi {#app-bar}

| Kontrol | Fungsi |
| --- | --- |
| **Menu ☰** | Menu utama, lihat di bawah. |
| **Hapus model** | Menghapus semua joint, elemen, dan beban setelah konfirmasi. Dua kotak centang juga dapat menghapus material dan penampang. <kbd>Ctrl</kbd>+<kbd>Z</kbd> mengembalikan model, dan model tetap tersimpan di Struktur terbaru. |
| **Bagikan model** | Membuka [dialog berbagi](/id/essentials/import-export#share-a-link) dengan tautan yang memuat seluruh model. |
| **Apa yang baru?** | Catatan rilis. Catatan ini juga terbuka sendiri sekali setelah pembaruan. |
| **Dokumentasi** / GitHub | Panduan ini dan kode sumbernya. |

Di ponsel, hanya menu ☰ dan Dokumentasi yang muat; selebihnya ada di menu.

### Menu ☰ {#the-☰-menu}

![Menu ☰](/screenshots/id/ui-app-menu.webp){.shot-xs}

| Item | Fungsi |
| --- | --- |
| **Buka proyek** / **Simpan proyek** | Membuka atau mengunduh file `project.json` (<kbd>Ctrl</kbd>+<kbd>O</kbd> / <kbd>Ctrl</kbd>+<kbd>S</kbd>). |
| **Struktur terbaru** | 10 model terakhir yang Anda hapus atau ganti, siap dipulihkan. |
| **Ekspor gambar** | Menyimpan gambar sebagai PNG atau SVG, atau menyalinnya (<kbd>Ctrl</kbd>+<kbd>P</kbd>). |
| **Bagikan model** | Sama dengan tombol di bilah aplikasi. |
| **Contoh** | Galeri model siap pakai. |
| **Gambar balok pertama Anda** | Tugas terpandu tujuh langkah. |
| **Ajak saya berkeliling** | Tur antarmuka. |
| **Hapus model** | Sama dengan tombol di bilah aplikasi. |

Bagian bawah menu menampilkan versi aplikasi dan tanggal rilisnya.

## Tampilan {#viewer}

Kanvas adalah tempat Anda menggambar dan memeriksa model. Bagian lain aplikasi mengikuti apa yang Anda pilih di sini.

### Tombol di kanvas {#buttons-on-the-canvas}

- **Kiri atas:** **Urungkan** dan **Ulangi** (<kbd>Ctrl</kbd>+<kbd>Z</kbd> / <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Z</kbd>). Setiap perubahan model, termasuk menambah, mengedit, menyeret, menghapus, dan menghapus seluruh model, dapat diurungkan.
- **Kanan atas:** **Pusatkan model** (<kbd>C</kbd>), **Sesuaikan dengan layar** (<kbd>F</kbd>), dan tombol ⚙ yang menampilkan atau menyembunyikan opsi tampilan. Di layar sentuh juga ada **Pilih dengan kotak**.
- **Kanan bawah:** **G** menampilkan/menyembunyikan grid, **S** mengaktifkan/menonaktifkan snap ke grid, tombol crosshair menampilkan posisi kursor pada penggaris, dan **label satuan** membuka pengaturan pada *Bahasa & Wilayah*.

### Opsi tampilan {#display-options}

![Tombol tampilan dan opsi tampilan](/screenshots/id/ui-display-settings.webp){.shot-lg}

Dua baris kotak centang, terbuka secara bawaan:

- **Hasil:** *Bentuk deformasi*, *N (x)*, *V<sub>z</sub> (x)*, *M<sub>y</sub> (x)*, *Reaksi*. Bentuk deformasi, M, dan Reaksi sudah dicentang sejak awal.
- **Model:** *Tumpuan*, *Beban*, *Label joint*, *Label elemen*.

**Pengaturan lain** membuka [pengaturan](/id/essentials/units-settings) lengkap pada *Pengaturan tampilan*.

### Navigasi {#navigating}

| Aksi | Mouse | Sentuh |
| --- | --- | --- |
| Zoom | Roda mouse (ke arah kursor), <kbd>Ctrl</kbd>+<kbd>=</kbd> / <kbd>Ctrl</kbd>+<kbd>-</kbd> | Cubit |
| Geser tampilan | Seret dengan tombol **tengah atau kanan** (lihat *Pengaturan → Kontrol & Pintasan*) | Seret dengan satu jari |
| Sesuaikan / pusatkan | <kbd>F</kbd> / <kbd>C</kbd> atau tombol di kanan atas | Tombol di kanan atas |

### Memilih dan mengedit {#selecting-and-editing}

**Klik** joint, elemen, beban, atau garis dimensi untuk memilihnya. Sebuah panel terbuka di sampingnya dengan detail dan aksi yang sesuai: tambah beban, atur tumpuan, edit, tampilkan matriks kekakuan, hapus. Mengklik joint juga memindahkan bilah bawah ke tab Joint.

<div class="shots">

![Joint: tambah beban, atur tumpuan, tetapkan perpindahan](/screenshots/id/ui-node-menu.webp)

![Elemen: edit, tambah beban, matriks kekakuan](/screenshots/id/ui-element-menu.webp)

</div>

- **Seret di kanvas kosong** untuk menggambar persegi panjang seleksi. Semua yang ada di dalamnya terpilih: joint, elemen, beban, dan garis dimensinya. Tekan <kbd>Delete</kbd> untuk menghapus semuanya, atau <kbd>Ctrl</kbd>+<kbd>C</kbd> / <kbd>Ctrl</kbd>+<kbd>V</kbd> untuk menyalinnya ke tempat lain.
- **Seret joint** untuk memindahkannya. Saat snap aktif, joint menempel ke grid. Elemen yang tersambung beserta bebannya ikut berpindah.
- **Klik ganda beban** untuk mengeditnya.
- **Arahkan kursor** ke objek apa pun untuk melihat tooltip. Joint menampilkan perpindahan dan rotasinya, elemen menampilkan material dan penampangnya, beban menampilkan nilainya. Di layar sentuh, ketuk saja: detail yang sama muncul di panel seleksi.

![Mengarahkan kursor ke joint menampilkan perpindahan dan rotasinya](/screenshots/id/ui-hover.webp){.shot-sm}

**Klik kanan pada kanvas** (atau tekan lama di layar sentuh) untuk membuka menu kanvas. Tahan <kbd>Ctrl</kbd> saat memilih *Tambah joint* atau *Tambah elemen* untuk menempatkannya dengan mouse alih-alih dialog. Di atas elemen, menu juga menawarkan *Dimensi elemen*.

![Menu kanvas](/screenshots/id/ui-canvas-menu.webp){.shot-sm}

Semua pintasan ada di halaman [Keyboard, mouse & sentuh](/id/reference/shortcuts).

### Saat model tidak dapat dihitung {#when-the-model-cannot-be-solved}

Pesan muncul di kiri atas tampilan:

- *Belum ada material yang didefinisikan* / *Belum ada penampang yang didefinisikan*, dengan tombol **Tambah baru**.
- Label biru kecil **Perlu tumpuan** selama model memang belum selesai.
- **Pesan merah** jika ada yang salah, dengan **Tampilkan detail** yang mencantumkan setiap masalah.

Jika struktur masih dapat bergerak, EduBeam menggerakkannya sebagai garis putus-putus dan melingkari joint atau sendi penyebabnya. Arahkan kursor ke pesan untuk melihat gerakannya lagi, atau gunakan tombol mata untuk menyembunyikannya.

![Portal dengan sendi di B dan C adalah mekanisme: EduBeam menunjukkan cara bergeraknya](/screenshots/id/ui-mechanism.webp)

![Tampilkan detail mencantumkan setiap masalah beserta petunjuknya](/screenshots/id/ui-diagnostics.webp){.shot-lg}

[Pemecahan masalah](/id/reference/troubleshooting) menjelaskan setiap pesan.

## Bilah bawah {#bottom-bar}

Enam tab, masing-masing dengan toolbar dan tabel yang dapat diedit. Tab menunjukkan berapa banyak objek dari setiap jenis yang ada di model. Tanda **?** di kanan menjelaskan tab yang terbuka, begitu pula **?** di samping beberapa judul kolom. Seret strip tab ke atas atau ke bawah untuk mengubah ukuran bilah, atau perkecil dengan tombol di kanan.

| Tab | Toolbar | Tabel |
| --- | --- | --- |
| **Joint** | Tambah joint (dialog), Tambah joint (mouse) | Label, koordinat, **DOF yang ditahan** (simbol tumpuan, Dx, Dz, Ry, sudut tumpuan α), beban, edit, hapus |
| **Elemen** | Tambah elemen (dialog), Tambah elemen (mouse) | Label, tipe, joint (dengan tombol tukar), material, penampang, **Sendi ujung**, beban, matriks kekakuan, hapus |
| **Beban** | Tambah beban joint, Tambah beban elemen | Tipe, bekerja pada, komponen yang dapat diedit, edit, hapus |
| **Material** | Tambah material, Pustaka material | Label, E, G, α<sub>T</sub>, hapus |
| **Penampang** | Tambah penampang, Pustaka penampang, Penampang poligon | Bentuk, label, A, I<sub>y</sub>, h, k, edit bentuk, hapus |
| **Hasil** | Hasil joint, Hasil elemen, Ekspor CSV, Salin | Perpindahan dan rotasi per joint, atau gaya ujung per elemen |

Edit sel di tempat: klik, ketik, lalu tekan <kbd>Enter</kbd> (atau <kbd>Esc</kbd> untuk keluar dari sel). Nilai ditampilkan dan dimasukkan dalam [satuan yang berlaku](/id/essentials/units-settings).

## Tab di atas tampilan {#tabs-above-the-viewer}

**Tampilan** menampilkan kanvas. **Pengaturan** menampilkan pengaturan dalam ukuran penuh, sehingga Anda dapat mengubah warna atau satuan lalu kembali untuk melihat hasilnya. Label satuan dan *Pengaturan lain* membuka pengaturan yang sama sebagai dialog di atas model.

## Jendela mengambang {#floating-windows}

**Matriks kekakuan** (dari panel elemen atau tabel Elemen) membuka jendela berisi matriks kekakuan elemen 6 × 6 dalam koordinat global. **Edit** di menu kanvas membuka tabel dari seleksi saat ini. Seret jendela pada bilah judulnya dan tutup dengan ×.
