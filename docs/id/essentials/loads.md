---
description: "Gaya dan momen joint, penurunan tumpuan, beban elemen merata, trapesium, dan terpusat, serta beban suhu, masing-masing dengan konvensi tandanya."
---

# Beban

Semua beban berada dalam **satu kasus beban** dan bekerja bersamaan. Untuk membandingkan skenario, simpan masing-masing sebagai file proyek atau tautan berbagi.

![Setiap tipe beban pada satu balok menerus: gaya joint, beban merata, beban trapesium, beban terpusat, beban suhu, dan penurunan tumpuan](/screenshots/id/loads-overview.webp)

<LoadShowcase />

## Konvensi tanda dalam satu kalimat {#sign-convention-in-one-line}

Sumbu global **x** mengarah ke kanan dan sumbu global **z** mengarah **ke bawah**. Karena itu `Fz` atau `fz` positif adalah beban ke bawah seperti gravitasi, dan momen positif `My` berputar berlawanan arah jarum jam di layar. Rinciannya ada di [Sistem koordinat & konvensi tanda](/id/elements/conventions). Dengan [sumbu y ke atas](/id/elements/conventions#y-up-axes), nama dan tanda besaran vertikal berbalik: gravitasi adalah `Fy` negatif.

## Beban joint {#nodal-loads}

Tab *Beban* → **Tambah beban joint**, atau klik joint → **Tambah beban**. Pilih **Gaya/Momen**:

| Kolom | Arti | Satuan |
| --- | --- | --- |
| `Fx` | gaya horizontal (positif ke kanan) | satuan gaya |
| `Fz` | gaya vertikal (positif ke bawah) | satuan gaya |
| `My` | momen terhadap y (positif berlawanan arah jarum jam) | satuan momen |

![Tambah beban joint. Pratinjau menunjukkan arah saat Anda mengetik.](/screenshots/id/loads-nodal.webp){.shot-md}

Komponen selalu dalam sistem koordinat **global**. Sebuah joint dapat memikul beberapa beban joint; semuanya dijumlahkan dan digambar bertumpuk.

### Perpindahan tumpuan (penurunan tumpuan) {#prescribed-displacements-support-settlements}

Di dialog yang sama pilih **Perpindahan tumpuan**, atau klik joint yang bertumpuan → **Tetapkan perpindahan**. Kolomnya berubah menjadi:

| Kolom | Arti | Satuan |
| --- | --- | --- |
| `Dx` | perpindahan horizontal yang diberikan | satuan perpindahan |
| `Dz` | perpindahan vertikal yang diberikan (positif ke bawah) | satuan perpindahan |
| `Ry` | rotasi yang diberikan | rad |

Anda hanya dapat memasukkan nilai untuk DOF yang **ditahan** di joint tersebut, karena hanya tumpuan yang dapat dipindahkan. Setiap joint memiliki paling banyak satu perpindahan tumpuan; edit yang sudah ada alih-alih menambahkan yang kedua. Pada struktur statis tertentu, penurunan tumpuan menghasilkan perpindahan tetapi tidak menimbulkan gaya dalam; pada struktur statis tak tentu, keduanya terjadi.

## Beban elemen {#element-loads}

Tab *Beban* → **Tambah beban elemen**, atau klik elemen → **Tambah beban**. Pilih **Tipe beban**; dialog menampilkan pratinjau beban pada elemen saat Anda mengetik.

### Beban merata {#uniformly-distributed-load}

| Kolom | Arti | Satuan |
| --- | --- | --- |
| `fx` | beban per satuan panjang searah x | gaya / panjang |
| `fz` | beban per satuan panjang searah z | gaya / panjang |
| **LCS** | dicentang: `fx`, `fz` bekerja searah sumbu lokal elemen; tidak dicentang: searah sumbu global | – |

**LCS** dicentang secara bawaan. Pada elemen horizontal yang digambar dari kiri ke kanan, sumbu lokal dan global sama, jadi tidak ada bedanya. Pada batang miring ada bedanya:

- beban **tegak lurus batang** (angin pada kaso) adalah `fz` dengan LCS **dicentang**;
- beban **vertikal** per meter panjang batang (berat sendiri) adalah `fz` dengan LCS **tidak dicentang**;
- beban vertikal per meter proyeksi *horizontal* (salju) tidak tersedia secara langsung. Kalikan dulu dengan $\cos\alpha$, dengan $\alpha$ adalah kemiringan batang, lalu masukkan sebagai beban vertikal.

### Beban trapesium {#trapezoidal-load}

| Kolom | Arti |
| --- | --- |
| `f1x`, `f1z` | intensitas di joint **awal** |
| `f2x`, `f2z` | intensitas di joint **akhir** |

Intensitas berubah secara linear dari awal hingga akhir elemen. Beban segitiga memiliki `f1z = 0`. Beban trapesium selalu bekerja searah **sumbu lokal elemen** (kotak LCS terkunci); pada elemen horizontal sama dengan sumbu global.

### Beban terpusat {#concentrated-load}

Gaya atau momen terpusat di sembarang titik **di sepanjang** elemen, tanpa perlu joint tambahan.

| Kolom | Arti |
| --- | --- |
| `Fx`, `Fz`, `My` | komponen gaya dan momen |
| **Posisi beban dari joint awal** | jarak dari joint awal, `0 ≤ a ≤ L` |
| **LCS** | komponen searah sumbu lokal |

Diagram gaya geser melompat sebesar `Fz` di titik beban dan diagram momen memiliki patahan di sana; nilai momen di titik itu diberi label secara otomatis. `My` terpusat justru membuat diagram momen melompat.

### Beban suhu {#temperature-load}

| Kolom | Arti |
| --- | --- |
| **ΔT<sub>c</sub>**, perubahan suhu aksial | perubahan merata pada seluruh penampang, menghasilkan perpanjangan $\alpha\,\Delta T_c\,L$ |
| **ΔT<sub>b</sub> − ΔT<sub>t</sub>**, selisih suhu | serat bawah dikurangi serat atas, menghasilkan kelengkungan $\alpha\,(\Delta T_b - \Delta T_t)/h$ |

Beban suhu memakai **α** material dan **tinggi h** penampang. `ΔTb − ΔTt` positif (lebih panas di bawah) memperpanjang serat bawah, sehingga elemen melendut seperti balok yang dibebani gravitasi. Pada struktur statis tertentu, suhu hanya menimbulkan perpindahan; kekangan (ujung jepit, kontinuitas, batang lebih) mengubahnya menjadi gaya dalam.

<div class="shots">

![Beban merata](/screenshots/id/loads-udl.webp)

![Beban trapesium](/screenshots/id/loads-trapezoidal.webp)

![Beban terpusat](/screenshots/id/loads-concentrated.webp)

![Beban suhu](/screenshots/id/loads-temperature.webp)

</div>

## Mengedit dan menghapus beban {#editing-and-removing-loads}

- Setiap beban adalah satu baris di tab *Beban*, tempat Anda dapat mengedit komponennya dan tanda LCS di tempat. Beban juga muncul sebagai label di tabel *Joint* dan *Elemen*.
- **Klik ganda** beban di tampilan, atau klik lalu pilih **Edit beban**, untuk membuka dialog edit.
- Pilih beban dan tekan <kbd>Delete</kbd>, atau gunakan × di tabel.
- Beban yang terpasang pada joint atau elemen ikut terhapus bersamanya, dan ikut tersalin saat Anda menyalin dan menempel.

![Tab Beban: satu baris per beban, komponennya dapat diedit di tempat](/screenshots/id/loads-table.webp)

## Yang tidak tersedia {#what-is-not-available}

- **Kasus beban dan kombinasi.** Hanya ada satu kasus beban.
- **Berat sendiri.** Masukkan sebagai beban merata dengan LCS tidak dicentang: $f_z = \rho\,g\,A$. Untuk IPE 200, 7850 × 9,81 × 0,00285 ≈ 0,22 kN/m.
- **Beban trapesium dalam sumbu global** pada batang miring.
