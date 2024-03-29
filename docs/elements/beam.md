# Beam Element

Timoshenko beam theory accommodates shear deformation and rotational bending in thick beams and high-frequency situations.

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
- $\varphi$ is the shear correction factor

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
