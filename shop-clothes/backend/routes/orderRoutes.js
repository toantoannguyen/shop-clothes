import express from "express";
import Order from "../models/Order.js"; // Model đơn hàng
import Product from "../models/Product.js"; // <-- 1. IMPORT PRODUCT MODEL
import { protect, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();
// === ROUTE MỚI CHO CLIENT ===
// GET /api/orders/myorders
// (Lấy lịch sử đơn hàng CỦA TÔI)
router.get("/myorders", protect, async (req, res) => {
  try {
    // Tìm các đơn hàng chỉ của user đã đăng nhập (lấy từ token)
    // req.user.userId được thêm vào từ middleware "protect"
    const orders = await Order.find({ user: req.user.userId }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});
// === 1. CLIENT ROUTE ===
// POST /api/orders
// (Tạo một đơn hàng mới - dùng cho COD)
router.post("/", protect, async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, totalPrice } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res
        .status(400)
        .json({ message: "Không có sản phẩm trong đơn hàng" });
    }

    // === 2. BẮT ĐẦU LOGIC TRỪ KHO (CHO COD) ===
    for (const item of orderItems) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res
          .status(404)
          .json({ message: `Sản phẩm với ID ${item.product} không tìm thấy.` });
      }
      if (product.countInStock < item.qty) {
        return res.status(400).json({
          message: `Sản phẩm "${product.name}" không đủ số lượng trong kho. Chỉ còn ${product.countInStock} sản phẩm.`,
        });
      }

      product.countInStock -= item.qty;
      await product.save(); // Lưu lại sản phẩm đã cập nhật số lượng
    }
    // === KẾT THÚC LOGIC TRỪ KHO ===

    // 3. Tạo đơn hàng sau khi đã trừ kho
    const orderCode = `DH${Date.now()}`;

    const order = new Order({
      user: req.user.userId, // Lấy từ token
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      orderCode,
      status: "pending",
    });

    const createdOrder = await order.save();
    console.log("✅ Đơn hàng COD đã được lưu vào DB:", createdOrder._id);
    res.status(201).json(createdOrder);
  } catch (error) {
    console.error("❌ Lỗi khi tạo đơn hàng COD:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

// === 2. ADMIN ROUTES ===
// (Phải thêm "protect, isAdmin" vào từng route)

// GET /api/orders (Lấy tất cả đơn hàng)
router.get("/", protect, isAdmin, async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

// GET /api/orders/:id (Lấy chi tiết 1 đơn hàng)
router.get("/:id", protect, isAdmin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

// PUT /api/orders/:id/update-status (Cập nhật trạng thái)
router.put("/:id/update-status", protect, isAdmin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }
    const { status, isPaid, isDelivered } = req.body;

    if (status) order.status = status;
    if (isPaid === true && !order.isPaid) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.status = "paid";
    }
    if (isDelivered === true && !order.isDelivered) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
      order.status = "delivered";
    }
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

export default router;
