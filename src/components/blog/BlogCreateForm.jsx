import React, { useRef, useState, useEffect, useCallback } from "react";
import { Editor } from "@tinymce/tinymce-react";
import {
  createBlog,
  uploadBlogThumbnail,
  getBlogCategories,
  getBlogStatuses,
  uploadEditorImage,
  deleteBlogThumbnail,
  deleteEditorImage
} from "../../services/api.blog";
import { toast } from "react-toastify";
import "./BlogCreateForm.css";

const BlogCreateForm = ({ onSuccess, onCancel, mode = "create", initialData }) => {
  const editorRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [thumbnailPreview, setThumbnailPreview] = useState(initialData?.thumbnail || null);
  const [form, setForm] = useState({
    title: initialData?.title || "",
    thumbnail: initialData?.thumbnail || "",
    description: initialData?.description || "",
    status: initialData?.status || "",
    category: initialData?.category || "",
    content: initialData?.content || ""
  });

  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadedThumbnail, setUploadedThumbnail] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const submittedRef = useRef(submitted); // <<< Dùng ref để theo dõi trạng thái submit
  submittedRef.current = submitted;

  // Load categories và statuses khi component mount
  useEffect(() => {
    const loadEnums = async () => {
      try {
        const [categoriesData, statusesData] = await Promise.all([
          getBlogCategories(),
          getBlogStatuses(),
        ]);
        setCategories(categoriesData);
        setStatuses(statusesData);
        if (categoriesData.length > 0 && statusesData.length > 0) {
          setForm(prev => ({
            ...prev,
            category: prev.category || categoriesData[0].displayName,
            status: prev.status || statusesData.find(s => s.value === 'DRAFT')?.displayName || statusesData[0].displayName,
          }));
        }
      } catch (error) {
        console.error("Lỗi khi load dữ liệu enum:", error);
      }
    };
    loadEnums();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // <<< Dùng useCallback để tối ưu, tránh tạo lại hàm không cần thiết
  const extractPublicIdFromUrl = useCallback((url) => {
    if (!url) return null;
    const uploadMarker = "/upload/";
    const idx = url.indexOf(uploadMarker);
    if (idx === -1) return null;
    let afterUpload = url.substring(idx + uploadMarker.length);
    if (afterUpload.match(/^v\d+\//)) {
      afterUpload = afterUpload.replace(/^v\d+\//, "");
    }
    const dotIdx = afterUpload.lastIndexOf('.');
    if (dotIdx !== -1) {
      afterUpload = afterUpload.substring(0, dotIdx);
    }
    return afterUpload;
  }, []);

  // Upload thumbnail
  const handleThumbnailUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file ảnh!");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Kích thước file không được vượt quá 5MB!");
      return;
    }

    try {
      setLoading(true);
      // Nếu đã có thumbnail tạm thời, xóa nó đi trước
      if (uploadedThumbnail) {
        const oldPublicId = extractPublicIdFromUrl(uploadedThumbnail);
        if (oldPublicId) {
          // Dùng hàm xóa beacon vì người dùng có thể upload rồi thoát ngay
          cleanupBlogThumbnailBeacon(oldPublicId);
        }
      }

      const response = await uploadBlogThumbnail(file);
      setForm(prev => ({ ...prev, thumbnail: response.thumbnailUrl }));
      setThumbnailPreview(response.thumbnailUrl);
      setUploadedThumbnail(response.thumbnailUrl);
    } catch (error) {
      toast.error("Lỗi upload thumbnail.");
      console.error("Lỗi upload thumbnail:", error);
    } finally {
      setLoading(false);
    }
  };

  // TinyMCE config
  const editorConfig = {
    height: 500,
    menubar: true,
    plugins: [
      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
      'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
      'insertdatetime', 'media', 'table', 'help', 'wordcount'
    ],
    toolbar: 'undo redo | blocks | ' +
        'bold italic forecolor | alignleft aligncenter ' +
        'alignright alignjustify | bullist numlist outdent indent | ' +
        'removeformat | image media link | code fullscreen | help',
    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
    images_upload_handler: async (blobInfo, progress) => {
      try {
        const file = blobInfo.blob();
        const imageUrl = await uploadEditorImage(file);
        setUploadedImages(prev => [...prev, imageUrl]);
        return imageUrl;
      } catch (error) {
        throw new Error("Upload ảnh thất bại: " + error.message);
      }
    },
    automatic_uploads: true,
    file_picker_types: 'image',
    images_upload_credentials: true
  };

  const handleEditorChange = (content) => {
    setForm(prev => ({ ...prev, content }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editorRef.current && mode === "create") {
      toast.error("Editor chưa sẵn sàng!");
      return;
    }
    const content = mode === "edit" ? form.content : editorRef.current.getContent();

    // Validate form
    if (!form.title.trim() || !form.thumbnail || !form.description.trim() || !content.trim() || content === '<p></p>' || !form.category) {
      toast.error("Vui lòng điền đầy đủ các trường bắt buộc!");
      return;
    }

    setLoading(true);


    try {
      let createdOrUpdatedBlog;
      setLoading(true);
      if (mode === "edit") {
        // Gọi updateBlog
        const { updateBlog } = await import("../../services/api.blog");
        createdOrUpdatedBlog = await updateBlog(initialData.id, {
          title: form.title.trim(),
          thumbnail: form.thumbnail,
          description: form.description.trim(),
          content: content,
          status: form.status,
          category: form.category
        });
        toast.success("Cập nhật blog thành công!");
      } else {
        // Gọi createBlog
        createdOrUpdatedBlog = await createBlog({
          title: form.title.trim(),
          thumbnail: form.thumbnail,
          description: form.description.trim(),
          content: content,
          status: form.status,
          category: form.category
        });
        toast.success("Tạo blog thành công!");
      }
      setSubmitted(true);
      if (onSuccess) onSuccess(createdOrUpdatedBlog);
    } catch (error) {
      toast.error(mode === "edit" ? "Cập nhật blog thất bại!" : "Tạo blog thất bại!");
      console.error("Lỗi submit blog:", error);
    } finally {
      setLoading(false);
    }
  };

  // useEffect cleanup chỉ chạy khi chuyển trang trong SPA, KHÔNG xử lý trường hợp đóng trình duyệt đột ngột
  useEffect(() => {
    return () => {
      if (submittedRef.current) return;
      // Cleanup ảnh editor và thumbnail khi chuyển trang (không xử lý đóng trình duyệt)
      const editorPublicIds = uploadedImages
        .map(url => extractPublicIdFromUrl(url))
        .filter(Boolean);
      const thumbnailPublicId = uploadedThumbnail
        ? extractPublicIdFromUrl(uploadedThumbnail)
        : null;
      // Xóa từng ảnh editor
      for (const publicId of editorPublicIds) {
        deleteEditorImage(publicId).catch(err => {
          console.warn("Không thể xóa ảnh editor:", err);
        });
      }
      // Xóa thumbnail nếu có
      if (thumbnailPublicId) {
        deleteBlogThumbnail(thumbnailPublicId).catch(err => {
          console.warn("Không thể xóa thumbnail:", err);
        });
      }
    };
  }, [uploadedImages, uploadedThumbnail, extractPublicIdFromUrl]); // <<< Dependencies chính xác

  // Prefill form if in edit mode and initialData changes
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setForm({
        title: initialData.title || "",
        thumbnail: initialData.thumbnail || "",
        description: initialData.description || "",
        status: initialData.status || "",
        category: initialData.category || "",
        content: initialData.content || ""
      });
      setThumbnailPreview(initialData.thumbnail || null);
    }
  }, [mode, initialData]);

  return (
    <div className="blog-create-form">
      <div className="form-header">
        <h2>{mode === "edit" ? "Chỉnh sửa Blog" : "Tạo Blog Mới"}</h2>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-cancel" disabled={loading}>
            Hủy
          </button>
        )}
      </div>
      <form onSubmit={handleSubmit} className="blog-form">
        <div className="form-group">
          <label htmlFor="title">Tiêu đề <span className="required">*</span></label>
          <input type="text" id="title" name="title" value={form.title} onChange={handleChange} placeholder="Nhập tiêu đề blog" disabled={loading} required/>
        </div>
        <div className="form-group">
          <label htmlFor="thumbnail">Thumbnail <span className="required">*</span></label>
          <div className="thumbnail-upload">
            <input type="file" id="thumbnail" accept="image/*" onChange={handleThumbnailUpload} disabled={loading}/>
            {thumbnailPreview && (<div className="thumbnail-preview"><img src={thumbnailPreview} alt="Thumbnail preview" /></div>)}
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="description">Mô tả <span className="required">*</span></label>
          <textarea id="description" name="description" value={form.description} onChange={handleChange} placeholder="Nhập mô tả ngắn cho blog" rows="3" disabled={loading} required/>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category">Danh mục <span className="required">*</span></label>
            <select id="category" name="category" value={form.category} onChange={handleChange} disabled={loading} required style={{ color: categories.find(c => c.displayName === form.category)?.color || undefined }}>
              {categories.map((category) => (<option key={category.displayName} value={category.displayName} style={{color: category.color}}>{category.displayName}</option>))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="status">Trạng thái</label>
            <select id="status" name="status" value={form.status} onChange={handleChange} disabled={loading} style={{ color: statuses.find(s => s.displayName === form.status)?.color || undefined }}>
              {statuses.map((status) => (<option key={status.displayName} value={status.displayName} style={{ color: status.color }}>{status.displayName}</option>))}
            </select>
          </div>
        </div>
        <div className="form-group">
          <label>Nội dung <span className="required">*</span></label>
          <Editor
            apiKey="odetrkaqtopfufx70ju019bjasgb3m3yydvjuy8rot18inom"
            onInit={(evt, editor) => (editorRef.current = editor)}
            value={form.content}
            init={editorConfig}
            disabled={loading}
            onEditorChange={handleEditorChange}
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? (mode === "edit" ? "Đang lưu..." : "Đang tạo...") : (mode === "edit" ? "Lưu thay đổi" : "Tạo Blog")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogCreateForm;
