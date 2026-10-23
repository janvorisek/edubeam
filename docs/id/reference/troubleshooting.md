---
description: "Mengapa hasil tidak digambar dan cara memperbaikinya: tumpuan kurang, mekanisme, pesan solver, kesalahan dan peringatan, hasil yang tampak salah, dan cara melaporkan bug."
---

# Pemecahan masalah

## Tidak ada hasil yang digambar {#no-results-are-drawn}

Hasil hanya muncul jika model dapat dihitung. Periksa dengan urutan berikut:

1. **Baca pesan di kiri atas tampilan.**
   - *Belum ada material yang didefinisikan* / *Belum ada penampang yang didefinisikan*: tambahkan dengan tombol **Tambah baru**.
   - Label biru **Perlu tumpuan**: model memang belum selesai. Tambahkan tumpuan. Arahkan kursor ke label itu untuk melihat, sebagai garis putus-putus, bagaimana struktur masih dapat bergerak.
   - **Pesan merah**: ada yang salah. Pesan ini menyebutkan masalahnya, atau berbunyi *Kesalahan pada model: N* jika ada beberapa. Klik **Tampilkan detail** dan perbaiki setiap butir (lihat tabel di bawah). Joint atau sendi yang terlibat dilingkari di kanvas.
   - **Pesan kuning**: peringatan. Model tetap dihitung; Anda dapat menyembunyikannya.
2. **Tumpuan cukup?** Solver memerlukan setidaknya tiga DOF yang ditahan, dan tumpuan harus mampu menahan struktur. Balok di atas dua rol (Dz + Dz) hanya memiliki dua dan akan tergelincir. Tambahkan `Dx` di suatu tempat, atau `Ry` pada salah satu tumpuan.
3. **Apakah elemen tersambung?** Dua joint pada koordinat yang sama tetap dua joint yang terpisah. Hapus joint yang berlebih dan sambungkan ulang, atau tempatkan joint pada elemen dengan **Sambungkan ke struktur**.
4. **Terlalu banyak sendi?** Sendi di kedua ujung kolom, atau bujur sangkar dari batang bersambungan sendi tanpa diagonal, membentuk mekanisme. EduBeam melingkari sendi tersebut dan menunjukkan gerakannya.
5. **Kekakuan nol?** `E`, `A`, atau `Iy` yang tidak sengaja dimasukkan sebagai 0, atau dalam satuan yang salah, membuat sebagian struktur bergerak hampir tanpa hambatan. EduBeam melaporkannya sebagai *tidak stabil*.

![Tampilkan detail mencantumkan setiap masalah beserta petunjuknya, dan dapat menunjukkan gerakannya](/screenshots/id/ui-diagnostics.webp){.shot-lg}

## Pesan {#messages}

**Tampilkan detail** membuka dialog berjudul *Model tidak dapat dihitung* (kesalahan), *Belum siap dihitung* (tumpuan masih diperlukan), atau *Peringatan model*. Tautan **Pemecahan masalah** di dalamnya mengarah ke halaman ini.

### Masih diperlukan {#still-needed}

| Pesan | Arti / perbaikan |
| --- | --- |
| *Struktur memerlukan tumpuan sebelum dapat dihitung.* | Total DOF yang ditahan kurang dari tiga. Tambahkan tumpuan. |
| *Bagian struktur yang terpisah (joint …) memiliki kurang dari 3 DOF yang ditahan dan dapat bergerak bebas.* | Model terdiri dari beberapa bagian dan salah satunya melayang. Sambungkan, atau beri tumpuan. |

### Kesalahan {#errors}

| Pesan | Arti / perbaikan |
| --- | --- |
| *Jumlah tumpuan struktur sudah cukup, tetapi tumpuan tidak menahannya: struktur masih dapat …* | Semua tumpuan sejajar, atau garis kerjanya bertemu di satu titik. Garis putus-putus menunjukkan gerakannya; ubah arah salah satu tumpuan. Pesan yang sama menyebut *bagian struktur yang terpisah* jika hanya satu bagian yang terdampak. |
| *Tumpuan menahan struktur, tetapi struktur masih merupakan mekanisme: batangnya dapat berputar pada sendi di joint …* | Sendi membuat batang dapat berputar satu sama lain, seperti pada portal dengan sendi di puncak kedua kolom atau bujur sangkar bersambungan sendi tanpa diagonal. Hapus sebuah sendi, atau tambahkan batang atau tumpuan. |
| *Struktur tidak stabil: joint … bergerak praktis tanpa hambatan.* | Hampir merupakan mekanisme, atau kekakuan mendekati nol. Periksa tumpuan, sendi, dan nilai `E`, `A`, dan `Iy`. |
| *Struktur adalah mekanisme: matriks kekakuan singular.* | Ada bagian yang dapat bergerak bebas yang tidak tertangkap oleh pemeriksaan di atas. Pastikan setiap bagian ditahan oleh setidaknya tiga kekangan dan sendi tidak membuat batang bebas berputar. |
| *Elemen … merujuk joint / material / penampang … yang tidak ada.* | Objek yang dirujuk telah dihapus, biasanya pada file JSON yang diedit manual. Tetapkan ulang di tabel *Elemen*. |
| *Elemen … harus merujuk tepat 2 joint.* | Elemen rusak di file yang diimpor. Hapus dan buat ulang. |
| *Beban joint / Perpindahan tumpuan #n merujuk joint … yang tidak ada.* | Hapus bebannya atau berikan joint. |
| *Beban elemen #n merujuk elemen … yang tidak ada.* | Hapus bebannya. |
| *Solver gagal karena ada ketidakkonsistenan internal pada model…* | Kegagalan umum. Urungkan langkah terakhir, atau simpan file dan [laporkan](https://github.com/janvorisek/edubeam/issues). |

### Peringatan {#warnings}

Model tetap dihitung, tetapi periksa hal berikut:

| Pesan | Arti / perbaikan |
| --- | --- |
| *Joint … tidak tersambung ke elemen mana pun dan diabaikan oleh solver.* | Joint yang terlepas. Hapus, atau sambungkan. |
| *Joint … diberi tumpuan tetapi tidak ada elemen yang tersambung, sehingga tumpuannya tidak memikul apa pun.* | Tumpuan pada joint yang terlepas. |
| *Elemen … merujuk joint yang sama di kedua ujungnya.* | Elemen dengan panjang nol. Hapus. |
| *Beban joint / Perpindahan tumpuan #n berisi nilai yang tidak valid.* | Ada komponen yang bukan angka. Edit bebannya. |

## Hasil tampak salah {#results-look-wrong}

| Gejala | Kemungkinan penyebab |
| --- | --- |
| Beban bekerja ke atas | Sumbu global **z mengarah ke bawah**, jadi `Fz`/`fz` positif mengarah ke bawah. Nilai negatif mengarah ke atas. Lihat [konvensi](/id/elements/conventions). Dengan sumbu y ke atas, berlaku sebaliknya. |
| Lendutan 1000× terlalu besar atau terlalu kecil | Satuan tertukar: `E` dimasukkan dalam Pa padahal satuannya MPa, atau `Iy` dalam cm⁴ padahal satuannya m⁴. Periksa label satuan di kanan bawah tampilan. |
| Lendutan sedikit lebih besar dari rumus buku teks | Deformasi geser Timoshenko. Naikkan koefisien geser penampang, atau gunakan batang langsing, untuk mendekati nilai Euler–Bernoulli. Lihat [Memeriksa hasil secara manual](/id/guide/verification). |
| Tanda tampak "salah" | Baca tanda dari label, bukan dari sisi diagram. M positif berarti serat bawah tertarik. Gaya ujung di *Hasil elemen* mengikuti sumbu lokal elemen, bukan konvensi N-V-M. |
| Dua kolom identik menunjukkan tanda gaya geser berlawanan | Tanda V mengikuti arah setiap elemen. Tukar joint salah satunya untuk membandingkan. |
| Angka seperti `4 · 10¹` | Format angka ilmiah. Pilih *Otomatis* di *Pengaturan → Bahasa & Wilayah → Format angka*. |
| Diagram sangat besar atau sangat kecil | Murni visual. Atur **Skala hasil** di *Pengaturan → Pengaturan tampilan*. |
| Beban dalam koordinat lokal mengarah ke arah yang salah | Sumbu x lokal elemen mengarah dari joint *awal* ke joint *akhir*. Tukar joint, atau balik tandanya. |
| Beban pada batang miring tidak sesuai | **LCS** dicentang secara bawaan, sehingga `fz` bekerja tegak lurus batang. Hapus centangnya untuk beban vertikal. |
| Beban suhu tidak berpengaruh apa-apa | Struktur statis tertentu berdeformasi bebas akibat suhu, tanpa gaya dalam. Periksa bahwa α ≠ 0 dan, untuk gradien, bahwa tinggi penampang h sudah diisi. |

## Masalah antarmuka {#interface-issues}

| Gejala | Perbaikan |
| --- | --- |
| Pintasan tidak berfungsi | Klik kanvas terlebih dahulu: tombol keyboard diabaikan selama kolom teks aktif. |
| Tidak bisa menggeser tampilan | Secara bawaan tampilan digeser dengan tombol tengah atau kanan mouse; ubah di *Pengaturan → Kontrol & Pintasan*. Pada trackpad, menggulir dengan dua jari melakukan zoom; klik dan seret dengan dua jari untuk menggeser. |
| Model saya hilang | Membuka tautan, file, atau contoh, serta menghapus model, tetap menyimpan model lama: **☰ → Struktur terbaru**, atau <kbd>Ctrl</kbd>+<kbd>Z</kbd>. |
| Bahasa salah | *Pengaturan → Bahasa & Wilayah*, atau tambahkan `?lang=id` ke alamat. |
| Perubahan pengaturan tidak tersimpan | Local storage diblokir (jendela pribadi, mode privasi ketat). Pengaturan, penyimpanan otomatis, dan Struktur terbaru memerlukannya. |

## Melaporkan bug {#reporting-a-bug}

Buka [issue di GitHub](https://github.com/janvorisek/edubeam/issues) dengan menyebutkan browser dan sistem operasi Anda, apa yang Anda harapkan, dan yang paling berguna, **tautan berbagi** atau **file proyek** yang memperlihatkan masalahnya.
