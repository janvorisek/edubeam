---
description: "Đọc biểu đồ lực dọc, lực cắt và mô men uốn, phản lực và sơ đồ biến dạng, giá trị khi di chuột, bảng kết quả, xuất CSV và ma trận độ cứng."
---

# Kết quả và biểu đồ

<Edubeam /> giải lại mô hình sau mỗi thay đổi (tối đa vài lần mỗi giây), nên kết quả luôn được cập nhật. Không có nút *Giải*. Nếu không có gì được vẽ, nghĩa là mô hình chưa thể giải; thông báo ở góc trên bên trái vùng hiển thị sẽ cho biết lý do (xem [Khắc phục sự cố](/vi/reference/troubleshooting)).

Mọi hình trên trang này đều là cùng một mô hình: [khung ba khớp](/vi/tutorials/three-hinged-frame) chịu tải 10 kN/m.

## Lớp hiển thị trên mô hình {#overlays-in-the-viewer}

Bật và tắt các lớp trong **tùy chọn hiển thị** ở góc trên bên phải vùng hiển thị (nút ⚙ hiện hoặc ẩn chúng).

| Lớp hiển thị | Màu (mặc định) | Ghi chú |
| --- | --- | --- |
| **Biến dạng** | xám | Được phóng đại: chuyển vị lớn nhất được vẽ dài bằng số pixel của *Tỷ lệ kết quả*. Bật theo mặc định. |
| **N (x)**, lực dọc | xanh dương | Kéo là dương. Không đổi dọc phần tử trừ khi có tải dọc trục tác dụng. |
| **V<sub>z</sub> (x)**, lực cắt | xanh lá | Bậc nhất dưới tải phân bố đều, bậc hai dưới tải hình thang, có bước nhảy tại tải tập trung. |
| **M<sub>y</sub> (x)**, mô men uốn | đỏ | Dương khi căng thớ dưới. Có nhãn ở hai đầu, tại các tải tập trung và tại mọi cực trị cục bộ (nơi V = 0). Bật theo mặc định. |
| **Phản lực** | tím | Một mũi tên và một giá trị cho mỗi bậc tự do bị chặn. Bật theo mặc định. |

Giá trị được ghi tại các điểm đặc trưng của mỗi biểu đồ. Hướng nhãn, kích cỡ biểu đồ và màu sắc có thể thay đổi trong [Cài đặt](/vi/essentials/units-settings#viewer-settings).

<div class="shots">

![Lực dọc N: cả hai cột chịu nén 40 kN, dầm chịu 20 kN](/screenshots/vi/results-normal.webp)

![Lực cắt V: 20 kN trong các cột; trong dầm, 40 kN tại các góc khung giảm dần về 0 tại khớp](/screenshots/vi/results-shear.webp)

![Mô men uốn M: −80 kNm tại cả hai góc khung, bằng 0 tại chân cột và tại khớp](/screenshots/vi/results-moment.webp)

![Sơ đồ biến dạng (phóng đại): khớp C bị hạ xuống](/screenshots/vi/results-deformed.webp)

</div>

![Phản lực: 40 kN theo phương đứng và 20 kN theo phương ngang tại mỗi gối cố định](/screenshots/vi/results-reactions.webp){.shot-lg}

### Cách đọc dấu {#reading-the-sign}

Hãy đọc dấu của một giá trị từ nhãn của nó, không phải từ phía của thanh mà biểu đồ được vẽ. Mô men uốn âm là căng thớ trên: thớ trên của dầm bị kéo, hoặc phía ngoài của góc khung bị kéo.

## Chú thích khi di chuột {#hover-tooltips}

Di chuột lên một đối tượng là cách nhanh nhất để đọc giá trị:

- **Nút**: `ux`, `uz` và `φy` (chuyển vị theo đơn vị chuyển vị, góc xoay tính bằng radian).
- **Phần tử**: nhãn, tiết diện và vật liệu.
- **Tải trọng**: các thành phần của nó.

Trên màn hình cảm ứng, hãy chạm vào đối tượng. Các thông tin tương tự sẽ hiện trong bảng chọn của đối tượng đó.

![Di chuột lên nút 2 của dầm trong phần Bắt đầu nhanh](/screenshots/vi/ui-hover.webp){.shot-sm}

## Thẻ Kết quả {#results-tab}

Thẻ **Kết quả** ở thanh dưới cùng có hai bảng, chuyển đổi bằng **Kết quả tại nút** và **Kết quả phần tử**.

### Kết quả tại nút {#nodal-results}

Mỗi nút một hàng với **Dx**, **Dz** (đơn vị chuyển vị) và **Ry** (rad). Dấu theo các trục tổng thể: `Dz` dương hướng xuống và `Ry` dương ngược chiều kim đồng hồ trên màn hình.

![Kết quả tại nút của khung ba khớp (Định dạng số: Tự động)](/screenshots/vi/results-nodal.webp)

### Kết quả phần tử {#element-results}

Mỗi phần tử một hàng với **nội lực đầu phần tử trong hệ tọa độ địa phương của phần tử**:

| Cột | Ý nghĩa |
| --- | --- |
| `X12`, `Z12`, `M12` | lực dọc, lực cắt và mô men tác dụng lên phần tử tại nút **đầu** |
| `X21`, `Z21`, `M21` | tương tự tại nút **cuối** |

![Kết quả phần tử của khung ba khớp](/screenshots/vi/results-element.webp)

Đây là các lực mà nút tác dụng lên phần tử: ma trận độ cứng phần tử nhân với chuyển vị đầu phần tử, trừ đi tải trọng nút tương đương. Chúng theo các trục địa phương, không theo quy ước dấu N-V-M của biểu đồ:

- Với dầm đơn giản nhịp 6 m trong phần [Bắt đầu nhanh](/vi/guide/quick-start): `Z12 = Z21 = −36 kN`. Cả hai gối tựa đẩy dầm lên, tức là theo chiều −z.
- Với dầm công xôn ngàm tại nút đầu, chịu tải 18 kN hướng xuống ở đầu tự do: `Z12 = −18 kN`, `M12 = +72 kNm`, `Z21 = +18 kN`, `M21 = 0`.
- Với cột 1 của khung (A ở dưới, B ở trên): `X12 = +40 kN` đẩy vào phần tử theo trục x địa phương, tức là cột chịu nén 40 kN.

### Xuất CSV và sao chép {#export-csv-and-copy}

**Xuất CSV** tải xuống `edubeam-results.csv` chứa cả hai bảng, theo đơn vị đang hiển thị trên màn hình và sẵn sàng cho bảng tính. Bảng nút còn liệt kê **phản lực** `Rx`, `Rz`, `My`. **Sao chép** đưa cùng các bảng đó vào bộ nhớ tạm dưới dạng văn bản phân tách bằng tab, dán thẳng được vào Excel, LibreOffice hoặc Google Sheets. Trong tệp xuất, nội lực đầu phần tử được đặt tên `N1 V1 M1 N2 V2 M2`.

### Ma trận độ cứng {#stiffness-matrix}

Chọn **Ma trận độ cứng** trong bảng của phần tử hoặc hàng của nó trong bảng để mở cửa sổ hiển thị ma trận độ cứng 6 × 6 của phần tử trong hệ tọa độ tổng thể, hữu ích để kiểm tra việc ghép ma trận bằng tay trong môn phương pháp chuyển vị. Công thức có trong [phần lý thuyết](/vi/elements/beam).

## Định dạng số {#number-format}

Kết quả được hiển thị với năm chữ số có nghĩa. **Cài đặt → Ngôn ngữ và khu vực → Định dạng số** quyết định cách ghi:

| Định dạng | 40 000 được ghi là | Dùng cho |
| --- | --- | --- |
| **Khoa học** (mặc định) | 4 · 10⁴ | các giá trị trải qua nhiều bậc độ lớn |
| **Kỹ thuật** | 40 · 10³ | khớp với tiền tố kilo / mega |
| **Tự động** | 40000 | các con số thông thường khi giảng dạy |

Định dạng Tự động ghi các giá trị từ 0,001 đến 100 000 dưới dạng số thường và chuyển sang lũy thừa của mười khi nằm ngoài khoảng đó. Dấu thập phân theo ngôn ngữ đã chọn.

## Độ chính xác {#precision-and-accuracy}

- Phần tử dầm cho kết quả chính xác với mô hình Timoshenko tuyến tính dưới tải trọng nút, phân bố đều, hình thang, tập trung và nhiệt độ, nên kết quả **không** phụ thuộc vào số lượng phần tử.
- Phép tính được thực hiện với độ chính xác kép (double precision). Các giá trị rất nhỏ như `1,5 · 10⁻¹⁸` là sai số làm tròn và có nghĩa là bằng 0.
- Độ võng có kể đến **biến dạng trượt**. Với thanh mảnh, nó chỉ làm tăng giá trị Euler–Bernoulli thêm một phần nhỏ của một phần trăm; với thanh cao hoặc ngắn, có thể tăng vài phần trăm. Đặt hệ số hiệu chỉnh cắt của tiết diện ở giá trị lớn để loại bỏ ảnh hưởng này.

## Kết quả trong báo cáo {#results-in-a-report}

- **☰ → Xuất hình ảnh** (<kbd>Ctrl</kbd>+<kbd>P</kbd>) lưu hình vẽ dưới dạng PNG hoặc SVG với các lớp hiển thị bạn chọn. Xem [Xuất hình ảnh](/vi/essentials/import-export#export-an-image).
- **Kết quả → Xuất CSV** hoặc **Sao chép** cho bạn các con số.
- **Chia sẻ mô hình** cho bạn một liên kết để người đọc mở chính mô hình đó.
