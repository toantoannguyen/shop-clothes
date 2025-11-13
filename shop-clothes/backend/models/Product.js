import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String },
    description: { type: String },
    countInStock: {
      type: Number,
      required: true,
      default: 9999, // Mặc định là 0
    },
    isDeleted: { type: Boolean, default: false, select: false },

    // 'select: false' có nghĩa là trường này sẽ tự động bị ẩn đi
    // khi gọi .find(), trừ khi ta yêu cầu rõ
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
