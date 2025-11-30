// backend/routes/profileRoutes.js
import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs"; // <-- 1. QUAN TRỌNG: Phải import cái này để mã hóa mật khẩu
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Tất cả các route ở đây đều yêu cầu đăng nhập (nhưng KHÔNG cần admin)
router.use(protect);

// --- 1. LẤY THÔNG TIN CÁ NHÂN ---
// GET /api/user/profile
router.get("/profile", async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

// --- 2. CẬP NHẬT THÔNG TIN (Tên, Email, SĐT...) ---
// PUT /api/user/profile
router.put("/profile", async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    // Kiểm tra email trùng
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: "Email đã tồn tại" });
      }
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.address = address || user.address; // Nếu model User có trường address

    await user.save();

    res.json({
      message: "Cập nhật thành công",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Lỗi cập nhật profile:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

// --- 3. ĐỔI MẬT KHẨU (Route mới thêm) ---
// PUT /api/user/profile/password
router.put("/profile/password", async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    // Tìm user và lấy mật khẩu để so sánh
    const user = await User.findById(req.user.userId).select("+password");

    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    // Nếu user có mật khẩu cũ (tức là không phải user Google mới tạo)
    if (user.password) {
      if (!oldPassword) {
        return res
          .status(400)
          .json({ message: "Vui lòng nhập mật khẩu hiện tại" });
      }
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Mật khẩu cũ không chính xác" });
      }
    }

    // Mã hóa và lưu mật khẩu mới
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.json({ message: "Cập nhật mật khẩu thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

export default router;
