import React, { useState, useEffect } from "react";
import { Card, List, Avatar, Tag, Space, Button, Typography, Empty } from "antd";
import { 
  EyeOutlined, 
  EditOutlined, 
  DeleteOutlined,
  CalendarOutlined,
  UserOutlined,
  FileTextOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useBlogPermissions, BlogPermissionGuard } from "../../utils/blogPermissions";
import { getBlogs, getMyBlogs } from "../../services/api.blog";
import { CategoryTag, StatusTag } from "./EnumDisplay";
import dayjs from "dayjs";

const { Title, Text, Paragraph } = Typography;

const BlogList = ({ 
  mode = "all", // "all" hoặc "my"
  showActions = true,
  maxItems = 10,
  onBlogClick,
  showEmptyMessage = true
}) => {
  const navigate = useNavigate();
  const permissions = useBlogPermissions();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, [mode]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      let response;
      if (mode === "my") {
        if (!permissions.canViewMyBlogs()) {
          setBlogs([]);
          return;
        }
        response = await getMyBlogs({ size: maxItems });
      } else {
        // mode === 'all' (HomePage hoặc public)
        response = await getBlogs({ size: maxItems, status: "Công khai" }); // chỉ lấy blog công khai
      }
      
      // Lọc blogs theo permission
      const filteredBlogs = response.content?.filter(blog => 
        blog.status === "Công khai"
      ) || [];
      
      setBlogs(filteredBlogs);
    } catch (error) {
      console.error("Lỗi khi tải danh sách blog:", error);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewBlog = (blog) => {
    console.log('Blog id:', blog.id, blog);
    if (!blog.id) {
      alert('Bài viết này không có id hợp lệ!');
      return;
    }
    navigate(`/blogs/${blog.id}`);
  };

  const handleEditBlog = (blog) => {
    if (!permissions.canUpdateBlog(blog)) {
      return;
    }
    navigate(`/dashboardManager/blog/edit/${blog.id}`);
  };

  const handleDeleteBlog = (blog) => {
    if (!permissions.canDeleteBlog(blog)) {
      return;
    }
    // Implement delete logic
    console.log("Delete blog:", blog.id);
  };

  const renderBlogActions = (blog) => (
    <Space size="small">
      <BlogPermissionGuard action="view" blogData={blog} fallback={null}>
        <Button
          type="text"
          icon={<EyeOutlined />}
          size="small"
          onClick={() => handleViewBlog(blog)}
        >
          Xem
        </Button>
      </BlogPermissionGuard>
      
      <BlogPermissionGuard action="update" blogData={blog} fallback={null}>
        <Button
          type="text"
          icon={<EditOutlined />}
          size="small"
          onClick={() => handleEditBlog(blog)}
        >
          Sửa
        </Button>
      </BlogPermissionGuard>
      
      <BlogPermissionGuard action="delete" blogData={blog} fallback={null}>
        <Button
          type="text"
          icon={<DeleteOutlined />}
          size="small"
          danger
          onClick={() => handleDeleteBlog(blog)}
        >
          Xóa
        </Button>
      </BlogPermissionGuard>
    </Space>
  );

  const renderBlogItem = (blog) => (
    <List.Item
      key={blog.id}
      actions={showActions ? [renderBlogActions(blog)] : []}
    >
      <List.Item.Meta
        avatar={
          <Avatar 
            size={64} 
            src={blog.thumbnail}
            icon={<FileTextOutlined />}
            style={{ borderRadius: 8 }}
          />
        }
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Title level={4} style={{ margin: 0, cursor: "pointer" }} onClick={() => handleViewBlog(blog)}>
              {blog.title}
            </Title>
            <StatusTag status={{ displayName: blog.status }} />
          </div>
        }
        description={
          <div>
            <Paragraph ellipsis={{ rows: 2 }} style={{ marginBottom: 8 }}>
              {blog.description}
            </Paragraph>
            <Space size="small" wrap>
              <CategoryTag category={{ displayName: blog.category }} />
              <Text type="secondary">
                <UserOutlined /> {blog.authorName}
              </Text>
              <Text type="secondary">
                <CalendarOutlined /> {dayjs(blog.createdAt).format("DD/MM/YYYY")}
              </Text>
            </Space>
          </div>
        }
      />
    </List.Item>
  );

  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (blogs.length === 0) {
    if (showEmptyMessage) {
      return (
        <Empty
          description={
            mode === "my" 
              ? "Bạn chưa có bài blog nào" 
              : "Không có bài blog nào"
          }
        />
      );
    }
    return null;
  }

  return (
    <List
      dataSource={blogs}
      renderItem={renderBlogItem}
      pagination={blogs.length > maxItems ? {
        pageSize: maxItems,
        showSizeChanger: false,
        showQuickJumper: false,
        showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} bài viết`
      } : false}
    />
  );
};

export default BlogList; 