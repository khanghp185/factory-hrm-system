# Tài liệu Quản lý Hệ thống (Management)

Tài liệu này lưu trữ thông tin về các tài khoản mặc định và quy định phân quyền trong hệ thống Factory HRM.

## 1. Danh sách tài khoản mặc định

Dưới đây là các tài khoản được khởi tạo sẵn để thử nghiệm hệ thống:

| Vai trò | Tên đăng nhập (Username) | Mật khẩu (Password) | Ghi chú |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin` | `123456` | Toàn quyền quản trị hệ thống |
| **Nhân viên** | `nhanvien` | `123456` | Chỉ xem lịch và gửi đơn nghỉ phép |

---

## 2. Bảng phân quyền (Permissions Matrix)

| Chức năng | Admin | Nhân viên |
| :--- | :---: | :---: |
| Xem Dashboard (Tổng quan) | ✅ | ❌ |
| Quản lý nhân viên (Thêm/Sửa/Xóa) | ✅ | ❌ |
| Phân ca làm việc | ✅ | ❌ |
| Xem lịch làm việc | ✅ | ✅ |
| Duyệt đơn nghỉ phép | ✅ | ❌ |
| Gửi đơn nghỉ phép | ✅ | ✅ |
| Quản lý tài liệu (Upload/Xóa) | ✅ | ❌ |
| Xem/Tải tài liệu (SOP) | ✅ | ✅ |

---

## 3. Lưu ý bảo mật
- Trong phiên bản prototype này, mật khẩu đang được lưu ở dạng văn bản thuần túy (plain-text) để thuận tiện cho việc kiểm tra.
- Đối với phiên bản thực tế, mật khẩu bắt buộc phải được băm (hashing) bằng `bcrypt` trước khi lưu vào cơ sở dữ liệu.
