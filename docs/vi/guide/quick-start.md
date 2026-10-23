---
description: "Trong khoảng mười phút, mô hình hóa một dầm thép đơn giản chịu tải phân bố đều, đọc phản lực, lực cắt và mô men uốn, rồi kiểm tra lại bằng tính tay."
---

# Bắt đầu nhanh

Trong khoảng mười phút, bạn sẽ mô hình hóa một dầm thép đơn giản chịu tải phân bố đều, đọc phản lực, lực cắt và mô men uốn, rồi đối chiếu với các công thức trong giáo trình.

::: tip Làm theo ngay trong ứng dụng
Mở [run.edubeam.app](https://run.edubeam.app/?lang=vi){target="_blank"} trong một thẻ thứ hai. Nếu đã có sẵn một mô hình, hãy dùng **Xóa kết cấu** trên thanh ứng dụng để bắt đầu từ trang trống, và đánh dấu *Xóa vật liệu* và *Xóa tiết diện* để bắt đầu hoàn toàn từ đầu. Thao tác xóa có thể hoàn tác bằng <kbd>Ctrl</kbd>+<kbd>Z</kbd>, và mô hình cũ vẫn được giữ trong **☰ → Kết cấu gần đây**.

Bạn thích vừa làm vừa xem gợi ý trên màn hình? **☰ → Vẽ dầm đầu tiên** sẽ hướng dẫn bạn vẽ một dầm tương tự bằng chuột.
:::

## Bài toán {#the-problem}

<ExampleStructure />

Một dầm đơn giản dài 6 m (gối cố định bên trái, gối di động bên phải) chịu tải phân bố đều 12 kN/m. Vật liệu: thép, $E = 210\ \text{GPa}$, $G = 81\ \text{GPa}$. Tiết diện: IPE 200, $A = 28{,}5\ \text{cm}^2$, $I_y = 1943\ \text{cm}^4$, $h = 200\ \text{mm}$.

## 1. Kiểm tra đơn vị {#_1-check-the-units}

Ô đơn vị ở góc dưới bên phải vùng hiển thị cho biết đơn vị mà mọi ô nhập liệu và kết quả đang dùng. Bài hướng dẫn này dùng đơn vị SI mặc định: mét, kN, kNm và MPa.

![Các nút bật/tắt lưới (G), bắt dính (S), dấu thập và ô đơn vị](/screenshots/vi/ui-grid-units.webp){.shot-sm}

Nếu bạn thấy `ft · kip · kip·ft · ksi`, hãy nhấp vào ô đơn vị và chọn **Hệ đơn vị → SI (hệ mét)**.

## 2. Thêm vật liệu và tiết diện {#_2-add-the-material-and-cross-section}

Phần tử cần có vật liệu và tiết diện, vì vậy hãy tạo chúng trước.

1. Mở thẻ **Vật liệu** ở thanh dưới cùng và nhấp **Thêm vật liệu**.
2. Nhập `E = 210000` MPa và `G = 81000` MPa. Giữ nguyên khối lượng riêng và `α = 0,000012` 1/K. Nhấp **Thêm vật liệu**.

<div class="shots">

![Thêm vật liệu: nhập E và G…](/screenshots/vi/qs-material.webp)

![…hoặc chọn Steel (S235) từ Thư viện vật liệu](/screenshots/vi/qs-material-library.webp)

</div>

3. Mở thẻ **Tiết diện** và nhấp **Thêm tiết diện**.
4. Nhập `Diện tích = 0,00285` m², `Iy = 1,943e-5` m⁴, `Chiều cao = 0,2` m và `Hệ số hiệu chỉnh cắt = 1`. Nhấp **Thêm tiết diện**.

![Thêm tiết diện. Bạn cũng có thể chọn từ thư viện hoặc vẽ hình đa giác.](/screenshots/vi/qs-cross-section.webp){.shot-md}

::: details Vì sao hệ số hiệu chỉnh cắt lại quan trọng?
EduBeam dùng phần tử dầm Timoshenko, có kể đến biến dạng trượt. `k` là hệ số hiệu chỉnh cắt: $k \approx 0{,}83$ với tiết diện chữ nhật, và khoảng $0{,}4$–$0{,}5$ với tiết diện chữ I khi $A$ là toàn bộ diện tích. Đặt `k = 1` với toàn bộ diện tích sẽ *đánh giá thấp* một chút độ mềm khi cắt. Với một dầm mảnh như dầm này, chênh lệch độ võng nhỏ hơn nhiều so với 1 %. Xem công thức ở [trang lý thuyết dầm](/vi/elements/beam).
:::

## 3. Thêm nút {#_3-add-the-nodes}

1. Mở thẻ **Nút**. Thẻ này có hai nút **Thêm nút**: nút thứ nhất mở hộp thoại, nút thứ hai (có biểu tượng con trỏ) đặt nút bằng chuột. Nhấp vào nút thứ nhất.
2. Nhập `X = 0`, `Z = 0` và nhấp **Thêm nút**. Nút này có nhãn `1`.
3. Thêm nút thứ hai tại `X = 6`, `Z = 0`. Đây là nút `2`.

![Hộp thoại Thêm nút cũng cho phép đặt gối tựa ngay lập tức](/screenshots/vi/qs-node.webp){.shot-md}

Nếu dùng nút đặt bằng chuột, mỗi lần nhấp lên khung vẽ sẽ đặt một nút. Khi bật **Bắt dính lưới** (<kbd>S</kbd>), các điểm nhấp sẽ rơi đúng vào bước lưới (mặc định 0,1 m).

## 4. Nối chúng bằng một phần tử {#_4-connect-them-with-an-element}

1. Mở thẻ **Phần tử** và nhấp nút **Thêm phần tử** thứ nhất.
2. Chọn **Nút đầu** `1` và **Nút cuối** `2`. Vật liệu và tiết diện của bạn đã được chọn sẵn. Nhấp **Thêm phần tử**.

![Thêm phần tử: hai nút đầu mút, khớp đầu thanh tùy chọn, vật liệu và tiết diện](/screenshots/vi/qs-element.webp){.shot-md}

Một đoạn thẳng xuất hiện giữa hai nút. Nhấn <kbd>F</kbd> để thu vừa màn hình.

## 5. Thêm gối tựa {#_5-add-the-supports}

Trong thẻ **Nút**, cột **Bậc tự do bị chặn** có bộ chọn ký hiệu gối tựa và ba ô đánh dấu cho mỗi nút: `Dx`, `Dz`, `Ry`.

- Nút `1`: chọn ký hiệu **Gối cố định**, hoặc đánh dấu **Dx** và **Dz**.
- Nút `2`: chọn **Gối di động**, hoặc chỉ đánh dấu **Dz**.

![Gối tựa trong bảng Nút: nút 1 là gối cố định, nút 2 là gối di động](/screenshots/vi/qs-supports.webp)

Bạn cũng có thể nhấp vào một nút trong vùng hiển thị và chọn **Gối tựa tại nút**. Trang [Nút và gối tựa](/vi/essentials/nodes-supports#supports) liệt kê mọi loại gối tựa.

## 6. Thêm tải trọng {#_6-add-the-load}

1. Mở thẻ **Tải trọng** và nhấp **Thêm tải phần tử**.
2. **Loại tải trọng**: *Tải phân bố đều*. **Phần tử**: `1`.
3. Nhập `fz = 12` kN/m và giữ `fx = 0`. Nhấp **Thêm tải phần tử**.

![Hộp thoại hiển thị trước tải trọng trên phần tử](/screenshots/vi/qs-load.webp){.shot-md}

`fz` dương hướng theo chiều +z, tức là **xuống dưới** trên màn hình, nên giá trị dương là tải trọng trọng lực. Xem [quy ước dấu](/vi/elements/conventions).

## 7. Đọc kết quả {#_7-read-the-results}

Lời giải xuất hiện ngay khi tải trọng được thêm vào. Bảng hiển thị ở góc trên bên phải vùng hiển thị dùng để bật và tắt các biểu đồ. **Biến dạng**, **M<sub>y</sub>(x)** và **Phản lực** được bật sẵn. Đánh dấu **V<sub>z</sub>(x)** để thêm lực cắt.

![Lực cắt (xanh lá), mô men uốn (đỏ), phản lực (tím) và sơ đồ biến dạng](/screenshots/vi/qs-results.webp)

| Lớp hiển thị | Bạn sẽ thấy |
| --- | --- |
| **Phản lực** | Hai mũi tên hướng lên, mỗi mũi tên **36 kN**, tại nút 1 và 2. |
| **V<sub>z</sub>(x)** | Một đường thẳng từ **+36 kN** bên trái đến **−36 kN** bên phải, bằng không ở giữa nhịp. |
| **M<sub>y</sub>(x)** | Một đường parabol có giá trị cực trị **54 kNm** ở giữa nhịp. |
| **Biến dạng** | Một độ võng đối xứng. Trỏ chuột vào nút `1` để đọc góc xoay của nó: **2,6469 · 10⁻² rad**. |

Thẻ **Kết quả** ở thanh dưới cùng cho bạn các con số. **Kết quả tại nút** liệt kê `Dx`, `Dz`, `Ry` của từng nút. **Kết quả phần tử** liệt kê nội lực đầu phần tử của từng phần tử trong hệ tọa độ địa phương của nó.

Nếu biểu đồ trông quá lớn hoặc quá nhỏ, hãy chỉnh **Tỷ lệ kết quả** trong **Cài đặt → Cài đặt hiển thị → Kích cỡ**.

## 8. Kiểm tra bằng tính tay {#_8-check-by-hand}

| Đại lượng | Công thức | Tính tay | EduBeam |
| --- | --- | --- | --- |
| Phản lực | $R = qL/2$ | 36 kN | 36 kN |
| Lực cắt lớn nhất | $V = qL/2$ | 36 kN | 36 kN |
| Mô men lớn nhất | $M = qL^2/8$ | 54 kNm | 54 kNm |
| Góc xoay tại gối | $\varphi = qL^3/(24EI)$ | 0,02647 rad | 0,02647 rad |
| Độ võng giữa nhịp (uốn) | $w = 5qL^4/(384EI)$ | 49,63 mm | |
| Độ võng giữa nhịp (cắt) | $w_s = qL^2/(8kGA)$ | 0,23 mm | |
| Độ võng giữa nhịp (tổng) | tổng | 49,86 mm | 49,86 mm |

Không có nút nào ở giữa nhịp, nên để đọc độ võng tại đó, hãy thêm một nút: chọn nút **Thêm nút** thứ hai, nhấp lên dầm tại `X = 3` và chọn **Nối vào kết cấu**. Dầm được chia làm hai và `Dz` của nút mới trong **Kết quả** là 49,86 mm. Việc chia dầm không làm thay đổi kết quả nào, vì phần tử cho lời giải chính xác.

Mọi thứ đều khớp. Thêm các cách kiểm tra bằng tính tay (dầm công xôn, dầm hai đầu ngàm, dàn, nhiệt độ) có trong [Kiểm tra kết quả bằng tính tay](/vi/guide/verification).

## 9. Thử nghiệm {#_9-experiment}

Đây chính là lúc EduBeam phát huy giá trị. Hãy thử từng thao tác sau và xem các biểu đồ cập nhật:

- **Kéo nút 2** sang phải: mô men tăng theo $L^2$.
- **Đánh dấu `Ry` tại nút 1** để biến nó thành ngàm: mô men giữa nhịp giảm và xuất hiện mô men âm tại gối.
- **Đánh dấu `Dz` tại nút giữa nhịp** bạn vừa thêm, để có dầm liên tục hai nhịp.
- **Đánh dấu một khớp đầu thanh** của phần tử trong thẻ Phần tử để giải phóng mô men tại một đầu.
- Nhấn <kbd>Ctrl</kbd>+<kbd>Z</kbd> để hoàn tác bất kỳ bước nào.

## 10. Lưu hoặc chia sẻ {#_10-save-or-share}

- **Chia sẻ mô hình** (trên thanh ứng dụng hoặc trong menu ☰) tạo cho bạn một liên kết chứa toàn bộ mô hình. Dán nó vào e-mail, khung chat hoặc bài giảng của bạn.
- **☰ → Lưu dự án** (<kbd>Ctrl</kbd>+<kbd>S</kbd>) tải xuống tệp `project.json` mà bạn có thể mở lại sau bằng **Mở dự án** hoặc bằng cách kéo thả vào ứng dụng.
- **☰ → Xuất hình ảnh** (<kbd>Ctrl</kbd>+<kbd>P</kbd>) lưu hình vẽ dưới dạng PNG hoặc SVG để đưa vào báo cáo.

Mô hình của bạn cũng được lưu trong trình duyệt, nên tải lại trang sẽ không làm mất nó. Xem [Nhập, xuất và chia sẻ](/vi/essentials/import-export).

## Tiếp theo {#where-next}

- [Bài hướng dẫn khung ba khớp](/vi/tutorials/three-hinged-frame): một khung có khớp bên trong, được kiểm tra bằng tính tay.
- [Ví dụ](/vi/examples/): mở các khung và dàn có sẵn chỉ với một cú nhấp.
- [Tải trọng](/vi/essentials/loads): tải hình thang, tải tập trung, tải nhiệt độ và chuyển vị cưỡng bức.
- [Bàn phím, chuột và cảm ứng](/vi/reference/shortcuts): làm việc nhanh hơn trên khung vẽ.
