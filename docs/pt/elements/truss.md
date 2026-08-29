# Barra de treliça

Uma barra de treliça transmite apenas esforço normal. No <Edubeam /> não existe um tipo de elemento de treliça separado: uma barra de treliça é um [elemento de viga](/pt/elements/beam) com **as duas rótulas de extremidade** marcadas, o que condensa os termos de flexão e deixa a rigidez axial abaixo.

<TrussElement :hinges="[true, true]"  caption="Esquema da barra de treliça 2D" />

## Graus de liberdade

A barra de treliça 2D tem dois graus de liberdade em cada nó:

- **Translação (Dx):** deslocamento ao longo do eixo x.
- **Translação (Dz):** deslocamento ao longo do eixo z.

## Matriz de rigidez local

A matriz de rigidez local de uma barra de treliça é

$$
\mathbf{K_l} =
\begin{pmatrix}
   \frac{EA}{L} & 0 & -\frac{EA}{L} & 0 \\[2ex]
   0 & 0 & 0 & 0 \\[1ex]
   -\frac{EA}{L} & 0 & \frac{EA}{L} & 0 \\[2ex]
   0 & 0 & 0 & 0
\end{pmatrix}
$$

onde

- $E$ é o módulo de Young do material,
- $A$ é a área da seção transversal,
- $L$ é o comprimento da barra.

## Matriz de transformação

A matriz de transformação do elemento, $\mathbf{T}$, leva a matriz de rigidez local ao sistema de coordenadas global.

$$
\mathbf{T} = \begin{pmatrix}
   \cos(\alpha) & \sin(\alpha) & 0 & 0 \\
   -\sin(\alpha) & \cos(\alpha) & 0 & 0 \\
   0 & 0 & \cos(\alpha) & \sin(\alpha) \\
   0 & 0 & -\sin(\alpha) & \cos(\alpha)
\end{pmatrix}
$$

## Matriz de rigidez global

A matriz de rigidez global, $\mathbf{K_g}$, é obtida a partir da matriz de transformação $\mathbf{T}$ e da matriz de rigidez local $\mathbf{K_l}$:

$$
\mathbf{K_g} = \mathbf{T}^\mathsf{T} \cdot \mathbf{K_l} \cdot \mathbf{T}
$$

O produto resulta em:

$$
\mathbf{K_g}={ {EA}\over{l}}\left[\begin{array}{cccc}
c^2&cs&-c^2&-cs\\
cs&s^2&-cs& -s^2\\
-c^2&-cs&c^2&cs\\
-cs&-s^2&cs&s^2
\end{array}\right];\;\;\begin{array}{c}c=\cos(\alpha)\\s=\sin(\alpha)\end{array}
$$
