// backend/routes/userRoutes.js
import express from "express";
import User from "../models/User.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Yêu cầu tất cả route phải là Admin
router.use(protect, isAdmin);

// --- 1. LẤY DANH SÁCH USER ---
// GET /api/users
router.get("/", async (req, res) => {
  try {
    // Lấy user không bị xóa, và ẩn mật khẩu
    const users = await User.find({ isDeleted: { $ne: true } }).select(
      "-password"
    );
    res.json(users);
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

// --- 3. XÓA ẢO USER ---
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

// --- DÒNG QUAN TRỌNG NHẤT ---
export default router;
