import React, { useState } from "react";
import { Modal, Form, Select, Input, Button } from "antd";
import { updateConsent } from "../../services/api.vaccination";

const { Option } = Select;

const VaccinationConsentEditModal = ({ open, onClose, consent, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      Modal.confirm({
        title: "Xác nhận cập nhật phiếu đồng ý",
        content: `Bạn chắc chắn muốn cập nhật phiếu đồng ý cho học sinh: ${consent?.studentName || ""}?`,
        okText: "Xác nhận",
        cancelText: "Huỷ",
        onOk: async () => {
          setLoading(true);
          try {
            await updateConsent(consent.id || consent._id, values);
            onSuccess && onSuccess();
            onClose();
          } finally {
            setLoading(false);
          }
        }
      });
    } catch {}
  };

  return (
    <Modal
      open={open}
      title={`Cập nhật phiếu đồng ý: ${consent?.studentName || ""}`}
      onCancel={onClose}
      onOk={handleOk}
      confirmLoading={loading}
      destroyOnHidden
      footer={[
        <Button key="back" onClick={onClose}>Huỷ</Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleOk}>Lưu</Button>
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          status: consent?.status,
          staffNote: consent?.staffNote || ""
        }}
      >
        <Form.Item name="status" label="Trạng thái" rules={[{ required: true, message: "Chọn trạng thái" }]}> 
          <Select>
            <Option value="Đồng ý">Đồng ý</Option>
            <Option value="Từ chối">Từ chối</Option>
          </Select>
        </Form.Item>
        <Form.Item name="staffNote" label="Ghi chú nhân viên">
          <Input.TextArea rows={3} placeholder="Nhập ghi chú (nếu có)" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default VaccinationConsentEditModal; 