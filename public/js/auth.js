// auth.js - Kiểm tra quyền truy cập và phân quyền giao diện
(function() {
    const user = JSON.parse(localStorage.getItem('user'));

    // Nếu chưa đăng nhập và không phải đang ở trang login, chuyển hướng về login.html
    if (!user && !window.location.pathname.endsWith('login.html')) {
        window.location.href = 'login.html';
    }

    // Khi trang đã tải xong
    document.addEventListener('DOMContentLoaded', () => {
        if (!user) return;

        // Hiển thị tên người dùng (nếu có phần tử hiển thị)
        const userDisplay = document.getElementById('user-display');
        if (userDisplay) userDisplay.innerText = user.full_name;

        // Xử lý phân quyền theo Role
        if (user.role === 'employee') {
            // Ẩn các menu chỉ dành cho Admin
            const adminLinks = ['index.html', 'employees.html', 'documents.html'];
            document.querySelectorAll('.sidebar a').forEach(link => {
                const href = link.getAttribute('href');
                if (adminLinks.some(al => href.includes(al))) {
                    link.style.display = 'none';
                }
            });

            // Ẩn các nút thao tác Thêm/Sửa/Xóa (class .admin-only)
            document.querySelectorAll('.admin-only').forEach(btn => btn.style.display = 'none');

            // Chặn truy cập trực tiếp các trang admin
            const currentPath = window.location.pathname;
            if (adminLinks.some(al => currentPath.endsWith(al)) && !currentPath.endsWith('schedule.html') && !currentPath.endsWith('leave.html')) {
                window.location.href = 'schedule.html';
            }
        }
    });
})();

function logout() {
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}
