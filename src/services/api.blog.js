import { toast } from "react-toastify";
import api from "../config/axios"; // Giả sử axios instance của bạn được export default từ đây

// =========================================================================
// BLOG API - Các hàm thao tác với dữ liệu Blog
// =========================================================================

// Tạo blog mới
export const createBlog = async (blogData) => {
  try {
    const response = await api.post("blogs", blogData);
    // Không cần toast ở đây, nên để component gọi hàm xử lý toast
    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.message || "Tạo blog thất bại!");
    throw error;
  }
};

// Lấy danh sách blog (có phân trang, filter, search)
export const getBlogs = async (params) => {
  try {
    const response = await api.get("blogs", { params });
    return response.data;
  } catch (error) {
    toast.error("Không thể lấy danh sách blog");
    throw error;
  }
};

// Lấy blog theo ID
export const getBlogById = async (blogId) => {
  try {
    const response = await api.get(`blogs/${blogId}`);
    return response.data;
  } catch (error) {
    toast.error("Không thể lấy chi tiết blog");
    throw error;
  }
};

// Lấy blog theo slug
export const getBlogBySlug = async (slug) => {
  try {
    const response = await api.get(`blogs/slug/${slug}`);
    return response.data;
  } catch (error) {
    // Không nên toast lỗi ở đây, để component tự xử lý (ví dụ redirect sang trang 404)
    console.error("Lỗi khi lấy blog theo slug:", error);
    throw error;
  }
};

// Lấy blog của user hiện tại
export const getMyBlogs = async (params) => {
  try {
    const response = await api.get("blogs/my-blogs", { params });
    return response.data;
  } catch (error) {
    toast.error("Không thể lấy blog của bạn");
    throw error;
  }
};

// Cập nhật blog
export const updateBlog = async (blogId, updateData) => {
  try {
    const response = await api.put(`blogs/${blogId}`, updateData);
    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.message || "Cập nhật blog thất bại!");
    throw error;
  }
};

// Xóa blog
export const deleteBlog = async (blogId) => {
  try {
    await api.delete(`blogs/${blogId}`);
    toast.success("Xóa blog thành công!");
  } catch (error) {
    toast.error("Xóa blog thất bại!");
    throw error;
  }
};

// Cập nhật trạng thái blog
export const updateBlogStatus = async (blogId, statusData) => {
  try {
    console.log("PATCH status payload:", { status: statusData });
    const response = await api.patch(`blogs/${blogId}/status`, statusData);
    toast.success("Cập nhật trạng thái blog thành công!");
    return response.data;
  } catch (error) {
    toast.error("Cập nhật trạng thái blog thất bại!");
    throw error;
  }
};

// =========================================================================
// FILE API - Các hàm upload và xóa file
// =========================================================================

// Upload thumbnail cho blog
export const uploadBlogThumbnail = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  try {
    const response = await api.post("blogs/upload-thumbnail", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    // Không cần toast ở đây, để component xử lý
    return response.data;
  } catch (error) {
    toast.error("Upload thumbnail thất bại!");
    throw error;
  }
};

// Xóa thumbnail khỏi Cloudinary (Dùng khi người dùng chủ động xóa)
// Hàm này dùng DELETE, không phù hợp với sendBeacon
export const deleteBlogThumbnail = async (thumbnailUrl) => {
  try {
    await api.delete("blogs/delete-thumbnail", {
      params: { thumbnailUrl },
    });
  } catch (error) {
    console.warn("Xóa thumbnail thất bại!", error);
    throw error;
  }
};

// Upload ảnh cho editor
export const uploadEditorImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  try {
    const response = await api.post("files/upload-editor-image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.location; // Trả về URL để TinyMCE sử dụng
  } catch (error) {
    toast.error("Upload ảnh thất bại!");
    throw error;
  }
};

// Xóa một ảnh editor (Dùng khi người dùng chủ động xóa)
export const deleteEditorImage = async (publicId) => {
  try {
    // Giả sử endpoint của bạn nhận publicId trong body của request POST
    await api.post("files/delete-editor-image", { publicId });
  } catch (error) {
    console.warn("Không thể xóa ảnh editor:", error);
    throw error;
  }
};


// =========================================================================
// CLEANUP API - Các hàm dùng navigator.sendBeacon để xóa file khi rời trang
//
// Quan trọng: Các hàm này sẽ không trả về promise và không nên dùng await.
// Chúng được thiết kế để "bắn và quên" một cách đáng tin cậy.
// Backend endpoints cho các hàm này BẮT BUỘC phải là phương thức POST.
// =========================================================================

/**
 * Xóa nhiều ảnh editor một cách đáng tin cậy khi người dùng rời trang.
 * @param {string[]} publicIds Mảng các public ID của ảnh cần xóa.
 */
export const cleanupEditorImagesBeacon = (publicIds) => {
  if (!publicIds || publicIds.length === 0 || !navigator.sendBeacon) {
    return;
  }

  // URL của API backend để xóa nhiều ảnh
  const url = `${api.defaults.baseURL}/files/delete-editor-images`;
  const data = JSON.stringify({ publicIds });
  const blob = new Blob([data], { type: 'application/json' });

  navigator.sendBeacon(url, blob);
};

/**
 * Xóa một thumbnail blog một cách đáng tin cậy khi người dùng rời trang.
 * YÊU CẦU: Backend cần có một endpoint POST để xử lý việc này.
 * @param {string} publicId Public ID của thumbnail cần xóa.
 */
export const cleanupBlogThumbnailBeacon = (publicId) => {
  if (!publicId || !navigator.sendBeacon) {
    return;
  }

  // YÊU CẦU: Bạn cần tạo một endpoint POST, ví dụ: /api/blogs/delete-thumbnail-beacon
  // Endpoint này sẽ nhận { "publicId": "..." } trong body.
  // Endpoint DELETE hiện tại của bạn không dùng được với sendBeacon.
  const url = `${api.defaults.baseURL}/blogs/delete-thumbnail-beacon`; // <<< THAY ĐỔI ĐƯỜNG DẪN NÀY
  const data = JSON.stringify({ publicId });
  const blob = new Blob([data], { type: 'application/json' });

  navigator.sendBeacon(url, blob);
};


// =========================================================================
// ENUM API - Các hàm lấy danh sách enum
// =========================================================================

// Lấy danh mục blog
export const getBlogCategories = async () => {
  try {
    const response = await api.get("enums/blog-categories");
    return response.data;
  } catch (error) {
    toast.error("Không thể lấy danh mục blog");
    throw error;
  }
};

// Lấy trạng thái blog
export const getBlogStatuses = async () => {
  try {
    const response = await api.get("enums/blog-statuses");
    return response.data;
  } catch (error) {
    toast.error("Không thể lấy trạng thái blog");
    throw error;
  }
};