---
description: "EduBeam とは：2D の梁、ラーメン、トラスのための、ブラウザで動く無料の FEM ソルバーです。できること・できないこと、対象ユーザー、このガイドの構成を紹介します。"
---

<script setup>
import { VPTeamMembers } from 'vitepress/theme-without-fonts'

const members = [
  {
    avatar: 'https://www.github.com/janvorisek.png',
    name: 'Jan Voříšek',
    title: 'リード開発者・プロダクトデザイナー',
    links: [
      { icon: 'github', link: 'https://github.com/janvorisek' },
      { icon: 'twitter', link: 'https://twitter.com/janvorisekdev' },
    ]
  },
  {
    avatar: 'https://www.github.com/bpatzak.png',
    name: 'Bořek Patzák',
    title: 'FEM ソルバー、旧アプリの作者',
    links: [
      { icon: 'github', link: 'https://github.com/bpatzak' },
    ]
  }
]
</script>

# はじめに

<Edubeam /> は、梁、ラーメン、トラスのための、ブラウザで動く無料の **2D 構造解析**ツールです。構造物を描き、支点と荷重を加えると、何かを変更した瞬間に有限要素法ソルバーがすべてを再計算します。「解析」ボタンもインストールもアカウントも不要です。

新しいタブで [EduBeam を起動](https://run.edubeam.app/?lang=ja){target="_blank"}し、[クイックスタート](/ja/guide/quick-start)に沿って進めてみましょう。

![EduBeam の 3 ヒンジラーメン：荷重はオレンジ、反力は紫、曲げモーメントは赤、変位図はグレー](/screenshots/ja/hero.webp)

## はじめて使うとき {#your-first-visit}

アプリをはじめて開くと、ようこそダイアログが表示され、どのように始めるか、どの単位と座標軸を使うかを尋ねられます。どちらも後から[設定](/ja/essentials/units-settings)で変更できます。

![ようこそダイアログ](/screenshots/ja/welcome.webp){.shot-lg}

- **ツアーを見る**では、メニュー、元に戻す・やり直し、ビューアのボタン、表示オプション、グリッドと単位、下部バーを順に紹介します。
- **はじめての梁を描く**は 7 ステップのガイド付きタスクです。マウスで梁を描き、支点を設け、荷重をかけて、結果を読みます。次にすべきことは、画面の隅の小さなカードが教えてくれます。
- **例題を開く**では、用意されたモデルのギャラリーが開きます。

この 3 つはすべて **☰ メニュー**にもあるので、いつでも戻ってこられます。

![はじめての梁を描く：作業中もガイドのカードが隅に表示されます](/screenshots/ja/first-beam-task.webp)

## できること {#what-it-does}

| 分野 | 機能 |
| --- | --- |
| **構造** | 節点と 2D ティモシェンコ梁要素で組み立てる、平面（x–z）内の梁、連続梁、ラーメン、トラス。材端ヒンジを使えば、どの部材もトラス材にできます。 |
| **支点** | ピン、ローラー、固定、ローラー（回転拘束）など、`Dx`、`Dz`、`Ry` の拘束のあらゆる組み合わせを記号から選べます。節点の角度による傾斜支点。支点沈下。 |
| **荷重** | 節点の力とモーメント、強制変位、等分布荷重と台形分布荷重、部材上の集中荷重とモーメント、一様または勾配のある温度荷重。 |
| **断面** | 材料ライブラリと断面ライブラリ（欧州と米国）に加え、任意の形状について $A$、$I_y$、$I_z$、$I_{yz}$、主軸、断面二次半径を計算する多角形エディタ。 |
| **結果** | 変位図、軸力 **N**、せん断力 **V**、曲げモーメント **M**、反力、節点変位、材端力、要素剛性マトリクス。 |
| **解析** | 1 つの荷重ケースによる線形静的解析。線形モデルに対して結果は厳密なので、メッシュの細分化は不要です。構造物を解析できない場合、EduBeam はその理由を説明し、どう動けるかをアニメーションで示します。 |
| **ファイル** | プロジェクトを JSON で保存して開く、モデル全体をリンクで共有する、図を PNG や SVG に、結果を CSV にエクスポートする。最近置き換えられたモデルは保存されるので、元に戻せます。データはすべてお使いの端末に残ります。 |
| **単位** | ワンクリックで SI 単位または米国慣用単位に切り替えられ、物理量ごとに個別にも設定できます。座標軸は「x 右向き、z 下向き」か「x 右向き、y 上向き」。 |

## （まだ）できないこと {#what-it-does-not-do-yet}

制約を先に知っておくと、時間の節約になります。

- **2D のみ。** 面外の挙動も 3D のラーメンも扱えません。
- **線形静的解析のみ。** 2 次（P–Δ）効果、座屈、動的解析、塑性は扱えません。
- **荷重ケースは 1 つ。** 荷重の組み合わせや包絡線はありません。ケースごとに別々にモデル化し、それぞれを個別のファイルや共有リンクとして保存してください。
- **自重なし。** 必要な場合は分布荷重として加えてください。
- **断面検定なし。** EduBeam が出すのは断面力と変位です。設計規準に基づく断面検定はご自身で行ってください。

欲しい機能がない場合は、[issue を作成](https://github.com/janvorisek/edubeam/issues)してください。

<ElementariumPromo placement="introduction" />

## 対象ユーザー {#who-is-it-for}

- 構造力学を学び、手計算の結果をすぐに確かめたい**学生**。[手計算による結果の確認](/ja/guide/verification)をご覧ください。
- 支点、ヒンジ、荷重によって断面力がどう変わるかを、プロジェクターでその場で、18 の言語のいずれかで見せたい**教員**。[EduBeam を使った授業](/ja/guide/teaching)をご覧ください。
- 重いデスクトップソフトを開く前に、手早く妥当性を確かめたい**技術者**。

## このガイドの構成 {#how-this-guide-is-organised}

1. **入門。** このページ、[10 分のクイックスタート](/ja/guide/quick-start)、用意された[例題](/ja/examples/)。
2. **チュートリアル。** 最初から最後まで仕上げ、手計算で確認する完全なモデル：[3 ヒンジラーメン](/ja/tutorials/three-hinged-frame)と[平面トラス](/ja/tutorials/truss)。
3. **モデル化。** 構成要素ごとに 1 ページ：[ユーザーインターフェース](/ja/essentials/user-interface)、[節点と支点](/ja/essentials/nodes-supports)、[要素・材料・断面](/ja/essentials/elements)、[荷重](/ja/essentials/loads)、[単位と設定](/ja/essentials/units-settings)。
4. **結果。** [図と表の読み方](/ja/essentials/results)と、その[確認方法](/ja/guide/verification)。
5. **ファイルと共有。** [プロジェクト、共有リンク、画像と CSV のエクスポート](/ja/essentials/import-export)、[EduBeam を使った授業](/ja/guide/teaching)。
6. **リファレンス。** [キーボード・マウス・タッチ](/ja/reference/shortcuts)、[トラブルシューティング](/ja/reference/troubleshooting)、[よくある質問](/ja/faq/)。
7. **理論マニュアル。** [符号規約](/ja/elements/conventions)と、[梁](/ja/elements/beam)および[トラス](/ja/elements/truss)の要素定式化。

アプリ内の **?** アイコンを押すと、このガイドの該当ページがお使いの言語で開きます。

## 言語 {#languages}

インターフェースは English、Bahasa Indonesia、Čeština、Deutsch、Español、Français、Italiano、Polski、Português、Tiếng Việt、Русский、Türkçe、Українська、हिन्दी、日本語、한국어、ไทย、汉语で利用できます。EduBeam はブラウザの言語に合わせて表示言語を選びます。**設定 → 言語と地域**で変更するか、`?lang=` パラメーターを付けてアプリを開いてください。例：[run.edubeam.app/?lang=ja](https://run.edubeam.app/?lang=ja){target="_blank"}。

## 作者とクレジット {#authors-credits}

<Edubeam /> は、現在の Web 版のメンテナーでありプロダクトデザイナーでもある [Jan Voříšek](https://github.com/janvorisek) が率いています。ブラウザ版は CTU とは独立して開発されています。Windows と Linux 向けの元のデスクトップ版 EduBeam は、[チェコ工科大学プラハ校（CTU）土木工学部](https://www.fsv.cvut.cz/en)力学科の [Bořek Patzák](http://ksm.fsv.cvut.cz/~bp/)、[Jan Stránský](https://mech.fsv.cvut.cz/~stransky/en/)、[Vít Šmilauer](https://mech.fsv.cvut.cz/~smilauer/) によって作られました。ソルバーはオープンソースの [ts-fem](https://github.com/janvorisek/ts-fem) ライブラリです。

<VPTeamMembers size="small" :members="members" />

## 貢献する {#contribute}

- わかりにくい挙動や不具合は [GitHub の issue](https://github.com/janvorisek/edubeam/issues) で報告してください。
- `docs/` 内のファイルを編集してプルリクエストを送り、このドキュメントや翻訳を改善してください。
- クラスメートや同僚に EduBeam を紹介してください。
