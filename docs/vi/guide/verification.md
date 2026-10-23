---
description: "Kiểm tra kết quả EduBeam bằng công thức giải tích: dầm đơn giản, dầm công xôn, dầm hai đầu ngàm, dầm một đầu ngàm một đầu gối, dàn hai thanh, chênh lệch nhiệt độ và chuyển vị cưỡng bức."
---

# Kiểm tra kết quả bằng tính tay

<Edubeam /> là nơi lý tưởng để rèn thói quen mà kỹ sư nào cũng cần: đừng bao giờ tin một con số mà bạn không thể tính lại gần đúng. Trang này đưa ra các công thức giải tích cho những trường hợp kinh điển và cho thấy ứng dụng báo kết quả gì, để bạn tự dựng từng mô hình và so sánh.

Các ví dụ giải hoàn chỉnh có kiểm tra bằng tính tay nằm trong bài hướng dẫn [khung ba khớp](/vi/tutorials/three-hinged-frame) và [dàn phẳng](/vi/tutorials/truss).

Nếu không ghi khác, mọi trường hợp đều dùng cùng một tiết diện thép: $E = 210\,000$ MPa, $G = 81\,000$ MPa, $A = 28{,}5$ cm², $I_y = 1943$ cm⁴, $h = 200$ mm, $k = 1$ (IPE 200).

$$EI = 210 \times 10^9 \cdot 1{,}943 \times 10^{-5} = 4{,}080 \times 10^6\ \text{Nm}^2$$

::: tip Vì sao các con số hơi khác nhau
EduBeam dùng dầm **Timoshenko**, cộng thêm độ võng do cắt $\Delta w_s$ vào độ võng do uốn kinh điển của dầm Euler–Bernoulli. Góc xoay, phản lực và nội lực trong hệ tĩnh định không bị ảnh hưởng. Với thanh mảnh, số hạng bổ sung này rất nhỏ; các bảng dưới đây ghi riêng nó.
:::

## Dầm đơn giản, tải phân bố đều {#simply-supported-beam-uniform-load}

$L = 6$ m, $q = 12$ kN/m. Gối tựa: nút 1 `Dx + Dz`, nút 2 `Dz`.

| Đại lượng | Công thức | Giá trị | EduBeam |
| --- | --- | --- | --- |
| Phản lực | $qL/2$ | 36 kN | 36 kN |
| $V_{max}$ | $qL/2$ | 36 kN | 36 kN |
| $M_{max}$ (giữa nhịp) | $qL^2/8$ | 54 kNm | 54 kNm |
| Góc xoay tại gối | $qL^3/(24EI)$ | 0,02647 rad | 0,02647 rad |
| Độ võng giữa nhịp (uốn) | $5qL^4/(384EI)$ | 49,63 mm | — |
| Độ võng giữa nhịp (cắt) | $qL^2/(8kGA)$ | 0,23 mm | — |
| Độ võng giữa nhịp (tổng) | tổng | 49,86 mm | 49,86 mm |

Để đọc độ võng giữa nhịp, hãy thêm một nút ở giữa nhịp bằng *Thêm nút* (chuột) → **Nối vào kết cấu**; việc chia phần tử không làm thay đổi kết quả nào.

<ExampleStructure />

## Dầm công xôn, tải tại đầu tự do {#cantilever-tip-load}

$L = 4$ m, $F = 18$ kN hướng xuống tại đầu tự do. Gối tựa: nút 1 `Dx + Dz + Ry`.

| Đại lượng | Công thức | Giá trị | EduBeam |
| --- | --- | --- | --- |
| Phản lực đứng | $F$ | 18 kN | 18 kN |
| Mô men ngàm | $FL$ | 72 kNm | 72 kNm |
| Góc xoay đầu tự do | $FL^2/(2EI)$ | 0,03529 rad | 0,03529 rad |
| Độ võng đầu tự do (uốn) | $FL^3/(3EI)$ | 94,11 mm | — |
| Độ võng đầu tự do (cắt) | $FL/(kGA)$ | 0,31 mm | — |
| Độ võng đầu tự do (tổng) | tổng | 94,42 mm | 94,42 mm |

Ở đây số hạng cắt chiếm 0,3 %. Rút ngắn dầm công xôn còn 1 m thì nó tăng lên 5 % – đó chính là lý do có hệ số hiệu chỉnh cắt.

<Figure>
  <Structure :show-loads="true" show-moment show-reactions :nodes="[{label: '1', coords: [0,0,0], dofs: [0,2,4]}, {label: '2', coords: [4,0,0], dofs: []}]" :elements="[{label: '1', nodes: ['1', '2']}]" :nodal-loads="[{target: '2', values: { 0: 0, 2: 18000, 4: 0 }}]" />
  <figcaption>Dầm công xôn chịu tải 18 kN tại đầu tự do: mô men uốn và phản lực</figcaption>
</Figure>

## Dầm hai đầu ngàm, tải phân bố đều {#fixed–fixed-beam-uniform-load}

$L = 6$ m, $q = 12$ kN/m. Cả hai nút `Dx + Dz + Ry`.

| Đại lượng | Công thức | Giá trị |
| --- | --- | --- |
| Phản lực | $qL/2$ | 36 kN |
| Mô men tại gối | $qL^2/12$ | 36 kNm (âm, căng thớ trên) |
| Mô men giữa nhịp | $qL^2/24$ | 18 kNm (dương, căng thớ dưới) |
| Độ võng giữa nhịp | $qL^4/(384EI) + qL^2/(8kGA)$ | 9,93 + 0,23 = 10,16 mm |

Dựng nó từ trường hợp dầm đơn giản bằng cách đánh dấu `Ry` tại cả hai nút và xem biểu đồ mô men dịch chuyển.

## Dầm một đầu ngàm một đầu gối, tải phân bố đều {#propped-cantilever-uniform-load}

$L = 6$ m, $q = 12$ kN/m. Nút 1 `Dx + Dz + Ry`, nút 2 `Dz`.

| Đại lượng | Công thức | Giá trị |
| --- | --- | --- |
| Phản lực tại đầu ngàm | $5qL/8$ | 45 kN |
| Phản lực tại gối di động | $3qL/8$ | 27 kN |
| Mô men ngàm | $qL^2/8$ | 54 kNm (âm, căng thớ trên) |
| Mô men dương lớn nhất | $9qL^2/128$ tại $x = 5L/8$ tính từ đầu ngàm | 30,4 kNm tại 3,75 m |

Ứng dụng tự động ghi nhãn cực trị cục bộ, nên bạn đọc được cả giá trị lẫn vị trí của nó (theo vị trí dọc phần tử).

## Dàn hai thanh {#two-bar-truss}

Hai thanh đi từ các gối cố định tại `(0, 0)` và `(4, 0)` gặp nhau tại `(2, −2)` (đỉnh cao hơn 2 m), cả hai **khớp đầu thanh** được đánh dấu trên cả hai thanh, tải trọng đứng $F = 20$ kN tại đỉnh (hướng xuống, tức `Fz = 20`).

Mỗi thanh nghiêng 45°, dài $L = 2\sqrt{2}$ m. Do đối xứng, mỗi thanh chịu

$$N = -\frac{F}{2 \sin 45^\circ} = -14{,}14\ \text{kN (nén)}$$

và mỗi gối tựa chịu 10 kN theo phương đứng và ±10 kN theo phương ngang. Hãy kiểm tra lớp hiển thị **N (x)** và các phản lực.

## Chênh lệch nhiệt độ trên dầm đơn giản {#temperature-gradient-on-a-simply-supported-beam}

$L = 8$ m, $\Delta T_b - \Delta T_t = -10$ K (thớ trên nóng hơn), $\alpha = 12 \times 10^{-6}$, $h = 0{,}2$ m.

Dầm được tự do cong, nên **không có nội lực**; độ cong là

$$\kappa = \frac{\alpha\,(\Delta T_b - \Delta T_t)}{h} = \frac{12 \times 10^{-6} \cdot (-10)}{0{,}2} = -6 \times 10^{-4}\ \text{m}^{-1}$$

và độ võng giữa nhịp là $\kappa L^2 / 8 = -4{,}8$ mm (hướng lên). Bây giờ hãy chặn `Ry` ở cả hai đầu: độ cong bị ngăn lại và một mô men không đổi $M = EI\kappa = 2{,}45$ kNm xuất hiện trên toàn nhịp.

## Chuyển vị cưỡng bức {#prescribed-displacement}

Lấy [dầm một đầu ngàm một đầu gối](#propped-cantilever-uniform-load) bỏ tải trọng và đặt chuyển vị cưỡng bức `Dz = 10 mm` tại gối di động (lún gối tựa). Phản lực cần để đẩy đầu dầm công xôn xuống một đoạn $w$ là $R = 3EIw/L^3 = 0{,}567$ kN và mô men ngàm là $RL = 3{,}40$ kNm. Thêm lại tải phân bố đều và các kết quả cộng tác dụng tuyến tính.

## Mẹo khi tự kiểm tra {#tips-for-your-own-checks}

- Luôn để mắt đến **ô đơn vị**; phần lớn sai lệch là do nhầm đơn vị.
- Dùng cửa sổ **Ma trận độ cứng** để so sánh một phần tử với [sổ tay lý thuyết](/vi/elements/beam) khi học phương pháp độ cứng trực tiếp.
- Đọc số chính xác từ thẻ **Kết quả** và chú thích khi trỏ chuột, thay vì từ nhãn trên biểu đồ vốn đã được làm tròn. **Xuất CSV** hoặc **Sao chép** trong thẻ Kết quả cũng cho bạn các phản lực, sẵn sàng cho bảng tính.
- Đặt **Định dạng số** thành *Tự động* trong Cài đặt để đọc `40` thay vì `4 · 10¹`.
- Dùng **Chia sẻ mô hình** để gửi một mô hình đã kiểm tra cho đồng nghiệp hoặc giảng viên.
