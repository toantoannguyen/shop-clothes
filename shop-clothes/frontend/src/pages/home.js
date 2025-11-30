import React, { useEffect, useRef } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import { Link, useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.warn("Video autoplay bị chặn:", error);
      });
    }
  }, []);

  const handleContactClick = () => {
    navigate("/contact");
  };

  return (
    <div className="bg-gray-50">
      <Header />

      {/* Video Section - Full screen hero */}
      <section className="relative text-white text-center overflow-hidden h-screen">
        {/* Video nền */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 z-1 w-full h-full object-cover"
        >
          <source src="/img/video-background.mp4" type="video/mp4" />
          Trình duyệt của bạn không hỗ trợ video.
        </video>

        {/* Lớp phủ tối */}
        <div className="absolute inset-0 z-5 bg-black opacity-40"></div>

        {/* Nội dung hero */}
        <div className="relative z-10 container mx-auto px-6 h-full flex flex-col justify-center items-center">
          <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">
            Chào mừng đến với <span className="text-yellow-300">QNT Shop</span>!
          </h1>
          <p className="text-lg max-w-2xl mx-auto opacity-90">
            Nơi bạn tìm thấy phong cách thời trang hiện đại, trẻ trung và đầy cá
            tính 🌟
          </p>
          <Link
            to="/products"
            className="mt-8 bg-yellow-400 text-gray-900 font-semibold px-8 py-3 rounded-full hover:bg-yellow-500 transition inline-block"
          >
            Mua sắm ngay
          </Link>
        </div>
      </section>

      {/* Giới thiệu */}
      <section className="container mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Về QNT Shop</h2>
        <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
          QNT Shop ra đời với sứ mệnh mang đến cho bạn những sản phẩm thời trang
          chất lượng, bắt kịp xu hướng và phù hợp với mọi phong cách. Chúng tôi
          tin rằng thời trang không chỉ là quần áo — mà là cách bạn thể hiện
          chính mình.
        </p>
      </section>

      {/* Ưu điểm / Lý do chọn */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Vì sao chọn QNT Shop?
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="text-center p-6 bg-gray-50 rounded-2xl shadow hover:scale-105 transition">
              <img
                src="/img/anh-chat-luong.png"
                alt="Chất lượng"
                className="w-90 h-90 mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">
                Chất lượng hàng đầu
              </h3>
              <p className="text-gray-600 text-sm">
                Từng sản phẩm được chọn lọc kỹ lưỡng để đảm bảo độ bền và sự
                thoải mái tối đa.
              </p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-2xl shadow hover:scale-105 transition">
              <img
                src="/img/anh-phong-cach.png"
                alt="Phong cách"
                className="w-90 h-90 mx-auto mb-4"
              />

              <h3 className="text-xl font-semibold mb-2">Phong cách đa dạng</h3>
              <p className="text-gray-600 text-sm">
                Từ năng động, thanh lịch đến cá tính – chúng tôi có tất cả cho
                bạn lựa chọn.
              </p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-2xl shadow hover:scale-105 transition">
              <img
                src="/img/anh-dich-vu.png"
                alt="Dịch vụ"
                className="w-90 h-90 mx-auto mb-4"
              />

              <h3 className="text-xl font-semibold mb-2">Dịch vụ tận tâm</h3>
              <p className="text-gray-600 text-sm">
                Đội ngũ chăm sóc khách hàng luôn sẵn sàng hỗ trợ 24/7 để bạn có
                trải nghiệm tốt nhất.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bộ sưu tập nổi bật */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
          Bộ sưu tập nổi bật
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="rounded-2xl overflow-hidden shadow-lg hover:scale-105 transition">
            <img
              src="/img/bo-suu-tap1.png"
              alt="Bộ sưu tập 1"
              className="w-full h-64 object-cover"
            />
          </div>
          <div className="rounded-2xl overflow-hidden shadow-lg hover:scale-105 transition">
            <img
              src="/img/bo-suu-tap2.png"
              alt="Bộ sưu tập 2"
              className="w-full h-64 object-cover"
            />
          </div>
          <div className="rounded-2xl overflow-hidden shadow-lg hover:scale-105 transition">
            <img
              src="/img/bo-suu-tap3.png"
              alt="Bộ sưu tập 3"
              className="w-full h-64 object-cover"
            />
          </div>
        </div>
      </section>

      {/* Liên hệ */}
      <section className="bg-blue-600 text-white py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Liên hệ với chúng tôi</h2>
        <p className="opacity-90 mb-6">
          Có câu hỏi hoặc cần tư vấn? Đừng ngần ngại liên hệ ngay!
        </p>
        <button
          onClick={handleContactClick}
          className="bg-yellow-400 text-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-yellow-500 transition"
        >
          Gửi tin nhắn
        </button>
      </section>

      <Footer />
    </div>
  );
}

export default Home;
