import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

// Lấy __dirname trong ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cấu hình nơi lưu trữ file (lưu vào thư mục 'backend/img')
const storage = multer.diskStorage({
  destination(req, file, cb) {
    // Chúng ta sẽ lưu vào thư mục 'img' (đã có sẵn)
    // path.resolve đi lùi 1 cấp ('..') từ 'routes'
    cb(null, path.join(__dirname, "../img/"));
  },
  filename(req, file, cb) {
    // Tạo tên file mới (để không bị trùng)
    // Ví dụ: tenfile-1678886400000.jpg
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// Hàm kiểm tra file (chỉ chấp nhận ảnh)
function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb("Chỉ chấp nhận file hình ảnh (jpg, jpeg, png)!");
  }
}

// Khởi tạo middleware upload
const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// Định nghĩa API route: POST /api/upload
// upload.single('image') nghĩa là "nhận 1 file duy nhất từ field tên là 'image'"
router.post("/", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: "Vui lòng chọn 1 file" });
  }

  // Nếu upload thành công, req.file sẽ chứa thông tin file
  // Chúng ta sẽ trả về đường dẫn TƯƠNG ĐỐI để lưu vào database
  // quan trọng: Dùng / thay vì \ (cho chuẩn web)
  // Chúng ta sẽ trả về đường dẫn TƯƠNG ĐỐI để lưu vào database
  // quan trọng: Dùng / thay vì \ (cho chuẩn web)
  const imagePath = `img/${req.file.filename}`; // <-- XÓA DẤU / Ở ĐẦU

  res.status(201).send({
    message: "Tải ảnh lên thành công",
    image: imagePath, // Trả về đường dẫn /img/ten-file-moi.jpg
  });
});

export default router;
