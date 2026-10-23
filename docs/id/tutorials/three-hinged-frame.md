---
description: "Tutorial langkah demi langkah: modelkan portal tiga sendi dengan beban merata di EduBeam, lalu periksa reaksi dan momen lentur secara manual. Sekitar 15 menit."
---

# Tutorial: portal tiga sendi

Portal tiga sendi adalah struktur statis tertentu: tiga persamaan keseimbangan ditambah syarat $M = 0$ di sendi memberikan keempat reaksi tumpuan. Karena itu portal ini sangat cocok untuk memeriksa setiap angka yang digambar EduBeam. Sediakan waktu sekitar 15 menit.

![Portal yang sudah selesai: momen lentur dan reaksi](/screenshots/id/tut-frame-moment.webp)

[Buka model yang sudah jadi](https://run.edubeam.app/?model=eyJuIjpbWyJBIixbMCwwLDBdLFswLDJdLG51bGxdLFsiQiIsWzAsMCwtNF0sW10sbnVsbF0sWyJDIixbNCwwLC00XSxbXSxudWxsXSxbIkQiLFs4LDAsLTRdLFtdLG51bGxdLFsiRSIsWzgsMCwwXSxbMCwyXSxudWxsXV0sImUiOltbIjEiLFsiQSIsIkIiXSwiMSIsIjEiLFtmYWxzZSxmYWxzZV1dLFsiMiIsWyJCIiwiQyJdLCIxIiwiMSIsW2ZhbHNlLHRydWVdXSxbIjMiLFsiQyIsIkQiXSwiMSIsIjEiLFtmYWxzZSxmYWxzZV1dLFsiNCIsWyJEIiwiRSJdLCIxIiwiMSIsW2ZhbHNlLGZhbHNlXV1dLCJtIjpbWyIxIiw3ODUwLDIxMDAwMDAwMDAwMCw4MTAwMDAwMDAwMCwwLjAwMDAxMl1dLCJjcyI6W1siMSIsMC4wMDUzOCwwLjAwMDA4MzU2LDAuMywxXV0sImVsIjpbWyIyIixbMCwxMDAwMF0sZmFsc2VdLFsiMyIsWzAsMTAwMDBdLGZhbHNlXV0sImQiOltdfQ%3D%3D&lang=id){target="_blank"} jika Anda hanya ingin menjelajahinya.

## Soal {#the-problem}

- Dua kolom setinggi 4 m, dengan tumpuan sendi di kaki A dan E, berjarak 8 m.
- Balok horizontal B–D di atasnya, dengan sendi di tengah bentang C.
- Beban merata $q = 10$ kN/m di sepanjang balok.
- Baja ($E = 210$ GPa, $G = 81$ GPa), IPE 300 ($A = 53{,}8$ cm², $I_y = 8356$ cm⁴, $h = 300$ mm).

| Joint | X [m] | Z [m] | Tumpuan |
| --- | --- | --- | --- |
| A | 0 | 0 | sendi |
| B | 0 | −4 | |
| C | 4 | −4 | (sendi di balok) |
| D | 8 | −4 | |
| E | 8 | 0 | sendi |

Ingat bahwa **z mengarah ke bawah**, jadi puncak kolom berada di `Z = −4`.

## 1. Material dan penampang {#_1-material-and-section}

1. **Hapus model** (centang *Hapus material* dan *Hapus penampang*).
2. *Material* → **Pustaka material** → **Steel (S235)**.
3. *Penampang* → **Tambah penampang**: `Luas = 0,00538`, `Iy = 8,356e-5`, `Tinggi = 0,3`, `Koefisien geser = 1`.

Penampang hanya memengaruhi perpindahan. Portal ini statis tertentu, jadi gaya dalamnya sama sekali tidak bergantung pada $E$, $A$, atau $I$.

## 2. Gambar portal {#_2-draw-the-frame}

Cara tercepat adalah satu polyline dengan mouse:

1. Pastikan **Snap ke grid** aktif (tombol **S**).
2. Tab *Elemen* → tombol **Tambah elemen** yang kedua (ikon kursor).
3. Klik di (0, 0), lalu (0, −4), (4, −4), (8, −4), dan (8, 0). Perhatikan penggaris dan crosshair untuk menemukan titik-titiknya. Setiap klik menambahkan joint dan menyambungkannya ke joint sebelumnya.
4. Tekan <kbd>Esc</kbd> untuk selesai, lalu <kbd>F</kbd> untuk menyesuaikan portal dengan layar.

Sekarang Anda memiliki lima joint dan empat elemen. Gambar di sini memberi label joint A–E; ganti nama joint Anda di tabel *Joint* jika mau, atau biarkan 1–5. Periksa koordinat di tabel dan perbaiki yang tidak tepat pada grid.

## 3. Tumpuan dan sendi {#_3-supports-and-the-hinge}

1. Klik joint A, buka **Tumpuan joint**, dan pilih **Sendi**. Lakukan hal yang sama untuk joint E.
2. Di tabel *Elemen*, cari elemen dari B ke C dan centang sendi **akhir**-nya (kotak kedua di *Sendi ujung*).

![Tabel Elemen: sendi berada di ujung akhir elemen 2, di joint C](/screenshots/id/elements-table.webp)

::: tip Satu sendi, bukan dua
Memberi sendi pada ujung akhir elemen B–C sudah cukup: momen di C menjadi nol, karena C–D tidak dapat menyalurkan momen ke joint yang hanya dipegang kaku olehnya sendiri. Centang juga awal C–D dan tidak ada yang berubah. Tetapi jika Anda juga mencentang sendi di B, portal menjadi mekanisme. Cobalah: EduBeam menunjukkan bagaimana portal bergerak.
:::

## 4. Beban {#_4-load}

*Beban* → **Tambah beban elemen** → *Beban merata*, elemen B–C, `fz = 10` kN/m. Ulangi untuk elemen C–D. Baloknya horizontal, jadi kotak LCS tidak berpengaruh di sini.

## 5. Hasil {#_5-results}

Opsi tampilan dimulai dengan bentuk deformasi, momen lentur, dan reaksi yang aktif. Centang **N (x)** dan **V<sub>z</sub> (x)** untuk melihat sisanya.

<div class="shots">

![Momen lentur dan reaksi](/screenshots/id/tut-frame-moment.webp)

![Gaya normal](/screenshots/id/tut-frame-normal.webp)

![Gaya geser](/screenshots/id/results-shear.webp)

![Bentuk deformasi](/screenshots/id/results-deformed.webp)

</div>

## 6. Periksa secara manual {#_6-check-by-hand}

**Reaksi vertikal.** Karena simetri, setiap kaki menerima setengah beban:

$$V_A = V_E = \frac{q \cdot 8}{2} = 40\ \text{kN}$$

**Reaksi horizontal.** Ambil momen terhadap sendi C untuk separuh kiri portal. Momen di sana harus nol:

$$V_A \cdot 4 - H_A \cdot 4 - q \cdot 4 \cdot 2 = 0 \quad\Rightarrow\quad H_A = \frac{160 - 80}{4} = 20\ \text{kN}$$

Kedua kaki mendorong ke dalam sebesar 20 kN; gaya dorong horizontal inilah yang membuat portal tiga sendi efisien.

**Gaya dalam.**

| Besaran | Rumus | Nilai manual | EduBeam |
| --- | --- | --- | --- |
| Reaksi vertikal | $qL/2$ | 40 kN | 40 kN |
| Reaksi horizontal | dari $M_C = 0$ | 20 kN | 20 kN |
| Momen di sudut B dan D | $H \cdot h$ | 80 kNm, tarik di sisi luar | −80 kNm |
| Momen di sendi C | | 0 | 0 |
| Gaya normal di kolom | $-V_A$ | −40 kN | −40 kN |
| Gaya normal di balok | $-H_A$ | −20 kN | −20 kN |
| Gaya geser di kolom | $H_A$ | 20 kN | −20 kN (A–B), +20 kN (D–E) |
| Gaya geser di balok di B | $V_A$ | 40 kN | 40 kN |
| Gaya geser di balok di C | $V_A - 4q$ | 0 | 0 |
| Gaya geser di balok di D | $V_A - 8q$ | −40 kN | −40 kN |

Kedua kolom memiliki tanda gaya geser yang berlawanan meskipun memikul gaya yang sama, karena sumbu lokal setiap elemen mengikuti arahnya: A–B digambar ke atas dan D–E ke bawah. Tukar joint salah satu kolom dan tandanya berbalik.

Di balok, $M(x) = -80 + 40x - 5x^2$ kNm (x diukur dari B), yang bernilai nol di sendi dan tidak pernah positif: seluruh balok mengalami momen negatif (serat atas tertarik). Gaya geser $V(x) = 40 - 10x$ turun ke nol tepat di C, jadi nilai ekstrem momen juga berada di sendi.

**Perpindahan.** Sendi C turun 43,1 mm (*Hasil → Hasil joint*, `Dz` dari C). Perpindahan ini berasal dari lentur keempat batang dan merupakan latihan yang baik untuk prinsip kerja virtual.

## 7. Bereksperimen {#_7-experiment}

- **Hapus centang sendi** di C. Portal menjadi statis tak tentu berderajat satu; momen di sudut berkurang dan momen positif muncul di tengah bentang. Sekarang penampang berpengaruh: coba balok yang lebih kaku.
- **Jepit kaki kolom** (pilih tumpuan **Jepit**). Momen muncul di A dan E.
- **Tambahkan beban horizontal**: beban joint `Fx = 10` kN di B. Portal bergoyang, dan reaksinya tidak lagi simetris. Periksa dengan tiga persamaan yang sama dan $M_C = 0$.
- **Centang juga sendi di B.** Portal sekarang menjadi mekanisme, dan EduBeam menganimasikan bagaimana portal dapat bergerak.
