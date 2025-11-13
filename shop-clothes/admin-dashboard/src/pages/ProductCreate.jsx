import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";

function ProductCreatePage() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  // State lưu các danh mục đã có
  const [existingCategories, setExistingCategories] = useState([]);

  const navigate = useNavigate();

  // Tải các danh mục đã có để làm gợi ý
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Sử dụng API public để lấy tất cả sản phẩm
        const { data } = await api.get("/products/public");
        // Lọc ra các danh mục duy nhất
        const uniqueCategories = [...new Set(data.map((p) => p.category))];
        setExistingCategories(uniqueCategories);
      } catch (err) {
        console.error("Không thể tải danh mục gợi ý:", err);
      }
    };

    fetchCategories();
  }, []); // Chỉ chạy 1 lần khi trang được tải

  // Hàm xử lý upload file
  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setUploading(true);
    setUploadError(null);

    try {
      const response = await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setImage(response.data.image);
      setUploading(false);
    } catch (err) {
      setUploadError(err.response?.data?.message || "Upload thất bại");
      setUploading(false);
    }
  };

  // Hàm submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      setError("Vui lòng tải lên một hình ảnh hoặc dán URL.");
      return;
    }

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
      await api.post("/products", productData);
      navigate("/products");
    } catch (err) {
      setError(err.response?.data?.message || "Không thể tạo sản phẩm.");
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Thêm Sản phẩm mới</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tên sản phẩm
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Giá</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Hình ảnh
          </label>
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            required
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Danh mục
          </label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Chọn hoặc nhập danh mục mới"
            list="category-list"
          />
          <datalist id="category-list">
            {existingCategories.map((cat) => (
              <option key={cat} value={cat} />
            ))}
          </datalist>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Mô tả
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          ></textarea>
        </div>

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
            {loading ? "Đang lưu..." : "Lưu sản phẩm"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProductCreatePage;
