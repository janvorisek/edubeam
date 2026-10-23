---
description: "EduBeam là gì: bộ giải phần tử hữu hạn miễn phí chạy trên trình duyệt cho dầm, khung và dàn phẳng. Những gì nó làm được và chưa làm được, dành cho ai, và tài liệu được sắp xếp thế nào."
---

<script setup>
import { VPTeamMembers } from 'vitepress/theme-without-fonts'

const members = [
  {
    avatar: 'https://www.github.com/janvorisek.png',
    name: 'Jan Voříšek',
    title: 'Trưởng nhóm phát triển và thiết kế sản phẩm',
    links: [
      { icon: 'github', link: 'https://github.com/janvorisek' },
      { icon: 'twitter', link: 'https://twitter.com/janvorisekdev' },
    ]
  },
  {
    avatar: 'https://www.github.com/bpatzak.png',
    name: 'Bořek Patzák',
    title: 'Bộ giải phần tử hữu hạn, tác giả ứng dụng gốc',
    links: [
      { icon: 'github', link: 'https://github.com/bpatzak' },
    ]
  }
]
</script>

# Giới thiệu

<Edubeam /> là công cụ **phân tích kết cấu 2D** miễn phí chạy trên trình duyệt, dành cho dầm, khung và dàn. Bạn vẽ kết cấu, thêm gối tựa và tải trọng, và bộ giải phần tử hữu hạn tính lại mọi thứ ngay khi bạn thay đổi bất cứ điều gì. Không có nút *Giải*, không cần cài đặt và không cần tài khoản.

[Mở EduBeam](https://run.edubeam.app/?lang=vi){target="_blank"} trong thẻ mới và làm theo phần [Bắt đầu nhanh](/vi/guide/quick-start).

![Khung ba khớp trong EduBeam: tải trọng màu cam, phản lực màu tím, mô men uốn màu đỏ và hình dạng biến dạng màu xám](/screenshots/vi/hero.webp)

## Lần đầu sử dụng {#your-first-visit}

Lần đầu mở ứng dụng, hộp thoại chào mừng sẽ hỏi bạn muốn bắt đầu thế nào, cùng với đơn vị và hệ trục bạn muốn dùng. Bạn có thể đổi cả hai sau này trong [Cài đặt](/vi/essentials/units-settings).

![Hộp thoại chào mừng](/screenshots/vi/welcome.webp){.shot-lg}

- **Xem giới thiệu** lần lượt chỉ cho bạn menu, nút hoàn tác và làm lại, các nút điều khiển hiển thị, tùy chọn hiển thị, lưới và đơn vị, và thanh công cụ dưới cùng.
- **Vẽ dầm đầu tiên** là bài hướng dẫn gồm bảy bước. Bạn vẽ một dầm bằng chuột, đặt gối tựa, đặt tải trọng và đọc kết quả. Một thẻ nhỏ ở góc màn hình cho bạn biết cần làm gì tiếp theo.
- **Mở một ví dụ** mở thư viện các mô hình có sẵn.

Cả ba mục đều có trong **menu ☰**, nên bạn có thể quay lại bất cứ lúc nào.

![Vẽ dầm đầu tiên: thẻ hướng dẫn nằm ở góc màn hình trong khi bạn làm việc](/screenshots/vi/first-beam-task.webp)

## EduBeam làm được gì {#what-it-does}

| Lĩnh vực | Khả năng |
| --- | --- |
| **Kết cấu** | Dầm phẳng (x–z), dầm liên tục, khung và dàn được dựng từ các nút và phần tử dầm Timoshenko 2D. Khớp đầu thanh biến bất kỳ thanh nào thành thanh dàn. |
| **Gối tựa** | Gối cố định, gối di động, ngàm, ngàm trượt và mọi tổ hợp khác của các bậc tự do bị chặn `Dx`, `Dz`, `Ry`, chọn theo ký hiệu. Gối tựa xiên qua góc của nút. Lún gối tựa. |
| **Tải trọng** | Lực và mô men tại nút, chuyển vị cưỡng bức, tải phân bố đều và hình thang, lực và mô men tập trung trên thanh, và tải nhiệt độ đều hoặc thay đổi theo chiều cao. |
| **Tiết diện** | Thư viện vật liệu và tiết diện (châu Âu và Mỹ), cùng trình vẽ đa giác tính $A$, $I_y$, $I_z$, $I_{yz}$, trục quán tính chính và bán kính quán tính cho mọi hình dạng. |
| **Kết quả** | Hình dạng biến dạng, lực dọc **N**, lực cắt **V**, mô men uốn **M**, phản lực, chuyển vị nút, nội lực đầu phần tử và ma trận độ cứng phần tử. |
| **Phân tích** | Phân tích tĩnh tuyến tính với một trường hợp tải. Kết quả chính xác cho mô hình tuyến tính, nên không cần chia lưới mịn hơn. Khi không giải được kết cấu, EduBeam cho biết lý do và tạo hoạt ảnh cho thấy kết cấu có thể chuyển động thế nào. |
| **Tệp** | Lưu và mở dự án dạng JSON, chia sẻ cả mô hình qua liên kết, xuất hình vẽ ra PNG hoặc SVG và kết quả ra CSV. Các mô hình vừa bị thay thế được giữ lại để bạn lấy lại. Mọi dữ liệu đều nằm trên thiết bị của bạn. |
| **Đơn vị** | SI hoặc hệ Mỹ (US customary) chỉ với một cú nhấp, hoặc chọn riêng cho từng đại lượng. Hệ trục là x sang phải, z xuống dưới hoặc x sang phải, y lên trên. |

## Những gì EduBeam (chưa) làm {#what-it-does-not-do-yet}

Biết trước các giới hạn sẽ giúp bạn tiết kiệm thời gian:

- **Chỉ 2D.** Không xét ứng xử ngoài mặt phẳng, không có khung không gian 3D.
- **Chỉ tĩnh tuyến tính.** Không xét hiệu ứng bậc hai (P–Δ), ổn định, động lực học hay dẻo.
- **Một trường hợp tải.** Không có tổ hợp tải trọng hay biểu đồ bao. Hãy mô hình từng trường hợp riêng và lưu mỗi trường hợp thành một tệp hoặc một liên kết chia sẻ.
- **Không có trọng lượng bản thân.** Nếu cần, hãy nhập nó như một tải phân bố.
- **Không kiểm tra thiết kế.** EduBeam cho bạn nội lực và chuyển vị; việc kiểm tra theo tiêu chuẩn là phần của bạn.

Nếu bạn cần một tính năng còn thiếu, hãy [tạo issue](https://github.com/janvorisek/edubeam/issues).

<ElementariumPromo placement="introduction" />

## EduBeam dành cho ai? {#who-is-it-for}

- **Sinh viên** học cơ học kết cấu muốn có phản hồi tức thì cho bài tính tay. Xem [Kiểm tra kết quả bằng tính tay](/vi/guide/verification).
- **Giảng viên** muốn trình chiếu trực tiếp cách gối tựa, khớp và tải trọng làm thay đổi nội lực, bằng bất kỳ ngôn ngữ nào trong 15 ngôn ngữ. Xem [Giảng dạy với EduBeam](/vi/guide/teaching).
- **Kỹ sư** muốn kiểm tra nhanh trước khi mở một phần mềm máy tính nặng hơn.

## Tài liệu này được sắp xếp thế nào {#how-this-guide-is-organised}

1. **Bắt đầu.** Trang này, [Bắt đầu nhanh trong 10 phút](/vi/guide/quick-start) và các [Ví dụ](/vi/examples/) có sẵn.
2. **Hướng dẫn.** Các mô hình hoàn chỉnh từ đầu đến cuối, kiểm tra bằng tính tay: [khung ba khớp](/vi/tutorials/three-hinged-frame) và [dàn phẳng](/vi/tutorials/truss).
3. **Mô hình hóa.** Mỗi thành phần một trang: [giao diện người dùng](/vi/essentials/user-interface), [nút và gối tựa](/vi/essentials/nodes-supports), [phần tử, vật liệu và tiết diện](/vi/essentials/elements), [tải trọng](/vi/essentials/loads), và [đơn vị và cài đặt](/vi/essentials/units-settings).
4. **Kết quả.** Cách [đọc biểu đồ và bảng](/vi/essentials/results) và cách [kiểm tra chúng](/vi/guide/verification).
5. **Tệp và chia sẻ.** [Dự án, liên kết chia sẻ, xuất hình ảnh và CSV](/vi/essentials/import-export), và [giảng dạy với EduBeam](/vi/guide/teaching).
6. **Tham khảo.** [Bàn phím, chuột và cảm ứng](/vi/reference/shortcuts), [khắc phục sự cố](/vi/reference/troubleshooting) và [câu hỏi thường gặp](/vi/faq/).
7. **Sổ tay lý thuyết.** [Quy ước dấu](/vi/elements/conventions) và công thức phần tử cho [dầm](/vi/elements/beam) và [thanh dàn](/vi/elements/truss).

Các biểu tượng **?** trong ứng dụng mở đúng trang tương ứng của tài liệu này bằng ngôn ngữ của bạn.

## Ngôn ngữ {#languages}

Giao diện có sẵn bằng English, Čeština, Deutsch, Español, Français, Italiano, Polski, Português, Tiếng Việt, Русский, Türkçe, Українська, हिन्दी, ไทย và 汉语. EduBeam chọn ngôn ngữ theo trình duyệt của bạn. Bạn có thể đổi ngôn ngữ trong **Cài đặt → Ngôn ngữ và khu vực**, hoặc mở ứng dụng với tham số `?lang=`, ví dụ [run.edubeam.app/?lang=vi](https://run.edubeam.app/?lang=vi){target="_blank"}.

## Tác giả và ghi nhận {#authors-credits}

<Edubeam /> do [Jan Voříšek](https://github.com/janvorisek) dẫn dắt, người duy trì và thiết kế sản phẩm của phiên bản web hiện đại. Phiên bản trình duyệt được phát triển độc lập với CTU. EduBeam bản desktop gốc cho Windows và Linux do [Bořek Patzák](http://ksm.fsv.cvut.cz/~bp/), [Jan Stránský](https://mech.fsv.cvut.cz/~stransky/en/) và [Vít Šmilauer](https://mech.fsv.cvut.cz/~smilauer/) tạo ra tại Bộ môn Cơ học, [CTU Prague – Khoa Xây dựng](https://www.fsv.cvut.cz/en). Bộ giải là thư viện mã nguồn mở [ts-fem](https://github.com/janvorisek/ts-fem).

<VPTeamMembers size="small" :members="members" />

## Đóng góp {#contribute}

- Báo cáo hành vi khó hiểu hoặc lỗi bằng một [issue trên GitHub](https://github.com/janvorisek/edubeam/issues).
- Cải thiện tài liệu này hoặc bản dịch bằng cách sửa các tệp trong `docs/` và mở một pull request.
- Giới thiệu EduBeam với bạn học và đồng nghiệp.
