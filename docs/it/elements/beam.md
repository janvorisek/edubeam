---
description: "L'elemento trave di Timoshenko 2D in EduBeam: gradi di libertà, matrice di rigidezza locale con deformazione a taglio, cerniere di estremità, carichi sull'elemento e trasformazione."
---

# Elemento trave

L'unico elemento di <Edubeam /> è una **trave di Timoshenko** a due nodi nel piano x–z. Rispetto alla classica trave di Eulero–Bernoulli aggiunge la deformazione a taglio, che conta per aste tozze o corte e diventa trascurabile per quelle snelle. Le convenzioni dei segni sono riassunte nella pagina sulle [convenzioni](/it/elements/conventions).

<TrussElement :moment="true" caption="Schema della trave di Timoshenko 2D" />

## Gradi di libertà {#degrees-of-freedom}

La trave di Timoshenko 2D ha tre gradi di libertà (GdL) in ogni nodo:

- **Traslazione (Dx):** spostamento lungo l'asse X.
- **Traslazione (Dz):** spostamento lungo l'asse Z.
- **Rotazione (Ry):** rotazione attorno all'asse Y.

I carichi si assegnano nelle direzioni dei GdL:

- **Forza orizzontale (Fx):** forza applicata lungo l'asse X.
- **Forza verticale (Fz):** forza applicata lungo l'asse Z.
- **Momento (My):** momento applicato attorno all'asse Y.

## Matrice di rigidezza locale {#local-stiffness-matrix}

La matrice di rigidezza della trave in coordinate locali è:

$$
\mathbf{K_l} =
\begin{pmatrix}
  \dfrac{EA}{L} & 0 & 0 & -\dfrac{EA}{L} & 0 & 0 & \\[2ex]
  0 & \dfrac{12 EI_y}{ L^3 (1+\varphi)} & \dfrac{-6 EI_y}{L^2 (1+\varphi)} & 0 & \dfrac{-12  EI_y}{L^3 (1+\varphi)} & \dfrac{-6  EI_y}{L^2 (1+\varphi)} &\\[3ex]
  0 & \dfrac{-6  EI_y}{L^2 (1+\varphi)} & \dfrac{(4 + \varphi)  EI_y}{L  (1+\varphi)} & 0 & \dfrac{6  EI_y}{L^2 (1+\varphi)} & \dfrac{(2 - \varphi) EI_y}{L (1+\varphi)} &\\[2ex]
  -\dfrac{EA}{L} & 0 & 0 & \dfrac{EA}{L} & 0 & 0 &\\[2ex]
  0 & \dfrac{-12  EI_y}{L^3 (1+\varphi)} & \dfrac{6  EI_y}{L^2 (1+\varphi)} & 0 & \dfrac{12  EI_y}{ L^3  (1+\varphi)} & \dfrac{6  EI_y}{L^2 (1+\varphi)} &\\[3ex]
  0 & \dfrac{-6  EI_y}{L^2 (1+\varphi)} & \dfrac{(2 - \varphi) EI_y}{L (1+\varphi)} & 0 & \dfrac{6  EI_y}{L^2 (1+\varphi)} & \dfrac{(4 + \varphi)  EI_y}{L  (1+\varphi)}
\end{pmatrix}
$$

dove:

- $E$ è il modulo elastico del materiale
- $A$ è l'area della sezione della trave
- $L$ è la lunghezza della trave
- $I_y$ è il momento d'inerzia rispetto all'asse y
- $\varphi$ è il parametro adimensionale di deformabilità a taglio

$$
\varphi = \frac{12\,E I_y}{k\,G\,A\,L^2}
$$

con $G$ il modulo di taglio e $k$ il **coefficiente di taglio** della sezione (area efficace a taglio $kA$). Per $\varphi \to 0$ (trave snella, o $k$ molto grande) la matrice si riduce alla rigidezza della trave di Eulero–Bernoulli.

## Cerniere di estremità {#end-hinges}

Una cerniera all'estremità di un elemento svincola il GdL rotazionale corrispondente: la rotazione viene eliminata dalla matrice 6 × 6 per condensazione statica ($M = 0$ a quell'estremità) e l'elemento viene assemblato con i GdL rimanenti. Con entrambe le estremità svincolate restano solo i termini assiali e l'elemento si comporta come un'[asta reticolare](/it/elements/truss).

## Carichi sull'elemento {#element-loads}

I carichi distribuiti, concentrati e termici vengono convertiti in **carichi nodali equivalenti** $\mathbf{f}_{eq}$ (l'opposto delle forze di incastro perfetto) e sommati al vettore globale dei carichi. Dopo la soluzione, le sollecitazioni lungo l'elemento vengono ricostruite dagli spostamenti di estremità più la soluzione particolare esatta del carico sull'elemento, quindi i diagrammi sono esatti lungo tutta l'asta.

## Matrice di trasformazione {#transformation-matrix}

La matrice di trasformazione dell'elemento, $\mathbf{T}$, serve a trasformare la matrice di rigidezza locale nel sistema di coordinate globale.

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

## Matrice di rigidezza globale {#global-stiffness-matrix}

La matrice di rigidezza globale, $\mathbf{K_g}$, si ottiene moltiplicando la matrice di trasformazione dell'elemento, $\mathbf{T}$, per la matrice di rigidezza locale, $\mathbf{K_l}$:

$$
\mathbf{K_g} = \mathbf{T}^\mathsf{T} \cdot \mathbf{K_l} \cdot \mathbf{T}
$$
