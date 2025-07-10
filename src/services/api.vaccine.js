import { toast } from "react-toastify";
import api from "../config/axios";

const isDev = process.env.NODE_ENV === "development";

/**
 * Lấy danh sách tất cả thông tin tiêm chủng của một học sinh (phân trang)
 * @param {number|string} id - ID học sinh
 * @param {object} params - Tham số phân trang: { page, size, sort }
 * @returns {Promise<object>} Đối tượng Page chứa danh sách tiêm chủng
 */
export const getStudentVaccinations = async (id, params = {}) => {
  try {
    const response = await api.get(`/students/${id}/vaccinations`, { params });
    if (isDev) console.log("Lấy danh sách tiêm chủng cho học sinh:", response.data);
    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.message || "Không thể lấy danh sách tiêm chủng");
    throw error;
  }
};

/**
 * Thêm mới thông tin tiêm chủng cho học sinh
 * @param {number|string} studentId - ID học sinh
 * @param {object} data - Dữ liệu tiêm chủng mới
 * @returns {Promise<object>} Bản ghi tiêm chủng vừa tạo
 */
export const addStudentVaccination = async (studentId, data) => {
  try {
    const response = await api.post(`/students/${studentId}/vaccinations`, data);
    toast.success("Thêm mới thông tin tiêm chủng thành công!");
    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.message || "Không thể thêm mới thông tin tiêm chủng");
    throw error;
  }
};

/**
 * Cập nhật thông tin tiêm chủng cho học sinh
 * @param {number|string} vaccinationId - ID bản ghi tiêm chủng
 * @param {object} data - Dữ liệu cập nhật
 * @returns {Promise<object>} Bản ghi tiêm chủng đã cập nhật
 */
export const updateStudentVaccination = async (vaccinationId, data) => {
  try {
    const response = await api.put(`/vaccinations/${vaccinationId}`, data);
    toast.success("Cập nhật thông tin tiêm chủng thành công!");
    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.message || "Không thể cập nhật thông tin tiêm chủng");
    throw error;
  }
};

/**
 * Xoá thông tin tiêm chủng
 * @param {number|string} vaccinationId - ID bản ghi tiêm chủng
 * @returns {Promise<void>}
 */
export const deleteStudentVaccination = async (vaccinationId) => {
  try {
    await api.delete(`/vaccinations/${vaccinationId}`);
    toast.success("Xoá thông tin tiêm chủng thành công!");
  } catch (error) {
    toast.error(error?.response?.data?.message || "Không thể xoá thông tin tiêm chủng");
    throw error;
  }
};

/**
 * Duyệt/Thay đổi trạng thái bản ghi tiêm chủng
 * @param {number|string} vaccinationId - ID bản ghi tiêm chủng
 * @param {string} newStatus - Trạng thái mới (APPROVE hoặc REJECTED)
 * @param {string} approverNotes - Ghi chú của người duyệt (tùy chọn)
 * @returns {Promise<object>} Bản ghi tiêm chủng đã cập nhật trạng thái
 */
export const updateVaccinationStatus = async (vaccinationId, newStatus, approverNotes = "") => {
  try {
    const response = await api.patch(`/vaccinations/${vaccinationId}/status`, {
      newStatus,
      approverNotes,
    });
    toast.success("Cập nhật trạng thái tiêm chủng thành công!");
    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.message || "Không thể cập nhật trạng thái tiêm chủng");
    throw error;
  }
};

/**
 * Lấy chi tiết 1 bản ghi tiêm chủng
 * @param {number|string} vaccinationId
 * @returns {Promise<object>}
 */
export const getVaccinationDetail = async (vaccinationId) => {
  try {
    const response = await api.get(`/vaccinations/${vaccinationId}`);
    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.message || "Không thể lấy chi tiết tiêm chủng");
    throw error;
  }
};

/**
 * Lấy danh sách tất cả thông tin tiêm chủng (phân trang, có bộ lọc)
 * @param {object} params - Tham số phân trang và bộ lọc: { page, size, sort, search, status, studentId, etc }
 * @returns {Promise<object>} Đối tượng Page chứa danh sách tiêm chủng
 */
export const getAllVaccinations = async (params = {}) => {
  try {
    const response = await api.get("/vaccinations", { params });
    if (isDev) console.log("Lấy danh sách tất cả tiêm chủng:", response.data);
    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.message || "Không thể lấy danh sách tiêm chủng");
    throw error;
  }
};

/**
 * Lấy danh sách các bản ghi tiêm chủng đang chờ duyệt
 * @param {object} params - Tham số phân trang: { page, size, sort }
 * @returns {Promise<object>} Đối tượng Page chứa danh sách tiêm chủng chờ duyệt
 */
export const getPendingVaccinations = async (params = {}) => {
  try {
    const response = await api.get("/vaccinations/pending", { params });
    if (isDev) console.log("Lấy danh sách tiêm chủng chờ duyệt:", response.data);
    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.message || "Không thể lấy danh sách tiêm chủng chờ duyệt");
    throw error;
  }
};

/**
 * Lấy URL truy cập (đã ký) cho file bằng chứng của một bản ghi tiêm chủng
 * @param {number|string} vaccinationId - ID bản ghi tiêm chủng
 * @returns {Promise<string>} URL để truy cập file
 */
export const getVaccinationFileUrl = async (vaccinationId) => {
  try {
    const response = await api.get(`/vaccinations/${vaccinationId}/file-access-url`);
    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.message || "Không thể lấy URL file bằng chứng");
    throw error;
  }
};
