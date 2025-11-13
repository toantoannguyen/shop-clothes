import express from "express";
import Product from "../models/Product.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";
console.log("!!!!!!!!!! FILE ROUTES ĐÃ ĐƯỢC ĐỌC LẠI !!!!!!!!!");
const router = express.Router();

// --- PUBLIC ROUTES (Ai cũng xem được) ---

// GET /api/products
// Chỉ lấy sản phẩm CHƯA BỊ XÓA
router.get("/", async (req, res) => {
  try {
    const page = Number(req.query.page) || 1; // Lấy số trang, mặc định là 1
    const limit = 8; // Đặt giới hạn 8 sản phẩm/trang (bạn có thể thay đổi số này)
    const skip = (page - 1) * limit; // Tính số sản phẩm cần bỏ qua

    // 1. Lấy tổng số sản phẩm (để tính tổng số trang)
    const totalProducts = await Product.countDocuments({
      isDeleted: { $ne: true },
    });

    // 2. Lấy sản phẩm cho trang hiện tại
    const products = await Product.find({ isDeleted: { $ne: true } })
      .sort({ createdAt: -1 }) // Luôn sắp xếp (ví dụ: mới nhất trước)
      .limit(limit) // Giới hạn số lượng
      .skip(skip); // Bỏ qua các trang trước

    res.json({
      products, // Danh sách sản phẩm của trang này
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit), // Tổng số trang
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// === ROUTE MỚI: LẤY THÙNG RÁC ===
// (Phải đặt TRƯỚC route /:id)
// GET /api/products/trash
router.get("/trash", protect, isAdmin, async (req, res) => {
  try {
    // Chỉ lấy các sản phẩm ĐÃ BỊ XÓA
    const deletedProducts = await Product.find({ isDeleted: true });
    res.json(deletedProducts);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});
// === THÊM ROUTE MỚI NÀY VÀO CHO CLIENT ===
// GET /api/products/public
// (Lấy TẤT CẢ sản phẩm cho trang client, không phân trang)
router.get("/public", async (req, res) => {
  try {
    // Chỉ lấy các sản phẩm chưa bị xóa
    const products = await Product.find({ isDeleted: { $ne: true } });
    res.json(products); // Trả về một MẢNG đơn giản
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// GET /api/products/:id
// Lấy chi tiết 1 sản phẩm (cả xóa và chưa xóa)
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

// --- ADMIN ROUTES ---

// POST /api/products
// (Tạo sản phẩm)
router.post("/", protect, isAdmin, async (req, res) => {
  // ... (code tạo sản phẩm của bạn, không đổi)
  try {
    const { name, price, image, category, description, countInStock } =
      req.body;
    if (!name || !price || !image) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập đủ tên, giá và hình ảnh" });
    }
    const newProduct = new Product({
      name,
      price,
      image,
      category,
      description,
      countInStock,
    });
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

// PUT /api/products/:id
// (Cập nhật sản phẩm)
router.put("/:id", protect, isAdmin, async (req, res) => {
  // ... (code cập nhật sản phẩm của bạn, không đổi)
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }
    product.name = req.body.name || product.name;
    product.price = req.body.price || product.price;
    product.image = req.body.image || product.image;
    product.category = req.body.category || product.category;
    product.description = req.body.description || product.description;
    product.countInStock = req.body.countInStock;
    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

// === ROUTE MỚI: KHÔI PHỤC SẢN PHẨM ===
// PUT /api/products/:id/restore
router.put("/:id/restore", protect, isAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }
    product.isDeleted = false; // Đặt lại cờ
    await product.save();
    res.json({ message: "Sản phẩm đã được khôi phục" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

// DELETE /api/products/:id
// (Xóa ảo - Soft Delete)
router.delete("/:id", protect, isAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }
    product.isDeleted = true; // Đánh dấu là đã xóa
    await product.save();
    res.json({ message: "Sản phẩm đã được xóa ảo" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

// === ROUTE MỚI: XÓA VĨNH VIỄN ===
// DELETE /api/products/:id/permanent
router.delete("/:id/permanent", protect, isAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }
    await product.deleteOne(); // Xóa hẳn
    res.json({ message: "Sản phẩm đã được XÓA VĨNH VIỄN" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

export default router;
