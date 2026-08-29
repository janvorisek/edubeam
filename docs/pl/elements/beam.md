# Element belkowy

Jedynym elementem w <Edubeam /> jest dwuwęzłowa **belka Timoshenki** w płaszczyźnie x–z. W porównaniu z klasyczną belką Eulera–Bernoulliego uwzględnia ona odkształcenie postaciowe od ścinania, które ma znaczenie dla prętów wysokich lub krótkich, a zanika dla smukłych. Konwencje znaków zebrano na stronie [konwencje](/pl/elements/conventions).

<TrussElement :moment="true" caption="Schemat płaskiej belki Timoshenki" />

## Stopnie swobody

Płaska belka Timoshenki ma trzy stopnie swobody w każdym węźle:

- **Przesunięcie (Dx):** przemieszczenie wzdłuż osi X.
- **Przesunięcie (Dz):** przemieszczenie wzdłuż osi Z.
- **Obrót (Ry):** obrót wokół osi Y.

Obciążenia zadaje się w kierunkach stopni swobody:

- **Siła pozioma (Fx):** siła działająca wzdłuż osi X.
- **Siła pionowa (Fz):** siła działająca wzdłuż osi Z.
- **Moment (My):** moment działający wokół osi Y.

## Lokalna macierz sztywności

Macierz sztywności belki w układzie lokalnym ma postać:

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

gdzie:

- $E$ — moduł Younga materiału
- $A$ — pole przekroju poprzecznego belki
- $L$ — długość belki
- $I_y$ — moment bezwładności przekroju względem osi y
- $\varphi$ — bezwymiarowy parametr podatności na ścinanie

$$
\varphi = \frac{12\,E I_y}{k\,G\,A\,L^2}
$$

przy czym $G$ to moduł Kirchhoffa (ścinania), a $k$ — **współczynnik ścinania** przekroju (efektywne pole ścinania $kA$). Dla $\varphi \to 0$ (belka smukła lub bardzo duże $k$) macierz redukuje się do macierzy sztywności belki Eulera–Bernoulliego.

## Przeguby końcowe

Przegub na końcu elementu zwalnia odpowiedni obrotowy stopień swobody: obrót jest wyeliminowany z macierzy 6 × 6 (kondensacja statyczna, $M = 0$ na tym końcu), a element jest agregowany z pozostałymi stopniami swobody. Przy zwolnieniu obu końców pozostają tylko człony osiowe i element zachowuje się jak [pręt kratownicy](/pl/elements/truss).

## Obciążenia elementów

Obciążenia rozłożone, skupione i termiczne są zamieniane na **zastępcze obciążenia węzłowe** $\mathbf{f}_{eq}$ (siły utwierdzenia ze znakiem przeciwnym) i dodawane do globalnego wektora obciążeń. Po rozwiązaniu siły przekrojowe wzdłuż elementu są odtwarzane z przemieszczeń końcowych oraz dokładnego rozwiązania szczególnego dla obciążenia elementu, dlatego wykresy są dokładne na całej długości pręta.

## Macierz transformacji

Macierz transformacji elementu $\mathbf{T}$ służy do przekształcenia lokalnej macierzy sztywności do globalnego układu współrzędnych.

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

## Globalna macierz sztywności

Globalną macierz sztywności $\mathbf{K_g}$ otrzymuje się przez pomnożenie macierzy transformacji elementu $\mathbf{T}$ i lokalnej macierzy sztywności $\mathbf{K_l}$:

$$
\mathbf{K_g} = \mathbf{T}^\mathsf{T} \cdot \mathbf{K_l} \cdot \mathbf{T}
$$
