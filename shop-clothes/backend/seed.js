import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import Product from "./models/Product.js";

dotenv.config();
connectDB();

const seedProducts = [
  {
    name: "cái nịt",
    price: 2000,
    description: "cái nịt đẹp",
    image: "img/cainit.jpg",
  },
  {
    name: "Áo thun nam cổ tròn",
    price: 199000,
    description: "Áo thun cotton thoáng mát, phù hợp đi chơi hoặc tập thể dục",
    image: "img/aothun3.png",
  },
  {
    name: "Áo thun nam cổ tròn",
    price: 199000,
    description: "Áo thun cotton thoáng mát, phù hợp đi chơi hoặc tập thể dục",
    image: "img/aothun3.png",
  },
  {
    name: "Áo thun nam cổ tròn",
    price: 199000,
    description: "Áo thun cotton thoáng mát, phù hợp đi chơi hoặc tập thể dục",
    image: "img/aothun3.png",
  },
  {
    name: "Áo thun nam cổ tròn",
    price: 199000,
    description: "Áo thun cotton thoáng mát, phù hợp đi chơi hoặc tập thể dục",
    image: "img/aothun3.png",
  },
  {
    name: "Áo thun nam cổ tròn",
    price: 199000,
    description: "Áo thun cotton thoáng mát, phù hợp đi chơi hoặc tập thể dục",
    image: "img/aothun3.png",
  },
  {
    name: "Áo thun nam cổ tròn",
    price: 199000,
    description: "Áo thun cotton thoáng mát, phù hợp đi chơi hoặc tập thể dục",
    image: "img/aothun3.png",
  },
  {
    name: "Áo thun nam cổ tròn",
    price: 199000,
    description: "Áo thun cotton thoáng mát, phù hợp đi chơi hoặc tập thể dục",
    image: "img/aothun3.png",
  },
  {
    name: "Áo thun nam cổ tròn",
    price: 199000,
    description: "Áo thun cotton thoáng mát, phù hợp đi chơi hoặc tập thể dục",
    image: "img/aothun3.png",
  },
  {
    name: "Áo thun nam cổ tròn",
    price: 199000,
    description: "Áo thun cotton thoáng mát, phù hợp đi chơi hoặc tập thể dục",
    image: "img/aothun3.png",
  },

  {
    name: "Áo thun nam cổ tròn",
    price: 199000,
    description: "Áo thun cotton thoáng mát, phù hợp đi chơi hoặc tập thể dục",
    image: "img/aothun3.png",
  },
  {
    name: "Áo thun nam cổ tròn",
    price: 199000,
    description: "Áo thun cotton thoáng mát, phù hợp đi chơi hoặc tập thể dục",
    image: "img/aothun3.png",
  },
  {
    name: "Áo thun nam cổ tròn",
    price: 199000,
    description: "Áo thun cotton thoáng mát, phù hợp đi chơi hoặc tập thể dục",
    image: "img/aothun3.png",
  },
  {
    name: "Áo thun nam cổ tròn",
    price: 199000,
    description: "Áo thun cotton thoáng mát, phù hợp đi chơi hoặc tập thể dục",
    image: "img/aothun3.png",
  },
  {
    name: "Áo thun nam cổ tròn",
    price: 199000,
    description: "Áo thun cotton thoáng mát, phù hợp đi chơi hoặc tập thể dục",
    image: "img/aothun3.png",
  },
  {
    name: "Áo thun nam cổ tròn",
    price: 199000,
    description: "Áo thun cotton thoáng mát, phù hợp đi chơi hoặc tập thể dục",
    image: "img/aothun3.png",
  },
  {
    name: "Áo thun nam cổ tròn",
    price: 199000,
    description: "Áo thun cotton thoáng mát, phù hợp đi chơi hoặc tập thể dục",
    image: "img/aothun3.png",
  },

  {
    name: "Áo thun nam cổ tròn",
    price: 199000,
    description: "Áo thun cotton thoáng mát, phù hợp đi chơi hoặc tập thể dục",
    image: "img/aothun3.png",
  },
  {
    name: "Áo thun nam cổ tròn",
    price: 199000,
    description: "Áo thun cotton thoáng mát, phù hợp đi chơi hoặc tập thể dục",
    image: "img/aothun3.png",
  },
  {
    name: "Áo thun nam cổ tròn",
    price: 199000,
    description: "Áo thun cotton thoáng mát, phù hợp đi chơi hoặc tập thể dục",
    image: "img/aothun3.png",
  },
  {
    name: "Áo thun nam cổ tròn",
    price: 199000,
    description: "Áo thun cotton thoáng mát, phù hợp đi chơi hoặc tập thể dục",
    image: "img/aothun3.png",
  },

  {
    name: "Áo thun nam cổ tròn",
    price: 199000,
    description: "Áo thun cotton thoáng mát, phù hợp đi chơi hoặc tập thể dục",
    image: "img/aothun3.png",
  },
  {
    name: "Áo thun nam cổ tròn",
    price: 199000,
    description: "Áo thun cotton thoáng mát, phù hợp đi chơi hoặc tập thể dục",
    image: "img/aothun3.png",
  },
  {
    name: "Áo thun nam cổ tròn",
    price: 199000,
    description: "Áo thun cotton thoáng mát, phù hợp đi chơi hoặc tập thể dục",
    image: "img/aothun3.png",
  },
  {
    name: "Áo thun nam cổ tròn",
    price: 199000,
    description: "Áo thun cotton thoáng mát, phù hợp đi chơi hoặc tập thể dục",
    image: "img/aothun3.png",
  },
  {
    name: "Áo thun nam cổ tròn",
    price: 199000,
    description: "Áo thun cotton thoáng mát, phù hợp đi chơi hoặc tập thể dục",
    image: "img/aothun3.png",
  },
  {
    name: "Áo thun nam cổ tròn",
    price: 199000,
    description: "Áo thun cotton thoáng mát, phù hợp đi chơi hoặc tập thể dục",
    image: "img/aothun3.png",
  },
  {
    name: "Áo thun nam cổ tròn",
    price: 199000,
    description: "Áo thun cotton thoáng mát, phù hợp đi chơi hoặc tập thể dục",
    image: "img/aothun3.png",
  },
  {
    name: "Áo thun nam cổ tròn",
    price: 199000,
    description: "Áo thun cotton thoáng mát, phù hợp đi chơi hoặc tập thể dục",
    image: "img/aothun3.png",
  },
  {
    name: "Áo thun nam cổ tròn",
    price: 199000,
    description: "Áo thun cotton thoáng mát, phù hợp đi chơi hoặc tập thể dục",
    image: "img/aothun3.png",
  },
  {
    name: "Áo thun nam cổ tròn",
    price: 199000,
    description: "Áo thun cotton thoáng mát, phù hợp đi chơi hoặc tập thể dục",
    image: "img/aothun3.png",
  },
  {
    name: "Áo thun nam cổ tròn",
    price: 199000,
    description: "Áo thun cotton thoáng mát, phù hợp đi chơi hoặc tập thể dục",
    image: "img/aothun3.png",
  },
  {
    name: "Áo thun nam cổ tròn",
    price: 199000,
    description: "Áo thun cotton thoáng mát, phù hợp đi chơi hoặc tập thể dục",
    image: "img/aothun3.png",
  },
  {
    name: "Áo thun nam cổ tròn",
    price: 199000,
    description: "Áo thun cotton thoáng mát, phù hợp đi chơi hoặc tập thể dục",
    image: "img/aothun3.png",
  },
  {
    name: "Áo thun nam cổ tròn",
    price: 199000,
    description: "Áo thun cotton thoáng mát, phù hợp đi chơi hoặc tập thể dục",
    image: "img/aothun3.png",
  },
  {
    name: "Áo thun nam cổ tròn",
    price: 199000,
    description: "Áo thun cotton thoáng mát, phù hợp đi chơi hoặc tập thể dục",
    image: "img/aothun3.png",
  },
  {
    name: "Áo thun nam cổ tròn",
    price: 199000,
    description: "Áo thun cotton thoáng mát, phù hợp đi chơi hoặc tập thể dục",
    image: "img/aothun3.png",
  },
  {
    name: "Áo thun nam cổ tròn",
    price: 199000,
    description: "Áo thun cotton thoáng mát, phù hợp đi chơi hoặc tập thể dục",
    image: "img/aothun3.png",
  },
  {
    name: "Áo thun nam cổ tròn",
    price: 199000,
    description: "Áo thun cotton thoáng mát, phù hợp đi chơi hoặc tập thể dục",
    image: "img/aothun3.png",
  },
  {
    name: "Áo thun nam cổ tròn",
    price: 199000,
    description: "Áo thun cotton thoáng mát, phù hợp đi chơi hoặc tập thể dục",
    image: "img/aothun3.png",
  },
  {
    name: "Áo thun nam cổ tròn",
    price: 199000,
    description: "Áo thun cotton thoáng mát, phù hợp đi chơi hoặc tập thể dục",
    image: "img/aothun3.png",
  },
  {
    name: "Áo thun nam cổ tròn",
    price: 199000,
    description: "Áo thun cotton thoáng mát, phù hợp đi chơi hoặc tập thể dục",
    image: "img/aothun3.png",
  },
  {
    name: "Áo thun nam cổ tròn",
    price: 199000,
    description: "Áo thun cotton thoáng mát, phù hợp đi chơi hoặc tập thể dục",
    image: "img/aothun3.png",
  },
  {
    name: "Áo thun nam cổ tròn",
    price: 199000,
    description: "Áo thun cotton thoáng mát, phù hợp đi chơi hoặc tập thể dục",
    image: "img/aothun3.png",
  },
  {
    name: "Áo thun nam cổ tròn",
    price: 199000,
    description: "Áo thun cotton thoáng mát, phù hợp đi chơi hoặc tập thể dục",
    image: "img/aothun3.png",
  },
  {
    name: "Áo thun nam cổ tròn",
    price: 199000,
    description: "Áo thun cotton thoáng mát, phù hợp đi chơi hoặc tập thể dục",
    image: "img/aothun3.png",
  },
  {
    name: "Áo thun nam cổ tròn",
    price: 199000,
    description: "Áo thun cotton thoáng mát, phù hợp đi chơi hoặc tập thể dục",
    image: "img/aothun3.png",
  },
  {
    name: "Áo thun nam cổ tròn",
    price: 199000,
    description: "Áo thun cotton thoáng mát, phù hợp đi chơi hoặc tập thể dục",
    image: "img/aothun3.png",
  },
  {
    name: "Áo thun nam cổ tròn",
    price: 199000,
    description: "Áo thun cotton thoáng mát, phù hợp đi chơi hoặc tập thể dục",
    image: "img/aothun3.png",
  },
  {
    name: "Áo thun nam cổ tròn",
    price: 199000,
    description: "Áo thun cotton thoáng mát, phù hợp đi chơi hoặc tập thể dục",
    image: "img/aothun3.png",
  },
  {
    name: "Áo thun nam cổ tròn",
    price: 199000,
    description: "Áo thun cotton thoáng mát, phù hợp đi chơi hoặc tập thể dục",
    image: "img/aothun3.png",
  },
  {
    name: "Quần jeans nữ",
    price: 399000,
    description: "Quần jeans co giãn, form chuẩn, dễ phối đồ",
    image: "img/aothun4.png",
  },
  {
    name: "Áo khoác gió unisex",
    price: 299000,
    description: "Áo khoác nhẹ, chống thấm nước, phù hợp cả nam và nữ",
    image: "img/aothun5.png",
  },
  {
    name: "Áo khoác gió unisex",
    price: 299000,
    description: "Áo khoác nhẹ, chống thấm nước, phù hợp cả nam và nữ",
    image: "img/aothun6.png",
  },
  {
    name: "Áo khoác gió unisex",
    price: 299000,
    description: "Áo khoác nhẹ, chống thấm nước, phù hợp cả nam và nữ",
    image: "img/aothun7.png",
  },
];

const importData = async () => {
  try {
    await Product.deleteMany(); // Xóa dữ liệu cũ
    await Product.insertMany(seedProducts);
    console.log("✅ Dữ liệu mẫu đã được thêm vào database!");
    process.exit();
  } catch (error) {
    console.error("❌ Lỗi khi thêm dữ liệu:", error);
    process.exit(1);
  }
};

importData();
