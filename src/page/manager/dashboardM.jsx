import React from "react";
import { Row, Col, Typography, Divider } from "antd";
import DashboardLowStockCard from "../../components/dashboard-manager/lowStockCard";
import RecentHealthIncidents from "../../components/dashboard-manager/recentHealthIncidents";
import HealthIncidentLineChart from "../../components/dashboard-manager/healthIncidentLineChart";
import MedicalSupplyStatusPieChart from "../../components/dashboard-manager/medicalSupplyStatusPieChart";
import DashboardKPI from "../../components/dashboard-manager/KPI";
import DashboardExpiringSuppliesCard from "../../components/dashboard-manager/dashboardExpiringSuppliesCard";

const { Title } = Typography;

function DashboardM() {
  return (
    <div>
      <Title level={3}>Tổng quan</Title>
        <DashboardKPI />
      {/* KHU 1: Tình trạng vật tư + Vật tư sắp hết */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <MedicalSupplyStatusPieChart />
        </Col>
        <Col xs={24} md={12}>
          <DashboardExpiringSuppliesCard />
        </Col>
      </Row>

      <Divider />

      {/* KHU 2: Biểu đồ đường sự cố y tế */}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <HealthIncidentLineChart />
        </Col>
      </Row>

      <Divider />

      {/* KHU 3: Danh sách sự cố y tế gần đây */}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <RecentHealthIncidents />
        </Col>
      </Row>
    </div>
  );
}

export default DashboardM;
