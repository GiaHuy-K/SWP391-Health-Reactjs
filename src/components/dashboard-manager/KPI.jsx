import React, { useEffect, useState } from "react";
import { Card, Col, Row, Typography } from "antd";
import { HddOutlined, HeartOutlined } from "@ant-design/icons";
import CountUp from "react-countup";
import dayjs from "dayjs";
import api from "../../config/axios";

const { Text, Title } = Typography;

const DashboardKPI = () => {
  const [totalSupplies, setTotalSupplies] = useState(0);
  const [todayIncidents, setTodayIncidents] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res1 = await api.get("/medical-supplies");
        const supplies = res1.data.content || [];
        setTotalSupplies(supplies.length);

        const res2 = await api.get("/health-incidents");
        const today = dayjs().format("YYYY-MM-DD");
        const incidentsToday = (res2.data.content || []).filter(
          (incident) =>
            dayjs(incident.incidentDateTime).format("YYYY-MM-DD") === today
        );
        setTodayIncidents(incidentsToday.length);
      } catch (error) {
        console.error("Lỗi khi tải KPI:", error);
      }
    };

    fetchData();
  }, []);

  const kpiCardStyle = {
    borderRadius: 16,
    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
    padding: 16,
    display: "flex",
    alignItems: "center",
    gap: 12,
  };

  const iconStyle = {
    fontSize: 40,
  };

  return (
    <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
      {/* Tổng số vật tư */}
      <Col xs={24} md={12}>
        <Card styles={{ body: kpiCardStyle }}>
          <HddOutlined style={{ ...iconStyle, color: "#1890ff" }} />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Text type="secondary" style={{ marginBottom: 4 }}>
              Tổng số vật tư y tế
            </Text>
            <Text strong style={{ fontSize: 24 }}>
              <CountUp end={totalSupplies} separator="," duration={1.5} />
            </Text>
          </div>
        </Card>
      </Col>

      {/* Sự cố y tế hôm nay */}
      <Col xs={24} md={12}>
        <Card style={kpiCardStyle}>
          <HeartOutlined style={{ ...iconStyle, color: "#f5222d" }} />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Text type="secondary" style={{ marginBottom: 4 }}>
              Sự cố y tế hôm nay
            </Text>
            <Text strong style={{ fontSize: 24 }}>
              <CountUp end={todayIncidents} separator="," duration={1.5} />
            </Text>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default DashboardKPI;
