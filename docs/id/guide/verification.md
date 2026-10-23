---
description: "Pemeriksaan hasil EduBeam dengan rumus tertutup: balok sederhana, kantilever, balok jepit-jepit dan jepit-rol, rangka dua batang, gradien suhu, dan perpindahan tumpuan."
---

# Memeriksa hasil secara manual

<Edubeam /> adalah tempat yang baik untuk melatih kebiasaan yang dibutuhkan setiap insinyur: jangan pernah memercayai angka yang tidak dapat Anda hitung ulang secara kasar. Halaman ini memberikan rumus bentuk tertutup untuk kasus-kasus klasik dan menunjukkan hasil yang dilaporkan aplikasi, sehingga Anda dapat membuat setiap model sendiri dan membandingkannya.

Untuk contoh lengkap dengan pemeriksaan manual, lihat tutorial [portal tiga sendi](/id/tutorials/three-hinged-frame) dan [rangka batang bidang](/id/tutorials/truss).

Semua kasus memakai penampang baja yang sama kecuali disebutkan lain: $E = 210\,000$ MPa, $G = 81\,000$ MPa, $A = 28{,}5$ cm², $I_y = 1943$ cm⁴, $h = 200$ mm, $k = 1$ (IPE 200).

$$EI = 210 \times 10^9 \cdot 1{,}943 \times 10^{-5} = 4{,}080 \times 10^6\ \text{Nm}^2$$

::: tip Mengapa angkanya sedikit berbeda
EduBeam memakai balok **Timoshenko**, yang menambahkan lendutan geser $\Delta w_s$ pada lendutan lentur Euler–Bernoulli klasik. Rotasi, reaksi, dan gaya dalam pada struktur statis tertentu tidak terpengaruh. Untuk batang langsing suku tambahan ini sangat kecil; tabel di bawah menampilkannya secara terpisah.
:::

## Balok sederhana, beban merata {#simply-supported-beam-uniform-load}

$L = 6$ m, $q = 12$ kN/m. Tumpuan: joint 1 `Dx + Dz`, joint 2 `Dz`.

| Besaran | Rumus | Nilai | EduBeam |
| --- | --- | --- | --- |
| Reaksi | $qL/2$ | 36 kN | 36 kN |
| $V_{max}$ | $qL/2$ | 36 kN | 36 kN |
| $M_{max}$ (tengah bentang) | $qL^2/8$ | 54 kNm | 54 kNm |
| Rotasi ujung | $qL^3/(24EI)$ | 0,02647 rad | 0,02647 rad |
| Lendutan tengah bentang (lentur) | $5qL^4/(384EI)$ | 49,63 mm | — |
| Lendutan tengah bentang (geser) | $qL^2/(8kGA)$ | 0,23 mm | — |
| Lendutan tengah bentang (total) | jumlah | 49,86 mm | 49,86 mm |

Untuk membaca lendutan tengah bentang, tambahkan joint di tengah bentang dengan *Tambah joint* (mouse) → **Sambungkan ke struktur**; membagi elemen tidak mengubah hasil apa pun.

<ExampleStructure />

## Kantilever, beban di ujung {#cantilever-tip-load}

$L = 4$ m, $F = 18$ kN ke bawah di ujung bebas. Tumpuan: joint 1 `Dx + Dz + Ry`.

| Besaran | Rumus | Nilai | EduBeam |
| --- | --- | --- | --- |
| Reaksi vertikal | $F$ | 18 kN | 18 kN |
| Momen jepit | $FL$ | 72 kNm | 72 kNm |
| Rotasi ujung | $FL^2/(2EI)$ | 0,03529 rad | 0,03529 rad |
| Lendutan ujung (lentur) | $FL^3/(3EI)$ | 94,11 mm | — |
| Lendutan ujung (geser) | $FL/(kGA)$ | 0,31 mm | — |
| Lendutan ujung (total) | jumlah | 94,42 mm | 94,42 mm |

Suku geser di sini 0,3 %. Perpendek kantilever menjadi 1 m dan suku itu menjadi 5 %—untuk itulah koefisien geser ada.

<Figure>
  <Structure :show-loads="true" show-moment show-reactions :nodes="[{label: '1', coords: [0,0,0], dofs: [0,2,4]}, {label: '2', coords: [4,0,0], dofs: []}]" :elements="[{label: '1', nodes: ['1', '2']}]" :nodal-loads="[{target: '2', values: { 0: 0, 2: 18000, 4: 0 }}]" />
  <figcaption>Kantilever dengan beban 18 kN di ujung: momen lentur dan reaksi</figcaption>
</Figure>

## Balok jepit-jepit, beban merata {#fixed–fixed-beam-uniform-load}

$L = 6$ m, $q = 12$ kN/m. Kedua joint `Dx + Dz + Ry`.

| Besaran | Rumus | Nilai |
| --- | --- | --- |
| Reaksi | $qL/2$ | 36 kN |
| Momen tumpuan | $qL^2/12$ | 36 kNm (negatif, serat atas tertarik) |
| Momen tengah bentang | $qL^2/24$ | 18 kNm (positif) |
| Lendutan tengah bentang | $qL^4/(384EI) + qL^2/(8kGA)$ | 9,93 + 0,23 = 10,16 mm |

Buat dari kasus balok sederhana dengan mencentang `Ry` di kedua joint, lalu amati diagram momen bergeser.

## Balok jepit-rol, beban merata {#propped-cantilever-uniform-load}

$L = 6$ m, $q = 12$ kN/m. Joint 1 `Dx + Dz + Ry`, joint 2 `Dz`.

| Besaran | Rumus | Nilai |
| --- | --- | --- |
| Reaksi di ujung jepit | $5qL/8$ | 45 kN |
| Reaksi di rol | $3qL/8$ | 27 kN |
| Momen jepit | $qL^2/8$ | 54 kNm (negatif) |
| Momen positif maks. | $9qL^2/128$ pada $x = 5L/8$ dari ujung jepit | 30,4 kNm pada 3,75 m |

Aplikasi memberi label pada nilai ekstrem lokal secara otomatis, sehingga Anda dapat membaca nilainya sekaligus (dari posisinya di sepanjang elemen) letaknya.

## Rangka dua batang {#two-bar-truss}

Dua batang dari tumpuan sendi di `(0, 0)` dan `(4, 0)` bertemu di `(2, −2)` (puncak 2 m di atas), dengan kedua **sendi ujung** dicentang pada kedua batang, dan beban vertikal $F = 20$ kN di puncak (ke bawah, yaitu `Fz = 20`).

Setiap batang bersudut 45°, panjang $L = 2\sqrt{2}$ m. Karena simetri, masing-masing memikul

$$N = -\frac{F}{2 \sin 45^\circ} = -14{,}14\ \text{kN (tekan)}$$

dan setiap tumpuan menerima 10 kN vertikal dan ±10 kN horizontal. Periksa lapisan **N (x)** dan reaksinya.

## Gradien suhu pada balok sederhana {#temperature-gradient-on-a-simply-supported-beam}

$L = 8$ m, $\Delta T_b - \Delta T_t = -10$ K (serat atas lebih panas), $\alpha = 12 \times 10^{-6}$, $h = 0{,}2$ m.

Balok bebas melengkung, sehingga **tidak ada gaya dalam**; kelengkungannya adalah

$$\kappa = \frac{\alpha\,(\Delta T_b - \Delta T_t)}{h} = \frac{12 \times 10^{-6} \cdot (-10)}{0{,}2} = -6 \times 10^{-4}\ \text{m}^{-1}$$

dan lendutan tengah bentang adalah $\kappa L^2 / 8 = -4{,}8$ mm (ke atas). Sekarang tahan `Ry` di kedua ujung: kelengkungan tertahan dan momen konstan $M = EI\kappa = 2{,}45$ kNm muncul di sepanjang bentang.

## Perpindahan tumpuan {#prescribed-displacement}

Ambil [balok jepit-rol](#propped-cantilever-uniform-load) tanpa beban dan tetapkan `Dz = 10 mm` di rol (penurunan tumpuan). Reaksi yang diperlukan untuk mendorong ujung kantilever turun sebesar $w$ adalah $R = 3EIw/L^3 = 0{,}567$ kN dan momen jepitnya $RL = 3{,}40$ kNm. Tambahkan kembali beban merata dan hasilnya bersuperposisi secara linear.

## Tips untuk pemeriksaan sendiri {#tips-for-your-own-checks}

- Biarkan **label satuan** tetap terlihat; sebagian besar selisih berasal dari kekeliruan satuan.
- Gunakan jendela **Matriks kekakuan** untuk membandingkan satu elemen dengan [manual teori](/id/elements/beam) saat mempelajari metode kekakuan langsung.
- Baca angka yang tepat dari tab **Hasil** dan tooltip saat kursor diarahkan, bukan dari label diagram yang dibulatkan. **Ekspor CSV** atau **Salin** di tab Hasil juga memberikan reaksi, siap untuk spreadsheet.
- Atur **Format angka** ke *Otomatis* di Pengaturan untuk membaca `40` alih-alih `4 · 10¹`.
- Gunakan **Bagikan model** untuk menyerahkan model yang sudah diperiksa kepada rekan atau dosen.
