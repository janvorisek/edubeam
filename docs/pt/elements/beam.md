# Elemento de viga

O único elemento do <Edubeam /> é uma **viga de Timoshenko** de dois nós no plano x–z. Em relação à viga clássica de Euler–Bernoulli, acrescenta a deformação por cisalhamento, relevante em barras altas ou curtas e desprezível nas esbeltas. A convenção de sinais está resumida na página de [convenções](/pt/elements/conventions).

<TrussElement :moment="true" caption="Esquema da viga de Timoshenko 2D" />

## Graus de liberdade

A viga de Timoshenko 2D tem três graus de liberdade em cada nó:

- **Translação (Dx):** deslocamento ao longo do eixo x.
- **Translação (Dz):** deslocamento ao longo do eixo z.
- **Rotação (Ry):** rotação em torno do eixo y.

As cargas são especificadas na direção dos graus de liberdade:

- **Força horizontal (Fx):** força ao longo do eixo x.
- **Força vertical (Fz):** força ao longo do eixo z.
- **Momento (My):** momento em torno do eixo y.

## Matriz de rigidez local

A matriz de rigidez da viga em coordenadas locais é

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

onde

- $E$ é o módulo de Young do material,
- $A$ é a área da seção transversal,
- $L$ é o comprimento da barra,
- $I_y$ é o momento de inércia da seção em torno do eixo y,
- $\varphi$ é o parâmetro adimensional de flexibilidade ao cisalhamento

$$
\varphi = \frac{12\,E I_y}{k\,G\,A\,L^2}
$$

com $G$ o módulo de cisalhamento e $k$ o **coeficiente de cisalhamento** da seção (área efetiva ao cisalhamento $kA$). Para $\varphi \to 0$ (barra esbelta ou $k$ muito grande) a matriz se reduz à da viga de Euler–Bernoulli.

## Rótulas de extremidade

Uma rótula em uma extremidade do elemento libera o grau de liberdade de rotação correspondente: a rotação é condensada para fora da matriz 6 × 6 (condensação estática, $M = 0$ naquela extremidade) e o elemento é montado com os graus de liberdade restantes. Com as duas extremidades liberadas, sobrevivem apenas os termos axiais e o elemento se comporta como uma [barra de treliça](/pt/elements/truss).

## Cargas de elemento

Cargas distribuídas, concentradas e térmicas são convertidas em **cargas nodais equivalentes** $\mathbf{f}_{eq}$ (o oposto das reações de engastamento perfeito) e somadas ao vetor global de cargas. Após a solução, os esforços ao longo do elemento são recuperados a partir dos deslocamentos de extremidade mais a solução particular exata da carga de elemento, de modo que os diagramas são exatos ao longo da barra.

## Matriz de transformação

A matriz de transformação do elemento, $\mathbf{T}$, leva a matriz de rigidez local ao sistema de coordenadas global.

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

A matriz de rigidez global, $\mathbf{K_g}$, é obtida a partir da matriz de transformação $\mathbf{T}$ e da matriz de rigidez local $\mathbf{K_l}$:

$$
\mathbf{K_g} = \mathbf{T}^\mathsf{T} \cdot \mathbf{K_l} \cdot \mathbf{T}
$$
