import React, { useEffect } from "react";
import { Modal, Form, Input, DatePicker, Select } from "antd";
import dayjs from "dayjs";
import { updateStudentById, getStudentById } from "../../services/api.student";

const { Option } = Select;

const EditStudentModal = ({
  open,
  onClose,
  studentId,
  onSuccess,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (studentId && open) {
      (async () => {
        try {
          const data = await getStudentById(studentId);
          form.setFieldsValue({
            ...data,
            dateOfBirth: dayjs(data.dateOfBirth),
          });
        } catch (err) {
          // error đã toast trong getStudentById
            console.error("Lỗi khi lấy thông tin học sinh:", err);
            // Thông báo lỗi cho người dùng
        }
      })();
    }
  }, [studentId, open]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await updateStudentById(studentId, {
        ...values,
        dateOfBirth: dayjs(values.dateOfBirth).format("YYYY-MM-DD"),
      });
      onClose();
      onSuccess && onSuccess();
    } catch (err) {
      // Error handled
        console.error("Lỗi khi cập nhật thông tin học sinh:", err);
    }
  };

  return (
    <Modal
      title="Cập nhật học sinh"
      open={open}
      onCancel={onClose}
      onOk={handleOk}
      okText="Lưu"
      cancelText="Hủy"
    >
      <Form layout="vertical" form={form}>
        <Form.Item
          label="Họ tên"
          name="fullName"
          rules={[{ required: true, message: "Nhập họ tên" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Ngày sinh"
          name="dateOfBirth"
          rules={[{ required: true, message: "Chọn ngày sinh" }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Giới tính"
          name="gender"
          rules={[{ required: true, message: "Chọn giới tính" }]}
        >
          <Select>
            <Option value="Nam">Nam</Option>
            <Option value="Nữ">Nữ</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Khối lớp"
          name="classGroup"
          rules={[{ required: true, message: "Chọn khối lớp" }]}
        >
          <Select>
            <Option value="Mầm">Mầm</Option>
            <Option value="Chồi">Chồi</Option>
            <Option value="Lá">Lá</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Lớp"
          name="classValue"
          rules={[{ required: true, message: "Chọn lớp" }]}
        >
          <Select>
            {["A", "B", "C", "D", "E", "F", "G", "H"].map((c) => (
              <Option key={c} value={c}>
                {c}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditStudentModal;
