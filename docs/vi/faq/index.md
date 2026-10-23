---
description: "Giải đáp các câu hỏi thường gặp về EduBeam: chi phí và tài khoản, trình duyệt và thiết bị, khôi phục mô hình bị mất, dùng ngoại tuyến, nơi lưu dữ liệu và mẹo mô hình hóa."
---

# Câu hỏi thường gặp

## Tổng quan {#general}

### EduBeam là gì? {#what-is-edubeam}

Một chương trình tính toán dầm, khung và dàn phẳng miễn phí, mã nguồn mở, chạy ngay trên trình duyệt, dành cho sinh viên, giảng viên và kỹ sư muốn có phản hồi tức thì. Xem [Giới thiệu](/vi/guide/introduction).

### Có thật sự miễn phí không? Có cần tài khoản không? {#is-it-really-free-do-i-need-an-account}

Có, và không. Mở [run.edubeam.app](https://run.edubeam.app/?lang=vi) và bắt đầu mô hình hóa. Không cần tài khoản, không cần cài đặt và không giới hạn sử dụng. Mã nguồn có trên [GitHub](https://github.com/janvorisek/edubeam).

### EduBeam chạy trên trình duyệt và thiết bị nào? {#which-browsers-and-devices-work}

Mọi phiên bản hiện hành của Chrome, Edge, Firefox hoặc Safari. Máy tính bảng và điện thoại cũng dùng được: chạm để chọn hoặc đặt, kéo một nút để di chuyển nó, kéo ở chỗ khác để dịch chuyển khung nhìn, chụm hai ngón để thu phóng, và nhấn giữ để mở menu khung vẽ. Tuy vậy, dùng chuột và bàn phím vẫn mô hình hóa nhanh hơn. Xem [Bàn phím, chuột và cảm ứng](/vi/reference/shortcuts#touch).

### Tôi bị mất mô hình. Có lấy lại được không? {#i-lost-my-model-can-i-get-it-back}

Nhiều khả năng là được. Khi bạn xóa mô hình, hoặc mở một liên kết, tệp hay ví dụ đè lên nó, mô hình cũ được giữ trong **☰ → Kết cấu gần đây** (10 mô hình gần nhất), và <kbd>Ctrl</kbd>+<kbd>Z</kbd> hoàn tác việc thay thế. Cả hai chỉ nằm trong trình duyệt của bạn.

### Có dùng được khi không có mạng không? {#can-i-use-it-offline}

EduBeam là một ứng dụng web tiến bộ (PWA): sau khi tải xong, nó vẫn chạy khi không có kết nối, và trình duyệt có thể đề nghị cài đặt nó. Khi có phiên bản mới, một hộp thoại sẽ hỏi bạn trước khi cập nhật.

### Dữ liệu của tôi được lưu ở đâu? {#where-is-my-data-stored}

Chỉ trong trình duyệt của bạn. Mô hình không bao giờ được gửi lên máy chủ; liên kết chia sẻ *chính là* mô hình. Xem [Nhập, xuất và chia sẻ](/vi/essentials/import-export).

## Mô hình hóa {#modelling}

### Làm sao tạo ngàm, gối cố định hoặc gối di động? {#how-do-i-make-a-fixed-pinned-roller-support}

Nhấp vào nút, mở **Gối tựa tại nút** và chọn ký hiệu: gối cố định, gối di động, ngàm, ngàm trượt và nhiều loại khác. Hoặc đánh dấu các bậc tự do: **Dx + Dz + Ry** = ngàm, **Dx + Dz** = gối cố định, **Dz** = gối di động. Mọi tổ hợp được liệt kê trong [Nút và gối tựa](/vi/essentials/nodes-supports#supports).

### Làm sao tạo dàn? {#how-do-i-make-a-truss}

Dùng phần tử dầm và trong thẻ *Phần tử*, đánh dấu **cả hai Khớp đầu thanh** cho mọi thanh, hoặc đánh dấu *Khớp đầu* và *Khớp cuối* trên thanh thông báo trước khi vẽ các thanh bằng chuột. Đặt tải trọng tại các mắt dàn. [Bài hướng dẫn về dàn](/vi/tutorials/truss) đi qua toàn bộ một ví dụ.

### Làm sao đặt khớp trong khung? {#how-do-i-put-a-hinge-in-a-frame}

Đánh dấu **Khớp cuối** của phần tử nằm ở phía nút khung mà bạn muốn giải phóng mô men. Đặt khớp cho *một* phần tử tại một nút chỉ giải phóng riêng phần tử đó.

### Làm sao thêm gối tựa hoặc lực tập trung ở giữa dầm? {#how-do-i-add-a-support-or-a-point-load-in-the-middle-of-a-beam}

Thêm một nút lên dầm bằng *Thêm bằng chuột* và chọn **Nối vào kết cấu** — dầm được chia làm hai. Nếu chỉ cần lực tập trung thì bạn thậm chí không cần nút: dùng tải trọng phần tử **Tải tập trung** kèm vị trí.

### Có tính được trọng lượng bản thân không? {#can-i-apply-self-weight}

Không tự động. Hãy nhập nó dưới dạng tải phân bố đều $f_z = \rho g A$.

### Có mô hình hóa được gối tựa xiên không? {#can-i-model-inclined-supports}

Có — đặt **Góc LCS của nút** cho nút; khi đó các bậc tự do của nút được hiểu theo hệ trục đã xoay.

### Có trường hợp tải hoặc tổ hợp tải không? {#are-there-load-cases-or-combinations}

Không, chỉ có một trường hợp tải. Hãy mô hình hóa từng trường hợp riêng rồi lưu hoặc chia sẻ.

### Tại sao tải trọng của tôi hướng lên trên? {#why-do-my-loads-point-up}

Vì trục z tổng thể hướng **xuống**: `Fz` dương hướng xuống dưới. Xem [quy ước](/vi/elements/conventions). Nếu bạn thích trục đứng hướng lên, hãy chuyển sang hệ trục y hướng lên trong *Cài đặt → Ngôn ngữ và khu vực → Hệ tọa độ*.

## Kết quả {#results}

### Tại sao không có nút “Giải”? {#why-is-there-no-solve-button}

Mô hình được giải tự động sau mỗi thay đổi. Nếu không thấy kết quả, nghĩa là mô hình chưa giải được — [Khắc phục sự cố](/vi/reference/troubleshooting) liệt kê những gì cần kiểm tra.

### Tại sao độ võng hơi khác so với công thức? {#why-does-my-deflection-differ-slightly-from-the-formula}

EduBeam dùng dầm Timoshenko, nên độ võng có kể đến biến dạng trượt. Với thanh mảnh, chênh lệch nhỏ hơn nhiều so với 1 %. Chi tiết và các so sánh mẫu có trong [Kiểm tra kết quả bằng tính tay](/vi/guide/verification).

### Kết quả chính xác đến đâu? Có cần thêm phần tử không? {#how-accurate-are-the-results-do-i-need-more-elements}

Với phân tích tĩnh tuyến tính, phần tử dầm cho kết quả chính xác với mọi loại tải được hỗ trợ, nên mỗi thanh chỉ cần một phần tử. Chỉ cần thêm nút ở nơi bạn muốn đặt gối tựa, khớp, thay đổi tiết diện hoặc cần một nút để đặt tải.

### Phản lực được liệt kê ở đâu? {#where-are-the-reactions-listed}

Trong vùng hiển thị, dưới dạng mũi tên kèm giá trị (**Phản lực** trong tùy chọn hiển thị, bật sẵn theo mặc định). Chúng cũng có trong tệp từ **Kết quả → Xuất CSV**, và khi dùng **Sao chép**. Chuyển vị nút và nội lực đầu phần tử nằm trong thẻ **Kết quả**.

## Tệp và chia sẻ {#files-sharing}

### Làm sao chia sẻ mô hình? {#how-do-i-share-a-model}

**Chia sẻ mô hình** → **Sao chép**. Liên kết chứa toàn bộ mô hình. Người nhận có bản sao riêng để chỉnh sửa; không có cộng tác trực tiếp theo thời gian thực. Xem thêm [Giảng dạy với EduBeam](/vi/guide/teaching).

### Có nhúng mô hình vào website hoặc slide được không? {#can-i-embed-a-model-on-my-website-or-in-slides}

Được: thêm `&viewer=1` vào liên kết chia sẻ và đặt nó trong một `<iframe>`. Xem [Nhúng trình xem](/vi/essentials/import-export#embed-a-read-only-viewer).

### Có xuất được hình ảnh hoặc bảng không? {#can-i-export-images-or-tables}

Được. **☰ → Xuất hình ảnh** (<kbd>Ctrl</kbd>+<kbd>P</kbd>) lưu hình vẽ thành PNG hoặc SVG, theo kích thước hoặc tỷ lệ bạn chọn. **Kết quả → Xuất CSV** lưu cả hai bảng kết quả, còn **Sao chép** đưa chúng vào bộ nhớ tạm để dán vào bảng tính. Xem [Nhập, xuất và chia sẻ](/vi/essentials/import-export#export-an-image).

### Có tạo mô hình bằng lập trình được không? {#can-i-generate-models-programmatically}

Được. Tệp dự án là JSON thuần theo đơn vị SI — xem [mô tả định dạng](/vi/essentials/import-export#project-file-format) — và có thể mở bằng *Mở dự án* hoặc kéo thả.

## Hỗ trợ {#support}

### Làm sao báo lỗi hoặc đề xuất tính năng? {#how-do-i-report-a-bug-or-request-a-feature}

Mở một issue trên [GitHub](https://github.com/janvorisek/edubeam/issues) và đính kèm liên kết chia sẻ hoặc tệp dự án tái hiện được vấn đề. Hỗ trợ riêng: [support@edubeam.app](mailto:support@edubeam.app).
