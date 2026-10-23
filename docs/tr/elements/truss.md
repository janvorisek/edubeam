# Kafes çubuğu

Kafes çubuğu yalnızca eksenel kuvvet taşır. <Edubeam /> ayrı bir kafes elemanı türü içermez: kafes çubuğu, **iki uç mafsalı da** işaretlenmiş bir [kiriş elemanıdır](/tr/elements/beam). Kondensasyon eğilme terimlerini çıkarır ve geriye yalnızca aşağıdaki eksenel rijitlik kalır.

<TrussElement :hinges="[true, true]"  caption="Düzlem kafes çubuğunun şeması" />

## Serbestlik dereceleri {#degrees-of-freedom}

Düzlem kafes çubuğunun her düğümünde iki serbestlik derecesi vardır:

- **Ötelenme (Dx):** x ekseni doğrultusunda yer değiştirme.
- **Ötelenme (Dz):** z ekseni doğrultusunda yer değiştirme.

## Yerel rijitlik matrisi {#local-stiffness-matrix}

Kafes çubuğunun yerel rijitlik matrisi şöyledir:

$$
\mathbf{K_l} =
\begin{pmatrix}
   \frac{EA}{L} & 0 & -\frac{EA}{L} & 0 \\[2ex]
   0 & 0 & 0 & 0 \\[1ex]
   -\frac{EA}{L} & 0 & \frac{EA}{L} & 0 \\[2ex]
   0 & 0 & 0 & 0
\end{pmatrix}
$$

Burada:

- $E$ malzemenin elastisite modülü,
- $A$ çubuk kesitinin alanı,
- $L$ çubuğun boyudur.

## Dönüşüm matrisi {#transformation-matrix}

Eleman dönüşüm matrisi $\mathbf{T}$, yerel rijitlik matrisini genel koordinat sistemine dönüştürmek için kullanılır.

$$
\mathbf{T} = \begin{pmatrix}
   \cos(\alpha) & \sin(\alpha) & 0 & 0 \\
   -\sin(\alpha) & \cos(\alpha) & 0 & 0 \\
   0 & 0 & \cos(\alpha) & \sin(\alpha) \\
   0 & 0 & -\sin(\alpha) & \cos(\alpha)
\end{pmatrix}
$$

## Genel rijitlik matrisi {#global-stiffness-matrix}

Genel rijitlik matrisi $\mathbf{K_g}$, eleman dönüşüm matrisi $\mathbf{T}$ ile yerel rijitlik matrisi $\mathbf{K_l}$'nin çarpılmasıyla elde edilir:

$$
\mathbf{K_g} = \mathbf{T}^\mathsf{T} \cdot \mathbf{K_l} \cdot \mathbf{T}
$$

Çarpım sonucunda:

$$
\mathbf{K_g}={ {EA}\over{l}}\left[\begin{array}{cccc}
c^2&cs&-c^2&-cs\\
cs&s^2&-cs& -s^2\\
-c^2&-cs&c^2&cs\\
-cs&-s^2&cs&s^2
\end{array}\right];\;\;\begin{array}{c}c=\cos(\alpha)\\s=\sin(\alpha)\end{array}
$$
