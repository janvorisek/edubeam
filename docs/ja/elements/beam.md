---
description: "EduBeam の 2D Timoshenko 梁要素：自由度、せん断変形を考慮したローカル剛性マトリクス、材端ヒンジ、要素荷重、座標変換。"
---

# 梁要素

<Edubeam /> の要素は、x–z 平面内の 2 節点 **Timoshenko 梁** だけです。古典的な Euler–Bernoulli 梁と比べてせん断変形が加わり、これはせいの高い部材や短い部材で重要になり、細長い部材ではほとんど消えます。符号規約は[符号規約](/ja/elements/conventions)のページにまとめています。

<TrussElement :moment="true" caption="2D Timoshenko 梁の概略図" />

## 自由度 {#degrees-of-freedom}

2D Timoshenko 梁は、各節点に 3 つの自由度（DOF）を持ちます。

- **並進（Dx）：** X 軸方向の変位。
- **並進（Dz）：** Z 軸方向の変位。
- **回転（Ry）：** Y 軸まわりの回転。

荷重は自由度の向きに与えます。

- **水平力（Fx）：** X 軸方向に作用する力。
- **鉛直力（Fz）：** Z 軸方向に作用する力。
- **モーメント（My）：** Y 軸まわりに作用するモーメント。

## ローカル剛性マトリクス {#local-stiffness-matrix}

ローカル座標系での梁の剛性マトリクスは次のとおりです。

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

ここで：

- $E$ は材料のヤング係数
- $A$ は梁の断面積
- $L$ は梁の長さ
- $I_y$ は y 軸まわりの断面二次モーメント
- $\varphi$ はせん断変形の影響を表す無次元のパラメーター

$$
\varphi = \frac{12\,E I_y}{k\,G\,A\,L^2}
$$

$G$ はせん断弾性係数、$k$ は断面の**せん断補正係数**です（有効せん断断面積は $kA$）。$\varphi \to 0$（細長い梁、または非常に大きな $k$）では、マトリクスは Euler–Bernoulli 梁の剛性マトリクスに一致します。

## 材端ヒンジ {#end-hinges}

要素の端にヒンジを設けると、対応する回転の自由度が解放されます。その回転は 6 × 6 のマトリクスから縮約され（静的縮約、その端で $M = 0$）、要素は残りの自由度で組み込まれます。両端を解放すると軸方向の項だけが残り、要素は[トラス材](/ja/elements/truss)として振る舞います。

## 要素荷重 {#element-loads}

分布荷重、集中荷重、温度荷重は**等価節点荷重** $\mathbf{f}_{eq}$（固定端力の符号を反転したもの）に変換され、全体荷重ベクトルに加えられます。解析後、要素に沿った断面力は、材端変位と要素荷重の厳密な特解から求められるので、図は部材に沿って厳密です。

## 座標変換マトリクス {#transformation-matrix}

要素の座標変換マトリクス $\mathbf{T}$ は、ローカル剛性マトリクスをグローバル座標系に変換するのに使います。

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

## グローバル剛性マトリクス {#global-stiffness-matrix}

グローバル座標系での剛性マトリクス $\mathbf{K_g}$ は、要素の座標変換マトリクス $\mathbf{T}$ とローカル剛性マトリクス $\mathbf{K_l}$ を掛け合わせて得られます。

$$
\mathbf{K_g} = \mathbf{T}^\mathsf{T} \cdot \mathbf{K_l} \cdot \mathbf{T}
$$
