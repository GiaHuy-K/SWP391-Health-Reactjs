import React from "react";
import BlogCreateForm from "../../components/blog/BlogCreateForm";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../config/AuthContext";

const CreateBlogPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSuccess = (createdBlog) => {
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

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div style={{ padding: "20px", minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <BlogCreateForm
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default CreateBlogPage;
