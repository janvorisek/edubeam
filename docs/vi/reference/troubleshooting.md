---
description: "Vì sao không có kết quả nào được vẽ và cách khắc phục: thiếu gối tựa, hệ biến hình, thông báo của bộ giải, lỗi và cảnh báo, kết quả trông có vẻ sai, và cách báo lỗi."
---

# Khắc phục sự cố

## Không có kết quả nào được vẽ {#no-results-are-drawn}

Kết quả chỉ hiện khi mô hình có thể giải được. Hãy kiểm tra theo thứ tự sau:

1. **Đọc thông báo ở góc trên bên trái vùng hiển thị.**
   - *Chưa có vật liệu nào.* / *Chưa có tiết diện nào.*: thêm bằng nút **Thêm mới**.
   - Nhãn màu xanh **Cần gối tựa**: mô hình chỉ đơn giản là chưa hoàn chỉnh. Hãy thêm gối tựa. Trỏ vào nhãn để xem, dưới dạng đường nét đứt, kết cấu vẫn có thể chuyển động thế nào.
   - **Thông báo màu đỏ**: có gì đó sai. Thông báo nêu tên vấn đề, hoặc ghi *Lỗi trong mô hình: N* khi có nhiều lỗi. Nhấp **Hiện chi tiết** và sửa từng mục (xem bảng bên dưới). Các nút hoặc khớp liên quan được khoanh tròn trên khung vẽ.
   - **Thông báo màu vàng**: cảnh báo. Mô hình vẫn được giải; bạn có thể ẩn chúng.
2. **Đủ gối tựa chưa?** Bộ giải cần ít nhất ba bậc tự do bị chặn, và các gối tựa phải giữ được kết cấu. Dầm đặt trên hai gối di động (Dz + Dz) chỉ có hai liên kết và sẽ trượt đi. Hãy thêm `Dx` ở đâu đó, hoặc `Ry` tại một gối tựa.
3. **Các phần tử đã được nối với nhau chưa?** Hai nút có cùng tọa độ vẫn là hai nút riêng biệt. Xóa nút thừa và nối lại, hoặc đặt nút lên phần tử bằng **Nối vào kết cấu**.
4. **Quá nhiều khớp?** Khớp ở cả hai đầu cột, hoặc một ô vuông gồm các thanh liên kết khớp mà không có thanh chéo, sẽ tạo thành hệ biến hình. EduBeam khoanh tròn các khớp và cho thấy chuyển động.
5. **Độ cứng bằng 0?** `E`, `A` hoặc `Iy` vô tình nhập bằng 0, hoặc sai đơn vị, khiến một phần kết cấu chuyển động gần như không có sức cản. EduBeam báo trường hợp này là *không ổn định*.

![Hiện chi tiết liệt kê từng vấn đề kèm gợi ý, và có thể cho thấy chuyển động](/screenshots/vi/ui-diagnostics.webp){.shot-lg}

## Thông báo {#messages}

**Hiện chi tiết** mở một hộp thoại có tiêu đề *Không thể giải mô hình* (lỗi), *Chưa thể giải* (vẫn còn thiếu gối tựa) hoặc *Cảnh báo mô hình*. Liên kết **Khắc phục sự cố** trong đó dẫn đến trang này.

### Còn thiếu {#still-needed}

| Thông báo | Ý nghĩa / cách sửa |
| --- | --- |
| *Kết cấu cần gối tựa trước khi có thể giải.* | Tổng cộng có ít hơn ba bậc tự do bị chặn. Hãy thêm gối tựa. |
| *Một phần riêng của kết cấu (nút …) có ít hơn 3 bậc tự do bị chặn và có thể chuyển động tự do.* | Mô hình bị tách thành nhiều phần và một phần đang “trôi nổi”. Hãy nối nó vào, hoặc đặt gối tựa cho nó. |

### Lỗi {#errors}

| Thông báo | Ý nghĩa / cách sửa |
| --- | --- |
| *Kết cấu có đủ gối tựa nhưng chúng không giữ được nó: kết cấu vẫn có thể …* | Các gối tựa đều song song với nhau, hoặc đường tác dụng của chúng đồng quy tại một điểm. Đường nét đứt cho thấy chuyển động; hãy đổi phương của một gối tựa. Nếu chỉ một phần bị ảnh hưởng, thông báo sẽ nêu *một phần riêng của kết cấu*. |
| *Các gối tựa giữ được kết cấu, nhưng nó vẫn là hệ biến hình: các thanh có thể xoay quanh khớp tại nút …* | Các khớp cho phép các thanh xoay tương đối với nhau, như khung có khớp ở đỉnh cả hai cột hoặc ô vuông liên kết khớp không có thanh chéo. Hãy bỏ một khớp, hoặc thêm một thanh hay một gối tựa. |
| *Kết cấu không ổn định: nút … chuyển động gần như không có sức cản.* | Gần như là hệ biến hình, hoặc có độ cứng gần bằng 0. Kiểm tra gối tựa, khớp và các giá trị `E`, `A` và `Iy`. |
| *Kết cấu là hệ biến hình: ma trận độ cứng suy biến.* | Có phần nào đó chuyển động tự do mà các kiểm tra ở trên không phát hiện. Hãy kiểm tra để mỗi phần được giữ bởi ít nhất ba liên kết và các khớp không để thanh nào xoay tự do. |
| *Phần tử … tham chiếu nút / vật liệu / tiết diện … không tồn tại.* | Đối tượng được tham chiếu đã bị xóa, thường do tệp JSON bị sửa bằng tay. Gán lại trong bảng *Phần tử*. |
| *Phần tử … phải tham chiếu đúng 2 nút.* | Phần tử bị hỏng trong tệp đã nhập. Hãy xóa và tạo lại. |
| *Tải trọng nút / Chuyển vị cưỡng bức #n tham chiếu nút … không tồn tại.* | Xóa tải trọng hoặc gán cho nó một nút. |
| *Tải trọng phần tử #n tham chiếu phần tử … không tồn tại.* | Xóa tải trọng. |
| *Bộ giải thất bại do mô hình không nhất quán bên trong…* | Lỗi chung. Hoàn tác bước vừa làm, hoặc lưu tệp và [báo lỗi](https://github.com/janvorisek/edubeam/issues). |

### Cảnh báo {#warnings}

Mô hình vẫn được giải, nhưng hãy kiểm tra những điểm sau:

| Thông báo | Ý nghĩa / cách sửa |
| --- | --- |
| *Nút … không nối với phần tử nào và bị bộ giải bỏ qua.* | Nút thừa. Hãy xóa hoặc nối nó vào. |
| *Nút … có gối tựa nhưng không có phần tử nào nối vào, nên gối tựa không chịu lực gì.* | Gối tựa đặt trên một nút thừa. |
| *Phần tử … tham chiếu cùng một nút ở cả hai đầu.* | Phần tử có chiều dài bằng 0. Hãy xóa nó. |
| *Tải trọng nút / Chuyển vị cưỡng bức #n chứa giá trị không hợp lệ.* | Có thành phần không phải là số. Hãy sửa tải trọng. |

## Kết quả trông có vẻ sai {#results-look-wrong}

| Hiện tượng | Nguyên nhân có thể |
| --- | --- |
| Tải trọng tác dụng hướng lên | Trục **z tổng thể hướng xuống**, nên `Fz`/`fz` dương hướng xuống. Giá trị âm hướng lên. Xem [quy ước](/vi/elements/conventions). Với trục y hướng lên thì ngược lại. |
| Độ võng lớn hoặc nhỏ gấp 1000 lần | Nhầm đơn vị: `E` nhập theo Pa trong khi đơn vị là MPa, hoặc `Iy` theo cm⁴ trong khi đơn vị là m⁴. Hãy kiểm tra ô đơn vị ở góc dưới bên phải vùng hiển thị. |
| Độ võng lớn hơn một chút so với công thức trong sách | Biến dạng trượt Timoshenko. Tăng hệ số hiệu chỉnh cắt của tiết diện, hoặc dùng thanh mảnh, để tiến gần giá trị Euler–Bernoulli. Xem [Kiểm tra kết quả bằng tính tay](/vi/guide/verification). |
| Dấu trông có vẻ “sai” | Hãy đọc dấu từ nhãn, không phải từ phía của biểu đồ. M dương là căng thớ dưới. Nội lực đầu phần tử trong *Kết quả phần tử* theo trục địa phương của phần tử, không theo quy ước N-V-M. |
| Hai cột giống hệt nhau có lực cắt trái dấu | Dấu của V theo chiều của từng phần tử. Hãy đổi thứ tự nút của một cột để so sánh. |
| Các số như `4 · 10¹` | Định dạng số khoa học. Chọn *Tự động* trong *Cài đặt → Ngôn ngữ và khu vực → Định dạng số*. |
| Biểu đồ quá to hoặc quá nhỏ | Chỉ là hiển thị. Chỉnh **Tỷ lệ kết quả** trong *Cài đặt → Cài đặt hiển thị*. |
| Tải theo hệ tọa độ địa phương hướng sai chiều | Trục x địa phương của phần tử chạy từ nút *đầu* đến nút *cuối*. Hãy đổi thứ tự nút, hoặc đổi dấu. |
| Tải trên thanh xiên bị lệch | **LCS** được đánh dấu theo mặc định, nên `fz` tác dụng vuông góc với thanh. Bỏ đánh dấu để có tải theo phương đứng. |
| Tải nhiệt độ không gây tác dụng gì | Kết cấu tĩnh định biến dạng tự do dưới tác dụng nhiệt độ, không phát sinh nội lực. Kiểm tra α ≠ 0 và, với chênh lệch nhiệt độ, kiểm tra chiều cao tiết diện h đã được nhập. |

## Sự cố giao diện {#interface-issues}

| Hiện tượng | Cách sửa |
| --- | --- |
| Phím tắt không có tác dụng | Hãy nhấp vào khung vẽ trước: phím bị bỏ qua khi một ô nhập văn bản đang được chọn. |
| Không kéo được màn hình | Theo mặc định, kéo màn hình bằng nút giữa hoặc nút phải chuột; đổi trong *Cài đặt → Điều khiển và phím tắt*. Trên trackpad, cuộn hai ngón sẽ thu phóng; nhấp và kéo bằng hai ngón để kéo màn hình. |
| Mô hình của tôi biến mất | Khi mở liên kết, tệp hoặc ví dụ, và khi xóa kết cấu, mô hình cũ được giữ lại: **☰ → Kết cấu gần đây**, hoặc <kbd>Ctrl</kbd>+<kbd>Z</kbd>. |
| Sai ngôn ngữ | *Cài đặt → Ngôn ngữ và khu vực*, hoặc thêm `?lang=vi` vào địa chỉ. |
| Thay đổi cài đặt không được giữ | Bộ nhớ cục bộ (local storage) bị chặn (cửa sổ ẩn danh, chế độ bảo mật nghiêm ngặt). Cài đặt, tự động lưu và Kết cấu gần đây đều cần nó. |

## Báo lỗi {#reporting-a-bug}

Hãy mở một [issue trên GitHub](https://github.com/janvorisek/edubeam/issues), ghi rõ trình duyệt và hệ điều hành, kết quả bạn mong đợi, và hữu ích nhất là một **liên kết chia sẻ** hoặc **tệp dự án** tái hiện được vấn đề.
