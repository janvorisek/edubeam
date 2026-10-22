# 导入、导出与分享

<Edubeam /> 中的一切都在你的浏览器中进行。没有任何内容会上传到服务器：分享链接本身就包含了模型。

## 保存项目 {#save-a-project}

**☰ → 保存项目**或 <kbd>Ctrl</kbd>+<kbd>S</kbd> 会下载 `project.json`。其中包含节点、单元、材料、截面（含多边形形状）、荷载、尺寸标注，以及写入该文件的应用版本。文件可以随意重命名。

## 打开项目 {#open-a-project}

- **☰ → 打开项目**或 <kbd>Ctrl</kbd>+<kbd>O</kbd>，然后选择一个 `.json` 文件，或者
- **把文件拖到应用窗口的任意位置**。

打开项目会替换当前模型，包括材料和截面。原来的模型不会丢失：<kbd>Ctrl</kbd>+<kbd>Z</kbd> 可以恢复它，它也会保留在[最近的结构](#recent-structures)中。如果文件不是 EduBeam 项目，应用会拒绝打开并显示消息，你的模型保持不变。

EduBeam 所有早期版本的项目文件都可以在当前版本中打开。

## 分享链接 {#share-a-link}

**分享模型**（在应用栏或 ☰ 菜单中）会打开*通过 URL 分享模型*对话框：

![分享对话框](/screenshots/zh/share.webp){.shot-lg}

- **复制**将链接复制到剪贴板。在输入框内点击也有同样的效果。
- **打开链接**在新标签页中打开它，便于你检查接收者将看到的内容。
- **通过系统分享对话框**把链接交给设备的系统分享面板（需浏览器支持）。

链接的形式为 `https://run.edubeam.app/?model=…`，其中编码了整个模型。打开链接的人会得到一份属于自己的副本用于编辑；编辑**不会**同步回来，因此模型修改后请发送新的链接。非常大的模型会生成非常长的链接；对于这类模型，请改为分享 JSON 文件。

当有人打开链接时，他们自己原来的模型会进入“最近的结构”，并有消息告诉他们在哪里可以找到它。

旧版本生成的链接依然有效：去年讲义中的链接今天打开的仍是同一个模型。

## 导出图像 {#export-an-image}

**☰ → 导出图像**或 <kbd>Ctrl</kbd>+<kbd>P</kbd> 会打开图像导出。

![导出图像：选择图层、取景范围和尺寸，然后下载或复制](/screenshots/zh/export-image.webp)

- **图层**：顶部的标记用于选择要绘制的内容，与视图中的设置相互独立：变形图、N、V、M、支反力、支座、荷载、节点标签和单元标签。
- **取景**：选择宽高比（16:9、4:3、3:2、1:1）、**全部适配**，或用**窗口…** 在图形上拖出一个矩形。也可以拖动预览的边缘。
- **尺寸**：以像素表示的宽度和高度，或者 1 : 50 这样的**比例**，用于在纸上按比例出图。**内力图高度**设置图中结果内力图的大小。**透明背景**会去掉白色背景。
- **下载 PNG**、**下载 SVG** 或**复制到剪贴板**。

SVG 在任何尺寸下都保持清晰，并可用于 Word、Inkscape 以及 Overleaf 上的 LaTeX，因此是报告和论文的最佳选择。

## 导出结果 {#export-the-results}

**结果 → 导出 CSV** 会下载包括支反力在内的两个结果表格，**复制**则把它们放到剪贴板上，供电子表格使用。见[导出 CSV 与复制](/zh/essentials/results#export-csv-and-copy)。

## 最近的结构 {#recent-structures}

**☰ → 最近的结构**保留最近 10 个被清空，或被链接、文件、示例或“第一根梁”任务替换的模型。每一项都显示缩略图、被替换的原因及其规模。**恢复**可以找回其中一个；此时你当前的模型会相应地进入该列表，<kbd>Ctrl</kbd>+<kbd>Z</kbd> 可以撤销这次恢复。

![最近的结构](/screenshots/zh/recent.webp){.shot-lg}

该列表只保存在当前浏览器中。

## 示例 {#examples}

**☰ → 示例**会打开现成教学模型的示例库。打开其中一个会替换你的模型，<kbd>Ctrl</kbd>+<kbd>Z</kbd> 可以找回你的模型。本指南的[示例](/zh/examples/)页面也有这些模型，并附有练习。

![示例库](/screenshots/zh/examples.webp){.shot-lg}

## 嵌入查看器 {#embed-a-read-only-viewer}

在分享链接后加上 `&viewer=1`，即可在**查看器模式**下打开模型。应用栏、底部栏、标签页、撤销和重做、网格标记以及坐标轴指示器都会被隐藏，只保留画布、适配和居中按钮以及显示选项。把该 URL 放入 `<iframe>`，即可在讲义或网页中嵌入一个可缩放的实时模型：

```html
<iframe src="https://run.edubeam.app/?viewer=1&model=…" width="100%" height="400"></iframe>
```

![查看器模式下的三铰刚架](/screenshots/zh/viewer-mode.webp){.shot-lg}

查看器模式用于查看，但并未锁定：访问者仍然可以拖动节点和切换内力图。和普通链接一样，打开查看器链接也会替换访问者在该浏览器中自己的模型（原模型进入“最近的结构”）。

## URL 参数 {#url-parameters}

| 参数 | 作用 |
| --- | --- |
| `model=<data>` | 加载编码的模型并使其适配屏幕。 |
| `viewer=1` | 查看器模式（见上文）。 |
| `lang=<code>` | 切换界面语言：`en`、`cs`、`de`、`fr`、`es`、`pt`、`pl`、`cn`、`th`、`uk`、`ru`、`tr`。 |
| `panel=examples` | 直接打开示例库。 |

EduBeam 读取这些参数后，会把它们从地址栏中移除。

## 自动保存 {#automatic-persistence}

当前模型和你的设置会在每次修改后保存到浏览器的本地存储中，并在你回来时恢复，即使关闭了浏览器也是如此。这只是为了方便，而不是备份：它属于某一台设备上的某一个浏览器配置文件，清除网站数据就会将其删除。请把重要的工作保存为项目文件。

## 项目文件格式 {#project-file-format}

`project.json` 是可读的纯 JSON：

```json
{
  "edubeam": true,
  "version": "1.3.1",
  "domain": {
    "materials": [{ "label": "1", "e": 210000000000, "g": 81000000000, "alpha": 0.000012, "d": 7850 }],
    "crossSections": [{ "label": "1", "a": 0.00285, "iy": 1.943e-5, "h": 0.2, "k": 1 }],
    "nodes": [
      { "label": "1", "coords": [0, 0, 0], "bcs": [0, 2] },
      { "label": "2", "coords": [6, 0, 0], "bcs": [2] }
    ],
    "elements": [{ "label": "1", "nodes": ["1", "2"], "mat": "1", "cs": "1", "hinges": [false, false] }],
    "loadCases": [
      {
        "label": "1",
        "nodalLoads": [],
        "elementLoads": [{ "type": "udl", "target": "1", "lcs": false, "values": [0, 12000] }],
        "prescribedBC": []
      }
    ]
  },
  "dimensions": []
}
```

这是快速入门中的梁。无论显示单位是什么，所有数值都采用**国际单位制**（m、N、Pa、rad）。坐标为 `[x, y, z]`，其中 y 始终为 0。边界条件和荷载分量使用自由度编号 `0 = Dx`、`2 = Dz`、`4 = Ry`。

| 单元荷载 `type` | 数值 |
| --- | --- |
| `udl` | `values: [fx, fz]`，单位 N/m |
| `trapezoidal` | `startValues: [f1x, f1z]`、`endValues: [f2x, f2z]`，单位 N/m，局部坐标轴 |
| `concentrated` | `values: [Fx, Fz, My, a]`，单位为 N、N·m 以及距起始节点的 m |
| `temperature` | `values: [ΔTc, ΔTb, ΔTt]`，单位 K；梯度为 ΔTb − ΔTt |

节点荷载为 `{ "target": "2", "values": { "0": Fx, "2": Fz, "4": My } }`，位移约束为 `{ "target": "2", "prescribedValues": { "0": Dx, "2": Dz, "4": Ry } }`；三个分量都要给出。应用写入的文件还带有 `date`、`commit`、节点的 `lcs` 以及多边形的 `shape`。

由于格式简单，你可以用脚本或电子表格生成模型，然后用**打开项目**打开它们。
