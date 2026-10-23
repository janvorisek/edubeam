---
description: "Quy ước dấu trong EduBeam: trục tổng thể x sang phải và z hướng xuống, chiều dương của chuyển vị, góc xoay và tải trọng, trục địa phương của phần tử, nội lực và phản lực."
---

# Hệ tọa độ và quy ước dấu

Phần lớn các kết quả “sai” trong <Edubeam /> thực ra chỉ là bất ngờ về quy ước dấu. Mọi điều dưới đây đúng là những gì bộ giải sử dụng.

## Trục tổng thể {#global-axes}

- **x** — phương ngang, chiều dương sang **phải**.
- **z** — phương đứng, chiều dương **hướng xuống** trên màn hình.
- **y** — trục vuông góc với mặt phẳng kết cấu (hướng về phía người xem trong hệ thuận). Góc xoay và mô men lấy quanh trục y.

Biểu tượng trục ở góc lưới cho thấy x (màu đỏ) và z (màu xanh lá). Vì vậy, nếu chân cột cao 3 m nằm tại `Z = 0` thì nút ở đỉnh cột có `Z = −3`.

## Bậc tự do {#degrees-of-freedom}

Mỗi nút có `Dx`, `Dz` (chuyển vị thẳng) và `Ry` (góc xoay). `Dz` dương là chuyển vị hướng xuống; `Ry` dương là góc xoay **ngược chiều kim đồng hồ** trên màn hình. Các dấu này cũng áp dụng cho chuyển vị cưỡng bức và cho kết quả tại nút.

## Tải trọng {#loads}

| Tải trọng | Chiều dương |
| --- | --- |
| `Fx`, `fx`, `f1x`… | +x (sang phải; hoặc theo trục x địa phương của phần tử khi bật LCS) |
| `Fz`, `fz`, `f1z`… | +z (**xuống dưới**; hoặc theo trục z địa phương khi bật LCS) |
| `My` | ngược chiều kim đồng hồ trên màn hình |
| `ΔTc` | tăng nhiệt (giãn dài) |
| `ΔTb − ΔTt` | thớ dưới nóng hơn thớ trên |

Vậy tải trọng trọng lực là `fz` **dương**, còn tải gió đẩy cột bên trái sang phải là `fx` dương.

## Trục địa phương của phần tử {#element-local-axes}

Trục **x** địa phương đi từ nút đầu đến nút cuối; trục **z** địa phương vuông góc với nó, có được bằng cách xoay các trục tổng thể một góc bằng góc phần tử $\alpha$. Với phần tử nằm ngang vẽ từ trái sang phải, trục địa phương và trục tổng thể trùng nhau. Dùng **Đổi thứ tự nút** trong bảng *Phần tử* để đảo chiều phần tử.

## Nội lực {#internal-forces}

| Đại lượng | Dương nghĩa là |
| --- | --- |
| **N** | kéo |
| **V<sub>z</sub>** | dấu thông thường của lý thuyết dầm: với dầm đơn giản chịu tải trọng thẳng đứng hướng xuống, V dương tại gối trái và âm tại gối phải |
| **M<sub>y</sub>** | **căng thớ dưới** — thớ dưới (+z) chịu kéo. Dầm đơn giản chịu tải hướng xuống có mô men giữa nhịp dương; dầm công xôn chịu tải ở đầu tự do có mô men âm (căng thớ trên) tại ngàm |

## Nội lực đầu phần tử (bảng Kết quả phần tử) {#end-forces-element-results-table}

`X12, Z12, M12` tác dụng lên phần tử tại nút đầu, `X21, Z21, M21` tại nút cuối, trong hệ **địa phương**, với chiều dương giống các trục địa phương và `My`. Đó là các lực mà nút tác dụng lên phần tử, tức là $\mathbf{f} = \mathbf{K}_l\,\mathbf{u}_l - \mathbf{f}_{eq}$, trong đó $\mathbf{f}_{eq}$ là tải trọng nút tương đương của các tải trọng phần tử. Tổng nội lực đầu của mọi phần tử gặp nhau tại một nút cân bằng với tải trọng nút và phản lực tại đó.

## Phản lực {#reactions}

Mỗi bậc tự do bị chặn có một phản lực, được báo cáo trong hệ tọa độ của nút (đã xoay theo góc LCS của nút nếu bạn có đặt). Mũi tên phản lực trong vùng hiển thị chỉ theo chiều mà gối tựa đẩy lên kết cấu.

## Hệ trục y hướng lên {#y-up-axes}

**Cài đặt → Hệ tọa độ → x sang phải, y lên trên** chuyển mọi thứ bạn nhập và đọc sang hệ của giáo trình: **x** sang phải, **y** lên trên và **z** hướng về phía người xem. Mô hình, tệp đã lưu và hình vẽ vẫn giữ nguyên; chỉ con số và tên gọi thay đổi:

| Đại lượng | z hướng xuống (mặc định) | y hướng lên |
| --- | --- | --- |
| Tọa độ đứng | `Z` | `Y`, ngược dấu |
| Tải trọng đứng, chuyển vị, phản lực, nội lực đầu phần tử | `Fz`, `fz`, `Dz`, `Z12`… | `Fy`, `fy`, `Dy`, `Y12`…, ngược dấu |
| Góc xoay và mô men | `Ry`, `My` | `Rz`, `Mz`, cùng dấu (dương khi ngược chiều kim đồng hồ) |
| Góc gối tựa α | đo theo chiều kim đồng hồ | đo ngược chiều kim đồng hồ, ngược dấu |
| Nội lực N, V, M | | không đổi, biểu đồ vẽ như cũ |

Vậy tải trọng trọng lực là `fy` **âm**, và đỉnh cột cao 3 m có `Y = 3`.

## Đơn vị {#units}

Bên trong, bộ giải làm việc theo SI (m, N, Pa, rad, K). Đơn vị hiển thị chỉ ảnh hưởng đến những gì bạn nhập và đọc; thay đổi chúng không bao giờ làm thay đổi mô hình.
