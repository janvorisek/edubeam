---
description: "Cách EduBeam mô hình hóa thanh dàn bằng phần tử dầm có khớp ở cả hai đầu: bậc tự do, ma trận độ cứng địa phương và tổng thể, và ma trận biến đổi."
---

# Phần tử thanh dàn

Phần tử thanh dàn chỉ chịu lực dọc. Trong <Edubeam /> không có loại phần tử dàn riêng: thanh dàn là một [phần tử dầm](/vi/elements/beam) được đánh dấu **cả hai khớp đầu thanh**, nhờ đó các số hạng uốn bị khử và chỉ còn lại độ cứng dọc trục như dưới đây.

<TrussElement :hinges="[true, true]"  caption="Sơ đồ phần tử thanh dàn 2D" />

## Bậc tự do {#degrees-of-freedom}

Phần tử thanh dàn 2D có hai bậc tự do tại mỗi nút:

- **Chuyển vị thẳng (Dx):** chuyển vị theo trục x.
- **Chuyển vị thẳng (Dz):** chuyển vị theo trục z.

## Ma trận độ cứng địa phương {#local-stiffness-matrix}

Ma trận độ cứng địa phương của phần tử thanh dàn là:

$$
\mathbf{K_l} =
\begin{pmatrix}
   \dfrac{EA}{L} & 0 & -\dfrac{EA}{L} & 0 \\[2ex]
   0 & 0 & 0 & 0 \\[1ex]
   -\dfrac{EA}{L} & 0 & \dfrac{EA}{L} & 0 \\[2ex]
   0 & 0 & 0 & 0
\end{pmatrix}
$$

trong đó:

- $E$ là mô đun đàn hồi của vật liệu
- $A$ là diện tích tiết diện của thanh
- $L$ là chiều dài thanh

## Ma trận biến đổi {#transformation-matrix}

Ma trận biến đổi của phần tử, $\mathbf{T}$, dùng để chuyển ma trận độ cứng địa phương sang hệ tọa độ tổng thể.

$$
\mathbf{T} = \begin{pmatrix}
   \cos(\alpha) & \sin(\alpha) & 0 & 0 \\
   -\sin(\alpha) & \cos(\alpha) & 0 & 0 \\
   0 & 0 & \cos(\alpha) & \sin(\alpha) \\
   0 & 0 & -\sin(\alpha) & \cos(\alpha)
\end{pmatrix}
$$

## Ma trận độ cứng tổng thể {#global-stiffness-matrix}

Ma trận độ cứng tổng thể, $\mathbf{K_g}$, nhận được bằng cách nhân ma trận biến đổi của phần tử, $\mathbf{T}$, với ma trận độ cứng địa phương, $\mathbf{K_l}$:

$$
\mathbf{K_g} = \mathbf{T}^\mathsf{T} \cdot \mathbf{K_l} \cdot \mathbf{T}
$$

Nhân ra ta được:

$$
\mathbf{K_g}={ {EA}\over{l}}\left[\begin{array}{cccc}
c^2&cs&-c^2&-cs\\
cs&s^2&-cs& -s^2\\
-c^2&-cs&c^2&cs\\
-cs&-s^2&cs&s^2
\end{array}\right];\;\;\begin{array}{c}c=\cos(\alpha)\\s=\sin(\alpha)\end{array}


$$
