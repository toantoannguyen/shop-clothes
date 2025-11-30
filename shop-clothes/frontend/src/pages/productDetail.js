import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import Header from "../components/header";
import Footer from "../components/footer";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    fetch(`/api/products/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Server trả lỗi ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("✅ Nhận dữ liệu sản phẩm:", data);
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Lỗi tải chi tiết:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  // Kiểm tra đăng nhập
  const checkAuth = () => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (!token || !user) {
      return false;
    }

    try {
      const userData = JSON.parse(user);
      return !!userData;
    } catch (error) {
      console.error("❌ Lỗi kiểm tra user:", error);
      return false;
    }
  };

  // Thêm vào giỏ hàng
  const addToCart = () => {
    // Kiểm tra đăng nhập
    if (!checkAuth()) {
      alert("⚠️ Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
      navigate("/login", { state: { from: `/product/${id}` } });
      return;
    }

    if (!product) {
      alert("❌ Sản phẩm chưa tải xong!");
      return;
    }

    const productId = product._id || product.id;

    if (!productId) {
      console.error("❌ Không tìm thấy ID sản phẩm:", product);
      alert("❌ Lỗi: Sản phẩm không có ID!");
      return;
    }

    // Đọc giỏ hàng hiện tại
    let cart = [];
    try {
      const cartData = localStorage.getItem("cart");
      cart = cartData ? JSON.parse(cartData) : [];
    } catch (error) {
      console.error("❌ Lỗi đọc localStorage:", error);
      cart = [];
    }

    console.log("🛒 Giỏ hàng hiện tại:", cart);

    // Kiểm tra sản phẩm đã tồn tại chưa
    const existingItem = cart.find((item) => item.id === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
      console.log("✅ Tăng số lượng sản phẩm đã có");
    } else {
      const newItem = {
        id: productId,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantity,
      };
      console.log("➕ Thêm sản phẩm mới:", newItem);
      cart.push(newItem);
    }

    // Lưu vào localStorage
    try {
      const cartString = JSON.stringify(cart);
      localStorage.setItem("cart", cartString);

      const savedCart = localStorage.getItem("cart");
      console.log("✅ Dữ liệu đã lưu:", savedCart);

      if (savedCart) {
        alert("✅ Đã thêm vào giỏ hàng!");
        navigate("/cart");
      } else {
        throw new Error("localStorage không lưu được");
      }
    } catch (error) {
      console.error("❌ Lỗi lưu localStorage:", error);
      alert(
        "❌ Không thể lưu giỏ hàng. Vui lòng kiểm tra cài đặt trình duyệt!"
      );
    }
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="container mx-auto px-6 py-40 mt-16 text-center">
          <p className="text-xl text-gray-600">Đang tải sản phẩm...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Header />
        <div className="container mx-auto px-6 py-40 mt-16 text-center">
          <p className="text-xl text-red-600 mb-4">❌ Lỗi: {error}</p>
          <button
            onClick={() => navigate("/products")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Quay lại danh sách sản phẩm
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div>
        <Header />
        <div className="container mx-auto px-6 py-40 mt-16 text-center">
          <p className="text-xl text-gray-600">Không tìm thấy sản phẩm</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="container mx-auto px-6 py-20 mt-16">
        {/* Back button */}
        <button
          onClick={() => navigate("/products")}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-medium"
        >
          <ArrowLeft size={20} />
          Quay lại danh sách sản phẩm
        </button>

        <div className="grid md:grid-cols-2 gap-10 bg-white rounded-2xl shadow-lg p-8">
          {/* Hình ảnh sản phẩm */}
          <div className="flex items-center justify-center">
            <img
              src={`/${product.image}`}
              alt={product.name}
              className="w-full h-[500px] object-contain rounded-xl bg-gray-50"
            />
          </div>

          {/* Thông tin sản phẩm */}
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-3 text-gray-800">
              {product.name}
            </h2>

            {product.category && (
              <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full mb-4 w-fit">
                {product.category.charAt(0).toUpperCase() +
                  product.category.slice(1)}
              </span>
            )}

            <p className="text-gray-600 mb-6 leading-relaxed">
              {product.description ||
                "Sản phẩm chất lượng cao, đảm bảo uy tín."}
            </p>

            <p className="text-3xl font-bold text-red-500 mb-6">
              {product.price.toLocaleString("vi-VN")}₫
            </p>

            {/* Chọn số lượng */}
            <div className="flex items-center gap-4 mb-8 pb-6 border-b">
              <span className="font-semibold text-gray-700">Số lượng:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg font-semibold transition"
                >
                  -
                </button>
                <span className="w-16 text-center font-semibold text-lg">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg font-semibold transition"
                >
                  +
                </button>
              </div>
            </div>

            {/* Nút thêm vào giỏ */}
            <button
              onClick={addToCart}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 font-semibold text-lg transition-all hover:scale-105"
            >
              <ShoppingCart size={24} />
              Thêm vào giỏ hàng
            </button>

            {/* Thông tin bổ sung */}
            <div className="mt-6 pt-6 border-t space-y-2">
              <p className="text-sm text-gray-600">
                ✓ Miễn phí vận chuyển cho đơn hàng trên 500.000₫
              </p>
              <p className="text-sm text-gray-600">
                ✓ Đổi trả trong vòng 7 ngày
              </p>
              <p className="text-sm text-gray-600">✓ Bảo hành chính hãng</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ProductDetail;
