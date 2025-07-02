import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, Spin } from "antd";
import api from "../../config/axios";

// Map màu theo status thường viết thường
const getColorByStatus = (status) => {
  switch (status.toLowerCase()) {
    case "sẵn có":
      return "green";
    case "hết hàng":
      return "orange";
    case "hết hạn":
      return "volcano";
    case "không còn sử dụng":
      return "red";
    default:
      return "#ccc";
  }
};

const MedicalSupplyStatusPieChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSupplies = async () => {
      setLoading(true);
      try {
        const res = await api.get("/medical-supplies");
        const supplies = res.data.content || [];

        const statusCount = {
          "sẵn có": 0,
          "hết hàng": 0,
          "hết hạn": 0,
          "không còn sử dụng": 0,
        };

        supplies.forEach((supply) => {
          const status = supply.status?.toLowerCase() || "không rõ";
          if (statusCount[status] !== undefined) {
            statusCount[status]++;
          }
        });

        const chartData = Object.entries(statusCount)
          .map(([name, value]) => ({ name, value }))
          .filter((item) => item.value > 0); // Chỉ hiển thị trạng thái có số lượng > 0

        setData(chartData);
      } catch (err) {
        console.error("Lỗi khi lấy vật tư:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSupplies();
  }, []);

  return (
    <Card title="Tỷ lệ vật tư theo trạng thái sử dụng">
      {loading ? (
        <Spin />
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
              // labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getColorByStatus(entry.name)}
                />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value} vật tư`, "Số lượng"]} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
};

export default MedicalSupplyStatusPieChart;
