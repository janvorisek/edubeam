---
description: "EduBeam의 2D Timoshenko 보 요소: 자유도, 전단 변형을 포함한 국부 강성 행렬, 단부 힌지, 요소 하중, 좌표 변환."
---

# 보 요소

<Edubeam />의 유일한 요소는 x–z 평면의 2절점 **Timoshenko 보**입니다. 고전적인 Euler–Bernoulli 보에 비해 전단 변형이 추가되는데, 이는 춤이 깊거나 짧은 부재에서 중요하고 세장한 부재에서는 사라집니다. 부호 규약은 [부호 규약](/ko/elements/conventions) 페이지에 정리되어 있습니다.

<TrussElement :moment="true" caption="2D Timoshenko 보 개요도" />

## 자유도 {#degrees-of-freedom}

2D Timoshenko 보는 각 절점에 자유도(DOF)가 세 개 있습니다.

- **이동 (Dx):** X축 방향 변위.
- **이동 (Dz):** Z축 방향 변위.
- **회전 (Ry):** Y축에 대한 회전.

하중은 자유도 방향으로 지정합니다.

- **수평력 (Fx):** X축 방향으로 가하는 힘.
- **연직력 (Fz):** Z축 방향으로 가하는 힘.
- **모멘트 (My):** Y축에 대해 가하는 모멘트.

## 국부 강성 행렬 {#local-stiffness-matrix}

국부 좌표계에서 보의 강성 행렬은 다음과 같습니다.

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

여기서

- $E$는 재료의 탄성계수
- $A$는 보의 단면적
- $L$은 보의 길이
- $I_y$는 y축에 대한 단면2차모멘트
- $\varphi$는 무차원 전단 유연도 매개변수입니다

$$
\varphi = \frac{12\,E I_y}{k\,G\,A\,L^2}
$$

$G$는 전단탄성계수, $k$는 단면의 **전단 보정계수**입니다(유효 전단 면적 $kA$). $\varphi \to 0$(세장한 보 또는 아주 큰 $k$)이면 이 행렬은 Euler–Bernoulli 보의 강성 행렬이 됩니다.

## 단부 힌지 {#end-hinges}

요소 끝의 힌지는 해당 회전 자유도를 해제합니다. 회전 자유도는 6 × 6 행렬에서 축약되고(정적 축약, 그 끝에서 $M = 0$), 요소는 남은 자유도로 조립됩니다. 양 끝을 모두 해제하면 축방향 항만 남아 요소가 [트러스 부재](/ko/elements/truss)처럼 거동합니다.

## 요소 하중 {#element-loads}

분포하중, 집중하중, 온도 하중은 **등가 절점 하중** $\mathbf{f}_{eq}$(고정단력의 부호를 바꾼 값)로 변환되어 전체 하중 벡터에 더해집니다. 해를 구한 뒤에는 단부 변위와 요소 하중의 정확한 특해로부터 요소를 따른 부재력을 복원하므로, 다이어그램은 부재 전체에서 정확합니다.

## 좌표 변환 행렬 {#transformation-matrix}

요소 좌표 변환 행렬 $\mathbf{T}$는 국부 강성 행렬을 전체 좌표계로 변환하는 데 쓰입니다.

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

## 전체 강성 행렬 {#global-stiffness-matrix}

전체 강성 행렬 $\mathbf{K_g}$는 요소 좌표 변환 행렬 $\mathbf{T}$와 국부 강성 행렬 $\mathbf{K_l}$을 곱해 얻습니다.

$$
\mathbf{K_g} = \mathbf{T}^\mathsf{T} \cdot \mathbf{K_l} \cdot \mathbf{T}
$$
