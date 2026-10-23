---
description: "Lưu và mở tệp dự án, chia sẻ mô hình qua liên kết, xuất hình ảnh và kết quả, nhúng trình xem trực tiếp và dùng tham số URL. Mọi thứ đều nằm trong trình duyệt của bạn."
---

# Nhập, xuất và chia sẻ

Mọi thứ trong <Edubeam /> đều diễn ra trong trình duyệt của bạn. Không có gì được tải lên máy chủ: liên kết chia sẻ chứa chính mô hình.

## Lưu dự án {#save-a-project}

**☰ → Lưu dự án** hoặc <kbd>Ctrl</kbd>+<kbd>S</kbd> tải xuống `project.json`. Tệp chứa các nút, phần tử, vật liệu, tiết diện (kèm hình đa giác), tải trọng, đường kích thước và phiên bản ứng dụng đã ghi tệp. Bạn có thể đổi tên tệp tùy ý.

## Mở dự án {#open-a-project}

- **☰ → Mở dự án** hoặc <kbd>Ctrl</kbd>+<kbd>O</kbd>, rồi chọn một tệp `.json`, hoặc
- **kéo tệp thả vào bất kỳ đâu trên cửa sổ ứng dụng**.

Khi mở, dự án sẽ thay thế mô hình hiện tại, kể cả vật liệu và tiết diện. Mô hình cũ của bạn không bị mất: <kbd>Ctrl</kbd>+<kbd>Z</kbd> sẽ khôi phục nó, và nó được giữ trong [Kết cấu gần đây](#recent-structures). Tệp không phải dự án EduBeam sẽ bị từ chối kèm thông báo, và mô hình của bạn vẫn giữ nguyên.

Tệp dự án từ mọi phiên bản EduBeam trước đây đều mở được trong phiên bản hiện tại.

## Chia sẻ liên kết {#share-a-link}

**Chia sẻ mô hình** (trên thanh ứng dụng hoặc trong menu ☰) mở hộp thoại *Chia sẻ mô hình qua URL*:

![Hộp thoại chia sẻ](/screenshots/vi/share.webp){.shot-lg}

- **Sao chép** sao chép liên kết vào bộ nhớ tạm. Nhấp vào bên trong ô cũng có tác dụng tương tự.
- **Mở liên kết** mở nó trong thẻ mới, để bạn kiểm tra người nhận sẽ thấy gì.
- **Chia sẻ qua hộp thoại hệ thống** chuyển liên kết sang bảng chia sẻ của thiết bị, nếu trình duyệt hỗ trợ.
- **Liên kết ngắn hơn** ghi cùng mô hình đó với khoảng một nửa số ký tự. Bản <Edubeam /> chưa được cập nhật từ tháng 10/2026 sẽ không đọc được cho đến khi cập nhật, nên hãy tắt tùy chọn này khi liên kết phải mở được ở mọi nơi ngay lập tức.

Liên kết có dạng `https://run.edubeam.app/?model=…` và mã hóa toàn bộ mô hình. Ai mở liên kết sẽ có bản sao riêng để chỉnh sửa; các chỉnh sửa **không** được đồng bộ ngược lại, nên khi mô hình thay đổi, hãy gửi liên kết mới. Mô hình rất lớn sẽ tạo ra liên kết rất dài; với những mô hình đó, hãy chia sẻ tệp JSON.

Khi ai đó mở một liên kết, mô hình trước đó của họ được chuyển vào Kết cấu gần đây, và một thông báo cho họ biết tìm nó ở đâu.

Liên kết từ các phiên bản cũ vẫn hoạt động: liên kết trong bài giảng năm ngoái vẫn mở đúng mô hình đó hôm nay.

## Xuất hình ảnh {#export-an-image}

**☰ → Xuất hình ảnh** hoặc <kbd>Ctrl</kbd>+<kbd>P</kbd> mở hộp thoại xuất hình ảnh.

![Xuất hình ảnh: chọn lớp hiển thị, khung hình và kích thước, rồi tải xuống hoặc sao chép](/screenshots/vi/export-image.webp)

- **Lớp hiển thị**: các nhãn ở trên cùng chọn những gì được vẽ, độc lập với vùng hiển thị: hình dạng biến dạng, N, V, M, phản lực, gối tựa, tải trọng, nhãn nút và nhãn phần tử.
- **Khung hình**: chọn tỷ lệ khung hình (16:9, 4:3, 3:2, 1:1), **Toàn bộ**, hoặc **Vùng chọn…** để kéo một hình chữ nhật trên hình vẽ. Bạn cũng có thể kéo các cạnh của bản xem trước.
- **Kích thước**: chiều rộng và chiều cao tính bằng pixel, hoặc một **Tỷ lệ** như 1 : 50 để có bản vẽ đúng tỷ lệ trên giấy. **Chiều cao biểu đồ** đặt kích cỡ các biểu đồ kết quả trong hình. **Nền trong suốt** bỏ nền trắng.
- **Tải PNG**, **Tải SVG** hoặc **Sao chép vào bộ nhớ tạm**.

SVG luôn sắc nét ở mọi kích thước và dùng được trong Word, Inkscape và LaTeX trên Overleaf, nên đây là lựa chọn tốt nhất cho báo cáo và đồ án, luận văn.

## Xuất kết quả {#export-the-results}

**Kết quả → Xuất CSV** tải xuống cả hai bảng kết quả, kể cả phản lực, còn **Sao chép** đưa chúng vào bộ nhớ tạm để dán vào bảng tính. Xem [Xuất CSV và sao chép](/vi/essentials/results#export-csv-and-copy).

## Kết cấu gần đây {#recent-structures}

**☰ → Kết cấu gần đây** giữ 10 mô hình gần nhất đã bị xóa hoặc bị thay thế bởi một liên kết, một tệp, một ví dụ hoặc bài “Dầm đầu tiên”. Mỗi mục có hình thu nhỏ, lý do bị thay thế và kích thước. **Khôi phục** đưa một mô hình trở lại; mô hình bạn đang có khi đó lại được đưa vào danh sách, và <kbd>Ctrl</kbd>+<kbd>Z</kbd> hoàn tác việc khôi phục.

![Kết cấu gần đây](/screenshots/vi/recent.webp){.shot-lg}

Danh sách chỉ được lưu trong trình duyệt này.

## Ví dụ {#examples}

**☰ → Ví dụ** mở thư viện các mô hình giảng dạy có sẵn. Mở một ví dụ sẽ thay thế mô hình của bạn, và <kbd>Ctrl</kbd>+<kbd>Z</kbd> sẽ khôi phục mô hình đó. Các mô hình này, kèm bài tập, có ở trang [Ví dụ](/vi/examples/) của tài liệu này.

![Thư viện ví dụ](/screenshots/vi/examples.webp){.shot-lg}

## Nhúng trình xem {#embed-a-read-only-viewer}

Thêm `&viewer=1` vào liên kết chia sẻ để mở mô hình ở **chế độ xem**. Thanh ứng dụng, thanh dưới cùng, các thẻ, hoàn tác và làm lại, các nút lưới và biểu tượng hệ trục bị ẩn, chỉ còn khung vẽ, các nút vừa màn hình và căn giữa, và các tùy chọn hiển thị. Đặt URL đó vào `<iframe>` để nhúng một mô hình trực tiếp, có thể thu phóng, vào bài giảng hoặc trang web:

```html
<iframe src="https://run.edubeam.app/?viewer=1&model=…" width="100%" height="400"></iframe>
```

![Khung ba khớp ở chế độ xem](/screenshots/vi/viewer-mode.webp){.shot-lg}

Chế độ xem dùng để xem, nhưng không bị khóa: người xem vẫn có thể kéo nút và chuyển đổi biểu đồ. Mở liên kết ở chế độ xem cũng thay thế mô hình riêng của người xem trong trình duyệt đó (mô hình cũ được chuyển vào Kết cấu gần đây), giống như liên kết thông thường.

## Tham số URL {#url-parameters}

| Tham số | Tác dụng |
| --- | --- |
| `model=<data>` | Tải mô hình đã mã hóa và thu vừa màn hình. |
| `viewer=1` | Chế độ xem (xem ở trên). |
| `lang=<code>` | Đổi ngôn ngữ giao diện: `en`, `cs`, `de`, `fr`, `es`, `pt`, `pl`, `cn`, `th`, `uk`, `ru`, `tr`, `hi`, `vi`, `it`, `id`, `ja`, `ko`. |
| `panel=examples` | Mở ngay thư viện ví dụ. |

Sau khi đọc các tham số, EduBeam xóa chúng khỏi thanh địa chỉ.

## Tự động lưu {#automatic-persistence}

Mô hình hiện tại và cài đặt của bạn được lưu vào bộ nhớ cục bộ (local storage) của trình duyệt sau mỗi thay đổi và được khôi phục khi bạn quay lại, kể cả sau khi đã đóng trình duyệt. Đây là tiện ích, không phải bản sao lưu: nó thuộc về một hồ sơ trình duyệt trên một thiết bị, và sẽ mất khi bạn xóa dữ liệu trang web. Hãy lưu công việc quan trọng thành tệp dự án.

## Định dạng tệp dự án {#project-file-format}

`project.json` là JSON thuần, dễ đọc:

```json
{
  "edubeam": true,
  "version": "1.3.1",
  "domain": {
    "materials": [{ "label": "1", "e": 210000000000, "g": 81000000000, "alpha": 0.000012, "d": 7850 }],
    "crossSections": [{ "label": "1", "a": 0.00285, "iy": 1.943e-5, "h": 0.2, "k": 1 }],
    "nodes": [
      { "label": "1", "coords": [0, 0, 0], "bcs": [0, 2] },
      { "label": "2", "coords": [6, 0, 0], "bcs": [2] }
    ],
    "elements": [{ "label": "1", "nodes": ["1", "2"], "mat": "1", "cs": "1", "hinges": [false, false] }],
    "loadCases": [
      {
        "label": "1",
        "nodalLoads": [],
        "elementLoads": [{ "type": "udl", "target": "1", "lcs": false, "values": [0, 12000] }],
        "prescribedBC": []
      }
    ]
  },
  "dimensions": []
}
```

Đây là dầm trong phần Bắt đầu nhanh. Mọi giá trị đều theo **đơn vị SI** (m, N, Pa, rad), bất kể đơn vị hiển thị. Tọa độ có dạng `[x, y, z]`, với y luôn bằng 0. Điều kiện biên và các thành phần tải trọng dùng mã bậc tự do `0 = Dx`, `2 = Dz`, `4 = Ry`.

| `type` của tải trọng phần tử | Giá trị |
| --- | --- |
| `udl` | `values: [fx, fz]` tính bằng N/m |
| `trapezoidal` | `startValues: [f1x, f1z]`, `endValues: [f2x, f2z]` tính bằng N/m, theo trục địa phương |
| `concentrated` | `values: [Fx, Fz, My, a]` tính bằng N, N·m và m tính từ nút đầu |
| `temperature` | `values: [ΔTc, ΔTb, ΔTt]` tính bằng K; gradient là ΔTb − ΔTt |

Tải trọng nút có dạng `{ "target": "2", "values": { "0": Fx, "2": Fz, "4": My } }` và chuyển vị cưỡng bức có dạng `{ "target": "2", "prescribedValues": { "0": Dx, "2": Dz, "4": Ry } }`; hãy nhập đủ cả ba thành phần. Tệp do ứng dụng ghi còn chứa `date`, `commit`, `lcs` của nút và `shape` của tiết diện đa giác.

Vì định dạng đơn giản, bạn có thể tạo mô hình bằng script hoặc bảng tính rồi mở bằng **Mở dự án**.
