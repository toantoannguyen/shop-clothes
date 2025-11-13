import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axiosConfig";

function ProductEditPage() {
  const { id } = useParams(); // Lấy {id} từ URL
  const [countInStock, setCountInStock] = useState(0);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(""); // State này vẫn lưu đường dẫn
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // State cho việc submit form
  const [loadingData, setLoadingData] = useState(true); // State cho việc tải dữ liệu ban đầu

  // State mới cho việc upload
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const navigate = useNavigate();

  // BƯỚC 1: TẢI DỮ LIỆU CŨ CỦA SẢN PHẨM
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoadingData(true);
        const response = await api.get(`/products/${id}`);
        const product = response.data;

        setName(product.name);
        setPrice(product.price);
        setImage(product.image);
        setCategory(product.category || ""); // Đảm bảo không phải null
        setDescription(product.description || ""); // Đảm bảo không phải null
        setCountInStock(product.countInStock || 0);
      } catch (err) {
        setError("Không thể tải dữ liệu sản phẩm.");
      } finally {
        setLoadingData(false);
      }
    };

    fetchProduct();
  }, [id]);

  // === HÀM MỚI ĐỂ XỬ LÝ UPLOAD FILE ===
  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setUploading(true);
    setUploadError(null);

    try {
      const response = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setImage(response.data.image); // Cập nhật state 'image' với đường dẫn mới
      setUploading(false);
    } catch (err) {
      setUploadError(err.response?.data?.message || "Upload thất bại");
      setUploading(false);
    }
  };

  // BƯỚC 2: GỬI DỮ LIỆU CẬP NHẬT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const productData = {
      name,
      price: Number(price),
      image,
      category,
      description,
      countInStock: Number(countInStock),
    };

    try {
      await api.put(`/products/${id}`, productData);
      navigate("/products");
    } catch (err) {
      setError(err.response?.data?.message || "Không thể cập nhật sản phẩm.");
      setLoading(false);
    }
  };

  if (loadingData) {
    return <p>Đang tải dữ liệu sản phẩm...</p>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Chỉnh sửa Sản phẩm</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* === CODE ĐÃ ĐƯỢC THÊM LẠI === */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tên sản phẩm
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Giá</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Số lượng trong kho
          </label>
          <input
            type="number"
            value={countInStock}
            onChange={(e) => setCountInStock(e.target.value)}
            required
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        {/* =============================== */}

        {/* === TRƯỜNG HÌNH ẢNH === */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Hình ảnh
          </label>
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            required
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
            placeholder="Tải file lên hoặc dán URL"
          />
          <input
            type="file"
            onChange={uploadFileHandler}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mt-2"
          />
          {uploading && (
            <p className="text-sm text-gray-500 mt-1">Đang tải lên...</p>
          )}
          {uploadError && (
            <p className="text-sm text-red-500 mt-1">{uploadError}</p>
          )}
        </div>
        {/* ======================= */}

        {/* === CODE ĐÃ ĐƯỢC THÊM LẠI === */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Danh mục
          </label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Mô tả
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
          ></textarea>
        </div>
        {/* =============================== */}

        {error && <p className="text-red-500">{error}</p>}

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate("/products")}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={loading || uploading}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
          >
            {loading ? "Đang cập nhật..." : "Cập nhật"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProductEditPage;
