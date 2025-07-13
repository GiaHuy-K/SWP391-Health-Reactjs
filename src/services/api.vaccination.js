import { toast } from "react-toastify";
import api from "../config/axios";

// =========================================================================
// VACCINATION CAMPAIGN API - Các hàm thao tác với dữ liệu Chiến dịch tiêm chủng
// =========================================================================

/**
 * Lấy danh sách chiến dịch tiêm chủng với khả năng lọc và phân trang
 * @param {Object} params - Các tham số lọc và phân trang
 * @param {number} params.page - Zero-based page index (0..N), default: 0
 * @param {number} params.size - The size of the page to be returned, default: 10
 * @param {string|Array} params.sort - Sorting criteria, default: ["createdAt,ASC"]
 * @param {string} params.campaignName - Lọc theo tên chiến dịch
 * @param {string} params.vaccineName - Lọc theo tên vaccine
 * @param {string} params.status - Lọc theo trạng thái (Nháp, Đã lên lịch, Đang chuẩn bị, Đang diễn ra, Đã hoàn thành, Đã hủy)
 * @param {string} params.startDate - Lọc theo ngày bắt đầu (format: YYYY-MM-DD)
 * @param {string} params.endDate - Lọc theo ngày kết thúc (format: YYYY-MM-DD)
 * @param {string} params.classGroup - Lọc theo nhóm lớp (Mầm, Chồi, Lá)
 * @param {number} params.organizedByUserId - Lọc theo ID người tổ chức
 * @returns {Promise<Object>} - Dữ liệu trả về bao gồm content, totalElements, totalPages, etc.
 */
export const getVaccinationCampaigns = async (params = {}) => {
  try {
    // Xử lý tham số sort để đảm bảo format đúng
    let queryParams = { ...params };
    
    // Nếu sort là array, chuyển thành string
    if (Array.isArray(params.sort)) {
      queryParams.sort = params.sort.join(',');
    }
    
    // Đảm bảo các tham số có giá trị mặc định
    const defaultParams = {
      page: 0,
      size: 10,
      sort: "createdAt,ASC"
    };
    
    // Merge với params được truyền vào
    const finalParams = { ...defaultParams, ...queryParams };
    
    const response = await api.get("/vaccination/campaigns", { 
      params: finalParams 
    });
    
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách chiến dịch tiêm chủng:", error);
    
    // Xử lý các loại lỗi khác nhau
    if (error.response?.status === 401) {
      toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    } else if (error.response?.status === 403) {
      toast.error("Bạn không có quyền truy cập danh sách chiến dịch tiêm chủng.");
    } else if (error.response?.status === 400) {
      toast.error("Tham số tìm kiếm không hợp lệ. Vui lòng kiểm tra lại.");
    } else {
      toast.error("Không thể lấy danh sách chiến dịch tiêm chủng. Vui lòng thử lại sau.");
    }
    
    throw error;
  }
};

/**
 * Lấy thông tin chiến dịch tiêm chủng theo ID
 * @param {number} campaignId - ID của chiến dịch
 * @returns {Promise<Object>} - Thông tin chi tiết chiến dịch
 */
export const getVaccinationCampaignById = async (campaignId) => {
  try {
    const response = await api.get(`/vaccination/campaigns/${campaignId}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin chiến dịch:", error);
    
    if (error.response?.status === 404) {
      toast.error("Không tìm thấy chiến dịch tiêm chủng.");
    } else if (error.response?.status === 401) {
      toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    } else if (error.response?.status === 403) {
      toast.error("Bạn không có quyền xem thông tin chiến dịch này.");
    } else {
      toast.error("Không thể lấy thông tin chiến dịch. Vui lòng thử lại sau.");
    }
    
    throw error;
  }
};

/**
 * Tạo chiến dịch tiêm chủng mới
 * @param {Object} campaignData - Dữ liệu chiến dịch mới
 * @returns {Promise<Object>} - Thông tin chiến dịch đã tạo
 */
export const createVaccinationCampaign = async (campaignData) => {
  try {
    const response = await api.post("/vaccination/campaigns", campaignData);
    toast.success("Tạo chiến dịch tiêm chủng thành công!");
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tạo chiến dịch tiêm chủng:", error);
    
    // Xử lý validation errors
    if (error.response?.data?.validationErrors) {
      const validationErrors = error.response.data.validationErrors;
      const errorMessages = Object.values(validationErrors).flat();
      toast.error(errorMessages.join(", "));
    } else if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else {
      toast.error("Tạo chiến dịch tiêm chủng thất bại. Vui lòng thử lại.");
    }
    
    throw error;
  }
};

/**
 * Cập nhật chiến dịch tiêm chủng (chỉ khi ở trạng thái DRAFT)
 * @param {number} campaignId - ID của chiến dịch
 * @param {Object} updateData - Dữ liệu cập nhật
 * @returns {Promise<Object>} - Thông tin chiến dịch đã cập nhật
 */
export const updateVaccinationCampaign = async (campaignId, updateData) => {
  try {
    const response = await api.put(`/vaccination/campaigns/${campaignId}`, updateData);
    toast.success("Cập nhật chiến dịch tiêm chủng thành công!");
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật chiến dịch tiêm chủng:", error);
    
    if (error.response?.status === 400) {
      toast.error("Không thể cập nhật chiến dịch đã được lên lịch hoặc đang diễn ra.");
    } else if (error.response?.data?.validationErrors) {
      const validationErrors = error.response.data.validationErrors;
      const errorMessages = Object.values(validationErrors).flat();
      toast.error(errorMessages.join(", "));
    } else if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else {
      toast.error("Cập nhật chiến dịch tiêm chủng thất bại. Vui lòng thử lại.");
    }
    
    throw error;
  }
};

/**
 * Bắt đầu chiến dịch (PREPARING -> IN_PROGRESS)
 * @param {number} campaignId - ID của chiến dịch
 * @returns {Promise<Object>} - Thông tin chiến dịch đã cập nhật
 */
export const startVaccinationCampaign = async (campaignId) => {
  try {
    const response = await api.post(`/vaccination/campaigns/${campaignId}/start`);
    toast.success("Bắt đầu chiến dịch tiêm chủng thành công!");
    return response.data;
  } catch (error) {
    console.error("Lỗi khi bắt đầu chiến dịch tiêm chủng:", error);
    
    if (error.response?.status === 400) {
      toast.error("Chỉ có thể bắt đầu chiến dịch ở trạng thái 'Đang chuẩn bị'.");
    } else if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else {
      toast.error("Bắt đầu chiến dịch tiêm chủng thất bại. Vui lòng thử lại.");
    }
    
    throw error;
  }
};

/**
 * Hoàn thành chiến dịch (IN_PROGRESS -> COMPLETED)
 * @param {number} campaignId - ID của chiến dịch
 * @returns {Promise<Object>} - Thông tin chiến dịch đã cập nhật
 */
export const completeVaccinationCampaign = async (campaignId) => {
  try {
    const response = await api.post(`/vaccination/campaigns/${campaignId}/complete`);
    toast.success("Hoàn thành chiến dịch tiêm chủng thành công!");
    return response.data;
  } catch (error) {
    console.error("Lỗi khi hoàn thành chiến dịch tiêm chủng:", error);
    
    if (error.response?.status === 400) {
      toast.error("Chỉ có thể hoàn thành chiến dịch đang diễn ra.");
    } else if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else {
      toast.error("Hoàn thành chiến dịch tiêm chủng thất bại. Vui lòng thử lại.");
    }
    
    throw error;
  }
};

/**
 * Lấy danh sách phiếu đồng ý của chiến dịch
 * @param {number} campaignId - ID của chiến dịch
 * @param {Object} params - Tham số phân trang và lọc
 * @returns {Promise<Object>} - Danh sách phiếu đồng ý
 */
export const getCampaignConsents = async (campaignId, params = {}) => {
  try {
    const response = await api.get(`/vaccination/campaigns/${campaignId}/consents`, {
      params: {
        page: 0,
        size: 100,
        ...params
      }
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách phiếu đồng ý:", error);
    
    if (error.response?.status === 404) {
      toast.error("Không tìm thấy chiến dịch tiêm chủng.");
    } else {
      toast.error("Không thể lấy danh sách phiếu đồng ý. Vui lòng thử lại sau.");
    }
    
    throw error;
  }
};

/**
 * Lấy thông tin phiếu đồng ý theo ID
 * @param {number} consentId - ID của phiếu đồng ý
 * @returns {Promise<Object>} - Thông tin chi tiết phiếu đồng ý
 */
export const getConsentById = async (consentId) => {
  try {
    const response = await api.get(`/vaccination/consents/${consentId}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin phiếu đồng ý:", error);
    
    if (error.response?.status === 404) {
      toast.error("Không tìm thấy phiếu đồng ý.");
    } else {
      toast.error("Không thể lấy thông tin phiếu đồng ý. Vui lòng thử lại sau.");
    }
    
    throw error;
  }
};

/**
 * Cập nhật phản hồi phiếu đồng ý (bởi nhân viên)
 * @param {number} consentId - ID của phiếu đồng ý
 * @param {Object} updateData - Dữ liệu cập nhật
 * @returns {Promise<Object>} - Thông tin phiếu đồng ý đã cập nhật
 */
export const updateConsent = async (consentId, updateData) => {
  try {
    const response = await api.put(`/vaccination/consents/${consentId}`, updateData);
    toast.success("Cập nhật phiếu đồng ý thành công!");
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật phiếu đồng ý:", error);
    
    if (error.response?.data?.validationErrors) {
      const validationErrors = error.response.data.validationErrors;
      const errorMessages = Object.values(validationErrors).flat();
      toast.error(errorMessages.join(", "));
    } else if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else {
      toast.error("Cập nhật phiếu đồng ý thất bại. Vui lòng thử lại.");
    }
    
    throw error;
  }
};

// =========================================================================
// CONSTANTS - Các hằng số cho trạng thái và nhóm lớp
// =========================================================================

export const CAMPAIGN_STATUS = {
  DRAFT: "Nháp",
  SCHEDULED: "Đã lên lịch", 
  PREPARING: "Đang chuẩn bị",
  IN_PROGRESS: "Đang diễn ra",
  COMPLETED: "Đã hoàn thành",
  CANCELLED: "Đã hủy"
};

export const CLASS_GROUPS = {
  MAM: "Mầm",
  CHOI: "Chồi", 
  LA: "Lá"
};

export const CAMPAIGN_STATUS_OPTIONS = [
  { value: CAMPAIGN_STATUS.DRAFT, label: "Nháp" },
  { value: CAMPAIGN_STATUS.SCHEDULED, label: "Đã lên lịch" },
  { value: CAMPAIGN_STATUS.PREPARING, label: "Đang chuẩn bị" },
  { value: CAMPAIGN_STATUS.IN_PROGRESS, label: "Đang diễn ra" },
  { value: CAMPAIGN_STATUS.COMPLETED, label: "Đã hoàn thành" },
  { value: CAMPAIGN_STATUS.CANCELLED, label: "Đã hủy" }
];

export const CLASS_GROUP_OPTIONS = [
  { value: CLASS_GROUPS.MAM, label: "Mầm" },
  { value: CLASS_GROUPS.CHOI, label: "Chồi" },
  { value: CLASS_GROUPS.LA, label: "Lá" }
]; 