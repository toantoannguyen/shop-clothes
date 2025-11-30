import axios from "axios";

// 1. Tạo một "instance" (thể hiện) của axios
const api = axios.create({
  baseURL: "https://shop-clothes-backend.onrender.com/api", // URL gốc của backend
});

// 2. Cấu hình "interceptor" (bộ chặn)
// Tự động đính kèm Token vào MỌI request gửi đi từ "api"
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      // Thêm token vào header Authorization
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
