import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  Input,
  Select,
  Modal,
  Form,
  message,
  Popconfirm,
  Tag,
  Typography,
  Card,
  Row,
  Col,
  Statistic,
  Tooltip,
  Image,
  Badge,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
  ReloadOutlined,
  FileTextOutlined,
  UserOutlined,
  CalendarOutlined,
  EyeInvisibleOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CrownOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
  getBlogs,
  deleteBlog,
  getBlogCategories,
  getBlogStatuses,
} from "../../services/api.blog";
import { useBlogEnums } from "../../utils/useBlogEnums";
import { CategoryTag, StatusTag } from "../../components/blog/EnumDisplay";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { useAuth } from "../../config/AuthContext";
import { useBlogPermissions, BlogPermissionGuard } from "../../utils/blogPermissions";

dayjs.locale("vi");

const { Search } = Input;
const { Option } = Select;
const { Title, Text, Paragraph } = Typography;

const AdminManageBlogs = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const permissions = useBlogPermissions();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    status: "",
  });
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
    pending: 0,
  });

  // Sử dụng hook enum
  const { 
    enums: { categories, statuses }, 
    loading: enumsLoading,
    getStatusLabel,
    getCategoryLabel,
    getStatusColor,
    getCategoryColor,
  } = useBlogEnums();

  // Load data
  useEffect(() => {
    fetchBlogs();
  }, [filters, pagination.current, pagination.pageSize]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.current - 1,
        size: pagination.pageSize,
        sort: "createdAt,DESC",
        ...filters,
      };

      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === "" || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });

      const response = await getBlogs(params);
      setBlogs(response.content || []);
      setPagination(prev => ({
        ...prev,
        total: response.totalElements || 0,
      }));

      // Calculate stats
      const allBlogs = response.content || [];
      setStats({
        total: allBlogs.length,
        published: allBlogs.filter(b => b.status === "Công khai").length,
        draft: allBlogs.filter(b => b.status === "Riêng tư").length,
        pending: allBlogs.filter(b => b.status === "Chờ duyệt").length,
      });
    } catch (error) {
      console.error("Lỗi khi tải danh sách blog:", error);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle actions
  const handleCreateBlog = () => {
    if (permissions.canCreateBlog()) {
      navigate("/dashboard/blog/create");
    } else {
      message.error("Bạn không có quyền tạo blog!");
    }
  };

  const handleViewBlog = (blogId) => {
    navigate(`/dashboard/blog/${blogId}`);
  };

  const handleEditBlog = (blogId) => {
    navigate(`/dashboard/blog/edit/${blogId}`);
  };

  const handleDeleteBlog = async (blogId, blog) => {
    try {
      await deleteBlog(blogId);
      message.success("Xóa blog thành công!");
      fetchBlogs();
    } catch (error) {
      message.error("Lỗi khi xóa blog!");
      console.error("Lỗi xóa blog:", error);
    }
  };



  const handleSearch = (value) => {
    setFilters(prev => ({ ...prev, search: value }));
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleRefresh = () => {
    fetchBlogs();
  };

  const columns = [
    {
      title: "Thumbnail",
      key: "thumbnail",
      width: 80,
      render: (_, record) => (
        <Image
          src={record.thumbnail}
          alt="Thumbnail"
          width={60}
          height={40}
          style={{ objectFit: "cover", borderRadius: 4 }}
          fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
        />
      ),
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 500, marginBottom: 4 }}>
            {text}
          </div>
          <div style={{ fontSize: 12, color: "#666" }}>
            <UserOutlined style={{ marginRight: 4 }} />
            {record.authorName || "Không xác định"}
          </div>
        </div>
      ),
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
      width: 120,
      render: (category) => <CategoryTag category={category} />,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => <StatusTag status={status} />,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      render: (date) => (
        <div>
          <CalendarOutlined style={{ marginRight: 4 }} />
          {dayjs(date).format("DD/MM/YYYY")}
        </div>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 250,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => handleViewBlog(record.id)}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleEditBlog(record.id)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              title="Bạn có chắc muốn xóa blog này?"
              description="Hành động này không thể hoàn tác."
              onConfirm={() => handleDeleteBlog(record.id, record)}
              okText="Xóa"
              cancelText="Hủy"
              okType="danger"
            >
              <Button
                type="text"
                icon={<DeleteOutlined />}
                size="small"
                danger
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Title level={3}>
          <CrownOutlined style={{ marginRight: 8, color: "#faad14" }} />
          Quản lý Blog - Admin
        </Title>
        <Text type="secondary">
          Quản lý toàn bộ bài viết blog trong hệ thống với quyền admin. Blog sẽ được tạo với trạng thái "Riêng tư" và cần được Manager duyệt để xuất bản.
        </Text>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Tổng số blog"
              value={stats.total}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Đã xuất bản"
              value={stats.published}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Riêng tư"
              value={stats.draft}
              prefix={<EyeInvisibleOutlined />}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Chờ duyệt"
              value={stats.pending}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: "#ff4d4f" }}
            />
          </Card>
        </Col>
      </Row>
      
      {/* Thông báo cho Admin về việc blog cần được Manager duyệt */}
      {stats.draft > 0 && (
        <Card style={{ marginBottom: 16, background: "#e6f7ff", border: "1px solid #91d5ff" }}>
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "8px",
            color: "#1890ff",
            fontSize: "14px"
          }}>
            <span style={{ fontSize: "16px" }}>ℹ️</span>
            <span>
              Có <strong>{stats.draft}</strong> blog đang ở trạng thái "Riêng tư". 
              Blog sẽ được Manager duyệt để chuyển thành "Công khai".
            </span>
          </div>
        </Card>
      )}

      {/* Filters */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={8}>
            <Search
              placeholder="Tìm kiếm theo tiêu đề..."
              onSearch={handleSearch}
              style={{ width: "100%" }}
            />
          </Col>
          <Col xs={12} sm={4}>
            <Select
              placeholder="Danh mục"
              style={{ width: "100%" }}
              allowClear
              value={filters.category}
              onChange={(value) => handleFilterChange("category", value)}
            >
              {categories?.map(cat => (
                <Option key={cat} value={cat}>{getCategoryLabel(cat)}</Option>
              ))}
            </Select>
          </Col>
          <Col xs={12} sm={4}>
            <Select
              placeholder="Trạng thái"
              style={{ width: "100%" }}
              allowClear
              value={filters.status}
              onChange={(value) => handleFilterChange("status", value)}
            >
              {statuses?.map(status => (
                <Option key={status} value={status}>{getStatusLabel(status)}</Option>
              ))}
            </Select>
          </Col>
          <Col xs={12} sm={4}>
            <Button
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
              style={{ width: "100%" }}
            >
              Làm mới
            </Button>
          </Col>
          <Col xs={12} sm={4}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreateBlog}
              style={{ width: "100%" }}
            >
              Tạo Blog
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Blog Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={blogs}
          rowKey="id"
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} blog`,
            onChange: (page, pageSize) => {
                setPagination(prev => ({
                  ...prev,
                  current: page,
                  pageSize: pageSize,
                }));
            },
          }}
        />
      </Card>
    </div>
  );
};

export default AdminManageBlogs; 