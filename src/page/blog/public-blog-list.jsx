import React, { useState, useEffect } from "react";
import { Card, Row, Col, Typography, Input, Select, Space, Button } from "antd";
import { SearchOutlined, FilterOutlined, ReloadOutlined } from "@ant-design/icons";
import { getBlogs } from "../../services/api.blog";
import { useBlogPermissions } from "../../utils/blogPermissions";
import BlogList from "../../components/blog/BlogList";
import { CategoryTag, StatusTag } from "../../components/blog/EnumDisplay";
import { useBlogEnums } from "../../utils/useBlogEnums";
import HomeHeader from "../home/header/HomeHeader";

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

const PublicBlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    status: "Công khai" // Chỉ hiển thị blogs công khai
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 12,
    total: 0
  });

  const permissions = useBlogPermissions();
  const { enums: { categories, statuses }, loading: enumsLoading } = useBlogEnums();

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
        status: "Công khai", // Chỉ lấy blogs công khai
        ...filters
      };

      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === "" || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });

      const response = await getBlogs(params);
      
      // Không cần lọc thêm vì đã chỉ lấy blogs công khai từ API
      const filteredBlogs = response.content || [];
      
      setBlogs(filteredBlogs);
      setPagination(prev => ({
        ...prev,
        total: response.totalElements || 0
      }));
    } catch (error) {
      console.error("Lỗi khi tải danh sách blog:", error);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setFilters(prev => ({ ...prev, search: value }));
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleCategoryChange = (value) => {
    setFilters(prev => ({ ...prev, category: value }));
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleRefresh = () => {
    setFilters({ search: "", category: "", status: "Công khai" });
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handlePaginationChange = (page, pageSize) => {
    setPagination(prev => ({
      ...prev,
      current: page,
      pageSize: pageSize
    }));
  };

  return (
    <>
      <HomeHeader hideNavLinks={true} />
      <div style={{ padding: 24 }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <Title level={2}>Blog Sức Khỏe Học Đường</Title>
          <Text type="secondary">
            Các bài viết chia sẻ kiến thức về sức khỏe và y tế học đường
          </Text>
        </div>

        {/* Filters */}
        <Card style={{ marginBottom: 24 }}>
          <Row gutter={16} align="middle">
            <Col xs={24} md={8}>
              <Search
                placeholder="Tìm kiếm bài viết..."
                allowClear
                onSearch={handleSearch}
                style={{ width: "100%" }}
                prefix={<SearchOutlined />}
              />
            </Col>
            <Col xs={24} md={6}>
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
            <Col xs={24} md={4}>
              <Button
                icon={<ReloadOutlined />}
                onClick={handleRefresh}
                style={{ width: "100%" }}
              >
                Làm mới
              </Button>
            </Col>
          </Row>
        </Card>

        {/* Blog Grid */}
        <Row gutter={[16, 16]}>
          {blogs.map(blog => (
            <Col xs={24} sm={12} md={8} lg={6} key={blog.id}>
              <Card
                hoverable
                cover={
                  <img
                    alt={blog.title}
                    src={blog.thumbnail}
                    style={{ height: 200, objectFit: "cover" }}
                  />
                }
                actions={[
                  <Button type="link" onClick={() => window.open(`/blogs/${blog.id}`, '_blank')}>
                    Đọc thêm
                  </Button>
                ]}
              >
                <Card.Meta
                  title={
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <Text strong style={{ fontSize: 16, lineHeight: 1.4 }}>
                        {blog.title}
                      </Text>
                      <StatusTag status={{ displayName: blog.status }} />
                    </div>
                  }
                  description={
                    <div>
                      <Text type="secondary" style={{ fontSize: 12, marginBottom: 8, display: "block" }}>
                        {blog.description}
                      </Text>
                      <Space size="small" wrap style={{ marginTop: 8 }}>
                        <CategoryTag category={{ displayName: blog.category }} />
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {blog.authorName}
                        </Text>
                      </Space>
                    </div>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>

        {/* Pagination */}
        {blogs.length > 0 && (
          <div style={{ textAlign: "center", marginTop: 24 }}>
            <Button.Group>
              <Button
                disabled={pagination.current === 1}
                onClick={() => handlePaginationChange(pagination.current - 1, pagination.pageSize)}
              >
                Trước
              </Button>
              <Button disabled>
                {pagination.current} / {Math.ceil(pagination.total / pagination.pageSize)}
              </Button>
              <Button
                disabled={pagination.current >= Math.ceil(pagination.total / pagination.pageSize)}
                onClick={() => handlePaginationChange(pagination.current + 1, pagination.pageSize)}
              >
                Sau
              </Button>
            </Button.Group>
          </div>
        )}

        {/* Empty State */}
        {!loading && blogs.length === 0 && (
          <Card style={{ textAlign: "center", padding: 48 }}>
            <Title level={4} type="secondary">
              Không có bài viết nào
            </Title>
            <Text type="secondary">
              Hiện tại chưa có bài viết nào được xuất bản công khai.
            </Text>
          </Card>
        )}
      </div>
    </>
  );
};

export default PublicBlogList; 