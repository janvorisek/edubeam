---
description: "Model balok, portal, dan rangka batang siap pakai yang sudah dihitung dan terbuka di EduBeam dengan satu klik, dilengkapi usulan latihan dan tutorial."
---

# Contoh

Setiap kartu di bawah adalah model hidup yang sudah dihitung. Klik salah satunya untuk membukanya di <Edubeam /> dengan pengaturan lengkap yang siap diedit—lalu seret joint, ubah beban, atau centang sendi dan amati diagramnya mengikuti.

<br>

<FeatureStructures />

Model yang sama ada di aplikasi di **☰ → Contoh**, dan [run.edubeam.app/?panel=examples](https://run.edubeam.app/?panel=examples&lang=id){target="_blank"} langsung membuka galeri tersebut.

## Usulan latihan {#suggested-exercises}

- **Balok statis tak tentu**: hapus centang `Ry` di ujung jepit agar menjadi balok sederhana. Seberapa besar momen di tengah bentang bertambah?
- **Kantilever**: bandingkan lendutan ujung dengan $FL^3/3EI$ (lihat [Memeriksa hasil secara manual](/id/guide/verification)), lalu jadikan $I_y$ setengahnya di tab *Penampang*.
- **Rangka batang Pratt**: joint pada contoh ini kaku. Centang kedua sendi ujung pada setiap batang agar menjadi rangka batang sejati, lalu bandingkan gaya aksialnya. Sekarang hapus satu diagonal: apakah rangka batang masih berdiri?
- **Balok menerus tiga bentang**: balok hanya ditumpu di kedua ujungnya. Centang `Dz` di joint dalam B dan C agar menjadi balok menerus, dan amati momen negatif muncul di atas tumpuan.
- **Kasus beban portal**: centang kedua sendi ujung pada balok untuk memodelkan sambungan balok-kolom sendi, atau ubah tumpuan kanan dari rol menjadi sendi.
- **Beban suhu**: tahan `Dx` di kedua tumpuan dan amati gaya aksial muncul.

## Tutorial lengkap {#worked-tutorials}

- [Portal tiga sendi](/id/tutorials/three-hinged-frame): reaksi, N, V, dan M diperiksa secara manual.
- [Rangka batang bidang](/id/tutorials/truss): metode titik simpul, metode potongan, dan batang tanpa gaya.

## Sumbangkan contoh {#contribute-an-example}

Punya model yang bagus untuk pengajaran? Bagikan tautannya di [GitHub Discussions](https://github.com/janvorisek/edubeam/discussions) atau [Twitter](https://twitter.com/EdubeamApp) dan kami akan menambahkannya ke galeri.
