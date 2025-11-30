import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Home,
  Package,
  Mail,
  ShoppingCart,
  User,
  LogOut,
  UserCircle,
  ClipboardList,
} from "lucide-react";

function Header() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    // Kiểm tra đăng nhập
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      setIsLoggedIn(true);
      try {
        const userData = JSON.parse(user);
        setUserName(userData.name || userData.username || "User");
      } catch (error) {
        console.error("Lỗi parse user data:", error);
      }
    }

    // Cập nhật số lượng giỏ hàng
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartCount(cart.length);

    // Lắng nghe sự kiện cập nhật giỏ hàng
    const handleCartUpdate = () => {
      const updatedCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartCount(updatedCart.length);
    };

    window.addEventListener("cartUpdated", handleCartUpdate);

    // Cleanup
    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);

  // Xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUserName("");
    setShowDropdown(false);
    navigate("/login");
  };

  return (
    <header className="py-4 shadow fixed top-0 left-0 w-full z-50 bg-transparent">
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="hover:opacity-80 transition">
          <h1 className="text-2xl font-bold text-gray-700 border-2 border-gray-400 px-4 py-2 rounded-lg">
            🛍️ QNT Shop
          </h1>
        </Link>

        {/* Menu với Icons */}
        <nav className="flex items-center space-x-6">
          <Link
            to="/"
            className="hover:bg-gray-200 p-2 rounded-full transition flex items-center gap-2 text-gray-600"
            title="Trang chủ"
          >
            <Home size={24} />
          </Link>

          <Link
            to="/products"
            className="hover:bg-gray-200 p-2 rounded-full transition flex items-center gap-2 text-gray-600"
            title="Sản phẩm"
          >
            <Package size={24} />
          </Link>

          <Link
            to="/contact"
            className="hover:bg-gray-200 p-2 rounded-full transition flex items-center gap-2 text-gray-600"
            title="Liên hệ"
          >
            <Mail size={24} />
          </Link>

          {/* Giỏ hàng với số lượng */}
          <div className="relative">
            <Link
              to="/cart"
              className="hover:bg-gray-200 p-2 rounded-full transition flex items-center gap-2 relative text-gray-600"
              title="Giỏ hàng"
            >
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* User Icon with Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="hover:bg-gray-200 p-2 rounded-full transition flex items-center gap-2 text-gray-600"
              title="Tài khoản"
            >
              <User size={24} />
              {isLoggedIn && (
                <span className="text-sm font-medium hidden md:inline">
                  {userName}
                </span>
              )}
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white text-gray-800 rounded-lg shadow-xl py-2 border border-gray-200">
                {isLoggedIn ? (
                  <>
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="text-sm font-semibold text-gray-900">
                        {userName}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Tài khoản đã xác thực
                      </p>
                    </div>
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-100 transition"
                      onClick={() => setShowDropdown(false)}
                    >
                      <UserCircle size={18} className="text-blue-600" />
                      <span className="text-sm">Thông tin tài khoản</span>
                    </Link>
                    <Link
                      to="/orders"
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-100 transition"
                      onClick={() => setShowDropdown(false)}
                    >
                      <ClipboardList size={18} className="text-green-600" />
                      <span className="text-sm">Đơn hàng đã mua</span>
                    </Link>
                    <hr className="my-2" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 text-red-600 transition"
                    >
                      <LogOut size={18} />
                      <span className="text-sm font-medium">Đăng xuất</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block px-4 py-2.5 hover:bg-gray-100 transition"
                      onClick={() => setShowDropdown(false)}
                    >
                      <span className="text-sm font-medium">Đăng nhập</span>
                    </Link>
                    <Link
                      to="/register"
                      className="block px-4 py-2.5 hover:bg-gray-100 transition"
                      onClick={() => setShowDropdown(false)}
                    >
                      <span className="text-sm">Đăng ký tài khoản</span>
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;
