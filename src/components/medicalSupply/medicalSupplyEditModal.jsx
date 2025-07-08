import React, { useEffect } from "react";
import { Modal, Form, Input, Select, DatePicker, message } from "antd";
import dayjs from "dayjs";
import api from "../../config/axios";
import { toast } from "react-toastify";

const { Option } = Select;

const EditMedicalSupplyModal = ({ open, onClose, supply, onSuccess }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (supply) {
      form.setFieldsValue({
        ...supply,
        expiredDate: supply.expiredDate ? dayjs(supply.expiredDate) : null,
      });
    }
  }, [supply, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        expiredDate: values.expiredDate
          ? dayjs(values.expiredDate).format("YYYY-MM-DD")
          : null,
      };

      await api.put(`/medical-supplies/${supply.supplyId}`, payload);
      message.success("Cập nhật thành công");
      onClose();
      onSuccess?.(); // Gọi lại để refresh danh sách

    } catch (error) {
      message.error("Lỗi khi cập nhật");
      console.log(error.response);
      toast.error(error.response.data.message || "Cập nhật thất bại");
    }
  };

  return (
    <Modal
      open={open}
      title="Cập nhật thông tin vật tư"
      onCancel={onClose}
      onOk={handleSubmit}
      okText="Lưu"
      cancelText="Hủy"
    >
      <Form layout="vertical" form={form}>
        <Form.Item label="Tên vật tư" name="name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Loại" name="category" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Đơn vị" name="unit" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Mô tả" name="description">
          <Input.TextArea />
        </Form.Item>

        <Form.Item label="Hạn sử dụng" name="expiredDate">
          <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditMedicalSupplyModal;
