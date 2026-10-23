---
description: "Chọn ngôn ngữ, đơn vị SI hoặc hệ Mỹ, định dạng số, trục y hướng lên hoặc z hướng xuống, cài đặt hiển thị và điều khiển, và xem EduBeam lưu những gì trong trình duyệt của bạn."
---

# Đơn vị và cài đặt

Có ba cách để mở cài đặt:

- thẻ **Cài đặt** phía trên vùng hiển thị, mở cài đặt ở chế độ toàn màn hình;
- **ô đơn vị** ở góc dưới bên phải vùng hiển thị, mở cài đặt ở mục *Ngôn ngữ và khu vực*;
- **Thêm cài đặt** bên dưới các tùy chọn hiển thị, mở cài đặt ở mục *Cài đặt hiển thị*.

Cài đặt được lưu trong trình duyệt và vẫn còn sau khi tải lại trang. **Đặt lại cài đặt** khôi phục các giá trị mặc định của vùng hiển thị, định dạng số, hệ trục, nút kéo màn hình và đơn vị theo khu vực của bạn; ngôn ngữ được giữ nguyên.

## Ngôn ngữ và khu vực {#language-locale}

![Cài đặt → Ngôn ngữ và khu vực](/screenshots/vi/settings-language.webp)

**Ngôn ngữ.** Giao diện có 15 ngôn ngữ. Bạn cũng có thể mở ứng dụng với `?lang=<code>`: `en`, `cs`, `de`, `fr`, `es`, `pt`, `pl`, `cn`, `th`, `uk`, `ru`, `tr`, `hi`, `vi`, `it`.

**Định dạng số.** Cách ghi giá trị kết quả: *Tự động*, *Khoa học* (mặc định) hoặc *Kỹ thuật*. Xem [Định dạng số](/vi/essentials/results#number-format).

**Hệ tọa độ.** *x sang phải, z xuống dưới* (mặc định) hoặc *x sang phải, y lên trên*. Tùy chọn y hướng lên đổi dấu các giá trị theo phương đứng và góc gối tựa, đồng thời đổi tên các trục trong mọi ô nhập, bảng, chú thích và tệp xuất. Mô hình và tệp đã lưu không thay đổi. Xem [Trục y hướng lên](/vi/elements/conventions#y-up-axes).

![Khung ba khớp với trục y hướng lên: biểu tượng hệ trục ở góc cho thấy y hướng lên](/screenshots/vi/settings-y-up.webp){.shot-lg}

**Hệ đơn vị.** *SI (hệ mét)* hoặc *Hệ Mỹ (imperial)* đặt tất cả các đơn vị bên dưới trong một bước. Nếu sau đó bạn đổi bất kỳ đơn vị nào, hệ đơn vị sẽ hiện là *Tùy chỉnh*. Ở lần truy cập đầu tiên, bạn chọn trong hộp thoại chào mừng; trước đó, EduBeam chỉ đoán hệ Mỹ khi trình duyệt đặt khu vực Mỹ *và* máy tính ở múi giờ Mỹ.

**Đơn vị.** Mỗi đại lượng có đơn vị riêng. Ô nhập, bảng, chú thích và nhãn biểu đồ đều dùng đơn vị đã chọn, và khi đổi đơn vị, các giá trị hiển thị được quy đổi theo. Bản thân mô hình được lưu theo SI, nên chuyển qua lại không mất gì, và liên kết chia sẻ mở cùng một mô hình với bất kỳ đơn vị nào.

| Đại lượng | Lựa chọn | SI | Hệ Mỹ |
| --- | --- | --- | --- |
| Chiều dài (hình học) | m, cm, mm, ft, in | m | ft |
| Kích thước tiết diện | m, cm, mm, ft, in | m | in |
| Chuyển vị | m, cm, mm, ft, in | m | in |
| Diện tích | m², cm², mm², ft², in² | m² | in² |
| Mô men quán tính | m⁴, cm⁴, mm⁴, ft⁴, in⁴ | m⁴ | in⁴ |
| Khối lượng | kg, lb | kg | lb |
| Lực | N, kN, MN, kgf, Tonf, lbf, kip | kN | kip |
| Mô men uốn | Nmm, Nm, kNm, MNm, Tonf·m, lbf·in, lbf·ft, kip·in, kip·ft | kNm | kip·ft |
| Ứng suất (E, G) | Pa, kPa, MPa, GPa, ksc, psi, ksi, psf, ksf | MPa | ksi |
| Nhiệt độ | °C, °F | °C | °F |

Tải phân bố dùng đơn vị *lực / chiều dài* đã chọn (kN/m trong SI, kip/ft trong hệ Mỹ), còn khối lượng riêng dùng *khối lượng / chiều dài³*. Hệ số giãn nở nhiệt theo đơn vị nhiệt độ (1/K hoặc 1/°F). Tải nhiệt độ là *độ thay đổi* nhiệt độ, nên 10 °C tương ứng 18 °F. Góc xoay luôn tính bằng radian.

Tonf là tấn lực hệ mét (1000 kgf), không phải tấn ngắn (short ton) của Mỹ. Đơn vị hệ Mỹ được quy đổi theo định nghĩa chính xác (1 ft = 0,3048 m, 1 kip = 4448,2216 N). Với đơn vị feet, hãy nhập số thập phân như `5,5`; thước đo và dấu thập hiển thị theo feet và inch (5′-6″).

## Cài đặt hiển thị {#viewer-settings}

![Cài đặt → Cài đặt hiển thị, bên phải là bản xem trước trực tiếp](/screenshots/vi/settings-viewer.webp)

**Xem trước hiển thị** bên cạnh các cài đặt cho thấy một mô hình nhỏ phản hồi theo mọi thay đổi. Các nhãn bên dưới chọn kết quả được hiển thị, và khi bạn nhấp vào một màu, bản xem trước chuyển sang kết quả tương ứng.

**Lưới**
- **Hiện lưới** (<kbd>G</kbd>) vẽ lưới và thước đo.
- **Bắt dính lưới** (<kbd>S</kbd>) làm các nút bạn đặt hoặc kéo bắt dính theo bước lưới.
- **Hiện dấu thập** đánh dấu vị trí con trỏ trên thước đo để bạn đọc được tọa độ (chỉ khi dùng chuột).
- **Bước bắt dính lưới** là khoảng cách lưới theo đơn vị chiều dài: mặc định 0,1 m, hoặc 0,5 ft với đơn vị hệ Mỹ. Khi bạn chuyển giữa hệ mét và hệ Mỹ, bước lưới còn ở giá trị mặc định sẽ chuyển sang mặc định của hệ kia; bước lưới do bạn tự đặt được giữ nguyên.

**Kích cỡ**
- **Tỷ lệ kết quả** (8–120 px, mặc định 48) là chiều cao trên màn hình của tung độ biểu đồ hoặc chuyển vị lớn nhất. Mỗi biểu đồ được co giãn theo giá trị lớn nhất của chính nó, nên đây chỉ là thiết lập hiển thị; hãy chỉnh khi biểu đồ quá lớn hoặc quá nhỏ.
- **Kích cỡ gối tựa** (50–150 %) và **Cỡ chữ** (10–20 px). Chữ lớn hơn giúp dễ nhìn trên máy chiếu.

**Hướng nhãn kết quả**: *Vuông góc với biểu đồ* (nhãn đi theo biểu đồ) hoặc *Luôn nằm ngang*.

**Kiểm tra mô hình**
- **Hiện cách kết cấu không ổn định có thể chuyển động** vẽ đường nét đứt của hệ biến hình.
- **Tạo hoạt ảnh chuyển động** cho đường nét đó dao động qua lại.

**Màu sắc**: màu riêng cho nút, phần tử, tải trọng, hình dạng biến dạng, lực dọc, lực cắt, mô men uốn và phản lực. Mặc định: N xanh dương, V xanh lá, M đỏ, phản lực tím, tải trọng cam.

## Điều khiển và phím tắt {#controls-shortcuts}

**Kéo màn hình bằng** chọn nút chuột dùng để kéo khung vẽ: *Con lăn hoặc nút phải* (mặc định), *Con lăn chuột* hoặc *Nút phải*. Danh sách đầy đủ các phím tắt có ở trang [Bàn phím, chuột và cảm ứng](/vi/reference/shortcuts).

## Những gì được lưu trong trình duyệt {#what-is-stored-in-your-browser}

Ngoài cài đặt, EduBeam còn lưu trong bộ nhớ cục bộ (local storage) của trình duyệt:

- **mô hình hiện tại**, được lưu sau mỗi thay đổi, nên khi tải lại thẻ hoặc mở lại ứng dụng, mô hình sẽ được khôi phục;
- **Kết cấu gần đây**: 10 mô hình gần nhất mà bạn đã xóa hoặc thay thế.

Cả hai chỉ thuộc về từng trình duyệt và từng thiết bị, và sẽ mất khi bạn xóa dữ liệu trang web. Hãy dùng [Lưu dự án hoặc Chia sẻ mô hình](/vi/essentials/import-export) để giữ lại một mô hình hoặc chuyển nó sang nơi khác.
