import React from "react";
import { Card, Typography, Space, Tag, Divider } from "antd";
import { useBlogPermissions } from "../../utils/blogPermissions";
import { useAuth } from "../../config/AuthContext";

const { Title, Text } = Typography;

const BlogPermissionTest = ({ blogData = null }) => {
  const permissions = useBlogPermissions();
  const { user } = useAuth();

  const testPermissions = [
    {
      name: "Tạo blog",
      check: () => permissions.canCreateBlog(),
      description: "Có thể tạo blog mới"
    },
    {
      name: "Upload thumbnail",
      check: () => permissions.canUploadThumbnail(),
      description: "Có thể upload thumbnail"
    },
    {
      name: "Xem tất cả blogs",
      check: () => permissions.canViewAllBlogs(),
      description: "Có thể xem tất cả blogs"
    },
    {
      name: "Xem blogs của mình",
      check: () => permissions.canViewMyBlogs(),
      description: "Có thể xem blogs của mình"
    },
    {
      name: "Cập nhật status",
      check: () => permissions.canUpdateBlogStatus(),
      description: "Có thể cập nhật trạng thái blog"
    }
  ];

  if (blogData) {
    testPermissions.push(
      {
        name: "Xem blog này",
        check: () => permissions.canViewBlog(blogData),
        description: "Có thể xem blog hiện tại"
      },
      {
        name: "Chỉnh sửa blog này",
        check: () => permissions.canUpdateBlog(blogData),
        description: "Có thể chỉnh sửa blog hiện tại"
      },
      {
        name: "Xóa blog này",
        check: () => permissions.canDeleteBlog(blogData),
        description: "Có thể xóa blog hiện tại"
      },
      {
        name: "Là tác giả",
        check: () => permissions.isAuthor(blogData),
        description: "Là tác giả của blog này"
      }
    );
  }

  return (
    <Card title="Blog Permission Test" style={{ marginBottom: 16 }}>
      <div style={{ marginBottom: 16 }}>
        <Text strong>User Info:</Text>
        <br />
        <Text>Role: {user?.role || "Không xác định"}</Text>
        <br />
        <Text>User ID: {permissions.userId || "Không xác định"}</Text>
        <br />
        <Text>Authenticated: {permissions.isAuthenticated ? "Có" : "Không"}</Text>
      </div>

      <Divider />

      <div>
        <Text strong>Permissions:</Text>
        <Space direction="vertical" style={{ width: "100%", marginTop: 8 }}>
          {testPermissions.map((permission, index) => (
            <div key={index} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Tag color={permission.check() ? "green" : "red"}>
                {permission.check() ? "✅" : "❌"}
              </Tag>
              <Text strong>{permission.name}:</Text>
              <Text type="secondary">{permission.description}</Text>
            </div>
          ))}
        </Space>
      </div>

      {blogData && (
        <>
          <Divider />
          <div>
            <Text strong>Blog Info:</Text>
            <br />
            <Text>Author ID: {blogData.authorId}</Text>
            <br />
            <Text>Status: {blogData.status}</Text>
            <br />
            <Text>Category: {blogData.category}</Text>
          </div>
        </>
      )}
    </Card>
  );
};

export default BlogPermissionTest; 