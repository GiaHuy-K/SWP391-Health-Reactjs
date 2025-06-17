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

const AddAccount = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    role: "MedicalStaff",
  });

  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case "fullName":
        if (!value) newErrors.fullName = "Họ và tên là bắt buộc";
        else if (value.length < 2)
          newErrors.fullName = "Tên phải có ít nhất 2 ký tự";
        else if (!/^[\p{L}\s]+$/u.test(value))
          newErrors.fullName = "Chỉ cho phép chữ cái và khoảng trắng (có dấu)";
        else delete newErrors.fullName;
        break;

      case "email":
        if (!value) newErrors.email = "Email là bắt buộc";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          newErrors.email = "Định dạng email không hợp lệ";
        else delete newErrors.email;
        break;

      case "phoneNumber":
        if (!value)
          newErrors.phoneNumber = "Số điện thoại là bắt buộc";
        else if (!/^0(3|5|7|8|9)[0-9]{8}$/.test(value))
          newErrors.phoneNumber =
            "Số điện thoại không hợp lệ, phải bắt đầu bằng 0 và theo đầu số Việt Nam";
        else delete newErrors.phoneNumber;
        break;

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

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const handleReset = () => {
    setFormData({
      fullName: "",
      email: "",
      phoneNumber: "",
      role: "MedicalStaff",
    });
    setErrors({});
    toast.info("📄 Đã reset form");
  };

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

      // Nếu backend báo email đã tồn tại thì bắt riêng
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
            <Option value="MedicalStaff">
              <MedicineBoxOutlined /> Nhân viên y tế
            </Option>
            <Option value="StaffManager">
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
