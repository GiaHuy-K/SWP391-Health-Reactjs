import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Card,
  Space,
} from "antd";
import api from "../../config/axios";
import {
  PlusOutlined,
  SolutionOutlined,
  MedicineBoxOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";

const { Option } = Select;
// Component để tạo tài khoản nhân viên y tế
// Sử dụng Ant Design cho giao diện và axios để gọi API
const AddAccount = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    role: "Nhân viên Y tế",
  });
  // Lưu trữ dữ liệu form và lỗi
  // formData: chứa dữ liệu nhập vào từ người dùng
  const [errors, setErrors] = useState({});
  // errors: chứa thông báo lỗi cho từng trường
  // Ví dụ: { fullName: "Họ và tên là bắt buộc", email: "Email không hợp lệ" }
  // Hàm validateField để kiểm tra tính hợp lệ của từng trường
  // Dựa trên giá trị nhập vào, nó sẽ cập nhật state errors
  // Nếu trường hợp không hợp lệ, nó sẽ thêm thông báo lỗi vào errors
  // Nếu hợp lệ, nó sẽ xóa thông báo lỗi tương ứng
  const validateField = (name, value) => {
    const newErrors = { ...errors };
    // Kiểm tra từng trường hợp dựa trên tên trường
    // name: tên trường cần kiểm tra (ví dụ: fullName, email, phoneNumber, role)
    // value: giá trị nhập vào của trường đó
    switch (name) {
      case "fullName":
        if (!value) newErrors.fullName = "Họ và tên là bắt buộc";
        else if (value.length < 2)
          newErrors.fullName = "Tên phải có ít nhất 2 ký tự";
        else if (!/^[\p{L}\s]+$/u.test(value))
          newErrors.fullName = "Chỉ cho phép chữ cái và khoảng trắng (có dấu)";
        else delete newErrors.fullName;
        break;
      // Kiểm tra định dạng email
      // Sử dụng regex để kiểm tra định dạng email hợp lệ
      case "email":
        if (!value) newErrors.email = "Email là bắt buộc";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          newErrors.email = "Định dạng email không hợp lệ";
        else delete newErrors.email;
        break;
      // Kiểm tra định dạng số điện thoại Việt Nam
      // Bắt đầu bằng 0 và theo các đầu số 03, 05, 07, 08, 09
      // Số điện thoại phải có 10 chữ số
      case "phoneNumber":
        if (!value)
          newErrors.phoneNumber = "Số điện thoại là bắt buộc";
        else if (!/^0(3|5|7|8|9)[0-9]{8}$/.test(value))
          newErrors.phoneNumber =
            "Số điện thoại không hợp lệ, phải bắt đầu bằng 0 và theo đầu số Việt Nam";
        else delete newErrors.phoneNumber;
        break;
      // Kiểm tra vai trò
      // Nếu không chọn vai trò, hiển thị thông báo lỗi
      case "role":
        if (!value) newErrors.role = "Vui lòng chọn vai trò";
        else delete newErrors.role;
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  // Hàm handleChange để cập nhật dữ liệu form
  // Khi người dùng nhập dữ liệu vào các trường, nó sẽ cập nhật state formData
  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };
  // Hàm handleReset để đặt lại dữ liệu form về giá trị mặc định
  // Khi người dùng nhấn nút Reset, nó sẽ xóa tất cả dữ liệu
  const handleReset = () => {
    setFormData({
      fullName: "",
      email: "",
      phoneNumber: "",
      role: "Nhân viên Y tế",
    }); 
    // Đặt lại dữ liệu form về giá trị mặc định
    setErrors({});  
    toast.info("📄 Đã reset form");
  };
  // Hàm handleSubmit để gửi dữ liệu form đến API
  // Khi người dùng nhấn nút Tạo tài khoản, nó sẽ kiểm tra tính hợp lệ của dữ liệu
  // Nếu dữ liệu hợp lệ, nó sẽ gửi yêu cầu POST đến API để tạo tài khoản mới
  // Nếu có lỗi từ API, nó sẽ hiển thị thông báo lỗi tương ứng
  const handleSubmit = async () => {
    const isValid = Object.keys(formData).every((key) =>
      validateField(key, formData[key])
    );

    if (!isValid) {
      toast.error("⚠️ Vui lòng kiểm tra lại thông tin!");
      return;
    }

    try {
      await api.post("/admin/users/staff", formData);
      toast.success("🎉 Tạo tài khoản thành công!");
      handleReset();
    } catch (error) {
      console.error("Tạo tài khoản lỗi:", error);

      const apiMsg = error.response?.data?.message;

        
      if (
        apiMsg &&
        apiMsg.toLowerCase().includes("email") &&
        apiMsg.toLowerCase().includes("tồn tại")
      ) {
        setErrors((prev) => ({
          ...prev,
          email: "Email đã tồn tại trên hệ thống",
        }));
      }

      toast.error(apiMsg || "❌ Tạo tài khoản thất bại!");
    }
  };

  return (
    <Card
      title="Tạo Tài Khoản Nhân Viên"
       variant="borderless"
      style={{ maxWidth: 600, margin: "auto" }}
    >
      {/* Sử dụng Ant Design Card để hiển thị tiêu đề và nội dung */}
      {/* Form để nhập thông tin tài khoản */}
      <Form layout="vertical">
        <Form.Item
          label="Họ và tên"
          validateStatus={errors.fullName ? "error" : ""}
          help={errors.fullName}
        >
          <Input
            name="fullName"
            placeholder="VD: Trần Thị B"
            value={formData.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
          />
        </Form.Item>

        <Form.Item
          label="Email"
          validateStatus={errors.email ? "error" : ""}
          help={errors.email}
        >
          <Input
            name="email"
            placeholder="staff@school.edu.vn"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
        </Form.Item>

        <Form.Item
          label="Số điện thoại"
          validateStatus={errors.phoneNumber ? "error" : ""}
          help={errors.phoneNumber}
        >
          <Input
            name="phoneNumber"
            placeholder="0987654321"
            value={formData.phoneNumber}
            onChange={(e) => handleChange("phoneNumber", e.target.value)}
          />
        </Form.Item>

        <Form.Item
          label="Vai trò"
          validateStatus={errors.role ? "error" : ""}
          help={errors.role}
        >
          <Select
            value={formData.role}
            onChange={(value) => handleChange("role", value)}
          >
            <Option value="Nhân viên Y tế">
              <MedicineBoxOutlined /> Nhân viên y tế
            </Option>
            <Option value="Quản lý Nhân sự/Nhân viên">
              <SolutionOutlined /> Quản lý y tế
            </Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Space style={{ width: "100%", justifyContent: "end" }}>
            <Button icon={<ReloadOutlined />} onClick={handleReset}>
              Reset
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleSubmit}
            >
              Tạo tài khoản
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default AddAccount;
