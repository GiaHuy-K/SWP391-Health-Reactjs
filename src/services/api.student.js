import { toast } from "react-toastify";
import api from "../config/axios";

//tạo const getStudent vì nhiều trang dùng phần này
export const getStudent = async (params = { page: 0, size: 10 }) => {
  try {
    const response = await api.get("students", { params });
    const raw = response.data;
    // console.log("📦 getStudent data:", raw);
    return raw; 
  } catch (error) {
    toast.error(error.response.data);
  }
};

// lấy thông tin student theo id (dùng trong xem chi tiết ở dashboard admin, nurse, parent)
export const getStudentById = async (id) => {
  try {
    const res = await api.get(`students/${id}`);
    console.log("getStudentById response:");
    console.log(res);
    console.log(res.data);
    return res.data;
  } catch (error) {
    toast.error("Không thể lấy chi tiết học sinh");
    throw error;
  }
};

// Đánh dấu học sinh đã thôi học
export const withdrawStudent = async (studentId) => {
  try {
    const res = await api.post(`students/${studentId}/withdraw`);
    toast.success("Đã đánh dấu thôi học");
    return res.data;
  } catch (error) {
    toast.error("Không thể đánh dấu thôi học");
    throw error;
  }
};

// Đánh dấu học sinh đã tốt nghiệp
export const graduateStudent = async (studentId) => {
  try {
    const res = await api.post(`students/${studentId}/graduate`);
    toast.success("Đã đánh dấu tốt nghiệp");
    return res.data;
  } catch (error) {
    toast.error("Không thể đánh dấu tốt nghiệp");
    throw error;
  }
};
// Cập nhật thông tin học sinh theo ID
export const updateStudentById = async (studentId, payload) => {
  try {
    const res = await api.put(`students/${studentId}`, payload);
    toast.success("Cập nhật thông tin học sinh thành công");
    return res.data;
  } catch (error) {
    toast.error("Cập nhật thông tin học sinh thất bại");
    console.error(error);
    throw error;
  }
};
