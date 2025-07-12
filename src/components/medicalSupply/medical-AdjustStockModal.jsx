import React from "react";
import { Modal, Form, InputNumber, Select, Input } from "antd";

const { Option } = Select;

const AdjustStockModal = ({ open, onClose, onSubmit, supplyName }) => {
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
      form.resetFields();
    } catch {
      // Do nothing if validation fails
      // The error will be shown by Ant Design's Form component
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={`Điều chỉnh tồn kho - ${supplyName || ""}`}
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="Xác nhận"
      cancelText="Hủy"
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="quantity"
          label="Số lượng"
          rules={[{ required: true }]}
        >
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          name="transactionType"
          label="Loại điều chỉnh"
          rules={[{ required: true }]}
        >
          <Select
            placeholder="Chọn loại điều chỉnh"
            value={form.getFieldValue("transactionType")}
            onChange={(value) => form.setFieldValue("transactionType", value)}
          >
            <Option value="Điều chỉnh tăng">Nhập kho mới</Option>       
            <Option value="Điều chỉnh giảm">Điều chỉnh giảm</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="note"
          label="Ghi chú"
          rules={[{ max: 255 }]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AdjustStockModal;
