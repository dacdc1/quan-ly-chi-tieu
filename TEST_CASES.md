# BỘ TÀI LIỆU TEST CASE CHI TIẾT DỰ ÁN
## WEBSITE QUẢN LÝ CHI TIÊU CÁ NHÂN HÀNG NGÀY 💰

- **Tên dự án:** Website Quản Lý Chi Tiêu Cá Nhân Hàng Ngày
- **Phiên bản:** 1.0.0
- **Tài liệu:** Test Case Specification Document (Tiêu chuẩn QA/QC)
- **Môi trường kiểm thử:** Web Browser (Google Chrome, Apple Safari, Microsoft Edge, Mozilla Firefox)
- **Thiết bị:** Desktop (1920x1080, 1366x768), Tablet (iPad 768x1024), Mobile (iPhone 390x844, Android 360x800)

---

## MỤC LỤC
1. [MODULE 1: ĐĂNG KÝ TÀI KHOẢN (TC_REG)](#module-1-đăng-ký-tài-khoản-tc_reg)
2. [MODULE 2: ĐĂNG NHẬP & PHÂN QUYỀN (TC_AUTH)](#module-2-đăng-nhập--phân-quyền-tc_auth)
3. [MODULE 3: QUÊN MẬT KHẨU & XÁC THỰC OTP EMAIL (TC_OTP)](#module-3-quên-mật-khẩu--xác-thực-otp-email-tc_otp)
4. [MODULE 4: QUẢN LÝ NGÂN SÁCH THÁNG & ĐỊNH MỨC NGÀY (TC_BUDGET)](#module-4-quản-lý-ngân-sách-tháng--định-mức-ngày-tc_budget)
5. [MODULE 5: GHI CHÉP NHANH HÔM NAY & LỊCH 31 NGÀY (TC_DAILY)](#module-5-ghi-chép-nhanh-hôm-nay--lịch-31-ngày-tc_daily)
6. [MODULE 6: QUẢN LÝ SỔ GIAO DỊCH THU CHI (CRUD, TÌM KIẾM, LỌC) (TC_TX)](#module-6-quản-lý-sổ-giao-dịch-thu-chi-tc_tx)
7. [MODULE 7: BIỂU ĐỒ & BÁO CÁO PHÂN TÍCH (TC_ANALYTICS)](#module-7-biểu-đồ--báo-cáo-phân-tích-tc_analytics)
8. [MODULE 8: SAO LƯU, KHÔI PHỤC JSON & XUẤT EXCEL CSV (TC_BACKUP)](#module-8-sao-lưu-khôi-phục-json--xuất-excel-csv-tc_backup)
9. [MODULE 9: DASHBOARD QUẢN TRỊ ADMIN (TC_ADMIN)](#module-9-dashboard-quản-trị-admin-tc_admin)
10. [MODULE 10: TÍNH TƯƠNG THÍCH, LƯU TRỮ & BẢO MẬT (TC_SYSTEM)](#module-10-tính-tương-thích-lưu-trữ--bảo-mật-tc_system)

---

## MODULE 1: ĐĂNG KÝ TÀI KHOẢN (TC_REG)

| Mã TC | Tiêu đề Test Case | Loại test | Điều kiện tiên quyết | Các bước thực hiện | Dữ liệu đầu vào (Test Data) | Kết quả mong đợi | Mức độ |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC_REG_01** | Đăng ký tài khoản thành công với thông tin hợp lệ | Positive | Chưa đăng nhập, mở popup Đăng ký | 1. Nhập Họ và tên hợp lệ<br>2. Nhập Username hợp lệ<br>3. Nhập Email hợp lệ<br>4. Nhập Mật khẩu >= 6 ký tự<br>5. Nhập Xác nhận mật khẩu khớp<br>6. Bấm nút "Đăng Ký" | Họ tên: `Cao Đắc`<br>Username: `caodac`<br>Email: `caodac@gmail.com`<br>Pass: `123456`<br>Confirm: `123456` | 1. Hiển thị thông báo đăng ký thành công.<br>2. Hệ thống gửi email chào mừng về `caodac@gmail.com`.<br>3. Tự động đăng nhập và cập nhật tên trên Header. | **Critical** |
| **TC_REG_02** | Đăng ký thất bại khi bỏ trống các trường bắt buộc | Negative | Mở form Đăng ký | 1. Để trống 1 hoặc tất cả các trường<br>2. Bấm nút "Đăng Ký" | Để trống Họ tên hoặc Username hoặc Email | Trình duyệt chặn submit, hiển thị tooltip HTML5 yêu cầu điền trường này hoặc thông báo lỗi đỏ. | **High** |
| **TC_REG_03** | Đăng ký thất bại khi Username dưới 3 ký tự | Negative | Mở form Đăng ký | 1. Điền các trường hợp lệ<br>2. Nhập Username 1-2 ký tự<br>3. Bấm "Đăng Ký" | Username: `ab` | Báo lỗi: *"Tên đăng nhập (Username) phải có ít nhất 3 ký tự"*. Không tạo tài khoản. | **Medium** |
| **TC_REG_04** | Đăng ký thất bại khi Username đã tồn tại | Negative | Đã có tài khoản `demo` trong hệ thống | 1. Điền form đăng ký với Username trùng `demo`<br>2. Bấm "Đăng Ký" | Username: `demo` | Báo lỗi: *"Tên đăng nhập này đã được sử dụng. Vui lòng chọn tên khác."* | **High** |
| **TC_REG_05** | Đăng ký thất bại khi Email sai định dạng | Boundary / Negative | Mở form Đăng ký | 1. Điền các trường hợp lệ<br>2. Nhập Email không có `@` hoặc thiếu tên miền<br>3. Bấm "Đăng Ký" | Email: `abcgmail.com` hoặc `abc@` | Báo lỗi định dạng email không hợp lệ. Form không được gửi đi. | **High** |
| **TC_REG_06** | Đăng ký thất bại khi Email đã tồn tại | Negative | Đã có tài khoản gắn với email `demo@quanlychitieu.vn` | 1. Điền form đăng ký với email trên<br>2. Bấm "Đăng Ký" | Email: `demo@quanlychitieu.vn` | Báo lỗi: *"Email này đã được đăng ký tài khoản trước đó."* | **High** |
| **TC_REG_07** | Đăng ký thất bại khi Mật khẩu dưới 6 ký tự | Boundary | Mở form Đăng ký | 1. Điền các trường hợp lệ<br>2. Nhập mật khẩu 5 ký tự<br>3. Bấm "Đăng Ký" | Pass: `12345`<br>Confirm: `12345` | Báo lỗi: *"Mật khẩu phải có ít nhất 6 ký tự"*. | **High** |
| **TC_REG_08** | Đăng ký thất bại khi Xác nhận mật khẩu không khớp | Negative | Mở form Đăng ký | 1. Điền các trường hợp lệ<br>2. Nhập Pass và Confirm Pass khác nhau<br>3. Bấm "Đăng Ký" | Pass: `123456`<br>Confirm: `654321` | Báo lỗi: *"Mật khẩu xác nhận không trùng khớp"*. | **High** |
| **TC_REG_09** | Ẩn / Hiện mật khẩu bằng nút con mắt | Positive | Đang nhập mật khẩu trong form | Bấm vào icon con mắt (Eye) bên phải ô mật khẩu | Password: `secret123` | Ký tự chuyển từ dạng chấm tròn `••••` sang dạng chữ rõ ràng và ngược lại. | **Medium** |

---

## MODULE 2: ĐĂNG NHẬP & PHÂN QUYỀN (TC_AUTH)

| Mã TC | Tiêu đề Test Case | Loại test | Điều kiện tiên quyết | Các bước thực hiện | Dữ liệu đầu vào (Test Data) | Kết quả mong đợi | Mức độ |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC_AUTH_01** | Đăng nhập thành công bằng Username | Positive | Tài khoản `caodac` đã tồn tại | 1. Nhập username và mật khẩu đúng<br>2. Bấm "Đăng Nhập" | Username: `caodac`<br>Pass: `123456` | Đăng nhập thành công, modal đóng lại, Header hiển thị Avatar chữ `C` và tên `Cao Đắc`. | **Critical** |
| **TC_AUTH_02** | Đăng nhập thành công bằng Email | Positive | Tài khoản `caodac` có email `caodac@gmail.com` | 1. Nhập email vào ô tài khoản<br>2. Nhập mật khẩu đúng<br>3. Bấm "Đăng Nhập" | Email: `caodac@gmail.com`<br>Pass: `123456` | Đăng nhập thành công như khi dùng Username. | **High** |
| **TC_AUTH_03** | Đăng nhập thất bại khi sai Mật khẩu | Negative | Tài khoản `caodac` đã tồn tại | 1. Nhập username đúng<br>2. Nhập mật khẩu sai<br>3. Bấm "Đăng Nhập" | Username: `caodac`<br>Pass: `saimatkhaunhe` | Báo lỗi đỏ: *"Mật khẩu không chính xác"*. Người dùng vẫn ở lại màn hình đăng nhập. | **High** |
| **TC_AUTH_04** | Đăng nhập thất bại khi tài khoản không tồn tại | Negative | Chưa từng tạo user `khongton_tai` | 1. Nhập username chưa có<br>2. Nhập mật khẩu bất kỳ<br>3. Bấm "Đăng Nhập" | Username: `khongton_tai`<br>Pass: `123456` | Báo lỗi: *"Tài khoản hoặc email không tồn tại trên hệ thống."* | **High** |
| **TC_AUTH_05** | Đăng nhập nhanh bằng 1-Click tài khoản Demo | Positive | Mở modal Đăng nhập | Bấm nút "Đăng nhập nhanh Demo (demo / 123456)" | None | Đăng nhập ngay lập tức với tài khoản `demo`. Toast thông báo *"Xin chào Tài Khoản Demo!"*. | **Medium** |
| **TC_AUTH_06** | Phân quyền tài khoản Quản trị viên (Admin) | Positive | Đăng nhập tài khoản `admin` / `admin123` | 1. Đăng nhập user `admin`<br>2. Quan sát thanh Header | User: `admin`<br>Pass: `admin123` | 1. Cạnh tên user có huy hiệu tím `[Admin]`.<br>2. Nút tím **"Dashboard Quản Trị"** hiển thị nổi bật trên Header. | **Critical** |
| **TC_AUTH_07** | Phân quyền tài khoản User thông thường | Positive | Đăng nhập tài khoản `demo` hoặc user mới | 1. Đăng nhập tài khoản thường<br>2. Quan sát thanh Header | User: `demo` | Không hiển thị nút "Dashboard Quản Trị". Người dùng chỉ sử dụng tính năng chi tiêu cá nhân. | **High** |
| **TC_AUTH_08** | Đăng xuất tài khoản (Logout) | Positive | Đang đăng nhập bất kỳ tài khoản nào | 1. Bấm vào Avatar tài khoản ở Header<br>2. Bấm nút "Đăng xuất" | None | 1. Phiên làm việc bị xóa.<br>2. Header chuyển về nút "Đăng Nhập".<br>3. Dữ liệu chi tiêu chuyển về dữ liệu riêng/khách. | **High** |
| **TC_AUTH_09** | Tách biệt dữ liệu chi tiêu giữa các tài khoản | Positive | Đã tạo User A và User B | 1. Đăng nhập User A, thêm khoản chi 500k<br>2. Đăng xuất User A<br>3. Đăng nhập User B | User A: `user_a`<br>User B: `user_b` | User B **hoàn toàn không nhìn thấy** khoản chi 500k của User A. Mỗi tài khoản có sổ chi tiêu độc lập 100%. | **Critical** |

---

## MODULE 3: QUÊN MẬT KHẨU & XÁC THỰC OTP EMAIL (TC_OTP)

| Mã TC | Tiêu đề Test Case | Loại test | Điều kiện tiên quyết | Các bước thực hiện | Dữ liệu đầu vào (Test Data) | Kết quả mong đợi | Mức độ |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC_OTP_01** | Bấm "Quên mật khẩu?" chuyển sang màn hình nhập Email | Positive | Đang ở tab Đăng nhập | Bấm vào link "Quên mật khẩu?" cạnh nhãn Mật khẩu | None | Màn hình chuyển sang Form "Quên Mật Khẩu" yêu cầu nhập địa chỉ Email đã đăng ký. | **High** |
| **TC_OTP_02** | Yêu cầu gửi OTP thất bại khi Email chưa đăng ký | Negative | Màn hình Quên mật khẩu | 1. Nhập email chưa từng đăng ký<br>2. Bấm "Gửi Mã OTP Về Email" | Email: `chua_dang_ky@gmail.com` | Báo lỗi đỏ: *"Không tìm thấy tài khoản nào gắn với email: ..."*. Không phát sinh mã OTP. | **High** |
| **TC_OTP_03** | Yêu cầu gửi OTP thành công với Email hợp lệ | Positive | Tài khoản `caodac@gmail.com` đã đăng ký | 1. Nhập email đã đăng ký<br>2. Bấm "Gửi Mã OTP Về Email" | Email: `caodac@gmail.com` | 1. Hệ thống sinh mã OTP 6 số ngẫu nhiên.<br>2. Gửi email chứa OTP đến `caodac@gmail.com`.<br>3. Chuyển sang màn hình "Xác Thực Mã OTP" với ô nhập 6 số và đếm ngược 60 giây. | **Critical** |
| **TC_OTP_04** | Kiểm tra đếm ngược 60 giây nút "Gửi lại mã" | Boundary | Đang ở màn hình nhập OTP | 1. Quan sát đồng hồ đếm ngược từ 60s về 0s<br>2. Sau khi về 0s, bấm "Gửi lại mã" | None | 1. Trong 60s đầu, nút ở trạng thái `Gửi lại mã (Xs)` không bấm được.<br>2. Khi về 0s, nút chuyển thành link bấm được. Bấm vào sẽ sinh mã OTP mới và đếm ngược lại 60s. | **Medium** |
| **TC_OTP_05** | Xác nhận OTP thất bại khi nhập sai mã | Negative | Đã phát sinh OTP (VD: `456789`) | 1. Nhập mã OTP sai<br>2. Bấm "Xác Nhận Mã OTP" | OTP: `111222` | Báo lỗi: *"Mã OTP không chính xác. Vui lòng kiểm tra lại trong email."* Không cho phép đổi mật khẩu. | **Critical** |
| **TC_OTP_06** | Xác nhận OTP thất bại khi mã đã hết hạn (> 5 phút) | Boundary / Time | Đã tạo mã OTP trước đó 5 phút 1 giây | 1. Nhập mã OTP đã hết hạn<br>2. Bấm "Xác Nhận Mã OTP" | OTP đúng nhưng quá 5 phút | Báo lỗi: *"Mã OTP đã hết hiệu lực (quá 5 phút). Vui lòng bấm gửi lại mã."* | **High** |
| **TC_OTP_07** | Xác nhận OTP thành công chuyển sang màn hình Đổi Mật Khẩu | Positive | Đã nhận mã OTP hợp lệ | 1. Nhập đúng 6 chữ số OTP<br>2. Bấm "Xác Nhận Mã OTP" | OTP đúng (VD: `682104`) | Hiển thị thông báo xác thực thành công. Chuyển sang màn hình "Đặt Lại Mật Khẩu Mới". | **Critical** |
| **TC_OTP_08** | Đổi mật khẩu thất bại khi mật khẩu xác nhận không khớp | Negative | Đang ở bước Đặt lại mật khẩu mới | 1. Nhập Mật khẩu mới<br>2. Nhập Xác nhận mật khẩu khác<br>3. Bấm "Lưu Mật Khẩu Mới" | Pass mới: `abcdef`<br>Confirm: `xyz123` | Báo lỗi: *"Mật khẩu mới xác nhận không khớp."* | **High** |
| **TC_OTP_09** | Đổi mật khẩu thất bại khi mật khẩu mới dưới 6 ký tự | Boundary | Đang ở bước Đặt lại mật khẩu mới | 1. Nhập mật khẩu 4 ký tự<br>2. Bấm "Lưu Mật Khẩu Mới" | Pass mới: `1234` | Báo lỗi: *"Mật khẩu mới phải có ít nhất 6 ký tự."* | **Medium** |
| **TC_OTP_10** | Đổi mật khẩu thành công và đăng nhập lại bằng mật khẩu mới | Positive | Nhập mật khẩu mới hợp lệ | 1. Nhập Pass mới và Confirm Pass khớp<br>2. Bấm "Lưu Mật Khẩu Mới"<br>3. Đăng nhập lại với mật khẩu mới | Pass mới: `MatKhauMoi@2026` | 1. Báo thành công, chuyển về form Đăng nhập.<br>2. Dùng mật khẩu cũ đăng nhập báo lỗi sai mật khẩu.<br>3. Dùng mật khẩu mới đăng nhập thành công 100%. | **Critical** |
| **TC_OTP_11** | Kiểm tra tính năng "Hộp thư gửi" (Mailbox Inspector) | Positive | Hệ thống vừa gửi thư đăng ký hoặc OTP | Bấm vào nút "Hộp thư gửi" ở chân modal | None | Mở popup danh sách toàn bộ các thư đã gửi, hiển thị chính xác tiêu đề, người nhận, thời gian và huy hiệu Mã OTP màu vàng. | **Medium** |

---

## MODULE 4: QUẢN LÝ NGÂN SÁCH THÁNG & ĐỊNH MỨC NGÀY (TC_BUDGET)

| Mã TC | Tiêu đề Test Case | Loại test | Điều kiện tiên quyết | Các bước thực hiện | Dữ liệu đầu vào (Test Data) | Kết quả mong đợi | Mức độ |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC_BUDGET_01** | Xem định mức ngân sách mặc định khi mới mở ứng dụng | Positive | Tháng 10/2026 (31 ngày), chưa có chi tiêu | 1. Mở trang chủ ứng dụng<br>2. Quan sát thẻ Ngân Sách và WorkflowSteps | Ngân sách mặc định: `10.000.000 ₫` | 1. Ngân sách tháng: `10.000.000 ₫`.<br>2. Định mức ngày tự động chia: `10.000.000 / 31 = 322.581 ₫/ngày`.<br>3. Còn lại: `10.000.000 ₫` (100%). | **High** |
| **TC_BUDGET_02** | Thay đổi hạn mức ngân sách tháng qua modal | Positive | Mở modal Cài đặt ngân sách | 1. Nhập hạn mức mới: `15.000.000`<br>2. Quan sát ô tính toán định mức ngày xem trước<br>3. Bấm "Áp dụng ngân sách" | Ngân sách: `15000000 ₫` | 1. Ô xem trước hiển thị: `483.871 ₫/ngày`.<br>2. Sau khi lưu, toàn bộ Dashboard, Lịch và Biểu đồ cập nhật định mức mới `483.871 ₫`. | **Critical** |
| **TC_BUDGET_03** | Chọn nhanh ngân sách bằng các nút gợi ý | Positive | Mở modal Cài đặt ngân sách | Bấm vào nút gợi ý `12.000.000 ₫` | Click nút `12 tr` | Ô số tiền tự động điền `12000000`. Bấm áp dụng cập nhật chính xác. | **Low** |
| **TC_BUDGET_04** | Tính toán động Hạn mức an toàn cho những ngày còn lại | Positive | Tháng 10 có 31 ngày. Hôm nay là ngày 21 (còn 11 ngày kể cả hôm nay) | 1. Giả sử đã chi `4.500.000 ₫` trong tháng<br>2. Ngân sách tháng `10.000.000 ₫`<br>3. Quan sát ô "Định Mức Ngày Còn Lại" | Đã chi: `4.500.000 ₫`<br>Còn lại: `5.500.000 ₫`<br>Số ngày còn lại: 11 ngày | Hệ thống tính toán chính xác:<br>`5.500.000 / 11 = 500.000 ₫/ngày`. Hiển thị nhãn: *"Chia đều cho 11 ngày tiếp theo"*. | **Critical** |
| **TC_BUDGET_05** | Cảnh báo khi chi tiêu vượt quá hạn mức ngân sách tháng | Negative / Boundary | Ngân sách tháng `10.000.000 ₫` | 1. Thêm các khoản chi tiêu tổng cộng `10.500.000 ₫`<br>2. Quan sát huy hiệu trạng thái và thanh tiến độ | Tổng chi: `10.500.000 ₫` | 1. Thanh tiến độ đổi sang màu đỏ 100%.<br>2. Ngân sách còn lại hiển thị số âm màu đỏ: `-500.000 ₫`.<br>3. Huy hiệu cảnh báo: *"Đã vượt quá ngân sách"*. | **Critical** |
| **TC_BUDGET_06** | Thay đổi ngưỡng cảnh báo sớm (Alert Threshold) | Positive | Mở modal Cài đặt ngân sách | Kéo thanh trượt cảnh báo từ 85% xuống 70% | Ngưỡng: `70%` | Khi tổng chi đạt 70% ngân sách tháng, hệ thống đổi sang trạng thái màu vàng cảnh báo. | **Medium** |

---

## MODULE 5: GHI CHÉP NHANH HÔM NAY & LỊCH 31 NGÀY (TC_DAILY)

| Mã TC | Tiêu đề Test Case | Loại test | Điều kiện tiên quyết | Các bước thực hiện | Dữ liệu đầu vào (Test Data) | Kết quả mong đợi | Mức độ |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC_DAILY_01** | Nhập nhanh khoản chi tiêu hôm nay trong 3 giây | Positive | Đang ở Tab "Theo Dõi & Lịch Hàng Ngày" | 1. Nhập số tiền: `45000`<br>2. Nhập ghi chú: `Cơm trưa`<br>3. Chọn danh mục: `Ăn uống`<br>4. Bấm "Lưu khoản này" | Tiền: `45000`<br>Ghi chú: `Cơm trưa`<br>Danh mục: `Ăn uống` | 1. Khoản chi được lưu ngay lập tức vào ngày hôm nay.<br>2. Thẻ Hôm Nay tăng tổng chi: `45.000 ₫`.<br>3. Trên lịch tháng, ô ngày hôm nay cập nhật số tiền `-45k`. | **Critical** |
| **TC_DAILY_02** | Chọn nhanh số tiền bằng các nút pill (+20k, +50k...) | Positive | Form Nhập Nhanh Hôm Nay | 1. Bấm nút `+50k`<br>2. Bấm tiếp nút `+20k`<br>3. Quan sát ô số tiền | Click `+50k` rồi `+20k` | Ô số tiền tự cộng dồn thành `70000`. | **Low** |
| **TC_DAILY_03** | Báo lỗi khi lưu khoản chi với số tiền trống hoặc <= 0 | Negative | Form Nhập Nhanh Hôm Nay | 1. Để trống số tiền hoặc nhập `0`<br>2. Bấm "Lưu khoản này" | Tiền: `0` | Báo lỗi: *"Vui lòng nhập số tiền (> 0)"*. Không lưu giao dịch rác. | **High** |
| **TC_DAILY_04** | Nhận diện màu sắc ô ngày trên lịch theo định mức | Positive | Định mức ngày: `322.581 ₫` | 1. Thêm khoản chi Ngày A: `120.000 ₫`<br>2. Thêm khoản chi Ngày B: `450.000 ₫`<br>3. Quan sát 2 ô ngày trên lịch | Ngày A: `120k`<br>Ngày B: `450k` | 1. Ô Ngày A: Nền xanh lá nhạt, nhãn xanh *"Hợp lý"*.<br>2. Ô Ngày B: Nền đỏ hồng nhạt, nhãn đỏ *"Vượt mức"*.<br>3. Ô Hôm Nay có vòng tròn tím nổi bật. | **Critical** |
| **TC_DAILY_05** | Nhấn vào ô ngày trên lịch để mở Nhật Ký Ngày tương ứng | Positive | Lịch 31 ngày | Bấm chuột vào ô Ngày 15 | Click Ngày 15 | 1. Ô Ngày 15 có viền tím đậm viền chọn.<br>2. Khung **Nhật Ký Ngày 15** xuất hiện ngay phía trên, hiển thị toàn bộ khoản chi tiêu của ngày 15. | **High** |
| **TC_DAILY_06** | Thêm khoản chi tiêu trực tiếp cho ngày trong quá khứ/tương lai | Positive | Khung Nhật Ký Ngày đang chọn ngày 10/10 | Bấm nút "+ Thêm khoản" tại khung Nhật Ký Ngày 10 | Tiền: `80000`, `Đổ xăng` | Modal thêm giao dịch tự động điền sẵn ngày `2026-10-10`. Lưu xong xuất hiện đúng ngày 10 trên lịch. | **High** |
| **TC_DAILY_07** | Xóa khoản chi tiêu trực tiếp từ Nhật Ký Ngày | Positive | Ngày 10 có 1 khoản chi tiêu | 1. Bấm icon thùng rác cạnh khoản chi<br>2. Xác nhận popup trình duyệt | Click Xóa | Khoản chi bị xóa ngay, tổng tiền ngày 10 và tổng ngân sách tháng tự động trừ đi số tiền tương ứng. | **High** |

---

## MODULE 6: QUẢN LÝ SỔ GIAO DỊCH THU CHI (TC_TX)

| Mã TC | Tiêu đề Test Case | Loại test | Điều kiện tiên quyết | Các bước thực hiện | Dữ liệu đầu vào (Test Data) | Kết quả mong đợi | Mức độ |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC_TX_01** | Thêm mới khoản Thu Nhập qua modal chi tiết | Positive | Mở modal "Ghi chép mới" | 1. Chọn loại: `Thu nhập`<br>2. Nhập số tiền: `15000000`<br>3. Chọn danh mục: `Tiền lương`<br>4. Chọn thanh toán: `Chuyển khoản`<br>5. Bấm "Lưu giao dịch" | Tiền: `15.000.000 ₫`<br>Loại: Thu nhập | 1. Lưu thành công, hiển thị màu xanh lá dấu `+15.000.000 ₫`.<br>2. Thẻ "Tổng Thu Nhập" tăng 15 triệu, Dòng tiền ròng tăng dương. | **Critical** |
| **TC_TX_02** | Chỉnh sửa giao dịch đã có | Positive | Đã có giao dịch chi tiêu `45.000 ₫` | 1. Bấm icon chiếc bút chì (Edit)<br>2. Sửa số tiền thành `60.000 ₫`<br>3. Sửa ghi chú: `Cơm trưa + trà đá`<br>4. Bấm "Cập nhật" | Tiền mới: `60000` | Giao dịch cập nhật tức thì, tổng chi tăng thêm 15.000 ₫ chuẩn xác. | **High** |
| **TC_TX_03** | Tìm kiếm giao dịch theo từ khóa ghi chú | Positive | Có nhiều giao dịch (Ăn trưa, Đổ xăng, Siêu thị) | Nhập từ khóa `xăng` vào ô tìm kiếm | Keyword: `xăng` | Danh sách lọc tức thì chỉ hiển thị các khoản có chữ "xăng" trong ghi chú. | **High** |
| **TC_TX_04** | Tìm kiếm giao dịch theo số tiền | Positive | Có khoản tiêu `150000` | Nhập `150` vào ô tìm kiếm | Keyword: `150` | Hiển thị các giao dịch có số tiền chứa `150`. | **Medium** |
| **TC_TX_05** | Lọc danh sách theo Loại (Tất cả / Chi tiêu / Thu nhập) | Positive | Có cả khoản chi và khoản thu | 1. Bấm tab `Chi tiêu`<br>2. Bấm tab `Thu nhập` | Click tab | 1. Tab `Chi tiêu`: chỉ hiện các khoản màu đỏ (-).<br>2. Tab `Thu nhập`: chỉ hiện các khoản màu xanh (+). | **High** |
| **TC_TX_06** | Chuyển đổi qua lại giữa các Tháng | Positive | Đang ở Tháng 10/2026 | 1. Bấm nút `<` (Tháng trước)<br>2. Bấm nút `>` (Tháng sau)<br>3. Bấm nút "Hôm nay" | Click tháng | 1. Tháng chuyển sang Tháng 9, Tháng 11 chuẩn xác.<br>2. Bấm "Hôm nay" lập tức quay về Tháng 10 hiện tại. | **High** |

---

## MODULE 7: BIỂU ĐỒ & BÁO CÁO PHÂN TÍCH (TC_ANALYTICS)

| Mã TC | Tiêu đề Test Case | Loại test | Điều kiện tiên quyết | Các bước thực hiện | Dữ liệu đầu vào (Test Data) | Kết quả mong đợi | Mức độ |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC_CHART_01** | Hiển thị Biểu đồ cột 31 ngày đầy đủ | Positive | Chuyển sang Tab "2. Biểu Đồ & Báo Cáo Tháng" | Quan sát biểu đồ cột chi tiêu | Dữ liệu chi tiêu trong tháng | Hiển thị đầy đủ 31 cột đại diện cho 31 ngày. Chiều cao cột tỷ lệ thuận với số tiền chi trong ngày. | **High** |
| **TC_CHART_02** | Đường tham chiếu hạn mức ngày (Target Line) trên biểu đồ | Positive | Định mức ngày: `322.581 ₫` | Quan sát đường nét đứt màu đỏ trên biểu đồ cột | None | Đường nét đứt nằm ngang hiển thị nhãn *"Hạn mức ngày: 323k"*. Cột nào vượt đường này sẽ mang màu đỏ cảnh báo. | **High** |
| **TC_CHART_03** | Thống kê ngày chi tiêu nhiều nhất trong tháng | Positive | Ngày 5 chi 1 triệu (cao nhất) | Quan sát huy hiệu trên đầu biểu đồ cột | Ngày 5 chi `1.000.000 ₫` | Hiển thị chính xác: *"Ngày chi nhiều nhất: Ngày 5 (1 tr)"*. | **Medium** |
| **TC_CHART_04** | Tooltip tương tác khi rê chuột vào cột ngày | Positive | Có chi tiêu vào Ngày 15 | Rê chuột (hover) vào cột Ngày 15 | Mouse hover | Xuất hiện thẻ đen nổi hiển thị chi tiết: Ngày, Số tiền chi, Số tiền thu, Số giao dịch. | **Medium** |
| **TC_CHART_05** | Biểu đồ Donut cơ cấu danh mục chi tiêu | Positive | Đã có các khoản Ăn uống, Mua sắm, Đi lại | Quan sát biểu đồ tròn Donut | None | 1. Vòng tròn chia tỷ lệ % chính xác theo từng danh mục.<br>2. Ở giữa hiển thị tổng chi tiêu.<br>3. Cột bên cạnh liệt kê chi tiết số tiền và thanh % tiến độ. | **High** |
| **TC_CHART_06** | Nhấp vào danh mục trên biểu đồ Donut để lọc | Positive | Đang ở biểu đồ Donut | Bấm vào nhóm "Ăn uống" | Click "Ăn uống" | Vòng tròn làm nổi bật nhóm Ăn uống. Khi sang sổ giao dịch tự động lọc chỉ các khoản Ăn uống. | **Medium** |

---

## MODULE 8: SAO LƯU, KHÔI PHỤC JSON & XUẤT EXCEL CSV (TC_BACKUP)

| Mã TC | Tiêu đề Test Case | Loại test | Điều kiện tiên quyết | Các bước thực hiện | Dữ liệu đầu vào (Test Data) | Kết quả mong đợi | Mức độ |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC_BACKUP_01** | Xuất dữ liệu ra file Excel (CSV) chuẩn tiếng Việt UTF-8 | Positive | Tháng 10 có 5 giao dịch có dấu tiếng Việt | 1. Bấm menu "Sao lưu / Xuất"<br>2. Chọn "Xuất file Excel (CSV)"<br>3. Mở file tải về bằng Microsoft Excel | File `chi_tieu_2026-10.csv` | File tải về có tiền tố UTF-8 BOM (`\uFEFF`). Mở trên Excel không bị lỗi font tiếng Việt, hiển thị đủ cột: Mã, Ngày, Loại, Danh mục, Số tiền, Ghi chú. | **Critical** |
| **TC_BACKUP_02** | Sao lưu toàn bộ dữ liệu ra file JSON | Positive | Đã có nhiều giao dịch và cấu hình ngân sách | 1. Bấm menu "Sao lưu / Xuất"<br>2. Chọn "Sao lưu toàn bộ (JSON)" | File `sao_luu_chi_tieu_YYYY-MM-DD.json` | Tải xuống file `.json` chứa đầy đủ cấu trúc mảng transactions và map budgets. | **High** |
| **TC_BACKUP_03** | Khôi phục dữ liệu từ file JSON sao lưu | Positive | Đã tải file JSON từ TC_BACKUP_02 | 1. Bấm "Nhập từ file sao lưu (JSON)"<br>2. Chọn file JSON hợp lệ<br>3. Bấm "Tiến hành khôi phục" | File backup hợp lệ | Dữ liệu khôi phục nguyên vẹn, các khoản chi tiêu và ngân sách hiển thị đầy đủ ngay lập tức. | **Critical** |
| **TC_BACKUP_04** | Báo lỗi khi nạp file JSON sai định dạng | Negative | Có file JSON rác không đúng cấu trúc | 1. Chọn file JSON rác<br>2. Bấm "Tiến hành khôi phục" | File `{ "random": 123 }` | Báo lỗi: *"Định dạng tệp JSON không hợp lệ."* Không phá vỡ dữ liệu đang có. | **High** |
| **TC_BACKUP_05** | Làm trống dữ liệu toàn bộ tháng | Positive | Tháng 10 đang có giao dịch | 1. Bấm menu "Xóa sạch tháng 10"<br>2. Xác nhận popup | Confirm: YES | Toàn bộ giao dịch tháng 10 bị xóa sạch. Tháng trở về trạng thái trống 100% để người dùng tự điền lại. | **High** |

---

## MODULE 9: DASHBOARD QUẢN TRỊ ADMIN (TC_ADMIN)

| Mã TC | Tiêu đề Test Case | Loại test | Điều kiện tiên quyết | Các bước thực hiện | Dữ liệu đầu vào (Test Data) | Kết quả mong đợi | Mức độ |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC_ADMIN_01** | Truy cập Dashboard Quản trị bằng tài khoản Admin | Positive | Đăng nhập tài khoản `admin` / `admin123` | Bấm vào nút tím "Dashboard Quản Trị" trên Header | User `admin` | Mở giao diện Quản trị Admin chuyên nghiệp nền đen sang trọng, hiển thị 4 thẻ KPI hệ thống. | **Critical** |
| **TC_ADMIN_02** | Chặn người dùng thường truy cập Dashboard Admin | Security / Negative | Đang đăng nhập tài khoản User thường (`role: 'user'`) | Thử tìm cách mở Dashboard Admin | User thường | Không hiển thị nút Admin trên Header. Nếu chuyển đổi trạng thái giả lập sẽ tự động chuyển hướng về lại trang Sổ Chi Tiêu. | **Critical** |
| **TC_ADMIN_03** | Tìm kiếm người dùng trong danh sách Admin | Positive | Đang ở tab "Quản Lý Người Dùng" trong Admin | Nhập từ khóa tìm kiếm (tên, email hoặc username) | Keyword: `demo` | Bảng người dùng lọc tức thì chỉ hiển thị tài khoản có tên hoặc email khớp từ khóa. | **Medium** |
| **TC_ADMIN_04** | Admin thay đổi vai trò người dùng (Nâng/Hạ Admin) | Positive | Có user thường `caodac` | Bấm nút "Nâng Admin" tại hàng của user `caodac` | User `caodac` | Vai trò của user lập tức chuyển thành `Admin` với huy hiệu tím. Khi user `caodac` đăng nhập sẽ có đầy đủ quyền Admin. | **Critical** |
| **TC_ADMIN_05** | Chặn Admin tự xóa tài khoản của chính mình | Security / Negative | Admin đang đăng nhập | Tìm nút xóa tại dòng tài khoản của chính mình | Tài khoản của mình | Nút xóa bị ẩn hoặc bấm vào báo lỗi: *"Bạn không thể tự xóa tài khoản của chính mình"*. | **High** |
| **TC_ADMIN_06** | Admin xóa tài khoản người dùng khác | Positive | Có tài khoản rác cần xóa | 1. Bấm icon thùng rác tại hàng user đó<br>2. Xác nhận xóa | User cần xóa | Tài khoản bị xóa khỏi hệ thống, toàn bộ dữ liệu chi tiêu của tài khoản đó được dọn dẹp sạch sẽ. | **High** |
| **TC_ADMIN_07** | Admin đặt lại mật khẩu mới trực tiếp cho người dùng | Positive | User quên mật khẩu nhờ Admin cấp lại | 1. Bấm icon chìa khóa (KeyRound) tại hàng user<br>2. Nhập mật khẩu mới >= 6 ký tự<br>3. Bấm "Cập Nhật Mật Khẩu" | Pass mới: `AdminReset@123` | Mật khẩu được cập nhật thành công. User có thể đăng nhập bằng mật khẩu mới này. | **High** |
| **TC_ADMIN_08** | Admin tạo nhanh tài khoản mới | Positive | Tab Quản Lý Người Dùng | 1. Bấm nút "+ Thêm Người Dùng"<br>2. Điền đầy đủ Họ tên, Username, Email, Mật khẩu, Chọn vai trò<br>3. Bấm "Tạo Người Dùng" | Họ tên: `Trần Văn B`<br>User: `tranvanb`<br>Email: `b@gmail.com`<br>Pass: `123456` | Tài khoản mới xuất hiện ngay trên bảng danh sách và có thể đăng nhập ngay lập tức. | **High** |
| **TC_ADMIN_09** | Xem Nhật ký Email & OTP trong Admin Dashboard | Positive | Hệ thống đã từng gửi email | Bấm tab "Nhật Ký Email & OTP" | None | Hiển thị toàn bộ lịch sử thư: Loại thư (Chào mừng / Mã OTP), Người nhận, Thời gian gửi, Mã OTP 6 số và nội dung thư. | **High** |
| **TC_ADMIN_10** | Cấu hình và lưu trực tiếp khóa EmailJS từ giao diện Admin | Positive | Tab "Cấu Hình EmailJS & Hệ Thống" | 1. Nhập Service ID, Template ID, Public Key<br>2. Bấm "Lưu Cấu Hình Email" | Service ID: `service_xyz`<br>Public Key: `key_123` | Cấu hình được lưu vào LocalStorage, trạng thái chuyển sang màu xanh: *"🟢 Đã sẵn sàng gửi email thật"*. | **High** |
| **TC_ADMIN_11** | Nút "Về Sổ Chi Tiêu" chuyển đổi mượt mà | Positive | Đang ở trang Admin | Bấm nút "Về Sổ Chi Tiêu" ở góc trên | None | Quay trở lại giao diện Sổ chi tiêu cá nhân ngay lập tức mà không cần tải lại trang. | **Medium** |

---

## MODULE 10: TÍNH TƯƠNG THÍCH, LƯU TRỮ & BẢO MẬT (TC_SYSTEM)

| Mã TC | Tiêu đề Test Case | Loại test | Điều kiện tiên quyết | Các bước thực hiện | Dữ liệu đầu vào (Test Data) | Kết quả mong đợi | Mức độ |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC_SYS_01** | Lưu trữ dữ liệu liên tục (Data Persistence) khi F5 | Positive | Đã nhập giao dịch và cài đặt ngân sách | 1. Tải lại trang (F5 hoặc `Cmd + R`)<br>2. Tắt trình duyệt rồi mở lại | F5 Reload | Toàn bộ phiên đăng nhập, các khoản chi tiêu, lịch và biểu đồ được giữ nguyên vẹn 100%. | **Critical** |
| **TC_SYS_02** | Hiển thị Responsive trên màn hình điện thoại di động | UI / Responsive | Mở web trên thiết bị di động (chiều rộng <= 420px) | 1. Quan sát Header, Thanh 3 bước, Lịch tháng, Bảng giao dịch<br>2. Thử thao tác thêm giao dịch | Màn hình 390px (iPhone) | Giao diện tự động co giãn, không bị vỡ bố cục hay tràn thanh cuộn ngang khó chịu. Nút thêm chi tiêu nổi tròn ở góc dưới tiện tay bấm. | **High** |
| **TC_SYS_03** | Bảo mật mật khẩu người dùng (Password Hashing) | Security | Tài khoản đã đăng ký mật khẩu `123456` | Mở DevTools Application -> LocalStorage -> `quanlychitieu_users_v1` | LocalStorage inspection | Mật khẩu được mã hóa dạng chuỗi Hash SHA-256 (64 ký tự hex). **Tuyệt đối không lưu mật khẩu ở dạng văn bản thô (plain text)**. | **Critical** |
| **TC_SYS_04** | Tương thích triển khai GitHub Pages với subpath | Deployment | Mã nguồn build với `base: './'` | Chạy `npm run build` và kiểm tra đường dẫn asset trong file `dist/index.html` | Build artifact | Toàn bộ đường dẫn CSS/JS đều là tương đối (`./assets/...`), không bị lỗi màn hình trắng 404 khi deploy lên GitHub Pages dạng `username.github.io/repo-name/`. | **Critical** |

---

## TỔNG KẾT BỘ TEST CASE

- **Tổng số Test Cases:** **60 Test Cases**
  - **Module 1 (Đăng ký tài khoản):** 9 Test Cases
  - **Module 2 (Đăng nhập & Phân quyền):** 9 Test Cases
  - **Module 3 (Quên mật khẩu & OTP Email):** 11 Test Cases
  - **Module 4 (Ngân sách & Định mức ngày):** 6 Test Cases
  - **Module 5 (Nhập nhanh & Lịch 31 ngày):** 7 Test Cases
  - **Module 6 (Sổ giao dịch CRUD):** 6 Test Cases
  - **Module 7 (Biểu đồ phân tích):** 6 Test Cases
  - **Module 8 (Sao lưu JSON & Xuất Excel):** 5 Test Cases
  - **Module 9 (Dashboard Quản trị Admin):** 11 Test Cases
  - **Module 10 (Hệ thống & Bảo mật):** 4 Test Cases
- **Tỷ lệ bao phủ kiểm thử (Test Coverage):** ~100% các luồng chức năng, kiểm tra giới hạn (boundary), xử lý lỗi (negative) và bảo mật dữ liệu.
