<script setup>
import { VPTeamMembers } from 'vitepress/theme'

const members = [
  {
    avatar: 'https://www.github.com/janvorisek.png',
    name: 'Jan Voříšek',
    title: '首席开发者与产品设计师',
    links: [
      { icon: 'github', link: 'https://github.com/janvorisek' },
      { icon: 'twitter', link: 'https://twitter.com/janvorisekdev' },
    ]
  },
  {
    avatar: 'https://www.github.com/bpatzak.png',
    name: 'Bořek Patzák',
    title: '有限元求解器，原版应用作者',
    links: [
      { icon: 'github', link: 'https://github.com/bpatzak' },
    ]
  }
]
</script>

# 简介

<Edubeam /> 是一款免费的、基于浏览器的**平面结构分析**工具，适用于梁、框架和桁架。你画出结构、添加支座和荷载，只要修改任何内容，有限元求解器就会立即重新计算全部结果。没有*求解*按钮，无需安装，也无需注册。

在新标签页中[打开 EduBeam](https://run.edubeam.app/?lang=cn){target="_blank"}，然后跟着[快速入门](/zh/guide/quick-start)一起操作。

![EduBeam 中的三铰刚架：荷载为橙色，支反力为紫色，弯矩为红色，变形图为灰色](/screenshots/zh/hero.webp)

## 第一次访问 {#your-first-visit}

第一次打开应用时，欢迎对话框会询问你希望如何开始，以及要使用哪种单位和坐标轴。两者之后都可以在[设置](/zh/essentials/units-settings)中更改。

![欢迎对话框](/screenshots/zh/welcome.webp){.shot-lg}

- **带我看看**依次介绍菜单、撤销与重做、视图按钮、显示选项、网格与单位，以及底部栏。
- **绘制第一根梁**是一个七步的引导任务。你用鼠标画一根梁，给它加支座、加荷载，并读取结果。角落里的小卡片会提示下一步该做什么。
- **打开示例**会打开现成模型的示例库。

这三项也都在 **☰ 菜单**中，随时可以重新进入。

![绘制第一根梁：操作时引导卡片一直停留在角落](/screenshots/zh/first-beam-task.webp)

## 功能 {#what-it-does}

| 方面 | 功能 |
| --- | --- |
| **结构** | 平面（x–z）梁、连续梁、框架和桁架，由节点和二维 Timoshenko 梁单元组成。端部铰接可把任何杆件变为桁架杆。 |
| **支座** | 固定铰支座、滑动铰支座、固定端、滑动固定端，以及受约束 `Dx`、`Dz`、`Ry` 的其他任意组合，按符号选取。通过节点角度设置旋转支座。支座沉降。 |
| **荷载** | 节点力和力矩、位移约束、均布和梯形线荷载、杆件上的集中力和力矩，以及均匀或梯度温度荷载。 |
| **截面** | 材料库和截面库（欧洲和美国），以及可为任意形状计算 $A$、$I_y$、$I_z$、$I_{yz}$、主轴和回转半径的多边形编辑器。 |
| **结果** | 变形图、轴力 **N**、剪力 **V**、弯矩 **M**、支反力、节点位移、单元端力以及单元刚度矩阵。 |
| **分析** | 单一荷载工况的线性静力分析。对线性模型而言结果是精确的，因此无需加密网格。当结构无法求解时，EduBeam 会说明原因，并以动画显示它可能的运动方式。 |
| **文件** | 以 JSON 保存和打开项目，用链接分享整个模型，把图形导出为 PNG 或 SVG，把结果导出为 CSV。最近被替换的模型会被保留，便于找回。所有数据都留在你的设备上。 |
| **单位** | 一键切换国际单位制或美制单位，也可逐个物理量单独设置。坐标轴可选 x 向右、z 向下，或 x 向右、y 向上。 |

## 暂不支持的功能 {#what-it-does-not-do-yet}

事先了解限制可以节省时间：

- **仅限二维。** 没有平面外行为，没有三维框架。
- **仅限线性静力。** 没有二阶（P–Δ）效应，没有屈曲，没有动力分析，没有塑性。
- **单一荷载工况。** 没有荷载组合或包络。请分别为每个工况建模，并各自保存为文件或分享链接。
- **没有自重。** 如有需要，请以线荷载的形式施加。
- **没有设计验算。** EduBeam 给出内力和位移，规范验算需要你自己完成。

如果某个缺失的功能对你很重要，请[提交 issue](https://github.com/janvorisek/edubeam/issues)。

<ElementariumPromo placement="introduction" />

## 适合哪些人？ {#who-is-it-for}

- 学习结构力学、希望手算结果立即得到反馈的**学生**。请看[手算校核结果](/zh/guide/verification)。
- 在投影仪上用 12 种语言中的任意一种，实时演示支座、铰和荷载如何改变内力的**教师**。请看[用 EduBeam 教学](/zh/guide/teaching)。
- 在打开更重型的桌面软件之前，想快速做一次合理性校核的**工程师**。

## 本指南的结构 {#how-this-guide-is-organised}

1. **入门。** 本页、[10 分钟快速入门](/zh/guide/quick-start)和现成的[示例](/zh/examples/)。
2. **教程。** 从头到尾的完整模型，并经过手算核对：[三铰刚架](/zh/tutorials/three-hinged-frame)和[平面桁架](/zh/tutorials/truss)。
3. **建模。** 每个基本组成部分各一页：[用户界面](/zh/essentials/user-interface)、[节点与支座](/zh/essentials/nodes-supports)、[单元、材料与截面](/zh/essentials/elements)、[荷载](/zh/essentials/loads)，以及[单位与设置](/zh/essentials/units-settings)。
4. **结果。** 如何[阅读内力图和表格](/zh/essentials/results)，以及如何[校核它们](/zh/guide/verification)。
5. **文件与分享。** [项目、分享链接、图像与 CSV 导出](/zh/essentials/import-export)，以及[用 EduBeam 教学](/zh/guide/teaching)。
6. **参考。** [键盘、鼠标与触控](/zh/reference/shortcuts)、[疑难解答](/zh/reference/troubleshooting)和[常见问题](/zh/faq/)。
7. **理论手册。** [符号约定](/zh/elements/conventions)，以及[梁单元](/zh/elements/beam)和[桁架单元](/zh/elements/truss)的单元列式。

应用中的 **?** 图标会以你的语言打开本指南中对应的页面。

## 语言 {#languages}

界面提供 English、Čeština、Deutsch、Español、Français、Polski、Português、Русский、Türkçe、Українська、ไทย 和汉语。EduBeam 会根据浏览器选择语言。可在**设置 → 语言与区域**中更改，或用 `?lang=` 参数打开应用，例如 [run.edubeam.app/?lang=cn](https://run.edubeam.app/?lang=cn){target="_blank"}。

## 作者与致谢 {#authors-credits}

<Edubeam /> 由 [Jan Voříšek](https://github.com/janvorisek) 主导，他是现代网页版的维护者和产品设计师。浏览器版本独立于 CTU 开发。最初的 Windows 和 Linux 桌面版 EduBeam 由 [Bořek Patzák](http://ksm.fsv.cvut.cz/~bp/)、[Jan Stránský](https://mech.fsv.cvut.cz/~stransky/en/) 和 [Vít Šmilauer](https://mech.fsv.cvut.cz/~smilauer/) 在[布拉格捷克理工大学（CTU）土木工程学院](https://www.fsv.cvut.cz/en)力学系开发。求解器是开源的 [ts-fem](https://github.com/janvorisek/ts-fem) 库。

<VPTeamMembers size="small" :members="members" />

## 参与贡献 {#contribute}

- 将令人困惑的行为或 bug 作为 [GitHub issue](https://github.com/janvorisek/edubeam/issues) 提交。
- 编辑 `docs/` 中的文件并提交 pull request，帮助改进本文档或翻译。
- 把 EduBeam 分享给同学和同事。
