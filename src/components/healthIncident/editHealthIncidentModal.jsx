import React, { useEffect } from "react";
import { Modal, Form, Input, DatePicker, Select, Button } from "antd";
import dayjs from "dayjs";
import { updateHealthIncident } from "../../services/api.healthIncident";
import { toast } from "react-toastify";

const { TextArea } = Input;
const { Option } = Select;

function EditHealthIncidentModal({
  open,
  onClose,
  incidentData,
  onSuccess,
  incidentTypes = [],
}) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (incidentData) {
      form.setFieldsValue({
        incidentDateTime: dayjs(incidentData.incidentDateTime),
        incidentType: incidentData.incidentType,
        description: incidentData.description,
        actionTaken: incidentData.actionTaken,
        location: incidentData.location,
      });
    }
  }, [incidentData, form]);

  const handleFinish = async (values) => {
    console.log("🆔 incidentId = ", incidentData?.incidentId);

    const payload = {
      incidentDateTime: values.incidentDateTime.toISOString(),
      incidentType: values.incidentType,
      description: values.description,
      actionTaken: values.actionTaken,
      location: values.location,
    };

    try {
      await updateHealthIncident(incidentData.incidentId, payload);
      toast.success("Cập nhật sự cố thành công");
      onSuccess?.();
      onClose?.();
      form.resetFields();
    } catch (error) {
      const msg =
        error?.response?.data?.validationErrors?.actionTaken?.[0] ||
        error?.response?.data?.message ||
        "Đã xảy ra lỗi khi cập nhật";
      toast.error(msg);
    }
  };

  return (
    <Modal
      title="Cập nhật sự cố sức khỏe"
      open={open}
      onCancel={() => {
        onClose?.();
        form.resetFields();
      }}
      footer={null}
      destroyOnHidden
    >
      <Form layout="vertical" form={form} onFinish={handleFinish}>
        <Form.Item
          label="Thời gian sự cố"
          name="incidentDateTime"
          rules={[{ required: true, message: "Chọn thời gian sự cố" }]}
        >
          <DatePicker
            showTime
            style={{ width: "100%" }}
            disabledDate={(current) => current && current > dayjs()}
          />
        </Form.Item>

        <Form.Item
          label="Loại sự cố"
          name="incidentType"
          rules={[{ required: true, message: "Chọn loại sự cố" }]}
        >
          <Select placeholder="Chọn loại">
            {incidentTypes.map((type) => (
              <Option key={type} value={type}>
                {type}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Mô tả"
          name="description"
          rules={[{ required: true, message: "Nhập mô tả" }]}
        >
          <TextArea rows={3} />
        </Form.Item>

        <Form.Item
          label="Hành động xử lý"
          name="actionTaken"
          rules={[
            { required: true, message: "Nhập hành động xử lý" },
            { min: 10, max: 2000, message: "Từ 10 đến 2000 ký tự" },
          ]}
        >
          <TextArea rows={2} />
        </Form.Item>

        <Form.Item
          label="Địa điểm"
          name="location"
          rules={[{ required: true, message: "Nhập địa điểm" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Lưu thay đổi
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default EditHealthIncidentModal;
