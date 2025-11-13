// backend/server.js
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";
import { Server } from "socket.io";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

import orderRoutes from "./routes/orderRoutes.js";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import session from "express-session";
import cookieParser from "cookie-parser";
import passport from "passport";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import "./config/passport.js";

const app = express();

// ✅ 1. Bật CORS
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:5173",
    ],
    credentials: true,
  })
);

// ✅ 2. Middlewares
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "Uploads")));
app.use("/img", express.static(path.join(__dirname, "img")));

// ✅ 3. ROUTES
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/user", profileRoutes);
app.get("/", (req, res) => {
  res.send("🚀 Server is running...");
});

// ✅ 4. Database
mongoose.connect(process.env.MONGO_URI);
const db = mongoose.connection;
db.on("connected", () => {
  console.log(`✅ MongoDB connected TỚI DATABASE: ${db.name}`);
});
db.on("error", (err) => {
  console.error("❌ MongoDB connection error:", err);
});

// ✅ 5. Cấu hình Server và Socket.io
const PORT = process.env.PORT || 5000;
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:5173",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// ✅ 6. LOGIC XỬ LÝ CHAT (ĐÃ SỬA)
let adminSocketId = null;
const chatHistory = {}; // Lưu lịch sử chat theo userId

io.on("connection", (socket) => {
  console.log(`🔌 Kết nối mới: ${socket.id}`);

  // 🟢 CLIENT KẾT NỐI
  socket.on("client_ket_noi", (userData) => {
    const userId = userData.userId || socket.id;
    socket.userId = userId;

    console.log(`👤 Client kết nối: ${userId}`);

    // Gửi lại lịch sử chat nếu có
    if (chatHistory[userId]) {
      socket.emit("lich_su_chat", chatHistory[userId]);
    } else {
      chatHistory[userId] = {
        userInfo: userData,
        messages: [],
      };
    }
  });

  // 🟢 CLIENT GỬI TIN NHẮN
  socket.on("client_gui_tin_nhan", (messageData) => {
    const userId = socket.userId || socket.id;
    console.log(`📩 Tin nhắn từ Client [${userId}]:`, messageData.content);

    // Lưu vào lịch sử
    if (!chatHistory[userId]) {
      chatHistory[userId] = {
        userInfo: messageData.userInfo || {},
        messages: [],
      };
    }

    const message = {
      ...messageData,
      userId: userId,
      timestamp: new Date().toISOString(),
    };

    chatHistory[userId].messages.push(message);

    // Gửi cho Admin nếu online
    if (adminSocketId) {
      io.to(adminSocketId).emit("co_tin_nhan_tu_client", {
        userId: userId,
        userInfo: chatHistory[userId].userInfo,
        message: message,
      });
      console.log(`✅ Đã gửi tin nhắn đến Admin`);
    } else {
      console.log("⚠️ Admin hiện không online");
    }

    // Xác nhận cho client
    socket.emit("tin_nhan_da_gui", { messageId: message.id });
  });

  // 🟡 ADMIN KẾT NỐI
  socket.on("admin_ket_noi", () => {
    adminSocketId = socket.id;
    socket.isAdmin = true;
    console.log(`👑 Admin đã kết nối: ${socket.id}`);

    // Gửi toàn bộ lịch sử chat cho Admin
    socket.emit("tat_ca_cuoc_tro_chuyen", chatHistory);
  });

  // 🟡 ADMIN GỬI TRẢ LỜI
  socket.on("admin_gui_tra_loi", (messageData) => {
    const { userId, content } = messageData;
    console.log(`📨 Admin trả lời cho [${userId}]:`, content);

    const message = {
      id: Date.now(),
      sender: "admin",
      content: content,
      timestamp: new Date().toISOString(),
      status: "sent",
    };

    // Lưu vào lịch sử
    if (chatHistory[userId]) {
      chatHistory[userId].messages.push(message);
    }

    // Gửi cho Client cụ thể
    const clientSockets = Array.from(io.sockets.sockets.values());
    const targetClient = clientSockets.find((s) => s.userId === userId);

    if (targetClient) {
      targetClient.emit("co_tin_nhan_tu_admin", message);
      console.log(`✅ Đã gửi tin nhắn đến Client [${userId}]`);
    } else {
      console.log(`⚠️ Client [${userId}] không online`);
    }

    // Gửi lại cho Admin để cập nhật UI
    if (adminSocketId) {
      io.to(adminSocketId).emit("admin_da_gui", {
        userId: userId,
        message: message,
      });
    }
  });

  // 🔴 NGẮT KẾT NỐI
  socket.on("disconnect", () => {
    console.log(`🔌 Ngắt kết nối: ${socket.id}`);

    if (socket.id === adminSocketId) {
      console.log("👑 Admin đã ngắt kết nối");
      adminSocketId = null;
    }
  });
});

// ✅ 7. KHỞI ĐỘNG SERVER
httpServer.listen(PORT, () => {
  console.log(`🚀 Server (và Socket.io) đang chạy trên port ${PORT}`);
});
