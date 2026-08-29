# Fachwerkstab

Ein Fachwerkstab überträgt nur Normalkraft. In <Edubeam /> gibt es keinen eigenen Fachwerk-Elementtyp: ein Fachwerkstab ist ein [Balkenelement](/de/elements/beam) mit **beiden Endgelenken** angehakt, wodurch die Biegeterme herauskondensiert werden und die unten stehende Dehnsteifigkeit übrig bleibt.

<TrussElement :hinges="[true, true]"  caption="Schema des ebenen Fachwerkstabs" />

## Freiheitsgrade

Der ebene Fachwerkstab hat an jedem Knoten zwei Freiheitsgrade:

- **Verschiebung (Dx):** Verschiebung entlang der x-Achse.
- **Verschiebung (Dz):** Verschiebung entlang der z-Achse.

## Lokale Steifigkeitsmatrix

Die lokale Steifigkeitsmatrix des Fachwerkstabs lautet

$$
\mathbf{K_l} =
\begin{pmatrix}
   \frac{EA}{L} & 0 & -\frac{EA}{L} & 0 \\[2ex]
   0 & 0 & 0 & 0 \\[1ex]
   -\frac{EA}{L} & 0 & \frac{EA}{L} & 0 \\[2ex]
   0 & 0 & 0 & 0
\end{pmatrix}
$$

mit

- $E$ dem Elastizitätsmodul des Materials,
- $A$ der Querschnittsfläche,
- $L$ der Stablänge.

## Transformationsmatrix

Die Transformationsmatrix $\mathbf{T}$ des Elements überführt die lokale Steifigkeitsmatrix in das globale Koordinatensystem.

$$
\mathbf{T} = \begin{pmatrix}
   \cos(\alpha) & \sin(\alpha) & 0 & 0 \\
   -\sin(\alpha) & \cos(\alpha) & 0 & 0 \\
   0 & 0 & \cos(\alpha) & \sin(\alpha) \\
   0 & 0 & -\sin(\alpha) & \cos(\alpha)
\end{pmatrix}
$$

## Globale Steifigkeitsmatrix

Die globale Steifigkeitsmatrix $\mathbf{K_g}$ ergibt sich aus der Transformationsmatrix $\mathbf{T}$ und der lokalen Steifigkeitsmatrix $\mathbf{K_l}$:

$$
\mathbf{K_g} = \mathbf{T}^\mathsf{T} \cdot \mathbf{K_l} \cdot \mathbf{T}
$$

Ausmultipliziert ergibt sich

$$
\mathbf{K_g}={ {EA}\over{l}}\left[\begin{array}{cccc}
c^2&cs&-c^2&-cs\\
cs&s^2&-cs& -s^2\\
-c^2&-cs&c^2&cs\\
-cs&-s^2&cs&s^2
\end{array}\right];\;\;\begin{array}{c}c=\cos(\alpha)\\s=\sin(\alpha)\end{array}
$$
