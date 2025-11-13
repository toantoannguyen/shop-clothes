import React, { useState, useEffect } from "react";
import api from "../api/axiosConfig";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { FaBoxes, FaDollarSign, FaShoppingCart, FaUsers } from "react-icons/fa";

// Đăng ký các thành phần của Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Component Card Thống kê
function StatCard({ title, value, icon, colorClass }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
      <div className={`p-3 rounded-full ${colorClass}`}>{icon}</div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const response = await api.get("/dashboard/summary");
        const data = response.data;
        setSummary(data);

        // --- Chuẩn bị dữ liệu cho Biểu đồ ---
        // 1. Tạo 7 ngày gần nhất (nhãn)
        const labels = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          // Format ngày thành YYYY-MM-DD
          labels.push(d.toISOString().split("T")[0]);
        }

        // 2. Map dữ liệu từ API vào
        const salesData = labels.map((label) => {
          const apiData = data.salesOverTime.find((d) => d._id === label);
          return apiData ? apiData.dailySales : 0;
        });

        setChartData({
          labels: labels.map((l) => l.substring(5)), // Chỉ hiển thị MM-DD
          datasets: [
            {
              label: "Doanh thu",
              data: salesData,
              fill: true,
              backgroundColor: "rgba(59, 130, 246, 0.2)", // Màu xanh nhạt
              borderColor: "rgba(59, 130, 246, 1)", // Màu xanh đậm
              tension: 0.1,
            },
          ],
        });
      } catch (err) {
        setError(
          "Không thể tải thống kê: " +
            (err.response?.data?.message || err.message)
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) return <p>Đang tải thống kê...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  // Cấu hình biểu đồ
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Doanh thu (Đơn hàng đã thanh toán) - 7 ngày gần nhất",
        font: { size: 16 },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y.toLocaleString("vi-VN") + " VNĐ";
            }
            return label;
          },
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: function (value) {
            return value.toLocaleString("vi-VN") + " VNĐ";
          },
        },
      },
    },
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* === 1. CÁC THẺ THỐNG KÊ === */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Tổng Doanh thu"
          value={
            summary?.totalSales.toLocaleString("vi-VN") + " VNĐ" || "0 VNĐ"
          }
          icon={<FaDollarSign className="text-white text-2xl" />}
          colorClass="bg-green-500"
        />
        <StatCard
          title="Tổng Đơn hàng"
          value={summary?.totalOrders || 0}
          icon={<FaShoppingCart className="text-white text-2xl" />}
          colorClass="bg-blue-500"
        />
        <StatCard
          title="Tổng Khách hàng"
          value={summary?.totalUsers || 0}
          icon={<FaUsers className="text-white text-2xl" />}
          colorClass="bg-purple-500"
        />
        <StatCard
          title="Tổng Sản phẩm"
          value={summary?.totalProducts || 0}
          icon={<FaBoxes className="text-white text-2xl" />}
          colorClass="bg-yellow-500"
        />
      </div>

      {/* === 2. BIỂU ĐỒ === */}
      <div className="bg-white shadow-md rounded-lg p-6">
        {chartData ? (
          <Line options={chartOptions} data={chartData} />
        ) : (
          <p>Đang tải dữ liệu biểu đồ...</p>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;
