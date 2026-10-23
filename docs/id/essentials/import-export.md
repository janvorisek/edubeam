---
description: "Simpan dan buka file proyek, bagikan model sebagai tautan, ekspor gambar dan hasil, sematkan penampil langsung, dan gunakan parameter URL. Semuanya tetap di browser Anda."
---

# Impor, ekspor & berbagi

Semua yang ada di <Edubeam /> terjadi di browser Anda. Tidak ada yang diunggah ke server: tautan berbagi benar-benar memuat modelnya.

## Menyimpan proyek {#save-a-project}

**☰ → Simpan proyek** atau <kbd>Ctrl</kbd>+<kbd>S</kbd> mengunduh `project.json`. File ini berisi joint, elemen, material, penampang (beserta bentuk poligon), beban, garis dimensi, dan versi aplikasi yang menulisnya. Ganti nama file sesuka Anda.

## Membuka proyek {#open-a-project}

- **☰ → Buka proyek** atau <kbd>Ctrl</kbd>+<kbd>O</kbd>, lalu pilih file `.json`, atau
- **seret file ke mana saja di jendela aplikasi**.

Membuka proyek menggantikan model saat ini, termasuk material dan penampang. Model yang sebelumnya tidak hilang: <kbd>Ctrl</kbd>+<kbd>Z</kbd> mengembalikannya, dan model itu disimpan di [Struktur terbaru](#recent-structures). File yang bukan proyek EduBeam ditolak dengan pesan, dan model Anda tetap seperti semula.

File proyek dari semua versi EduBeam sebelumnya dapat dibuka di versi saat ini.

## Membagikan tautan {#share-a-link}

**Bagikan model** (di bilah aplikasi atau menu ☰) membuka dialog *Bagikan model lewat URL*:

![Dialog berbagi](/screenshots/id/share.webp){.shot-lg}

- **Salin** menyalin tautan ke clipboard. Mengklik di dalam kolom melakukan hal yang sama.
- **Buka tautan** membukanya di tab baru, sehingga Anda dapat memeriksa apa yang akan dilihat penerima.
- **Bagikan lewat dialog sistem** meneruskan tautan ke menu berbagi perangkat Anda, jika browser mendukungnya.
- **Tautan lebih pendek** menuliskan model yang sama dengan sekitar setengah jumlah karakter. Salinan <Edubeam /> yang belum diperbarui sejak Oktober 2026 tidak dapat membacanya sampai diperbarui, jadi biarkan opsi ini nonaktif jika tautan harus langsung terbuka di mana saja.

Tautan berbentuk `https://run.edubeam.app/?model=…` dan menyandikan seluruh model. Siapa pun yang membukanya mendapatkan salinan sendiri untuk diedit; hasil edit **tidak** disinkronkan kembali, jadi kirim tautan baru saat model berubah. Model yang sangat besar menghasilkan tautan yang sangat panjang; untuk model seperti itu, bagikan file JSON-nya.

Saat seseorang membuka tautan, model sebelumnya miliknya dipindahkan ke Struktur terbaru, dan sebuah pesan memberi tahu di mana menemukannya.

Tautan dari versi lama tetap berfungsi: tautan di catatan kuliah tahun lalu membuka model yang sama hari ini.

## Mengekspor gambar {#export-an-image}

**☰ → Ekspor gambar** atau <kbd>Ctrl</kbd>+<kbd>P</kbd> membuka ekspor gambar.

![Ekspor gambar: pilih lapisan, bingkai, dan ukuran, lalu unduh atau salin](/screenshots/id/export-image.webp)

- **Lapisan**: label di bagian atas memilih apa yang digambar, terlepas dari tampilan: bentuk deformasi, N, V, M, reaksi, tumpuan, beban, label joint dan elemen.
- **Bingkai**: pilih rasio aspek (16:9, 4:3, 3:2, 1:1), **Semua**, atau **Jendela…** untuk menyeret persegi panjang di atas gambar. Anda juga dapat menyeret tepi pratinjau.
- **Ukuran**: lebar dan tinggi dalam piksel, atau **Skala** seperti 1 : 50 untuk gambar berskala di kertas. **Tinggi diagram** mengatur ukuran diagram hasil dalam gambar. **Latar belakang transparan** menghilangkan warna putih.
- **Unduh PNG**, **Unduh SVG**, atau **Salin ke clipboard**.

SVG tetap tajam pada ukuran berapa pun dan dapat dipakai di Word, Inkscape, dan LaTeX di Overleaf, sehingga menjadi pilihan terbaik untuk laporan dan skripsi.

## Mengekspor hasil {#export-the-results}

**Hasil → Ekspor CSV** mengunduh kedua tabel hasil, termasuk reaksi, dan **Salin** menaruhnya di clipboard untuk spreadsheet. Lihat [Ekspor CSV dan Salin](/id/essentials/results#export-csv-and-copy).

## Struktur terbaru {#recent-structures}

**☰ → Struktur terbaru** menyimpan 10 model terakhir yang dihapus atau diganti oleh tautan, file, contoh, atau tugas balok pertama. Masing-masing menampilkan gambar kecil, alasan penggantiannya, dan ukurannya. **Pulihkan** mengembalikan salah satunya; model yang sedang terbuka kemudian masuk ke daftar, dan <kbd>Ctrl</kbd>+<kbd>Z</kbd> mengurungkan pemulihan.

![Struktur terbaru](/screenshots/id/recent.webp){.shot-lg}

Daftar ini hanya disimpan di browser ini.

## Contoh {#examples}

**☰ → Contoh** membuka galeri model pengajaran siap pakai. Membuka salah satunya menggantikan model Anda, dan <kbd>Ctrl</kbd>+<kbd>Z</kbd> mengembalikan model Anda. Model yang sama, beserta latihannya, ada di halaman [Contoh](/id/examples/) dalam panduan ini.

![Galeri contoh](/screenshots/id/examples.webp){.shot-lg}

## Menyematkan penampil {#embed-a-read-only-viewer}

Tambahkan `&viewer=1` ke tautan berbagi untuk membuka model dalam **mode penampil**. Bilah aplikasi, bilah bawah, tab, urungkan dan ulangi, tombol grid, dan indikator sumbu disembunyikan, sehingga yang tersisa hanya kanvas, tombol sesuaikan dan pusatkan, serta opsi tampilan. Masukkan URL tersebut ke dalam `<iframe>` untuk menyematkan model hidup yang dapat di-zoom di catatan kuliah atau halaman web:

```html
<iframe src="https://run.edubeam.app/?viewer=1&model=…" width="100%" height="400"></iframe>
```

![Portal tiga sendi dalam mode penampil](/screenshots/id/viewer-mode.webp){.shot-lg}

Mode penampil ditujukan untuk melihat, tetapi tidak dikunci: pengunjung tetap dapat menyeret joint dan mengganti diagram. Membuka tautan penampil juga menggantikan model milik pengunjung di browser tersebut (model itu dipindahkan ke Struktur terbaru), sama seperti tautan biasa.

## Parameter URL {#url-parameters}

| Parameter | Efek |
| --- | --- |
| `model=<data>` | Memuat model yang disandikan dan menyesuaikannya dengan layar. |
| `viewer=1` | Mode penampil (lihat di atas). |
| `lang=<code>` | Mengganti bahasa antarmuka: `en`, `cs`, `de`, `fr`, `es`, `pt`, `pl`, `cn`, `th`, `uk`, `ru`, `tr`, `hi`, `vi`, `it`, `id`. |
| `panel=examples` | Langsung membuka galeri contoh. |

Setelah membacanya, EduBeam menghapus parameter tersebut dari bilah alamat.

## Penyimpanan otomatis {#automatic-persistence}

Model saat ini dan pengaturan Anda disimpan ke local storage browser setelah setiap perubahan dan dipulihkan saat Anda kembali, bahkan setelah browser ditutup. Ini hanya kemudahan, bukan cadangan: penyimpanan ini milik satu profil browser di satu perangkat, dan menghapus data situs akan menghapusnya. Simpan pekerjaan penting sebagai file proyek.

## Format file proyek {#project-file-format}

`project.json` adalah JSON biasa yang mudah dibaca:

```json
{
  "edubeam": true,
  "version": "1.3.1",
  "domain": {
    "materials": [{ "label": "1", "e": 210000000000, "g": 81000000000, "alpha": 0.000012, "d": 7850 }],
    "crossSections": [{ "label": "1", "a": 0.00285, "iy": 1.943e-5, "h": 0.2, "k": 1 }],
    "nodes": [
      { "label": "1", "coords": [0, 0, 0], "bcs": [0, 2] },
      { "label": "2", "coords": [6, 0, 0], "bcs": [2] }
    ],
    "elements": [{ "label": "1", "nodes": ["1", "2"], "mat": "1", "cs": "1", "hinges": [false, false] }],
    "loadCases": [
      {
        "label": "1",
        "nodalLoads": [],
        "elementLoads": [{ "type": "udl", "target": "1", "lcs": false, "values": [0, 12000] }],
        "prescribedBC": []
      }
    ]
  },
  "dimensions": []
}
```

Ini adalah balok dari Mulai cepat. Semua nilai dalam **satuan SI** (m, N, Pa, rad), apa pun satuan tampilannya. Koordinat berbentuk `[x, y, z]`, dengan y selalu 0. Kondisi batas dan komponen beban memakai id DOF `0 = Dx`, `2 = Dz`, `4 = Ry`.

| `type` beban elemen | Nilai |
| --- | --- |
| `udl` | `values: [fx, fz]` dalam N/m |
| `trapezoidal` | `startValues: [f1x, f1z]`, `endValues: [f2x, f2z]` dalam N/m, sumbu lokal |
| `concentrated` | `values: [Fx, Fz, My, a]` dalam N, N·m, dan m dari joint awal |
| `temperature` | `values: [ΔTc, ΔTb, ΔTt]` dalam K; gradiennya adalah ΔTb − ΔTt |

Beban joint berbentuk `{ "target": "2", "values": { "0": Fx, "2": Fz, "4": My } }` dan perpindahan tumpuan `{ "target": "2", "prescribedValues": { "0": Dx, "2": Dz, "4": Ry } }`; berikan ketiga komponennya. File yang ditulis aplikasi juga memuat `date`, `commit`, `lcs` joint, dan `shape` poligon.

Karena formatnya sederhana, Anda dapat membuat model dengan skrip atau spreadsheet dan membukanya dengan **Buka proyek**.
