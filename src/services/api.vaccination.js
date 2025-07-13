import { toast } from "react-toastify";
import api from "../config/axios";

// =============================
// API CHIẾN DỊCH TIÊM CHỦNG
// =============================

// 1. Lấy danh sách chiến dịch
export const getVaccinationCampaigns = async (params = {}) => {
  try {
    const res = await api.get("/vaccination/campaigns", { params });
    return res.data;
  } catch (err) {
    toast.error(err?.response?.data?.message || "Không thể lấy danh sách chiến dịch");
    throw err;
  }
};

// 2. Lấy chi tiết chiến dịch
export const getVaccinationCampaignDetail = async (id) => {
  try {
    const res = await api.get(`/vaccination/campaigns/${id}`);
    return res.data;
  } catch (err) {
    toast.error(err?.response?.data?.message || "Không thể lấy chi tiết chiến dịch");
    throw err;
  }
};

// 3. Lấy danh sách phiếu đồng ý theo chiến dịch
export const getCampaignConsents = async (campaignId, params = {}) => {
  try {
    const res = await api.get(`/vaccination/campaigns/${campaignId}/consents`, { params });
    return res.data;
  } catch (err) {
    toast.error(err?.response?.data?.message || "Không thể lấy danh sách phiếu đồng ý");
    throw err;
  }
};

// 4. Lấy chi tiết phiếu đồng ý
export const getConsentDetail = async (consentId) => {
  try {
    const res = await api.get(`/vaccination/consents/${consentId}`);
    return res.data;
  } catch (err) {
    toast.error(err?.response?.data?.message || "Không thể lấy chi tiết phiếu đồng ý");
    throw err;
  }
};

// 5. Tạo chiến dịch
export const createVaccinationCampaign = async (data) => {
  try {
    const res = await api.post("/vaccination/campaigns", data);
    toast.success("Tạo chiến dịch thành công!");
    return res.data;
  } catch (err) {
    toast.error(err?.response?.data?.message || "Không thể tạo chiến dịch");
    throw err;
  }
};

// 6. Cập nhật chiến dịch (DRAFT)
export const updateVaccinationCampaign = async (id, data) => {
  try {
    const res = await api.put(`/vaccination/campaigns/${id}`, data);
    toast.success("Cập nhật chiến dịch thành công!");
    return res.data;
  } catch (err) {
    toast.error(err?.response?.data?.message || "Không thể cập nhật chiến dịch");
    throw err;
  }
};

// 7. Lên lịch chiến dịch
export const scheduleVaccinationCampaign = async (id, data) => {
  try {
    const res = await api.post(`/vaccination/campaigns/${id}/schedule`, data);
    toast.success("Lên lịch chiến dịch thành công!");
    return res.data;
  } catch (err) {
    toast.error(err?.response?.data?.message || "Không thể lên lịch chiến dịch");
    throw err;
  }
};

// 8. Bắt đầu chiến dịch
export const startVaccinationCampaign = async (id) => {
  try {
    const res = await api.post(`/vaccination/campaigns/${id}/start`);
    toast.success("Bắt đầu chiến dịch thành công!");
    return res.data;
  } catch (err) {
    toast.error(err?.response?.data?.message || "Không thể bắt đầu chiến dịch");
    throw err;
  }
};

// 9. Đổi lịch chiến dịch
export const rescheduleVaccinationCampaign = async (id, data) => {
  try {
    const res = await api.post(`/vaccination/campaigns/${id}/reschedule`, data);
    toast.success("Đổi lịch chiến dịch thành công!");
    return res.data;
  } catch (err) {
    toast.error(err?.response?.data?.message || "Không thể đổi lịch chiến dịch");
    throw err;
  }
};

// 10. Hoàn thành chiến dịch
export const completeVaccinationCampaign = async (id) => {
  try {
    const res = await api.post(`/vaccination/campaigns/${id}/complete`);
    toast.success("Hoàn thành chiến dịch thành công!");
    return res.data;
  } catch (err) {
    toast.error(err?.response?.data?.message || "Không thể hoàn thành chiến dịch");
    throw err;
  }
};

// 11. Hủy chiến dịch
export const cancelVaccinationCampaign = async (id) => {
  try {
    const res = await api.post(`/vaccination/campaigns/${id}/cancel`);
    toast.success("Hủy chiến dịch thành công!");
    return res.data;
  } catch (err) {
    toast.error(err?.response?.data?.message || "Không thể hủy chiến dịch");
    throw err;
  }
};

// 12. Cập nhật phiếu đồng ý
export const updateConsent = async (consentId, data) => {
  try {
    const res = await api.put(`/vaccination/consents/${consentId}`, data);
    toast.success("Cập nhật phiếu đồng ý thành công!");
    return res.data;
  } catch (err) {
    toast.error(err?.response?.data?.message || "Không thể cập nhật phiếu đồng ý");
    throw err;
  }
}; 