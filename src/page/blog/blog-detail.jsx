import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBlogById } from "../../services/api.blog";
import { toast } from "react-toastify";

const BlogDetailPage = () => {
  const { blogId } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="blog-detail-page" style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1>{blog.title}</h1>
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
  );
};

export default BlogDetailPage;

