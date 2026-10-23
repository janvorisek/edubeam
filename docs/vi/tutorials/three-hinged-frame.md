---
description: "Hướng dẫn từng bước: mô hình hóa khung ba khớp chịu tải phân bố đều trong EduBeam, rồi kiểm tra phản lực và mô men uốn bằng tính tay. Khoảng 15 phút."
---

# Hướng dẫn: khung ba khớp

Khung ba khớp là hệ tĩnh định: ba phương trình cân bằng cộng với điều kiện $M = 0$ tại khớp cho ra cả bốn thành phần phản lực. Vì vậy đây là mô hình lý tưởng để kiểm tra mọi con số EduBeam vẽ ra. Bạn cần khoảng 15 phút.

![Khung hoàn chỉnh: mô men uốn và phản lực](/screenshots/vi/tut-frame-moment.webp)

Nếu chỉ muốn khám phá, hãy [mở mô hình hoàn chỉnh](https://run.edubeam.app/?model=eyJuIjpbWyJBIixbMCwwLDBdLFswLDJdLG51bGxdLFsiQiIsWzAsMCwtNF0sW10sbnVsbF0sWyJDIixbNCwwLC00XSxbXSxudWxsXSxbIkQiLFs4LDAsLTRdLFtdLG51bGxdLFsiRSIsWzgsMCwwXSxbMCwyXSxudWxsXV0sImUiOltbIjEiLFsiQSIsIkIiXSwiMSIsIjEiLFtmYWxzZSxmYWxzZV1dLFsiMiIsWyJCIiwiQyJdLCIxIiwiMSIsW2ZhbHNlLHRydWVdXSxbIjMiLFsiQyIsIkQiXSwiMSIsIjEiLFtmYWxzZSxmYWxzZV1dLFsiNCIsWyJEIiwiRSJdLCIxIiwiMSIsW2ZhbHNlLGZhbHNlXV1dLCJtIjpbWyIxIiw3ODUwLDIxMDAwMDAwMDAwMCw4MTAwMDAwMDAwMCwwLjAwMDAxMl1dLCJjcyI6W1siMSIsMC4wMDUzOCwwLjAwMDA4MzU2LDAuMywxXV0sImVsIjpbWyIyIixbMCwxMDAwMF0sZmFsc2VdLFsiMyIsWzAsMTAwMDBdLGZhbHNlXV0sImQiOltdfQ%3D%3D&lang=vi){target="_blank"}.

## Bài toán {#the-problem}

- Hai cột cao 4 m, chân cột A và E là gối cố định, cách nhau 8 m.
- Một dầm ngang B–D ở trên, có khớp tại C ở giữa nhịp.
- Tải phân bố đều $q = 10$ kN/m trên toàn bộ dầm.
- Thép ($E = 210$ GPa, $G = 81$ GPa), IPE 300 ($A = 53{,}8$ cm², $I_y = 8356$ cm⁴, $h = 300$ mm).

| Nút | X [m] | Z [m] | Gối tựa |
| --- | --- | --- | --- |
| A | 0 | 0 | gối cố định |
| B | 0 | −4 | |
| C | 4 | −4 | (khớp trong dầm) |
| D | 8 | −4 | |
| E | 8 | 0 | gối cố định |

Hãy nhớ rằng **trục z hướng xuống**, nên đỉnh cột nằm tại `Z = −4`.

## 1. Vật liệu và tiết diện {#_1-material-and-section}

1. **Xóa kết cấu** (đánh dấu *Xóa vật liệu* và *Xóa tiết diện*).
2. *Vật liệu* → **Thư viện vật liệu** → **Steel (S235)**.
3. *Tiết diện* → **Thêm tiết diện**: `Diện tích = 0,00538`, `Iy = 8,356e-5`, `Chiều cao = 0,3`, `Hệ số hiệu chỉnh cắt = 1`.

Tiết diện chỉ ảnh hưởng đến chuyển vị. Khung này là hệ tĩnh định, nên nội lực của nó hoàn toàn không phụ thuộc vào $E$, $A$ hay $I$.

## 2. Vẽ khung {#_2-draw-the-frame}

Cách nhanh nhất là vẽ một đường gấp khúc bằng chuột:

1. Đảm bảo **Bắt dính lưới** đang bật (nút **S**).
2. Thẻ *Phần tử* → nút **Thêm phần tử** thứ hai (biểu tượng con trỏ).
3. Nhấp lần lượt tại (0, 0), rồi (0, −4), (4, −4), (8, −4) và (8, 0). Dựa vào thước và dấu thập để tìm các điểm. Mỗi lần nhấp sẽ thêm một nút và nối nó với nút trước.
4. Nhấn <kbd>Esc</kbd> để kết thúc, rồi <kbd>F</kbd> để thu khung vừa màn hình.

Bây giờ bạn có năm nút và bốn phần tử. Hình minh họa ở đây đặt nhãn nút là A–E; bạn có thể đổi tên nút trong bảng *Nút* nếu muốn, hoặc giữ 1–5. Kiểm tra tọa độ trong bảng và sửa những nút bị lệch khỏi lưới.

## 3. Gối tựa và khớp {#_3-supports-and-the-hinge}

1. Nhấp vào nút A, mở **Gối tựa tại nút** và chọn **Gối cố định**. Làm tương tự với nút E.
2. Trong bảng *Phần tử*, tìm phần tử từ B đến C và đánh dấu khớp ở **cuối** của nó (ô thứ hai trong *Khớp đầu thanh*).

![Bảng Phần tử: khớp nằm ở cuối phần tử 2, tại nút C](/screenshots/vi/elements-table.webp)

::: tip Một khớp, không phải hai
Đặt khớp ở cuối phần tử B–C là đủ: khi đó mô men tại C bằng không, vì C–D không thể truyền mô men vào một nút mà chỉ riêng nó liên kết cứng. Đánh dấu thêm đầu của C–D cũng không thay đổi gì. Nhưng nếu đánh dấu thêm khớp tại B, khung sẽ thành hệ biến hình. Hãy thử xem: EduBeam sẽ cho bạn thấy nó chuyển động thế nào.
:::

## 4. Tải trọng {#_4-load}

*Tải trọng* → **Thêm tải phần tử** → *Tải phân bố đều*, phần tử B–C, `fz = 10` kN/m. Lặp lại cho phần tử C–D. Dầm nằm ngang, nên ô LCS ở đây không tạo ra khác biệt.

## 5. Kết quả {#_5-results}

Ban đầu, tùy chọn hiển thị bật sẵn sơ đồ biến dạng, mô men uốn và phản lực. Đánh dấu **N (x)** và **V<sub>z</sub> (x)** để xem các biểu đồ còn lại.

<div class="shots">

![Mô men uốn và phản lực](/screenshots/vi/tut-frame-moment.webp)

![Lực dọc](/screenshots/vi/tut-frame-normal.webp)

![Lực cắt](/screenshots/vi/results-shear.webp)

![Sơ đồ biến dạng](/screenshots/vi/results-deformed.webp)

</div>

## 6. Kiểm tra bằng tính tay {#_6-check-by-hand}

**Phản lực đứng.** Do đối xứng, mỗi chân cột chịu một nửa tải trọng:

$$V_A = V_E = \frac{q \cdot 8}{2} = 40\ \text{kN}$$

**Phản lực ngang.** Lấy mô men đối với khớp C cho nửa trái của khung. Mô men tại đó phải bằng không:

$$V_A \cdot 4 - H_A \cdot 4 - q \cdot 4 \cdot 2 = 0 \quad\Rightarrow\quad H_A = \frac{160 - 80}{4} = 20\ \text{kN}$$

Cả hai chân cột đều đẩy vào trong 20 kN; chính lực xô ngang này làm cho khung ba khớp làm việc hiệu quả.

**Nội lực.**

| Đại lượng | Công thức | Tính tay | EduBeam |
| --- | --- | --- | --- |
| Phản lực đứng | $qL/2$ | 40 kN | 40 kN |
| Phản lực ngang | từ $M_C = 0$ | 20 kN | 20 kN |
| Mô men tại góc khung B và D | $H \cdot h$ | 80 kNm, căng thớ ngoài | −80 kNm |
| Mô men tại khớp C | | 0 | 0 |
| Lực dọc trong cột | $-V_A$ | −40 kN | −40 kN |
| Lực dọc trong dầm | $-H_A$ | −20 kN | −20 kN |
| Lực cắt trong cột | $H_A$ | 20 kN | −20 kN (A–B), +20 kN (D–E) |
| Lực cắt trong dầm tại B | $V_A$ | 40 kN | 40 kN |
| Lực cắt trong dầm tại C | $V_A - 4q$ | 0 | 0 |
| Lực cắt trong dầm tại D | $V_A - 8q$ | −40 kN | −40 kN |

Hai cột có dấu lực cắt ngược nhau dù chịu cùng một lực, vì trục địa phương của mỗi phần tử theo hướng của nó: A–B được vẽ hướng lên còn D–E hướng xuống. Đổi thứ tự nút của một cột và dấu của nó sẽ đổi.

Trong dầm, $M(x) = -80 + 40x - 5x^2$ kNm (x tính từ B), bằng không tại khớp và không bao giờ dương: toàn bộ dầm chịu mô men âm (căng thớ trên). Lực cắt $V(x) = 40 - 10x$ giảm về không đúng tại C, nên cực trị của mô men cũng nằm tại khớp.

**Chuyển vị.** Khớp C lún xuống 43,1 mm (*Kết quả → Kết quả tại nút*, `Dz` của C). Chuyển vị này đến từ sự uốn của cả bốn thanh và là một bài tập hay cho nguyên lý công khả dĩ.

## 7. Thử nghiệm {#_7-experiment}

- **Bỏ đánh dấu khớp** tại C. Khung trở thành siêu tĩnh bậc một; mô men tại góc khung giảm và xuất hiện mô men dương ở giữa nhịp. Lúc này tiết diện có ảnh hưởng: hãy thử một dầm cứng hơn.
- **Ngàm chân cột** (chọn gối **Ngàm**). Xuất hiện mô men tại A và E.
- **Thêm tải trọng ngang**: một tải trọng nút `Fx = 10` kN tại B. Khung chuyển vị ngang, và các phản lực không còn đối xứng. Kiểm tra chúng bằng chính ba phương trình đó cùng với $M_C = 0$.
- **Đánh dấu thêm khớp tại B.** Khung bây giờ là hệ biến hình, và EduBeam tạo hoạt ảnh cho thấy nó có thể chuyển động thế nào.
