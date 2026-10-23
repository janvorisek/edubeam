---
description: "Baca diagram gaya normal, gaya geser, dan momen lentur, reaksi dan bentuk deformasi, nilai saat kursor diarahkan, tabel hasil, ekspor CSV, dan matriks kekakuan."
---

# Hasil & diagram

<Edubeam /> menghitung model setelah setiap perubahan, paling banyak beberapa kali per detik, sehingga hasilnya selalu terbaru. Tidak ada tombol *Hitung*. Jika tidak ada yang digambar, model belum dapat dihitung; pesan di kiri atas tampilan menjelaskan alasannya (lihat [Pemecahan masalah](/id/reference/troubleshooting)).

Semua gambar di halaman ini menampilkan model yang sama: [portal tiga sendi](/id/tutorials/three-hinged-frame) dengan beban 10 kN/m.

## Lapisan di tampilan {#overlays-in-the-viewer}

Aktifkan dan nonaktifkan lapisan di **opsi tampilan** di kanan atas tampilan (tombol ⚙ menampilkan atau menyembunyikannya).

| Lapisan | Warna (bawaan) | Catatan |
| --- | --- | --- |
| **Bentuk deformasi** | abu-abu | Diperbesar: perpindahan terbesar digambar sepanjang *Skala hasil* piksel. Aktif secara bawaan. |
| **N (x)**, gaya normal | biru | Tarik bernilai positif. Konstan di sepanjang elemen kecuali ada beban aksial yang bekerja padanya. |
| **V<sub>z</sub> (x)**, gaya geser | hijau | Linear akibat beban merata, kuadratik akibat beban trapesium, dengan lompatan di beban terpusat. |
| **M<sub>y</sub> (x)**, momen lentur | merah | Positif bila balok melendut ke bawah (serat bawah tertarik). Diberi label di kedua ujung, di beban terpusat, dan di setiap ekstrem lokal (tempat V = 0). Aktif secara bawaan. |
| **Reaksi** | ungu | Panah dan nilai untuk setiap DOF yang ditahan. Aktif secara bawaan. |

Nilai dituliskan di titik-titik karakteristik setiap diagram. Orientasi label, ukuran diagram, dan warna dapat diubah di [Pengaturan](/id/essentials/units-settings#viewer-settings).

<div class="shots">

![Gaya normal N: kedua kolom memikul tekan 40 kN, balok 20 kN](/screenshots/id/results-normal.webp)

![Gaya geser V: 20 kN di kolom; di balok, 40 kN di sudut dan turun hingga nol di sendi](/screenshots/id/results-shear.webp)

![Momen lentur M: −80 kNm di kedua sudut, nol di kaki kolom dan di sendi](/screenshots/id/results-moment.webp)

![Bentuk deformasi (diperbesar): sendi di C turun](/screenshots/id/results-deformed.webp)

</div>

![Reaksi: 40 kN vertikal dan 20 kN horizontal di setiap sendi](/screenshots/id/results-reactions.webp){.shot-lg}

### Membaca tanda {#reading-the-sign}

Baca tanda suatu nilai dari labelnya, bukan dari sisi batang tempat diagram digambar. Momen lentur negatif berarti serat atas balok tertarik, atau sisi luar sudut portal tertarik.

## Tooltip saat kursor diarahkan {#hover-tooltips}

Mengarahkan kursor ke objek adalah cara tercepat untuk membaca nilai:

- **Joint**: `ux`, `uz`, dan `φy` (perpindahan dalam satuan perpindahan, rotasi dalam radian).
- **Elemen**: label, penampang, dan materialnya.
- **Beban**: komponennya.

Di layar sentuh, ketuk objeknya. Detail yang sama muncul di panel seleksinya.

![Mengarahkan kursor ke joint 2 pada balok Mulai cepat](/screenshots/id/ui-hover.webp){.shot-sm}

## Tab Hasil {#results-tab}

Tab **Hasil** di bilah bawah memiliki dua tabel, yang dipilih dengan **Hasil joint** dan **Hasil elemen**.

### Hasil joint {#nodal-results}

Satu baris per joint dengan **Dx**, **Dz** (satuan perpindahan), dan **Ry** (rad). Tanda mengikuti sumbu global: `Dz` positif ke bawah dan `Ry` positif berlawanan arah jarum jam di layar.

![Hasil joint dari portal tiga sendi (Format angka: Otomatis)](/screenshots/id/results-nodal.webp)

### Hasil elemen {#element-results}

Satu baris per elemen dengan **gaya ujung dalam sistem koordinat lokal elemen**:

| Kolom | Arti |
| --- | --- |
| `X12`, `Z12`, `M12` | gaya aksial, gaya geser, dan momen yang bekerja pada elemen di joint **awal** |
| `X21`, `Z21`, `M21` | sama, di joint **akhir** |

![Hasil elemen dari portal tiga sendi](/screenshots/id/results-element.webp)

Ini adalah gaya yang diberikan joint pada elemen: matriks kekakuan elemen dikalikan perpindahan ujungnya, dikurangi beban joint ekuivalen. Gaya-gaya ini mengikuti sumbu lokal, bukan konvensi N-V-M pada diagram:

- Untuk balok sederhana 6 m di [Mulai cepat](/id/guide/quick-start): `Z12 = Z21 = −36 kN`. Kedua tumpuan mendorong balok ke atas, yaitu −z.
- Untuk kantilever yang dijepit di joint awal dengan beban 18 kN ke bawah di ujung: `Z12 = −18 kN`, `M12 = +72 kNm`, `Z21 = +18 kN`, `M21 = 0`.
- Untuk kolom 1 portal (A di bawah, B di atas): `X12 = +40 kN` mendorong searah sumbu x lokal ke dalam elemen, yaitu tekan sebesar 40 kN.

### Ekspor CSV dan Salin {#export-csv-and-copy}

**Ekspor CSV** mengunduh `edubeam-results.csv` berisi kedua tabel, dalam satuan yang ditampilkan di layar dan siap untuk spreadsheet. Tabel joint juga mencantumkan **reaksi** `Rx`, `Rz`, `My`. **Salin** menaruh tabel yang sama di clipboard sebagai teks yang dipisahkan tab, yang dapat langsung ditempel ke Excel, LibreOffice, atau Google Sheets. Dalam ekspor, gaya ujung elemen diberi nama `N1 V1 M1 N2 V2 M2`.

### Matriks kekakuan {#stiffness-matrix}

Pilih **Matriks kekakuan** dari panel elemen atau baris tabelnya untuk membuka jendela berisi matriks kekakuan elemen 6 × 6 dalam koordinat global, berguna untuk memeriksa perakitan manual dalam mata kuliah metode kekakuan. Rumusnya ada di [manual teori](/id/elements/beam).

## Format angka {#number-format}

Hasil ditampilkan dengan lima angka penting. **Pengaturan → Bahasa & Wilayah → Format angka** menentukan cara penulisannya:

| Format | 40 000 ditulis sebagai | Gunakan untuk |
| --- | --- | --- |
| **Ilmiah** (bawaan) | 4 · 10⁴ | nilai yang mencakup banyak orde besaran |
| **Teknik** | 40 · 10³ | menyesuaikan dengan awalan kilo / mega |
| **Otomatis** | 40000 | angka sehari-hari dalam pengajaran |

Otomatis menulis nilai dari 0,001 hingga 100 000 sebagai angka biasa dan beralih ke pangkat sepuluh di luar rentang itu. Pemisah desimal mengikuti bahasa.

## Presisi dan akurasi {#precision-and-accuracy}

- Elemen balok eksak untuk model Timoshenko linear di bawah beban joint, merata, trapesium, terpusat, dan suhu, sehingga hasilnya **tidak** bergantung pada jumlah elemen.
- Perhitungan dilakukan dalam presisi ganda. Nilai sangat kecil seperti `1,5 · 10⁻¹⁸` adalah galat pembulatan dan berarti nol.
- Lendutan mencakup **deformasi geser**. Untuk batang langsing hal ini menambah sepersekian persen pada nilai Euler–Bernoulli; untuk batang tinggi atau pendek bisa mencapai beberapa persen. Atur koefisien geser penampang ke nilai besar untuk menekannya.

## Hasil dalam laporan {#results-in-a-report}

- **☰ → Ekspor gambar** (<kbd>Ctrl</kbd>+<kbd>P</kbd>) menyimpan gambar sebagai PNG atau SVG dengan lapisan yang Anda pilih. Lihat [Mengekspor gambar](/id/essentials/import-export#export-an-image).
- **Hasil → Ekspor CSV** atau **Salin** memberikan angkanya.
- **Bagikan model** memberikan tautan agar pembaca dapat membuka modelnya sendiri.
