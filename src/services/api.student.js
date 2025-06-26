import { toast } from "react-toastify";
import api from "../config/axios";

//tạo const getStudent vì nhiều trang dùng phần này 
export const getStudent = async () => {
  try {
    const response = await api.get("students");
    const raw = response.data;
    // vì kiểu trả về là content array nên cần hàm này 
    const content = Array.isArray(raw.content) ? raw.content : [];
    //console.log(raw);
    console.log(content);
    return content;
  } catch (error) {
    toast.error(error.response.data);
  }
};

// lấy thông tin student theo id (dùng trong xem chi tiết ở dashboard admin, nurse, parent)
export const getStudentById = async (id) => {
    try {
      const res = await api.get(`/students/${id}`);
      return res.data;
    } catch (error) {
      toast.error("Không thể lấy chi tiết học sinh");
      throw error;
    }
  };
  
/**
 * Lấy danh sách tất cả thông tin tiêm chủng của một học sinh (phân trang)
 * @param {number|string} studentId - ID học sinh
 * @param {object} params - Tham số phân trang: { page, size, sort }
 * @returns {Promise<object>} Đối tượng Page chứa danh sách tiêm chủng
 */
export const getStudentVaccinations = async (studentId, params = {}) => {
  try {
    const response = await api.get(`/students/${studentId}/vaccinations`, { params });
    console.log("Lấy danh sách tiêm chủng cho học sinh:", response.data);
    return response.data;
  } catch (error) {
    toast.error(error.response?.data?.message || "Không thể lấy danh sách tiêm chủng");
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
    toast.error(error.response?.data?.message || "Không thể thêm mới thông tin tiêm chủng");
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
    toast.error(error.response?.data?.message || "Không thể cập nhật thông tin tiêm chủng");
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
    toast.error(error.response?.data?.message || "Không thể xoá thông tin tiêm chủng");
    throw error;
  }
};

/**
 * Duyệt/Thay đổi trạng thái bản ghi tiêm chủng
 * @param {number|string} vaccinationId - ID bản ghi tiêm chủng
 * @param {string} status - Trạng thái mới (ví dụ: 'APPROVED', 'REJECTED', ...)
 * @returns {Promise<object>} Bản ghi tiêm chủng đã cập nhật trạng thái
 */
export const updateVaccinationStatus = async (vaccinationId, status) => {
  try {
    const response = await api.patch(`/vaccinations/${vaccinationId}/status`, { status });
    toast.success("Cập nhật trạng thái tiêm chủng thành công!");
    return response.data;
  } catch (error) {
    toast.error(error.response?.data?.message || "Không thể cập nhật trạng thái tiêm chủng");
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
    toast.error(error.response?.data?.message || "Không thể lấy chi tiết tiêm chủng");
    throw error;
  }
};

