# Kiriş elemanı

<Edubeam /> yalnızca tek bir eleman türü kullanır: x–z düzleminde iki düğümlü bir **Timoshenko kirişi**. Klasik Euler–Bernoulli kirişinden farkı kayma şekil değiştirmesini de hesaba katmasıdır; bu etki yüksek kesitli veya kısa çubuklarda önemlidir, narin çubuklarda ise ihmal edilebilir. İşaret kabulleri [koordinat sistemi ve işaret kabulü](/tr/elements/conventions) sayfasında özetlenmiştir.

<TrussElement :moment="true" caption="Düzlem Timoshenko kirişinin şeması" />

## Serbestlik dereceleri {#degrees-of-freedom}

Düzlem Timoshenko kirişinin her düğümünde üç serbestlik derecesi vardır:

- **Ötelenme (Dx):** x ekseni doğrultusunda yer değiştirme.
- **Ötelenme (Dz):** z ekseni doğrultusunda yer değiştirme.
- **Dönme (Ry):** y ekseni etrafında dönme.

Yükler serbestlik derecelerinin doğrultularında tanımlanır:

- **Yatay kuvvet (Fx):** x ekseni doğrultusunda etkiyen kuvvet.
- **Düşey kuvvet (Fz):** z ekseni doğrultusunda etkiyen kuvvet.
- **Moment (My):** y ekseni etrafında etkiyen moment.

## Yerel rijitlik matrisi {#local-stiffness-matrix}

Kirişin yerel koordinatlardaki rijitlik matrisi şöyledir:

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

Burada:

- $E$ malzemenin elastisite modülü,
- $A$ kiriş kesitinin alanı,
- $L$ kirişin boyu,
- $I_y$ kesitin y eksenine göre atalet momenti,
- $\varphi$ boyutsuz kayma esnekliği parametresidir:

$$
\varphi = \frac{12\,E I_y}{k\,G\,A\,L^2}
$$

Burada $G$ kayma modülü, $k$ ise kesitin **kayma düzeltme katsayısıdır** (etkin kayma alanı $kA$). $\varphi \to 0$ için (narin kiriş veya çok büyük bir $k$) matris, Euler–Bernoulli kirişinin rijitlik matrisine dönüşür.

## Uç mafsalları {#end-hinges}

Eleman ucundaki bir mafsal, o uçtaki dönme serbestlik derecesini serbest bırakır: dönme, 6 × 6'lık matristen statik kondensasyonla çıkarılır (o uçta $M = 0$) ve eleman kalan serbestlik dereceleriyle sisteme eklenir. İki uç da serbest bırakılırsa yalnızca eksenel terimler kalır ve eleman bir [kafes çubuğu](/tr/elements/truss) gibi davranır.

## Eleman yükleri {#element-loads}

Yayılı, tekil ve sıcaklık yükleri **eşdeğer düğüm yüklerine** $\mathbf{f}_{eq}$ (ankastrelik uç kuvvetlerinin ters işaretlisi) dönüştürülür ve genel yük vektörüne eklenir. Çözümden sonra eleman boyunca iç kuvvetler, uç yer değiştirmelerinden ve eleman yükünün kesin özel çözümünden elde edilir; bu sayede diyagramlar çubuk boyunca kesindir.

## Dönüşüm matrisi {#transformation-matrix}

Eleman dönüşüm matrisi $\mathbf{T}$, yerel rijitlik matrisini genel koordinat sistemine dönüştürmek için kullanılır.

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

## Genel rijitlik matrisi {#global-stiffness-matrix}

Genel rijitlik matrisi $\mathbf{K_g}$, eleman dönüşüm matrisi $\mathbf{T}$ ile yerel rijitlik matrisi $\mathbf{K_l}$'nin çarpılmasıyla elde edilir:

$$
\mathbf{K_g} = \mathbf{T}^\mathsf{T} \cdot \mathbf{K_l} \cdot \mathbf{T}
$$
