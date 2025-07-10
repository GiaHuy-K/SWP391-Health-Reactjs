import React from "react";
import { Tag, Space, Typography, Tooltip } from "antd";
import { UserOutlined, CrownOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useBlogPermissions } from "../../utils/blogPermissions";

const { Text } = Typography;

const BlogAuthorInfo = ({ blog, showActions = false }) => {
  const permissions = useBlogPermissions();
  
  const isAuthor = permissions.isAuthor(blog);
  const canEdit = permissions.canUpdateBlog(blog);
  const canDelete = permissions.canDeleteBlog(blog);
  const isAdmin = permissions.userRole === "SchoolAdmin";
  const isManager = permissions.userRole === "StaffManager";

  const getAuthorBadge = () => {
    if (isAuthor) {
      return (
        <Tag color="green" icon={<UserOutlined />}>
          Tác giả
        </Tag>
      );
    }
    if (isAdmin) {
      return (
        <Tag color="red" icon={<CrownOutlined />}>
          Quản trị viên
        </Tag>
      );
    }
    if (isManager) {
      return (
        <Tag color="blue" icon={<CrownOutlined />}>
          Quản lý
        </Tag>
      );
    }
    return null;
  };

  const getPermissionInfo = () => {
    const permissions = [];
    
    if (canEdit) {
      permissions.push(
        <Tooltip key="edit" title="Có quyền chỉnh sửa">
          <EditOutlined style={{ color: "#52c41a" }} />
        </Tooltip>
      );
    }
    
    if (canDelete) {
      permissions.push(
        <Tooltip key="delete" title="Có quyền xóa">
          <DeleteOutlined style={{ color: "#ff4d4f" }} />
        </Tooltip>
      );
    }

    return permissions.length > 0 ? (
      <Space size="small">
        <Text type="secondary" style={{ fontSize: 12 }}>Quyền:</Text>
        {permissions}
      </Space>
    ) : null;
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <Space direction="vertical" size="small" style={{ width: "100%" }}>
        <div>
          <Text strong>Tác giả: </Text>
          <Text>{blog?.authorName || "Không xác định"}</Text>
          {getAuthorBadge()}
        </div>
        
        {showActions && getPermissionInfo()}
        
        {isAuthor && (
          <Text type="secondary" style={{ fontSize: 12 }}>
            Bạn là tác giả của bài viết này
          </Text>
        )}
        
        {!isAuthor && (isAdmin || isManager) && (
          <Text type="secondary" style={{ fontSize: 12 }}>
            {isAdmin ? "Quản trị viên có toàn quyền trên bài viết này" : "Quản lý có quyền xem và quản lý bài viết này"}
          </Text>
        )}
      </Space>
    </div>
  );
};

export default BlogAuthorInfo; 