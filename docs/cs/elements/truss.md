# Příhradový prut

Příhradový prut přenáší pouze normálovou sílu. <Edubeam /> nemá samostatný typ příhradového prvku: příhradový prut je [prutový prvek](/cs/elements/beam) se zaškrtnutými **oběma koncovými klouby**. Kondenzace pak odstraní ohybové členy a zůstane jen osová tuhost uvedená níže.

<TrussElement :hinges="[true, true]"  caption="Schéma rovinného příhradového prutu" />

## Stupně volnosti {#degrees-of-freedom}

Rovinný příhradový prut má v každém uzlu dva stupně volnosti:

- **Posunutí (Dx):** posun ve směru osy x.
- **Posunutí (Dz):** posun ve směru osy z.

## Lokální matice tuhosti {#local-stiffness-matrix}

Lokální matice tuhosti příhradového prutu je

$$
\mathbf{K_l} =
\begin{pmatrix}
   \frac{EA}{L} & 0 & -\frac{EA}{L} & 0 \\[2ex]
   0 & 0 & 0 & 0 \\[1ex]
   -\frac{EA}{L} & 0 & \frac{EA}{L} & 0 \\[2ex]
   0 & 0 & 0 & 0
\end{pmatrix}
$$

kde

- $E$ je modul pružnosti materiálu,
- $A$ je plocha průřezu,
- $L$ je délka prutu.

## Transformační matice {#transformation-matrix}

Transformační matice prvku $\mathbf{T}$ převádí lokální matici tuhosti do globálního souřadného systému.

$$
\mathbf{T} = \begin{pmatrix}
   \cos(\alpha) & \sin(\alpha) & 0 & 0 \\
   -\sin(\alpha) & \cos(\alpha) & 0 & 0 \\
   0 & 0 & \cos(\alpha) & \sin(\alpha) \\
   0 & 0 & -\sin(\alpha) & \cos(\alpha)
\end{pmatrix}
$$

## Globální matice tuhosti {#global-stiffness-matrix}

Globální matice tuhosti $\mathbf{K_g}$ vznikne z transformační matice $\mathbf{T}$ a lokální matice tuhosti $\mathbf{K_l}$:

$$
\mathbf{K_g} = \mathbf{T}^\mathsf{T} \cdot \mathbf{K_l} \cdot \mathbf{T}
$$

Po roznásobení:

$$
\mathbf{K_g}={ {EA}\over{l}}\left[\begin{array}{cccc}
c^2&cs&-c^2&-cs\\
cs&s^2&-cs& -s^2\\
-c^2&-cs&c^2&cs\\
-cs&-s^2&cs&s^2
\end{array}\right];\;\;\begin{array}{c}c=\cos(\alpha)\\s=\sin(\alpha)\end{array}
$$
