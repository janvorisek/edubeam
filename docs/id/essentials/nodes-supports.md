---
description: "Tambah dan edit joint, snap ke grid, tempatkan joint pada elemen, serta definisikan tumpuan jepit, sendi, rol, dan miring, penurunan tumpuan, dan garis dimensi."
---

# Joint & tumpuan

Joint adalah titik-titik pada model. Elemen menghubungkan joint, dan tumpuan serta beban joint dipasang pada joint.

## Koordinat {#coordinates}

Setiap joint memiliki koordinat **X** dan **Z** dalam satuan panjang yang berlaku. Sumbu x mengarah ke kanan dan **sumbu z mengarah ke bawah** di layar, jadi kolom yang berdiri dari tanah membentang dari `Z = 0` hingga `Z = −3`, bukan `+3`. Indikator sumbu di sudut grid menunjukkan orientasinya. Jika Anda lebih suka sumbu vertikal mengarah ke atas, beralihlah ke [sumbu y ke atas](/id/elements/conventions#y-up-axes) di Pengaturan.

## Menambahkan joint {#adding-nodes}

| Cara | Langkah |
| --- | --- |
| **Dialog** | Tab *Joint* → tombol **Tambah joint** yang pertama, atau klik kanan kanvas → *Tambah joint*. Masukkan X dan Z, dan jika perlu tumpuan serta sudut tumpuan. |
| **Mouse** | Tab *Joint* → tombol **Tambah joint** yang kedua (ikon kursor), atau tahan <kbd>Ctrl</kbd> saat memilih *Tambah joint* di menu kanvas. Setiap klik di kanvas menambahkan satu joint. Tekan <kbd>Esc</kbd> atau **Batal** untuk berhenti. |
| **Saat menggambar elemen** | Dalam mode mouse untuk elemen, mengklik kanvas kosong membuat joint dan langsung menyambungkannya. |
| **Salin & tempel** | Pilih joint (dan elemen), tekan <kbd>Ctrl</kbd>+<kbd>C</kbd> dan <kbd>Ctrl</kbd>+<kbd>V</kbd>, lalu klik tempat salinan akan diletakkan, atau ketik pergeseran Δx, Δz dan tekan **Tempel**. |

<div class="shots">

![Dialog Tambah joint](/screenshots/id/qs-node.webp)

![Dalam mode mouse, banner di atas mengatur tumpuan dan sudut setiap joint yang Anda tempatkan](/screenshots/id/nodes-add-banner.webp)

</div>

Label diberikan secara otomatis (`1`, `2`, … atau melanjutkan skema Anda sendiri, misalnya `A`, `B`) dan dapat diganti namanya di tabel.

### Snap {#snapping}

Saat **Snap ke grid** aktif (<kbd>S</kbd> atau tombol **S**), joint yang Anda tempatkan atau seret jatuh pada kelipatan **Jarak snap grid**: bawaan 0,1 m, atau 0,5 ft dalam satuan AS. Ubah di *Pengaturan → Pengaturan tampilan → Grid*. Matikan snap untuk penempatan bebas, atau ketik koordinat yang tepat di tabel sesudahnya.

### Menempatkan joint pada elemen yang ada {#placing-a-node-on-an-existing-element}

Jika Anda mengklik di dekat elemen saat menambahkan joint, EduBeam menanyakan maksud Anda:

- **Sambungkan ke struktur** membagi elemen menjadi dua (`1a` dan `1b`). Sendi di ujung luar tetap dipertahankan, dan beban merata serta trapesium dibagi di antara kedua bagian; beban terpusat dan beban suhu masuk ke bagian pertama. Ini cara tercepat untuk menambahkan tumpuan di tengah atau titik beban.
- **Tempatkan joint terpisah** membuat joint di atas elemen tanpa menyambungkannya.

## Mengedit joint {#editing-nodes}

- **Tabel:** edit label, X, dan Z di tempat.
- **Seret:** pindahkan joint di tampilan, juga di layar sentuh: tekan joint lalu seret. Setiap perpindahan dapat diurungkan.
- **Dialog Edit joint:** ikon pensil di kolom *Aksi* tabel. Berisi koordinat, tumpuan, dan sudut tumpuan, dengan pratinjau simbol tumpuan.
- **Hapus:** × di tabel, *Hapus* di panel joint, atau pilih joint dan tekan <kbd>Delete</kbd>. Menghapus joint juga menghapus elemen dan beban yang terpasang padanya.

## Tumpuan {#supports}

Tumpuan adalah sekumpulan derajat kebebasan (DOF) yang ditahan. Setiap joint memiliki tiga:

| DOF | Arti |
| --- | --- |
| **Dx** | translasi searah x (horizontal) |
| **Dz** | translasi searah z (vertikal) |
| **Ry** | rotasi terhadap y (pada bidang gambar) |

Cara tercepat adalah **memilih simbolnya**. Simbol ada di panel joint pada **Tumpuan joint**, di dialog Tambah joint dan Edit joint, serta sebagai menu kecil di awal kolom *DOF yang ditahan* pada tabel Joint. Mencentang kotak `Dx`, `Dz`, `Ry` melakukan hal yang sama, satu DOF setiap kali.

![Tumpuan joint: pilih simbol, atau centang DOF, lalu atur sudut tumpuan](/screenshots/id/nodes-support-picker.webp){.shot-lg}

| Tumpuan | Ditahan | Bergerak | Reaksi |
| --- | --- | --- | --- |
| **Bebas** | tidak ada | semuanya | tidak ada |
| **Sendi** | Dx + Dz | berotasi | R<sub>x</sub>, R<sub>z</sub> |
| **Rol** | Dz | bergeser horizontal, berotasi | R<sub>z</sub> |
| **Rol vertikal** | Dx | bergeser vertikal, berotasi | R<sub>x</sub> |
| **Jepit** | Dx + Dz + Ry | tidak ada | R<sub>x</sub>, R<sub>z</sub>, M |
| **Jepit geser** | Dz + Ry | bergeser horizontal | R<sub>z</sub>, M |
| **Jepit geser vertikal** | Dx + Ry | bergeser vertikal | R<sub>x</sub>, M |
| **Hanya rotasi ditahan** | Ry | bergeser ke dua arah | M |

Reaksi dihitung, dan digambar, untuk setiap DOF yang ditahan.

::: tip Joint rangka batang
Batang rangka adalah elemen balok dengan kedua **sendi ujung** dilepas (lihat [Elemen](/id/essentials/elements#end-hinges)). Sendi (Dx + Dz) adalah pilihan yang lazim untuk tumpuan rangka batang. Joint yang semua elemen tersambungnya bersendi tidak memiliki kekakuan rotasi; EduBeam menerimanya dan melaporkan rotasinya sebagai 0.
:::

### Tumpuan miring {#inclined-skewed-supports}

Atur **Sudut LCS joint** α dalam derajat (−180…180). Sudut ini ada di panel joint pada *Tumpuan joint*, di dialog Tambah joint dan Edit joint, serta di kolom α tabel Joint. Sumbu joint berputar sebesar sudut tersebut dan DOF tumpuan bekerja pada arah yang diputar, jadi rol pada kemiringan 30° adalah `Dz` dengan α = 30. Simbolnya ikut berputar dan reaksi dilaporkan pada arah yang diputar.

### Stabilitas {#stability}

Solver memerlukan setidaknya **tiga DOF yang ditahan** secara total, dan tumpuan serta sendi harus mampu menahan struktur. Selama tumpuan belum cukup, tampilan menunjukkan label biru *Perlu tumpuan*. Jika jumlah tumpuan sudah cukup tetapi tidak dapat menahan struktur (semuanya sejajar, atau bertemu di satu titik), atau sendi membuat batang dapat berputar satu sama lain, pesan merah menyebutkan masalahnya dan garis putus-putus menunjukkan bagaimana struktur bergerak. Lihat [Pemecahan masalah](/id/reference/troubleshooting).

## Beban joint dan penurunan tumpuan {#nodal-loads-and-settlements}

Gaya, momen, dan perpindahan tumpuan (penurunan tumpuan) diberikan pada joint. Lihat [Beban](/id/essentials/loads#nodal-loads).

## Garis dimensi {#dimension-lines}

Klik kanan kanvas → **Tambah dimensi** untuk menggambar garis dimensi di antara dua titik, atau klik kanan elemen → **Dimensi elemen** untuk langsung memberinya dimensi. Titik ujung menempel ke joint saat diseret mendekatinya. Pilih garis dan gunakan **Edit** untuk mengetik koordinatnya, atau **Balik dimensi** untuk memindahkan label ke sisi lain. Garis dimensi hanya bersifat visual; garis ini disimpan bersama proyek dan ikut terbawa dalam tautan berbagi.
