import React from "react";
import { Modal, Form, Select, Input, Button } from "antd";
import { addVaccinationRecord } from "../../../services/api.vaccineAtSchool";

const { Option } = Select;

function VaccinationRecordFormModal({ open, onClose, consentId, onSuccess }) {
  const [form] = Form.useForm();

  const handleFinish = async (values) => {
    try {
      await addVaccinationRecord({
        consentId,
        ...values,
      });
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Lỗi khi ghi nhận kết quả tiêm chủng:", error);
      // Error toast đã được xử lý trong API
    }
  };

  return (
    <Modal
      open={open}
      title="Ghi nhận kết quả tiêm chủng"
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <Form layout="vertical" form={form} onFinish={handleFinish}>
        <Form.Item
          name="status"
          label="Trạng thái"
          rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
        >
          <Select placeholder="Chọn trạng thái tiêm">
            <Option value="Đã hoàn thành">Đã hoàn thành</Option>
            <Option value="Vắng mặt">Vắng mặt</Option>
            <Option value="Từ chối">Từ chối</Option>
          </Select>
        </Form.Item>

        <Form.Item name="notes" label="Ghi chú">
          <Input.TextArea rows={3} placeholder="Ghi chú thêm nếu có" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Ghi nhận
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default VaccinationRecordFormModal;
