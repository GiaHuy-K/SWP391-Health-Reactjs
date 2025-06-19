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
  

