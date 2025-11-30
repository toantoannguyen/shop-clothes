import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle, Copy, ArrowLeft, Download } from "lucide-react";

function Payment() {
  const navigate = useNavigate();
  const [qrData, setQrData] = useState("");
  const [bankInfo, setBankInfo] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [payerName, setPayerName] = useState("");
  const [orderCode, setOrderCode] = useState("");
  const [transferContent, setTransferContent] = useState("");
  const [copied, setCopied] = useState("");

  useEffect(() => {
    const savedQR = localStorage.getItem("qrData");
    const savedBank = localStorage.getItem("bankInfo");
    const savedTotal = localStorage.getItem("totalPrice");
    const savedPayer = localStorage.getItem("payerName");

    if (!savedQR) {
      navigate("/checkout");
      return;
    }

    setQrData(savedQR);
    setTotalPrice(savedTotal || 0);
    setPayerName(savedPayer || "");

    if (savedBank) {
      const bank = JSON.parse(savedBank);
      setBankInfo(bank);
    }

    // Extract order code from QR URL
    try {
      const urlParams = new URL(savedQR).searchParams;
      const content = urlParams.get("addInfo") || "";
      setTransferContent(content);

      const code = content.split(" ")[0];
      setOrderCode(code);
    } catch (error) {
      console.error("Error parsing QR data:", error);
    }
  }, [navigate]);

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(""), 2000);
  };

  const handleDownloadQR = () => {
    const link = document.createElement("a");
    link.href = qrData;
    link.download = `QR-${orderCode}.jpg`;
    link.click();
  };

  const handleConfirmPayment = () => {
    localStorage.removeItem("cart");
    localStorage.removeItem("qrData");
    localStorage.removeItem("bankInfo");
    localStorage.removeItem("totalPrice");
    localStorage.removeItem("payerName");
    alert(
      "Cảm ơn bạn! Chúng tôi sẽ xác nhận đơn hàng sau khi nhận được thanh toán."
    );
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/checkout")}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <ArrowLeft size={20} />
            Quay lại
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left - Order Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              <h2 className="text-xl font-bold mb-6 pb-4 border-b">
                Thông tin đơn hàng
              </h2>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">
                    Số tiền thanh toán
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {parseInt(totalPrice).toLocaleString("vi-VN")}
                    <span className="text-lg">₫</span>
                  </p>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-500 mb-1">Mã đơn hàng</p>
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-bold text-blue-800">
                      {orderCode}
                    </p>
                    <button
                      onClick={() => copyToClipboard(orderCode, "order")}
                      className="p-1 hover:bg-gray-100 rounded"
                      title="Sao chép"
                    >
                      {copied === "order" ? (
                        <CheckCircle size={18} className="text-green-500" />
                      ) : (
                        <Copy size={18} className="text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Gói dịch vụ</p>
                  <p className="font-medium">BASIC</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">
                    Chu kỳ thanh toán
                  </p>
                  <p className="font-medium">1 Tháng</p>
                </div>

                {bankInfo && (
                  <>
                    <div className="pt-4 border-t">
                      <p className="text-sm text-gray-500 mb-1">Ngân hàng</p>
                      <p className="font-semibold text-lg">
                        {bankInfo.bankName || bankInfo.bankCode}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        Chủ tài khoản
                      </p>
                      <p className="font-medium">{bankInfo.accountName}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 mb-1">Số tài khoản</p>
                      <div className="flex items-center gap-2">
                        <p className="font-mono font-bold text-blue-800">
                          {bankInfo.accountNumber}
                        </p>
                        <button
                          onClick={() =>
                            copyToClipboard(bankInfo.accountNumber, "account")
                          }
                          className="p-1 hover:bg-gray-100 rounded"
                          title="Sao chép"
                        >
                          {copied === "account" ? (
                            <CheckCircle size={18} className="text-green-500" />
                          ) : (
                            <Copy size={18} className="text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 mb-1">Nội dung</p>
                      <div className="flex items-center gap-2">
                        <p className="font-mono font-medium text-sm bg-blue-50 px-3 py-2 rounded">
                          {transferContent}
                        </p>
                        <button
                          onClick={() =>
                            copyToClipboard(transferContent, "content")
                          }
                          className="p-1 hover:bg-gray-100 rounded"
                          title="Sao chép"
                        >
                          {copied === "content" ? (
                            <CheckCircle size={18} className="text-green-500" />
                          ) : (
                            <Copy size={18} className="text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right - QR Code */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h1 className="text-2xl font-bold text-center mb-2">
                Thanh toán qua VietQR
              </h1>
              <p className="text-center text-gray-600 mb-8">
                Quét mã QR bằng ứng dụng Ngân hàng / Ví điện tử
              </p>

              {/* Alert */}
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
                <div className="flex items-start gap-3">
                  <div className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                    !
                  </div>
                  <p className="text-sm text-red-800">
                    <strong>
                      Khi chuyển khoản xong hãy bấm vào nút "Xác nhận đã Chuyển
                      khoản"
                    </strong>{" "}
                    để hệ thống xử lý đơn hàng
                  </p>
                </div>
              </div>

              {/* QR Code */}
              <div className="flex justify-center mb-6">
                <div className="bg-white p-6 rounded-2xl shadow-xl border-4 border-blue-100">
                  <img
                    src={qrData}
                    alt="QR Code"
                    className="w-80 h-80 object-contain"
                  />
                </div>
              </div>

              {/* Download Button */}
              <div className="flex justify-center mb-6">
                <button
                  onClick={handleDownloadQR}
                  className="flex items-center gap-2 px-6 py-2 border-2 border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <Download size={20} />
                  Tải xuống mã QR
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleConfirmPayment}
                  className="w-full bg-blue-600 text-white py-4 rounded-xl hover:bg-blue-700 font-semibold text-lg transition-colors"
                >
                  ✓ Xác nhận đã Chuyển khoản
                </button>
                <a
                  href="https://support.vietqr.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-center text-blue-600 hover:underline text-sm"
                >
                  Hướng dẫn thanh toán
                </a>
              </div>

              {/* Payment Methods */}
              <div className="mt-8 pt-6 border-t">
                <p className="text-center text-gray-500 text-sm mb-4">
                  Sử dụng Ứng dụng Ngân hàng để quét mã QR hoặc
                  <br />
                  Ví điện tử{" "}
                  <span className="font-semibold text-orange-500">MoMo</span>,{" "}
                  <span className="font-semibold text-blue-500">ZaloPay</span>,{" "}
                  <span className="font-semibold text-red-500">VNPAY</span>™ để
                  thanh toán.
                </p>
              </div>

              {/* Back to Home */}
              <div className="text-center mt-6">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800"
                >
                  <ArrowLeft size={18} />
                  Quay Về Trang Chủ
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;