import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBlogById } from "../../services/api.blog";
import { toast } from "react-toastify";
import { useBlogPermissions, BlogPermissionGuard } from "../../utils/blogPermissions";
import { Button, Space, Card, Typography, Tag, Divider, Row, Col, Statistic } from "antd";
import { EditOutlined, DeleteOutlined, CrownOutlined, UserOutlined, CalendarOutlined, EyeOutlined } from "@ant-design/icons";
import BlogAuthorInfo from "../../components/blog/BlogAuthorInfo";
import { useAuth } from "../../config/AuthContext";
import dayjs from "dayjs";
import "dayjs/locale/vi";

dayjs.locale("vi");

const { Title, Text, Paragraph } = Typography;

const AdminBlogDetailPage = () => {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const permissions = useBlogPermissions();
  const { user } = useAuth();
  const role = user?.role;

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const data = await getBlogById(blogId);
        setBlog(data);
      } catch (error) {
        toast.error("Không thể tải bài blog!");
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [blogId]);

  if (loading) return <div>Đang tải...</div>;
  if (!blog) return <div>Không tìm thấy bài blog.</div>;

  const handleEdit = () => {
    navigate(`/dashboard/blog/edit/${blogId}`);
  };

  const handleDelete = () => {
    // Implement delete logic
    console.log("Delete blog:", blogId);
  };

  const handleBackToList = () => {
    navigate("/dashboard/manage-blogs");
  };

  return (
    <div className="admin-blog-detail-page" style={{ maxWidth: 1200, margin: "0 auto", padding: 24 }}>
      {/* Admin Header */}
      <Card style={{ marginBottom: 24 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={3} style={{ margin: 0 }}>
              <CrownOutlined style={{ marginRight: 8, color: "#faad14" }} />
              Chi tiết Blog - Admin
            </Title>
            <Text type="secondary">Quản lý và xem chi tiết bài viết blog</Text>
          </Col>
          <Col>
            <Space>
              <Button onClick={handleBackToList}>
                Quay lại danh sách
              </Button>
              <BlogPermissionGuard action="update" blogData={blog} fallback={null}>
                <Button 
                  type="primary" 
                  icon={<EditOutlined />}
                  onClick={handleEdit}
                >
                  Chỉnh sửa
                </Button>
              </BlogPermissionGuard>
              <BlogPermissionGuard action="delete" blogData={blog} fallback={null}>
                <Button 
                  danger 
                  icon={<DeleteOutlined />}
                  onClick={handleDelete}
                >
                  Xóa
                </Button>
              </BlogPermissionGuard>
            </Space>
          </Col>
        </Row>
      </Card>



      {/* Blog Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Trạng thái"
              value={blog.status}
              valueStyle={{ 
                color: blog.status === "Công khai" ? "#52c41a" : 
                       blog.status === "Riêng tư" ? "#faad14" : "#ff4d4f" 
              }}
              prefix={<EyeOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Danh mục"
              value={blog.category}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Ngày tạo"
              value={dayjs(blog.createdAt).format("DD/MM/YYYY")}
              valueStyle={{ color: "#722ed1" }}
              prefix={<CalendarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Tác giả"
              value={blog.authorName || "Không xác định"}
              valueStyle={{ color: "#13c2c2" }}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Blog Content */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card title="Nội dung bài viết">
            <div style={{ marginBottom: 16 }}>
              <Title level={2}>{blog.title}</Title>
              <Paragraph style={{ fontSize: 16, color: "#666", fontStyle: "italic" }}>
                {blog.description}
              </Paragraph>
            </div>
            
            {blog.thumbnail && (
              <div style={{ marginBottom: 16 }}>
                <img 
                  src={blog.thumbnail} 
                  alt="Thumbnail" 
                  style={{ 
                    maxWidth: "100%", 
                    borderRadius: 8,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                  }} 
                />
              </div>
            )}
            
            <div 
              dangerouslySetInnerHTML={{ __html: blog.content }} 
              style={{ 
                background: "#fff", 
                padding: 16, 
                borderRadius: 8,
                lineHeight: 1.6
              }} 
            />
          </Card>
        </Col>
        
        <Col xs={24} lg={8}>
          <Card title="Thông tin quản lý">
            <BlogAuthorInfo blog={blog} showActions={true} />
            
            <Divider />
            
            <div style={{ marginBottom: 16 }}>
              <Text strong>Thông tin chi tiết:</Text>
              <div style={{ marginTop: 8 }}>
                <div style={{ marginBottom: 8 }}>
                  <Text type="secondary">ID Blog:</Text>
                  <br />
                  <Text code>{blog.id}</Text>
                </div>
                <div style={{ marginBottom: 8 }}>
                  <Text type="secondary">Author ID:</Text>
                  <br />
                  <Text code>{blog.authorId}</Text>
                </div>
                <div style={{ marginBottom: 8 }}>
                  <Text type="secondary">Ngày tạo:</Text>
                  <br />
                  <Text>{dayjs(blog.createdAt).format("DD/MM/YYYY HH:mm")}</Text>
                </div>
                {blog.updatedAt && (
                  <div style={{ marginBottom: 8 }}>
                    <Text type="secondary">Ngày cập nhật:</Text>
                    <br />
                    <Text>{dayjs(blog.updatedAt).format("DD/MM/YYYY HH:mm")}</Text>
                  </div>
                )}
              </div>
            </div>
            
            <Divider />
            
            <div>
              <Text strong>Quyền Admin:</Text>
              <div style={{ marginTop: 8 }}>
                <div style={{ marginBottom: 4 }}>
                  <Tag color="green">✓ Xem tất cả blogs</Tag>
                </div>
                <div style={{ marginBottom: 4 }}>
                  <Tag color="green">✓ Chỉnh sửa blog</Tag>
                </div>
                <div style={{ marginBottom: 4 }}>
                  <Tag color="green">✓ Xóa blog</Tag>
                </div>
                <div style={{ marginBottom: 4 }}>
                  <Tag color="green">✓ Cập nhật trạng thái</Tag>
                </div>
                <div style={{ marginBottom: 4 }}>
                  <Tag color="green">✓ Tạo blog mới</Tag>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminBlogDetailPage; 