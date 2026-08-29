# Barre de treillis

Une barre de treillis ne transmet que l’effort normal. Dans <Edubeam />, il n’existe pas de type d’élément treillis distinct : une barre de treillis est un [élément poutre](/fr/elements/beam) dont **les deux rotules d’extrémité** sont cochées, ce qui condense les termes de flexion et ne laisse que la rigidité axiale ci-dessous.

<TrussElement :hinges="[true, true]"  caption="Schéma de la barre de treillis 2D" />

## Degrés de liberté

La barre de treillis 2D possède deux degrés de liberté en chaque nœud :

- **Translation (Dx) :** déplacement selon l’axe x.
- **Translation (Dz) :** déplacement selon l’axe z.

## Matrice de rigidité locale

La matrice de rigidité locale d’une barre de treillis s’écrit

$$
\mathbf{K_l} =
\begin{pmatrix}
   \frac{EA}{L} & 0 & -\frac{EA}{L} & 0 \\[2ex]
   0 & 0 & 0 & 0 \\[1ex]
   -\frac{EA}{L} & 0 & \frac{EA}{L} & 0 \\[2ex]
   0 & 0 & 0 & 0
\end{pmatrix}
$$

où

- $E$ est le module d’Young du matériau,
- $A$ est l’aire de la section,
- $L$ est la longueur de la barre.

## Matrice de passage

La matrice de passage de l’élément, $\mathbf{T}$, transforme la matrice de rigidité locale dans le repère global.

$$
\mathbf{T} = \begin{pmatrix}
   \cos(\alpha) & \sin(\alpha) & 0 & 0 \\
   -\sin(\alpha) & \cos(\alpha) & 0 & 0 \\
   0 & 0 & \cos(\alpha) & \sin(\alpha) \\
   0 & 0 & -\sin(\alpha) & \cos(\alpha)
\end{pmatrix}
$$

## Matrice de rigidité globale

La matrice de rigidité globale $\mathbf{K_g}$ s’obtient à partir de la matrice de passage $\mathbf{T}$ et de la matrice de rigidité locale $\mathbf{K_l}$ :

$$
\mathbf{K_g} = \mathbf{T}^\mathsf{T} \cdot \mathbf{K_l} \cdot \mathbf{T}
$$

Le produit donne :

$$
\mathbf{K_g}={ {EA}\over{l}}\left[\begin{array}{cccc}
c^2&cs&-c^2&-cs\\
cs&s^2&-cs& -s^2\\
-c^2&-cs&c^2&cs\\
-cs&-s^2&cs&s^2
\end{array}\right];\;\;\begin{array}{c}c=\cos(\alpha)\\s=\sin(\alpha)\end{array}
$$
