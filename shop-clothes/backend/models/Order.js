import mongoose from "mongoose";

// Đây là khuôn mẫu cho 1 sản phẩm BÊN TRONG đơn hàng
const orderItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  qty: { type: Number, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  product: {
    // Link đến sản phẩm gốc
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Product",
  },
});

// Đây là khuôn mẫu cho 1 ĐƠN HÀNG
const orderSchema = new mongoose.Schema(
  {
    user: {
      // Người đã đặt hàng
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    orderItems: [orderItemSchema], // Danh sách sản phẩm
    shippingAddress: {
      // Địa chỉ giao hàng
      fullName: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      phone: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      required: true,
      default: "VietQR",
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    orderCode: {
      // Mã đơn hàng chúng ta tự tạo (DH12345)
      type: String,
      required: true,
      unique: true,
    },
    status: {
      // Trạng thái này admin sẽ thay đổi
      type: String,
      enum: ["pending", "paid", "shipped", "delivered", "cancelled"],
      default: "pending", // Mới tạo -> Chờ xử lý/thanh toán
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);

export default mongoose.model("Order", orderSchema);
