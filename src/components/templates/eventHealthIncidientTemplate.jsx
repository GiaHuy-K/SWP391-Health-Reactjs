import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  Spin,
  Input,
  DatePicker,
  Select,
  Form,
  Row,
  Col,
  Modal,
  InputNumber,
} from "antd";
import dayjs from "dayjs";
import {
  createHealthIncident,
  getHealthIncidents,
} from "../../services/api.healthIncident";
import { getStudent } from "../../services/api.student";
import { getMedicalSupplies } from "../../services/api.medicalSupply";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import HealthIncidentDetailModal from "../healthIncident/healthIncidentDetailModal";

const { TextArea } = Input;
const { RangePicker } = DatePicker;
const { Option } = Select;

const incidentTypes = [
  "Chấn thương nhẹ",
  "Ốm đau",
  "Phản ứng dị ứng",
  "Chấn thương đầu",
  "Sốt",
  "Đau bụng",
  "Khác",
];

const EventHealthIncidentTemplate = () => {
  const [data, setData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({});
  const [form] = Form.useForm();
  const [createForm] = Form.useForm();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [supplies, setSupplies] = useState([]);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedIncidentId, setSelectedIncidentId] = useState(null);
  const fetchIncidents = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        size: pageSize,
        sort: "incidentDateTime,DESC",
        ...filters,
      };
      const res = await getHealthIncidents(params);
      setData(res.content || []);
      setTotalItems(res.totalElements || 0);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách sự cố:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFormData = async () => {
    try {
      const [studentRes, supplyRes] = await Promise.all([
        getStudent(),
        getMedicalSupplies(),
      ]);
      setStudents(Array.isArray(studentRes) ? studentRes : []);
      setSupplies(
        Array.isArray(supplyRes)
          ? supplyRes.filter((s) => s.status === "Sẵn có")
          : []
      );
    } catch (err) {
      console.error("Lỗi khi load dữ liệu dropdown:", err);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, [page, pageSize, filters]);

  const handleSearch = (values) => {
    const { studentName, recordedByName, incidentType, dateRange } = values;
    const newFilters = {};
    if (studentName) newFilters.studentName = studentName;
    if (recordedByName) newFilters.recordedByName = recordedByName;
    if (incidentType) newFilters.incidentType = incidentType;
    if (dateRange && dateRange.length === 2) {
      newFilters.startDate = dayjs(dateRange[0]).format("YYYY-MM-DD");
      newFilters.endDate = dayjs(dateRange[1]).format("YYYY-MM-DD");
    }
    setFilters(newFilters);
    setPage(0);
  };

  const handleReset = () => {
    form.resetFields();
    setFilters({});
    setPage(0);
  };

  const columns = [
    {
      title: "Học sinh",
      dataIndex: "studentName",
      key: "studentName",
      render: (name, record) => `${name} (${record.studentClass})`,
    },
    {
      title: "Thời gian",
      dataIndex: "incidentDateTime",
      key: "incidentDateTime",
      render: (value) =>
        new Date(value)
          .toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })
          .replace(",", " -"),
    },
    {
      title: "Loại sự cố",
      dataIndex: "incidentType",
      key: "incidentType",
    },
    {
      title: "Người ghi nhận",
      dataIndex: "recordedByUserName",
      key: "recordedByUserName",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button type="primary">Sửa</Button>
          <Button type="primary" danger>
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>Danh sách sự cố sức khỏe</h2>
      <div>
        <Button
          type="primary"
          onClick={() => {
            setCreateModalOpen(true);
            fetchFormData();
          }}
        >
          Thêm sự cố sức khỏe
        </Button>
      </div>

      <Modal
        title="Thêm sự cố sức khỏe"
        open={createModalOpen}
        onCancel={() => setCreateModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Form
          form={createForm}
          layout="vertical"
          onFinish={async (values) => {
            const payload = {
              studentId: values.studentId,
              incidentDateTime: values.incidentDateTime.toISOString(),
              incidentType: values.incidentType,
              description: values.description,
              actionTaken: values.actionTaken,
              location: values.location,
              supplyUsages: values.supplyUsages.map((item) => ({
                supplyId: item.supplyId,
                quantityUsed: item.quantityUsed,
                note: item.note,
              })),
            };
            try {
              await createHealthIncident(payload);
              toast.success("Tạo sự cố thành công");
              setCreateModalOpen(false);
              createForm.resetFields();
              fetchIncidents();
            } catch (err) {
              const msg =
                err?.response?.data?.validationErrors?.incidentDateTime?.[0] ||
                err?.response?.data?.message ||
                "Đã xảy ra lỗi";
              toast.error(msg);
              console.error("Lỗi khi tạo sự cố:", err);
            }
          }}
        >
          <Form.Item
            label="Học sinh"
            name="studentId"
            rules={[{ required: true, message: "Vui lòng chọn học sinh" }]}
          >
            <Select placeholder="Chọn học sinh">
              {students.map((s) => (
                <Option key={s.id} value={s.id}>
                  {s.fullName} ({s.className})
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Thời gian sự cố"
            name="incidentDateTime"
            rules={[{ required: true, message: "Chọn thời gian sự cố" }]}
          >
            <DatePicker showTime style={{ width: "100%" }} />
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
            rules={[{ required: true, message: "Nhập hành động xử lý" }]}
          >
            <TextArea rows={2} />
          </Form.Item>

          <Form.Item
            label="Địa điểm"
            name="location"
            rules={[{ required: true, message: "Nhập địa điểm xảy ra sự cố" }]}
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
                      <Select placeholder="Vật tư" style={{ width: 160 }}>
                        {supplies.map((s) => (
                          <Option key={s.supplyId} value={s.supplyId}>
                            {s.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "quantityUsed"]}
                      rules={[{ required: true, message: "Nhập số lượng" }]}
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

      <Form
        layout="vertical"
        onFinish={handleSearch}
        form={form}
        style={{ marginBottom: 24 }}
      >
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item label="Tên học sinh" name="studentName">
              <Input placeholder="Nhập tên học sinh" allowClear />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Người ghi nhận" name="recordedByName">
              <Input placeholder="Nhập tên người ghi nhận" allowClear />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Loại sự cố" name="incidentType">
              <Select allowClear placeholder="Chọn loại sự cố">
                {incidentTypes.map((type) => (
                  <Option key={type} value={type}>
                    {type}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Khoảng thời gian" name="dateRange">
              <RangePicker format="DD/MM/YYYY" />
            </Form.Item>
          </Col>
        </Row>
        <Row justify="end" gutter={16}>
          <Col>
            <Button type="primary" htmlType="submit">
              Tìm kiếm
            </Button>
          </Col>
          <Col>
            <Button onClick={handleReset}>Đặt lại</Button>
          </Col>
        </Row>
      </Form>

      <Spin spinning={loading}>
        <Table
          rowKey="incidentId"
          columns={columns}
          dataSource={data}
          pagination={{
            current: page + 1,
            total: totalItems,
            pageSize,
            showSizeChanger: true,
            pageSizeOptions: ["5", "10"],
            onChange: (p, ps) => {
              setPage(p - 1);
              setPageSize(ps);
            },
          }}
          onRow={(record) => ({
            onClick: () => {
              console.log("🖱️ Dòng được click:", record);
              console.log("🆔 incidentId =", record.incidentId);
              setSelectedIncidentId(record.incidentId);
              setDetailModalOpen(true);
            },
            style: { cursor: "pointer" },
          })}
        />
      </Spin>
      <HealthIncidentDetailModal
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        incidentId={selectedIncidentId}
      />
    </div>
  );
};

export default EventHealthIncidentTemplate;
