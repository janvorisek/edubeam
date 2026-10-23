---
description: "Hướng dẫn từng bước: dựng một dàn phẳng trong EduBeam và kiểm tra lực trong các thanh bằng phương pháp tách nút và phương pháp mặt cắt. Khoảng 15 phút."
---

# Hướng dẫn: dàn phẳng

Bài hướng dẫn này dựng một dàn tĩnh định nhỏ, kiểm tra lực trong các thanh bằng phương pháp tách nút và phương pháp mặt cắt, và tìm ra một thanh không chịu lực. Bạn cần khoảng 15 phút.

![Dàn hoàn chỉnh: lực dọc và phản lực](/screenshots/vi/tut-truss.webp)

Nếu chỉ muốn khám phá, hãy [mở mô hình hoàn chỉnh](https://run.edubeam.app/?model=eyJuIjpbWyIxIixbMCwwLDBdLFswLDJdLG51bGxdLFsiMiIsWzQsMCwwXSxbXSxudWxsXSxbIjMiLFs4LDAsMF0sW10sbnVsbF0sWyI0IixbMTIsMCwwXSxbMl0sbnVsbF0sWyI1IixbNCwwLC0zXSxbXSxudWxsXSxbIjYiLFs4LDAsLTNdLFtdLG51bGxdXSwiZSI6W1siMSIsWyIxIiwiMiJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiMiIsWyIyIiwiMyJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiMyIsWyIzIiwiNCJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiNCIsWyI1IiwiNiJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiNSIsWyIxIiwiNSJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiNiIsWyIyIiwiNSJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiNyIsWyI1IiwiMyJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiOCIsWyIzIiwiNiJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiOSIsWyI2IiwiNCJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dXSwibSI6W1siMSIsNzg1MCwyMTAwMDAwMDAwMDAsODEwMDAwMDAwMDAsMC4wMDAwMTJdXSwiY3MiOltbIjEiLDAuMDAyLDAuMDAwMDAxLDAuMSwxXV0sIm5sIjpbWyIyIix7IjAiOjAsIjIiOjMwMDAwLCI0IjowfV0sWyIzIix7IjAiOjAsIjIiOjMwMDAwLCI0IjowfV1dLCJkIjpbXX0%3D&lang=vi){target="_blank"}.

## Bài toán {#the-problem}

![Hình học, gối tựa và tải trọng](/screenshots/vi/tut-truss-model.webp)

- Nhịp 12 m chia thành ba khoang 4 m, chiều cao dàn 3 m.
- Các nút thanh cánh dưới 1–4, các nút thanh cánh trên 5 và 6.
- Gối cố định tại nút 1 và gối di động tại nút 4.
- Hai tải trọng 30 kN tại các nút 2 và 3 của thanh cánh dưới.
- Các thanh thép có $A = 20$ cm².

| Nút | X [m] | Z [m] | Gối tựa | Tải trọng |
| --- | --- | --- | --- | --- |
| 1 | 0 | 0 | gối cố định | |
| 2 | 4 | 0 | | `Fz = 30` kN |
| 3 | 8 | 0 | | `Fz = 30` kN |
| 4 | 12 | 0 | gối di động | |
| 5 | 4 | −3 | | |
| 6 | 8 | −3 | | |

Các thanh: thanh cánh dưới 1–2, 2–3, 3–4; thanh cánh trên 5–6; thanh xiên đầu dàn 1–5 và 6–4; thanh đứng 2–5 và 3–6; và thanh xiên giữa 5–3.

**Dàn có tĩnh định không?** $m + r = 9 + 3 = 12 = 2j$ với $j = 6$ nút, nên có: lực trong các thanh xác định được chỉ từ điều kiện cân bằng.

## 1. Vật liệu và tiết diện {#_1-material-and-section}

1. **Xóa kết cấu** (đánh dấu *Xóa vật liệu* và *Xóa tiết diện*).
2. *Vật liệu* → **Thư viện vật liệu** → **Steel (S235)**.
3. *Tiết diện* → **Thêm tiết diện**: `Diện tích = 0,002`, `Iy = 1e-6`, `Chiều cao = 0,1`, `Hệ số hiệu chỉnh cắt = 1`. Với các thanh có khớp, chỉ diện tích là quan trọng.

## 2. Vẽ các thanh có khớp {#_2-draw-the-bars-with-hinges}

Trong EduBeam, một thanh dàn là phần tử dầm được đánh dấu **khớp ở cả hai đầu**. Công cụ vẽ bằng chuột có thể đặt chúng cho bạn:

1. Thẻ *Phần tử* → nút **Thêm phần tử** thứ hai (biểu tượng con trỏ).
2. Trên thanh thông báo ở phía trên vùng hiển thị, đánh dấu **Khớp đầu** và **Khớp cuối**. Mọi thanh bạn vẽ từ giờ đều có cả hai khớp.
3. Vẽ đường bao thành một đường gấp khúc: nhấp tại (0, 0), (4, −3), (8, −3), (12, 0), rồi quay lại dọc thanh cánh dưới: (8, 0), (4, 0), (0, 0). Nhấn <kbd>Esc</kbd>.
4. Vẽ từng thanh bên trong, nhấn <kbd>Esc</kbd> sau mỗi thanh: (4, 0) → (4, −3), (4, −3) → (8, 0), (8, 0) → (8, −3).
5. Nhấn <kbd>F</kbd> để thu vừa màn hình.

Kiểm tra bảng *Phần tử*: chín phần tử, mỗi phần tử đều được đánh dấu cả hai ô *Khớp đầu thanh*. Số hiệu nút và phần tử của bạn có thể khác với hình minh họa; điều đó không quan trọng.

## 3. Gối tựa và tải trọng {#_3-supports-and-loads}

1. Nhấp vào nút tại (0, 0) → **Gối tựa tại nút** → **Gối cố định**. Nhấp vào nút tại (12, 0) → **Gối di động**.
2. Nhấp vào nút tại (4, 0) → **Thêm tải trọng** → `Fz = 30` kN. Làm tương tự tại (8, 0).

`Fz` dương hướng xuống. Các nút của dàn được tự do xoay; EduBeam chấp nhận những nút mà mọi thanh nối vào đều có khớp và báo góc xoay của chúng bằng 0.

## 4. Kết quả {#_4-results}

Trong tùy chọn hiển thị, bỏ đánh dấu **Biến dạng** và **M<sub>y</sub> (x)** (dàn không chịu uốn) và đánh dấu **N (x)**.

![Lực dọc: kéo mang dấu dương](/screenshots/vi/tut-truss.webp)

## 5. Kiểm tra bằng tính tay {#_5-check-by-hand}

**Phản lực.** Tải trọng đối xứng, nên $R_1 = R_4 = 30$ kN hướng lên, và phản lực ngang tại gối cố định bằng không.

**Nút 1** (phương pháp tách nút). Thanh xiên đầu dàn 1–5 dài 5 m ($\sin\alpha = 3/5$, $\cos\alpha = 4/5$):

$$\sum F_z:\ N_{15} \cdot \tfrac{3}{5} = -30 \Rightarrow N_{15} = -50\ \text{kN} \qquad \sum F_x:\ N_{12} = -N_{15} \cdot \tfrac{4}{5} = 40\ \text{kN}$$

**Nút 2.** Thanh đứng 2–5 là thanh duy nhất có thể truyền tải 30 kN lên trên: $N_{25} = +30$ kN, và $N_{23} = N_{12} = 40$ kN.

**Mặt cắt qua khoang giữa.** Cắt qua các thanh 5–6, 5–3 và 2–3 và giữ phần bên trái:

- Mô men đối với nút 3: $R_1 \cdot 8 - 30 \cdot 4 + N_{56} \cdot 3 = 0 \Rightarrow N_{56} = -40$ kN.
- Lực theo phương đứng: lực cắt trong khoang là $R_1 - 30 = 0$, nên thanh xiên **5–3 không chịu lực**: $N_{53} = 0$.

| Thanh | Tính tay | EduBeam |
| --- | --- | --- |
| Thanh cánh dưới 1–2, 2–3, 3–4 | +40 kN (kéo) | 40 |
| Thanh cánh trên 5–6 | −40 kN (nén) | −40 |
| Thanh xiên đầu dàn 1–5, 6–4 | −50 kN | −50 |
| Thanh đứng 2–5, 3–6 | +30 kN | 30 |
| Thanh xiên giữa 5–3 | 0 | 0 |

Độ võng của nút 2 là 2,29 mm (*Kết quả → Kết quả tại nút*). Hãy tính lại nó bằng nguyên lý công khả dĩ, $\delta = \sum N n L / (EA)$, như một bài tập.

## 6. Thử nghiệm {#_6-experiment}

- **Di chuyển một tải trọng.** Đặt cả hai tải 30 kN tại nút 2. Lúc này thanh xiên giữa có chịu lực: mang dấu gì, và vì sao?
- **Xóa thanh xiên giữa.** Dàn trở thành hệ biến hình; EduBeam khoanh tròn các khớp gây ra nó và cho thấy khoang dàn bị trượt lệch thế nào.
- **Bỏ đánh dấu mọi khớp.** Dàn trở thành khung có nút cứng. Đánh dấu **M<sub>y</sub> (x)**: mô men uốn rất nhỏ so với lực dọc, đó là lý do giả thiết nút khớp vẫn dùng được.
- **Đổi cả hai gối thành gối cố định.** Thêm một phản lực làm dàn trở thành siêu tĩnh, và lực trong thanh cánh dưới khi đó phụ thuộc vào diện tích các thanh.
