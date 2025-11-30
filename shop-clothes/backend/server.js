// backend/server.js
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";
import { Server } from "socket.io";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import session from "express-session";
import cookieParser from "cookie-parser";
import passport from "passport";

// Import Routes
import orderRoutes from "./routes/orderRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";

// Config
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });
import "./config/passport.js";

const app = express();

// ==========================================
// 1. KẾT NỐI DATABASE
// ==========================================
mongoose.connect(process.env.MONGO_URI);
const db = mongoose.connection;
db.on("connected", () => {
  console.log(`✅ MongoDB connected TỚI DATABASE: ${db.name}`);
});
db.on("error", (err) => {
  console.error("❌ MongoDB connection error:", err);
});

// ==========================================
// 2. MIDDLEWARES (PHẢI ĐẶT TRƯỚC ROUTES)
// ==========================================

// 2.1. CORS
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

// 2.2. Parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "Uploads")));
app.use("/img", express.static(path.join(__dirname, "img")));

// 2.3. Session & Passport (QUAN TRỌNG: ĐẶT Ở ĐÂY)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-default-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Để false khi chạy localhost
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// ==========================================
// 3. ROUTES
// ==========================================
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

// ==========================================
// 4. SOCKET.IO & SERVER SETUP
// ==========================================
const PORT = process.env.PORT || 5000;
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Logic Chat (Giữ nguyên code của bạn)
let adminSocketId = null;
const chatHistory = {};

io.on("connection", (socket) => {
  console.log(`🔌 Kết nối mới: ${socket.id}`);

  // Client kết nối
  socket.on("client_ket_noi", (userData) => {
    const userId = userData.userId || socket.id;
    socket.userId = userId;
    console.log(`👤 Client kết nối: ${userId}`);

    if (chatHistory[userId]) {
      socket.emit("lich_su_chat", chatHistory[userId]);
    } else {
      chatHistory[userId] = {
        userInfo: userData,
        messages: [],
      };
    }
  });

  // Client gửi tin nhắn
  socket.on("client_gui_tin_nhan", (messageData) => {
    const userId = socket.userId || socket.id;
    console.log(`📩 Tin nhắn từ Client [${userId}]:`, messageData.content);

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

    if (adminSocketId) {
      io.to(adminSocketId).emit("co_tin_nhan_tu_client", {
        userId: userId,
        userInfo: chatHistory[userId].userInfo,
        message: message,
      });
    } else {
      console.log("⚠️ Admin hiện không online");
    }

    // Xác nhận cho client
    socket.emit("tin_nhan_da_gui", { messageId: message.id });
  });

  // Admin kết nối
  socket.on("admin_ket_noi", () => {
    adminSocketId = socket.id;
    socket.isAdmin = true;
    console.log(`👑 Admin đã kết nối: ${socket.id}`);
    socket.emit("tat_ca_cuoc_tro_chuyen", chatHistory);
  });

  // Admin trả lời
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

    if (chatHistory[userId]) {
      chatHistory[userId].messages.push(message);
    }

    // Tìm socket của client đó để gửi
    const clientSockets = Array.from(io.sockets.sockets.values());
    const targetClient = clientSockets.find((s) => s.userId === userId);

    if (targetClient) {
      targetClient.emit("co_tin_nhan_tu_admin", message);
      console.log(`✅ Đã gửi tin nhắn đến Client [${userId}]`);
    } else {
      console.log(`⚠️ Client [${userId}] không online`);
    }

    // Gửi lại cho Admin để hiện lên màn hình admin
    if (adminSocketId) {
      io.to(adminSocketId).emit("admin_da_gui", {
        // <-- Sự kiện mới
        userId: userId,
        message: message,
      });
    }
  });

  // Ngắt kết nối
  socket.on("disconnect", () => {
    console.log(`🔌 Ngắt kết nối: ${socket.id}`);
    if (socket.id === adminSocketId) {
      console.log("👑 Admin đã ngắt kết nối");
      adminSocketId = null;
    }
  });
});

// ==========================================
// 5. KHỞI ĐỘNG SERVER
// ==========================================
httpServer.listen(PORT, () => {
  console.log(`🚀 Server (và Socket.io) đang chạy trên port ${PORT}`);
});
