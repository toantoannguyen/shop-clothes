import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Package, Clock, CheckCircle, XCircle, Truck } from "lucide-react";
import Header from "../components/header";
import Footer from "../components/footer";

function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Kiểm tra đăng nhập
    const token = localStorage.getItem("token");
    if (!token) {
      alert("⚠️ Vui lòng đăng nhập!");
      navigate("/login");
      return;
    }

    // Tải danh sách đơn hàng
    fetchOrders(token);
  }, [navigate]);

  const fetchOrders = async (token) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/orders/myorders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data || []);
      } else {
        const errData = await response.json();
        console.error("Lỗi tải đơn hàng:", errData.message);
        setError(errData.message || "Không thể tải đơn hàng");
      }
    } catch (error) {
      console.error("Lỗi:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Màu sắc và icon theo trạng thái
  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":
        return {
          color: "text-yellow-700",
          bg: "bg-yellow-100",
          icon: <Clock size={18} />,
          text: "Đang xử lý",
        };
      case "paid":
        return {
          color: "text-blue-700",
          bg: "bg-blue-100",
          icon: <CheckCircle size={18} />,
          text: "Đã thanh toán",
        };
      case "shipped":
        return {
          color: "text-purple-700",
          bg: "bg-purple-100",
          icon: <Truck size={18} />,
          text: "Đang giao hàng",
        };
      case "delivered":
        return {
          color: "text-green-700",
          bg: "bg-green-100",
          icon: <CheckCircle size={18} />,
          text: "Đã giao hàng",
        };
      case "cancelled":
        return {
          color: "text-red-700",
          bg: "bg-red-100",
          icon: <XCircle size={18} />,
          text: "Đã hủy",
        };
      default:
        return {
          color: "text-gray-700",
          bg: "bg-gray-100",
          icon: <Package size={18} />,
          text: status || "Không xác định",
        };
    }
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="container mx-auto px-6 py-40 mt-16 text-center">
          <p className="text-xl">Đang tải đơn hàng...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="container mx-auto px-6 py-20 mt-16">
        <h2 className="text-3xl font-bold mb-8">Đơn hàng đã mua</h2>

        {/* Hiển thị lỗi nếu có */}
        {error && (
          <div className="text-center py-20 bg-red-50 text-red-700 rounded-lg">
            <p className="text-xl mb-4">Rất tiếc, đã xảy ra lỗi</p>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && orders.length === 0 ? (
          <div className="text-center py-20">
            <Package size={80} className="mx-auto text-gray-300 mb-4" />
            <p className="text-xl text-gray-500 mb-4">
              Bạn chưa có đơn hàng nào
            </p>
            <button
              onClick={() => navigate("/products")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Mua sắm ngay
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const statusStyle = getStatusStyle(order.status);
              return (
                <div
                  key={order._id}
                  className="bg-white rounded-lg shadow-lg p-6 border border-gray-200"
                >
                  {/* Header đơn hàng */}
                  <div className="flex justify-between items-start mb-4 pb-4 border-b">
                    <div>
                      <p className="text-sm text-gray-500">Mã đơn hàng</p>
                      <p className="font-bold text-lg">{order.orderCode}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(order.createdAt).toLocaleDateString("vi-VN", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <div
                      className={`flex items-center gap-2 px-4 py-2 rounded-full ${statusStyle.bg}`}
                    >
                      <span className={statusStyle.color}>
                        {statusStyle.icon}
                      </span>
                      <span
                        className={`font-semibold text-sm ${statusStyle.color}`}
                      >
                        {statusStyle.text}
                      </span>
                    </div>
                  </div>

                  {/* Danh sách sản phẩm */}
                  <div className="space-y-3 mb-4">
                    {order.orderItems.map((item, index) => (
                      <div
                        key={item._id || index}
                        className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                      >
                        <img
                          src={`/${item.image}`}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-sm text-gray-600">
                            Số lượng: {item.qty}
                          </p>
                        </div>
                        <p className="font-bold text-blue-600">
                          {item.price.toLocaleString("vi-VN")}₫
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Thông tin giao hàng */}
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <h4 className="font-semibold mb-2">Thông tin giao hàng:</h4>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Người nhận:</span>{" "}
                      {order.shippingAddress.fullName}
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">SĐT:</span>{" "}
                      {order.shippingAddress.phone}
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Địa chỉ:</span>{" "}
                      {order.shippingAddress.address}
                    </p>
                  </div>

                  {/* Tổng tiền */}
                  <div className="flex justify-between items-center pt-4 border-t">
                    <p className="text-gray-600">Tổng tiền:</p>
                    <p className="text-2xl font-bold text-red-600">
                      {order.totalPrice.toLocaleString("vi-VN")}₫
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Orders;
