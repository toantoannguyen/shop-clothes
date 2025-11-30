import React, { useState, useEffect } from "react";
import api from "../api/axiosConfig";

const BACKEND_URL = "https://shop-clothes-backend.onrender.com";

function ProductTrashPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. READ - Lấy danh sách sản phẩm TỪ THÙNG RÁC
  useEffect(() => {
    fetchDeletedProducts();
  }, []);

  const fetchDeletedProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/products/trash");
      setProducts(response.data);
    } catch (err) {
      setError("Không thể tải thùng rác. " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // 2. RESTORE - Khôi phục sản phẩm
  const handleRestore = async (productId) => {
    if (window.confirm("Bạn có chắc chắn muốn khôi phục sản phẩm này?")) {
      try {
        await api.put(`/products/${productId}/restore`);
        // Lọc sản phẩm ra khỏi danh sách thùng rác
        setProducts(products.filter((p) => p._id !== productId));
      } catch (err) {
        alert(
          "Lỗi! Không thể khôi phục. " +
            (err.response?.data?.message || err.message)
        );
      }
    }
  };

  // 3. HARD DELETE - Xóa vĩnh viễn
  const handleDeletePermanent = async (productId) => {
    if (
      window.confirm(
        "CẢNH BÁO: XÓA VĨNH VIỄN? Hành động này không thể hoàn tác!"
      )
    ) {
      try {
        await api.delete(`/products/${productId}/permanent`);
        // Lọc sản phẩm ra khỏi danh sách
        setProducts(products.filter((p) => p._id !== productId));
      } catch (err) {
        alert(
          "Lỗi! Không thể xóa vĩnh viễn. " +
            (err.response?.data?.message || err.message)
        );
      }
    }
  };

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">Thùng rác (Sản phẩm đã xóa)</h1>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hình ảnh
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tên sản phẩm
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.length === 0 ? (
              <tr>
                <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                  Thùng rác trống.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product._id} className="opacity-60">
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
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleRestore(product._id)}
                      className="text-green-600 hover:text-green-900 mr-4"
                    >
                      Khôi phục
                    </button>
                    <button
                      onClick={() => handleDeletePermanent(product._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Xóa vĩnh viễn
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProductTrashPage;
