---
description: "Jawaban atas pertanyaan umum tentang EduBeam: biaya dan akun, browser dan perangkat, memulihkan model yang hilang, pemakaian offline, penyimpanan data, dan tips pemodelan."
---

# Pertanyaan yang sering diajukan

## Umum {#general}

### Apa itu EduBeam? {#what-is-edubeam}

Solver gratis, open-source, berbasis browser untuk balok, portal, dan rangka batang 2D, ditujukan bagi mahasiswa, dosen, dan insinyur yang menginginkan umpan balik instan. Lihat [Pendahuluan](/id/guide/introduction).

### Apakah benar-benar gratis? Apakah perlu akun? {#is-it-really-free-do-i-need-an-account}

Ya, dan tidak. Buka [run.edubeam.app](https://run.edubeam.app/?lang=id) dan mulailah memodelkan. Tidak ada akun, tidak ada instalasi, dan tidak ada batas pemakaian. Kode sumbernya ada di [GitHub](https://github.com/janvorisek/edubeam).

### Browser dan perangkat apa saja yang didukung? {#which-browsers-and-devices-work}

Chrome, Edge, Firefox, atau Safari versi terkini. Tablet dan ponsel juga bisa: ketuk untuk memilih atau menempatkan, seret joint untuk memindahkannya, seret di tempat lain untuk menggeser tampilan, cubit untuk zoom, dan tekan lama untuk membuka menu kanvas. Meski begitu, mouse dan keyboard membuat pemodelan lebih cepat. Lihat [Keyboard, mouse & sentuh](/id/reference/shortcuts#touch).

### Model saya hilang. Bisakah dikembalikan? {#i-lost-my-model-can-i-get-it-back}

Kemungkinan besar bisa. Menghapus model, atau membuka tautan, file, atau contoh di atasnya, menyimpan model lama di **☰ → Struktur terbaru** (10 terakhir), dan <kbd>Ctrl</kbd>+<kbd>Z</kbd> mengurungkan penggantian tersebut. Keduanya hanya tersimpan di browser Anda.

### Bisakah dipakai secara offline? {#can-i-use-it-offline}

EduBeam adalah progressive web app: setelah dimuat, EduBeam tetap berfungsi tanpa koneksi, dan browser mungkin menawarkan untuk menginstalnya. Saat versi baru tersedia, sebuah dialog akan bertanya sebelum memperbarui.

### Di mana data saya disimpan? {#where-is-my-data-stored}

Hanya di browser Anda. Model tidak pernah dikirim ke server; tautan berbagi *adalah* modelnya. Lihat [Impor, ekspor & berbagi](/id/essentials/import-export).

## Pemodelan {#modelling}

### Bagaimana membuat tumpuan jepit / sendi / rol? {#how-do-i-make-a-fixed-pinned-roller-support}

Klik joint, buka **Tumpuan joint**, dan pilih simbolnya: sendi, rol, jepit, jepit geser, dan lainnya. Atau centang DOF-nya: **Dx + Dz + Ry** = jepit, **Dx + Dz** = sendi, **Dz** = rol. Setiap kombinasi tercantum di [Joint & tumpuan](/id/essentials/nodes-supports#supports).

### Bagaimana membuat rangka batang? {#how-do-i-make-a-truss}

Gunakan elemen balok dan centang **kedua sendi ujung** untuk setiap batang di tab *Elemen*, atau centang *Sendi awal* dan *Sendi akhir* di banner sebelum menggambar batang dengan mouse. Berikan beban di joint. [Tutorial rangka batang](/id/tutorials/truss) memandu Anda membuatnya.

### Bagaimana memasang sendi di portal? {#how-do-i-put-a-hinge-in-a-frame}

Centang **Sendi akhir** pada elemen di sisi joint tempat momen harus dilepas. Memberi sendi pada *satu* elemen di sebuah joint hanya melepas elemen tersebut.

### Bagaimana menambahkan tumpuan atau beban terpusat di tengah balok? {#how-do-i-add-a-support-or-a-point-load-in-the-middle-of-a-beam}

Tambahkan joint pada balok dengan *Tambah dengan mouse* dan pilih **Sambungkan ke struktur**—balok terbagi menjadi dua. Untuk beban terpusat saja, Anda bahkan tidak memerlukan joint: gunakan beban elemen **Beban terpusat** dengan posisinya.

### Bisakah memberikan berat sendiri? {#can-i-apply-self-weight}

Tidak secara otomatis. Masukkan sebagai beban merata $f_z = \rho g A$.

### Bisakah memodelkan tumpuan miring? {#can-i-model-inclined-supports}

Bisa—atur **Sudut LCS joint** pada joint; DOF-nya kemudian ditafsirkan dalam sistem yang diputar.

### Apakah ada kasus beban atau kombinasi? {#are-there-load-cases-or-combinations}

Tidak, hanya satu kasus beban. Modelkan setiap kasus secara terpisah lalu simpan atau bagikan.

### Mengapa beban saya mengarah ke atas? {#why-do-my-loads-point-up}

Karena sumbu z global mengarah **ke bawah**: `Fz` positif mengarah ke bawah. Lihat [konvensi](/id/elements/conventions). Jika Anda lebih suka sumbu vertikal mengarah ke atas, beralihlah ke sumbu y ke atas di *Pengaturan → Bahasa & Wilayah → Sistem koordinat*.

## Hasil {#results}

### Mengapa tidak ada tombol "Hitung"? {#why-is-there-no-solve-button}

Model dihitung secara otomatis setelah setiap perubahan. Jika hasil tidak muncul, model belum dapat dihitung—[Pemecahan masalah](/id/reference/troubleshooting) mencantumkan hal yang perlu diperiksa.

### Mengapa lendutan saya sedikit berbeda dari rumus? {#why-does-my-deflection-differ-slightly-from-the-formula}

EduBeam memakai balok Timoshenko, sehingga lendutan mencakup deformasi geser. Untuk batang langsing selisihnya jauh di bawah 1 %. Rincian dan perbandingannya ada di [Memeriksa hasil secara manual](/id/guide/verification).

### Seberapa akurat hasilnya? Apakah perlu lebih banyak elemen? {#how-accurate-are-the-results-do-i-need-more-elements}

Untuk analisis statis linear, elemen balok eksak untuk semua tipe beban yang didukung, jadi satu elemen per batang sudah cukup. Joint tambahan hanya diperlukan di tempat Anda menginginkan tumpuan, sendi, perubahan penampang, atau joint untuk memasang beban.

### Di mana reaksi dicantumkan? {#where-are-the-reactions-listed}

Di tampilan, sebagai panah dengan nilainya (**Reaksi** di opsi tampilan, aktif secara bawaan). Reaksi juga ada di file dari **Hasil → Ekspor CSV**, dan di **Salin**. Perpindahan joint dan gaya ujung elemen ada di tab **Hasil**.

## File & berbagi {#files-sharing}

### Bagaimana membagikan model? {#how-do-i-share-a-model}

**Bagikan model** → **Salin**. Tautan memuat seluruh model. Penerima mendapatkan salinan sendiri yang dapat diedit; tidak ada kolaborasi langsung. Lihat juga [Mengajar dengan EduBeam](/id/guide/teaching).

### Bisakah menyematkan model di situs web atau slide? {#can-i-embed-a-model-on-my-website-or-in-slides}

Bisa: tambahkan `&viewer=1` ke tautan berbagi dan masukkan ke dalam `<iframe>`. Lihat [Menyematkan penampil](/id/essentials/import-export#embed-a-read-only-viewer).

### Bisakah mengekspor gambar atau tabel? {#can-i-export-images-or-tables}

Bisa. **☰ → Ekspor gambar** (<kbd>Ctrl</kbd>+<kbd>P</kbd>) menyimpan gambar sebagai PNG atau SVG, dengan ukuran atau skala pilihan Anda. **Hasil → Ekspor CSV** menyimpan kedua tabel hasil, dan **Salin** menaruhnya di clipboard untuk spreadsheet. Lihat [Impor, ekspor & berbagi](/id/essentials/import-export#export-an-image).

### Bisakah membuat model secara terprogram? {#can-i-generate-models-programmatically}

Bisa. File proyek adalah JSON biasa dalam satuan SI—lihat [deskripsi format](/id/essentials/import-export#project-file-format)—dan dapat dibuka dengan *Buka proyek* atau seret-dan-lepas.

## Dukungan {#support}

### Bagaimana melaporkan bug atau mengusulkan fitur? {#how-do-i-report-a-bug-or-request-a-feature}

Buka issue di [GitHub](https://github.com/janvorisek/edubeam/issues) dan lampirkan tautan berbagi atau file proyek yang memperlihatkan masalahnya. Dukungan pribadi: [support@edubeam.app](mailto:support@edubeam.app).
