---
description: "Thêm và sửa nút, bắt dính vào lưới, đặt nút lên phần tử, khai báo ngàm, gối cố định, gối di động và gối tựa xiên, lún gối tựa và đường kích thước."
---

# Nút và gối tựa

Nút là các điểm của mô hình. Phần tử nối các nút với nhau, còn gối tựa và tải trọng nút được gắn vào nút.

## Tọa độ {#coordinates}

Mỗi nút có tọa độ **X** và **Z** theo đơn vị chiều dài hiện tại. Trên màn hình, trục x hướng sang phải và **trục z hướng xuống dưới**, nên một cột mọc lên từ mặt đất đi từ `Z = 0` đến `Z = −3`, chứ không phải `+3`. Biểu tượng trục ở góc lưới cho biết chiều các trục. Nếu bạn muốn trục đứng hướng lên, hãy chuyển sang [hệ trục y hướng lên](/vi/elements/conventions#y-up-axes) trong phần Cài đặt.

## Thêm nút {#adding-nodes}

| Cách | Thực hiện |
| --- | --- |
| **Hộp thoại** | Thẻ *Nút* → nút **Thêm nút** thứ nhất, hoặc nhấp chuột phải vào khung vẽ → *Thêm nút*. Nhập X và Z, và nếu cần cả gối tựa và góc gối tựa. |
| **Chuột** | Thẻ *Nút* → nút **Thêm nút** thứ hai (biểu tượng con trỏ), hoặc giữ <kbd>Ctrl</kbd> khi chọn *Thêm nút* trong menu khung vẽ. Mỗi lần nhấp vào khung vẽ sẽ thêm một nút. Nhấn <kbd>Esc</kbd> hoặc **Hủy** để dừng. |
| **Trong khi vẽ phần tử** | Ở chế độ vẽ phần tử bằng chuột, nhấp vào vùng trống sẽ tạo một nút và nối phần tử vào đó. |
| **Sao chép và dán** | Chọn các nút (và phần tử), nhấn <kbd>Ctrl</kbd>+<kbd>C</kbd> và <kbd>Ctrl</kbd>+<kbd>V</kbd>, rồi nhấp vào chỗ cần đặt bản sao, hoặc nhập độ dời Δx, Δz và nhấn **Dán**. |

<div class="shots">

![Hộp thoại Thêm nút](/screenshots/vi/qs-node.webp)

![Ở chế độ chuột, thanh phía trên đặt gối tựa và góc cho mọi nút bạn đặt](/screenshots/vi/nodes-add-banner.webp)

</div>

Nhãn được gán tự động (`1`, `2`, … hoặc tiếp nối cách đặt tên của bạn, ví dụ `A`, `B`) và có thể đổi tên trong bảng.

### Bắt dính {#snapping}

Khi bật **Bắt dính lưới** (<kbd>S</kbd> hoặc nhãn **S**), các nút bạn đặt hoặc kéo sẽ rơi vào bội số của **Bước bắt dính lưới**: mặc định 0,1 m, hoặc 0,5 ft với đơn vị Mỹ. Bạn đổi bước này trong *Cài đặt → Cài đặt hiển thị → Lưới*. Tắt bắt dính nếu muốn đặt tự do, hoặc nhập tọa độ chính xác trong bảng sau đó.

### Đặt nút lên phần tử có sẵn {#placing-a-node-on-an-existing-element}

Nếu bạn nhấp gần một phần tử khi đang thêm nút, EduBeam sẽ hỏi ý bạn:

- **Nối vào kết cấu** chia phần tử làm hai (`1a` và `1b`). Khớp ở hai đầu ngoài được giữ nguyên, tải phân bố đều và tải hình thang được chia cho hai nửa; tải tập trung và tải nhiệt độ thuộc về nửa thứ nhất. Đây là cách nhanh nhất để thêm một gối tựa trung gian hoặc một điểm đặt tải.
- **Đặt nút riêng lẻ** tạo nút nằm trên phần tử nhưng không nối vào nó.

## Sửa nút {#editing-nodes}

- **Bảng:** sửa nhãn, X và Z ngay tại chỗ.
- **Kéo:** di chuyển nút trong vùng hiển thị, cả trên màn hình cảm ứng: nhấn vào nút rồi kéo. Mọi lần di chuyển đều có thể hoàn tác.
- **Hộp thoại Sửa nút:** biểu tượng bút chì trong cột *Thao tác* của bảng. Hộp thoại chứa tọa độ, gối tựa và góc gối tựa, kèm hình xem trước ký hiệu gối tựa.
- **Xóa:** dấu × trong bảng, *Xóa* trong bảng của nút, hoặc chọn nút rồi nhấn <kbd>Delete</kbd>. Xóa một nút cũng xóa các phần tử và tải trọng gắn vào nó.

## Gối tựa {#supports}

Gối tựa là tập hợp các bậc tự do (DOF) bị chặn. Mỗi nút có ba bậc tự do:

| Bậc tự do | Ý nghĩa |
| --- | --- |
| **Dx** | chuyển vị theo x (phương ngang) |
| **Dz** | chuyển vị theo z (phương đứng) |
| **Ry** | góc xoay quanh y (trong mặt phẳng hình vẽ) |

Cách nhanh nhất là **chọn ký hiệu**. Ký hiệu có trong bảng của nút ở mục **Gối tựa tại nút**, trong các hộp thoại Thêm nút và Sửa nút, và dưới dạng một menu nhỏ ở đầu cột *Bậc tự do bị chặn* của bảng Nút. Đánh dấu các ô `Dx`, `Dz`, `Ry` cũng cho kết quả tương tự, từng bậc tự do một.

![Gối tựa tại nút: chọn ký hiệu hoặc đánh dấu các bậc tự do, và đặt góc gối tựa](/screenshots/vi/nodes-support-picker.webp){.shot-lg}

| Gối tựa | Bị chặn | Chuyển động | Phản lực |
| --- | --- | --- | --- |
| **Tự do** | không | tất cả | không |
| **Gối cố định** | Dx + Dz | xoay | R<sub>x</sub>, R<sub>z</sub> |
| **Gối di động** | Dz | trượt ngang, xoay | R<sub>z</sub> |
| **Gối di động đứng** | Dx | trượt đứng, xoay | R<sub>x</sub> |
| **Ngàm** | Dx + Dz + Ry | không | R<sub>x</sub>, R<sub>z</sub>, M |
| **Ngàm trượt** | Dz + Ry | trượt ngang | R<sub>z</sub>, M |
| **Ngàm trượt đứng** | Dx + Ry | trượt đứng | R<sub>x</sub>, M |
| **Chỉ chặn xoay** | Ry | trượt theo cả hai phương | M |

Mỗi bậc tự do bị chặn đều được tính và vẽ một phản lực.

::: tip Mắt dàn
Thanh dàn là phần tử dầm được giải phóng cả hai **khớp đầu thanh** (xem [Phần tử](/vi/essentials/elements#end-hinges)). Gối cố định (Dx + Dz) là lựa chọn thông thường cho gối tựa của dàn. Một nút mà mọi phần tử nối vào đều có khớp sẽ không có độ cứng chống xoay; EduBeam vẫn chấp nhận và báo góc xoay của nó bằng 0.
:::

### Gối tựa xiên {#inclined-skewed-supports}

Đặt **Góc LCS của nút** α theo độ (−180…180). Góc này có trong bảng của nút ở mục *Gối tựa tại nút*, trong các hộp thoại Thêm nút và Sửa nút, và ở ô α của bảng Nút. Các trục của nút xoay đi một góc bằng giá trị đó và các bậc tự do của gối tựa tác dụng theo phương đã xoay, nên một gối di động trên mặt dốc 30° là `Dz` với α = 30. Ký hiệu xoay theo, và phản lực được báo theo phương đã xoay.

### Ổn định {#stability}

Bộ giải cần tổng cộng ít nhất **ba bậc tự do bị chặn**, đồng thời gối tựa và khớp phải giữ được kết cấu. Khi chưa đủ gối tựa, vùng hiển thị hiện nhãn xanh *Cần gối tựa*. Nếu số gối tựa đủ nhưng chúng không giữ được kết cấu (tất cả song song, hoặc đồng quy tại một điểm), hoặc các khớp cho phép các thanh xoay tương đối với nhau, một thông báo màu đỏ sẽ chỉ ra vấn đề và đường bao nét đứt cho thấy kết cấu chuyển động thế nào. Xem [Khắc phục sự cố](/vi/reference/troubleshooting).

## Tải trọng nút và lún gối tựa {#nodal-loads-and-settlements}

Lực, mô men và chuyển vị cưỡng bức (lún gối tựa) được đặt tại nút. Xem [Tải trọng](/vi/essentials/loads#nodal-loads).

## Đường kích thước {#dimension-lines}

Nhấp chuột phải vào khung vẽ → **Thêm kích thước** để vẽ đường kích thước giữa hai điểm, hoặc nhấp chuột phải vào một phần tử → **Ghi kích thước phần tử** để ghi kích thước trực tiếp cho nó. Khi kéo gần nút, các điểm đầu mút sẽ bắt dính vào nút. Chọn một đường kích thước và dùng **Sửa** để nhập tọa độ, hoặc **Lật kích thước** để đưa nhãn sang phía bên kia. Đường kích thước chỉ để trình bày; chúng được lưu cùng dự án và đi kèm trong liên kết chia sẻ.
