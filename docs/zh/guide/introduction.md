<script setup>
import { VPTeamMembers } from 'vitepress/theme'

const members = [
  {
    avatar: 'https://www.github.com/janvorisek.png',
    name: 'Jan Voříšek',
    title: 'Maintainer, UI/UX',
    links: [
      { icon: 'github', link: 'https://github.com/janvorisek' },
      { icon: 'twitter', link: 'https://twitter.com/janvorisekdev' },
    ]
  },
  {
   avatar: 'https://www.github.com/bpatzak.png',
    name: 'Bořek Patzák',
    title: 'Original author',
    links: [
      { icon: 'github', link: 'https://github.com/bpatzak' },
      { icon: { svg: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="style=stroke" clip-path="url(#clip0_1_1828)"> <g id="web"> <path id="vector (Stroke)" fill-rule="evenodd" clip-rule="evenodd" d="M10.4425 2.44429C10.0752 3.64002 9.32073 6.25569 8.89915 8.83258C9.99331 9.00921 11.0621 9.12209 12 9.12209C12.9379 9.12209 14.0067 9.00921 15.1009 8.83258C14.6793 6.25569 13.9248 3.64002 13.5575 2.44429C13.0509 2.3624 12.5307 2.31977 12 2.31977C11.4693 2.31977 10.9491 2.3624 10.4425 2.44429ZM15.3337 2.90893C15.737 4.305 16.2958 6.42828 16.6448 8.54737C18.1513 8.23703 19.5727 7.85824 20.605 7.56109C19.4986 5.42102 17.6172 3.74662 15.3337 2.90893ZM21.2129 9.01933C20.1222 9.33683 18.5423 9.76328 16.8594 10.1057C16.9295 10.7564 16.9709 11.3958 16.9709 12C16.9709 12.8816 16.8827 13.8411 16.7445 14.8058C18.759 14.3858 20.6068 13.849 21.5557 13.5575C21.6376 13.0509 21.6802 12.5307 21.6802 12C21.6802 10.959 21.5162 9.95751 21.2129 9.01933ZM21.0911 15.3337C19.9166 15.6729 18.229 16.1219 16.4634 16.4634C16.1219 18.229 15.6729 19.9166 15.3337 21.0911C17.9978 20.1138 20.1138 17.9978 21.0911 15.3337ZM13.5576 21.5557C13.849 20.6068 14.3858 18.759 14.8058 16.7445C13.8411 16.8827 12.8816 16.9709 12 16.9709C11.1184 16.9709 10.1589 16.8827 9.19423 16.7445C9.61421 18.759 10.151 20.6068 10.4425 21.5557C10.9491 21.6376 11.4693 21.6802 12 21.6802C12.5307 21.6802 13.0509 21.6376 13.5576 21.5557ZM8.66629 21.0911C8.32707 19.9166 7.8781 18.229 7.53658 16.4634C5.77099 16.1219 4.08335 15.6729 2.90891 15.3337C3.88622 17.9978 6.00216 20.1138 8.66629 21.0911ZM2.44429 13.5575C3.39316 13.849 5.24101 14.3858 7.25548 14.8058C7.1173 13.8411 7.02907 12.8816 7.02907 12C7.02907 11.3958 7.07048 10.7564 7.14056 10.1057C5.45769 9.76328 3.87779 9.33683 2.78712 9.01933C2.48383 9.95751 2.31977 10.959 2.31977 12C2.31977 12.5307 2.3624 13.0509 2.44429 13.5575ZM3.39504 7.56109C4.42731 7.85824 5.84865 8.23703 7.35522 8.54737C7.70416 6.42827 8.26303 4.305 8.66626 2.90893C6.38282 3.74662 4.50139 5.42102 3.39504 7.56109ZM8.68924 10.3888C8.63137 10.9544 8.59884 11.4968 8.59884 12C8.59884 12.9399 8.71224 14.012 8.88985 15.1102C9.98798 15.2878 11.0601 15.4012 12 15.4012C12.9399 15.4012 14.012 15.2878 15.1102 15.1102C15.2878 14.012 15.4012 12.9399 15.4012 12C15.4012 11.4968 15.3686 10.9544 15.3108 10.3888C14.1776 10.5703 13.0348 10.6919 12 10.6919C10.9652 10.6919 9.82236 10.5703 8.68924 10.3888ZM9.67273 0.991173C10.4243 0.833026 11.2029 0.75 12 0.75C12.7971 0.75 13.5757 0.833026 14.3273 0.991174C18.0108 1.76627 21.0281 4.34097 22.42 7.75174C22.9554 9.06356 23.25 10.4983 23.25 12C23.25 12.7971 23.167 13.5757 23.0088 14.3273C22.0943 18.6736 18.6736 22.0943 14.3273 23.0088C13.5757 23.167 12.7971 23.25 12 23.25C11.2029 23.25 10.4243 23.167 9.67273 23.0088C5.32644 22.0943 1.90572 18.6736 0.991173 14.3273C0.833026 13.5757 0.75 12.7971 0.75 12C0.75 10.4972 1.04509 9.06132 1.58123 7.74866C2.97369 4.33943 5.99026 1.76604 9.67273 0.991173Z" fill="currentColor"></path> </g> </g> <defs> <clipPath id="clip0_1_1828"> <rect width="24" height="24" fill="white"></rect> </clipPath> </defs> </g></svg>'}, link: 'http://ksm.fsv.cvut.cz/~bp/'}
    ]
  }
]
</script>

# 简介

欢迎使用结构分析在线网络应用程序 <Edubeam />。无需安装或复杂设置，即可进行结构分析。

点击 [此处](https://run.edubeam.app/?lang=cn) 访问 <Edubeam />，开始您的结构分析之旅。

运行中的 edubeam

<figure>
  <a href="https://run.edubeam.app/?lang=cn" target="_blank">
    <WelcomeStructure />
    </a>
  <figcaption>运行中的 edubeam</figcaption>
</figure>

## 功能

- **二维梁/桁架求解器**: 无缝分析和求解二维结构。

- **用户友好界面**: 直观设计，轻松导航。

- **免费在线**: 随时随地访问，方便快捷。

- **以学生和教师为中心**: 量身定制的功能，提供最佳的学习体验。

- **开源创新**: 合作并为 <Edubeam /> 的发展做出贡献。

- **轻松共享项目**: 使用 URL 功能轻松共享您的项目。

## 本地化

<Edubeam /> 提供多种语言版本，以增强用户体验。

<div>

<table>
    <tr>
        <td><img src="language-icons/icons/en.svg" style="height: 24px;" alt="English" /></td>
        <td><a href="https://run.edubeam.app/?lang=en" target="_blank">English</a></td>
    </tr>
    <tr>
        <td><img src="language-icons/icons/de.svg" style="height: 24px;" alt="Deutsch" /></td>
        <td><a href="https://run.edubeam.app/?lang=de" target="_blank">Deutsch</a></td>
    </tr>
    <tr>
        <td><img src="language-icons/icons/es.svg" style="height: 24px;" alt="Español" /></td>
        <td><a href="https://run.edubeam.app/?lang=es" target="_blank">Español</a></td>
    </tr>
    <tr>
        <td><img src="language-icons/icons/fr.svg" style="height: 24px;" alt="Français" /></td>
        <td><a href="https://run.edubeam.app/?lang=fr" target="_blank">Français</a></td>
    </tr>
    <tr>
        <td><img src="language-icons/icons/cs.svg" style="height: 24px;" alt="Čeština" /></td>
        <td><a href="https://run.edubeam.app/?lang=cs" target="_blank">Čeština</a></td>
    </tr>
    <tr>
        <td><img src="language-icons/icons/zh.svg" style="height: 24px;" alt="中文" /></td>
        <td><a href="https://run.edubeam.app/?lang=cn" target="_blank">中文</a></td>
    </tr>
</table>

</div>

## 作者

<Edubeam /> 是一个合作项目，由一群热衷于推动结构分析教育的贡献者组成。它由[布拉格 CTU - 土木工程系](https://www.fsv.cvut.cz/en)力学系的一个小团队开发和维护。

<VPTeamMembers size="small" :members="members" />

最初的[桌面应用程序](https://www.oofem.org/wiki/doku.php?id=edubeam:edubeam_en)由[Bořek Patzák](http://ksm.fsv.cvut.cz/~bp/)、[Jan Stránský](https://mech.fsv.cvut.cz/~stransky/en/)和[Vít Šmilauer](https://mech.fsv.cvut.cz/~smilauer/)开发。

## 加入我们

欢迎加入我们的社区，为 <Edubeam /> 的发展做出贡献。您的参与范围可以从测试和报告问题到积极参与开发过程。

以下是一些您可以参与并为 <Edubeam /> 做出贡献的方式：

1. **贡献代码：**

   - 访问我们的 [GitHub 代码库](https://github.com/janvorisek/edubeam) 并参与代码开发。
   - 您可以选择从基本结构分析到高级功能实现等各种任务。

2. 测试和 Bug 报告：\*\* \*\*

   - 测试 <Edubeam />，并在我们的 [issue tracker](https://github.com/janvorisek/edubeam/issues) 上报告任何错误或问题。
   - 您的反馈对于提高 <Edubeam /> 的可靠性和功能至关重要。

3. **文档：**

   - 帮助改进我们的文档，使 <Edubeam /> 更方便用户使用。
   - 贡献教程、指南或常见问题，以增强用户的学习体验。

4. **传播信息：**
   - 与您的同行和社交媒体分享 <Edubeam />。
   - 您的支持有助于发展我们的社区，确保更多的学生受益于 <Edubeam />。

准备好开始了吗？选择适合您的技能和兴趣的贡献途径，成为 <Edubeam /> 社区的宝贵一员！
