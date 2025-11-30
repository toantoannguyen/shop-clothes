import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, CreditCard, Truck, CheckCircle } from "lucide-react";
import Header from "../components/header";
import Footer from "../components/footer";

function Checkout() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    district: "",
    note: "",
  });

  const [token, setToken] = useState(null);

  useEffect(() => {
    // Lấy giỏ hàng
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }

    // Lấy token của client
    const userToken = localStorage.getItem("token");
    if (!userToken) {
      alert("Bạn cần đăng nhập để thanh toán!");
      navigate("/login");
      return;
    }
    setToken(userToken);
  }, [navigate]);

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.phone || !formData.address) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    if (cartItems.length === 0) {
      alert("Giỏ hàng của bạn đang trống!");
      return;
    }

    setIsProcessing(true);

    // Chuẩn bị dữ liệu
    const shippingAddress = {
      fullName: formData.fullName,
      address: `${formData.address}, ${formData.district}, ${formData.city}`,
      city: formData.city || "Không rõ",
      phone: formData.phone,
    };

    const orderItems = cartItems.map((item) => ({
      name: item.name,
      qty: item.quantity,
      image: item.image,
      price: item.price,
      product: item.id,
    }));

    const orderData = {
      orderItems,
      shippingAddress,
      totalPrice,
    };

    try {
      if (paymentMethod === "cod") {
        console.log("Đang tạo đơn hàng COD...");
        const response = await fetch("/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...orderData,
            paymentMethod: "cod",
          }),
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.message || "Không thể tạo đơn hàng COD");
        }

        console.log("✅ Đơn hàng COD đã được tạo");
        setOrderSuccess(true);
        localStorage.removeItem("cart");
      } else if (paymentMethod === "bank") {
        console.log("Đang tạo đơn hàng BANK (QR)...");
        const response = await fetch("/api/payment/bank", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...orderData,
            paymentMethod: "bank",
          }),
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.message || "Lỗi server khi tạo QR");
        }

        const data = await response.json();
        console.log("✅ Received data:", data);

        if (data && data.qrImage) {
          localStorage.setItem("qrData", data.qrImage);
          localStorage.setItem("totalPrice", totalPrice);
          localStorage.setItem("orderCode", data.orderCode);

          navigate("/payment");
          localStorage.removeItem("cart");
        } else {
          alert("Không thể tạo mã QR thanh toán.");
        }
      }
    } catch (error) {
      console.error("Lỗi thanh toán:", error);
      alert(`Lỗi khi xử lý đơn hàng: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow container mx-auto px-6 py-20 mt-16">
          <div className="max-w-md mx-auto text-center bg-white rounded-lg shadow-lg p-8">
            <CheckCircle size={80} className="mx-auto text-green-500 mb-4" />
            <h2 className="text-2xl font-bold mb-4">Đặt hàng thành công!</h2>
            <p className="text-gray-600 mb-6">
              Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ liên hệ với bạn sớm nhất.
            </p>
            <div className="space-y-3">
              <Link
                to="/products"
                className="block w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
              >
                Tiếp tục mua sắm
              </Link>
              <Link
                to="/"
                className="block w-full bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300"
              >
                Về trang chủ
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex-grow container mx-auto px-6 py-20 mt-16">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <CreditCard size={32} />
          Thanh toán
        </h1>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Thông tin giao hàng */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Truck size={24} />
                Thông tin giao hàng
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nguyễn Văn A"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0901234567"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="example@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Địa chỉ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Số nhà, tên đường"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Thành phố
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Hà Nội"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Quận/Huyện
                    </label>
                    <input
                      type="text"
                      name="district"
                      value={formData.district}
                      onChange={handleInputChange}
                      className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Cầu Giấy"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Ghi chú
                  </label>
                  <textarea
                    name="note"
                    value={formData.note}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ghi chú thêm về đơn hàng..."
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Phương thức thanh toán */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <CreditCard size={24} />
                Phương thức thanh toán
              </h2>
              <div className="space-y-3">
                <label className="flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mt-1"
                  />
                  <div className="flex-grow">
                    <div className="flex items-center gap-2">
                      <Truck size={20} className="text-green-600" />
                      <span className="font-semibold">
                        Thanh toán khi nhận hàng (COD)
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Thanh toán bằng tiền mặt khi nhận hàng
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="bank"
                    checked={paymentMethod === "bank"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mt-1"
                  />
                  <div className="flex-grow">
                    <div className="flex items-center gap-2">
                      <CreditCard size={20} className="text-blue-600" />
                      <span className="font-semibold">
                        Thanh toán qua thẻ ngân hàng
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Hỗ trợ thẻ ATM, Visa, MasterCard, v.v.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Tóm tắt đơn hàng */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Đơn hàng của bạn</h2>

              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3 pb-3 border-b">
                    <img
                      src={`/${item.image}`}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-grow">
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        SL: {item.quantity}
                      </p>
                      <p className="text-sm text-red-500 font-semibold">
                        {(item.price * item.quantity).toLocaleString("vi-VN")}₫
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-4 pt-3 border-t">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tạm tính:</span>
                  <span className="font-semibold">
                    {totalPrice.toLocaleString("vi-VN")}₫
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phí vận chuyển:</span>
                  <span className="font-semibold text-green-600">Miễn phí</span>
                </div>
                <hr />
                <div className="flex justify-between text-lg">
                  <span className="font-bold">Tổng cộng:</span>
                  <span className="font-bold text-red-500">
                    {totalPrice.toLocaleString("vi-VN")}₫
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold mb-3 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isProcessing ? "Đang xử lý..." : "Đặt hàng"}
              </button>

              <Link
                to="/cart"
                className="block text-center text-blue-600 hover:underline text-sm"
              >
                ← Quay lại giỏ hàng
              </Link>
            </div>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default Checkout;
