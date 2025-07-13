import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBlogById } from "../../services/api.blog";
import { toast } from "react-toastify";
import { useBlogPermissions, BlogPermissionGuard } from "../../utils/blogPermissions";
import { Button, Space } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import BlogAuthorInfo from "../../components/blog/BlogAuthorInfo";
import BlogPermissionTest from "../../components/blog/BlogPermissionTest";
import { useAuth } from "../../config/AuthContext";
import HomeHeader from "../home/header/HomeHeader";

const BlogDetailPage = () => {
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

  // Kiểm tra quyền xem blog
  if (!permissions.canViewBlog(blog)) {
    return <div>Bạn không có quyền xem bài blog này.</div>;
  }

  const handleEdit = () => {
    navigate(`/dashboardManager/blog/edit/${blogId}`);
  };

  const handleDelete = () => {
    // Implement delete logic
    console.log("Delete blog:", blogId);
  };

  return (
    <>
      <HomeHeader hideNavLinks={true} />
      <div className="blog-detail-page" style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
        {/* Chỉ hiển thị BlogPermissionTest nếu KHÔNG phải Phụ huynh hoặc MedicalStaff */}
        {process.env.NODE_ENV === 'development' && !["Phụ huynh", "MedicalStaff", "Parent"].includes(role) && (
          <BlogPermissionTest blogData={blog} />
        )}
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h1>{blog.title}</h1>
          <BlogPermissionGuard action="update" blogData={blog} fallback={null}>
            <Space>
              <Button 
                type="primary" 
                icon={<EditOutlined />}
                onClick={handleEdit}
              >
                Chỉnh sửa
              </Button>
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
          </BlogPermissionGuard>
        </div>
        
        <BlogAuthorInfo blog={blog} showActions={true} />
        
        <div style={{ color: "#888", marginBottom: 8 }}>
          <span>Danh mục: {blog.category}</span> | <span>Trạng thái: {blog.status}</span>
        </div>
        <div style={{ marginBottom: 16 }}>
          <img src={blog.thumbnail} alt="Thumbnail" style={{ maxWidth: 400, width: "100%", borderRadius: 8 }} />
        </div>
        <div style={{ fontStyle: "italic", color: "#666", marginBottom: 16 }}>{blog.description}</div>
        <div dangerouslySetInnerHTML={{ __html: blog.content }} style={{ background: "#fff", padding: 16, borderRadius: 8 }} />
        <div style={{ marginTop: 24, color: "#aaa", fontSize: 14 }}>
          Tác giả: {blog.authorName} | Ngày tạo: {blog.createdAt?.replace("T", " ").slice(0, 16)}
        </div>
      </div>
    </>
  );
};

export default BlogDetailPage;

