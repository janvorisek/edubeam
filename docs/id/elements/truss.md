---
description: "Cara EduBeam memodelkan batang rangka sebagai balok dengan kedua ujung bersendi: derajat kebebasan, matriks kekakuan lokal dan global, serta matriks transformasi."
---

# Elemen rangka batang

Elemen rangka batang hanya memikul gaya aksial. Di <Edubeam /> tidak ada tipe elemen rangka batang tersendiri: batang rangka adalah [elemen balok](/id/elements/beam) dengan **kedua sendi ujung** dicentang, yang mengeliminasi suku lentur dan menyisakan kekakuan aksial di bawah ini.

<TrussElement :hinges="[true, true]"  caption="Skema elemen rangka batang 2D" />

## Derajat kebebasan {#degrees-of-freedom}

Elemen rangka batang 2D memiliki dua DOF di setiap joint:

- **Translasi (Dx):** perpindahan searah sumbu X.
- **Translasi (Dz):** perpindahan searah sumbu Z.

## Matriks kekakuan lokal {#local-stiffness-matrix}

Matriks kekakuan lokal elemen rangka batang adalah:

$$
\mathbf{K_l} =
\begin{pmatrix}
   \dfrac{EA}{L} & 0 & -\dfrac{EA}{L} & 0 \\[2ex]
   0 & 0 & 0 & 0 \\[1ex]
   -\dfrac{EA}{L} & 0 & \dfrac{EA}{L} & 0 \\[2ex]
   0 & 0 & 0 & 0
\end{pmatrix}
$$

dengan:

- $E$ adalah modulus elastisitas material
- $A$ adalah luas penampang batang
- $L$ adalah panjang batang

## Matriks transformasi {#transformation-matrix}

Matriks transformasi elemen, $\mathbf{T}$, dipakai untuk mentransformasikan matriks kekakuan lokal ke sistem koordinat global.

$$
\mathbf{T} = \begin{pmatrix}
   \cos(\alpha) & \sin(\alpha) & 0 & 0 \\
   -\sin(\alpha) & \cos(\alpha) & 0 & 0 \\
   0 & 0 & \cos(\alpha) & \sin(\alpha) \\
   0 & 0 & -\sin(\alpha) & \cos(\alpha)
\end{pmatrix}
$$

## Matriks kekakuan global {#global-stiffness-matrix}

Matriks kekakuan global, $\mathbf{K_g}$, diperoleh dengan mengalikan matriks transformasi elemen, $\mathbf{T}$, dengan matriks kekakuan lokal, $\mathbf{K_l}$:

$$
\mathbf{K_g} = \mathbf{T}^\mathsf{T} \cdot \mathbf{K_l} \cdot \mathbf{T}
$$

Hasil perkaliannya adalah:

$$
\mathbf{K_g}={ {EA}\over{l}}\left[\begin{array}{cccc}
c^2&cs&-c^2&-cs\\
cs&s^2&-cs& -s^2\\
-c^2&-cs&c^2&cs\\
-cs&-s^2&cs&s^2
\end{array}\right];\;\;\begin{array}{c}c=\cos(\alpha)\\s=\sin(\alpha)\end{array}


$$
