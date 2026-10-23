---
description: "Gunakan EduBeam dalam kuliah dan tugas: tautan berbagi di catatan kuliah, mode penampil yang dapat disematkan, latihan yang dapat diperiksa sendiri, dan pemakaian di komputer laboratorium."
---

# Mengajar dengan EduBeam

<Edubeam /> lahir di ruang kuliah, dan di sanalah ia paling berguna: model di proyektor yang langsung bereaksi saat Anda mengubahnya, dan model yang sama di laptop setiap mahasiswa melalui tautan. Halaman ini merangkum hal yang paling sering dipakai dosen.

## Di ruang kuliah {#in-the-lecture}

- **Buat terbaca dari barisan belakang.** Di *Pengaturan → Pengaturan tampilan*, naikkan **Ukuran huruf** menjadi 18–20 px dan **Ukuran tumpuan** menjadi 130–150 %. Naikkan **Skala hasil** jika diagram tampak terlalu kecil di layar besar.
- **Tunjukkan satu hal setiap kali.** Matikan semua opsi tampilan kecuali besaran yang sedang dibahas, lalu tambahkan yang lain satu per satu.
- **Ubah model secara langsung.** Seret tumpuan, centang `Ry`, tambahkan sendi. Mahasiswa langsung melihat sebab dan akibat, dan <kbd>Ctrl</kbd>+<kbd>Z</kbd> membawa Anda kembali.
- **Biarkan solver menjelaskan mekanisme.** Lepaskan satu sendi terlalu banyak, dan EduBeam menggerakkan garis putus-putus mekanisme serta melingkari sendi penyebabnya. Ini saat yang tepat untuk membahas stabilitas.
- **Gunakan bahasa dan sumbu mahasiswa.** Pilih bahasa antarmuka, satuan SI atau AS, serta sumbu z ke bawah atau y ke atas agar sesuai dengan catatan kuliah Anda.

![Mekanisme yang diperlihatkan: sendi di B dan C membuat portal dapat bergoyang](/screenshots/id/ui-mechanism.webp)

## Di catatan kuliah dan tugas {#in-lecture-notes-and-assignments}

Tautan berbagi memuat seluruh model, jadi tautan itu berfungsi di mana pun tautan bisa dipakai: PDF, slide, halaman LMS, atau e-mail.

1. Buat model dan tekan **Bagikan model → Salin**.
2. Tempelkan tautan ke catatan Anda. Tautan dari versi EduBeam yang lebih lama tetap berfungsi, jadi catatan tetap berlaku dari tahun ke tahun.
3. Mahasiswa yang membukanya mendapatkan salinan sendiri untuk bereksperimen. Perubahan mereka tidak sampai kepada Anda atau mahasiswa lain.

Variasi tautan yang berguna:

| Tautan | Membuka |
| --- | --- |
| `https://run.edubeam.app/?model=…` | Model, siap diedit |
| `https://run.edubeam.app/?viewer=1&model=…` | Model dalam [mode penampil](/id/essentials/import-export#embed-a-read-only-viewer), untuk disematkan dalam `<iframe>` |
| `https://run.edubeam.app/?panel=examples` | Galeri contoh |
| `https://run.edubeam.app/?lang=id` | Aplikasi dalam bahasa Indonesia (atau [kode bahasa lain](/id/essentials/import-export#url-parameters) apa pun) |

::: warning Membuka tautan menggantikan model milik mahasiswa
Model yang sebelumnya terbuka dipindahkan ke **☰ → Struktur terbaru** dan dapat dipulihkan, dan sebuah pesan memberitahukannya. Meski begitu, minta mahasiswa menyimpan pekerjaan penting dengan **Simpan proyek** sebelum membuka tautan dari kelas.
:::

## Tugas yang dapat diperiksa sendiri oleh mahasiswa {#assignments-students-can-check-themselves}

EduBeam memberi mahasiswa umpan balik langsung atas perhitungan manual mereka tanpa membocorkan metodenya:

- Minta reaksi, gaya dalam, dan satu perpindahan dihitung secara manual, lalu minta mahasiswa membuat modelnya dan membandingkan. [Memeriksa hasil secara manual](/id/guide/verification) berisi rumus siap pakai.
- Tanyakan *mengapa* hasilnya berbeda: deformasi geser, sendi yang terlewat, beban pada sumbu lokal alih-alih global.
- Minta mahasiswa mengumpulkan tautan berbagi atau `project.json` bersama perhitungannya. Anda dapat membukanya dan melihat persis apa yang mereka modelkan.
- Untuk laporan, mahasiswa dapat mengekspor gambar sebagai **SVG** (tajam di Word dan LaTeX) dan hasil sebagai **CSV**.

## Latihan siap pakai {#ready-made-exercises}

- Halaman [Contoh](/id/examples/) berisi enam model, masing-masing dengan usulan latihan.
- Tutorial [portal tiga sendi](/id/tutorials/three-hinged-frame) dan [rangka batang bidang](/id/tutorials/truss) adalah contoh lengkap dengan pemeriksaan manual.
- [Mulai cepat](/id/guide/quick-start) cocok sebagai lembar kerja praktikum pertama: waktunya sekitar sepuluh menit.

## Membantu mahasiswa memulai {#getting-students-started}

Pengguna baru melihat dialog sambutan dengan dua pilihan terpandu: **Ajak saya berkeliling** (tur antarmuka) dan **Gambar balok pertama Anda** (tugas tujuh langkah dengan mouse). Keduanya juga ada di menu ☰. Banyak dosen cukup berkata "buka run.edubeam.app dan pilih *Gambar balok pertama Anda*" di awal praktikum pertama.

## Offline dan komputer laboratorium {#offline-and-lab-computers}

EduBeam adalah progressive web app (PWA). Setelah sebuah komputer memuatnya, EduBeam tetap berfungsi tanpa koneksi, dan browser mungkin menawarkan untuk menginstalnya. Model dan pengaturan disimpan per profil browser, jadi di komputer laboratorium bersama mahasiswa sebaiknya menyimpan pekerjaan sebagai file atau tautan.
