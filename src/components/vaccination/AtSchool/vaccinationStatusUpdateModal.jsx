
import React from "react";
import { Modal, Form, Input, Select, Button } from "antd";

const { Option } = Select;

function VaccinationStatusUpdateModal({
  open,
  onClose,
  onSubmit,
  submitting,
  initialValues,
}) {
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    onSubmit(values);
  };

  return (
    <Modal
      open={open}
      title="Cập nhật trạng thái tiêm chủng"
      onCancel={onClose}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={initialValues}
      >
        <Form.Item
          name="status"
          label="Trạng thái"
          rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
        >
          <Select placeholder="Chọn trạng thái">
            <Option value="COMPLETED">Đã hoàn thành</Option>
            <Option value="ABSENT">Vắng mặt</Option>
            <Option value="DECLINED">Từ chối</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="notes"
          label="Ghi chú"
          rules={[{ required: true, message: "Vui lòng nhập ghi chú" }]}
        >
          <Input.TextArea rows={3} placeholder="Nhập ghi chú" />
        </Form.Item>
        <Form.Item
          name="reasonForChange"
          label="Lý do cập nhật"
          rules={[{ required: true, message: "Vui lòng nhập lý do cập nhật" }]}
        >
          <Input.TextArea rows={2} placeholder="Nhập lý do" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={submitting} block>
            Cập nhật
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default VaccinationStatusUpdateModal;
