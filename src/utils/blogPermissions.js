import { useAuth } from "../config/AuthContext";

// Mapping từ role tiếng Việt sang role API
const ROLE_MAPPING = {
  "Quản trị viên Trường học": "SchoolAdmin",
  "Quản lý Nhân sự/Nhân viên": "StaffManager", 
  "Nhân viên Y tế": "MedicalStaff",
  "Phụ huynh": "Parent"
};

// Các permission cho từng API endpoint
const API_PERMISSIONS = {
  "POST /api/blogs/upload-thumbnail": ["SchoolAdmin", "MedicalStaff", "StaffManager"],
  "DELETE /api/blogs/delete-thumbnail": ["SchoolAdmin", "MedicalStaff", "StaffManager"],
  "POST /api/blogs": ["SchoolAdmin", "MedicalStaff", "StaffManager"],
  "DELETE /api/blogs/{blogId}": ["author", "SchoolAdmin"], // Tác giả hoặc Admin
  "PUT /api/blogs/{blogId}": ["author"], // Chỉ tác giả
  "PATCH /api/blogs/{blogId}/status": ["SchoolAdmin", "StaffManager"],
  "GET /api/blogs/author/{authorId}": ["SchoolAdmin", "StaffManager"],
  "GET /api/blogs/my-blogs": ["authenticated"], // Bất kỳ user đã đăng nhập
  "GET /api/blogs": ["public", "SchoolAdmin", "StaffManager"], // Công khai + Admin/Manager
  "GET /api/blogs/{blogId}": ["public", "author", "SchoolAdmin", "StaffManager"], // Công khai nếu PUBLIC, toàn quyền nếu author/admin
  "GET /api/blogs/slug/{slug}": ["public", "author", "SchoolAdmin", "StaffManager"]
};

/**
 * Hook để kiểm tra permission cho blog
 */
export const useBlogPermissions = () => {
  const { user, isAuthenticated } = useAuth();
  
  const userRole = user?.role ? ROLE_MAPPING[user.role] : null;
  const userId = user?.id;

  /**
   * Kiểm tra user có quyền truy cập API không
   */
  const canAccessAPI = (apiEndpoint, blogData = null) => {
    const allowedRoles = API_PERMISSIONS[apiEndpoint];
    if (!allowedRoles) return false;

    // Kiểm tra public access
    if (allowedRoles.includes("public")) {
      // Nếu blog có status PUBLIC thì cho phép
      if (blogData && blogData.status === "Công khai") {
        return true;
      }
    }

    // Kiểm tra authenticated access
    if (allowedRoles.includes("authenticated") && isAuthenticated) {
      return true;
    }

    // Kiểm tra role-based access
    if (userRole && allowedRoles.includes(userRole)) {
      return true;
    }

    // Kiểm tra author access
    if (allowedRoles.includes("author") && blogData) {
      return blogData.authorId === userId;
    }

    // Kiểm tra admin access cho tất cả blogs
    if (userRole === "SchoolAdmin" && allowedRoles.includes("SchoolAdmin")) {
      return true;
    }

    return false;
  };

  /**
   * Kiểm tra user có thể tạo blog không
   */
  const canCreateBlog = () => {
    // SchoolAdmin, StaffManager, MedicalStaff có quyền tạo blog
    if (userRole === "SchoolAdmin" || userRole === "StaffManager" || userRole === "MedicalStaff") {
      return true;
    }
    return false;
  };

  /**
   * Kiểm tra user có thể xóa blog không
   */
  const canDeleteBlog = (blogData) => {
    // SchoolAdmin có quyền xóa tất cả blogs
    if (userRole === "SchoolAdmin") {
      return true;
    }
    // Tác giả có quyền xóa blog của mình
    if (blogData && blogData.authorId === userId) {
      return true;
    }
    return false;
  };

  /**
   * Kiểm tra user có thể cập nhật blog không
   */
  const canUpdateBlog = (blogData) => {
    // Chỉ tác giả mới có quyền cập nhật blog
    if (blogData && blogData.authorId === userId) {
      return true;
    }
    return false;
  };

  /**
   * Kiểm tra user có thể cập nhật status blog không
   */
  const canUpdateBlogStatus = () => {
    // SchoolAdmin và StaffManager có quyền cập nhật status
    if (userRole === "SchoolAdmin" || userRole === "StaffManager") {
      return true;
    }
    return false;
  };

  /**
   * Kiểm tra user có thể upload thumbnail không
   */
  const canUploadThumbnail = () => {
    // SchoolAdmin, StaffManager, MedicalStaff có quyền upload thumbnail
    if (userRole === "SchoolAdmin" || userRole === "StaffManager" || userRole === "MedicalStaff") {
      return true;
    }
    return false;
  };

  /**
   * Kiểm tra user có thể xem blog không
   */
  const canViewBlog = (blogData) => {
    // Blog công khai thì ai cũng xem được
    if (blogData && blogData.status === "Công khai") {
      return true;
    }
    // SchoolAdmin có quyền xem tất cả blogs
    if (userRole === "SchoolAdmin") {
      return true;
    }
    // StaffManager có quyền xem tất cả blogs
    if (userRole === "StaffManager") {
      return true;
    }
    // Tác giả có quyền xem blog của mình
    if (blogData && blogData.authorId === userId) {
      return true;
    }
    return false;
  };

  /**
   * Kiểm tra user có thể xem tất cả blogs không
   */
  const canViewAllBlogs = () => {
    // SchoolAdmin và StaffManager có quyền xem tất cả blogs
    if (userRole === "SchoolAdmin" || userRole === "StaffManager") {
      return true;
    }
    return false;
  };

  /**
   * Kiểm tra user có thể xem blogs của mình không
   */
  const canViewMyBlogs = () => {
    // Tất cả user đã đăng nhập có thể xem blogs của mình
    if (isAuthenticated) {
      return true;
    }
    return false;
  };

  /**
   * Lấy danh sách permissions cho UI rendering
   */
  const getUIPermissions = () => ({
    canCreate: canCreateBlog(),
    canDelete: true, // Sẽ check cụ thể khi có blog data
    canUpdate: true, // Sẽ check cụ thể khi có blog data
    canUpdateStatus: canUpdateBlogStatus(),
    canUploadThumbnail: canUploadThumbnail(),
    canViewAll: canViewAllBlogs(),
    canViewMy: canViewMyBlogs(),
    userRole,
    userId
  });

  /**
   * Kiểm tra user có phải là tác giả của blog không
   */
  const isAuthor = (blogData) => {
    return blogData && blogData.authorId === userId;
  };

  return {
    canCreateBlog,
    canDeleteBlog,
    canUpdateBlog,
    canUpdateBlogStatus,
    canUploadThumbnail,
    canViewBlog,
    canViewAllBlogs,
    canViewMyBlogs,
    isAuthor,
    getUIPermissions,
    userRole,
    userId,
    isAuthenticated
  };
};

/**
 * Component wrapper để bảo vệ blog actions
 */
export const BlogPermissionGuard = ({ 
  children, 
  action, 
  blogData = null,
  fallback = null 
}) => {
  const permissions = useBlogPermissions();
  
  let hasPermission = false;
  
  switch (action) {
    case 'create':
      hasPermission = permissions.canCreateBlog();
      break;
    case 'delete':
      hasPermission = permissions.canDeleteBlog(blogData);
      break;
    case 'update':
      hasPermission = permissions.canUpdateBlog(blogData);
      break;
    case 'updateStatus':
      hasPermission = permissions.canUpdateBlogStatus();
      break;
    case 'uploadThumbnail':
      hasPermission = permissions.canUploadThumbnail();
      break;
    case 'view':
      hasPermission = permissions.canViewBlog(blogData);
      break;
    default:
      hasPermission = false;
  }

  return hasPermission ? children : fallback;
}; 