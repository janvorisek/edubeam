# 结果与内力图

<Edubeam /> 在每次更改后自动求解模型（限制为每秒几次），因此结果始终是最新的。没有*求解*按钮。如果什么都没有绘制出来，说明模型还无法求解——参见[故障排除](/zh/reference/troubleshooting)。

## 视图中的图层

在**显示设置面板**（视图右上角的 ⚙ 按钮）中开关它们。

| 图层 | 颜色（默认） | 说明 |
| --- | --- | --- |
| **变形图** | 灰色 | 放大显示；按最大位移等于*结果缩放*像素数进行缩放。 |
| **N (x)** – 轴力 | 蓝色 | 拉力为正。除非有轴向线荷载作用，否则在单元内为常量。 |
| **V<sub>z</sub> (x)** – 剪力 | 绿色 | 均布荷载下线性，梯形荷载下二次，集中荷载处突变。 |
| **M<sub>y</sub> (x)** – 弯矩 | 红色 | 下侧受拉为正（下缘纤维受拉）。在两端、集中荷载处以及每个局部极值处（V = 0 处）标注数值。 |
| **支反力** | 紫色 | 每个被约束的自由度都有一个箭头和数值。 |

内力图沿单元绘制，数值写在特征点处。标签方向和所有图形的比例可以在[设置](/zh/essentials/units-settings#视图设置)中更改。

### 轴力

<Figure>
    <Structure :show-loads="true" show-normal-force :nodes="[{label: 'a', coords: [0,0,0], dofs: [0,2, 4]}, {label: 'b', coords: [10,0,0], dofs: []}]" :elements="[{label: '1', nodes: ['a', 'b']}]" :nodal-loads="[{target: 'b', values: { 0: -100, 2: 0, 4: 0 }}]" />
    <figcaption>自由端受水平力压缩的悬臂梁：N 为常值且为负</figcaption>
</Figure>

### 剪力

<Figure>
  <Structure :show-loads="true" show-shear-force :nodes="[{label: 'a', coords: [0,0,0], dofs: [0,2, 4]}, {label: 'b', coords: [10,0,0], dofs: []}]" :elements="[{label: '1', nodes: ['a', 'b']}]" :nodal-loads="[{target: 'b', values: { 0: 0, 2: 10, 4: 0 }}]" />
 <figcaption>端部作用竖向集中荷载的悬臂梁：V 为常值</figcaption>
</Figure>

### 弯矩

<Figure>
  <Structure :show-loads="true" show-moment :nodes="[{label: 'a', coords: [0,0,0], dofs: [0,2, 4]}, {label: 'b', coords: [10,0,0], dofs: []}]" :elements="[{label: '1', nodes: ['a', 'b']}]" :nodal-loads="[{target: 'b', values: { 0: 0, 2: 10, 4: 0 }}]" />
 <figcaption>同一悬臂梁：M 线性增长，在固定端达到 F·L</figcaption>
</Figure>

### 变形图

<Figure>
  <Structure :show-loads="true" show-deformed-shape :nodes="[{label: 'a', coords: [0,0,0], dofs: [0,2, 4]}, {label: 'b', coords: [10,0,0], dofs: []}]" :elements="[{label: '1', nodes: ['a', 'b']}]" :nodal-loads="[{target: 'b', values: { 0: 0, 2: 10, 4: 0 }}]" />
  <figcaption>悬臂梁的变形图（放大显示）</figcaption>
</Figure>

### 支反力

<Structure :show-loads="true" show-reactions :nodes="[{label: 'a', coords: [0,0,0], dofs: [0,2, 4]}, {label: 'b', coords: [10,0,0], dofs: []}]" :elements="[{label: '1', nodes: ['a', 'b']}]" :nodal-loads="[{target: 'b', values: { 0: 0, 2: 10, 4: 0 }}]" />

## 悬停提示

在视图中悬停是读取数值最快的方式：

- **节点** → `ux`、`uz`、`φy`（位移以长度单位、转角以弧度表示）。
- **单元** → 它的标签、截面和材料。
- **荷载** → 它的分量。

## 结果标签页

底部栏的**结果**标签页有两种视图：

### 节点结果

每个节点一行，包含 **Dx**、**Dz**（长度单位）和 **Ry**（rad）。符号遵循整体坐标轴：正的 `Dz` 向下，正的 `Ry` 在屏幕上为逆时针。

<figure>

![节点结果](/results_nodes.png)

</figure>

### 单元结果

每个单元一行，给出**单元局部坐标系中的端力**：

| 列 | 含义 |
| --- | --- |
| `X12`、`Z12`、`M12` | 在**起始**节点处作用于单元的轴力、剪力和弯矩 |
| `X21`、`Z21`、`M21` | 在**终止**节点处的对应量 |

这些是节点作用在单元上的力（单元刚度矩阵乘以端部位移，再减去等效节点荷载）。对于承受 12 kN/m 的 6 m 简支梁，你会得到 `Z12 = Z21 = −36 kN`：两个支座都向上（负 z 方向）推梁。对于起始节点固定、端部作用 18 kN 向下荷载的悬臂梁：`Z12 = −18`，`M12 = +72 kNm`，`Z21 = +18`，`M21 = 0`。

<figure>

![单元结果](/results_elements.png)

</figure>

### 刚度矩阵

从单元的弹出菜单或表格行中选择**刚度矩阵**，会打开一个浮动窗口，显示该单元在局部和整体坐标系下的 6 × 6 刚度矩阵——在矩阵位移法课程中检查手工组装时很有用。公式见[理论手册](/zh/elements/beam)。

## 精度与准确性

- 对线性 Timoshenko 模型，梁单元在节点荷载、均布、梯形、集中和温度荷载下都是精确的，因此结果**不**依赖于单元数量。
- 表格显示四位有效数字；内部计算为双精度。
- 挠度包含**剪切变形**（Timoshenko）。对细长杆件，与 Euler–Bernoulli 公式相比这只增加百分之零点几；对深梁或短杆件可能达到百分之几。如果想抑制它，请把截面的剪切系数设置为一个很大的值。

## 把结果写入报告

没有表格导出功能；请选中表格文字并复制，或对视图截图。要把模型交给他人，请使用[分享模型](/zh/essentials/import-export)。
