// backend/middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Middleware 1: Xác thực người dùng (check token)
// Dùng để kiểm tra xem user đã đăng nhập hay chưa
const protect = async (req, res, next) => {
  let token;

  // Đọc token từ header 'Authorization'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Lấy token (bỏ chữ "Bearer ")
      token = req.headers.authorization.split(" ")[1];

      // Giải mã token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "secret_key_default"
      );

      // Lấy thông tin user từ token và gán vào req.user
      // Chúng ta không cần truy vấn DB vì 'role' đã có trong token
      req.user = decoded;

      next(); // Chuyển sang middleware tiếp theo
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Token không hợp lệ, từ chối truy cập" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Không có token, từ chối truy cập" });
  }
};

// Middleware 2: Phân quyền Admin (check role)
// Dùng sau middleware 'protect'
const isAdmin = (req, res, next) => {
  // 'req.user' đã được gán từ middleware 'protect'
  if (req.user && req.user.role === "admin") {
    next(); // Là admin, cho phép đi tiếp
  } else {
    res.status(403).json({ message: "Không có quyền admin" }); // 403 - Forbidden
  }
};

export { protect, isAdmin };
