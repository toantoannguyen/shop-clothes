import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  // 1. Kiểm tra xem có token trong localStorage không
  const token = localStorage.getItem("token");

  // 2. Nếu có token, cho phép truy cập vào các route con (Outlet)
  // 3. Nếu không, chuyển hướng về trang /login
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
