import React, { useState, useEffect } from "react";
import { Card, Row, Col, Statistic, Table, Button, Space, Tag } from "antd";
import { 
  FileTextOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  CloseCircleOutlined,
  EyeOutlined 
} from "@ant-design/icons";
import { getAllVaccinations, getVaccinationFileUrl } from "../../services/api.vaccine";
import { Modal, message } from "antd";

const VaccinationStats = () => {
  const [vaccinationData, setVaccinationData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fileModalVisible, setFileModalVisible] = useState(false);
  const [fileUrl, setFileUrl] = useState("");
  const [fileLoading, setFileLoading] = useState(false);

  useEffect(() => {
    fetchVaccinationData();
  }, []);

  const fetchVaccinationData = async () => {
    setLoading(true);
    try {
      const res = await getAllVaccinations();
      setVaccinationData(res.content || []);
    } catch (err) {
      console.error("Lỗi khi lấy dữ liệu tiêm chủng:", err);
    } finally {
      setLoading(false);
    }
  };

  // Tính toán thống kê
  const totalVaccinations = vaccinationData.length;
  const approvedVaccinations = vaccinationData.filter(v => v.status === "Chấp nhận" || v.status === "APPROVED").length;
  const pendingVaccinations = vaccinationData.filter(v => v.status === "Chờ xử lý" || v.status === "PENDING").length;
  const rejectedVaccinations = vaccinationData.filter(v => v.status === "Từ chối" || v.status === "REJECTED").length;

  // Hàm xử lý xem file bằng chứng
  const handleViewFile = async (vaccinationId) => {
    setFileLoading(true);
    try {
      const res = await getVaccinationFileUrl(vaccinationId);
      if (!res || !res.url) {
        message.error("Không có file bằng chứng cho bản ghi này");
        return;
      }
      setFileUrl(res.url);
      setFileModalVisible(true);
    } catch (err) {
      message.error("Không thể tải file bằng chứng");
    } finally {
      setFileLoading(false);
    }
  };

  // Hàm xử lý download file
  const handleDownloadFile = () => {
    if (fileUrl) {
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = 'vaccination-proof.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Cột cho bảng tiêm chủng gần đây
  const recentVaccinationColumns = [
    {
      title: "Học sinh",
      dataIndex: "studentFullName",
      key: "studentFullName",
      render: (name, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{name}</div>
          <small style={{ color: '#666' }}>Lớp: {record.studentClassName}</small>
        </div>
      ),
    },
    {
      title: "Vắc xin",
      dataIndex: "vaccineName",
      key: "vaccineName",
    },
    {
      title: "Ngày tiêm",
      dataIndex: "vaccinationDate",
      key: "vaccinationDate",
      render: (date) => date ? new Date(date).toLocaleDateString('vi-VN') : '-',
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = 'default';
        let icon = null;
        
        switch (status) {
          case 'Chấp nhận':
          case 'APPROVED':
            color = 'success';
            icon = <CheckCircleOutlined />;
            break;
          case 'Chờ xử lý':
          case 'PENDING':
            color = 'processing';
            icon = <ClockCircleOutlined />;
            break;
          case 'Từ chối':
          case 'REJECTED':
            color = 'error';
            icon = <CloseCircleOutlined />;
            break;
          default:
            color = 'default';
        }
        
        return (
          <Tag color={color} icon={icon}>
            {status}
          </Tag>
        );
      },
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => handleViewFile(record.studentVaccinationId)}
          loading={fileLoading}
          size="small"
        >
          Xem file
        </Button>
      ),
    },
  ];

  return (
    <div>
      {/* Thống kê tổng quan */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng số tiêm chủng"
              value={totalVaccinations}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Đã duyệt"
              value={approvedVaccinations}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Chờ duyệt"
              value={pendingVaccinations}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Từ chối"
              value={rejectedVaccinations}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Bảng tiêm chủng gần đây */}
      <Card 
        title="Tiêm chủng gần đây" 
        extra={
          <Space>
            <Button 
              type="primary" 
              onClick={() => window.location.href = '/dashboardNurse/student-vaccination'}
            >
              Xem tất cả
            </Button>
          </Space>
        }
      >
        <Table
          columns={recentVaccinationColumns}
          dataSource={vaccinationData.slice(0, 5)} // Chỉ hiển thị 5 bản ghi gần nhất
          loading={loading}
          pagination={false}
          rowKey="studentVaccinationId"
          size="small"
        />
      </Card>

      {/* Modal xem file bằng chứng */}
      <Modal
        title="File bằng chứng tiêm chủng"
        open={fileModalVisible}
        onCancel={() => setFileModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setFileModalVisible(false)}>
            Đóng
          </Button>,
          <Button 
            key="download" 
            type="primary" 
            onClick={handleDownloadFile}
            disabled={!fileUrl}
          >
            Tải xuống
          </Button>,
        ]}
        width={800}
      >
        {fileUrl ? (
          <div style={{ textAlign: 'center' }}>
            <iframe
              src={fileUrl}
              style={{ width: '100%', height: '500px', border: 'none' }}
              title="File bằng chứng"
            />
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            {fileLoading ? (
              <div>Đang tải file...</div>
            ) : (
              <div>Không thể hiển thị file</div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default VaccinationStats; 