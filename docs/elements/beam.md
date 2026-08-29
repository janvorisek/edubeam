# Beam Element

The only element in <Edubeam /> is a two-node **Timoshenko beam** in the x–z plane. Compared with the classic Euler–Bernoulli beam it adds shear deformation, which matters for deep or short members and disappears for slender ones. Sign conventions are summarised on the [conventions](/elements/conventions) page.

<TrussElement :moment="true" caption="Schematic of 2D Timoshenko beam" />

## Degrees of Freedom

The 2D Timoshenko Beam, with three degrees of freedom (DOFs) at each node:

- **Translation (Dx):** Displacement along the X-axis.
- **Translation (Dz):** Displacement along the Z-axis.
- **Rotation (Ry):** Rotation about the Y-axis.

The loads are specified in the direction of the DOFs:

- **Horizontal Force (Fx):** Force applied along the X-axis.
- **Vertical Force (Fz):** Force applied along the Z-axis.
- **Moment (My):** Moment applied about the Y-axis.

## Local Stiffness Matrix

The beam stiffness matrix in the local coordinates is given by:

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

where:

- $E$ is the Young's modulus of the material
- $A$ is the cross-sectional area of the beam
- $L$ is the length of the beam
- $I_y$ is the second moment of area about the y-axis
- $\varphi$ is the dimensionless shear-flexibility parameter

$$
\varphi = \frac{12\,E I_y}{k\,G\,A\,L^2}
$$

with $G$ the shear modulus and $k$ the cross-section's **shear coefficient** (effective shear area $kA$). For $\varphi \to 0$ (slender beam, or a very large $k$) the matrix reduces to the Euler–Bernoulli beam stiffness.

## End hinges

A hinge at an element end releases the corresponding rotational DOF: the rotation is condensed out of the 6 × 6 matrix (static condensation, $M = 0$ at that end) and the element is assembled with the remaining DOFs. With both ends released only the axial terms survive and the element behaves as a [truss bar](/elements/truss).

## Element loads

Distributed, concentrated and temperature loads are converted to **equivalent nodal loads** $\mathbf{f}_{eq}$ (the negative of the fixed-end forces) and added to the global load vector. After the solution, internal forces along the element are recovered from the end displacements plus the exact particular solution of the element load, so diagrams are exact along the member.

## Transformation Matrix

The element transformation matrix, $\mathbf{T}$, is used to transform the local stiffness matrix to the global coordinate system.

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

## Global Stiffness Matrix

The global stiffness matrix, $\mathbf{K_g}$, is obtained by multiplying the element transformation matrix, $\mathbf{T}$, with the local stiffness matrix, $\mathbf{K_l}$:

$$
\mathbf{K_g} = \mathbf{T}^\mathsf{T} \cdot \mathbf{K_l} \cdot \mathbf{T}
$$
