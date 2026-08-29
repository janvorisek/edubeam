# 桁架单元

桁架单元只承受轴力。<Edubeam /> 中没有单独的桁架单元类型：桁架杆就是勾选了**两端的端部铰接**的[梁单元](/zh/elements/beam)，这会凝聚掉弯曲项，只留下下面的轴向刚度。

<TrussElement :hinges="[true, true]"  caption="平面桁架单元示意图" />

## 自由度

平面桁架单元在每个节点有两个自由度：

- **平动（Dx）：**沿 X 轴的位移。
- **平动（Dz）：**沿 Z 轴的位移。

## 局部刚度矩阵

桁架单元的局部刚度矩阵为：

$$
\mathbf{K_l} =
\begin{pmatrix}
   \frac{EA}{L} & 0 & -\frac{EA}{L} & 0 \\[2ex]
   0 & 0 & 0 & 0 \\[1ex]
   -\frac{EA}{L} & 0 & \frac{EA}{L} & 0 \\[2ex]
   0 & 0 & 0 & 0
\end{pmatrix}
$$

其中：

- $E$ 为材料的杨氏模量
- $A$ 为杆件的横截面面积
- $L$ 为杆件的长度

## 坐标转换矩阵

单元坐标转换矩阵 $\mathbf{T}$ 用于把局部刚度矩阵转换到整体坐标系。

$$
\mathbf{T} = \begin{pmatrix}
   \cos(\alpha) & \sin(\alpha) & 0 & 0 \\
   -\sin(\alpha) & \cos(\alpha) & 0 & 0 \\
   0 & 0 & \cos(\alpha) & \sin(\alpha) \\
   0 & 0 & -\sin(\alpha) & \cos(\alpha)
\end{pmatrix}
$$

## 整体刚度矩阵

整体刚度矩阵 $\mathbf{K_g}$ 由单元坐标转换矩阵 $\mathbf{T}$ 与局部刚度矩阵 $\mathbf{K_l}$ 相乘得到：

$$
\mathbf{K_g} = \mathbf{T}^\mathsf{T} \cdot \mathbf{K_l} \cdot \mathbf{T}
$$

相乘的结果为：

$$
\mathbf{K_g}={ {EA}\over{l}}\left[\begin{array}{cccc}
c^2&cs&-c^2&-cs\\
cs&s^2&-cs& -s^2\\
-c^2&-cs&c^2&cs\\
-cs&-s^2&cs&s^2
\end{array}\right];\;\;\begin{array}{c}c=\cos(\alpha)\\s=\sin(\alpha)\end{array}


$$
