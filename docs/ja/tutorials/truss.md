---
description: "ステップごとのチュートリアル：EduBeam で平面トラスを作成し、部材力を節点法と切断法で確認します。所要時間は約 15 分です。"
---

# チュートリアル：平面トラス

このチュートリアルでは、小さな静定トラスを作成し、その部材力を節点法と切断法で確認して、ゼロメンバーを見つけます。所要時間は約 15 分です。

![完成したトラス：軸力と反力](/screenshots/ja/tut-truss.webp)

モデルを眺めるだけなら、[完成したモデルを開いて](https://run.edubeam.app/?model=eyJuIjpbWyIxIixbMCwwLDBdLFswLDJdLG51bGxdLFsiMiIsWzQsMCwwXSxbXSxudWxsXSxbIjMiLFs4LDAsMF0sW10sbnVsbF0sWyI0IixbMTIsMCwwXSxbMl0sbnVsbF0sWyI1IixbNCwwLC0zXSxbXSxudWxsXSxbIjYiLFs4LDAsLTNdLFtdLG51bGxdXSwiZSI6W1siMSIsWyIxIiwiMiJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiMiIsWyIyIiwiMyJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiMyIsWyIzIiwiNCJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiNCIsWyI1IiwiNiJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiNSIsWyIxIiwiNSJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiNiIsWyIyIiwiNSJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiNyIsWyI1IiwiMyJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiOCIsWyIzIiwiNiJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiOSIsWyI2IiwiNCJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dXSwibSI6W1siMSIsNzg1MCwyMTAwMDAwMDAwMDAsODEwMDAwMDAwMDAsMC4wMDAwMTJdXSwiY3MiOltbIjEiLDAuMDAyLDAuMDAwMDAxLDAuMSwxXV0sIm5sIjpbWyIyIix7IjAiOjAsIjIiOjMwMDAwLCI0IjowfV0sWyIzIix7IjAiOjAsIjIiOjMwMDAwLCI0IjowfV1dLCJkIjpbXX0%3D&lang=ja){target="_blank"}ください。

## 問題 {#the-problem}

![形状、支点、荷重](/screenshots/ja/tut-truss-model.webp)

- スパン 12 m を 4 m の 3 パネルに分け、高さは 3 m です。
- 下弦材の節点は 1–4、上弦材の節点は 5 と 6 です。
- 節点 1 がピン支点、節点 4 がローラー支点です。
- 下弦材の節点 2 と 3 に、30 kN の荷重が 2 つ作用します。
- 鋼製の部材で、$A = 20$ cm² です。

| 節点 | X [m] | Z [m] | 支点 | 荷重 |
| --- | --- | --- | --- | --- |
| 1 | 0 | 0 | ピン | |
| 2 | 4 | 0 | | `Fz = 30` kN |
| 3 | 8 | 0 | | `Fz = 30` kN |
| 4 | 12 | 0 | ローラー | |
| 5 | 4 | −3 | | |
| 6 | 8 | −3 | | |

部材：下弦材 1–2、2–3、3–4。上弦材 5–6。端斜材 1–5 と 6–4。垂直材 2–5 と 3–6。中央の斜材 5–3。

**静定か？** 節点数 $j = 6$ に対して $m + r = 9 + 3 = 12 = 2j$ なので、静定です。部材力はつり合いだけから求まります。

## 1. 材料と断面 {#_1-material-and-section}

1. **モデルをクリア**（*材料を削除*と*断面を削除*にチェック）。
2. *材料* → **材料ライブラリ** → **Steel (S235)**。
3. *断面* → **断面を追加**：`断面積 = 0.002`、`Iy = 1e-6`、`高さ = 0.1`、`せん断補正係数 = 1`。部材の両端がヒンジなので、効くのは断面積だけです。

## 2. ヒンジ付きの部材を描く {#_2-draw-the-bars-with-hinges}

EduBeam のトラス材は、**両端の材端ヒンジ**にチェックを入れた梁要素です。マウスツールで自動的に設定できます。

1. *要素*タブ → 2 つ目の**要素を追加**ボタン（カーソルアイコン）。
2. ビューア上部のバナーで**始端ヒンジ**と**終端ヒンジ**にチェックを入れます。これ以降に描く部材には、両方のヒンジが付きます。
3. 外周を 1 本の折れ線として描きます。(0, 0)、(4, −3)、(8, −3)、(12, 0) とクリックし、下側に沿って (8, 0)、(4, 0)、(0, 0) と戻ります。<kbd>Esc</kbd> を押します。
4. 内側の部材を 1 本ずつ描き、そのたびに <kbd>Esc</kbd> を押します：(4, 0) → (4, −3)、(4, −3) → (8, 0)、(8, 0) → (8, −3)。
5. <kbd>F</kbd> で画面に合わせます。

*要素*の表を確認してください。9 つの要素があり、どれも*材端ヒンジ*の両方にチェックが入っているはずです。節点や要素の番号が図と違っていてもかまいません。

## 3. 支点と荷重 {#_3-supports-and-loads}

1. (0, 0) の節点をクリック → **支点条件** → **ピン**。(12, 0) の節点をクリック → **ローラー**。
2. (4, 0) の節点をクリック → **荷重を追加** → `Fz = 30` kN。(8, 0) でも同じようにします。

正の `Fz` は下向きです。トラスの節点は自由に回転できます。EduBeam は、すべての部材がヒンジ接合されている節点も受け入れ、その回転角を 0 として表示します。

## 4. 結果 {#_4-results}

表示オプションで**変形図**と **M<sub>y</sub> (x)** のチェックを外し（トラスには曲げがありません）、**N (x)** にチェックを入れます。

![軸力：引張が正](/screenshots/ja/tut-truss.webp)

## 5. 手計算で確認する {#_5-check-by-hand}

**反力。** 荷重は左右対称なので $R_1 = R_4 = 30$ kN（上向き）で、ピン支点の水平反力は 0 です。

**節点 1**（節点法）。端斜材 1–5 の長さは 5 m です（$\sin\alpha = 3/5$、$\cos\alpha = 4/5$）。

$$\sum F_z:\ N_{15} \cdot \tfrac{3}{5} = -30 \Rightarrow N_{15} = -50\ \text{kN} \qquad \sum F_x:\ N_{12} = -N_{15} \cdot \tfrac{4}{5} = 40\ \text{kN}$$

**節点 2。** 30 kN の荷重を上に伝えられるのは垂直材 2–5 だけです：$N_{25} = +30$ kN、$N_{23} = N_{12} = 40$ kN。

**中央パネルでの切断。** 部材 5–6、5–3、2–3 を切断し、左側を考えます。

- 節点 3 まわりのモーメント：$R_1 \cdot 8 - 30 \cdot 4 + N_{56} \cdot 3 = 0 \Rightarrow N_{56} = -40$ kN。
- 鉛直方向の力：このパネルのせん断力は $R_1 - 30 = 0$ なので、斜材 **5–3 は力を負担しません**：$N_{53} = 0$。

| 部材 | 手計算 | EduBeam |
| --- | --- | --- |
| 下弦材 1–2、2–3、3–4 | +40 kN（引張） | 40 |
| 上弦材 5–6 | −40 kN（圧縮） | −40 |
| 端斜材 1–5、6–4 | −50 kN | −50 |
| 垂直材 2–5、3–6 | +30 kN | 30 |
| 中央の斜材 5–3 | 0 | 0 |

節点 2 のたわみは 2.29 mm です（*結果 → 節点結果*）。練習として、仮想仕事の原理 $\delta = \sum N n L / (EA)$ で計算してみましょう。

## 6. いろいろ試す {#_6-experiment}

- **荷重を 1 つ移動する。** 30 kN の荷重を 2 つとも節点 2 にかけます。中央の斜材に力が生じます。符号はどちらで、それはなぜでしょうか？
- **中央の斜材を取り除く。** トラスは不安定構造になります。EduBeam は原因となるヒンジを丸で囲み、パネルがどのようにせん断変形するかを示します。
- **すべてのヒンジのチェックを外す。** トラスは剛接合のラーメンになります。**M<sub>y</sub> (x)** にチェックを入れると、曲げモーメントは軸力に比べてごく小さいことがわかります。ピン接合という理想化が成り立つのはそのためです。
- **両方の支点をピンにする。** 反力が 1 つ増えて不静定になり、下弦材の力が部材の断面積に依存するようになります。
