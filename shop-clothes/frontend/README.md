# Dự án Website Thời trang QNT Shop (Demo WAF với ModSecurity)

## 1. 📖 Giới thiệu

Đây là dự án website thương mại điện tử (thời trang) full-stack được xây dựng bằng React (Frontend) và Node.js/Express (Backend).

Mục tiêu chính của đề tài là sử dụng website này làm nền tảng để demo **Triển khai Tường lửa Ứng dụng Web (WAF) với ModSecurity trên Nginx**, tập trung vào việc ngăn chặn các cuộc tấn công phổ biến như **SQL Injection** và **Cross-Site Scripting (XSS)**.

## 2. 💻 Công nghệ sử dụng

Dự án được xây dựng với các công nghệ hiện đại:

- **Frontend:**
  - **Ngôn ngữ:** JavaScript (ES6+)
  - **Framework:** React.js
  - **Thư viện:** React Router (Điều hướng), Axios/Fetch (Gọi API), Socket.io-client (Chat)
- **Backend:**
  - **Ngôn ngữ:** JavaScript (ES6+)
  - **Runtime:** Node.js
  - **Framework:** Express.js
  - **Xác thực:** JSON Web Tokens (JWT), Passport.js (cho Google OAuth)
  - **Real-time:** Socket.io
- **Database:**
  - **Hệ CSDL:** MongoDB (NoSQL)
  - **Thư viện:** Mongoose (ODM)
- **WAF & Deployment (Cho demo):**
  - **Web Server:** Nginx (Reverse Proxy)
  - **Tường lửa:** ModSecurity (WAF)
  - **Hệ điều hành:** Ubuntu (chạy trên máy ảo)
- **Công cụ kiểm thử:**
  - **Bảo mật:** OWASP ZAP
  - **API:** Postman (Tùy chọn)

## 3. 🗂️ Cấu trúc thư mục

Dự án được chia thành 2 thư mục chính là `frontend` và `backend`.
Chào bạn, đây là nội dung README.md dựa trên thông tin dự án của chúng ta. Bạn có thể sao chép toàn bộ nội dung bên dưới và dán vào file README.md trong thư mục gốc của dự án.

Markdown

# Dự án Website Thời trang QNT Shop (Demo WAF với ModSecurity)

## 1. 📖 Giới thiệu

Đây là dự án website thương mại điện tử (thời trang) full-stack được xây dựng bằng React (Frontend) và Node.js/Express (Backend).

Mục tiêu chính của đề tài là sử dụng website này làm nền tảng để demo **Triển khai Tường lửa Ứng dụng Web (WAF) với ModSecurity trên Nginx**, tập trung vào việc ngăn chặn các cuộc tấn công phổ biến như **SQL Injection** và **Cross-Site Scripting (XSS)**.

## 2. 💻 Công nghệ sử dụng

Dự án được xây dựng với các công nghệ hiện đại:

- **Frontend:**
  - **Ngôn ngữ:** JavaScript (ES6+)
  - **Framework:** React.js
  - **Thư viện:** React Router (Điều hướng), Axios/Fetch (Gọi API), Socket.io-client (Chat)
- **Backend:**
  - **Ngôn ngữ:** JavaScript (ES6+)
  - **Runtime:** Node.js
  - **Framework:** Express.js
  - **Xác thực:** JSON Web Tokens (JWT), Passport.js (cho Google OAuth)
  - **Real-time:** Socket.io
- **Database:**
  - **Hệ CSDL:** MongoDB (NoSQL)
  - **Thư viện:** Mongoose (ODM)
- **WAF & Deployment (Cho demo):**
  - **Web Server:** Nginx (Reverse Proxy)
  - **Tường lửa:** ModSecurity (WAF)
  - **Hệ điều hành:** Ubuntu (chạy trên máy ảo)
- **Công cụ kiểm thử:**
  - **Bảo mật:** OWASP ZAP
  - **API:** Postman (Tùy chọn)

## 3. 🗂️ Cấu trúc thư mục

Dự án được chia thành 2 thư mục chính là `frontend` và `backend`.

/ ├── backend/ # Chứa server Node.js & API │ ├── routes/ # Định tuyến API (productRoutes.js, authRoutes.js...) │ ├── models/ # Schema của MongoDB (Product.js, User.js...) │ ├── middleware/ # Xử lý xác thực (authMiddleware.js) │ ├── config/ # Cấu hình (passport.js) │ ├── img/ # Hình ảnh sản phẩm (do backend phục vụ) │ ├── server.js # File khởi động server chính │ └── .env # File cấu hình biến môi trường │ ├── frontend/ # Chứa client React │ ├── public/ │ │ └── img/ # Ảnh tĩnh (video, ảnh trang chủ) │ └── src/ │ ├── pages/ # Các trang (Home.js, Products.js, Login.js...) │ ├── components/ # Các thành phần (Header.js, Footer.js...) │ ├── App.js # Cấu hình routes của React (React Router) │ └── index.js # Điểm vào của React │ └── README.md # File thông tin dự án

## 4. 🚀 Hướng dẫn cài đặt & chạy chương trình

(Các hướng dẫn này dùng để chạy dự án trên máy local, chưa bao gồm Nginx)

### Yêu cầu môi trường

- **Node.js:** v18.0 hoặc cao hơn
- **npm:** v9.0 hoặc cao hơn
- **MongoDB:** Cài đặt MongoDB Compass (local) hoặc sử dụng một tài khoản MongoDB Atlas (cloud).

### Cài đặt Database

1.  Mở MongoDB Compass.
2.  Tạo một kết nối (ví dụ: `mongodb://localhost:27017`).
3.  Tạo một database mới với tên là **`shop_clothes`**. (Hệ thống sẽ tự động tạo các collection khi chạy).

### Cấu hình Backend

1.  Đi đến thư mục `backend/`.
2.  Tạo một file mới tên là `.env`.
3.  Copy và dán nội dung sau vào file, thay thế các giá trị cho phù hợp:

    ```env
    # Kết nối MongoDB
    MONGO_URI=mongodb://localhost:27017/shop_clothes

    # Khóa bí mật cho JWT
    JWT_SECRET=your_super_secret_key_123

    # Cấu hình Google OAuth (Tùy chọn, nếu bạn muốn test)
    PASSPORT_GOOGLE_CLIENT_ID=your_google_client_id
    PASSPORT_GOOGLE_CLIENT_SECRET=your_google_client_secret
    ```

### Lệnh chạy hệ thống

Bạn cần mở **hai (2) cửa sổ terminal** riêng biệt để chạy song song Backend và Frontend.

**Terminal 1: Chạy Backend (Cổng 5000)**

```bash
# 1. Đi vào thư mục backend
cd backend

# 2. Cài đặt các thư viện
npm install

# 3. Khởi động server (sử dụng nodemon để tự động load lại khi sửa code)
npx nodemon server.js
```

Chào bạn, đây là nội dung README.md dựa trên thông tin dự án của chúng ta. Bạn có thể sao chép toàn bộ nội dung bên dưới và dán vào file README.md trong thư mục gốc của dự án.

Markdown

# Dự án Website Thời trang QNT Shop (Demo WAF với ModSecurity)

## 1. 📖 Giới thiệu

Đây là dự án website thương mại điện tử (thời trang) full-stack được xây dựng bằng React (Frontend) và Node.js/Express (Backend).

Mục tiêu chính của đề tài là sử dụng website này làm nền tảng để demo **Triển khai Tường lửa Ứng dụng Web (WAF) với ModSecurity trên Nginx**, tập trung vào việc ngăn chặn các cuộc tấn công phổ biến như **SQL Injection** và **Cross-Site Scripting (XSS)**.

## 2. 💻 Công nghệ sử dụng

Dự án được xây dựng với các công nghệ hiện đại:

- **Frontend:**
  - **Ngôn ngữ:** JavaScript (ES6+)
  - **Framework:** React.js
  - **Thư viện:** React Router (Điều hướng), Axios/Fetch (Gọi API), Socket.io-client (Chat)
- **Backend:**
  - **Ngôn ngữ:** JavaScript (ES6+)
  - **Runtime:** Node.js
  - **Framework:** Express.js
  - **Xác thực:** JSON Web Tokens (JWT), Passport.js (cho Google OAuth)
  - **Real-time:** Socket.io
- **Database:**
  - **Hệ CSDL:** MongoDB (NoSQL)
  - **Thư viện:** Mongoose (ODM)
- **WAF & Deployment (Cho demo):**
  - **Web Server:** Nginx (Reverse Proxy)
  - **Tường lửa:** ModSecurity (WAF)
  - **Hệ điều hành:** Ubuntu (chạy trên máy ảo)
- **Công cụ kiểm thử:**
  - **Bảo mật:** OWASP ZAP
  - **API:** Postman (Tùy chọn)

## 3. 🗂️ Cấu trúc thư mục

Dự án được chia thành 2 thư mục chính là `frontend` và `backend`.

/ ├── backend/ # Chứa server Node.js & API │ ├── routes/ # Định tuyến API (productRoutes.js, authRoutes.js...) │ ├── models/ # Schema của MongoDB (Product.js, User.js...) │ ├── middleware/ # Xử lý xác thực (authMiddleware.js) │ ├── config/ # Cấu hình (passport.js) │ ├── img/ # Hình ảnh sản phẩm (do backend phục vụ) │ ├── server.js # File khởi động server chính │ └── .env # File cấu hình biến môi trường │ ├── frontend/ # Chứa client React │ ├── public/ │ │ └── img/ # Ảnh tĩnh (video, ảnh trang chủ) │ └── src/ │ ├── pages/ # Các trang (Home.js, Products.js, Login.js...) │ ├── components/ # Các thành phần (Header.js, Footer.js...) │ ├── App.js # Cấu hình routes của React (React Router) │ └── index.js # Điểm vào của React │ └── README.md # File thông tin dự án

## 4. 🚀 Hướng dẫn cài đặt & chạy chương trình

(Các hướng dẫn này dùng để chạy dự án trên máy local, chưa bao gồm Nginx)

### Yêu cầu môi trường

- **Node.js:** v18.0 hoặc cao hơn
- **npm:** v9.0 hoặc cao hơn
- **MongoDB:** Cài đặt MongoDB Compass (local) hoặc sử dụng một tài khoản MongoDB Atlas (cloud).

### Cài đặt Database

1.  Mở MongoDB Compass.
2.  Tạo một kết nối (ví dụ: `mongodb://localhost:27017`).
3.  Tạo một database mới với tên là **`shop_clothes`**. (Hệ thống sẽ tự động tạo các collection khi chạy).

### Cấu hình Backend

1.  Đi đến thư mục `backend/`.
2.  Tạo một file mới tên là `.env`.
3.  Copy và dán nội dung sau vào file, thay thế các giá trị cho phù hợp:

    ```env
    # Kết nối MongoDB
    MONGO_URI=mongodb://localhost:27017/shop_clothes

    # Khóa bí mật cho JWT
    JWT_SECRET=your_super_secret_key_123

    # Cấu hình Google OAuth (Tùy chọn, nếu bạn muốn test)
    PASSPORT_GOOGLE_CLIENT_ID=your_google_client_id
    PASSPORT_GOOGLE_CLIENT_SECRET=your_google_client_secret
    ```

### Lệnh chạy hệ thống

Bạn cần mở **hai (2) cửa sổ terminal** riêng biệt để chạy song song Backend và Frontend.

**Terminal 1: Chạy Backend (Cổng 5000)**

```bash
# 1. Đi vào thư mục backend
cd backend

# 2. Cài đặt các thư viện
npm install

# 3. Khởi động server (sử dụng nodemon để tự động load lại khi sửa code)
npx nodemon server.js
💡 Server backend sẽ chạy tại: https://shop-clothes-backend.onrender.com

Terminal 2: Chạy Frontend (Cổng 3000)

Bash

# 1. Đi vào thư mục frontend
cd frontend

# 2. Cài đặt các thư viện
npm install

# 3. Khởi động server React
npm start
💡 Trang web sẽ tự động mở tại: http://localhost:3000

(Lưu ý: Bạn không cần file setupProxy.js cho kịch bản này, vì tất cả các file frontend đã được cấu hình để gọi trực tiếp đến https://shop-clothes-backend.onrender.com)

5. 🧑‍💻 Tài khoản Demo
Tài khoản Admin:

Username: (Bạn hãy điền email admin của bạn vào đây)

Password: (Bạn hãy điền mật khẩu admin vào đây)

Tài khoản User:

Vui lòng sử dụng chức năng Đăng ký trên trang web để tự tạo tài khoản người dùng mới.

6. 📸 Kết quả và hình ảnh minh họa
Dưới đây là một số hình ảnh giao diện chính của website.

Hình 1: Giao diện trang chủ QNT Shop với video nền.

Hình 2: Trang danh sách sản phẩm.

Hình 3: Trang đăng nhập và đăng ký.

Hình 4: Giao diện giỏ hàng.

Hình 5: Kết quả quét lỗ hổng SQL Injection và XSS bằng OWASP ZAP (trước khi triển khai WAF).
```
