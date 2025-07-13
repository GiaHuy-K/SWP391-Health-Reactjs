import api from "../config/axios";
import { toast } from "react-toastify";

// Lấy danh sách tất cả vật tư y tế (phân trang)
export const getMedicalSupplies = async (params = { page: 0, size: 10 }) => {
  try {
    const response = await api.get("medical-supplies", { params });
    const raw = response.data;
    console.log("📦 getMedicalSupplies data:", raw);
    return raw; // Trả nguyên cả object: { content, totalElements, totalPages, ... }
  } catch (error) {
    toast.error("Không thể tải danh sách vật tư y tế");
    throw error;
  }
};

// Lấy thông tin vật tư y tế theo ID
export const getMedicalSupplyById = async (id) => {
  try {
    const res = await api.get(`medical-supplies/${id}`);
    return res.data;
  } catch (error) {
    toast.error("Không thể lấy thông tin vật tư");
    throw error;
  }
};

// Lấy lịch sử giao dịch của một vật tư y tế
export const getMedicalSupplyTransactions = async (supplyId) => {
  try {
    const res = await api.get(`medical-supplies/${supplyId}/transactions`);
    return res.data.content || [];
  } catch (error) {
    toast.error("Không thể tải lịch sử giao dịch");
    throw error;
  }
};

// Tạo mới một vật tư y tế
export const createMedicalSupply = async (data) => {
  try {
    const res = await api.post("medical-supplies", data);
    toast.success("Tạo vật tư thành công");
    return res.data;
  } catch (error) {
    toast.error("Tạo vật tư thất bại");
    throw error;
  }
};

// Cập nhật thông tin vật tư y tế
export const updateMedicalSupply = async (id, data) => {
  try {
    const res = await api.put(`medical-supplies/${id}`, data);
    toast.success("Cập nhật vật tư thành công");
    return res.data;
  } catch (error) {
    toast.error("Cập nhật vật tư thất bại");
    throw error;
  }
};

// Điều chỉnh số lượng tồn kho
export const adjustMedicalSupplyStock = async (id, stockData) => {
  try {
    const res = await api.post(`medical-supplies/${id}/stock-adjustment`, stockData);
    return res.data;
  } catch (error) {
    toast.error("Điều chỉnh tồn kho thất bại");
    throw error;
  }
};

// Xoá mềm vật tư (vô hiệu hóa)
export const softDeleteMedicalSupply = async (id) => {
  try {
    await api.post(`medical-supplies/${id}/dispose`);
    toast.success("Đã vô hiệu hóa vật tư");
  } catch (error) {
    toast.error("Vô hiệu hóa thất bại");
    throw error;
  }
};

// Xoá cứng vật tư
export const hardDeleteMedicalSupply = async (id) => {
  try {
    await api.delete(`medical-supplies/${id}/delete`);
    toast.success("Xoá vĩnh viễn vật tư thành công");
  } catch (error) {
    toast.error("Xoá vĩnh viễn thất bại");
    throw error;
  }
};
