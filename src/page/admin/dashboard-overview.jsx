import React, { useEffect, useState } from "react";
import { Card, Spin, Row, Col, Typography } from "antd";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import api from "../../config/axios";
import { TeamOutlined, UserOutlined } from "@ant-design/icons";
import CountUp from "react-countup";

const { Text, Title } = Typography;

const STATUS_COLORS = ["#4caf50", "#f44336"];

const DashboardOverview = () => {
  const [userStatusData, setUserStatusData] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const [loading, setLoading] = useState(true);
  const [parentLinkData, setParentLinkData] = useState([]);
  const PARENT_LINK_COLORS = ["#1890ff", "#faad14"];
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [staffRes, medicalRes, parentRes, studentRes] = await Promise.all(
          [
            api.get("admin/users/staff-managers"),
            api.get("admin/users/medical-staff"),
            api.get("admin/users/parents"),
            api.get("/students"),
          ]
        );

        const staff = staffRes.data.content || [];
        const medical = medicalRes.data.content || [];
        const parents = parentRes.data.content || [];
        console.log(parents)
        const allUsers = [...staff, ...medical, ...parents];
        const linkedParents = parents.filter((p) => p.linkedToStudent).length;
        const unlinkedParents = parents.length - linkedParents;

        setParentLinkData([
          { name: "Đã liên kết", value: linkedParents },
          { name: "Chưa liên kết", value: unlinkedParents },
        ]);

        const activeCount = allUsers.filter((u) => u.isActive).length;
        const inactiveCount = allUsers.length - activeCount;

        setUserStatusData([
          { name: "Hoạt động", value: activeCount },
          { name: "Vô hiệu hóa", value: inactiveCount },
        ]);

        setTotalUsers(allUsers.length);
        setTotalStudents(studentRes.data.totalElements || 0);
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
  const renderPieChartParent = (title, data) => (
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
            {data.map((entry, index) => {
              const LINK_COLORS = {
                "Đã liên kết": "#1890ff",
                "Chưa liên kết": "#ff4d4f",
              };
              return (
                <Cell
                  key={`parent-cell-${index}`}
                  fill={LINK_COLORS[entry.name] || "#8884d8"}
                />
              );
            })}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );

  const kpiCardStyle = {
    borderRadius: 16,
    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
    padding: 24,
    display: "flex",
    alignItems: "center",
    gap: 16,
  };

  const iconStyle = {
    fontSize: 40,
  };

  return (
    <div style={{ padding: 24 }}>
      {loading ? (
        <Spin size="large" style={{ display: "block", margin: "100px auto" }} />
      ) : (
        <>
          {/* KPI Cards */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} md={12}>
              <Card style={kpiCardStyle}>
                <UserOutlined style={{ ...iconStyle, color: "#1890ff" }} />
                <div>
                  <Text type="secondary">Tổng người dùng hệ thống</Text>
                  <Title level={3}>
                    <CountUp end={totalUsers} separator="," duration={1.5} />
                  </Title>
                </div>
              </Card>
            </Col>

            <Col xs={24} md={12}>
              <Card style={kpiCardStyle}>
                <TeamOutlined style={{ ...iconStyle, color: "#52c41a" }} />
                <div>
                  <Text type="secondary">Tổng số học sinh</Text>
                  <Title level={3}>
                    <CountUp end={totalStudents} separator="," duration={1.5} />
                  </Title>
                </div>
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              {renderPieChart("Trạng thái người dùng", userStatusData)}
            </Col>
            <Col xs={24} md={12}>
              {renderPieChartParent(
                "Phụ huynh đã liên kết với học sinh",
                parentLinkData
              )}
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default DashboardOverview;
