---
description: "Phần tử dầm Timoshenko 2D trong EduBeam: bậc tự do, ma trận độ cứng địa phương có kể biến dạng trượt, khớp đầu thanh, tải trọng phần tử và phép biến đổi tọa độ."
---

# Phần tử dầm

Phần tử duy nhất trong <Edubeam /> là **dầm Timoshenko** hai nút trong mặt phẳng x–z. So với dầm Euler–Bernoulli cổ điển, nó kể thêm biến dạng trượt — điều quan trọng với thanh cao hoặc ngắn và gần như mất đi với thanh mảnh. Quy ước dấu được tóm tắt ở trang [quy ước](/vi/elements/conventions).

<TrussElement :moment="true" caption="Sơ đồ dầm Timoshenko 2D" />

## Bậc tự do {#degrees-of-freedom}

Dầm Timoshenko 2D có ba bậc tự do tại mỗi nút:

- **Chuyển vị thẳng (Dx):** chuyển vị theo trục x.
- **Chuyển vị thẳng (Dz):** chuyển vị theo trục z.
- **Góc xoay (Ry):** góc xoay quanh trục y.

Tải trọng được nhập theo phương của các bậc tự do:

- **Lực ngang (Fx):** lực tác dụng theo trục x.
- **Lực đứng (Fz):** lực tác dụng theo trục z.
- **Mô men (My):** mô men tác dụng quanh trục y.

## Ma trận độ cứng địa phương {#local-stiffness-matrix}

Ma trận độ cứng của dầm trong hệ tọa độ địa phương là:

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

trong đó:

- $E$ là mô đun đàn hồi của vật liệu
- $A$ là diện tích tiết diện của dầm
- $L$ là chiều dài dầm
- $I_y$ là mô men quán tính đối với trục y
- $\varphi$ là tham số mềm trượt không thứ nguyên

$$
\varphi = \frac{12\,E I_y}{k\,G\,A\,L^2}
$$

với $G$ là mô đun trượt và $k$ là **hệ số hiệu chỉnh cắt** của tiết diện (diện tích chịu cắt hiệu dụng $kA$). Khi $\varphi \to 0$ (dầm mảnh, hoặc $k$ rất lớn), ma trận trở về ma trận độ cứng của dầm Euler–Bernoulli.

## Khớp đầu thanh {#end-hinges}

Khớp ở đầu phần tử giải phóng bậc tự do xoay tương ứng: góc xoay được khử khỏi ma trận 6 × 6 (khử tĩnh học, $M = 0$ tại đầu đó) và phần tử được ghép vào hệ với các bậc tự do còn lại. Khi giải phóng cả hai đầu, chỉ còn các số hạng dọc trục và phần tử làm việc như một [thanh dàn](/vi/elements/truss).

## Tải trọng phần tử {#element-loads}

Tải phân bố, tải tập trung và tải nhiệt độ được quy đổi thành **tải trọng nút tương đương** $\mathbf{f}_{eq}$ (bằng nội lực đầu ngàm đổi dấu) và cộng vào véc tơ tải trọng tổng thể. Sau khi giải, nội lực dọc phần tử được xác định từ chuyển vị đầu thanh cộng với nghiệm riêng chính xác của tải trọng phần tử, nên biểu đồ chính xác trên toàn bộ chiều dài thanh.

## Ma trận biến đổi {#transformation-matrix}

Ma trận biến đổi của phần tử, $\mathbf{T}$, dùng để chuyển ma trận độ cứng địa phương sang hệ tọa độ tổng thể.

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

## Ma trận độ cứng tổng thể {#global-stiffness-matrix}

Ma trận độ cứng tổng thể, $\mathbf{K_g}$, nhận được bằng cách nhân ma trận biến đổi của phần tử, $\mathbf{T}$, với ma trận độ cứng địa phương, $\mathbf{K_l}$:

$$
\mathbf{K_g} = \mathbf{T}^\mathsf{T} \cdot \mathbf{K_l} \cdot \mathbf{T}
$$
