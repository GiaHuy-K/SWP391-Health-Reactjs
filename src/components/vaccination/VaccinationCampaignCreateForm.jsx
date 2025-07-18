import React from "react";
import { Form, Input, Button, DatePicker, Select, Modal, Space, message } from "antd";
import { createVaccinationCampaign, updateVaccinationCampaign, CLASS_GROUP_OPTIONS } from "../../services/api.vaccination";
import dayjs from "dayjs";

const { TextArea } = Input;

const VaccinationCampaignCreateForm = ({ open, onClose, onSuccess, isEdit = false, initialValues = {}, onUpdate }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (open && isEdit && initialValues) {
      // Chuyển đổi ngày sang dayjs nếu có
      const values = { ...initialValues };
      if (values.vaccinationDate) values.vaccinationDate = dayjs(values.vaccinationDate);
      if (values.consentDeadline) values.consentDeadline = dayjs(values.consentDeadline);
      form.setFieldsValue(values);
    } else if (open && !isEdit) {
      form.resetFields();
    }
  }, [open, isEdit, initialValues, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      const payload = {
        campaignName: values.campaignName,
        vaccineName: values.vaccineName,
        vaccinationDate: values.vaccinationDate.format("YYYY-MM-DD"),
        targetClassGroup: values.targetClassGroup,
        ...(values.description ? { description: values.description } : {}),
        ...(values.targetAgeMin !== undefined && values.targetAgeMin !== null && values.targetAgeMin !== "" ? { targetAgeMin: Number(values.targetAgeMin) } : {}),
        ...(values.targetAgeMax !== undefined && values.targetAgeMax !== null && values.targetAgeMax !== "" ? { targetAgeMax: Number(values.targetAgeMax) } : {}),
        ...(values.notes ? { notes: values.notes } : {}),
        ...(values.healthcareProviderName ? { healthcareProviderName: values.healthcareProviderName } : {}),
        ...(values.healthcareProviderContact ? { healthcareProviderContact: values.healthcareProviderContact } : {}),
        ...(values.consentDeadline ? { consentDeadline: values.consentDeadline.format("YYYY-MM-DD") } : {}),
      };
      if (isEdit && initialValues.campaignId) {
        await updateVaccinationCampaign(initialValues.campaignId, payload);
        onUpdate?.();
        onClose();
      } else {
        await createVaccinationCampaign(payload);
        form.resetFields();
        onSuccess?.();
        onClose();
      }
    } catch (error) {
      if (error.errorFields) return;
      message.error(error?.response?.data?.message || (isEdit ? "Cập nhật chiến dịch thất bại" : "Tạo chiến dịch thất bại"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={isEdit ? "Chỉnh sửa chiến dịch tiêm chủng" : "Tạo chiến dịch tiêm chủng mới"}
      open={open}
      onCancel={() => { form.resetFields(); onClose(); }}
      onOk={handleSubmit}
      okText={isEdit ? "Cập nhật" : "Tạo mới"}
      cancelText="Hủy"
      confirmLoading={loading}
      destroyOnHidden
      width={800}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Tên chiến dịch"
          name="campaignName"
          rules={[{ required: true, message: "Vui lòng nhập tên chiến dịch" }]}
        >
          <Input placeholder="Nhập tên chiến dịch" />
        </Form.Item>
        <Form.Item
          label="Tên vắc-xin"
          name="vaccineName"
          rules={[{ required: true, message: "Vui lòng nhập tên vắc-xin" }]}
        >
          <Input placeholder="Nhập tên vắc-xin" />
        </Form.Item>
        <Form.Item
          label="Mô tả"
          name="description"
        >
          <TextArea rows={3} placeholder="Mô tả chiến dịch (không bắt buộc)" />
        </Form.Item>
        <Form.Item
          label={
            <span>
              Ngày tiêm chủng
              <span style={{ fontSize: '12px', color: '#666', fontWeight: 'normal', marginLeft: '8px' }}>
                (Không được trong tương lai)
              </span>
            </span>
          }
          name="vaccinationDate"
          rules={[{ required: true, message: "Vui lòng chọn ngày tiêm chủng" }]}
          extra={
            <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
              📅 Chọn ngày tiêm chủng cho chiến dịch 
            </div>
          }
        >
          <DatePicker 
            format="DD/MM/YYYY" 
            style={{ width: "100%" }}
            placeholder="Chọn ngày tiêm chủng"
            allowClear={false}
            showToday={true}
            inputReadOnly={false}
          />
        </Form.Item>
        <Form.Item
          label="Hạn chót gửi phiếu đồng ý"
          name="consentDeadline"
        >
          <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          label="Khối lớp học sinh được tiêm"
          name="targetClassGroup"
          rules={[{ required: true, message: "Vui lòng chọn khối lớp" }]}
        >
          <Select placeholder="Chọn khối lớp">
            {CLASS_GROUP_OPTIONS.map(opt => (
              <Select.Option key={opt.value} value={opt.value}>{opt.label}</Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Độ tuổi tối thiểu" name="targetAgeMin">
          <Input type="number" min={0} placeholder="Nhập tuổi tối thiểu (không bắt buộc)" />
        </Form.Item>
        <Form.Item label="Độ tuổi tối đa" name="targetAgeMax">
          <Input type="number" min={0} placeholder="Nhập tuổi tối đa (không bắt buộc)" />
        </Form.Item>
        <Form.Item label="Ghi chú" name="notes">
          <TextArea rows={2} placeholder="Ghi chú bổ sung (không bắt buộc)" />
        </Form.Item>
        <Form.Item label="Đơn vị y tế hỗ trợ" name="healthcareProviderName">
          <Input placeholder="Tên đơn vị y tế (không bắt buộc)" />
        </Form.Item>
        <Form.Item label="Liên hệ đơn vị y tế" name="healthcareProviderContact">
          <Input placeholder="Số điện thoại, email... (không bắt buộc)" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default VaccinationCampaignCreateForm; 