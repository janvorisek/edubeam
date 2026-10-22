---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "EduBeam"
  text: "免费的在线结构分析"
  tagline: 画一根梁、一榀框架或一个桁架，加上荷载，编辑的同时内力图随之更新。完整的有限元结果直接在浏览器中呈现，无需安装、无需注册、无需付费。
  image:
    src: /screenshots/zh/hero.webp
    alt: 已求解框架的 EduBeam 应用界面
  actions:
    - theme: brand
      text: 打开应用
      link: https://run.edubeam.app/?lang=cn
    - theme: alt
      text: 阅读指南
      link: /zh/guide/introduction
    - theme: alt
      text: 查看示例
      link: /zh/examples/

features:
  - icon: ⚡
    title: 边画边出结果
    details: 没有“求解”按钮。拖动节点、勾选铰接或修改荷载，N、V、M、支反力和变形图立刻随之变化。
    link: /zh/essentials/results
    linkText: 查看结果
  - icon: 🧑‍🏫
    title: 为教学而生
    details: 有引导的入门步骤、悬停即显示数值、能解释结构为何是机构的求解器，以及可以写进课件的分享链接。
    link: /zh/guide/teaching
    linkText: 用 EduBeam 教学
  - icon: 🌍
    title: 你的语言，你的单位
    details: 12 种界面语言，国际单位制或美制单位，坐标轴可选 z 向下或教科书常用的 y 向上。
    link: /zh/essentials/units-settings
    linkText: 单位与设置
  - icon: 🔗
    title: 分享、导出、嵌入
    details: 用一个链接发送整个模型，保存为文件，把图形导出为 PNG 或 SVG，把结果表格导出为 CSV。
    link: /zh/essentials/import-export
    linkText: 文件与分享
---

## 从这里开始 {#start-here}

<div class="start-grid">

**第一次使用 EduBeam？** 跟着[10 分钟快速入门](/zh/guide/quick-start)操作。你将一步步建立一根简支梁模型，并手算核对每一个结果。

**已经知道要建什么？** 直接进入[教程](/zh/tutorials/three-hinged-frame)，或打开一个现成的[示例](/zh/examples/)并加以修改。

**正在讲授课程？** 请看[用 EduBeam 教学](/zh/guide/teaching)：用于作业的分享链接、可嵌入幻灯片的查看器，以及练习题。

</div>

<div class="shots">

![桁架：轴力，受拉为正](/screenshots/zh/tut-truss.webp)

![把机构可视化：EduBeam 显示结构为何无法求解](/screenshots/zh/ui-mechanism.webp)

</div>

## 可以建模什么 {#what-you-can-model}

- 平面内的**梁、框架和桁架**：连续梁、门式刚架、三铰拱、铰接桁架。
- **任意支座**：固定铰支座、滑动铰支座、固定端、滑动固定端、旋转支座，以及支座沉降。
- **荷载**：集中力和力矩、均布和梯形线荷载、杆件上任意位置的集中荷载，以及温度荷载。
- **任意截面**：从截面库中选取（IPE、HEA、AISC W、HSS、矩形、管材），或绘制为多边形，截面特性自动计算。

更多内容请看[简介](/zh/guide/introduction)。

<ElementariumPromo />
