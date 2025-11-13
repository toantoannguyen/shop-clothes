import React from "react";
import { Link, useNavigate } from "react-router-dom";

// Component Sidebar (Menu trái)
function Sidebar() {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white flex flex-col">
      <div className="p-5 text-2xl font-bold">Admin</div>
      <nav className="flex-grow">
        <Link to="/dashboard" className="block px-5 py-3 hover:bg-gray-700">
          Dashboard
        </Link>
        <Link to="/products" className="block px-5 py-3 hover:bg-gray-700">
          Sản phẩm
        </Link>
        <Link to="/trash" className="block px-5 py-3 hover:bg-gray-700">
          Thùng rác
        </Link>
        <Link to="/users" className="block px-5 py-3 hover:bg-gray-700">
          Người dùng
        </Link>
        <Link to="/orders" className="block px-5 py-3 hover:bg-gray-700">
          Đơn hàng
        </Link>
        <Link to="/chat" className="block px-5 py-3 hover:bg-gray-700">
          Hỗ trợ (Chat)
        </Link>
        {/* Chúng ta sẽ thêm link Quản lý Đơn hàng, Users... sau */}
      </nav>
    </div>
  );
}

// Component Header (Thanh trên cùng)
function Header() {
  const navigate = useNavigate();

  // Lấy thông tin user từ localStorage
  const userString = localStorage.getItem("adminUser");
  const user = userString ? JSON.parse(userString) : null;

  const handleLogout = () => {
    // Xóa thông tin đăng nhập
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    // Điều hướng về trang login
    navigate("/");
  };

  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center">
      <h1 className="text-xl font-semibold">
        Chào mừng, {user?.name || "Admin"}!
      </h1>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Đăng xuất
      </button>
    </header>
  );
}

// Component Layout chính
function AdminLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {children} {/* Đây là nơi nội dung các trang con sẽ hiển thị */}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
