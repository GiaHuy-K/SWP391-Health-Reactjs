import api from "../config/axios";
import { toast } from "react-toastify";

//  Lấy danh sách tất cả vật tư y tế (phân trang)
export const getMedicalSupplies = async () => {
  try {
    const response = await api.get("medical-supplies");
    const raw = response.data;
    // vì kiểu trả về là content array nên cần hàm này 
    const content = Array.isArray(raw.content) ? raw.content : [];
    //console.log(raw);
    console.log(content);
    return content;
  } catch (error) {
    toast.error("Không thể tải danh sách vật tư y tế");
    throw error;
  }
};

//  Lấy thông tin vật tư y tế theo ID
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
    const res = await api.post("/api/medical-supplies", data);
    toast.success("Tạo vật tư thành công");
    return res.data;
  } catch (error) {
    toast.error("Tạo vật tư thất bại");
    throw error;
  }
};

// Cập nhật thông tin (metadata) của một vật tư y tế
export const updateMedicalSupply = async (id, data) => {
  try {
    const res = await api.put(`/api/medical-supplies/${id}`, data);
    toast.success("Cập nhật vật tư thành công");
    return res.data;
  } catch (error) {
    toast.error("Cập nhật vật tư thất bại");
    throw error;
  }
};

//  Điều chỉnh số lượng tồn kho của vật tư y tế
export const adjustMedicalSupplyStock = async (id, stockData) => {
  try {
    const res = await api.post(`/api/medical-supplies/${id}/stock-adjustment`, stockData);
    toast.success("Điều chỉnh tồn kho thành công");
    return res.data;
  } catch (error) {
    toast.error("Điều chỉnh tồn kho thất bại");
    throw error;
  }
};

//  Xoá mềm một vật tư y tế (vô hiệu hóa)
export const deleteMedicalSupply = async (id) => {
  try {
    await api.delete(`/api/medical-supplies/${id}`);
    toast.success("Xoá vật tư thành công");
  } catch (error) {
    toast.error("Xoá vật tư thất bại");
    throw error;
  }
};
