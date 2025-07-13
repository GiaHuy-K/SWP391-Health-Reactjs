import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Space,
  Tag,
  message,
  Popconfirm,
  Drawer,
  Descriptions,
  Divider,
  notification,
} from "antd";
import dayjs from "dayjs";
import {
  getVaccinationCampaigns,
  getVaccinationCampaignDetail,
  createVaccinationCampaign,
  scheduleVaccinationCampaign,
  startVaccinationCampaign,
  completeVaccinationCampaign,
  cancelVaccinationCampaign,
  rescheduleVaccinationCampaign,
  getCampaignConsents,
  updateVaccinationCampaign,
} from "../../services/api.vaccination";

const { Option } = Select;

const CAMPAIGN_STATUS = {
  DRAFT: { color: "default", text: "Nháp" },
  SCHEDULED: { color: "blue", text: "Đã lên lịch" },
  STARTED: { color: "gold", text: "Đang diễn ra" },
  COMPLETED: { color: "green", text: "Đã hoàn thành" },
  CANCELLED: { color: "red", text: "Đã hủy" },
};

const ManageCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form] = Form.useForm();
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [detailDrawer, setDetailDrawer] = useState(false);
  const [consents, setConsents] = useState([]);
  const [consentLoading, setConsentLoading] = useState(false);
  const [scheduleModal, setScheduleModal] = useState(false);
  const [scheduleForm] = Form.useForm();
  const [rescheduleModal, setRescheduleModal] = useState(false);
  const [rescheduleForm] = Form.useForm();

  // Lấy danh sách chiến dịch
  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const res = await getVaccinationCampaigns();
      // Dùng campaignId làm định danh duy nhất
      const data = (res.content || res || []);
      setCampaigns(data);
    } catch (err) {
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  // Xem chi tiết chiến dịch
  const handleViewDetail = async (record) => {
    if (!record.campaignId) return;
    setSelectedCampaign(null);
    setDetailDrawer(true);
    try {
      const detail = await getVaccinationCampaignDetail(record.campaignId);
      setSelectedCampaign(detail);
      // Lấy consents
      setConsentLoading(true);
      const consentRes = await getCampaignConsents(record.campaignId);
      setConsents(consentRes.content || []);
    } catch (err) {
      setSelectedCampaign(null);
      setConsents([]);
    } finally {
      setConsentLoading(false);
    }
  };

  // Tạo mới chiến dịch
  const handleCreate = async (values) => {
    try {
      // Kiểm tra kiểu dữ liệu ngày tháng
      if (!values.vaccinationDate || !values.consentDeadline) {
        message.error("Vui lòng chọn ngày hợp lệ!");
        return;
      }
      const payload = {
        ...values,
        vaccinationDate: values.vaccinationDate.format("YYYY-MM-DD"),
        consentDeadline: values.consentDeadline.format("YYYY-MM-DD"),
        targetClassGroup: values.targetClassGroup, // là chuỗi
      };
      await createVaccinationCampaign(payload);
      setShowForm(false);
      form.resetFields();
      fetchCampaigns();
    } catch (err) {
      if (err?.response?.data?.message) {
        message.error(err.response.data.message);
      } else {
        message.error("Tạo chiến dịch thất bại. Vui lòng kiểm tra lại dữ liệu!");
      }
      console.error("Lỗi tạo chiến dịch:", err);
    }
  };

  // Lên lịch chiến dịch
  const handleSchedule = async (campaignId, values) => {
    if (!campaignId) return;
    try {
      await scheduleVaccinationCampaign(campaignId, {
        vaccinationDate: values.vaccinationDate.format("YYYY-MM-DD"),
        consentDeadline: values.consentDeadline.format("YYYY-MM-DD"),
      });
      setScheduleModal(false);
      scheduleForm.resetFields();
      fetchCampaigns();
    } catch (err) {}
  };

  // Đổi lịch chiến dịch
  const handleReschedule = async (campaignId, values) => {
    if (!campaignId) return;
    try {
      await rescheduleVaccinationCampaign(campaignId, {
        vaccinationDate: values.vaccinationDate.format("YYYY-MM-DD"),
        consentDeadline: values.consentDeadline.format("YYYY-MM-DD"),
      });
      setRescheduleModal(false);
      rescheduleForm.resetFields();
      fetchCampaigns();
    } catch (err) {}
  };

  // Bắt đầu chiến dịch
  const handleStart = async (campaignId) => {
    if (!campaignId) return;
    try {
      await startVaccinationCampaign(campaignId);
      fetchCampaigns();
    } catch (err) {}
  };

  // Hoàn thành chiến dịch
  const handleComplete = async (campaignId) => {
    if (!campaignId) return;
    try {
      await completeVaccinationCampaign(campaignId);
      fetchCampaigns();
    } catch (err) {}
  };

  // Hủy chiến dịch
  const handleCancel = async (campaignId) => {
    if (!campaignId) return;
    try {
      await cancelVaccinationCampaign(campaignId);
      fetchCampaigns();
    } catch (err) {}
  };

  // Cập nhật nháp (nếu cần)
  const handleUpdateDraft = async (id, values) => {
    try {
      await updateVaccinationCampaign(id, values);
      fetchCampaigns();
    } catch (err) {}
  };

  // Table columns
  const columns = [
    {
      title: "Tên chiến dịch",
      dataIndex: "campaignName",
      key: "campaignName",
      render: (text, record) => (
        <Button type="link" onClick={() => handleViewDetail(record)}>
          {text}
        </Button>
      ),
    },
    {
      title: "Vắc-xin",
      dataIndex: "vaccineName",
      key: "vaccineName",
    },
    {
      title: "Ngày tiêm",
      dataIndex: "vaccinationDate",
      key: "vaccinationDate",
      render: (date) => (date ? dayjs(date).format("DD/MM/YYYY") : "-")
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={CAMPAIGN_STATUS[status]?.color || "default"}>
          {CAMPAIGN_STATUS[status]?.text || status}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space>
          {record.status === "DRAFT" && record.campaignId && (
            <Button onClick={() => {
              setScheduleModal(record.campaignId);
              scheduleForm.setFieldsValue({
                vaccinationDate: record.vaccinationDate ? dayjs(record.vaccinationDate) : null,
                consentDeadline: record.consentDeadline ? dayjs(record.consentDeadline) : null,
              });
            }}>Lên lịch</Button>
          )}
          {record.status === "SCHEDULED" && record.campaignId && (
            <Button type="primary" onClick={() => handleStart(record.campaignId)}>Bắt đầu</Button>
          )}
          {record.status === "STARTED" && record.campaignId && (
            <Button onClick={() => handleComplete(record.campaignId)}>Hoàn thành</Button>
          )}
          {record.status !== "COMPLETED" && record.status !== "CANCELLED" && record.campaignId && (
            <Popconfirm title="Bạn chắc chắn muốn hủy?" onConfirm={() => handleCancel(record.campaignId)}>
              <Button danger>Hủy</Button>
            </Popconfirm>
          )}
          {record.status === "SCHEDULED" && record.campaignId && (
            <Button onClick={() => {
              setRescheduleModal(record.campaignId);
              rescheduleForm.setFieldsValue({
                vaccinationDate: record.vaccinationDate ? dayjs(record.vaccinationDate) : null,
                consentDeadline: record.consentDeadline ? dayjs(record.consentDeadline) : null,
              });
            }}>Đổi lịch</Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2>Quản lý chiến dịch tiêm chủng</h2>
      <Button type="primary" onClick={() => setShowForm(true)} style={{ marginBottom: 16 }}>
        Tạo chiến dịch mới
      </Button>
      <Table
        columns={columns}
        dataSource={campaigns}
        rowKey="campaignId"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      {/* Modal tạo mới chiến dịch */}
      <Modal
        title="Tạo chiến dịch tiêm chủng mới"
        open={showForm}
        onCancel={() => setShowForm(false)}
        onOk={() => form.submit()}
        okText="Tạo mới"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreate}
        >
          <Form.Item
            label="Tên chiến dịch"
            name="campaignName"
            rules={[{ required: true, message: "Nhập tên chiến dịch" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Tên vắc-xin"
            name="vaccineName"
            rules={[{ required: true, message: "Nhập tên vắc-xin" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Mô tả"
            name="description"
            rules={[{ required: true, message: "Nhập mô tả" }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item
            label="Ngày tiêm chủng"
            name="vaccinationDate"
            rules={[{ required: true, message: "Chọn ngày tiêm chủng" }]}
          >
            <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
          </Form.Item>
          <Form.Item
            label="Hạn chót xác nhận phụ huynh"
            name="consentDeadline"
            rules={[{ required: true, message: "Chọn hạn chót xác nhận" }]}
          >
            <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
          </Form.Item>
          <Form.Item
            label="Khối/lớp học sinh được tiêm"
            name="targetClassGroup"
            rules={[{ required: true, message: "Chọn khối/lớp" }]}
          >
            <Select placeholder="Chọn khối/lớp">
              <Option value="Mầm">Mầm</Option>
              <Option value="Chồi">Chồi</Option>
              <Option value="Lá">Lá</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Đơn vị tiêm chủng"
            name="healthcareProviderName"
            rules={[{ required: true, message: "Nhập tên đơn vị tiêm chủng" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal lên lịch */}
      <Modal
        title="Lên lịch chiến dịch"
        open={!!scheduleModal}
        onCancel={() => setScheduleModal(false)}
        onOk={() => scheduleForm.submit()}
        okText="Lên lịch"
      >
        <Form form={scheduleForm} layout="vertical" onFinish={(values) => handleSchedule(scheduleModal, values)}>
          <Form.Item label="Ngày tiêm chủng" name="vaccinationDate" rules={[{ required: true, message: "Chọn ngày tiêm chủng" }]}> <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" /> </Form.Item>
          <Form.Item label="Hạn chót xác nhận phụ huynh" name="consentDeadline" rules={[{ required: true, message: "Chọn hạn chót xác nhận" }]}> <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" /> </Form.Item>
        </Form>
      </Modal>

      {/* Modal đổi lịch */}
      <Modal
        title="Đổi lịch chiến dịch"
        open={!!rescheduleModal}
        onCancel={() => setRescheduleModal(false)}
        onOk={() => rescheduleForm.submit()}
        okText="Đổi lịch"
      >
        <Form form={rescheduleForm} layout="vertical" onFinish={(values) => handleReschedule(rescheduleModal, values)}>
          <Form.Item label="Ngày tiêm chủng" name="vaccinationDate" rules={[{ required: true, message: "Chọn ngày tiêm chủng" }]}> <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" /> </Form.Item>
          <Form.Item label="Hạn chót xác nhận phụ huynh" name="consentDeadline" rules={[{ required: true, message: "Chọn hạn chót xác nhận" }]}> <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" /> </Form.Item>
        </Form>
      </Modal>

      {/* Drawer chi tiết chiến dịch */}
      <Drawer
        title={selectedCampaign ? selectedCampaign.campaignName : "Chi tiết chiến dịch"}
        open={detailDrawer}
        onClose={() => setDetailDrawer(false)}
        width={700}
      >
        {selectedCampaign ? (
          <>
            <Descriptions bordered column={1} size="middle">
              <Descriptions.Item label="Tên chiến dịch">{selectedCampaign.campaignName}</Descriptions.Item>
              <Descriptions.Item label="Vắc-xin">{selectedCampaign.vaccineName}</Descriptions.Item>
              <Descriptions.Item label="Mô tả">{selectedCampaign.description}</Descriptions.Item>
              <Descriptions.Item label="Ngày tiêm">{selectedCampaign.vaccinationDate ? dayjs(selectedCampaign.vaccinationDate).format("DD/MM/YYYY") : "-"}</Descriptions.Item>
              <Descriptions.Item label="Hạn chót xác nhận">{selectedCampaign.consentDeadline ? dayjs(selectedCampaign.consentDeadline).format("DD/MM/YYYY") : "-"}</Descriptions.Item>
              <Descriptions.Item label="Khối/lớp">{
                selectedCampaign.targetClassGroup
                  ? (Array.isArray(selectedCampaign.targetClassGroup)
                      ? selectedCampaign.targetClassGroup.filter(Boolean).join(", ")
                      : selectedCampaign.targetClassGroup)
                  : "-"
              }</Descriptions.Item>
              <Descriptions.Item label="Đơn vị tiêm chủng">{selectedCampaign.healthcareProviderName}</Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color={CAMPAIGN_STATUS[selectedCampaign.status]?.color || "default"}>
                  {CAMPAIGN_STATUS[selectedCampaign.status]?.text || selectedCampaign.status}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
            <Divider />
            <h4>Danh sách phiếu đồng ý</h4>
            <Table
              columns={[
                { title: "Học sinh", dataIndex: "studentFullName", key: "studentFullName" },
                { title: "Lớp", dataIndex: "studentClassName", key: "studentClassName" },
                { title: "Trạng thái", dataIndex: "status", key: "status", render: (status) => <Tag color={status === "AGREED" ? "green" : status === "REJECTED" ? "red" : "default"}>{status}</Tag> },
                { title: "Ghi chú", dataIndex: "notes", key: "notes" },
              ]}
              dataSource={consents.map((item, idx) => ({ ...item, id: item.id ?? `temp-consent-${idx}` }))}
              rowKey="id"
              loading={consentLoading}
              pagination={false}
              size="small"
            />
          </>
        ) : (
          <p>Đang tải...</p>
        )}
      </Drawer>
    </div>
  );
};

export default ManageCampaigns; 