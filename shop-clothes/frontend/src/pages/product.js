import React, { useEffect, useState } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import { Link, useNavigate } from "react-router-dom";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  // Bộ lọc & phân trang
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("default");
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://shop-clothes-backend.onrender.com/api/products/public")
      .then((res) => res.json())
      .then((data) => {
        console.log("✅ Dữ liệu backend:", data);
        setProducts(data);
        setLoading(false);

        // Lấy danh sách categories duy nhất
        const uniqueCategories = [
          ...new Set(data.map((p) => p.category)),
        ].filter(Boolean); // Loại bỏ null/undefined

        setCategories(uniqueCategories);
      })
      .catch((error) => {
        console.error("❌ Lỗi khi tải sản phẩm:", error);
        setLoading(false);
      });
  }, []);

  // Lọc và sắp xếp sản phẩm
  const filtered = products
    .filter((p) => category === "all" || p.category === category)
    .sort((a, b) => {
      if (sort === "asc") return a.price - b.price;
      if (sort === "desc") return b.price - a.price;
      return 0;
    });

  // Phân trang
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleProductClick = (productId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("⚠️ Bạn cần đăng nhập để xem chi tiết sản phẩm!");
      navigate("/login");
      return;
    }
    navigate(`/product/${productId}`);
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="text-center py-40 text-lg text-gray-600">
          Đang tải sản phẩm...
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />

      <section className="container mx-auto px-6 py-20 mt-16 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* --- CỘT TRÁI: BỘ LỌC --- */}
        <aside className="bg-white rounded-2xl shadow p-6 h-fit">
          <h2 className="text-xl font-bold mb-4 text-gray-700">Bộ lọc</h2>

          {/* Lọc theo danh mục */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Danh mục</h3>
            <select
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
            >
              <option value="all">Tất cả</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Sắp xếp */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Sắp xếp</h3>
            <select
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
            >
              <option value="default">Mặc định</option>
              <option value="asc">Giá tăng dần</option>
              <option value="desc">Giá giảm dần</option>
            </select>
          </div>

          {/* Thông tin tổng sản phẩm */}
          <div className="mt-6 pt-6 border-t">
            <p className="text-sm text-gray-600">
              Tìm thấy <span className="font-bold">{filtered.length}</span> sản
              phẩm
            </p>
          </div>
        </aside>

        {/* --- CỘT PHẢI: DANH SÁCH SẢN PHẨM --- */}
        <div className="md:col-span-3">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center md:text-left">
            🛍️ Danh sách sản phẩm
          </h1>

          {paginated.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-600 mb-4">
                Không có sản phẩm nào.
              </p>
              <button
                onClick={() => {
                  setCategory("all");
                  setSort("default");
                  setPage(1);
                }}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Xóa bộ lọc
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginated.map((p) => (
                <div
                  key={p._id || p.id}
                  onClick={() => handleProductClick(p._id || p.id)}
                  className="bg-white p-5 rounded-2xl shadow hover:scale-105 transition cursor-pointer"
                >
                  <img
                    src={`https://shop-clothes-backend.onrender.com/${p.image}`}
                    alt={p.name}
                    className="w-full h-64 object-contain bg-gray-50 rounded-xl mb-4"
                  />
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    {p.name}
                  </h3>
                  <p className="text-blue-600 font-bold mb-4">
                    {p.price.toLocaleString("vi-VN")}₫
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProductClick(p._id || p.id);
                    }}
                    className="block w-full bg-green-600 text-center text-white px-4 py-2 rounded-full hover:bg-green-700 transition"
                  >
                    Xem chi tiết
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* --- PHÂN TRANG --- */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-10 space-x-4">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className={`px-4 py-2 rounded-lg ${
                  page === 1
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                Trước
              </button>

              <span className="text-gray-700 font-semibold">
                Trang {page} / {totalPages}
              </span>

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className={`px-4 py-2 rounded-lg ${
                  page === totalPages
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                Sau
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Products;
