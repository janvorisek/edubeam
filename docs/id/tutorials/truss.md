---
description: "Tutorial langkah demi langkah: buat rangka batang bidang di EduBeam dan periksa gaya batangnya dengan metode titik simpul dan metode potongan. Sekitar 15 menit."
---

# Tutorial: rangka batang bidang

Tutorial ini membuat rangka batang kecil yang statis tertentu, memeriksa gaya batangnya dengan metode titik simpul dan metode potongan, serta menemukan batang tanpa gaya. Sediakan waktu sekitar 15 menit.

![Rangka batang yang sudah selesai: gaya normal dan reaksi](/screenshots/id/tut-truss.webp)

[Buka model yang sudah jadi](https://run.edubeam.app/?model=eyJuIjpbWyIxIixbMCwwLDBdLFswLDJdLG51bGxdLFsiMiIsWzQsMCwwXSxbXSxudWxsXSxbIjMiLFs4LDAsMF0sW10sbnVsbF0sWyI0IixbMTIsMCwwXSxbMl0sbnVsbF0sWyI1IixbNCwwLC0zXSxbXSxudWxsXSxbIjYiLFs4LDAsLTNdLFtdLG51bGxdXSwiZSI6W1siMSIsWyIxIiwiMiJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiMiIsWyIyIiwiMyJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiMyIsWyIzIiwiNCJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiNCIsWyI1IiwiNiJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiNSIsWyIxIiwiNSJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiNiIsWyIyIiwiNSJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiNyIsWyI1IiwiMyJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiOCIsWyIzIiwiNiJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiOSIsWyI2IiwiNCJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dXSwibSI6W1siMSIsNzg1MCwyMTAwMDAwMDAwMDAsODEwMDAwMDAwMDAsMC4wMDAwMTJdXSwiY3MiOltbIjEiLDAuMDAyLDAuMDAwMDAxLDAuMSwxXV0sIm5sIjpbWyIyIix7IjAiOjAsIjIiOjMwMDAwLCI0IjowfV0sWyIzIix7IjAiOjAsIjIiOjMwMDAwLCI0IjowfV1dLCJkIjpbXX0%3D&lang=id){target="_blank"} jika Anda hanya ingin menjelajahinya.

## Soal {#the-problem}

![Geometri, tumpuan, dan beban](/screenshots/id/tut-truss-model.webp)

- Bentang 12 m yang terbagi menjadi tiga panel 4 m, dengan tinggi 3 m.
- Joint batang bawah 1–4, joint batang atas 5 dan 6.
- Sendi di joint 1 dan rol di joint 4.
- Dua beban 30 kN, di joint batang bawah 2 dan 3.
- Batang baja dengan $A = 20$ cm².

| Joint | X [m] | Z [m] | Tumpuan | Beban |
| --- | --- | --- | --- | --- |
| 1 | 0 | 0 | sendi | |
| 2 | 4 | 0 | | `Fz = 30` kN |
| 3 | 8 | 0 | | `Fz = 30` kN |
| 4 | 12 | 0 | rol | |
| 5 | 4 | −3 | | |
| 6 | 8 | −3 | | |

Batang: batang bawah 1–2, 2–3, 3–4; batang atas 5–6; diagonal ujung 1–5 dan 6–4; batang vertikal 2–5 dan 3–6; dan diagonal tengah 5–3.

**Apakah statis tertentu?** $m + r = 9 + 3 = 12 = 2j$ dengan $j = 6$ joint, jadi ya: gaya batang dapat diperoleh dari keseimbangan saja.

## 1. Material dan penampang {#_1-material-and-section}

1. **Hapus model** (centang *Hapus material* dan *Hapus penampang*).
2. *Material* → **Pustaka material** → **Steel (S235)**.
3. *Penampang* → **Tambah penampang**: `Luas = 0,002`, `Iy = 1e-6`, `Tinggi = 0,1`, `Koefisien geser = 1`. Untuk batang bersendi, hanya luas yang berpengaruh.

## 2. Gambar batang dengan sendi {#_2-draw-the-bars-with-hinges}

Batang rangka di EduBeam adalah elemen balok dengan **kedua sendi ujung** dicentang. Alat mouse dapat mengaturnya untuk Anda:

1. Tab *Elemen* → tombol **Tambah elemen** yang kedua (ikon kursor).
2. Di banner di bagian atas tampilan, centang **Sendi awal** dan **Sendi akhir**. Setiap batang yang Anda gambar sekarang mendapatkan keduanya.
3. Gambar garis luarnya sebagai satu polyline: klik (0, 0), (4, −3), (8, −3), (12, 0), lalu kembali menyusuri bagian bawah: (8, 0), (4, 0), (0, 0). Tekan <kbd>Esc</kbd>.
4. Gambar batang dalam satu per satu, dengan menekan <kbd>Esc</kbd> setelah masing-masing: (4, 0) → (4, −3), (4, −3) → (8, 0), (8, 0) → (8, −3).
5. Tekan <kbd>F</kbd> untuk menyesuaikan dengan layar.

Periksa tabel *Elemen*: sembilan elemen, masing-masing dengan kedua *Sendi ujung* dicentang. Nomor joint dan elemen Anda mungkin berbeda dari gambar; itu tidak masalah.

## 3. Tumpuan dan beban {#_3-supports-and-loads}

1. Klik joint di (0, 0) → **Tumpuan joint** → **Sendi**. Klik joint di (12, 0) → **Rol**.
2. Klik joint di (4, 0) → **Tambah beban** → `Fz = 30` kN. Lakukan hal yang sama di (8, 0).

`Fz` positif mengarah ke bawah. Joint rangka batang bebas berotasi; EduBeam menerima joint yang semua batangnya bersendi dan melaporkan rotasinya sebagai 0.

## 4. Hasil {#_4-results}

Di opsi tampilan, hapus centang **Bentuk deformasi** dan **M<sub>y</sub> (x)** (tidak ada lentur pada rangka batang) dan centang **N (x)**.

![Gaya normal: tarik bernilai positif](/screenshots/id/tut-truss.webp)

## 5. Periksa secara manual {#_5-check-by-hand}

**Reaksi.** Bebannya simetris, jadi $R_1 = R_4 = 30$ kN ke atas, dan reaksi horizontal di sendi bernilai nol.

**Joint 1** (metode titik simpul). Diagonal ujung 1–5 panjangnya 5 m ($\sin\alpha = 3/5$, $\cos\alpha = 4/5$):

$$\sum F_z:\ N_{15} \cdot \tfrac{3}{5} = -30 \Rightarrow N_{15} = -50\ \text{kN} \qquad \sum F_x:\ N_{12} = -N_{15} \cdot \tfrac{4}{5} = 40\ \text{kN}$$

**Joint 2.** Batang vertikal 2–5 adalah satu-satunya batang yang dapat menyalurkan beban 30 kN ke atas: $N_{25} = +30$ kN, dan $N_{23} = N_{12} = 40$ kN.

**Potongan melalui panel tengah.** Potong batang 5–6, 5–3, dan 2–3, lalu tinjau bagian kiri:

- Momen terhadap joint 3: $R_1 \cdot 8 - 30 \cdot 4 + N_{56} \cdot 3 = 0 \Rightarrow N_{56} = -40$ kN.
- Gaya vertikal: gaya geser di panel adalah $R_1 - 30 = 0$, jadi diagonal **5–3 tidak memikul gaya**: $N_{53} = 0$.

| Batang | Nilai manual | EduBeam |
| --- | --- | --- |
| Batang bawah 1–2, 2–3, 3–4 | +40 kN (tarik) | 40 |
| Batang atas 5–6 | −40 kN (tekan) | −40 |
| Diagonal ujung 1–5, 6–4 | −50 kN | −50 |
| Batang vertikal 2–5, 3–6 | +30 kN | 30 |
| Diagonal tengah 5–3 | 0 | 0 |

Lendutan joint 2 adalah 2,29 mm (*Hasil → Hasil joint*). Sebagai latihan, hitung dengan kerja virtual, $\delta = \sum N n L / (EA)$.

## 6. Bereksperimen {#_6-experiment}

- **Pindahkan satu beban.** Letakkan kedua beban 30 kN di joint 2. Diagonal tengah sekarang memikul gaya: tandanya apa, dan mengapa?
- **Hapus diagonal tengah.** Rangka batang menjadi mekanisme; EduBeam melingkari sendi penyebabnya dan menunjukkan bagaimana panel itu bergeser.
- **Hapus centang semua sendi.** Rangka batang menjadi portal dengan joint kaku. Centang **M<sub>y</sub> (x)**: momen lenturnya sangat kecil dibandingkan gaya aksial, itulah sebabnya idealisasi sambungan sendi dapat dipakai.
- **Pasang sendi di kedua tumpuan.** Satu reaksi tambahan membuatnya statis tak tentu, dan gaya batang bawah kini bergantung pada luas batang.
