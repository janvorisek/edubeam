---
description: "EduBeam 소개: 2D 보, 라멘, 트러스를 위한 무료 브라우저 기반 유한요소 해석 프로그램입니다. 할 수 있는 일과 할 수 없는 일, 대상 사용자, 사용 설명서의 구성을 안내합니다."
---

<script setup>
import { VPTeamMembers } from 'vitepress/theme-without-fonts'

const members = [
  {
    avatar: 'https://www.github.com/janvorisek.png',
    name: 'Jan Voříšek',
    title: '수석 개발자 및 제품 디자이너',
    links: [
      { icon: 'github', link: 'https://github.com/janvorisek' },
      { icon: 'twitter', link: 'https://twitter.com/janvorisekdev' },
    ]
  },
  {
    avatar: 'https://www.github.com/bpatzak.png',
    name: 'Bořek Patzák',
    title: '유한요소 솔버, 기존 앱 개발자',
    links: [
      { icon: 'github', link: 'https://github.com/bpatzak' },
    ]
  }
]
</script>

# 소개

<Edubeam />은 보, 라멘, 트러스를 위한 무료 브라우저 기반 **2D 구조 해석** 도구입니다. 구조물을 그리고 지점과 하중을 추가하면, 무엇이든 바꾸는 순간 유한요소 솔버가 모든 것을 다시 계산합니다. *해석* 버튼도, 설치도, 계정도 필요 없습니다.

새 탭에서 [EduBeam을 실행](https://run.edubeam.app/?lang=ko){target="_blank"}하고 [빠른 시작](/ko/guide/quick-start)을 따라 해 보세요.

![EduBeam의 3힌지 라멘: 하중은 주황색, 반력은 보라색, 휨모멘트는 빨간색, 변형 형상은 회색](/screenshots/ko/hero.webp)

## 처음 방문할 때 {#your-first-visit}

앱을 처음 열면 환영 대화 상자가 어떻게 시작할지, 어떤 단위와 좌표축을 쓸지 묻습니다. 둘 다 나중에 [설정](/ko/essentials/units-settings)에서 바꿀 수 있습니다.

![환영 대화 상자](/screenshots/ko/welcome.webp){.shot-lg}

- **둘러보기**는 메뉴, 실행 취소와 다시 실행, 뷰어 버튼, 표시 옵션, 그리드와 단위, 하단 바를 하나씩 안내합니다.
- **첫 번째 보 그리기**는 7단계로 된 안내 과제입니다. 마우스로 보를 그리고, 지점과 하중을 설정한 뒤 결과를 읽습니다. 모서리의 작은 카드가 다음에 할 일을 알려 줍니다.
- **예제 열기**는 미리 만들어진 모델 갤러리를 엽니다.

세 가지 모두 **☰ 메뉴**에도 있으므로 언제든지 다시 열 수 있습니다.

![첫 번째 보 그리기: 작업하는 동안 가이드 카드가 모서리에 표시됩니다](/screenshots/ko/first-beam-task.webp)

## 할 수 있는 일 {#what-it-does}

| 분야 | 기능 |
| --- | --- |
| **구조물** | 절점과 2D Timoshenko 보 요소로 이루어진 평면(x–z) 보, 연속보, 라멘, 트러스. 단부 힌지를 넣으면 어떤 부재든 트러스 부재가 됩니다. |
| **지점** | 힌지, 롤러, 고정단, 슬라이더를 비롯해 `Dx`, `Dz`, `Ry` 구속의 모든 조합을 기호로 선택합니다. 절점 각도로 경사 지점을 만들 수 있습니다. 지점 침하. |
| **하중** | 절점 힘과 모멘트, 강제변위, 등분포하중과 사다리꼴 분포하중, 부재 위의 집중 힘과 모멘트, 균일 온도하중과 온도구배 하중. |
| **단면** | 재료 및 단면 라이브러리(유럽 및 미국 규격)와 함께, 임의 형상에 대해 $A$, $I_y$, $I_z$, $I_{yz}$, 주축, 회전반경을 계산하는 다각형 편집기. |
| **결과** | 변형 형상, 축력 **N**, 전단력 **V**, 휨모멘트 **M**, 반력, 절점 변위, 요소 단부력, 요소 강성 행렬. |
| **해석** | 하중조건 하나에 대한 선형 정적 해석. 선형 모델에서는 결과가 정확하므로 요소 분할을 세밀하게 할 필요가 없습니다. 구조물을 해석할 수 없으면 EduBeam이 그 이유를 설명하고 구조물이 어떻게 움직일 수 있는지 애니메이션으로 보여 줍니다. |
| **파일** | 프로젝트를 JSON으로 저장하고 열기, 모델 전체를 링크로 공유, 그림을 PNG나 SVG로, 결과를 CSV로 내보내기. 최근에 대체된 모델은 보관되므로 되돌릴 수 있습니다. 모든 데이터는 사용자의 기기에만 남습니다. |
| **단위** | 클릭 한 번으로 SI 또는 미국 단위로 바꾸거나 물리량마다 따로 지정합니다. 좌표축은 x 오른쪽·z 아래 또는 x 오른쪽·y 위 중에서 고릅니다. |

## (아직) 할 수 없는 일 {#what-it-does-not-do-yet}

한계를 미리 알아 두면 시간을 아낄 수 있습니다.

- **2D 전용.** 면외 거동과 3D 골조는 다루지 않습니다.
- **선형 정적 해석 전용.** 2차(P–Δ) 효과, 좌굴, 동적 해석, 소성은 다루지 않습니다.
- **하중조건 하나.** 하중조합이나 포락선은 없습니다. 하중조건마다 따로 모델링하고 각각 별도의 파일이나 공유 링크로 저장하세요.
- **자중 없음.** 필요하면 분포하중으로 가하세요.
- **설계 검토 없음.** EduBeam은 부재력과 변위를 계산합니다. 기준에 따른 검토는 사용자가 직접 해야 합니다.

필요한 기능이 없다면 [이슈를 등록](https://github.com/janvorisek/edubeam/issues)해 주세요.

<ElementariumPromo placement="introduction" />

## 누구를 위한 도구인가요? {#who-is-it-for}

- 구조역학을 배우며 손 계산에 대한 즉각적인 피드백을 원하는 **학생**. [손 계산으로 결과 검증](/ko/guide/verification)을 참고하세요.
- 지점, 힌지, 하중이 부재력을 어떻게 바꾸는지 프로젝터로 실시간으로 보여 주려는 **교수자**. 18개 언어 중 어느 언어로든 쓸 수 있습니다. [EduBeam으로 가르치기](/ko/guide/teaching)를 참고하세요.
- 무거운 데스크톱 프로그램을 열기 전에 빠르게 검산하려는 **엔지니어**.

## 사용 설명서의 구성 {#how-this-guide-is-organised}

1. **시작하기.** 이 페이지, [10분 빠른 시작](/ko/guide/quick-start), 미리 만들어진 [예제](/ko/examples/).
2. **튜토리얼.** 처음부터 끝까지 완성하고 손 계산으로 검증하는 모델: [3힌지 라멘](/ko/tutorials/three-hinged-frame)과 [평면 트러스](/ko/tutorials/truss).
3. **모델링.** 구성 요소마다 한 페이지씩: [사용자 인터페이스](/ko/essentials/user-interface), [절점 및 지점](/ko/essentials/nodes-supports), [요소, 재료 및 단면](/ko/essentials/elements), [하중](/ko/essentials/loads), [단위 및 설정](/ko/essentials/units-settings).
4. **결과.** [다이어그램과 표를 읽는 방법](/ko/essentials/results)과 [결과를 검증하는 방법](/ko/guide/verification).
5. **파일 및 공유.** [프로젝트, 공유 링크, 이미지 및 CSV 내보내기](/ko/essentials/import-export), [EduBeam으로 가르치기](/ko/guide/teaching).
6. **참고 자료.** [키보드, 마우스 및 터치](/ko/reference/shortcuts), [문제 해결](/ko/reference/troubleshooting), [자주 묻는 질문](/ko/faq/).
7. **이론 매뉴얼.** [부호 규약](/ko/elements/conventions)과 [보](/ko/elements/beam) 및 [트러스](/ko/elements/truss) 요소의 정식화.

앱의 **?** 아이콘을 누르면 이 사용 설명서의 해당 페이지가 사용자의 언어로 열립니다.

## 언어 {#languages}

인터페이스는 English, Bahasa Indonesia, Čeština, Deutsch, Español, Français, Italiano, Polski, Português, Tiếng Việt, Русский, Türkçe, Українська, हिन्दी, 日本語, 한국어, ไทย 및 汉语로 제공됩니다. EduBeam은 브라우저 설정에 따라 언어를 고릅니다. **설정 → 언어 및 지역**에서 바꾸거나, `?lang=` 매개변수로 앱을 열 수 있습니다. 예: [run.edubeam.app/?lang=ko](https://run.edubeam.app/?lang=ko){target="_blank"}.

## 개발자 및 감사의 글 {#authors-credits}

<Edubeam />은 최신 웹 버전의 관리자이자 제품 디자이너인 [Jan Voříšek](https://github.com/janvorisek)이 이끌고 있습니다. 브라우저 버전은 CTU와 별개로 개발됩니다. Windows와 Linux용 원래 데스크톱 EduBeam은 [CTU 프라하 토목공학부](https://www.fsv.cvut.cz/en) 역학과의 [Bořek Patzák](http://ksm.fsv.cvut.cz/~bp/), [Jan Stránský](https://mech.fsv.cvut.cz/~stransky/en/), [Vít Šmilauer](https://mech.fsv.cvut.cz/~smilauer/)가 만들었습니다. 솔버는 오픈 소스 [ts-fem](https://github.com/janvorisek/ts-fem) 라이브러리입니다.

<VPTeamMembers size="small" :members="members" />

## 기여하기 {#contribute}

- 헷갈리는 동작이나 버그는 [GitHub 이슈](https://github.com/janvorisek/edubeam/issues)로 알려 주세요.
- `docs/`의 파일을 편집하고 풀 리퀘스트를 열어 이 문서나 번역을 개선해 주세요.
- 동기와 동료에게 EduBeam을 알려 주세요.
