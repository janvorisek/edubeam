# 教程：平面桁架

本教程建立一个小型静定桁架，用节点法和截面法核对杆件内力，并找出一根零杆。大约需要 15 分钟。

![完成的桁架：轴力和支反力](/screenshots/zh/tut-truss.webp)

如果只想自己探索，可以[打开完成的模型](https://run.edubeam.app/?model=eyJuIjpbWyIxIixbMCwwLDBdLFswLDJdLG51bGxdLFsiMiIsWzQsMCwwXSxbXSxudWxsXSxbIjMiLFs4LDAsMF0sW10sbnVsbF0sWyI0IixbMTIsMCwwXSxbMl0sbnVsbF0sWyI1IixbNCwwLC0zXSxbXSxudWxsXSxbIjYiLFs4LDAsLTNdLFtdLG51bGxdXSwiZSI6W1siMSIsWyIxIiwiMiJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiMiIsWyIyIiwiMyJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiMyIsWyIzIiwiNCJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiNCIsWyI1IiwiNiJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiNSIsWyIxIiwiNSJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiNiIsWyIyIiwiNSJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiNyIsWyI1IiwiMyJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiOCIsWyIzIiwiNiJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiOSIsWyI2IiwiNCJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dXSwibSI6W1siMSIsNzg1MCwyMTAwMDAwMDAwMDAsODEwMDAwMDAwMDAsMC4wMDAwMTJdXSwiY3MiOltbIjEiLDAuMDAyLDAuMDAwMDAxLDAuMSwxXV0sIm5sIjpbWyIyIix7IjAiOjAsIjIiOjMwMDAwLCI0IjowfV0sWyIzIix7IjAiOjAsIjIiOjMwMDAwLCI0IjowfV1dLCJkIjpbXX0%3D&lang=cn){target="_blank"}。

## 问题描述 {#the-problem}

![几何、支座和荷载](/screenshots/zh/tut-truss-model.webp)

- 跨度 12 m，分为三个 4 m 的节间，高 3 m。
- 下弦节点 1–4，上弦节点 5 和 6。
- 节点 1 为固定铰支座，节点 4 为滑动铰支座。
- 下弦节点 2 和 3 处各作用一个 30 kN 的荷载。
- 钢杆件，$A = 20$ cm²。

| 节点 | X [m] | Z [m] | 支座 | 荷载 |
| --- | --- | --- | --- | --- |
| 1 | 0 | 0 | 固定铰支座 | |
| 2 | 4 | 0 | | `Fz = 30` kN |
| 3 | 8 | 0 | | `Fz = 30` kN |
| 4 | 12 | 0 | 滑动铰支座 | |
| 5 | 4 | −3 | | |
| 6 | 8 | −3 | | |

杆件：下弦 1–2、2–3、3–4；上弦 5–6；端斜杆 1–5 和 6–4；竖杆 2–5 和 3–6；以及中间斜杆 5–3。

**是否静定？** $m + r = 9 + 3 = 12 = 2j$，其中节点数 $j = 6$，所以是静定的：杆件内力仅由平衡条件即可求得。

## 1. 材料和截面 {#_1-material-and-section}

1. **清空结构**（勾选*删除材料*和*删除截面*）。
2. *材料* → **材料库** → **Steel (S235)**。
3. *截面* → **添加截面**：`面积 = 0.002`、`Iy = 1e-6`、`高度 = 0.1`、`剪切系数 = 1`。对于铰接杆件，只有面积起作用。

## 2. 绘制带铰的杆件 {#_2-draw-the-bars-with-hinges}

在 EduBeam 中，桁架杆就是勾选了**两端端部铰接**的梁单元。鼠标工具可以帮你自动设置：

1. *单元*标签页 → 第二个**添加单元**按钮（光标图标）。
2. 在视图顶部的横幅中勾选**起点铰接**和**终点铰接**。此后画出的每根杆件两端都会带铰。
3. 用一条连续折线画出外轮廓：依次点击 (0, 0)、(4, −3)、(8, −3)、(12, 0)，然后沿下弦返回：(8, 0)、(4, 0)、(0, 0)。按 <kbd>Esc</kbd>。
4. 逐根绘制内部杆件，每画完一根按一次 <kbd>Esc</kbd>：(4, 0) → (4, −3)、(4, −3) → (8, 0)、(8, 0) → (8, −3)。
5. 按 <kbd>F</kbd> 适配屏幕。

检查*单元*表格：九个单元，每个都勾选了两个*端部铰接*。你的节点和单元编号可能与图中不同，这没有关系。

## 3. 支座和荷载 {#_3-supports-and-loads}

1. 点击 (0, 0) 处的节点 → **节点支座** → **固定铰支座**。点击 (12, 0) 处的节点 → **滑动铰支座**。
2. 点击 (4, 0) 处的节点 → **添加荷载** → `Fz = 30` kN。在 (8, 0) 处做同样操作。

正的 `Fz` 指向下。桁架的节点可以自由转动；EduBeam 允许所有杆件都铰接于其上的节点，并将其转角报告为 0。

## 4. 结果 {#_4-results}

在显示选项中取消勾选**变形图**和 **M<sub>y</sub> (x)**（桁架中没有弯曲），并勾选 **N (x)**。

![轴力：受拉为正](/screenshots/zh/tut-truss.webp)

## 5. 手算核对 {#_5-check-by-hand}

**支反力。** 荷载对称，因此 $R_1 = R_4 = 30$ kN（向上），固定铰支座处的水平支反力为零。

**节点 1**（节点法）。端斜杆 1–5 长 5 m（$\sin\alpha = 3/5$，$\cos\alpha = 4/5$）：

$$\sum F_z:\ N_{15} \cdot \tfrac{3}{5} = -30 \Rightarrow N_{15} = -50\ \text{kN} \qquad \sum F_x:\ N_{12} = -N_{15} \cdot \tfrac{4}{5} = 40\ \text{kN}$$

**节点 2。** 竖杆 2–5 是唯一能把 30 kN 荷载向上传递的杆件：$N_{25} = +30$ kN，且 $N_{23} = N_{12} = 40$ kN。

**截取中间节间。** 截断杆件 5–6、5–3 和 2–3，保留左侧部分：

- 对节点 3 取矩：$R_1 \cdot 8 - 30 \cdot 4 + N_{56} \cdot 3 = 0 \Rightarrow N_{56} = -40$ kN。
- 竖向力：该节间的剪力为 $R_1 - 30 = 0$，因此斜杆 **5–3 不受力**：$N_{53} = 0$。

| 杆件 | 手算值 | EduBeam |
| --- | --- | --- |
| 下弦 1–2、2–3、3–4 | +40 kN（受拉） | 40 |
| 上弦 5–6 | −40 kN（受压） | −40 |
| 端斜杆 1–5、6–4 | −50 kN | −50 |
| 竖杆 2–5、3–6 | +30 kN | 30 |
| 中间斜杆 5–3 | 0 | 0 |

节点 2 的挠度为 2.29 mm（*结果 → 节点结果*）。作为练习，用虚功原理 $\delta = \sum N n L / (EA)$ 计算它。

## 6. 动手试试 {#_6-experiment}

- **移动一个荷载。** 把两个 30 kN 荷载都放在节点 2。中间斜杆现在受力了：是什么符号，为什么？
- **删除中间斜杆。** 桁架变为机构；EduBeam 会圈出出问题的铰，并显示该节间如何发生剪切错动。
- **取消所有铰。** 桁架变为刚接节点的框架。勾选 **M<sub>y</sub> (x)**：与轴力相比，弯矩非常小，这就是铰接理想化之所以成立的原因。
- **把两个支座都设为固定铰支座。** 多一个支反力使结构变为超静定，下弦内力此时取决于杆件面积。
