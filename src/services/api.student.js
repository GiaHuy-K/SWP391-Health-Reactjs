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

