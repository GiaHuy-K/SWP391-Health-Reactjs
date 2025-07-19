import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  InputNumber,
  Space,
  TimePicker,
} from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { createHealthIncident } from "../../services/api.healthIncident";
import { getStudent } from "../../services/api.student";
import { getMedicalSupplies } from "../../services/api.medicalSupply";
import { toast } from "react-toastify";

const { TextArea } = Input;

function CreateHealthIncidentModal({
  open,
  onClose,
  onSuccess,
  incidentTypes = [],
}) {
  const [form] = Form.useForm();
  const [students, setStudents] = useState([]);
  const [supplies, setSupplies] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await getStudent({ page: 0, size: 1000 });
        setStudents(res.content || []);
      } catch {
        toast.error("Lỗi khi tải danh sách học sinh");
      }
    };
    fetchStudents();
  }, []);

  useEffect(() => {
    const fetchSupplies = async () => {
      try {
        const res = await getMedicalSupplies({ page: 0, size: 1000 });
        setSupplies(res.content || []);
      } catch {
        toast.error("Lỗi khi tải danh sách vật tư");
      }
    };
    fetchSupplies();
  }, []);

  const handleFinish = async (values) => {
    const today = dayjs().startOf("day");
    const incidentDateTime = today
      .hour(values.incidentTime.hour())
      .minute(values.incidentTime.minute())
      .second(0);

    const payload = {
      studentId: values.studentId,
      incidentDateTime: incidentDateTime.toISOString(),
      incidentType: values.incidentType,
      description: values.description,
      actionTaken: values.actionTaken,
      location: values.location,
      supplyUsages:
        values.supplyUsages?.map((item) => ({
          supplyId: item.supplyId,
          quantityUsed: item.quantityUsed,
          note: item.note,
        })) || [],
    };
    try {
      await createHealthIncident(payload);
      toast.success("Tạo sự cố thành công");
      form.resetFields();
      onSuccess?.();
    } catch (err) {
      toast.error(
        "Đã xảy ra lỗi: " +
          (err?.response?.data?.message || "Kiểm tra lại dữ liệu")
      );
    }
  };

  return (
    <Modal
      title="Thêm sự cố sức khỏe"
      open={open}
      onCancel={() => {
        onClose?.();
        form.resetFields();
      }}
      footer={null}
      destroyOnClose
    >
      <Form layout="vertical" form={form} onFinish={handleFinish}>
        <Form.Item
          label="Học sinh"
          name="studentId"
          rules={[{ required: true, message: "Vui lòng chọn học sinh" }]}
        >
          <Select
            showSearch
            placeholder="Chọn học sinh"
            optionFilterProp="label"
            options={students.map((s) => ({
              label: `${s.fullName} (${s.className})`,
              value: s.id,
            }))}
            filterOption={(input, option) =>
              option.label.toLowerCase().includes(input.toLowerCase())
            }
          />
        </Form.Item>

        <Form.Item
          label="Thời gian sự cố"
          name="incidentTime"
          rules={[{ required: true, message: "Chọn thời gian sự cố" }]}
        >
          <TimePicker
            style={{ width: "100%" }}
            format="HH:mm"
            disabledTime={() => {
              const now = dayjs();
              return {
                disabledHours: () =>
                  Array.from({ length: 24 }, (_, i) => i).filter(
                    (i) => i > now.hour()
                  ),
                disabledMinutes: (selectedHour) =>
                  selectedHour === now.hour()
                    ? Array.from({ length: 60 }, (_, i) => i).filter(
                        (i) => i > now.minute()
                      )
                    : [],
              };
            }}
          />
        </Form.Item>

        <Form.Item
          label="Loại sự cố"
          name="incidentType"
          rules={[{ required: true, message: "Chọn loại sự cố" }]}
        >
          <Select placeholder="Chọn loại">
            {incidentTypes.map((type) => (
              <Select.Option key={type} value={type}>
                {type}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Mô tả"
          name="description"
          rules={[
            { required: true, message: "Nhập mô tả sự cố" },
            { min: 10, message: "Ít nhất 10 ký tự" },
          ]}
        >
          <TextArea rows={3} />
        </Form.Item>

        <Form.Item
          label="Hành động xử lý"
          name="actionTaken"
          rules={[
            { required: true, message: "Nhập hành động xử lý" },
            { min: 10, message: "Ít nhất 10 ký tự" },
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

        <h4>Vật tư y tế sử dụng</h4>
        <Form.List name="supplyUsages" initialValue={[{}]}>
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space
                  key={key}
                  style={{ display: "flex", marginBottom: 8 }}
                  align="baseline"
                >
                  <Form.Item
                    {...restField}
                    name={[name, "supplyId"]}
                    rules={[{ required: true, message: "Chọn vật tư" }]}
                  >
                    <Select
                      showSearch
                      placeholder="Vật tư"
                      style={{ width: 160 }}
                      optionFilterProp="label"
                      options={supplies.map((s) => ({
                        label: s.name,
                        value: s.supplyId,
                      }))}
                      filterOption={(input, option) =>
                        option.label.toLowerCase().includes(input.toLowerCase())
                      }
                    />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "quantityUsed"]}
                    rules={[{ required: true, message: "Nhập SL" }]}
                  >
                    <InputNumber placeholder="SL" min={1} />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "note"]}
                    rules={[{ required: true, message: "Nhập ghi chú" }]}
                  >
                    <Input placeholder="Ghi chú" />
                  </Form.Item>

                  {fields.length > 1 && (
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  )}
                </Space>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  icon={<PlusOutlined />}
                  block
                >
                  Thêm vật tư
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Lưu sự cố
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default CreateHealthIncidentModal;