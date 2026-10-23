---
description: "Lực và mô men tại nút, lún gối tựa, tải phân bố đều, tải hình thang và tải tập trung trên phần tử, và tải nhiệt độ, kèm quy ước dấu cho từng loại."
---

# Tải trọng

Mọi tải trọng thuộc về **một trường hợp tải duy nhất** và tác dụng đồng thời. Để so sánh các phương án, hãy lưu mỗi phương án thành một tệp dự án hoặc một liên kết chia sẻ.

![Mọi loại tải trọng trên một dầm liên tục: lực tại nút, tải phân bố đều, tải hình thang, tải tập trung, tải nhiệt độ và lún gối tựa](/screenshots/vi/loads-overview.webp)

<LoadShowcase />

## Quy ước dấu trong một câu {#sign-convention-in-one-line}

Trục **x** tổng thể hướng sang phải và trục **z** tổng thể hướng **xuống dưới**. Vì vậy `Fz` hoặc `fz` dương là tải hướng xuống, giống trọng lực, còn mô men `My` dương quay ngược chiều kim đồng hồ trên màn hình. Chi tiết có trong [Hệ tọa độ và quy ước dấu](/vi/elements/conventions). Với [hệ trục y hướng lên](/vi/elements/conventions#y-up-axes), tên và dấu của các đại lượng theo phương đứng đổi lại: trọng lực là `Fy` âm.

## Tải trọng nút {#nodal-loads}

Thẻ *Tải trọng* → **Thêm tải nút**, hoặc nhấp vào một nút → **Thêm tải trọng**. Chọn **Lực/Mô men**:

| Trường | Ý nghĩa | Đơn vị |
| --- | --- | --- |
| `Fx` | lực ngang (dương sang phải) | đơn vị lực |
| `Fz` | lực đứng (dương hướng xuống) | đơn vị lực |
| `My` | mô men quanh trục y (dương ngược chiều kim đồng hồ) | đơn vị mô men |

![Thêm tải nút. Hình xem trước cho thấy chiều tải ngay khi bạn gõ.](/screenshots/vi/loads-nodal.webp){.shot-md}

Các thành phần luôn theo hệ tọa độ **tổng thể**. Một nút có thể chịu nhiều tải trọng nút; chúng được cộng lại và vẽ chồng lên nhau.

### Chuyển vị cưỡng bức (lún gối tựa) {#prescribed-displacements-support-settlements}

Trong cùng hộp thoại, chọn **Chuyển vị cưỡng bức**, hoặc nhấp vào một nút có gối tựa → **Chuyển vị cưỡng bức**. Các trường đổi thành:

| Trường | Ý nghĩa | Đơn vị |
| --- | --- | --- |
| `Dx` | chuyển vị ngang cưỡng bức | đơn vị chuyển vị |
| `Dz` | chuyển vị đứng cưỡng bức (dương hướng xuống) | đơn vị chuyển vị |
| `Ry` | góc xoay cưỡng bức | rad |

Bạn chỉ nhập được giá trị cho bậc tự do **bị chặn** tại nút đó, vì chỉ gối tựa mới có thể bị dịch chuyển. Mỗi nút có tối đa một chuyển vị cưỡng bức; hãy sửa nó thay vì thêm cái thứ hai. Trong kết cấu tĩnh định, lún gối tựa chỉ gây chuyển vị mà không gây nội lực; trong kết cấu siêu tĩnh, nó gây cả hai.

## Tải trọng phần tử {#element-loads}

Thẻ *Tải trọng* → **Thêm tải phần tử**, hoặc nhấp vào một phần tử → **Thêm tải trọng**. Chọn **Loại tải trọng**; hộp thoại hiển thị trước tải trọng trên phần tử ngay khi bạn gõ.

### Tải phân bố đều {#uniformly-distributed-load}

| Trường | Ý nghĩa | Đơn vị |
| --- | --- | --- |
| `fx` | tải trên một đơn vị chiều dài theo x | lực / chiều dài |
| `fz` | tải trên một đơn vị chiều dài theo z | lực / chiều dài |
| **LCS** | đánh dấu: `fx`, `fz` tác dụng theo các trục địa phương của phần tử; bỏ đánh dấu: theo các trục tổng thể | – |

**LCS** được đánh dấu sẵn theo mặc định. Với phần tử nằm ngang vẽ từ trái sang phải, trục địa phương và trục tổng thể trùng nhau nên không có gì khác biệt. Với thanh nghiêng thì có:

- tải **vuông góc với thanh** (gió lên kèo mái) là `fz` với LCS **được đánh dấu**;
- tải **thẳng đứng** trên mỗi mét chiều dài thanh (trọng lượng bản thân) là `fz` với LCS **bỏ đánh dấu**;
- tải thẳng đứng trên mỗi mét *hình chiếu ngang* (tuyết) không nhập trực tiếp được. Hãy nhân nó với $\cos\alpha$ trước, trong đó $\alpha$ là góc nghiêng của thanh, rồi nhập như tải thẳng đứng.

### Tải hình thang {#trapezoidal-load}

| Trường | Ý nghĩa |
| --- | --- |
| `f1x`, `f1z` | cường độ tại nút **đầu** |
| `f2x`, `f2z` | cường độ tại nút **cuối** |

Cường độ thay đổi tuyến tính từ đầu đến cuối phần tử. Tải tam giác có `f1z = 0`. Tải hình thang luôn tác dụng theo **các trục địa phương của phần tử** (ô LCS bị khóa); với phần tử nằm ngang thì trùng với hệ tổng thể.

### Tải tập trung {#concentrated-load}

Lực hoặc mô men tập trung tại vị trí bất kỳ **dọc theo** phần tử, không cần thêm nút.

| Trường | Ý nghĩa |
| --- | --- |
| `Fx`, `Fz`, `My` | các thành phần lực và mô men |
| **Vị trí tải tính từ nút đầu** | khoảng cách từ nút đầu, `0 ≤ a ≤ L` |
| **LCS** | các thành phần theo trục địa phương |

Biểu đồ lực cắt có bước nhảy bằng `Fz` tại vị trí tải và biểu đồ mô men có điểm gãy tại đó; giá trị mô men tại điểm này được ghi nhãn tự động. Còn mô men tập trung `My` thì làm biểu đồ mô men có bước nhảy.

### Tải nhiệt độ {#temperature-load}

| Trường | Ý nghĩa |
| --- | --- |
| **ΔT<sub>c</sub>**, thay đổi nhiệt độ dọc trục | thay đổi đều trên toàn tiết diện, gây dãn dài $\alpha\,\Delta T_c\,L$ |
| **ΔT<sub>b</sub> − ΔT<sub>t</sub>**, chênh lệch nhiệt độ | thớ dưới trừ thớ trên, gây độ cong $\alpha\,(\Delta T_b - \Delta T_t)/h$ |

Tải nhiệt độ dùng **α** của vật liệu và **chiều cao h** của tiết diện. `ΔTb − ΔTt` dương (thớ dưới nóng hơn) làm thớ dưới dãn dài, nên phần tử võng xuống giống dầm chịu tải trọng lực. Trong kết cấu tĩnh định, nhiệt độ chỉ gây chuyển vị; khi biến dạng bị cản trở (đầu ngàm, tính liên tục, thanh thừa) thì nó mới gây ra nội lực.

<div class="shots">

![Tải phân bố đều](/screenshots/vi/loads-udl.webp)

![Tải hình thang](/screenshots/vi/loads-trapezoidal.webp)

![Tải tập trung](/screenshots/vi/loads-concentrated.webp)

![Tải nhiệt độ](/screenshots/vi/loads-temperature.webp)

</div>

## Sửa và xóa tải trọng {#editing-and-removing-loads}

- Mỗi tải trọng là một hàng trong thẻ *Tải trọng*, nơi bạn có thể sửa các thành phần và cờ LCS ngay tại chỗ. Tải trọng cũng hiện dưới dạng nhãn trong các bảng *Nút* và *Phần tử*.
- **Nhấp đúp** vào một tải trọng trong vùng hiển thị, hoặc nhấp vào nó rồi chọn **Sửa tải trọng**, để mở hộp thoại sửa.
- Chọn một tải trọng và nhấn <kbd>Delete</kbd>, hoặc dùng dấu × trong bảng.
- Tải trọng gắn với một nút hoặc phần tử sẽ bị xóa cùng với nó, và được sao chép cùng với nó khi bạn sao chép và dán.

![Thẻ Tải trọng: mỗi tải trọng một hàng, các thành phần sửa được ngay tại chỗ](/screenshots/vi/loads-table.webp)

## Những gì chưa có {#what-is-not-available}

- **Trường hợp tải và tổ hợp tải trọng.** Chỉ có một trường hợp tải.
- **Trọng lượng bản thân.** Hãy nhập nó như tải phân bố đều với LCS bỏ đánh dấu: $f_z = \rho\,g\,A$. Với IPE 200: 7850 × 9,81 × 0,00285 ≈ 0,22 kN/m.
- **Tải hình thang theo trục tổng thể** trên thanh nghiêng.
