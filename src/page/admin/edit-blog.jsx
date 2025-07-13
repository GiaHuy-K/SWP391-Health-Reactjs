import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBlogById } from "../../services/api.blog";
import { Card, Typography, Space, Tag, Alert, Spin, Button } from "antd";
import { CrownOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import BlogCreateForm from "../../components/blog/BlogCreateForm";
import { useAuth } from "../../config/AuthContext";
import { useBlogPermissions } from "../../utils/blogPermissions";

const { Title, Text } = Typography;

const AdminEditBlog = () => {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const permissions = useBlogPermissions();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const data = await getBlogById(blogId);
        setBlog(data);
      } catch (error) {
        console.error("Lỗi khi tải blog:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [blogId]);

  const handleSuccess = (updatedBlog) => {
    // Redirect to admin blog management after successful update
    window.location.href = "/dashboard/manage-blogs";
  };

  const handleBack = () => {
    navigate(`/dashboard/blog/${blogId}`);
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Text>Không tìm thấy blog</Text>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: 24 }}>
      {/* Admin Header */}
      <Card style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
          <CrownOutlined style={{ fontSize: 24, color: "#faad14", marginRight: 12 }} />
          <div style={{ flex: 1 }}>
            <Title level={3} style={{ margin: 0 }}>
              Chỉnh sửa Blog - Admin
            </Title>
            <Text type="secondary">
              Chỉnh sửa bài viết blog với quyền admin
            </Text>
          </div>
          <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
            Quay lại
          </Button>
        </div>

        {/* Admin Permissions Info */}
        <Alert
          message="Quyền Admin"
          description={
            <div>
              <p>Với vai trò Admin, bạn có các quyền sau:</p>
              <Space direction="vertical" size="small">
                <div>
                  <Tag color="green">✓ Chỉnh sửa tất cả blogs</Tag>
                  <Text type="secondary" style={{ marginLeft: 8 }}>
                    Có thể chỉnh sửa blog của bất kỳ tác giả nào
                  </Text>
                </div>
                <div>
                  <Tag color="green">✓ Upload thumbnail</Tag>
                  <Text type="secondary" style={{ marginLeft: 8 }}>
                    Có thể thay đổi hình ảnh thumbnail
                  </Text>
                </div>
                <div>
                  <Tag color="green">✓ Quản lý trạng thái</Tag>
                  <Text type="secondary" style={{ marginLeft: 8 }}>
                    Có thể thay đổi trạng thái Công khai hoặc Riêng tư
                  </Text>
                </div>
                <div>
                  <Tag color="green">✓ Xóa blog</Tag>
                  <Text type="secondary" style={{ marginLeft: 8 }}>
                    Có thể xóa blog sau khi chỉnh sửa
                  </Text>
                </div>
              </Space>
            </div>
          }
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />

        {/* Blog Info */}
        <div style={{ background: "#f6f8fa", padding: 12, borderRadius: 6 }}>
          <Text strong>Blog ID:</Text> {blog.id}
          <br />
          <Text strong>Tiêu đề hiện tại:</Text> {blog.title}
          <br />
          <Text strong>Tác giả gốc:</Text> {blog.authorName || "Không xác định"}
          <br />
          <Text strong>Trạng thái hiện tại:</Text> {blog.status}
          <br />
          <Text strong>Danh mục hiện tại:</Text> {blog.category}
        </div>
      </Card>

      {/* Blog Edit Form */}
      <Card title="Chỉnh sửa thông tin bài viết">
        <BlogCreateForm 
          mode="edit"
          initialData={blog}
          onSuccess={handleSuccess}
          showAdminFeatures={true}
        />
      </Card>
    </div>
  );
};

export default AdminEditBlog; 