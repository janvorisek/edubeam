# 常见问题

## 一般问题 {#general}

### EduBeam 是什么？ {#what-is-edubeam}

一款免费、开源、基于浏览器的平面梁、框架和桁架求解器，面向希望获得即时反馈的学生、教师和工程师。见[简介](/zh/guide/introduction)。

### 真的免费吗？需要注册账号吗？ {#is-it-really-free-do-i-need-an-account}

是的，免费；不需要账号。打开 [run.edubeam.app](https://run.edubeam.app/?lang=cn) 即可开始建模。没有账号，没有安装程序，也没有使用限制。源代码在 [GitHub](https://github.com/janvorisek/edubeam) 上。

### 支持哪些浏览器和设备？ {#which-browsers-and-devices-work}

任何较新版本的 Chrome、Edge、Firefox 或 Safari。平板电脑和手机也可以使用：轻点即可选中或放置，拖动节点可移动它，在其他位置拖动可平移，双指捏合可缩放，长按可打开画布菜单。不过使用鼠标和键盘建模仍然更快。见[键盘、鼠标与触控](/zh/reference/shortcuts#touch)。

### 我的模型丢了，还能找回来吗？ {#i-lost-my-model-can-i-get-it-back}

多半可以。清空模型，或在其上打开链接、文件或示例时，旧模型会保留在 **☰ → 最近的结构**中（最近 10 个），<kbd>Ctrl</kbd>+<kbd>Z</kbd> 也可以撤销这次替换。两者都只保存在你的浏览器中。

### 可以离线使用吗？ {#can-i-use-it-offline}

EduBeam 是一个渐进式网页应用（PWA）：加载过一次之后，断网也能继续使用，浏览器还可能提示安装它。有新版本可用时，会弹出对话框询问是否更新。

### 我的数据存储在哪里？ {#where-is-my-data-stored}

只存储在你的浏览器中。模型从不发送到服务器；分享链接*就是*模型本身。见[导入、导出与分享](/zh/essentials/import-export)。

## 建模 {#modelling}

### 如何设置固定端 / 固定铰支座 / 滑动铰支座？ {#how-do-i-make-a-fixed-pinned-roller-support}

点击节点，打开**节点支座**并选择符号：固定铰支座、滑动铰支座、固定端、滑动固定端等。或者勾选自由度：**Dx + Dz + Ry** = 固定端，**Dx + Dz** = 固定铰支座，**Dz** = 滑动铰支座。所有组合都列在[节点与支座](/zh/essentials/nodes-supports#supports)中。

### 如何建立桁架？ {#how-do-i-make-a-truss}

使用梁单元，并在*单元*标签页中为每根杆件勾选**两个端部铰接**；或者在用鼠标绘制杆件之前，在横幅中勾选*起点铰接*和*终点铰接*。荷载施加在节点上。[桁架教程](/zh/tutorials/truss)完整演示了一个例子。

### 如何在框架中设置铰？ {#how-do-i-put-a-hinge-in-a-frame}

在节点的一侧，为需要释放弯矩的那个单元勾选**终点铰接**。在一个节点处只对*一个*单元设铰，只会释放该单元。

### 如何在梁的中间添加支座或集中荷载？ {#how-do-i-add-a-support-or-a-point-load-in-the-middle-of-a-beam}

用*通过鼠标添加*在梁上添加一个节点，并选择**连接到结构**——梁会被拆分为两段。如果只是施加集中荷载，甚至不需要节点：使用带位置参数的**集中荷载**单元荷载即可。

### 可以施加自重吗？ {#can-i-apply-self-weight}

不能自动施加。请将其作为均布荷载 $f_z = \rho g A$ 输入。

### 可以建立斜支座吗？ {#can-i-model-inclined-supports}

可以——在节点上设置**节点局部坐标系角度**；其自由度随后将在旋转后的坐标系中解释。

### 有荷载工况或荷载组合吗？ {#are-there-load-cases-or-combinations}

没有，只有一个荷载工况。请分别为每个工况建模，并各自保存或分享。

### 为什么我的荷载指向上方？ {#why-do-my-loads-point-up}

因为整体 z 轴指向**下**：正的 `Fz` 向下。见[符号约定](/zh/elements/conventions)。如果你更喜欢竖轴向上，可以在*设置 → 语言与区域 → 坐标系*中切换到 y 向上的坐标轴。

## 结果 {#results}

### 为什么没有“求解”按钮？ {#why-is-there-no-solve-button}

每次修改后模型都会自动求解。如果没有显示结果，说明模型暂时还无法求解——[疑难解答](/zh/reference/troubleshooting)列出了需要检查的内容。

### 为什么我的挠度与公式略有差异？ {#why-does-my-deflection-differ-slightly-from-the-formula}

EduBeam 使用 Timoshenko 梁，因此挠度包含剪切变形。对于细长杆件，差异远小于 1 %。详细说明和算例对比见[手算校核结果](/zh/guide/verification)。

### 结果有多精确？需要更多单元吗？ {#how-accurate-are-the-results-do-i-need-more-elements}

对于线性静力分析，梁单元在所支持的荷载类型下是精确的，因此每根杆件用一个单元就够了。只有在需要设置支座、铰、变截面，或需要一个节点来施加荷载时，才需要额外的节点。

### 支反力列在哪里？ {#where-are-the-reactions-listed}

在视图中以带数值的箭头显示（显示选项中的**支反力**，默认开启）。它们也包含在**结果 → 导出 CSV** 导出的文件以及**复制**的内容中。节点位移和单元端力在**结果**标签页中。

## 文件与分享 {#files-sharing}

### 如何分享模型？ {#how-do-i-share-a-model}

**分享模型** → **复制**。链接包含整个模型。接收者会得到一份属于自己的可编辑副本；不支持实时协作。另见[用 EduBeam 教学](/zh/guide/teaching)。

### 可以把模型嵌入我的网站或幻灯片吗？ {#can-i-embed-a-model-on-my-website-or-in-slides}

可以：在分享链接后加上 `&viewer=1`，再把它放进 `<iframe>`。见[嵌入查看器](/zh/essentials/import-export#embed-a-read-only-viewer)。

### 可以导出图像或表格吗？ {#can-i-export-images-or-tables}

可以。**☰ → 导出图像**（<kbd>Ctrl</kbd>+<kbd>P</kbd>）按你选择的尺寸或比例，将图形保存为 PNG 或 SVG。**结果 → 导出 CSV** 保存两个结果表格，**复制**则把它们放到剪贴板上，供电子表格使用。见[导入、导出与分享](/zh/essentials/import-export#export-an-image)。

### 可以用程序生成模型吗？ {#can-i-generate-models-programmatically}

可以。项目文件是采用国际单位制的纯 JSON——见[格式说明](/zh/essentials/import-export#project-file-format)——可以用*打开项目*或拖放的方式打开。

## 支持 {#support}

### 如何报告 bug 或提出功能请求？ {#how-do-i-report-a-bug-or-request-a-feature}

在 [GitHub](https://github.com/janvorisek/edubeam/issues) 上提交 issue，并附上能够复现问题的分享链接或项目文件。私人支持：[support@edubeam.app](mailto:support@edubeam.app)。
