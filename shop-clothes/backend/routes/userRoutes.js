// backend/routes/userRoutes.js
import express from "express";
import User from "../models/User.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";
import bcrypt from "bcryptjs";

const router = express.Router();

// CHÚ Ý: Tất cả các route trong file này đều YÊU CẦU LÀ ADMIN
// (Dùng để quản lý người dùng khác, KHÔNG dùng cho việc cá nhân)
router.use(protect, isAdmin);

// --- 1. LẤY DANH SÁCH USER (Có Tìm kiếm & Phân trang) ---
// GET /api/users?page=1&keyword=abc
router.get("/", async (req, res) => {
  try {
    const pageSize = 10; // 10 user mỗi trang
    const page = Number(req.query.page) || 1;

    // Xử lý tìm kiếm (theo tên HOẶC email)
    const keyword = req.query.keyword
      ? {
          $or: [
            { name: { $regex: req.query.keyword, $options: "i" } },
            { email: { $regex: req.query.keyword, $options: "i" } },
          ],
        }
      : {};

    // Điều kiện: Khớp từ khóa VÀ chưa bị xóa
    const query = { ...keyword, isDeleted: { $ne: true } };

    const count = await User.countDocuments(query);
    const users = await User.find(query)
      .select("-password") // Ẩn mật khẩu
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ createdAt: -1 });

    res.json({
      users,
      page,
      pages: Math.ceil(count / pageSize),
      total: count,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

// --- 2. CẬP NHẬT QUYỀN ADMIN ---
// PUT /api/users/:id/toggle-admin
router.put("/:id/toggle-admin", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    // Đảo ngược quyền
    user.role = user.role === "admin" ? "user" : "admin";
    await user.save();

    res.json({ message: `Đã cập nhật quyền thành ${user.role}` });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

// --- 3. ADMIN RESET MẬT KHẨU CHO USER ---
// PUT /api/users/:id/reset-password
router.put("/:id/reset-password", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    // Đặt mật khẩu mặc định là '123456'
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash("123456", salt);
    await user.save();

    res.json({ message: "Đã reset mật khẩu về '123456'" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

// --- 4. XÓA ẢO USER ---
// DELETE /api/users/:id
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    // Không cho admin tự xóa mình
    if (user._id.toString() === req.user.userId) {
      return res
        .status(400)
        .json({ message: "Bạn không thể tự xóa chính mình" });
    }

    user.isDeleted = true;
    await user.save();

    res.json({ message: "Người dùng đã được xóa ảo" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

export default router;
