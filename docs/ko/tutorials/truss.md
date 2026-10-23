---
description: "단계별 튜토리얼: EduBeam에서 평면 트러스를 만들고 절점법과 단면법으로 부재력을 검증합니다. 약 15분 소요."
---

# 튜토리얼: 평면 트러스

이 튜토리얼에서는 작은 정정 트러스를 만들고, 절점법과 단면법으로 부재력을 검증하며, 영부재를 찾아봅니다. 약 15분이 걸립니다.

![완성된 트러스: 축력과 반력](/screenshots/ko/tut-truss.webp)

둘러보기만 하려면 [완성된 모델을 여십시오](https://run.edubeam.app/?model=eyJuIjpbWyIxIixbMCwwLDBdLFswLDJdLG51bGxdLFsiMiIsWzQsMCwwXSxbXSxudWxsXSxbIjMiLFs4LDAsMF0sW10sbnVsbF0sWyI0IixbMTIsMCwwXSxbMl0sbnVsbF0sWyI1IixbNCwwLC0zXSxbXSxudWxsXSxbIjYiLFs4LDAsLTNdLFtdLG51bGxdXSwiZSI6W1siMSIsWyIxIiwiMiJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiMiIsWyIyIiwiMyJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiMyIsWyIzIiwiNCJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiNCIsWyI1IiwiNiJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiNSIsWyIxIiwiNSJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiNiIsWyIyIiwiNSJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiNyIsWyI1IiwiMyJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiOCIsWyIzIiwiNiJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiOSIsWyI2IiwiNCJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dXSwibSI6W1siMSIsNzg1MCwyMTAwMDAwMDAwMDAsODEwMDAwMDAwMDAsMC4wMDAwMTJdXSwiY3MiOltbIjEiLDAuMDAyLDAuMDAwMDAxLDAuMSwxXV0sIm5sIjpbWyIyIix7IjAiOjAsIjIiOjMwMDAwLCI0IjowfV0sWyIzIix7IjAiOjAsIjIiOjMwMDAwLCI0IjowfV1dLCJkIjpbXX0%3D&lang=ko){target="_blank"}.

## 문제 {#the-problem}

![형상, 지점, 하중](/screenshots/ko/tut-truss-model.webp)

- 경간 12 m를 4 m 패널 3개로 나누고, 높이는 3 m입니다.
- 하현재 절점 1–4, 상현재 절점 5와 6.
- 절점 1은 힌지, 절점 4는 롤러.
- 하현재 절점 2와 3에 각각 30 kN 하중.
- 단면적 $A = 20$ cm²인 강재 부재.

| 절점 | X [m] | Z [m] | 지점 | 하중 |
| --- | --- | --- | --- | --- |
| 1 | 0 | 0 | 힌지 | |
| 2 | 4 | 0 | | `Fz = 30` kN |
| 3 | 8 | 0 | | `Fz = 30` kN |
| 4 | 12 | 0 | 롤러 | |
| 5 | 4 | −3 | | |
| 6 | 8 | −3 | | |

부재: 하현재 1–2, 2–3, 3–4; 상현재 5–6; 단부 사재 1–5와 6–4; 수직재 2–5와 3–6; 가운데 사재 5–3.

**정정인가요?** 절점 수 $j = 6$일 때 $m + r = 9 + 3 = 12 = 2j$이므로 정정입니다. 부재력은 평형 조건만으로 구할 수 있습니다.

## 1. 재료와 단면 {#_1-material-and-section}

1. **구조물 지우기**(*재료 삭제*와 *단면 삭제* 체크).
2. *재료* → **재료 라이브러리** → **Steel (S235)**.
3. *단면* → **단면 추가**: `단면적 = 0.002`, `Iy = 1e-6`, `높이 = 0.1`, `전단 보정계수 = 1`. 양단이 힌지인 부재에서는 단면적만 결과에 영향을 줍니다.

## 2. 힌지가 있는 부재 그리기 {#_2-draw-the-bars-with-hinges}

EduBeam에서 트러스 부재는 **양쪽 단부 힌지**를 모두 체크한 보 요소입니다. 마우스 도구로 그리면 이를 자동으로 설정할 수 있습니다.

1. *요소* 탭 → 두 번째 **요소 추가** 버튼(커서 아이콘).
2. 뷰어 위쪽의 배너에서 **시작단 힌지**와 **끝단 힌지**를 체크합니다. 이제 그리는 모든 부재에 두 힌지가 들어갑니다.
3. 외곽을 폴리라인 하나로 그립니다. (0, 0), (4, −3), (8, −3), (12, 0)을 클릭한 다음 하현을 따라 (8, 0), (4, 0), (0, 0)으로 돌아옵니다. <kbd>Esc</kbd>를 누릅니다.
4. 내부 부재를 하나씩 그리고, 하나를 그릴 때마다 <kbd>Esc</kbd>를 누릅니다: (4, 0) → (4, −3), (4, −3) → (8, 0), (8, 0) → (8, −3).
5. <kbd>F</kbd>를 눌러 화면에 맞춥니다.

*요소* 표를 확인하십시오. 요소가 9개이고 모두 *단부 힌지* 두 칸이 체크되어 있어야 합니다. 절점과 요소 번호는 그림과 다를 수 있지만 상관없습니다.

## 3. 지점과 하중 {#_3-supports-and-loads}

1. (0, 0)의 절점을 클릭 → **지점 조건** → **힌지**. (12, 0)의 절점을 클릭 → **롤러**.
2. (4, 0)의 절점을 클릭 → **하중 추가** → `Fz = 30` kN. (8, 0)에서도 같은 작업을 합니다.

양의 `Fz`는 아래를 향합니다. 트러스의 절점은 자유롭게 회전할 수 있습니다. EduBeam은 모든 부재가 힌지로 연결된 절점도 허용하며, 그 회전각은 0으로 표시합니다.

## 4. 결과 {#_4-results}

표시 옵션에서 **변형 형상**과 **M<sub>y</sub> (x)**의 체크를 해제하고(트러스에는 휨이 없습니다) **N (x)**를 체크합니다.

![축력: 인장이 양수](/screenshots/ko/tut-truss.webp)

## 5. 손 계산으로 검증 {#_5-check-by-hand}

**반력.** 하중이 대칭이므로 $R_1 = R_4 = 30$ kN(위 방향)이고, 힌지 지점의 수평 반력은 0입니다.

**절점 1**(절점법). 단부 사재 1–5의 길이는 5 m입니다($\sin\alpha = 3/5$, $\cos\alpha = 4/5$).

$$\sum F_z:\ N_{15} \cdot \tfrac{3}{5} = -30 \Rightarrow N_{15} = -50\ \text{kN} \qquad \sum F_x:\ N_{12} = -N_{15} \cdot \tfrac{4}{5} = 40\ \text{kN}$$

**절점 2.** 30 kN 하중을 위로 전달할 수 있는 부재는 수직재 2–5뿐이므로 $N_{25} = +30$ kN이고, $N_{23} = N_{12} = 40$ kN입니다.

**가운데 패널을 지나는 단면.** 부재 5–6, 5–3, 2–3을 자르고 왼쪽 부분을 취합니다.

- 절점 3에 대한 모멘트: $R_1 \cdot 8 - 30 \cdot 4 + N_{56} \cdot 3 = 0 \Rightarrow N_{56} = -40$ kN.
- 연직 방향 힘: 패널의 전단력이 $R_1 - 30 = 0$이므로 사재 **5–3에는 힘이 작용하지 않습니다**: $N_{53} = 0$.

| 부재 | 손 계산 값 | EduBeam |
| --- | --- | --- |
| 하현재 1–2, 2–3, 3–4 | +40 kN (인장) | 40 |
| 상현재 5–6 | −40 kN (압축) | −40 |
| 단부 사재 1–5, 6–4 | −50 kN | −50 |
| 수직재 2–5, 3–6 | +30 kN | 30 |
| 가운데 사재 5–3 | 0 | 0 |

절점 2의 처짐은 2.29 mm입니다(*결과 → 절점 결과*). 연습 삼아 가상일 $\delta = \sum N n L / (EA)$로 계산해 보십시오.

## 6. 실험해 보기 {#_6-experiment}

- **하중 하나를 옮깁니다.** 30 kN 하중 두 개를 모두 절점 2에 둡니다. 이제 가운데 사재에 힘이 생깁니다. 부호는 무엇이고, 왜 그럴까요?
- **가운데 사재를 삭제합니다.** 트러스는 메커니즘이 됩니다. EduBeam이 원인이 되는 힌지에 원을 그리고 패널이 어떻게 전단 변형되는지 보여 줍니다.
- **모든 힌지의 체크를 해제합니다.** 트러스가 강절점 라멘이 됩니다. **M<sub>y</sub> (x)**를 체크하면 휨모멘트가 축력에 비해 아주 작다는 것을 알 수 있습니다. 그래서 핀 절점 이상화가 유효합니다.
- **두 지점을 모두 힌지로 바꿉니다.** 반력이 하나 늘어 부정정이 되고, 이제 하현재의 부재력이 부재 단면적에 따라 달라집니다.
