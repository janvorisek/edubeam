# 示例

下面的每张卡片都是一个已求解的实时模型。点击即可在 <Edubeam /> 中打开，全部设置已就绪、可直接编辑——然后拖动节点、修改荷载或勾选铰接，观察内力图随之变化。

<br>

<FeatureStructures />

应用中的 **☰ → 示例**里也有这些模型，[run.edubeam.app/?panel=examples](https://run.edubeam.app/?panel=examples&lang=cn){target="_blank"} 会直接打开该示例库。

## 建议练习 {#suggested-exercises}

- **超静定梁**：取消固定端的 `Ry`，使其变为简支梁。跨中弯矩增大了多少？
- **悬臂梁**：将自由端挠度与 $FL^3/3EI$ 比较（见[手算校核结果](/zh/guide/verification)），然后在*截面*标签页中把 $I_y$ 减半。
- **普拉特桁架**：本例中的节点是刚接的。为每根杆件勾选两端的端部铰接，使其成为真正的桁架，然后比较轴力。再删除一根斜杆：桁架还能站得住吗？
- **三跨连续梁**：这根梁只在两端有支座。在内部节点 B 和 C 处勾选 `Dz` 使其成为连续梁，观察支座上方出现的负弯矩。
- **门式刚架**：为横梁勾选两端的端部铰接，模拟铰接的梁柱节点；或者把右侧支座从滑动铰支座改为固定铰支座。
- **温度荷载**：在两个支座处都约束 `Dx`，观察出现的轴力。

## 详解教程 {#worked-tutorials}

- [三铰刚架](/zh/tutorials/three-hinged-frame)：支反力、N、V 和 M 的手算核对。
- [平面桁架](/zh/tutorials/truss)：节点法、截面法和零杆。

## 贡献示例 {#contribute-an-example}

有好的教学模型？请通过 [GitHub Discussions](https://github.com/janvorisek/edubeam/discussions) 或 [Twitter](https://twitter.com/EdubeamApp) 分享链接，我们会把它加入示例库。
