---
description: "Tambahkan elemen balok, atur sendi ujung dan arah elemen, serta definisikan material dan penampang di EduBeam, termasuk penampang poligon kustom."
---

# Elemen, material & penampang

## Elemen balok {#the-beam-element}

<Edubeam /> memiliki satu tipe elemen: **balok Timoshenko 2D** pada bidang x–z dengan tiga derajat kebebasan di setiap ujung (`Dx`, `Dz`, `Ry`). Elemen ini memikul gaya aksial, geser, dan lentur, serta memperhitungkan deformasi geser, itulah sebabnya penampang memiliki koefisien geser. Formulasi lengkapnya ada di [manual teori](/id/elements/beam).

<TrussElement :moment="true" caption="Elemen balok 2D – tiga DOF per joint" />

Hasil di sepanjang elemen eksak untuk model linear, jadi satu elemen per batang sudah cukup. Tambahkan joint antara hanya di tempat Anda memerlukan tumpuan, sendi, perubahan penampang, atau joint untuk membaca hasil.

### Menambahkan elemen {#adding-elements}

| Cara | Langkah |
| --- | --- |
| **Dialog** | Tab *Elemen* → tombol **Tambah elemen** yang pertama, atau menu kanvas → *Tambah elemen*. Pilih **Joint awal** dan **Joint akhir**, sendi, material, dan penampang. |
| **Mouse** | Tab *Elemen* → tombol **Tambah elemen** yang kedua (ikon kursor), atau tahan <kbd>Ctrl</kbd> pada item menu kanvas. Klik sebuah joint untuk memulai, lalu joint berikutnya untuk menyambungkan; mengklik kanvas kosong membuat joint di sana. Terus klik untuk menggambar polyline, dan tekan <kbd>Esc</kbd> untuk selesai. Banner di atas mengatur **Sendi awal** dan **Sendi akhir** untuk setiap elemen yang Anda gambar. Material dan penampang pertama dalam model yang dipakai. |

![Dialog Tambah elemen](/screenshots/id/qs-element.webp){.shot-md}

::: warning Material dan penampang dulu
Elemen memerlukan material dan penampang. Jika belum ada, tampilan menunjukkan *Belum ada material yang didefinisikan* / *Belum ada penampang yang didefinisikan* dengan tombol **Tambah baru**.
:::

### Arah elemen {#element-direction}

**Sumbu x lokal** mengarah dari joint awal ke joint akhir. Hal ini berpengaruh pada:

- beban dalam koordinat lokal (**LCS** dicentang),
- *Posisi beban dari joint awal* pada beban terpusat,
- urutan gaya ujung (`X12, Z12, M12` di awal, `X21, Z21, M21` di akhir) dalam tabel hasil.

Gunakan tombol tukar di antara kedua joint pada tabel *Elemen* untuk membalik elemen.

### Sendi ujung {#end-hinges}

Setiap elemen memiliki dua kotak centang **Sendi ujung**, untuk awal dan akhir, di tabel *Elemen*. Kotak ini juga ada di dialog Tambah elemen, di panel **Edit elemen**, dan di banner saat menggambar dengan mouse. Sendi yang dicentang melepas momen lentur di ujung tersebut, sehingga:

- satu sendi membuat sendi dalam pada portal atau balok menerus (momen di sana nol);
- dua sendi membuat **batang rangka** yang hanya memikul gaya aksial.

<TrussElement :hinges="[true, true]" caption="Kedua ujung bersendi → elemen rangka batang" />

![Tabel Elemen dari portal tiga sendi: elemen 2 memiliki sendi di ujung akhirnya, di joint C](/screenshots/id/elements-table.webp)

Jika dua elemen bertemu di sebuah joint dan hanya salah satunya yang bersendi, elemen lainnya tetap menyalurkan momen ke joint. Jadi berikan sendi pada elemen yang ingin dilepas, bukan pada "joint". Jika sendi membuat struktur menjadi mekanisme, EduBeam melingkarinya dan menunjukkan bagaimana struktur bergerak.

### Mengedit dan menghapus {#editing-and-deleting}

Klik elemen dan gunakan panelnya (**Edit elemen**, **Tambah beban**, **Matriks kekakuan**, **Hapus**), atau edit di tabel *Elemen*. Menghapus elemen juga menghapus bebannya. **Matriks kekakuan** membuka jendela berisi matriks kekakuan elemen 6 × 6 dalam koordinat global (N/m, N, dan N·m), dengan sendi ujung yang sudah dikondensasi. Ini berguna untuk memeriksa perakitan matriks secara manual.

## Material {#materials}

Tab *Material* → **Tambah material**:

| Kolom | Simbol | Satuan | Catatan |
| --- | --- | --- | --- |
| Modulus elastisitas | $E$ | satuan tekanan (bawaan MPa) | Baja ≈ 210 000 MPa, beton ≈ 30 000 MPa, kayu ≈ 11 000 MPa |
| Modulus geser | $G$ | satuan tekanan | $G = E / (2(1+\nu))$; baja ≈ 81 000 MPa. Hanya memengaruhi suku geser Timoshenko. |
| Massa jenis | $\rho$ | massa / panjang³ (kg/m³, lb/ft³) | Disimpan bersama proyek. Solver statis tidak memakainya (tidak ada beban berat sendiri). |
| Koefisien muai panas | $\alpha$ | 1/K atau 1/°F | Dipakai oleh [beban suhu](/id/essentials/loads#temperature-load). Baja: 12 × 10⁻⁶ /K. |

<div class="shots">

![Tambah material](/screenshots/id/qs-material.webp)

![Pustaka material](/screenshots/id/qs-material-library.webp)

</div>

**Pustaka material** berisi material siap pakai. Kelompok yang sesuai dengan satuan Anda ditampilkan lebih dulu.

- **Logam:** baja struktural S235, S275, S355, baja tahan karat, besi cor, paduan aluminium, tembaga, kuningan, perunggu, titanium; baja AS ASTM A992, A36, A572 Gr. 50 dan HSS A500 Gr. C.
- **Beton:** beton normal dan beton ringan, kelas C25/30, C30/37, C40/50, serta f′c = 4 ksi dan 5 ksi.
- **Kayu:** C24, GL24h, GL32h.
- **Lainnya:** kaca, GFRP, CFRP, HDPE, PVC, PMMA, polikarbonat.

Buka dengan tombol di toolbar atau *Atau pilih dari pustaka* di dialog *Tambah material*.

Material yang masih dipakai elemen tidak dapat dihapus; ganti dulu material elemen-elemen tersebut.

## Penampang {#cross-sections}

Tab *Penampang* → **Tambah penampang**:

| Kolom | Simbol | Satuan | Catatan |
| --- | --- | --- | --- |
| Luas | $A$ | satuan luas | Kekakuan aksial $EA$ |
| Momen inersia | $I_y$ | satuan momen inersia | Kekakuan lentur $EI_y$ terhadap sumbu yang tegak lurus bidang gambar |
| Tinggi | $h$ | satuan dimensi penampang | Dipakai oleh beban gradien suhu (kelengkungan $= \alpha\,\Delta T / h$) |
| Koefisien geser | $k$ | – | Faktor koreksi geser Timoshenko: luas geser efektif adalah $kA$. Gunakan `1` untuk hampir mengabaikan deformasi geser, sekitar 0,83 untuk persegi panjang, $A_{web}/A$ untuk profil I. |

**Pustaka penampang** memberikan nilai pendekatan untuk persegi panjang, bujur sangkar, dan lingkaran, profil IPE dan HEA, pipa RHS dan CHS, serta profil AISC W dan HSS (persegi dan bulat). Koefisien gesernya mengikuti bentuk: $h\,t_w/A$ untuk profil I, $2ht/A$ untuk pipa persegi, 0,5 untuk pipa bulat, 0,833 untuk persegi panjang, dan 0,9 untuk lingkaran. Anggap nilai-nilai ini sebagai titik awal dan periksa dengan tabel profil sebelum mengandalkannya.

![Pustaka penampang](/screenshots/id/sections-library.webp){.shot-lg}

### Penampang poligon {#polygonal-sections}

Tab *Penampang* → **Penampang poligon**, atau *Atau definisikan bentuk poligon* di dialog *Tambah penampang*, membuka editor bentuk.

![Editor penampang poligon dengan preset profil I, sumbu utama, dan elips inersianya](/screenshots/id/sections-polygon.webp)

- **Mulai** dari preset (persegi panjang, I, T, L, kanal, persegi berongga atau pipa, lingkaran) beserta dimensinya, lalu tekan **Terapkan**.
- **Edit** bentuknya: seret titik sudut (menempel pada **Jarak snap**), klik titik tengah sisi untuk menyisipkan titik sudut, klik ganda titik sudut untuk menghapusnya, atau ketik koordinat di tabel titik sudut. **Tambah lubang** menambahkan kontur dalam. **Pusatkan di titik berat** memindahkan bentuk sehingga titik beratnya berada di titik asal.
- **Baca** luas $A$, titik berat, momen inersia terhadap titik berat $I_y$, $I_z$, $I_{yz}$, momen inersia utama $I_1$, $I_2$ dengan sudut sumbu utama $\alpha$ (dari $y$ ke sumbu 1), dan jari-jari girasi. Gambar menampilkan elips inersia.

Saat disimpan, $A$, $I_y$, dan $h$ diisi dari bentuknya. Nilai-nilai ini hanya-baca di tabel; gunakan tombol poligon di kolom *Aksi* untuk mengedit bentuknya lagi. Koefisien geser $k$ tetap Anda masukkan sendiri. Koordinat penampang bersifat lokal dan mengikuti kaidah tangan kanan, dengan $x$ mengarah keluar layar, $y$ ke kiri, dan $z$ ke bawah.

Jika bentuknya tidak simetris terhadap bidang portal (misalnya profil siku L), editor memperingatkan bahwa analisis 2D hanya eksak jika batang ditahan terhadap lendutan ke samping dan puntir di sepanjang batang, misalnya oleh pelat. Jika $I_{yz}$ signifikan, Anda memilih kekakuan lentur yang dipakai: **ditahan ke samping dan terhadap puntir di sepanjang batang** ($I_y$) atau **bebas melendut ke samping**, yang lebih kecil. Puntir tidak diperhitungkan pada kedua pilihan.

::: tip Nilai cepat untuk pengecekan
Untuk persegi panjang $b \times h$: $A = bh$, $I_y = bh^3/12$. Untuk lingkaran pejal berdiameter $d$: $A = \pi d^2/4$, $I_y = \pi d^4/64$.
:::

Material dan penampang dapat dipakai bersama oleh sejumlah elemen. Mengubah sebuah nilai memperbarui setiap elemen yang memakainya dan menghitung ulang model.
