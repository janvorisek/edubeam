---
description: "Dùng EduBeam trong bài giảng và bài tập: liên kết chia sẻ trong giáo trình, chế độ trình xem để nhúng, bài tập tự kiểm tra và sử dụng trên máy tính phòng thực hành."
---

# Giảng dạy với EduBeam

<Edubeam /> ra đời trong giảng đường, và đó vẫn là nơi nó phát huy tốt nhất: một mô hình trên máy chiếu phản hồi ngay khi bạn thay đổi, và cùng mô hình đó có trên máy tính của từng sinh viên qua một liên kết. Trang này tổng hợp những gì giảng viên dùng nhiều nhất.

## Trong giờ giảng {#in-the-lecture}

- **Để hàng ghế cuối cũng đọc được.** Trong *Cài đặt → Cài đặt hiển thị*, tăng **Cỡ chữ** lên 18–20 px và **Kích cỡ gối tựa** lên 130–150 %. Tăng **Tỷ lệ kết quả** nếu biểu đồ trông quá nhỏ trên màn hình lớn.
- **Mỗi lần chỉ cho xem một thứ.** Bỏ đánh dấu mọi thứ trong tùy chọn hiển thị trừ đại lượng bạn đang giảng, rồi lần lượt thêm các đại lượng khác.
- **Thay đổi mô hình trực tiếp.** Kéo một gối tựa, đánh dấu `Ry`, thêm một khớp. Sinh viên thấy ngay nguyên nhân và kết quả, và <kbd>Ctrl</kbd>+<kbd>Z</kbd> đưa bạn trở lại.
- **Để bộ giải giải thích hệ biến hình.** Giải phóng thừa một khớp và EduBeam sẽ cho đường nét đứt của hệ biến hình chuyển động và khoanh tròn các khớp gây ra nó. Đây là dịp tốt để bàn về tính ổn định.
- **Dùng ngôn ngữ và hệ trục của sinh viên.** Chọn ngôn ngữ giao diện, đơn vị SI hoặc hệ Mỹ, và trục z hướng xuống hay y hướng lên cho khớp với giáo trình của bạn.

![Hệ biến hình hiện rõ: các khớp tại B và C cho phép khung chuyển vị ngang](/screenshots/vi/ui-mechanism.webp)

## Trong giáo trình và bài tập {#in-lecture-notes-and-assignments}

Một liên kết chia sẻ chứa toàn bộ mô hình, nên nó dùng được ở mọi nơi đặt được liên kết: tệp PDF, trang trình chiếu, trang LMS, e-mail.

1. Dựng mô hình và nhấn **Chia sẻ mô hình → Sao chép**.
2. Dán liên kết vào giáo trình. Liên kết từ các phiên bản EduBeam cũ vẫn tiếp tục hoạt động, nên tài liệu của bạn vẫn dùng được năm này qua năm khác.
3. Sinh viên mở liên kết sẽ nhận được bản sao riêng để thử nghiệm. Mọi thay đổi của họ không ảnh hưởng đến bạn hay các sinh viên khác.

Các dạng liên kết hữu ích:

| Liên kết | Mở ra |
| --- | --- |
| `https://run.edubeam.app/?model=…` | Mô hình, sẵn sàng để chỉnh sửa |
| `https://run.edubeam.app/?viewer=1&model=…` | Mô hình ở [chế độ trình xem](/vi/essentials/import-export#embed-a-read-only-viewer), để nhúng vào `<iframe>` |
| `https://run.edubeam.app/?panel=examples` | Thư viện ví dụ |
| `https://run.edubeam.app/?lang=vi` | Ứng dụng bằng tiếng Việt (hoặc bất kỳ [mã ngôn ngữ nào khác](/vi/essentials/import-export#url-parameters)) |

::: warning Mở liên kết sẽ thay thế mô hình riêng của sinh viên
Mô hình họ đang có được chuyển vào **☰ → Kết cấu gần đây** và có thể khôi phục, và ứng dụng sẽ thông báo điều đó. Dù vậy, hãy nhắc sinh viên lưu những bài làm quan trọng bằng **Lưu dự án** trước khi mở liên kết từ lớp học.
:::

## Bài tập sinh viên tự kiểm tra được {#assignments-students-can-check-themselves}

EduBeam cho sinh viên phản hồi ngay về kết quả tính tay mà không để lộ phương pháp giải:

- Yêu cầu tính tay phản lực, nội lực và một chuyển vị, rồi cho sinh viên dựng mô hình và so sánh. Trang [Kiểm tra kết quả bằng tính tay](/vi/guide/verification) có sẵn các công thức.
- Hỏi *vì sao* một kết quả lại khác: biến dạng trượt, thiếu một khớp, tải trọng nhập theo hệ trục địa phương thay vì tổng thể.
- Yêu cầu sinh viên nộp kèm liên kết chia sẻ hoặc tệp `project.json` cùng bài tính. Bạn có thể mở nó và thấy chính xác những gì họ đã mô hình hóa.
- Để làm báo cáo, sinh viên có thể xuất hình vẽ dạng **SVG** (sắc nét trong Word và LaTeX) và kết quả dạng **CSV**.

## Bài tập có sẵn {#ready-made-exercises}

- Trang [Ví dụ](/vi/examples/) có sáu mô hình, mỗi mô hình kèm gợi ý bài tập.
- Các bài hướng dẫn [khung ba khớp](/vi/tutorials/three-hinged-frame) và [dàn phẳng](/vi/tutorials/truss) là những ví dụ giải hoàn chỉnh, có kiểm tra bằng tính tay.
- [Bắt đầu nhanh](/vi/guide/quick-start) dùng tốt làm tài liệu cho buổi thực hành đầu tiên: chỉ mất khoảng mười phút.

## Giúp sinh viên bắt đầu {#getting-students-started}

Người dùng mới thấy hộp thoại chào mừng với hai lựa chọn có hướng dẫn: **Xem giới thiệu** (tham quan giao diện) và **Vẽ dầm đầu tiên** (bài tập bảy bước với chuột). Cả hai cũng có trong menu ☰. Nhiều giảng viên chỉ đơn giản nói “mở run.edubeam.app và chọn *Vẽ dầm đầu tiên*” vào đầu buổi thực hành đầu tiên.

## Ngoại tuyến và máy tính phòng thực hành {#offline-and-lab-computers}

EduBeam là một ứng dụng web tiến bộ (PWA). Khi một máy tính đã tải nó, ứng dụng vẫn hoạt động khi không có kết nối, và trình duyệt có thể đề nghị cài đặt nó. Mô hình và cài đặt được lưu theo từng hồ sơ trình duyệt, nên trên máy tính dùng chung ở phòng thực hành, sinh viên nên lưu bài làm thành tệp hoặc liên kết.
