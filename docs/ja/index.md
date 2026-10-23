---
description: "ブラウザで使える無料の 2D 構造解析。梁、ラーメン、トラスを描いて荷重をかければ、N、V、M 図、反力、たわみがすぐに得られます。"
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "EduBeam"
  text: "無料のオンライン構造解析"
  tagline: 梁、ラーメン、トラスを描いて荷重をかければ、編集するたびに図が更新されます。インストールもアカウントも料金も不要で、本格的な FEM の結果がブラウザで得られます。
  image:
    src: /screenshots/ja/hero.webp
    alt: 解析済みのラーメンを表示した EduBeam
  actions:
    - theme: brand
      text: アプリを起動
      link: https://run.edubeam.app/?lang=ja
    - theme: alt
      text: ガイドを読む
      link: /ja/guide/introduction
    - theme: alt
      text: 例題を見る
      link: /ja/examples/

features:
  - icon: ⚡
    title: 描いたそばから結果が出る
    details: 「解析」ボタンはありません。節点をドラッグしても、ヒンジにチェックを入れても、荷重を変えても、N、V、M、反力、変形図がすぐに追従します。
    link: /ja/essentials/results
    linkText: 結果の読み方
  - icon: 🧑‍🏫
    title: 授業のために設計
    details: ガイド付きの最初のステップ、マウスを重ねると出る値、構造物がなぜ不安定なのかを説明するソルバー、そして講義資料に貼れる共有リンク。
    link: /ja/guide/teaching
    linkText: EduBeam を使った授業
  - icon: 🌍
    title: あなたの言語、あなたの単位
    details: 18 のインターフェース言語、SI 単位または米国慣用単位、そして z 下向きか教科書どおりの y 上向きかを選べる座標軸。
    link: /ja/essentials/units-settings
    linkText: 単位と設定
  - icon: 🔗
    title: 共有、エクスポート、埋め込み
    details: モデル全体をリンクで送ったり、ファイルとして保存したり、図を PNG や SVG に、結果表を CSV にエクスポートしたりできます。
    link: /ja/essentials/import-export
    linkText: ファイルと共有
---

## ここから始める {#start-here}

<div class="start-grid">

**EduBeam ははじめてですか？** [10 分のクイックスタート](/ja/guide/quick-start)に沿って進めてください。単純梁を一歩ずつモデル化し、すべての結果を手計算で確認します。

**作りたいものが決まっていますか？** [チュートリアル](/ja/tutorials/three-hinged-frame)に進むか、用意された[例題](/ja/examples/)を開いて変更してみましょう。

**授業を担当していますか？** [EduBeam を使った授業](/ja/guide/teaching)をご覧ください。課題用の共有リンク、スライドに埋め込めるビューア、演習問題を紹介しています。

</div>

<div class="shots">

![トラス：軸力（引張が正）](/screenshots/ja/tut-truss.webp)

![不安定構造を可視化：EduBeam が解析できない理由を示します](/screenshots/ja/ui-mechanism.webp)

</div>

## モデル化できるもの {#what-you-can-model}

- 平面内の**梁、ラーメン、トラス**：連続梁、門形ラーメン、3 ヒンジアーチ、ピン接合トラス。
- **あらゆる支点**：ピン、ローラー、固定、ローラー（回転拘束）、傾斜支点、支点沈下。
- **荷重**：集中荷重とモーメント、等分布荷重と台形分布荷重、部材上の任意の位置の集中荷重、温度荷重。
- **あらゆる断面**：ライブラリ（IPE、HEA、AISC W、HSS、長方形、鋼管）から選ぶか、多角形として描けば、断面性能は自動で計算されます。

詳しくは[はじめに](/ja/guide/introduction)をご覧ください。

<ElementariumPromo />
