import { toast } from "react-toastify";
import api from "../config/axios";

// Lấy danh sách sự cố sức khỏe -done
export const getHealthIncidents = async (params = {}) => {
  try {
    const res = await api.get("/health-incidents", { params });
    return res.data;
  } catch (error) {
    toast.error("Không thể lấy danh sách sự cố");
    throw error;
  }
};

// Lấy chi tiết sự cố -done
export const getHealthIncidentById = async (id) => {
  try {
    const res = await api.get(`/health-incidents/${id}`);
    return res.data;
  } catch (error) {
    toast.error("Không thể lấy chi tiết sự cố");
    throw error;
  }
};

// Tạo mới sự cố - done
export const createHealthIncident = async (data) => {
  try {
    const res = await api.post("/health-incidents", data);
    return res.data;
  } catch (error) {
    toast.error(
      error?.response?.data?.message ||
        error?.response?.data?.validationErrors?.[
          Object.keys(error.response.data.validationErrors)[0]
        ]?.[0] ||
        "Cập nhật thất bại"
    );

    throw error;
  }
};

// Cập nhật sự cố
export const updateHealthIncident = async (id, data) => {
  try {
    const res = await api.put(`/health-incidents/${id}`, data);
    return res.data;
  } catch (error) {
    toast.error(
      error?.response?.data?.message ||
        error?.response?.data?.validationErrors?.[
          Object.keys(error.response.data.validationErrors)[0]
        ]?.[0] ||
        "Cập nhật thất bại"
    );

    throw error;
  }
};

// Xoá sự cố ( vô hiệu hóa sự cố theo id)
export const deleteHealthIncident = async (id) => {
  try {
    await api.delete(`/health-incidents/${id}`);
    toast.success("Xóa sự cố thành công");
  } catch (error) {
    toast.error("Xóa thất bại");
    throw error;
  }
};
