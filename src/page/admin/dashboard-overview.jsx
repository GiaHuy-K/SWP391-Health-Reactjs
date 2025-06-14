import React, { useEffect, useState } from "react";
import { Card, Spin } from "antd";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import api from "../../config/axios";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

const DashboardOverview = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [staffManagersRes, medicalStaffRes, parentsRes] =
          await Promise.all([
            api.get("admin/users/staff-managers"),
            api.get("admin/users/medical-staff"),
            api.get("admin/users/parents"),
          ]);

        const data = [
          {
            name: "Quản lý",
            value: staffManagersRes.data.totalElements || 0,
          },
          {
            name: "Y tá",
            value: medicalStaffRes.data.totalElements || 0,
          },
          {
            name: "Phụ huynh",
            value: parentsRes.data.totalElements || 0,
          },
        ];

        setData(data);
      } catch (error) {
        console.error("Lỗi khi lấy thống kê người dùng:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: 24 }}>
      <Card
        title="Tổng quan người dùng"
        style={{ width: "100%", maxWidth: 600 }}
      >
        {loading ? (
          <div style={{ textAlign: "center", padding: "50px 0" }}>
            <Spin size="large" />
          </div>
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
                fill="#8884d8"
                labelLine={false} // ẩn đường line
                label={({ value, x, y, index }) => (
                  <text
                    x={x}
                    y={y}
                    fill={COLORS[index % COLORS.length]}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={14}
                  >
                    {value}
                  </text>
                )}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </Card>
    </div>
  );
};

export default DashboardOverview;
