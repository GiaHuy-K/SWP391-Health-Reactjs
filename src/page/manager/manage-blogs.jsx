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
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
  getBlogs,
  deleteBlog,
  getBlogCategories,
  getBlogStatuses,
  updateBlogStatus,
} from "../../services/api.blog";
import { useBlogEnums } from "../../utils/useBlogEnums";
import { CategoryTag, StatusTag } from "../../components/blog/EnumDisplay";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { useAuth } from "../../config/AuthContext";

dayjs.locale("vi");

const { Search } = Input;
const { Option } = Select;
const { Title, Text, Paragraph } = Typography;

const ManageBlogs = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
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
        published: allBlogs.filter(b => b.status === "published").length,
        draft: allBlogs.filter(b => b.status === "draft").length,
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
    navigate("/dashboardManager/blog/create");
  };

  const handleViewBlog = (blogId) => {
    navigate(`/dashboardManager/blog/${blogId}`);
  };

  const handleEditBlog = (blogId) => {
    navigate(`/dashboardManager/blog/edit/${blogId}`);
  };

  const handleDeleteBlog = async (blogId) => {
    try {
      await deleteBlog(blogId);
      message.success("Xóa blog thành công");
      fetchBlogs();
    } catch (error) {
      console.error("Lỗi khi xóa blog:", error);
    }
  };

  const handleStatusChange = async (blogId, newStatus) => {
    try {
      await updateBlogStatus(blogId, newStatus);
      message.success("Cập nhật trạng thái thành công");
      fetchBlogs();
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
    }
  };

  // Handle filters
  const handleSearch = (value) => {
    setFilters(prev => ({ ...prev, search: value }));
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleCategoryChange = (value) => {
    setFilters(prev => ({ ...prev, category: value }));
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleStatusFilter = (value) => {
    setFilters(prev => ({ ...prev, status: value }));
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleRefresh = () => {
    setFilters({
      search: "",
      category: "",
      status: "",
    });
    setPagination(prev => ({ ...prev, current: 1 }));
  };



  // Table columns
  const columns = [
    {
      title: "Thumbnail",
      dataIndex: "thumbnail",
      key: "thumbnail",
      width: 80,
      render: (thumbnail) => (
        <Image
          width={60}
          height={40}
          src={thumbnail || "https://via.placeholder.com/60x40?text=No+Image"}
          alt="Blog thumbnail"
          style={{ objectFit: "cover", borderRadius: 4 }}
          fallback="https://via.placeholder.com/60x40?text=Error"
        />
      ),
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      render: (title, record) => (
        <div>
          <div style={{ fontWeight: 500, marginBottom: 4 }}>{title}</div>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.summary?.substring(0, 50)}...
          </Text>
        </div>
      ),
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
      width: 120,
      render: (category) => {
        const catObj = categories.find(c => c.value === category || c.displayName === category);
        return <CategoryTag category={catObj || { displayName: category }} />;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => {
        const statusObj = statuses.find(s => s.value === status || s.displayName === status);
        return <StatusTag status={statusObj || { displayName: status }} />;
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      render: (createdAt) => (
        <Text style={{ fontSize: 12 }}>
          {dayjs(createdAt).format("DD/MM/YYYY")}
        </Text>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 200,
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
          {user?.role === "Quản lý Nhân sự/Nhân viên" && record.status === "Riêng tư" && (
            <Tooltip title="Duyệt bài (Công khai)">
              <Button
                type="text"
                icon={<CheckCircleOutlined />}
                size="small"
                onClick={() => handleStatusChange(record.id, "Công khai")}
              />
            </Tooltip>
          )}
          <Tooltip title="Xóa">
            <Popconfirm
              title="Bạn có chắc muốn xóa blog này?"
              description="Hành động này không thể hoàn tác."
              onConfirm={() => handleDeleteBlog(record.id)}
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
          <FileTextOutlined style={{ marginRight: 8 }} />
          Quản lý Blog
        </Title>
        <Text type="secondary">
          Quản lý các bài viết blog về sức khỏe học đường
        </Text>
      </div>

      {/* Statistics Cards */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Tổng số blog"
              value={stats.total}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Đã xuất bản"
              value={stats.published}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Bản nháp"
              value={stats.draft}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={16} align="middle">
          <Col span={8}>
            <Search
              placeholder="Tìm kiếm blog..."
              allowClear
              onSearch={handleSearch}
              style={{ width: "100%" }}
            />
          </Col>
          <Col span={4}>
            <Select
              placeholder="Danh mục"
              allowClear
              style={{ width: "100%" }}
              onChange={handleCategoryChange}
              loading={enumsLoading}
            >
              {categories.map(category => (
                <Option key={category.value} value={category.value}>
                  <CategoryTag category={category} showIcon={false} />
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={4}>
            <Select
              placeholder="Trạng thái"
              allowClear
              style={{ width: "100%" }}
              onChange={handleStatusFilter}
              loading={enumsLoading}
            >
              {statuses.map(status => (
                <Option key={status.value} value={status.value}>
                  <StatusTag status={status} showIcon={false} />
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={4}>
            <Button
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
              style={{ width: "100%" }}
            >
              Làm mới
            </Button>
          </Col>
          <Col span={4}>
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

export default ManageBlogs;