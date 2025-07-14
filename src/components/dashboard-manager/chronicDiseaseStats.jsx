import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Progress, Typography } from 'antd';
import { 
  MedicineBoxOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined, 
  ClockCircleOutlined 
} from '@ant-design/icons';
import { getAllChronicDiseases } from '../../services/api.chronic';

const { Title, Text } = Typography;

const ChronicDiseaseStats = () => {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await getAllChronicDiseases({ size: 1000 }); // Lấy tất cả để tính toán
      const normalizeStatus = status =>
        (status || "")
          .trim()
          .toLowerCase()
          .normalize('NFC');

      const allChronic = response.content || [];

      // Log trạng thái thực tế và đã chuẩn hóa
      console.log(allChronic.map(item => ({
        raw: item.status,
        normalized: normalizeStatus(item.status)
      })));

      // Kiểm tra phần tử thiếu status
      allChronic.forEach(item => {
        if (!item.status) console.warn("Missing status:", item);
      });

      setStats({
        total: allChronic.length,
        pending: allChronic.filter(item =>
          ["chờ xử lý"].includes(normalizeStatus(item.status))
        ).length,
        approved: allChronic.filter(item =>
          ["chấp nhận"].includes(normalizeStatus(item.status))
        ).length,
        rejected: allChronic.filter(item =>
          ["từ chối"].includes(normalizeStatus(item.status))
        ).length,
      });
    } catch (error) {
      console.error('Lỗi khi tải thống kê bệnh mãn tính:', error);
    } finally {
      setLoading(false);
    }
  };

  const getApprovalRate = () => {
    if (stats.total === 0) return 0;
    return Math.round((stats.approved / stats.total) * 100);
  };

  const getPendingRate = () => {
    if (stats.total === 0) return 0;
    return Math.round((stats.pending / stats.total) * 100);
  };

  const getRejectedRate = () => {
    if (stats.total === 0) return 0;
    return Math.round((stats.rejected / stats.total) * 100);
  };

  return (
    <div>
      <Title level={4}>Thống kê bệnh mãn tính</Title>
      
      {/* Thống kê tổng quan */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card loading={loading}>
            <Statistic
              title="Tổng số bệnh mãn tính"
              value={stats.total}
              prefix={<MedicineBoxOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card loading={loading}>
            <Statistic
              title="Chờ duyệt"
              value={stats.pending}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card loading={loading}>
            <Statistic
              title="Đã duyệt"
              value={stats.approved}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card loading={loading}>
            <Statistic
              title="Từ chối"
              value={stats.rejected}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Biểu đồ tỷ lệ */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title="Tỷ lệ duyệt bệnh mãn tính" loading={loading}>
            <div style={{ textAlign: 'center' }}>
              <Progress
                type="circle"
                percent={loading ? 0 : getApprovalRate()}
                format={percent => loading ? 'Đang tải...' : `${percent}%`}
                strokeColor="#52c41a"
                trailColor="#f0f0f0"
              />
              <div style={{ marginTop: 16 }}>
                <Text>Đã duyệt: {stats.approved}/{stats.total}</Text>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Phân bố trạng thái" loading={loading}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <Text>Chờ duyệt: </Text>
                <Progress 
                  percent={getPendingRate()} 
                  strokeColor="#faad14"
                  showInfo={false}
                />
                <Text style={{ fontSize: '12px', color: '#666' }}>
                  {stats.pending} bản ghi
                </Text>
              </div>
              <div>
                <Text>Đã duyệt: </Text>
                <Progress 
                  percent={getApprovalRate()} 
                  strokeColor="#52c41a"
                  showInfo={false}
                />
                <Text style={{ fontSize: '12px', color: '#666' }}>
                  {stats.approved} bản ghi
                </Text>
              </div>
              <div>
                <Text>Từ chối: </Text>
                <Progress 
                  percent={getRejectedRate()} 
                  strokeColor="#ff4d4f"
                  showInfo={false}
                />
                <Text style={{ fontSize: '12px', color: '#666' }}>
                  {stats.rejected} bản ghi
                </Text>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ChronicDiseaseStats; 