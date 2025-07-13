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
  Avatar
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
  CAMPAIGN_STATUS 
} from "../../services/api.vaccination";

const { Title, Text, Paragraph } = Typography;

const VaccinationCampaignDetail = () => {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [consents, setConsents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCampaignDetail = async () => {
      if (!campaignId) return;
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
  }, [campaignId]);

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
          </Space>
        </div>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={16}>
            <Descriptions column={2} bordered>
              <Descriptions.Item label="Tên chiến dịch" span={2}>{campaign.campaignName}</Descriptions.Item>
              <Descriptions.Item label="Tên vắc-xin">{campaign.vaccineName}</Descriptions.Item>
              <Descriptions.Item label="Trạng thái">{getStatusBadge(campaign.status)}</Descriptions.Item>
              <Descriptions.Item label="Ngày tiêm chủng">
                {campaign.vaccinationDate && dayjs(campaign.vaccinationDate).format("DD/MM/YYYY")}
              </Descriptions.Item>
              <Descriptions.Item label="Hạn chót đồng ý">
                {campaign.consentDeadline && dayjs(campaign.consentDeadline).format("DD/MM/YYYY")}
              </Descriptions.Item>
              <Descriptions.Item label="Khối lớp">
                <Tag color="blue">{campaign.targetClassGroup}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Ghi chú" span={2}>
                {campaign.notes || <Text type="secondary">Không có</Text>}
              </Descriptions.Item>
              <Descriptions.Item label="Người tổ chức">
                <Space>
                  <Avatar icon={<UserOutlined />} size="small" />
                  {campaign.organizedByUserName}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Đơn vị y tế">
                <Space>
                  <InfoCircleOutlined />
                  {campaign.healthcareProviderName || <Text type="secondary">Không có</Text>}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Liên hệ y tế">
                <Space>
                  <PhoneOutlined />
                  {campaign.healthcareProviderContact || <Text type="secondary">Không có</Text>}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Tổng học sinh">{campaign.totalStudents}</Descriptions.Item>
              <Descriptions.Item label="Đã đồng ý" style={{ color: '#3f8600' }}>{campaign.approvedConsents}</Descriptions.Item>
              <Descriptions.Item label="Từ chối" style={{ color: '#cf1322' }}>{campaign.declinedConsents}</Descriptions.Item>
              <Descriptions.Item label="Ngày tạo">
                {dayjs(campaign.createdAt).format("DD/MM/YYYY HH:mm")}
              </Descriptions.Item>
              <Descriptions.Item label="Cập nhật">
                {dayjs(campaign.updatedAt).format("DD/MM/YYYY HH:mm")}
              </Descriptions.Item>
              <Descriptions.Item label="Người cập nhật">
                {campaign.updatedByUserName}
              </Descriptions.Item>
              {campaign.rescheduledAt && (
                <>
                  <Descriptions.Item label="Dời lịch">
                    {dayjs(campaign.rescheduledAt).format("DD/MM/YYYY HH:mm")}
                  </Descriptions.Item>
                  <Descriptions.Item label="Người dời lịch">
                    {campaign.rescheduledByUserName}
                  </Descriptions.Item>
                </>
              )}
              <Descriptions.Item label="Mô tả" span={2}>
                <Paragraph>{campaign.description || <Text type="secondary">Không có</Text>}</Paragraph>
              </Descriptions.Item>
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
      <Card title={<Space><FileTextOutlined />Danh sách phiếu đồng ý ({consents.length})</Space>} style={{ marginTop: 16 }}>
        {consents.length > 0 ? (
          <List
            dataSource={consents}
            renderItem={(consent) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar icon={<UserOutlined />} />}
                  title={consent.studentName}
                  description={`${consent.studentClass} - ${consent.parentName}`}
                />
                <Space>
                  <Tag color={
                    consent.status === "Đồng ý" ? "green" :
                    consent.status === "Từ chối" ? "red" : "orange"
                  }>
                    {consent.status}
                  </Tag>
                  {consent.responseDate && (
                    <Text type="secondary">
                      {dayjs(consent.responseDate).format("DD/MM/YYYY")}
                    </Text>
                  )}
                </Space>
              </List.Item>
            )}
          />
        ) : (
          <Alert
            message="Chưa có phiếu đồng ý"
            description="Chưa có học sinh nào đăng ký tham gia chiến dịch này"
            type="info"
            showIcon
          />
        )}
      </Card>
    </div>
  );
};

export default VaccinationCampaignDetail; 