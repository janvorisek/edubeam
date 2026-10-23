---
description: "Elemen balok Timoshenko 2D di EduBeam: derajat kebebasan, matriks kekakuan lokal dengan deformasi geser, sendi ujung, beban elemen, dan transformasi."
---

# Elemen balok

Satu-satunya elemen di <Edubeam /> adalah **balok Timoshenko** dua joint pada bidang x–z. Dibandingkan dengan balok Euler–Bernoulli klasik, elemen ini menambahkan deformasi geser, yang berpengaruh pada batang tinggi atau pendek dan hilang pada batang langsing. Konvensi tanda dirangkum di halaman [konvensi](/id/elements/conventions).

<TrussElement :moment="true" caption="Skema balok Timoshenko 2D" />

## Derajat kebebasan {#degrees-of-freedom}

Balok Timoshenko 2D memiliki tiga derajat kebebasan (DOF) di setiap joint:

- **Translasi (Dx):** perpindahan searah sumbu X.
- **Translasi (Dz):** perpindahan searah sumbu Z.
- **Rotasi (Ry):** rotasi terhadap sumbu Y.

Beban diberikan searah DOF:

- **Gaya horizontal (Fx):** gaya yang bekerja searah sumbu X.
- **Gaya vertikal (Fz):** gaya yang bekerja searah sumbu Z.
- **Momen (My):** momen yang bekerja terhadap sumbu Y.

## Matriks kekakuan lokal {#local-stiffness-matrix}

Matriks kekakuan balok dalam koordinat lokal adalah:

$$
\mathbf{K_l} =
\begin{pmatrix}
  \dfrac{EA}{L} & 0 & 0 & -\dfrac{EA}{L} & 0 & 0 & \\[2ex]
  0 & \dfrac{12 EI_y}{ L^3 (1+\varphi)} & \dfrac{-6 EI_y}{L^2 (1+\varphi)} & 0 & \dfrac{-12  EI_y}{L^3 (1+\varphi)} & \dfrac{-6  EI_y}{L^2 (1+\varphi)} &\\[3ex]
  0 & \dfrac{-6  EI_y}{L^2 (1+\varphi)} & \dfrac{(4 + \varphi)  EI_y}{L  (1+\varphi)} & 0 & \dfrac{6  EI_y}{L^2 (1+\varphi)} & \dfrac{(2 - \varphi) EI_y}{L (1+\varphi)} &\\[2ex]
  -\dfrac{EA}{L} & 0 & 0 & \dfrac{EA}{L} & 0 & 0 &\\[2ex]
  0 & \dfrac{-12  EI_y}{L^3 (1+\varphi)} & \dfrac{6  EI_y}{L^2 (1+\varphi)} & 0 & \dfrac{12  EI_y}{ L^3  (1+\varphi)} & \dfrac{6  EI_y}{L^2 (1+\varphi)} &\\[3ex]
  0 & \dfrac{-6  EI_y}{L^2 (1+\varphi)} & \dfrac{(2 - \varphi) EI_y}{L (1+\varphi)} & 0 & \dfrac{6  EI_y}{L^2 (1+\varphi)} & \dfrac{(4 + \varphi)  EI_y}{L  (1+\varphi)}
\end{pmatrix}
$$

dengan:

- $E$ adalah modulus elastisitas material
- $A$ adalah luas penampang balok
- $L$ adalah panjang balok
- $I_y$ adalah momen inersia terhadap sumbu y
- $\varphi$ adalah parameter kelenturan geser tak berdimensi

$$
\varphi = \frac{12\,E I_y}{k\,G\,A\,L^2}
$$

dengan $G$ modulus geser dan $k$ **koefisien geser** penampang (luas geser efektif $kA$). Untuk $\varphi \to 0$ (balok langsing, atau $k$ sangat besar) matriks ini tereduksi menjadi kekakuan balok Euler–Bernoulli.

## Sendi ujung {#end-hinges}

Sendi di ujung elemen melepas DOF rotasi yang bersangkutan: rotasi tersebut dieliminasi dari matriks 6 × 6 (kondensasi statis, $M = 0$ di ujung itu) dan elemen dirakit dengan DOF yang tersisa. Jika kedua ujung dilepas, hanya suku aksial yang tersisa dan elemen berperilaku sebagai [batang rangka](/id/elements/truss).

## Beban elemen {#element-loads}

Beban merata, terpusat, dan suhu dikonversi menjadi **beban joint ekuivalen** $\mathbf{f}_{eq}$ (negatif dari gaya ujung jepit) dan ditambahkan ke vektor beban global. Setelah solusi diperoleh, gaya dalam di sepanjang elemen dihitung dari perpindahan ujung ditambah solusi partikular eksak dari beban elemen, sehingga diagramnya eksak di sepanjang batang.

## Matriks transformasi {#transformation-matrix}

Matriks transformasi elemen, $\mathbf{T}$, dipakai untuk mentransformasikan matriks kekakuan lokal ke sistem koordinat global.

$$
\mathbf{T} = \begin{pmatrix}
   \cos(\alpha) & \sin(\alpha) & 0 & 0 & 0 & 0 \\
   -\sin(\alpha) & \cos(\alpha) & 0 & 0 & 0 & 0 \\
   0 & 0 & 1 & 0 & 0 & 0 \\
   0 & 0 & 0 & \cos(\alpha) & \sin(\alpha) & 0 \\
   0 & 0 & 0 & -\sin(\alpha) & \cos(\alpha) & 0 \\
   0 & 0 & 0 & 0 & 0 & 1
\end{pmatrix}
$$

## Matriks kekakuan global {#global-stiffness-matrix}

Matriks kekakuan global, $\mathbf{K_g}$, diperoleh dengan mengalikan matriks transformasi elemen, $\mathbf{T}$, dengan matriks kekakuan lokal, $\mathbf{K_l}$:

$$
\mathbf{K_g} = \mathbf{T}^\mathsf{T} \cdot \mathbf{K_l} \cdot \mathbf{T}
$$
