import express from "express";
import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Tất cả route trong này đều phải là Admin
router.use(protect, isAdmin);

// GET /api/dashboard/summary
// Lấy dữ liệu thống kê tổng quan
router.get("/summary", async (req, res) => {
  try {
    // 1. Tính Tổng Doanh thu (chỉ tính đơn hàng ĐÃ THANH TOÁN)
    const salesData = await Order.aggregate([
      {
        $match: { isPaid: true }, // Chỉ lấy đơn hàng đã thanh toán
      },
      {
        $group: {
          _id: null, // Nhóm tất cả lại
          totalSales: { $sum: "$totalPrice" }, // Tính tổng của 'totalPrice'
        },
      },
    ]);

    // 2. Lấy Tổng số đơn hàng
    const totalOrders = await Order.countDocuments();

    // 3. Lấy Tổng số khách hàng (không bị xóa)
    const totalUsers = await User.countDocuments({ isDeleted: { $ne: true } });

    // 4. Lấy Tổng số sản phẩm (không bị xóa)
    const totalProducts = await Product.countDocuments({
      isDeleted: { $ne: true },
    });

    // 5. Lấy Doanh thu 7 ngày gần nhất (cho biểu đồ)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7); // Đặt ngày về 7 ngày trước

    const salesOverTime = await Order.aggregate([
      {
        $match: {
          isPaid: true,
          createdAt: { $gte: sevenDaysAgo }, // Lọc đơn hàng trong 7 ngày
        },
      },
      {
        $group: {
          // Nhóm theo Ngày/Tháng/Năm
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          dailySales: { $sum: "$totalPrice" },
        },
      },
      { $sort: { _id: 1 } }, // Sắp xếp theo ngày tăng dần
    ]);

    res.json({
      totalSales: salesData.length > 0 ? salesData[0].totalSales : 0,
      totalOrders,
      totalUsers,
      totalProducts,
      salesOverTime, // Dữ liệu cho biểu đồ
    });
  } catch (error) {
    console.error("Lỗi khi lấy thống kê:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

export default router;
