// backend/models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Vui lòng nhập tên"],
      trim: true,
    },

    // === ĐÃ SỬA LỖI E11000 Ở ĐÂY ===
    email: {
      type: String,
      required: [true, "Vui lòng nhập email"],
      unique: true,
      sparse: true, // <-- ĐÃ THÊM DÒNG NÀY ĐỂ SỬA LỖI "email: null"
      lowercase: true,
      trim: true,
    },
    // =============================

    password: {
      type: String,
      required: false, // Không bắt buộc cho Google OAuth
      minlength: [6, "Mật khẩu phải có ít nhất 6 ký tự"],
      // Bạn có thể thêm "select: false" ở đây để bảo mật hơn
      // select: false,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Cho phép null nhưng vẫn đảm bảo unique
    },
    avatar: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
