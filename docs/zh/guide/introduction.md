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
    title: '有限元求解器、原桌面版作者',
    links: [
      { icon: 'github', link: 'https://github.com/bpatzak' },
    ]
  }
]
</script>

# 简介

<Edubeam /> 是一款免费的、基于浏览器的**平面结构分析**工具，适用于梁、刚架和桁架。你只需画出结构、设置支座与荷载，有限元求解器就会在你每次修改的瞬间重新计算——没有"求解"按钮，无需安装，也不需要账号。

在新标签页中[打开 EduBeam](https://run.edubeam.app/?lang=cn){target="_blank"}，然后跟着[快速入门](/zh/guide/quick-start)一步步操作。

<figure>
  <a href="https://run.edubeam.app/?lang=cn" target="_blank">
    <WelcomeStructure />
  </a>
  <figcaption>一根超静定梁，在浏览器中实时求解</figcaption>
</figure>

## 功能概览

| 方面 | 功能 |
| --- | --- |
| **结构** | 由节点和平面 Timoshenko 梁单元组成的平面（x–z）梁、连续梁、刚架与桁架。设置端部铰接即可把任意杆件变成桁架杆。 |
| **支座** | 在节点上任意组合约束 `Dx`、`Dz`、`Ry` → 固定端、固定铰支座、可动铰支座、定向支座……通过节点坐标系角度可设置斜向支座。 |
| **荷载** | 节点力与力矩、位移约束（支座沉降）、均布与梯形线荷载（整体或局部坐标系）、作用在杆件上任意位置的集中荷载，以及均匀 / 梯度温度荷载。 |
| **结果** | 变形图、轴力 **N**、剪力 **V<sub>z</sub>**、弯矩 **M<sub>y</sub>**、支座反力、节点位移、单元端力以及每个单元的刚度矩阵。 |
| **分析** | 单一荷载工况的线性静力分析。对线性模型而言结果是精确的（无需细分网格）。 |
| **文件** | 以 JSON 保存 / 打开项目，用一个 URL 分享整个模型，嵌入只读查看器。所有数据都留在你的设备上。 |
| **单位** | 长度、面积、截面二次矩、质量、力、弯矩和应力的单位可独立选择（公制与英制）。 |

## 目前尚不支持的功能

事先了解这些限制可以节省时间：

- **仅限平面** —— 没有平面外行为，没有空间刚架。
- **仅限线性静力** —— 没有二阶（P–Δ）效应、屈曲、动力分析或塑性。
- **单一荷载工况** —— 没有荷载组合或包络。请把每种工况分别建模（各自保存为文件或分享链接）。
- **没有自重** —— 需要时请以线荷载的形式施加。
- **没有设计验算** —— EduBeam 给出内力和位移；规范校核由你自己完成。

如果你需要某个缺失的功能，请[提交 issue](https://github.com/janvorisek/edubeam/issues)。

## 适合哪些人？

- 正在学习结构力学、希望即时核对手算结果的**学生**。参见[手算校核](/zh/guide/verification)。
- 在投影仪上用 11 种语言之一实时演示支座、铰和荷载如何改变内力的**教师**。
- 在打开重量级桌面软件之前想快速做一次合理性校核的**工程师**。

## 文档结构

1. **入门** —— 本页、[10 分钟快速入门](/zh/guide/quick-start)以及现成的[示例](/zh/examples/)。
2. **建模** —— 每个基本构件一页：[用户界面](/zh/essentials/user-interface)、[节点与支座](/zh/essentials/nodes-supports)、[单元、材料与截面](/zh/essentials/elements)、[荷载](/zh/essentials/loads)、[单位与设置](/zh/essentials/units-settings)。
3. **结果** —— 如何[读懂内力图和表格](/zh/essentials/results)以及如何[校核结果](/zh/guide/verification)。
4. **文件与分享** —— [JSON 项目、分享链接与可嵌入的查看器](/zh/essentials/import-export)。
5. **参考** —— [键盘与鼠标](/zh/reference/shortcuts)、[故障排除](/zh/reference/troubleshooting)和[常见问题](/zh/faq/)。
6. **理论手册** —— [符号约定](/zh/elements/conventions)以及[梁单元](/zh/elements/beam)和[桁架单元](/zh/elements/truss)的单元列式。

## 语言

界面提供 English、Čeština、Deutsch、Español、Français、Polski、Português、Русский、Українська、ไทย 和汉语。EduBeam 会根据浏览器自动选择语言；可在**设置 → 语言与区域**中更改，或用 `?lang=` 参数打开应用，例如 [run.edubeam.app/?lang=cn](https://run.edubeam.app/?lang=cn){target="_blank"}。

## 作者与致谢

<Edubeam /> 由 [Jan Voříšek](https://github.com/janvorisek) 主导开发，他是现代网页版的维护者和产品设计师。浏览器版本独立于 CTU 开发；最初的 Windows/Linux 桌面版 EduBeam 由 [Bořek Patzák](http://ksm.fsv.cvut.cz/~bp/)、[Jan Stránský](https://mech.fsv.cvut.cz/~stransky/en/) 和 [Vít Šmilauer](https://mech.fsv.cvut.cz/~smilauer/) 在[布拉格捷克理工大学土木工程学院](https://www.fsv.cvut.cz/en)力学系创建。求解器是开源的 [ts-fem](https://github.com/janvorisek/ts-fem) 库。

<VPTeamMembers size="small" :members="members" />

## 参与贡献

- 通过 [GitHub issue](https://github.com/janvorisek/edubeam/issues) 报告令人困惑的行为或错误。
- 编辑 `docs/` 中的文件并提交 pull request，改进本文档或翻译。
- 把 EduBeam 分享给同学和同事。
