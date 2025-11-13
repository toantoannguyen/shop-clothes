// backend/routes/authRoutes.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import passport from "passport";
import User from "../models/User.js";

const router = express.Router();

// Đăng ký
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email đã được sử dụng" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Dòng code MỚI (sử dụng cho cả 3 chỗ)
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: "user" }, // <-- ĐÃ THÊM ROLE
      process.env.JWT_SECRET || "secret_key_default",
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Đăng ký thành công",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Lỗi đăng ký:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

// Đăng nhập
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    console.log(">>> SERVER ĐANG THẤY USER:", user);
    if (!user) {
      return res
        .status(401)
        .json({ message: "Email hoặc mật khẩu không đúng" });
    }
    if (!user.password) {
      return res.status(401).json({
        message:
          "Tài khoản này được đăng ký qua Google. Vui lòng đăng nhập bằng Google.",
      });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res
        .status(401)
        .json({ message: "Email hoặc mật khẩu không đúng" });
    }

    // Dòng code MỚI (sử dụng cho cả 3 chỗ)
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role }, // <-- ĐÃ THÊM ROLE
      process.env.JWT_SECRET || "secret_key_default",
      { expiresIn: "7d" }
    );

    res.json({
      message: "Đăng nhập thành công",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Lỗi đăng nhập:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

// Google OAuth routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/api/auth/login/failed",
  }),
  (req, res) => {
    // Tạo JWT token cho Google OAuth (tùy chọn, để nhất quán với đăng nhập thường)
    // Dòng code MỚI (sử dụng cho cả 3 chỗ)
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role }, // <-- ĐÃ THÊM ROLE
      process.env.JWT_SECRET || "secret_key_default",
      { expiresIn: "7d" }
    );
    // Chuyển hướng về frontend với token (hoặc lưu vào cookie)
    res.redirect(`http://localhost:3000?token=${token}`);
  }
);

router.get("/login/failed", (req, res) => {
  res
    .status(401)
    .json({ success: false, message: "Đăng nhập Google thất bại" });
});

router.get("/user", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ success: true, user: req.user });
  } else {
    res.status(401).json({ success: false, message: "Chưa đăng nhập" });
  }
});

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("http://localhost:3000");
  });
});

export default router;
