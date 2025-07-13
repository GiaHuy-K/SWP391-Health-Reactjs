import React from "react";
import { Card, Typography, Space, Tag, Alert } from "antd";
import { CrownOutlined, PlusOutlined } from "@ant-design/icons";
import BlogCreateForm from "../../components/blog/BlogCreateForm";
import { useAuth } from "../../config/AuthContext";
import { useBlogPermissions } from "../../utils/blogPermissions";

const { Title, Text } = Typography;

const AdminCreateBlog = () => {
  const { user } = useAuth();
  const permissions = useBlogPermissions();

  const handleSuccess = (createdBlog) => {
    // Redirect to admin blog management after successful creation
    window.location.href = "/dashboard/manage-blogs";
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: 24 }}>
      {/* Admin Header */}
      <Card style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
          <CrownOutlined style={{ fontSize: 24, color: "#faad14", marginRight: 12 }} />
          <div>
            <Title level={3} style={{ margin: 0 }}>
              Tạo Blog Mới - Admin
            </Title>
            <Text type="secondary">
              Tạo bài viết blog mới với quyền admin
            </Text>
          </div>
        </div>

        {/* Admin Permissions Info */}
        <Alert
          message="Quyền Admin"
          description={
            <div>
              <p>Với vai trò Admin, bạn có các quyền sau:</p>
              <Space direction="vertical" size="small">
                <div>
                  <Tag color="green">✓ Tạo blog mới</Tag>
                  <Text type="secondary" style={{ marginLeft: 8 }}>
                    Có thể tạo blog với bất kỳ danh mục nào
                  </Text>
                </div>
                <div>
                  <Tag color="green">✓ Upload thumbnail</Tag>
                  <Text type="secondary" style={{ marginLeft: 8 }}>
                    Có thể upload hình ảnh thumbnail
                  </Text>
                </div>
                <div>
                  <Tag color="green">✓ Quản lý trạng thái</Tag>
                  <Text type="secondary" style={{ marginLeft: 8 }}>
                    Có thể đặt trạng thái Công khai hoặc Riêng tư
                  </Text>
                </div>
                <div>
                  <Tag color="green">✓ Chỉnh sửa sau khi tạo</Tag>
                  <Text type="secondary" style={{ marginLeft: 8 }}>
                    Có thể chỉnh sửa blog sau khi tạo
                  </Text>
                </div>
              </Space>
            </div>
          }
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />

        {/* User Info */}
        <div style={{ background: "#f6f8fa", padding: 12, borderRadius: 6 }}>
          <Text strong>Tác giả:</Text> {user?.fullName || "Admin"}
          <br />
          <Text strong>Vai trò:</Text> {user?.role || "Quản trị viên Trường học"}
          <br />
          <Text strong>User ID:</Text> {user?.id || "N/A"}
        </div>
      </Card>

      {/* Blog Creation Form */}
      <Card title="Thông tin bài viết">
        <BlogCreateForm 
          mode="create"
          onSuccess={handleSuccess}
          showAdminFeatures={true}
        />
      </Card>
    </div>
  );
};

export default AdminCreateBlog; 