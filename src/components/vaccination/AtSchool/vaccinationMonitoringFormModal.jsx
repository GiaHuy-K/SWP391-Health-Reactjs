import React, { useEffect } from "react";
import { Modal, Form, Input, InputNumber, Switch } from "antd";

function VaccinationMonitoringFormModal({
  open,
  onClose,
  onSubmit,
  submitting,
  initialValues,
}) {
  const [form] = Form.useForm();

  // Reset form khi mở modal
  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        ...initialValues,
        hasSideEffects: Boolean(initialValues?.hasSideEffects),
      });
    }
  }, [open, initialValues, form]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      onSubmit({ ...initialValues, ...values });
    });
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={handleOk}
      confirmLoading={submitting}
      title="Ghi nhận theo dõi sau tiêm"
      okText="Ghi nhận"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Nhiệt độ (°C)"
          name="temperature"
          rules={[{ required: true, message: "Vui lòng nhập nhiệt độ" }]}
        >
          <InputNumber min={34} max={42} step={0.1} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Có phản ứng phụ không?"
          name="hasSideEffects"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item label="Mô tả phản ứng phụ" name="sideEffectsDescription">
          <Input.TextArea rows={2} />
        </Form.Item>

        <Form.Item label="Hành động đã thực hiện" name="actionsTaken">
          <Input.TextArea rows={2} />
        </Form.Item>

        <Form.Item label="Ghi chú khác" name="notes">
          <Input.TextArea rows={2} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default VaccinationMonitoringFormModal;
