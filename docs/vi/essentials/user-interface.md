---
description: "Tham quan giao diện EduBeam: menu chính, vùng hiển thị và các tùy chọn hiển thị, di chuyển và chọn đối tượng, các thẻ, thanh dưới cùng và các cửa sổ nổi."
---

# Giao diện người dùng

<Edubeam /> có ba vùng: **thanh ứng dụng** ở trên cùng, **vùng hiển thị** ở giữa, nơi bạn vẽ, và **thanh dưới cùng** với một bảng cho mỗi loại đối tượng. Nắm được cái gì nằm ở đâu, bạn sẽ dễ theo dõi phần còn lại của tài liệu.

![Các phần của giao diện, đánh số theo danh sách bên dưới](/screenshots/vi/ui-overview.webp)

1. **Menu ☰**: mở, lưu, chia sẻ và xuất; ví dụ và các bài hướng dẫn.
2. **Nút trên thanh ứng dụng**: Xóa kết cấu và Chia sẻ mô hình.
3. **Hoàn tác / Làm lại** cho mọi thay đổi của mô hình.
4. **Nút điều khiển hiển thị**: căn giữa, vừa màn hình và nút bật/tắt tùy chọn hiển thị.
5. **Tùy chọn hiển thị**: chọn kết quả và thành phần mô hình nào được vẽ.
6. **Lưới, bắt dính, dấu thập và đơn vị.**
7. **Các thẻ của thanh dưới cùng**: Nút, Phần tử, Tải trọng, Vật liệu, Tiết diện, Kết quả.
8. **Bảng** của thẻ đang mở, nơi bạn có thể sửa mọi giá trị.

::: tip Đi một vòng tham quan
**☰ → Xem giới thiệu** lần lượt chỉ cho bạn từng phần này ngay trong ứng dụng.
:::

![Xem giới thiệu, ở bước tùy chọn hiển thị](/screenshots/vi/tour.webp)

## Thanh ứng dụng {#app-bar}

| Nút | Chức năng |
| --- | --- |
| **Menu ☰** | Menu chính, xem bên dưới. |
| **Xóa kết cấu** | Xóa mọi nút, phần tử và tải trọng sau khi bạn xác nhận. Hai ô đánh dấu cho phép xóa cả vật liệu và tiết diện. <kbd>Ctrl</kbd>+<kbd>Z</kbd> sẽ khôi phục mô hình, và mô hình vẫn được giữ trong Kết cấu gần đây. |
| **Chia sẻ mô hình** | Mở [hộp thoại chia sẻ](/vi/essentials/import-export#share-a-link) với một liên kết chứa toàn bộ mô hình. |
| **Có gì mới?** | Ghi chú phát hành. Sau mỗi lần cập nhật, chúng tự mở một lần. |
| **Tài liệu** / GitHub | Tài liệu này và mã nguồn. |

Trên điện thoại, thanh chỉ đủ chỗ cho menu ☰ và Tài liệu; mọi thứ khác nằm trong menu.

### Menu ☰ {#the-☰-menu}

![Menu ☰](/screenshots/vi/ui-app-menu.webp){.shot-xs}

| Mục | Chức năng |
| --- | --- |
| **Mở dự án** / **Lưu dự án** | Mở hoặc tải xuống tệp `project.json` (<kbd>Ctrl</kbd>+<kbd>O</kbd> / <kbd>Ctrl</kbd>+<kbd>S</kbd>). |
| **Kết cấu gần đây** | 10 mô hình gần nhất bạn đã xóa hoặc thay thế, sẵn sàng để khôi phục. |
| **Xuất hình ảnh** | Lưu hình vẽ dưới dạng PNG hoặc SVG, hoặc sao chép nó (<kbd>Ctrl</kbd>+<kbd>P</kbd>). |
| **Chia sẻ mô hình** | Giống nút trên thanh ứng dụng. |
| **Ví dụ** | Bộ sưu tập các mô hình có sẵn. |
| **Vẽ dầm đầu tiên** | Bài hướng dẫn bảy bước. |
| **Xem giới thiệu** | Chuyến tham quan giao diện. |
| **Xóa kết cấu** | Giống nút trên thanh ứng dụng. |

Cuối menu hiển thị phiên bản ứng dụng và ngày phát hành.

## Vùng hiển thị {#viewer}

Khung vẽ là nơi bạn vẽ và xem xét mô hình. Mọi phần khác của ứng dụng đều theo đối tượng bạn chọn ở đây.

### Các nút trên khung vẽ {#buttons-on-the-canvas}

- **Góc trên bên trái:** **Hoàn tác** và **Làm lại** (<kbd>Ctrl</kbd>+<kbd>Z</kbd> / <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Z</kbd>). Mọi thay đổi mô hình, gồm thêm, sửa, kéo, xóa và xóa toàn bộ kết cấu, đều có thể hoàn tác.
- **Góc trên bên phải:** **Căn giữa** (<kbd>C</kbd>), **Vừa màn hình** (<kbd>F</kbd>) và nút ⚙ để hiện hoặc ẩn tùy chọn hiển thị. Trên màn hình cảm ứng còn có **Chọn bằng khung**.
- **Góc dưới bên phải:** **G** bật/tắt lưới, **S** bật/tắt bắt dính lưới, nút dấu thập hiện vị trí con trỏ trên thước, và **ô đơn vị** mở phần cài đặt ở mục *Ngôn ngữ và khu vực*.

### Tùy chọn hiển thị {#display-options}

![Các nút điều khiển hiển thị và tùy chọn hiển thị](/screenshots/vi/ui-display-settings.webp){.shot-lg}

Hai hàng ô đánh dấu, mở sẵn theo mặc định:

- **Kết quả:** *Biến dạng*, *N (x)*, *V<sub>z</sub> (x)*, *M<sub>y</sub> (x)*, *Phản lực*. Biến dạng, M và Phản lực được đánh dấu sẵn.
- **Mô hình:** *Gối tựa*, *Tải trọng*, *Nhãn nút*, *Nhãn phần tử*.

**Thêm cài đặt** mở toàn bộ [cài đặt](/vi/essentials/units-settings) ở mục *Cài đặt hiển thị*.

### Di chuyển trên khung vẽ {#navigating}

| Thao tác | Chuột | Cảm ứng |
| --- | --- | --- |
| Thu phóng | Con lăn chuột (thu phóng về phía con trỏ), <kbd>Ctrl</kbd>+<kbd>=</kbd> / <kbd>Ctrl</kbd>+<kbd>-</kbd> | Chụm hoặc mở hai ngón tay |
| Kéo màn hình | Kéo bằng nút **giữa hoặc phải** (xem *Cài đặt → Điều khiển và phím tắt*) | Kéo bằng một ngón tay |
| Vừa màn hình / căn giữa | <kbd>F</kbd> / <kbd>C</kbd> hoặc các nút ở góc trên bên phải | Các nút ở góc trên bên phải |

### Chọn và chỉnh sửa {#selecting-and-editing}

**Nhấp** vào một nút, phần tử, tải trọng hoặc đường kích thước để chọn nó. Một bảng mở ra bên cạnh với thông tin chi tiết và các thao tác phù hợp: thêm tải trọng, đặt gối tựa, sửa, xem ma trận độ cứng, xóa. Khi nhấp vào một nút, thanh dưới cùng cũng chuyển sang thẻ Nút.

<div class="shots">

![Một nút: thêm tải trọng, đặt gối tựa, đặt chuyển vị cưỡng bức](/screenshots/vi/ui-node-menu.webp)

![Một phần tử: sửa, thêm tải trọng, ma trận độ cứng](/screenshots/vi/ui-element-menu.webp)

</div>

- **Kéo trên vùng trống của khung vẽ** để vẽ khung chọn. Mọi thứ nằm bên trong đều được chọn: nút, phần tử, tải trọng và đường kích thước của chúng. Nhấn <kbd>Delete</kbd> để xóa tất cả, hoặc <kbd>Ctrl</kbd>+<kbd>C</kbd> / <kbd>Ctrl</kbd>+<kbd>V</kbd> để sao chép sang chỗ khác.
- **Kéo một nút** để di chuyển nó. Khi bật bắt dính, nút sẽ rơi đúng vào lưới. Các phần tử nối với nút và tải trọng của chúng di chuyển theo.
- **Nhấp đúp vào một tải trọng** để sửa nó.
- **Rê chuột** lên bất kỳ đối tượng nào để xem chú thích. Nút cho biết chuyển vị và góc xoay, phần tử cho biết vật liệu và tiết diện, tải trọng cho biết giá trị. Trên màn hình cảm ứng, bạn chạm vào đối tượng: các thông tin tương tự hiện trong bảng chọn.

![Rê chuột lên một nút sẽ hiện chuyển vị và góc xoay của nó](/screenshots/vi/ui-hover.webp){.shot-sm}

**Nhấp chuột phải vào khung vẽ** (hoặc chạm và giữ trên màn hình cảm ứng) để mở menu khung vẽ. Giữ <kbd>Ctrl</kbd> khi chọn *Thêm nút* hoặc *Thêm phần tử* để đặt chúng bằng chuột thay vì qua hộp thoại. Khi mở trên một phần tử, menu còn có *Ghi kích thước phần tử*.

![Menu khung vẽ](/screenshots/vi/ui-canvas-menu.webp){.shot-sm}

Mọi phím tắt đều có ở trang [Bàn phím, chuột và cảm ứng](/vi/reference/shortcuts).

### Khi mô hình không giải được {#when-the-model-cannot-be-solved}

Thông báo xuất hiện ở góc trên bên trái của vùng hiển thị:

- *Chưa có vật liệu nào* / *Chưa có tiết diện nào*, kèm nút **Thêm mới**.
- Một nhãn nhỏ màu xanh **Cần gối tựa** khi mô hình chỉ đơn giản là chưa hoàn thành.
- Một **thông báo màu đỏ** khi có lỗi, kèm nút **Hiện chi tiết** liệt kê mọi vấn đề.

Khi kết cấu vẫn còn chuyển động được, EduBeam cho nó đung đưa dưới dạng đường bao nét đứt và khoanh tròn các nút hoặc khớp gây ra vấn đề. Rê chuột lên thông báo để xem lại chuyển động, hoặc dùng nút hình con mắt để ẩn nó.

![Khung có khớp tại B và C là hệ biến hình: EduBeam cho thấy nó chuyển động thế nào](/screenshots/vi/ui-mechanism.webp)

![Hiện chi tiết liệt kê từng vấn đề kèm gợi ý](/screenshots/vi/ui-diagnostics.webp){.shot-lg}

Trang [Khắc phục sự cố](/vi/reference/troubleshooting) giải thích từng thông báo.

## Thanh dưới cùng {#bottom-bar}

Sáu thẻ, mỗi thẻ có một thanh công cụ và một bảng sửa được. Các thẻ cho biết mô hình có bao nhiêu đối tượng mỗi loại. Nút **?** ở bên phải giải thích thẻ đang mở, nút **?** cạnh một số tiêu đề cột cũng vậy. Kéo dải thẻ lên hoặc xuống để đổi kích thước thanh, hoặc thu nhỏ nó bằng nút ở bên phải.

| Thẻ | Thanh công cụ | Bảng |
| --- | --- | --- |
| **Nút** | Thêm nút (hộp thoại), Thêm nút (chuột) | Nhãn, tọa độ, **Bậc tự do bị chặn** (ký hiệu gối tựa, Dx, Dz, Ry, góc gối tựa α), tải trọng, sửa, xóa |
| **Phần tử** | Thêm phần tử (hộp thoại), Thêm phần tử (chuột) | Nhãn, loại, nút (kèm nút đổi thứ tự), vật liệu, tiết diện, **Khớp đầu thanh**, tải trọng, ma trận độ cứng, xóa |
| **Tải trọng** | Thêm tải nút, Thêm tải phần tử | Loại, đối tượng, các thành phần sửa được, sửa, xóa |
| **Vật liệu** | Thêm vật liệu, Thư viện vật liệu | Nhãn, E, G, α<sub>T</sub>, xóa |
| **Tiết diện** | Thêm tiết diện, Thư viện tiết diện, Tiết diện đa giác | Hình dạng, nhãn, A, I<sub>y</sub>, h, k, sửa hình, xóa |
| **Kết quả** | Kết quả tại nút, Kết quả phần tử, Xuất CSV, Sao chép | Chuyển vị và góc xoay của từng nút, hoặc nội lực đầu phần tử của từng phần tử |

Sửa ô ngay tại chỗ: nhấp, gõ giá trị, rồi nhấn <kbd>Enter</kbd> (hoặc <kbd>Esc</kbd> để rời ô). Giá trị được hiển thị và nhập theo [đơn vị hiện tại](/vi/essentials/units-settings).

## Các thẻ phía trên vùng hiển thị {#tabs-above-the-viewer}

**Mô hình** hiển thị khung vẽ. **Cài đặt** hiển thị phần cài đặt toàn màn hình, để bạn đổi màu hoặc đơn vị rồi chuyển lại xem kết quả. Ô đơn vị và *Thêm cài đặt* mở cùng phần cài đặt đó dưới dạng hộp thoại phía trên mô hình.

## Cửa sổ nổi {#floating-windows}

**Ma trận độ cứng** (từ bảng của phần tử hoặc từ bảng Phần tử) mở một cửa sổ chứa ma trận độ cứng 6 × 6 của phần tử trong hệ tọa độ tổng thể. **Sửa** trong menu khung vẽ mở một bảng chứa các đối tượng đang chọn. Kéo cửa sổ bằng thanh tiêu đề và đóng bằng nút ×.
