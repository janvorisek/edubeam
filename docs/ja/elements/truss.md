---
description: "EduBeam がトラス材を両端ヒンジの梁としてどうモデル化しているか：自由度、ローカルとグローバルの剛性マトリクス、座標変換マトリクス。"
---

# トラス要素

トラス要素は軸力だけを負担します。<Edubeam /> には独立したトラス要素の種類はありません。トラス材は、**両端の材端ヒンジ**にチェックを入れた[梁要素](/ja/elements/beam)です。これにより曲げの項が縮約され、下に示す軸剛性だけが残ります。

<TrussElement :hinges="[true, true]"  caption="2D トラス要素の概略図" />

## 自由度 {#degrees-of-freedom}

2D トラス要素は、各節点に 2 つの自由度を持ちます。

- **並進（Dx）：** X 軸方向の変位。
- **並進（Dz）：** Z 軸方向の変位。

## ローカル剛性マトリクス {#local-stiffness-matrix}

トラス要素のローカル剛性マトリクスは次のとおりです。

$$
\mathbf{K_l} =
\begin{pmatrix}
   \dfrac{EA}{L} & 0 & -\dfrac{EA}{L} & 0 \\[2ex]
   0 & 0 & 0 & 0 \\[1ex]
   -\dfrac{EA}{L} & 0 & \dfrac{EA}{L} & 0 \\[2ex]
   0 & 0 & 0 & 0
\end{pmatrix}
$$

ここで：

- $E$ は材料のヤング係数
- $A$ は部材の断面積
- $L$ は部材の長さ

## 座標変換マトリクス {#transformation-matrix}

要素の座標変換マトリクス $\mathbf{T}$ は、ローカル剛性マトリクスをグローバル座標系に変換するのに使います。

$$
\mathbf{T} = \begin{pmatrix}
   \cos(\alpha) & \sin(\alpha) & 0 & 0 \\
   -\sin(\alpha) & \cos(\alpha) & 0 & 0 \\
   0 & 0 & \cos(\alpha) & \sin(\alpha) \\
   0 & 0 & -\sin(\alpha) & \cos(\alpha)
\end{pmatrix}
$$

## グローバル剛性マトリクス {#global-stiffness-matrix}

グローバル座標系での剛性マトリクス $\mathbf{K_g}$ は、要素の座標変換マトリクス $\mathbf{T}$ とローカル剛性マトリクス $\mathbf{K_l}$ を掛け合わせて得られます。

$$
\mathbf{K_g} = \mathbf{T}^\mathsf{T} \cdot \mathbf{K_l} \cdot \mathbf{T}
$$

掛け合わせると次のようになります。

$$
\mathbf{K_g}={ {EA}\over{l}}\left[\begin{array}{cccc}
c^2&cs&-c^2&-cs\\
cs&s^2&-cs& -s^2\\
-c^2&-cs&c^2&cs\\
-cs&-s^2&cs&s^2
\end{array}\right];\;\;\begin{array}{c}c=\cos(\alpha)\\s=\sin(\alpha)\end{array}


$$
