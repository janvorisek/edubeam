---
description: "브라우저에서 무료로 하는 2D 구조 해석. 보, 라멘, 트러스를 그리고 하중을 가하면 N, V, M 다이어그램, 반력, 처짐을 바로 확인할 수 있습니다."
layout: home

hero:
  name: "EduBeam"
  text: "무료 온라인 구조 해석"
  tagline: 보, 라멘, 트러스를 그리고 하중을 가하면, 편집하는 대로 다이어그램이 바로 바뀝니다. 설치도, 계정도, 비용도 없이 브라우저에서 완전한 유한요소 해석 결과를 얻을 수 있습니다.
  image:
    src: /screenshots/ko/hero.webp
    alt: 해석이 끝난 라멘이 표시된 EduBeam 앱
  actions:
    - theme: brand
      text: 앱 실행
      link: https://run.edubeam.app/?lang=ko
    - theme: alt
      text: 가이드 읽기
      link: /ko/guide/introduction
    - theme: alt
      text: 예제 보기
      link: /ko/examples/

features:
  - icon: ⚡
    title: 그리는 대로 나오는 결과
    details: 해석 버튼이 없습니다. 절점을 드래그하거나, 힌지를 체크하거나, 하중을 바꾸면 N, V, M, 반력, 변형 형상이 즉시 따라 바뀝니다.
    link: /ko/essentials/results
    linkText: 결과 읽기
  - icon: 🧑‍🏫
    title: 교육을 위해 만든 도구
    details: 첫걸음 안내, 마우스 오버 값, 구조물이 왜 메커니즘인지 설명하는 솔버, 그리고 강의 노트에 넣을 수 있는 공유 링크.
    link: /ko/guide/teaching
    linkText: EduBeam으로 가르치기
  - icon: 🌍
    title: 나의 언어, 나의 단위
    details: 18개 인터페이스 언어, SI 또는 미국 단위, z 아래 좌표축과 교과서식 y 위 좌표축 중 선택.
    link: /ko/essentials/units-settings
    linkText: 단위 및 설정
  - icon: 🔗
    title: 공유, 내보내기, 삽입
    details: 모델 전체를 링크로 보내거나 파일로 저장하고, 그림을 PNG나 SVG로, 결과 표를 CSV로 내보낼 수 있습니다.
    link: /ko/essentials/import-export
    linkText: 파일 및 공유
---

## 여기서 시작하십시오 {#start-here}

<div class="start-grid">

**EduBeam이 처음인가요?** [10분 빠른 시작](/ko/guide/quick-start)을 따라 해 보십시오. 단순보를 단계별로 모델링하고 모든 결과를 손 계산으로 확인합니다.

**만들고 싶은 구조물이 있나요?** [튜토리얼](/ko/tutorials/three-hinged-frame)로 바로 가거나, 미리 만들어진 [예제](/ko/examples/)를 열어 수정해 보십시오.

**강의를 하시나요?** [EduBeam으로 가르치기](/ko/guide/teaching)에서 과제용 공유 링크, 슬라이드에 넣을 수 있는 뷰어, 연습 문제를 확인하십시오.

</div>

<div class="shots">

![트러스: 축력, 인장이 양수](/screenshots/ko/tut-truss.webp)

![드러난 메커니즘: EduBeam이 왜 해석할 수 없는지 보여 줍니다](/screenshots/ko/ui-mechanism.webp)

</div>

## 모델링할 수 있는 것 {#what-you-can-model}

- 평면 내의 **보, 라멘, 트러스**: 연속보, 문형 라멘, 3힌지 아치, 핀 접합 트러스.
- **모든 종류의 지점**: 힌지, 롤러, 고정, 슬라이더, 경사 지점, 지점 침하.
- **하중**: 집중 힘과 모멘트, 등분포 및 사다리꼴 분포하중, 부재 위 어디에나 가하는 집중하중, 온도 하중.
- **모든 단면**: 라이브러리(IPE, HEA, AISC W, HSS, 직사각형, 강관)에서 고르거나 다각형으로 그리면 단면 특성이 자동으로 계산됩니다.

자세한 내용은 [소개](/ko/guide/introduction)를 참고하십시오.

<ElementariumPromo />
