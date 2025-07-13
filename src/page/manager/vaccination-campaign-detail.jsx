import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Descriptions,
  Button,
  Space,
  Tag,
  Typography,
  Spin,
  Alert,
  Row,
  Col,
  Statistic,
  Badge,
  List,
  Avatar,
  Tooltip
} from "antd";
import {
  ArrowLeftOutlined,
  EditOutlined,
  PlayCircleOutlined,
  CheckCircleOutlined,
  CalendarOutlined,
  UserOutlined,
  TeamOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  PhoneOutlined,
  InfoCircleOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";
import { 
  getVaccinationCampaignById, 
  getCampaignConsents,
  CAMPAIGN_STATUS,
  scheduleVaccinationCampaign,
  rescheduleVaccinationCampaign,
  cancelVaccinationCampaign
} from "../../services/api.vaccination";
import VaccinationConsentList from "../../components/vaccination/VaccinationConsentList";
import { Modal, Form, DatePicker, Input, message } from "antd";

const { Title, Text, Paragraph } = Typography;

const VaccinationCampaignDetail = () => {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [consents, setConsents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [rescheduleForm] = Form.useForm();
  const [cancelForm] = Form.useForm();

  useEffect(() => {
    if (!campaignId) return;
    let intervalId;
    const fetchCampaignDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const campaignData = await getVaccinationCampaignById(campaignId);
        setCampaign(campaignData);
        const consentsData = await getCampaignConsents(campaignId);
        setConsents(consentsData.content || []);
      } catch (err) {
        setError(err.message || "Không thể tải thông tin chiến dịch");
      } finally {
        setLoading(false);
      }
    };
    fetchCampaignDetail();
    if (campaign && campaign.status === CAMPAIGN_STATUS.SCHEDULED) {
      intervalId = setInterval(fetchCampaignDetail, 60000); // 1 phút
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [campaignId, campaign && campaign.status]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      [CAMPAIGN_STATUS.DRAFT]: { color: "#d9d9d9", text: "Nháp" },
      [CAMPAIGN_STATUS.SCHEDULED]: { color: "#1890ff", text: "Đã lên lịch" },
      [CAMPAIGN_STATUS.PREPARING]: { color: "#faad14", text: "Đang chuẩn bị" },
      [CAMPAIGN_STATUS.IN_PROGRESS]: { color: "#52c41a", text: "Đang diễn ra" },
      [CAMPAIGN_STATUS.COMPLETED]: { color: "#52c41a", text: "Đã hoàn thành" },
      [CAMPAIGN_STATUS.CANCELLED]: { color: "#ff4d4f", text: "Đã hủy" },
    };
    const config = statusConfig[status] || { color: "#d9d9d9", text: status };
    return <Badge color={config.color} text={config.text} />;
  };

  const handleSchedule = async () => {
    try {
      await scheduleVaccinationCampaign(campaignId);
      message.success("Lên lịch thành công");
      fetchCampaignDetail();
    } catch {}
  };

  const handleReschedule = () => setRescheduleModalOpen(true);
  const handleCancel = () => setCancelModalOpen(true);

  const submitReschedule = async () => {
    try {
      const values = await rescheduleForm.validateFields();
      const payload = {
        newVaccinationDate: values.newDate ? values.newDate.format("YYYY-MM-DD") : undefined,
        reason: values.reason
      };
      console.log('Payload gửi lên reschedule:', payload);
      await rescheduleVaccinationCampaign(campaignId, payload);
      setRescheduleModalOpen(false);
      fetchCampaignDetail();
    } catch {}
  };

  const submitCancel = async () => {
    try {
      const values = await cancelForm.validateFields();
      await cancelVaccinationCampaign(campaignId, { reason: values.reason });
      setCancelModalOpen(false);
      fetchCampaignDetail();
    } catch {}
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "100px 0" }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>Đang tải thông tin chiến dịch...</div>
      </div>
    );
  }
  if (error) {
    return (
      <Alert
        message="Lỗi"
        description={error}
        type="error"
        showIcon
        action={
          <Button size="small" onClick={() => navigate(-1)}>
            Quay lại
          </Button>
        }
      />
    );
  }
  if (!campaign) {
    return (
      <Alert
        message="Không tìm thấy"
        description="Chiến dịch tiêm chủng không tồn tại"
        type="warning"
        showIcon
        action={
          <Button size="small" onClick={() => navigate(-1)}>
            Quay lại
          </Button>
        }
      />
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
              Quay lại
            </Button>
            <Title level={3} style={{ margin: 0 }}>
              Chi tiết chiến dịch tiêm chủng
            </Title>
          </Space>
          <Space>
            {campaign.status === CAMPAIGN_STATUS.DRAFT && (
              <Button icon={<EditOutlined />}>Chỉnh sửa</Button>
            )}
            {campaign.status === CAMPAIGN_STATUS.PREPARING && (
              <Button type="primary" icon={<PlayCircleOutlined />}>Bắt đầu chiến dịch</Button>
            )}
            {campaign.status === CAMPAIGN_STATUS.IN_PROGRESS && (
              <Button type="primary" icon={<CheckCircleOutlined />}>Hoàn thành chiến dịch</Button>
            )}
            {campaign.status === CAMPAIGN_STATUS.DRAFT && (
              <Button type="primary" onClick={handleSchedule}>Lên lịch</Button>
            )}
            {(campaign.status === CAMPAIGN_STATUS.SCHEDULED || campaign.status === CAMPAIGN_STATUS.PREPARING) && (
              campaign.status === CAMPAIGN_STATUS.SCHEDULED ? (
                <Tooltip title="Chỉ có thể dời lịch khi chiến dịch ở trạng thái 'Đang chuẩn bị'. Vui lòng chờ 5 phút sau khi lên lịch.">
                  <Button onClick={handleReschedule} disabled>
                    Dời lịch
                  </Button>
                </Tooltip>
              ) : (
                <Button onClick={handleReschedule}>Dời lịch</Button>
              )
            )}
            {[CAMPAIGN_STATUS.DRAFT, CAMPAIGN_STATUS.SCHEDULED, CAMPAIGN_STATUS.PREPARING, CAMPAIGN_STATUS.IN_PROGRESS].includes(campaign.status) && (
              <Button danger onClick={handleCancel}>Huỷ chiến dịch</Button>
            )}
          </Space>
        </div>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={16}>
            <Descriptions column={2} bordered>
              <Descriptions.Item label="Tên chiến dịch" span={2}>{campaign.campaignName}</Descriptions.Item>
              <Descriptions.Item label="Tên vắc-xin">{campaign.vaccineName}</Descriptions.Item>
              <Descriptions.Item label="Trạng thái">{getStatusBadge(campaign.status)}</Descriptions.Item>
              <Descriptions.Item label="Ngày tiêm chủng">{campaign.vaccinationDate && dayjs(campaign.vaccinationDate).format("DD/MM/YYYY")}</Descriptions.Item>
              <Descriptions.Item label="Hạn chót đồng ý">{campaign.consentDeadline && dayjs(campaign.consentDeadline).format("DD/MM/YYYY")}</Descriptions.Item>
              <Descriptions.Item label="Khối lớp">
                {Array.isArray(campaign.targetClasses) ? campaign.targetClasses.map((cls, idx) => <Tag key={cls+idx} color="blue">{cls}</Tag>) : campaign.targetClasses}
              </Descriptions.Item>
              <Descriptions.Item label="Số lượng học sinh dự kiến">{campaign.expectedStudentCount}</Descriptions.Item>
              <Descriptions.Item label="Người tạo">{campaign.createdByName}</Descriptions.Item>
              <Descriptions.Item label="Ngày tạo">{campaign.createdAt && dayjs(campaign.createdAt).format("DD/MM/YYYY HH:mm")}</Descriptions.Item>
              <Descriptions.Item label="Ghi chú" span={2}>{campaign.note}</Descriptions.Item>
            </Descriptions>
          </Col>
          <Col xs={24} md={8}>
            <Card title="Thống kê" size="small">
              <Space direction="vertical" style={{ width: "100%" }}>
                <Statistic title="Tổng học sinh" value={campaign.totalStudents || 0} prefix={<TeamOutlined />} />
                <Statistic title="Đã đồng ý" value={campaign.approvedConsents || 0} valueStyle={{ color: "#3f8600" }} />
                <Statistic title="Từ chối" value={campaign.declinedConsents || 0} valueStyle={{ color: "#cf1322" }} />
                <Statistic title="Chưa phản hồi" value={campaign.totalStudents - (campaign.approvedConsents + campaign.declinedConsents)} valueStyle={{ color: "#faad14" }} />
              </Space>
            </Card>
          </Col>
        </Row>
      </Card>
      <Card title={<Space><FileTextOutlined />Danh sách phiếu đồng ý</Space>} style={{ marginTop: 16 }}>
        <VaccinationConsentList 
          campaignId={campaignId} 
          onConsentClick={consent => console.log('Consent clicked:', consent)} 
        />
      </Card>
      <Modal
        open={rescheduleModalOpen}
        title="Dời lịch chiến dịch"
        onCancel={() => setRescheduleModalOpen(false)}
        onOk={submitReschedule}
        okText="Xác nhận"
        cancelText="Huỷ"
        destroyOnHidden
      >
        <Form form={rescheduleForm} layout="vertical">
          <Form.Item name="newDate" label="Ngày mới" rules={[{ required: true, message: "Chọn ngày mới" }]}> 
            <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="reason" label="Lý do dời lịch" rules={[{ required: true, message: "Nhập lý do" }]}> 
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        open={cancelModalOpen}
        title="Huỷ chiến dịch"
        onCancel={() => setCancelModalOpen(false)}
        onOk={submitCancel}
        okText="Xác nhận"
        cancelText="Huỷ"
        destroyOnHidden
      >
        <Form form={cancelForm} layout="vertical">
          <Form.Item name="reason" label="Lý do huỷ" rules={[{ required: true, message: "Nhập lý do huỷ" }]}> 
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default VaccinationCampaignDetail; 