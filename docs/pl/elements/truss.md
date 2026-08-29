# Element kratownicy

Element kratownicy przenosi wyłącznie siłę podłużną. W <Edubeam /> nie ma osobnego typu elementu kratownicowego: pręt kratownicy to [element belkowy](/pl/elements/beam) z zaznaczonymi **oboma przegubami końcowymi**, co eliminuje człony giętne i pozostawia poniższą sztywność podłużną.

<TrussElement :hinges="[true, true]"  caption="Schemat płaskiego elementu kratownicy" />

## Stopnie swobody

Płaski element kratownicy ma dwa stopnie swobody w każdym z węzłów:

- **Przesunięcie (Dx):** przemieszczenie wzdłuż osi X.
- **Przesunięcie (Dz):** przemieszczenie wzdłuż osi Z.

## Lokalna macierz sztywności

Lokalna macierz sztywności elementu kratownicy ma postać:

$$
\mathbf{K_l} =
\begin{pmatrix}
   \frac{EA}{L} & 0 & -\frac{EA}{L} & 0 \\[2ex]
   0 & 0 & 0 & 0 \\[1ex]
   -\frac{EA}{L} & 0 & \frac{EA}{L} & 0 \\[2ex]
   0 & 0 & 0 & 0
\end{pmatrix}
$$

gdzie:

- $E$ — moduł Younga materiału
- $A$ — pole przekroju poprzecznego pręta
- $L$ — długość pręta

## Macierz transformacji

Macierz transformacji elementu $\mathbf{T}$ służy do przekształcenia lokalnej macierzy sztywności do globalnego układu współrzędnych.

$$
\mathbf{T} = \begin{pmatrix}
   \cos(\alpha) & \sin(\alpha) & 0 & 0 \\
   -\sin(\alpha) & \cos(\alpha) & 0 & 0 \\
   0 & 0 & \cos(\alpha) & \sin(\alpha) \\
   0 & 0 & -\sin(\alpha) & \cos(\alpha)
\end{pmatrix}
$$

## Globalna macierz sztywności

Globalną macierz sztywności $\mathbf{K_g}$ otrzymuje się przez pomnożenie macierzy transformacji elementu $\mathbf{T}$ i lokalnej macierzy sztywności $\mathbf{K_l}$:

$$
\mathbf{K_g} = \mathbf{T}^\mathsf{T} \cdot \mathbf{K_l} \cdot \mathbf{T}
$$

Wynikiem mnożenia jest:

$$
\mathbf{K_g}={ {EA}\over{l}}\left[\begin{array}{cccc}
c^2&cs&-c^2&-cs\\
cs&s^2&-cs& -s^2\\
-c^2&-cs&c^2&cs\\
-cs&-s^2&cs&s^2
\end{array}\right];\;\;\begin{array}{c}c=\cos(\alpha)\\s=\sin(\alpha)\end{array}


$$
