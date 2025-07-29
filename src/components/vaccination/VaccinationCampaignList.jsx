import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  Card,
  Input,
  Select,
  DatePicker,
  Button,
  Space,
  Tag,
  Tooltip,
  Row,
  Col,
  Spin,
  Empty,
  Typography,
  Badge
} from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  PlayCircleOutlined,
  CheckCircleOutlined,
  CalendarOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";
import { getVaccinationCampaigns, CAMPAIGN_STATUS_OPTIONS, CLASS_GROUP_OPTIONS } from "../../services/api.vaccination";

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

const VaccinationCampaignList = ({ onViewDetail, onCreateNew, onEdit }) => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} chiến dịch`,
  });

  // Filters state
  const [filters, setFilters] = useState({
    campaignName: "",
    vaccineName: "",
    status: null,
    dateRange: null,
    classGroup: null,
  });

  // Fetch campaigns data
  const fetchCampaigns = async (page = 0, size = 10) => {
    setLoading(true);
    try {
      // Build query parameters
      const params = {
        page,
        size,
        sort: "createdAt,ASC",
        ...(filters.campaignName && { campaignName: filters.campaignName }),
        ...(filters.vaccineName && { vaccineName: filters.vaccineName }),
        ...(filters.status && { status: filters.status }),
        ...(filters.classGroup && { targetClassGroup: filters.classGroup }),
        ...(filters.dateRange && filters.dateRange[0] && {
          vaccinationDate: filters.dateRange[0].format("YYYY-MM-DD"),
        }),
        ...(filters.dateRange && filters.dateRange[1] && {
          vaccinationDate: filters.dateRange[1].format("YYYY-MM-DD"),
        }),
      };

      const response = await getVaccinationCampaigns(params);
      
      setCampaigns(response.content || []);
      setPagination(prev => ({
        ...prev,
        current: page + 1,
        total: response.totalElements || 0,
        pageSize: size,
      }));
    } catch (error) {
      console.error("Lỗi khi tải danh sách chiến dịch:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchCampaigns();
  }, []);

  // Handle pagination change
  const handleTableChange = (paginationInfo) => {
    const { current, pageSize } = paginationInfo;
    fetchCampaigns(current - 1, pageSize);
  };

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  // Apply filters
  const handleApplyFilters = () => {
    fetchCampaigns(0, pagination.pageSize);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setFilters({
      campaignName: "",
      vaccineName: "",
      status: null,
      dateRange: null,
      classGroup: null,
    });
    fetchCampaigns(0, pagination.pageSize);
  };

  // Get status color
  const getStatusColor = (status) => {
    const statusColors = {
      "Nháp": "default",
      "Đã lên lịch": "processing",
      "Đang chuẩn bị": "warning",
      "Đang diễn ra": "processing",
      "Đã hoàn thành": "success",
      "Đã hủy": "error",
    };
    return statusColors[status] || "default";
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusConfig = {
      "Nháp": { color: "#d9d9d9", text: "Nháp" },
      "Đã lên lịch": { color: "#1890ff", text: "Đã lên lịch" },
      "Đang chuẩn bị": { color: "#faad14", text: "Đang chuẩn bị" },
      "Đang diễn ra": { color: "#52c41a", text: "Đang diễn ra" },
      "Đã hoàn thành": { color: "#52c41a", text: "Đã hoàn thành" },
      "Đã hủy": { color: "#ff4d4f", text: "Đã hủy" },
    };
    
    const config = statusConfig[status] || { color: "#d9d9d9", text: status };
    return <Badge color={config.color} text={config.text} />;
  };

  // Table columns
  const columns = [
    {
      title: "Tên chiến dịch",
      dataIndex: "campaignName",
      key: "campaignName",
      width: 200,
      render: (text, record) => (
        <div>
          <div 
            style={{ fontWeight: 500, color: "#1890ff", cursor: "pointer" }}
            onClick={() => navigate(`/dashboardManager/vaccination-campaigns/${record.campaignId}`)}
          >
            {text}
          </div>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            {record.vaccineName}
          </Text>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => getStatusBadge(status),
    },
    {
      title: "Nhóm lớp",
      dataIndex: "targetClassGroup",
      key: "targetClassGroup",
      width: 100,
      render: (targetClassGroup) => (
        targetClassGroup ? <Tag color="blue">{targetClassGroup}</Tag> : "-"
      ),
    },
    {
      title: "Thời gian",
      dataIndex: "vaccinationDate",
      key: "vaccinationDate",
      width: 150,
      render: (vaccinationDate, record) => (
        <div>
          <div>
            <CalendarOutlined style={{ marginRight: 4 }} />
            {vaccinationDate ? dayjs(vaccinationDate).format("DD/MM/YYYY") : "Chưa có"}
          </div>
          {record.consentDeadline && (
            <Text type="secondary" style={{ fontSize: "12px" }}>
              Hạn chót xác nhận: {dayjs(record.consentDeadline).format("DD/MM/YYYY")}
            </Text>
          )}
        </div>
      ),
    },
    {
      title: "Người tổ chức",
      dataIndex: "organizedByUserName",
      key: "organizedByUserName",
      width: 150,
    },
    {
      title: "Số lượng học sinh",
      dataIndex: "totalStudents",
      key: "totalStudents",
      width: 120,
      render: (total) => (
        <Tag color="green">{total || 0} học sinh</Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => onViewDetail?.(record)}
              size="small"
            />
          </Tooltip>
          
          {record.status === "Nháp" && (
            <Tooltip title="Chỉnh sửa">
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => onEdit?.(record)}
                size="small"
              />
            </Tooltip>
          )}
          
          {record.status === "Đang chuẩn bị" && (
            <Tooltip title="Bắt đầu chiến dịch">
              <Button
                type="text"
                icon={<PlayCircleOutlined />}
                onClick={() => onViewDetail?.(record)}
                size="small"
                style={{ color: "#52c41a" }}
              />
            </Tooltip>
          )}
          
          {record.status === "Đang diễn ra" && (
            <Tooltip title="Hoàn thành chiến dịch">
              <Button
                type="text"
                icon={<CheckCircleOutlined />}
                onClick={() => onViewDetail?.(record)}
                size="small"
                style={{ color: "#52c41a" }}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Card
      title={
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Title level={4} style={{ margin: 0 }}>
            Danh sách chiến dịch tiêm chủng
          </Title>
          <Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => fetchCampaigns(0, pagination.pageSize)}
              loading={loading}
            >
              Làm mới
            </Button>
            {onCreateNew && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={onCreateNew}
              >
                Tạo chiến dịch mới
              </Button>
            )}
          </Space>
        </div>
      }
      styles={{ body: { padding: "12px 16px" } }}
    >
      {/* Filters */}
      <Card
        size="small"
        style={{ marginBottom: 16 }}
        styles={{ body: { padding: "12px 16px" } }}
      >
        <Row gutter={[16, 8]}>
          <Col xs={24} sm={12} md={6}>
            <Search
              placeholder="Tìm theo tên chiến dịch"
              value={filters.campaignName}
              onChange={(e) => handleFilterChange("campaignName", e.target.value)}
              onPressEnter={handleApplyFilters}
              allowClear
            />
          </Col>
          
          <Col xs={24} sm={12} md={6}>
            <Search
              placeholder="Tìm theo tên vaccine"
              value={filters.vaccineName}
              onChange={(e) => handleFilterChange("vaccineName", e.target.value)}
              onPressEnter={handleApplyFilters}
              allowClear
            />
          </Col>
          
          <Col xs={24} sm={12} md={4}>
            <Select
              placeholder="Trạng thái"
              value={filters.status}
              onChange={(value) => handleFilterChange("status", value)}
              allowClear
              style={{ width: "100%" }}
            >
              {CAMPAIGN_STATUS_OPTIONS.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Col>
          
          <Col xs={24} sm={12} md={4}>
            <Select
              placeholder="Nhóm lớp"
              value={filters.classGroup}
              onChange={(value) => handleFilterChange("classGroup", value)}
              allowClear
              style={{ width: "100%" }}
            >
              {CLASS_GROUP_OPTIONS.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Col>
          
          <Col xs={24} sm={12} md={4}>
            <RangePicker
              placeholder={["Từ ngày tiêm", "Đến ngày tiêm"]}
              value={filters.dateRange}
              onChange={(dates) => handleFilterChange("dateRange", dates)}
              format="DD/MM/YYYY"
              style={{ width: "100%" }}
            />
          </Col>
        </Row>
        
        <Row style={{ marginTop: 12 }}>
          <Col>
            <Space>
              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={handleApplyFilters}
              >
                Tìm kiếm
              </Button>
              <Button onClick={handleClearFilters}>
                Xóa bộ lọc
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={campaigns}
        rowKey="campaignId"
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
        locale={{
          emptyText: (
            <Empty
              description="Không có chiến dịch tiêm chủng nào"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ),
        }}
        scroll={{ x: 1000 }}
      />
    </Card>
  );
};

export default VaccinationCampaignList; 