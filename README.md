# Website Quản Lý Chi Tiêu Cá Nhân Hàng Ngày 💰

Ứng dụng web hiện đại giúp bạn theo dõi chi tiêu và thu nhập cá nhân chi tiết theo từng ngày trong tháng, phân tích cơ cấu chi tiêu và tự động gợi ý hạn mức an toàn cho những ngày còn lại.

---

## 🌟 Các Tính Năng Chính

1. **Theo dõi chi tiêu theo từng ngày (Calendar View):**
   - Lịch trực quan hiển thị số tiền đã tiêu trong từng ngày của tháng.
   - Nhận diện ngày vượt định mức (đổi màu đỏ cảnh báo) hoặc chi tiêu an toàn (màu xanh).
   - Đánh dấu ngày hiện tại (Hôm nay), bấm vào bất kỳ ngày nào để xem nhanh hoặc thêm giao dịch cho ngày đó.

2. **Quản lý ngân sách thông minh:**
   - Đặt hạn mức chi tiêu cả tháng (VD: 12.000.000 ₫).
   - **Gợi ý hạn mức an toàn mỗi ngày:** Tự động lấy số tiền còn lại chia đều cho các ngày còn lại trong tháng.
   - Thanh tiến độ hiển thị % ngân sách đã tiêu so với % số ngày trong tháng đã trôi qua.

3. **Biểu đồ phân tích chi tiết:**
   - **Biểu đồ cột theo ngày:** Xem sự biến động chi tiêu qua 30/31 ngày với đường hạn mức tham chiếu.
   - **Biểu đồ Donut cơ cấu danh mục:** Phân bổ chi tiêu cho Ăn uống, Đi lại, Mua sắm, Nhà cửa, Hóa đơn, Sức khỏe...

4. **Quản lý danh sách thu chi:**
   - Thêm / Sửa / Xóa giao dịch dễ dàng.
   - Hỗ trợ cả 2 luồng: **Chi tiêu** và **Thu nhập**.
   - Tìm kiếm nhanh theo nội dung hoặc số tiền.
   - Lọc theo ngày hoặc theo danh mục.

5. **Lưu trữ & Sao lưu dữ liệu:**
   - Dữ liệu được lưu tự động trong trình duyệt (`localStorage`), không bị mất khi tải lại trang.
   - **Xuất file Excel (CSV):** Chuẩn font tiếng Việt UTF-8 BOM, mở trực tiếp bằng Microsoft Excel.
   - **Sao lưu toàn bộ (JSON):** Tải về máy và có thể khôi phục lại bất kỳ lúc nào.

---

## 🚀 Hướng Dẫn Sử Dụng

### Khởi động ứng dụng
Máy đã được cài đặt và đang chạy sẵn tại địa chỉ:
👉 **[http://localhost:3000/](http://localhost:3000/)**

Nếu cần khởi động lại sau này:
```bash
npm run dev
```

### Đóng gói sản phẩm (Production build)
```bash
npm run build
```
Thư mục `dist/` sẽ chứa mã nguồn sẵn sàng đưa lên hosting (Vercel, Netlify, GitHub Pages, Firebase Hosting...).

### 🐳 Chạy bằng Docker & Docker Compose
Bạn có thể khởi chạy ứng dụng qua Docker cực kỳ nhanh gọn mà không cần cài Node.js trên máy chủ:

**Cách 1: Sử dụng Docker Compose (Khuyên dùng)**
```bash
# Khởi chạy container ngầm ở cổng 3000
docker compose up -d --build

# Xem log hoạt động
docker compose logs -f

# Dừng container
docker compose down
```

**Cách 2: Sử dụng Docker CLI thuần**
```bash
# Build Docker image
docker build -t quan-ly-chi-tieu .

# Chạy container ở cổng 3000
docker run -d -p 3000:80 --name quan-ly-chi-tieu quan-ly-chi-tieu
```
Truy cập ngay tại: 👉 **[http://localhost:3000/](http://localhost:3000/)**
