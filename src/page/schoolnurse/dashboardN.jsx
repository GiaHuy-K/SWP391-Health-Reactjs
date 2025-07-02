import React from "react";
import HealthIncidentLineChart from "../../components/dashboard-manager/healthIncidentLineChart";
import RecentHealthIncidents from "../../components/dashboard-manager/recentHealthIncidents";
import { Col, Divider, Row } from "antd";
import DashboardKPI from "../../components/dashboard-manager/KPI";

function DashboardN() {
  return (
    <div>
        <h2>Tổng quan</h2>
        <DashboardKPI />
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

export default DashboardN;
