---
description: "ステップごとのチュートリアル：等分布荷重を受ける 3 ヒンジラーメンを EduBeam でモデル化し、反力と曲げモーメントを手計算で確認します。所要時間は約 15 分です。"
---

# チュートリアル：3 ヒンジラーメン

3 ヒンジラーメンは静定構造です。3 つのつり合い式に、ヒンジで $M = 0$ という条件を加えれば、4 つの支点反力がすべて求まります。そのため、EduBeam が描くすべての数値を確かめるのにうってつけのモデルです。所要時間は約 15 分です。

![完成したラーメン：曲げモーメントと反力](/screenshots/ja/tut-frame-moment.webp)

モデルを眺めるだけなら、[完成したモデルを開いて](https://run.edubeam.app/?model=eyJuIjpbWyJBIixbMCwwLDBdLFswLDJdLG51bGxdLFsiQiIsWzAsMCwtNF0sW10sbnVsbF0sWyJDIixbNCwwLC00XSxbXSxudWxsXSxbIkQiLFs4LDAsLTRdLFtdLG51bGxdLFsiRSIsWzgsMCwwXSxbMCwyXSxudWxsXV0sImUiOltbIjEiLFsiQSIsIkIiXSwiMSIsIjEiLFtmYWxzZSxmYWxzZV1dLFsiMiIsWyJCIiwiQyJdLCIxIiwiMSIsW2ZhbHNlLHRydWVdXSxbIjMiLFsiQyIsIkQiXSwiMSIsIjEiLFtmYWxzZSxmYWxzZV1dLFsiNCIsWyJEIiwiRSJdLCIxIiwiMSIsW2ZhbHNlLGZhbHNlXV1dLCJtIjpbWyIxIiw3ODUwLDIxMDAwMDAwMDAwMCw4MTAwMDAwMDAwMCwwLjAwMDAxMl1dLCJjcyI6W1siMSIsMC4wMDUzOCwwLjAwMDA4MzU2LDAuMywxXV0sImVsIjpbWyIyIixbMCwxMDAwMF0sZmFsc2VdLFsiMyIsWzAsMTAwMDBdLGZhbHNlXV0sImQiOltdfQ%3D%3D&lang=ja){target="_blank"}ください。

## 問題 {#the-problem}

- 高さ 4 m の柱が 2 本あり、柱脚 A と E はピン支点で、間隔は 8 m です。
- 柱の上に水平な梁 B–D があり、スパン中央 C にヒンジがあります。
- 梁全体に等分布荷重 $q = 10$ kN/m が作用します。
- 鋼（$E = 210$ GPa、$G = 81$ GPa）、IPE 300（$A = 53.8$ cm²、$I_y = 8356$ cm⁴、$h = 300$ mm）。

| 節点 | X [m] | Z [m] | 支点 |
| --- | --- | --- | --- |
| A | 0 | 0 | ピン |
| B | 0 | −4 | |
| C | 4 | −4 | （梁のヒンジ） |
| D | 8 | −4 | |
| E | 8 | 0 | ピン |

**z は下向き**なので、柱の頂部は `Z = −4` にあることに注意してください。

## 1. 材料と断面 {#_1-material-and-section}

1. **モデルをクリア**（*材料を削除*と*断面を削除*にチェック）。
2. *材料* → **材料ライブラリ** → **Steel (S235)**。
3. *断面* → **断面を追加**：`断面積 = 0.00538`、`Iy = 8.356e-5`、`高さ = 0.3`、`せん断補正係数 = 1`。

断面が影響するのは変位だけです。このラーメンは静定なので、断面力は $E$、$A$、$I$ にまったく依存しません。

## 2. ラーメンを描く {#_2-draw-the-frame}

いちばん速いのは、マウスで 1 本の折れ線として描く方法です。

1. **グリッドにスナップ**がオンになっていることを確認します（**S** チップ）。
2. *要素*タブ → 2 つ目の**要素を追加**ボタン（カーソルアイコン）。
3. (0, 0)、(0, −4)、(4, −4)、(8, −4)、(8, 0) の順にクリックします。定規とクロスヘアを見ながら位置を合わせてください。クリックするたびに節点が追加され、直前の節点と接続されます。
4. <kbd>Esc</kbd> で終了し、<kbd>F</kbd> でラーメンを画面に合わせます。

これで 5 つの節点と 4 つの要素ができました。ここでの図では節点を A–E と表記しています。必要なら*節点*の表で名前を変えるか、1–5 のままにしてもかまいません。表で座標を確認し、グリッドからずれたものがあれば修正してください。

## 3. 支点とヒンジ {#_3-supports-and-the-hinge}

1. 節点 A をクリックし、**支点条件**を開いて**ピン**を選びます。節点 E も同様にします。
2. *要素*の表で B から C への要素を探し、**終端**のヒンジ（*材端ヒンジ*の 2 つ目のボックス）にチェックを入れます。

![要素の表：ヒンジは要素 2 の終端、節点 C にあります](/screenshots/ja/elements-table.webp)

::: tip ヒンジは 1 つで十分
要素 B–C の終端にヒンジを付ければ十分です。C で剛に接続しているのは C–D だけなので、C–D は節点にモーメントを伝えられず、C のモーメントは 0 になります。C–D の始端にもチェックを入れても何も変わりません。ところが B にもヒンジを付けると、ラーメンは不安定構造になります。試してみてください。EduBeam がその動き方を見せてくれます。
:::

## 4. 荷重 {#_4-load}

*荷重* → **要素荷重を追加** → *等分布荷重*、要素 B–C、`fz = 10` kN/m。要素 C–D についても同じ操作を繰り返します。梁は水平なので、ここでは LCS のボックスは結果に影響しません。

## 5. 結果 {#_5-results}

表示オプションでは、初期状態で変形図、曲げモーメント、反力がオンになっています。残りを見るには **N (x)** と **V<sub>z</sub> (x)** にチェックを入れます。

<div class="shots">

![曲げモーメントと反力](/screenshots/ja/tut-frame-moment.webp)

![軸力](/screenshots/ja/tut-frame-normal.webp)

![せん断力](/screenshots/ja/results-shear.webp)

![変形図](/screenshots/ja/results-deformed.webp)

</div>

## 6. 手計算で確認する {#_6-check-by-hand}

**鉛直反力。** 対称性から、各柱脚が荷重の半分を負担します。

$$V_A = V_E = \frac{q \cdot 8}{2} = 40\ \text{kN}$$

**水平反力。** ラーメンの左半分について、ヒンジ C まわりのモーメントを考えます。そこでのモーメントは 0 でなければなりません。

$$V_A \cdot 4 - H_A \cdot 4 - q \cdot 4 \cdot 2 = 0 \quad\Rightarrow\quad H_A = \frac{160 - 80}{4} = 20\ \text{kN}$$

両方の柱脚は 20 kN で内側に押しています。この水平推力こそが、3 ヒンジラーメンを効率的な構造にしています。

**断面力。**

| 量 | 式 | 手計算 | EduBeam |
| --- | --- | --- | --- |
| 鉛直反力 | $qL/2$ | 40 kN | 40 kN |
| 水平反力 | $M_C = 0$ から | 20 kN | 20 kN |
| 隅角部 B と D のモーメント | $H \cdot h$ | 80 kNm、外側引張 | −80 kNm |
| ヒンジ C のモーメント | | 0 | 0 |
| 柱の軸力 | $-V_A$ | −40 kN | −40 kN |
| 梁の軸力 | $-H_A$ | −20 kN | −20 kN |
| 柱のせん断力 | $H_A$ | 20 kN | −20 kN（A–B）、+20 kN（D–E） |
| B での梁のせん断力 | $V_A$ | 40 kN | 40 kN |
| C での梁のせん断力 | $V_A - 4q$ | 0 | 0 |
| D での梁のせん断力 | $V_A - 8q$ | −40 kN | −40 kN |

2 本の柱は同じ大きさの力を負担しているのに、せん断力の符号が逆です。各要素のローカル座標軸は要素の向きに従い、A–B は上向き、D–E は下向きに描かれているからです。片方の柱の節点を入れ替えると、符号が反転します。

梁では $M(x) = -80 + 40x - 5x^2$ kNm（x は B から）で、ヒンジで 0 になり、正になることはありません。梁全体が上側引張です。せん断力 $V(x) = 40 - 10x$ はちょうど C で 0 になるので、モーメントの極値もヒンジの位置にあります。

**変位。** ヒンジ C は 43.1 mm 沈みます（*結果 → 節点結果*、C の `Dz`）。これは 4 つの部材すべての曲げによるもので、仮想仕事の原理のよい練習問題になります。

## 7. いろいろ試す {#_7-experiment}

- C の**ヒンジのチェックを外す**。ラーメンは 1 次不静定になり、隅角部のモーメントが小さくなって、スパン中央に正の曲げモーメント（下側引張）が現れます。今度は断面が影響します。より剛な梁を試してみましょう。
- **柱脚を固定する**（**固定**の支点を選ぶ）。A と E にモーメントが生じます。
- **水平荷重を加える**：B に節点荷重 `Fx = 10` kN。ラーメンは水平に変位し、反力は左右対称でなくなります。同じ 3 つの式と $M_C = 0$ で確かめてみましょう。
- **B にもヒンジ**を付ける。ラーメンは不安定構造になり、EduBeam がその動き方をアニメーションで示します。
