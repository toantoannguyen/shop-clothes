import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  Clock,
  User,
  MessageSquare,
  CheckCircle2,
  Search,
  MoreVertical,
  Wifi,
  WifiOff,
} from "lucide-react";
import io from "socket.io-client";

// ✅ Kết nối tới server
const SOCKET_URL = "https://shop-clothes-backend.onrender.com";
let socket = null;

function AdminChatPage() {
  const [conversations, setConversations] = useState({});
  const [activeChatId, setActiveChatId] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef(null);

  // ✅ KẾT NỐI SOCKET KHI COMPONENT MOUNT
  useEffect(() => {
    // Khởi tạo socket
    socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
    });

    // Lắng nghe sự kiện kết nối
    socket.on("connect", () => {
      console.log("✅ Admin đã kết nối Socket.io:", socket.id);
      setIsConnected(true);

      // Thông báo cho server là Admin đã kết nối
      socket.emit("admin_ket_noi");
    });

    // Lắng nghe sự kiện mất kết nối
    socket.on("disconnect", () => {
      console.log("❌ Admin mất kết nối Socket.io");
      setIsConnected(false);
    });

    // ✅ NHẬN TẤT CẢ CUỘC TRÒ CHUYỆN KHI VỪA KẾT NỐI
    socket.on("tat_ca_cuoc_tro_chuyen", (allConversations) => {
      console.log("📜 Nhận tất cả cuộc trò chuyện:", allConversations);
      setConversations(allConversations);

      // Tự động chọn cuộc trò chuyện đầu tiên
      const firstUserId = Object.keys(allConversations)[0];
      if (firstUserId && !activeChatId) {
        setActiveChatId(firstUserId);
      }
    });

    // ✅ NHẬN TIN NHẮN MỚI TỪ CLIENT
    socket.on("co_tin_nhan_tu_client", (data) => {
      const { userId, userInfo, message } = data;
      console.log(`📩 Tin nhắn mới từ [${userId}]:`, message.content);

      setConversations((prevConvos) => {
        const existingConvo = prevConvos[userId] || {
          userInfo: userInfo,
          messages: [],
        };

        return {
          ...prevConvos,
          [userId]: {
            ...existingConvo,
            messages: [...existingConvo.messages, message],
          },
        };
      });

      // Tự động chọn cuộc trò chuyện này nếu chưa có cuộc trò chuyện nào được chọn
      if (!activeChatId) {
        setActiveChatId(userId);
      }
    });

    // ✅ XÁC NHẬN ADMIN ĐÃ GỬI TIN NHẮN
    socket.on("admin_da_gui", (data) => {
      const { userId, message } = data;
      console.log(`✅ Tin nhắn của Admin đã được gửi đến [${userId}]`);

      // Cập nhật UI để hiển thị tin nhắn đã gửi
      setConversations((prevConvos) => {
        if (!prevConvos[userId]) return prevConvos;

        const existingMessages = prevConvos[userId].messages;
        const messageExists = existingMessages.some((m) => m.id === message.id);

        if (messageExists) return prevConvos;

        return {
          ...prevConvos,
          [userId]: {
            ...prevConvos[userId],
            messages: [...existingMessages, message],
          },
        };
      });
    });

    // Cleanup khi component unmount
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversations, activeChatId]);

  // ✅ XỬ LÝ GỬI TIN NHẮN
  const handleAdminReply = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChatId || !socket || !isConnected) return;

    const messageData = {
      userId: activeChatId,
      content: newMessage,
    };

    // Gửi tin nhắn qua Socket.io
    socket.emit("admin_gui_tra_loi", messageData);
    console.log(`📤 Admin gửi tin nhắn đến [${activeChatId}]:`, newMessage);

    // Thêm tin nhắn vào UI ngay lập tức
    const newMsg = {
      id: Date.now(),
      sender: "admin",
      content: newMessage,
      timestamp: new Date().toISOString(),
      status: "sent",
    };

    setNewMessage("");
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
    });
  };

  const getRelativeTime = (timestamp) => {
    const now = Date.now();
    const diff = now - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Vừa xong";
    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    return `${days} ngày trước`;
  };

  // Tạo danh sách chat
  const chatList = Object.keys(conversations)
    .map((userId) => ({
      userId,
      ...conversations[userId].userInfo,
      lastMessage:
        conversations[userId].messages[
          conversations[userId].messages.length - 1
        ],
    }))
    .filter((chat) => {
      if (!searchQuery) return true;
      const name = chat.name || chat.userName || "Khách";
      const email = chat.email || chat.userEmail || "";
      return (
        name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    })
    .sort(
      (a, b) =>
        new Date(b.lastMessage?.timestamp || 0) -
        new Date(a.lastMessage?.timestamp || 0)
    );

  const activeMessages = conversations[activeChatId]?.messages || [];
  const activeUserInfo = conversations[activeChatId]?.userInfo || {};

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Danh sách cuộc trò chuyện */}
      <div className="w-full md:w-1/3 lg:w-1/4 border-r border-gray-200 bg-white flex flex-col">
        {/* Header */}
        <div className="p-4 border-b bg-gradient-to-r from-blue-600 to-indigo-600">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold text-white">💬 Quản lý Chat</h2>
            {/* Trạng thái kết nối */}
            {isConnected ? (
              <div className="flex items-center gap-1 bg-green-500 px-2 py-1 rounded-full">
                <Wifi size={14} className="text-white" />
                <span className="text-xs text-white">Online</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 bg-red-500 px-2 py-1 rounded-full">
                <WifiOff size={14} className="text-white" />
                <span className="text-xs text-white">Offline</span>
              </div>
            )}
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Tìm kiếm khách hàng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {chatList.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <MessageSquare size={48} className="mx-auto mb-3 opacity-30" />
              <p>Chưa có cuộc trò chuyện nào</p>
              <p className="text-xs mt-2">
                {isConnected ? "Đang chờ khách hàng..." : "Đang kết nối lại..."}
              </p>
            </div>
          ) : (
            chatList.map((chat) => {
              const displayName =
                chat.name || chat.userName || `Khách ${chat.userId}`;
              const displayEmail = chat.email || chat.userEmail || "";

              return (
                <div
                  key={chat.userId}
                  onClick={() => setActiveChatId(chat.userId)}
                  className={`p-4 border-b cursor-pointer transition-all ${
                    activeChatId === chat.userId
                      ? "bg-blue-50 border-l-4 border-l-blue-600"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div
                      className={`p-2 rounded-full ${
                        activeChatId === chat.userId
                          ? "bg-blue-600"
                          : "bg-gray-200"
                      }`}
                    >
                      <User
                        size={20}
                        className={
                          activeChatId === chat.userId
                            ? "text-white"
                            : "text-gray-600"
                        }
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <p className="font-semibold text-gray-800 truncate">
                          {displayName}
                        </p>
                        {chat.lastMessage && (
                          <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                            {getRelativeTime(chat.lastMessage.timestamp)}
                          </span>
                        )}
                      </div>
                      {displayEmail && (
                        <p className="text-xs text-gray-400 truncate mb-1">
                          {displayEmail}
                        </p>
                      )}
                      {chat.lastMessage && (
                        <p className="text-sm text-gray-500 truncate">
                          {chat.lastMessage.sender === "admin" && "✓ "}
                          {chat.lastMessage.content}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {!activeChatId ? (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <MessageSquare size={64} className="mx-auto opacity-30 mb-4" />
              <p className="text-lg font-medium">
                Chọn một cuộc trò chuyện để bắt đầu
              </p>
              <p className="text-sm mt-2">
                Hỗ trợ khách hàng của bạn đang chờ!
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="p-4 bg-white border-b shadow-sm flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                  <User size={24} />
                </div>
                <div>
                  <p className="font-bold text-gray-800">
                    {activeUserInfo.name ||
                      activeUserInfo.userName ||
                      `Khách ${activeChatId}`}
                  </p>
                  <p className="text-sm text-gray-500">
                    {activeUserInfo.email || activeUserInfo.userEmail || ""}
                  </p>
                </div>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-all">
                <MoreVertical size={20} className="text-gray-600" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {activeMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender === "admin" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                      msg.sender === "admin"
                        ? "bg-blue-500 text-white"
                        : "bg-white border border-gray-200 text-gray-800"
                    }`}
                  >
                    {msg.sender === "user" && (
                      <p className="font-semibold text-sm mb-1 text-blue-600">
                        👤 {msg.userName || "Khách"}
                      </p>
                    )}
                    <p className="break-words">{msg.content}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs opacity-75">
                      <Clock size={12} />
                      <span>{formatTime(msg.timestamp)}</span>
                      {msg.sender === "admin" && <CheckCircle2 size={12} />}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t bg-white shadow-lg">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleAdminReply(e);
                    }
                  }}
                  placeholder={
                    isConnected
                      ? "Nhập tin nhắn trả lời..."
                      : "Đang kết nối lại..."
                  }
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 transition-all"
                  disabled={!isConnected}
                />
                <button
                  onClick={handleAdminReply}
                  disabled={!newMessage.trim() || !isConnected}
                  className="bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Send size={20} />
                  <span className="hidden md:inline">Gửi</span>
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                💡 Nhấn Enter để gửi tin nhắn nhanh
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AdminChatPage;
