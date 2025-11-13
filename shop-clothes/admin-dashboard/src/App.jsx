import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import LoginPage from "./pages/Login";
import DashboardPage from "./pages/Dashboard";
import ProductListPage from "./pages/ProductList"; // <-- 1. IMPORT FILE MỚI
import ProductCreatePage from "./pages/ProductCreate"; // <-- 1. IMPORT FILE MỚI
// Layouts & Components
import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import ProductEditPage from "./pages/ProductEdit";
import TrashPage from "./pages/ProductTrash";
import UserListPage from "./pages/UserList"; // <-- IMPORT UserListPage MỚI
import OrderListPage from "./pages/OrderList"; // <-- IMPORT OrderListPage MỚI
import OrderDetailPage from "./pages/OrderDetail";
import AdminChatPage from "./pages/AdminChat";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route
            path="/dashboard"
            element={
              <AdminLayout>
                <DashboardPage />
              </AdminLayout>
            }
          />

          {/* === 2. THÊM ROUTE NÀY VÀO === */}
          <Route
            path="/products"
            element={
              <AdminLayout>
                <ProductListPage />
              </AdminLayout>
            }
          />
          <Route
            path="/products/create"
            element={
              <AdminLayout>
                <ProductCreatePage />
              </AdminLayout>
            }
          />
          <Route
            path="/products/edit/:id"
            element={
              <AdminLayout>
                <ProductEditPage />
              </AdminLayout>
            }
          />
          <Route
            path="/trash"
            element={
              <AdminLayout>
                <TrashPage />
              </AdminLayout>
            }
          />
          <Route
            path="/users"
            element={
              <AdminLayout>
                <UserListPage />
              </AdminLayout>
            }
          />
          <Route
            path="/orders"
            element={
              <AdminLayout>
                <OrderListPage />
              </AdminLayout>
            }
          />
          <Route
            path="/orders/:id"
            element={
              <AdminLayout>
                <OrderDetailPage />
              </AdminLayout>
            }
          />
          <Route
            path="/chat"
            element={
              <AdminLayout>
                <AdminChatPage />
              </AdminLayout>
            }
          />
          {/* Chúng ta sẽ thêm route /products/create và /products/edit sau */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
