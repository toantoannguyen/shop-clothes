import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axiosConfig"; // API helper của chúng ta

const BACKEND_URL = "https://shop-clothes-backend.onrender.com";

function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // === 1. THÊM STATE MỚI CHO PHÂN TRANG ===
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  // === 2. TẠO HÀM FETCH ĐỂ GỌI LẠI ===
  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Gửi 'page' lên API
      const response = await api.get(`/products?page=${currentPage}`);

      // Lấy dữ liệu từ cấu trúc mới
      setProducts(response.data.products);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      setError("Không thể tải sản phẩm. " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // === 3. SỬA LẠI useEffect ===
  useEffect(() => {
    fetchProducts();
  }, [currentPage]); // Chạy lại hàm này mỗi khi 'currentPage' thay đổi

  // === 4. SỬA LẠI HÀM XÓA ===
  const handleDelete = async (productId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      try {
        await api.delete(`/products/${productId}`);

        // Sau khi xóa, tải lại dữ liệu của trang hiện tại
        // Xử lý trường hợp xóa item cuối cùng của trang
        if (products.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1); // Tự động lùi về trang trước
        } else {
          fetchProducts(); // Tải lại trang hiện tại
        }
      } catch (err) {
        alert("Lỗi! Không thể xóa sản phẩm. " + err.response?.data?.message);
      }
    }
  };

  // === 5. HÀM MỚI ĐỂ CHUYỂN TRANG ===
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Quản lý Sản phẩm</h1>
        <Link
          to="/products/create"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          + Thêm mới
        </Link>
      </div>

      {/* Bảng hiển thị sản phẩm (Không thay đổi) */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left ...">Hình ảnh</th>
              <th className="px-6 py-3 text-left ...">Tên sản phẩm</th>
              <th className="px-6 py-3 text-left ...">Giá</th>
              <th className="px-6 py-3 text-left ...">Danh mục</th>
              <th className="px-6 py-3 text-left ...">Số lượng (Kho)</th>
              <th className="px-6 py-3 text-right ...">Hành động</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <img
                    src={`${BACKEND_URL}/${product.image}`}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                  {product.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {product.price.toLocaleString("vi-VN")} VNĐ
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {product.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                  {product.countInStock}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link
                    to={`/products/edit/${product._id}`}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Sửa
                  </Link>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* === 6. THÊM BỘ NÚT PHÂN TRANG === */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

// === 7. COMPONENT PHÂN TRANG (ĐẶT Ở CUỐI FILE) ===
function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null; // Ẩn nếu chỉ có 1 trang

  // Tạo mảng các số trang, ví dụ [1, 2, 3]
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="mt-6 flex justify-center items-center space-x-2">
      {/* Nút Lùi */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
      >
        Trước
      </button>

      {/* Các nút số trang */}
      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`px-4 py-2 border rounded-md text-sm font-medium ${
            currentPage === number
              ? "bg-blue-500 border-blue-500 text-white" // Trang hiện tại
              : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50" // Trang khác
          }`}
        >
          {number}
        </button>
      ))}

      {/* Nút Tới */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
      >
        Sau
      </button>
    </div>
  );
}

export default ProductListPage;
