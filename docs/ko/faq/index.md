---
description: "EduBeam에 대해 자주 묻는 질문: 비용과 계정, 브라우저와 기기, 잃어버린 모델 복구, 오프라인 사용, 데이터 저장, 모델링 팁."
---

# 자주 묻는 질문

## 일반 {#general}

### EduBeam은 무엇인가요? {#what-is-edubeam}

즉각적인 피드백을 원하는 학생, 교수자, 엔지니어를 위한 무료 오픈 소스 브라우저 기반 2D 보, 라멘, 트러스 해석 프로그램입니다. [소개](/ko/guide/introduction)를 참고하세요.

### 정말 무료인가요? 계정이 필요한가요? {#is-it-really-free-do-i-need-an-account}

네, 무료이고 계정은 필요 없습니다. [run.edubeam.app](https://run.edubeam.app/?lang=ko)을 열고 바로 모델링을 시작하세요. 계정도, 설치 프로그램도, 사용 제한도 없습니다. 소스 코드는 [GitHub](https://github.com/janvorisek/edubeam)에 있습니다.

### 어떤 브라우저와 기기에서 작동하나요? {#which-browsers-and-devices-work}

최신 Chrome, Edge, Firefox, Safari라면 어느 것이든 됩니다. 태블릿과 휴대폰에서도 작동합니다. 탭해서 선택하거나 배치하고, 절점을 드래그해 옮기고, 다른 곳을 드래그해 화면을 이동하고, 두 손가락으로 확대/축소하고, 길게 눌러 캔버스 메뉴를 엽니다. 그래도 마우스와 키보드가 있으면 모델링이 더 빠릅니다. [키보드, 마우스 및 터치](/ko/reference/shortcuts#touch)를 참고하세요.

### 모델을 잃어버렸어요. 되찾을 수 있나요? {#i-lost-my-model-can-i-get-it-back}

아마 가능합니다. 모델을 지우거나 그 위에 링크, 파일, 예제를 열면 이전 모델이 **☰ → 최근 구조물**(최근 10개)에 보관되며, <kbd>Ctrl</kbd>+<kbd>Z</kbd>로 대체를 되돌릴 수 있습니다. 둘 다 사용자의 브라우저에만 있습니다.

### 오프라인에서도 쓸 수 있나요? {#can-i-use-it-offline}

EduBeam은 프로그레시브 웹 앱입니다. 한 번 불러오면 인터넷 연결 없이도 작동하며, 브라우저가 설치를 제안할 수도 있습니다. 새 버전이 나오면 업데이트하기 전에 대화 상자로 묻습니다.

### 데이터는 어디에 저장되나요? {#where-is-my-data-stored}

사용자의 브라우저에만 저장됩니다. 모델은 서버로 전송되지 않습니다. 공유 링크 자체가 *곧* 모델입니다. [가져오기, 내보내기 및 공유](/ko/essentials/import-export)를 참고하세요.

## 모델링 {#modelling}

### 고정 / 힌지 / 롤러 지점은 어떻게 만드나요? {#how-do-i-make-a-fixed-pinned-roller-support}

절점을 클릭하고 **지지조건**을 열어 힌지, 롤러, 고정단, 슬라이더 등의 기호를 고릅니다. 또는 자유도를 체크합니다. **Dx + Dz + Ry** = 고정단, **Dx + Dz** = 힌지, **Dz** = 롤러. 모든 조합은 [절점 및 지점](/ko/essentials/nodes-supports#supports)에 정리되어 있습니다.

### 트러스는 어떻게 만드나요? {#how-do-i-make-a-truss}

보 요소를 쓰고 *요소* 탭에서 모든 부재의 **단부 힌지 두 칸을 모두** 체크하거나, 마우스로 부재를 그리기 전에 배너에서 *시작단 힌지*와 *끝단 힌지*를 체크합니다. 하중은 절점에 가합니다. [트러스 튜토리얼](/ko/tutorials/truss)에서 하나를 처음부터 만들어 봅니다.

### 라멘에 힌지는 어떻게 넣나요? {#how-do-i-put-a-hinge-in-a-frame}

모멘트를 해제할 절점 쪽에 있는 요소의 **단부 힌지**를 체크합니다. 절점에서 요소 *하나*에만 힌지를 넣으면 그 요소만 해제됩니다.

### 보 중간에 지점이나 집중하중을 추가하려면 어떻게 하나요? {#how-do-i-add-a-support-or-a-point-load-in-the-middle-of-a-beam}

*마우스로 추가*로 보 위에 절점을 추가하고 **구조물에 연결**을 고르면 보가 둘로 분할됩니다. 집중하중만 가하려면 절점도 필요 없습니다. 위치를 지정한 **집중하중** 요소하중을 쓰세요.

### 자중을 가할 수 있나요? {#can-i-apply-self-weight}

자동으로는 안 됩니다. 등분포하중 $f_z = \rho g A$로 입력하세요.

### 경사 지점을 모델링할 수 있나요? {#can-i-model-inclined-supports}

네. 절점에 **절점 좌표계 각도**를 설정하면 그 절점의 자유도가 회전된 좌표계에서 해석됩니다.

### 하중조건이나 하중조합이 있나요? {#are-there-load-cases-or-combinations}

아니요, 하중조건은 하나뿐입니다. 하중조건마다 따로 모델링해 저장하거나 공유하세요.

### 하중이 왜 위를 향하나요? {#why-do-my-loads-point-up}

전체 z축이 **아래**를 향하기 때문입니다. 양의 `Fz`는 아래 방향입니다. [부호 규약](/ko/elements/conventions)을 참고하세요. 연직축이 위를 향하는 편이 좋다면 *설정 → 언어 및 지역 → 좌표계*에서 y 위 좌표축으로 바꾸세요.

## 결과 {#results}

### 왜 "해석" 버튼이 없나요? {#why-is-there-no-solve-button}

모델은 변경할 때마다 자동으로 해석됩니다. 결과가 나타나지 않으면 모델을 아직 해석할 수 없는 상태입니다. 확인할 사항은 [문제 해결](/ko/reference/troubleshooting)에 있습니다.

### 처짐이 공식과 조금 다른 이유는 무엇인가요? {#why-does-my-deflection-differ-slightly-from-the-formula}

EduBeam은 Timoshenko 보를 쓰므로 처짐에 전단 변형이 포함됩니다. 세장한 부재에서는 차이가 1 %보다 훨씬 작습니다. 자세한 내용과 비교 예는 [손 계산으로 결과 검증](/ko/guide/verification)에 있습니다.

### 결과는 얼마나 정확한가요? 요소를 더 나눠야 하나요? {#how-accurate-are-the-results-do-i-need-more-elements}

선형 정적 해석에서 보 요소는 지원하는 하중 유형에 대해 정확해를 주므로, 부재 하나에 요소 하나면 충분합니다. 추가 절점은 지점, 힌지, 단면 변화가 필요한 곳이나 하중을 붙일 절점이 필요한 곳에만 있으면 됩니다.

### 반력은 어디에 나오나요? {#where-are-the-reactions-listed}

뷰어에 값이 있는 화살표로 표시됩니다(표시 옵션의 **반력**, 기본으로 켜져 있음). **결과 → CSV 내보내기**로 받은 파일과 **복사**에도 들어 있습니다. 절점 변위와 요소 단부력은 **결과** 탭에 있습니다.

## 파일 및 공유 {#files-sharing}

### 모델은 어떻게 공유하나요? {#how-do-i-share-a-model}

**모델 공유** → **복사**. 링크에는 모델 전체가 담겨 있습니다. 받는 사람은 각자 편집 가능한 사본을 받으며, 실시간 공동 작업 기능은 없습니다. [EduBeam으로 가르치기](/ko/guide/teaching)도 참고하세요.

### 웹 사이트나 슬라이드에 모델을 삽입할 수 있나요? {#can-i-embed-a-model-on-my-website-or-in-slides}

네. 공유 링크에 `&viewer=1`을 붙여 `<iframe>`에 넣으세요. [뷰어 삽입](/ko/essentials/import-export#embed-a-read-only-viewer)을 참고하세요.

### 이미지나 표를 내보낼 수 있나요? {#can-i-export-images-or-tables}

네. **☰ → 이미지 내보내기**(<kbd>Ctrl</kbd>+<kbd>P</kbd>)는 원하는 크기나 축척으로 그림을 PNG나 SVG로 저장합니다. **결과 → CSV 내보내기**는 두 결과 표를 저장하고, **복사**는 스프레드시트에 붙여 넣을 수 있도록 클립보드에 넣습니다. [가져오기, 내보내기 및 공유](/ko/essentials/import-export#export-an-image)를 참고하세요.

### 프로그램으로 모델을 생성할 수 있나요? {#can-i-generate-models-programmatically}

네. 프로젝트 파일은 SI 단위로 된 일반 JSON이며([형식 설명](/ko/essentials/import-export#project-file-format) 참고), *프로젝트 열기*나 끌어다 놓기로 열 수 있습니다.

## 지원 {#support}

### 버그 신고나 기능 요청은 어떻게 하나요? {#how-do-i-report-a-bug-or-request-a-feature}

[GitHub](https://github.com/janvorisek/edubeam/issues)에 이슈를 등록하고 문제를 재현하는 공유 링크나 프로젝트 파일을 첨부해 주세요. 비공개 지원: [support@edubeam.app](mailto:support@edubeam.app).
