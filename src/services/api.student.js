import { toast } from "react-toastify";
import api from "../config/axios";

//tạo const getStudent vì nhiều trang dùng phần này 
export const getStudent = async () => {
  try {
    const response = await api.get("students");
    const raw = response.data;
    const content = Array.isArray(raw.content) ? raw.content : [];
    //console.log(raw);
    console.log(content);
    return content;
  } catch (error) {
    toast.error(error.response.data);
  }
};



