import React, { useEffect, useState } from "react";
import { Card, Spin, Row, Col } from "antd";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Bar,
  ResponsiveContainer,
} from "recharts";
import api from "../../config/axios";

// Xanh lá cho hoạt động, đỏ cho vô hiệu hóa
const STATUS_COLORS = ["#4caf50", "#f44336"];

const DashboardOverview = () => {
  const [userStatusData, setUserStatusData] = useState([]);
  const [roleData, setRoleData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [staffRes, medicalRes, parentRes] = await Promise.all([
          api.get("admin/users/staff-managers"),
          api.get("admin/users/medical-staff"),
          api.get("admin/users/parents"),
        ]);

        const allUsers = [
          ...staffRes.data.content,
          ...medicalRes.data.content,
          ...parentRes.data.content,
        ];

        const activeCount = allUsers.filter((u) => u.isActive).length;
        const inactiveCount = allUsers.length - activeCount;

        setUserStatusData([
          { name: "Hoạt động", value: activeCount },
          { name: "Vô hiệu hóa", value: inactiveCount },
        ]);

        setRoleData([
          { role: "Quản lý", value: staffRes.data.totalElements || 0 },
          { role: "Y tá", value: medicalRes.data.totalElements || 0 },
          { role: "Phụ huynh", value: parentRes.data.totalElements || 0 },
        ]);
      } catch (err) {
        console.error("Lỗi khi fetch dữ liệu dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderPieChart = (title, data) => (
    <Card title={title} style={{ width: "100%" }}>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label={({ name, value }) => `${name}: ${value}`}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={STATUS_COLORS[index % STATUS_COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );

  return (
    <div style={{ padding: 24 }}>
      {loading ? (
        <Spin size="large" style={{ display: "block", margin: "100px auto" }} />
      ) : (
        <>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              {renderPieChart("Trạng thái người dùng", userStatusData)}
            </Col>
          </Row>

          <Card title="Người dùng theo vai trò" style={{ marginTop: 24 }}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={roleData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="role" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Số lượng">
                  {roleData.map((entry, index) => {
                    const colors = {
                      "Quản lý": "#4caf50",
                      "Y tá": "#2196f3",
                      "Phụ huynh": "#ff9800",
                    };
                    return (
                      <Cell
                        key={index}
                        fill={colors[entry.role] || "#8884d8"}
                      />
                    );
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </>
      )}
    </div>
  );
};

export default DashboardOverview;
