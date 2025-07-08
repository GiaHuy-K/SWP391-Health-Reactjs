import React from "react";
import BlogCreateForm from "../../components/blog/BlogCreateForm";
import { useNavigate } from "react-router-dom";

const CreateBlogPage = () => {
  const navigate = useNavigate();

  const handleSuccess = (createdBlog) => {
    navigate('/dashboardNurse/manage-blogs');
  };

  const handleCancel = () => {
    // Navigate về trang trước hoặc trang danh sách blog
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
