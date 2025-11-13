import express from "express";
import Order from "../models/Order.js"; // Model đơn hàng
import Product from "../models/Product.js"; // <--- DÒNG NÀY PHẢI CÓ
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Thông tin ngân hàng cố định
const BANK_INFO = {
  bankCode: "BIDV",
  accountNumber: "4520622003",
  accountName: "NGUYEN VAN TOAN",
};

// API này giờ sẽ TẠO ĐƠN HÀNG, TRỪ KHO, và TẠO MÃ QR
router.post("/bank", protect, async (req, res) => {
  try {
    console.log("=== POST /api/payment/bank ===");

    const { orderItems, shippingAddress, totalPrice } = req.body;
    const userId = req.user.userId;

    if (!orderItems || !shippingAddress || !totalPrice) {
      return res.status(400).json({
        message: "Thiếu thông tin giỏ hàng, địa chỉ hoặc tổng tiền!",
      });
    }

    // === BẮT ĐẦU LOGIC TRỪ KHO (ĐÂY LÀ ĐOẠN CODE QUAN TRỌNG) ===
    for (const item of orderItems) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res
          .status(404)
          .json({ message: `Sản phẩm với ID ${item.product} không tìm thấy.` });
      }
      if (product.countInStock < item.qty) {
        return res
          .status(400)
          .json({
            message: `Sản phẩm "${product.name}" không đủ số lượng trong kho. Chỉ còn ${product.countInStock} sản phẩm.`,
          });
      }

      product.countInStock -= item.qty;
      await product.save(); // Lưu lại sản phẩm đã cập nhật số lượng
    }
    // === KẾT THÚC LOGIC TRỪ KHO ===

    // Tạo mã đơn hàng và lưu vào database
    const orderCode = `DH${Date.now()}`;

    const newOrder = new Order({
      user: userId,
      orderItems,
      shippingAddress,
      totalPrice: totalPrice,
      orderCode: orderCode,
      status: "pending",
      paymentMethod: "bank",
    });

    const savedOrder = await newOrder.save();
    console.log("✅ Đơn hàng BANK đã được lưu vào DB:", savedOrder._id); // Tạo mã QR

    const transferContent = `${orderCode} ${shippingAddress.phone}`;

    const qrImage = `https://img.vietqr.io/image/${BANK_INFO.bankCode}-${
      BANK_INFO.accountNumber
    }-compact2.jpg?amount=${totalPrice}&addInfo=${encodeURIComponent(
      transferContent
    )}&accountName=${encodeURIComponent(BANK_INFO.accountName)}`;

    res.json({
      success: true,
      qrImage,
      orderId: savedOrder._id,
      orderCode: orderCode,
      transferContent: transferContent,
    });
  } catch (error) {
    console.error("❌ Lỗi khi tạo đơn hàng & QR:", error);
    res.status(500).json({
      success: false,
      message: "Không thể tạo đơn hàng",
      error: error.message,
    });
  }
});

export default router;
