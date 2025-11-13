import React from "react";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  // Lấy token từ localStorage
  const token = localStorage.getItem("adminToken");

  if (!token) {
    // Nếu không có token, điều hướng về trang login
    return <Navigate to="/" replace />;
  }

  // Nếu có token, hiển thị component con (ví dụ: AdminLayout)
  return <Outlet />;
}

export default ProtectedRoute;
