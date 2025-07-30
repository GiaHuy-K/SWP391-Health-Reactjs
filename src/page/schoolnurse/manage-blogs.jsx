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
  CheckCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../config/AuthContext";
import { useBlogPermissions, BlogPermissionGuard } from "../../utils/blogPermissions";
import {
  getMyBlogs,
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

dayjs.locale("vi");

const { Search } = Input;
const { Option } = Select;
const { Title, Text } = Typography;

const ManageBlogsNurse = () => {
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
  });

  const {
    enums: { categories, statuses },
    loading: enumsLoading,
  } = useBlogEnums();

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
      
      // Xử lý parameter status nếu có
      if (filters.status) {
        params.status = filters.status;
        // Thử thêm parameter khác nếu API cần
        params.blogStatus = filters.status;
      }
      Object.keys(params).forEach(key => {
        if (params[key] === "" || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });
      
      console.log("API params:", params);
      
      // Nurse chỉ xem blogs của mình
      const response = await getMyBlogs(params);
      console.log("API Response:", response);
      console.log("Blogs data:", response.content);
      
      const allBlogs = response.content || [];
      
      // Filter ở frontend nếu backend không hỗ trợ
      let filteredBlogs = allBlogs;
      
      // Filter theo status
      if (filters.status) {
        // Map English status to Vietnamese status
        const statusMapping = {
          'PRIVATE': 'Riêng tư',
          'PUBLIC': 'Công khai',
          'DRAFT': 'Bản nháp'
        };
        
        const targetStatus = statusMapping[filters.status] || filters.status;
        console.log(`Mapping filter status: ${filters.status} -> ${targetStatus}`);
        
        filteredBlogs = filteredBlogs.filter(blog => blog.status === targetStatus);
        console.log(`Filtered ${filteredBlogs.length} blogs with status: ${targetStatus}`);
      }
      
      // Filter theo category
      if (filters.category) {
        console.log(`Filtering by category: ${filters.category}`);
        filteredBlogs = filteredBlogs.filter(blog => {
          // Kiểm tra cả displayName và value của category
          const blogCategory = blog.category?.displayName || blog.category?.value || blog.category;
          const filterCategory = filters.category;
          console.log(`Blog category: ${blogCategory}, Filter category: ${filterCategory}`);
          return blogCategory === filterCategory;
        });
        console.log(`Filtered ${filteredBlogs.length} blogs with category: ${filters.category}`);
      }
      
      // Filter theo search
      if (filters.search) {
        console.log(`Filtering by search: ${filters.search}`);
        const searchTerm = filters.search.toLowerCase();
        filteredBlogs = filteredBlogs.filter(blog => {
          const title = blog.title?.toLowerCase() || '';
          const description = blog.description?.toLowerCase() || '';
          const content = blog.content?.toLowerCase() || '';
          
          const matches = title.includes(searchTerm) || 
                         description.includes(searchTerm) || 
                         content.includes(searchTerm);
          
          console.log(`Blog "${blog.title}": title="${title}", search="${searchTerm}", matches=${matches}`);
          return matches;
        });
        console.log(`Filtered ${filteredBlogs.length} blogs with search: ${filters.search}`);
      }
      
      setBlogs(filteredBlogs);
      setPagination(prev => ({
        ...prev,
        total: filteredBlogs.length,
      }));
      
      // Debug: Log status và category của từng blog
      allBlogs.forEach((blog, index) => {
        console.log(`Blog ${index + 1}:`, {
          id: blog.id,
          title: blog.title,
          status: blog.status,
          statusType: typeof blog.status,
          category: blog.category,
          categoryType: typeof blog.category
        });
      });
      
      setStats({
        total: allBlogs.length, // Tổng số blog (không filter)
        published: allBlogs.filter(b => b.status === "Công khai").length,
        draft: allBlogs.filter(b => b.status === "Riêng tư").length,
      });
    } catch (error) {
      console.error("Lỗi khi tải danh sách blog:", error);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBlog = () => {
    if (permissions.canCreateBlog()) {
    navigate("/dashboardNurse/blog/create");
    } else {
      message.error("Bạn không có quyền tạo blog!");
    }
  };

  const handleViewBlog = (blogId) => {
    navigate(`/dashboardNurse/blog/${blogId}`);
  };

  const handleEditBlog = (blogId) => {
    navigate(`/dashboardNurse/blog/edit/${blogId}`);
  };

  const handleDeleteBlog = async (blogId, blogData) => {
    if (!permissions.canDeleteBlog(blogData)) {
      message.error("Bạn không có quyền xóa blog này!");
      return;
    }
    
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

  const handleSearch = (value) => {
    console.log("Search filter changed to:", value);
    setFilters(prev => {
      const newFilters = { ...prev, search: value };
      console.log("New filters:", newFilters);
      return newFilters;
    });
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    console.log("Search input changed to:", value);
    setFilters(prev => {
      const newFilters = { ...prev, search: value };
      console.log("New filters:", newFilters);
      return newFilters;
    });
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleCategoryChange = (value) => {
    console.log("Category filter changed to:", value);
    setFilters(prev => {
      const newFilters = { ...prev, category: value };
      console.log("New filters:", newFilters);
      return newFilters;
    });
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleStatusFilter = (value) => {
    console.log("Status filter changed to:", value);
    setFilters(prev => {
      const newFilters = { ...prev, status: value };
      console.log("New filters:", newFilters);
      return newFilters;
    });
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
      render: (createdAt) => (
        <Text style={{ fontSize: 12 }}>{dayjs(createdAt).format("DD/MM/YYYY")}</Text>
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
          <BlogPermissionGuard action="delete" blogData={record} fallback={null}>
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
          </BlogPermissionGuard>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={3}>
          <FileTextOutlined style={{ marginRight: 8 }} />
          Quản lý Blog của tôi
        </Title>
        <Text type="secondary">
          Quản lý các bài viết blog bạn đã tạo. Blog sẽ được tạo với trạng thái "Riêng tư" và cần được Manager duyệt để xuất bản.
        </Text>
      </div>
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
      
      {/* Thông báo cho Nurse về việc blog cần được Admin duyệt */}
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
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={16} align="middle">
          <Col span={8}>
            <Search
              placeholder="Tìm kiếm blog..."
              allowClear
              onSearch={handleSearch}
              style={{ width: "100%" }}
              value={filters.search}
              onChange={handleSearchChange}
            />
          </Col>
          <Col span={4}>
            <Select
              placeholder="Danh mục"
              allowClear
              style={{ width: "100%" }}
              onChange={handleCategoryChange}
              loading={enumsLoading}
              value={filters.category}
            >
              {categories.map(category => (
                <Option key={category.value} value={category.displayName}>
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
              value={filters.status}
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

export default ManageBlogsNurse; 