---
description: "EduBeam についてのよくある質問：料金とアカウント、ブラウザと端末、失ったモデルの復元、オフラインでの利用、データの保存場所、モデル化のコツ。"
---

# よくある質問

## 全般 {#general}

### EduBeam とは何ですか？ {#what-is-edubeam}

2D の梁、ラーメン、トラスのための、ブラウザで動く無料のオープンソースのソルバーです。すぐにフィードバックが欲しい学生、教員、技術者を対象にしています。[はじめに](/ja/guide/introduction)をご覧ください。

### 本当に無料ですか？アカウントは必要ですか？ {#is-it-really-free-do-i-need-an-account}

無料で、アカウントは不要です。[run.edubeam.app](https://run.edubeam.app/?lang=ja) を開けば、すぐにモデル化を始められます。アカウントもインストーラーも利用制限もありません。ソースコードは [GitHub](https://github.com/janvorisek/edubeam) にあります。

### どのブラウザや端末で使えますか？ {#which-browsers-and-devices-work}

最新の Chrome、Edge、Firefox、Safari であれば使えます。タブレットやスマートフォンでも動作します。タップで選択・配置、節点のドラッグで移動、それ以外の場所のドラッグでパン、ピンチでズーム、長押しでキャンバスのメニューが開きます。それでも、マウスとキーボードのほうが速くモデル化できます。[キーボード・マウス・タッチ](/ja/reference/shortcuts#touch)をご覧ください。

### モデルが消えてしまいました。元に戻せますか？ {#i-lost-my-model-can-i-get-it-back}

おそらく戻せます。モデルをクリアしたり、その上にリンク、ファイル、例題を開いたりすると、前のモデルは **☰ → 最近のモデル**（直近 10 件）に保存され、<kbd>Ctrl</kbd>+<kbd>Z</kbd> でも置き換えを取り消せます。どちらもお使いのブラウザの中だけで機能します。

### オフラインで使えますか？ {#can-i-use-it-offline}

EduBeam はプログレッシブ Web アプリ（PWA）です。一度読み込めば接続がなくても動作し続け、ブラウザがインストールを提案することもあります。新しいバージョンが利用できるときは、更新前にダイアログで確認されます。

### データはどこに保存されますか？ {#where-is-my-data-stored}

お使いのブラウザの中だけです。モデルがサーバーに送られることはありません。共有リンクそのものがモデルです。[インポート・エクスポート・共有](/ja/essentials/import-export)をご覧ください。

## モデル化 {#modelling}

### 固定・ピン・ローラー支点はどう作りますか？ {#how-do-i-make-a-fixed-pinned-roller-support}

節点をクリックして**支点条件**を開き、ピン、ローラー、固定、スライド固定などの記号を選びます。または自由度にチェックを入れます：**Dx + Dz + Ry** = 固定、**Dx + Dz** = ピン、**Dz** = ローラー。すべての組み合わせは[節点と支点](/ja/essentials/nodes-supports#supports)に載っています。

### トラスはどう作りますか？ {#how-do-i-make-a-truss}

梁要素を使い、*要素*タブですべての部材の**両端の材端ヒンジ**にチェックを入れます。あるいは、マウスで部材を描く前に、バナーで*始端ヒンジ*と*終端ヒンジ*にチェックを入れておきます。荷重は節点にかけます。[トラスのチュートリアル](/ja/tutorials/truss)で一例を順に解説しています。

### ラーメンにヒンジを入れるには？ {#how-do-i-put-a-hinge-in-a-frame}

モーメントを解放したい側にある要素の、その節点側の**材端ヒンジ**にチェックを入れます。節点で*1 つ*の要素にヒンジを付けると、解放されるのはその要素だけです。

### 梁の途中に支点や集中荷重を加えるには？ {#how-do-i-add-a-support-or-a-point-load-in-the-middle-of-a-beam}

*マウスで追加*で梁の上に節点を追加し、**構造物に接続**を選びます。梁は 2 つに分割されます。集中荷重だけなら節点すら不要です。位置を指定した**集中荷重**の要素荷重を使ってください。

### 自重はかけられますか？ {#can-i-apply-self-weight}

自動ではかけられません。等分布荷重 $f_z = \rho g A$ として入力してください。

### 傾斜支点はモデル化できますか？ {#can-i-model-inclined-supports}

はい。節点に**節点の LCS 角度**を設定すると、その節点の自由度は回転した座標系で解釈されます。

### 荷重ケースや荷重の組み合わせはありますか？ {#are-there-load-cases-or-combinations}

いいえ、荷重ケースは 1 つだけです。ケースごとに別々にモデル化し、保存または共有してください。

### 荷重が上を向いてしまうのはなぜですか？ {#why-do-my-loads-point-up}

グローバル z 軸が**下向き**だからです。正の `Fz` は下向きです。[符号規約](/ja/elements/conventions)をご覧ください。鉛直軸を上向きにしたい場合は、*設定 → 言語と地域 → 座標系*で y 上向きの座標軸に切り替えてください。

## 結果 {#results}

### 「解析」ボタンがないのはなぜですか？ {#why-is-there-no-solve-button}

変更のたびにモデルが自動で解析されるからです。結果が表示されない場合は、モデルがまだ解析できる状態になっていません。確認すべき点は[トラブルシューティング](/ja/reference/troubleshooting)にまとめています。

### たわみが公式とわずかに異なるのはなぜですか？ {#why-does-my-deflection-differ-slightly-from-the-formula}

EduBeam は Timoshenko 梁を使うので、たわみにせん断変形が含まれます。細長い部材では、その差は 1 % を大きく下回ります。詳しい説明と比較例は[手計算による結果の確認](/ja/guide/verification)にあります。

### 結果の精度は？要素を増やす必要はありますか？ {#how-accurate-are-the-results-do-i-need-more-elements}

線形静的解析では、対応している種類の荷重に対して梁要素は厳密なので、部材 1 本につき要素 1 つで十分です。節点を追加する必要があるのは、支点、ヒンジ、断面の変化を設けたい場所や、荷重をかける節点が欲しい場所だけです。

### 反力はどこに表示されますか？ {#where-are-the-reactions-listed}

ビューアに、値の付いた矢印として表示されます（表示オプションの**反力**。初期状態でオン）。**結果 → CSV をエクスポート**で出力したファイルや、**コピー**の内容にも含まれます。節点変位と材端力は**結果**タブにあります。

## ファイルと共有 {#files-sharing}

### モデルを共有するには？ {#how-do-i-share-a-model}

**モデルを共有** → **コピー**です。リンクにはモデル全体が含まれます。受け取った人はそれぞれ自分用の編集可能なコピーを得ます。リアルタイムの共同編集はできません。[EduBeam を使った授業](/ja/guide/teaching)もご覧ください。

### 自分の Web サイトやスライドにモデルを埋め込めますか？ {#can-i-embed-a-model-on-my-website-or-in-slides}

はい。共有リンクに `&viewer=1` を付けて `<iframe>` に入れます。[ビューアの埋め込み](/ja/essentials/import-export#embed-a-read-only-viewer)をご覧ください。

### 画像や表をエクスポートできますか？ {#can-i-export-images-or-tables}

はい。**☰ → 画像をエクスポート**（<kbd>Ctrl</kbd>+<kbd>P</kbd>）で、図を好きなサイズや縮尺の PNG または SVG で保存できます。**結果 → CSV をエクスポート**で 2 つの結果表を保存でき、**コピー**で表計算ソフト用にクリップボードへコピーできます。[インポート・エクスポート・共有](/ja/essentials/import-export#export-an-image)をご覧ください。

### モデルをプログラムで生成できますか？ {#can-i-generate-models-programmatically}

はい。プロジェクトファイルは SI 単位のプレーンな JSON です（[形式の説明](/ja/essentials/import-export#project-file-format)を参照）。*プロジェクトを開く*やドラッグ＆ドロップで開けます。

## サポート {#support}

### 不具合の報告や機能のリクエストはどうすればいいですか？ {#how-do-i-report-a-bug-or-request-a-feature}

[GitHub](https://github.com/janvorisek/edubeam/issues) で issue を作成し、問題を再現できる共有リンクかプロジェクトファイルを添付してください。個別のサポート：[support@edubeam.app](mailto:support@edubeam.app)。
