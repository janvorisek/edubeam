---
description: "Konvensi tanda EduBeam: sumbu global x ke kanan dan z ke bawah, perpindahan, rotasi, dan beban positif, sumbu lokal elemen, gaya dalam, dan reaksi."
---

# Sistem koordinat & konvensi tanda

Sebagian besar hasil yang "salah" di <Edubeam /> sebenarnya adalah kejutan konvensi tanda. Semua yang dijelaskan di bawah adalah yang benar-benar dipakai solver.

## Sumbu global {#global-axes}

- **x** — horizontal, positif ke **kanan**.
- **z** — vertikal, positif **ke bawah** di layar.
- **y** — sumbu tegak lurus bidang (mengarah ke pengamat pada sistem tangan kanan). Rotasi dan momen diukur terhadap y.

Indikator sumbu di sudut grid menunjukkan x (merah) dan z (hijau). Karena itu, joint di puncak kolom setinggi 3 m memiliki `Z = −3` jika kakinya berada di `Z = 0`.

## Derajat kebebasan {#degrees-of-freedom}

Setiap joint memiliki `Dx`, `Dz` (translasi) dan `Ry` (rotasi). `Dz` positif adalah perpindahan ke bawah; `Ry` positif adalah rotasi **berlawanan arah jarum jam** di layar. Tanda yang sama berlaku untuk perpindahan tumpuan dan hasil joint yang dilaporkan.

## Beban {#loads}

| Beban | Arah positif |
| --- | --- |
| `Fx`, `fx`, `f1x`… | +x (ke kanan; atau searah x lokal elemen saat LCS aktif) |
| `Fz`, `fz`, `f1z`… | +z (**ke bawah**; atau searah z lokal saat LCS aktif) |
| `My` | berlawanan arah jarum jam di layar |
| `ΔTc` | pemanasan (perpanjangan) |
| `ΔTb − ΔTt` | serat bawah lebih panas daripada serat atas |

Jadi beban gravitasi adalah `fz` **positif**, dan beban angin yang mendorong kolom kiri ke kanan adalah `fx` positif.

## Sumbu lokal elemen {#element-local-axes}

Sumbu **x** lokal mengarah dari joint awal ke joint akhir; sumbu **z** lokal tegak lurus terhadapnya, diperoleh dengan memutar sumbu global sebesar sudut elemen $\alpha$. Untuk elemen horizontal yang digambar dari kiri ke kanan, sumbu lokal dan global berimpit. Gunakan **Tukar joint** di tabel *Elemen* untuk membalik arahnya.

## Gaya dalam {#internal-forces}

| Besaran | Positif berarti |
| --- | --- |
| **N** | tarik |
| **V<sub>z</sub>** | tanda yang lazim dalam teori balok: pada balok sederhana dengan beban gravitasi, V positif di tumpuan kiri dan negatif di tumpuan kanan |
| **M<sub>y</sub>** | **serat bawah (+z) tertarik**. Balok sederhana dengan beban gravitasi memiliki momen positif di tengah bentang; kantilever dengan beban di ujung memiliki momen negatif (serat atas tertarik) di jepitnya |

## Gaya ujung (tabel Hasil elemen) {#end-forces-element-results-table}

`X12, Z12, M12` bekerja pada elemen di joint awal, `X21, Z21, M21` di joint akhir, dalam sistem **lokal**, dengan arah positif yang sama seperti sumbu lokal dan `My`. Ini adalah gaya yang diberikan joint pada elemen, yaitu $\mathbf{f} = \mathbf{K}_l\,\mathbf{u}_l - \mathbf{f}_{eq}$, dengan $\mathbf{f}_{eq}$ adalah beban joint ekuivalen dari beban elemen. Jumlah gaya ujung semua elemen yang bertemu di sebuah joint seimbang dengan beban joint dan reaksi di joint tersebut.

## Reaksi {#reactions}

Reaksi ada untuk setiap DOF yang ditahan dan dilaporkan dalam sistem koordinat joint (diputar sebesar sudut LCS joint jika diatur). Panah reaksi di tampilan mengarah ke arah tumpuan mendorong struktur.

## Sumbu y ke atas {#y-up-axes}

**Pengaturan → Sistem koordinat → x ke kanan, y ke atas** mengalihkan semua yang Anda ketik dan baca ke sistem buku teks: **x** ke kanan, **y** ke atas, dan **z** ke arah pengamat. Model, file yang disimpan, dan gambar tetap sama; hanya angka dan nama yang berubah:

| Besaran | z ke bawah (bawaan) | y ke atas |
| --- | --- | --- |
| Koordinat vertikal | `Z` | `Y`, tanda berlawanan |
| Beban, perpindahan, reaksi, gaya ujung vertikal | `Fz`, `fz`, `Dz`, `Z12`… | `Fy`, `fy`, `Dy`, `Y12`…, tanda berlawanan |
| Rotasi dan momen | `Ry`, `My` | `Rz`, `Mz`, tanda sama (positif berlawanan arah jarum jam) |
| Sudut tumpuan α | diukur searah jarum jam | diukur berlawanan arah jarum jam, tanda berlawanan |
| Gaya dalam N, V, M | | tidak berubah, diagram digambar dengan cara yang sama |

Jadi beban gravitasi adalah `fy` **negatif**, dan puncak kolom setinggi 3 m memiliki `Y = 3`.

## Satuan {#units}

Solver bekerja secara internal dalam SI (m, N, Pa, rad, K). Satuan tampilan hanya memengaruhi apa yang Anda ketik dan baca; mengubahnya tidak pernah mengubah model.
