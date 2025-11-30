import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";
// 1. IMPORT THÊM ICON EYE VÀ EYEOFF
import { Lock, Key, CheckCircle, AlertCircle, Eye, EyeOff } from "lucide-react";

function ChangePassword() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // 2. STATE ĐỂ QUẢN LÝ ẨN/HIỆN CHO 3 Ô INPUT
  const [showPass, setShowPass] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  // Hàm toggle trạng thái ẩn/hiện
  const toggleShow = (field) => {
    setShowPass({ ...showPass, [field]: !showPass[field] });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!");
      return;
    }
    if (formData.newPassword.length < 6) {
      setError("Mật khẩu mới phải có ít nhất 6 ký tự!");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://shop-clothes-backend.onrender.com/api/user/profile/password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            oldPassword: formData.oldPassword || null,
            newPassword: formData.newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Đổi mật khẩu thất bại");
      }

      setSuccess("Cập nhật mật khẩu thành công!");
      setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      // Reset lại trạng thái ẩn hiện về mặc định
      setShowPass({ old: false, new: false, confirm: false });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex-grow container mx-auto px-6 py-20 mt-16 flex justify-center">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock size={32} className="text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              Bảo mật tài khoản
            </h2>
            <p className="text-gray-500 text-sm">
              Đổi mật khẩu hoặc tạo mật khẩu mới
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm flex items-center gap-2">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm flex items-center gap-2">
              <CheckCircle size={16} /> {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800 border border-blue-200">
              💡 Nếu bạn đăng nhập bằng <b>Google</b>, hãy bỏ trống ô "Mật khẩu
              hiện tại" để tạo mật khẩu mới.
            </div>

            {/* --- MẬT KHẨU CŨ --- */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu hiện tại
              </label>
              <div className="relative">
                <input
                  // Kiểm tra state để quyết định type là text hay password
                  type={showPass.old ? "text" : "password"}
                  name="oldPassword"
                  value={formData.oldPassword}
                  onChange={handleChange}
                  // Thêm pr-10 để chữ không bị đè lên icon mắt
                  className="w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="(Bỏ trống nếu dùng Google)"
                />
                <Key
                  size={18}
                  className="absolute left-3 top-2.5 text-gray-400"
                />

                {/* Nút con mắt */}
                <button
                  type="button" // Quan trọng: type="button" để không submit form
                  onClick={() => toggleShow("old")}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPass.old ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* --- MẬT KHẨU MỚI --- */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu mới
              </label>
              <div className="relative">
                <input
                  type={showPass.new ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  placeholder="Nhập mật khẩu mới"
                />
                <Lock
                  size={18}
                  className="absolute left-3 top-2.5 text-gray-400"
                />

                {/* Nút con mắt */}
                <button
                  type="button"
                  onClick={() => toggleShow("new")}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPass.new ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* --- XÁC NHẬN MẬT KHẨU --- */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Xác nhận mật khẩu mới
              </label>
              <div className="relative">
                <input
                  type={showPass.confirm ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  placeholder="Nhập lại mật khẩu mới"
                />
                <CheckCircle
                  size={18}
                  className="absolute left-3 top-2.5 text-gray-400"
                />

                {/* Nút con mắt */}
                <button
                  type="button"
                  onClick={() => toggleShow("confirm")}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPass.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
            >
              {loading ? "Đang xử lý..." : "Cập nhật mật khẩu"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ChangePassword;
