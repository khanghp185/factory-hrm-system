# Kế hoạch Phát triển Hệ thống Quản lý Nhân sự Xí nghiệp (Plan)

## 1. Mục tiêu hệ thống
Xây dựng một ứng dụng web đơn giản nhưng đầy đủ tính năng để quản lý nhân sự, điều phối ca làm việc và lưu trữ tài liệu nội bộ.

## 2. Các Use Case chính (Luồng nghiệp vụ)
1. **Quản lý nhân viên:** Admin có thể thêm, sửa, xóa và xem thông tin chi tiết của từng nhân viên (Hồ sơ, vị trí, tổ đội).
2. **Sắp xếp ca làm:** Quản lý lập lịch làm việc cho từng tổ đội theo tuần/tháng.
3. **Đăng ký nghỉ phép:** Nhân viên gửi đơn, hệ thống kiểm tra và quản lý phê duyệt.
4. **Điều phối nhân sự đột xuất:** Khi có nhân viên nghỉ, hệ thống hiển thị danh sách nhân viên rảnh rỗi hoặc thuộc tổ dự phòng để thay thế.
5. **Quản lý tài liệu:** Lưu trữ và phân loại các tệp hướng dẫn (SOP), quy trình theo ca làm.

## 3. Kiến trúc dữ liệu (Database Schema / Models)

Hệ thống sẽ sử dụng SQLite với các bảng (Table) chính sau:

### 3.1. Employees (Nhân viên)
| Trường | Kiểu dữ liệu | Mô tả |
| :--- | :--- | :--- |
| `id` | INTEGER (PK) | Mã nhân viên |
| `full_name` | TEXT | Họ và tên |
| `position` | TEXT | Chức vụ |
| `department` | TEXT | Phòng ban / Tổ đội |
| `status` | TEXT | Trạng thái (Đang làm việc, Nghỉ việc, Tạm nghỉ) |
| `join_date` | DATE | Ngày vào làm |

### 3.2. Shifts (Ca làm việc)
| Trường | Kiểu dữ liệu | Mô tả |
| :--- | :--- | :--- |
| `id` | INTEGER (PK) | Mã ca |
| `shift_name` | TEXT | Tên ca (Sáng, Chiều, Đêm) |
| `start_time` | TIME | Giờ bắt đầu |
| `end_time` | TIME | Giờ kết thúc |

### 3.3. Schedules (Lịch làm việc)
| Trường | Kiểu dữ liệu | Mô tả |
| :--- | :--- | :--- |
| `id` | INTEGER (PK) | |
| `employee_id` | INTEGER (FK) | Tham chiếu đến Employees |
| `shift_id` | INTEGER (FK) | Tham chiếu đến Shifts |
| `work_date` | DATE | Ngày làm việc |
| `is_backup` | BOOLEAN | Đánh dấu là nhân sự dự phòng |

### 3.4. LeaveRequests (Đơn nghỉ phép)
| Trường | Kiểu dữ liệu | Mô tả |
| :--- | :--- | :--- |
| `id` | INTEGER (PK) | |
| `employee_id` | INTEGER (FK) | Người xin nghỉ |
| `start_date` | DATE | |
| `end_date` | DATE | |
| `reason` | TEXT | |
| `status` | TEXT | Chờ duyệt, Đã duyệt, Từ chối |

### 3.5. Documents (Tài liệu)
| Trường | Kiểu dữ liệu | Mô tả |
| :--- | :--- | :--- |
| `id` | INTEGER (PK) | |
| `title` | TEXT | Tên tài liệu |
| `category` | TEXT | Loại (SOP, Quy trình, Nội quy) |
| `file_path` | TEXT | Đường dẫn lưu trữ file |
| `upload_date` | DATETIME | |

## 4. Cấu trúc mã nguồn dự kiến (Folder Structure)
```text
factory-hrm/
├── server.js            # Điểm khởi đầu của ứng dụng (Express)
├── database.js          # Kết nối và cấu hình SQLite
├── models/              # Các định nghĩa và xử lý dữ liệu (ORM-like)
├── routes/              # Các endpoint API (employees, shifts, docs)
├── public/              # Frontend (Giao diện tĩnh)
│   ├── css/
│   ├── js/              # Logic gọi API từ trình duyệt
│   ├── index.html       # Dashboard chính
│   ├── employees.html   # Quản lý nhân viên
│   └── schedule.html    # Quản lý lịch làm việc
└── uploads/             # Thư mục lưu trữ tài liệu PDF/Hình ảnh
```

## 5. Lộ trình triển khai (Milestones)
- **M1:** Khởi tạo cấu trúc thư mục và thiết lập Database SQLite.
- **M2:** Xây dựng API CRUD cho Nhân viên.
- **M3:** Thiết kế giao diện Dashboard và Quản lý nhân viên bằng Bootstrap.
- **M4:** Xây dựng tính năng chia ca và hiển thị lịch làm việc.
- **M5:** Xây dựng module quản lý tài liệu và upload file.
