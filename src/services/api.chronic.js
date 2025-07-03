import api from "../config/axios";
import { toast } from "react-toastify";

/**
 * 
 * @param {number|string} id 
 * @param {object} params 
 * @returns {Promise<object>} 
 */
export const getStudentChronicDiseases = async (id, params = {}) => {
  try {
    const response = await api.get(`/students/${id}/chronic-diseases`, { params });
    console.log("Lấy danh sách bệnh mãn tính cho học sinh:", response.data);
    return response.data;
  } catch (error) {
    toast.error(error.response?.data?.message || "Không thể lấy danh sách bệnh mãn tính");
    throw error;
  }
};

/**
 * 
 * @param {number|string} id - 
 * @param {object} data - 
 * @returns {Promise<object>} 
 */
export const addStudentChronicDisease = async (id, data) => {
  try {
    const response = await api.post(`/students/${id}/chronic-diseases`, data);
    toast.success("Thêm mới bệnh mãn tính thành công!");
    return response.data;
  } catch (error) {
    toast.error(error.response?.data?.message || "Không thể thêm mới bệnh mãn tính");
    throw error;
  }
};

/**
 * Lấy chi tiết 1 bản ghi bệnh mãn tính
 * @param {number|string} chronicDiseaseId - ID bản ghi bệnh mãn tính
 * @returns {Promise<object>} Chi tiết bệnh mãn tính
 */
export const getChronicDiseaseDetail = async (chronicDiseaseId) => {
  try {
    const response = await api.get(`/chronic-diseases/${chronicDiseaseId}`);
    console.log("Lấy chi tiết bệnh mãn tính:", response.data);
    return response.data;
  } catch (error) {
    toast.error(error.response?.data?.message || "Không thể lấy chi tiết bệnh mãn tính");
    throw error;
  }
};

/**
 * Duyệt/Thay đổi trạng thái bản ghi bệnh mãn tính
 * @param {number|string} chronicDiseaseId - ID bản ghi bệnh mãn tính
 * @param {string} newStatus - Trạng thái mới (APPROVE hoặc REJECTED)
 * @param {string} approverNotes - Ghi chú của người duyệt (tùy chọn)
 * @returns {Promise<object>} Bản ghi bệnh mãn tính đã cập nhật trạng thái
 */
export const updateChronicDiseaseStatus = async (chronicDiseaseId, newStatus, approverNotes = "") => {
  try {
    const response = await api.patch(`/chronic-diseases/${chronicDiseaseId}/mediate`, {
      newStatus,
      approverNotes,
    });
    toast.success("Cập nhật trạng thái bệnh mãn tính thành công!");
    return response.data;
  } catch (error) {
    toast.error(error.response?.data?.message || "Không thể cập nhật trạng thái bệnh mãn tính");
    throw error;
  }
};

/**
 * Cập nhật thông tin bệnh mãn tính
 * @param {number|string} chronicDiseaseId - ID bản ghi bệnh mãn tính
 * @param {object} data - Dữ liệu cập nhật
 * @returns {Promise<object>} Bản ghi bệnh mãn tính đã cập nhật
 */
export const updateChronicDisease = async (chronicDiseaseId, data) => {
  try {
    const formData = new FormData();
    formData.append('diseaseName', data.diseaseName);
    if (data.diagnosedDate) formData.append('diagnosedDate', data.diagnosedDate);
    if (data.diagnosingDoctor) formData.append('diagnosingDoctor', data.diagnosingDoctor);
    if (data.notes) formData.append('notes', data.notes);
    if (data.attachmentFile) formData.append('attachmentFile', data.attachmentFile);

    const response = await api.put(
      `/chronic-diseases/${chronicDiseaseId}`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    console.log('Cập nhật bệnh mãn tính thành công:', response.data);
    toast.success('Cập nhật thông tin bệnh mãn tính thành công!');
    return response.data;
  } catch (error) {
    console.error('Lỗi cập nhật bệnh mãn tính:', error);
    toast.error(error.response?.data?.message || 'Không thể cập nhật thông tin bệnh mãn tính');
    throw error;
  }
};

/**
 * Lấy danh sách tất cả bệnh mãn tính (phân trang, có bộ lọc)
 * @param {object} params - Tham số phân trang và bộ lọc: { page, size, sort, search, status, studentId, etc }
 * @returns {Promise<object>} Đối tượng Page chứa danh sách bệnh mãn tính
 */
export const getAllChronicDiseases = async (params = {}) => {
  try {
    const response = await api.get("/chronic-diseases", { params });
    console.log("Lấy danh sách tất cả bệnh mãn tính:", response.data);
    return response.data;
  } catch (error) {
    toast.error(error.response?.data?.message || "Không thể lấy danh sách bệnh mãn tính");
    throw error;
  }
};

/**
 * Lấy URL truy cập (đã ký) cho file bằng chứng của một bản ghi bệnh mãn tính
 * @param {number|string} chronicDiseaseId - ID bản ghi bệnh mãn tính
 * @returns {Promise<string>} URL để truy cập file
 */
export const getChronicDiseaseFileUrl = async (chronicDiseaseId) => {
  try {
    const response = await api.get(`/chronic-diseases/${chronicDiseaseId}/file-access-url`);
    console.log("Lấy URL file bệnh mãn tính:", response.data);
    return response.data;
  } catch (error) {
    toast.error(error.response?.data?.message || "Không thể lấy URL file bằng chứng");
    throw error;
  }
};

/**
 * Xóa bản ghi bệnh mãn tính
 * @param {number|string} chronicDiseaseId - ID bản ghi bệnh mãn tính
 * @returns {Promise<void>}
 */
export const deleteChronicDisease = async (chronicDiseaseId) => {
  try {
    await api.delete(`/chronic-diseases/${chronicDiseaseId}`);
    toast.success("Xóa bản ghi bệnh mãn tính thành công!");
  } catch (error) {
    toast.error(error.response?.data?.message || "Không thể xóa bản ghi bệnh mãn tính");
    throw error;
  }
};

