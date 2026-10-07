# 教程：三铰刚架

三铰刚架是静定结构：三个平衡方程加上铰处 $M = 0$ 的条件，即可求出全部四个支座反力。因此它非常适合用来核对 EduBeam 绘出的每一个数值。大约需要 15 分钟。

![完成的刚架：弯矩和支反力](/screenshots/zh/tut-frame-moment.webp)

如果只想自己探索，可以[打开完成的模型](https://run.edubeam.app/?model=eyJuIjpbWyJBIixbMCwwLDBdLFswLDJdLG51bGxdLFsiQiIsWzAsMCwtNF0sW10sbnVsbF0sWyJDIixbNCwwLC00XSxbXSxudWxsXSxbIkQiLFs4LDAsLTRdLFtdLG51bGxdLFsiRSIsWzgsMCwwXSxbMCwyXSxudWxsXV0sImUiOltbIjEiLFsiQSIsIkIiXSwiMSIsIjEiLFtmYWxzZSxmYWxzZV1dLFsiMiIsWyJCIiwiQyJdLCIxIiwiMSIsW2ZhbHNlLHRydWVdXSxbIjMiLFsiQyIsIkQiXSwiMSIsIjEiLFtmYWxzZSxmYWxzZV1dLFsiNCIsWyJEIiwiRSJdLCIxIiwiMSIsW2ZhbHNlLGZhbHNlXV1dLCJtIjpbWyIxIiw3ODUwLDIxMDAwMDAwMDAwMCw4MTAwMDAwMDAwMCwwLjAwMDAxMl1dLCJjcyI6W1siMSIsMC4wMDUzOCwwLjAwMDA4MzU2LDAuMywxXV0sImVsIjpbWyIyIixbMCwxMDAwMF0sZmFsc2VdLFsiMyIsWzAsMTAwMDBdLGZhbHNlXV0sImQiOltdfQ%3D%3D&lang=cn){target="_blank"}。

## 问题描述 {#the-problem}

- 两根 4 m 高的柱，柱脚 A 和 E 为固定铰支座，相距 8 m。
- 顶部为一根水平横梁 B–D，跨中 C 处有一个铰。
- 整根横梁上作用均布荷载 $q = 10$ kN/m。
- 钢材（$E = 210$ GPa，$G = 81$ GPa），IPE 300（$A = 53.8$ cm²，$I_y = 8356$ cm⁴，$h = 300$ mm）。

| 节点 | X [m] | Z [m] | 支座 |
| --- | --- | --- | --- |
| A | 0 | 0 | 固定铰支座 |
| B | 0 | −4 | |
| C | 4 | −4 | （横梁中的铰） |
| D | 8 | −4 | |
| E | 8 | 0 | 固定铰支座 |

记住 **z 轴指向下**，因此柱顶位于 `Z = −4`。

## 1. 材料和截面 {#_1-material-and-section}

1. **清空结构**（勾选*删除材料*和*删除截面*）。
2. *材料* → **材料库** → **Steel (S235)**。
3. *截面* → **添加截面**：`面积 = 0.00538`、`Iy = 8.356e-5`、`高度 = 0.3`、`剪切系数 = 1`。

截面只影响位移。这个刚架是静定的，因此其内力完全不依赖于 $E$、$A$ 或 $I$。

## 2. 绘制刚架 {#_2-draw-the-frame}

最快的方法是用鼠标画一条连续折线：

1. 确认**吸附到网格**已开启（**S** 标记）。
2. *单元*标签页 → 第二个**添加单元**按钮（光标图标）。
3. 依次点击 (0, 0)、(0, −4)、(4, −4)、(8, −4) 和 (8, 0)。借助标尺和十字准线找到这些点。每次点击都会添加一个节点，并把它与上一个节点相连。
4. 按 <kbd>Esc</kbd> 结束，再按 <kbd>F</kbd> 使刚架适配屏幕。

现在你有五个节点和四个单元。本页图中的节点标记为 A–E；如果愿意，可以在*节点*表格中重命名，也可以保留 1–5。在表格中检查坐标，修正没有落在网格上的点。

## 3. 支座和铰 {#_3-supports-and-the-hinge}

1. 点击节点 A，打开**节点支座**，选择**固定铰支座**。对节点 E 做同样操作。
2. 在*单元*表格中找到从 B 到 C 的单元，勾选它的**终点**铰（*端部铰接*中的第二个复选框）。

![单元表格：铰位于单元 2 的终点，即节点 C 处](/screenshots/zh/elements-table.webp)

::: tip 一个铰，而不是两个
在单元 B–C 的终点设铰就够了：此时 C 处的弯矩为零，因为 C–D 无法把弯矩传入一个只有它自己刚性连接的节点。再勾选 C–D 的起点铰，结果也不会改变。但如果在 B 处也勾选一个铰，刚架就会变成机构。试试看：EduBeam 会显示它如何运动。
:::

## 4. 荷载 {#_4-load}

*荷载* → **添加单元荷载** → *均布荷载*，单元 B–C，`fz = 10` kN/m。对单元 C–D 重复同样操作。横梁是水平的，因此局部坐标系复选框在这里没有影响。

## 5. 结果 {#_5-results}

显示选项一开始就开启了变形图、弯矩和支反力。勾选 **N (x)** 和 **V<sub>z</sub> (x)** 可以看到其余结果。

<div class="shots">

![弯矩和支反力](/screenshots/zh/tut-frame-moment.webp)

![轴力](/screenshots/zh/tut-frame-normal.webp)

![剪力](/screenshots/zh/results-shear.webp)

![变形图](/screenshots/zh/results-deformed.webp)

</div>

## 6. 手算核对 {#_6-check-by-hand}

**竖向支反力。** 由对称性，每个柱脚承担一半荷载：

$$V_A = V_E = \frac{q \cdot 8}{2} = 40\ \text{kN}$$

**水平支反力。** 对刚架左半部分绕铰 C 取矩。该处弯矩必须为零：

$$V_A \cdot 4 - H_A \cdot 4 - q \cdot 4 \cdot 2 = 0 \quad\Rightarrow\quad H_A = \frac{160 - 80}{4} = 20\ \text{kN}$$

两个柱脚都向内推 20 kN；正是这个水平推力使三铰刚架受力高效。

**内力。**

| 物理量 | 公式 | 手算值 | EduBeam |
| --- | --- | --- | --- |
| 竖向支反力 | $qL/2$ | 40 kN | 40 kN |
| 水平支反力 | 由 $M_C = 0$ | 20 kN | 20 kN |
| 角点 B 和 D 处的弯矩 | $H \cdot h$ | 80 kNm，外侧受拉 | −80 kNm |
| 铰 C 处的弯矩 | | 0 | 0 |
| 柱中轴力 | $-V_A$ | −40 kN | −40 kN |
| 横梁中轴力 | $-H_A$ | −20 kN | −20 kN |
| 柱中剪力 | $H_A$ | 20 kN | −20 kN (A–B)，+20 kN (D–E) |
| 横梁 B 处剪力 | $V_A$ | 40 kN | 40 kN |
| 横梁 C 处剪力 | $V_A - 4q$ | 0 | 0 |
| 横梁 D 处剪力 | $V_A - 8q$ | −40 kN | −40 kN |

两根柱承受的力相同，剪力符号却相反，这是因为每个单元的局部坐标轴跟随其方向：A–B 是向上画的，D–E 是向下画的。交换其中一根柱的节点顺序，它的符号就会翻转。

横梁中 $M(x) = -80 + 40x - 5x^2$ kNm（x 从 B 起算），它在铰处为零且从不为正：整根横梁都受负弯矩。剪力 $V(x) = 40 - 10x$ 恰好在 C 处降为零，因此弯矩的极值也在铰处。

**位移。** 铰 C 下沉 43.1 mm（*结果 → 节点结果*，C 的 `Dz`）。它来自全部四根杆件的弯曲，是练习虚功原理的好题目。

## 7. 动手试试 {#_7-experiment}

- **取消 C 处的铰**。刚架变为一次超静定；角点弯矩减小，跨中出现正弯矩。此时截面就有影响了：试试刚度更大的横梁。
- **固定柱脚**（选择**固定端**支座）。A 和 E 处出现弯矩。
- **添加水平荷载**：在 B 处施加节点荷载 `Fx = 10` kN。刚架发生侧移，支反力不再对称。用同样的三个方程和 $M_C = 0$ 核对它们。
- 再**在 B 处勾选一个铰**。刚架此时成为机构，EduBeam 会以动画显示它如何运动。
