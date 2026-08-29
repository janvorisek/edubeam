# 梁单元

<Edubeam /> 中唯一的单元是 x–z 平面内的两节点 **Timoshenko 梁**。与经典的 Euler–Bernoulli 梁相比，它增加了剪切变形，这对深梁或短杆件很重要，而对细长杆件则可以忽略。符号约定汇总在[符号约定](/zh/elements/conventions)页面。

<TrussElement :moment="true" caption="平面 Timoshenko 梁示意图" />

## 自由度

平面 Timoshenko 梁在每个节点有三个自由度（DOF）：

- **平动（Dx）：**沿 X 轴的位移。
- **平动（Dz）：**沿 Z 轴的位移。
- **转动（Ry）：**绕 Y 轴的转角。

荷载按自由度的方向指定：

- **水平力（Fx）：**沿 X 轴施加的力。
- **竖向力（Fz）：**沿 Z 轴施加的力。
- **力矩（My）：**绕 Y 轴施加的力矩。

## 局部刚度矩阵

局部坐标系下的梁单元刚度矩阵为：

$$
\mathbf{K_l} =
\begin{pmatrix}
  \frac{EA}{L} & 0 & 0 & -\frac{EA}{L} & 0 & 0 & \\[2ex]
  0 & \frac{12 EI_y}{ L^3 (1+\varphi)} & \frac{-6 EI_y}{L^2 (1+\varphi)} & 0 & \frac{-12  EI_y}{L^3 (1+\varphi)} & \frac{-6  EI_y}{L^2 (1+\varphi)} &\\[3ex]
  0 & \frac{-6  EI_y}{L^2 (1+\varphi)} & \frac{(4 + \varphi)  EI_y}{L  (1+\varphi)} & 0 & \frac{6  EI_y}{L^2 (1+\varphi)} & \frac{(2 - \varphi) EI_y}{L (1+\varphi)} &\\[2ex]
  -\frac{EA}{L} & 0 & 0 & \frac{EA}{L} & 0 & 0 &\\[2ex]
  0 & \frac{-12  EI_y}{L^3 (1+\varphi)} & \frac{6  EI_y}{L^2 (1+\varphi)} & 0 & \frac{12  EI_y}{ L^3  (1+\varphi)} & \frac{6  EI_y}{L^2 (1+\varphi)} &\\[3ex]
  0 & \frac{-6  EI_y}{L^2 (1+\varphi)} & \frac{(2 - \varphi) EI_y}{L (1+\varphi)} & 0 & \frac{6  EI_y}{L^2 (1+\varphi)} & \frac{(4 + \varphi)  EI_y}{L  (1+\varphi)}
\end{pmatrix}
$$

其中：

- $E$ 为材料的杨氏模量
- $A$ 为梁的横截面面积
- $L$ 为梁的长度
- $I_y$ 为绕 y 轴的截面二次矩
- $\varphi$ 为无量纲的剪切柔度参数

$$
\varphi = \frac{12\,E I_y}{k\,G\,A\,L^2}
$$

其中 $G$ 为剪切模量，$k$ 为截面的**剪切系数**（有效剪切面积 $kA$）。当 $\varphi \to 0$（细长梁，或 $k$ 非常大）时，该矩阵退化为 Euler–Bernoulli 梁的刚度矩阵。

## 端部铰接

单元端部的铰释放相应的转动自由度：该转角从 6 × 6 矩阵中凝聚掉（静力凝聚，该端 $M = 0$），单元用剩余的自由度进行组装。两端都释放时只剩下轴向项，单元的行为与[桁架杆](/zh/elements/truss)相同。

## 单元荷载

分布荷载、集中荷载和温度荷载被转换为**等效节点荷载** $\mathbf{f}_{eq}$（固端力的相反数）并加到整体荷载向量中。求解后，单元内的内力由端部位移加上单元荷载的精确特解恢复，因此内力图在杆件内是精确的。

## 坐标转换矩阵

单元坐标转换矩阵 $\mathbf{T}$ 用于把局部刚度矩阵转换到整体坐标系。

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

## 整体刚度矩阵

整体刚度矩阵 $\mathbf{K_g}$ 由单元坐标转换矩阵 $\mathbf{T}$ 与局部刚度矩阵 $\mathbf{K_l}$ 相乘得到：

$$
\mathbf{K_g} = \mathbf{T}^\mathsf{T} \cdot \mathbf{K_l} \cdot \mathbf{T}
$$
