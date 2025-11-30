import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Phone, MapPin, Save, Lock } from "lucide-react";
import Header from "../components/header";
import Footer from "../components/footer";

function Profile() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Kiểm tra đăng nhập
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (!token || !user) {
      alert("⚠️ Vui lòng đăng nhập!");
      navigate("/login");
      return;
    }

    // Load thông tin user
    try {
      const userData = JSON.parse(user);
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        address: userData.address || "",
      });
      setUserId(userData.id || userData._id);
    } catch (error) {
      console.error("Lỗi load user data:", error);
    }
  }, [navigate]);

  // Xử lý thay đổi input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Xử lý cập nhật thông tin
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Cập nhật localStorage
        localStorage.setItem("user", JSON.stringify(data.user));
        alert("✅ Cập nhật thông tin thành công!");

        // Dispatch event để header cập nhật tên
        window.dispatchEvent(new Event("userUpdated"));
      } else {
        alert(`❌ ${data.message || "Cập nhật thất bại!"}`);
      }
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      alert("❌ Có lỗi xảy ra. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex-grow container mx-auto px-6 py-20 mt-16 max-w-2xl">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Thông tin tài khoản
        </h2>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Họ tên */}
            <div>
              <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                <User size={20} className="text-blue-600" />
                Họ và tên
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập họ và tên"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                <Mail size={20} className="text-blue-600" />
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="example@email.com"
                required
              />
            </div>

            {/* Số điện thoại */}
            <div>
              <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                <Phone size={20} className="text-blue-600" />
                Số điện thoại
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0123456789"
              />
            </div>

            {/* Địa chỉ */}
            <div>
              <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                <MapPin size={20} className="text-blue-600" />
                Địa chỉ
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
                placeholder="Nhập địa chỉ đầy đủ"
              />
            </div>

            {/* Nút lưu */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <Save size={20} />
              {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </form>

          {/* Đổi mật khẩu */}
          <div className="mt-6 pt-6 border-t">
            <button
              onClick={() => navigate("/change-password")}
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition flex items-center justify-center gap-2 font-semibold"
            >
              <Lock size={20} />
              Đổi mật khẩu
            </button>
          </div>
        </div>

        {/* Thông tin bổ sung */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-3 text-lg">
            📌 Lưu ý quan trọng:
          </h3>
          <ul className="text-sm text-blue-800 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>
                Email sẽ được dùng để nhận thông báo đơn hàng và liên hệ quan
                trọng
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>
                Số điện thoại để shop liên hệ khi cần xác nhận đơn hàng
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>
                Địa chỉ phải chính xác để đảm bảo giao hàng đúng địa điểm
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>Thông tin cá nhân của bạn được bảo mật tuyệt đối</span>
            </li>
          </ul>
        </div>

        {/* Quick actions */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <button
            onClick={() => navigate("/orders")}
            className="bg-white text-gray-700 py-3 rounded-lg hover:shadow-md transition border border-gray-200 font-medium"
          >
            📦 Đơn hàng của tôi
          </button>
          <button
            onClick={() => navigate("/cart")}
            className="bg-white text-gray-700 py-3 rounded-lg hover:shadow-md transition border border-gray-200 font-medium"
          >
            🛒 Giỏ hàng
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Profile;
