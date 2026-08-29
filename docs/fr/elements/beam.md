# Élément poutre

Le seul élément d’<Edubeam /> est une **poutre de Timoshenko** à deux nœuds dans le plan x–z. Par rapport à la poutre classique d’Euler–Bernoulli, elle ajoute la déformation de cisaillement, importante pour les barres hautes ou courtes et négligeable pour les barres élancées. Les conventions de signe sont résumées sur la page [Conventions](/fr/elements/conventions).

<TrussElement :moment="true" caption="Schéma de la poutre de Timoshenko 2D" />

## Degrés de liberté

La poutre de Timoshenko 2D possède trois degrés de liberté en chaque nœud :

- **Translation (Dx) :** déplacement selon l’axe x.
- **Translation (Dz) :** déplacement selon l’axe z.
- **Rotation (Ry) :** rotation autour de l’axe y.

Les charges sont définies dans la direction des degrés de liberté :

- **Force horizontale (Fx) :** force selon l’axe x.
- **Force verticale (Fz) :** force selon l’axe z.
- **Moment (My) :** moment autour de l’axe y.

## Matrice de rigidité locale

La matrice de rigidité de la poutre en repère local s’écrit

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

où

- $E$ est le module d’Young du matériau,
- $A$ est l’aire de la section,
- $L$ est la longueur de la barre,
- $I_y$ est le moment quadratique de la section par rapport à l’axe y,
- $\varphi$ est le paramètre adimensionnel de souplesse au cisaillement

$$
\varphi = \frac{12\,E I_y}{k\,G\,A\,L^2}
$$

avec $G$ le module de cisaillement et $k$ le **coefficient de cisaillement** de la section (aire réduite $kA$). Pour $\varphi \to 0$ (barre élancée ou $k$ très grand), la matrice se réduit à celle de la poutre d’Euler–Bernoulli.

## Rotules d’extrémité

Une rotule à une extrémité libère le degré de liberté de rotation correspondant : la rotation est condensée hors de la matrice 6 × 6 (condensation statique, $M = 0$ à cette extrémité) et l’élément est assemblé avec les degrés de liberté restants. Avec les deux extrémités libérées, seuls les termes axiaux subsistent et l’élément se comporte comme une [barre de treillis](/fr/elements/truss).

## Charges d’élément

Charges réparties, ponctuelles et thermiques sont converties en **charges nodales équivalentes** $\mathbf{f}_{eq}$ (opposé des réactions d’encastrement parfait) et ajoutées au vecteur global des charges. Après résolution, les sollicitations le long de l’élément sont reconstruites à partir des déplacements d’extrémité et de la solution particulière exacte de la charge d’élément, si bien que les diagrammes sont exacts le long de la barre.

## Matrice de passage

La matrice de passage de l’élément, $\mathbf{T}$, transforme la matrice de rigidité locale dans le repère global.

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

## Matrice de rigidité globale

La matrice de rigidité globale $\mathbf{K_g}$ s’obtient à partir de la matrice de passage $\mathbf{T}$ et de la matrice de rigidité locale $\mathbf{K_l}$ :

$$
\mathbf{K_g} = \mathbf{T}^\mathsf{T} \cdot \mathbf{K_l} \cdot \mathbf{T}
$$
