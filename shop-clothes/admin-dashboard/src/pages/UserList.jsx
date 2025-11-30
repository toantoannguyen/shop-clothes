import React, { useState, useEffect } from "react";
import api from "../api/axiosConfig";
import {
  FaCheckCircle,
  FaUserCircle,
  FaTrash,
  FaKey,
  FaSearch,
  FaExclamationTriangle,
} from "react-icons/fa";

function UserListPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  // State cho tìm kiếm và phân trang
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  // Gọi API khi trang (page) thay đổi
  useEffect(() => {
    fetchUsers();
  }, [page]);

  const fetchUsers = async (searchKeyword = keyword) => {
    try {
      setLoading(true);
      setError(null);

      // Gọi API kèm theo page và keyword
      const response = await api.get(
        `/users?page=${page}&keyword=${searchKeyword}`
      );

      // Cập nhật state từ dữ liệu trả về
      setUsers(response.data.users || []);
      setTotalPages(response.data.pages || 1);
      setPage(response.data.page || 1);
      setTotalUsers(response.data.total || 0);
    } catch (err) {
      console.error("Fetch users error:", err);
      setError(
        err.response?.data?.message || "Không thể tải danh sách người dùng"
      );
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý khi nhấn nút Tìm kiếm
  const handleSearch = () => {
    setPage(1); // Reset về trang 1 khi tìm kiếm mới
    fetchUsers(keyword);
  };

  // Xử lý Enter key
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Xử lý khi xóa keyword
  const handleClearSearch = () => {
    setKeyword("");
    setPage(1);
    fetchUsers("");
  };

  // 1. Đổi quyền Admin
  const handleToggleAdmin = async (userId, currentRole, userName) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    const actionText =
      currentRole === "admin" ? "gỡ quyền Admin" : "cấp quyền Admin";

    if (window.confirm(`Bạn có chắc muốn ${actionText} cho "${userName}"?`)) {
      try {
        setActionLoading(userId);
        await api.put(`/users/${userId}/toggle-admin`);

        // Cập nhật local state để UI phản hồi nhanh
        setUsers(
          users.map((user) =>
            user._id === userId ? { ...user, role: newRole } : user
          )
        );

        // Tải lại để đảm bảo đồng bộ
        await fetchUsers();
      } catch (err) {
        console.error("Toggle admin error:", err);
        alert("❌ Lỗi: " + (err.response?.data?.message || err.message));
      } finally {
        setActionLoading(null);
      }
    }
  };

  // 2. Reset Mật khẩu
  const handleResetPassword = async (userId, userName) => {
    if (
      window.confirm(
        `Bạn có chắc muốn reset mật khẩu của "${userName}" về "123456"?`
      )
    ) {
      try {
        setActionLoading(userId);
        await api.put(`/users/${userId}/reset-password`);
        alert(
          `✅ Đã reset mật khẩu thành công cho "${userName}"\n\nMật khẩu mới: 123456`
        );
      } catch (err) {
        console.error("Reset password error:", err);
        alert("❌ Lỗi: " + (err.response?.data?.message || err.message));
      } finally {
        setActionLoading(null);
      }
    }
  };

  // 3. Xóa User
  const handleDeleteUser = async (userId, userName) => {
    if (
      window.confirm(
        `⚠️ Bạn có chắc muốn xóa người dùng "${userName}"?\n\nHành động này không thể hoàn tác.`
      )
    ) {
      try {
        setActionLoading(userId);
        await api.delete(`/users/${userId}`);

        // Xóa khỏi local state
        setUsers(users.filter((user) => user._id !== userId));
        setTotalUsers((prev) => prev - 1);

        // Nếu trang hiện tại không còn user, quay về trang trước
        if (users.length === 1 && page > 1) {
          setPage(page - 1);
        } else {
          await fetchUsers();
        }
      } catch (err) {
        console.error("Delete user error:", err);
        alert("❌ Lỗi: " + (err.response?.data?.message || err.message));
      } finally {
        setActionLoading(null);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Quản lý Người dùng
          </h1>
          {totalUsers > 0 && (
            <p className="text-gray-500 mt-1">
              Tổng số: {totalUsers} người dùng
            </p>
          )}
        </div>
      </div>

      {/* Thanh Tìm kiếm */}
      <div className="mb-6">
        <div className="flex gap-2 max-w-2xl">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Tìm theo tên hoặc email..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {keyword && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
          <button
            onClick={handleSearch}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium transition-colors"
          >
            <FaSearch /> Tìm kiếm
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        /* Error State */
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <FaExclamationTriangle className="mx-auto text-red-500 text-3xl mb-3" />
          <p className="text-red-700 font-medium mb-2">Không thể tải dữ liệu</p>
          <p className="text-red-600 text-sm mb-4">{error}</p>
          <button
            onClick={() => fetchUsers()}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      ) : users.length === 0 ? (
        /* Empty State */
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
          <FaUserCircle className="mx-auto text-gray-300 text-5xl mb-4" />
          <p className="text-gray-600 font-medium mb-2">
            {keyword ? "Không tìm thấy người dùng" : "Chưa có người dùng nào"}
          </p>
          {keyword && (
            <button
              onClick={handleClearSearch}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Xóa bộ lọc
            </button>
          )}
        </div>
      ) : (
        /* Table */
        <>
          <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Tên
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Quyền
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {user.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-700">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.role === "admin" ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                          <FaCheckCircle className="mr-1.5" /> Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                          <FaUserCircle className="mr-1.5" /> User
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end gap-2">
                        {/* Nút Đổi Quyền */}
                        <button
                          onClick={() =>
                            handleToggleAdmin(user._id, user.role, user.name)
                          }
                          disabled={actionLoading === user._id}
                          className={`px-3 py-1.5 rounded-md text-sm font-medium border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                            user.role === "admin"
                              ? "text-orange-600 border-orange-300 hover:bg-orange-50"
                              : "text-blue-600 border-blue-300 hover:bg-blue-50"
                          }`}
                          title={
                            user.role === "admin"
                              ? "Gỡ quyền Admin"
                              : "Cấp quyền Admin"
                          }
                        >
                          {user.role === "admin" ? "Gỡ Admin" : "Lên Admin"}
                        </button>

                        {/* Nút Reset Pass */}
                        <button
                          onClick={() =>
                            handleResetPassword(user._id, user.name)
                          }
                          disabled={actionLoading === user._id}
                          className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Reset Mật khẩu về 123456"
                        >
                          <FaKey size={16} />
                        </button>

                        {/* Nút Xóa */}
                        <button
                          onClick={() => handleDeleteUser(user._id, user.name)}
                          disabled={actionLoading === user._id}
                          className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Xóa người dùng"
                        >
                          <FaTrash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Phân trang */}
          {totalPages > 1 && (
            <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-600">
                Hiển thị trang {page} / {totalPages}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(1)}
                  disabled={page === 1 || loading}
                  className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                >
                  Đầu
                </button>
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1 || loading}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                >
                  ← Trước
                </button>
                <div className="px-4 py-2 bg-blue-50 border border-blue-200 rounded-md font-semibold text-blue-700 text-sm">
                  {page}
                </div>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages || loading}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                >
                  Sau →
                </button>
                <button
                  onClick={() => setPage(totalPages)}
                  disabled={page === totalPages || loading}
                  className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                >
                  Cuối
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default UserListPage;
