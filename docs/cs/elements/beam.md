# Prutový prvek (nosník)

<Edubeam /> má jediný prvek: dvouuzlový **Timoshenkův nosník** v rovině x–z. Na rozdíl od klasického Eulerova–Bernoulliho nosníku zahrnuje vliv smykové deformace, který je podstatný u vysokých nebo krátkých prutů, zatímco u štíhlých prutů je zanedbatelný. Znaménkovou konvenci shrnuje stránka [konvence](/cs/elements/conventions).

<TrussElement :moment="true" caption="Schéma rovinného Timoshenkova nosníku" />

## Stupně volnosti {#degrees-of-freedom}

Rovinný Timoshenkův nosník má v každém uzlu tři stupně volnosti:

- **Posunutí (Dx):** posun ve směru osy x.
- **Posunutí (Dz):** posun ve směru osy z.
- **Pootočení (Ry):** pootočení kolem osy y.

Zatížení zadáváte ve směrech stupňů volnosti:

- **Vodorovná síla (Fx):** síla ve směru osy x.
- **Svislá síla (Fz):** síla ve směru osy z.
- **Moment (My):** moment kolem osy y.

## Lokální matice tuhosti {#local-stiffness-matrix}

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

kde $G$ je modul pružnosti ve smyku a $k$ **smykový součinitel** průřezu (účinná smyková plocha je $kA$). Pro $\varphi \to 0$ (štíhlý prut nebo velmi velké $k$) přechází matice v matici tuhosti Eulerova–Bernoulliho nosníku.

## Koncové klouby {#end-hinges}

Kloub na konci prvku uvolní příslušné pootočení: to se z matice 6 × 6 vyloučí statickou kondenzací ($M = 0$ na daném konci) a do soustavy vstupují jen zbývající stupně volnosti. Když uvolníte oba konce, zůstanou jen osové členy a prvek se chová jako [příhradový prut](/cs/elements/truss).

## Prvková zatížení {#element-loads}

Spojité, osamělé i teplotní zatížení se převádí na **ekvivalentní uzlové zatížení** $\mathbf{f}_{eq}$ (primární koncové síly s opačným znaménkem) a přičte se ke globálnímu vektoru zatížení. Po vyřešení se vnitřní síly po délce prutu dopočítají z koncových posunutí a z přesného partikulárního řešení pro dané prvkové zatížení. Průběhy jsou proto přesné po celé délce prutu.

## Transformační matice {#transformation-matrix}

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

## Globální matice tuhosti {#global-stiffness-matrix}

Globální matice tuhosti $\mathbf{K_g}$ vznikne z transformační matice $\mathbf{T}$ a lokální matice tuhosti $\mathbf{K_l}$:

$$
\mathbf{K_g} = \mathbf{T}^\mathsf{T} \cdot \mathbf{K_l} \cdot \mathbf{T}
$$
