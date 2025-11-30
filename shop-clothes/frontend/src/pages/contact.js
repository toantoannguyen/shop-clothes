import React, { useState, useEffect, useRef } from "react";
import {
  Mail,
  MessageCircle,
  Send,
  Clock,
  CheckCircle2,
  Phone,
  MapPin,
  Wifi,
  WifiOff,
  AlertCircle,
} from "lucide-react";
import io from "socket.io-client";

// Cấu hình kết nối Socket.io
const SOCKET_URL =
  window.location.hostname === "localhost"
    ? "https://shop-clothes-backend.onrender.com"
    : window.location.origin;
let socket = null;

function ContactPage() {
  // ===== STATE MANAGEMENT =====
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [userInfo, setUserInfo] = useState({
    name: "Khách",
    email: "",
    _id: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(false);

  const messagesEndRef = useRef(null);
  const userId = useRef(getOrCreateChatId()).current;

  // ===== HELPER FUNCTIONS =====
  /**
   * Tạo hoặc lấy Chat Session ID từ localStorage
   * ID này sẽ được duy trì ngay cả khi F5 (refresh)
   */
  function getOrCreateChatId() {
    const STORAGE_KEY = "myChatSessionId";
    let sessionId = localStorage.getItem(STORAGE_KEY);

    if (!sessionId) {
      sessionId = `user_${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 9)}`;
      localStorage.setItem(STORAGE_KEY, sessionId);
      console.log("✅ Tạo session ID mới:", sessionId);
    } else {
      console.log("♻️ Sử dụng session ID cũ:", sessionId);
    }
    return sessionId;
  }

  /**
   * Format timestamp thành dạng giờ:phút dễ đọc
   */
  const formatTime = (timestamp) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "";
    }
  };

  // ===== EFFECT: LOAD USER INFO =====
  /**
   * Load thông tin user từ localStorage khi component mount
   * Chỉ chạy 1 lần duy nhất
   */
  useEffect(() => {
    try {
      const userString = localStorage.getItem("user");
      if (userString) {
        const userData = JSON.parse(userString);
        setUserInfo({
          name: userData.name || "Khách",
          email: userData.email || "",
          _id: userData._id || null,
        });
        console.log("👤 Đã load user:", userData.name);
      }
    } catch (error) {
      console.error("❌ Lỗi load user:", error);
    }
  }, []);

  // ===== EFFECT: SOCKET CONNECTION =====
  /**
   * Khởi tạo và quản lý kết nối Socket.io
   * Phụ thuộc vào userId và userInfo
   */
  useEffect(() => {
    console.log("🔌 Đang khởi tạo socket...");

    // Khởi tạo socket với cấu hình
    socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    // ===== SOCKET EVENT LISTENERS =====
    // Sự kiện: Kết nối thành công
    socket.on("connect", () => {
      console.log("✅ Đã kết nối Socket:", socket.id);
      setIsConnected(true);
      setConnectionError(false);

      // Gửi thông tin user lên server
      socket.emit("client_ket_noi", {
        userId: userId,
        userName: userInfo.name,
        userEmail: userInfo.email,
        registeredUserId: userInfo._id,
      });
    });

    // Sự kiện: Mất kết nối
    socket.on("disconnect", (reason) => {
      console.log("❌ Mất kết nối Socket. Lý do:", reason);
      setIsConnected(false);
      setConnectionError(true);
    });

    // Sự kiện: Lỗi kết nối
    socket.on("connect_error", (error) => {
      console.error("❌ Lỗi kết nối:", error.message);
      setConnectionError(true);
    });

    // Sự kiện: Nhận lịch sử chat từ server
    socket.on("lich_su_chat", (history) => {
      console.log(
        "📜 Nhận lịch sử chat:",
        history.messages?.length || 0,
        "tin nhắn"
      );
      if (history.messages && Array.isArray(history.messages)) {
        setMessages(history.messages);
      }
    });

    // Sự kiện: Nhận tin nhắn mới từ admin
    socket.on("co_tin_nhan_tu_admin", (messageData) => {
      console.log("📨 Nhận tin nhắn từ Admin:", messageData.content);

      setMessages((prev) => {
        // Kiểm tra duplicate để tránh hiển thị tin nhắn trùng
        if (prev.some((msg) => msg.id === messageData.id)) {
          return prev;
        }
        return [...prev, messageData];
      });

      setIsSubmitting(false);
    });

    // Sự kiện: Xác nhận tin nhắn đã được server nhận
    socket.on("tin_nhan_da_gui", (data) => {
      console.log("✅ Server đã nhận tin nhắn:", data.messageId);
      setIsSubmitting(false);

      // Cập nhật trạng thái tin nhắn thành "delivered"
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === data.messageId ? { ...msg, status: "delivered" } : msg
        )
      );
    });

    // Cleanup: Ngắt kết nối khi component unmount
    return () => {
      if (socket) {
        console.log("🔌 Đang ngắt kết nối socket...");
        socket.disconnect();
      }
    };
  }, [userId, userInfo]);

  // ===== EFFECT: AUTO SCROLL =====
  /**
   * Tự động cuộn xuống tin nhắn mới nhất
   */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ===== EFFECT: SAVE CHAT HISTORY =====
  /**
   * Lưu lịch sử chat vào localStorage để persist data
   */
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem("chat_history", JSON.stringify(messages));
      } catch (error) {
        console.error("❌ Lỗi lưu lịch sử chat:", error);
      }
    }
  }, [messages]);

  // ===== EVENT HANDLERS =====
  /**
   * Xử lý gửi tin nhắn
   */
  const handleSendMessage = (e) => {
    e.preventDefault();

    // Validate
    if (!newMessage.trim()) {
      console.warn("⚠️ Tin nhắn trống");
      return;
    }

    if (!socket || !isConnected) {
      console.error("❌ Socket chưa kết nối");
      setConnectionError(true);
      alert("Chưa kết nối tới server. Vui lòng thử lại sau!");
      return;
    }

    setIsSubmitting(true);

    // Tạo message object
    const messageData = {
      id: Date.now(),
      sender: "user",
      content: newMessage.trim(),
      userId: userId,
      userName: userInfo.name,
      userEmail: userInfo.email,
      timestamp: new Date().toISOString(),
      status: "sent",
      userInfo: {
        name: userInfo.name,
        email: userInfo.email,
        registeredUserId: userInfo._id,
      },
    };

    // Thêm tin nhắn vào UI ngay lập tức (optimistic update)
    setMessages((prev) => [...prev, messageData]);
    setNewMessage("");

    // Gửi tin nhắn qua socket
    socket.emit("client_gui_tin_nhan", messageData);
    console.log("📤 Đã gửi tin nhắn:", messageData.content);

    // Timeout fallback: Reset isSubmitting sau 3 giây
    setTimeout(() => {
      setIsSubmitting(false);
    }, 3000);
  };

  /**
   * Xử lý Enter key để gửi tin nhắn nhanh
   */
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  /**
   * Mở Zalo chat
   */
  const handleZaloClick = () => {
    window.open("https://zalo.me/0373157077", "_blank");
  };

  // ===== RENDER =====
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* ===== HEADER ===== */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            📧 Liên Hệ Với Chúng Tôi
          </h1>
          <p className="text-gray-600 text-lg">
            Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7
          </p>

          {/* Connection Status Badge */}
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-md">
            {isConnected ? (
              <>
                <Wifi size={16} className="text-green-500" />
                <span className="text-sm text-green-600 font-medium">
                  Đang kết nối
                </span>
              </>
            ) : connectionError ? (
              <>
                <WifiOff size={16} className="text-red-500" />
                <span className="text-sm text-red-600 font-medium">
                  Mất kết nối
                </span>
              </>
            ) : (
              <>
                <AlertCircle size={16} className="text-yellow-500" />
                <span className="text-sm text-yellow-600 font-medium">
                  Đang kết nối...
                </span>
              </>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* ===== CONTACT METHODS ===== */}
          <div className="space-y-6">
            {/* Zalo Contact Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-blue-500 p-4 rounded-full">
                  <MessageCircle size={32} className="text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Chat qua Zalo
                  </h3>
                  <p className="text-gray-600">Phản hồi nhanh nhất</p>
                </div>
              </div>
              <button
                onClick={handleZaloClick}
                className="w-full bg-blue-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle size={20} />
                Mở Zalo Chat
              </button>
            </div>

            {/* Email Contact Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-green-500 p-4 rounded-full">
                  <Mail size={32} className="text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Email</h3>
                  <p className="text-gray-600">support@company.com</p>
                </div>
              </div>
              <a
                href="mailto:support@company.com"
                className="w-full bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition-all flex items-center justify-center gap-2 block text-center"
              >
                <Mail size={20} />
                Gửi Email
              </a>
            </div>

            {/* Phone Contact Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-purple-500 p-4 rounded-full">
                  <Phone size={32} className="text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Hotline</h3>
                  <p className="text-gray-600">0373157077</p>
                </div>
              </div>
              <a
                href="tel:0373157077"
                className="w-full bg-purple-500 text-white py-3 rounded-xl font-semibold hover:bg-purple-600 transition-all flex items-center justify-center gap-2 block text-center"
              >
                <Phone size={20} />
                Gọi Ngay
              </a>
            </div>

            {/* Address Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-orange-500 p-4 rounded-full">
                  <MapPin size={32} className="text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Địa chỉ</h3>
                  <p className="text-gray-600">Hà Nội, Việt Nam</p>
                </div>
              </div>
            </div>
          </div>

          {/* ===== DIRECT CHAT BOX ===== */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col h-[600px]">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
              <h3 className="text-2xl font-bold mb-2">💬 Chat Trực Tiếp</h3>
              <p className="text-blue-100">
                {userInfo.name && userInfo.name !== "Khách"
                  ? `Xin chào ${userInfo.name}!`
                  : "Gửi tin nhắn cho chúng tôi"}
              </p>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
              {messages.length === 0 ? (
                // Empty State
                <div className="text-center text-gray-500 mt-20">
                  <MessageCircle
                    size={48}
                    className="mx-auto mb-4 opacity-30"
                  />
                  <p className="font-medium">Chưa có tin nhắn nào</p>
                  <p className="text-sm mt-2">Hãy bắt đầu cuộc trò chuyện!</p>
                </div>
              ) : (
                // Message List
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.sender === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs md:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                          msg.sender === "user"
                            ? "bg-blue-500 text-white"
                            : "bg-white border border-gray-200 text-gray-800"
                        }`}
                      >
                        {/* Admin Label */}
                        {msg.sender === "admin" && (
                          <p className="font-semibold text-sm mb-1 text-blue-600">
                            👨‍💼 Admin
                          </p>
                        )}

                        {/* Message Content */}
                        <p className="break-words whitespace-pre-wrap">
                          {msg.content}
                        </p>

                        {/* Message Metadata */}
                        <div className="flex items-center gap-2 mt-2 text-xs opacity-75">
                          <Clock size={12} />
                          <span>{formatTime(msg.timestamp)}</span>
                          {msg.sender === "user" && (
                            <>
                              {msg.status === "sent" && (
                                <CheckCircle2 size={12} />
                              )}
                              {msg.status === "delivered" && (
                                <>
                                  <CheckCircle2 size={12} />
                                  <CheckCircle2 size={12} className="-ml-2" />
                                </>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {/* Auto-scroll anchor */}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Message Input Area */}
            <div className="p-4 border-t bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={
                    isConnected ? "Nhập tin nhắn..." : "Đang kết nối lại..."
                  }
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  disabled={isSubmitting || !isConnected}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isSubmitting || !newMessage.trim() || !isConnected}
                  className="bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
                >
                  <Send size={20} />
                  <span className="hidden md:inline">Gửi</span>
                </button>
              </div>

              {/* Hint Text */}
              <p className="text-xs text-gray-500 mt-2">
                💡 Nhấn Enter để gửi tin nhắn nhanh
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
