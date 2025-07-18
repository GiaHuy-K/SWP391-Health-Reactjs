import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBlogById } from "../../services/api.blog";
import { toast } from "react-toastify";
import BlogCreateForm from "../../components/blog/BlogCreateForm";
import { useAuth } from "../../config/AuthContext";

const EditBlogPage = () => {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const blog = await getBlogById(blogId);
        setInitialData({
          id: blog.id,
          title: blog.title,
          thumbnail: blog.thumbnail,
          description: blog.description,
          content: blog.content,
          category: blog.category,
          status: blog.status,
          authorName: blog.authorName
        });
      } catch (err) {
        toast.error("Không thể tải dữ liệu blog!");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [blogId, navigate]);

  if (loading) return <div>Đang tải...</div>;
  if (!initialData) return null;

  const handleSuccess = () => {
    // Chuyển hướng dựa trên vai trò của user
    if (user?.role === "Quản trị viên Trường học") {
      navigate('/dashboard/manage-blogs');
    } else if (user?.role === "Quản lý Nhân sự/Nhân viên") {
      navigate('/dashboardManager/manage-blogs');
    } else if (user?.role === "Nhân viên Y tế") {
      navigate('/dashboardNurse/manage-blogs');
    } else {
      navigate('/');
    }
  };

  return (
    <BlogCreateForm
      mode="edit"
      initialData={initialData}
      onSuccess={handleSuccess}
      onCancel={() => navigate(-1)}
    />
  );
};

export default EditBlogPage;
