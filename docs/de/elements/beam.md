# Balkenelement

Das einzige Element in <Edubeam /> ist ein **Timoshenko-Balken** mit zwei Knoten in der x–z-Ebene. Gegenüber dem klassischen Euler-Bernoulli-Balken berücksichtigt er die Schubverformung, die bei hohen oder kurzen Stäben eine Rolle spielt und bei schlanken Stäben verschwindet. Die Vorzeichenkonvention ist auf der Seite [Konventionen](/de/elements/conventions) zusammengefasst.

<TrussElement :moment="true" caption="Schema des ebenen Timoshenko-Balkens" />

## Freiheitsgrade

Der ebene Timoshenko-Balken hat an jedem Knoten drei Freiheitsgrade:

- **Verschiebung (Dx):** Verschiebung entlang der x-Achse.
- **Verschiebung (Dz):** Verschiebung entlang der z-Achse.
- **Verdrehung (Ry):** Verdrehung um die y-Achse.

Die Lasten werden in Richtung der Freiheitsgrade angegeben:

- **Horizontalkraft (Fx):** Kraft entlang der x-Achse.
- **Vertikalkraft (Fz):** Kraft entlang der z-Achse.
- **Moment (My):** Moment um die y-Achse.

## Lokale Steifigkeitsmatrix

Die Steifigkeitsmatrix des Balkens in lokalen Koordinaten lautet

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

mit

- $E$ dem Elastizitätsmodul des Materials,
- $A$ der Querschnittsfläche,
- $L$ der Stablänge,
- $I_y$ dem Flächenträgheitsmoment um die y-Achse,
- $\varphi$ dem dimensionslosen Schubnachgiebigkeitsparameter

$$
\varphi = \frac{12\,E I_y}{k\,G\,A\,L^2}
$$

mit $G$ dem Schubmodul und $k$ dem **Schubkoeffizienten** des Querschnitts (wirksame Schubfläche $kA$). Für $\varphi \to 0$ (schlanker Stab oder sehr großes $k$) geht die Matrix in die Steifigkeitsmatrix des Euler-Bernoulli-Balkens über.

## Endgelenke

Ein Gelenk am Elementende gibt den zugehörigen Drehfreiheitsgrad frei: die Verdrehung wird aus der 6 × 6-Matrix herauskondensiert (statische Kondensation, $M = 0$ an diesem Ende), und das Element wird mit den verbleibenden Freiheitsgraden assembliert. Sind beide Enden freigegeben, bleiben nur die Dehnterme übrig und das Element verhält sich wie ein [Fachwerkstab](/de/elements/truss).

## Elementlasten

Strecken-, Einzel- und Temperaturlasten werden in **äquivalente Knotenlasten** $\mathbf{f}_{eq}$ (das Negative der Volleinspannkräfte) umgerechnet und dem globalen Lastvektor hinzugefügt. Nach der Lösung werden die Schnittgrößen entlang des Elements aus den Stabendverschiebungen und der exakten Partikulärlösung der Elementlast zurückgerechnet, sodass die Verläufe entlang des Stabs exakt sind.

## Transformationsmatrix

Die Transformationsmatrix $\mathbf{T}$ des Elements überführt die lokale Steifigkeitsmatrix in das globale Koordinatensystem.

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

## Globale Steifigkeitsmatrix

Die globale Steifigkeitsmatrix $\mathbf{K_g}$ ergibt sich aus der Transformationsmatrix $\mathbf{T}$ und der lokalen Steifigkeitsmatrix $\mathbf{K_l}$:

$$
\mathbf{K_g} = \mathbf{T}^\mathsf{T} \cdot \mathbf{K_l} \cdot \mathbf{T}
$$
