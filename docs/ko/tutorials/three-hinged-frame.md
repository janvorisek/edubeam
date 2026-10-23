---
description: "단계별 튜토리얼: EduBeam에서 등분포하중을 받는 3힌지 라멘을 모델링하고, 반력과 휨모멘트를 손 계산으로 검증합니다. 약 15분 소요."
---

# 튜토리얼: 3힌지 라멘

3힌지 라멘은 정정 구조물입니다. 평형 방정식 3개와 힌지에서 $M = 0$이라는 조건으로 지점 반력 4개를 모두 구할 수 있습니다. 그래서 EduBeam이 그리는 모든 숫자를 검증하기에 아주 좋은 모델입니다. 약 15분이 걸립니다.

![완성된 라멘: 휨모멘트와 반력](/screenshots/ko/tut-frame-moment.webp)

둘러보기만 하려면 [완성된 모델을 여십시오](https://run.edubeam.app/?model=eyJuIjpbWyJBIixbMCwwLDBdLFswLDJdLG51bGxdLFsiQiIsWzAsMCwtNF0sW10sbnVsbF0sWyJDIixbNCwwLC00XSxbXSxudWxsXSxbIkQiLFs4LDAsLTRdLFtdLG51bGxdLFsiRSIsWzgsMCwwXSxbMCwyXSxudWxsXV0sImUiOltbIjEiLFsiQSIsIkIiXSwiMSIsIjEiLFtmYWxzZSxmYWxzZV1dLFsiMiIsWyJCIiwiQyJdLCIxIiwiMSIsW2ZhbHNlLHRydWVdXSxbIjMiLFsiQyIsIkQiXSwiMSIsIjEiLFtmYWxzZSxmYWxzZV1dLFsiNCIsWyJEIiwiRSJdLCIxIiwiMSIsW2ZhbHNlLGZhbHNlXV1dLCJtIjpbWyIxIiw3ODUwLDIxMDAwMDAwMDAwMCw4MTAwMDAwMDAwMCwwLjAwMDAxMl1dLCJjcyI6W1siMSIsMC4wMDUzOCwwLjAwMDA4MzU2LDAuMywxXV0sImVsIjpbWyIyIixbMCwxMDAwMF0sZmFsc2VdLFsiMyIsWzAsMTAwMDBdLGZhbHNlXV0sImQiOltdfQ%3D%3D&lang=ko){target="_blank"}.

## 문제 {#the-problem}

- 간격 8 m, 높이 4 m의 기둥 두 개. 기둥 하단 A와 E는 힌지 지점입니다.
- 기둥 위에 수평 보 B–D가 있고, 경간 중앙 C에 힌지가 있습니다.
- 보 전체에 등분포하중 $q = 10$ kN/m가 작용합니다.
- 강재($E = 210$ GPa, $G = 81$ GPa), IPE 300($A = 53.8$ cm², $I_y = 8356$ cm⁴, $h = 300$ mm).

| 절점 | X [m] | Z [m] | 지점 |
| --- | --- | --- | --- |
| A | 0 | 0 | 힌지 |
| B | 0 | −4 | |
| C | 4 | −4 | (보의 힌지) |
| D | 8 | −4 | |
| E | 8 | 0 | 힌지 |

**z축은 아래를 향하므로** 기둥 꼭대기는 `Z = −4`에 있다는 점을 기억하십시오.

## 1. 재료와 단면 {#_1-material-and-section}

1. **구조물 지우기**(*재료 삭제*와 *단면 삭제* 체크).
2. *재료* → **재료 라이브러리** → **Steel (S235)**.
3. *단면* → **단면 추가**: `단면적 = 0.00538`, `Iy = 8.356e-5`, `높이 = 0.3`, `전단 보정계수 = 1`.

단면은 변위에만 영향을 줍니다. 이 라멘은 정정 구조물이므로 부재력은 $E$, $A$, $I$와 전혀 관계가 없습니다.

## 2. 라멘 그리기 {#_2-draw-the-frame}

가장 빠른 방법은 마우스로 폴리라인을 한 번에 그리는 것입니다.

1. **그리드 스냅**이 켜져 있는지 확인합니다(**S** 칩).
2. *요소* 탭 → 두 번째 **요소 추가** 버튼(커서 아이콘).
3. (0, 0)을 클릭한 다음 (0, −4), (4, −4), (8, −4), (8, 0)을 차례로 클릭합니다. 눈금자와 십자선을 보며 위치를 찾으십시오. 클릭할 때마다 절점이 추가되고 이전 절점과 연결됩니다.
4. <kbd>Esc</kbd>를 눌러 마치고, <kbd>F</kbd>를 눌러 라멘을 화면에 맞춥니다.

이제 절점 5개와 요소 4개가 생겼습니다. 이 페이지의 그림에서는 절점 이름을 A–E로 붙였습니다. 원한다면 *절점* 표에서 이름을 바꾸거나 1–5를 그대로 써도 됩니다. 표에서 좌표를 확인하고 그리드에서 벗어난 점이 있으면 고치십시오.

## 3. 지점과 힌지 {#_3-supports-and-the-hinge}

1. 절점 A를 클릭하고 **지점 조건**을 열어 **힌지**를 고릅니다. 절점 E도 같은 방법으로 설정합니다.
2. *요소* 표에서 B에서 C로 가는 요소를 찾아 **끝단** 힌지(*단부 힌지*의 두 번째 칸)를 체크합니다.

![요소 표: 힌지는 요소 2의 끝단, 즉 절점 C에 있습니다](/screenshots/ko/elements-table.webp)

::: tip 힌지는 두 개가 아니라 하나
요소 B–C의 끝단에만 힌지를 넣으면 충분합니다. 그러면 C의 모멘트가 0이 되는데, 절점 C에 강결된 부재가 C–D 하나뿐이어서 C–D가 그 절점으로 모멘트를 전달할 수 없기 때문입니다. C–D의 시작단에도 힌지를 체크해도 달라지는 것은 없습니다. 하지만 B에도 힌지를 넣으면 라멘은 메커니즘이 됩니다. 직접 해 보십시오. EduBeam이 어떻게 움직이는지 보여 줍니다.
:::

## 4. 하중 {#_4-load}

*하중* → **요소 하중 추가** → *등분포하중*, 요소 B–C, `fz = 10` kN/m. 요소 C–D에도 같은 하중을 반복합니다. 보가 수평이므로 여기서는 LCS 체크박스가 결과에 영향을 주지 않습니다.

## 5. 결과 {#_5-results}

표시 옵션은 처음에 변형 형상, 휨모멘트, 반력이 켜진 상태로 시작합니다. 나머지를 보려면 **N (x)**와 **V<sub>z</sub> (x)**를 체크하십시오.

<div class="shots">

![휨모멘트와 반력](/screenshots/ko/tut-frame-moment.webp)

![축력](/screenshots/ko/tut-frame-normal.webp)

![전단력](/screenshots/ko/results-shear.webp)

![변형 형상](/screenshots/ko/results-deformed.webp)

</div>

## 6. 손 계산으로 검증 {#_6-check-by-hand}

**연직 반력.** 대칭이므로 각 하단 지점이 하중의 절반씩 받습니다.

$$V_A = V_E = \frac{q \cdot 8}{2} = 40\ \text{kN}$$

**수평 반력.** 라멘의 왼쪽 절반에 대해 힌지 C에서 모멘트를 취합니다. 그곳의 모멘트는 0이어야 합니다.

$$V_A \cdot 4 - H_A \cdot 4 - q \cdot 4 \cdot 2 = 0 \quad\Rightarrow\quad H_A = \frac{160 - 80}{4} = 20\ \text{kN}$$

두 하단 지점 모두 안쪽으로 20 kN씩 밀어 줍니다. 이 수평 추력 덕분에 3힌지 라멘이 효율적인 구조가 됩니다.

**부재력.**

| 물리량 | 공식 | 손 계산 값 | EduBeam |
| --- | --- | --- | --- |
| 연직 반력 | $qL/2$ | 40 kN | 40 kN |
| 수평 반력 | $M_C = 0$에서 | 20 kN | 20 kN |
| 모서리 B와 D의 모멘트 | $H \cdot h$ | 80 kNm, 바깥쪽 인장 | −80 kNm |
| 힌지 C의 모멘트 | | 0 | 0 |
| 기둥의 축력 | $-V_A$ | −40 kN | −40 kN |
| 보의 축력 | $-H_A$ | −20 kN | −20 kN |
| 기둥의 전단력 | $H_A$ | 20 kN | −20 kN (A–B), +20 kN (D–E) |
| B에서 보의 전단력 | $V_A$ | 40 kN | 40 kN |
| C에서 보의 전단력 | $V_A - 4q$ | 0 | 0 |
| D에서 보의 전단력 | $V_A - 8q$ | −40 kN | −40 kN |

두 기둥은 같은 크기의 힘을 받지만 전단력의 부호가 반대입니다. 각 요소의 국부 좌표축이 요소의 방향을 따르는데, A–B는 위쪽으로, D–E는 아래쪽으로 그려졌기 때문입니다. 한 기둥의 절점 순서를 바꾸면 부호가 뒤집힙니다.

보에서는 $M(x) = -80 + 40x - 5x^2$ kNm(x는 B에서부터)이며, 힌지에서 0이 되고 양수가 되는 곳은 없습니다. 즉 보 전체가 부모멘트를 받습니다. 전단력 $V(x) = 40 - 10x$는 정확히 C에서 0이 되므로 모멘트의 극값도 힌지에 있습니다.

**변위.** 힌지 C는 43.1 mm 내려갑니다(*결과 → 절점 결과*, C의 `Dz`). 이 값은 네 부재 모두의 휨에서 비롯되며, 가상일의 원리를 연습하기에 좋은 문제입니다.

## 7. 실험해 보기 {#_7-experiment}

- C의 **힌지를 해제**합니다. 라멘은 1차 부정정이 되고, 모서리 모멘트가 줄며 경간 중앙에 정모멘트가 생깁니다. 이제는 단면이 결과에 영향을 줍니다. 더 강한 보로 바꿔 보십시오.
- **하단을 고정**합니다(**고정** 지점 선택). A와 E에 모멘트가 생깁니다.
- **수평 하중을 추가**합니다. B에 절점 하중 `Fx = 10` kN을 가합니다. 라멘이 횡으로 변위하고 반력은 더 이상 대칭이 아닙니다. 같은 평형 방정식 3개와 $M_C = 0$으로 확인해 보십시오.
- **B에도 힌지를 체크**합니다. 이제 라멘은 메커니즘이 되며, EduBeam이 어떻게 움직일 수 있는지 애니메이션으로 보여 줍니다.
