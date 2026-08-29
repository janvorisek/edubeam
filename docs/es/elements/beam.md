# Elemento viga

El único elemento de <Edubeam /> es una **viga de Timoshenko** de dos nodos en el plano x–z. Frente a la viga clásica de Euler–Bernoulli añade la deformación por cortante, relevante en barras de gran canto o cortas y despreciable en las esbeltas. El convenio de signos se resume en la página de [convenios](/es/elements/conventions).

<TrussElement :moment="true" caption="Esquema de la viga de Timoshenko 2D" />

## Grados de libertad

La viga de Timoshenko 2D tiene tres grados de libertad en cada nodo:

- **Traslación (Dx):** desplazamiento según el eje x.
- **Traslación (Dz):** desplazamiento según el eje z.
- **Giro (Ry):** giro alrededor del eje y.

Las cargas se especifican en la dirección de los grados de libertad:

- **Fuerza horizontal (Fx):** fuerza según el eje x.
- **Fuerza vertical (Fz):** fuerza según el eje z.
- **Momento (My):** momento alrededor del eje y.

## Matriz de rigidez local

La matriz de rigidez de la viga en coordenadas locales es

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

donde

- $E$ es el módulo de Young del material,
- $A$ es el área de la sección,
- $L$ es la longitud de la barra,
- $I_y$ es el momento de inercia de la sección respecto al eje y,
- $\varphi$ es el parámetro adimensional de flexibilidad a cortante

$$
\varphi = \frac{12\,E I_y}{k\,G\,A\,L^2}
$$

con $G$ el módulo de cortante y $k$ el **coeficiente de cortante** de la sección (área eficaz a cortante $kA$). Para $\varphi \to 0$ (barra esbelta o $k$ muy grande) la matriz se reduce a la de la viga de Euler–Bernoulli.

## Rótulas de extremo

Una rótula en un extremo del elemento libera el grado de libertad de giro correspondiente: el giro se condensa fuera de la matriz 6 × 6 (condensación estática, $M = 0$ en ese extremo) y el elemento se ensambla con los grados de libertad restantes. Con ambos extremos liberados solo sobreviven los términos axiles y el elemento se comporta como una [barra de celosía](/es/elements/truss).

## Cargas de elemento

Las cargas distribuidas, concentradas y térmicas se convierten en **cargas nodales equivalentes** $\mathbf{f}_{eq}$ (las fuerzas de empotramiento perfecto cambiadas de signo) y se suman al vector global de cargas. Tras la solución, los esfuerzos a lo largo del elemento se recuperan a partir de los desplazamientos de extremo más la solución particular exacta de la carga de elemento, de modo que los diagramas son exactos a lo largo de la barra.

## Matriz de transformación

La matriz de transformación del elemento, $\mathbf{T}$, lleva la matriz de rigidez local al sistema de coordenadas global.

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

## Matriz de rigidez global

La matriz de rigidez global, $\mathbf{K_g}$, se obtiene a partir de la matriz de transformación $\mathbf{T}$ y la matriz de rigidez local $\mathbf{K_l}$:

$$
\mathbf{K_g} = \mathbf{T}^\mathsf{T} \cdot \mathbf{K_l} \cdot \mathbf{T}
$$
