
import { toast } from "react-toastify";
import api from "../config/axios";

// 1. Lấy chi tiết bản ghi tiêm chủng
export const getVaccinationDetail = async (vaccinationId) => {
  try {
    const res = await api.get(`vaccination/records/${vaccinationId}`);
    return res.data;
  } catch (error) {
    toast.error("Không thể lấy chi tiết bản ghi tiêm chủng");
    throw error;
  }
};

// 2. Lấy bản ghi theo dõi sau tiêm
export const getVaccinationMonitoring = async (vaccinationId) => {
  try {
    const res = await api.get(`vaccination/records/${vaccinationId}/monitoring`);
    return res.data;
  } catch (error) {
    toast.error("Không thể lấy theo dõi sau tiêm");
    throw error;
  }
};

// 3. Lấy danh sách tiêm chủng theo chiến dịch
export const getVaccinationRecordsByCampaign = async (campaignId, params = {}) => {
  try {
    const res = await api.get(`vaccination/records/campaign/${campaignId}`, { params });
    return res.data;
  } catch (error) {
    toast.error("Không thể tải danh sách bản ghi tiêm chủng");
    throw error;
  }
};

// 4. Tạo mới bản ghi tiêm chủng
export const addVaccinationRecord = async (data) => {
  try {
    const res = await api.post(`vaccination/records`, data);
    toast.success("Ghi nhận tiêm chủng thành công");
    return res.data;
  } catch (error) {
    toast.error("Ghi nhận tiêm chủng thất bại");
    throw error;
  }
};

// 5. Tạo mới bản ghi theo dõi sau tiêm
export const addVaccinationMonitoring = async (data) => {
  try {
    const res = await api.post(`vaccination/records/monitoring`, data);
    toast.success("Ghi nhận theo dõi sau tiêm thành công");
    return res.data;
  } catch (error) {
    toast.error("Ghi nhận theo dõi thất bại");
    throw error;
  }
};

// 6. Cập nhật bản ghi tiêm chủng
export const updateVaccinationStatus = async (vaccinationId, data) => {
  try {
    const res = await api.put(`vaccination/records/${vaccinationId}`, data);
    toast.success("Cập nhật trạng thái tiêm chủng thành công");
    return res.data;
  } catch (error) {
    toast.error("Cập nhật trạng thái thất bại");
    throw error;
  }
};

// 7. Cập nhật bản ghi theo dõi sau tiêm
export const updateVaccinationMonitoring = async (monitoringId, data) => {
  try {
    const res = await api.put(`vaccination/records/monitoring/${monitoringId}`, data);
    toast.success("Cập nhật theo dõi sau tiêm thành công");
    return res.data;
  } catch (error) {
    toast.error("Cập nhật theo dõi sau tiêm thất bại");
    throw error;
  }
};
