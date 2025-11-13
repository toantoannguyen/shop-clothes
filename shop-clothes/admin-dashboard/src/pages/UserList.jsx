import React, { useState, useEffect } from "react";
import api from "../api/axiosConfig"; // API helper của chúng ta

import { FaCheckCircle, FaUserCircle, FaTrash } from "react-icons/fa"; // Icon cho đẹp

function UserListPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/users");
      setUsers(response.data);
    } catch (err) {
      setError(
        "Không thể tải danh sách người dùng. " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  // 2. UPDATE - Đổi quyền (Toggle Admin)
  const handleToggleAdmin = async (userId, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    if (
      window.confirm(
        `Bạn có chắc muốn đổi quyền của người dùng này thành "${newRole}"?`
      )
    ) {
      try {
        await api.put(`/users/${userId}/toggle-admin`);
        // Cập nhật lại UI mà không cần gọi lại API
        setUsers(
          users.map((user) =>
            user._id === userId ? { ...user, role: newRole } : user
          )
        );
      } catch (err) {
        alert(
          "Lỗi! Không thể đổi quyền. " +
            (err.response?.data?.message || err.message)
        );
      }
    }
  };

  // 3. DELETE - Xóa ảo người dùng
  const handleDeleteUser = async (userId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa (ẩn) người dùng này?")) {
      try {
        await api.delete(`/users/${userId}`);
        // Lọc user ra khỏi danh sách
        setUsers(users.filter((user) => user._id !== userId));
      } catch (err) {
        alert(
          "Lỗi! Không thể xóa. " + (err.response?.data?.message || err.message)
        );
      }
    }
  };

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">Quản lý Người dùng</h1>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tên người dùng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quyền
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user._id}>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                  {user.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.role === "admin" ? (
                    <span className="flex items-center text-sm font-semibold text-green-600">
                      <FaCheckCircle className="mr-1.5" /> Admin
                    </span>
                  ) : (
                    <span className="flex items-center text-sm text-gray-500">
                      <FaUserCircle className="mr-1.5" /> User
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleToggleAdmin(user._id, user.role)}
                    className={`font-semibold mr-4 ${
                      user.role === "admin"
                        ? "text-yellow-600 hover:text-yellow-900"
                        : "text-green-600 hover:text-green-900"
                    }`}
                  >
                    {user.role === "admin" ? "Gỡ quyền" : "Cấp quyền Admin"}
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user._id)}
                    className="text-red-600 hover:text-red-900"
                    title="Xóa ảo"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserListPage;
