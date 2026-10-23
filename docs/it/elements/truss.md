---
description: "Come EduBeam modella le aste reticolari come travi con entrambe le estremità incernierate: gradi di libertà, matrice di rigidezza locale e globale e matrice di trasformazione."
---

# Elemento reticolare

Un elemento reticolare porta solo sforzo normale. In <Edubeam /> non esiste un tipo di elemento reticolare separato: un'asta reticolare è un [elemento trave](/it/elements/beam) con **entrambe le cerniere di estremità** spuntate, il che elimina per condensazione i termini flessionali e lascia la rigidezza assiale riportata qui sotto.

<TrussElement :hinges="[true, true]"  caption="Schema dell'elemento reticolare 2D" />

## Gradi di libertà {#degrees-of-freedom}

L'elemento reticolare 2D ha due GdL in ciascun nodo:

- **Traslazione (Dx):** spostamento lungo l'asse X.
- **Traslazione (Dz):** spostamento lungo l'asse Z.

## Matrice di rigidezza locale {#local-stiffness-matrix}

La matrice di rigidezza locale di un elemento reticolare è:

$$
\mathbf{K_l} =
\begin{pmatrix}
   \dfrac{EA}{L} & 0 & -\dfrac{EA}{L} & 0 \\[2ex]
   0 & 0 & 0 & 0 \\[1ex]
   -\dfrac{EA}{L} & 0 & \dfrac{EA}{L} & 0 \\[2ex]
   0 & 0 & 0 & 0
\end{pmatrix}
$$

dove:

- $E$ è il modulo elastico del materiale
- $A$ è l'area della sezione dell'asta
- $L$ è la lunghezza dell'asta

## Matrice di trasformazione {#transformation-matrix}

La matrice di trasformazione dell'elemento, $\mathbf{T}$, serve a trasformare la matrice di rigidezza locale nel sistema di riferimento globale.

$$
\mathbf{T} = \begin{pmatrix}
   \cos(\alpha) & \sin(\alpha) & 0 & 0 \\
   -\sin(\alpha) & \cos(\alpha) & 0 & 0 \\
   0 & 0 & \cos(\alpha) & \sin(\alpha) \\
   0 & 0 & -\sin(\alpha) & \cos(\alpha)
\end{pmatrix}
$$

## Matrice di rigidezza globale {#global-stiffness-matrix}

La matrice di rigidezza globale, $\mathbf{K_g}$, si ottiene moltiplicando la matrice di trasformazione dell'elemento, $\mathbf{T}$, per la matrice di rigidezza locale, $\mathbf{K_l}$:

$$
\mathbf{K_g} = \mathbf{T}^\mathsf{T} \cdot \mathbf{K_l} \cdot \mathbf{T}
$$

Svolgendo il prodotto si ottiene:

$$
\mathbf{K_g}={ {EA}\over{l}}\left[\begin{array}{cccc}
c^2&cs&-c^2&-cs\\
cs&s^2&-cs& -s^2\\
-c^2&-cs&c^2&cs\\
-cs&-s^2&cs&s^2
\end{array}\right];\;\;\begin{array}{c}c=\cos(\alpha)\\s=\sin(\alpha)\end{array}


$$
