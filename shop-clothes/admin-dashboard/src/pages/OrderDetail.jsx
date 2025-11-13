import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";

function OrderDetailPage() {
  const { id } = useParams(); // Lấy ID đơn hàng từ URL
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false); // Trạng thái khi đang cập nhật

  useEffect(() => {
    fetchOrder();
  }, [id]); // Chạy lại khi ID đơn hàng thay đổi

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/orders/${id}`);
      setOrder(response.data);
    } catch (err) {
      setError(
        "Không thể tải chi tiết đơn hàng: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (updateData) => {
    if (
      !window.confirm("Bạn có chắc chắn muốn cập nhật trạng thái đơn hàng này?")
    ) {
      return;
    }
    try {
      setUpdating(true);
      const response = await api.put(`/orders/${id}/update-status`, updateData);
      setOrder(response.data); // Cập nhật lại UI với dữ liệu mới
      alert("Cập nhật trạng thái thành công!");
    } catch (err) {
      alert(
        "Lỗi khi cập nhật trạng thái: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleString("vi-VN", options);
  };

  if (loading) return <p>Đang tải chi tiết đơn hàng...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!order) return <p>Không tìm thấy đơn hàng.</p>;

  return (
    <div className="container mx-auto p-6">
      <button
        onClick={() => navigate("/orders")}
        className="mb-4 text-indigo-600 hover:text-indigo-800"
      >
        &larr; Quay lại danh sách đơn hàng
      </button>
      <h1 className="text-3xl font-bold mb-6">
        Chi tiết Đơn hàng: #{order.orderCode}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Cột 1: Thông tin khách hàng & Giao hàng */}
        <div className="md:col-span-2 bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Thông tin Đơn hàng</h2>
          <div className="mb-4">
            <p className="font-semibold">Mã đơn hàng:</p>
            <p>{order.orderCode}</p>
          </div>
          <div className="mb-4">
            <p className="font-semibold">Khách hàng:</p>
            <p>
              {order.user?.name || "Người dùng đã xóa"} ({order.user?.email})
            </p>
          </div>
          <div className="mb-4">
            <p className="font-semibold">Địa chỉ giao hàng:</p>
            <p>{order.shippingAddress.fullName}</p>
            <p>
              {order.shippingAddress.address}, {order.shippingAddress.city}
            </p>
            <p>SĐT: {order.shippingAddress.phone}</p>
          </div>
          <div className="mb-4">
            <p className="font-semibold">Phương thức thanh toán:</p>
            <p>{order.paymentMethod}</p>
          </div>
          <div className="mb-4">
            <p className="font-semibold">Tổng tiền:</p>
            <p className="text-lg font-bold text-green-600">
              {order.totalPrice.toLocaleString("vi-VN")} VNĐ
            </p>
          </div>

          <h2 className="text-2xl font-semibold mb-4 mt-6">Các sản phẩm</h2>
          {order.orderItems.length === 0 ? (
            <p>Không có sản phẩm nào trong đơn hàng này.</p>
          ) : (
            <div className="space-y-4">
              {order.orderItems.map((item) => (
                <div
                  key={item.product._id || item._id}
                  className="flex items-center space-x-4 border-b pb-4"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p>
                      {item.qty} x {item.price.toLocaleString("vi-VN")} VNĐ ={" "}
                      {(item.qty * item.price).toLocaleString("vi-VN")} VNĐ
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cột 2: Trạng thái & Hành động */}
        <div className="md:col-span-1 bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Trạng thái</h2>
          <div className="mb-4">
            <p className="font-semibold">Tình trạng:</p>
            <p
              className={`capitalize px-3 py-1 inline-flex text-base leading-5 font-semibold rounded-full 
              ${order.status === "pending" && "bg-yellow-100 text-yellow-800"}
              ${order.status === "paid" && "bg-blue-100 text-blue-800"}
              ${order.status === "shipped" && "bg-purple-100 text-purple-800"}
              ${order.status === "delivered" && "bg-green-100 text-green-800"}
              ${order.status === "cancelled" && "bg-red-100 text-red-800"}
            `}
            >
              {order.status === "pending" && "Chờ xử lý"}
              {order.status === "paid" && "Đã thanh toán"}
              {order.status === "shipped" && "Đang giao hàng"}
              {order.status === "delivered" && "Đã giao hàng"}
              {order.status === "cancelled" && "Đã hủy"}
            </p>
          </div>
          <div className="mb-4">
            <p className="font-semibold">Đã thanh toán:</p>
            <p className={order.isPaid ? "text-green-600" : "text-red-600"}>
              {order.isPaid ? `Có vào ${formatDate(order.paidAt)}` : "Chưa"}
            </p>
          </div>
          <div className="mb-4">
            <p className="font-semibold">Đã giao hàng:</p>
            <p
              className={order.isDelivered ? "text-green-600" : "text-red-600"}
            >
              {order.isDelivered
                ? `Có vào ${formatDate(order.deliveredAt)}`
                : "Chưa"}
            </p>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-4">Hành động</h3>
          <div className="space-y-3">
            {!order.isPaid && (
              <button
                onClick={() => handleUpdateStatus({ isPaid: true })}
                disabled={updating}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
              >
                {updating ? "Đang cập nhật..." : "Xác nhận Đã thanh toán"}
              </button>
            )}
            {!order.isDelivered &&
              (order.isPaid || order.status === "paid") && ( // Chỉ giao khi đã thanh toán hoặc trạng thái là paid
                <button
                  onClick={() => handleUpdateStatus({ isDelivered: true })}
                  disabled={updating}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                >
                  {updating ? "Đang cập nhật..." : "Đánh dấu Đã giao hàng"}
                </button>
              )}
            {/* Nút Hủy đơn hàng (tùy chọn) */}
            {order.status !== "cancelled" && order.status !== "delivered" && (
              <button
                onClick={() => handleUpdateStatus({ status: "cancelled" })}
                disabled={updating}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
              >
                {updating ? "Đang hủy..." : "Hủy đơn hàng"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailPage;
