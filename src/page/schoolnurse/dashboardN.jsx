import React from "react";
import HealthIncidentLineChart from "../../components/dashboard-manager/healthIncidentLineChart";
import RecentHealthIncidents from "../../components/dashboard-manager/recentHealthIncidents";
import ChronicDiseaseStats from "../../components/dashboard-manager/chronicDiseaseStats";
import VaccinationStats from "../../components/dashboard-manager/vaccinationStats";
import { Col, Divider, Row } from "antd";
import DashboardKPI from "../../components/dashboard-manager/KPI";

function DashboardN() {
  return (
    <div>
        <h2>Tổng quan</h2>
        <DashboardKPI />
      
      {/* Thống kê tiêm chủng */}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <VaccinationStats />
        </Col>
      </Row>

      <Divider />

      {/* Thống kê bệnh mãn tính */}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <ChronicDiseaseStats />
        </Col>
      </Row>

      <Divider />

      {/* Biểu đồ đường sự cố y tế */}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <HealthIncidentLineChart />
        </Col>
      </Row>

      <Divider />

      {/* Danh sách sự cố y tế gần đây */}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <RecentHealthIncidents />
        </Col>
      </Row>
    </div>
  );
}

export default DashboardN;
