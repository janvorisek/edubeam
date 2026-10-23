---
description: "EduBeam에서 클릭 한 번으로 열리는 보, 라멘, 트러스의 해석 완료 모델과 연습 문제 제안, 풀이 튜토리얼."
---

# 예제

아래의 카드는 모두 해석이 끝난 실시간 모델입니다. 카드를 클릭하면 모든 설정이 갖춰진 편집 가능한 상태로 <Edubeam />에서 열립니다. 그런 다음 절점을 드래그하거나, 하중을 바꾸거나, 힌지를 체크하고 다이어그램이 어떻게 따라 바뀌는지 보십시오.

<br>

<FeatureStructures />

같은 모델은 앱의 **☰ → 예제**에도 있으며, [run.edubeam.app/?panel=examples](https://run.edubeam.app/?panel=examples&lang=ko){target="_blank"}를 열면 이 갤러리가 바로 열립니다.

## 연습 문제 제안 {#suggested-exercises}

- **부정정보**: 고정단의 `Ry` 체크를 해제해 단순보로 만듭니다. 경간 중앙 모멘트는 얼마나 커질까요?
- **캔틸레버**: 자유단 처짐을 $FL^3/3EI$와 비교한 다음([손 계산으로 결과 검증](/ko/guide/verification) 참고), *단면* 탭에서 $I_y$를 절반으로 줄여 봅니다.
- **프랫 트러스**: 이 예제의 절점은 강절점입니다. 모든 부재의 양쪽 단부 힌지를 체크해 진짜 트러스로 만든 다음 축력을 비교합니다. 이제 사재 하나를 삭제해 보십시오. 트러스가 여전히 서 있을까요?
- **3경간 연속보**: 보는 양 끝에서만 지지되어 있습니다. 내부 절점 B와 C에서 `Dz`를 체크해 연속보로 만들고, 지점 위에 부모멘트가 생기는 것을 보십시오.
- **문형 라멘**: 보의 양쪽 단부 힌지를 체크해 보–기둥 핀 접합을 모델링하거나, 오른쪽 지점을 롤러 대신 힌지로 바꿔 봅니다.
- **온도 하중**: 두 지점에서 `Dx`를 구속하고 축력이 생기는 것을 보십시오.

## 풀이 튜토리얼 {#worked-tutorials}

- [3힌지 라멘](/ko/tutorials/three-hinged-frame): 반력, N, V, M을 손 계산으로 검증합니다.
- [평면 트러스](/ko/tutorials/truss): 절점법, 단면법, 그리고 영부재.

## 예제 기여하기 {#contribute-an-example}

수업에 좋은 모델이 있나요? [GitHub Discussions](https://github.com/janvorisek/edubeam/discussions)나 [Twitter](https://twitter.com/EdubeamApp)에 링크로 공유해 주시면 갤러리에 추가하겠습니다.
