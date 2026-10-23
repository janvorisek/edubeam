---
description: "EduBeam이 트러스 부재를 양단 힌지 보로 모델링하는 방법: 자유도, 국부 및 전체 강성 행렬, 좌표 변환 행렬."
---

# 트러스 요소

트러스 요소는 축력만 전달합니다. <Edubeam />에는 별도의 트러스 요소 유형이 없습니다. 트러스 부재는 **양쪽 단부 힌지**를 체크한 [보 요소](/ko/elements/beam)이며, 이렇게 하면 휨 항이 축약되고 아래의 축강성만 남습니다.

<TrussElement :hinges="[true, true]"  caption="2D 트러스 요소 개요도" />

## 자유도 {#degrees-of-freedom}

2D 트러스 요소는 각 절점에 자유도가 두 개 있습니다.

- **이동 (Dx):** X축 방향 변위.
- **이동 (Dz):** Z축 방향 변위.

## 국부 강성 행렬 {#local-stiffness-matrix}

트러스 요소의 국부 강성 행렬은 다음과 같습니다.

$$
\mathbf{K_l} =
\begin{pmatrix}
   \dfrac{EA}{L} & 0 & -\dfrac{EA}{L} & 0 \\[2ex]
   0 & 0 & 0 & 0 \\[1ex]
   -\dfrac{EA}{L} & 0 & \dfrac{EA}{L} & 0 \\[2ex]
   0 & 0 & 0 & 0
\end{pmatrix}
$$

여기서

- $E$는 재료의 탄성계수
- $A$는 부재의 단면적
- $L$은 부재의 길이입니다

## 좌표 변환 행렬 {#transformation-matrix}

요소 좌표 변환 행렬 $\mathbf{T}$는 국부 강성 행렬을 전체 좌표계로 변환하는 데 쓰입니다.

$$
\mathbf{T} = \begin{pmatrix}
   \cos(\alpha) & \sin(\alpha) & 0 & 0 \\
   -\sin(\alpha) & \cos(\alpha) & 0 & 0 \\
   0 & 0 & \cos(\alpha) & \sin(\alpha) \\
   0 & 0 & -\sin(\alpha) & \cos(\alpha)
\end{pmatrix}
$$

## 전체 강성 행렬 {#global-stiffness-matrix}

전체 강성 행렬 $\mathbf{K_g}$는 요소 좌표 변환 행렬 $\mathbf{T}$와 국부 강성 행렬 $\mathbf{K_l}$을 곱해 얻습니다.

$$
\mathbf{K_g} = \mathbf{T}^\mathsf{T} \cdot \mathbf{K_l} \cdot \mathbf{T}
$$

곱한 결과는 다음과 같습니다.

$$
\mathbf{K_g}={ {EA}\over{l}}\left[\begin{array}{cccc}
c^2&cs&-c^2&-cs\\
cs&s^2&-cs& -s^2\\
-c^2&-cs&c^2&cs\\
-cs&-s^2&cs&s^2
\end{array}\right];\;\;\begin{array}{c}c=\cos(\alpha)\\s=\sin(\alpha)\end{array}


$$
