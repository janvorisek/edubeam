---
description: "Modelkan balok baja sederhana dengan beban merata dalam sekitar sepuluh menit, baca reaksi, gaya geser, dan momen lentur, lalu periksa secara manual."
---

# Mulai cepat

Dalam sekitar sepuluh menit Anda akan memodelkan balok baja sederhana dengan beban merata, membaca reaksi, gaya geser, dan momen lentur, lalu memeriksanya dengan rumus dari buku teks.

::: tip Ikuti langsung
Buka [run.edubeam.app](https://run.edubeam.app/?lang=id){target="_blank"} di tab kedua. Jika sudah ada model, gunakan **Hapus model** di bilah aplikasi untuk mulai dari kosong, dan centang *Hapus material* serta *Hapus penampang* agar benar-benar mulai dari awal. Penghapusan dapat diurungkan dengan <kbd>Ctrl</kbd>+<kbd>Z</kbd>, dan model lama tetap ada di **☰ → Struktur terbaru**.

Lebih suka belajar sambil praktik dengan petunjuk di layar? **☰ → Gambar balok pertama Anda** memandu Anda menggambar balok serupa dengan mouse.
:::

## Soal {#the-problem}

<ExampleStructure />

Balok sederhana sepanjang 6 m (sendi di kiri, rol di kanan) memikul beban merata 12 kN/m. Material: baja, $E = 210\ \text{GPa}$, $G = 81\ \text{GPa}$. Penampang: IPE 200, $A = 28{,}5\ \text{cm}^2$, $I_y = 1943\ \text{cm}^4$, $h = 200\ \text{mm}$.

## 1. Periksa satuan {#_1-check-the-units}

Label satuan di sudut kanan bawah tampilan menunjukkan satuan yang dipakai setiap kolom input dan hasil. Tutorial ini memakai satuan SI bawaan: meter, kN, kNm, dan MPa.

![Tombol grid (G), snap (S), dan crosshair, serta label satuan](/screenshots/id/ui-grid-units.webp){.shot-sm}

Jika Anda melihat `ft · kip · kip·ft · ksi`, klik label tersebut dan pilih **Sistem satuan → SI (metrik)**.

## 2. Tambahkan material dan penampang {#_2-add-the-material-and-cross-section}

Elemen memerlukan material dan penampang, jadi buat keduanya terlebih dahulu.

1. Buka tab **Material** di bilah bawah dan klik **Tambah material**.
2. Masukkan `E = 210000` MPa dan `G = 81000` MPa. Biarkan massa jenis dan `α = 0,000012` 1/K. Klik **Tambah material**.

<div class="shots">

![Tambah material: ketik E dan G…](/screenshots/id/qs-material.webp)

![…atau pilih Steel (S235) dari Pustaka material](/screenshots/id/qs-material-library.webp)

</div>

3. Buka tab **Penampang** dan klik **Tambah penampang**.
4. Masukkan `Luas = 0,00285` m², `Iy = 1,943e-5` m⁴, `Tinggi = 0,2` m, dan `Koefisien geser = 1`. Klik **Tambah penampang**.

![Tambah penampang. Atau pilih dari pustaka, atau gambar bentuk poligon.](/screenshots/id/qs-cross-section.webp){.shot-md}

::: details Mengapa koefisien geser berpengaruh?
EduBeam memakai elemen balok Timoshenko, yang memperhitungkan deformasi geser. `k` adalah faktor koreksi geser: $k \approx 0{,}83$ untuk persegi panjang, dan sekitar $0{,}4$–$0{,}5$ untuk profil I bila $A$ adalah luas penuh. Memakai `k = 1` dengan luas penuh sedikit *meremehkan* kelenturan geser. Untuk balok langsing seperti ini, selisih lendutannya jauh di bawah 1 %. Rumusnya ada di [halaman teori balok](/id/elements/beam).
:::

## 3. Tambahkan joint {#_3-add-the-nodes}

1. Buka tab **Joint**. Ada dua tombol **Tambah joint**: yang pertama membuka dialog, yang kedua (dengan ikon kursor) menempatkan joint dengan mouse. Klik yang pertama.
2. Masukkan `X = 0`, `Z = 0` dan klik **Tambah joint**. Joint diberi label `1`.
3. Tambahkan joint kedua di `X = 6`, `Z = 0`. Ini adalah joint `2`.

![Dialog Tambah joint juga dapat langsung mengatur tumpuan](/screenshots/id/qs-node.webp){.shot-md}

Dengan tombol mouse, setiap klik di kanvas menempatkan satu joint. Saat **Snap ke grid** aktif (<kbd>S</kbd>), klik jatuh tepat pada jarak grid (bawaan 0,1 m).

## 4. Hubungkan dengan elemen {#_4-connect-them-with-an-element}

1. Buka tab **Elemen** dan klik tombol **Tambah elemen** yang pertama.
2. Pilih **Joint awal** `1` dan **Joint akhir** `2`. Material dan penampang Anda sudah terpilih. Klik **Tambah elemen**.

![Tambah elemen: kedua joint ujung, sendi ujung opsional, material, dan penampang](/screenshots/id/qs-element.webp){.shot-md}

Sebuah garis muncul di antara kedua joint. Tekan <kbd>F</kbd> untuk menyesuaikannya dengan layar.

## 5. Tambahkan tumpuan {#_5-add-the-supports}

Di tab **Joint**, kolom **DOF yang ditahan** berisi pemilih simbol tumpuan dan tiga kotak centang per joint: `Dx`, `Dz`, `Ry`.

- Joint `1`: pilih simbol **Sendi**, atau centang **Dx** dan **Dz**.
- Joint `2`: pilih **Rol**, atau centang **Dz** saja.

![Tumpuan di tabel Joint: joint 1 sendi, joint 2 rol](/screenshots/id/qs-supports.webp)

Anda juga dapat mengklik joint di tampilan dan memilih **Tumpuan joint**. [Joint & tumpuan](/id/essentials/nodes-supports#supports) mencantumkan semua tipe tumpuan.

## 6. Tambahkan beban {#_6-add-the-load}

1. Buka tab **Beban** dan klik **Tambah beban elemen**.
2. **Tipe beban**: *Beban merata*. **Elemen**: `1`.
3. Masukkan `fz = 12` kN/m dan biarkan `fx = 0`. Klik **Tambah beban elemen**.

![Dialog menampilkan pratinjau beban pada elemen](/screenshots/id/qs-load.webp){.shot-md}

`fz` positif mengarah ke +z, yaitu **ke bawah** di layar, jadi nilai positif adalah beban gravitasi. Lihat [konvensi tanda](/id/elements/conventions).

## 7. Baca hasilnya {#_7-read-the-results}

Solusi muncul begitu beban ditambahkan. Panel tampilan di kanan atas mengaktifkan dan menonaktifkan diagram. **Bentuk deformasi**, **M<sub>y</sub>(x)**, dan **Reaksi** aktif secara bawaan. Centang **V<sub>z</sub>(x)** untuk menambahkan gaya geser.

![Gaya geser (hijau), momen lentur (merah), reaksi (ungu), dan bentuk deformasi](/screenshots/id/qs-results.webp)

| Lapisan | Yang seharusnya terlihat |
| --- | --- |
| **Reaksi** | Dua panah ke atas sebesar **36 kN** di joint 1 dan 2. |
| **V<sub>z</sub>(x)** | Garis lurus dari **+36 kN** di kiri hingga **−36 kN** di kanan, bernilai nol di tengah bentang. |
| **M<sub>y</sub>(x)** | Parabola dengan nilai ekstrem **54 kNm** di tengah bentang. |
| **Bentuk deformasi** | Lendutan yang simetris. Arahkan kursor ke joint `1` untuk membaca rotasinya: **2,6469 · 10⁻² rad**. |

Tab **Hasil** di bilah bawah memberikan angkanya. **Hasil joint** mencantumkan `Dx`, `Dz`, `Ry` untuk setiap joint. **Hasil elemen** mencantumkan gaya ujung setiap elemen dalam sistem koordinat lokalnya.

Jika diagram terlihat terlalu besar atau terlalu kecil, ubah **Skala hasil** di **Pengaturan → Pengaturan tampilan → Ukuran**.

## 8. Periksa secara manual {#_8-check-by-hand}

| Besaran | Rumus | Nilai manual | EduBeam |
| --- | --- | --- | --- |
| Reaksi | $R = qL/2$ | 36 kN | 36 kN |
| Gaya geser maks. | $V = qL/2$ | 36 kN | 36 kN |
| Momen maks. | $M = qL^2/8$ | 54 kNm | 54 kNm |
| Rotasi ujung | $\varphi = qL^3/(24EI)$ | 0,02647 rad | 0,02647 rad |
| Lendutan tengah bentang (lentur) | $w = 5qL^4/(384EI)$ | 49,63 mm | |
| Lendutan tengah bentang (geser) | $w_s = qL^2/(8kGA)$ | 0,23 mm | |
| Lendutan tengah bentang (total) | jumlah | 49,86 mm | 49,86 mm |

Tidak ada joint di tengah bentang, jadi untuk membaca lendutan di sana, tambahkan satu: pilih tombol **Tambah joint** yang kedua, klik balok di `X = 3`, dan pilih **Sambungkan ke struktur**. Balok terbagi menjadi dua dan `Dz` joint baru di **Hasil** menunjukkan 49,86 mm. Pembagian ini tidak mengubah hasil apa pun, karena elemennya eksak.

Semuanya cocok. Resep pemeriksaan manual lainnya (kantilever, balok jepit-jepit, rangka batang, suhu) ada di [Memeriksa hasil secara manual](/id/guide/verification).

## 9. Bereksperimen {#_9-experiment}

Di sinilah EduBeam menunjukkan manfaatnya. Coba masing-masing berikut dan amati diagramnya berubah:

- **Seret joint 2** ke kanan: momen bertambah sebanding dengan $L^2$.
- **Centang `Ry` di joint 1** untuk menjepitnya: momen di tengah bentang turun dan momen negatif muncul di tumpuan.
- **Centang `Dz` di joint tengah bentang** yang baru saja Anda tambahkan, untuk membuat balok menerus dua bentang.
- **Centang sendi ujung** pada elemen di tab Elemen untuk melepas momen di satu ujung.
- Tekan <kbd>Ctrl</kbd>+<kbd>Z</kbd> untuk mengurungkan langkah apa pun.

## 10. Simpan atau bagikan {#_10-save-or-share}

- **Bagikan model** (di bilah aplikasi atau menu ☰) memberi Anda tautan yang memuat seluruh model. Tempelkan ke e-mail, chat, atau slide Anda.
- **☰ → Simpan proyek** (<kbd>Ctrl</kbd>+<kbd>S</kbd>) mengunduh `project.json` yang dapat dibuka nanti dengan **Buka proyek** atau dengan menjatuhkannya ke aplikasi.
- **☰ → Ekspor gambar** (<kbd>Ctrl</kbd>+<kbd>P</kbd>) menyimpan gambar sebagai PNG atau SVG untuk laporan.

Model Anda juga disimpan di browser, jadi memuat ulang halaman tidak menghilangkannya. Lihat [Impor, ekspor & berbagi](/id/essentials/import-export).

## Selanjutnya {#where-next}

- [Tutorial portal tiga sendi](/id/tutorials/three-hinged-frame): portal dengan sendi dalam, diperiksa secara manual.
- [Contoh](/id/examples/): buka portal dan rangka batang siap pakai dengan satu klik.
- [Beban](/id/essentials/loads): beban trapesium, terpusat, dan suhu, serta perpindahan tumpuan.
- [Keyboard, mouse & sentuh](/id/reference/shortcuts): bekerja lebih cepat di kanvas.
