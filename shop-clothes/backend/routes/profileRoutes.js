// backend/routes/profileRoutes.js
import express from "express";
import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Chỉ cần đăng nhập, không cần admin
router.use(protect);

// --- CẬP NHẬT THÔNG TIN CÁ NHÂN ---
// PUT /api/user/profile
router.put("/profile", async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;

    // Tìm user hiện tại từ token
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    // Kiểm tra email có bị trùng không
    if (email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: "Email đã tồn tại" });
      }
    }

    // Cập nhật thông tin
    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.address = address || user.address;

    await user.save();

    // Trả về user đã cập nhật (không có password)
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

// --- LẤY THÔNG TIN CÁ NHÂN ---
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

export default router;
