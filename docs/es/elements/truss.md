# Barra de celosía

Una barra de celosía solo transmite esfuerzo axil. En <Edubeam /> no existe un tipo de elemento de celosía independiente: una barra de celosía es un [elemento viga](/es/elements/beam) con **las dos rótulas de extremo** marcadas, lo que condensa los términos de flexión y deja la rigidez axil que sigue.

<TrussElement :hinges="[true, true]"  caption="Esquema de la barra de celosía 2D" />

## Grados de libertad

La barra de celosía 2D tiene dos grados de libertad en cada nodo:

- **Traslación (Dx):** desplazamiento según el eje x.
- **Traslación (Dz):** desplazamiento según el eje z.

## Matriz de rigidez local

La matriz de rigidez local de una barra de celosía es

$$
\mathbf{K_l} =
\begin{pmatrix}
   \frac{EA}{L} & 0 & -\frac{EA}{L} & 0 \\[2ex]
   0 & 0 & 0 & 0 \\[1ex]
   -\frac{EA}{L} & 0 & \frac{EA}{L} & 0 \\[2ex]
   0 & 0 & 0 & 0
\end{pmatrix}
$$

donde

- $E$ es el módulo de Young del material,
- $A$ es el área de la sección,
- $L$ es la longitud de la barra.

## Matriz de transformación

La matriz de transformación del elemento, $\mathbf{T}$, lleva la matriz de rigidez local al sistema de coordenadas global.

$$
\mathbf{T} = \begin{pmatrix}
   \cos(\alpha) & \sin(\alpha) & 0 & 0 \\
   -\sin(\alpha) & \cos(\alpha) & 0 & 0 \\
   0 & 0 & \cos(\alpha) & \sin(\alpha) \\
   0 & 0 & -\sin(\alpha) & \cos(\alpha)
\end{pmatrix}
$$

## Matriz de rigidez global

La matriz de rigidez global, $\mathbf{K_g}$, se obtiene a partir de la matriz de transformación $\mathbf{T}$ y la matriz de rigidez local $\mathbf{K_l}$:

$$
\mathbf{K_g} = \mathbf{T}^\mathsf{T} \cdot \mathbf{K_l} \cdot \mathbf{T}
$$

El producto da como resultado:

$$
\mathbf{K_g}={ {EA}\over{l}}\left[\begin{array}{cccc}
c^2&cs&-c^2&-cs\\
cs&s^2&-cs& -s^2\\
-c^2&-cs&c^2&cs\\
-cs&-s^2&cs&s^2
\end{array}\right];\;\;\begin{array}{c}c=\cos(\alpha)\\s=\sin(\alpha)\end{array}
$$
