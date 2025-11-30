import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Product from "./pages/product";
import ProductDetail from "./pages/productDetail";
import Login from "./pages/login";
import Register from "./pages/register";
import Cart from "./pages/cart";
import Checkout from "./pages/checkout";
import Payment from "./pages/payment";
import Profile from "./pages/profile";
import Orders from "./pages/order";
import ContactPage from "./pages/contact";
import PrivateRoute from "./components/PrivateRoute";
import ChangePassword from "./pages/ChangePassword";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Product />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<PrivateRoute />}>
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/change-password" element={<ChangePassword />} />
      </Route>
    </Routes>
  );
}

export default App;
