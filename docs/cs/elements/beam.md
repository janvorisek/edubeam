# Prutový prvek (nosník)

Jediným prvkem v <Edubeam /> je dvouuzlový **Timoshenkův nosník** v rovině x–z. Oproti klasickému Eulerovu–Bernoulliho nosníku zahrnuje vliv smykové deformace, který je podstatný u vysokých nebo krátkých prutů a u štíhlých prutů mizí. Znaménková konvence je shrnuta na stránce [konvence](/cs/elements/conventions).

<TrussElement :moment="true" caption="Schéma rovinného Timoshenkova nosníku" />

## Stupně volnosti

Rovinný Timoshenkův nosník má v každém uzlu tři stupně volnosti:

- **Posunutí (Dx):** posun ve směru osy x.
- **Posunutí (Dz):** posun ve směru osy z.
- **Pootočení (Ry):** pootočení kolem osy y.

Zatížení se zadává ve směrech stupňů volnosti:

- **Vodorovná síla (Fx):** síla ve směru osy x.
- **Svislá síla (Fz):** síla ve směru osy z.
- **Moment (My):** moment kolem osy y.

## Lokální matice tuhosti

Matice tuhosti nosníku v lokálních souřadnicích je

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

kde

- $E$ je modul pružnosti materiálu,
- $A$ je plocha průřezu,
- $L$ je délka prutu,
- $I_y$ je moment setrvačnosti průřezu k ose y,
- $\varphi$ je bezrozměrný parametr smykové poddajnosti

$$
\varphi = \frac{12\,E I_y}{k\,G\,A\,L^2}
$$

s $G$ smykovým modulem a $k$ **smykovým součinitelem** průřezu (účinná smyková plocha $kA$). Pro $\varphi \to 0$ (štíhlý prut nebo velmi velké $k$) matice přechází v matici tuhosti Eulerova–Bernoulliho nosníku.

## Koncové klouby

Kloub na konci prvku uvolní příslušný rotační stupeň volnosti: pootočení se z matice 6 × 6 vyloučí statickou kondenzací ($M = 0$ na daném konci) a prvek se sestavuje se zbývajícími stupni volnosti. Při uvolnění obou konců zůstanou jen osové členy a prvek se chová jako [příhradový prut](/cs/elements/truss).

## Prvková zatížení

Spojitá, osamělá i teplotní zatížení se převádějí na **ekvivalentní uzlové zatížení** $\mathbf{f}_{eq}$ (záporně vzaté primární koncové síly) a přičítají se ke globálnímu vektoru zatížení. Po řešení se vnitřní síly po délce prutu dopočítají z koncových posunů a z přesného partikulárního řešení pro dané prvkové zatížení, takže průběhy jsou po délce prutu přesné.

## Transformační matice

Transformační matice prvku $\mathbf{T}$ převádí lokální matici tuhosti do globálního souřadného systému.

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

## Globální matice tuhosti

Globální matice tuhosti $\mathbf{K_g}$ vznikne z transformační matice $\mathbf{T}$ a lokální matice tuhosti $\mathbf{K_l}$:

$$
\mathbf{K_g} = \mathbf{T}^\mathsf{T} \cdot \mathbf{K_l} \cdot \mathbf{T}
$$
