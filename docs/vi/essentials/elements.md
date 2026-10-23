---
description: "Thêm phần tử dầm, đặt khớp đầu thanh và chiều phần tử, khai báo vật liệu và tiết diện trong EduBeam, kể cả tiết diện đa giác tùy chỉnh."
---

# Phần tử, vật liệu và tiết diện

## Phần tử dầm {#the-beam-element}

<Edubeam /> có một loại phần tử duy nhất: **dầm Timoshenko 2D** trong mặt phẳng x–z với ba bậc tự do ở mỗi đầu (`Dx`, `Dz`, `Ry`). Phần tử chịu lực dọc, lực cắt và mô men uốn, và có kể đến biến dạng trượt, vì vậy tiết diện có hệ số hiệu chỉnh cắt. Công thức đầy đủ có trong [sổ tay lý thuyết](/vi/elements/beam).

<TrussElement :moment="true" caption="Phần tử dầm 2D – ba bậc tự do tại mỗi nút" />

Với mô hình tuyến tính, kết quả dọc theo phần tử là chính xác, nên mỗi thanh chỉ cần một phần tử. Chỉ thêm nút trung gian ở chỗ bạn cần gối tựa, khớp, thay đổi tiết diện, hoặc một nút để đọc kết quả.

### Thêm phần tử {#adding-elements}

| Cách | Thực hiện |
| --- | --- |
| **Hộp thoại** | Thẻ *Phần tử* → nút **Thêm phần tử** thứ nhất, hoặc menu khung vẽ → *Thêm phần tử*. Chọn **Nút đầu** và **Nút cuối**, các khớp, vật liệu và tiết diện. |
| **Chuột** | Thẻ *Phần tử* → nút **Thêm phần tử** thứ hai (biểu tượng con trỏ), hoặc giữ <kbd>Ctrl</kbd> khi chọn mục trong menu khung vẽ. Nhấp vào một nút để bắt đầu, rồi vào nút tiếp theo để nối; nhấp vào vùng trống sẽ tạo nút tại đó. Tiếp tục nhấp để vẽ đường gấp khúc, và nhấn <kbd>Esc</kbd> để kết thúc. Thanh phía trên đặt **Khớp đầu** và **Khớp cuối** cho mọi phần tử bạn vẽ. Phần tử dùng vật liệu và tiết diện đầu tiên trong mô hình. |

![Hộp thoại Thêm phần tử](/screenshots/vi/qs-element.webp){.shot-md}

::: warning Vật liệu và tiết diện trước
Mỗi phần tử cần một vật liệu và một tiết diện. Nếu chưa có, vùng hiển thị sẽ báo *Chưa có vật liệu nào* / *Chưa có tiết diện nào* kèm nút **Thêm mới**.
:::

### Chiều phần tử {#element-direction}

**Trục x địa phương** hướng từ nút đầu đến nút cuối. Chiều này quan trọng với:

- tải trọng trong hệ tọa độ địa phương (khi đánh dấu **LCS**),
- *Vị trí tải tính từ nút đầu* của tải tập trung,
- thứ tự nội lực đầu phần tử (`X12, Z12, M12` ở đầu, `X21, Z21, M21` ở cuối) trong bảng kết quả.

Dùng nút đổi thứ tự giữa hai nút trong bảng *Phần tử* để đảo chiều một phần tử.

### Khớp đầu thanh {#end-hinges}

Mỗi phần tử có hai ô đánh dấu **Khớp đầu thanh**, cho đầu và cuối, trong bảng *Phần tử*. Chúng cũng có trong hộp thoại Thêm phần tử, trong bảng **Sửa phần tử** của phần tử, và trên thanh phía trên khi vẽ bằng chuột. Một khớp được đánh dấu sẽ giải phóng mô men uốn tại đầu đó, nên:

- một khớp tạo ra khớp bên trong khung hoặc dầm liên tục (mô men tại đó bằng 0);
- hai khớp tạo ra **thanh dàn** chỉ chịu lực dọc.

<TrussElement :hinges="[true, true]" caption="Khớp ở cả hai đầu → phần tử dàn" />

![Bảng Phần tử của khung ba khớp: phần tử 2 có khớp ở đầu cuối, tại nút C](/screenshots/vi/elements-table.webp)

Khi hai phần tử gặp nhau tại một nút và chỉ một trong hai có khớp, phần tử kia vẫn truyền mô men vào nút. Vì vậy hãy đặt khớp cho phần tử mà bạn muốn giải phóng, chứ không phải cho “nút”. Nếu các khớp làm kết cấu thành hệ biến hình, EduBeam sẽ khoanh tròn chúng và cho thấy kết cấu chuyển động thế nào.

### Sửa và xóa {#editing-and-deleting}

Nhấp vào một phần tử và dùng bảng của nó (**Sửa phần tử**, **Thêm tải trọng**, **Ma trận độ cứng**, **Xóa**), hoặc sửa trong bảng *Phần tử*. Xóa một phần tử cũng xóa các tải trọng của nó. **Ma trận độ cứng** mở một cửa sổ chứa ma trận độ cứng 6 × 6 của phần tử trong hệ tọa độ tổng thể (N/m, N và N·m), với các khớp đầu thanh (nếu có) đã được khử. Rất tiện để kiểm tra khi bạn tự ghép ma trận bằng tay.

## Vật liệu {#materials}

Thẻ *Vật liệu* → **Thêm vật liệu**:

| Trường | Ký hiệu | Đơn vị | Ghi chú |
| --- | --- | --- | --- |
| Mô đun đàn hồi | $E$ | đơn vị ứng suất (mặc định MPa) | Thép ≈ 210 000 MPa, bê tông ≈ 30 000 MPa, gỗ ≈ 11 000 MPa |
| Mô đun trượt | $G$ | đơn vị ứng suất | $G = E / (2(1+\nu))$; thép ≈ 81 000 MPa. Chỉ ảnh hưởng đến số hạng cắt Timoshenko. |
| Khối lượng riêng | $\rho$ | khối lượng / chiều dài³ (kg/m³, lb/ft³) | Được lưu cùng dự án. Bộ giải tĩnh không dùng đến (không có tải trọng bản thân). |
| Hệ số dãn dài do nhiệt | $\alpha$ | 1/K hoặc 1/°F | Dùng cho [tải nhiệt độ](/vi/essentials/loads#temperature-load). Thép: 12 × 10⁻⁶ /K. |

<div class="shots">

![Thêm vật liệu](/screenshots/vi/qs-material.webp)

![Thư viện vật liệu](/screenshots/vi/qs-material-library.webp)

</div>

**Thư viện vật liệu** có sẵn các vật liệu thông dụng. Nhóm phù hợp với đơn vị của bạn được liệt kê đầu tiên.

- **Kim loại:** thép kết cấu S235, S275, S355, thép không gỉ, gang, hợp kim nhôm, đồng, đồng thau, đồng thiếc, titan; thép Mỹ ASTM A992, A36, A572 Gr. 50 và HSS A500 Gr. C.
- **Bê tông:** bê tông thường và bê tông nhẹ, cấp C25/30, C30/37, C40/50, và f′c = 4 ksi và 5 ksi.
- **Gỗ:** C24, GL24h, GL32h.
- **Khác:** kính, GFRP, CFRP, HDPE, PVC, PMMA, polycarbonate.

Mở thư viện bằng nút trên thanh công cụ hoặc bằng *Hoặc chọn từ thư viện* trong hộp thoại *Thêm vật liệu*.

Không thể xóa vật liệu còn đang được phần tử sử dụng; hãy gán vật liệu khác cho các phần tử đó trước.

## Tiết diện {#cross-sections}

Thẻ *Tiết diện* → **Thêm tiết diện**:

| Trường | Ký hiệu | Đơn vị | Ghi chú |
| --- | --- | --- | --- |
| Diện tích | $A$ | đơn vị diện tích | Độ cứng dọc trục $EA$ |
| Mô men quán tính | $I_y$ | đơn vị mô men quán tính | Độ cứng chống uốn $EI_y$ đối với trục vuông góc với mặt phẳng hình vẽ |
| Chiều cao | $h$ | đơn vị kích thước tiết diện | Dùng cho tải chênh lệch nhiệt độ (độ cong $= \alpha\,\Delta T / h$) |
| Hệ số hiệu chỉnh cắt | $k$ | – | Hệ số hiệu chỉnh cắt của dầm Timoshenko: diện tích chịu cắt hiệu dụng là $kA$. Dùng `1` để gần như bỏ qua biến dạng trượt, khoảng 0,83 cho tiết diện chữ nhật, $A_{web}/A$ cho tiết diện chữ I. |

**Thư viện tiết diện** cho các giá trị gần đúng của tiết diện chữ nhật, vuông và tròn, thép hình IPE và HEA, ống RHS và CHS, và thép hình AISC W và HSS (chữ nhật và tròn). Hệ số hiệu chỉnh cắt trong thư viện tùy theo hình dạng: $h\,t_w/A$ cho chữ I, $2ht/A$ cho ống chữ nhật, 0,5 cho ống tròn, 0,833 cho chữ nhật và 0,9 cho tiết diện tròn. Hãy coi đây là giá trị ban đầu và đối chiếu với bảng tra thép hình trước khi dùng.

![Thư viện tiết diện](/screenshots/vi/sections-library.webp){.shot-lg}

### Tiết diện đa giác {#polygonal-sections}

Thẻ *Tiết diện* → **Tiết diện đa giác**, hoặc *Hoặc vẽ hình đa giác* trong hộp thoại *Thêm tiết diện*, sẽ mở trình chỉnh sửa hình dạng.

![Trình chỉnh sửa tiết diện đa giác với mẫu chữ I, các trục quán tính chính và elip quán tính](/screenshots/vi/sections-polygon.webp)

- **Bắt đầu** từ một mẫu có sẵn (chữ nhật, I, T, L, chữ U, hộp chữ nhật hoặc ống tròn, tròn) với các kích thước của nó, rồi nhấn **Áp dụng**.
- **Sửa** hình: kéo các đỉnh (chúng bắt dính theo **Bước bắt dính**), nhấp vào trung điểm cạnh để chèn đỉnh, nhấp đúp vào đỉnh để xóa, hoặc nhập tọa độ trong bảng đỉnh. **Thêm lỗ rỗng** thêm một đường bao bên trong. **Đặt tâm tại trọng tâm** dời hình sao cho trọng tâm nằm tại gốc tọa độ.
- **Đọc** diện tích $A$, trọng tâm, các mô men quán tính trung tâm $I_y$, $I_z$, $I_{yz}$, các mô men quán tính chính $I_1$, $I_2$ cùng góc trục chính $\alpha$ (từ $y$ đến trục 1), và các bán kính quán tính. Hình vẽ hiển thị elip quán tính.

Khi lưu, $A$, $I_y$ và $h$ được điền tự động từ hình dạng. Trong bảng, chúng chỉ đọc; dùng nút đa giác ở cột *Thao tác* để sửa lại hình. Hệ số hiệu chỉnh cắt $k$ vẫn do bạn nhập. Tọa độ tiết diện là hệ địa phương, thuận tay phải, với $x$ hướng ra khỏi màn hình, $y$ sang trái và $z$ xuống dưới.

Nếu hình không đối xứng qua mặt phẳng khung (ví dụ thép góc L), trình chỉnh sửa sẽ cảnh báo rằng phân tích 2D chỉ chính xác khi thanh được giữ chống chuyển vị ngang và chống xoắn trên toàn bộ chiều dài, ví dụ bởi bản sàn. Khi $I_{yz}$ đáng kể, bạn chọn độ cứng chống uốn sẽ dùng: **Được giữ ngang và chống xoắn dọc theo chiều dài** ($I_y$) hoặc **Tự do chuyển vị ngang**, có giá trị nhỏ hơn. Cả hai trường hợp đều không tính đến xoắn.

::: tip Giá trị kiểm tra nhanh
Tiết diện chữ nhật $b \times h$: $A = bh$, $I_y = bh^3/12$. Tiết diện tròn đặc đường kính $d$: $A = \pi d^2/4$, $I_y = \pi d^4/64$.
:::

Một vật liệu hay tiết diện có thể dùng chung cho bất kỳ số phần tử nào. Thay đổi một giá trị sẽ cập nhật mọi phần tử dùng nó và giải lại mô hình.
